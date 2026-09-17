import assert from 'node:assert/strict'
import test from 'node:test'

import { brotherhoodCalendarMonth, brotherhoodCalendarV5Intent, dateRangeMatchesMonth } from '../lib/tira-brotherhood-calendar-v5.js'

test('detecta próximos cultos de una Hermandad', () => {
  assert.equal(brotherhoodCalendarV5Intent('¿Qué tiene próximamente San Gonzalo?')?.kind, 'brotherhood_upcoming')
  assert.equal(brotherhoodCalendarV5Intent('¿Qué cultos quedan de San Gonzalo?')?.kind, 'brotherhood_upcoming')
  assert.equal(brotherhoodCalendarV5Intent('Cultos de octubre de San Gonzalo')?.kind, 'brotherhood_upcoming')
})

test('detecta el ciclo anual de Cultos', () => {
  assert.equal(brotherhoodCalendarV5Intent('¿Qué cultos tiene San Gonzalo?')?.kind, 'brotherhood_cults')
  assert.equal(brotherhoodCalendarV5Intent('Quinarios y triduos de San Gonzalo')?.kind, 'brotherhood_cults')
})

test('detecta acontecimientos históricos y continuidad', () => {
  assert.equal(brotherhoodCalendarV5Intent('Acontecimientos históricos de San Gonzalo')?.kind, 'brotherhood_history')
  assert.equal(brotherhoodCalendarV5Intent('¿Y su historia?', { entityType: 'brotherhood' })?.kind, 'brotherhood_history')
  assert.equal(brotherhoodCalendarV5Intent('¿Y los próximos?', { entityType: 'brotherhood' })?.kind, 'brotherhood_upcoming')
})

test('no secuestra la Agenda municipal', () => {
  assert.equal(brotherhoodCalendarV5Intent('¿Qué hay en Tomares este fin de semana?'), null)
  assert.equal(brotherhoodCalendarV5Intent('Procesiones en La Rinconada'), null)
})

test('reconoce meses y solapes', () => {
  assert.equal(brotherhoodCalendarMonth('cultos de octubre'), 10)
  assert.equal(brotherhoodCalendarMonth('cultos de septiembre'), 9)
  assert.equal(dateRangeMatchesMonth('2026-10-15', '2026-10-17', 10), true)
  assert.equal(dateRangeMatchesMonth('2026-09-30', '2026-10-02', 10), true)
  assert.equal(dateRangeMatchesMonth('2026-11-02', '2026-11-02', 10), false)
})
