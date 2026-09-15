-- Hilo Cofrade · macrofrente Bandas
-- Cierra la trazabilidad mínima de las fichas públicas y reconcilia el nodo
-- duplicado de la Agrupación Musical Juvenil de Los Gitanos.
-- FIRST EDITION FREEZE: receta editorial DML, sin DDL ni cambios de RLS.

begin;

do $preflight$
declare
  v_published_bands integer;
  v_bands_without_source integer;
  v_map_rows integer;
begin
  select count(*) into v_published_bands
  from public.bands b
  join public.entities e on e.id = b.entity_id
  where e.status = 'published';

  if v_published_bands <> 76 then
    raise exception 'Preflight Bandas: se esperaban 76 fichas publicadas y existen %', v_published_bands;
  end if;

  select count(*) into v_bands_without_source
  from public.bands b
  join public.entities e on e.id = b.entity_id
  where e.status = 'published'
    and not exists (
      select 1 from public.source_links sl where sl.entity_id = e.id
    );

  if v_bands_without_source <> 19 then
    raise exception 'Preflight Bandas: se esperaban 19 fichas públicas sin Fuente y existen %', v_bands_without_source;
  end if;

  if not exists (
    select 1
    from public.entities
    where id = '218bf3a6-9e00-4691-8306-bd86627a5d19'
      and entity_type = 'band'
      and status = 'published'
  ) then
    raise exception 'Preflight Bandas: no existe el nodo canónico de Los Gitanos Juvenil';
  end if;

  if not exists (
    select 1
    from public.entities
    where id = '25531e20-2a86-44be-8a7e-08295853110c'
      and entity_type = 'band'
      and status = 'published'
  ) then
    raise exception 'Preflight Bandas: el duplicado esperado ya no está publicado';
  end if;

  if (select count(*) from public.music_accompaniment_periods where band_entity_id = '25531e20-2a86-44be-8a7e-08295853110c') <> 1
     or (select count(*) from public.accompaniments where band_entity_id = '25531e20-2a86-44be-8a7e-08295853110c') <> 1 then
    raise exception 'Preflight Bandas: cambió el universo relacional del duplicado de Los Gitanos Juvenil';
  end if;

  with source_map(entity_id, source_id) as (
    values
      ('6d6ceee7-53d0-4705-a58c-fadc364cb322'::uuid, '2c4582c2-5151-43f4-9f6f-81bf9c78ce81'::uuid),
      ('546d616f-4a2c-4ab0-9839-4e980d41d5f1'::uuid, '31d5b570-2759-4e92-89e6-9eab8bcf8145'::uuid),
      ('aa0f526c-2b63-41f0-aa74-ecaa14365375'::uuid, '379cbea3-b75c-49a0-9bf6-e4ebc93ad0d0'::uuid),
      ('9d287c37-ffc7-44ab-858a-115a324f51c2'::uuid, 'c0160005-0001-4000-8000-000000000002'::uuid),
      ('965eb1f8-0171-4282-9f27-2e65bf3c5cad'::uuid, '48609aae-752c-43e1-bef7-71c46e6f941d'::uuid),
      ('25157e96-54d1-4f24-bea9-2bb1d7f2607c'::uuid, 'c81b4f45-9d74-4f68-916c-d01d6f033cc8'::uuid),
      ('63f719d8-61ab-4357-a43f-cc7977bdda43'::uuid, '4d7ba709-9674-4822-983c-6a8581290706'::uuid),
      ('49b5a3e0-c7d6-4dac-980e-3eddc355a7d1'::uuid, '906860f1-b4da-41a4-ade1-f91cf98378ee'::uuid),
      ('75fc797d-f287-4813-9e52-8f5c5ddf56ad'::uuid, 'b47c53c4-e999-470c-b3e4-b38b1fbbdb64'::uuid),
      ('c34e984b-bb36-4424-a0a5-85b22ab71f72'::uuid, '2814d3c7-f265-4541-997a-0af3c6025af6'::uuid),
      ('028505f2-c902-499f-aefd-d58836d19681'::uuid, 'c0160005-0001-4000-8000-000000000001'::uuid),
      ('8480fe50-3ad1-42c4-af82-38d11bfd9071'::uuid, '7ce6e12d-5e87-4532-b6cb-29c31d3511e5'::uuid),
      ('895dd76d-9b7f-4e5e-bda0-7a3515e75532'::uuid, '9cbb3a7c-7ab1-43f4-850e-104492a3c623'::uuid),
      ('bd8f3c45-bea7-4512-9a3c-e15db9882ff8'::uuid, 'f1bfcb9a-4a80-4c53-820f-49d58676aa3b'::uuid),
      ('d8b67456-156c-4228-8884-ad18ec33a0d3'::uuid, '1f610d15-6204-4680-922e-99a013b1d0af'::uuid),
      ('e4884d0e-204e-408c-955e-b4c639de92c9'::uuid, '4b15d8a8-d998-4c41-8ced-e4c1a86f604b'::uuid),
      ('8f6eb70e-312b-4f8f-a06a-d9701838f3e3'::uuid, 'ae69bba1-f8f9-4bf2-ad71-cdc7c71a17ab'::uuid),
      ('e1740c97-c1ff-494b-9345-f22833d91ba3'::uuid, '7ce6e12d-5e87-4532-b6cb-29c31d3511e5'::uuid)
  )
  select count(*) into v_map_rows
  from source_map sm
  join public.entities e on e.id = sm.entity_id and e.entity_type = 'band' and e.status = 'published'
  join public.sources s on s.id = sm.source_id
  where not exists (
    select 1 from public.source_links sl where sl.entity_id = sm.entity_id
  );

  if v_map_rows <> 18 then
    raise exception 'Preflight Bandas: el mapa de trazabilidad resolvió % de 18 fichas', v_map_rows;
  end if;

  if exists (select 1 from public.entities group by slug having count(*) > 1) then
    raise exception 'Preflight Bandas: existen slugs duplicados antes del Apply';
  end if;
