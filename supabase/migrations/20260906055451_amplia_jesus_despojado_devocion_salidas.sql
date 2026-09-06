-- Hilo Cofrade · ficha avanzada de Jesús Despojado
-- Corte editorial: 2026-09-05
-- Solo DML editorial. Sin DDL, RLS ni cambios estructurales.

-- Titular histórica de la capilla, incluida en el título corporativo.
insert into public.entities (entity_type, name, slug, summary, status)
select 'image', 'Nuestra Señora del Mayor Dolor',
       'nuestra-senora-mayor-dolor-jesus-despojado-sevilla',
       'Talla barroca anónima de finales del siglo XVIII, titular histórica de la Capilla del Mayor Dolor y de la Hermandad de Jesús Despojado.',
       'published'
where not exists (
  select 1 from public.entities
  where slug = 'nuestra-senora-mayor-dolor-jesus-despojado-sevilla'
);

update public.entities
set name = 'Nuestra Señora del Mayor Dolor',
    summary = 'Talla barroca anónima de finales del siglo XVIII, titular histórica de la Capilla del Mayor Dolor y de la Hermandad de Jesús Despojado.',
    status = 'published', updated_at = now()
where slug = 'nuestra-senora-mayor-dolor-jesus-despojado-sevilla';

insert into public.images (
  entity_id, image_type, execution_date_text, material, technique,
  current_condition, description, iconography, anatomical_type,
  is_dress_image, current_state_notes
)
select i.id, 'Dolorosa', 'Finales del siglo XVIII', 'Madera policromada',
       'Talla policromada', 'extant',
       'Virgen arrodillada, con las manos juntas y la cabeza inclinada, que conserva siete lágrimas, diadema y puñal en el pecho.',
       'Virgen al pie de la Cruz', 'Talla completa', false,
       'Recibe culto en un retablo-hornacina propio inaugurado en 2020 al comienzo de la nave de la Capilla del Mayor Dolor.'
from public.entities i
where i.slug = 'nuestra-senora-mayor-dolor-jesus-despojado-sevilla'
on conflict (entity_id) do update set
  image_type = excluded.image_type,
  execution_date_text = excluded.execution_date_text,
  material = excluded.material,
  technique = excluded.technique,
  current_condition = excluded.current_condition,
  description = excluded.description,
  iconography = excluded.iconography,
  anatomical_type = excluded.anatomical_type,
  is_dress_image = excluded.is_dress_image,
  current_state_notes = excluded.current_state_notes;

insert into public.brotherhood_images (
  brotherhood_entity_id, image_entity_id, relation_type,
  date_from_text, notes, status
)
select h.id, i.id, 'Titular', 'Incluida en el título corporativo desde 1986',
       'Titular histórica de la capilla y advocación incorporada al título de la Hermandad.',
       'published'
from public.entities h
join public.entities i
  on i.slug = 'nuestra-senora-mayor-dolor-jesus-despojado-sevilla'
where h.slug = 'hermandad-jesus-despojado-sevilla'
  and not exists (
    select 1 from public.brotherhood_images bi
    where bi.brotherhood_entity_id = h.id and bi.image_entity_id = i.id
  );

insert into public.image_authorships (
  image_entity_id, agent_entity_id, authorship_type, role_name,
  date_from_text, certainty, notes, status
)
select i.id, null, 'anonymous', 'Autor desconocido',
       'Finales del siglo XVIII', 'unknown',
       'La ficha oficial de la capilla mantiene la autoría como anónima.',
       'published'
from public.entities i
where i.slug = 'nuestra-senora-mayor-dolor-jesus-despojado-sevilla'
  and not exists (
    select 1 from public.image_authorships ia
    where ia.image_entity_id = i.id and ia.authorship_type = 'anonymous'
  );

