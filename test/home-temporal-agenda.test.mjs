import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
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


test('un acto multidia usa la fecha y horario de la jornada actual', () => {
  const temporal = buildHomeTemporalAgenda({
    today: '2026-09-26',
    now: new Date('2026-09-26T16:20:00Z'),
    items: [
      item({
        key: 'sed',
        category: 'devotions',
        date: '2026-09-25',
        endDate: '2026-09-27',
        daySchedules: [
          { celebrationDate: '2026-09-25', timeText: 'Al finalizar la Misa de las 20:00' },
          { celebrationDate: '2026-09-26', startTime: '09:00', timeText: '09:00–14:00 y 17:00–21:00' },
          { celebrationDate: '2026-09-27', startTime: '09:00', timeText: '09:00–14:00 y 17:00–21:00' },
        ],
      }),
      item({ key: 'valvanera', category: 'processions', date: '2026-09-26', startTime: '18:30' }),
    ],
  })

  assert.equal(temporal.mode, 'today')
  assert.deepEqual(temporal.focusItems.map((entry) => entry.key), ['sed', 'valvanera'])
  const sed = temporal.focusItems.find((entry) => entry.key === 'sed')
  assert.equal(sed.temporalDate, '2026-09-26')
  assert.equal(sed.temporalDateInfo.weekdayLabel, 'Sábado, 26 de septiembre')
  assert.equal(sed.timeText, '09:00–14:00 y 17:00–21:00')
  assert.equal(sed.endTime, '21:00')
})


test('la Home da jerarquía visual a los horarios de la Agenda en móvil', () => {
  const component = readFileSync(new URL('../components/HomeTemporalFocus.js', import.meta.url), 'utf8')
  const styles = readFileSync(new URL('../components/HomeTemporalFocus.module.css', import.meta.url), 'utf8')

  assert.match(component, /className=\{styles\.schedule\}/)
  assert.match(component, /<small>Horario<\/small>/)
  assert.match(component, /<strong>\{timingLabel\(item\)\}<\/strong>/)
  assert.match(styles, /@media\(max-width:480px\)/)
  assert.match(styles, /\.schedule\{order:-1;display:flex;flex:1 0 100%;min-height:44px/)
  assert.match(styles, /\.schedule strong\{color:#123a67;font-size:14px;font-weight:900/)
  assert.match(styles, /font-variant-numeric:tabular-nums/)
})


test('la transición de una procesión respeta el inicio y el final documentados', () => {
  const fixture = [
    item({
      key: 'boundary',
      category: 'processions',
      date: '2026-09-28',
      startTime: '19:00',
      endTime: '21:00',
    }),
  ]

  const before = buildHomeTemporalAgenda({
    today: '2026-09-28',
    now: new Date('2026-09-28T16:59:00Z'),
    items: fixture,
  })
  assert.equal(before.mode, 'today')

  const started = buildHomeTemporalAgenda({
    today: '2026-09-28',
    now: new Date('2026-09-28T17:00:00Z'),
    items: fixture,
  })
  assert.equal(started.mode, 'live')

  const atEnd = buildHomeTemporalAgenda({
    today: '2026-09-28',
    now: new Date('2026-09-28T19:00:00Z'),
    items: fixture,
  })
  assert.equal(atEnd.mode, 'live')

  const finished = buildHomeTemporalAgenda({
    today: '2026-09-28',
    now: new Date('2026-09-28T19:01:00Z'),
    items: fixture,
  })
  assert.equal(finished.liveItems.length, 0)
  assert.equal(finished.focusItems.length, 0)
})

test('una procesión sin fecha de regreso documentada puede cruzar medianoche', () => {
  const temporal = buildHomeTemporalAgenda({
    today: '2026-09-29',
    now: new Date('2026-09-28T22:15:00Z'),
    items: [
      item({
        key: 'overnight',
        category: 'processions',
        date: '2026-09-28',
        startTime: '23:30',
        endTime: '01:30',
      }),
    ],
  })

  assert.equal(temporal.mode, 'live')
  assert.deepEqual(temporal.focusItems.map((entry) => entry.key), ['overnight'])
})

test('el cambio de día usa Europe/Madrid y promueve las citas de la nueva jornada', () => {
  const temporal = buildHomeTemporalAgenda({
    now: new Date('2026-09-28T22:01:00Z'),
    items: [
      item({
        key: 'new-day',
        category: 'devotions',
        date: '2026-09-29',
        startTime: '08:00',
      }),
    ],
  })

  assert.equal(temporal.today, '2026-09-29')
  assert.equal(temporal.mode, 'today')
  assert.deepEqual(temporal.focusItems.map((entry) => entry.key), ['new-day'])
})
