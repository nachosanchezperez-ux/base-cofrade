-- Hilo Cofrade · Banda del Santísimo Cristo de la Sangre (San Benito)
--
-- Crea una ficha completa y separa expresamente la pertenencia institucional
-- a la Hermandad de San Benito de los contratos de acompañamiento musical.

-- -----------------------------------------------------------------------------
-- 1. Identidad y presencia digital
-- -----------------------------------------------------------------------------

insert into public.entities (entity_type, name, slug, summary, status)
values (
  'band',
  'Sangre de San Benito',
  'sangre-de-san-benito',
  'Banda sevillana de cornetas y tambores de la Hermandad de San Benito, presentada oficialmente en 1992 y vinculada al barrio de la Calzá.',
  'published'
)
on conflict (slug) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  summary = excluded.summary,
  status = excluded.status;

insert into public.bands (
  entity_id, band_type, municipality_id, foundation_text, website_url,
  instagram_url, youtube_url, description, primary_color, secondary_color,
  logo_path, hero_image_path, hero_image_alt, hero_image_credit,
  linked_brotherhood_name, headquarters_text
)
select
  band.id,
  'Cornetas y Tambores',
  municipality.id,
  '1992 (gestada en 1991)',
  'https://www.bandacristodelasangre.org/',
  'https://www.instagram.com/sangresanbenito/',
  'https://www.youtube.com/@sangresanbenito1992',
  'La formación nació en 1991 dentro de la Agrupación Musical Nuestra Señora de la Encarnación. Comenzó sus ensayos oficiales en octubre de 1992 y se presentó el 27 de diciembre de ese año. Hizo su primera estación de penitencia en la Cruz de Guía de San Benito el Martes Santo de 1993 y, desde 1997, acompaña al Santísimo Cristo de la Sangre. En 1995 quedó confirmada su denominación actual. Su identidad está estrechamente ligada a la Hermandad de San Benito y al barrio sevillano de la Calzá.',
  '#65121A',
  '#2F284A',
  '/bandas/sangre-san-benito/imagotipo.webp',
  '/bandas/sangre-san-benito/cristo-sangre-martes-santo.webp',
  'Banda del Santísimo Cristo de la Sangre tras el crucificado de San Benito',
  'Banda del Santísimo Cristo de la Sangre · web oficial',
  'Hermandad de San Benito',
  'Complejo Musical La Madrina · avenida de Honduras, s/n · Sevilla'
from public.entities band
join public.municipalities municipality on municipality.slug = 'sevilla'
where band.slug = 'sangre-de-san-benito'
  and band.entity_type = 'band'
on conflict (entity_id) do update set
  band_type = excluded.band_type,
  municipality_id = excluded.municipality_id,
  foundation_text = excluded.foundation_text,
  website_url = excluded.website_url,
  instagram_url = excluded.instagram_url,
  youtube_url = excluded.youtube_url,
  description = excluded.description,
  primary_color = excluded.primary_color,
  secondary_color = excluded.secondary_color,
  logo_path = excluded.logo_path,
  hero_image_path = excluded.hero_image_path,
  hero_image_alt = excluded.hero_image_alt,
  hero_image_credit = excluded.hero_image_credit,
  linked_brotherhood_name = excluded.linked_brotherhood_name,
  headquarters_text = excluded.headquarters_text;

insert into public.band_names (
  band_entity_id, name, short_name, name_type, date_from_text, is_current, notes
)
select band.id, desired.name, desired.short_name, desired.name_type,
  desired.date_from_text, true, desired.notes
from public.entities band
cross join lateral (
  values
    (
      'Banda del Santísimo Cristo de la Sangre'::text,
      'BCT Stmo. Cristo de la Sangre'::text,
      'official'::text,
      'Desde 1995'::text,
      'Denominación oficial confirmada en el otoño de 1995.'::text
    ),
    (
      'Sangre de San Benito',
      'Sangre de San Benito',
      'popular',
      null,
      'Denominación popular y nombre del perfil oficial de Spotify.'
    )
) desired(name, short_name, name_type, date_from_text, notes)
where band.slug = 'sangre-de-san-benito'
  and band.entity_type = 'band'
  and not exists (
    select 1 from public.band_names existing
    where existing.band_entity_id = band.id
      and existing.name = desired.name
      and existing.name_type = desired.name_type
  );

