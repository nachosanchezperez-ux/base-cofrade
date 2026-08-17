-- Hilo Cofrade · Catálogo discográfico histórico de Encarnación
-- Migración 045
--
-- Completa los ocho trabajos anteriores a «Hijos de la Encarnación» usando
-- documentación oficial. Las pistas se registran como cortes del lanzamiento.
-- No se crean entidades Marcha automáticamente: una pista solo se enlaza a
-- Marcha cuando la obra y sus relaciones estén estructuradas y documentadas.

insert into public.sources (
  id, name, url, source_type, author_or_publisher, accessed_at
) values (
  'd4400000-0000-0000-0000-000000000001',
  'Discografía · Agrupación Musical Nuestra Señora de la Encarnación',
  'https://www.amencarnacion.com/discografia/',
  'Web oficial',
  'Agrupación Musical Nuestra Señora de la Encarnación',
  '2026-08-18'
)
on conflict (id) do update set
  name = excluded.name,
  url = excluded.url,
  source_type = excluded.source_type,
  author_or_publisher = excluded.author_or_publisher,
  accessed_at = excluded.accessed_at;

insert into public.band_releases (
  band_entity_id, title, release_type, release_year, ordinal_number,
  description, external_url, status
) values
('cb04a5d8-e81e-4405-a001-9d5a60840924', 'Presentación y Sangre', 'album', 1996, 1, 'Primer trabajo discográfico de la Agrupación Musical Nuestra Señora de la Encarnación, presentado en 1996.', 'https://www.amencarnacion.com/discografia/', 'published'),
('cb04a5d8-e81e-4405-a001-9d5a60840924', 'Presentando a Sevilla', 'album', 1999, 2, 'Segundo trabajo discográfico de la Agrupación, grabado en 1999 y orientado a ampliar su repertorio propio.', 'https://www.amencarnacion.com/discografia/', 'published'),
('cb04a5d8-e81e-4405-a001-9d5a60840924', 'X Aniversario', 'album', 2001, 3, 'Tercer trabajo discográfico, publicado en 2001 con motivo del X aniversario de la formación.', 'https://www.amencarnacion.com/discografia/', 'published'),
('cb04a5d8-e81e-4405-a001-9d5a60840924', 'A las Hermandades de la Paz y San Benito', 'album', 2003, 4, 'Cuarto trabajo discográfico de la Agrupación, grabado en 2003 en honor a las hermandades de La Paz y San Benito.', 'https://www.amencarnacion.com/discografia/', 'published'),
('cb04a5d8-e81e-4405-a001-9d5a60840924', 'A Mi Hermandad', 'album', 2005, 5, 'Quinto trabajo discográfico de la Agrupación, grabado en 2005 y dedicado a la Hermandad de San Benito.', 'https://www.amencarnacion.com/discografia/', 'published'),
('cb04a5d8-e81e-4405-a001-9d5a60840924', 'De la “Calza” a Sevilla', 'album', 2006, 6, 'Sexto trabajo discográfico de la Agrupación Musical Nuestra Señora de la Encarnación, publicado en 2006.', 'https://www.amencarnacion.com/discografia/', 'published'),
('cb04a5d8-e81e-4405-a001-9d5a60840924', 'Al Estilo de Sevilla', 'album', 2009, 7, 'Séptimo trabajo discográfico de la Agrupación, grabado en 2009.', 'https://www.amencarnacion.com/discografia/', 'published'),
('cb04a5d8-e81e-4405-a001-9d5a60840924', 'XXV Aniversario', 'album', 2015, 8, 'Octavo trabajo discográfico, grabado con motivo del XXV aniversario de la Agrupación en 2015.', 'https://hermandaddesanbenito.net/cddvd/', 'published')
on conflict (band_entity_id, title, release_year) do update set
  release_type = excluded.release_type,
  ordinal_number = excluded.ordinal_number,
  description = excluded.description,
  external_url = excluded.external_url,
  status = excluded.status;

-- 1 · Presentación y Sangre · 1996
with release as (
  select id from public.band_releases where band_entity_id = 'cb04a5d8-e81e-4405-a001-9d5a60840924' and title = 'Presentación y Sangre' and release_year = 1996
), track_data(sequence_no, title) as (values
  (1, 'Costaleros de Dios'), (2, 'Jesús Sacramentado'), (3, 'Virgen de Lourdes'),
  (4, 'Sabed que vendrá'), (5, 'Virgen de Valvanera'), (6, 'Sangre y Costal'),
  (7, 'Cantemos el gozo de la resurrección'), (8, 'He ahí, Jesús'), (9, 'Salve de la coronación')
)
insert into public.band_release_tracks (release_id, sequence_no, title, march_entity_id)
select release.id, track_data.sequence_no, track_data.title, null from release cross join track_data
on conflict (release_id, sequence_no) do update set title = excluded.title;

