-- Hilo Cofrade · Portadas de la Banda del Sol y El Carmen de Salteras
--
-- Retira las fichas de dirección cargadas inicialmente, incorpora las portadas
-- oficiales de Spotify de toda la discografía publicada y añade el dorado como
-- matiz visual de la Banda del Sol sin sustituir sus dos tonos azules.

delete from public.band_agents band_agent
using public.entities band
where band_agent.band_entity_id = band.id
  and band.entity_type = 'band'
  and band.slug in ('banda-del-sol', 'carmen-de-salteras');

insert into public.band_colors (
  band_entity_id, color_name, hex_value, color_role, sort_order, notes, status
)
select
  band.id,
  'Dorado',
  '#D4AF37',
  'accent',
  30::smallint,
  'Matiz dorado presente en el logotipo y en la identidad visual',
  'published'
from public.entities band
where band.entity_type = 'band'
  and band.slug = 'banda-del-sol'
on conflict (band_entity_id, color_name) do update set
  hex_value = excluded.hex_value,
  color_role = excluded.color_role,
  sort_order = excluded.sort_order,
  notes = excluded.notes,
  status = excluded.status;

create temporary table _hc_band_release_covers (
  band_slug text not null,
  title text not null,
  release_year integer not null,
  spotify_album_id text not null,
  cover_url text not null,
  primary key (band_slug, title, release_year)
) on commit drop;

