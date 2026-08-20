-- Hilo Cofrade · Discografía completa de Las Cigarreras
--
-- Completa el catálogo histórico y digital, sustituye carátulas genéricas por
-- portadas oficiales de las plataformas y carga las pistas de los trabajos que
-- estaban vacíos o incompletos. Las fechas históricas distinguen la edición
-- original de las reediciones digitales posteriores.

do $$
declare
  band_id uuid;
begin
  select id
    into band_id
  from public.entities
  where slug = 'las-cigarreras'
    and entity_type = 'band';

  if band_id is null then
    raise exception 'No existe la Banda de Las Cigarreras';
  end if;

  -- Normaliza el título sin crear un segundo registro para la misma recopilación.
  update public.band_releases
  set title = 'Las Cigarreras - El legado', updated_at = now()
  where band_entity_id = band_id
    and title = 'Las Cigarreras- El legado'
    and release_year = 2008;
end
$$;

create temporary table _hc_cigarreras_releases (
  title text not null,
  release_type text not null,
  release_year integer not null,
  release_date date,
  release_date_text text,
  ordinal_number integer not null,
  description text,
  cover_image_path text not null,
  cover_image_alt text not null,
  cover_image_credit text,
  spotify_url text,
  external_url text,
  primary key (title, release_year)
) on commit drop;

