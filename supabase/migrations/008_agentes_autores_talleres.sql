-- Hilo Cofrade · Agentes, autores y talleres
-- Migración 008
--
-- Unifica personas, talleres, empresas e instituciones para evitar duplicados.
-- Una misma entidad puede intervenir en imágenes, pasos, restauraciones,
-- marchas, bandas o responsabilidades procesionales.

-- -----------------------------------------------------------------------------
-- Ajuste de terminología de conservación de pasos
-- -----------------------------------------------------------------------------

-- Relación con la hermandad se deduce de brotherhood_steps y sus fechas:
-- Paso actual / Paso antiguo.
-- El estado de conservación queda limitado a tres situaciones claras.
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
-- Datos adicionales del agente
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
-- Disciplinas
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

-- Ejemplos previstos: Imaginería, Escultura, Restauración, Bordado,
-- Orfebrería, Talla, Dorado, Diseño, Carpintería, Composición,
-- Dirección musical, Capataz, Fotografía, Pintura.

-- -----------------------------------------------------------------------------
-- Vinculación entre personas y talleres / empresas / instituciones
-- -----------------------------------------------------------------------------

create table public.agent_affiliations (
  id uuid primary key default gen_random_uuid(),
  member_agent_entity_id uuid not null references public.entities(id) on delete cascade,
  organization_agent_entity_id uuid not null references public.entities(id) on delete cascade,
  role_name text,
  date_from date,
  date_from_text text,
  date_to date,
  date_to_text text,
  is_current boolean not null default false,
  notes text,
  status text not null default 'published' check (status in ('draft','review','published','archived')),
  created_at timestamptz not null default now(),
  constraint agent_affiliations_not_self check (member_agent_entity_id <> organization_agent_entity_id),
  unique (member_agent_entity_id, organization_agent_entity_id, role_name, date_from)
);

create index agent_affiliations_member_idx
  on public.agent_affiliations(member_agent_entity_id, is_current);
create index agent_affiliations_org_idx
  on public.agent_affiliations(organization_agent_entity_id, is_current);

-- -----------------------------------------------------------------------------
-- Fuentes específicas
-- -----------------------------------------------------------------------------

alter table public.source_links
  add column if not exists agent_name_id uuid references public.agent_names(id) on delete cascade,
  add column if not exists agent_role_id uuid references public.agent_roles(id) on delete cascade,
  add column if not exists agent_affiliation_id uuid references public.agent_affiliations(id) on delete cascade;

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
      agent_role_id,
      agent_affiliation_id
    ) = 1
  );

-- -----------------------------------------------------------------------------
-- RLS
-- -----------------------------------------------------------------------------

alter table public.agent_names enable row level security;
alter table public.agent_disciplines enable row level security;
alter table public.agent_affiliations enable row level security;

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

create policy "Published agent affiliations"
on public.agent_affiliations for select
using (status = 'published');

-- -----------------------------------------------------------------------------
-- Vistas de actividad
-- -----------------------------------------------------------------------------

-- Obras e intervenciones vinculadas a cada agente. La vista no pretende
-- homogeneizar todos los campos, sino permitir construir una ficha pública
-- de autor/taller con bloques por tipo de actividad.
create or replace view public.agent_activity as
select
  ia.agent_entity_id,
  'image_authorship'::text as activity_type,
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
  'step_phase'::text,
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
  'heritage_intervention'::text,
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
  'march_authorship'::text,
  ma.march_entity_id,
  me.name,
  ma.author_role,
  null::date,
  null::text,
  ma.notes
from public.march_authors ma
join public.entities me on me.id = ma.march_entity_id

union all

select
  ba.agent_entity_id,
  'band_role'::text,
  ba.band_entity_id,
  be.name,
  ba.role_name,
  ba.date_from,
  ba.date_from_text,
  ba.notes
from public.band_agents ba
join public.entities be on be.id = ba.band_entity_id

union all

select
  spp.agent_entity_id,
  'step_personnel'::text,
  spp.step_entity_id,
  se.name,
  spp.role_name,
  spp.date_from,
  coalesce(spp.date_from_text, spp.year_from::text),
  spp.notes
from public.step_personnel_periods spp
join public.entities se on se.id = spp.step_entity_id
where spp.status = 'published';

-- Resumen básico para buscador/ficha.
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
