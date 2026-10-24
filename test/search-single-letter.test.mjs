import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import {
  exactNameScore,
  isSingleCharacterSearch,
  searchNameCandidateMatch,
} from '../lib/search-name-match.js'

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8')

test('«O» solo trae fichas cuyo nombre es esa letra', () => {
  assert.ok(isSingleCharacterSearch('O'))
  assert.ok(isSingleCharacterSearch(' o '))
  assert.equal(isSingleCharacterSearch('La O'), false)

  assert.ok(searchNameCandidateMatch('La O', 'O'))
  assert.ok(searchNameCandidateMatch('Hermandad de La O', 'o'))
  assert.equal(searchNameCandidateMatch('Banda de Música de la Oliva de Salteras', 'O'), false)
  assert.equal(searchNameCandidateMatch('El Rosario', 'o'), false)
  assert.equal(searchNameCandidateMatch('Pontificia, Real e Ilustre Archicofradía del Santísimo Sacramento, Nuestro Padre Jesús Nazareno y María Santísima de la O Coronada', 'O'), false)

  assert.ok(exactNameScore(['La O', 'Hermandad de La O', 'hermandad-de-la-o'], 'O', 'brotherhood') > 2400)
})

test('una letra no lanza consultas por subcadena', () => {
  const source = read('../lib/supabase/search-live.js')
  assert.match(source, /const singleCharacter = isSingleCharacterSearch\(term\)/)
  assert.match(source, /singleCharacter\s*\n\s*\? Promise\.resolve\(\[\]\)\s*\n\s*: optionalRows\(supabase\.from\('entities'\)[^\n]*ilike\('name', pattern\)/)
  assert.match(source, /singleCharacter\s*\n\s*\? Promise\.resolve\(\[\]\)\s*\n\s*: optionalRows\(supabase\.from\('entities'\)[^\n]*ilike\('summary', pattern\)/)
  assert.match(source, /singleCharacter\s*\n\s*\? Promise\.resolve\(\[\]\)\s*\n\s*: searchPublishedContent/)
  assert.match(source, /const searchByKey = !singleCharacter/)
  assert.match(source, /if \(isSingleCharacterSearch\(term\)\) \{\s*\n\s*return \{\s*\n\s*brotherhoodPopularRows: \[\]/)
})

test('la ruta y el buscador aceptan una letra sin mostrar estados vacíos', () => {
  const route = read('../app/api/tira-del-hilo/search/route.js')
  assert.match(route, /if \(rawTerm\.length < 1\)/)

  const client = read('../components/HiloSearch.js')
  assert.match(client, /const MIN_SEARCH_LENGTH = 1;/)
  assert.match(client, /if \(term\.length < MIN_SEARCH_LENGTH \|\| looksLikeQuestion\(query\)\)/)
  assert.match(client, /\? results\.length > 0\s*\n\s*: \(results\.length > 0 \|\| searching \|\| searchComplete\)/)
  assert.match(client, /\{showComposer && resultsVisible \? \(/)
  assert.match(client, /aria-expanded=\{resultsVisible\}/)
})
