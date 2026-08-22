import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

function source(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('Bandas no recupera contenido editorial o relacional desde fallbacks locales', () => {
  const bands = source('lib/supabase/bands.js')

  for (const forbidden of [
    'FALLBACK_BAND',
    'CIGARRERAS_ACCOMPANIMENTS',
    'CIGARRERAS_HISTORICAL_ACCOMPANIMENTS',
    'CIGARRERAS_CURIOSITIES',
  ]) {
    assert.equal(bands.includes(forbidden), false, `${forbidden} no debe volver al loader público de Bandas`)
  }

  assert.match(bands, /\.in\('relation_type', \['about', 'historical_accompaniment'\]\)/)
  assert.match(bands, /if \(!entity\.data\) return null/)
})

test('el directorio de Hermandades usa el crest_path persistente', () => {
  const directory = source('lib/supabase/brotherhood-directory.js')

  assert.equal(directory.includes('LOCAL_CREST_PATHS'), false)
  assert.match(directory, /escudoPath: brotherhood\.crest_path \|\| null/)
})

test('la ficha de Hermandad prioriza multimedia y escudo autoritativos', () => {
  const page = source('app/hermandades/[slug]/page.js')

  assert.equal(page.includes('councilParticipationPhotoCreditBySlug'), false)
  assert.match(page, /const imageCredit = eventMedia\?\.credit \|\| participacion\.imagenCredito/)
  assert.match(page, /crestSrc: authoritativeCrestPath/)
  assert.match(page, /getPublishedBrotherhoodCrestPath\(h\.id\)/)
})
