-- Lote editorial · Hermandades · septiembre y octubre de 2026
-- Solo DML sobre el modelo First Edition existente. No introduce DDL ni RLS.

do $$
begin
  if exists (
    select 1
    from (values
      ('dulce-nombre-bellavista'),
      ('las-aguas-sevilla'),
      ('hermandad-del-dulce-nombre-sevilla'),
      ('hermandad-jesus-despojado-sevilla'),
      ('hermandad-de-la-macarena')
    ) as required(slug)
    where (select count(*) from public.entities e where e.slug = required.slug) <> 1
  ) then
    raise exception 'El lote requiere una única entidad canónica para cada Hermandad';
  end if;
end $$;

insert into public.sources (
  name, url, source_type, author_or_publisher, publication_date, accessed_at, notes
)
select v.name, v.url, v.source_type, v.publisher, v.publication_date, date '2026-09-01', v.notes
from (values
  ('Las Aguas · sitio oficial', 'https://www.hermandaddelasaguas.org/', 'Web oficial', 'Hermandad de Las Aguas', null::date, 'Identidad institucional, sede y canales oficiales.'),
  ('Las Aguas · ficha del Consejo', 'https://www.hermandades-de-sevilla.org/semanasanta/ls_las_aguas.html', 'Fuente institucional', 'Consejo General de Hermandades y Cofradías de Sevilla', null::date, 'Historia, titulares, pasos, hábito y acompañamientos.'),
  ('Dulce Nombre de Bellavista · sitio oficial', 'https://www.dulcenombrebellavista.es/', 'Web oficial', 'Hermandad del Dulce Nombre de Bellavista', null::date, 'Identidad y sede de la corporación.'),
  ('Agenda Cofrade 2026 · septiembre y octubre', 'https://infocofrade.com/agenda/', 'Agenda especializada', 'Info Cofrade', null::date, 'Contraste de fechas y horas de los rosarios públicos anunciados para septiembre de 2026.'),
  ('Dulce Nombre · sitio oficial', 'https://hermandaddeldulcenombre.org/', 'Web oficial', 'Hermandad del Dulce Nombre', null::date, 'Identidad institucional y canales oficiales.'),
  ('Dulce Nombre · cultos', 'https://hermandaddeldulcenombre.org/cultos/', 'Web oficial', 'Hermandad del Dulce Nombre', null::date, 'Calendario oficial del rosario público de María Santísima del Dulce Nombre.'),
  ('Dulce Nombre · ficha del Consejo', 'https://www.hermandades-de-sevilla.org/semanasanta/mt_la_bofeta.html', 'Fuente institucional', 'Consejo General de Hermandades y Cofradías de Sevilla', null::date, 'Historia, titulares, pasos, hábito y acompañamientos.'),
  ('Jesús Despojado · sitio oficial', 'https://jesusdespojado.org/', 'Web oficial', 'Hermandad de Jesús Despojado', null::date, 'Identidad institucional y canales oficiales.'),
  ('Jesús Despojado · ficha del Consejo', 'https://www.hermandades-de-sevilla.org/semanasanta/dramos_jesus_despojado.html', 'Fuente institucional', 'Consejo General de Hermandades y Cofradías de Sevilla', null::date, 'Historia, sede, pasos, hábito y acompañamientos.'),
  ('Macarena · sitio oficial', 'https://www.hermandaddelamacarena.es/', 'Web oficial', 'Hermandad de la Macarena', null::date, 'Identidad institucional, sede y canales oficiales.'),
  ('Macarena · historia oficial', 'https://www.hermandaddelamacarena.es/historia/', 'Web oficial', 'Hermandad de la Macarena', null::date, 'Historia institucional de la corporación.'),
  ('Macarena · ficha del Consejo', 'https://www.hermandades-de-sevilla.org/semanasanta/madrug_la_macarena.html', 'Fuente institucional', 'Consejo General de Hermandades y Cofradías de Sevilla', null::date, 'Denominación, titulares y estación de penitencia.')
) as v(name, url, source_type, publisher, publication_date, notes)
where not exists (select 1 from public.sources s where s.url = v.url);

