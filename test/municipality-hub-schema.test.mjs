import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('las guías municipales declaran un Place enlazado con la CollectionPage', () => {
  const hub = read('components/MunicipalityAgendaHub.js')

  assert.match(hub, /municipalityPlaceJsonLd/)
  assert.match(hub, /const placeId = `\$\{absoluteUrl\(path\)\}#place`/)
  assert.match(hub, /<JsonLd data=\{placeJsonLd\} \/>/)
  assert.match(hub, /about: \{ '@id': placeId \}/)
  assert.match(hub, /spatialCoverage: \{ '@id': placeId \}/)
})

test('el helper territorial usa Place y PostalAddress sin inventar coordenadas', () => {
  const seo = read('lib/seo.js')

  assert.match(seo, /export function municipalityPlaceJsonLd/)
  assert.match(seo, /'@type': 'Place'/)
  assert.match(seo, /'@type': 'PostalAddress'/)
  assert.match(seo, /addressRegion: region/)
  assert.match(seo, /addressCountry: country/)
  assert.doesNotMatch(seo, /latitude|longitude/)
})

test('CollectionPage admite contexto territorial opcional sin romper otros usos', () => {
  const seo = read('lib/seo.js')

  assert.match(seo, /about = null/)
  assert.match(seo, /spatialCoverage = null/)
  assert.match(seo, /\.\.\.\(about \? \{ about \} : \{\}\)/)
  assert.match(seo, /\.\.\.\(spatialCoverage \? \{ spatialCoverage \} : \{\}\)/)
})
