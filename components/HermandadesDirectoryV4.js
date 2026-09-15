'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import BrotherhoodDirectoryCard from '@/components/BrotherhoodDirectoryCard'
import {
  DIRECTORY_TYPES,
  HOLY_WEEK_DAYS,
  MONTHS,
  directoryPeriod,
  directorySlug,
  displayName,
  hasDirectoryType,
  normalizeDirectoryValue,
  sortBrotherhoods,
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
  if (undocumented.length) rows.push({ label: 'Sin fecha documentada', items: undocumented, unavailable: true })
  return rows
}

function CapitalFamily({ title, kicker, typeKey, items, orderedPeriods }) {
  const rows = periodRows(items, typeKey, orderedPeriods)
  const type = DIRECTORY_TYPES.find((item) => item.key === typeKey)

  return (
    <section className={styles.familyCard} data-family={typeKey}>
      <header className={styles.familyHeader}>
        <div>
          <span>{kicker}</span>
          <h3>{title}</h3>
        </div>
        <Link href={type?.href || '/hermandades'} aria-label={`Ver todo ${title}`}>
          {items.length}<b aria-hidden="true">→</b>
        </Link>
      </header>
      <div className={styles.periodGrid}>
        {rows.map((row) => row.unavailable ? (
          <span className={styles.periodDisabled} key={`${typeKey}-${row.label}`}>
            <span>{row.label}</span><strong>{row.items.length}</strong>
          </span>
        ) : (
          <Link
            className={styles.periodLink}
            href={`/hermandades/${typeKey}/sevilla-capital/${directorySlug(row.label)}`}
            key={`${typeKey}-${row.label}`}
          >
            <span>{row.label}</span><strong>{row.items.length}</strong>
          </Link>
        ))}
      </div>
    </section>
  )
}

function CapitalHub({ items }) {
  const byType = Object.fromEntries(DIRECTORY_TYPES.map((type) => [
    type.key,
    items.filter((item) => hasDirectoryType(item, type.key)),
  ]))

  return (
    <section className={styles.capitalHub} aria-labelledby="capital-v4-title">
      <div className={styles.hubHeading}>
        <div>
          <span>Capital</span>
          <h2 id="capital-v4-title">Sevilla capital</h2>
        </div>
        <strong>{items.length} corporaciones</strong>
      </div>

      <nav className={styles.capitalQuick} aria-label="Accesos rápidos del directorio de Sevilla capital">
        {DIRECTORY_TYPES.map((type) => (
          <Link href={type.key === 'sacramentales' || type.key === 'agrupaciones-parroquiales' ? `${type.href}/sevilla-capital` : type.href} key={type.key}>
            <span>{type.label}</span>
            <strong>{byType[type.key].length}</strong>
          </Link>
        ))}
      </nav>

      <div className={styles.calendarGrid}>
        <CapitalFamily
          title="Semana Santa"
          kicker="Por jornada"
          typeKey="semana-santa"
          items={byType['semana-santa']}
          orderedPeriods={HOLY_WEEK_DAYS}
        />
        <CapitalFamily
          title="Glorias"
          kicker="Por mes"
          typeKey="gloria"
          items={byType.gloria}
          orderedPeriods={MONTHS}
        />
      </div>

      <div className={styles.institutionalGrid}>
        <Link href="/hermandades/sacramentales/sevilla-capital">
          <span>Directorio específico</span>
          <strong>Sacramentales de Sevilla</strong>
          <b>{byType.sacramentales.length} →</b>
        </Link>
        <Link href="/hermandades/agrupaciones-parroquiales/sevilla-capital">
          <span>Carácter de la corporación</span>
          <strong>Agrupaciones Parroquiales</strong>
          <b>{byType['agrupaciones-parroquiales'].length} →</b>
        </Link>
      </div>
    </section>
  )
}

