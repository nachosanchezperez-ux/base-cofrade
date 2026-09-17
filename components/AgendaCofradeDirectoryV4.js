'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { agendaLocationMatches, agendaMunicipalityOptions } from '@/lib/agenda-cofrade-location'
import styles from './AgendaCofradeDirectoryV4.module.css'
import concertStyles from './AgendaCofradeDirectoryV4Concerts.module.css'
import visualStyles from './AgendaCofradeDirectoryV4Visuals.module.css'

const categoryOptions = [
  ['processions', 'Procesiones'],
  ['transfers', 'Traslados'],
  ['rosaries', 'Rosarios públicos'],
  ['devotions', 'Besamanos y besapiés'],
  ['concerts', 'Conciertos'],
]

const visualFallbacks = {
  processions: { mark: 'PRO', label: 'Procesión' },
  transfers: { mark: 'TRA', label: 'Traslado' },
  rosaries: { mark: 'ROS', label: 'Rosario' },
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
  if (period === 'archive') return item.isPast || item.isCancelled
  if (!item.isUpcoming || item.isCancelled) return false
  if (period === 'today') return item.date <= today && (item.endDate || item.date) >= today
  if (period === 'weekend') {
    const [start, end] = weekendRange(today)
    return Boolean(item.date) && item.date <= end && (item.endDate || item.date) >= start
  }
  return true
}

