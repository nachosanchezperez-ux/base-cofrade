import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { PANEL_ID_BATCH_SIZE, selectAllRows, selectRowsByIds, sortByName } from '../lib/panel/query-all.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

// Simula una consulta de Supabase con el tope de filas por petición.
function fakeTable(total, { maxRows = 1000, calls = [] } = {}) {
  const all = Array.from({ length: total }, (_, index) => ({ id: index + 1 }))
  return () => {
    const query = {
      orders: [],
      order(column) { this.orders.push(column); return this },
      async range(from, to) {
        calls.push({ from, to, orders: [...this.orders] })
        return { data: all.slice(from, Math.min(to + 1, from + maxRows)), error: null }
      },
    }
    return query
  }
}

test('selectAllRows lee más allá del tope de 1.000 filas', async () => {
  const calls = []
  const result = await selectAllRows(fakeTable(2500, { calls }))
  assert.equal(result.error, null)
  assert.equal(result.data.length, 2500)
  assert.equal(new Set(result.data.map((row) => row.id)).size, 2500)
  assert.deepEqual(calls.map((call) => call.from), [0, 1000, 2000])
  // Desempate estable para no repetir ni perder filas entre páginas.
  assert.ok(calls.every((call) => call.orders.at(-1) === 'id'))
})

test('selectAllRows hace una sola petición cuando hay menos de 1.000 filas', async () => {
  const calls = []
  const result = await selectAllRows(fakeTable(796, { calls }), { tieBreaker: 'entity_id' })
  assert.equal(result.data.length, 796)
  assert.equal(calls.length, 1)
  assert.deepEqual(calls[0].orders, ['entity_id'])
})

test('selectAllRows devuelve el error de Supabase sin datos parciales', async () => {
  const result = await selectAllRows(() => ({ order() { return this }, range: async () => ({ data: null, error: { message: 'Bad Request' } }) }))
  assert.equal(result.data, null)
  assert.equal(result.error.message, 'Bad Request')
})

test('selectRowsByIds reparte los identificadores en lotes pequeños', async () => {
  const ids = Array.from({ length: 796 }, (_, index) => `id-${index}`)
  const seen = []
  const result = await selectRowsByIds([...ids, ids[0], null], async (batch) => {
    seen.push(batch.length)
    return { data: batch.map((id) => ({ id })), error: null }
  })
  assert.equal(result.data.length, 796)
  assert.ok(seen.every((size) => size <= PANEL_ID_BATCH_SIZE))
  assert.equal(seen.reduce((sum, size) => sum + size, 0), 796)
  const empty = await selectRowsByIds([], async () => { throw new Error('no debe consultar') })
  assert.deepEqual(empty, { data: [], error: null })
  const failed = await selectRowsByIds(ids, async (batch) => (batch[0] === 'id-150' ? { data: null, error: { message: 'Bad Request' } } : { data: [], error: null }))
  assert.equal(failed.error.message, 'Bad Request')
})

test('sortByName ordena en español sin distinguir mayúsculas ni tildes', () => {
  assert.deepEqual(sortByName([{ name: 'Óbolo' }, { name: 'ángel' }, { name: 'Zeta' }, { name: 'Beta' }]).map((row) => row.name), ['ángel', 'Beta', 'Óbolo', 'Zeta'])
})

test('los listados y selectores del Panel ya no dependen de una sola petición', () => {
  const lists = {
    'lib/panel/agents.js': ['selectAllRows(', 'selectRowsByIds('],
    'lib/panel/images.js': ['selectAllRows('],
    'lib/panel/marches.js': ['selectAllRows(', 'selectRowsByIds('],
    'lib/panel/steps.js': ['selectAllRows(', 'selectRowsByIds('],
    'lib/panel/data.js': ['selectAllRows(', 'selectRowsByIds('],
    'lib/panel/events.js': ['selectAllRows(', 'selectRowsByIds('],
    'lib/panel/image-authorships.js': ['selectRowsByIds('],
    'lib/panel/home-editorial.js': ['selectAllRows(', 'selectRowsByIds('],
    'lib/panel/media.js': ['selectAllRows('],
    'lib/panel/data-health.js': ['selectAllRows('],
    'lib/panel/master-data.js': ['selectAllRows('],
    'lib/panel/brotherhood-outings.js': ['selectAllRows('],
    'lib/panel/brotherhood-procession-stats.js': ['selectAllRows('],
    'app/panel/(protected)/bandas/[id]/discografia/page.js': ['selectAllRows('],
  }
  for (const [path, helpers] of Object.entries(lists)) {
    const source = read(path)
    for (const helper of helpers) assert.ok(source.includes(helper), `${path} debe usar ${helper}`)
  }

  // El error observado en producción: tipos de Agente con un «in» de cientos de identificadores.
  assert.doesNotMatch(read('lib/panel/image-authorships.js'), /\.in\('entity_id', agentEntities\.map/)
  assert.doesNotMatch(read('lib/panel/agents.js'), /\.in\('entity_id', entities\.map/)
  // Los hilos de portada se piden ya filtrados por tipo de actividad.
  assert.match(read('lib/panel/home-editorial.js'), /home_knowledge_threads'\)[^\n]*\.in\('activity_kind', \[\.\.\.DISCOVERY_KINDS\]\), \{ tieBreaker: 'thread_key' \}/)
})

test('las comprobaciones de duplicados al crear o editar fichas revisan todas las fichas', () => {
  for (const path of [
    'app/panel/(protected)/agentes/nuevo/actions.js',
    'app/panel/(protected)/agentes/[id]/actions.js',
    'app/panel/(protected)/imagenes/nueva/actions.js',
    'app/panel/(protected)/imagenes/[id]/actions.js',
    'app/panel/(protected)/pasos/nuevo/actions.js',
    'app/panel/(protected)/pasos/[id]/actions.js',
    'app/panel/(protected)/hermandades/nueva/actions.js',
  ]) {
    assert.match(read(path), /selectAllRows\(\(\) => supabase/, path)
  }
})
