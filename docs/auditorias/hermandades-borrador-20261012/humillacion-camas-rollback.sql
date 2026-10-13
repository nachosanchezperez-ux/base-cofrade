-- Reversión de humillacion-camas.sql. Valores anteriores consultados el 12/10/2026.
begin;
delete from public.source_links where music_accompaniment_period_id = '7a5c0e05-2026-4012-8000-0000000061a5';
delete from public.music_accompaniment_periods where id = '7a5c0e05-2026-4012-8000-0000000061a5';
delete from public.source_links where music_accompaniment_period_id = '7a5c0e05-2026-4012-8000-0000000061a4';
delete from public.music_accompaniment_periods where id = '7a5c0e05-2026-4012-8000-0000000061a4';
delete from public.source_links where source_id = '7a5c0e05-2026-4012-8000-00000000ca29';
delete from public.music_accompaniment_periods where id = '7a5c0e05-2026-4012-8000-0000000061a3';
update public.music_accompaniment_periods set step_entity_id = null, public_step_name = null
where id = '8a294ba7-a11f-4525-8cef-e7fd2ef6b38d';
delete from public.source_links where source_id in ('7a5c0e05-2026-4012-8000-00000000ca25', '7a5c0e05-2026-4012-8000-00000000ca26', '7a5c0e05-2026-4012-8000-00000000ca27', '7a5c0e05-2026-4012-8000-00000000ca28');
delete from public.image_steps where id in ('7a5c0e05-2026-4012-8000-0000000005fb', '7a5c0e05-2026-4012-8000-0000000005fc', '7a5c0e05-2026-4012-8000-0000000005fd');
delete from public.brotherhood_steps where id in ('7a5c0e05-2026-4012-8000-0000000005f9', '7a5c0e05-2026-4012-8000-0000000005fa');
delete from public.brotherhood_images where id in ('7a5c0e05-2026-4012-8000-0000000005f6', '7a5c0e05-2026-4012-8000-0000000005f7', '7a5c0e05-2026-4012-8000-0000000005f8');
delete from public.steps where entity_id in ('7a5c0e05-2026-4012-8000-0000000005f4', '7a5c0e05-2026-4012-8000-0000000005f5');
delete from public.images where entity_id in ('7a5c0e05-2026-4012-8000-0000000005f1', '7a5c0e05-2026-4012-8000-0000000005f2', '7a5c0e05-2026-4012-8000-0000000005f3');
delete from public.entities where id in ('7a5c0e05-2026-4012-8000-0000000005f1', '7a5c0e05-2026-4012-8000-0000000005f2', '7a5c0e05-2026-4012-8000-0000000005f3',
  '7a5c0e05-2026-4012-8000-0000000005f4', '7a5c0e05-2026-4012-8000-0000000005f5');
update public.brotherhoods set official_name = 'Hermandad de la Humillación de Camas', popular_name = 'Hermandad de la Humillación de Camas',
  brotherhood_types = '{}', current_procession_day = null, notes = null
where entity_id = 'c6100000-0000-4000-8000-000000000016';
update public.entities set summary = null, status = 'draft' where id = 'c6100000-0000-4000-8000-000000000016';
delete from public.sources where id in ('7a5c0e05-2026-4012-8000-00000000ca25', '7a5c0e05-2026-4012-8000-00000000ca26', '7a5c0e05-2026-4012-8000-00000000ca27', '7a5c0e05-2026-4012-8000-00000000ca28', '7a5c0e05-2026-4012-8000-00000000ca29', '7a5c0e05-2026-4012-8000-00000000ca30', '7a5c0e05-2026-4012-8000-00000000ca31');
commit;
