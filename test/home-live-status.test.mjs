import test from 'node:test'
import assert from 'node:assert/strict'

import { getExtraordinaryLiveState, outingBriefingSchedule } from '../lib/home-live-status.js'

test('Amparo: la coronación del 8 no es el primer hito de la salida del 15', () => {
  const rows = [
    { id: 'coronacion', itemDate: '2026-11-08', time: '10:00' },
    { id: 'salida', itemDate: '2026-11-15', time: '17:00' },
    { id: 'entrada', itemDate: '2026-11-15', time: '22:45' },
  ]
  const selected = outingBriefingSchedule('2026-11-15', rows)
  assert.deepEqual(selected.map((row) => row.id), ['salida', 'entrada'])
  assert.equal(getExtraordinaryLiveState('2026-11-15', selected, new Date('2026-11-07T12:00:00Z')).nextId, 'salida')
  assert.equal(rows[0].itemDate, '2026-11-08')
  assert.equal(rows.length, 3)
})

test('el destacado conserva los hitos del día y las entradas de madrugada con su fecha', () => {
  const rows = [
    { id: 'previo', itemDate: '2026-11-14' },
    { id: 'salida', itemDate: '2026-11-15', time: '23:00' },
    { id: 'entrada', itemDate: '2026-11-16', time: '01:00', dayLabel: 'Lunes, 16 de noviembre' },
    { id: 'sin-fecha', time: 'Por confirmar' },
  ]
  assert.deepEqual(outingBriefingSchedule('2026-11-15', rows), rows.slice(1))
  assert.deepEqual(outingBriefingSchedule('', rows), rows)
})

const schedule = [
  { id: 'salida', itemDate: '2026-08-22', time: '19:00' },
  { id: 'misa', itemDate: '2026-08-22', time: '20:00' },
  { id: 'procesion', itemDate: '2026-08-22', time: 'En torno a las 22:00' },
  { id: 'entrada', itemDate: '2026-08-23', time: 'Sobre las 04:00' },
]

test('antes de la salida mantiene el estado de hoy y señala el primer hito', () => {
  const state = getExtraordinaryLiveState('2026-08-22', schedule, new Date('2026-08-22T16:30:00Z'))
  assert.equal(state.state, 'today')
  assert.equal(state.eyebrow, 'Hoy · Extraordinaria')
  assert.equal(state.nextId, 'salida')
  assert.deepEqual(state.pastIds, [])
})

test('durante la jornada marca la extraordinaria en curso y el siguiente hito', () => {
  const state = getExtraordinaryLiveState('2026-08-22', schedule, new Date('2026-08-22T17:43:00Z'))
  assert.equal(state.state, 'live')
  assert.equal(state.eyebrow, 'En curso · Extraordinaria')
  assert.equal(state.nextId, 'misa')
  assert.deepEqual(state.pastIds, ['salida'])
})

test('después del último hito la considera celebrada aunque la entrada sea de madrugada', () => {
  const state = getExtraordinaryLiveState('2026-08-22', schedule, new Date('2026-08-23T02:10:00Z'))
  assert.equal(state.state, 'done')
  assert.equal(state.eyebrow, 'Celebrada hoy')
  assert.equal(state.nextId, '')
  assert.deepEqual(state.pastIds, ['salida', 'misa', 'procesion', 'entrada'])
})
