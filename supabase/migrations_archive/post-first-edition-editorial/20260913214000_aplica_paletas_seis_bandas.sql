begin;

do $$
declare
  found_count integer;
begin
  select count(*) into found_count
  from public.entities
  where entity_type = 'band'
    and slug in (
      'agrupacion-musical-santa-cecilia-sevilla',
      'agrupacion-musical-la-sentencia-jerez',
      'banda-musica-amueci',
      'agrupacion-musical-santa-maria-esperanza-sevilla',
      'banda-cornetas-tambores-jesus-nazareno-huelva',
      'agrupacion-musical-maria-santisima-de-las-angustias-coronada'
    );

  if found_count <> 6 then
    raise exception 'Se esperaban 6 bandas canónicas y se encontraron %', found_count;
  end if;
end
$$;

with targets as (
  select id, slug
  from public.entities
  where entity_type = 'band'
    and slug in (
      'agrupacion-musical-santa-cecilia-sevilla',
      'agrupacion-musical-la-sentencia-jerez',
      'banda-musica-amueci',
      'agrupacion-musical-santa-maria-esperanza-sevilla',
      'banda-cornetas-tambores-jesus-nazareno-huelva',
      'agrupacion-musical-maria-santisima-de-las-angustias-coronada'
    )
)
update public.band_colors bc
set status = 'archived', updated_at = now()
from targets t
where bc.band_entity_id = t.id
  and bc.status = 'published';

insert into public.band_colors (
  band_entity_id, color_name, hex_value, color_role, sort_order, notes, status, updated_at
)
select
  e.id,
  v.color_name,
  v.hex_value,
  v.color_role,
  v.sort_order,
  'Paleta corporativa indicada para ' || e.name,
  'published',
  now()
from public.entities e
join (values
  ('agrupacion-musical-santa-cecilia-sevilla', 'Azul', '#234A78', 'primary', 10),
  ('agrupacion-musical-santa-cecilia-sevilla', 'Plata', '#B8BDC4', 'secondary', 20),
  ('agrupacion-musical-la-sentencia-jerez', 'Verde oscuro', '#123B2A', 'primary', 10),
  ('agrupacion-musical-la-sentencia-jerez', 'Dorado', '#C5A253', 'secondary', 20),
  ('banda-musica-amueci', 'Azul oscuro', '#0B2341', 'primary', 10),
  ('banda-musica-amueci', 'Plata', '#B8BDC4', 'secondary', 20),
  ('agrupacion-musical-santa-maria-esperanza-sevilla', 'Negro', '#111111', 'primary', 10),
  ('agrupacion-musical-santa-maria-esperanza-sevilla', 'Dorado', '#C5A253', 'secondary', 20),
  ('agrupacion-musical-santa-maria-esperanza-sevilla', 'Rojo', '#B01B32', 'accent', 30),
  ('banda-cornetas-tambores-jesus-nazareno-huelva', 'Negro', '#111111', 'primary', 10),
  ('banda-cornetas-tambores-jesus-nazareno-huelva', 'Morado', '#5B2C83', 'secondary', 20),
  ('banda-cornetas-tambores-jesus-nazareno-huelva', 'Blanco', '#FFFFFF', 'accent', 30),
  ('agrupacion-musical-maria-santisima-de-las-angustias-coronada', 'Morado', '#5B2C6F', 'primary', 10),
  ('agrupacion-musical-maria-santisima-de-las-angustias-coronada', 'Dorado', '#C5A253', 'secondary', 20),
  ('agrupacion-musical-maria-santisima-de-las-angustias-coronada', 'Blanco', '#FFFFFF', 'accent', 30)
) as v(slug, color_name, hex_value, color_role, sort_order)
  on v.slug = e.slug
where e.entity_type = 'band'
on conflict (band_entity_id, color_name) do update
set hex_value = excluded.hex_value,
    color_role = excluded.color_role,
    sort_order = excluded.sort_order,
    notes = excluded.notes,
    status = 'published',
    updated_at = now();

update public.bands b
set primary_color = case e.slug
      when 'agrupacion-musical-santa-cecilia-sevilla' then '#234A78'
      when 'agrupacion-musical-la-sentencia-jerez' then '#123B2A'
      when 'banda-musica-amueci' then '#0B2341'
      when 'agrupacion-musical-santa-maria-esperanza-sevilla' then '#111111'
      when 'banda-cornetas-tambores-jesus-nazareno-huelva' then '#111111'
      when 'agrupacion-musical-maria-santisima-de-las-angustias-coronada' then '#5B2C6F'
    end,
    secondary_color = case e.slug
      when 'agrupacion-musical-santa-cecilia-sevilla' then '#B8BDC4'
      when 'agrupacion-musical-la-sentencia-jerez' then '#C5A253'
      when 'banda-musica-amueci' then '#B8BDC4'
      when 'agrupacion-musical-santa-maria-esperanza-sevilla' then '#C5A253'
      when 'banda-cornetas-tambores-jesus-nazareno-huelva' then '#5B2C83'
      when 'agrupacion-musical-maria-santisima-de-las-angustias-coronada' then '#C5A253'
    end
from public.entities e
where b.entity_id = e.id
  and e.slug in (
    'agrupacion-musical-santa-cecilia-sevilla',
    'agrupacion-musical-la-sentencia-jerez',
    'banda-musica-amueci',
    'agrupacion-musical-santa-maria-esperanza-sevilla',
    'banda-cornetas-tambores-jesus-nazareno-huelva',
    'agrupacion-musical-maria-santisima-de-las-angustias-coronada'
  );

-- Los Gitanos principal ya estaba publicado con Morado #5B2C6F,
-- Dorado #C5A253 y Blanco #FFFFFF; se conserva sin reescritura.

commit;
