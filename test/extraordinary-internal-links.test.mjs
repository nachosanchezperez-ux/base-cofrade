import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const helper = read('lib/supabase/extraordinary-links.js')
const brotherhoodLayout = read('app/hermandades/[slug]/layout.js')
const bandLayout = read('app/bandas/[slug]/layout.js')
const component = read('components/RelatedExtraordinaryOutings.js')

test('las fichas públicas enlazan solo extraordinarias futuras publicables', () => {
  assert.match(helper, /event_status', 'announced'/)
  assert.match(helper, /gte\('outing_date', madridDateKey\(\)\)/)
  assert.match(helper, /not\('slug', 'is', null\)/)
})

test('Hermandades conservan enlaces contextuales y Bandas evitan duplicarlos al final', () => {
  assert.match(brotherhoodLayout, /getBrotherhoodUpcomingExtraordinaryLinksBySlug/)
  assert.match(brotherhoodLayout, /RelatedExtraordinaryOutings/)
  assert.doesNotMatch(bandLayout, /getBandUpcomingExtraordinaryLinksBySlug/)
  assert.doesNotMatch(bandLayout, /RelatedExtraordinaryOutings/)
  assert.match(component, /`\/extraordinarias\/\$\{item\.slug\}`/)
  assert.match(component, /Ver calendario completo/)
})
