-- Hilo Cofrade · Titulares de la Hermandad del Baratillo
-- Incorpora las tres fotografías aportadas expresamente para su publicación
-- y sustituye el recurso dañado que impedía mostrar a Nuestra Señora de la Piedad.

do $$
declare
  item record;
  image_id uuid;
  media_id uuid;
  cover_count integer;
begin
  for item in
    select *
    from (values
      (
        'santisimo-cristo-de-la-misericordia',
        '/imagenes/el-baratillo/santisimo-cristo-de-la-misericordia.webp',
        'Santísimo Cristo de la Misericordia',
        'Santísimo Cristo de la Misericordia, titular de la Hermandad del Baratillo.',
        'Santísimo Cristo de la Misericordia de la Hermandad del Baratillo',
        null::text
      ),
      (
        'maria-santisima-de-la-caridad-en-su-soledad',
        '/imagenes/el-baratillo/maria-santisima-de-la-caridad-en-su-soledad.webp',
        'María Santísima de la Caridad en su Soledad',
        'María Santísima de la Caridad en su Soledad, titular de la Hermandad del Baratillo.',
        'María Santísima de la Caridad en su Soledad de la Hermandad del Baratillo',
        'Jesús López'
      ),
      (
        'nuestra-senora-de-la-piedad',
        '/imagenes/el-baratillo/nuestra-senora-de-la-piedad.webp',
        'Nuestra Señora de la Piedad',
        'Nuestra Señora de la Piedad, titular de la Hermandad del Baratillo.',
        'Nuestra Señora de la Piedad de la Hermandad del Baratillo',
        'Jesús López'
      )
    ) as data(entity_slug, storage_path, title, caption, alt_text, author_name)
  loop
    select id into image_id
    from public.entities
    where entity_type = 'image'
      and slug = item.entity_slug;

    if image_id is null then
      raise exception 'No existe la entidad de imagen %', item.entity_slug;
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
      item.storage_path,
      'image',
      item.title,
      item.caption,
      item.alt_text,
      item.author_name,
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
  end loop;

  -- El AVIF anterior de la Piedad estaba dañado. Se retiran su relación y su
  -- registro únicamente después de enlazar correctamente el nuevo WebP.
  delete from public.entity_media relation
  using public.media_assets media, public.entities entity
  where relation.media_asset_id = media.id
    and relation.entity_id = entity.id
    and media.storage_path = '/imagenes/el-baratillo/nuestra-senora-de-la-piedad-jesus-lopez.avif'
    and entity.entity_type = 'image'
    and entity.slug = 'nuestra-senora-de-la-piedad';

  delete from public.media_assets media
  where media.storage_path = '/imagenes/el-baratillo/nuestra-senora-de-la-piedad-jesus-lopez.avif'
    and not exists (
      select 1
      from public.entity_media relation
      where relation.media_asset_id = media.id
    );

  select count(*) into cover_count
  from public.entity_media relation
  join public.entities entity on entity.id = relation.entity_id
  join public.media_assets media on media.id = relation.media_asset_id
  where relation.is_cover
    and entity.entity_type = 'image'
    and entity.slug in (
      'santisimo-cristo-de-la-misericordia',
      'maria-santisima-de-la-caridad-en-su-soledad',
      'nuestra-senora-de-la-piedad'
    )
    and media.storage_path like '/imagenes/el-baratillo/%.webp';

  if cover_count <> 3 then
    raise exception 'No se pudieron asociar las tres fotografías del Baratillo';
  end if;
end
$$;
