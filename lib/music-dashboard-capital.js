import { dashboardFilters as baseFilters, dashboardHref as baseHref, selectMusicDashboard as baseSelect } from './music-dashboard.js'
import { SEMANA_SANTA_DAYS } from './music-changes.js'
export { DASHBOARD_PATH, DASHBOARD_ORDERS, musicDashboardCsv } from './music-dashboard.js'

export const DASHBOARD_DAYS = [...SEMANA_SANTA_DAYS.map((day) => day.label), 'Semana Santa']
export const DASHBOARD_POSITIONS = [{ key: 'paso', label: 'Acompañamiento de pasos' }, { key: 'guia', label: 'Cruz de guía' }, { key: 'otros', label: 'Otros o sin posición precisa' }]
const normal = (value = '') => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
const valueOf = (params, key) => { const value = typeof params.get === 'function' ? params.get(key) : params[key]; return String(Array.isArray(value) ? value[0] ?? '' : value ?? '') }

/** Defaults affect the entry view, not the public reader's eligibility rules. */
export function dashboardFilters(params = {}) {
  params ||= {}
  const filters = baseFilters(params)
  const hasScope = typeof params.has === 'function' ? params.has('ambito') : Object.prototype.hasOwnProperty.call(params, 'ambito')
  if (!hasScope && !filters.municipality && !filters.band) filters.scope = 'capital'
  if (!valueOf(params, 'orden')) filters.order = 'total'
  filters.day = DASHBOARD_DAYS.includes(valueOf(params, 'jornada')) ? valueOf(params, 'jornada') : ''
  filters.position = DASHBOARD_POSITIONS.some((item) => item.key === valueOf(params, 'posicion')) ? valueOf(params, 'posicion') : ''
  filters.section = ['juvenil', 'sin-mencion'].includes(valueOf(params, 'seccion')) ? valueOf(params, 'seccion') : ''
  return filters
}

export function dashboardHref(filters) {
  const url = new URL(baseHref(filters), 'https://hilocofrade.es')
  // Explicit all-territory state survives reload, back, reset and shared URLs.
  if (!filters.scope) url.searchParams.set('ambito', 'todos')
  if (!filters.order || filters.order === 'nombre') url.searchParams.set('orden', 'nombre')
  for (const [key, value] of Object.entries({ jornada: filters.day, posicion: filters.position, seccion: filters.section })) if (value) url.searchParams.set(key, value)
  return url.pathname + url.search
}

/** The explicit position outranks a legacy step label (e.g. Cristo + Cruz de Guía). */
export function accompanimentPosition(item) {
  const position = normal(item.position)
  const step = normal(item.stepName)
  if (/cruz de guia/.test(position)) return /(?:y|;).*\b(?:tras|ante|delante).*\bpaso\b/.test(position) ? 'otros' : 'guia'
  if (/cruz de guia/.test(step) && !/\b(?:tras|ante|delante).*\bpaso\b/.test(position)) return 'guia'
  if (/\b(paso|palio|misterio|cristo|senor|virgen|nazareno|piedad|descendimiento|urna|resucitado)\b/.test(`${position} ${step}`)) return 'paso'
  return 'otros'
}

export function isJuvenileAccompaniment(item, band = {}) {
  return /\bjuvenil(?:es)?\b/.test(normal(`${band.name || ''} ${item.position || ''} ${item.stepName || ''}`))
}

export function selectMusicDashboard(summary, filters = {}, pageSize = 10) {
  const include = (item, band) => (!filters.day || item.day === filters.day)
    && (!filters.position || accompanimentPosition(item) === filters.position)
    && (!filters.section || (filters.section === 'juvenil') === isJuvenileAccompaniment(item, band))
  const narrowed = { ...summary, bands: (summary.bands || []).map((band) => ({ ...band,
    items: (band.items || []).filter((item) => include(item, band)),
    pendingItems: (band.pendingItems || []).filter((item) => include(item, band)),
  })) }
  const data = baseSelect(narrowed, filters, pageSize)
  const days = new Map(DASHBOARD_DAYS.map((name) => [name, { name, count: 0, steps: 0, guides: 0, others: 0 }]))
  const positions = { steps: 0, guides: 0, others: 0, juvenile: 0 }
  const field = { paso: 'steps', guia: 'guides', otros: 'others' }
  for (const band of data.rows) {
    Object.assign(band, { steps: 0, guides: 0, others: 0, juvenile: 0 })
    for (const item of band.items) {
      const key = field[accompanimentPosition(item)]
      band[key] += 1; positions[key] += 1
      if (isJuvenileAccompaniment(item, band)) { band.juvenile += 1; positions.juvenile += 1 }
      const name = item.day || 'Semana Santa'
      if (!days.has(name)) days.set(name, { name, count: 0, steps: 0, guides: 0, others: 0 })
      days.get(name).count += 1; days.get(name)[key] += 1
    }
  }
  return { ...data, positions, byDay: [...days.values()].filter((day) => day.name !== 'Semana Santa' || day.count > 0) }
}
