import test from 'node:test'
import assert from 'node:assert/strict'
import { agendaScheduleDateLabel, agendaScheduleSteps } from '../lib/agenda-schedule-steps.js'

test('Amparo: el destacado del 15 no toma la coronación del 8 y el detalle identifica ambos días', () => {
  const item = { date: '2026-11-15', schedule: [
    { label: 'Coronación', date: '2026-11-08', time: '10:00' },
    { label: 'Salida', date: '2026-11-15', time: '17:00' },
    { label: 'Entrada', date: '2026-11-15', time: '22:45' },
  ] }
  assert.deepEqual(agendaScheduleSteps(item), [{ label: 'Salida', time: '17:00' }, { label: 'Entrada', time: '22:45' }])
  assert.deepEqual(item.schedule.map((row) => agendaScheduleDateLabel(row, item)), ['8 de noviembre de 2026', '15 de noviembre de 2026', '15 de noviembre de 2026'])
})

test('el detalle conserva la fecha explícita de una recogida de madrugada y el día heredado', () => {
  const item = { date: '2026-11-15' }
  assert.equal(agendaScheduleDateLabel({ date: '2026-11-16', time: '01:00' }, item), '16 de noviembre de 2026')
  assert.equal(agendaScheduleDateLabel({ time: '17:00' }, item), '15 de noviembre de 2026')
  assert.equal(agendaScheduleDateLabel({}, {}), '')
})
