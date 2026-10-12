-- Reversión de fusiones-y-olivares.sql. Valores anteriores consultados el 12/10/2026.
-- (El refresco de ubicación del paso 5 no se revierte: solo sincroniza con el municipio asignado.)
begin;

-- 4 · Olivares
update public.music_accompaniment_periods set step_entity_id = null,
  public_brotherhood_name = 'Hermandad de Santa María de las Nieves de Olivares', public_brotherhood_slug = 'hermandad-santa-maria-nieves-olivares'
where id = '411ee9f4-c7ef-4d0a-beab-2b473ab59ae5';
delete from public.source_links where source_id in ('7a5c0e05-2026-4012-8000-00000000ca07', '7a5c0e05-2026-4012-8000-00000000ca08');
delete from public.image_steps where id = '7a5c0e05-2026-4012-8000-0000000057c2';
delete from public.brotherhood_steps where id = '7a5c0e05-2026-4012-8000-0000000057b4';
delete from public.brotherhood_images where id = '7a5c0e05-2026-4012-8000-0000000057d1';
delete from public.steps where entity_id = '7a5c0e05-2026-4012-8000-0000000057a5';
delete from public.images where entity_id = '7a5c0e05-2026-4012-8000-0000000057a4';
delete from public.entities where id in ('7a5c0e05-2026-4012-8000-0000000057a4', '7a5c0e05-2026-4012-8000-0000000057a5');
update public.brotherhoods set official_name = 'Hermandad de Santa María de las Nieves de Olivares',
  popular_name = 'Hermandad de Santa María de las Nieves de Olivares', brotherhood_types = '{}', notes = null
where entity_id = '93de8c16-5c7b-45a4-bb6d-018ca5d9d193';
update public.entities set name = 'Hermandad de Santa María de las Nieves de Olivares', slug = 'hermandad-santa-maria-nieves-olivares',
  summary = 'Hermandad de gloria de Olivares.', status = 'draft'
where id = '93de8c16-5c7b-45a4-bb6d-018ca5d9d193';

-- 3 · Benacazón
update public.entities set status = 'draft' where id = '4c8f6c96-8537-40ca-89f9-d3c2cf2d14e1';
delete from public.source_links where source_id = '7a5c0e05-2026-4012-8000-00000000ca09';
delete from public.music_accompaniment_periods where id = '7a5c0e05-2026-4012-8000-0000000061a1';
update public.music_accompaniment_periods set brotherhood_entity_id = '4c8f6c96-8537-40ca-89f9-d3c2cf2d14e1',
  public_brotherhood_name = 'Hermandad de las Nieves', public_brotherhood_slug = 'hermandad-nieves-benacazon', notes = '5 de agosto'
where id = '4fa11877-9ade-4d6b-8f9d-e8cfc0d0578b';

-- 2 · Torreblanca
update public.entities set status = 'draft' where id = 'd19ca7f8-ab3b-49f5-8977-35f8c4bb5a0f';
update public.entity_relations set target_entity_id = 'd19ca7f8-ab3b-49f5-8977-35f8c4bb5a0f' where id = 'dd9d36b4-017e-4014-8949-8438d743e7cf';
update public.outings set brotherhood_entity_id = 'd19ca7f8-ab3b-49f5-8977-35f8c4bb5a0f' where id = '5e717312-78b6-4101-b29c-33c58767faef';
update public.music_accompaniment_periods set brotherhood_entity_id = 'd19ca7f8-ab3b-49f5-8977-35f8c4bb5a0f', step_entity_id = null,
  public_brotherhood_name = 'Hermandad de los Dolores de Torreblanca', public_brotherhood_slug = 'hermandad-dolores-torreblanca-sevilla',
  public_step_name = 'María Santísima de los Dolores'
where id = '5f83e189-d753-42e1-9faa-afb0fd17dd15';

-- 1 · La Milagrosa
update public.entities set status = 'draft' where id = '04d05809-d663-4e4c-b1b3-af7eb7823afb';
update public.source_links set entity_id = '04d05809-d663-4e4c-b1b3-af7eb7823afb' where id = 'd24f8d9a-5b88-4fed-9f2f-d4e6253a296c';
update public.music_accompaniment_periods set brotherhood_entity_id = '04d05809-d663-4e4c-b1b3-af7eb7823afb', step_entity_id = null,
  public_brotherhood_name = 'Hermandad de la Milagrosa', public_brotherhood_slug = 'hermandad-milagrosa-sevilla',
  public_step_name = 'Nuestro Padre Jesús de la Esperanza en el Puente Cedrón'
where id = 'b081f8eb-b21c-4d9f-afb4-a16d84c2f9fc';
update public.music_accompaniment_periods set brotherhood_entity_id = '04d05809-d663-4e4c-b1b3-af7eb7823afb', step_entity_id = null,
  public_brotherhood_name = 'Hermandad de la Milagrosa', public_brotherhood_slug = 'hermandad-milagrosa-sevilla', public_step_name = null
where id = '46b1c677-25ba-42c5-b5d1-cd3197d02e83';

delete from public.sources where id in ('7a5c0e05-2026-4012-8000-00000000ca07', '7a5c0e05-2026-4012-8000-00000000ca08', '7a5c0e05-2026-4012-8000-00000000ca09');

commit;
