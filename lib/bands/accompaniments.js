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

const STEP_POSITION_TYPES = [
  {
    label: 'Paso de misterio',
    prefixes: ['tras el paso de misterio', 'tras paso de misterio', 'paso de misterio'],
  },
  {
    label: 'Paso de palio',
    prefixes: ['tras el paso de palio', 'tras paso de palio', 'paso de palio'],
  },
  {
    label: 'Paso de Cristo',
    prefixes: ['tras el paso del cristo', 'tras el paso de cristo', 'tras el cristo', 'paso de cristo'],
  },
  {
    label: 'Paso de Virgen',
    prefixes: ['tras el paso de la virgen', 'tras el paso de virgen', 'tras la virgen', 'paso de virgen'],
  },
  {
    label: 'Paso de Custodia',
    prefixes: ['tras el paso de la custodia', 'tras la custodia', 'paso de custodia'],
  },
]

function positionType(value = '') {
  const key = outingTypeKey(value)
  if (!key) return null

  return STEP_POSITION_TYPES.find((type) => type.prefixes.some((prefix) => (
    key === prefix
    || key.startsWith(`${prefix} · `)
    || key.startsWith(`${prefix} — `)
    || key.startsWith(`${prefix} – `)
  ))) || null
}

function stepNameType(value = '') {
  const key = outingTypeKey(value)
  if (/^paso de misterio (?:del|de)\s+/.test(key)) return { label: 'Paso de misterio' }
  if (/^paso de palio (?:del|de)\s+/.test(key)) return { label: 'Paso de palio' }
  return null
}

function stripStepPrefix(value = '', type = null) {
  const raw = String(value || '').replace(/\s+/g, ' ').trim()
  if (!raw || !type) return raw

  if (type.label === 'Paso de misterio') {
    return raw.replace(/^Paso de misterio\s+(?:del|de)\s+/i, '').trim()
  }
  if (type.label === 'Paso de palio') {
    return raw.replace(/^Paso de palio\s+(?:del|de)\s+/i, '').trim()
  }
  return raw
}

function positionContext(value = '', type = null) {
  const raw = String(value || '').replace(/\s+/g, ' ').trim()
  if (!raw || !type) return ''

  const separator = raw.match(/\s(?:·|—|–)\s/)
  return separator ? raw.slice(separator.index + separator[0].length).trim() : ''
}

export function presentAccompanimentStep(item = {}) {
  const canonicalName = String(item.stepName || '').replace(/\s+/g, ' ').trim()
  const canonicalPosition = String(item.position || '').replace(/\s+/g, ' ').trim()

  if (!canonicalName) {
    return { type: '', name: '', position: canonicalPosition }
  }

  const nameType = stepNameType(canonicalName)
  const documentedPositionType = positionType(canonicalPosition)
  const type = nameType || documentedPositionType

  if (!type) {
    return { type: '', name: canonicalName, position: '' }
  }

  return {
    type: type.label,
    name: stripStepPrefix(canonicalName, type),
    position: documentedPositionType ? positionContext(canonicalPosition, documentedPositionType) : '',
  }
}

export function presentAccompanimentLocation(item = {}) {
  const municipality = String(item.municipality || '').trim()
  if (!municipality) return ''
  return outingTypeKey(municipality) === 'sevilla' ? 'Sevilla' : municipality
}

export function formatOutingType(value = '') {
  const raw = String(value || '').trim()
  if (!raw) return ''

  const key = outingTypeKey(raw)
  return OUTING_TYPE_LABELS.get(key) || raw.replace(/_/g, ' ').replace(/\s+/g, ' ').trim()
}

const HOLY_WEEK_ORDER_KEYS = HOLY_WEEK_OUTING_ORDER.map(outingTypeKey)
const GENERIC_HOLY_WEEK_KEYS = new Set([
  'estacion de penitencia',
  'estacion penitencia',
])

