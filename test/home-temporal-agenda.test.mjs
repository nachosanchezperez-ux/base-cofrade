import test from 'node:test'
import assert from 'node:assert/strict'
import { buildHomeTemporalAgenda } from '../lib/home-temporal-agenda.js'

function item(overrides = {}) {
  return {
    id: overrides.id || overrides.key,
    key: overrides.key,
    category: overrides.category || 'devotions',
    date: overrides.date,
    endDate: overrides.endDate || '',
    startTime: overrides.startTime || '',
    endTime: overrides.endTime || '',
    isUpcoming: overrides.isUpcoming ?? true,
    isCancelled: false,
    ...overrides,
  }
}

test('la Home prioriza en curso, después hoy, mañana y fin de semana', () => {
  const now = new Date('2026-09-25T16:00:00Z')
  const temporal = buildHomeTemporalAgenda({
    today: '2026-09-25',
    now,
    items: [
      item({ key: 'live', category: 'processions', date: '2026-09-25', startTime: '17:00', endTime: '20:30' }),
      item({ key: 'tomorrow', date: '2026-09-26', startTime: '10:00' }),
    ],
  })
  assert.equal(temporal.mode, 'live')
  assert.deepEqual(temporal.focusItems.map((entry) => entry.key), ['live'])
})

test('sin nada en curso avanza a lo que queda de hoy', () => {
  const temporal = buildHomeTemporalAgenda({
    today: '2026-09-25',
    now: new Date('2026-09-25T15:00:00Z'),
    items: [
      item({ key: 'past', date: '2026-09-25', startTime: '10:00', endTime: '11:00' }),
      item({ key: 'later', date: '2026-09-25', startTime: '20:00' }),
      item({ key: 'tomorrow', date: '2026-09-26', startTime: '10:00' }),
    ],
  })
  assert.equal(temporal.mode, 'today')
  assert.deepEqual(temporal.focusItems.map((entry) => entry.key), ['later'])
})

test('sin citas restantes hoy avanza a mañana y luego al fin de semana', () => {
  const tomorrow = buildHomeTemporalAgenda({
    today: '2026-09-25',
    now: new Date('2026-09-25T20:30:00Z'),
    items: [
      item({ key: 'tomorrow', date: '2026-09-26', startTime: '10:00' }),
      item({ key: 'sunday', date: '2026-09-27', startTime: '18:00' }),
    ],
  })
  assert.equal(tomorrow.mode, 'tomorrow')

  const weekend = buildHomeTemporalAgenda({
    today: '2026-09-25',
    now: new Date('2026-09-25T20:30:00Z'),
    items: [
      item({ key: 'sunday', date: '2026-09-27', startTime: '18:00' }),
    ],
  })
  assert.equal(weekend.mode, 'weekend')
})

test('los actos de varios días siguen disponibles mientras abarcan hoy', () => {
  const temporal = buildHomeTemporalAgenda({
    today: '2026-09-25',
    now: new Date('2026-09-25T18:00:00Z'),
    items: [
      item({ key: 'multi', date: '2026-09-24', endDate: '2026-09-26' }),
    ],
  })
  assert.equal(temporal.mode, 'today')
  assert.equal(temporal.remainingTodayItems.length, 1)
})
