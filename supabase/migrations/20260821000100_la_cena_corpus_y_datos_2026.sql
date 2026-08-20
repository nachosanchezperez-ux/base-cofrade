-- Hilo Cofrade · La Cena
--
-- Documenta los traslados anuales del Señor de la Sagrada Cena por el
-- Corpus Christi y las cifras de la estación de penitencia de 2026.

with target_municipality as (
  select b.municipality_id
  from public.brotherhoods b
  join public.entities e on e.id = b.entity_id
  where e.slug = 'la-cena'
),
inserted_place as (
  insert into public.places (
    municipality_id,
    name,
    slug,
    place_type,
    address,
    notes
  )
  select
    target_municipality.municipality_id,
    'Palacio Arzobispal de Sevilla',
    'palacio-arzobispal-sevilla',
    'palacio',
    'Plaza Virgen de los Reyes, Sevilla',
    'Acceso lateral por la calle Cardenal Carlos Amigo Vallejo.'
  from target_municipality
  on conflict (slug) do update set
    municipality_id = excluded.municipality_id,
    name = excluded.name,
    place_type = excluded.place_type,
    address = excluded.address,
    notes = excluded.notes,
    updated_at = now()
  returning id
),
target_places as (
  select
    (
      select b.canonical_see_place_id
      from public.brotherhoods b
      join public.entities e on e.id = b.entity_id
      where e.slug = 'la-cena'
    ) as seat_id,
    (select id from inserted_place) as palace_id
),
updated_series as (
  update public.outing_series series set
    outing_type = 'Traslado',
    character = 'ordinary',
    month = null,
    date_rule = 'Jueves del Corpus Christi',
    time_text = 'Mañana · horarios variables',
    municipality_id = brotherhood.municipality_id,
    origin_place_id = target_places.seat_id,
    destination_place_id = target_places.seat_id,
    route_summary = 'Los Terceros · Palacio Arzobispal · Los Terceros',
    description = 'Salida anual del Señor de la Sagrada Cena para participar en el cortejo del Corpus Christi de Sevilla. Comprende el traslado de ida desde Los Terceros hasta el Palacio Arzobispal y la procesión de regreso tras la entrada de la Custodia en la Catedral. En 2026, la ida tuvo lugar de 06:30 a 08:15 y el regreso de 12:30 a 15:30.',
    display_order = 30,
    status = 'published',
    notes = 'Horarios y recorridos referidos a 2026; deben revisarse cada año.',
    updated_at = now()
  from public.brotherhoods brotherhood
  join public.entities entity on entity.id = brotherhood.entity_id
  cross join target_places
  where series.brotherhood_entity_id = entity.id
    and entity.slug = 'la-cena'
    and series.title = 'Traslados del Señor de la Sagrada Cena con motivo del Corpus Christi'
  returning series.id
),
inserted_series as (
  insert into public.outing_series (
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
    status,
    notes
  )
  select
    entity.id,
    'Traslado',
    'ordinary',
    'Traslados del Señor de la Sagrada Cena con motivo del Corpus Christi',
    null,
    'Jueves del Corpus Christi',
    'Mañana · horarios variables',
    brotherhood.municipality_id,
    target_places.seat_id,
    target_places.seat_id,
    'Los Terceros · Palacio Arzobispal · Los Terceros',
    'Salida anual del Señor de la Sagrada Cena para participar en el cortejo del Corpus Christi de Sevilla. Comprende el traslado de ida desde Los Terceros hasta el Palacio Arzobispal y la procesión de regreso tras la entrada de la Custodia en la Catedral. En 2026, la ida tuvo lugar de 06:30 a 08:15 y el regreso de 12:30 a 15:30.',
    30,
    'published',
    'Horarios y recorridos referidos a 2026; deben revisarse cada año.'
  from public.entities entity
  join public.brotherhoods brotherhood on brotherhood.entity_id = entity.id
  cross join target_places
  where entity.slug = 'la-cena'
    and not exists (select 1 from updated_series)
  returning id
),
target_series as (
  select id from updated_series
  union all
  select id from inserted_series
)
insert into public.outing_series_movements (
  outing_series_id,
  sequence_no,
  direction,
  date_rule,
  time_text,
  origin_place_id,
  destination_place_id,
  route_summary,
  description
)
select
  target_series.id,
  movement.sequence_no,
  movement.direction,
  movement.date_rule,
  movement.time_text,
  case when movement.sequence_no = 1 then target_places.seat_id else target_places.palace_id end,
  case when movement.sequence_no = 1 then target_places.palace_id else target_places.seat_id end,
  movement.route_summary,
  movement.description
