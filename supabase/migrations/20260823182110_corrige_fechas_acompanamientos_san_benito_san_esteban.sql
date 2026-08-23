-- Corrige las fechas públicas de dos acompañamientos musicales vigentes.
-- La Encarnación acompaña al misterio de San Benito desde 1995.
-- La Banda de Música María Santísima de la Victoria de Las Cigarreras
-- acompaña a San Esteban desde 2009; la ausencia de salida en 2021 no
-- constituye un nuevo inicio de la vinculación en 2022.

do $$
declare
  v_rows integer;
begin
  update public.music_accompaniment_periods map
  set
    date_from_text = 'Desde 1995',
    year_from = 1995
  where map.brotherhood_entity_id = (
      select id from public.entities
      where entity_type = 'brotherhood' and slug = 'san-benito'
    )
    and map.band_entity_id = (
      select id from public.entities
      where entity_type = 'band' and slug = 'agrupacion-musical-nuestra-senora-de-la-encarnacion'
    )
    and map.is_current = true
    and map.status = 'published';

  get diagnostics v_rows = row_count;
  if v_rows <> 1 then
    raise exception 'Se esperaba actualizar 1 acompañamiento actual de La Encarnación en San Benito y se actualizaron %', v_rows;
  end if;

  update public.music_accompaniment_periods map
  set
    date_from_text = 'Desde 2009',
    year_from = 2009,
    notes = 'Vinculación iniciada en 2009 entre la Banda de Música María Santísima de la Victoria de Las Cigarreras y María Santísima Madre de los Desamparados. En 2021 no hubo estación de penitencia, sin que ello suponga un nuevo inicio de la relación en 2022.'
  where map.brotherhood_entity_id = (
      select id from public.entities
      where entity_type = 'brotherhood' and slug = 'san-esteban'
    )
    and map.band_entity_id = (
      select id from public.entities
      where entity_type = 'band' and slug = 'banda-musica-maria-santisima-victoria-las-cigarreras'
    )
    and map.is_current = true
    and map.status = 'published';

  get diagnostics v_rows = row_count;
  if v_rows <> 1 then
    raise exception 'Se esperaba actualizar 1 acompañamiento actual de Las Cigarreras en San Esteban y se actualizaron %', v_rows;
  end if;
end $$;
