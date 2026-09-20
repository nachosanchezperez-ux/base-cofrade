import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const page = readFileSync(new URL('../app/extraordinarias/page.js', import.meta.url), 'utf8')

test('Extraordinarias mantiene navegación SEO por meses con enlaces a guías', () => {
  assert.match(page, /groupUpcomingByMonth/)
  assert.match(page, /Próximas extraordinarias de Sevilla por meses/)
  assert.match(page, /href=\{`\/extraordinarias\/\$\{outing\.slug\}`\}/)
  assert.match(page, /upcomingOutings/)
})

test('el bloque de coronaciones nace de los datos y no de una lista manual', () => {
  assert.match(page, /function isCoronation/)
  assert.match(page, /coronations = upcomingOutings\.filter\(isCoronation\)/)
  assert.match(page, /Próximas coronaciones y salidas extraordinarias/)
  assert.doesNotMatch(page, /gerena-sangre-2026|regla-coronada|amparo-sevilla/)
})
