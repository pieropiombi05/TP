'use client';

import Link from 'next/link';

export default function PendingPage() {
  return (
    <div style={{ maxWidth: '720px', margin: '4rem auto', padding: '2rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Pago pendiente</h1>
      <p style={{ fontSize: '1rem', lineHeight: 1.6 }}>
        Tu pago está siendo procesado. Te avisaremos cuando se confirme o si necesita más información.
      </p>
      <Link href="/" style={{ display: 'inline-block', marginTop: '1.5rem' }}>
        Volver a la colección
      </Link>
    </div>
  );
}
