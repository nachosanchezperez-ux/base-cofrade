do $$
declare
  v_media_asset_id uuid;
begin
  update public.media_assets
  set
    caption = 'Banderín de la Banda de Cornetas y Tambores Presentación al Pueblo de Dos Hermanas, aislado y presentado sobre fondo negro.',
    permission_notes = 'Fotografía aportada el 1 de septiembre de 2026 para su presentación en Hilo Cofrade. Autoría pendiente de identificar. El entorno se retiró sin alterar documentalmente la pieza y el recorte se presentó sobre fondo negro a petición editorial.',
    updated_at = now()
  where storage_path = '/bandas/presentacion-al-pueblo/banderin-presentacion-al-pueblo.png'
  returning id into v_media_asset_id;

  if v_media_asset_id is null then
    raise exception 'No existe el recurso multimedia del banderín de Presentación al Pueblo';
  end if;

  update public.entity_media
  set notes = 'Presentación documental sobre fondo negro; conservar proporciones completas.'
  where media_asset_id = v_media_asset_id
    and relation_type = 'cover';

  if not found then
    raise exception 'No existe la relación multimedia del banderín de Presentación al Pueblo';
  end if;
end
$$;
