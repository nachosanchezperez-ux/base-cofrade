-- Corrección de concurrencia editorial: la auditoría posterior de La Macarena
-- relacionó correctamente el paso, pero devolvió el tipo al valor genérico.
-- Conservamos el paso canónico y restituimos la jornada exacta de la Madrugá.

do $$
declare
  v_band uuid;
  v_macarena uuid;
  v_misterio uuid;
begin
  select id into strict v_band from public.entities where slug='centuria-romana-macarena';
  select id into strict v_macarena from public.entities where slug='hermandad-de-la-macarena';
  select id into strict v_misterio from public.entities where slug='paso-misterio-sentencia-macarena';

  update public.music_accompaniment_periods
  set step_entity_id=v_misterio,
      position='Tras el paso del Señor',
      outing_type='Madrugá',
      public_brotherhood_name='La Macarena',
      public_step_name='Nuestro Padre Jesús de la Sentencia',
      updated_at=now()
  where brotherhood_entity_id=v_macarena
    and band_entity_id=v_band
    and is_current
    and notes not ilike '%sección juvenil%';

  if (select count(*) from public.music_accompaniment_periods
      where brotherhood_entity_id=v_macarena and band_entity_id=v_band
        and is_current and outing_type='Madrugá') <> 2 then
    raise exception 'Las dos posiciones de la Centuria en la Macarena deben figurar en la Madrugá';
  end if;

  if not exists(select 1 from public.music_accompaniment_periods
      where brotherhood_entity_id=v_macarena and band_entity_id=v_band
        and is_current and step_entity_id=v_misterio
        and position='Tras el paso del Señor') then
    raise exception 'La banda titular debe conservar su relación con el paso de la Sentencia';
  end if;
end $$;
