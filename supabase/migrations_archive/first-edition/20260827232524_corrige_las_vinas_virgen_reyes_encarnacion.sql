-- Hermandad de las Viñas · Jerez de la Frontera
-- Cierra la etapa de la A.M. Virgen de los Reyes tras la Semana Santa de 2026
-- y registra la nueva vinculación de la A.M. Ntra. Sra. de la Encarnación desde 2027.

update public.music_accompaniment_periods as period
set year_to = 2026,
    date_to_text = 'Semana Santa de 2026',
    is_current = false,
    notes = 'Fuente oficial de la banda: Nuestra Semana Santa. La vinculación con la Hermandad de las Viñas finalizó tras la Semana Santa de 2026.',
    updated_at = now()
where period.band_entity_id = (
    select id from public.entities
    where entity_type = 'band' and slug = 'agrupacion-musical-virgen-de-los-reyes-sevilla'
  )
  and period.brotherhood_entity_id = (
    select id from public.entities
    where entity_type = 'brotherhood' and slug = 'hermandad-las-vinas-jerez'
  )
  and period.outing_type = 'Viernes Santo'
  and period.year_from = 2024;

insert into public.music_accompaniment_periods (
  id,
  brotherhood_entity_id,
  band_entity_id,
  step_entity_id,
  position,
  outing_type,
  date_from,
  date_from_text,
  year_from,
  date_to,
  date_to_text,
  year_to,
  is_current,
  notes,
  status,
  public_brotherhood_name,
  public_step_name,
  public_brotherhood_slug,
  public_municipality_name,
  public_municipality_slug,
  public_province
)
select
  gen_random_uuid(),
  brotherhood.id,
  band.id,
  null,
  'Tras el paso de misterio · tramo de vuelta',
  'Viernes Santo',
  null,
  'Desde 2027',
  2027,
  null,
  null,
  null,
  true,
  'Nueva vinculación para la Semana Santa de 2027. La Encarnación acompañará al Santísimo Cristo de la Exaltación desde la Catedral hasta la parroquia de Nuestra Señora de las Viñas.',
  'published',
  'Hermandad de las Viñas',
  null,
  'hermandad-las-vinas-jerez',
  'Jerez de la Frontera',
  'jerez-de-la-frontera',
  'Cádiz'
from public.entities as brotherhood
cross join public.entities as band
where brotherhood.entity_type = 'brotherhood'
  and brotherhood.slug = 'hermandad-las-vinas-jerez'
  and band.entity_type = 'band'
  and band.slug = 'agrupacion-musical-nuestra-senora-de-la-encarnacion'
  and not exists (
    select 1
    from public.music_accompaniment_periods as existing
    where existing.band_entity_id = band.id
      and existing.brotherhood_entity_id = brotherhood.id
      and existing.year_from = 2027
      and existing.status = 'published'
  );