-- Reglas cultuales estables. Las fechas concretas se guardan como ocurrencias.
with cult_data as (
  select * from (values
    ('Quinario', 'Solemne Quinario a Nuestro Padre Jesús Despojado', 'Los cinco días anteriores al segundo domingo de febrero', 2::smallint, 'Cinco días de culto en honor del titular cristífero.', 'Anual · febrero', 10, 'nuestro-padre-jesus-despojado-vestiduras-sevilla'),
    ('Función Principal', 'Función Principal de Instituto', 'Segundo domingo de febrero', 2::smallint, 'Función Principal con Protestación de Fe al término del Quinario.', 'Segundo domingo de febrero', 20, 'nuestro-padre-jesus-despojado-vestiduras-sevilla'),
    ('Veneración', 'Veneración de Nuestro Padre Jesús Despojado', 'Sábado y domingo siguientes a la Función Principal de Instituto', 2::smallint, 'La imagen del Señor queda expuesta a la veneración de fieles y hermanos.', 'Anual · después de la Función Principal', 30, 'nuestro-padre-jesus-despojado-vestiduras-sevilla'),
    ('Triduo', 'Triduo a María Santísima de los Dolores y Misericordia', 'En torno al 15 de septiembre, seguido de Función Solemne', 9::smallint, 'Triduo y Función Solemne en honor de la titular mariana.', 'Anual · septiembre', 40, 'maria-santisima-dolores-misericordia-sevilla'),
    ('Veneración', 'Veneración de María Santísima de los Dolores y Misericordia', 'Sábado y domingo siguientes a la Función Solemne de septiembre', 9::smallint, 'La imagen queda expuesta a la veneración de fieles y hermanos.', 'Anual · septiembre', 50, 'maria-santisima-dolores-misericordia-sevilla'),
    ('Vía Crucis', 'Vía Crucis de Nuestro Padre Jesús Despojado', 'Quinto domingo de Cuaresma', null::smallint, 'Vía Crucis con la imagen del Señor por las calles próximas a la Capilla del Mayor Dolor.', 'Anual · Cuaresma', 60, 'nuestro-padre-jesus-despojado-vestiduras-sevilla'),
    ('Rosario', 'Rosario Vespertino de María Santísima de los Dolores y Misericordia', 'Primer sábado de octubre', 10::smallint, 'Rosario Vespertino con la Virgen por las calles de la feligresía; incorporado a las Reglas aprobadas en 2025.', 'Primer sábado de octubre', 70, 'maria-santisima-dolores-misericordia-sevilla'),
    ('Triduo', 'Triduo a Nuestra Señora del Mayor Dolor', 'Jueves, viernes y sábado de la semana posterior al Jubileo Circular; Función el domingo', 5::smallint, 'Triduo y Eucaristía Solemne en honor de la titular histórica de la capilla.', 'Anual · mayo', 80, 'nuestra-senora-mayor-dolor-jesus-despojado-sevilla'),
    ('Jubileo Circular', 'Jubileo Circular de las Cuarenta Horas', '7, 8 y 9 de mayo', 5::smallint, 'Exposición del Santísimo asignada por la Real Congregación Eucarística de Luz y Vela.', 'Cada 7, 8 y 9 de mayo', 90, null::text)
  ) as d(cult_type, title, date_rule, month, description, recurrence_label, display_order, image_slug)
)
insert into public.cults (
  brotherhood_entity_id, image_entity_id, cult_type, title, date_rule,
  month, place_id, description, status, is_recurring,
  recurrence_label, display_order, notes
)
select h.id, i.id, d.cult_type, d.title, d.date_rule, d.month, p.id,
       d.description, 'published', true, d.recurrence_label, d.display_order,
       'Regla recurrente tomada de las páginas oficiales; las fechas concretas se registran como ocurrencias.'
from cult_data d
join public.entities h on h.slug = 'hermandad-jesus-despojado-sevilla'
join public.places p on p.slug = 'capilla-mayor-dolor-molviedro'
left join public.entities i on i.slug = d.image_slug
where not exists (
  select 1 from public.cults c
  where c.brotherhood_entity_id = h.id and c.title = d.title and c.is_recurring
);

