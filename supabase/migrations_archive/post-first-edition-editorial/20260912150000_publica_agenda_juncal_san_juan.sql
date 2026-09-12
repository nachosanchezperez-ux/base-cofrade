begin;

do $$
declare
  v_juncal_outing_id uuid;
  v_juncal_source_id uuid;
  v_municipality_id uuid;
  v_parish_id uuid;
  v_poncel_id uuid;
  v_brotherhood_id uuid;
  v_image_id uuid;
  v_rosary_outing_id uuid;
  v_rosary_source_id uuid;
begin
  -- Juncal: el cartel oficial completa la entrada y corrige el itinerario.
  select id
    into v_juncal_outing_id
  from public.outings
  where slug = 'nuestra-senora-juncal-salida-2026';

  if v_juncal_outing_id is null then
    raise exception 'No se encuentra la salida procesional del Juncal de 2026';
  end if;

  update public.outings
  set departure_time = time '19:00',
      return_time = time '23:45',
      route = jsonb_build_object(
        'itineraries', jsonb_build_array(
          jsonb_build_object(
            'id', 'route',
            'label', 'Recorrido',
            'points', jsonb_build_array(
              jsonb_build_object('id', 'p01', 'role', 'start', 'label', 'Plaza del Sella'),
              jsonb_build_object('id', 'p02', 'role', 'stop', 'label', 'Araquil'),
              jsonb_build_object('id', 'p03', 'role', 'stop', 'label', 'Alberche'),
              jsonb_build_object('id', 'p04', 'role', 'stop', 'label', 'Avenida Alcalde Juan Fernández'),
              jsonb_build_object('id', 'p05', 'role', 'stop', 'label', 'Claudio Guerín'),
              jsonb_build_object('id', 'p06', 'role', 'stop', 'label', 'Madre Isabel Moreno'),
              jsonb_build_object('id', 'p07', 'role', 'stop', 'label', 'Pablo Legote'),
              jsonb_build_object('id', 'p08', 'role', 'stop', 'label', 'Ramón y Cajal'),
              jsonb_build_object('id', 'p09', 'role', 'stop', 'label', 'Avenida Alcalde Juan Fernández'),
              jsonb_build_object('id', 'p10', 'role', 'stop', 'label', 'Deva'),
              jsonb_build_object('id', 'p11', 'role', 'stop', 'label', 'Tambre'),
              jsonb_build_object('id', 'p12', 'role', 'stop', 'label', 'Almar'),
              jsonb_build_object('id', 'p13', 'role', 'stop', 'label', 'Segre'),
              jsonb_build_object('id', 'p14', 'role', 'stop', 'label', 'Guadiato'),
              jsonb_build_object('id', 'p15', 'role', 'stop', 'label', 'Lozoya'),
              jsonb_build_object('id', 'p16', 'role', 'stop', 'label', 'Plaza del Juncal'),
              jsonb_build_object('id', 'p17', 'role', 'stop', 'label', 'Avenida Alcalde Juan Fernández'),
              jsonb_build_object('id', 'p18', 'role', 'stop', 'label', 'Nalón'),
              jsonb_build_object('id', 'p19', 'role', 'stop', 'label', 'Araquil'),
              jsonb_build_object('id', 'p20', 'role', 'end', 'label', 'Plaza del Sella')
            )
          )
        )
      ),
      origin_text = 'Plaza del Sella',
      destination_text = 'Plaza del Sella',
      public_notes = 'Salida anunciada para las 19:00. La entrada está prevista a las 23:45 aproximadamente.',
      updated_at = now()
  where id = v_juncal_outing_id;

  -- La ficha de Glorias ya presenta salida y entrada desde los campos canónicos.
  -- Se retiran los dos hitos creados durante el Apply inicial para no duplicar
  -- ambas horas sobre los dos extremos del mismo circuito.
  delete from public.outing_schedule_items
  where outing_id = v_juncal_outing_id
    and item_date = date '2026-09-12'
    and sequence_no in (1, 2)
    and label in ('Salida procesional', 'Entrada');

  select id into v_juncal_source_id
  from public.sources
  where name = 'Cartel oficial · recorrido de Nuestra Señora del Juncal 2026'
  order by created_at
  limit 1;

  if v_juncal_source_id is null then
    insert into public.sources (
      name, url, source_type, author_or_publisher, publication_date,
      accessed_at, notes
    ) values (
      'Cartel oficial · recorrido de Nuestra Señora del Juncal 2026',
      null,
      'Cartel oficial',
      'Hermandad Sacramental del Juncal',
      null,
      date '2026-09-12',
      'Cartel oficial aportado directamente para documentar horario, itinerario y acompañamiento musical.'
    ) returning id into v_juncal_source_id;
  end if;

  if not exists (
    select 1 from public.source_links
    where source_id = v_juncal_source_id
      and outing_id = v_juncal_outing_id
  ) then
    insert into public.source_links (source_id, outing_id, scope, notes)
    values (
      v_juncal_source_id,
      v_juncal_outing_id,
      'Recorrido y horarios · 12 de septiembre de 2026',
      'Fuente oficial del horario de entrada y del itinerario completo.'
    );
  end if;

  -- Rosario Vespertino de Nuestra Señora de los Dolores · San Juan de Aznalfarache.
  insert into public.municipalities (name, slug, province, autonomous_community, country)
  values ('San Juan de Aznalfarache', 'san-juan-de-aznalfarache', 'Sevilla', 'Andalucía', 'España')
  on conflict (slug) do update set
    name = excluded.name,
    province = excluded.province,
    autonomous_community = excluded.autonomous_community,
    country = excluded.country
  returning id into v_municipality_id;

  insert into public.places (
    municipality_id, name, slug, place_type, address, notes, updated_at
  ) values (
    v_municipality_id,
    'Parroquia de San Juan Bautista',
    'parroquia-san-juan-bautista-san-juan-aznalfarache',
    'Parroquia',
    null,
    'Punto de salida y entrada del Rosario Vespertino del 19 de septiembre de 2026.',
    now()
  )
  on conflict (slug) do update set
    municipality_id = excluded.municipality_id,
    name = excluded.name,
    place_type = excluded.place_type,
    notes = excluded.notes,
    updated_at = now()
  returning id into v_parish_id;

  insert into public.places (
    municipality_id, name, slug, place_type, address, notes, updated_at
  ) values (
    v_municipality_id,
    'Plaza del Poncel',
    'plaza-poncel-san-juan-aznalfarache',
    'Plaza',
    null,
    'Lugar de la Eucaristía del Rosario Vespertino del 19 de septiembre de 2026.',
    now()
  )
  on conflict (slug) do update set
    municipality_id = excluded.municipality_id,
    name = excluded.name,
    place_type = excluded.place_type,
    notes = excluded.notes,
    updated_at = now()
  returning id into v_poncel_id;

  insert into public.entities (entity_type, name, slug, summary, status, updated_at)
  values (
    'brotherhood',
    'Hermandad Sacramental de San Juan Bautista',
    'hermandad-sacramental-san-juan-bautista-san-juan-aznalfarache',
    'Corporación sacramental de San Juan de Aznalfarache con sede en la Parroquia de San Juan Bautista.',
    'review',
    now()
  )
  on conflict (slug) do update set
    name = excluded.name,
    summary = coalesce(public.entities.summary, excluded.summary),
    status = case when public.entities.status = 'published' then 'published' else 'review' end,
    updated_at = now()
  returning id into v_brotherhood_id;

  insert into public.brotherhoods (
    entity_id, official_name, popular_name, municipality_id,
    canonical_see_place_id, instagram_url, brotherhood_types, notes
  ) values (
    v_brotherhood_id,
    'Hermandad Sacramental de San Juan Bautista',
    'San Juan Bautista',
    v_municipality_id,
    v_parish_id,
    'https://www.instagram.com/hdadsjbautista/',
    array['Sacramental'],
    'Identidad mínima en revisión; no se publica una ficha enciclopédica hasta completar sus datos.'
  )
  on conflict (entity_id) do update set
    official_name = excluded.official_name,
    popular_name = excluded.popular_name,
    municipality_id = excluded.municipality_id,
    canonical_see_place_id = excluded.canonical_see_place_id,
    instagram_url = coalesce(public.brotherhoods.instagram_url, excluded.instagram_url),
    brotherhood_types = case
      when cardinality(public.brotherhoods.brotherhood_types) > 0 then public.brotherhoods.brotherhood_types
      else excluded.brotherhood_types
    end,
    notes = coalesce(public.brotherhoods.notes, excluded.notes);

  insert into public.entities (entity_type, name, slug, summary, status, updated_at)
  values (
    'image',
    'Nuestra Señora de los Dolores',
    'nuestra-senora-dolores-san-juan-aznalfarache',
    'Titular mariana que preside el Rosario Vespertino de la Hermandad Sacramental de San Juan Bautista.',
    'review',
    now()
  )
  on conflict (slug) do update set
    name = excluded.name,
    summary = coalesce(public.entities.summary, excluded.summary),
    status = case when public.entities.status = 'published' then 'published' else 'review' end,
    updated_at = now()
  returning id into v_image_id;

  insert into public.images (entity_id, image_type, description, notes)
  values (
    v_image_id,
    'Dolorosa',
    'Nuestra Señora de los Dolores de la Hermandad Sacramental de San Juan Bautista.',
    'Datos artísticos pendientes de revisión documental.'
  )
  on conflict (entity_id) do update set
    image_type = coalesce(public.images.image_type, excluded.image_type),
    description = coalesce(public.images.description, excluded.description),
    notes = coalesce(public.images.notes, excluded.notes);

  if not exists (
    select 1
    from public.brotherhood_images
    where brotherhood_entity_id = v_brotherhood_id
      and image_entity_id = v_image_id
      and relation_type = 'titular'
      and status <> 'archived'
  ) then
    insert into public.brotherhood_images (
      brotherhood_entity_id, image_entity_id, relation_type, notes, status
    ) values (
      v_brotherhood_id,
      v_image_id,
      'titular',
      'Titular mariana que preside el Rosario Vespertino de septiembre.',
      'review'
    );
  end if;

  insert into public.outings (
    brotherhood_entity_id, outing_type, character, title, outing_date, year,
    departure_time, return_time, municipality_id, origin_place_id,
    destination_place_id, route_summary, route, description, public_notes,
    organizer_name, event_status, status, slug, reference_code,
    origin_text, destination_text, updated_at
  ) values (
    v_brotherhood_id,
    'Rosario Vespertino',
    'ordinary',
    'Rosario Vespertino presidido por Nuestra Señora de los Dolores 2026',
    date '2026-09-19',
    2026,
    time '17:30',
    time '23:30',
    v_municipality_id,
    v_parish_id,
    v_parish_id,
    'Parroquia de San Juan Bautista · Barriada de Guadalajara · Plaza del Poncel · regreso a la Parroquia de San Juan Bautista.',
    jsonb_build_object(
      'itineraries', jsonb_build_array(
        jsonb_build_object(
          'id', 'route',
          'label', 'Recorrido',
          'points', jsonb_build_array(
            jsonb_build_object('id', 'p01', 'role', 'start', 'label', 'Parroquia de San Juan Bautista'),
            jsonb_build_object('id', 'p02', 'role', 'stop', 'label', 'Paseo de las Nueve Aceituneras'),
            jsonb_build_object('id', 'p03', 'role', 'stop', 'label', 'Glorieta de la Hermandad Sacramental de San Juan Bautista'),
            jsonb_build_object('id', 'p04', 'role', 'stop', 'label', 'Antonio Machado'),
            jsonb_build_object('id', 'p05', 'role', 'stop', 'label', 'Ramón y Cajal'),
            jsonb_build_object('id', 'p06', 'role', 'stop', 'label', 'Regina Mundi'),
            jsonb_build_object('id', 'p07', 'role', 'stop', 'label', 'Paseo de las Erillas'),
            jsonb_build_object('id', 'p08', 'role', 'stop', 'label', 'Ali Menon'),
            jsonb_build_object('id', 'p09', 'role', 'stop', 'label', 'Plaza del Poncel'),
            jsonb_build_object('id', 'p10', 'role', 'stop', 'label', 'Don Cerebruno'),
            jsonb_build_object('id', 'p11', 'role', 'stop', 'label', 'Princesa Elima'),
            jsonb_build_object('id', 'p12', 'role', 'stop', 'label', 'Alvar Fáñez de Minaya'),
            jsonb_build_object('id', 'p13', 'role', 'stop', 'label', 'Brihuega'),
            jsonb_build_object('id', 'p14', 'role', 'stop', 'label', 'Paseo de las Erillas'),
            jsonb_build_object('id', 'p15', 'role', 'stop', 'label', 'Ramón y Cajal'),
            jsonb_build_object('id', 'p16', 'role', 'stop', 'label', 'Plaza de Andalucía'),
            jsonb_build_object('id', 'p17', 'role', 'stop', 'label', 'Real'),
            jsonb_build_object('id', 'p18', 'role', 'stop', 'label', 'Fernández Campos'),
            jsonb_build_object('id', 'p19', 'role', 'stop', 'label', 'Vicente Aleixandre'),
            jsonb_build_object('id', 'p20', 'role', 'stop', 'label', 'Plaza de la Mujer Trabajadora'),
            jsonb_build_object('id', 'p21', 'role', 'stop', 'label', 'Carmen de Burgos Colombine'),
            jsonb_build_object('id', 'p22', 'role', 'stop', 'label', 'Santísimo Cristo del Amor'),
            jsonb_build_object('id', 'p23', 'role', 'end', 'label', 'Parroquia de San Juan Bautista')
          )
        )
      )
    ),
    'Rosario Vespertino presidido por Nuestra Señora de los Dolores, con visita a la Barriada de Guadalajara.',
    'La Eucaristía comenzará a las 19:00 en la Plaza del Poncel.',
    'Hermandad Sacramental de San Juan Bautista',
    'announced',
    'published',
    'san-juan-aznalfarache-dolores-rosario-vespertino-2026-09-19',
    'SANJUAN-DOLOR-ROSARIO-2026',
    'Parroquia de San Juan Bautista',
    'Parroquia de San Juan Bautista',
    now()
  )
  on conflict (slug) where slug is not null do update set
    brotherhood_entity_id = excluded.brotherhood_entity_id,
    outing_type = excluded.outing_type,
    character = excluded.character,
    title = excluded.title,
    outing_date = excluded.outing_date,
    year = excluded.year,
    departure_time = excluded.departure_time,
    return_time = excluded.return_time,
    municipality_id = excluded.municipality_id,
    origin_place_id = excluded.origin_place_id,
    destination_place_id = excluded.destination_place_id,
    route_summary = excluded.route_summary,
    route = excluded.route,
    description = excluded.description,
    public_notes = excluded.public_notes,
    organizer_name = excluded.organizer_name,
    event_status = excluded.event_status,
    status = excluded.status,
    reference_code = excluded.reference_code,
    origin_text = excluded.origin_text,
    destination_text = excluded.destination_text,
    updated_at = now()
  returning id into v_rosary_outing_id;

  insert into public.outing_schedule_items (
    outing_id, sequence_no, label, item_date, item_time, time_text,
    place_id, place_text, notes
  ) values
    (v_rosary_outing_id, 1, 'Salida', date '2026-09-19', time '17:30', '17:30', v_parish_id, 'Parroquia de San Juan Bautista', 'Inicio del Rosario Vespertino.'),
    (v_rosary_outing_id, 2, 'Inicio de la Eucaristía', date '2026-09-19', time '19:00', '19:00', v_poncel_id, 'Plaza del Poncel', 'Celebración prevista durante el recorrido.'),
    (v_rosary_outing_id, 3, 'Entrada', date '2026-09-19', time '23:30', '23:30', v_parish_id, 'Parroquia de San Juan Bautista', 'Finalización prevista del Rosario Vespertino.')
  on conflict (outing_id, sequence_no) do update set
    label = excluded.label,
    item_date = excluded.item_date,
    item_time = excluded.item_time,
    time_text = excluded.time_text,
    place_id = excluded.place_id,
    place_text = excluded.place_text,
    notes = excluded.notes;

  insert into public.outing_entities (outing_id, entity_id, role, notes)
  values (
    v_rosary_outing_id,
    v_image_id,
    'processional_image',
    'Nuestra Señora de los Dolores preside el Rosario Vespertino.'
  )
  on conflict (outing_id, entity_id, role) do update set
    notes = excluded.notes;

  select id into v_rosary_source_id
  from public.sources
  where name = 'Cartel oficial · Rosario Vespertino de Nuestra Señora de los Dolores 2026'
  order by created_at
  limit 1;

  if v_rosary_source_id is null then
    insert into public.sources (
      name, url, source_type, author_or_publisher, publication_date,
      accessed_at, notes
    ) values (
      'Cartel oficial · Rosario Vespertino de Nuestra Señora de los Dolores 2026',
      'https://www.instagram.com/hdadsjbautista/',
      'Cartel oficial',
      'Hermandad Sacramental de San Juan Bautista',
      null,
      date '2026-09-12',
      'Cartel oficial aportado directamente para documentar fecha, horarios, itinerario y visita a la Barriada de Guadalajara.'
    ) returning id into v_rosary_source_id;
  end if;

  if not exists (
    select 1 from public.source_links
    where source_id = v_rosary_source_id
      and outing_id = v_rosary_outing_id
  ) then
    insert into public.source_links (source_id, outing_id, scope, notes)
    values (
      v_rosary_source_id,
      v_rosary_outing_id,
      'Rosario Vespertino · 19 de septiembre de 2026',
      'Fecha, tres hitos horarios, itinerario completo y visita a la Barriada de Guadalajara.'
    );
  end if;

  if (
    select count(*)
    from public.outings
    where slug = 'nuestra-senora-juncal-salida-2026'
      and departure_time = time '19:00'
      and return_time = time '23:45'
      and jsonb_array_length(route -> 'itineraries' -> 0 -> 'points') = 20
      and route -> 'itineraries' -> 0 -> 'points' -> 8 ->> 'label' = 'Avenida Alcalde Juan Fernández'
  ) <> 1 then
    raise exception 'La corrección del Juncal no supera la validación final';
  end if;

  if (
    select count(*)
    from public.outings
    where id = v_rosary_outing_id
      and outing_date = date '2026-09-19'
      and departure_time = time '17:30'
      and return_time = time '23:30'
      and jsonb_array_length(route -> 'itineraries' -> 0 -> 'points') = 23
  ) <> 1 then
    raise exception 'El Rosario Vespertino no supera la validación de fecha, horarios y recorrido';
  end if;

  if (
    select count(*) from public.outing_schedule_items
    where outing_id = v_rosary_outing_id
  ) <> 3 then
    raise exception 'El Rosario Vespertino no conserva exactamente tres hitos horarios';
  end if;

  if (
    select count(*) from public.outing_entities
    where outing_id = v_rosary_outing_id
      and entity_id = v_image_id
      and role = 'processional_image'
  ) <> 1 then
    raise exception 'El Rosario Vespertino no queda vinculado con Nuestra Señora de los Dolores';
  end if;
end
$$;

commit;
