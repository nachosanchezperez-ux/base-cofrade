import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { selectAllRows } from '../lib/supabase/query-all.js'

// Execute the real loader with only its server dependencies substituted.
const source = readFileSync(new URL('../lib/panel/quick-act.js', import.meta.url), 'utf8')
  .replace(/^import .*\n/gm, '').replace(/export async function/g, 'async function')
const makeLoader = new Function('createClient', 'selectAllRows', `${source}\nreturn getQuickActFormData`)
function loader({ size = 1, failure = '', failFrom = 0 } = {}) {
  const tables = {
    entities: Array.from({ length: size }, (_, n) => ({ id: String(n), name: `Hermandad ${n}`, status: 'published' })),
    brotherhoods: Array.from({ length: size }, (_, n) => ({ entity_id: String(n), popular_name: `Popular ${n}`, municipality_id: 'm' })),
    municipalities: size ? [{ id: 'm', name: 'Sevilla' }] : [],
    places: Array.from({ length: size }, (_, n) => ({ id: String(n), name: `Lugar ${n}`, municipality_id: 'm' })),
  }
  const client = { from(table) {
    const result = (from = 0, to = 999) => table === failure && from >= failFrom
      ? { data: null, error: { message: `error ${table}` } }
      : { data: tables[table].slice(from, to + 1), error: null }
    const query = { select() { return this }, eq() { return this }, neq() { return this }, order() { return this },
      range: async (from, to) => result(from, to), then(resolve, reject) { return Promise.resolve(result()).then(resolve, reject) } }
    return query
  } }
  return makeLoader(async () => client, selectAllRows)
}

test('the loader passes arrays, not Supabase result envelopes, to the form', async () => {
  const result = await loader()()
  for (const key of ['brotherhoods', 'municipalities', 'places']) assert.ok(Array.isArray(result[key]), key)
  assert.equal(result.brotherhoods[0].name, 'Popular 0')
  assert.equal(result.brotherhoods[0].municipalityId, 'm')
})

test('all 1205 brotherhoods and places survive pagination without duplicate IDs', async () => {
  const result = await loader({ size: 1205 })()
  for (const key of ['brotherhoods', 'places']) {
    assert.equal(result[key].length, 1205)
    assert.equal(new Set(result[key].map(row => row.id)).size, 1205)
  }
})

for (const table of ['entities', 'brotherhoods', 'municipalities', 'places']) {
  test(`query failure in ${table} is propagated before rendering`, async () => {
    await assert.rejects(loader({ failure: table }), new RegExp(`error ${table}`))
  })
}


test('empty queries deliver empty lists', async () => {
  assert.deepEqual(await loader({ size: 0 })(), { brotherhoods: [], municipalities: [], places: [] })
})

for (const data of [null, {}, 'invalid']) {
  test(`invalid data envelope is rejected: ${JSON.stringify(data)}`, async () => {
    const query = { select() { return this }, eq() { return this }, neq() { return this }, order() { return this }, then(resolve) { return Promise.resolve({ data: [], error: null }).then(resolve) } }
    const load = makeLoader(async () => ({ from: () => query }), async () => ({ data, error: null }))
    await assert.rejects(load(), /Respuesta no válida/)
  })
}

test('a later page failure never delivers a partial list', async () => {
  await assert.rejects(loader({ size: 1205, failure: 'places', failFrom: 1000 }), /error places/)
})
