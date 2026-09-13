'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import BrotherhoodDirectoryCard from '@/components/BrotherhoodDirectoryCard'
import {
  DIRECTORY_TYPES,
  directoryPeriod,
  displayName,
  hasDirectoryType,
  localityLabel,
  normalizeDirectoryValue,
  sortBrotherhoods,
} from '@/lib/brotherhood-directory'
import styles from './HermandadesDirectory.module.css'
import enhancementStyles from './HermandadesDirectoryEnhancements.module.css'
import groupStyles from './HermandadesDirectoryMainGroups.module.css'

function groupSorted(items, getLabel) {
  return items.reduce((groups, item) => {
    const label = getLabel(item) || ''
    const previous = groups[groups.length - 1]

    if (previous?.label === label) {
      previous.items.push(item)
      return groups
    }

    groups.push({ label, items: [item] })
    return groups
  }, [])
}

function primaryDirectoryType(item) {
  return DIRECTORY_TYPES.find((type) => hasDirectoryType(item, type.key)) || null
}

function buildExplorerGroups(items) {
  const capital = items.filter((item) => localityLabel(item) === 'Sevilla capital')
  const province = items.filter((item) => localityLabel(item) !== 'Sevilla capital')

  const buildLocalities = (source) => groupSorted(
    [...source].sort((first, second) => localityLabel(first).localeCompare(localityLabel(second), 'es', { sensitivity: 'base' })),
    localityLabel
  ).map((locality) => {
    const typeGroups = DIRECTORY_TYPES.map((type) => {
      const typeItems = locality.items.filter((item) => primaryDirectoryType(item)?.key === type.key)
      if (!typeItems.length) return null

      const sorted = sortBrotherhoods(typeItems, type.key)
      const periods = type.key === 'sacramentales'
        ? [{ label: '', items: sorted }]
        : groupSorted(sorted, (item) => directoryPeriod(item, type.key) || 'Sin fecha documentada')

      return {
        key: type.key,
        label: type.label,
        items: sorted,
        periods,
      }
    }).filter(Boolean)

    const otherItems = locality.items.filter((item) => !primaryDirectoryType(item))
    if (otherItems.length) {
      const sortedOtherItems = sortBrotherhoods(otherItems)
      typeGroups.push({
        key: 'otras',
        label: 'Otras hermandades',
        items: sortedOtherItems,
        periods: [{ label: '', items: sortedOtherItems }],
      })
    }

    return {
      ...locality,
      typeGroups,
    }
  })

  return [
    capital.length ? {
      key: 'capital',
      label: 'Sevilla capital',
      items: capital,
      localities: buildLocalities(capital),
    } : null,
    province.length ? {
      key: 'provincia',
      label: 'Provincia de Sevilla',
      items: province,
      localities: buildLocalities(province),
    } : null,
  ].filter(Boolean)
}

