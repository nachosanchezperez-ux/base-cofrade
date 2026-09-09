-- Hilo Cofrade · Igualá y ensayos del paso del Niño Jesús de San Bernardo · 2026
-- Corte editorial: 2026-09-06
-- Versión aplicada en Supabase: 20260906060559
--
-- Una realidad, una entidad: la cita del 3 de septiembre reúne igualá y
-- primer ensayo, por lo que se publica como una sola convocatoria de tipo
-- "iguala". La posible mudá del 12 de septiembre queda únicamente como nota
-- provisional porque la Hermandad no la confirma en el cartel.
-- Solo DML editorial. Sin DDL, RLS ni cambios estructurales.

begin;

create temporary table crew_calls_san_bernardo_20260906 (
  event_slug text primary key,
  event_name text not null,
  event_summary text not null,
  event_description text not null,
  event_type text not null,
  event_date date not null,
  event_date_text text not null,
  start_time time,
  time_text text,
  location_text text,
  requirements text not null,
  public_notes text not null
) on commit drop;

insert into crew_calls_san_bernardo_20260906 values
(
  'iguala-y-primer-ensayo-nino-jesus-san-bernardo-2026',
  'Igualá y primer ensayo del paso del Niño Jesús de San Bernardo',
  'Igualá y primer ensayo del paso del Niño Jesús de la procesión eucarística de San Bernardo, convocados para el 3 de septiembre de 2026 a las 19:00.',
  'Convocatoria conjunta de igualá y primer ensayo de la cuadrilla del paso del Niño Jesús para la procesión eucarística de San Bernardo del 14 de septiembre de 2026.',
  'iguala',
  date '2026-09-03',
  '3 de septiembre de 2026',
  time '19:00',
  '19:00',
  'Casa de Hermandad',
  'Acudir con calzado de salida, preferentemente negro, costal, faja y ropa cómoda de ensayo.',
  'La convocatoria reúne en una misma cita la igualá y el primer ensayo. La altura mínima aproximada indicada es de 145 cm.'
),
(
  'segundo-ensayo-nino-jesus-san-bernardo-2026',
  'Segundo ensayo del paso del Niño Jesús de San Bernardo',
  'Segundo ensayo del paso del Niño Jesús de la procesión eucarística de San Bernardo, convocado para el 8 de septiembre de 2026.',
  'Segundo ensayo de la cuadrilla del paso del Niño Jesús para la procesión eucarística de San Bernardo del 14 de septiembre de 2026.',
  'ensayo',
  date '2026-09-08',
  '8 de septiembre de 2026',
  null,
  null,
  null,
  'Acudir con calzado de salida, preferentemente negro, costal, faja y ropa cómoda de ensayo.',
  'La hora y el lugar no han sido publicados. La altura mínima aproximada indicada es de 145 cm. El cartel anuncia como posible, no confirmada, una mudá el sábado 12 de septiembre por la tarde.'
),
(
  'tercer-ensayo-nino-jesus-san-bernardo-2026',
  'Tercer ensayo del paso del Niño Jesús de San Bernardo',
  'Tercer ensayo del paso del Niño Jesús de la procesión eucarística de San Bernardo, convocado para el 10 de septiembre de 2026.',
  'Tercer ensayo de la cuadrilla del paso del Niño Jesús para la procesión eucarística de San Bernardo del 14 de septiembre de 2026.',
  'ensayo',
  date '2026-09-10',
  '10 de septiembre de 2026',
  null,
  null,
  null,
  'Acudir con calzado de salida, preferentemente negro, costal, faja y ropa cómoda de ensayo.',
  'La hora y el lugar no han sido publicados. La altura mínima aproximada indicada es de 145 cm. El cartel anuncia como posible, no confirmada, una mudá el sábado 12 de septiembre por la tarde.'
);

-- Las Preview Branches pueden no contener todo el universo editorial de
-- producción. Si falta la Hermandad canónica, la migración es un no-op seguro.
delete from crew_calls_san_bernardo_20260906
where not exists (
  select 1
  from public.entities brotherhood_entity
  join public.brotherhoods brotherhood
    on brotherhood.entity_id = brotherhood_entity.id
  where brotherhood_entity.slug = 'hermandad-de-san-bernardo'
    and brotherhood_entity.entity_type = 'brotherhood'
    and brotherhood_entity.status = 'published'
);

create temporary table crew_sources_san_bernardo_20260906 (
  source_name text not null,
  source_url text primary key,
  source_type text not null,
  source_publisher text not null,
  source_publication_date date,
  source_notes text not null
) on commit drop;

