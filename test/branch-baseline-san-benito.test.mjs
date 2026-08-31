import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import test from 'node:test'

const migrationsDirectory = new URL('../supabase/migrations/', import.meta.url)
const baselineName = '20260818130000_branch_baseline_san_benito.sql'
const consolidationName = '20260818133048_consolidar_san_benito.sql'
const baseline = readFileSync(new URL(baselineName, migrationsDirectory), 'utf8')
const discographyBaselineName = '20260819100000_branch_baseline_cigarreras_releases.sql'
const discographyCoverName = '20260819102713_portadas_discografia_cigarreras.sql'
const discographyBaseline = readFileSync(new URL(discographyBaselineName, migrationsDirectory), 'utf8')

test('el baseline reutilizable precede a la consolidación histórica de San Benito', () => {
  const migrations = readdirSync(migrationsDirectory).sort()

  assert.ok(migrations.indexOf(baselineName) >= 0)
  assert.ok(migrations.indexOf(baselineName) < migrations.indexOf(consolidationName))
})

test('el baseline de discografía precede a la migración histórica de portadas', () => {
  const migrations = readdirSync(migrationsDirectory).sort()

  assert.ok(migrations.indexOf(discographyBaselineName) >= 0)
  assert.ok(migrations.indexOf(discographyBaselineName) < migrations.indexOf(discographyCoverName))
  assert.match(discographyBaseline, /on conflict \(band_entity_id, title, release_year\) do nothing/)
  assert.match(discographyBaseline, /release_count <> 9/)
})

test('el baseline es idempotente y conserva los identificadores canónicos', () => {
  for (const canonicalId of [
    '206cf962-fd63-4fae-ad0d-9454554283d8',
    '2c49d077-e377-492d-8e30-25fa823bdcd8',
    'ddda6dd4-a9d6-44f6-b269-02c40903d5ea',
    '9bd34c93-150e-40b7-9e99-2b66f3bd0f25',
  ]) {
    assert.match(baseline, new RegExp(canonicalId))
  }

  assert.match(baseline, /on conflict \(id\) do nothing/)
  assert.match(baseline, /where municipality\.slug = 'sevilla'/)
  assert.match(baseline, /Baseline San Benito: no se pudieron reconstruir los tres Pasos/)
  assert.doesNotMatch(baseline, /update public\.entities[\s\S]*status = 'draft'/)
})
