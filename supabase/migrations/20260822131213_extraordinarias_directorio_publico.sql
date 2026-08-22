-- Hilo Cofrade · Directorio público de extraordinarias
--
-- Objetivos:
-- 1) Añadir un slug estable a las salidas para futuras URLs públicas.
-- 2) Mantener la Home alimentada desde outings, incorporando provincia y slug.
-- 3) Exponer una vista pública de directorio para próximas y celebradas.
-- 4) Conservar RLS mediante security_invoker.

alter table public.outings
  add column if not exists slug text;

comment on column public.outings.slug is
  'Slug estable de la salida para URLs públicas y navegación editorial.';

create unique index if not exists outings_slug_unique_idx
  on public.outings(slug)
  where slug is not null;

update public.outings
set slug = 'virgen-angustias-aznalcazar-2026'
where id = 'a2208260-0000-0000-0000-000000000002'
  and slug is null;

update public.outings
set slug = 'nuestro-padre-jesus-preso-moriles-2026'
where id = 'b2300000-0000-0000-0000-000000000001'
  and slug is null;

create or replace view public.upcoming_extraordinary_outings as
select
  o.id,
  o.brotherhood_entity_id,
  coalesce(be.name, o.organizer_name) as brotherhood_name,
  o.organizer_name,
  o.title,
  o.outing_type,
  o.outing_date,
  o.departure_time,
  o.return_date,
  o.return_time,
  o.reason,
  o.municipality_id,
  m.name as municipality_name,
  o.origin_place_id,
  op.name as origin_place_name,
  o.destination_place_id,
  dp.name as destination_place_name,
  o.route_summary,
  o.hero_image_path,
  o.hero_image_alt,
  o.hero_image_credit,
  o.slug,
  m.province
from public.outings o
left join public.entities be on be.id = o.brotherhood_entity_id
left join public.municipalities m on m.id = o.municipality_id
left join public.places op on op.id = o.origin_place_id
left join public.places dp on dp.id = o.destination_place_id
where o.status = 'published'
  and o.event_status = 'announced'
  and o.character = 'extraordinary'
  and o.outing_date >= current_date
order by o.outing_date, o.departure_time nulls last;

alter view public.upcoming_extraordinary_outings
  set (security_invoker = true);

grant select on public.upcoming_extraordinary_outings to anon, authenticated;

create or replace view public.extraordinary_outings_directory
with (security_invoker = true) as
select
  o.id,
  o.slug,
  o.brotherhood_entity_id,
  coalesce(be.name, o.organizer_name) as brotherhood_name,
  o.organizer_name,
  o.title,
  o.outing_type,
  o.outing_date,
  o.year,
  o.departure_time,
  o.return_date,
  o.return_time,
  o.reason,
  o.description,
  o.public_notes,
  o.event_status,
  o.municipality_id,
  m.name as municipality_name,
  m.province,
  o.origin_place_id,
  op.name as origin_place_name,
  o.destination_place_id,
  dp.name as destination_place_name,
  o.route_summary,
  o.hero_image_path,
  o.hero_image_alt,
  o.hero_image_credit
from public.outings o
left join public.entities be on be.id = o.brotherhood_entity_id
left join public.municipalities m on m.id = o.municipality_id
left join public.places op on op.id = o.origin_place_id
left join public.places dp on dp.id = o.destination_place_id
where o.status = 'published'
  and o.character = 'extraordinary';

grant select on public.extraordinary_outings_directory to anon, authenticated;
