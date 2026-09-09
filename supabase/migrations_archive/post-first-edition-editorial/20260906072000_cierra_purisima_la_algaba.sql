-- Hilo Cofrade · cierre avanzado de la Purísima de La Algaba
-- Corte editorial: 2026-09-06
-- Solo DML editorial. Sin DDL, RLS, arquitectura ni UX.
-- Actualidad estricta: la música de 2026 permanece sin confirmar.

-- Fuentes contrastadas.
with source_data(name, url, source_type, publisher, publication_date, notes) as (
  values
    ('Pastoral de Hermandades · Purísima Concepción de María Coronada de La Algaba',
     'https://www.cofradiasyhermandades.es/fichacofradia-COFRADIA-LaAlgaba-Purisima-cTJhbVQwU2VuUlpjYVY1OTVMM2k1QT09',
     'Institucional', 'Consejo Diocesano para las Hermandades y Cofradías de la Archidiócesis de Sevilla', null::date,
     'Directorio institucional: aprobación de reglas, sede canónica y sede social.'),
    ('Ayuntamiento de La Algaba · Ermita de San Salvador e Inmaculada Concepción Coronada',
     'https://www.laalgaba.es/es/municipio/turismo/monumentos/',
     'Institucional', 'Ayuntamiento de La Algaba', null::date,
     'Ficha municipal de patrimonio y romería: ermita, residencia devocional, descripción de la imagen y coronación en 2004.'),
    ('Ayuntamiento de La Algaba · Romería 2026',
     'https://www.laalgaba.es/es/actualidad/eventos/Romeria-2026-00003',
     'Institucional', 'Ayuntamiento de La Algaba', null::date,
     'Programa municipal de la Romería 2026; el cuerpo fija el domingo 14 de junio, Misa de Romeros a las 08:00 y salida a las 09:00.'),
    ('Hermandad de la Purísima · Historia',
     'https://hdadpurisimaconcepcionlaalgaba.blogspot.com/p/historia.html',
     'Hermandad', 'Hermandad de la Purísima Concepción de María Coronada de La Algaba', null::date,
     'Historia publicada por la Hermandad, apoyada en bibliografía local y fondos históricos.'),
    ('Hermandad de la Purísima · Datos históricos',
     'https://hdadpurisimaconcepcionlaalgaba.blogspot.com/p/pagina-principal.html',
     'Hermandad', 'Hermandad de la Purísima Concepción de María Coronada de La Algaba', null::date,
     'Cronología histórica: devoción documentada, reglas de 1870, primera Romería de 1935 y coronación de 2004.'),
    ('Arte Sacro · Investigación sobre la intervención de 1929',
     'https://www.artesacro.org/Noticia/Ver/95040/investigacion-1929-ano-que-se-cambio-purisima-concepcion-algabena-virgen',
     'Prensa especializada', 'Arte Sacro', date '2014-05-12',
     'Investigación con documentación parroquial sobre el incendio y la intervención de Antonio Castillo Lastrucci en 1929.'),
    ('Arte Sacro · Procesión de la Purísima de La Algaba 2021',
     'https://www.artesacro.org/Noticia/Ver/141459/provincia-algaba-se-rindio-ante-purisima-concepcion-coronada',
     'Prensa especializada', 'Arte Sacro', date '2021-09-27',
     'Crónica contemporánea: talla anónima del siglo XVIII y paso de plata.'),
    ('Arte Sacro · La Algaba espera a la Purísima Coronada 2011',
     'https://www.artesacro.org/Noticia.asp?idreg=71132',
     'Prensa especializada', 'Arte Sacro', date '2011-09-22',
     'Documenta el acompañamiento de la Asociación Musical de La Algaba en la procesión de 2011.'),
    ('Arte Sacro · Procesión de la Purísima de La Algaba 2017',
     'https://www.artesacro.org/Noticia/Ver/119701/provincia-algaba-y-sol-acompanaron-purisima-coronada-su-tradicional',
     'Prensa especializada', 'Arte Sacro', date '2017-09-27',
     'Documenta el acompañamiento de la Asociación Musical de La Algaba en la procesión de 2017.')
)
insert into public.sources (
  name, url, source_type, author_or_publisher, publication_date, accessed_at, notes
)
select name, url, source_type, publisher, publication_date, date '2026-09-06', notes
from source_data d
where not exists (select 1 from public.sources s where s.url = d.url);

