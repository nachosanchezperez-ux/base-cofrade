import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const plan = JSON.parse(await readFile(new URL('../scripts/coria-municipal-hc016-plan.json', import.meta.url), 'utf8'))
const archive = await readFile(new URL('../supabase/migrations_archive/post-first-edition-editorial/20260918220000_cierra_coria_del_rio_macrolote_municipal.sql', import.meta.url), 'utf8')
const finalDeltaArchive = await readFile(new URL('../supabase/migrations_archive/post-first-edition-editorial/20260919160000_reconcilia_coria_del_rio_postapply.sql', import.meta.url), 'utf8')
const stepRemate = JSON.parse(await readFile(new URL('../scripts/coria-municipal-hc016-outing-step-remate.json', import.meta.url), 'utf8'))

test('Coria congela ocho corporaciones y 304 operaciones', () => {
  assert.equal(plan.summary.scope.corporations, 8)
  assert.equal(plan.summary.scope.existing_preserved, 2)
  assert.equal(plan.summary.scope.brotherhoods_created, 6)
  assert.equal(plan.summary.operations_total, 304)
  assert.equal(plan.summary.scope.images_created, 14)
  assert.equal(plan.summary.scope.steps_created, 15)
  assert.equal(plan.summary.scope.outings_2026_created, 8)
  assert.equal(plan.summary.scope.music_assignments_created, 14)
})

test('el lote es DML puro y no fabrica Cultos ni Acontecimientos', () => {
  assert.equal(plan.summary.scope.cults_created, 0)
  assert.equal(plan.summary.scope.events_created, 0)
  assert.doesNotMatch(archive, /\b(create|alter|drop|truncate)\s+(table|policy|schema|function|extension)\b/i)
  assert.doesNotMatch(archive, /row level security|\bgrant\b|\brevoke\b/i)
})

test('la Banda Municipal se reconcilia sin borrar IDs', () => {
  const canonical = '63f719d8-61ab-4357-a43f-cc7977bdda43'
  const duplicate = '870f7ec0-8a57-4652-96ff-05725104a47b'
  assert.ok(plan.rows.some((row) => row.table === 'music_accompaniment_periods'
    && row.data.id === 'daeec4db-ba7b-4aed-b67c-7cfb8a33389c'
    && row.data.band_entity_id === canonical))
  assert.ok(plan.rows.some((row) => row.table === 'entities'
    && row.data.id === duplicate
    && row.data.status === 'archived'))
  assert.ok(plan.rows.some((row) => row.table === 'band_names'
    && row.data.band_entity_id === canonical
    && row.data.name === 'Banda Artística Coriana'))
  assert.doesNotMatch(archive, new RegExp(`delete\\s+from\\s+public\\."?entities"?[^;]*${duplicate}`, 'i'))
})

test('el lote base 304 eleva inicialmente a held Cautivo y Resurrección', () => {
  const outings = plan.rows.filter((row) => row.table === 'outings' && row.operation === 'upsert')
  assert.equal(outings.length, 8)
  const held = outings.filter((row) => row.data.event_status === 'held')
  assert.deepEqual(held.map((row) => row.data.reference_code).sort(), [
    'HC016-CORIA-CAUT-2026',
    'HC016-CORIA-SOL-SUN-2026',
  ])
  assert.equal(outings.filter((row) => row.data.event_status === 'announced').length, 6)
})

test('Piedad no recibe música y San Lucas no se fuerza sobre Resurrección', () => {
  const saturday = plan.rows.find((row) => row.table === 'outings' && row.data.reference_code === 'HC016-CORIA-SJ-SAT-2026')
  const positions = plan.rows.filter((row) => row.table === 'outing_music_positions')
  assert.ok(saturday)
  assert.equal(positions.some((row) => row.data.outing_id === saturday.data.id), false)

  const sanLucas = plan.rows.find((row) => row.table === 'entities'
    && row.data.slug === 'agrupacion-musical-san-lucas-evangelista-coria-del-rio')
  assert.ok(sanLucas)
  assert.equal(plan.rows.some((row) => row.table === 'outing_music_assignments'
    && row.data.band_entity_id === sanLucas.data.id), false)
})

test('Rocío entra como corporación sin fabricar Imagen ni Paso', () => {
  const rocio = plan.rows.find((row) => row.table === 'entities'
    && row.data.slug === 'rocio-coria-del-rio')
  assert.ok(rocio)
  assert.equal(plan.rows.some((row) => row.table === 'brotherhood_images'
    && row.data.brotherhood_entity_id === rocio.data.id), false)
  assert.equal(plan.rows.some((row) => row.table === 'brotherhood_steps'
    && row.data.brotherhood_entity_id === rocio.data.id), false)
  assert.ok(plan.rows.some((row) => row.table === 'outing_series'
    && row.data.brotherhood_entity_id === rocio.data.id
    && row.data.outing_type === 'Romería'))
})


test('el QA enlaza explícitamente los quince Pasos con sus ocho Salidas', () => {
  assert.equal(stepRemate.operations, 15)
  assert.equal(stepRemate.rows.length, 15)
  assert.equal(new Set(stepRemate.rows.map((row) => row.outing_id)).size, 8)
  assert.ok(stepRemate.rows.every((row) => row.role === 'processional_step'))
})


test('el delta final certifica San José, periodos musicales y sede canónica sin inferencias', () => {
  assert.match(finalDeltaArchive, /HC016-CORIA-SJ-TUE-2026/)
  assert.match(finalDeltaArchive, /event_status='held'/)
  assert.match(finalDeltaArchive, /music_accompaniment_periods/)
  assert.match(finalDeltaArchive, /c0160031-0715-4000-8000-000000000015/)
  assert.match(finalDeltaArchive, /5317981f-4be1-4bbd-a4c8-943d178d247e/)
  assert.match(finalDeltaArchive, /delete from public\.places/i)
  assert.doesNotMatch(finalDeltaArchive, /c0160031-0401-4000-8000-000000000001/)
  assert.doesNotMatch(finalDeltaArchive, /\b(create|alter|drop|truncate)\s+(table|policy|schema|function|extension)\b/i)
})
