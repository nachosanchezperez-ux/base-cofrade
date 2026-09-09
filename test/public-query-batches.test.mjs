import assert from 'node:assert/strict'
import test from 'node:test'

import { loadPublicRowsInBatches } from '../lib/supabase/public-query-batches.js'

test('las lecturas públicas dividen y deduplican listas grandes', async () => {
  const batches = []
  const rows = await loadPublicRowsInBatches(
    ['a', 'b', 'a', 'c', 'd', 'e'],
    async (ids) => {
      batches.push(ids)
      return { data: ids.map((id) => ({ id })), error: null }
    },
    'consulta de prueba',
    { batchSize: 2 }
  )

  assert.deepEqual(batches, [['a', 'b'], ['c', 'd'], ['e']])
  assert.deepEqual(rows.map((row) => row.id), ['a', 'b', 'c', 'd', 'e'])
})

test('las lecturas públicas reintentan una vez los fallos transitorios', async () => {
  let attempts = 0
  const rows = await loadPublicRowsInBatches(
    ['a'],
    async () => {
      attempts += 1
      if (attempts === 1) return { data: null, error: { message: 'fetch failed' } }
      return { data: [{ id: 'a' }], error: null }
    },
    'consulta de prueba'
  )

  assert.equal(attempts, 2)
  assert.deepEqual(rows, [{ id: 'a' }])
})

test('las lecturas públicas conservan el contexto tras agotar los reintentos', async () => {
  await assert.rejects(
    loadPublicRowsInBatches(
      ['a'],
      async () => ({ data: null, error: { message: 'timeout' } }),
      'No se pudo cargar el sitemap'
    ),
    /No se pudo cargar el sitemap: timeout/
  )
})
