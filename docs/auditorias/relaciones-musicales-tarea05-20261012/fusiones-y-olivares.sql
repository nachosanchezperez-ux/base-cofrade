-- Hermandades en borrador: fusión de duplicados y ficha de Olivares (12/10/2026).
-- Autorizado por el propietario:
--   · Olivares: «Ficha de la Parroquia».
--   · La Milagrosa: «dos periodos: el primero con Redención y el actual con Virgen de los Reyes».
--   · Torreblanca: «OK».
--   · Nieves de Benacazón: «lleva a la Cruz Roja el 5 de agosto y el 6 de agosto a la Banda de Música
--     Virgen de las Mercedes de Bollullos Par del Condado».
-- Los borradores duplicados se archivan; no se borra nada. Reversión: fusiones-y-olivares-rollback.sql.

-- Fuentes nuevas
insert into public.sources (id, name, url, source_type, author_or_publisher, publication_date, accessed_at, notes) values
 ('7a5c0e05-2026-4012-8000-00000000ca07', 'El arzobispo anuncia la coronación canónica de la Virgen de las Nieves de Olivares',
  'https://www.archisevilla.org/el-arzobispo-anuncia-la-coronacion-canonica-de-la-virgen-de-las-nieves-de-olivares/',
  'Fuente institucional', 'Archidiócesis de Sevilla', '2026-04-19', '2026-10-12',
  'Coronación el 29 de abril de 2028, solicitada por la comunidad parroquial. Imagen barroca de María Roldán, hija de Pedro Roldán.'),
 ('7a5c0e05-2026-4012-8000-00000000ca08', 'Santa María de las Nieves paseó por las calles de Olivares tras los primeros actos misionales',
  'https://www.artesacro.org/Noticia/Ver/169253/provincia-santa-maria-nieves-paseo-calles-olivares-tras-primeros-actos',
  'Prensa cofrade', 'ArteSacro', '2026-09-28', '2026-10-12',
  'La Virgen «ha procesionado en su paso» acompañada por la Banda de las Nieves de Olivares.'),
 ('7a5c0e05-2026-4012-8000-00000000ca09', 'Nieves de Benacazón · bandas del 5 y 6 de agosto · confirmación editorial', null,
  'Aportación directa', 'Dirección de Hilo Cofrade', '2026-10-12', null,
  'Confirmación directa del editor: Cruz Roja acompaña el 5 de agosto y la Banda de Música Virgen de las Mercedes de Bollullos Par del Condado el 6 de agosto.')
on conflict (id) do nothing;

-- 1 · La Milagrosa: borrador 04d05809 → ficha publicada eb4f4232 (misterio del Puente del Cedrón)
update public.music_accompaniment_periods
set brotherhood_entity_id = 'eb4f4232-4fd4-4f30-a1da-0ad3188cfd07',
    step_entity_id = 'b3a8bf1b-c79b-4e45-9bd9-84b1af4ca87c',
    public_brotherhood_name = 'La Milagrosa', public_brotherhood_slug = 'la-milagrosa-sevilla',
    public_step_name = 'Paso de misterio de Nuestro Padre Jesús de la Esperanza en el Puente del Cedrón'
where id in ('b081f8eb-b21c-4d9f-afb4-a16d84c2f9fc', '46b1c677-25ba-42c5-b5d1-cd3197d02e83')
  and brotherhood_entity_id = '04d05809-d663-4e4c-b1b3-af7eb7823afb';
update public.source_links set entity_id = 'eb4f4232-4fd4-4f30-a1da-0ad3188cfd07'
where id = 'd24f8d9a-5b88-4fed-9f2f-d4e6253a296c' and entity_id = '04d05809-d663-4e4c-b1b3-af7eb7823afb';
update public.entities set status = 'archived' where id = '04d05809-d663-4e4c-b1b3-af7eb7823afb' and status = 'draft';

-- 2 · Torreblanca: borrador d19ca7f8 → ficha publicada ce7dd915 (palio de María Santísima de los Dolores)
update public.music_accompaniment_periods
set brotherhood_entity_id = 'ce7dd915-3992-43d9-af72-d555b17c2c88',
    step_entity_id = '893773a8-9050-42a7-8680-ff84aa341664',
    public_brotherhood_name = 'Torreblanca', public_brotherhood_slug = 'torreblanca-jesus-cautivo',
    public_step_name = 'Paso de palio de María Santísima de los Dolores'