update public.sources
set accessed_at = date '2026-09-01'
where url in (
  'https://www.hermandaddelasaguas.org/',
  'https://www.hermandades-de-sevilla.org/semanasanta/ls_las_aguas.html',
  'https://www.dulcenombrebellavista.es/',
  'https://infocofrade.com/agenda/',
  'https://hermandaddeldulcenombre.org/',
  'https://hermandaddeldulcenombre.org/cultos/',
  'https://www.hermandades-de-sevilla.org/semanasanta/mt_la_bofeta.html',
  'https://jesusdespojado.org/',
  'https://www.hermandades-de-sevilla.org/semanasanta/dramos_jesus_despojado.html',
  'https://www.hermandaddelamacarena.es/',
  'https://www.hermandaddelamacarena.es/historia/',
  'https://www.hermandades-de-sevilla.org/semanasanta/madrug_la_macarena.html'
);

with editorial_data as (
  select * from (values
    ('dulce-nombre-bellavista', 'Dulce Nombre de Bellavista', 'Hermandad de penitencia del barrio de Bellavista, erigida canónicamente en 2006 y con estación de penitencia el Viernes de Dolores.'),
    ('las-aguas-sevilla', 'Las Aguas', 'Hermandad del Lunes Santo fundada en 1750, con sede en la Capilla de Nuestra Señora del Rosario y dos pasos procesionales.'),
    ('hermandad-del-dulce-nombre-sevilla', 'Dulce Nombre', 'Hermandad del Martes Santo, conocida popularmente como La Bofetá, reorganizada en 1919 y con sede en San Lorenzo.'),
    ('hermandad-jesus-despojado-sevilla', 'Jesús Despojado', 'Hermandad del Domingo de Ramos fundada en 1938 y establecida en la Capilla de Nuestra Señora del Mayor Dolor, en la plaza de Molviedro.'),
    ('hermandad-de-la-macarena', 'La Macarena', 'Hermandad de la Madrugada fundada en 1595 y establecida en la Basílica de Santa María de la Esperanza Macarena.')
  ) as d(slug, name, summary)
)
update public.entities e
set name = d.name,
    summary = d.summary,
    status = 'published',
    updated_at = now()
from editorial_data d
where e.slug = d.slug;

insert into public.places (municipality_id, name, slug, place_type, address, notes)
select m.id, v.name, v.slug, v.place_type, v.address, v.notes
from (values
  ('capilla-nuestra-senora-rosario-dos-mayo', 'Capilla de Nuestra Señora del Rosario', 'Capilla', 'Calle Dos de Mayo, 1, Sevilla', 'Sede canónica de la Hermandad de Las Aguas.'),
  ('parroquia-san-lorenzo-martir-sevilla', 'Parroquia de San Lorenzo Mártir', 'Parroquia', 'Plaza de San Lorenzo, Sevilla', 'Sede canónica de la Hermandad del Dulce Nombre.'),
  ('capilla-mayor-dolor-molviedro', 'Capilla de Nuestra Señora del Mayor Dolor', 'Capilla', 'Plaza de Molviedro, Sevilla', 'Sede canónica de la Hermandad de Jesús Despojado.'),
  ('basilica-esperanza-macarena', 'Basílica de Santa María de la Esperanza Macarena', 'Basílica', 'Calle Bécquer, 1, Sevilla', 'Sede canónica de la Hermandad de la Macarena.')
) as v(slug, name, place_type, address, notes)
join public.municipalities m on m.slug = 'sevilla'
where not exists (select 1 from public.places p where p.slug = v.slug);

