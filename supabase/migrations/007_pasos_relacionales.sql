-- Hilo Cofrade · Pasos
-- Migración 007
--
-- Completa el modelo de pasos con:
-- 1) Datos técnicos y constructivos
-- 2) Fases de ejecución y talleres
-- 3) Elementos patrimoniales reutilizables
-- 4) Capataces y otros responsables por periodos
-- 5) Fuentes específicas para relaciones históricas

-- -----------------------------------------------------------------------------
-- Datos técnicos del paso
-- -----------------------------------------------------------------------------

alter table public.steps
  add column if not exists style text,
  add column if not exists materials text,
  add column if not exists dimensions_text text,
  add column if not exists length_cm numeric(8,2),
  add column if not exists width_cm numeric(8,2),
  add column if not exists height_cm numeric(8,2),
  add column if not exists workbenches_count integer,
  add column if not exists carrier_system text,
  add column if not exists execution_date_text text,
  add column if not exists current_state_notes text;

-- -----------------------------------------------------------------------------
-- Fases de ejecución
-- -----------------------------------------------------------------------------

create table public.step_phases (
  id uuid primary key default gen_random_uuid(),
  step_entity_id uuid not null references public.entities(id) on delete cascade,
  phase_name text not null,
  phase_type text,
  date_from date,
  date_from_text text,
  date_to date,
  date_to_text text,
  description text,
  notes text,
  status text not null default 'published' check (status in ('draft','review','published','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index step_phases_step_idx on public.step_phases(step_entity_id, date_from);

create trigger step_phases_set_updated_at
before update on public.step_phases
for each row execute function public.set_updated_at();

-- Agentes/talleres que participan en una fase.
create table public.step_phase_agents (
  id uuid primary key default gen_random_uuid(),
  step_phase_id uuid not null references public.step_phases(id) on delete cascade,
  agent_entity_id uuid not null references public.entities(id) on delete restrict,
  discipline text not null,
  role_name text,
  element_entity_id uuid references public.entities(id) on delete set null,
  notes text,
  unique (step_phase_id, agent_entity_id, discipline, element_entity_id)
);

create index step_phase_agents_phase_idx on public.step_phase_agents(step_phase_id);
create index step_phase_agents_agent_idx on public.step_phase_agents(agent_entity_id);

-- Las intervenciones patrimoniales existentes pueden quedar ligadas a una fase concreta.
alter table public.heritage_interventions
  add column if not exists step_phase_id uuid references public.step_phases(id) on delete set null;

-- -----------------------------------------------------------------------------
-- Elementos patrimoniales del paso
-- -----------------------------------------------------------------------------

-- heritage_assets ya permite que cada elemento sea una entidad propia y tenga
-- padre (el paso). Añadimos temporalidad y estado actual para poder conservar
-- canastos, respiraderos, varales, peanas, candelabros, bambalinas, etc.
alter table public.heritage_assets
  add column if not exists date_from date,
  add column if not exists date_from_text text,
  add column if not exists date_to date,
  add column if not exists date_to_text text,
  add column if not exists is_current boolean not null default true,
  add column if not exists origin_notes text;

-- -----------------------------------------------------------------------------
-- Capataces y otros responsables por periodos
-- -----------------------------------------------------------------------------

create table public.step_personnel_periods (
  id uuid primary key default gen_random_uuid(),
  step_entity_id uuid not null references public.entities(id) on delete cascade,
  agent_entity_id uuid not null references public.entities(id) on delete restrict,
  role_name text not null,
  date_from date,
  date_from_text text,
  year_from integer,
  date_to date,
  date_to_text text,
  year_to integer,
  is_current boolean not null default false,
  notes text,
  status text not null default 'published' check (status in ('draft','review','published','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint step_personnel_start_present check (
    date_from is not null or date_from_text is not null or year_from is not null
  ),
  constraint step_personnel_year_order check (
    year_to is null or year_from is null or year_to >= year_from
  )
);

create index step_personnel_step_idx
  on public.step_personnel_periods(step_entity_id, year_from desc);
create index step_personnel_agent_idx
  on public.step_personnel_periods(agent_entity_id, year_from desc);
create index step_personnel_current_idx
  on public.step_personnel_periods(step_entity_id, is_current);

create trigger step_personnel_periods_set_updated_at
before update on public.step_personnel_periods
for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Fuentes específicas
-- -----------------------------------------------------------------------------

alter table public.source_links
  add column if not exists step_phase_id uuid references public.step_phases(id) on delete cascade,
  add column if not exists step_personnel_period_id uuid references public.step_personnel_periods(id) on delete cascade,
  add column if not exists brotherhood_step_id uuid references public.brotherhood_steps(id) on delete cascade,
  add column if not exists image_step_id uuid references public.image_steps(id) on delete cascade;

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
      image_step_id
    ) = 1
  );

-- -----------------------------------------------------------------------------
-- RLS
-- -----------------------------------------------------------------------------

alter table public.step_phases enable row level security;
alter table public.step_phase_agents enable row level security;
alter table public.step_personnel_periods enable row level security;

create policy "Published step phases"
on public.step_phases for select
using (status = 'published');

create policy "Public step phase agents"
on public.step_phase_agents for select
using (
  exists (
    select 1 from public.step_phases sp
    where sp.id = step_phase_id and sp.status = 'published'
  )
);

create policy "Published step personnel periods"
on public.step_personnel_periods for select
using (status = 'published');

-- -----------------------------------------------------------------------------
-- Vistas prácticas
-- -----------------------------------------------------------------------------

-- Hermandad actual e histórico de pertenencia de un paso.
create or replace view public.step_brotherhood_history as
select
  bs.id as relation_id,
  bs.step_entity_id,
  se.name as step_name,
  bs.brotherhood_entity_id,
  be.name as brotherhood_name,
  bs.relation_type,
  bs.date_from,
  bs.date_from_text,
  bs.date_to,
  bs.date_to_text,
  (bs.date_to is null and bs.date_to_text is null) as is_current,
  bs.notes
from public.brotherhood_steps bs
join public.entities se on se.id = bs.step_entity_id
join public.entities be on be.id = bs.brotherhood_entity_id
where bs.status = 'published';

-- Imágenes que procesionan o han procesionado en un paso.
create or replace view public.step_image_history as
select
  isr.id as relation_id,
  isr.step_entity_id,
  se.name as step_name,
  isr.image_entity_id,
  ie.name as image_name,
  isr.relation_type,
  isr.date_from,
  isr.date_from_text,
  isr.date_to,
  isr.date_to_text,
  (isr.date_to is null and isr.date_to_text is null) as is_current,
  isr.notes
from public.image_steps isr
join public.entities se on se.id = isr.step_entity_id
join public.entities ie on ie.id = isr.image_entity_id
where isr.status = 'published';

-- Elementos actuales del paso.
create or replace view public.current_step_elements as
select
  ha.entity_id as element_entity_id,
  ee.name as element_name,
  ha.parent_entity_id as step_entity_id,
  se.name as step_name,
  ha.asset_type,
  ha.description,
  ha.current_condition,
  ha.date_from,
  ha.date_from_text,
  ha.origin_notes
from public.heritage_assets ha
join public.entities ee on ee.id = ha.entity_id
join public.entities se on se.id = ha.parent_entity_id and se.entity_type = 'step'
where ha.is_current = true
  and ee.status = 'published'
  and se.status = 'published';

-- Capataces y responsables actuales.
create or replace view public.current_step_personnel as
select
  spp.id,
  spp.step_entity_id,
  se.name as step_name,
  spp.agent_entity_id,
  ae.name as agent_name,
  spp.role_name,
  spp.year_from,
  spp.date_from_text,
  spp.notes
from public.step_personnel_periods spp
join public.entities se on se.id = spp.step_entity_id
join public.entities ae on ae.id = spp.agent_entity_id
where spp.status = 'published'
  and spp.is_current = true;

-- Fases y talleres de construcción/intervención.
create or replace view public.step_phase_details as
select
  sp.id as step_phase_id,
  sp.step_entity_id,
  se.name as step_name,
  sp.phase_name,
  sp.phase_type,
  sp.date_from,
  sp.date_from_text,
  sp.date_to,
  sp.date_to_text,
  spa.agent_entity_id,
  ae.name as agent_name,
  spa.discipline,
  spa.role_name,
  spa.element_entity_id,
  ee.name as element_name,
  sp.description
from public.step_phases sp
join public.entities se on se.id = sp.step_entity_id
left join public.step_phase_agents spa on spa.step_phase_id = sp.id
left join public.entities ae on ae.id = spa.agent_entity_id
left join public.entities ee on ee.id = spa.element_entity_id
where sp.status = 'published';

-- Nota funcional:
-- Venta, cesión, sustitución o reutilización entre pasos/elementos se registra
-- mediante public.entity_relations, por ejemplo:
-- 'sustituye_a', 'vendido_a', 'cedido_a', 'reutiliza_elementos_de', 'procede_de'.
