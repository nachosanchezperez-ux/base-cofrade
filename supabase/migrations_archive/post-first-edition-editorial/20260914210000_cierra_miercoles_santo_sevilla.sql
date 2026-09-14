-- HC-016 · macrolote transversal: Miércoles Santo de Sevilla
-- Completa El Buen Fin y preserva los ocho cierres previos de la jornada.
-- Solo DML. Receta idempotente archivada fuera de la cadena estructural activa.
-- Lote gobernado c0160016-0000-4000-8000-000000000001: 153/153, 0 inválidas, 0 fallos.

begin;

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('3280aafd-b9dd-4cc7-a288-fd9daf1b88d9', 'Web oficial · Hermandad del Buen Fin', 'https://hermandadbuenfin.es/', 'web', 'Hermandad del Buen Fin', '2026-09-14', 'Identidad, vida corporativa y canales oficiales.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('e8a5d380-d04f-4aa5-bbc4-852426004298', 'Orígenes · Hermandad del Buen Fin', 'https://hermandadbuenfin.es/origenes/', 'web', 'Hermandad del Buen Fin', '2026-09-14', 'Fundación, Reglas primitivas, traslados y primera historia penitencial.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('3ab5d1a2-23ba-42e7-bb76-7e49a9a2f9b3', 'Efemérides · Hermandad del Buen Fin', 'https://hermandadbuenfin.es/efemerides/', 'web', 'Hermandad del Buen Fin', '2026-09-14', 'Reorganizaciones, patrimonio, obra asistencial, coronación y Vía Crucis.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('eab8c447-e1d5-4e2c-a4db-4aa11bfa4c16', 'Santísimo Cristo del Buen Fin', 'https://hermandadbuenfin.es/stmo-cristo-del-buen-fin/', 'web', 'Hermandad del Buen Fin', '2026-09-14', 'Autoría contractual, fecha, restauración y patrimonio del Crucificado.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('52b90ec9-2083-43c8-92de-61c20a6504cf', 'Nuestra Señora de la Palma Coronada', 'https://hermandadbuenfin.es/virgen-de-la-palma/', 'web', 'Hermandad del Buen Fin', '2026-09-14', 'Atribución, restauración, coronación y ajuar de la Dolorosa.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('b0a5f992-531d-4159-acb7-aac9a03e6fc8', 'Cultos y actos 2026 · Hermandad del Buen Fin', 'https://hermandadbuenfin.es/cultos-y-actos/', 'web', 'Hermandad del Buen Fin', '2026-09-14', 'Calendario anual oficial de cultos y actos de 2026.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('39e67857-e435-4e94-abd7-84f27d71ba71', 'Sede canónica · Hermandad del Buen Fin', 'https://hermandadbuenfin.es/sede-canonica/', 'web', 'Hermandad del Buen Fin', '2026-09-14', 'Iglesia de San Antonio de Padua, dirección, patrimonio y cesión de 2013.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('6b5440b2-004c-4ece-a9fb-dad20cf70428', 'Cortejo · Hermandad del Buen Fin', 'https://hermandadbuenfin.es/cortejo/', 'web', 'Hermandad del Buen Fin', '2026-09-14', 'Hábito, pasos, insignias, capataces y acompañamientos musicales.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('471b5fbf-dc3e-4d30-897b-bcb270afaf30', 'Estación de Penitencia del Miércoles Santo de 2026 · Buen Fin', 'https://hermandadbuenfin.es/2026/03/datos-de-la-cofradia-para-la-estacion-de-penitencia-del-miercoles-santo-de-2026/', 'web', 'Hermandad del Buen Fin', '2026-09-14', 'Fecha, horarios, itinerario, cortejo, capataces, música y estrenos de 2026.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('d306c693-e858-4fea-be43-c42d7f3b64c9', 'Heráldica · Hermandad del Buen Fin', 'https://hermandadbuenfin.es/heraldica/', 'web', 'Hermandad del Buen Fin', '2026-09-14', 'Descripción oficial del escudo y el distintivo corporativo.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('0e354126-ff12-47ef-b41c-7b2d199de047', 'El Buen Fin presenta su nuevo misterio, obra de Darío Fernández', 'https://periodicodigital.eusa.es/2024/03/21/el-buen-fin-presenta-su-nuevo-misterio-obra-de-dario-fernandez/', 'web', 'EUSA News', '2026-09-14', 'Recuperación en 2024 de la escena del permiso para el descendimiento mediante cuatro figuras nuevas.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."places" ("id", "municipality_id", "name", "slug", "place_type", "address", "notes")
values ('2064f691-5d03-4dfc-84ed-d85f9c2e6a2c', 'ca85889c-21fe-4367-8477-a57656b25da4', 'Iglesia de San Antonio de Padua', 'iglesia-san-antonio-padua-sevilla', 'Iglesia conventual', 'Calle San Vicente, 91, 41002 Sevilla', 'Sede canónica de la Hermandad del Buen Fin.') on conflict ("id") do update set "municipality_id" = excluded."municipality_id", "name" = excluded."name", "slug" = excluded."slug", "place_type" = excluded."place_type", "address" = excluded."address", "notes" = excluded."notes";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('87ae42f7-787b-484d-80b2-125307311fea', 'agent', 'Sebastián Rodríguez', 'sebastian-rodriguez-escultor', 'Escultor autor del Santísimo Cristo del Buen Fin en 1645.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."agents" ("entity_id", "agent_kind", "description")
values ('87ae42f7-787b-484d-80b2-125307311fea', 'person', 'Escultor del círculo de Juan de Mesa, autor documentado del Santísimo Cristo del Buen Fin.') on conflict ("entity_id") do update set "agent_kind" = excluded."agent_kind", "description" = excluded."description";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('4e4034ab-f8f6-46dd-a458-26314edfd510', 'brotherhood', 'Hermandad del Buen Fin', 'hermandad-buen-fin-sevilla', 'Hermandad sacramental y franciscana de penitencia con sede en San Antonio de Padua.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."brotherhoods" ("entity_id", "official_name", "popular_name", "foundation_text", "municipality_id", "canonical_see_place_id", "neighborhood", "website_url", "brotherhood_types", "current_procession_day", "history_text", "notes")
values ('4e4034ab-f8f6-46dd-a458-26314edfd510', 'Real, Ilustre, Antigua, Fervorosa y Franciscana Hermandad Sacramental y Cofradía de Nazarenos del Santo Sudario, Santísimo Cristo del Buen Fin, Nuestra Señora de la Palma Coronada, San Francisco de Asís y San Antonio de Padua', 'El Buen Fin', '1590; Reglas aprobadas en 1593; reorganizada en 1882 y 1908', 'ca85889c-21fe-4367-8477-a57656b25da4', '2064f691-5d03-4dfc-84ed-d85f9c2e6a2c', 'San Vicente', 'https://hermandadbuenfin.es/', ARRAY['Penitencia', 'Sacramental', 'Franciscana']::text[], 'Miércoles Santo', 'Fundada por el gremio de curtidores en 1590 en San Juan de la Palma, se trasladó en 1605 a San Antonio de Padua. Tras distintos periodos de inactividad, fue reorganizada en 1882 y 1908.', 'No confundir esta corporación ni a Nuestra Señora de la Palma Coronada con María Santísima del Buen Fin, titular de la Hermandad de la Sagrada Lanzada. Sin multimedia nueva mientras no conste licencia reutilizable.') on conflict ("entity_id") do update set "official_name" = excluded."official_name", "popular_name" = excluded."popular_name", "foundation_text" = excluded."foundation_text", "municipality_id" = excluded."municipality_id", "canonical_see_place_id" = excluded."canonical_see_place_id", "neighborhood" = excluded."neighborhood", "website_url" = excluded."website_url", "brotherhood_types" = excluded."brotherhood_types", "current_procession_day" = excluded."current_procession_day", "history_text" = excluded."history_text", "notes" = excluded."notes";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('a9360f5f-e877-459f-9d60-13be9e872fe2', 'image', 'Santísimo Cristo del Buen Fin', 'santisimo-cristo-buen-fin-sevilla', 'Crucificado de Sebastián Rodríguez, tallado en 1645.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."images" ("entity_id", "image_type", "execution_date_text", "current_condition", "description", "is_dress_image")
values ('a9360f5f-e877-459f-9d60-13be9e872fe2', 'Cristo crucificado', '1645', 'extant', 'Crucificado de madera maciza contratado por 150 ducados y restaurado por Luis Ortega Bru en 1979.', false) on conflict ("entity_id") do update set "image_type" = excluded."image_type", "execution_date_text" = excluded."execution_date_text", "current_condition" = excluded."current_condition", "description" = excluded."description", "is_dress_image" = excluded."is_dress_image";

insert into public."brotherhood_images" ("id", "brotherhood_entity_id", "image_entity_id", "relation_type", "notes", "status")
values ('ba8d61c1-abdd-4e2d-958f-676609bfbf98', '4e4034ab-f8f6-46dd-a458-26314edfd510', 'a9360f5f-e877-459f-9d60-13be9e872fe2', 'titular', 'Titular penitencial vigente.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_authorships" ("id", "image_entity_id", "agent_entity_id", "authorship_type", "role_name", "date_from_text", "certainty", "notes", "status")
values ('9cd96614-c2fe-46ef-bb81-86467f21350d', 'a9360f5f-e877-459f-9d60-13be9e872fe2', '87ae42f7-787b-484d-80b2-125307311fea', 'author', 'escultor', '1645', 'documented', 'Autoría documentada.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "agent_entity_id" = excluded."agent_entity_id", "authorship_type" = excluded."authorship_type", "role_name" = excluded."role_name", "date_from_text" = excluded."date_from_text", "certainty" = excluded."certainty", "notes" = excluded."notes", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('edd7b5a6-4e1d-4ab3-ae6a-d5eb0d9b8fee', 'image', 'Nuestra Señora de la Palma Coronada', 'nuestra-senora-palma-coronada-buen-fin-sevilla', 'Dolorosa anónima del siglo XVII, atribuida a Pedro Roldán y coronada canónicamente en 2005.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."images" ("entity_id", "image_type", "execution_date_text", "current_condition", "description", "is_dress_image")
values ('edd7b5a6-4e1d-4ab3-ae6a-d5eb0d9b8fee', 'Virgen Dolorosa de vestir', 'Siglo XVII', 'extant', 'Dolorosa de candelero atribuida a Pedro Roldán; Luis Ortega Bru realizó el candelero en 1979 y la restauró en 1980.', true) on conflict ("entity_id") do update set "image_type" = excluded."image_type", "execution_date_text" = excluded."execution_date_text", "current_condition" = excluded."current_condition", "description" = excluded."description", "is_dress_image" = excluded."is_dress_image";

insert into public."brotherhood_images" ("id", "brotherhood_entity_id", "image_entity_id", "relation_type", "notes", "status")
values ('ab37a7c3-c8d8-4650-a519-918539196dd3', '4e4034ab-f8f6-46dd-a458-26314edfd510', 'edd7b5a6-4e1d-4ab3-ae6a-d5eb0d9b8fee', 'titular', 'Titular penitencial vigente.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_authorships" ("id", "image_entity_id", "agent_entity_id", "authorship_type", "role_name", "date_from_text", "certainty", "notes", "status")
values ('1ee6265a-d803-44f9-bad5-ecc70d530d46', 'edd7b5a6-4e1d-4ab3-ae6a-d5eb0d9b8fee', '262d4bc3-0c79-4344-b40c-9a2f689aafb5', 'attributed_to', 'escultor', 'Siglo XVII', 'attributed', 'Atribución documentada, no autoría contractual.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "agent_entity_id" = excluded."agent_entity_id", "authorship_type" = excluded."authorship_type", "role_name" = excluded."role_name", "date_from_text" = excluded."date_from_text", "certainty" = excluded."certainty", "notes" = excluded."notes", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('c62cb234-0b42-45ba-b265-b1813091df1b', 'image', 'Santa María Magdalena del misterio del Buen Fin', 'maria-magdalena-misterio-buen-fin-sevilla', 'Figura secundaria del misterio recuperado por el Buen Fin en 2024.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."images" ("entity_id", "image_type", "execution_date_text", "current_condition", "description", "is_dress_image")
values ('c62cb234-0b42-45ba-b265-b1813091df1b', 'Imagen secundaria de misterio', '2024', 'extant', 'Figura de María Magdalena integrada en la escena del permiso para el descendimiento.', false) on conflict ("entity_id") do update set "image_type" = excluded."image_type", "execution_date_text" = excluded."execution_date_text", "current_condition" = excluded."current_condition", "description" = excluded."description", "is_dress_image" = excluded."is_dress_image";

insert into public."brotherhood_images" ("id", "brotherhood_entity_id", "image_entity_id", "relation_type", "notes", "status")
values ('6ad193be-2c99-44f1-bdcc-3b2fee7389f6', '4e4034ab-f8f6-46dd-a458-26314edfd510', 'c62cb234-0b42-45ba-b265-b1813091df1b', 'secondary', 'Figura del misterio recuperado en 2024.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_authorships" ("id", "image_entity_id", "agent_entity_id", "authorship_type", "role_name", "date_from_text", "certainty", "notes", "status")
values ('ee137fb4-3eca-4d16-92ee-500df93dc895', 'c62cb234-0b42-45ba-b265-b1813091df1b', '56644891-fdcb-4318-8f5a-4f83d44639d3', 'author', 'escultor', '2024', 'documented', 'Autoría documentada.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "agent_entity_id" = excluded."agent_entity_id", "authorship_type" = excluded."authorship_type", "role_name" = excluded."role_name", "date_from_text" = excluded."date_from_text", "certainty" = excluded."certainty", "notes" = excluded."notes", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('623595ad-0c2e-4719-8678-9141bd27b231', 'image', 'José de Arimatea del misterio del Buen Fin', 'jose-arimatea-misterio-buen-fin-sevilla', 'Figura secundaria del misterio recuperado por el Buen Fin en 2024.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."images" ("entity_id", "image_type", "execution_date_text", "current_condition", "description", "is_dress_image")
values ('623595ad-0c2e-4719-8678-9141bd27b231', 'Imagen secundaria de misterio', '2024', 'extant', 'Figura de José de Arimatea integrada en la escena del permiso para el descendimiento.', false) on conflict ("entity_id") do update set "image_type" = excluded."image_type", "execution_date_text" = excluded."execution_date_text", "current_condition" = excluded."current_condition", "description" = excluded."description", "is_dress_image" = excluded."is_dress_image";

insert into public."brotherhood_images" ("id", "brotherhood_entity_id", "image_entity_id", "relation_type", "notes", "status")
values ('0893e913-d0a6-499a-bc96-9fed6d7aab9e', '4e4034ab-f8f6-46dd-a458-26314edfd510', '623595ad-0c2e-4719-8678-9141bd27b231', 'secondary', 'Figura del misterio recuperado en 2024.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_authorships" ("id", "image_entity_id", "agent_entity_id", "authorship_type", "role_name", "date_from_text", "certainty", "notes", "status")
values ('b2bd7ecc-9e7e-43b5-88aa-e719e9e38e59', '623595ad-0c2e-4719-8678-9141bd27b231', '56644891-fdcb-4318-8f5a-4f83d44639d3', 'author', 'escultor', '2024', 'documented', 'Autoría documentada.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "agent_entity_id" = excluded."agent_entity_id", "authorship_type" = excluded."authorship_type", "role_name" = excluded."role_name", "date_from_text" = excluded."date_from_text", "certainty" = excluded."certainty", "notes" = excluded."notes", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('288f4882-ee90-4344-bc65-25471379feb8', 'image', 'Nicodemo del misterio del Buen Fin', 'nicodemo-misterio-buen-fin-sevilla', 'Figura secundaria del misterio recuperado por el Buen Fin en 2024.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."images" ("entity_id", "image_type", "execution_date_text", "current_condition", "description", "is_dress_image")
values ('288f4882-ee90-4344-bc65-25471379feb8', 'Imagen secundaria de misterio', '2024', 'extant', 'Figura de Nicodemo integrada en la escena del permiso para el descendimiento.', false) on conflict ("entity_id") do update set "image_type" = excluded."image_type", "execution_date_text" = excluded."execution_date_text", "current_condition" = excluded."current_condition", "description" = excluded."description", "is_dress_image" = excluded."is_dress_image";

insert into public."brotherhood_images" ("id", "brotherhood_entity_id", "image_entity_id", "relation_type", "notes", "status")
values ('a2e85ba0-b42e-4e18-9c99-6f700c6fc146', '4e4034ab-f8f6-46dd-a458-26314edfd510', '288f4882-ee90-4344-bc65-25471379feb8', 'secondary', 'Figura del misterio recuperado en 2024.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_authorships" ("id", "image_entity_id", "agent_entity_id", "authorship_type", "role_name", "date_from_text", "certainty", "notes", "status")
values ('0ddec910-63ba-409c-9483-1436e87afe42', '288f4882-ee90-4344-bc65-25471379feb8', '56644891-fdcb-4318-8f5a-4f83d44639d3', 'author', 'escultor', '2024', 'documented', 'Autoría documentada.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "agent_entity_id" = excluded."agent_entity_id", "authorship_type" = excluded."authorship_type", "role_name" = excluded."role_name", "date_from_text" = excluded."date_from_text", "certainty" = excluded."certainty", "notes" = excluded."notes", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('ddf14f61-7f51-4adb-b007-e34c23aa9ddd', 'image', 'Centurión romano del misterio del Buen Fin', 'centurion-romano-misterio-buen-fin-sevilla', 'Figura secundaria del misterio recuperado por el Buen Fin en 2024.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."images" ("entity_id", "image_type", "execution_date_text", "current_condition", "description", "is_dress_image")
values ('ddf14f61-7f51-4adb-b007-e34c23aa9ddd', 'Imagen secundaria de misterio', '2024', 'extant', 'Centurión que entrega el permiso para retirar el cuerpo de Cristo en la escena recuperada.', false) on conflict ("entity_id") do update set "image_type" = excluded."image_type", "execution_date_text" = excluded."execution_date_text", "current_condition" = excluded."current_condition", "description" = excluded."description", "is_dress_image" = excluded."is_dress_image";

insert into public."brotherhood_images" ("id", "brotherhood_entity_id", "image_entity_id", "relation_type", "notes", "status")
values ('e204eeb3-80b4-453a-83ef-dbb7b9653968', '4e4034ab-f8f6-46dd-a458-26314edfd510', 'ddf14f61-7f51-4adb-b007-e34c23aa9ddd', 'secondary', 'Figura del misterio recuperado en 2024.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_authorships" ("id", "image_entity_id", "agent_entity_id", "authorship_type", "role_name", "date_from_text", "certainty", "notes", "status")
values ('b6496561-39d7-456a-a32f-b607a210dcfd', 'ddf14f61-7f51-4adb-b007-e34c23aa9ddd', '56644891-fdcb-4318-8f5a-4f83d44639d3', 'author', 'escultor', '2024', 'documented', 'Autoría documentada.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "agent_entity_id" = excluded."agent_entity_id", "authorship_type" = excluded."authorship_type", "role_name" = excluded."role_name", "date_from_text" = excluded."date_from_text", "certainty" = excluded."certainty", "notes" = excluded."notes", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('bf05b09f-3045-4dec-aea6-31b3014e9625', 'step', 'Paso de misterio del Santísimo Cristo del Buen Fin', 'paso-misterio-cristo-buen-fin-sevilla', 'Paso neobarroco dorado con el misterio recuperado en 2024.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."steps" ("entity_id", "step_type", "current_condition", "execution_date_text", "style", "materials", "description")
values ('bf05b09f-3045-4dec-aea6-31b3014e9625', 'Misterio', 'preserved', '1881–1902; respiraderos de 1928; misterio de 2024', 'Neobarroco', 'Madera de cedro tallada y dorada', 'Paso histórico del Crucificado, con la escena del permiso para el descendimiento recuperada en 2024 mediante figuras de Darío Fernández.') on conflict ("entity_id") do update set "step_type" = excluded."step_type", "current_condition" = excluded."current_condition", "execution_date_text" = excluded."execution_date_text", "style" = excluded."style", "materials" = excluded."materials", "description" = excluded."description";

insert into public."brotherhood_steps" ("id", "brotherhood_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('67c5dff8-29f7-40df-b6f9-fd65780b06e6', '4e4034ab-f8f6-46dd-a458-26314edfd510', 'bf05b09f-3045-4dec-aea6-31b3014e9625', 'current', 'Paso procesional vigente en 2026.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_steps" ("id", "image_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('cd17fcf4-fb60-4d35-a61d-de9ccd32221b', 'a9360f5f-e877-459f-9d60-13be9e872fe2', 'bf05b09f-3045-4dec-aea6-31b3014e9625', 'processional', 'Imagen principal del paso.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_steps" ("id", "image_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('b1079229-ec45-435f-8e58-11cb0848624e', 'c62cb234-0b42-45ba-b265-b1813091df1b', 'bf05b09f-3045-4dec-aea6-31b3014e9625', 'secondary', 'Figura integrada en el misterio recuperado en 2024.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_steps" ("id", "image_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('7a6d4fa0-c31e-44c8-9a43-b8ae25af6384', '623595ad-0c2e-4719-8678-9141bd27b231', 'bf05b09f-3045-4dec-aea6-31b3014e9625', 'secondary', 'Figura integrada en el misterio recuperado en 2024.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_steps" ("id", "image_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('4cfbcae3-fffb-4d83-9d03-352d3bd8a4dc', '288f4882-ee90-4344-bc65-25471379feb8', 'bf05b09f-3045-4dec-aea6-31b3014e9625', 'secondary', 'Figura integrada en el misterio recuperado en 2024.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_steps" ("id", "image_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('31c8fa3f-edd9-421b-9a77-3b703a99ad55', 'ddf14f61-7f51-4adb-b007-e34c23aa9ddd', 'bf05b09f-3045-4dec-aea6-31b3014e9625', 'secondary', 'Figura integrada en el misterio recuperado en 2024.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('21a06198-45b9-44b7-b147-984bad199a7b', 'step', 'Paso de palio de Nuestra Señora de la Palma Coronada', 'paso-palio-palma-coronada-buen-fin-sevilla', 'Paso de palio neorrenacentista diseñado por Ignacio Gómez Millán y estrenado en 1930.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."steps" ("entity_id", "step_type", "current_condition", "execution_date_text", "style", "description")
values ('21a06198-45b9-44b7-b147-984bad199a7b', 'Palio', 'preserved', '1930', 'Neorrenacentista', 'Conjunto diseñado por Ignacio Gómez Millán, con bordados de Sobrinos de José Caro y manto de Esperanza Elena Caro según dibujo de Rafael Vallejo.') on conflict ("entity_id") do update set "step_type" = excluded."step_type", "current_condition" = excluded."current_condition", "execution_date_text" = excluded."execution_date_text", "style" = excluded."style", "description" = excluded."description";

insert into public."brotherhood_steps" ("id", "brotherhood_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('e2371383-6396-4e90-8ccb-94ea24ecc89b', '4e4034ab-f8f6-46dd-a458-26314edfd510', '21a06198-45b9-44b7-b147-984bad199a7b', 'current', 'Paso procesional vigente en 2026.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_steps" ("id", "image_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('6797b2f1-ba92-4e6e-aaf7-462f556dcd88', 'edd7b5a6-4e1d-4ab3-ae6a-d5eb0d9b8fee', '21a06198-45b9-44b7-b147-984bad199a7b', 'processional', 'Titular mariana del paso de palio.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."cults" ("id", "brotherhood_entity_id", "image_entity_id", "cult_type", "title", "date_rule", "month", "place_id", "description", "status", "is_recurring", "recurrence_label", "display_order")
values ('b41821b7-cd74-4a65-998d-012e47f76c54', '4e4034ab-f8f6-46dd-a458-26314edfd510', 'a9360f5f-e877-459f-9d60-13be9e872fe2', 'Quinario', 'Solemne Quinario al Santísimo Cristo del Buen Fin', 'Cinco días anteriores a la Función Principal de Instituto', 2, '2064f691-5d03-4dfc-84ed-d85f9c2e6a2c', 'Culto anual documentado por la Hermandad.', 'published', true, 'Anual', 1) on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "cult_type" = excluded."cult_type", "title" = excluded."title", "date_rule" = excluded."date_rule", "month" = excluded."month", "place_id" = excluded."place_id", "description" = excluded."description", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order";

insert into public."cult_entities" ("id", "cult_id", "entity_id", "role", "notes")
values ('ef42ce28-bfe9-4cc1-a38b-7cb9888f55df', 'b41821b7-cd74-4a65-998d-012e47f76c54', 'a9360f5f-e877-459f-9d60-13be9e872fe2', 'honoree', 'Titular al que se dedica el culto.') on conflict ("id") do update set "cult_id" = excluded."cult_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "cult_id", "scope")
values ('c3dc648f-82d7-4c0e-b64c-653da3f75911', 'b0a5f992-531d-4159-acb7-aac9a03e6fc8', 'b41821b7-cd74-4a65-998d-012e47f76c54', null) on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id", "scope" = excluded."scope";

insert into public."cults" ("id", "brotherhood_entity_id", "image_entity_id", "cult_type", "title", "date_rule", "month", "place_id", "description", "status", "is_recurring", "recurrence_label", "display_order")
values ('09182a42-e571-4364-9159-72f6605db954', '4e4034ab-f8f6-46dd-a458-26314edfd510', 'a9360f5f-e877-459f-9d60-13be9e872fe2', 'Función Principal', 'Solemne Función Principal de Instituto', 'Domingo posterior al Quinario', 3, '2064f691-5d03-4dfc-84ed-d85f9c2e6a2c', 'Culto anual documentado por la Hermandad.', 'published', true, 'Anual', 2) on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "cult_type" = excluded."cult_type", "title" = excluded."title", "date_rule" = excluded."date_rule", "month" = excluded."month", "place_id" = excluded."place_id", "description" = excluded."description", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order";

insert into public."cult_entities" ("id", "cult_id", "entity_id", "role", "notes")
values ('6e6626cb-8937-4521-af98-541ea79dce9b', '09182a42-e571-4364-9159-72f6605db954', 'a9360f5f-e877-459f-9d60-13be9e872fe2', 'honoree', 'Titular al que se dedica el culto.') on conflict ("id") do update set "cult_id" = excluded."cult_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "cult_id", "scope")
values ('050d916c-aa77-47ad-90c0-78f1d3c52a00', 'b0a5f992-531d-4159-acb7-aac9a03e6fc8', '09182a42-e571-4364-9159-72f6605db954', null) on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id", "scope" = excluded."scope";

insert into public."cults" ("id", "brotherhood_entity_id", "image_entity_id", "cult_type", "title", "date_rule", "month", "place_id", "description", "status", "is_recurring", "recurrence_label", "display_order")
values ('8983c1cb-d641-458d-8f98-337be0827e87', '4e4034ab-f8f6-46dd-a458-26314edfd510', 'a9360f5f-e877-459f-9d60-13be9e872fe2', 'Vía Crucis', 'Vía Crucis del Santísimo Cristo del Buen Fin', 'Cuaresma', 3, '2064f691-5d03-4dfc-84ed-d85f9c2e6a2c', 'Culto anual documentado por la Hermandad.', 'published', true, 'Anual', 3) on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "cult_type" = excluded."cult_type", "title" = excluded."title", "date_rule" = excluded."date_rule", "month" = excluded."month", "place_id" = excluded."place_id", "description" = excluded."description", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order";

insert into public."cult_entities" ("id", "cult_id", "entity_id", "role", "notes")
values ('77d87bf5-0e43-4a54-8d1b-6ec27c4a7ba7', '8983c1cb-d641-458d-8f98-337be0827e87', 'a9360f5f-e877-459f-9d60-13be9e872fe2', 'honoree', 'Titular al que se dedica el culto.') on conflict ("id") do update set "cult_id" = excluded."cult_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "cult_id", "scope")
values ('05e638d4-2d41-449b-bfac-9a8ec97f53b6', 'b0a5f992-531d-4159-acb7-aac9a03e6fc8', '8983c1cb-d641-458d-8f98-337be0827e87', null) on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id", "scope" = excluded."scope";

insert into public."cults" ("id", "brotherhood_entity_id", "image_entity_id", "cult_type", "title", "date_rule", "month", "place_id", "description", "status", "is_recurring", "recurrence_label", "display_order")
values ('7338ca9a-8181-4db5-8b43-23db16405bd5', '4e4034ab-f8f6-46dd-a458-26314edfd510', 'a9360f5f-e877-459f-9d60-13be9e872fe2', 'Besapié', 'Besapié al Santísimo Cristo del Buen Fin', 'Fin de semana anterior al Domingo de Ramos', 3, '2064f691-5d03-4dfc-84ed-d85f9c2e6a2c', 'Culto anual documentado por la Hermandad.', 'published', true, 'Anual', 4) on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "cult_type" = excluded."cult_type", "title" = excluded."title", "date_rule" = excluded."date_rule", "month" = excluded."month", "place_id" = excluded."place_id", "description" = excluded."description", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order";

insert into public."cult_entities" ("id", "cult_id", "entity_id", "role", "notes")
values ('8fb94289-d8aa-4aa7-825d-4e9026409021', '7338ca9a-8181-4db5-8b43-23db16405bd5', 'a9360f5f-e877-459f-9d60-13be9e872fe2', 'honoree', 'Titular al que se dedica el culto.') on conflict ("id") do update set "cult_id" = excluded."cult_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "cult_id", "scope")
values ('f54f01dd-aace-4a3f-8af5-26f1cf96427c', 'b0a5f992-531d-4159-acb7-aac9a03e6fc8', '7338ca9a-8181-4db5-8b43-23db16405bd5', null) on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id", "scope" = excluded."scope";

insert into public."cults" ("id", "brotherhood_entity_id", "image_entity_id", "cult_type", "title", "date_rule", "month", "place_id", "description", "status", "is_recurring", "recurrence_label", "display_order")
values ('0b1cc6f3-41be-4bd8-a1e3-9ef65997a60f', '4e4034ab-f8f6-46dd-a458-26314edfd510', 'edd7b5a6-4e1d-4ab3-ae6a-d5eb0d9b8fee', 'Besamanos', 'Besamanos a Nuestra Señora de la Palma Coronada', 'Fin de semana anterior al Domingo de Ramos', 3, '2064f691-5d03-4dfc-84ed-d85f9c2e6a2c', 'Culto anual documentado por la Hermandad.', 'published', true, 'Anual', 5) on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "cult_type" = excluded."cult_type", "title" = excluded."title", "date_rule" = excluded."date_rule", "month" = excluded."month", "place_id" = excluded."place_id", "description" = excluded."description", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order";

insert into public."cult_entities" ("id", "cult_id", "entity_id", "role", "notes")
values ('ca9a7321-ec35-4068-8dc4-8e0794d0543c', '0b1cc6f3-41be-4bd8-a1e3-9ef65997a60f', 'edd7b5a6-4e1d-4ab3-ae6a-d5eb0d9b8fee', 'honoree', 'Titular al que se dedica el culto.') on conflict ("id") do update set "cult_id" = excluded."cult_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "cult_id", "scope")
values ('4b36b7ea-c00e-4eb5-8e20-2c2ea49efacd', 'b0a5f992-531d-4159-acb7-aac9a03e6fc8', '0b1cc6f3-41be-4bd8-a1e3-9ef65997a60f', null) on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id", "scope" = excluded."scope";

insert into public."cults" ("id", "brotherhood_entity_id", "image_entity_id", "cult_type", "title", "date_rule", "month", "place_id", "description", "status", "is_recurring", "recurrence_label", "display_order")
values ('b5fa7fc7-3891-4512-93c4-01c88fbe40da', '4e4034ab-f8f6-46dd-a458-26314edfd510', null, 'Función', 'Solemne Función al Santo Sudario', 'Domingo de Resurrección', 4, '2064f691-5d03-4dfc-84ed-d85f9c2e6a2c', 'Culto anual documentado por la Hermandad.', 'published', true, 'Anual', 6) on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "cult_type" = excluded."cult_type", "title" = excluded."title", "date_rule" = excluded."date_rule", "month" = excluded."month", "place_id" = excluded."place_id", "description" = excluded."description", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order";

insert into public."source_links" ("id", "source_id", "cult_id", "scope")
values ('0e446859-ad1b-48bd-a814-9b408c92d093', 'b0a5f992-531d-4159-acb7-aac9a03e6fc8', 'b5fa7fc7-3891-4512-93c4-01c88fbe40da', null) on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id", "scope" = excluded."scope";

insert into public."cults" ("id", "brotherhood_entity_id", "image_entity_id", "cult_type", "title", "date_rule", "month", "place_id", "description", "status", "is_recurring", "recurrence_label", "display_order")
values ('a1edc594-2a05-4135-b179-181c19d10ea9', '4e4034ab-f8f6-46dd-a458-26314edfd510', null, 'Función', 'Función solemne al Santísimo Sacramento', 'Finales de mayo', 5, '2064f691-5d03-4dfc-84ed-d85f9c2e6a2c', 'Culto anual documentado por la Hermandad.', 'published', true, 'Anual', 7) on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "cult_type" = excluded."cult_type", "title" = excluded."title", "date_rule" = excluded."date_rule", "month" = excluded."month", "place_id" = excluded."place_id", "description" = excluded."description", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order";

insert into public."source_links" ("id", "source_id", "cult_id", "scope")
values ('21388bfc-2761-4e89-9975-984640b74fc2', 'b0a5f992-531d-4159-acb7-aac9a03e6fc8', 'a1edc594-2a05-4135-b179-181c19d10ea9', null) on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id", "scope" = excluded."scope";

insert into public."cults" ("id", "brotherhood_entity_id", "image_entity_id", "cult_type", "title", "date_rule", "month", "place_id", "description", "status", "is_recurring", "recurrence_label", "display_order")
values ('cd8ef944-2d20-4de6-b4bb-a96c62fec315', '4e4034ab-f8f6-46dd-a458-26314edfd510', null, 'Función y procesión', 'Función y procesión de San Antonio de Padua', '13 de junio', 6, '2064f691-5d03-4dfc-84ed-d85f9c2e6a2c', 'Culto anual documentado por la Hermandad.', 'published', true, 'Anual', 8) on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "cult_type" = excluded."cult_type", "title" = excluded."title", "date_rule" = excluded."date_rule", "month" = excluded."month", "place_id" = excluded."place_id", "description" = excluded."description", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order";

insert into public."source_links" ("id", "source_id", "cult_id", "scope")
values ('83587271-80d6-4dba-9e0a-b0bc79717925', 'b0a5f992-531d-4159-acb7-aac9a03e6fc8', 'cd8ef944-2d20-4de6-b4bb-a96c62fec315', null) on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id", "scope" = excluded."scope";

insert into public."cults" ("id", "brotherhood_entity_id", "image_entity_id", "cult_type", "title", "date_rule", "month", "place_id", "description", "status", "is_recurring", "recurrence_label", "display_order")
values ('ca43d060-9c54-4d14-b931-99420a1bfb09', '4e4034ab-f8f6-46dd-a458-26314edfd510', 'edd7b5a6-4e1d-4ab3-ae6a-d5eb0d9b8fee', 'Función conmemorativa', 'Función conmemorativa de la Coronación Canónica de Nuestra Señora de la Palma', '8 de octubre', 10, '2064f691-5d03-4dfc-84ed-d85f9c2e6a2c', 'Culto anual documentado por la Hermandad.', 'published', true, 'Anual', 9) on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "cult_type" = excluded."cult_type", "title" = excluded."title", "date_rule" = excluded."date_rule", "month" = excluded."month", "place_id" = excluded."place_id", "description" = excluded."description", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order";

insert into public."cult_entities" ("id", "cult_id", "entity_id", "role", "notes")
values ('d47098ad-569e-4d0f-8015-0a4d9e58e0f8', 'ca43d060-9c54-4d14-b931-99420a1bfb09', 'edd7b5a6-4e1d-4ab3-ae6a-d5eb0d9b8fee', 'honoree', 'Titular al que se dedica el culto.') on conflict ("id") do update set "cult_id" = excluded."cult_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "cult_id", "scope")
values ('31d991c7-b451-4cc9-8e21-1635addf0f6a', 'b0a5f992-531d-4159-acb7-aac9a03e6fc8', 'ca43d060-9c54-4d14-b931-99420a1bfb09', null) on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id", "scope" = excluded."scope";

insert into public."cults" ("id", "brotherhood_entity_id", "image_entity_id", "cult_type", "title", "date_rule", "month", "place_id", "description", "status", "is_recurring", "recurrence_label", "display_order")
values ('d19f3070-721a-4c84-8f0e-e4116f3db5a1', '4e4034ab-f8f6-46dd-a458-26314edfd510', 'edd7b5a6-4e1d-4ab3-ae6a-d5eb0d9b8fee', 'Triduo', 'Solemne Triduo a Nuestra Señora de la Palma Coronada', 'Finales de octubre', 10, '2064f691-5d03-4dfc-84ed-d85f9c2e6a2c', 'Culto anual documentado por la Hermandad.', 'published', true, 'Anual', 10) on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "cult_type" = excluded."cult_type", "title" = excluded."title", "date_rule" = excluded."date_rule", "month" = excluded."month", "place_id" = excluded."place_id", "description" = excluded."description", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order";

insert into public."cult_entities" ("id", "cult_id", "entity_id", "role", "notes")
values ('f1c2b4f8-83d7-4425-bc3c-4d70be09904f', 'd19f3070-721a-4c84-8f0e-e4116f3db5a1', 'edd7b5a6-4e1d-4ab3-ae6a-d5eb0d9b8fee', 'honoree', 'Titular al que se dedica el culto.') on conflict ("id") do update set "cult_id" = excluded."cult_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "cult_id", "scope")
values ('9e1e07c6-61f0-4565-9709-fbd8eca2e61d', 'b0a5f992-531d-4159-acb7-aac9a03e6fc8', 'd19f3070-721a-4c84-8f0e-e4116f3db5a1', null) on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id", "scope" = excluded."scope";

insert into public."outings" ("id", "brotherhood_entity_id", "outing_type", "character", "title", "outing_date", "year", "departure_time", "return_time", "municipality_id", "origin_place_id", "destination_text", "route_summary", "description", "event_status", "status", "slug")
values ('2b0e4465-cf02-4f51-8155-1c13a7617d2a', '4e4034ab-f8f6-46dd-a458-26314edfd510', 'Estación de Penitencia', 'ordinary', 'El Buen Fin · Estación de Penitencia 2026', '2026-04-01', 2026, '15:00', '23:30', 'ca85889c-21fe-4367-8477-a57656b25da4', '2064f691-5d03-4dfc-84ed-d85f9c2e6a2c', 'Santa Iglesia Catedral de Sevilla', 'San Vicente, Alcoy, San Lorenzo, Jesús del Gran Poder, Duque, Carrera Oficial, Postigo, Castelar, Zaragoza, Gravina, Museo y San Vicente.', 'Estación de penitencia del Miércoles Santo de 2026.', 'held', 'published', 'buen-fin-estacion-penitencia-2026') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "outing_type" = excluded."outing_type", "character" = excluded."character", "title" = excluded."title", "outing_date" = excluded."outing_date", "year" = excluded."year", "departure_time" = excluded."departure_time", "return_time" = excluded."return_time", "municipality_id" = excluded."municipality_id", "origin_place_id" = excluded."origin_place_id", "destination_text" = excluded."destination_text", "route_summary" = excluded."route_summary", "description" = excluded."description", "event_status" = excluded."event_status", "status" = excluded."status", "slug" = excluded."slug";

insert into public."outing_entities" ("id", "outing_id", "entity_id", "role", "notes")
values ('8f4d0eb1-1373-4e8f-8088-3f18d96f28dc', '2b0e4465-cf02-4f51-8155-1c13a7617d2a', 'a9360f5f-e877-459f-9d60-13be9e872fe2', 'processional_image', 'Imagen participante en la estación de penitencia de 2026.') on conflict ("id") do update set "outing_id" = excluded."outing_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."outing_entities" ("id", "outing_id", "entity_id", "role", "notes")
values ('842d1fb0-5cb2-4495-aa73-01b906996e3c', '2b0e4465-cf02-4f51-8155-1c13a7617d2a', 'edd7b5a6-4e1d-4ab3-ae6a-d5eb0d9b8fee', 'processional_image', 'Imagen participante en la estación de penitencia de 2026.') on conflict ("id") do update set "outing_id" = excluded."outing_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."outing_entities" ("id", "outing_id", "entity_id", "role", "notes")
values ('9aae9093-3965-4e0b-b14c-f09c9b478130', '2b0e4465-cf02-4f51-8155-1c13a7617d2a', 'c62cb234-0b42-45ba-b265-b1813091df1b', 'secondary_image', 'Imagen participante en la estación de penitencia de 2026.') on conflict ("id") do update set "outing_id" = excluded."outing_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."outing_entities" ("id", "outing_id", "entity_id", "role", "notes")
values ('7469cb5c-b1f5-4db0-be41-7f464641a0c3', '2b0e4465-cf02-4f51-8155-1c13a7617d2a', '623595ad-0c2e-4719-8678-9141bd27b231', 'secondary_image', 'Imagen participante en la estación de penitencia de 2026.') on conflict ("id") do update set "outing_id" = excluded."outing_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."outing_entities" ("id", "outing_id", "entity_id", "role", "notes")
values ('b70d63d0-cf6f-4d82-85a7-bbbb15054547', '2b0e4465-cf02-4f51-8155-1c13a7617d2a', '288f4882-ee90-4344-bc65-25471379feb8', 'secondary_image', 'Imagen participante en la estación de penitencia de 2026.') on conflict ("id") do update set "outing_id" = excluded."outing_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."outing_entities" ("id", "outing_id", "entity_id", "role", "notes")
values ('0979d787-ca35-4bcb-9876-2ac9397a32e9', '2b0e4465-cf02-4f51-8155-1c13a7617d2a', 'ddf14f61-7f51-4adb-b007-e34c23aa9ddd', 'secondary_image', 'Imagen participante en la estación de penitencia de 2026.') on conflict ("id") do update set "outing_id" = excluded."outing_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."accompaniments" ("id", "outing_id", "band_entity_id", "step_entity_id", "position", "year", "notes", "status")
values ('e1ea9e59-ab0f-4a38-b2de-e9f51bdd3559', '2b0e4465-cf02-4f51-8155-1c13a7617d2a', '543613d9-cae7-4430-a4c9-d3160f0fc358', 'bf05b09f-3045-4dec-aea6-31b3014e9625', 'Tras el paso de misterio', 2026, 'Acompañamiento oficial de 2026.', 'published') on conflict ("id") do update set "outing_id" = excluded."outing_id", "band_entity_id" = excluded."band_entity_id", "step_entity_id" = excluded."step_entity_id", "position" = excluded."position", "year" = excluded."year", "notes" = excluded."notes", "status" = excluded."status";

insert into public."accompaniments" ("id", "outing_id", "band_entity_id", "step_entity_id", "position", "year", "notes", "status")
values ('45d1cfbd-142a-4d58-8d94-b00c3423c7cd', '2b0e4465-cf02-4f51-8155-1c13a7617d2a', 'c1611969-501b-4c33-8153-739ef4b2d588', '21a06198-45b9-44b7-b147-984bad199a7b', 'Tras el paso de palio', 2026, 'Acompañamiento oficial de 2026.', 'published') on conflict ("id") do update set "outing_id" = excluded."outing_id", "band_entity_id" = excluded."band_entity_id", "step_entity_id" = excluded."step_entity_id", "position" = excluded."position", "year" = excluded."year", "notes" = excluded."notes", "status" = excluded."status";

insert into public."source_links" ("id", "source_id", "outing_id", "scope")
values ('682ac0ca-343f-4933-866b-cbb38e08cd6e', '471b5fbf-dc3e-4d30-897b-bcb270afaf30', '2b0e4465-cf02-4f51-8155-1c13a7617d2a', null) on conflict ("id") do update set "source_id" = excluded."source_id", "outing_id" = excluded."outing_id", "scope" = excluded."scope";

insert into public."brotherhood_habits" ("id", "brotherhood_entity_id", "name", "tunic_description", "hood_description", "cord_description", "footwear_description", "sort_order", "notes", "status")
values ('20a1f84d-8118-44a8-adc5-e5f983dc20e9', '4e4034ab-f8f6-46dd-a458-26314edfd510', 'Hábito franciscano del Buen Fin', 'Túnica marrón de cola.', 'Antifaz marrón.', 'Cíngulo blanco con tres nudos.', 'Calzado negro.', 1, 'Hábito vigente desde 1947.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "name" = excluded."name", "tunic_description" = excluded."tunic_description", "hood_description" = excluded."hood_description", "cord_description" = excluded."cord_description", "footwear_description" = excluded."footwear_description", "sort_order" = excluded."sort_order", "notes" = excluded."notes", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('985fce33-efbf-4943-88f8-cf8196ec5cc0', 'heritage_asset', 'Cruz de Guía del Buen Fin', 'cruz-guia-buen-fin-sevilla', 'Cruz de caoba maciza con apliques de plata de Seco Velasco, 1968.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."heritage_assets" ("entity_id", "parent_entity_id", "asset_type", "description", "current_condition", "is_current", "display_order", "is_featured")
values ('985fce33-efbf-4943-88f8-cf8196ec5cc0', '4e4034ab-f8f6-46dd-a458-26314edfd510', 'Insignia procesional', 'Cruz de caoba maciza con apliques de plata de Seco Velasco, 1968.', 'Conservado', true, 1, true) on conflict ("entity_id") do update set "parent_entity_id" = excluded."parent_entity_id", "asset_type" = excluded."asset_type", "description" = excluded."description", "current_condition" = excluded."current_condition", "is_current" = excluded."is_current", "display_order" = excluded."display_order", "is_featured" = excluded."is_featured";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('e7f941b7-421c-4ae9-a363-90186ec340df', '6b5440b2-004c-4ece-a9fb-dad20cf70428', '985fce33-efbf-4943-88f8-cf8196ec5cc0', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('e18146a4-bf97-4614-9fb0-2d4f630f6ba1', 'heritage_asset', 'Reproducción del Santo Sudario de Turín del Buen Fin', 'reproduccion-santo-sudario-turin-buen-fin', 'Reproducción a tamaño natural de la Síndone de Turín, donada en 1966 por Umberto de Saboya.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."heritage_assets" ("entity_id", "parent_entity_id", "asset_type", "description", "current_condition", "is_current", "display_order", "is_featured")
values ('e18146a4-bf97-4614-9fb0-2d4f630f6ba1', '4e4034ab-f8f6-46dd-a458-26314edfd510', 'Reliquia y patrimonio devocional', 'Reproducción a tamaño natural de la Síndone de Turín, donada en 1966 por Umberto de Saboya.', 'Conservado', true, 2, false) on conflict ("entity_id") do update set "parent_entity_id" = excluded."parent_entity_id", "asset_type" = excluded."asset_type", "description" = excluded."description", "current_condition" = excluded."current_condition", "is_current" = excluded."is_current", "display_order" = excluded."display_order", "is_featured" = excluded."is_featured";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('0d9889aa-de40-4ec8-b739-8c3cf2791e14', '3ab5d1a2-23ba-42e7-bb76-7e49a9a2f9b3', 'e18146a4-bf97-4614-9fb0-2d4f630f6ba1', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('74689806-b5e0-4180-89f4-f4581682b893', 'heritage_asset', 'Corona de la Coronación de Nuestra Señora de la Palma', 'corona-palma-coronada-buen-fin', 'Corona de oro de ley realizada por Orfebrería Andaluza en 2005 según diseño de Antonio Dubé de Luque.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."heritage_assets" ("entity_id", "parent_entity_id", "asset_type", "description", "current_condition", "is_current", "display_order", "is_featured")
values ('74689806-b5e0-4180-89f4-f4581682b893', '4e4034ab-f8f6-46dd-a458-26314edfd510', 'Orfebrería', 'Corona de oro de ley realizada por Orfebrería Andaluza en 2005 según diseño de Antonio Dubé de Luque.', 'Conservado', true, 3, false) on conflict ("entity_id") do update set "parent_entity_id" = excluded."parent_entity_id", "asset_type" = excluded."asset_type", "description" = excluded."description", "current_condition" = excluded."current_condition", "is_current" = excluded."is_current", "display_order" = excluded."display_order", "is_featured" = excluded."is_featured";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('a60d946e-5837-49a4-a972-9534b0e6d439', '52b90ec9-2083-43c8-92de-61c20a6504cf', '74689806-b5e0-4180-89f4-f4581682b893', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('3f33aa3b-91f3-43c8-abe7-5c1b134ad29c', 'heritage_asset', 'Manto azul de Nuestra Señora de la Palma', 'manto-azul-palma-buen-fin', 'Manto bordado por Esperanza Elena Caro según dibujo de Rafael Vallejo, restaurado en 2005.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."heritage_assets" ("entity_id", "parent_entity_id", "asset_type", "description", "current_condition", "is_current", "display_order", "is_featured")
values ('3f33aa3b-91f3-43c8-abe7-5c1b134ad29c', '4e4034ab-f8f6-46dd-a458-26314edfd510', 'Bordado procesional', 'Manto bordado por Esperanza Elena Caro según dibujo de Rafael Vallejo, restaurado en 2005.', 'Conservado', true, 4, false) on conflict ("entity_id") do update set "parent_entity_id" = excluded."parent_entity_id", "asset_type" = excluded."asset_type", "description" = excluded."description", "current_condition" = excluded."current_condition", "is_current" = excluded."is_current", "display_order" = excluded."display_order", "is_featured" = excluded."is_featured";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('3c6bb68a-724e-49fe-8f8a-d68b3471902d', '6b5440b2-004c-4ece-a9fb-dad20cf70428', '3f33aa3b-91f3-43c8-abe7-5c1b134ad29c', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('bed47b11-f579-4c46-b963-283cec768266', 'heritage_asset', 'Conjunto de palio de Nuestra Señora de la Palma', 'conjunto-palio-palma-buen-fin', 'Conjunto neorrenacentista diseñado por Ignacio Gómez Millán y estrenado en 1930.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."heritage_assets" ("entity_id", "parent_entity_id", "asset_type", "description", "current_condition", "is_current", "display_order", "is_featured")
values ('bed47b11-f579-4c46-b963-283cec768266', '4e4034ab-f8f6-46dd-a458-26314edfd510', 'Paso procesional', 'Conjunto neorrenacentista diseñado por Ignacio Gómez Millán y estrenado en 1930.', 'Conservado', true, 5, false) on conflict ("entity_id") do update set "parent_entity_id" = excluded."parent_entity_id", "asset_type" = excluded."asset_type", "description" = excluded."description", "current_condition" = excluded."current_condition", "is_current" = excluded."is_current", "display_order" = excluded."display_order", "is_featured" = excluded."is_featured";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('00abfb9d-22b6-4c86-bc6d-24e2633efd0b', '6b5440b2-004c-4ece-a9fb-dad20cf70428', 'bed47b11-f579-4c46-b963-283cec768266', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('56182089-fa07-46d5-96df-7fcfd138fd2f', 'event', 'Fundación de la Hermandad del Buen Fin', 'fundacion-hermandad-buen-fin-1590', 'El gremio de curtidores fundó la Hermandad en San Juan de la Palma; sus Reglas fueron aprobadas en 1593.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."events" ("entity_id", "event_type", "event_date_text", "place_id", "description", "event_category", "brotherhood_entity_id", "municipality_id", "event_status")
values ('56182089-fa07-46d5-96df-7fcfd138fd2f', 'Hito histórico', '1590–1593', null, 'El gremio de curtidores fundó la Hermandad en San Juan de la Palma; sus Reglas fueron aprobadas en 1593.', 'historical', '4e4034ab-f8f6-46dd-a458-26314edfd510', 'ca85889c-21fe-4367-8477-a57656b25da4', 'held') on conflict ("entity_id") do update set "event_type" = excluded."event_type", "event_date_text" = excluded."event_date_text", "place_id" = excluded."place_id", "description" = excluded."description", "event_category" = excluded."event_category", "brotherhood_entity_id" = excluded."brotherhood_entity_id", "municipality_id" = excluded."municipality_id", "event_status" = excluded."event_status";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('9544dd7b-598a-405f-84b1-b6e0342b3517', 'e8a5d380-d04f-4aa5-bbc4-852426004298', '56182089-fa07-46d5-96df-7fcfd138fd2f', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('7e22aa13-b682-4ee2-bb7d-6fd7cc973581', 'event', 'Traslado del Buen Fin a San Antonio de Padua', 'traslado-buen-fin-san-antonio-padua-1605', 'La corporación se trasladó al convento franciscano de San Antonio de Padua.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."events" ("entity_id", "event_type", "event_date_text", "place_id", "description", "event_category", "brotherhood_entity_id", "municipality_id", "event_status")
values ('7e22aa13-b682-4ee2-bb7d-6fd7cc973581', 'Hito histórico', '19 de marzo de 1605', '2064f691-5d03-4dfc-84ed-d85f9c2e6a2c', 'La corporación se trasladó al convento franciscano de San Antonio de Padua.', 'historical', '4e4034ab-f8f6-46dd-a458-26314edfd510', 'ca85889c-21fe-4367-8477-a57656b25da4', 'held') on conflict ("entity_id") do update set "event_type" = excluded."event_type", "event_date_text" = excluded."event_date_text", "place_id" = excluded."place_id", "description" = excluded."description", "event_category" = excluded."event_category", "brotherhood_entity_id" = excluded."brotherhood_entity_id", "municipality_id" = excluded."municipality_id", "event_status" = excluded."event_status";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('bdcb04fd-2c65-4a83-b5b9-75d45e96846c', 'e8a5d380-d04f-4aa5-bbc4-852426004298', '7e22aa13-b682-4ee2-bb7d-6fd7cc973581', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('157b08cf-83de-43ea-b6a4-7f593025e579', 'event', 'Regreso de Nuestra Señora de la Palma al paso de palio', 'regreso-palma-palio-1930', 'Nuestra Señora de la Palma volvió a procesionar bajo palio con un conjunto estrenado ese año.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."events" ("entity_id", "event_type", "event_date_text", "place_id", "description", "event_category", "brotherhood_entity_id", "municipality_id", "event_status")
values ('157b08cf-83de-43ea-b6a4-7f593025e579', 'Hito histórico', '1930', null, 'Nuestra Señora de la Palma volvió a procesionar bajo palio con un conjunto estrenado ese año.', 'historical', '4e4034ab-f8f6-46dd-a458-26314edfd510', 'ca85889c-21fe-4367-8477-a57656b25da4', 'held') on conflict ("entity_id") do update set "event_type" = excluded."event_type", "event_date_text" = excluded."event_date_text", "place_id" = excluded."place_id", "description" = excluded."description", "event_category" = excluded."event_category", "brotherhood_entity_id" = excluded."brotherhood_entity_id", "municipality_id" = excluded."municipality_id", "event_status" = excluded."event_status";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('eaad029f-7ea9-4659-bb48-d02ee7aaffe8', '3ab5d1a2-23ba-42e7-bb76-7e49a9a2f9b3', '157b08cf-83de-43ea-b6a4-7f593025e579', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('0e75cada-dbc8-4f06-8ee2-da68b0504a55', 'event', 'Inauguración del Centro de Estimulación Precoz Cristo del Buen Fin', 'centro-estimulacion-precoz-buen-fin-1983', 'La Hermandad inauguró su centro asistencial de estimulación precoz.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."events" ("entity_id", "event_type", "event_date_text", "place_id", "description", "event_category", "brotherhood_entity_id", "municipality_id", "event_status")
values ('0e75cada-dbc8-4f06-8ee2-da68b0504a55', 'Hito histórico', '1983', null, 'La Hermandad inauguró su centro asistencial de estimulación precoz.', 'historical', '4e4034ab-f8f6-46dd-a458-26314edfd510', 'ca85889c-21fe-4367-8477-a57656b25da4', 'held') on conflict ("entity_id") do update set "event_type" = excluded."event_type", "event_date_text" = excluded."event_date_text", "place_id" = excluded."place_id", "description" = excluded."description", "event_category" = excluded."event_category", "brotherhood_entity_id" = excluded."brotherhood_entity_id", "municipality_id" = excluded."municipality_id", "event_status" = excluded."event_status";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('18c47eb9-dce2-41ab-ae9e-787cebe90397', '3ab5d1a2-23ba-42e7-bb76-7e49a9a2f9b3', '0e75cada-dbc8-4f06-8ee2-da68b0504a55', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('320bc706-d3ef-444c-9cf9-82642445b0be', 'event', 'Coronación canónica de Nuestra Señora de la Palma', 'coronacion-canonica-palma-buen-fin-2005', 'Nuestra Señora de la Palma fue coronada canónicamente por el cardenal Carlos Amigo Vallejo.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."events" ("entity_id", "event_type", "event_date_text", "place_id", "description", "event_category", "brotherhood_entity_id", "municipality_id", "event_status")
values ('320bc706-d3ef-444c-9cf9-82642445b0be', 'Hito histórico', '8 de octubre de 2005', null, 'Nuestra Señora de la Palma fue coronada canónicamente por el cardenal Carlos Amigo Vallejo.', 'historical', '4e4034ab-f8f6-46dd-a458-26314edfd510', 'ca85889c-21fe-4367-8477-a57656b25da4', 'held') on conflict ("entity_id") do update set "event_type" = excluded."event_type", "event_date_text" = excluded."event_date_text", "place_id" = excluded."place_id", "description" = excluded."description", "event_category" = excluded."event_category", "brotherhood_entity_id" = excluded."brotherhood_entity_id", "municipality_id" = excluded."municipality_id", "event_status" = excluded."event_status";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('e3c56479-13eb-4cca-b9ee-adbe21db9fb2', '3ab5d1a2-23ba-42e7-bb76-7e49a9a2f9b3', '320bc706-d3ef-444c-9cf9-82642445b0be', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('ae4fd976-8520-46f0-aa8d-5e226985eb1e', 'event', 'Vía Crucis del Consejo presidido por el Cristo del Buen Fin', 'via-crucis-consejo-cristo-buen-fin-2008', 'El Santísimo Cristo del Buen Fin presidió el Vía Crucis de las Hermandades bajo el lema por enfermos y personas con discapacidad.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."events" ("entity_id", "event_type", "event_date_text", "place_id", "description", "event_category", "brotherhood_entity_id", "municipality_id", "event_status")
values ('ae4fd976-8520-46f0-aa8d-5e226985eb1e', 'Hito histórico', '11 de febrero de 2008', null, 'El Santísimo Cristo del Buen Fin presidió el Vía Crucis de las Hermandades bajo el lema por enfermos y personas con discapacidad.', 'historical', '4e4034ab-f8f6-46dd-a458-26314edfd510', 'ca85889c-21fe-4367-8477-a57656b25da4', 'held') on conflict ("entity_id") do update set "event_type" = excluded."event_type", "event_date_text" = excluded."event_date_text", "place_id" = excluded."place_id", "description" = excluded."description", "event_category" = excluded."event_category", "brotherhood_entity_id" = excluded."brotherhood_entity_id", "municipality_id" = excluded."municipality_id", "event_status" = excluded."event_status";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('514ce6fb-892f-4b0c-b0c5-56c375618057', '3ab5d1a2-23ba-42e7-bb76-7e49a9a2f9b3', 'ae4fd976-8520-46f0-aa8d-5e226985eb1e', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('7370d29f-d61e-4086-8ac6-93fbd12812cb', 'event', 'Recuperación del misterio del Buen Fin', 'recuperacion-misterio-buen-fin-2024', 'La Hermandad recuperó la escena del permiso para el descendimiento con cuatro figuras de Darío Fernández.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."events" ("entity_id", "event_type", "event_date_text", "place_id", "description", "event_category", "brotherhood_entity_id", "municipality_id", "event_status")
values ('7370d29f-d61e-4086-8ac6-93fbd12812cb', 'Hito histórico', '2024', null, 'La Hermandad recuperó la escena del permiso para el descendimiento con cuatro figuras de Darío Fernández.', 'historical', '4e4034ab-f8f6-46dd-a458-26314edfd510', 'ca85889c-21fe-4367-8477-a57656b25da4', 'held') on conflict ("entity_id") do update set "event_type" = excluded."event_type", "event_date_text" = excluded."event_date_text", "place_id" = excluded."place_id", "description" = excluded."description", "event_category" = excluded."event_category", "brotherhood_entity_id" = excluded."brotherhood_entity_id", "municipality_id" = excluded."municipality_id", "event_status" = excluded."event_status";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('a5b9e8ff-1235-4ce3-bb31-a7b9521cdd35', '0e354126-ff12-47ef-b41c-7b2d199de047', '7370d29f-d61e-4086-8ac6-93fbd12812cb', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."music_accompaniment_periods" ("id", "brotherhood_entity_id", "band_entity_id", "step_entity_id", "position", "outing_type", "date_from_text", "year_from", "is_current", "notes", "public_brotherhood_name", "public_step_name", "public_brotherhood_slug", "public_municipality_name", "public_municipality_slug", "public_province", "status")
values ('c83decb2-cd98-494b-9a07-69c4043627b7', '4e4034ab-f8f6-46dd-a458-26314edfd510', '543613d9-cae7-4430-a4c9-d3160f0fc358', 'bf05b09f-3045-4dec-aea6-31b3014e9625', 'Tras el paso de misterio', 'Miércoles Santo', 'Vinculación desde comienzos de la década de 1990', null, true, 'La renovación documentada mantiene el vínculo en 2025 y 2026.', 'Hermandad del Buen Fin', 'Santísimo Cristo del Buen Fin', 'hermandad-buen-fin-sevilla', 'Sevilla', 'sevilla', 'Sevilla', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "band_entity_id" = excluded."band_entity_id", "step_entity_id" = excluded."step_entity_id", "position" = excluded."position", "outing_type" = excluded."outing_type", "date_from_text" = excluded."date_from_text", "year_from" = excluded."year_from", "is_current" = excluded."is_current", "notes" = excluded."notes", "public_brotherhood_name" = excluded."public_brotherhood_name", "public_step_name" = excluded."public_step_name", "public_brotherhood_slug" = excluded."public_brotherhood_slug", "public_municipality_name" = excluded."public_municipality_name", "public_municipality_slug" = excluded."public_municipality_slug", "public_province" = excluded."public_province", "status" = excluded."status";

insert into public."music_accompaniment_periods" ("id", "brotherhood_entity_id", "band_entity_id", "step_entity_id", "position", "outing_type", "date_from_text", "year_from", "is_current", "notes", "public_brotherhood_name", "public_step_name", "public_brotherhood_slug", "public_municipality_name", "public_municipality_slug", "public_province", "status")
values ('7de9cc32-9f0a-49ff-8965-f13f818c2846', '4e4034ab-f8f6-46dd-a458-26314edfd510', 'c1611969-501b-4c33-8153-739ef4b2d588', '21a06198-45b9-44b7-b147-984bad199a7b', 'Tras el paso de palio', 'Miércoles Santo', 'Desde 1991', 1991, true, 'Acompañamiento vigente en 2026.', 'Hermandad del Buen Fin', 'Nuestra Señora de la Palma Coronada', 'hermandad-buen-fin-sevilla', 'Sevilla', 'sevilla', 'Sevilla', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "band_entity_id" = excluded."band_entity_id", "step_entity_id" = excluded."step_entity_id", "position" = excluded."position", "outing_type" = excluded."outing_type", "date_from_text" = excluded."date_from_text", "year_from" = excluded."year_from", "is_current" = excluded."is_current", "notes" = excluded."notes", "public_brotherhood_name" = excluded."public_brotherhood_name", "public_step_name" = excluded."public_step_name", "public_brotherhood_slug" = excluded."public_brotherhood_slug", "public_municipality_name" = excluded."public_municipality_name", "public_municipality_slug" = excluded."public_municipality_slug", "public_province" = excluded."public_province", "status" = excluded."status";

insert into public."music_accompaniment_periods" ("id", "brotherhood_entity_id", "band_entity_id", "step_entity_id", "position", "outing_type", "date_from_text", "year_from", "is_current", "notes", "public_brotherhood_name", "public_step_name", "public_brotherhood_slug", "public_municipality_name", "public_municipality_slug", "public_province", "status")
values ('cc8f78ed-ab78-4926-b15f-ca5d6e0dc7d3', '4e4034ab-f8f6-46dd-a458-26314edfd510', '543613d9-cae7-4430-a4c9-d3160f0fc358', null, 'Cruz de Guía · sección juvenil', 'Miércoles Santo', 'Desde 2023', 2023, true, 'La sección juvenil abre el cortejo.', 'Hermandad del Buen Fin', 'Cruz de Guía', 'hermandad-buen-fin-sevilla', 'Sevilla', 'sevilla', 'Sevilla', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "band_entity_id" = excluded."band_entity_id", "step_entity_id" = excluded."step_entity_id", "position" = excluded."position", "outing_type" = excluded."outing_type", "date_from_text" = excluded."date_from_text", "year_from" = excluded."year_from", "is_current" = excluded."is_current", "notes" = excluded."notes", "public_brotherhood_name" = excluded."public_brotherhood_name", "public_step_name" = excluded."public_step_name", "public_brotherhood_slug" = excluded."public_brotherhood_slug", "public_municipality_name" = excluded."public_municipality_name", "public_municipality_slug" = excluded."public_municipality_slug", "public_province" = excluded."public_province", "status" = excluded."status";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('fbc6e808-8b62-45aa-8974-56ddacc994bd', '3280aafd-b9dd-4cc7-a288-fd9daf1b88d9', '4e4034ab-f8f6-46dd-a458-26314edfd510', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('c59d8086-07e0-48ca-943b-fdcbce5a3033', 'e8a5d380-d04f-4aa5-bbc4-852426004298', '4e4034ab-f8f6-46dd-a458-26314edfd510', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('ede88362-dd4a-4582-9e5e-53491f669abe', '3ab5d1a2-23ba-42e7-bb76-7e49a9a2f9b3', '4e4034ab-f8f6-46dd-a458-26314edfd510', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('05f779a2-4348-4775-9fe9-26799b97e1f9', 'eab8c447-e1d5-4e2c-a4db-4aa11bfa4c16', '4e4034ab-f8f6-46dd-a458-26314edfd510', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('e68ee534-e856-4288-a8b1-696f4a22e927', '52b90ec9-2083-43c8-92de-61c20a6504cf', '4e4034ab-f8f6-46dd-a458-26314edfd510', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('41e46e61-3971-47b0-9072-b569fe4bb010', 'b0a5f992-531d-4159-acb7-aac9a03e6fc8', '4e4034ab-f8f6-46dd-a458-26314edfd510', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('63217a06-1d5c-4077-87e1-2edc11cc8ca7', '39e67857-e435-4e94-abd7-84f27d71ba71', '4e4034ab-f8f6-46dd-a458-26314edfd510', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('c028e527-fd30-40a6-ba93-4849ea4b5b96', '6b5440b2-004c-4ece-a9fb-dad20cf70428', '4e4034ab-f8f6-46dd-a458-26314edfd510', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('52b59dfa-7bae-41b0-a693-7671306901cc', '471b5fbf-dc3e-4d30-897b-bcb270afaf30', '4e4034ab-f8f6-46dd-a458-26314edfd510', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('bdb20a47-d776-4430-8abe-80db5a41640d', 'd306c693-e858-4fea-be43-c42d7f3b64c9', '4e4034ab-f8f6-46dd-a458-26314edfd510', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('258dce25-4f1e-4e9b-8830-bd7a5f00ecb5', '0e354126-ff12-47ef-b41c-7b2d199de047', '4e4034ab-f8f6-46dd-a458-26314edfd510', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('f3e66f85-6fab-4cf9-b3a6-3a94c1ecad48', '17d897a3-1037-45b5-9030-ff4a5f648ca3', '4e4034ab-f8f6-46dd-a458-26314edfd510', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('fbfadf31-b596-4ac5-9c3a-c3f07bace404', 'de96e1a7-b054-4a51-a58b-cfb44e0c6d7f', '4e4034ab-f8f6-46dd-a458-26314edfd510', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('ec8247d5-7d76-4cd9-8220-d99c47310ad8', 'eab8c447-e1d5-4e2c-a4db-4aa11bfa4c16', 'a9360f5f-e877-459f-9d60-13be9e872fe2', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('954acfd3-aaaf-4c0e-9955-5663c2f2e9ad', '52b90ec9-2083-43c8-92de-61c20a6504cf', 'edd7b5a6-4e1d-4ab3-ae6a-d5eb0d9b8fee', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('f435d4d7-d25c-486c-9564-2f4472eca22b', '0e354126-ff12-47ef-b41c-7b2d199de047', 'c62cb234-0b42-45ba-b265-b1813091df1b', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('3fb6e04c-4438-47bf-8c63-4776c68d16ca', '0e354126-ff12-47ef-b41c-7b2d199de047', '623595ad-0c2e-4719-8678-9141bd27b231', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('688f67d7-966c-4f50-9efb-fe7e48c7d866', '0e354126-ff12-47ef-b41c-7b2d199de047', '288f4882-ee90-4344-bc65-25471379feb8', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('2f19e583-22eb-4831-8664-a4edf2a1f0a7', '0e354126-ff12-47ef-b41c-7b2d199de047', 'ddf14f61-7f51-4adb-b007-e34c23aa9ddd', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('03288d43-7993-422f-a1b0-0410d3b39a1e', '0e354126-ff12-47ef-b41c-7b2d199de047', 'bf05b09f-3045-4dec-aea6-31b3014e9625', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('0036002a-2322-4dde-847c-3881d25d27d4', '6b5440b2-004c-4ece-a9fb-dad20cf70428', '21a06198-45b9-44b7-b147-984bad199a7b', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "music_accompaniment_period_id", "scope")
values ('173e062f-bed3-45aa-b444-2b4b4cca156f', '17d897a3-1037-45b5-9030-ff4a5f648ca3', 'c83decb2-cd98-494b-9a07-69c4043627b7', null) on conflict ("id") do update set "source_id" = excluded."source_id", "music_accompaniment_period_id" = excluded."music_accompaniment_period_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "music_accompaniment_period_id", "scope")
values ('b4d0a2f3-6a6d-4ecc-bddd-fcf6c59ed3ce', '471b5fbf-dc3e-4d30-897b-bcb270afaf30', '7de9cc32-9f0a-49ff-8965-f13f818c2846', null) on conflict ("id") do update set "source_id" = excluded."source_id", "music_accompaniment_period_id" = excluded."music_accompaniment_period_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "music_accompaniment_period_id", "scope")
values ('ff0e1264-5c8f-467e-bdaf-5c4c6c2f9cea', 'de96e1a7-b054-4a51-a58b-cfb44e0c6d7f', 'cc8f78ed-ab78-4926-b15f-ca5d6e0dc7d3', null) on conflict ("id") do update set "source_id" = excluded."source_id", "music_accompaniment_period_id" = excluded."music_accompaniment_period_id", "scope" = excluded."scope";

commit;
