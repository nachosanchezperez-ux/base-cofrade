-- Hilo Cofrade · La Encarnación: acompañamientos musicales vigentes 2026
-- Migración 056
--
-- Completa la ficha pública de la Agrupación Musical Nuestra Señora de la
-- Encarnación con dos vinculaciones actuales verificadas que faltaban:
--   · Miércoles Santo · Oración en el Huerto · El Puerto de Santa María
--   · Sábado Santo · Santo Entierro · Castilblanco de los Arroyos
--
-- Las hermandades y pasos auxiliares se crean como entidades draft para mantener
-- el grafo relacional sin publicar fichas todavía incompletas.

do $$
declare
  band_id uuid;
  el_puerto_municipality_id uuid;
  castilblanco_municipality_id uuid;
  el_puerto_brotherhood_id uuid;
  el_puerto_step_id uuid;
  castilblanco_brotherhood_id uuid;
  castilblanco_step_id uuid;
  el_puerto_period_id uuid;
  castilblanco_period_id uuid;
  source_el_puerto_current_id uuid;
  source_el_puerto_start_id uuid;
  source_castilblanco_current_id uuid;
  source_castilblanco_start_id uuid;
begin
  select id into band_id
  from public.entities
  where entity_type = 'band'
    and slug = 'agrupacion-musical-nuestra-senora-de-la-encarnacion';

  if band_id is null then
    raise exception 'No existe la banda La Encarnación';
  end if;

  -- Localidades auxiliares del grafo.
  insert into public.municipalities (name, slug, province, autonomous_community, country)
  values ('El Puerto de Santa María', 'el-puerto-de-santa-maria', 'Cádiz', 'Andalucía', 'España')
  on conflict (slug) do update set
    name = excluded.name,
    province = excluded.province,
    autonomous_community = excluded.autonomous_community,
    country = excluded.country;

  select id into el_puerto_municipality_id
  from public.municipalities
  where slug = 'el-puerto-de-santa-maria';

  insert into public.municipalities (name, slug, province, autonomous_community, country)
  values ('Castilblanco de los Arroyos', 'castilblanco-de-los-arroyos', 'Sevilla', 'Andalucía', 'España')
  on conflict (slug) do update set
    name = excluded.name,
    province = excluded.province,
    autonomous_community = excluded.autonomous_community,
    country = excluded.country;

  select id into castilblanco_municipality_id
  from public.municipalities
  where slug = 'castilblanco-de-los-arroyos';

  -- Hermandad y paso · El Puerto de Santa María.
  insert into public.entities (entity_type, name, slug, status)
  values (
    'brotherhood',
    'Hermandad de la Sagrada Oración en el Huerto',
    'hermandad-oracion-huerto-el-puerto-de-santa-maria',
    'draft'
  )
  on conflict (slug) do update set name = excluded.name
  returning id into el_puerto_brotherhood_id;

  insert into public.brotherhoods (
    entity_id, official_name, popular_name, municipality_id,
    brotherhood_types, current_procession_day
  ) values (
    el_puerto_brotherhood_id,
    'Hermandad de la Sagrada Oración de Nuestro Señor Jesucristo en el Huerto y María Santísima de Gracia y Esperanza',
    'Oración en el Huerto',
    el_puerto_municipality_id,
    array['Penitencia']::text[],
    'Miércoles Santo'
  )
  on conflict (entity_id) do update set
    official_name = excluded.official_name,
    popular_name = excluded.popular_name,
    municipality_id = excluded.municipality_id,
    brotherhood_types = excluded.brotherhood_types,
    current_procession_day = excluded.current_procession_day;

  insert into public.entities (entity_type, name, slug, status)
  values (
    'step',
    'Paso de misterio de Nuestro Señor Jesucristo en la Sagrada Oración en el Huerto',
    'paso-misterio-oracion-huerto-el-puerto-de-santa-maria',
    'draft'
  )
  on conflict (slug) do update set name = excluded.name
  returning id into el_puerto_step_id;

  insert into public.steps (entity_id, step_type, current_condition)
  values (el_puerto_step_id, 'Misterio', 'preserved')
  on conflict (entity_id) do update set
    step_type = excluded.step_type,
    current_condition = excluded.current_condition;

  if not exists (
    select 1
    from public.brotherhood_steps
    where brotherhood_entity_id = el_puerto_brotherhood_id
      and step_entity_id = el_puerto_step_id
      and relation_type = 'processional_step'
      and status <> 'archived'
  ) then
    insert into public.brotherhood_steps (
      brotherhood_entity_id, step_entity_id, relation_type, status
    ) values (
      el_puerto_brotherhood_id, el_puerto_step_id, 'processional_step', 'draft'
    );
  end if;

  -- Hermandad y paso · Castilblanco de los Arroyos.
  insert into public.entities (entity_type, name, slug, status)
  values (
    'brotherhood',
    'Hermandad del Santo Entierro de Castilblanco de los Arroyos',
    'santo-entierro-castilblanco-de-los-arroyos',
    'draft'
  )
  on conflict (slug) do update set name = excluded.name
  returning id into castilblanco_brotherhood_id;

  insert into public.brotherhoods (
    entity_id, official_name, popular_name, municipality_id,
    brotherhood_types, current_procession_day
  ) values (
    castilblanco_brotherhood_id,
    'Hermandad del Santísimo Cristo de la Misericordia en su Santo Entierro y Nuestra Señora de los Dolores en su Soledad',
    'Santo Entierro',
    castilblanco_municipality_id,
    array['Penitencia']::text[],
    'Sábado Santo'
  )
  on conflict (entity_id) do update set
    official_name = excluded.official_name,
    popular_name = excluded.popular_name,
    municipality_id = excluded.municipality_id,
    brotherhood_types = excluded.brotherhood_types,
    current_procession_day = excluded.current_procession_day;

  insert into public.entities (entity_type, name, slug, status)
  values (
    'step',
    'Paso del Santísimo Cristo de la Misericordia en su Santo Entierro',
    'paso-cristo-misericordia-santo-entierro-castilblanco',
    'draft'
  )
  on conflict (slug) do update set name = excluded.name
  returning id into castilblanco_step_id;

  insert into public.steps (entity_id, step_type, current_condition)
  values (castilblanco_step_id, 'Cristo', 'preserved')
  on conflict (entity_id) do update set
    step_type = excluded.step_type,
    current_condition = excluded.current_condition;

  if not exists (
    select 1
    from public.brotherhood_steps
    where brotherhood_entity_id = castilblanco_brotherhood_id
      and step_entity_id = castilblanco_step_id
      and relation_type = 'processional_step'
      and status <> 'archived'
  ) then
    insert into public.brotherhood_steps (
      brotherhood_entity_id, step_entity_id, relation_type, status
    ) values (
      castilblanco_brotherhood_id, castilblanco_step_id, 'processional_step', 'draft'
    );
  end if;

  -- Acompañamiento vigente · El Puerto de Santa María.
  select id into el_puerto_period_id
  from public.music_accompaniment_periods
  where band_entity_id = band_id
    and brotherhood_entity_id = el_puerto_brotherhood_id
    and outing_type = 'Miércoles Santo'
    and is_current
    and status <> 'archived'
  order by created_at
  limit 1;

  if el_puerto_period_id is null then
    insert into public.music_accompaniment_periods (
      brotherhood_entity_id, band_entity_id, step_entity_id,
      position, outing_type, year_from, is_current, notes, status,
      public_brotherhood_name, public_step_name, public_brotherhood_slug
    ) values (
      el_puerto_brotherhood_id,
      band_id,
      el_puerto_step_id,
      'Tras el paso de misterio',
      'Miércoles Santo',
      2024,
      true,
      'Vinculación vigente en 2026. La unión alcanza su tercer año consecutivo, por lo que el inicio se sitúa en 2024.',
      'published',
      'Hermandad de la Sagrada Oración en el Huerto',
      'Paso de misterio de Nuestro Señor Jesucristo en la Sagrada Oración en el Huerto',
      'hermandad-oracion-huerto-el-puerto-de-santa-maria'
    ) returning id into el_puerto_period_id;
  else
    update public.music_accompaniment_periods
    set
      step_entity_id = el_puerto_step_id,
      position = 'Tras el paso de misterio',
      year_from = 2024,
      year_to = null,
      is_current = true,
      notes = 'Vinculación vigente en 2026. La unión alcanza su tercer año consecutivo, por lo que el inicio se sitúa en 2024.',
      status = 'published',
      public_brotherhood_name = 'Hermandad de la Sagrada Oración en el Huerto',
      public_step_name = 'Paso de misterio de Nuestro Señor Jesucristo en la Sagrada Oración en el Huerto',
      public_brotherhood_slug = 'hermandad-oracion-huerto-el-puerto-de-santa-maria',
      updated_at = now()
    where id = el_puerto_period_id;
  end if;

  -- Acompañamiento vigente · Castilblanco de los Arroyos.
  select id into castilblanco_period_id
  from public.music_accompaniment_periods
  where band_entity_id = band_id
    and brotherhood_entity_id = castilblanco_brotherhood_id
    and outing_type = 'Sábado Santo'
    and is_current
    and status <> 'archived'
  order by created_at
  limit 1;

  if castilblanco_period_id is null then
    insert into public.music_accompaniment_periods (
      brotherhood_entity_id, band_entity_id, step_entity_id,
      position, outing_type, year_from, is_current, notes, status,
      public_brotherhood_name, public_step_name, public_brotherhood_slug
    ) values (
      castilblanco_brotherhood_id,
      band_id,
      castilblanco_step_id,
      'Tras el paso del Cristo',
      'Sábado Santo',
      2024,
      true,
      'Acompañamiento estrenado en 2024 y vigente en la Semana Santa de 2026.',
      'published',
      'Hermandad del Santo Entierro de Castilblanco de los Arroyos',
      'Paso del Santísimo Cristo de la Misericordia en su Santo Entierro',
      'santo-entierro-castilblanco-de-los-arroyos'
    ) returning id into castilblanco_period_id;
  else
    update public.music_accompaniment_periods
    set
      step_entity_id = castilblanco_step_id,
      position = 'Tras el paso del Cristo',
      year_from = 2024,
      year_to = null,
      is_current = true,
      notes = 'Acompañamiento estrenado en 2024 y vigente en la Semana Santa de 2026.',
      status = 'published',
      public_brotherhood_name = 'Hermandad del Santo Entierro de Castilblanco de los Arroyos',
      public_step_name = 'Paso del Santísimo Cristo de la Misericordia en su Santo Entierro',
      public_brotherhood_slug = 'santo-entierro-castilblanco-de-los-arroyos',
      updated_at = now()
    where id = castilblanco_period_id;
  end if;

  -- Fuentes · El Puerto.
  select id into source_el_puerto_current_id
  from public.sources
  where url = 'https://www.elpuertodesantamaria.es/semana-santa-2026'
  order by created_at
  limit 1;

  if source_el_puerto_current_id is null then
    insert into public.sources (
      name, url, source_type, author_or_publisher, accessed_at
    ) values (
      'Semana Santa 2026 · El Puerto de Santa María',
      'https://www.elpuertodesantamaria.es/semana-santa-2026',
      'Fuente institucional',
      'Ayuntamiento de El Puerto de Santa María',
      '2026-08-19'
    ) returning id into source_el_puerto_current_id;
  end if;

  select id into source_el_puerto_start_id
  from public.sources
  where url = 'https://elpuertoalminuto.es/art/14667/la-agrupacion-musical-nuestra-senora-de-la-encarnacion-de-sevilla-continua-con-oracion-en-el-huerto'
  order by created_at
  limit 1;

  if source_el_puerto_start_id is null then
    insert into public.sources (
      name, url, source_type, author_or_publisher, publication_date, accessed_at
    ) values (
      'La Encarnación continúa con Oración en el Huerto',
      'https://elpuertoalminuto.es/art/14667/la-agrupacion-musical-nuestra-senora-de-la-encarnacion-de-sevilla-continua-con-oracion-en-el-huerto',
      'Prensa cofrade',
      'El Puerto al minuto',
      '2026-03-19',
      '2026-08-19'
    ) returning id into source_el_puerto_start_id;
  end if;

  -- Fuentes · Castilblanco.
  select id into source_castilblanco_current_id
  from public.sources
  where url = 'https://www.castilblancodelosarroyos.es/es/actualidad/noticias/Castilblanco-encara-sus-dias-grandes-recorridos-horarios-y-novedades-de-la-recta-final-de-la-Semana-Santa-2026/'
  order by created_at
  limit 1;

  if source_castilblanco_current_id is null then
    insert into public.sources (
      name, url, source_type, author_or_publisher, accessed_at
    ) values (
      'Semana Santa 2026 · Castilblanco de los Arroyos',
      'https://www.castilblancodelosarroyos.es/es/actualidad/noticias/Castilblanco-encara-sus-dias-grandes-recorridos-horarios-y-novedades-de-la-recta-final-de-la-Semana-Santa-2026/',
      'Fuente institucional',
      'Ayuntamiento de Castilblanco de los Arroyos',
      '2026-08-19'
    ) returning id into source_castilblanco_current_id;
  end if;

  select id into source_castilblanco_start_id
  from public.sources
  where url = 'https://www.castilblancodelosarroyos.es/es/actualidad/noticias/Horarios-recorridos-y-estrenos-de-las-Hermandades-de-Penitencia-para-esta-Semana-Santa-2024/'
  order by created_at
  limit 1;

  if source_castilblanco_start_id is null then
    insert into public.sources (
      name, url, source_type, author_or_publisher, publication_date, accessed_at
    ) values (
      'Semana Santa 2024 · estreno musical del Santo Entierro de Castilblanco',
      'https://www.castilblancodelosarroyos.es/es/actualidad/noticias/Horarios-recorridos-y-estrenos-de-las-Hermandades-de-Penitencia-para-esta-Semana-Santa-2024/',
      'Fuente institucional',
      'Ayuntamiento de Castilblanco de los Arroyos',
      '2024-03-26',
      '2026-08-19'
    ) returning id into source_castilblanco_start_id;
  end if;

  -- Enlaces fuente → periodo musical.
  if not exists (
    select 1 from public.source_links
    where source_id = source_el_puerto_current_id
      and music_accompaniment_period_id = el_puerto_period_id
  ) then
    insert into public.source_links (source_id, music_accompaniment_period_id, scope)
    values (source_el_puerto_current_id, el_puerto_period_id, 'Acompañamiento musical vigente en 2026');
  end if;

  if not exists (
    select 1 from public.source_links
    where source_id = source_el_puerto_start_id
      and music_accompaniment_period_id = el_puerto_period_id
  ) then
    insert into public.source_links (source_id, music_accompaniment_period_id, scope)
    values (source_el_puerto_start_id, el_puerto_period_id, 'Antigüedad del vínculo: tercer año consecutivo en 2026');
  end if;

  if not exists (
    select 1 from public.source_links
    where source_id = source_castilblanco_current_id
      and music_accompaniment_period_id = castilblanco_period_id
  ) then
    insert into public.source_links (source_id, music_accompaniment_period_id, scope)
    values (source_castilblanco_current_id, castilblanco_period_id, 'Acompañamiento musical vigente en 2026');
  end if;

  if not exists (
    select 1 from public.source_links
    where source_id = source_castilblanco_start_id
      and music_accompaniment_period_id = castilblanco_period_id
  ) then
    insert into public.source_links (source_id, music_accompaniment_period_id, scope)
    values (source_castilblanco_start_id, castilblanco_period_id, 'Inicio documentado del vínculo en 2024');
  end if;
end
$$;
