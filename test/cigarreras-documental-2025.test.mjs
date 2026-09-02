import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const migrationPath =
  'supabase/migrations/20260902102751_completa_las_cigarreras_2025_y_fuentes.sql'

const migration = readFileSync(new URL(`../${migrationPath}`, import.meta.url), 'utf8')

test('completa los dos estrenos absolutos de Las Cigarreras en 2025', () => {
  assert.match(migration, /'Sanctae Crucis'/)
  assert.match(migration, /'Soberano'/)
  assert.match(migration, /date '2025-02-21'/)
  assert.match(migration, /date '2025-02-07'/)
  assert.match(migration, /Tipo de novedad: estreno absoluto/)
})

test('reutiliza autores y hermandades canónicos antes de relacionar', () => {
  assert.match(migration, /slug = 'cristobal-lopez-gandara'/)
  assert.match(migration, /slug = 'pedro-manuel-pacheco-palomo'/)
  assert.match(migration, /slug = 'santa-cruz-cerrillo-santa-elena-villalba-alcor'/)
  assert.match(migration, /slug = 'hermandad-de-san-gonzalo'/)
  assert.doesNotMatch(migration, /insert into public\.agents/i)
})

test('documenta San Bernardo y elimina notas redundantes sin tocar el esquema', () => {
  assert.match(migration, /e1300000-0000-0000-0000-000000000001/)
  assert.match(migration, /nuestra-semana-santa-2025-2/)
  assert.match(migration, /set notes = null, updated_at = now\(\)/)
  assert.doesNotMatch(migration, /create\s+(table|policy|index)|alter\s+table/i)
})

test('enlaza las grabaciones existentes sin duplicar pistas', () => {
  assert.match(migration, /update public\.band_release_tracks/)
  assert.match(migration, /Sanctae Crucis - Santo Ángel 2025/)
  assert.match(migration, /Soberano - San Gonzalo 2025/)
  assert.doesNotMatch(migration, /insert into public\.band_release_tracks/i)
})
