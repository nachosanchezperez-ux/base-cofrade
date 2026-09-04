import assert from 'node:assert/strict'
import test from 'node:test'

import {
  futureMusicAccompanimentPeriodIds,
  musicAccompanimentPeriodHasStarted,
} from '../lib/music-accompaniment-effective.js'

const referenceDate = new Date('2026-09-04T00:00:00Z')

test('un acompañamiento de 2027 no es vigente en septiembre de 2026', () => {
  assert.equal(
    musicAccompanimentPeriodHasStarted({ year_from: 2027 }, referenceDate),
    false
  )
})

test('un acompañamiento iniciado en 2026 sí es vigente', () => {
  assert.equal(
    musicAccompanimentPeriodHasStarted({ year_from: 2026 }, referenceDate),
    true
  )
})

test('una fecha exacta futura prevalece sobre el año de inicio', () => {
  assert.equal(
    musicAccompanimentPeriodHasStarted({ date_from: '2026-10-01', year_from: 2026 }, referenceDate),
    false
  )
})

test('identifica únicamente los periodos futuros', () => {
  const ids = futureMusicAccompanimentPeriodIds([
    { id: 'vigente', year_from: 2022 },
    { id: 'futuro', year_from: 2027 },
    { id: 'sin-fecha' },
  ], referenceDate)

  assert.deepEqual([...ids], ['futuro'])
})
