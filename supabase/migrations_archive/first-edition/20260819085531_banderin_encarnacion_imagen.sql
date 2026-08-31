-- Hilo Cofrade · Imagen pública del banderín de La Encarnación
-- Migración 051
--
-- Asocia la fotografía facilitada por la Agrupación Musical al activo
-- patrimonial ya existente. La ficha pública de Bandas reutiliza el mismo
-- componente de patrimonio que Las Cigarreras.

do $$
declare
  asset_id uuid;
begin
  select id
    into asset_id
  from public.entities
  where slug = 'banderin-agrupacion-musical-nuestra-senora-de-la-encarnacion'
    and entity_type = 'heritage_asset';

  if asset_id is null then
    raise exception 'No existe el banderín de la Agrupación Musical Nuestra Señora de la Encarnación';
  end if;

  update public.heritage_assets
  set
    public_image_path = '/bandas/encarnacion/banderin-encarnacion.jpg',
    public_image_alt = 'Banderín de la Agrupación Musical Nuestra Señora de la Encarnación',
    public_image_credit = 'Fotografía · Agrupación Musical'
  where entity_id = asset_id
    and parent_entity_id = 'cb04a5d8-e81e-4405-a001-9d5a60840924';

  if not found then
    raise exception 'No se encontró la pieza patrimonial asociada a La Encarnación';
  end if;
end
$$;
