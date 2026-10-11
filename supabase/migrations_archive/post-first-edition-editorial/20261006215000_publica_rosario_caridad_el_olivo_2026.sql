-- Agenda/ficha · Rosario Vespertino de Santa María de la Caridad · 10 octubre 2026
-- DML editorial idempotente. No modifica esquema.
-- Sincroniza producción con el cartel aportado el 2026-10-06.

begin;

insert into public.outings (
  brotherhood_entity_id, outing_type, character, title, outing_date, year,
  departure_time, return_time, municipality_id, origin_place_id, destination_place_id,
  reason, description, event_status, status, route_summary, public_notes,
  organizer_name, slug, origin_text, destination_text
)
select
  '21279e61-2c75-4757-88d0-f8422e7e29ec',
  'Rosario Vespertino','ordinary',
  'Rosario Vespertino de Santa María de la Caridad · 2026',
  date '2026-10-10',2026,time '18:45',time '21:30',
  '3e4c9f5f-52c3-4b42-a44f-219993f387f3',
  '9aab78c8-ea47-42d9-9d3c-d462de284649',
  '9aab78c8-ea47-42d9-9d3c-d462de284649',
  'Rosario Vespertino anual de Santa María de la Caridad.',
  'Rosario Vespertino de Santa María de la Caridad por las calles de la feligresía de San José de la Rinconada.',
  'announced','published',
  'Parroquia de Santa María Madre de Dios → Velázquez → Alberto Lista → Plaza Azorín → Pasaje peatonal de la Biblioteca Municipal → Luis de Góngora → Juan de la Cueva → Guadalcanal → Granada → Cultura → Valdés Leal → Juan de la Cueva → Maese Rodrigo → Alberto Lista → Velázquez → Parroquia de Santa María Madre de Dios.',
  'Salida a las 18:45 y entrada prevista a las 21:30.',
  'Agrupación Parroquial Humildad y Caridad – El Olivo',
  'rosario-vespertino-santa-maria-caridad-el-olivo-2026',
  'Parroquia de Santa María Madre de Dios',
  'Parroquia de Santa María Madre de Dios'
where not exists (
  select 1 from public.outings
  where slug='rosario-vespertino-santa-maria-caridad-el-olivo-2026'
);

update public.outings
set
  brotherhood_entity_id='21279e61-2c75-4757-88d0-f8422e7e29ec',
  outing_type='Rosario Vespertino',
  character='ordinary',
  title='Rosario Vespertino de Santa María de la Caridad · 2026',
  outing_date=date '2026-10-10',
  year=2026,
  departure_time=time '18:45',
  return_time=time '21:30',
  municipality_id='3e4c9f5f-52c3-4b42-a44f-219993f387f3',
  origin_place_id='9aab78c8-ea47-42d9-9d3c-d462de284649',
  destination_place_id='9aab78c8-ea47-42d9-9d3c-d462de284649',
  route_summary='Parroquia de Santa María Madre de Dios → Velázquez → Alberto Lista → Plaza Azorín → Pasaje peatonal de la Biblioteca Municipal → Luis de Góngora → Juan de la Cueva → Guadalcanal → Granada → Cultura → Valdés Leal → Juan de la Cueva → Maese Rodrigo → Alberto Lista → Velázquez → Parroquia de Santa María Madre de Dios.',
  public_notes='Salida a las 18:45 y entrada prevista a las 21:30.',
  organizer_name='Agrupación Parroquial Humildad y Caridad – El Olivo',
  origin_text='Parroquia de Santa María Madre de Dios',
  destination_text='Parroquia de Santa María Madre de Dios',
  updated_at=now()
where slug='rosario-vespertino-santa-maria-caridad-el-olivo-2026';

insert into public.outing_entities (outing_id, entity_id, role, notes)
select o.id,'ce1d7239-57ed-4a8a-9b60-3f5b8616993e','processional_image',
       'Santa María de la Caridad preside el Rosario Vespertino.'
