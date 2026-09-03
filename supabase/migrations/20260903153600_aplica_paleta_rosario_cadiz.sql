-- Aplica la identidad visual editorial de Rosario de Cádiz.
-- El azul oscuro actúa como base, el blanco como apoyo y el rojo queda reservado a detalles.

with target as (
  select id
  from public.entities
  where slug = 'banda-cornetas-tambores-rosario-cadiz'
    and entity_type = 'band'
)
update public.band_colors c
set status = 'archived', updated_at = now()
from target
where c.band_entity_id = target.id
  and c.status = 'published'
  and lower(c.color_name) not in ('azul oscuro', 'blanco', 'rojo');

with target as (
  select id
  from public.entities
  where slug = 'banda-cornetas-tambores-rosario-cadiz'
    and entity_type = 'band'
), palette(color_name, hex_value, color_role, sort_order, notes) as (
  values
    ('Azul oscuro'::text, '#1E3A5F'::text, 'primary'::text, 10::smallint, 'Color principal de la identidad visual de la ficha.'::text),
    ('Blanco'::text, '#FFFFFF'::text, 'identity'::text, 20::smallint, 'Color de apoyo y contraste de la identidad visual.'::text),
    ('Rojo'::text, '#B01B32'::text, 'accent'::text, 30::smallint, 'Acento reservado para detalles y elementos destacados.'::text)
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

update public.bands b
set primary_color = '#1E3A5F',
    secondary_color = '#1E3A5F'
where b.entity_id = (
  select id
  from public.entities
  where slug = 'banda-cornetas-tambores-rosario-cadiz'
    and entity_type = 'band'
);
