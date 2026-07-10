# Womboo — Tienda Streetwear (Next.js)

Aplicación web de e-commerce de **Womboo**, marca de ropa streetwear. Este proyecto reemplaza al sitio estático original (`womboo/`) por una tienda completa construida con Next.js: catálogo de productos, carrito de compras, checkout con MercadoPago y un panel de administración.

## Stack tecnológico

- [Next.js 16](https://nextjs.org) (App Router)
- [React 19](https://react.dev)
- TypeScript
- [Tailwind CSS 4](https://tailwindcss.com)
- [Supabase](https://supabase.com) (`@supabase/supabase-js`) como backend y base de datos
- [MercadoPago](https://www.mercadopago.com.ar/developers) como pasarela de pagos
- Fuentes [Inter](https://fonts.google.com/specimen/Inter) y [Space Mono](https://fonts.google.com/specimen/Space+Mono), cargadas vía `next/font/google`

## Requisitos previos

- Node.js 20 o superior
- npm

## Instalación y puesta en marcha

1. Instalar dependencias:

   ```bash
   npm install
   ```

2. Crear un archivo `.env.local` en la raíz de `womboo-next/` con las variables de entorno detalladas más abajo.

3. Levantar el servidor de desarrollo:

   ```bash
   npm run dev
   ```

4. Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

## Scripts disponibles

| Script          | Descripción                                              |
| --------------- | --------------------------------------------------------- |
| `npm run dev`   | Levanta el servidor de desarrollo con recarga en caliente. |
| `npm run build` | Genera el build de producción.                            |
| `npm run start` | Sirve el build de producción ya generado.                 |
| `npm run lint`  | Corre ESLint sobre el proyecto.                            |

## Variables de entorno

| Variable                        | Descripción                                                                 |
| -------------------------------- | ---------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`       | URL del proyecto de Supabase.                                                |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`  | Clave anónima (pública) del proyecto de Supabase.                            |
| `NEXT_PUBLIC_APP_URL`            | URL base de la aplicación (usada para armar las URLs de retorno de MercadoPago). |
| `MP_ACCESS_TOKEN`                | Access token de MercadoPago. **Es secreto: nunca debe commitearse.**         |
| `ADMIN_EMAILS`                   | Lista de emails autorizados como admin, separados por comas (ej: `a@womboo.com,b@womboo.com`). Un usuario autenticado con Supabase solo puede usar el panel `/admin` si su email está en esta lista. Se valida del lado del servidor en cada request a `/api/admin/*`. |
| `SUPABASE_SERVICE_ROLE_KEY`      | Clave de service role de Supabase, usada solo en el servidor (`lib/supabaseAdmin.js`) para las operaciones privilegiadas (panel de admin, webhook de Mercado Pago) que necesitan saltear Row Level Security. **Es secreta y da acceso total a la base: nunca debe exponerse al cliente ni commitearse.** |

Podés usar `.env.example` como plantilla, completando los valores reales en tu `.env.local` (que no se sube al repositorio).

## Estructura del proyecto

### Páginas (`app/`)

- `/` — Home.
- `/coleccion` — Catálogo de productos.
- `/carrito` — Carrito de compras.
- `/checkout/success`, `/checkout/failure`, `/checkout/pending` — Resultados del pago con MercadoPago.
- `/admin` — Panel de administración (protegido con Supabase Auth y la allowlist `ADMIN_EMAILS`, validada del lado del servidor), con subrutas `/admin/login`, `/admin/mensajes` y `/admin/ventas`.

El entrypoint de la home es `app/page.jsx`.

### API (`app/api/`)

- `productos` — Listado de productos.
- `checkout` — Creación de la preferencia de pago en MercadoPago.
- `contacto` — Envío del formulario de contacto.
- `webhook` — Webhook de notificaciones de MercadoPago (`app/api/webhook/route.js`). Al recibir una notificación, no confía en los datos del POST entrante: vuelve a consultar el pago real a Mercado Pago por su `payment_id` con `paymentClient.get()` (usando `MP_ACCESS_TOKEN`) y usa el estado que devuelve esa consulta para actualizar la orden en Supabase. De esta forma, un POST falso no puede inventar un pago aprobado que no existe, porque la confirmación siempre se verifica contra Mercado Pago.
- `admin/productos`, `admin/mensajes`, `admin/ventas` — Endpoints del panel de administración.

## Despliegue

El proyecto está desplegado en [Vercel](https://vercel.com). Para desplegar tu propia instancia, configurá en el dashboard de Vercel (Settings → Environment Variables) las mismas variables listadas en la sección [Variables de entorno](#variables-de-entorno).