insert into _hc_cigarreras_releases values
  (
    'Consolación y Lágrimas', 'album', 1982, null, '1982 · edición original', 1,
    'Primera grabación documentada de Las Cigarreras. La edición digital consultada conserva las diez marchas del trabajo original.',
    'https://i.scdn.co/image/ab67616d0000b2738c885f04afdaf552a1a91d3a',
    'Portada de Consolación y Lágrimas de Las Cigarreras', 'Spotify · edición digital',
    'https://open.spotify.com/album/2WDubn38JktNIpuVaVv2A3',
    'https://music.apple.com/es/album/consolaci%C3%B3n-y-l%C3%A1grimas/1576889072'
  ),
  (
    'Misericordia', 'album', 1984, null, '1984 · edición original', 2,
    'Grabación histórica publicada originalmente en 1984 y recuperada posteriormente en plataformas digitales.',
    'https://i.scdn.co/image/ab67616d0000b2738e86f9bf834dbc87cea1a38a',
    'Portada de Misericordia de Las Cigarreras', 'Spotify · edición digital',
    'https://open.spotify.com/album/7uO9RhVcvVSaLKUmnujDlO',
    'https://music.apple.com/es/album/misericordia/1723378033'
  ),
  (
    'Marchas Procesionales', 'album', 1986, '1986-01-15', '15 de enero de 1986', 3,
    'Álbum histórico de once marchas; la reedición digital mantiene íntegro el repertorio de la grabación.',
    'https://i.scdn.co/image/ab67616d0000b2736d87033890f2c09e01fcdf9e',
    'Portada de Marchas Procesionales de Las Cigarreras', 'Spotify · edición digital',
    'https://open.spotify.com/album/2jhzDtM4dI4tvX2cwZwTQC',
    'https://music.apple.com/es/album/marchas-procesionales/1670710817'
  ),
  (
    'X Aniversario', 'album', 1989, null, '1989 · edición original', 4,
    'Trabajo conmemorativo del décimo aniversario de la formación, disponible digitalmente como «10º Aniversario».',
    'https://i.scdn.co/image/ab67616d0000b2739d67a89fae682706d7e597fb',
    'Portada de X Aniversario de Las Cigarreras', 'Spotify · edición digital',
    'https://open.spotify.com/album/1oX5Jfa7XpPX3Rgk2eYg0c',
    'https://music.apple.com/es/album/10%C2%BA-aniversario/1574954827'
  ),
  (
    'Sentimiento', 'album', 1992, '1992-12-15', '15 de diciembre de 1992', 5,
    'Trabajo discográfico de ocho marchas perteneciente a la primera etapa creativa de Las Cigarreras.',
    'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/d1/1a/e7/d11ae742-b496-60ff-cac3-f23a899eae72/5059654672069_cover.jpg/1200x1200bb.jpg',
    'Portada de Sentimiento de Las Cigarreras', 'Apple Music', null,
    'https://music.apple.com/es/album/sentimiento/1538954136'
  ),
  (
    'Pasión y Música', 'album', 1994, '1994-11-15', '15 de noviembre de 1994', 6,
    'Álbum nacido tras la gira de la banda por Estados Unidos y Canadá, con nueve composiciones de su repertorio histórico.',
    'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/3c/c7/97/3cc797ee-73c6-ab73-b8e9-fc46e345bd28/5063642716864_cover.jpg/1200x1200bb.jpg',
    'Portada de Pasión y Música de Las Cigarreras', 'Apple Music', null,
    'https://music.apple.com/es/album/pasi%C3%B3n-y-m%C3%BAsica/1792289930'
  ),
  (
    '...a Sevilla', 'album', 1996, '1996-01-01', '1 de enero de 1996', 7,
    'Trabajo de estudio dedicado a Sevilla que reúne diez marchas de la formación.',
    'https://i.scdn.co/image/ab67616d0000b2738147e6f0ab6be1d829f7ed7f',
    'Portada de ...a Sevilla de Las Cigarreras', 'Spotify',
    'https://open.spotify.com/album/68lynROEn6IPXeerOzP1SQ', null
  ),
  (
    'XX Aniversario', 'album', 1998, '1998-01-01', '1998', 8,
    'Álbum conmemorativo del vigésimo aniversario de Las Cigarreras con dieciocho marchas.',
    'https://i.scdn.co/image/ab67616d0000b27335fd5048e2dce9b750e5bf92',
    'Portada de XX Aniversario de Las Cigarreras', 'Spotify',
    'https://open.spotify.com/album/2VYlXfYizXK9LHwhzn08Pv', null
  ),
  (
    'Madre Cigarrera', 'album', 2001, '2001-12-15', '15 de diciembre de 2001', 9,
    'Trabajo discográfico de diez marchas publicado por Las Cigarreras en 2001.',
    'https://i.scdn.co/image/ab67616d0000b2738ff82f0b2e801519783c9b33',
    'Portada de Madre Cigarrera de Las Cigarreras', 'Spotify',
    'https://open.spotify.com/album/1QjhQkGBHJwOM5NurkiVBm',
    'https://lascigarreras.net/producto/disco-madre-cigarrera/'
  ),
  (
    '25 Aniversario', 'live', 2004, '2004-02-28', '28 de febrero de 2004', 10,
    'Grabación conmemorativa del vigesimoquinto aniversario de Las Cigarreras.',
    'https://i.scdn.co/image/ab67616d0000b273e1bef6a4d180c36990317c68',
    'Portada de 25 Aniversario de Las Cigarreras', 'Spotify',
    'https://open.spotify.com/album/0N0tN3fEB1Gj56mYYiACid', null
  ),
  (
    'Armonía', 'album', 2007, '2007-01-01', '1 de enero de 2007', 11,
    'Trabajo de estudio de Las Cigarreras publicado en 2007 con diez composiciones.',
    'https://i.scdn.co/image/ab67616d0000b273ad90f30dad40c077a22da85f',
    'Portada de Armonía de Las Cigarreras', 'Spotify',
    'https://open.spotify.com/album/35GZQU5Y6cimSqXfWsEFkD', null
  ),
  (
    'Las Cigarreras - El legado', 'compilation', 2008, '2008-07-15', '15 de julio de 2008', 12,
    'Recopilación digital de catorce grabaciones históricas de Las Cigarreras.',
    'https://i.scdn.co/image/ab67616d0000b2736dbed67a27207cbf2c84422f',
    'Portada de Las Cigarreras - El legado', 'Spotify',
    'https://open.spotify.com/album/0zwT5PNZ0nK1vKGQiYtTVk', null
  ),
  (
    'Homenaje de la música de Las Cigarreras a su Hermandad', 'compilation', 2013, '2013-09-15', '15 de septiembre de 2013', 13,
    'Trabajo colectivo de las tres formaciones musicales vinculadas a la Hermandad de Las Cigarreras por su 450.º aniversario.',
    'https://i.scdn.co/image/ab67616d0000b273beac23ada97a00d68fa9c307',
    'Portada de Homenaje de la música de Las Cigarreras a su Hermandad', 'Spotify',
    'https://open.spotify.com/album/6jJ8sOxBwOmP3hOre0njEh',
    'https://lascigarreras.net/a-la-venta-disco-450-aniversario/'
  ),
  (
    'En mis recuerdos...', 'album', 2018, '2018-12-21', '21 de diciembre de 2018', 14,
    'Trabajo publicado con motivo de los cuarenta años de la formación y compuesto por once marchas.',
    'https://i.scdn.co/image/ab67616d0000b27311dc69ced8048986f071340e',
    'Portada de En mis recuerdos... de Las Cigarreras', 'Spotify',
    'https://open.spotify.com/album/5jvvZTRKeiSJDVTiXLNzT3',
    'https://lascigarreras.net/producto/disco-en-mis-recuerdos/'
  ),
  (
    'Llena eres de música (Live)', 'live', 2021, '2021-03-24', '24 de marzo de 2021', 15,
    'Doble álbum en directo con el concierto íntegro del 40.º aniversario celebrado en el Teatro Romano de Itálica.',
    'https://i.scdn.co/image/ab67616d0000b273d089efa32f3f43fa7fc7be5f',
    'Portada de Llena eres de música de Las Cigarreras', 'Spotify',
    'https://open.spotify.com/album/0jBIQc4JorV8KlIv4S5lQc',
    'https://lascigarreras.net/llena-eres-de-musica-nuevo-trabajo-discografico-de-las-cigarreras/'
  ),
  (
    'Cuaresma 2024... Suena Cigarreras', 'live', 2024, '2024-03-22', '22 de marzo de 2024', 16,
    'Selección en directo de los conciertos ofrecidos por Las Cigarreras durante la Cuaresma de 2024.',
    'https://i.scdn.co/image/ab67616d0000b27376ae81ba78d2adf76296a2c8',
    'Portada de Cuaresma 2024... Suena Cigarreras', 'Spotify',
    'https://open.spotify.com/album/6WnxKX0y3uSpKHS8UgBBFK', null
  ),
  (
    'Galardón Madre Cigarrera 2024', 'live', 2024, '2024-12-25', '25 de diciembre de 2024', 17,
    'Grabación en directo del concierto del Galardón Madre Cigarrera dedicado en 2024 a la Hermandad de San Gonzalo.',
    'https://i.scdn.co/image/ab67616d0000b273f70dcdbed2e1df89df604e60',
    'Portada de Galardón Madre Cigarrera 2024', 'Spotify',
    'https://open.spotify.com/album/6iL5tB1XvVSYR259CkpmUO',
    'https://lascigarreras.net/madre-cigarrera-2024/'
  ),
  (
    'Cuaresma 2025... Suena Cigarreras', 'live', 2025, '2025-03-14', '14 de marzo de 2025', 18,
    'Selección en directo de los conciertos ofrecidos por Las Cigarreras durante la Cuaresma de 2025.',
    'https://i.scdn.co/image/ab67616d0000b273f697d9154d79a70be9ce7a50',
    'Portada de Cuaresma 2025... Suena Cigarreras', 'Spotify',
    'https://open.spotify.com/album/0tbw1E8iiSEblaR94wu1TO', null
  ),
  (
    'Cuaresma 2026... Suena Cigarreras', 'live', 2026, '2026-03-06', '6 de marzo de 2026', 19,
    'Selección en directo de veintiuna composiciones interpretadas por Las Cigarreras durante la Cuaresma de 2026.',
    'https://i.scdn.co/image/ab67616d0000b27362c2d5043794d3a84c7505af',
    'Portada de Cuaresma 2026... Suena Cigarreras', 'Spotify',
    'https://open.spotify.com/album/2GE9MalYbgWd40gTBGl261', null
  );

