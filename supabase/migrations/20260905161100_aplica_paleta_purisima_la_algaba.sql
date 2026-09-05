do $$
declare
  target_id uuid;
begin
  select e.id
    into target_id
  from public.entities e
  where e.slug = 'purisima-de-la-algaba'
  limit 1;

  if target_id is null then
    raise exception 'No se encuentra Purísima de La Algaba';
  end if;

  update public.brotherhood_colors
  set status = 'archived', updated_at = now()
  where brotherhood_entity_id = target_id
    and status = 'published'
    and color_name not in ('Celeste', 'Blanco', 'Dorado');

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
    (target_id, 'Celeste', '#66B8D4', 'primary', 10, 'Color principal de identidad visual de la Hermandad.', 'published'),
    (target_id, 'Blanco', '#FFFFFF', 'identity', 20, 'Color claro de apoyo y contraste.', 'published'),
    (target_id, 'Dorado', '#B08D3C', 'secondary', 30, 'Acento dorado para detalles de la identidad visual.', 'published')
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
