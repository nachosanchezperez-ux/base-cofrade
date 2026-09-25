import Link from 'next/link'
import SectionTitle from '@/components/SectionTitle'
import styles from './BrotherhoodAgendaSection.module.css'

function timeLabel(item) {
  return item.startTime || item.timeText || 'Hora por confirmar'
}

function ItemCard({ item }) {
  const date = item.dateInfo || {}
  const title = item.href ? <Link href={item.href}>{item.title}</Link> : item.title

  return (
    <article className={styles.card}>
      <time className={styles.date} dateTime={item.date || undefined}>
        <strong>{date.day || '—'}</strong>
        <span>{date.month || 'FECHA'}</span>
        <small>{date.year || ''}</small>
      </time>

      <div className={styles.copy}>
        <div className={styles.topline}>
          <span>{item.categoryLabel || item.calendarLabel}</span>
          <small>{item.calendarLabel}</small>
        </div>
        <h3>{title}</h3>
        {item.summary ? <p>{item.summary}</p> : null}

        <div className={styles.facts}>
          <span><small>Hora</small><strong>{timeLabel(item)}</strong></span>
          {item.municipality ? (
            <span>
              <small>Localidad</small>
              {item.municipalityHref
                ? <Link href={item.municipalityHref}>{item.municipality}</Link>
                : <strong>{item.municipality}</strong>}
            </span>
          ) : null}
        </div>

        <div className={styles.actions}>
          {item.href ? <Link href={item.href}>{item.actionLabel || 'Abrir acto'} <span aria-hidden="true">→</span></Link> : null}
          {item.calendarHref && item.calendarHref !== item.href
            ? <Link href={item.calendarHref}>Ver {item.calendarLabel}</Link>
            : null}
        </div>
      </div>
    </article>
  )
}

export default function BrotherhoodAgendaSection({ items = [] }) {
  const upcoming = Array.isArray(items) ? items : []
  if (!upcoming.length) return null

  const visible = upcoming.slice(0, 6)

  return (
    <section className={styles.section} id="agenda">
      <div className="shell">
        <div className={styles.heading}>
          <SectionTitle
            eyebrow="Agenda de la Hermandad"
            title="Próximas citas"
            description="Los próximos actos documentados de esta Hermandad, conectados con la Agenda Cofrade, Glorias, Extraordinarias e Igualás y ensayos."
          />
          <strong>{upcoming.length} {upcoming.length === 1 ? 'cita próxima' : 'citas próximas'}</strong>
        </div>

        <div className={styles.grid}>
          {visible.map((item) => <ItemCard item={item} key={item.key || item.href} />)}
        </div>

        <nav className={styles.calendars} aria-label="Calendarios relacionados">
          <span>Seguir en</span>
          <Link href="/agenda-cofrade">Agenda Cofrade</Link>
          <Link href="/procesiones-de-gloria">Glorias</Link>
          <Link href="/extraordinarias">Extraordinarias</Link>
          <Link href="/igualas-y-ensayos">Igualás y ensayos</Link>
        </nav>
      </div>
    </section>
  )
}
