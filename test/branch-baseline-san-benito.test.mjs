import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import test from 'node:test'

const migrationsDirectory = new URL('../supabase/migrations/', import.meta.url)
const archiveDirectory = new URL('../supabase/migrations_archive/first-edition/', import.meta.url)
const postBaselineArchiveDirectory = new URL('../supabase/migrations_archive/post-first-edition-editorial/', import.meta.url)
const baselineName = '20260831070000_first_edition_baseline.sql'
const securityName = '20260831071000_secure_public_contributions_reconciled.sql'
const logoBackgroundName = '20260831072000_add_band_logo_background_color.sql'
const membershipStatsName = '20260908083000_add_brotherhood_membership_stats.sql'
const musicalRepertoiresName = '20260910181542_crucetas_musicales.sql'
const musicalRepertoiresHardeningName = '20260910202000_reconcilia_seguridad_crucetas.sql'
const baseline = readFileSync(new URL(baselineName, migrationsDirectory), 'utf8')
const membershipStats = readFileSync(new URL(membershipStatsName, migrationsDirectory), 'utf8')
const seed = readFileSync(new URL('../supabase/seed.sql', import.meta.url), 'utf8')

test('las ramas nuevas ejecutan únicamente el baseline y las evoluciones de esquema', () => {
  const migrations = readdirSync(migrationsDirectory).filter((file) => file.endsWith('.sql')).sort()

  assert.deepEqual(migrations, [
    baselineName,
    securityName,
    logoBackgroundName,
    membershipStatsName,
    musicalRepertoiresName,
    musicalRepertoiresHardeningName,
  ])
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
  assert.match(seed, /on conflict \(id\) do nothing/)
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

test('el DML posterior al baseline permanece íntegro y fuera de la cadena ejecutable', () => {
  const archived = readdirSync(postBaselineArchiveDirectory)
    .filter((file) => file.endsWith('.sql'))
    .sort()

  assert.equal(archived.length, 91)
  assert.equal(archived[0], '20260831074355_publica_tres_igualas_septiembre_2026.sql')
  assert.equal(archived.at(-1), '20260911050000_actualiza_paletas_san_gonzalo_esencia.sql')
  assert.ok(archived.includes('20260831135520_publica_centuria_y_corrige_logo_tres_caidas.sql'))
})

test('la evolución de estadísticas es idempotente en preview y en producción reconciliada', () => {
  assert.match(membershipStats, /add column if not exists members_count integer/i)
  assert.match(membershipStats, /add column if not exists members_count_kind text/i)
  assert.match(membershipStats, /add column if not exists members_source_id uuid/i)
  assert.match(membershipStats, /if not exists \([\s\S]*?pg_constraint/i)
})
