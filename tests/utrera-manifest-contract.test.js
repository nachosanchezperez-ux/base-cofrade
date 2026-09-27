import test from 'node:test'
import assert from 'node:assert/strict'
import { buildUtreraManifest, validateUtreraManifest, renderUtreraDryRun } from '../scripts/build-utrera-manifest.mjs'

const manifest = buildUtreraManifest()
const copy = () => structuredClone(manifest)
test('las cuatro identidades se conservan en review sin fabricar publicación', () => {
  for (const key of ['I44', 'I45', 'S25', 'H17']) {
    const m = copy()
    const entity = m.operations.find((r) => r.table === 'entities' && r.id === m.ids[key])
    assert.equal(entity.data.status, 'review')
    entity.data.status = 'published'
    assert.throws(() => validateUtreraManifest(m), /exclusión pública/)
  }
  const privateIds = new Set(manifest.non_public_keys.map((key) => manifest.ids[key]))
  for (const row of manifest.operations.filter((r) => ['image_steps','image_authorships','entity_locations'].includes(r.table))) {
    if (Object.entries(row.data).some(([k,v]) => k.endsWith('entity_id') && privateIds.has(v))) assert.equal(row.data.status, 'review')
  }
})
test('Utrera: generación determinista, identidades exactas y producción no ejecutada', () => {
  assert.deepEqual(buildUtreraManifest(), manifest)
  assert.equal(manifest.counts.corporations, 17)
  assert.equal(manifest.counts.images, 47)
  assert.equal(manifest.counts.held, 7)
  assert.equal(manifest.meta.production_writes, 0)
  assert.equal(validateUtreraManifest(manifest).status, 'PASS')
})
test('barrera Morón: tipos ausentes, repetidos o ajenos bloquean preparación', () => {
  for (const types of [[], ['penitencia'], ['Penitencia', 'Penitencia'], [null]]) {
    const m = copy()
    m.operations.find((r) => r.table === 'brotherhoods' && r.operation === 'insert').data.brotherhood_types = types
    assert.throws(() => validateUtreraManifest(m), /tipos válidos/)
  }
})
test('una clasificación canónica pero distinta de la matriz también se rechaza', () => {
  const m = copy()
  m.operations.find((r) => r.table === 'brotherhoods' && r.id === m.ids.H07).data.brotherhood_types = ['Gloria']
  assert.throws(() => validateUtreraManifest(m), /clasificación divergente/)
})
test('Concepción, imagen histórica de Auxiliadora y Estrella no heredan salidas', () => {
  for (const image of ['I35', 'I42', 'I45']) {
    const m = copy()
    m.operations.find((r) => r.table === 'outing_entities').data.entity_id = m.ids[image]
    assert.throws(() => validateUtreraManifest(m), /titular no acreditado/)
  }
})
test('Resucitado mantiene organizador y carece de Hermandad fabricada', () => {
  const m = copy()
  m.operations.find((r) => r.table === 'outings' && r.id === m.ids.O20).data.brotherhood_entity_id = m.ids.H07
  assert.throws(() => validateUtreraManifest(m), /Hermandad inventada/)
})
test('el regreso del Rocío no hereda held y Fátima no inventa hora', () => {
  const m = copy()
  m.operations.find((r) => r.table === 'outings' && r.id === m.ids.O17).data.event_status = 'held'
  assert.throws(() => validateUtreraManifest(m), /regreso Rocío/)
  const n = copy()
  n.operations.find((r) => r.table === 'outings' && r.id === n.ids.O18).data.departure_time = '09:30:00'
  assert.throws(() => validateUtreraManifest(n), /conflicto de hora/)
})
test('el mismo Paso de Dolores sirve a las dos jornadas', () => {
  const m = copy()
  m.operations.find((r) => r.table === 'outing_music_positions' && r.data.step_entity_id === m.ids.S20).data.step_entity_id = m.ids.S18
  assert.throws(() => validateUtreraManifest(m), /dos jornadas un soporte/)
})
test('Pinzón y las otras tres salidas existentes quedan fuera de escrituras', () => {
  const m = copy(), operation = m.operations.find((r) => r.table === 'outings')
  operation.id = operation.data.id = '9210cbbb-e66e-415e-9f50-ca18ccb97d93'
  assert.throws(() => validateUtreraManifest(m))
})
test('claves foráneas de entidades y fuentes no pueden quedar huérfanas', () => {
  for (const table of ['image_steps', 'source_links']) {
    const m = copy(), row = m.operations.find((r) => r.table === table)
    const col = table === 'image_steps' ? 'image_entity_id' : 'entity_id'
    row.data[col] = '00000000-0000-4000-8000-000000000001'
    assert.throws(() => validateUtreraManifest(m), /huérfana/)
  }
})
test('SQL preparado: rollback final, guard completo, deriva, protección y sin DDL', () => {
  const sql = renderUtreraDryRun(manifest)
  assert.match(sql, /^BEGIN;$/m)
  assert.match(sql, /^ROLLBACK;$/m)
  assert.doesNotMatch(sql, /^\s*(COMMIT|CREATE|ALTER|DROP|DELETE)\b/im)
  assert.ok(sql.indexOf('$hc016_types$') < sql.indexOf('\nROLLBACK;'))
  for (const id of manifest.brotherhood_universe) assert.ok(sql.includes(id))
  for (const check of ['UTRERA_DRIFT', 'UTRERA_NATURAL_DUPLICATE', 'UTRERA_OTHER_COLUMN', 'UTRERA_OUTSIDE_SCOPE']) assert.ok(sql.includes(check))
  assert.ok(sql.includes('t.%I IS NOT DISTINCT FROM r.%I'))
  assert.ok(sql.includes('CROSS JOIN jsonb_populate_record(NULL::public.%I,$1) r'))
})
test('horas usan representación PostgreSQL y no hay timestamps manuales', () => {
  for (const row of manifest.operations.filter((r) => r.table === 'outings')) {
    for (const col of ['departure_time', 'return_time']) if (row.data[col]) assert.match(row.data[col], /^\d{2}:\d{2}:\d{2}$/)
  }
  const m = copy()
  m.operations[0].data.updated_at = '2026-09-27'
  assert.throws(() => validateUtreraManifest(m), /timestamp manual/)
})
