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