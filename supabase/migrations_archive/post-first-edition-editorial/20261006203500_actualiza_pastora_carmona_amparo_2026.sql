-- Agenda/fichas · Divina Pastora de Carmona y Amparo de Sevilla · 2026
-- DML editorial idempotente. No modifica esquema.
-- Sincroniza producción con los carteles aportados el 2026-10-06.

begin;

-- ---------------------------------------------------------------------------
-- CARMONA · DIVINA PASTORA DE LAS ALMAS · 10 OCTUBRE
-- ---------------------------------------------------------------------------

insert into public.outings (
  brotherhood_entity_id, outing_type, character, title, outing_date, year,
  departure_time, return_time, municipality_id, origin_place_id, destination_place_id,
  reason, description, event_status, status, route_summary, public_notes,
  organizer_name, slug, origin_text, destination_text
)
select
  'c0160035-0307-4000-8000-000000000007',
  'Procesión de Gloria',
  'ordinary',
  'Procesión de la Divina Pastora de las Almas · 2026',
  date '2026-10-10',
  2026,
  time '19:00',
  null,
  'bf024af2-3eda-4989-b1b5-0a723dcf9cb4',
  'c0160035-0206-4000-8000-000000000006',
  'c0160035-0206-4000-8000-000000000006',
  'Procesión anual de la Divina Pastora de las Almas.',
  'Procesión de gloria de la Divina Pastora de las Almas de la Hermandad de Nuestro Padre de Carmona.',
  'announced',
  'published',
  'Iglesia de San Bartolomé → San Felipe → General Chinchilla → Hermanas de la Cruz → General Freire → San José → San Ildefonso → Carlota Quintanilla → Santa María → Carlota Quintanilla → San Ildefonso → Sol → Ramón y Cajal → Plaza de Cristo Rey → El Salvador → Plaza de San Fernando → Prim → Plaza del Palenque → Iglesia de San Bartolomé.',
  'Salida a las 19:00. Acompañamiento musical: Banda Municipal de Música de Gerena tras la Divina Pastora de las Almas.',
  'Hermandad de Nuestro Padre de Carmona',
  'carmona-divina-pastora-2026-10-10',
  'Iglesia de San Bartolomé',
  'Iglesia de San Bartolomé'
where not exists (
  select 1 from public.outings where slug='carmona-divina-pastora-2026-10-10'
);

update public.outings
set
  brotherhood_entity_id='c0160035-0307-4000-8000-000000000007',
  outing_type='Procesión de Gloria',
  character='ordinary',
  title='Procesión de la Divina Pastora de las Almas · 2026',
  outing_date=date '2026-10-10',
  year=2026,
  departure_time=time '19:00',
  municipality_id='bf024af2-3eda-4989-b1b5-0a723dcf9cb4',
  origin_place_id='c0160035-0206-4000-8000-000000000006',
  destination_place_id='c0160035-0206-4000-8000-000000000006',
  reason='Procesión anual de la Divina Pastora de las Almas.',
  description='Procesión de gloria de la Divina Pastora de las Almas de la Hermandad de Nuestro Padre de Carmona.',
  event_status='announced',
  status='published',
  route_summary='Iglesia de San Bartolomé → San Felipe → General Chinchilla → Hermanas de la Cruz → General Freire → San José → San Ildefonso → Carlota Quintanilla → Santa María → Carlota Quintanilla → San Ildefonso → Sol → Ramón y Cajal → Plaza de Cristo Rey → El Salvador → Plaza de San Fernando → Prim → Plaza del Palenque → Iglesia de San Bartolomé.',
  public_notes='Salida a las 19:00. Acompañamiento musical: Banda Municipal de Música de Gerena tras la Divina Pastora de las Almas.',
  organizer_name='Hermandad de Nuestro Padre de Carmona',
  origin_text='Iglesia de San Bartolomé',
  destination_text='Iglesia de San Bartolomé',
  updated_at=now()
