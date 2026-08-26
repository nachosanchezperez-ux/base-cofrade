-- Hilo Cofrade · Reactivación gobernada del importador documental (#49)
--
-- Las migraciones 049–051 crean y endurecen el núcleo. La primera edición lo
-- aparcó revocando la RPC pública. Este corte reactiva únicamente el wrapper
-- protegido por can_edit_panel(); los núcleos continúan siendo privados.

do $$
begin
  if to_regclass('public.document_imports') is null then
    raise exception 'document_imports no existe; no se puede activar el importador';
  end if;

  if to_regprocedure('public.apply_document_import(uuid,jsonb,integer[])') is null then
    raise exception 'apply_document_import no existe; no se puede activar el importador';
  end if;
end
$$;

revoke all on function public.apply_document_import(uuid, jsonb, integer[])
  from public, anon, authenticated;

revoke all on function public.apply_document_import_core(uuid, jsonb, integer[])
  from public, anon, authenticated;

revoke all on function public.apply_document_import_music_core(uuid, jsonb, integer[])
  from public, anon, authenticated;

grant execute on function public.apply_document_import(uuid, jsonb, integer[])
  to authenticated;

comment on function public.apply_document_import(uuid, jsonb, integer[]) is
  'Importador documental gobernado: exige usuario del Panel con permiso editorial y crea únicamente borradores revisados.';
