import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const layout = readFileSync(new URL('../app/bandas/[slug]/layout.js', import.meta.url), 'utf8')

test('las fichas de Bandas no inyectan una agenda extraordinaria duplicada al final', () => {
  assert.doesNotMatch(layout, /RelatedExtraordinaryOutings/)
  assert.doesNotMatch(layout, /getBandUpcomingExtraordinaryLinksBySlug/)
  assert.doesNotMatch(layout, /extraordinaryOutings/)
})
