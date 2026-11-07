import test from 'node:test'
import assert from 'node:assert/strict'
import { daysUntil, relativeDayLabel } from '../lib/relative-day.js'

test('Próximamente se convierte en Hoy, Mañana o En x días', () => {
  assert.equal(relativeDayLabel('2026-11-07', '2026-11-07'), 'Hoy')
  assert.equal(relativeDayLabel('2026-11-08', '2026-11-07'), 'Mañana')
  assert.equal(relativeDayLabel('2026-11-10', '2026-11-07'), 'En 3 días')
  assert.equal(relativeDayLabel('2026-12-06', '2026-11-07'), 'En 29 días')
  assert.equal(relativeDayLabel('2027-03-01', '2026-11-07', { maxDays: 60 }), '')
  assert.equal(relativeDayLabel('2026-11-06', '2026-11-07'), '')
  assert.equal(relativeDayLabel('', '2026-11-07'), '')
})

test('el cálculo de días no se tuerce con el cambio de hora', () => {
  assert.equal(daysUntil('2026-10-26', '2026-10-24'), 2)
  assert.equal(daysUntil('2027-03-29', '2027-03-27'), 2)
})