where slug='carmona-divina-pastora-2026-10-10';

insert into public.outing_entities (outing_id, entity_id, role, notes)
select o.id, 'c0160035-0622-4000-8000-000000000022', 'processional_image',
       'La Divina Pastora de las Almas preside la procesión.'
from public.outings o
where o.slug='carmona-divina-pastora-2026-10-10'
on conflict (outing_id, entity_id, role) do nothing;

delete from public.outing_route_points
where outing_id=(select id from public.outings where slug='carmona-divina-pastora-2026-10-10' limit 1);

insert into public.outing_route_points (outing_id, sequence_no, point_type, label, planned_time, notes)
select o.id, v.sequence_no, v.point_type, v.label, v.planned_time, v.notes
from public.outings o
cross join (values
  (1,'place','Iglesia de San Bartolomé',time '19:00','Salida'),
  (2,'street','San Felipe',null::time,null::text),
  (3,'street','General Chinchilla',null::time,null::text),
  (4,'street','Hermanas de la Cruz',null::time,null::text),
  (5,'street','General Freire',null::time,null::text),
  (6,'street','San José',null::time,null::text),
  (7,'street','San Ildefonso',null::time,null::text),
  (8,'street','Carlota Quintanilla',null::time,null::text),
  (9,'street','Santa María',null::time,null::text),
  (10,'street','Carlota Quintanilla',null::time,null::text),
  (11,'street','San Ildefonso',null::time,null::text),
  (12,'street','Sol',null::time,null::text),
  (13,'street','Ramón y Cajal',null::time,null::text),
  (14,'place','Plaza de Cristo Rey',null::time,null::text),
  (15,'street','El Salvador',null::time,null::text),
  (16,'place','Plaza de San Fernando',null::time,null::text),
  (17,'street','Prim',null::time,null::text),
  (18,'place','Plaza del Palenque',null::time,null::text),
  (19,'place','Iglesia de San Bartolomé',null::time,'Entrada · hora no publicada')
) as v(sequence_no,point_type,label,planned_time,notes)
where o.slug='carmona-divina-pastora-2026-10-10';

delete from public.outing_music_positions
where outing_id=(select id from public.outings where slug='carmona-divina-pastora-2026-10-10' limit 1);

insert into public.outing_music_positions
  (outing_id, position_code, position_label, sequence_no, notes, status)
select id, 'behind_glory', 'Tras la Divina Pastora de las Almas', 1,
       'Acompañamiento musical confirmado para la procesión de 2026.', 'published'
from public.outings
where slug='carmona-divina-pastora-2026-10-10';

insert into public.outing_music_assignments
  (music_position_id, band_entity_id, participation_mode, sequence_no, notes, status)
select omp.id, 'd0d31c12-11c7-4ba1-bbe6-4ceb731f4dd0', 'full_route', 1,
       'Banda Municipal de Música de Gerena.', 'published'
from public.outing_music_positions omp
join public.outings o on o.id=omp.outing_id
where o.slug='carmona-divina-pastora-2026-10-10'
  and omp.position_code='behind_glory';

insert into public.sources
  (name, url, source_type, author_or_publisher, publication_date, accessed_at, notes)
select
  'Itinerario de la Divina Pastora de las Almas · Carmona · 10 de octubre de 2026',
  null,
  'Red social oficial',
  'Hermandad de Nuestro Padre de Carmona',
  date '2026-10-06',
  date '2026-10-06',
  'Cartel oficial aportado directamente. Confirma salida a las 19:00 e itinerario completo.'
where not exists (
  select 1 from public.sources
  where name='Itinerario de la Divina Pastora de las Almas · Carmona · 10 de octubre de 2026'
);

insert into public.sources
  (name, url, source_type, author_or_publisher, publication_date, accessed_at, notes)
