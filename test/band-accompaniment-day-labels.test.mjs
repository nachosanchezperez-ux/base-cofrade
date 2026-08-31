import assert from 'node:assert/strict'
import test from 'node:test'
import {
  resolveAccompanimentOutingType,
  splitCurrentAccompaniments,
} from '../lib/bands/accompaniments.js'

test('una estación de penitencia usa el día documentado en lugar de la etiqueta genérica', () => {
  assert.equal(resolveAccompanimentOutingType({
    outingType: 'Estación de Penitencia',
    processionDay: 'Miércoles Santo',
  }), 'Miércoles Santo')

  assert.equal(resolveAccompanimentOutingType({
    outingType: 'estacion_penitencia',
    notes: 'Domingo de Ramos. Acompañamiento vigente.',
  }), 'Domingo de Ramos')
})

test('una estación de penitencia sin día sigue en Semana Santa sin mostrar la etiqueta genérica', () => {
  const groups = splitCurrentAccompaniments([
    { id: 'sin-dia', outingType: 'Estación de Penitencia', notes: 'Acompañamiento vigente.' },
  ])

  assert.deepEqual(groups.holyWeek.map((item) => item.id), ['sin-dia'])
  assert.equal(groups.holyWeek[0].outingType, 'Día por documentar')
  assert.doesNotMatch(groups.holyWeek[0].outingType, /Estación de penitencia/i)
})

test('los tipos ajenos a Semana Santa conservan su denominación real', () => {
  assert.equal(resolveAccompanimentOutingType({ outingType: 'procesion_gloria' }), 'Procesión de gloria')
  assert.equal(resolveAccompanimentOutingType({ outingType: 'romeria' }), 'Romería')
})
