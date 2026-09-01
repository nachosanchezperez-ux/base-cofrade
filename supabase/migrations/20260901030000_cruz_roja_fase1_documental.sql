-- Cruz Roja · fase 1 documental
-- Identidad institucional, acompañamientos de Semana Santa,
-- primeros históricos contrastados y novedades musicales de 2025.

do $$
begin
  if (select count(*) from entities where slug = 'banda-musica-cruz-roja-sevilla') <> 1 then
    raise exception 'No se localiza de forma unívoca la Banda de Música de la Cruz Roja de Sevilla';
  end if;

  if (select count(*) from music_accompaniment_periods
      where band_entity_id = (select id from entities where slug = 'banda-musica-cruz-roja-sevilla')
        and is_current
        and outing_type in ('Viernes de Dolores','Domingo de Ramos','Lunes Santo','Martes Santo','Miércoles Santo','Jueves Santo','Madrugá','Viernes Santo','Sábado Santo','Domingo de Resurrección')) <> 10 then
    raise exception 'La base ya no contiene los diez acompañamientos penitenciales esperados de Cruz Roja';
  end if;
end $$;

insert into municipalities (name, slug, province, autonomous_community, country)
select v.name, v.slug, 'Sevilla', 'Andalucía', 'España'
from (values
  ('San Juan de Aznalfarache', 'san-juan-de-aznalfarache'),
  ('Castilleja de la Cuesta', 'castilleja-de-la-cuesta')
) as v(name, slug)
where not exists (
  select 1 from municipalities m
  where lower(m.name) = lower(v.name) or m.slug = v.slug
);

insert into sources (name, url, source_type, author_or_publisher, accessed_at, notes)
select v.name, v.url, 'Web oficial', 'Banda de Música de la Cruz Roja de Sevilla', date '2026-09-01', v.notes
from (values
  ('Cruz Roja · Historia', 'https://www.bandacruzroja.es/conocenos/historia', 'Historia institucional y evolución de denominaciones.'),
  ('Cruz Roja · Director', 'https://www.bandacruzroja.es/conocenos/director', 'Biografía y cronología del director titular.'),
  ('Cruz Roja · Viernes de Dolores', 'https://www.bandacruzroja.es/hermandades/semana-santa/viernes-de-dolores', 'Titular, localidad y cronología del acompañamiento.'),
  ('Cruz Roja · Domingo de Ramos', 'https://www.bandacruzroja.es/hermandades/semana-santa/domingo-de-ramos', 'Titular, localidad y cronología del acompañamiento.'),
  ('Cruz Roja · Lunes Santo', 'https://www.bandacruzroja.es/hermandades/semana-santa/lunes-santo', 'Titular, localidad y cronología del acompañamiento.'),
  ('Cruz Roja · Martes Santo', 'https://www.bandacruzroja.es/hermandades/semana-santa/martes-santo', 'Titular, localidad y cronología del acompañamiento.'),
  ('Cruz Roja · Miércoles Santo', 'https://www.bandacruzroja.es/hermandades/semana-santa/miercoles-santo', 'Titular, localidad y cronología del acompañamiento.'),
  ('Cruz Roja · Jueves Santo', 'https://www.bandacruzroja.es/hermandades/semana-santa/jueves-santo', 'Titular, localidad y cronología del acompañamiento.'),
  ('Cruz Roja · Madrugá', 'https://www.bandacruzroja.es/hermandades/semana-santa/la-madruga', 'Titular, localidad y cronología del acompañamiento.'),
  ('Cruz Roja · Viernes Santo', 'https://www.bandacruzroja.es/hermandades/semana-santa/viernes-santo', 'Titular, localidad y cronología del acompañamiento.'),
  ('Cruz Roja · Sábado Santo', 'https://www.bandacruzroja.es/hermandades/semana-santa/sabado-santo', 'Titular, localidad y cronología del acompañamiento.'),
  ('Cruz Roja · Domingo de Resurrección', 'https://www.bandacruzroja.es/hermandades/semana-santa/domingo-de-resurreccion', 'Titular, localidad y cronología del acompañamiento.')
) as v(name, url, notes)
where not exists (select 1 from sources s where s.url = v.url);

