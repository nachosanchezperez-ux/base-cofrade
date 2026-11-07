'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import {
  followedServerSnapshot,
  followedSnapshot,
  subscribeFollowed,
  toggleFollowed,
  writeFollowed,
} from '@/lib/followed-brotherhoods'
import { normalizeSearch } from '@/lib/holy-week-programme'
import styles from './HolyWeekProgramme.module.css'

const MINE = 'mi-programa'

function SearchIcon() {
  return <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
}

function StarIcon({ filled = false, size = 20 }) {
  return <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg>
}

function ShareIcon() {
  return <svg viewBox="0 0 24 24" width="19" height="19" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" /></svg>
}

function ChevronIcon() {
  return <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
}

function CloseIcon() {
  return <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
}

function Crest({ item, size = 44 }) {
  if (item.crestPath) {
    return <span className={styles.crest} style={{ '--crest-size': `${size}px` }}>
      <Image src={item.crestPath} alt="" width={size} height={size} />
    </span>
  }
  return <span className={styles.crestFallback} style={{ '--crest-size': `${size}px`, '--entity-color': item.color || 'var(--hc-navy, #112339)' }} aria-hidden="true" />
}

// Escudo de banda a tamaño fijo (srcset 1x/2x): el componente compartido pide
// un srcset completo que, multiplicado por cada banda, encarecía la página.
function BandBadge({ band, size = 32 }) {
  if (!band.logoPath) return <span className={styles.bandEmpty} aria-hidden="true">♪</span>
  return <span className={styles.bandLogo} style={{ background: band.logoBackground || '#fff' }} aria-hidden="true">
    <Image src={band.logoPath} alt="" width={size} height={size} />
  </span>
}

function itemSearchMatch(item, query) {
  if (normalizeSearch(item.name).includes(query) || normalizeSearch(item.parentName).includes(query)) return 'Hermandad'
  for (const step of item.cortejo) {
    const band = step.bands.find((candidate) => normalizeSearch(candidate.name).includes(query))
    if (band) return `${band.name} · ${step.title}`
  }
  for (const leg of item.legs) {
    const street = leg.points.find((point) => normalizeSearch(point).includes(query))
    if (street) return `Pasa por ${street}${item.departure ? ` · sale a las ${item.departure}` : ''}`
  }
  return ''
}

function shareItem(item, day) {
  const url = `${window.location.origin}${window.location.pathname}#${day.id}--${item.key}`
  const text = `${item.name} · ${day.name}${item.departure ? `, salida a las ${item.departure}` : ''}`
  if (navigator.share) {
    navigator.share({ title: item.name, text, url }).catch(() => {})
    return
  }
  navigator.clipboard?.writeText(url).catch(() => {})
}

function RouteLegs({ item, onPull }) {
  if (!item.legs.length) return null
  return <div className={styles.block}>
    <div className={styles.blockHead}>
      <h4>Recorrido</h4>
      <span className={styles.reference}>Referencia 2026</span>
    </div>
    <ol className={styles.legs} style={{ '--entity-color': item.color || 'var(--hc-navy, #112339)' }}>
      <li className={styles.legStop}>
        <span className={styles.legMarkFilled} aria-hidden="true" />
        <div>
          <p className={styles.legTitle}>Salida {item.departure ? <strong>{item.departure}</strong> : null}</p>
          {item.origin ? <p className={styles.legPlace}>{item.origin}</p> : null}
        </div>
      </li>
      {item.legs.map((leg) => leg.id === 'carrera'
        ? <li key={leg.id} className={styles.legCarrera}>
          <span className={styles.legMarkSquare} aria-hidden="true" />
          <div>
            <p className={styles.carreraTitle}>Carrera Oficial</p>
            <p className={styles.legPlace}>Campana · Sierpes · Plaza de San Francisco · Avenida · Catedral</p>
          </div>
        </li>
        : <li key={leg.id} className={styles.legStreets}>
          <span aria-hidden="true" />
          <div>
            <p className={styles.legLabel}>{leg.label}</p>
            <p className={styles.streets}>
              {leg.points.map((point, index) => <span key={`${point}-${index}`}>
                <button type="button" onClick={() => onPull(point)}>{point}</button>
                {index < leg.points.length - 1 ? <span aria-hidden="true" className={styles.dot}> · </span> : null}
              </span>)}
            </p>
          </div>
        </li>)}
      <li className={styles.legEnd}>
        <span className={styles.legMarkEmpty} aria-hidden="true" />
        <p className={styles.legTitle}>Entrada {item.arrival ? <strong>{item.arrival}</strong> : null}</p>
      </li>
    </ol>
  </div>
}

