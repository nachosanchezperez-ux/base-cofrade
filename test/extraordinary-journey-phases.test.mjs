import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const detailLoader = readFileSync('lib/supabase/extraordinary-detail.js', 'utf8')
const detailPage = readFileSync('app/extraordinarias/[slug]/page.js', 'utf8')

test('la ficha puede leer fases genéricas desde outings.route sin hardcode de una hermandad', () => {
  assert.match(detailLoader, /select\('origin_text, destination_text, route'\)/)
  assert.match(detailLoader, /function journeyPhases\(route\)/)
  assert.match(detailLoader, /journeyPhases: journeyPhases\(outingText\.route\)/)
  assert.doesNotMatch(detailLoader, /Cerro del Águila|Dolores del Cerro/i)
})

test('la guía muestra el desarrollo por fases solo cuando hay datos estructurados', () => {
  assert.match(detailPage, /item\.journeyPhases\.length/)
  assert.match(detailPage, /id="desarrollo"/)
  assert.match(detailPage, /Desarrollo de la jornada/)
  assert.match(detailPage, /journeyStyles\.journeyGrid/)
  assert.doesNotMatch(detailPage, /Cerro del Águila|Dolores del Cerro/i)
})
