import Link from 'next/link'
import SectionTitle from '@/components/SectionTitle'
import { crewEventStatusLabel } from '@/lib/crew-events'
import styles from './BrotherhoodCrewEventsSection.module.css'

function eventStatus(event) {
  if (event.isPast && event.eventStatus === 'announced') return 'Fecha pasada'
  return event.urgencyLabel || crewEventStatusLabel(event.eventStatus)
}

function EventCard({ event }) {
  const time = event.timeText || event.startTime || 'Hora por confirmar'
  const primaryAgent = event.agents.find((item) => item.isPrimary) || event.agents[0]

  return (
    <article className={styles.card}>
      <time className={styles.date} dateTime={event.date}>
        <strong>{event.dateParts.day}</strong>
        <span>{event.dateParts.month}</span>
        <small>{event.dateParts.year}</small>
      </time>

      <div className={styles.cardBody}>
        <div className={styles.topline}>
          <span>{event.eventTypeLabel}</span>
          <strong data-status={event.eventStatus}>{eventStatus(event)}</strong>
        </div>
        <h3><Link href={event.detailHref}>{event.title}</Link></h3>

        <div className={styles.facts}>
          <span><small>Hora</small><b>{time}</b></span>
          {event.location ? <span><small>Lugar</small><b>{event.location}</b></span> : null}
          {event.steps.length ? <span><small>Paso</small><b>{event.steps.map((item) => item.name).join(' · ')}</b></span> : null}
          {primaryAgent ? <span><small>{primaryAgent.roleName}</small><b>{primaryAgent.name}</b></span> : null}
        </div>

        <Link className={styles.detailLink} href={event.detailHref}>
          Ver convocatoria <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  )
}

function EventList({ events }) {
  return <div className={styles.list}>{events.map((event) => <EventCard key={event.id} event={event} />)}</div>
}

export default function BrotherhoodCrewEventsSection({ events = [] }) {
  if (!events.length) return null

  const upcoming = events.filter((event) => event.isUpcoming)
  const historical = events.filter((event) => event.isPast).reverse()

  return (
    <section className={`section ${styles.section}`} id="igualas-y-ensayos">
      <div className="shell">
        <SectionTitle
          eyebrow="Calendario de cuadrilla"
          title="Igualás y ensayos"
          description="Convocatorias documentadas de la Hermandad, conectadas con sus pasos, capataces y lugares de celebración."
        />

        <div className={styles.groups}>
          {upcoming.length ? (
            <div className={styles.group}>
              <div className={styles.groupHeading}>
                <h3>Próximas citas</h3>
                <span>{upcoming.length}</span>
              </div>
              <EventList events={upcoming} />
            </div>
          ) : null}

          {historical.length ? (
            <details className={styles.history} open={!upcoming.length}>
              <summary>
                <span>Histórico de convocatorias</span>
                <strong>{historical.length}</strong>
                <b aria-hidden="true">＋</b>
              </summary>
              <EventList events={historical} />
            </details>
          ) : null}
        </div>

        <Link className={styles.calendarLink} href="/igualas-y-ensayos">
          Consultar el calendario completo <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  )
}
