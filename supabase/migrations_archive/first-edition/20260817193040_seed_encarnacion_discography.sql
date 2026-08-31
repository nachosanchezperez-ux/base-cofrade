-- Hilo Cofrade · Piloto real de Discografía
-- Migración 040
--
-- Crea una ficha pública mínima y documentada de la Agrupación Musical
-- Nuestra Señora de la Encarnación y carga «Hijos de la Encarnación» como
-- primer lanzamiento real del nuevo modelo de Discografía.
--
-- La Hermandad de San Benito sitúa la salida del noveno trabajo el 30/12/2023.
-- Las plataformas digitales lo catalogan como lanzamiento de 2024. Se conserva
-- explícitamente esa diferencia en release_date_text.

-- -----------------------------------------------------------------------------
-- AGRUPACIÓN MUSICAL NUESTRA SEÑORA DE LA ENCARNACIÓN
-- -----------------------------------------------------------------------------

insert into public.entities (
  id, entity_type, name, slug, summary, status
) values (
  'cb04a5d8-e81e-4405-a001-9d5a60840924',
  'band',
  'Agrupación Musical Nuestra Señora de la Encarnación',
  'agrupacion-musical-nuestra-senora-de-la-encarnacion',
  'Agrupación musical sevillana propia de la Hermandad de San Benito, fundada en 1990.',
  'published'
)
on conflict (id) do update set
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.bands (
  entity_id,
  band_type,
  municipality_id,
  foundation_text,
  description,
  linked_brotherhood_name,
  website_url
)
select
  'cb04a5d8-e81e-4405-a001-9d5a60840924',
  'Agrupación Musical',
  municipality.id,
  '1990',
  'Agrupación Musical Nuestra Señora de la Encarnación, formación propia de la Hermandad de San Benito. Su trayectoria y patrimonio musical se documentarán progresivamente en Hilo Cofrade.',
  'Hermandad de San Benito',
  'https://www.amencarnacion.com/'
from public.municipalities municipality
where municipality.slug = 'sevilla'
on conflict (entity_id) do update set
  band_type = excluded.band_type,
  municipality_id = excluded.municipality_id,
  foundation_text = excluded.foundation_text,
  description = excluded.description,
  linked_brotherhood_name = excluded.linked_brotherhood_name,
  website_url = excluded.website_url;

insert into public.band_names (
  id, band_entity_id, name, short_name, name_type, is_current
) values
(
  'e188fc44-7c1b-4fed-8944-e555508d77ab',
  'cb04a5d8-e81e-4405-a001-9d5a60840924',
  'Agrupación Musical Nuestra Señora de la Encarnación',
  'AM Encarnación',
  'official',
  true
),
(
  '6a2c6c24-16a6-4299-a1a0-2b9064da3809',
  'cb04a5d8-e81e-4405-a001-9d5a60840924',
  'Encarnación',
  'Encarnación',
  'popular',
  true
)
on conflict (id) do update set
  name = excluded.name,
  short_name = excluded.short_name,
  name_type = excluded.name_type,
  is_current = excluded.is_current;

-- Si San Benito ya existe como entidad, dejamos preparada la relación formal.
-- La salvaguarda de la migración 038 degradará automáticamente la relación a
-- draft si cualquiera de los extremos aún no está publicado.
insert into public.entity_relations (
  id, source_entity_id, target_entity_id, relation_type, status, notes
)
select
  'e3f58caa-2e89-4b98-8d11-b7f7156c5b8b',
  'cb04a5d8-e81e-4405-a001-9d5a60840924',
  brotherhood.id,
  'belongs_to_brotherhood',
  'published',
  'Formación musical propia de la Hermandad de San Benito.'
from public.entities brotherhood
where brotherhood.entity_type = 'brotherhood'
  and brotherhood.slug = 'san-benito'
on conflict (id) do update set
  target_entity_id = excluded.target_entity_id,
  relation_type = excluded.relation_type,
  status = excluded.status,
  notes = excluded.notes;

-- -----------------------------------------------------------------------------
-- FUENTES DEL PILOTO
-- -----------------------------------------------------------------------------

insert into public.sources (
  id, name, url, source_type, author_or_publisher, accessed_at
) values
(
  'e9bbf639-dc91-4438-9264-f80c7017f0c2',
  'Discografía · Agrupación Musical Nuestra Señora de la Encarnación',
  'https://hermandaddesanbenito.net/cddvd/',
  'Web oficial',
  'Hermandad de San Benito',
  '2026-08-17'
),
(
  'b01795a9-e82d-4b09-8086-808623110b3c',
  'Hijos de la Encarnación · distribución digital',
  'https://www.tiendadiscograficapasarela.com/p11147360-hijos-de-la-encarcnacion-solo-en-streaming.html',
  'Distribuidora discográfica',
  'Pasarela',
  '2026-08-17'
)
on conflict (id) do update set
  name = excluded.name,
  url = excluded.url,
  source_type = excluded.source_type,
  author_or_publisher = excluded.author_or_publisher,
  accessed_at = excluded.accessed_at;

