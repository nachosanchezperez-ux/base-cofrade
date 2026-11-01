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

test('Estepa 2/11: continúa futura el 30, 31 de octubre y el 1 de noviembre', () => {
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
  assert.equal(getOutingTemporalState(estepa, at('2026-11-01T12:00:00Z')).urgencyLabel, 'MAÑANA')
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
    assert.equal(state.isPast, !upcoming, instant)
    assert.equal(state.isLive, live, instant)
  }
})

test('San Esteban y Borriquita de Coria 22/11: sin hora no se inventa una finalización', () => {
  for (const outing of [noTime('2026-11-22'), noTime('2026-11-22')]) {
    for (const instant of ['2026-11-01T12:00:00Z', '2026-11-22T18:00:00Z']) {
      const state = getOutingTemporalState(outing, at(instant))
      assert.equal(state.isUpcoming, true, instant)
      assert.equal(state.isPast, false, instant)
      assert.equal(state.isLive, false, instant)
    }
    assert.equal(getOutingTemporalState(outing, at('2026-11-01T12:00:00Z')).urgencyLabel, 'EN 21 DÍAS')
    const past = getOutingTemporalState(outing, at('2026-11-23T00:00:00Z'))
    assert.equal(past.isUpcoming, false)
    assert.equal(past.isPast, true)
  }
})

test('un acto que cruza medianoche sigue en curso hasta su hora de entrada', () => {
  for (const returnDate of ['', '2026-11-02']) {
    const item = {
      date: '2026-11-01', returnDate, departureTime: '23:30',
      returnTime: '01:15', eventStatus: 'announced',
    }
    assert.equal(getOutingTemporalState(item, at('2026-11-01T23:30:00Z')).isLive, true)
    assert.equal(getOutingTemporalState(item, at('2026-11-02T00:14:00Z')).isPast, false)
    assert.equal(getOutingTemporalState(item, at('2026-11-02T00:15:00Z')).isPast, true)
  }
})

test('un culto de varias jornadas no caduca por haber empezado', () => {
  const item = {
    date: '2026-10-30', endDate: '2026-11-02',
    daySchedules: [{ celebrationDate: '2026-11-02', timeText: '18:00–21:00' }],
  }
  assert.equal(isAgendaItemOver(item, at('2026-10-31T21:00:00Z')), false)
  assert.equal(isAgendaItemOver(item, at('2026-11-01T21:00:00Z')), false)
  assert.equal(isAgendaItemOver(item, at('2026-11-02T19:59:00Z')), false)
  assert.equal(isAgendaItemOver(item, at('2026-11-02T20:00:00Z')), true)
})

test('Madrid conserva el día civil al retrasar el reloj el 25 de octubre', () => {
  for (const instant of ['2026-10-25T00:30:00Z', '2026-10-25T01:30:00Z']) {
    const clock = madridNow(at(instant))
    assert.equal(clock.today, '2026-10-25')
    assert.equal(clock.minutes, 150)
    assert.equal(getOutingTemporalState({
      date: '2026-10-25', departureTime: '02:00',
      returnTime: '03:00', eventStatus: 'announced',
    }, at(instant)).isLive, true)
  }
  assert.equal(getOutingTemporalState({
    date: '2026-10-25', departureTime: '02:00',
    returnTime: '03:00', eventStatus: 'announced',
  }, at('2026-10-25T02:00:00Z')).isPast, true)
})

test('cancelación y celebración manual tienen prioridad sobre la fecha', () => {
  assert.equal(getOutingTemporalState({
    date: '2026-11-22', eventStatus: 'cancelled',
  }, at('2026-11-01T12:00:00Z')).isCancelled, true)
  assert.equal(getOutingTemporalState({
    date: '2026-11-22', eventStatus: 'cancelled',
  }, at('2026-11-01T12:00:00Z')).isUpcoming, false)
  assert.equal(getOutingTemporalState({
    date: '2026-11-22', eventStatus: 'held',
  }, at('2026-11-01T12:00:00Z')).isCelebrated, true)
})

test('fichas y directorios de Extraordinarias y Glorias comparten la utilidad temporal', () => {
  for (const path of [
    '../lib/supabase/extraordinary-detail.js',
    '../lib/supabase/extraordinary-directory.js',
    '../lib/supabase/glory-directory.js',
  ]) {
    const source = readFileSync(new URL(path, import.meta.url), 'utf8')
    assert.match(source, /getOutingTemporalState\(/)
  }
  const detail = readFileSync(new URL('../lib/supabase/extraordinary-detail.js', import.meta.url), 'utf8')
  assert.match(detail, /isUpcoming: temporal\.isUpcoming/)
  const page = readFileSync(new URL('../app/extraordinarias/[slug]/page.js', import.meta.url), 'utf8')
  assert.match(page, /schemaEventStatus\(item\)/)
})

test('el archivo distingue fecha pasada de celebración confirmada', () => {
  const directory = readFileSync(new URL('../lib/supabase/extraordinary-directory.js', import.meta.url), 'utf8')
  const component = readFileSync(new URL('../components/ExtraordinaryDirectory.js', import.meta.url), 'utf8')
  const page = readFileSync(new URL('../app/extraordinarias/page.js', import.meta.url), 'utf8')
  assert.match(directory, /const isCelebrated = temporal\.isCelebrated/)
  assert.match(directory, /isPast: temporal\.isPast/)
  assert.match(component, /if \(item\.isPast\) return 'Fecha pasada'/)
  assert.match(component, /\(item\.isCelebrated \|\| item\.isPast\)/)
  assert.match(page, /item\.isCelebrated \|\| item\.isPast/)
})