insert into sources (name, url, source_type, author_or_publisher, accessed_at, notes)
select
  'Cruz Roja · Repertorio oficial 2025',
  'https://www.bandacruzroja.es/wp-content/uploads/2025/02/INDICE-2025-1.pdf',
  'Fuente oficial',
  'Banda de Música de la Cruz Roja de Sevilla',
  date '2026-09-01',
  'Índice oficial del repertorio; diferencia el bloque de actualización de 2025.'
where not exists (
  select 1 from sources
  where url = 'https://www.bandacruzroja.es/wp-content/uploads/2025/02/INDICE-2025-1.pdf'
);

insert into sources (name, url, source_type, author_or_publisher, publication_date, accessed_at, notes)
select
  'Redención · renovación de Cruz Roja',
  'https://www.instagram.com/p/DQwMtcjDfnU/',
  'Red social oficial',
  'Hermandad de la Redención',
  date '2025-11-07',
  date '2026-09-01',
  'Renovación oficial por tres Lunes Santos: 2026, 2027 y 2028.'
where not exists (
  select 1 from sources
  where url = 'https://www.instagram.com/p/DQwMtcjDfnU/'
);

update sources
set accessed_at = date '2026-09-01'
where url in (
  'https://www.bandacruzroja.es/conocenos/historia',
  'https://www.bandacruzroja.es/conocenos/director',
  'https://www.bandacruzroja.es/hermandades/semana-santa',
  'https://www.bandacruzroja.es/hermandades/semana-santa/viernes-de-dolores',
  'https://www.bandacruzroja.es/hermandades/semana-santa/domingo-de-ramos',
  'https://www.bandacruzroja.es/hermandades/semana-santa/lunes-santo',
  'https://www.bandacruzroja.es/hermandades/semana-santa/martes-santo',
  'https://www.bandacruzroja.es/hermandades/semana-santa/miercoles-santo',
  'https://www.bandacruzroja.es/hermandades/semana-santa/jueves-santo',
  'https://www.bandacruzroja.es/hermandades/semana-santa/la-madruga',
  'https://www.bandacruzroja.es/hermandades/semana-santa/viernes-santo',
  'https://www.bandacruzroja.es/hermandades/semana-santa/sabado-santo',
  'https://www.bandacruzroja.es/hermandades/semana-santa/domingo-de-resurreccion',
  'https://www.bandacruzroja.es/wp-content/uploads/2025/02/INDICE-2025-1.pdf',
  'https://www.instagram.com/p/DQwMtcjDfnU/'
);

update bands
set description = 'La actual formación sitúa sus orígenes directos en 1937, con la fundación de la Banda de Música del Regimiento de Ingenieros. Tras desvincularse del ámbito militar pasó a denominarse Sociedad Filarmónica Hispalense (1948–1953) y Banda de Música de Educación y Descanso (1954–1963), antes de integrarse en la Cruz Roja durante la década de 1960. Mantiene una presencia continuada en la Semana Santa de Sevilla y una de las trayectorias discográficas más extensas entre las formaciones procesionales.'
where entity_id = (select id from entities where slug = 'banda-musica-cruz-roja-sevilla');

