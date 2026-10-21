// Reloj único de la agenda: si un acto ya terminó y qué etiqueta de tiempo lleva
// («HOY», «MAÑANA», «ESTE SÁBADO», «EN 12 DÍAS», «EN MAYO DE 2027»). Lo usan la
// Agenda, Hoy/Mañana/Fin de semana, las guías de localidad, la portada,
// Extraordinarias, Glorias e Igualás, para que todas digan lo mismo.

const MADRID = 'Europe/Madrid'
const WEEKDAYS = ['DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO']
const MONTHS = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE']

function dateKey(value = '') {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(value)) ? String(value) : ''
}

export function madridNow(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: MADRID, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(now)
  const value = (type) => parts.find((part) => part.type === type)?.value || ''
  return { today: `${value('year')}-${value('month')}-${value('day')}`, minutes: Number(value('hour')) * 60 + Number(value('minute')) }
}

function minutesOf(value = '') {
  const match = String(value || '').match(/(?:^|\D)([01]?\d|2[0-3]):([0-5]\d)(?=\D|$)/)
  return match ? Number(match[1]) * 60 + Number(match[2]) : null
}

function allTimes(value = '') {
  return [...String(value || '').matchAll(/(?:^|\D)([01]?\d|2[0-3]):([0-5]\d)(?=\D|$)/g)].map((m) => Number(m[1]) * 60 + Number(m[2]))
}

// Hora de inicio y de fin del acto en un día concreto: horario del día (cultos de
// varios días), hora de salida/entrada o el texto de horario («09:00–21:00»).
export function agendaDayTimes(item = {}, day = '') {
  const daySchedule = (Array.isArray(item.daySchedules) ? item.daySchedules : [])
    .find((entry) => dateKey(entry?.celebrationDate) === day)
  const text = daySchedule ? `${daySchedule.startTime || ''} ${daySchedule.timeText || ''}` : item.timeText || ''
  const textTimes = allTimes(text)
  const start = minutesOf(daySchedule?.startTime) ?? minutesOf(item.startTime) ?? (textTimes[0] ?? null)
  const end = minutesOf(item.endTime) ?? (textTimes.length > 1 ? textTimes.at(-1) : null)
  return { start, end }
}

// Un acto está terminado cuando ya pasó su último día o, en su último día, ya
// pasó su hora de fin. Sin hora final no se inventa una duración.
export function isAgendaItemOver(item = {}, now = new Date()) {
  const { today, minutes } = madridNow(now)
  const last = dateKey(item.endDate) || dateKey(item.date)
  if (!last) return false
  if (last < today) return true
  if (last > today) return false
  const { start, end } = agendaDayTimes(item, today)
  // Termina tras la medianoche (salida 19:00, entrada 01:30): no ha terminado hoy.
  if (end !== null && start !== null && end <= start) return false
  if (end !== null) return minutes > end
  return false
}

export function daysUntil(date = '', today = '') {
  const a = dateKey(today)
  const b = dateKey(date)
  if (!a || !b) return null
  return Math.round((Date.parse(`${b}T12:00:00Z`) - Date.parse(`${a}T12:00:00Z`)) / 86400000)
}

// Etiqueta de cuenta atrás en mayúsculas. «ESTE SÁBADO» solo dentro de la misma
// semana (2 a 6 días); más allá de un mes, el mes en lugar de «PRÓXIMA».
export function temporalUrgencyLabel(date = '', today = '') {
  const days = daysUntil(date, today)
  if (days === null || days < 0) return ''
  if (days === 0) return 'HOY'
  if (days === 1) return 'MAÑANA'
  const target = new Date(`${date}T12:00:00Z`)
  if (days <= 6) return `ESTE ${WEEKDAYS[target.getUTCDay()]}`
  if (days <= 31) return `EN ${days} DÍAS`
  const sameYear = date.slice(0, 4) === today.slice(0, 4)
  return `EN ${MONTHS[target.getUTCMonth()]}${sameYear ? '' : ` DE ${date.slice(0, 4)}`}`
}

// Clave de orden por hora real: hora de salida, o la primera hora del texto
// («Tras la Misa de 10:00» → 10:00). Sin hora, al final del día.
export function agendaSortTime(item = {}, day = '') {
  const { start } = agendaDayTimes(item, day || item.temporalDate || item.date)
  const fromSchedule = (Array.isArray(item.schedule) ? item.schedule : [])
    .map((row) => minutesOf(row?.time) ?? minutesOf(row?.timeText))
    .find((value) => value !== null && value !== undefined)
  const value = start ?? fromSchedule ?? 24 * 60 - 1
  return `${String(Math.floor(value / 60)).padStart(2, '0')}:${String(value % 60).padStart(2, '0')}`
}
