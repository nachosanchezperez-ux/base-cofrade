-- La ficha pública debe mostrar solo "1996" para evitar el desborde móvil.
-- Se conserva la nota interna que aclara que 1996 acredita la grabación,
-- no necesariamente el año exacto de composición.

update public.marches
set
  composition_year = null,
  composition_date_text = '1996'
where entity_id = (
  select id
  from public.entities
  where entity_type = 'march'
    and slug = 'divina-pastora-de-cantillana-pedro-manuel-pacheco'
  limit 1
);