insert into public.entity_social_links (
  entity_id, platform, url, label, display_order, is_public
)
select band.id, link.platform, link.url, link.label, link.display_order, true
from public.entities band
cross join lateral (
  values
    ('website'::text, 'https://www.bandacristodelasangre.org/'::text, 'Web oficial'::text, 10::smallint),
    ('instagram', 'https://www.instagram.com/sangresanbenito/', 'Instagram', 30::smallint),
    ('youtube', 'https://www.youtube.com/@sangresanbenito1992', 'YouTube', 40::smallint),
    ('spotify', 'https://open.spotify.com/artist/4m5XJ933CKakxuWjNDNshr', 'Spotify oficial', 50::smallint)
) link(platform, url, label, display_order)
where band.slug = 'sangre-de-san-benito'
  and band.entity_type = 'band'
on conflict (entity_id, platform) do update set
  url = excluded.url,
  label = excluded.label,
  display_order = excluded.display_order,
  is_public = excluded.is_public;

insert into public.band_colors (
  band_entity_id, color_name, hex_value, color_role, sort_order, notes, status
)
select band.id, color.color_name, color.hex_value, color.color_role,
  color.sort_order, color.notes, 'published'
from public.entities band
cross join lateral (
  values
    ('Sangre'::text, '#65121A'::text, 'primary'::text, 10::smallint, 'Burdeos de la identidad gráfica oficial'::text),
    ('Morado Calzá', '#2F284A', 'secondary', 20::smallint, 'Tono secundario empleado en la identidad corporativa'),
    ('Blanco', '#FFFFFF', 'accent', 30::smallint, 'Contraste del imagotipo oficial')
) color(color_name, hex_value, color_role, sort_order, notes)
where band.slug = 'sangre-de-san-benito'
  and band.entity_type = 'band'
on conflict (band_entity_id, color_name) do update set
  hex_value = excluded.hex_value,
  color_role = excluded.color_role,
  sort_order = excluded.sort_order,
  notes = excluded.notes,
  status = excluded.status;

-- -----------------------------------------------------------------------------
-- 2. Vinculación institucional con San Benito
-- -----------------------------------------------------------------------------

insert into public.entity_relations (
  source_entity_id, relation_type, target_entity_id,
  date_from_text, notes, status
)
select
  band.id,
  'belongs_to_brotherhood',
  brotherhood.id,
  'Desde su origen',
  'La banda nació en el seno de la Hermandad de San Benito. Los contratos con otras hermandades se registran separadamente como acompañamientos musicales.',
  'published'
from public.entities band
join public.entities brotherhood
  on brotherhood.slug = 'san-benito'
 and brotherhood.entity_type = 'brotherhood'
where band.slug = 'sangre-de-san-benito'
  and band.entity_type = 'band'
  and not exists (
    select 1 from public.entity_relations existing
    where existing.source_entity_id = band.id
      and existing.target_entity_id = brotherhood.id
      and existing.relation_type = 'belongs_to_brotherhood'
  );

-- -----------------------------------------------------------------------------
-- 3. Acompañamientos musicales vigentes e históricos
-- -----------------------------------------------------------------------------

create temporary table _hc_sangre_music_entities (
  entity_type text not null,
  name text not null,
  slug text primary key
) on commit drop;

insert into _hc_sangre_music_entities values
  ('brotherhood', 'Hermandad del Soberano Poder · Pusillus Grex', 'hermandad-soberano-poder-sanlucar'),
  ('brotherhood', 'Hermandad del Confalón de Écija', 'hermandad-confalon-ecija'),
  ('brotherhood', 'Hermandad del Santo Entierro de La Palma del Condado', 'hermandad-santo-entierro-la-palma'),
  ('step', 'Paso de Nuestro Padre Jesús del Soberano Poder', 'paso-soberano-poder-sanlucar'),
  ('step', 'Paso del Santísimo Cristo de la Columna y Azotes', 'paso-cristo-columna-azotes-ecija'),
  ('step', 'Paso del Santísimo Cristo de la Buena Muerte', 'paso-cristo-buena-muerte-la-palma');

