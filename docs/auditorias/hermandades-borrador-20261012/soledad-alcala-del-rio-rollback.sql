-- Reversión de soledad-alcala-del-rio.sql. Valores anteriores consultados el 13/10/2026.
begin;
update public.music_accompaniment_periods set step_entity_id = null, public_step_name = 'Nuestra Señora de los Dolores en su Soledad Coronada'
where id = 'efb12f82-0263-4c00-a368-c5bb05e76583';
delete from public.source_links where source_id in ('7a5c0e05-2026-4012-8000-00000000ca32', '7a5c0e05-2026-4012-8000-00000000ca33');
delete from public.image_steps where id in ('7a5c0e05-2026-4012-8000-000000000a0d', '7a5c0e05-2026-4012-8000-000000000a0e', '7a5c0e05-2026-4012-8000-000000000a0f');
delete from public.brotherhood_steps where id in ('7a5c0e05-2026-4012-8000-000000000a0a', '7a5c0e05-2026-4012-8000-000000000a0b', '7a5c0e05-2026-4012-8000-000000000a0c');
delete from public.brotherhood_images where id in ('7a5c0e05-2026-4012-8000-000000000a07', '7a5c0e05-2026-4012-8000-000000000a08', '7a5c0e05-2026-4012-8000-000000000a09');
delete from public.steps where entity_id in ('7a5c0e05-2026-4012-8000-000000000a04', '7a5c0e05-2026-4012-8000-000000000a05', '7a5c0e05-2026-4012-8000-000000000a06');
delete from public.images where entity_id in ('7a5c0e05-2026-4012-8000-000000000a01', '7a5c0e05-2026-4012-8000-000000000a02', '7a5c0e05-2026-4012-8000-000000000a03');
delete from public.entities where id in ('7a5c0e05-2026-4012-8000-000000000a01', '7a5c0e05-2026-4012-8000-000000000a02', '7a5c0e05-2026-4012-8000-000000000a03',
  '7a5c0e05-2026-4012-8000-000000000a04', '7a5c0e05-2026-4012-8000-000000000a05', '7a5c0e05-2026-4012-8000-000000000a06');
update public.brotherhoods set official_name = 'Hermandad de la Soledad de Alcalá del Río', popular_name = 'Hermandad de la Soledad de Alcalá del Río',
  brotherhood_types = '{}', current_procession_day = null, canonical_see_place_id = null, notes = null
where entity_id = 'c6100000-0000-4000-8000-000000000005';
update public.entities set summary = null, status = 'draft' where id = 'c6100000-0000-4000-8000-000000000005';
delete from public.sources where id in ('7a5c0e05-2026-4012-8000-00000000ca32', '7a5c0e05-2026-4012-8000-00000000ca33');
commit;
