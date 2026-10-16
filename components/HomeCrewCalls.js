import Link from 'next/link'
import agendaStyles from './HomeAgendaNow.module.css'
import styles from './HomeCrewCalls.module.css'

// Igualás y ensayos en la portada. Mismas filas que la Agenda cofrade (hoja de
// calendario + hora en rojo) para que se lean igual; sin pestañas ni filtros.
function CrewRow({ card }) {
  const { day, weekday, month } = card.dateParts || {}
  const time = card.time || {}
  return (
    <li className={agendaStyles.row}>
      <Link href={card.href} className={agendaStyles.rowLink}>
        <time className={`${agendaStyles.leaf} ${styles.leaf}`} dateTime={card.date}>
          <span className={agendaStyles.leafWeekday}>{weekday}</span>
          <strong className={agendaStyles.leafDay}>{day || '—'}</strong>
          <span className={agendaStyles.leafMonth}>{month}</span>
        </time>
        <span className={agendaStyles.body}>
          <span className={agendaStyles.when}>
            {card.urgency ? <b className={styles.urgency}>{card.urgency}</b> : null}
            {card.isPostponed ? <b className={styles.urgency}>Aplazada</b> : null}
            {time.main ? <strong className={agendaStyles.time}>{time.main}</strong> : null}
            {time.detail ? <span className={agendaStyles.timeDetail}>{time.detail}</span> : null}
            {!time.main && !time.detail ? <span className={agendaStyles.timeDetail}>Hora por confirmar</span> : null}
          </span>
          <span className={agendaStyles.title}>{card.title}</span>
          {card.organizer ? <span className={agendaStyles.organizer}>{card.organizer}</span> : null}
          <span className={agendaStyles.meta}>
            {card.type ? <span className={agendaStyles.type}>{card.type}</span> : null}
            {card.municipality ? <span>{card.municipality}</span> : null}
            {card.agent ? <span>{card.agent}</span> : null}
          </span>
        </span>
      </Link>
    </li>
  )
}

export default function HomeCrewCalls({ calls }) {
  if (!calls?.cards?.length) return null
  const rest = calls.total - calls.cards.length
  return (
    <section className={`${agendaStyles.section} ${styles.section}`} id="igualas" aria-labelledby="home-igualas-title">
      <div className="shell">
        <div className={agendaStyles.head}>
          <h2 id="home-igualas-title">Igualás y ensayos</h2>
          <Link className={agendaStyles.headLink} href={calls.href}>Calendario completo</Link>
        </div>
        <p className={styles.lead}>Próximas convocatorias de cuadrilla en Sevilla y provincia.</p>
        <ul className={agendaStyles.list}>
          {calls.cards.map((card) => <CrewRow card={card} key={card.key} />)}
        </ul>
        <Link className={agendaStyles.more} href={calls.href}>
          {rest > 0 ? `Ver ${rest} ${rest === 1 ? 'convocatoria más' : 'convocatorias más'}` : 'Ver todas las igualás y ensayos'}
        </Link>
      </div>
    </section>
  )
}