-- Sede canónica y residencia devocional: son realidades distintas.
insert into public.places (municipality_id, name, slug, place_type, address, notes)
select m.id,
       'Iglesia Parroquial de Nuestra Señora de las Nieves',
       'iglesia-nuestra-senora-nieves-la-algaba',
       'Parroquia',
       'Plaza de España, 11, 41980 La Algaba, Sevilla',
       'Sede canónica de la Hermandad de la Purísima Concepción de María Coronada.'
from public.municipalities m
where m.slug = 'la-algaba'
  and not exists (
    select 1 from public.places p where p.slug = 'iglesia-nuestra-senora-nieves-la-algaba'
  );

insert into public.places (municipality_id, name, slug, place_type, address, notes)
select m.id,
       'Ermita de San Salvador e Inmaculada Concepción',
       'ermita-san-salvador-inmaculada-el-aral',
       'Ermita',
       'Plaza de la Purísima, barrio de El Aral, La Algaba, Sevilla',
       'Santuario y residencia devocional habitual de la Purísima Concepción de María Coronada.'
from public.municipalities m
where m.slug = 'la-algaba'
  and not exists (
    select 1 from public.places p where p.slug = 'ermita-san-salvador-inmaculada-el-aral'
  );

update public.entities
set summary = 'Hermandad de Gloria de La Algaba vinculada a la Purísima Concepción de María Coronada, con sede canónica en Nuestra Señora de las Nieves y santuario devocional en El Aral.',
    updated_at = now()
where slug = 'purisima-de-la-algaba';

update public.brotherhoods
set official_name = 'Hermandad de la Purísima Concepción de María Coronada',
    popular_name = 'Purísima de La Algaba',
    foundation_text = 'Reglas redactadas el 21 de octubre de 1870 y aprobadas el 11 de noviembre de 1870; la devoción local está documentada desde el siglo XVI.',
    canonical_see_place_id = (select id from public.places where slug = 'iglesia-nuestra-senora-nieves-la-algaba'),
    history_text = 'La devoción a la Purísima Concepción está documentada en La Algaba desde el siglo XVI. La Hermandad conserva reglas redactadas en 1870 y aprobadas el 11 de noviembre de ese año. La Romería anual al barrio de El Aral se organiza de forma periódica desde 1935. La imagen fue coronada canónicamente el 23 de mayo de 2004 por fray Carlos Amigo Vallejo.'
where entity_id = (select id from public.entities where slug = 'purisima-de-la-algaba');

-- Titular.
insert into public.entities (entity_type, name, slug, summary, status)
select 'image',
       'Purísima Concepción de María Coronada',
       'purisima-concepcion-maria-coronada-la-algaba',
       'Imagen de vestir de la Inmaculada Concepción, talla anónima del siglo XVIII venerada en la Ermita de El Aral y coronada canónicamente en 2004.',
       'published'
where not exists (
  select 1 from public.entities where slug = 'purisima-concepcion-maria-coronada-la-algaba'
);

update public.entities
set name = 'Purísima Concepción de María Coronada',
    summary = 'Imagen de vestir de la Inmaculada Concepción, talla anónima del siglo XVIII venerada en la Ermita de El Aral y coronada canónicamente en 2004.',
    status = 'published',
    updated_at = now()
where slug = 'purisima-concepcion-maria-coronada-la-algaba';

insert into public.images (
  entity_id, image_type, execution_date_text, current_condition,
  description, iconography, anatomical_type, is_dress_image, current_state_notes
)
select i.id,
       'Inmaculada Concepción',
       'Siglo XVIII',
       'extant',
       'Imagen barroca de la Inmaculada, vestida tradicionalmente de blanco y celeste, con pelo natural, ráfaga de plata y corona de oro.',
       'Inmaculada Concepción',
       'Imagen de vestir',
       true,
       'La bibliografía reciente mantiene la autoría como anónima. La imagen recibió una intervención documentada de Antonio Castillo Lastrucci en 1929.'
