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
  { id: 'mayo', slug: 'sacramental-2026', fecha: '2026-05-10', estado: 'announced' },
  { id: 'nov', slug: 'gloria-2026', fecha: '2026-11-08', serieId: 'serie', estado: 'announced' },
]

test('destaca la próxima salida concreta y, si no hay, la última celebrada', () => {
  assert.equal(featuredBrotherhoodOuting(salidas, '2026-11-05').id, 'nov')
  assert.equal(featuredBrotherhoodOuting(salidas, '2026-04-01').id, 'mayo')
  assert.equal(featuredBrotherhoodOuting(salidas, '2026-12-01').id, 'nov')
  assert.equal(featuredBrotherhoodOuting([{ id: 'serie', estado: 'recurring' }], '2026-11-05'), null)
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
