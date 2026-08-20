-- Hilo Cofrade · La Cena · fotografías de titulares y paso de la Encarnación
-- Aportación directa del usuario · 21/08/2026
--
-- Se conservan todas las entidades y relaciones existentes. Los medios se
-- resuelven por slug y ruta pública, sin reutilizar ni fijar UUID.

do $$
declare
  item record;
  target_entity_id uuid;
  media_id uuid;
  linked_media_count integer;
  linked_cover_count integer;
begin
  for item in
    select *
    from (values
      (
        'image'::text,
        'nuestra-senora-del-subterraneo'::text,
        '/imagenes/la-cena/nuestra-senora-del-subterraneo.webp'::text,
        'Nuestra Señora del Subterráneo'::text,
        'Nuestra Señora del Subterráneo Reina de Cielos y Tierra, titular de la Hermandad de la Sagrada Cena.'::text,
        'Nuestra Señora del Subterráneo Reina de Cielos y Tierra, vestida con saya roja y manto azul bordado en oro'::text,
        'portrait'::text,
        0::integer,
        true::boolean,
        'Fotografía principal de la ficha pública de la imagen.'::text
      ),
      (
        'image',
        'nuestra-senora-del-subterraneo',
        '/imagenes/la-cena/nuestra-senora-del-subterraneo-detalle.webp',
        'Nuestra Señora del Subterráneo · detalle',
        'Primer plano de Nuestra Señora del Subterráneo Reina de Cielos y Tierra.',
        'Detalle del rostro, corona y atavío de Nuestra Señora del Subterráneo',
        'gallery',
        10,
        false,
        'Fotografía de detalle para la galería pública de la imagen.'
      ),
      (
        'image',
        'senor-de-la-sagrada-cena',
        '/imagenes/la-cena/senor-de-la-sagrada-cena.webp',
        'Señor de la Sagrada Cena',
        'Señor de la Sagrada Cena, titular de la Hermandad de la Sagrada Cena.',
        'Señor de la Sagrada Cena con el cáliz entre las manos y los apóstoles del misterio al fondo',
        'portrait',
        0,
        true,
        'Fotografía principal de la ficha pública de la imagen.'
      ),
      (
        'image',
        'senor-de-la-sagrada-cena',
        '/imagenes/la-cena/senor-de-la-sagrada-cena-detalle.webp',
        'Señor de la Sagrada Cena · detalle',
        'Primer plano del Señor de la Sagrada Cena.',
        'Detalle del rostro, potencias y bordados del Señor de la Sagrada Cena',
        'gallery',
        10,
        false,
        'Fotografía de detalle para la galería pública de la imagen.'
      ),
      (
        'image',
        'nuestra-senora-de-la-encarnacion-la-cena',
        '/imagenes/la-cena/nuestra-senora-de-la-encarnacion-la-cena.webp',
        'Nuestra Señora de la Encarnación',
        'Nuestra Señora de la Encarnación, titular de gloria de la Hermandad de la Sagrada Cena.',
        'Nuestra Señora de la Encarnación con vestido blanco bordado, corona y ráfaga de plata',
        'portrait',
        0,
        true,
        'Fotografía principal de la ficha pública de la imagen.'
      ),
      (
        'step',
        'paso-procesional-nuestra-senora-de-la-encarnacion-la-cena',
        '/imagenes/la-cena/paso-procesional-nuestra-senora-de-la-encarnacion-la-cena.webp',
        'Paso procesional de Nuestra Señora de la Encarnación',
        'Paso procesional de Nuestra Señora de la Encarnación, de la Hermandad de la Sagrada Cena.',
        'Paso procesional de Nuestra Señora de la Encarnación dispuesto en el interior de la iglesia de Los Terceros',
        'portrait',
        0,
        true,
        'Fotografía principal de la ficha pública del paso.'
      )
    ) as data(
      entity_type,
      entity_slug,
      storage_path,
      title,
      caption,
      alt_text,
      relation_type,
      sort_order,
      is_cover,
      relation_notes
    )
  loop
    select entity.id into target_entity_id
    from public.entities entity
    where entity.entity_type = item.entity_type
      and entity.slug = item.entity_slug;

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
      rights_holder,
      permission_notes
    ) values (
      item.storage_path,
      'image',
      item.title,
      item.caption,
      item.alt_text,
      'Luis Selvático',
      'Aportación directa a Hilo Cofrade',
      'authorized',
      'Luis Selvático',
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
      rights_holder = excluded.rights_holder,
      permission_notes = excluded.permission_notes,
      updated_at = now()
    returning id into media_id;

    if item.is_cover then
      update public.entity_media
      set is_cover = false
      where entity_id = target_entity_id
        and is_cover
        and media_asset_id <> media_id;
    end if;

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
      item.relation_type,
      item.sort_order,
      item.is_cover,
      item.relation_notes
    )
    on conflict (entity_id, media_asset_id, relation_type) do update set
      sort_order = excluded.sort_order,
      is_cover = excluded.is_cover,
      notes = excluded.notes;
  end loop;

  select count(*) into linked_media_count
  from public.entity_media relation
  join public.entities entity on entity.id = relation.entity_id
  join public.media_assets media on media.id = relation.media_asset_id
  where (entity.slug, media.storage_path) in (
    ('nuestra-senora-del-subterraneo', '/imagenes/la-cena/nuestra-senora-del-subterraneo.webp'),
    ('nuestra-senora-del-subterraneo', '/imagenes/la-cena/nuestra-senora-del-subterraneo-detalle.webp'),
    ('senor-de-la-sagrada-cena', '/imagenes/la-cena/senor-de-la-sagrada-cena.webp'),
    ('senor-de-la-sagrada-cena', '/imagenes/la-cena/senor-de-la-sagrada-cena-detalle.webp'),
    ('nuestra-senora-de-la-encarnacion-la-cena', '/imagenes/la-cena/nuestra-senora-de-la-encarnacion-la-cena.webp'),
    ('paso-procesional-nuestra-senora-de-la-encarnacion-la-cena', '/imagenes/la-cena/paso-procesional-nuestra-senora-de-la-encarnacion-la-cena.webp')
  );

  if linked_media_count <> 6 then
    raise exception 'No se pudieron asociar las seis fotografías de La Cena';
  end if;

  select count(*) into linked_cover_count
  from public.entity_media relation
  join public.entities entity on entity.id = relation.entity_id
  join public.media_assets media on media.id = relation.media_asset_id
  where relation.is_cover
    and (entity.slug, media.storage_path) in (
      ('nuestra-senora-del-subterraneo', '/imagenes/la-cena/nuestra-senora-del-subterraneo.webp'),
      ('senor-de-la-sagrada-cena', '/imagenes/la-cena/senor-de-la-sagrada-cena.webp'),
      ('nuestra-senora-de-la-encarnacion-la-cena', '/imagenes/la-cena/nuestra-senora-de-la-encarnacion-la-cena.webp'),
      ('paso-procesional-nuestra-senora-de-la-encarnacion-la-cena', '/imagenes/la-cena/paso-procesional-nuestra-senora-de-la-encarnacion-la-cena.webp')
    );

  if linked_cover_count <> 4 then
    raise exception 'No se pudieron establecer las cuatro fotografías de portada de La Cena';
  end if;
end
$$;