from public.entities i
where i.slug = 'purisima-concepcion-maria-coronada-la-algaba'
on conflict (entity_id) do update set
  image_type = excluded.image_type,
  execution_date_text = excluded.execution_date_text,
  current_condition = excluded.current_condition,
  description = excluded.description,
  iconography = excluded.iconography,
  anatomical_type = excluded.anatomical_type,
  is_dress_image = excluded.is_dress_image,
  current_state_notes = excluded.current_state_notes;

insert into public.image_authorships (
  image_entity_id, agent_entity_id, authorship_type, role_name,
  date_from_text, certainty, notes, status
)
select i.id, null, 'anonymous', 'Autor desconocido',
       'Siglo XVIII', 'unknown',
       'Las fuentes contemporáneas consultadas mantienen la talla como anónima.',
       'published'
from public.entities i
where i.slug = 'purisima-concepcion-maria-coronada-la-algaba'
  and not exists (
    select 1 from public.image_authorships ia
    where ia.image_entity_id = i.id and ia.authorship_type = 'anonymous'
  );

insert into public.brotherhood_images (
  brotherhood_entity_id, image_entity_id, relation_type, date_from_text, notes, status
)
select h.id, i.id, 'Titular', 'Titular histórica',
       'Titular mariana de la Hermandad de la Purísima Concepción de María Coronada.',
       'published'
from public.entities h
join public.entities i on i.slug = 'purisima-concepcion-maria-coronada-la-algaba'
where h.slug = 'purisima-de-la-algaba'
  and not exists (
    select 1 from public.brotherhood_images bi
    where bi.brotherhood_entity_id = h.id and bi.image_entity_id = i.id
  );

insert into public.entity_locations (
  entity_id, place_id, municipality_id, location_type,
  date_from_text, is_current, notes, status
)
select i.id, p.id, m.id,
       'Residencia devocional habitual', 'Histórica', true,
       'La Ermita de El Aral es la residencia devocional habitual; la imagen se traslada temporalmente a la parroquia para cultos, romería y fiestas.',
       'published'
from public.entities i
join public.places p on p.slug = 'ermita-san-salvador-inmaculada-el-aral'
join public.municipalities m on m.slug = 'la-algaba'
where i.slug = 'purisima-concepcion-maria-coronada-la-algaba'
  and not exists (
    select 1 from public.entity_locations el
    where el.entity_id = i.id and el.place_id = p.id
      and el.location_type = 'Residencia devocional habitual'
  );

-- Paso procesional.
insert into public.entities (entity_type, name, slug, summary, status)
select 'step',
       'Paso de la Purísima Concepción de María Coronada',
       'paso-purisima-concepcion-la-algaba',
       'Paso de Gloria de la Purísima Concepción de María Coronada, documentado en crónicas recientes como paso de plata.',
       'published'
where not exists (
  select 1 from public.entities where slug = 'paso-purisima-concepcion-la-algaba'
);

insert into public.steps (
  entity_id, step_type, current_condition, description, current_state_notes
)
select st.id, 'Paso de Gloria', 'preserved',
       'Paso procesional de la Purísima Concepción de María Coronada, descrito en 2021 como paso de plata.',
       'No se fija autoría, fecha de ejecución ni número actual de costaleros sin una fuente contemporánea unívoca.'
from public.entities st
where st.slug = 'paso-purisima-concepcion-la-algaba'
on conflict (entity_id) do update set
  step_type = excluded.step_type,
  current_condition = excluded.current_condition,
  description = excluded.description,
  current_state_notes = excluded.current_state_notes;

insert into public.brotherhood_steps (
  brotherhood_entity_id, step_entity_id, relation_type, date_from_text, notes, status
)
select h.id, st.id, 'Paso procesional', 'Actual',
       'Paso relacionado con la procesión gloriosa de la titular.', 'published'
