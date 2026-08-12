-- Hilo Cofrade · Bandas y Marchas
-- Migración 005
--
-- Completa el núcleo musical con:
-- 1) Nombres históricos y siglas de bandas
-- 2) Personas vinculadas a bandas por periodos
-- 3) Periodos históricos de acompañamiento musical
-- 4) Dedicatorias de marchas a hermandades, imágenes, bandas o acontecimientos
-- 5) Estreno e interpretación de referencia de una marcha

-- -----------------------------------------------------------------------------
-- Identidad histórica de bandas
-- -----------------------------------------------------------------------------

create table public.band_names (
  id uuid primary key default gen_random_uuid(),
  band_entity_id uuid not null references public.entities(id) on delete cascade,
  name text not null,
  short_name text,
  name_type text not null default 'official' check (name_type in ('official','popular','former','acronym')),
  date_from date,
  date_from_text text,
  date_to date,
  date_to_text text,
  is_current boolean not null default false,
  notes text,
  created_at timestamptz not null default now(),
  unique (band_entity_id, name, date_from)
);

create index band_names_band_idx on public.band_names(band_entity_id, is_current);

-- Personas vinculadas a una banda: dirección, presidencia, composición residente, etc.
create table public.band_agents (
  id uuid primary key default gen_random_uuid(),
  band_entity_id uuid not null references public.entities(id) on delete cascade,
  agent_entity_id uuid not null references public.entities(id) on delete restrict,
  role_name text not null,
  date_from date,
  date_from_text text,
  date_to date,
  date_to_text text,
  is_current boolean not null default false,
  notes text,
  created_at timestamptz not null default now(),
  unique (band_entity_id, agent_entity_id, role_name, date_from)
);

create index band_agents_band_idx on public.band_agents(band_entity_id, is_current);
create index band_agents_agent_idx on public.band_agents(agent_entity_id);

-- -----------------------------------------------------------------------------
-- Histórico de acompañamientos por periodos
-- -----------------------------------------------------------------------------

-- Esta tabla expresa relaciones como “acompañó al paso de misterio de 2009 a 2014”.
-- Los acompañamientos de una salida concreta siguen registrándose en public.accompaniments.
create table public.music_accompaniment_periods (
  id uuid primary key default gen_random_uuid(),
  brotherhood_entity_id uuid not null references public.entities(id) on delete cascade,
  band_entity_id uuid not null references public.entities(id) on delete restrict,
  step_entity_id uuid references public.entities(id) on delete set null,
  position text not null,
  outing_type text,
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
  constraint music_period_start_present check (
    date_from is not null or date_from_text is not null or year_from is not null
  ),
  constraint music_period_year_order check (
    year_to is null or year_from is null or year_to >= year_from
  )
);

create index music_periods_brotherhood_idx
  on public.music_accompaniment_periods(brotherhood_entity_id, year_from desc);
create index music_periods_band_idx
  on public.music_accompaniment_periods(band_entity_id, year_from desc);
create index music_periods_step_idx
  on public.music_accompaniment_periods(step_entity_id, year_from desc);
create index music_periods_current_idx
  on public.music_accompaniment_periods(brotherhood_entity_id, is_current);

create trigger music_accompaniment_periods_set_updated_at
before update on public.music_accompaniment_periods
for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Marchas: dedicatorias y estreno
-- -----------------------------------------------------------------------------

alter table public.marches
  add column if not exists premiere_date date,
  add column if not exists premiere_date_text text,
  add column if not exists premiere_place_id uuid references public.places(id) on delete set null,
  add column if not exists premiered_by_band_entity_id uuid references public.entities(id) on delete set null,
  add column if not exists score_reference text,
  add column if not exists notes text;

