import styles from './HiloFooter.module.css';

export default function HiloFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`shell ${styles.inner}`}>
        <div className={styles.brand}><span />Hilo Cofrade</div>
        <small>Proyecto creado por Nacho Sánchez · @desdeelarenal</small>
      </div>
    </footer>
  );
}
