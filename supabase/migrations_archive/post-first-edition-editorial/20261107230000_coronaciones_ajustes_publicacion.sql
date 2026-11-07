-- Vírgenes Coronadas · ajustes tras la carga de 2026-2028 (07/11/2026)
-- Solo DML. Idempotente. Aplicado en producción el 07/11/2026 (hora de Madrid)
-- por SQL directo y verificado con el rol anon.
--
-- 1. Publicación de las 4 imágenes creadas en revisión por
--    20261107220000_coronaciones_anunciadas_2026_2028.sql (Villadiego, Esperanza
--    de La Roda, Remedios de Los Palacios y Dolores de Guillena). Se sirven como
--    noindex mientras la ficha sea escasa (publicEditorialRobots).
-- 2. Publicación de sus 4 relaciones involves, que quedaron en draft: la
--    política RLS «Published entity relations» exige status = 'published' en la
--    relación, así que no aparecían en /virgenes-coronadas.
-- 3. Confirmación de Nacho (07/11/2026): se celebraron las coronaciones de la
--    Esperanza de La Roda (20/06/2026), la Sangre de Gerena (12/09/2026) y las
--    Angustias de Utrera (03/10/2026). Pasan de announced a held.
--
-- Recuperación (estado previo):
--   update public.entities set status = 'review' where id::text like 'c0261107-1a00-%';
--   update public.entity_relations set status = 'draft'
--     where relation_type = 'involves' and target_entity_id::text like 'c0261107-1a00-%';
--   update public.events set event_status = 'announced'
--     where entity_id in ('c0261107-c0e1-4000-8000-000000000002',
--                         'c0261107-c0e1-4000-8000-000000000003',
--                         'c0261107-c0e0-4000-8000-000000000024');

begin;

update public.entities
set status = 'published', updated_at = now()
where id in (
  'c0261107-1a00-4000-8000-000000000001',
  'c0261107-1a00-4000-8000-000000000002',
  'c0261107-1a00-4000-8000-000000000003',
  'c0261107-1a00-4000-8000-000000000004'
)
and status <> 'published';

update public.entity_relations
set status = 'published'
where relation_type = 'involves'
  and target_entity_id in (
    'c0261107-1a00-4000-8000-000000000001',
    'c0261107-1a00-4000-8000-000000000002',
    'c0261107-1a00-4000-8000-000000000003',
    'c0261107-1a00-4000-8000-000000000004'
  )
  and status <> 'published';

update public.events
set event_status = 'held', updated_at = now()
where event_status = 'announced'
  and (
    (entity_id = 'c0261107-c0e1-4000-8000-000000000002' and event_date = '2026-06-20')
    or (entity_id = 'c0261107-c0e0-4000-8000-000000000024' and event_date = '2026-09-12')
    or (entity_id = 'c0261107-c0e1-4000-8000-000000000003' and event_date = '2026-10-03')
  );

commit;
