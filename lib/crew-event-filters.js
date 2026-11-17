// Filtros del calendario de igualás y ensayos (/igualas-y-ensayos).
//
// Funciones puras, probadas con node --test:
// - Facetas: cada desplegable solo ofrece opciones que dan resultados con el
//   resto de filtros aplicados, con su recuento («Paso» se acota al elegir
//   Hermandad, etc.). La opción elegida se conserva aunque se quede a cero.
// - Meses en orden cronológico (antes se ordenaban por su nombre: abril,
//   diciembre, enero…), descendente en el histórico.
// - Búsqueda libre sin tildes por título, Hermandad, Paso, capataz y lugar.
// - Estado en la URL (?hermandad=…&paso=…) con claves legibles, para compartir
//   «las igualás de mi Hermandad» y conservar los filtros al volver atrás.

import { CREW_EVENT_TYPES } from './crew-events.js'

export const CREW_FILTERS = [
  { key: 'mes', label: 'Mes', allLabel: 'Todos los meses' },
  { key: 'tipo', label: 'Tipo', allLabel: 'Todos los tipos' },
  { key: 'hermandad', label: 'Hermandad', allLabel: 'Todas las Hermandades' },
  { key: 'paso', label: 'Paso', allLabel: 'Todos los Pasos' },
  { key: 'capataz', label: 'Capataz', allLabel: 'Todos los capataces' },
  { key: 'localidad', label: 'Localidad', allLabel: 'Todas las localidades' },
]

export const CREW_FILTER_KEYS = CREW_FILTERS.map((item) => item.key)
export const CREW_ARCHIVE_PARAM = 'ver'
export const CREW_ARCHIVE_VALUE = 'historico'
export const CREW_SEARCH_PARAM = 'q'

const TYPE_ORDER = new Map(CREW_EVENT_TYPES.map(([value], index) => [value, index]))
const PARAM_VALUE = /^[a-z0-9]+(?:[-_][a-z0-9]+)*$/