function holyWeekDayFromText(value = '') {
  const text = outingTypeKey(value)
  if (!text) return ''

  return HOLY_WEEK_OUTING_ORDER
    .map((label) => ({ label, index: text.indexOf(outingTypeKey(label)) }))
    .filter((item) => item.index >= 0)
    .sort((first, second) => first.index - second.index)[0]?.label || ''
}

export function resolveAccompanimentOutingType(item = {}) {
  const sourceKey = outingTypeKey(item.outingType)
  const formatted = formatOutingType(item.outingType)

  if (!GENERIC_HOLY_WEEK_KEYS.has(sourceKey)) return formatted

  return holyWeekDayFromText(item.processionDay)
    || holyWeekDayFromText(item.notes)
    || 'Día por documentar'
}

export function presentAccompanimentMoment(item = {}) {
  const resolved = resolveAccompanimentOutingType(item)
  return resolved === 'Día por documentar' ? 'Semana Santa' : resolved
}

function comparablePresentationText(value = '') {
  return outingTypeKey(value)
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Retira del texto visible únicamente los segmentos que repiten de forma
 * literal la jornada o el tipo ya mostrado en la cabecera. No modifica el
 * dato almacenado y conserva cualquier frase que añada contexto documental.
 */
export function presentAccompanimentNotes(item = {}, displayedMoment = '') {
  const notes = String(item.notes || '').replace(/\r\n/g, '\n').trim()
  if (!notes) return ''

  if (/^Acompañamiento vigente en (?:19|20)\d{2}\.?$/i.test(notes)) return ''

  const repeatedMoments = new Set([
    presentAccompanimentMoment(item),
    displayedMoment,
  ].map(comparablePresentationText).filter(Boolean))
  if (!repeatedMoments.size) return notes
  if (repeatedMoments.has(comparablePresentationText(notes))) return ''

  const segments = notes.match(/[^.\n;·]+(?:[.;·]+|\n+|$)\s*/g) || [notes]
  let removed = false
  const visible = segments.filter((segment) => {
    const repeated = repeatedMoments.has(comparablePresentationText(segment))
    if (repeated) removed = true
    return !repeated
  })

  if (!removed) return notes
  return visible.join('').trim().replace(/[;·]\s*$/, '').trim()
}

function holyWeekOrderIndex(value = '') {
  const key = outingTypeKey(value)
  const index = HOLY_WEEK_ORDER_KEYS.indexOf(key)
  if (index >= 0) return index
  return GENERIC_HOLY_WEEK_KEYS.has(key) ? HOLY_WEEK_OUTING_ORDER.length : -1
}

function compactPeriodText(value = '') {
  const text = String(value || '').replace(/\s+/g, ' ').trim()
  if (!text) return ''

  const year = text.match(/\b(?:19|20)\d{2}\b/)?.[0] || ''

  if (/\bconfirmad[oa]\b/i.test(text)) {
    return year ? `Vigente · ${year}` : 'Vigente'
  }

  if (text.length <= 18 && !/[.!?]/.test(text)) return text

  return ''
}

function normalizeAccompaniment(item = {}) {
  const outingType = resolveAccompanimentOutingType(item)
  const historicalPeriod = item.yearTo && !item.yearFrom ? `Hasta ${item.yearTo}` : ''
  return {
    ...item,
    outingType,
    periodText: historicalPeriod || compactPeriodText(item.periodText),
    notes: presentAccompanimentNotes(item, outingType),
  }
}

export function splitCurrentAccompaniments(items = []) {
  return items.reduce((groups, sourceItem) => {
    const item = normalizeAccompaniment(sourceItem)
    const sourceWasGenericHolyWeek = GENERIC_HOLY_WEEK_KEYS.has(outingTypeKey(sourceItem.outingType))
    const target = sourceWasGenericHolyWeek || holyWeekOrderIndex(item.outingType) >= 0
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
      key: 'otros-acompanamientos',
      label: 'Otros acompañamientos',
      detail: 'Relaciones musicales documentadas fuera de los ámbitos anteriores',
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
