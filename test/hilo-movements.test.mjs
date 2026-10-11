import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { HILO_MOVEMENTS } from '../lib/hilo-movements-data.js'
import { buildHiloMovements, selectHiloMovements, filterHiloMovements, validHiloDay, hiloDayLabel } from '../lib/hilo-movements.js'
const TODAY = { today: '2026-10-07' }
const roots = HILO_MOVEMENTS.map((item) => ({ id: item.brotherhood.id, slug: item.brotherhood.slug, entity_type: 'brotherhood', status: 'published' }))
const entities = [...roots, ...HILO_MOVEMENTS.flatMap((item) => item.relations.map((relation, i) => ({ id: relation.id, slug: `band-${i}`, entity_type: relation.type, status: 'published' })))]
const build = (records = HILO_MOVEMENTS, rows = entities) => buildHiloMovements(records, rows, TODAY)
const change = (patch) => [{ ...HILO_MOVEMENTS[0], ...patch }]
test('two verified chapters are ordered by announcement, not import time', () => { const items = build(); assert.equal(items.length, 2); assert.equal(items[0].brotherhood.label, 'San Esteban'); assert.equal(items[1].announcedOn, '2026-09-24') })
test('drafts and future documentation are not published', () => { assert.deepEqual(build(change({ status: 'draft' })), []); assert.deepEqual(build(change({ documentedOn: '2026-10-08' })), []) })
test('invalid and future announcement dates are rejected', () => { for (const date of ['2026-02-30', '2026-10-08', 'tomorrow']) assert.deepEqual(build(change({ announcedOn: date })), []) })
test('date-only labels remain stable across timezone changes', () => { assert.equal(hiloDayLabel('2026-10-06'), '6 de octubre de 2026'); assert.equal(validHiloDay('2024-02-29'), true); assert.equal(validHiloDay('2026-02-29'), false) })
test('unknown announcement dates are not inferred from technical dates', () => { const [item] = build(change({ announcedOn: null, created_at: '2020-01-01' })); assert.equal(item.announcedOn, null); assert.equal(item.documentedOn, '2026-10-07') })
test('unpublished or incorrectly typed root hides the entire story', () => { for (const patch of [{status:'draft'}, {entity_type:'band'}]) assert.equal(build(HILO_MOVEMENTS, entities.map((e) => e.id === roots[0].id ? { ...e, ...patch } : e)).length, 1) })
test('unpublished related entities never create links', () => { const id = HILO_MOVEMENTS[0].relations[0].id; const [item] = build(HILO_MOVEMENTS, entities.filter((e) => e.id !== id)); assert.equal(item.relations.some((e) => e.id === id), false) })
test('unknown and invalid slugs never become URLs', () => { const rows = entities.map((e) => e.id === roots[0].id ? { ...e, slug: '//evil.example' } : e); assert.equal(build(HILO_MOVEMENTS, rows).length, 1) })
test('duplicate event from multiple sources is one chapter', () => { const items = build([...HILO_MOVEMENTS, { ...HILO_MOVEMENTS[0], id: 'duplicate' }]); assert.equal(items.length, 2) })
test('sources must be identified HTTPS links without embedded credentials', () => { for (const href of ['javascript:alert(1)', 'http://example.com', 'https://user:pass@example.com']) assert.equal(build(change({ sources: [{ label:'Source', href }] })).length, 0); assert.equal(build(change({ sources: [] })).length, 0) })
test('discovery rejects external and protocol-relative URLs', () => { for (const href of ['//example.com', 'https://example.com', '/\\example.com']) assert.equal(build(change({ discover:{ label:'Read', href } }))[0].discover, null) })
test('brotherhood selection happens before limiting', () => { const items = build(); const result = selectHiloMovements(items, { brotherhoodId: roots[1].id, limit:1 }); assert.equal(result[0].brotherhood.id, roots[1].id) })
test('home diversity does not repeat the same brotherhood', () => { const items = build(); const result = selectHiloMovements([items[0], {...items[0],id:'other'}, items[1]], { diverse:true }); assert.equal(result.length, 2); assert.deepEqual(selectHiloMovements(items,{limit:0}), []) })
test('search is accent-insensitive, including related bands', () => { assert.equal(filterHiloMovements(build(), {q:'cigarreras'}).length,1); assert.equal(filterHiloMovements(build(),{q:['santa ana','ignored']}).length,1); assert.equal(filterHiloMovements(build(),{municipio:'Utrera'}).length,0); assert.equal(filterHiloMovements(build(),{tema:'agenda'}).length,0) })
test('the pilot preserves musical identities, positions and documented dates', () => { const [first,second] = HILO_MOVEMENTS; assert.match(first.title,/Desamparados/); assert.equal(first.relations[0].id,'a23934c9-93e9-4bf1-886e-d98ec170b74f'); assert.equal(second.relations.length,3); assert.equal(second.announcedOn,'2026-09-24') })
test('public reader uses published visibility and no privileged credentials', () => { const source=readFileSync(new URL('../lib/supabase/hilo-movements.js',import.meta.url),'utf8'); assert.match(source,/eq\('status', 'published'\)/); assert.doesNotMatch(source,/service_role|createAdminClient|updated_at|created_at/) })
test('notification system is not repurposed as editorial news', () => { const source=readFileSync(new URL('../components/HiloUpdates.js',import.meta.url),'utf8'); assert.match(source,/Lo último que hemos incorporado/); assert.doesNotMatch(source,/HiloMovementsSection/) })
