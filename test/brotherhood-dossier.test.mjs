import test from 'node:test'
import assert from 'node:assert/strict'
import {
  creditsByDiscipline,
  dossierChronology,
  dossierHeritageGroups,
  dossierDayLabel,
  dossierHref,
  dossierJourneyOutings,
  dossierKeyFacts,
  heritageFamilyKey,
  imageFacts,
  pieceFacts,
  usesBrotherhoodDossier,
} from '../lib/brotherhood-dossier.js'

const AMPARO = 'fc0942dd-d555-43b2-9495-399daba54903'

test('el dosier es un piloto por ID con su propia ruta', () => {
  assert.equal(usesBrotherhoodDossier(AMPARO), true)
  assert.equal(usesBrotherhoodDossier('00000000-0000-0000-0000-000000000000'), false)
  assert.equal(dossierHref('amparo-sevilla'), '/hermandades/amparo-sevilla/dosier')
  assert.equal(dossierHref(''), '')
})

test('el patrimonio se agrupa por familias y la música queda fuera', () => {
  const patrimonio = [
    { id: 'simpecado', nombre: 'Simpecado de Gala', tipo: 'Simpecado', orden: 2 },
    { id: 'manto', nombre: 'Manto procesional', tipo: 'Manto procesional', orden: 3, destacado: true },
    { id: 'saya', nombre: 'Saya de tisú', tipo: 'Saya', orden: 1 },
    { id: 'coronas', nombre: 'Coronas históricas', tipo: 'Coronas', orden: 1 },
    { id: 'alabado', nombre: 'Alabado', tipo: 'Alabado' },
    { id: 'misa', nombre: 'Missa Refugium Peccatorum', tipo: 'Misa' },
    { id: 'cuadro', nombre: 'Lienzo de la Virgen', tipo: 'Pintura' },
  ]
  const groups = dossierHeritageGroups(patrimonio, { excludeIds: ['coronas'] })
  assert.deepEqual(groups.map((group) => group.key), ['mantos', 'insignias', 'otras'])
  // Lo destacado primero dentro de su familia.
  assert.deepEqual(groups[0].items.map((item) => item.id), ['manto', 'saya'])
  assert.equal(groups.flatMap((group) => group.items).some((item) => ['alabado', 'misa', 'coronas'].includes(item.id)), false)
  assert.equal(heritageFamilyKey({ tipo: 'Coronas', nombre: 'Coronas históricas' }), 'orfebreria')
  assert.equal(heritageFamilyKey({ tipo: 'Corazón alado', nombre: 'Corazón alado de Nuestra Señora del Amparo' }), 'orfebreria')
  assert.equal(heritageFamilyKey({ tipo: 'Saya', nombre: 'Saya' }), 'mantos')
})

test('las autorías se agrupan por disciplina sin repetir nombres', () => {
  assert.deepEqual(creditsByDiscipline([
    { nombre: 'Emilio José Gómez Moreno', disciplina: 'Bordado' },
    { nombre: 'Manuel María Ariza', disciplina: 'Bordado' },
    { nombre: 'Emilio José Gómez Moreno', disciplina: 'Bordado' },
    { nombre: 'Joaquín Ossorio', disciplina: 'Orfebrería', rol: 'Orfebrería' },
    { nombre: '', disciplina: 'Pintura' },
    { nombre: 'Manuel María Ariza', disciplina: 'Bordado', rol: 'Autoría original' },
  ]), [
    { label: 'Bordado', value: 'Emilio José Gómez Moreno, Manuel María Ariza' },
    { label: 'Orfebrería', value: 'Joaquín Ossorio' },
    { label: 'Bordado (autoría original)', value: 'Manuel María Ariza' },
  ])
})

test('las fichas solo muestran los datos que existen', () => {
  assert.deepEqual(pieceFacts({ fecha: '1851', materiales: 'Oro sobre terciopelo', tecnica: '', agentes: [] }), [
    { label: 'Fecha', value: '1851' },
    { label: 'Materiales', value: 'Oro sobre terciopelo' },
  ])
  assert.deepEqual(imageFacts({ autor: 'Roque de Balduque (atribuida)', fecha: 'Siglo XVI', material: 'Madera' }).map((fact) => fact.label), ['Autoría', 'Fecha', 'Material'])
})

