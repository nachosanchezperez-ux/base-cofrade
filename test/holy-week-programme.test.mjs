import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import {
  PROGRAMME_BROTHERHOOD_SLUGS,
  PROGRAMME_DAYS,
  accentColor,
  brotherhoodInSentence,
  dayPositions,
  initialDayId,
  isHolyWeekStep,
  orderSteps,
  positionMove,
  routeLegs,
  routePoints,
  sortDayItems,
  stepTitle,
} from '../lib/holy-week-programme.js'

const day = (id) => PROGRAMME_DAYS.find((item) => item.id === id)

test('el programa cubre las once jornadas, de Viernes de Dolores a Resurrección', () => {
  assert.deepEqual(PROGRAMME_DAYS.map((item) => item.id), [
    'viernes-de-dolores', 'sabado-de-pasion', 'domingo-de-ramos', 'lunes-santo', 'martes-santo',
    'miercoles-santo', 'jueves-santo', 'madrugada', 'viernes-santo', 'sabado-santo', 'domingo-de-resurreccion',
  ])
  assert.ok(PROGRAMME_BROTHERHOOD_SLUGS.length >= 70)
})

test('Miércoles Santo 2027 sigue el orden aprobado por el Consejo', () => {
  assert.deepEqual(day('miercoles-santo').entries.map((entry) => entry.slug), [
    'carmen-doloroso', 'hermandad-de-la-sed', 'hermandad-de-san-bernardo', 'hermandad-buen-fin-sevilla',
    'hermandad-sagrada-lanzada', 'siete-palabras-sevilla', 'cristo-de-burgos', 'el-baratillo', 'hermandad-de-los-panaderos',
  ])
  // El Baratillo pasa del sexto al octavo puesto.
  const baratillo = day('miercoles-santo').entries[7]
  assert.equal(positionMove(day('miercoles-santo'), baratillo, 8), -2)
})

test('la Borriquita abre y el Amor cierra el Domingo de Ramos, con pasos repartidos', () => {
  const entries = day('domingo-de-ramos').entries
  assert.equal(entries[0].label, 'La Borriquita')
  assert.deepEqual(entries[0].steps, ['paso-sagrada-entrada-jerusalen-amor'])
  assert.equal(entries.at(-1).slug, 'hermandad-del-amor')
  assert.deepEqual(entries.at(-1).withoutSteps, ['paso-sagrada-entrada-jerusalen-amor'])
})

test('las vísperas se ordenan por hora de salida y sin hora van al final sin número', () => {
  const vd = day('viernes-de-dolores')
  const items = vd.entries.map((entry) => ({ name: entry.slug, departure: entry.times?.[0] || '' }))
  const sorted = sortDayItems(vd, items)
  assert.equal(sorted[0].name, 'bendicion-y-esperanza')
  assert.equal(sorted.at(-1).name, 'paz-y-misericordia-sevilla')
  assert.equal(dayPositions(vd, sorted).at(-1), null)
  assert.equal(dayPositions(vd, sorted)[0], 1)
})

test('una jornada pendiente va por orden alfabético y sin números ni flechas', () => {
  const lunes = day('lunes-santo')
  const sorted = sortDayItems(lunes, [{ name: 'San Pablo' }, { name: 'Las Aguas' }, { name: 'El Museo' }])
  assert.deepEqual(sorted.map((item) => item.name), ['Las Aguas', 'El Museo', 'San Pablo'])
  assert.deepEqual(dayPositions(lunes, sorted), [null, null, null])
})

test('el Martes Santo muestra el orden de 2026 numerado pero sin flechas de cambio', () => {
  const martes = day('martes-santo')
  assert.equal(martes.status, 'reference2026')
  assert.equal(positionMove(martes, { prev: 3 }, 1), 0)
})

test('los pasos de gloria no entran en el cortejo de Semana Santa', () => {
  assert.equal(isHolyWeekStep('Paso procesional de Gloria'), false)
  assert.equal(isHolyWeekStep('Custodia'), false)
  assert.equal(isHolyWeekStep('Paso procesional eucarístico'), false)
  assert.equal(isHolyWeekStep('Palio'), true)
  assert.equal(isHolyWeekStep(''), true)
})