from public.entities h
join public.entities st on st.slug = 'paso-purisima-concepcion-la-algaba'
where h.slug = 'purisima-de-la-algaba'
  and not exists (
    select 1 from public.brotherhood_steps bs
    where bs.brotherhood_entity_id = h.id and bs.step_entity_id = st.id
  );

insert into public.image_steps (
  image_entity_id, step_entity_id, relation_type, date_from_text, notes, status
)
select i.id, st.id, 'Procesiona en', 'Actual',
       'La titular procesiona en este paso en su salida gloriosa.', 'published'
from public.entities i
join public.entities st on st.slug = 'paso-purisima-concepcion-la-algaba'
where i.slug = 'purisima-concepcion-maria-coronada-la-algaba'
  and not exists (
    select 1 from public.image_steps x
    where x.image_entity_id = i.id and x.step_entity_id = st.id
  );

-- Cultos recurrentes: se conserva la precisión real de las fuentes.
with cult_data as (
  select * from (values
    ('Misa de Romeros', 'Misa de Romeros en honor a la Purísima Concepción de María Coronada',
     'Mañana de la Romería, antes de la salida hacia El Aral', 6::smallint,
     'Eucaristía que precede la salida anual de la Romería.', 'Anual · junio', 10,
     'iglesia-nuestra-senora-nieves-la-algaba'),
    ('Fiesta', 'Fiesta de la Purísima', 'Segundo domingo de Adviento', 12::smallint,
     'Celebración tradicional de la Purísima documentada por la propia Hermandad desde los primeros años del siglo XVII.',
     'Segundo domingo de Adviento', 20, null::text),
    ('Novena', 'Novena de rogativas a la Purísima Concepción',
     'En febrero; la tradición documentada incluye el día 5', 2::smallint,
     'Novena de rogativas instituida en 1756 y descrita por la Hermandad como tradición mantenida.',
     'Anual · febrero', 30, null::text)
  ) as d(cult_type, title, date_rule, month, description, recurrence_label, display_order, place_slug)
)
insert into public.cults (
  brotherhood_entity_id, image_entity_id, cult_type, title, date_rule,
  month, place_id, description, status, is_recurring,
  recurrence_label, display_order, notes
)
select h.id, i.id, d.cult_type, d.title, d.date_rule, d.month, p.id,
       d.description, 'published', true, d.recurrence_label, d.display_order,
       'Regla cultual conservada con la precisión que permiten las fuentes; no se proyectan horarios históricos como actuales.'
from cult_data d
join public.entities h on h.slug = 'purisima-de-la-algaba'
join public.entities i on i.slug = 'purisima-concepcion-maria-coronada-la-algaba'
left join public.places p on p.slug = d.place_slug
where not exists (
  select 1 from public.cults c
  where c.brotherhood_entity_id = h.id and c.title = d.title
);

-- Romería 2026. Se conserva announced al no usar una crónica posterior de celebración.
insert into public.outings (
  brotherhood_entity_id, outing_type, "character", title, outing_date,
  year, departure_time, municipality_id, origin_place_id, origin_text,
  destination_place_id, destination_text, reason, route_summary,
  description, public_notes, event_status, status, slug, reference_code, organizer_name
)
select h.id, 'Romería', 'ordinary',
       'Romería de la Purísima Concepción de María Coronada 2026',
       date '2026-06-14', 2026, time '09:00', m.id,
       p1.id, p1.name, p2.id, p2.name,
       'Romería anual al barrio de El Aral',
       'Parroquia de Nuestra Señora de las Nieves → Camino de la Romería → Ermita de El Aral',
       'Salida de la titular hacia su santuario de El Aral después de la Misa de Romeros.',
       'El programa municipal fija la salida a las 09:00. Al no utilizarse una crónica posterior de 2026, el estado no se eleva artificialmente a celebrado.',
       'announced', 'published', 'purisima-la-algaba-romeria-2026',
       'LA-ALGABA-PURISIMA-ROMERIA-2026',
       'Hermandad de la Purísima Concepción de María Coronada'