insert into crew_sources_san_bernardo_20260906 values
(
  'Igualá y ensayos del paso del Niño Jesús · 2026',
  'https://www.facebook.com/hermandaddesanbernardo/posts/1412742374292755/',
  'Red social oficial',
  'Hermandad de San Bernardo',
  null,
  'Convocatoria oficial para el calendario actualizado, el paso, los requisitos y la altura mínima aproximada. No identifica capataz y mantiene la mudá del 12 de septiembre como posible.'
),
(
  'Igualá y ensayos del paso del Niño Jesús para la procesión eucarística · 2026',
  'https://www.artesacro.org/Noticia/Ver/168911/faja-y-costal-iguala-y-ensayos-paso-nino-jesus-procesion-eucaristica-san',
  'Medio especializado',
  'Arte Sacro',
  date '2026-09-03',
  'Contraste contemporáneo de las fechas, la hora y el lugar de la primera cita, los requisitos, la altura aproximada y el carácter no confirmado de la mudá.'
);

insert into public.entities (
  id,
  entity_type,
  name,
  slug,
  summary,
  status
)
select
  gen_random_uuid(),
  'step',
  'Paso del Niño Jesús de la procesión eucarística de San Bernardo',
  'paso-nino-jesus-procesion-eucaristica-san-bernardo',
  'Paso del Niño Jesús que participa en la procesión eucarística de la Hermandad de San Bernardo.',
  'published'
where exists (select 1 from crew_calls_san_bernardo_20260906)
on conflict (slug) do update
set name = excluded.name,
    summary = excluded.summary,
    status = 'published',
    updated_at = now();

insert into public.steps (
  entity_id,
  step_type,
  description,
  current_state_notes
)
select
  step.id,
  'Paso procesional eucarístico',
  'Paso que porta al Niño Jesús en la procesión eucarística de San Bernardo.',
  'Participación documentada en la procesión eucarística de San Bernardo de 2026.'
from public.entities step
where step.slug = 'paso-nino-jesus-procesion-eucaristica-san-bernardo'
  and step.entity_type = 'step'
  and exists (select 1 from crew_calls_san_bernardo_20260906)
on conflict (entity_id) do update
set step_type = excluded.step_type,
    description = excluded.description,
    current_state_notes = excluded.current_state_notes;

insert into public.brotherhood_steps (
  id,
  brotherhood_entity_id,
  step_entity_id,
  relation_type,
  notes,
  status
)
select
  gen_random_uuid(),
  brotherhood.id,
  step.id,
  'processional_step',
  'Paso del Niño Jesús participante en la procesión eucarística de San Bernardo.',
  'published'
from public.entities brotherhood
join public.entities step
  on step.slug = 'paso-nino-jesus-procesion-eucaristica-san-bernardo'
 and step.entity_type = 'step'
where brotherhood.slug = 'hermandad-de-san-bernardo'
  and brotherhood.entity_type = 'brotherhood'
  and exists (select 1 from crew_calls_san_bernardo_20260906)
  and not exists (
    select 1
    from public.brotherhood_steps existing
    where existing.brotherhood_entity_id = brotherhood.id
      and existing.step_entity_id = step.id
      and existing.relation_type = 'processional_step'
      and existing.status <> 'archived'
  );

update public.brotherhood_steps relation
set notes = 'Paso del Niño Jesús participante en la procesión eucarística de San Bernardo.',
    status = 'published'
from public.entities brotherhood
join public.entities step
  on step.slug = 'paso-nino-jesus-procesion-eucaristica-san-bernardo'
 and step.entity_type = 'step'
where brotherhood.slug = 'hermandad-de-san-bernardo'
  and brotherhood.entity_type = 'brotherhood'
  and relation.brotherhood_entity_id = brotherhood.id
  and relation.step_entity_id = step.id
  and relation.relation_type = 'processional_step'
  and relation.status <> 'archived'
  and exists (select 1 from crew_calls_san_bernardo_20260906);

insert into public.entities (
  id,
  entity_type,
  name,
  slug,
  summary,
  status
)
select
  gen_random_uuid(),
  'event',
  call.event_name,
  call.event_slug,
  call.event_summary,
  'draft'
from crew_calls_san_bernardo_20260906 call
on conflict (slug) do update
set name = excluded.name,
    summary = excluded.summary,
    updated_at = now();

insert into public.events (
  entity_id,
  event_type,
  event_date,
  event_date_text,
  place_id,
  description,
  event_category,
  brotherhood_entity_id,
  municipality_id,
  start_time,
  end_time,
  time_text,
  event_status,
  location_text,
  requirements,
  public_notes
)
select
  event_entity.id,
  call.event_type,
  call.event_date,
  call.event_date_text,
  null,
  call.event_description,
  'crew_call',
  brotherhood.entity_id,
  brotherhood.municipality_id,
  call.start_time,
  null,
  call.time_text,
  'announced',
  call.location_text,
  call.requirements,
  call.public_notes
