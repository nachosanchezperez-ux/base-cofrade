update public.music_accompaniment_periods
set date_from_text = 'Hasta 2025',
    date_to_text = 'Hasta 2025',
    updated_at = now()
where band_entity_id = (
  select id from public.entities
  where entity_type = 'band'
    and slug = 'agrupacion-musical-nuestro-padre-jesus-redencion-sevilla'
)
  and brotherhood_entity_id in (
    select id from public.entities
    where entity_type = 'brotherhood'
      and slug in ('hermandad-monte-sion-sevilla', 'hermandad-milagrosa-sevilla')
  )
  and year_to = 2025
  and is_current = false;

update public.music_accompaniment_periods
set date_from_text = regexp_replace(
      date_from_text,
      '^Vigente en ([0-9]{4}).*$',
      'Vigente · \1',
      'i'
    ),
    updated_at = now()
where is_current = true
  and year_from is null
  and date_from_text ~* '^Vigente en [0-9]{4}';
