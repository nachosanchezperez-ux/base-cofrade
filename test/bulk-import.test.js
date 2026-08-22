import test from 'node:test'
import assert from 'node:assert/strict'
import { parseBulkImportText, parseCsvRows, splitImportPayload } from '../lib/panel/bulk-import-parser.js'
import { validateBulkImportRecord } from '../lib/panel/bulk-import-config.js'

test('acepta CSV separado por punto y coma con campos entrecomillados', () => {
  const rows = parseCsvRows('slug;name;summary\nbaratillo;El Baratillo;"Texto, con coma"')
  assert.deepEqual(rows, [
    ['slug', 'name', 'summary'],
    ['baratillo', 'El Baratillo', 'Texto, con coma'],
  ])
})

test('convierte un CSV simple en operaciones de importación', () => {
  const parsed = parseBulkImportText('slug;name;active\nsevilla;Sevilla;true', {
    format: 'csv',
    table: 'municipalities',
    operation: 'upsert',
    onConflict: 'slug',
  })
  assert.equal(parsed.records.length, 1)
  assert.deepEqual(parsed.records[0], {
    table: 'municipalities',
    operation: 'upsert',
    on_conflict: 'slug',
    data: { slug: 'sevilla', name: 'Sevilla', active: true },
    refs: {},
  })
})

test('valida un registro relacional y permite resolver entity_id por slug', () => {
  const result = validateBulkImportRecord({
    table: 'brotherhoods',
    operation: 'upsert',
    on_conflict: 'entity_id',
    refs: {
      entity_id: { table: 'entities', match: { slug: 'el-baratillo' } },
    },
    data: { official_name: 'Antigua y Fervorosa Hermandad' },
  })
  assert.deepEqual(result.errors, [])
})

test('bloquea tablas administrativas fuera de la lista de contenido', () => {
  const result = validateBulkImportRecord({
    table: 'panel_users',
    operation: 'upsert',
    on_conflict: 'user_id',
    data: { role: 'admin' },
  })
  assert.match(result.errors.join(' '), /no está habilitada/)
})

test('bloquea columnas de referencia no previstas', () => {
  const result = validateBulkImportRecord({
    table: 'brotherhoods',
    data: { official_name: 'Prueba' },
    refs: {
      entity_id: { table: 'entities', match: { slug: 'prueba' }, column: 'status' },
    },
  })
  assert.match(result.errors.join(' '), /solo puede ser id o entity_id/)
})

test('divide lotes grandes antes de enviarlos al servidor', () => {
  const records = Array.from({ length: 161 }, (_, index) => ({ table: 'entities', data: { name: `Entidad ${index}` } }))
  const batches = splitImportPayload(records, { maxItems: 75, maxBytes: 10_000_000 })
  assert.deepEqual(batches.map((batch) => batch.length), [75, 75, 11])
})