function ProgrammeItem({ item, day, open, onToggle, followed, onFollow, onPull }) {
  const panelId = `panel-${day.id}--${item.key}`
  const accent = item.color || 'var(--hc-navy, #112339)'
  const hasTimes = item.departure && !item.legs.length
  const empty = !item.cortejo.length && !item.legs.length && !item.departure

  return <li id={`${day.id}--${item.key}`} className={styles.item} style={{ '--entity-color': accent }}>
    <button type="button" className={styles.itemHead} aria-expanded={open} aria-controls={panelId} onClick={onToggle}>
      <span className={styles.crestWrap}>
        <Crest item={item} />
        {item.position ? <span className={styles.position}>{item.position}</span> : null}
      </span>
      <span className={styles.itemName}>
        <strong>{item.name}</strong>
        <span>{[item.parentName, item.departure ? `Salida ${item.departure}` : item.origin].filter(Boolean).join(' · ')}</span>
      </span>
      {followed ? <span className={styles.followedMark} aria-label="En mi programa"><StarIcon filled size={15} /></span> : null}
      {item.move ? <span className={item.move > 0 ? styles.moveUp : styles.moveDown} title="Cambio de puesto respecto a 2026">{item.move > 0 ? `↑ ${item.move}` : `↓ ${-item.move}`}</span> : null}
      <span className={styles.chevron} data-open={open ? 'true' : undefined}><ChevronIcon /></span>
    </button>

    <div id={panelId} className={styles.panel} hidden={!open}>
      {open ? <>
      {hasTimes ? <div className={styles.block}>
        <div className={styles.blockHead}>
          <h4>Horario</h4>
          <span className={styles.reference}>{item.timesSource === 'consejo' ? 'Consejo · 2026' : 'Referencia 2026'}</span>
        </div>
        <div className={styles.times}>
          <div><span>Salida</span><strong>{item.departure}</strong></div>
          {item.arrival ? <div><span>Entrada</span><strong>{item.arrival}</strong></div> : null}
        </div>
        {item.origin ? <p className={styles.origin}>Desde {item.origin}</p> : null}
      </div> : null}

      {item.cortejo.length ? <div className={styles.block}>
        <div className={styles.blockHead}><h4>Qué verás pasar</h4></div>
        <ol className={styles.cortejo}>
          {item.cortejo.map((step) => <li key={step.key}>
            <span className={styles.cortejoDot} aria-hidden="true" />
            <div>
              {step.href ? <Link href={step.href} className={styles.stepTitle}>{step.title}</Link> : <span className={styles.stepTitle}>{step.title}</span>}
              {step.silent && !step.bands.length ? <span className={styles.silent}>Sin acompañamiento musical</span> : null}
              {step.bands.length ? <div className={styles.bands}>
                {step.bands.map((band) => <button key={band.slug} type="button" className={styles.band} onClick={() => onPull(band.name)}>
                  <BandBadge band={band} />
                  <span className={styles.bandText}>
                    {band.segment ? <small>{band.segment}</small> : null}
                    <span>{band.name}</span>
                  </span>
                </button>)}
              </div> : null}
            </div>
          </li>)}
        </ol>
      </div> : null}

      <RouteLegs item={item} onPull={onPull} />

      {empty ? <p className={styles.empty}>Cortejo y horario en preparación. Mientras tanto, su ficha reúne titulares, pasos y patrimonio.</p> : null}

      <div className={styles.actions}>
        <Link href={item.href} className={styles.fichaLink}><span>Conoce {item.sentenceName}&nbsp;<span aria-hidden="true">→</span></span></Link>
        <button type="button" className={styles.iconButton} data-active={followed ? 'true' : undefined} aria-pressed={followed} aria-label={followed ? 'Quitar de mi programa' : 'Añadir a mi programa'} onClick={onFollow}>
          <StarIcon filled={followed} />
        </button>
        <button type="button" className={styles.iconButton} aria-label={`Compartir ${item.name}`} onClick={() => shareItem(item, day)}>
          <ShareIcon />
        </button>
      </div>
      </> : null}
    </div>
  </li>
}