with period_data as (
  select * from (values
    ('Viernes de Dolores', 'hermandad-angeles-san-juan-aznalfarache', 'Nuestra Señora de los Ángeles', 2022, 'San Juan de Aznalfarache', 'san-juan-de-aznalfarache', 'Acuerdo documentado desde 2019 y vinculación oficial computada por la banda desde 2020. Las salidas previstas en 2020 y 2021 no se celebraron por la pandemia; primer acompañamiento efectivo en 2022.', 'https://www.bandacruzroja.es/hermandades/semana-santa/viernes-de-dolores'),
    ('Domingo de Ramos', 'hermandad-san-roque-sevilla', 'Nuestra Señora de Gracia y Esperanza', 2016, 'Sevilla', 'sevilla', 'Actual vinculación musical iniciada en 2016.', 'https://www.bandacruzroja.es/hermandades/semana-santa/domingo-de-ramos'),
    ('Lunes Santo', 'hermandad-de-la-redencion', 'María Santísima del Rocío Coronada', 2022, 'Sevilla', 'sevilla', 'Acompañamiento vigente desde la Semana Santa de 2022. Renovación oficial confirmada para los Lunes Santos de 2026, 2027 y 2028.', 'https://www.bandacruzroja.es/hermandades/semana-santa/lunes-santo'),
    ('Martes Santo', 'hermandad-candelaria-sevilla', 'María Santísima de la Candelaria', 1984, 'Sevilla', 'sevilla', 'Acompañamiento vigente desde 1984.', 'https://www.bandacruzroja.es/hermandades/semana-santa/martes-santo'),
    ('Miércoles Santo', 'hermandad-de-san-bernardo', 'María Santísima del Refugio', 1998, 'Sevilla', 'sevilla', 'Actual vinculación musical iniciada en 1998.', 'https://www.bandacruzroja.es/hermandades/semana-santa/miercoles-santo'),
    ('Jueves Santo', 'hermandad-monte-sion-sevilla', 'María Santísima del Rosario en sus Misterios Dolorosos Coronada', 2016, 'Sevilla', 'sevilla', 'Regreso de la formación en 2016.', 'https://www.bandacruzroja.es/hermandades/semana-santa/jueves-santo'),
    ('Madrugá', 'hermandad-jesus-la-algaba', 'Nuestra Señora de los Dolores', 2019, 'La Algaba', 'la-algaba', 'Acompañamiento vigente desde 2019. La última renovación localizada cubre 2025 y 2026; continuidad desde 2027 pendiente de confirmación.', 'https://www.bandacruzroja.es/hermandades/semana-santa/la-madruga'),
    ('Viernes Santo', 'hermandad-soledad-alcala-del-rio', 'Nuestra Señora de los Dolores en su Soledad Coronada', 1991, 'Alcalá del Río', 'alcala-del-rio', 'Vinculación musical vigente desde 1991.', 'https://www.bandacruzroja.es/hermandades/semana-santa/viernes-santo'),
    ('Sábado Santo', 'hermandad-soledad-marchena', 'Nuestra Señora y Madre de la Soledad Coronada', 2023, 'Marchena', 'marchena', 'Contrato documentado para 2023–2026; continuidad desde 2027 pendiente de confirmación.', 'https://www.bandacruzroja.es/hermandades/semana-santa/sabado-santo'),
    ('Domingo de Resurrección', 'hermandad-calle-real-castilleja-cuesta', 'Inmaculada Concepción Coronada', 2020, 'Castilleja de la Cuesta', 'castilleja-de-la-cuesta', 'Vinculación vigente desde 2020. En 2026 constan dos participaciones en la jornada: mañana y tarde.', 'https://www.bandacruzroja.es/hermandades/semana-santa/domingo-de-resurreccion')
  ) as d(outing_type, brotherhood_slug, step_name, year_from, municipality_name, municipality_slug, notes, source_url)
)
update music_accompaniment_periods p
set year_from = d.year_from,
    public_step_name = d.step_name,
    public_municipality_name = d.municipality_name,
    public_municipality_slug = d.municipality_slug,
    public_province = 'Sevilla',
    public_brotherhood_slug = d.brotherhood_slug,
    notes = d.notes,
    updated_at = now()
from period_data d
join entities h on h.slug = d.brotherhood_slug
where p.band_entity_id = (select id from entities where slug = 'banda-musica-cruz-roja-sevilla')
  and p.brotherhood_entity_id = h.id
  and p.outing_type = d.outing_type
  and p.is_current;

