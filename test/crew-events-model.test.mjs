import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const migrationPath = new URL('../supabase/migrations_archive/first-edition/20260830084624_calendario_igualas_ensayos.sql', import.meta.url)
const buenAireMigrationPath = new URL('../supabase/migrations_archive/first-edition/20260830090233_publica_iguala_buen_aire_2026.sql', import.meta.url)
const rosarioSantiagoMigrationPath = new URL('../supabase/migrations_archive/first-edition/20260831061147_publica_iguala_rosario_santiago_2026.sql', import.meta.url)
const septemberCallsMigrationPath = new URL('../supabase/migrations/20260831074355_publica_tres_igualas_septiembre_2026.sql', import.meta.url)
const pastoraTrianaMigrationPath = new URL('../supabase/migrations/20260831213932_publica_iguala_divina_pastora_triana_2026.sql', import.meta.url)

test('el calendario reutiliza la entidad event y crea relaciones tipadas con Pasos y Personas', async () => {
  const sql = await readFile(migrationPath, 'utf8')

  assert.match(sql, /event_category text not null default 'historical'/)
  assert.match(sql, /brotherhood_entity_id uuid references public\.entities/)
  assert.match(sql, /create table public\.crew_event_steps/)
  assert.match(sql, /create table public\.crew_event_agents/)
  assert.match(sql, /guard_crew_event_link\('step'\)/)
  assert.match(sql, /guard_crew_event_link\('agent'\)/)
})

test('la agenda nueva expone solo extremos publicados y conserva permisos editoriales explícitos', async () => {
  const sql = await readFile(migrationPath, 'utf8')

  assert.match(sql, /alter table public\.crew_event_steps enable row level security/)
  assert.match(sql, /alter table public\.crew_event_agents enable row level security/)
  assert.match(sql, /grant select on table public\.crew_event_steps to anon/)
  assert.match(sql, /grant select on table public\.crew_event_agents to anon/)
  assert.match(sql, /create policy "Published crew event steps"/)
  assert.match(sql, /create policy "Published crew event agents"/)
  assert.match(sql, /event_entity\.status = 'published'/)
  assert.match(sql, /target_status is distinct from 'published'/)
  assert.match(sql, /guard_published_crew_event_entity/)
})

test('la guarda polimórfica lee solo el campo disponible en cada tabla de relación', async () => {
  const sql = await readFile(buenAireMigrationPath, 'utf8')

  assert.match(sql, /if tg_table_name = 'crew_event_steps' then\s+target_id := new\.step_entity_id;\s+else\s+target_id := new\.agent_entity_id;/)
  assert.doesNotMatch(sql, /target_id := case/)
})

test('la primera igualá publicada conserva convocatoria, relaciones y fuente oficial', async () => {
  const sql = await readFile(buenAireMigrationPath, 'utf8')

  assert.match(sql, /'iguala-santa-maria-buen-aire-2026'/)
  assert.match(sql, /date '2026-09-10'/)
  assert.match(sql, /time '21:00'/)
  assert.match(sql, /'paso-procesional-santa-maria-buen-aire-sevilla'/)
  assert.match(sql, /'manuel-vizcaya-lopez'/)
  assert.match(sql, /https:\/\/hermandadpasionymuerte\.es\/\?p=3840/)
})

test('la igualá del Rosario de Santiago publica solo los datos anunciados y acredita la Hermandad', async () => {
  const sql = await readFile(rosarioSantiagoMigrationPath, 'utf8')

  assert.match(sql, /'iguala-rosario-santiago-alcala-2026'/)
  assert.match(sql, /date '2026-09-19'/)
  assert.match(sql, /time '18:30'/)
  assert.match(sql, /'paso-procesional-nuestra-senora-rosario-santiago-alcala'/)
  assert.match(sql, /event\.place_id is null/)
  assert.match(sql, /event\.location_text is null/)
  assert.match(sql, /event\.requirements is null/)
  assert.match(sql, /from public\.crew_event_agents relation/)
  assert.match(sql, /https:\/\/www\.facebook\.com\/100069128529775\/posts\/1114255717555369\//)
  assert.match(sql, /https:\/\/parroquiasantiagoalcala\.es\/rosario-de-santiago\//)
})


test('las igualás de Cuatrovitas, Guadalupe y Mercedes conservan datos y ausencias anunciadas', async () => {
  const sql = await readFile(septemberCallsMigrationPath, 'utf8')

  assert.match(sql, /'iguala-virgen-cuatrovitas-2026'/)
  assert.match(sql, /date '2026-09-01'/)
  assert.match(sql, /time '21:00'/)
  assert.match(sql, /'manuel-pinto-montero'/)
  assert.match(sql, /al menos un año de antigüedad/)
  assert.match(sql, /https:\/\/www\.instagram\.com\/p\/DcIxzvFM1M-\//)

  assert.match(sql, /'iguala-nuestra-senora-guadalupe-sevilla-2026'/)
  assert.match(sql, /date '2026-09-03'/)
  assert.match(sql, /time '20:30'/)
  assert.match(sql, /'jose-manuel-rechi'/)
  assert.match(sql, /https:\/\/hermandaddeguadalupe\.wordpress\.com\/2026\/08\/24\/iguala-de-costaleros-2026\//)

  assert.match(sql, /'iguala-mercedes-puerta-real-2026'/)
  assert.match(sql, /date '2026-09-12'/)
  assert.match(sql, /time '10:30'/)
  assert.match(sql, /no publica capataz ni requisitos/)
  assert.match(sql, /if call\.capataz_slug is null then/)
  assert.match(sql, /https:\/\/www\.facebook\.com\/MercedesPuertaReal\/photos\//)
  assert.match(sql, /delete from crew_calls_20260831 call\s+where not exists/)
  assert.match(sql, /brotherhood_entity\.status = 'published'/)
})


test('la igualá de la Divina Pastora de Triana separa convocatoria, capataz y comienzo de etapa', async () => {
  const sql = await readFile(pastoraTrianaMigrationPath, 'utf8')

  assert.match(sql, /'iguala-divina-pastora-triana-2026'/)
  assert.match(sql, /date '2026-09-03'/)
  assert.match(sql, /time '21:30'/)
  assert.match(sql, /Local del Bar Bistec, calle Pelay Correa, 37/)
  assert.match(sql, /Acudir con calzado blanco de salida/)
  assert.match(sql, /'miguel-angel-perez-pascual'/)
  assert.match(sql, /year_from = 2022/)
  assert.match(sql, /independiente de la convocatoria de la igualá/)
  assert.match(sql, /event\.place_id is null/)
  assert.match(sql, /1493386516157074/)
  assert.match(sql, /1429439689218424/)
  assert.match(sql, /gentedepaz\.es\/la-pastora-de-triana-nombra-nuevo-capataz/)
  assert.match(sql, /delete from crew_call_pastora_triana_20260831 call/)
})
