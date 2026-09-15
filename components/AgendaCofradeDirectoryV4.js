'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import styles from './AgendaCofradeDirectoryV4.module.css'

const categoryOptions = [
  ['processions', 'Procesiones'],
  ['transfers', 'Traslados'],
  ['rosaries', 'Rosarios'],
  ['devotions', 'Besamanos y besapiés'],
]

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

function EventVisual({ item }) {
  if (!item.imagePath) return null
  return (
    <div className={styles.cardVisual} aria-hidden={!item.imageAlt}>
      <Image
        src={item.imagePath}
        alt={item.imageAlt}
        fill
        sizes="(max-width: 720px) 84px, 126px"
        className={item.imageAlt ? styles.cardPhoto : styles.cardCrest}
      />
    </div>
  )
}

export default function AgendaCofradeDirectoryV4({
  items,
  today,
  initialCategory = 'all',
  initialPeriod = 'upcoming',
  initialTerritory = 'all',
}) {
  const [period, setPeriod] = useState(initialPeriod)
  const [category, setCategory] = useState(initialCategory)
  const [territory, setTerritory] = useState(initialTerritory)

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

  const filtered = useMemo(() => {
    const selected = items.filter((item) => (
      belongsToPeriod(item, period, today)
      && (category === 'all' || item.category === category)
      && (territory === 'all' || item.scope === territory)
    ))
    return period === 'archive' ? [...selected].reverse() : selected
  }, [category, items, period, territory, today])

  const groups = useMemo(() => groupByMonth(filtered), [filtered])
  const selectedCategoryLabel = category === 'all'
    ? 'Todos los tipos'
    : categoryOptions.find(([value]) => value === category)?.[1]

  return (
    <section id="agenda" className={styles.directory} aria-labelledby="agenda-v4-title">
      <div className={styles.sectionHead}>
        <div>
          <span>Sevilla y provincia</span>
          <h2 id="agenda-v4-title">Agenda de actos</h2>
        </div>
        <p>Elige cuándo, qué tipo de acto y dónde. Todo queda visible sin abrir menús intermedios.</p>
      </div>

      <div className={styles.quickTypes} aria-label="Elegir tipo de acto">
        {categoryOptions.map(([value, label]) => (
          <button
            type="button"
            data-category={value}
            className={category === value ? styles.quickTypeActive : ''}
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
                onClick={() => setTerritory(value)}
                key={value}
              >{label}</button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.resultSummary} aria-live="polite">
        <div>
          <strong>{filtered.length} {filtered.length === 1 ? 'acto' : 'actos'}</strong>
          <span>{selectedCategoryLabel} · {territory === 'all' ? 'Sevilla y provincia' : territory === 'capital' ? 'Sevilla capital' : 'municipios'}</span>
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

      {groups.length ? (
        <div className={styles.months}>
          {groups.map((group) => (
            <section className={styles.monthGroup} key={group.key} aria-labelledby={`agenda-v4-${group.key}`}>
              <div className={styles.monthHeading}>
                <h3 id={`agenda-v4-${group.key}`}>{group.label}</h3><span>{group.items.length}</span>
              </div>
              <div className={styles.cards}>
                {group.items.map((item) => (
                  <article className={styles.card} key={item.key} data-category={item.category}>
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
                      <h4><Link href={item.href}>{item.title}</Link></h4>
                      <p className={styles.organizer}>{item.organizer}</p>
                      <div className={styles.cardFacts}>
                        <span><b>Localidad</b>{item.municipality || 'Por confirmar'}</span>
                        <span><b>Horario</b>{item.timeText || (item.startTime ? `${item.startTime}${item.endTime ? `–${item.endTime}` : ''} h` : 'Por confirmar')}</span>
                      </div>
                      {item.summary ? <p className={styles.routePreview}>{item.summary}</p> : null}
                      <div className={styles.cardActions}>
                        <Link href={item.href}>{item.actionLabel || 'Ver acto'} <span>→</span></Link>
                        {item.organizerHref ? <Link href={item.organizerHref}>Ver Hermandad</Link> : null}
                        {item.categoryHref && item.categoryHref !== item.href && item.categoryHref !== item.organizerHref ? <Link href={item.categoryHref}>Ver calendario</Link> : null}
                      </div>
                    </div>
                    <EventVisual item={item} />
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <strong>No hay actos en esta selección</strong>
          <p>Prueba con otro tipo de acto, territorio o periodo.</p>
        </div>
      )}
    </section>
  )
}