with brotherhood_data as (
  select * from (values
    ('dulce-nombre-bellavista', 'Hermandad de Penitencia y Cofradía de Nazarenos de Nuestro Padre Jesús de la Salud y Remedios y María Santísima del Dulce Nombre en sus Dolores y Compasión', 'Dulce Nombre de Bellavista', '1992 (refundación penitencial); Agrupación Parroquial en 1995; Hermandad desde 2006', 'parroquia-sagrado-corazon-jesus-bellavista', 'Bellavista', 'https://www.dulcenombrebellavista.es/', 'https://www.instagram.com/dnbellavista/', array['Penitencia']::text[], 'Viernes de Dolores', 'La actual corporación comenzó a gestarse en 1992, fue aprobada como Agrupación Parroquial en 1995 y quedó erigida como Hermandad de Penitencia en 2006.'),
    ('las-aguas-sevilla', 'Real, Antigua, Ilustre y Fervorosa Hermandad de la Santa Cruz y Nuestra Señora del Rosario y Archicofradía de Nazarenos del Santísimo Cristo de las Aguas, Nuestra Madre y Señora del Mayor Dolor y María Santísima de Guadalupe', 'Las Aguas', '1750; reorganizada en 1891; fusión con la Hermandad del Rosario ratificada en 1977', 'capilla-nuestra-senora-rosario-dos-mayo', 'Arenal', 'https://www.hermandaddelasaguas.org/', null::text, array['Penitencia','Gloria']::text[], 'Lunes Santo', 'Fundada en San Jacinto en 1750, fue reorganizada en 1891. Tras el incendio de 1942 pasó por Santiago y San Bartolomé; regresó a la Capilla del Rosario en 1977, cuando se ratificó la fusión de ambas corporaciones.'),
    ('hermandad-del-dulce-nombre-sevilla', 'Pontificia, Fervorosa, Ilustre y Antigua Hermandad y Cofradía de Nazarenos de Nuestro Padre Jesús ante Anás, Santo Cristo del Mayor Dolor, María Santísima del Dulce Nombre y San Juan Evangelista', 'La Bofetá', 'Orígenes a finales del siglo XVI; reorganizada en 1919', 'parroquia-san-lorenzo-martir-sevilla', 'San Lorenzo', 'https://hermandaddeldulcenombre.org/', null::text, array['Penitencia']::text[], 'Martes Santo', 'Sus orígenes se sitúan a finales del siglo XVI. Reorganizada en San Román en 1919, reanudó la estación de penitencia en 1920 y reside en San Lorenzo desde 1968.'),
    ('hermandad-jesus-despojado-sevilla', 'Humilde y Fervorosa Hermandad y Cofradía de Nazarenos de Nuestro Padre Jesús Despojado de sus Vestiduras, María Santísima de los Dolores y Misericordia, Mayor Dolor de Nuestra Señora, San Juan Evangelista, San Bartolomé Apóstol y San Antonio María Claret', 'Jesús Despojado', 'Reglas aprobadas el 2 de abril de 1938', 'capilla-mayor-dolor-molviedro', 'Arenal', 'https://jesusdespojado.org/', null::text, array['Penitencia']::text[], 'Domingo de Ramos', 'La corporación aprobó sus primeras Reglas en 1938. Tras una etapa de decadencia fue reorganizada en San Bartolomé y desde 1982 tiene su sede en la Capilla del Mayor Dolor de la plaza de Molviedro.'),
    ('hermandad-de-la-macarena', 'Real, Ilustre y Fervorosa Hermandad y Cofradía de Nazarenos de Nuestra Señora del Santo Rosario, Nuestro Padre Jesús de la Sentencia y María Santísima de la Esperanza Macarena', 'La Macarena', 'Primeras Reglas aprobadas el 24 de noviembre de 1595', 'basilica-esperanza-macarena', 'Macarena', 'https://www.hermandaddelamacarena.es/', null::text, array['Penitencia','Gloria']::text[], 'Madrugada', 'La Hermandad se fundó en el convento de San Basilio y aprobó sus primeras Reglas en 1595. Su historia está unida a la devoción universal a la Esperanza Macarena y a su actual basílica junto al arco de la Macarena.')
  ) as d(slug, official_name, popular_name, foundation_text, place_slug, neighborhood, website_url, instagram_url, brotherhood_types, procession_day, history_text)
)
insert into public.brotherhoods (
  entity_id, official_name, popular_name, foundation_text, municipality_id,
  canonical_see_place_id, neighborhood, website_url, instagram_url,
  brotherhood_types, current_procession_day, history_text
)
select e.id, d.official_name, d.popular_name, d.foundation_text, m.id,
       p.id, d.neighborhood, d.website_url, d.instagram_url,
       d.brotherhood_types, d.procession_day, d.history_text
