import Link from 'next/link'
import styles from './MusicTimeline.module.css'

// Cronología musical (Tarea 09). Solo pinta periodos acreditados que ya llegan
// a la ficha: no calcula ni rellena huecos entre periodos.
// items: [{ id, status: 'futuro'|'vigente'|'historico', period, band, href, detail }]
const STATUS_LABEL = { futuro: 'Próxima temporada', vigente: 'Vigente', historico: 'Histórico' }

export default function MusicTimeline({ items = [], title = 'Cronología musical', headingLevel = 3 }) {
  const visible = items.filter((item) => item?.band)
  if (!visible.length) return null
  const Heading = `h${headingLevel}`

  return (
    <div className={styles.wrap}>
      <Heading className={styles.title}>{title}</Heading>
      <ol className={styles.timeline}>
        {visible.map((item) => (
          <li key={item.id} className={styles.item} data-status={item.status}>
            <span className={styles.node} aria-hidden="true" />
            <div className={styles.when}>
              <span className={styles.period}>{item.period || 'Periodo sin fechar'}</span>
              <span className={styles.status}>{STATUS_LABEL[item.status] || ''}</span>
            </div>
            <p className={styles.band}>
              {item.href ? <Link href={item.href}>{item.band}</Link> : item.band}
            </p>
            {item.detail ? <p className={styles.detail}>{item.detail}</p> : null}
          </li>
        ))}
      </ol>
    </div>
  )
}
