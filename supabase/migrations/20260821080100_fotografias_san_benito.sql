-- Hilo Cofrade · San Benito · fotografías de pasos y titulares
-- Aportación directa del usuario · 21/08/2026
--
-- Incorpora las fotografías principales del paso de misterio, el paso del
-- Cristo de la Sangre, Nuestra Señora de la Encarnación Coronada y el
-- Santísimo Sacramento. Los créditos siguen el criterio editorial vigente:
-- autor visible cuando consta y Hermandad cuando la autoría no está indicada.

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
        'paso-de-misterio-de-la-sagrada-presentacion-de-jesus-al-pueblo'::text,
        '/imagenes/san-benito/paso-misterio-sagrada-presentacion-jose-casado.webp'::text,
        'Paso de misterio de la Sagrada Presentación de Jesús al Pueblo'::text,
        'Paso de misterio de la Sagrada Presentación de Jesús al Pueblo durante la estación de penitencia de San Benito.'::text,
        'Paso de misterio de la Sagrada Presentación de Jesús al Pueblo avanzando por la Calzada entre el público'::text,
        'José Casado Fdez.'::text,
        'José Casado Fdez.'::text,
        'Fotografía principal de la ficha pública del paso.'::text
      ),
      (
        'step',
        'paso-del-cristo-de-la-sangre',
        '/imagenes/san-benito/paso-cristo-sangre-jose-casado.webp',
        'Paso del Santísimo Cristo de la Sangre',
        'Paso del Santísimo Cristo de la Sangre durante la estación de penitencia de San Benito.',
        'Paso del Santísimo Cristo de la Sangre recorriendo una calle estrecha durante la noche del Martes Santo',
        'José Casado Fdez.',
        'José Casado Fdez.',
        'Fotografía principal de la ficha pública del paso.'
      ),
      (
        'image',
        'nuestra-senora-de-la-encarnacion-coronada',
        '/imagenes/san-benito/nuestra-senora-encarnacion-coronada.webp',
        'Nuestra Señora de la Encarnación Coronada',
        'Nuestra Señora de la Encarnación Coronada, titular de la Hermandad de San Benito.',
        'Primer plano de Nuestra Señora de la Encarnación Coronada con corona, encajes y joyas',
        'Hermandad',
        'Hermandad de San Benito',
        'Fotografía principal de la ficha pública de la imagen.'
      ),
      (
        'advocation',
        'santisimo-sacramento',
        '/imagenes/san-benito/santisimo-sacramento.webp',
        'Santísimo Sacramento',
        'Santísimo Sacramento, titular de la Hermandad de San Benito.',
        'Custodia con el Santísimo Sacramento dispuesta sobre el altar de la Hermandad de San Benito',
        'Hermandad',
        'Hermandad de San Benito',
        'Fotografía principal de la identidad devocional titular.'
      )
    ) as data(
      entity_type,
      entity_slug,
      storage_path,
      title,
      caption,
      alt_text,
      author_name,
      rights_holder,
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
      item.author_name,
      'Aportación directa a Hilo Cofrade',
      'authorized',
      item.rights_holder,
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
    and (entity.slug, media.storage_path) in (
      ('paso-de-misterio-de-la-sagrada-presentacion-de-jesus-al-pueblo', '/imagenes/san-benito/paso-misterio-sagrada-presentacion-jose-casado.webp'),
      ('paso-del-cristo-de-la-sangre', '/imagenes/san-benito/paso-cristo-sangre-jose-casado.webp'),
      ('nuestra-senora-de-la-encarnacion-coronada', '/imagenes/san-benito/nuestra-senora-encarnacion-coronada.webp'),
      ('santisimo-sacramento', '/imagenes/san-benito/santisimo-sacramento.webp')
    );

  if linked_cover_count <> 4 then
    raise exception 'No se pudieron asociar las cuatro fotografías principales de San Benito';
  end if;
end
$$;
