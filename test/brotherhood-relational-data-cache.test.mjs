import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import {
  BROTHERHOOD_DETAIL_DATA_CACHE,
  BROTHERHOOD_DETAIL_DATA_REVALIDATE,
  brotherhoodDetailCacheDay,
} from '../lib/brotherhood-detail-cache.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

// Medición 13–14/10/2026: el 64 % de las visitas a fichas de Hermandad llegaban
// sin caché de página y la regeneración tardaba ~2,5 s (p50) porque estas
// lecturas iban a Supabase en cada render.
test('las lecturas relacionales de la ficha de Hermandad usan la caché de datos', () => {
  const extras = read('components/BrotherhoodRelationalExtras.js')
  assert.match(extras, /import \{ unstable_cache \} from 'next\/cache'/)
  for (const part of ['conceptual-titulars', 'own-bands', 'current-accompaniments', 'thread', 'discovery']) {
    assert.match(extras, new RegExp(`\\[RELATIONAL_EXTRAS_CACHE_KEY, '${part}'\\]`), part)
  }
  assert.match(extras, /const RELATIONAL_EXTRAS_CACHE = BROTHERHOOD_DETAIL_DATA_CACHE/)
  // Los contratos que empiezan en una fecha: el día entra en la clave.
  assert.match(extras, /getCachedCurrentAccompaniments\(brotherhoodId, brotherhoodDetailCacheDay\(\)\)/)
  assert.match(extras, /getCachedDiscoveryData\(brotherhoodId, brotherhoodDetailCacheDay\(\)\)/)
  // Los componentes siguen llamando a los mismos nombres; solo cambia la implementación.
  for (const name of ['loadConceptualTitulars', 'loadOwnBands', 'loadCurrentAccompaniments', 'loadBrotherhoodThreadData', 'loadBrotherhoodDiscoveryData']) {
    assert.match(extras, new RegExp(`function ${name}\\(_supabase, brotherhoodId\\)`), name)
    assert.match(extras, new RegExp(`async function ${name}Rows\\(supabase, brotherhoodId`), `${name}Rows`)
  }
})

test('De un vistazo guarda en caché solo las consultas, con clave serializable', () => {
  const quickFacts = read('components/BrotherhoodQuickFacts.js')
  assert.match(quickFacts, /const loadRelationalRows = unstable_cache\(async function loadRelationalRows\(brotherhoodId, imageIds\)/)
  assert.match(quickFacts, /\['hilo-cofrade-brotherhood-quick-facts-v1'\], BROTHERHOOD_DETAIL_DATA_CACHE\)/)
  // El año vigente se aplica fuera de la caché.
  assert.match(quickFacts, /const rows = await loadRelationalRows\(brotherhood\.id, imageIds\)\n  const headRelations = rows\.headRelations\.filter\(\(item\) => isCurrentRelation\(item, currentYear\)\)/)
  assert.doesNotMatch(quickFacts.slice(quickFacts.indexOf('const loadRelationalRows'), quickFacts.indexOf('const loadRelationalFacts')), /brotherhood\./)
})

// Decisión del propietario (14/10/2026): datos de la ficha hasta 6 horas. En Next 16
// una entrada caducada se vuelve a consultar antes de responder durante la regeneración
// ISR; con 15 minutos, como la página, casi nunca se aprovechaba.
test('la caché de datos de la ficha dura 6 horas y se renueva cada día', () => {
  assert.equal(BROTHERHOOD_DETAIL_DATA_REVALIDATE, 21600)
  assert.deepEqual(BROTHERHOOD_DETAIL_DATA_CACHE, { revalidate: 21600, tags: ['public-brotherhood-detail'] })
  assert.ok(Object.isFrozen(BROTHERHOOD_DETAIL_DATA_CACHE))
  assert.equal(brotherhoodDetailCacheDay(new Date('2026-10-14T23:59:59Z')), '2026-10-14')
  assert.equal(brotherhoodDetailCacheDay(new Date('2026-10-15T00:00:00Z')), '2026-10-15')

  const page = read('lib/supabase/brotherhood-page.js')
  assert.match(page, /return getCachedHermandadPageBySlug\(slug, brotherhoodDetailCacheDay\(\)\)/)
  assert.match(page, /\(slug\) => loadHermandadPageBySlug\(slug\),[\s\S]*?BROTHERHOOD_DETAIL_DATA_CACHE\n\)/)

  const extra = read('lib/supabase/brotherhood-page-cached.js')
  assert.match(extra, /const CACHE_OPTIONS = BROTHERHOOD_DETAIL_DATA_CACHE/)
  // Igualás y ensayos dependen de si ya pasaron: conservan 15 minutos.
  assert.match(extra, /\[KEY, 'crew-events'\],\n  CREW_EVENTS_CACHE_OPTIONS/)
  assert.match(extra, /CREW_EVENTS_CACHE_OPTIONS = \{ revalidate: 900, tags: \['public-brotherhood-detail'\] \}/)

  // La página sigue regenerándose cada 15 minutos (Agenda e igualás).
  assert.match(read('app/hermandades/[slug]/page.js'), /export const revalidate = 900;/)
})
