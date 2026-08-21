import assert from 'node:assert/strict'
import test from 'node:test'
import {
  sortGloryAccompaniments,
  sortHolyWeekAccompaniments,
  splitCurrentAccompaniments,
} from '../lib/bands/accompaniments.js'

test('separa Semana Santa de Glorias y cultos externos', () => {
  const items = [
    { id: 'corpus', outingType: 'Procesión eucarística' },
    { id: 'domingo', outingType: 'Domingo de Ramos' },
    { id: 'gloria', outingType: 'Procesión de gloria' },
    { id: 'viernes', outingType: 'Viernes Santo' },
    { id: 'extraordinaria', outingType: 'Procesión extraordinaria' },
  ]

  const groups = splitCurrentAccompaniments(items)

  assert.deepEqual(groups.holyWeek.map((item) => item.id), ['domingo', 'viernes'])
  assert.deepEqual(groups.glories.map((item) => item.id), ['corpus', 'gloria', 'extraordinaria'])
})

test('ordena Semana Santa por jornada y Glorias alfabéticamente', () => {
  const holyWeek = sortHolyWeekAccompaniments([
    { outingType: 'Viernes Santo' },
    { outingType: 'Lunes Santo' },
    { outingType: 'Domingo de Ramos' },
  ])
  const glories = sortGloryAccompaniments([
    { brotherhoodName: 'Reina de Todos los Santos' },
    { brotherhoodName: 'Araceli' },
  ])

  assert.deepEqual(holyWeek.map((item) => item.outingType), ['Domingo de Ramos', 'Lunes Santo', 'Viernes Santo'])
  assert.deepEqual(glories.map((item) => item.brotherhoodName), ['Araceli', 'Reina de Todos los Santos'])
})