insert into public.entities (entity_type, name, slug, status)
select entity_type, name, slug, 'draft'
from _hc_sangre_music_entities
on conflict (slug) do update set name = excluded.name;

create temporary table _hc_sangre_current_music (
  brotherhood_slug text primary key,
  step_slug text not null,
  outing_type text not null,
  position text not null,
  date_from_text text not null,
  year_from integer,
  public_brotherhood_name text not null,
  public_step_name text not null,
  notes text not null,
  source_url text not null
) on commit drop;

insert into _hc_sangre_current_music values
  (
    'san-benito', 'paso-del-cristo-de-la-sangre', 'Martes Santo',
    'Tras el Santísimo Cristo de la Sangre', 'Desde 1997', 1997,
    'Hermandad de San Benito', 'Paso del Santísimo Cristo de la Sangre',
    'Acompañamiento de la banda propia de la hermandad, vigente en el Martes Santo de 2026.',
    'https://www.andaluciainformacion.es/articulo/la-pasion/martes-santo-sevilla-2026-horarios-itinerarios-claves/202603180908273229209.html'
  ),
  (
    'hermandad-soberano-poder-sanlucar', 'paso-soberano-poder-sanlucar', 'Lunes Santo',
    'Tras Nuestro Padre Jesús del Soberano Poder', 'Vigente en 2026', null,
    'Hermandad del Soberano Poder · Pusillus Grex', 'Paso de Nuestro Padre Jesús del Soberano Poder',
    'Acompañamiento confirmado para el Lunes Santo de Sanlúcar de Barrameda de 2026.',
    'https://www.andaluciainformacion.es/articulo/sanlucar/lunes-santo-sanlucar-horarios-recorridos-cofradias-soberano-poder-canita/202603301108293236265.amp.html'
  ),
  (
    'hermandad-confalon-ecija', 'paso-cristo-columna-azotes-ecija', 'Jueves Santo',
    'Tras el misterio del Santísimo Cristo de la Columna y Azotes', 'Desde 2020', 2020,
    'Hermandad del Confalón de Écija', 'Paso del Santísimo Cristo de la Columna y Azotes',
    'Vínculo renovado para el Jueves Santo de 2026; es la sexta ocasión desde 2020.',
    'https://www.elpespunte.es/articulo/cofrade/hermandad-confalon-ecija-renueva-banda-stmo-cristo-sangre-san-benito/20251202231452116714.html'
  ),
  (
    'hermandad-santo-entierro-la-palma', 'paso-cristo-buena-muerte-la-palma', 'Viernes Santo',
    'Tras el Santísimo Cristo de la Buena Muerte', 'Vigente en 2026', null,
    'Hermandad del Santo Entierro de La Palma del Condado', 'Paso del Santísimo Cristo de la Buena Muerte',
    'Acompañamiento confirmado para el Viernes Santo de La Palma del Condado de 2026.',
    'https://elcondadonoticias.es/la-palma-del-condado-abrira-las-puertas-a-la-semana-santa-2026-este-domingo-de-ramos'
  );

insert into public.music_accompaniment_periods (
  brotherhood_entity_id, band_entity_id, step_entity_id, position,
  outing_type, date_from_text, year_from, is_current, notes, status,
  public_brotherhood_name, public_step_name, public_brotherhood_slug
)
select
  brotherhood.id, band.id, step.id, desired.position,
  desired.outing_type, desired.date_from_text, desired.year_from,
  true, desired.notes, 'published', desired.public_brotherhood_name,
  desired.public_step_name, desired.brotherhood_slug
