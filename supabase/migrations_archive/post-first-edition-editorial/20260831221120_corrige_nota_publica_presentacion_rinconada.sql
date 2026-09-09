
do $$
declare v_band uuid;
begin
  select id into v_band
  from entities
  where slug='banda-cornetas-tambores-presentacion-al-pueblo-dos-hermanas'
    and entity_type='band';

  update music_accompaniment_periods
  set notes='Acompañamiento iniciado en 2025 y repetido en 2026.',
      updated_at=now()
  where band_entity_id=v_band
    and public_brotherhood_slug='dolores-la-rinconada'
    and is_current;
end $$;
