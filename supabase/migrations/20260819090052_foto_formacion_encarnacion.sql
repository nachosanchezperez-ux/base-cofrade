-- Hilo Cofrade · Fotografía de formación de La Encarnación
-- Migración 052
--
-- Completa el bloque "De un vistazo" de La Encarnación con una fotografía
-- de la formación, siguiendo el mismo patrón visual y de datos que Las Cigarreras.

do $$
begin
  update public.bands
  set
    hero_image_path = '/bandas/encarnacion/encarnacion-formacion.webp',
    hero_image_alt = 'Agrupación Musical Nuestra Señora de la Encarnación durante una salida procesional en Sevilla',
    hero_image_credit = 'Fotografía · Agrupación Musical'
  where entity_id = 'cb04a5d8-e81e-4405-a001-9d5a60840924';

  if not found then
    raise exception 'No existe la Agrupación Musical Nuestra Señora de la Encarnación';
  end if;
end
$$;