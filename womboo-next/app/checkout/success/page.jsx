'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useCarrito } from '../../../context/CarritoContext';

export default function SuccessPage() {
  const router = useRouter();
  const { vaciarCarrito } = useCarrito();

  // Cuando se monta esta pantalla, vaciamos el carrito del contexto para que
  // el usuario no vea productos de una compra anterior en la siguiente sesión.
  useEffect(() => {
    vaciarCarrito();
  }, [vaciarCarrito]);

  const handleVolver = () => {
    router.push('/');
  };

  return (
    <div style={{ maxWidth: '720px', margin: '4rem auto', padding: '2rem', textAlign: 'center', background: 'var(--surface)', border: '1px solid var(--border-color)', borderRadius: '20px', boxShadow: '0 18px 40px var(--shadow-soft)' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>¡Pago aprobado!</h1>
      <p style={{ fontSize: '1rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
        Tu compra se completó correctamente. Gracias por elegir Womboo.
      </p>
      <button
        type="button"
        onClick={handleVolver}
        className="btn-volver"
      >
        Volver a la colección
      </button>

      <style jsx>{`
        .btn-volver {
          display: inline-block;
          margin-top: 1.5rem;
          padding: 0.9rem 1.4rem;
          border: 1px solid var(--accent);
          border-radius: 999px;
          background: var(--accent);
          color: var(--bg-primary);
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s ease, background-color 0.2s ease;
        }

        .btn-volver:hover {
          transform: translateY(-1px);
          background: var(--accent);
        }
      `}</style>
    </div>
  );
}
