import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile } from 'node:fs/promises'

const MIGRATION_PATH = '../supabase/migrations_archive/first-edition/20260823230534_guard_core_public_relations.sql'

async function migrationSource() {
  return readFile(new URL(MIGRATION_PATH, import.meta.url), 'utf8')
}

test('las relaciones nucleares solo se publican con extremos publicados y del tipo correcto', async () => {
  const sql = await migrationSource()

  assert.match(sql, /create or replace function public\.guard_core_relation_publication\(\)/i)
  assert.match(sql, /security definer/i)
  assert.match(sql, /new\.status := 'draft'/i)
  assert.match(sql, /source_entity_type is distinct from tg_argv\[2\]/i)
  assert.match(sql, /target_entity_type is distinct from tg_argv\[3\]/i)
  assert.match(sql, /source_status is distinct from 'published'/i)
  assert.match(sql, /target_status is distinct from 'published'/i)

  for (const trigger of [
    'brotherhood_images_guard_publication',
    'brotherhood_steps_guard_publication',
    'image_steps_guard_publication',
  ]) {
    assert.match(sql, new RegExp(`create trigger ${trigger}`, 'i'))
  }

  for (const table of ['brotherhood_images', 'brotherhood_steps', 'image_steps']) {
    assert.match(sql, new RegExp(`update public\\.${table} relation[\\s\\S]*set status = 'draft'`, 'i'))
  }
})

test('la lectura pública de cada relación nuclear comprueba ambos extremos', async () => {
  const sql = await migrationSource()

  assert.match(sql, /create policy "Published brotherhood image relations"[\s\S]*brotherhood\.entity_type = 'brotherhood'[\s\S]*image\.entity_type = 'image'/i)
  assert.match(sql, /create policy "Published brotherhood step relations"[\s\S]*brotherhood\.entity_type = 'brotherhood'[\s\S]*step\.entity_type = 'step'/i)
  assert.match(sql, /create policy "Published image step relations"[\s\S]*image\.entity_type = 'image'[\s\S]*step\.entity_type = 'step'/i)

  const publishedChecks = sql.match(/\.status = 'published'/gi) || []
  assert.ok(publishedChecks.length >= 15)
})

test('el corte no altera las proyecciones públicas deliberadas de música', async () => {
  const sql = await migrationSource()

  assert.doesNotMatch(sql, /update public\.music_accompaniment_periods/i)
  assert.doesNotMatch(sql, /on public\.music_accompaniment_periods/i)
  assert.doesNotMatch(sql, /update public\.march_dedications/i)
  assert.doesNotMatch(sql, /on public\.march_dedications/i)
})
