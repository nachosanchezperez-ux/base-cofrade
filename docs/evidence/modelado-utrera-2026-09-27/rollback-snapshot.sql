-- SELECT only. Save complete results immediately before and after the dry-run.
SELECT jsonb_build_object(
  'agents', (SELECT jsonb_build_object('count',count(*),'md5',md5(coalesce(jsonb_agg(to_jsonb(t) ORDER BY entity_id)::text,'[]'))) FROM public.agents t),
  'bands', (SELECT jsonb_build_object('count',count(*),'md5',md5(coalesce(jsonb_agg(to_jsonb(t) ORDER BY entity_id)::text,'[]'))) FROM public.bands t),
  'brotherhood_images', (SELECT jsonb_build_object('count',count(*),'md5',md5(coalesce(jsonb_agg(to_jsonb(t) ORDER BY id)::text,'[]'))) FROM public.brotherhood_images t),
  'brotherhood_steps', (SELECT jsonb_build_object('count',count(*),'md5',md5(coalesce(jsonb_agg(to_jsonb(t) ORDER BY id)::text,'[]'))) FROM public.brotherhood_steps t),
  'brotherhoods', (SELECT jsonb_build_object('count',count(*),'md5',md5(coalesce(jsonb_agg(to_jsonb(t) ORDER BY entity_id)::text,'[]'))) FROM public.brotherhoods t),
  'entities', (SELECT jsonb_build_object('count',count(*),'md5',md5(coalesce(jsonb_agg(to_jsonb(t) ORDER BY id)::text,'[]'))) FROM public.entities t),
  'entity_locations', (SELECT jsonb_build_object('count',count(*),'md5',md5(coalesce(jsonb_agg(to_jsonb(t) ORDER BY id)::text,'[]'))) FROM public.entity_locations t),
  'heritage_assets', (SELECT jsonb_build_object('count',count(*),'md5',md5(coalesce(jsonb_agg(to_jsonb(t) ORDER BY entity_id)::text,'[]'))) FROM public.heritage_assets t),
  'image_authorships', (SELECT jsonb_build_object('count',count(*),'md5',md5(coalesce(jsonb_agg(to_jsonb(t) ORDER BY id)::text,'[]'))) FROM public.image_authorships t),
  'image_steps', (SELECT jsonb_build_object('count',count(*),'md5',md5(coalesce(jsonb_agg(to_jsonb(t) ORDER BY id)::text,'[]'))) FROM public.image_steps t),
  'images', (SELECT jsonb_build_object('count',count(*),'md5',md5(coalesce(jsonb_agg(to_jsonb(t) ORDER BY entity_id)::text,'[]'))) FROM public.images t),
  'outing_entities', (SELECT jsonb_build_object('count',count(*),'md5',md5(coalesce(jsonb_agg(to_jsonb(t) ORDER BY id)::text,'[]'))) FROM public.outing_entities t),
  'outing_music_assignments', (SELECT jsonb_build_object('count',count(*),'md5',md5(coalesce(jsonb_agg(to_jsonb(t) ORDER BY id)::text,'[]'))) FROM public.outing_music_assignments t),
  'outing_music_positions', (SELECT jsonb_build_object('count',count(*),'md5',md5(coalesce(jsonb_agg(to_jsonb(t) ORDER BY id)::text,'[]'))) FROM public.outing_music_positions t),
  'outings', (SELECT jsonb_build_object('count',count(*),'md5',md5(coalesce(jsonb_agg(to_jsonb(t) ORDER BY id)::text,'[]'))) FROM public.outings t),
  'places', (SELECT jsonb_build_object('count',count(*),'md5',md5(coalesce(jsonb_agg(to_jsonb(t) ORDER BY id)::text,'[]'))) FROM public.places t),
  'source_links', (SELECT jsonb_build_object('count',count(*),'md5',md5(coalesce(jsonb_agg(to_jsonb(t) ORDER BY id)::text,'[]'))) FROM public.source_links t),
  'sources', (SELECT jsonb_build_object('count',count(*),'md5',md5(coalesce(jsonb_agg(to_jsonb(t) ORDER BY id)::text,'[]'))) FROM public.sources t),
  'steps', (SELECT jsonb_build_object('count',count(*),'md5',md5(coalesce(jsonb_agg(to_jsonb(t) ORDER BY entity_id)::text,'[]'))) FROM public.steps t)
) AS rollback_snapshot;
