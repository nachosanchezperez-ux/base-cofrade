'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { agendaLocationMatches, agendaMunicipalityOptions } from '@/lib/agenda-cofrade-location'
import { getProcessionLiveState } from '@/lib/procession-live-status'
import { routeSummarySections } from '@/lib/procession-route'
import { agendaTemporalDateInfo, agendaTemporalRangeDate, withAgendaTemporalDay } from '@/lib/agenda-temporal-display'
import { trackEvent } from '@/lib/analytics/client'
import styles from './AgendaCofradeDirectoryV4.module.css'
import concertStyles from './AgendaCofradeDirectoryV4Concerts.module.css'
import routeStyles from './AgendaCofradeDirectoryV4Routes.module.css'
import visualStyles from './AgendaCofradeDirectoryV4Visuals.module.css'
import mobileStyles from './AgendaCofradeDirectoryMobile.module.css'

const AGENDA_TYPE = 'agenda_cofrade'

const categoryOptions = [
  ['processions', 'Procesiones'],
  ['transfers', 'Traslados'],
  ['rosaries', 'Rosarios públicos'],
  ['romeries', 'Romerías'],
  ['devotions', 'Besamanos y besapiés'],
  ['concerts', 'Conciertos'],
]

const visualFallbacks = {
  processions: { mark: 'PRO', label: 'Procesión' },
  transfers: { mark: 'TRA', label: 'Traslado' },
  rosaries: { mark: 'ROS', label: 'Rosario' },
  romeries: { mark: 'ROM', label: 'Romería' },
  devotions: { mark: 'DEV', label: 'Culto' },
  concerts: { mark: 'MÚS', label: 'Concierto' },
}

function addDays(value, amount) {
  const date = new Date(`${value}T12:00:00Z`)
  date.setUTCDate(date.getUTCDate() + amount)
  return date.toISOString().slice(0, 10)
}

function weekendRange(today) {
  const weekday = new Date(`${today}T12:00:00Z`).getUTCDay()
  const saturdayDistance = weekday === 0 ? -1 : weekday === 6 ? 0 : 6 - weekday
  const start = addDays(today, saturdayDistance)
  return [start, addDays(start, 1)]
}

function belongsToPeriod(item, period, today) {
  if (!item.isUpcoming || item.isCancelled) return false
  if (period === 'today') return item.date <= today && (item.endDate || item.date) >= today
  if (period === 'tomorrow') {
    const tomorrow = addDays(today, 1)
    return Boolean(item.date) && item.date <= tomorrow && (item.endDate || item.date) >= tomorrow
  }
  if (period === 'weekend') {
    const [start, end] = weekendRange(today)
    return Boolean(item.date) && item.date <= end && (item.endDate || item.date) >= start
  }
  return true
}

function periodDisplayDate(item, period, today) {
  if (period === 'today') return today
  if (period === 'tomorrow') return addDays(today, 1)
  if (period === 'weekend') {
    const [start, end] = weekendRange(today)
    return agendaTemporalRangeDate(item, start, end) || item.date
  }
  return ''
}

function compareDisplayItems(first, second) {
  return `${first?.temporalDate || first?.date || '9999-12-31'}T${first?.startTime || '23:59'}`
    .localeCompare(`${second?.temporalDate || second?.date || '9999-12-31'}T${second?.startTime || '23:59'}`)
}

function groupByMonth(items) {
  const groups = []
  const byKey = new Map()
  for (const item of items) {
    const monthKey = item.temporalDateInfo?.monthKey || item.monthKey
    const monthLabel = item.temporalDateInfo?.monthLabel || item.monthLabel
    if (!byKey.has(monthKey)) {
      const group = { key: monthKey, label: monthLabel, items: [] }
      groups.push(group)
      byKey.set(monthKey, group)
    }
    byKey.get(monthKey).items.push(item)
  }
  return groups
}

function categoryBreakdown(items) {
  return categoryOptions
    .map(([value, label]) => ({
      value,
      label,
      count: items.filter((item) => item.category === value).length,
    }))
    .filter((item) => item.count > 0)
}

