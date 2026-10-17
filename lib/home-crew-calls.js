// Igualás y ensayos en la portada: las próximas convocatorias de cuadrilla en
// filas compactas (fecha, hora, paso, hermandad y capataz), con acceso al
// calendario completo. Modelo pequeño y serializable, sin consultas propias:
// parte del directorio ya cacheado de /igualas-y-ensayos.

import { homeAgendaDateParts, homeAgendaTimeParts } from './home-agenda-now.js'

export const HOME_CREW_CALL_LIMIT = 3
export const HOME_CREW_CALENDAR_HREF = '/igualas-y-ensayos'

function madridToday(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid' }).format(now)
}

function daysBetween(today, date) {
  return Math.round((Date.parse(`${date}T12:00:00Z`) - Date.parse(`${today}T12:00:00Z`)) / 86400000)
}

export function homeCrewUrgency(date, today) {
  if (!date || date < today) return ''
  const days = daysBetween(today, date)
  if (days === 0) return 'Hoy'
  if (days === 1) return 'Mañana'
  if (days <= 7) return `En ${days} días`
  return ''
}

function lowerFirst(value = '') {
  return value ? `${value.charAt(0).toLocaleLowerCase('es')}${value.slice(1)}` : ''
}

// «Igualá», «Igualá y mudá», «Igualá, mudá y retranqueo».
function joinTypes(labels = []) {
  const parts = labels.map((label, index) => (index ? lowerFirst(label) : label))
  return parts.length > 1 ? `${parts.slice(0, -1).join(', ')} y ${parts.at(-1)}` : parts[0] || ''
}

// Solo lo que la portada pinta: se guarda en la caché de la Home.
export function compactCrewEvent(event = {}) {
  const primaryAgent = (event.agents || []).find((item) => item.isPrimary) || (event.agents || [])[0] || null
  return {
    id: event.id,
    title: event.title || '',
    href: event.detailHref || HOME_CREW_CALENDAR_HREF,
    date: event.date || '',
    startTime: event.startTime || '',
    endTime: event.endTime || '',
    timeText: event.timeText || '',
    eventTypeLabel: event.eventTypeLabel || '',
    eventStatus: event.eventStatus || 'announced',
    brotherhoodId: event.brotherhoodId || '',
    brotherhoodName: event.brotherhoodName || '',
    municipality: event.municipality || '',
    agent: primaryAgent ? { name: primaryAgent.name, roleName: primaryAgent.roleName || 'Capataz' } : null,
  }
}

// Una igualá seguida de su mudá o retranqueo «a continuación» es una sola cita
// para el costalero: se agrupan por Hermandad y día y se suman los tipos.
function groupSameCall(events) {
  const groups = []
  const byKey = new Map()
  for (const event of events) {
    const key = `${event.brotherhoodId || event.id}|${event.date}`
    const group = byKey.get(key)
    if (group) {
      group.extraTypes.push(event.eventTypeLabel)
      continue
    }
    const next = { event, extraTypes: [] }
    byKey.set(key, next)
    groups.push(next)
  }
  return groups
}

export function buildHomeCrewCalls(events = [], { now = new Date(), today = madridToday(now), limit = HOME_CREW_CALL_LIMIT } = {}) {
  const upcoming = events
    .filter((item) => item?.date && item.date >= today && item.eventStatus !== 'cancelled')
    .sort((a, b) => a.date.localeCompare(b.date)
      || Number(!a.startTime) - Number(!b.startTime)
      || String(a.startTime).localeCompare(String(b.startTime)))
  if (!upcoming.length) return null

  const groups = groupSameCall(upcoming)
  const cards = groups.slice(0, limit).map(({ event, extraTypes }) => {
    const types = [...new Set([event.eventTypeLabel, ...extraTypes].filter(Boolean))]
    return {
      key: event.id,
      href: event.href,
      title: event.title,
      date: event.date,
      dateParts: homeAgendaDateParts(event.date),
      time: homeAgendaTimeParts(event),
      urgency: homeCrewUrgency(event.date, today),
      isPostponed: event.eventStatus === 'postponed',
      organizer: event.brotherhoodName,
      agent: event.agent ? `${event.agent.roleName}: ${event.agent.name}` : '',
      municipality: event.municipality,
      type: joinTypes(types),
    }
  })

  return {
    cards,
    total: groups.length,
    href: HOME_CREW_CALENDAR_HREF,
  }
}