export default function HermandadesDirectory({ hermandades }) {
  const [query, setQuery] = useState('')
  const [territory, setTerritory] = useState('todos')
  const [municipality, setMunicipality] = useState('todos')
  const [openLocalities, setOpenLocalities] = useState([])

  const counts = useMemo(() => Object.fromEntries(
    DIRECTORY_TYPES.map((type) => [
      type.key,
      hermandades.filter((item) => hasDirectoryType(item, type.key)).length,
    ])
  ), [hermandades])

  const municipalities = useMemo(() => [...new Set(
    hermandades.map((item) => item.localidad).filter(Boolean)
  )].sort((first, second) => {
    const firstCapital = normalizeDirectoryValue(first) === 'sevilla' ? 0 : 1
    const secondCapital = normalizeDirectoryValue(second) === 'sevilla' ? 0 : 1
    if (firstCapital !== secondCapital) return firstCapital - secondCapital
    return first.localeCompare(second, 'es', { sensitivity: 'base' })
  }), [hermandades])

  const municipalityStats = useMemo(() => municipalities.map((item) => {
    const normalized = normalizeDirectoryValue(item)
    return {
      key: normalized,
      label: normalized === 'sevilla' ? 'Sevilla capital' : item,
      count: hermandades.filter((hermandad) => normalizeDirectoryValue(hermandad.localidad) === normalized).length,
      isCapital: normalized === 'sevilla',
    }
  }), [municipalities, hermandades])

  const filtered = useMemo(() => {
    const value = normalizeDirectoryValue(query)
    return hermandades.filter((item) => {
      const isCapital = normalizeDirectoryValue(item.localidad) === 'sevilla'
      const matchesTerritory = territory === 'todos'
        || (territory === 'sevilla-capital' && isCapital)
        || (territory === 'provincia' && !isCapital)
      const matchesMunicipality = municipality === 'todos'
        || normalizeDirectoryValue(item.localidad) === municipality
      const haystack = [
        displayName(item),
        item.nombreOficial,
        item.sede,
        item.localidad,
        item.barrio,
        item.diaSalida,
        ...(item.tipos || []),
      ].filter(Boolean).join(' ')

      return matchesTerritory && matchesMunicipality && (!value || normalizeDirectoryValue(haystack).includes(value))
    })
  }, [query, territory, municipality, hermandades])

  const groups = useMemo(() => buildExplorerGroups(filtered), [filtered])
  const localityKeys = useMemo(() => groups.flatMap((territoryGroup) => (
    territoryGroup.localities.map((locality) => `${territoryGroup.key}:${locality.label}`)
  )), [groups])
  const forceOpenLocalities = Boolean(query.trim()) || municipality !== 'todos'
  const allLocalitiesOpen = localityKeys.length > 0 && localityKeys.every((key) => openLocalities.includes(key))

  function toggleLocality(key) {
    setOpenLocalities((current) => (
      current.includes(key)
        ? current.filter((item) => item !== key)
        : [...current, key]
    ))
  }

  function selectMunicipality(item) {
    setMunicipality(item.key)
    setTerritory(item.isCapital ? 'sevilla-capital' : 'provincia')
  }

  function clearFilters() {
    setQuery('')
    setTerritory('todos')
    setMunicipality('todos')
    setOpenLocalities([])
  }

  return (
    <div className={styles.directory}>
      <div className={styles.categoryGrid}>
        {DIRECTORY_TYPES.map((type) => (
          <Link className={styles.categoryCard} href={type.href} key={type.key}>
            <span className={styles.categoryIcon} aria-hidden="true">
              <Image src={type.icon} alt="" width={78} height={78} sizes="78px" />
            </span>
            <span className={styles.categoryCopy}>
              <small>{counts[type.key]} {counts[type.key] === 1 ? 'hermandad' : 'hermandades'}</small>
              <strong>{type.label}</strong>
              <span>{type.description}</span>
            </span>
            <span className={styles.categoryArrow} aria-hidden="true">→</span>
          </Link>
        ))}
      </div>

      <div className={styles.explorer}>
        <div className={styles.explorerHeading}>
          <span>Encuentra una hermandad</span>
          <strong>Busca por nombre, templo o localidad</strong>
        </div>

        <div className={styles.searchPanel}>
          <label className={styles.searchRow} htmlFor="brotherhood-directory-search">
            <span className="sr-only">Buscar hermandad</span>
            <input
              id="brotherhood-directory-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Ej. El Baratillo, La Rinconada, Capilla de la Piedad…"
              aria-label="Buscar en el directorio de hermandades"
            />
            <span className={styles.searchIcon} aria-hidden="true">⌕</span>
          </label>

          <div className={enhancementStyles.directoryFilters}>
            <div className={`${styles.territories} ${enhancementStyles.territories}`} aria-label="Filtrar por territorio">
              {[
                ['todos', 'Todos'],
                ['sevilla-capital', 'Sevilla capital'],
                ['provincia', 'Provincia'],
              ].map(([value, label]) => (
                <button
                  type="button"
                  key={value}
                  className={territory === value ? styles.activeTerritory : ''}
                  onClick={() => {
                    setTerritory(value)
                    if (value === 'sevilla-capital' && municipality !== 'sevilla') setMunicipality('todos')
                    if (value === 'provincia' && municipality === 'sevilla') setMunicipality('todos')
                  }}
                  aria-pressed={territory === value}
                >
                  {label}
                </button>
              ))}
            </div>
            <select
              value={municipality}
              onChange={(event) => setMunicipality(event.target.value)}
              aria-label="Filtrar por localidad"
            >
              <option value="todos">Todas las localidades</option>
              {municipalities.map((item) => (
                <option value={normalizeDirectoryValue(item)} key={item}>
                  {item === 'Sevilla' ? 'Sevilla capital' : item}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.municipalityRail} aria-label="Accesos rápidos por municipio">
          <span className={styles.municipalityRailLabel}>Municipios</span>
          <div className={styles.municipalityChips}>
            <button
              type="button"
              className={municipality === 'todos' ? styles.activeMunicipalityChip : styles.municipalityChip}
              onClick={() => {
                setMunicipality('todos')
                setTerritory('todos')
              }}
            >
              Todos
            </button>
            {municipalityStats.map((item) => (
              <button
                type="button"
                key={item.key}
                className={municipality === item.key ? styles.activeMunicipalityChip : styles.municipalityChip}
                onClick={() => selectMunicipality(item)}
                aria-pressed={municipality === item.key}
              >
                <span>{item.label}</span>
                <strong>{item.count}</strong>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.resultHead} aria-live="polite" aria-atomic="true">
          <div>
            <strong>{filtered.length} {filtered.length === 1 ? 'hermandad' : 'hermandades'}</strong>
            <span>Agrupadas por municipio, naturaleza y calendario</span>
          </div>
          {query || territory !== 'todos' || municipality !== 'todos' ? (
            <button type="button" onClick={clearFilters}>
              Limpiar filtros
            </button>
          ) : null}
        </div>

        {filtered.length ? (
          <>
            {!forceOpenLocalities ? (
              <div className={styles.directoryControls}>
                <div>
                  <strong>Explora por municipio</strong>
                  <span>Abre solo la localidad que quieras consultar.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setOpenLocalities(allLocalitiesOpen ? [] : localityKeys)}
                >
                  {allLocalitiesOpen ? 'Plegar todos' : 'Abrir todos'}
                </button>
              </div>
            ) : null}

            <div className={styles.groupedDirectory}>
              {groups.map((territoryGroup) => (
                <section className={styles.territoryBlock} key={territoryGroup.key}>
                  <header className={styles.territoryHeading}>
                    <div>
                      <span>Territorio</span>
                      <h2>{territoryGroup.label}</h2>
                    </div>
                    <strong>{territoryGroup.items.length} {territoryGroup.items.length === 1 ? 'hermandad' : 'hermandades'}</strong>
                  </header>

                  <div className={styles.localityStack}>
                    {territoryGroup.localities.map((locality) => {
                      const localityKey = `${territoryGroup.key}:${locality.label}`
                      const isOpen = forceOpenLocalities || openLocalities.includes(localityKey)
                      const panelId = `municipio-${territoryGroup.key}-${normalizeDirectoryValue(locality.label).replace(/\s+/g, '-')}`

                      return (
                        <section
                          className={`${styles.localityAccordion} ${isOpen ? styles.localityOpen : ''}`}
                          key={localityKey}
                        >
                          <button
                            type="button"
                            className={styles.localityToggle}
                            aria-expanded={isOpen}
                            aria-controls={panelId}
                            onClick={() => toggleLocality(localityKey)}
                          >
                            <span className={styles.localityIdentity}>
                              <small>{territoryGroup.key === 'capital' ? 'Capital' : 'Municipio'}</small>
                              <strong>{locality.label}</strong>
                              <span className={styles.localityTypeSummary} aria-label="Tipos de hermandades presentes">
                                {locality.typeGroups.map((typeGroup) => (
                                  <span key={`${localityKey}-${typeGroup.key}`}>
                                    {typeGroup.label}
                                    <b>{typeGroup.items.length}</b>
                                  </span>
                                ))}
                              </span>
                            </span>
                            <span className={styles.localityMeta}>
                              <span className={styles.localityCount}>
                                {locality.items.length} {locality.items.length === 1 ? 'hermandad' : 'hermandades'}
                              </span>
                              <span className={styles.localityChevron} aria-hidden="true">⌄</span>
                            </span>
                          </button>

                          <div className={styles.localityContent} id={panelId} hidden={!isOpen}>
                            <div className={groupStyles.mainTypeStack}>
                              {locality.typeGroups.map((typeGroup) => (
                                <section className={groupStyles.mainTypeBlock} key={`${territoryGroup.key}-${locality.label}-${typeGroup.key}`}>
                                  <header className={groupStyles.mainTypeHeading}>
                                    <strong>{typeGroup.label}</strong>
                                    <span>{typeGroup.items.length}</span>
                                  </header>

                                  <div className={styles.periodStack}>
                                    {typeGroup.periods.map((period) => (
                                      <section className={styles.periodBlock} key={`${territoryGroup.key}-${locality.label}-${typeGroup.key}-${period.label || 'general'}`}>
                                        {period.label ? (
                                          <header className={styles.periodHeading}>
                                            <h4>{period.label}</h4>
                                            <span>{period.items.length}</span>
                                          </header>
                                        ) : null}
                                        <div className={styles.list}>
                                          {period.items.map((hermandad) => (
                                            <BrotherhoodDirectoryCard key={hermandad.id} hermandad={hermandad} />
                                          ))}
                                        </div>
                                      </section>
                                    ))}
                                  </div>
                                </section>
                              ))}
                            </div>
                          </div>
                        </section>
                      )
                    })}
                  </div>
                </section>
              ))}
            </div>
          </>
        ) : (
          <div className={styles.empty}>
            <strong>No hay hermandades disponibles con estos criterios</strong>
            <span>Prueba otra búsqueda o cambia el territorio.</span>
          </div>
        )}
      </div>
    </div>
  )
}