from target_series
cross join target_places
cross join (
  values
    (
      1,
      'Ida al Palacio Arzobispal',
      'Jueves del Corpus Christi',
      '06:30–08:15 (2026)',
      'Iglesia de Los Terceros · Sol · Capataz Manuel Santiago · Alhóndiga · Plaza de San Leandro · Zamudio · Plaza de San Ildefonso · Boteros · Odreros · Plaza de la Alfalfa · Jesús de las Tres Caídas · Cuesta del Rosario · Francos · Argote de Molina · Alemanes · Cardenal Carlos Amigo Vallejo · Palacio Arzobispal',
      'Traslado matinal del Señor de la Sagrada Cena. En 2026 contó con la Escolanía Salesiana María Auxiliadora y la Capilla Musical María Auxiliadora.'
    ),
    (
      2,
      'Regreso a Los Terceros',
      'Tras la entrada de la Custodia en la Catedral',
      '12:30–15:30 (2026)',
      'Palacio Arzobispal · Cardenal Carlos Amigo Vallejo · Placentines · Francos · Jesús de las Tres Caídas · Odreros · Boteros · Sales y Ferré · Plaza del Cristo de Burgos · Doña María Coronel · Gerona · Capataz Manuel Santiago · Plaza de Los Terceros · Sol · Iglesia de Los Terceros',
      'Procesión de regreso del Señor de la Sagrada Cena. En 2026 contó con la Banda de Cornetas y Tambores Nuestra Señora de la Victoria «Las Cigarreras».'
    )
) as movement(
  sequence_no,
  direction,
  date_rule,
  time_text,
  route_summary,
  description
)
on conflict (outing_series_id, sequence_no) do update set
  direction = excluded.direction,
  date_rule = excluded.date_rule,
  time_text = excluded.time_text,
  origin_place_id = excluded.origin_place_id,
  destination_place_id = excluded.destination_place_id,
  route_summary = excluded.route_summary,
  description = excluded.description;

with existing_source as (
  select id
  from public.sources
  where url = 'https://lacenadesevilla.es/corpus-2026/'
  order by created_at
  limit 1
),
inserted_source as (
  insert into public.sources (
    name,
    url,
    source_type,
    author_or_publisher,
    accessed_at,
    notes
  )
  select
    'Corpus 2026 — horarios e itinerarios',
    'https://lacenadesevilla.es/corpus-2026/',
    'Web oficial',
    'Hermandad de la Sagrada Cena de Sevilla',
    date '2026-08-20',
    'Fuente oficial para los traslados de ida y regreso del Señor de la Sagrada Cena con motivo del Corpus Christi de 2026.'
  where not exists (select 1 from existing_source)
  returning id
),
target_source as (
  select id from existing_source
  union all
  select id from inserted_source
),
target_series as (
  select series.id
  from public.outing_series series
  join public.entities entity on entity.id = series.brotherhood_entity_id
  where entity.slug = 'la-cena'
    and series.title = 'Traslados del Señor de la Sagrada Cena con motivo del Corpus Christi'
)
insert into public.source_links (
  source_id,
  outing_series_id,
  scope,
  notes
)
select
  target_source.id,
  target_series.id,
  'Traslados del Corpus Christi',
  'Horarios, itinerarios y acompañamientos musicales de 2026.'
from target_source
cross join target_series
where not exists (
  select 1
  from public.source_links existing
  where existing.source_id = target_source.id
    and existing.outing_series_id = target_series.id
);

with existing_source as (
  select id
  from public.sources
  where url = 'https://semanasantaopendata.org/2026/hermandad/la-cena/'
  order by created_at
  limit 1
),
inserted_source as (
  insert into public.sources (
    name,
    url,
    source_type,
    author_or_publisher,
    accessed_at,
    notes
  )
  select
    'La Cena — Semana Santa de Sevilla 2026',
    'https://semanasantaopendata.org/2026/hermandad/la-cena/',
    'Datos abiertos',
    'Semana Santa Open Data',
    date '2026-08-20',
    'Fuente para las cifras del cortejo y los horarios de la estación de penitencia de 2026.'
  where not exists (select 1 from existing_source)
  returning id
),
target_source as (
  select id from existing_source
  union all
  select id from inserted_source
)
insert into public.brotherhood_procession_stats (
  brotherhood_entity_id,
  year,
  procession_date,
  procession_day,
  nazarenos_count,
  penitents_count,
  total_nazarenos_count,
  acolytes_count,
  monaguillos_count,
  musical_accompaniment_count,
  total_procession_count,
  position_by_nazarenos,
  position_by_procession,
  brotherhoods_in_day,
  official_route_duration_minutes,
  official_career_duration_minutes,
  departure_time,
  entrance_time,
  source_id,
  status,
  notes
)
select
  entity.id,
  2026,
  date '2026-03-29',
  'Domingo de Ramos',
  655,
  24,
  679,
  35,
  43,
  49,
  806,
  9,
  8,
  9,
  480,
  121,
  time '14:00',
  time '22:00',
  target_source.id,
  'published',
  'Cifras del cortejo de 2026: 655 nazarenos y 24 penitentes (679 en total), 35 acólitos, 43 monaguillos y 49 integrantes de los acompañamientos musicales.'
from public.entities entity
cross join target_source
where entity.slug = 'la-cena'
on conflict (brotherhood_entity_id, year) do update set
  procession_date = excluded.procession_date,
  procession_day = excluded.procession_day,
  nazarenos_count = excluded.nazarenos_count,
  penitents_count = excluded.penitents_count,
  total_nazarenos_count = excluded.total_nazarenos_count,
  acolytes_count = excluded.acolytes_count,
  monaguillos_count = excluded.monaguillos_count,
  musical_accompaniment_count = excluded.musical_accompaniment_count,
  total_procession_count = excluded.total_procession_count,
  position_by_nazarenos = excluded.position_by_nazarenos,
  position_by_procession = excluded.position_by_procession,
  brotherhoods_in_day = excluded.brotherhoods_in_day,
  official_route_duration_minutes = excluded.official_route_duration_minutes,
  official_career_duration_minutes = excluded.official_career_duration_minutes,
  departure_time = excluded.departure_time,
  entrance_time = excluded.entrance_time,
  source_id = excluded.source_id,
  status = excluded.status,
  notes = excluded.notes;
