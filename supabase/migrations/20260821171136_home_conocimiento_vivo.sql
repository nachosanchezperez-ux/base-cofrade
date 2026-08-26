-- Hilo Cofrade · Home 1.1 · Conocimiento vivo
-- Centraliza la actividad relacional relevante para que la portada refleje
-- incorporaciones reales del grafo sin convertirla en un changelog técnico.

create or replace view public.home_knowledge_threads
with (security_invoker = true) as
with published_entities as (
  select id, entity_type, name, slug, created_at, updated_at
  from public.entities
  where status = 'published'
),
titular_pairs as (
  select
    bi.brotherhood_entity_id as root_entity_id,
    bi.image_entity_id as related_entity_id,
    bi.created_at as activity_at
  from public.brotherhood_images bi
  join published_entities b
    on b.id = bi.brotherhood_entity_id
   and b.entity_type = 'brotherhood'
  join published_entities i
    on i.id = bi.image_entity_id
   and i.entity_type = 'image'
  where bi.status = 'published'
    and bi.relation_type = 'titular'

  union

  select
    er.source_entity_id,
    er.target_entity_id,
    er.created_at
  from public.entity_relations er
  join published_entities b
    on b.id = er.source_entity_id
   and b.entity_type = 'brotherhood'
  join published_entities t
    on t.id = er.target_entity_id
  where er.status = 'published'
    and er.relation_type = 'has_titular'
),
musical_parts as (
  select
    md.dedicatee_entity_id as root_entity_id,
    count(distinct md.march_entity_id)::int as relation_count,
    0::int as secondary_count,
    max(md.created_at) as latest_at
  from public.march_dedications md
  join published_entities b
    on b.id = md.dedicatee_entity_id
   and b.entity_type = 'brotherhood'
  join published_entities m
    on m.id = md.march_entity_id
   and m.entity_type = 'march'
  where md.status = 'published'
  group by md.dedicatee_entity_id

  union all

  select
    ha.parent_entity_id,
    0::int,
    count(distinct ha.entity_id)::int,
    max(greatest(a.created_at, a.updated_at))
  from public.heritage_assets ha
  join published_entities a
    on a.id = ha.entity_id
   and a.entity_type = 'heritage_asset'
  join published_entities p
    on p.id = ha.parent_entity_id
   and p.entity_type = 'brotherhood'
  where lower(coalesce(ha.asset_type, '')) like any (
    array['%música%', '%musica%', '%copla%', '%himno%', '%motete%', '%plegaria%', '%canto%']
  )
  group by ha.parent_entity_id
),
musical_threads as (
  select
    root_entity_id,
    'musical_heritage'::text as activity_kind,
    sum(relation_count)::int as relation_count,
    sum(secondary_count)::int as secondary_count,
    max(latest_at) as latest_at,
    100::int as priority
  from musical_parts
  group by root_entity_id
),
poster_threads as (
  select
    ha.parent_entity_id as root_entity_id,
    'posters'::text as activity_kind,
    count(distinct ha.entity_id)::int as relation_count,
    0::int as secondary_count,
    max(greatest(a.created_at, a.updated_at)) as latest_at,
    95::int as priority
  from public.heritage_assets ha
  join published_entities a
    on a.id = ha.entity_id
   and a.entity_type = 'heritage_asset'
  join published_entities p
    on p.id = ha.parent_entity_id
   and p.entity_type = 'brotherhood'
  where lower(coalesce(ha.asset_type, '')) like '%cartel%'
  group by ha.parent_entity_id
),
titular_threads as (
  select
    root_entity_id,
    'titularity'::text as activity_kind,
    count(distinct related_entity_id)::int as relation_count,
    0::int as secondary_count,
    max(activity_at) as latest_at,
    90::int as priority
  from titular_pairs
  group by root_entity_id
),
brotherhood_step_threads as (
  select
    bs.brotherhood_entity_id as root_entity_id,
    'brotherhood_steps'::text as activity_kind,
    count(distinct bs.step_entity_id)::int as relation_count,
    0::int as secondary_count,
    max(bs.created_at) as latest_at,
    88::int as priority
  from public.brotherhood_steps bs
  join published_entities b
    on b.id = bs.brotherhood_entity_id
   and b.entity_type = 'brotherhood'
  join published_entities s
    on s.id = bs.step_entity_id
   and s.entity_type = 'step'
  where bs.status = 'published'
  group by bs.brotherhood_entity_id
),
step_personnel_threads as (
  select
    bs.brotherhood_entity_id as root_entity_id,
    'step_personnel'::text as activity_kind,
    count(distinct spp.step_entity_id)::int as relation_count,
    count(distinct spp.agent_entity_id)::int as secondary_count,
    max(greatest(spp.created_at, spp.updated_at)) as latest_at,
    92::int as priority
  from public.step_personnel_periods spp
  join public.brotherhood_steps bs
    on bs.step_entity_id = spp.step_entity_id
   and bs.status = 'published'
   and bs.date_to is null
   and bs.date_to_text is null
  join published_entities b
    on b.id = bs.brotherhood_entity_id
   and b.entity_type = 'brotherhood'
  join published_entities s
    on s.id = spp.step_entity_id
   and s.entity_type = 'step'
  join published_entities a
    on a.id = spp.agent_entity_id
   and a.entity_type = 'agent'
  where spp.status = 'published'
    and spp.is_current = true
    and lower(spp.role_name) = 'capataz'
  group by bs.brotherhood_entity_id
),
band_relation_threads as (
  select
    er.source_entity_id as root_entity_id,
    'band_brotherhoods'::text as activity_kind,
    count(distinct er.target_entity_id)::int as relation_count,
    0::int as secondary_count,
    max(er.created_at) as latest_at,
    91::int as priority
  from public.entity_relations er
  join published_entities b
    on b.id = er.source_entity_id
   and b.entity_type = 'band'
  join published_entities h
    on h.id = er.target_entity_id
   and h.entity_type = 'brotherhood'
  where er.status = 'published'
    and er.relation_type in ('associated_with_brotherhood', 'belongs_to_brotherhood')
  group by er.source_entity_id
),
release_counts as (
  select
    br.band_entity_id as root_entity_id,
    count(distinct br.id)::int as relation_count,
    max(greatest(br.created_at, br.updated_at)) as latest_at
  from public.band_releases br
  join published_entities b
    on b.id = br.band_entity_id
   and b.entity_type = 'band'
  where br.status = 'published'
  group by br.band_entity_id
),
track_counts as (
  select
    br.band_entity_id as root_entity_id,
    count(distinct t.id)::int as secondary_count,
    max(t.created_at) as latest_at
  from public.band_release_tracks t
  join public.band_releases br
    on br.id = t.release_id
   and br.status = 'published'
  join published_entities b
    on b.id = br.band_entity_id
   and b.entity_type = 'band'
  group by br.band_entity_id
),
discography_threads as (
  select
    r.root_entity_id,
    'discography'::text as activity_kind,
    r.relation_count,
    coalesce(t.secondary_count, 0)::int as secondary_count,
    greatest(r.latest_at, coalesce(t.latest_at, r.latest_at)) as latest_at,
    80::int as priority
  from release_counts r
  left join track_counts t using (root_entity_id)
),
image_authorship_threads as (
  select
    ia.image_entity_id as root_entity_id,
    'image_authorship'::text as activity_kind,
    count(distinct ia.agent_entity_id)::int as relation_count,
    0::int as secondary_count,
    max(ia.created_at) as latest_at,
    86::int as priority
  from public.image_authorships ia
  join published_entities i
    on i.id = ia.image_entity_id
   and i.entity_type = 'image'
  join published_entities a
    on a.id = ia.agent_entity_id
   and a.entity_type = 'agent'
  where ia.status = 'published'
  group by ia.image_entity_id
),
step_phase_threads as (
  select
    sp.step_entity_id as root_entity_id,
    'step_phases'::text as activity_kind,
    count(distinct sp.id)::int as relation_count,
    0::int as secondary_count,
    max(greatest(sp.created_at, sp.updated_at)) as latest_at,
    84::int as priority
  from public.step_phases sp
  join published_entities s
    on s.id = sp.step_entity_id
   and s.entity_type = 'step'
  where sp.status = 'published'
  group by sp.step_entity_id
),
heritage_intervention_threads as (
  select
    coalesce(parent.id, target.id) as root_entity_id,
    'heritage_interventions'::text as activity_kind,
    count(distinct hi.id)::int as relation_count,
    count(distinct hi.agent_entity_id)::int as secondary_count,
    max(greatest(hi.created_at, hi.updated_at)) as latest_at,
    78::int as priority
  from public.heritage_interventions hi
  join published_entities target
    on target.id = hi.target_entity_id
  left join public.heritage_assets ha
    on ha.entity_id = target.id
  left join published_entities parent
    on parent.id = ha.parent_entity_id
   and parent.entity_type in ('brotherhood', 'image', 'step')
   and parent.slug is not null
  where hi.status = 'published'
    and (
      target.entity_type in ('brotherhood', 'image', 'step')
      or parent.id is not null
    )
  group by coalesce(parent.id, target.id)
),
heritage_update_threads as (
  select
    hu.target_entity_id as root_entity_id,
    'heritage_updates'::text as activity_kind,
    count(distinct hu.id)::int as relation_count,
    0::int as secondary_count,
    max(greatest(hu.created_at, hu.updated_at)) as latest_at,
    76::int as priority
  from public.heritage_updates hu
  join published_entities t
    on t.id = hu.target_entity_id
   and t.entity_type in ('brotherhood', 'image', 'step')
   and t.slug is not null
  where hu.status = 'published'
  group by hu.target_entity_id
),
entity_threads as (
  select
    e.id as root_entity_id,
    'entity_new'::text as activity_kind,
    1::int as relation_count,
    0::int as secondary_count,
    e.created_at as latest_at,
    30::int as priority
  from published_entities e
  where e.entity_type in ('brotherhood', 'image', 'step', 'band')
    and e.slug is not null
),
raw_threads as (
  select * from musical_threads
  union all select * from poster_threads
  union all select * from titular_threads
  union all select * from brotherhood_step_threads
  union all select * from step_personnel_threads
  union all select * from band_relation_threads
  union all select * from discography_threads
  union all select * from image_authorship_threads
  union all select * from step_phase_threads
  union all select * from heritage_intervention_threads
  union all select * from heritage_update_threads
  union all select * from entity_threads
)
select
  rt.root_entity_id::text || ':' || rt.activity_kind as thread_key,
  rt.root_entity_id,
  e.entity_type as root_type,
  coalesce(nullif(trim(b.popular_name), ''), e.name) as root_name,
  e.slug as root_slug,
  e.created_at as root_created_at,
  rt.activity_kind,
  rt.relation_count,
  rt.secondary_count,
  rt.latest_at,
  rt.priority
from raw_threads rt
join published_entities e
  on e.id = rt.root_entity_id
 and e.slug is not null
left join public.brotherhoods b
  on b.entity_id = e.id
 and e.entity_type = 'brotherhood'
where rt.latest_at is not null;

grant select on public.home_knowledge_threads to anon, authenticated, service_role;

comment on view public.home_knowledge_threads is
  'Actividad de conocimiento publicada y agrupada para Últimos hilos de la Home. Prioriza relaciones y enriquecimientos reales frente a cambios técnicos.';
