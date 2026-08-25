import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const page = readFileSync(new URL('../app/extraordinarias/page.js', import.meta.url), 'utf8')

test('Extraordinarias mantiene navegación SEO por meses con enlaces a guías', () => {
  assert.match(page, /groupUpcomingByMonth/)
  assert.match(page, /Extraordinarias de Sevilla 2026 por meses/)
  assert.match(page, /href=\{`\/extraordinarias\/\$\{outing\.slug\}`\}/)
  assert.match(page, /upcomingOutings/)
})

test('el bloque de coronaciones nace de los datos y no de una lista manual', () => {
  assert.match(page, /function isCoronation/)
  assert.match(page, /coronations = upcomingOutings\.filter\(isCoronation\)/)
  assert.match(page, /Coronaciones y salidas extraordinarias de 2026/)
  assert.doesNotMatch(page, /gerena-sangre-2026|regla-coronada|amparo-sevilla/)
})
