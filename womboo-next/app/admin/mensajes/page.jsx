'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function MensajesPage() {
  // Estado para guardar los mensajes recuperados desde Supabase.
  const [mensajes, setMensajes] = useState([]);

  // Estado para indicar si la carga inicial sigue en progreso.
  const [cargando, setCargando] = useState(true);

  // Estado para mostrar errores si falla la consulta.
  const [error, setError] = useState('');

  // Al montar el componente, solicitamos los mensajes desde la API correspondiente.
  useEffect(() => {
    const cargarMensajes = async () => {
      try {
        setCargando(true);
        const respuesta = await fetch('/api/admin/mensajes');

        if (!respuesta.ok) {
          throw new Error('No se pudieron cargar los mensajes.');
        }

        const datos = await respuesta.json();
        setMensajes(datos.data || []);
        setError('');
      } catch (err) {
        setError(err.message);
        console.error('Error al cargar mensajes:', err);
      } finally {
        setCargando(false);
      }
    };

    void cargarMensajes();
  }, []);

  return (
    <main style={styles.page}>
      <section style={styles.panel}>
        <p style={styles.eyebrow}>02 / MENSAJES</p>
        <div style={styles.headerRow}>
          <div>
            <h1 style={styles.title}>Mensajes de contacto</h1>
            <p style={styles.subtitle}>Revisa los mensajes recibidos desde el formulario de contacto.</p>
          </div>
          <Link href="/admin" style={styles.linkButton}>
            Volver al admin
          </Link>
        </div>

        {error ? <p style={styles.error}>{error}</p> : null}

        {cargando ? (
          <p>Cargando mensajes...</p>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Fecha</th>
                  <th style={styles.th}>Nombre</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Mensaje</th>
                </tr>
              </thead>
              <tbody>
                {mensajes.map((mensaje) => (
                  <tr key={mensaje.id}>
                    <td style={styles.td}>{new Date(mensaje.created_at).toLocaleString('es-AR')}</td>
                    <td style={styles.td}>{mensaje.nombre || 'Sin nombre'}</td>
                    <td style={styles.td}>{mensaje.email || 'Sin email'}</td>
                    <td style={styles.td}>{mensaje.mensaje || 'Sin mensaje'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    padding: '40px 20px',
    background: 'var(--bg-primary)',
    color: 'var(--text-primary)'
  },
  panel: {
    maxWidth: '1400px',
    margin: '0 auto',
    background: 'var(--surface)',
    border: '1px solid var(--border-color)',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 18px 40px var(--shadow-soft)'
  },
  eyebrow: {
    fontFamily: 'Space Mono, monospace',
    fontSize: '0.8rem',
    letterSpacing: '0.24em',
    textTransform: 'uppercase',
    color: 'var(--text-secondary)',
    marginBottom: '12px'
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '24px',
    flexWrap: 'wrap'
  },
  title: {
    fontSize: '2rem',
    marginBottom: '8px'
  },
  subtitle: {
    color: 'var(--text-secondary)'
  },
  linkButton: {
    display: 'inline-block',
    padding: '10px 14px',
    borderRadius: '999px',
    background: 'var(--accent)',
    color: 'var(--bg-primary)',
    textDecoration: 'none',
    fontWeight: 600
  },
  error: {
    color: 'var(--error)',
    marginBottom: '16px'
  },
  tableWrapper: {
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  th: {
    textAlign: 'left',
    padding: '10px',
    borderBottom: '1px solid var(--section-divider)',
    color: 'var(--text-secondary)'
  },
  td: {
    padding: '10px',
    borderBottom: '1px solid var(--section-divider)',
    verticalAlign: 'top',
    whiteSpace: 'pre-wrap'
  }
};
