// Calendario (.ics, RFC 5545) para los actos de la Agenda.
//
// Un acto se puede añadir al calendario del móvil y, por hermandad o localidad,
// suscribirse a un calendario que se actualiza solo. Módulo puro: no toca el
// navegador ni Supabase, así que se prueba con node --test.
import { SITE_URL } from './seo.js'
import { agendaEventAnchor } from './agenda-event-presentation.js'

const PRODID = '-//Hilo Cofrade//Agenda Cofrade//ES'
const TIMEZONE = 'Europe/Madrid'

// Zona horaria de Madrid (CET/CEST, reglas de la UE) para que los clientes que no
// la conocen interpreten bien las horas locales.
const MADRID_VTIMEZONE = [
  'BEGIN:VTIMEZONE',
  `TZID:${TIMEZONE}`,
  'BEGIN:DAYLIGHT',
  'TZOFFSETFROM:+0100',
  'TZOFFSETTO:+0200',
  'TZNAME:CEST',
  'DTSTART:19700329T020000',
  'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU',
  'END:DAYLIGHT',
  'BEGIN:STANDARD',
  'TZOFFSETFROM:+0200',
  'TZOFFSETTO:+0100',
  'TZNAME:CET',
  'DTSTART:19701025T030000',
  'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU',
  'END:STANDARD',
  'END:VTIMEZONE',
]

const DATE = /^(\d{4})-(\d{2})-(\d{2})$/
const TIME = /^(\d{1,2}):(\d{2})/
const RAW_DATE_RANGE = /^\d{4}-\d{2}-\d{2}(?:\s*(?:a|-|–|al)\s*\d{4}-\d{2}-\d{2})?$/

const clean = (value) => String(value ?? '').replace(/\s+/g, ' ').trim()