insert into public.band_releases (
  band_entity_id,
  title,
  release_type,
  release_year,
  release_date,
  release_date_text,
  ordinal_number,
  description,
  cover_image_path,
  cover_image_alt,
  cover_image_credit,
  spotify_url,
  external_url,
  status
)
select
  band.id,
  desired.title,
  desired.release_type,
  desired.release_year,
  desired.release_date,
  desired.release_date_text,
  desired.ordinal_number,
  desired.description,
  desired.cover_image_path,
  desired.cover_image_alt,
  desired.cover_image_credit,
  desired.spotify_url,
  desired.external_url,
  'published'
from _hc_cigarreras_releases desired
join public.entities band
  on band.slug = 'las-cigarreras'
 and band.entity_type = 'band'
on conflict (band_entity_id, title, release_year) do update
set
  release_type = excluded.release_type,
  release_date = excluded.release_date,
  release_date_text = excluded.release_date_text,
  ordinal_number = excluded.ordinal_number,
  description = excluded.description,
  cover_image_path = excluded.cover_image_path,
  cover_image_alt = excluded.cover_image_alt,
  cover_image_credit = excluded.cover_image_credit,
  spotify_url = excluded.spotify_url,
  external_url = excluded.external_url,
  status = 'published',
  updated_at = now();

create temporary table _hc_cigarreras_tracks (
  release_title text not null,
  release_year integer not null,
  sequence_no integer not null,
  title text not null,
  duration_text text,
  spotify_track_id text,
  primary key (release_title, release_year, sequence_no)
) on commit drop;

