-- Hermandad de las Viñas · Jerez de la Frontera
-- Cierra la etapa de la A.M. Virgen de los Reyes tras la Semana Santa de 2026
-- y registra la nueva vinculación de la A.M. Ntra. Sra. de la Encarnación desde 2027.

update public.music_accompaniment_periods
set year_to = 2026,
    date_to_text = 'Semana Santa de 2026',
    is_current = false,
    notes = 'Fuente oficial de la banda: Nuestra Semana Santa. La vinculación con la Hermandad de las Viñas finalizó tras la Semana Santa de 2026.',
    updated_at = now()
where id = '279dc0a1-4058-43bf-89b3-3b137d527c01'
  and band_entity_id = 'b829bf98-78fa-4f0f-9aeb-cd965c779853'
  and brotherhood_entity_id = '9f5c6f70-67b0-4161-bff5-a4af0e4d7b40';

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
  'b74f9a36-3779-4a44-9e68-166ceb1b17c5'::uuid,
  '9f5c6f70-67b0-4161-bff5-a4af0e4d7b40'::uuid,
  'cb04a5d8-e81e-4405-a001-9d5a60840924'::uuid,
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
where not exists (
  select 1
  from public.music_accompaniment_periods
  where band_entity_id = 'cb04a5d8-e81e-4405-a001-9d5a60840924'
    and brotherhood_entity_id = '9f5c6f70-67b0-4161-bff5-a4af0e4d7b40'
    and year_from = 2027
    and status = 'published'
);
