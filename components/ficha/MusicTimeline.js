import Link from 'next/link'
import styles from './MusicTimeline.module.css'

// Cronología musical (Tarea 09). Solo pinta periodos acreditados que ya llegan
// a la ficha: no calcula ni rellena huecos entre periodos.
// items: [{ id, status: 'futuro'|'vigente'|'historico', period, band, href, detail }]
const STATUS_LABEL = { futuro: 'Próxima temporada', vigente: 'Vigente', historico: 'Histórico' }

export default function MusicTimeline({ items = [], title = 'Cronología musical', headingLevel = 3, lead = '', statusLabels = STATUS_LABEL }) {
  const visible = items.filter((item) => item?.band)
  if (!visible.length) return null
  const Heading = `h${headingLevel}`

  return (
    <div className={styles.wrap}>
      {title ? <Heading className={styles.title}>{title}</Heading> : null}
      {lead ? <p className={styles.lead}>{lead}</p> : null}
      <ol className={styles.timeline}>
        {visible.map((item) => (
          <li key={item.id} className={styles.item} data-status={item.status}>
            <span className={styles.node} aria-hidden="true" />
            <div className={styles.when}>
              <span className={styles.period}>{item.period || 'Periodo sin fechar'}</span>
              {statusLabels[item.status] ? <span className={styles.status}>{statusLabels[item.status]}</span> : null}
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
