begin;

with targets as (
  select id, slug
  from public.entities
  where entity_type = 'band'
    and slug in (
      'agrupacion-musical-pasion-de-linares',
      'banda-municipal-fernando-guerrero-los-palacios',
      'agrupacion-musical-la-estrella-jaen',
      'banda-musica-municipal-coria-del-rio',
      'agrupacion-musical-polillas-cadiz'
    )
)
update public.band_colors bc
set status = 'archived', updated_at = now()
from targets t
where bc.band_entity_id = t.id
  and bc.status = 'published';

insert into public.band_colors (
  band_entity_id,
  color_name,
  hex_value,
  color_role,
  sort_order,
  notes,
  status,
  updated_at
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
  ('agrupacion-musical-pasion-de-linares', 'Negro', '#111111', 'primary', 10),
  ('agrupacion-musical-pasion-de-linares', 'Rojo', '#B01B32', 'secondary', 20),
  ('agrupacion-musical-pasion-de-linares', 'Plata', '#B8BDC4', 'accent', 30),
  ('banda-municipal-fernando-guerrero-los-palacios', 'Negro', '#111111', 'primary', 10),
  ('banda-municipal-fernando-guerrero-los-palacios', 'Dorado', '#C5A253', 'secondary', 20),
  ('banda-municipal-fernando-guerrero-los-palacios', 'Blanco', '#FFFFFF', 'accent', 30),
  ('agrupacion-musical-la-estrella-jaen', 'Negro', '#111111', 'primary', 10),
  ('agrupacion-musical-la-estrella-jaen', 'Burdeos', '#7A263A', 'secondary', 20),
  ('agrupacion-musical-la-estrella-jaen', 'Plata', '#B8BDC4', 'accent', 30),
  ('banda-musica-municipal-coria-del-rio', 'Negro', '#111111', 'primary', 10),
  ('banda-musica-municipal-coria-del-rio', 'Dorado', '#C5A253', 'secondary', 20),
  ('agrupacion-musical-polillas-cadiz', 'Rojo', '#B01B32', 'primary', 10),
  ('agrupacion-musical-polillas-cadiz', 'Negro', '#111111', 'secondary', 20),
  ('agrupacion-musical-polillas-cadiz', 'Blanco', '#FFFFFF', 'accent', 30)
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
      when 'agrupacion-musical-pasion-de-linares' then '#111111'
      when 'banda-municipal-fernando-guerrero-los-palacios' then '#111111'
      when 'agrupacion-musical-la-estrella-jaen' then '#111111'
      when 'banda-musica-municipal-coria-del-rio' then '#111111'
      when 'agrupacion-musical-polillas-cadiz' then '#B01B32'
    end,
    secondary_color = case e.slug
      when 'agrupacion-musical-pasion-de-linares' then '#B01B32'
      when 'banda-municipal-fernando-guerrero-los-palacios' then '#C5A253'
      when 'agrupacion-musical-la-estrella-jaen' then '#7A263A'
      when 'banda-musica-municipal-coria-del-rio' then '#C5A253'
      when 'agrupacion-musical-polillas-cadiz' then '#111111'
    end
from public.entities e
where b.entity_id = e.id
  and e.slug in (
    'agrupacion-musical-pasion-de-linares',
    'banda-municipal-fernando-guerrero-los-palacios',
    'agrupacion-musical-la-estrella-jaen',
    'banda-musica-municipal-coria-del-rio',
    'agrupacion-musical-polillas-cadiz'
  );

commit;
