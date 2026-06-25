'use client';

import Link from 'next/link';
import { useCarrito } from '@/context/CarritoContext';
import styles from './page.module.css';

export default function CarritoPage() {
  const {
    items,
    aumentarCantidad,
    disminuirCantidad,
    eliminarProducto,
    vaciarCarrito,
    cantidadTotal,
    total,
  } = useCarrito();

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div>
          <p className={styles.eyebrow}>Tu compra</p>
          <h1 className={styles.title}>Carrito</h1>
        </div>
        <Link href="/" className={styles.backLink}>
          Seguir comprando
        </Link>
      </div>

      {items.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>Tu carrito está vacío por el momento.</p>
          <Link href="/" className={styles.primaryButton}>
            Explorar colección
          </Link>
        </div>
      ) : (
        <div className={styles.content}>
          <div className={styles.productList}>
            {items.map((item) => (
              <article key={item.id} className={styles.itemCard}>
                <div className={styles.itemImageWrapper}>
                  <img src={item.imagen} alt={item.nombre} className={styles.itemImage} />
                </div>

                <div className={styles.itemInfo}>
                  <div>
                    <h2 className={styles.itemName}>{item.nombre}</h2>
                    <p className={styles.itemPrice}>${item.precio.toFixed(2)}</p>
                  </div>

                  <div className={styles.actionsRow}>
                    <div className={styles.quantityControls}>
                      <button
                        type="button"
                        className={styles.quantityButton}
                        onClick={() => disminuirCantidad(item.id)}
                        aria-label={`Disminuir cantidad de ${item.nombre}`}
                      >
                        −
                      </button>
                      <span className={styles.quantityValue}>{item.cantidad}</span>
                      <button
                        type="button"
                        className={styles.quantityButton}
                        onClick={() => aumentarCantidad(item.id)}
                        aria-label={`Aumentar cantidad de ${item.nombre}`}
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      className={styles.removeButton}
                      onClick={() => eliminarProducto(item.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside className={styles.summaryCard}>
            <h2 className={styles.summaryTitle}>Resumen</h2>
            <div className={styles.summaryRow}>
              <span>Productos</span>
              <span>{cantidadTotal}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <button type="button" className={styles.primaryButton}>
              Finalizar compra
            </button>
            <button type="button" className={styles.secondaryButton} onClick={vaciarCarrito}>
              Vaciar carrito
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}