-- -----------------------------------------------------------------------------
-- HIJOS DE LA ENCARNACIÓN
-- -----------------------------------------------------------------------------

insert into public.band_releases (
  id,
  band_entity_id,
  title,
  release_type,
  release_year,
  release_date,
  release_date_text,
  ordinal_number,
  description,
  spotify_url,
  external_url,
  status
) values (
  'fe26ee48-1366-48f8-b160-59be2695b46f',
  'cb04a5d8-e81e-4405-a001-9d5a60840924',
  'Hijos de la Encarnación',
  'album',
  2023,
  '2023-12-30',
  '30 de diciembre de 2023 · distribución digital en 2024',
  9,
  'Noveno trabajo discográfico de la Agrupación Musical Nuestra Señora de la Encarnación, publicado ocho años después de su anterior disco. La Hermandad sitúa su salida el 30 de diciembre de 2023; las plataformas digitales lo catalogan como edición de 2024.',
  'https://open.spotify.com/intl-es/album/4HZsFQcxCZbYmAKdpyjopI',
  'https://hermandaddesanbenito.net/cddvd/',
  'published'
)
on conflict (id) do update set
  title = excluded.title,
  release_type = excluded.release_type,
  release_year = excluded.release_year,
  release_date = excluded.release_date,
  release_date_text = excluded.release_date_text,
  ordinal_number = excluded.ordinal_number,
  description = excluded.description,
  spotify_url = excluded.spotify_url,
  external_url = excluded.external_url,
  status = excluded.status;

insert into public.band_release_tracks (
  id, release_id, sequence_no, title, march_entity_id
) values
('4f11e928-bfb4-43af-b795-fea2cb168e2f', 'fe26ee48-1366-48f8-b160-59be2695b46f', 1, 'Hijos de la Encarnación', null),
('99caddb8-f7bb-4937-ad4e-6d651425583d', 'fe26ee48-1366-48f8-b160-59be2695b46f', 2, 'Mi ángel Nazareth', null),
('30bc5cc9-0be5-48c4-87ce-1d1a8b7f9c01', 'fe26ee48-1366-48f8-b160-59be2695b46f', 3, 'En tu victoria nuestra fe', null),
('a79a1641-5c1d-4b7e-b056-224a098b4f3f', 'fe26ee48-1366-48f8-b160-59be2695b46f', 4, 'El Nazareno', null),
('89341b2e-fbbf-4414-adc2-118a000a127c', 'fe26ee48-1366-48f8-b160-59be2695b46f', 5, 'Encarnación de plata', null),
('ed69faac-8958-4dad-8c5c-a27c19d583c0', 'fe26ee48-1366-48f8-b160-59be2695b46f', 6, 'Paz y Victoria', null),
('7313028b-fe2a-49dc-9786-59c0404b7d54', 'fe26ee48-1366-48f8-b160-59be2695b46f', 7, 'Costalero de Nazaret', null),
('a4b2ddcf-6261-4ac8-a94e-48a2d74af41a', 'fe26ee48-1366-48f8-b160-59be2695b46f', 8, 'Cautivo', null),
('5fde53b5-f077-48e5-8405-db98e6a5c392', 'fe26ee48-1366-48f8-b160-59be2695b46f', 9, 'El redentor de Nazaret', null),
('b47444d9-5b12-4b7e-a3b5-5e6f931c278e', 'fe26ee48-1366-48f8-b160-59be2695b46f', 10, 'Eterno pregonero', null),
('3fcf0af1-f9b3-44fc-8461-181e93abc63a', 'fe26ee48-1366-48f8-b160-59be2695b46f', 11, 'El prendimiento de un barrio', null),
('f87af864-1d6b-45ec-81fb-938faeb0ce58', 'fe26ee48-1366-48f8-b160-59be2695b46f', 12, 'La elección', null),
('e27c7a5e-e702-4b7f-8129-281ea0d54301', 'fe26ee48-1366-48f8-b160-59be2695b46f', 13, 'Alma', null)
on conflict (id) do update set
  sequence_no = excluded.sequence_no,
  title = excluded.title,
  march_entity_id = excluded.march_entity_id;

insert into public.band_release_sources (release_id, source_id, scope) values
(
  'fe26ee48-1366-48f8-b160-59be2695b46f',
  'e9bbf639-dc91-4438-9264-f80c7017f0c2',
  'Ordinal del disco, fecha de salida, repertorio y autorías documentadas'
),
(
  'fe26ee48-1366-48f8-b160-59be2695b46f',
  'b01795a9-e82d-4b09-8086-808623110b3c',
  'Disponibilidad en streaming y enlace oficial de Spotify'
)
on conflict (release_id, source_id) do update set
  scope = excluded.scope;
