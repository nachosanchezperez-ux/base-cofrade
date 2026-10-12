-- Reversión de cristo-amor-huevar.sql.
begin;
delete from public.source_links where source_id in ('7a5c0e05-2026-4012-8000-00000000ca15', '7a5c0e05-2026-4012-8000-00000000ca16');
update public.music_accompaniment_periods set step_entity_id = null,
  public_step_name = 'Santísimo Cristo del Amor en su Entrada Triunfal en Jerusalén',
  public_brotherhood_name = 'Asociación del Santísimo Cristo del Amor de Huévar del Aljarafe'
where id = 'e657ac93-ed8f-45a4-9e51-8c190354e3e3';
delete from public.image_steps where id = '7a5c0e05-2026-4012-8000-0000000005b5';
delete from public.brotherhood_steps where id = '7a5c0e05-2026-4012-8000-0000000005b4';
delete from public.brotherhood_images where id = '7a5c0e05-2026-4012-8000-0000000005b3';
delete from public.steps where entity_id = '7a5c0e05-2026-4012-8000-0000000005b2';
delete from public.images where entity_id = '7a5c0e05-2026-4012-8000-0000000005b1';
delete from public.entities where id in ('7a5c0e05-2026-4012-8000-0000000005b1', '7a5c0e05-2026-4012-8000-0000000005b2');
delete from public.sources where id in ('7a5c0e05-2026-4012-8000-00000000ca15', '7a5c0e05-2026-4012-8000-00000000ca16');
update public.brotherhoods set official_name = 'Asociación del Santísimo Cristo del Amor de Huévar del Aljarafe',
  popular_name = 'Asociación del Santísimo Cristo del Amor de Huévar del Aljarafe', brotherhood_types = '{}', notes = null
where entity_id = 'f800d9c7-547e-41aa-bb57-09e029ee9085';
update public.entities set name = 'Asociación del Santísimo Cristo del Amor de Huévar del Aljarafe',
  summary = 'Asociación de Fieles Devotos del Santísimo Cristo del Amor en su Entrada Triunfal en Jerusalén.', status = 'draft'
where id = 'f800d9c7-547e-41aa-bb57-09e029ee9085';
commit;
