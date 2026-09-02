with target as (
  select id
  from public.entities
  where entity_type = 'brotherhood'
    and slug = 'amparo-sevilla'
    and status = 'published'
)
update public.brotherhood_colors
set status = 'archived'
where brotherhood_entity_id in (select id from target)
  and status = 'published'
  and color_name not in ('Azul noche', 'Dorado');

with target as (
  select id
  from public.entities
  where entity_type = 'brotherhood'
    and slug = 'amparo-sevilla'
    and status = 'published'
), palette(color_name, hex_value, color_role, sort_order, notes) as (
  values
    ('Azul noche', '#0B1F33', 'primary', 10::smallint, 'Color base aplicado a la identidad visual de la ficha.'),
    ('Dorado', '#C6A15B', 'accent', 20::smallint, 'Color de acento aplicado a la identidad visual de la ficha.')
)
insert into public.brotherhood_colors (
  brotherhood_entity_id,
  color_name,
  hex_value,
  color_role,
  sort_order,
  notes,
  status
)
select
  target.id,
  palette.color_name,
  palette.hex_value,
  palette.color_role,
  palette.sort_order,
  palette.notes,
  'published'
from target
cross join palette
on conflict (brotherhood_entity_id, color_name)
do update set
  hex_value = excluded.hex_value,
  color_role = excluded.color_role,
  sort_order = excluded.sort_order,
  notes = excluded.notes,
  status = 'published';
