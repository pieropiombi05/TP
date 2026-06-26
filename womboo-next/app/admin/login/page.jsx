"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseClient } from '../../../lib/supabase';

// Página de login para el admin. Usa Supabase Auth (signInWithPassword).
export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  // Al enviar el formulario intentamos iniciar sesión con Supabase.
  const manejarSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError('');

    try {
      const supabase = getSupabaseClient();

      // signInWithPassword es el método de Supabase JS v2 para login con email+password.
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        throw authError;
      }

      // Si la autenticación fue exitosa, redirigimos al panel admin.
      if (data?.session) {
        router.replace('/admin');
      } else {
        setError('No se pudo iniciar sesión. Verifique sus credenciales.');
      }
    } catch (err) {
      setError(err?.message || 'Error al iniciar sesión');
      console.error('Login error:', err);
    } finally {
      setCargando(false);
    }
  };

  return (
    <main style={{ minHeight: '100vh', padding: 40 }}>
      <section style={{ maxWidth: 480, margin: '0 auto' }}>
        <h1>Iniciar sesión (Admin)</h1>
        <p>Ingrese su email y contraseña para acceder al panel de administración.</p>

        <form onSubmit={manejarSubmit} style={{ display: 'grid', gap: 12 }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ padding: 10, borderRadius: 8 }}
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ padding: 10, borderRadius: 8 }}
          />

          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" disabled={cargando} style={{ padding: '10px 14px' }}>
              {cargando ? 'Entrando…' : 'Entrar'}
            </button>
            {/* Botón para volver a la página anterior. Si no hay historial, usar router.replace('/') */}
            <button
              type="button"
              onClick={() => {
                try {
                  router.back();
                } catch (err) {
                  router.replace('/');
                }
              }}
              style={{ padding: '10px 14px' }}
            >
              Volver
            </button>
          </div>
        </form>

        {error ? <p style={{ color: 'crimson', marginTop: 12 }}>{error}</p> : null}
      </section>
    </main>
  );
}
