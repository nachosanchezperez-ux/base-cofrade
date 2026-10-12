'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import { homeAgendaMoreLabel } from '@/lib/home-agenda-now'
import styles from './HomeAgendaNow.module.css'

const EMPTY_TEXT = {
  now: 'No hay ninguna procesión en la calle ahora mismo.',
  today: 'No quedan más citas documentadas para hoy.',
  tomorrow: 'No hay citas documentadas para mañana.',
  weekend: 'No hay citas documentadas para este fin de semana.',
}

function AgendaCard({ card }) {
  return (
    <li className={styles.card}>
      <Link href={card.href} className={styles.cardLink}>
        <span className={styles.when}>
          <time dateTime={card.date}>{card.dateLabel}</time>
          {card.timeLabel ? <strong>{card.timeLabel}</strong> : <span className={styles.noTime}>Horario por confirmar</span>}
          {card.isLive ? <b className={styles.live}><i aria-hidden="true" /> En curso</b> : null}
        </span>
        <span className={styles.title}>{card.title}</span>
        {card.organizer ? <span className={styles.organizer}>{card.organizer}</span> : null}
        <span className={styles.meta}>{[card.municipality, card.type].filter(Boolean).join(' · ')}</span>
      </Link>
    </li>
  )
}

export default function HomeAgendaNow({ agenda }) {
  const [active, setActive] = useState(agenda?.defaultTab || 'today')
  const tabRefs = useRef({})
  if (!agenda?.tabs?.length) return null

  const current = agenda.tabs.find((item) => item.key === active) || agenda.tabs[0]
  const showUpcoming = !current.cards.length && agenda.upcoming.length
  const more = homeAgendaMoreLabel(current)

  function onKeyDown(event, index) {
    const keys = { ArrowRight: 1, ArrowLeft: -1, Home: 'first', End: 'last' }
    if (!(event.key in keys)) return
    event.preventDefault()
    const move = keys[event.key]
    const nextIndex = move === 'first' ? 0
      : move === 'last' ? agenda.tabs.length - 1
        : (index + move + agenda.tabs.length) % agenda.tabs.length
    const next = agenda.tabs[nextIndex]
    setActive(next.key)
    tabRefs.current[next.key]?.focus()
  }

  return (
    <section className={styles.section} id="hoy" aria-labelledby="agenda-inmediata-title">
      <div className="shell">
        <header className={styles.header}>
          <span className={styles.eyebrow}>Agenda cofrade</span>
          <h2 id="agenda-inmediata-title">Lo que está pasando</h2>
        </header>

        <div className={styles.tabs} role="tablist" aria-label="Periodo de la agenda">
          {agenda.tabs.map((item, index) => (
            <button
              key={item.key}
              ref={(node) => { tabRefs.current[item.key] = node }}
              type="button"
              role="tab"
              id={`agenda-tab-${item.key}`}
              aria-selected={item.key === current.key}
              aria-controls="agenda-inmediata-panel"
              tabIndex={item.key === current.key ? 0 : -1}
              className={`${styles.tab} ${item.key === current.key ? styles.tabActive : ''} ${item.key === 'now' ? styles.tabNow : ''}`}
              onClick={() => setActive(item.key)}
              onKeyDown={(event) => onKeyDown(event, index)}
            >
              <span>{item.label}</span>
              <b aria-label={`${item.count} ${item.count === 1 ? 'cita' : 'citas'}`}>{item.count}</b>
            </button>
          ))}
        </div>

        <div
          className={styles.panel}
          role="tabpanel"
          id="agenda-inmediata-panel"
          aria-labelledby={`agenda-tab-${current.key}`}
        >
          {current.cards.length ? (
            <ul className={styles.list}>
              {current.cards.map((card) => <AgendaCard card={card} key={card.key} />)}
            </ul>
          ) : (
            <p className={styles.empty}>{EMPTY_TEXT[current.key]}</p>
          )}

          {showUpcoming ? (
            <>
              <h3 className={styles.upcomingTitle}>Próximas citas</h3>
              <ul className={styles.list}>
                {agenda.upcoming.map((card) => <AgendaCard card={card} key={card.key} />)}
              </ul>
            </>
          ) : null}
        </div>

        <nav className={styles.footer} aria-label="Seguir en la Agenda Cofrade">
          {more ? <Link href={current.href}>{more} <span aria-hidden="true">→</span></Link> : null}
          <Link href="/agenda-cofrade">Agenda completa <span aria-hidden="true">→</span></Link>
          <Link href="/extraordinarias">Extraordinarias</Link>
        </nav>
      </div>
    </section>
  )
}
