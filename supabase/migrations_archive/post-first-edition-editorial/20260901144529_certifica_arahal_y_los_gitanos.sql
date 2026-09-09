-- Lote editorial · Santa María Magdalena de Arahal + Los Gitanos (formación adulta)
-- Solo DML sobre el modelo First Edition existente.
-- No introduce DDL, RLS ni reescribe migraciones históricas.

do $$
declare
  v_arahal uuid;
  v_gitanos uuid;
begin
  select id into v_arahal
  from public.entities
  where slug = 'agrupacion-musical-santa-maria-magdalena-arahal'
    and entity_type = 'band';

  select id into v_gitanos
  from public.entities
  where slug = 'agrupacion-musical-nuestro-padre-jesus-salud-los-gitanos-sevilla'
    and entity_type = 'band';

  if v_arahal is null or v_gitanos is null then
    raise exception 'No se han encontrado las dos Bandas canónicas del lote';
  end if;

  insert into public.sources (
    name, url, source_type, author_or_publisher, accessed_at, notes
  )
  select source.name, source.url, source.source_type, source.publisher,
         date '2026-09-01', source.notes
  from (values
    ('Sección Musical · Hermandad de Los Gitanos', 'https://www.hermandaddelosgitanos.com/seccion-musical/', 'official_website', 'Hermandad de Los Gitanos', 'Historia institucional y relación de la formación adulta con su Hermandad.'),
    ('Los Gitanos · catálogo Apple Music', 'https://music.apple.com/es/artist/agrupaci%C3%B3n-musical-nuestro-padre-jes%C3%BAs-de-la-salud/202483817', 'music_platform', 'Apple Music', 'Catálogo editorial consultado para ediciones, pistas y duraciones.'),
    ('Concierto Anual Hermandad de Los Gitanos 2024 · Spotify', 'https://open.spotify.com/album/70Xl7zm32LRAorYvZGrYFc', 'music_platform', 'Spotify', 'Edición en directo: carátula, secuencia, títulos y duraciones.'),
    ('Santa María Magdalena de Arahal · historia', 'https://amsantamariamagdalenadearahal.blogspot.com/p/historia.html', 'official_website', 'Agrupación Musical Santa María Magdalena de Arahal', 'Historia y discografía publicadas por la formación.'),
    ('Santa María Magdalena de Arahal · catálogo Spotify', 'https://open.spotify.com/intl-es/artist/4gN1dt6XYZZyLkSVmcBP1J', 'music_platform', 'Spotify', 'Catálogo musical de la formación.'),
    ('La Paz · Santa María Magdalena de Arahal', 'https://open.spotify.com/album/5fmBMGFUtITbkQoCQlZQ4i', 'music_platform', 'Spotify', 'Edición de 1986: secuencia, títulos y duraciones.'),
    ('Penas de Santiago · Los Gitanos', 'https://www.instagram.com/reel/DbiVA8koM_u/', 'official_social', 'Sección Musical de Los Gitanos', 'Actuación documentada tras las Penas de Santiago en 2026.'),
    ('Pasión de Huelva cierra el acompañamiento de Los Gitanos', 'https://huelvatv.com/2026/04/no-renovaran-el-acompanamiento-musical-del-paso-de-pasion-para-martes-santo-2027/', 'news', 'Huelva TV', 'Confirma que la relación no continúa en el Martes Santo de 2027.'),
    ('Nazareno del Amor · fin de acompañamiento de Los Gitanos', 'https://www.instagram.com/losgitanossm/p/DWhndG3COIs/', 'official_social', 'Sección Musical de Los Gitanos', 'La formación comunica el final del acompañamiento tras el Lunes Santo de 2026.'),
    ('Prendimiento de Jerez · acompañamientos 2026', 'https://www.lapasionenjerez.com/actualidad/la-hermandad-del-prendimiento-anuncia-sus-acompanamientos-musicales-para-el-miercoles-santo-de-2026', 'news', 'La Pasión en Jerez', 'Documenta la contratación de Los Gitanos para el Miércoles Santo de 2026.'),
    ('San José Obrero · crónica de cultos 2026', 'https://hermandadsanjoseobrero.es/hermandad/cronica-de-los-solemnes-cultos-en-honor-a-san-jose-obrero/', 'official_website', 'Hermandad de San José Obrero', 'Crónica oficial de la procesión del 3 de mayo de 2026.'),
    ('Esperanza de Arahal · acompañamiento de Santa María Magdalena', 'https://www.facebook.com/MEDIALTELEVISION/videos/procesi%C3%B3n-cristo-de-la-esperanza-de-arahal/187840009519076/', 'news_social', 'Medial TV', 'Registro audiovisual del acompañamiento tras el Cristo de la Esperanza.'),
    ('Hiniesta y Arahal · cincuenta años', 'https://www.diariodesevilla.es/semana_santa/cincuenta-anos-historia-indisoluble-hiniesta_0_2005882019.html', 'news', 'Diario de Sevilla', 'Documenta cincuenta años de vinculación en 2026 y su continuidad.'),
    ('Humillación de Camas · acompañamientos 2026', 'https://www.elpespunte.es/articulo/cofrade/humillacion-camas-firma-mairena-alcor-paso-palio/20251212164156117377.html', 'news', 'El Pespunte', 'Confirma a Santa María Magdalena tras el misterio en 2026.'),
    ('Monte-Sión · Santa María Magdalena de Arahal 2026', 'https://www.instagram.com/hermandaddemontesion/p/DWo8KU2iskJ/', 'official_social', 'Hermandad de Monte-Sión', 'Registro oficial del acompañamiento del Jueves Santo de 2026.'),
    ('San Antonio de Arahal 2026 · archivo audiovisual municipal', 'https://www.youtube.com/playlist?list=UU2X4oSN3RMctiH3Brc8ik1w', 'official_social', 'Ayuntamiento de Arahal', 'El archivo municipal incluye la procesión de San Antonio de Arahal de 2026.'),
    ('San Pablo · acuerdo musical 2025–2027', 'https://jesuscautivoyrescatado.com/acompanamiento-musical-para-la-estacion-de-penitencia/', 'official_website', 'Hermandad de San Pablo', 'Acuerdo oficial por tres años: Arahal en el tramo de ida y Virgen de los Reyes en el regreso.'),
    ('Expiración de Écija · fin de la vinculación con Arahal', 'https://www.gentedepaz.es/la-agrupacion-musical-santa-maria-magdalena-de-arahal-pone-fin-a-su-vinculacion-con-la-hermandad-de-los-estudiantes-de-ecija/', 'news', 'Gente de Paz', 'Confirma el final de la relación tras la Semana Santa de 2026.'),
    ('Resurrección de La Rinconada · cambio de banda para 2027', 'https://www.elpespunte.es/articulo/cofrade/resurreccion-rinconada-cambia-banda-nazareno-algaba-sonara-domingo-resurreccion/20260628195610139501.html', 'news', 'El Pespunte', 'Confirma que Arahal no continúa en el Domingo de Resurrección de 2027.'),
    ('Nazareno de Mairena del Alcor · fin de la vinculación con Arahal', 'https://www.instagram.com/p/DYXct2oDFoN/', 'official_social', 'Hermandad de Nuestro Padre Jesús Nazareno de Mairena del Alcor', 'Comunicación del final de la relación tras la Semana Santa de 2026.')
  ) as source(name, url, source_type, publisher, notes)
  where not exists (
    select 1 from public.sources existing where existing.url = source.url
  );

  insert into public.source_links (source_id, entity_id, scope, notes)
  select source.id, target.entity_id, target.scope, target.notes
  from (values
    ('https://www.hermandaddelosgitanos.com/seccion-musical/', v_gitanos, 'Identidad e historia', 'Historia institucional de la Sección Musical y de la formación adulta.'),
    ('https://music.apple.com/es/artist/agrupaci%C3%B3n-musical-nuestro-padre-jes%C3%BAs-de-la-salud/202483817', v_gitanos, 'Discografía', 'Ediciones y metadatos del catálogo musical.'),
    ('https://amsantamariamagdalenadearahal.blogspot.com/p/historia.html', v_arahal, 'Identidad, historia y discografía', 'Historia y catálogo publicados por la formación.'),
    ('https://open.spotify.com/intl-es/artist/4gN1dt6XYZZyLkSVmcBP1J', v_arahal, 'Discografía', 'Metadatos del catálogo musical.')
  ) as target(url, entity_id, scope, notes)
  join public.sources source on source.url = target.url
  where not exists (
    select 1 from public.source_links existing
    where existing.source_id = source.id and existing.entity_id = target.entity_id
  );

  update public.band_releases release set
    external_url = 'https://music.apple.com/es/album/concierto-anual-hermandad-de-los-gitanos-2024-live/1743283463',
    cover_image_path = 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/f4/07/6f/f4076fda-849b-0089-9728-9135d8e17b59/5063501727802_cover.jpg/1200x1200bb.jpg',
    cover_image_alt = 'Carátula de «Concierto Anual Hermandad de Los Gitanos 2024 (Live)»',
    cover_image_credit = 'Carátula editorial · Apple Music',
    updated_at = now()
  where release.band_entity_id = v_gitanos
    and release.title = 'Concierto Anual Hermandad de Los Gitanos 2024 (Live)'
    and release.release_year = 2024;

  update public.band_releases release set
    external_url = 'https://open.spotify.com/album/5fmBMGFUtITbkQoCQlZQ4i',
    updated_at = now()
  where release.band_entity_id = v_arahal
    and release.title = 'La Paz'
    and release.release_year = 1986;

  insert into public.band_release_tracks (
    release_id, sequence_no, title, duration_text, notes
  )
  select release.id, track.sequence_no, track.title, track.duration_text,
         'Metadatos del catálogo musical consultado el 01/09/2026.'
  from (values
    ('Hágase Tu Voluntad', 1998, 1, 'Señor de la Madrugá', '5:12'),
    ('Hágase Tu Voluntad', 1998, 2, 'Padre Nuestro', '4:39'),
    ('Hágase Tu Voluntad', 1998, 3, 'Comentario 1', '1:14'),
    ('Hágase Tu Voluntad', 1998, 4, 'Perdóname Señor', '4:03'),
    ('Hágase Tu Voluntad', 1998, 5, 'Comentario 2', '1:15'),
    ('Hágase Tu Voluntad', 1998, 6, 'María Santísima de las Angustias', '2:54'),
    ('Hágase Tu Voluntad', 1998, 7, 'Angustias Soberana (Saeta)', '3:02'),
    ('Hágase Tu Voluntad', 1998, 8, 'Nazareno y Gitano', '6:16'),
    ('Hágase Tu Voluntad', 1998, 9, 'Comentario 3', '1:27'),
    ('Hágase Tu Voluntad', 1998, 10, 'La Pasión', '2:24'),
    ('Hágase Tu Voluntad', 1998, 11, 'Jesús de la Divina Misericordia', '4:19'),
    ('Hágase Tu Voluntad', 1998, 12, 'Cometario 4', '1:14'),
    ('Hágase Tu Voluntad', 1998, 13, 'Refúgiame', '3:36'),
    ('Hágase Tu Voluntad', 1998, 14, 'Comentario 5', '0:31'),
    ('Hágase Tu Voluntad', 1998, 15, 'Cristo de los Gitanos', '7:31'),
    ('Hágase Tu Voluntad', 1998, 16, 'Comentario 6', '1:06'),
    ('Hágase Tu Voluntad', 1998, 17, 'Hágase Tu Voluntad (Plegaria al Señor de la Salud)', '2:06'),
    ('Andando y con Sentimiento', 2002, 1, 'Levantá y Salida del Paso de Nuestro Padre Jesús de la Salud: Perdona a Tu Pueblo / Himno Nacional / La Saeta', '8:28'),
    ('Andando y con Sentimiento', 2002, 2, 'Comentario 1', '0:16'),
    ('Andando y con Sentimiento', 2002, 3, 'Paso de Nuestro Padre Jesús de la Salud en la Plaza de San Roman: Señor de Pasión / Bulerías en San Román / La Saeta', '10:56'),
    ('Andando y con Sentimiento', 2002, 4, 'Soleares de Triana (feat. Enrique Garfia Moreno)', '3:46'),
    ('Andando y con Sentimiento', 2002, 5, 'Comentario 2', '0:21'),
    ('Andando y con Sentimiento', 2002, 6, 'Paso de Nuestro Padre Jesús de la Salud ante el Convento de Sor Angela de la Cruz: Triunfal / Al Dios Moreno', '6:22'),
    ('Andando y con Sentimiento', 2002, 7, 'Paso de Palio de María Santísima de las Angustias ante el Convento de Sor Angela de la Cruz: Madre de los Gitanos Coronada', '5:20'),
    ('Andando y con Sentimiento', 2002, 8, 'Manué (feat. Enrique Garfia Moreno)', '3:03'),
    ('Andando y con Sentimiento', 2002, 9, 'Comentario 3', '0:11'),
    ('Andando y con Sentimiento', 2002, 10, 'Entrada en Campana de Nuestro Padre Jesús de la Salud: Perdona a Tu Pueblo / Consuelo Gitano / Virgen de las Angustias / Mi Cristo de Bronce / La Saeta / Al Dios Moreno', '20:44'),
    ('Andando y con Sentimiento', 2002, 11, 'Comentario 4', '0:15'),
    ('Andando y con Sentimiento', 2002, 12, 'Salida de la Catedral del Paso de Nuestro Padre Jesús de la Salud: Himno Nacional / Resucitó', '7:52'),
    ('Andando y con Sentimiento', 2002, 13, 'Comentario 5', '0:16'),
    ('Andando y con Sentimiento', 2002, 14, 'Salida de la Catedral del Paso de Palio de María Santísima de las Angustias: Himno Nacional / Amanecer Gitano', '6:15'),
    ('Andando y con Sentimiento', 2002, 15, 'Al Señor de la Salud (feat. Enrique Garfia Moreno)', '3:30'),
    ('Concierto Anual Hermandad de Los Gitanos 2024 (Live)', 2024, 1, 'Gelem Gelem (Live)', '3:23'),
    ('Concierto Anual Hermandad de Los Gitanos 2024 (Live)', 2024, 2, 'Pasan Los Gitanos (Live)', '3:00'),
    ('Concierto Anual Hermandad de Los Gitanos 2024 (Live)', 2024, 3, 'Bendita tradición (Live)', '3:21'),
    ('Concierto Anual Hermandad de Los Gitanos 2024 (Live)', 2024, 4, 'Hallelujah (Live)', '3:30'),
    ('Concierto Anual Hermandad de Los Gitanos 2024 (Live)', 2024, 5, 'Reo de muerte (Live)', '4:10'),
    ('Concierto Anual Hermandad de Los Gitanos 2024 (Live)', 2024, 6, 'Orando al Padre (Live)', '4:29'),
    ('Concierto Anual Hermandad de Los Gitanos 2024 (Live)', 2024, 7, 'La Cruz de la Pasión (Live)', '3:46'),
    ('Concierto Anual Hermandad de Los Gitanos 2024 (Live)', 2024, 8, 'La Saeta (Live)', '4:04'),
    ('Concierto Anual Hermandad de Los Gitanos 2024 (Live)', 2024, 9, 'Señor de la Madrugá (Live)', '4:49'),
    ('Concierto Anual Hermandad de Los Gitanos 2024 (Live)', 2024, 10, 'Salve, Rey de los Judíos (Live)', '3:47'),
    ('Concierto Anual Hermandad de Los Gitanos 2024 (Live)', 2024, 11, '¡A la verdad! (Live)', '4:03'),
    ('Concierto Anual Hermandad de Los Gitanos 2024 (Live)', 2024, 12, 'Himno Nacional (Live)', '1:04'),
    ('La Paz', 1986, 1, 'Virgen de Araceli', '2:17'),
    ('La Paz', 1986, 2, 'La Pasión', '3:11'),
    ('La Paz', 1986, 3, 'Creo en Jesús', '2:31'),
    ('La Paz', 1986, 4, 'Campanilleros', '3:38'),
    ('La Paz', 1986, 5, 'Cristo de San Julián', '3:34'),
    ('La Paz', 1986, 6, 'Jesús de la Redención', '2:18'),
    ('La Paz', 1986, 7, 'Himno de San Antonio', '3:48'),
    ('La Paz', 1986, 8, 'Santa Cruz', '2:37'),
    ('La Paz', 1986, 9, 'Cristo de las Cinco Llagas', '3:59'),
    ('La Paz', 1986, 10, 'Padre Nuestro', '3:38')
  ) as track(release_title, release_year, sequence_no, title, duration_text)
  join public.band_releases release
    on release.title = track.release_title
   and release.release_year = track.release_year
   and release.band_entity_id = case
     when track.release_title = 'La Paz' then v_arahal else v_gitanos end
  on conflict (release_id, sequence_no) do update set
    title = excluded.title,
    duration_text = excluded.duration_text,
    notes = excluded.notes;

  update public.music_accompaniment_periods period set
    is_current = false,
    year_to = 2026,
    date_to_text = 'Semana Santa de 2026',
    notes = case
      when brotherhood.name = 'Hermandad de Pasión de Huelva'
        then 'Acompañamiento finalizado tras el Martes Santo de 2026; la Hermandad anunció otra formación para 2027.'
      when brotherhood.name = 'Hermandad del Nazareno del Amor de Cádiz'
        then 'Acompañamiento finalizado tras el Lunes Santo de 2026, según comunicación de la formación.'
      else 'Acompañamiento documentado para el Miércoles Santo de 2026; sin continuidad acreditada para 2027.'
    end,
    updated_at = now()
  from public.entities brotherhood
  where period.brotherhood_entity_id = brotherhood.id
    and period.band_entity_id = v_gitanos
    and brotherhood.name in (
      'Hermandad de Pasión de Huelva',
      'Hermandad del Nazareno del Amor de Cádiz',
      'Hermandad del Prendimiento de Jerez'
    );

  update public.music_accompaniment_periods period set
    year_from = 2025,
    date_from_text = 'Desde el Domingo de Ramos de 2025 · documentado en 2026',
    notes = 'Acompañamiento tras el primer paso, documentado en 2025 y 2026.',
    updated_at = now()
  from public.entities brotherhood
  where period.brotherhood_entity_id = brotherhood.id
    and period.band_entity_id = v_gitanos
    and brotherhood.name = 'Hermandad de las Penas de Santiago';

  update public.music_accompaniment_periods period set
    year_from = case brotherhood.name
      when 'Hermandad de la Hiniesta' then 1976
      when 'Hermandad de la Humillación de Camas' then 2024
      when 'Hermandad de Monte-Sión' then 2026
      when 'Hermandad de San Pablo' then 2025
      else period.year_from
    end,
    date_from_text = case brotherhood.name
      when 'Hermandad de la Hiniesta' then 'Desde 1976 · renovado para 2027'
      when 'Hermandad de la Humillación de Camas' then 'Desde el Sábado de Pasión de 2024 · vigente en 2026'
      when 'Hermandad de Monte-Sión' then 'Desde el Jueves Santo de 2026'
      when 'Hermandad de San Pablo' then 'Acuerdo 2025–2027'
      when 'Hermandad de San Antonio de Padua de Arahal' then 'Continuidad histórica · documentada en 2026'
      else period.date_from_text
    end,
    notes = case brotherhood.name
      when 'Hermandad de la Hiniesta' then 'Tras el Santísimo Cristo de la Buena Muerte. Cincuenta años de vinculación en 2026 y continuidad anunciada para 2027.'
      when 'Hermandad de la Humillación de Camas' then 'Tras Nuestro Padre Jesús del Soberano Poder en las Negaciones de San Pedro.'
      when 'Hermandad de Monte-Sión' then 'Tras el Señor de la Oración en el Huerto de Monte-Sión.'
      when 'Hermandad de San Pablo' then 'Primer tramo de la salida dentro del acuerdo 2025–2027; Virgen de los Reyes realiza el regreso.'
      when 'Hermandad de San Antonio de Padua de Arahal' then 'Procesión de San Antonio de Padua de Arahal, documentada en el archivo audiovisual municipal de 2026.'
      else period.notes
    end,
    updated_at = now()
  from public.entities brotherhood
  where period.brotherhood_entity_id = brotherhood.id
    and period.band_entity_id = v_arahal
    and brotherhood.name in (
      'Hermandad de la Hiniesta',
      'Hermandad de la Humillación de Camas',
      'Hermandad de Monte-Sión',
      'Hermandad de San Pablo',
      'Hermandad de San Antonio de Padua de Arahal'
    );

  insert into public.source_links (
    source_id, music_accompaniment_period_id, scope, notes
  )
  select source.id, period.id, 'Acompañamiento musical', mapping.notes
  from (values
    (v_gitanos, 'Hermandad de Los Gitanos de Sevilla', 'https://www.hermandaddelosgitanos.com/seccion-musical/', 'Relación de la formación adulta con su Hermandad de origen.'),
    (v_gitanos, 'Hermandad de las Penas de Santiago', 'https://www.instagram.com/reel/DbiVA8koM_u/', 'Actuación documentada en 2026.'),
    (v_gitanos, 'Hermandad de Pasión de Huelva', 'https://huelvatv.com/2026/04/no-renovaran-el-acompanamiento-musical-del-paso-de-pasion-para-martes-santo-2027/', 'Cierre tras la Semana Santa de 2026.'),
    (v_gitanos, 'Hermandad del Nazareno del Amor de Cádiz', 'https://www.instagram.com/losgitanossm/p/DWhndG3COIs/', 'Cierre tras el Lunes Santo de 2026.'),
    (v_gitanos, 'Hermandad del Prendimiento de Jerez', 'https://www.lapasionenjerez.com/actualidad/la-hermandad-del-prendimiento-anuncia-sus-acompanamientos-musicales-para-el-miercoles-santo-de-2026', 'Acompañamiento específico documentado para 2026.'),
    (v_gitanos, 'Hermandad de San José Obrero', 'https://hermandadsanjoseobrero.es/hermandad/cronica-de-los-solemnes-cultos-en-honor-a-san-jose-obrero/', 'Salida procesional del 3 de mayo de 2026.'),
    (v_arahal, 'Hermandad de la Esperanza de Arahal', 'https://www.facebook.com/MEDIALTELEVISION/videos/procesi%C3%B3n-cristo-de-la-esperanza-de-arahal/187840009519076/', 'Registro audiovisual del acompañamiento.'),
    (v_arahal, 'Hermandad de la Hiniesta', 'https://www.diariodesevilla.es/semana_santa/cincuenta-anos-historia-indisoluble-hiniesta_0_2005882019.html', 'Cincuentenario de la relación en 2026 y continuidad.'),
    (v_arahal, 'Hermandad de la Humillación de Camas', 'https://www.elpespunte.es/articulo/cofrade/humillacion-camas-firma-mairena-alcor-paso-palio/20251212164156117377.html', 'Acompañamiento tras el misterio confirmado para 2026.'),
    (v_arahal, 'Hermandad de Monte-Sión', 'https://www.instagram.com/hermandaddemontesion/p/DWo8KU2iskJ/', 'Acompañamiento del Jueves Santo de 2026.'),
    (v_arahal, 'Hermandad de San Antonio de Padua de Arahal', 'https://www.youtube.com/playlist?list=UU2X4oSN3RMctiH3Brc8ik1w', 'Procesión de San Antonio documentada en 2026.'),
    (v_arahal, 'Hermandad de San Pablo', 'https://jesuscautivoyrescatado.com/acompanamiento-musical-para-la-estacion-de-penitencia/', 'Acuerdo oficial por tres años, de 2025 a 2027.'),
    (v_arahal, 'Hermandad de la Expiración de Écija', 'https://www.gentedepaz.es/la-agrupacion-musical-santa-maria-magdalena-de-arahal-pone-fin-a-su-vinculacion-con-la-hermandad-de-los-estudiantes-de-ecija/', 'Cierre tras la Semana Santa de 2026.'),
    (v_arahal, 'Hermandad de la Resurrección de La Rinconada', 'https://www.elpespunte.es/articulo/cofrade/resurreccion-rinconada-cambia-banda-nazareno-algaba-sonara-domingo-resurreccion/20260628195610139501.html', 'Cambio de formación anunciado para 2027.'),
    (v_arahal, 'Hermandad de Nuestro Padre Jesús Nazareno de Mairena del Alcor', 'https://www.instagram.com/p/DYXct2oDFoN/', 'Cierre tras la Semana Santa de 2026.')
  ) as mapping(band_id, brotherhood_name, source_url, notes)
  join public.entities brotherhood on brotherhood.name = mapping.brotherhood_name
  join public.music_accompaniment_periods period
    on period.band_entity_id = mapping.band_id
   and period.brotherhood_entity_id = brotherhood.id
  join public.sources source on source.url = mapping.source_url
  where not exists (
    select 1 from public.source_links existing
    where existing.source_id = source.id
      and existing.music_accompaniment_period_id = period.id
  );

  if exists (
    select 1
    from public.band_releases release
    left join public.band_release_tracks track on track.release_id = release.id
    where release.band_entity_id in (v_arahal, v_gitanos)
    group by release.id
    having count(track.id) = 0
  ) then
    raise exception 'El lote mantiene ediciones discográficas sin pistas';
  end if;

  if (select count(*) from public.band_release_tracks track
      join public.band_releases release on release.id = track.release_id
      where release.band_entity_id = v_gitanos) <> 97 then
    raise exception 'Los Gitanos no alcanza las 97 pistas certificadas';
  end if;

  if (select count(*) from public.band_release_tracks track
      join public.band_releases release on release.id = track.release_id
      where release.band_entity_id = v_arahal) <> 172 then
    raise exception 'Santa María Magdalena de Arahal no alcanza las 172 pistas certificadas';
  end if;

  if (select count(*) from public.music_accompaniment_periods
      where band_entity_id = v_gitanos and is_current) <> 2 then
    raise exception 'Los Gitanos debe conservar exactamente dos acompañamientos vigentes';
  end if;

  if exists (
    select 1 from public.music_accompaniment_periods period
    where period.band_entity_id in (v_arahal, v_gitanos)
      and not exists (
        select 1 from public.source_links link
        where link.music_accompaniment_period_id = period.id
      )
  ) then
    raise exception 'El lote mantiene acompañamientos sin Fuente';
  end if;

  if not exists (
    select 1 from public.source_links where entity_id = v_arahal
  ) or not exists (
    select 1 from public.source_links where entity_id = v_gitanos
  ) then
    raise exception 'El lote mantiene fichas sin Fuentes de entidad';
  end if;
end
$$;
