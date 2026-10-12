// Validación del formulario de destacados de portada (Panel → Portada editorial).
// Módulo puro: sin Next ni Supabase, para poder probarlo directamente.

const UUID = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i
const DATE = /^\d{4}-\d{2}-\d{2}$/

// Un destacado es una excepción temporal; una ventana más larga suele ser un error.
export const HOME_FEATURED_MAX_DAYS = 31
export const HOME_FEATURED_MAX_PRIORITY = 100

function validDate(value) {
  const key = String(value || '').trim()
  if (!DATE.test(key)) return ''
  const parsed = new Date(`${key}T12:00:00Z`)
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === key ? key : ''
}

function daysBetween(start, end) {
  return Math.round((Date.parse(`${end}T12:00:00Z`) - Date.parse(`${start}T12:00:00Z`)) / 86400000)
}

export function parseHomeFeaturedInput({ outingId, startsOn, endsOn, priority } = {}) {
  const id = String(outingId || '').trim()
  if (!UUID.test(id)) throw new Error('Selecciona una salida válida.')

  const start = validDate(startsOn)
  const end = validDate(endsOn)
  if (!start || !end) throw new Error('Indica fechas de inicio y fin válidas.')
  if (end < start) throw new Error('La fecha de fin no puede ser anterior a la de inicio.')
  if (daysBetween(start, end) + 1 > HOME_FEATURED_MAX_DAYS) {
    throw new Error(`Un destacado no puede durar más de ${HOME_FEATURED_MAX_DAYS} días.`)
  }

  const rawPriority = String(priority ?? '').trim()
  const parsedPriority = rawPriority ? Number(rawPriority) : 0
  if (!Number.isInteger(parsedPriority) || parsedPriority < 0 || parsedPriority > HOME_FEATURED_MAX_PRIORITY) {
    throw new Error(`La prioridad debe ser un número entero entre 0 y ${HOME_FEATURED_MAX_PRIORITY}.`)
  }

  return { outingId: id, startsOn: start, endsOn: end, priority: parsedPriority }
}

// Estado legible de un destacado respecto a la fecha de hoy (Madrid).
export function homeFeaturedStatus({ startsOn, endsOn } = {}, todayKey = '') {
  if (!startsOn || !endsOn || !todayKey) return 'unknown'
  if (todayKey < startsOn) return 'scheduled'
  if (todayKey > endsOn) return 'ended'
  return 'active'
}
