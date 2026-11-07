import test from 'node:test'
import assert from 'node:assert/strict'
import { scheduledRouteStatus } from '../lib/procession-live-status.js'
import { outingSchedule, placeWithArticle } from '../lib/brotherhood-featured-outing.js'

// 7 de noviembre de 2026 en Madrid es UTC+1.
const at = (hhmm) => new Date(`2026-11-07T${hhmm}:00+01:00`)

const outing = {
  date: '2026-11-07', departureTime: '18:30', returnTime: '22:00',
  routePoints: [
    { order: 1, label: 'Iglesia de San Antonio de Padua', time: '18:30' },
    { order: 2, label: 'San Vicente', time: '' },
    { order: 10, label: 'Parroquia de San Lorenzo', time: '19:45', notes: 'Solemne Eucaristía a las 20:00' },
    { order: 11, label: 'Plaza de San Lorenzo', time: '21:15' },
    { order: 12, label: 'Juan Rabadán', time: '' },
    { order: 17, label: 'Iglesia de San Antonio de Padua', time: '22:00' },
  ],
}

test('el horario por puntos dice dónde debería estar el cortejo', () => {
  const schedule = outingSchedule(outing)
  const status = (hhmm) => scheduledRouteStatus({ date: outing.date, schedule }, at(hhmm))
  assert.equal(status('18:00'), '')
  assert.equal(status('19:00'), 'Hacia la Parroquia de San Lorenzo · llegada prevista a las 19:45')
  assert.equal(status('20:30'), 'En la Parroquia de San Lorenzo · sale a las 21:15')
  assert.equal(status('21:30'), 'De regreso · entrada a las 22:00')
  assert.equal(status('22:05'), '')
  assert.equal(scheduledRouteStatus({ date: '2026-11-08', schedule }, at('20:30')), '')
})

test('sin horas intermedias no hay horario por puntos', () => {
  assert.deepEqual(outingSchedule({ ...outing, routePoints: outing.routePoints.filter((p) => !p.notes && p.order !== 11) }), [])
  assert.deepEqual(outingSchedule({ ...outing, returnTime: '' }), [])
})

test('los lugares llevan su artículo y las calles no', () => {
  assert.equal(placeWithArticle('Parroquia de San Lorenzo'), 'la Parroquia de San Lorenzo')
  assert.equal(placeWithArticle('Convento de Santa Ana'), 'el Convento de Santa Ana')
  assert.equal(placeWithArticle('Juan Rabadán'), 'Juan Rabadán')
})
