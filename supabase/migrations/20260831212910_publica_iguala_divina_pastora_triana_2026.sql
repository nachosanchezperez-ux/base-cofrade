-- Hilo Cofrade · Igualá de la Divina Pastora de Triana · 2026
-- Versión aplicada en Supabase: 20260831212910
--
-- La convocatoria oficial confirma fecha, hora, lugar y calzado. El nombre
-- del capataz se acredita mediante una publicación oficial independiente de
-- la Hermandad; el inicio de su etapa en 2022 se documenta con una fuente
-- contemporánea. El local del Bar Bistec se conserva como punto de encuentro
-- textual, no como sede canónica.

begin;

create temporary table crew_call_pastora_triana_20260831 (
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
  location_text text not null,
  requirements text not null,
  capataz_slug text not null,
  capataz_name text not null,
  capataz_description text not null
) on commit drop;

insert into crew_call_pastora_triana_20260831 values (
  'iguala-divina-pastora-triana-2026',
  'Igualá de la Divina Pastora de Triana',
  'Igualá de la cuadrilla de costaleros de la Divina Pastora de Triana, convocada para el 3 de septiembre de 2026 a las 21:30.',
  date '2026-09-03',
  '3 de septiembre de 2026',
  time '21:30',
  '21:30',
  'pastora-de-triana',
  'paso-procesional-divina-pastora-triana',
  'Paso procesional de la Divina Pastora de las Almas Coronada',
  'Paso procesional de la Divina Pastora de las Almas Coronada de la Hermandad de la Pastora de Triana.',
  'Paso que porta a la Divina Pastora de las Almas Coronada en su salida procesional.',
  'Local del Bar Bistec, calle Pelay Correa, 37',
  'Acudir con calzado blanco de salida.',
  'miguel-angel-perez-pascual',
  'Miguel Ángel Pérez Pascual',
  'Capataz del paso de la Divina Pastora de Triana desde 2022, con designación oficial confirmada para la procesión de 2026.'
);

-- Las ramas de preview no copian datos de producción. Si no existe la
-- Hermandad canónica, esta migración se convierte en un no-op seguro.
delete from crew_call_pastora_triana_20260831 call
where not exists (
  select 1
  from public.entities brotherhood_entity
  join public.brotherhoods brotherhood
    on brotherhood.entity_id = brotherhood_entity.id
  where brotherhood_entity.slug = call.brotherhood_slug
    and brotherhood_entity.entity_type = 'brotherhood'
    and brotherhood_entity.status = 'published'
);

create temporary table pastora_triana_sources_20260831 (
  source_key text primary key,
  source_name text not null,
  source_url text not null,
  source_type text not null,
  source_publisher text not null,
  source_publication_date date,
  source_notes text not null
) on commit drop;

