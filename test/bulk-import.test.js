import test from 'node:test'
import assert from 'node:assert/strict'
import {
  DEFAULT_IMPORT_CHUNK_BYTES,
  parseBulkImportText,
  parseCsvRows,
  splitImportPayload,
} from '../lib/panel/bulk-import-parser.js'
import {
  findBulkImportTargetCollisions,
  validateBulkImportRecord,
} from '../lib/panel/bulk-import-config.js'

test('acepta CSV separado por punto y coma con campos entrecomillados', () => {
  const rows = parseCsvRows('slug;name;summary\nbaratillo;El Baratillo;"Texto, con coma"')
  assert.deepEqual(rows, [
    ['slug', 'name', 'summary'],
    ['baratillo', 'El Baratillo', 'Texto, con coma'],
  ])
})

test('convierte un CSV simple en operaciones de importación', () => {
  const parsed = parseBulkImportText('slug;name;province\nsevilla;Sevilla;Sevilla', {
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
    data: { slug: 'sevilla', name: 'Sevilla', province: 'Sevilla' },
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

test('exige una clave estable para los upsert', () => {
  const result = validateBulkImportRecord({
    table: 'entities',
    operation: 'upsert',
    data: { name: 'Entidad sin clave', entity_type: 'brotherhood' },
  })
  assert.match(result.errors.join(' '), /necesita on_conflict o una clave primaria/)
})

test('impide sustituir el UUID al actualizar una entidad por slug', () => {
  const result = validateBulkImportRecord({
    table: 'entities',
    operation: 'upsert',
    on_conflict: 'slug',
    data: {
      id: '11111111-1111-1111-1111-111111111111',
      slug: 'el-baratillo',
      name: 'El Baratillo',
      entity_type: 'brotherhood',
    },
  })
  assert.match(result.errors.join(' '), /podría cambiar el UUID/)
})

test('detecta dos upserts a la misma entidad por slug', () => {
  const records = [
    {
      table: 'entities',
      operation: 'upsert',
      on_conflict: 'slug',
      data: { slug: 'el-baratillo', name: 'El Baratillo', entity_type: 'brotherhood' },
    },
    {
      table: 'entities',
      operation: 'upsert',
      on_conflict: 'slug',
      data: { slug: 'el-baratillo', name: 'Hermandad del Baratillo', entity_type: 'brotherhood' },
    },
  ]

  const collisions = findBulkImportTargetCollisions(records)
  assert.equal(collisions.length, 1)
  assert.equal(collisions[0].table, 'entities')
  assert.match(collisions[0].target, /slug=el-baratillo/)
  assert.deepEqual(collisions[0].positions, [1, 2])
})

test('detecta dos extensiones relacionales que resuelven el mismo entity_id', () => {
  const records = [
    {
      table: 'brotherhoods',
      operation: 'upsert',
      on_conflict: 'entity_id',
      refs: { entity_id: { table: 'entities', match: { slug: 'san-benito' } } },
      data: { official_name: 'Hermandad de San Benito' },
    },
    {
      table: 'brotherhoods',
      operation: 'upsert',
      on_conflict: 'entity_id',
      refs: { entity_id: { table: 'entities', match: { slug: 'san-benito' } } },
      data: { official_name: 'Hermandad Sacramental de San Benito' },
    },
  ]

  const collisions = findBulkImportTargetCollisions(records)
  assert.equal(collisions.length, 1)
  assert.equal(collisions[0].table, 'brotherhoods')
  assert.match(collisions[0].target, /entity_id→entities\(slug=san-benito\)/)
  assert.deepEqual(collisions[0].positions, [1, 2])
})

test('no marca claves estables diferentes como colisión', () => {
  const collisions = findBulkImportTargetCollisions([
    {
      table: 'entities',
      operation: 'upsert',
      on_conflict: 'slug',
      data: { slug: 'el-baratillo', name: 'El Baratillo', entity_type: 'brotherhood' },
    },
    {
      table: 'entities',
      operation: 'upsert',
      on_conflict: 'slug',
      data: { slug: 'san-benito', name: 'San Benito', entity_type: 'brotherhood' },
    },
  ])
  assert.deepEqual(collisions, [])
})

test('ignora registros inválidos al calcular colisiones aplicables', () => {
  const validations = [
    validateBulkImportRecord({
      table: 'entities',
      operation: 'upsert',
      on_conflict: 'slug',
      data: { slug: 'el-baratillo', name: 'El Baratillo', entity_type: 'brotherhood' },
    }),
    validateBulkImportRecord({
      table: 'panel_users',
      operation: 'upsert',
      on_conflict: 'slug',
      data: { slug: 'el-baratillo', name: 'No permitido' },
    }),
  ]
  assert.deepEqual(findBulkImportTargetCollisions(validations), [])
})

test('divide lotes grandes antes de enviarlos al servidor', () => {
  const records = Array.from({ length: 161 }, (_, index) => ({ table: 'entities', data: { name: `Entidad ${index}` } }))
  const batches = splitImportPayload(records, { maxItems: 75, maxBytes: 10_000_000 })
  assert.deepEqual(batches.map((batch) => batch.length), [75, 75, 11])
})

test('el transporte por defecto se mantiene holgadamente por debajo de un megabyte', () => {
  assert.ok(DEFAULT_IMPORT_CHUNK_BYTES < 1_000_000)
  const records = Array.from({ length: 3 }, (_, index) => ({
    table: 'entities',
    operation: 'insert',
    data: { name: `Entidad ${index}`, summary: 'x'.repeat(250_000) },
  }))
  const batches = splitImportPayload(records)
  assert.deepEqual(batches.map((batch) => batch.length), [2, 1])
  for (const batch of batches) {
    const bytes = batch.reduce((total, record) => total + new TextEncoder().encode(JSON.stringify(record)).length, 0)
    assert.ok(bytes <= DEFAULT_IMPORT_CHUNK_BYTES)
  }
})