insert into _hc_cigarreras_tracks values
  -- Consolación y Lágrimas · 1982
  ('Consolación y Lágrimas', 1982, 1, 'Virgen de la Paloma', '3:01', '6m247IvIrh4cFaeuMKBJ3E'),
  ('Consolación y Lágrimas', 1982, 2, 'Pobre Zaragoza', '3:12', '1w0BV132DmSxQUjKiznaPf'),
  ('Consolación y Lágrimas', 1982, 3, 'Consolación y Lágrimas', '3:13', '6H5i7PSWMjMnEAofoC0VKJ'),
  ('Consolación y Lágrimas', 1982, 4, 'Virgen de los Dolores', '3:05', '7krth5weApVG2AcYJKl2e5'),
  ('Consolación y Lágrimas', 1982, 5, 'Jesús el Rico', '3:03', '4VIwKamzfuNa8PoozUQxjx'),
  ('Consolación y Lágrimas', 1982, 6, 'Cachorro', '2:48', '5dd5DvhOP9gNhErHLMjgnZ'),
  ('Consolación y Lágrimas', 1982, 7, 'Evocación', '3:31', '2ce2ps4WCGSGxVVE8f5EiX'),
  ('Consolación y Lágrimas', 1982, 8, 'Cristo del Amor', '3:02', '0GlBdV9vyYsHe60bxAZ7z9'),
  ('Consolación y Lágrimas', 1982, 9, 'Milagrosa', '2:53', '4qhX3kBm5XwCoQpgOkhrMd'),
  ('Consolación y Lágrimas', 1982, 10, 'Cristo de la Sangre', '3:01', '6FVkaLvagneWWUmsJZYaGU'),

  -- Misericordia · 1984
  ('Misericordia', 1984, 1, 'Soledad de San Pablo', '3:31', '6tmr2Pf4FkXPTFB8a3z9BB'),
  ('Misericordia', 1984, 2, 'La Lanzada', '3:17', '2Xf3gPq5J6sA2X9Z1PQpMC'),
  ('Misericordia', 1984, 3, 'Virgen de la Paz', '3:06', '3OI0XwnXwwyGttzMJolW33'),
  ('Misericordia', 1984, 4, 'Virgen del Mayor Dolor', '3:39', '1u4A87U2OYHZfN8wjOu6ba'),
  ('Misericordia', 1984, 5, 'La Virgen llora', '3:02', '4OgaiGmQVFSZXl7hFPnYd7'),
  ('Misericordia', 1984, 6, 'Virgen de la Victoria', '3:22', '5HunplBXyDFNpLOWvFhJco'),
  ('Misericordia', 1984, 7, 'Virgen de la Salud', '3:11', '6wv0fua1lFkiGQp2epwTzN'),
  ('Misericordia', 1984, 8, 'Cristo del Humilladero', '3:07', '5cOUY70SGaRrAW1MJjFFRz'),
  ('Misericordia', 1984, 9, 'Soleá', '1:58', '682YL6copiqJfE5P8yljTz'),
  ('Misericordia', 1984, 10, 'Misericordia', '2:15', '2OpAKjGS0V3ZGsvIGXMgVX'),
  ('Misericordia', 1984, 11, 'El Cristo Viejo', '1:59', '21ESz6QbKzNkzfEjtg800A'),

  -- Marchas Procesionales · 1986
  ('Marchas Procesionales', 1986, 1, 'Réquiem', '2:46', '72pc7qSitOYqMNUA2wQ57d'),
  ('Marchas Procesionales', 1986, 2, 'Santísimo Cristo de las Tres Caídas', '3:46', '6oEdVSNRI3lVAip5o1fTQr'),
  ('Marchas Procesionales', 1986, 3, 'Cristo del Perdón', '3:59', '7kPbLbD9oCwdfnMo0ImBmJ'),
  ('Marchas Procesionales', 1986, 4, 'Jesús ante Anás', '3:30', '3bpeSiHkoVe8YtlzYL6juS'),
  ('Marchas Procesionales', 1986, 5, 'Nuestro Padre Jesús Cautivo', '3:15', '29LBJN8rDlon8zNzHzTPvJ'),
  ('Marchas Procesionales', 1986, 6, 'La Dolorosa', '2:10', '7B4LzFfpIy8D8Qcr5ivOnt'),
  ('Marchas Procesionales', 1986, 7, 'Nuestra Señora de Guaditoca', '4:17', '0FyjqXpPsbBn9wrDdZ7cqI'),
  ('Marchas Procesionales', 1986, 8, 'Nuestro Padre Jesús del Gran Poder', '4:50', '6TOnybxA8zfRLqgMVnQ85D'),
  ('Marchas Procesionales', 1986, 9, 'El Greñúo', '3:43', '6y657b16768TJEYmIFoeRx'),
  ('Marchas Procesionales', 1986, 10, 'La Expiración', '3:13', '776HuH2XEuSXp8cFFpupZw'),
  ('Marchas Procesionales', 1986, 11, 'Camino del Calvario', '3:39', '3kpaUPQr6pdXtajyqltYDm'),

  -- X Aniversario · 1989
  ('X Aniversario', 1989, 1, '¡Y Tú, Estrella!', '4:41', '29N97Vc6s6V74mYJj5rbYQ'),
  ('X Aniversario', 1989, 2, 'Misericordia Isleña', '4:25', '717KT2GeN57x4aTnGULQU7'),
  ('X Aniversario', 1989, 3, 'Cristo de las Siete Palabras', '3:26', '6AALTp7Utrw5ZNNZNC91ff'),
  ('X Aniversario', 1989, 4, 'Rocío', '4:49', '4yN7lsRllV3nVa60RLORsF'),
  ('X Aniversario', 1989, 5, 'Cristo de la Humildad', '3:09', '3LToZWcVXRvhkWJDiIkYo2'),
  ('X Aniversario', 1989, 6, 'Corona de Espinas', '4:41', '2WnoPoeZICXBSa50N7344o'),
  ('X Aniversario', 1989, 7, 'El Prendimiento', '3:53', '3Ujb92wfe2LPGmeivI9hGI'),
  ('X Aniversario', 1989, 8, 'Virgen de los Remedios', '4:31', '4JbHTEWcoIuNvtSp4s4Ymk'),
  ('X Aniversario', 1989, 9, 'Nuestro Padre Jesús Cautivo', '3:59', '2ApNd0t9G5SdnD9FIYnBEx'),
  ('X Aniversario', 1989, 10, 'Sentencia de Cristo', '3:11', '2WGt14NeO9Yny7yYxLB1fj'),

  -- Sentimiento · 1992
  ('Sentimiento', 1992, 1, 'Réquiem', '2:45', null),
  ('Sentimiento', 1992, 2, 'Amor de Madre', '4:20', null),
  ('Sentimiento', 1992, 3, 'Macarena', '5:14', null),
  ('Sentimiento', 1992, 4, 'Ego Sum', '4:55', null),
  ('Sentimiento', 1992, 5, 'Azotes', '5:21', null),
  ('Sentimiento', 1992, 6, 'Entre azahares', '5:52', null),
  ('Sentimiento', 1992, 7, 'Resignación', '4:46', null),
  ('Sentimiento', 1992, 8, 'Mi Cristo de recogía', '4:35', null),

  -- Pasión y Música · 1994
  ('Pasión y Música', 1994, 1, 'Señor de Sevilla', '3:53', null),
  ('Pasión y Música', 1994, 2, 'Maestro', '3:25', null),
  ('Pasión y Música', 1994, 3, 'Esa espina de tu cara', '3:20', null),
  ('Pasión y Música', 1994, 4, 'Eucaristía', '3:20', null),
  ('Pasión y Música', 1994, 5, 'Pasión, Muerte y Resurrección', '3:33', null),
  ('Pasión y Música', 1994, 6, 'La Cruz Gitana', '2:59', null),
  ('Pasión y Música', 1994, 7, 'Bendícenos Jesús', '3:31', null),
  ('Pasión y Música', 1994, 8, 'Oración de Gloria', '3:01', null),
  ('Pasión y Música', 1994, 9, 'Amazing Grace', '2:27', null),

  -- ...a Sevilla · 1996
  ('...a Sevilla', 1996, 1, 'Refúgiame', '3:42', '5TgV4jc56g69thiGhyfpzN'),
  ('...a Sevilla', 1996, 2, 'Padre Manuel', '3:56', '4x3dZNYyEepbcMFUbskaIB'),
  ('...a Sevilla', 1996, 3, 'Mi Cristo para Sevilla', '4:26', '0kaBCvfBdrJsgZjh9sMSbs'),
  ('...a Sevilla', 1996, 4, 'Stella Maris', '4:07', '3zjas7G9dum6OvhTRbiyCE'),
  ('...a Sevilla', 1996, 5, 'Madrugá Sevillana', '4:28', '3Yy0TSuockHUPxMz5kXOxh'),
  ('...a Sevilla', 1996, 6, 'Divina Pastora de Cantillana', '3:53', '1trzNBXaQDK7c3iyRPTs9f'),
  ('...a Sevilla', 1996, 7, 'Triana llora tus Penas', '4:03', '5g9NrOec21ZQHzduv4SBkh'),
  ('...a Sevilla', 1996, 8, 'Un cielo para mi Virgen', '4:28', '5B0z6J5rQTut3KptZfLaTM'),
  ('...a Sevilla', 1996, 9, 'Dulce Nombre de María', '3:39', '5wVCTiGA1IsQK6PvSPUFHu'),
  ('...a Sevilla', 1996, 10, 'Al pie de tu Santa Cruz', '4:08', '1yVHJQou2rIc6C26sf0VXQ'),

  -- 25 Aniversario · 2004
  ('25 Aniversario', 2004, 1, 'El Santísimo Cristo del Amor', '3:37', '1cnJ2gkNWRHlmKyqBUVLFc'),
  ('25 Aniversario', 2004, 2, 'La Expiración', '3:41', '0Xwf7ZuAnOQo73kH2u1wF7'),
  ('25 Aniversario', 2004, 3, 'La Virgen llora', '3:54', '1QY2YTBK7TguvJXzCUL4VO'),
  ('25 Aniversario', 2004, 4, 'Soledad de San Pablo', '3:38', '0oP6QBTY35ZHKGFEXMXHmS'),
  ('25 Aniversario', 2004, 5, 'Maestro', '4:31', '3w4T8Qggg279IE65gAwevo'),
  ('25 Aniversario', 2004, 6, 'Corazón de Jesús', '4:20', '797A7eCmqxpyTUYR3YY69G'),
  ('25 Aniversario', 2004, 7, 'Tus Lágrimas', '4:31', '4jaxt8WpF8sbM6KPz3D9iw'),
  ('25 Aniversario', 2004, 8, 'Costalero del Soberano', '4:46', '11w871ziLhgVsadyNgc9o7'),
  ('25 Aniversario', 2004, 9, 'Amor de Madre', '3:52', '38apPhIazQyFas6ZVjqhyn'),

  -- Homenaje de la música de Las Cigarreras a su Hermandad · 2013
  ('Homenaje de la música de Las Cigarreras a su Hermandad', 2013, 1, 'Virgen de la Victoria', '3:25', '0mvry1wkQfRK7uz5Vj1gpx'),
  ('Homenaje de la música de Las Cigarreras a su Hermandad', 2013, 2, 'Amor de Madre', '2:46', '3DFChe8dcRUe6oHc6Nx3QS'),
  ('Homenaje de la música de Las Cigarreras a su Hermandad', 2013, 3, 'La Victoria de la Fe', '4:36', '0tRmPVeSSA15vuB9Qzw2Ht'),
  ('Homenaje de la música de Las Cigarreras a su Hermandad', 2013, 4, 'Azotes', '4:17', '7gZhps6aP6ZqnxhdcDNtBr'),
  ('Homenaje de la música de Las Cigarreras a su Hermandad', 2013, 5, 'Madre de la Victoria', '2:58', '4M3iHMJsRgmGccoiSmBVLa'),
  ('Homenaje de la música de Las Cigarreras a su Hermandad', 2013, 6, 'Subida al Calvario', '6:15', '5X7MOcouSH3BcvgJrKhVEc'),
  ('Homenaje de la música de Las Cigarreras a su Hermandad', 2013, 7, 'Columna y Azotes de Nuestro Señor', '4:03', '5itPriGHACSbVumvBGtvUA'),
  ('Homenaje de la música de Las Cigarreras a su Hermandad', 2013, 8, 'La Saeta', '4:23', '4ag2lbmgEEEfMdNLDdo8Bt'),
  ('Homenaje de la música de Las Cigarreras a su Hermandad', 2013, 9, 'Sagrada Victoria', '4:59', '0WoxQZP0rdzP36u50QXB07'),
  ('Homenaje de la música de Las Cigarreras a su Hermandad', 2013, 10, 'Y fue azotado', '3:38', '5GD4YNRPqa1AgEuJhLFrEO'),
  ('Homenaje de la música de Las Cigarreras a su Hermandad', 2013, 11, 'Salve a Nuestra Señora de la Victoria', '3:26', '3YAez9wwL8nxbHXc6GwQBI'),

  -- Llena eres de música · 2021
  ('Llena eres de música (Live)', 2021, 1, 'Amor de Madre - Live', '2:58', '3j1JUjH7kiukAO38wwOnQV'),
  ('Llena eres de música (Live)', 2021, 2, 'Cigarreros por la Gracia de Dios - Live', '2:27', '4EIDrxlA3WWzFwlibjmBJX'),
  ('Llena eres de música (Live)', 2021, 3, 'Ante Pilatos... El Hijo de Dios - Live', '3:25', '7kWw5KYjoLpVYM7C2hlQW0'),
  ('Llena eres de música (Live)', 2021, 4, 'Parade of the charioteers - Live', '2:58', '7EYbvLqanCpjb4eRkI14A0'),
  ('Llena eres de música (Live)', 2021, 5, 'Ave María - Live', '2:33', '6mKK1x2ud6PHipqzEiNkXJ'),
  ('Llena eres de música (Live)', 2021, 6, 'Las olas del Danubio - Live', '2:49', '4QpvRoAHj055Gen5ZoeaBT'),
  ('Llena eres de música (Live)', 2021, 7, 'Gonna fly now - Live', '2:57', '0I5pf6lpQEaGdFXScG4x6z'),
  ('Llena eres de música (Live)', 2021, 8, 'The Throne Room - Live', '3:06', '0VgQpw2rNzcZO8FxcGeEvL'),
  ('Llena eres de música (Live)', 2021, 9, 'Noches de Adra - Live', '2:32', '5Nx8cpgkW7ovdwjxoud8cO'),
  ('Llena eres de música (Live)', 2021, 10, 'Jackson Eternal - Live', '4:02', '05lUxiajFLHnS6k4S0hbWo'),
  ('Llena eres de música (Live)', 2021, 11, 'Al compás de las sevillanas - Live', '5:07', '0pbCdue2yrMMoSPNPTfiHo'),
  ('Llena eres de música (Live)', 2021, 12, 'El fandango cigarrero - Live', '2:21', '1efo2XfLcl6lBVOEQCDy8n'),
  ('Llena eres de música (Live)', 2021, 13, 'Salve de la Misa del Alba - Live', '3:50', '4KqYNKHRotDm8L9XxN7FfT'),
  ('Llena eres de música (Live)', 2021, 14, 'Y dijo Anás... - Live', '4:24', '2cBxiiCOBSv9IhVPfwUAe6'),
  ('Llena eres de música (Live)', 2021, 15, 'En mis recuerdos... - Live', '4:42', '1OZZ3loH9SK71v0LOc7hN6'),
  ('Llena eres de música (Live)', 2021, 16, 'Silencio ante Herodes... El Hijo de Dios - Live', '3:37', '6djnmqlKSmsUwiXvL7o52h'),
  ('Llena eres de música (Live)', 2021, 17, 'Noches de Lunes Santo - Live', '4:08', '6boWeWM16I9yRlj2IBWxWq'),
  ('Llena eres de música (Live)', 2021, 18, 'Inspiración - Live', '3:42', '0k6Q7BvW6yzIAIiUIoxqVf'),
  ('Llena eres de música (Live)', 2021, 19, 'Los costaleros - Live', '1:12', '1FrmeXAH1VjxMDp1PDCz6y'),
  ('Llena eres de música (Live)', 2021, 20, 'Costalero del Soberano - Live', '3:38', '5X1ygpvXydEWxqkFEqGK7A'),
  ('Llena eres de música (Live)', 2021, 21, 'Himno de Andalucía - Live', '1:25', '1Nc3lD4NhC87UILPE0GEYj'),
  ('Llena eres de música (Live)', 2021, 22, 'Marcha Real - Live', '2:16', '3MnoCiVKsJbVjPOfEUCeew'),

  -- Cuaresma 2024... Suena Cigarreras
  ('Cuaresma 2024... Suena Cigarreras', 2024, 1, 'La Cruz Gitana - Los Gitanos 2024', '2:59', '6xTOlCtgZmvgTOROsVlxcM'),
  ('Cuaresma 2024... Suena Cigarreras', 2024, 2, 'Divina Pastora de Cantillana - Los Gitanos 2024', '3:11', '0dkG9kRGPuqvYtj9alewzO'),
  ('Cuaresma 2024... Suena Cigarreras', 2024, 3, 'Sobre los pies te lleva Sevilla - Los Gitanos 2024', '3:25', '74RsUCmmA1HUX7iK3TTC2l'),
  ('Cuaresma 2024... Suena Cigarreras', 2024, 4, 'Inspiración - Los Gitanos 2024', '3:38', '1rG7INwnFQq3VE4Zs5pddc'),
  ('Cuaresma 2024... Suena Cigarreras', 2024, 5, 'Y en la otra orilla... - Los Gitanos 2024', '3:19', '6MZmS8ilCn2LOaFa4lyqRA'),
  ('Cuaresma 2024... Suena Cigarreras', 2024, 6, 'En mis recuerdos... - Los Gitanos 2024', '4:39', '4JLow55Q4OkdxDVtXW9Hyq'),
  ('Cuaresma 2024... Suena Cigarreras', 2024, 7, 'Pasión, Muerte y Resurrección - Los Estudiantes 2024', '3:29', '42vJhuRMKgzcoxqln97YJS'),
  ('Cuaresma 2024... Suena Cigarreras', 2024, 8, 'Ave María - Los Estudiantes 2024', '2:22', '68pVreDZ1LBOriA65lqj5k'),
  ('Cuaresma 2024... Suena Cigarreras', 2024, 9, 'Madre de Dios - Los Estudiantes 2024', '3:13', '4872Cvscnjse6nhI76Uo24'),
  ('Cuaresma 2024... Suena Cigarreras', 2024, 10, 'Cordis Mariae - Los Estudiantes 2024', '3:26', '6PJaFm77uWuh9KVVly3dxe'),
  ('Cuaresma 2024... Suena Cigarreras', 2024, 11, 'En tu Buena Muerte - Los Estudiantes 2024', '3:34', '1m0WxiZrZXaGfULoNml06z'),
  ('Cuaresma 2024... Suena Cigarreras', 2024, 12, 'Réquiem - Los Estudiantes 2024', '3:13', '6wrBCmSG3rl2XK41wufCW9'),
  ('Cuaresma 2024... Suena Cigarreras', 2024, 13, 'El Santísimo Cristo del Amor - Santiago 2024', '3:18', '1TefhkrlbP5MftHvSO6EDX'),
  ('Cuaresma 2024... Suena Cigarreras', 2024, 14, 'Nuestra Señora de Consolación y Lágrimas - Santiago 2024', '3:45', '58pD9NGq7FO4jEkSsZVuFA'),
  ('Cuaresma 2024... Suena Cigarreras', 2024, 15, 'Virgen de la Victoria - Santiago 2024', '3:20', '3aMxRScujto8XCUf4QW2tf'),
  ('Cuaresma 2024... Suena Cigarreras', 2024, 16, 'Refúgiame - Santiago 2024', '3:27', '0JUlMzm1DGKcukNuCxSQzo'),
  ('Cuaresma 2024... Suena Cigarreras', 2024, 17, 'María, Reina y Madre - Santiago 2024', '3:43', '2QDQNqQITtBQBdTBREetD7'),
  ('Cuaresma 2024... Suena Cigarreras', 2024, 18, 'Agnus Dei - Santiago 2024', '3:06', '1McB3zUkKZAeW8WCx2lhui'),
  ('Cuaresma 2024... Suena Cigarreras', 2024, 19, 'Ante Caifás... El Hijo de Dios - Santiago 2024', '3:46', '5UCUqoDJAG39V6PKhc1lfn'),
  ('Cuaresma 2024... Suena Cigarreras', 2024, 20, 'Gath Shemânîm - Santiago 2024', '3:07', '5crEQo7tyafTurNvUSMjzb'),
  ('Cuaresma 2024... Suena Cigarreras', 2024, 21, 'Agnus Dei, Marcha Real y Cantemos al Amor de los Amores - Santiago 2024', '6:35', '4Bh9dVYU6RVkVub3Druyp8'),

  -- Galardón Madre Cigarrera 2024
  ('Galardón Madre Cigarrera 2024', 2024, 1, 'Cristo del Soberano Poder - San Gonzalo 2024', '2:15', '0qeMifCBd9aBq24wvE4sjh'),
  ('Galardón Madre Cigarrera 2024', 2024, 2, 'Virgen de la Salud - San Gonzalo 2024', '3:04', '4KGDOR2LBHs6wIWca2wE4m'),
  ('Galardón Madre Cigarrera 2024', 2024, 3, 'Ego Sum - San Gonzalo 2024', '3:22', '3rFuCPk20jrpQDu9a2elFf'),
  ('Galardón Madre Cigarrera 2024', 2024, 4, 'Oración de Gloria - San Gonzalo 2024', '3:11', '2AiL8p6xYJk0li86luBnNY'),
  ('Galardón Madre Cigarrera 2024', 2024, 5, 'Un cielo para mi Virgen - San Gonzalo 2024', '3:51', '3otktwraWux7fGv39CldSY'),
  ('Galardón Madre Cigarrera 2024', 2024, 6, 'Yo soy - San Gonzalo 2024', '2:59', '7oRPObuAE3nyLktIHs7uOp'),
  ('Galardón Madre Cigarrera 2024', 2024, 7, 'Marcha Real y Hasta siempre, Soberano - San Gonzalo 2024', '1:53', '7xHVgpmVSqOefg2mrJP8KZ'),

  -- Cuaresma 2026... Suena Cigarreras
  ('Cuaresma 2026... Suena Cigarreras', 2026, 1, 'Jesús ante Anás', '3:16', '10ifgE0hCpep3NWQtaYFHD'),
  ('Cuaresma 2026... Suena Cigarreras', 2026, 2, 'Dulce Nombre de María', '2:54', '2Fsw5rG4fYCvXFSEbClSoh'),
  ('Cuaresma 2026... Suena Cigarreras', 2026, 3, 'Ante Anás... El Hijo de Dios', '3:12', '6TIXNdzXYtdNFYLO8Kzz2Q'),
  ('Cuaresma 2026... Suena Cigarreras', 2026, 4, 'Y dijo Anás...', '4:15', '2fBAxfwx8rS72t0M4xh1wm'),
  ('Cuaresma 2026... Suena Cigarreras', 2026, 5, 'La otra mejilla', '3:36', '0jKKGClAd7lB2KkPjXOS2N'),
  ('Cuaresma 2026... Suena Cigarreras', 2026, 6, 'Refúgiame', '3:29', '3AiS78BkeZfGXIaXKLgnhz'),
  ('Cuaresma 2026... Suena Cigarreras', 2026, 7, 'Tus Lágrimas', '3:40', '5okLf3tYG5OeZfLsvmLdtS'),
  ('Cuaresma 2026... Suena Cigarreras', 2026, 8, 'Cantemos al Amor de los Amores', '2:53', '0dNXNR2c5snHsoD6S8JmgI'),
  ('Cuaresma 2026... Suena Cigarreras', 2026, 9, 'Ánima Christi', '2:37', '1K7gMZADJwpDBWUXtZRq73'),
  ('Cuaresma 2026... Suena Cigarreras', 2026, 10, 'Más cerca, oh Dios, de ti', '2:38', '7swBAsYTThXddDyTN197bu'),
  ('Cuaresma 2026... Suena Cigarreras', 2026, 11, 'Dios Padre, Dios del Amor', '3:27', '0DRUqI1qZaWE9SL602X664'),
  ('Cuaresma 2026... Suena Cigarreras', 2026, 12, 'En tu Buena Muerte', '3:42', '3Xz9LiFXMRklspAAKvBK4h'),
  ('Cuaresma 2026... Suena Cigarreras', 2026, 13, 'Llora la Esperanza', '3:48', '6oECKucJfeWGOcZSN8b2z0'),
  ('Cuaresma 2026... Suena Cigarreras', 2026, 14, 'Sagrado Decreto', '3:51', '5rKxls28NzQ77fg2pev4dh'),
  ('Cuaresma 2026... Suena Cigarreras', 2026, 15, 'Triana llora tus Penas', '3:19', '5vkWnYDEbmDJvR2AcVFAdV'),
  ('Cuaresma 2026... Suena Cigarreras', 2026, 16, 'Misericordia Isleña', '3:52', '09ZWsmwSt8eCNKaeksfsPv'),
  ('Cuaresma 2026... Suena Cigarreras', 2026, 17, 'Eucaristía', '3:28', '3GRXp00vImBXv7YGSl3aXf'),
  ('Cuaresma 2026... Suena Cigarreras', 2026, 18, 'Sobre los pies te lleva Sevilla', '3:26', '0PNxYSFIPh0XSokQg7ULMe'),
  ('Cuaresma 2026... Suena Cigarreras', 2026, 19, 'Yo soy la luz del mundo', '4:10', '7vMn49lQhxx3RRO4b0FSgz'),
  ('Cuaresma 2026... Suena Cigarreras', 2026, 20, 'Sanctae Crucis', '3:26', '3PPC0sv2t9t8eXdhCgMB5t'),
  ('Cuaresma 2026... Suena Cigarreras', 2026, 21, '¡Victoria!', '3:51', '0GIMrnDbVyymH5LZ8mhkle');

