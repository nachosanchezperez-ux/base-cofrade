-- Hilo Cofrade · Igualá de Nuestra Señora del Rosario de Santiago · 2026
-- Versión aplicada en Supabase: 20260831061147
--
-- La convocatoria oficial solo publica fecha y hora. El lugar, la capatacía
-- y los requisitos de calzado permanecen sin documentar y no se infieren de
-- la sede canónica ni de convocatorias de años anteriores.

begin;

insert into public.municipalities (
  id,
  name,
  slug,
  province,
  autonomous_community,
  country
)
values (
  gen_random_uuid(),
  'Alcalá de Guadaíra',
  'alcala-de-guadaira',
  'Sevilla',
  'Andalucía',
  'España'
)
on conflict (slug) do update
set name = excluded.name,
    province = excluded.province,
    autonomous_community = excluded.autonomous_community,
    country = excluded.country;

insert into public.places (
  id,
  municipality_id,
  name,
  slug,
  place_type,
  notes
)
select
  gen_random_uuid(),
  municipality.id,
  'Parroquia de Santiago el Mayor',
  'parroquia-santiago-mayor-alcala-guadaira',
  'Parroquia',
  'Sede canónica de la Hermandad de la Divina Misericordia y Rosario de Santiago.'
from public.municipalities municipality
where municipality.slug = 'alcala-de-guadaira'
on conflict (slug) do update
set municipality_id = excluded.municipality_id,
    name = excluded.name,
    place_type = excluded.place_type,
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
values (
  gen_random_uuid(),
  'brotherhood',
  'Hermandad de la Divina Misericordia · Rosario de Santiago',
  'divina-misericordia-rosario-santiago-alcala',
  'Hermandad de Penitencia y Gloria con sede canónica en la Parroquia de Santiago el Mayor de Alcalá de Guadaíra.',
  'published'
)
on conflict (slug) do update
set name = excluded.name,
    summary = excluded.summary,
    status = 'published',
    updated_at = now();

insert into public.brotherhoods (
  entity_id,
  official_name,
  popular_name,
  foundation_text,
  municipality_id,
  canonical_see_place_id,
  website_url,
  instagram_url,
  brotherhood_types,
  history_text
)
select
  brotherhood.id,
  'Dominica Hermandad de Nuestra Señora la Virgen del Rosario y Patriarca Bendito Señor San José y Cofradía de Penitencia de la Divina Misericordia y María Santísima de la Trinidad',
  'Divina Misericordia · Rosario de Santiago',
  'Antecedentes documentados desde 1579; actual etapa desde 2004; erigida como Hermandad en 2016',
  municipality.id,
  canonical_see.id,
  'https://rosariodesantiago.blogspot.com/',
  'https://www.instagram.com/rosariostgoalcala/',
  array['Penitencia', 'Gloria']::text[],
  'La actual corporación retomó su actividad en 2004, fue erigida como Agrupación Parroquial en 2011 y como Hermandad de Penitencia y de Gloria en 2016. La devoción del Rosario en la parroquia cuenta con antecedentes documentados desde 1579.'
from public.entities brotherhood
join public.municipalities municipality
  on municipality.slug = 'alcala-de-guadaira'
join public.places canonical_see
  on canonical_see.slug = 'parroquia-santiago-mayor-alcala-guadaira'
where brotherhood.slug = 'divina-misericordia-rosario-santiago-alcala'
  and brotherhood.entity_type = 'brotherhood'
on conflict (entity_id) do update
set official_name = excluded.official_name,
    popular_name = excluded.popular_name,
    foundation_text = excluded.foundation_text,
    municipality_id = excluded.municipality_id,
    canonical_see_place_id = excluded.canonical_see_place_id,
    website_url = excluded.website_url,
    instagram_url = excluded.instagram_url,
    brotherhood_types = excluded.brotherhood_types,
    history_text = excluded.history_text;

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
  'Paso procesional de Nuestra Señora del Rosario de Santiago',
  'paso-procesional-nuestra-senora-rosario-santiago-alcala',
  'Paso procesional de Nuestra Señora del Rosario de Santiago, titular letífica de la Hermandad de la Divina Misericordia.',
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
  description
)
select
  step.id,
  'Paso procesional de Gloria',
  'Paso que porta a Nuestra Señora la Virgen del Rosario de Santiago en su salida procesional.'
from public.entities step
where step.slug = 'paso-procesional-nuestra-senora-rosario-santiago-alcala'
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
  'Paso procesional de Nuestra Señora del Rosario de Santiago.',
  'published'
from public.entities brotherhood
join public.entities step
  on step.slug = 'paso-procesional-nuestra-senora-rosario-santiago-alcala'
 and step.entity_type = 'step'
