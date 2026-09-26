import test from 'node:test'
import assert from 'node:assert/strict'

import {
  compareProcessionLiveItems,
  getProcessionLiveState,
  withProcessionLiveState,
} from '../lib/procession-live-status.js'

test('marca una procesión en curso entre salida y entrada', () => {
  const state = getProcessionLiveState({
    date: '2026-09-23',
    startTime: '18:00',
    endTime: '22:30',
  }, new Date('2026-09-23T18:15:00Z'))

  assert.equal(state.state, 'live')
  assert.equal(state.isLive, true)
  assert.equal(state.timingLabel, 'Hasta 22:30')
})

test('soporta entradas de madrugada sin returnDate explícita', () => {
  const state = getProcessionLiveState({
    date: '2026-09-23',
    startTime: '20:00',
    endTime: '01:30',
  }, new Date('2026-09-23T23:30:00Z'))

  assert.equal(state.state, 'live')
})

test('una procesión terminada hoy no desplaza a otra que sigue en curso', () => {
  const now = new Date('2026-09-23T19:00:00Z')
  const done = withProcessionLiveState({
    id: 'done',
    date: '2026-09-23',
    departureTime: '15:00',
    returnTime: '18:00',
  }, now)
  const live = withProcessionLiveState({
    id: 'live',
    date: '2026-09-23',
    departureTime: '18:00',
    returnTime: '23:00',
  }, now)

  assert.equal([done, live].sort(compareProcessionLiveItems)[0].id, 'live')
})

test('varias procesiones simultáneas conservan el orden de salida dentro del directo', () => {
  const now = new Date('2026-09-23T19:00:00Z')
  const later = withProcessionLiveState({
    id: 'later',
    date: '2026-09-23',
    departureTime: '19:30',
    returnTime: '23:30',
  }, now)
  const earlier = withProcessionLiveState({
    id: 'earlier',
    date: '2026-09-23',
    departureTime: '18:00',
    returnTime: '22:00',
  }, now)

  assert.deepEqual(
    [later, earlier].sort(compareProcessionLiveItems).map((item) => item.id),
    ['earlier', 'later']
  )
})


test('una salida de una fecha pasada sin horarios queda finalizada', () => {
  const state = getProcessionLiveState({
    date: '2026-03-19',
  }, new Date('2026-09-24T00:00:00Z'))

  assert.equal(state.state, 'done')
  assert.equal(state.label, 'Finalizada')
})

test('una salida futura sin horarios sigue siendo próxima', () => {
  const state = getProcessionLiveState({
    date: '2026-10-12',
  }, new Date('2026-09-24T00:00:00Z'))

  assert.equal(state.state, 'upcoming')
  assert.equal(state.label, 'Próxima')
})


test('activa el directo tras la salida aunque falte la hora de entrada', () => {
  const state = getProcessionLiveState({
    date: '2026-09-26',
    startTime: '18:30',
    endTime: '',
  }, new Date('2026-09-26T17:21:00Z'))

  assert.equal(state.state, 'live')
  assert.equal(state.isLive, true)
  assert.equal(state.label, 'En curso')
})

test('una salida sin hora final no queda indefinidamente en directo', () => {
  const state = getProcessionLiveState({
    date: '2026-09-26',
    startTime: '17:00',
    endTime: '',
  }, new Date('2026-09-27T00:30:00Z'))

  assert.equal(state.state, 'done')
  assert.equal(state.isLive, false)
})
