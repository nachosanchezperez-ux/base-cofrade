-- Hilo Cofrade · Fotografías de La Cena
-- Incorpora las fotografías principales del paso de palio de Nuestra Señora
-- del Subterráneo y del Santísimo Cristo de la Humildad y Paciencia.

do $$
declare
  item record;
  target_entity_id uuid;
  media_id uuid;
  linked_cover_count integer;
begin
  for item in
    select *
    from (values
      (
        'step'::text,
        'paso-palio-nuestra-senora-del-subterraneo',
        '/imagenes/la-cena/paso-palio-nuestra-senora-del-subterraneo.webp',
        'Paso de palio de Nuestra Señora del Subterráneo',
        'Paso de palio de Nuestra Señora del Subterráneo, de la Hermandad de la Sagrada Cena.',
        'Paso de palio de Nuestra Señora del Subterráneo de la Hermandad de la Sagrada Cena',
        'Luis Selvático'::text,
        'Aportación directa a Hilo Cofrade',
        'Fotografía principal de la ficha pública del paso.'
      ),
      (
        'image'::text,
        'santisimo-cristo-de-la-humildad-y-paciencia',
        '/imagenes/la-cena/santisimo-cristo-de-la-humildad-y-paciencia.webp',
        'Santísimo Cristo de la Humildad y Paciencia',
        'Santísimo Cristo de la Humildad y Paciencia, titular de la Hermandad de la Sagrada Cena.',
        'Santísimo Cristo de la Humildad y Paciencia, titular de la Hermandad de la Sagrada Cena',
        null::text,
        'Hermandad',
        'Fotografía principal de la ficha pública de la imagen.'
      )
    ) as data(
      entity_type,
      entity_slug,
      storage_path,
      title,
      caption,
      alt_text,
      author_name,
      source_name,
      relation_notes
    )
  loop
    select id into target_entity_id
    from public.entities
    where entity_type = item.entity_type
      and slug = item.entity_slug;

    if target_entity_id is null then
      raise exception 'No existe la entidad % (%)', item.entity_slug, item.entity_type;
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
      item.source_name,
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
    where entity_id = target_entity_id
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
      target_entity_id,
      media_id,
      'portrait',
      0,
      true,
      item.relation_notes
    )
    on conflict (entity_id, media_asset_id, relation_type) do update set
      sort_order = excluded.sort_order,
      is_cover = excluded.is_cover,
      notes = excluded.notes;
  end loop;

  select count(*) into linked_cover_count
  from public.entity_media relation
  join public.entities entity on entity.id = relation.entity_id
  join public.media_assets media on media.id = relation.media_asset_id
  where relation.is_cover
    and (
      (
        entity.entity_type = 'step'
        and entity.slug = 'paso-palio-nuestra-senora-del-subterraneo'
        and media.storage_path = '/imagenes/la-cena/paso-palio-nuestra-senora-del-subterraneo.webp'
      )
      or
      (
        entity.entity_type = 'image'
        and entity.slug = 'santisimo-cristo-de-la-humildad-y-paciencia'
        and media.storage_path = '/imagenes/la-cena/santisimo-cristo-de-la-humildad-y-paciencia.webp'
      )
    );

  if linked_cover_count <> 2 then
    raise exception 'No se pudieron asociar las dos fotografías de La Cena';
  end if;
end
$$;
