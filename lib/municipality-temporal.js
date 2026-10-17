import { agendaSortTime } from './agenda-clock.js'

function dateKey(value = '') {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(value)) ? String(value) : ''
}

export function addAgendaDays(value = '', amount = 0) {
  const key = dateKey(value)
  if (!key) return ''
  const date = new Date(`${key}T12:00:00Z`)
  date.setUTCDate(date.getUTCDate() + Number(amount || 0))
  return date.toISOString().slice(0, 10)
}

export function agendaWeekendRange(today = '') {
  const key = dateKey(today)
  if (!key) return ['', '']
  const weekday = new Date(`${key}T12:00:00Z`).getUTCDay()
  const saturdayDistance = weekday === 0 ? -1 : weekday === 6 ? 0 : 6 - weekday
  const start = addAgendaDays(key, saturdayDistance)
  return [start, addAgendaDays(start, 1)]
}

// Un triduo que empezó el jueves cuenta hoy como «de hoy», no como de hace dos días.
function sortKey(item, today) {
  const date = item?.date || '9999-12-31'
  const effective = today && date < today && (item?.endDate || date) >= today ? today : date
  return `${effective}T${agendaSortTime(item, effective)}`
}

function overlapsDay(item, day = '') {
  const start = dateKey(item?.date)
  const target = dateKey(day)
  if (!start || !target) return false
  const end = dateKey(item?.endDate) || start
  return start <= target && end >= target
}

function overlapsRange(item, start = '', end = '') {
  const itemStart = dateKey(item?.date)
  const rangeStart = dateKey(start)
  const rangeEnd = dateKey(end)
  if (!itemStart || !rangeStart || !rangeEnd) return false
  const itemEnd = dateKey(item?.endDate) || itemStart
  return itemStart <= rangeEnd && itemEnd >= rangeStart
}

export function buildMunicipalityTemporal(items = [], today = '') {
  const key = dateKey(today)
  if (!key) {
    return {
      today: '',
      tomorrow: '',
      weekendStart: '',
      weekendEnd: '',
      liveItems: [],
      todayItems: [],
      tomorrowItems: [],
      weekendItems: [],
      closestItems: [],
    }
  }

  const ordered = [...items].sort((a, b) => sortKey(a, key).localeCompare(sortKey(b, key)))
  const tomorrow = addAgendaDays(key, 1)
  const [weekendStart, weekendEnd] = agendaWeekendRange(key)
  const liveItems = ordered.filter((item) => item?.liveState?.isLive)
  const closestItems = ordered
    .filter((item) => !item?.liveState?.isLive && item?.liveState?.state !== 'done')
    .slice(0, 3)

  return {
    today: key,
    tomorrow,
    weekendStart,
    weekendEnd,
    liveItems,
    todayItems: ordered.filter((item) => overlapsDay(item, key)),
    tomorrowItems: ordered.filter((item) => overlapsDay(item, tomorrow)),
    weekendItems: ordered.filter((item) => overlapsRange(item, weekendStart, weekendEnd)),
    closestItems,
  }
}
