import assert from 'node:assert/strict'
import test from 'node:test'
import { buildProcessionRoute } from '../lib/procession-route.js'

test('detecta salida y entrada en el mismo lugar y separa ida y regreso', () => {
  const route = buildProcessionRoute({
    origin: 'Iglesia de San Benito Abad',
    destination: 'Iglesia de San Benito Abad',
    routeSummary: 'Ida: Cristo de la Vera Cruz, 28 de Febrero, La Lonja, Plaza Fernández Velasco. Regreso: Plaza Fernández Velasco, La Lonja, Cristo de la Vera-Cruz y entrada en San Benito.',
    schedule: [
      { label: 'Entronización', time: '18:30', place: 'Plaza Fernández Velasco' },
    ],
  })

  assert.equal(route.kind, 'circuit')
  assert.equal(route.circuit, true)
  assert.equal(route.baseLocation, 'Iglesia de San Benito Abad')
  assert.equal(route.legs.length, 2)
  assert.equal(route.legs[0].label, 'Ida')
  assert.equal(route.legs[1].label, 'Regreso')
  assert.equal(route.legs[0].points[0].label, 'Iglesia de San Benito Abad')
  assert.equal(route.legs[0].points.at(-1).label, 'Plaza Fernández Velasco')
  assert.equal(route.legs[0].points.at(-1).role, 'turnaround')
  assert.equal(route.legs[1].points[0].label, 'Plaza Fernández Velasco')
  assert.equal(route.legs[1].points.at(-1).label, 'Iglesia de San Benito Abad')
  assert.equal(route.legs[1].points.at(-1).role, 'end')
  assert.deepEqual(
    route.legs[0].points.at(-1).annotations,
    [{ type: 'schedule', label: 'Entronización', time: '18:30' }]
  )
})

test('mantiene origen y destino separados cuando la extraordinaria es un traslado', () => {
  const route = buildProcessionRoute({
    origin: 'Parroquia de Nuestra Señora de los Dolores',
    destination: 'Parroquia de San Lucas Evangelista',
    routeSummary: 'Ida: Afán de Ribera, Julián de Ávila y Parroquia de San Lucas Evangelista. Regreso: Parroquia de San Lucas Evangelista, Calandria, Juan XXIII y Parroquia de Nuestra Señora de los Dolores.',
  })

  assert.equal(route.kind, 'transfer')
  assert.equal(route.circuit, false)
  assert.equal(route.legs.length, 2)
  assert.equal(route.legs[0].points[0].label, 'Parroquia de Nuestra Señora de los Dolores')
  assert.equal(route.legs[0].points.at(-1).label, 'Parroquia de San Lucas Evangelista')
  assert.equal(route.legs[1].points[0].label, 'Parroquia de San Lucas Evangelista')
  assert.equal(route.legs[1].points.at(-1).label, 'Parroquia de Nuestra Señora de los Dolores')
})

test('conserva el texto como fallback cuando no existe un itinerario separable', () => {
  const route = buildProcessionRoute({
    routeSummary: 'Procesión por las calles de Montellano.',
  })

  assert.equal(route.legs.length, 0)
  assert.equal(route.summary, 'Procesión por las calles de Montellano.')
  assert.equal(route.source, 'summary')
})
