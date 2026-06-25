'use client';

import Link from 'next/link';

export default function SuccessPage() {
  return (
    <div style={{ maxWidth: '720px', margin: '4rem auto', padding: '2rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>¡Pago aprobado!</h1>
      <p style={{ fontSize: '1rem', lineHeight: 1.6 }}>
        Tu compra se completó correctamente. Gracias por elegir Womboo.
      </p>
      <Link href="/" style={{ display: 'inline-block', marginTop: '1.5rem' }}>
        Volver a la colección
      </Link>
    </div>
  );
}
