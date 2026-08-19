-- Hilo Cofrade · Discografía reciente de la Banda Municipal de La Puebla del Río
--
-- Incorpora los ocho álbumes publicados en el perfil oficial de Spotify entre
-- 2021 y 2026, junto con sus portadas, fechas, pistas y enlaces de escucha.
-- La operación es idempotente: actualiza los álbumes y reconstruye sus pistas.

do $migration$
declare
  band_id uuid;
  release_rows integer;
  track_rows integer;
begin
  select id
    into band_id
  from public.entities
  where slug = 'banda-municipal-de-musica-de-la-puebla-del-rio'
    and entity_type = 'band';

  if band_id is null then
    raise exception 'No existe la Banda Municipal de Música de La Puebla del Río';
  end if;

  insert into public.band_releases (
    band_entity_id, title, release_type, release_year, release_date,
    release_date_text, ordinal_number, description, cover_image_path,
    cover_image_alt, cover_image_credit, spotify_url, status
  )
  select
    band_id, catalog.title, catalog.release_type, catalog.release_year,
    catalog.release_date, catalog.release_date_text, catalog.ordinal_number,
    catalog.description, catalog.cover_image_path, catalog.cover_image_alt,
    catalog.cover_image_credit, catalog.spotify_url, catalog.status
  from (
    values
      ('Así Suena La Puebla, Vol.1', 'album', 2021, '2021-12-24'::date, 'Publicación en Spotify: 24 de diciembre de 2021.', 4, 'Álbum disponible en el perfil oficial de Spotify de BM La Puebla del Río.', '/bandas/la-puebla/discografia/asi-suena-la-puebla-vol-1.jpg', 'Portada del álbum Así Suena La Puebla, Vol.1 de BM La Puebla del Río', 'BM La Puebla del Río · Spotify oficial', 'https://open.spotify.com/album/4CsOW8EiZ4ob0eZRrLSv4n', 'published'),
      ('Así Suena La Puebla, Vol.2', 'album', 2022, '2022-03-02'::date, 'Publicación en Spotify: 2 de marzo de 2022.', 5, 'Álbum disponible en el perfil oficial de Spotify de BM La Puebla del Río.', '/bandas/la-puebla/discografia/asi-suena-la-puebla-vol-2.jpg', 'Portada del álbum Así Suena La Puebla, Vol.2 de BM La Puebla del Río', 'BM La Puebla del Río · Spotify oficial', 'https://open.spotify.com/album/6hBnwEyG9ebkj7m1QRRu7O', 'published'),
      ('Sinfonía Romerista', 'album', 2022, '2022-12-25'::date, 'Publicación en Spotify: 25 de diciembre de 2022.', 6, 'Álbum disponible en el perfil oficial de Spotify de BM La Puebla del Río.', '/bandas/la-puebla/discografia/sinfonia-romerista.jpg', 'Portada del álbum Sinfonía Romerista de BM La Puebla del Río', 'BM La Puebla del Río · Spotify oficial', 'https://open.spotify.com/album/209doVSefZknTH94WZ5gfU', 'published'),
      ('Así Suena La Puebla, Vol.3', 'album', 2023, '2023-03-17'::date, 'Publicación en Spotify: 17 de marzo de 2023.', 7, 'Álbum disponible en el perfil oficial de Spotify de BM La Puebla del Río.', '/bandas/la-puebla/discografia/asi-suena-la-puebla-vol-3.jpg', 'Portada del álbum Así Suena La Puebla, Vol.3 de BM La Puebla del Río', 'BM La Puebla del Río · Spotify oficial', 'https://open.spotify.com/album/2oiPt4P9Y1fBWiqNm7e7Ml', 'published'),
      ('Dominus Exspiratio', 'album', 2024, '2024-02-13'::date, 'Publicación en Spotify: 13 de febrero de 2024.', 8, 'Álbum disponible en el perfil oficial de Spotify de BM La Puebla del Río.', '/bandas/la-puebla/discografia/dominus-exspiratio.jpg', 'Portada del álbum Dominus Exspiratio de BM La Puebla del Río', 'BM La Puebla del Río · Spotify oficial', 'https://open.spotify.com/album/1SNDPaklWo6bLNsenByCcG', 'published'),
      ('Esplendores', 'album', 2025, '2025-03-03'::date, 'Publicación en Spotify: 3 de marzo de 2025.', 9, 'Álbum disponible en el perfil oficial de Spotify de BM La Puebla del Río.', '/bandas/la-puebla/discografia/esplendores.jpg', 'Portada del álbum Esplendores de BM La Puebla del Río', 'BM La Puebla del Río · Spotify oficial', 'https://open.spotify.com/album/1u48qXbDtkbVLk2cCUbNMx', 'published'),
      ('Soberana Encarnación', 'album', 2025, '2025-11-04'::date, 'Publicación en Spotify: 4 de noviembre de 2025.', 10, 'Álbum disponible en el perfil oficial de Spotify de BM La Puebla del Río.', '/bandas/la-puebla/discografia/soberana-encarnacion.jpg', 'Portada del álbum Soberana Encarnación de BM La Puebla del Río', 'BM La Puebla del Río · Spotify oficial', 'https://open.spotify.com/album/0rSDbSiPCq8k5uqvZavHsp', 'published'),
      ('Dominus Desertorum', 'album', 2026, '2026-02-16'::date, 'Publicación en Spotify: 16 de febrero de 2026.', 11, 'Álbum disponible en el perfil oficial de Spotify de BM La Puebla del Río.', '/bandas/la-puebla/discografia/dominus-desertorum.jpg', 'Portada del álbum Dominus Desertorum de BM La Puebla del Río', 'BM La Puebla del Río · Spotify oficial', 'https://open.spotify.com/album/0a05uzjppY2XyqSr9VBssN', 'published')
  ) as catalog(
    title, release_type, release_year, release_date, release_date_text,
    ordinal_number, description, cover_image_path, cover_image_alt,
    cover_image_credit, spotify_url, status
  )
  on conflict (band_entity_id, title, release_year) do update set
    release_type = excluded.release_type,
    release_date = excluded.release_date,
    release_date_text = excluded.release_date_text,
    ordinal_number = excluded.ordinal_number,
    description = excluded.description,
    cover_image_path = excluded.cover_image_path,
    cover_image_alt = excluded.cover_image_alt,
    cover_image_credit = excluded.cover_image_credit,
    spotify_url = excluded.spotify_url,
    status = excluded.status,
    updated_at = now();

  get diagnostics release_rows = row_count;

  if release_rows <> 8 then
    raise exception 'Se esperaban 8 álbumes insertados o actualizados y se procesaron %', release_rows;
  end if;

  delete from public.band_release_tracks as track
  using public.band_releases as release
  where track.release_id = release.id
    and release.band_entity_id = band_id
    and (release.title, release.release_year) in (
      values
      ('Así Suena La Puebla, Vol.1', 2021),
      ('Así Suena La Puebla, Vol.2', 2022),
      ('Sinfonía Romerista', 2022),
      ('Así Suena La Puebla, Vol.3', 2023),
      ('Dominus Exspiratio', 2024),
      ('Esplendores', 2025),
      ('Soberana Encarnación', 2025),
      ('Dominus Desertorum', 2026)
    );

  insert into public.band_release_tracks (
    release_id, sequence_no, title, duration_text, spotify_url
  )
  select
    release.id, tracks.sequence_no, tracks.title,
    tracks.duration_text, tracks.spotify_url
  from (
    values
      ('Así Suena La Puebla, Vol.1', 2021, 1, 'Corpus Christi', '5:05', 'https://open.spotify.com/track/5H4QsOOUr5oVlIgHsPsuQn'),
      ('Así Suena La Puebla, Vol.1', 2021, 2, 'Madrugá Macarena', '4:11', 'https://open.spotify.com/track/7pSCdeBXpMRknoDjyRGP5H'),
      ('Así Suena La Puebla, Vol.1', 2021, 3, 'Aquella Virgen', '3:54', 'https://open.spotify.com/track/1bhFKmBXX5PQQyQrHAwHB8'),
      ('Así Suena La Puebla, Vol.1', 2021, 4, 'Mi Esperanza', '5:03', 'https://open.spotify.com/track/27112zgRDFKs8RZ9GUBra3'),
      ('Así Suena La Puebla, Vol.1', 2021, 5, 'Virgen de la Palma', '4:11', 'https://open.spotify.com/track/6AKbvePzhdlsn2vpzpMAqf'),
      ('Así Suena La Puebla, Vol.1', 2021, 6, 'Dolores, Saeta Onubense', '5:00', 'https://open.spotify.com/track/3sokO0SrdLfMLou0T0FjLe'),
      ('Así Suena La Puebla, Vol.1', 2021, 7, 'Jesús de las Penas', '6:08', 'https://open.spotify.com/track/7gZKzcz9oR5tF5kvcCZzFw'),
      ('Así Suena La Puebla, Vol.1', 2021, 8, 'Merced', '3:42', 'https://open.spotify.com/track/5AI8OJBLjk75SXWHOCHymj'),
      ('Así Suena La Puebla, Vol.1', 2021, 9, 'Hosanna in Excelsis', '4:11', 'https://open.spotify.com/track/0nmZezpdHMJhnTcVR7Vztf'),
      ('Así Suena La Puebla, Vol.1', 2021, 10, 'María del Rocío', '3:53', 'https://open.spotify.com/track/35vGoxkimOKeJy49GwbSHW'),
      ('Así Suena La Puebla, Vol.1', 2021, 11, 'La Virgen de las Angustias', '5:12', 'https://open.spotify.com/track/3xFFFhDy1B38MTiDRvrmVm'),
      ('Así Suena La Puebla, Vol.1', 2021, 12, 'Virgen de las Aguas', '4:39', 'https://open.spotify.com/track/0r6JJDHJslWvEAHEnytqx4'),
      ('Así Suena La Puebla, Vol.1', 2021, 13, 'Puerta del Cielo', '5:01', 'https://open.spotify.com/track/0GQTpOY20wpEVKZ8xLIca8'),
      ('Así Suena La Puebla, Vol.1', 2021, 14, 'La Gracia de María', '3:31', 'https://open.spotify.com/track/2FhyS9M4lKC0CLLAEFV8RD'),
      ('Así Suena La Puebla, Vol.1', 2021, 15, 'Siempre la Esperanza', '4:23', 'https://open.spotify.com/track/0DAKa5zlZLKIzUsF7SDphW'),
      ('Así Suena La Puebla, Vol.1', 2021, 16, 'Nuestra Señora del Patrocinio', '6:17', 'https://open.spotify.com/track/3vvhRBJxUsRa5S1bSAurvp'),
      ('Así Suena La Puebla, Vol.1', 2021, 17, 'Madre, tu Dulce Nombre', '5:19', 'https://open.spotify.com/track/0bgYBFzq4JjPOJUTsHKE5S'),
      ('Así Suena La Puebla, Vol.1', 2021, 18, 'Como tú, ninguna', '3:52', 'https://open.spotify.com/track/3sNahjBV37lNsTKxSRNbVa'),
      ('Así Suena La Puebla, Vol.1', 2021, 19, 'Candelaria', '4:37', 'https://open.spotify.com/track/1yRjU82eRws7YSmjDH1Pqe'),
      ('Así Suena La Puebla, Vol.1', 2021, 20, 'Rocío', '5:52', 'https://open.spotify.com/track/2P5eYJSFtD8wBiQoKuuHx1'),
      ('Así Suena La Puebla, Vol.2', 2022, 1, '¿Quién te vio y no te recuerda? (Saeta Jerezana)', '4:26', 'https://open.spotify.com/track/0RtTGOLmhvmQaqz1qOyL88'),
      ('Así Suena La Puebla, Vol.2', 2022, 2, 'Virgen del Valle', '4:11', 'https://open.spotify.com/track/2C7HSrcDjXQuuMxAZkLceR'),
      ('Así Suena La Puebla, Vol.2', 2022, 3, 'Coronación de la Macarena', '2:56', 'https://open.spotify.com/track/7C4QRZF6lSiBgeC77roTcv'),
      ('Así Suena La Puebla, Vol.2', 2022, 4, 'Pasan los Campanilleros', '4:36', 'https://open.spotify.com/track/25r9qHMLY0xrsBdGETZmr2'),
      ('Así Suena La Puebla, Vol.2', 2022, 5, 'Triana, tu Esperanza', '4:51', 'https://open.spotify.com/track/15UvLMeHLJmtGDtw49Md2I'),
      ('Así Suena La Puebla, Vol.2', 2022, 6, 'Procesión de Semana Santa en Sevilla', '3:18', 'https://open.spotify.com/track/2i7ru1Sgb9tlZgEEfPXyWV'),
      ('Así Suena La Puebla, Vol.2', 2022, 7, 'La Virgen de los Desamparados', '5:17', 'https://open.spotify.com/track/6V3mGydGfROP8pqMtRNXkp'),
      ('Así Suena La Puebla, Vol.2', 2022, 8, 'Nuestra Señora de la Encarnación', '4:58', 'https://open.spotify.com/track/6ipJboaTOvMpSi4MhN8Ivp'),
      ('Así Suena La Puebla, Vol.2', 2022, 9, 'Señorita de Triana', '4:53', 'https://open.spotify.com/track/0TbvaaForsHJoMlHCsg1z5'),
      ('Así Suena La Puebla, Vol.2', 2022, 10, 'Encarnación', '4:05', 'https://open.spotify.com/track/55SS9arStkGAhcLBbxAMTX'),
      ('Así Suena La Puebla, Vol.2', 2022, 11, 'Mater Mea', '5:41', 'https://open.spotify.com/track/7C6xII8vJFpN1wJYh6Ig7g'),
      ('Así Suena La Puebla, Vol.2', 2022, 12, 'María Santísima del Dulce Nombre', '3:39', 'https://open.spotify.com/track/6fgkYcT0aGOKNrL98jFbfd'),
      ('Así Suena La Puebla, Vol.2', 2022, 13, 'Virgen de la Paz', '5:02', 'https://open.spotify.com/track/6YrJfH2LzhZtzXoD0emAwL'),
      ('Así Suena La Puebla, Vol.2', 2022, 14, 'Macarena', '4:37', 'https://open.spotify.com/track/5LCHpxd6CgKZzNdqsuTINk'),
      ('Así Suena La Puebla, Vol.2', 2022, 15, 'Virgen de la Estrella', '4:30', 'https://open.spotify.com/track/2Msp9k4Ap3JZVEG5qSimB2'),
      ('Así Suena La Puebla, Vol.2', 2022, 16, 'La Sagrada Cena', '5:09', 'https://open.spotify.com/track/3kNTa1DnD2UKX4zQ62I76m'),
      ('Así Suena La Puebla, Vol.2', 2022, 17, 'El Refugio de María', '3:49', 'https://open.spotify.com/track/1tXTTfnLk7Wk5INMAOOZRn'),
      ('Así Suena La Puebla, Vol.2', 2022, 18, 'Cristo de la Vera Cruz', '4:32', 'https://open.spotify.com/track/3DeLoYMW6b6RsY0iFSqlog'),
      ('Así Suena La Puebla, Vol.2', 2022, 19, 'Sevilla Cofradiera', '5:07', 'https://open.spotify.com/track/2U2wVTxjn6f7lbc42nz7gW'),
      ('Así Suena La Puebla, Vol.2', 2022, 20, 'Saeta Cordobesa', '4:23', 'https://open.spotify.com/track/6S7fehJzntj1xYSkKQby1x'),
      ('Sinfonía Romerista', 2022, 1, 'Obertura', '1:42', 'https://open.spotify.com/track/1vadefUriE9qeFMlLAv6uk'),
      ('Sinfonía Romerista', 2022, 2, 'Sevillanas Marismeñas (Las llanuras ardientes de la Marisma - Los pinos - Palabras que se dicen por la arena - Solano de la Marisma)', '4:23', 'https://open.spotify.com/track/7Lr8j68hglprFLRi4sH990'),
      ('Sinfonía Romerista', 2022, 3, 'Soy Marismeño', '3:11', 'https://open.spotify.com/track/4kvhPn11D7A6wNLul5VO3I'),
      ('Sinfonía Romerista', 2022, 4, 'Sevillanas Cigarreras (Cinco Romeros - Por la arena adelante - Al Rocío con La Puebla - Esa es mi gente)', '4:01', 'https://open.spotify.com/track/2D8qtKcD7dt5jwZUXpJuRD'),
      ('Sinfonía Romerista', 2022, 5, 'El Ángelus', '3:43', 'https://open.spotify.com/track/6NEd9sB56bZjWlpwpdVeWh'),
      ('Sinfonía Romerista', 2022, 6, 'Sevillanas de la Tierra (Guadalquivir - Sus caracoles - Vamos a beber - Requiebros)', '3:43', 'https://open.spotify.com/track/6yJspDTvgaX7VmrGZlq5tP'),
      ('Sinfonía Romerista', 2022, 7, 'Cantares (Canto a Andalucía)', '4:00', 'https://open.spotify.com/track/6hqfXSQwuHy1Kqpmr1twVu'),
      ('Sinfonía Romerista', 2022, 8, 'Sevillanas Cofrades (La leyenda del Cachorro - Mi valiente costalero - El Gran Poder vino a verme - Y le hace palmas Sevilla)', '5:54', 'https://open.spotify.com/track/3evD9LlhhFIBWgIlHnmZ5d'),
      ('Sinfonía Romerista', 2022, 9, 'Cantemos, Romeros', '2:39', 'https://open.spotify.com/track/223fwlLGPdaueLfaIdVF9T'),
      ('Sinfonía Romerista', 2022, 10, 'Pensamientos', '3:04', 'https://open.spotify.com/track/3QJgTd6K4Abuf8xKdDbB7v'),
      ('Sinfonía Romerista', 2022, 11, 'Salve Rociera', '3:40', 'https://open.spotify.com/track/23Ke7ebaOTiJ8nzQIJZjy9'),
      ('Así Suena La Puebla, Vol.3', 2023, 1, 'A tus pies, Encarnación', '4:14', 'https://open.spotify.com/track/1Xxwsu0Sp0gELKy7EYgvlp'),
      ('Así Suena La Puebla, Vol.3', 2023, 2, 'La Sangre y la Gloria', '4:29', 'https://open.spotify.com/track/3Qfm5vaiqQcGVYQIYotpss'),
      ('Así Suena La Puebla, Vol.3', 2023, 3, 'Cuando pasa la Esperanza', '4:16', 'https://open.spotify.com/track/5QUu0zmmYIoXiFgMoYJ4AV'),
      ('Así Suena La Puebla, Vol.3', 2023, 4, 'Sed de ti', '4:38', 'https://open.spotify.com/track/6V7yrD23se5jpj3e52PTvb'),
      ('Así Suena La Puebla, Vol.3', 2023, 5, 'Marcha fúnebre en la ópera Jone', '5:57', 'https://open.spotify.com/track/0DgcKormD5WmcsLVo3iNwI'),
      ('Así Suena La Puebla, Vol.3', 2023, 6, 'Virgen de los Dolores y Misericordia', '5:41', 'https://open.spotify.com/track/6bgp4XaXGnu2kQbgIgWuQ3'),
      ('Así Suena La Puebla, Vol.3', 2023, 7, 'Al Señor de la Humildad', '4:01', 'https://open.spotify.com/track/0dliieqbLg5gWzlAiO5EEA'),
      ('Así Suena La Puebla, Vol.3', 2023, 8, 'La Virgen del Museo', '3:27', 'https://open.spotify.com/track/1bzlmWef1nYNHwszVKnqVv'),
      ('Así Suena La Puebla, Vol.3', 2023, 9, 'Siervo de tus Dolores', '4:58', 'https://open.spotify.com/track/3PBkdzn5uujR2an0gQFuzG'),
      ('Así Suena La Puebla, Vol.3', 2023, 10, 'La Soledad', '6:50', 'https://open.spotify.com/track/2qs7ZXwRecZYFn3IDAnYxG'),
      ('Así Suena La Puebla, Vol.3', 2023, 11, 'El Dulce Nombre', '4:28', 'https://open.spotify.com/track/7w92MhHqGVJ7Y6teWSn2oT'),
      ('Así Suena La Puebla, Vol.3', 2023, 12, 'El dolor de tu llanto', '4:37', 'https://open.spotify.com/track/7tfQuoQZR7x1veLvkCCeNu'),
      ('Así Suena La Puebla, Vol.3', 2023, 13, 'Virgen del Amor Doloroso', '6:26', 'https://open.spotify.com/track/3bHdFAR8q3qDHaG0oXBpjt'),
      ('Así Suena La Puebla, Vol.3', 2023, 14, 'Cristo de la Sangre', '5:15', 'https://open.spotify.com/track/57P4Ilo5QIMn00tN05PMs2'),
      ('Así Suena La Puebla, Vol.3', 2023, 15, 'Desamparo', '3:47', 'https://open.spotify.com/track/58ZRFdjnB6Is1EBLJaXVAD'),
      ('Así Suena La Puebla, Vol.3', 2023, 16, 'La Sagrada Lanzada', '4:12', 'https://open.spotify.com/track/3C0xLBIxTDQt8MaWGSrSej'),
      ('Así Suena La Puebla, Vol.3', 2023, 17, 'Al Amparo de María', '3:58', 'https://open.spotify.com/track/6qLCU4Jt0f9wrDNAlhClko'),
      ('Así Suena La Puebla, Vol.3', 2023, 18, 'Soleá dame la mano', '5:44', 'https://open.spotify.com/track/3rksBCVoTBLxiaC83o0Xiu'),
      ('Así Suena La Puebla, Vol.3', 2023, 19, 'Amarguras', '7:38', 'https://open.spotify.com/track/0gzFMmngYvzaVF74g2PlVR'),
      ('Así Suena La Puebla, Vol.3', 2023, 20, 'El Cachorro (Saeta Sevillana)', '6:34', 'https://open.spotify.com/track/3xgjD8ZsWReuakAQ1vVi0j'),
      ('Dominus Exspiratio', 2024, 1, 'Pasa la Virgen Macarena', '4:55', 'https://open.spotify.com/track/5BaBsxur1jnl5OxEhRykbU'),
      ('Dominus Exspiratio', 2024, 2, 'María en sus Lágrimas', '4:45', 'https://open.spotify.com/track/5V2wV8xdWRqofC0JdmCiTv'),
      ('Dominus Exspiratio', 2024, 3, 'La Amargura', '5:54', 'https://open.spotify.com/track/4tixS6Cx0wA2W5h2FdtHsz'),
      ('Dominus Exspiratio', 2024, 4, 'La Vía Sacra', '6:50', 'https://open.spotify.com/track/7Hi9gahDaR7JUnSHLlmiM0'),
      ('Dominus Exspiratio', 2024, 5, 'Hiniesta', '4:25', 'https://open.spotify.com/track/3A6H4oleap8yzVvisjPmps'),
      ('Dominus Exspiratio', 2024, 6, 'Después de la Madrugá', '5:54', 'https://open.spotify.com/track/5KVaUrinstbzWTnx9ZEqWf'),
      ('Dominus Exspiratio', 2024, 7, 'Cristo de la Vera+Cruz', '4:32', 'https://open.spotify.com/track/6ExPpw1g9GZmrSvIIjfeqS'),
      ('Dominus Exspiratio', 2024, 8, 'El Amor Crucificado', '5:03', 'https://open.spotify.com/track/5DHCqnDeP97QLdxDboghHZ'),
      ('Dominus Exspiratio', 2024, 9, 'Santísimo Cristo de las Siete Palabras', '5:32', 'https://open.spotify.com/track/6MciUQrLUX9Y9kN2UR9cHz'),
      ('Dominus Exspiratio', 2024, 10, 'Al Santísimo Cristo del Amor', '4:29', 'https://open.spotify.com/track/4TjBRzLvJYF8brrUErZ2e4'),
      ('Dominus Exspiratio', 2024, 11, 'Cristo de la Sed', '5:07', 'https://open.spotify.com/track/1UCsBCXNLBIC7tMkxHaKe1'),
      ('Dominus Exspiratio', 2024, 12, 'Expiración', '5:32', 'https://open.spotify.com/track/77LdFm2SkUqZQYhQzMF3L1'),
      ('Esplendores', 2025, 1, 'La Estrella Sublime', '3:23', 'https://open.spotify.com/track/0sYxfhG7koBOZJz55cTZT0'),
      ('Esplendores', 2025, 2, 'Esos tus Ojos', '3:30', 'https://open.spotify.com/track/1pWvmh2uSNjqIOGPMOvdpo'),
      ('Esplendores', 2025, 3, 'Esplendor del Porvenir', '4:14', 'https://open.spotify.com/track/6KYKdKtjdyZrthDTaDm7mh'),
      ('Esplendores', 2025, 4, 'Coronación', '4:13', 'https://open.spotify.com/track/2nJAopTMhbTLK6NG053szw'),
      ('Esplendores', 2025, 5, 'Luz de la Esperanza', '5:12', 'https://open.spotify.com/track/6X6rHIODP1uy2UyrwT200b'),
      ('Esplendores', 2025, 6, 'Regina Sacratissimi Rosarii', '4:47', 'https://open.spotify.com/track/5w85iEqE5fahP3GHS75gg3'),
      ('Esplendores', 2025, 7, 'Virgen de las Angustias', '4:29', 'https://open.spotify.com/track/0XxboOOm9y0dMEsLBZ4vpq'),
      ('Esplendores', 2025, 8, 'María Santísima del Subterráneo', '4:13', 'https://open.spotify.com/track/3OHE7wdCld2y8eWbxYoxCy'),
      ('Esplendores', 2025, 9, 'El Amor de un barrio', '4:02', 'https://open.spotify.com/track/2UEruRF3sAFEzm31kANaiq'),
      ('Esplendores', 2025, 10, 'Soberana Encarnación', '3:38', 'https://open.spotify.com/track/4BVYBTow1gM03TeMwkL7Eh'),
      ('Esplendores', 2025, 11, 'Virgen de la O', '3:46', 'https://open.spotify.com/track/6ODNPmG6mdDoOCrZkfdOjY'),
      ('Esplendores', 2025, 12, 'Se arrodilla Triana', '4:10', 'https://open.spotify.com/track/7k6qzedrYjzfvYk4VnJO94'),
      ('Soberana Encarnación', 2025, 1, 'Encarnación de la Calzada', '5:09', 'https://open.spotify.com/track/4bqRA1GO1B31vxUZOsE5ss'),
      ('Soberana Encarnación', 2025, 2, 'A tus pies, Encarnación', '4:12', 'https://open.spotify.com/track/5BFwigDJR4Z4K3jhZ3EiYp'),
      ('Soberana Encarnación', 2025, 3, 'Y María dijo: Sí', '4:28', 'https://open.spotify.com/track/7f8CmvBw6UOpIS57RLRhsh'),
      ('Soberana Encarnación', 2025, 4, 'Soberana Encarnación', '3:30', 'https://open.spotify.com/track/6fSz93fnHlfEBA3cGOeIy2'),
      ('Soberana Encarnación', 2025, 5, 'Nuestra Señora de la Encarnación', '5:20', 'https://open.spotify.com/track/6rgBzGW9zDndHdDb3v6IYf'),
      ('Soberana Encarnación', 2025, 6, 'Palomita de Triana', '4:53', 'https://open.spotify.com/track/6cthiUbTAvkJTd1Tcuw5TD'),
      ('Soberana Encarnación', 2025, 7, 'Encarnación', '4:14', 'https://open.spotify.com/track/6jPPyo7X9gJsbSx3rkLEWr'),
      ('Soberana Encarnación', 2025, 8, 'XXV Aniversario Encarnación', '3:30', 'https://open.spotify.com/track/700dvDC0BqdOXI3emcc4dG'),
      ('Soberana Encarnación', 2025, 9, 'Encarnación Coronada', '3:53', 'https://open.spotify.com/track/0MdIdU9kCc1EZF2ugorMp6'),
      ('Dominus Desertorum', 2026, 1, 'Ecce Homo', '4:12', 'https://open.spotify.com/track/6HSwuMW1VbVOELAJAgaaLm'),
      ('Dominus Desertorum', 2026, 2, 'Servitas de San Marcos', '5:39', 'https://open.spotify.com/track/3QrGqPXo1uilAWfF21Tl80'),
      ('Dominus Desertorum', 2026, 3, 'Virgen de las Angustias', '4:05', 'https://open.spotify.com/track/6ZVDqYOyxcftrABgBFBzNb'),
      ('Dominus Desertorum', 2026, 4, 'Cristo del Buen Fin', '5:49', 'https://open.spotify.com/track/4Nc6RCnqt7dutlkzGkLjtk'),
      ('Dominus Desertorum', 2026, 5, 'La Virgen en sus Lágrimas', '4:36', 'https://open.spotify.com/track/0KHkmdaRvA6s4M5oUcIH9T'),
      ('Dominus Desertorum', 2026, 6, 'El Cristo de los Desamparados', '3:45', 'https://open.spotify.com/track/4w6oKxaOVw4zZhQ2Ep87G5'),
      ('Dominus Desertorum', 2026, 7, 'Victoria y Paz', '5:28', 'https://open.spotify.com/track/1BzETqBdbV8IzYNpb74Cbb'),
      ('Dominus Desertorum', 2026, 8, 'Marcha Fúnebre a Nuestro Padre Jesús de la Pasión', '5:36', 'https://open.spotify.com/track/25i1YOSeHjSoC88kA34Now'),
      ('Dominus Desertorum', 2026, 9, 'Al Señor de la Humildad', '4:27', 'https://open.spotify.com/track/0SficUdU6Y6id0mtVi71uP'),
      ('Dominus Desertorum', 2026, 10, '¡Miradlo en la Cruz!', '5:16', 'https://open.spotify.com/track/38Cyls8t1YmCk7t2Yvi7rV'),
      ('Dominus Desertorum', 2026, 11, 'Triana en sus Penas', '4:21', 'https://open.spotify.com/track/1towzto2h6UkcOgeWadIvw'),
      ('Dominus Desertorum', 2026, 12, 'Mektub', '7:56', 'https://open.spotify.com/track/0Cf2QHUM2iS41cQZFW4ns2')
  ) as tracks(
    release_title, release_year, sequence_no, title, duration_text, spotify_url
  )
  join public.band_releases as release
    on release.band_entity_id = band_id
   and release.title = tracks.release_title
   and release.release_year = tracks.release_year;

  get diagnostics track_rows = row_count;

  if track_rows <> 116 then
    raise exception 'Se esperaban 116 pistas insertadas y se insertaron %', track_rows;
  end if;
end
$migration$;

