// Datos estructurados del programa de mano 2027: un Event por salida
// procesional, el ItemList del orden de paso de cada jornada y las migas.
//
// Honestidad con los horarios: mientras el Consejo no publique los de 2027, el
// Event lleva solo la fecha (sin hora) y la descripción lo dice; los horarios de
// 2026 aparecen solo como referencia, nunca como startDate.
//
// Módulo puro para probarlo con node --test.
import { absoluteUrl, organizationJsonLdRef } from './seo.js'
import { PROGRAMME_PATH, PROGRAMME_YEAR, REFERENCE_YEAR, dayPath } from './holy-week-programme.js'

const text = (value) => String(value ?? '').replace(/\s+/g, ' ').trim()

// «de el Baratillo» → «del Baratillo».
function ofName(sentenceName = '') {
  return `de ${text(sentenceName)}`.replace(/^de el /, 'del ')
}

export function programmeItemAnchor(day, item) {
  return `${day.id}--${item.key}`
}

export function programmeItemUrl(day, item) {
  return absoluteUrl(`${dayPath(day.id)}#${programmeItemAnchor(day, item)}`)
}

export function programmeEventName(day, item) {
  const kind = day.kind === 'visperas' ? 'Salida procesional' : 'Estación de penitencia'
  return `${kind} ${ofName(item.sentenceName || item.name)} · ${day.name} ${PROGRAMME_YEAR}`
}

export function programmeEventDescription(day, item) {
  const parts = []
  if (day.status === 'pending') parts.push(`El Consejo aún no ha aprobado el orden de paso del ${day.name} de ${PROGRAMME_YEAR}.`)
  if (day.status === 'reference2026') parts.push(`Puesto según el orden de ${REFERENCE_YEAR}, a falta del de ${PROGRAMME_YEAR}.`)
  if (item.position && day.status === 'approved') parts.push(`Puesto ${item.position} en el orden de paso por la Carrera Oficial.`)
  parts.push(`Horario de ${PROGRAMME_YEAR} pendiente de publicación.`)
  if (item.departure) {
    const source = item.timesSource === 'consejo' ? ' (nómina del Consejo)' : ''
    parts.push(`Referencia ${REFERENCE_YEAR}${source}: salida a las ${item.departure}${item.arrival ? ` y entrada a las ${item.arrival}` : ''}.`)
  }
  return parts.join(' ')
}

function bandsOf(item) {
  const seen = new Set()
  const bands = []
  for (const step of item.cortejo || []) {
    for (const band of step.bands || []) {
      if (seen.has(band.slug)) continue
      seen.add(band.slug)
      bands.push(band)
    }
  }
  return bands
}

export function programmeEventJsonLd(day, item) {
  const performers = bandsOf(item).map((band) => ({
    '@type': 'MusicGroup',
    name: band.name,
    url: absoluteUrl(band.href),
  }))
  return {
    '@type': 'Event',
    '@id': `${programmeItemUrl(day, item)}-evento`,
    name: programmeEventName(day, item),
    url: programmeItemUrl(day, item),
    // Solo la fecha: la hora de 2027 aún no es oficial.
    startDate: day.date,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    description: programmeEventDescription(day, item),
    image: [absoluteUrl(item.crestPath || `${dayPath(day.id)}/opengraph-image`)],
    location: {
      '@type': 'Place',
      name: text(item.origin) || 'Sevilla',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Sevilla',
        addressRegion: 'Sevilla',
        addressCountry: 'ES',
      },
    },
    organizer: organizationJsonLdRef({ name: text(item.officialName || item.parentName || item.name), path: item.href }),
    ...(performers.length ? { performer: performers } : {}),
    superEvent: {
      '@type': 'Event',
      name: `Semana Santa de Sevilla ${PROGRAMME_YEAR}`,
      url: absoluteUrl(PROGRAMME_PATH),
    },
  }
}

export function programmeItemListJsonLd(day, items = []) {
  return {
    '@type': 'ItemList',
    '@id': `${absoluteUrl(dayPath(day.id))}#orden`,
    name: day.status === 'pending'
      ? `Hermandades del ${day.name} ${PROGRAMME_YEAR} (orden de paso pendiente)`
      : day.kind === 'visperas'
        ? `${day.name} ${PROGRAMME_YEAR}: hermandades por hora de salida (referencia ${REFERENCE_YEAR})`
        : `Orden de paso del ${day.name} ${PROGRAMME_YEAR}${day.status === 'reference2026' ? ` (referencia ${REFERENCE_YEAR})` : ''}`,
    itemListOrder: day.status === 'pending'
      ? 'https://schema.org/ItemListUnordered'
      : 'https://schema.org/ItemListOrderAscending',
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: programmeItemUrl(day, item),
    })),
  }
}

export function programmeDayJsonLd(day, items = []) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      programmeItemListJsonLd(day, items),
      ...items.map((item) => programmeEventJsonLd(day, item)),
    ],
  }
}
