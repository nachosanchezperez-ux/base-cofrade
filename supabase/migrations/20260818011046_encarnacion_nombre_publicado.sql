-- Hilo Cofrade · identidad pública de La Encarnación
--
-- La denominación oficial completa sigue siendo la identidad formal de la Banda.
-- El nombre popular actual se usa como nombre publicado en la experiencia pública
-- (H1, breadcrumb y demás contextos de descubrimiento).

update public.band_names
set
  name = 'La Encarnación',
  short_name = 'La Encarnación'
where band_entity_id = 'cb04a5d8-e81e-4405-a001-9d5a60840924'
  and name_type = 'popular'
  and is_current = true;