select
  'El Silencio de Carmona firma a la Banda de Gerena para la Divina Pastora',
  'https://www.elpespunte.es/articulo/cofrade/silencio-carmona-firma-banda-gerena-divina-pastora-mas-diez-anos-victoria-arahal/20260616100338137754.html',
  'Prensa local',
  'El Pespunte',
  date '2026-06-16',
  date '2026-10-06',
  'Confirma a la Banda Municipal de Música de Gerena tras la Divina Pastora el 10 de octubre de 2026.'
where not exists (
  select 1 from public.sources
  where url='https://www.elpespunte.es/articulo/cofrade/silencio-carmona-firma-banda-gerena-divina-pastora-mas-diez-anos-victoria-arahal/20260616100338137754.html'
);

insert into public.source_links (source_id, outing_id, scope, notes)
select s.id, o.id, 'outing', 'Horario e itinerario 2026.'
from public.sources s
join public.outings o on o.slug='carmona-divina-pastora-2026-10-10'
where s.name='Itinerario de la Divina Pastora de las Almas · Carmona · 10 de octubre de 2026'
  and not exists (
    select 1 from public.source_links sl where sl.source_id=s.id and sl.outing_id=o.id
  );

insert into public.source_links (source_id, outing_id, scope, notes)
select s.id, o.id, 'outing', 'Acompañamiento musical 2026.'
from public.sources s
join public.outings o on o.slug='carmona-divina-pastora-2026-10-10'
where s.url='https://www.elpespunte.es/articulo/cofrade/silencio-carmona-firma-banda-gerena-divina-pastora-mas-diez-anos-victoria-arahal/20260616100338137754.html'
  and not exists (
    select 1 from public.source_links sl where sl.source_id=s.id and sl.outing_id=o.id
  );

-- ---------------------------------------------------------------------------
-- SEVILLA · NUESTRA SEÑORA DEL AMPARO · 8 NOVIEMBRE
-- ---------------------------------------------------------------------------

update public.outings
set
  title='Solemne Procesión de Alabanzas de la Coronación Canónica de Nuestra Señora del Amparo',
  return_time=time '22:45',
  description='Solemne procesión de alabanzas de Nuestra Señora del Amparo en la tarde de su Coronación Canónica, coincidiendo con la salida anual de gloria de la Hermandad.',
  route_summary='Real Parroquia de Santa María Magdalena → Cristo del Calvario → San Pablo → Plaza de la Magdalena → Rioja → Tetuán → Granada → Plaza de San Francisco → Granada → Tetuán → Albareda → Carlos Cañal → Zaragoza → Gravina → Alfonso XII → El Silencio → Monsalves → Plaza del Museo → Miguel de Carvajal → Bailén → Pedro del Toro → Gravina → San Pedro Mártir → Rafael González Abreu → Canalejas → Cristo del Calvario → Real Parroquia de Santa María Magdalena.',
  public_notes='La Coronación Canónica tendrá lugar durante la Función Principal de Instituto de las 10:00. La procesión de alabanzas saldrá a las 17:00 y entrará a las 22:45. La Santísima Virgen será recibida por la Corporación Municipal en el Ayuntamiento de Sevilla y hará estación en la Capilla de Montserrat, Convento del Santo Ángel, Convento de San Buenaventura, Capilla de Nuestra Señora de las Mercedes, Capilla del Santísimo Cristo de la Expiración (Museo), Convento de San Gregorio Magno y Capilla de Jesús Nazareno (El Silencio). Acompañamiento musical: Carmen de Salteras tras el paso.',
  updated_at=now()
where slug='sevilla-amparo-2026';

delete from public.outing_route_points
where outing_id=(select id from public.outings where slug='sevilla-amparo-2026' limit 1);

insert into public.outing_route_points
  (outing_id, sequence_no, point_type, label, planned_time, notes)
