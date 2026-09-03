-- Aplica la identidad visual de la Hermandad de la Sed.
-- Los HEX son tonos editoriales para la presentación de la ficha, no una declaración de valores institucionales oficiales.

with target as (
  select id
  from public.entities
  where slug = 'hermandad-de-la-sed'
    and entity_type = 'brotherhood'
)
update public.brotherhood_colors c
set status = 'archived', updated_at = now()
from target
where c.brotherhood_entity_id = target.id
  and c.status = 'published'
  and lower(c.color_name) not in ('negro', 'blanco', 'burdeos');

with target as (
  select id
  from public.entities
  where slug = 'hermandad-de-la-sed'
    and entity_type = 'brotherhood'
), palette(color_name, hex_value, color_role, sort_order, notes) as (
  values
    ('Negro'::text, '#111111'::text, 'primary'::text, 10::smallint, 'Paleta visual de la ficha; tono HEX editorial.'::text),
    ('Blanco'::text, '#FFFFFF'::text, 'identity'::text, 20::smallint, 'Color de apoyo y contraste de la identidad visual.'::text),
    ('Burdeos'::text, '#7A263A'::text, 'accent'::text, 30::smallint, 'Paleta visual de la ficha; tono HEX editorial.'::text)
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
  status = excluded.status,
  updated_at = now();
