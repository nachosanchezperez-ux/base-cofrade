-- Prepared editorial data patch for Hilo Cofrade.
-- Target: Marchena · Nuestra Señora del Rosario · 4 October 2026.
-- This file is NOT auto-applied. It was prepared after Supabase SQL/Migration MCP
-- returned repeated connection timeouts on 2026-09-24.
-- Sources:
-- 1) Marchena Secreta, 2026-09-23/24.
-- 2) Banda de Música Villa de Marchena, official website.
--
-- Design rule: create the extraordinary without inventing route or unsupported
-- music for Santo Domingo / San Francisco / Lignum Crucis. The confirmed music
-- assignment is only for Nuestra Señora del Rosario.

begin;

do $$
declare
  v_outing_id uuid;
  v_music_position_id uuid;
  v_music_assignment_id uuid;
  v_source_marchena uuid;
  v_source_band uuid;
begin
  select id
  into v_outing_id
  from public.outings
  where slug = 'marchena-rosario-extraordinaria-2026'
  limit 1;

  if v_outing_id is null then
    insert into public.outings (
      brotherhood_entity_id,
      outing_type,
      character,
      title,
      outing_date,
      year,
      departure_time,
      municipality_id,
      origin_text,
      destination_text,
      reason,
      description,
      event_status,
      status,
      route_summary,
      public_notes,
      organizer_name,
      slug,
      reference_code
    )
    select
      null,
      'Procesión extraordinaria',
      'extraordinary',
      'Nuestra Señora del Rosario · procesión extraordinaria 2026',
      date '2026-10-04',
      2026,
      time '10:30',
      m.id,
      'Iglesia de Santo Domingo',
      'Iglesia de Santo Domingo',
      'VIII centenario del tránsito de San Francisco de Asís y III centenario de la aplicación en Marchena de los privilegios pontificios vinculados a la solemne procesión dominica del Rosario',
      'Procesión extraordinaria de Nuestra Señora del Rosario, Patrona de Marchena, junto a Santo Domingo de Guzmán, San Francisco de Asís y el Lignum Crucis.',
      'announced',
      'published',
      null,
      'Salida extraordinaria a las 10:30 desde Santo Domingo. El cortejo reunirá a Nuestra Señora del Rosario, Santo Domingo de Guzmán, San Francisco de Asís y el Lignum Crucis. Organizan conjuntamente la Hermandad del Cristo de San Pedro y la Hermandad de la Santa Vera+Cruz. Acompañamiento musical confirmado tras Nuestra Señora del Rosario: Banda de Música Villa de Marchena. Itinerario y otros acompañamientos musicales: pendientes de publicación.',
      'Hermandad del Santísimo Cristo de San Pedro y Hermandad de la Santa Vera+Cruz de Marchena',
      'marchena-rosario-extraordinaria-2026',
      'MARCHENA-ROSARIO-2026'
    from public.municipalities m
    where m.slug = 'marchena'
    returning id into v_outing_id;
  else
    update public.outings
    set outing_type = 'Procesión extraordinaria',
        character = 'extraordinary',
        title = 'Nuestra Señora del Rosario · procesión extraordinaria 2026',
        outing_date = date '2026-10-04',
        year = 2026,
        departure_time = time '10:30',
        origin_text = 'Iglesia de Santo Domingo',
        destination_text = 'Iglesia de Santo Domingo',
        reason = 'VIII centenario del tránsito de San Francisco de Asís y III centenario de la aplicación en Marchena de los privilegios pontificios vinculados a la solemne procesión dominica del Rosario',
        description = 'Procesión extraordinaria de Nuestra Señora del Rosario, Patrona de Marchena, junto a Santo Domingo de Guzmán, San Francisco de Asís y el Lignum Crucis.',
        event_status = 'announced',
        status = 'published',
        route_summary = null,
        public_notes = 'Salida extraordinaria a las 10:30 desde Santo Domingo. El cortejo reunirá a Nuestra Señora del Rosario, Santo Domingo de Guzmán, San Francisco de Asís y el Lignum Crucis. Organizan conjuntamente la Hermandad del Cristo de San Pedro y la Hermandad de la Santa Vera+Cruz. Acompañamiento musical confirmado tras Nuestra Señora del Rosario: Banda de Música Villa de Marchena. Itinerario y otros acompañamientos musicales: pendientes de publicación.',
        organizer_name = 'Hermandad del Santísimo Cristo de San Pedro y Hermandad de la Santa Vera+Cruz de Marchena',
        reference_code = 'MARCHENA-ROSARIO-2026',
        updated_at = now()
    where id = v_outing_id;
  end if;

  if v_outing_id is null then
    raise exception 'Marchena municipality was not found; outing not created';
  end if;

  insert into public.outing_schedule_items (
    outing_id, sequence_no, label, item_date, item_time, place_text, notes
  ) values (
    v_outing_id,
    1,
    'Procesión extraordinaria de Nuestra Señora del Rosario',
    date '2026-10-04',
    time '10:30',
    'Iglesia de Santo Domingo',
    'Salida matinal extraordinaria. Itinerario detallado pendiente de publicación.'
  )
  on conflict (outing_id, sequence_no) do update
    set label = excluded.label,
        item_date = excluded.item_date,
        item_time = excluded.item_time,
        place_text = excluded.place_text,
        notes = excluded.notes;

  select id
  into v_music_position_id
  from public.outing_music_positions
  where outing_id = v_outing_id and sequence_no = 1
  limit 1;

  if v_music_position_id is null then
    insert into public.outing_music_positions (
      outing_id,
      position_code,
      position_label,
      sequence_no,
      notes,
      status
    ) values (
      v_outing_id,
      'behind_step',
      'Tras Nuestra Señora del Rosario',
      1,
      'Acompañamiento musical confirmado por la propia Banda de Música Villa de Marchena.',
      'published'
    )
    returning id into v_music_position_id;
  else
    update public.outing_music_positions
    set position_code = 'behind_step',
        position_label = 'Tras Nuestra Señora del Rosario',
        notes = 'Acompañamiento musical confirmado por la propia Banda de Música Villa de Marchena.',
        status = 'published',
        updated_at = now()
    where id = v_music_position_id;
  end if;

  select id
  into v_music_assignment_id
  from public.outing_music_assignments
  where music_position_id = v_music_position_id and sequence_no = 1
  limit 1;

  if v_music_assignment_id is null then
    insert into public.outing_music_assignments (
      music_position_id,
      band_entity_id,
      band_name_text,
      participation_mode,
      sequence_no,
      notes,
      status
    ) values (
      v_music_position_id,
      null,
      'Banda de Música Villa de Marchena',
      'full_route',
      1,
      'La formación confirma oficialmente el acompañamiento de Nuestra Señora del Rosario el 4 de octubre de 2026.',
      'published'
    )
    returning id into v_music_assignment_id;
  else
    update public.outing_music_assignments
    set band_entity_id = null,
        band_name_text = 'Banda de Música Villa de Marchena',
        participation_mode = 'full_route',
        notes = 'La formación confirma oficialmente el acompañamiento de Nuestra Señora del Rosario el 4 de octubre de 2026.',
        status = 'published'
    where id = v_music_assignment_id;
  end if;

  select id
  into v_source_marchena
  from public.sources
  where url = 'https://marchenasecreta.com/juan-jesus-alcaide-explicara-este-viernes-el-acta-de-1726-que-enlaza-con-la-historica-procesion-del-rosario-del-4-de-octubre/amp/'
  limit 1;

  if v_source_marchena is null then
    insert into public.sources (
      name,
      url,
      source_type,
      author_or_publisher,
      publication_date,
      accessed_at,
      notes
    ) values (
      'Marchena Secreta · procesión extraordinaria del Rosario 2026',
      'https://marchenasecreta.com/juan-jesus-alcaide-explicara-este-viernes-el-acta-de-1726-que-enlaza-con-la-historica-procesion-del-rosario-del-4-de-octubre/amp/',
      'Prensa local',
      'Marchena Secreta',
      date '2026-09-24',
      date '2026-09-24',
      'Confirma carácter extraordinario, imágenes participantes, organización conjunta y efemérides.'
    )
    returning id into v_source_marchena;
  end if;

  if not exists (
    select 1
    from public.source_links
    where source_id = v_source_marchena
      and outing_id = v_outing_id
  ) then
    insert into public.source_links (
      source_id, outing_id, scope, notes
    ) values (
      v_source_marchena,
      v_outing_id,
      'Procesión extraordinaria 2026',
      'Carácter extraordinario, participantes, organización y motivos conmemorativos.'
    );
  end if;

  select id
  into v_source_band
  from public.sources
  where url = 'https://www.bandademusicavillademarchena.es/inicio'
  limit 1;

  if v_source_band is null then
    insert into public.sources (
      name,
      url,
      source_type,
      author_or_publisher,
      publication_date,
      accessed_at,
      notes
    ) values (
      'Banda de Música Villa de Marchena · Nuestra Señora del Rosario 2026',
      'https://www.bandademusicavillademarchena.es/inicio',
      'Web oficial de la Banda',
      'Banda de Música Villa de Marchena',
      null,
      date '2026-09-24',
      'Confirma acompañamiento musical y salida a las 10:30 el 4 de octubre de 2026.'
    )
    returning id into v_source_band;
  end if;

  if not exists (
    select 1
    from public.source_links
    where source_id = v_source_band
      and outing_music_assignment_id = v_music_assignment_id
  ) then
    insert into public.source_links (
      source_id,
      outing_music_assignment_id,
      scope,
      notes
    ) values (
      v_source_band,
      v_music_assignment_id,
      'Acompañamiento musical',
      'Confirmación oficial del acompañamiento de Nuestra Señora del Rosario.'
    );
  end if;
end
$$;

commit;
