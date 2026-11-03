'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import styles from './crucetas.module.css'
import { plural } from '@/lib/plural'
import { musicalRepertoireMonthLabel, musicalRepertoireShortDate } from '@/lib/musical-repertoires/presentation'

function normalize(value = '') {
  return value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

// El título común es «Hermandad · fecha»: en la tarjeta la fecha ya va arriba.
function cardName(item) {
  return item.identityName || item.displayTitle.split(' · ')[0]
}

function groupByMonth(items) {
  const groups = []
  for (const item of items) {
    const key = (item.date || '').slice(0, 7) || 'sin-fecha'
    const last = groups.at(-1)
    if (last?.key === key) last.items.push(item)
    else groups.push({ key, label: musicalRepertoireMonthLabel(item.date), items: [item] })
  }
  return groups
}

export default function CrucetasDirectory({ repertoires }) {
  const [query, setQuery] = useState('')
  const [year, setYear] = useState('all')
  const [municipality, setMunicipality] = useState('all')
  const years = useMemo(() => [...new Set(repertoires.map((item) => item.year).filter(Boolean))].sort((a, b) => b - a), [repertoires])
  const municipalities = useMemo(() => [...new Set(repertoires.map((item) => item.municipality?.name).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'es')), [repertoires])
  const needle = normalize(query.trim())
  const visible = useMemo(() => repertoires
    .map((item) => {
      if ((year !== 'all' && String(item.year) !== year) || (municipality !== 'all' && item.municipality?.name !== municipality)) return null
      if (!needle) return { item, marchMatches: [] }
      const identity = normalize([item.displayTitle, item.band.name, item.brotherhood.name, item.municipality?.name, item.outingType].join(' '))
      const marchMatches = (item.marchTitles || []).filter((title) => normalize(title).includes(needle))
      return identity.includes(needle) || marchMatches.length ? { item, marchMatches } : null
    })
    .filter(Boolean), [municipality, needle, repertoires, year])
  const groups = useMemo(() => groupByMonth(visible.map(({ item }) => item)), [visible])
  const matchesById = useMemo(() => new Map(visible.map(({ item, marchMatches }) => [item.id, marchMatches])), [visible])

  return (
    <>
      <div className={`${styles.directoryToolbar} ${years.length > 1 ? '' : styles.directoryToolbarCompact}`}>
        <label className={styles.searchField}>
          <span>Buscar Hermandad, Banda o Marcha</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ej. San Gonzalo o Amarguras" type="search" />
        </label>
        {years.length > 1 ? (
          <label className={styles.filterField}>
            <span>Año</span>
            <select value={year} onChange={(event) => setYear(event.target.value)}>
              <option value="all">Todos</option>
              {years.map((value) => <option value={value} key={value}>{value}</option>)}
            </select>
          </label>
        ) : null}
        <label className={styles.filterField}>
          <span>Municipio</span>
          <select value={municipality} onChange={(event) => setMunicipality(event.target.value)}>
            <option value="all">Todos</option>
            {municipalities.map((value) => <option value={value} key={value}>{value}</option>)}
          </select>
        </label>
      </div>

      <div className={styles.resultLine} aria-live="polite">
        <strong>{visible.length}</strong> {visible.length === 1 ? 'cruceta encontrada' : 'crucetas encontradas'}
      </div>

      {groups.length ? groups.map((group) => (
        <section className={styles.monthGroup} key={group.key} aria-labelledby={`crucetas-${group.key}`}>
          <h2 className={styles.monthHeading} id={`crucetas-${group.key}`}>{group.label}<small>{group.items.length}</small></h2>
          <div className={styles.directoryGrid}>
            {group.items.map((item) => {
              const marchMatches = matchesById.get(item.id) || []
              return (
                <article className={styles.directoryCard} key={item.id} style={{ '--repertoire-primary': item.colors.primary, '--repertoire-accent': item.colors.accent }}>
                  <div className={styles.cardTopline}>
                    <time dateTime={item.date}>{musicalRepertoireShortDate(item.date) || item.year}</time>
                    {item.outingType ? <span>{item.outingType}</span> : null}
                  </div>
                  <h3><Link href={item.href}>{cardName(item)}</Link></h3>
                  <p className={styles.cardBand}>Por <strong>{item.band.name}</strong></p>
                  {marchMatches.length ? (
                    <p className={styles.cardMatch}>♪ {marchMatches.slice(0, 2).join(' · ')}{marchMatches.length > 2 ? ` y ${marchMatches.length - 2} más` : ''}</p>
                  ) : null}
                  <p className={styles.cardContext}>
                    {[item.municipality?.name, plural(item.worksCount, 'obra', 'obras'), plural(item.performancesCount, 'interpretación', 'interpretaciones')].filter(Boolean).join(' · ')}
                  </p>
                </article>
              )
            })}
          </div>
        </section>
      )) : <div className={styles.empty}>No hay crucetas que coincidan con esta búsqueda.</div>}
    </>
  )
}
