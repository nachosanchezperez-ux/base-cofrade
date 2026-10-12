-- Reversión de divina-pastora-capuchinos.sql. Valores anteriores consultados el 12/10/2026.
begin;
update public.music_accompaniment_periods set step_entity_id = null, public_step_name = 'Divina Pastora de las Almas Coronada'
where id = '031533f0-1f83-409f-b4cd-d7765999efa8';
delete from public.source_links where source_id in ('7a5c0e05-2026-4012-8000-00000000ca18', '7a5c0e05-2026-4012-8000-00000000ca19',
  '7a5c0e05-2026-4012-8000-00000000ca20', '7a5c0e05-2026-4012-8000-00000000ca21');
delete from public.image_steps where id = '7a5c0e05-2026-4012-8000-0000000005d5';
delete from public.brotherhood_steps where id = '7a5c0e05-2026-4012-8000-0000000005d4';
delete from public.brotherhood_images where id = '7a5c0e05-2026-4012-8000-0000000005d3';
delete from public.steps where entity_id = '7a5c0e05-2026-4012-8000-0000000005d2';
delete from public.images where entity_id = '7a5c0e05-2026-4012-8000-0000000005d1';
delete from public.entities where id in ('7a5c0e05-2026-4012-8000-0000000005d1', '7a5c0e05-2026-4012-8000-0000000005d2');
update public.brotherhoods set municipality_id = null, brotherhood_types = '{}', current_procession_day = null, neighborhood = null, notes = null
where entity_id = '47db4c8f-a4af-4733-8099-d39754cb57b3';
update public.entities set summary = 'Hermandad de gloria de Capuchinos, Sevilla.', status = 'draft'
where id = '47db4c8f-a4af-4733-8099-d39754cb57b3';
delete from public.sources where id in ('7a5c0e05-2026-4012-8000-00000000ca18', '7a5c0e05-2026-4012-8000-00000000ca19',
  '7a5c0e05-2026-4012-8000-00000000ca20', '7a5c0e05-2026-4012-8000-00000000ca21');
commit;
