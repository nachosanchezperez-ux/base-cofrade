-- Hilo Cofrade · Igualá de Santa María del Buen Aire · 2026
-- Versión aplicada en Supabase: 20260830090233
--
-- Fuente oficial: Hermandad de Pasión y Muerte.
-- La convocatoria completa el nodo del paso letífico para poder relacionar
-- la igualá con la Hermandad, la imagen titular y su capataz sin duplicarlos.

begin;

-- La primera convocatoria real ejercita las dos tablas de enlace. En un
-- trigger polimórfico, PostgreSQL no permite resolver mediante CASE un campo
-- que no existe en el registro NEW de la otra tabla. La bifurcación explícita
-- mantiene la misma invariante sin acceder al campo ajeno.
create or replace function public.guard_crew_event_link()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  event_type text;
  event_status text;
  event_category text;
  target_type text;
  target_status text;
  target_id uuid;
begin
  select entity.entity_type, entity.status, event.event_category
    into event_type, event_status, event_category
  from public.entities entity
  join public.events event on event.entity_id = entity.id
  where entity.id = new.event_entity_id;

  if event_type is distinct from 'event'
     or event_category is distinct from 'crew_call' then
    raise exception 'crew_event_link_source_invalid';
  end if;

  if tg_table_name = 'crew_event_steps' then
    target_id := new.step_entity_id;
  else
    target_id := new.agent_entity_id;
  end if;

  select entity_type, status
    into target_type, target_status
  from public.entities
  where id = target_id;

  if target_type is distinct from tg_argv[0] then
    raise exception 'crew_event_link_target_invalid';
  end if;

  if new.status = 'published'
     and (event_status is distinct from 'published'
       or target_status is distinct from 'published') then
    raise exception 'crew_event_link_publication_invalid';
  end if;

  return new;
end;
$$;

insert into public.entities (
  id,
  entity_type,
  name,
  slug,
  summary,
  status
)
values (
  gen_random_uuid(),
  'step',
  'Paso procesional de Santa María del Buen Aire',
  'paso-procesional-santa-maria-buen-aire-sevilla',
  'Paso procesional de Santa María del Buen Aire, titular letífica de la Hermandad de Pasión y Muerte.',
  'published'
)
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
  entity.id,
  'Paso procesional de Gloria',
  'Paso que porta a Santa María del Buen Aire en su salida procesional.',
  'Paso procesional actual de la titular letífica.'
from public.entities entity
where entity.slug = 'paso-procesional-santa-maria-buen-aire-sevilla'
  and entity.entity_type = 'step'
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
  'Paso procesional actual de Santa María del Buen Aire.',
  'published'
from public.entities brotherhood
join public.entities step
  on step.slug = 'paso-procesional-santa-maria-buen-aire-sevilla'
 and step.entity_type = 'step'
where brotherhood.slug = 'pasion-y-muerte'
  and brotherhood.entity_type = 'brotherhood'
  and not exists (
    select 1
    from public.brotherhood_steps existing
    where existing.brotherhood_entity_id = brotherhood.id
      and existing.step_entity_id = step.id
      and existing.relation_type = 'processional_step'
      and existing.status <> 'archived'
  );

update public.brotherhood_steps relation
set notes = 'Paso procesional actual de Santa María del Buen Aire.',
    status = 'published'
from public.entities brotherhood,
     public.entities step
where brotherhood.slug = 'pasion-y-muerte'
  and step.slug = 'paso-procesional-santa-maria-buen-aire-sevilla'
  and relation.brotherhood_entity_id = brotherhood.id
  and relation.step_entity_id = step.id
  and relation.relation_type = 'processional_step'
  and relation.status <> 'archived';

insert into public.image_steps (
  id,
  image_entity_id,
  step_entity_id,
  relation_type,
  notes,
  status
)
select
  gen_random_uuid(),
  image.id,
  step.id,
  'processes_on',
  'Santa María del Buen Aire procesiona sobre este paso.',
  'published'
from public.entities image
join public.entities step
  on step.slug = 'paso-procesional-santa-maria-buen-aire-sevilla'
 and step.entity_type = 'step'
where image.slug = 'santa-maria-buen-aire-sevilla'
  and image.entity_type = 'image'
  and not exists (
    select 1
    from public.image_steps existing
    where existing.image_entity_id = image.id
      and existing.step_entity_id = step.id
      and existing.relation_type = 'processes_on'
      and existing.status <> 'archived'
  );

update public.image_steps relation
set notes = 'Santa María del Buen Aire procesiona sobre este paso.',
    status = 'published'
from public.entities image,
     public.entities step
