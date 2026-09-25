-- QA POST-APPLY · HC-016 · CARMONA
-- SOLO LECTURA. EJECUTAR ÚNICAMENTE DESPUÉS DE UN APPLY AUTORIZADO Y COMMIT CORRECTO.

with counts as (
  select
    (select count(*)::int from public.entities where id::text like 'c0160035-%') entities,
    (select count(*)::int from public.brotherhoods where entity_id::text like 'c0160035-%') brotherhoods,
    (select count(*)::int from public.bands where entity_id::text like 'c0160035-%') bands,
    (select count(*)::int from public.images where entity_id::text like 'c0160035-%') images,
    (select count(*)::int from public.brotherhood_images where id::text like 'c0160035-%') brotherhood_images,
    (select count(*)::int from public.entity_locations where id::text like 'c0160035-%') entity_locations,
    (select count(*)::int from public.steps where entity_id::text like 'c0160035-%') steps,
    (select count(*)::int from public.brotherhood_steps where id::text like 'c0160035-%') brotherhood_steps,
    (select count(*)::int from public.image_steps where id::text like 'c0160035-%') image_steps,
    (select count(*)::int from public.outing_series where id::text like 'c0160035-%') outing_series,
    (select count(*)::int from public.outings where id::text like 'c0160035-%') new_outings,
    (select count(*)::int from public.outing_entities where id::text like 'c0160035-%') outing_entities,
    (select count(*)::int from public.outing_music_positions where id::text like 'c0160035-%') music_positions,
    (select count(*)::int from public.outing_music_assignments where id::text like 'c0160035-%') music_assignments,
    (select count(*)::int from public.music_accompaniment_periods where id::text like 'c0160035-%') music_periods,
    (select count(*)::int from public.source_links where id::text like 'c0160035-%') source_links
),
semantic as (
  select
    exists(
      select 1 from public.outings
      where id='ea6ab0d1-e6c4-4ea1-8727-92cee4ce3218'
        and slug='carmona-servitas-dolores-santo-escapulario-2026-09-19'
        and brotherhood_entity_id='c0160035-0301-4000-8000-000000000001'
        and event_status='held'
    ) servitas_sep_held,
    exists(
      select 1 from public.sources
      where id='f5c7c0c1-63c8-42b3-b1e8-fac89b01de83'
        and url is not null
    ) servitas_source_repaired,
    not exists(
      select 1 from public.outing_entities
      where outing_id='ea6ab0d1-e6c4-4ea1-8727-92cee4ce3218'
        and role='processional_step'
    ) servitas_sep_step_null,
    not exists(
      select 1 from public.outing_music_assignments
      where music_position_id='c0160035-1015-4000-8000-000000000015'
    ) desamparados_silence_no_assignment,
    not exists(
      select 1 from public.entities e
      join public.brotherhoods b on b.entity_id=e.id
      where e.id::text like 'c0160035-%'
        and (lower(e.name) like '%desamparados%' or lower(e.name) like '%borriquita%')
    ) no_duplicate_corporations,
    not exists(
      select 1 from public.outing_music_assignments
      where id::text like 'c0160035-%'
        and band_entity_id='c0160035-0406-4000-8000-000000000006'
    ) maferman_not_inferred
)
select jsonb_build_object(
  'counts', to_jsonb(counts),
  'semantic', to_jsonb(semantic),
  'counts_ok',
    entities=75 and brotherhoods=9 and bands=6 and images=42 and brotherhood_images=29
    and entity_locations=9 and steps=18 and brotherhood_steps=18 and image_steps=31
    and outing_series=11 and new_outings=11 and outing_entities=50
    and music_positions=18 and music_assignments=17 and music_periods=14 and source_links=129,
  'semantic_ok',
    servitas_sep_held and servitas_source_repaired and servitas_sep_step_null
    and desamparados_silence_no_assignment and no_duplicate_corporations and maferman_not_inferred
) as qa
from counts cross join semantic;
