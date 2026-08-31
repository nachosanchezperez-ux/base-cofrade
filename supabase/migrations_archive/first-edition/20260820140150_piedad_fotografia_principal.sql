do $$
declare
  image_id uuid;
  media_id uuid;
begin
  select id into image_id
  from public.entities
  where entity_type = 'image'
    and slug = 'nuestra-senora-de-la-piedad';

  if image_id is null then
    raise exception 'No existe la entidad Nuestra Señora de la Piedad';
  end if;

  insert into public.media_assets (
    storage_path,
    media_type,
    title,
    caption,
    alt_text,
    author_name,
    source_name,
    rights_status,
    permission_notes
  ) values (
    '/imagenes/el-baratillo/nuestra-senora-de-la-piedad-jesus-lopez.avif',
    'image',
    'Nuestra Señora de la Piedad',
    'Nuestra Señora de la Piedad, titular de la Hermandad del Baratillo.',
    'Nuestra Señora de la Piedad de la Hermandad del Baratillo',
    'Jesús López',
    'Aportación directa a Hilo Cofrade',
    'authorized',
    'Imagen aportada por el usuario y solicitada expresamente para su publicación en Hilo Cofrade.'
  )
  on conflict (storage_path) do update set
    media_type = excluded.media_type,
    title = excluded.title,
    caption = excluded.caption,
    alt_text = excluded.alt_text,
    author_name = excluded.author_name,
    source_name = excluded.source_name,
    rights_status = excluded.rights_status,
    permission_notes = excluded.permission_notes,
    updated_at = now()
  returning id into media_id;

  update public.entity_media
  set is_cover = false
  where entity_id = image_id
    and is_cover
    and media_asset_id <> media_id;

  insert into public.entity_media (
    entity_id,
    media_asset_id,
    relation_type,
    sort_order,
    is_cover,
    notes
  ) values (
    image_id,
    media_id,
    'portrait',
    0,
    true,
    'Fotografía principal de la ficha pública de la imagen.'
  )
  on conflict (entity_id, media_asset_id, relation_type) do update set
    sort_order = excluded.sort_order,
    is_cover = excluded.is_cover,
    notes = excluded.notes;
end
$$;