select o.id, v.sequence_no, v.point_type, v.label, v.planned_time, v.notes
from public.outings o
cross join (values
  (1,'place','Real Parroquia de Santa María Magdalena',time '17:00','Salida'),
  (2,'street','Cristo del Calvario',null::time,null::text),
  (3,'street','San Pablo',null::time,null::text),
  (4,'place','Plaza de la Magdalena',null::time,null::text),
  (5,'street','Rioja',null::time,null::text),
  (6,'street','Tetuán',null::time,null::text),
  (7,'street','Granada',null::time,null::text),
  (8,'place','Plaza de San Francisco',null::time,'Recepción por la Corporación Municipal en el Ayuntamiento de Sevilla'),
  (9,'street','Granada',null::time,null::text),
  (10,'street','Tetuán',null::time,null::text),
  (11,'street','Albareda',null::time,null::text),
  (12,'street','Carlos Cañal',null::time,null::text),
  (13,'street','Zaragoza',null::time,null::text),
  (14,'street','Gravina',null::time,null::text),
  (15,'street','Alfonso XII',null::time,null::text),
  (16,'street','El Silencio',null::time,null::text),
  (17,'street','Monsalves',null::time,null::text),
  (18,'place','Plaza del Museo',null::time,null::text),
  (19,'street','Miguel de Carvajal',null::time,null::text),
  (20,'street','Bailén',null::time,null::text),
  (21,'street','Pedro del Toro',null::time,null::text),
  (22,'street','Gravina',null::time,null::text),
  (23,'street','San Pedro Mártir',null::time,null::text),
  (24,'street','Rafael González Abreu',null::time,null::text),
  (25,'street','Canalejas',null::time,null::text),
  (26,'street','Cristo del Calvario',null::time,null::text),
  (27,'place','Real Parroquia de Santa María Magdalena',time '22:45','Entrada')
) as v(sequence_no,point_type,label,planned_time,notes)
where o.slug='sevilla-amparo-2026';

delete from public.outing_schedule_items
where outing_id=(select id from public.outings where slug='sevilla-amparo-2026' limit 1);

insert into public.outing_schedule_items
  (outing_id, sequence_no, label, item_date, item_time, time_text, place_text, notes)
select o.id, v.sequence_no, v.label, date '2026-11-08', v.item_time, v.time_text, v.place_text, v.notes
from public.outings o
cross join (values
  (1,'Función Principal de Instituto y Coronación Canónica',time '10:00',null::text,'Real Parroquia de Santa María Magdalena','Ceremonia de la Coronación Canónica de Nuestra Señora del Amparo.'),
  (2,'Salida de la Procesión de Alabanzas',time '17:00',null::text,'Real Parroquia de Santa María Magdalena','Salida de la procesión.'),
  (3,'Entrada',time '22:45',null::text,'Real Parroquia de Santa María Magdalena','Entrada prevista.')
) as v(sequence_no,label,item_time,time_text,place_text,notes)
where o.slug='sevilla-amparo-2026';

insert into public.sources
  (name, url, source_type, author_or_publisher, publication_date, accessed_at, notes)
select
  'Recorrido de la Solemne Procesión de Alabanzas de la Coronación Canónica de Nuestra Señora del Amparo · 2026',
  null,
  'Aportación directa',
  null,
  date '2026-10-06',
  date '2026-10-06',
  'Cartel aportado directamente. Confirma recorrido completo, salida 17:00, entrada 22:45, recepción municipal y estaciones en siete templos.'
where not exists (
  select 1 from public.sources
  where name='Recorrido de la Solemne Procesión de Alabanzas de la Coronación Canónica de Nuestra Señora del Amparo · 2026'
);

insert into public.source_links (source_id, outing_id, scope, notes)
select s.id, o.id, 'outing',
       'Horario, recorrido, recepción municipal y estaciones de la procesión de 2026.'
from public.sources s
join public.outings o on o.slug='sevilla-amparo-2026'
where s.name='Recorrido de la Solemne Procesión de Alabanzas de la Coronación Canónica de Nuestra Señora del Amparo · 2026'
  and not exists (
    select 1 from public.source_links sl where sl.source_id=s.id and sl.outing_id=o.id
  );

commit;