end
$preflight$;

insert into public.bulk_imports (
  id, label, source_name, source_format, status, expected_items, staged_items,
  valid_items, invalid_items, applied_items, failed_items, metadata, completed_at
)
values (
  'c0160025-0000-4000-8000-000000000001',
  'Macrofrente Bandas · trazabilidad pública',
  'Fuentes relacionales existentes · auditoría global 2026-09-15',
  'jsonl', 'ready', 23, 23, 23, 0, 0, 0,
  jsonb_build_object(
    'scope', 'Bandas públicas ya activadas por el grafo',
    'schema', 'unchanged',
    'preserved', 'Bandas históricas archivadas y profundidad no acreditada',
    'collision_guard', 'Reconciliación conservadora de Los Gitanos Juvenil sin borrar IDs'
  ),
  null
)
on conflict (id) do update set
  label = excluded.label,
  source_name = excluded.source_name,
  source_format = excluded.source_format,
  status = excluded.status,
  expected_items = excluded.expected_items,
  staged_items = excluded.staged_items,
  valid_items = excluded.valid_items,
  invalid_items = excluded.invalid_items,
  applied_items = excluded.applied_items,
  failed_items = excluded.failed_items,
  metadata = excluded.metadata,
  completed_at = excluded.completed_at;

with operations(position, table_name, scope) as (
  values
    (0, 'music_accompaniment_periods', 'Reasignar San Roque 2026 al nodo canónico de Los Gitanos Juvenil'),
    (1, 'accompaniments', 'Reasignar el acompañamiento de San Roque 2026'),
    (2, 'bands', 'Completar la descripción del nodo canónico'),
    (3, 'entities', 'Archivar el nodo duplicado sin borrar su ID'),
    (4, 'source_links', 'Santa Cecilia de Sevilla'),
    (5, 'source_links', 'Santa María de la Esperanza'),
    (6, 'source_links', 'Asociación Musical de La Algaba'),
    (7, 'source_links', 'Cristo del Humilladero'),
    (8, 'source_links', 'Prendimiento de Dos Hermanas'),
    (9, 'source_links', 'Liceo de Sevilla'),
    (10, 'source_links', 'Municipal de Coria del Río'),
    (11, 'source_links', 'Santa Ana de Dos Hermanas'),
    (12, 'source_links', 'Villa de Osuna'),
    (13, 'source_links', 'Virgen del Castillo de Lebrija'),
    (14, 'source_links', 'Cristo del Perdón de La Rinconada'),
    (15, 'source_links', 'Sinfónica Municipal de Sevilla'),
    (16, 'source_links', 'Capilla Gólgota'),
    (17, 'source_links', 'Capilla Lignum Crucis'),
    (18, 'source_links', 'Capilla María Auxiliadora'),
    (19, 'source_links', 'De Profundis'),
    (20, 'source_links', 'Trío Olmo, Vergara y Coca'),
    (21, 'source_links', 'Unidad de Música de la Fuerza Terrestre'),
    (22, 'entities', 'Completar el resumen público del nodo canónico de Los Gitanos Juvenil')
)
insert into public.bulk_import_items (
  id, import_id, position, table_name, operation, priority, record,
  status, validation_errors, result, applied_at
)
select
  gen_random_uuid(),
  'c0160025-0000-4000-8000-000000000001',
  position,
  table_name,
  'upsert',
  100,
  jsonb_build_object('scope', scope, 'recipe', '20260915213000_cierra_trazabilidad_bandas_publicas.sql'),
  'valid',
  '[]'::jsonb,
  null,
  null
