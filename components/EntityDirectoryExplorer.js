'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import styles from './EntityDirectoryExplorer.module.css'

const DEFAULT_LIMIT = 24
const LIMIT_STEP = 24

const KINDS = [
  { value: 'all', label: 'Todos' },
  { value: 'brotherhood', label: 'Hermandades' },
  { value: 'image', label: 'Imágenes' },
  { value: 'step', label: 'Pasos' },
  { value: 'band', label: 'Bandas' },
]

function normalize(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

function slugify(value) {
  return normalize(value)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function initials(value) {
  return String(value || '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

function searchScore(item, needle) {
  if (!needle) return 0
  const name = normalize(item.name)
  const officialName = normalize(item.officialName)
  if (name.startsWith(needle)) return 0
  if (name.includes(needle)) return 1
  if (officialName.startsWith(needle)) return 2
  if (officialName.includes(needle)) return 3
  return 4
}

function kindLabel(kind) {
  return KINDS.find((item) => item.value === kind)?.label || 'Todos'
}

function parseLimit(value) {
  const parsed = Number.parseInt(value, 10)
  if (!Number.isFinite(parsed) || parsed < DEFAULT_LIMIT) return DEFAULT_LIMIT
  return parsed
}

export default function EntityDirectoryExplorer({ items, initialState = {} }) {
  const [query, setQuery] = useState(initialState.query || '')
  const [kind, setKind] = useState(KINDS.some((item) => item.value === initialState.kind) ? initialState.kind : 'all')
  const [territory, setTerritory] = useState(initialState.territory || 'todos')
  const [municipality, setMunicipality] = useState(initialState.municipality || 'todos')
  const [subtype, setSubtype] = useState(initialState.subtype || 'todos')
  const [limit, setLimit] = useState(parseLimit(initialState.limit))
  const [filtersOpen, setFiltersOpen] = useState(Boolean(
    initialState.territory && initialState.territory !== 'todos'
      || initialState.municipality && initialState.municipality !== 'todos'
      || initialState.subtype && initialState.subtype !== 'todos'
  ))

  const counts = useMemo(() => {
    const result = { all: items.length }
    for (const option of KINDS.slice(1)) {
      result[option.value] = items.filter((item) => item.kind === option.value).length
    }
    return result
  }, [items])

  const scopedItems = useMemo(
    () => kind === 'all' ? items : items.filter((item) => item.kind === kind),
    [items, kind]
  )

  const municipalities = useMemo(() => [...new Set(
    scopedItems.map((item) => item.municipality).filter(Boolean)
  )].sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' })), [scopedItems])

  const subtypes = useMemo(() => [...new Set(
    scopedItems.flatMap((item) => item.subtypeValues || []).filter(Boolean)
  )].sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' })), [scopedItems])

  const filtered = useMemo(() => {
    const needle = normalize(query)
    const normalizedMunicipality = normalize(municipality)
    const normalizedSubtype = normalize(subtype)

    return items
      .filter((item) => {
        if (kind !== 'all' && item.kind !== kind) return false

        const isCapital = normalize(item.municipality) === 'sevilla'
        const matchesTerritory = territory === 'todos'
          || (territory === 'sevilla-capital' && isCapital)
          || (territory === 'provincia' && !isCapital)
        if (!matchesTerritory) return false

        if (municipality !== 'todos' && normalize(item.municipality) !== normalizedMunicipality) return false

        if (kind !== 'all' && subtype !== 'todos') {
          const values = (item.subtypeValues || []).map(normalize)
          if (!values.includes(normalizedSubtype)) return false
        }

        if (!needle) return true
        const haystack = normalize([
          item.name,
          item.officialName,
          item.label,
          item.subtype,
          item.municipality,
          item.context,
          item.relation,
          ...(item.keywords || []),
        ].filter(Boolean).join(' '))
        return haystack.includes(needle)
      })
      .sort((a, b) => {
        const scoreDifference = searchScore(a, needle) - searchScore(b, needle)
        if (scoreDifference) return scoreDifference
        return a.name.localeCompare(b.name, 'es', { sensitivity: 'base' })
      })
  }, [items, query, kind, territory, municipality, subtype])

  const visibleItems = filtered.slice(0, limit)
  const activeSecondaryFilters = [
    territory !== 'todos',
    municipality !== 'todos',
    kind !== 'all' && subtype !== 'todos',
  ].filter(Boolean).length

  useEffect(() => {
    const params = new URLSearchParams()
    if (query.trim()) params.set('q', query.trim())
    if (kind !== 'all') params.set('tipo', kind)
    if (territory !== 'todos') params.set('territorio', territory)
    if (municipality !== 'todos') params.set('localidad', slugify(municipality))
    if (kind !== 'all' && subtype !== 'todos') params.set('subtipo', slugify(subtype))
    if (limit > DEFAULT_LIMIT) params.set('limite', String(limit))

    const queryString = params.toString()
    const nextUrl = queryString ? `/directorio?${queryString}` : '/directorio'
    window.history.replaceState(window.history.state, '', nextUrl)
  }, [query, kind, territory, municipality, subtype, limit])

  const changeKind = (nextKind) => {
    setKind(nextKind)
    setMunicipality('todos')
    setSubtype('todos')
    setLimit(DEFAULT_LIMIT)
  }

  const clearAll = () => {
    setQuery('')
    setKind('all')
    setTerritory('todos')
    setMunicipality('todos')
    setSubtype('todos')
    setLimit(DEFAULT_LIMIT)
    setFiltersOpen(false)
  }

  const hasAnyFilter = Boolean(query) || kind !== 'all' || activeSecondaryFilters > 0

  return (
    <div className={styles.directory}>
      <label className={styles.searchBox}>
        <span className={styles.searchGlyph} aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false">
            <circle cx="11" cy="11" r="6.5" />
            <path d="m16 16 4 4" />
          </svg>
        </span>
        <span className="sr-only">Buscar en el directorio</span>
        <input
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setLimit(DEFAULT_LIMIT)
          }}
          placeholder="Buscar hermandad, imagen, paso, banda…"
          autoComplete="off"
        />
        {query ? (
          <button
            type="button"
            className={styles.clearSearch}
            onClick={() => {
              setQuery('')
              setLimit(DEFAULT_LIMIT)
            }}
            aria-label="Borrar búsqueda"
          >
            ×
          </button>
        ) : null}
      </label>

      <div className={styles.categories} aria-label="Tipos de entidad">
        {KINDS.map((option) => (
          <button
            type="button"
            key={option.value}
            className={kind === option.value ? styles.activeCategory : ''}
            aria-pressed={kind === option.value}
            onClick={() => changeKind(option.value)}
          >
            <span>{option.label}</span>
            <small>{counts[option.value] || 0}</small>
          </button>
        ))}
      </div>

      <div className={styles.toolbar}>
        <div className={styles.resultCopy} aria-live="polite">
          <strong>{filtered.length} {filtered.length === 1 ? 'resultado' : 'resultados'}</strong>
          <span>{kind === 'all' ? 'Todo Hilo Cofrade' : kindLabel(kind)}</span>
        </div>
        <div className={styles.toolbarActions}>
          {hasAnyFilter ? (
            <button type="button" className={styles.clearFilters} onClick={clearAll}>
              Limpiar
            </button>
          ) : null}
          <button
            type="button"
            className={styles.filterButton}
            onClick={() => setFiltersOpen((value) => !value)}
            aria-expanded={filtersOpen}
            aria-controls="entity-directory-filters"
          >
            Filtros{activeSecondaryFilters ? ` · ${activeSecondaryFilters}` : ''}
            <span aria-hidden="true">{filtersOpen ? '−' : '+'}</span>
          </button>
        </div>
      </div>

      {filtersOpen ? (
        <div className={styles.filterPanel} id="entity-directory-filters">
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Ámbito</span>
            <div className={styles.territoryPills}>
              {[
                ['todos', 'Todos'],
                ['sevilla-capital', 'Sevilla'],
                ['provincia', 'Provincia'],
              ].map(([value, label]) => (
                <button
                  type="button"
                  key={value}
                  className={territory === value ? styles.activePill : ''}
                  aria-pressed={territory === value}
                  onClick={() => {
                    setTerritory(value)
                    setLimit(DEFAULT_LIMIT)
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <label className={styles.selectField}>
            <span>Localidad</span>
            <select
              value={municipality}
              onChange={(event) => {
                setMunicipality(event.target.value)
                setLimit(DEFAULT_LIMIT)
              }}
            >
              <option value="todos">Todas las localidades</option>
              {municipalities.map((item) => (
                <option value={item} key={item}>{item === 'Sevilla' ? 'Sevilla capital' : item}</option>
              ))}
            </select>
          </label>

          {kind !== 'all' && subtypes.length > 1 ? (
            <label className={styles.selectField}>
              <span>Tipología</span>
              <select
                value={subtype}
                onChange={(event) => {
                  setSubtype(event.target.value)
                  setLimit(DEFAULT_LIMIT)
                }}
              >
                <option value="todos">Todas las tipologías</option>
                {subtypes.map((item) => <option value={item} key={item}>{item}</option>)}
              </select>
            </label>
          ) : null}
        </div>
      ) : null}

      {visibleItems.length ? (
        <div className={styles.grid}>
          {visibleItems.map((item) => (
            <Link className={styles.card} href={item.href} key={`${item.kind}-${item.id}`}>
              <span className={`${styles.media} ${styles[item.mediaKind] || ''}`}>
                {item.mediaPath ? (
                  <Image
                    src={item.mediaPath}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 68px, (max-width: 1100px) 82px, 92px"
                  />
                ) : (
                  <span className={styles.monogram}>{initials(item.name)}</span>
                )}
              </span>

              <span className={styles.cardCopy}>
                <span className={styles.cardMeta}>
                  <small>{item.label}</small>
                  {item.subtype && item.subtype !== item.label ? <span>{item.subtype}</span> : null}
                </span>
                <strong>{item.name}</strong>
                {item.context ? <span className={styles.context}>{item.context}</span> : null}
                {item.relation ? <span className={styles.relation}>{item.relation}</span> : null}
              </span>
              <span className={styles.arrow} aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <strong>No encontramos resultados con esos criterios</strong>
          <span>Prueba otra búsqueda o limpia alguno de los filtros.</span>
          <button type="button" onClick={clearAll}>Ver todo el directorio</button>
        </div>
      )}

      {visibleItems.length < filtered.length ? (
        <div className={styles.loadMoreWrap}>
          <button
            type="button"
            className={styles.loadMore}
            onClick={() => setLimit((value) => value + LIMIT_STEP)}
          >
            Mostrar {Math.min(LIMIT_STEP, filtered.length - visibleItems.length)} más
          </button>
          <span>{visibleItems.length} de {filtered.length}</span>
        </div>
      ) : null}
    </div>
  )
}
