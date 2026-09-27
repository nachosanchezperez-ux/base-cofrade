import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import vm from 'node:vm'
import { meetsPublicEditorialMinimum, publicEditorialRobots } from '../lib/supabase/public-entity-page.js'
import { loadPublicRowsInBatches, loadPublicRowsInPages } from '../lib/supabase/public-query-batches.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
function load(context, path) {
  vm.runInContext(read(path).replace(/^import 'server-only'\n/gm, '')
    .replace(/^import[\s\S]*?from '[^']+'\n/gm, '').replace(/^export /gm, ''), context)
}
function fixture(kind, options = {}) {
  const directory = [{ id: 'step', slug: 'paso-documentado', name: 'Paso documentado', type: 'Misterio',
    summary: 'Soporte procesional documentado.', brotherhoodName: options.noContext ? '' : 'Corporación',
    brotherhoodSlug: 'corporacion', municipality: 'Municipio', imageNames: ['Titular'] }]
  const tables = {
    entities: [{ id: 'step', entity_type: 'step', slug: 'paso-documentado', status: options.stepStatus || 'published' },
      { id: 'piece', name: 'Pieza', status: options.pieceStatus || 'published' }],
    steps: [{ entity_id: 'step', step_type: 'Misterio', description: 'Soporte procesional documentado.' }],
    step_phases: kind.includes('phase') ? [{ id: 'phase', step_entity_id: 'step', phase_name: 'Restauración', status: options.phaseStatus || 'published' }] : [],
    heritage_assets: kind.includes('piece') ? [{ entity_id: 'piece', parent_entity_id: 'step', asset_type: 'Respiradero' }] : [],
    source_links: [
      ...(kind.includes('direct') ? [{ source_id: 'source', entity_id: 'step' }] : []),
      ...(kind.includes('phase') ? [{ source_id: 'source', step_phase_id: 'phase' }] : []),
      ...(kind.includes('piece') ? [{ source_id: 'source', entity_id: 'piece' }] : []),
      { source_id: 'other', entity_id: 'unrelated' },
    ],
    sources: [{ id: 'source', name: 'Documento', url: 'https://example.org/documento' }, { id: 'other', name: 'Ajena' }],
  }
  const client = { from(table) {
    let data = tables[table] || []
    return {
      select() { return this }, eq(key, value) { data = data.filter((row) => row[key] === value); return this },
      in(key, values) { data = data.filter((row) => values.includes(row[key])); return this },
      order() { return this }, range(from, to) { data = data.slice(from, to + 1); return this },
      then(resolve) { resolve({ data, error: null }) },
    }
  } }
  const context = vm.createContext({ createPublicClient: () => client, console,
    meetsPublicEditorialMinimum, publicEditorialRobots, loadPublicRowsInBatches, loadPublicRowsInPages,
    process: { env: { VERCEL_ENV: 'preview' } }, seoDescription: (v) => v, pageTitle: (v) => v })
  load(context, 'lib/supabase/step-heritage.js')
  load(context, 'lib/supabase/public-indexability.js')
  const page = read('app/pasos/[slug]/page.js')
  vm.runInContext(page.slice(page.indexOf('export async function generateMetadata'), page.indexOf('export default'))
    .replace('export async function', 'async function'), context)
  return { context, directory }
}
async function inspect(kind, options) {
  const { context, directory } = fixture(kind, options)
  const heritage = await context.getPublishedStepHeritage('step')
  context.getPaso = async () => ({ paso: { nombre: 'Paso documentado', slug: 'paso-documentado', tipo: 'Misterio', descripcion: 'Soporte procesional documentado.' },
    hermandad: options?.noContext ? null : { id: 'hh', nombrePopular: 'Corporación', localidad: 'Municipio' }, imagenes: ['Titular'], heritage })
  const metadata = await context.generateMetadata({ params: { slug: 'paso-documentado' } })
  const entries = await context.getPublicIndexableEntityEntries({ brotherhoods: [], bandDirectory: [], images: [], steps: directory })
  return { heritage, metadata, entries }
}
for (const kind of ['direct', 'phase', 'piece', 'direct phase piece']) {
  test(`Fuentes de Paso: ${kind} llegan a ficha, metadata y sitemap sin duplicarse`, async () => {
    const { heritage, metadata, entries } = await inspect(kind)
    assert.equal(heritage.sources.length, 1)
    assert.equal(heritage.sources[0].id, 'source')
    assert.equal(metadata.robots.index, true)
    assert.equal(metadata.alternates.canonical, '/pasos/paso-documentado')
    assert.equal(entries.length, 1)
    assert.equal(entries[0].id, 'step')
  })
}
for (const [kind, options] of [['none', {}], ['direct', { noContext: true }], ['phase', { phaseStatus: 'review' }], ['piece', { pieceStatus: 'review' }]]) {
  test(`Fuentes de Paso: no indexar ${kind} ${JSON.stringify(options)}`, async () => {
    const { heritage, metadata, entries } = await inspect(kind, options)
    assert.equal(metadata.robots.index, false)
    assert.equal(entries.length, 0)
    if (options.pieceStatus) { assert.equal(heritage.pieces.length, 0); assert.equal(heritage.sources.length, 0) }
  })
}
test('Fuentes directas no incorporan un Paso en review al sitemap', async () => {
  assert.equal((await inspect('direct', { stepStatus: 'review' })).entries.length, 0)
})
