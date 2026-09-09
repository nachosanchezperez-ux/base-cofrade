-- Aplica la identidad visual indicada por el editor para Las Siete Palabras.
-- Los HEX son tonos editoriales de la ficha, no una declaración de valores institucionales oficiales.

do $$
declare
  target_id uuid;
begin
  select id
    into target_id
  from public.entities
  where slug = 'siete-palabras-sevilla'
    and entity_type = 'brotherhood'
  limit 1;

  if target_id is null then
    raise exception 'No se encuentra Las Siete Palabras';
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
    (target_id, 'Rosa oscuro', '#8A204B', 'primary', 10, 'Color principal de la identidad visual indicado por el editor.', 'published'),
    (target_id, 'Blanco', '#FFFFFF', 'identity', 20, 'Color claro de apoyo y contraste.', 'published'),
    (target_id, 'Dorado', '#B08D3C', 'secondary', 30, 'Acento dorado de la identidad visual indicado por el editor.', 'published')
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
