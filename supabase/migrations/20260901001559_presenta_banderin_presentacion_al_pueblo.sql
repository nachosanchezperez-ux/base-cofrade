do $$
declare
  v_entity_id uuid;
  v_media_asset_id uuid;
begin
  select id
    into strict v_entity_id
  from public.entities
  where slug = 'banderin-presentacion-al-pueblo-dos-hermanas';

  insert into public.media_assets (
    id,
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
  )
  values (
    gen_random_uuid(),
    '/bandas/presentacion-al-pueblo/banderin-presentacion-al-pueblo.png',
    'image',
    'Banderín de Presentación al Pueblo',
    'Banderín de la Banda de Cornetas y Tambores Presentación al Pueblo de Dos Hermanas, aislado sobre fondo transparente.',
    'Banderín bordado de Presentación al Pueblo de Dos Hermanas, con busto de Cristo y remate de orfebrería.',
    null,
    'Aportación directa a Hilo Cofrade',
    null,
    'pending',
    null,
    null,
    'Fotografía aportada el 1 de septiembre de 2026 para su presentación en Hilo Cofrade. Autoría pendiente de identificar. El fondo se retiró sin alterar documentalmente la pieza.',
    null,
    1024,
    1536
  )
  on conflict (storage_path) do update
  set
    media_type = excluded.media_type,
    title = excluded.title,
    caption = excluded.caption,
    alt_text = excluded.alt_text,
    source_name = excluded.source_name,
    rights_status = excluded.rights_status,
    permission_notes = excluded.permission_notes,
    width_px = excluded.width_px,
    height_px = excluded.height_px,
    updated_at = now()
  returning id into v_media_asset_id;

  insert into public.entity_media (
    id,
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
  )
  values (
    gen_random_uuid(),
    v_entity_id,
    v_media_asset_id,
    'cover',
    0,
    true,
    'Recorte documental con fondo transparente; conservar proporciones completas.',
    50,
    50,
    50,
    50,
    'contain'
  )
  on conflict (entity_id, media_asset_id, relation_type) do update
  set
    sort_order = excluded.sort_order,
    is_cover = excluded.is_cover,
    notes = excluded.notes,
    focus_x = excluded.focus_x,
    focus_y = excluded.focus_y,
    mobile_focus_x = excluded.mobile_focus_x,
    mobile_focus_y = excluded.mobile_focus_y,
    fit_mode = excluded.fit_mode;

  update public.heritage_assets
  set
    public_image_path = '/bandas/presentacion-al-pueblo/banderin-presentacion-al-pueblo.png',
    public_image_alt = 'Banderín bordado de Presentación al Pueblo de Dos Hermanas, con busto de Cristo y remate de orfebrería.',
    public_image_credit = 'Fotografía aportada a Hilo Cofrade · autoría pendiente'
  where entity_id = v_entity_id;

  if not found then
    raise exception 'No existe heritage_assets para %', v_entity_id;
  end if;
end
$$;
