-- Cierra la única marcha publicada sin autoría estructurada.
-- La ficha especializada de Patrimonio Musical identifica la obra, el autor,
-- el año de composición y la dedicatoria; este corte solo incorpora autoría
-- y cronología, sin inferir relaciones adicionales.

insert into public.sources (
  name, url, source_type, author_or_publisher, accessed_at, notes
)
select
  'El Descendimiento · Patrimonio Musical',
  'https://www.patrimoniomusical.com/bd-marcha-1324',
  'database',
  'Patrimonio Musical',
  '2026-08-28',
  'Ficha especializada de la marcha: autor, año de composición y dedicatoria.'
where not exists (
  select 1 from public.sources existing
  where existing.url = 'https://www.patrimoniomusical.com/bd-marcha-1324'
);

insert into public.entities (entity_type, name, slug, summary, status)
values (
  'agent',
  'José Sapena Matarredona',
  'jose-sapena-matarredona',
  'Compositor y director de banda (1908–1987), autor de la marcha procesional El Descendimiento, compuesta en 1961.',
  'published'
)
on conflict (slug) do update
set name = excluded.name,
    summary = excluded.summary,
    status = excluded.status,
    updated_at = now();

insert into public.agents (entity_id, agent_kind, description)
select entity.id, 'person',
  'Compositor y director de banda, vinculado especialmente a la vida musical de Jaén.'
from public.entities entity
where entity.slug = 'jose-sapena-matarredona' and entity.entity_type = 'agent'
on conflict (entity_id) do update
set agent_kind = excluded.agent_kind, description = excluded.description;

insert into public.agent_names (agent_entity_id, name, name_type, is_current, notes)
select entity.id, 'José Sapena Matarredona', 'official', true,
  'Nombre acreditado en la ficha especializada de El Descendimiento.'
from public.entities entity
where entity.slug = 'jose-sapena-matarredona' and entity.entity_type = 'agent'
  and not exists (
    select 1 from public.agent_names existing
    where existing.agent_entity_id = entity.id
      and lower(trim(existing.name)) = lower('José Sapena Matarredona')
  );

insert into public.agent_disciplines (agent_entity_id, discipline, is_primary, notes)
select entity.id, 'Composición musical', true, 'Autor de El Descendimiento (1961).'
from public.entities entity
where entity.slug = 'jose-sapena-matarredona' and entity.entity_type = 'agent'
on conflict (agent_entity_id, discipline) do nothing;

insert into public.march_authors (march_entity_id, agent_entity_id, author_role, notes, status)
select march.id, author.id, 'composer',
  'Autoría documentada por Patrimonio Musical.', 'published'
from public.entities march
join public.entities author
  on author.slug = 'jose-sapena-matarredona' and author.entity_type = 'agent'
where march.slug = 'marcha-el-descendimiento-misericordia'
  and march.entity_type = 'march'
on conflict (march_entity_id, agent_entity_id, author_role) do update
set notes = excluded.notes, status = excluded.status;

update public.marches
set composition_year = 1961,
    composition_date_text = '1961',
    notes = 'Autoría y año de composición documentados por Patrimonio Musical.'
where entity_id = (
  select id from public.entities
  where slug = 'marcha-el-descendimiento-misericordia' and entity_type = 'march'
);

insert into public.source_links (source_id, entity_id, scope, notes)
select source.id, march.id, 'Autoría y cronología',
  'José Sapena Matarredona; composición fechada en 1961.'
from public.sources source
join public.entities march
  on march.slug = 'marcha-el-descendimiento-misericordia'
 and march.entity_type = 'march'
where source.url = 'https://www.patrimoniomusical.com/bd-marcha-1324'
  and not exists (
    select 1 from public.source_links existing
    where existing.source_id = source.id
      and existing.entity_id = march.id
      and coalesce(existing.scope, '') = 'Autoría y cronología'
  );
