import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile } from 'node:fs/promises'

const MIGRATION_PATH = '../supabase/migrations/20260823231639_complete_core_relation_invariant.sql'

async function migrationSource() {
  return readFile(new URL(MIGRATION_PATH, import.meta.url), 'utf8')
}

test('la publicación de una relación bloquea ambos extremos mientras valida su estado', async () => {
  const sql = await migrationSource()

  assert.match(sql, /create or replace function public\.guard_core_relation_publication\(\)/i)
  assert.match(sql, /security definer/i)
  assert.match(sql, /set search_path = ''/i)

  const shareLocks = sql.match(/for share/gi) || []
  assert.equal(shareLocks.length, 2)

  assert.match(sql, /source_status is distinct from 'published'/i)
  assert.match(sql, /target_status is distinct from 'published'/i)
  assert.match(sql, /new\.status := 'draft'/i)
  assert.match(sql, /revoke all on function public\.guard_core_relation_publication\(\) from public/i)
})

test('despublicar o cambiar el tipo de un extremo degrada sus relaciones nucleares', async () => {
  const sql = await migrationSource()

  assert.match(sql, /create or replace function public\.demote_invalid_core_relations_after_entity_change\(\)/i)
  assert.match(sql, /create trigger entities_demote_invalid_core_relations/i)
  assert.match(sql, /after update of status, entity_type on public\.entities/i)
  assert.match(sql, /old\.status is distinct from new\.status/i)
  assert.match(sql, /old\.entity_type is distinct from new\.entity_type/i)
  assert.match(sql, /revoke all on function public\.demote_invalid_core_relations_after_entity_change\(\) from public/i)

  for (const table of ['brotherhood_images', 'brotherhood_steps', 'image_steps']) {
    assert.match(
      sql,
      new RegExp(`update public\\.${table} relation[\\s\\S]*set status = 'draft'`, 'i'),
    )
  }
})

test('el cierre del invariante no altera las proyecciones públicas deliberadas', async () => {
  const sql = await migrationSource()

  assert.doesNotMatch(sql, /music_accompaniment_periods/i)
  assert.doesNotMatch(sql, /march_dedications/i)
})
