import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import {
  agendaItemCalendarUrl,
  agendaItemVEvent,
  brotherhoodCalendarItems,
  buildAgendaCalendar,
  icsEscape,
  icsFold,
  icsResponseHeaders,
} from '../lib/agenda-ics.js'
import { brotherhoodCalendarPath, calendarSubscribeLinks, localityCalendarPath } from '../lib/agenda-ics-links.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const now = new Date('2026-10-16T10:00:00Z')

const outing = {
  key: 'processions:abc-123',
  category: 'processions',
  title: 'Procesión de Nuestra Señora del Rosario',
  categoryLabel: 'Procesión de Gloria',
  organizer: 'Hermandad del Rosario',
  organizerHref: '/hermandades/rosario-barrio-leon-sevilla',
  date: '2026-10-18',
  startTime: '19:30',
  endTime: '00:30',
  place: 'Parroquia de San Sebastián',
  municipality: 'Sevilla',
  routeText: 'Salida, Plaza, Calle Real, Entrada',
  href: '/procesiones-de-gloria/rosario-barrio-leon-2026',
}

test('el texto se escapa según RFC 5545', () => {
  assert.equal(icsEscape('Calle Real, 3; Sevilla\\Triana\nSalida'), 'Calle Real\\, 3\\; Sevilla\\\\Triana\\nSalida')
})

test('las líneas largas se pliegan a 75 octetos sin partir caracteres', () => {
  const line = `SUMMARY:${'Procesión de María Santísima '.repeat(6)}`
  const folded = icsFold(line).split('\r\n')
  assert.ok(folded.length > 1)
  for (const [index, part] of folded.entries()) {
    assert.ok(new TextEncoder().encode(part).length <= 75, part)
    if (index) assert.ok(part.startsWith(' '))
  }
  assert.equal(folded.map((part, index) => (index ? part.slice(1) : part)).join(''), line)
})

test('un acto con hora usa la zona de Madrid y la recogida de madrugada pasa al día siguiente', () => {
  const lines = agendaItemVEvent(outing, { now })
  assert.ok(lines.includes('DTSTART;TZID=Europe/Madrid:20261018T193000'))
  assert.ok(lines.includes('DTEND;TZID=Europe/Madrid:20261019T003000'))
  assert.ok(lines.includes('UID:acto-processions-abc-123@hilocofrade.es'))
  assert.ok(lines.includes('DTSTAMP:20261016T100000Z'))
  assert.ok(lines.includes('LOCATION:Parroquia de San Sebastián\\, Sevilla'))
  assert.ok(lines.includes('URL:https://hilocofrade.es/procesiones-de-gloria/rosario-barrio-leon-2026'))
  assert.ok(lines.includes('STATUS:CONFIRMED'))
})

test('sin hora es de día completo, con fin exclusivo; sin hora de recogida dura 2 h', () => {
  const allDay = agendaItemVEvent({ ...outing, startTime: '', endTime: '', date: '2026-11-01', endDate: '2026-11-03' }, { now })
  assert.ok(allDay.includes('DTSTART;VALUE=DATE:20261101'))
  assert.ok(allDay.includes('DTEND;VALUE=DATE:20261104'))
  const openEnd = agendaItemVEvent({ ...outing, endTime: '' }, { now })
  assert.ok(openEnd.includes('DURATION:PT2H'))
})

test('los actos sin fecha o sin título no generan evento, y los suspendidos se marcan', () => {
  assert.deepEqual(agendaItemVEvent({ ...outing, date: '' }, { now }), [])
  assert.deepEqual(agendaItemVEvent({ ...outing, title: '' }, { now }), [])
  assert.ok(agendaItemVEvent({ ...outing, isCancelled: true }, { now }).includes('STATUS:CANCELLED'))
})

test('el enlace del acto respeta la política de URLs de la Agenda', () => {
  assert.equal(agendaItemCalendarUrl(outing), 'https://hilocofrade.es/procesiones-de-gloria/rosario-barrio-leon-2026')
  assert.equal(
    agendaItemCalendarUrl({ ...outing, href: '/hermandades/rosario-barrio-leon-sevilla' }),
    'https://hilocofrade.es/agenda-cofrade#acto-processions-abc-123'
  )
})

