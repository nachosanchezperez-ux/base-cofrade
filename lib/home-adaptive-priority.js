const DAY_MS = 24 * 60 * 60 * 1000

function utcDayFromKey(value = '') {
  const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) return null

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const timestamp = Date.UTC(year, month - 1, day)
  const date = new Date(timestamp)

  if (
    date.getUTCFullYear() !== year
    || date.getUTCMonth() !== month - 1
    || date.getUTCDate() !== day
  ) return null

  return timestamp
}

export function daysUntilDate(targetDateKey, currentDateKey) {
  const target = utcDayFromKey(targetDateKey)
  const current = utcDayFromKey(currentDateKey)
  if (target === null || current === null) return null
  return Math.round((target - current) / DAY_MS)
}

export function getHomeAdaptivePriority({
  dateKey = '',
  todayKey = '',
  liveState = 'upcoming',
} = {}) {
  const daysAway = daysUntilDate(dateKey, todayKey)

  if (liveState === 'live') {
    return {
      daysAway,
      extraordinaryFirst: true,
      urgency: 'live',
      eyebrow: 'Hoy · En curso',
      relativeDateLabel: 'En curso',
    }
  }

  if (liveState === 'done' && daysAway === 0) {
    return {
      daysAway,
      extraordinaryFirst: true,
      urgency: 'today',
      eyebrow: 'Celebrada hoy',
      relativeDateLabel: 'Celebrada hoy',
    }
  }

  if (daysAway === 0) {
    return {
      daysAway,
      extraordinaryFirst: true,
      urgency: 'today',
      eyebrow: 'Hoy · Extraordinaria',
      relativeDateLabel: 'Hoy',
    }
  }

  if (daysAway === 1) {
    return {
      daysAway,
      extraordinaryFirst: true,
      urgency: 'imminent',
      eyebrow: 'Mañana · Extraordinaria',
      relativeDateLabel: 'Mañana',
    }
  }

  if (daysAway !== null && daysAway >= 2 && daysAway <= 3) {
    return {
      daysAway,
      extraordinaryFirst: true,
      urgency: 'imminent',
      eyebrow: `Extraordinaria · En ${daysAway} días`,
      relativeDateLabel: `En ${daysAway} días`,
    }
  }

  if (daysAway !== null && daysAway > 3) {
    return {
      daysAway,
      extraordinaryFirst: false,
      urgency: daysAway <= 7 ? 'soon' : 'later',
      eyebrow: daysAway <= 30 ? `Próxima extraordinaria · En ${daysAway} días` : 'Próxima extraordinaria',
      relativeDateLabel: '',
    }
  }

  return {
    daysAway,
    extraordinaryFirst: false,
    urgency: 'later',
    eyebrow: 'Próxima extraordinaria',
    relativeDateLabel: '',
  }
}