from operations
on conflict (import_id, position) do update set
  table_name = excluded.table_name,
  operation = excluded.operation,
  priority = excluded.priority,
  record = excluded.record,
  status = excluded.status,
  validation_errors = excluded.validation_errors,
  error_text = null,
  result = excluded.result,
  applied_at = excluded.applied_at;

update public.music_accompaniment_periods
set band_entity_id = '218bf3a6-9e00-4691-8306-bd86627a5d19',
    updated_at = now()
where id = '3ebb43f7-004c-401c-b9d1-ea5df58b284e';

update public.accompaniments
set band_entity_id = '218bf3a6-9e00-4691-8306-bd86627a5d19'
where id = 'f07adea0-b794-4ba6-93d1-1338d79b5af9';

update public.bands
set description = 'Formación juvenil de la Hermandad de los Gitanos, conocida como Los Gitanos Juvenil y documentada también como Agrupación Musical María Santísima de las Angustias Coronada.'
where entity_id = '218bf3a6-9e00-4691-8306-bd86627a5d19';

update public.entities
set summary = 'Formación juvenil de la Hermandad de los Gitanos, conocida como Los Gitanos Juvenil y documentada también como Agrupación Musical María Santísima de las Angustias Coronada.',
    updated_at = now()
where id = '218bf3a6-9e00-4691-8306-bd86627a5d19';

update public.entities
set status = 'archived',
    summary = 'Nodo duplicado reconciliado con Los Gitanos Juvenil. Se conserva archivado para no borrar su identificador histórico.',
    updated_at = now()
where id = '25531e20-2a86-44be-8a7e-08295853110c';

