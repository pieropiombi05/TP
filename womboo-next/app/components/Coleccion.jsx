import styles from './Coleccion.module.css';

export default function Coleccion({ products = [] }) {
  // Default products if not provided
  const defaultProducts = [
    { name: 'Oversized Hoodie', price: '$89.99' },
    { name: 'Technical Tee', price: '$49.99' },
    { name: 'Cargo Pants', price: '$129.99' },
    { name: 'Classic Sneakers', price: '$99.99' },
  ];

  const productsToDisplay = products.length > 0 ? products : defaultProducts;

  return (
    <section className={styles.products} id="collection">
      <h2 className={styles.productsTitle}>Colección</h2>
      <div className={styles.productsGrid}>
        {productsToDisplay.map((product, index) => (
          <div key={index} className={styles.productCard}>
            <div className={styles.productImage}></div>
            <h3 className={styles.productName}>{product.name}</h3>
            <p className={styles.productPrice}>{product.price}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
