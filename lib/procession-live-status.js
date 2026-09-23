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
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(dateKey))) return null
  const value = Date.parse(`${dateKey}T00:00:00Z`)
  return Number.isFinite(value) ? Math.floor(value / 86400000) : null
}

function timeMinutes(value = '') {
  const match = String(value).match(/(?:^|\D)([01]?\d|2[0-3]):([0-5]\d)(?:\D|$)/)
  if (!match) return null
  return (Number(match[1]) * 60) + Number(match[2])
}

function absoluteMoment(dateKey, time) {
  const day = dayNumber(dateKey)
  const minutes = timeMinutes(time)
  if (day === null || minutes === null) return null
  return (day * 1440) + minutes
}

export function getProcessionLiveState({
  date = '',
  endDate = '',
  startTime = '',
  endTime = '',
} = {}, now = new Date()) {
  const clock = madridClock(now)
  const todayDay = dayNumber(clock.dateKey)
  const current = todayDay === null ? null : (todayDay * 1440) + clock.minutes
  const start = absoluteMoment(date, startTime)
  let end = absoluteMoment(endDate || date, endTime)

  if (current === null || !date || start === null || end === null) {
    return {
      state: date === clock.dateKey ? 'today' : 'upcoming',
      isLive: false,
      label: date === clock.dateKey ? 'Hoy' : 'Próxima',
      timingLabel: '',
    }
  }

  // Si no hay fecha de regreso pero la hora final es menor o igual que la salida,
  // interpretamos que la procesión termina tras medianoche.
  if (!endDate && end <= start) end += 1440

  if (current < start) {
    return {
      state: date === clock.dateKey ? 'today' : 'upcoming',
      isLive: false,
      label: date === clock.dateKey ? 'Hoy' : 'Próxima',
      timingLabel: startTime ? `Salida · ${String(startTime).slice(0, 5)}` : '',
    }
  }

  if (current <= end) {
    return {
      state: 'live',
      isLive: true,
      label: 'En curso',
      timingLabel: endTime ? `Hasta ${String(endTime).slice(0, 5)}` : '',
    }
  }

  return {
    state: 'done',
    isLive: false,
    label: 'Finalizada',
    timingLabel: '',
  }
}

function liveRank(state = 'upcoming') {
  if (state === 'live') return 0
  if (state === 'today') return 1
  if (state === 'upcoming') return 2
  return 3
}

export function compareProcessionLiveItems(left, right) {
  const leftRank = liveRank(left?.liveState?.state)
  const rightRank = liveRank(right?.liveState?.state)
  if (leftRank !== rightRank) return leftRank - rightRank

  const leftKey = `${left?.date || ''}T${left?.departureTime || left?.startTime || '23:59'}`
  const rightKey = `${right?.date || ''}T${right?.departureTime || right?.startTime || '23:59'}`
  return leftKey.localeCompare(rightKey)
}

export function withProcessionLiveState(item, now = new Date()) {
  return {
    ...item,
    liveState: getProcessionLiveState({
      date: item?.date || '',
      endDate: item?.endDate || item?.returnDate || '',
      startTime: item?.departureTime || item?.startTime || '',
      endTime: item?.returnTime || item?.endTime || '',
    }, now),
  }
}
