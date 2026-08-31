-- Hilo Cofrade · Igualás de Cuatrovitas, Guadalupe y Mercedes de la Puerta Real · 2026
-- Versión aplicada en Supabase: 20260831074355
--
-- Las tres convocatorias se publican desde fuentes oficiales. Los campos no
-- anunciados permanecen nulos: Guadalupe no publica requisitos adicionales y
-- Mercedes de la Puerta Real no publica capataz ni requisitos.

begin;

create temporary table crew_calls_20260831 (
  event_slug text primary key,
  event_name text not null,
  event_summary text not null,
  event_date date not null,
  event_date_text text not null,
  start_time time not null,
  time_text text not null,
  brotherhood_slug text not null,
  step_slug text not null,
  step_name text not null,
  step_summary text not null,
  step_description text not null,
  place_slug text,
  place_name text,
  place_type text,
  place_address text,
  location_text text not null,
  requirements text,
  public_notes text,
  capataz_slug text,
  capataz_name text,
  capataz_description text,
  source_name text not null,
  source_url text not null,
  source_type text not null,
  source_publisher text not null,
  source_publication_date date,
  source_notes text not null
) on commit drop;

insert into crew_calls_20260831 values
(
  'iguala-virgen-cuatrovitas-2026',
  'Igualá de la Virgen de Cuatrovitas',
  'Igualá de costaleros del paso de Nuestra Señora de Cuatrovitas, convocada para el 1 de septiembre de 2026 a las 21:00.',
  date '2026-09-01',
  '1 de septiembre de 2026',
  time '21:00',
  '21:00',
  'cuatrovitas-bollullos',
  'paso-procesional-nuestra-senora-cuatrovitas-bollullos',
  'Paso procesional de Nuestra Señora de Cuatrovitas',
  'Paso procesional de Nuestra Señora de Cuatrovitas, titular letífica de la Hermandad de Cuatrovitas.',
  'Paso que porta a Nuestra Señora de Cuatrovitas en su salida procesional.',
  'nave-hermandad-cuatrovitas-bollullos',
  'Nave de la Hermandad de Cuatrovitas',
  'Dependencia de la Hermandad',
  'Calle Antonio Cuesta, 2',
  'Nave de la Hermandad, calle Antonio Cuesta, 2',
  'Ser hermano de la Hermandad con al menos un año de antigüedad, estar al corriente de pago de la cuota de hermano y asistir con el calzado con el que se realizará la salida procesional.',
  null,
  'manuel-pinto-montero',
  'Manuel Pinto Montero',
  'Capataz del paso de Nuestra Señora de Cuatrovitas en la igualá oficial de 2026.',
  'Igualá del paso de la Virgen de Cuatrovitas · 2026',
  'https://www.instagram.com/p/DcIxzvFM1M-/',
  'Red social oficial',
  'Hermandad de Santa María de Cuatrovitas',
  date '2026-08-17',
  'Convocatoria oficial para fecha, hora, lugar, paso, capataz y requisitos.'
),
(
  'iguala-nuestra-senora-guadalupe-sevilla-2026',
  'Igualá de Nuestra Señora de Guadalupe',
  'Igualá de la cuadrilla de Nuestra Señora de Guadalupe, convocada para el 3 de septiembre de 2026 a las 20:30.',
  date '2026-09-03',
  '3 de septiembre de 2026',
  time '20:30',
  '20:30',
  'guadalupe-san-buenaventura',
  'paso-procesional-nuestra-senora-guadalupe-san-buenaventura',
  'Paso procesional de Nuestra Señora de Guadalupe',
  'Paso procesional de Nuestra Señora de Guadalupe de la Hermandad de San Buenaventura.',
  'Paso que porta a Nuestra Señora de Guadalupe en su salida procesional.',
  'convento-san-buenaventura-sevilla',
  'Convento de San Buenaventura',
  'Convento',
  null,
  'Convento de San Buenaventura',
  null,
  'Están citados los costaleros de la cuadrilla y aspirantes. La salida procesional está prevista para el 12 de septiembre de 2026.',
  'jose-manuel-rechi',
  'José Manuel Rechi',
  'Capataz de Nuestra Señora de Guadalupe en la igualá oficial de 2026.',
  'Igualá de costaleros 2026 · Nuestra Señora de Guadalupe',
  'https://hermandaddeguadalupe.wordpress.com/2026/08/24/iguala-de-costaleros-2026/',
  'Fuente oficial',
  'Hermandad de Nuestra Señora de Guadalupe de Sevilla',
  date '2026-08-24',
  'Convocatoria oficial para fecha, hora, lugar, paso y capataz; no publica requisitos adicionales.'
),
(
  'iguala-mercedes-puerta-real-2026',
  'Igualá de Nuestra Señora de las Mercedes Coronada',
  'Igualá de costaleros del paso de Nuestra Señora de las Mercedes Coronada, convocada para el 12 de septiembre de 2026 a las 10:30.',
  date '2026-09-12',
  '12 de septiembre de 2026',
  time '10:30',
  '10:30',
  'mercedes-puerta-real',
  'paso-procesional-nuestra-senora-mercedes-puerta-real',
  'Paso procesional de Nuestra Señora de las Mercedes Coronada',
  'Paso procesional de Nuestra Señora de las Mercedes Coronada de la Hermandad de la Puerta Real.',
  'Paso que porta a Nuestra Señora de las Mercedes Coronada en su salida procesional.',
  null,
  null,
  null,
  null,
  'Calle Torneo, 70',
  null,
  'Convocatoria preparatoria para la salida procesional de Nuestra Señora de las Mercedes Coronada del 26 de septiembre de 2026.',
  null,
  null,
  null,
  'Igualá de Nuestra Señora de las Mercedes Coronada · 2026',
  'https://www.facebook.com/MercedesPuertaReal/photos/procesi%C3%B3n-el-pr%C3%B3ximo-d%C3%ADa-12-de-septiembre-a-las-1030h-de-la-ma%C3%B1ana-con-cita-en-l/1375819348082656/',
  'Red social oficial',
  'Hermandad de las Mercedes de la Puerta Real',
  null,
  'Convocatoria oficial para fecha, hora, lugar y paso; no publica capataz ni requisitos.'
);

