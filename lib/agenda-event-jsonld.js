// Datos estructurados de los actos de la Agenda (#agenda-google): un Event de
// schema.org por acto, para que los buscadores entiendan las listas de la Agenda
// como eventos. Solo con datos reales del acto: sin precios, sin horas inventadas.
// Módulo puro para probarlo con node --test.
import { absoluteUrl, organizationJsonLdRef, schemaEventStatus } from './seo.js'
import { agendaItemSharePath } from './share.js'

const text = (value) => String(value ?? '').replace(/\s+/g, ' ').trim()

function madridUtcOffset(date) {
  const zone = new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Madrid', timeZoneName: 'longOffset' })
    .formatToParts(new Date(`${date}T12:00:00Z`))
    .find((part) => part.type === 'timeZoneName')?.value || 'GMT+00:00'
  return zone.replace('GMT', '') || '+00:00'
}

// Hora clara del acto (HH:MM) o nada. «Según calendario anual» no es una hora.
export function agendaEventClock(item = {}) {
  const start = text(item.startTime).slice(0, 5)
  if (/^\d{2}:\d{2}$/.test(start)) return start
  const match = text(item.timeText).match(/\b(\d{1,2})[:.](\d{2})\b/)
  return match ? `${match[1].padStart(2, '0')}:${match[2]}` : ''
}

export function agendaEventDateTime(date, time = '') {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text(date))) return ''
  return time ? `${date}T${time}:00${madridUtcOffset(date)}` : date
}

export function agendaEventJsonLd(item = {}) {
  const name = text(item.title)
  const startDate = agendaEventDateTime(item.date, agendaEventClock(item))
  if (!name || !startDate) return null
  const endTime = text(item.endTime).slice(0, 5)
  const endDate = item.endDate && item.endDate !== item.date
    ? agendaEventDateTime(item.endDate, /^\d{2}:\d{2}$/.test(endTime) ? endTime : '')
    : (/^\d{2}:\d{2}$/.test(endTime) && agendaEventClock(item) ? agendaEventDateTime(item.date, endTime) : '')
  const url = absoluteUrl(item.eventHref || agendaItemSharePath(item))
  const municipality = text(item.municipality)
  const status = schemaEventStatus(item)
  const organizerName = item.category === 'concerts' ? text(item.relatedBrotherhoodName) : text(item.organizer)
  const organizerPath = item.category === 'concerts' ? item.relatedBrotherhoodHref : item.organizerHref
  const image = item.photo?.source === 'event' && item.photo.path ? absoluteUrl(item.photo.path) : ''
  return {
    '@type': 'Event',
    name,
    url,
    startDate,
    ...(endDate ? { endDate } : {}),
    ...(text(item.summary) ? { description: text(item.summary).slice(0, 300) } : {}),
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    ...(status ? { eventStatus: status } : {}),
    ...(image ? { image: [image] } : {}),
    ...(organizerName && organizerName !== 'Entidad organizadora'
      ? { organizer: organizationJsonLdRef({ name: organizerName, path: String(organizerPath || '').startsWith('/hermandades/') ? organizerPath : '' }) }
      : {}),
    location: {
      '@type': 'Place',
      name: text(item.place) || municipality || 'Sevilla',
      address: {
        '@type': 'PostalAddress',
        ...(municipality ? { addressLocality: municipality } : {}),
        addressRegion: 'Sevilla',
        addressCountry: 'ES',
      },
    },
  }
}

// Lista de eventos: un acto una sola vez (los de varios días se repiten por día
// en las listas de periodo) y solo los que no han pasado.
export function agendaEventListJsonLd(items = [], { name = '', url = '', limit = 40 } = {}) {
  const seen = new Set()
  const events = []
  for (const item of items) {
    const key = item.key || `${item.category}:${item.id}`
    if (seen.has(key) || item.isPast) continue
    const event = agendaEventJsonLd(item)
    if (!event) continue
    seen.add(key)
    events.push(event)
    if (events.length >= limit) break
  }
  if (!events.length) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    ...(name ? { name } : {}),
    ...(url ? { url } : {}),
    numberOfItems: events.length,
    itemListElement: events.map((event, index) => ({ '@type': 'ListItem', position: index + 1, item: event })),
  }
}
