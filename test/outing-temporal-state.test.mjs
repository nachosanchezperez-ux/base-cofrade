import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { madridNow, isAgendaItemOver } from '../lib/agenda-clock.js'
import { getOutingTemporalState } from '../lib/outing-temporal-state.js'

const at = (instant) => new Date(instant)
const estepa = {
  date: '2026-11-02',
  departureTime: '07:30',
  returnTime: '14:30',
  eventStatus: 'announced',
}
const noTime = (date) => ({ date, eventStatus: 'announced' })

test('Estepa 2/11: continÃºa futura el 30, 31 de octubre y el 1 de noviembre', () => {
  for (const instant of [
    '2026-10-30T12:00:00Z',
    '2026-10-31T12:00:00Z',
    '2026-11-01T12:00:00Z',
  ]) {
    const state = getOutingTemporalState(estepa, at(instant))
    assert.equal(state.isUpcoming, true, instant)
    assert.equal(state.isPast, false, instant)
    assert.equal(state.isLive, false, instant)
  }
  assert.equal(getOutingTemporalState(estepa, at('2026-11-01T12:00:00Z')).urgencyLabel, 'MAÃ‘ANA')
})

test('Estepa 2/11: solo termina al llegar la entrada prevista a las 14:30 de Madrid', () => {
  for (const [instant, upcoming, live] of [
    ['2026-11-02T06:29:00Z', true, false],
    ['2026-11-02T06:30:00Z', true, true],
    ['2026-11-02T13:29:00Z', true, true],
    ['2026-11-02T13:30:00Z', false, false],
    ['2026-11-03T00:00:00Z', false, false],
  ]) {
    const state = getOutingTemporalState(estepa, at(instant))
    assert.equal(state.isUpcoming, upcoming, instant)
    assert.equal(state.isPast, !u¶»§q«^