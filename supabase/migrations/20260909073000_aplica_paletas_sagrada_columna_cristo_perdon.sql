do $$
declare
  target_id uuid;
begin
  -- Banda de Cornetas y Tambores Sagrada Columna y Azotes
  select id into target_id
  from public.entities
  where slug = 'banda-cornetas-tambores-sagrada-columna-azotes-las-cigarreras'
  limit 1;

  if target_id is null then
    raise exception 'No se encuentra la Banda de Cornetas y Tambores Sagrada Columna y Azotes';
  end if;

  update public.band_colors
  set status = 'archived', updated_at = now()
  where band_entity_id = target_id
    and status = 'published';

  insert into public.band_colors (
    band_entity_id, color_name, hex_value, color_role, sort_order, notes, status
  )
  values
    (target_id, 'Morado', '#5B2C83', 'primary', 10, 'Color principal de la identidad visual.', 'published'),
    (target_id, 'Dorado', '#B08D3C', 'accent', 20, 'Acento dorado de la identidad visual.', 'published'),
    (target_id, 'Gris oscuro', '#29272C', 'secondary', 30, 'Color estructural oscuro de apoyo.', 'published')
  on conflict (band_entity_id, color_name)
  do update set
    hex_value = excluded.hex_value,
    color_role = excluded.color_role,
    sort_order = excluded.sort_order,
    notes = excluded.notes,
    status = excluded.status,
    updated_at = now();

  update public.bands
  set primary_color = '#5B2C83',
      secondary_color = '#29272C'
  where entity_id = target_id;

  -- Banda Municipal de Música Cristo del Perdón · La Rinconada
  select id into target_id
  from public.entities
  where slug = 'banda-municipal-musica-cristo-del-perdon-la-rinconada'
  limit 1;

  if target_id is null then
    raise exception 'No se encuentra la Banda Municipal de Música Cristo del Perdón';
  end if;

  update public.band_colors
  set status = 'archived', updated_at = now()
  where band_entity_id = target_id
    and status = 'published';

  insert into public.band_colors (
    band_entity_id, color_name, hex_value, color_role, sort_order, notes, status
  )
  values
    (target_id, 'Azul oscuro', '#0B2341', 'primary', 10, 'Color principal de la identidad visual.', 'published'),
    (target_id, 'Dorado', '#B08D3C', 'accent', 20, 'Acento dorado de la identidad visual.', 'published'),
    (target_id, 'Morado', '#5B2C83', 'secondary', 30, 'Segundo color estructural de la identidad visual.', 'published')
  on conflict (band_entity_id, color_name)
  do update set
    hex_value = excluded.hex_value,
    color_role = excluded.color_role,
    sort_order = excluded.sort_order,
    notes = excluded.notes,
    status = excluded.status,
    updated_at = now();

  update public.bands
  set primary_color = '#0B2341',
      secondary_color = '#5B2C83'
  where entity_id = target_id;
end
$$;
