import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

function source(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('Salud amplía la completitud sin exigir multimedia genérica', () => {
  const health = source('lib/panel/data-health.js')

  assert.match(health, /key: 'brotherhood-profile'/)
  assert.match(health, /key: 'brotherhood-crest'/)
  assert.match(health, /key: 'brotherhood-image-link'/)
  assert.match(health, /key: 'image-profile'/)
  assert.match(health, /key: 'image-context'/)
  assert.match(health, /key: 'step-profile'/)
  assert.match(health, /key: 'step-brotherhood'/)
  assert.match(health, /key: 'step-image'/)
  assert.match(health, /key: 'band-profile'/)
  assert.match(health, /key: 'band-logo'/)

  assert.match(health, /from\('brotherhood_images'\).*eq\('status', 'published'\).*is\('date_to', null\)/)
  assert.match(health, /from\('brotherhood_steps'\).*eq\('status', 'published'\).*is\('date_to', null\)/)
  assert.match(health, /from\('image_steps'\).*eq\('status', 'published'\).*is\('date_to', null\)/)

  assert.doesNotMatch(health, /hero_image_path/)
  assert.doesNotMatch(health, /key: 'step-media'/)
  assert.doesNotMatch(health, /key: 'band-media'/)
})

test('Salud reconoce Hermandad directa o a través de un Paso', () => {
  const health = source('lib/panel/data-health.js')

  assert.match(health, /const imageWithBrotherhoodContextIds = new Set\(brotherhoodImages/)
  assert.match(health, /for \(const relation of imageSteps\)/)
  assert.match(health, /stepWithBrotherhoodIds\.has\(relation\.step_entity_id\)/)
  assert.match(health, /imageWithBrotherhoodContextIds\.add\(relation\.image_entity_id\)/)
  assert.doesNotMatch(health, /key: 'image-brotherhood'/)
})

test('Salud agrupa campos editoriales para evitar una incidencia por campo', () => {
  const health = source('lib/panel/data-health.js')

  assert.match(health, /function missingFields\(entries\)/)
  assert.match(health, /function missingDetail\(fields\)/)
  assert.match(health, /Ficha básica de Hermandad incompleta/)
  assert.match(health, /Ficha básica de Imagen incompleta/)
  assert.match(health, /Ficha técnica de Paso incompleta/)
  assert.match(health, /Ficha básica de Banda incompleta/)
})
