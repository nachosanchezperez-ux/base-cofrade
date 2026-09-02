-- Cierre editorial · La Bofetá
-- Solo DML sobre el modelo First Edition existente. No introduce DDL ni RLS.

do $$
declare
  v_brotherhood_id uuid;
  v_mystery_step_id uuid;
  v_palio_step_id uuid;
  v_jesus_id uuid;
  v_virgin_id uuid;
  v_san_juan_id uuid;
  v_cristo_id uuid;
  v_secondary_id uuid;
  v_castillo_id uuid;
  v_source_council_id uuid;
  v_figure record;
begin
  select id into strict v_brotherhood_id
  from public.entities
  where slug = 'hermandad-del-dulce-nombre-sevilla';

  select id into strict v_mystery_step_id
  from public.entities
  where slug = 'paso-misterio-jesus-ante-anas';

  select id into strict v_palio_step_id
  from public.entities
  where slug = 'paso-palio-maria-santisima-dulce-nombre-sevilla';

  select id into strict v_virgin_id
  from public.entities
  where slug = 'maria-santisima-del-dulce-nombre-sevilla';

  select id into strict v_castillo_id
  from public.entities
  where slug = 'antonio-castillo-lastrucci';

  insert into public.sources (name, url, source_type, author_or_publisher, accessed_at, notes)
  values
    ('Dulce Nombre · Jesús ante Anás', 'https://hermandaddeldulcenombre.org/jesus-ante-anas/', 'Web oficial', 'Hermandad del Dulce Nombre', date '2026-09-01', 'Iconografía, autoría, materiales, cronología e intervenciones.'),
    ('Dulce Nombre · María Santísima del Dulce Nombre', 'https://hermandaddeldulcenombre.org/dulce-nombre/', 'Web oficial', 'Hermandad del Dulce Nombre', date '2026-09-01', 'Autoría, tipología y restauración de la dolorosa.'),
    ('Dulce Nombre · San Juan Evangelista', 'https://hermandaddeldulcenombre.org/san-juan-evangelista/', 'Web oficial', 'Hermandad del Dulce Nombre', date '2026-09-01', 'Autoría, cronología e intervenciones del titular.'),
    ('Dulce Nombre · Santo Cristo del Mayor Dolor', 'https://hermandaddeldulcenombre.org/cristo-mayor-dolor/', 'Web oficial', 'Hermandad del Dulce Nombre', date '2026-09-01', 'Autoría anónima, atribuciones, materiales, dimensiones e intervenciones.'),
    ('Dulce Nombre · patrimonio procesional', 'https://www.hermandades-de-sevilla.org/semanasanta/mt_la_bofeta.html', 'Fuente institucional', 'Consejo General de Hermandades y Cofradías de Sevilla', date '2026-09-01', 'Descripción vigente de pasos, hábito, capataces y acompañamientos.')
  on conflict do nothing;

  select id into v_source_council_id
  from public.sources
  where url = 'https://www.hermandades-de-sevilla.org/semanasanta/mt_la_bofeta.html'
  order by created_at
  limit 1;

  update public.entities
  set
    name = 'Paso de misterio de Nuestro Padre Jesús ante Anás',
    summary = 'Paso neobarroco de 1945 que representa el interrogatorio de Jesús ante Anás y la bofetada de Malco.',
    status = 'published',
    updated_at = now()
  where id = v_mystery_step_id;

  insert into public.steps (
    entity_id, step_type, current_condition, description, style, materials,
    execution_date_text, carrier_system, current_state_notes
  ) values (
    v_mystery_step_id,
    'Misterio',
    'preserved',
    'Representa el interrogatorio de Jesús ante Anás. Junto al Señor figuran Anás, dos sanedritas, Malco, un falso acusador y un soldado romano. El paso fue diseñado por Juan Pérez Calvo y tallado por Rafael Fernández del Toro en 1945; incorpora cartelas de Luis Ortega Bru, respiraderos de Antonio Vega Sánchez de 1977 y querubines de Manuel José Lara Parrado de 2016.',
    'Neobarroco',
    'Madera tallada y dorada',
    '1945; incorporaciones posteriores documentadas en 1977 y 2016',
    'Costaleros',
    'Restaurado entre 2016 y 2018.'
  )
  on conflict (entity_id) do update set
    step_type = excluded.step_type,
    current_condition = excluded.current_condition,
    description = excluded.description,
    style = excluded.style,
    materials = excluded.materials,
    execution_date_text = excluded.execution_date_text,
    carrier_system = excluded.carrier_system,
    current_state_notes = excluded.current_state_notes;

  update public.entities
  set
    name = 'Paso de palio de María Santísima del Dulce Nombre',
    summary = 'Paso de palio de terciopelo azul y bordados en oro, con conjunto histórico de Juan Manuel Rodríguez Ojeda.',
    status = 'published',
    updated_at = now()
  where id = v_palio_step_id;

  insert into public.steps (
    entity_id, step_type, current_condition, description, style, materials,
    execution_date_text, carrier_system, current_state_notes
  ) values (
    v_palio_step_id,
    'Palio',
    'preserved',
    'María Santísima del Dulce Nombre procesiona acompañada por San Juan Evangelista. El palio y el manto, bordados en oro sobre terciopelo azul, proceden del taller de Juan Manuel Rodríguez Ojeda (1922-1923). El conjunto conserva varales de Andrés Contreras de 1942, peana de Seco de 1921, candelería y templete de Jesús Domínguez Vázquez, respiraderos de Ángel Gabella de 1992 y candelabros de cola de Emilio Méndez Picón de 1995-1996.',
    'Regionalista',
    'Terciopelo azul bordado en oro y orfebrería plateada',
    '1921-1923; conjunto completado durante el siglo XX',
    'Costaleros',
    'El manto fue pasado a nuevo terciopelo y restaurado por Jesús Rosado en 2018.'
  )
  on conflict (entity_id) do update set
    step_type = excluded.step_type,
    current_condition = excluded.current_condition,
    description = excluded.description,
    style = excluded.style,
    materials = excluded.materials,
    execution_date_text = excluded.execution_date_text,
    carrier_system = excluded.carrier_system,
    current_state_notes = excluded.current_state_notes;

  update public.brotherhood_steps
  set status = 'published'
  where brotherhood_entity_id = v_brotherhood_id
    and step_entity_id in (v_mystery_step_id, v_palio_step_id);

  update public.entities
  set
    summary = 'Dolorosa de candelero realizada por Antonio Castillo Lastrucci en 1924, acompañada por San Juan Evangelista.',
    status = 'published',
    updated_at = now()
  where id = v_virgin_id;

  update public.images
  set
    image_type = 'Dolorosa',
    execution_date_text = '1924',
    material = 'Madera policromada',
    technique = 'Talla de candelero',
    anatomical_type = 'Imagen de vestir',
    is_dress_image = true,
    description = 'Dolorosa juvenil de rasgos castizos que abrió una tipología regionalista muy difundida en la imaginería sevillana.',
    current_condition = 'extant',
    current_state_notes = 'Intervenida por el autor en 1927 y restaurada por Carmen Bahima, con apoyo de Alberto Pérez Rojas, en 2015-2016.'
  where entity_id = v_virgin_id;

  update public.brotherhood_images
  set relation_type = 'titular', status = 'published'
  where brotherhood_entity_id = v_brotherhood_id and image_entity_id = v_virgin_id;

  update public.image_authorships
  set status = 'published', certainty = 'documented', date_from_text = '1924'
  where image_entity_id = v_virgin_id and agent_entity_id = v_castillo_id;

  select id into v_jesus_id from public.entities where slug = 'nuestro-padre-jesus-ante-anas-sevilla';
  if v_jesus_id is null then
    insert into public.entities (entity_type, name, slug, summary, status)
    values ('image', 'Nuestro Padre Jesús ante Anás', 'nuestro-padre-jesus-ante-anas-sevilla', 'Titular cristífero de la Hermandad del Dulce Nombre, realizado por Antonio Castillo Lastrucci en 1922-1923.', 'published')
    returning id into v_jesus_id;
  end if;

  insert into public.images (
    entity_id, image_type, execution_date_text, material, technique,
    current_condition, description, iconography, anatomical_type,
    is_dress_image, current_state_notes
  ) values (
    v_jesus_id, 'Cristo cautivo', '1922-1923', 'Madera de cedro y pino', 'Talla policromada',
    'extant', 'Jesús aparece preso y maniatado, erguido ante Anás durante el interrogatorio.',
    'Interrogatorio de Jesús ante Anás', 'Talla completa', true,
    'Intervenido por el taller Isbilia en 1990 y por Carmen Bahima en 2014-2015.'
  ) on conflict (entity_id) do update set
    image_type = excluded.image_type, execution_date_text = excluded.execution_date_text,
    material = excluded.material, technique = excluded.technique,
    current_condition = excluded.current_condition, description = excluded.description,
    iconography = excluded.iconography, anatomical_type = excluded.anatomical_type,
    is_dress_image = excluded.is_dress_image, current_state_notes = excluded.current_state_notes;

  insert into public.brotherhood_images (brotherhood_entity_id, image_entity_id, relation_type, date_from_text, notes, status)
  select v_brotherhood_id, v_jesus_id, 'titular', 'Bendecido el 11 de marzo de 1923', 'Titular cristífero actual.', 'published'
  where not exists (select 1 from public.brotherhood_images where brotherhood_entity_id=v_brotherhood_id and image_entity_id=v_jesus_id);

  insert into public.image_authorships (image_entity_id, agent_entity_id, authorship_type, role_name, date_from_text, certainty, status)
  select v_jesus_id, v_castillo_id, 'author', 'autor', '1922-1923', 'documented', 'published'
  where not exists (select 1 from public.image_authorships where image_entity_id=v_jesus_id and agent_entity_id=v_castillo_id and authorship_type='author');

  -- Las seis figuras secundarias del misterio se modelan como imágenes
  -- independientes vinculadas al paso, no como titulares de culto.
  for v_figure in select * from (values
    ('anas-misterio-bofeta-sevilla', 'Anás del misterio de la Bofetá', 'Representación de Anás que preside el interrogatorio de Jesús.', 'Anás aparece sentado presidiendo el interrogatorio de Jesús.', 'Anás durante el interrogatorio de Jesús'),
    ('malco-misterio-bofeta-sevilla', 'Malco del misterio de la Bofetá', 'Sayón que abofetea a Jesús en el misterio de la Hermandad del Dulce Nombre.', 'Malco ejecuta la bofetada que da nombre popular al misterio y a la cofradía.', 'Malco abofetea a Jesús'),
    ('sanedrita-primero-misterio-bofeta-sevilla', 'Primer sanedrita del misterio de la Bofetá', 'Uno de los dos miembros del Sanedrín que presencian el interrogatorio de Jesús.', 'Figura secundaria que presencia la comparecencia de Jesús ante Anás.', 'Sanedrita durante el interrogatorio de Jesús'),
    ('sanedrita-segundo-misterio-bofeta-sevilla', 'Segundo sanedrita del misterio de la Bofetá', 'Uno de los dos miembros del Sanedrín que presencian el interrogatorio de Jesús.', 'Figura secundaria que presencia la comparecencia de Jesús ante Anás.', 'Sanedrita durante el interrogatorio de Jesús'),
    ('falso-acusador-misterio-bofeta-sevilla', 'Falso acusador del misterio de la Bofetá', 'Testigo arrodillado que acusa a Jesús en la escena ante Anás.', 'El falso acusador aparece arrodillado y señalando al Señor durante el interrogatorio.', 'Falso acusador ante Jesús'),
    ('soldado-romano-misterio-bofeta-sevilla', 'Soldado romano del misterio de la Bofetá', 'Soldado que custodia a Jesús durante su comparecencia ante Anás.', 'El soldado romano custodia al Redentor y completa la composición escenográfica del misterio.', 'Soldado romano durante el interrogatorio de Jesús')
  ) x(slug, name, summary, description, iconography)
  loop
    select id into v_secondary_id from public.entities where slug=v_figure.slug;

    if v_secondary_id is null then
      insert into public.entities (entity_type, name, slug, summary, status)
      values ('image', v_figure.name, v_figure.slug, v_figure.summary, 'published')
      returning id into v_secondary_id;
    else
      update public.entities
      set name=v_figure.name, summary=v_figure.summary, status='published', updated_at=now()
      where id=v_secondary_id;
    end if;

    insert into public.images (
      entity_id, image_type, execution_date_text, material, technique,
      current_condition, description, iconography, anatomical_type,
      current_state_notes
    ) values (
      v_secondary_id, 'Figura de misterio', '1922-1923', 'Madera de cedro y pino',
      'Talla policromada', 'extant', v_figure.description, v_figure.iconography, 'Talla completa',
      'Forma parte del conjunto escultórico original estrenado el Martes Santo de 1923.'
    ) on conflict (entity_id) do update set
      image_type=excluded.image_type,
      execution_date_text=excluded.execution_date_text,
      material=excluded.material,
      technique=excluded.technique,
      current_condition=excluded.current_condition,
      description=excluded.description,
      iconography=excluded.iconography,
      anatomical_type=excluded.anatomical_type,
      current_state_notes=excluded.current_state_notes;

    insert into public.image_authorships (
      image_entity_id, agent_entity_id, authorship_type, role_name,
      date_from_text, certainty, notes, status
    )
    select v_secondary_id, v_castillo_id, 'author', 'autor', '1922-1923',
      'documented', 'Autoría del conjunto escultórico del misterio.', 'published'
    where not exists (
      select 1 from public.image_authorships
      where image_entity_id=v_secondary_id
        and agent_entity_id=v_castillo_id
        and authorship_type='author'
    );

    insert into public.image_steps (
      image_entity_id, step_entity_id, relation_type, date_from_text, notes, status
    )
    select v_secondary_id, v_mystery_step_id, 'processes_on', 'Desde 1923',
      'Figura secundaria del conjunto escultórico original del misterio.', 'published'
    where not exists (
      select 1 from public.image_steps
      where image_entity_id=v_secondary_id
        and step_entity_id=v_mystery_step_id
        and relation_type='processes_on'
    );

    insert into public.source_links (source_id, entity_id, scope, notes)
    select s.id, v_secondary_id, 'Figura secundaria del misterio',
      'La fuente oficial documenta la composición y la autoría del conjunto escultórico.'
    from public.sources s
    where s.url='https://hermandaddeldulcenombre.org/jesus-ante-anas/'
      and not exists (
        select 1 from public.source_links sl
        where sl.source_id=s.id and sl.entity_id=v_secondary_id
      );
  end loop;

  select id into v_san_juan_id from public.entities where slug = 'san-juan-evangelista-dulce-nombre-sevilla';
  if v_san_juan_id is null then
    insert into public.entities (entity_type, name, slug, summary, status)
    values ('image', 'San Juan Evangelista', 'san-juan-evangelista-dulce-nombre-sevilla', 'Titular realizado por Antonio Castillo Lastrucci en 1924 para acompañar a María Santísima del Dulce Nombre.', 'published')
    returning id into v_san_juan_id;
  end if;

  insert into public.images (
    entity_id, image_type, execution_date_text, material, technique,
    current_condition, description, iconography, anatomical_type,
    is_dress_image, current_state_notes
  ) values (
    v_san_juan_id, 'San Juan Evangelista', '1924', 'Madera policromada', 'Talla de vestir',
    'extant', 'San Juan acompaña a la Virgen del Dulce Nombre en la escena de la calle de la Amargura.',
    'San Juan junto a la Virgen María', 'Imagen de vestir', true,
    'Las manos actuales son de Antonio Eslava Rubio (1956); restaurado por Carmen Bahima en 2015.'
  ) on conflict (entity_id) do update set
    image_type = excluded.image_type, execution_date_text = excluded.execution_date_text,
    material = excluded.material, technique = excluded.technique,
    current_condition = excluded.current_condition, description = excluded.description,
    iconography = excluded.iconography, anatomical_type = excluded.anatomical_type,
    is_dress_image = excluded.is_dress_image, current_state_notes = excluded.current_state_notes;

  insert into public.brotherhood_images (brotherhood_entity_id, image_entity_id, relation_type, date_from_text, notes, status)
  select v_brotherhood_id, v_san_juan_id, 'titular', '1924', 'Cotitular que acompaña a la Virgen del Dulce Nombre.', 'published'
  where not exists (select 1 from public.brotherhood_images where brotherhood_entity_id=v_brotherhood_id and image_entity_id=v_san_juan_id);

  insert into public.image_authorships (image_entity_id, agent_entity_id, authorship_type, role_name, date_from_text, certainty, status)
  select v_san_juan_id, v_castillo_id, 'author', 'autor', '1924', 'documented', 'published'
  where not exists (select 1 from public.image_authorships where image_entity_id=v_san_juan_id and agent_entity_id=v_castillo_id and authorship_type='author');

  select id into v_cristo_id from public.entities where slug = 'santo-cristo-mayor-dolor-dulce-nombre-sevilla';
  if v_cristo_id is null then
    insert into public.entities (entity_type, name, slug, summary, status)
    values ('image', 'Santo Cristo del Mayor Dolor', 'santo-cristo-mayor-dolor-dulce-nombre-sevilla', 'Crucificado manierista anónimo de hacia 1600, titular de la Hermandad del Dulce Nombre.', 'published')
    returning id into v_cristo_id;
  end if;

  insert into public.images (
    entity_id, image_type, execution_date_text, material, technique, dimensions_text,
    height_cm, current_condition, description, iconography, anatomical_type,
    is_dress_image, current_state_notes, notes
  ) values (
    v_cristo_id, 'Crucificado', 'Hacia 1600', 'Madera de ciprés', 'Talla policromada', '133 cm de altura',
    133, 'extant', 'Crucificado manierista de tamaño algo menor del natural y autoría documentalmente anónima.',
    'Cristo muerto en la cruz', 'Talla completa', false,
    'Restaurado por Sebastián Santos Rojas en 1941, por el taller Isbilia en 1990 y por Carmen Bahima entre 2019 y 2020.',
    'La bibliografía lo ha relacionado con Juan de Oviedo y de la Bandera y con Andrés de Ocampo, sin convertir esas propuestas en autoría documentada.'
  ) on conflict (entity_id) do update set
    image_type = excluded.image_type, execution_date_text = excluded.execution_date_text,
    material = excluded.material, technique = excluded.technique,
    dimensions_text = excluded.dimensions_text, height_cm = excluded.height_cm,
    current_condition = excluded.current_condition, description = excluded.description,
    iconography = excluded.iconography, anatomical_type = excluded.anatomical_type,
    is_dress_image = excluded.is_dress_image, current_state_notes = excluded.current_state_notes,
    notes = excluded.notes;

  insert into public.brotherhood_images (brotherhood_entity_id, image_entity_id, relation_type, date_from_text, notes, status)
  select v_brotherhood_id, v_cristo_id, 'titular', 'Vinculación histórica', 'Titular cristífero de culto; no forma parte de los dos pasos del Martes Santo.', 'published'
  where not exists (select 1 from public.brotherhood_images where brotherhood_entity_id=v_brotherhood_id and image_entity_id=v_cristo_id);

  insert into public.image_steps (image_entity_id, step_entity_id, relation_type, date_from_text, notes, status)
  select d.image_id, d.step_id, 'processes_on', d.date_text, d.notes, 'published'
  from (values
    (v_jesus_id, v_mystery_step_id, 'Desde 1923', 'Imagen principal del misterio de Jesús ante Anás.'),
    (v_virgin_id, v_palio_step_id, 'Desde 1924', 'Imagen principal del paso de palio.'),
    (v_san_juan_id, v_palio_step_id, 'Desde 1924', 'Acompaña a la Virgen en el paso de palio.')
  ) as d(image_id, step_id, date_text, notes)
  where not exists (
    select 1 from public.image_steps existing
    where existing.image_entity_id=d.image_id and existing.step_entity_id=d.step_id and existing.relation_type='processes_on'
  );

  insert into public.brotherhood_habits (
    brotherhood_entity_id, name, tunic_description, hood_description,
    cord_description, shield_description, sort_order, notes, status
  )
  select v_brotherhood_id, 'Hábito penitencial', 'Túnica blanca de cola',
    'Antifaz blanco con la cruz trinitaria', 'Cinturón estrecho de esparto',
    'Cruz trinitaria sobre el antifaz', 1,
    'Descripción institucional vigente para la estación de penitencia.', 'published'
  where not exists (select 1 from public.brotherhood_habits where brotherhood_entity_id=v_brotherhood_id);

  insert into public.brotherhood_colors (brotherhood_entity_id, color_name, hex_value, color_role, sort_order, notes, status)
  values
    (v_brotherhood_id, 'Blanco', '#FFFFFF', 'primary', 1, 'Color del hábito penitencial.', 'published'),
    (v_brotherhood_id, 'Morado', null, 'secondary', 2, 'Color identitario asociado a la cruz trinitaria; sin fijar un HEX institucional.', 'published')
  on conflict (brotherhood_entity_id, color_name) do update set
    hex_value=excluded.hex_value, color_role=excluded.color_role, sort_order=excluded.sort_order,
    notes=excluded.notes, status=excluded.status, updated_at=now();

  insert into public.source_links (source_id, entity_id, scope, notes)
  select s.id, d.entity_id, d.scope, 'Cierre editorial de La Bofetá · septiembre de 2026'
  from (values
    ('https://hermandaddeldulcenombre.org/jesus-ante-anas/', v_jesus_id, 'Ficha del titular'),
    ('https://hermandaddeldulcenombre.org/dulce-nombre/', v_virgin_id, 'Ficha del titular'),
    ('https://hermandaddeldulcenombre.org/san-juan-evangelista/', v_san_juan_id, 'Ficha del titular'),
    ('https://hermandaddeldulcenombre.org/cristo-mayor-dolor/', v_cristo_id, 'Ficha del titular'),
    ('https://www.hermandades-de-sevilla.org/semanasanta/mt_la_bofeta.html', v_mystery_step_id, 'Descripción patrimonial del paso'),
    ('https://www.hermandades-de-sevilla.org/semanasanta/mt_la_bofeta.html', v_palio_step_id, 'Descripción patrimonial del paso')
  ) d(source_url, entity_id, scope)
  join public.sources s on s.url=d.source_url
  where not exists (select 1 from public.source_links sl where sl.source_id=s.id and sl.entity_id=d.entity_id and sl.scope=d.scope);

  insert into public.source_links (source_id, brotherhood_habit_id, scope, notes)
  select v_source_council_id, h.id, 'Hábito penitencial', 'Ficha institucional vigente.'
  from public.brotherhood_habits h
  where h.brotherhood_entity_id=v_brotherhood_id
    and v_source_council_id is not null
    and not exists (select 1 from public.source_links sl where sl.source_id=v_source_council_id and sl.brotherhood_habit_id=h.id);

  insert into public.source_links (source_id, music_accompaniment_period_id, scope, notes)
  select v_source_council_id, m.id, 'Acompañamiento del Martes Santo', 'Ficha institucional vigente.'
  from public.music_accompaniment_periods m
  where m.brotherhood_entity_id=v_brotherhood_id and m.is_current
    and v_source_council_id is not null
    and not exists (select 1 from public.source_links sl where sl.source_id=v_source_council_id and sl.music_accompaniment_period_id=m.id);
