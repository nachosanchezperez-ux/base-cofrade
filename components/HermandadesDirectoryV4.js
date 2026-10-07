'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import BrotherhoodDirectoryCard from '@/components/BrotherhoodDirectoryCard'
import { filterDirectoryBrotherhoods } from '@/lib/brotherhood-directory-navigation'
import {
  DIRECTORY_TYPES,
  HOLY_WEEK_DAYS,
  MONTHS,
  directoryPeriod,
  directorySlug,
  hasDirectoryType,
  normalizeDirectoryValue,
} from '@/lib/brotherhood-directory'
import styles from './HermandadesDirectoryV4.module.css'

function countLabel(type, count) {
  if (count === 1) return type.itemSingular || 'hermandad'
  return type.itemPlural || 'hermandades'
}

function periodRows(items, typeKey, orderedPeriods) {
  const rows = orderedPeriods.map((label) => ({
    label,
    items: items.filter((item) => directoryPeriod(item, typeKey) === label),
  })).filter((row) => row.items.length)

  const undocumented = items.filter((item) => !directoryPeriod(item, typeKey))
  if (undocumented.length) rows.push({ label: 'Sin fecha documentada', period: '', items: undocumented })
  return rows
}

function CapitalFamily({ title, kicker, typeKey, items, orderedPeriods, routes, onSelect }) {
  const rows = periodRows(items, typeKey, orderedPeriods)

  return (
    <section className={styles.familyCard} data-family={typeKey}>
      <header className={styles.familyHeader}>
        <div>
          <span>{kicker}</span>
          <h3>{title}</h3>
        </div>
        <button type="button" onClick={() => onSelect(typeKey)} aria-label={`Ver todas las de ${title} en Sevilla capital`}>
          Ver todas <b aria-hidden="true">→</b>
        </button>
      </header>
      <div className={styles.periodGrid}>
        {rows.map((row) => {
          const period = row.period ?? row.label
          const href = `/hermandades/${typeKey}/sevilla-capital/${directorySlug(period)}`
          const count = routes[href]

          return count ? (
            <Link className={styles.periodLink} href={href} prefetch={false} key={`${typeKey}-${row.label}`}>
              <span>{row.label}</span><strong>{count}</strong>
            </Link>
          ) : (
            <button className={styles.periodLink} type="button" onClick={() => onSelect(typeKey, period)} key={`${typeKey}-${row.label}`}>
              <span>{row.label}</span><strong>{row.items.length}</strong>
            </button>
          )
        })}
      </div>
    </section>
  )
}

function CapitalHub({ items, routes, onSelect }) {
  const byType = Object.fromEntries(DIRECTORY_TYPES.map((type) => [
    type.key,
    items.filter((item) => hasDirectoryType(item, type.key)),
  ]))

  return (
    <section className={styles.capitalHub} aria-labelledby="capital-v4-title">
      <div className={styles.hubHeading}>
        <div>
          <h2 id="capital-v4-title">Sevilla capital</h2>
        </div>
        <strong>{items.length} corporaciones</strong>
      </div>

      <div className={styles.calendarGrid}>
        <CapitalFamily
          title="Semana Santa"
          kicker="Por jornada"
          typeKey="semana-santa"
          items={byType['semana-santa']}
          orderedPeriods={HOLY_WEEK_DAYS}
          routes={routes}
          onSelect={onSelect}
        />
        <CapitalFamily
          title="Glorias"
          kicker="Por mes"
          typeKey="gloria"
          items={byType.gloria}
          orderedPeriods={MONTHS}
          routes={routes}
          onSelect={onSelect}
        />
      </div>

      <nav className={styles.institutionalGrid} aria-label="Otros directorios de Sevilla capital">
        {DIRECTORY_TYPES.filter((type) => ['sacramentales', 'agrupaciones-parroquiales'].includes(type.key)).map((type) => {
          const href = `${type.href}/sevilla-capital`
          const count = routes[href]
          const content = <><span>{type.label}</span><strong>{count ?? byType[type.key].length}</strong><b aria-hidden="true">→</b></>
          return count ? (
            <Link href={href} prefetch={false} key={type.key}>{content}</Link>
          ) : (
            <button type="button" onClick={() => onSelect(type.key)} key={type.key}>{content}</button>
          )
        })}
      </nav>
    </section>
  )
}

