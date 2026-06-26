'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function VentasPage() {
  // Estado para guardar las órdenes recuperadas desde Supabase.
  const [ordenes, setOrdenes] = useState([]);

  // Estado para mostrar el estado de carga inicial.
  const [cargando, setCargando] = useState(true);

  // Estado para visualizar mensajes de error si la consulta falla.
  const [error, setError] = useState('');

  // Al montar el componente, pedimos las órdenes desde Supabase.
  useEffect(() => {
    const cargarOrdenes = async () => {
      try {
        setCargando(true);
        const respuesta = await fetch('/api/admin/ventas');

        if (!respuesta.ok) {
          throw new Error('No se pudieron cargar las ventas.');
        }

        const datos = await respuesta.json();
        setOrdenes(datos.data || []);
        setError('');
      } catch (err) {
        setError(err.message);
        console.error('Error al cargar ventas:', err);
      } finally {
        setCargando(false);
      }
    };

    cargarOrdenes();
  }, []);

  return (
    <main style={styles.page}>
      <section style={styles.panel}>
        <p style={styles.eyebrow}>03 / VENTAS</p>
        <div style={styles.headerRow}>
          <div>
            <h1 style={styles.title}>Ventas</h1>
            <p style={styles.subtitle}>Consulta las órdenes registradas en Supabase.</p>
          </div>
          <Link href="/admin" style={styles.linkButton}>
            Volver al admin
          </Link>
        </div>

        {error ? <p style={styles.error}>{error}</p> : null}

        {cargando ? (
          <p>Cargando ventas...</p>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Fecha</th>
                  <th style={styles.th}>Estado</th>
                  <th style={styles.th}>Total</th>
                  <th style={styles.th}>Productos</th>
                  <th style={styles.th}>Email</th>
                </tr>
              </thead>
              <tbody>
                {ordenes.map((orden) => (
                  <tr key={orden.id}>
                    <td style={styles.td}>{new Date(orden.created_at).toLocaleString('es-AR')}</td>
                    <td style={styles.td}>{orden.estado}</td>
                    <td style={styles.td}>${Number(orden.total || 0).toFixed(2)}</td>
                    <td style={styles.td}>
                      {Array.isArray(orden.productos)
                        ? orden.productos.map((producto) => (
                            <div key={`${orden.id}-${producto.title}-${producto.quantity}`}>
                              {producto.title} × {producto.quantity}
                            </div>
                          ))
                        : 'Sin productos'}
                    </td>
                    <td style={styles.td}>{orden.email_comprador || 'Sin email'}</td>
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
    verticalAlign: 'top'
  }
};
