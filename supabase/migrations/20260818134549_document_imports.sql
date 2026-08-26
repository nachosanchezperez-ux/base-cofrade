-- Hilo Cofrade · Importador documental asistido
-- Migración 049
--
-- Separa estrictamente propuestas automáticas del grafo canónico.
-- El HTML/documento fuente no se persiste: solo metadatos, candidatos,
-- evidencias breves y el resultado de la revisión/aplicación.

create table public.document_imports (
  id uuid primary key default gen_random_uuid(),
  target_entity_id uuid references public.entities(id) on delete set null,
  source_id uuid references public.sources(id) on delete set null,
  source_url text not null,
  source_title text,
  status text not null default 'review' check (
    status in ('review', 'applied', 'discarded', 'failed')
  ),
  analysis_version integer not null default 1,
  analysis jsonb not null default '{}'::jsonb,
  application_summary jsonb,
  model_name text,
  content_sha256 text,
  fetched_at timestamptz,
  applied_at timestamptz,
  error_text text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index document_imports_status_idx
  on public.document_imports(status, created_at desc);

create index document_imports_target_idx
  on public.document_imports(target_entity_id, created_at desc);

create trigger document_imports_set_updated_at
before update on public.document_imports
for each row execute function public.set_updated_at();

alter table public.document_imports enable row level security;

create policy "Panel members can read document imports"
on public.document_imports for select to authenticated
using ((select public.is_panel_member()));

create policy "Editors can create document imports"
on public.document_imports for insert to authenticated
with check (
  (select public.can_edit_panel())
  and (created_by is null or created_by = (select auth.uid()))
);

create policy "Editors can update document imports"
on public.document_imports for update to authenticated
using ((select public.can_edit_panel()))
with check ((select public.can_edit_panel()));

create policy "Admins can delete document imports"
on public.document_imports for delete to authenticated
using ((select public.can_admin_panel()));

grant select, insert, update, delete on public.document_imports to authenticated;

-- -----------------------------------------------------------------------------
-- APLICACIÓN ATÓMICA DE UNA REVISIÓN
-- -----------------------------------------------------------------------------
--
-- p_resolutions:
--   { "e1": "existing:<uuid>", "e2": "new", "e3": "ignore" }
--
-- p_relation_indexes contiene índices 0-based de relaciones aceptadas.
-- La función crea SIEMPRE borradores para entidades/relaciones nuevas.
-- Si falla cualquier parte, PostgreSQL revierte la llamada completa.

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
  v_source_id uuid;
  v_source_title text;
  v_source_type text;
  v_source_publisher text;
  v_source_publication_text text;
  v_source_publication_date date;

  v_candidate jsonb;
  v_attribute jsonb;
  v_attributes jsonb;
  v_local_id text;
  v_resolution text;
  v_entity_id uuid;
  v_entity_type text;
  v_agent_kind text;
  v_mapping jsonb := '{}'::jsonb;

  v_relation jsonb;
  v_relation_index integer;
  v_source_ref text;
  v_target_ref text;
  v_source_entity_id uuid;
  v_target_entity_id uuid;
  v_source_entity_type text;
  v_target_entity_type text;
  v_relation_type text;
  v_relation_id uuid;
  v_relation_created boolean;

  v_created_entities integer := 0;
  v_reused_entities integer := 0;
  v_ignored_entities integer := 0;
  v_created_relations integer := 0;
  v_reused_relations integer := 0;
  v_skipped_relations integer := 0;
  v_summary jsonb;
begin
  if not public.can_edit_panel() then
    raise exception '049: el usuario no tiene permiso editorial';
  end if;

  select *
  into v_import
  from public.document_imports
  where id = p_import_id
  for update;

  if not found then
    raise exception '049: la importación no existe';
  end if;

  if v_import.status <> 'review' then
    raise exception '049: solo se puede aplicar una importación en revisión';
  end if;

  if v_import.target_entity_id is not null and not exists (
    select 1 from public.entities
    where id = v_import.target_entity_id
      and status <> 'archived'
  ) then
    raise exception '049: la entidad objetivo ya no está disponible';
  end if;

  -- ---------------------------------------------------------------------------
  -- Fuente reutilizable por URL
  -- ---------------------------------------------------------------------------

  v_source_title := nullif(v_import.analysis #>> '{source,title}', '');
  v_source_type := coalesce(nullif(v_import.analysis #>> '{source,source_type}', ''), 'website');
  v_source_publisher := nullif(v_import.analysis #>> '{source,publisher}', '');
  v_source_publication_text := nullif(v_import.analysis #>> '{source,publication_date}', '');

  if v_source_publication_text ~ '^\d{4}-\d{2}-\d{2}$' then
    begin
      v_source_publication_date := v_source_publication_text::date;
    exception when others then
      v_source_publication_date := null;
    end;
  end if;

  select id
  into v_source_id
  from public.sources
  where url = v_import.source_url
     or rtrim(url, '/') = rtrim(v_import.source_url, '/')
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
      coalesce(v_source_title, v_import.source_title, v_import.source_url),
      v_import.source_url,
      v_source_type,
      v_source_publisher,
      v_source_publication_date,
      current_date,
      'Fuente incorporada mediante Importador documental; revisar metadatos si procede.'
    )
    returning id into v_source_id;
  end if;

  -- ---------------------------------------------------------------------------
  -- Entidades aceptadas
  -- ---------------------------------------------------------------------------

  for v_candidate in
    select value
    from jsonb_array_elements(coalesce(v_import.analysis->'entities', '[]'::jsonb))
  loop
    v_local_id := v_candidate->>'local_id';
    v_entity_type := v_candidate->>'entity_type';
    v_resolution := p_resolutions->>v_local_id;
    v_entity_id := null;
    v_attributes := '{}'::jsonb;

    if v_resolution is null or v_resolution = '' or v_resolution = 'ignore' then
      v_ignored_entities := v_ignored_entities + 1;
      continue;
    end if;

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

    if v_resolution like 'existing:%' then
      begin
        v_entity_id := substring(v_resolution from 10)::uuid;
      exception when others then
        raise exception '049: resolución inválida para %', v_local_id;
      end;

      if not exists (
        select 1 from public.entities
        where id = v_entity_id
          and entity_type = v_entity_type
          and status <> 'archived'
      ) then
        raise exception '049: la entidad existente elegida para % no coincide con el tipo esperado', v_local_id;
      end if;

      v_reused_entities := v_reused_entities + 1;

    elsif v_resolution = 'new' then
      if v_entity_type not in ('advocation', 'image', 'step', 'agent', 'band', 'march', 'heritage_asset') then
        raise exception '049: el MVP no permite crear automáticamente entidades de tipo %', v_entity_type;
      end if;

      if nullif(v_candidate->>'name', '') is null then
        raise exception '049: la entidad % no tiene nombre', v_local_id;
      end if;

      v_entity_id := gen_random_uuid();
      insert into public.entities (
        id, entity_type, name, slug, summary, status
      ) values (
        v_entity_id,
        v_entity_type,
        v_candidate->>'name',
        null,
        nullif(v_candidate->>'description', ''),
        'draft'
      );

      if v_entity_type = 'advocation' then
        insert into public.advocations (entity_id, advocation_type, description)
        values (
          v_entity_id,
          nullif(v_attributes->>'advocation_type', ''),
          coalesce(nullif(v_candidate->>'description', ''), nullif(v_attributes->>'description', ''))
        );

      elsif v_entity_type = 'image' then
        insert into public.images (
          entity_id,
          image_type,
          execution_date_text,
          material,
          current_condition,
          description,
          notes
        ) values (
          v_entity_id,
          nullif(v_attributes->>'image_type', ''),
          coalesce(
            nullif(v_attributes->>'execution_date_text', ''),
            nullif(v_attributes->>'execution_date', '')
          ),
          nullif(v_attributes->>'material', ''),
          case
            when v_attributes->>'current_condition' in ('extant','lost','destroyed','unknown')
              then v_attributes->>'current_condition'
            else null
          end,
          coalesce(nullif(v_candidate->>'description', ''), nullif(v_attributes->>'description', '')),
          'Borrador creado mediante Importador documental.'
        );

      elsif v_entity_type = 'step' then
        insert into public.steps (
          entity_id, step_type, current_condition, description, notes
        ) values (
          v_entity_id,
          nullif(v_attributes->>'step_type', ''),
          case
            when v_attributes->>'current_condition' in (
              'in_use','stored','transferred','sold','dismantled','partially_preserved','lost','unknown'
            ) then v_attributes->>'current_condition'
            else null
          end,
          coalesce(nullif(v_candidate->>'description', ''), nullif(v_attributes->>'description', '')),
          'Borrador creado mediante Importador documental.'
        );

      elsif v_entity_type = 'agent' then
        v_agent_kind := lower(nullif(v_attributes->>'agent_kind', ''));
        if v_agent_kind not in ('person', 'workshop', 'company', 'institution') then
          raise exception '049: el Agente % necesita agent_kind documentado antes de crearse', v_candidate->>'name';
        end if;
        insert into public.agents (
          entity_id,
          agent_kind,
          foundation_or_birth_text,
          death_or_end_text,
          website_url,
          instagram_url,
          description
        ) values (
          v_entity_id,
          v_agent_kind,
          nullif(v_attributes->>'foundation_or_birth_text', ''),
          nullif(v_attributes->>'death_or_end_text', ''),
          nullif(v_attributes->>'website_url', ''),
          nullif(v_attributes->>'instagram_url', ''),
          coalesce(nullif(v_candidate->>'description', ''), nullif(v_attributes->>'description', ''))
        );

      elsif v_entity_type = 'band' then
        insert into public.bands (
          entity_id,
          band_type,
          foundation_text,
          website_url,
          instagram_url,
          description
        ) values (
          v_entity_id,
          nullif(v_attributes->>'band_type', ''),
          nullif(v_attributes->>'foundation_text', ''),
          nullif(v_attributes->>'website_url', ''),
          nullif(v_attributes->>'instagram_url', ''),
          coalesce(nullif(v_candidate->>'description', ''), nullif(v_attributes->>'description', ''))
        );

      elsif v_entity_type = 'march' then
        insert into public.marches (
          entity_id,
          composition_year,
          composition_date_text,
          music_type,
          description,
          premiere_date_text,
          notes
        ) values (
          v_entity_id,
          case
            when v_attributes->>'composition_year' ~ '^\d{4}$'
              then (v_attributes->>'composition_year')::integer
            else null
          end,
          nullif(v_attributes->>'composition_date_text', ''),
          nullif(v_attributes->>'music_type', ''),
          coalesce(nullif(v_candidate->>'description', ''), nullif(v_attributes->>'description', '')),
          nullif(v_attributes->>'premiere_date_text', ''),
          'Borrador creado mediante Importador documental.'
        );

      elsif v_entity_type = 'heritage_asset' then
        insert into public.heritage_assets (
          entity_id,
          parent_entity_id,
          asset_type,
          description,
          current_condition,
          notes
        ) values (
          v_entity_id,
          case
            when v_import.target_entity_id is not null then v_import.target_entity_id
            else null
          end,
          nullif(v_attributes->>'asset_type', ''),
          coalesce(nullif(v_candidate->>'description', ''), nullif(v_attributes->>'description', '')),
          nullif(v_attributes->>'current_condition', ''),
          'Borrador creado mediante Importador documental.'
        );
      end if;

      v_created_entities := v_created_entities + 1;
    else
      raise exception '049: resolución desconocida para %', v_local_id;
    end if;

    v_mapping := jsonb_set(v_mapping, array[v_local_id], to_jsonb(v_entity_id::text), true);

    if not exists (
      select 1 from public.source_links
      where source_id = v_source_id
        and entity_id = v_entity_id
    ) then
      insert into public.source_links (
        source_id, entity_id, scope, notes
      ) values (
        v_source_id,
        v_entity_id,
        'Importación documental · entidad',
        nullif(v_candidate->>'evidence', '')
      );
    end if;
  end loop;

  -- ---------------------------------------------------------------------------
  -- Relaciones aceptadas y soportadas por el MVP
  -- ---------------------------------------------------------------------------

  for v_relation, v_relation_index in
    select value, ordinality::integer - 1
    from jsonb_array_elements(coalesce(v_import.analysis->'relations', '[]'::jsonb))
      with ordinality
  loop
    if not (v_relation_index = any(coalesce(p_relation_indexes, '{}'::integer[]))) then
      continue;
    end if;

    v_source_ref := v_relation->>'source_ref';
    v_target_ref := v_relation->>'target_ref';
    v_relation_type := v_relation->>'relation_type';
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

    if v_source_entity_id is null or v_target_entity_id is null then
      v_skipped_relations := v_skipped_relations + 1;
      continue;
    end if;

    select entity_type into v_source_entity_type
    from public.entities where id = v_source_entity_id;
    select entity_type into v_target_entity_type
    from public.entities where id = v_target_entity_id;

    -- Hermandad → titular conceptual
    if v_relation_type in ('has_titular', 'titular')
       and 'brotherhood' in (v_source_entity_type, v_target_entity_type)
       and 'advocation' in (v_source_entity_type, v_target_entity_type) then

      if v_source_entity_type = 'advocation' then
        v_entity_id := v_source_entity_id;
        v_source_entity_id := v_target_entity_id;
        v_target_entity_id := v_entity_id;
      end if;

      select id into v_relation_id
      from public.entity_relations
      where source_entity_id = v_source_entity_id
        and target_entity_id = v_target_entity_id
        and relation_type = 'has_titular'
        and status <> 'archived'
      order by created_at
      limit 1;

      if v_relation_id is null then
        insert into public.entity_relations (
          source_entity_id, relation_type, target_entity_id, notes, status
        ) values (
          v_source_entity_id,
          'has_titular',
          v_target_entity_id,
          coalesce(nullif(v_relation->>'notes', ''), 'Propuesta aceptada desde Importador documental.'),
          'draft'
        ) returning id into v_relation_id;
        v_relation_created := true;
      end if;

      if not exists (
        select 1 from public.source_links
        where source_id = v_source_id
          and entity_relation_id = v_relation_id
      ) then
        insert into public.source_links (
          source_id, entity_relation_id, scope, notes
        ) values (
          v_source_id,
          v_relation_id,
          'Titularidad conceptual',
          nullif(v_relation->>'evidence', '')
        );
      end if;

    -- Hermandad → Imagen titular
    elsif v_relation_type in ('titular', 'has_titular')
       and 'brotherhood' in (v_source_entity_type, v_target_entity_type)
       and 'image' in (v_source_entity_type, v_target_entity_type) then

      if v_source_entity_type = 'image' then
        v_entity_id := v_source_entity_id;
        v_source_entity_id := v_target_entity_id;
        v_target_entity_id := v_entity_id;
      end if;

      select id into v_relation_id
      from public.brotherhood_images
      where brotherhood_entity_id = v_source_entity_id
        and image_entity_id = v_target_entity_id
        and relation_type = 'titular'
        and status <> 'archived'
      order by created_at
      limit 1;

      if v_relation_id is null then
        insert into public.brotherhood_images (
          brotherhood_entity_id,
          image_entity_id,
          relation_type,
          notes,
          status
        ) values (
          v_source_entity_id,
          v_target_entity_id,
          'titular',
          coalesce(nullif(v_relation->>'notes', ''), 'Propuesta aceptada desde Importador documental.'),
          'draft'
        ) returning id into v_relation_id;
        v_relation_created := true;
      end if;

      if not exists (
        select 1 from public.source_links
        where source_id = v_source_id
          and brotherhood_image_id = v_relation_id
      ) then
        insert into public.source_links (
          source_id, brotherhood_image_id, scope, notes
        ) values (
          v_source_id,
          v_relation_id,
          'Titularidad de Imagen',
          nullif(v_relation->>'evidence', '')
        );
      end if;

    -- Hermandad → Paso procesional
    elsif v_relation_type = 'processional_step'
       and 'brotherhood' in (v_source_entity_type, v_target_entity_type)
       and 'step' in (v_source_entity_type, v_target_entity_type) then

      if v_source_entity_type = 'step' then
        v_entity_id := v_source_entity_id;
        v_source_entity_id := v_target_entity_id;
        v_target_entity_id := v_entity_id;
      end if;

      select id into v_relation_id
      from public.brotherhood_steps
      where brotherhood_entity_id = v_source_entity_id
        and step_entity_id = v_target_entity_id
        and relation_type = 'processional_step'
        and status <> 'archived'
      order by created_at
      limit 1;

      if v_relation_id is null then
        insert into public.brotherhood_steps (
          brotherhood_entity_id,
          step_entity_id,
          relation_type,
          notes,
          status
        ) values (
          v_source_entity_id,
          v_target_entity_id,
          'processional_step',
          coalesce(nullif(v_relation->>'notes', ''), 'Propuesta aceptada desde Importador documental.'),
          'draft'
        ) returning id into v_relation_id;
        v_relation_created := true;
      end if;

      if not exists (
        select 1 from public.source_links
        where source_id = v_source_id
          and brotherhood_step_id = v_relation_id
      ) then
        insert into public.source_links (
          source_id, brotherhood_step_id, scope, notes
        ) values (
          v_source_id,
          v_relation_id,
          'Paso procesional',
          nullif(v_relation->>'evidence', '')
        );
      end if;

    -- Imagen → Paso
    elsif v_relation_type = 'processes_on'
       and 'image' in (v_source_entity_type, v_target_entity_type)
       and 'step' in (v_source_entity_type, v_target_entity_type) then

      if v_source_entity_type = 'step' then
        v_entity_id := v_source_entity_id;
        v_source_entity_id := v_target_entity_id;
        v_target_entity_id := v_entity_id;
      end if;

      select id into v_relation_id
      from public.image_steps
      where image_entity_id = v_source_entity_id
        and step_entity_id = v_target_entity_id
        and relation_type = 'processes_on'
        and status <> 'archived'
      order by created_at
      limit 1;

      if v_relation_id is null then
        insert into public.image_steps (
          image_entity_id,
          step_entity_id,
          relation_type,
          notes,
          status
        ) values (
          v_source_entity_id,
          v_target_entity_id,
          'processes_on',
          coalesce(nullif(v_relation->>'notes', ''), 'Propuesta aceptada desde Importador documental.'),
          'draft'
        ) returning id into v_relation_id;
        v_relation_created := true;
      end if;

      if not exists (
        select 1 from public.source_links
        where source_id = v_source_id
          and image_step_id = v_relation_id
      ) then
        insert into public.source_links (
          source_id, image_step_id, scope, notes
        ) values (
          v_source_id,
          v_relation_id,
          'Imagen en Paso',
          nullif(v_relation->>'evidence', '')
        );
      end if;

    -- Banda → Hermandad institucional
    elsif v_relation_type = 'belongs_to_brotherhood'
       and 'band' in (v_source_entity_type, v_target_entity_type)
       and 'brotherhood' in (v_source_entity_type, v_target_entity_type) then

      if v_source_entity_type = 'brotherhood' then
        v_entity_id := v_source_entity_id;
        v_source_entity_id := v_target_entity_id;
        v_target_entity_id := v_entity_id;
      end if;

      select id into v_relation_id
      from public.entity_relations
      where source_entity_id = v_source_entity_id
        and target_entity_id = v_target_entity_id
        and relation_type = 'belongs_to_brotherhood'
        and status <> 'archived'
      order by created_at
      limit 1;

      if v_relation_id is null then
        insert into public.entity_relations (
          source_entity_id, relation_type, target_entity_id, notes, status
        ) values (
          v_source_entity_id,
          'belongs_to_brotherhood',
          v_target_entity_id,
          coalesce(nullif(v_relation->>'notes', ''), 'Propuesta aceptada desde Importador documental.'),
          'draft'
        ) returning id into v_relation_id;
        v_relation_created := true;
      end if;

      if not exists (
        select 1 from public.source_links
        where source_id = v_source_id
          and entity_relation_id = v_relation_id
      ) then
        insert into public.source_links (
          source_id, entity_relation_id, scope, notes
        ) values (
          v_source_id,
          v_relation_id,
          'Vínculo institucional Banda-Hermandad',
          nullif(v_relation->>'evidence', '')
        );
      end if;

    else
      v_skipped_relations := v_skipped_relations + 1;
      continue;
    end if;

    if v_relation_created then
      v_created_relations := v_created_relations + 1;
    else
      v_reused_relations := v_reused_relations + 1;
    end if;
  end loop;

  v_summary := jsonb_build_object(
    'created_entities', v_created_entities,
    'reused_entities', v_reused_entities,
    'ignored_entities', v_ignored_entities,
    'created_relations', v_created_relations,
    'reused_relations', v_reused_relations,
    'skipped_relations', v_skipped_relations,
    'source_id', v_source_id,
    'entity_mapping', v_mapping
  );

  update public.document_imports
  set
    status = 'applied',
    source_id = v_source_id,
    application_summary = v_summary,
    applied_at = now(),
    error_text = null
  where id = p_import_id;

  return v_summary;
end
$$;

revoke all on function public.apply_document_import(uuid, jsonb, integer[]) from public, anon, authenticated;
grant execute on function public.apply_document_import(uuid, jsonb, integer[]) to authenticated;
