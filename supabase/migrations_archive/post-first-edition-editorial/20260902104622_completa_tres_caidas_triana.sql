-- Tres Caídas de Triana · cierre documental de identidad, acompañamientos y uniformidad
-- Solo DML sobre el modelo First Edition existente.
-- No introduce DDL, tablas, RLS ni cambios de arquitectura.

insert into public.sources (
  name, url, source_type, author_or_publisher, publication_date, accessed_at, notes
)
select d.name, d.url, d.source_type, d.publisher, d.publication_date,
       date '2026-09-02', d.notes
from (values
  ('Tres Caídas de Triana · historia', 'https://trescaidasdetriana.es/historia/', 'Web oficial', 'Tres Caídas de Triana', null::date, 'Fundación, evolución musical y uniformidad estrenada en 2005.'),
  ('Tres Caídas de Triana · organización', 'https://trescaidasdetriana.es/organizacion/', 'Web oficial', 'Tres Caídas de Triana', null::date, 'Equipo de dirección y organización publicado por la formación.'),
  ('Fin del acompañamiento a San Pablo', 'https://www.diariodesevilla.es/semana_santa/tres-caidas-no-continuara-acompanando_0_2002095158.html', 'Prensa especializada', 'Diario de Sevilla', date '2024-07-29', 'Reproduce el comunicado de la propia banda sobre el cierre de la relación 1992–2024.'),
  ('Tres Caídas de Triana · Apple Music', 'https://music.apple.com/gb/artist/tres-caidas-de-triana/773013427', 'Plataforma musical', 'Apple Music', null::date, 'Perfil oficial, fecha de fundación y catálogo digital de la formación.'),
  ('1980 · estreno 2025', 'https://www.youtube.com/watch?v=LOhtTmTYZBU', 'Canal oficial', 'Tres Caídas de Triana', null::date, 'El canal oficial identifica la interpretación como estreno de 2025.'),
  ('Caridad · Apple Music', 'https://music.apple.com/gb/album/caridad/1321415480', 'Plataforma musical', 'Apple Music', date '2017-12-07', 'Edición digital: doce pistas, publicada por Pasarela.'),
  ('Esperanza · Apple Music', 'https://music.apple.com/gb/album/esperanza/773013377', 'Plataforma musical', 'Apple Music', date '2013-12-07', 'Edición digital: dieciséis pistas, publicada por Pasarela.'),
  ('Esperanza de Triana · Apple Music', 'https://music.apple.com/gb/album/esperanza-de-triana/1679609982', 'Plataforma musical', 'Apple Music', null::date, 'Edición digital del álbum de 1988.'),
  ('Semana Santa en Andalucía · Apple Music', 'https://music.apple.com/gb/album/semana-santa-en-andaluc%C3%ADa/1675283603', 'Plataforma musical', 'Apple Music', null::date, 'Edición digital del primer álbum de la formación.')
) as d(name, url, source_type, publisher, publication_date, notes)
where not exists (select 1 from public.sources s where s.url = d.url);

update public.sources
set accessed_at = date '2026-09-02'
where url in (
  'https://trescaidasdetriana.es/historia/',
  'https://trescaidasdetriana.es/semana-santa/',
  'https://trescaidasdetriana.es/organizacion/',
  'https://www.diariodesevilla.es/semana_santa/tres-caidas-no-continuara-acompanando_0_2002095158.html',
  'https://music.apple.com/gb/artist/tres-caidas-de-triana/773013427',
  'https://www.youtube.com/watch?v=LOhtTmTYZBU',
  'https://music.apple.com/gb/album/caridad/1321415480',
  'https://music.apple.com/gb/album/esperanza/773013377',
  'https://music.apple.com/gb/album/esperanza-de-triana/1679609982',
  'https://music.apple.com/gb/album/semana-santa-en-andaluc%C3%ADa/1675283603'
);

do $$
declare
  v_band uuid;
  v_trinidad uuid;
  v_san_pablo uuid;
  v_uniforme uuid;
  v_source_history uuid;
  v_source_semana_santa uuid;
  v_source_organization uuid;
  v_source_san_pablo uuid;
  v_source_apple uuid;
  v_source_1980 uuid;
  v_source_caridad uuid;
  v_source_esperanza uuid;
  v_source_esperanza_triana uuid;
  v_source_semana_andalucia uuid;
  v_period_trinidad uuid;
  v_period_san_pablo uuid;
