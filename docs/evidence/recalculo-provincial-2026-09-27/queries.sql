-- Read-only queries used for the selection snapshot.
with b as (
select b.entity_id,b.municipality_id,e.status,b.brotherhood_types,
(select count(*) from public.brotherhood_images x where x.brotherhood_entity_id=b.entity_id) images,
(select count(*) from public.brotherhood_steps x where x.brotherhood_entity_id=b.entity_id) steps,
(select count(*) from public.outings x where x.brotherhood_entity_id=b.entity_id and x.year=2026) outings_2026,
(select count(*) from public.outings x where x.brotherhood_entity_id=b.entity_id and x.outing_date between '2026-03-27' and '2026-04-05') holy_week_2026,
(select count(*) from public.music_accompaniment_periods x where x.brotherhood_entity_id=b.entity_id and x.status='published') music,
(select count(*) from public.source_links x where x.entity_id=b.entity_id) sources
from public.brotherhoods b join public.entities e on e.id=b.entity_id)
select m.id,m.name,m.slug,count(b.entity_id) brotherhoods,
count(*) filter(where b.status='published') published,
count(*) filter(where b.status is not null and b.status<>'published') unpublished,
count(*) filter(where b.entity_id is not null and cardinality(b.brotherhood_types)=0) empty_types,
coalesce(sum(images),0) images,coalesce(sum(steps),0) steps,
coalesce(sum(outings_2026),0) outings_2026,coalesce(sum(holy_week_2026),0) holy_week_2026,
coalesce(sum(music),0) music,coalesce(sum(sources),0) direct_sources,
(select count(*) from public.bands x where x.municipality_id=m.id) local_bands
from public.municipalities m left join b on b.municipality_id=m.id
where m.province='Sevilla' group by m.id,m.name,m.slug order by m.name;

select e.id,e.name,e.slug,e.status,b.municipality_id,m.name municipality,b.brotherhood_types,b.website_url,
(select count(*) from public.brotherhood_images x where x.brotherhood_entity_id=e.id) images,
(select count(*) from public.brotherhood_steps x where x.brotherhood_entity_id=e.id) steps,
(select count(*) from public.outings x where x.brotherhood_entity_id=e.id and x.year=2026) outings_2026,
(select count(*) from public.music_accompaniment_periods x where x.brotherhood_entity_id=e.id and x.status='published') music,
(select count(*) from public.source_links x where x.entity_id=e.id) direct_sources
from public.entities e left join public.brotherhoods b on b.entity_id=e.id left join public.municipalities m on m.id=b.municipality_id
where e.entity_type='brotherhood' and (b.municipality_id is null or m.slug in ('utrera','marchena','mairena-del-alcor','sanlucar-la-mayor','arahal','fuentes-de-andalucia','guadalcanal','lora-del-rio')) order by m.name nulls last,e.name;
