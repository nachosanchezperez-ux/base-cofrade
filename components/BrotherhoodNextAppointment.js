import Link from 'next/link'
import CalendarSubscribeLinks from '@/components/CalendarSubscribeLinks'
import { brotherhoodCalendarPath } from '@/lib/agenda-ics-links'
import styles from './BrotherhoodNextAppointment.module.css'

// «Próximamente»: el siguiente acto de la Hermandad (agenda, igualás, salidas
// anunciadas o cultos con fecha), calculado con nextBrotherhoodAppointment.
// Sustituye a «Próximas citas» en la ficha: el resto de citas va plegado.

const DAY_FORMAT = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Europe/Madrid' })
const SHORT_FORMAT = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', timeZone: 'Europe/Madrid' })

function parsedDate(value = '') {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T12:00:00Z`) : null
}

function longDate(value) {
  const date = parsedDate(value)
  if (!date) return ''
  const text = DAY_FORMAT.format(date)
  return `${text.charAt(0).toUpperCase()}${text.slice(1)}`
}

function dateTile(item) {
  if (item.dateInfo?.day && item.dateInfo.day !== '—') return { day: item.dateInfo.day, month: item.dateInfo.month }
  const date = parsedDate(item.date)
  if (!date) return null
  const [day, month = ''] = SHORT_FORMAT.format(date).replace('.', '').split(' ')
  return { day, month: month.toUpperCase() }
}

function timeLabel(item) {
  return item.startTime || item.timeText || ''
}

function ItemLink({ item, children, className }) {
  if (!item.href) return children
  return <Link href={item.href} className={className}>{children}</Link>
}

export default function BrotherhoodNextAppointment({ next, others = [], brotherhoodSlug = '', brotherhoodName = '' }) {
  if (!next) return null

  const tile = dateTile(next)
  const time = timeLabel(next)
  const place = next.place || next.route || ''
  const rest = others.filter((item) => (item.key || item.href) !== (next.key || next.href))

  return (
    <section className={styles.section} id="agenda" aria-labelledby="proximamente-titulo">
      <div className="shell">
        <h2 id="proximamente-titulo" className={styles.eyebrow}>Próximamente</h2>

        <article className={styles.card}>
          {tile ? (
            <time className={styles.tile} dateTime={next.date}>
              <strong>{tile.day}</strong>
              <span>{tile.month}</span>
            </time>
          ) : null}

          <div className={styles.copy}>
            {next.categoryLabel ? <span className={styles.type}>{next.categoryLabel}</span> : null}
            <h3><ItemLink item={next}>{next.title}</ItemLink></h3>
            <p className={styles.when}>
              {longDate(next.date)}
              {time ? <> · <strong>{time}</strong></> : null}
            </p>
            {place || next.municipality ? (
              <p className={styles.where}>{[place, next.municipality].filter(Boolean).join(' · ')}</p>
            ) : null}
            {next.href && !next.href.startsWith('#') ? (
              <Link href={next.href} className={styles.action}>{next.actionLabel || 'Ver detalle'} <span aria-hidden="true">→</span></Link>
            ) : null}
          </div>
        </article>

        {rest.length > 0 ? (
          <details className={styles.more}>
            <summary>{rest.length} {rest.length === 1 ? 'cita más' : 'citas más'} <b aria-hidden="true">+</b></summary>
            <ul>
              {rest.map((item) => (
                <li key={item.key || item.href}>
                  <time dateTime={item.date}>{longDate(item.date)}</time>
                  <ItemLink item={item} className={styles.moreTitle}>{item.title}</ItemLink>
                  {timeLabel(item) ? <span>{timeLabel(item)}</span> : null}
                </li>
              ))}
            </ul>
          </details>
        ) : null}

        <CalendarSubscribeLinks
          className={styles.subscribe}
          path={brotherhoodCalendarPath(brotherhoodSlug)}
          label={brotherhoodName}
          scope="brotherhood"
        />
      </div>
    </section>
  )
}
