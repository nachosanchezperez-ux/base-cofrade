-- Agenda cofrade · Sevilla y provincia · 10-12 octubre 2026
-- DML idempotente. No modifica esquema.
-- Alcance:
--   1) Rosario del Barrio León: recorrido, entrada 23:30 y Las Cigarreras.
--   2) Montserrat: traslado de regreso del Rosario, sin fabricar hora/itinerario.
--   3) San Jerónimo: procesión del Rosario, sin reutilizar datos de años anteriores.
--   4) Santiponce: procesión del Rosario Coronada, 20:00 y acompañamiento de La Puebla del Río.
--   5) Belén de Pilas: normalización de salida/entrada a campos estructurados.
--   6) Madre de Dios del Rosario: salida extraordinariamente matinal a las 09:30.
--
-- Preparado el 2026-10-06. Aplicación a producción pendiente de conexión Supabase.

begin;

-- ---------------------------------------------------------------------------
-- 1 · ROSARIO DEL BARRIO LEÓN · 10 OCTUBRE
-- ---------------------------------------------------------------------------

update public.outings
set
  return_time = time '23:30',
  route_summary = 'Plaza de San Gonzalo → Bienvenido Puelles Oliver → Dolores León → Avenida de Coria → Residencia Nuestra Señora de la Consolación → Plaza de San Martín de Porres → Asturias → Evangelista → Juan Díaz de Solís → Lorenzo Leal → Avenida de Alvar Núñez → Francisco Collantes de Terán → Padre Maruri → Ángel Solans → José León Sanz → Enrique León → Regla León → José León → Giralda → Azucena → Plaza de San Gonzalo.',
  public_notes = 'Salida a las 18:30 y entrada prevista a las 23:30. Acompañamiento musical: Banda de Música María Santísima de la Victoria «Las Cigarreras» durante el recorrido.',
  updated_at = now()
where slug = 'gloria-barrio-leon-2026';

delete from public.outing_route_points
where outing_id = (
  select id from public.outings where slug = 'gloria-barrio-leon-2026' limit 1
);

insert into public.outing_route_points
  (outing_id, sequence_no, point_type, label, planned_time, notes)
select o.id, v.sequence_no, v.point_type, v.label, v.planned_time, v.notes
from public.outings o
cross join (values
  (1,  'place',  'Plaza de San Gonzalo',                    time '18:30', 'Salida'),
  (2,  'street', 'Bienvenido Puelles Oliver',               null::time,    null::text),
  (3,  'street', 'Dolores León',                            null::time,    null::text),
  (4,  'street', 'Avenida de Coria',                        null::time,    null::text),
  (5,  'place',  'Residencia Nuestra Señora de la Consolación', null::time, null::text),
  (6,  'place',  'Plaza de San Martín de Porres',           null::time,    null::text),
  (7,  'street', 'Asturias',                                null::time,    null::text),
  (8,  'street', 'Evangelista',                             null::time,    null::text),
  (9,  'street', 'Juan Díaz de Solís',                      null::time,    null::text),
  (10, 'street', 'Lorenzo Leal',                            null::time,    null::text),
  (11, 'street', 'Avenida de Alvar Núñez',                  null::time,    null::text),
  (12, 'street', 'Francisco Collantes de Terán',            null::time,    null::text),
  (13, 'street', 'Padre Maruri',                            null::time,    null::text),
  (14, 'street', 'Ángel Solans',                            null::time,    null::text),
  (15, 'street', 'José León Sanz',                          null::time,    null::text),
  (16, 'street', 'Enrique León',                            null::time,    null::text),
  (17, 'street', 'Regla León',                              null::time,    null::text),
  (18, 'street', 'José León',                               null::time,    null::text),
  (19, 'street', 'Giralda',                                 null::time,    null::text),
  (20, 'street', 'Azucena',                                 null::time,    null::text),
  (21, 'place',  'Plaza de San Gonzalo',                    time '23:30', 'Entrada')
) as v(sequence_no, point_type, label, planned_time, notes)
where o.slug = 'gloria-barrio-leon-2026';

delete from public.outing_music_positions
where outing_id = (
  select id from public.outings where slug = 'gloria-barrio-leon-2026' limit 1
);

