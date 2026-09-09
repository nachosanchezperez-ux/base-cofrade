-- Aplica la identidad visual editorial de la Banda de Música de la Oliva de Salteras.
-- Sustituye la paleta anterior basada en el emblema por la identidad definida para la ficha.

with target as (
  select id
  from public.entities
  where slug = 'banda-musica-oliva-salteras'
    and entity_type = 'band'
)
update public.band_colors c
set status = 'archived', updated_at = now()
from target
where c.band_entity_id = target.id
  and c.status = 'published'
  and lower(c.color_name) not in ('azul claro', 'negro', 'blanco');

with target as (
  select id
  from public.entities
  where slug = 'banda-musica-oliva-salteras'
    and entity_type = 'band'
), palette(color_name, hex_value, color_role, sort_order, notes) as (
  values
    ('Azul claro'::text, '#66B8D4'::text, 'primary'::text, 10::smallint, 'Paleta visual editorial de la ficha.'::text),
    ('Blanco'::text, '#FFFFFF'::text, 'accent'::text, 20::smallint, 'Color de apoyo y contraste de la identidad visual.'::text),
    ('Negro'::text, '#111111'::text, 'secondary'::text, 30::smallint, 'Color de contraste de la identidad visual.'::text)
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
set primary_color = '#66B8D4',
    secondary_color = '#111111'
where b.entity_id = (
  select id
  from public.entities
  where slug = 'banda-musica-oliva-salteras'
    and entity_type = 'band'
);
