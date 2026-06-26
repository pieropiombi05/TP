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
    <div style={{ maxWidth: '720px', margin: '4rem auto', padding: '2rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>¡Pago aprobado!</h1>
      <p style={{ fontSize: '1rem', lineHeight: 1.6 }}>
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
          border: none;
          border-radius: 999px;
          background: #111;
          color: #fff;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s ease, transform 0.2s ease;
        }

        .btn-volver:hover {
          background: #222;
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
}
