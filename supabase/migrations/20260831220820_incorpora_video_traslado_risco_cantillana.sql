-- Hilo Cofrade · Traslado de la Divina Pastora al Risco · Cantillana · 2026
--
-- El vídeo permanece alojado en el canal oficial de YouTube de la Hermandad.
-- La base conserva el enlace canónico, su procedencia y las relaciones
-- documentales; no descarga ni duplica el archivo audiovisual.

begin;

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
  'Traslado de la Divina Pastora al Risco · 2026',
  'traslado-divina-pastora-risco-cantillana-2026',
  'Traslado de la Divina Pastora de las Almas al Risco de Cantillana, celebrado el 31 de agosto de 2026 y retransmitido por el canal oficial de la Hermandad.',
  'published'
where exists (
  select 1
  from public.entities brotherhood
  where brotherhood.slug = 'pastora-de-cantillana'
    and brotherhood.entity_type = 'brotherhood'
    and brotherhood.status = 'published'
)
on conflict (slug) do update
set name = excluded.name,
    summary = excluded.summary,
    status = 'published',
    updated_at = now();

insert into public.events (
  entity_id,
  event_type,
  event_date,
  event_date_text,
  description,
  event_category,
  brotherhood_entity_id,
  municipality_id,
  event_status,
  location_text,
  public_notes
)
select
  event_entity.id,
  'traslado',
  date '2026-08-31',
  '31 de agosto de 2026',
  'Traslado de la Divina Pastora de las Almas al Risco de Cantillana. La Hermandad ofreció la retransmisión a través de su canal oficial de YouTube.',
  'historical',
  brotherhood.id,
  municipality.id,
  'held',
  'Cantillana',
  'La emisión oficial de YouTube comenzó a las 20:44 UTC (22:44, hora peninsular española). Este dato corresponde al inicio de la retransmisión, no necesariamente al comienzo ceremonial del traslado.'
from public.entities event_entity
join public.entities brotherhood
  on brotherhood.slug = 'pastora-de-cantillana'
 and brotherhood.entity_type = 'brotherhood'
left join public.municipalities municipality
  on municipality.slug = 'cantillana'
where event_entity.slug = 'traslado-divina-pastora-risco-cantillana-2026'
  and event_entity.entity_type = 'event'
on conflict (entity_id) do update
set event_type = excluded.event_type,
    event_date = excluded.event_date,
    event_date_text = excluded.event_date_text,
    description = excluded.description,
    event_category = excluded.event_category,
    brotherhood_entity_id = excluded.brotherhood_entity_id,
    municipality_id = excluded.municipality_id,
    event_status = excluded.event_status,
    location_text = excluded.location_text,
    public_notes = excluded.public_notes,
    updated_at = now();

update public.entity_relations relation
set date_from = date '2026-08-31',
    date_from_text = '31 de agosto de 2026',
    notes = case target.slug
      when 'pastora-de-cantillana' then 'Acontecimiento organizado y retransmitido por la Hermandad de la Divina Pastora de Cantillana.'
      when 'divina-pastora-de-las-almas-de-cantillana' then 'La imagen de la Divina Pastora de las Almas es la protagonista del traslado.'
      when 'advocacion-divina-pastora-de-las-almas-cantillana' then 'El traslado se documenta bajo la advocación de la Divina Pastora de las Almas.'
      when 'risco-divina-pastora-cantillana' then 'El Risco constituye el destino y marco devocional del traslado.'
    end,
    status = 'published'
from public.entities event_entity
join public.entities target
  on target.slug in (
    'pastora-de-cantillana',
    'divina-pastora-de-las-almas-de-cantillana',
    'advocacion-divina-pastora-de-las-almas-cantillana',
    'risco-divina-pastora-cantillana'
  )
where event_entity.slug = 'traslado-divina-pastora-risco-cantillana-2026'
  and event_entity.entity_type = 'event'
  and relation.source_entity_id = event_entity.id
  and relation.target_entity_id = target.id
  and relation.relation_type = 'involves';

insert into public.entity_relations (
  id,
  source_entity_id,
  relation_type,
  target_entity_id,
  date_from,
  date_from_text,
  notes,
  status
)
select
  gen_random_uuid(),
  event_entity.id,
  'involves',
  target.id,
  date '2026-08-31',
  '31 de agosto de 2026',
  case target.slug
    when 'pastora-de-cantillana' then 'Acontecimiento organizado y retransmitido por la Hermandad de la Divina Pastora de Cantillana.'
    when 'divina-pastora-de-las-almas-de-cantillana' then 'La imagen de la Divina Pastora de las Almas es la protagonista del traslado.'
    when 'advocacion-divina-pastora-de-las-almas-cantillana' then 'El traslado se documenta bajo la advocación de la Divina Pastora de las Almas.'
    when 'risco-divina-pastora-cantillana' then 'El Risco constituye el destino y marco devocional del traslado.'
  end,
  'published'
