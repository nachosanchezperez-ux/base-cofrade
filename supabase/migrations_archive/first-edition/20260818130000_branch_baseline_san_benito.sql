-- Hilo Cofrade · baseline reproducible de San Benito para ramas sin datos
--
-- La consolidación histórica 048 nació sobre registros creados desde el Panel
-- antes de que existiera un historial totalmente reproducible. Las ramas de
-- Supabase con `with_data = false` no heredan esos registros y, por tanto, no
-- pueden alcanzar 048. Este baseline repone únicamente las identidades y
-- relaciones canónicas que 048 debe conservar.
--
-- Es idempotente: en producción, donde los registros ya existen, no modifica
-- su contenido. En una rama vacía usa la localidad de Sevilla resuelta por
-- slug, evitando depender del UUID no determinista del seed inicial.

begin;

insert into public.places (
  id, municipality_id, name, slug, place_type
)
select
  '5996cf32-7c15-4d70-8019-0e6258228803'::uuid,
  municipality.id,
  'Parroquia de San Benito Abad',
  'parroquia-de-san-benito-abad',
  'Parroquia'
from public.municipalities municipality
where municipality.slug = 'sevilla'
on conflict (id) do nothing;

insert into public.entities (id, entity_type, name, slug, summary, status)
values
  (
    '206cf962-fd63-4fae-ad0d-9454554283d8',
    'brotherhood',
    'Hermandad de San Benito',
    'san-benito-canonico-baseline',
    'Hermandad sevillana de penitencia y sacramental, con origen en Triana en 1554 y sede actual en la parroquia de San Benito Abad, que realiza su estación de penitencia en la tarde del Martes Santo.',
    'published'
  ),
  (
    '2c49d077-e377-492d-8e30-25fa823bdcd8',
    'step',
    'Paso de misterio de la Sagrada Presentación de Jesús al Pueblo',
    'paso-de-misterio-de-la-sagrada-presentacion-de-jesus-al-pueblo',
    null,
    'published'
  ),
  (
    'ddda6dd4-a9d6-44f6-b269-02c40903d5ea',
    'step',
    'Paso del Santísimo Cristo de la Sangre',
    'paso-del-cristo-de-la-sangre',
    null,
    'published'
  ),
  (
    '9bd34c93-150e-40b7-9e99-2b66f3bd0f25',
    'step',
    'Paso de palio de Nuestra Señora de la Encarnación Coronada',
    'paso-de-palio-de-nuestra-senora-de-la-encarnacion-coronada',
    null,
    'published'
  ),
  (
    'f171d7f2-0809-44e4-8c0a-048747923d1d',
    'image',
    'Jesús Presentado al Pueblo',
    'jesus-presentado-al-pueblo',
    null,
    'published'
  ),
  (
    'ce5cec3f-479d-4b54-8fbb-543bff223b5f',
    'image',
    'Cristo de la Sangre',
    'cristo-de-la-sangre',
    null,
    'published'
  ),
  (
    '9fff235f-aa1f-46f7-906f-132012e460f4',
    'image',
    'Nuestra Señora de la Encarnación Coronada',
    'nuestra-senora-de-la-encarnacion-coronada',
    null,
    'published'
  ),
  (
    'd335bf75-18ce-42db-a10b-cb8942a7b05a',
    'advocation',
    'Santísimo Sacramento',
    'santisimo-sacramento',
    null,
    'published'
  ),
  (
    '8302cd95-ccb0-44ad-ad81-6f25838146e1',
    'advocation',
    'San Benito Abad',
    'san-benito-abad',
    null,
    'published'
  )
on conflict (id) do nothing;

insert into public.brotherhoods (
  entity_id, official_name, popular_name, foundation_text,
  municipality_id, canonical_see_place_id, neighborhood,
  brotherhood_types, current_procession_day
)
select
  '206cf962-fd63-4fae-ad0d-9454554283d8'::uuid,
  'Hermandad del Santísimo Sacramento, Pontificia y Real Archicofradía de Nazarenos de la Sagrada Presentación de Jesús al Pueblo, Santísimo Cristo de la Sangre, Nuestra Señora de la Encarnación Coronada y San Benito Abad',
  'San Benito',
  '18 de julio de 1554',
  municipality.id,
  '5996cf32-7c15-4d70-8019-0e6258228803'::uuid,
  'La Calzada',
  array['Penitencia']::text[],
  'Martes Santo'
from public.municipalities municipality
where municipality.slug = 'sevilla'
on conflict (entity_id) do nothing;

insert into public.steps (entity_id, step_type, current_condition)
values
  ('2c49d077-e377-492d-8e30-25fa823bdcd8', 'Misterio', 'preserved'),
  ('ddda6dd4-a9d6-44f6-b269-02c40903d5ea', 'Cristo', 'preserved'),
  ('9bd34c93-150e-40b7-9e99-2b66f3bd0f25', 'Palio', 'preserved')
on conflict (entity_id) do nothing;

insert into public.images (
  entity_id, image_type, execution_date_text, description
)
values
  (
    'f171d7f2-0809-44e4-8c0a-048747923d1d',
    'Cristo',
    '1928',
    'Talla completa para vestir en madera de cedro, de 1,82 m de altura, realizada por Antonio Castillo Lastrucci.'
  ),
  (
    'ce5cec3f-479d-4b54-8fbb-543bff223b5f',
    'Cristo',
    '1966',
    'Crucificado tallado en madera de pino de Flandes por Francisco Buiza Fernández.'
  ),
  (
    '9fff235f-aa1f-46f7-906f-132012e460f4',
    'Virgen',
    'Entre 1780 y 1793',
    'Dolorosa de candelero para vestir atribuida a Blas Molner Zamora.'
  )
