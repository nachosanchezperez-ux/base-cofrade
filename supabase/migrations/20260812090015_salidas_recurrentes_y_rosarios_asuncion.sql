-- Hilo Cofrade · Salidas recurrentes y Rosarios de la Asunción de Cantillana
-- Migración 015
--
-- Una serie define una salida anual estable y editable. Cada edición concreta
-- sigue registrándose en public.outings con su fecha, horarios e itinerario.

update public.brotherhoods
set crest_path = '/escudos/asuncion-de-cantillana.png'
where entity_id = '30000000-0000-0000-0000-000000000002';

create table public.outing_series (
  id uuid primary key default gen_random_uuid(),
  brotherhood_entity_id uuid not null references public.entities(id) on delete cascade,
  outing_type text not null,
  character text not null default 'ordinary' check (character in ('ordinary','extraordinary')),
  title text not null,
  month smallint check (month between 1 and 12),
  date_rule text,
  time_text text,
  municipality_id uuid references public.municipalities(id) on delete set null,
  origin_place_id uuid references public.places(id) on delete set null,
  destination_place_id uuid references public.places(id) on delete set null,
  route_summary text,
  description text,
  display_order integer,
  status text not null default 'published' check (status in ('draft','review','published','archived')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index outing_series_brotherhood_idx
  on public.outing_series(brotherhood_entity_id, display_order);

create trigger outing_series_set_updated_at
before update on public.outing_series
for each row execute function public.set_updated_at();

create table public.outing_series_movements (
  id uuid primary key default gen_random_uuid(),
  outing_series_id uuid not null references public.outing_series(id) on delete cascade,
  sequence_no integer not null,
  direction text not null,
  date_rule text,
  time_text text,
  origin_place_id uuid references public.places(id) on delete set null,
  destination_place_id uuid references public.places(id) on delete set null,
  route_summary text,
  description text,
  created_at timestamptz not null default now(),
  unique (outing_series_id, sequence_no)
);

create index outing_series_movements_series_idx
  on public.outing_series_movements(outing_series_id, sequence_no);

alter table public.outings
  add column if not exists outing_series_id uuid references public.outing_series(id) on delete set null;

create index outings_series_idx on public.outings(outing_series_id, outing_date desc);

alter table public.outing_series enable row level security;
alter table public.outing_series_movements enable row level security;

create policy "Published outing series"
on public.outing_series for select
using (status = 'published');

create policy "Public outing series movements"
on public.outing_series_movements for select
using (
  exists (
    select 1
    from public.outing_series series
    where series.id = outing_series_id and series.status = 'published'
  )
);

alter table public.source_links
  add column if not exists outing_series_id uuid references public.outing_series(id) on delete cascade;

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
      cult_occurrence_id,
      outing_music_position_id,
      outing_music_assignment_id,
      outing_series_id
    ) = 1
  );

insert into public.places (
  id, municipality_id, name, slug, place_type
)
select
  '31000000-0000-0000-0000-000000000002',
  m.id,
  'Ermita de San Bartolomé',
  'ermita-de-san-bartolome-cantillana',
  'ermita'
from public.municipalities m
where m.slug = 'cantillana'
on conflict (id) do nothing;

insert into public.outing_series (
  id,
  brotherhood_entity_id,
  outing_type,
  character,
  title,
  month,
  date_rule,
  time_text,
  municipality_id,
  origin_place_id,
  destination_place_id,
  route_summary,
  description,
  display_order,
  status
)
select
  values_to_insert.id,
  '30000000-0000-0000-0000-000000000002',
  'Santo Rosario',
  'ordinary',
  values_to_insert.title,
  values_to_insert.month,
  values_to_insert.date_rule,
  values_to_insert.time_text,
  municipality.id,
  values_to_insert.origin_place_id,
  values_to_insert.destination_place_id,
  values_to_insert.route_summary,
  values_to_insert.description,
  values_to_insert.display_order,
  'published'
