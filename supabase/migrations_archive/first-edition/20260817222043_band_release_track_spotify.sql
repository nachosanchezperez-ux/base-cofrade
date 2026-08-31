-- Hilo Cofrade · Escucha individual de pistas de Discografía
-- Migración 043
--
-- Cada pista de un lanzamiento puede tener su enlace concreto de Spotify.
-- La URL pertenece a la pista/grabación del disco, no a la entidad Marcha:
-- la Marcha conserva por separado autoría, dedicatoria y demás relaciones.

alter table public.band_release_tracks
  add column if not exists spotify_url text;

comment on column public.band_release_tracks.spotify_url is
  'Enlace de Spotify a la pista concreta de este lanzamiento. No representa la identidad de la Marcha.';
