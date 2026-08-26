create or replace view public.today_ephemeris_candidates
with (security_invoker = true)
as
select
  e.entity_id,
  en.name as title,
  e.event_type,
  e.event_date,
  e.event_date_text,
  e.description
from public.events e
join public.entities en on en.id = e.entity_id
where en.status = 'published'
  and e.event_date is not null
  and extract(month from e.event_date) = extract(month from ((now() at time zone 'Europe/Madrid')::date))
  and extract(day from e.event_date) = extract(day from ((now() at time zone 'Europe/Madrid')::date));

create or replace view public.daily_march_candidates
with (security_invoker = true)
as
with eligible as (
  select
    entity.id as entity_id,
    entity.name,
    march.composition_year,
    march.composition_date_text,
    march.youtube_video_id,
    coalesce(march.daily_priority::integer, 0)::smallint as editorial_priority,
    row_number() over (order by entity.id) as rotation_position,
    count(*) over () as rotation_count
  from public.marches march
  join public.entities entity on entity.id = march.entity_id
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
      or exists (
        select 1
        from public.band_release_tracks track
        join public.band_releases release on release.id = track.release_id
        where track.march_entity_id = march.entity_id
          and release.status = 'published'
          and nullif(trim(track.spotify_url), '') is not null
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
        (((now() at time zone 'Europe/Madrid')::date - date '1970-01-01')::bigint),
        rotation_count
      )
      then 32767::smallint
    else least(editorial_priority::integer, 32766)::smallint
  end as daily_priority
from eligible;
