do $$
declare
  target_id uuid;
begin
  -- El Baratillo
  select id into target_id from public.entities where slug = 'el-baratillo' limit 1;
  if target_id is null then raise exception 'No se encuentra El Baratillo'; end if;
  update public.brotherhood_colors set status = 'archived', updated_at = now()
  where brotherhood_entity_id = target_id and status = 'published'
    and color_name not in ('Azul','Blanco','Rojo','Negro');
  insert into public.brotherhood_colors (brotherhood_entity_id,color_name,hex_value,color_role,sort_order,notes,status)
  values
    (target_id,'Azul','#234A78','primary',10,'Color dominante del hábito nazareno.','published'),
    (target_id,'Blanco','#FFFFFF','identity',20,'Color de apoyo del cortejo del paso de palio.','published'),
    (target_id,'Rojo','#B01B32','secondary',30,'Acento documentado en cíngulo y botonadura del cortejo del paso de Cristo.','published'),
    (target_id,'Negro','#111111','accent',40,'Color de apoyo documentado en el calzado.','published')
  on conflict (brotherhood_entity_id,color_name) do update set
    hex_value=excluded.hex_value,color_role=excluded.color_role,sort_order=excluded.sort_order,
    notes=excluded.notes,status=excluded.status,updated_at=now();

  -- San Pablo
  select id into target_id from public.entities where slug = 'hermandad-de-san-pablo' limit 1;
  if target_id is null then raise exception 'No se encuentra San Pablo'; end if;
  update public.brotherhood_colors set status = 'archived', updated_at = now()
  where brotherhood_entity_id = target_id and status = 'published'
    and color_name not in ('Negro','Beige','Granate','Morado');
  insert into public.brotherhood_colors (brotherhood_entity_id,color_name,hex_value,color_role,sort_order,notes,status)
  values
    (target_id,'Negro','#111111','primary',10,'Color estructural documentado en antifaz y botonadura.','published'),
    (target_id,'Beige','#E8DFC8','identity',20,'Color de túnica y capa documentado en el hábito nazareno.','published'),
    (target_id,'Granate','#7A263A','secondary',30,'Acento documentado en el cíngulo.','published'),
    (target_id,'Morado','#5B2C83','accent',40,'Segundo acento documentado en el cíngulo.','published')
  on conflict (brotherhood_entity_id,color_name) do update set
    hex_value=excluded.hex_value,color_role=excluded.color_role,sort_order=excluded.sort_order,
    notes=excluded.notes,status=excluded.status,updated_at=now();

  -- Hermandad Sacramental de Tomares
  select id into target_id from public.entities where slug = 'hermandad-sacramental-tomares' limit 1;
  if target_id is null then raise exception 'No se encuentra la Sacramental de Tomares'; end if;
  update public.brotherhood_colors set status = 'archived', updated_at = now()
  where brotherhood_entity_id = target_id and status = 'published'
    and color_name not in ('Negro','Esparto');
  insert into public.brotherhood_colors (brotherhood_entity_id,color_name,hex_value,color_role,sort_order,notes,status)
  values
    (target_id,'Negro','#111111','primary',10,'Color dominante documentado en túnica y antifaz.','published'),
    (target_id,'Esparto','#D8C8A8','secondary',20,'Tono de apoyo inspirado en el cinturón de esparto documentado.','published')
  on conflict (brotherhood_entity_id,color_name) do update set
    hex_value=excluded.hex_value,color_role=excluded.color_role,sort_order=excluded.sort_order,
    notes=excluded.notes,status=excluded.status,updated_at=now();

  -- Vera Cruz de Tocina
  select id into target_id from public.entities where slug = 'vera-cruz-tocina' limit 1;
  if target_id is null then raise exception 'No se encuentra Vera Cruz de Tocina'; end if;
  update public.brotherhood_colors set status = 'archived', updated_at = now()
  where brotherhood_entity_id = target_id and status = 'published'
    and color_name not in ('Verde','Blanco');
  insert into public.brotherhood_colors (brotherhood_entity_id,color_name,hex_value,color_role,sort_order,notes,status)
  values
    (target_id,'Verde','#1F5A3A','primary',10,'Color documentado en el antifaz del Viernes Santo.','published'),
    (target_id,'Blanco','#FFFFFF','identity',20,'Color documentado en la túnica del Viernes Santo.','published')
  on conflict (brotherhood_entity_id,color_name) do update set
    hex_value=excluded.hex_value,color_role=excluded.color_role,sort_order=excluded.sort_order,
    notes=excluded.notes,status=excluded.status,updated_at=now();

  -- Vera Cruz y Encarnación de Aznalcázar
  select id into target_id from public.entities where slug = 'encarnacion-aznalcazar' limit 1;
  if target_id is null then raise exception 'No se encuentra Vera Cruz y Encarnación de Aznalcázar'; end if;
  update public.brotherhood_colors set status = 'archived', updated_at = now()
  where brotherhood_entity_id = target_id and status = 'published'
    and color_name not in ('Verde','Blanco');
  insert into public.brotherhood_colors (brotherhood_entity_id,color_name,hex_value,color_role,sort_order,notes,status)
  values
    (target_id,'Verde','#1F5A3A','primary',10,'Color dominante documentado en túnica y antifaz.','published'),
    (target_id,'Blanco','#FFFFFF','identity',20,'Color documentado en el cordón franciscano.','published')
  on conflict (brotherhood_entity_id,color_name) do update set
    hex_value=excluded.hex_value,color_role=excluded.color_role,sort_order=excluded.sort_order,
    notes=excluded.notes,status=excluded.status,updated_at=now();
end
$$;