import assert from 'node:assert/strict'
import test from 'node:test'
import {
  formatOutingType,
  groupGloryAccompaniments,
  partitionAccompanimentsBySeason,
  presentAccompanimentLocation,
  presentAccompanimentStep,
  resolveAccompanimentLocation,
  sortGloryAccompaniments,
  sortHolyWeekAccompaniments,
  splitCurrentAccompaniments,
  summarizeGloryTypes,
} from '../lib/bands/accompaniments.js'

test('separa el tipo y la identidad del paso sin alterar el nombre canónico', () => {
  const cases = [
    ['Tras el paso de misterio', 'Paso de misterio de Nuestro Padre Jesús del Soberano Poder en su Prendimiento', 'Paso de misterio', 'Nuestro Padre Jesús del Soberano Poder en su Prendimiento'],
    ['Tras el paso de misterio', 'Paso de misterio del Sagrado Decreto de la Santísima Trinidad', 'Paso de misterio', 'Sagrado Decreto de la Santísima Trinidad'],
    ['Tras el paso de palio', 'Paso de palio de María Santísima de la Victoria', 'Paso de palio', 'María Santísima de la Victoria'],
    ['Tras el paso de palio', 'Paso de palio del Dulce Nombre de María', 'Paso de palio', 'Dulce Nombre de María'],
  ]

  cases.forEach(([position, stepName, type, name]) => {
    const item = { position, stepName }
    const before = structuredClone(item)

    assert.deepEqual(presentAccompanimentStep(item), { type, name, position: '' })
    assert.deepEqual(item, before)
  })
})

test('reconoce Cristo y Virgen solo cuando la posición lo documenta de forma inequívoca', () => {
  assert.deepEqual(presentAccompanimentStep({
    position: 'Tras el paso del Cristo',
    stepName: 'Santísimo Cristo de la Salud',
  }), {
    type: 'Paso de Cristo',
    name: 'Santísimo Cristo de la Salud',
    position: '',
  })

  assert.deepEqual(presentAccompanimentStep({
    position: 'Tras el paso de la Virgen',
    stepName: 'María Santísima Madre de los Desamparados',
  }), {
    type: 'Paso de Virgen',
    name: 'María Santísima Madre de los Desamparados',
    position: '',
  })
})

test('conserva el contexto de la posición después de separar el tipo de paso', () => {
  assert.deepEqual(presentAccompanimentStep({
    position: 'Tras el paso de misterio · tramo de vuelta',
    stepName: 'Paso de misterio de Nuestro Padre Jesús Nazareno',
  }), {
    type: 'Paso de misterio',
    name: 'Nuestro Padre Jesús Nazareno',
    position: 'tramo de vuelta',
  })
})

test('si el tipo no puede determinarse no lo inventa ni añade una categoría genérica', () => {
  assert.deepEqual(presentAccompanimentStep({
    position: 'Cruz de guía',
    stepName: 'Santísimo Cristo de la Caridad',
  }), {
    type: '',
    name: 'Santísimo Cristo de la Caridad',
    position: '',
  })
  assert.deepEqual(presentAccompanimentStep({}), { type: '', name: '', position: '' })
})

test('si no existe paso documentado conserva la posición musical disponible', () => {
  assert.deepEqual(presentAccompanimentStep({
    position: 'Tras el paso del Cristo de la Salud',
  }), {
    type: '',
    name: '',
    position: 'Tras el paso del Cristo de la Salud',
  })
})

test('presenta una sola localidad sin duplicar Sevilla capital', () => {
  assert.equal(presentAccompanimentLocation({ municipality: 'Sevilla', municipalitySlug: 'sevilla', province: 'Sevilla' }), 'Sevilla')
  assert.equal(presentAccompanimentLocation({ municipality: 'Cantillana', province: 'Sevilla' }), 'Cantillana')
  assert.equal(presentAccompanimentLocation({ municipality: 'Marchena', province: 'Sevilla' }), 'Marchena')
})

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
