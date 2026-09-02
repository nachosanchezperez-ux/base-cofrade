-- Corrección editorial posterior al cierre de La Macarena.
-- La sección juvenil abre la Cruz de Guía: no acompaña al paso de misterio.
-- Solo DML; conserva separadas las dos posiciones de la misma formación.

do $$
declare
  v_macarena uuid;
  v_centuria uuid;
  v_misterio uuid;
begin
  select id into strict v_macarena from public.entities where slug='hermandad-de-la-macarena';
  select id into strict v_centuria from public.entities where slug='centuria-romana-macarena';
  select id into strict v_misterio from public.entities where slug='paso-misterio-sentencia-macarena';

  update public.music_accompaniment_periods
  set step_entity_id=null,
      position='Cruz de Guía · sección juvenil',
      outing_type='Madrugá',
      public_step_name='Cruz de Guía',
      updated_at=now()
  where brotherhood_entity_id=v_macarena
    and band_entity_id=v_centuria
    and is_current
    and notes ilike '%sección juvenil%';

  update public.music_accompaniment_periods
  set step_entity_id=v_misterio,
      position='Tras el paso del Señor',
      outing_type='Estación de penitencia',
      public_step_name='Nuestro Padre Jesús de la Sentencia',
      updated_at=now()
  where brotherhood_entity_id=v_macarena
    and band_entity_id=v_centuria
    and is_current
    and notes not ilike '%sección juvenil%';

  if (select count(*) from public.music_accompaniment_periods
      where brotherhood_entity_id=v_macarena and band_entity_id=v_centuria
        and is_current and position='Cruz de Guía · sección juvenil'
        and step_entity_id is null) <> 1 then
    raise exception 'La sección juvenil debe conservar una única posición en Cruz de Guía';
  end if;

  if (select count(*) from public.music_accompaniment_periods
      where brotherhood_entity_id=v_macarena and band_entity_id=v_centuria
        and is_current and position='Tras el paso del Señor'
        and step_entity_id=v_misterio) <> 1 then
    raise exception 'La banda titular debe acompañar al paso del Señor';
  end if;
end
$$;
