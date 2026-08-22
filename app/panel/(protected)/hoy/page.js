import Link from 'next/link'
import { requirePanelUser } from '@/lib/panel/auth'
import { getHomeEditorialPanelData } from '@/lib/panel/home-editorial'
import { EffectiveHomePreview, HomeDateFilter } from '@/components/panel/home/HomeEditorialPrimitives'
import styles from '@/app/panel/panel.module.css'

export const metadata = { title: 'Hoy · Panel' }

export default async function HomeEditorialOverview({ searchParams }) {
  const query = await searchParams
  const [user, data] = await Promise.all([
    requirePanelUser(),
    getHomeEditorialPanelData({ date: String(query?.fecha || '') }),
  ])
  const canEdit = ['admin', 'editor'].includes(user.role)

  return (
    <div className={styles.pageWrap}>
      <header className={styles.pageHeader}>
        <div>
          <span className={styles.eyebrow}>Centro editorial</span>
          <h1>Hoy en Hilo Cofrade</h1>
          <p>Controla la portada diaria sin perder la automatización: revisa el resultado efectivo, fuerza excepciones y mantiene el banco editorial.</p>
        </div>
        <Link className={styles.secondaryButton} href="/" target="_blank" rel="noreferrer">Abrir Home ↗</Link>
      </header>

      {!canEdit ? <div className={styles.readOnlyNotice}>Tu perfil tiene acceso de consulta.</div> : null}
      <HomeDateFilter selectedDate={data.selectedDate} />

      <section className={styles.metricGrid} aria-label="Estado editorial de la Home">
        <article className={styles.metricCard}><span>Overrides</span><strong>{data.metrics.publishedOverrides}</strong><small>selecciones manuales publicadas</small></article>
        <article className={styles.metricCard}><span>Banco editorial</span><strong>{data.metrics.editorialTotal}</strong><small>Datos y Curiosidades activos</small></article>
        <article className={styles.metricCard}><span>Elegibles</span><strong>{data.metrics.editorialEligible}</strong><small>participan en la rotación</small></article>
        <article className={styles.metricCard}><span>Publicados</span><strong>{data.metrics.editorialPublished}</strong><small>contenidos disponibles</small></article>
      </section>

      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}>
          <div><span className={styles.eyebrow}>Resultado efectivo</span><h2>Qué mostrará la Home · {data.selectedDate}</h2></div>
          <p>La vista combina overrides publicados con la misma selección automática que alimenta la portada.</p>
        </div>
        <EffectiveHomePreview effective={data.effective} />
      </section>

      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}>
          <div><span className={styles.eyebrow}>Flujo editorial</span><h2>Dos espacios, dos trabajos</h2></div>
          <p>La programación decide qué sale en una fecha; el Banco mantiene el contenido reutilizable.</p>
        </div>
        <div className={styles.dashboardGrid}>
          <article className={styles.panelCard}>
            <span className={styles.eyebrow}>Calendario</span><h3>Programación diaria</h3>
            <p className={styles.emptyText}>Efeméride, contenido editorial y Marcha del día. El Hilo para descubrir permanece automático.</p>
            <div style={{ marginTop: 18 }}><Link className={styles.primaryButton} href={`/panel/hoy/programacion?fecha=${data.selectedDate}`}>Abrir programación →</Link></div>
          </article>
          <article className={styles.panelCard}>
            <span className={styles.eyebrow}>Biblioteca</span><h3>Banco editorial</h3>
            <p className={styles.emptyText}>Crea y mantiene Datos Cofrades y Curiosidades, sus relaciones, prioridad y elegibilidad.</p>
            <div style={{ marginTop: 18 }}><Link className={styles.primaryButton} href={`/panel/hoy/banco?fecha=${data.selectedDate}`}>Abrir Banco →</Link></div>
          </article>
        </div>
      </section>
    </div>
  )
}
