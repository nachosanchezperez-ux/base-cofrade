import test from 'node:test'
import assert from 'node:assert/strict'

import { validateBulkImportRecord } from '../lib/panel/bulk-import-config.js'
import { applyBulkImportRecord } from '../lib/panel/bulk-import-preflight.js'

class FakeQuery {
  constructor(table, rows, mutations) {
    this.table = table
    this.rows = rows
    this.mutations = mutations
    this.filters = []
    this.filterValues = []
    this.selection = '*'
    this.maximum = null
    this.action = null
    this.payload = null
  }

  select(columns) { this.selection = columns; return this }
  eq(column, value) {
    this.filters.push((row) => row[column] === value)
    this.filterValues.push({ column, value })
    return this
  }
  limit(value) { this.maximum = value; return this }
  maybeSingle() { return this }

  update(payload) { this.action = 'update'; this.payload = payload; return this }
  upsert(payload) { this.action = 'upsert'; this.payload = payload; return this }
  insert(payload) { this.action = 'insert'; this.payload = payload; return this }

  execute() {
    if (this.action) {
      this.mutations.push({ table: this.table, action: this.action, payload: this.payload, filters: this.filterValues })
      return { data: null, error: null }
    }

    let data = this.rows.filter((row) => this.filters.every((filter) => filter(row)))
    if (this.maximum != null) data = data.slice(0, this.maximum)
    if (this.selection !== '*') {
      const columns = this.selection.split(',').map((column) => column.trim())
      data = data.map((row) => Object.fromEntries(columns.map((column) => [column, row[column]])))
    }
    return { data, error: null }
  }

  then(resolve, reject) { return Promise.resolve(this.execute()).then(resolve, reject) }
}

function fakeSupabase() {
  const mutations = []
  const tables = {
    brotherhood_steps: [{
      id: 'd66a22e1-3b82-4e21-a773-0c580f291bf8',
      brotherhood_entity_id: '6327f47e-e6f7-4978-9a89-ad9bbf782e62',
      step_entity_id: '8cc469e9-01ba-41de-9bd5-af5e5fcc6d65',
      relation_type: 'processional_step',
      status: 'draft',
    }],
  }
  return {
    mutations,
    from(table) { return new FakeQuery(table, tables[table] || [], mutations) },
  }
}

test('Apply convierte un upsert efectivo update en UPDATE parcial', async () => {
  const supabase = fakeSupabase()
  const result = await applyBulkImportRecord(supabase, {
    table: 'brotherhood_steps',
    operation: 'upsert',
    refs: {
      id: {
        table: 'brotherhood_steps',
        match: { id: 'd66a22e1-3b82-4e21-a773-0c580f291bf8' },
      },
    },
    data: { status: 'published' },
  })

  assert.equal(result.effective_operation, 'update')
  assert.deepEqual(supabase.mutations, [{
    table: 'brotherhood_steps',
    action: 'update',
    payload: {
      status: 'published',
      id: 'd66a22e1-3b82-4e21-a773-0c580f291bf8',
    },
    filters: [{
      column: 'id',
      value: 'd66a22e1-3b82-4e21-a773-0c580f291bf8',
    }],
  }])
})

test('el preflight bloquea tablas importables sin política de escritura del Panel', () => {
  for (const table of ['entity_locations', 'step_phases', 'march_recordings']) {
    const validation = validateBulkImportRecord({
      table,
      operation: 'insert',
      data: { id: '11111111-1111-1111-1111-111111111111' },
    })
    assert.match(validation.errors.join(' '), /WRITE_POLICY_BLOCKED/)
  }
})