insert into _hc_band_release_covers values
  ('banda-del-sol', 'Cuando Triana se va… (Live)', 2026, '6ens3kELXxEzYSXifNIjtS', 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02f4372dce9fe59ab351cfbf1b'),
  ('banda-del-sol', 'Piedad Coronada', 2025, '3r3GqHHU20iqn8m0EOq0ox', 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e021411852082b40ad421be814c'),
  ('banda-del-sol', 'Anístemi', 2025, '5hlybDSGRV8TahQjDFkAY8', 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02f58b0efb0c3aec04b86331cf'),
  ('banda-del-sol', 'Paseo de la O', 2025, '1zyXPtCxU9smzHnJBAS1pz', 'https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e022043e5bbafc08c38060e241f'),
  ('banda-del-sol', 'La Música de Sevilla: Sonidos de la Madrugá', 2025, '5B2H5BsAQY5vNt05vScau1', 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02b3a8a1f718ed63fd9566d05a'),
  ('banda-del-sol', 'La Música de la Esperanza', 2024, '5qW1ouvXe9xO3ThIvHhAli', 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e025d704dc9de1121c6d76eb49d'),
  ('banda-del-sol', 'Niña del Arenal', 2024, '5eJ9ENJDE7L3EsKKM00tE6', 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02674bb1f39b6518daa25e0eac'),
  ('banda-del-sol', 'Sol de Pasión. Selección Musical para Semana Santa', 2012, '4oi0CARPELXYaIIjE60LmW', 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02224052f735452252fea2a664'),
  ('banda-del-sol', 'Bendición', 2002, '1pdX8a8ulTRLYu8Mb6kOxP', 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e023b791f4532455cba1c920ce7'),
  ('banda-del-sol', 'Sones de Sol', 1999, '5Vpgts6diR80y0k1E1XCRs', 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02e378457f33e6aa1f708a5396'),
  ('banda-del-sol', 'Sol. XX Aniversario', 1995, '5STccimIQNwVrbKz2N6CEu', 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e0225221605110a35d7c5c71e63'),
  ('banda-del-sol', 'Sol', 1993, '5jUxky6jWpOoZK1nTnAVk6', 'https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02e6d11011c9e4b7dcffa6820e'),
  ('banda-del-sol', 'Cuando la Semana Santa Empieza', 1992, '23vpMmMUG5JbE4N5OZw6H1', 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02c0ecaf5ecf5ccbcf68640d5a'),
  ('banda-del-sol', 'Sonidos de Sevilla (XV Aniversario)', 1990, '4vlgWpssNGchktHrNV1vrV', 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e023bcbd5aa1c06c2c5c3ec6e4b'),
  ('banda-del-sol', 'Banda de Cornetas y Tambores Nuestra Señora del Sol', 1989, '2JdqpBpv6Ag5NkGgZHR79z', 'https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e0243c26e629e2e556a812b7182'),
  ('banda-del-sol', 'Marchas Procesionales', 1986, '7bThfwSP14PtuNkJ3GwJNr', 'https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02ab3e0f819800aa04b9895aee'),
  ('carmen-de-salteras', 'El Carisma Carmelitano', 2026, '4Vkmh1XJYY23ExLyGLmmmW', 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e020ffdf300bf5218546e7ff2f6'),
  ('carmen-de-salteras', 'Estampas Macarenas', 2026, '1msVxsGqHIzLzaPOjHZk4B', 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02ab2aa09885aac6cd585aed0e'),
  ('carmen-de-salteras', 'Jesús Nazareno', 2026, '6I1UdOGg1z9rcc36kb3Fam', 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e029297d049347bc3823e2c5d46'),
  ('carmen-de-salteras', 'La Esperanza de Judá', 2026, '1JGhvZIEZSOHRwDylygoCz', 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02cd34656824d192814145ef8c'),
  ('carmen-de-salteras', 'Marchando hacia la Esperanza', 2026, '4usyY0gH70q0ETh0yYNOxL', 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e021c08ef74cb54fe78ce80b2c9'),
  ('carmen-de-salteras', 'El Carmen', 2025, '1Q7SlJcXPQxxQLIYKpTjch', 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e025bf65c732d99617a36458877'),
  ('carmen-de-salteras', 'A mi Piedad en la tarde', 2024, '5lq9aJAagnzAw6dHt9opsM', 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02a133aebfddbc0962c8df2ea6'),
  ('carmen-de-salteras', 'Como tú, ninguna', 2024, '7G4d52CJx8N9nAC6QNGviE', 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e024ae22752e06a3a6054bf63ef'),
  ('carmen-de-salteras', 'Concierto de Cuaresma en la Macarena (2024)', 2024, '12S69iZW9o8x8uRy5PJrGp', 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e029a11be011537a22856f755f0'),
  ('carmen-de-salteras', 'Coronada de Luz', 2024, '1KGhkvtUxSMqIxY00gcfMO', 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02ceb24f940c45f4e33a7241a8'),
  ('carmen-de-salteras', 'La Cruz de Mayo', 2024, '4WzXZ5c1862z8cyuVg89yb', 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e028e13d744144b0817820b57de'),
  ('carmen-de-salteras', 'La Virgen de las Mercedes', 2024, '3VXseSzYNfHZtyZLC2IQoS', 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e022d44ffbc7b03f1412ac531d9'),
  ('carmen-de-salteras', 'Nanas del Baratillo', 2024, '0zJb2YIrT700Abg9eJsmi5', 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e028db1227a764811b30bd68718'),
  ('carmen-de-salteras', 'Concierto en San Juan de la Palma (2023)', 2023, '3PPkG5TxurQxtfMDtT5712', 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e0227c67ea25b26ed468ed716cd'),
  ('carmen-de-salteras', 'Concierto 40 años de Baratillo (2022)', 2022, '5JUxJG9tB6qXKJEPb8BxoA', 'https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e0247511fbadc60844f4baaf415'),
  ('carmen-de-salteras', 'Concierto de Cuaresma en la Macarena (2022)', 2022, '0IVckY7lSBpwXTlhroful3', 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e0288aeb50cb8b9882debad1b21'),
  ('carmen-de-salteras', 'Carmen', 2019, '3QUrvjkjUJl6ektn7FNT6R', 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02e989df2d04ad5192a9c65bbc'),
  ('carmen-de-salteras', 'Salteras y sus Bandas de Música', 2018, '2ngmrn4sazwBmqO4uJwtvW', 'https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e0255e49dc1397e1f74a68edbaf'),
  ('carmen-de-salteras', 'El Tarantán', 2016, '2zGVutFy4JRSkG68Uts6T2', 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02aa97ef1cf3c61d0ac36e38da'),
  ('carmen-de-salteras', 'Madre… para ti mi música', 2012, '6IKaV2w42u26i0Yk7W7NLc', 'https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02dccd7d3237514fdea482ce16'),
  ('carmen-de-salteras', 'Un Recuerdo', 2007, '4NxoBtzxvM7ojQ1y6BeVBL', 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e025da9f405e8a50f906dc4342a'),
  ('carmen-de-salteras', 'Andalucía Cofrade', 2006, '4pCKVSeeLVKYcx7hrMgWHy', 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e026ad4e1b9c72b19c56db4f4b5'),
  ('carmen-de-salteras', 'Lignum Crucis', 2006, '20P0nkq54JEMT2hNckwRWA', 'https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e0269735ca5d56bdf2f9b6494b8'),
  ('carmen-de-salteras', 'Cádiz Cofrade', 2005, '0jBsniAu1YGgYHid1cTqjA', 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e024f5baac7612689be539af517'),
  ('carmen-de-salteras', 'Para Sevilla por su fundación', 2003, '2maMmnkwAjINocbh4fl5UI', 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e0289f1cc3e0f5f606800066098'),
  ('carmen-de-salteras', 'Salve, Baratillo', 2003, '2hcCCzhGNmL7HIlGlZ7WST', 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e023d6ce7f881a810f54fb69da6'),
  ('carmen-de-salteras', '25 Aniversario Macareno del Carmen', 2002, '65t8Y51aORAcI4GfjOLDIL', 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02b942be485c8bc4828b48e739'),
  ('carmen-de-salteras', 'Ecce Homo', 2001, '0GKU4JALAFftzyVJXj6TL9', 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02757da0e118a8a12505cd39b3'),
  ('carmen-de-salteras', 'Reina del Salvador', 2001, '19BBlWatGglGuoWQujD7K1', 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e0207ae6245a73ef2593d782e6b'),
  ('carmen-de-salteras', 'Chicotá', 1994, '7yXF16uc9r6QGRW3X2krix', 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e0281d49feb673e70043b2194c7'),
  ('carmen-de-salteras', 'Marchas Procesionales', 1987, '73rNqC6hKg6vEMfCvftXj8', 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02e93c1f9469f75c682e343e6b');

update public.band_releases release
set
  cover_image_path = desired.cover_url,
  cover_image_alt = 'Portada de «' || desired.title || '»',
  cover_image_credit = 'Portada oficial · Spotify',
  spotify_url = 'https://open.spotify.com/album/' || desired.spotify_album_id
from _hc_band_release_covers desired
join public.entities band
  on band.slug = desired.band_slug
  and band.entity_type = 'band'
where release.band_entity_id = band.id
  and release.title = desired.title
  and release.release_year = desired.release_year;

do $$
declare
  staged_count integer;
  updated_count integer;
  direction_count integer;
  accent_count integer;
begin
  select count(*) into staged_count from _hc_band_release_covers;

  select count(*) into updated_count
  from _hc_band_release_covers desired
  join public.entities band
    on band.slug = desired.band_slug
    and band.entity_type = 'band'
  join public.band_releases release
    on release.band_entity_id = band.id
    and release.title = desired.title
    and release.release_year = desired.release_year
    and release.cover_image_path = desired.cover_url
    and release.spotify_url = 'https://open.spotify.com/album/' || desired.spotify_album_id;

  if staged_count <> 47 or updated_count <> staged_count then
    raise exception 'Portadas incompletas: % de % lanzamientos actualizados', updated_count, staged_count;
  end if;

  select count(*) into direction_count
  from public.band_agents band_agent
  join public.entities band on band.id = band_agent.band_entity_id
  where band.slug in ('banda-del-sol', 'carmen-de-salteras');

  if direction_count <> 0 then
    raise exception 'La dirección sigue cargada en % fichas', direction_count;
  end if;

  select count(*) into accent_count
  from public.band_colors color
  join public.entities band on band.id = color.band_entity_id
  where band.slug = 'banda-del-sol'
    and color.color_role = 'accent'
    and color.hex_value = '#D4AF37';

  if accent_count <> 1 then
    raise exception 'No se pudo aplicar el matiz dorado a la Banda del Sol';
  end if;
end
$$;
