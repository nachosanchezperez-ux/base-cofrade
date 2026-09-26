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
const brotherhoodHabitGlovesName = '20260915215828_add_brotherhood_habit_gloves.sql'
const concertEventCategoryName = '20260916062208_allow_concert_event_category.sql'
const concertEventBandsName = '20260916062216_create_concert_event_bands.sql'
const concertEventBandsSecurityName = '20260916062223_secure_concert_event_bands.sql'
const sourceLinksLookupIndexesName = '20260916205306_source_links_public_lookup_indexes.sql'
const sourceLinksSourceIndexName = '20260916220756_add_source_links_source_id_index.sql'
const editorialFreshnessName = '20260921234430_add_entity_editorial_freshness.sql'
const editorialPriorityName = '20260922044145_add_editorial_priority_view.sql'
const editorialPriorityContentDateFixName = '20260922045453_fix_editorial_priority_content_date.sql'
const homeKnowledgeCacheName = '20260925051118_home_knowledge_threads_cache.sql'
const homeKnowledgeCachePrivateName = '20260925051336_home_knowledge_threads_cache_private.sql'
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
    brotherhoodHabitGlovesName,
    concertEventCategoryName,
    concertEventBandsName,
    concertEventBandsSecurityName,
    sourceLinksLookupIndexesName,
    sourceLinksSourceIndexName,
    editorialFreshnessName,
    editorialPriorityName,
    editorialPriorityContentDateFixName,
    homeKnowledgeCacheName,
    homeKnowledgeCachePrivateName,
  ])
})

test('la prioridad editorial distingue actualización de contenido y actualización técnica', () => {
  const migration = readFileSync(new URL(editorialPriorityContentDateFixName, migrationsDirectory), 'utf8')
  assert.match(migration, /coalesce\(t\.content_updated_at, t\.updated_at\)/i)
  assert.match(migration, /coalesce\(s\.content_updated_at, s\.updated_at\)/i)
  assert.doesNotMatch(migration, /when s\.updated_at >= now\(\) - interval '14 days'/i)
})

test('la prioridad editorial es dinámica, privada y respeta RLS', () => {
  const migration = readFileSync(new URL(editorialPriorityName, migrationsDirectory), 'utf8')
  assert.match(migration, /create or replace view public\.entity_editorial_priority/i)
  assert.match(migration, /security_invoker\s*=\s*true/i)
  assert.match(migration, /revoke all on public\.entity_editorial_priority from public, anon/i)
  assert.match(migration, /grant select on public\.entity_editorial_priority to authenticated, service_role/i)
  assert.match(migration, /priority_score\s*>=\s*90/i)
  assert.match(migration, /priority_score\s*>=\s*70/i)
  assert.match(migration, /priority_score\s*>=\s*55/i)
})

