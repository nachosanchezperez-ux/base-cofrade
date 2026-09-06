do $$
declare
  target_id uuid;
begin
  select e.id
    into target_id
  from public.entities e
  where e.slug = 'juncal-sevilla'
  limit 1;

  if target_id is null then
    raise exception 'No se encuentra El Juncal';
  end if;

  update public.brotherhood_colors
  set status = 'archived', updated_at = now()
  where brotherhood_entity_id = target_id
    and status = 'published'
    and color_name not in ('Azul', 'Blanco', 'Verde');

  insert into public.brotherhood_colors (
    brotherhood_entity_id,
    color_name,
    hex_value,
    color_role,
    sort_order,
    notes,
    status
  )
  values
    (target_id, 'Azul', '#153B69', 'primary', 10, 'Color corporativo principal de la Hermandad.', 'published'),
    (target_id, 'Blanco', '#FFFFFF', 'identity', 20, 'Color corporativo claro y de contraste de la Hermandad.', 'published'),
    (target_id, 'Verde', '#1F5A3A', 'secondary', 30, 'Acento visual complementario solicitado para la ficha.', 'published')
  on conflict (brotherhood_entity_id, color_name)
  do update set
    hex_value = excluded.hex_value,
    color_role = excluded.color_role,
    sort_order = excluded.sort_order,
    notes = excluded.notes,
    status = excluded.status,
    updated_at = now();
end
$$;
