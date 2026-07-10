'use client';

import { useEffect, useRef } from 'react';
import styles from './Reveal.module.css';

// Salvavidas: si por lo que sea el observer nunca dispara, revelamos igual.
const SAFETY_TIMEOUT_MS = 2000;

export default function Reveal({ children }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const prefersReducedMotion = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    // Sin animación: el contenido queda visible directamente, de una.
    if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
      return undefined;
    }

    // Recién ahora, con JS corriendo y el observer listo, ocultamos para animar.
    el.classList.add(styles.hidden);

    function reveal() {
      el.classList.remove(styles.hidden);
      observer.disconnect();
      window.clearTimeout(safetyTimer);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) reveal();
      },
      { threshold: 0.05, rootMargin: '0px 0px -15% 0px' }
    );

    observer.observe(el);

    const safetyTimer = window.setTimeout(reveal, SAFETY_TIMEOUT_MS);

    return () => {
      observer.disconnect();
      window.clearTimeout(safetyTimer);
    };
  }, []);

  return (
    <div ref={ref} className={styles.reveal}>
      {children}
    </div>
  );
}
