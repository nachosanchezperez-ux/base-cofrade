begin;

do $$
declare
  v_id uuid;
begin
  -- Jesús Nazareno de Estepa
  select id into v_id from public.entities where slug = 'jesus-nazareno-estepa' limit 1;
  if v_id is null then raise exception 'No se encuentra jesus-nazareno-estepa'; end if;
  update public.brotherhood_colors set status = 'archived', updated_at = now()
  where brotherhood_entity_id = v_id and status = 'published'
    and color_name not in ('Morado oscuro', 'Morado claro');
  insert into public.brotherhood_colors (brotherhood_entity_id, color_name, hex_value, color_role, sort_order, notes, status, updated_at)
  values
    (v_id, 'Morado oscuro', '#3A1F4D', 'primary', 10, 'Paleta corporativa indicada para Jesús Nazareno de Estepa', 'published', now()),
    (v_id, 'Morado claro', '#75558A', 'secondary', 20, 'Paleta corporativa indicada para Jesús Nazareno de Estepa', 'published', now())
  on conflict (brotherhood_entity_id, color_name) do update
  set hex_value = excluded.hex_value, color_role = excluded.color_role, sort_order = excluded.sort_order,
      notes = excluded.notes, status = 'published', updated_at = now();

  -- Salud de La Rinconada
  select id into v_id from public.entities where slug = 'hermandad-salud-la-rinconada' limit 1;
  if v_id is null then raise exception 'No se encuentra hermandad-salud-la-rinconada'; end if;
  update public.brotherhood_colors set status = 'archived', updated_at = now()
  where brotherhood_entity_id = v_id and status = 'published'
    and color_name not in ('Verde', 'Blanco', 'Morado');
  insert into public.brotherhood_colors (brotherhood_entity_id, color_name, hex_value, color_role, sort_order, notes, status, updated_at)
  values
    (v_id, 'Verde', '#1F5A3A', 'primary', 10, 'Paleta corporativa indicada para la Salud de La Rinconada', 'published', now()),
    (v_id, 'Blanco', '#FFFFFF', 'identity', 20, 'Paleta corporativa indicada para la Salud de La Rinconada', 'published', now()),
    (v_id, 'Morado', '#5B2C83', 'secondary', 30, 'Paleta corporativa indicada para la Salud de La Rinconada', 'published', now())
  on conflict (brotherhood_entity_id, color_name) do update
  set hex_value = excluded.hex_value, color_role = excluded.color_role, sort_order = excluded.sort_order,
      notes = excluded.notes, status = 'published', updated_at = now();

  -- Resurrección de La Rinconada
  select id into v_id from public.entities where slug = 'hermandad-resurreccion-la-rinconada' limit 1;
  if v_id is null then raise exception 'No se encuentra hermandad-resurreccion-la-rinconada'; end if;
  update public.brotherhood_colors set status = 'archived', updated_at = now()
  where brotherhood_entity_id = v_id and status = 'published'
    and color_name not in ('Azul', 'Blanco', 'Dorado');
  insert into public.brotherhood_colors (brotherhood_entity_id, color_name, hex_value, color_role, sort_order, notes, status, updated_at)
  values
    (v_id, 'Azul', '#234A78', 'primary', 10, 'Paleta corporativa indicada para la Resurrección de La Rinconada', 'published', now()),
    (v_id, 'Blanco', '#FFFFFF', 'identity', 20, 'Paleta corporativa indicada para la Resurrección de La Rinconada', 'published', now()),
    (v_id, 'Dorado', '#B08D3C', 'secondary', 30, 'Paleta corporativa indicada para la Resurrección de La Rinconada', 'published', now())
  on conflict (brotherhood_entity_id, color_name) do update
  set hex_value = excluded.hex_value, color_role = excluded.color_role, sort_order = excluded.sort_order,
      notes = excluded.notes, status = 'published', updated_at = now();

  -- Guadalupe de San Buenaventura
  select id into v_id from public.entities where slug = 'guadalupe-san-buenaventura' limit 1;
  if v_id is null then raise exception 'No se encuentra guadalupe-san-buenaventura'; end if;
  update public.brotherhood_colors set status = 'archived', updated_at = now()
  where brotherhood_entity_id = v_id and status = 'published'
    and color_name not in ('Azul', 'Dorado');
  insert into public.brotherhood_colors (brotherhood_entity_id, color_name, hex_value, color_role, sort_order, notes, status, updated_at)
  values
    (v_id, 'Azul', '#234A78', 'primary', 10, 'Paleta corporativa indicada para Guadalupe de San Buenaventura', 'published', now()),
    (v_id, 'Dorado', '#B08D3C', 'secondary', 20, 'Paleta corporativa indicada para Guadalupe de San Buenaventura', 'published', now())
  on conflict (brotherhood_entity_id, color_name) do update
  set hex_value = excluded.hex_value, color_role = excluded.color_role, sort_order = excluded.sort_order,
      notes = excluded.notes, status = 'published', updated_at = now();

  -- Divino Perdón de Alcosa
  select id into v_id from public.entities where slug = 'hermandad-del-divino-perdon' limit 1;
  if v_id is null then raise exception 'No se encuentra hermandad-del-divino-perdon'; end if;
  update public.brotherhood_colors set status = 'archived', updated_at = now()
  where brotherhood_entity_id = v_id and status = 'published'
    and color_name not in ('Morado', 'Negro', 'Dorado');
  insert into public.brotherhood_colors (brotherhood_entity_id, color_name, hex_value, color_role, sort_order, notes, status, updated_at)
  values
    (v_id, 'Morado', '#5B2C83', 'primary', 10, 'Paleta corporativa indicada para Divino Perdón de Alcosa', 'published', now()),
    (v_id, 'Dorado', '#B08D3C', 'accent', 20, 'Paleta corporativa indicada para Divino Perdón de Alcosa', 'published', now()),
    (v_id, 'Negro', '#111111', 'secondary', 30, 'Paleta corporativa indicada para Divino Perdón de Alcosa', 'published', now())
  on conflict (brotherhood_entity_id, color_name) do update
  set hex_value = excluded.hex_value, color_role = excluded.color_role, sort_order = excluded.sort_order,
      notes = excluded.notes, status = 'published', updated_at = now();

  -- Lágrimas de Dolores
  select id into v_id from public.entities where slug = 'agrupacion-musical-lagrimas-dolores-san-fernando' limit 1;
  if v_id is null then raise exception 'No se encuentra agrupacion-musical-lagrimas-dolores-san-fernando'; end if;
  update public.bands set primary_color = '#111111', secondary_color = '#B01B32' where entity_id = v_id;
  update public.band_colors set status = 'archived', updated_at = now()
  where band_entity_id = v_id and status = 'published'
    and color_name not in ('Negro', 'Rojo', 'Blanco');
  insert into public.band_colors (band_entity_id, color_name, hex_value, color_role, sort_order, notes, status, updated_at)
  values
    (v_id, 'Negro', '#111111', 'primary', 10, 'Paleta corporativa indicada para Lágrimas de Dolores', 'published', now()),
    (v_id, 'Rojo', '#B01B32', 'secondary', 20, 'Paleta corporativa indicada para Lágrimas de Dolores', 'published', now()),
    (v_id, 'Blanco', '#FFFFFF', 'accent', 30, 'Paleta corporativa indicada para Lágrimas de Dolores', 'published', now())
  on conflict (band_entity_id, color_name) do update
  set hex_value = excluded.hex_value, color_role = excluded.color_role, sort_order = excluded.sort_order,
      notes = excluded.notes, status = 'published', updated_at = now();

  -- Banda de Alcalá
  select id into v_id from public.entities where slug = 'banda-musica-alcala-guadaira' limit 1;
  if v_id is null then raise exception 'No se encuentra banda-musica-alcala-guadaira'; end if;
  update public.bands set primary_color = '#111111', secondary_color = '#C5A253' where entity_id = v_id;
  update public.band_colors set status = 'archived', updated_at = now()
  where band_entity_id = v_id and status = 'published'
    and color_name not in ('Negro', 'Dorado');
  insert into public.band_colors (band_entity_id, color_name, hex_value, color_role, sort_order, notes, status, updated_at)
  values
    (v_id, 'Negro', '#111111', 'primary', 10, 'Paleta corporativa indicada para Banda de Alcalá', 'published', now()),
    (v_id, 'Dorado', '#C5A253', 'secondary', 20, 'Paleta corporativa indicada para Banda de Alcalá', 'published', now())
  on conflict (band_entity_id, color_name) do update
  set hex_value = excluded.hex_value, color_role = excluded.color_role, sort_order = excluded.sort_order,
      notes = excluded.notes, status = 'published', updated_at = now();
end
$$;

commit;