function ProvinceHub({ stats, onSelect }) {
  const [showAll, setShowAll] = useState(false)

  const quickStats = useMemo(() => [...stats]
    .sort((first, second) => second.count - first.count
      || first.label.localeCompare(second.label, 'es', { sensitivity: 'base' }))
    .slice(0, 6), [stats])

  const visibleStats = showAll ? stats : quickStats

  return (
    <section className={styles.provinceHub} aria-labelledby="province-v4-title">
      <div className={styles.hubHeading}>
        <div>
          <h2 id="province-v4-title">Municipios de la provincia</h2>
        </div>
        <strong>{stats.length} municipios</strong>
      </div>

      {visibleStats.length ? (
        <div className={styles.municipalityGrid}>
          {visibleStats.map((item) => (
            <button type="button" onClick={() => onSelect(item.key)} key={item.key}>
              <span>{item.label}</span><strong>{item.count}</strong>
            </button>
          ))}
        </div>
      ) : (
        <div className={styles.municipalityEmpty}>
          <strong>No encontramos ese municipio</strong>
          <span>Prueba con otro nombre.</span>
        </div>
      )}

      {stats.length > quickStats.length ? (
        <button
          type="button"
          className={styles.municipalityToggle}
          aria-expanded={showAll}
          onClick={() => setShowAll((current) => !current)}
        >
          <span>{showAll ? 'Ver menos municipios' : `Ver todos los municipios (${stats.length})`}</span>
          <b aria-hidden="true">{showAll ? '↑' : '↓'}</b>
        </button>
      ) : null}
    </section>
  )
}