// Texto según RFC 5545 §3.3.11: barra invertida, punto y coma, coma y saltos.
export function icsEscape(value = '') {
  return String(value ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n')
}

// Líneas de 75 octetos como máximo; las siguientes empiezan por un espacio.
// Se corta por caracteres completos para no partir letras acentuadas.
export function icsFold(line = '') {
  const encoder = new TextEncoder()
  if (encoder.encode(line).length <= 75) return line
  const parts = []
  let current = ''
  let size = 0
  for (const char of line) {
    const charSize = encoder.encode(char).length
    const limit = parts.length ? 74 : 75
    if (size + charSize > limit) {
      parts.push(current)
      current = ''
      size = 0
    }
    current += char
    size += charSize
  }
  parts.push(current)
  return parts.map((part, index) => (index ? ` ${part}` : part)).join('\r\n')
}

function compactDate(date) {
  const match = DATE.exec(clean(date))
  return match ? `${match[1]}${match[2]}${match[3]}` : ''
}

function nextDay(date) {
  const value = new Date(`${date}T12:00:00Z`)
  value.setUTCDate(value.getUTCDate() + 1)
  return value.toISOString().slice(0, 10)
}

function hhmm(time) {
  const match = TIME.exec(clean(time))
  if (!match) return ''
  const hours = Number(match[1])
  const minutes = Number(match[2])
  if (hours > 23 || minutes > 59) return ''
  return `${String(hours).padStart(2, '0')}${match[2]}00`
}

function utcStamp(now) {
  return now.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')
}

function absolute(path) {
  const value = clean(path)
  if (!value) return ''
  if (/^https?:\/\//.test(value)) return value
  if (!value.startsWith('/') || value.startsWith('//')) return ''
  return new URL(value, SITE_URL).toString()
}

// Enlace del acto: su página conservada o su tarjeta en la Agenda.
export function agendaItemCalendarUrl(item = {}) {
  const href = clean(item.href)
  const ownPage = /^\/(?:agenda-cofrade\/rosarios|extraordinarias|procesiones-de-gloria|igualas-y-ensayos)\/[a-z0-9-]+\/?$/
  if (ownPage.test(href)) return absolute(href)
  return absolute(`/agenda-cofrade#${agendaEventAnchor(item)}`)
}

function timing(item) {
  const date = compactDate(item.date)
  if (!date) return null
  const start = hhmm(item.startTime)
  const endDateRaw = DATE.test(clean(item.endDate)) ? clean(item.endDate) : clean(item.date)

  if (!start) {
    // Sin hora: día completo (el final es exclusivo, el día siguiente al último).
    return [
      `DTSTART;VALUE=DATE:${date}`,
      `DTEND;VALUE=DATE:${compactDate(nextDay(endDateRaw < clean(item.date) ? clean(item.date) : endDateRaw))}`,
    ]
  }

  const end = hhmm(item.endTime)
  let endDate = endDateRaw < clean(item.date) ? clean(item.date) : endDateRaw
  // Una recogida «antes» que la salida el mismo día es de madrugada del día siguiente.
  if (end && endDate === clean(item.date) && end <= start) endDate = nextDay(endDate)
  const lines = [`DTSTART;TZID=${TIMEZONE}:${date}T${start}`]
  if (end) lines.push(`DTEND;TZID=${TIMEZONE}:${compactDate(endDate)}T${end}`)
  else lines.push('DURATION:PT2H')
  return lines
}

function description(item, url) {
  const parts = [
    clean(item.categoryLabel),
    clean(item.organizer) && clean(item.organizer) !== clean(item.title) ? clean(item.organizer) : '',
    // El horario en texto ayuda («09:00–14:00 y 17:00–21:00»); las fechas en
    // bruto («2026-10-17 a 2026-10-18») ya las muestra el propio calendario.
    /\d{4}-\d{2}-\d{2}/.test(clean(item.timeText)) ? '' : clean(item.timeText),
    clean(item.routeText) ? `Recorrido: ${clean(item.routeText)}` : '',
    // Algunos resúmenes son solo el rango de fechas en bruto: el calendario ya lo muestra.
    RAW_DATE_RANGE.test(clean(item.summary)) ? '' : clean(item.summary),
    url ? `Más información: ${url}` : '',
  ].filter(Boolean)
  return parts.join('\n')
}

function location(item) {
  const place = clean(item.place)
  const municipality = clean(item.municipality)
  if (place && municipality && place.toLocaleLowerCase('es').includes(municipality.toLocaleLowerCase('es'))) return place
  return [place, municipality].filter(Boolean).join(', ')
}

// Un VEVENT por acto. Devuelve [] si el acto no tiene fecha válida.
export function agendaItemVEvent(item = {}, { now = new Date() } = {}) {
  const when = timing(item)
  if (!when || !clean(item.title)) return []
  const url = agendaItemCalendarUrl(item)
  const uid = `${agendaEventAnchor(item)}@hilocofrade.es`
  const lines = [
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${utcStamp(now)}`,
    ...when,
    `SUMMARY:${icsEscape(clean(item.title))}`,
    location(item) ? `LOCATION:${icsEscape(location(item))}` : '',
    `DESCRIPTION:${icsEscape(description(item, url))}`,
    url ? `URL:${url}` : '',
    item.isCancelled ? 'STATUS:CANCELLED' : 'STATUS:CONFIRMED',
    clean(item.categoryLabel) ? `CATEGORIES:${icsEscape(clean(item.categoryLabel))}` : '',
    'END:VEVENT',
  ]
  return lines.filter(Boolean)
}

// Calendario completo. `name` aparece como nombre del calendario al suscribirse.
export function buildAgendaCalendar({ name = 'Agenda de Hilo Cofrade', description: calendarDescription = '', items = [], now = new Date() } = {}) {
  const events = items.flatMap((item) => agendaItemVEvent(item, { now }))
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:${PRODID}`,
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${icsEscape(clean(name))}`,
    calendarDescription ? `X-WR-CALDESC:${icsEscape(clean(calendarDescription))}` : '',
    `X-WR-TIMEZONE:${TIMEZONE}`,
    // Frecuencia de actualización sugerida para las suscripciones.
    'REFRESH-INTERVAL;VALUE=DURATION:PT6H',
    'X-PUBLISHED-TTL:PT6H',
    ...MADRID_VTIMEZONE,
    ...events,
    'END:VCALENDAR',
  ].filter(Boolean)
  return `${lines.map(icsFold).join('\r\n')}\r\n`
}

// Actos de una Hermandad: los que organiza o en los que participa.
export function brotherhoodCalendarItems(items = [], slug = '') {
  const href = `/hermandades/${clean(slug)}`
  return items.filter((item) => (
    !item.isPast
    && [item.organizerHref, item.relatedBrotherhoodHref].some((value) => clean(value).replace(/[#?].*$/, '').replace(/\/$/, '') === href)
  ))
}

// Actos de varias Hermandades (calendario «Mis hermandades»), sin repetir.
export function brotherhoodsCalendarItems(items = [], slugs = []) {
  const seen = new Set()
  return slugs.flatMap((slug) => brotherhoodCalendarItems(items, slug)).filter((item) => {
    const key = item.key || `${item.category}:${item.id}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

// Cabeceras comunes de las respuestas .ics (no indexables).
export function icsResponseHeaders(filename = 'hilo-cofrade.ics', { attachment = false } = {}) {
  return {
    'Content-Type': 'text/calendar; charset=utf-8',
    'Content-Disposition': `${attachment ? 'attachment' : 'inline'}; filename="${filename.replace(/[^a-z0-9._-]/gi, '-')}"`,
    'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=900',
    'X-Robots-Tag': 'noindex, nofollow',
  }
}
