-- Lote editorial · Virgen de los Reyes + La Redención
-- Solo DML sobre el modelo First Edition existente.
-- No introduce DDL, tablas, RLS ni cambios de arquitectura.

insert into public.sources (
  name, url, source_type, author_or_publisher, publication_date, accessed_at, notes
)
select d.name, d.url, d.source_type, d.publisher, d.publication_date,
       date '2026-09-02', d.notes
from (values
  ('Virgen de los Reyes · sitio oficial', 'https://www.virgendelosreyes.es/', 'Web oficial', 'Agrupación Musical Virgen de los Reyes', null::date, 'Identidad institucional, enlaces oficiales y actividad de la formación.'),
  ('Virgen de los Reyes · Apple Music', 'https://music.apple.com/es/artist/virgen-de-los-reyes/1600089948', 'Plataforma musical', 'Apple Music', null::date, 'Catálogo digital oficial de la formación.'),
  ('Virgen de los Reyes · El Galileo', 'https://www.youtube.com/watch?v=-sT1TJe1r4U', 'Canal oficial', 'Agrupación Musical Virgen de los Reyes', date '2025-03-13', 'Publicación oficial del estreno de El Galileo.'),
  ('El Galileo · edición digital', 'https://music.apple.com/es/album/el-galileo-en-vivo-estreno-2025-single/1803658843', 'Plataforma musical', 'Apple Music', date '2025-03-13', 'Fecha, carátula, pista y duración de la edición digital.'),
  ('Virgen de los Reyes · Luz de luz', 'https://www.youtube.com/watch?v=HwBIGXMsdiQ', 'Canal oficial', 'Agrupación Musical Virgen de los Reyes', date '2025-03-14', 'Publicación oficial del estreno de Luz de luz.'),
  ('Luz de luz · edición digital', 'https://music.apple.com/es/album/luz-de-luz-en-vivo-estreno-2025-single/1803670700', 'Plataforma musical', 'Apple Music', date '2025-03-14', 'Fecha, carátula, pista y duración de la edición digital.'),
  ('Resurrección · patrimonio musical', 'https://www.hermandaddelaresurreccion.com/musica/', 'Web oficial', 'Hermandad de la Resurrección', null::date, 'Repertorio patrimonial de la Hermandad; documenta Luz de Luz, autor y año.'),
  ('La Redención · sitio oficial', 'https://www.amredencion.com/', 'Web oficial', 'Agrupación Musical Nuestro Padre Jesús de la Redención', null::date, 'Identidad institucional y enlaces oficiales de la formación.'),
  ('La Redención · historia', 'https://www.amredencion.com/historia/', 'Web oficial', 'Agrupación Musical Nuestro Padre Jesús de la Redención', null::date, 'Fundación, evolución institucional, acompañamientos y banderín.'),
  ('La Redención · discografía', 'https://www.amredencion.com/discografia/', 'Web oficial', 'Agrupación Musical Nuestro Padre Jesús de la Redención', null::date, 'Discografía institucional de la formación.'),
  ('La Redención · Apple Music', 'https://music.apple.com/es/artist/agrupaci%C3%B3n-musical-nuestro-padre-jes%C3%BAs-de-la/1534878344', 'Plataforma musical', 'Apple Music', null::date, 'Catálogo digital oficial enlazado desde el sitio de la formación.'),
  ('La Redención · uniforme de 2026', 'https://www.amredencion.com/nueva-piel-para-un-nuevo-legado/', 'Web oficial', 'Agrupación Musical Nuestro Padre Jesús de la Redención', date '2026-02-22', 'Presentación, diseño y confección de la nueva uniformidad.'),
  ('La Redención · fin del acompañamiento de Monte-Sión', 'https://www.diariodesevilla.es/semana_santa/redencion-no-continuara-acompanando-senor_0_2004334802.html', 'Prensa especializada', 'Diario de Sevilla', date '2025-07-10', 'Confirmación del cierre del vínculo musical tras veinte años.'),
  ('La Milagrosa · cambio de bandas', 'https://www.artesacro.org/Noticia/Ver/165260/cambio-bandas-hermandad-milagrosa', 'Prensa especializada', 'Arte Sacro', date '2025-12-02', 'Reproduce la decisión oficial de no renovar el acompañamiento para 2026.')
) as d(name, url, source_type, publisher, publication_date, notes)
where not exists (select 1 from public.sources s where s.url = d.url);