from public.outings o
where o.slug='rosario-vespertino-santa-maria-caridad-el-olivo-2026'
on conflict (outing_id, entity_id, role) do nothing;

delete from public.outing_route_points
where outing_id=(select id from public.outings where slug='rosario-vespertino-santa-maria-caridad-el-olivo-2026' limit 1);

insert into public.outing_route_points
  (outing_id, sequence_no, point_type, label, planned_time, notes)
select o.id,v.sequence_no,v.point_type,v.label,v.planned_time,v.notes
from public.outings o
cross join (values
  (1,'place','Parroquia de Santa María Madre de Dios',time '18:45','Salida'),
  (2,'street','Velázquez',null::time,null::text),
  (3,'street','Alberto Lista',null::time,null::text),
  (4,'place','Plaza Azorín',null::time,null::text),
  (5,'place','Pasaje peatonal de la Biblioteca Municipal',null::time,null::text),
  (6,'street','Luis de Góngora',null::time,null::text),
  (7,'street','Juan de la Cueva',null::time,null::text),
  (8,'street','Guadalcanal',null::time,null::text),
  (9,'street','Granada',null::time,null::text),
  (10,'street','Cultura',null::time,null::text),
  (11,'street','Valdés Leal',null::time,null::text),
  (12,'street','Juan de la Cueva',null::time,null::text),
  (13,'street','Maese Rodrigo',null::time,null::text),
  (14,'street','Alberto Lista',null::time,null::text),
  (15,'street','Velázquez',null::time,null::text),
  (16,'place','Parroquia de Santa María Madre de Dios',time '21:30','Entrada')
) as v(sequence_no,point_type,label,planned_time,notes)
where o.slug='rosario-vespertino-santa-maria-caridad-el-olivo-2026';

delete from public.outing_schedule_items
where outing_id=(select id from public.outings where slug='rosario-vespertino-santa-maria-caridad-el-olivo-2026' limit 1);

insert into public.outing_schedule_items
  (outing_id,sequence_no,label,item_date,item_time,time_text,place_id,place_text,notes)
select o.id,v.sequence_no,v.label,date '2026-10-10',v.item_time,null,
       '9aab78c8-ea47-42d9-9d3c-d462de284649',
       'Parroquia de Santa María Madre de Dios',v.notes
from public.outings o
cross join (values
  (1,'Salida del Rosario Vespertino',time '18:45','Salida de Santa María de la Caridad.'),
  (2,'Entrada',time '21:30','Entrada prevista en la Parroquia de Santa María Madre de Dios.')
) as v(sequence_no,label,item_time,notes)
where o.slug='rosario-vespertino-santa-maria-caridad-el-olivo-2026';

insert into public.sources
  (name,url,source_type,author_or_publisher,publication_date,accessed_at,notes)
select
  'Recorrido del Rosario Vespertino de Santa María de la Caridad · 10 de octubre de 2026',
  null,'Aportación directa',
  'Agrupación Parroquial Humildad y Caridad – El Olivo',
  date '2026-10-06',date '2026-10-06',
  'Cartel aportado directamente. Confirma salida 18:45, entrada 21:30 y recorrido completo.'
where not exists (
  select 1 from public.sources
  where name='Recorrido del Rosario Vespertino de Santa María de la Caridad · 10 de octubre de 2026'
);

insert into public.source_links (source_id,outing_id,scope,notes)
select s.id,o.id,'outing','Horario y recorrido del Rosario Vespertino de 2026.'
from public.sources s
join public.outings o on o.slug='rosario-vespertino-santa-maria-caridad-el-olivo-2026'
where s.name='Recorrido del Rosario Vespertino de Santa María de la Caridad · 10 de octubre de 2026'
  and not exists (
    select 1 from public.source_links sl
    where sl.source_id=s.id and sl.outing_id=o.id
  );

commit;