with period_data as (
  select * from (values
    ('Viernes de Dolores', 'hermandad-angeles-san-juan-aznalfarache', 'https://www.bandacruzroja.es/hermandades/semana-santa/viernes-de-dolores'),
    ('Domingo de Ramos', 'hermandad-san-roque-sevilla', 'https://www.bandacruzroja.es/hermandades/semana-santa/domingo-de-ramos'),
    ('Lunes Santo', 'hermandad-de-la-redencion', 'https://www.bandacruzroja.es/hermandades/semana-santa/lunes-santo'),
    ('Martes Santo', 'hermandad-candelaria-sevilla', 'https://www.bandacruzroja.es/hermandades/semana-santa/martes-santo'),
    ('Miércoles Santo', 'hermandad-de-san-bernardo', 'https://www.bandacruzroja.es/hermandades/semana-santa/miercoles-santo'),
    ('Jueves Santo', 'hermandad-monte-sion-sevilla', 'https://www.bandacruzroja.es/hermandades/semana-santa/jueves-santo'),
    ('Madrugá', 'hermandad-jesus-la-algaba', 'https://www.bandacruzroja.es/hermandades/semana-santa/la-madruga'),
    ('Viernes Santo', 'hermandad-soledad-alcala-del-rio', 'https://www.bandacruzroja.es/hermandades/semana-santa/viernes-santo'),
    ('Sábado Santo', 'hermandad-soledad-marchena', 'https://www.bandacruzroja.es/hermandades/semana-santa/sabado-santo'),
    ('Domingo de Resurrección', 'hermandad-calle-real-castilleja-cuesta', 'https://www.bandacruzroja.es/hermandades/semana-santa/domingo-de-resurreccion')
  ) as d(outing_type, brotherhood_slug, source_url)
), targets as (
  select p.id as period_id, d.source_url
  from period_data d
  join entities h on h.slug = d.brotherhood_slug
  join music_accompaniment_periods p
    on p.brotherhood_entity_id = h.id
   and p.outing_type = d.outing_type
   and p.is_current
   and p.band_entity_id = (select id from entities where slug = 'banda-musica-cruz-roja-sevilla')
)
insert into source_links (source_id, music_accompaniment_period_id, scope, notes)
select s.id, t.period_id, 'Vigencia, antigüedad, localidad y titular del acompañamiento', 'Página monográfica oficial de la banda.'
from targets t
join sources s on s.url = t.source_url
where not exists (
  select 1 from source_links sl
  where sl.source_id = s.id
    and sl.music_accompaniment_period_id = t.period_id
);

with historical_data as (
  select * from (values
    ('Domingo de Ramos', 'hermandad-san-roque-sevilla', 'Tras el paso de palio', 'Nuestra Señora de Gracia y Esperanza', 1940, 1946, 'Sevilla', 'sevilla', 'Bajo la denominación Banda de Música del Regimiento de Ingenieros.', 'https://www.bandacruzroja.es/hermandades/semana-santa/domingo-de-ramos'),
    ('Miércoles Santo', 'hermandad-de-san-bernardo', 'Tras el paso de palio', 'María Santísima del Refugio', 1970, 1976, 'Sevilla', 'sevilla', 'Segundo periodo documentado por la banda antes de la vinculación actual.', 'https://www.bandacruzroja.es/hermandades/semana-santa/miercoles-santo'),
    ('Jueves Santo', 'hermandad-monte-sion-sevilla', 'Tras el paso de palio', 'María Santísima del Rosario en sus Misterios Dolorosos Coronada', 1939, 1947, 'Sevilla', 'sevilla', 'Bajo la denominación Banda de Música del Regimiento de Ingenieros.', 'https://www.bandacruzroja.es/hermandades/semana-santa/jueves-santo'),
    ('Jueves Santo', 'hermandad-monte-sion-sevilla', 'Tras el paso de palio', 'María Santísima del Rosario en sus Misterios Dolorosos Coronada', 1948, 1953, 'Sevilla', 'sevilla', 'Bajo la denominación Sociedad Filarmónica Hispalense.', 'https://www.bandacruzroja.es/hermandades/semana-santa/jueves-santo'),
    ('Jueves Santo', 'hermandad-monte-sion-sevilla', 'Tras el paso de palio', 'María Santísima del Rosario en sus Misterios Dolorosos Coronada', 1954, 1963, 'Sevilla', 'sevilla', 'Bajo la denominación Banda de Música de Educación y Descanso.', 'https://www.bandacruzroja.es/hermandades/semana-santa/jueves-santo'),
    ('Jueves Santo', 'hermandad-monte-sion-sevilla', 'Tras el paso de palio', 'María Santísima del Rosario en sus Misterios Dolorosos Coronada', 1964, 1965, 'Sevilla', 'sevilla', 'Primer periodo documentado bajo la denominación Cruz Roja.', 'https://www.bandacruzroja.es/hermandades/semana-santa/jueves-santo'),
    ('Jueves Santo', 'hermandad-monte-sion-sevilla', 'Tras el paso de palio', 'María Santísima del Rosario en sus Misterios Dolorosos Coronada', 1984, 1994, 'Sevilla', 'sevilla', 'Periodo anterior al regreso de 2016.', 'https://www.bandacruzroja.es/hermandades/semana-santa/jueves-santo')
  ) as d(outing_type, brotherhood_slug, position, step_name, year_from, year_to, municipality_name, municipality_slug, notes, source_url)
), inserted as (
  insert into music_accompaniment_periods (
    brotherhood_entity_id, band_entity_id, position, outing_type,
    year_from, year_to, is_current, notes, status,
    public_brotherhood_name, public_step_name, public_brotherhood_slug,
    public_municipality_name, public_municipality_slug, public_province
  )
  select
    h.id,
    (select id from entities where slug = 'banda-musica-cruz-roja-sevilla'),
    d.position,
    d.outing_type,
    d.year_from,
    d.year_to,
    false,
    d.notes,
    'published',
    h.name,
    d.step_name,
    d.brotherhood_slug,
    d.municipality_name,
    d.municipality_slug,
    'Sevilla'
  from historical_data d
  join entities h on h.slug = d.brotherhood_slug
  where not exists (
    select 1 from music_accompaniment_periods p
    where p.band_entity_id = (select id from entities where slug = 'banda-musica-cruz-roja-sevilla')
      and p.brotherhood_entity_id = h.id
      and p.outing_type = d.outing_type
      and p.year_from = d.year_from
      and p.year_to = d.year_to
  )
  returning id, brotherhood_entity_id, outing_type, year_from, year_to
)
select 1;

