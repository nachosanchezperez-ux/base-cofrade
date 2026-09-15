import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const migration = readFileSync(new URL('../supabase/migrations_archive/post-first-edition-editorial/20260915130000_audita_acontecimientos_pasados_announced.sql', import.meta.url), 'utf8')
const inventory = readFileSync(new URL('../docs/AUDITORIA-PAST-ANNOUNCED-INVENTARIO-2026-09-15.csv', import.meta.url), 'utf8')

test('the audit is a narrow idempotent DML batch', () => {
  assert.doesNotMatch(migration, /\b(create|alter|drop|truncate)\s+(table|policy|type|schema)\b/i)
  assert.doesNotMatch(migration, /where\s+(event_date|outing_date|start_date|end_date)\s*</i)
  assert.equal((migration.match(/set "event_status" = 'held'/g) || []).length, 13)
  assert.equal((migration.match(/insert into public\."sources"/g) || []).length, 8)
  assert.equal((migration.match(/insert into public\."source_links"/g) || []).length, 9)
  assert.equal((migration.match(/on conflict \("id"\) do update/g) || []).length, 17)
})

test('every audited record is preserved in the complete initial inventory', () => {
  const lines = inventory.trim().split('\n')
  assert.equal(lines.length - 1, 125)
  assert.equal(lines.filter((line) => line.includes('"celebración confirmada"')).length, 13)
  assert.equal(lines.filter((line) => line.includes('"sin evidencia posterior suficiente"')).length, 112)
  assert.equal(lines.filter((line) => line.includes('"announced","held"')).length, 13)
})

test('the six null-end cult occurrences are counted from their start date', () => {
  for (const id of [
    '2a3a982b-8f32-413f-aecc-9b31a748f133',
    '7ab1add0-cf87-4b02-a15b-290086753d9e',
    'e04a30e6-757a-48bb-ac9a-e70f8f5421bf',
    'eb301dbb-b84d-44c6-9158-0f23317ab926',
    '38ca282e-f80f-40aa-9ee1-17232c04e6d4',
    'e8a729e6-3f7c-47ea-a2d1-7e8d0440ff64',
  ]) assert.match(inventory, new RegExp(id))
})
