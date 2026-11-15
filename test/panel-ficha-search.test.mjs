import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'
import { buildBrotherhoodSearchIndex, fichaSearchTokens, searchFichaIndex } from '../lib/panel/ficha-search.js'
import { loadBrotherhoodSearchData } from '../lib/panel/ficha-search-data.js'

const id = 'fc0942dd-d555-43b2-9495-399daba54903'
const piece = 'fe196e69-d1e7-4fee-86e1-d3f5a94fb2aa'
// Name and IDs checked read-only in Supabase; other text below is synthetic.
const data = {
  entity: { id, name: 'Nuestra Señora del Amparo', status: 'published' }, brotherhood: {},
  history: 'Una restauración histórica.',
  assets: [{ entity_id: piece, asset_type: 'Coronas', materials: 'Plata', description: 'Orfebrería antigua' }],
  relatedEntities: [{ id: piece, name: 'Coronas históricas de Nuestra Señora del Amparo y el Niño Jesús', status: 'published' }, { id: 'author', name: 'Autor de prueba' }],
  contributions: [{ target_entity_id: piece, agent_entity_id: 'author', discipline: 'Orfebrería' }],
  cults: [{ id: 'cult', title: 'Función principal', status: 'draft' }],
}
const index = buildBrotherhoodSearchIndex(data)
for (const term of ['corona', 'coronas', 'Coronas del Amparo', 'CORONAS HISTORICAS', 'orfebreria', 'autor de prueba']) {
  test(`Amparo: ${term} leads to the exact heritage form`, () => {
    const result = searchFichaIndex(index, term, { context: data.entity.name }).results[0]
    assert.equal(result.href, `/panel/hermandades/${id}/patrimonio#pieza-${piece}`)
    assert.equal(result.section, 'Patrimonio')
    assert.equal('content' in result, false)
  })
}
test('matches content in unopened sections, keeps editorial state and does not fabricate results', () => {
  assert.equal(searchFichaIndex(index, 'restauracion').results[0].section, 'Historia')
  assert.equal(searchFichaIndex(index, 'funcion').results[0].status, 'draft')
  assert.equal(searchFichaIndex(index, 'inexistente').total, 0)
  assert.equal(searchFichaIndex(index, 'de la').total, 0)
  assert.equal(searchFichaIndex(index, '').total, 0)
})
test('requires all significant terms, prefers titles and reports overflow', () => {
  assert.equal(searchFichaIndex(index, 'corona funcion').total, 0)
  const list = Array.from({ length: 45 }, (_, i) => ({ ...index[2], href: `#${i}` }))
  const result = searchFichaIndex(list, 'corona')
  assert.equal(result.results.length, 40)
  assert.equal(result.total, 45)
})
test('all generated record links point to dedicated anchors', () => {
  const additions = { heritage: [{ id: 'h', title: 'Restauración' }], outings: [{ id: 'o', title: 'Salida' }], series: [{ id: 's', title: 'Rosario' }], habits: [{ id: 'h', name: 'Túnica' }], stats: [{ id: 'j', year: 2026 }], images: [{ id: 'i', image_entity_id: piece }], steps: [{ id: 'p', step_entity_id: piece }], channels: [{ id: 'c', platform: 'website' }] }
  const entries = buildBrotherhoodSearchIndex({ ...data, ...additions })
  for (const fragment of ['pieza-', 'novedad-', 'culto-', 'outing-', 'serie-', 'habit-', 'jornada-', 'titular-', 'paso-', 'canal-']) assert.ok(entries.some((entry) => entry.href.includes(`#${fragment}`)), fragment)
})

