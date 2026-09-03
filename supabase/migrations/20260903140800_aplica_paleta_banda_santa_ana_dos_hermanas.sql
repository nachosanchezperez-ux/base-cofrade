-- Aplica la identidad visual de la Banda de Música Santa Ana de Dos Hermanas.
-- Los HEX son tonos editoriales para la presentación de la ficha, no una declaración de valores institucionales oficiales.

with target as (
  select id
  from public.entities
  where slug = 'banda-musica-santa-ana-dos-hermanas'
    and entity_type = 'band'
)
update public.bands b
set
  primary_color = '#123B2A',
  secondary_color = '#111111'
from target
where b.entity_id = target.id;

with target as (
  select id
  from public.entities
  where slug = 'banda-musica-santa-ana-dos-hermanas'
    and entity_type = 'band'
)
update public.band_colors c
set status = 'archived', updated_at = now()
from target
where c.band_entity_id = target.id
  and c.status = 'published'
  and lower(c.color_name) not in ('verde oscuro', 'plata', 'negro');

with target as (
  select id
  from public.entities
  where slug = 'banda-musica-santa-ana-dos-hermanas'
    and entity_type = 'band'
), palette(color_name, hex_value, color_role, sort_order, notes) as (
  values
    ('Verde oscuro'::text, '#123B2A'::text, 'primary'::text, 10::smallint, 'Color principal de la identidad visual; tono HEX editorial.'::text),
    ('Plata'::text, '#B8BDC4'::text, 'accent'::text, 20::smallint, 'Acento metálico para detalles y elementos destacados.'::text),
    ('Negro'::text, '#111111'::text, 'secondary'::text, 30::smallint, 'Color de apoyo y contraste visual.'::text)
)
insert into public.band_colors (
  band_entity_id,
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
on conflict (band_entity_id, color_name)
do update set
  hex_value = excluded.hex_value,
  color_role = excluded.color_role,
  sort_order = excluded.sort_order,
  notes = excluded.notes,
  status = excluded.status,
  updated_at = now();
