do $$
declare
  target_id uuid;
begin
  -- El Amor
  select id into target_id from public.entities where slug = 'hermandad-del-amor' limit 1;
  if target_id is null then raise exception 'No se encuentra El Amor'; end if;
  update public.brotherhood_colors set status='archived', updated_at=now()
  where brotherhood_entity_id=target_id and status='published'
    and color_name not in ('Rojo','Blanco','Morado');
  insert into public.brotherhood_colors (brotherhood_entity_id,color_name,hex_value,color_role,sort_order,notes,status)
  values
    (target_id,'Rojo','#B01B32','primary',10,'Color principal de la identidad visual.','published'),
    (target_id,'Blanco','#FFFFFF','identity',20,'Color claro de apoyo y contraste.','published'),
    (target_id,'Morado','#5B2C83','secondary',30,'Acento morado de la identidad visual.','published')
  on conflict (brotherhood_entity_id,color_name) do update set
    hex_value=excluded.hex_value,color_role=excluded.color_role,sort_order=excluded.sort_order,
    notes=excluded.notes,status=excluded.status,updated_at=now();

  -- El Cachorro
  select id into target_id from public.entities where slug = 'hermandad-del-cachorro' limit 1;
  if target_id is null then raise exception 'No se encuentra El Cachorro'; end if;
  update public.brotherhood_colors set status='archived', updated_at=now()
  where brotherhood_entity_id=target_id and status='published'
    and color_name not in ('Negro','Blanco');
  insert into public.brotherhood_colors (brotherhood_entity_id,color_name,hex_value,color_role,sort_order,notes,status)
  values
    (target_id,'Negro','#111111','primary',10,'Color principal de la identidad visual.','published'),
    (target_id,'Blanco','#FFFFFF','identity',20,'Color claro de apoyo y contraste.','published')
  on conflict (brotherhood_entity_id,color_name) do update set
    hex_value=excluded.hex_value,color_role=excluded.color_role,sort_order=excluded.sort_order,
    notes=excluded.notes,status=excluded.status,updated_at=now();

  -- El Carmen
  select id into target_id from public.entities where slug = 'carmen-doloroso' limit 1;
  if target_id is null then raise exception 'No se encuentra El Carmen'; end if;
  update public.brotherhood_colors set status='archived', updated_at=now()
  where brotherhood_entity_id=target_id and status='published'
    and color_name not in ('Marrón','Blanco');
  insert into public.brotherhood_colors (brotherhood_entity_id,color_name,hex_value,color_role,sort_order,notes,status)
  values
    (target_id,'Marrón','#6B4A2F','primary',10,'Color principal de la identidad visual.','published'),
    (target_id,'Blanco','#FFFFFF','identity',20,'Color claro de apoyo y contraste.','published')
  on conflict (brotherhood_entity_id,color_name) do update set
    hex_value=excluded.hex_value,color_role=excluded.color_role,sort_order=excluded.sort_order,
    notes=excluded.notes,status=excluded.status,updated_at=now();

  -- El Valle
  select id into target_id from public.entities where slug = 'el-valle' limit 1;
  if target_id is null then raise exception 'No se encuentra El Valle'; end if;
  update public.brotherhood_colors set status='archived', updated_at=now()
  where brotherhood_entity_id=target_id and status='published'
    and color_name not in ('Morado','Blanco','Verde');
  insert into public.brotherhood_colors (brotherhood_entity_id,color_name,hex_value,color_role,sort_order,notes,status)
  values
    (target_id,'Morado','#5B2C83','primary',10,'Color principal de la identidad visual.','published'),
    (target_id,'Blanco','#FFFFFF','identity',20,'Color claro de apoyo y contraste.','published'),
    (target_id,'Verde','#1F5A3A','secondary',30,'Acento verde de la identidad visual.','published')
  on conflict (brotherhood_entity_id,color_name) do update set
    hex_value=excluded.hex_value,color_role=excluded.color_role,sort_order=excluded.sort_order,
    notes=excluded.notes,status=excluded.status,updated_at=now();

  -- La Amargura
  select id into target_id from public.entities where slug = 'hermandad-de-la-amargura' limit 1;
  if target_id is null then raise exception 'No se encuentra La Amargura'; end if;
  update public.brotherhood_colors set status='archived', updated_at=now()
  where brotherhood_entity_id=target_id and status='published'
    and color_name not in ('Rojo','Blanco','Dorado');
  insert into public.brotherhood_colors (brotherhood_entity_id,color_name,hex_value,color_role,sort_order,notes,status)
  values
    (target_id,'Rojo','#B01B32','primary',10,'Color principal de la identidad visual.','published'),
    (target_id,'Blanco','#FFFFFF','identity',20,'Color claro de apoyo y contraste.','published'),
    (target_id,'Dorado','#B08D3C','secondary',30,'Acento dorado de la identidad visual.','published')
  on conflict (brotherhood_entity_id,color_name) do update set
    hex_value=excluded.hex_value,color_role=excluded.color_role,sort_order=excluded.sort_order,
    notes=excluded.notes,status=excluded.status,updated_at=now();

  -- La Estrella
  select id into target_id from public.entities where slug = 'hermandad-de-la-estrella' limit 1;
  if target_id is null then raise exception 'No se encuentra La Estrella'; end if;
  update public.brotherhood_colors set status='archived', updated_at=now()
  where brotherhood_entity_id=target_id and status='published'
    and color_name not in ('Azul','Blanco');
  insert into public.brotherhood_colors (brotherhood_entity_id,color_name,hex_value,color_role,sort_order,notes,status)
  values
    (target_id,'Azul','#234A78','primary',10,'Color principal de la identidad visual.','published'),
    (target_id,'Blanco','#FFFFFF','identity',20,'Color claro de apoyo y contraste.','published')
  on conflict (brotherhood_entity_id,color_name) do update set
    hex_value=excluded.hex_value,color_role=excluded.color_role,sort_order=excluded.sort_order,
    notes=excluded.notes,status=excluded.status,updated_at=now();

  -- La Hiniesta
  select id into target_id from public.entities where slug = 'hermandad-hiniesta-sevilla' limit 1;
  if target_id is null then raise exception 'No se encuentra La Hiniesta'; end if;
  update public.brotherhood_colors set status='archived', updated_at=now()
  where brotherhood_entity_id=target_id and status='published'
    and color_name not in ('Azul','Plata');
  insert into public.brotherhood_colors (brotherhood_entity_id,color_name,hex_value,color_role,sort_order,notes,status)
  values
    (target_id,'Azul','#234A78','primary',10,'Color principal de la identidad visual.','published'),
    (target_id,'Plata','#B8BDC4','identity',20,'Color claro de apoyo de la identidad visual.','published')
  on conflict (brotherhood_entity_id,color_name) do update set
    hex_value=excluded.hex_value,color_role=excluded.color_role,sort_order=excluded.sort_order,
    notes=excluded.notes,status=excluded.status,updated_at=now();
end
$$;
