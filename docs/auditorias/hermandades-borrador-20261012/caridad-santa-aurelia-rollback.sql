-- Reversión de caridad-santa-aurelia.sql.
begin;
delete from public.source_links where source_id in ('7a5c0e05-2026-4012-8000-00000000ca13', '7a5c0e05-2026-4012-8000-00000000ca14');
delete from public.music_accompaniment_periods where id = '7a5c0e05-2026-4012-8000-0000000059f1';
update public.music_accompaniment_periods set step_entity_id = null, public_step_name = 'María Santísima de la Caridad', position = 'Tras el paso'
where id = '6ecae90c-effb-46c3-a3d3-69571760ded7';
delete from public.image_steps where id = '7a5c0e05-2026-4012-8000-0000000059e1';
delete from public.brotherhood_steps where id = '7a5c0e05-2026-4012-8000-0000000059d1';
delete from public.brotherhood_images where id = '7a5c0e05-2026-4012-8000-0000000059c1';
delete from public.steps where entity_id = '7a5c0e05-2026-4012-8000-0000000059b1';
delete from public.images where entity_id = '7a5c0e05-2026-4012-8000-0000000059a1';
delete from public.entities where id in ('7a5c0e05-2026-4012-8000-0000000059a1', '7a5c0e05-2026-4012-8000-0000000059b1');
delete from public.sources where id in ('7a5c0e05-2026-4012-8000-00000000ca13', '7a5c0e05-2026-4012-8000-00000000ca14');
update public.brotherhoods set official_name = 'Agrupación Parroquial María Santísima de la Caridad de Santa Aurelia', neighborhood = null,
  brotherhood_types = array['Agrupación Parroquial'], notes = null where entity_id = '75c1871f-fe7e-4ed3-b6a6-6d8a257add62';
update public.entities set summary = 'Agrupación parroquial de Santa Aurelia, Sevilla.' where id = '75c1871f-fe7e-4ed3-b6a6-6d8a257add62';
commit;
