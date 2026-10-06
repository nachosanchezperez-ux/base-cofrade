-- Agenda/ficha · Pilar de San Pedro · 12 octubre 2026
-- DML editorial idempotente. No modifica esquema.
-- Sincroniza producción con el plano de recorrido aportado el 2026-10-06.

begin;

update public.outings
set
  departure_time = time '17:50',
  return_time = time '22:00',
  route_summary = 'Real Parroquia de San Pedro Apóstol → Santa Ángela de la Cruz → Gerona → Amparo → Pozo Santo → Jerónimo Hernández → Regina → Plaza de la Encarnación → José Luis Luque → Santillana → Ortiz de Zúñiga → Plaza Cristo de Burgos → Real Parroquia de San Pedro Apóstol.',
  public_notes = 'Salida a las 17:50. Entrada aproximada a las 22:00. Recorrido actualizado conforme al plano de itinerario aportado para la procesión del 12 de octubre de 2026.',
  origin_text = 'Real Parroquia de San Pedro Apóstol',
  destination_text = 'Real Parroquia de San Pedro Apóstol',
  updated_at = now()
where slug = 'gloria-pilar-2026';

delete from public.outing_route_points
where outing_id = (
  select id from public.outings where slug = 'gloria-pilar-2026' limit 1
);

insert into public.outing_route_points
  (outing_id, sequence_no, point_type, label, planned_time, notes)
select o.id, v.sequence_no, v.point_type, v.label, v.planned_time, v.notes
from public.outings o
cross join (values
  (1,  'place',  'Real Parroquia de San Pedro Apóstol', time '17:50', 'Salida'),
  (2,  'street', 'Santa Ángela de la Cruz',             null::time,    null::text),
  (3,  'street', 'Gerona',                              null::time,    null::text),
  (4,  'street', 'Amparo',                              null::time,    null::text),
  (5,  'street', 'Pozo Santo',                          null::time,    null::text),
  (6,  'street', 'Jerónimo Hernández',                  null::time,    null::text),
  (7,  'street', 'Regina',                              null::time,    null::text),
  (8,  'place',  'Plaza de la Encarnación',             null::time,    null::text),
  (9,  'street', 'José Luis Luque',                     null::time,    null::text),
  (10, 'street', 'Santillana',                          null::time,    null::text),
  (11, 'street', 'Ortiz de Zúñiga',                     null::time,    null::text),
  (12, 'place',  'Plaza Cristo de Burgos',              null::time,    null::text),
  (13, 'place',  'Real Parroquia de San Pedro Apóstol', time '22:00', 'Entrada aproximada')
) as v(sequence_no, point_type, label, planned_time, notes)
where o.slug = 'gloria-pilar-2026';

delete from public.outing_schedule_items
where outing_id = (
  select id from public.outings where slug = 'gloria-pilar-2026' limit 1
);

insert into public.outing_schedule_items
  (outing_id, sequence_no, label, item_date, item_time, time_text, place_text, notes)
select o.id, v.sequence_no, v.label, date '2026-10-12', v.item_time, v.time_text, v.place_text, v.notes
from public.outings o
cross join (values
  (1, 'Salida procesional', time '17:50', null::text, 'Real Parroquia de San Pedro Apóstol', 'Hora indicada en el plano del recorrido.'),
  (2, 'Entrada', time '22:00', 'Aproximadamente a las 22:00', 'Real Parroquia de San Pedro Apóstol', 'Hora aproximada indicada en el plano del recorrido.')
) as v(sequence_no, label, item_time, time_text, place_text, notes)
where o.slug = 'gloria-pilar-2026';

insert into public.sources
  (name, url, source_type, author_or_publisher, publication_date, accessed_at, notes)
select
  'Plano del recorrido · María Santísima del Pilar de San Pedro · 12 de octubre de 2026',
  null,
  'Aportación directa',
  null,
  date '2026-10-06',
  date '2026-10-06',
  'Plano del recorrido aportado directamente para actualizar la agenda y la ficha de la Hermandad del Pilar de San Pedro. Incluye salida 17:50, entrada aproximada 22:00 y calles del itinerario.'
where not exists (
  select 1
  from public.sources
  where name = 'Plano del recorrido · María Santísima del Pilar de San Pedro · 12 de octubre de 2026'
);

insert into public.source_links (source_id, outing_id, scope, notes)
select
  s.id,
  o.id,
  'outing',
  'Fuente del horario y recorrido de la procesión del 12 de octubre de 2026.'
from public.sources s
join public.outings o on o.slug = 'gloria-pilar-2026'
where s.name = 'Plano del recorrido · María Santísima del Pilar de San Pedro · 12 de octubre de 2026'
  and not exists (
    select 1
    from public.source_links sl
    where sl.source_id = s.id and sl.outing_id = o.id
  );

commit;
