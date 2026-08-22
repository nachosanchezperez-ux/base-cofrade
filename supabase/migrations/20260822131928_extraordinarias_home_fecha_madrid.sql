-- Hilo Cofrade · Fecha de extraordinarias de Home en horario de Madrid

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
  and o.outing_date >= (now() at time zone 'Europe/Madrid')::date
  and m.province = 'Sevilla'
order by o.outing_date, o.departure_time nulls last;

alter view public.upcoming_extraordinary_outings
  set (security_invoker = true);

grant select on public.upcoming_extraordinary_outings to anon, authenticated;