export function normalizeText(value = '') {
  return String(value || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLocaleLowerCase('es')
}

export function slugify(value = '') {
  return normalizeText(value).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

// Última parte de la ruta de una ficha: /hermandades/la-estrella → la-estrella.
export function hrefKey(href = '') {
  const path = String(href || '').split(/[?#]/)[0].replace(/\/+$/, '')
  const last = path.slice(path.lastIndexOf('/') + 1)
  return PARAM_VALUE.test(last) ? last : ''
}

function entityKey(href, name, id) {
  return hrefKey(href) || slugify(name) || String(id || '')
}

function option(value, label) {
  return value && label ? { value, label } : null
}

export function crewEventFacets(event = {}) {
  return {
    mes: [option(event.monthKey, event.monthLabel)],
    tipo: [option(event.eventType, event.eventTypeLabel)],
    hermandad: [option(entityKey(event.brotherhoodHref, event.brotherhoodName, event.brotherhoodId), event.brotherhoodName)],
    paso: (event.steps || []).map((item) => option(entityKey(item.href, item.name, item.id), item.name)),
    capataz: (event.agents || []).map((item) => option(entityKey(item.href, item.name, item.id), item.name)),
    localidad: [option(slugify(event.municipality), event.municipality)],
  }
}

function eventSearchText(event = {}) {
  return normalizeText([
    event.title,
    event.eventTypeLabel,
    event.brotherhoodName,
    event.municipality,
    event.location,
    event.placeName,
    ...(event.steps || []).map((item) => item.name),
    ...(event.agents || []).map((item) => item.name),
  ].filter(Boolean).join(' '))
}

export function indexCrewEvents(events = []) {
  return events.map((event) => {
    const facets = crewEventFacets(event)
    const values = Object.fromEntries(Object.entries(facets).map(([key, items]) => [key, new Set(items.filter(Boolean).map((item) => item.value))]))
    return { event, facets, values, text: eventSearchText(event) }
  })
}

export function emptyCrewFilters() {
  return Object.fromEntries(CREW_FILTER_KEYS.map((key) => [key, '']))
}

export function searchTerms(query = '') {
  return normalizeText(query).split(/\s+/).filter(Boolean)
}

// `except` deja fuera un filtro para calcular las opciones de su propio desplegable.
export function matchesCrewFilters(entry, filters = {}, { query = '', except = '' } = {}) {
  for (const key of CREW_FILTER_KEYS) {
    if (key === except || !filters[key]) continue
    if (!entry.values[key]?.has(filters[key])) return false
  }
  const terms = Array.isArray(query) ? query : searchTerms(query)
  return terms.every((term) => entry.text.includes(term))
}

export function filterCrewEntries(entries, filters, options = {}) {
  const terms = searchTerms(options.query)
  return entries.filter((entry) => matchesCrewFilters(entry, filters, { ...options, query: terms }))
}

function sortOptions(key, items, { descendingMonths = false } = {}) {
  if (key === 'mes') {
    return items.sort((a, b) => (descendingMonths ? b.value.localeCompare(a.value) : a.value.localeCompare(b.value)))
  }
  if (key === 'tipo') {
    return items.sort((a, b) => (TYPE_ORDER.get(a.value) ?? 99) - (TYPE_ORDER.get(b.value) ?? 99))
  }
  return items.sort((a, b) => a.label.localeCompare(b.label, 'es'))
}

// Opciones de un desplegable con su recuento, según el resto de filtros.
export function crewFacetOptions(entries, filters, key, { query = '', descendingMonths = false, allEntries = entries } = {}) {
  const terms = searchTerms(query)
  const byValue = new Map()
  for (const entry of entries) {
    if (!matchesCrewFilters(entry, filters, { query: terms, except: key })) continue
    for (const item of entry.facets[key] || []) {
      if (!item) continue
      const current = byValue.get(item.value)
      if (current) current.count += 1
      else byValue.set(item.value, { ...item, count: 1 })
    }
  }
  const selected = filters[key]
  if (selected && !byValue.has(selected)) {
    const label = findFacetLabel(allEntries, key, selected)
    if (label) byValue.set(selected, { value: selected, label, count: 0 })
  }
  return sortOptions(key, [...byValue.values()], { descendingMonths })
}

export function findFacetLabel(entries, key, value) {
  for (const entry of entries) {
    const match = (entry.facets[key] || []).find((item) => item?.value === value)
    if (match) return match.label
  }
  return ''
}

export function activeCrewFilterCount(filters = {}, query = '') {
  return CREW_FILTER_KEYS.filter((key) => filters[key]).length + (searchTerms(query).length ? 1 : 0)
}

export function parseCrewFilterParams(input) {
  const params = input instanceof URLSearchParams ? input : new URLSearchParams(input || '')
  const filters = emptyCrewFilters()
  for (const key of CREW_FILTER_KEYS) {
    const value = String(params.get(key) || '').trim().toLowerCase()
    if (PARAM_VALUE.test(value)) filters[key] = value
  }
  return {
    filters,
    query: String(params.get(CREW_SEARCH_PARAM) || '').slice(0, 80),
    phase: params.get(CREW_ARCHIVE_PARAM) === CREW_ARCHIVE_VALUE ? 'archive' : 'upcoming',
  }
}

export function serializeCrewFilterParams({ filters = {}, query = '', phase = 'upcoming' } = {}) {
  const params = new URLSearchParams()
  if (phase === 'archive') params.set(CREW_ARCHIVE_PARAM, CREW_ARCHIVE_VALUE)
  for (const key of CREW_FILTER_KEYS) {
    if (filters[key]) params.set(key, filters[key])
  }
  const trimmed = String(query || '').trim()
  if (trimmed) params.set(CREW_SEARCH_PARAM, trimmed)
  return params.toString()
}
