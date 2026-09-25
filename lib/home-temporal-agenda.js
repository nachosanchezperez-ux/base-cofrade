import { getProcessionLiveState } from './procession-live-status.js'

const LIVE_CATEGORIES = new Set(['processions', 'transfers', 'rosaries'])

function dateKey(value = '') {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(value)) ? String(value) : ''
}

function addDays(value = '', amount = 0) {
  const key = dateKey(value)
  if (!key) return ''
  const date = new Date(`${key}T12:00:00Z`)
  date.setUTCDate(date.getUTCDate() + Number(amount || 0))
  return date.toISOString().slice(0, 10)
}

function weekendRange(today = '') {
  const key = dateKey(today)
  if (!key) return ['', '']
  const weekday = new Date(`${key}T12:00:00Z`).getUTCDay()
  const saturdayDistance = weekday === 0 ? -1 : weekday === 6 ? 0 : 6 - weekday
  const start = addDays(key, saturdayDistance)
  return [start, addDays(start, 1)]
}

function madridClock(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Madrid',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now)
  const value = (type) => parts.find((part) => part.type === type)?.value || ''
  return {
    dateKey: `${value('year')}-${value('month')}-${value('day')}`,
    minutes: (Number(value('hour')) * 60) + Number(value('minute')),
  }
}

function timeMinutes(value = '') {
  const match = String(value).match(/(?:^|\D)([01]?\d|2[0-3]):([0-5]\d)(?:\D|$)/)
  if (!match) return null
  return (Number(match[1]) * 60) + Number(match[2])
}

function compareItems(first, second) {
  return `${first?.date || '9999-12-31'}T${first?.startTime || '23:59'}`
    .localeCompare(`${second?.date || '9999-12-31'}T${second?.startTime || '23:59'}`)
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

function freshLiveState(item, now) {
  if (!LIVE_CATEGORIES.has(item?.category)) return item?.liveState || null
  return getProcessionLiveState({
    date: item?.date || '',
    endDate: item?.endDate || '',
    startTime: item?.startTime || '',
    endTime: item?.endTime || '',
  }, now)
}

function isRemainingToday(item, today, currentMinutes) {
  if (!overlapsDay(item, today)) return false
  if (item?.liveState?.state === 'done') return false
  if (item?.liveState?.isLive) return true

  const endDate = dateKey(item?.endDate)
  if (endDate && endDate > today) return true

  const end = timeMinutes(item?.endTime)
  if (end !== null) return end >= currentMinutes

  const start = timeMinutes(item?.startTime)
  if (start !== null) return start >= currentMinutes

  // Cultos sin una franja horaria única se mantienen como opción del día.
  return true
}

function periodHref(period = 'upcoming') {
  if (period === 'today') return '/agenda-cofrade/hoy'
  if (period === 'tomorrow') return '/agenda-cofrade/manana'
  if (period === 'weekend') return '/agenda-cofrade/fin-de-semana'
  return '/agenda-cofrade#agenda'
}

function phaseLabel(minutes) {
  if (minutes < 12 * 60) return 'Hoy'
  if (minutes < 20 * 60) return 'Esta tarde'
  return 'Esta noche'
}

export function buildHomeTemporalAgenda({ items = [], today = '', now = new Date() } = {}) {
  const clock = madridClock(now)
  const todayKey = dateKey(today) || clock.dateKey
  const tomorrow = addDays(todayKey, 1)
  const [weekendStart, weekendEnd] = weekendRange(todayKey)

  const normalized = (Array.isArray(items) ? items : [])
    .filter((item) => item?.isUpcoming && !item?.isCancelled)
    .map((item) => ({ ...item, liveState: freshLiveState(item, now) }))
    .filter((item) => item.liveState?.state !== 'done')
    .sort(compareItems)

  const liveItems = normalized.filter((item) => item.liveState?.isLive)
  const todayItems = normalized.filter((item) => overlapsDay(item, todayKey))
  const remainingTodayItems = normalized.filter((item) => isRemainingToday(item, todayKey, clock.minutes))
  const tomorrowItems = normalized.filter((item) => overlapsDay(item, tomorrow))
  const weekendItems = normalized.filter((item) => overlapsRange(item, weekendStart, weekendEnd))
  const closestItems = normalized.slice(0, 3)

  let mode = 'upcoming'
  let title = 'Lo próximo en la Agenda'
  let eyebrow = 'Próximas citas'
  let focusItems = closestItems
  let href = periodHref('upcoming')

  if (liveItems.length) {
    mode = 'live'
    title = 'En la calle ahora'
    eyebrow = 'Ahora mismo'
    focusItems = liveItems.slice(0, 4)
    href = periodHref('today')
  } else if (remainingTodayItems.length) {
    mode = 'today'
    title = `${phaseLabel(clock.minutes)} en Hilo Cofrade`
    eyebrow = 'Lo que queda de hoy'
    focusItems = remainingTodayItems.slice(0, 4)
    href = periodHref('today')
  } else if (tomorrowItems.length) {
    mode = 'tomorrow'
    title = 'Mañana en Hilo Cofrade'
    eyebrow = 'Siguiente jornada'
    focusItems = tomorrowItems.slice(0, 4)
    href = periodHref('tomorrow')
  } else if (weekendItems.length) {
    mode = 'weekend'
    title = 'Este fin de semana'
    eyebrow = 'Planifica tu agenda'
    focusItems = weekendItems.slice(0, 4)
    href = periodHref('weekend')
  }

  return {
    mode,
    title,
    eyebrow,
    href,
    today: todayKey,
    tomorrow,
    weekendStart,
    weekendEnd,
    liveItems,
    todayItems,
    remainingTodayItems,
    tomorrowItems,
    weekendItems,
    closestItems,
    focusItems,
  }
}
