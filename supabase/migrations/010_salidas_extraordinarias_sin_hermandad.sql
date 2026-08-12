-- Hilo Cofrade · Salidas extraordinarias sin hermandad vinculada
-- Migración 010
--
-- Permite crear y publicar una salida extraordinaria aunque la hermandad
-- todavía no tenga ficha activa en Hilo Cofrade. La vinculación puede hacerse
-- después sin recrear el registro ni perder recorrido, horarios, imágenes,
-- música o fuentes.

-- -----------------------------------------------------------------------------
-- SALIDAS INDEPENDIENTES
-- -----------------------------------------------------------------------------

alter table public.outings
  alter column brotherhood_entity_id drop not null;

alter table public.outings
  add column if not exists organizer_name text,
  add column if not exists organizer_notes text;

comment on column public.outings.organizer_name is
  'Nombre libre de la hermandad, corporación o entidad organizadora cuando todavía no existe una ficha vinculada en Hilo Cofrade.';

comment on column public.outings.organizer_notes is
  'Notas internas o públicas sobre la entidad organizadora no vinculada.';

-- Cuando posteriormente exista la hermandad en Hilo Cofrade, basta con asignar
-- brotherhood_entity_id. organizer_name puede mantenerse como referencia histórica
-- o vaciarse en la interfaz; no es necesario duplicar la salida.

-- -----------------------------------------------------------------------------
-- VISTAS: incluir también salidas sin hermandad vinculada
-- -----------------------------------------------------------------------------

-- Las vistas dependientes se recrean para sustituir INNER JOIN por LEFT JOIN.
drop view if exists public.today_calendar_items;
drop view if exists public.upcoming_calendar_items;
drop view if exists public.calendar_items;
drop view if exists public.calendar_outings;
drop view if exists public.upcoming_extraordinary_outings;

create view public.calendar_outings as
select
  o.id as calendar_item_id,
  'outing'::text as item_type,
  o.brotherhood_entity_id,
  coalesce(be.name, o.organizer_name) as brotherhood_name,
  coalesce(o.title, o.outing_type) as title,
  o.outing_type as subtype,
  o.character,
  o.outing_date as item_date,
  o.departure_time as item_time,
  o.origin_place_id as place_id,
  p.name as place_name,
  o.event_status,
  o.reason
from public.outings o
left join public.entities be on be.id = o.brotherhood_entity_id
left join public.places p on p.id = o.origin_place_id
where o.status = 'published';

create view public.calendar_items as
select
  ccd.calendar_item_id,
  ccd.item_type,
  ccd.brotherhood_entity_id,
  ccd.brotherhood_name,
  ccd.title,
  ccd.subtype,
  null::text as character,
  ccd.item_date,
  ccd.item_time,
  ccd.place_id,
  ccd.place_name,
  ccd.event_status
from public.calendar_cult_days ccd

union all

select
  co.calendar_item_id,
  co.item_type,
  co.brotherhood_entity_id,
  co.brotherhood_name,
  co.title,
  co.subtype,
  co.character,
  co.item_date,
  co.item_time,
  co.place_id,
  co.place_name,
  co.event_status
from public.calendar_outings co;

create view public.today_calendar_items as
select *
from public.calendar_items
where item_date = current_date
  and event_status <> 'cancelled'
order by item_time nulls last, title;

create view public.upcoming_calendar_items as
select *
from public.calendar_items
where item_date >= current_date
  and event_status = 'announced'
order by item_date, item_time nulls last, title;

create view public.upcoming_extraordinary_outings as
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
  o.route_summary
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

-- -----------------------------------------------------------------------------
-- NOTA DE INTERFAZ
-- -----------------------------------------------------------------------------
-- En administración:
--   Hermandad vinculada: opcional
--   Organiza / corporación: texto libre
--   Localidad: independiente de la existencia de ficha de hermandad
--
-- Al crear la ficha de la hermandad más adelante, se actualiza
-- brotherhood_entity_id y la salida aparecerá automáticamente en su histórico.
