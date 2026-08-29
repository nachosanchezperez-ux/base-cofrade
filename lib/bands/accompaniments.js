export const HOLY_WEEK_OUTING_ORDER = [
  'Viernes de Dolores',
  'Sábado de Pasión',
  'Domingo de Ramos',
  'Lunes Santo',
  'Martes Santo',
  'Miércoles Santo',
  'Jueves Santo',
  'Madrugá',
  'Viernes Santo',
  'Sábado Santo',
  'Domingo de Resurrección',
]

const OUTING_TYPE_LABELS = new Map([
  ['estacion de penitencia', 'Estación de penitencia'],
  ['estacion penitencia', 'Estación de penitencia'],
  ['procesion gloria', 'Procesión de gloria'],
  ['procesion de gloria', 'Procesión de gloria'],
  ['gloria', 'Procesión de gloria'],
  ['procesion eucaristica', 'Procesión eucarística'],
  ['procesion penitencial', 'Procesión penitencial'],
  ['procesion extraordinaria', 'Procesión extraordinaria'],
  ['romeria', 'Romería'],
  ['gloria / procesion eucaristica', 'Gloria / procesión eucarística'],
  ['procesion triunfal y romeria', 'Procesión triunfal y romería'],
  ['madruga', 'Madrugá'],
  ['madrugada', 'Madrugá'],
])

function outingTypeKey(value = '') {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .toLocaleLowerCase('es')
    .trim()
}

const STEP_TYPE_LABELS = [
  { key: 'paso de misterio', label: 'Paso de misterio' },
  { key: 'paso de palio', label: 'Paso de palio' },
  { key: 'paso de cristo', label: 'Paso de Cristo' },
  { key: 'paso de virgen', label: 'Paso de Virgen' },
]

function stepType(value = '') {
  const key = outingTypeKey(value)
  return STEP_TYPE_LABELS.find((item) => key.includes(item.key)) || null
}

function stripStepPrefix(value = '', type = null) {
  const raw = String(value || '').trim()
  if (!raw || !type) return raw

  const escapedType = type.key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return raw.replace(new RegExp(`^${escapedType}\\s+(?:del|de)\\s+`, 'i'), '').trim()
}

function stripPositionType(value = '', type = null) {
  const raw = String(value || '').trim()
  if (!raw || !type) return raw

  const normalized = outingTypeKey(raw)
  const typeIndex = normalized.indexOf(type.key)
  if (typeIndex < 0) return raw

  const separator = raw.match(/\s(?:·|—|–)\s/)
  return separator ? raw.slice(separator.index + separator[0].length).trim() : ''
}

export function presentAccompanimentStep(item = {}) {
  const canonicalName = String(item.stepName || '').trim()
  const canonicalPosition = String(item.position || '').trim()
  const type = stepType(canonicalName) || stepType(canonicalPosition)

  return {
    type: type?.label || '',
    name: stripStepPrefix(canonicalName, type),
    position: stripPositionType(canonicalPosition, type),
  }
}

export function presentAccompanimentLocation(item = {}) {
  const municipality = String(item.municipality || '').trim()
  if (!municipality) return 'Por documentar'
  return outingTypeKey(municipality) === 'sevilla' ? 'Sevilla' : municipality
}

export function formatOutingType(value = '') {
  const raw = String(value || '').trim()
  if (!raw) return 'Salida procesional'

  const key = outingTypeKey(raw)
  return OUTING_TYPE_LABELS.get(key) || raw.replace(/_/g, ' ').replace(/\s+/g, ' ').trim()
}

const HOLY_WEEK_ORDER_KEYS = HOLY_WEEK_OUTING_ORDER.map(outingTypeKey)
const GENERIC_HOLY_WEEK_KEYS = new Set([
  'estacion de penitencia',
  'estacion penitencia',
])

function holyWeekOrderIndex(value = '') {
  const key = outingTypeKey(value)
  const index = HOLY_WEEK_ORDER_KEYS.indexOf(key)
  if (index >= 0) return index
  return GENERIC_HOLY_WEEK_KEYS.has(key) ? HOLY_WEEK_OUTING_ORDER.length : -1
}

function normalizeAccompaniment(item = {}) {
  return {
    ...item,
    outingType: formatOutingType(item.outingType),
  }
}

