-- Hilo Cofrade · San Esteban · Las Cigarreras desde 2009
--
-- Corrige la lectura del tramo 2022–actualidad: 2022 es la reanudación
-- procesional tras el año 2021 sin salida, no el inicio de la vinculación.
-- La relación histórica oficial de la Hermandad registra Las Cigarreras
-- tras la Virgen en 2009–2020 y de nuevo desde 2022.

begin;

-- -----------------------------------------------------------------------------
-- 1. Precondiciones
-- -----------------------------------------------------------------------------
do $$
begin
  if not exists (
    select 1 from public.entities
    where slug = 'san-esteban' and entity_type = 'brotherhood'
  ) then
    raise exception 'San Esteban/Cigarreras: falta la Hermandad de San Esteban';
  end if;

  if not exists (
    select 1 from public.entities
    where id = 'a23934c9-93e9-4bf1-886e-d98ec170b74f'::uuid
      and entity_type = 'band'
  ) then
    raise exception 'San Esteban/Cigarreras: falta la Banda de Música María Santísima de la Victoria';
  end if;

  if not exists (
    select 1 from public.entities
    where slug = 'paso-palio-madre-desamparados-san-esteban'
      and entity_type = 'step'
  ) then
    raise exception 'San Esteban/Cigarreras: falta el paso de palio de los Desamparados';
  end if;
end
$$;

-- -----------------------------------------------------------------------------
-- 2. Periodización correcta del acompañamiento
-- -----------------------------------------------------------------------------
update public.music_accompaniment_periods map
set
  notes = 'Tramo actual del acompañamiento. La vinculación con la Banda de Música María Santísima de la Victoria de Las Cigarreras comenzó en 2009; la relación histórica oficial registra 2009–2020, 2021 sin salida y reanudación desde 2022.',
  updated_at = now()
where map.brotherhood_entity_id = (
    select id from public.entities
    where slug = 'san-esteban' and entity_type = 'brotherhood'
  )
  and map.band_entity_id = 'a23934c9-93e9-4bf1-886e-d98ec170b74f'::uuid
  and map.step_entity_id = (
    select id from public.entities
    where slug = 'paso-palio-madre-desamparados-san-esteban' and entity_type = 'step'
  )
  and map.year_from = 2022
  and map.is_current = true
  and map.status <> 'archived';

insert into public.music_accompaniment_periods (
  id, brotherhood_entity_id, band_entity_id, step_entity_id, position,
  outing_type, year_from, year_to, is_current, notes, status,
  public_brotherhood_name, public_step_name, public_brotherhood_slug,
  public_municipality_name, public_municipality_slug, public_province
)
select
  gen_random_uuid(), brotherhood.id,
  'a23934c9-93e9-4bf1-886e-d98ec170b74f'::uuid,
  step.id,
  'Tras el paso de la Virgen', 'Estación de Penitencia',
  2009, 2020, false,
  'Primer periodo documentado del acompañamiento de la Banda de Música María Santísima de la Victoria de Las Cigarreras tras María Santísima Madre de los Desamparados. La firma y comienzo de la vinculación se sitúan en 2009.',
  'published',
  'Hermandad de San Esteban', 'María Santísima Madre de los Desamparados',
  'san-esteban', 'Sevilla', 'sevilla', 'Sevilla'
from public.entities brotherhood
join public.entities step
  on step.slug = 'paso-palio-madre-desamparados-san-esteban'
 and step.entity_type = 'step'
where brotherhood.slug = 'san-esteban'
  and brotherhood.entity_type = 'brotherhood'
  and not exists (
    select 1
    from public.music_accompaniment_periods existing
    where existing.brotherhood_entity_id = brotherhood.id
      and existing.band_entity_id = 'a23934c9-93e9-4bf1-886e-d98ec170b74f'::uuid
      and existing.step_entity_id = step.id
      and existing.year_from = 2009
      and existing.year_to = 2020
      and existing.status <> 'archived'
  );

-- -----------------------------------------------------------------------------
-- 3. La firma de 2009 como acontecimiento relacionable
-- -----------------------------------------------------------------------------
insert into public.entities (
  id, entity_type, name, slug, summary, status
)
values (
  gen_random_uuid(),
  'event',
  'Inicio del acompañamiento de Las Cigarreras en San Esteban',
  'inicio-acompanamiento-cigarreras-san-esteban-2009',
  'En 2009 comenzó la vinculación de la Banda de Música María Santísima de la Victoria de Las Cigarreras con María Santísima Madre de los Desamparados de San Esteban.',
  'published'
)
on conflict (slug) do update set
  name = excluded.name,
  summary = excluded.summary,
  status = excluded.status,
  updated_at = now();

insert into public.events (
  entity_id, event_type, event_date, event_date_text, description
)
select
  event.id,
  'Acompañamiento musical',
  null,
  '2009',
  'La Hermandad de San Esteban inició en 2009 su vinculación con la Banda de Música María Santísima de la Victoria de Las Cigarreras para acompañar a María Santísima Madre de los Desamparados. La cronología oficial registra un primer periodo entre 2009 y 2020, 2021 sin salida y un nuevo tramo desde 2022.'
from public.entities event
where event.slug = 'inicio-acompanamiento-cigarreras-san-esteban-2009'
on conflict (entity_id) do update set
  event_type = excluded.event_type,
  event_date = excluded.event_date,
  event_date_text = excluded.event_date_text,
  description = excluded.description;

