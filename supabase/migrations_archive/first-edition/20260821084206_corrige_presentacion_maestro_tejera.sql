-- Hilo Cofrade · corrige la presentación visual de Maestro Tejera.
--
-- La fotografía facilitada es la imagen principal de la banda en «De un
-- vistazo» y no una pieza patrimonial inventariada. La corrección conserva el
-- UUID de la banda y elimina únicamente la entidad errónea creada para esa
-- fotografía.

do $migration$
declare
  target_band_id uuid;
  mistaken_asset_id uuid;
begin
  select entity.id
    into target_band_id
  from public.entities entity
  where entity.entity_type = 'band'
    and entity.slug = 'banda-de-musica-del-maestro-tejera';

  if target_band_id is null then
    raise exception 'No se ha encontrado la banda de Maestro Tejera';
  end if;

  select entity.id
    into mistaken_asset_id
  from public.entities entity
  where entity.entity_type = 'heritage_asset'
    and entity.slug = 'banderin-banda-musica-maestro-tejera';

  update public.bands
  set
    hero_image_path = '/bandas/maestro-tejera/formacion.webp',
    hero_image_alt = 'Detalle del paño azul con la lira y la Giralda bordadas en oro de la Banda de Música del Maestro Tejera',
    hero_image_credit = 'Fotografía · Banda de Música Maestro Tejera',
    banderin_entity_id = null
  where entity_id = target_band_id;

  if not found then
    raise exception 'No se ha encontrado la ficha técnica de Maestro Tejera';
  end if;

  if mistaken_asset_id is not null then
    delete from public.heritage_assets
    where entity_id = mistaken_asset_id
      and parent_entity_id = target_band_id;

    delete from public.entities
    where id = mistaken_asset_id
      and entity_type = 'heritage_asset'
      and slug = 'banderin-banda-musica-maestro-tejera';
  end if;

  if not exists (
    select 1
    from public.bands band
    where band.entity_id = target_band_id
      and band.hero_image_path = '/bandas/maestro-tejera/formacion.webp'
      and band.hero_image_credit = 'Fotografía · Banda de Música Maestro Tejera'
      and band.banderin_entity_id is null
  ) then
    raise exception 'No se ha podido establecer la fotografía principal de Maestro Tejera';
  end if;

  if exists (
    select 1
    from public.entities entity
    where entity.entity_type = 'heritage_asset'
      and entity.slug = 'banderin-banda-musica-maestro-tejera'
  ) then
    raise exception 'La pieza patrimonial mal clasificada continúa existiendo';
  end if;
end
$migration$;
