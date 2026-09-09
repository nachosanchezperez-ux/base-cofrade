do $$
declare
  v_canonical_id uuid;
  v_duplicate_id uuid;
  v_canonical_position_id uuid;
  v_duplicate_position_id uuid;
  v_canonical_assignment_id uuid;
  v_duplicate_assignment_id uuid;
begin
  select id into v_canonical_id
  from public.outings
  where slug = 'sevilla-divina-gracia-2026';

  if v_canonical_id is null then
    raise exception 'No existe la salida canónica sevilla-divina-gracia-2026';
  end if;

  select id into v_duplicate_id
  from public.outings
  where slug = 'padre-pio-divina-gracia-salida-extraordinaria-2026-10-11';

  if v_duplicate_id is not null then
    update public.outings canonical
    set brotherhood_entity_id = duplicate.brotherhood_entity_id,
        title = duplicate.title,
        origin_place_id = coalesce(duplicate.origin_place_id, canonical.origin_place_id),
        origin_text = coalesce(duplicate.origin_text, canonical.origin_text),
        destination_place_id = coalesce(duplicate.destination_place_id, canonical.destination_place_id),
        destination_text = coalesce(duplicate.destination_text, canonical.destination_text),
        reason = duplicate.reason,
        description = coalesce(duplicate.description, canonical.description),
        public_notes = 'La entrada está prevista a las 00:00 del 12 de octubre. La Virgen procesionará bajo palio y alcanzará calles por las que no había discurrido anteriormente. El 12 de octubre se celebrará la función por las bodas de plata de la dedicación del templo, presidida por el Arzobispo de Sevilla.',
        organizer_name = duplicate.organizer_name,
        updated_at = now()
    from public.outings duplicate
    where canonical.id = v_canonical_id
      and duplicate.id = v_duplicate_id;

    insert into public.outing_entities (outing_id, entity_id, role, notes)
    select v_canonical_id, entity_id, role, notes
    from public.outing_entities
    where outing_id = v_duplicate_id
    on conflict (outing_id, entity_id, role) do update set
      notes = excluded.notes;

    delete from public.outing_entities
    where outing_id = v_duplicate_id;

    update public.source_links
    set outing_id = v_canonical_id
    where outing_id = v_duplicate_id;

    select id into v_canonical_position_id
    from public.outing_music_positions
    where outing_id = v_canonical_id
    order by sequence_no
    limit 1;

    select id into v_duplicate_position_id
    from public.outing_music_positions
    where outing_id = v_duplicate_id
    order by sequence_no
    limit 1;

    if v_duplicate_position_id is not null and v_canonical_position_id is not null then
      update public.outing_music_positions canonical
      set step_entity_id = duplicate.step_entity_id,
          position_code = duplicate.position_code,
          position_label = duplicate.position_label,
          notes = duplicate.notes,
          status = duplicate.status,
          updated_at = now()
      from public.outing_music_positions duplicate
      where canonical.id = v_canonical_position_id
        and duplicate.id = v_duplicate_position_id;

      select id into v_canonical_assignment_id
      from public.outing_music_assignments
      where music_position_id = v_canonical_position_id
      order by sequence_no
      limit 1;

      select id into v_duplicate_assignment_id
      from public.outing_music_assignments
      where music_position_id = v_duplicate_position_id
      order by sequence_no
      limit 1;

      if v_duplicate_assignment_id is not null and v_canonical_assignment_id is not null then
        update public.outing_music_assignments canonical
        set band_entity_id = duplicate.band_entity_id,
            band_name_text = duplicate.band_name_text,
            participation_mode = duplicate.participation_mode,
            segment_start_label = duplicate.segment_start_label,
            segment_end_label = duplicate.segment_end_label,
            notes = duplicate.notes,
            status = duplicate.status
        from public.outing_music_assignments duplicate
        where canonical.id = v_canonical_assignment_id
          and duplicate.id = v_duplicate_assignment_id;

        update public.source_links
        set outing_music_assignment_id = v_canonical_assignment_id
        where outing_music_assignment_id = v_duplicate_assignment_id;
      elsif v_duplicate_assignment_id is not null then
        update public.outing_music_assignments
        set music_position_id = v_canonical_position_id
        where id = v_duplicate_assignment_id;
      end if;

      delete from public.outing_music_positions
      where id = v_duplicate_position_id;
    elsif v_duplicate_position_id is not null then
      update public.outing_music_positions
      set outing_id = v_canonical_id,
          updated_at = now()
      where id = v_duplicate_position_id;
    end if;

    update public.accompaniments set outing_id = v_canonical_id where outing_id = v_duplicate_id;
    update public.outing_media set outing_id = v_canonical_id where outing_id = v_duplicate_id;
    update public.outing_route_points set outing_id = v_canonical_id where outing_id = v_duplicate_id;
    update public.outing_schedule_items set outing_id = v_canonical_id where outing_id = v_duplicate_id;

    delete from public.outings
    where id = v_duplicate_id;
  end if;

  if (
    select count(*)
    from public.outings
    where outing_date = date '2026-10-11'
      and lower(title) like '%divina gracia%'
      and status = 'published'
  ) <> 1 then
    raise exception 'Debe existir una única salida publicada de la Divina Gracia el 11 de octubre de 2026';
  end if;

  if not exists (
    select 1
    from public.outings o
    join public.entities h on h.id = o.brotherhood_entity_id
    where o.id = v_canonical_id
      and o.slug = 'sevilla-divina-gracia-2026'
      and h.slug = 'padre-pio-sevilla'
      and o.status = 'published'
  ) then
    raise exception 'La salida canónica debe quedar relacionada con Padre Pío';
  end if;

  if (select count(*) from public.outing_schedule_items where outing_id = v_canonical_id) <> 2 then
    raise exception 'La salida canónica debe conservar salida y entrada';
  end if;

  if (select count(*) from public.outing_music_positions where outing_id = v_canonical_id and status = 'published') <> 1 then
    raise exception 'La salida canónica debe conservar una única posición musical';
  end if;

  if (select count(*) from public.outing_entities where outing_id = v_canonical_id and role = 'processional_image') <> 1 then
    raise exception 'La salida canónica debe conservar a la titular mariana relacionada';
  end if;

  if (select count(*) from public.source_links where outing_id = v_canonical_id) < 3 then
    raise exception 'La salida canónica debe conservar sus tres fuentes';
  end if;
end
$$;
