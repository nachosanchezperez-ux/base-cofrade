-- Reversión de jesus-la-algaba.sql.
begin;
delete from public.source_links where source_id = '7a5c0e05-2026-4012-8000-00000000ca17'
  or (source_id = '99edd4fa-028b-425d-950f-13ea955163f8' and (entity_id = '7a5c0e05-2026-4012-8000-0000000005c2' or image_step_id = '7a5c0e05-2026-4012-8000-0000000005cc'));
update public.music_accompaniment_periods set step_entity_id = null, position = 'Tras el paso', public_step_name = 'Nuestra Señora de los Dolores'
where id = 'cac5f6ad-9ed0-4dbc-aa89-e21077821ea6';
delete from public.image_steps where id in ('7a5c0e05-2026-4012-8000-0000000005cb', '7a5c0e05-2026-4012-8000-0000000005cc');
delete from public.brotherhood_steps where id in ('7a5c0e05-2026-4012-8000-0000000005c9', '7a5c0e05-2026-4012-8000-0000000005ca');
delete from public.brotherhood_images where id in ('7a5c0e05-2026-4012-8000-0000000005c6', '7a5c0e05-2026-4012-8000-0000000005c7', '7a5c0e05-2026-4012-8000-0000000005c8');
delete from public.steps where entity_id in ('7a5c0e05-2026-4012-8000-0000000005c4', '7a5c0e05-2026-4012-8000-0000000005c5');
delete from public.images where entity_id in ('7a5c0e05-2026-4012-8000-0000000005c1', '7a5c0e05-2026-4012-8000-0000000005c2', '7a5c0e05-2026-4012-8000-0000000005c3');
delete from public.entities where id in ('7a5c0e05-2026-4012-8000-0000000005c1', '7a5c0e05-2026-4012-8000-0000000005c2', '7a5c0e05-2026-4012-8000-0000000005c3', '7a5c0e05-2026-4012-8000-0000000005c4', '7a5c0e05-2026-4012-8000-0000000005c5');
delete from public.sources where id = '7a5c0e05-2026-4012-8000-00000000ca17';
update public.brotherhoods set official_name = 'Hermandad de Jesús de La Algaba', popular_name = 'Hermandad de Jesús de La Algaba',
  brotherhood_types = '{}', current_procession_day = null, notes = null where entity_id = 'c6100000-0000-4000-8000-000000000004';
update public.entities set summary = null, status = 'draft' where id = 'c6100000-0000-4000-8000-000000000004';
commit;