function monthAnchor(key) {
  return `agenda-v4-${String(key || 'sin-fecha').replace(/[^a-z0-9-]/gi, '-')}`
}

function EventVisual({ item }) {
  const fallback = item.imageFallbackPath || ''
  const [src, setSrc] = useState(item.imagePath || fallback)
  const [kind, setKind] = useState(item.imageKind || (src ? 'crest' : 'fallback'))
  const emptyVisual = visualFallbacks[item.category] || { mark: 'HC', label: 'Acto' }

  if (!src) {
    return (
      <div className={`${styles.cardVisual} ${visualStyles.visualContainer} ${mobileStyles.visual} ${visualStyles.fallbackFrame}`} aria-hidden="true">
        <span className={visualStyles.fallbackMark}>{emptyVisual.mark}</span>
        <small>{emptyVisual.label}</small>
      </div>
    )
  }

  function handleError() {
    if (fallback && src !== fallback) {
      setSrc(fallback)
      setKind('crest')
      return
    }
    setSrc('')
    setKind('fallback')
  }

  return (
    <div className={`${styles.cardVisual} ${visualStyles.visualContainer} ${mobileStyles.visual} ${kind === 'photo' ? visualStyles.photoFrame : visualStyles.crestFrame}`}>
      <Image
        key={src}
        src={src}
        alt={item.imageAlt || ''}
        fill
        sizes="(max-width: 560px) 72px, (max-width: 720px) 92px, 126px"
        className={kind === 'photo' ? styles.cardPhoto : styles.cardCrest}
        onError={handleError}
      />
    </div>
  )
}

function trackAgendaEventOpen(item) {
  trackEvent('agenda_event_open', {
    event_name: item.title,
    event_type: item.category,
    municipality: item.municipality,
    event_date: item.date,
    agenda_type: AGENDA_TYPE,
  })
}

function trackAgendaEntityClick(item, destinationType, destinationName, linkContext) {
  trackEvent('entity_click', {
    source_entity_type: 'evento',
    source_entity_name: item.title,
    destination_entity_type: destinationType,
    destination_entity_name: destinationName,
    link_context: linkContext,
  })
}

function EventActions({ item }) {
  if (item.category === 'concerts') {
    const visibleBands = (item.bands || []).filter((band) => band.href).slice(0, 3)
    return (
      <div className={`${styles.cardActions} ${concertStyles.concertActions}`}>
        {visibleBands.map((band, index) => (
          <Link
            href={band.href}
            key={band.id}
            onClick={() => trackAgendaEntityClick(item, 'banda', band.name, 'agenda_event_actions')}
            data-analytics-skip-entity="true"
          >{index === 0 ? 'Ver banda' : band.name} {index === 0 ? <span>→</span> : null}</Link>
        ))}
        {item.relatedBrotherhoodHref ? (
          <Link
            href={item.relatedBrotherhoodHref}
            onClick={() => trackAgendaEntityClick(item, 'hermandad', item.organizer || 'Hermandad', 'agenda_event_actions')}
            data-analytics-skip-entity="true"
          >Ver Hermandad</Link>
        ) : null}
      </div>
    )
  }

  return (
    <div className={styles.cardActions}>
      {item.href ? <Link href={item.href} onClick={() => trackAgendaEventOpen(item)}>{item.actionLabel || 'Ver acto'} <span>→</span></Link> : null}
      {item.organizerHref ? (
        <Link
          href={item.organizerHref}
          onClick={() => trackAgendaEntityClick(item, 'hermandad', item.organizer || 'Hermandad', 'agenda_event_actions')}
          data-analytics-skip-entity="true"
        >Ver Hermandad</Link>
      ) : null}
      {item.municipalityHref ? (
        <Link
          href={item.municipalityHref}
          onClick={() => trackAgendaEntityClick(item, 'municipio', item.municipality, 'agenda_event_actions')}
          data-analytics-skip-entity="true"
        >Ver {item.municipality}</Link>
      ) : null}
      {item.categoryHref && item.categoryHref !== item.href && item.categoryHref !== item.organizerHref ? (
        <Link
          href={item.categoryHref}
          onClick={() => trackEvent('related_content_click', {
            source_type: 'evento',
            destination_type: 'agenda',
            destination_name: 'Calendario',
            section_name: 'agenda_event_actions',
          })}
        >Ver calendario</Link>
      ) : null}
    </div>
  )
}

