-- Hilo Cofrade · El Baratillo · fotografía del Vía Crucis de 1985
-- Aportación directa del usuario · 21/08/2026

do $$
declare
  target_event_id uuid;
  media_id uuid;
begin
  select entity.id into target_event_id
  from public.entities entity
  where entity.entity_type = 'event'
    and entity.slug = 'via-crucis-hermandades-1985-baratillo';

  if target_event_id is null then
    raise exception 'No existe el acontecimiento del Vía Crucis del Baratillo de 1985';
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
    rights_holder,
    permission_notes
  ) values (
    '/imagenes/el-baratillo/via-crucis-hermandades-1985.webp',
    'image',
    'Vía Crucis de las Hermandades de 1985',
    'El Santísimo Cristo de la Misericordia y Nuestra Señora de la Piedad durante el Vía Crucis de las Hermandades de 1985.',
    'Santísimo Cristo de la Misericordia y Nuestra Señora de la Piedad durante el Vía Crucis de las Hermandades de 1985',
    null,
    'Hermandad',
    'authorized',
    'Hermandad',
    'Fotografía facilitada para su publicación en la sección del Vía Crucis del Baratillo con el crédito Fotografía · Hermandad.'
  )
  on conflict (storage_path) do update set
    media_type = excluded.media_type,
    title = excluded.title,
    caption = excluded.caption,
    alt_text = excluded.alt_text,
    author_name = excluded.author_name,
    source_name = excluded.source_name,
    rights_status = excluded.rights_status,
    rights_holder = excluded.rights_holder,
    permission_notes = excluded.permission_notes,
    updated_at = now()
  returning id into media_id;

  update public.entity_media
  set is_cover = false
  where entity_id = target_event_id
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
    target_event_id,
    media_id,
    'cover',
    0,
    true,
    'Fotografía destacada de la participación del Baratillo en el Vía Crucis de las Hermandades de 1985.'
  )
  on conflict (entity_id, media_asset_id, relation_type) do update set
    sort_order = excluded.sort_order,
    is_cover = excluded.is_cover,
    notes = excluded.notes;

  if not exists (
    select 1
    from public.entity_media relation
    where relation.entity_id = target_event_id
      and relation.media_asset_id = media_id
      and relation.relation_type = 'cover'
      and relation.is_cover
  ) then
    raise exception 'No se pudo vincular la fotografía al acontecimiento del Vía Crucis de 1985';
  end if;
end
$$;