from _hc_sangre_current_music desired
join public.entities band
  on band.slug = 'sangre-de-san-benito' and band.entity_type = 'band'
join public.entities brotherhood
  on brotherhood.slug = desired.brotherhood_slug and brotherhood.entity_type = 'brotherhood'
join public.entities step
  on step.slug = desired.step_slug and step.entity_type = 'step'
where not exists (
  select 1 from public.music_accompaniment_periods existing
  where existing.band_entity_id = band.id
    and existing.brotherhood_entity_id = brotherhood.id
    and existing.is_current
    and existing.status <> 'archived'
  );

create temporary table _hc_sangre_historical_music (
  brotherhood_slug text not null,
  step_slug text,
  outing_type text not null,
  position text not null,
  date_from_text text not null,
  year_from integer,
  date_to_text text not null,
  year_to integer,
  public_brotherhood_name text not null,
  public_step_name text not null,
  notes text not null,
  primary key (brotherhood_slug, date_from_text)
) on commit drop;

insert into _hc_sangre_historical_music values
  (
    'san-benito', null, 'Martes Santo', 'En la Cruz de Guía',
    'Desde 1993', 1993, 'Hasta 1996', 1996,
    'Hermandad de San Benito', 'Cruz de Guía',
    'La primera estación de penitencia de la banda fue en la Cruz de Guía de San Benito en 1993.'
  ),
  (
    'el-baratillo', 'paso-de-la-piedad', 'Miércoles Santo', 'Tras el paso de misterio',
    'Año 2004', 2004, 'Año 2004', 2004,
    'Hermandad del Baratillo', 'Paso de la Piedad',
    'En 2004 acompañó al paso de misterio de la Hermandad del Baratillo.'
  );

insert into public.music_accompaniment_periods (
  brotherhood_entity_id, band_entity_id, step_entity_id, position,
  outing_type, date_from_text, year_from, date_to_text, year_to,
  is_current, notes, status, public_brotherhood_name,
  public_step_name, public_brotherhood_slug
)
select
  brotherhood.id, band.id, step.id, desired.position,
  desired.outing_type, desired.date_from_text, desired.year_from,
  desired.date_to_text, desired.year_to, false, desired.notes, 'published',
  desired.public_brotherhood_name, desired.public_step_name,
  desired.brotherhood_slug
from _hc_sangre_historical_music desired
join public.entities band
  on band.slug = 'sangre-de-san-benito' and band.entity_type = 'band'
join public.entities brotherhood
  on brotherhood.slug = desired.brotherhood_slug and brotherhood.entity_type = 'brotherhood'
left join public.entities step
  on step.slug = desired.step_slug and step.entity_type = 'step'
where not exists (
  select 1 from public.music_accompaniment_periods existing
  where existing.band_entity_id = band.id
    and existing.brotherhood_entity_id = brotherhood.id
    and existing.date_from_text = desired.date_from_text
    and not existing.is_current
  );

-- -----------------------------------------------------------------------------
-- 4. Discografía oficial de Spotify, con portadas
-- -----------------------------------------------------------------------------

create temporary table _hc_sangre_releases (
  title text not null,
  release_type text not null,
  release_year integer not null,
  spotify_album_id text not null,
  cover_url text not null,
  description text not null,
  primary key (title, release_year)
) on commit drop;