test('las consultas públicas de Fuentes disponen de índices reproducibles', () => {
  const lookupMigration = readFileSync(new URL(sourceLinksLookupIndexesName, migrationsDirectory), 'utf8')
  const sourceIndexMigration = readFileSync(new URL(sourceLinksSourceIndexName, migrationsDirectory), 'utf8')

  assert.match(lookupMigration, /source_links_entity_idx/i)
  assert.match(lookupMigration, /source_links_cult_idx/i)
  assert.match(lookupMigration, /source_links_heritage_update_idx/i)
  assert.match(lookupMigration, /source_links_intervention_idx/i)
  assert.match(lookupMigration, /source_links_step_phase_idx/i)
  assert.match(lookupMigration, /source_links_outing_series_idx/i)
  assert.match(lookupMigration, /source_links_music_period_idx/i)
  assert.match(sourceIndexMigration, /create index if not exists source_links_source_id_idx/i)
  assert.match(sourceIndexMigration, /on public\.source_links using btree \(source_id\)/i)
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

  assert.equal(archived.length, 144)
  assert.equal(archived[0], '20260831074355_publica_tres_igualas_septiembre_2026.sql')
  assert.equal(archived.at(-1), '20260926113000_apply_moron_decimo_macrolote_hc016.sql')
  assert.ok(archived.includes('20260926103000_dry_run_moron_decimo_macrolote_hc016.sql'))
  assert.ok(archived.includes('20260926113000_apply_moron_decimo_macrolote_hc016.sql'))
  assert.ok(archived.includes('20260925083000_preflight_ecija_noveno_macrolote_hc016.sql'))
  assert.ok(archived.includes('20260925093000_apply_ecija_noveno_macrolote_hc016.sql'))
  assert.ok(archived.includes('20260925050000_preflight_carmona_octavo_macrolote_hc016.sql'))
  assert.ok(archived.includes('20260925070000_apply_carmona_octavo_macrolote_hc016.sql'))
  assert.ok(archived.includes('20260925070500_post_apply_qa_carmona_hc016.sql'))
  assert.ok(archived.includes('20260925071000_reconcile_staging_carmona_post_apply_hc016.sql'))
  assert.ok(archived.includes('20260923163000_publica_cruceta_carmen_estepa_2026.sql'))
  assert.ok(archived.includes('20260921193000_publica_cruceta_sangre_gerena_2026.sql'))
  assert.ok(archived.includes('20260921053535_actualiza_discografias_gerena_rosario_d02c.sql'))
  assert.ok(archived.includes('20260918223000_enlaza_pasos_salidas_coria_del_rio.sql'))
  assert.ok(archived.includes('20260919120000_preflight_estepa_quinto_macrolote_hc016.sql'))
  assert.ok(archived.includes('20260920090000_preflight_lebrija_sexto_macrolote_hc016.sql'))
  assert.ok(archived.includes('20260920180000_preflight_osuna_septimo_macrolote_hc016.sql'))
  assert.ok(archived.includes('20260917070000_cierra_cantillana_macrolote_municipal.sql'))
  assert.ok(archived.includes('20260916230000_cierra_alcala_guadaira_macrolote_municipal.sql'))
  assert.ok(archived.includes('20260916210000_cierra_dos_hermanas_macrolote_municipal.sql'))
  assert.ok(archived.includes('20260916193000_cierra_pilas_macrolote_municipal.sql'))
  assert.ok(archived.includes('20260916150000_cierra_gerena_macrolote_municipal.sql'))
  assert.ok(archived.includes('20260915230129_estabiliza_caratulas_oliva_salteras.sql'))
  assert.ok(archived.includes('20260915213000_cierra_trazabilidad_bandas_publicas.sql'))
  assert.ok(archived.includes('20260915113000_cierra_santa_ana_dos_hermanas.sql'))
  assert.ok(archived.includes('20260915180000_cierra_vera_cruz_alcala_del_rio.sql'))
  assert.ok(archived.includes('20260915130000_audita_acontecimientos_pasados_announced.sql'))
  assert.ok(archived.includes('20260915160000_cierra_glorias_octubre_sevilla.sql'))
  assert.ok(archived.includes('20260914235000_publica_cruceta_san_gonzalo_2026.sql'))
  assert.ok(archived.includes('20260914151000_documenta_horarios_invierno_macarena.sql'))
  assert.ok(archived.includes('20260914154000_cierra_jueves_santo_sevilla.sql'))
  assert.ok(archived.includes('20260914173500_clasifica_agrupaciones_parroquiales.sql'))
  assert.ok(archived.includes('20260914233000_cierra_viernes_santo_sevilla.sql'))
  assert.ok(archived.includes('20260914210000_cierra_miercoles_santo_sevilla.sql'))
  assert.ok(archived.includes('20260914210000_cierra_glorias_septiembre_sevilla.sql'))
  assert.ok(archived.includes('20260914230000_cierra_domingo_ramos_sevilla.sql'))
  assert.ok(archived.includes('20260914190000_cierra_martes_santo_sevilla.sql'))
  assert.ok(archived.includes('20260914130000_cierra_sabado_santo_sevilla.sql'))
  assert.ok(archived.includes('20260914120000_cierra_madruga_sevilla.sql'))
  assert.ok(archived.includes('20260914021602_cierra_sagrada_resurreccion_sevilla.sql'))
  assert.ok(archived.includes('20260913224245_cierra_santo_entierro_dos_hermanas.sql'))
  assert.ok(archived.includes('20260913214000_aplica_paletas_seis_bandas.sql'))
  assert.ok(archived.includes('20260913210000_cierra_divina_misericordia_rosario_santiago.sql'))
  assert.ok(archived.includes('20260913213359_publica_cruceta_pastora_padre_pio_2026.sql'))
  assert.ok(archived.includes('20260913193000_publica_cruceta_castillo_lebrija_2026.sql'))
  assert.ok(archived.includes('20260913161000_cierra_guadalupe_san_buenaventura.sql'))
  assert.ok(archived.includes('20260913154500_publica_curiosidad_rosario_corona_2025.sql'))
  assert.ok(archived.includes('20260831135520_publica_centuria_y_corrige_logo_tres_caidas.sql'))
})

test('la evolución de estadísticas es idempotente en preview y en producción reconciliada', () => {
  assert.match(membershipStats, /add column if not exists members_count integer/i)
  assert.match(membershipStats, /add column if not exists members_count_kind text/i)
  assert.match(membershipStats, /add column if not exists members_source_id uuid/i)
  assert.match(membershipStats, /if not exists \([\s\S]*?pg_constraint/i)
})