insert into pastora_triana_sources_20260831 values
(
  'iguala',
  'Igualá de la Divina Pastora de Triana · 2026',
  'https://www.facebook.com/divinapastoradetriana/posts/-noticiaspastore%C3%B1as-igual%C3%A1-de-la-cuadrilla-de-costaleros-para-la-pr%C3%B3xima-procesi/1493386516157074/',
  'Red social oficial',
  'Hermandad Divina Pastora de Triana',
  null,
  'Convocatoria oficial para fecha, hora, lugar, paso y requisito de calzado; no incluye el nombre del capataz.'
),
(
  'capataz_2026',
  'Nombramiento de Miguel Ángel Pérez Pascual · procesión 2026',
  'https://www.facebook.com/divinapastoradetriana/posts/-noticiaspastore%C3%B1as-la-junta-de-gobierno-en-cabildo-de-oficiales-celebrado-en-d%C3%AD/1429439689218424/',
  'Red social oficial',
  'Hermandad Divina Pastora de Triana',
  null,
  'Publicación oficial independiente que confirma a Miguel Ángel Pérez Pascual como capataz para la próxima salida procesional.'
),
(
  'inicio_2022',
  'Miguel Ángel Pérez Pascual, nuevo capataz de la Pastora de Triana · 2022',
  'https://www.gentedepaz.es/la-pastora-de-triana-nombra-nuevo-capataz/',
  'Medio especializado',
  'Gente de Paz',
  date '2022-02-17',
  'Fuente contemporánea al nombramiento inicial de 2022; se usa únicamente para documentar el inicio de la etapa.'
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
  call.step_name,
  call.step_slug,
  call.step_summary,
  'published'
from crew_call_pastora_triana_20260831 call
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
  'Paso procesional de Gloria',
  call.step_description,
  'Paso procesional actual de la Divina Pastora de las Almas Coronada.'
from crew_call_pastora_triana_20260831 call
join public.entities step
  on step.slug = call.step_slug
 and step.entity_type = 'step'
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
  'Paso procesional actual de la Divina Pastora de las Almas Coronada.',
  'published'
from crew_call_pastora_triana_20260831 call
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
set notes = 'Paso procesional actual de la Divina Pastora de las Almas Coronada.',
    status = 'published'
from crew_call_pastora_triana_20260831 call
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
from crew_call_pastora_triana_20260831 call
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
from crew_call_pastora_triana_20260831 call
join public.entities agent
  on agent.slug = call.capataz_slug
 and agent.entity_type = 'agent'
on conflict (entity_id) do update
set agent_kind = excluded.agent_kind,
    description = excluded.description;

insert into public.step_personnel_periods (
  id,
  step_entity_id,
  agent_entity_id,
  role_name,
  date_from_text,
  year_from,
  is_current,
  notes,
  status
)
select
  gen_random_uuid(),
  step.id,
  agent.id,
  'Capataz',
  'Desde 2022; nombramiento anual confirmado para la procesión de 2026',
  2022,
  true,
  'Miguel Ángel Pérez Pascual fue nombrado capataz en 2022 y la Hermandad confirmó su designación para la procesión de 2026.',
  'published'
from crew_call_pastora_triana_20260831 call
join public.entities step
  on step.slug = call.step_slug
 and step.entity_type = 'step'
join public.entities agent
  on agent.slug = call.capataz_slug
 and agent.entity_type = 'agent'
where not exists (
  select 1
  from public.step_personnel_periods existing
  where existing.step_entity_id = step.id
    and existing.agent_entity_id = agent.id
    and lower(existing.role_name) = 'capataz'
    and existing.is_current = true
    and existing.status <> 'archived'
);

update public.step_personnel_periods period
set date_from = null,
    date_from_text = 'Desde 2022; nombramiento anual confirmado para la procesión de 2026',
    year_from = 2022,
    date_to = null,
    date_to_text = null,
    year_to = null,
    is_current = true,
    notes = 'Miguel Ángel Pérez Pascual fue nombrado capataz en 2022 y la Hermandad confirmó su designación para la procesión de 2026.',
    status = 'published',
    updated_at = now()
from crew_call_pastora_triana_20260831 call
join public.entities step
  on step.slug = call.step_slug
 and step.entity_type = 'step'
join public.entities agent
  on agent.slug = call.capataz_slug
 and agent.entity_type = 'agent'
where period.step_entity_id = step.id
  and period.agent_entity_id = agent.id
  and lower(period.role_name) = 'capataz'
  and period.status <> 'archived';

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
from crew_call_pastora_triana_20260831 call
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
  null,
  'Igualá de la cuadrilla de costaleros del paso de la Divina Pastora de Triana, con Miguel Ángel Pérez Pascual como capataz de la procesión 2026.',
  'crew_call',
  brotherhood.entity_id,
  brotherhood.municipality_id,
  call.start_time,
  null,
  call.time_text,
  'announced',
  call.location_text,
  call.requirements,
  null
from crew_call_pastora_triana_20260831 call
join public.entities event_entity
  on event_entity.slug = call.event_slug
 and event_entity.entity_type = 'event'
join public.entities brotherhood_entity
  on brotherhood_entity.slug = call.brotherhood_slug
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
    public_notes = null,
    updated_at = now();

update public.entities event_entity
set status = 'published',
    updated_at = now()
from crew_call_pastora_triana_20260831 call
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
from crew_call_pastora_triana_20260831 call
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
from crew_call_pastora_triana_20260831 call
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
  'Capataz de la procesión 2026, confirmado en una publicación oficial independiente de la convocatoria de la igualá.',
  'published'
from crew_call_pastora_triana_20260831 call
join public.entities event_entity
  on event_entity.slug = call.event_slug
 and event_entity.entity_type = 'event'
join public.entities agent
  on agent.slug = call.capataz_slug
 and agent.entity_type = 'agent'
where not exists (
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
    notes = 'Capataz de la procesión 2026, confirmado en una publicación oficial independiente de la convocatoria de la igualá.',
    status = 'published',
    updated_at = now()
from crew_call_pastora_triana_20260831 call
join public.entities event_entity
  on event_entity.slug = call.event_slug
 and event_entity.entity_type = 'event'
join public.entities agent
  on agent.slug = call.capataz_slug
 and agent.entity_type = 'agent'
where relation.event_entity_id = event_entity.id
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
  source.source_name,
  source.source_url,
  source.source_type,
  source.source_publisher,
  source.source_publication_date,
  date '2026-08-31',
  source.source_notes
from pastora_triana_sources_20260831 source
where exists (select 1 from crew_call_pastora_triana_20260831)
  and not exists (
    select 1
    from public.sources existing
    where existing.url = source.source_url
  );

update public.sources target
set name = source.source_name,
    source_type = source.source_type,
    author_or_publisher = source.source_publisher,
    publication_date = source.source_publication_date,
    accessed_at = date '2026-08-31',
    notes = source.source_notes
from pastora_triana_sources_20260831 source
where exists (select 1 from crew_call_pastora_triana_20260831)
  and target.url = source.source_url;

-- La convocatoria acredita el acontecimiento, el paso y su pertenencia a la
-- Hermandad. No se usa para atribuir una capatacía que el cartel no menciona.
with targets(entity_slug, scope, notes) as (values
  (
    'iguala-divina-pastora-triana-2026',
    'Convocatoria de igualá 2026',
    'Fuente oficial para fecha, hora, lugar, paso y requisito de calzado.'
  ),
  (
    'paso-procesional-divina-pastora-triana',
    'Paso convocado en la igualá',
    'La convocatoria oficial identifica el paso al que se dirige la igualá.'
  )
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
  on source.url = 'https://www.facebook.com/divinapastoradetriana/posts/-noticiaspastore%C3%B1as-igual%C3%A1-de-la-cuadrilla-de-costaleros-para-la-pr%C3%B3xima-procesi/1493386516157074/'
join public.entities entity
  on entity.slug = target.entity_slug
where exists (select 1 from crew_call_pastora_triana_20260831)
  and not exists (
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
  'La convocatoria oficial identifica el paso de la Divina Pastora dentro de la Hermandad de Triana.'
from crew_call_pastora_triana_20260831 call
join public.sources source
  on source.url = 'https://www.facebook.com/divinapastoradetriana/posts/-noticiaspastore%C3%B1as-igual%C3%A1-de-la-cuadrilla-de-costaleros-para-la-pr%C3%B3xima-procesi/1493386516157074/'
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

-- La publicación oficial de 2026 acredita la vigencia actual y se enlaza
-- tanto a la persona como a la convocatoria y al periodo de capatacía.
with targets(entity_slug, scope, notes) as (values
  (
    'miguel-angel-perez-pascual',
    'Capataz de la procesión 2026',
    'La Hermandad confirma oficialmente a Miguel Ángel Pérez Pascual para la salida procesional de 2026.'
  ),
  (
    'iguala-divina-pastora-triana-2026',
    'Capataz asociado a la igualá 2026',
    'Fuente oficial independiente de la convocatoria que confirma al capataz de la procesión 2026.'
  )
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
  on source.url = 'https://www.facebook.com/divinapastoradetriana/posts/-noticiaspastore%C3%B1as-la-junta-de-gobierno-en-cabildo-de-oficiales-celebrado-en-d%C3%AD/1429439689218424/'
join public.entities entity
  on entity.slug = target.entity_slug
where exists (select 1 from crew_call_pastora_triana_20260831)
  and not exists (
    select 1
    from public.source_links existing
    where existing.source_id = source.id
      and existing.entity_id = entity.id
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
  'Vigencia de la capatacía en 2026',
  'La Hermandad confirma oficialmente a Miguel Ángel Pérez Pascual como capataz para la procesión de 2026.'
from crew_call_pastora_triana_20260831 call
join public.sources source
  on source.url = 'https://www.facebook.com/divinapastoradetriana/posts/-noticiaspastore%C3%B1as-la-junta-de-gobierno-en-cabildo-de-oficiales-celebrado-en-d%C3%AD/1429439689218424/'
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
where not exists (
  select 1
  from public.source_links existing
  where existing.source_id = source.id
    and existing.step_personnel_period_id = period.id
);

-- La fuente de 2022 se limita al inicio de la etapa y no se utiliza para
-- acreditar por sí sola la convocatoria ni la vigencia de 2026.
with targets(entity_slug, scope, notes) as (values
  (
    'miguel-angel-perez-pascual',
    'Nombramiento inicial de 2022',
    'Fuente contemporánea que documenta el nombramiento de Miguel Ángel Pérez Pascual en 2022.'
  )
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
  on source.url = 'https://www.gentedepaz.es/la-pastora-de-triana-nombra-nuevo-capataz/'
join public.entities entity
  on entity.slug = target.entity_slug
where exists (select 1 from crew_call_pastora_triana_20260831)
  and not exists (
    select 1
    from public.source_links existing
    where existing.source_id = source.id
      and existing.entity_id = entity.id
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
  'Inicio de la capatacía en 2022',
  'La publicación del 17 de febrero de 2022 documenta el nombramiento inicial de esta etapa.'
from crew_call_pastora_triana_20260831 call
join public.sources source
  on source.url = 'https://www.gentedepaz.es/la-pastora-de-triana-nombra-nuevo-capataz/'
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
where not exists (
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
  agent_id uuid;
begin
  for call in select * from crew_call_pastora_triana_20260831 loop
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

    select id into agent_id
    from public.entities
    where slug = call.capataz_slug
      and entity_type = 'agent'
      and status = 'published';

    if brotherhood_id is null or event_id is null or step_id is null or agent_id is null then
      raise exception '%: faltan la Hermandad, la convocatoria, el paso o el capataz publicado', call.event_slug;
    end if;

    if not exists (
      select 1
      from public.events event
      where event.entity_id = event_id
        and event.event_category = 'crew_call'
        and event.event_type = 'iguala'
        and event.event_date = call.event_date
        and event.start_time = call.start_time
        and event.event_status = 'announced'
        and event.brotherhood_entity_id = brotherhood_id
        and event.place_id is null
        and event.location_text = call.location_text
        and event.requirements = call.requirements
        and event.public_notes is null
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

    if not exists (
      select 1
      from public.crew_event_agents relation
      where relation.event_entity_id = event_id
        and relation.agent_entity_id = agent_id
        and lower(relation.role_name) = 'capataz'
        and relation.is_primary = true
        and relation.status = 'published'
    ) then
      raise exception '%: falta Miguel Ángel Pérez Pascual como capataz', call.event_slug;
    end if;

    if not exists (
      select 1
      from public.step_personnel_periods period
      where period.step_entity_id = step_id
        and period.agent_entity_id = agent_id
        and lower(period.role_name) = 'capataz'
        and period.date_from is null
        and period.date_from_text = 'Desde 2022; nombramiento anual confirmado para la procesión de 2026'
        and period.year_from = 2022
        and period.is_current = true
        and period.status = 'published'
    ) then
      raise exception '%: falta el periodo documentado desde 2022', call.event_slug;
    end if;

    if not exists (
      select 1
      from public.source_links source_link
      join public.sources source on source.id = source_link.source_id
      where source_link.entity_id = event_id
        and source.url = 'https://www.facebook.com/divinapastoradetriana/posts/-noticiaspastore%C3%B1as-igual%C3%A1-de-la-cuadrilla-de-costaleros-para-la-pr%C3%B3xima-procesi/1493386516157074/'
    ) then
      raise exception '%: falta la fuente oficial de la convocatoria', call.event_slug;
    end if;

    if not exists (
      select 1
      from public.source_links source_link
      join public.sources source on source.id = source_link.source_id
      where source_link.entity_id = event_id
        and source.url = 'https://www.facebook.com/divinapastoradetriana/posts/-noticiaspastore%C3%B1as-la-junta-de-gobierno-en-cabildo-de-oficiales-celebrado-en-d%C3%AD/1429439689218424/'
    ) then
      raise exception '%: falta la fuente oficial del capataz para 2026', call.event_slug;
    end if;

    if not exists (
      select 1
      from public.source_links source_link
      join public.sources source on source.id = source_link.source_id
      join public.step_personnel_periods period
        on period.id = source_link.step_personnel_period_id
      where period.step_entity_id = step_id
        and period.agent_entity_id = agent_id
        and source.url = 'https://www.gentedepaz.es/la-pastora-de-triana-nombra-nuevo-capataz/'
    ) then
      raise exception '%: falta la fuente del nombramiento inicial de 2022', call.event_slug;
    end if;
  end loop;
end;
$$;

commit;
