function dateKey(value = '') {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(value)) ? String(value) : ''
}

function formatDate(value = '', options = {}) {
  const key = dateKey(value)
  if (!key) return ''
  return new Intl.DateTimeFormat('es-ES', {
    timeZone: 'Europe/Madrid',
    ...options,
  }).format(new Date(`${key}T12:00:00Z`))
}

export function agendaTemporalDateInfo(value = '') {
  const key = dateKey(value)
  if (!key) {
    return {
      day: '—',
      month: 'FECHA',
      year: '',
      label: 'Fecha por confirmar',
      weekdayLabel: 'Fecha por confirmar',
      monthKey: 'sin-fecha',
      monthLabel: 'FECHA POR CONFIRMAR',
    }
  }

  const weekday = formatDate(key, { weekday: 'long', day: 'numeric', month: 'long' })
  const monthLong = formatDate(key, { month: 'long' })

  return {
    day: formatDate(key, { day: '2-digit' }),
    month: formatDate(key, { month: 'short' }).replace('.', '').toUpperCase(),
    year: formatDate(key, { year: 'numeric' }),
    label: formatDate(key, { day: 'numeric', month: 'long', year: 'numeric' }),
    weekdayLabel: `${weekday.charAt(0).toUpperCase()}${weekday.slice(1)}`,
    monthKey: key.slice(0, 7),
    monthLabel: `${monthLong} ${formatDate(key, { year: 'numeric' })}`.toLocaleUpperCase('es'),
  }
}

export function agendaTimeBounds(value = '') {
  const times = [...String(value).matchAll(/(?:^|\D)([01]?\d|2[0-3]):([0-5]\d)(?=\D|$)/g)]
    .map((match) => `${String(match[1]).padStart(2, '0')}:${match[2]}`)

  return {
    startTime: times[0] || '',
    endTime: times.length > 1 ? times[times.length - 1] : '',
  }
}

export function agendaTemporalRangeDate(item, start = '', end = '') {
  const rangeStart = dateKey(start)
  const rangeEnd = dateKey(end)
  const itemStart = dateKey(item?.date)
  const itemEnd = dateKey(item?.endDate) || itemStart

  if (!rangeStart || !rangeEnd || !itemStart || !itemEnd) return ''
  if (itemStart > rangeEnd || itemEnd < rangeStart) return ''

  if (itemStart < rangeStart) return rangeStart
  return itemStart
}

export function withAgendaTemporalDay(item, targetDate = '') {
  const temporalDate = dateKey(targetDate)
  if (!temporalDate) return item

  const daySchedules = Array.isArray(item?.daySchedules) ? item.daySchedules : []
  const schedule = daySchedules.find((entry) => dateKey(entry?.celebrationDate) === temporalDate) || null

  if (!schedule) {
    return {
      ...item,
      temporalDate,
      temporalDateInfo: agendaTemporalDateInfo(temporalDate),
      ...(daySchedules.length ? { timeText: '', startTime: '', endTime: '' } : {}),
    }
  }

  const bounds = agendaTimeBounds(schedule.timeText || '')
  return {
    ...item,
    temporalDate,
    temporalDateInfo: agendaTemporalDateInfo(temporalDate),
    timeText: schedule.timeText || '',
    startTime: schedule.startTime || bounds.startTime || '',
    endTime: schedule.endTime || bounds.endTime || '',
  }
}