export function splitCurrentAccompaniments(items = []) {
  return items.reduce((groups, sourceItem) => {
    const item = normalizeAccompaniment(sourceItem)
    const target = holyWeekOrderIndex(item.outingType) >= 0
      ? groups.holyWeek
      : groups.glories
    target.push(item)
    return groups
  }, { holyWeek: [], glories: [] })
}

export function partitionAccompanimentsBySeason(currentItems = [], historicalItems = [], currentYear) {
  const seasonYear = Number(currentYear)
  const hasValidSeason = Number.isInteger(seasonYear)
  const normalizedCurrentItems = currentItems.map(normalizeAccompaniment)
  const normalizedHistoricalItems = historicalItems.map(normalizeAccompaniment)
  const endedItems = hasValidSeason
    ? normalizedCurrentItems.filter((item) => item.yearTo && item.yearTo < seasonYear)
    : []
  const upcomingItems = hasValidSeason
    ? normalizedCurrentItems.filter((item) => item.yearFrom && item.yearFrom > seasonYear)
    : []

  return {
    current: hasValidSeason
      ? normalizedCurrentItems.filter((item) => (
        (!item.yearTo || item.yearTo >= seasonYear)
        && (!item.yearFrom || item.yearFrom <= seasonYear)
      ))
      : [...normalizedCurrentItems],
    upcoming: upcomingItems,
    historical: [...normalizedHistoricalItems, ...endedItems],
  }
}

export function sortHolyWeekAccompaniments(items = []) {
  return [...items].sort((a, b) => {
    const aIndex = holyWeekOrderIndex(a.outingType)
    const bIndex = holyWeekOrderIndex(b.outingType)
    const safeAIndex = aIndex >= 0 ? aIndex : Number.MAX_SAFE_INTEGER
    const safeBIndex = bIndex >= 0 ? bIndex : Number.MAX_SAFE_INTEGER
    return safeAIndex - safeBIndex
      || (a.brotherhoodName || '').localeCompare(b.brotherhoodName || '', 'es')
  })
}

export function sortGloryAccompaniments(items = []) {
  return [...items].sort((a, b) => (
    (a.municipality || '').localeCompare(b.municipality || '', 'es')
    || (a.brotherhoodName || '').localeCompare(b.brotherhoodName || '', 'es')
  ))
}

export function resolveAccompanimentLocation(period = {}, brotherhood = null, municipality = null) {
  return {
    brotherhoodTypes: brotherhood?.brotherhood_types || [],
    municipality: municipality?.name || period.public_municipality_name || '',
    municipalitySlug: municipality?.slug || period.public_municipality_slug || '',
    province: municipality?.province || period.public_province || '',
  }
}

export function groupGloryAccompaniments(items = []) {
  const ordered = sortGloryAccompaniments(items)
  const groups = [
    {
      key: 'sevilla-capital',
      label: 'Sevilla capital',
      detail: 'Acompañamientos en la ciudad de Sevilla',
      items: ordered.filter((item) => item.municipalitySlug === 'sevilla'),
    },
    {
      key: 'provincia-sevilla',
      label: 'Provincia de Sevilla',
      detail: 'Acompañamientos en los municipios de la provincia',
      items: ordered.filter((item) => item.municipalitySlug !== 'sevilla' && item.province === 'Sevilla'),
    },
    {
      key: 'otros-ambitos',
      label: 'Otros ámbitos',
      detail: 'Acompañamientos fuera de la provincia de Sevilla',
      items: ordered.filter((item) => item.municipalitySlug && item.province && item.province !== 'Sevilla'),
    },
    {
      key: 'por-documentar',
      label: 'Localidad por documentar',
      detail: 'Acompañamientos pendientes de ubicación',
      items: ordered.filter((item) => !item.municipalitySlug),
    },
  ]

  return groups.filter((group) => group.items.length > 0)
}

export function summarizeGloryTypes(items = []) {
  const labels = new Map([
    ['Procesión de gloria', 'Procesiones de gloria'],
    ['Procesión eucarística', 'Procesiones eucarísticas'],
    ['Procesión extraordinaria', 'Procesiones extraordinarias'],
    ['Procesión penitencial', 'Procesiones penitenciales'],
    ['Romería', 'Romerías'],
  ])
  const counts = new Map()

  items.forEach((item) => {
    const type = formatOutingType(item.outingType)
    counts.set(type, (counts.get(type) || 0) + 1)
  })

  return [...counts.entries()]
    .map(([type, count]) => ({ type, label: labels.get(type) || type, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, 'es'))
}