test('el Cristo o el misterio van delante del palio, con orden propio en las de tres pasos', () => {
  const generic = orderSteps([
    { slug: 'palio', name: 'Paso de palio de X', type: 'Palio' },
    { slug: 'cristo', name: 'Paso del Cristo', type: 'Cristo' },
  ])
  assert.deepEqual(generic.map((step) => step.slug), ['cristo', 'palio'])

  const sanBenito = orderSteps([
    { slug: 'paso-del-cristo-de-la-sangre', name: 'Paso del Santísimo Cristo de la Sangre', type: 'Cristo' },
    { slug: 'paso-de-palio-de-nuestra-senora-de-la-encarnacion-coronada', name: 'Paso de palio', type: 'Palio' },
    { slug: 'paso-de-misterio-de-la-sagrada-presentacion-de-jesus-al-pueblo', name: 'Paso de misterio', type: 'Misterio' },
  ], 'san-benito')
  assert.deepEqual(sanBenito.map((step) => step.slug), [
    'paso-de-misterio-de-la-sagrada-presentacion-de-jesus-al-pueblo',
    'paso-del-cristo-de-la-sangre',
    'paso-de-palio-de-nuestra-senora-de-la-encarnacion-coronada',
  ])
})

test('los títulos de paso se acortan para el móvil', () => {
  assert.equal(stepTitle('Paso de palio de María Santísima de la Caridad en su Soledad'), 'Palio · María Stma. de la Caridad en su Soledad')
  assert.equal(stepTitle('Paso de misterio del Santísimo Cristo del Buen Fin'), 'Misterio · Stmo. Cristo del Buen Fin')
  assert.equal(stepTitle('Paso del Santísimo Cristo de la Salud'), 'Stmo. Cristo de la Salud')
})

test('el recorrido se divide en ida, Carrera Oficial y vuelta', () => {
  const points = routePoints('Orfila → Plaza del Duque → Carrera Oficial → Catedral → Francos → Cuna → Orfila')
  const legs = routeLegs(points)
  assert.deepEqual(legs.map((leg) => leg.id), ['ida', 'carrera', 'vuelta'])
  assert.deepEqual(legs[0].points, ['Orfila', 'Plaza del Duque'])
  assert.deepEqual(legs[2].points, ['Francos', 'Cuna', 'Orfila'])
})

test('itinerarios con comas y «y» final, y resúmenes que no son calles', () => {
  assert.deepEqual(routePoints('San Vicente, Alcoy, Duque, Carrera Oficial, Gravina, Museo y San Vicente.').slice(-2), ['Museo', 'San Vicente'])
  assert.deepEqual(routePoints('Itinerario oficial del Viernes Santo de 2026 con tránsito por la Carrera Oficial.'), [])
  const barrio = routeLegs(routePoints('Guadalajara · Soria · Logroño · Palencia'))
  assert.deepEqual(barrio.map((leg) => leg.id), ['barrio'])
})

test('la Hermandad lleva su artículo dentro de la frase', () => {
  assert.equal(brotherhoodInSentence('El Baratillo', 'El Baratillo'), 'el Baratillo')
  assert.equal(brotherhoodInSentence('Gran Poder', 'Hermandad del Gran Poder'), 'la Hermandad del Gran Poder')
  assert.equal(brotherhoodInSentence('Cristo de Burgos', 'Cristo de Burgos'), 'la Hermandad de Cristo de Burgos')
})

test('los colores claros pasan a azul marino para mantener el contraste', () => {
  assert.equal(accentColor('#FFFFFF'), '#112339')
  assert.equal(accentColor('#D8C8A8'), '#112339')
  assert.equal(accentColor('#234a78'), '#234A78')
  assert.equal(accentColor(''), '#112339')
})