with occurrence_data as (
  select * from (values
    ('Solemne Quinario a Nuestro Padre Jesús Despojado', 2026, date '2026-02-03', date '2026-02-07', 'held', 'Culto celebrado en la Parroquia del Sagrario por las limitaciones de aforo de la capilla.'),
    ('Función Principal de Instituto', 2026, date '2026-02-08', date '2026-02-08', 'held', 'Primera Función Principal celebrada en la Parroquia del Sagrario; existe crónica oficial posterior.'),
    ('Rosario Vespertino de María Santísima de los Dolores y Misericordia', 2025, date '2025-10-04', date '2025-10-04', 'held', 'Primera edición del Rosario Vespertino, confirmada por la crónica oficial del día siguiente.')
  ) as d(cult_title, year, start_date, end_date, event_status, notes)
)
insert into public.cult_occurrences (
  cult_id, year, start_date, end_date, place_id, event_status, status, notes
)
select c.id, d.year, d.start_date, d.end_date,
       case when d.cult_title in ('Solemne Quinario a Nuestro Padre Jesús Despojado', 'Función Principal de Instituto')
            then (select id from public.places where slug = 'parroquia-sagrario-catedral-sevilla')
            else (select id from public.places where slug = 'capilla-mayor-dolor-molviedro') end,
       d.event_status, 'published', d.notes
from occurrence_data d
join public.cults c
  on c.brotherhood_entity_id = (select id from public.entities where slug = 'hermandad-jesus-despojado-sevilla')
 and c.title = d.cult_title
on conflict (cult_id, year, start_date) do update set
  end_date = excluded.end_date, place_id = excluded.place_id,
  event_status = excluded.event_status, status = excluded.status,
  notes = excluded.notes, updated_at = now();

-- Salidas recientes con celebración comprobada.
insert into public.outings (
  brotherhood_entity_id, outing_type, "character", title, outing_date,
  year, departure_time, return_time, municipality_id, origin_place_id,
  origin_text, destination_place_id, destination_text, reason,
  route_summary, description, public_notes, event_status, status,
  slug, reference_code, organizer_name
)
select h.id, 'Estación de penitencia', 'ordinary',
       'Estación de penitencia del Domingo de Ramos 2026',
       date '2026-03-29', 2026, time '14:20', time '22:45',
       m.id, p.id, p.name, p.id, p.name,
       'Estación de penitencia a la Santa Iglesia Catedral',
       'Molviedro · Zaragoza · San Pablo · Magdalena · Rioja · Velázquez · Carrera Oficial · Catedral · Postigo · Arenal · Castelar · Gamazo · Zaragoza · Molviedro',
       'Salida ordinaria con los pasos de misterio y palio en la jornada del Domingo de Ramos.',
       'Una crónica posterior confirma que la cofradía completó la estación. Solo se vincula el acompañamiento con continuidad vigente confirmada por la propia formación.',
       'held', 'published', 'jesus-despojado-estacion-penitencia-2026',
       'SEVILLA-JESUS-DESPOJADO-2026', 'Hermandad de Jesús Despojado'
from public.entities h
join public.municipalities m on m.slug = 'sevilla'
join public.places p on p.slug = 'capilla-mayor-dolor-molviedro'
where h.slug = 'hermandad-jesus-despojado-sevilla'
  and not exists (select 1 from public.outings o where o.slug = 'jesus-despojado-estacion-penitencia-2026');

insert into public.outings (
  brotherhood_entity_id, outing_type, "character", title, outing_date,
  year, municipality_id, origin_place_id, origin_text,
  destination_place_id, destination_text, reason, description,
  public_notes, event_status, status, slug, reference_code, organizer_name
)
select h.id, 'Rosario Vespertino', 'ordinary',
       'I Rosario Vespertino de María Santísima de los Dolores y Misericordia',
       date '2025-10-04', 2025, m.id, p.id, p.name, p.id, p.name,
       'Culto externo incorporado a las Reglas aprobadas en 2025',
       'Primera salida de la Virgen en Rosario Vespertino por las calles de la feligresía.',
       'La crónica oficial confirma la celebración y la participación de la Coral Polifónica Jesús Despojado y de un trío de capilla del Liceo de Moguer.',
       'held', 'published', 'jesus-despojado-rosario-vespertino-2025',
       'SEVILLA-JESUS-DESPOJADO-ROSARIO-2025', 'Hermandad de Jesús Despojado'
from public.entities h
join public.municipalities m on m.slug = 'sevilla'
join public.places p on p.slug = 'capilla-mayor-dolor-molviedro'
where h.slug = 'hermandad-jesus-despojado-sevilla'
  and not exists (select 1 from public.outings o where o.slug = 'jesus-despojado-rosario-vespertino-2025');