-- Las ramas de preview no copian datos de producción. Conservamos únicamente
-- las convocatorias cuya Hermandad canónica ya existe en la base de destino;
-- así la migración es un no-op seguro en una rama mínima y mantiene exactamente
-- el mismo resultado histórico en producción.
delete from crew_calls_20260831 call
where not exists (
  select 1
  from public.entities brotherhood_entity
  join public.brotherhoods brotherhood
    on brotherhood.entity_id = brotherhood_entity.id
  where brotherhood_entity.slug = call.brotherhood_slug
    and brotherhood_entity.entity_type = 'brotherhood'
    and brotherhood_entity.status = 'published'
);

-- Lugares institucionales anunciados. El punto de encuentro de Mercedes se
-- conserva como texto para no convertir una dirección puntual en una sede.
insert into public.places (
  id,
  municipality_id,
  name,
  slug,
  place_type,
  address,
  notes
)
select
  gen_random_uuid(),
  brotherhood.municipality_id,
  call.place_name,
  call.place_slug,
  call.place_type,
  call.place_address,
  'Lugar anunciado en la convocatoria oficial de la igualá de 2026.'
from crew_calls_20260831 call
join public.entities brotherhood_entity
  on brotherhood_entity.slug = call.brotherhood_slug
 and brotherhood_entity.entity_type = 'brotherhood'
join public.brotherhoods brotherhood
  on brotherhood.entity_id = brotherhood_entity.id
where call.place_slug is not null
on conflict (slug) do update
set municipality_id = excluded.municipality_id,
    name = excluded.name,
    place_type = excluded.place_type,
    address = coalesce(excluded.address, public.places.address),
    notes = excluded.notes,
    updated_at = now();

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
  call.step_name,
  call.step_slug,
  call.step_summary,
  'published'
