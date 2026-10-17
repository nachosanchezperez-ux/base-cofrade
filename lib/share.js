// Textos para compartir actos de la Agenda, igualás y ensayos, y noticias.
// Módulo puro: no toca el navegador, así que se puede probar con node --test.
// Las URL compartidas respetan la política de la Agenda: un acto nuevo se comparte
// con el ancla de su tarjeta; solo las páginas conservadas usan su propia ruta.
import { SITE_URL } from './seo.js'
import { agendaEventAnchor } from './agenda-event-presentation.js'
import { agendaTemporalDateInfo } from './agenda-temporal-display.js'

const text = (value) => String(value ?? '').replace(/\s+/g, ' ').trim()
const EVENT_PAGE = /^\/(?:agenda-cofrade\/rosarios|extraordinarias|procesiones-de-gloria|igualas-y-ensayos)\/[a-z0-9-]+\/?$/

export function shareAbsoluteUrl(path = '/') {
  const value = text(path)
  if (!value.startsWith('/') || value.startsWith('//')) return ''
  return new URL(value, SITE_URL).toString()
}

export function whatsappShareHref(message = '') {
  return `https://wa.me/?text=${encodeURIComponent(String(message || ''))}`
}

function timeLabel({ timeText, startTime, endTime }) {
  const literal = text(timeText)
  if (literal) return literal
  const start = text(startTime).slice(0, 5)
  const end = text(endTime).slice(0, 5)
  if (start && end) return `${start}–${end} h`
  return start ? `${start} h` : ''
}

function placeLabel(place, municipality) {
  const parts = [text(place), text(municipality)].filter(Boolean)
  if (parts.length === 2 && parts[0].toLocaleLowerCase('es').includes(parts[1].toLocaleLowerCase('es'))) return parts[0]
  return parts.join(', ')
}

// Mensaje corto y legible en WhatsApp. `body` va sin enlace, para el menú de
// compartir del móvil, que añade la URL por su cuenta.
export function composeShareMessage({ kicker = '', title = '', organizer = '', date = '', time = '', place = '', url = '' } = {}) {
  // Sin repetir el tipo cuando el título ya empieza por él («Besamanos a…»).
  const fold = (value) => text(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es')
  const label = text(kicker) && !fold(title).startsWith(fold(kicker)) ? text(kicker) : ''
  const heading = [label, text(title)].filter(Boolean).join(' · ')
  const when = [text(date), text(time)].filter(Boolean).join(' · ')
  const lines = [
    heading,
    text(organizer) && text(organizer) !== text(title) ? text(organizer) : '',
    when ? `📅 ${when}` : '',
    text(place) ? `📍 ${text(place)}` : '',
  ].filter(Boolean)
  const body = lines.join('\n')
  const link = text(url)
  return { title: text(title), body, text: link ? `${body}\n${link}` : body, url: link }
}

export function agendaItemSharePath(item = {}) {
  const href = text(item.href)
  // Solo se reutiliza `href` si apunta al propio acto (ficha conservada o su
  // tarjeta). Los respaldos genéricos (la Hermandad, /hermandades…) no sirven.
  if (EVENT_PAGE.test(href) || href.startsWith('/agenda-cofrade#acto-')) return href
  return `/agenda-cofrade#${agendaEventAnchor(item)}`
}

export function agendaItemShare(item = {}) {
  if (!text(item.title)) return null
  const dateInfo = item.temporalDateInfo || item.dateInfo || agendaTemporalDateInfo(item.temporalDate || item.date)
  const date = dateInfo?.weekdayLabel && dateInfo.weekdayLabel !== 'Fecha por confirmar' ? dateInfo.weekdayLabel : ''
  return composeShareMessage({
    kicker: item.categoryLabel || item.calendarLabel || '',
    title: item.title,
    organizer: item.organizer,
    date,
    time: timeLabel(item),
    place: placeLabel(item.place, item.municipality),
    url: shareAbsoluteUrl(agendaItemSharePath(item)),
  })
}

export function crewEventSharePath(event = {}, hasPage = false) {
  const detail = text(event.detailHref)
  if (hasPage && detail.startsWith('/') && !detail.startsWith('//')) return detail
  const anchor = text(event.anchor)
  return anchor ? `/igualas-y-ensayos#${anchor}` : '/igualas-y-ensayos'
}

export function crewEventShare(event = {}, { hasPage = false } = {}) {
  if (!text(event.title)) return null
  return composeShareMessage({
    kicker: event.eventTypeLabel || 'Igualá',
    title: event.title,
    organizer: event.brotherhoodName,
    date: event.dateParts?.weekdayLabel || '',
    time: timeLabel(event),
    place: placeLabel(event.location, event.municipality),
    url: shareAbsoluteUrl(crewEventSharePath(event, hasPage)),
  })
}

export function newsShare(item = {}) {
  if (!text(item.title) || !text(item.href)) return null
  return composeShareMessage({
    kicker: 'El Hilo se mueve',
    title: item.title,
    organizer: item.summary,
    url: shareAbsoluteUrl(item.href),
  })
}
