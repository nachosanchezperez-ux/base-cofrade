-- Hilo Cofrade · Misión de Nuestra Señora de los Dolores del Cerro · 6 septiembre 2026
-- Una única extraordinaria con horarios, acompañamientos, fuentes y fases estructuradas.
-- La imagen externa se conserva únicamente como referencia documental: no se importa ni publica.

insert into public.outings(
  brotherhood_entity_id, outing_type, character, title, outing_date, year,
  departure_time, return_time, municipality_id, origin_place_id, destination_place_id,
  reason, route, description, event_status, status, return_date, route_summary,
  public_notes, organizer_name, slug, reference_code, origin_text, destination_text
)
select
  null,
  'Rosario de la Aurora extraordinario y traslado extraordinario',
  'extraordinary',
  'Nuestra Señora de los Dolores',
  date '2026-09-06',
  2026,
  time '07:00',
  time '22:15',
  (select id from public.municipalities where slug = 'sevilla' limit 1),
  null,
  null,
  $$Inicio de la misión evangelizadora del Arciprestazgo de Amate-Cerro del Águila durante el curso 2026-2027, con motivo del primer siglo de presencia de la Iglesia diocesana en esta zona de Sevilla, unido históricamente al centenario del nacimiento de la devoción a Nuestra Señora de los Dolores$$,
  jsonb_build_object(
    'phases', jsonb_build_array(
      jsonb_build_object(
        'id','rosario-ida','eyebrow','Mañana','title','Rosario de la Aurora de ida','time','07:00 → 10:00',
        'summary','Rosario de la Aurora extraordinario desde la Parroquia de Nuestra Señora de los Dolores hasta la Parroquia de San Lucas Evangelista.',
        'places',jsonb_build_array('Parroquia de Nuestra Señora de los Dolores','Parroquia de San Lucas Evangelista')
      ),
      jsonb_build_object(
        'id','estancia-san-lucas','eyebrow','San Lucas Evangelista','title','Estancia, misa y veneración','time','10:00 → 17:30',
        'summary','Llegada prevista a las 10:00, Misa mayor dominical a las 11:00 y veneración de la Virgen tras la misa hasta el inicio del regreso.',
        'places',jsonb_build_array('Parroquia de San Lucas Evangelista')
      ),
      jsonb_build_object(
        'id','traslado-regreso','eyebrow','Tarde','title','Traslado extraordinario de regreso','time','17:30 → 22:15',
        'summary','Regreso desde San Lucas Evangelista a las 17:30, con entrada prevista a las 22:15 en la Parroquia de Nuestra Señora de los Dolores.',
        'places',jsonb_build_array('Parroquia de San Lucas Evangelista','Parroquia de Nuestra Señora de los Dolores')
      ),
      jsonb_build_object(
        'id','visitas-parroquias','eyebrow','Durante el regreso','title','Visitas a las parroquias del arciprestazgo','time','',
        'summary','Durante el traslado de regreso se visitarán las parroquias de La Blanca Paloma y Nuestra Señora de la Candelaria. No se ha publicado una hora concreta para estas visitas.',
        'places',jsonb_build_array('Parroquia de La Blanca Paloma','Parroquia de Nuestra Señora de la Candelaria')
      )
    )
  ),
  $$Jornada misional de Nuestra Señora de los Dolores por el Arciprestazgo de Amate-Cerro del Águila, con Rosario de la Aurora extraordinario de ida, estancia en San Lucas Evangelista y traslado extraordinario de regreso.$$,
  'announced',
  'published',
  null,
  $$Ida: Parroquia de Nuestra Señora de los Dolores, Afán de Ribera, Francisco Carrera Iglesias “Paquili”, Lérida, Teruel, Tomás Pérez, Maestro Falla, Doctor Serrano Pérez, Beatriz de Ahumada, San Juan de la Cruz, Julián de Ávila, Pedro de Madrid, Candelilla, Candelón, Estornino, Energía, Generador, Tomás Pardo López, General Ollero, Dobla y Parroquia de San Lucas Evangelista. Regreso: Parroquia de San Lucas Evangelista, Dobla, General Ollero, Tomás Pardo López, Parque Amate, Generador, Energía, Estornino, Calandria, Tordo, Colibrí, Doctor Andreu Urra, Alondra, Parroquia de La Blanca Paloma, Galaxia, Candelón, Candeleta, Parroquia de Nuestra Señora de la Candelaria, Candeleta, Candelario, Candelas, Candelera, Primero de Mayo, Juan XXIII, Puerto de los Alazores, Tarragona, Calatayud, Francisco Carrera Iglesias “Paquili”, Afán de Ribera y Parroquia de Nuestra Señora de los Dolores.$$,
  $$La jornada comenzará con el tradicional Rosario de la Aurora, que en 2026 tendrá carácter extraordinario por su recorrido hasta la Parroquia de San Lucas Evangelista. La llegada está prevista a las 10:00 y la Misa mayor dominical se celebrará a las 11:00. Tras la misa, la Virgen permanecerá en veneración en San Lucas hasta el inicio del regreso a las 17:30. Durante la tarde visitará las parroquias de La Blanca Paloma y Nuestra Señora de la Candelaria antes de regresar a su sede canónica. Los hermanos podrán inscribirse para acompañar a la Virgen con cirio en el trayecto de ida, en el regreso o en ambos. Fotografía de referencia: David Arias. La imagen de referencia no se incorpora al almacenamiento ni se publica sin comprobación previa de derechos.$$,
  $$Fervorosa Hermandad Sacramental y Cofradía de Nazarenos del Santísimo Cristo del Desamparo y Abandono, Nuestro Padre Jesús de la Humildad y Nuestra Señora de los Dolores$$,
  'nuestra-senora-dolores-cerro-sevilla-2026',
  'SEVILLA-DOLORES-DEL-CERRO-2026',
  'Parroquia de Nuestra Señora de los Dolores',
  'Parroquia de San Lucas Evangelista'
