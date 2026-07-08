import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Lista de emails autorizados como admin, definida por variable de entorno
// (ADMIN_EMAILS, separada por comas). Un usuario autenticado solo es admin
// si su email está en esta lista.
function obtenerEmailsAdmin() {
  return (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

// Verifica del lado del servidor que la petición traiga un JWT de Supabase
// válido (header Authorization: Bearer <token>) y que el email del usuario
// esté en la allowlist de ADMIN_EMAILS. Devuelve { user } si todo está bien,
// o { error: { status, message } } que el handler traduce a la respuesta HTTP.
//
// No reutilizamos el cliente singleton de lib/supabase.js (pensado para
// mantener una sesión persistida en el navegador): acá creamos un cliente
// nuevo por request, sin persistir sesión, y validamos el token recibido con
// getUser(token), que lo verifica de verdad contra Supabase. getSession() no
// sirve en el servidor porque no valida el JWT, solo leería lo que ya venga
// en la petición sin confirmarlo contra Supabase.
export async function requireAdmin(request) {
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';

  if (!token) {
    return { error: { status: 401, message: 'No autenticado.' } };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Faltan las variables NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY.');
    return { error: { status: 500, message: 'Configuración de Supabase incompleta.' } };
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false }
  });

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data?.user) {
    return { error: { status: 401, message: 'Sesión inválida o expirada.' } };
  }

  const email = data.user.email?.toLowerCase();
  const emailsAdmin = obtenerEmailsAdmin();

  if (!email || !emailsAdmin.includes(email)) {
    return { error: { status: 403, message: 'No tiene permisos de administrador.' } };
  }

  return { user: data.user };
}

// Traduce el error devuelto por requireAdmin en una respuesta HTTP.
export function respuestaNoAutorizado(error) {
  return NextResponse.json(
    { success: false, error: error.message },
    { status: error.status }
  );
}
