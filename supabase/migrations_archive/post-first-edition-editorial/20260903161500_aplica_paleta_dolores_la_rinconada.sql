-- Aplica la identidad visual de la Hermandad de los Dolores de La Rinconada.
-- Morado como base, blanco de apoyo y dorado como acento secundario.

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
  (
    'f7f7ad08-54b5-4e85-b2a6-5a2a5d5e80bf',
    'Morado',
    '#5B2C83',
    'primary',
    10,
    'Color principal de identidad visual de la Hermandad.',
    'published'
  ),
  (
    'f7f7ad08-54b5-4e85-b2a6-5a2a5d5e80bf',
    'Blanco',
    '#FFFFFF',
    'identity',
    20,
    'Color claro de apoyo y contraste.',
    'published'
  ),
  (
    'f7f7ad08-54b5-4e85-b2a6-5a2a5d5e80bf',
    'Dorado',
    '#B08D3C',
    'secondary',
    30,
    'Acento dorado para detalles de la identidad visual.',
    'published'
  )
on conflict (brotherhood_entity_id, color_name)
do update set
  hex_value = excluded.hex_value,
  color_role = excluded.color_role,
  sort_order = excluded.sort_order,
  notes = excluded.notes,
  status = 'published',
  updated_at = now();
