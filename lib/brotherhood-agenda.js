import { agendaMunicipalityHref } from '@/lib/agenda-relations'

function compareAgendaItems(first, second) {
  const firstKey = `${first.date || '9999-12-31'}T${first.startTime || '23:59'}`
  const secondKey = `${second.date || '9999-12-31'}T${second.startTime || '23:59'}`
  return firstKey.localeCompare(secondKey) || String(first.title || '').localeCompare(String(second.title || ''), 'es')
}

function calendarLabel(item) {
  const href = String(item?.categoryHref || '')
  if (href.startsWith('/extraordinarias')) return 'Extraordinarias'
  if (href.startsWith('/procesiones-de-gloria')) return 'Glorias'
  if (item?.category === 'concerts') return 'Conciertos'
  if (item?.category === 'devotions') return 'Cultos'
  if (item?.category === 'rosaries') return 'Agenda Cofrade'
  return 'Agenda Cofrade'
}

function normalizeAgendaItem(item) {
  return {
    ...item,
    key: item.key || `agenda:${item.id}`,
    calendarHref: item.categoryHref || '/agenda-cofrade',
    calendarLabel: calendarLabel(item),
    municipalityHref: item.municipalityHref || agendaMunicipalityHref(item.municipality),
  }
}

function normalizeCrewEvent(event) {
  return {
    key: `crew:${event.id}`,
    id: event.id,
    date: event.date,
    dateInfo: event.dateParts,
    startTime: event.startTime || '',
    timeText: event.timeText || '',
    title: event.title,
    summary: event.summary || event.description || '',
    municipality: event.municipality || '',
    municipalityHref: agendaMunicipalityHref(event.municipality),
    category: 'crew',
    categoryLabel: event.eventTypeLabel || 'Convocatoria de cuadrilla',
    calendarLabel: 'Igualás y ensayos',
    calendarHref: '/igualas-y-ensayos',
    href: event.detailHref,
    actionLabel: 'Ver convocatoria',
    isUpcoming: Boolean(event.isUpcoming) && !event.isCancelled,
    isCancelled: Boolean(event.isCancelled),
  }
}

export function brotherhoodUpcomingAgenda({
  agendaItems = [],
  crewEvents = [],
  brotherhoodHref = '',
} = {}) {
  const target = String(brotherhoodHref || '').trim()
  if (!target) return []

  const general = agendaItems
    .filter((item) => (
      item?.isUpcoming
      && !item?.isCancelled
      && (item.organizerHref === target || item.relatedBrotherhoodHref === target)
    ))
    .map(normalizeAgendaItem)

  const crew = crewEvents
    .filter((event) => event?.isUpcoming && !event?.isCancelled)
    .map(normalizeCrewEvent)

  const seen = new Set()
  return [...general, ...crew]
    .sort(compareAgendaItems)
    .filter((item) => {
      const key = item.href || item.key
      if (!key || seen.has(key)) return false
      seen.add(key)
      return true
    })
}