from crew_calls_san_bernardo_20260906 call
join public.entities event_entity
  on event_entity.slug = call.event_slug
 and event_entity.entity_type = 'event'
join public.entities brotherhood_entity
  on brotherhood_entity.slug = 'hermandad-de-san-bernardo'
 and brotherhood_entity.entity_type = 'brotherhood'
join public.brotherhoods brotherhood
  on brotherhood.entity_id = brotherhood_entity.id
on conflict (entity_id) do update
set event_type = excluded.event_type,
    event_date = excluded.event_date,
    event_date_text = excluded.event_date_text,
    place_id = null,
    description = excluded.description,
    event_category = excluded.event_category,
    brotherhood_entity_id = excluded.brotherhood_entity_id,
    municipality_id = excluded.municipality_id,
    start_time = excluded.start_time,
    end_time = null,
    time_text = excluded.time_text,
    event_status = excluded.event_status,
    location_text = excluded.location_text,
    requirements = excluded.requirements,
    public_notes = excluded.public_notes,
    updated_at = now();

update public.entities event_entity
set status = 'published',
    updated_at = now()
from crew_calls_san_bernardo_20260906 call
where event_entity.slug = call.event_slug
  and event_entity.entity_type = 'event';

insert into public.crew_event_steps (
  id,
  event_entity_id,
  step_entity_id,
  is_primary,
  sort_order,
  notes,
  status
)
select
  gen_random_uuid(),
  event_entity.id,
  step.id,
  true,
  0,
  case
    when call.event_type = 'iguala' then 'Paso convocado en la igualá y primer ensayo.'
    else 'Paso convocado en el ensayo.'
  end,
  'published'
from crew_calls_san_bernardo_20260906 call
join public.entities event_entity
  on event_entity.slug = call.event_slug
 and event_entity.entity_type = 'event'
join public.entities step
  on step.slug = 'paso-nino-jesus-procesion-eucaristica-san-bernardo'
 and step.entity_type = 'step'
where not exists (
  select 1
  from public.crew_event_steps existing
  where existing.event_entity_id = event_entity.id
    and existing.step_entity_id = step.id
    and existing.status <> 'archived'
);

update public.crew_event_steps relation
set is_primary = true,
    sort_order = 0,
    notes = case
      when call.event_type = 'iguala' then 'Paso convocado en la igualá y primer ensayo.'
      else 'Paso convocado en el ensayo.'
    end,
    status = 'published',
    updated_at = now()
from crew_calls_san_bernardo_20260906 call
join public.entities event_entity
  on event_entity.slug = call.event_slug
 and event_entity.entity_type = 'event'
join public.entities step
  on step.slug = 'paso-nino-jesus-procesion-eucaristica-san-bernardo'
 and step.entity_type = 'step'
where relation.event_entity_id = event_entity.id
  and relation.step_entity_id = step.id
  and relation.status <> 'archived';

insert into public.sources (
  id,
  name,
  url,
  source_type,
  author_or_publisher,
  publication_date,
  accessed_at,
  notes
)
select
  gen_random_uuid(),
  source.source_name,
  source.source_url,
  source.source_type,
  source.source_publisher,
  source.source_publication_date,
  date '2026-09-06',
  source.source_notes
from crew_sources_san_bernardo_20260906 source
where exists (select 1 from crew_calls_san_bernardo_20260906)
  and not exists (
    select 1
    from public.sources existing
    where existing.url = source.source_url
  );

-- Ambas fuentes se vinculan a cada convocatoria y al paso; la oficial actúa
-- como fuente primaria editorial y Arte Sacro como contraste contemporáneo.
with targets as (
  select call.event_slug as entity_slug,
         'Convocatoria costalera de 2026'::text as scope,
         'Fuente para los datos públicos de la convocatoria.'::text as notes
  from crew_calls_san_bernardo_20260906 call
  union
  select 'paso-nino-jesus-procesion-eucaristica-san-bernardo',
         'Paso convocado en 2026',
         'La fuente identifica el paso al que se dirige la convocatoria.'
  where exists (select 1 from crew_calls_san_bernardo_20260906)
)
insert into public.source_links (
  id,
  source_id,
  entity_id,
  scope,
  notes
)
select
  gen_random_uuid(),
  source.id,
  entity.id,
  target.scope,
  target.notes
from targets target
cross join crew_sources_san_bernardo_20260906 source_data
join public.sources source
  on source.url = source_data.source_url
join public.entities entity
  on entity.slug = target.entity_slug
where not exists (
  select 1
  from public.source_links existing
  where existing.source_id = source.id
    and existing.entity_id = entity.id
);

insert into public.source_links (
  id,
  source_id,
  brotherhood_step_id,
  scope,
  notes
)
select
  gen_random_uuid(),
  source.id,
  relation.id,
  'Paso de la Hermandad',
  'La fuente identifica el paso del Niño Jesús dentro de la Hermandad de San Bernardo.'
