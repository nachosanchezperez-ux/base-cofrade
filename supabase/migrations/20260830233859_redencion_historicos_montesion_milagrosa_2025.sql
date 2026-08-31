with band as (
  select id from public.entities
  where entity_type = 'band'
    and slug = 'agrupacion-musical-nuestro-padre-jesus-redencion-sevilla'
    and status = 'published'
), brotherhood as (
  select id, name, slug from public.entities
  where entity_type = 'brotherhood'
    and slug = 'hermandad-monte-sion-sevilla'
)
insert into public.music_accompaniment_periods (
  brotherhood_entity_id,
  band_entity_id,
  position,
  outing_type,
  date_from_text,
  year_to,
  date_to_text,
  is_current,
  notes,
  status,
  public_brotherhood_name,
  public_brotherhood_slug,
  public_municipality_name,
  public_municipality_slug,
  public_province
)
select
  brotherhood.id,
  band.id,
  'Tras el paso de misterio',
  'Jueves Santo',
  'Inicio por documentar',
  2025,
  'Hasta 2025',
  false,
  'Acompañamiento histórico de La Redención documentado hasta 2025; fecha inicial por documentar.',
  'published',
  brotherhood.name,
  brotherhood.slug,
  'Sevilla',
  'sevilla',
  'Sevilla'
from band, brotherhood
where not exists (
  select 1
  from public.music_accompaniment_periods existing
  where existing.band_entity_id = band.id
    and existing.brotherhood_entity_id = brotherhood.id
    and existing.year_to = 2025
    and existing.is_current = false
);

with band as (
  select id from public.entities
  where entity_type = 'band'
    and slug = 'agrupacion-musical-nuestro-padre-jesus-redencion-sevilla'
    and status = 'published'
), brotherhood as (
  select id, name, slug from public.entities
  where entity_type = 'brotherhood'
    and slug = 'hermandad-milagrosa-sevilla'
)
insert into public.music_accompaniment_periods (
  brotherhood_entity_id,
  band_entity_id,
  position,
  outing_type,
  date_from_text,
  year_to,
  date_to_text,
  is_current,
  notes,
  status,
  public_brotherhood_name,
  public_brotherhood_slug,
  public_municipality_name,
  public_municipality_slug,
  public_province
)
select
  brotherhood.id,
  band.id,
  'Tras el paso de misterio',
  'Sábado de Pasión',
  'Inicio por documentar',
  2025,
  'Hasta 2025',
  false,
  'Acompañamiento histórico de La Redención documentado hasta 2025; fecha inicial por documentar.',
  'published',
  brotherhood.name,
  brotherhood.slug,
  'Sevilla',
  'sevilla',
  'Sevilla'
from band, brotherhood
where not exists (
  select 1
  from public.music_accompaniment_periods existing
  where existing.band_entity_id = band.id
    and existing.brotherhood_entity_id = brotherhood.id
    and existing.year_to = 2025
    and existing.is_current = false
);
