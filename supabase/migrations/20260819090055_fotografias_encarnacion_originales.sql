-- Hilo Cofrade · Fotografías originales de La Encarnación
-- Migración 055
--
-- Sustituye las versiones comprimidas/externas por copias locales de las
-- fotografías aportadas por la Agrupación Musical, manteniendo sus créditos.

do $$
declare
  updated_band integer;
  updated_banderin integer;
begin
  update public.bands as b
  set
    hero_image_path = '/bandas/encarnacion/encarnacion-formacion.avif',
    hero_image_alt = 'Agrupación Musical Nuestra Señora de la Encarnación durante una salida procesional en Sevilla',
    hero_image_credit = 'Fotografía · Agrupación Musical'
  from public.entities as e
  where b.entity_id = e.id
    and e.entity_type = 'band'
    and e.slug = 'agrupacion-musical-nuestra-senora-de-la-encarnacion';

  get diagnostics updated_band = row_count;

  update public.heritage_assets as ha
  set
    public_image_path = '/bandas/encarnacion/banderin-encarnacion.avif',
    public_image_alt = 'Banderín de la Agrupación Musical Nuestra Señora de la Encarnación',
    public_image_credit = 'Fotografía · Agrupación Musical'
  from public.bands as b
  join public.entities as e on e.id = b.entity_id
  where ha.entity_id = b.banderin_entity_id
    and e.entity_type = 'band'
    and e.slug = 'agrupacion-musical-nuestra-senora-de-la-encarnacion';

  get diagnostics updated_banderin = row_count;

  if updated_band <> 1 then
    raise exception 'Se esperaba actualizar 1 fotografía de formación y se actualizaron %', updated_band;
  end if;

  if updated_banderin <> 1 then
    raise exception 'Se esperaba actualizar 1 fotografía de banderín y se actualizaron %', updated_banderin;
  end if;
end
$$;
