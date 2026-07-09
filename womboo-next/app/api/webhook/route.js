import MercadoPagoConfig, { Payment, WebhookSignatureValidator } from 'mercadopago';
import { getSupabaseAdmin } from '../../../lib/supabaseAdmin.js';

// Fuerza esta ruta a responder con datos frescos en cada petición.
export const dynamic = 'force-dynamic';

// Creamos el cliente de Mercado Pago reutilizando el Access Token del entorno.
const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });

// Instanciamos el cliente de pagos de Mercado Pago para consultar el detalle de un pago.
const paymentClient = new Payment(client);

// Normaliza los productos que vienen en la notificación para guardarlos en la tabla ordenes.
function normalizarProductos(paymentDetail) {
  return (paymentDetail.additional_info?.items || paymentDetail.items || []).map((item) => ({
    id: item.id || null,
    title: item.title || 'Producto sin nombre',
    quantity: Number(item.quantity) || 1,
    unit_price: Number(item.unit_price) || 0,
  }));
}

// Descuenta el stock de cada producto vendido cuando el pago queda aprobado.
async function descontarStock(supabase, productosVendidos) {
  for (const productoVendido of productosVendidos) {
    const idProducto = Number(productoVendido.id);
    const cantidad = Number(productoVendido.quantity) || 0;

    // Si no hay identificador de producto o cantidad, se salta este item.
    if (!Number.isFinite(idProducto) || cantidad <= 0) {
      continue;
    }

    const { data: productoActual, error: errorConsulta } = await supabase
      .from('productos')
      .select('id, stock')
      .eq('id', idProducto)
      .maybeSingle();

    if (errorConsulta) {
      throw errorConsulta;
    }

    if (!productoActual) {
      continue;
    }

    const stockActual = Number(productoActual.stock) || 0;
    const nuevoStock = Math.max(0, stockActual - cantidad);

    const { error: errorActualizacion } = await supabase
      .from('productos')
      .update({ stock: nuevoStock })
      .eq('id', idProducto);

    if (errorActualizacion) {
      throw errorActualizacion;
    }
  }
}

// Verifica que la notificación venga realmente de Mercado Pago validando la
// firma del header x-signature (HMAC-SHA256 sobre "id:<data.id>;request-id:<x-request-id>;ts:<ts>;"
// con el secret de la integración, comparado en tiempo constante). Usamos el
// validador oficial del SDK (mercadopago -> WebhookSignatureValidator), que
// implementa exactamente ese esquema.
function verificarFirmaWebhook(request, dataId) {
  const secret = process.env.MP_WEBHOOK_SECRET;

  if (!secret) {
    // Si no podemos validar la firma, fallamos cerrado: no procesamos la notificación.
    console.error(
      'MP_WEBHOOK_SECRET no está configurado: se rechaza la notificación del webhook por no poder validar su firma.'
    );
    return false;
  }

  try {
    WebhookSignatureValidator.validate({
      xSignature: request.headers.get('x-signature'),
      xRequestId: request.headers.get('x-request-id'),
      dataId,
      secret
    });
    return true;
  } catch (error) {
    console.error('Firma de webhook de Mercado Pago inválida:', error?.message || error);
    return false;
  }
}

export async function POST(request) {
  try {
    // TEMPORAL: logging de diagnóstico, quitar después
    console.log('WEBHOOK_DEBUG', {
      url: request.url,
      dataId: request.nextUrl.searchParams.get('data.id'),
      type: request.nextUrl.searchParams.get('type'),
      xSignature: request.headers.get('x-signature'),
      xRequestId: request.headers.get('x-request-id'),
    });

    // El data.id que Mercado Pago firma es el de la query string, no el del body.
    const dataId = request.nextUrl.searchParams.get('data.id');

    if (!verificarFirmaWebhook(request, dataId)) {
      return Response.json(
        { message: 'Firma de la notificación inválida o ausente.' },
        { status: 401 }
      );
    }

    // Leemos el cuerpo de la notificación enviada por Mercado Pago.
    // El payload suele incluir un campo data.id con el payment_id a consultar.
    const body = await request.json().catch(() => ({}));
    const paymentId = body?.data?.id;

    // Si la notificación no trae un payment_id, respondemos con error de entrada.
    if (!paymentId) {
      return Response.json(
        { message: 'No se recibió el identificador del pago en la notificación.' },
        { status: 400 }
      );
    }

    // Consultamos el detalle completo del pago usando el SDK de Mercado Pago.
    // Esto nos devuelve el estado actual, el total pagado y el email del comprador.
    const paymentDetail = await paymentClient.get({ id: paymentId });

    // Normalizamos los productos para guardarlos en Supabase.
    const productos = normalizarProductos(paymentDetail);
    const esAprobado = paymentDetail.status === 'approved';

    // Armamos el payload que vamos a persistir en la tabla ordenes.
    const ordenParaGuardar = {
      payment_id: String(paymentId),
      estado: paymentDetail.status,
      total: Number(paymentDetail.transaction_amount ?? paymentDetail.total_amount ?? 0),
      productos,
      email_comprador: paymentDetail.payer?.email || paymentDetail.additional_info?.payer?.email || '',
    };

    // Obtenemos el cliente de Supabase y verificamos si la orden ya existe.
    // Esto evita duplicados si Mercado Pago reenvía la misma notificación.
    const supabase = getSupabaseAdmin();
    const { data: ordenExistente, error: errorConsulta } = await supabase
      .from('ordenes')
      .select('*')
      .eq('payment_id', ordenParaGuardar.payment_id)
      .maybeSingle();

    if (errorConsulta) {
      throw errorConsulta;
    }

    if (ordenExistente) {
      // Si la orden ya existía y estaba pendiente, la actualizamos al estado final y, si corresponde, descontamos stock.
      if (ordenExistente.estado !== 'approved' && esAprobado) {
        await supabase
          .from('ordenes')
          .update({
            estado: paymentDetail.status,
            total: ordenParaGuardar.total,
            productos,
            email_comprador: ordenParaGuardar.email_comprador,
          })
          .eq('id', ordenExistente.id);

        await descontarStock(supabase, productos);
      }

      return Response.json(
        { message: 'La orden ya estaba registrada.', accepted: true },
        { status: 200 }
      );
    }

    // Insertamos la orden en Supabase.
    const { error } = await supabase.from('ordenes').insert([ordenParaGuardar]);

    if (error) {
      throw error;
    }

    // Si el pago quedó aprobado, descontamos el stock de cada producto comprado.
    if (esAprobado) {
      await descontarStock(supabase, productos);
    }

    // Respondemos con 200 para indicar que la notificación fue procesada correctamente.
    return Response.json(
      { message: 'Orden guardada correctamente.', accepted: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al procesar el webhook de Mercado Pago:', error);

    return Response.json(
      { message: 'No se pudo procesar la notificación del webhook.' },
      { status: 500 }
    );
  }
}
