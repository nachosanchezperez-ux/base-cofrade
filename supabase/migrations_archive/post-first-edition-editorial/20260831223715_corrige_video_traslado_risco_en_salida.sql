-- Hilo Cofrade · Vídeo oficial del Ascenso al Risco · ubicación editorial
--
-- Corrige la ubicación inicial del vídeo: deja de ser un acontecimiento de
-- Historia y pasa a la edición concreta de 2026 de la salida anual existente.

begin;

insert into public.outings (
  id,
  brotherhood_entity_id,
  outing_type,
  character,
  title,
  outing_date,
  year,
  departure_time,
  municipality_id,
  origin_place_id,
  destination_place_id,
  reason,
  route_summary,
  description,
  public_notes,
  event_status,
  status,
  outing_series_id,
  slug,
  reference_code
)
select
  gen_random_uuid(),
  series.brotherhood_entity_id,
  series.outing_type,
  'ordinary',
  'Ascenso de la Divina Pastora al Risco 2026',
  date '2026-08-31',
  2026,
  time '23:00',
  series.municipality_id,
  series.origin_place_id,
  series.destination_place_id,
  'Apertura del mes pastoreño',
  series.route_summary,
  'Traslado interior de la Divina Pastora de las Almas desde el camarín hasta el Risco.',
  'La retransmisión oficial comenzó antes del inicio ceremonial del traslado y permanece disponible en el canal de YouTube de la Hermandad.',
  'held',
  'published',
  series.id,
  'ascenso-divina-pastora-risco-cantillana-2026',
  'pastora-cantillana-risco-2026'
from public.outing_series series
join public.entities brotherhood
  on brotherhood.id = series.brotherhood_entity_id
where brotherhood.slug = 'pastora-de-cantillana'
  and brotherhood.entity_type = 'brotherhood'
  and series.title = 'Ascenso de la Divina Pastora al Risco'
  and series.status = 'published'
  and not exists (
    select 1
    from public.outings existing
    where existing.slug = 'ascenso-divina-pastora-risco-cantillana-2026'
       or existing.reference_code = 'pastora-cantillana-risco-2026'
  );

update public.outings outing
set brotherhood_entity_id = series.brotherhood_entity_id,
    outing_type = series.outing_type,
    character = 'ordinary',
    title = 'Ascenso de la Divina Pastora al Risco 2026',
    outing_date = date '2026-08-31',
    year = 2026,
    departure_time = time '23:00',
    municipality_id = series.municipality_id,
    origin_place_id = series.origin_place_id,
    destination_place_id = series.destination_place_id,
    reason = 'Apertura del mes pastoreño',
    route_summary = series.route_summary,
    description = 'Traslado interior de la Divina Pastora de las Almas desde el camarín hasta el Risco.',
    public_notes = 'La retransmisión oficial comenzó antes del inicio ceremonial del traslado y permanece disponible en el canal de YouTube de la Hermandad.',
    event_status = 'held',
    status = 'published',
    outing_series_id = series.id,
    reference_code = 'pastora-cantillana-risco-2026',
    updated_at = now()
from public.outing_series series
join public.entities brotherhood
  on brotherhood.id = series.brotherhood_entity_id
where outing.slug = 'ascenso-divina-pastora-risco-cantillana-2026'
  and brotherhood.slug = 'pastora-de-cantillana'
  and brotherhood.entity_type = 'brotherhood'
  and series.title = 'Ascenso de la Divina Pastora al Risco';

insert into public.outing_entities (
  id,
  outing_id,
  entity_id,
  role,
  notes
)
select
  gen_random_uuid(),
  outing.id,
  image_entity.id,
  'processional_image',
  'Imagen protagonista del Ascenso al Risco de 2026.'
from public.outings outing
join public.entities image_entity
  on image_entity.slug = 'divina-pastora-de-las-almas-de-cantillana'
 and image_entity.entity_type = 'image'
where outing.slug = 'ascenso-divina-pastora-risco-cantillana-2026'
on conflict (outing_id, entity_id, role) do update
set notes = excluded.notes;

insert into public.outing_media (
  id,
  outing_id,
  media_asset_id,
  role,
  sort_order
)
select
  gen_random_uuid(),
  outing.id,
  media.id,
  'gallery',
  0
from public.outings outing
join public.media_assets media
  on media.storage_path = 'https://www.youtube.com/watch?v=hzBwRESE9TU'
where outing.slug = 'ascenso-divina-pastora-risco-cantillana-2026'
on conflict (outing_id, media_asset_id, role) do update
set sort_order = excluded.sort_order,
    updated_at = now();

insert into public.source_links (
  id,
  source_id,
  outing_id,
  scope,
  notes
)
select
  gen_random_uuid(),
  source.id,
  outing.id,
  'Edición de 2026, naturaleza del traslado y registro audiovisual oficial.',
  'Fuente audiovisual contextual de la salida; no es un acontecimiento independiente de la cronología.'
from public.sources source
join public.outings outing
  on outing.slug = 'ascenso-divina-pastora-risco-cantillana-2026'
where source.url = 'https://www.youtube.com/watch?v=hzBwRESE9TU'
  and not exists (
    select 1
    from public.source_links existing
    where existing.source_id = source.id
      and existing.outing_id = outing.id
  );

delete from public.entity_media relation
using public.media_assets media
where relation.media_asset_id = media.id
  and media.storage_path = 'https://www.youtube.com/watch?v=hzBwRESE9TU';

delete from public.entities
where slug = 'traslado-divina-pastora-risco-cantillana-2026'
  and entity_type = 'event';

commit;
