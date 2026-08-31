-- Hilo Cofrade · Paso de palio de María Santísima de la Caridad en su Soledad
-- Fotografía principal aportada expresamente para su publicación.

do $$
declare
  step_id uuid;
  media_id uuid;
  linked_cover_count integer;
begin
  select id into step_id
  from public.entities
  where entity_type = 'step'
    and slug = 'paso-de-palio-de-maria-santisima-de-la-caridad';

  if step_id is null then
    raise exception 'No existe el paso de palio de María Santísima de la Caridad';
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
    '/imagenes/el-baratillo/paso-palio-caridad.webp',
    'image',
    'Paso de palio de María Santísima de la Caridad en su Soledad',
    'El paso de palio de María Santísima de la Caridad en su Soledad en la salida de la Hermandad del Baratillo.',
    'Paso de palio de María Santísima de la Caridad en su Soledad durante su estación de penitencia',
    'Adolfo Sánchez',
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
  where entity_id = step_id
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
    step_id,
    media_id,
    'portrait',
    0,
    true,
    'Fotografía principal de la ficha pública del paso.'
  )
  on conflict (entity_id, media_asset_id, relation_type) do update set
    sort_order = excluded.sort_order,
    is_cover = excluded.is_cover,
    notes = excluded.notes;

  select count(*) into linked_cover_count
  from public.entity_media relation
  where relation.entity_id = step_id
    and relation.media_asset_id = media_id
    and relation.is_cover;

  if linked_cover_count <> 1 then
    raise exception 'No se pudo asociar la fotografía principal al paso de palio de la Caridad';
  end if;
end
$$;
