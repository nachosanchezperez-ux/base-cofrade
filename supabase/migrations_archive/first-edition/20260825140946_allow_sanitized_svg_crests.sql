-- El editor contextual admite SVG y valida el contenido antes de publicarlo.
-- El bucket debe aceptar el mismo contrato que ofrece el panel.

update storage.buckets
set allowed_mime_types = case
  when allowed_mime_types is null then array['image/svg+xml']
  when not ('image/svg+xml' = any(allowed_mime_types))
    then array_append(allowed_mime_types, 'image/svg+xml')
  else allowed_mime_types
end
where id = 'hilo-media';
