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

// Jerarquía (#1253): la primera cita del periodo es la principal (hora y título
// más grandes); las «Próximas citas» de reserva van en filas compactas.
function AgendaRow({ card, variant }) {
  const { day, weekday, month } = card.dateParts || {}
  const time = card.time || {}
  return (
    <li className={styles.row} data-live={card.isLive ? 'true' : undefined} data-variant={variant}>
      <Link href={card.href} className={styles.rowLink}>
        <time className={styles.leaf} dateTime={card.date} aria-label={card.dateLabel}>
          <span className={styles.leafWeekday}>{weekday}</span>
          <strong className={styles.leafDay}>{day || '—'}</strong>
          <span className={styles.leafMonth}>{month}</span>
        </time>
        <span className={styles.body}>
          <span className={styles.when}>
            {card.isLive ? <b className={styles.live}><i aria-hidden="true" />En curso</b> : null}
            {time.main ? <strong className={styles.time}>{time.main}</strong> : null}
            {time.detail ? <span className={styles.timeDetail}>{time.detail}</span> : null}
            {!time.main && !time.detail ? <span className={styles.timeDetail}>Horario por confirmar</span> : null}
          </span>
          <span className={styles.title}>{card.title}</span>
          {card.organizer ? <span className={styles.organizer}>{card.organizer}</span> : null}
          <span className={styles.meta}>
            {card.municipality ? <span>{card.municipality}</span> : null}
            {card.type ? <span className={styles.type}>{card.type}</span> : null}
          </span>
        </span>
      </Link>
      {card.focus ? <LiveFocus focus={card.focus} /> : null}
    </li>
  )
}

// Salida en curso: siguiente momento del horario, bandas y guía completa, dentro
// de la propia cita (antes era el bloque aparte «Procesión en curso»).
function LiveFocus({ focus }) {
  return (
    <div className={styles.focus}>
      {focus.next ? (
        <p className={styles.focusNext}>
          <b>Siguiente</b>
          {focus.next.time ? <strong className={styles.focusTime}>{focus.next.time}</strong> : null}
          <span>{focus.next.label}{focus.next.place && !focus.next.label.includes(focus.next.place) ? ` · ${focus.next.place}` : ''}</span>
        </p>
      ) : null}
      {focus.bands.length ? <p className={styles.focusBands}>Con {focus.bands.join(' y ')}</p> : null}
      {focus.guideHref ? <Link className={styles.focusGuide} href={focus.guideHref}>Horarios y guía completa</Link> : null}
    </div>
  )
}

export default function HomeAgendaNow({ agenda, children = null }) {
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
        <div className={styles.head}>
          <h2 id="agenda-inmediata-title">Agenda cofrade</h2>
          <Link className={styles.headLink} href="/agenda-cofrade">Agenda completa</Link>
        </div>

        <div className={styles.tabs} role="tablist" aria-label="Periodo de la agenda" data-tabs={agenda.tabs.length}>
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
              {item.key === 'now' ? <i className={styles.tabDot} aria-hidden="true" /> : null}
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
              {current.cards.map((card, index) => <AgendaRow card={card} key={card.key} variant={index === 0 ? 'lead' : undefined} />)}
            </ul>
          ) : (
            <p className={styles.empty}>{EMPTY_TEXT[current.key]}</p>
          )}

          {showUpcoming ? (
            <>
              <h3 className={styles.upcomingTitle}>Próximas citas</h3>
              <ul className={styles.list}>
                {agenda.upcoming.map((card, index) => <AgendaRow card={card} key={card.key} variant={index === 0 ? 'lead' : 'compact'} />)}
              </ul>
            </>
          ) : null}
        </div>

        {more ? (
          <Link className={styles.more} href={current.href}>{more}</Link>
        ) : null}

        {children}
      </div>
    </section>
  )
}
