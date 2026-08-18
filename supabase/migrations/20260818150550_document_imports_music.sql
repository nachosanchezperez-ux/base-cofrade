-- Hilo Cofrade · Importador documental · extensión musical
-- Migración 050
--
-- Añade al MVP de ingesta documental:
-- - Marcha → compositor mediante march_authors;
-- - Marcha → dedicatoria mediante march_dedications;
-- - vinculación determinista de Marchas aceptadas con pistas discográficas ya existentes.
--
-- La IA nunca elige una fila de band_release_tracks. La asociación con una pista se
-- realiza aquí y solo cuando el contexto documental produce una coincidencia única.

-- Conservamos la aplicación genérica de 049 como núcleo privado y exponemos un
-- wrapper con la misma firma. Al ejecutarse todo dentro de una misma llamada RPC,
-- cualquier fallo en esta extensión revierte también lo realizado por el núcleo.
alter function public.apply_document_import(uuid, jsonb, integer[])
  rename to apply_document_import_core;

revoke all on function public.apply_document_import_core(uuid, jsonb, integer[])
  from public, anon, authenticated;

create or replace function public.apply_document_import(
  p_import_id uuid,
  p_resolutions jsonb,
  p_relation_indexes integer[] default '{}'
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_import public.document_imports%rowtype;
  v_summary jsonb;
  v_mapping jsonb;
  v_source_id uuid;

  v_relation jsonb;
  v_relation_index integer;
  v_source_ref text;
  v_target_ref text;
  v_relation_type text;
  v_source_entity_id uuid;
  v_target_entity_id uuid;
  v_source_entity_type text;
  v_target_entity_type text;
  v_relation_id uuid;
  v_relation_created boolean;

  v_candidate jsonb;
  v_attribute jsonb;
  v_attributes jsonb;
  v_local_id text;
  v_march_entity_id uuid;
  v_target_type text;
  v_recorded_flag text;
  v_release_title text;
  v_track_title text;
  v_track_sequence integer;
  v_track_matches integer;
  v_track_id uuid;
  v_release_id uuid;
  v_current_track_march uuid;

  v_music_created integer := 0;
  v_music_reused integer := 0;
  v_track_linked integer := 0;
  v_track_reused integer := 0;
  v_track_ambiguous integer := 0;
  v_track_unmatched integer := 0;
  v_track_conflicts integer := 0;

  v_base_created integer := 0;
  v_base_reused integer := 0;
  v_base_skipped integer := 0;
begin
  if not public.can_edit_panel() then
    raise exception '050: el usuario no tiene permiso editorial';
  end if;

  -- 049 crea/reutiliza entidades, Fuente y relaciones genéricas. Si cualquier
  -- operación posterior falla, toda esta llamada se revierte de forma atómica.
  v_summary := public.apply_document_import_core(
    p_import_id,
    p_resolutions,
    p_relation_indexes
  );

  select *
  into v_import
  from public.document_imports
  where id = p_import_id;

  if not found then
    raise exception '050: la importación ha desaparecido durante la aplicación';
  end if;

  v_mapping := coalesce(v_summary->'entity_mapping', '{}'::jsonb);

  begin
    v_source_id := nullif(v_summary->>'source_id', '')::uuid;
  exception when others then
    raise exception '050: 049 no devolvió una Fuente válida';
  end;

  -- ---------------------------------------------------------------------------
  -- AUTORÍAS Y DEDICATORIAS MUSICALES REVISADAS
  -- ---------------------------------------------------------------------------

  for v_relation, v_relation_index in
    select value, ordinality::integer - 1
    from jsonb_array_elements(coalesce(v_import.analysis->'relations', '[]'::jsonb))
      with ordinality
  loop
    if not (v_relation_index = any(coalesce(p_relation_indexes, '{}'::integer[]))) then
      continue;
    end if;

    v_relation_type := v_relation->>'relation_type';
    if v_relation_type not in ('authored_by', 'dedicated_to') then
      continue;
    end if;

    v_source_ref := v_relation->>'source_ref';
    v_target_ref := v_relation->>'target_ref';
    v_source_entity_id := null;
    v_target_entity_id := null;
    v_relation_id := null;
    v_relation_created := false;

    if v_source_ref = '$target' then
      v_source_entity_id := v_import.target_entity_id;
    elsif v_mapping ? v_source_ref then
      v_source_entity_id := (v_mapping->>v_source_ref)::uuid;
    end if;

    if v_target_ref = '$target' then
      v_target_entity_id := v_import.target_entity_id;
    elsif v_mapping ? v_target_ref then
      v_target_entity_id := (v_mapping->>v_target_ref)::uuid;
    end if;

    -- Si el editor ignoró uno de los extremos, 049 ya lo contabilizó como
    -- relación no aplicada y aquí no se fuerza nada.
    if v_source_entity_id is null or v_target_entity_id is null then
      continue;
    end if;

    select entity_type into v_source_entity_type
    from public.entities where id = v_source_entity_id;

    select entity_type into v_target_entity_type
    from public.entities where id = v_target_entity_id;

    -- Marcha → compositor. En este MVP authored_by significa composición;
    -- arreglos/adaptaciones siguen requiriendo modelado explícito posterior.
    if v_relation_type = 'authored_by'
       and 'march' in (v_source_entity_type, v_target_entity_type)
       and 'agent' in (v_source_entity_type, v_target_entity_type) then

      if v_source_entity_type = 'agent' then
        v_march_entity_id := v_target_entity_id;
        v_target_entity_id := v_source_entity_id;
      else
        v_march_entity_id := v_source_entity_id;
      end if;

      -- La clave de identidad de march_authors ya es Marcha + Agente + rol.
      -- No dependemos de created_at y reutilizamos también una relación archivada
      -- para evitar chocar con su restricción unique.
      select id into v_relation_id
      from public.march_authors
      where march_entity_id = v_march_entity_id
        and agent_entity_id = v_target_entity_id
        and author_role = 'composer'
      limit 1;

      if v_relation_id is null then
        insert into public.march_authors (
          march_entity_id,
          agent_entity_id,
          author_role,
          notes,
          status
        ) values (
          v_march_entity_id,
          v_target_entity_id,
          'composer',
          coalesce(
            nullif(v_relation->>'notes', ''),
            nullif(v_relation->>'evidence', ''),
            'Autoría propuesta y aceptada desde Importador documental.'
          ),
          'draft'
        )
        returning id into v_relation_id;
        v_relation_created := true;
      else
        update public.march_authors
        set
          status = case when status = 'archived' then 'draft' else status end,
          notes = coalesce(
            nullif(notes, ''),
            nullif(v_relation->>'notes', ''),
            nullif(v_relation->>'evidence', '')
          )
        where id = v_relation_id;
      end if;

      -- source_links todavía no tiene destino march_author. Conservamos la
      -- trazabilidad sobre la Marcha, igual que el primer caso relacional 047.
      if not exists (
        select 1 from public.source_links
        where source_id = v_source_id
          and entity_id = v_march_entity_id
      ) then
        insert into public.source_links (
          source_id, entity_id, scope, notes
        ) values (
          v_source_id,
          v_march_entity_id,
          'Autoría musical documentada',
          nullif(v_relation->>'evidence', '')
        );
      end if;

    -- Marcha → entidad destinataria.
    elsif v_relation_type = 'dedicated_to'
       and v_source_entity_type = 'march'
       and v_target_entity_type <> 'march' then

      v_march_entity_id := v_source_entity_id;

      -- La dedicatoria tiene identidad única aunque esté archivada; si el editor
      -- acepta de nuevo una fuente que la documenta, se reactiva en borrador.
      select id into v_relation_id
      from public.march_dedications
      where march_entity_id = v_march_entity_id
        and dedicatee_entity_id = v_target_entity_id
        and dedication_type = 'dedicated_to'
      limit 1;

      if v_relation_id is null then
        insert into public.march_dedications (
          march_entity_id,
          dedicatee_entity_id,
          dedication_type,
          dedication_text,
          notes,
          status
        )
        select
          v_march_entity_id,
          v_target_entity_id,
          'dedicated_to',
          target.name,
          coalesce(
            nullif(v_relation->>'notes', ''),
            nullif(v_relation->>'evidence', ''),
            'Dedicatoria propuesta y aceptada desde Importador documental.'
          ),
          'draft'
        from public.entities target
        where target.id = v_target_entity_id
        returning id into v_relation_id;
        v_relation_created := true;
      else
        update public.march_dedications
        set
          status = case when status = 'archived' then 'draft' else status end,
          notes = coalesce(
            nullif(notes, ''),
            nullif(v_relation->>'notes', ''),
            nullif(v_relation->>'evidence', '')
          )
        where id = v_relation_id;
      end if;

      if not exists (
        select 1 from public.source_links
        where source_id = v_source_id
          and march_dedication_id = v_relation_id
      ) then
        insert into public.source_links (
          source_id,
          march_dedication_id,
          scope,
          notes
        ) values (
          v_source_id,
          v_relation_id,
          'Dedicatoria musical',
          nullif(v_relation->>'evidence', '')
        );
      end if;

    else
      continue;
    end if;

    if v_relation_created then
      v_music_created := v_music_created + 1;
    else
      v_music_reused := v_music_reused + 1;
    end if;
  end loop;

  -- ---------------------------------------------------------------------------
  -- MARCHA ↔ PISTA DISCOGRÁFICA EXISTENTE
  -- ---------------------------------------------------------------------------
  -- Solo se ejecuta cuando la entidad objetivo de la importación es una Banda y
  -- la IA ha marcado expresamente la Marcha como documentada en una discografía.
  -- La IA aporta contexto textual; PostgreSQL decide si existe UNA pista inequívoca.

  if v_import.target_entity_id is not null then
    select entity_type into v_target_type
    from public.entities
    where id = v_import.target_entity_id;
  end if;

  if v_target_type = 'band' then
    for v_candidate in
      select value
      from jsonb_array_elements(coalesce(v_import.analysis->'entities', '[]'::jsonb))
    loop
      v_local_id := v_candidate->>'local_id';
      if v_candidate->>'entity_type' <> 'march' or not (v_mapping ? v_local_id) then
        continue;
      end if;

      v_march_entity_id := (v_mapping->>v_local_id)::uuid;
      v_attributes := '{}'::jsonb;

      for v_attribute in
        select value
        from jsonb_array_elements(coalesce(v_candidate->'attributes', '[]'::jsonb))
      loop
        if nullif(v_attribute->>'key', '') is not null then
          v_attributes := v_attributes || jsonb_build_object(
            v_attribute->>'key',
            coalesce(v_attribute->>'value', '')
          );
        end if;
      end loop;

      v_recorded_flag := lower(trim(coalesce(v_attributes->>'recorded_in_discography', '')));
      if v_recorded_flag not in ('yes', 'si', 'sí', 'true', '1') then
        continue;
      end if;

      v_release_title := nullif(trim(v_attributes->>'discography_release_title'), '');
      v_track_title := coalesce(
        nullif(trim(v_attributes->>'discography_track_title'), ''),
        nullif(trim(v_candidate->>'name'), '')
      );
      v_track_sequence := null;

      if coalesce(v_attributes->>'discography_track_sequence_no', '') ~ '^\d+$' then
        v_track_sequence := (v_attributes->>'discography_track_sequence_no')::integer;
      end if;

      if v_track_title is null then
        v_track_unmatched := v_track_unmatched + 1;
        continue;
      end if;

      select count(*)
      into v_track_matches
      from public.band_release_tracks track
      join public.band_releases release on release.id = track.release_id
      where release.band_entity_id = v_import.target_entity_id
        and release.status <> 'archived'
        and (
          v_release_title is null
          or lower(trim(release.title)) = lower(v_release_title)
        )
        and (
          v_track_sequence is null
          or track.sequence_no = v_track_sequence
        )
        and lower(trim(track.title)) = lower(v_track_title);

      if v_track_matches = 0 then
        v_track_unmatched := v_track_unmatched + 1;
        continue;
      elsif v_track_matches > 1 then
        v_track_ambiguous := v_track_ambiguous + 1;
        continue;
      end if;

      select track.id, release.id, track.march_entity_id
      into v_track_id, v_release_id, v_current_track_march
      from public.band_release_tracks track
      join public.band_releases release on release.id = track.release_id
      where release.band_entity_id = v_import.target_entity_id
        and release.status <> 'archived'
        and (
          v_release_title is null
          or lower(trim(release.title)) = lower(v_release_title)
        )
        and (
          v_track_sequence is null
          or track.sequence_no = v_track_sequence
        )
        and lower(trim(track.title)) = lower(v_track_title)
      limit 1;

      if v_current_track_march is null then
        update public.band_release_tracks
        set march_entity_id = v_march_entity_id
        where id = v_track_id;
        v_track_linked := v_track_linked + 1;
      elsif v_current_track_march = v_march_entity_id then
        v_track_reused := v_track_reused + 1;
      else
        -- Nunca se sustituye silenciosamente una Marcha ya vinculada a la pista.
        v_track_conflicts := v_track_conflicts + 1;
        continue;
      end if;

      insert into public.band_release_sources (
        release_id,
        source_id,
        scope
      ) values (
        v_release_id,
        v_source_id,
        'Discografía oficial y relación entre pista y Marcha'
      )
      on conflict (release_id, source_id) do nothing;

      if not exists (
        select 1 from public.source_links
        where source_id = v_source_id
          and entity_id = v_march_entity_id
      ) then
        insert into public.source_links (
          source_id,
          entity_id,
          scope,
          notes
        ) values (
          v_source_id,
          v_march_entity_id,
          'Grabación discográfica documentada',
          concat('Pista ', coalesce(v_track_sequence::text, 's/n'), ' · ', v_track_title)
        );
      end if;
    end loop;
  end if;

  -- 049 cuenta authored_by/dedicated_to seleccionadas como no soportadas. Ajustamos
  -- el resumen para reflejar las que 050 sí ha aplicado sin ocultar las restantes.
  v_base_created := coalesce((v_summary->>'created_relations')::integer, 0);
  v_base_reused := coalesce((v_summary->>'reused_relations')::integer, 0);
  v_base_skipped := coalesce((v_summary->>'skipped_relations')::integer, 0);

  v_summary := jsonb_set(
    v_summary,
    '{created_relations}',
    to_jsonb(v_base_created + v_music_created),
    true
  );
  v_summary := jsonb_set(
    v_summary,
    '{reused_relations}',
    to_jsonb(v_base_reused + v_music_reused),
    true
  );
  v_summary := jsonb_set(
    v_summary,
    '{skipped_relations}',
    to_jsonb(greatest(v_base_skipped - v_music_created - v_music_reused, 0)),
    true
  );

  v_summary := v_summary || jsonb_build_object(
    'music_created_relations', v_music_created,
    'music_reused_relations', v_music_reused,
    'discography_tracks_linked', v_track_linked,
    'discography_tracks_reused', v_track_reused,
    'discography_tracks_ambiguous', v_track_ambiguous,
    'discography_tracks_unmatched', v_track_unmatched,
    'discography_tracks_conflicts', v_track_conflicts
  );

  update public.document_imports
  set application_summary = v_summary
  where id = p_import_id;

  return v_summary;
end
$$;

revoke all on function public.apply_document_import(uuid, jsonb, integer[])
  from public, anon, authenticated;
grant execute on function public.apply_document_import(uuid, jsonb, integer[])
  to authenticated;
