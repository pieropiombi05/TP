import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero} id="inicio">
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>WOMBOO</h1>
        <p className={styles.heroTagline}>STREETWEAR SIN COMPROMISO</p>
        <div className={styles.heroDivider}></div>
        <p className={styles.heroDescription}>Ropa que desafía lo ordinario. Cada pieza es una declaración.</p>
      </div>
    </section>
  );
}
