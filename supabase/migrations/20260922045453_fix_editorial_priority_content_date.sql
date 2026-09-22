create or replace view public.entity_editorial_priority
with (security_invoker = true)
as
with tracked as (
  select id, entity_type, name, slug, status, updated_at, content_updated_at, editorial_reviewed_at
  from public.entities
  where status = 'published'
    and entity_type in ('brotherhood','band','image','step','march')
),
edges as (
  select source_entity_id as entity_id from public.entity_relations where status <> 'archived'
  union all select target_entity_id from public.entity_relations where status <> 'archived'
  union all select brotherhood_entity_id from public.brotherhood_images where status <> 'archived'
  union all select image_entity_id from public.brotherhood_images where status <> 'archived'
  union all select brotherhood_entity_id from public.brotherhood_steps where status <> 'archived'
  union all select step_entity_id from public.brotherhood_steps where status <> 'archived'
  union all select image_entity_id from public.image_steps where status <> 'archived'
  union all select step_entity_id from public.image_steps where status <> 'archived'
  union all select brotherhood_entity_id from public.music_accompaniment_periods where status <> 'archived'
  union all select band_entity_id from public.music_accompaniment_periods where status <> 'archived'
  union all select step_entity_id from public.music_accompaniment_periods where status <> 'archived' and step_entity_id is not null
  union all select march_entity_id from public.march_dedications where status <> 'archived'
  union all select dedicatee_entity_id from public.march_dedications where status <> 'archived' and dedicatee_entity_id is not null
  union all select march_entity_id from public.march_authors where status <> 'archived'
  union all select band_entity_id from public.band_releases where status <> 'archived'
  union all select march_entity_id from public.band_release_tracks where march_entity_id is not null
),
edge_counts as (
  select entity_id, count(*)::int as relation_count
  from edges
  where entity_id is not null
  group by entity_id
),
source_counts as (
  select entity_id, count(*)::int as source_count
  from public.source_links
  where entity_id is not null
  group by entity_id
),
future_entities as (
  select o.brotherhood_entity_id as entity_id, o.outing_date as activity_date
  from public.outings o
  where o.status = 'published'
    and o.event_status = 'announced'
    and o.outing_date between current_date and current_date + 90
    and o.brotherhood_entity_id is not null
  union all
  select oe.entity_id, o.outing_date
  from public.outings o
  join public.outing_entities oe on oe.outing_id = o.id
  where o.status = 'published'
    and o.event_status = 'announced'
    and o.outing_date between current_date and current_date + 90
  union all
  select e.entity_id, e.event_date
  from public.events e
  where e.event_status = 'announced'
    and e.event_date between current_date and current_date + 90
    and e.entity_id is not null
  union all
  select e.brotherhood_entity_id, e.event_date
  from public.events e
  where e.event_status = 'announced'
    and e.event_date between current_date and current_date + 90
    and e.brotherhood_entity_id is not null
  union all
  select c.brotherhood_entity_id, c.cult_date
  from public.cults c
  where c.status = 'published'
    and c.cult_date between current_date and current_date + 90
    and c.brotherhood_entity_id is not null
  union all
  select c.image_entity_id, c.cult_date
  from public.cults c
  where c.status = 'published'
    and c.cult_date between current_date and current_date + 90
    and c.image_entity_id is not null
  union all
  select ce.entity_id, c.cult_date
  from public.cults c
  join public.cult_entities ce on ce.cult_id = c.id
  where c.status = 'published'
    and c.cult_date between current_date and current_date + 90
),
future_summary as (
  select entity_id, min(activity_date) as next_activity_date, count(*)::int as future_activity_count
  from future_entities
  where entity_id is not null
  group by entity_id
),
signals as (
  select
    t.*,
    coalesce(ec.relation_count, 0) as relation_count,
    coalesce(sc.source_count, 0) as source_count,
    fs.next_activity_date,
    coalesce(fs.future_activity_count, 0) as future_activity_count,
    greatest(0, floor(extract(epoch from (now() - coalesce(t.content_updated_at, t.updated_at))) / 86400))::int as update_age_days,
    case
      when t.editorial_reviewed_at is null then null
      else greatest(0, floor(extract(epoch from (now() - t.editorial_reviewed_at)) / 86400))::int
    end as review_age_days
  from tracked t
  left join edge_counts ec on ec.entity_id = t.id
  left join source_counts sc on sc.entity_id = t.id
  left join future_summary fs on fs.entity_id = t.id
),
scored as (
  select
    s.*,
    (
      case
        when s.editorial_reviewed_at is null then 25
        when s.editorial_reviewed_at < now() - interval '180 days' then 50
        when s.editorial_reviewed_at < now() - interval '90 days' then 35
        else 0
      end
      + case
        when s.next_activity_date between current_date and current_date + 30 then 40
        when s.next_activity_date between current_date + 31 and current_date + 90 then 25
        else 0
      end
      + case
        when coalesce(s.content_updated_at, s.updated_at) >= now() - interval '14 days' then 20
        when coalesce(s.content_updated_at, s.updated_at) >= now() - interval '45 days' then 12
        when coalesce(s.content_updated_at, s.updated_at) >= now() - interval '120 days' then 5
        else 0
      end
      + case
        when s.relation_count >= 20 then 25
        when s.relation_count >= 10 then 18
        when s.relation_count >= 5 then 12
        when s.relation_count >= 2 then 6
        else 0
      end
      + case
        when s.source_count >= 10 then 15
        when s.source_count >= 5 then 10
        when s.source_count >= 2 then 5
        else 0
      end
    )::int as priority_score
  from signals s
)
select
  scored.*,
  case
    when priority_score >= 90 then 'urgent'
    when priority_score >= 70 then 'high'
    when priority_score >= 55 then 'medium'
    else 'normal'
  end as priority_level
from scored;

revoke all on public.entity_editorial_priority from public, anon;
grant select on public.entity_editorial_priority to authenticated, service_role;