-- Los registros incluidos en este catálogo no tenían relaciones de Marcha
-- documentadas, por lo que se reconstruyen sin perder vínculos existentes.
delete from public.band_release_tracks track
using public.band_releases release, public.entities band
where track.release_id = release.id
  and release.band_entity_id = band.id
  and band.slug = 'las-cigarreras'
  and band.entity_type = 'band'
  and exists (
    select 1
    from _hc_cigarreras_tracks desired
    where desired.release_title = release.title
      and desired.release_year = release.release_year
  );

insert into public.band_release_tracks (
  release_id,
  sequence_no,
  title,
  duration_text,
  spotify_url
)
select
  release.id,
  desired.sequence_no,
  desired.title,
  desired.duration_text,
  case
    when desired.spotify_track_id is null then null
    else 'https://open.spotify.com/track/' || desired.spotify_track_id
  end
from _hc_cigarreras_tracks desired
join public.band_releases release
  on release.title = desired.release_title
 and release.release_year = desired.release_year
join public.entities band
  on band.id = release.band_entity_id
 and band.slug = 'las-cigarreras'
 and band.entity_type = 'band'
order by desired.release_year, desired.sequence_no;

-- Fuente primaria de cada edición digital.
insert into public.sources (
  name,
  url,
  source_type,
  author_or_publisher,
  accessed_at,
  notes
)
select
  desired.title || ' · Spotify',
  desired.spotify_url,
  'Plataforma musical',
  'Spotify',
  current_date,
  'Ficha del lanzamiento, portada y orden de pistas.'