insert into public.outing_entities (outing_id, entity_id, role, notes)
select o.id, d.entity_id, 'processional_image', d.notes
from public.outings o
join lateral (values
  ((select id from public.entities where slug = 'nuestro-padre-jesus-despojado-vestiduras-sevilla'), 'Titular cristífero del paso de misterio.'),
  ((select id from public.entities where slug = 'maria-santisima-dolores-misericordia-sevilla'), 'Titular mariana del paso de palio.')
) as d(entity_id, notes) on true
where o.slug = 'jesus-despojado-estacion-penitencia-2026' and d.entity_id is not null
on conflict (outing_id, entity_id, role) do update set notes = excluded.notes;

insert into public.outing_entities (outing_id, entity_id, role, notes)
select o.id, i.id, 'processional_image', 'Titular mariana que presidió el primer Rosario Vespertino.'
from public.outings o
join public.entities i on i.slug = 'maria-santisima-dolores-misericordia-sevilla'
where o.slug = 'jesus-despojado-rosario-vespertino-2025'
on conflict (outing_id, entity_id, role) do update set notes = excluded.notes;

-- Música vinculada a salidas concretas.
insert into public.accompaniments (
  outing_id, band_entity_id, step_entity_id, position, year, notes, status
)
select o.id, b.id, st.id, 'Tras el paso de misterio', 2026,
       'Continuidad vigente declarada por la Agrupación Musical Virgen de los Reyes para Jesús Despojado desde 2005.',
       'published'
from public.outings o
join public.entities b on b.slug = 'agrupacion-musical-virgen-de-los-reyes-sevilla'
join public.entities st on st.slug = 'paso-misterio-jesus-despojado-sevilla'
where o.slug = 'jesus-despojado-estacion-penitencia-2026'
  and not exists (
    select 1 from public.accompaniments a
    where a.outing_id = o.id and a.band_entity_id = b.id
      and a.step_entity_id = st.id and a.year = 2026
  );

insert into public.outing_music_positions (
  outing_id, step_entity_id, position_code, position_label,
  sequence_no, notes, status
)
select o.id, st.id, 'tras_misterio', 'Tras el paso de misterio', 1,
       'Posición musical confirmada para la estación de penitencia.', 'published'
from public.outings o
join public.entities st on st.slug = 'paso-misterio-jesus-despojado-sevilla'
where o.slug = 'jesus-despojado-estacion-penitencia-2026'
on conflict (outing_id, sequence_no) do update set
  step_entity_id = excluded.step_entity_id,
  position_code = excluded.position_code,
  position_label = excluded.position_label,
  notes = excluded.notes, status = excluded.status, updated_at = now();

insert into public.outing_music_assignments (
  music_position_id, band_entity_id, participation_mode,
  sequence_no, notes, status
)
select pos.id, b.id, 'full_route', 1,
       'Acompañamiento dentro de la continuidad 2005-actualidad publicada por la formación.',
       'published'
from public.outings o
join public.outing_music_positions pos on pos.outing_id = o.id and pos.sequence_no = 1
join public.entities b on b.slug = 'agrupacion-musical-virgen-de-los-reyes-sevilla'
where o.slug = 'jesus-despojado-estacion-penitencia-2026'
  and not exists (
    select 1 from public.outing_music_assignments oma
    where oma.music_position_id = pos.id and oma.band_entity_id = b.id and oma.sequence_no = 1
  );

insert into public.outing_music_positions (
  outing_id, position_code, position_label, sequence_no, notes, status
)
select o.id, 'acompanamiento_rosario', 'Acompañamiento del Rosario', 1,
       'Música vocal y de capilla durante el Rosario Vespertino.', 'published'
from public.outings o
where o.slug = 'jesus-despojado-rosario-vespertino-2025'
on conflict (outing_id, sequence_no) do update set
  position_code = excluded.position_code,
  position_label = excluded.position_label,
  notes = excluded.notes, status = excluded.status, updated_at = now();

insert into public.outing_music_assignments (
  music_position_id, band_name_text, participation_mode,
  sequence_no, notes, status
)
select pos.id, d.band_name, 'unspecified', d.sequence_no, d.notes, 'published'
from public.outings o
join public.outing_music_positions pos on pos.outing_id = o.id and pos.sequence_no = 1
join lateral (values
  ('Coral Polifónica Jesús Despojado', 1, 'Acompañó con cantos el rezo de los misterios y distintos puntos del recorrido.'),
  ('Trío de capilla de la Banda del Liceo de Moguer', 2, 'Interpretó varias marchas durante el primer Rosario Vespertino.')
) as d(band_name, sequence_no, notes) on true
where o.slug = 'jesus-despojado-rosario-vespertino-2025'
  and not exists (
    select 1 from public.outing_music_assignments oma
    where oma.music_position_id = pos.id
      and oma.band_name_text = d.band_name and oma.sequence_no = d.sequence_no
  );

