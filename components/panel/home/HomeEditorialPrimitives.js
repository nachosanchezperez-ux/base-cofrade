import Link from 'next/link'
import styles from '@/app/panel/panel.module.css'

export const STATUS_LABELS = {
  published: 'Publicado',
  review: 'En revisión',
  draft: 'Borrador',
  archived: 'Archivado',
}

export function StatusSelect({ defaultValue = 'draft' }) {
  return (
    <select name="status" defaultValue={defaultValue}>
      <option value="draft">Borrador</option>
      <option value="review">En revisión</option>
      <option value="published">Publicado</option>
      <option value="archived">Archivado</option>
    </select>
  )
}

export function HomeDateFilter({ selectedDate, action = '' }) {
  return (
    <form className={styles.filters} action={action || undefined} style={{ gridTemplateColumns: '220px auto 1fr' }}>
      <label><span className={styles.srOnly}>Fecha editorial</span><input type="date" name="fecha" defaultValue={selectedDate} /></label>
      <button className={styles.secondaryButton} type="submit">Abrir fecha</button>
      <small style={{ alignSelf: 'center', color: '#68788a' }}>La programación y la vista efectiva se calculan para esta fecha.</small>
    </form>
  )
}

export function EffectiveHomePreview({ effective }) {
  const blocks = [
    ['ephemeris', 'Efeméride'],
    ['editorial', 'Contenido editorial'],
    ['discovery', 'Hilo para descubrir'],
    ['march', 'Marcha del día'],
  ]

  return (
    <div className={styles.dashboardGrid}>
      {blocks.map(([key, label]) => {
        const item = effective[key]
        const manual = item?.mode === 'manual'
        return (
          <article className={styles.panelCard} key={key}>
            <div className={styles.itemHeading}>
              <div>
                <span className={styles.eyebrow}>{label}</span>
                <h3>{item?.title || 'Sin contenido'}</h3>
              </div>
              <span className={`${styles.statusBadge} ${styles[manual ? 'review' : 'published']}`}>{manual ? 'Manual' : 'Automático'}</span>
            </div>
            <p className={styles.emptyText}>{item?.detail || 'Sin información adicional.'}</p>
            {item?.editHref ? <div style={{ marginTop: 14 }}><Link className={styles.secondaryButton} href={item.editHref}>Abrir origen →</Link></div> : null}
          </article>
        )
      })}
    </div>
  )
}
