import assert from 'node:assert/strict'
import test from 'node:test'

import {
  loadPublicRowsInBatches,
  loadPublicRowsInPages,
} from '../lib/supabase/public-query-batches.js'

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

test('las lecturas públicas paginadas no dependen del límite de filas de Supabase', async () => {
  const source = Array.from({ length: 7 }, (_, index) => ({ id: index + 1 }))
  const ranges = []
  const rows = await loadPublicRowsInPages(
    async (from, to) => {
      ranges.push([from, to])
      return { data: source.slice(from, to + 1), error: null }
    },
    'consulta paginada de prueba',
    { pageSize: 3 }
  )

  assert.deepEqual(ranges, [[0, 2], [3, 5], [6, 8]])
  assert.deepEqual(rows, source)
})

test('las lecturas públicas paginadas fallan de forma visible al agotar reintentos', async () => {
  await assert.rejects(
    loadPublicRowsInPages(
      async () => ({ data: null, error: { message: 'timeout' } }),
      'No se pudieron paginar las Marchas',
      { pageSize: 3 }
    ),
    /No se pudieron paginar las Marchas: timeout/
  )
})
