import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

let cachedClient = null;

function leerVariablesDeEntorno() {
  const env = { ...process.env };

  // Si Next.js ya cargó las variables, las usamos directamente.
  if (env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return env;
  }

  // Fallback: leemos el archivo .env.local manualmente desde la carpeta del proyecto.
  const posiblesRutas = [
    path.resolve(process.cwd(), '.env.local'),
    path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '.env.local'),
    path.resolve(path.dirname(fileURLToPath(import.meta.url)), '.env.local')
  ];

  for (const envPath of posiblesRutas) {
    if (!fs.existsSync(envPath)) continue;

    const contenido = fs.readFileSync(envPath, 'utf8');

    for (const linea of contenido.split(/\r?\n/)) {
      const match = linea.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)?\s*$/);
      if (!match) continue;

      const [, key, value] = match;
      const valor = value ? value.replace(/^['"]|['"]$/g, '') : '';

      if (!(key in env)) {
        env[key] = valor;
      }
    }

    break;
  }

  return env;
}

// Devuelve una única instancia del cliente de Supabase, creando it solo cuando se necesita.
export function getSupabaseClient() {
  const env = leerVariablesDeEntorno();
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Faltan las variables NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY.');
  }

  if (!cachedClient) {
    cachedClient = createClient(supabaseUrl, supabaseKey);
  }

  return cachedClient;
}