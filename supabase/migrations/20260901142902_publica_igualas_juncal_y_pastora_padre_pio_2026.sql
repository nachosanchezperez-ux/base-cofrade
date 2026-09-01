-- Hilo Cofrade · Igualás mixtas del Juncal y la Pastora de Padre Pío · 2026
-- Versión aplicada en Supabase: 20260901142902
--
-- Una realidad, una entidad: cada anuncio combina dos acciones en una misma
-- cita. El tipo estructurado se conserva como "iguala" y la segunda acción
-- queda expresada en el nombre, la descripción y las notas públicas. No se
-- duplican acontecimientos para representar una única convocatoria.
--
-- El Juncal no ha publicado hora ni lugar. Ambos campos permanecen nulos.

begin;

create temporary table crew_calls_20260901 (
  event_slug text primary key,
  event_name text not null,
  event_summary text not null,
  event_description text not null,
  event_date date not null,
  event_date_text text not null,
  start_time time,
  time_text text,
  brotherhood_slug text not null,
  step_slug text not null,
  step_name text not null,
  step_summary text not null,
  step_description text not null,
  location_text text,
  requirements text,
  public_notes text not null,
  source_key text not null,
  expected_agent_count integer not null
) on commit drop;

insert into crew_calls_20260901 values
(
  'iguala-y-ensayo-nuestra-senora-juncal-2026',
  'Igualá y ensayo de Nuestra Señora del Juncal',
  'Igualá y ensayo de la cuadrilla de costaleros de Nuestra Señora del Juncal, convocados para el 5 de septiembre de 2026.',
  'Igualá y ensayo de la cuadrilla de costaleros del paso de Nuestra Señora del Juncal, bajo la dirección de Luis Miguel Sánchez Fajardo y Jesús Sánchez Fajardo.',
  date '2026-09-05',
  '5 de septiembre de 2026',
  null,
  null,
  'juncal-sevilla',
  'paso-procesional-nuestra-senora-juncal',
  'Paso procesional de Nuestra Señora del Juncal',
  'Paso procesional de Nuestra Señora del Juncal, titular de la Hermandad del Juncal de Sevilla.',
  'Paso que porta a Nuestra Señora del Juncal en su salida procesional anual.',
  null,
  null,
  'La convocatoria reúne en una misma cita la igualá y el ensayo. La hora y el lugar no han sido publicados.',
  'juncal_artesacro_2026',
  2
),
(
  'iguala-y-muda-divina-pastora-padre-pio-2026',
  'Igualá y mudá de la Divina Pastora de Padre Pío',
  'Igualá y mudá de la cuadrilla de costaleros de la Divina Pastora de Padre Pío, convocados para el 5 de septiembre de 2026 a las 22:00.',
  'Igualá y mudá de la cuadrilla de costaleros del paso de la Divina Pastora de Padre Pío, con Ricardo Manuel López Ruiz «Almansa» como capataz.',
  date '2026-09-05',
  '5 de septiembre de 2026',
  time '22:00',
  '22:00',
  'pastora-padre-pio',
  'paso-procesional-divina-pastora-padre-pio',
  'Paso procesional de la Divina Pastora de las Almas',
  'Paso procesional de la Divina Pastora de las Almas de la Hermandad de la Pastora de Padre Pío.',
  'Paso que porta a la Divina Pastora de las Almas en su salida procesional por Padre Pío.',
  'Plazoleta Antonio Ruiz',
  null,
  'La convocatoria reúne en una misma cita la igualá y la mudá.',
  'pastora_padre_pio_oficial_2026',
  1
);

-- Las Preview Branches pueden no contener el universo editorial de producción.
-- En ausencia de la Hermandad canónica, su fila se convierte en un no-op seguro.
delete from crew_calls_20260901 call
where not exists (
  select 1
  from public.entities brotherhood_entity
  join public.brotherhoods brotherhood
    on brotherhood.entity_id = brotherhood_entity.id
  where brotherhood_entity.slug = call.brotherhood_slug
    and brotherhood_entity.entity_type = 'brotherhood'
    and brotherhood_entity.status = 'published'
);

create temporary table crew_call_agents_20260901 (
  event_slug text not null,
  agent_slug text not null,
  agent_name text not null,
  agent_description text not null,
  sort_order integer not null,
  primary key (event_slug, agent_slug)
) on commit drop;

