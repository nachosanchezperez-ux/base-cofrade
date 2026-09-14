'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import styles from '@/app/agenda-cofrade/agenda-cofrade.module.css'

const categoryOptions = [['all', 'Todo'], ['extraordinary', 'Extraordinarias'], ['glories', 'Glorias'], ['rosaries', 'Rosarios'], ['crew', 'Igualás y ensayos']]

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
  if (period === 'today') return item.date === today
  if (period === 'weekend') {
    const [start, end] = weekendRange(today)
    return Boolean(item.date) && item.date >= start && item.date <= end
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

function statusLabel(item) {
  if (item.isCancelled) return 'Cancelado'
  if (item.isPast) return 'Celebrado'
  if (!item.date) return 'Fecha por confirmar'
  return 'Anunciado'
}

function EventVisual({ item }) {
  if (!item.imagePath) return null
  return <div className={styles.cardVisual} aria-hidden={!item.imageAlt}><Image src={item.imagePath} alt={item.imageAlt} fill sizes="(max-width: 720px) 84px, 132px" className={item.imageAlt ? styles.cardPhoto : styles.cardCrest} /></div>
}

export default function AgendaCofradeDirectory({ items, today }) {
  const [period, setPeriod] = useState('upcoming')
  const [category, setCategory] = useState('all')
  const [territory, setTerritory] = useState('all')
  const periodCounts = useMemo(() => Object.fromEntries(['today', 'weekend', 'upcoming', 'archive'].map((value) => [value, items.filter((item) => belongsToPeriod(item, value, today)).length])), [items, today])
  const filtered = useMemo(() => {
    const selected = items.filter((item) => belongsToPeriod(item, period, today) && (category === 'all' || item.category === category) && (territory === 'all' || item.scope === territory))
    return period === 'archive' ? selected.reverse() : selected
  }, [category, items, period, territory, today])
  const groups = useMemo(() => groupByMonth(filtered), [filtered])

  return (
    <section id="agenda" className={styles.directory} aria-labelledby="agenda-title">
      <div className={styles.sectionHead}><div><span>Sevilla y provincia</span><h2 id="agenda-title">Todo lo que está pasando</h2></div><p>Salidas, procesiones, rosarios, igualás y ensayos ordenados en una sola cronología.</p></div>
      <div className={styles.questionFilters} aria-label="Cuándo quieres consultar la Agenda Cofrade">
        {[['today', 'Qué ver hoy'], ['weekend', 'Este fin de semana'], ['upcoming', 'Próximos actos'], ['archive', 'Archivo']].map(([value, label]) => <button type="button" key={value} className={period === value ? styles.questionActive : ''} aria-pressed={period === value} onClick={() => setPeriod(value)}><span>{label}</span><strong>{periodCounts[value]}</strong></button>)}
      </div>
      <div className={styles.filters}>
        <div className={styles.segmented} aria-label="Filtrar por tipo de acto">{categoryOptions.map(([value, label]) => <button type="button" key={value} className={category === value ? styles.active : ''} aria-pressed={category === value} onClick={() => setCategory(value)}>{label}</button>)}</div>
        <div className={styles.segmented} aria-label="Filtrar por territorio">{[['all', 'Toda la provincia'], ['capital', 'Sevilla capital'], ['province', 'Municipios']].map(([value, label]) => <button type="button" key={value} className={territory === value ? styles.active : ''} aria-pressed={territory === value} onClick={() => setTerritory(value)}>{label}</button>)}</div>
      </div>
      <div className={styles.resultSummary} aria-live="polite"><strong>{filtered.length} {filtered.length === 1 ? 'cita' : 'citas'}</strong><span>{categoryOptions.find(([value]) => value === category)?.[1]} · {territory === 'all' ? 'Sevilla y provincia' : territory === 'capital' ? 'Sevilla capital' : 'municipios de la provincia'}</span></div>
      {groups.length ? <div className={styles.months}>{groups.map((group) => <section className={styles.monthGroup} key={group.key} aria-labelledby={`agenda-${group.key}`}><div className={styles.monthHeading}><h3 id={`agenda-${group.key}`}>{group.label}</h3><span>{group.items.length}</span></div><div className={styles.cards}>{group.items.map((item) => <article className={styles.card} key={item.key} data-category={item.category}><time className={styles.dateBlock} dateTime={item.date || undefined}><strong>{item.dateInfo.day}</strong><span>{item.dateInfo.month}</span>{item.dateInfo.year ? <small>{item.dateInfo.year}</small> : null}</time><div className={styles.cardBody}><div className={styles.cardTopline}><span className={styles.typeLabel} data-category={item.category}>{item.categoryLabel}</span>{item.isExtraordinary && item.category === 'rosaries' ? <b>Extraordinario</b> : null}<small data-status={item.eventStatus}>{statusLabel(item)}</small></div><h4><Link href={item.href}>{item.title}</Link></h4><p className={styles.organizer}>{item.organizer}</p><div className={styles.cardFacts}><span><b>Localidad</b>{item.municipality || 'Por confirmar'}</span><span><b>Horario</b>{item.startTime ? `${item.startTime}${item.endTime ? `–${item.endTime}` : ''} h` : 'Por confirmar'}</span></div>{item.summary ? <p className={styles.routePreview}>{item.summary}</p> : null}<div className={styles.cardActions}><Link href={item.href}>Ver ficha <span>→</span></Link>{item.organizerHref ? <Link href={item.organizerHref}>Entidad</Link> : null}</div></div><EventVisual item={item} /></article>)}</div></section>)}</div> : <div className={styles.empty}><strong>No hay citas en esta selección</strong><p>Prueba con otro tipo de acto, territorio o periodo.</p></div>}
    </section>
  )
}
