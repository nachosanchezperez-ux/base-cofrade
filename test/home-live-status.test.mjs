import test from 'node:test'
import assert from 'node:assert/strict'

import { getExtraordinaryLiveState } from '../lib/home-live-status.js'

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