insert into public.outing_music_positions
  (outing_id, position_code, position_label, sequence_no, notes, status)
select
  id,
  'behind_glory',
  'Tras Nuestra Señora del Rosario',
  1,
  'Acompañamiento musical de la procesión de 2026.',
  'published'
from public.outings
where slug = 'gloria-barrio-leon-2026';

insert into public.outing_music_assignments
  (music_position_id, band_entity_id, band_name_text, participation_mode, sequence_no, notes, status)
select
  omp.id,
  (
    select e.id
    from public.entities e
    where e.entity_type = 'band'
      and e.slug = 'banda-musica-maria-santisima-victoria-las-cigarreras'
      and e.status = 'published'
    limit 1
  ),
  'Banda de Música María Santísima de la Victoria «Las Cigarreras»',
  'full_route',
  1,
  'Formación confirmada para la procesión del 10 de octubre de 2026.',
  'published'
from public.outing_music_positions omp
join public.outings o on o.id = omp.outing_id
where o.slug = 'gloria-barrio-leon-2026'
  and omp.position_code = 'behind_glory';

insert into public.sources
  (name, url, source_type, author_or_publisher, publication_date, accessed_at, notes)
select
  'Cultos de Nuestra Señora del Rosario del Barrio León · octubre 2026',
  'https://www.artesacro.org/Noticia/Ver/169083/cultos-nuestra-senora-rosario-barrio-leon',
  'Prensa cofrade',
  'ArteSacro',
  date '2026-09-30',
  date '2026-10-06',
  'Horario, itinerario y entrada de la procesión del 10 de octubre de 2026.'
where not exists (
  select 1 from public.sources
  where url = 'https://www.artesacro.org/Noticia/Ver/169083/cultos-nuestra-senora-rosario-barrio-leon'
);

insert into public.sources
  (name, url, source_type, author_or_publisher, publication_date, accessed_at, notes)
select
  'Las Cigarreras acompañará al Rosario del Barrio León · 2026',
  'https://www.gentedepaz.es/la-hermandad-del-rosario-de-barrio-leon-formaliza-el-acompanamiento-musical-de-las-cigarreras-para-la-procesion-triunfal-de-octubre/',
  'Prensa cofrade',
  'Gente de Paz',
  date '2026-05-27',
  date '2026-10-06',
  'Confirmación del acompañamiento de la Banda de Música de Las Cigarreras.'
where not exists (
  select 1 from public.sources
  where url = 'https://www.gentedepaz.es/la-hermandad-del-rosario-de-barrio-leon-formaliza-el-acompanamiento-musical-de-las-cigarreras-para-la-procesion-triunfal-de-octubre/'
);

insert into public.source_links (source_id, outing_id, scope, notes)
select s.id, o.id, 'outing', 'Horario e itinerario 2026.'
from public.sources s
join public.outings o on o.slug = 'gloria-barrio-leon-2026'
where s.url = 'https://www.artesacro.org/Noticia/Ver/169083/cultos-nuestra-senora-rosario-barrio-leon'
  and not exists (
    select 1 from public.source_links sl
    where sl.source_id = s.id and sl.outing_id = o.id
  );

insert into public.source_links (source_id, outing_id, scope, notes)
select s.id, o.id, 'outing', 'Acompañamiento musical 2026.'
from public.sources s
join public.outings o on o.slug = 'gloria-barrio-leon-2026'
where s.url = 'https://www.gentedepaz.es/la-hermandad-del-rosario-de-barrio-leon-formaliza-el-acompanamiento-musical-de-las-cigarreras-para-la-procesion-triunfal-de-octubre/'
  and not exists (
    select 1 from public.source_links sl
    where sl.source_id = s.id and sl.outing_id = o.id
  );

-- ---------------------------------------------------------------------------
-- 2 · MONTSERRAT · TRASLADO DE REGRESO DEL ROSARIO · 10 OCTUBRE
-- ---------------------------------------------------------------------------

