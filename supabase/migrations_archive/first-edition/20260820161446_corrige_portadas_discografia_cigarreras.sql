-- Hilo Cofrade · Ajustes finales de la discografía de Las Cigarreras
--
-- Adapta las portadas a los dominios de imagen admitidos por la aplicación y
-- completa los enlaces de Spotify del disco Sentimiento sin duplicar la
-- reedición digital como un segundo trabajo.

do $$
declare
  band_id uuid;
begin
  select id
    into band_id
  from public.entities
  where slug = 'las-cigarreras'
    and entity_type = 'band';

  if band_id is null then
    raise exception 'No existe la Banda de Las Cigarreras';
  end if;

  update public.band_releases
  set cover_image_path = replace(
        cover_image_path,
        'https://i.scdn.co/image/',
        'https://image-cdn-fa.spotifycdn.com/image/'
      ),
      updated_at = now()
  where band_entity_id = band_id
    and cover_image_path like 'https://i.scdn.co/image/%';

  update public.band_releases
  set cover_image_path = 'https://image-cdn-fa.spotifycdn.com/image/ab67616d0000b2738f364c2f1e31afc9e5cc32bd',
      cover_image_credit = 'Spotify · edición digital',
      spotify_url = 'https://open.spotify.com/album/3Tr1wvCe8yrP8rwlSfO8Q5',
      updated_at = now()
  where band_entity_id = band_id
    and title = 'Sentimiento'
    and release_year = 1992;

  update public.band_releases
  set cover_image_path = 'https://m.media-amazon.com/images/I/51WKtLaDSbL.jpg',
      cover_image_credit = 'Amazon Music',
      updated_at = now()
  where band_entity_id = band_id
    and title = 'Pasión y Música'
    and release_year = 1994;
end
$$;

with desired_tracks (sequence_no, spotify_track_id) as (
  values
    (1, '433Q71AQyel9pdg6g4wzVp'),
    (2, '4zoYzQxlTgrqkLqWTzLu1h'),
    (3, '7dJvOZtqT8JY31Wg9mx9Tt'),
    (4, '6Mj79B8C5pPyHRDwXoqxpV'),
    (5, '2YkXDrO8sALafPPsOBWxWP'),
    (6, '0qkSQLidjYrHCQwW5kqnCZ'),
    (7, '5dPmKWYUkQhzUwblJisI7X'),
    (8, '0tF8cR4QGbq88AomKbj1JA')
)
update public.band_release_tracks track
set spotify_url = 'https://open.spotify.com/track/' || desired.spotify_track_id
from desired_tracks desired,
     public.band_releases release,
     public.entities band
where track.release_id = release.id
  and release.band_entity_id = band.id
  and band.slug = 'las-cigarreras'
  and band.entity_type = 'band'
  and release.title = 'Sentimiento'
  and release.release_year = 1992
  and track.sequence_no = desired.sequence_no;

insert into public.sources (
  name,
  url,
  source_type,
  author_or_publisher,
  accessed_at,
  notes
)
select
  'Sentimiento · Spotify',
  'https://open.spotify.com/album/3Tr1wvCe8yrP8rwlSfO8Q5',
  'Plataforma musical',
  'Spotify',
  current_date,
  'Ficha de la edición digital, portada y enlaces de las ocho pistas.'
where not exists (
  select 1
  from public.sources
  where url = 'https://open.spotify.com/album/3Tr1wvCe8yrP8rwlSfO8Q5'
);

insert into public.sources (
  name,
  url,
  source_type,
  author_or_publisher,
  accessed_at,
  notes
)
select
  'Pasión y Música · Amazon Music',
  'https://music.amazon.es/albums/B0DTW3W55K',
  'Plataforma musical',
  'Amazon Music',
  current_date,
  'Portada y contraste del listado de nueve pistas.'
where not exists (
  select 1
  from public.sources
  where url = 'https://music.amazon.es/albums/B0DTW3W55K'
);

insert into public.band_release_sources (release_id, source_id, scope)
select
  release.id,
  source.id,
  'Edición digital, portada y enlaces de pistas'
from public.band_releases release
join public.entities band
  on band.id = release.band_entity_id
 and band.slug = 'las-cigarreras'
 and band.entity_type = 'band'
join public.sources source
  on source.url = 'https://open.spotify.com/album/3Tr1wvCe8yrP8rwlSfO8Q5'
where release.title = 'Sentimiento'
  and release.release_year = 1992
on conflict (release_id, source_id) do update
set scope = excluded.scope;

insert into public.band_release_sources (release_id, source_id, scope)
select
  release.id,
  source.id,
  'Portada y listado de pistas'
from public.band_releases release
join public.entities band
  on band.id = release.band_entity_id
 and band.slug = 'las-cigarreras'
 and band.entity_type = 'band'
join public.sources source
  on source.url = 'https://music.amazon.es/albums/B0DTW3W55K'
where release.title = 'Pasión y Música'
  and release.release_year = 1994
on conflict (release_id, source_id) do update
set scope = excluded.scope;

do $$
declare
  band_id uuid;
  incompatible_cover_count integer;
  sentimiento_spotify_track_count integer;
begin
  select id
    into band_id
  from public.entities
  where slug = 'las-cigarreras'
    and entity_type = 'band';

  select count(*)
    into incompatible_cover_count
  from public.band_releases
  where band_entity_id = band_id
    and status = 'published'
    and (
      cover_image_path like 'https://i.scdn.co/%'
      or cover_image_path like 'https://is1-ssl.mzstatic.com/%'
    );

  if incompatible_cover_count <> 0 then
    raise exception 'Quedaron % portadas en dominios no admitidos', incompatible_cover_count;
  end if;

  select count(*)
    into sentimiento_spotify_track_count
  from public.band_release_tracks track
  join public.band_releases release on release.id = track.release_id
  where release.band_entity_id = band_id
    and release.title = 'Sentimiento'
    and release.release_year = 1992
    and track.spotify_url is not null;

  if sentimiento_spotify_track_count <> 8 then
    raise exception 'Se esperaban 8 enlaces de pista en Sentimiento y se encontraron %', sentimiento_spotify_track_count;
  end if;
end
$$;
