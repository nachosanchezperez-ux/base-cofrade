import assert from 'node:assert/strict'
import test from 'node:test'
import {
  formatOutingType,
  groupGloryAccompaniments,
  partitionAccompanimentsBySeason,
  resolveAccompanimentLocation,
  sortGloryAccompaniments,
  sortHolyWeekAccompaniments,
  splitCurrentAccompaniments,
  summarizeGloryTypes,
} from '../lib/bands/accompaniments.js'

test('retira automáticamente de la temporada los contratos que ya han finalizado', () => {
  const periods = partitionAccompanimentsBySeason([
    { id: 'mairena', yearFrom: 2017, yearTo: 2026 },
    { id: 'carmen', yearFrom: 2026, yearTo: null },
  ], [{ id: 'san-bernardo', yearTo: 2003 }], 2027)

  assert.deepEqual(periods.current.map((item) => item.id), ['carmen'])
  assert.deepEqual(periods.historical.map((item) => item.id), ['san-bernardo', 'mairena'])
})

test('conserva el contrato durante su último año de vigencia', () => {
  const periods = partitionAccompanimentsBySeason([
    { id: 'mairena', yearFrom: 2017, yearTo: 2026 },
  ], [], 2026)

  assert.deepEqual(periods.current.map((item) => item.id), ['mairena'])
  assert.deepEqual(periods.historical, [])
})

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

test('normaliza tipos técnicos de salida antes de mostrarlos', () => {
  assert.equal(formatOutingType('procesion_gloria'), 'Procesión de gloria')
  assert.equal(formatOutingType('PROCESION_PENITENCIAL'), 'Procesión penitencial')
  assert.equal(formatOutingType('romeria'), 'Romería')
  assert.equal(formatOutingType('Estación de Penitencia'), 'Estación de penitencia')
  assert.equal(formatOutingType('Madrugada'), 'Madrugá')
})

test('separa Semana Santa de Glorias y cultos externos', () => {
  const items = [
    { id: 'corpus', outingType: 'Procesión eucarística' },
    { id: 'domingo', outingType: 'Domingo de Ramos' },
    { id: 'gloria', outingType: 'Procesión de gloria' },
    { id: 'viernes', outingType: 'Viernes Santo' },
    { id: 'madruga', outingType: 'Madrugá' },
    { id: 'estacion', outingType: 'estacion_penitencia' },
    { id: 'penitencial-externa', outingType: 'procesion_penitencial' },
    { id: 'extraordinaria', outingType: 'Procesión extraordinaria' },
  ]

  const groups = splitCurrentAccompaniments(items)

  assert.deepEqual(groups.holyWeek.map((item) => item.id), ['domingo', 'viernes', 'madruga', 'estacion'])
  assert.deepEqual(groups.glories.map((item) => item.id), ['corpus', 'gloria', 'penitencial-externa', 'extraordinaria'])
  assert.equal(groups.glories.find((item) => item.id === 'penitencial-externa').outingType, 'Procesión penitencial')
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

test('resume las Glorias por tipo de procesión sin duplicar variantes técnicas', () => {
  const summary = summarizeGloryTypes([
    { outingType: 'Procesión de gloria' },
    { outingType: 'procesion_gloria' },
    { outingType: 'Gloria' },
    { outingType: 'Procesión eucarística' },
    { outingType: 'Procesión extraordinaria' },
    { outingType: 'romeria' },
  ])

  assert.deepEqual(summary, [
    { type: 'Procesión de gloria', label: 'Procesiones de gloria', count: 3 },
    { type: 'Procesión eucarística', label: 'Procesiones eucarísticas', count: 1 },
    { type: 'Procesión extraordinaria', label: 'Procesiones extraordinarias', count: 1 },
    { type: 'Romería', label: 'Romerías', count: 1 },
  ])
})