-- 2 · Presentando a Sevilla · 1999
with release as (
  select id from public.band_releases where band_entity_id = 'cb04a5d8-e81e-4405-a001-9d5a60840924' and title = 'Presentando a Sevilla' and release_year = 1999
), track_data(sequence_no, title) as (values
  (1, 'Presentado a Sevilla'), (2, 'Jesús de la Redención'), (3, 'Expiración en Triana'),
  (4, 'Presentación'), (5, 'Santa María de la Esperanza'), (6, 'Reina y Madre de la Encarnación'),
  (7, 'Gran Poder en tu Merced'), (8, 'Jesús de Nazaret'), (9, 'Sangre de Cristo'), (10, 'Himno Nacional')
)
insert into public.band_release_tracks (release_id, sequence_no, title, march_entity_id)
select release.id, track_data.sequence_no, track_data.title, null from release cross join track_data
on conflict (release_id, sequence_no) do update set title = excluded.title;

-- 3 · X Aniversario · 2001
with release as (
  select id from public.band_releases where band_entity_id = 'cb04a5d8-e81e-4405-a001-9d5a60840924' and title = 'X Aniversario' and release_year = 2001
), track_data(sequence_no, title) as (values
  (1, 'Señor de la Calza'), (2, 'Costaleros de Dios'), (3, 'A los pies de Sor Ángela'),
  (4, 'Cantemos al Amor de los Amores'), (5, 'Humilde Cautivo'), (6, 'Y en la Calzada lo presentaron'),
  (7, 'Alma de Dios'), (8, 'Bajo tu manto de Amor'), (9, 'Rey de la Paz'), (10, 'Perdona a tu Pueblo (Directo)')
)
insert into public.band_release_tracks (release_id, sequence_no, title, march_entity_id)
select release.id, track_data.sequence_no, track_data.title, null from release cross join track_data
on conflict (release_id, sequence_no) do update set title = excluded.title;

-- 4 · A las Hermandades de la Paz y San Benito · 2003
with release as (
  select id from public.band_releases where band_entity_id = 'cb04a5d8-e81e-4405-a001-9d5a60840924' and title = 'A las Hermandades de la Paz y San Benito' and release_year = 2003
), track_data(sequence_no, title) as (values
  (1, 'Himno Nacional (Directo) y Nuestro Padre Jesús de la Victoria'),
  (2, 'Padre Mío de la Victoria'),
  (3, 'Nuestro Padre Jesús de la Victoria, Costalero y La Saeta'),
  (4, 'Comentarios'), (5, 'Jesús de la Victoria'), (6, 'Comentarios'), (7, 'Virgen de la Paz'),
  (8, 'Himno Nacional (Directo) y Costaleros de Fe'), (9, 'Presentado a Sevilla'),
  (10, 'Alma de Dios'), (11, 'Cristo de las Cinco Llagas'), (12, 'Presentación y Trabajaderas'),
  (13, 'Madre de la Encarnación (Saeta)'), (14, 'Nuestra Señora de la Encarnación'), (15, 'Sacramento')
)
insert into public.band_release_tracks (release_id, sequence_no, title, march_entity_id)
select release.id, track_data.sequence_no, track_data.title, null from release cross join track_data
on conflict (release_id, sequence_no) do update set title = excluded.title;

-- 5 · A Mi Hermandad · 2005
with release as (
  select id from public.band_releases where band_entity_id = 'cb04a5d8-e81e-4405-a001-9d5a60840924' and title = 'A Mi Hermandad' and release_year = 2005
), track_data(sequence_no, title) as (values
  (1, 'Himno Nacional (Directo) y Perdona a tu Pueblo (Directo)'), (2, 'Costaleros de Fe'),
  (3, 'Alma mía'), (4, 'Nuestro Padre Jesús de la Victoria'), (5, 'La Santa Espina'),
  (6, 'Jesús de la Presentación'), (7, 'Refugio de nuestras almas'), (8, 'Jesús del Gran Poder'),
  (9, 'Himno al Santísimo Cristo de la Sangre'), (10, 'Legionarios del Porvenir'),
  (11, 'Rabí de Galilea'), (12, 'Coral')
)
insert into public.band_release_tracks (release_id, sequence_no, title, march_entity_id)
select release.id, track_data.sequence_no, track_data.title, null from release cross join track_data
on conflict (release_id, sequence_no) do update set title = excluded.title;