-- Fuentes oficiales y una crónica de contraste para el estado celebrado de 2026.
with source_data as (
  select * from (values
    ('Título y heráldica · Hermandad de Jesús Despojado', 'https://jesusdespojado.org/titulo-de-la-hermandad/', 'Web oficial', 'Hermandad de Jesús Despojado', null::date, 'Título corporativo y advocación del Mayor Dolor.'),
    ('Capilla del Mayor Dolor · Hermandad de Jesús Despojado', 'https://jesusdespojado.org/capilla-mayor/', 'Web oficial', 'Hermandad de Jesús Despojado', null::date, 'Historia y descripción de Nuestra Señora del Mayor Dolor.'),
    ('Quinario a Nuestro Padre Jesús Despojado', 'https://jesusdespojado.org/quinario-ntro-padre-jesus-despojado/', 'Web oficial', 'Hermandad de Jesús Despojado', null::date, 'Regla anual del Quinario, Función Principal y veneración.'),
    ('Triduo a María Santísima de los Dolores y Misericordia', 'https://jesusdespojado.org/triduo-ma-stma-de-los-dolores-y-misericordia/', 'Web oficial', 'Hermandad de Jesús Despojado', null::date, 'Regla anual del Triduo, Función y veneración de septiembre.'),
    ('Triduo a Nuestra Señora del Mayor Dolor', 'https://jesusdespojado.org/triduo-ntra-senora-del-mayor-dolor/', 'Web oficial', 'Hermandad de Jesús Despojado', null::date, 'Regla anual de los cultos de mayo.'),
    ('Otros cultos · Hermandad de Jesús Despojado', 'https://jesusdespojado.org/otros-cultos/', 'Web oficial', 'Hermandad de Jesús Despojado', null::date, 'Jubileo Circular, Vía Crucis y Rosario Vespertino recurrentes.'),
    ('Calendario de cultos septiembre 2025 a junio 2026', 'https://jesusdespojado.org/2025/09/14/calendario-cultos-septiembre-2025-junio-2026/', 'Web oficial', 'Hermandad de Jesús Despojado', date '2025-09-14', 'Fechas concretas de los cultos 2025-2026.'),
    ('Función Principal Histórica · 2026', 'https://jesusdespojado.org/2026/02/09/funcion-principal-historica/', 'Web oficial', 'Hermandad de Jesús Despojado', date '2026-02-09', 'Confirmación posterior del Quinario y la Función Principal de 2026.'),
    ('Rosario Vespertino · 2025', 'https://jesusdespojado.org/2025/10/05/rosario-vespertino/', 'Web oficial', 'Hermandad de Jesús Despojado', date '2025-10-05', 'Confirmación de la primera edición y de sus acompañamientos musicales.'),
    ('Papeletas de sitio Domingo de Ramos 2026', 'https://jesusdespojado.org/2026/01/24/papeletas-de-sitio-domingo-de-ramos-2026/', 'Web oficial', 'Hermandad de Jesús Despojado', date '2026-01-24', 'Fecha de la estación de penitencia de 2026.'),
    ('Itinerario y horario de la Cofradía', 'https://jesusdespojado.org/itinerarios-y-horarios-de-procesiones/', 'Web oficial', 'Hermandad de Jesús Despojado', null::date, 'Itinerario y horarios ordinarios publicados por la Hermandad.'),
    ('Nuestra Semana Santa · Virgen de los Reyes', 'https://www.virgendelosreyes.es/nuestra-semana-santa/', 'Web oficial de la formación', 'Agrupación Musical Virgen de los Reyes', null::date, 'Continuidad actual del acompañamiento a Jesús Despojado desde 2005.'),
    ('Domingo de Ramos 2026 · Jesús Despojado', 'https://periodistacofrade.blogspot.com/2026/04/domingo-de-ramos-2026-jesus-despojado.html', 'Crónica cofrade', 'Periodista Cofrade', date '2026-04-10', 'Crónica posterior que confirma la salida y el acompañamiento tras el misterio.')
  ) as d(name, url, source_type, publisher, publication_date, notes)
)
insert into public.sources (
  name, url, source_type, author_or_publisher,
  publication_date, accessed_at, notes
)
select d.name, d.url, d.source_type, d.publisher,
       d.publication_date, date '2026-09-05', d.notes