where id = '5f83e189-d753-42e1-9faa-afb0fd17dd15' and brotherhood_entity_id = 'd19ca7f8-ab3b-49f5-8977-35f8c4bb5a0f';
update public.outings set brotherhood_entity_id = 'ce7dd915-3992-43d9-af72-d555b17c2c88'
where id = '5e717312-78b6-4101-b29c-33c58767faef' and brotherhood_entity_id = 'd19ca7f8-ab3b-49f5-8977-35f8c4bb5a0f';
update public.entity_relations set target_entity_id = 'ce7dd915-3992-43d9-af72-d555b17c2c88'
where id = 'dd9d36b4-017e-4014-8949-8438d743e7cf' and target_entity_id = 'd19ca7f8-ab3b-49f5-8977-35f8c4bb5a0f';
update public.entities set status = 'archived' where id = 'd19ca7f8-ab3b-49f5-8977-35f8c4bb5a0f' and status = 'draft';

-- 3 · Nieves de Benacazón: borrador 4c8f6c96 → borrador 5a8117db (nombre oficial completo). Sigue en borrador.
update public.music_accompaniment_periods
set brotherhood_entity_id = '5a8117db-2dfb-480d-9821-74e5e02262b3',
    public_brotherhood_name = 'Nuestra Señora de las Nieves Coronada', public_brotherhood_slug = 'nieves-benacazon',
    notes = '5 de agosto (confirmación editorial).'
where id = '4fa11877-9ade-4d6b-8f9d-e8cfc0d0578b' and brotherhood_entity_id = '4c8f6c96-8537-40ca-89f9-d3c2cf2d14e1';
insert into public.music_accompaniment_periods (id, brotherhood_entity_id, band_entity_id, position, outing_type, is_current,
  date_from_text, notes, status, public_band_name, public_brotherhood_name, public_brotherhood_slug)
values ('7a5c0e05-2026-4012-8000-0000000061a1', '5a8117db-2dfb-480d-9821-74e5e02262b3', 'b5ab8fa7-e3e1-4667-a2db-23bea160aa52',
  'Acompañamiento musical', 'Gloria', true, 'Inicio por documentar', '6 de agosto (confirmación editorial).', 'published',
  'Banda de Música Virgen de las Mercedes de Bollullos del Condado', 'Nuestra Señora de las Nieves Coronada', 'nieves-benacazon')
on conflict (id) do nothing;
insert into public.source_links (source_id, music_accompaniment_period_id, scope)
select '7a5c0e05-2026-4012-8000-00000000ca09', p, 'Acompañamiento · Gloria'
from unnest(array['4fa11877-9ade-4d6b-8f9d-e8cfc0d0578b', '7a5c0e05-2026-4012-8000-0000000061a1']::uuid[]) p
where not exists (select 1 from public.source_links s where s.source_id = '7a5c0e05-2026-4012-8000-00000000ca09' and s.music_accompaniment_period_id = p);
update public.entities set status = 'archived' where id = '4c8f6c96-8537-40ca-89f9-d3c2cf2d14e1' and status = 'draft';

-- 4 · Olivares: la «Hermandad» en borrador pasa a ser la ficha de la Parroquia, con imagen y paso. Publicadas.
update public.entities
set name = 'Parroquia de Santa María de las Nieves de Olivares', slug = 'parroquia-santa-maria-nieves-olivares',
    summary = 'Comunidad parroquial de la Ex Colegial de Santa María de las Nieves de Olivares, que rinde culto a la Patrona de la villa. Solicitó su coronación canónica, fijada para el 29 de abril de 2028.',
    status = 'published'
where id = '93de8c16-5c7b-45a4-bb6d-018ca5d9d193' and status = 'draft';
update public.brotherhoods
set official_name = 'Parroquia de Santa María de las Nieves', popular_name = 'Parroquia de Santa María de las Nieves de Olivares',
    brotherhood_types = array['Parroquia'],
    notes = 'No consta Hermandad: la Patrona la gestiona la comunidad parroquial, que solicitó la coronación canónica.'
where entity_id = '93de8c16-5c7b-45a4-bb6d-018ca5d9d193';

insert into public.entities (id, entity_type, name, slug, summary, status) values
 ('7a5c0e05-2026-4012-8000-0000000057a4', 'image', 'Santa María de las Nieves', 'santa-maria-nieves-olivares',
  'Patrona de Olivares. Escultura barroca de María Roldán, hija de Pedro Roldán, según la Archidiócesis de Sevilla. Será coronada canónicamente el 29 de abril de 2028.', 'published'),
 ('7a5c0e05-2026-4012-8000-0000000057a5', 'step', 'Paso de Santa María de las Nieves', 'paso-santa-maria-nieves-olivares',
  'Paso en el que procesiona Santa María de las Nieves, Patrona de Olivares.', 'published')
