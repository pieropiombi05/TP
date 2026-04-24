import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <p className={styles.footerText}>© 2026 WOMBOO. ALL RIGHTS RESERVED.</p>
        <p className={`${styles.footerText} ${styles.footerDividerText}`}>—</p>
      </div>
    </footer>
  );
}
