-- Santiponce · Rosario Coronada · 10 octubre 2026
-- DML editorial idempotente. No modifica esquema.
-- Corrige la hora de salida y añade entrada, referencias horarias y aparcamiento
-- conforme al cartel oficial aportado el 2026-10-07.

begin;

update public.outings
set
  departure_time = time '19:30',
  return_time = time '00:00',
  return_date = date '2026-10-11',
  route_summary = 'Avenida de Extremadura → Manuel González Rodríguez → Adriano → Juan Sebastián Elcano → Trajano → Manuel González Rodríguez → Alcalde Cipriano Moreno → Plaza de la Constitución → Clavel → San Antonio → Eduardo Ybarra → Mesón → Real → Plaza de la Constitución → Las Musas → Avenida de Extremadura.',
  public_notes = 'Salida a las 19:30 y entrada prevista a las 00:00 del 11 de octubre. Referencias horarias oficiales: Adriano 20:00; Manuel González Rodríguez (vuelta) 21:05; Alcalde Cipriano Moreno 21:25; San Antonio 21:50; Real 22:30; Las Musas 23:20. Acompañamiento musical: Banda Municipal de Música de La Puebla del Río. Zonas de aparcamiento recomendadas: recinto ferial y zonas aledañas.',
  updated_at = now()
where slug='santiponce-rosario-coronada-2026-10-10';

delete from public.outing_route_points
where outing_id=(select id from public.outings where slug='santiponce-rosario-coronada-2026-10-10' limit 1);

insert into public.outing_route_points
  (outing_id, sequence_no, point_type, label, planned_time, notes)
select o.id,v.sequence_no,v.point_type,v.label,v.planned_time,v.notes
from public.outings o
cross join (values
  (1,'street','Avenida de Extremadura',time '19:30','Salida'),
  (2,'street','Manuel González Rodríguez',null::time,null::text),
  (3,'street','Adriano',time '20:00',null::text),
  (4,'street','Juan Sebastián Elcano',null::time,null::text),
  (5,'street','Trajano',null::time,null::text),
  (6,'street','Manuel González Rodríguez',time '21:05','Vuelta'),
  (7,'street','Alcalde Cipriano Moreno',time '21:25',null::text),
  (8,'place','Plaza de la Constitución',null::time,null::text),
  (9,'street','Clavel',null::time,null::text),
  (10,'street','San Antonio',time '21:50',null::text),
  (11,'street','Eduardo Ybarra',null::time,null::text),
  (12,'street','Mesón',null::time,null::text),
  (13,'street','Real',time '22:30',null::text),
  (14,'place','Plaza de la Constitución',null::time,null::text),
  (15,'street','Las Musas',time '23:20',null::text),
  (16,'street','Avenida de Extremadura',time '00:00','Entrada')
) as v(sequence_no,point_type,label,planned_time,notes)
where o.slug='santiponce-rosario-coronada-2026-10-10';

delete from public.outing_schedule_items
where outing_id=(select id from public.outings where slug='santiponce-rosario-coronada-2026-10-10' limit 1);

insert into public.outing_schedule_items
  (outing_id, sequence_no, label, item_date, item_time, time_text, place_text, notes)
select o.id,v.sequence_no,v.label,v.item_date,v.item_time,null,v.place_text,v.notes
from public.outings o
cross join (values
  (1,'Salida',date '2026-10-10',time '19:30','Avenida de Extremadura','Inicio de la procesión de gloria.'),
  (2,'Adriano',date '2026-10-10',time '20:00','Adriano',null::text),
  (3,'Manuel González Rodríguez · vuelta',date '2026-10-10',time '21:05','Manuel González Rodríguez','Referencia horaria en el tramo de vuelta.'),
  (4,'Alcalde Cipriano Moreno',date '2026-10-10',time '21:25','Alcalde Cipriano Moreno',null::text),
  (5,'San Antonio',date '2026-10-10',time '21:50','San Antonio',null::text),
  (6,'Real',date '2026-10-10',time '22:30','Real',null::text),
  (7,'Las Musas',date '2026-10-10',time '23:20','Las Musas',null::text),
  (8,'Entrada',date '2026-10-11',time '00:00','Avenida de Extremadura','Entrada prevista.')
) as v(sequence_no,label,item_date,item_time,place_text,notes)
where o.slug='santiponce-rosario-coronada-2026-10-10';

insert into public.sources
  (name,url,source_type,author_or_publisher,publication_date,accessed_at,notes)
select
  'Horarios y recorrido · Procesión de Gloria de Nuestra Señora del Rosario Coronada · Santiponce · 2026',
  null,
  'Red social oficial',
  'Hermandad Sacramental del Rosario de Santiponce',
  date '2026-10-06',
  date '2026-10-07',
  'Cartel oficial aportado directamente. Corrige la salida a las 19:30, fija entrada a las 00:00 y añade referencias horarias y zonas de aparcamiento.'
where not exists (
  select 1 from public.sources
  where name='Horarios y recorrido · Procesión de Gloria de Nuestra Señora del Rosario Coronada · Santiponce · 2026'
);

insert into public.source_links (source_id,outing_id,scope,notes)
select s.id,o.id,'outing','Fuente oficial prioritaria para horarios, itinerario y avisos organizativos de la procesión del 10 de octubre de 2026.'
from public.sources s
join public.outings o on o.slug='santiponce-rosario-coronada-2026-10-10'
where s.name='Horarios y recorrido · Procesión de Gloria de Nuestra Señora del Rosario Coronada · Santiponce · 2026'
  and not exists (
    select 1 from public.source_links sl
    where sl.source_id=s.id and sl.outing_id=o.id
  );

commit;