-- Una marcha puede estar dedicada a más de una entidad o a un acontecimiento.
-- Ejemplos: Hermandad, Virgen titular, Coronación Canónica, Banda.
create table public.march_dedications (
  id uuid primary key default gen_random_uuid(),
  march_entity_id uuid not null references public.entities(id) on delete cascade,
  dedicatee_entity_id uuid not null references public.entities(id) on delete cascade,
  dedication_type text not null default 'dedicated_to',
  dedication_text text,
  date_from date,
  date_from_text text,
  notes text,
  status text not null default 'published' check (status in ('draft','review','published','archived')),
  created_at timestamptz not null default now(),
  unique (march_entity_id, dedicatee_entity_id, dedication_type)
);

create index march_dedications_march_idx on public.march_dedications(march_entity_id);
create index march_dedications_dedicatee_idx on public.march_dedications(dedicatee_entity_id);

-- Interpretaciones de referencia: no pretende guardar cada actuación de la historia,
-- sino grabaciones o estrenos relevantes para la ficha musical.
create table public.march_recordings (
  id uuid primary key default gen_random_uuid(),
  march_entity_id uuid not null references public.entities(id) on delete cascade,
  band_entity_id uuid references public.entities(id) on delete set null,
  recording_date date,
  recording_date_text text,
  place_id uuid references public.places(id) on delete set null,
  youtube_video_id text,
  external_url text,
  title text,
  notes text,
  is_featured boolean not null default false,
  status text not null default 'published' check (status in ('draft','review','published','archived')),
  created_at timestamptz not null default now()
);

create index march_recordings_march_idx
  on public.march_recordings(march_entity_id, is_featured desc);
create index march_recordings_band_idx
  on public.march_recordings(band_entity_id);

-- -----------------------------------------------------------------------------
-- Fuentes específicas de periodos y dedicatorias
-- -----------------------------------------------------------------------------

alter table public.source_links
  add column if not exists music_accompaniment_period_id uuid references public.music_accompaniment_periods(id) on delete cascade,
  add column if not exists march_dedication_id uuid references public.march_dedications(id) on delete cascade,
  add column if not exists march_recording_id uuid references public.march_recordings(id) on delete cascade;

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
      march_recording_id
    ) = 1
  );

-- -----------------------------------------------------------------------------
-- RLS
-- -----------------------------------------------------------------------------

alter table public.band_names enable row level security;
alter table public.band_agents enable row level security;
alter table public.music_accompaniment_periods enable row level security;
alter table public.march_dedications enable row level security;
alter table public.march_recordings enable row level security;

create policy "Public band names"
on public.band_names for select
using (
  exists (
    select 1 from public.entities e
    where e.id = band_entity_id and e.status = 'published'
  )
);

create policy "Public band agents"
on public.band_agents for select
using (
  exists (
    select 1 from public.entities e
    where e.id = band_entity_id and e.status = 'published'
  )
);

create policy "Published music accompaniment periods"
on public.music_accompaniment_periods for select
using (status = 'published');

create policy "Published march dedications"
on public.march_dedications for select
using (status = 'published');

create policy "Published march recordings"
on public.march_recordings for select
using (status = 'published');

-- -----------------------------------------------------------------------------
-- Vistas prácticas para la aplicación
-- -----------------------------------------------------------------------------

create or replace view public.current_music_accompaniments as
select
  map.id,
  map.brotherhood_entity_id,
  map.band_entity_id,
  map.step_entity_id,
  map.position,
  map.outing_type,
  map.year_from,
  map.date_from_text,
  map.notes
from public.music_accompaniment_periods map
where map.status = 'published'
  and map.is_current = true;

create or replace view public.marches_with_dedications as
select
  me.id as march_entity_id,
  me.name as march_name,
  m.composition_year,
  m.youtube_video_id,
  md.dedicatee_entity_id,
  de.name as dedicatee_name,
  de.entity_type as dedicatee_type,
  md.dedication_type,
  md.dedication_text
from public.entities me
join public.marches m on m.entity_id = me.id
left join public.march_dedications md
  on md.march_entity_id = me.id and md.status = 'published'
left join public.entities de on de.id = md.dedicatee_entity_id
where me.status = 'published';