-- 6 · De la “Calza” a Sevilla · 2006
with release as (
  select id from public.band_releases where band_entity_id = 'cb04a5d8-e81e-4405-a001-9d5a60840924' and title = 'De la “Calza” a Sevilla' and release_year = 2006
), track_data(sequence_no, title) as (values
  (1, 'Presentación'), (2, 'Señor de la Calza'), (3, 'Reina y Madre de la Encarnación'),
  (4, 'Costaleros de Fe'), (5, 'A los pies de Sor Ángela'), (6, 'Presentado a Sevilla'),
  (7, 'Costalero de Dios'), (8, 'Alma de Dios'), (9, 'Santa María de la Esperanza'),
  (10, 'Cantemos al Amor de los Amores'), (11, 'Y en la Calza lo presentaron'),
  (12, 'Himno Nacional (Directo)'), (13, 'Humilde y Cautivo y Presentado a Sevilla'),
  (14, 'Costalero y La Saeta'), (15, 'Presentado a Sevilla')
)
insert into public.band_release_tracks (release_id, sequence_no, title, march_entity_id)
select release.id, track_data.sequence_no, track_data.title, null from release cross join track_data
on conflict (release_id, sequence_no) do update set title = excluded.title;

-- 7 · Al Estilo de Sevilla · 2009
with release as (
  select id from public.band_releases where band_entity_id = 'cb04a5d8-e81e-4405-a001-9d5a60840924' and title = 'Al Estilo de Sevilla' and release_year = 2009
), track_data(sequence_no, title) as (values
  (1, 'Encarnación'), (2, 'Estrella'), (3, 'Y contigo hasta el cielo'), (4, 'Suspiros de San Julián'),
  (5, 'Martes Santo en la Calza'), (6, 'Un costal y una faja… de penitencia'),
  (7, 'De vuelta al Porvenir'), (8, 'Por Amor Cautivo'), (9, 'Por Pilatos condenado'),
  (10, 'Virgen de la Paz'), (11, 'Ángeles')
)
insert into public.band_release_tracks (release_id, sequence_no, title, march_entity_id)
select release.id, track_data.sequence_no, track_data.title, null from release cross join track_data
on conflict (release_id, sequence_no) do update set title = excluded.title;

-- 8 · XXV Aniversario · 2015
with release as (
  select id from public.band_releases where band_entity_id = 'cb04a5d8-e81e-4405-a001-9d5a60840924' and title = 'XXV Aniversario' and release_year = 2015
), track_data(sequence_no, title) as (values
  (1, 'Señor, Danos la Paz'), (2, 'Arriba el Hijo de Dios'), (3, 'Romance en el Porvenir'),
  (4, 'Entregado a su Pueblo'), (5, 'Pasión en la Calza'), (6, 'Oriente de Sevilla'),
  (7, 'Sagrada Presentación'), (8, 'Hermanos de Sangre'), (9, 'De Nazaret a Sevilla'),
  (10, 'La Condena de un Inocente')
)
insert into public.band_release_tracks (release_id, sequence_no, title, march_entity_id)
select release.id, track_data.sequence_no, track_data.title, null from release cross join track_data
on conflict (release_id, sequence_no) do update set title = excluded.title;

-- La página oficial de la banda documenta los siete primeros trabajos.
insert into public.band_release_sources (release_id, source_id, scope)
select release.id, 'd4400000-0000-0000-0000-000000000001',
       'Título, año, ordinal y repertorio del lanzamiento'
from public.band_releases release
where release.band_entity_id = 'cb04a5d8-e81e-4405-a001-9d5a60840924'
  and release.ordinal_number between 1 and 7
on conflict (release_id, source_id) do update set scope = excluded.scope;

-- La Hermandad de San Benito documenta el catálogo completo, incluidos
-- «XXV Aniversario» y «Hijos de la Encarnación».
insert into public.band_release_sources (release_id, source_id, scope)
select release.id, 'e9bbf639-dc91-4438-9264-f80c7017f0c2',
       'Catálogo discográfico, ordinal y repertorio'
from public.band_releases release
where release.band_entity_id = 'cb04a5d8-e81e-4405-a001-9d5a60840924'
  and release.ordinal_number between 1 and 9
on conflict (release_id, source_id) do update set scope = excluded.scope;
