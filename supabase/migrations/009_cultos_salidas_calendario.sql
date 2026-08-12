-- Hilo Cofrade · Cultos, salidas y calendario
-- Migración 009
--
-- Principios:
-- 1) El culto es la celebración estable; cada año tiene una celebración concreta.
-- 2) Una salida es siempre un registro concreto de una fecha/año.
-- 3) Recorridos y horarios se normalizan para poder mostrarlos en ficha, calendario y Home.
-- 4) Las salidas extraordinarias alimentan automáticamente el bloque de próximas extraordinarias.

-- -----------------------------------------------------------------------------
-- CULTOS: definición estable
-- -----------------------------------------------------------------------------

alter table public.cults
  add column if not exists is_recurring boolean not null default true,
  add column if not exists recurrence_label text,
  add column if not exists display_order integer,
  add column if not exists notes text;

-- Un culto puede estar relacionado con varias imágenes u otras entidades.
-- Se mantiene cults.image_entity_id por compatibilidad con datos anteriores.
create table public.cult_entities (
  id uuid primary key default gen_random_uuid(),
  cult_id uuid not null references public.cults(id) on delete cascade,
  entity_id uuid not null references public.entities(id) on delete cascade,
  role text not null default 'honoree',
  notes text,
  created_at timestamptz not null default now(),
  unique (cult_id, entity_id, role)
);

create index cult_entities_cult_idx on public.cult_entities(cult_id);
create index cult_entities_entity_idx on public.cult_entities(entity_id);

-- -----------------------------------------------------------------------------
-- CULTOS: celebración concreta por año
-- -----------------------------------------------------------------------------

create table public.cult_occurrences (
  id uuid primary key default gen_random_uuid(),
  cult_id uuid not null references public.cults(id) on delete cascade,
  year integer,
  title_override text,
  start_date date not null,
  end_date date,
  place_id uuid references public.places(id) on delete set null,
  description_override text,
  event_status text not null default 'announced' check (
    event_status in ('announced','held','cancelled')
  ),
  status text not null default 'published' check (
    status in ('draft','review','published','archived')
  ),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint cult_occurrence_date_order check (
    end_date is null or end_date >= start_date
  ),
  unique (cult_id, year, start_date)
);

create index cult_occurrences_cult_idx on public.cult_occurrences(cult_id, year desc);
create index cult_occurrences_dates_idx on public.cult_occurrences(start_date, end_date);

create trigger cult_occurrences_set_updated_at
before update on public.cult_occurrences
for each row execute function public.set_updated_at();

-- Días/sesiones concretas. Permite representar triduo, quinario, novena,
-- besamanos de varios días o distintos horarios sin convertir todo en texto.
create table public.cult_occurrence_days (
  id uuid primary key default gen_random_uuid(),
  cult_occurrence_id uuid not null references public.cult_occurrences(id) on delete cascade,
  day_number integer,
  day_label text,
  celebration_date date not null,
  start_time time,
  time_text text,
  place_id uuid references public.places(id) on delete set null,
  notes text,
  created_at timestamptz not null default now()
);

create index cult_occurrence_days_date_idx
  on public.cult_occurrence_days(celebration_date, start_time);
create index cult_occurrence_days_occurrence_idx
  on public.cult_occurrence_days(cult_occurrence_id, day_number);

-- -----------------------------------------------------------------------------
-- SALIDAS: fecha concreta, horarios y recorrido
-- -----------------------------------------------------------------------------

alter table public.outings
  add column if not exists return_date date,
  add column if not exists route_summary text,
  add column if not exists public_notes text;

-- Itinerario normalizado. route jsonb se mantiene por compatibilidad.
create table public.outing_route_points (
  id uuid primary key default gen_random_uuid(),
  outing_id uuid not null references public.outings(id) on delete cascade,
  sequence_no integer not null,
  point_type text not null default 'street' check (
    point_type in ('street','place','milestone')
  ),
  label text not null,
  place_id uuid references public.places(id) on delete set null,
  planned_time time,
  notes text,
  created_at timestamptz not null default now(),
  unique (outing_id, sequence_no)
);

create index outing_route_points_outing_idx
  on public.outing_route_points(outing_id, sequence_no);

-- Hitos horarios: salida, llegada a un templo, entrada en Carrera Oficial,
-- regreso, etc. No obliga a que todos sean puntos del itinerario completo.
create table public.outing_schedule_items (
  id uuid primary key default gen_random_uuid(),
  outing_id uuid not null references public.outings(id) on delete cascade,
  sequence_no integer not null,
  label text not null,
  item_date date,
  item_time time,
  time_text text,
  place_id uuid references public.places(id) on delete set null,
  notes text,
  created_at timestamptz not null default now(),
  unique (outing_id, sequence_no)
);

create index outing_schedule_items_outing_idx
  on public.outing_schedule_items(outing_id, sequence_no);

-- -----------------------------------------------------------------------------
-- FUENTES
-- -----------------------------------------------------------------------------