on conflict (reference_code) do update set
  outing_type = excluded.outing_type,
  character = excluded.character,
  title = excluded.title,
  outing_date = excluded.outing_date,
  year = excluded.year,
  departure_time = excluded.departure_time,
  return_time = excluded.return_time,
  municipality_id = excluded.municipality_id,
  reason = excluded.reason,
  route = excluded.route,
  description = excluded.description,
  event_status = excluded.event_status,
  status = excluded.status,
  return_date = excluded.return_date,
  route_summary = excluded.route_summary,
  public_notes = excluded.public_notes,
  organizer_name = excluded.organizer_name,
  slug = excluded.slug,
  origin_text = excluded.origin_text,
  destination_text = excluded.destination_text,
  updated_at = now();

delete from public.outing_schedule_items
where outing_id = (select id from public.outings where reference_code = 'SEVILLA-DOLORES-DEL-CERRO-2026');

insert into public.outing_schedule_items(outing_id,sequence_no,label,item_date,item_time,time_text,place_id,place_text,notes)
select o.id, d.sequence_no, d.label, date '2026-09-06', d.item_time, d.time_text, null, d.place_text, d.notes
from public.outings o
cross join (values
  (1,'Salida',time '07:00',null::text,'Parroquia de Nuestra Señora de los Dolores','Inicio del Rosario de la Aurora extraordinario.'),
  (2,'Llegada',time '10:00',null::text,'Parroquia de San Lucas Evangelista',null::text),
  (3,'Misa mayor dominical',time '11:00',null::text,'Parroquia de San Lucas Evangelista','Misa de apertura de la misión evangelizadora.'),
  (4,'Veneración',null::time,'Tras la misa y hasta el inicio del regreso','Parroquia de San Lucas Evangelista','La Virgen permanecerá expuesta a la veneración de los fieles.'),
  (5,'Inicio del regreso',time '17:30',null::text,'Parroquia de San Lucas Evangelista','Inicio del traslado extraordinario de regreso al Cerro del Águila.'),
  (6,'Visita',null::time,null::text,'Parroquia de La Blanca Paloma','No se ha publicado una hora concreta.'),
  (7,'Visita',null::time,null::text,'Parroquia de Nuestra Señora de la Candelaria','No se ha publicado una hora concreta.'),
  (8,'Entrada',time '22:15',null::text,'Parroquia de Nuestra Señora de los Dolores',null::text)
) as d(sequence_no,label,item_time,time_text,place_text,notes)
where o.reference_code = 'SEVILLA-DOLORES-DEL-CERRO-2026';

delete from public.outing_music_positions
where outing_id = (select id from public.outings where reference_code = 'SEVILLA-DOLORES-DEL-CERRO-2026');

insert into public.outing_music_positions(outing_id,step_entity_id,position_code,position_label,sequence_no,notes,status)
select o.id,null,'processional_music',d.position_label,d.sequence_no,null,'published'
from public.outings o
cross join (values
  (1,'Rosario de la Aurora de ida'),
  (2,'Traslado extraordinario de regreso')
) as d(sequence_no,position_label)
where o.reference_code='SEVILLA-DOLORES-DEL-CERRO-2026';

