import assert from 'node:assert/strict'
import test from 'node:test'
import {
  groupGloryAccompaniments,
  resolveAccompanimentLocation,
  sortGloryAccompaniments,
  sortHolyWeekAccompaniments,
  splitCurrentAccompaniments,
  summarizeGloryTypes,
} from '../lib/bands/accompaniments.js'

test('conserva la localidad pública cuando la hermandad vinculada sigue en borrador', () => {
  const location = resolveAccompanimentLocation({
    public_municipality_name: 'Camas',
    public_municipality_slug: 'camas',
    public_province: 'Sevilla',
  })

  assert.deepEqual(location, {
    brotherhoodTypes: [],
    municipality: 'Camas',
    municipalitySlug: 'camas',
    province: 'Sevilla',
  })
})

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

test('agrupa los acompañamientos de Glorias entre Sevilla capital y provincia', () => {
  const groups = groupGloryAccompaniments([
    { brotherhoodName: 'Araceli', municipality: 'Sevilla', municipalitySlug: 'sevilla', province: 'Sevilla' },
    { brotherhoodName: 'Dolores', municipality: 'Camas', municipalitySlug: 'camas', province: 'Sevilla' },
    { brotherhoodName: 'Nieves', municipality: 'Benacazón', municipalitySlug: 'benacazon', province: 'Sevilla' },
  ])

  assert.deepEqual(groups.map((group) => group.key), ['sevilla-capital', 'provincia-sevilla'])
  assert.deepEqual(groups[0].items.map((item) => item.brotherhoodName), ['Araceli'])
  assert.deepEqual(groups[1].items.map((item) => item.municipality), ['Benacazón', 'Camas'])
})

test('resume las Glorias por tipo de procesión', () => {
  const summary = summarizeGloryTypes([
    { outingType: 'Procesión de gloria' },
    { outingType: 'Procesión eucarística' },
    { outingType: 'Procesión de gloria' },
    { outingType: 'Procesión extraordinaria' },
  ])

  assert.deepEqual(summary, [
    { type: 'Procesión de gloria', label: 'Procesiones de gloria', count: 2 },
    { type: 'Procesión eucarística', label: 'Procesiones eucarísticas', count: 1 },
    { type: 'Procesión extraordinaria', label: 'Procesiones extraordinarias', count: 1 },
  ])
})