from brotherhood_data d
join public.entities e on e.slug = d.slug
join public.municipalities m on m.slug = 'sevilla'
left join public.places p on p.slug = d.place_slug
on conflict (entity_id) do update set
  official_name = excluded.official_name,
  popular_name = excluded.popular_name,
  foundation_text = excluded.foundation_text,
  municipality_id = excluded.municipality_id,
  canonical_see_place_id = excluded.canonical_see_place_id,
  neighborhood = excluded.neighborhood,
  website_url = excluded.website_url,
  instagram_url = coalesce(excluded.instagram_url, public.brotherhoods.instagram_url),
  brotherhood_types = excluded.brotherhood_types,
  current_procession_day = excluded.current_procession_day,
  history_text = excluded.history_text;

with location_data as (
  select * from (values
    ('dulce-nombre-bellavista', 'parroquia-sagrado-corazon-jesus-bellavista'),
    ('las-aguas-sevilla', 'capilla-nuestra-senora-rosario-dos-mayo'),
    ('hermandad-del-dulce-nombre-sevilla', 'parroquia-san-lorenzo-martir-sevilla'),
    ('hermandad-jesus-despojado-sevilla', 'capilla-mayor-dolor-molviedro'),
    ('hermandad-de-la-macarena', 'basilica-esperanza-macarena')
  ) as d(entity_slug, place_slug)
)
insert into public.entity_locations (entity_id, place_id, municipality_id, location_type, is_current, notes, status)
select e.id, p.id, p.municipality_id, 'canonical_see', true, 'Sede canónica actual.', 'published'
from location_data d
join public.entities e on e.slug = d.entity_slug
join public.places p on p.slug = d.place_slug
where not exists (
  select 1 from public.entity_locations el
  where el.entity_id = e.id and el.place_id = p.id and el.is_current
);

with social_data as (
  select * from (values
    ('dulce-nombre-bellavista', 'website', 'https://www.dulcenombrebellavista.es/', 'Web oficial', 0),
    ('dulce-nombre-bellavista', 'instagram', 'https://www.instagram.com/dnbellavista/', 'Instagram oficial', 10),
    ('las-aguas-sevilla', 'website', 'https://www.hermandaddelasaguas.org/', 'Web oficial', 0),
    ('hermandad-del-dulce-nombre-sevilla', 'website', 'https://hermandaddeldulcenombre.org/', 'Web oficial', 0),
    ('hermandad-jesus-despojado-sevilla', 'website', 'https://jesusdespojado.org/', 'Web oficial', 0),
    ('hermandad-de-la-macarena', 'website', 'https://www.hermandaddelamacarena.es/', 'Web oficial', 0)
  ) as d(entity_slug, platform, url, label, display_order)
)
insert into public.entity_social_links (entity_id, platform, url, label, display_order, is_public)
select e.id, d.platform, d.url, d.label, d.display_order, true
from social_data d join public.entities e on e.slug = d.entity_slug
on conflict (entity_id, platform) do update set
  url = excluded.url, label = excluded.label, display_order = excluded.display_order,
  is_public = true, updated_at = now();

with entity_source_data as (
  select * from (values
    ('dulce-nombre-bellavista', 'https://www.dulcenombrebellavista.es/', 'Identidad e historia'),
    ('las-aguas-sevilla', 'https://www.hermandaddelasaguas.org/', 'Identidad y sede'),
    ('las-aguas-sevilla', 'https://www.hermandades-de-sevilla.org/semanasanta/ls_las_aguas.html', 'Historia y patrimonio'),
    ('hermandad-del-dulce-nombre-sevilla', 'https://hermandaddeldulcenombre.org/', 'Identidad institucional'),
    ('hermandad-del-dulce-nombre-sevilla', 'https://www.hermandades-de-sevilla.org/semanasanta/mt_la_bofeta.html', 'Historia y patrimonio'),
    ('hermandad-jesus-despojado-sevilla', 'https://jesusdespojado.org/', 'Identidad institucional'),
    ('hermandad-jesus-despojado-sevilla', 'https://www.hermandades-de-sevilla.org/semanasanta/dramos_jesus_despojado.html', 'Historia y patrimonio'),
    ('hermandad-de-la-macarena', 'https://www.hermandaddelamacarena.es/', 'Identidad institucional'),
    ('hermandad-de-la-macarena', 'https://www.hermandaddelamacarena.es/historia/', 'Historia institucional')
  ) as d(entity_slug, source_url, scope)
)
insert into public.source_links (source_id, entity_id, scope, notes)
select s.id, e.id, d.scope, 'Lote editorial de Hermandades · septiembre de 2026'
from entity_source_data d
join public.entities e on e.slug = d.entity_slug
join public.sources s on s.url = d.source_url
where not exists (
  select 1 from public.source_links sl
  where sl.source_id = s.id and sl.entity_id = e.id and sl.scope = d.scope
);

