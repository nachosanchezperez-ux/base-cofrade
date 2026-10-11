import {
  HOLY_WEEK_DAYS, MONTHS, directoryPeriod, directorySlug,
  displayName, hasDirectoryType,
} from './brotherhood-directory.js'
import { filterDirectoryBrotherhoods } from './brotherhood-directory-navigation.js'

export const CALENDAR_VIEWS = [
  { key: 'todos', label: 'Todas' },
  { key: 'semana-santa', label: 'Semana Santa' },
  { key: 'gloria', label: 'Glorias' },
]

export function uniqueCalendarBrotherhoods(items = []) {
  return [...new Map(items.filter((item) => item?.slug)
    .map((item) => [item.id || item.slug, item])).values()]
    .sort((a, b) => String(displayName(a) || '').localeCompare(String(displayName(b) || ''), 'es', { sensitivity: 'base' }))
}

export function calendarSelection(items = [], view = 'todos', character = 'todos') {
  return uniqueCalendarBrotherhoods(items).filter((item) => (
    (view === 'todos' || hasDirectoryType(item, view))
    && (character === 'todos' || hasDirectoryType(item, character))
  ))
}

export function calendarSections(items = [], view = 'todos', character = 'todos') {
  const selected = calendarSelection(items, view, character)
  const sections = ['semana-santa', 'gloria'].flatMap((key) => {
    if (view !== 'todos' && view !== key) return []
    const members = selected.filter((item) => hasDirectoryType(item, key))
    if (!members.length) return []
    const ordered = key === 'semana-santa' ? HOLY_WEEK_DAYS : MONTHS
    const periods = [...ordered, ''].map((period) => ({
      key: directorySlug(period) || 'sin-fecha',
      label: period === 'Madrugada' ? 'Madrugá' : period || 'Sin fecha documentada',
      period,
      items: members.filter((item) => directoryPeriod(item, key) === period),
    })).filter((group) => group.items.length)
    return [{ key, label: key === 'semana-santa' ? 'Semana Santa' : 'Glorias', periods }]
  })
  if (view === 'todos') {
    const other = selected.filter((item) => !hasDirectoryType(item, 'semana-santa') && !hasDirectoryType(item, 'gloria'))
    if (other.length) sections.push({
      key: 'otras', label: 'Otras corporaciones',
      periods: [{ key: 'sin-calendario', label: '', period: '', items: other }],
    })
  }
  return sections
}

// Preserve the indexed SSR collection. Explicit search and municipality lookup
// continue to include every publicly accessible profile, as in the previous V4.
export function visibleLocalityBrotherhoods(items = [], indexableIds = [], filters = {}) {
  const explicitLookup = Boolean(String(filters.query || '').trim())
    || Boolean(filters.municipality && filters.municipality !== 'todos')
  const eligible = new Set(indexableIds)
  const source = explicitLookup ? items : items.filter((item) => eligible.has(item.id))
  return uniqueCalendarBrotherhoods(filterDirectoryBrotherhoods(source, filters))
}

export function localityAnchor(group) {
  return `hermandades-${directorySlug(group.key)}`
}

export function localityFromHash(groups = [], hash = '') {
  let value
  try { value = decodeURIComponent(hash.replace(/^#/, '')) } catch { return null }
  return groups.find((group) => [
    localityAnchor(group), `${localityAnchor(group)}-titulo`,
    `hermandades-${group.key}`, `hermandades-${group.key}-titulo`,
  ].includes(value)) || null
}