alter table public.source_links
  add column if not exists cult_occurrence_id uuid references public.cult_occurrences(id) on delete cascade;

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
      cult_occurrence_id
    ) = 1
  );

-- -----------------------------------------------------------------------------
-- RLS
-- -----------------------------------------------------------------------------

alter table public.cult_entities enable row level security;
alter table public.cult_occurrences enable row level security;
alter table public.cult_occurrence_days enable row level security;
alter table public.outing_route_points enable row level security;
alter table public.outing_schedule_items enable row level security;

create policy "Public cult entities"
on public.cult_entities for select
using (
  exists (
    select 1 from public.cults c
    where c.id = cult_id and c.status = 'published'
  )
);

create policy "Published cult occurrences"
on public.cult_occurrences for select
using (status = 'published');

create policy "Public cult occurrence days"
on public.cult_occurrence_days for select
using (
  exists (
    select 1 from public.cult_occurrences co
    where co.id = cult_occurrence_id and co.status = 'published'
  )
);

create policy "Public outing route points"
on public.outing_route_points for select
using (
  exists (
    select 1 from public.outings o
    where o.id = outing_id and o.status = 'published'
  )
);

create policy "Public outing schedule items"
on public.outing_schedule_items for select
using (
  exists (
    select 1 from public.outings o
    where o.id = outing_id and o.status = 'published'
  )
);

-- -----------------------------------------------------------------------------
-- VISTAS DE CALENDARIO
-- -----------------------------------------------------------------------------

create or replace view public.calendar_cult_days as
select
  cod.id as calendar_item_id,
  'cult'::text as item_type,
  c.brotherhood_entity_id,
  be.name as brotherhood_name,
  coalesce(co.title_override, c.title) as title,
  c.cult_type as subtype,
  cod.celebration_date as item_date,
  cod.start_time as item_time,
  coalesce(cod.place_id, co.place_id, c.place_id) as place_id,
  p.name as place_name,
  cod.day_number,
  cod.day_label,
  co.event_status,
  co.id as occurrence_id
from public.cult_occurrence_days cod
join public.cult_occurrences co on co.id = cod.cult_occurrence_id
join public.cults c on c.id = co.cult_id
join public.entities be on be.id = c.brotherhood_entity_id
left join public.places p on p.id = coalesce(cod.place_id, co.place_id, c.place_id)
where co.status = 'published'
  and c.status = 'published';

create or replace view public.calendar_outings as
select
  o.id as calendar_item_id,
  'outing'::text as item_type,
  o.brotherhood_entity_id,
  be.name as brotherhood_name,
  coalesce(o.title, o.outing_type) as title,
  o.outing_type as subtype,
  o.character,
  o.outing_date as item_date,
  o.departure_time as item_time,
  o.origin_place_id as place_id,
  p.name as place_name,
  o.event_status,
  o.reason
from public.outings o
join public.entities be on be.id = o.brotherhood_entity_id
left join public.places p on p.id = o.origin_place_id
where o.status = 'published';

create or replace view public.calendar_items as
select
  ccd.calendar_item_id,
  ccd.item_type,
  ccd.brotherhood_entity_id,
  ccd.brotherhood_name,
  ccd.title,
  ccd.subtype,
  null::text as character,
  ccd.item_date,
  ccd.item_time,
  ccd.place_id,
  ccd.place_name,
  ccd.event_status
from public.calendar_cult_days ccd

union all

select
  co.calendar_item_id,
  co.item_type,
  co.brotherhood_entity_id,
  co.brotherhood_name,
  co.title,
  co.subtype,
  co.character,
  co.item_date,
  co.item_time,
  co.place_id,
  co.place_name,
  co.event_status
from public.calendar_outings co;

create or replace view public.today_calendar_items as
select *
from public.calendar_items
where item_date = current_date
  and event_status <> 'cancelled'
order by item_time nulls last, title;

create or replace view public.upcoming_calendar_items as
select *
from public.calendar_items
where item_date >= current_date
  and event_status = 'announced'
order by item_date, item_time nulls last, title;

-- Bloque de Home: próximas salidas extraordinarias anunciadas.
create or replace view public.upcoming_extraordinary_outings as
select
  o.id,
  o.brotherhood_entity_id,
  be.name as brotherhood_name,
  o.title,
  o.outing_type,
  o.outing_date,
  o.departure_time,
  o.return_date,
  o.return_time,
  o.reason,
  o.origin_place_id,
  op.name as origin_place_name,
  o.destination_place_id,
  dp.name as destination_place_name,
  o.route_summary
from public.outings o
join public.entities be on be.id = o.brotherhood_entity_id
left join public.places op on op.id = o.origin_place_id
left join public.places dp on dp.id = o.destination_place_id
where o.status = 'published'
  and o.event_status = 'announced'
  and o.character = 'extraordinary'
  and o.outing_date >= current_date
order by o.outing_date, o.departure_time nulls last;