function database(tables, fail = '') {
  const calls = []
  return { calls, from(table) {
    const predicates = [], orders = []
    let first = 0, last = Infinity, single = false
    const q = {
      select() { return q },
      eq(key, value) { predicates.push((row) => row[key] === value); calls.push([table, 'eq', key, value]); return q },
      neq(key, value) { predicates.push((row) => row[key] !== value); return q },
      in(key, values) { predicates.push((row) => values.includes(row[key])); calls.push([table, 'in', key, values]); return q },
      order(key) { orders.push(key); return q },
      range(a, b) { first = a; last = b; return q },
      maybeSingle() { single = true; return q },
      then(resolve, reject) {
        let rows = (tables[table] || []).filter((row) => predicates.every((p) => p(row)))
        for (const key of orders.reverse()) rows.sort((a, b) => String(a[key]).localeCompare(String(b[key])))
        rows = rows.slice(first, last + 1)
        return Promise.resolve({ data: single ? rows[0] || null : rows, error: table === fail ? { code: 'XX000' } : null }).then(resolve, reject)
      },
    }
    return q
  } }
}
test('loader scopes every collection, reads beyond 1000, excludes noneditable archived outings', async () => {
  const fake = database({
    entities: [{ ...data.entity, entity_type: 'brotherhood' }, ...data.relatedEntities],
    brotherhoods: [{ entity_id: id }],
    heritage_assets: [{ entity_id: piece, parent_entity_id: id }, { entity_id: 'unrelated', parent_entity_id: 'other' }],
    cults: [...Array.from({ length: 1001 }, (_, n) => ({ id: `c${String(n).padStart(4, '0')}`, brotherhood_entity_id: id })), { id: 'foreign', brotherhood_entity_id: 'other' }],
    outings: [{ id: 'archived', brotherhood_entity_id: id, status: 'archived' }],
  })
  const result = await loadBrotherhoodSearchData(fake, id)
  assert.equal(result.assets.length, 1)
  assert.equal(result.cults.length, 1001)
  assert.equal(result.outings.length, 0)
  assert.deepEqual(result.relatedEntities.map((row) => row.id), [piece])
  assert.ok(fake.calls.every((call) => call[1] === 'eq' || call[1] === 'in'))
})
test('missing entity and query failures are distinguishable', async () => {
  assert.equal(await loadBrotherhoodSearchData(database({}), id), null)
  await assert.rejects(loadBrotherhoodSearchData(database({ entities: [{ ...data.entity, entity_type: 'brotherhood' }] }, 'cults'), id))
})

let user = null, loads = 0, loadFailure = false
const source = readFileSync(new URL('../app/api/panel/hermandades/[id]/buscar/route.js', import.meta.url), 'utf8')
const routeSource = source.replace(/^import .*\n/gm, '')
  .replace('export const dynamic', 'const dynamic')
const GET = new Function('getPanelUser', 'createClient', 'getHermandadBySlug', 'loadBrotherhoodSearchData', 'buildBrotherhoodSearchIndex', 'fichaSearchTokens', 'searchFichaIndex', routeSource.replace('export async function GET', 'async function GET') + '\nreturn GET')(
  async () => user, async () => ({}), () => ({ historia: 'Historia heredada' }), async () => { loads++; if (loadFailure) throw new Error('private database details'); return structuredClone(data) },
  buildBrotherhoodSearchIndex, fichaSearchTokens, searchFichaIndex,
)
const request = (q = 'corona') => new Request(`https://example.test/api/panel/hermandades/${id}/buscar?q=${encodeURIComponent(q)}`)
test('route denies anonymous access before reading editorial data', async () => {
  user = null; loads = 0
  const response = await GET(request(), { params: Promise.resolve({ id }) })
  assert.equal(response.status, 401)
  assert.equal(loads, 0)
  assert.equal(response.headers.get('cache-control'), 'private, no-store')
})
test('route validates id and length before loading, supports read-only roles', async () => {
  user = { role: 'collaborator' }; loads = 0
  assert.equal((await GET(request(), { params: Promise.resolve({ id: 'invalid' }) })).status, 400)
  assert.equal((await GET(request('x'.repeat(121)), { params: Promise.resolve({ id }) })).status, 400)
  assert.equal(loads, 0)
  const response = await GET(request(), { params: Promise.resolve({ id }) })
  const payload = await response.json()
  assert.equal(payload.canEdit, false)
  assert.equal(payload.results[0].href, `/panel/hermandades/${id}/patrimonio#pieza-${piece}`)
  user = { role: 'editor' }
  assert.equal((await (await GET(request(), { params: Promise.resolve({ id }) })).json()).canEdit, true)
})
test('route returns retriable failure without leaking database errors', async () => {
  loadFailure = true
  const response = await GET(request(), { params: Promise.resolve({ id }) })
  assert.equal(response.status, 503)
  assert.doesNotMatch(JSON.stringify(await response.json()), /private database/)
  loadFailure = false
})
