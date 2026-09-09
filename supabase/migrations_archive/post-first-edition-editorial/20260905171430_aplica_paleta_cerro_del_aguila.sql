do $$
declare
  target_id uuid;
begin
  select e.id
    into target_id
  from public.entities e
  where e.slug = 'hermandad-cerro-del-aguila-sevilla'
  limit 1;

  if target_id is null then
    raise exception 'No se encuentra El Cerro del Águila';
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
    (target_id, 'Burdeos', '#7A263A', 'primary', 10, 'Paleta corporativa validada · septiembre 2026', 'published'),
    (target_id, 'Blanco', '#FFFFFF', 'identity', 20, 'Paleta corporativa validada · septiembre 2026', 'published'),
    (target_id, 'Dorado', '#B08D3C', 'secondary', 30, 'Paleta corporativa validada · septiembre 2026', 'published')
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