with historical_data as (
  select * from (values
    ('Domingo de Ramos', 'hermandad-san-roque-sevilla', 1940, 1946, 'https://www.bandacruzroja.es/hermandades/semana-santa/domingo-de-ramos'),
    ('Miércoles Santo', 'hermandad-de-san-bernardo', 1970, 1976, 'https://www.bandacruzroja.es/hermandades/semana-santa/miercoles-santo'),
    ('Jueves Santo', 'hermandad-monte-sion-sevilla', 1939, 1947, 'https://www.bandacruzroja.es/hermandades/semana-santa/jueves-santo'),
    ('Jueves Santo', 'hermandad-monte-sion-sevilla', 1948, 1953, 'https://www.bandacruzroja.es/hermandades/semana-santa/jueves-santo'),
    ('Jueves Santo', 'hermandad-monte-sion-sevilla', 1954, 1963, 'https://www.bandacruzroja.es/hermandades/semana-santa/jueves-santo'),
    ('Jueves Santo', 'hermandad-monte-sion-sevilla', 1964, 1965, 'https://www.bandacruzroja.es/hermandades/semana-santa/jueves-santo'),
    ('Jueves Santo', 'hermandad-monte-sion-sevilla', 1984, 1994, 'https://www.bandacruzroja.es/hermandades/semana-santa/jueves-santo')
  ) as d(outing_type, brotherhood_slug, year_from, year_to, source_url)
), targets as (
  select p.id as period_id, d.source_url
  from historical_data d
  join entities h on h.slug = d.brotherhood_slug
  join music_accompaniment_periods p
    on p.brotherhood_entity_id = h.id
   and p.outing_type = d.outing_type
   and p.year_from = d.year_from
   and p.year_to = d.year_to
   and not p.is_current
   and p.band_entity_id = (select id from entities where slug = 'banda-musica-cruz-roja-sevilla')
)
insert into source_links (source_id, music_accompaniment_period_id, scope, notes)
select s.id, t.period_id, 'Acompañamiento histórico', 'Cronología publicada por la propia formación.'
from targets t
join sources s on s.url = t.source_url
where not exists (
  select 1 from source_links sl
  where sl.source_id = s.id
    and sl.music_accompaniment_period_id = t.period_id
);

insert into source_links (source_id, entity_id, scope, notes)
select s.id, e.id, 'Identidad e historia', 'Fuente institucional de la formación.'
from sources s
join entities e on e.slug = 'banda-musica-cruz-roja-sevilla'
where s.url = 'https://www.bandacruzroja.es/conocenos/historia'
  and not exists (
    select 1 from source_links sl
    where sl.source_id = s.id and sl.entity_id = e.id and sl.scope = 'Identidad e historia'
  );

insert into source_links (source_id, entity_id, scope, notes)
select s.id, ba.band_entity_id, 'relation:band_agent:' || ba.id::text, 'Dirección titular desde 2006.'
from sources s
join band_agents ba
  on ba.band_entity_id = (select id from entities where slug = 'banda-musica-cruz-roja-sevilla')
 and ba.agent_entity_id = (select id from entities where slug = 'jose-ignacio-cansino-gonzalez')
 and ba.is_current
