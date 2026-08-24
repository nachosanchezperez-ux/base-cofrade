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

test('la ficha de Hermandad usa autorías, historia, Sede e imágenes procesionales canónicas', () => {
  const display = source('lib/supabase/brotherhood-display.js')
  const pageLoader = source('lib/supabase/brotherhood-page.js')
  const page = source('app/hermandades/[slug]/page.js')

  assert.match(display, /\.from\('image_authorships'\)/)
  assert.match(display, /\.from\('image_steps'\)/)
  assert.match(display, /\.select\('[^']*history_text[^']*'\)/)
  assert.match(display, /canonical_see_place_id/)
  assert.match(display, /\.from\('places'\)/)
  assert.match(pageLoader, /from '@\/lib\/supabase\/brotherhood-display'/)
  assert.match(pageLoader, /enrichBrotherhoodVisualSections/)
  assert.match(page, /from '@\/lib\/supabase\/brotherhood-page'/)
  assert.match(page, /BrotherhoodSeatSection/)
  assert.match(page, /paso\.imagenesDetalle\?\.length/)
})
