'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './AnimatedO.module.css';

export default function AnimatedO() {
  // Ref al contenedor de la letra para saber dónde está en pantalla.
  const ojoRef = useRef(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);
  // Desplazamiento de la pupila en em (relativo al tamaño de la letra).
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [usaCursor, setUsaCursor] = useState(true);

  // En pantallas táctiles no hay cursor: la pupila queda centrada.
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const mq = window.matchMedia('(pointer: fine)');
    const actualizar = () => {
      setUsaCursor(mq.matches);
      if (!mq.matches) setOffset({ x: 0, y: 0 });
    };
    actualizar();
    mq.addEventListener('change', actualizar);
    return () => mq.removeEventListener('change', actualizar);
  }, []);

  // La pupila sigue el cursor. Calculamos el ángulo entre el centro de la
  // letra y el cursor, y desplazamos la pupila en esa dirección con un tope.
  useEffect(() => {
    if (typeof window === 'undefined' || !usaCursor) return undefined;

    const mover = () => {
      const el = ojoRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const centroX = rect.left + rect.width / 2;
      const centroY = rect.top + rect.height / 2;
      const dx = pointerRef.current.x - centroX;
      const dy = pointerRef.current.y - centroY;
      const angulo = Math.atan2(dy, dx);
      const distancia = Math.hypot(dx, dy);
      // factor: de 0 (cursor encima) a 1 (cursor lejos), saturado.
      const factor = Math.min(distancia / 140, 1);
      // Recorrido máximo de la pupila, en em. Pequeño para que no toque el borde.
      const MAX = 0.14;
      setOffset({
        x: Math.cos(angulo) * MAX * factor,
        y: Math.sin(angulo) * MAX * factor,
      });
      rafRef.current = null;
    };

    const onMove = (e) => {
      pointerRef.current = { x: e.clientX, y: e.clientY };
      if (!rafRef.current) rafRef.current = window.requestAnimationFrame(mover);
    };

    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mousemove', onMove);
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    };
  }, [usaCursor]);

  return (
    // La O real de la fuente (idéntica al resto del texto). La pupila se
    // posiciona dentro del hueco con un contenedor que la recorta.
    <span ref={ojoRef} className={styles.eye} aria-hidden="true">
      <span className={styles.letter}>O</span>
      <span className={styles.iris}>
        <span
          className={styles.pupil}
          style={{
            transform: `translate(calc(-50% + ${offset.x}em), calc(-50% + ${offset.y}em))`,
          }}
        />
      </span>
    </span>
  );
}