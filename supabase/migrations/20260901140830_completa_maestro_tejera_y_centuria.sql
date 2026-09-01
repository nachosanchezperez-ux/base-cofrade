-- Lote editorial · Maestro Tejera + Centuria Romana Macarena
-- Solo DML sobre el modelo First Edition existente.
-- No introduce DDL, RLS ni reescribe migraciones históricas.

do $$
declare
  v_tejera uuid;
  v_centuria uuid;
  v_tejera_apple_source uuid;
  v_centuria_apple_source uuid;
  v_uniform_source uuid;
  v_crest_source uuid;
  v_uniform_asset uuid;
  v_crest_asset uuid;
begin
  select id into v_tejera
  from public.entities
  where slug = 'banda-de-musica-del-maestro-tejera'
    and entity_type = 'band';

  select id into v_centuria
  from public.entities
  where slug = 'centuria-romana-macarena'
    and entity_type = 'band';

  if v_tejera is null or v_centuria is null then
    raise exception 'No se han encontrado las dos Bandas canónicas del lote';
  end if;

  insert into public.sources (
    name, url, source_type, author_or_publisher, accessed_at, notes
  )
  select
    'Banda de Música del Maestro Tejera · catálogo Apple Music',
    'https://music.apple.com/es/artist/banda-de-musica-del-maestro-tejera/276410915',
    'music_platform',
    'Apple Music',
    date '2026-09-01',
    'Catálogo editorial consultado para ediciones, fechas, carátulas, pistas y duraciones.'
  where not exists (
    select 1 from public.sources
    where url = 'https://music.apple.com/es/artist/banda-de-musica-del-maestro-tejera/276410915'
  );

  select id into v_tejera_apple_source
  from public.sources
  where url = 'https://music.apple.com/es/artist/banda-de-musica-del-maestro-tejera/276410915'
  order by created_at
  limit 1;

  select id into v_centuria_apple_source
  from public.sources
  where url = 'https://music.apple.com/es/artist/banda-centuria-romana-macarena/1445727740'
  order by created_at
  limit 1;

  insert into public.source_links (source_id, entity_id, scope, notes)
  select
    v_tejera_apple_source,
    v_tejera,
    'Discografía, carátulas y pistas',
    'Metadatos editoriales del catálogo musical de la formación.'
  where v_tejera_apple_source is not null
    and not exists (
      select 1 from public.source_links
      where source_id = v_tejera_apple_source
        and entity_id = v_tejera
    );

  insert into public.band_releases (
    band_entity_id,
    title,
    release_type,
    release_year,
    release_date,
    release_date_text,
    description,
    cover_image_path,
    cover_image_alt,
    cover_image_credit,
    external_url,
    status
  )
  select
    v_tejera,
    catalog.title,
    catalog.release_type,
    extract(year from catalog.release_date)::integer,
    catalog.release_date,
    to_char(catalog.release_date, 'DD/MM/YYYY'),
    'Edición documentada en el catálogo digital de la formación.',
    catalog.cover_image_path,
    'Carátula de «' || catalog.title || '» de la Banda de Música del Maestro Tejera',
    'Carátula editorial · Apple Music',
    catalog.external_url,
    'published'
  from (values
    ('Suena Tejera 2', 'compilation', date '2004-01-01', 'https://is1-ssl.mzstatic.com/image/thumb/Music4/v4/93/d7/ad/93d7ad2f-1353-ff14-11d8-9a612e868ba3/888608526203.jpg/1200x1200bb.jpg', 'https://music.apple.com/es/album/suena-tejera-2/818684135?uo=4'),
    ('Grada 9', 'album', date '1998-01-01', 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/69/9f/88/699f88cf-ad0d-bb45-8c65-df1c5aa1123c/8429652001661.jpg/1200x1200bb.jpg', 'https://music.apple.com/es/album/grada-9/1720945637?uo=4'),
    ('¡Bravo Tejera! Antología de Pasodobles Taurinos', 'compilation', date '2009-03-16', 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/da/1e/3c/da1e3c3a-a327-b504-7e47-7c4d51061f73/8429652006901.jpg/1200x1200bb.jpg', 'https://music.apple.com/es/album/bravo-tejera-antolog%C3%ADa-de-pasodobles-taurinos/1721603245?uo=4'),
    ('Carmen - Single', 'single', date '2025-06-11', 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/8e/ae/ea/8eaeea45-0235-85c4-3bb3-e0cf9dab5139/artwork.jpg/1200x1200bb.jpg', 'https://music.apple.com/es/album/carmen-single/1820236710?uo=4'),
    ('Nuevas Marchas Cofradieras', 'album', date '1991-01-01', 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/43/22/b5/4322b5cf-560d-6b7f-3c92-f274e87d5661/8429652009858.jpg/1200x1200bb.jpg', 'https://music.apple.com/es/album/nuevas-marchas-cofradieras/1723379497?uo=4'),
    ('Oración y Música', 'album', date '1991-01-01', 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/67/aa/43/67aa438b-937f-e600-7f1b-1dd16f27a647/8429652009827.jpg/1200x1200bb.jpg', 'https://music.apple.com/es/album/oraci%C3%B3n-y-m%C3%BAsica/1723378659?uo=4'),
    ('Montserrat - Single', 'single', date '2024-03-04', 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/c0/1d/1d/c01d1d5e-d2fd-bb08-1b6a-f5389bef3ad5/artwork.jpg/1200x1200bb.jpg', 'https://music.apple.com/es/album/montserrat-single/1837525928?uo=4'),
    ('Real Maestranza', 'album', date '1996-01-01', 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/19/1d/d8/191dd857-01d4-d70f-90f1-a4e7de442841/8429652009094.jpg/1200x1200bb.jpg', 'https://music.apple.com/es/album/real-maestranza/1723379959?uo=4'),
    ('Puerta del Príncipe', 'compilation', date '1996-01-01', 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/61/03/5a/61035ac2-088b-afa7-8b6f-cf1c8c60dc8b/8429652009940.jpg/1200x1200bb.jpg', 'https://music.apple.com/es/album/puerta-del-pr%C3%ADncipe/1723386029?uo=4'),
    ('Clásico', 'album', date '1998-01-01', 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/c2/34/33/c23433e2-51f9-af93-db06-1dbc0fd38de0/8429652001548.jpg/1200x1200bb.jpg', 'https://music.apple.com/es/album/cl%C3%A1sico/1598583702?uo=4'),
    ('A ti Cofrade', 'album', date '1991-01-01', 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/25/17/07/25170751-c6b2-5c96-cb34-ca84e4a49de4/8429652009872.jpg/1200x1200bb.jpg', 'https://music.apple.com/es/album/a-ti-cofrade/1574910525?uo=4'),
    ('¡MIRADLO EN LA CRUZ! - Single', 'single', date '2024-02-25', 'https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/85/78/a5/8578a53c-c0d0-f085-0cfe-576750124206/artwork.jpg/1200x1200bb.jpg', 'https://music.apple.com/es/album/miradlo-en-la-cruz-single/1733304661?uo=4'),
    ('Música, Maestro', 'album', date '1996-01-01', 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/be/de/b8/bedeb8cc-e690-3a77-9585-edc0fe7fc566/8429652009001.jpg/1200x1200bb.jpg', 'https://music.apple.com/es/album/m%C3%BAsica-maestro/1723364071?uo=4'),
    ('Suena Tejera', 'compilation', date '2002-01-01', 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/9d/13/e5/9d13e5ca-0e50-edbd-c5b1-3b82c69ab057/8429652004990.jpg/1200x1200bb.jpg', 'https://music.apple.com/es/album/suena-tejera/1720992792?uo=4'),
    ('Tercio de Quites', 'album', date '2002-01-01', 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/18/e2/62/18e262e8-ba30-3743-7026-41fd7f6e4cd2/8429652004556.jpg/1200x1200bb.jpg', 'https://music.apple.com/es/album/tercio-de-quites/1720992172?uo=4'),
    ('Pasodobles Taurinos', 'album', date '1990-01-01', 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/4d/03/d6/4d03d613-4dc7-4c49-7947-d5cf32389ee9/8429652009902.jpg/1200x1200bb.jpg', 'https://music.apple.com/es/album/pasodobles-taurinos/1723378862?uo=4'),
    ('Semana Santa en Sevilla', 'album', date '1983-01-01', 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/78/ab/e1/78abe133-dd5b-ecd6-7a0d-9de484cba129/8429652013299.jpg/1200x1200bb.jpg', 'https://music.apple.com/es/album/semana-santa-en-sevilla/1564466949?uo=4'),
    ('Pepín Tejera en el Recuerdo', 'compilation', date '2012-01-15', 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/a5/1e/4f/a51e4f26-e8d7-f0ec-54b7-a5e3541f0f89/8429652007526.jpg/1200x1200bb.jpg', 'https://music.apple.com/es/album/pep%C3%ADn-tejera-en-el-recuerdo/1723380799?uo=4'),
    ('Plaza de la Maestranza', 'album', date '1992-01-01', 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/24/bb/de/24bbdebd-4afd-43dc-c997-d40899283e40/8429652008653.jpg/1200x1200bb.jpg', 'https://music.apple.com/es/album/plaza-de-la-maestranza/1723371001?uo=4'),
    ('Sevilla, Toros y Música', 'album', date '1996-01-01', 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/cd/59/7d/cd597d47-1a14-198f-e95e-37a8d02bb6df/8429652008981.jpg/1200x1200bb.jpg', 'https://music.apple.com/es/album/sevilla-toros-y-m%C3%BAsica/1723363438?uo=4'),
    ('Plaza de la Maestranza', 'album', date '1996-01-01', 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/c5/a1/81/c5a18142-323e-bd9f-b03d-a72575a281e7/8429652008974.jpg/1200x1200bb.jpg', 'https://music.apple.com/es/album/plaza-de-la-maestranza/1723363442?uo=4'),
    ('Clásico 2', 'album', date '2000-01-01', 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/ff/e8/88/ffe8883c-92c5-2792-45fa-690d11a5c773/8429652003504.jpg/1200x1200bb.jpg', 'https://music.apple.com/es/album/cl%C3%A1sico-2/1598583485?uo=4'),
    ('Pa Soñar', 'compilation', date '1999-01-01', 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/36/51/e6/3651e6da-69f7-b710-065f-e4a91ce8cfea/8429652003320.jpg/1200x1200bb.jpg', 'https://music.apple.com/es/album/pa-so%C3%B1ar/1720956594?uo=4'),
    ('¡Torero! El alma de la fiesta - Pasodobles taurinos', 'album', date '1991-01-01', 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/33/af/ff/33afff0f-f8a1-85bb-5e1c-a1c10a8c8963/8429652034799.jpg/1200x1200bb.jpg', 'https://music.apple.com/es/album/torero-el-alma-de-la-fiesta-pasodobles-taurinos/1802719994?uo=4'),
    ('Cartel de Lujo', 'album', date '1991-01-01', 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/e0/6d/c9/e06dc9f9-e5a3-f6cb-ed89-74ef85442188/8429652009933.jpg/1200x1200bb.jpg', 'https://music.apple.com/es/album/cartel-de-lujo/1574950379?uo=4'),
    ('Saeta', 'album', date '1993-01-01', 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/4f/4c/98/4f4c98b2-2980-554e-4bb4-599d2e43cba9/8429652009551.jpg/1200x1200bb.jpg', 'https://music.apple.com/es/album/saeta/1723377981?uo=4'),
    ('Seleccion Antologica de Marchas Procesionales 1', 'album', date '2005-01-01', 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/ed/4d/b9/ed4db922-c499-c309-8140-f62d9d0a8d3b/8429652005775.jpg/1200x1200bb.jpg', 'https://music.apple.com/es/album/seleccion-antologica-de-marchas-procesionales-1/1721590309?uo=4'),
    ('Clásico 3', 'album', date '2000-01-01', 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/e8/7c/6d/e87c6d11-a080-3eda-d8e7-c8964c7bd387/8429652003887.jpg/1200x1200bb.jpg', 'https://music.apple.com/es/album/cl%C3%A1sico-3/1720989103?uo=4')
  ) as catalog(title, release_type, release_date, cover_image_path, external_url)
  on conflict (band_entity_id, title, release_year) do update set
    release_type = excluded.release_type,
    release_date = excluded.release_date,
    release_date_text = excluded.release_date_text,
    description = excluded.description,
    cover_image_path = excluded.cover_image_path,
    cover_image_alt = excluded.cover_image_alt,
    cover_image_credit = excluded.cover_image_credit,
    external_url = excluded.external_url,
    status = excluded.status,
    updated_at = now();

  insert into public.band_release_tracks (
    release_id, sequence_no, title, duration_text, notes
  )
  select
    release.id,
    track.sequence_no,
    track.title,
    track.duration_text,
    track.notes
  from (values
    ('Suena Tejera 2', 2004, 1, 'Reina del Mar', '4:19', null),
    ('Suena Tejera 2', 2004, 2, 'Virgen del Valle', '5:03', null),
    ('Suena Tejera 2', 2004, 3, 'Pasa la Virgen Macarena', '4:01', null),
    ('Suena Tejera 2', 2004, 4, 'La Música del Silencio', '6:24', null),
    ('Suena Tejera 2', 2004, 5, 'Jesús de las Penas', '5:35', null),
    ('Suena Tejera 2', 2004, 6, 'Coronación de la Macarena', '3:08', null),
    ('Suena Tejera 2', 2004, 7, 'Solea Dame la Mano', '6:44', null),
    ('Suena Tejera 2', 2004, 8, 'Pasa la Virgen de la Soledad', '4:17', null),
    ('Suena Tejera 2', 2004, 9, 'Saeta Cordobesa', '4:56', null),
    ('Suena Tejera 2', 2004, 10, 'Virgen de Consolación', '4:25', null),
    ('Suena Tejera 2', 2004, 11, 'Virgen de la Cabeza', '6:05', null),
    ('Suena Tejera 2', 2004, 12, 'Encarnación de la Calzada', '5:08', null),
    ('Grada 9', 1998, 1, 'La Puerta Grande', '3:48', null),
    ('Grada 9', 1998, 2, 'Pepín Tejera', '3:15', null),
    ('Grada 9', 1998, 3, 'Manolo Martín Vázquez', '3:20', null),
    ('Grada 9', 1998, 4, 'Lopera', '3:47', null),
    ('Grada 9', 1998, 5, 'Fermín Murillo', '3:00', null),
    ('Grada 9', 1998, 6, 'La Concha Flamenca', '4:00', null),
    ('Grada 9', 1998, 7, 'El Poleo de Alajar', '2:15', null),
    ('Grada 9', 1998, 8, 'Curro Romero', '2:43', null),
    ('Grada 9', 1998, 9, 'Manuel Ramírez', '2:21', null),
    ('Grada 9', 1998, 10, 'Aroche', '3:14', null),
    ('Grada 9', 1998, 11, 'Jabugo', '5:19', null),
    ('Grada 9', 1998, 12, 'Currito de la Macarena', '3:13', null),
    ('Grada 9', 1998, 13, 'Domingo Ortega', '3:55', null),
    ('Grada 9', 1998, 14, 'Joselito Bienvenida', '2:01', null),
    ('¡Bravo Tejera! Antología de Pasodobles Taurinos', 2009, 1, 'Toque de Clarines de la Real Maestranza de Sevilla', '0:28', null),
    ('¡Bravo Tejera! Antología de Pasodobles Taurinos', 2009, 2, 'Nerva', '2:31', null),
    ('¡Bravo Tejera! Antología de Pasodobles Taurinos', 2009, 3, 'La Giralda', '2:15', null),
    ('¡Bravo Tejera! Antología de Pasodobles Taurinos', 2009, 4, 'Opera Flamenca', '3:15', null),
    ('¡Bravo Tejera! Antología de Pasodobles Taurinos', 2009, 5, 'Serva la Bari', '3:42', null),
    ('¡Bravo Tejera! Antología de Pasodobles Taurinos', 2009, 6, 'El Tio Caniyitas', '3:16', null),
    ('¡Bravo Tejera! Antología de Pasodobles Taurinos', 2009, 7, 'Manolete', '3:20', null),
    ('¡Bravo Tejera! Antología de Pasodobles Taurinos', 2009, 8, 'Azabache', '3:09', null),
    ('¡Bravo Tejera! Antología de Pasodobles Taurinos', 2009, 9, 'Lagartijilla', '4:21', null),
    ('¡Bravo Tejera! Antología de Pasodobles Taurinos', 2009, 10, 'Dauder', '2:44', null),
    ('¡Bravo Tejera! Antología de Pasodobles Taurinos', 2009, 11, 'Churumbelerias', '3:50', null),
    ('¡Bravo Tejera! Antología de Pasodobles Taurinos', 2009, 12, 'La Puerta Grande', '3:51', null),
    ('¡Bravo Tejera! Antología de Pasodobles Taurinos', 2009, 13, 'Currito de la Macarena', '3:16', null),
    ('¡Bravo Tejera! Antología de Pasodobles Taurinos', 2009, 14, 'Andujar', '3:12', null),
    ('¡Bravo Tejera! Antología de Pasodobles Taurinos', 2009, 15, 'Plaza de la Maestranza', '2:20', null),
    ('¡Bravo Tejera! Antología de Pasodobles Taurinos', 2009, 16, 'Huelva', '3:24', null),
    ('¡Bravo Tejera! Antología de Pasodobles Taurinos', 2009, 17, 'Rajon Fale', '3:32', null),
    ('¡Bravo Tejera! Antología de Pasodobles Taurinos', 2009, 18, 'Palmas al Mayoral', '2:31', null),
    ('¡Bravo Tejera! Antología de Pasodobles Taurinos', 2009, 19, 'Juncal', '2:24', null),
    ('¡Bravo Tejera! Antología de Pasodobles Taurinos', 2009, 20, 'El Gato Montes', '1:39', null),
    ('¡Bravo Tejera! Antología de Pasodobles Taurinos', 2009, 21, 'La Gracia de Dios', '3:33', null),
    ('¡Bravo Tejera! Antología de Pasodobles Taurinos', 2009, 22, 'La Entrada', '2:15', null),
    ('¡Bravo Tejera! Antología de Pasodobles Taurinos', 2009, 23, 'Toque de Clarines de la Real Maestranza de Sevilla Ii', '0:28', null),
    ('¡Bravo Tejera! Antología de Pasodobles Taurinos', 2009, 24, 'Paquito el Chocolatero', '3:07', null),
    ('¡Bravo Tejera! Antología de Pasodobles Taurinos', 2009, 25, 'Amparito Roca', '3:22', null),
    ('¡Bravo Tejera! Antología de Pasodobles Taurinos', 2009, 26, 'Suspiros de España', '4:36', null),
    ('¡Bravo Tejera! Antología de Pasodobles Taurinos', 2009, 27, 'Gallito', '3:00', null),
    ('¡Bravo Tejera! Antología de Pasodobles Taurinos', 2009, 28, 'España Cañi', '2:16', null),
    ('¡Bravo Tejera! Antología de Pasodobles Taurinos', 2009, 29, 'Pepita Creus', '4:11', null),
    ('¡Bravo Tejera! Antología de Pasodobles Taurinos', 2009, 30, 'Curro Romero', '2:44', null),
    ('¡Bravo Tejera! Antología de Pasodobles Taurinos', 2009, 31, 'Chiclanera', '4:23', null),
    ('¡Bravo Tejera! Antología de Pasodobles Taurinos', 2009, 32, 'Por Sevillanas', '2:42', null),
    ('¡Bravo Tejera! Antología de Pasodobles Taurinos', 2009, 33, 'Marcial, Eres el Mas Grande', '4:23', null),
    ('¡Bravo Tejera! Antología de Pasodobles Taurinos', 2009, 34, 'Fiesta Española', '3:22', null),
    ('¡Bravo Tejera! Antología de Pasodobles Taurinos', 2009, 35, 'Los Miuras', '3:14', null),
    ('¡Bravo Tejera! Antología de Pasodobles Taurinos', 2009, 36, 'Domingo Ortega', '3:58', null),
    ('¡Bravo Tejera! Antología de Pasodobles Taurinos', 2009, 37, 'Vito', '2:59', null),
    ('¡Bravo Tejera! Antología de Pasodobles Taurinos', 2009, 38, 'Real Maestranza', '4:09', null),
    ('¡Bravo Tejera! Antología de Pasodobles Taurinos', 2009, 39, 'Salga el Toro', '2:15', null),
    ('¡Bravo Tejera! Antología de Pasodobles Taurinos', 2009, 40, 'El Arte de Cuchares', '4:08', null),
    ('¡Bravo Tejera! Antología de Pasodobles Taurinos', 2009, 41, 'Pepin Tejera', '3:18', null),
    ('¡Bravo Tejera! Antología de Pasodobles Taurinos', 2009, 42, 'El Poleo de Alajar', '2:17', null),
    ('¡Bravo Tejera! Antología de Pasodobles Taurinos', 2009, 43, 'Aroche', '3:14', null),
    ('¡Bravo Tejera! Antología de Pasodobles Taurinos', 2009, 44, 'Tercio de Quites', '4:08', null),
    ('Carmen - Single', 2025, 1, 'Carmen', '4:33', null),
    ('Nuevas Marchas Cofradieras', 1991, 1, 'Estrella Sublime', '3:32', null),
    ('Nuevas Marchas Cofradieras', 1991, 2, 'Pasan los Campanilleros', '3:57', null),
    ('Nuevas Marchas Cofradieras', 1991, 3, 'Rocio', '5:41', null),
    ('Nuevas Marchas Cofradieras', 1991, 4, 'Nuestro Padre Jesús', '4:50', null),
    ('Nuevas Marchas Cofradieras', 1991, 5, 'Virgen del Águila', '4:28', null),
    ('Nuevas Marchas Cofradieras', 1991, 6, 'Corpus Christi', '5:03', null),
    ('Nuevas Marchas Cofradieras', 1991, 7, 'Triunfal', '4:03', null),
    ('Nuevas Marchas Cofradieras', 1991, 8, 'Hiniesta Coronada', '3:54', null),
    ('Nuevas Marchas Cofradieras', 1991, 9, 'Virgen del Subterraneo', '4:18', null),
    ('Nuevas Marchas Cofradieras', 1991, 10, 'Cristo de la Sangre', '5:16', null),
    ('Oración y Música', 1991, 1, 'Aniversario Macareno', '3:27', null),
    ('Oración y Música', 1991, 2, 'Pasa la Virgen de la Soledad', '4:15', null),
    ('Oración y Música', 1991, 3, 'Virgen de los Reyes', '3:48', null),
    ('Oración y Música', 1991, 4, 'Jesús en el Calvario', '4:50', null),
    ('Oración y Música', 1991, 5, 'Amargura', '7:33', null),
    ('Oración y Música', 1991, 6, 'Esperanza Ilicitana', '5:28', null),
    ('Oración y Música', 1991, 7, 'Estrella Sublime', '3:31', null),
    ('Oración y Música', 1991, 8, 'Juana de Arco', '3:41', null),
    ('Oración y Música', 1991, 9, 'Sagrado Descendimiento', '3:46', null),
    ('Oración y Música', 1991, 10, 'Jesús del Gran Poder', '7:19', null),
    ('Montserrat - Single', 2024, 1, 'Montserrat', '4:41', null),
    ('Real Maestranza', 1996, 1, 'Música, Maestro', '0:28', null),
    ('Real Maestranza', 1996, 2, 'Real Maestranza', '4:07', null),
    ('Real Maestranza', 1996, 3, '¡viva Manolo Vazquez!', '3:22', null),
    ('Real Maestranza', 1996, 4, 'Opera Flamenca', '3:12', null),
    ('Real Maestranza', 1996, 5, 'El Tio Caniyitas', '3:14', null),
    ('Real Maestranza', 1996, 6, 'Pinturerias', '4:27', null),
    ('Real Maestranza', 1996, 7, 'Salga el Toro', '2:14', null),
    ('Real Maestranza', 1996, 8, 'Pedrito de Portugal', '3:51', null),
    ('Real Maestranza', 1996, 9, 'Churumbelerias', '3:48', null),
    ('Real Maestranza', 1996, 10, 'El Arte de Cuchares', '4:06', null),
    ('Real Maestranza', 1996, 11, 'Suspiros de España', '4:34', null),
    ('Real Maestranza', 1996, 12, 'Recordando a Tejera', '2:44', null),
    ('Real Maestranza', 1996, 13, 'Candelas', '5:25', null),
    ('Puerta del Príncipe', 1996, 1, 'Toque de Clarines de la Real Maestranza de Sevilla', '0:20', null),
    ('Puerta del Príncipe', 1996, 2, 'Miguelito Baez Litri', '3:24', null),
    ('Puerta del Príncipe', 1996, 3, 'Fiesta Española', '3:20', null),
    ('Puerta del Príncipe', 1996, 4, 'Gallito', '3:00', null),
    ('Puerta del Príncipe', 1996, 5, 'Nerva', '2:43', null),
    ('Puerta del Príncipe', 1996, 6, 'Dauder', '2:40', null),
    ('Puerta del Príncipe', 1996, 7, 'Ruedos de España', '3:12', null),
    ('Puerta del Príncipe', 1996, 8, 'Toque de Clarines de la Real Maestranza de Sevilla 2', '0:20', null),
    ('Puerta del Príncipe', 1996, 9, 'Los Miuras', '3:12', null),
    ('Puerta del Príncipe', 1996, 10, 'Rafi Camino', '3:07', null),
    ('Puerta del Príncipe', 1996, 11, 'Victor Mendes', '2:04', null),
    ('Puerta del Príncipe', 1996, 12, 'Serva la Bari', '3:38', null),
    ('Puerta del Príncipe', 1996, 13, 'Vito', '2:57', null),
    ('Puerta del Príncipe', 1996, 14, 'La Giralda', '2:14', null),
    ('Clásico', 1998, 1, 'A Ti Manué', '5:54', null),
    ('Clásico', 1998, 2, 'Virgen de la Cabeza', '6:03', null),
    ('Clásico', 1998, 3, 'Nuestro Padre Jesús', '5:27', null),
    ('Clásico', 1998, 4, 'Virgen del Valle', '5:01', null),
    ('Clásico', 1998, 5, 'La Madrugá', '8:26', null),
    ('Clásico', 1998, 6, 'Rocío', '6:20', null),
    ('Clásico', 1998, 7, 'Soleá Dame la Mano', '6:42', null),
    ('Clásico', 1998, 8, 'Jesús de las Penas', '5:33', null),
    ('Clásico', 1998, 9, 'Madre Hiniesta', '4:01', null),
    ('Clásico', 1998, 10, 'Cristo de la Expiración', '6:26', null),
    ('A ti Cofrade', 1991, 1, 'Reina del Subterraneo', '3:45', null),
    ('A ti Cofrade', 1991, 2, 'Pasa el Gran Poder', '4:23', null),
    ('A ti Cofrade', 1991, 3, 'Dulce Nombre de Jesús', '4:41', null),
    ('A ti Cofrade', 1991, 4, 'Consolacion', '4:02', null),
    ('A ti Cofrade', 1991, 5, 'Rocio', '6:01', null),
    ('A ti Cofrade', 1991, 6, 'Pasan los Campanilleros', '4:11', null),
    ('A ti Cofrade', 1991, 7, 'La Pilarica', '3:38', null),
    ('A ti Cofrade', 1991, 8, 'Música del Silencio', '6:22', null),
    ('A ti Cofrade', 1991, 9, 'Reina de los Ángeles', '4:13', null),
    ('A ti Cofrade', 1991, 10, 'Nuestra Señora de la Natividad', '3:49', null),
    ('¡MIRADLO EN LA CRUZ! - Single', 2024, 1, '¡MIRADLO EN LA CRUZ!', '5:05', null),
    ('Música, Maestro', 1996, 1, 'Nerva', '2:56', null),
    ('Música, Maestro', 1996, 2, 'España Cañi', '2:14', null),
    ('Música, Maestro', 1996, 3, 'Manolete', '3:17', null),
    ('Música, Maestro', 1996, 4, 'La Giralda', '2:12', null),
    ('Música, Maestro', 1996, 5, 'Gallito', '2:59', null),
    ('Música, Maestro', 1996, 6, 'Amparito Roca', '3:19', null),
    ('Música, Maestro', 1996, 7, 'Ayamonte', '2:21', null),
    ('Música, Maestro', 1996, 8, 'Chiclanera', '2:41', null),
    ('Música, Maestro', 1996, 9, 'Paquito Chocolatero', '3:06', null),
    ('Música, Maestro', 1996, 10, 'Marcial, Eres el Mas Grande', '4:22', null),
    ('Música, Maestro', 1996, 11, 'Plaza de la Maestranza', '2:18', null),
    ('Música, Maestro', 1996, 12, 'Rajon Fale', '3:31', null),
    ('Música, Maestro', 1996, 13, 'Andujar', '3:10', null),
    ('Música, Maestro', 1996, 14, 'Huelva', '3:21', null),
    ('Suena Tejera', 2002, 1, 'Estrella Sublime', '3:33', null),
    ('Suena Tejera', 2002, 2, 'A Ti Manue', '5:56', null),
    ('Suena Tejera', 2002, 3, 'Esperanza Macarena', '3:40', null),
    ('Suena Tejera', 2002, 4, 'Nuestro Padre Jesús', '5:30', null),
    ('Suena Tejera', 2002, 5, 'Rocío', '6:22', null),
    ('Suena Tejera', 2002, 6, 'La Madruga', '8:28', null),
    ('Suena Tejera', 2002, 7, 'La Saeta', '4:43', null),
    ('Suena Tejera', 2002, 8, 'Macarena 1', '4:16', null),
    ('Suena Tejera', 2002, 9, 'Amarguras', '7:35', null),
    ('Suena Tejera', 2002, 10, 'Sevilla Cofradiera', '5:28', null),
    ('Suena Tejera', 2002, 11, 'Pasan los Campanilleros', '4:00', null),
    ('Suena Tejera', 2002, 12, 'Macarena 2', '4:49', null),
    ('Suena Tejera', 2002, 13, 'Madre Hiniesta', '4:01', null),
    ('Tercio de Quites', 2002, 1, 'Maestranza Sevillana', '3:53', null),
    ('Tercio de Quites', 2002, 2, 'Cielo Andaluz', '3:19', null),
    ('Tercio de Quites', 2002, 3, 'Los Dos Adolfos', '3:23', null),
    ('Tercio de Quites', 2002, 4, 'El Juli', '4:58', null),
    ('Tercio de Quites', 2002, 5, 'Azabache', '3:05', null),
    ('Tercio de Quites', 2002, 6, 'Lagartijilla', '4:17', null),
    ('Tercio de Quites', 2002, 7, 'Primavera Sevillana', '4:43', null),
    ('Tercio de Quites', 2002, 8, 'Tercio de Quites', '4:08', null),
    ('Tercio de Quites', 2002, 9, 'Pepita Greus', '4:09', null),
    ('Tercio de Quites', 2002, 10, 'Barquerito de Lora', '2:34', null),
    ('Tercio de Quites', 2002, 11, 'Peña Taurina Victoriana', '4:24', null),
    ('Tercio de Quites', 2002, 12, 'Sangre de Artista', '5:07', null),
    ('Pasodobles Taurinos', 1990, 1, 'Juncal', '2:20', null),
    ('Pasodobles Taurinos', 1990, 2, 'El Gato Montes', '1:35', null),
    ('Pasodobles Taurinos', 1990, 3, 'La Giralda', '2:11', null),
    ('Pasodobles Taurinos', 1990, 4, 'Amparito Roca', '3:18', null),
    ('Pasodobles Taurinos', 1990, 5, 'Manolete', '3:15', null),
    ('Pasodobles Taurinos', 1990, 6, 'Nerva', '2:24', null),
    ('Pasodobles Taurinos', 1990, 7, 'Gallito', '2:56', null),
    ('Pasodobles Taurinos', 1990, 8, 'España Cañi', '2:12', null),
    ('Pasodobles Taurinos', 1990, 9, 'La Gracia de Dios', '3:28', null),
    ('Pasodobles Taurinos', 1990, 10, 'La Entrada', '2:15', null),
    ('Semana Santa en Sevilla', 1983, 1, 'Pasa la Virgen Macarena', '3:51', null),
    ('Semana Santa en Sevilla', 1983, 2, 'Virgen de la Victoria', '5:08', null),
    ('Semana Santa en Sevilla', 1983, 3, 'Virgen de la Paz', '5:05', null),
    ('Semana Santa en Sevilla', 1983, 4, 'Esperanza Macarena', '3:24', null),
    ('Semana Santa en Sevilla', 1983, 5, 'Virgen del Valle', '4:41', null),
    ('Semana Santa en Sevilla', 1983, 6, 'Cristo en la Alcazaba', '4:14', null),
    ('Semana Santa en Sevilla', 1983, 7, 'Tus dolores son mis penas', '4:43', null),
    ('Semana Santa en Sevilla', 1983, 8, 'Virgen de Montserrat', '4:36', null),
    ('Pepín Tejera en el Recuerdo', 2012, 1, 'La Estrella Sublime', '3:37', null),
    ('Pepín Tejera en el Recuerdo', 2012, 2, 'Nuestro Padre Jesús', '5:31', null),
    ('Pepín Tejera en el Recuerdo', 2012, 3, 'Corpus Christi', '5:09', null),
    ('Pepín Tejera en el Recuerdo', 2012, 4, 'Amarguras', '7:35', null),
    ('Pepín Tejera en el Recuerdo', 2012, 5, 'Pasa la Virgen Macarena', '3:55', null),
    ('Pepín Tejera en el Recuerdo', 2012, 6, 'Jesús de las Penas', '5:35', null),
    ('Pepín Tejera en el Recuerdo', 2012, 7, 'Virgen del Subterráneo', '4:20', null),
    ('Pepín Tejera en el Recuerdo', 2012, 8, 'Sevilla Cofradera', '5:28', null),
    ('Pepín Tejera en el Recuerdo', 2012, 9, 'Esperanza Macarena', '3:39', null),
    ('Pepín Tejera en el Recuerdo', 2012, 10, 'Semana Santa en Sevilla', '3:19', null),
    ('Pepín Tejera en el Recuerdo', 2012, 11, 'Virgen de Montserrat', '4:36', null),
    ('Pepín Tejera en el Recuerdo', 2012, 12, 'Virgen de la Paz', '5:10', null),
    ('Pepín Tejera en el Recuerdo', 2012, 13, 'Música del Silencio', '6:25', null),
    ('Pepín Tejera en el Recuerdo', 2012, 14, 'Virgen de las Aguas', '4:50', null),
    ('Pepín Tejera en el Recuerdo', 2012, 15, 'Virgen del Valle', '5:03', null),
    ('Pepín Tejera en el Recuerdo', 2012, 16, 'Rocío', '6:22', null),
    ('Pepín Tejera en el Recuerdo', 2012, 17, 'Soleá Dame la Mano', '6:45', null),
    ('Pepín Tejera en el Recuerdo', 2012, 18, 'Pasan los Campanilleros', '3:59', null),
    ('Pepín Tejera en el Recuerdo', 2012, 19, 'Sagrada Lanzada', '4:43', null),
    ('Pepín Tejera en el Recuerdo', 2012, 20, 'Coronación de la Macarena', '3:09', null),
    ('Pepín Tejera en el Recuerdo', 2012, 21, 'Tus Dolores Son Mis Penas', '4:45', null),
    ('Pepín Tejera en el Recuerdo', 2012, 22, 'Quinta Angustia', '3:13', null),
    ('Plaza de la Maestranza', 1992, 1, 'Nerva', '2:56', null),
    ('Plaza de la Maestranza', 1992, 2, 'España Cañi', '2:14', null),
    ('Plaza de la Maestranza', 1992, 3, 'Manolete', '3:17', null),
    ('Plaza de la Maestranza', 1992, 4, 'La Giralda', '2:12', null),
    ('Plaza de la Maestranza', 1992, 5, 'Gallito', '2:59', null),
    ('Plaza de la Maestranza', 1992, 6, 'Amparito Roca', '3:19', null),
    ('Plaza de la Maestranza', 1992, 7, 'Ayamonte', '2:21', null),
    ('Plaza de la Maestranza', 1992, 8, 'Chiclanera', '2:41', null),
    ('Plaza de la Maestranza', 1992, 9, 'Paquito el Chocolatero', '3:06', null),
    ('Plaza de la Maestranza', 1992, 10, 'Marcial, Eres el Mas Grande', '4:22', null),
    ('Plaza de la Maestranza', 1992, 11, 'Plaza de la Maestranza', '2:18', null),
    ('Plaza de la Maestranza', 1992, 12, 'Rajon Fale', '3:31', null),
    ('Plaza de la Maestranza', 1992, 13, 'Andujar', '3:10', null),
    ('Plaza de la Maestranza', 1992, 14, 'Huelva', '3:21', null),
    ('Sevilla, Toros y Música', 1996, 1, 'Toque de Clarines de la Real Maestranza de Sevilla', '0:20', null),
    ('Sevilla, Toros y Música', 1996, 2, 'Nerva', '2:35', null),
    ('Sevilla, Toros y Música', 1996, 3, 'Amparito Roca', '3:17', null),
    ('Sevilla, Toros y Música', 1996, 4, 'La Gracia de Dios', '3:28', null),
    ('Sevilla, Toros y Música', 1996, 5, 'Calafat y Olé', '3:14', null),
    ('Sevilla, Toros y Música', 1996, 6, 'Ayamonte', '2:19', null),
    ('Sevilla, Toros y Música', 1996, 7, 'Toque de Clarines de la Real Maestranza de Sevilla V2', '0:19', null),
    ('Sevilla, Toros y Música', 1996, 8, 'La Entrada', '2:16', null),
    ('Sevilla, Toros y Música', 1996, 9, 'Camino de Rosas', '3:28', null),
    ('Sevilla, Toros y Música', 1996, 10, 'Curro Duran', '3:16', null),
    ('Sevilla, Toros y Música', 1996, 11, 'Fregenal de la Sierra', '4:33', null),
    ('Plaza de la Maestranza', 1996, 1, 'Toque de Clarines de la Real Maestranza de Sevilla', '0:20', null),
    ('Plaza de la Maestranza', 1996, 2, 'Andujar', '3:08', null),
    ('Plaza de la Maestranza', 1996, 3, 'Nerva', '2:26', null),
    ('Plaza de la Maestranza', 1996, 4, 'España Cañi', '2:12', null),
    ('Plaza de la Maestranza', 1996, 5, 'Gallito', '2:57', null),
    ('Plaza de la Maestranza', 1996, 6, 'Plaza de la Maestranza', '2:15', null),
    ('Plaza de la Maestranza', 1996, 7, 'Toque de Clarines de la Real Maestranza de Sevilla 2', '0:17', null),
    ('Plaza de la Maestranza', 1996, 8, 'Giralda', '2:11', null),
    ('Plaza de la Maestranza', 1996, 9, 'Huelva', '3:19', null),
    ('Plaza de la Maestranza', 1996, 10, 'Manolete', '3:16', null),
    ('Plaza de la Maestranza', 1996, 11, 'Rajon Fale', '3:29', null),
    ('Plaza de la Maestranza', 1996, 12, 'Palmas al Mayoral', '2:24', null),
    ('Clásico 2', 2000, 1, 'La Quinta Angustia', '5:17', null),
    ('Clásico 2', 2000, 2, 'Jesús Preso', '8:07', null),
    ('Clásico 2', 2000, 3, 'María Santisima del Dulce Nombre', '4:05', null),
    ('Clásico 2', 2000, 4, 'Cristo de la Buena Muerte', '5:07', null),
    ('Clásico 2', 2000, 5, 'Divino Perdón', '5:09', null),
    ('Clásico 2', 2000, 6, 'Sagrada Lanzada', '4:40', null),
    ('Clásico 2', 2000, 7, 'Reina de Todos los Santos', '3:29', null),
    ('Clásico 2', 2000, 8, 'María Santisima de la Caridad', '5:22', null),
    ('Clásico 2', 2000, 9, 'Juan Jesús', '6:50', null),
    ('Clásico 2', 2000, 10, 'Sevilla Cofradiera', '5:25', null),
    ('Clásico 2', 2000, 11, 'Nazareno de Pasión', '4:20', null),
    ('Clásico 2', 2000, 12, 'Saeta Cordobesa', '4:54', null),
    ('Pa Soñar', 1999, 1, 'Medley: Mi Novio Es Alfarero / Con Alegría / Me Case Con un Enano / Pastillas de Jabón', '2:57', null),
    ('Pa Soñar', 1999, 2, 'Medley: María Luisa / Murillo / En la Feria / Alameda', '2:57', null),
    ('Pa Soñar', 1999, 3, 'Medley: Sevilla / La Quise Tener / Mazzantini / El Hijo del Espartero', '2:57', null),
    ('Pa Soñar', 1999, 4, 'Medley: Bombita / Algabeño / Mi Novio Me Dio una Rosa / Lagartijillo', '2:57', null),
    ('Pa Soñar', 1999, 5, 'Medley: Los Siete Niños / Los de Tablada / Pasa una Reina / El Tio del Tambor', '2:38', null),
    ('Pa Soñar', 1999, 6, 'Medley: Se Llama Carmen / Arabesca / Sus Caracoles / Sueña la Margarita', '2:38', null),
    ('Pa Soñar', 1999, 7, 'Medley: Yo Me Pongo Mi Sombrero / Tiene una Cinturita / Acurrucaito / Vente Conmigo', '3:37', null),
    ('Pa Soñar', 1999, 8, 'Churumbelerias', '3:45', null),
    ('Pa Soñar', 1999, 9, 'Suspiros de España', '4:32', null),
    ('Pa Soñar', 1999, 10, 'Opera Flamenca', '3:10', null),
    ('Pa Soñar', 1999, 11, 'Currito de la Macarena', '3:10', null),
    ('Pa Soñar', 1999, 12, 'La Puerta Grande', '3:47', null),
    ('Pa Soñar', 1999, 13, 'Fermin Murillo', '2:58', null),
    ('¡Torero! El alma de la fiesta - Pasodobles taurinos', 1991, 1, 'Toque de Clarines de la Real Maestranza de Sevilla', '0:17', null),
    ('¡Torero! El alma de la fiesta - Pasodobles taurinos', 1991, 2, 'Música, Maestro', '0:28', null),
    ('¡Torero! El alma de la fiesta - Pasodobles taurinos', 1991, 3, 'Curro Romero', '2:43', null),
    ('¡Torero! El alma de la fiesta - Pasodobles taurinos', 1991, 4, 'Ruedos de España', '3:12', null),
    ('¡Torero! El alma de la fiesta - Pasodobles taurinos', 1991, 5, 'Manolete', '3:18', null),
    ('¡Torero! El alma de la fiesta - Pasodobles taurinos', 1991, 6, 'El Juli', '4:58', null),
    ('¡Torero! El alma de la fiesta - Pasodobles taurinos', 1991, 7, 'Agüero', '3:18', null),
    ('¡Torero! El alma de la fiesta - Pasodobles taurinos', 1991, 8, 'Primavera Sevillana', '4:43', null),
    ('¡Torero! El alma de la fiesta - Pasodobles taurinos', 1991, 9, 'Manolo Martin Vazquez', '3:20', null),
    ('¡Torero! El alma de la fiesta - Pasodobles taurinos', 1991, 10, 'Ayamonte', '2:21', null),
    ('¡Torero! El alma de la fiesta - Pasodobles taurinos', 1991, 11, 'Fermin Murillo', '2:58', null),
    ('¡Torero! El alma de la fiesta - Pasodobles taurinos', 1991, 12, 'Miguelito Baez Litri', '3:24', null),
    ('¡Torero! El alma de la fiesta - Pasodobles taurinos', 1991, 13, 'Gallito', '2:59', null),
    ('¡Torero! El alma de la fiesta - Pasodobles taurinos', 1991, 14, 'Espartaco', '4:01', null),
    ('¡Torero! El alma de la fiesta - Pasodobles taurinos', 1991, 15, 'Victor Mendes', '2:04', null),
    ('¡Torero! El alma de la fiesta - Pasodobles taurinos', 1991, 16, 'Sangre de Artista', '5:07', null),
    ('¡Torero! El alma de la fiesta - Pasodobles taurinos', 1991, 17, 'Marcial, Eres el Mas Grande', '4:20', null),
    ('¡Torero! El alma de la fiesta - Pasodobles taurinos', 1991, 18, 'Vito', '2:57', null),
    ('¡Torero! El alma de la fiesta - Pasodobles taurinos', 1991, 19, 'Adiós a Tejera', '3:04', null),
    ('¡Torero! El alma de la fiesta - Pasodobles taurinos', 1991, 20, 'Domingo Ortega', '3:58', null),
    ('¡Torero! El alma de la fiesta - Pasodobles taurinos', 1991, 21, 'Tomas Campuzano', '2:42', null),
    ('¡Torero! El alma de la fiesta - Pasodobles taurinos', 1991, 22, 'Rafi Camino', '3:07', null),
    ('¡Torero! El alma de la fiesta - Pasodobles taurinos', 1991, 23, 'Jabugo', '5:19', null),
    ('¡Torero! El alma de la fiesta - Pasodobles taurinos', 1991, 24, 'Joselito Bienvenida', '2:01', null),
    ('¡Torero! El alma de la fiesta - Pasodobles taurinos', 1991, 25, 'Cielo Andaluz', '3:19', null),
    ('¡Torero! El alma de la fiesta - Pasodobles taurinos', 1991, 26, '¡Viva Manolo Vazquez!', '3:22', null),
    ('¡Torero! El alma de la fiesta - Pasodobles taurinos', 1991, 27, 'Pepe Luis Vargas', '2:47', null),
    ('¡Torero! El alma de la fiesta - Pasodobles taurinos', 1991, 28, 'Pedrin Moreno', '4:01', null),
    ('¡Torero! El alma de la fiesta - Pasodobles taurinos', 1991, 29, 'Curro Duran', '3:16', null),
    ('¡Torero! El alma de la fiesta - Pasodobles taurinos', 1991, 30, 'Pedrito de Portugal', '3:51', null),
    ('Cartel de Lujo', 1991, 1, 'Toque de Clarines de la Real Maestranza de Sevilla', '0:17', null),
    ('Cartel de Lujo', 1991, 2, 'Espartaco', '4:01', null),
    ('Cartel de Lujo', 1991, 3, 'Por Sevillanas', '2:39', null),
    ('Cartel de Lujo', 1991, 4, 'Chiclanera', '4:20', null),
    ('Cartel de Lujo', 1991, 5, 'Marcial, Eres el Mas Grande', '4:20', null),
    ('Cartel de Lujo', 1991, 6, 'Pedrin Moreno', '4:01', null),
    ('Cartel de Lujo', 1991, 7, 'Tomas Campuzano', '2:42', null),
    ('Cartel de Lujo', 1991, 8, 'Pepe Luis Vargas', '2:47', null),
    ('Cartel de Lujo', 1991, 9, 'Agüero', '3:18', null),
    ('Cartel de Lujo', 1991, 10, 'Paquito Chocolatero', '3:05', null),
    ('Cartel de Lujo', 1991, 11, 'Adiós a Tejera', '3:04', null),
    ('Cartel de Lujo', 1991, 12, 'Domingo Ortega', '3:51', null),
    ('Saeta', 1993, 1, 'La Quinta Angustia', '5:16', null),
    ('Saeta', 1993, 2, 'María Santisima de la Candelaria', '3:54', null),
    ('Saeta', 1993, 3, 'La Roda Te Corona', '4:40', null),
    ('Saeta', 1993, 4, 'Seguidilla Sacra', '4:15', null),
    ('Saeta', 1993, 5, 'Encarnacion de la Calzada', '5:07', null),
    ('Saeta', 1993, 6, 'La Saeta', '4:40', null),
    ('Saeta', 1993, 7, 'Coronacion de la Macarena', '3:06', null),
    ('Saeta', 1993, 8, 'Macarena', '4:13', null),
    ('Saeta', 1993, 9, 'Pasa la Virgen Macarena', '3:59', null),
    ('Saeta', 1993, 10, 'Esperanza Macarena', '4:44', null),
    ('Seleccion Antologica de Marchas Procesionales 1', 2005, 1, 'Estrella Sublime', '3:35', null),
    ('Seleccion Antologica de Marchas Procesionales 1', 2005, 2, 'Virgen de la Paz', '5:07', null),
    ('Seleccion Antologica de Marchas Procesionales 1', 2005, 3, 'Corpus Christi', '5:06', null),
    ('Seleccion Antologica de Marchas Procesionales 1', 2005, 4, 'Ntra. Sra. Del Buen Fin', '4:09', null),
    ('Seleccion Antologica de Marchas Procesionales 1', 2005, 5, 'Virgen de las Aguas', '4:47', null),
    ('Seleccion Antologica de Marchas Procesionales 1', 2005, 6, 'Pasa la Virgen Macarena', '3:53', null),
    ('Seleccion Antologica de Marchas Procesionales 1', 2005, 7, 'Rocío', '5:44', null),
    ('Seleccion Antologica de Marchas Procesionales 1', 2005, 8, 'Pasan los Campanilleros', '3:56', null),
    ('Clásico 3', 2000, 1, 'Oracion', '7:56', null),
    ('Clásico 3', 2000, 2, 'Reina del Mar', '4:18', null),
    ('Clásico 3', 2000, 3, 'Descanse en Paz', '5:12', null),
    ('Clásico 3', 2000, 4, 'Virgen de Consolacion', '4:23', null),
    ('Clásico 3', 2000, 5, 'Misericordias', '4:18', null),
    ('Clásico 3', 2000, 6, 'Piedad de la Veracruz', '4:02', null),
    ('Clásico 3', 2000, 7, 'Mater Mea', '6:20', null),
    ('Clásico 3', 2000, 8, 'Jesús Caido', '7:14', null),
    ('Clásico 3', 2000, 9, 'Dulce Corazón de María', '3:27', null),
    ('Clásico 3', 2000, 10, 'Cristo Yacente', '5:40', null)
  ) as track(release_title, release_year, sequence_no, title, duration_text, notes)
  join public.band_releases release
    on release.band_entity_id = v_tejera
   and release.title = track.release_title
   and release.release_year = track.release_year
  on conflict (release_id, sequence_no) do update set
    title = excluded.title,
    duration_text = excluded.duration_text,
    notes = excluded.notes;

  insert into public.band_release_sources (release_id, source_id, scope)
  select
    release.id,
    v_tejera_apple_source,
    'Edición, fecha, carátula, repertorio y duración'
  from public.band_releases release
  where release.band_entity_id = v_tejera
    and v_tejera_apple_source is not null
  on conflict do nothing;

  insert into public.band_release_tracks (
    release_id, sequence_no, title, duration_text
  )
  select
    release.id,
    track.sequence_no,
    track.title,
    track.duration_text
  from (values
    ('Centuria Romana Macarena', 1996, 1, 'Salve Macarena', '5:24'),
    ('Centuria Romana Macarena', 1996, 2, 'Virgen de Guadalupe', '4:05'),
    ('Centuria Romana Macarena', 1996, 3, 'Evocación', '4:17'),
    ('Centuria Romana Macarena', 1996, 4, 'Mi Cristo Cautivo', '4:38'),
    ('Centuria Romana Macarena', 1996, 5, 'Pasión y Muerte', '3:31'),
    ('Centuria Romana Macarena', 1996, 6, 'Cristo del Humilladero', '3:29'),
    ('Centuria Romana Macarena', 1996, 7, 'Mi Madre Macarena', '4:11'),
    ('Centuria Romana Macarena', 1996, 8, 'Cristo de la Salvación', '4:50'),
    ('Centuria Romana Macarena', 1996, 9, 'Carmen', '4:15'),
    ('Centuria Romana Macarena', 1996, 10, 'Llora Sor Angela', '3:50'),
    ('Centuria Romana Macarena', 1996, 11, 'Virgen de los Dolores', '3:37'),
    ('Centuria Romana Macarena', 1996, 12, 'Madre y Señora', '3:19'),
    ('Centuria Romana Macarena', 1996, 13, 'Marcha Real', '1:20'),
    ('Centuria Romana Macarena', 2001, 1, 'Jesús de la Sentencia', '4:26'),
    ('Centuria Romana Macarena', 2001, 2, 'Mi Niña Estrella', '4:35'),
    ('Centuria Romana Macarena', 2001, 3, 'Macarena', '4:23'),
    ('Centuria Romana Macarena', 2001, 4, 'Cristo del Buen Fin', '4:18'),
    ('Centuria Romana Macarena', 2001, 5, 'Esperanza Nuestra', '4:14'),
    ('Centuria Romana Macarena', 2001, 6, 'Mi Cristo Caido', '5:19'),
    ('Centuria Romana Macarena', 2001, 7, 'Soledad de San Pablo', '4:25'),
    ('Centuria Romana Macarena', 2001, 8, 'Una Estrella Pa Tu Corona', '4:34'),
    ('Centuria Romana Macarena', 2001, 9, 'Negaciones de San Pedro', '4:58'),
    ('Centuria Romana Macarena', 2001, 10, 'La Lanzada', '3:59'),
    ('Centuria Romana Macarena', 2001, 11, 'Jesús el Cautivo', '4:14'),
    ('Centuria Romana Macarena', 2005, 1, 'De Alma Macarena', '4:39'),
    ('Centuria Romana Macarena', 2005, 2, 'En Tus Penas', '4:53'),
    ('Centuria Romana Macarena', 2005, 3, 'Bajo Tus Ojos Macarena', '4:23'),
    ('Centuria Romana Macarena', 2005, 4, 'Misericordia Isleña', '4:45'),
    ('Centuria Romana Macarena', 2005, 5, 'Al Costalero de Sevilla', '4:14'),
    ('Centuria Romana Macarena', 2005, 6, 'Comentario', '2:48'),
    ('Centuria Romana Macarena', 2005, 7, 'El Pelao', '0:23'),
    ('Centuria Romana Macarena', 2005, 8, 'A Mi Gran Poder', '4:04'),
    ('Centuria Romana Macarena', 2005, 9, 'Centuria Romana', '1:22'),
    ('Centuria Romana Macarena', 2005, 10, 'Pilatos', '1:35'),
    ('Centuria Romana Macarena', 2005, 11, 'Basílica de la Macarena', '2:01'),
    ('Centuria Romana Macarena', 2005, 12, 'Rosario Macareno', '1:34'),
    ('Centuria Romana Macarena', 2005, 13, 'Abelardo', '2:45'),
    ('Centuria Romana Macarena', 2005, 14, 'Comentario 2', '1:33'),
    ('Centuria Romana Macarena', 2005, 15, 'Marcha Real', '2:34'),
    ('Centuria Romana Macarena', 2005, 16, 'La Sentencia de Cristo', '2:56'),
    ('Centuria Romana Macarena', 2005, 17, 'Cristo del Perdón', '4:48'),
    ('Centuria Romana Macarena', 2005, 18, 'El Cristo de la Sangre', '3:50'),
    ('Centuria Romana Macarena', 2006, 1, 'Penas y Alegrias de Mi Macarena', '4:16'),
    ('Centuria Romana Macarena', 2006, 2, 'Cristo de las Siete Palabras', '3:45'),
    ('Centuria Romana Macarena', 2006, 3, 'A Mi Virgen Macarena', '4:25'),
    ('Centuria Romana Macarena', 2006, 4, 'El Cachorro', '3:26'),
    ('Centuria Romana Macarena', 2006, 5, 'Por Mi Esperanza', '3:59'),
    ('Centuria Romana Macarena', 2006, 6, 'Misericordia', '2:45'),
    ('Centuria Romana Macarena', 2006, 7, 'A Tu Memoria', '4:31'),
    ('Centuria Romana Macarena', 2006, 8, 'Sones de Pureza', '4:10'),
    ('Centuria Romana Macarena', 2006, 9, 'Sentencia de Nuestro Señor Jesucristo', '4:11'),
    ('Evocación, Vol. 1', 2009, 1, 'Santísimo Cristo del Amor', '3:30'),
    ('Evocación, Vol. 1', 2009, 2, 'La Virgen de la Paloma', '3:29'),
    ('Evocación, Vol. 1', 2009, 3, 'La Virgen del Mayor Dolor', '3:03'),
    ('Evocación, Vol. 1', 2009, 4, 'La Expiración', '3:32'),
    ('Evocación, Vol. 1', 2009, 5, 'Santísimo Cristo de la Sangre', '3:37'),
    ('Evocación, Vol. 1', 2009, 6, 'La Soledad', '2:22'),
    ('Evocación, Vol. 1', 2009, 7, 'La Virgen Llora', '3:33'),
    ('Evocación, Vol. 1', 2009, 8, 'La Dolorosa', '2:30'),
    ('Evocación, Vol. 1', 2009, 9, 'Nuestra Señora de la Caridad', '3:13'),
    ('Evocación, Vol. 1', 2009, 10, 'Al Pobre Zaragoza', '3:31'),
    ('Evocación, Vol. 1', 2009, 11, 'La Virgen del Rocío', '4:19'),
    ('Evocación, Vol. 1', 2009, 12, 'Jesús El Rico', '3:09'),
    ('Evocación, Vol. 1', 2009, 13, 'La Virgen de los Dolores', '3:33'),
    ('Evocación, Vol. 1', 2009, 14, 'Nuestra Señora de Consolación y Lágrimas', '3:36'),
    ('Evocación, Vol. 2', 2010, 1, 'La Milagrosa', '3:31'),
    ('Evocación, Vol. 2', 2010, 2, 'La Virgen de la Esperanza', '5:05'),
    ('Evocación, Vol. 2', 2010, 3, 'La Pilarica', '3:18'),
    ('Evocación, Vol. 2', 2010, 4, 'La Virgen de Linarejos', '4:22'),
    ('Evocación, Vol. 2', 2010, 5, 'La Virgen de la Amargura', '5:43'),
    ('Evocación, Vol. 2', 2010, 6, 'El Cristo de la Buena Muerte', '2:33'),
    ('Evocación, Vol. 2', 2010, 7, 'La Virgen de la Paz', '3:54'),
    ('Evocación, Vol. 2', 2010, 8, 'El Cristo del Rescate', '4:25'),
    ('Evocación, Vol. 2', 2010, 9, 'Cautivo', '3:44'),
    ('Evocación, Vol. 2', 2010, 10, 'La Virgen de las Penas', '5:02'),
    ('Evocación, Vol. 2', 2010, 11, 'Evocación', '4:10')
  ) as track(release_title, release_year, sequence_no, title, duration_text)
  join public.band_releases release
    on release.band_entity_id = v_centuria
   and release.title = track.release_title
   and release.release_year = track.release_year
  on conflict (release_id, sequence_no) do update set
    title = excluded.title,
    duration_text = excluded.duration_text;

  insert into public.band_release_sources (release_id, source_id, scope)
  select
    release.id,
    v_centuria_apple_source,
    'Repertorio y duración del álbum histórico'
  from public.band_releases release
  where release.band_entity_id = v_centuria
    and (
      (release.title = 'Centuria Romana Macarena' and release.release_year in (1996, 2001, 2005, 2006))
      or (release.title = 'Evocación, Vol. 1' and release.release_year = 2009)
      or (release.title = 'Evocación, Vol. 2' and release.release_year = 2010)
    )
    and v_centuria_apple_source is not null
  on conflict do nothing;

  insert into public.sources (
    name, url, source_type, author_or_publisher, publication_date, accessed_at, notes
  )
  select
    'Hermandad de la Macarena · nuevo uniforme de la Banda de la Centuria',
    'https://www.hermandaddelamacarena.es/2018/07/firma-del-contrato-para-el-nuevo-uniforme-de-la-banda-de-la-centuria/',
    'official_website',
    'Hermandad de la Macarena',
    date '2018-07-20',
    date '2026-09-01',
    'Contrato con la sastrería de Marisa Ortega y posterior estreno del uniforme en octubre de 2018.'
  where not exists (
    select 1 from public.sources
    where url = 'https://www.hermandaddelamacarena.es/2018/07/firma-del-contrato-para-el-nuevo-uniforme-de-la-banda-de-la-centuria/'
  );

  insert into public.sources (
    name, url, source_type, author_or_publisher, publication_date, accessed_at, notes
  )
  select
    'Hermandad de la Macarena · nuevo escudo de la Banda Centuria',
    'https://www.hermandaddelamacarena.es/2026/02/nuevo-escudo-para-el-uniforme-de-la-banda-centuria-romana-macarena/',
    'official_website',
    'Hermandad de la Macarena',
    date '2026-02-26',
    date '2026-09-01',
    'Presentación del nuevo escudo destinado al uniforme de la formación.'
  where not exists (
    select 1 from public.sources
    where url = 'https://www.hermandaddelamacarena.es/2026/02/nuevo-escudo-para-el-uniforme-de-la-banda-centuria-romana-macarena/'
  );

  select id into v_uniform_source
  from public.sources
  where url = 'https://www.hermandaddelamacarena.es/2018/07/firma-del-contrato-para-el-nuevo-uniforme-de-la-banda-de-la-centuria/'
  order by created_at
  limit 1;

  select id into v_crest_source
  from public.sources
  where url = 'https://www.hermandaddelamacarena.es/2026/02/nuevo-escudo-para-el-uniforme-de-la-banda-centuria-romana-macarena/'
  order by created_at
  limit 1;

  insert into public.entities (entity_type, name, slug, summary, status)
  values (
    'heritage_asset',
    'Uniforme de la Centuria Romana Macarena de 2018',
    'uniforme-centuria-romana-macarena-2018',
    'Uniforme confeccionado por la sastrería de Marisa Ortega y estrenado por la formación en octubre de 2018.',
    'published'
  )
  on conflict (slug) do update set
    name = excluded.name,
    summary = excluded.summary,
    status = excluded.status,
    updated_at = now();

  select id into v_uniform_asset
  from public.entities
  where slug = 'uniforme-centuria-romana-macarena-2018';

  insert into public.heritage_assets (
    entity_id, parent_entity_id, asset_type, description, date_from_text,
    is_current, origin_notes, provenance_text, display_order, is_featured, usage_text
  )
  values (
    v_uniform_asset,
    v_centuria,
    'Uniforme',
    'Uniforme corporativo encargado en 2018 a la sastrería de Marisa Ortega.',
    'Estrenado en octubre de 2018',
    true,
    'Contrato formalizado por la Hermandad de la Macarena en julio de 2018.',
    'Banda de Cornetas y Tambores de la Centuria Romana Macarena',
    10,
    true,
    'Uniformidad oficial de la formación.'
  )
  on conflict (entity_id) do update set
    parent_entity_id = excluded.parent_entity_id,
    asset_type = excluded.asset_type,
    description = excluded.description,
    date_from_text = excluded.date_from_text,
    is_current = excluded.is_current,
    origin_notes = excluded.origin_notes,
    provenance_text = excluded.provenance_text,
    display_order = excluded.display_order,
    is_featured = excluded.is_featured,
    usage_text = excluded.usage_text;

  insert into public.entities (entity_type, name, slug, summary, status)
  values (
    'heritage_asset',
    'Escudo del uniforme de la Centuria Romana Macarena de 2026',
    'escudo-uniforme-centuria-romana-macarena-2026',
    'Nuevo emblema presentado en febrero de 2026 para reforzar la identificación de la Banda con la Hermandad de la Macarena.',
    'published'
  )
  on conflict (slug) do update set
    name = excluded.name,
    summary = excluded.summary,
    status = excluded.status,
    updated_at = now();

  select id into v_crest_asset
  from public.entities
  where slug = 'escudo-uniforme-centuria-romana-macarena-2026';

  insert into public.heritage_assets (
    entity_id, parent_entity_id, asset_type, description, date_from_text,
    is_current, origin_notes, provenance_text, display_order, is_featured, usage_text
  )
  values (
    v_crest_asset,
    v_centuria,
    'Elemento identificativo',
    'Escudo presentado por la Banda Centuria Romana Macarena para su aplicación en el uniforme.',
    'Presentado el 26 de febrero de 2026',
    true,
    'La información oficial anuncia su incorporación al uniforme de la formación.',
    'Hermandad de la Macarena',
    20,
    true,
    'Emblema identificativo del uniforme.'
  )
  on conflict (entity_id) do update set
    parent_entity_id = excluded.parent_entity_id,
    asset_type = excluded.asset_type,
    description = excluded.description,
    date_from_text = excluded.date_from_text,
    is_current = excluded.is_current,
    origin_notes = excluded.origin_notes,
    provenance_text = excluded.provenance_text,
    display_order = excluded.display_order,
    is_featured = excluded.is_featured,
    usage_text = excluded.usage_text;

  insert into public.source_links (source_id, entity_id, scope, notes)
  select source_id, target_id, scope, notes
  from (values
    (v_uniform_source, v_uniform_asset, 'Uniforme de 2018', 'Fuente oficial sobre encargo y estreno de la uniformidad.'),
    (v_uniform_source, v_centuria, 'Patrimonio · uniforme', 'Vincula la uniformidad documentada con la Banda.'),
    (v_crest_source, v_crest_asset, 'Escudo del uniforme de 2026', 'Fuente oficial sobre el nuevo elemento identificativo.'),
    (v_crest_source, v_centuria, 'Patrimonio · escudo del uniforme', 'Vincula el escudo documentado con la Banda.')
  ) as links(source_id, target_id, scope, notes)
  where source_id is not null
    and target_id is not null
    and not exists (
      select 1 from public.source_links existing
      where existing.source_id = links.source_id
        and existing.entity_id = links.target_id
    );

  if (
    select count(*)
    from public.band_releases
    where band_entity_id = v_tejera
      and status = 'published'
  ) <> 28 then
    raise exception 'La discografía de Maestro Tejera no contiene las 28 ediciones auditadas';
  end if;

  if (
    select count(*)
    from public.band_release_tracks track
    join public.band_releases release on release.id = track.release_id
    where release.band_entity_id = v_tejera
  ) <> 351 then
    raise exception 'La discografía de Maestro Tejera no contiene las 351 pistas auditadas';
  end if;

  if (
    select count(*)
    from public.band_release_tracks track
    join public.band_releases release on release.id = track.release_id
    where release.band_entity_id = v_centuria
      and (
        (release.title = 'Centuria Romana Macarena' and release.release_year in (1996, 2001, 2005, 2006))
        or (release.title = 'Evocación, Vol. 1' and release.release_year = 2009)
        or (release.title = 'Evocación, Vol. 2' and release.release_year = 2010)
      )
  ) <> 76 then
    raise exception 'Los seis álbumes históricos de Centuria no contienen las 76 pistas auditadas';
  end if;

  if exists (
    select 1
    from public.band_releases release
    where release.band_entity_id in (v_tejera, v_centuria)
      and release.status = 'published'
      and not exists (
        select 1 from public.band_release_tracks track
        where track.release_id = release.id
      )
  ) then
    raise exception 'Quedan ediciones publicadas del lote sin pistas';
  end if;
end
$$;