insert into _hc_sangre_releases values
  ('Cuaresma 2025', 'album', 2025, '0NraULFrl2TyNs8aAWgzrK', 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e020433ffcbdb5b59e136ad8b9d', 'Álbum publicado en el perfil oficial de la formación.'),
  ('ESTRENOS 2024', 'single', 2024, '0W24qmqWhFej2Fx1TXYypH', 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e0220fe15f63397c183cf0b5ff2', 'Lanzamiento que reúne estrenos de la formación en 2024.'),
  ('Ave María Encarnación (En Directo)', 'single', 2023, '0fBdo1KWuG0ScEYoLsTmh0', 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02c51d4098fbd54b197b755d45', 'Grabación en directo publicada en Spotify.'),
  ('Directos de la Calzá', 'album', 2023, '2AEXdL7TzncPjFvmtNaXh2', 'https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e026fda05d8246223a36495e6be', 'Álbum de interpretaciones en directo vinculado a la identidad de la Calzá.'),
  ('Al Stmo. Cristo de la Sangre', 'album', 2006, '33T7aCnO5EluQOL0piqhNb', 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e0297d4c403a119e524e5c4e170', 'Trabajo discográfico dedicado al titular cristífero de San Benito.'),
  ('Camino al Calvario (Estreno 2023)', 'single', 2023, '3aOnbW85SC8YLGF1fjYQBc', 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e025611a35de4e27239f3e81ade', 'Estreno de la marcha de Francisco Javier González Ríos.'),
  ('Pasan Los Campanilleros', 'single', 2024, '4AB7RacwFb0smtMaSgGE20', 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02797ad554f501da7d1a43d7a4', 'Sencillo publicado en el perfil oficial de Spotify.'),
  ('Navidad en la Calzá', 'album', 2022, '5ZJq9UnungLaXStG9IaBfo', 'https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e0246457af9571583fa394b2787', 'Trabajo navideño de la formación.'),
  ('A Pulso', 'album', 2001, '5qdwwlZI6ORpHzIn3GU35e', 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02ecf49f512dcf60b9c7893cc2', 'Primer trabajo discográfico destacado en la historia oficial de la banda.'),
  ('El Pacto de Sangre (Estreno 2024)', 'single', 2024, '62eOplYLH8NdQX2pdwAck3', 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02443cb39ac4e3505a4cb3a0e9', 'Estreno de la marcha de Abraham Padilla Consuegra.'),
  ('Salud de San Bernardo', 'single', 2023, '6pyyttj7Y0zGpJ0M84YVYi', 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e023e62bd17e9035d72e42235d0', 'Sencillo publicado en el perfil oficial de Spotify.'),
  ('Promesa y Pasión (en Directo)', 'single', 2023, '6wELXlIMj7E9sTSinXZVt4', 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e0242f937b4fcc3c2d334e2e7e2', 'Grabación en directo de la marcha de Pablo Perea Garrido.'),
  ('Cristo de la Sangre en la Cuesta del Rosario 2023', 'single', 2023, '7q6u2YSnA1l2hFYBvGbAxb', 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e020376b246aebd3e8d6b0ab768', 'Grabación en directo del Martes Santo de 2023.');

insert into public.band_releases (
  band_entity_id, title, release_type, release_year, description,
  cover_image_path, cover_image_alt, cover_image_credit,
  spotify_url, status
)
select
  band.id, release.title, release.release_type, release.release_year,
  release.description, release.cover_url,
  'Portada de «' || release.title || '»',
  'Portada oficial · Spotify',
  'https://open.spotify.com/album/' || release.spotify_album_id,
  'published'
from _hc_sangre_releases release
join public.entities band
  on band.slug = 'sangre-de-san-benito' and band.entity_type = 'band'
on conflict (band_entity_id, title, release_year) do update set
  release_type = excluded.release_type,
  description = excluded.description,
  cover_image_path = excluded.cover_image_path,
  cover_image_alt = excluded.cover_image_alt,
  cover_image_credit = excluded.cover_image_credit,
  spotify_url = excluded.spotify_url,
  status = excluded.status,
  updated_at = now();

-- -----------------------------------------------------------------------------
-- 5. Fuentes y estrenos recientes
-- -----------------------------------------------------------------------------

create temporary table _hc_sangre_sources (
  name text not null,
  url text primary key,
  source_type text not null,
  publisher text not null,
  publication_date date,
  scope text not null
) on commit drop;

insert into _hc_sangre_sources values
  ('Historia de la Banda del Santísimo Cristo de la Sangre', 'https://www.bandacristodelasangre.org/historia/', 'Web oficial', 'Banda del Santísimo Cristo de la Sangre', null, 'Historia, denominación, vinculación institucional y acompañamientos históricos'),
  ('Repertorio de la Banda del Santísimo Cristo de la Sangre', 'https://www.bandacristodelasangre.org/repertorio/', 'Web oficial', 'Banda del Santísimo Cristo de la Sangre', null, 'Repertorio y estrenos de la formación'),
  ('Perfil oficial de Sangre San Benito en Spotify', 'https://open.spotify.com/artist/4m5XJ933CKakxuWjNDNshr', 'Plataforma musical', 'Spotify', null, 'Catálogo discográfico y portadas oficiales'),
  ('Martes Santo de Sevilla 2026', 'https://www.andaluciainformacion.es/articulo/la-pasion/martes-santo-sevilla-2026-horarios-itinerarios-claves/202603180908273229209.html', 'Prensa', 'Andalucía Información', '2026-03-18', 'Acompañamiento del Cristo de la Sangre en 2026'),
  ('Lunes Santo de Sanlúcar 2026', 'https://www.andaluciainformacion.es/articulo/sanlucar/lunes-santo-sanlucar-horarios-recorridos-cofradias-soberano-poder-canita/202603301108293236265.amp.html', 'Prensa', 'Andalucía Información', '2026-03-30', 'Acompañamiento de Pusillus Grex en 2026'),
  ('Renovación con la Hermandad del Confalón', 'https://www.elpespunte.es/articulo/cofrade/hermandad-confalon-ecija-renueva-banda-stmo-cristo-sangre-san-benito/20251202231452116714.html', 'Prensa cofrade', 'El Pespunte', '2025-12-02', 'Acompañamiento del Confalón de Écija desde 2020 y renovación para 2026'),
  ('Semana Santa de La Palma del Condado 2026', 'https://elcondadonoticias.es/la-palma-del-condado-abrira-las-puertas-a-la-semana-santa-2026-este-domingo-de-ramos', 'Prensa local', 'El Condado Noticias', null, 'Acompañamiento del Cristo de la Buena Muerte en 2026'),
  ('Estreno de Bicentenario', 'https://www.bandacristodelasangre.org/la-banda-de-la-sangre-estrena-este-martes-bicentenario-marcha-de-jorge-martin-puerto-dedicada-al-200-aniversario-de-la-policia-nacional/', 'Web oficial', 'Banda del Santísimo Cristo de la Sangre', '2024-03-18', 'Autoría, dedicatoria y estreno de Bicentenario'),
  ('Estreno de El Pacto de Sangre', 'https://www.bandacristodelasangre.org/la-marcha-el-pacto-de-sangre-de-abraham-padilla-vera-la-luz-el-3-de-febrero-en-san-jacinto/', 'Web oficial', 'Banda del Santísimo Cristo de la Sangre', '2024-01-24', 'Autoría y estreno de El Pacto de Sangre'),
  ('Estreno de Camino al Calvario', 'https://www.bandacristodelasangre.org/asi-fue-camino-al-calvario/', 'Web oficial', 'Banda del Santísimo Cristo de la Sangre', '2023-03-24', 'Autoría y estreno de Camino al Calvario'),
  ('Estreno de Promesa y Pasión', 'https://www.bandacristodelasangre.org/promesaypasion/', 'Web oficial', 'Banda del Santísimo Cristo de la Sangre', '2023-03-30', 'Autoría y estreno de Promesa y Pasión');

insert into public.sources (
  name, url, source_type, author_or_publisher, publication_date, accessed_at
)
select name, url, source_type, publisher, publication_date, current_date
from _hc_sangre_sources desired
where not exists (
  select 1 from public.sources existing where existing.url = desired.url
);

update public.sources source
set name = desired.name,
    source_type = desired.source_type,
    author_or_publisher = desired.publisher,
    publication_date = desired.publication_date,
    accessed_at = current_date
from _hc_sangre_sources desired
where source.url = desired.url;

insert into public.source_links (source_id, entity_id, scope)
select source.id, band.id, desired.scope
from _hc_sangre_sources desired
join public.sources source on source.url = desired.url
join public.entities band
  on band.slug = 'sangre-de-san-benito' and band.entity_type = 'band'
where not exists (
  select 1 from public.source_links existing
  where existing.source_id = source.id and existing.entity_id = band.id
);

insert into public.band_release_sources (release_id, source_id, scope)
select release.id, source.id, 'Catálogo y portada oficial en Spotify'
from public.band_releases release
join public.entities band
  on band.id = release.band_entity_id and band.slug = 'sangre-de-san-benito'
join public.sources source
  on source.url = 'https://open.spotify.com/artist/4m5XJ933CKakxuWjNDNshr'
on conflict (release_id, source_id) do update set scope = excluded.scope;

create temporary table _hc_sangre_premieres (
  title text primary key,
  composer_name text not null,
  premiere_year integer not null,
  premiere_date date not null,
  venue_text text not null,
  description text not null,
  video_url text,
  source_url text not null,
  display_order integer not null
) on commit drop;

insert into _hc_sangre_premieres values
  ('Bicentenario', 'Jorge Martín Puerto', 2024, '2024-03-19', 'Via Crucis del Santísimo Cristo de la Sangre · barrio de la Calzá', 'Marcha dedicada al bicentenario de la Policía Nacional.', null, 'https://www.bandacristodelasangre.org/la-banda-de-la-sangre-estrena-este-martes-bicentenario-marcha-de-jorge-martin-puerto-dedicada-al-200-aniversario-de-la-policia-nacional/', 10),
  ('El Pacto de Sangre', 'Abraham Padilla Consuegra', 2024, '2024-02-03', 'Parroquia de San Jacinto', 'Composición inspirada en la cita evangélica del nuevo pacto y el perdón de los pecados.', null, 'https://www.bandacristodelasangre.org/la-marcha-el-pacto-de-sangre-de-abraham-padilla-vera-la-luz-el-3-de-febrero-en-san-jacinto/', 20),
  ('Promesa y Pasión', 'Pablo Perea Garrido', 2023, '2023-03-30', 'Iglesia del Señor San José', 'Marcha dedicada al Santísimo Cristo de la Sangre y a la memoria de Pascual González.', null, 'https://www.bandacristodelasangre.org/promesaypasion/', 30),
  ('Camino al Calvario', 'Francisco Javier González Ríos', 2023, '2023-03-10', 'Iglesia de Los Terceros', 'Marcha dedicada a los componentes, colaboradores y familias de la formación.', 'https://youtu.be/rXWsSJ7nKho', 'https://www.bandacristodelasangre.org/asi-fue-camino-al-calvario/', 40);

insert into public.band_premieres (
  band_entity_id, title, composer_name, premiere_year, premiere_date,
  venue_text, municipality_text, video_url, description, source_id,
  status, display_order
)
select
  band.id, premiere.title, premiere.composer_name,
  premiere.premiere_year, premiere.premiere_date,
  premiere.venue_text, 'Sevilla', premiere.video_url,
  premiere.description, source.id, 'published', premiere.display_order
from _hc_sangre_premieres premiere
join public.entities band
  on band.slug = 'sangre-de-san-benito' and band.entity_type = 'band'
join public.sources source on source.url = premiere.source_url
on conflict (band_entity_id, title, premiere_year) do update set
  composer_name = excluded.composer_name,
  premiere_date = excluded.premiere_date,
  venue_text = excluded.venue_text,
  municipality_text = excluded.municipality_text,
  video_url = excluded.video_url,
  description = excluded.description,
  source_id = excluded.source_id,
  status = excluded.status,
  display_order = excluded.display_order,
  updated_at = now();

insert into public.source_links (source_id, band_premiere_id, scope)
select source.id, premiere.id, 'Fuente del estreno y de su autoría'
from _hc_sangre_premieres desired
join public.sources source on source.url = desired.source_url
join public.entities band
  on band.slug = 'sangre-de-san-benito' and band.entity_type = 'band'
join public.band_premieres premiere
  on premiere.band_entity_id = band.id
 and premiere.title = desired.title
 and premiere.premiere_year = desired.premiere_year
where not exists (
  select 1 from public.source_links existing
  where existing.source_id = source.id
    and existing.band_premiere_id = premiere.id
);

insert into public.source_links (source_id, music_accompaniment_period_id, scope)
select source.id, period.id, desired.notes
from _hc_sangre_current_music desired
join public.sources source on source.url = desired.source_url
join public.entities band
  on band.slug = 'sangre-de-san-benito' and band.entity_type = 'band'
join public.entities brotherhood
  on brotherhood.slug = desired.brotherhood_slug and brotherhood.entity_type = 'brotherhood'
join public.music_accompaniment_periods period
  on period.band_entity_id = band.id
 and period.brotherhood_entity_id = brotherhood.id
 and period.is_current
where not exists (
  select 1 from public.source_links existing
  where existing.source_id = source.id
    and existing.music_accompaniment_period_id = period.id
);

insert into public.source_links (source_id, entity_relation_id, scope)
select source.id, relation.id, 'Pertenencia institucional a la Hermandad de San Benito'
from public.sources source
join public.entities band on band.slug = 'sangre-de-san-benito'
join public.entities brotherhood on brotherhood.slug = 'san-benito'
join public.entity_relations relation
  on relation.source_entity_id = band.id
 and relation.target_entity_id = brotherhood.id
 and relation.relation_type = 'belongs_to_brotherhood'
where source.url = 'https://www.bandacristodelasangre.org/historia/'
  and not exists (
    select 1 from public.source_links existing
    where existing.source_id = source.id
      and existing.entity_relation_id = relation.id
  );

-- -----------------------------------------------------------------------------
-- 6. Comprobaciones editoriales
-- -----------------------------------------------------------------------------

do $$
declare
  relation_count integer;
  current_music_count integer;
  historical_music_count integer;
  release_count integer;
  covered_release_count integer;
  premiere_count integer;
  direction_count integer;
begin
  select count(*) into relation_count
  from public.entity_relations relation
  join public.entities band on band.id = relation.source_entity_id
  join public.entities brotherhood on brotherhood.id = relation.target_entity_id
  where band.slug = 'sangre-de-san-benito'
    and brotherhood.slug = 'san-benito'
    and relation.relation_type = 'belongs_to_brotherhood';

  select count(*) filter (where period.is_current),
         count(*) filter (where not period.is_current)
    into current_music_count, historical_music_count
  from public.music_accompaniment_periods period
  join public.entities band on band.id = period.band_entity_id
  where band.slug = 'sangre-de-san-benito'
    and period.status = 'published';

  select count(*), count(*) filter (
    where release.cover_image_path is not null and release.spotify_url is not null
  ) into release_count, covered_release_count
  from public.band_releases release
  join public.entities band on band.id = release.band_entity_id
  where band.slug = 'sangre-de-san-benito'
    and release.status = 'published';

  select count(*) into premiere_count
  from public.band_premieres premiere
  join public.entities band on band.id = premiere.band_entity_id
  where band.slug = 'sangre-de-san-benito'
    and premiere.status = 'published';

  select count(*) into direction_count
  from public.band_agents assignment
  join public.entities band on band.id = assignment.band_entity_id
  where band.slug = 'sangre-de-san-benito';

  if relation_count <> 1 then
    raise exception 'Debe existir una única vinculación institucional con San Benito; encontradas: %', relation_count;
  end if;
  if current_music_count <> 4 or historical_music_count < 2 then
    raise exception 'Acompañamientos incompletos: vigentes %, históricos %', current_music_count, historical_music_count;
  end if;
  if release_count <> 13 or covered_release_count <> 13 then
    raise exception 'Discografía incompleta: publicaciones %, con portada %', release_count, covered_release_count;
  end if;
  if premiere_count <> 4 then
    raise exception 'Estrenos incompletos: %', premiere_count;
  end if;
  if direction_count <> 0 then
    raise exception 'La ficha no debe cargar un apartado de dirección; encontrados: %', direction_count;
  end if;
end
$$;