from _hc_cigarreras_releases desired
where desired.spotify_url is not null
  and not exists (
    select 1 from public.sources source where source.url = desired.spotify_url
  );

insert into public.sources (
  name,
  url,
  source_type,
  author_or_publisher,
  accessed_at,
  notes
)
select
  desired.title || ' · Apple Music',
  desired.external_url,
  'Plataforma musical',
  'Apple Music',
  current_date,
  'Ficha del lanzamiento, portada, fecha y orden de pistas.'
from _hc_cigarreras_releases desired
where desired.spotify_url is null
  and desired.external_url like 'https://music.apple.com/%'
  and not exists (
    select 1 from public.sources source where source.url = desired.external_url
  );

insert into public.band_release_sources (release_id, source_id, scope)
select
  release.id,
  source.id,
  'Catálogo digital, portada y listado de pistas'
from _hc_cigarreras_releases desired
join public.band_releases release
  on release.title = desired.title
 and release.release_year = desired.release_year
join public.entities band
  on band.id = release.band_entity_id
 and band.slug = 'las-cigarreras'
join public.sources source
  on source.url = coalesce(desired.spotify_url, desired.external_url)
on conflict (release_id, source_id) do update
set scope = excluded.scope;

do $$
declare
  band_id uuid;
  release_count integer;
  rebuilt_track_count integer;
  empty_release_count integer;
  missing_cover_count integer;
