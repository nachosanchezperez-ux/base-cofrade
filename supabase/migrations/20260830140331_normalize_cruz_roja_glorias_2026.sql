with cruz_roja as (
  select id
  from public.entities
  where name = 'Cruz Roja'
    and entity_type = 'band'
  order by created_at nulls last, id
  limit 1
)
update public.music_accompaniment_periods map
set year_to = 2025,
    is_current = false,
    date_from_text = 'Hasta 2025',
    notes = 'En 2026 el acompañamiento correspondió a AMUECI.',
    updated_at = now()
where map.band_entity_id = (select id from cruz_roja)
  and map.public_brotherhood_name = 'Hermandad de la Candelaria Madre de Dios';

update public.music_accompaniment_periods map
set notes = null,
    updated_at = now()
where map.status = 'published'
  and map.notes is not null
  and (map.notes ~* '^\s*Fuente\s*:' or map.notes ~* '^\s*Fuente oficial\b')
  and exists (
    select 1
    from public.source_links sl
    where sl.music_accompaniment_period_id = map.id
  );

with cruz_roja as (
  select id
  from public.entities
  where name = 'Cruz Roja'
    and entity_type = 'band'
  order by created_at nulls last, id
  limit 1
)
update public.music_accompaniment_periods map
set notes = trim(regexp_replace(map.date_from_text, ';\s*vigencia consultada en 2026\s*$', '', 'i')),
    date_from_text = 'Inicio por documentar',
    updated_at = now()
where map.band_entity_id = (select id from cruz_roja)
  and map.status = 'published'
  and map.is_current = true
  and map.year_from is null
  and map.date_from_text ~* 'vigencia consultada en 2026';
