import test from 'node:test'
import assert from 'node:assert/strict'
import {
  featuredBrotherhoodOuting,
  otherBrotherhoodOutings,
  outingRouteStops,
  splitRouteStreets,
  outingDateParts,
} from '../lib/brotherhood-featured-outing.js'

const salidas = [
  { id: 'serie', serieId: 'serie', estado: 'recurring', nombre: 'Procesión anual' },
  { id: 'mayo', slug: '', fecha: '2026-05-10', estado: 'announced' },
  { id: 'nov', slug: 'gloria-2026', fecha: '2026-11-08', serieId: 'serie', estado: 'announced' },
]

test('destaca la próxima salida concreta y, si no hay, la última celebrada', () => {
  assert.equal(featuredBrotherhoodOuting(salidas, '2026-11-05').id, 'nov')
  assert.equal(featuredBrotherhoodOuting(salidas, '2026-04-01').id, 'mayo')
  assert.equal(featuredBrotherhoodOuting(salidas, '2026-12-01').id, 'nov')
  assert.equal(featuredBrotherhoodOuting([{ id: 'serie', estado: 'recurring' }], '2026-11-05'), null)
  const withSacramental = [
    { id: 'sac', tipo: 'Procesión sacramental', fecha: '2027-05-30', estado: 'announced' },
    { id: 'glo', tipo: 'Procesión de Gloria', fecha: '2026-11-08', estado: 'announced' },
  ]
  assert.equal(featuredBrotherhoodOuting(withSacramental, '2026-12-01').id, 'glo')
})

test('las otras salidas no repiten la destacada ni su serie anual', () => {
  const featured = featuredBrotherhoodOuting(salidas, '2026-11-05')
  assert.deepEqual(otherBrotherhoodOutings(salidas, featured).map((s) => s.id), ['mayo'])
  assert.equal(otherBrotherhoodOutings(salidas, null).length, 3)
})

test('el recorrido separa los templos de salida y entrada de las calles', () => {
  const route = outingRouteStops(
    'Real Parroquia de Omnium Sanctorum → Peris Mencheta → Plaza de la Mata → Feria → Real Parroquia de Omnium Sanctorum.',
    { origin: 'Real Parroquia de Omnium Sanctorum', destination: 'Real Parroquia de Omnium Sanctorum' },
  )
  assert.equal(route.origin, 'Real Parroquia de Omnium Sanctorum')
  assert.deepEqual(route.streets, ['Peris Mencheta', 'Plaza de la Mata', 'Feria'])
  assert.deepEqual(outingRouteStops('Feligresía por determinar').streets, [])
})

test('los recorridos largos pliegan el tramo central', () => {
  const streets = Array.from({ length: 25 }, (_, i) => `Calle ${i + 1}`)
  const split = splitRouteStreets(streets)
  assert.equal(split.head.length, 4)
  assert.equal(split.tail.length, 3)
  assert.equal(split.hidden.length, 18)
  assert.deepEqual(splitRouteStreets(streets.slice(0, 9)).hidden, [])
})

test('fecha en piezas sin depender de la zona horaria', () => {
  assert.deepEqual(outingDateParts('2026-11-08'), { weekday: 'dom', day: '8', month: 'nov', year: '2026' })
  assert.equal(outingDateParts(''), null)
})

test('el título de la tarjeta no repite la Hermandad ni el año', async () => {
  const { outingCardTitle } = await import('../lib/brotherhood-featured-outing.js')
  assert.equal(outingCardTitle('Salida procesional de Nuestra Señora Reina de Todos los Santos 2026', { names: ['Reina de Todos los Santos', 'Nuestra Señora Reina de Todos los Santos'] }), 'Procesión de Gloria')
  assert.equal(outingCardTitle('Solemne Procesión de Alabanzas de la Coronación Canónica de Nuestra Señora del Amparo', { names: ['El Amparo', 'Nuestra Señora del Amparo'] }), 'Solemne Procesión de Alabanzas de la Coronación Canónica')
  assert.equal(outingCardTitle('Procesión de la Pura y Limpia del Postigo 2026', { names: ['Pura y Limpia del Postigo'] }), 'Procesión de Gloria')
  assert.equal(outingCardTitle(''), 'Procesión de Gloria')
})

test('el tramo de cada banda se sitúa sobre el recorrido', async () => {
  const { bandSegments } = await import('../lib/brotherhood-featured-outing.js')
  const route = { origin: 'Real Parroquia de Santa María Magdalena', streets: ['Cristo del Calvario', 'San Pablo', 'Rioja', 'Tetuán', 'Granada', 'Plaza de San Francisco', 'Granada', 'Cristo del Calvario'], destination: 'Real Parroquia de Santa María Magdalena' }
  const music = [
    { id: 'c', name: 'Las Cigarreras', segmentStart: 'Real Parroquia de Santa María Magdalena', segmentEnd: 'Ayuntamiento de Sevilla · Plaza de San Francisco' },
    { id: 's', name: 'Carmen de Salteras' },
    { id: 'x', name: 'Desconocida', segmentStart: 'Calle inexistente', segmentEnd: 'Otra' },
  ]
  assert.deepEqual(bandSegments(music, route).map(({ id, start, end }) => ({ id, start, end })), [{ id: 'c', start: 0, end: 6 }])
})

test('un rosario vespertino puede ser la salida destacada; un traslado, no', async () => {
  const { featuredBrotherhoodOuting } = await import('../lib/brotherhood-featured-outing.js')
  const salidas = [
    { id: 't', fecha: '2026-11-01', tipo: 'Traslado' },
    { id: 'r', fecha: '2026-11-07', tipo: 'Rosario Vespertino' },
  ]
  assert.equal(featuredBrotherhoodOuting(salidas, '2026-11-07').id, 'r')
  assert.equal(featuredBrotherhoodOuting([salidas[0]], '2026-11-07'), null)
})

test('el calendario de un rosario usa su ancla de rosarios', async () => {
  const { readFileSync } = await import('node:fs')
  const actions = readFileSync(new URL('../lib/outing-actions.js', import.meta.url), 'utf8')
  assert.match(actions, /\/rosario\/i\.test\(String\(outing\.outingType \|\| ''\)\) \? 'rosaries' : 'processions'/)
})
