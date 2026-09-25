import test from 'node:test'
import assert from 'node:assert/strict'
import {
  addAgendaDays,
  agendaWeekendRange,
  buildMunicipalityTemporal,
} from '../lib/municipality-temporal.js'

test('calcula mañana y el fin de semana desde una fecha estable', () => {
  assert.equal(addAgendaDays('2026-09-25', 1), '2026-09-26')
  assert.deepEqual(agendaWeekendRange('2026-09-25'), ['2026-09-26', '2026-09-27'])
  assert.deepEqual(agendaWeekendRange('2026-09-27'), ['2026-09-26', '2026-09-27'])
})

test('separa ahora, hoy, mañana y fin de semana sin ranking editorial', () => {
  const items = [
    { key: 'live', date: '2026-09-25', startTime: '18:00', liveState: { state: 'live', isLive: true } },
    { key: 'today', date: '2026-09-25', startTime: '20:00' },
    { key: 'tomorrow', date: '2026-09-26', startTime: '10:00' },
    { key: 'sunday', date: '2026-09-27', startTime: '19:00' },
    { key: 'done', date: '2026-09-25', startTime: '12:00', liveState: { state: 'done', isLive: false } },
  ]
  const temporal = buildMunicipalityTemporal(items, '2026-09-25')

  assert.deepEqual(temporal.liveItems.map((item) => item.key), ['live'])
  assert.deepEqual(temporal.todayItems.map((item) => item.key), ['done', 'live', 'today'])
  assert.deepEqual(temporal.tomorrowItems.map((item) => item.key), ['tomorrow'])
  assert.deepEqual(temporal.weekendItems.map((item) => item.key), ['tomorrow', 'sunday'])
  assert.deepEqual(temporal.closestItems.map((item) => item.key), ['today', 'tomorrow', 'sunday'])
})

test('los actos de varios días cuentan en cada jornada afectada', () => {
  const temporal = buildMunicipalityTemporal([
    { key: 'cult', date: '2026-09-24', endDate: '2026-09-26', startTime: '' },
  ], '2026-09-25')

  assert.equal(temporal.todayItems.length, 1)
  assert.equal(temporal.tomorrowItems.length, 1)
})
