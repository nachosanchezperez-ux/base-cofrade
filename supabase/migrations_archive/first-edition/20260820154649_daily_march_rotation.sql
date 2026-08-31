-- Hilo Cofrade · Rotación diaria de la Marcha del día
--
-- La selección automática rota por fecha de Europe/Madrid entre marchas
-- publicadas que tengan compositor documentado y una escucha disponible.
-- daily_overrides sigue teniendo prioridad desde la aplicación.

update public.band_release_tracks track
set march_entity_id = march.id
from public.band_releases release
join public.entities band
  on band.id = release.band_entity_id
join public.entities march
  on march.entity_type = 'march'
 and march.name = 'Refúgiame'
where track.release_id = release.id
  and band.slug = 'sangre-de-san-benito'
  and release.title = 'Directos de la Calzá'
  and track.title = 'Refúgiame'
  and track.spotify_url is not null
  and (track.march_entity_id is null or track.march_entity_id = march.id);

insert into public.march_recordings (
  march_entity_id,
  band_entity_id,
  external_url,
  title,
  notes,
  is_featured,
  status
)
select
  march.id,
  band.id,
  track.spotify_url,
  concat(track.title, ' · ', band.name, ' · ', release.title),
  'Grabación enlazada desde la discografía publicada de la Banda. Spotify se usa como plataforma de escucha, no como fuente documental.',
  true,
  'published'
from public.band_release_tracks track
join public.band_releases release
  on release.id = track.release_id
 and release.status = 'published'
join public.entities band
  on band.id = release.band_entity_id
 and band.status = 'published'
join public.entities march
  on march.id = track.march_entity_id
 and march.entity_type = 'march'
 and march.status = 'published'
where track.spotify_url is not null
  and (
    (march.name = 'El Nazareno' and band.slug = 'agrupacion-musical-nuestra-senora-de-la-encarnacion')
    or
    (march.name = 'Refúgiame' and band.slug = 'sangre-de-san-benito')
  )
  and not exists (
    select 1
    from public.march_recordings existing
    where existing.march_entity_id = march.id
      and existing.external_url = track.spotify_url
      and existing.status <> 'archived'
  );

create or replace view public.daily_march_candidates as
with eligible as (
  select
    entity.id as entity_id,
    entity.name,
    march.composition_year,
    march.composition_date_text,
    march.youtube_video_id,
    coalesce(march.daily_priority, 0)::smallint as editorial_priority,
    row_number() over (order by entity.id) as rotation_position,
    count(*) over () as rotation_count
  from public.marches march
  join public.entities entity
    on entity.id = march.entity_id
  where entity.status = 'published'
    and march.eligible_for_daily = true
    and exists (
      select 1
      from public.march_authors author
      join public.entities composer
        on composer.id = author.agent_entity_id
       and composer.status = 'published'
      where author.march_entity_id = march.entity_id
        and author.author_role = 'composer'
    )
    and (
      nullif(trim(march.youtube_video_id), '') is not null
      or exists (
        select 1
        from public.march_recordings recording
        where recording.march_entity_id = march.entity_id
          and recording.status = 'published'
          and (
            nullif(trim(recording.youtube_video_id), '') is not null
            or nullif(trim(recording.external_url), '') is not null
          )
      )
    )
)
select
  entity_id,
  name,
  composition_year,
  composition_date_text,
  youtube_video_id,
  case
    when rotation_count > 0
      and rotation_position = 1 + mod(
        (((now() at time zone 'Europe/Madrid')::date - date '1970-01-01'))::bigint,
        rotation_count
      )
      then 32767::smallint
    else least(editorial_priority::integer, 32766)::smallint
  end as daily_priority
from eligible;