insert into public.source_links (id, source_id, entity_id, scope, notes)
values
  ('b0160025-0001-4000-8000-000000000001', '2c4582c2-5151-43f4-9f6f-81bf9c78ce81', '6d6ceee7-53d0-4705-a58c-fadc364cb322', 'Acompañamiento documentado · 2026', 'La Fuente acredita la participación de la formación en la procesión de la Pastora de Santa Marina.'),
  ('b0160025-0002-4000-8000-000000000002', '31d5b570-2759-4e92-89e6-9eab8bcf8145', '546d616f-4a2c-4ab0-9839-4e980d41d5f1', 'Acompañamiento documentado · 2026', 'La Fuente acredita la formación en el cortejo de Bendición y Esperanza.'),
  ('b0160025-0003-4000-8000-000000000003', '379cbea3-b75c-49a0-9bf6-e4ebc93ad0d0', 'aa0f526c-2b63-41f0-aa74-ecaa14365375', 'Acompañamiento histórico documentado · 2017', 'La Fuente acredita a la formación tras la Purísima de La Algaba; no se presume vigencia actual.'),
  ('b0160025-0004-4000-8000-000000000004', 'c0160005-0001-4000-8000-000000000002', '9d287c37-ffc7-44ab-858a-115a324f51c2', 'Identidad y acompañamientos', 'Página de la propia Cofradía del Cristo del Humilladero sobre su formación musical.'),
  ('b0160025-0005-4000-8000-000000000005', '48609aae-752c-43e1-bef7-71c46e6f941d', '965eb1f8-0171-4282-9f27-2e65bf3c5cad', 'Acompañamiento documentado · 2026', 'El Consejo acredita a la formación en la Cruz de Guía de la Estrella.'),
  ('b0160025-0006-4000-8000-000000000006', 'c81b4f45-9d74-4f68-916c-d01d6f033cc8', '25157e96-54d1-4f24-bea9-2bb1d7f2607c', 'Acompañamiento documentado · 2026', 'La publicación acredita a la Banda Liceo de Sevilla tras Guadalupe de San Buenaventura.'),
  ('b0160025-0007-4000-8000-000000000007', '4d7ba709-9674-4822-983c-6a8581290706', '63f719d8-61ab-4357-a43f-cc7977bdda43', 'Acompañamiento documentado · 2026', 'La programación oficial acredita a la formación en las celebraciones de la Estrella de Coria.'),
  ('b0160025-0008-4000-8000-000000000008', '906860f1-b4da-41a4-ade1-f91cf98378ee', '49b5a3e0-c7d6-4dac-980e-3eddc355a7d1', 'Identidad y vínculo institucional', 'La Fuente identifica a la Banda de Música Santa Ana de Dos Hermanas y su vínculo con Bellavista.'),
  ('b0160025-0009-4000-8000-000000000009', 'b47c53c4-e999-470c-b3e4-b38b1fbbdb64', '75fc797d-f287-4813-9e52-8f5c5ddf56ad', 'Identidad y actividad documentada', 'El Ayuntamiento de Osuna acredita la formación y su convenio vigente.'),
  ('b0160025-0010-4000-8000-000000000010', '2814d3c7-f265-4541-997a-0af3c6025af6', 'c34e984b-bb36-4424-a0a5-85b22ab71f72', 'Acompañamiento documentado · 2026', 'La Fuente del repertorio acredita a la Banda Virgen del Castillo de Lebrija en la procesión de 2026.'),
  ('b0160025-0011-4000-8000-000000000011', 'c0160005-0001-4000-8000-000000000001', '028505f2-c902-499f-aefd-d58836d19681', 'Acompañamiento documentado · 2026', 'El Ayuntamiento de La Rinconada acredita a la formación en el Viernes Santo de 2026.'),
  ('b0160025-0012-4000-8000-000000000012', '7ce6e12d-5e87-4532-b6cb-29c31d3511e5', '8480fe50-3ad1-42c4-af82-38d11bfd9071', 'Acompañamiento documentado · 2026', 'La Fuente acredita la presencia de la Banda Sinfónica Municipal en el Santo Entierro.'),
  ('b0160025-0013-4000-8000-000000000013', '9cbb3a7c-7ab1-43f4-850e-104492a3c623', '895dd76d-9b7f-4e5e-bda0-7a3515e75532', 'Acompañamiento documentado · 2026', 'La Fuente acredita a la Capilla Musical Gólgota junto a Pasión y Muerte.'),
  ('b0160025-0014-4000-8000-000000000014', 'f1bfcb9a-4a80-4c53-820f-49d58676aa3b', 'bd8f3c45-bea7-4512-9a3c-e15db9882ff8', 'Acompañamiento documentado · 2026', 'La Fuente acredita a Lignum Crucis en el cortejo del Cristo de la Corona.'),
  ('b0160025-0015-4000-8000-000000000015', '1f610d15-6204-4680-922e-99a013b1d0af', 'd8b67456-156c-4228-8884-ad18ec33a0d3', 'Acompañamiento documentado · 2026', 'El Consejo acredita a la Capilla Musical María Auxiliadora en la Cena.'),
  ('b0160025-0016-4000-8000-000000000016', '4b15d8a8-d998-4c41-8ced-e4c1a86f604b', 'e4884d0e-204e-408c-955e-b4c639de92c9', 'Acompañamiento documentado · 2026', 'El Consejo acredita al grupo De Profundis junto al Cristo de la Fundación.'),
  ('b0160025-0017-4000-8000-000000000017', 'ae69bba1-f8f9-4bf2-ad71-cdc7c71a17ab', '8f6eb70e-312b-4f8f-a06a-d9701838f3e3', 'Acompañamiento documentado · 2026', 'El Consejo acredita al trío Olmo, Vergara y Coca en la Sagrada Mortaja.'),
  ('b0160025-0018-4000-8000-000000000018', '7ce6e12d-5e87-4532-b6cb-29c31d3511e5', 'e1740c97-c1ff-494b-9345-f22833d91ba3', 'Acompañamiento documentado · 2026', 'La Fuente acredita a la Unidad de Música de la Fuerza Terrestre en el Santo Entierro.')