with targets(target_slug, notes) as (
  values
    ('san-esteban', 'Hermandad que formalizó la vinculación musical en 2009.'),
    ('paso-palio-madre-desamparados-san-esteban', 'Paso al que queda asociado el acompañamiento musical.'),
    ('maria-santisima-madre-desamparados-san-esteban', 'Titular mariana acompañada por Las Cigarreras.')
)
insert into public.entity_relations (
  id, source_entity_id, relation_type, target_entity_id, notes, status
)
select
  gen_random_uuid(), event.id, 'involves', target.id, targets.notes, 'published'
from targets
join public.entities event
  on event.slug = 'inicio-acompanamiento-cigarreras-san-esteban-2009'
join public.entities target
  on target.slug = targets.target_slug
where not exists (
  select 1 from public.entity_relations existing
  where existing.source_entity_id = event.id
    and existing.relation_type = 'involves'
    and existing.target_entity_id = target.id
    and existing.status <> 'archived'
);

insert into public.entity_relations (
  id, source_entity_id, relation_type, target_entity_id, notes, status
)
select
  gen_random_uuid(), event.id, 'involves', band.id,
  'Banda vinculada a San Esteban desde 2009 para el acompañamiento de la Virgen de los Desamparados.',
  'published'
from public.entities event
join public.entities band
  on band.id = 'a23934c9-93e9-4bf1-886e-d98ec170b74f'::uuid
where event.slug = 'inicio-acompanamiento-cigarreras-san-esteban-2009'
  and not exists (
    select 1 from public.entity_relations existing
    where existing.source_entity_id = event.id
      and existing.relation_type = 'involves'
      and existing.target_entity_id = band.id
      and existing.status <> 'archived'
  );

-- -----------------------------------------------------------------------------
-- 4. Fuente oficial
-- -----------------------------------------------------------------------------
insert into public.sources (
  id, name, url, source_type, author_or_publisher, accessed_at, notes
)
select
  gen_random_uuid(),
  'Bandas de Música · Hermandad de San Esteban',
  'https://www.hermandadsanesteban.org/bandas-musica/',
  'web',
  'Hermandad de San Esteban',
  date '2026-08-22',
  'La relación histórica oficial registra Las Cigarreras tras la Virgen en 2009–2020, 2021 sin salida y desde 2022 hasta la actualidad.'
where not exists (
  select 1 from public.sources
  where url = 'https://www.hermandadsanesteban.org/bandas-musica/'
);

insert into public.source_links (
  id, source_id, music_accompaniment_period_id, scope, notes
)
select
  gen_random_uuid(), source.id, period.id,
  'Acompañamiento musical 2009–2020',
  'Fuente oficial para el primer periodo de Las Cigarreras tras la Virgen de los Desamparados.'
from public.sources source
join public.music_accompaniment_periods period
  on period.band_entity_id = 'a23934c9-93e9-4bf1-886e-d98ec170b74f'::uuid
join public.entities brotherhood
  on brotherhood.id = period.brotherhood_entity_id
join public.entities step
  on step.id = period.step_entity_id
where source.url = 'https://www.hermandadsanesteban.org/bandas-musica/'
  and brotherhood.slug = 'san-esteban'
  and step.slug = 'paso-palio-madre-desamparados-san-esteban'
  and period.year_from = 2009
  and period.year_to = 2020
  and not exists (
    select 1 from public.source_links existing
    where existing.source_id = source.id
      and existing.music_accompaniment_period_id = period.id
  );

insert into public.source_links (
  id, source_id, entity_id, scope, notes
)
select
  gen_random_uuid(), source.id, event.id,
  'Inicio de la vinculación musical en 2009',
  'La fuente oficial permite situar el comienzo documentado de Las Cigarreras tras la Virgen en 2009.'
from public.sources source
join public.entities event
  on event.slug = 'inicio-acompanamiento-cigarreras-san-esteban-2009'
where source.url = 'https://www.hermandadsanesteban.org/bandas-musica/'
  and not exists (
    select 1 from public.source_links existing
    where existing.source_id = source.id
      and existing.entity_id = event.id
  );

-- -----------------------------------------------------------------------------
-- 5. Validación
-- -----------------------------------------------------------------------------
do $$
declare
  brotherhood_id uuid;
  step_id uuid;
begin
  select id into brotherhood_id
  from public.entities
  where slug = 'san-esteban' and entity_type = 'brotherhood';

  select id into step_id
  from public.entities
  where slug = 'paso-palio-madre-desamparados-san-esteban' and entity_type = 'step';

  if not exists (
    select 1 from public.music_accompaniment_periods
    where brotherhood_entity_id = brotherhood_id
      and band_entity_id = 'a23934c9-93e9-4bf1-886e-d98ec170b74f'::uuid
      and step_entity_id = step_id
      and year_from = 2009 and year_to = 2020
      and is_current = false and status = 'published'
  ) then
    raise exception 'San Esteban/Cigarreras: no quedó registrado el periodo 2009–2020';
  end if;

  if not exists (
    select 1 from public.music_accompaniment_periods
    where brotherhood_entity_id = brotherhood_id
      and band_entity_id = 'a23934c9-93e9-4bf1-886e-d98ec170b74f'::uuid
      and step_entity_id = step_id
      and year_from = 2022
      and is_current = true and status = 'published'
      and notes ilike '%comenzó en 2009%'
  ) then
    raise exception 'San Esteban/Cigarreras: el tramo actual no conserva el origen de 2009';
  end if;

  if not exists (
    select 1 from public.entities
    where slug = 'inicio-acompanamiento-cigarreras-san-esteban-2009'
      and entity_type = 'event' and status = 'published'
  ) then
    raise exception 'San Esteban/Cigarreras: falta el acontecimiento de 2009';
  end if;
end
$$;

commit;