where s.url = 'https://www.bandacruzroja.es/conocenos/director'
  and not exists (
    select 1 from source_links sl
    where sl.source_id = s.id
      and sl.entity_id = ba.band_entity_id
      and sl.scope = 'relation:band_agent:' || ba.id::text
  );

insert into source_links (source_id, music_accompaniment_period_id, scope, notes)
select s.id, p.id, 'Renovación 2026–2028', 'La Hermandad confirma tres Lunes Santos desde 2026.'
from sources s
join music_accompaniment_periods p
  on p.band_entity_id = (select id from entities where slug = 'banda-musica-cruz-roja-sevilla')
 and p.brotherhood_entity_id = (select id from entities where slug = 'hermandad-de-la-redencion')
 and p.outing_type = 'Lunes Santo'
 and p.is_current
where s.url = 'https://www.instagram.com/p/DQwMtcjDfnU/'
  and not exists (
    select 1 from source_links sl
    where sl.source_id = s.id and sl.music_accompaniment_period_id = p.id
  );

with additions(title, composer_name, display_order) as (
  values
    ('¡Viva la Asunción Gloriosa!', 'Cristóbal López Gándara', 10),
    ('El Día del Señor', 'Alfonso López', 20),
    ('El Rosario de María', 'Manuel Jesús Rodríguez', 30),
    ('Rosa Blanca', 'Daniel Albarrán', 40),
    ('Madre en el Cielo, Señora en la Tierra', 'Luis Manuel Mejías', 50)
)
insert into band_premieres (
  band_entity_id, title, composer_name, premiere_year,
  description, source_id, status, display_order
)
select
  (select id from entities where slug = 'banda-musica-cruz-roja-sevilla'),
  a.title,
  a.composer_name,
  2025,
  'Tipo de novedad: incorporación al repertorio. Obra incluida en la actualización 2025 del repertorio oficial; no se clasifica como estreno absoluto.',
  s.id,
  'published',
  a.display_order
from additions a
join sources s on s.url = 'https://www.bandacruzroja.es/wp-content/uploads/2025/02/INDICE-2025-1.pdf'
where not exists (
  select 1 from band_premieres bp
  where bp.band_entity_id = (select id from entities where slug = 'banda-musica-cruz-roja-sevilla')
    and bp.premiere_year = 2025
    and lower(bp.title) = lower(a.title)
);

insert into source_links (source_id, band_premiere_id, scope, notes)
select bp.source_id, bp.id, 'Incorporación al repertorio 2025', 'El documento oficial la incluye en el bloque ACTUALIZACIÓN 2025; no acredita un estreno absoluto.'
from band_premieres bp
where bp.band_entity_id = (select id from entities where slug = 'banda-musica-cruz-roja-sevilla')
  and bp.premiere_year = 2025
  and bp.title in ('¡Viva la Asunción Gloriosa!','El Día del Señor','El Rosario de María','Rosa Blanca','Madre en el Cielo, Señora en la Tierra')
  and not exists (
    select 1 from source_links sl
    where sl.source_id = bp.source_id and sl.band_premiere_id = bp.id
  );

do $$
begin
  if (select count(*) from music_accompaniment_periods
      where band_entity_id = (select id from entities where slug = 'banda-musica-cruz-roja-sevilla')
        and is_current
        and outing_type in ('Viernes de Dolores','Domingo de Ramos','Lunes Santo','Martes Santo','Miércoles Santo','Jueves Santo','Madrugá','Viernes Santo','Sábado Santo','Domingo de Resurrección')
        and year_from is not null
        and public_step_name is not null
        and public_municipality_name is not null) <> 10 then
    raise exception 'No se completaron los diez acompañamientos penitenciales de Cruz Roja';
  end if;

  if (select count(*) from band_premieres
      where band_entity_id = (select id from entities where slug = 'banda-musica-cruz-roja-sevilla')
        and premiere_year = 2025
        and description like 'Tipo de novedad: incorporación al repertorio.%') <> 5 then
    raise exception 'No quedaron normalizadas las cinco incorporaciones al repertorio de 2025';
  end if;
end $$;
