// «Tal día como hoy» / «Esta semana en la historia» (decisión del 23/11/2026):
// efeméride exacta si hay un hecho ese día de un año anterior; si no, el hecho
// más cercano dentro de ±3 días. Solo hechos históricos, nunca la agenda
// operativa (igualás, ensayos, mudas…), y nunca del año en curso.

export const EPHEMERIS_WEEK_RADIUS = 3

// Tipos de `events` que son agenda operativa, no historia.
export const OPERATIONAL_EVENT_TYPES = new Set([
  'iguala', 'ensayo', 'concierto', 'muda', 'retranqueo', 'desarma', 'reunion_cuadrilla',
  'certamen', 'Conferencia', 'Exposición',
])

// Prioridad editorial: a igualdad de día, primero lo que más pesa.
const KIND_PRIORITY = [
  [/coronaci[oó]n|breve pontificio|patronazgo|voto mariano/i, 50],
  [/fundaci[oó]n|erecci[oó]n|aprobaci[oó]n (can[oó]nica|de reglas)|reglas|fusi[oó]n|institucion/i, 40],
  [/primera (salida|estaci[oó]n)|first_(procession|station)|hito/i, 35],
  [/bendici[oó]n|blessing|estreno|marcha/i, 30],
  [/extraordinari/i, 25],
]

const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']

function parts(dateKey) {
  const match = String(dateKey || '').match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!match) return null
  return { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]) }
}

// Día del año en un año bisiesto fijo, para comparar fechas sin el año.
function dayOfYear({ month, day }) {
  return Math.floor((Date.UTC(2000, month - 1, day) - Date.UTC(2000, 0, 1)) / 86400000)
}

function circularDistance(a, b) {
  const diff = Math.abs(a - b)
  return Math.min(diff, 366 - diff)
}

export function kindPriority(kind = '') {
  for (const [pattern, value] of KIND_PRIORITY) if (pattern.test(kind)) return value
  return 10
}

function stableIndex(key, length) {
  if (!length) return 0
  const hash = [...key].reduce((total, char) => ((total * 31) + char.charCodeAt(0)) >>> 0, 7)
  return hash % length
}

export function longDate(dateKey) {
  const value = parts(dateKey)
  if (!value) return ''
  return `${value.day} de ${MONTHS[value.month - 1]} de ${value.year}`
}

export function yearsAgoLabel(dateKey, today) {
  const from = parts(dateKey)
  const to = parts(today)
  if (!from || !to) return ''
  const years = to.year - from.year
  if (years <= 0) return ''
  return years === 1 ? 'hace un año' : `hace ${years} años`
}

// Candidatos válidos: con fecha, título, enlace y de un año anterior.
function eligible(candidates, today) {
  const now = parts(today)
  if (!now) return []
  return candidates.filter((item) => {
    const value = parts(item?.date)
    return value && value.year < now.year && item.title && item.href
  })
}

export function selectEphemeris(candidates = [], today) {
  const now = parts(today)
  if (!now) return null
  const pool = eligible(candidates, today)
  const target = dayOfYear(now)

  const ranked = (items) => {
    if (!items.length) return null
    const best = Math.max(...items.map((item) => item.priority ?? kindPriority(item.kind)))
    const top = items
      .filter((item) => (item.priority ?? kindPriority(item.kind)) === best)
      .sort((a, b) => String(a.id).localeCompare(String(b.id)))
    return top[stableIndex(`${today}:ephemeris`, top.length)]
  }

  const exact = pool.filter((item) => {
    const value = parts(item.date)
    return value.month === now.month && value.day === now.day
  })
  if (exact.length) return { mode: 'day', item: ranked(exact) }

  for (let distance = 1; distance <= EPHEMERIS_WEEK_RADIUS; distance += 1) {
    const near = pool.filter((item) => circularDistance(dayOfYear(parts(item.date)), target) === distance)
    if (near.length) return { mode: 'week', item: ranked(near) }
  }
  return null
}

function sentence(text = '') {
  const value = String(text || '').trim().replace(/\s+/g, ' ')
  if (!value) return ''
  return /[.!?…»"]$/.test(value) ? value : `${value}.`
}

// Tarjeta para «Hoy en Hilo Cofrade»: mismo formato que la efeméride anterior.
export function ephemerisCardFromSelection(selection, today) {
  const item = selection?.item
  if (!item) return null
  const when = [longDate(item.date), yearsAgoLabel(item.date, today)].filter(Boolean).join(' · ')
  const detail = sentence(item.summary)
  return {
    id: `ephemeris:${item.id}`,
    kind: 'ephemeris',
    icon: 'EF',
    label: selection.mode === 'day' ? 'Tal día como hoy' : 'Esta semana en la historia',
    title: item.title,
    summary: [sentence(when), detail].filter(Boolean).join(' '),
    href: item.href,
    linkLabel: 'Seguir el hilo →',
    rootEntityId: item.rootEntityId || '',
  }
}