insert into public.outing_music_assignments(
  music_position_id,band_entity_id,band_name_text,participation_mode,sequence_no,
  segment_start_label,segment_end_label,notes,status
)
select p.id,null,d.band_name,'full_route',1,d.segment_start,d.segment_end,d.notes,'published'
from public.outing_music_positions p
join public.outings o on o.id=p.outing_id
join (values
  (1,'Coro de Campanilleros Santo Domingo de Silos de Bormujos','Parroquia de Nuestra Señora de los Dolores','Parroquia de San Lucas Evangelista','Acompañará el recorrido matinal.'),
  (2,'Banda de Música Nuestra Señora de las Nieves de Olivares','Parroquia de San Lucas Evangelista','Parroquia de Nuestra Señora de los Dolores','Acompañará todo el recorrido vespertino de regreso, incluidas las visitas a las parroquias de La Blanca Paloma y Nuestra Señora de la Candelaria.')
) as d(sequence_no,band_name,segment_start,segment_end,notes) on d.sequence_no=p.sequence_no
where o.reference_code='SEVILLA-DOLORES-DEL-CERRO-2026';

with source_data(name,url,source_type,publication_date,scope,notes) as (
  values
  ('Hermandad de Nuestra Señora de los Dolores','https://noticiasdoloresdelcerro.wordpress.com/2026/07/21/mision-de-nuestra-senora-de-los-dolores-en-nuestro-arciprestazgo/','Fuente oficial',date '2026-07-21','Fecha, motivo, misión evangelizadora, visita a San Lucas, misa, veneración y visitas a La Blanca Paloma y Nuestra Señora de la Candelaria','Fotografía oficial acreditada a David Arias Pozo.'),
  ('El Pespunte Cofrade','https://www.elpespunte.es/articulo/cofrade/mision-virgen-dolores-cerro-amate-horarios-recorridos-musica-6-septiembre/20260803203740143984.html','Medio cofrade',date '2026-08-03','Horarios completos, itinerarios de ida y regreso, acompañamientos musicales y participación de hermanos con cirio','Incluye fotografía de David Arias.'),
  ('Diario de Sevilla','https://www.diariodesevilla.es/semana_santa/horarios-e-itinerarios-mision-dolores_0_2007647767.html','Prensa',date '2026-08-03','Horarios, itinerarios y acompañamientos musicales','Contiene aparentemente las erratas “Candelaria” por “Calandria” y “Juan XIII” por “Juan XXIII”.'),
  ('Andalucía Información','https://www.andaluciainformacion.es/articulo/la-pasion/dolores-cerro-anuncia-horarios-itinerario-mision-amate-cerro/202608031638063447910.html','Prensa',date '2026-08-03','Carácter extraordinario, horarios, itinerarios y acompañamientos musicales','Coincide con El Pespunte en las calles Calandria y Juan XXIII.')
)
insert into public.sources(name,url,source_type,author_or_publisher,publication_date,accessed_at,notes)
select d.name,d.url,d.source_type,d.name,d.publication_date,date '2026-08-24',d.notes
from source_data d
where not exists (select 1 from public.sources s where s.url=d.url);

with source_data(url,scope,notes) as (
  values
  ('https://noticiasdoloresdelcerro.wordpress.com/2026/07/21/mision-de-nuestra-senora-de-los-dolores-en-nuestro-arciprestazgo/','Fecha, motivo, misión evangelizadora, visita a San Lucas, misa, veneración y visitas a La Blanca Paloma y Nuestra Señora de la Candelaria','Fotografía oficial acreditada a David Arias Pozo.'),
  ('https://www.elpespunte.es/articulo/cofrade/mision-virgen-dolores-cerro-amate-horarios-recorridos-musica-6-septiembre/20260803203740143984.html','Horarios completos, itinerarios de ida y regreso, acompañamientos musicales y participación de hermanos con cirio','Incluye fotografía de David Arias.'),
  ('https://www.diariodesevilla.es/semana_santa/horarios-e-itinerarios-mision-dolores_0_2007647767.html','Horarios, itinerarios y acompañamientos musicales','Contiene aparentemente las erratas “Candelaria” por “Calandria” y “Juan XIII” por “Juan XXIII”.'),
  ('https://www.andaluciainformacion.es/articulo/la-pasion/dolores-cerro-anuncia-horarios-itinerario-mision-amate-cerro/202608031638063447910.html','Carácter extraordinario, horarios, itinerarios y acompañamientos musicales','Coincide con El Pespunte en las calles Calandria y Juan XXIII.')
)
insert into public.source_links(source_id,outing_id,scope,notes)
select s.id,o.id,d.scope,d.notes
from source_data d
join public.sources s on s.url=d.url
join public.outings o on o.reference_code='SEVILLA-DOLORES-DEL-CERRO-2026'
where not exists (
  select 1 from public.source_links sl
  where sl.source_id=s.id and sl.outing_id=o.id and sl.scope=d.scope
);
