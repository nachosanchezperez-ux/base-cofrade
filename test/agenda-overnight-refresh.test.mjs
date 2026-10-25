import test from 'node:test'
import assert from 'node:assert/strict'
import { isAgendaItemOver } from '../lib/agenda-clock.js'
import { getProcessionLiveState } from '../lib/procession-live-status.js'
import { buildAgendaTemporalLanding } from '../lib/agenda-temporal-landing.js'
import { nextScheduleStepAt } from '../lib/agenda-schedule-steps.js'
import { subscribeAgendaClock } from '../lib/agenda-clock-refresh.js'

const outing = { key: 'processions:night', category: 'processions', isUpcoming: true,
  date: '2026-10-24', startTime: '20:00', endTime: '01:30' }

test('Agenda y directo coinciden antes, durante y al terminar una salida nocturna', () => {
  for (const endDate of ['', '2026-10-25']) {
    const item = { ...outing, endDate }
    for (const [instant, over, count] of [
      ['2026-10-24T22:30:00Z', false, 1],
      ['2026-10-24T23:29:00Z', false, 1],
      ['2026-10-24T23:30:00Z', true, 0],
      ['2026-10-25T02:30:00Z', true, 0],
    ]) {
      const now = new Date(instant)
      assert.equal(isAgendaItemOver(item, now), over, instant)
      assert.equal(getProcessionLiveState(item, now).isLive, !over, instant)
      const landing = buildAgendaTemporalLanding({ items: [item], today: '2026-10-25', now })
      assert.equal(landing.count, count, instant)
      if (count) assert.equal(landing.items[0].date, '2026-10-24')
    }
  }
})

test('sin entrada no se prolonga el acto de ayer ni se inventa un directo', () => {
  const now = new Date('2026-10-24T22:30:00Z')
  const item = { ...outing, endTime: '' }
  assert.equal(getProcessionLiveState(item, now).isLive, false)
  assert.equal(buildAgendaTemporalLanding({ items: [item], today: '2026-10-25', now }).count, 0)
})

test('los tramos de madrugada no vuelven a ofrecer la salida y respetan fechas y estimaciones', () => {
  for (const date of ['', '2026-10-25']) {
    const item = { ...outing, schedule: [
      { label: 'Salida', time: '20:00' },
      { label: 'Plaza', timeText: 'Sobre las 00:45' },
      { label: 'Entrada', time: '01:30', date },
    ] }
    assert.deepEqual(nextScheduleStepAt(item, new Date('2026-10-24T22:30:00Z')), { label: 'Entrada', time: '01:30' })
    assert.equal(nextScheduleStepAt(item, new Date('2026-10-24T23:31:00Z')), null)
  }
})

test('el reloj refresca cada minuto visible, vuelve al recuperar pestaña y limpia suscripciones', () => {
  let calls = 0
  let tick
  let cleared = false
  const document = new EventTarget()
  document.visibilityState = 'visible'
  const browser = new EventTarget()
  browser.setInterval = (callback, delay) => { assert.equal(delay, 60000); tick = callback; return 7 }
  browser.clearInterval = (id) => { assert.equal(id, 7); cleared = true }
  const stop = subscribeAgendaClock(() => calls++, browser, document)
  tick()
  assert.equal(calls, 1)
  document.visibilityState = 'hidden'
  tick()
  assert.equal(calls, 1)
  document.visibilityState = 'visible'
  document.dispatchEvent(new Event('visibilitychange'))
  browser.dispatchEvent(new Event('pageshow'))
  assert.equal(calls, 3)
  stop()
  assert.equal(cleared, true)
  document.dispatchEvent(new Event('visibilitychange'))
  browser.dispatchEvent(new Event('pageshow'))
  assert.equal(calls, 3)
})
