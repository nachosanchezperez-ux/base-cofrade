begin;

insert into public.brotherhood_colors (
  id,
  brotherhood_entity_id,
  color_name,
  hex_value,
  color_role,
  sort_order,
  notes,
  status,
  created_at,
  updated_at
)
values
  (gen_random_uuid(), 'b2000000-0000-0000-0000-000000000001', 'Morado', '#5B2C83', 'primary', 10, 'Paleta corporativa validada · septiembre 2026', 'published', now(), now()),
  (gen_random_uuid(), 'b2000000-0000-0000-0000-000000000001', 'Blanco', '#FFFFFF', 'identity', 20, 'Paleta corporativa validada · septiembre 2026', 'published', now(), now()),
  (gen_random_uuid(), 'b2000000-0000-0000-0000-000000000001', 'Dorado', '#B08D3C', 'secondary', 30, 'Paleta corporativa validada · septiembre 2026', 'published', now(), now())
on conflict (brotherhood_entity_id, color_name)
do update set
  hex_value = excluded.hex_value,
  color_role = excluded.color_role,
  sort_order = excluded.sort_order,
  notes = excluded.notes,
  status = 'published',
  updated_at = now();

update public.brotherhood_colors
set status = 'archived',
    updated_at = now()
where brotherhood_entity_id = 'b2000000-0000-0000-0000-000000000001'
  and color_name not in ('Morado', 'Blanco', 'Dorado')
  and status = 'published';

commit;
