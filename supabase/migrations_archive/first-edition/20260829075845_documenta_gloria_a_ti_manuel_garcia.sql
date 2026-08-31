-- Documenta la adaptación para banda de «Gloria a ti» sin ampliar la
-- identidad más allá del nombre expresamente acreditado por las fuentes.

insert into public.sources (
  name, url, source_type, author_or_publisher, accessed_at, notes
)
select
  'Gloria a ti (Arriaga / Manuel García) · YoSoyPastoreñoTV',
  'https://www.youtube.com/watch?v=x-hD1euLK8w',
  'video',
  'YoSoyPastoreñoTV',
  '2026-08-29',
  'La ficha audiovisual acredita a Manuel García como adaptador en 2016 de la copla de J. Arriaga.'
where not exists (
  select 1
  from public.sources existing
  where existing.url = 'https://www.youtube.com/watch?v=x-hD1euLK8w'
);

insert into public.entities (entity_type, name, slug, summary, status)
values (
  'agent',
  'Manuel García',
  'manuel-garcia-adaptador-gloria-a-ti',
  'Músico acreditado como adaptador para banda de la copla Gloria a ti en 2016.',
  'published'
)
on conflict (slug) do update
set name = excluded.name,
    summary = excluded.summary,
    status = excluded.status,
    updated_at = now();

insert into public.agents (entity_id, agent_kind, description, active_notes)
select entity.id, 'person',
  'Acreditado como adaptador musical de Gloria a ti para banda de música.',
  'La fuente consultada acredita el nombre Manuel García, sin segundo apellido ni otros datos biográficos. No unificar con homónimos sin nueva evidencia.'
from public.entities entity
where entity.slug = 'manuel-garcia-adaptador-gloria-a-ti'
  and entity.entity_type = 'agent'
on conflict (entity_id) do update
set agent_kind = excluded.agent_kind,
    description = excluded.description,
    active_notes = excluded.active_notes;

insert into public.agent_names (
  agent_entity_id, name, name_type, is_current, notes
)
select entity.id, 'Manuel García', 'official', true,
  'Forma nominal acreditada por YoSoyPastoreñoTV; identidad más completa pendiente de fuente inequívoca.'
from public.entities entity
where entity.slug = 'manuel-garcia-adaptador-gloria-a-ti'
  and entity.entity_type = 'agent'
  and not exists (
    select 1
    from public.agent_names existing
    where existing.agent_entity_id = entity.id
      and lower(trim(existing.name)) = lower('Manuel García')
  );

insert into public.agent_disciplines (
  agent_entity_id, discipline, is_primary, notes
)
select entity.id, 'Adaptación musical', true,
  'Adaptación para banda de Gloria a ti (2016).'
from public.entities entity
where entity.slug = 'manuel-garcia-adaptador-gloria-a-ti'
  and entity.entity_type = 'agent'
on conflict (agent_entity_id, discipline) do nothing;

insert into public.march_authors (
  march_entity_id, agent_entity_id, author_role, notes, status
)
select march.id, adapter.id, 'adapter',
  'Adaptación para banda acreditada a Manuel García en 2016.',
  'published'
from public.entities march
join public.entities adapter
  on adapter.slug = 'manuel-garcia-adaptador-gloria-a-ti'
 and adapter.entity_type = 'agent'
where march.slug = 'gloria-a-ti-adaptacion-banda'
  and march.entity_type = 'march'
on conflict (march_entity_id, agent_entity_id, author_role) do update
set notes = excluded.notes,
    status = excluded.status;

update public.marches
set composition_year = 2016,
    composition_date_text = '2016',
    notes = 'Adaptación para banda de la copla histórica Gloria a ti, acreditada a Manuel García.'
where entity_id = (
  select id
  from public.entities
  where slug = 'gloria-a-ti-adaptacion-banda'
    and entity_type = 'march'
);

insert into public.source_links (source_id, entity_id, scope, notes)
select source.id, march.id, 'Autoría de adaptación',
  'Manuel García; adaptación para banda fechada en 2016.'
from public.sources source
join public.entities march
  on march.slug = 'gloria-a-ti-adaptacion-banda'
 and march.entity_type = 'march'
where source.url = 'https://www.youtube.com/watch?v=x-hD1euLK8w'
  and not exists (
    select 1
    from public.source_links existing
    where existing.source_id = source.id
      and existing.entity_id = march.id
      and coalesce(existing.scope, '') = 'Autoría de adaptación'
  );

insert into public.source_links (source_id, entity_id, scope, notes)
select source.id, adapter.id, 'Identidad acreditada',
  'La fuente acredita únicamente la forma Manuel García como adaptador.'
from public.sources source
join public.entities adapter
  on adapter.slug = 'manuel-garcia-adaptador-gloria-a-ti'
 and adapter.entity_type = 'agent'
where source.url = 'https://www.youtube.com/watch?v=x-hD1euLK8w'
  and not exists (
    select 1
    from public.source_links existing
    where existing.source_id = source.id
      and existing.entity_id = adapter.id
      and coalesce(existing.scope, '') = 'Identidad acreditada'
  );