from source_data d
where not exists (select 1 from public.sources s where s.url = d.url);

insert into public.source_links (source_id, entity_id, scope, notes)
select s.id, i.id, 'Titular · cronología · iconografía',
       'Autoría anónima, datación, iconografía y ubicación actual.'
from public.sources s
join public.entities i on i.slug = 'nuestra-senora-mayor-dolor-jesus-despojado-sevilla'
where s.url = 'https://jesusdespojado.org/capilla-mayor/'
  and not exists (
    select 1 from public.source_links sl
    where sl.source_id = s.id and sl.entity_id = i.id
      and sl.scope = 'Titular · cronología · iconografía'
  );

with cult_source_data as (
  select * from (values
    ('Solemne Quinario a Nuestro Padre Jesús Despojado', 'https://jesusdespojado.org/quinario-ntro-padre-jesus-despojado/'),
    ('Función Principal de Instituto', 'https://jesusdespojado.org/quinario-ntro-padre-jesus-despojado/'),
    ('Veneración de Nuestro Padre Jesús Despojado', 'https://jesusdespojado.org/quinario-ntro-padre-jesus-despojado/'),
    ('Triduo a María Santísima de los Dolores y Misericordia', 'https://jesusdespojado.org/triduo-ma-stma-de-los-dolores-y-misericordia/'),
    ('Veneración de María Santísima de los Dolores y Misericordia', 'https://jesusdespojado.org/triduo-ma-stma-de-los-dolores-y-misericordia/'),
    ('Vía Crucis de Nuestro Padre Jesús Despojado', 'https://jesusdespojado.org/otros-cultos/'),
    ('Rosario Vespertino de María Santísima de los Dolores y Misericordia', 'https://jesusdespojado.org/otros-cultos/'),
    ('Triduo a Nuestra Señora del Mayor Dolor', 'https://jesusdespojado.org/triduo-ntra-senora-del-mayor-dolor/'),
    ('Jubileo Circular de las Cuarenta Horas', 'https://jesusdespojado.org/otros-cultos/')
  ) as d(cult_title, source_url)
)
insert into public.source_links (source_id, cult_id, scope, notes)
select s.id, c.id, 'Culto · regla recurrente', 'Regla anual publicada por la Hermandad.'
from cult_source_data d
join public.sources s on s.url = d.source_url
join public.cults c
  on c.brotherhood_entity_id = (select id from public.entities where slug = 'hermandad-jesus-despojado-sevilla')
 and c.title = d.cult_title
where not exists (
  select 1 from public.source_links sl
  where sl.source_id = s.id and sl.cult_id = c.id
    and sl.scope = 'Culto · regla recurrente'
);

with occurrence_source_data as (
  select * from (values
    ('Solemne Quinario a Nuestro Padre Jesús Despojado', 2026, date '2026-02-03', 'https://jesusdespojado.org/2026/02/09/funcion-principal-historica/', 'Culto celebrado · Quinario 2026'),
    ('Función Principal de Instituto', 2026, date '2026-02-08', 'https://jesusdespojado.org/2026/02/09/funcion-principal-historica/', 'Culto celebrado · Función Principal 2026'),
    ('Rosario Vespertino de María Santísima de los Dolores y Misericordia', 2025, date '2025-10-04', 'https://jesusdespojado.org/2025/10/05/rosario-vespertino/', 'Culto celebrado · Rosario 2025')
  ) as d(cult_title, year, start_date, source_url, scope)
)
insert into public.source_links (source_id, cult_occurrence_id, scope, notes)
select s.id, co.id, d.scope, 'Crónica oficial posterior a la celebración.'
from occurrence_source_data d
join public.sources s on s.url = d.source_url
join public.cults c
  on c.brotherhood_entity_id = (select id from public.entities where slug = 'hermandad-jesus-despojado-sevilla')
 and c.title = d.cult_title