function groupByMonth(items) {
  const groups = []
  const byKey = new Map()
  for (const item of items) {
    if (!byKey.has(item.monthKey)) {
      const group = { key: item.monthKey, label: item.monthLabel, items: [] }
      groups.push(group)
      byKey.set(item.monthKey, group)
    }
    byKey.get(item.monthKey).items.push(item)
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
      <div className={`${styles.cardVisual} ${visualStyles.visualContainer} ${visualStyles.fallbackFrame}`} aria-hidden="true">
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
    <div className={`${styles.cardVisual} ${visualStyles.visualContainer} ${kind === 'photo' ? visualStyles.photoFrame : visualStyles.crestFrame}`}>
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

function EventActions({ item }) {
  if (item.category === 'concerts') {
    const visibleBands = (item.bands || []).filter((band) => band.href).slice(0, 3)
    return (
      <div className={styles.cardActions}>
        {visibleBands.map((band, index) => (
          <Link href={band.href} key={band.id}>{index === 0 ? 'Ver banda' : band.name} {index === 0 ? <span>→</span> : null}</Link>
        ))}
        {item.relatedBrotherhoodHref ? <Link href={item.relatedBrotherhoodHref}>Ver Hermandad</Link> : null}
      </div>
    )
  }

  return (
    <div className={styles.cardActions}>
      {item.href ? <Link href={item.href}>{item.actionLabel || 'Ver acto'} <span>→</span></Link> : null}
      {item.organizerHref ? <Link href={item.organizerHref}>Ver Hermandad</Link> : null}
      {item.categoryHref && item.categoryHref !== item.href && item.categoryHref !== item.organizerHref ? <Link href={item.categoryHref}>Ver calendario</Link> : null}
    </div>
  )
}

function repertoireEntries(value = '') {
  return String(value)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !/^repertorio\s*:?$/i.test(line))
    .map((line, index) => {
      const isPremiere = /\(estreno\)/i.test(line)
      const clean = line.replace(/\s*\(estreno\)\s*/i, '').trim()
      const [title, ...authorParts] = clean.split(/\s+—\s+/)
      return {
        key: `${index}-${clean}`,
        title: title || clean,
        author: authorParts.join(' — '),
        isPremiere,
      }
    })
}

function ConcertRepertoire({ item }) {
  const entries = repertoireEntries(item.repertoireText)
  if (!entries.length) return null

  return (
    <details className={concertStyles.repertoire}>
      <summary>
        <span>Ver repertorio</span>
        <small>{entries.length} {entries.length === 1 ? 'marcha' : 'marchas'}</small>
      </summary>
      <ol className={concertStyles.repertoireList}>
        {entries.map((entry) => (
          <li className={concertStyles.repertoireItem} key={entry.key}>
            <span className={concertStyles.repertoireNumber} aria-hidden="true" />
            <div>
              <strong>{entry.title}</strong>
              {entry.author ? <span>{entry.author}</span> : null}
            </div>
            {entry.isPremiere ? <b>Estreno</b> : null}
          </li>
        ))}
      </ol>
    </details>
  )
}

export default function AgendaCofradeDirectoryV4({
  items,
  today,
  initialCategory = 'all',
  initialPeriod = 'upcoming',
  initialTerritory = 'all',
  initialMunicipality = '',
}) {
  const [period, setPeriod] = useState(initialPeriod)
  const [category, setCategory] = useState(initialCategory)
  const [territory, setTerritory] = useState(initialTerritory)
  const [municipality, setMunicipality] = useState(initialMunicipality)

  const periodCounts = useMemo(() => Object.fromEntries(
    ['today', 'weekend', 'upcoming', 'archive'].map((value) => [
      value,
      items.filter((item) => belongsToPeriod(item, value, today)).length,
    ])
  ), [items, today])

  const categoryCounts = useMemo(() => Object.fromEntries(categoryOptions.map(([value]) => [
    value,
    items.filter((item) => belongsToPeriod(item, 'upcoming', today) && item.category === value).length,
  ])), [items, today])

  const municipalityOptions = useMemo(() => agendaMunicipalityOptions(items), [items])

  const filtered = useMemo(() => {
    const selected = items.filter((item) => (
      belongsToPeriod(item, period, today)
      && (category === 'all' || item.category === category)
      && agendaLocationMatches(item, territory, municipality)
    ))
    return period === 'archive' ? [...selected].reverse() : selected
  }, [category, items, municipality, period, territory, today])

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

  return (
    <section id="agenda" className={styles.directory} aria-labelledby="agenda-v4-title">
      <div className={styles.sectionHead}>
        <div>
          <span>Sevilla y provincia</span>
          <h2 id="agenda-v4-title">Agenda de actos</h2>
        </div>
        <p>Elige cuándo, qué tipo de acto y dónde. Los meses y cada familia de actos se distinguen visualmente para localizar una cita de un vistazo.</p>
      </div>

      <div className={`${styles.quickTypes} ${concertStyles.quickTypesFive}`} aria-label="Elegir tipo de acto">
        {categoryOptions.map(([value, label]) => (
          <button
            type="button"
            data-category={value}
            className={category === value ? `${styles.quickTypeActive} ${value === 'concerts' ? concertStyles.quickTypeConcertActive : ''}` : ''}
            aria-pressed={category === value}
            onClick={() => setCategory(category === value ? 'all' : value)}
            key={value}
          >
            <span>{label}</span>
            <strong>{categoryCounts[value]}</strong>
            <small>próximos</small>
          </button>
        ))}
      </div>

      <div className={styles.controlPanel}>
        <div className={styles.controlBlock}>
          <span className={styles.controlLabel}>Cuándo</span>
          <div className={styles.periodGrid} aria-label="Cuándo consultar la agenda">
            {[
              ['today', 'Hoy'],
              ['weekend', 'Este fin de semana'],
              ['upcoming', 'Próximos actos'],
            ].map(([value, label]) => (
              <button
                type="button"
                className={period === value ? styles.controlActive : ''}
                aria-pressed={period === value}
                onClick={() => setPeriod(value)}
                key={value}
              >
                <span>{label}</span><strong>{periodCounts[value]}</strong>
              </button>
            ))}
          </div>
        </div>

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
                onClick={() => {
                  setTerritory(value)
                  if (value !== 'province') setMunicipality('')
                }}
                key={value}
              >{label}</button>
            ))}
          </div>
          {territory === 'province' && municipalityOptions.length ? (
            <label style={{ display: 'grid', gap: '6px', marginTop: '6px' }}>
              <span className={styles.controlLabel}>Municipio concreto</span>
              <select
                value={municipality}
                onChange={(event) => setMunicipality(event.target.value)}
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
                  fontSize: '12px',
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
      </div>

      <div className={styles.resultSummary} aria-live="polite">
        <div>
          <strong>{filtered.length} {filtered.length === 1 ? 'acto' : 'actos'}</strong>
          <span>{selectedCategoryLabel} · {territoryLabel}</span>
        </div>
        <div className={styles.summaryActions}>
          {category !== 'all' ? <button type="button" onClick={() => setCategory('all')}>Ver todos los tipos</button> : null}
          <button
            type="button"
            className={period === 'archive' ? styles.archiveActive : ''}
            aria-pressed={period === 'archive'}
            onClick={() => setPeriod(period === 'archive' ? 'upcoming' : 'archive')}
          >
            {period === 'archive' ? 'Volver a próximos' : `Archivo (${periodCounts.archive})`}
          </button>
        </div>
      </div>

      {groups.length > 1 ? (
        <nav className={styles.monthNavigation} aria-label="Ir directamente a un mes">
          {groups.map((group) => (
            <a href={`#${monthAnchor(group.key)}`} key={group.key}>
              <span>{group.label}</span>
              <strong>{group.items.length}</strong>
            </a>
          ))}
        </nav>
      ) : null}

      {groups.length ? (
        <div className={styles.months}>
          {groups.map((group) => {
            const breakdown = categoryBreakdown(group.items)
            const anchor = monthAnchor(group.key)
            return (
              <section className={styles.monthGroup} id={anchor} key={group.key} aria-labelledby={`${anchor}-title`}>
                <div className={styles.monthHeading}>
                  <div className={styles.monthIdentity}>
                    <span>Mes</span>
                    <h3 id={`${anchor}-title`}>{group.label}</h3>
                    <strong>{group.items.length} {group.items.length === 1 ? 'acto' : 'actos'}</strong>
                  </div>
                  <div className={styles.monthTypeSummary} aria-label={`Tipos de actos en ${group.label}`}>
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
                  {group.items.map((item) => (
                    <article className={`${styles.card} ${visualStyles.visualCard} ${item.category === 'concerts' ? concertStyles.concertCard : ''}`} key={item.key} data-category={item.category}>
                      <time className={styles.dateBlock} dateTime={item.date || undefined}>
                        <strong>{item.dateInfo.day}</strong>
                        <span>{item.dateInfo.month}</span>
                        {item.dateInfo.year ? <small>{item.dateInfo.year}</small> : null}
                      </time>
                      <div className={styles.cardBody}>
                        <div className={styles.cardTopline}>
                          <span data-category={item.category}>{item.categoryLabel}</span>
                          {item.isExtraordinary && item.category === 'rosaries' ? <b>Extraordinario</b> : null}
                          {item.isCancelled ? <small>Cancelado</small> : null}
                        </div>
                        <h4>{item.category === 'concerts' ? item.title : item.href ? <Link href={item.href}>{item.title}</Link> : item.title}</h4>
                        <p className={styles.organizer}>{item.organizer}</p>
                        <div className={styles.cardFacts}>
                          <span><b>Localidad</b>{item.municipality || 'Por confirmar'}</span>
                          <span><b>Horario</b>{item.timeText || (item.startTime ? `${item.startTime}${item.endTime ? `–${item.endTime}` : ''} h` : 'Por confirmar')}</span>
                          {item.place ? <span><b>Lugar</b>{item.place}</span> : null}
                        </div>
                        {item.summary ? <p className={styles.routePreview}>{item.summary}</p> : null}
                        {item.category === 'concerts' ? <ConcertRepertoire item={item} /> : null}
                        <EventActions item={item} />
                      </div>
                      <EventVisual item={item} />
                    </article>
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      ) : (
        <div className={styles.empty}>
          <strong>No hay actos en esta selección</strong>
          <p>Prueba con otro tipo de acto, territorio, municipio o periodo.</p>
        </div>
      )}
    </section>
  )
}