from public.entities h
join public.municipalities m on m.slug = 'la-algaba'
join public.places p1 on p1.slug = 'iglesia-nuestra-senora-nieves-la-algaba'
join public.places p2 on p2.slug = 'ermita-san-salvador-inmaculada-el-aral'
where h.slug = 'purisima-de-la-algaba'
  and not exists (select 1 from public.outings o where o.slug = 'purisima-la-algaba-romeria-2026');

insert into public.outing_entities (outing_id, entity_id, role, notes)
select o.id, i.id, 'processional_image',
       'Titular trasladada en Romería desde la parroquia hasta la Ermita de El Aral.'
from public.outings o
join public.entities i on i.slug = 'purisima-concepcion-maria-coronada-la-algaba'
where o.slug = 'purisima-la-algaba-romeria-2026'
on conflict (outing_id, entity_id, role) do update set notes = excluded.notes;

-- Acontecimientos históricos principales.
with event_data as (
  select * from (values
    ('Aprobación de las primeras reglas documentadas de la Hermandad',
     'aprobacion-reglas-purisima-la-algaba-1870', 'Aprobación de reglas', date '1870-11-11',
     'Las reglas redactadas el 21 de octubre de 1870 fueron aprobadas el 11 de noviembre del mismo año.'),
    ('Primera Romería organizada de la Purísima de La Algaba',
     'primera-romeria-purisima-la-algaba-1935', 'Romería', date '1935-05-26',
     'La Hermandad sitúa el inicio de la Romería periódica actual el 26 de mayo de 1935.'),
    ('Coronación Canónica de la Purísima Concepción de María Coronada',
     'coronacion-canonica-purisima-la-algaba-2004', 'Coronación canónica', date '2004-05-23',
     'Fray Carlos Amigo Vallejo coronó canónicamente a la titular en la Plaza de España de La Algaba.')
  ) as d(name, slug, event_type, event_date, description)
)
insert into public.entities (entity_type, name, slug, summary, status)
select 'event', d.name, d.slug, d.description, 'published'
from event_data d
where not exists (select 1 from public.entities e where e.slug = d.slug);

with event_data as (
  select * from (values
    ('aprobacion-reglas-purisima-la-algaba-1870', 'Aprobación de reglas', date '1870-11-11',
     'Las reglas redactadas el 21 de octubre de 1870 fueron aprobadas el 11 de noviembre del mismo año.'),
    ('primera-romeria-purisima-la-algaba-1935', 'Romería', date '1935-05-26',
     'La Hermandad sitúa el inicio de la Romería periódica actual el 26 de mayo de 1935.'),
    ('coronacion-canonica-purisima-la-algaba-2004', 'Coronación canónica', date '2004-05-23',
     'Fray Carlos Amigo Vallejo coronó canónicamente a la titular en la Plaza de España de La Algaba.')
  ) as d(slug, event_type, event_date, description)
)
insert into public.events (
  entity_id, event_type, event_date, description, event_category,
  brotherhood_entity_id, municipality_id, event_status, location_text
)
select e.id, d.event_type, d.event_date, d.description, 'historical',
       h.id, m.id, 'held',
       case when d.slug = 'coronacion-canonica-purisima-la-algaba-2004'
            then 'Plaza de España, La Algaba' else 'La Algaba' end
from event_data d
join public.entities e on e.slug = d.slug
join public.entities h on h.slug = 'purisima-de-la-algaba'
join public.municipalities m on m.slug = 'la-algaba'
on conflict (entity_id) do update set
  event_type = excluded.event_type,
  event_date = excluded.event_date,
  description = excluded.description,
  event_category = excluded.event_category,
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  municipality_id = excluded.municipality_id,
  event_status = excluded.event_status,
  location_text = excluded.location_text;

-- Intervención documentada de Castillo Lastrucci en 1929.
insert into public.heritage_interventions (
  target_entity_id, agent_entity_id, discipline, element_name,
  intervention_type, phase, date_from_text, description, status
)
select i.id, a.id, 'Imaginería', 'Purísima Concepción de María Coronada',
       'Restauración y policromía', 'Concluida', '1929',
       'Tras un incendio accidental que ahumó rostro y manos, Antonio Castillo Lastrucci intervino la imagen y repolicromó las zonas afectadas.',
       'published'