where image.slug = 'santa-maria-buen-aire-sevilla'
  and step.slug = 'paso-procesional-santa-maria-buen-aire-sevilla'
  and relation.image_entity_id = image.id
  and relation.step_entity_id = step.id
  and relation.relation_type = 'processes_on'
  and relation.status <> 'archived';

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
  'Capatacía confirmada por la convocatoria oficial de la igualá del 10 de septiembre de 2026.',
  'published'
from public.entities step
join public.entities agent
  on agent.slug = 'manuel-vizcaya-lopez'
 and agent.entity_type = 'agent'
where step.slug = 'paso-procesional-santa-maria-buen-aire-sevilla'
  and step.entity_type = 'step'
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
values (
  gen_random_uuid(),
  'event',
  'Igualá de Santa María del Buen Aire',
  'iguala-santa-maria-buen-aire-2026',
  'Igualá de costaleros del paso de Santa María del Buen Aire, convocada para el 10 de septiembre de 2026 a las 21:00.',
  'draft'
)
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
  time_text,
  event_status,
  location_text,
  requirements,
  public_notes
)
select
  event_entity.id,
  'iguala',
  date '2026-09-10',
  '10 de septiembre de 2026',
  brotherhood.canonical_see_place_id,
  'Igualá de los costaleros del paso de Santa María del Buen Aire a las órdenes del capataz Manuel Vizcaya López.',
  'crew_call',
  brotherhood.entity_id,
  brotherhood.municipality_id,
  time '21:00',
  '21:00',
  'announced',
  'Parroquia de Nuestra Señora del Buen Aire',
  'Las personas aspirantes deberán ser mayores de 18 años.',
  'Convocatoria preparatoria para la salida procesional de Santa María del Buen Aire del sábado 26 de septiembre de 2026.'
from public.entities event_entity
join public.entities brotherhood_entity
  on brotherhood_entity.slug = 'pasion-y-muerte'
 and brotherhood_entity.entity_type = 'brotherhood'
join public.brotherhoods brotherhood
  on brotherhood.entity_id = brotherhood_entity.id
where event_entity.slug = 'iguala-santa-maria-buen-aire-2026'
  and event_entity.entity_type = 'event'
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

update public.entities
set status = 'published',
    updated_at = now()
where slug = 'iguala-santa-maria-buen-aire-2026'
  and entity_type = 'event';

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
from public.entities event_entity
join public.entities step
  on step.slug = 'paso-procesional-santa-maria-buen-aire-sevilla'
 and step.entity_type = 'step'
where event_entity.slug = 'iguala-santa-maria-buen-aire-2026'
  and event_entity.entity_type = 'event'
  and not exists (
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
    status = 'published'
from public.entities event_entity,
     public.entities step
where event_entity.slug = 'iguala-santa-maria-buen-aire-2026'
  and step.slug = 'paso-procesional-santa-maria-buen-aire-sevilla'
  and relation.event_entity_id = event_entity.id
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
from public.entities event_entity
join public.entities agent
  on agent.slug = 'manuel-vizcaya-lopez'
 and agent.entity_type = 'agent'
where event_entity.slug = 'iguala-santa-maria-buen-aire-2026'
  and event_entity.entity_type = 'event'
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
    status = 'published'
from public.entities event_entity,
     public.entities agent
where event_entity.slug = 'iguala-santa-maria-buen-aire-2026'
  and agent.slug = 'manuel-vizcaya-lopez'
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
  accessed_at,
  notes
)
select
  gen_random_uuid(),
  'Igualá de Santa María del Buen Aire · 10/09/2026',
  'https://hermandadpasionymuerte.es/?p=3840',
  'Fuente oficial',
  'Hermandad de Pasión y Muerte',
  date '2026-08-30',
  'Convocatoria oficial de la igualá de costaleros.'
where not exists (
  select 1
  from public.sources existing
  where existing.url = 'https://hermandadpasionymuerte.es/?p=3840'
);

update public.sources
set name = 'Igualá de Santa María del Buen Aire · 10/09/2026',
    source_type = 'Fuente oficial',
    author_or_publisher = 'Hermandad de Pasión y Muerte',
    accessed_at = date '2026-08-30',
    notes = 'Convocatoria oficial de la igualá de costaleros.'
where url = 'https://hermandadpasionymuerte.es/?p=3840';

