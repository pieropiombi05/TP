import { createClient } from '@supabase/supabase-js';

// SOLO PARA EL SERVIDOR. Este cliente usa la service role key, que saltea
// Row Level Security y tiene acceso total a la base. Nunca debe importarse
// desde un componente "use client" ni desde ningún código que pueda terminar
// en el bundle del navegador: expondría esa clave al público. Usar
// exclusivamente en route handlers para operaciones privilegiadas (panel de
// admin, webhook de Mercado Pago). Las rutas públicas siguen usando
// getSupabaseClient() (lib/supabase.js), con el anon key y sujeto a RLS.

let cachedAdminClient = null;

export function getSupabaseAdmin() {
  if (cachedAdminClient) return cachedAdminClient;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      'Faltan las variables NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY. ' +
      'getSupabaseAdmin() solo debe usarse en el servidor, con la service role key configurada en el entorno.'
    );
  }

  // persistSession y autoRefreshToken en false porque este cliente no
  // representa a un usuario navegando: es un cliente de servidor de uso
  // puntual por request, sin sesión que mantener viva.
  cachedAdminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });

  return cachedAdminClient;
}
