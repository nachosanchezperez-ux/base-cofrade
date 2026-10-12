import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { HOME_FEATURED_MAX_DAYS, homeFeaturedStatus, parseHomeFeaturedInput } from '../lib/home-featured-form.js'
import { homeEditorialFocusesFromRows } from '../lib/home-editorial-focus.js'

const ID = '38e2190f-b777-4f80-bcf4-1b81f7a73a8b'

test('un destacado válido se normaliza', () => {
  assert.deepEqual(
    parseHomeFeaturedInput({ outingId: ` ${ID} `, startsOn: '2026-10-15', endsOn: '2026-10-18', priority: '70' }),
    { outingId: ID, startsOn: '2026-10-15', endsOn: '2026-10-18', priority: 70 }
  )
  assert.equal(parseHomeFeaturedInput({ outingId: ID, startsOn: '2026-10-15', endsOn: '2026-10-15', priority: '' }).priority, 0)
})

test('se rechazan salidas, fechas y prioridades no válidas', () => {
  const base = { outingId: ID, startsOn: '2026-10-15', endsOn: '2026-10-18', priority: '50' }
  assert.throws(() => parseHomeFeaturedInput({ ...base, outingId: 'x' }), /salida válida/)
  assert.throws(() => parseHomeFeaturedInput({ ...base, startsOn: '2026-02-30' }), /fechas/)
  assert.throws(() => parseHomeFeaturedInput({ ...base, endsOn: '' }), /fechas/)
  assert.throws(() => parseHomeFeaturedInput({ ...base, endsOn: '2026-10-14' }), /anterior/)
  assert.throws(() => parseHomeFeaturedInput({ ...base, priority: '101' }), /prioridad/)
  assert.throws(() => parseHomeFeaturedInput({ ...base, priority: '-1' }), /prioridad/)
  assert.throws(() => parseHomeFeaturedInput({ ...base, priority: '2.5' }), /prioridad/)
})

test(`la ventana no puede superar ${HOME_FEATURED_MAX_DAYS} días`, () => {
  assert.doesNotThrow(() => parseHomeFeaturedInput({ outingId: ID, startsOn: '2026-10-01', endsOn: '2026-10-31' }))
  assert.throws(() => parseHomeFeaturedInput({ outingId: ID, startsOn: '2026-10-01', endsOn: '2026-11-01' }), /31 días/)
})

test('estado del destacado respecto a hoy', () => {
  const window = { startsOn: '2026-10-15', endsOn: '2026-10-18' }
  assert.equal(homeFeaturedStatus(window, '2026-10-14'), 'scheduled')
  assert.equal(homeFeaturedStatus(window, '2026-10-15'), 'active')
  assert.equal(homeFeaturedStatus(window, '2026-10-18'), 'active')
  assert.equal(homeFeaturedStatus(window, '2026-10-19'), 'ended')
  assert.equal(homeFeaturedStatus({}, '2026-10-19'), 'unknown')
})

// Ejecuta el lector real con un cliente simulado, sin red.
function loadReader(createPublicClient) {
  const source = readFileSync(new URL('../lib/supabase/home-featured-outings.js', import.meta.url), 'utf8')
    .replace(/^import .*\n/gm, '')
    .replace(/^export /gm, '')
  return new Function('createPublicClient', 'homeEditorialFocusesFromRows', 'console', `${source}\nreturn getActiveHomeFeaturedFocuses`)(
    createPublicClient, homeEditorialFocusesFromRows, { error() {} }
  )
}

function fakeClient(result, calls = []) {
  const chain = {
    from(table) { calls.push(['from', table]); return chain },
    select(fields) { calls.push(['select', fields]); return chain },
    eq(...args) { calls.push(['eq', ...args]); return chain },
    not(...args) { calls.push(['not', ...args]); return chain },
    lte(...args) { calls.push(['lte', ...args]); return chain },
    gte(...args) { calls.push(['gte', ...args]); return chain },
    limit(...args) { calls.push(['limit', ...args]); return Promise.resolve(result) },
  }
  return () => chain
}

test('la portada lee solo destacados publicados con la ventana abierta hoy', async () => {
  const calls = []
  const read = loadReader(fakeClient({ data: [{ id: ID, home_featured_starts_on: '2026-10-11', home_featured_ends_on: '2026-10-12', home_featured_priority: 5 }], error: null }, calls))
  const focuses = await read('2026-10-12')
  assert.equal(focuses[0].outingId, ID)
  assert.deepEqual(calls.find((call) => call[0] === 'eq'), ['eq', 'status', 'published'])
  assert.deepEqual(calls.find((call) => call[0] === 'lte'), ['lte', 'home_featured_starts_on', '2026-10-12'])
  assert.deepEqual(calls.find((call) => call[0] === 'gte'), ['gte', 'home_featured_ends_on', '2026-10-12'])
})

test('un fallo de lectura o una fecha no válida dejan la portada sin destacados, sin romperla', async () => {
  assert.deepEqual(await loadReader(fakeClient({ data: null, error: { message: 'column does not exist' } }))('2026-10-12'), [])
  assert.deepEqual(await loadReader(() => { throw new Error('sin red') })('2026-10-12'), [])
  assert.deepEqual(await loadReader(fakeClient({ data: [], error: null }))(''), [])
})
