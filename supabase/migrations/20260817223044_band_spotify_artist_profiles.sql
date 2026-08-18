-- Hilo Cofrade · Perfiles de artista en Spotify
-- Migración 044
--
-- El perfil Spotify pertenece a la Banda como enlace oficial de escucha.
-- No documenta hechos históricos y no sustituye a las Fuentes.

insert into public.entity_social_links (
  entity_id, platform, url, label, display_order, is_public
) values
(
  'cb04a5d8-e81e-4405-a001-9d5a60840924',
  'spotify',
  'https://open.spotify.com/intl-es/artist/1N8qK8AlkS9BlCa8cvZBNs',
  'Spotify oficial',
  50,
  true
),
(
  'b1000000-0000-0000-0000-000000000001',
  'spotify',
  'https://open.spotify.com/intl-es/artist/682MTOLBDFubIW0fcw0tbr',
  'Spotify oficial',
  50,
  true
)
on conflict (entity_id, platform) do update set
  url = excluded.url,
  label = excluded.label,
  display_order = excluded.display_order,
  is_public = excluded.is_public;