export default function HermandadesDirectoryV4({ hermandades, navigation }) {
  const [query, setQuery] = useState('')
  const [territory, setTerritory] = useState('todos')
  const [municipality, setMunicipality] = useState('todos')
  const [calendar, setCalendar] = useState(null)
  const searchRef = useRef(null)
  const resultsRef = useRef(null)
  const focusResults = useRef(false)

  const capitalItems = useMemo(() => hermandades.filter((item) => normalizeDirectoryValue(item.localidad) === 'sevilla'), [hermandades])
  const provinceItems = useMemo(() => hermandades.filter((item) => normalizeDirectoryValue(item.localidad) !== 'sevilla'), [hermandades])

  const municipalityStats = useMemo(() => {
    const grouped = new Map()
    for (const item of provinceItems) {
      if (!item.localidad) continue
      const key = normalizeDirectoryValue(item.localidad)
      if (!grouped.has(key)) grouped.set(key, { key, label: item.localidad, count: 0 })
      grouped.get(key).count += 1
    }
    return [...grouped.values()].sort((first, second) => first.label.localeCompare(second.label, 'es', { sensitivity: 'base' }))
  }, [provinceItems])

  const municipalityOptions = useMemo(() => [
    { key: 'sevilla', label: 'Sevilla capital' },
    ...municipalityStats.map(({ key, label }) => ({ key, label })),
  ], [municipalityStats])

  const filtered = useMemo(() => filterDirectoryBrotherhoods(hermandades, {
    query, territory, municipality,
    typeKey: calendar?.typeKey,
    period: calendar?.period ?? null,
  }), [hermandades, municipality, query, territory, calendar])

  const showResults = Boolean(query.trim()) || municipality !== 'todos' || Boolean(calendar)
  const context = [
    municipalityOptions.find((item) => item.key === municipality)?.label
      || ({ capital: 'Sevilla capital', provincia: 'Provincia' })[territory],
    DIRECTORY_TYPES.find((type) => type.key === calendar?.typeKey)?.label,
    calendar?.period === '' ? 'Sin fecha documentada' : calendar?.period,
  ].filter(Boolean).join(' · ')

  useEffect(() => {
    if (showResults && focusResults.current) {
      resultsRef.current?.focus()
      focusResults.current = false
    }
  }, [showResults, municipality, calendar])

  function changeTerritory(next) {
    focusResults.current = false
    setCalendar(null)
    setTerritory(next)
    if (next === 'capital' && municipality !== 'sevilla') setMunicipality('todos')
    if (next === 'provincia' && municipality === 'sevilla') setMunicipality('todos')
  }

  function changeMunicipality(next, moveFocus = false) {
    focusResults.current = moveFocus
    setCalendar(null)
    setMunicipality(next)
    if (next === 'todos') return
    setTerritory(next === 'sevilla' ? 'capital' : 'provincia')
  }

  function selectCalendar(typeKey, period = null) {
    setCalendar({ typeKey, period })
    setMunicipality('sevilla')
    setTerritory('capital')
    focusResults.current = true
  }

  function clearFilters() {
    focusResults.current = false
    setQuery('')
    setMunicipality('todos')
    setTerritory('todos')
    setCalendar(null)
    searchRef.current?.focus()
  }

  return (
    <div className={styles.directory}>
      <section className={styles.finder} aria-label="Buscar y navegar por el directorio">
        <label className={styles.searchBox} htmlFor="hermandades-v4-search">
          <span className="sr-only">Buscar hermandad o corporación</span>
          <input
            id="hermandades-v4-search"
            ref={searchRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar hermandad, templo o localidad…"
          />
          <span aria-hidden="true">⌕</span>
        </label>

        <div className={styles.finderControls}>
          <div className={styles.territoryTabs} aria-label="Elegir territorio">
            {[
              ['todos', 'Todo'],
              ['capital', 'Sevilla capital'],
              ['provincia', 'Provincia'],
            ].map(([value, label]) => (
              <button
                type="button"
                className={territory === value ? styles.active : ''}
                aria-pressed={territory === value}
                onClick={() => changeTerritory(value)}
                key={value}
              >{label}</button>
            ))}
          </div>
          <select value={municipality} onChange={(event) => changeMunicipality(event.target.value)} aria-label="Elegir localidad">
            <option value="todos">Todas las localidades</option>
            {municipalityOptions.map((item) => <option value={item.key} key={item.key}>{item.label}</option>)}
          </select>
        </div>
      </section>

      <nav className={styles.primaryNav} aria-label="Tipos de corporaciones">
        {DIRECTORY_TYPES.map((type) => (
          <Link href={type.href} prefetch={false} key={type.key}>
            <strong>{type.label}</strong>
            <small>{navigation.counts[type.key]} {countLabel(type, navigation.counts[type.key])}</small>
            <span aria-hidden="true">→</span>
          </Link>
        ))}
      </nav>

      {showResults ? (
        <section className={styles.results} aria-live="polite">
          <div className={styles.resultsHead}>
            <div>
              <h2 ref={resultsRef} tabIndex={-1}>{filtered.length} {filtered.length === 1 ? 'corporación' : 'corporaciones'}</h2>
              {context ? <p>{context}</p> : null}
            </div>
            <button type="button" onClick={clearFilters}>Limpiar filtros</button>
          </div>
          {filtered.length ? (
            <div className={styles.cardList}>{filtered.map((item) => <BrotherhoodDirectoryCard hermandad={item} key={item.id} />)}</div>
          ) : (
            <div className={styles.empty}><strong>No hay resultados</strong><span>Prueba con otra búsqueda o localidad.</span></div>
          )}
        </section>
      ) : (
        <div className={styles.hubs}>
          {territory !== 'provincia' ? <CapitalHub items={capitalItems} routes={navigation.routes} onSelect={selectCalendar} /> : null}
          {territory !== 'capital' ? <ProvinceHub stats={municipalityStats} onSelect={(next) => changeMunicipality(next, true)} /> : null}
        </div>
      )}
    </div>
  )
}
