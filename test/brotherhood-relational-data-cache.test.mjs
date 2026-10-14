import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

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
  assert.match(extras, /RELATIONAL_EXTRAS_CACHE = \{ revalidate: 900, tags: \['public-brotherhood-detail'\] \}/)
  // Los componentes siguen llamando a los mismos nombres; solo cambia la implementación.
  for (const name of ['loadConceptualTitulars', 'loadOwnBands', 'loadCurrentAccompaniments', 'loadBrotherhoodThreadData', 'loadBrotherhoodDiscoveryData']) {
    assert.match(extras, new RegExp(`function ${name}\\(_supabase, brotherhoodId\\)`), name)
    assert.match(extras, new RegExp(`async function ${name}Rows\\(supabase, brotherhoodId`), `${name}Rows`)
  }
})

test('De un vistazo guarda en caché solo las consultas, con clave serializable', () => {
  const quickFacts = read('components/BrotherhoodQuickFacts.js')
  assert.match(quickFacts, /const loadRelationalRows = unstable_cache\(async function loadRelationalRows\(brotherhoodId, imageIds\)/)
  assert.match(quickFacts, /\['hilo-cofrade-brotherhood-quick-facts-v1'\], \{ revalidate: 900, tags: \['public-brotherhood-detail'\] \}/)
  // El año vigente se aplica fuera de la caché.
  assert.match(quickFacts, /const rows = await loadRelationalRows\(brotherhood\.id, imageIds\)\n  const headRelations = rows\.headRelations\.filter\(\(item\) => isCurrentRelation\(item, currentYear\)\)/)
  assert.doesNotMatch(quickFacts.slice(quickFacts.indexOf('const loadRelationalRows'), quickFacts.indexOf('const loadRelationalFacts')), /brotherhood\./)
})
