import { createClient } from '@supabase/supabase-js';

// Implementación simplificada y segura tanto para cliente como para servidor.
// Evita importaciones de módulos de Node (fs/path) que rompen el bundle en cliente.

let cachedClient = null;

// Devuelve una única instancia del cliente de Supabase.
// Usa las variables de entorno públicas: NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY
// Estas variables deben estar definidas en el entorno de Next.js (por ejemplo en .env.local).
export function getSupabaseClient() {
  if (cachedClient) return cachedClient;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Faltan las variables NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY.');
  }

  // Habilitamos `persistSession` para que Supabase guarde la sesión en localStorage
  // cuando se usa desde el navegador. Esto facilita que la sesión permanezca activa
  // entre recargas y que podamos verificarla desde componentes cliente.
  cachedClient = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true
    }
  });

  return cachedClient;
}

// Devuelve el access token de la sesión activa (o null si no hay sesión),
// para adjuntarlo como "Authorization: Bearer <token>" en las llamadas a la
// API de administración. La verificación real de ese token ocurre en el
// servidor (lib/auth.js), acá solo lo leemos de la sesión del cliente.
export async function obtenerAccessToken() {
  const supabase = getSupabaseClient();
  const { data } = await supabase.auth.getSession();
  return data?.session?.access_token ?? null;
}

export const COOKIE_INDICIO_SESION = 'sb-session-hint';

// Cookie liviana y sin datos sensibles (no es el token) que le indica al
// middleware que hay una sesión de Supabase activa. La sesión real vive en
// localStorage, que el middleware no puede leer; esta cookie es solo una
// señal para evitar el flash del panel a quien claramente no inició sesión.
// La verificación real sigue viviendo en requireAdmin (lib/auth.js).
export function marcarIndicioSesion() {
  if (typeof document === 'undefined') return;
  document.cookie = `${COOKIE_INDICIO_SESION}=1; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`;
}

export function limpiarIndicioSesion() {
  if (typeof document === 'undefined') return;
  document.cookie = `${COOKIE_INDICIO_SESION}=; path=/; max-age=0; samesite=lax`;
}