from public.entities i
join public.entities a on a.slug = 'antonio-castillo-lastrucci'
where i.slug = 'purisima-concepcion-maria-coronada-la-algaba'
  and not exists (
    select 1 from public.heritage_interventions hi
    where hi.target_entity_id = i.id and hi.agent_entity_id = a.id
      and hi.date_from_text = '1929'
  );

-- Histórico musical. 2011 y 2017 son evidencias puntuales, no un intervalo continuo.
insert into public.entities (entity_type, name, slug, summary, status)
select 'band', 'Asociación Musical de La Algaba', 'asociacion-musical-la-algaba',
       'Formación musical de La Algaba documentada acompañando a la Purísima Concepción en su procesión gloriosa durante la década de 2010.',
       'published'
where not exists (select 1 from public.entities where slug = 'asociacion-musical-la-algaba');

insert into public.bands (entity_id, band_type, municipality_id, description)
select b.id, 'Banda de Música', m.id,
       'Formación documentada acompañando a la Purísima en 2011 y 2017. No se presume vigencia actual.'
from public.entities b
join public.municipalities m on m.slug = 'la-algaba'
where b.slug = 'asociacion-musical-la-algaba'
on conflict (entity_id) do update set
  band_type = excluded.band_type,
  municipality_id = excluded.municipality_id,
  description = excluded.description;

with music_data as (
  select * from (values
    (2011, 'Acompañamiento documentado en la procesión de 2011.'),
    (2017, 'Acompañamiento documentado en la procesión de 2017.')
  ) as d(yr, notes)
)
insert into public.music_accompaniment_periods (
  brotherhood_entity_id, band_entity_id, step_entity_id, position, outing_type,
  year_from, year_to, is_current, notes, status,
  public_brotherhood_name, public_step_name, public_brotherhood_slug,
  public_municipality_name, public_municipality_slug, public_province
)
select h.id, b.id, st.id, 'Tras el paso', 'Procesión de Gloria',
       d.yr, d.yr, false,
       d.notes || ' Se registra como evidencia histórica puntual y no como continuidad hasta 2026.',
       'published', 'Purísima de La Algaba',
       'Paso de la Purísima Concepción de María Coronada',
       'purisima-de-la-algaba', 'La Algaba', 'la-algaba', 'Sevilla'
from music_data d
join public.entities h on h.slug = 'purisima-de-la-algaba'
join public.entities b on b.slug = 'asociacion-musical-la-algaba'
join public.entities st on st.slug = 'paso-purisima-concepcion-la-algaba'
where not exists (
  select 1 from public.music_accompaniment_periods mp
  where mp.brotherhood_entity_id = h.id
    and mp.band_entity_id = b.id
    and mp.step_entity_id = st.id
    and mp.year_from = d.yr and mp.year_to = d.yr
);

-- Trazabilidad de fuentes en los niveles específicos disponibles.
insert into public.source_links (source_id, entity_id, scope, notes)
select s.id, h.id, 'Identidad, reglas y sede canónica', 'Directorio institucional de la Archidiócesis.'
from public.sources s
join public.entities h on h.slug = 'purisima-de-la-algaba'
where s.url = 'https://www.cofradiasyhermandades.es/fichacofradia-COFRADIA-LaAlgaba-Purisima-cTJhbVQwU2VuUlpjYVY1OTVMM2k1QT09'
  and not exists (select 1 from public.source_links sl where sl.source_id = s.id and sl.entity_id = h.id);

insert into public.source_links (source_id, entity_id, scope, notes)
select s.id, h.id, 'Historia de la Hermandad', 'Cronología histórica publicada por la propia corporación.'
from public.sources s
join public.entities h on h.slug = 'purisima-de-la-algaba'
where s.url = 'https://hdadpurisimaconcepcionlaalgaba.blogspot.com/p/pagina-principal.html'
  and not exists (select 1 from public.source_links sl where sl.source_id = s.id and sl.entity_id = h.id);

