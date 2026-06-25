'use client';

import Link from 'next/link';

export default function FailurePage() {
  return (
    <div style={{ maxWidth: '720px', margin: '4rem auto', padding: '2rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>No se pudo completar el pago</h1>
      <p style={{ fontSize: '1rem', lineHeight: 1.6 }}>
        Ocurrió un problema al procesar tu pago. Puedes intentar nuevamente desde el carrito.
      </p>
      <Link href="/carrito" style={{ display: 'inline-block', marginTop: '1.5rem' }}>
        Volver al carrito
      </Link>
    </div>
  );
}
