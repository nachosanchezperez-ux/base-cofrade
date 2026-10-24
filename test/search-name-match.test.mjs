import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import {
  EXACT_NAME_SCORE,
  exactNameScore,
  rawSearchNameKey,
  searchNameCandidateMatch,
  searchNameKey,
  typedEntityType,
} from '../lib/search-name-match.js'
import { hiloSearchScopeResidual, parseHiloSearchScope } from '../lib/hilo-search-scope.js'

const municipalities = ['Sevilla', 'Salteras', 'Gerena', 'La Rinconada', 'Dos Hermanas']

// Nombres tal como están en Supabase (entities.name, brotherhoods.popular_name,
// slug) para las fichas de las búsquedas de prueba.
const LA_O = { type: 'brotherhood', names: ['La O', 'Hermandad de La O', 'hermandad-de-la-o'] }
const EL_SOL = { type: 'brotherhood', names: ['El Sol', 'Hermandad del Sol', 'hermandad-del-sol'] }
const BANDA_SOL = { type: 'band', names: ['Banda del Sol', 'banda-del-sol'] }
const BARATILLO = { type: 'brotherhood', names: ['El Baratillo', 'el-baratillo'] }
const MARCHA_BARATILLO = { type: 'march', names: ['Baratillo', 'marcha-baratillo'] }
const CACHORRO = { type: 'brotherhood', names: ['El Cachorro', 'Hermandad del Cachorro', 'hermandad-del-cachorro'] }
const LA_PAZ = { type: 'brotherhood', names: ['La Paz', 'Hermandad de la Paz', 'hermandad-de-la-paz'] }
const CARMEN_SALTERAS = { type: 'band', names: ['Carmen de Salteras', 'carmen-de-salteras'] }
const OLIVA_SALTERAS = { type: 'band', names: ['Banda de Música de la Oliva de Salteras', 'banda-musica-oliva-salteras'] }

const score = (entity, term) => exactNameScore(entity.names, term, entity.type)
const DIRECTORY_SCORE = 2400

test('la clave quita tipo de entidad y artículo inicial', () => {
  assert.equal(searchNameKey('Hermandad de la o'), 'o')
  assert.equal(searchNameKey('Hermandad de La O'), 'o')
  assert.equal(searchNameKey('La O'), 'o')
  assert.equal(searchNameKey('hermandad-de-la-o'), 'o')
  assert.equal(searchNameKey('El Baratillo'), 'baratillo')
  assert.equal(searchNameKey('Banda del Sol'), 'sol')
  assert.equal(searchNameKey('Cofradía de la Paz'), 'paz')
  assert.equal(searchNameKey('Carmen de Salteras'), 'carmen de salteras')
  assert.equal(rawSearchNameKey('Hermandad del Baratillo'), 'Baratillo')
  assert.equal(rawSearchNameKey('Cofradía de la Estrella'), 'Estrella')
  assert.equal(typedEntityType('Banda del Sol'), 'band')
  assert.equal(typedEntityType('Hermandad de la O'), 'brotherhood')
  assert.equal(typedEntityType('El Sol'), '')
})

test('«Hermandad de la O» encuentra La O por encima del Directorio', () => {
  for (const term of ['Hermandad de la o', 'Hermandad de la O', 'La O', 'la o']) {
    assert.ok(score(LA_O, term) > DIRECTORY_SCORE, term)
  }
  assert.equal(score(EL_SOL, 'Hermandad de la o'), 0)
})

test('las búsquedas de control eligen la ficha correcta en primer lugar', () => {
  assert.ok(score(EL_SOL, 'El Sol') > score(BANDA_SOL, 'El Sol'))
  assert.ok(score(BANDA_SOL, 'Banda del Sol') > score(EL_SOL, 'Banda del Sol'))
  assert.ok(score(BANDA_SOL, 'Banda del Sol') > DIRECTORY_SCORE)
  assert.ok(score(BARATILLO, 'Baratillo') > score(MARCHA_BARATILLO, 'Baratillo'))
  assert.ok(score(CACHORRO, 'Cachorro') >= EXACT_NAME_SCORE)
  assert.ok(score(LA_PAZ, 'La Paz') >= EXACT_NAME_SCORE)
  assert.ok(score(CARMEN_SALTERAS, 'Carmen de Salteras') > DIRECTORY_SCORE)
  assert.equal(score(OLIVA_SALTERAS, 'Carmen de Salteras'), 0)
})

test('las coincidencias parciales no suben al nivel de coincidencia exacta', () => {
  assert.equal(exactNameScore(['Banda de Música de la Oliva de Salteras'], 'la o', 'band'), 0)
  assert.equal(exactNameScore(['Caridad del Baratillo'], 'Baratillo', 'march'), 0)
  assert.equal(exactNameScore(['La Soledad de Cantillana'], 'La Paz', 'brotherhood'), 0)
})

test('recupera candidatos sin tildes y por la clave de la consulta', () => {
  assert.ok(searchNameCandidateMatch('La O', 'Hermandad de la O'))
  assert.ok(searchNameCandidateMatch('El Baratillo', 'Hermandad del Baratillo'))
  assert.ok(searchNameCandidateMatch('Bendición y Esperanza', 'bendicion'))
  // Una clave de una letra solo vale como igualdad, nunca como subcadena.
  assert.equal(searchNameCandidateMatch('La Soledad', 'Hermandad de la O'), false)
  assert.equal(searchNameCandidateMatch('Oliva de Salteras', 'Hermandad de la O'), false)
})

test('el ámbito solo manda cuando la consulta no nombra nada más', () => {
  const residual = (term) => hiloSearchScopeResidual(parseHiloSearchScope(term, municipalities))
  assert.deepEqual(residual('Hermandad de la o'), ['o'])
  assert.deepEqual(residual('Banda del Sol'), ['sol'])
  assert.deepEqual(residual('Carmen de Salteras'), ['carmen'])
  assert.deepEqual(residual('Hermandades'), [])
  assert.deepEqual(residual('Bandas de Gerena'), [])
  assert.deepEqual(residual('La Rinconada'), [])
  assert.deepEqual(residual('San José de La Rinconada'), [])
  assert.deepEqual(residual('Lunes Santo Sevilla'), [])
  assert.deepEqual(residual('Hermandades de gloria de Dos Hermanas'), [])
  assert.deepEqual(hiloSearchScopeResidual(null), [])
})

test('search-live aplica la coincidencia exacta y el ámbito como pista', () => {
  const source = readFileSync(new URL('../lib/supabase/search-live.js', import.meta.url), 'utf8')
  assert.match(source, /const scopeIsHint = hiloSearchScopeResidual\(scope\)\.length > 0/)
  assert.match(source, /scopeIsHint\s*\n?\s*\? \{ brotherhoods: \[\], bands: \[\] \}/)
  assert.match(source, /score: DEMOTED_DIRECTORY_SCORE/)
  assert.match(source, /\[title, entity\.name, entity\.slug, \.\.\.\(aliasNamesById\.get\(entity\.id\) \|\| \[\]\)\]/)
  assert.match(source, /Math\.max\(\s*exactScoreFor\(entity\),/)
  assert.match(source, /score: Math\.max\(\s*exactScoreFor\(entity, title\),/)
  assert.match(source, /'entity_key_names'/)
})