from crew_sources_san_bernardo_20260906 source_data
join public.sources source
  on source.url = source_data.source_url
join public.entities brotherhood
  on brotherhood.slug = 'hermandad-de-san-bernardo'
 and brotherhood.entity_type = 'brotherhood'
join public.entities step
  on step.slug = 'paso-nino-jesus-procesion-eucaristica-san-bernardo'
 and step.entity_type = 'step'
join public.brotherhood_steps relation
  on relation.brotherhood_entity_id = brotherhood.id
 and relation.step_entity_id = step.id
 and relation.relation_type = 'processional_step'
 and relation.status = 'published'
where exists (select 1 from crew_calls_san_bernardo_20260906)
  and not exists (
    select 1
    from public.source_links existing
    where existing.source_id = source.id
      and existing.brotherhood_step_id = relation.id
  );

do $$
declare
  call record;
  brotherhood_id uuid;
  event_id uuid;
  step_id uuid;
  linked_steps integer;
  linked_agents integer;
  linked_sources integer;
begin
  select id into brotherhood_id
  from public.entities
  where slug = 'hermandad-de-san-bernardo'
    and entity_type = 'brotherhood'
    and status = 'published';

  select id into step_id
  from public.entities
  where slug = 'paso-nino-jesus-procesion-eucaristica-san-bernardo'
    and entity_type = 'step'
    and status = 'published';

  if exists (select 1 from crew_calls_san_bernardo_20260906)
     and (brotherhood_id is null or step_id is null) then
    raise exception 'Faltan la Hermandad de San Bernardo o el paso del Niño Jesús publicado';
  end if;

  for call in select * from crew_calls_san_bernardo_20260906 loop
    select id into event_id
    from public.entities
    where slug = call.event_slug
      and entity_type = 'event'
      and status = 'published';

    if event_id is null then
      raise exception '%: falta la convocatoria publicada', call.event_slug;
    end if;

    if not exists (
      select 1
      from public.events event
      where event.entity_id = event_id
        and event.event_category = 'crew_call'
        and event.event_type = call.event_type
        and event.event_date = call.event_date
        and event.start_time is not distinct from call.start_time
        and event.time_text is not distinct from call.time_text
        and event.event_status = 'announced'
        and event.brotherhood_entity_id = brotherhood_id
        and event.place_id is null
        and event.location_text is not distinct from call.location_text
        and event.requirements = call.requirements
        and event.public_notes = call.public_notes
    ) then
      raise exception '%: la convocatoria no conserva exactamente los datos publicados', call.event_slug;
    end if;

    select count(*) into linked_steps
    from public.crew_event_steps relation
    where relation.event_entity_id = event_id
      and relation.step_entity_id = step_id
      and relation.is_primary = true
      and relation.status = 'published';

    if linked_steps <> 1 then
      raise exception '%: debe tener exactamente un paso principal', call.event_slug;
    end if;

    select count(*) into linked_agents
    from public.crew_event_agents relation
    where relation.event_entity_id = event_id
      and relation.status = 'published';

    if linked_agents <> 0 then
      raise exception '%: no debe atribuirse un capataz no publicado', call.event_slug;
    end if;

    select count(distinct source.url) into linked_sources
    from public.source_links source_link
    join public.sources source on source.id = source_link.source_id
    where source_link.entity_id = event_id
      and source.url in (
        'https://www.facebook.com/hermandaddesanbernardo/posts/1412742374292755/',
        'https://www.artesacro.org/Noticia/Ver/168911/faja-y-costal-iguala-y-ensayos-paso-nino-jesus-procesion-eucaristica-san'
      );

    if linked_sources <> 2 then
      raise exception '%: faltan la fuente oficial o su contraste', call.event_slug;
    end if;
  end loop;

  if exists (select 1 from crew_calls_san_bernardo_20260906)
     and not exists (
       select 1
       from public.brotherhood_steps relation
       where relation.brotherhood_entity_id = brotherhood_id
         and relation.step_entity_id = step_id
         and relation.relation_type = 'processional_step'
         and relation.status = 'published'
     ) then
    raise exception 'Falta la relación entre San Bernardo y el paso del Niño Jesús';
  end if;

  if exists (
    select 1
    from public.events event
    join public.entities entity on entity.id = event.entity_id
    where entity.slug in (
      'segundo-ensayo-nino-jesus-san-bernardo-2026',
      'tercer-ensayo-nino-jesus-san-bernardo-2026'
    )
      and (
        event.start_time is not null
        or event.time_text is not null
        or event.location_text is not null
      )
  ) then
    raise exception 'Los ensayos del 8 y 10 de septiembre no deben inventar hora ni lugar';
  end if;
end
$$;

commit;
