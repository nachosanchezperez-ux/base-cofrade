import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import test from 'node:test'

const migrationsDirectory = new URL('../supabase/migrations/', import.meta.url)
const archiveDirectory = new URL('../supabase/migrations_archive/first-edition/', import.meta.url)
const baselineName = '20260831070000_first_edition_baseline.sql'
const securityName = '20260831071000_secure_public_contributions_reconciled.sql'
const baseline = readFileSync(new URL(baselineName, migrationsDirectory), 'utf8')
const seed = readFileSync(new URL('../supabase/seed.sql', import.meta.url), 'utf8')

test('las ramas nuevas ejecutan un baseline único antes de #439', () => {
  assert.deepEqual(
    readdirSync(migrationsDirectory).filter((file) => file.endsWith('.sql')).sort(),
    [baselineName, securityName],
  )
})

test('el baseline reproduce el esquema canónico y conserva las barreras RLS', () => {
  const schemaDeclarations = baseline.slice(0, baseline.indexOf('CREATE OR REPLACE FUNCTION'))

  assert.match(baseline, /create table public\.entities/)
  assert.match(baseline, /create table public\.contributions/)
  assert.match(baseline, /create view public\.calendar_items with \(security_invoker=true\)/)
  assert.match(baseline, /alter table public\.contributions enable row level security/)
  assert.match(baseline, /revoke all on all tables in schema public from public, anon, authenticated, service_role/)
  assert.doesNotMatch(schemaDeclarations, /insert into public\.(entities|brotherhoods|bands|contributions)/i)
})

test('el seed de preview es mínimo, idempotente y no contiene aportaciones', () => {
  assert.match(seed, /on conflict \(id\) do update set/)
  assert.match(seed, /banda-de-musica-del-maestro-tejera/)
  assert.match(seed, /las-cigarreras/)
  assert.doesNotMatch(seed, /insert into public\.contributions/i)
  assert.doesNotMatch(seed, /contact_email|panel_users|auth\.users/i)
})

test('el historial anterior permanece archivado y fuera de la cadena ejecutable', () => {
  const archived = readdirSync(archiveDirectory)
  assert.ok(archived.includes('20260818133048_consolidar_san_benito.sql'))
  assert.ok(archived.includes('20260819130530_logotipo_portadas_puebla.sql'))
  assert.ok(archived.includes('20260831061147_publica_iguala_rosario_santiago_2026.sql'))
})
