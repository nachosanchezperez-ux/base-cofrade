import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import { preservedCrewEventPaths } from '../lib/crew-event-preserved-paths.js'
import {
  crewEventAnchor,
  crewEventDetailHref,
  hasCrewEventPage,
  isPreservedCrewEventPath,
} from '../lib/crew-event-url-policy.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('las 25 páginas de igualás publicadas a 13/10 conservan su URL', () => {
  assert.equal(preservedCrewEventPaths.size, 25)
  assert.ok(isPreservedCrewEventPath('/igualas-y-ensayos/iguala-divina-pastora-triana-2026'))
  assert.equal(crewEventDetailHref('iguala-divina-pastora-triana-2026'), '/igualas-y-ensayos/iguala-divina-pastora-triana-2026')
  assert.ok(hasCrewEventPage('/igualas-y-ensayos/iguala-divina-pastora-triana-2026'))
})

test('una convocatoria nueva apunta a su tarjeta del calendario, sin URL propia', () => {
  const href = crewEventDetailHref('iguala-divina-pastora-triana-2027')
  assert.equal(href, `/igualas-y-ensayos#${crewEventAnchor('iguala-divina-pastora-triana-2027')}`)
  assert.equal(hasCrewEventPage(href), false)
  assert.equal(crewEventDetailHref(''), '')
})

test('la ficha redirige las convocatorias no conservadas y el sitemap solo lista páginas', () => {
  const page = read('app/igualas-y-ensayos/[slug]/page.js')
  assert.equal((page.match(/if \(!hasCrewEventPage\(event\.detailHref\)\) permanentRedirect\(event\.detailHref\)/g) || []).length, 2)
  const sitemap = read('app/sitemap.js')
  assert.match(sitemap, /\.filter\(\(event\) => hasCrewEventPage\(event\.detailHref\)\)/)
  const loader = read('lib/supabase/crew-events.js')
  assert.match(loader, /detailHref: crewEventDetailHref\(entity\.slug\),\s*anchor: crewEventAnchor\(entity\.slug\),/)
})

test('el calendario ancla cada tarjeta y abre el histórico si el enlace apunta a una celebrada', () => {
  const directory = read('components/CrewEventDirectory.js')
  assert.match(directory, /<article className=\{styles\.card\} id=\{event\.anchor\}>/)
  assert.match(directory, /if \(!target\.isUpcoming\) setPhase\('archive'\)/)
  assert.match(directory, /\{hasPage \? <Link href=\{event\.detailHref\}/)
})

test('la caché del calendario de igualás no reutiliza entradas sin ancla', () => {
  const cache = readFileSync(new URL('../lib/supabase/public-directory-cache.js', import.meta.url), 'utf8')
  // The cached shape gained `anchor`/new `detailHref`: v1 entries must not be served.
  assert.match(cache, /'public-directory-crew-events-strict-v2-anchor'/)
  assert.doesNotMatch(cache, /'public-directory-crew-events-strict-v1'/)
})
