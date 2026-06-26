'use client';

import Link from 'next/link';

export default function PendingPage() {
  return (
    <div style={{ maxWidth: '720px', margin: '4rem auto', padding: '2rem', textAlign: 'center', background: 'var(--surface)', border: '1px solid var(--border-color)', borderRadius: '20px', boxShadow: '0 18px 40px var(--shadow-soft)' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Pago pendiente</h1>
      <p style={{ fontSize: '1rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
        Tu pago está siendo procesado. Te avisaremos cuando se confirme o si necesita más información.
      </p>
      <Link href="/" style={{ display: 'inline-block', marginTop: '1.5rem', color: 'var(--accent)' }}>
        Volver a la colección
      </Link>
    </div>
  );
}
