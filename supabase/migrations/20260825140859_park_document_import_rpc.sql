-- El importador documental sigue aparcado (#49) y no forma parte de la
-- primera edición. Su núcleo se conserva, pero deja de exponerse como RPC.

revoke execute on function public.apply_document_import(uuid, jsonb, integer[])
  from public, anon, authenticated;