function dayKicker(day) {
  if (day.kind === 'visperas') return 'Vísperas'
  if (day.status === 'pending') return 'Orden pendiente'
  return 'Orden por la Carrera Oficial'
}

function dayBadge(day) {
  if (day.kind === 'visperas') return { label: 'Por hora de salida', tone: 'neutral' }
  if (day.status === 'pending') return { label: 'Pendiente', tone: 'warn' }
  if (day.status === 'reference2026') return { label: 'Orden de 2026', tone: 'neutral' }
  return null
}

export default function HolyWeekProgramme({ days = [], initialDayId = '', dateLabels = {} }) {
  const [activeDay, setActiveDay] = useState(initialDayId || days[0]?.id || '')
  const [openKey, setOpenKey] = useState('')
  const [query, setQuery] = useState('')
  const followed = useSyncExternalStore(subscribeFollowed, followedSnapshot, followedServerSnapshot)
  const followedSlugs = useMemo(() => new Set(followed.map((item) => item.slug)), [followed])

  // Enlace compartido: #miercoles-santo--el-baratillo abre esa cofradía.
  useEffect(() => {
    function openFromHash() {
      const hash = decodeURIComponent(window.location.hash.replace(/^#/, ''))
      if (!hash) return
      const [dayId, itemKey] = hash.split('--')
      if (!days.some((day) => day.id === dayId)) return
      setQuery('')
      setActiveDay(dayId)
      if (itemKey) {
        setOpenKey(`${dayId}--${itemKey}`)
        window.requestAnimationFrame(() => document.getElementById(hash)?.scrollIntoView({ block: 'start' }))
      }
    }
    openFromHash()
    window.addEventListener('hashchange', openFromHash)
    return () => window.removeEventListener('hashchange', openFromHash)
  }, [days])

  // La pastilla de la jornada activa siempre a la vista en la tira.
  useEffect(() => {
    const tab = document.querySelector(`[data-day-tab="${activeDay}"]`)
    const strip = tab?.closest('nav')
    if (!tab || !strip) return
    // Solo desplazamiento horizontal de la tira: la página no se mueve.
    strip.scrollTo({ left: tab.offsetLeft - (strip.clientWidth - tab.offsetWidth) / 2, behavior: 'smooth' })
  }, [activeDay])

  const normalizedQuery = normalizeSearch(query)
  const searching = normalizedQuery.length >= 2
  const results = useMemo(() => {
    if (!searching) return []
    return days.flatMap((day) => day.items.map((item) => {
      const why = itemSearchMatch(item, normalizedQuery)
      return why ? { day, item, why } : null
    }).filter(Boolean))
  }, [days, normalizedQuery, searching])

  const mine = useMemo(() => days.flatMap((day) => day.items
    .filter((item) => followedSlugs.has(item.slug))
    .map((item) => ({ day, item }))), [days, followedSlugs])

  function goTo(dayId, itemKey = '') {
    setQuery('')
    setActiveDay(dayId)
    setOpenKey(itemKey ? `${dayId}--${itemKey}` : '')
    window.requestAnimationFrame(() => {
      const target = itemKey ? document.getElementById(`${dayId}--${itemKey}`) : document.getElementById('programa-jornada')
      target?.scrollIntoView({ block: 'start', behavior: 'smooth' })
    })
  }

  function follow(item) {
    writeFollowed(toggleFollowed(followed, { slug: item.slug, name: item.parentName || item.name, municipality: 'Sevilla' }))
  }

  return <div className={styles.programme}>
    <div className={styles.searchBar}>
      <label className={styles.search}>
        <SearchIcon />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Hermandad, banda o calle"
          aria-label="Buscar en el programa una hermandad, una banda o una calle"
        />
        {query ? <button type="button" onClick={() => setQuery('')} aria-label="Borrar búsqueda"><CloseIcon /></button> : null}
      </label>
      <p>Toca una banda o una calle para tirar del hilo.</p>
    </div>

    {searching ? <section className={styles.results} aria-live="polite">
      <p className={styles.resultsCount}><strong>{results.length}</strong> {results.length === 1 ? 'resultado' : 'resultados'} para «{query}»</p>
      {results.length ? <ul>
        {results.map(({ day, item, why }) => <li key={`${day.id}-${item.key}`}>
          <button type="button" onClick={() => goTo(day.id, item.key)}>
            <Crest item={item} size={36} />
            <span>
              <small>{day.name}</small>
              <strong>{item.name}</strong>
              <span>{why}</span>
            </span>
          </button>
        </li>)}
      </ul> : <p className={styles.noResults}>No aparece en el programa. Prueba con otra calle o con el nombre corto de la banda.</p>}
    </section> : null}

    <div hidden={searching}>
      <nav className={styles.days} aria-label="Jornadas">
        <ul>
          {days.map((day) => <li key={day.id}>
            <button
              type="button"
              aria-pressed={day.id === activeDay}
              data-day-tab={day.id}
              data-pending={day.status === 'pending' ? 'true' : undefined}
              onClick={() => { setActiveDay(day.id); setOpenKey('') }}
            >
              <strong>{day.short}</strong>
              <span>{dateLabels[day.id]?.short}</span>
            </button>
          </li>)}
          <li>
            <button type="button" aria-pressed={activeDay === MINE} data-day-tab={MINE} onClick={() => setActiveDay(MINE)} className={styles.mineTab}>
              <StarIcon filled={activeDay === MINE} size={16} />
              <span>Mi programa{followed.length ? ` · ${mine.length}` : ''}</span>
            </button>
          </li>
        </ul>
      </nav>

      <section id="programa-jornada" className={styles.mine} hidden={activeDay !== MINE} aria-labelledby="mi-programa-titulo">
        <h2 id="mi-programa-titulo">Mi programa</h2>
        <p>Las cofradías que marcas con la estrella, en el orden en que salen. Son las mismas de «Mis hermandades».</p>
        {mine.length ? <ul>
          {mine.map(({ day, item }) => <li key={`${day.id}-${item.key}`}>
            <button type="button" onClick={() => goTo(day.id, item.key)}>
              <Crest item={item} size={36} />
              <span>
                <small>{day.name} · {dateLabels[day.id]?.short}</small>
                <strong>{item.name}</strong>
                <span>{item.departure ? `Salida ${item.departure}${item.arrival ? ` · entrada ${item.arrival}` : ''} (2026)` : 'Horario 2027 por publicar'}</span>
              </span>
            </button>
          </li>)}
        </ul> : <p className={styles.noResults}>Aún no has marcado ninguna. Abre una cofradía y toca la estrella para añadirla.</p>}
      </section>

      {days.map((day, index) => {
        const badge = dayBadge(day)
        return <section key={day.id} id={day.id} className={styles.day} hidden={day.id !== activeDay} aria-labelledby={`${day.id}-titulo`}>
          <header className={styles.dayHead}>
            <p className={styles.kicker}>{dayKicker(day)}</p>
            <h2 id={`${day.id}-titulo`}>{day.name}</h2>
            <p className={styles.dayMeta}>{dateLabels[day.id]?.long} · {day.items.length} {day.items.length === 1 ? 'hermandad' : 'hermandades'}</p>
            {badge || day.note ? <p className={styles.dayNote}>
              {badge ? <span data-tone={badge.tone}>{badge.label}</span> : null}
              {day.note ? <span>{day.note}</span> : null}
            </p> : null}
          </header>

          <ol className={styles.list}>
            {day.items.map((item) => {
              const key = `${day.id}--${item.key}`
              return <ProgrammeItem
                key={key}
                item={item}
                day={day}
                open={openKey === key}
                onToggle={() => setOpenKey(openKey === key ? '' : key)}
                followed={followedSlugs.has(item.slug)}
                onFollow={() => follow(item)}
                onPull={(text) => { setQuery(text); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
              />
            })}
          </ol>

          <nav className={styles.pager} aria-label="Jornadas contiguas">
            {index > 0 ? <button type="button" onClick={() => goTo(days[index - 1].id)}><span>‹ Anterior</span><strong>{days[index - 1].name}</strong></button> : <span />}
            {index < days.length - 1 ? <button type="button" data-next="true" onClick={() => goTo(days[index + 1].id)}><span>Sigue con ›</span><strong>{days[index + 1].name}</strong></button> : null}
          </nav>
        </section>
      })}
    </div>
  </div>
}

