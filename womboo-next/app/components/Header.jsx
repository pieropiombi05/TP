'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useCarrito } from '@/context/CarritoContext';
import { useTema } from '@/context/TemaContext';
import AnimatedO from './AnimatedO';
import styles from './Header.module.css';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [montado, setMontado] = useState(false);
  const { cantidadTotal } = useCarrito();
  const { alternarTema, esLight } = useTema();

  // Esperamos a que el componente se monte en el cliente para mostrar
  // el contador del carrito, evitando así el mismatch de hidratación.
  useEffect(() => {
    const id = window.setTimeout(() => {
      setMontado(true);
    }, 0);

    return () => window.clearTimeout(id);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <Link href="/" className={styles.logo} aria-label="Volver al inicio">
          <span className={styles.logoWord}>WOMB</span>
          <AnimatedO />
          <AnimatedO />
        </Link>
        <nav className={styles.navbar} aria-label="Navegación principal">
          <button
            type="button"
            className={styles.themeToggle}
            onClick={alternarTema}
            aria-label={esLight ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
            title={esLight ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
          >
            <span aria-hidden="true">{esLight ? '☀︎' : '☾'}</span>
          </button>
          <Link href="/carrito" className={styles.cartButton} aria-label="Ir al carrito">
            <span aria-hidden="true">🛒</span>
            {montado ? <span className={styles.cartCount}>{cantidadTotal}</span> : null}
          </Link>
          <button
            className={`${styles.menuToggle} ${isMenuOpen ? styles.active : ''}`}
            onClick={toggleMenu}
            aria-label="Abrir menú"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <ul className={`${styles.navMenu} ${isMenuOpen ? styles.active : ''}`}>
            <li>
              <a href="#inicio" onClick={closeMenu}>
                Inicio
              </a>
            </li>
            <li>
              <a href="#collection" onClick={closeMenu}>
                Colección
              </a>
            </li>
            <li>
              <a href="#contact" onClick={closeMenu}>
                Contacto
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
