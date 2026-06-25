import MercadoPagoConfig, { Payment } from 'mercadopago';
import { getSupabaseClient } from '../../../lib/supabase.js';

// Fuerza esta ruta a responder con datos frescos en cada petición.
export const dynamic = 'force-dynamic';

// Creamos el cliente de Mercado Pago reutilizando el Access Token del entorno.
const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });

// Instanciamos el cliente de pagos de Mercado Pago para consultar el detalle de un pago.
const paymentClient = new Payment(client);

export async function POST(request) {
  try {
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
    // Mercado Pago devuelve los items en additional_info.items cuando vienen desde una preferencia.
    const productos = (paymentDetail.additional_info?.items || []).map((item) => ({
      title: item.title || 'Producto sin nombre',
      quantity: Number(item.quantity) || 1,
      unit_price: Number(item.unit_price) || 0,
    }));

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
    const supabase = getSupabaseClient();
    const { data: ordenExistente } = await supabase
      .from('ordenes')
      .select('payment_id')
      .eq('payment_id', ordenParaGuardar.payment_id)
      .maybeSingle();

    if (ordenExistente) {
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