where brotherhood.slug = 'divina-misericordia-rosario-santiago-alcala'
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
set notes = 'Paso procesional de Nuestra Señora del Rosario de Santiago.',
    status = 'published'
from public.entities brotherhood,
     public.entities step
where brotherhood.slug = 'divina-misericordia-rosario-santiago-alcala'
  and step.slug = 'paso-procesional-nuestra-senora-rosario-santiago-alcala'
  and relation.brotherhood_entity_id = brotherhood.id
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
values (
  gen_random_uuid(),
  'event',
  'Igualá de Nuestra Señora del Rosario de Santiago',
  'iguala-rosario-santiago-alcala-2026',
  'Igualá de costaleros del paso de Nuestra Señora del Rosario de Santiago, convocada para el 19 de septiembre de 2026 a las 18:30.',
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
  date '2026-09-19',
  '19 de septiembre de 2026',
  null,
  'Igualá de los costaleros del paso de Nuestra Señora del Rosario de Santiago.',
  'crew_call',
  brotherhood.entity_id,
  brotherhood.municipality_id,
  time '18:30',
  null,
  '18:30',
  'announced',
  null,
  null,
  null
from public.entities event_entity
join public.entities brotherhood_entity
  on brotherhood_entity.slug = 'divina-misericordia-rosario-santiago-alcala'
 and brotherhood_entity.entity_type = 'brotherhood'
join public.brotherhoods brotherhood
  on brotherhood.entity_id = brotherhood_entity.id
where event_entity.slug = 'iguala-rosario-santiago-alcala-2026'
  and event_entity.entity_type = 'event'
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
    location_text = null,
    requirements = null,
    public_notes = null,
    updated_at = now();

update public.entities
set status = 'published',
    updated_at = now()
where slug = 'iguala-rosario-santiago-alcala-2026'
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
  on step.slug = 'paso-procesional-nuestra-senora-rosario-santiago-alcala'
 and step.entity_type = 'step'
where event_entity.slug = 'iguala-rosario-santiago-alcala-2026'
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
    status = 'published',
    updated_at = now()
from public.entities event_entity,
     public.entities step
where event_entity.slug = 'iguala-rosario-santiago-alcala-2026'
  and step.slug = 'paso-procesional-nuestra-senora-rosario-santiago-alcala'
  and relation.event_entity_id = event_entity.id
  and relation.step_entity_id = step.id
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
  'Rosario 2026 · Igualá de costaleros',
  'https://www.facebook.com/100069128529775/posts/1114255717555369/',
  'Red social oficial',
  'Hermandad de la Divina Misericordia · Rosario de Santiago',
  date '2026-08-31',
  'Convocatoria oficial que publica la fecha y la hora de la igualá.'
where not exists (
  select 1
  from public.sources existing
  where existing.url = 'https://www.facebook.com/100069128529775/posts/1114255717555369/'
);

update public.sources
set name = 'Rosario 2026 · Igualá de costaleros',
    source_type = 'Red social oficial',
    author_or_publisher = 'Hermandad de la Divina Misericordia · Rosario de Santiago',
    accessed_at = date '2026-08-31',
    notes = 'Convocatoria oficial que publica la fecha y la hora de la igualá.'
where url = 'https://www.facebook.com/100069128529775/posts/1114255717555369/';

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
  'Hermandad de la Divina Misericordia',
  'https://parroquiasantiagoalcala.es/rosario-de-santiago/',
  'Fuente institucional',
  'Parroquia de Santiago el Mayor de Alcalá de Guadaíra',
  date '2026-08-31',
  'Fuente parroquial para la denominación, sede canónica, historia y erección como Hermandad de Penitencia y de Gloria en 2016.'
where not exists (
  select 1
  from public.sources existing
  where existing.url = 'https://parroquiasantiagoalcala.es/rosario-de-santiago/'
);

update public.sources
set name = 'Hermandad de la Divina Misericordia',
    source_type = 'Fuente institucional',
    author_or_publisher = 'Parroquia de Santiago el Mayor de Alcalá de Guadaíra',
    accessed_at = date '2026-08-31',
    notes = 'Fuente parroquial para la denominación, sede canónica, historia y erección como Hermandad de Penitencia y de Gloria en 2016.'
where url = 'https://parroquiasantiagoalcala.es/rosario-de-santiago/';

with targets(entity_slug, scope, notes) as (values
  (
    'iguala-rosario-santiago-alcala-2026',
    'Convocatoria de igualá 2026',
    'Fuente oficial para la fecha y la hora; no publica lugar, capataz ni requisitos de calzado.'
  ),
  (
    'paso-procesional-nuestra-senora-rosario-santiago-alcala',
    'Paso de Nuestra Señora del Rosario de Santiago',
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
  targets.scope,
  targets.notes
from targets
join public.sources source
  on source.url = 'https://www.facebook.com/100069128529775/posts/1114255717555369/'
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
  entity_id,
  scope,
  notes
)
select
  gen_random_uuid(),
  source.id,
  brotherhood.id,
  'Identidad e historia de la Hermandad',
  'La parroquia documenta la denominación, la sede canónica y la erección como Hermandad en 2016.'
from public.sources source
join public.entities brotherhood
  on brotherhood.slug = 'divina-misericordia-rosario-santiago-alcala'
 and brotherhood.entity_type = 'brotherhood'
where source.url = 'https://parroquiasantiagoalcala.es/rosario-de-santiago/'
  and not exists (
    select 1
    from public.source_links existing
    where existing.source_id = source.id
      and existing.entity_id = brotherhood.id
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
  'La convocatoria oficial identifica el paso de Nuestra Señora del Rosario de Santiago.'
from public.sources source
join public.entities brotherhood
  on brotherhood.slug = 'divina-misericordia-rosario-santiago-alcala'
join public.entities step
  on step.slug = 'paso-procesional-nuestra-senora-rosario-santiago-alcala'
join public.brotherhood_steps relation
  on relation.brotherhood_entity_id = brotherhood.id
 and relation.step_entity_id = step.id
 and relation.relation_type = 'processional_step'
 and relation.status = 'published'
where source.url = 'https://www.facebook.com/100069128529775/posts/1114255717555369/'
  and not exists (
    select 1
    from public.source_links existing
    where existing.source_id = source.id
      and existing.brotherhood_step_id = relation.id
  );

do $$
declare
  brotherhood_id uuid;
  event_id uuid;
  step_id uuid;
begin
  select id into brotherhood_id
  from public.entities
  where slug = 'divina-misericordia-rosario-santiago-alcala'
    and entity_type = 'brotherhood'
    and status = 'published';

  select id into event_id
  from public.entities
  where slug = 'iguala-rosario-santiago-alcala-2026'
    and entity_type = 'event'
    and status = 'published';

  select id into step_id
  from public.entities
  where slug = 'paso-procesional-nuestra-senora-rosario-santiago-alcala'
    and entity_type = 'step'
    and status = 'published';

  if brotherhood_id is null or event_id is null or step_id is null then
    raise exception 'Rosario de Santiago 2026: faltan la Hermandad, la convocatoria o el paso publicado';
  end if;

  if not exists (
    select 1
    from public.brotherhoods brotherhood
    join public.municipalities municipality
      on municipality.id = brotherhood.municipality_id
    join public.places canonical_see
      on canonical_see.id = brotherhood.canonical_see_place_id
    where brotherhood.entity_id = brotherhood_id
      and municipality.slug = 'alcala-de-guadaira'
      and canonical_see.slug = 'parroquia-santiago-mayor-alcala-guadaira'
      and brotherhood.brotherhood_types @> array['Penitencia', 'Gloria']::text[]
  ) then
    raise exception 'Rosario de Santiago 2026: la ficha de la Hermandad no conserva su identidad institucional';
  end if;

  if not exists (
    select 1
    from public.events event
    where event.entity_id = event_id
      and event.event_category = 'crew_call'
      and event.event_type = 'iguala'
      and event.event_date = date '2026-09-19'
      and event.start_time = time '18:30'
      and event.event_status = 'announced'
      and event.place_id is null
      and event.location_text is null
      and event.requirements is null
  ) then
    raise exception 'Rosario de Santiago 2026: la igualá no conserva los datos anunciados o infiere datos no publicados';
  end if;

  if not exists (
    select 1
    from public.crew_event_steps relation
    where relation.event_entity_id = event_id
      and relation.step_entity_id = step_id
      and relation.is_primary = true
      and relation.status = 'published'
  ) then
    raise exception 'Rosario de Santiago 2026: falta el paso vinculado a la igualá';
  end if;

  if exists (
    select 1
    from public.crew_event_agents relation
    where relation.event_entity_id = event_id
      and relation.status <> 'archived'
  ) then
    raise exception 'Rosario de Santiago 2026: no debe publicarse una capatacía no anunciada';
  end if;

  if not exists (
    select 1
    from public.source_links source_link
    join public.sources source
      on source.id = source_link.source_id
    where source_link.entity_id = event_id
      and source.url = 'https://www.facebook.com/100069128529775/posts/1114255717555369/'
  ) then
    raise exception 'Rosario de Santiago 2026: falta la fuente oficial de la convocatoria';
  end if;

  if not exists (
    select 1
    from public.source_links source_link
    join public.sources source
      on source.id = source_link.source_id
    where source_link.entity_id = brotherhood_id
      and source.url = 'https://parroquiasantiagoalcala.es/rosario-de-santiago/'
  ) then
    raise exception 'Rosario de Santiago 2026: falta la fuente institucional de la Hermandad';
  end if;
end;
$$;

commit;
