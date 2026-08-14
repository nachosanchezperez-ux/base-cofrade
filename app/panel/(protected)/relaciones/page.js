import Link from 'next/link'
import styles from '@/app/panel/panel.module.css'

export const metadata = { title: 'Relaciones · Panel' }

export default function PanelRelationsPage() {
  return (
    <div className={styles.pageWrap}>
      <header className={styles.pageHeader}>
        <div>
          <span className={styles.eyebrow}>Núcleo relacional</span>
          <h1>Relaciones</h1>
          <p>Conecta entidades existentes sin duplicar conocimiento ni borrar su historia.</p>
        </div>
      </header>

      <div className={styles.dashboardGrid}>
        <section className={styles.panelCard}>
          <div className={styles.cardHeading}>
            <div>
              <span className={styles.eyebrow}>Procesión</span>
              <h2>Imagen ↔ Paso</h2>
            </div>
          </div>
          <p className={styles.emptyText}>
            Relaciona una Imagen y un Paso existentes, añade temporalidad opcional y conserva los periodos cerrados.
          </p>
          <div style={{ marginTop: 20 }}>
            <Link className={styles.primaryButton} href="/panel/relaciones/imagen-paso">
              Gestionar relaciones
            </Link>
          </div>
        </section>

        <section className={styles.panelCard}>
          <div className={styles.cardHeading}>
            <div>
              <span className={styles.eyebrow}>Autoría</span>
              <h2>Imagen ↔ Agente</h2>
            </div>
          </div>
          <p className={styles.emptyText}>
            La autoría se gestiona desde cada Imagen para mantener el contexto y distinguir autor, atribución, taller, círculo o escuela.
          </p>
          <div style={{ marginTop: 20 }}>
            <Link className={styles.secondaryButton} href="/panel/imagenes">
              Abrir Imágenes
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