function EventRoute({ item, inline = false }) {
  const routeText = String(item.routeText || '').trim()
  if (!routeText) return null

  const sections = routeSummarySections(routeText)
  const pointCount = sections.reduce((total, section) => total + section.points.length, 0)
  const Container = inline ? 'section' : 'details'
  const Heading = inline ? 'h5' : 'summary'

  return (
    <Container className={routeStyles.route}>
      <Heading>
        <span>{inline ? 'Recorrido' : 'Ver recorrido'}</span>
        <small>{pointCount ? `${pointCount} ${pointCount === 1 ? 'punto' : 'puntos'}` : item.categoryLabel || 'Recorrido'}</small>
      </Heading>
      {sections.length ? (
        <div className={routeStyles.routeSections}>
          {sections.map((section) => (
            <section className={routeStyles.routeSection} key={section.id}>
              <strong>{section.label}</strong>
              <ol className={routeStyles.routePoints}>
                {section.points.map((point, index) => (
                  <li key={`${section.id}-${index}-${point}`}>{point}</li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      ) : (
        <p className={routeStyles.routeFallback}>{routeText}</p>
      )}
    </Container>
  )
}

function repertoireData(value = '') {
  const raw = String(value).trim()
  if (!raw) return { entries: [], presenter: '' }

  const presenterMatch = raw.match(/(?:^|[.;]\s*|\n\s*)Presenta:\s*(.+?)\.?\s*$/i)
  const presenter = presenterMatch?.[1]?.trim().replace(/\.$/, '') || ''
  const repertoireText = (presenterMatch ? raw.slice(0, presenterMatch.index) : raw)
    .trim()
    .replace(/^repertorio\s*:\s*/i, '')

  const entries = repertoireText
    .split(/\n|;\s*/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !/^repertorio\s*:?$/i.test(line))
    .map((line, index) => {
      const premiereMatch = line.match(/\((estreno(?: absoluto)?)\)/i)
      const clean = line
        .replace(/\s*\(estreno(?: absoluto)?\)\s*/i, ' ')
        .replace(/^repertorio\s*:\s*/i, '')
        .trim()
      const [title, ...authorParts] = clean.split(/\s+—\s+/)
      const author = authorParts.join(' — ').trim().replace(/\.$/, '')

      return {
        key: `${index}-${clean}`,
        title: title || clean,
        author,
        premiereLabel: premiereMatch
          ? premiereMatch[1].replace(/^./, (letter) => letter.toUpperCase())
          : '',
      }
    })

  return { entries, presenter }
}

function concertProgramsForDisplay(item) {
  const structured = Array.isArray(item.programs)
    ? item.programs.filter((program) => Array.isArray(program.entries) && program.entries.length)
    : []

  if (structured.length) {
    return {
      structured: true,
      presenter: '',
      programs: structured.map((program) => ({
        ...program,
        entries: program.entries.map((entry, index) => ({
          ...entry,
          key: entry.id || `${program.id || 'program'}-${entry.order || index + 1}-${entry.title}`,
        })),
      })),
    }
  }

  const legacy = repertoireData(item.repertoireText)
  if (!legacy.entries.length) return { structured: false, presenter: '', programs: [] }

  return {
    structured: false,
    presenter: legacy.presenter,
    programs: [{
      id: 'legacy',
      title: 'Repertorio',
      programKind: 'legacy',
      bandName: '',
      entries: legacy.entries,
    }],
  }
}

function ConcertRepertoire({ item, inline = false }) {
  const { structured, presenter, programs } = concertProgramsForDisplay(item)
  const entryCount = programs.reduce((total, program) => total + program.entries.length, 0)
  if (!entryCount) return null

  const Container = inline ? 'section' : 'details'
  const Heading = inline ? 'h5' : 'summary'
  const headingLabel = structured
    ? (inline ? 'Programa musical' : 'Ver programa')
    : (inline ? 'Repertorio' : 'Ver repertorio')

  return (
    <Container className={concertStyles.repertoire}>
      <Heading>
        <span>{headingLabel}</span>
        <small>{entryCount} {entryCount === 1 ? 'marcha' : 'marchas'}</small>
      </Heading>
      <div className={concertStyles.programGroups}>
        {programs.map((program) => (
          <section className={concertStyles.programGroup} key={program.id || program.title}>
            {structured ? (
              <div className={concertStyles.programGroupHeader}>
                <div>
                  <strong>{program.title || 'Programa musical'}</strong>
                  {program.bandName ? <small>{program.bandName}</small> : null}
                </div>
                <span>{program.programKind === 'performed' ? 'Interpretado' : 'Programa anunciado'}</span>
              </div>
            ) : null}
            <ol className={concertStyles.repertoireList}>
              {program.entries.map((entry) => (
                <li className={concertStyles.repertoireItem} key={entry.key}>
                  <span className={concertStyles.repertoireNumber} aria-hidden="true" />
                  <div>
                    <strong>
                      {entry.href ? (
                        <Link
                          href={entry.href}
                          onClick={() => trackAgendaEntityClick(item, 'marcha', entry.title, 'agenda_concert_program')}
                          data-analytics-skip-entity="true"
                        >{entry.title}</Link>
                      ) : entry.title}
                    </strong>
                    {entry.author ? <span>{entry.author}</span> : null}
                  </div>
                  {entry.premiereLabel ? <b>{entry.premiereLabel}</b> : null}
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
      {presenter ? (
        <p className={concertStyles.repertoirePresenter}>
          <span>Presenta</span>
          <strong>{presenter}</strong>
        </p>
      ) : null}
    </Container>
  )
}

export default function AgendaCofradeDirectoryV4({
  items,
  today,
  initialCategory = 'all',
  initialPeriod = 'upcoming',
  initialTerritory = 'all',
  initialMunicipality = '',
  initialNowIso = '',
}) {
  const [period, setPeriod] = useState(initialPeriod)
  const [category, setCategory] = useState(initialCategory)
  const [territory, setTerritory] = useState(initialTerritory)
  const [municipality, setMunicipality] = useState(initialMunicipality)
  const [nowIso, setNowIso] = useState(initialNowIso || '1970-01-01T00:00:00.000Z')
  const currentYear = String(today || '').slice(0, 4)

  useEffect(() => {
    setNowIso(new Date().toISOString())
    const timer = window.setInterval(() => setNowIso(new Date().toISOString()), 60_000)
    return () => window.clearInterval(timer)
  }, [])

  const liveNow = useMemo(() => new Date(nowIso), [nowIso])

  const upcomingItems = useMemo(
    () => items.filter((item) => item.isUpcoming && !item.isCancelled),
    [items]
  )

  const liveItems = useMemo(() => upcomingItems
    .filter((item) => ['processions', 'transfers', 'rosaries'].includes(item.category)
      && belongsToPeriod(item, period, today)
      && (category === 'all' || item.category === category)
      && agendaLocationMatches(item, territory, municipality))
    .map((item) => ({
      ...item,
      liveState: getProcessionLiveState({
        date: item.date,
        endDate: item.endDate,
        startTime: item.startTime,
        endTime: item.endTime,
      }, liveNow),
    }))
    .filter((item) => item.liveState.isLive)
    .sort((left, right) => String(left.startTime || '').localeCompare(String(right.startTime || ''))),
  [liveNow, upcomingItems, period, today, category, territory, municipality]
  )

  const periodCounts = useMemo(() => Object.fromEntries(
    ['today', 'tomorrow', 'weekend', 'upcoming'].map((value) => [
      value,
      upcomingItems.filter((item) => belongsToPeriod(item, value, today)
        && (category === 'all' || item.category === category)
        && agendaLocationMatches(item, territory, municipality)).length,
    ])
  ), [upcomingItems, today, category, territory, municipality])

  const categoryCounts = useMemo(() => Object.fromEntries(categoryOptions.map(([value]) => [
    value,
    upcomingItems.filter((item) => item.category === value
      && belongsToPeriod(item, period, today)
      && agendaLocationMatches(item, territory, municipality)).length,
  ])), [upcomingItems, period, today, territory, municipality])

  const municipalityOptions = useMemo(() => agendaMunicipalityOptions(upcomingItems), [upcomingItems])

  const filtered = useMemo(() => upcomingItems
    .filter((item) => (
      belongsToPeriod(item, period, today)
      && (category === 'all' || item.category === category)
      && agendaLocationMatches(item, territory, municipality)
    ))
    .map((item) => {
      const displayDate = periodDisplayDate(item, period, today)
      // In the all-upcoming view, ongoing multi-day events use today's schedule.
      const visibleDate = displayDate || (item.date < today && (item.endDate || item.date) >= today ? today : item.date)
      return visibleDate ? withAgendaTemporalDay(item, visibleDate) : item
    })
    .sort(compareDisplayItems),
  [category, upcomingItems, municipality, period, territory, today])

  const groups = useMemo(() => groupByMonth(filtered), [filtered])
  const selectedCategoryLabel = category === 'all'
    ? 'Todos los tipos'
    : categoryOptions.find(([value]) => value === category)?.[1]
  const selectedMunicipalityLabel = municipalityOptions.find((option) => option.slug === municipality)?.label || ''
  const territoryLabel = territory === 'all'
    ? 'Sevilla y provincia'
    : territory === 'capital'
      ? 'Sevilla capital'
      : selectedMunicipalityLabel || 'municipios'

  const [weekendStart, weekendEnd] = weekendRange(today)
  const shortDate = (value) => new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', timeZone: 'Europe/Madrid' }).format(new Date(`${value}T12:00:00Z`))
  const periodDates = { today: shortDate(today), tomorrow: shortDate(addDays(today, 1)), weekend: weekendStart.slice(0, 7) === weekendEnd.slice(0, 7) ? `${Number(weekendStart.slice(8))}–${shortDate(weekendEnd)}` : `${shortDate(weekendStart)} – ${shortDate(weekendEnd)}`, upcoming: 'Todas las fechas' }
  const clearFilters = () => { setCategory('all'); setTerritory('all'); setMunicipality('') }

  const chooseCategory = (value) => {
    const next = category === value ? 'all' : value
    setCategory(next)
    trackEvent('agenda_filter', {
      filter_type: 'tipo_acto',
      filter_value: next === 'all' ? 'todos' : next,
      agenda_type: AGENDA_TYPE,
    })
  }

  const choosePeriod = (value) => {
    setPeriod(value)
    document.getElementById('agenda')?.scrollIntoView({ block: 'start' })
    trackEvent('agenda_period_select', {
      period: value,
      agenda_type: AGENDA_TYPE,
    })
  }

  const chooseTerritory = (value) => {
    setTerritory(value)
    if (value !== 'province') setMunicipality('')
    trackEvent('agenda_filter', {
      filter_type: 'territorio',
      filter_value: value,
      agenda_type: AGENDA_TYPE,
    })
  }

  const chooseMunicipality = (value) => {
    setMunicipality(value)
    const label = municipalityOptions.find((option) => option.slug === value)?.label || 'todos'
    trackEvent('agenda_filter', {
      filter_type: 'municipio',
      filter_value: label,
      agenda_type: AGENDA_TYPE,
    })
  }

  return (
    <section id="agenda" className={`${styles.directory} ${mobileStyles.directory}`} aria-labelledby="agenda-v4-title">
      <div className={`${styles.sectionHead} ${mobileStyles.sectionHead}`}>
        <div>
          <span>Sevilla y provincia</span>
          <h2 id="agenda-v4-title">Agenda de actos</h2>
        </div>
        <p>Solo mostramos lo que está por venir. Elige cuándo, qué tipo de acto y dónde para localizar una cita de un vistazo.</p>
      </div>

        <div className={`${styles.controlBlock} ${mobileStyles.whenControls}`}>
          <span className={`${styles.controlLabel} ${mobileStyles.whenLabel}`}>Cuándo</span>
          <div className={`${styles.periodGrid} ${mobileStyles.periodGrid}`} aria-label="Cuándo consultar la agenda">
            {[
              ['today', 'Hoy'],
              ['tomorrow', 'Mañana'],
              ['weekend', 'Fin de semana'],
              ['upcoming', 'Próximos'],
            ].map(([value, label]) => (
              <button
                type="button"
                className={period === value ? styles.controlActive : ''}
                aria-pressed={period === value}
                onClick={() => choosePeriod(value)}
                key={value}
              >
                <span>{label}<small>{periodDates[value]}</small></span><strong>{periodCounts[value]}</strong>
              </button>
            ))}
          </div>
        </div>

      <details className={mobileStyles.filters}>
        <summary><span>Filtrar por lugar y tipo</span><small>{category !== 'all' || territory !== 'all' ? 'Activos' : ''} <b aria-hidden="true">+</b></small></summary>
        <div className={mobileStyles.filterContent}>
        <div className={styles.controlBlock}>
          <span className={styles.controlLabel}>Dónde</span>
          <div className={styles.territoryGrid} aria-label="Dónde consultar la agenda">
            {[
              ['all', 'Toda la provincia'],
              ['capital', 'Sevilla capital'],
              ['province', 'Municipios'],
            ].map(([value, label]) => (
              <button
                type="button"
                className={territory === value ? styles.controlActive : ''}
                aria-pressed={territory === value}
                onClick={() => chooseTerritory(value)}
                key={value}
              >{label}</button>
            ))}
          </div>
          {territory === 'province' && municipalityOptions.length ? (
            <label style={{ display: 'grid', gap: '6px', marginTop: '6px' }}>
              <span className={styles.controlLabel}>Municipio concreto</span>
              <select
                value={municipality}
                onChange={(event) => chooseMunicipality(event.target.value)}
                aria-label="Elegir municipio"
                style={{
                  width: '100%',
                  minHeight: '44px',
                  padding: '0 12px',
                  border: '1px solid #dedbd4',
                  borderRadius: '10px',
                  background: '#fff',
                  color: '#26394c',
                  font: 'inherit',
                  fontSize: '16px',
                  fontWeight: 750,
                }}
              >
                <option value="">Todos los municipios</option>
                {municipalityOptions.map((option) => (
                  <option value={option.slug} key={option.slug}>{option.label}</option>
                ))}
              </select>
            </label>
          ) : null}
        </div>
      <div className={`${styles.quickTypes} ${concertStyles.quickTypesSix}`} aria-label="Elegir tipo de acto">
        {categoryOptions.map(([value, label]) => (
          <button
            type="button"
            data-category={value}
            className={category === value ? `${styles.quickTypeActive} ${value === 'concerts' ? concertStyles.quickTypeConcertActive : ''}` : ''}
            aria-pressed={category === value}
            onClick={() => chooseCategory(value)}
            key={value}
          >
            <span>{label}</span>
            <strong>{categoryCounts[value]}</strong>
            <small>actos</small>
          </button>
        ))}
      </div>

          <button type="button" className={mobileStyles.clearFilters} onClick={clearFilters}>Limpiar filtros</button>
        </div>
      </details>

      {liveItems.length ? (
        <section className={styles.livePanel} aria-labelledby="agenda-live-title">
          <div className={styles.livePanelHead}>
            <div>
              <span><i aria-hidden="true" /> Ahora mismo</span>
              <h3 id="agenda-live-title">{liveItems.length} {liveItems.length === 1 ? 'procesión en curso' : 'procesiones en curso'}</h3>
            </div>
            <p>Las salidas que están en la calle se mantienen arriba aunque coincidan varias a la vez.</p>
          </div>
          <div className={styles.liveList}>
            {liveItems.map((item) => (
              <article className={styles.liveItem} key={`live:${item.key}`}>
                <div>
                  <span>{item.categoryLabel}</span>
                  <h4>{item.href ? <Link href={item.href} onClick={() => trackAgendaEventOpen(item)}>{item.title}</Link> : item.title}</h4>
                  <p>{[item.municipality, item.organizer].filter(Boolean).join(' · ')}</p>
                </div>
                <div className={styles.liveTimes}>
                  {item.startTime ? <span>Salida <strong>{item.startTime}</strong></span> : null}
                  {item.endTime ? <span>Entrada <strong>{item.endTime}</strong></span> : null}
                </div>
                {item.href ? <Link className={styles.liveAction} href={item.href} onClick={() => trackAgendaEventOpen(item)}>Seguir <span aria-hidden="true">→</span></Link> : null}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <div className={`${styles.resultSummary} ${mobileStyles.resultSummary}`} aria-live="polite">
        <div>
          <strong>{filtered.length} {filtered.length === 1 ? 'acto' : 'actos'}</strong>
          <span>{selectedCategoryLabel} · {territoryLabel}</span>
        </div>
        {category !== 'all' || territory !== 'all' ? (
          <div className={styles.summaryActions}>
            <button type="button" onClick={clearFilters}>Limpiar filtros</button>
          </div>
        ) : null}
      </div>

      {groups.length > 1 ? (
        <details className={mobileStyles.monthPicker}><summary>Ir a otro mes <span aria-hidden="true">⌄</span></summary>
        <nav className={styles.monthNavigation} aria-label="Ir directamente a un mes">
          {groups.map((group) => (
            <a href={`#${monthAnchor(group.key)}`} key={group.key}>
              <span>{group.label}</span>
              <strong>{group.items.length}</strong>
            </a>
          ))}
        </nav></details>
      ) : null}

      {groups.length ? (
        <div className={styles.months}>
          {groups.map((group) => {
            const breakdown = categoryBreakdown(group.items)
            const anchor = monthAnchor(group.key)
            return (
              <section className={styles.monthGroup} id={anchor} key={group.key} aria-labelledby={`${anchor}-title`}>
                <div className={`${styles.monthHeading} ${mobileStyles.monthHeading}`}>
                  <div className={styles.monthIdentity}>
                    <span>Mes</span>
                    <h3 id={`${anchor}-title`}>{group.label}</h3>
                    <strong>{group.items.length} {group.items.length === 1 ? 'acto' : 'actos'}</strong>
                  </div>
                  <div className={`${styles.monthTypeSummary} ${mobileStyles.monthTypeSummary}`} aria-label={`Tipos de actos en ${group.label}`}>
                    {breakdown.map((type) => (
                      <span data-category={type.value} key={type.value}>
                        <i aria-hidden="true" />
                        {type.label}
                        <b>{type.count}</b>
                      </span>
                    ))}
                  </div>
                </div>
                <div className={styles.cards}>
                  {group.items.map((item) => {
                    const displayDateInfo = item.temporalDateInfo || item.dateInfo || agendaTemporalDateInfo(item.date)
                    const cardLiveState = ['processions', 'transfers', 'rosaries'].includes(item.category)
                      ? getProcessionLiveState({
                          date: item.date,
                          endDate: item.endDate,
                          startTime: item.startTime,
                          endTime: item.endTime,
                        }, liveNow)
                      : { state: 'upcoming', isLive: false }

                    return (
                    <article className={`${styles.card} ${visualStyles.visualCard} ${mobileStyles.card} ${item.category === 'concerts' ? concertStyles.concertCard : ''} ${cardLiveState.isLive ? styles.cardLive : ''}`} key={item.key} data-category={item.category} data-live={cardLiveState.isLive ? 'true' : undefined}>
                      <time className={`${styles.dateBlock} ${mobileStyles.dateBlock}`} dateTime={item.temporalDate || item.date || undefined}>
                        <em className={mobileStyles.weekday}>{displayDateInfo.weekdayLabel?.split(',')[0]?.split(' ')[0]}</em>
                        <strong>{displayDateInfo.day}</strong>
                        <span>{displayDateInfo.month}</span>
                        {displayDateInfo.year && String(displayDateInfo.year) !== currentYear ? <small>{displayDateInfo.year}</small> : null}
                      </time>
                      <div className={`${styles.cardBody} ${mobileStyles.cardBody}`}>
                        <span className={mobileStyles.schedule}><b>Horario</b><strong>{item.timeText || (item.startTime ? `${item.startTime}${item.endTime ? `–${item.endTime}` : ''} h` : 'Por confirmar')}</strong></span>
                        <div className={styles.cardTopline}>
                          <span data-category={item.category}>{item.categoryLabel}</span>
                          {item.isExtraordinary && item.category === 'rosaries' ? <b>Extraordinario</b> : null}
                          {cardLiveState.isLive ? <small className={styles.liveBadge}><i aria-hidden="true" /> En curso</small> : null}
                        </div>
                        <h4>{item.category === 'concerts' ? item.title : item.href ? <Link href={item.href} onClick={() => trackAgendaEventOpen(item)}>{item.title}</Link> : item.title}</h4>
                        <p className={`${styles.organizer} ${mobileStyles.organizer}`}>{item.organizer}</p>
                        {item.endDate && item.endDate !== item.date ? <p className={mobileStyles.dateRange}>Del {shortDate(item.date)} al {shortDate(item.endDate)}{item.endDate.slice(0, 4) !== currentYear ? ` de ${item.endDate.slice(0, 4)}` : ''}</p> : null}
                        <div className={`${styles.cardFacts} ${mobileStyles.cardFacts}`}>
                          <span><b>Localidad</b>{item.municipality || 'Por confirmar'}</span>
                          {item.place ? <span><b>Lugar</b>{item.place}</span> : null}
                        </div>
                        <details className={mobileStyles.eventDetails}>
                          <summary><span>{item.routeText ? 'Información y recorrido' : 'Información del evento'}</span><b aria-hidden="true">+</b></summary>
                          <div className={mobileStyles.eventDetailBody}>
                            {item.daySchedules?.length > 1 ? (
                              <section className={mobileStyles.daySchedules} aria-label="Horarios por día">
                                <h5>Horarios por día</h5>
                                {item.daySchedules.map((day, index) => (
                                  <p key={`${day.celebrationDate}-${index}`}><time dateTime={day.celebrationDate}>{agendaTemporalDateInfo(day.celebrationDate).weekdayLabel}</time><strong>{day.timeText || (day.startTime ? `${day.startTime}${day.endTime ? `–${day.endTime}` : ''} h` : 'Por confirmar')}</strong></p>
                                ))}
                              </section>
                            ) : null}
                            {item.summary && item.summary !== item.routeText ? <p>{item.summary}</p> : null}
                            {item.routeText && ['processions', 'transfers', 'rosaries', 'romeries'].includes(item.category) ? <EventRoute item={item} inline /> : null}
                            {item.category === 'concerts' ? <ConcertRepertoire item={item} inline /> : null}
                            <EventActions item={item} />
                          </div>
                        </details>
                      </div>
                      <EventVisual item={item} />
                    </article>
                    )
                  })}
                </div>
              </section>
            )
          })}
        </div>
      ) : (
        <div className={styles.empty}>
          <strong>No hay próximos actos en esta selección</strong>
          <p>Prueba con otro tipo de acto, territorio, municipio o periodo.</p>
          <button type="button" className={mobileStyles.clearFilters} onClick={() => { clearFilters(); choosePeriod('upcoming') }}>Ver todos los próximos actos</button>
        </div>
      )}
    </section>
  )
}