begin
  select id into v_band from public.entities
  where slug = 'banda-cornetas-tambores-santisimo-cristo-tres-caidas-sevilla'
    and entity_type = 'band';
  select id into v_trinidad from public.entities
  where slug = 'hermandad-de-la-trinidad-sevilla' and entity_type = 'brotherhood';
  select id into v_san_pablo from public.entities
  where slug = 'hermandad-de-san-pablo' and entity_type = 'brotherhood';

  if v_band is null or v_trinidad is null or v_san_pablo is null then
    raise exception 'Falta una entidad canónica necesaria para Tres Caídas de Triana';
  end if;

  select id into v_source_history from public.sources where url = 'https://trescaidasdetriana.es/historia/' order by created_at limit 1;
  select id into v_source_semana_santa from public.sources where url = 'https://trescaidasdetriana.es/semana-santa/' order by created_at limit 1;
  select id into v_source_organization from public.sources where url = 'https://trescaidasdetriana.es/organizacion/' order by created_at limit 1;
  select id into v_source_san_pablo from public.sources where url = 'https://www.diariodesevilla.es/semana_santa/tres-caidas-no-continuara-acompanando_0_2002095158.html' order by created_at limit 1;
  select id into v_source_apple from public.sources where url = 'https://music.apple.com/gb/artist/tres-caidas-de-triana/773013427' order by created_at limit 1;
  select id into v_source_1980 from public.sources where url = 'https://www.youtube.com/watch?v=LOhtTmTYZBU' order by created_at limit 1;
  select id into v_source_caridad from public.sources where url = 'https://music.apple.com/gb/album/caridad/1321415480' order by created_at limit 1;
  select id into v_source_esperanza from public.sources where url = 'https://music.apple.com/gb/album/esperanza/773013377' order by created_at limit 1;
  select id into v_source_esperanza_triana from public.sources where url = 'https://music.apple.com/gb/album/esperanza-de-triana/1679609982' order by created_at limit 1;
  select id into v_source_semana_andalucia from public.sources where url = 'https://music.apple.com/gb/album/semana-santa-en-andaluc%C3%ADa/1675283603' order by created_at limit 1;

  update public.bands
  set description = 'Fundada en mayo de 1980 por un grupo de hermanos de la Esperanza de Triana, la Banda de Cornetas y Tambores del Santísimo Cristo de las Tres Caídas nació para acompañar a su titular. Tras una primera etapa como agrupación musical, adoptó el estilo de cornetas y tambores y desarrolló una personalidad sonora propia, estrechamente ligada a Triana y a su Hermandad.',
      instagram_url = 'https://www.instagram.com/banda_trescaidasdetriana/'
  where entity_id = v_band;

  insert into public.entity_social_links (entity_id, platform, url, label, display_order, is_public)
  values
    (v_band, 'youtube', 'https://www.youtube.com/bandatrescaidasdetriana', 'YouTube oficial', 20, true),
    (v_band, 'instagram', 'https://www.instagram.com/banda_trescaidasdetriana/', 'Instagram oficial', 30, true),
    (v_band, 'facebook', 'https://www.facebook.com/oficialtrescaidasdetriana/', 'Facebook oficial', 40, true)
  on conflict (entity_id, platform) do update set
    url = excluded.url, label = excluded.label,
    display_order = excluded.display_order, is_public = excluded.is_public,
    updated_at = now();

  insert into public.source_links (source_id, entity_id, scope, notes)
  select d.source_id, d.entity_id, d.scope, d.notes
  from (values
    (v_source_history, v_band, 'Historia institucional', 'Relato publicado por la propia formación.'),
    (v_source_organization, v_band, 'Organización vigente', 'Equipo publicado por la propia formación.'),
    (v_source_apple, v_band, 'Identidad y catálogo digital', 'Perfil oficial de la formación en Apple Music.')
  ) as d(source_id, entity_id, scope, notes)
  where d.source_id is not null and not exists (
    select 1 from public.source_links sl
    where sl.source_id = d.source_id and sl.entity_id = d.entity_id and sl.scope = d.scope
  );

  -- La vigencia y la fuente ya se muestran por separado. Solo conservamos
  -- el contexto que aporta una condición histórica singular.
  update public.music_accompaniment_periods
  set notes = case
        when id = '788fec1a-b0ee-494d-81e1-ef2353de54d2'::uuid
          then 'La banda es Hermana Honoraria de la Hermandad.'
        when id = '404dc862-9ad6-4923-a16e-2a1fe826b19c'::uuid
          then 'Abrió el cortejo el 12 de octubre de 2025; Maestro Tejera acompañó tras la imagen.'
        else null
      end,
      updated_at = now()
  where band_entity_id = v_band;

  insert into public.music_accompaniment_periods (
    brotherhood_entity_id, band_entity_id, step_entity_id, position,
    outing_type, date_from, date_from_text, year_from,
    date_to, date_to_text, year_to, is_current, notes, status,
    public_brotherhood_name, public_step_name, public_brotherhood_slug,
    public_municipality_name, public_municipality_slug, public_province
  )
  select v_trinidad, v_band, null, 'Cruz de Guía',
         'Sábado Santo', date '1987-01-01', '1987', 1987,
         date '1991-12-31', '1991', 1991, false, null, 'published',
         'Hermandad de la Trinidad', 'Cruz de Guía', 'hermandad-de-la-trinidad-sevilla',
         'Sevilla', 'sevilla', 'Sevilla'
  where not exists (
    select 1 from public.music_accompaniment_periods p
    where p.band_entity_id = v_band and p.brotherhood_entity_id = v_trinidad
      and p.year_from = 1987 and p.year_to = 1991
  )
  returning id into v_period_trinidad;

  if v_period_trinidad is null then
    select id into v_period_trinidad from public.music_accompaniment_periods
    where band_entity_id = v_band and brotherhood_entity_id = v_trinidad
      and year_from = 1987 and year_to = 1991 order by created_at limit 1;
  end if;

  insert into public.music_accompaniment_periods (
    brotherhood_entity_id, band_entity_id, step_entity_id, position,
    outing_type, date_from, date_from_text, year_from,
    date_to, date_to_text, year_to, is_current, notes, status,
    public_brotherhood_name, public_step_name, public_brotherhood_slug,
    public_municipality_name, public_municipality_slug, public_province
  )
  select v_san_pablo, v_band, null, 'Tras el paso de misterio',
         'Lunes Santo', date '1992-01-01', '1992', 1992,
         date '2024-12-31', '2024', 2024, false,
         'La primera salida por la feligresía tuvo lugar el 4 de abril de 1992. La banda fue nombrada Hermana Honoraria en 2001 y acompañó la primera estación de penitencia a la Catedral en 2008.',
         'published', 'Hermandad de San Pablo', 'Nuestro Padre Jesús Cautivo y Rescatado',
         'hermandad-de-san-pablo', 'Sevilla', 'sevilla', 'Sevilla'
  where not exists (
    select 1 from public.music_accompaniment_periods p
    where p.band_entity_id = v_band and p.brotherhood_entity_id = v_san_pablo
      and p.year_from = 1992 and p.year_to = 2024
  )
  returning id into v_period_san_pablo;

  if v_period_san_pablo is null then
    select id into v_period_san_pablo from public.music_accompaniment_periods
    where band_entity_id = v_band and brotherhood_entity_id = v_san_pablo
      and year_from = 1992 and year_to = 2024 order by created_at limit 1;
  end if;

  insert into public.source_links (source_id, music_accompaniment_period_id, scope, notes)
  select d.source_id, d.period_id, d.scope, d.notes
  from (values
    (v_source_semana_santa, v_period_trinidad, 'Acompañamiento histórico', 'La web oficial fija el periodo 1987–1991 en la Cruz de Guía.'),
    (v_source_san_pablo, v_period_san_pablo, 'Acompañamiento histórico', 'El comunicado de la banda fija una relación de 32 años, iniciada en 1992 y cerrada en 2024.')
  ) as d(source_id, period_id, scope, notes)
  where d.source_id is not null and d.period_id is not null and not exists (
    select 1 from public.source_links sl
    where sl.source_id = d.source_id and sl.music_accompaniment_period_id = d.period_id
  );

  update public.band_agents
  set date_from_text = null, notes = null
  where band_entity_id = v_band and is_current = true;

  insert into public.source_links (source_id, entity_id, scope, notes)
  select v_source_organization, ba.agent_entity_id, 'Dirección de Tres Caídas de Triana',
         'Responsabilidad publicada en la organización oficial de la banda.'
  from public.band_agents ba
  where ba.band_entity_id = v_band and ba.is_current = true
    and v_source_organization is not null and not exists (
      select 1 from public.source_links sl
      where sl.source_id = v_source_organization
        and sl.entity_id = ba.agent_entity_id
        and sl.scope = 'Dirección de Tres Caídas de Triana'
    );

  insert into public.entities (entity_type, name, slug, summary, status)
  values ('heritage_asset', 'Uniforme de Tres Caídas de Triana de 2005',
          'uniforme-tres-caidas-triana-2005',
          'Uniformidad de inspiración naval estrenada por la banda en enero de 2005.', 'published')
  on conflict (slug) do update set
    entity_type = excluded.entity_type, name = excluded.name,
    summary = excluded.summary, status = excluded.status, updated_at = now();

  select id into v_uniforme from public.entities where slug = 'uniforme-tres-caidas-triana-2005';

  insert into public.heritage_assets (
    entity_id, parent_entity_id, asset_type, description, date_from,
    date_from_text, is_current, origin_notes, provenance_text,
    display_order, is_featured, usage_text
  ) values (
    v_uniforme, v_band, 'Uniforme',
    'Levita inspirada en la uniformidad de los mandos de la Armada española, con gorra de plato blanca, distintivos de antigüedad en la bocamanga y cinturón con los colores de la bandera de España.',
    date '2005-01-01', 'Estrenado en enero de 2005', false,
    'La banda decidió en 2004 sustituir su anterior uniforme azul. El nuevo modelo se presentó en el Palenque de Sevilla.',
    'Banda de Cornetas y Tambores del Santísimo Cristo de las Tres Caídas',
    11, true, 'Uniformidad corporativa estrenada con motivo del XXV aniversario.'
  ) on conflict (entity_id) do update set
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
  select v_source_history, v_uniforme, 'Uniforme de 2005',
         'La historia oficial describe el diseño y sitúa su estreno en enero de 2005.'
  where v_source_history is not null and v_uniforme is not null and not exists (
    select 1 from public.source_links sl
    where sl.source_id = v_source_history and sl.entity_id = v_uniforme
  );

  -- El estreno de 1980 está documentado por el canal oficial, pero la fuente
  -- accesible no permite establecer aún autoría, fecha y lugar. Se conserva
  -- en revisión y no compite con los estrenos públicos ya certificados.
  insert into public.band_premieres (
    band_entity_id, title, composer_name, premiere_year, premiere_date,
    venue_text, municipality_text, video_url, description, source_id,
    status, display_order, march_entity_id
  ) values (
    v_band, '1980', 'Autoría pendiente de documentar', 2025, null,
    null, null, 'https://www.youtube.com/watch?v=LOhtTmTYZBU',
    'El canal oficial identifica esta interpretación como estreno de 2025. Autoría, fecha y lugar continúan en investigación.',
    v_source_1980, 'review', 20, null
  ) on conflict (band_entity_id, title, premiere_year) do update set
    composer_name = excluded.composer_name,
    video_url = excluded.video_url,
    description = excluded.description,
    source_id = excluded.source_id,
    status = excluded.status,
    display_order = excluded.display_order;

  update public.band_premieres
  set description = 'Estreno absoluto ante los titulares de la Hermandad de la Esperanza de Triana.',
      updated_at = now()
  where band_entity_id = v_band and title = 'El Hijo de la Esperanza' and premiere_year = 2026;

  update public.band_releases
  set release_date = case title
        when 'Caridad' then date '2017-12-07'
        when 'Esperanza' then date '2013-12-07'
        else release_date
      end,
      release_date_text = case title
        when 'Caridad' then '7 de diciembre de 2017'
        when 'Esperanza' then '7 de diciembre de 2013'
        else release_date_text
      end,
      description = case title
        when 'Caridad' then 'Álbum de doce pistas publicado por Pasarela.'
        when 'Esperanza' then 'Álbum de dieciséis pistas publicado por Pasarela.'
        else description
      end,
      external_url = case title
        when 'Caridad' then 'https://music.apple.com/gb/album/caridad/1321415480'
        when 'Esperanza' then 'https://music.apple.com/gb/album/esperanza/773013377'
        when 'Esperanza de Triana' then 'https://music.apple.com/gb/album/esperanza-de-triana/1679609982'
        when 'Semana Santa en Andalucía' then 'https://music.apple.com/gb/album/semana-santa-en-andaluc%C3%ADa/1675283603'
        else external_url
      end,
      updated_at = now()
  where band_entity_id = v_band
    and title in ('Caridad', 'Esperanza', 'Esperanza de Triana', 'Semana Santa en Andalucía');

  insert into public.band_release_sources (release_id, source_id, scope)
  select r.id, d.source_id, 'Metadatos editoriales y edición digital'
  from public.band_releases r
  join (values
    ('Caridad', v_source_caridad),
    ('Esperanza', v_source_esperanza),
    ('Esperanza de Triana', v_source_esperanza_triana),
    ('Semana Santa en Andalucía', v_source_semana_andalucia)
  ) as d(title, source_id) on d.title = r.title
  where r.band_entity_id = v_band and d.source_id is not null
  on conflict (release_id, source_id) do update set scope = excluded.scope;
end $$;
