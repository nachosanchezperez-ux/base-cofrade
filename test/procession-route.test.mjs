import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { buildProcessionRoute, routeSummarySections } from '../lib/procession-route.js'

test('detecta salida y entrada en el mismo lugar y separa ida y regreso', () => {
  const route = buildProcessionRoute({
    origin: 'Iglesia de San Benito Abad',
    destination: 'Iglesia de San Benito Abad',
    routeSummary: 'Ida: Cristo de la Vera Cruz, 28 de Febrero, La Lonja, Plaza Fernández Velasco. Regreso: Plaza Fernández Velasco, La Lonja, Cristo de la Vera-Cruz y entrada en San Benito.',
    schedule: [
      { label: 'Entronización', time: '18:30', place: 'Plaza Fernández Velasco' },
    ],
    music: [
      { name: 'Banda de Música Municipal de Gerena', start: 'Iglesia de San Benito Abad', end: 'Plaza Fernández Velasco' },
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
})

test('reconoce Vuelta y separadores con flecha en recorridos heredados', () => {
  const sections = routeSummarySections(
    'Ida: Capilla de San Andrés → Orfila → Cuna → Plaza del Salvador. Vuelta: Plaza del Salvador → Cuna → Orfila → Capilla de San Andrés.'
  )

  assert.equal(sections.length, 2)
  assert.equal(sections[0].id, 'outbound')
  assert.equal(sections[0].label, 'Ida')
  assert.deepEqual(sections[0].points, ['Capilla de San Andrés', 'Orfila', 'Cuna', 'Plaza del Salvador'])
  assert.equal(sections[1].id, 'return')
  assert.equal(sections[1].label, 'Vuelta')
  assert.deepEqual(sections[1].points, ['Plaza del Salvador', 'Cuna', 'Orfila', 'Capilla de San Andrés'])
})

test('reconoce mañana, tarde y calificadores de fecha como tramos', () => {
  const sections = routeSummarySections(
    'Mañana: Capilla, Ayuntamiento, Parroquia. Por la tarde: Parroquia, Real, Capilla.'
  )
  const dated = routeSummarySections(
    'Ida (20 de septiembre): Plaza A, Calle B, Templo C. Regreso (27 de septiembre): Templo C, Calle D, Plaza A.'
  )

  assert.deepEqual(sections.map((section) => section.label), ['Mañana', 'Por la tarde'])
  assert.deepEqual(sections.map((section) => section.points.length), [3, 3])
  assert.deepEqual(dated.map((section) => section.label), ['Ida · 20 de septiembre', 'Regreso · 27 de septiembre'])
})

test('un circuito estructurado de un solo tramo termina visualmente como entrada', () => {
  const route = buildProcessionRoute({
    origin: 'Plaza Constitución',
    destination: 'Plaza Constitución',
    route: {
      itineraries: [
        {
          id: 'route',
          label: 'Recorrido',
          points: [
            { label: 'Plaza Constitución' },
            { label: 'José Payán' },
            { label: 'Plaza Constitución' },
          ],
        },
      ],
    },
  })
  const component = readFileSync(new URL('../components/ProcessionRoute.js', import.meta.url), 'utf8')

  assert.equal(route.kind, 'circuit')
  assert.equal(route.legs.length, 1)
  assert.match(component, /isSingleLegCircuitEntry/)
  assert.match(component, /visualRole = isSingleLegCircuitEntry \? 'end' : point\.role/)
  assert.match(component, /if \(circuit \|\| legId === 'return'\) return 'Entrada'/)
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

test('filtra música y conserva hitos de horario dentro del recorrido', () => {
  const route = buildProcessionRoute({
    origin: 'Templo A',
    destination: 'Templo B',
    route: {
      legs: [
        {
          id: 'outbound',
          label: 'Ida',
          points: [
            { label: 'Templo A' },
            {
              label: 'Plaza Mayor',
              annotations: [
                { type: 'music', label: 'Banda X' },
                { type: 'note', label: 'Petalá' },
              ],
            },
            { label: 'Templo B' },
          ],
        },
      ],
    },
    schedule: [
      { label: 'Rezo', time: '20:15', place: 'Plaza Mayor' },
    ],
  })

  const plaza = route.legs[0].points.find((point) => point.label === 'Plaza Mayor')
  assert.deepEqual(plaza.annotations, [
    { type: 'note', label: 'Petalá' },
    { type: 'schedule', label: 'Rezo', time: '20:15' },
  ])

  const component = readFileSync(new URL('../components/ProcessionRoute.js', import.meta.url), 'utf8')
  assert.match(component, /point\.annotations\?\.length/)
  assert.match(component, /annotation\.time/)
  assert.match(component, /annotation\.label/)
})

test('expone fases de una jornada compleja sin mezclarlas con las calles', () => {
  const route = buildProcessionRoute({
    route: {
      phases: [
        {
          id: 'manana',
          eyebrow: 'Mañana',
          title: 'Rosario de ida',
          time: '07:00 → 10:00',
          places: ['Templo A', 'Templo B'],
          summary: 'Rosario hasta el templo de destino.',
        },
        {
          id: 'tarde',
          eyebrow: 'Tarde',
          title: 'Traslado de regreso',
          time: '17:30 → 22:15',
          places: ['Templo B', 'Templo A'],
        },
      ],
    },
  })

  assert.equal(route.phases.length, 2)
  assert.equal(route.phases[0].title, 'Rosario de ida')
  assert.equal(route.phases[1].time, '17:30 → 22:15')
  assert.equal(route.source, 'phases')
})

test('conserva el texto como fallback cuando no existe un itinerario separable', () => {
  const route = buildProcessionRoute({
    routeSummary: 'Procesión por las calles de Montellano.',
  })

  assert.equal(route.legs.length, 0)
  assert.equal(route.summary, 'Procesión por las calles de Montellano.')
  assert.equal(route.source, 'summary')
})
