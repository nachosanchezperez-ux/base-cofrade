-- Hilo Cofrade · San Esteban · colores identitarios
-- Azul celeste y crema, documentados en las Reglas y fichas oficiales.
-- Los valores HEX son aproximaciones de interfaz; no constan códigos oficiales publicados.

begin;

do $$
begin
  if not exists (
    select 1 from public.entities
    where slug = 'san-esteban' and entity_type = 'brotherhood' and status = 'published'
  ) then
    raise exception 'San Esteban: falta la Hermandad publicada';
  end if;
end
$$;

with seed(color_name, hex_value, color_role, sort_order, notes) as (
  values
    (
      'Azul celeste',
      '#8EC5E8',
      'primary',
      1::smallint,
      'Color identitario documentado en las Reglas y fichas oficiales de la Hermandad: antifaz, capa y botonadura de la túnica nazarena. Hex de interfaz aproximado; no consta un código HEX/Pantone oficial publicado en la fuente consultada.'
    ),
    (
      'Crema',
      '#F1E2BF',
      'secondary',
      2::smallint,
      'Color identitario documentado en las Reglas y fichas oficiales de la Hermandad: color de la túnica nazarena y presente junto al celeste en el cíngulo. Hex de interfaz aproximado; no consta un código HEX/Pantone oficial publicado en la fuente consultada.'
    )
)
insert into public.brotherhood_colors (
  brotherhood_entity_id, color_name, hex_value, color_role, sort_order, notes, status
)
select e.id, seed.color_name, seed.hex_value, seed.color_role, seed.sort_order, seed.notes, 'published'
from seed
join public.entities e on e.slug = 'san-esteban' and e.entity_type = 'brotherhood'
on conflict (brotherhood_entity_id, color_name) do update set
  hex_value = excluded.hex_value,
  color_role = excluded.color_role,
  sort_order = excluded.sort_order,
  notes = excluded.notes,
  status = excluded.status,
  updated_at = now();

do $$
declare
  brotherhood_id uuid;
begin
  select id into brotherhood_id
  from public.entities
  where slug = 'san-esteban' and entity_type = 'brotherhood';

  if (
    select count(*) from public.brotherhood_colors
    where brotherhood_entity_id = brotherhood_id
      and color_name in ('Azul celeste', 'Crema')
      and status = 'published'
  ) <> 2 then
    raise exception 'San Esteban: no quedaron registrados los dos colores';
  end if;
end
$$;

commit;