insert into public.outings (
  brotherhood_entity_id, outing_type, character, title, outing_date, year,
  departure_time, return_time, municipality_id,
  reason, description, event_status, status, route_summary, public_notes,
  organizer_name, slug, origin_text, destination_text
)
select
  (select id from public.entities where slug = 'montserrat' and entity_type = 'brotherhood' limit 1),
  'Traslado extraordinario',
  'extraordinary',
  'Traslado de regreso de Nuestra Señora del Rosario · 425 aniversario fundacional · 2026',
  date '2026-10-10',
  2026,
  null,
  null,
  (select id from public.municipalities where slug = 'sevilla' or name = 'Sevilla' limit 1),
  '425.º aniversario fundacional de la Hermandad de Montserrat.',
  'Traslado de regreso en andas de Nuestra Señora del Rosario desde la Capilla de Montserrat hasta la Real Parroquia de Santa María Magdalena.',
  'announced',
  'published',
  null,
  'La convocatoria del 425.º aniversario sitúa el traslado en la tarde del 10 de octubre de 2026. La hora concreta y el itinerario permanecen pendientes de publicación; no se reutilizan datos de otros años.',
  'Hermandad de Montserrat',
  'sevilla-montserrat-rosario-regreso-2026-10-10',
  'Capilla de Montserrat',
  'Real Parroquia de Santa María Magdalena'
where not exists (
  select 1 from public.outings
  where slug = 'sevilla-montserrat-rosario-regreso-2026-10-10'
);

insert into public.sources
  (name, url, source_type, author_or_publisher, publication_date, accessed_at, notes)
select
  'Programa del 425.º aniversario fundacional de Montserrat · octubre 2026',
  'https://www.diariodesevilla.es/semana_santa/via-crucis-extraordinario-cristo-conversion_0_2005156845.amp.html',
  'Prensa local',
  'Diario de Sevilla',
  null,
  date '2026-10-06',
  'Confirma el traslado de regreso de Nuestra Señora del Rosario el 10 de octubre, por la tarde y con hora aún por concretar.'
where not exists (
  select 1 from public.sources
  where url = 'https://www.diariodesevilla.es/semana_santa/via-crucis-extraordinario-cristo-conversion_0_2005156845.amp.html'
);

insert into public.source_links (source_id, outing_id, scope, notes)
select s.id, o.id, 'outing', 'Fecha y carácter del traslado de regreso.'
from public.sources s
join public.outings o on o.slug = 'sevilla-montserrat-rosario-regreso-2026-10-10'
where s.url = 'https://www.diariodesevilla.es/semana_santa/via-crucis-extraordinario-cristo-conversion_0_2005156845.amp.html'
  and not exists (
    select 1 from public.source_links sl
    where sl.source_id = s.id and sl.outing_id = o.id
  );

-- ---------------------------------------------------------------------------
-- 3 · SAN JERÓNIMO · ROSARIO · 10 OCTUBRE
-- ---------------------------------------------------------------------------

insert into public.outings (
  brotherhood_entity_id, outing_type, character, title, outing_date, year,
  departure_time, return_time, municipality_id,
  reason, description, event_status, status, route_summary, public_notes,
  organizer_name, slug, origin_text, destination_text
)
select
  (select id from public.entities where slug = 'san-jeronimo-sevilla' and entity_type = 'brotherhood' limit 1),
  'Procesión de Gloria',
  'ordinary',
  'Procesión de Nuestra Señora del Rosario de San Jerónimo · 2026',
  date '2026-10-10',
  2026,
  null,
  null,
  (select id from public.municipalities where slug = 'sevilla' or name = 'Sevilla' limit 1),
  'Procesión anual de Nuestra Señora del Rosario.',
  'Procesión de Nuestra Señora del Rosario de San Jerónimo prevista para el sábado 10 de octubre de 2026.',
  'announced',
  'published',
  null,
  'Horario, itinerario y acompañamiento musical de 2026 pendientes de una publicación fiable. No se reutilizan horarios, recorridos ni bandas de ediciones anteriores.',
  'San Jerónimo',
  'sevilla-san-jeronimo-rosario-2026-10-10',
  'San Jerónimo · Sevilla',
  'San Jerónimo · Sevilla'
where not exists (
  select 1 from public.outings
  where slug = 'sevilla-san-jeronimo-rosario-2026-10-10'
);

insert into public.sources
  (name, url, source_type, author_or_publisher, publication_date, accessed_at, notes)