test('la cronología va de lo antiguo a lo reciente y marca lo anunciado', () => {
  const items = dossierChronology([
    { id: 'c', fecha: '2026', titulo: 'Coronación Canónica' },
    { id: 'a', fecha: '1735', titulo: 'Fundación' },
    { id: 'b', fecha: '1755', titulo: 'Terremoto de Lisboa' },
    { id: 'x', fecha: '', titulo: '' },
    { id: 'f', fecha: '2027', titulo: 'Futuro' },
  ], '2026-11-07')
  assert.deepEqual(items.map((item) => item.id), ['a', 'b', 'c', 'f'])
  assert.deepEqual(items.map((item) => item.upcoming), [false, false, false, true])
})

test('los datos clave reúnen la jornada en pocas líneas', () => {
  const facts = dossierKeyFacts({
    brotherhood: { nombreOficial: 'Real, Venerable e Ilustre Hermandad de Nuestra Señora del Amparo', sede: 'Real Parroquia de Santa María Magdalena', fundacion: '1735' },
    image: { nombre: 'Nuestra Señora del Amparo', autor: 'Roque de Balduque', fecha: 'Siglo XVI' },
    step: { capatazActual: 'Ismael Vargas' },
    outing: { departureTime: '17:00', returnTime: '22:45', music: [{ name: 'Las Cigarreras', context: 'Abriendo el cortejo' }, { name: 'Carmen de Salteras', context: 'Tras el paso' }] },
    occasion: { name: 'Coronación Canónica', timeText: '10:00 · Función Principal de Instituto', place: 'Real Parroquia de Santa María Magdalena' },
  })
  const byLabel = Object.fromEntries(facts.map((fact) => [fact.label, fact.value]))
  assert.equal(byLabel['Procesión'], 'Salida 17:00 · entrada 22:45')
  assert.equal(byLabel['Capataz'], 'Ismael Vargas')
  assert.equal(byLabel['Música'], 'Las Cigarreras · Abriendo el cortejo · Carmen de Salteras · Tras el paso')
  assert.equal(byLabel['Coronación Canónica'], '10:00 · Función Principal de Instituto · Real Parroquia de Santa María Magdalena')
  assert.equal(dossierKeyFacts({}).length, 0)
})

test('si la procesión se aplaza, la jornada y la procesión llevan su fecha', () => {
  assert.equal(dossierDayLabel('2026-11-15'), 'Domingo 15 de noviembre')
  assert.equal(dossierDayLabel('mañana'), '')
  const facts = Object.fromEntries(dossierKeyFacts({
    outing: { date: '2026-11-15', departureTime: '17:00', returnTime: '22:45' },
    occasion: { name: 'Coronación Canónica', date: '2026-11-08', time: '10:00', place: 'Magdalena' },
  }).map((fact) => [fact.label, fact.value]))
  assert.match(facts['Procesión'], /^Domingo 15 de noviembre · Salida 17:00 · entrada 22:45$/)
  assert.match(facts['Coronación Canónica'], /^Domingo 8 de noviembre · 10:00 · Magdalena$/)
  const sameDay = Object.fromEntries(dossierKeyFacts({
    outing: { date: '2026-11-08', departureTime: '17:00' },
    occasion: { name: 'Coronación Canónica', date: '2026-11-08', time: '10:00' },
  }).map((fact) => [fact.label, fact.value]))
  assert.equal(sameDay['Procesión'], 'Salida 17:00')
})

test('San Esteban entra en el dosier y su jornada reúne traslado y procesión', () => {
  assert.equal(usesBrotherhoodDossier('36b4d5c1-f7bb-4025-a09a-948e0d5d188f'), true)
  const traslado = { id: 't', fecha: '2026-11-21', estado: 'announced' }
  const procesion = { id: 'p', fecha: '2026-11-22', estado: 'announced' }
  const lejana = { id: 'l', fecha: '2027-03-30', estado: 'announced' }
  const suspendida = { id: 's', fecha: '2026-11-23', estado: 'cancelled' }
  assert.deepEqual(dossierJourneyOutings(traslado, [procesion, lejana, traslado, suspendida]).map((item) => item.id), ['t', 'p'])
  assert.deepEqual(dossierJourneyOutings(null, [procesion]), [])
  const facts = dossierKeyFacts({
    outings: [
      { date: '2026-11-21', outingType: 'Traslado', departureTime: '11:00' },
      { date: '2026-11-22', outingType: 'Procesión', departureTime: '16:00', music: [{ name: 'Virgen de los Reyes', context: 'Tras el paso' }] },
    ],
  }).map((fact) => [fact.label, fact.value])
  assert.deepEqual(facts, [
    ['Traslado', 'Sábado 21 de noviembre · Salida 11:00'],
    ['Procesión', 'Domingo 22 de noviembre · Salida 16:00'],
    ['Música', 'Virgen de los Reyes · Tras el paso'],
  ])
})