begin
  select id into band_id
  from public.entities
  where slug = 'las-cigarreras' and entity_type = 'band';

  select count(*) into release_count
  from public.band_releases
  where band_entity_id = band_id and status = 'published';

  if release_count <> 19 then
    raise exception 'Se esperaban 19 trabajos publicados de Las Cigarreras y se encontraron %', release_count;
  end if;

  select count(*) into rebuilt_track_count
  from public.band_release_tracks track
  join public.band_releases release on release.id = track.release_id
  where release.band_entity_id = band_id
    and exists (
      select 1
      from _hc_cigarreras_tracks desired
      where desired.release_title = release.title
        and desired.release_year = release.release_year
        and desired.sequence_no = track.sequence_no
    );

  if rebuilt_track_count <> 160 then
    raise exception 'Se esperaban 160 pistas reconstruidas y se encontraron %', rebuilt_track_count;
  end if;

  select count(*) into empty_release_count
  from public.band_releases release
  where release.band_entity_id = band_id
    and release.status = 'published'
    and not exists (
      select 1 from public.band_release_tracks track where track.release_id = release.id
    );

  if empty_release_count <> 0 then
    raise exception 'Quedaron % trabajos publicados sin pistas', empty_release_count;
  end if;

  select count(*) into missing_cover_count
  from public.band_releases
  where band_entity_id = band_id
    and status = 'published'
    and cover_image_path is null;

  if missing_cover_count <> 0 then
    raise exception 'Quedaron % trabajos publicados sin portada', missing_cover_count;
  end if;
end
$$;
