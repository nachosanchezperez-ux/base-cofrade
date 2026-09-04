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
              placeholder="Ej. El Baratillo, Cantillana, Capilla de la Piedad…"
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
                  onClick={() => setTerritory(value)}
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

        <div className={styles.resultHead} aria-live="polite" aria-atomic="true">
          <div>
            <strong>{filtered.length} {filtered.length === 1 ? 'hermandad' : 'hermandades'}</strong>
            <span>Ordenadas por territorio, naturaleza y calendario</span>
          </div>
          {query || territory !== 'todos' || municipality !== 'todos' ? (
            <button
              type="button"
              onClick={() => {
                setQuery('')
                setTerritory('todos')
                setMunicipality('todos')
              }}
            >
              Limpiar filtros
            </button>
          ) : null}
        </div>

        {filtered.length ? (
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
                  {territoryGroup.localities.map((locality) => (
                    <section className={styles.localityBlock} key={`${territoryGroup.key}-${locality.label}`}>
                      {territoryGroup.key === 'provincia' ? (
                        <header className={styles.localityHeading}>
                          <h3>{locality.label}</h3>
                          <span>{locality.items.length} {locality.items.length === 1 ? 'hermandad' : 'hermandades'}</span>
                        </header>
                      ) : null}

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
                    </section>
                  ))}
                </div>
              </section>
            ))}
          </div>
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