from public.municipalities municipality
cross join (
  values
  (
    '3a000000-0000-0000-0000-000000000001'::uuid,
    'Santo Rosario de vísperas',
    8::smallint,
    'Noche del 14 al 15 de agosto',
    '00:00 h',
    '31000000-0000-0000-0000-000000000002'::uuid,
    '31000000-0000-0000-0000-000000000001'::uuid,
    'Ermita de San Bartolomé → Iglesia Parroquial de Nuestra Señora de la Asunción',
    'Santo Rosario procesional que abre las jornadas centrales de las Fiestas Asuncionistas.',
    10
  ),
  (
    '3a000000-0000-0000-0000-000000000002'::uuid,
    'Santo Rosario de la Fiesta de la Subida',
    9::smallint,
    'Viernes de la Fiesta de la Subida',
    'Horario vespertino',
    null::uuid,
    null::uuid,
    null::text,
    'Santo Rosario celebrado durante la Fiesta de la Subida.',
    20
  ),
  (
    '3a000000-0000-0000-0000-000000000003'::uuid,
    'Santo Rosario conmemorativo del Dogma de la Asunción',
    11::smallint,
    '1 de noviembre',
    'Antes y después de la Función Votiva',
    '31000000-0000-0000-0000-000000000002'::uuid,
    '31000000-0000-0000-0000-000000000001'::uuid,
    'Ermita de San Bartolomé → parroquia y regreso tras la Función Votiva',
    'Santo Rosario anual conmemorativo de la proclamación del Dogma de la Asunción.',
    30
  )
) as values_to_insert (
  id,
  title,
  month,
  date_rule,
  time_text,
  origin_place_id,
  destination_place_id,
  route_summary,
  description,
  display_order
)
where municipality.slug = 'cantillana'
on conflict (id) do nothing;

insert into public.outing_series_movements (
  id,
  outing_series_id,
  sequence_no,
  direction,
  date_rule,
  time_text,
  origin_place_id,
  destination_place_id,
  route_summary,
  description
) values
(
  '3b000000-0000-0000-0000-000000000001',
  '3a000000-0000-0000-0000-000000000001',
  10,
  'Ida',
  'Noche del 14 al 15 de agosto',
  '00:00 h',
  '31000000-0000-0000-0000-000000000002',
  '31000000-0000-0000-0000-000000000001',
  'Ermita de San Bartolomé → Iglesia Parroquial de Nuestra Señora de la Asunción',
  'Traslado del Santo Rosario de vísperas al inicio de la Solemne Novena.'
),
(
  '3b000000-0000-0000-0000-000000000002',
  '3a000000-0000-0000-0000-000000000001',
  20,
  'Regreso',
  '23 de agosto',
  'Tras la Función Solemne',
  '31000000-0000-0000-0000-000000000001',
  '31000000-0000-0000-0000-000000000002',
  'Iglesia Parroquial de Nuestra Señora de la Asunción → Ermita de San Bartolomé',
  'Regreso del Santo Rosario al término de los cultos de agosto.'
),
(
  '3b000000-0000-0000-0000-000000000003',
  '3a000000-0000-0000-0000-000000000003',
  10,
  'Ida',
  '1 de noviembre',
  'Antes de la Función Votiva',
  '31000000-0000-0000-0000-000000000002',
  '31000000-0000-0000-0000-000000000001',
  'Ermita de San Bartolomé → Iglesia Parroquial de Nuestra Señora de la Asunción',
  'Santo Rosario público que antecede a la Función Votiva.'
),
(
  '3b000000-0000-0000-0000-000000000004',
  '3a000000-0000-0000-0000-000000000003',
  20,
  'Regreso',
  '1 de noviembre',
  'Tras la Función Votiva',
  '31000000-0000-0000-0000-000000000001',
  '31000000-0000-0000-0000-000000000002',
  'Iglesia Parroquial de Nuestra Señora de la Asunción → Ermita de San Bartolomé',
  'Regreso del Santo Rosario por el camino inverso tras la Función Votiva.'
)
on conflict (id) do nothing;

insert into public.source_links (source_id, outing_series_id, scope) values
(
  '36000000-0000-0000-0000-000000000006',
  '3a000000-0000-0000-0000-000000000001',
  'Santo Rosario de vísperas de agosto'
),
(
  '36000000-0000-0000-0000-000000000007',
  '3a000000-0000-0000-0000-000000000002',
  'Santo Rosario de la Fiesta de la Subida'
),
(
  '36000000-0000-0000-0000-000000000008',
  '3a000000-0000-0000-0000-000000000003',
  'Santo Rosario conmemorativo del Dogma de la Asunción'
)
on conflict do nothing;
