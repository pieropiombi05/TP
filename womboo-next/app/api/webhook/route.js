import MercadoPagoConfig, { Payment } from 'mercadopago';
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

export async function POST(request) {
  try {
    // El data.id viene en la query string de la notificación.
    const dataId = request.nextUrl.searchParams.get('data.id');

    // Ignoramos ordenadamente las notificaciones que no correspondan a un pago
    // (ej. merchant_order) para no procesarlas ni generar reintentos innecesarios.
    const tipoNotificacion = request.nextUrl.searchParams.get('type');
    if (tipoNotificacion !== 'payment' || !dataId) {
      return Response.json(
        { message: 'Notificación ignorada: no corresponde a un pago.', accepted: true },
        { status: 200 }
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
      // Reflejamos el estado real de Mercado Pago aunque no sea 'approved'
      // (pending, rejected, in_process, cancelled, etc.).
      if (ordenExistente.estado !== paymentDetail.status) {
        const yaEstabaAprobada = ordenExistente.estado === 'approved';

        await supabase
          .from('ordenes')
          .update({
            estado: paymentDetail.status,
            total: ordenParaGuardar.total,
            productos,
            email_comprador: ordenParaGuardar.email_comprador,
          })
          .eq('id', ordenExistente.id);

        // Descontamos stock únicamente en la transición hacia 'approved',
        // para no hacerlo dos veces ni en pending/rejected.
        if (!yaEstabaAprobada && esAprobado) {
          await descontarStock(supabase, productos);
        }
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