test('el calendario es válido: cabecera, zona horaria, CRLF y nombre', () => {
  const ics = buildAgendaCalendar({ name: 'Rosario · Hilo Cofrade', items: [outing, { ...outing, date: '' }], now })
  assert.ok(ics.startsWith('BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Hilo Cofrade//Agenda Cofrade//ES\r\n'))
  assert.ok(ics.endsWith('END:VCALENDAR\r\n'))
  assert.equal(ics.match(/BEGIN:VEVENT/g).length, 1)
  assert.match(ics, /BEGIN:VTIMEZONE\r\nTZID:Europe\/Madrid/)
  assert.match(ics, /X-WR-CALNAME:Rosario · Hilo Cofrade/)
  assert.doesNotMatch(ics.replace(/\r\n/g, ''), /\n/)
})

test('la suscripción de una Hermandad incluye lo que organiza o en lo que participa', () => {
  const items = [
    outing,
    { ...outing, key: 'concerts:1', organizerHref: '/bandas/x', relatedBrotherhoodHref: '/hermandades/rosario-barrio-leon-sevilla#agenda' },
    { ...outing, key: 'processions:2', organizerHref: '/hermandades/otra' },
    { ...outing, key: 'processions:3', isPast: true },
  ]
  assert.deepEqual(brotherhoodCalendarItems(items, 'rosario-barrio-leon-sevilla').map((item) => item.key), ['processions:abc-123', 'concerts:1'])
})

test('enlaces de suscripción: webcal y Google Calendar, solo para rutas válidas', () => {
  assert.equal(brotherhoodCalendarPath('san-benito'), '/calendario/hermandad/san-benito.ics')
  assert.equal(localityCalendarPath('sevilla-capital'), '/calendario/localidad/sevilla-capital.ics')
  assert.equal(brotherhoodCalendarPath('../x'), '')
  const links = calendarSubscribeLinks('/calendario/hermandad/san-benito.ics')
  assert.equal(links.webcal, 'webcal://hilocofrade.es/calendario/hermandad/san-benito.ics')
  assert.equal(links.google, `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(links.webcal)}`)
  assert.equal(calendarSubscribeLinks('/agenda-cofrade'), null)
})

test('las respuestas .ics no se indexan y /calendario/ queda fuera del rastreo', () => {
  const headers = icsResponseHeaders('acto.ics', { attachment: true })
  assert.equal(headers['Content-Type'], 'text/calendar; charset=utf-8')
  assert.equal(headers['X-Robots-Tag'], 'noindex, nofollow')
  assert.match(headers['Content-Disposition'], /^attachment; filename="acto\.ics"$/)
  assert.equal((read('app/robots.js').match(/'\/calendario\/'/g) || []).length, 2)
  for (const route of ['acto/[id]', 'hermandad/[slug]', 'localidad/[slug]']) {
    const source = read(`app/calendario/${route}/route.js`)
    assert.match(source, /export const revalidate = 900/, route)
    assert.match(source, /status: 404/, route)
  }
})

test('las tarjetas de la Agenda, la ficha de Hermandad y la guía local ofrecen el calendario', () => {
  assert.match(read('components/AgendaCofradeDirectoryV4.js'), /calendarHref=\{item\.date \? `\/calendario\/acto\/\$\{agendaEventAnchor\(item\)\}\.ics` : ''\}/)
  assert.match(read('components/ShareActions.js'), /trackEvent\('calendar_add'/)
  assert.match(read('components/BrotherhoodAgendaSection.js'), /brotherhoodCalendarPath\(brotherhoodSlug\)/)
  assert.match(read('app/hermandades/[slug]/page.js'), /<BrotherhoodAgendaSection items=\{upcomingAgendaItems\} brotherhoodSlug=\{h\.slug\}/)
  assert.match(read('components/MunicipalityAgendaHub.js'), /localityCalendarPath\(hub\.slug\)/)
})

test('la descripción conserva los horarios en texto pero no repite fechas en bruto', () => {
  const withHours = agendaItemVEvent({ ...outing, startTime: '', timeText: '09:00–14:00 y 17:00–21:00' }, { now }).join('\n')
  assert.match(withHours, /09:00–14:00 y 17:00–21:00/)
  const rawDates = agendaItemVEvent({ ...outing, startTime: '', timeText: '2026-10-17 a 2026-10-18' }, { now }).join('\n')
  assert.doesNotMatch(rawDates, /2026-10-17 a/)
})