insert into public.source_links (source_id, entity_id, scope, notes)
select s.id, i.id, 'Titular y residencia devocional', 'Ficha municipal de la ermita y de la imagen.'
from public.sources s
join public.entities i on i.slug = 'purisima-concepcion-maria-coronada-la-algaba'
where s.url = 'https://www.laalgaba.es/es/municipio/turismo/monumentos/'
  and not exists (select 1 from public.source_links sl where sl.source_id = s.id and sl.entity_id = i.id);

insert into public.source_links (source_id, brotherhood_image_id, scope, notes)
select s.id, bi.id, 'Titularidad', 'Crónica contemporánea que identifica la talla anónima del siglo XVIII.'
from public.sources s
join public.brotherhood_images bi
  on bi.brotherhood_entity_id = (select id from public.entities where slug = 'purisima-de-la-algaba')
 and bi.image_entity_id = (select id from public.entities where slug = 'purisima-concepcion-maria-coronada-la-algaba')
where s.url = 'https://www.artesacro.org/Noticia/Ver/141459/provincia-algaba-se-rindio-ante-purisima-concepcion-coronada'
  and not exists (select 1 from public.source_links sl where sl.source_id = s.id and sl.brotherhood_image_id = bi.id);

insert into public.source_links (source_id, entity_location_id, scope, notes)
select s.id, el.id, 'Residencia devocional', 'El Ayuntamiento sitúa la imagen en la Ermita de El Aral.'
from public.sources s
join public.entity_locations el
  on el.entity_id = (select id from public.entities where slug = 'purisima-concepcion-maria-coronada-la-algaba')
 and el.place_id = (select id from public.places where slug = 'ermita-san-salvador-inmaculada-el-aral')
where s.url = 'https://www.laalgaba.es/es/municipio/turismo/monumentos/'
  and not exists (select 1 from public.source_links sl where sl.source_id = s.id and sl.entity_location_id = el.id);

insert into public.source_links (source_id, brotherhood_step_id, scope, notes)
select s.id, bs.id, 'Paso procesional', 'Crónica de 2021 que documenta el paso de plata.'
from public.sources s
join public.brotherhood_steps bs
  on bs.brotherhood_entity_id = (select id from public.entities where slug = 'purisima-de-la-algaba')
 and bs.step_entity_id = (select id from public.entities where slug = 'paso-purisima-concepcion-la-algaba')
where s.url = 'https://www.artesacro.org/Noticia/Ver/141459/provincia-algaba-se-rindio-ante-purisima-concepcion-coronada'
  and not exists (select 1 from public.source_links sl where sl.source_id = s.id and sl.brotherhood_step_id = bs.id);

insert into public.source_links (source_id, image_step_id, scope, notes)
select s.id, ix.id, 'Imagen en el paso', 'Crónica de la procesión gloriosa de 2021.'
from public.sources s
join public.image_steps ix
  on ix.image_entity_id = (select id from public.entities where slug = 'purisima-concepcion-maria-coronada-la-algaba')
 and ix.step_entity_id = (select id from public.entities where slug = 'paso-purisima-concepcion-la-algaba')
where s.url = 'https://www.artesacro.org/Noticia/Ver/141459/provincia-algaba-se-rindio-ante-purisima-concepcion-coronada'
  and not exists (select 1 from public.source_links sl where sl.source_id = s.id and sl.image_step_id = ix.id);

insert into public.source_links (source_id, intervention_id, scope, notes)
select s.id, hi.id, 'Intervención de 1929', 'Investigación basada en documentación parroquial.'
from public.sources s
join public.heritage_interventions hi
  on hi.target_entity_id = (select id from public.entities where slug = 'purisima-concepcion-maria-coronada-la-algaba')
 and hi.agent_entity_id = (select id from public.entities where slug = 'antonio-castillo-lastrucci')
 and hi.date_from_text = '1929'
where s.url = 'https://www.artesacro.org/Noticia/Ver/95040/investigacion-1929-ano-que-se-cambio-purisima-concepcion-algabena-virgen'
  and not exists (select 1 from public.source_links sl where sl.source_id = s.id and sl.intervention_id = hi.id);

