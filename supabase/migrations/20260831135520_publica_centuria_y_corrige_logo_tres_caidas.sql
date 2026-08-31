do $$
declare
  v_band_id uuid;
  v_sevilla_id uuid;
  v_macarena_id uuid;
  v_period_id uuid;
  v_official_source_id uuid;
  v_spotify_source_id uuid;
  v_apple_source_id uuid;
  v_roma_source_id uuid;
  v_tres_caidas_source_id uuid;
begin
  select id into v_sevilla_id
  from public.municipalities
  where slug = 'sevilla';

  select id into v_macarena_id
  from public.entities
  where slug = 'hermandad-de-la-macarena';

  select entity.id into v_band_id
  from public.entities entity
  where entity.entity_type = 'band'
    and (
      entity.slug in ('centuria-romana-macarena', 'banda-centuria-romana-macarena')
      or regexp_replace(lower(trim(entity.name)), '[[:space:]]+', ' ', 'g') = 'centuria romana macarena'
    )
  order by (entity.slug = 'centuria-romana-macarena') desc, entity.created_at
  limit 1;

  if v_band_id is null then
    insert into public.entities (entity_type, name, slug, summary, status)
    values (
      'band',
      'Centuria Romana Macarena',
      'centuria-romana-macarena',
      'Banda de cornetas y tambores integrada en la Centuria Romana de la Hermandad de la Macarena, con trayectoria documentada desde su reorganización de 1897.',
      'published'
    )
    returning id into v_band_id;
  else
    update public.entities
    set
      name = 'Centuria Romana Macarena',
      summary = 'Banda de cornetas y tambores integrada en la Centuria Romana de la Hermandad de la Macarena, con trayectoria documentada desde su reorganización de 1897.',
      status = 'published',
      updated_at = now()
    where id = v_band_id;
  end if;

  insert into public.bands (
    entity_id,
    band_type,
    municipality_id,
    foundation_text,
    website_url,
    description,
    primary_color,
    secondary_color,
    logo_path,
    logo_background_color,
    linked_brotherhood_name,
    headquarters_text
  )
  values (
    v_band_id,
    'Cornetas y Tambores',
    v_sevilla_id,
    'Reorganizada en 1897',
    'https://www.hermandaddelamacarena.es/banda-de-cornetas-y-tambores-de-la-centuria-romana-de-la-hermandad-de-la-macarena/',
    'Formación musical propia de la Hermandad de la Macarena e integrada en su Centuria Romana. La reorganización de 1897 quedó a cargo de Enrique Senra. La banda participa en la estación de penitencia de la Madrugá y desarrolla actividad procesional, formativa y concertística.',
    '#0F6848',
    '#B49A38',
    '/bandas/centuria-romana-macarena/logotipo.jpg',
    '#FFFFFF',
    'Hermandad de la Macarena',
    'Basílica de Santa María de la Esperanza Macarena · Sevilla'
  )
  on conflict (entity_id) do update set
    band_type = excluded.band_type,
    municipality_id = excluded.municipality_id,
    foundation_text = excluded.foundation_text,
    website_url = excluded.website_url,
    description = excluded.description,
    primary_color = excluded.primary_color,
    secondary_color = excluded.secondary_color,
    logo_path = excluded.logo_path,
    logo_background_color = excluded.logo_background_color,
    linked_brotherhood_name = excluded.linked_brotherhood_name,
    headquarters_text = excluded.headquarters_text;

  if not exists (
    select 1 from public.band_names
    where band_entity_id = v_band_id
      and name = 'Banda de Cornetas y Tambores de la Centuria Romana de la Hermandad de la Macarena'
      and name_type = 'official'
  ) then
    insert into public.band_names (band_entity_id, name, short_name, name_type, is_current, notes)
    values (
      v_band_id,
      'Banda de Cornetas y Tambores de la Centuria Romana de la Hermandad de la Macarena',
      'B. C. T. Centuria Romana Macarena',
      'official',
      true,
      'Denominación institucional publicada por la Hermandad de la Macarena.'
    );
  end if;

  if not exists (
    select 1 from public.band_names
    where band_entity_id = v_band_id
      and name = 'Centuria Romana Macarena'
      and name_type = 'popular'
  ) then
    insert into public.band_names (band_entity_id, name, short_name, name_type, is_current)
    values (v_band_id, 'Centuria Romana Macarena', 'Centuria Macarena', 'popular', true);
  end if;

  insert into public.band_colors (
    band_entity_id, color_name, hex_value, color_role, sort_order, notes, status
  ) values
    (v_band_id, 'Verde', '#0F6848', 'primary', 1, 'Tono aproximado extraído del emblema facilitado para la ficha.', 'published'),
    (v_band_id, 'Dorado', '#B49A38', 'secondary', 2, 'Tono aproximado extraído del emblema facilitado para la ficha.', 'published'),
    (v_band_id, 'Blanco', '#FFFFFF', 'accent', 3, 'Fondo y color de contraste del emblema facilitado.', 'published')
  on conflict (band_entity_id, color_name) do update set
    hex_value = excluded.hex_value,
    color_role = excluded.color_role,
    sort_order = excluded.sort_order,
    notes = excluded.notes,
    status = excluded.status,
    updated_at = now();

  insert into public.entity_social_links (entity_id, platform, url, label, display_order, is_public)
  values
    (
      v_band_id,
      'website',
      'https://www.hermandaddelamacarena.es/banda-de-cornetas-y-tambores-de-la-centuria-romana-de-la-hermandad-de-la-macarena/',
      'Web oficial',
      0,
      true
    ),
    (
      v_band_id,
      'spotify',
      'https://open.spotify.com/intl-es/artist/1yPwkFlfYnGsvoJmQfiUeS',
      'Spotify oficial',
      10,
      true
    )
  on conflict (entity_id, platform) do update set
    url = excluded.url,
    label = excluded.label,
    display_order = excluded.display_order,
    is_public = excluded.is_public,
    updated_at = now();

  if v_macarena_id is not null and not exists (
    select 1 from public.entity_relations
    where source_entity_id = v_band_id
      and target_entity_id = v_macarena_id
      and relation_type = 'belongs_to_brotherhood'
      and status = 'published'
  ) then
    insert into public.entity_relations (
      source_entity_id, relation_type, target_entity_id, date_from_text, notes, status
    ) values (
      v_band_id,
      'belongs_to_brotherhood',
      v_macarena_id,
      'Vinculación histórica documentada; reorganización de 1897',
      'Banda propia e integrada en la Centuria Romana de la Hermandad de la Macarena.',
      'published'
    );
  end if;

  if v_macarena_id is not null then
    select id into v_period_id
    from public.music_accompaniment_periods
    where brotherhood_entity_id = v_macarena_id
      and band_entity_id = v_band_id
      and is_current = true
    order by created_at
    limit 1;

    if v_period_id is null then
      insert into public.music_accompaniment_periods (
        brotherhood_entity_id,
        band_entity_id,
        position,
        outing_type,
        date_from_text,
        year_from,
        is_current,
        notes,
        status
      ) values (
        v_macarena_id,
        v_band_id,
        'En el cortejo de la Centuria Romana',
        'Madrugá',
        'Trayectoria histórica; reorganización documentada en 1897',
        1897,
        true,
        'Participación de la banda propia de la Hermandad en la estación de penitencia. El año 1897 documenta la reorganización de la formación y no un contrato musical externo.',
        'published'
      ) returning id into v_period_id;
    end if;
  end if;

  insert into public.sources (name, url, source_type, author_or_publisher, accessed_at, notes)
  select
    'Hermandad de la Macarena · Banda de la Centuria Romana',
    'https://www.hermandaddelamacarena.es/banda-de-cornetas-y-tambores-de-la-centuria-romana-de-la-hermandad-de-la-macarena/',
    'official_website',
    'Hermandad de la Macarena',
    current_date,
    'Fuente oficial para identidad, historia y vinculación institucional.'
  where not exists (
    select 1 from public.sources
    where url = 'https://www.hermandaddelamacarena.es/banda-de-cornetas-y-tambores-de-la-centuria-romana-de-la-hermandad-de-la-macarena/'
  );

  select id into v_official_source_id from public.sources
  where url = 'https://www.hermandaddelamacarena.es/banda-de-cornetas-y-tambores-de-la-centuria-romana-de-la-hermandad-de-la-macarena/'
  order by created_at limit 1;

  insert into public.sources (name, url, source_type, author_or_publisher, accessed_at, notes)
  select
    'Banda Centuria Romana Macarena · Spotify',
    'https://open.spotify.com/intl-es/artist/1yPwkFlfYnGsvoJmQfiUeS',
    'music_platform',
    'Spotify',
    current_date,
    'Perfil musical facilitado para la incorporación de la banda.'
  where not exists (
    select 1 from public.sources
    where url = 'https://open.spotify.com/intl-es/artist/1yPwkFlfYnGsvoJmQfiUeS'
  );

  select id into v_spotify_source_id from public.sources
  where url = 'https://open.spotify.com/intl-es/artist/1yPwkFlfYnGsvoJmQfiUeS'
  order by created_at limit 1;

  insert into public.sources (name, url, source_type, author_or_publisher, accessed_at, notes)
  select
    'Banda Centuria Romana Macarena · catálogo Apple Music',
    'https://music.apple.com/es/artist/banda-centuria-romana-macarena/1445727740',
    'music_platform',
    'Apple Music',
    current_date,
    'Fuente editorial para fechas, tipos de edición y carátulas del catálogo digital.'
  where not exists (
    select 1 from public.sources
    where url = 'https://music.apple.com/es/artist/banda-centuria-romana-macarena/1445727740'
  );

  select id into v_apple_source_id from public.sources
  where url = 'https://music.apple.com/es/artist/banda-centuria-romana-macarena/1445727740'
  order by created_at limit 1;

  insert into public.sources (name, url, source_type, author_or_publisher, accessed_at, notes)
  select
    'Hermandad de la Macarena · CD Roma',
    'https://tienda.hermandaddelamacarena.es/producto/cd-roma-centuria-macarena/',
    'official_store',
    'Hermandad de la Macarena',
    current_date,
    'Fuente oficial para el repertorio y autorías del álbum Roma.'
  where not exists (
    select 1 from public.sources
    where url = 'https://tienda.hermandaddelamacarena.es/producto/cd-roma-centuria-macarena/'
  );

  select id into v_roma_source_id from public.sources
  where url = 'https://tienda.hermandaddelamacarena.es/producto/cd-roma-centuria-macarena/'
  order by created_at limit 1;

  insert into public.source_links (source_id, entity_id, scope, notes)
  select source_id, v_band_id, scope, notes
  from (values
    (v_official_source_id, 'Identidad, historia y vinculación institucional', 'Fuente oficial de la Hermandad.'),
    (v_spotify_source_id, 'Perfil musical y escucha', 'Enlace de artista facilitado para la ficha.'),
    (v_apple_source_id, 'Catálogo discográfico y carátulas', 'Metadatos editoriales del catálogo digital.')
  ) as links(source_id, scope, notes)
  where source_id is not null
    and not exists (
      select 1 from public.source_links existing
      where existing.source_id = links.source_id
        and existing.entity_id = v_band_id
    );

  if v_period_id is not null and v_official_source_id is not null and not exists (
    select 1 from public.source_links
    where source_id = v_official_source_id
      and music_accompaniment_period_id = v_period_id
  ) then
    insert into public.source_links (
      source_id, music_accompaniment_period_id, scope, notes
    ) values (
      v_official_source_id,
      v_period_id,
      'Vinculación y participación en la Madrugá',
      'La fuente oficial documenta la banda como parte de la Centuria Romana de la Hermandad.'
    );
  end if;

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
    v_band_id,
    catalog.title,
    catalog.release_type,
    extract(year from catalog.release_date::date)::integer,
    catalog.release_date::date,
    to_char(catalog.release_date::date, 'DD/MM/YYYY'),
    'Edición digital documentada en el catálogo oficial del artista.',
    catalog.cover_image_path,
    'Carátula de «' || catalog.title || '» de la Centuria Romana Macarena',
    'Carátula editorial · Apple Music',
    catalog.external_url,
    'published'
  from (values
    ('Roma', 'album', '2018-12-05', 'https://is1-ssl.mzstatic.com/image/thumb/Music128/v4/cd/a3/f3/cda3f349-7c8d-4946-52d4-ed9fe2e21e55/artwork.jpg/1200x1200bb.jpg', 'https://music.apple.com/es/album/roma/1445896322?uo=4'),
    ('Híspalis', 'single', '2022-03-18', 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/34/a1/f0/34a1f0b9-c280-5348-39ec-952a307bd2fa/artwork.jpg/1200x1200bb.jpg', 'https://music.apple.com/es/album/h%C3%ADspalis-single/1615126468?uo=4'),
    ('Triunfo de la Fe', 'single', '2024-02-17', 'https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/cf/c0/aa/cfc0aa89-355c-a661-2f5b-8cc4a48d52c6/artwork.jpg/1200x1200bb.jpg', 'https://music.apple.com/es/album/triunfo-de-la-fe-single/1731753457?uo=4'),
    ('IMPERIVM', 'single', '2023-11-25', 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/3e/72/2f/3e722f7a-4913-44d3-9e35-b14f8d806f36/artwork.jpg/1200x1200bb.jpg', 'https://music.apple.com/es/album/imperivm-single/1718379733?uo=4'),
    ('Tambor de Sevilla (En directo)', 'single', '2025-12-07', 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/6e/e3/fb/6ee3fb1f-a722-18db-5bb8-36f06a9bb408/199891129706_cover.jpg/1200x1200bb.jpg', 'https://music.apple.com/es/album/tambor-de-sevilla-en-directo-single/1861474786?uo=4'),
    ('De Híspalis a Roma', 'single', '2023-12-25', 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/81/7d/07/817d07ce-2f52-2926-c9d4-ee28086d6d43/artwork.jpg/1200x1200bb.jpg', 'https://music.apple.com/es/album/de-h%C3%ADspalis-a-roma-single/1723091787?uo=4'),
    ('Rosario', 'single', '2022-11-11', 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/8b/8c/90/8b8c90cc-a176-2865-36b1-bbcb4ab9f66b/artwork.jpg/1200x1200bb.jpg', 'https://music.apple.com/es/album/rosario-single/1654202669?uo=4'),
    ('Cerca de ti, Señor (en directo)', 'single', '2026-03-04', 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/09/5e/51/095e5150-5110-72c4-4607-c27c7fa49c2f/199891893584_cover.jpg/1200x1200bb.jpg', 'https://music.apple.com/es/album/cerca-de-ti-se%C3%B1or-en-directo-single/1882854676?uo=4'),
    ('Desprecio', 'single', '2025-03-16', 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/c2/4c/6c/c24c6cd3-2be2-bb86-aaf0-a65264569595/199257155325_cover.jpg/1200x1200bb.jpg', 'https://music.apple.com/es/album/desprecio-single/1803534195?uo=4'),
    ('Imperivm (Versión piano)', 'single', '2025-08-13', 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/10/67/41/10674115-1f25-490d-a163-77acebeb540a/199502267926_cover.jpg/1200x1200bb.jpg', 'https://music.apple.com/es/album/imperivm-versi%C3%B3n-piano-single/1834961216?uo=4'),
    ('Centuria Romana Macarena', 'album', '2005-01-01', 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/29/60/d4/2960d4a7-fc57-ee1a-86f4-1cfc71187e9f/8429721009635.jpg/1200x1200bb.jpg', 'https://music.apple.com/es/album/centuria-romana-macarena/1738454577?uo=4'),
    ('Centuria Romana Macarena', 'album', '2001-01-01', 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/20/b2/60/20b2604f-540e-3167-775f-2ba02f448404/8429721006795.jpg/1200x1200bb.jpg', 'https://music.apple.com/es/album/centuria-romana-macarena/1738451482?uo=4'),
    ('Cristo del Cerro', 'single', '2025-03-16', 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/4d/0a/2f/4d0a2f55-1837-171b-c073-9d214191e606/199257155417_cover.jpg/1200x1200bb.jpg', 'https://music.apple.com/es/album/cristo-del-cerro-single/1803532812?uo=4'),
    ('María, Luz y Esperanza', 'single', '2022-03-16', 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/78/c7/03/78c70338-bb80-beb9-ade3-034bd43fdd39/artwork.jpg/1200x1200bb.jpg', 'https://music.apple.com/es/album/mar%C3%ADa-luz-y-esperanza-single/1615054802?uo=4'),
    ('Costaleros Macarenos', 'single', '2023-12-25', 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/da/54/3b/da543b7c-d8e1-c1c0-016c-c2191ffcf97b/artwork.jpg/1200x1200bb.jpg', 'https://music.apple.com/es/album/costaleros-macarenos-single/1723116591?uo=4'),
    ('Centuria Romana Macarena', 'album', '2006-01-01', 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/0d/cf/c7/0dcfc7a3-734f-cb35-9b25-1fa737bbe3f9/8429721010372.jpg/1200x1200bb.jpg', 'https://music.apple.com/es/album/centuria-romana-macarena/1738440890?uo=4'),
    ('Híspalis (En directo)', 'single', '2025-12-07', 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/b8/be/29/b8be292e-46fe-013a-29e3-50fe04645d83/199891129676_cover.jpg/1200x1200bb.jpg', 'https://music.apple.com/es/album/h%C3%ADspalis-en-directo-single/1861474373?uo=4'),
    ('Centuria Romana Macarena', 'album', '1996-01-01', 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/d8/9a/d9/d89ad994-0654-0dba-6002-559943ee2719/8429721003312.jpg/1200x1200bb.jpg', 'https://music.apple.com/es/album/centuria-romana-macarena/1738451843?uo=4'),
    ('A la Sevilla Romana', 'single', '2024-03-11', 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/3f/d7/2c/3fd72caf-ac05-3c38-c673-a91f33a9d164/artwork.jpg/1200x1200bb.jpg', 'https://music.apple.com/es/album/a-la-sevilla-romana-single/1735349370?uo=4'),
    ('Eterna, Macarena', 'single', '2024-12-18', 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/03/b7/1d/03b71dd3-995d-710e-db5e-73b757fc27f7/artwork.jpg/1200x1200bb.jpg', 'https://music.apple.com/es/album/eterna-macarena-single/1786488751?uo=4'),
    ('Sentencia en Nazaret', 'single', '2024-01-22', 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/be/0f/15/be0f1566-641c-febb-c380-358488415e42/artwork.jpg/1200x1200bb.jpg', 'https://music.apple.com/es/album/sentencia-en-nazaret-single/1728197262?uo=4'),
    ('Sentenciado', 'single', '2024-01-05', 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/81/ef/e8/81efe8a7-f272-9716-29c1-19a6a1091e53/artwork.jpg/1200x1200bb.jpg', 'https://music.apple.com/es/album/sentenciado-single/1724310265?uo=4'),
    ('A Sentir...', 'single', '2023-03-05', 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/e0/0e/24/e00e24e5-6879-6b47-94b8-ffe3b470ff02/artwork.jpg/1200x1200bb.jpg', 'https://music.apple.com/es/album/a-sentir-single/1675779150?uo=4'),
    ('Evocación, Vol. 1', 'album', '2009-01-01', 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/76/fd/92/76fd92f6-3dfb-b3c5-5291-eed0b98f2a75/8429721011201.jpg/1200x1200bb.jpg', 'https://music.apple.com/es/album/evocaci%C3%B3n-vol-1/1738453298?uo=4'),
    ('Híspalis (versión piano)', 'single', '2025-08-13', 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/63/98/72/6398721c-0b9b-9951-8e37-fe7a81532493/199502267759_cover.jpg/1200x1200bb.jpg', 'https://music.apple.com/es/album/h%C3%ADspalis-versi%C3%B3n-piano-single/1834799877?uo=4'),
    ('Defensión', 'single', '2025-02-28', 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/9d/b3/04/9db304e2-f9a0-3876-c35f-e9b06ff17766/artwork.jpg/1200x1200bb.jpg', 'https://music.apple.com/es/album/defensi%C3%B3n-single/1799550930?uo=4'),
    ('Consuelo', 'single', '2025-02-28', 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/f6/08/04/f6080420-9c30-c428-ff74-b2fa4a7eb76a/artwork.jpg/1200x1200bb.jpg', 'https://music.apple.com/es/album/consuelo-single/1799487704?uo=4'),
    ('La Virgen del Desconsuelo y Visitación', 'single', '2024-01-22', 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/e9/14/ac/e914ac57-3e59-2e92-4f29-473a90cc1eea/artwork.jpg/1200x1200bb.jpg', 'https://music.apple.com/es/album/la-virgen-del-desconsuelo-y-visitaci%C3%B3n-single/1727561362?uo=4'),
    ('Pleitesía, Gitano', 'single', '2023-03-12', 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/98/e6/5b/98e65b2e-0bec-94ce-e490-2f1357195806/artwork.jpg/1200x1200bb.jpg', 'https://music.apple.com/es/album/pleites%C3%ADa-gitano-single/1676794126?uo=4'),
    ('María, Luz y Esperanza (versión piano)', 'single', '2025-08-13', 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/e8/06/e3/e806e3a2-ce9b-1a60-991a-c914d64226d3/199502267582_cover.jpg/1200x1200bb.jpg', 'https://music.apple.com/es/album/mar%C3%ADa-luz-y-esperanza-versi%C3%B3n-piano-single/1834960976?uo=4'),
    ('Triunfo de la fe (Versión piano)', 'single', '2025-08-13', 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/6d/e4/33/6de433cf-3017-bce0-d3a0-e1a6e2b360e5/199502267506_cover.jpg/1200x1200bb.jpg', 'https://music.apple.com/es/album/triunfo-de-la-fe-versi%C3%B3n-piano-single/1834961648?uo=4'),
    ('Desamparo y Abandono', 'single', '2025-03-16', 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/c6/44/ce/c644ce45-6e04-7804-0261-ff07705a98c5/199257155394_cover.jpg/1200x1200bb.jpg', 'https://music.apple.com/es/album/desamparo-y-abandono-single/1803534486?uo=4'),
    ('María, Luz y Esperanza (En directo)', 'single', '2025-12-07', 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/bf/2b/fb/bf2bfb51-c892-6269-db36-905e72a0e55c/199891129720_cover.jpg/1200x1200bb.jpg', 'https://music.apple.com/es/album/mar%C3%ADa-luz-y-esperanza-en-directo-single/1861475443?uo=4'),
    ('A morir por ti (en directo)', 'single', '2026-03-04', 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/e7/b8/1f/e7b81fca-0854-2121-8628-d4d92b09a16d/199891893560_cover.jpg/1200x1200bb.jpg', 'https://music.apple.com/es/album/a-morir-por-ti-en-directo-single/1882853931?uo=4'),
    ('Roma (versión piano)', 'single', '2025-08-13', 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/9b/64/f3/9b64f33d-c565-12a9-e1d1-e21fba777b13/199502267469_cover.jpg/1200x1200bb.jpg', 'https://music.apple.com/es/album/roma-versi%C3%B3n-piano-single/1834960093?uo=4'),
    ('Dios en la tierra', 'single', '2025-11-23', 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/7a/e6/9f/7ae69f43-fd91-d41a-c4bc-0e3f865b17ad/199502981525_cover.jpg/1200x1200bb.jpg', 'https://music.apple.com/es/album/dios-en-la-tierra-single/1853894669?uo=4'),
    ('Eterna, Macarena (versión piano)', 'single', '2025-08-13', 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/4c/12/13/4c1213cc-1c83-b5ac-4836-aaaef7fdd60d/199502267728_cover.jpg/1200x1200bb.jpg', 'https://music.apple.com/es/album/eterna-macarena-versi%C3%B3n-piano-single/1834960952?uo=4'),
    ('Evocación, Vol. 2', 'album', '2010-01-01', 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/1e/ca/a5/1ecaa560-1302-a4b6-bbbb-d49e7aa9c91d/8429721011409.jpg/1200x1200bb.jpg', 'https://music.apple.com/es/album/evocaci%C3%B3n-vol-2/1738449797?uo=4')
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

  update public.band_releases
  set spotify_url = case
    when title = 'Roma' and release_year = 2018 then 'https://open.spotify.com/album/45tpLBu0eXrhvraROlEqke'
    when title = 'Híspalis' and release_year = 2022 then 'https://open.spotify.com/album/4M9SzM8khcyGwd6dDKAovv'
    when title = 'Centuria Romana Macarena' and release_year = 2001 then 'https://open.spotify.com/album/3SZSDyFyLgWdPp0bVR9WOk'
    else spotify_url
  end
  where band_entity_id = v_band_id;

  insert into public.band_release_tracks (release_id, sequence_no, title)
  select release.id, 1, release.title
  from public.band_releases release
  where release.band_entity_id = v_band_id
    and release.release_type = 'single'
  on conflict (release_id, sequence_no) do update set title = excluded.title;

  insert into public.band_release_tracks (release_id, sequence_no, title, notes)
  select release.id, track.sequence_no, track.title, track.notes
  from public.band_releases release
  cross join (values
    (1, 'Llegan los armaos', 'Autor: Javier Hernández Acosta.'),
    (2, 'Roma', 'Autor: Francisco Moraza Cienfuegos.'),
    (3, 'Toma tu Cruz', 'Autor: Francisco Javier Navarro Blanco.'),
    (4, 'Alea Jacta Est', 'Autor: David Moya Díaz.'),
    (5, 'La Esperanza Macarena', 'Autor: Pedro Manuel Pacheco Palomo.'),
    (6, 'Por un Buen Fin', 'Autores: Francisco Moraza Cienfuegos y José Manuel Ortega León.'),
    (7, 'Señor de la Amargura', 'Autor: Sebastián García Moreno.'),
    (8, '¿Por qué te lavas las manos?', 'Autor: Pedro Manuel Pacheco Palomo.'),
    (9, 'Una vida tras de Ti', 'Autor: Francisco Moraza Cienfuegos.'),
    (10, 'Señor de la Sentencia', 'Autor: David Hurtado Torres.'),
    (11, 'Una Rosa en el Cielo', 'Autor: Francisco Moraza Cienfuegos.'),
    (12, 'En tus manos macarenas', 'Autor: Francisco Moraza Cienfuegos.')
  ) as track(sequence_no, title, notes)
  where release.band_entity_id = v_band_id
    and release.title = 'Roma'
    and release.release_year = 2018
  on conflict (release_id, sequence_no) do update set
    title = excluded.title,
    notes = excluded.notes;

  insert into public.band_release_sources (release_id, source_id, scope)
  select release.id, v_apple_source_id, 'Fecha, tipo de edición y carátula'
  from public.band_releases release
  where release.band_entity_id = v_band_id
    and v_apple_source_id is not null
  on conflict do nothing;

  insert into public.band_release_sources (release_id, source_id, scope)
  select release.id, v_roma_source_id, 'Repertorio y autorías del álbum'
  from public.band_releases release
  where release.band_entity_id = v_band_id
    and release.title = 'Roma'
    and release.release_year = 2018
    and v_roma_source_id is not null
  on conflict do nothing;

  update public.bands
  set
    logo_path = '/bandas/tres-caidas-triana/logotipo.png',
    logo_background_color = '#ECEFF1'
  where entity_id = (
    select id from public.entities
    where slug = 'banda-cornetas-tambores-santisimo-cristo-tres-caidas-sevilla'
  );

  update public.bands
  set logo_background_color = '#FFFFFF'
  where entity_id = (
    select id from public.entities
    where slug = 'banda-municipal-musica-mairena-del-alcor'
  )
    and lower(coalesce(logo_path, '')) ~ '\\.(jpe?g)(\\?.*)?$';

  insert into public.sources (name, url, source_type, author_or_publisher, accessed_at, notes)
  select
    'Tres Caídas de Triana · emblema oficial',
    'https://trescaidasdetriana.es/',
    'official_website',
    'Banda de Cornetas y Tambores Tres Caídas de Triana',
    current_date,
    'Procedencia del emblema transparente usado en la cabecera.'
  where not exists (
    select 1 from public.sources where url = 'https://trescaidasdetriana.es/'
  );

  select id into v_tres_caidas_source_id from public.sources
  where url = 'https://trescaidasdetriana.es/'
  order by created_at limit 1;

  if v_tres_caidas_source_id is not null and not exists (
    select 1 from public.source_links link
    where link.source_id = v_tres_caidas_source_id
      and link.entity_id = (
        select id from public.entities
        where slug = 'banda-cornetas-tambores-santisimo-cristo-tres-caidas-sevilla'
      )
  ) then
    insert into public.source_links (source_id, entity_id, scope, notes)
    values (
      v_tres_caidas_source_id,
      (select id from public.entities where slug = 'banda-cornetas-tambores-santisimo-cristo-tres-caidas-sevilla'),
      'Identidad visual',
      'Emblema oficial con transparencia real y fondo de presentación gris neutro.'
    );
  end if;
end
$$;
