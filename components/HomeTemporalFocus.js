import Link from 'next/link'
import styles from './HomeTemporalFocus.module.css'

function eventHref(item) {
  return item?.href || item?.calendarHref || item?.organizerHref || '/agenda-cofrade'
}

function dateLabel(item) {
  return item?.temporalDateInfo?.weekdayLabel || item?.dateInfo?.weekdayLabel || item?.dateInfo?.label || item?.temporalDate || item?.date || 'Fecha por confirmar'
}

function timingLabel(item) {
  if (item?.liveState?.isLive) {
    return item.endTime ? `En curso · hasta ${item.endTime}` : 'En curso'
  }
  if (item?.timeText) return item.timeText
  if (item?.startTime) return item.endTime ? `${item.startTime}–${item.endTime} h` : `${item.startTime} h`
  return 'Horario por confirmar'
}

export default function HomeTemporalFocus({ temporal }) {
  if (!temporal?.focusItems?.length) return null

  const metrics = [
    { label: 'Ahora', count: temporal.liveItems?.length || 0, href: '/agenda-cofrade/hoy' },
    { label: 'Hoy', count: temporal.todayItems?.length || 0, href: '/agenda-cofrade/hoy' },
    { label: 'Mañana', count: temporal.tomorrowItems?.length || 0, href: '/agenda-cofrade/manana' },
    { label: 'Fin de semana', count: temporal.weekendItems?.length || 0, href: '/agenda-cofrade/fin-de-semana' },
  ]

  return (
    <section className={styles.section} id="hoy" data-home-temporal-mode={temporal.mode}>
      <div className="shell">
        <header className={styles.header}>
          <div>
            <span>{temporal.eyebrow}</span>
            <h2>{temporal.title}</h2>
          </div>
          <p>{temporal.description || 'La portada avanza automáticamente según fecha y horario documentados: ahora, hoy, mañana y fin de semana.'}</p>
        </header>

        <div className={styles.metrics} aria-label="Resumen temporal de la Agenda">
          {metrics.map((metric) => (
            <Link href={metric.href} key={metric.label}>
              <span>{metric.label}</span>
              <strong>{metric.count}</strong>
            </Link>
          ))}
        </div>

        <div className={styles.grid}>
          {temporal.focusItems.map((item) => (
            <article className={styles.card} key={item.key || item.id}>
              <div className={styles.topline}>
                <span>{item.liveState?.isLive ? <><i aria-hidden="true" /> En curso</> : item.categoryLabel || item.categoryName || 'Agenda'}</span>
                <small>{dateLabel(item)}</small>
              </div>
              <h3>{item.title}</h3>
              <p className={styles.meta}>{[item.municipality, timingLabel(item), item.place].filter(Boolean).join(' · ')}</p>
              {item.summary ? <p className={styles.summary}>{item.summary}</p> : null}
              <div className={styles.actions}>
                <Link href={eventHref(item)}>{item.liveState?.isLive ? 'Seguir ahora' : 'Ver cita'} <span aria-hidden="true">→</span></Link>
                {item.municipalityHref ? <Link href={item.municipalityHref}>Guía de {item.municipality}</Link> : null}
                {item.organizerHref ? <Link href={item.organizerHref}>Hermandad</Link> : null}
              </div>
            </article>
          ))}
        </div>

        <nav className={styles.footer} aria-label="Seguir en la Agenda Cofrade">
          <Link href={temporal.href}>Ver este periodo en la Agenda <span aria-hidden="true">→</span></Link>
          <Link href="/agenda-cofrade">Abrir Agenda Cofrade completa</Link>
        </nav>
      </div>
    </section>
  )
}
