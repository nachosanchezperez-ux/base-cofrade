import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

import {
  assertBulkImportBatchCanApply,
  preflightBulkImportBatch,
} from '../lib/panel/bulk-import-preflight.js'

const fixture = JSON.parse(await readFile(new URL('./fixtures/hc-016-canonical-batch.json', import.meta.url), 'utf8'))

class FakeQuery {
  constructor(rows) {
    this.rows = rows
    this.filters = []
    this.orders = []
    this.maximum = null
    this.selection = '*'
    this.single = false
  }

  select(columns) { this.selection = columns; return this }
  eq(column, value) { this.filters.push((row) => row[column] === value); return this }
  is(column, value) { this.filters.push((row) => row[column] === value); return this }
  in(column, values) { this.filters.push((row) => values.includes(row[column])); return this }
  order(column, options = {}) { this.orders.push({ column, ascending: options.ascending !== false }); return this }
  limit(value) { this.maximum = value; return this }
  maybeSingle() { this.single = true; return this }

  execute() {
    let data = this.rows.filter((row) => this.filters.every((filter) => filter(row)))
    for (const { column, ascending } of this.orders.toReversed()) {
      data = data.toSorted((left, right) => {
        const compared = String(left[column] ?? '').localeCompare(String(right[column] ?? ''))
        return ascending ? compared : -compared
      })
    }
    if (this.maximum != null) data = data.slice(0, this.maximum)
    if (this.selection !== '*') {
      const columns = this.selection.split(',').map((column) => column.trim())
      data = data.map((row) => Object.fromEntries(columns.map((column) => [column, row[column]])))
    }
    return { data: this.single ? (data[0] || null) : data, error: null }
  }

  then(resolve, reject) { return Promise.resolve(this.execute()).then(resolve, reject) }
}

function fakeSupabase() {
  const tables = {
    sources: [
      { id: '10000000-0000-0000-0000-000000000001', url: 'https://example.com/recurso?a=1&b=2', created_at: '2026-01-01T00:00:00Z' },
      { id: '10000000-0000-0000-0000-000000000002', url: 'https://example.com/recurso?a=1&b=2', created_at: '2026-02-01T00:00:00Z' },
    ],
    entities: [
      { id: '20000000-0000-0000-0000-000000000001', entity_type: 'brotherhood', name: 'Entidad existente', slug: 'entidad-existente' },
      { id: '20000000-0000-0000-0000-000000000002', entity_type: 'brotherhood', name: 'Entidad ambigua', slug: 'ambigua-uno' },
      { id: '20000000-0000-0000-0000-000000000003', entity_type: 'brotherhood', name: 'Entidad ambigua', slug: 'ambigua-dos' }
    ],
    brotherhoods: [],
    source_links: [],
  }
  return { from: (table) => new FakeQuery(tables[table] || []) }
}

test('el lote canónico distingue reuse, update e insert sin duplicar Fuentes equivalentes', async () => {
  const supabase = fakeSupabase()
  const existingSources = await preflightBulkImportBatch(supabase, fixture.source_existing_variants)
  assert.equal(existingSources.canApply, true)
  assert.deepEqual(existingSources.plans.map((plan) => plan.effectiveOperation), ['reuse', 'reuse', 'reuse', 'reuse', 'reuse'])
  assert.equal(new Set(existingSources.plans.map((plan) => plan.reusedSourceId)).size, 1)
  assert.ok(existingSources.plans.every((plan) => plan.reusedSourceId === '10000000-0000-0000-0000-000000000001'))

  const linked = await preflightBulkImportBatch(supabase, [{
    table: 'source_links',
    operation: 'insert',
    refs: { source_id: { table: 'sources', match: { url: 'https://example.com/recurso/?b=2&utm_source=lote&a=1#fragmento' } } },
    data: { scope: 'Prueba de Fuente' },
  }])
  assert.equal(linked.canApply, true)
  assert.equal(linked.plans[0].resolvedReferences[0].value, '10000000-0000-0000-0000-000000000001')

  const operations = await preflightBulkImportBatch(supabase, [fixture.source_new, fixture.existing_upsert, fixture.new_record])
  assert.equal(operations.canApply, true)
  assert.deepEqual(operations.plans.map((plan) => plan.effectiveOperation), ['insert', 'update', 'insert'])
})

