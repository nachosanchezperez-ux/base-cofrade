import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { isIndexableCrewEventPage } from '../lib/crew-event-url-policy.js'

const preserved = '/igualas-y-ensayos/iguala-nuestra-senora-guadalupe-misericordia-2026-10-15'

test('solo las fichas conservadas de convocatorias futuras se ofrecen a Google', () => {
  assert.equal(isIndexableCrewEventPage({ detailHref: preserved, isPast: false }), true)
  assert.equal(isIndexableCrewEventPage({ detailHref: preserved, isPast: true }), false)
  assert.equal(isIndexableCrewEventPage({ detailHref: '/igualas-y-ensayos#convocatoria-x', isPast: false }), false)
})

test('la ficha pasada lleva noindex, follow y el sitemap la excluye', () => {
  const page = readFileSync('app/igualas-y-ensayos/[slug]/page.js', 'utf8')
  assert.match(page, /isIndexableCrewEventPage\(event\) \? \{\} : \{ robots: \{ index: false, follow: true \} \}/)
  assert.match(readFileSync('app/sitemap.js', 'utf8'), /\.filter\(\(event\) => isIndexableCrewEventPage\(event\)\)/)
})
