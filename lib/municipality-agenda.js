import { agendaMunicipalityHref } from '@/lib/agenda-relations'
import { agendaMunicipalityRouteSlug } from '@/lib/agenda-cofrade-location'
import { labelFromSlug, localitySlug } from '@/lib/brotherhood-directory'

function calendarMeta(item) {
  const href = String(item?.categoryHref || '')
  if (href.startsWith('/procesiones-de-gloria')) return { label: 'Glorias', href: '/procesiones-de-gloria' }
  if (href.startsWith('/extraordinarias')) return { label: 'Extraordinarias', href: '/extraordinarias' }
  if (item?.category === 'concerts') return { label: 'Agenda Cofrade', href: '/agenda-cofrade?categoria=concerts#agenda' }
  return { label: 'Agenda Cofrade', href: '/agenda-cofrade' }
}

function compareItems(first, second) {
  return `${first.date || '9999-12-31'}T${first.startTime || '23:59'}`
    .localeCompare(`${second.date || '9999-12-31'}T${second.startTime || '23:59'}`)
}

function normalizeCrew(event) {
  return {
    key: `crew:${event.id}`,
    id: event.id,
    date: event.date || '',
    dateInfo: event.dateParts || {},
    startTime: event.startTime || '',
    timeText: event.timeText || '',
    title: event.title,
    categoryLabel: event.eventTypeLabel || 'Convocatoria de cuadrilla',
    calendarLabel: 'Igualás y ensayos',
    calendarHref: '/igualas-y-ensayos',
    href: event.detailHref || '',
    actionLabel: 'Ver convocatoria',
    municipality: event.municipality || '',
    municipalityHref: agendaMunicipalityHref(event.municipality),
    brotherhoodHref: event.brotherhoodHref || '',
    place: event.location || '',
    summary: event.summary || event.description || '',
  }
}

export function buildMunicipalityAgendaHub({
  slug = '',
  agendaItems = [],
  crewEvents = [],
  brotherhoods = [],
  bands = [],
} = {}) {
  const routeSlug = agendaMunicipalityRouteSlug(slug)
  const matches = (value) => agendaMunicipalityRouteSlug(value) === routeSlug

  const agenda = agendaItems
    .filter((item) => item?.isUpcoming && !item?.isCancelled && matches(item.municipality))
    .map((item) => {
      const calendar = calendarMeta(item)
      return {
        ...item,
        calendarLabel: calendar.label,
        calendarHref: calendar.href,
        brotherhoodHref: item.organizerHref || item.relatedBrotherhoodHref || '',
      }
    })

  const crew = crewEvents
    .filter((event) => event?.isUpcoming && !event?.isCancelled && matches(event.municipality))
    .map(normalizeCrew)

  const localBrotherhoods = brotherhoods.filter((item) => localitySlug(item) === routeSlug)
  const localBands = bands.filter((item) => matches(item.municipality || item.municipalitySlug))
  const label = agenda[0]?.municipality
    || crew[0]?.municipality
    || localBrotherhoods[0]?.localidad
    || localBands[0]?.municipality
    || labelFromSlug(routeSlug)

  const seen = new Set()
  const items = [...agenda, ...crew]
    .sort(compareItems)
    .filter((item) => {
      const key = item.href || item.key
      if (!key || seen.has(key)) return false
      seen.add(key)
      return true
    })

  return {
    slug: routeSlug,
    label,
    items,
    brotherhoods: localBrotherhoods,
    bands: localBands,
    exists: Boolean(items.length || localBrotherhoods.length || localBands.length),
  }
}