on conflict (entity_id) do nothing;

insert into public.advocations (entity_id, advocation_type)
values
  ('d335bf75-18ce-42db-a10b-cb8942a7b05a', 'Santísimo Sacramento'),
  ('8302cd95-ccb0-44ad-ad81-6f25838146e1', 'Santo')
on conflict (entity_id) do nothing;

insert into public.brotherhood_steps (
  id, brotherhood_entity_id, step_entity_id, relation_type, status
)
values
  (
    '0b489dbb-12ea-49ec-be83-e152e3c7dcff',
    '206cf962-fd63-4fae-ad0d-9454554283d8',
    '2c49d077-e377-492d-8e30-25fa823bdcd8',
    'processional_step',
    'published'
  ),
  (
    'f7724bd4-6326-4d76-ac46-863c6fc29a9f',
    '206cf962-fd63-4fae-ad0d-9454554283d8',
    'ddda6dd4-a9d6-44f6-b269-02c40903d5ea',
    'processional_step',
    'published'
  ),
  (
    'ff99cb74-9d14-47a8-b433-74f629b64caf',
    '206cf962-fd63-4fae-ad0d-9454554283d8',
    '9bd34c93-150e-40b7-9e99-2b66f3bd0f25',
    'processional_step',
    'published'
  )
on conflict (id) do nothing;

insert into public.brotherhood_images (
  id, brotherhood_entity_id, image_entity_id, relation_type, status
)
values
  (
    'b29bab87-046d-43d6-b817-6d6486f68b3e',
    '206cf962-fd63-4fae-ad0d-9454554283d8',
    'f171d7f2-0809-44e4-8c0a-048747923d1d',
    'titular',
    'published'
  ),
  (
    '804d0952-34a6-471a-a1b5-6f27442131d5',
    '206cf962-fd63-4fae-ad0d-9454554283d8',
    'ce5cec3f-479d-4b54-8fbb-543bff223b5f',
    'titular',
    'published'
  ),
  (
    '4236fdfa-c671-4af4-85c2-d668dce9ad8e',
    '206cf962-fd63-4fae-ad0d-9454554283d8',
    '9fff235f-aa1f-46f7-906f-132012e460f4',
    'titular',
    'published'
  )
on conflict (id) do nothing;

insert into public.image_steps (
  id, image_entity_id, step_entity_id, relation_type, status
)
values
  (
    'f14ef54f-67c8-465f-86e9-0f44cbfce317',
    'f171d7f2-0809-44e4-8c0a-048747923d1d',
    '2c49d077-e377-492d-8e30-25fa823bdcd8',
    'processes_on',
    'published'
  ),
  (
    '04decbf8-1b9d-42b4-8242-606976e2a70d',
    'ce5cec3f-479d-4b54-8fbb-543bff223b5f',
    'ddda6dd4-a9d6-44f6-b269-02c40903d5ea',
    'processes_on',
    'published'
  ),
  (
    '4ca29942-a5b4-4516-8e63-66dd58a61170',
    '9fff235f-aa1f-46f7-906f-132012e460f4',
    '9bd34c93-150e-40b7-9e99-2b66f3bd0f25',
    'processes_on',
    'published'
  )
on conflict (id) do nothing;

-- 042 crea en una rama vacía una relación hacia la Hermandad técnica. Se
-- sustituye por la relación canónica histórica antes de que 048 elimine el
-- duplicado.
delete from public.entity_relations
where source_entity_id = 'cb04a5d8-e81e-4405-a001-9d5a60840924'::uuid
  and target_entity_id = 'a4220000-0000-0000-0000-000000000004'::uuid
  and relation_type = 'belongs_to_brotherhood';

insert into public.entity_relations (
  id, source_entity_id, relation_type, target_entity_id, status
)
values (
  '6ae8b42c-286d-450c-bad8-8b961e95b8f5',
  'cb04a5d8-e81e-4405-a001-9d5a60840924',
  'belongs_to_brotherhood',
  '206cf962-fd63-4fae-ad0d-9454554283d8',
  'published'
)
on conflict (id) do nothing;

insert into public.entity_relations (
  id, source_entity_id, relation_type, target_entity_id, status
)
values
  (
    '7c7b0628-8fa1-40e2-b42b-2a9cac3e463c',
    '206cf962-fd63-4fae-ad0d-9454554283d8',
    'has_titular',
    'd335bf75-18ce-42db-a10b-cb8942a7b05a',
    'published'
  ),
  (
    '01d76044-4034-4e41-b800-32f5d2bacf88',
    '206cf962-fd63-4fae-ad0d-9454554283d8',
    'has_titular',
    '8302cd95-ccb0-44ad-ad81-6f25838146e1',
    'published'
  )
on conflict (id) do nothing;

do $$
begin
  if not exists (
    select 1
    from public.entities entity
    join public.brotherhoods brotherhood on brotherhood.entity_id = entity.id
    where entity.id = '206cf962-fd63-4fae-ad0d-9454554283d8'::uuid
      and brotherhood.canonical_see_place_id = '5996cf32-7c15-4d70-8019-0e6258228803'::uuid
      and brotherhood.neighborhood = 'La Calzada'
  ) then
    raise exception 'Baseline San Benito: no se pudo reconstruir la identidad canónica';
  end if;

  if (
    select count(*)
    from public.brotherhood_steps
    where brotherhood_entity_id = '206cf962-fd63-4fae-ad0d-9454554283d8'::uuid
      and status <> 'archived'
  ) <> 3 then
    raise exception 'Baseline San Benito: no se pudieron reconstruir los tres Pasos';
  end if;
end
$$;

commit;
