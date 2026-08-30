import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const migrationPath = new URL('../supabase/migrations/20260830084624_calendario_igualas_ensayos.sql', import.meta.url)
const buenAireMigrationPath = new URL('../supabase/migrations/20260830090233_publica_iguala_buen_aire_2026.sql', import.meta.url)

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