end
$$;

do $$
declare
  v_brotherhood_id uuid;
  v_mystery_step_id uuid;
  v_palio_step_id uuid;
  v_council_source_id uuid;
  d record;
  v_agent_id uuid;
  v_period_id uuid;
begin
  select id into strict v_brotherhood_id from public.entities where slug='hermandad-del-dulce-nombre-sevilla';
  select id into strict v_mystery_step_id from public.entities where slug='paso-misterio-jesus-ante-anas';
  select id into strict v_palio_step_id from public.entities where slug='paso-palio-maria-santisima-dulce-nombre-sevilla';
  select id into v_council_source_id from public.sources where url='https://www.hermandades-de-sevilla.org/semanasanta/mt_la_bofeta.html' order by created_at limit 1;

  for d in select * from (values
    ('manuel-gallego-rodriguez','Manuel Gallego Rodríguez',v_mystery_step_id),
    ('alberto-gallego-rodriguez','Alberto Gallego Rodríguez',v_mystery_step_id),
    ('miguel-gallego','Miguel Gallego',v_palio_step_id),
    ('rafael-gonzalez-ibanez','Rafael González Ibáñez',v_palio_step_id)
  ) x(slug,name,step_id)
  loop
    select id into v_agent_id from public.entities where slug=d.slug;
    if v_agent_id is null then
      insert into public.entities(entity_type,name,slug,summary,status)
      values('agent',d.name,d.slug,'Capataz documentado en la ficha institucional vigente de la Hermandad del Dulce Nombre.','published')
      returning id into v_agent_id;
    end if;

    insert into public.agents(entity_id,agent_kind,description)
    values(v_agent_id,'person','Capataz de paso procesional.')
    on conflict(entity_id) do update set agent_kind=excluded.agent_kind,description=excluded.description;

    select id into v_period_id from public.step_personnel_periods
    where step_entity_id=d.step_id and agent_entity_id=v_agent_id and role_name='Capataz' and is_current
    order by created_at limit 1;

    if v_period_id is null then
      insert into public.step_personnel_periods(step_entity_id,agent_entity_id,role_name,date_from_text,is_current,notes,status)
      values(d.step_id,v_agent_id,'Capataz','Vigente en 2026',true,'Responsabilidad actual documentada por el Consejo de Hermandades.','published')
      returning id into v_period_id;
    end if;

    if v_council_source_id is not null and not exists (
      select 1 from public.source_links where source_id=v_council_source_id and step_personnel_period_id=v_period_id
    ) then
      insert into public.source_links(source_id,step_personnel_period_id,scope,notes)
      values(v_council_source_id,v_period_id,'Capataz actual','Ficha institucional vigente, consultada el 1 de septiembre de 2026.');
    end if;
  end loop;

  if (select count(*) from public.brotherhood_images where brotherhood_entity_id=v_brotherhood_id and status='published') <> 4 then
    raise exception 'La Bofetá debe quedar con sus cuatro titulares publicados';
  end if;
  if (select count(*) from public.brotherhood_steps where brotherhood_entity_id=v_brotherhood_id and status='published') <> 2 then
    raise exception 'La Bofetá debe quedar con sus dos pasos publicados';
  end if;
  if (select count(*) from public.music_accompaniment_periods where brotherhood_entity_id=v_brotherhood_id and is_current and status='published') <> 2 then
    raise exception 'La Bofetá debe conservar sus dos acompañamientos actuales';
  end if;
  if (
    select count(*)
    from public.image_steps ist
    join public.entities image_entity on image_entity.id=ist.image_entity_id
    where ist.step_entity_id=v_mystery_step_id
      and ist.relation_type='processes_on'
      and ist.status='published'
      and image_entity.slug in (
        'nuestro-padre-jesus-ante-anas-sevilla',
        'anas-misterio-bofeta-sevilla',
        'malco-misterio-bofeta-sevilla',
        'sanedrita-primero-misterio-bofeta-sevilla',
        'sanedrita-segundo-misterio-bofeta-sevilla',
        'falso-acusador-misterio-bofeta-sevilla',
        'soldado-romano-misterio-bofeta-sevilla'
      )
  ) <> 7 then
    raise exception 'El misterio de la Bofetá debe quedar compuesto por Jesús y sus seis figuras secundarias';
  end if;
end
$$;
