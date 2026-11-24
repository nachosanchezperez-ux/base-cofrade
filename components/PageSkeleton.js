import styles from './PageSkeleton.module.css'

// Silueta de carga «de aplicación» (24/11/2026): se ve al instante al tocar un
// enlace mientras llega la página. Dos formas: ficha (portada + pestañas +
// tarjetas) y listado (buscador + rejilla). Sin texto inventado.
export default function PageSkeleton({ variant = 'ficha' }) {
  return (
    <div className={styles.skeleton} role="status" aria-live="polite" aria-label="Cargando">
      <span className="sr-only">Cargando…</span>
      {variant === 'listado' ? (
        <div className={`shell ${styles.body}`} aria-hidden="true">
          <span className={`${styles.block} ${styles.title}`} />
          <span className={`${styles.block} ${styles.line}`} />
          <span className={`${styles.block} ${styles.search}`} />
          <div className={styles.grid}>
            {Array.from({ length: 8 }, (_, index) => <span key={index} className={`${styles.block} ${styles.card}`} />)}
          </div>
        </div>
      ) : (
        <>
          <div className={styles.hero} aria-hidden="true">
            <div className={`shell ${styles.heroInner}`}>
              <span className={`${styles.block} ${styles.crest}`} />
              <span className={`${styles.block} ${styles.heroTitle}`} />
              <span className={`${styles.block} ${styles.heroLine}`} />
            </div>
          </div>
          <div className={`shell ${styles.body}`} aria-hidden="true">
            <div className={styles.chips}>
              {Array.from({ length: 4 }, (_, index) => <span key={index} className={`${styles.block} ${styles.chip}`} />)}
            </div>
            <div className={styles.grid}>
              {Array.from({ length: 4 }, (_, index) => <span key={index} className={`${styles.block} ${styles.card}`} />)}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