on conflict (id) do update set
  source_id = excluded.source_id,
  entity_id = excluded.entity_id,
  scope = excluded.scope,
  notes = excluded.notes;

update public.bulk_import_items
set status = 'applied',
    result = jsonb_build_object('status', 'applied'),
    applied_at = now()
where import_id = 'c0160025-0000-4000-8000-000000000001';

update public.bulk_imports
set status = 'completed',
    applied_items = 23,
    failed_items = 0,
    completed_at = now()
where id = 'c0160025-0000-4000-8000-000000000001';

do $postflight$
begin
  if (select count(*) from public.bulk_import_items where import_id = 'c0160025-0000-4000-8000-000000000001') <> 23 then
    raise exception 'Postflight Bandas: staging incompleto';
  end if;

  if exists (
    select 1
    from public.bands b
    join public.entities e on e.id = b.entity_id
    where e.status = 'published'
      and not exists (select 1 from public.source_links sl where sl.entity_id = e.id)
  ) then
    raise exception 'Postflight Bandas: queda alguna ficha pública sin Fuente';
  end if;

  if exists (
    select 1 from public.music_accompaniment_periods
    where band_entity_id = '25531e20-2a86-44be-8a7e-08295853110c'
    union all
    select 1 from public.accompaniments
    where band_entity_id = '25531e20-2a86-44be-8a7e-08295853110c'
  ) then
    raise exception 'Postflight Bandas: el nodo duplicado conserva relaciones musicales';
  end if;

  if (select status from public.entities where id = '25531e20-2a86-44be-8a7e-08295853110c') <> 'archived' then
    raise exception 'Postflight Bandas: el nodo duplicado no quedó archivado';
  end if;

  if (select count(*) from public.music_accompaniment_periods where band_entity_id = '218bf3a6-9e00-4691-8306-bd86627a5d19' and status = 'published' and is_current) <> 2 then
    raise exception 'Postflight Bandas: Los Gitanos Juvenil no reúne sus dos periodos vigentes';
  end if;

  if exists (
    select 1
    from public.bands b
    join public.entities e on e.id = b.entity_id
    where e.status = 'published' and nullif(trim(b.description), '') is null
  ) then
    raise exception 'Postflight Bandas: queda una ficha pública sin descripción';
  end if;

  if exists (select 1 from public.entities group by slug having count(*) > 1) then
    raise exception 'Postflight Bandas: la receta deja slugs duplicados';
  end if;

  if (select applied_items from public.bulk_imports where id = 'c0160025-0000-4000-8000-000000000001') <> 23
     or (select failed_items from public.bulk_imports where id = 'c0160025-0000-4000-8000-000000000001') <> 0 then
    raise exception 'Postflight Bandas: el lote no quedó 23/23 y 0 fallos';
  end if;
end
$postflight$;

commit;
