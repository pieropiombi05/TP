'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useCarrito } from '@/context/CarritoContext';
import styles from './Header.module.css';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [montado, setMontado] = useState(false);
  const { cantidadTotal } = useCarrito();

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
        <div className={styles.logo}>WOMBOO</div>
        <nav className={styles.navbar} aria-label="Navegación principal">
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
