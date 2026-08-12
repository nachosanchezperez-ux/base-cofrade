-- Hilo Cofrade · Autores y talleres
-- Migración 008
--
-- Personas, talleres, empresas e instituciones se mantienen como agentes internos
-- reutilizables, pero sus fichas editoriales se centran en las obras y trabajos
-- documentados. Un taller no se modela como un directorio de integrantes.
-- Colaboraciones entre autores/talleres se documentan en cada obra o intervención.

-- -----------------------------------------------------------------------------
-- Ajuste de terminología de conservación de pasos
-- -----------------------------------------------------------------------------

-- Relación con la hermandad: Paso actual / Paso antiguo.
-- Estado de conservación: Se conserva / Se conserva parcialmente / No se conserva.
alter table public.steps
  drop constraint if exists steps_current_condition_check;

update public.steps
set current_condition = case
  when current_condition in ('in_use','stored','transferred','sold') then 'preserved'
  when current_condition in ('partially_preserved','dismantled') then 'partially_preserved'
  when current_condition in ('lost','unknown') then 'not_preserved'
  else current_condition
end
where current_condition is not null;

alter table public.steps
  add constraint steps_current_condition_check check (
    current_condition is null or current_condition in (
      'preserved','partially_preserved','not_preserved'
    )
  );

-- -----------------------------------------------------------------------------
-- Datos adicionales del autor/taller
-- -----------------------------------------------------------------------------

alter table public.agents
  add column if not exists birth_or_foundation_date date,
  add column if not exists death_or_end_date date,
  add column if not exists address text,
  add column if not exists email text,
  add column if not exists phone text,
  add column if not exists active_notes text;

-- -----------------------------------------------------------------------------
-- Nombres históricos, comerciales y alias
-- -----------------------------------------------------------------------------

create table public.agent_names (
  id uuid primary key default gen_random_uuid(),
  agent_entity_id uuid not null references public.entities(id) on delete cascade,
  name text not null,
  name_type text not null default 'official' check (name_type in (
    'official','commercial','former','artistic','alias','acronym'
  )),
  date_from date,
  date_from_text text,
  date_to date,
  date_to_text text,
  is_current boolean not null default false,
  notes text,
  created_at timestamptz not null default now(),
  unique (agent_entity_id, name, date_from)
);

create index agent_names_agent_idx on public.agent_names(agent_entity_id, is_current);

-- -----------------------------------------------------------------------------
-- Especialidades internas para clasificación y búsqueda
-- -----------------------------------------------------------------------------

create table public.agent_disciplines (
  id uuid primary key default gen_random_uuid(),
  agent_entity_id uuid not null references public.entities(id) on delete cascade,
  discipline text not null,
  is_primary boolean not null default false,
  notes text,
  unique (agent_entity_id, discipline)
);

create index agent_disciplines_agent_idx on public.agent_disciplines(agent_entity_id);
create index agent_disciplines_name_idx on public.agent_disciplines(discipline);

-- Estas disciplinas sirven para búsqueda, filtrado y rotulación breve bajo el nombre.
-- No implican una pestaña pública propia.
-- Ejemplos: Imaginería, Escultura, Restauración, Bordado, Orfebrería,
-- Talla, Dorado, Diseño, Carpintería, Composición, Fotografía, Pintura.

-- -----------------------------------------------------------------------------
-- Fuentes específicas
-- -----------------------------------------------------------------------------

alter table public.source_links
  add column if not exists agent_name_id uuid references public.agent_names(id) on delete cascade,
  add column if not exists agent_role_id uuid references public.agent_roles(id) on delete cascade;

alter table public.source_links
  drop constraint if exists source_links_one_target;

alter table public.source_links
  add constraint source_links_one_target check (
    num_nonnulls(
      entity_id,
      outing_id,
      cult_id,
      intervention_id,
      heritage_update_id,
      editorial_content_id,
      music_accompaniment_period_id,
      march_dedication_id,
      march_recording_id,
      image_authorship_id,
      brotherhood_image_id,
      entity_location_id,
      entity_relation_id,
      step_phase_id,
      step_personnel_period_id,
      brotherhood_step_id,
      image_step_id,
      agent_name_id,
      agent_role_id
    ) = 1
  );

-- -----------------------------------------------------------------------------
-- RLS
-- -----------------------------------------------------------------------------

alter table public.agent_names enable row level security;
alter table public.agent_disciplines enable row level security;

create policy "Public agent names"
on public.agent_names for select
using (
  exists (
    select 1 from public.entities e
    where e.id = agent_entity_id and e.status = 'published'
  )
);

create policy "Public agent disciplines"
on public.agent_disciplines for select
using (
  exists (
    select 1 from public.entities e
    where e.id = agent_entity_id and e.status = 'published'
  )
);

-- -----------------------------------------------------------------------------
-- Catálogo de obras y trabajos
-- -----------------------------------------------------------------------------

-- Esta vista es el corazón de la ficha de autor/taller.
-- Las obras no se cargan de nuevo en su perfil: aparecen desde las relaciones
-- creadas en Imágenes, Pasos, Restauraciones, Marchas, etc.
create or replace view public.agent_activity as
select
  ia.agent_entity_id,
  'image'::text as activity_type,
  ia.image_entity_id as related_entity_id,
  ie.name as related_entity_name,
  ia.role_name as role_name,
  ia.date_from as activity_date,
  ia.date_from_text as activity_date_text,
  ia.notes
from public.image_authorships ia
join public.entities ie on ie.id = ia.image_entity_id
where ia.status = 'published'

union all

select
  spa.agent_entity_id,
  'step'::text,
  sp.step_entity_id,
  se.name,
  coalesce(spa.role_name, spa.discipline),
  sp.date_from,
  sp.date_from_text,
  spa.notes
from public.step_phase_agents spa
join public.step_phases sp on sp.id = spa.step_phase_id
join public.entities se on se.id = sp.step_entity_id
where sp.status = 'published'

union all

select
  hi.agent_entity_id,
  'intervention'::text,
  hi.target_entity_id,
  te.name,
  coalesce(hi.intervention_type, hi.discipline),
  hi.date_from,
  hi.date_from_text,
  hi.description
from public.heritage_interventions hi
join public.entities te on te.id = hi.target_entity_id
where hi.status = 'published'

union all

select
  ma.agent_entity_id,
  'march'::text,
  ma.march_entity_id,
  me.name,
  ma.author_role,
  null::date,
  null::text,
  ma.notes
from public.march_authors ma
join public.entities me on me.id = ma.march_entity_id;

-- Resumen para buscador y cabecera de ficha.
create or replace view public.agent_profile_summary as
select
  a.entity_id,
  e.name,
  a.agent_kind,
  m.name as municipality_name,
  a.foundation_or_birth_text,
  a.death_or_end_text,
  array_remove(array_agg(distinct ad.discipline), null) as disciplines
from public.agents a
join public.entities e on e.id = a.entity_id
left join public.municipalities m on m.id = a.municipality_id
left join public.agent_disciplines ad on ad.agent_entity_id = a.entity_id
where e.status = 'published'
group by a.entity_id, e.name, a.agent_kind, m.name, a.foundation_or_birth_text, a.death_or_end_text;

-- Nota funcional:
-- Un taller no tiene un módulo de integrantes.
-- Cuando una obra tenga varios autores, colaboradores o talleres, cada uno se
-- relaciona directamente con esa obra/fase/intervención con su papel concreto.
