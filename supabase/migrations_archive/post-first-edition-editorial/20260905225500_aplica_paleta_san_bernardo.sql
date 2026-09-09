do $$
declare
  target_id uuid;
begin
  select e.id
    into target_id
  from public.entities e
  where e.slug = 'hermandad-de-san-bernardo'
  limit 1;

  if target_id is null then
    raise exception 'No se encuentra la Hermandad de San Bernardo';
  end if;

  update public.brotherhood_colors
  set status = 'archived', updated_at = now()
  where brotherhood_entity_id = target_id
    and status = 'published'
    and color_name not in ('Morado oscuro', 'Negro', 'Blanco');

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
    (target_id, 'Morado oscuro', '#3A1F4D', 'primary', 10, 'Paleta visual de la ficha; morado oscuro como tono principal.', 'published'),
    (target_id, 'Negro', '#111111', 'secondary', 20, 'Color de acento y apoyo estructural de la identidad visual.', 'published'),
    (target_id, 'Blanco', '#FFFFFF', 'identity', 30, 'Color claro de apoyo y contraste de la identidad visual.', 'published')
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
