-- Calle Real de Castilleja: publicación y banda del palio (12/10/2026).
-- Propietario: «Publica. La Banda de la Dolores es la de Sanlúcar la Mayor que indicas».
-- Orden: primero las entidades (Hermandad, 5 imágenes, 4 pasos) y después sus relaciones; el trigger
-- guard_core_relation_publication solo permite publicar relaciones entre entidades publicadas.
-- Reversión: calle-real-publicacion-rollback.sql.

update public.entities set status = 'published'
where status = 'draft' and id in ('c6100000-0000-4000-8000-000000000007',
  '7a5c0e05-2026-4012-8000-0000000057e1','7a5c0e05-2026-4012-8000-0000000057e2','7a5c0e05-2026-4012-8000-0000000057e3',
  '7a5c0e05-2026-4012-8000-0000000057e4','7a5c0e05-2026-4012-8000-0000000057e5',
  '7a5c0e05-2026-4012-8000-0000000057f1','7a5c0e05-2026-4012-8000-0000000057f2','7a5c0e05-2026-4012-8000-0000000057f3','7a5c0e05-2026-4012-8000-0000000057f4');

update public.brotherhood_images set status = 'published' where brotherhood_entity_id = 'c6100000-0000-4000-8000-000000000007' and status = 'draft';
update public.brotherhood_steps set status = 'published' where brotherhood_entity_id = 'c6100000-0000-4000-8000-000000000007' and status = 'draft';
update public.image_steps set status = 'published' where id::text like '7a5c0e05-2026-4012-8000-0000000005a%' and status = 'draft';

insert into public.sources (id, name, source_type, author_or_publisher, publication_date, notes) values
 ('7a5c0e05-2026-4012-8000-00000000ca12', 'Calle Real de Castilleja · banda del palio de los Dolores · confirmación editorial',
  'Aportación directa', 'Dirección de Hilo Cofrade', '2026-10-12',
  'Confirmación directa del editor: la Banda de Música del Rosario de Sanlúcar la Mayor acompaña al palio de María Santísima de los Dolores en la Madrugá. ArteSacro la documenta en 2019.')
on conflict (id) do nothing;

insert into public.music_accompaniment_periods (id, brotherhood_entity_id, band_entity_id, step_entity_id, position, outing_type, is_current,
  date_from_text, notes, status, public_band_name, public_brotherhood_name, public_brotherhood_slug, public_step_name)
values ('7a5c0e05-2026-4012-8000-0000000061a2', 'c6100000-0000-4000-8000-000000000007', '41b9aacc-2f26-4c85-bf00-9268b4dbafc0',
  '7a5c0e05-2026-4012-8000-0000000057f3', 'Tras el paso de palio de María Santísima de los Dolores', 'Madrugá', true,
  'Al menos desde 2019', 'Documentada en 2019 por ArteSacro y confirmada como vigente por el editor.', 'published',
  'Banda de Música del Rosario de Sanlúcar la Mayor', 'Hermandad de la Calle Real de Castilleja de la Cuesta',
  'hermandad-calle-real-castilleja-cuesta', 'Paso de palio de María Santísima de los Dolores')
on conflict (id) do nothing;

insert into public.source_links (source_id, music_accompaniment_period_id, scope)
select s, '7a5c0e05-2026-4012-8000-0000000061a2', 'Acompañamiento · Madrugá'
from unnest(array['7a5c0e05-2026-4012-8000-00000000ca11', '7a5c0e05-2026-4012-8000-00000000ca12']::uuid[]) s
where not exists (select 1 from public.source_links x where x.source_id = s and x.music_accompaniment_period_id = '7a5c0e05-2026-4012-8000-0000000061a2');

-- Ajuste de redacción tras la verificación: «Antiguo titular» se leía como titular que ya no lo es.
update public.entities set summary = 'Crucificado de tamaño natural, anónimo de escuela sevillana del siglo XVII. Es el titular más antiguo de la Hermandad: en el siglo XVIII el Gran Poder lo sustituyó en la Estación de Penitencia. Sale el Jueves Santo en la Vuelta de la Hermandad.'
where id = '7a5c0e05-2026-4012-8000-0000000057e1';
update public.images set description = 'Crucificado de tamaño natural, anónimo de escuela sevillana del siglo XVII. Es el titular más antiguo de la Hermandad: en el siglo XVIII el Gran Poder lo sustituyó en la Estación de Penitencia. Sale el Jueves Santo en la Vuelta de la Hermandad.'
where entity_id = '7a5c0e05-2026-4012-8000-0000000057e1';
