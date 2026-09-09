do $$
declare
  target_id uuid;
begin
  -- La Milagrosa
  select id into target_id from public.entities where slug = 'la-milagrosa-sevilla' limit 1;
  if target_id is null then raise exception 'No se encuentra La Milagrosa'; end if;
  update public.brotherhood_colors set status='archived', updated_at=now()
  where brotherhood_entity_id=target_id and status='published'
    and color_name not in ('Verde','Blanco','Dorado');
  insert into public.brotherhood_colors (brotherhood_entity_id,color_name,hex_value,color_role,sort_order,notes,status)
  values
    (target_id,'Verde','#1F5A3A','primary',10,'Color principal de la identidad visual.','published'),
    (target_id,'Blanco','#FFFFFF','identity',20,'Color claro de apoyo y contraste.','published'),
    (target_id,'Dorado','#B08D3C','secondary',30,'Acento dorado de la identidad visual.','published')
  on conflict (brotherhood_entity_id,color_name) do update set
    hex_value=excluded.hex_value,color_role=excluded.color_role,sort_order=excluded.sort_order,
    notes=excluded.notes,status=excluded.status,updated_at=now();

  -- La Quinta Angustia
  select id into target_id from public.entities where slug = 'quinta-angustia-sevilla' limit 1;
  if target_id is null then raise exception 'No se encuentra La Quinta Angustia'; end if;
  update public.brotherhood_colors set status='archived', updated_at=now()
  where brotherhood_entity_id=target_id and status='published'
    and color_name not in ('Morado oscuro','Morado claro','Blanco');
  insert into public.brotherhood_colors (brotherhood_entity_id,color_name,hex_value,color_role,sort_order,notes,status)
  values
    (target_id,'Morado oscuro','#3A1F4D','primary',10,'Color principal de la identidad visual.','published'),
    (target_id,'Blanco','#FFFFFF','identity',20,'Color claro de apoyo y contraste.','published'),
    (target_id,'Morado claro','#75558A','secondary',30,'Acento morado claro de la identidad visual.','published')
  on conflict (brotherhood_entity_id,color_name) do update set
    hex_value=excluded.hex_value,color_role=excluded.color_role,sort_order=excluded.sort_order,
    notes=excluded.notes,status=excluded.status,updated_at=now();

  -- Montserrat
  select id into target_id from public.entities where slug = 'montserrat' limit 1;
  if target_id is null then raise exception 'No se encuentra Montserrat'; end if;
  update public.brotherhood_colors set status='archived', updated_at=now()
  where brotherhood_entity_id=target_id and status='published'
    and color_name not in ('Azul oscuro','Blanco','Dorado');
  insert into public.brotherhood_colors (brotherhood_entity_id,color_name,hex_value,color_role,sort_order,notes,status)
  values
    (target_id,'Azul oscuro','#0B2341','primary',10,'Color principal de la identidad visual.','published'),
    (target_id,'Blanco','#FFFFFF','identity',20,'Color claro de apoyo y contraste.','published'),
    (target_id,'Dorado','#B08D3C','secondary',30,'Acento dorado de la identidad visual.','published')
  on conflict (brotherhood_entity_id,color_name) do update set
    hex_value=excluded.hex_value,color_role=excluded.color_role,sort_order=excluded.sort_order,
    notes=excluded.notes,status=excluded.status,updated_at=now();
end
$$;