insert into public.outings (
  brotherhood_entity_id, outing_type, "character", title, outing_date, year,
  departure_time, municipality_id, origin_place_id, origin_text,
  event_status, status, slug, organizer_name
)
select e.id, 'Rosario vespertino', 'ordinary',
       'Rosario vespertino de María Santísima del Dulce Nombre 2026',
       date '2026-09-12', 2026, time '20:00', m.id, p.id,
       'Parroquia del Sagrado Corazón de Jesús de Bellavista',
       'announced', 'published',
       'bellavista-dulce-nombre-rosario-vespertino-2026-09-12',
       'Hermandad del Dulce Nombre de Bellavista'
from public.entities e
join public.municipalities m on m.slug = 'sevilla'
left join public.places p on p.slug = 'parroquia-sagrado-corazon-jesus-bellavista'
where e.slug = 'dulce-nombre-bellavista'
and not exists (
  select 1 from public.outings o
  where o.slug = 'bellavista-dulce-nombre-rosario-vespertino-2026-09-12'
);

insert into public.outings (
  brotherhood_entity_id, outing_type, "character", title, outing_date, year,
  municipality_id, origin_place_id, origin_text,
  event_status, status, slug, organizer_name
)
select e.id, 'Rosario público', 'ordinary',
       'Rosario público de María Santísima del Dulce Nombre 2026',
       date '2026-09-27', 2026, m.id, p.id,
       'Parroquia de San Lorenzo Mártir',
       'announced', 'published',
       'dulce-nombre-rosario-publico-2026-09-27',
       'Hermandad del Dulce Nombre'
from public.entities e
join public.municipalities m on m.slug = 'sevilla'
left join public.places p on p.slug = 'parroquia-san-lorenzo-martir-sevilla'
where e.slug = 'hermandad-del-dulce-nombre-sevilla'
and not exists (
  select 1 from public.outings o
  where o.slug = 'dulce-nombre-rosario-publico-2026-09-27'
);

with outing_source_data as (
  select * from (values
    ('bellavista-dulce-nombre-rosario-vespertino-2026-09-12', 'https://infocofrade.com/agenda/', 'Fecha, hora y acompañamientos anunciados'),
    ('dulce-nombre-rosario-publico-2026-09-27', 'https://hermandaddeldulcenombre.org/cultos/', 'Fecha oficial del rosario público'),
    ('las-aguas-mayor-dolor-rosario-vespertino-2026-09-19', 'https://infocofrade.com/agenda/', 'Contraste de fecha y hora')
  ) as d(outing_slug, source_url, scope)
)
insert into public.source_links (source_id, outing_id, scope, notes)
select s.id, o.id, d.scope, 'Agenda de septiembre de 2026'
from outing_source_data d
join public.outings o on o.slug = d.outing_slug
join public.sources s on s.url = d.source_url
where not exists (
  select 1 from public.source_links sl
  where sl.source_id = s.id and sl.outing_id = o.id and sl.scope = d.scope
);

do $$
declare
  published_count integer;
  september_count integer;
begin
  select count(*) into published_count
  from public.entities
  where slug in (
    'dulce-nombre-bellavista', 'las-aguas-sevilla',
    'hermandad-del-dulce-nombre-sevilla', 'hermandad-jesus-despojado-sevilla',
    'hermandad-de-la-macarena'
  ) and status = 'published';

  select count(*) into september_count
  from public.outings
  where slug in (
    'bellavista-dulce-nombre-rosario-vespertino-2026-09-12',
    'las-aguas-mayor-dolor-rosario-vespertino-2026-09-19',
    'dulce-nombre-rosario-publico-2026-09-27'
  ) and status = 'published';

  if published_count <> 5 then
    raise exception 'El lote no deja publicadas las cinco Hermandades';
  end if;
  if september_count <> 3 then
    raise exception 'El lote no deja publicadas las tres salidas confirmadas de septiembre';
  end if;
end $$;