with targets(entity_slug, scope, notes) as (values
  (
    'iguala-santa-maria-buen-aire-2026',
    'Convocatoria de igualá 2026',
    'Fuente oficial para fecha, hora, lugar, requisitos, paso y capataz.'
  ),
  (
    'paso-procesional-santa-maria-buen-aire-sevilla',
    'Paso de Santa María del Buen Aire',
    'Fuente oficial que documenta la existencia y denominación del paso.'
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
  targets.scope,
  targets.notes
from targets
join public.sources source
  on source.url = 'https://hermandadpasionymuerte.es/?p=3840'
join public.entities entity
  on entity.slug = targets.entity_slug
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
  'La convocatoria identifica a Santa María del Buen Aire y a su paso dentro de la Hermandad de Pasión y Muerte.'
from public.sources source
join public.entities brotherhood
  on brotherhood.slug = 'pasion-y-muerte'
join public.entities step
  on step.slug = 'paso-procesional-santa-maria-buen-aire-sevilla'
join public.brotherhood_steps relation
  on relation.brotherhood_entity_id = brotherhood.id
 and relation.step_entity_id = step.id
 and relation.relation_type = 'processional_step'
 and relation.status = 'published'
where source.url = 'https://hermandadpasionymuerte.es/?p=3840'
  and not exists (
    select 1
    from public.source_links existing
    where existing.source_id = source.id
      and existing.brotherhood_step_id = relation.id
  );

insert into public.source_links (
  id,
  source_id,
  image_step_id,
  scope,
  notes
)
select
  gen_random_uuid(),
  source.id,
  relation.id,
  'Imagen en el paso',
  'La convocatoria se refiere al paso de Santa María del Buen Aire.'
from public.sources source
join public.entities image
  on image.slug = 'santa-maria-buen-aire-sevilla'
join public.entities step
  on step.slug = 'paso-procesional-santa-maria-buen-aire-sevilla'
join public.image_steps relation
  on relation.image_entity_id = image.id
 and relation.step_entity_id = step.id
 and relation.relation_type = 'processes_on'
 and relation.status = 'published'
where source.url = 'https://hermandadpasionymuerte.es/?p=3840'
  and not exists (
    select 1
    from public.source_links existing
    where existing.source_id = source.id
      and existing.image_step_id = relation.id
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
  'La convocatoria oficial identifica a Manuel Vizcaya López como capataz del paso.'
from public.sources source
join public.entities step
  on step.slug = 'paso-procesional-santa-maria-buen-aire-sevilla'
join public.entities agent
  on agent.slug = 'manuel-vizcaya-lopez'
join public.step_personnel_periods period
  on period.step_entity_id = step.id
 and period.agent_entity_id = agent.id
 and lower(period.role_name) = 'capataz'
 and period.is_current = true
 and period.status = 'published'
where source.url = 'https://hermandadpasionymuerte.es/?p=3840'
  and not exists (
    select 1
    from public.source_links existing
    where existing.source_id = source.id
      and existing.step_personnel_period_id = period.id
  );

do $$
declare
  event_id uuid;
  step_id uuid;
begin
  select id into event_id
  from public.entities
  where slug = 'iguala-santa-maria-buen-aire-2026'
    and entity_type = 'event'
    and status = 'published';

  select id into step_id
  from public.entities
  where slug = 'paso-procesional-santa-maria-buen-aire-sevilla'
    and entity_type = 'step'
    and status = 'published';

  if event_id is null or step_id is null then
    raise exception 'Buen Aire 2026: faltan la convocatoria o el paso publicado';
  end if;

  if not exists (
    select 1
    from public.events event
    where event.entity_id = event_id
      and event.event_category = 'crew_call'
      and event.event_type = 'iguala'
      and event.event_date = date '2026-09-10'
      and event.start_time = time '21:00'
      and event.event_status = 'announced'
  ) then
    raise exception 'Buen Aire 2026: la ficha de la igualá no conserva los datos anunciados';
  end if;

  if not exists (
    select 1
    from public.crew_event_steps relation
    where relation.event_entity_id = event_id
      and relation.step_entity_id = step_id
      and relation.status = 'published'
  ) then
    raise exception 'Buen Aire 2026: falta el paso vinculado a la igualá';
  end if;

  if not exists (
    select 1
    from public.crew_event_agents relation
    join public.entities agent on agent.id = relation.agent_entity_id
    where relation.event_entity_id = event_id
      and agent.slug = 'manuel-vizcaya-lopez'
      and lower(relation.role_name) = 'capataz'
      and relation.status = 'published'
  ) then
    raise exception 'Buen Aire 2026: falta Manuel Vizcaya López como capataz';
  end if;

  if not exists (
    select 1
    from public.source_links source_link
    join public.sources source on source.id = source_link.source_id
    where source_link.entity_id = event_id
      and source.url = 'https://hermandadpasionymuerte.es/?p=3840'
  ) then
    raise exception 'Buen Aire 2026: falta la fuente oficial de la convocatoria';
  end if;
end;
$$;

commit;
