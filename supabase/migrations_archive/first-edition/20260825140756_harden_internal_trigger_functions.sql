-- Funciones internas de trigger: conservar su ejecución por PostgreSQL sin
-- exponerlas como RPC a visitantes anónimos ni a usuarios autenticados.

revoke execute on function public.demote_invalid_core_relations_after_entity_change()
  from public, anon, authenticated;

revoke execute on function public.guard_core_relation_publication()
  from public, anon, authenticated;

revoke execute on function public.sync_music_accompaniment_public_location()
  from public, anon, authenticated;