select
  'Igualá y ensayos del paso de la Virgen del Rosario de San Jerónimo · 2026',
  'https://www.artesacro.org/Noticia/Ver/168543/faja-y-costal-hoy-ensayo-paso-virgen-rosario-san-jeronimo',
  'Prensa cofrade',
  'ArteSacro',
  date '2026-09-17',
  date '2026-10-06',
  'Confirma la procesión de 2026 para el 10 de octubre. No se extrapolan itinerarios ni horarios de años anteriores.'
where not exists (
  select 1 from public.sources
  where url = 'https://www.artesacro.org/Noticia/Ver/168543/faja-y-costal-hoy-ensayo-paso-virgen-rosario-san-jeronimo'
);

insert into public.source_links (source_id, outing_id, scope, notes)
select s.id, o.id, 'outing', 'Confirmación de la fecha de la procesión 2026.'
from public.sources s
join public.outings o on o.slug = 'sevilla-san-jeronimo-rosario-2026-10-10'
where s.url = 'https://www.artesacro.org/Noticia/Ver/168543/faja-y-costal-hoy-ensayo-paso-virgen-rosario-san-jeronimo'
  and not exists (
    select 1 from public.source_links sl
    where sl.source_id = s.id and sl.outing_id = o.id
  );

-- ---------------------------------------------------------------------------
-- 4 · SANTIPONCE · ROSARIO CORONADA · 10 OCTUBRE
-- ---------------------------------------------------------------------------

insert into public.municipalities (name, slug)
select 'Santiponce', 'santiponce'
where not exists (
  select 1 from public.municipalities
  where slug = 'santiponce' or name = 'Santiponce'
);

insert into public.outings (
  brotherhood_entity_id, outing_type, character, title, outing_date, year,
  departure_time, return_time, municipality_id,
  reason, description, event_status, status, route_summary, public_notes,
  organizer_name, slug, origin_text, destination_text
)
select
  null,
  'Procesión de Gloria',
  'ordinary',
  'Procesión de Gloria de Nuestra Señora del Rosario Coronada · Santiponce · 2026',
  date '2026-10-10',
  2026,
  time '20:00',
  null,
  (select id from public.municipalities where slug = 'santiponce' limit 1),
  'Procesión de Gloria de la Patrona y Alcaldesa Perpetua de Santiponce.',
  'Procesión anual de Nuestra Señora del Rosario Coronada por las calles de Santiponce.',
  'announced',
  'published',
  'Avenida de Extremadura → Manuel González Rodríguez → Adriano → Juan Sebastián Elcano → Trajano → Manuel González Rodríguez → Alcalde Cipriano Moreno → Plaza de la Constitución → Clavel → San Antonio → Eduardo Ybarra → Mesón → Real → Plaza de la Constitución → Las Musas → Avenida de Extremadura.',
  'Salida a las 20:00. Acompañamiento musical: Banda Municipal de Música de La Puebla del Río. La web oficial advierte que en años especiales la Junta de Gobierno puede ampliar el itinerario a otras zonas; no consta por ahora una ampliación específica publicada para 2026.',
  'Hermandad Sacramental del Rosario de Santiponce',
  'santiponce-rosario-coronada-2026-10-10',
  'Parroquia de San Isidoro del Campo y San Geroncio de Itálica',
  'Parroquia de San Isidoro del Campo y San Geroncio de Itálica'
where not exists (
  select 1 from public.outings
  where slug = 'santiponce-rosario-coronada-2026-10-10'
);

delete from public.outing_music_positions
where outing_id = (
  select id from public.outings where slug = 'santiponce-rosario-coronada-2026-10-10' limit 1
);

insert into public.outing_music_positions
  (outing_id, position_code, position_label, sequence_no, notes, status)
select
  id,
  'behind_glory',
  'Tras Nuestra Señora del Rosario Coronada',
  1,
  'Acompañamiento musical publicado por la Hermandad.',
  'published'
from public.outings
where slug = 'santiponce-rosario-coronada-2026-10-10';

insert into public.outing_music_assignments
  (music_position_id, band_entity_id, band_name_text, participation_mode, sequence_no, notes, status)