test('la jornada inicial es la de hoy o la siguiente', () => {
  assert.equal(initialDayId(PROGRAMME_DAYS, new Date('2026-11-07T10:00:00Z')), 'viernes-de-dolores')
  assert.equal(initialDayId(PROGRAMME_DAYS, new Date('2027-03-24T10:00:00Z')), 'miercoles-santo')
  assert.equal(initialDayId(PROGRAMME_DAYS, new Date('2027-04-10T10:00:00Z')), 'domingo-de-resurreccion')
})

test('la página reutiliza «Mis hermandades» y cita al Consejo como fuente', () => {
  const component = readFileSync(new URL('../components/HolyWeekProgramme.js', import.meta.url), 'utf8')
  const page = readFileSync(new URL('../app/semana-santa-sevilla-2027/page.js', import.meta.url), 'utf8')
  assert.match(component, /followed-brotherhoods/)
  assert.match(page, /consejoOrden2027/)
  assert.match(page, /canonical: PROGRAMME_PATH/)
})

test('Siete Palabras y el Cerro: Nazareno, misterio y palio', async () => {
  const { orderSteps } = await import('../lib/holy-week-programme.js')
  const siete = orderSteps([
    { slug: 'paso-palio-nuestra-senora-cabeza-siete-palabras', name: 'Paso de palio', type: 'Palio' },
    { slug: 'paso-misterio-santisimo-cristo-siete-palabras', name: 'Paso de misterio', type: 'Misterio' },
    { slug: 'paso-divina-misericordia-siete-palabras', name: 'Paso de N. P. Jesús', type: 'Nazareno' },
  ], 'siete-palabras-sevilla')
  assert.deepEqual(siete.map((step) => step.slug), ['paso-divina-misericordia-siete-palabras', 'paso-misterio-santisimo-cristo-siete-palabras', 'paso-palio-nuestra-senora-cabeza-siete-palabras'])
  const cerro = orderSteps([
    { slug: 'paso-misterio-desamparo-abandono-cerro-aguila', name: 'Paso de misterio', type: 'Misterio' },
    { slug: 'paso-palio-dolores-cerro-aguila', name: 'Paso de palio', type: 'Palio' },
    { slug: 'paso-humildad-cerro-aguila', name: 'Paso de N. P. Jesús', type: 'Nazareno' },
  ], 'hermandad-cerro-del-aguila-sevilla')
  assert.deepEqual(cerro.map((step) => step.slug), ['paso-humildad-cerro-aguila', 'paso-misterio-desamparo-abandono-cerro-aguila', 'paso-palio-dolores-cerro-aguila'])
})

test('el palio de la Sed: la Oliva en la ida y Mairena en el regreso', async () => {
  const { bandSegment, orderBandsBySegment } = await import('../lib/holy-week-programme.js')
  assert.equal(bandSegment('hermandad-de-la-sed', 'banda-musica-oliva-salteras'), 'Ida')
  assert.equal(bandSegment('hermandad-de-la-sed', 'banda-municipal-musica-mairena-del-alcor'), 'Regreso')
  const ordered = orderBandsBySegment([{ slug: 'm', segment: 'Regreso' }, { slug: 'o', segment: 'Ida' }])
  assert.deepEqual(ordered.map((band) => band.slug), ['o', 'm'])
})

test('cortejos y pasos sin música confirmados por la redacción', async () => {
  const { isSilentStep } = await import('../lib/holy-week-programme.js')
  assert.equal(isSilentStep('hermandad-del-gran-poder-sevilla', 'cualquier-paso'), true)
  assert.equal(isSilentStep('el-museo', 'paso-cristo-expiracion-museo-sevilla'), true)
  assert.equal(isSilentStep('el-museo', 'paso-palio-virgen-aguas-museo-sevilla'), false)
  assert.equal(isSilentStep('santo-entierro-sevilla', 'paso-triunfo-santa-cruz-canina-sevilla'), true)
  assert.equal(isSilentStep('el-baratillo', 'paso-cualquiera'), false)
})
