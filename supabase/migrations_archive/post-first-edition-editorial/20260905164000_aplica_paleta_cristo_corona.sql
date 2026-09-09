do $$
declare
  target_id uuid;
begin
  select e.id
    into target_id
  from public.entities e
  where e.slug = 'cristo-de-la-corona'
  limit 1;

  if target_id is null then
    raise exception 'No se encuentra la Hermandad del Santísimo Cristo de la Corona';
  end if;

  update public.brotherhood_colors
  set status = 'archived', updated_at = now()
  where brotherhood_entity_id = target_id
    and status = 'published';

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
    (target_id, 'Morado oscuro', '#3A1F4D', 'primary', 10, 'Color principal de identidad visual de la Hermandad.', 'published'),
    (target_id, 'Morado claro', '#75558A', 'secondary', 20, 'Acento morado de apoyo para la identidad visual.', 'published'),
    (target_id, 'Negro', '#111111', 'accent', 30, 'Color negro de apoyo estructural y contraste.', 'published')
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
