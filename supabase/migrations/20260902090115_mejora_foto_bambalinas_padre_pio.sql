-- Corrección editorial · Padre Pío
-- Sustituye la derivada de WordPress por la fotografía original y cambia la
-- ruta pública para invalidar la caché del optimizador de imágenes.

do $$
declare
  v_asset_id uuid;
  v_rows integer;
begin
  select id into strict v_asset_id
  from public.entities
  where slug = 'bambalinas-palio-madre-divina-gracia-padre-pio';

  update public.heritage_assets
  set public_image_path = '/hermandades/padre-pio/bambalinas-palio-2026-original.jpeg',
      updated_at = now()
  where entity_id = v_asset_id
    and public_image_path in (
      '/hermandades/padre-pio/bambalinas-palio-2026.jpeg',
      '/hermandades/padre-pio/bambalinas-palio-2026-original.jpeg'
    );

  get diagnostics v_rows = row_count;

  if v_rows <> 1 then
    raise exception 'La fotografía de las bambalinas de Padre Pío debe actualizar una única ficha';
  end if;

  if not exists (
    select 1
    from public.heritage_assets
    where entity_id = v_asset_id
      and public_image_path = '/hermandades/padre-pio/bambalinas-palio-2026-original.jpeg'
      and nullif(public_image_alt, '') is not null
      and nullif(public_image_credit, '') is not null
  ) then
    raise exception 'La fotografía original debe conservar texto alternativo y crédito';
  end if;
end
$$;