test('cada error determinista bloquea globalmente Apply antes de cualquier escritura', async () => {
  const cases = [
    [fixture.invalid_column, 'INVALID_COLUMN'],
    [fixture.missing_required, 'MISSING_REQUIRED_FIELD'],
    [fixture.unresolved_reference, 'UNRESOLVED_REFERENCE'],
    [fixture.ambiguous_reference, 'AMBIGUOUS_REFERENCE'],
  ]

  for (const [record, code] of cases) {
    const preflight = await preflightBulkImportBatch(fakeSupabase(), [fixture.new_record, record])
    assert.equal(preflight.canApply, false)
    assert.match(preflight.plans.flatMap((plan) => plan.errors).join(' '), new RegExp(code))
    assert.throws(() => assertBulkImportBatchCanApply(preflight), /PREFLIGHT_BLOCKED/)
  }
})

test('detecta una colisión interna aunque ambos registros sean válidos por separado', async () => {
  const preflight = await preflightBulkImportBatch(fakeSupabase(), fixture.collision)
  assert.equal(preflight.canApply, false)
  assert.equal(preflight.invalidCount, 2)
  assert.ok(preflight.plans.every((plan) => plan.errors.some((error) => error.startsWith('BATCH_COLLISION:'))))
})

test('impide crear dos Fuentes nuevas con la misma URL canónica dentro del lote', async () => {
  const duplicate = structuredClone(fixture.source_new)
  duplicate.data.url = 'https://example.com/nueva/?utm_source=duplicada#fragmento'
  const preflight = await preflightBulkImportBatch(fakeSupabase(), [fixture.source_new, duplicate])
  assert.equal(preflight.canApply, false)
  assert.equal(preflight.invalidCount, 2)
  assert.ok(preflight.plans.every((plan) => plan.errors.some((error) => error.includes('misma Fuente canónica'))))
})

test('resuelve referencias del propio lote y produce el mismo plan con el archivo desordenado', async () => {
  const ordered = await preflightBulkImportBatch(fakeSupabase(), fixture.dependency_chain)
  const shuffledInput = [fixture.dependency_chain[3], fixture.dependency_chain[2], fixture.dependency_chain[1], fixture.dependency_chain[0]]
  const shuffled = await preflightBulkImportBatch(fakeSupabase(), shuffledInput)

  assert.equal(ordered.canApply, true)
  assert.equal(shuffled.canApply, true)
  assert.deepEqual(ordered.effectiveOperationCounts, shuffled.effectiveOperationCounts)

  const summarize = (preflight) => preflight.plans
    .map((plan) => ({
      table: plan.record.table,
      effective: plan.effectiveOperation,
      references: plan.resolvedReferences.map((ref) => `${ref.target_column}:${ref.state}`).sort(),
    }))
    .toSorted((left, right) => left.table.localeCompare(right.table))
  assert.deepEqual(summarize(ordered), summarize(shuffled))
  assert.ok(ordered.plans.find((plan) => plan.record.table === 'source_links').resolvedReferences.every((ref) => ref.state === 'planned'))
})

test('el resultado de cada fila expone tabla, operación solicitada, efectiva, referencias, errores y estado', async () => {
  const preflight = await preflightBulkImportBatch(fakeSupabase(), fixture.dependency_chain)
  for (const plan of preflight.plans) {
    assert.equal(typeof plan.record.table, 'string')
    assert.match(plan.record.operation, /^(insert|upsert)$/)
    assert.match(plan.effectiveOperation, /^(insert|update|reuse)$/)
    assert.ok(Array.isArray(plan.errors))
    assert.ok(Array.isArray(plan.resolvedReferences))
    assert.equal(plan.status, 'valid')
  }
})