insert into crew_call_agents_20260901 values
(
  'iguala-y-ensayo-nuestra-senora-juncal-2026',
  'luis-miguel-sanchez-fajardo',
  'Luis Miguel Sánchez Fajardo',
  'Capataz del paso de Nuestra Señora del Juncal, confirmado para la salida procesional de 2026.',
  0
),
(
  'iguala-y-ensayo-nuestra-senora-juncal-2026',
  'jesus-sanchez-fajardo',
  'Jesús Sánchez Fajardo',
  'Capataz del paso de Nuestra Señora del Juncal, confirmado para la salida procesional de 2026.',
  1
),
(
  'iguala-y-muda-divina-pastora-padre-pio-2026',
  'ricardo-manuel-lopez-ruiz-almansa',
  'Ricardo Manuel López Ruiz «Almansa»',
  'Capataz del paso de la Divina Pastora de Padre Pío, con vigencia confirmada para la salida procesional de 2026.',
  0
);

delete from crew_call_agents_20260901 agent
where not exists (
  select 1
  from crew_calls_20260901 call
  where call.event_slug = agent.event_slug
);

create temporary table crew_call_sources_20260901 (
  source_key text primary key,
  source_name text not null,
  source_url text not null,
  source_type text not null,
  source_publisher text not null,
  source_publication_date date,
  source_notes text not null
) on commit drop;