from public.entities event_entity
join public.entities target
  on target.slug in (
    'pastora-de-cantillana',
    'divina-pastora-de-las-almas-de-cantillana',
    'advocacion-divina-pastora-de-las-almas-cantillana',
    'risco-divina-pastora-cantillana'
  )
where event_entity.slug = 'traslado-divina-pastora-risco-cantillana-2026'
  and event_entity.entity_type = 'event'
  and not exists (
    select 1
    from public.entity_relations existing
    where existing.source_entity_id = event_entity.id
      and existing.target_entity_id = target.id
      and existing.relation_type = 'involves'
  );

update public.sources
set name = 'Traslado Divina Pastora de Cantillana al Risco 2026',
    source_type = 'Vídeo oficial',
    author_or_publisher = 'Hermandad Divina Pastora de Cantillana',
    publication_date = date '2026-08-31',
    accessed_at = date '2026-08-31',
    notes = 'Retransmisión publicada en el canal oficial de YouTube de la Hermandad.'
where url = 'https://www.youtube.com/watch?v=hzBwRESE9TU';

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
  'Traslado Divina Pastora de Cantillana al Risco 2026',
  'https://www.youtube.com/watch?v=hzBwRESE9TU',
  'Vídeo oficial',
  'Hermandad Divina Pastora de Cantillana',
  date '2026-08-31',
  date '2026-08-31',
  'Retransmisión publicada en el canal oficial de YouTube de la Hermandad.'
where exists (
  select 1
  from public.entities
  where slug = 'traslado-divina-pastora-risco-cantillana-2026'
    and entity_type = 'event'
)
and not exists (
  select 1
  from public.sources
  where url = 'https://www.youtube.com/watch?v=hzBwRESE9TU'
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
  event_entity.id,
  'Fecha, naturaleza del acto, protagonista y autoría audiovisual.',
  'Fuente audiovisual institucional del acontecimiento.'
from public.sources source
join public.entities event_entity
  on event_entity.slug = 'traslado-divina-pastora-risco-cantillana-2026'
 and event_entity.entity_type = 'event'
where source.url = 'https://www.youtube.com/watch?v=hzBwRESE9TU'
  and not exists (
    select 1
    from public.source_links existing
    where existing.source_id = source.id
      and existing.entity_id = event_entity.id
  );

insert into public.media_assets (
  id,
  storage_path,
  media_type,
  title,
  caption,
  alt_text,
  author_name,
  source_name,
  source_url,
  rights_status,
  rights_holder,
  permission_notes,
  taken_or_created_date
)
select
  gen_random_uuid(),
  'https://www.youtube.com/watch?v=hzBwRESE9TU',
  'video',
  'Traslado Divina Pastora de Cantillana al Risco 2026',
  'Retransmisión oficial del traslado de la Divina Pastora de las Almas al Risco de Cantillana.',
  'Vídeo oficial del traslado de la Divina Pastora de las Almas al Risco de Cantillana en 2026.',
  'Hermandad Divina Pastora de Cantillana',
  'Canal oficial de YouTube de la Hermandad Divina Pastora de Cantillana',
  'https://www.youtube.com/watch?v=hzBwRESE9TU',
  'restricted',
  'Hermandad Divina Pastora de Cantillana',
  'Recurso externo enlazado, no descargado ni duplicado. La reproducción y disponibilidad dependen de YouTube y del titular del canal.',
  date '2026-08-31'
where exists (
  select 1
  from public.entities
  where slug = 'traslado-divina-pastora-risco-cantillana-2026'
    and entity_type = 'event'
)
on conflict (storage_path) do update
set media_type = excluded.media_type,
    title = excluded.title,
    caption = excluded.caption,
    alt_text = excluded.alt_text,
    author_name = excluded.author_name,
    source_name = excluded.source_name,
    source_url = excluded.source_url,
    rights_status = excluded.rights_status,
    rights_holder = excluded.rights_holder,
    license = null,
    permission_notes = excluded.permission_notes,
    taken_or_created_date = excluded.taken_or_created_date,
    updated_at = now();

insert into public.entity_media (
  id,
  entity_id,
  media_asset_id,
  relation_type,
  sort_order,
  is_cover,
  notes,
  fit_mode
)
select
  gen_random_uuid(),
  linked_entity.id,
  media.id,
  'official_video',
  0,
  false,
  'Vídeo oficial del traslado al Risco de 2026, alojado en el canal de YouTube de la Hermandad.',
  'contain'
from public.entities linked_entity
join public.media_assets media
  on media.storage_path = 'https://www.youtube.com/watch?v=hzBwRESE9TU'
where linked_entity.slug in (
  'traslado-divina-pastora-risco-cantillana-2026',
  'pastora-de-cantillana',
  'divina-pastora-de-las-almas-de-cantillana',
  'advocacion-divina-pastora-de-las-almas-cantillana',
  'risco-divina-pastora-cantillana'
)
on conflict (entity_id, media_asset_id, relation_type) do update
set sort_order = excluded.sort_order,
    is_cover = excluded.is_cover,
    notes = excluded.notes,
    fit_mode = excluded.fit_mode;

commit;
