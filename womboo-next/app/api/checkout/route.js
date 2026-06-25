import MercadoPagoConfig, { Preference } from 'mercadopago';

// Creamos el cliente de Mercado Pago con el Access Token configurado en las variables de entorno.
const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });

export async function POST(request) {
  try {
    // Leemos el cuerpo de la petición enviada desde el carrito.
    const body = await request.json();
    const items = body.items || [];

    // Validamos que haya productos para crear una preferencia.
    if (!items.length) {
      return Response.json(
        { message: 'El carrito está vacío.' },
        { status: 400 }
      );
    }

    // Convertimos los productos al formato que espera Mercado Pago.
    const productos = items.map((item) => ({
      title: item.nombre,
      quantity: Number(item.cantidad) || 1,
      unit_price: Number(item.precio) || 0,
      currency_id: 'ARS',
    }));

    // Creamos la preferencia de pago con el listado de productos.
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const webhookUrl = `${appUrl}/api/webhook`;

    // Creamos la preferencia de pago con el listado de productos y la URL del webhook.
    const preference = new Preference(client);
    const resultado = await preference.create({
      body: {
        items: productos,
        notification_url: webhookUrl,
        back_urls: {
          success: `${appUrl}/checkout/success`,
          failure: `${appUrl}/checkout/failure`,
          pending: `${appUrl}/checkout/pending`,
        },
      },
    });

    // Devolvemos la URL de pago generada por Mercado Pago.
    return Response.json({
      init_point: resultado.init_point,
    });
  } catch (error) {
    console.error('Error al crear la preferencia de Mercado Pago:', error);

    return Response.json(
      { message: 'No se pudo crear la preferencia de pago.' },
      { status: 500 }
    );
  }
}