update public.sources
set accessed_at = date '2026-09-02'
where url in (
  'https://www.virgendelosreyes.es/',
  'https://music.apple.com/es/artist/virgen-de-los-reyes/1600089948',
  'https://www.youtube.com/watch?v=-sT1TJe1r4U',
  'https://music.apple.com/es/album/el-galileo-en-vivo-estreno-2025-single/1803658843',
  'https://www.youtube.com/watch?v=HwBIGXMsdiQ',
  'https://music.apple.com/es/album/luz-de-luz-en-vivo-estreno-2025-single/1803670700',
  'https://www.hermandaddelaresurreccion.com/musica/',
  'https://www.amredencion.com/',
  'https://www.amredencion.com/historia/',
  'https://www.amredencion.com/discografia/',
  'https://music.apple.com/es/artist/agrupaci%C3%B3n-musical-nuestro-padre-jes%C3%BAs-de-la/1534878344',
  'https://www.amredencion.com/nueva-piel-para-un-nuevo-legado/',
  'https://www.diariodesevilla.es/semana_santa/redencion-no-continuara-acompanando-senor_0_2004334802.html',
  'https://www.artesacro.org/Noticia/Ver/165260/cambio-bandas-hermandad-milagrosa'
);

do $$
declare
  v_vdr uuid;
  v_redencion uuid;
  v_el_galileo uuid;
  v_luz_de_luz uuid;
  v_banderin_redencion uuid;
  v_uniforme_redencion uuid;
  v_san_pablo uuid;
  v_resurreccion uuid;
  v_source_el_galileo uuid;
  v_source_el_galileo_release uuid;
  v_source_luz_de_luz uuid;
  v_source_luz_de_luz_release uuid;
  v_source_resurreccion uuid;
  v_source_redencion_history uuid;
  v_source_redencion_uniform uuid;
  v_source_monte_sion uuid;
  v_source_milagrosa uuid;