insert into public.source_links (source_id, cult_id, scope, notes)
select s.id, c.id, 'Misa de Romeros', 'Programa municipal de la Romería 2026 y tradición anual.'
from public.sources s
join public.cults c
  on c.brotherhood_entity_id = (select id from public.entities where slug = 'purisima-de-la-algaba')
 and c.title = 'Misa de Romeros en honor a la Purísima Concepción de María Coronada'
where s.url = 'https://www.laalgaba.es/es/actualidad/eventos/Romeria-2026-00003'
  and not exists (select 1 from public.source_links sl where sl.source_id = s.id and sl.cult_id = c.id);

insert into public.source_links (source_id, cult_id, scope, notes)
select s.id, c.id, 'Cultos históricos recurrentes', 'Historia cultual publicada por la Hermandad.'
from public.sources s
join public.cults c
  on c.brotherhood_entity_id = (select id from public.entities where slug = 'purisima-de-la-algaba')
 and c.title in ('Fiesta de la Purísima', 'Novena de rogativas a la Purísima Concepción')
where s.url = 'https://hdadpurisimaconcepcionlaalgaba.blogspot.com/p/historia.html'
  and not exists (select 1 from public.source_links sl where sl.source_id = s.id and sl.cult_id = c.id);

insert into public.source_links (source_id, outing_id, scope, notes)
select s.id, o.id, 'Romería 2026', 'Programa municipal contemporáneo.'
from public.sources s
join public.outings o on o.slug = 'purisima-la-algaba-romeria-2026'
where s.url = 'https://www.laalgaba.es/es/actualidad/eventos/Romeria-2026-00003'
  and not exists (select 1 from public.source_links sl where sl.source_id = s.id and sl.outing_id = o.id);

insert into public.source_links (source_id, entity_id, scope, notes)
select s.id, e.id, 'Aprobación de reglas y primera Romería', 'Cronología histórica de la propia Hermandad.'
from public.sources s
join public.entities e on e.slug in (
  'aprobacion-reglas-purisima-la-algaba-1870',
  'primera-romeria-purisima-la-algaba-1935'
)
where s.url = 'https://hdadpurisimaconcepcionlaalgaba.blogspot.com/p/pagina-principal.html'
  and not exists (select 1 from public.source_links sl where sl.source_id = s.id and sl.entity_id = e.id);

insert into public.source_links (source_id, entity_id, scope, notes)
select s.id, e.id, 'Coronación Canónica de 2004', 'El Ayuntamiento documenta la coronación canónica en 2004.'
from public.sources s
join public.entities e on e.slug = 'coronacion-canonica-purisima-la-algaba-2004'
where s.url = 'https://www.laalgaba.es/es/municipio/turismo/monumentos/'
  and not exists (select 1 from public.source_links sl where sl.source_id = s.id and sl.entity_id = e.id);

insert into public.source_links (source_id, music_accompaniment_period_id, scope, notes)
select s.id, mp.id, 'Acompañamiento histórico',
       'Evidencia puntual del acompañamiento de la Asociación Musical de La Algaba.'
from public.sources s
join public.music_accompaniment_periods mp
  on mp.brotherhood_entity_id = (select id from public.entities where slug = 'purisima-de-la-algaba')
 and mp.band_entity_id = (select id from public.entities where slug = 'asociacion-musical-la-algaba')
 and mp.year_from = case
      when s.url = 'https://www.artesacro.org/Noticia.asp?idreg=71132' then 2011 else 2017 end
 and mp.year_to = case
      when s.url = 'https://www.artesacro.org/Noticia.asp?idreg=71132' then 2011 else 2017 end
where s.url in (
  'https://www.artesacro.org/Noticia.asp?idreg=71132',
  'https://www.artesacro.org/Noticia/Ver/119701/provincia-algaba-y-sol-acompanaron-purisima-coronada-su-tradicional'
)
  and not exists (
    select 1 from public.source_links sl
    where sl.source_id = s.id and sl.music_accompaniment_period_id = mp.id
  );