join public.cult_occurrences co
  on co.cult_id = c.id and co.year = d.year and co.start_date = d.start_date
where not exists (
  select 1 from public.source_links sl
  where sl.source_id = s.id and sl.cult_occurrence_id = co.id and sl.scope = d.scope
);

with outing_source_data as (
  select * from (values
    ('jesus-despojado-estacion-penitencia-2026', 'https://jesusdespojado.org/2026/01/24/papeletas-de-sitio-domingo-de-ramos-2026/', 'Salida · fecha oficial 2026'),
    ('jesus-despojado-estacion-penitencia-2026', 'https://jesusdespojado.org/itinerarios-y-horarios-de-procesiones/', 'Salida · horario e itinerario'),
    ('jesus-despojado-estacion-penitencia-2026', 'https://periodistacofrade.blogspot.com/2026/04/domingo-de-ramos-2026-jesus-despojado.html', 'Salida celebrada · contraste posterior'),
    ('jesus-despojado-rosario-vespertino-2025', 'https://jesusdespojado.org/2025/10/05/rosario-vespertino/', 'Salida celebrada · Rosario 2025')
  ) as d(outing_slug, source_url, scope)
)
insert into public.source_links (source_id, outing_id, scope, notes)
select s.id, o.id, d.scope, 'Evidencia documental de la salida.'
from outing_source_data d
join public.sources s on s.url = d.source_url
join public.outings o on o.slug = d.outing_slug
where not exists (
  select 1 from public.source_links sl
  where sl.source_id = s.id and sl.outing_id = o.id and sl.scope = d.scope
);

insert into public.source_links (source_id, outing_music_assignment_id, scope, notes)
select s.id, oma.id, 'Acompañamiento · continuidad vigente',
       'La formación publica a Jesús Despojado entre sus acompañamientos actuales desde 2005.'
from public.sources s
join public.outings o on o.slug = 'jesus-despojado-estacion-penitencia-2026'
join public.outing_music_positions pos on pos.outing_id = o.id
join public.outing_music_assignments oma on oma.music_position_id = pos.id
join public.entities b on b.id = oma.band_entity_id
where s.url = 'https://www.virgendelosreyes.es/nuestra-semana-santa/'
  and b.slug = 'agrupacion-musical-virgen-de-los-reyes-sevilla'
  and not exists (
    select 1 from public.source_links sl
    where sl.source_id = s.id and sl.outing_music_assignment_id = oma.id
      and sl.scope = 'Acompañamiento · continuidad vigente'
  );

insert into public.source_links (source_id, outing_music_assignment_id, scope, notes)
select s.id, oma.id, 'Acompañamiento · Rosario 2025',
       'La crónica oficial identifica las dos formaciones participantes.'
from public.sources s
join public.outings o on o.slug = 'jesus-despojado-rosario-vespertino-2025'
join public.outing_music_positions pos on pos.outing_id = o.id
join public.outing_music_assignments oma on oma.music_position_id = pos.id
where s.url = 'https://jesusdespojado.org/2025/10/05/rosario-vespertino/'
  and not exists (
    select 1 from public.source_links sl
    where sl.source_id = s.id and sl.outing_music_assignment_id = oma.id
      and sl.scope = 'Acompañamiento · Rosario 2025'
  );

insert into public.source_links (source_id, entity_id, scope, notes)
select s.id, h.id, d.scope, d.notes
from public.entities h
join lateral (values
  ('https://jesusdespojado.org/titulo-de-la-hermandad/', 'Identidad · título corporativo', 'Título oficial y advocaciones titulares.'),
  ('https://jesusdespojado.org/2025/09/14/calendario-cultos-septiembre-2025-junio-2026/', 'Calendario cultual · 2025-2026', 'Fechas concretas sin convertir anuncios en hechos celebrados.'),
  ('https://www.virgendelosreyes.es/nuestra-semana-santa/', 'Música · continuidad actual', 'Acompañamiento actual tras el misterio.')
) as d(url, scope, notes) on true
join public.sources s on s.url = d.url
where h.slug = 'hermandad-jesus-despojado-sevilla'
  and not exists (
    select 1 from public.source_links sl
    where sl.source_id = s.id and sl.entity_id = h.id and sl.scope = d.scope
  );
