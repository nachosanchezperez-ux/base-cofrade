import Link from 'next/link'
import agendaStyles from './HomeAgendaNow.module.css'
import styles from './HomeCrewCalls.module.css'

// Igualás y ensayos en la portada. Mismas filas que la Agenda cofrade (hoja de
// calendario + hora en rojo) para que se lean igual. Compacto: tres filas y un
// único enlace al calendario, sin texto de presentación.
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

export default function HomeCrewCalls({ calls, embedded = false }) {
  if (!calls?.cards?.length) return null
  const link = (
    <Link className={agendaStyles.headLink} href={calls.href}>
      {calls.total > calls.cards.length ? `Ver las ${calls.total}` : 'Calendario completo'}
    </Link>
  )
  const list = (
    <ul className={agendaStyles.list}>
      {calls.cards.map((card) => <CrewRow card={card} key={card.key} />)}
    </ul>
  )

  // Portada de 5 bloques: apartado dentro de «Agenda cofrade».
  if (embedded) {
    return (
      <div className={styles.embedded} id="igualas" role="group" aria-labelledby="home-igualas-title">
        <div className={styles.embeddedHead}>
          <h3 id="home-igualas-title">Igualás y ensayos</h3>
          {link}
        </div>
        {list}
      </div>
    )
  }

  return (
    <section className={`${agendaStyles.section} ${styles.section}`} id="igualas" aria-labelledby="home-igualas-title">
      <div className="shell">
        <div className={agendaStyles.head}>
          <h2 id="home-igualas-title">Igualás y ensayos</h2>
          {link}
        </div>
        {list}
      </div>
    </section>
  )
}