select
  omp.id,
  (
    select e.id
    from public.entities e
    where e.entity_type = 'band'
      and e.status = 'published'
      and (
        e.name ilike '%Municipal%Puebla del Río%'
        or e.name ilike '%Música%Puebla del Río%'
      )
    order by e.name
    limit 1
  ),
  'Banda Municipal de Música de La Puebla del Río',
  'full_route',
  1,
  'Acompañamiento tras la Virgen según la información oficial de la Hermandad.',
  'published'
from public.outing_music_positions omp
join public.outings o on o.id = omp.outing_id
where o.slug = 'santiponce-rosario-coronada-2026-10-10'
  and omp.position_code = 'behind_glory';

insert into public.sources
  (name, url, source_type, author_or_publisher, publication_date, accessed_at, notes)
select
  'Procesión de Gloria de la Patrona · Hermandad del Rosario de Santiponce',
  'https://hermandaddelrosario.org/cofradia/procesion-de-gloria-de-la-patrona/',
  'Web oficial',
  'Hermandad del Rosario de Santiponce',
  null,
  date '2026-10-06',
  'Fuente oficial de horario habitual, itinerario y acompañamiento musical de la procesión de Gloria.'
where not exists (
  select 1 from public.sources
  where url = 'https://hermandaddelrosario.org/cofradia/procesion-de-gloria-de-la-patrona/'
);

insert into public.source_links (source_id, outing_id, scope, notes)
select s.id, o.id, 'outing', 'Horario, itinerario y acompañamiento musical.'
from public.sources s
join public.outings o on o.slug = 'santiponce-rosario-coronada-2026-10-10'
where s.url = 'https://hermandaddelrosario.org/cofradia/procesion-de-gloria-de-la-patrona/'
  and not exists (
    select 1 from public.source_links sl
    where sl.source_id = s.id and sl.outing_id = o.id
  );

-- ---------------------------------------------------------------------------
-- 5 · BELÉN CORONADA DE PILAS · 11 OCTUBRE
-- ---------------------------------------------------------------------------

update public.outings
set
  departure_time = time '18:30',
  return_time = time '22:45',
  updated_at = now()
where slug = 'pilas-belen-coronada-2026-10-11';

-- ---------------------------------------------------------------------------
-- 6 · MADRE DE DIOS DEL ROSARIO · 12 OCTUBRE
-- ---------------------------------------------------------------------------

update public.outings
set
  departure_time = time '09:30',
  public_notes = case
    when coalesce(public_notes, '') ilike '%09:30%' then public_notes
    else concat_ws(
      ' ',
      nullif(public_notes, ''),
      'En 2026 la procesión comenzará a las 09:30 y se celebrará por primera vez en horario matinal, conforme al acuerdo aprobado por la Hermandad en septiembre.'
    )
  end,
  updated_at = now()
where slug = 'gloria-madre-dios-2026';

insert into public.sources
  (name, url, source_type, author_or_publisher, publication_date, accessed_at, notes)
select
  'Madre de Dios del Rosario realizará por primera vez su salida en horario matinal · 2026',
  'https://www.gentedepaz.es/madre-de-dios-del-rosario-realizara-por-primera-vez-su-salida-procesional-en-horario-matinal-el-proximo-12-de-octubre/',
  'Prensa cofrade',
  'Gente de Paz',
  date '2026-09-15',
  date '2026-10-06',
  'Confirma la salida del 12 de octubre de 2026 a las 09:30 y el cambio extraordinario a horario matinal.'
where not exists (
  select 1 from public.sources
  where url = 'https://www.gentedepaz.es/madre-de-dios-del-rosario-realizara-por-primera-vez-su-salida-procesional-en-horario-matinal-el-proximo-12-de-octubre/'
);

insert into public.source_links (source_id, outing_id, scope, notes)
select s.id, o.id, 'outing', 'Hora de salida 2026 y cambio a horario matinal.'
from public.sources s
join public.outings o on o.slug = 'gloria-madre-dios-2026'
where s.url = 'https://www.gentedepaz.es/madre-de-dios-del-rosario-realizara-por-primera-vez-su-salida-procesional-en-horario-matinal-el-proximo-12-de-octubre/'
  and not exists (
    select 1 from public.source_links sl
    where sl.source_id = s.id and sl.outing_id = o.id
  );

commit;