begin
  select id into v_vdr from public.entities
  where slug = 'agrupacion-musical-virgen-de-los-reyes-sevilla' and entity_type = 'band';
  select id into v_redencion from public.entities
  where slug = 'agrupacion-musical-nuestro-padre-jesus-redencion-sevilla' and entity_type = 'band';

  if v_vdr is null or v_redencion is null then
    raise exception 'No se han encontrado las dos Bandas canónicas del lote';
  end if;

  select id into v_san_pablo from public.entities where slug = 'hermandad-de-san-pablo';
  select id into v_resurreccion from public.entities where slug = 'la-resurreccion';
  if v_san_pablo is null or v_resurreccion is null then
    raise exception 'Faltan los nodos canónicos de San Pablo o la Resurrección';
  end if;

  select id into v_source_el_galileo from public.sources
  where url = 'https://www.youtube.com/watch?v=-sT1TJe1r4U' order by created_at limit 1;
  select id into v_source_el_galileo_release from public.sources
  where url = 'https://music.apple.com/es/album/el-galileo-en-vivo-estreno-2025-single/1803658843' order by created_at limit 1;
  select id into v_source_luz_de_luz from public.sources
  where url = 'https://www.youtube.com/watch?v=HwBIGXMsdiQ' order by created_at limit 1;
  select id into v_source_luz_de_luz_release from public.sources
  where url = 'https://music.apple.com/es/album/luz-de-luz-en-vivo-estreno-2025-single/1803670700' order by created_at limit 1;
  select id into v_source_resurreccion from public.sources
  where url = 'https://www.hermandaddelaresurreccion.com/musica/' order by created_at limit 1;
  select id into v_source_redencion_history from public.sources
  where url = 'https://www.amredencion.com/historia/' order by created_at limit 1;
  select id into v_source_redencion_uniform from public.sources
  where url = 'https://www.amredencion.com/nueva-piel-para-un-nuevo-legado/' order by created_at limit 1;
  select id into v_source_monte_sion from public.sources
  where url = 'https://www.diariodesevilla.es/semana_santa/redencion-no-continuara-acompanando-senor_0_2004334802.html' order by created_at limit 1;
  select id into v_source_milagrosa from public.sources
  where url = 'https://www.artesacro.org/Noticia/Ver/165260/cambio-bandas-hermandad-milagrosa' order by created_at limit 1;

  -- Paletas documentales extraídas de los emblemas oficiales existentes.
  update public.bands set
    primary_color = '#85742D',
    secondary_color = '#C6BE9D'
  where entity_id = v_vdr;

  update public.bands set
    primary_color = '#9D055E',
    secondary_color = '#F6E5C4'
  where entity_id = v_redencion;

  insert into public.band_colors (
    band_entity_id, color_name, hex_value, color_role, sort_order, notes, status
  ) values
    (v_vdr, 'Oro viejo', '#85742D', 'primary', 10, 'Color dominante del emblema oficial de la formación.', 'published'),
    (v_vdr, 'Beige dorado', '#C6BE9D', 'secondary', 20, 'Tono secundario del emblema oficial de la formación.', 'published'),
    (v_vdr, 'Blanco', '#FFFFFF', 'accent', 30, 'Acento de contraste del emblema oficial de la formación.', 'published'),
    (v_redencion, 'Morado', '#9D055E', 'primary', 10, 'Color corporativo dominante del emblema y de la uniformidad oficial.', 'published'),
    (v_redencion, 'Marfil', '#F6E5C4', 'secondary', 20, 'Tono secundario del emblema oficial.', 'published'),
    (v_redencion, 'Dorado', '#EDAB00', 'accent', 30, 'Acento del emblema y de los detalles de uniformidad.', 'published')
  on conflict (band_entity_id, color_name) do update set
    hex_value = excluded.hex_value,
    color_role = excluded.color_role,
    sort_order = excluded.sort_order,
    notes = excluded.notes,
    status = excluded.status,
    updated_at = now();

  -- Fuentes directas de ambas entidades. Apple Music se modela como Fuente
  -- porque el enum actual de plataformas sociales no lo admite y este lote no abre DDL.
  insert into public.source_links (source_id, entity_id, scope, notes)
  select s.id, e.id, d.scope, d.notes
  from (values
    ('agrupacion-musical-virgen-de-los-reyes-sevilla', 'https://www.virgendelosreyes.es/', 'Identidad institucional', 'Sitio oficial de la formación.'),
    ('agrupacion-musical-virgen-de-los-reyes-sevilla', 'https://music.apple.com/es/artist/virgen-de-los-reyes/1600089948', 'Catálogo digital', 'Perfil oficial de la formación en Apple Music.'),
    ('agrupacion-musical-nuestro-padre-jesus-redencion-sevilla', 'https://www.amredencion.com/', 'Identidad institucional', 'Sitio oficial de la formación.'),
    ('agrupacion-musical-nuestro-padre-jesus-redencion-sevilla', 'https://www.amredencion.com/historia/', 'Historia institucional', 'Cronología publicada por la propia formación.'),
    ('agrupacion-musical-nuestro-padre-jesus-redencion-sevilla', 'https://www.amredencion.com/discografia/', 'Discografía institucional', 'Catálogo publicado por la propia formación.'),
    ('agrupacion-musical-nuestro-padre-jesus-redencion-sevilla', 'https://music.apple.com/es/artist/agrupaci%C3%B3n-musical-nuestro-padre-jes%C3%BAs-de-la/1534878344', 'Catálogo digital', 'Perfil oficial enlazado desde el sitio de la formación.'),
    ('agrupacion-musical-nuestro-padre-jesus-redencion-sevilla', 'https://www.amredencion.com/nueva-piel-para-un-nuevo-legado/', 'Patrimonio · uniforme', 'Presentación oficial de la nueva uniformidad.')
  ) as d(entity_slug, source_url, scope, notes)
  join public.entities e on e.slug = d.entity_slug
  join public.sources s on s.url = d.source_url
  where not exists (
    select 1 from public.source_links sl
    where sl.source_id = s.id and sl.entity_id = e.id and sl.scope = d.scope
  );

  -- Marchas estrenadas por Virgen de los Reyes en 2025.
  insert into public.entities (entity_type, name, slug, summary, status)
  values
    ('march', 'El Galileo', 'marcha-el-galileo', 'Marcha de agrupación musical estrenada por Virgen de los Reyes el 13 de marzo de 2025 y dedicada al Señor Cautivo y Rescatado de San Pablo.', 'published'),
    ('march', 'Luz de luz', 'marcha-luz-de-luz', 'Marcha de agrupación musical estrenada por Virgen de los Reyes el 14 de marzo de 2025 y dedicada al Señor Resucitado.', 'published')
  on conflict (slug) do update set
    entity_type = excluded.entity_type,
    name = excluded.name,
    summary = excluded.summary,
    status = excluded.status,
    updated_at = now();

  select id into v_el_galileo from public.entities where slug = 'marcha-el-galileo';
  select id into v_luz_de_luz from public.entities where slug = 'marcha-luz-de-luz';

  insert into public.marches (
    entity_id, composition_year, composition_date_text, music_type,
    youtube_video_id, description, premiere_date, premiere_date_text,
    premiered_by_band_entity_id, notes, work_type
  ) values
    (v_el_galileo, 2025, '2025', 'Agrupación Musical', '-sT1TJe1r4U',
     'Marcha procesional de Francisco Javier Cebrero Arias y José María Sánchez Martín, dedicada a Nuestro Padre Jesús Cautivo y Rescatado de la Hermandad de San Pablo.',
     date '2025-03-13', '13 de marzo de 2025', v_vdr,
     'Estreno absoluto documentado por la publicación oficial de la formación.', 'Marcha procesional'),
    (v_luz_de_luz, 2025, '2025', 'Agrupación Musical', 'HwBIGXMsdiQ',
     'Marcha procesional de Alejandro Blanco Hernández, dedicada al Señor Resucitado de la Hermandad de la Resurrección.',
     date '2025-03-14', '14 de marzo de 2025', v_vdr,
     'Estreno absoluto documentado por la publicación oficial de la formación y el repertorio patrimonial de la Hermandad.', 'Marcha procesional')
  on conflict (entity_id) do update set
    composition_year = excluded.composition_year,
    composition_date_text = excluded.composition_date_text,
    music_type = excluded.music_type,
    youtube_video_id = excluded.youtube_video_id,
    description = excluded.description,
    premiere_date = excluded.premiere_date,
    premiere_date_text = excluded.premiere_date_text,
    premiered_by_band_entity_id = excluded.premiered_by_band_entity_id,
    notes = excluded.notes,
    work_type = excluded.work_type;

  insert into public.march_authors (march_entity_id, agent_entity_id, author_role, notes, status)
  select d.march_id, e.id, 'composer', 'Autoría documentada en la publicación del estreno.', 'published'
  from (values
    (v_el_galileo, 'agente-francisco-javier-cebrero-arias'),
    (v_el_galileo, 'agente-jose-maria-sanchez-martin'),
    (v_luz_de_luz, 'agente-alejandro-blanco-hernandez')
  ) as d(march_id, agent_slug)
  join public.entities e on e.slug = d.agent_slug and e.entity_type = 'agent'
  on conflict (march_entity_id, agent_entity_id, author_role) do update set
    notes = excluded.notes,
    status = excluded.status;

  insert into public.march_dedications (
    march_entity_id, dedicatee_entity_id, dedication_type, dedication_text,
    date_from, date_from_text, notes, status
  )
  select d.march_id, d.dedicatee_id, 'dedicated_to', d.dedication_text,
         d.premiere_date, to_char(d.premiere_date, 'DD/MM/YYYY'), d.notes, 'published'
  from (values
    (v_el_galileo, v_san_pablo, 'Nuestro Padre Jesús Cautivo y Rescatado de la Hermandad de San Pablo', date '2025-03-13', 'El nodo relacional es la Hermandad; el texto conserva el titular exacto de la dedicatoria.'),
    (v_luz_de_luz, v_resurreccion, 'Señor Resucitado de la Hermandad de la Resurrección', date '2025-03-14', 'El nodo relacional es la Hermandad; el texto conserva el titular exacto de la dedicatoria.')
  ) as d(march_id, dedicatee_id, dedication_text, premiere_date, notes)
  where not exists (
    select 1 from public.march_dedications md
    where md.march_entity_id = d.march_id
      and md.dedicatee_entity_id = d.dedicatee_id
      and md.dedication_type = 'dedicated_to'
  );

  insert into public.band_premieres (
    band_entity_id, title, composer_name, premiere_year, premiere_date,
    venue_text, municipality_text, video_url, description, source_id,
    status, display_order, march_entity_id
  ) values
    (v_vdr, 'El Galileo', 'Francisco Javier Cebrero Arias y José María Sánchez Martín', 2025,
     date '2025-03-13', 'Parroquia de San Ignacio de Loyola', 'Sevilla',
     'https://www.youtube.com/watch?v=-sT1TJe1r4U',
     'Tipo de novedad: estreno absoluto. Dedicada a Nuestro Padre Jesús Cautivo y Rescatado de la Hermandad de San Pablo.',
     v_source_el_galileo, 'published', 10, v_el_galileo),
    (v_vdr, 'Luz de luz', 'Alejandro Blanco Hernández', 2025,
     date '2025-03-14', 'Iglesia de Santa Marina', 'Sevilla',
     'https://www.youtube.com/watch?v=HwBIGXMsdiQ',
     'Tipo de novedad: estreno absoluto. Dedicada al Señor Resucitado de la Hermandad de la Resurrección.',
     v_source_luz_de_luz, 'published', 20, v_luz_de_luz)
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
    march_entity_id = excluded.march_entity_id;

  insert into public.source_links (source_id, entity_id, scope, notes)
  select d.source_id, d.entity_id, d.scope, d.notes
  from (values
    (v_source_el_galileo, v_el_galileo, 'Estreno y autoría', 'Publicación oficial de la formación.'),
    (v_source_el_galileo_release, v_el_galileo, 'Edición digital', 'Metadatos editoriales de la edición oficial.'),
    (v_source_luz_de_luz, v_luz_de_luz, 'Estreno y autoría', 'Publicación oficial de la formación.'),
    (v_source_luz_de_luz_release, v_luz_de_luz, 'Edición digital', 'Metadatos editoriales de la edición oficial.'),
    (v_source_resurreccion, v_luz_de_luz, 'Dedicatoria y patrimonio musical', 'Fuente oficial de la Hermandad destinataria.')
  ) as d(source_id, entity_id, scope, notes)
  where d.source_id is not null and d.entity_id is not null
    and not exists (
      select 1 from public.source_links sl
      where sl.source_id = d.source_id and sl.entity_id = d.entity_id and sl.scope = d.scope
    );

  insert into public.source_links (source_id, band_premiere_id, scope, notes)
  select bp.source_id, bp.id, 'Estreno absoluto', 'Publicación oficial del estreno.'
  from public.band_premieres bp
  where bp.band_entity_id = v_vdr and bp.premiere_year = 2025
    and bp.title in ('El Galileo', 'Luz de luz') and bp.source_id is not null
    and not exists (
      select 1 from public.source_links sl
      where sl.source_id = bp.source_id and sl.band_premiere_id = bp.id
    );

  -- Singles oficiales asociados a los estrenos y sus pistas.
  insert into public.band_releases (
    band_entity_id, title, release_type, release_year, release_date,
    release_date_text, description, cover_image_path, cover_image_alt,
    cover_image_credit, spotify_url, external_url, status
  ) values
    (v_vdr, 'El Galileo (En Vivo Estreno 2025) - Single', 'single', 2025, date '2025-03-13',
     '13/03/2025', 'Edición digital en directo del estreno de El Galileo.',
     'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/f5/a9/d0/f5a9d0b8-e471-afc8-852e-7dca21165828/5063710366236_cover.jpg/1200x1200bb.jpg',
     'Carátula de «El Galileo (En Vivo Estreno 2025)» de Virgen de los Reyes',
     'Carátula editorial · Apple Music',
     'https://open.spotify.com/track/45CakbZ8XyEjL02TEK58RW',
     'https://music.apple.com/es/album/el-galileo-en-vivo-estreno-2025-single/1803658843', 'published'),
    (v_vdr, 'Luz de luz (En Vivo Estreno 2025) - Single', 'single', 2025, date '2025-03-14',
     '14/03/2025', 'Edición digital en directo del estreno de Luz de luz.',
     'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/29/70/5b/29705bab-d60b-0eae-94b6-5c31a8a0b124/5063710521758_cover.jpg/1200x1200bb.jpg',
     'Carátula de «Luz de luz (En Vivo Estreno 2025)» de Virgen de los Reyes',
     'Carátula editorial · Apple Music',
     'https://open.spotify.com/track/4xhzaqZ2luHRqmdte4xZP2',
     'https://music.apple.com/es/album/luz-de-luz-en-vivo-estreno-2025-single/1803670700', 'published')
  on conflict (band_entity_id, title, release_year) do update set
    release_type = excluded.release_type,
    release_date = excluded.release_date,
    release_date_text = excluded.release_date_text,
    description = excluded.description,
    cover_image_path = excluded.cover_image_path,
    cover_image_alt = excluded.cover_image_alt,
    cover_image_credit = excluded.cover_image_credit,
    spotify_url = excluded.spotify_url,
    external_url = excluded.external_url,
    status = excluded.status,
    updated_at = now();

  insert into public.band_release_tracks (
    release_id, sequence_no, title, march_entity_id, duration_text, spotify_url, notes
  )
  select r.id, 1, d.track_title, d.march_id, d.duration_text, d.spotify_url,
         'Pista única de la edición digital oficial.'
  from (values
    ('El Galileo (En Vivo Estreno 2025) - Single', v_el_galileo, 'El Galileo (En Vivo Estreno 2025)', '3:55', 'https://open.spotify.com/track/45CakbZ8XyEjL02TEK58RW'),
    ('Luz de luz (En Vivo Estreno 2025) - Single', v_luz_de_luz, 'Luz de luz (En Vivo Estreno 2025)', '4:54', 'https://open.spotify.com/track/4xhzaqZ2luHRqmdte4xZP2')
  ) as d(release_title, march_id, track_title, duration_text, spotify_url)
  join public.band_releases r on r.band_entity_id = v_vdr
    and r.title = d.release_title and r.release_year = 2025
  on conflict (release_id, sequence_no) do update set
    title = excluded.title,
    march_entity_id = excluded.march_entity_id,
    duration_text = excluded.duration_text,
    spotify_url = excluded.spotify_url,
    notes = excluded.notes;

  insert into public.band_release_sources (release_id, source_id, scope)
  select r.id, d.source_id, 'Fecha, carátula, pista y duración'
  from (values
    ('El Galileo (En Vivo Estreno 2025) - Single', v_source_el_galileo_release),
    ('Luz de luz (En Vivo Estreno 2025) - Single', v_source_luz_de_luz_release)
  ) as d(release_title, source_id)
  join public.band_releases r on r.band_entity_id = v_vdr
    and r.title = d.release_title and r.release_year = 2025
  where d.source_id is not null
  on conflict (release_id, source_id) do update set scope = excluded.scope;

  -- Patrimonio documentado de La Redención. Se conserva sin imagen al no existir
  -- en este lote un recurso con licencia de reutilización inequívoca.
  insert into public.entities (entity_type, name, slug, summary, status)
  values
    ('heritage_asset', 'Banderín de La Redención de 2011', 'banderin-redencion-2011', 'Banderín actual de la Agrupación Musical Nuestro Padre Jesús de la Redención, bendecido en 2011 y diseñado por José Aguilar.', 'published'),
    ('heritage_asset', 'Uniforme de La Redención de 2026', 'uniforme-redencion-2026', 'Uniformidad presentada en 2026, diseñada por David Cruz y confeccionada por Artebandas.', 'published')
  on conflict (slug) do update set
    entity_type = excluded.entity_type,
    name = excluded.name,
    summary = excluded.summary,
    status = excluded.status,
    updated_at = now();

  select id into v_banderin_redencion from public.entities where slug = 'banderin-redencion-2011';
  select id into v_uniforme_redencion from public.entities where slug = 'uniforme-redencion-2026';

  insert into public.heritage_assets (
    entity_id, parent_entity_id, asset_type, description, date_from,
    date_from_text, is_current, origin_notes, provenance_text,
    display_order, is_featured, usage_text
  ) values
    (v_banderin_redencion, v_redencion, 'Banderín',
     'Banderín corporativo actual, bendecido en 2011 y diseñado por José Aguilar.',
     date '2011-01-01', 'Bendecido en 2011', true,
     'La historia oficial documenta su bendición y autoría de diseño.',
     'Agrupación Musical Nuestro Padre Jesús de la Redención', 10, true,
     'Banderín representativo de la formación.'),
    (v_uniforme_redencion, v_redencion, 'Uniforme',
     'Uniformidad de base morada presentada en 2026, diseñada por David Cruz y confeccionada por Artebandas.',
     date '2026-01-01', 'Presentado en 2026', true,
     'La formación documenta el diseño, la confección y los elementos identificativos.',
     'Agrupación Musical Nuestro Padre Jesús de la Redención', 20, true,
     'Uniformidad oficial de la formación.')
  on conflict (entity_id) do update set
    parent_entity_id = excluded.parent_entity_id,
    asset_type = excluded.asset_type,
    description = excluded.description,
    date_from = excluded.date_from,
    date_from_text = excluded.date_from_text,
    is_current = excluded.is_current,
    origin_notes = excluded.origin_notes,
    provenance_text = excluded.provenance_text,
    display_order = excluded.display_order,
    is_featured = excluded.is_featured,
    usage_text = excluded.usage_text;

  insert into public.source_links (source_id, entity_id, scope, notes)
  select d.source_id, d.entity_id, d.scope, d.notes
  from (values
    (v_source_redencion_history, v_banderin_redencion, 'Banderín actual', 'Fuente oficial sobre bendición y diseño.'),
    (v_source_redencion_uniform, v_uniforme_redencion, 'Uniforme de 2026', 'Fuente oficial sobre diseño y confección.')
  ) as d(source_id, entity_id, scope, notes)
  where d.source_id is not null and d.entity_id is not null
    and not exists (
      select 1 from public.source_links sl
      where sl.source_id = d.source_id and sl.entity_id = d.entity_id and sl.scope = d.scope
    );

  -- Fuentes que faltaban en dos acompañamientos históricos ya modelados.
  insert into public.source_links (
    source_id, music_accompaniment_period_id, scope, notes
  )
  select d.source_id, mp.id, 'Cierre del periodo histórico', d.notes
  from (values
    ('Hermandad de Monte-Sión', v_source_monte_sion, 'La formación confirma la no renovación tras la Semana Santa de 2025.'),
    ('Hermandad de la Milagrosa', v_source_milagrosa, 'La decisión oficial para 2026 confirma el cierre del periodo en 2025.')
  ) as d(brotherhood_name, source_id, notes)
  join public.music_accompaniment_periods mp
    on mp.band_entity_id = v_redencion
   and mp.public_brotherhood_name = d.brotherhood_name
   and mp.year_to = 2025
   and mp.is_current = false
  where d.source_id is not null
    and not exists (
      select 1 from public.source_links sl
      where sl.source_id = d.source_id and sl.music_accompaniment_period_id = mp.id
    );

  -- Postcondiciones del lote y salud mínima del grafo.
  if (select count(*) from public.band_colors where band_entity_id = v_vdr and status = 'published') < 3
     or (select count(*) from public.band_colors where band_entity_id = v_redencion and status = 'published') < 3 then
    raise exception 'Las paletas documentales de las dos Bandas no están completas';
  end if;

  if (select count(*) from public.band_premieres
      where band_entity_id = v_vdr and premiere_year = 2025 and status = 'published'
        and march_entity_id is not null and source_id is not null) < 2 then
    raise exception 'Los dos estrenos 2025 de Virgen de los Reyes no están completos';
  end if;

  if (select count(*) from public.source_links where entity_id = v_redencion) < 5 then
    raise exception 'La Redención no dispone de Fuentes directamente vinculadas suficientes';
  end if;

  if (select count(*) from public.heritage_assets
      where parent_entity_id = v_redencion and is_current) < 2 then
    raise exception 'El patrimonio documentado de La Redención no está completo';
  end if;

  if exists (
    select 1 from public.band_releases r
    where r.band_entity_id = v_vdr and r.status = 'published'
      and (r.cover_image_path is null or r.cover_image_alt is null or r.cover_image_credit is null
           or not exists (select 1 from public.band_release_tracks t where t.release_id = r.id)
           or not exists (select 1 from public.band_release_sources rs where rs.release_id = r.id))
  ) then
    raise exception 'La discografía publicada de Virgen de los Reyes contiene ediciones incompletas';
  end if;

  if exists (
    select 1 from public.music_accompaniment_periods mp
    where mp.band_entity_id = v_redencion
      and mp.public_brotherhood_name in ('Hermandad de Monte-Sión', 'Hermandad de la Milagrosa')
      and mp.year_to = 2025 and mp.is_current = false
      and not exists (
        select 1 from public.source_links sl
        where sl.music_accompaniment_period_id = mp.id
      )
  ) then
    raise exception 'Persisten históricos de La Redención sin Fuente';
  end if;
end $$;
