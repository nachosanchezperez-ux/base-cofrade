-- Vincula pistas ya existentes con las marchas de San Benito solo cuando
-- título y tipo de formación dejan una única Marcha candidata para la pista.
-- No se sobrescribe ninguna pista vinculada previamente a otra Marcha.

with sb as (
  select distinct d.march_entity_id,e.name,m.music_type
  from public.march_dedications d
  join public.entities h on h.id=d.dedicatee_entity_id and h.slug='san-benito'
  join public.entities e on e.id=d.march_entity_id
  join public.marches m on m.entity_id=e.id
  where d.status='published'
), candidates as (
  select t.id as track_id,t.march_entity_id as current_march_entity_id,sb.march_entity_id
  from public.band_release_tracks t
  join public.band_releases r on r.id=t.release_id and r.status='published'
  join public.bands b on b.entity_id=r.band_entity_id
  join sb on lower(trim(t.title))=lower(trim(sb.name)) and b.band_type=sb.music_type
), track_counts as (
  select track_id,count(distinct march_entity_id) as march_candidates
  from candidates
  group by track_id
), safe as (
  select c.track_id,c.march_entity_id
  from candidates c
  join track_counts tc using(track_id)
  where tc.march_candidates=1
    and (c.current_march_entity_id is null or c.current_march_entity_id=c.march_entity_id)
)
update public.band_release_tracks t
set march_entity_id=s.march_entity_id
from safe s
where t.id=s.track_id and t.march_entity_id is null;
