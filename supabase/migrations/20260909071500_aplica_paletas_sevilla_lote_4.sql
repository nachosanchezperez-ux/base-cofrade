do $$
declare
  target_id uuid;
begin
  -- Divina Pastora de Triana
  select id into target_id from public.entities where slug = 'pastora-de-triana' limit 1;
  if target_id is null then raise exception 'No se encuentra Divina Pastora de Triana'; end if;
  update public.brotherhood_colors set status = 'archived', updated_at = now()
  where brotherhood_entity_id = target_id and status = 'published';
  insert into public.brotherhood_colors (brotherhood_entity_id,color_name,hex_value,color_role,sort_order,notes,status)
  values
    (target_id,'Azul','#234A78','primary',10,'Color principal de la identidad visual.','published'),
    (target_id,'Blanco','#FFFFFF','identity',20,'Color claro de apoyo y contraste.','published'),
    (target_id,'Celeste','#66B8D4','secondary',30,'Acento celeste de la identidad visual.','published')
  on conflict (brotherhood_entity_id,color_name) do update set
    hex_value=excluded.hex_value,color_role=excluded.color_role,sort_order=excluded.sort_order,
    notes=excluded.notes,status=excluded.status,updated_at=now();

  -- Desamparados del Santo Ángel
  select id into target_id from public.entities where slug = 'agrupacion-cristo-desamparados-santo-angel' limit 1;
  if target_id is null then raise exception 'No se encuentra Desamparados del Santo Ángel'; end if;
  update public.brotherhood_colors set status = 'archived', updated_at = now()
  where brotherhood_entity_id = target_id and status = 'published';
  insert into public.brotherhood_colors (brotherhood_entity_id,color_name,hex_value,color_role,sort_order,notes,status)
  values
    (target_id,'Marrón','#6B4A2F','primary',10,'Color principal de la identidad visual.','published'),
    (target_id,'Blanco','#FFFFFF','identity',20,'Color claro de apoyo y contraste.','published')
  on conflict (brotherhood_entity_id,color_name) do update set
    hex_value=excluded.hex_value,color_role=excluded.color_role,sort_order=excluded.sort_order,
    notes=excluded.notes,status=excluded.status,updated_at=now();

  -- Divina Pastora de Marchena
  select id into target_id from public.entities where slug = 'divina-pastora-marchena' limit 1;
  if target_id is null then raise exception 'No se encuentra Divina Pastora de Marchena'; end if;
  update public.brotherhood_colors set status = 'archived', updated_at = now()
  where brotherhood_entity_id = target_id and status = 'published';
  insert into public.brotherhood_colors (brotherhood_entity_id,color_name,hex_value,color_role,sort_order,notes,status)
  values
    (target_id,'Rojo','#B01B32','primary',10,'Color principal de la identidad visual.','published'),
    (target_id,'Blanco','#FFFFFF','identity',20,'Color claro de apoyo y contraste.','published')
  on conflict (brotherhood_entity_id,color_name) do update set
    hex_value=excluded.hex_value,color_role=excluded.color_role,sort_order=excluded.sort_order,
    notes=excluded.notes,status=excluded.status,updated_at=now();

  -- Divina Pastora de Padre Pío
  select id into target_id from public.entities where slug = 'pastora-padre-pio' limit 1;
  if target_id is null then raise exception 'No se encuentra Divina Pastora de Padre Pío'; end if;
  update public.brotherhood_colors set status = 'archived', updated_at = now()
  where brotherhood_entity_id = target_id and status = 'published';
  insert into public.brotherhood_colors (brotherhood_entity_id,color_name,hex_value,color_role,sort_order,notes,status)
  values
    (target_id,'Celeste','#66B8D4','primary',10,'Color principal de la identidad visual.','published'),
    (target_id,'Blanco','#FFFFFF','identity',20,'Color claro de apoyo y contraste.','published'),
    (target_id,'Dorado','#B08D3C','secondary',30,'Acento dorado de la identidad visual.','published')
  on conflict (brotherhood_entity_id,color_name) do update set
    hex_value=excluded.hex_value,color_role=excluded.color_role,sort_order=excluded.sort_order,
    notes=excluded.notes,status=excluded.status,updated_at=now();

  -- Cristo de Burgos
  select id into target_id from public.entities where slug = 'cristo-de-burgos' limit 1;
  if target_id is null then raise exception 'No se encuentra Cristo de Burgos'; end if;
  update public.brotherhood_colors set status = 'archived', updated_at = now()
  where brotherhood_entity_id = target_id and status = 'published';
  insert into public.brotherhood_colors (brotherhood_entity_id,color_name,hex_value,color_role,sort_order,notes,status)
  values
    (target_id,'Negro','#111111','primary',10,'Color principal de la identidad visual.','published'),
    (target_id,'Dorado','#B08D3C','secondary',20,'Acento dorado de la identidad visual.','published')
  on conflict (brotherhood_entity_id,color_name) do update set
    hex_value=excluded.hex_value,color_role=excluded.color_role,sort_order=excluded.sort_order,
    notes=excluded.notes,status=excluded.status,updated_at=now();

  -- Divina Pastora de Santa Marina
  select id into target_id from public.entities where slug = 'pastora-de-santa-marina' limit 1;
  if target_id is null then raise exception 'No se encuentra Divina Pastora de Santa Marina'; end if;
  update public.brotherhood_colors set status = 'archived', updated_at = now()
  where brotherhood_entity_id = target_id and status = 'published';
  insert into public.brotherhood_colors (brotherhood_entity_id,color_name,hex_value,color_role,sort_order,notes,status)
  values
    (target_id,'Azul','#234A78','primary',10,'Color principal de la identidad visual.','published'),
    (target_id,'Blanco','#FFFFFF','identity',20,'Color claro de apoyo y contraste.','published')
  on conflict (brotherhood_entity_id,color_name) do update set
    hex_value=excluded.hex_value,color_role=excluded.color_role,sort_order=excluded.sort_order,
    notes=excluded.notes,status=excluded.status,updated_at=now();
end
$$;