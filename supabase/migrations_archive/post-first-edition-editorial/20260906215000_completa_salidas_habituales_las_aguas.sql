-- Las Aguas · salidas habituales de Penitencia y Gloria
-- Solo DML sobre outing_series y source_links existentes. Sin DDL, RLS ni nuevas tablas.

do $$
begin
  if (select count(*) from public.entities where slug = 'las-aguas-sevilla' and entity_type = 'brotherhood') <> 1 then
    raise exception 'La ficha canónica de Las Aguas no es unívoca';
  end if;

  if not exists (
    select 1
    from public.entities h
    join public.brotherhoods b on b.entity_id = h.id
    where h.slug = 'las-aguas-sevilla'
      and b.current_procession_day = 'Lunes Santo'
  ) then
    raise exception 'Las Aguas no conserva el Lunes Santo como jornada canónica';
  end if;
end $$;

insert into public.sources (
  name, url, source_type, author_or_publisher, publication_date, accessed_at, notes
)
select
  'Consejo de Hermandades · Procesión del Rosario de Las Aguas 2023',
  'https://www.hermandades-de-sevilla.org/events/hermandades-de-gloria-que-procesionan-el-14-de-octubre/',
  'Fuente institucional',
  'Consejo General de Hermandades y Cofradías de Sevilla',
  date '2023-10-14',
  date '2026-09-06',
  'Documenta la procesión de gloria de Nuestra Señora del Rosario desde la Capilla de Las Aguas.'
where not exists (
  select 1
  from public.sources
  where url = 'https://www.hermandades-de-sevilla.org/events/hermandades-de-gloria-que-procesionan-el-14-de-octubre/'
);

with context as (
  select
    h.id as brotherhood_entity_id,
    b.municipality_id,
    b.canonical_see_place_id
  from public.entities h
  join public.brotherhoods b on b.entity_id = h.id
  where h.slug = 'las-aguas-sevilla'
)
insert into public.outing_series (
  brotherhood_entity_id, outing_type, character, title, month, date_rule,
  time_text, municipality_id, origin_place_id, destination_place_id,
  route_summary, description, display_order, status, notes
)
select
  c.brotherhood_entity_id,
  d.outing_type,
  'ordinary',
  d.title,
  d.month,
  d.date_rule,
  null,
  c.municipality_id,
  c.canonical_see_place_id,
  c.canonical_see_place_id,
  d.route_summary,
  d.description,
  d.display_order,
  'published',
  'Serie habitual. La fecha, el horario y el itinerario concreto deben documentarse por edición en outings.'
from context c
cross join (values
  (
    'Estación de penitencia',
    'Estación de penitencia del Lunes Santo',
    null::smallint,
    'Lunes Santo',
    'Capilla de Nuestra Señora del Rosario · Carrera Oficial y Santa Iglesia Catedral · regreso a la Capilla.',
    'Salida anual de la cofradía con el Santísimo Cristo de las Aguas, Nuestra Madre y Señora del Mayor Dolor y María Santísima de Guadalupe.',
    1
  ),
  (
    'Procesión de Gloria',
    'Procesión de gloria de Nuestra Señora del Rosario',
    10::smallint,
    'Octubre, en torno a la festividad de Nuestra Señora del Rosario',
    'Salida y regreso desde la Capilla de Nuestra Señora del Rosario.',
    'Procesión anual de la titular gloriosa de la Hermandad por las calles de Sevilla.',
    2
  )
) as d(outing_type, title, month, date_rule, route_summary, description, display_order)
where not exists (
  select 1
  from public.outing_series os
  where os.brotherhood_entity_id = c.brotherhood_entity_id
    and os.outing_type = d.outing_type
    and os.status <> 'archived'
);

with series_sources as (
  select
    os.id as outing_series_id,
    s.id as source_id,
    case
      when os.outing_type = 'Estación de penitencia'
        then 'Jornada de salida y carácter penitencial'
      else 'Existencia y sede de la procesión de gloria'
    end as scope,
    case
      when os.outing_type = 'Estación de penitencia'
        then 'El Consejo sitúa a Las Aguas entre las cofradías del Lunes Santo.'
      else 'El Consejo documenta la procesión de Nuestra Señora del Rosario desde la Capilla de Las Aguas.'
    end as notes
  from public.outing_series os
  join public.entities h on h.id = os.brotherhood_entity_id
  join public.sources s on s.url = case
    when os.outing_type = 'Estación de penitencia'
      then 'https://www.hermandades-de-sevilla.org/semanasanta/ls_las_aguas.html'
    else 'https://www.hermandades-de-sevilla.org/events/hermandades-de-gloria-que-procesionan-el-14-de-octubre/'
  end
  where h.slug = 'las-aguas-sevilla'
    and os.outing_type in ('Estación de penitencia', 'Procesión de Gloria')
    and os.status = 'published'
)
insert into public.source_links (source_id, outing_series_id, scope, notes)
select source_id, outing_series_id, scope, notes
from series_sources ss
where not exists (
  select 1
  from public.source_links sl
  where sl.source_id = ss.source_id
    and sl.outing_series_id = ss.outing_series_id
);

do $$
declare
  station_count integer;
  glory_count integer;
  unsourced_count integer;
begin
  select count(*) into station_count
  from public.outing_series os
  join public.entities h on h.id = os.brotherhood_entity_id
  where h.slug = 'las-aguas-sevilla'
    and os.outing_type = 'Estación de penitencia'
    and os.status = 'published';

  select count(*) into glory_count
  from public.outing_series os
  join public.entities h on h.id = os.brotherhood_entity_id
  where h.slug = 'las-aguas-sevilla'
    and os.outing_type = 'Procesión de Gloria'
    and os.status = 'published';

  select count(*) into unsourced_count
  from public.outing_series os
  join public.entities h on h.id = os.brotherhood_entity_id
  where h.slug = 'las-aguas-sevilla'
    and os.outing_type in ('Estación de penitencia', 'Procesión de Gloria')
    and os.status = 'published'
    and not exists (
      select 1 from public.source_links sl where sl.outing_series_id = os.id
    );

  if station_count <> 1 then
    raise exception 'Las Aguas no queda con una única estación de penitencia habitual publicada';
  end if;
  if glory_count <> 1 then
    raise exception 'Las Aguas no queda con una única procesión de gloria habitual publicada';
  end if;
  if unsourced_count <> 0 then
    raise exception 'Las salidas habituales de Las Aguas quedan sin Fuente';
  end if;
end $$;
