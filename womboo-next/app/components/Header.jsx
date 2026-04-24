'use client';

import { useState } from 'react';
import styles from './Header.module.css';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
