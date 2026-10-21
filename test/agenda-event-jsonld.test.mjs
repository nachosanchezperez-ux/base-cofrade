import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { agendaEventClock, agendaEventJsonLd, agendaEventListJsonLd } from '../lib/agenda-event-jsonld.js'

const base = { key: 'rosaries:1', id: '1', category: 'rosaries', title: 'Rosario de la Aurora', date: '2026-10-24', startTime: '09:30', endTime: '11:30', municipality: 'Sevilla', place: 'Parroquia de San Isidro', organizer: 'Hermandad de Pino Montano', organizerHref: '/hermandades/pino-montano', isUpcoming: true, eventHref: '/agenda-cofrade/rosarios/aurora-2026' }

test('cada acto es un Event con hora de Madrid, lugar y organizadora reales', () => {
  const event = agendaEventJsonLd(base)
  assert.equal(event['@type'], 'Event')
  assert.equal(event.startDate, '2026-10-24T09:30:00+02:00')
  assert.equal(event.endDate, '2026-10-24T11:30:00+02:00')
  assert.equal(event.url, 'https://hilocofrade.es/agenda-cofrade/rosarios/aurora-2026')
  assert.equal(event.location.name, 'Parroquia de San Isidro')
  assert.equal(event.location.address.addressLocality, 'Sevilla')
  assert.equal(event.organizer.name, 'Hermandad de Pino Montano')
  assert.equal(event.eventStatus, 'https://schema.org/EventScheduled')
  assert.equal(event.offers, undefined)
  // Invierno: +01:00.
  assert.equal(agendaEventJsonLd({ ...base, date: '2026-12-08' }).startDate, '2026-12-08T09:30:00+01:00')
})

test('sin hora clara se publica solo la fecha; sin fecha no hay evento', () => {
  assert.equal(agendaEventClock({ timeText: 'Según calendario anual' }), '')
  assert.equal(agendaEventClock({ timeText: 'A las 20.00 horas' }), '20:00')
  const event = agendaEventJsonLd({ ...base, startTime: '', endTime: '', timeText: 'Según calendario anual' })
  assert.equal(event.startDate, '2026-10-24')
  assert.equal(event.endDate, undefined)
  assert.equal(agendaEventJsonLd({ ...base, date: '' }), null)
})

test('la foto solo se usa si es del propio acto, y los suspendidos se marcan', () => {
  assert.deepEqual(agendaEventJsonLd({ ...base, photo: { source: 'event', path: 'https://x.supabase.co/a.jpg' } }).image, ['https://x.supabase.co/a.jpg'])
  assert.equal(agendaEventJsonLd({ ...base, photo: { source: 'titular', path: 'https://x.supabase.co/a.jpg' } }).image, undefined)
  assert.equal(agendaEventJsonLd({ ...base, isCancelled: true }).eventStatus, 'https://schema.org/EventCancelled')
})

test('la lista no repite los actos de varios días ni incluye los pasados', () => {
  const list = agendaEventListJsonLd([base, { ...base }, { ...base, key: 'x:2', isPast: true }, { ...base, key: 'x:3', title: 'Otro' }], { name: 'Hoy', url: 'https://hilocofrade.es/agenda-cofrade/hoy' })
  assert.equal(list['@type'], 'ItemList')
  assert.equal(list.numberOfItems, 2)
  assert.deepEqual(list.itemListElement.map((entry) => entry.position), [1, 2])
  assert.equal(agendaEventListJsonLd([]), null)
})

test('la Agenda completa y las páginas de periodo publican la lista de eventos', () => {
  assert.match(readFileSync(new URL('../app/agenda-cofrade/page.js', import.meta.url), 'utf8'), /agendaEventListJsonLd\(upcoming/)
  assert.match(readFileSync(new URL('../components/AgendaTemporalLanding.js', import.meta.url), 'utf8'), /agendaEventListJsonLd\(landing\.items/)
})
