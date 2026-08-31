do $$
declare
  v_band_id uuid;
  v_spotify_source_id uuid;
  v_apple_source_id uuid;
begin
  select e.id into v_band_id
  from public.entities e
  where e.entity_type = 'band'
    and (
      e.slug = 'banda-cornetas-tambores-presentacion-al-pueblo-dos-hermanas'
      or regexp_replace(lower(trim(e.name)), '[[:space:]]+', ' ', 'g') = 'presentación al pueblo'
    )
  order by (e.slug = 'banda-cornetas-tambores-presentacion-al-pueblo-dos-hermanas') desc,
           e.created_at
  limit 1;

  if v_band_id is null then
    raise exception 'No se ha encontrado la ficha canónica de Presentación al Pueblo';
  end if;

  update public.bands
  set
    website_url = 'https://presentaciondoshermanas.com/',
    instagram_url = 'https://www.instagram.com/presentacionalpueblo_dh/',
    youtube_url = 'https://www.youtube.com/@Presentaci%C3%B3nalPuebloDH'
  where entity_id = v_band_id;

  insert into public.entity_social_links (
    entity_id, platform, url, label, display_order, is_public
  ) values
    (v_band_id, 'website', 'https://presentaciondoshermanas.com/', 'Web oficial', 0, true),
    (v_band_id, 'instagram', 'https://www.instagram.com/presentacionalpueblo_dh/', 'Instagram oficial', 1, true),
    (v_band_id, 'facebook', 'https://www.facebook.com/profile.php?id=100061828947288', 'Facebook oficial', 2, true),
    (v_band_id, 'x', 'https://x.com/BpresentacionAP', 'X oficial', 3, true),
    (v_band_id, 'youtube', 'https://www.youtube.com/@Presentaci%C3%B3nalPuebloDH', 'YouTube oficial', 4, true),
    (v_band_id, 'spotify', 'https://open.spotify.com/artist/6k5HYSiQmvM2FhkHPPdXJU', 'Spotify oficial', 10, true)
  on conflict (entity_id, platform) do update set
    url = excluded.url,
    label = excluded.label,
    display_order = excluded.display_order,
    is_public = excluded.is_public,
    updated_at = now();

  insert into public.sources (
    name, url, source_type, author_or_publisher, accessed_at, notes
  )
  select
    'Presentación al Pueblo · catálogo Spotify',
    'https://open.spotify.com/artist/6k5HYSiQmvM2FhkHPPdXJU',
    'music_platform',
    'Spotify',
    current_date,
    'Fuente para enlaces de escucha y catálogo digital.'
  where not exists (
    select 1 from public.sources
    where url = 'https://open.spotify.com/artist/6k5HYSiQmvM2FhkHPPdXJU'
  );

  select id into v_spotify_source_id
  from public.sources
  where url = 'https://open.spotify.com/artist/6k5HYSiQmvM2FhkHPPdXJU'
  order by created_at
  limit 1;

  insert into public.sources (
    name, url, source_type, author_or_publisher, accessed_at, notes
  )
  select
    'Presentación al Pueblo · catálogo Apple Music',
    'https://music.apple.com/es/artist/banda-de-cornetas-y-tambores-de-la-presentaci%C3%B3n-al-pueblo/506951357',
    'music_platform',
    'Apple Music',
    current_date,
    'Fuente editorial para fechas, tipos de edición y carátulas del catálogo digital.'
  where not exists (
    select 1 from public.sources
    where url = 'https://music.apple.com/es/artist/banda-de-cornetas-y-tambores-de-la-presentaci%C3%B3n-al-pueblo/506951357'
  );

  select id into v_apple_source_id
  from public.sources
  where url = 'https://music.apple.com/es/artist/banda-de-cornetas-y-tambores-de-la-presentaci%C3%B3n-al-pueblo/506951357'
  order by created_at
  limit 1;

  insert into public.band_releases (
    band_entity_id, title, release_type, release_year, release_date,
    release_date_text, description, cover_image_path, cover_image_alt,
    cover_image_credit, spotify_url, external_url, status
  ) values
    (
      v_band_id,
      'Calle de la Amargura',
      'single',
      2012,
      '2012-11-25',
      '25 de noviembre de 2012',
      'Sencillo digital de una marcha procesional interpretada por Presentación al Pueblo.',
      'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/0d/44/31/0d44310b-6555-2e5c-92e3-9ea820d3d931/5063248584959_cover.jpg/1000x1000bb.jpg',
      'Carátula del sencillo Calle de la Amargura de Presentación al Pueblo',
      'Apple Music',
      'https://open.spotify.com/track/3ydGAvSOTqrBr9BoFOfNBq',
      'https://music.apple.com/us/album/calle-de-la-amargura-single/1675149380',
      'published'
    ),
    (
      v_band_id,
      'Salus Christi',
      'single',
      2014,
      '2014-04-01',
      '1 de abril de 2014',
      'Sencillo digital de una marcha procesional interpretada por Presentación al Pueblo.',
      'https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/f0/cd/04/f0cd04b6-092d-954f-9d99-e980aa386b59/5063212211904_cover.jpg/1000x1000bb.jpg',
      'Carátula del sencillo Salus Christi de Presentación al Pueblo',
      'Apple Music',
      'https://open.spotify.com/track/2cy7ML4YgUMsF9ZjBkSkxJ',
      'https://music.apple.com/us/album/salus-christi/1657738686',
      'published'
    ),
    (
      v_band_id,
      'Mi Dios',
      'single',
      2022,
      '2022-02-18',
      '18 de febrero de 2022',
      'Sencillo digital de una marcha procesional interpretada por Presentación al Pueblo.',
      'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/aa/76/a9/aa76a91b-1b67-a066-0206-45a6b1bcd70e/5063248403120_cover.jpg/1000x1000bb.jpg',
      'Carátula del sencillo Mi Dios de Presentación al Pueblo',
      'Apple Music',
      'https://open.spotify.com/track/0WjYNBTMx77MT2CIjxZIEJ',
      'https://music.apple.com/us/album/mi-dios-single/1677391367',
      'published'
    ),
    (
      v_band_id,
      'Por Siempre, Presentación (En Vivo)',
      'single',
      2022,
      '2022-07-26',
      '26 de julio de 2022',
      'Sencillo digital en directo interpretado por Presentación al Pueblo.',
      'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/d1/34/40/d1344086-ed98-6735-f17b-05b4163d45e4/5063113024382_cover.jpg/1000x1000bb.jpg',
      'Carátula del sencillo Por Siempre, Presentación en vivo',
      'Apple Music',
      'https://open.spotify.com/track/1phJNaZ0n8w3wsJWcyUK94',
      'https://music.apple.com/us/album/por-siempre-presentaci%C3%B3n-en-vivo-single/1679581127',
      'published'
    ),
    (
      v_band_id,
      'En la Noche de Triana',
      'single',
      2023,
      '2023-07-26',
      '26 de julio de 2023',
      'Sencillo digital de una marcha procesional interpretada por Presentación al Pueblo.',
      'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/12/f8/a7/12f8a713-0e66-2ca0-7015-55d1df4a445d/5063341478735_cover.jpg/1000x1000bb.jpg',
      'Carátula del sencillo En la Noche de Triana de Presentación al Pueblo',
      'Apple Music',
      'https://open.spotify.com/track/2RUN4Vrut5jjshR7BZUICz',
      'https://music.apple.com/us/album/en-la-noche-de-triana-single/1701462105',
      'published'
    )
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
    release_id, sequence_no, title, march_entity_id, notes, spotify_url
  )
  select
    r.id,
    1,
    r.title,
    (
      select m.id
      from public.entities m
      where m.entity_type = 'march'
        and lower(trim(m.name)) = lower(trim(r.title))
      order by m.created_at
      limit 1
    ),
    case when r.title = 'Por Siempre, Presentación (En Vivo)'
      then 'Grabación en directo publicada como sencillo digital.'
      else 'Pista única del sencillo digital.'
    end,
    r.spotify_url
  from public.band_releases r
  where r.band_entity_id = v_band_id
    and (r.title, r.release_year) in (
      ('Calle de la Amargura', 2012),
      ('Salus Christi', 2014),
      ('Mi Dios', 2022),
      ('Por Siempre, Presentación (En Vivo)', 2022),
      ('En la Noche de Triana', 2023)
    )
  on conflict (release_id, sequence_no) do update set
    title = excluded.title,
    march_entity_id = excluded.march_entity_id,
    notes = excluded.notes,
    spotify_url = excluded.spotify_url;

  insert into public.band_release_sources (release_id, source_id, scope)
  select r.id, s.source_id, s.scope
  from public.band_releases r
  cross join lateral (
    values
      (v_spotify_source_id, 'Enlace de escucha y catálogo digital'),
      (v_apple_source_id, 'Fecha editorial, tipo de edición y carátula')
  ) as s(source_id, scope)
  where r.band_entity_id = v_band_id
    and (r.title, r.release_year) in (
      ('Calle de la Amargura', 2012),
      ('Salus Christi', 2014),
      ('Mi Dios', 2022),
      ('Por Siempre, Presentación (En Vivo)', 2022),
      ('En la Noche de Triana', 2023)
    )
    and s.source_id is not null
  on conflict (release_id, source_id) do update set
    scope = excluded.scope;
end
$$;
