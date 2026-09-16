import test from 'node:test'
import assert from 'node:assert/strict'

import {
  freeFactIntent,
  freeSetIntent,
  matchHolyWeekDay,
  matchMunicipalityName,
} from '../lib/tira-free-facts.js'

test('reconoce opciones de escucha de una marcha', () => {
  assert.deepEqual(
    freeFactIntent('¿Dónde puedo escuchar Refúgiame?'),
    { kind: 'march_listen', entityTypes: ['march'] }
  )
  assert.deepEqual(
    freeFactIntent('¿Está en Spotify?', 'march'),
    { kind: 'march_listen', entityTypes: ['march'] }
  )
})

test('reconoce hechos básicos de hermandades y bandas', () => {
  assert.deepEqual(
    freeFactIntent('¿Cuándo se fundó El Baratillo?'),
    { kind: 'foundation', entityTypes: ['brotherhood', 'band'] }
  )
  assert.deepEqual(
    freeFactIntent('¿Qué tipo de hermandad es La Cena?'),
    { kind: 'brotherhood_type', entityTypes: ['brotherhood'] }
  )
  assert.deepEqual(
    freeFactIntent('¿De qué localidad es la Banda del Sol?'),
    { kind: 'location', entityTypes: ['band', 'brotherhood'] }
  )
})

test('reconoce listados de Hermandades por municipio sin secuestrar relaciones', () => {
  const expected = { kind: 'brotherhoods_by_municipality', entityTypes: ['brotherhood'] }
  assert.deepEqual(freeFactIntent('¿Cuáles son las hermandades de La Rinconada?'), expected)
  assert.deepEqual(freeFactIntent('¿Qué cofradías hay en Dos Hermanas?'), expected)
  assert.deepEqual(freeFactIntent('Listado de hermandades de Alcalá de Guadaíra'), expected)
  assert.deepEqual(freeFactIntent('Hermandades de Sevilla'), expected)
  assert.deepEqual(
    freeFactIntent('Agrupaciones parroquiales de La Rinconada'),
    { ...expected, brotherhoodType: 'Agrupación Parroquial' }
  )
  assert.deepEqual(
    freeFactIntent('Hermandades de penitencia de La Rinconada'),
    { ...expected, brotherhoodType: 'Penitencia' }
  )
  assert.deepEqual(
    freeFactIntent('Glorias de La Rinconada'),
    { ...expected, brotherhoodType: 'Gloria' }
  )
  assert.deepEqual(
    freeFactIntent('Sacramentales de La Rinconada'),
    { ...expected, brotherhoodType: 'Sacramental' }
  )
  assert.equal(freeFactIntent('¿Qué bandas acompañan a las hermandades de La Rinconada?'), null)
  assert.equal(freeFactIntent('¿Qué pasos tienen las hermandades de La Rinconada?'), null)
})

test('reconoce una jornada de Semana Santa como listado territorial de Hermandades', () => {
  const expected = {
    kind: 'brotherhoods_by_municipality',
    entityTypes: ['brotherhood'],
    processionDay: 'Lunes Santo',
  }
  assert.deepEqual(freeFactIntent('Lunes Santo en Sevilla'), expected)
  assert.deepEqual(freeFactIntent('Hermandades del Lunes Santo en Sevilla'), expected)
  assert.equal(matchHolyWeekDay('Qué ver en la Madrugada de Sevilla'), 'Madrugada')
  assert.equal(matchHolyWeekDay('Sábado de Pasión en Sevilla'), 'Sábado de Pasión')
  assert.equal(freeFactIntent('¿Qué bandas tocan el Lunes Santo en Sevilla?'), null)
})

test('reconoce Bandas y panoramas por municipio sin secuestrar acompañamientos', () => {
  const bands = { kind: 'bands_by_municipality', entityTypes: ['band'] }
  assert.deepEqual(freeFactIntent('Bandas de Gerena'), bands)
  assert.deepEqual(freeFactIntent('¿Qué bandas hay en Cantillana?'), bands)
  assert.deepEqual(freeFactIntent('Listado de formaciones musicales de Dos Hermanas'), bands)
  assert.equal(freeFactIntent('¿Qué bandas acompañan a las hermandades de Gerena?'), null)
  assert.deepEqual(
    freeFactIntent('¿Qué hay en Gerena?'),
    { kind: 'municipality_overview', entityTypes: ['brotherhood', 'band'] }
  )
})

test('resuelve el municipio completo más específico dentro de la pregunta', () => {
  const municipalities = ['Sevilla', 'La Rinconada', 'Alcalá de Guadaíra', 'Alcalá del Río']
  assert.equal(matchMunicipalityName('Hermandades de La Rinconada', municipalities), 'La Rinconada')
  assert.equal(matchMunicipalityName('¿Qué cofradías hay en Alcalá de Guadaíra?', municipalities), 'Alcalá de Guadaíra')
  assert.equal(matchMunicipalityName('Hermandades de Alcalá', municipalities), '')
})

test('reconoce datos materiales y técnicos de imágenes y pasos', () => {
  assert.deepEqual(
    freeFactIntent('¿Qué técnica tiene esta imagen?', 'image'),
    { kind: 'image_technique', entityTypes: ['image'] }
  )
  assert.deepEqual(
    freeFactIntent('¿Cuántas trabajaderas tiene este paso?', 'step'),
    { kind: 'step_workbenches', entityTypes: ['step'] }
  )
  assert.deepEqual(
    freeFactIntent('¿De qué material es?', 'step'),
    { kind: 'material', entityTypes: ['step'] }
  )
})

test('reconoce coincidencias sobre un conjunto conversado', () => {
  assert.deepEqual(
    freeSetIntent('¿Qué tienen en común?', 'image'),
    { kind: 'set_common', entityType: 'image' }
  )
  assert.deepEqual(
    freeSetIntent('¿Qué comparten todas?', 'march'),
    { kind: 'set_common', entityType: 'march' }
  )
  assert.equal(freeSetIntent('Compáralas.', 'image'), null)
})

test('no secuestra intents relacionales existentes', () => {
  assert.equal(freeFactIntent('¿Quién compuso Refúgiame?'), null)
  assert.equal(freeFactIntent('¿Qué bandas acompañan al Baratillo?'), null)
  assert.equal(freeFactIntent('Busca una conexión entre El Baratillo y La Cena'), null)
})