on conflict (id) do nothing;
insert into public.images (entity_id, image_type, description)
values ('7a5c0e05-2026-4012-8000-0000000057a4', 'Virgen de Gloria',
  'Imagen barroca de María Roldán, hija de Pedro Roldán, venerada en la Ex Colegial de Santa María de las Nieves de Olivares. Procesiona el 5 de agosto. Su coronación canónica está fijada para el 29 de abril de 2028.')
on conflict (entity_id) do nothing;
insert into public.steps (entity_id, step_type, description)
values ('7a5c0e05-2026-4012-8000-0000000057a5', 'Paso procesional de Gloria',
  'Paso en el que Santa María de las Nieves procesiona por Olivares, como en el regreso de su primera misión de septiembre de 2026.')
on conflict (entity_id) do nothing;
insert into public.brotherhood_images (id, brotherhood_entity_id, image_entity_id, relation_type, notes, status)
values ('7a5c0e05-2026-4012-8000-0000000057d1', '93de8c16-5c7b-45a4-bb6d-018ca5d9d193', '7a5c0e05-2026-4012-8000-0000000057a4', 'titular', 'Patrona de Olivares.', 'published')
on conflict (id) do nothing;
insert into public.brotherhood_steps (id, brotherhood_entity_id, step_entity_id, relation_type, notes, status)
values ('7a5c0e05-2026-4012-8000-0000000057b4', '93de8c16-5c7b-45a4-bb6d-018ca5d9d193', '7a5c0e05-2026-4012-8000-0000000057a5', 'processional_step', 'Paso de la Patrona.', 'published')
on conflict (id) do nothing;
insert into public.image_steps (id, image_entity_id, step_entity_id, relation_type, notes, status)
values ('7a5c0e05-2026-4012-8000-0000000057c2', '7a5c0e05-2026-4012-8000-0000000057a4', '7a5c0e05-2026-4012-8000-0000000057a5', 'processes_on', 'Santa María de las Nieves procesiona en este paso.', 'published')
on conflict (id) do nothing;
insert into public.source_links (source_id, entity_id, brotherhood_step_id, image_step_id, scope)
select v.s, v.e, v.bs, v.isx, v.scope from (values
  ('7a5c0e05-2026-4012-8000-00000000ca07'::uuid, '93de8c16-5c7b-45a4-bb6d-018ca5d9d193'::uuid, null::uuid, null::uuid, 'Comunidad parroquial y coronación'),
  ('7a5c0e05-2026-4012-8000-00000000ca07', '7a5c0e05-2026-4012-8000-0000000057a4', null, null, 'Autoría y coronación'),
  ('7a5c0e05-2026-4012-8000-00000000ca08', '7a5c0e05-2026-4012-8000-0000000057a5', null, null, 'Identificación del paso'),
  ('7a5c0e05-2026-4012-8000-00000000ca08', null, '7a5c0e05-2026-4012-8000-0000000057b4', null, 'Identificación del paso'),
  ('7a5c0e05-2026-4012-8000-00000000ca08', null, null, '7a5c0e05-2026-4012-8000-0000000057c2', 'Identificación del paso')
) v(s, e, bs, isx, scope)
where not exists (select 1 from public.source_links x where x.source_id = v.s and x.entity_id is not distinct from v.e
  and x.brotherhood_step_id is not distinct from v.bs and x.image_step_id is not distinct from v.isx);
update public.music_accompaniment_periods
set step_entity_id = '7a5c0e05-2026-4012-8000-0000000057a5',
    public_brotherhood_name = 'Parroquia de Santa María de las Nieves de Olivares',
    public_brotherhood_slug = 'parroquia-santa-maria-nieves-olivares'
where id = '411ee9f4-c7ef-4d0a-beab-2b473ab59ae5' and step_entity_id is null;

-- 5 · Refresco de la ubicación pública de los periodos cuyo municipio se asignó hoy (trigger de sincronización)
update public.music_accompaniment_periods m set brotherhood_entity_id = m.brotherhood_entity_id
from public.brotherhoods b join public.municipalities mu on mu.id = b.municipality_id
where b.entity_id = m.brotherhood_entity_id and m.public_municipality_name is distinct from mu.name;