function ProvinceHub({ stats, onSelect }) {
  const total = stats.reduce((sum, item) => sum + item.count, 0)
  return (
    <section className={styles.provinceHub} aria-labelledby="province-v4-title">
      <div className={styles.hubHeading}>
        <div>
          <span>Provincia</span>
          <h2 id="province-v4-title">Municipios</h2>
        </div>
        <strong>{total} corporaciones</strong>
      </div>
      <p>Entra directamente en la localidad que quieras consultar.</p>
      <div className={styles.municipalityGrid}>
        {stats.map((item) => (
          <button type="button" onClick={() => onSelect(item.key)} key={item.key}>
            <span>{item.label}</span><strong>{item.count}</strong>
          </button>
        ))}
      </div>
    </section>
  )
}

export default function HermandadesDirectoryV4({ hermandades }) {
  const [query, setQuery] = useState('')
  const [territory, setTerritory] = useState('todos')
  const [municipality, setMunicipality] = useState('todos')

  const categoryCounts = useMemo(() => Object.fromEntries(DIRECTORY_TYPES.map((type) => [
    type.key,
    hermandades.filter((item) => hasDirectoryType(item, type.key)).length,
  ])), [hermandades])

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

  const filtered = useMemo(() => {
    const search = normalizeDirectoryValue(query)
    return sortBrotherhoods(hermandades.filter((item) => {
      const locality = normalizeDirectoryValue(item.localidad)
      const isCapital = locality === 'sevilla'
      const matchesTerritory = territory === 'todos'
        || (territory === 'capital' && isCapital)
        || (territory === 'provincia' && !isCapital)
      const matchesMunicipality = municipality === 'todos' || locality === municipality
      const haystack = normalizeDirectoryValue([
        displayName(item), item.nombreOficial, item.localidad, item.barrio, item.sede, item.diaSalida,
      ].filter(Boolean).join(' '))
      return matchesTerritory && matchesMunicipality && (!search || haystack.includes(search))
    }))
  }, [hermandades, municipality, query, territory])

  const showResults = Boolean(query.trim()) || municipality !== 'todos'

  function changeTerritory(next) {
    setTerritory(next)
    if (next === 'capital' && municipality !== 'sevilla') setMunicipality('todos')
    if (next === 'provincia' && municipality === 'sevilla') setMunicipality('todos')
  }

  function changeMunicipality(next) {
    setMunicipality(next)
    if (next === 'todos') return
    setTerritory(next === 'sevilla' ? 'capital' : 'provincia')
  }

  return (
    <div className={styles.directory}>
      <nav className={styles.primaryNav} aria-label="Tipos de corporaciones">
        {DIRECTORY_TYPES.map((type) => (
          <Link href={type.href} key={type.key}>
            <small>{categoryCounts[type.key]} {countLabel(type, categoryCounts[type.key])}</small>
            <strong>{type.label}</strong>
            <span aria-hidden="true">→</span>
          </Link>
        ))}
      </nav>

      <section className={styles.finder} aria-label="Buscar y navegar por el directorio">
        <label className={styles.searchBox} htmlFor="hermandades-v4-search">
          <span className="sr-only">Buscar hermandad o corporación</span>
          <input
            id="hermandades-v4-search"
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

      {showResults ? (
        <section className={styles.results} aria-live="polite">
          <div className={styles.resultsHead}>
            <div><span>Resultado</span><h2>{filtered.length} {filtered.length === 1 ? 'corporación' : 'corporaciones'}</h2></div>
            <button type="button" onClick={() => { setQuery(''); setMunicipality('todos'); setTerritory('todos') }}>Limpiar filtros</button>
          </div>
          {filtered.length ? (
            <div className={styles.cardList}>{filtered.map((item) => <BrotherhoodDirectoryCard hermandad={item} key={item.id} />)}</div>
          ) : (
            <div className={styles.empty}><strong>No hay resultados</strong><span>Prueba con otra búsqueda o localidad.</span></div>
          )}
        </section>
      ) : (
        <div className={styles.hubs}>
          {territory !== 'provincia' ? <CapitalHub items={capitalItems} /> : null}
          {territory !== 'capital' ? <ProvinceHub stats={municipalityStats} onSelect={changeMunicipality} /> : null}
        </div>
      )}
    </div>
  )
}