insert into crew_call_sources_20260901 values
(
  'juncal_artesacro_2026',
  'Programa de cultos y actos de Nuestra Señora del Juncal · 2026',
  'https://www.artesacro.org/Noticia/Ver/168780/hermandad-juncal-presenta-programa-cultos-y-actos-honor-ntra-sra-juncal',
  'Medio especializado',
  'Arte Sacro',
  date '2026-09-01',
  'Fuente contemporánea para la fecha, el carácter combinado de igualá y ensayo, el paso y los dos capataces. No publica hora ni lugar.'
),
(
  'pastora_padre_pio_oficial_2026',
  'Igualá y mudá de la Divina Pastora de Padre Pío · 2026',
  'https://www.instagram.com/p/DcodEr7KR13/',
  'Red social oficial',
  'Hermandad de la Divina Pastora de Padre Pío',
  date '2026-08-29',
  'Convocatoria oficial para fecha, hora, lugar, paso y carácter combinado de igualá y mudá.'
),
(
  'agenda_cofrade_septiembre_2026',
  'Agenda Cofrade · septiembre de 2026',
  'https://infocofrade.com/agenda/',
  'Medio especializado',
  'Info Cofrade',
  null,
  'Contraste contemporáneo para la igualá y mudá, la hora, el lugar y Ricardo Almansa como capataz.'
),
(
  'pastora_padre_pio_capataz_2025',
  'Salida procesional de la Divina Pastora de Padre Pío · 2025',
  'https://www.artesacro.org/Noticia/Ver/163173/pastora-padre-pio-procesiono-su-barrio-lema-pastora-vida-apoyo-donacion',
  'Medio especializado',
  'Arte Sacro',
  null,
  'Fuente de apoyo para el nombre completo de Ricardo Manuel López Ruiz «Almansa» y su vinculación con el paso.'
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
from crew_calls_20260901 call
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
  call.step_description
from crew_calls_20260901 call
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
  call.step_description,
  'published'
from crew_calls_20260901 call
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
set notes = call.step_description,
    status = 'published'
from crew_calls_20260901 call
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
  agent.agent_name,
  agent.agent_slug,
  agent.agent_description,
  'published'
from crew_call_agents_20260901 agent
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
  entity.id,
  'person',
  agent.agent_description
from crew_call_agents_20260901 agent
join public.entities entity
  on entity.slug = agent.agent_slug
 and entity.entity_type = 'agent'
on conflict (entity_id) do update
set agent_kind = excluded.agent_kind,
    description = excluded.description;

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
from crew_calls_20260901 call
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
from crew_calls_20260901 call
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
    public_notes = excluded.public_notes,
    updated_at = now();

update public.entities event_entity
set status = 'published',
    updated_at = now()
from crew_calls_20260901 call
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
  'Paso convocado en la cita mixta.',
  'published'
from crew_calls_20260901 call
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
    notes = 'Paso convocado en la cita mixta.',
    status = 'published',
    updated_at = now()
from crew_calls_20260901 call
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
  agent_entity.id,
  'Capataz',
  true,
  agent.sort_order,
  'Capataz confirmado para la convocatoria de 2026.',
  'published'
from crew_call_agents_20260901 agent
join public.entities event_entity
  on event_entity.slug = agent.event_slug
 and event_entity.entity_type = 'event'
join public.entities agent_entity
  on agent_entity.slug = agent.agent_slug
 and agent_entity.entity_type = 'agent'
where not exists (
  select 1
  from public.crew_event_agents existing
  where existing.event_entity_id = event_entity.id
    and existing.agent_entity_id = agent_entity.id
    and lower(existing.role_name) = 'capataz'
    and existing.status <> 'archived'
);

update public.crew_event_agents relation
set is_primary = true,
    sort_order = agent.sort_order,
    notes = 'Capataz confirmado para la convocatoria de 2026.',
    status = 'published',
    updated_at = now()
from crew_call_agents_20260901 agent
join public.entities event_entity
  on event_entity.slug = agent.event_slug
 and event_entity.entity_type = 'event'
join public.entities agent_entity
  on agent_entity.slug = agent.agent_slug
 and agent_entity.entity_type = 'agent'
where relation.event_entity_id = event_entity.id
  and relation.agent_entity_id = agent_entity.id
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
  date '2026-09-01',
  source.source_notes
from crew_call_sources_20260901 source
where exists (
  select 1
  from crew_calls_20260901
)
and not exists (
  select 1
  from public.sources existing
  where existing.url = source.source_url
);

-- Fuente principal de cada convocatoria: acontecimiento, paso y relación con
-- la Hermandad. La cita de Padre Pío utiliza aquí su canal oficial.
with targets as (
  select call.source_key, call.event_slug as entity_slug,
         'Convocatoria costalera de 2026'::text as scope,
         'Fuente principal para los datos públicos de la convocatoria.'::text as notes
  from crew_calls_20260901 call
  union all
  select call.source_key, call.step_slug,
         'Paso convocado en 2026',
         'La convocatoria identifica el paso al que se dirige la cita.'
  from crew_calls_20260901 call
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
join crew_call_sources_20260901 source_data
  on source_data.source_key = target.source_key
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
  'La convocatoria identifica el paso dentro de la Hermandad.'
from crew_calls_20260901 call
join crew_call_sources_20260901 source_data
  on source_data.source_key = call.source_key
join public.sources source
  on source.url = source_data.source_url
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

-- El programa del Juncal acredita también a los dos capataces.
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
  agent_entity.id,
  'Capataces de la convocatoria de 2026',
  'La fuente contemporánea identifica a los responsables del martillo.'
from crew_call_agents_20260901 agent
join public.entities agent_entity
  on agent_entity.slug = agent.agent_slug
 and agent_entity.entity_type = 'agent'
join public.sources source
  on source.url = 'https://www.artesacro.org/Noticia/Ver/168780/hermandad-juncal-presenta-programa-cultos-y-actos-honor-ntra-sra-juncal'
where agent.event_slug = 'iguala-y-ensayo-nuestra-senora-juncal-2026'
  and not exists (
    select 1
    from public.source_links existing
    where existing.source_id = source.id
      and existing.entity_id = agent_entity.id
  );

-- Info Cofrade contrasta la cita de Padre Pío y confirma a Ricardo Almansa.
with targets(entity_slug, scope, notes) as (values
  (
    'iguala-y-muda-divina-pastora-padre-pio-2026',
    'Contraste de la convocatoria de 2026',
    'Agenda contemporánea para fecha, hora, lugar, carácter mixto y capataz.'
  ),
  (
    'ricardo-manuel-lopez-ruiz-almansa',
    'Capataz de la convocatoria de 2026',
    'La agenda contemporánea confirma a Ricardo Almansa como capataz.'
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
  on source.url = 'https://infocofrade.com/agenda/'
join public.entities entity
  on entity.slug = target.entity_slug
where exists (
  select 1
  from crew_calls_20260901 call
  where call.event_slug = 'iguala-y-muda-divina-pastora-padre-pio-2026'
)
and not exists (
  select 1
  from public.source_links existing
  where existing.source_id = source.id
    and existing.entity_id = entity.id
);

-- Arte Sacro 2025 se limita a documentar el nombre completo del capataz.
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
  agent.id,
  'Nombre completo del capataz',
  'Fuente de apoyo para el nombre completo y su vinculación con el paso en 2025.'
from public.sources source
join public.entities agent
  on agent.slug = 'ricardo-manuel-lopez-ruiz-almansa'
 and agent.entity_type = 'agent'
where source.url = 'https://www.artesacro.org/Noticia/Ver/163173/pastora-padre-pio-procesiono-su-barrio-lema-pastora-vida-apoyo-donacion'
  and exists (
    select 1
    from crew_calls_20260901 call
    where call.event_slug = 'iguala-y-muda-divina-pastora-padre-pio-2026'
  )
  and not exists (
    select 1
    from public.source_links existing
    where existing.source_id = source.id
      and existing.entity_id = agent.id
  );

do $$
declare
  call record;
  brotherhood_id uuid;
  event_id uuid;
  step_id uuid;
  linked_agents integer;
begin
  for call in select * from crew_calls_20260901 loop
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
      where event.entity_id = event_id
        and event.event_category = 'crew_call'
        and event.event_type = 'iguala'
        and event.event_date = call.event_date
        and event.start_time is not distinct from call.start_time
        and event.time_text is not distinct from call.time_text
        and event.event_status = 'announced'
        and event.brotherhood_entity_id = brotherhood_id
        and event.place_id is null
        and event.location_text is not distinct from call.location_text
        and event.requirements is not distinct from call.requirements
        and event.public_notes = call.public_notes
    ) then
      raise exception '%: la convocatoria no conserva exactamente los datos publicados', call.event_slug;
    end if;

    if not exists (
      select 1
      from public.brotherhood_steps relation
      where relation.brotherhood_entity_id = brotherhood_id
        and relation.step_entity_id = step_id
        and relation.relation_type = 'processional_step'
        and relation.status = 'published'
    ) then
      raise exception '%: falta la relación entre Hermandad y paso', call.event_slug;
    end if;

    if not exists (
      select 1
      from public.crew_event_steps relation
      where relation.event_entity_id = event_id
        and relation.step_entity_id = step_id
        and relation.is_primary = true
        and relation.status = 'published'
    ) then
      raise exception '%: falta el paso vinculado a la convocatoria', call.event_slug;
    end if;

    select count(*) into linked_agents
    from public.crew_event_agents relation
    join public.entities agent
      on agent.id = relation.agent_entity_id
     and agent.entity_type = 'agent'
     and agent.status = 'published'
    where relation.event_entity_id = event_id
      and lower(relation.role_name) = 'capataz'
      and relation.status = 'published';

    if linked_agents <> call.expected_agent_count then
      raise exception '%: número de capataces distinto del documentado', call.event_slug;
    end if;

    if not exists (
      select 1
      from public.source_links source_link
      join public.sources source
        on source.id = source_link.source_id
      join crew_call_sources_20260901 source_data
        on source_data.source_url = source.url
       and source_data.source_key = call.source_key
      where source_link.entity_id = event_id
    ) then
      raise exception '%: falta la fuente principal de la convocatoria', call.event_slug;
    end if;
  end loop;

  if exists (
    select 1
    from public.events event
    join public.entities entity on entity.id = event.entity_id
    where entity.slug = 'iguala-y-ensayo-nuestra-senora-juncal-2026'
      and (event.start_time is not null or event.time_text is not null or event.location_text is not null)
  ) then
    raise exception 'La convocatoria del Juncal no debe inventar hora ni lugar';
  end if;

  if not exists (
    select 1
    from public.source_links source_link
    join public.sources source on source.id = source_link.source_id
    join public.entities event on event.id = source_link.entity_id
    where event.slug = 'iguala-y-muda-divina-pastora-padre-pio-2026'
      and source.url = 'https://infocofrade.com/agenda/'
  ) then
    raise exception 'Falta el contraste contemporáneo de la convocatoria de Padre Pío';
  end if;
end
$$;

commit;
