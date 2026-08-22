const MADRID_TIME_ZONE = 'Europe/Madrid'

function madridClock(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: MADRID_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)
  const value = (type) => parts.find((part) => part.type === type)?.value || ''
  return {
    dateKey: `${value('year')}-${value('month')}-${value('day')}`,
    minutes: (Number(value('hour')) * 60) + Number(value('minute')),
  }
}

function dayNumber(dateKey = '') {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) return null
  const value = Date.parse(`${dateKey}T00:00:00Z`)
  return Number.isFinite(value) ? Math.floor(value / 86400000) : null
}

function timeMinutes(value = '') {
  const match = String(value).match(/(?:^|\D)([01]?\d|2[0-3]):([0-5]\d)(?:\D|$)/)
  if (!match) return null
  return (Number(match[1]) * 60) + Number(match[2])
}

function momentFor(item, outingDate) {
  const dateKey = item?.itemDate || outingDate || ''
  const day = dayNumber(dateKey)
  const minutes = timeMinutes(item?.time)
  if (day === null || minutes === null) return null
  return {
    id: item.id,
    dateKey,
    value: (day * 1440) + minutes,
  }
}

export function getExtraordinaryLiveState(outingDate = '', schedule = [], now = new Date()) {
  const clock = madridClock(now)
  const todayDay = dayNumber(clock.dateKey)
  const current = todayDay === null ? null : (todayDay * 1440) + clock.minutes
  const outingIsToday = outingDate === clock.dateKey

  const moments = (schedule || [])
    .map((item) => momentFor(item, outingDate))
    .filter(Boolean)
    .sort((a, b) => a.value - b.value)

  if (current === null || !moments.length) {
    return {
      state: outingIsToday ? 'today' : 'upcoming',
      eyebrow: outingIsToday ? 'Hoy · Extraordinaria' : 'Próxima extraordinaria',
      nextId: '',
      pastIds: [],
    }
  }

  const first = moments[0]
  const last = moments[moments.length - 1]
  const next = moments.find((item) => item.value >= current) || null
  const pastIds = moments.filter((item) => item.value < current).map((item) => item.id)

  if (current < first.value) {
    return {
      state: outingIsToday ? 'today' : 'upcoming',
      eyebrow: outingIsToday ? 'Hoy · Extraordinaria' : 'Próxima extraordinaria',
      nextId: first.id,
      pastIds,
    }
  }

  if (current <= last.value && next) {
    return {
      state: 'live',
      eyebrow: 'En curso · Extraordinaria',
      nextId: next.id,
      pastIds,
    }
  }

  const lastIsToday = last.dateKey === clock.dateKey
  return {
    state: outingIsToday || lastIsToday ? 'done' : 'upcoming',
    eyebrow: outingIsToday || lastIsToday ? 'Celebrada hoy' : 'Próxima extraordinaria',
    nextId: '',
    pastIds,
  }
}
