-- Reversión de esperanza-arahal.sql. Valores anteriores consultados el 12/10/2026.
begin;
update public.music_accompaniment_periods set step_entity_id = null, public_step_name = null
where id = '6bf4a8a1-3a4b-4699-8379-26aa96c35e32';
update public.music_accompaniment_periods set step_entity_id = null, public_step_name = 'Paso de palio de Nuestra Señora de las Angustias'
where id in ('e52fefc4-7129-4f04-8633-196384641882', '69e37af7-c32c-421b-a9ec-a1a777db9959');
delete from public.source_links where source_id in ('7a5c0e05-2026-4012-8000-00000000ca22', '7a5c0e05-2026-4012-8000-00000000ca23', '7a5c0e05-2026-4012-8000-00000000ca24');
delete from public.image_steps where id in ('7a5c0e05-2026-4012-8000-0000000005eb', '7a5c0e05-2026-4012-8000-0000000005ec');
delete from public.brotherhood_steps where id in ('7a5c0e05-2026-4012-8000-0000000005e9', '7a5c0e05-2026-4012-8000-0000000005ea');
delete from public.brotherhood_images where id in ('7a5c0e05-2026-4012-8000-0000000005e6', '7a5c0e05-2026-4012-8000-0000000005e7', '7a5c0e05-2026-4012-8000-0000000005e8');
delete from public.steps where entity_id in ('7a5c0e05-2026-4012-8000-0000000005e4', '7a5c0e05-2026-4012-8000-0000000005e5');
delete from public.images where entity_id in ('7a5c0e05-2026-4012-8000-0000000005e1', '7a5c0e05-2026-4012-8000-0000000005e2', '7a5c0e05-2026-4012-8000-0000000005e3');
delete from public.entities where id in ('7a5c0e05-2026-4012-8000-0000000005e1', '7a5c0e05-2026-4012-8000-0000000005e2', '7a5c0e05-2026-4012-8000-0000000005e3',
  '7a5c0e05-2026-4012-8000-0000000005e4', '7a5c0e05-2026-4012-8000-0000000005e5');
update public.brotherhoods set official_name = 'Hermandad de la Esperanza de Arahal', popular_name = 'Hermandad de la Esperanza de Arahal',
  brotherhood_types = '{}', current_procession_day = null, notes = null
where entity_id = 'c6100000-0000-4000-8000-000000000010';
update public.entities set summary = null, status = 'draft' where id = 'c6100000-0000-4000-8000-000000000010';
delete from public.sources where id in ('7a5c0e05-2026-4012-8000-00000000ca22', '7a5c0e05-2026-4012-8000-00000000ca23', '7a5c0e05-2026-4012-8000-00000000ca24');
commit;