from crew_calls_20260831 call
on conflict (slug) do update
set name = excluded.name,
    summary = excluded.summary,
    status = 'published',
    updated_at = now();

insert into public.steps (
  entity_id,
  step_type,
  description
)
select
  step.id,
  'Paso procesional de Gloria',
  call.step_description
from crew_calls_20260831 call
join public.entities step
  on step.slug = call.step_slug
 and step.entity_type = 'step'
on conflict (entity_id) do update
set step_type = excluded.step_type,
    description = excluded.description;

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
  'Paso procesional identificado en la convocatoria oficial de la igualá de 2026.',
  'published'
from crew_calls_20260831 call
join public.entities brotherhood
  on brotherhood.slug = call.brotherhood_slug
 and brotherhood.entity_type = 'brotherhood'
join public.entities step
  on step.slug = call.step_slug
 and step.entity_type = 'step'
where not exists (
  select 1
  from public.brotherhood_steps existing
  where existing.brotherhood_entity_id = brotherhood.id
    and existing.step_entity_id = step.id
    and existing.relation_type = 'processional_step'
    and existing.status <> 'archived'
);

update public.brotherhood_steps relation
set notes = 'Paso procesional identificado en la convocatoria oficial de la igualá de 2026.',
    status = 'published'
from crew_calls_20260831 call
join public.entities brotherhood
  on brotherhood.slug = call.brotherhood_slug
 and brotherhood.entity_type = 'brotherhood'
join public.entities step
  on step.slug = call.step_slug
 and step.entity_type = 'step'
where relation.brotherhood_entity_id = brotherhood.id
  and relation.step_entity_id = step.id
  and relation.relation_type = 'processional_step'
  and relation.status <> 'archived';

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
  'agent',
  call.capataz_name,
  call.capataz_slug,
  call.capataz_description,
  'published'
from crew_calls_20260831 call
where call.capataz_slug is not null
on conflict (slug) do update
set name = excluded.name,
    summary = excluded.summary,
    status = 'published',
    updated_at = now();

insert into public.agents (
  entity_id,
  agent_kind,
  description
)
select
  agent.id,
  'person',
  call.capataz_description
from crew_calls_20260831 call
join public.entities agent
  on agent.slug = call.capataz_slug
 and agent.entity_type = 'agent'
where call.capataz_slug is not null
on conflict (entity_id) do update
set agent_kind = excluded.agent_kind,
    description = excluded.description;

insert into public.step_personnel_periods (
  id,
  step_entity_id,
  agent_entity_id,
  role_name,
  date_from_text,
  is_current,
  notes,
  status
)
select
  gen_random_uuid(),
  step.id,
  agent.id,
  'Capataz',
  'Fecha inicial no documentada; vigente en 2026',
  true,
  'Capatacía confirmada por la convocatoria oficial de la igualá de 2026.',
  'published'
from crew_calls_20260831 call
join public.entities step
  on step.slug = call.step_slug
 and step.entity_type = 'step'
join public.entities agent
  on agent.slug = call.capataz_slug
 and agent.entity_type = 'agent'
