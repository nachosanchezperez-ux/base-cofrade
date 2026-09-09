do $$
declare
  target_id uuid;
begin
  select e.id
    into target_id
  from public.entities e
  where e.slug = 'hermandad-de-la-mision-sevilla'
  limit 1;

  if target_id is null then
    raise exception 'No se encuentra La Misión';
  end if;

  update public.brotherhood_colors
  set status = 'archived', updated_at = now()
  where brotherhood_entity_id = target_id
    and status = 'published'
    and color_name not in ('Azul real', 'Blanco', 'Azul claro');

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
    (target_id, 'Azul real', '#4B67D6', 'primary', 10, 'Color principal tomado de la túnica nazarena de la Hermandad.', 'published'),
    (target_id, 'Blanco', '#FFFFFF', 'identity', 20, 'Color claro de apoyo y contraste presente en la túnica nazarena.', 'published'),
    (target_id, 'Azul claro', '#8FA6F2', 'secondary', 30, 'Acento claro inspirado en los detalles azules de la indumentaria nazarena.', 'published')
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
