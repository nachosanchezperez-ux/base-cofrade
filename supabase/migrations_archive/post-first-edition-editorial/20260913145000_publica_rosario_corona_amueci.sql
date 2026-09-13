begin;

do $$
declare
  v_brotherhood_id uuid;
  v_image_id uuid;
  v_band_id uuid;
  v_municipality_id uuid;
  v_outing_id uuid;
  v_position_id uuid;
  v_assignment_id uuid;
  v_source_id uuid;
begin
  select id into v_brotherhood_id
  from public.entities
  where slug = 'cristo-de-la-corona'
    and entity_type = 'brotherhood'
    and status = 'published';

  select id into v_image_id
  from public.entities
  where slug = 'nuestra-senora-rosario-corona-sevilla'
    and entity_type = 'image'
    and status = 'published';

  select id into v_band_id
  from public.entities
  where slug = 'banda-musica-amueci'
    and entity_type = 'band'
    and status = 'published';

  if v_brotherhood_id is null then
    raise exception 'No se encuentra publicada la Hermandad del Santísimo Cristo de la Corona';
  end if;

  if v_image_id is null then
    raise exception 'No se encuentra publicada Nuestra Señora del Rosario de la Hermandad de la Corona';
  end if;

  if v_band_id is null then
    raise exception 'No se encuentra publicada la Banda de Música AMUECI';
  end if;

  if not exists (
    select 1
    from public.brotherhood_images
    where brotherhood_entity_id = v_brotherhood_id
      and image_entity_id = v_image_id
      and relation_type = 'titular'
      and status = 'published'
  ) then
    raise exception 'Nuestra Señora del Rosario no está vinculada como titular publicada de la Hermandad de la Corona';
  end if;

  select municipality_id into v_municipality_id
  from public.brotherhoods
  where entity_id = v_brotherhood_id;

  if v_municipality_id is null then
    raise exception 'La Hermandad de la Corona no tiene localidad canónica';
  end if;

  insert into public.outings (
    brotherhood_entity_id,
    outing_type,
    character,
    title,
    outing_date,
    year,
    municipality_id,
    route_summary,
    description,
    organizer_name,
    event_status,
    status,
    slug,
    reference_code,
    updated_at
  ) values (
    v_brotherhood_id,
    'Rosario público',
    'ordinary',
    'Rosario de Nuestra Señora del Rosario 2026',
    date '2026-10-11',
    2026,
    v_municipality_id,
    'Por las calles de la feligresía de la Hermandad de la Corona.',
    'Nuestra Señora del Rosario recorrerá las calles de la feligresía de la Hermandad de la Corona con el acompañamiento musical de la Banda de Música AMUECI.',
    'Hermandad del Santísimo Cristo de la Corona',
    'announced',
    'published',
    'sevilla-corona-rosario-2026-10-11',
    'CORONA-ROSARIO-2026',
    now()
  )
  on conflict (slug) where slug is not null do update set
    brotherhood_entity_id = excluded.brotherhood_entity_id,
    outing_type = excluded.outing_type,
    character = excluded.character,
    title = excluded.title,
    outing_date = excluded.outing_date,
    year = excluded.year,
    municipality_id = excluded.municipality_id,
    route_summary = coalesce(public.outings.route_summary, excluded.route_summary),
    description = excluded.description,
    organizer_name = excluded.organizer_name,
    event_status = excluded.event_status,
    status = excluded.status,
    reference_code = excluded.reference_code,
    updated_at = now()
  returning id into v_outing_id;

  insert into public.outing_entities (
    outing_id,
    entity_id,
    role,
    notes
  ) values (
    v_outing_id,
    v_image_id,
    'processional_image',
    'Nuestra Señora del Rosario preside el Rosario público del 11 de octubre de 2026.'
  )
  on conflict (outing_id, entity_id, role) do update set
    notes = excluded.notes;

  insert into public.outing_music_positions (
    outing_id,
    step_entity_id,
    position_code,
    position_label,
    sequence_no,
    notes,
    status,
    updated_at
  ) values (
    v_outing_id,
    null,
    'processional_music',
    'Acompañamiento procesional',
    1,
    'Acompañamiento musical de Nuestra Señora del Rosario durante el Rosario público.',
    'published',
    now()
  )
  on conflict (outing_id, sequence_no) do update set
    position_code = excluded.position_code,
    position_label = excluded.position_label,
    notes = excluded.notes,
    status = excluded.status,
    updated_at = now()
  returning id into v_position_id;

  insert into public.outing_music_assignments (
    music_position_id,
    band_entity_id,
    participation_mode,
    sequence_no,
    notes,
    status
  ) values (
    v_position_id,
    v_band_id,
    'full_route',
    1,
    'AMUECI acompañará a Nuestra Señora del Rosario el 11 de octubre de 2026 por las calles de su feligresía.',
    'published'
  )
  on conflict (music_position_id, band_entity_id, sequence_no) do update set
    participation_mode = excluded.participation_mode,
    notes = excluded.notes,
    status = excluded.status
  returning id into v_assignment_id;

  select id into v_source_id
  from public.sources
  where name = 'AMUECI · acuerdo con la Hermandad de la Corona para el Rosario 2026'
  order by created_at
  limit 1;

  if v_source_id is null then
    insert into public.sources (
      name,
      url,
      source_type,
      author_or_publisher,
      publication_date,
      accessed_at,
      notes
    ) values (
      'AMUECI · acuerdo con la Hermandad de la Corona para el Rosario 2026',
      'https://www.instagram.com/amueci/',
      'Red social oficial',
      'Asociación Musical Ecijana AMUECI',
      date '2026-09-13',
      date '2026-09-13',
      'Comunicado oficial aportado directamente: AMUECI anuncia el acuerdo con la Hermandad de la Corona para acompañar a Nuestra Señora del Rosario el 11 de octubre de 2026.'
    )
    returning id into v_source_id;
  else
    update public.sources
    set url = coalesce(url, 'https://www.instagram.com/amueci/'),
        source_type = 'Red social oficial',
        author_or_publisher = 'Asociación Musical Ecijana AMUECI',
        publication_date = coalesce(publication_date, date '2026-09-13'),
        accessed_at = date '2026-09-13',
        notes = 'Comunicado oficial aportado directamente: AMUECI anuncia el acuerdo con la Hermandad de la Corona para acompañar a Nuestra Señora del Rosario el 11 de octubre de 2026.'
    where id = v_source_id;
  end if;

  if not exists (
    select 1
    from public.source_links
    where source_id = v_source_id
      and outing_id = v_outing_id
  ) then
    insert into public.source_links (
      source_id,
      outing_id,
      scope,
      notes
    ) values (
      v_source_id,
      v_outing_id,
      'Rosario · 11 de octubre de 2026',
      'Fecha, imagen participante y acompañamiento musical confirmado.'
    );
  end if;

  if not exists (
    select 1
    from public.source_links
    where source_id = v_source_id
      and outing_music_assignment_id = v_assignment_id
  ) then
    insert into public.source_links (
      source_id,
      outing_music_assignment_id,
      scope,
      notes
    ) values (
      v_source_id,
      v_assignment_id,
      'Acompañamiento musical · Rosario 2026',
      'Acuerdo de AMUECI con la Hermandad de la Corona para el Rosario de Nuestra Señora del Rosario.'
    );
  end if;

  if (
    select count(*)
    from public.outings
    where id = v_outing_id
      and slug = 'sevilla-corona-rosario-2026-10-11'
      and brotherhood_entity_id = v_brotherhood_id
      and outing_type = 'Rosario público'
      and character = 'ordinary'
      and outing_date = date '2026-10-11'
      and municipality_id = v_municipality_id
      and event_status = 'announced'
      and status = 'published'
  ) <> 1 then
    raise exception 'El Rosario de Nuestra Señora del Rosario no supera la validación del acontecimiento';
  end if;

  if (
    select count(*)
    from public.outing_entities
    where outing_id = v_outing_id
      and entity_id = v_image_id
      and role = 'processional_image'
  ) <> 1 then
    raise exception 'El Rosario no queda vinculado con Nuestra Señora del Rosario';
  end if;

  if (
    select count(*)
    from public.outing_music_assignments assignment
    join public.outing_music_positions position
      on position.id = assignment.music_position_id
    where position.outing_id = v_outing_id
      and position.position_code = 'processional_music'
      and position.status = 'published'
      and assignment.id = v_assignment_id
      and assignment.band_entity_id = v_band_id
      and assignment.participation_mode = 'full_route'
      and assignment.status = 'published'
  ) <> 1 then
    raise exception 'El Rosario no queda vinculado con el acompañamiento de AMUECI';
  end if;

  if (
    select count(*)
    from public.source_links
    where source_id = v_source_id
      and (
        outing_id = v_outing_id
        or outing_music_assignment_id = v_assignment_id
      )
  ) <> 2 then
    raise exception 'La fuente oficial no queda vinculada con la salida y su acompañamiento';
  end if;
end
$$;

commit;
