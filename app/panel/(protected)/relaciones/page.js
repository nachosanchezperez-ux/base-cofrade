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
          <div className={styles.cardHeading}><div><span className={styles.eyebrow}>Procesión</span><h2>Imagen ↔ Paso</h2></div></div>
          <p className={styles.emptyText}>Relaciona una Imagen y un Paso existentes, añade temporalidad opcional y conserva los periodos cerrados.</p>
          <div style={{ marginTop: 20 }}><Link className={styles.primaryButton} href="/panel/relaciones/imagen-paso">Gestionar relaciones</Link></div>
        </section>

        <section className={styles.panelCard}>
          <div className={styles.cardHeading}><div><span className={styles.eyebrow}>Autoría</span><h2>Imagen ↔ Agente</h2></div></div>
          <p className={styles.emptyText}>La autoría se gestiona desde cada Imagen para distinguir autor documentado, atribución, taller, círculo o escuela.</p>
          <div style={{ marginTop: 20 }}><Link className={styles.secondaryButton} href="/panel/imagenes">Abrir Imágenes</Link></div>
        </section>

        <section className={styles.panelCard}>
          <div className={styles.cardHeading}><div><span className={styles.eyebrow}>Identidad y pertenencia</span><h2>Titularidad, propiedad y bandas institucionales</h2></div></div>
          <p className={styles.emptyText}>Gestiona identidades devocionales y relaciones semánticas sin confundir una advocación, una pieza física, su propietario o un vínculo institucional.</p>
          <div style={{ marginTop: 20 }}><Link className={styles.primaryButton} href="/panel/relaciones/semanticas">Gestionar relaciones semánticas</Link></div>
        </section>

        <section className={styles.panelCard}>
          <div className={styles.cardHeading}><div><span className={styles.eyebrow}>Procedencia</span><h2>Fuentes de relaciones avanzadas</h2></div></div>
          <p className={styles.emptyText}>Vincula Fuentes a periodos de acompañamiento y otras relaciones estructuradas desde su contexto, usando source_links.</p>
          <div style={{ marginTop: 20 }}><Link className={styles.secondaryButton} href="/panel/relaciones/documentacion">Abrir documentación relacional</Link></div>
        </section>
      </div>
    </div>
  )
}
