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
  const match = String(value).trim().match(/^([01]?\d|2[0-3]):([0-5]\d)(?::[0-5]\d)?$/)
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
  lastStepTime = '',
} = {}, now = new Date()) {
  const clock = madridClock(now)
  const todayDay = dayNumber(clock.dateKey)
  const current = todayDay === null ? null : (todayDay * 1440) + clock.minutes
  const start = absoluteMoment(date, startTime)
  let end = absoluteMoment(endDate || date, endTime)

  if (current === null || !date) {
    return {
      state: 'upcoming',
      isLive: false,
      label: 'Próxima',
      timingLabel: '',
    }
  }

  if (start === null || end === null) {
    const outingDay = dayNumber(endDate || date)
    const startDay = dayNumber(date)

    if (outingDay !== null && todayDay > outingDay) {
      return {
        state: 'done',
        isLive: false,
        label: 'Finalizada',
        timingLabel: '',
      }
    }

    if (startDay !== null && todayDay < startDay) {
      return {
        state: 'upcoming',
        isLive: false,
        label: 'Próxima',
        timingLabel: '',
      }
    }

    // Sin entrada documentada no conocemos la duración: nunca inventar un directo.
    if (start !== null && end === null) {
      if (current < start) {
        return {
          state: date === clock.dateKey ? 'today' : 'upcoming',
          isLive: false,
          label: date === clock.dateKey ? 'Hoy' : 'Próxima',
          timingLabel: startTime ? `Salida · ${String(startTime).slice(0, 5)}` : '',
        }
      }

      // Sin entrada, pero con un tramo publicado aún por llegar (Regreso 10:30):
      // sigue en la calle según su propio horario; no se inventa la entrada.
      const lastStep = absoluteMoment(date, lastStepTime)
      if (lastStep !== null && lastStep > start && current < lastStep) {
        return {
          state: 'live',
          isLive: true,
          label: 'En curso',
          timingLabel: '',
        }
      }

      return {
        state: 'today',
        isLive: false,
        label: 'Horario incompleto',
        timingLabel: 'Entrada por confirmar',
      }
    }

    return {
      state: 'today',
      isLive: false,
      label: 'Hoy',
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

  if (current < end) {
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

// Hora del último tramo publicado del mismo día de salida (HH:MM) o ''.
export function lastScheduleStepTime(item = {}) {
  let last = ''
  for (const row of Array.isArray(item?.schedule) ? item.schedule : []) {
    if (row?.date && item?.date && row.date !== item.date) continue
    const time = String(row?.time || '').slice(0, 5)
    if (/^([01]\d|2[0-3]):[0-5]\d$/.test(time) && time > last) last = time
  }
  return last
}

export function withProcessionLiveState(item, now = new Date()) {
  return {
    ...item,
    liveState: getProcessionLiveState({
      date: item?.date || '',
      endDate: item?.endDate || item?.returnDate || '',
      startTime: item?.departureTime || item?.startTime || '',
      endTime: item?.returnTime || item?.endTime || '',
      lastStepTime: lastScheduleStepTime(item),
    }, now),
  }
}

// ¿Está el acto en la calle ahora mismo? Para las fichas de gloria y extraordinaria,
// que decían «Hoy» mientras la portada y la Agenda ya decían «En curso».
export function isActOnStreet({ date = '', returnDate = '', departureTime = '', returnTime = '' } = {}, now = new Date()) {
  return getProcessionLiveState({ date, endDate: returnDate, startTime: departureTime, endTime: returnTime }, now).isLive
}

// Minutos que faltan para la salida (hora de Madrid), o null si no es hoy, ya
// ha salido o no hay hora. Para la cuenta atrás del día de la salida.
export function minutesUntilDeparture({ date = '', startTime = '' } = {}, now = new Date()) {
  const clock = madridClock(now)
  if (!date || date !== clock.dateKey) return null
  const start = timeMinutes(startTime)
  if (start === null || clock.minutes >= start) return null
  return start - clock.minutes
}

export function countdownLabel(minutes) {
  if (minutes === null || minutes === undefined || minutes < 0) return ''
  if (minutes < 1) return 'Sale ahora'
  if (minutes < 60) return `Sale en ${minutes} min`
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return `Sale en ${hours} h${rest ? ` ${rest} min` : ''}`
}
