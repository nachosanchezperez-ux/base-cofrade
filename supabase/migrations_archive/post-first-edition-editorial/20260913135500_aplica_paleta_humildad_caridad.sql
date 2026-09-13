begin;

do $$
declare
  target_id uuid;
begin
  select id into target_id
  from public.entities
  where slug = 'humildad-caridad-el-olivo-san-jose-rinconada'
    and entity_type = 'brotherhood'
  limit 1;

  if target_id is null then
    raise exception 'No se encuentra Humildad y Caridad – El Olivo';
  end if;

  update public.brotherhood_colors
  set status = 'archived', updated_at = now()
  where brotherhood_entity_id = target_id
    and status = 'published'
    and color_name not in ('Burdeos', 'Blanco', 'Dorado');

  insert into public.brotherhood_colors (
    brotherhood_entity_id,
    color_name,
    hex_value,
    color_role,
    sort_order,
    notes,
    status,
    updated_at
  )
  values
    (target_id, 'Burdeos', '#7A263A', 'primary', 10, 'Paleta corporativa indicada para Humildad y Caridad – El Olivo', 'published', now()),
    (target_id, 'Blanco', '#FFFFFF', 'identity', 20, 'Paleta corporativa indicada para Humildad y Caridad – El Olivo', 'published', now()),
    (target_id, 'Dorado', '#B08D3C', 'secondary', 30, 'Paleta corporativa indicada para Humildad y Caridad – El Olivo', 'published', now())
  on conflict (brotherhood_entity_id, color_name) do update
  set hex_value = excluded.hex_value,
      color_role = excluded.color_role,
      sort_order = excluded.sort_order,
      notes = excluded.notes,
      status = 'published',
      updated_at = now();
end
$$;

commit;
