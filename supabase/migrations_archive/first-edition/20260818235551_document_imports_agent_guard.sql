-- Hilo Cofrade · Importador documental · guard de Agentes
-- Migración 051
--
-- 049 + 050 ya están aplicadas en el entorno real. No reescribimos migraciones
-- históricas: envolvemos la RPC pública para impedir que una resolución "new"
-- de tipo Agent llegue al núcleo sin un agent_kind explícito y válido.
--
-- La validación es redundante con la UI del Panel, pero protege también llamadas
-- RPC editoriales directas y mantiene el fallo dentro del contrato del importador.

alter function public.apply_document_import(uuid, jsonb, integer[])
  rename to apply_document_import_music_core;

revoke all on function public.apply_document_import_music_core(uuid, jsonb, integer[])
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
  v_candidate jsonb;
  v_attribute jsonb;
  v_local_id text;
  v_agent_kind text;
begin
  if not public.can_edit_panel() then
    raise exception '051: el usuario no tiene permiso editorial';
  end if;

  select *
  into v_import
  from public.document_imports
  where id = p_import_id;

  if not found then
    raise exception '051: la importación no existe';
  end if;

  for v_candidate in
    select value
    from jsonb_array_elements(coalesce(v_import.analysis->'entities', '[]'::jsonb))
  loop
    if v_candidate->>'entity_type' <> 'agent' then
      continue;
    end if;

    v_local_id := v_candidate->>'local_id';

    if coalesce(p_resolutions->>v_local_id, '') <> 'new' then
      continue;
    end if;

    v_agent_kind := null;

    for v_attribute in
      select value
      from jsonb_array_elements(coalesce(v_candidate->'attributes', '[]'::jsonb))
    loop
      if v_attribute->>'key' = 'agent_kind' then
        v_agent_kind := lower(nullif(trim(v_attribute->>'value'), ''));
        exit;
      end if;
    end loop;

    if v_agent_kind is null
       or v_agent_kind not in ('person', 'workshop', 'company', 'institution') then
      raise exception '051: el Agente % necesita agent_kind documentado antes de crearse',
        coalesce(nullif(v_candidate->>'name', ''), v_local_id);
    end if;
  end loop;

  return public.apply_document_import_music_core(
    p_import_id,
    p_resolutions,
    p_relation_indexes
  );
end
$$;

revoke all on function public.apply_document_import(uuid, jsonb, integer[])
  from public, anon, authenticated;

grant execute on function public.apply_document_import(uuid, jsonb, integer[])
  to authenticated;
