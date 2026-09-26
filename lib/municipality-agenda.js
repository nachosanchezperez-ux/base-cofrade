import { agendaMunicipalityHref } from '@/lib/agenda-relations'
import { agendaMunicipalityRouteSlug } from '@/lib/agenda-cofrade-location'
import { labelFromSlug, localitySlug } from '@/lib/brotherhood-directory'
import { buildMunicipalityTemporal } from '@/lib/municipality-temporal'

function calendarMeta(item) {
  const href = String(item?.categoryHref || '')
  if (href.startsWith('/procesiones-de-gloria')) return { key: 'glories', label: 'Glorias', href: '/procesiones-de-gloria' }
  if (href.startsWith('/extraordinarias')) return { key: 'extraordinary', label: 'Extraordinarias', href: '/extraordinarias' }
  if (item?.category === 'concerts') return { key: 'agenda', label: 'Agenda Cofrade', href: '/agenda-cofrade?categoria=concerts#agenda' }
  return { key: 'agenda', label: 'Agenda Cofrade', href: '/agenda-cofrade' }
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
    calendarKey: 'crew',
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

function localDirectorySlug(items, fallback = '') {
  return items.find((item) => item?.municipalitySlug)?.municipalitySlug || fallback
}

export function buildMunicipalityAgendaHub({
  slug = '',
  agendaItems = [],
  crewEvents = [],
  brotherhoods = [],
  bands = [],
  images = [],
  steps = [],
  today = '',
} = {}) {
  const routeSlug = agendaMunicipalityRouteSlug(slug)
  const matches = (value) => agendaMunicipalityRouteSlug(value) === routeSlug

  const agenda = agendaItems
    .filter((item) => item?.isUpcoming && !item?.isCancelled && matches(item.municipality))
    .map((item) => {
      const calendar = calendarMeta(item)
      return {
        ...item,
        calendarKey: calendar.key,
        calendarLabel: calendar.label,
        calendarHref: calendar.href,
        brotherhoodHref: item.organizerHref || item.relatedBrotherhoodHref || '',
      }
    })

  const crew = crewEvents
    .filter((event) => event?.isUpcoming && !event?.isCancelled && matches(event.municipality))
    .map(normalizeCrew)

  const localBrotherhoods = brotherhoods.filter((item) => localitySlug(item) === routeSlug)
  const hasSevilleAnchor = Boolean(agenda.length || crew.length || localBrotherhoods.length)
  const localBands = hasSevilleAnchor
    ? bands.filter((item) => (
        matches(item.municipality || item.municipalitySlug)
        && (!item.province || item.province === 'Sevilla')
      ))
    : []
  const localImages = hasSevilleAnchor
    ? images.filter((item) => matches(item.municipality || item.municipalitySlug))
    : []
  const localSteps = hasSevilleAnchor
    ? steps.filter((item) => matches(item.municipality || item.municipalitySlug))
    : []

  const label = routeSlug === 'sevilla-capital'
    ? 'Sevilla capital'
    : agenda[0]?.municipality
      || crew[0]?.municipality
      || localBrotherhoods[0]?.localidad
      || localBands[0]?.municipality
      || localImages[0]?.municipality
      || localSteps[0]?.municipality
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

  const temporal = buildMunicipalityTemporal(items, today)

  const calendarCounts = {
    agenda: items.filter((item) => item.calendarKey === 'agenda').length,
    glories: items.filter((item) => item.calendarKey === 'glories').length,
    extraordinary: items.filter((item) => item.calendarKey === 'extraordinary').length,
    crew: items.filter((item) => item.calendarKey === 'crew').length,
  }

  const defaultHeritageSlug = routeSlug === 'sevilla-capital' ? 'sevilla' : routeSlug
  const imageDirectoryItems = localImages.filter((item) => item.municipalitySlug)
  const stepDirectoryItems = localSteps.filter((item) => item.municipalitySlug)

  return {
    slug: routeSlug,
    label,
    items,
    temporal,
    calendarCounts,
    brotherhoods: localBrotherhoods,
    bands: localBands,
    images: localImages,
    steps: localSteps,
    brotherhoodDirectorySlug: localBrotherhoods[0] ? localitySlug(localBrotherhoods[0]) : routeSlug,
    bandDirectorySlug: localDirectorySlug(localBands, defaultHeritageSlug),
    imageDirectorySlug: localDirectorySlug(imageDirectoryItems, defaultHeritageSlug),
    stepDirectorySlug: localDirectorySlug(stepDirectoryItems, defaultHeritageSlug),
    imageDirectoryReady: imageDirectoryItems.length >= 3,
    stepDirectoryReady: stepDirectoryItems.length >= 3,
    exists: hasSevilleAnchor,
  }
}
