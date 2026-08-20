-- Hilo Cofrade · Jesús Presentado al Pueblo · San Benito
-- Fotografía principal aportada expresamente para su publicación.
-- Normaliza además el criterio visual de créditos fotográficos:
-- "Fotografía • Nombre del autor".

do $$
declare
  image_id uuid;
  media_id uuid;
begin
  select id into image_id
  from public.entities
  where entity_type = 'image'
    and slug = 'jesus-presentado-al-pueblo';

  if image_id is null then
    raise exception 'No existe la entidad Jesús Presentado al Pueblo';
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
    '/imagenes/san-benito/jesus-presentado-al-pueblo-jose-casado.avif',
    'image',
    'Jesús Presentado al Pueblo',
    'Jesús Presentado al Pueblo, titular de la Hermandad de San Benito.',
    'Jesús Presentado al Pueblo de la Hermandad de San Benito',
    'José Casado Fdez.',
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

  -- Criterio visual común de créditos fotográficos ya existentes.
  update public.bands
  set hero_image_credit = regexp_replace(hero_image_credit, '^Fotografía\s*[·•]\s*', 'Fotografía • ')
  where hero_image_credit ~ '^Fotografía\s*[·•]';

  update public.heritage_assets
  set public_image_credit = regexp_replace(public_image_credit, '^Fotografía\s*[·•]\s*', 'Fotografía • ')
  where public_image_credit ~ '^Fotografía\s*[·•]';

  update public.outings
  set hero_image_credit = regexp_replace(hero_image_credit, '^Fotografía\s*[·•]\s*', 'Fotografía • ')
  where hero_image_credit ~ '^Fotografía\s*[·•]';
end
$$;
