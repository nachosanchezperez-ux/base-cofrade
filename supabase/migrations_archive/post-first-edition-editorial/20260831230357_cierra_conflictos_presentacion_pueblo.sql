-- Cierre de conflictos documentales de Presentación al Pueblo (31-08-2026).
-- Resuelve cuatro autorías y precisa periodos mínimos sin inventar años iniciales.

do $$
declare
  v_band uuid;
  v_star_source uuid;
  v_exaltacion_source uuid;
  v_database_source uuid;
  v_paradas_2025_source uuid;
  v_paradas_2026_source uuid;
  v_santa_ana_2012_source uuid;
  v_paradas_period uuid;
  v_santa_ana_period uuid;
  v_fj_fernandez uuid;
begin
  select id into v_band
  from entities
  where slug = 'banda-cornetas-tambores-presentacion-al-pueblo-dos-hermanas'
    and entity_type = 'band';

  if v_band is null then
    -- Las ramas efímeras pueden carecer de datos editoriales.
    return;
  end if;

  insert into sources(id, name, url, source_type, author_or_publisher, accessed_at, notes)
  select gen_random_uuid(), 'Hermandad de la Estrella · patrimonio musical',
    'https://hermandad-estrella.org/patrimonio-musical/', 'Web oficial',
    'Hermandad de la Estrella', date '2026-08-31',
    'Catálogo patrimonial oficial que atribuye La Valiente a Isaac Gómez y fecha la obra en 1998.'
  where not exists (
    select 1 from sources where url = 'https://hermandad-estrella.org/patrimonio-musical/'
  );

  insert into sources(id, name, url, source_type, author_or_publisher, accessed_at, notes)
  select gen_random_uuid(), 'Marchas de Procesión · base de datos de cornetas y tambores',
    'https://www.marchasdeprocesion.com/p/base-datos-cornetas-tambores.html',
    'Fuente secundaria contrastada', 'Marchas de Procesión', date '2026-08-31',
    'Catálogo musical empleado únicamente para resolver variantes nominales de La Promesa y Ecce Lignum Crucis.'
  where not exists (
    select 1 from sources where url = 'https://www.marchasdeprocesion.com/p/base-datos-cornetas-tambores.html'
  );

  insert into sources(id, name, url, source_type, author_or_publisher, accessed_at, notes)
  select gen_random_uuid(), 'Presentación al Pueblo · Viernes Santo en Paradas 2025',
    'https://www.instagram.com/p/DImKN36C88x/', 'Red social oficial',
    'Presentación al Pueblo', date '2026-08-31',
    'Publicación oficial de la formación que documenta el acompañamiento en Paradas durante 2025.'
  where not exists (
    select 1 from sources where url = 'https://www.instagram.com/p/DImKN36C88x/'
  );

  insert into sources(id, name, url, source_type, author_or_publisher, accessed_at, notes)
  select gen_random_uuid(), 'Presentación al Pueblo · Santo Entierro de Paradas 2026',
    'https://www.facebook.com/100061828947288/posts/1470584958345788/',
    'Red social oficial', 'Presentación al Pueblo', date '2026-08-31',
    'Publicación oficial que confirma la repetición del acompañamiento en Paradas durante 2026.'
  where not exists (
    select 1 from sources where url = 'https://www.facebook.com/100061828947288/posts/1470584958345788/'
  );

  insert into sources(id, name, url, source_type, author_or_publisher, accessed_at, notes)
  select gen_random_uuid(), 'Santa Ana 2012 con Presentación al Pueblo',
    'https://www.youtube.com/watch?v=vVOj9tI3bZA', 'Documento audiovisual',
    'Archivo audiovisual publicado en YouTube', date '2026-08-31',
    'Evidencia audiovisual de la participación de Presentación al Pueblo en la procesión de Santa Ana de 2012; no acredita el inicio exacto del vínculo.'
  where not exists (
    select 1 from sources where url = 'https://www.youtube.com/watch?v=vVOj9tI3bZA'
  );

  select id into v_star_source from sources
  where url = 'https://hermandad-estrella.org/patrimonio-musical/'
  order by created_at limit 1;

  select id into v_exaltacion_source from sources
  where url = 'https://www.laexaltacion.org/patrimonio-musical/'
  order by created_at limit 1;

  select id into v_database_source from sources
  where url = 'https://www.marchasdeprocesion.com/p/base-datos-cornetas-tambores.html'
  order by created_at limit 1;

  select id into v_paradas_2025_source from sources
  where url = 'https://www.instagram.com/p/DImKN36C88x/'
  order by created_at limit 1;

  select id into v_paradas_2026_source from sources
  where url = 'https://www.facebook.com/100061828947288/posts/1470584958345788/'
  order by created_at limit 1;

  select id into v_santa_ana_2012_source from sources
  where url = 'https://www.youtube.com/watch?v=vVOj9tI3bZA'
  order by created_at limit 1;

  -- Autor normalizado que no existía en la base.
  insert into entities(id, entity_type, name, slug, summary, status)
  select gen_random_uuid(), 'agent', 'Francisco Javier Fernández Pérez',
    'francisco-javier-fernandez-perez',
    'Compositor de la marcha Ecce Lignum Crucis, grabada por Presentación al Pueblo.',
    'published'
  where not exists (
    select 1 from entities e
    where e.entity_type = 'agent'
      and (
        e.slug = 'francisco-javier-fernandez-perez' or
        lower(regexp_replace(translate(e.name,'ÁÉÍÓÚÜÑáéíóúüñ','AEIOUUNaeiouun'),'[^a-zA-Z0-9]+','','g')) =
        'franciscojavierfernandezperez'
      )
  );

  select id into v_fj_fernandez from entities
  where entity_type = 'agent'
    and (
      slug = 'francisco-javier-fernandez-perez' or
      lower(regexp_replace(translate(name,'ÁÉÍÓÚÜÑáéíóúüñ','AEIOUUNaeiouun'),'[^a-zA-Z0-9]+','','g')) =
      'franciscojavierfernandezperez'
    )
  order by created_at limit 1;

  insert into agents(entity_id, agent_kind, description)
  select v_fj_fernandez, 'person',
    'Autor musical identificado mediante la edición original del catálogo de la banda y un catálogo especializado contrastado.'
  where v_fj_fernandez is not null
    and not exists (select 1 from agents where entity_id = v_fj_fernandez);

  insert into agent_names(id, agent_entity_id, name, name_type, is_current)
  select gen_random_uuid(), v_fj_fernandez, 'Francisco Javier Fernández Pérez', 'official', true
  where v_fj_fernandez is not null
    and not exists (
      select 1 from agent_names
      where agent_entity_id = v_fj_fernandez
        and lower(name) = lower('Francisco Javier Fernández Pérez')
    );

  -- Las cuatro relaciones se fijan solo después de contrastar las variantes.
  insert into march_authors(id, march_entity_id, agent_entity_id, author_role, notes, status)
  select gen_random_uuid(), m.id, a.id, 'composer', x.notes, 'published'
  from (values
    ('marcha-la-valiente-presentacion', 'isaac-gomez',
      'Autoría resuelta el 31-08-2026: la Hermandad de la Estrella y la edición original atribuyen la obra a Isaac Gómez.'),
    ('marcha-en-tus-lagrimas-presentacion', 'francisco-jose-martinez-perez',
      'Autoría resuelta el 31-08-2026: confirmada por la Hermandad de la Exaltación y la edición original del disco de 1999.'),
    ('marcha-la-promesa-presentacion', 'jorge-martin-puerto',
      'Autoría resuelta el 31-08-2026: la forma canónica Jorge Martín Puerto coincide en la reedición y en catálogos musicales contrastados.'),
    ('marcha-ecce-lignum-crucis-presentacion', 'francisco-javier-fernandez-perez',
      'Autoría resuelta el 31-08-2026: la edición original y el catálogo especializado identifican a Francisco Javier Fernández Pérez.')
  ) as x(march_slug, agent_slug, notes)
  join entities m on m.slug = x.march_slug and m.entity_type = 'march'
  join entities a on a.slug = x.agent_slug and a.entity_type = 'agent'
  on conflict (march_entity_id, agent_entity_id, author_role) do update set
    notes = excluded.notes,
    status = 'published';

  update marches set
    composition_year = 1998,
    composition_date_text = '1998',
    description = 'Marcha dedicada a la Hermandad de la Estrella y grabada por Presentación al Pueblo.',
    notes = 'Autoría canónica: Isaac Gómez. La atribución compartida de una antología posterior se considera una inconsistencia editorial al contradecir la fuente de la Hermandad destinataria y la edición original.'
  where entity_id = (select id from entities where slug = 'marcha-la-valiente-presentacion');

  update marches set
    description = 'Marcha de Francisco José Martínez Pérez dedicada a Nuestra Señora de las Lágrimas de la Hermandad de la Exaltación.',
    notes = 'Autoría canónica confirmada por la Hermandad de la Exaltación. La variante de apellido presente en la antología de 2004 se conserva como conflicto editorial resuelto.'
  where entity_id = (select id from entities where slug = 'marcha-en-tus-lagrimas-presentacion');

  update marches set
    description = 'Marcha procesional de Jorge Martín Puerto grabada por Presentación al Pueblo.',
    notes = 'Autoría canónica: Jorge Martín Puerto. La forma abreviada Jorge Marín de la edición de 1995 se considera una variante errónea tras el contraste documental.'
  where entity_id = (select id from entities where slug = 'marcha-la-promesa-presentacion');

  update marches set
    description = 'Marcha procesional de Francisco Javier Fernández Pérez grabada por Presentación al Pueblo.',
    notes = 'Autoría canónica: Francisco Javier Fernández Pérez. La atribución a Francisco Javier Martínez de la reedición se considera una inconsistencia editorial tras el contraste con la edición original y el catálogo especializado.'
  where entity_id = (select id from entities where slug = 'marcha-ecce-lignum-crucis-presentacion');

  insert into source_links(id, source_id, entity_id, scope, notes)
  select gen_random_uuid(), x.source_id, e.id, x.scope, x.notes
  from (values
    ('marcha-la-valiente-presentacion', v_star_source,
      'Autoría y dedicatoria', 'Fuente oficial de la Hermandad destinataria; prevalece sobre la atribución inconsistente de una antología posterior.'),
    ('marcha-en-tus-lagrimas-presentacion', v_exaltacion_source,
      'Autoría y dedicatoria', 'Fuente oficial de la Hermandad destinataria.'),
    ('marcha-la-promesa-presentacion', v_database_source,
      'Normalización de autoría', 'Fuente secundaria empleada junto con las dos ediciones del catálogo oficial de la banda.'),
    ('marcha-ecce-lignum-crucis-presentacion', v_database_source,
      'Normalización de autoría', 'Fuente secundaria empleada junto con la edición original del catálogo oficial de la banda.')
  ) as x(march_slug, source_id, scope, notes)
  join entities e on e.slug = x.march_slug
  where x.source_id is not null
    and not exists (
      select 1 from source_links sl
      where sl.source_id = x.source_id and sl.entity_id = e.id and sl.scope = x.scope
    );

  select id into v_paradas_period
  from music_accompaniment_periods
  where band_entity_id = v_band and is_current
    and public_municipality_name = 'Paradas'
  order by created_at limit 1;

  update music_accompaniment_periods set
    date_from_text = 'Presencia documentada en 2025 y 2026 · inicio exacto pendiente',
    notes = 'Acompañamiento al Santísimo Cristo de la Misericordia en su Traslado al Sepulcro, documentado por publicaciones oficiales de la banda en 2025 y 2026. El inicio exacto de la relación no está acreditado.'
  where id = v_paradas_period;

  insert into source_links(id, source_id, music_accompaniment_period_id, scope)
  select gen_random_uuid(), s.source_id, v_paradas_period, s.scope
  from (values
    (v_paradas_2025_source, 'Participación documentada en 2025'),
    (v_paradas_2026_source, 'Vigencia documentada en 2026')
  ) as s(source_id, scope)
  where s.source_id is not null and v_paradas_period is not null
    and not exists (
      select 1 from source_links sl
      where sl.source_id = s.source_id
        and sl.music_accompaniment_period_id = v_paradas_period
    );

  select id into v_santa_ana_period
  from music_accompaniment_periods
  where band_entity_id = v_band and is_current
    and public_brotherhood_name = 'Hermandad de Santa Ana'
  order by created_at limit 1;

  update music_accompaniment_periods set
    date_from_text = 'Presencia documentada al menos desde 2012 · vigente en 2026',
    notes = 'La participación está acreditada audiovisualmente en 2012 y continúa vigente en 2026. Ese año abrió el cortejo y conmemoró diez años como hermana honoraria. El inicio musical exacto no está documentado.'
  where id = v_santa_ana_period;

  insert into source_links(id, source_id, music_accompaniment_period_id, scope)
  select gen_random_uuid(), v_santa_ana_2012_source, v_santa_ana_period,
    'Presencia audiovisual documentada en 2012'
  where v_santa_ana_2012_source is not null and v_santa_ana_period is not null
    and not exists (
      select 1 from source_links sl
      where sl.source_id = v_santa_ana_2012_source
        and sl.music_accompaniment_period_id = v_santa_ana_period
    );
end $$;
