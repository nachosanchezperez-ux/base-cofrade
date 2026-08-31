-- Hilo Cofrade · Patriarca Bendito Señor San José
-- Fotografía principal facilitada por la Hermandad del Baratillo.

do $$
declare
  image_id uuid;
  media_id uuid;
  linked_cover_count integer;
begin
  select id into image_id
  from public.entities
  where entity_type = 'image'
    and slug = 'patriarca-bendito-senor-san-jose';

  if image_id is null then
    raise exception 'No existe la entidad Patriarca Bendito Señor San José';
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
    '/imagenes/el-baratillo/patriarca-bendito-senor-san-jose.webp',
    'image',
    'Patriarca Bendito Señor San José',
    'Patriarca Bendito Señor San José, titular de la Hermandad del Baratillo.',
    'Patriarca Bendito Señor San José con el Niño Jesús, titular de la Hermandad del Baratillo',
    null,
    'Hermandad del Baratillo',
    'authorized',
    'Fotografía facilitada por la Hermandad del Baratillo y aportada expresamente por el usuario para su publicación en Hilo Cofrade.'
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

  select count(*) into linked_cover_count
  from public.entity_media
  where entity_id = image_id
    and media_asset_id = media_id
    and relation_type = 'portrait'
    and is_cover;

  if linked_cover_count <> 1 then
    raise exception 'No se pudo asociar la fotografía principal a San José';
  end if;
end
$$;
