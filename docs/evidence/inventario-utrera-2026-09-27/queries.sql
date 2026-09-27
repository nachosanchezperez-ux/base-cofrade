-- SELECT-only identification and reconciliation. Text scans are discovery, never an Apply predicate.

select e.id,e.name,e.slug,e.entity_type,e.status from public.entities e where lower(e.name) like '%utrera%' or lower(e.slug) like '%utrera%' order by e.entity_type,e.name;

select jsonb_build_object(
'brotherhoods',(select jsonb_agg(jsonb_build_object('entity',to_jsonb(e),'profile',to_jsonb(b))) from public.entities e join public.brotherhoods b on b.entity_id=e.id where b.municipality_id='e4319248-831a-4f4c-adb8-19c496f95dd6'),
'images',(select jsonb_agg(jsonb_build_object('relation',to_jsonb(r),'entity',to_jsonb(e),'profile',to_jsonb(i))) from public.brotherhood_images r join public.entities e on e.id=r.image_entity_id left join public.images i on i.entity_id=e.id where r.brotherhood_entity_id in (select entity_id from public.brotherhoods where municipality_id='e4319248-831a-4f4c-adb8-19c496f95dd6')),
'steps',(select jsonb_agg(jsonb_build_object('relation',to_jsonb(r),'entity',to_jsonb(e),'profile',to_jsonb(s))) from public.brotherhood_steps r join public.entities e on e.id=r.step_entity_id left join public.steps s on s.entity_id=e.id where r.brotherhood_entity_id in (select entity_id from public.brotherhoods where municipality_id='e4319248-831a-4f4c-adb8-19c496f95dd6')),
'outings',(select jsonb_agg(to_jsonb(o)) from public.outings o where o.municipality_id='e4319248-831a-4f4c-adb8-19c496f95dd6'),
'bands',(select jsonb_agg(jsonb_build_object('id',e.id,'name',e.name,'slug',e.slug,'status',e.status,'profile',to_jsonb(b))) from public.entities e join public.bands b on b.entity_id=e.id where b.municipality_id='e4319248-831a-4f4c-adb8-19c496f95dd6'),
'music',(select jsonb_agg(to_jsonb(p)) from public.music_accompaniment_periods p where p.brotherhood_entity_id in (select entity_id from public.brotherhoods where municipality_id='e4319248-831a-4f4c-adb8-19c496f95dd6')),
'migrations',(select count(*) from supabase_migrations.schema_migrations)
) snapshot;

select e.id,e.name,e.slug,e.status,e.entity_type,case when e.entity_type='brotherhood' then b.municipality_id else ba.municipality_id end municipality_id from public.entities e left join public.brotherhoods b on b.entity_id=e.id left join public.bands ba on ba.entity_id=e.id where e.entity_type in ('brotherhood','band') order by e.entity_type,e.name;

select * from public.places where municipality_id='e4319248-831a-4f4c-adb8-19c496f95dd6';

select jsonb_build_object(
'locations',(select jsonb_agg(to_jsonb(l)) from public.entity_locations l where l.municipality_id='e4319248-831a-4f4c-adb8-19c496f95dd6' or l.entity_id in ('4e462b02-979d-4b88-ab98-0c97f2dbf0a0','7bab2fe6-c69e-48e5-9446-a247b4169910','8d4e62d9-a428-4363-afc7-6a2f9e8c1450')),
'band_profiles',(select jsonb_agg(jsonb_build_object('entity',to_jsonb(e),'profile',to_jsonb(b))) from public.entities e join public.bands b on b.entity_id=e.id where e.id in ('e4884d0e-204e-408c-955e-b4c639de92c9','f492d28d-af48-4606-862c-89d5d3560a6b','7fafdc04-cb94-47d8-814f-5537639660ff')),
'sources',(select jsonb_agg(jsonb_build_object('link',to_jsonb(l),'source',to_jsonb(s))) from public.source_links l join public.sources s on s.id=l.source_id where l.entity_id in ('4e462b02-979d-4b88-ab98-0c97f2dbf0a0','7bab2fe6-c69e-48e5-9446-a247b4169910','8d4e62d9-a428-4363-afc7-6a2f9e8c1450'))
) evidence;
