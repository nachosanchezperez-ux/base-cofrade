-- Segunda auditoría documental de Presentación al Pueblo (31-08-2026).
-- Contenido, relaciones y multimedia oficial dentro del modelo canónico existente.

do $$
declare
  v_band uuid;
  v_santa_ana uuid;
  v_banderin uuid;
  v_history_source uuid;
  v_discography_source uuid;
  v_uniform_source uuid;
  v_banderin_source uuid;
  v_santa_ana_source uuid;
  v_santa_ana_post_source uuid;
  v_recoveries_source uuid;
  v_mi_dios_source uuid;
  v_noche_triana_source uuid;
  v_san_bernardo_source uuid;
  v_para_ti_sevilla_source uuid;
  v_exaltacion_source uuid;
  v_santa_ana_period uuid;
begin
  select id into v_band
  from entities
  where slug = 'banda-cornetas-tambores-presentacion-al-pueblo-dos-hermanas'
    and entity_type = 'band';

  if v_band is null then
    -- Las ramas efímeras pueden carecer de datos editoriales.
    return;
  end if;

  select id into v_history_source from sources
  where url = 'https://presentaciondoshermanas.com/historia-about/'
  order by created_at limit 1;

  select id into v_discography_source from sources
  where url = 'https://presentaciondoshermanas.com/discografia-2/'
  order by created_at limit 1;

  select id into v_uniform_source from sources
  where url = 'https://presentaciondoshermanas.com/uniformidad/'
  order by created_at limit 1;

  -- Identidad visual oficial. Se conserva la transparencia del logotipo.
  update bands
  set logo_path = 'https://presentaciondoshermanas.com/wp-content/uploads/2025/08/logo-banda-sin-fondo-edited.png',
      logo_background_color = null,
      hero_image_path = 'https://presentaciondoshermanas.com/wp-content/uploads/2025/08/SML9415-2048x1365.jpg',
      hero_image_alt = 'La Banda de Cornetas y Tambores Presentación al Pueblo durante una salida procesional.',
      hero_image_credit = 'Santiago Molina · Procedencia: web oficial de Presentación al Pueblo'
  where entity_id = v_band;

  if v_history_source is not null then
    insert into source_links(id, source_id, entity_id, scope, notes)
    select gen_random_uuid(), v_history_source, v_band, 'Identidad visual oficial',
      'Fuente del hero y de su crédito fotográfico; consultada el 31-08-2026.'
    where not exists (
      select 1 from source_links
      where source_id = v_history_source and entity_id = v_band
        and scope = 'Identidad visual oficial'
    );
  end if;

  -- Fotografías oficiales para los elementos de uniformidad ya documentados.
  update heritage_assets
  set public_image_path = 'https://presentaciondoshermanas.com/wp-content/uploads/2025/08/image00010-scaled.jpg',
      public_image_alt = 'Componentes de Presentación al Pueblo con el uniforme de verano estrenado en 2026.',
      public_image_credit = 'Procedencia: web oficial de Presentación al Pueblo'
  where entity_id = (
    select id from entities
    where slug = 'uniforme-verano-2026-presentacion-al-pueblo-dos-hermanas'
  );

  update heritage_assets
  set public_image_path = 'https://presentaciondoshermanas.com/wp-content/uploads/2025/08/image00080-819x1024.jpeg',
      public_image_alt = 'Detalle de los mantolines de batería de terciopelo azul noche y bordado dorado.',
      public_image_credit = 'Procedencia: web oficial de Presentación al Pueblo'
  where entity_id = (
    select id from entities
    where slug = 'mantolines-bateria-2025-presentacion-al-pueblo-dos-hermanas'
  );

  -- Banderín e intervenciones documentadas por la propia formación.
  insert into sources(id, name, url, source_type, author_or_publisher, publication_date, accessed_at, notes)
  select gen_random_uuid(), 'Presentación al Pueblo · restauración del banderín',
    'https://www.instagram.com/p/C4kdaMui6PZ/', 'Red social oficial',
    'Presentación al Pueblo', date '2024-03-16', date '2026-08-31',
    'Publicación oficial con autoría del busto y responsables de la restauración de 2024.'
  where not exists (select 1 from sources where url = 'https://www.instagram.com/p/C4kdaMui6PZ/');

  select id into v_banderin_source from sources
  where url = 'https://www.instagram.com/p/C4kdaMui6PZ/'
  order by created_at limit 1;

  insert into entities(id, entity_type, name, slug, summary, status)
  select gen_random_uuid(), 'heritage_asset', 'Banderín de Presentación al Pueblo',
    'banderin-presentacion-al-pueblo-dos-hermanas',
    'Insignia corporativa con busto de Nuestro Padre Jesús en la Presentación al Pueblo.',
    'published'
  where not exists (
    select 1 from entities
    where slug = 'banderin-presentacion-al-pueblo-dos-hermanas'
  );

  select id into v_banderin from entities
  where slug = 'banderin-presentacion-al-pueblo-dos-hermanas'
  order by created_at limit 1;

  insert into heritage_assets(
    entity_id, parent_entity_id, asset_type, description, current_condition,
    date_from_text, is_current, origin_notes, technique, materials, iconography,
    historical_context, provenance_text, display_order, is_featured, usage_text
  )
  select v_banderin, v_band, 'Banderín',
    'Banderín corporativo sobre tisú blanco, con bordado en oro y un busto policromado de Nuestro Padre Jesús en la Presentación al Pueblo. El interior es de moaré blanco.',
    'Restaurado y estabilizado en marzo de 2024.',
    'Fecha original no documentada · restaurado en marzo de 2024', true,
    'La fecha original y la autoría del diseño general permanecen pendientes de documentación.',
    'Bordado en oro, escultura y policromía',
    'Tisú blanco, bordado en oro, moaré blanco y busto policromado',
    'Busto de Nuestro Padre Jesús en la Presentación al Pueblo',
    'La intervención de 2024 trasladó el bordado a nuevo tisú, reparó y enriqueció las piezas y estabilizó el busto.',
    'Banda de Cornetas y Tambores Nuestro Padre Jesús en la Presentación al Pueblo',
    30, true, 'Insignia representativa de la formación.'
  where v_banderin is not null
    and not exists (select 1 from heritage_assets where entity_id = v_banderin);

  update bands set banderin_entity_id = v_banderin where entity_id = v_band;

  create temporary table hc_phase2_agents(name text, slug text, summary text, description text) on commit drop;
  insert into hc_phase2_agents values
    ('Manuel Ortega', 'manuel-ortega',
      'Autor del busto de Cristo integrado en el banderín de Presentación al Pueblo.',
      'Autoría patrimonial documentada por la formación; identidad biográfica pendiente de ampliación.'),
    ('Ginés de Paula', 'gines-de-paula',
      'Responsable de la limpieza y policromía del busto del banderín en 2024.',
      'Interviniente patrimonial documentado por Presentación al Pueblo.'),
    ('Juan Rispo', 'juan-rispo',
      'Responsable de la restauración del bordado y la estructura del banderín en 2024.',
      'Interviniente patrimonial documentado por Presentación al Pueblo.'),
    ('Víctor Ramírez Pérez', 'victor-ramirez-perez',
      'Compositor vinculado al repertorio de Presentación al Pueblo.',
      'Autor musical documentado en la discografía oficial y por la Hermandad de San Bernardo.'),
    ('Francisco Artíguez', 'francisco-artiguez',
      'Compositor de Plegaria a San Bernardo junto a Víctor Ramírez Pérez.',
      'Autor musical documentado por la Hermandad de San Bernardo.'),
    ('José Manuel Delgado Barroso', 'jose-manuel-delgado-barroso',
      'Compositor vinculado al repertorio de Presentación al Pueblo.',
      'Autor musical identificado mediante fuentes discográficas contrastadas.'),
    ('José Manuel Moreno Cebador', 'jose-manuel-moreno-cebador',
      'Compositor de la marcha Yacente.',
      'Autor musical identificado mediante fuentes discográficas contrastadas.');

  insert into entities(id, entity_type, name, slug, summary, status)
  select gen_random_uuid(), 'agent', a.name, a.slug, a.summary, 'published'
  from hc_phase2_agents a
  where not exists (
    select 1 from entities e
    where e.entity_type = 'agent'
      and (
        e.slug = a.slug or
        lower(regexp_replace(translate(e.name,'ÁÉÍÓÚÜÑáéíóúüñ','AEIOUUNaeiouun'),'[^a-zA-Z0-9]+','','g')) =
        lower(regexp_replace(translate(a.name,'ÁÉÍÓÚÜÑáéíóúüñ','AEIOUUNaeiouun'),'[^a-zA-Z0-9]+','','g'))
      )
  );

  insert into agents(entity_id, agent_kind, description)
  select e.id, 'person', a.description
  from hc_phase2_agents a
  join entities e on e.slug = a.slug
  where not exists (select 1 from agents x where x.entity_id = e.id);

  insert into agent_names(id, agent_entity_id, name, name_type, is_current)
  select gen_random_uuid(), e.id, e.name, 'official', true
  from hc_phase2_agents a
  join entities e on e.slug = a.slug
  where not exists (
    select 1 from agent_names n
    where n.agent_entity_id = e.id and lower(n.name) = lower(e.name)
  );

  insert into heritage_interventions(
    id, target_entity_id, agent_entity_id, discipline, element_name,
    intervention_type, date_from_text, description, status
  )
  select gen_random_uuid(), v_banderin, e.id, 'Escultura', 'Busto de Nuestro Padre Jesús en la Presentación al Pueblo',
    'Autoría original', 'Fecha no documentada',
    'Autor del busto incorporado al banderín, según la publicación oficial de la formación.', 'published'
  from entities e where e.slug = 'manuel-ortega'
    and not exists (
      select 1 from heritage_interventions i
      where i.target_entity_id = v_banderin and i.agent_entity_id = e.id
        and i.intervention_type = 'Autoría original'
    );

  insert into heritage_interventions(
    id, target_entity_id, agent_entity_id, discipline, element_name,
    intervention_type, date_from_text, description, status
  )
  select gen_random_uuid(), v_banderin, e.id, 'Restauración y policromía', 'Busto de Nuestro Padre Jesús en la Presentación al Pueblo',
    'Limpieza y policromía', 'Antes del 16 de marzo de 2024',
    'Limpieza del busto y nueva policromía sobre estuco para recuperar su color original.', 'published'
  from entities e where e.slug = 'gines-de-paula'
    and not exists (
      select 1 from heritage_interventions i
      where i.target_entity_id = v_banderin and i.agent_entity_id = e.id
        and i.intervention_type = 'Limpieza y policromía'
    );

  insert into heritage_interventions(
    id, target_entity_id, agent_entity_id, discipline, element_name,
    intervention_type, date_from_text, description, status
  )
  select gen_random_uuid(), v_banderin, e.id, 'Bordado y restauración', 'Bordado, soporte e interior del banderín',
    'Restauración y estabilización', 'Antes del 16 de marzo de 2024',
    'Traslado del bordado a nuevo tisú blanco conservando el diseño, limpieza y reparación de piezas, enriquecimiento del oro, nueva estructura de sujeción del busto y nuevo interior de moaré blanco.', 'published'
  from entities e where e.slug = 'juan-rispo'
    and not exists (
      select 1 from heritage_interventions i
      where i.target_entity_id = v_banderin and i.agent_entity_id = e.id
        and i.intervention_type = 'Restauración y estabilización'
    );

  if v_banderin_source is not null then
    insert into source_links(id, source_id, entity_id, scope)
    select gen_random_uuid(), v_banderin_source, v_banderin, 'Descripción y restauración del banderín'
    where not exists (
      select 1 from source_links
      where source_id = v_banderin_source and entity_id = v_banderin
    );

    insert into source_links(id, source_id, intervention_id, scope)
    select gen_random_uuid(), v_banderin_source, i.id, 'Autoría e intervención patrimonial'
    from heritage_interventions i
    where i.target_entity_id = v_banderin
      and not exists (
        select 1 from source_links sl
        where sl.source_id = v_banderin_source and sl.intervention_id = i.id
      );
  end if;

  -- Hermandad de Santa Ana: alta mínima relacional, sin inventar una ficha integral.
  insert into entities(id, entity_type, name, slug, summary, status)
  select gen_random_uuid(), 'brotherhood', 'Hermandad de Santa Ana',
    'hermandad-santa-ana-dos-hermanas',
    'Hermandad de gloria de la Patrona de Dos Hermanas; alta mínima para documentar su relación musical con Presentación al Pueblo.',
    'draft'
  where not exists (
    select 1 from entities
    where slug = 'hermandad-santa-ana-dos-hermanas'
  );

  select id into v_santa_ana from entities
  where slug = 'hermandad-santa-ana-dos-hermanas'
  order by created_at limit 1;

  insert into brotherhoods(
    entity_id, official_name, popular_name, municipality_id,
    brotherhood_types, current_procession_day, notes
  )
  select v_santa_ana, 'Hermandad de Santa Ana', 'Hermandad de Santa Ana',
    (select municipality_id from bands where entity_id = v_band),
    array['Gloria']::text[], '26 de julio',
    'Alta mínima relacional. Historia, sede, fundación y denominación extensa quedan pendientes de una auditoría propia antes de publicar su ficha.'
  where v_santa_ana is not null
    and not exists (select 1 from brotherhoods where entity_id = v_santa_ana);

  insert into sources(id, name, url, source_type, author_or_publisher, publication_date, accessed_at, notes)
  select gen_random_uuid(), 'Presentación al Pueblo celebra diez años como hermana honoraria de Santa Ana',
    'https://www.elpespunte.es/articulo/cofrade/banda-presentacion-pueblo-celebrara-diez-anos-como-hermana-honoraria-santa-ana-dos-hermanas/20260715163219141448.html',
    'Medio especializado', 'El Pespunte', date '2026-07-15', date '2026-08-31',
    'Anuncio previo de la procesión de 2026 y del décimo aniversario como hermana honoraria.'
  where not exists (select 1 from sources where url = 'https://www.elpespunte.es/articulo/cofrade/banda-presentacion-pueblo-celebrara-diez-anos-como-hermana-honoraria-santa-ana-dos-hermanas/20260715163219141448.html');

  insert into sources(id, name, url, source_type, author_or_publisher, publication_date, accessed_at, notes)
  select gen_random_uuid(), 'La procesión de Santa Ana de 2026',
    'https://periodicolasemana.es/2026/149494/tramo-cofrade/dos-hermanas-con-su-patrona-en-la-procesion-del-26-de-julio/',
    'Medio local', 'Periódico La Semana', date '2026-07-27', date '2026-08-31',
    'Crónica posterior que confirma la apertura del cortejo y la interpretación previa a la entrada.'
  where not exists (select 1 from sources where url = 'https://periodicolasemana.es/2026/149494/tramo-cofrade/dos-hermanas-con-su-patrona-en-la-procesion-del-26-de-julio/');

  insert into sources(id, name, url, source_type, author_or_publisher, publication_date, accessed_at, notes)
  select gen_random_uuid(), 'Marchas recuperadas por Presentación al Pueblo para Santa Ana 2026',
    'https://www.elpespunte.es/articulo/cofrade/son-marchas-que-recupera-presentacion-pueblo-procesion-santa-ana/20260726114728142611.html',
    'Medio especializado', 'El Pespunte', date '2026-07-26', date '2026-08-31',
    'Identifica las tres recuperaciones históricas interpretadas en la temporada 2026.'
  where not exists (select 1 from sources where url = 'https://www.elpespunte.es/articulo/cofrade/son-marchas-que-recupera-presentacion-pueblo-procesion-santa-ana/20260726114728142611.html');

  select id into v_santa_ana_source from sources
  where url = 'https://www.elpespunte.es/articulo/cofrade/banda-presentacion-pueblo-celebrara-diez-anos-como-hermana-honoraria-santa-ana-dos-hermanas/20260715163219141448.html'
  order by created_at limit 1;

  select id into v_santa_ana_post_source from sources
  where url = 'https://periodicolasemana.es/2026/149494/tramo-cofrade/dos-hermanas-con-su-patrona-en-la-procesion-del-26-de-julio/'
  order by created_at limit 1;

  select id into v_recoveries_source from sources
  where url = 'https://www.elpespunte.es/articulo/cofrade/son-marchas-que-recupera-presentacion-pueblo-procesion-santa-ana/20260726114728142611.html'
  order by created_at limit 1;

  insert into music_accompaniment_periods(
    id, brotherhood_entity_id, band_entity_id, position, outing_type,
    date_from_text, is_current, notes, status,
    public_brotherhood_name, public_step_name, public_brotherhood_slug,
    public_municipality_name, public_municipality_slug, public_province
  )
  select gen_random_uuid(), v_santa_ana, v_band, 'Abriendo el cortejo', 'Procesión de gloria',
    'Relación documentada en 2025 y 2026', true,
    'En 2026 abrió el cortejo y conmemoró diez años como hermana honoraria de la Hermandad. La antigüedad musical exacta no está documentada.',
    'published', 'Hermandad de Santa Ana', 'Señora Santa Ana, Patrona de Dos Hermanas',
    'hermandad-santa-ana-dos-hermanas', 'Dos Hermanas', 'dos-hermanas', 'Sevilla'
  where v_santa_ana is not null
    and not exists (
      select 1 from music_accompaniment_periods
      where band_entity_id = v_band
        and brotherhood_entity_id = v_santa_ana
        and is_current
    );

  select id into v_santa_ana_period
  from music_accompaniment_periods
  where band_entity_id = v_band and brotherhood_entity_id = v_santa_ana and is_current
  order by created_at limit 1;

  insert into source_links(id, source_id, music_accompaniment_period_id, scope)
  select gen_random_uuid(), s.source_id, v_santa_ana_period, s.scope
  from (values
    (v_santa_ana_source, 'Vigencia y aniversario institucional'),
    (v_santa_ana_post_source, 'Participación y posición en el cortejo'),
    (v_recoveries_source, 'Programa musical de 2026')
  ) as s(source_id, scope)
  where s.source_id is not null and v_santa_ana_period is not null
    and not exists (
      select 1 from source_links sl
      where sl.source_id = s.source_id
        and sl.music_accompaniment_period_id = v_santa_ana_period
    );

  insert into source_links(id, source_id, entity_id, scope)
  select gen_random_uuid(), v_santa_ana_source, v_santa_ana, 'Identidad relacional mínima'
  where v_santa_ana_source is not null and v_santa_ana is not null
    and not exists (
      select 1 from source_links
      where source_id = v_santa_ana_source and entity_id = v_santa_ana
    );

  -- Fuentes musicales específicas.
  insert into sources(id, name, url, source_type, author_or_publisher, accessed_at, notes)
  select gen_random_uuid(), 'Presentación al Pueblo · Mi Dios',
    'https://www.instagram.com/reel/CacJxZUjRRv/', 'Red social oficial',
    'Presentación al Pueblo', date '2026-08-31',
    'Publicación oficial que identifica a Cristopher y Jonathan Jiménez Cabeza como autores.'
  where not exists (select 1 from sources where url = 'https://www.instagram.com/reel/CacJxZUjRRv/');

  insert into sources(id, name, url, source_type, author_or_publisher, publication_date, accessed_at, notes)
  select gen_random_uuid(), 'Apple Music · En la Noche de Triana',
    'https://music.apple.com/es/song/en-la-noche-de-triana/1701462706', 'Plataforma musical oficial',
    'Apple Music', date '2023-07-26', date '2026-08-31',
    'Créditos de composición y publicación del sencillo.'
  where not exists (select 1 from sources where url = 'https://music.apple.com/es/song/en-la-noche-de-triana/1701462706');

  insert into sources(id, name, url, source_type, author_or_publisher, accessed_at, notes)
  select gen_random_uuid(), 'Hermandad de San Bernardo · patrimonio musical',
    'https://www.hermandaddesanbernardo.com/patrimonio-musical/', 'Web oficial',
    'Hermandad de San Bernardo', date '2026-08-31',
    'Confirma las autorías y dedicatorias de Plegaria a San Bernardo, Y Yo Soy la Salud y Salus Christi.'
  where not exists (select 1 from sources where url = 'https://www.hermandaddesanbernardo.com/patrimonio-musical/');

  insert into sources(id, name, url, source_type, author_or_publisher, accessed_at, notes)
  select gen_random_uuid(), 'Apple Music · Para Ti, Sevilla',
    'https://music.apple.com/es/song/para-ti-sevilla/1711077374', 'Plataforma musical oficial',
    'Apple Music', date '2026-08-31',
    'Metadatos de autoría y publicación de la grabación.'
  where not exists (select 1 from sources where url = 'https://music.apple.com/es/song/para-ti-sevilla/1711077374');

  insert into sources(id, name, url, source_type, author_or_publisher, accessed_at, notes)
  select gen_random_uuid(), 'Hermandad de la Exaltación · patrimonio musical',
    'https://www.laexaltacion.org/patrimonio-musical/', 'Web oficial',
    'Hermandad de la Exaltación', date '2026-08-31',
    'Identifica En tus Lágrimas y su dedicatoria; se conserva el conflicto de apellido presente en otra edición del catálogo de la banda.'
  where not exists (select 1 from sources where url = 'https://www.laexaltacion.org/patrimonio-musical/');

  select id into v_mi_dios_source from sources where url = 'https://www.instagram.com/reel/CacJxZUjRRv/' order by created_at limit 1;
  select id into v_noche_triana_source from sources where url = 'https://music.apple.com/es/song/en-la-noche-de-triana/1701462706' order by created_at limit 1;
  select id into v_san_bernardo_source from sources where url = 'https://www.hermandaddesanbernardo.com/patrimonio-musical/' order by created_at limit 1;
  select id into v_para_ti_sevilla_source from sources where url = 'https://music.apple.com/es/song/para-ti-sevilla/1711077374' order by created_at limit 1;
  select id into v_exaltacion_source from sources where url = 'https://www.laexaltacion.org/patrimonio-musical/' order by created_at limit 1;

  create temporary table hc_phase2_marches(
    title text, slug text, composition_year int, premiere_text text,
    description_text text, author_slugs text[], source_key text
  ) on commit drop;

  insert into hc_phase2_marches values
    ('En la Noche de Triana', 'marcha-en-la-noche-de-triana', 2023, '26 de julio de 2023',
      'Marcha dedicada a la Hermandad de la Estrella, grabada por Presentación al Pueblo.',
      array['agente-jose-maria-sanchez-martin'], 'noche_triana'),
    ('Mi Dios', 'marcha-mi-dios-presentacion', 2022, 'Febrero de 2022',
      'Marcha dedicada a Nuestro Padre Jesús del Gran Poder de Sevilla.',
      array['cristopher-jimenez-cabeza','jonathan-jimenez-cabeza'], 'mi_dios'),
    ('Salus Christi', 'marcha-salus-christi', 2012, null,
      'Marcha dedicada al Santísimo Cristo de la Salud de la Hermandad de San Bernardo.',
      array['agente-jose-maria-sanchez-martin'], 'san_bernardo'),
    ('Calle de la Amargura', 'marcha-calle-de-la-amargura', null, null,
      'Marcha procesional grabada por Presentación al Pueblo y recuperada por la formación en 2026.',
      array['manuel-jesus-guerrero-marin'], 'discography'),
    ('Al Dios Verdadero', 'marcha-al-dios-verdadero', 2007, null,
      'Marcha procesional grabada en 20 Años de Presentación.',
      array['victor-ramirez-perez'], 'discography'),
    ('Plegaria a San Bernardo', 'marcha-plegaria-a-san-bernardo', null, null,
      'Marcha dedicada a la Hermandad de San Bernardo.',
      array['francisco-artiguez','victor-ramirez-perez'], 'san_bernardo'),
    ('…De mi Niña Nazarena', 'marcha-de-mi-nina-nazarena', null, null,
      'Marcha procesional grabada en 20 Años de Presentación.',
      array['jose-manuel-delgado-barroso'], 'discography'),
    ('Para ti mi Estrella', 'marcha-para-ti-mi-estrella', 2004, null,
      'Marcha dedicada a María Santísima de la Estrella Coronada.',
      array['victor-ramirez-perez','jose-manuel-delgado-barroso'], 'discography'),
    ('Y yo soy la Salud', 'marcha-y-yo-soy-la-salud', null, null,
      'Marcha dedicada al Santísimo Cristo de la Salud de la Hermandad de San Bernardo.',
      array['victor-ramirez-perez'], 'san_bernardo'),
    ('Esencia', 'marcha-esencia-presentacion', null, null,
      'Marcha procesional grabada en 20 Años de Presentación.',
      array['raul-rodriguez-dominguez'], 'discography'),
    ('Para ti, Sevilla', 'marcha-para-ti-sevilla', 1999, null,
      'Marcha procesional grabada por Presentación al Pueblo.',
      array['francisco-javier-torres-simon'], 'para_ti_sevilla'),
    ('La Valiente', 'marcha-la-valiente-presentacion', null, null,
      'Marcha procesional con conflicto de autoría entre fuentes oficiales; la relación de autor permanece pendiente de resolución.',
      array[]::text[], 'discography'),
    ('En tus Lágrimas', 'marcha-en-tus-lagrimas-presentacion', 1995, null,
      'Marcha dedicada a Nuestra Señora de las Lágrimas. Una edición del catálogo oficial discrepa en el apellido del autor; la autoría canónica queda pendiente.',
      array[]::text[], 'exaltacion'),
    ('La Promesa', 'marcha-la-promesa-presentacion', null, null,
      'Marcha procesional con variantes incompatibles de autoría en las ediciones oficiales consultadas; la autoría canónica queda pendiente.',
      array[]::text[], 'discography'),
    ('Ecce Lignum Crucis', 'marcha-ecce-lignum-crucis-presentacion', null, null,
      'Marcha procesional con variantes incompatibles de autoría en las ediciones oficiales consultadas; la autoría canónica queda pendiente.',
      array[]::text[], 'discography'),
    ('Yacente', 'marcha-yacente-presentacion', null, null,
      'Marcha procesional grabada por Presentación al Pueblo.',
      array['jose-manuel-moreno-cebador'], 'discography');

  insert into entities(id, entity_type, name, slug, summary, status)
  select gen_random_uuid(), 'march', m.title, m.slug,
    'Marcha procesional documentada en el universo musical de Presentación al Pueblo.', 'published'
  from hc_phase2_marches m
  where not exists (
    select 1 from entities e
    where e.entity_type = 'march'
      and (
        e.slug = m.slug or
        lower(regexp_replace(translate(e.name,'ÁÉÍÓÚÜÑáéíóúüñ','AEIOUUNaeiouun'),'[^a-zA-Z0-9]+','','g')) =
        lower(regexp_replace(translate(m.title,'ÁÉÍÓÚÜÑáéíóúüñ','AEIOUUNaeiouun'),'[^a-zA-Z0-9]+','','g'))
      )
  );

  insert into marches(
    entity_id, composition_year, composition_date_text, music_type,
    description, eligible_for_daily, daily_priority, premiere_date_text,
    premiered_by_band_entity_id, work_type, notes
  )
  select e.id, m.composition_year,
    case when m.composition_year is null then null else m.composition_year::text end,
    'Cornetas y Tambores', m.description_text, false, 0, m.premiere_text,
    case when m.slug in ('marcha-en-la-noche-de-triana','marcha-mi-dios-presentacion') then v_band else null end,
    'Marcha procesional',
    case when cardinality(m.author_slugs) = 0 then 'Autoría pendiente por discrepancia entre fuentes fiables; no establecer relación canónica sin resolver el conflicto.' else null end
  from hc_phase2_marches m
  join entities e on e.slug = m.slug
  where not exists (select 1 from marches x where x.entity_id = e.id);

  insert into march_authors(id, march_entity_id, agent_entity_id, author_role, notes, status)
  select gen_random_uuid(), me.id, ae.id, 'composer',
    'Autoría contrastada durante la auditoría documental de 31-08-2026.', 'published'
  from hc_phase2_marches m
  join entities me on me.slug = m.slug
  cross join lateral unnest(m.author_slugs) author_slug
  join entities ae on ae.slug = author_slug
  on conflict (march_entity_id, agent_entity_id, author_role) do nothing;

  -- Enlace de pistas por identidad normalizada. Se dejan fuera la levantá y el sencillo en vivo,
  -- que no pueden identificarse inequívocamente como marchas autónomas.
  update band_release_tracks t
  set march_entity_id = me.id
  from band_releases r, hc_phase2_marches hm, entities me
  where t.release_id = r.id
    and r.band_entity_id = v_band
    and me.slug = hm.slug
    and t.title not in ('Levantá del paso de Cristo de la Hermandad de la Estrella', 'Por Siempre, Presentación (En Vivo)')
    and lower(regexp_replace(translate(t.title,'ÁÉÍÓÚÜÑáéíóúüñ','AEIOUUNaeiouun'),'[^a-zA-Z0-9]+','','g')) =
        lower(regexp_replace(translate(hm.title,'ÁÉÍÓÚÜÑáéíóúüñ','AEIOUUNaeiouun'),'[^a-zA-Z0-9]+','','g'));

  insert into source_links(id, source_id, entity_id, scope, notes)
  select gen_random_uuid(),
    case m.source_key
      when 'mi_dios' then v_mi_dios_source
      when 'noche_triana' then v_noche_triana_source
      when 'san_bernardo' then v_san_bernardo_source
      when 'para_ti_sevilla' then v_para_ti_sevilla_source
      when 'exaltacion' then v_exaltacion_source
      else v_discography_source
    end,
    e.id, 'Título, grabación y autoría',
    case when cardinality(m.author_slugs) = 0
      then 'La fuente documenta la obra, pero la relación de autoría queda pendiente por conflicto entre fuentes.'
      else 'Relación musical documentada en la auditoría de 31-08-2026.' end
  from hc_phase2_marches m
  join entities e on e.slug = m.slug
  where case m.source_key
      when 'mi_dios' then v_mi_dios_source
      when 'noche_triana' then v_noche_triana_source
      when 'san_bernardo' then v_san_bernardo_source
      when 'para_ti_sevilla' then v_para_ti_sevilla_source
      when 'exaltacion' then v_exaltacion_source
      else v_discography_source
    end is not null
    and not exists (
      select 1 from source_links sl
      where sl.source_id = case m.source_key
          when 'mi_dios' then v_mi_dios_source
          when 'noche_triana' then v_noche_triana_source
          when 'san_bernardo' then v_san_bernardo_source
          when 'para_ti_sevilla' then v_para_ti_sevilla_source
          when 'exaltacion' then v_exaltacion_source
          else v_discography_source
        end
        and sl.entity_id = e.id
    );

  -- Recuperaciones históricas de la temporada 2026, sin denominarlas estrenos.
  insert into band_premieres(
    id, band_entity_id, title, composer_name, premiere_year, premiere_date,
    venue_text, municipality_text, description, source_id, status, display_order, march_entity_id
  )
  select gen_random_uuid(), v_band, x.title, x.composer_name, 2026, x.event_date,
    x.venue_text, 'Dos Hermanas', x.description_text, v_recoveries_source,
    'published', x.display_order, e.id
  from (values
    ('Aire para mis Penas', 'Manuel Jesús Guerrero Marín', date '2026-07-26',
      'Procesión de Señora Santa Ana',
      'Tipo de novedad: recuperación histórica. Obra recuperada para la procesión de Santa Ana de 2026.', 20,
      'marcha-aire-para-mis-penas'),
    ('Calle de la Amargura', 'Manuel Jesús Guerrero Marín', date '2026-07-26',
      'Procesión de Señora Santa Ana',
      'Tipo de novedad: recuperación histórica. Obra recuperada para la procesión de Santa Ana de 2026.', 30,
      'marcha-calle-de-la-amargura'),
    ('La historia de un Profeta', 'Sergio Larrinaga', null::date,
      'Corpus de Dos Hermanas y procesión de Señora Santa Ana',
      'Tipo de novedad: recuperación histórica. Recuperada para el Corpus de 2026 y mantenida en el repertorio para Santa Ana.', 40,
      'marcha-la-historia-de-un-profeta')
  ) as x(title, composer_name, event_date, venue_text, description_text, display_order, march_slug)
  join entities e on e.slug = x.march_slug
  on conflict (band_entity_id, title, premiere_year) do update set
    premiere_date = excluded.premiere_date,
    venue_text = excluded.venue_text,
    municipality_text = excluded.municipality_text,
    description = excluded.description,
    source_id = excluded.source_id,
    status = 'published',
    display_order = excluded.display_order,
    march_entity_id = excluded.march_entity_id;

  insert into source_links(id, source_id, band_premiere_id, scope)
  select gen_random_uuid(), v_recoveries_source, bp.id, 'Recuperación histórica'
  from band_premieres bp
  where bp.band_entity_id = v_band
    and bp.premiere_year = 2026
    and bp.title in ('Aire para mis Penas','Calle de la Amargura','La historia de un Profeta')
    and v_recoveries_source is not null
    and not exists (
      select 1 from source_links sl
      where sl.source_id = v_recoveries_source and sl.band_premiere_id = bp.id
    );
end $$;
