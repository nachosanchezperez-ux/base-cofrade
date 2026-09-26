import test from 'node:test'
import assert from 'node:assert/strict'
import {
  agendaTemporalRangeDate,
  agendaTimeBounds,
  withAgendaTemporalDay,
} from '../lib/agenda-temporal-display.js'

test('extrae la primera y la ultima hora de una franja partida', () => {
  assert.deepEqual(agendaTimeBounds('09:00–14:00 y 17:00–21:00'), {
    startTime: '09:00',
    endTime: '21:00',
  })
})

test('proyecta un acto multidia sobre el dia solicitado', () => {
  const item = {
    date: '2026-09-25',
    endDate: '2026-09-27',
    timeText: '20:00',
    daySchedules: [
      { celebrationDate: '2026-09-26', startTime: '18:00', timeText: '18:00–20:00' },
    ],
  }
  const projected = withAgendaTemporalDay(item, '2026-09-26')
  assert.equal(projected.temporalDate, '2026-09-26')
  assert.equal(projected.startTime, '18:00')
  assert.equal(projected.endTime, '20:00')
  assert.equal(projected.temporalDateInfo.weekdayLabel, 'Sábado, 26 de septiembre')
})

test('al solaparse con el fin de semana usa el primer dia del rango', () => {
  assert.equal(
    agendaTemporalRangeDate({ date: '2026-09-25', endDate: '2026-09-27' }, '2026-09-26', '2026-09-27'),
    '2026-09-26',
  )
})
