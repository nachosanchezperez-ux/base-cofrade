-- Recursos gráficos · Hermandad de San Esteban
-- Solo DML sobre el modelo First Edition existente. No introduce DDL ni RLS.

do $$
declare
  v_brotherhood_id uuid;
  v_hero_asset_id uuid;
begin
  select id into strict v_brotherhood_id
  from public.entities
  where slug = 'san-esteban'
    and entity_type = 'brotherhood';

  update public.brotherhoods
  set crest_path = '/hermandades/san-esteban/escudo.png'
  where entity_id = v_brotherhood_id;

  insert into public.media_assets (
    storage_path,
    media_type,
    title,
    caption,
    alt_text,
    author_name,
    source_name,
    source_url,
    rights_status,
    rights_holder,
    license,
    permission_notes,
    taken_or_created_date,
    width_px,
    height_px
  ) values (
    '/hermandades/san-esteban/cabecera-cortejo.jpg',
    'image',
    'Cortejo de la Hermandad de San Esteban',
    'Cruz de guía y nazarenos de la Hermandad de San Esteban durante su estación de penitencia.',
    'Cruz de guía y nazarenos de túnica crema y antifaz celeste de la Hermandad de San Esteban avanzando entre el público.',
    null,
    'Aportación directa a Hilo Cofrade',
    null,
    'authorized',
    null,
    null,
    'Fotografía aportada directamente por Dirección el 2 de septiembre de 2026 y solicitada expresamente para su publicación como cabecera de la Hermandad de San Esteban. Se conserva íntegra la marca visible de la imagen y la autoría queda pendiente de identificar.',
    null,
    1440,
    876
  )
  on conflict (storage_path) do update set
    media_type = excluded.media_type,
    title = excluded.title,
    caption = excluded.caption,
    alt_text = excluded.alt_text,
    author_name = excluded.author_name,
    source_name = excluded.source_name,
    source_url = excluded.source_url,
    rights_status = excluded.rights_status,
    rights_holder = excluded.rights_holder,
    license = excluded.license,
    permission_notes = excluded.permission_notes,
    taken_or_created_date = excluded.taken_or_created_date,
    width_px = excluded.width_px,
    height_px = excluded.height_px,
    updated_at = now()
  returning id into v_hero_asset_id;

  delete from public.entity_media
  where entity_id = v_brotherhood_id
    and relation_type = 'hero'
    and media_asset_id <> v_hero_asset_id;

  insert into public.entity_media (
    entity_id,
    media_asset_id,
    relation_type,
    sort_order,
    is_cover,
    notes,
    focus_x,
    focus_y,
    mobile_focus_x,
    mobile_focus_y,
    fit_mode
  ) values (
    v_brotherhood_id,
    v_hero_asset_id,
    'hero',
    0,
    false,
    'Portada de la Hermandad de San Esteban aportada por Dirección.',
    50,
    48,
    50,
    48,
    'cover'
  )
  on conflict (entity_id, media_asset_id, relation_type) do update set
    sort_order = excluded.sort_order,
    is_cover = excluded.is_cover,
    notes = excluded.notes,
    focus_x = excluded.focus_x,
    focus_y = excluded.focus_y,
    mobile_focus_x = excluded.mobile_focus_x,
    mobile_focus_y = excluded.mobile_focus_y,
    fit_mode = excluded.fit_mode;

  if not exists (
    select 1
    from public.brotherhoods
    where entity_id = v_brotherhood_id
      and crest_path = '/hermandades/san-esteban/escudo.png'
  ) then
    raise exception 'El escudo de San Esteban no quedó asociado a la ficha';
  end if;

  if not exists (
    select 1
    from public.entity_media
    where entity_id = v_brotherhood_id
      and media_asset_id = v_hero_asset_id
      and relation_type = 'hero'
      and fit_mode = 'cover'
  ) then
    raise exception 'La fotografía de San Esteban no quedó seleccionada como cabecera';
  end if;
end
$$;