where call.capataz_slug is not null
  and not exists (
    select 1
    from public.step_personnel_periods existing
    where existing.step_entity_id = step.id
      and existing.agent_entity_id = agent.id
      and lower(existing.role_name) = 'capataz'
      and existing.is_current = true
      and existing.status <> 'archived'
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
  'event',
  call.event_name,
  call.event_slug,
  call.event_summary,
  'draft'
from crew_calls_20260831 call
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
  'iguala',
  call.event_date,
  call.event_date_text,
  place.id,
  'Igualá de costaleros del ' || lower(call.step_name) || '.',
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
from crew_calls_20260831 call
join public.entities event_entity
  on event_entity.slug = call.event_slug
 and event_entity.entity_type = 'event'
join public.entities brotherhood_entity
  on brotherhood_entity.slug = call.brotherhood_slug
 and brotherhood_entity.entity_type = 'brotherhood'
join public.brotherhoods brotherhood
  on brotherhood.entity_id = brotherhood_entity.id
left join public.places place
  on place.slug = call.place_slug
on conflict (entity_id) do update
set event_type = excluded.event_type,
    event_date = excluded.event_date,
    event_date_text = excluded.event_date_text,
    place_id = excluded.place_id,
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
from crew_calls_20260831 call
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
  'Paso convocado en la igualá.',
  'published'
from crew_calls_20260831 call
join public.entities event_entity
  on event_entity.slug = call.event_slug
 and event_entity.entity_type = 'event'
join public.entities step
  on step.slug = call.step_slug
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
    notes = 'Paso convocado en la igualá.',
    status = 'published',
    updated_at = now()
from crew_calls_20260831 call
join public.entities event_entity
  on event_entity.slug = call.event_slug
 and event_entity.entity_type = 'event'
join public.entities step
  on step.slug = call.step_slug
 and step.entity_type = 'step'
where relation.event_entity_id = event_entity.id
  and relation.step_entity_id = step.id
  and relation.status <> 'archived';

insert into public.crew_event_agents (
  id,
  event_entity_id,
  agent_entity_id,
  role_name,
  is_primary,
  sort_order,
  notes,
  status
)
select
  gen_random_uuid(),
  event_entity.id,
  agent.id,
  'Capataz',
  true,
  0,
  'Capataz anunciado en la convocatoria oficial.',
  'published'
from crew_calls_20260831 call
join public.entities event_entity
  on event_entity.slug = call.event_slug
 and event_entity.entity_type = 'event'
join public.entities agent
  on agent.slug = call.capataz_slug
 and agent.entity_type = 'agent'
where call.capataz_slug is not null
  and not exists (
    select 1
    from public.crew_event_agents existing
    where existing.event_entity_id = event_entity.id
      and existing.agent_entity_id = agent.id
      and lower(existing.role_name) = 'capataz'
      and existing.status <> 'archived'
  );

update public.crew_event_agents relation
set is_primary = true,
    sort_order = 0,
    notes = 'Capataz anunciado en la convocatoria oficial.',
    status = 'published',
    updated_at = now()
from crew_calls_20260831 call
join public.entities event_entity
  on event_entity.slug = call.event_slug
 and event_entity.entity_type = 'event'
join public.entities agent
  on agent.slug = call.capataz_slug
 and agent.entity_type = 'agent'
where call.capataz_slug is not null
  and relation.event_entity_id = event_entity.id
  and relation.agent_entity_id = agent.id
  and lower(relation.role_name) = 'capataz'
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
  call.source_name,
  call.source_url,
  call.source_type,
  call.source_publisher,
  call.source_publication_date,
  date '2026-08-31',
  call.source_notes
from crew_calls_20260831 call
where not exists (
  select 1
  from public.sources existing
  where existing.url = call.source_url
);

update public.sources source
set name = call.source_name,
    source_type = call.source_type,
    author_or_publisher = call.source_publisher,
    publication_date = call.source_publication_date,
    accessed_at = date '2026-08-31',
    notes = call.source_notes
from crew_calls_20260831 call
where source.url = call.source_url;

with targets as (
  select event_slug as entity_slug, source_url,
         'Convocatoria de igualá 2026'::text as scope,
         source_notes as notes
  from crew_calls_20260831
  union all
  select step_slug, source_url,
         'Paso convocado en la igualá'::text,
         'La convocatoria oficial identifica el paso al que se dirige la igualá.'::text
  from crew_calls_20260831
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
join public.sources source
  on source.url = target.source_url
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
  'La convocatoria oficial identifica este paso como perteneciente a la Hermandad.'
from crew_calls_20260831 call
join public.sources source
  on source.url = call.source_url
join public.entities brotherhood
  on brotherhood.slug = call.brotherhood_slug
 and brotherhood.entity_type = 'brotherhood'
join public.entities step
  on step.slug = call.step_slug
 and step.entity_type = 'step'
join public.brotherhood_steps relation
  on relation.brotherhood_entity_id = brotherhood.id
 and relation.step_entity_id = step.id
 and relation.relation_type = 'processional_step'
 and relation.status = 'published'
where not exists (
  select 1
  from public.source_links existing
  where existing.source_id = source.id
    and existing.brotherhood_step_id = relation.id
);

insert into public.source_links (
  id,
  source_id,
  step_personnel_period_id,
  scope,
  notes
)
select
  gen_random_uuid(),
  source.id,
  period.id,
  'Capataz 2026',
  'La convocatoria oficial identifica a la persona responsable de la capatacía.'
from crew_calls_20260831 call
join public.sources source
  on source.url = call.source_url
join public.entities step
  on step.slug = call.step_slug
 and step.entity_type = 'step'
join public.entities agent
  on agent.slug = call.capataz_slug
 and agent.entity_type = 'agent'
join public.step_personnel_periods period
  on period.step_entity_id = step.id
 and period.agent_entity_id = agent.id
 and lower(period.role_name) = 'capataz'
 and period.is_current = true
 and period.status = 'published'
where call.capataz_slug is not null
  and not exists (
    select 1
    from public.source_links existing
    where existing.source_id = source.id
      and existing.step_personnel_period_id = period.id
  );

do $$
declare
  call record;
  brotherhood_id uuid;
  event_id uuid;
  step_id uuid;
begin
  for call in select * from crew_calls_20260831 loop
    select id into brotherhood_id
    from public.entities
    where slug = call.brotherhood_slug
      and entity_type = 'brotherhood'
      and status = 'published';

    select id into event_id
    from public.entities
    where slug = call.event_slug
      and entity_type = 'event'
      and status = 'published';

    select id into step_id
    from public.entities
    where slug = call.step_slug
      and entity_type = 'step'
      and status = 'published';

    if brotherhood_id is null or event_id is null or step_id is null then
      raise exception '%: faltan la Hermandad, la convocatoria o el paso publicado', call.event_slug;
    end if;

    if not exists (
      select 1
      from public.events event
      left join public.places place on place.id = event.place_id
      where event.entity_id = event_id
        and event.event_category = 'crew_call'
        and event.event_type = 'iguala'
        and event.event_date = call.event_date
        and event.start_time = call.start_time
        and event.event_status = 'announced'
        and event.brotherhood_entity_id = brotherhood_id
        and event.location_text = call.location_text
        and event.requirements is not distinct from call.requirements
        and event.public_notes is not distinct from call.public_notes
        and place.slug is not distinct from call.place_slug
    ) then
      raise exception '%: la igualá no conserva exactamente los datos anunciados', call.event_slug;
    end if;

    if not exists (
      select 1
      from public.crew_event_steps relation
      where relation.event_entity_id = event_id
        and relation.step_entity_id = step_id
        and relation.is_primary = true
        and relation.status = 'published'
    ) then
      raise exception '%: falta el paso vinculado a la igualá', call.event_slug;
    end if;

    if call.capataz_slug is null then
      if exists (
        select 1
        from public.crew_event_agents relation
        where relation.event_entity_id = event_id
          and relation.status <> 'archived'
      ) then
        raise exception '%: no debe publicarse una capatacía no anunciada', call.event_slug;
      end if;
    elsif not exists (
      select 1
      from public.crew_event_agents relation
      join public.entities agent on agent.id = relation.agent_entity_id
      where relation.event_entity_id = event_id
        and agent.slug = call.capataz_slug
        and lower(relation.role_name) = 'capataz'
        and relation.is_primary = true
        and relation.status = 'published'
    ) then
      raise exception '%: falta el capataz anunciado', call.event_slug;
    end if;

    if not exists (
      select 1
      from public.source_links source_link
      join public.sources source on source.id = source_link.source_id
      where source_link.entity_id = event_id
        and source.url = call.source_url
    ) then
      raise exception '%: falta la fuente oficial de la convocatoria', call.event_slug;
    end if;
  end loop;
end;
$$;

commit;
