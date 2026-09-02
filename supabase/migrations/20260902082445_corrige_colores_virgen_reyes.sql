-- Corrección editorial · Agrupación Musical Virgen de los Reyes.
-- Solo DML sobre el modelo First Edition existente.

do $$
declare
  v_band_id uuid;
begin
  select id into v_band_id
  from public.entities
  where slug = 'agrupacion-musical-virgen-de-los-reyes-sevilla'
    and entity_type = 'band';

  if v_band_id is null then
    raise exception 'No se ha encontrado la ficha canónica de Virgen de los Reyes';
  end if;

  update public.bands
  set primary_color = '#111111',
      secondary_color = '#C5A253'
  where entity_id = v_band_id;

  delete from public.band_colors
  where band_entity_id = v_band_id;

  insert into public.band_colors (
    band_entity_id, color_name, hex_value, color_role, sort_order, notes, status
  ) values
    (v_band_id, 'Negro', '#111111', 'primary', 10, 'Color corporativo de la formación.', 'published'),
    (v_band_id, 'Dorado', '#C5A253', 'secondary', 20, 'Color corporativo de la formación.', 'published'),
    (v_band_id, 'Rojo', '#B51F2E', 'accent', 30, 'Color corporativo de la formación.', 'published');

  if (select count(*) from public.band_colors where band_entity_id = v_band_id and status = 'published') <> 3
     or exists (
       select 1
       from public.band_colors
       where band_entity_id = v_band_id
         and (color_name, hex_value, color_role) not in (
           ('Negro', '#111111', 'primary'),
           ('Dorado', '#C5A253', 'secondary'),
           ('Rojo', '#B51F2E', 'accent')
         )
     ) then
    raise exception 'La paleta de Virgen de los Reyes no coincide con negro, dorado y rojo';
  end if;
end $$;
