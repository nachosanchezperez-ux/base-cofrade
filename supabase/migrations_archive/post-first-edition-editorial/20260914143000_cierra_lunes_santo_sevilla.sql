-- HC-016 · macrolote transversal: Lunes Santo de Sevilla
-- Redención, Santa Genoveva, Santa Marta y Vera+Cruz; cinco cierres previos se preservan.
-- Solo DML. Receta idempotente archivada fuera de la cadena estructural activa.
-- Apply principal c0160014-0000-4000-8000-000000000001: 307/307 (299 insert, 8 update).
-- Remate relacional c0160014-1000-4000-8000-000000000001: 1/1 insert.
-- Remate documental c0160014-2000-4000-8000-000000000001: 1/1 update.
-- Receta final: 308 filas; ejecución gobernada: 309/309 operaciones; 0 invalid, 0 failed.

begin;

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('9666f211-0155-4435-878f-899f8ccabb6e', 'Nómina de las cofradías de la Semana Santa de Sevilla 2026', 'https://www.hermandades-de-sevilla.org/consejo/nomina-de-las-cofradias-de-la-semana-santa-de-sevilla-2026/', 'web', 'Consejo General de Hermandades y Cofradías de Sevilla', '2026-09-14', 'Nómina oficial y jornada del Lunes Santo de 2026.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('b4421965-8ac3-4300-8ed6-386a71b5ad57', 'Web oficial · Hermandad de la Redención', 'https://hermandadredencion.com/', 'web', 'Hermandad de la Redención', '2026-09-14', 'Identidad, sede, titulares, cultos y actualidad oficial.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('71019959-30b3-44b0-a8ed-87efd0e54a93', 'Historia · Hermandad de la Redención', 'https://hermandadredencion.com/desde-los-inicios-de-la-hermandad-hasta-el-presente-milenio/', 'web', 'Hermandad de la Redención', '2026-09-14', 'Fundación, primeras estaciones y principales hitos históricos.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('6c4afef9-a1ce-42fb-ab27-a83cc1d15c13', 'Nuestro Padre Jesús de la Redención', 'https://hermandadredencion.com/nuestro-padre-jesus-de-la-redencion-en-el-beso-de-judas-2/', 'web', 'Hermandad de la Redención', '2026-09-14', 'Autoría, datación, iconografía e hitos del Señor.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('4b76cc82-fe55-4034-b979-e0860c39fb78', 'María Santísima del Rocío Coronada', 'https://hermandadredencion.com/maria-santisima-del-rocio/', 'web', 'Hermandad de la Redención', '2026-09-14', 'Autoría, conservación y coronación canónica.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('8741d5e1-3a50-4038-8e9c-c543389f2bec', 'Cultos · Hermandad de la Redención', 'https://hermandadredencion.com/cultos/', 'web', 'Hermandad de la Redención', '2026-09-14', 'Cultos anuales de la corporación.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('f4d8b895-5b71-42ef-8348-419a538d4645', 'Iglesia de Santiago el Mayor · sede canónica', 'https://hermandadredencion.com/sede-canonica/', 'web', 'Hermandad de la Redención', '2026-09-14', 'Sede canónica y patrimonio del templo.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('9a4f75e5-16c4-414c-ad4f-6d4afeca5103', 'brotherhood', 'Hermandad de la Redención', 'hermandad-de-la-redencion', 'Hermandad sacramental y de penitencia de Santiago que representa el Beso de Judas.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."brotherhoods" ("entity_id", "official_name", "popular_name", "foundation_text", "municipality_id", "canonical_see_place_id", "neighborhood", "website_url", "brotherhood_types", "current_procession_day", "history_text", "notes")
values ('9a4f75e5-16c4-414c-ad4f-6d4afeca5103', 'Real e Ilustre Hermandad del Santísimo Sacramento y Cofradía de Nazarenos de Nuestro Padre Jesús de la Redención en el Beso de Judas, María Santísima del Rocío Coronada, Nuestra Señora del Carmen, San Fernando Rey y San Lucas Evangelista', 'La Redención', '1955', 'ca85889c-21fe-4367-8477-a57656b25da4', 'b256efc9-c656-4401-bcd5-baddb6dc68f3', 'Santa Catalina–Santiago', 'https://hermandadredencion.com/', ARRAY['Penitencia', 'Sacramental']::text[], 'Lunes Santo', 'Fundada en 1955 en Santa María la Blanca, pasó por la Misericordia y se estableció en Santiago. Realizó su primera estación propia en 1959 y se fusionó con la Sacramental de Santiago en 1983.', 'Sin fotografías nuevas mientras no conste licencia reutilizable.') on conflict ("entity_id") do update set "official_name" = excluded."official_name", "popular_name" = excluded."popular_name", "foundation_text" = excluded."foundation_text", "municipality_id" = excluded."municipality_id", "canonical_see_place_id" = excluded."canonical_see_place_id", "neighborhood" = excluded."neighborhood", "website_url" = excluded."website_url", "brotherhood_types" = excluded."brotherhood_types", "current_procession_day" = excluded."current_procession_day", "history_text" = excluded."history_text", "notes" = excluded."notes";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('e88ddb32-082b-4c8f-9f78-6fb08031e2f4', 'image', 'Nuestro Padre Jesús de la Redención en el Beso de Judas', 'nuestro-padre-jesus-redencion-beso-judas', 'Titular cristífero de Antonio Castillo Lastrucci, bendecido en 1958.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."images" ("entity_id", "image_type", "execution_date_text", "current_condition", "description", "is_dress_image")
values ('e88ddb32-082b-4c8f-9f78-6fb08031e2f4', 'Cristo de vestir', '1958', 'extant', 'Representa el instante posterior al beso de Judas en Getsemaní.', true) on conflict ("entity_id") do update set "image_type" = excluded."image_type", "execution_date_text" = excluded."execution_date_text", "current_condition" = excluded."current_condition", "description" = excluded."description", "is_dress_image" = excluded."is_dress_image";

insert into public."brotherhood_images" ("id", "brotherhood_entity_id", "image_entity_id", "relation_type", "notes", "status")
values ('d21fd631-f269-48d9-bb88-a6c6772cc27d', '9a4f75e5-16c4-414c-ad4f-6d4afeca5103', 'e88ddb32-082b-4c8f-9f78-6fb08031e2f4', 'titular', 'Titular vigente documentado.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_authorships" ("id", "image_entity_id", "agent_entity_id", "authorship_type", "role_name", "date_from_text", "certainty", "notes", "status")
values ('c1aa7565-0a3f-47f3-92ce-fb9110b376a7', 'e88ddb32-082b-4c8f-9f78-6fb08031e2f4', '8e92fc51-a98f-4f75-8f41-33b308d6907e', 'author', 'escultor', '1958', 'documented', 'Autoría documentada.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "agent_entity_id" = excluded."agent_entity_id", "authorship_type" = excluded."authorship_type", "role_name" = excluded."role_name", "date_from_text" = excluded."date_from_text", "certainty" = excluded."certainty", "notes" = excluded."notes", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('9b01a290-6985-43f6-bf78-3991ad81eaec', 'image', 'María Santísima del Rocío Coronada', 'maria-santisima-rocio-coronada-redencion', 'Dolorosa de Antonio Castillo Lastrucci, realizada en 1955 y coronada canónicamente en 2025.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."images" ("entity_id", "image_type", "execution_date_text", "current_condition", "description", "is_dress_image")
values ('9b01a290-6985-43f6-bf78-3991ad81eaec', 'Dolorosa de vestir', '1955', 'extant', 'Dolorosa de candelero de madera de pino, coronada canónicamente el 5 de julio de 2025.', true) on conflict ("entity_id") do update set "image_type" = excluded."image_type", "execution_date_text" = excluded."execution_date_text", "current_condition" = excluded."current_condition", "description" = excluded."description", "is_dress_image" = excluded."is_dress_image";

insert into public."brotherhood_images" ("id", "brotherhood_entity_id", "image_entity_id", "relation_type", "notes", "status")
values ('fa668b54-9aea-492f-8876-d67f3227781f', '9a4f75e5-16c4-414c-ad4f-6d4afeca5103', '9b01a290-6985-43f6-bf78-3991ad81eaec', 'titular', 'Titular vigente documentado.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_authorships" ("id", "image_entity_id", "agent_entity_id", "authorship_type", "role_name", "date_from_text", "certainty", "notes", "status")
values ('5f36e23c-bf6b-4add-95b8-c381528a4b98', '9b01a290-6985-43f6-bf78-3991ad81eaec', '8e92fc51-a98f-4f75-8f41-33b308d6907e', 'author', 'escultor', '1955', 'documented', 'Autoría documentada.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "agent_entity_id" = excluded."agent_entity_id", "authorship_type" = excluded."authorship_type", "role_name" = excluded."role_name", "date_from_text" = excluded."date_from_text", "certainty" = excluded."certainty", "notes" = excluded."notes", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('421c3ee8-4b3a-44d0-ba6f-3872bd68707d', 'step', 'Paso de misterio del Beso de Judas', 'paso-misterio-beso-judas-redencion-sevilla', 'Misterio de la entrega de Cristo en Getsemaní.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."steps" ("entity_id", "step_type", "current_condition", "execution_date_text", "description")
values ('421c3ee8-4b3a-44d0-ba6f-3872bd68707d', 'Misterio', 'preserved', null, 'Conjunto procesional del Beso de Judas, con el Señor como figura principal.') on conflict ("entity_id") do update set "step_type" = excluded."step_type", "current_condition" = excluded."current_condition", "execution_date_text" = excluded."execution_date_text", "description" = excluded."description";

insert into public."brotherhood_steps" ("id", "brotherhood_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('5c5f8e2a-38dd-4660-9232-5b2a807c327f', '9a4f75e5-16c4-414c-ad4f-6d4afeca5103', '421c3ee8-4b3a-44d0-ba6f-3872bd68707d', 'current', 'Paso procesional vigente.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_steps" ("id", "image_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('0f80646a-f0cf-4ff4-baa8-7e8bc93bd4a5', 'e88ddb32-082b-4c8f-9f78-6fb08031e2f4', '421c3ee8-4b3a-44d0-ba6f-3872bd68707d', 'processional', 'Imagen principal del paso.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('c22737ee-d3d4-4cc2-9fb7-777e332f8827', 'step', 'Paso de palio de María Santísima del Rocío Coronada', 'paso-palio-rocio-coronada-redencion', 'Paso de palio de María Santísima del Rocío Coronada.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."steps" ("entity_id", "step_type", "current_condition", "execution_date_text", "description")
values ('c22737ee-d3d4-4cc2-9fb7-777e332f8827', 'Palio', 'preserved', null, 'Paso de palio de la titular mariana de la Redención.') on conflict ("entity_id") do update set "step_type" = excluded."step_type", "current_condition" = excluded."current_condition", "execution_date_text" = excluded."execution_date_text", "description" = excluded."description";

insert into public."brotherhood_steps" ("id", "brotherhood_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('ceca2c43-bc12-4fa4-850b-f7bfc13d2d93', '9a4f75e5-16c4-414c-ad4f-6d4afeca5103', 'c22737ee-d3d4-4cc2-9fb7-777e332f8827', 'current', 'Paso procesional vigente.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_steps" ("id", "image_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('ce43a75d-002b-410d-b795-d7060acec4ac', '9b01a290-6985-43f6-bf78-3991ad81eaec', 'c22737ee-d3d4-4cc2-9fb7-777e332f8827', 'processional', 'Imagen principal del paso.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."cults" ("id", "brotherhood_entity_id", "image_entity_id", "place_id", "status", "is_recurring", "cult_type", "title", "month", "date_rule", "recurrence_label", "display_order", "description")
values ('247ceb5f-ed19-4518-b818-90b6c1736d52', '9a4f75e5-16c4-414c-ad4f-6d4afeca5103', 'e88ddb32-082b-4c8f-9f78-6fb08031e2f4', 'b256efc9-c656-4401-bcd5-baddb6dc68f3', 'published', true, 'Quinario', 'Solemne Quinario a Nuestro Padre Jesús de la Redención', null, 'Cuaresma', 'Anual', 1, 'Culto anual documentado por la corporación.') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "place_id" = excluded."place_id", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "cult_type" = excluded."cult_type", "title" = excluded."title", "month" = excluded."month", "date_rule" = excluded."date_rule", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order", "description" = excluded."description";

insert into public."cult_entities" ("id", "cult_id", "entity_id", "role", "notes")
values ('f025b48a-62e3-4c16-bba9-b27e4214acaa', '247ceb5f-ed19-4518-b818-90b6c1736d52', 'e88ddb32-082b-4c8f-9f78-6fb08031e2f4', 'honoree', 'Titular al que se dedica el culto.') on conflict ("id") do update set "cult_id" = excluded."cult_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "cult_id")
values ('4f5fd144-6c9f-4372-8f98-7fb0645f9d9a', '8741d5e1-3a50-4038-8e9c-c543389f2bec', '247ceb5f-ed19-4518-b818-90b6c1736d52') on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id";

insert into public."cults" ("id", "brotherhood_entity_id", "image_entity_id", "place_id", "status", "is_recurring", "cult_type", "title", "month", "date_rule", "recurrence_label", "display_order", "description")
values ('b19cfe26-4313-469a-97bb-aafd0ec49fd4', '9a4f75e5-16c4-414c-ad4f-6d4afeca5103', 'e88ddb32-082b-4c8f-9f78-6fb08031e2f4', 'b256efc9-c656-4401-bcd5-baddb6dc68f3', 'published', true, 'Función Principal', 'Función Principal de Instituto', null, 'Domingo posterior al Quinario', 'Anual', 2, 'Culto anual documentado por la corporación.') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "place_id" = excluded."place_id", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "cult_type" = excluded."cult_type", "title" = excluded."title", "month" = excluded."month", "date_rule" = excluded."date_rule", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order", "description" = excluded."description";

insert into public."cult_entities" ("id", "cult_id", "entity_id", "role", "notes")
values ('2d232c90-1299-4d72-bafc-bd2d396326e1', 'b19cfe26-4313-469a-97bb-aafd0ec49fd4', 'e88ddb32-082b-4c8f-9f78-6fb08031e2f4', 'honoree', 'Titular al que se dedica el culto.') on conflict ("id") do update set "cult_id" = excluded."cult_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "cult_id")
values ('409da237-5424-416e-a859-557e185f1724', '8741d5e1-3a50-4038-8e9c-c543389f2bec', 'b19cfe26-4313-469a-97bb-aafd0ec49fd4') on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id";

insert into public."cults" ("id", "brotherhood_entity_id", "image_entity_id", "place_id", "status", "is_recurring", "cult_type", "title", "month", "date_rule", "recurrence_label", "display_order", "description")
values ('f20be381-faba-482e-bd18-d8dac272b9c2', '9a4f75e5-16c4-414c-ad4f-6d4afeca5103', 'e88ddb32-082b-4c8f-9f78-6fb08031e2f4', 'b256efc9-c656-4401-bcd5-baddb6dc68f3', 'published', true, 'Besapié', 'Devoto Besapié a Nuestro Padre Jesús de la Redención', null, 'Cuaresma', 'Anual', 3, 'Culto anual documentado por la corporación.') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "place_id" = excluded."place_id", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "cult_type" = excluded."cult_type", "title" = excluded."title", "month" = excluded."month", "date_rule" = excluded."date_rule", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order", "description" = excluded."description";

insert into public."cult_entities" ("id", "cult_id", "entity_id", "role", "notes")
values ('69a57d1b-a155-4a3b-8a59-bfc87ea41c6b', 'f20be381-faba-482e-bd18-d8dac272b9c2', 'e88ddb32-082b-4c8f-9f78-6fb08031e2f4', 'honoree', 'Titular al que se dedica el culto.') on conflict ("id") do update set "cult_id" = excluded."cult_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "cult_id")
values ('31770964-fa7b-498d-ad6a-2d1f9de3d3ce', '8741d5e1-3a50-4038-8e9c-c543389f2bec', 'f20be381-faba-482e-bd18-d8dac272b9c2') on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id";

insert into public."cults" ("id", "brotherhood_entity_id", "image_entity_id", "place_id", "status", "is_recurring", "cult_type", "title", "month", "date_rule", "recurrence_label", "display_order", "description")
values ('9b10cfbe-d020-4f1c-8359-6fc27e5d68ac', '9a4f75e5-16c4-414c-ad4f-6d4afeca5103', '9b01a290-6985-43f6-bf78-3991ad81eaec', 'b256efc9-c656-4401-bcd5-baddb6dc68f3', 'published', true, 'Triduo', 'Solemne Triduo a María Santísima del Rocío Coronada', null, 'En torno a Pentecostés', 'Anual', 4, 'Culto anual documentado por la corporación.') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "place_id" = excluded."place_id", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "cult_type" = excluded."cult_type", "title" = excluded."title", "month" = excluded."month", "date_rule" = excluded."date_rule", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order", "description" = excluded."description";

insert into public."cult_entities" ("id", "cult_id", "entity_id", "role", "notes")
values ('b1d3cd3c-0df2-4d7c-bf68-43e627461849', '9b10cfbe-d020-4f1c-8359-6fc27e5d68ac', '9b01a290-6985-43f6-bf78-3991ad81eaec', 'honoree', 'Titular al que se dedica el culto.') on conflict ("id") do update set "cult_id" = excluded."cult_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "cult_id")
values ('87d67e4e-825b-4dc4-a691-a351908c2891', '8741d5e1-3a50-4038-8e9c-c543389f2bec', '9b10cfbe-d020-4f1c-8359-6fc27e5d68ac') on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id";

insert into public."cults" ("id", "brotherhood_entity_id", "image_entity_id", "place_id", "status", "is_recurring", "cult_type", "title", "month", "date_rule", "recurrence_label", "display_order", "description")
values ('1c1fd7b9-be7c-4524-89c9-0e5051d3c3f4', '9a4f75e5-16c4-414c-ad4f-6d4afeca5103', '9b01a290-6985-43f6-bf78-3991ad81eaec', 'b256efc9-c656-4401-bcd5-baddb6dc68f3', 'published', true, 'Besamanos', 'Besamanos a María Santísima del Rocío Coronada', null, 'En torno a la Inmaculada Concepción', 'Anual', 5, 'Culto anual documentado por la corporación.') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "place_id" = excluded."place_id", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "cult_type" = excluded."cult_type", "title" = excluded."title", "month" = excluded."month", "date_rule" = excluded."date_rule", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order", "description" = excluded."description";

insert into public."cult_entities" ("id", "cult_id", "entity_id", "role", "notes")
values ('adef05a9-02a2-4f51-b432-23df8a16c129', '1c1fd7b9-be7c-4524-89c9-0e5051d3c3f4', '9b01a290-6985-43f6-bf78-3991ad81eaec', 'honoree', 'Titular al que se dedica el culto.') on conflict ("id") do update set "cult_id" = excluded."cult_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "cult_id")
values ('b0bbf572-7ef0-44fe-acfa-9be3a7ef19c5', '8741d5e1-3a50-4038-8e9c-c543389f2bec', '1c1fd7b9-be7c-4524-89c9-0e5051d3c3f4') on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id";

insert into public."cults" ("id", "brotherhood_entity_id", "image_entity_id", "place_id", "status", "is_recurring", "cult_type", "title", "month", "date_rule", "recurrence_label", "display_order", "description")
values ('c312d498-2f2d-45ff-bfbb-52081e9bd8d6', '9a4f75e5-16c4-414c-ad4f-6d4afeca5103', null, 'b256efc9-c656-4401-bcd5-baddb6dc68f3', 'published', true, 'Triduo', 'Triduo al Santísimo Sacramento', null, 'En torno al Corpus Christi', 'Anual', 6, 'Culto anual documentado por la corporación.') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "place_id" = excluded."place_id", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "cult_type" = excluded."cult_type", "title" = excluded."title", "month" = excluded."month", "date_rule" = excluded."date_rule", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order", "description" = excluded."description";

insert into public."source_links" ("id", "source_id", "cult_id")
values ('aa6bf26e-44b0-4359-8a40-4bc8ca3b8673', '8741d5e1-3a50-4038-8e9c-c543389f2bec', 'c312d498-2f2d-45ff-bfbb-52081e9bd8d6') on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id";

insert into public."outings" ("id", "brotherhood_entity_id", "outing_type", "character", "title", "outing_date", "year", "municipality_id", "origin_place_id", "destination_text", "description", "event_status", "status", "slug")
values ('932a91ef-3585-4aca-b0d9-18d0b4125501', '9a4f75e5-16c4-414c-ad4f-6d4afeca5103', 'Estación de Penitencia', 'ordinary', 'La Redención · Estación de Penitencia 2026', '2026-03-30', 2026, 'ca85889c-21fe-4367-8477-a57656b25da4', 'b256efc9-c656-4401-bcd5-baddb6dc68f3', 'Santa Iglesia Catedral de Sevilla', 'Estación de penitencia del Lunes Santo de 2026.', 'held', 'published', 'redencion-estacion-penitencia-2026') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "outing_type" = excluded."outing_type", "character" = excluded."character", "title" = excluded."title", "outing_date" = excluded."outing_date", "year" = excluded."year", "municipality_id" = excluded."municipality_id", "origin_place_id" = excluded."origin_place_id", "destination_text" = excluded."destination_text", "description" = excluded."description", "event_status" = excluded."event_status", "status" = excluded."status", "slug" = excluded."slug";

insert into public."outing_entities" ("id", "outing_id", "entity_id", "role", "notes")
values ('91f74044-8e93-4f88-8100-679432aad902', '932a91ef-3585-4aca-b0d9-18d0b4125501', 'e88ddb32-082b-4c8f-9f78-6fb08031e2f4', 'processional_image', 'Imagen participante en la estación de penitencia.') on conflict ("id") do update set "outing_id" = excluded."outing_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."outing_entities" ("id", "outing_id", "entity_id", "role", "notes")
values ('e5c8f0cf-7a10-4051-8bd1-c410ec21e43e', '932a91ef-3585-4aca-b0d9-18d0b4125501', '9b01a290-6985-43f6-bf78-3991ad81eaec', 'secondary_image', 'Imagen participante en la estación de penitencia.') on conflict ("id") do update set "outing_id" = excluded."outing_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "outing_id")
values ('5e261c0d-a0a8-4046-adae-a9ed988b3699', '9666f211-0155-4435-878f-899f8ccabb6e', '932a91ef-3585-4aca-b0d9-18d0b4125501') on conflict ("id") do update set "source_id" = excluded."source_id", "outing_id" = excluded."outing_id";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('bfdd2617-7511-4974-83af-07a09fb27046', 'event', 'Fundación de la Hermandad de la Redención', 'fundacion-hermandad-redencion-1955', 'Las primeras Reglas fueron aprobadas el 6 de junio de 1955.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."events" ("entity_id", "event_type", "event_date_text", "place_id", "description", "event_category", "brotherhood_entity_id", "municipality_id", "event_status")
values ('bfdd2617-7511-4974-83af-07a09fb27046', 'Hito histórico', '6 de junio de 1955', null, 'Las primeras Reglas fueron aprobadas el 6 de junio de 1955.', 'historical', '9a4f75e5-16c4-414c-ad4f-6d4afeca5103', 'ca85889c-21fe-4367-8477-a57656b25da4', 'held') on conflict ("entity_id") do update set "event_type" = excluded."event_type", "event_date_text" = excluded."event_date_text", "place_id" = excluded."place_id", "description" = excluded."description", "event_category" = excluded."event_category", "brotherhood_entity_id" = excluded."brotherhood_entity_id", "municipality_id" = excluded."municipality_id", "event_status" = excluded."event_status";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('a2b27242-79c7-4e54-b238-d1b9716ce2b2', '71019959-30b3-44b0-a8ed-87efd0e54a93', 'bfdd2617-7511-4974-83af-07a09fb27046') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('08f9100e-dd78-40ff-a71b-a296d96c99d3', 'event', 'Primera estación propia de la Redención', 'primera-estacion-redencion-1959', 'La cofradía salió por primera vez con paso propio el Lunes Santo de 1959.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."events" ("entity_id", "event_type", "event_date_text", "place_id", "description", "event_category", "brotherhood_entity_id", "municipality_id", "event_status")
values ('08f9100e-dd78-40ff-a71b-a296d96c99d3', 'Hito histórico', '23 de marzo de 1959', null, 'La cofradía salió por primera vez con paso propio el Lunes Santo de 1959.', 'historical', '9a4f75e5-16c4-414c-ad4f-6d4afeca5103', 'ca85889c-21fe-4367-8477-a57656b25da4', 'held') on conflict ("entity_id") do update set "event_type" = excluded."event_type", "event_date_text" = excluded."event_date_text", "place_id" = excluded."place_id", "description" = excluded."description", "event_category" = excluded."event_category", "brotherhood_entity_id" = excluded."brotherhood_entity_id", "municipality_id" = excluded."municipality_id", "event_status" = excluded."event_status";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('4fe8109f-297a-4af5-a8bf-b66bc638c352', '71019959-30b3-44b0-a8ed-87efd0e54a93', '08f9100e-dd78-40ff-a71b-a296d96c99d3') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('c17f459d-546a-4568-a1b3-b3331c79eb57', 'event', 'Señor de la Redención en el Vía Crucis del Consejo', 'redencion-via-crucis-consejo-2024', 'Nuestro Padre Jesús de la Redención presidió el Vía Crucis de las Hermandades de Sevilla.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."events" ("entity_id", "event_type", "event_date_text", "place_id", "description", "event_category", "brotherhood_entity_id", "municipality_id", "event_status")
values ('c17f459d-546a-4568-a1b3-b3331c79eb57', 'Hito histórico', '19 de febrero de 2024', null, 'Nuestro Padre Jesús de la Redención presidió el Vía Crucis de las Hermandades de Sevilla.', 'historical', '9a4f75e5-16c4-414c-ad4f-6d4afeca5103', 'ca85889c-21fe-4367-8477-a57656b25da4', 'held') on conflict ("entity_id") do update set "event_type" = excluded."event_type", "event_date_text" = excluded."event_date_text", "place_id" = excluded."place_id", "description" = excluded."description", "event_category" = excluded."event_category", "brotherhood_entity_id" = excluded."brotherhood_entity_id", "municipality_id" = excluded."municipality_id", "event_status" = excluded."event_status";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('54f811bb-4e52-4e52-b5b7-d38ec2c5cfa6', '6c4afef9-a1ce-42fb-ab27-a83cc1d15c13', 'c17f459d-546a-4568-a1b3-b3331c79eb57') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('766c32e9-1415-4520-95e5-6374ab858dff', 'event', 'Coronación canónica de María Santísima del Rocío', 'coronacion-rocio-redencion-2025', 'María Santísima del Rocío fue coronada canónicamente en la Catedral de Sevilla.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."events" ("entity_id", "event_type", "event_date_text", "place_id", "description", "event_category", "brotherhood_entity_id", "municipality_id", "event_status")
values ('766c32e9-1415-4520-95e5-6374ab858dff', 'Hito histórico', '5 de julio de 2025', null, 'María Santísima del Rocío fue coronada canónicamente en la Catedral de Sevilla.', 'historical', '9a4f75e5-16c4-414c-ad4f-6d4afeca5103', 'ca85889c-21fe-4367-8477-a57656b25da4', 'held') on conflict ("entity_id") do update set "event_type" = excluded."event_type", "event_date_text" = excluded."event_date_text", "place_id" = excluded."place_id", "description" = excluded."description", "event_category" = excluded."event_category", "brotherhood_entity_id" = excluded."brotherhood_entity_id", "municipality_id" = excluded."municipality_id", "event_status" = excluded."event_status";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('dfaac1d0-498d-4c2a-aeae-30bc6a65ccd1', '4b76cc82-fe55-4034-b979-e0860c39fb78', '766c32e9-1415-4520-95e5-6374ab858dff') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."brotherhood_habits" ("id", "brotherhood_entity_id", "name", "tunic_description", "hood_description", "cord_description", "footwear_description", "sort_order", "notes", "status")
values ('f99632ab-c4e7-4b20-a03e-61b87f9e75f8', '9a4f75e5-16c4-414c-ad4f-6d4afeca5103', 'Hábito de la Redención', 'Túnica blanca de cola.', 'Antifaz morado.', 'Cíngulo morado y blanco.', 'Calzado negro.', 1, 'Hábito penitencial documentado por la corporación.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "name" = excluded."name", "tunic_description" = excluded."tunic_description", "hood_description" = excluded."hood_description", "cord_description" = excluded."cord_description", "footwear_description" = excluded."footwear_description", "sort_order" = excluded."sort_order", "notes" = excluded."notes", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('c471c64b-77af-4604-873e-83f5dec39a77', 'heritage_asset', 'Corona de la coronación canónica de la Virgen del Rocío', 'corona-coronacion-rocio-redencion', 'Presea vinculada a la coronación canónica de 2025.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."heritage_assets" ("entity_id", "parent_entity_id", "asset_type", "description", "current_condition", "is_current", "display_order", "is_featured")
values ('c471c64b-77af-4604-873e-83f5dec39a77', '9a4f75e5-16c4-414c-ad4f-6d4afeca5103', 'Presea', 'Presea vinculada a la coronación canónica de 2025.', 'Conservado', true, 1, true) on conflict ("entity_id") do update set "parent_entity_id" = excluded."parent_entity_id", "asset_type" = excluded."asset_type", "description" = excluded."description", "current_condition" = excluded."current_condition", "is_current" = excluded."is_current", "display_order" = excluded."display_order", "is_featured" = excluded."is_featured";

insert into public."music_accompaniment_periods" ("id", "brotherhood_entity_id", "band_entity_id", "step_entity_id", "position", "outing_type", "date_from_text", "year_from", "is_current", "public_brotherhood_name", "public_step_name", "public_brotherhood_slug", "public_municipality_name", "public_municipality_slug", "public_province", "status")
values ('11fe18e8-2a58-4acd-9db5-b21b44977dae', '9a4f75e5-16c4-414c-ad4f-6d4afeca5103', 'b4330e30-e748-4b50-a626-64b4e015087b', '421c3ee8-4b3a-44d0-ba6f-3872bd68707d', 'Tras el paso de misterio', 'Lunes Santo', 'Desde 1993', 1993, true, 'Hermandad de la Redención', 'Nuestro Padre Jesús de la Redención', 'hermandad-de-la-redencion', 'Sevilla', 'sevilla', 'Sevilla', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "band_entity_id" = excluded."band_entity_id", "step_entity_id" = excluded."step_entity_id", "position" = excluded."position", "outing_type" = excluded."outing_type", "date_from_text" = excluded."date_from_text", "year_from" = excluded."year_from", "is_current" = excluded."is_current", "public_brotherhood_name" = excluded."public_brotherhood_name", "public_step_name" = excluded."public_step_name", "public_brotherhood_slug" = excluded."public_brotherhood_slug", "public_municipality_name" = excluded."public_municipality_name", "public_municipality_slug" = excluded."public_municipality_slug", "public_province" = excluded."public_province", "status" = excluded."status";

insert into public."music_accompaniment_periods" ("id", "brotherhood_entity_id", "band_entity_id", "step_entity_id", "position", "outing_type", "date_from_text", "year_from", "is_current", "notes", "public_brotherhood_name", "public_step_name", "public_brotherhood_slug", "public_municipality_name", "public_municipality_slug", "public_province", "status")
values ('c7fd912e-b816-495d-9d9b-a36a903f91dd', '9a4f75e5-16c4-414c-ad4f-6d4afeca5103', 'c6000000-0000-4000-8000-000000000001', 'c22737ee-d3d4-4cc2-9fb7-777e332f8827', 'Tras el paso de palio', 'Lunes Santo', 'Vigente · 2026', 2022, true, 'Renovación oficial confirmada para 2026, 2027 y 2028.', 'Hermandad de la Redención', 'María Santísima del Rocío Coronada', 'hermandad-de-la-redencion', 'Sevilla', 'sevilla', 'Sevilla', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "band_entity_id" = excluded."band_entity_id", "step_entity_id" = excluded."step_entity_id", "position" = excluded."position", "outing_type" = excluded."outing_type", "date_from_text" = excluded."date_from_text", "year_from" = excluded."year_from", "is_current" = excluded."is_current", "notes" = excluded."notes", "public_brotherhood_name" = excluded."public_brotherhood_name", "public_step_name" = excluded."public_step_name", "public_brotherhood_slug" = excluded."public_brotherhood_slug", "public_municipality_name" = excluded."public_municipality_name", "public_municipality_slug" = excluded."public_municipality_slug", "public_province" = excluded."public_province", "status" = excluded."status";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('e4c09495-ae57-4071-9407-f1b3b97eaffc', 'b4421965-8ac3-4300-8ed6-386a71b5ad57', '9a4f75e5-16c4-414c-ad4f-6d4afeca5103') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('913190fe-ca5e-448b-8c41-f417f7960f70', '71019959-30b3-44b0-a8ed-87efd0e54a93', '9a4f75e5-16c4-414c-ad4f-6d4afeca5103') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('450bf596-6972-40a0-a639-ac46dccecb56', '6c4afef9-a1ce-42fb-ab27-a83cc1d15c13', '9a4f75e5-16c4-414c-ad4f-6d4afeca5103') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('41d0240c-a204-4f7a-a052-a10be0c35a59', '4b76cc82-fe55-4034-b979-e0860c39fb78', '9a4f75e5-16c4-414c-ad4f-6d4afeca5103') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('5244bfa5-8d57-428d-9605-262606b24cd4', '8741d5e1-3a50-4038-8e9c-c543389f2bec', '9a4f75e5-16c4-414c-ad4f-6d4afeca5103') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('464b2a1e-a5b9-43ce-a46f-509313fd7246', 'f4d8b895-5b71-42ef-8348-419a538d4645', '9a4f75e5-16c4-414c-ad4f-6d4afeca5103') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('3af493d2-8375-4d90-b1eb-a982f0b9b0f0', '9666f211-0155-4435-878f-899f8ccabb6e', '9a4f75e5-16c4-414c-ad4f-6d4afeca5103') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('97b44e57-ff3a-40ef-b2fc-a039edbbced9', '6c4afef9-a1ce-42fb-ab27-a83cc1d15c13', 'e88ddb32-082b-4c8f-9f78-6fb08031e2f4') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('323028a2-a8c2-4f08-af82-09142ec2cbd9', '4b76cc82-fe55-4034-b979-e0860c39fb78', '9b01a290-6985-43f6-bf78-3991ad81eaec') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('d24a1f0f-bc0a-494f-8b72-01fd7750abe6', '4b76cc82-fe55-4034-b979-e0860c39fb78', 'c471c64b-77af-4604-873e-83f5dec39a77') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."source_links" ("id", "source_id", "music_accompaniment_period_id")
values ('631fe786-62ad-41ca-a300-9baea31ea036', 'b4421965-8ac3-4300-8ed6-386a71b5ad57', '11fe18e8-2a58-4acd-9db5-b21b44977dae') on conflict ("id") do update set "source_id" = excluded."source_id", "music_accompaniment_period_id" = excluded."music_accompaniment_period_id";

insert into public."source_links" ("id", "source_id", "music_accompaniment_period_id")
values ('ed0559a3-01b2-4245-951b-a21e62dc77d2', 'b4421965-8ac3-4300-8ed6-386a71b5ad57', 'c7fd912e-b816-495d-9d9b-a36a903f91dd') on conflict ("id") do update set "source_id" = excluded."source_id", "music_accompaniment_period_id" = excluded."music_accompaniment_period_id";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('95c1c1bd-0aba-4787-a5e1-b144a896a81e', 'Web oficial · Hermandad de Santa Genoveva', 'https://www.santagenoveva.com/', 'web', 'Hermandad de Santa Genoveva', '2026-09-14', 'Identidad, titulares, patrimonio y actualidad oficial.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('60572e31-51af-4a68-9f18-bd208598b98c', 'Historia · Hermandad de Santa Genoveva', 'https://www.santagenoveva.com/historia/', 'web', 'Hermandad de Santa Genoveva', '2026-09-14', 'Fundación, primeras estaciones e hitos.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('c56b0dc9-c20d-402e-81cd-6e570fc6ac5a', 'Nuestro Padre Jesús Cautivo', 'https://www.santagenoveva.com/nuestro-padre-jesus-cautivo/', 'web', 'Hermandad de Santa Genoveva', '2026-09-14', 'Autoría, datación y descripción del titular.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('7bebeedc-9788-4f42-9019-5195cd0b72a4', 'Nuestra Señora de las Mercedes Coronada', 'https://www.santagenoveva.com/nuestra-senora-de-las-mercedes-coronada/', 'web', 'Hermandad de Santa Genoveva', '2026-09-14', 'Autoría, evolución y coronación de la titular.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('900d5d07-d515-48ee-9d2f-71a1a782cf63', 'Paso de Nuestro Padre Jesús Cautivo', 'https://www.santagenoveva.com/paso-de-ntro-padre-jesus-cautivo/', 'web', 'Hermandad de Santa Genoveva', '2026-09-14', 'Descripción y patrimonio del paso del Señor.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('fed6a046-3a6a-468e-a95d-279c20ece25c', 'Paso de Nuestra Señora de las Mercedes Coronada', 'https://www.santagenoveva.com/paso-de-ntra-sra-de-las-mercedes-coronada/', 'web', 'Hermandad de Santa Genoveva', '2026-09-14', 'Descripción y patrimonio del paso de palio.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."places" ("id", "municipality_id", "name", "slug", "place_type", "address", "notes")
values ('ffb97fbf-63a5-4753-aa92-c7fab68c1013', 'ca85889c-21fe-4367-8477-a57656b25da4', 'Parroquia de Santa Genoveva', 'parroquia-santa-genoveva-sevilla', 'Parroquia', 'Avenida de los Teatinos, 41, 41013 Sevilla', 'Sede canónica de la Hermandad de Santa Genoveva.') on conflict ("id") do update set "municipality_id" = excluded."municipality_id", "name" = excluded."name", "slug" = excluded."slug", "place_type" = excluded."place_type", "address" = excluded."address", "notes" = excluded."notes";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('0e4d1e8e-54ed-4a3f-a3b3-951be6d43505', 'brotherhood', 'Hermandad de Santa Genoveva', 'santa-genoveva', 'Hermandad sacramental y de penitencia del Tiro de Línea.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."brotherhoods" ("entity_id", "official_name", "popular_name", "foundation_text", "municipality_id", "canonical_see_place_id", "neighborhood", "website_url", "brotherhood_types", "current_procession_day", "history_text", "notes")
values ('0e4d1e8e-54ed-4a3f-a3b3-951be6d43505', 'Hermandad y Cofradía de Nazarenos del Santísimo Sacramento, Nuestro Padre Jesús Cautivo en el Abandono de sus Discípulos, Nuestra Señora de las Mercedes Coronada y San Juan Evangelista en la Tercera Palabra, Inmaculada Milagrosa y Santa Genoveva', 'Santa Genoveva', '1956', 'ca85889c-21fe-4367-8477-a57656b25da4', 'ffb97fbf-63a5-4753-aa92-c7fab68c1013', 'Tiro de Línea', 'https://www.santagenoveva.com/', ARRAY['Penitencia', 'Sacramental']::text[], 'Lunes Santo', 'Fundada en 1956, realizó una representación penitencial en 1957 y su primera estación completa en 1958. Se fusionó con la Sacramental parroquial en 1982.', 'Sin fotografías nuevas mientras no conste licencia reutilizable.') on conflict ("entity_id") do update set "official_name" = excluded."official_name", "popular_name" = excluded."popular_name", "foundation_text" = excluded."foundation_text", "municipality_id" = excluded."municipality_id", "canonical_see_place_id" = excluded."canonical_see_place_id", "neighborhood" = excluded."neighborhood", "website_url" = excluded."website_url", "brotherhood_types" = excluded."brotherhood_types", "current_procession_day" = excluded."current_procession_day", "history_text" = excluded."history_text", "notes" = excluded."notes";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('3103010e-d20f-45d7-a547-a3d9c7a31562', 'agent', 'José Paz Vélez', 'jose-paz-velez', 'Escultor autor de Nuestro Padre Jesús Cautivo de Santa Genoveva.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('38e07d3a-7d32-436e-9ae8-31991a2d7aa4', 'image', 'Nuestro Padre Jesús Cautivo en el Abandono de sus Discípulos', 'nuestro-padre-jesus-cautivo-santa-genoveva', 'Señor cautivo de José Paz Vélez, bendecido en 1957.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."images" ("entity_id", "image_type", "execution_date_text", "current_condition", "description", "is_dress_image")
values ('38e07d3a-7d32-436e-9ae8-31991a2d7aa4', 'Cautivo', '1956–1957', 'extant', 'Cristo de pie y maniatado, concebido para representar el abandono de sus discípulos.', false) on conflict ("entity_id") do update set "image_type" = excluded."image_type", "execution_date_text" = excluded."execution_date_text", "current_condition" = excluded."current_condition", "description" = excluded."description", "is_dress_image" = excluded."is_dress_image";

insert into public."brotherhood_images" ("id", "brotherhood_entity_id", "image_entity_id", "relation_type", "notes", "status")
values ('385bbc51-e7b3-4c15-8965-541031004d57', '0e4d1e8e-54ed-4a3f-a3b3-951be6d43505', '38e07d3a-7d32-436e-9ae8-31991a2d7aa4', 'titular', 'Titular vigente documentado.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_authorships" ("id", "image_entity_id", "agent_entity_id", "authorship_type", "role_name", "date_from_text", "certainty", "notes", "status")
values ('f8b5380b-adaa-4b65-a9d0-5976027c2f49', '38e07d3a-7d32-436e-9ae8-31991a2d7aa4', '3103010e-d20f-45d7-a547-a3d9c7a31562', 'author', 'escultor', '1956–1957', 'documented', 'Autoría documentada.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "agent_entity_id" = excluded."agent_entity_id", "authorship_type" = excluded."authorship_type", "role_name" = excluded."role_name", "date_from_text" = excluded."date_from_text", "certainty" = excluded."certainty", "notes" = excluded."notes", "status" = excluded."status";

insert into public."agents" ("entity_id", "agent_kind", "description")
values ('3103010e-d20f-45d7-a547-a3d9c7a31562', 'person', 'Escultor e imaginero.') on conflict ("entity_id") do update set "agent_kind" = excluded."agent_kind", "description" = excluded."description";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('2dffc8db-555c-4a39-ba9f-f1c689d11811', 'image', 'Nuestra Señora de las Mercedes Coronada', 'nuestra-senora-mercedes-coronada-santa-genoveva', 'Dolorosa de José Paz Vélez, bendecida en 1956.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."images" ("entity_id", "image_type", "execution_date_text", "current_condition", "description", "is_dress_image")
values ('2dffc8db-555c-4a39-ba9f-f1c689d11811', 'Dolorosa de vestir', '1956', 'extant', 'Titular mariana de la corporación, coronada canónicamente en 1997.', true) on conflict ("entity_id") do update set "image_type" = excluded."image_type", "execution_date_text" = excluded."execution_date_text", "current_condition" = excluded."current_condition", "description" = excluded."description", "is_dress_image" = excluded."is_dress_image";

insert into public."brotherhood_images" ("id", "brotherhood_entity_id", "image_entity_id", "relation_type", "notes", "status")
values ('abb11cdb-4ce3-47a7-891c-db27cc586600', '0e4d1e8e-54ed-4a3f-a3b3-951be6d43505', '2dffc8db-555c-4a39-ba9f-f1c689d11811', 'titular', 'Titular vigente documentado.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_authorships" ("id", "image_entity_id", "agent_entity_id", "authorship_type", "role_name", "date_from_text", "certainty", "notes", "status")
values ('c5c376c3-d4e2-4e90-a180-fa7d85dd42c6', '2dffc8db-555c-4a39-ba9f-f1c689d11811', '3103010e-d20f-45d7-a547-a3d9c7a31562', 'author', 'escultor', '1956', 'documented', 'Autoría documentada.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "agent_entity_id" = excluded."agent_entity_id", "authorship_type" = excluded."authorship_type", "role_name" = excluded."role_name", "date_from_text" = excluded."date_from_text", "certainty" = excluded."certainty", "notes" = excluded."notes", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('54bd1e83-60d4-4f17-b31e-527e7f03ccc7', 'image', 'San Juan Evangelista de Santa Genoveva', 'san-juan-evangelista-santa-genoveva', 'Titular de la corporación vinculado a la Tercera Palabra.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."images" ("entity_id", "image_type", "execution_date_text", "current_condition", "description", "is_dress_image")
values ('54bd1e83-60d4-4f17-b31e-527e7f03ccc7', 'San Juan Evangelista', 'Siglo XX', 'extant', 'Titular asociado a la advocación de la Tercera Palabra.', false) on conflict ("entity_id") do update set "image_type" = excluded."image_type", "execution_date_text" = excluded."execution_date_text", "current_condition" = excluded."current_condition", "description" = excluded."description", "is_dress_image" = excluded."is_dress_image";

insert into public."brotherhood_images" ("id", "brotherhood_entity_id", "image_entity_id", "relation_type", "notes", "status")
values ('7ff10b09-f177-4205-a4e7-b50c971ed91e', '0e4d1e8e-54ed-4a3f-a3b3-951be6d43505', '54bd1e83-60d4-4f17-b31e-527e7f03ccc7', 'titular', 'Titular vigente documentado.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_authorships" ("id", "image_entity_id", "agent_entity_id", "authorship_type", "role_name", "date_from_text", "certainty", "notes", "status")
values ('a214a76f-94b3-4486-b7ea-c696b0a6136e', '54bd1e83-60d4-4f17-b31e-527e7f03ccc7', null, 'anonymous', 'escultor', 'Siglo XX', 'unknown', 'Autoría no identificada por la fuente oficial.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "agent_entity_id" = excluded."agent_entity_id", "authorship_type" = excluded."authorship_type", "role_name" = excluded."role_name", "date_from_text" = excluded."date_from_text", "certainty" = excluded."certainty", "notes" = excluded."notes", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('fd1f6472-444e-444d-b6be-affbaaeacbf6', 'image', 'Inmaculada Milagrosa de Santa Genoveva', 'inmaculada-milagrosa-santa-genoveva', 'Titular letífica de la Hermandad de Santa Genoveva.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."images" ("entity_id", "image_type", "execution_date_text", "current_condition", "description", "is_dress_image")
values ('fd1f6472-444e-444d-b6be-affbaaeacbf6', 'Gloria', 'Siglo XX', 'extant', 'Imagen titular de carácter letífico integrada en la corporación.', false) on conflict ("entity_id") do update set "image_type" = excluded."image_type", "execution_date_text" = excluded."execution_date_text", "current_condition" = excluded."current_condition", "description" = excluded."description", "is_dress_image" = excluded."is_dress_image";

insert into public."brotherhood_images" ("id", "brotherhood_entity_id", "image_entity_id", "relation_type", "notes", "status")
values ('b44cad7d-7ea8-4e97-a6d3-e359d8839dab', '0e4d1e8e-54ed-4a3f-a3b3-951be6d43505', 'fd1f6472-444e-444d-b6be-affbaaeacbf6', 'titular', 'Titular vigente documentado.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_authorships" ("id", "image_entity_id", "agent_entity_id", "authorship_type", "role_name", "date_from_text", "certainty", "notes", "status")
values ('0eef8727-e3a1-44c0-804b-cf58d959283a', 'fd1f6472-444e-444d-b6be-affbaaeacbf6', null, 'anonymous', 'escultor', 'Siglo XX', 'unknown', 'Autoría no identificada por la fuente oficial.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "agent_entity_id" = excluded."agent_entity_id", "authorship_type" = excluded."authorship_type", "role_name" = excluded."role_name", "date_from_text" = excluded."date_from_text", "certainty" = excluded."certainty", "notes" = excluded."notes", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('3aa883b7-aa99-48d2-afee-e5e2188a8689', 'image', 'Santa Genoveva', 'santa-genoveva-titular-sevilla', 'Titular hagiográfica de la corporación del Tiro de Línea.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."images" ("entity_id", "image_type", "execution_date_text", "current_condition", "description", "is_dress_image")
values ('3aa883b7-aa99-48d2-afee-e5e2188a8689', 'Santa', 'Siglo XX', 'extant', 'Imagen titular de Santa Genoveva.', false) on conflict ("entity_id") do update set "image_type" = excluded."image_type", "execution_date_text" = excluded."execution_date_text", "current_condition" = excluded."current_condition", "description" = excluded."description", "is_dress_image" = excluded."is_dress_image";

insert into public."brotherhood_images" ("id", "brotherhood_entity_id", "image_entity_id", "relation_type", "notes", "status")
values ('74d249d9-ddd5-4185-a7e8-31ce9b5e7ec5', '0e4d1e8e-54ed-4a3f-a3b3-951be6d43505', '3aa883b7-aa99-48d2-afee-e5e2188a8689', 'titular', 'Titular vigente documentado.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_authorships" ("id", "image_entity_id", "agent_entity_id", "authorship_type", "role_name", "date_from_text", "certainty", "notes", "status")
values ('26da8026-bec0-41a4-ac42-8bd8e140de75', '3aa883b7-aa99-48d2-afee-e5e2188a8689', null, 'anonymous', 'escultor', 'Siglo XX', 'unknown', 'Autoría no identificada por la fuente oficial.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "agent_entity_id" = excluded."agent_entity_id", "authorship_type" = excluded."authorship_type", "role_name" = excluded."role_name", "date_from_text" = excluded."date_from_text", "certainty" = excluded."certainty", "notes" = excluded."notes", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('fffbed2b-cae5-40bc-9236-cfe18d631c73', 'step', 'Paso de Nuestro Padre Jesús Cautivo', 'paso-nuestro-padre-jesus-cautivo-santa-genoveva', 'Paso procesional del Cautivo del Tiro de Línea.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."steps" ("entity_id", "step_type", "current_condition", "execution_date_text", "description")
values ('fffbed2b-cae5-40bc-9236-cfe18d631c73', 'Paso de Cristo', 'preserved', null, 'Paso neobarroco del titular cautivo.') on conflict ("entity_id") do update set "step_type" = excluded."step_type", "current_condition" = excluded."current_condition", "execution_date_text" = excluded."execution_date_text", "description" = excluded."description";

insert into public."brotherhood_steps" ("id", "brotherhood_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('d973afb3-21a5-42d8-a81b-3993696a4dc1', '0e4d1e8e-54ed-4a3f-a3b3-951be6d43505', 'fffbed2b-cae5-40bc-9236-cfe18d631c73', 'current', 'Paso procesional vigente.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_steps" ("id", "image_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('37f35b70-73bf-40a7-95aa-ecbca598878d', '38e07d3a-7d32-436e-9ae8-31991a2d7aa4', 'fffbed2b-cae5-40bc-9236-cfe18d631c73', 'processional', 'Imagen principal del paso.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('d3371924-40d2-48b3-91a3-4d7622272349', 'step', 'Paso de palio de Nuestra Señora de las Mercedes Coronada', 'paso-palio-maria-santisima-mercedes-santa-genoveva', 'Paso de palio de la Virgen de las Mercedes Coronada.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."steps" ("entity_id", "step_type", "current_condition", "execution_date_text", "description")
values ('d3371924-40d2-48b3-91a3-4d7622272349', 'Palio', 'preserved', null, 'Paso de palio de la titular mariana.') on conflict ("entity_id") do update set "step_type" = excluded."step_type", "current_condition" = excluded."current_condition", "execution_date_text" = excluded."execution_date_text", "description" = excluded."description";

insert into public."brotherhood_steps" ("id", "brotherhood_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('b35c9c52-160f-4ef3-b5e0-57d5d0dc32d5', '0e4d1e8e-54ed-4a3f-a3b3-951be6d43505', 'd3371924-40d2-48b3-91a3-4d7622272349', 'current', 'Paso procesional vigente.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_steps" ("id", "image_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('a805b96e-82b3-478c-b3ea-f1f8f5dace94', '2dffc8db-555c-4a39-ba9f-f1c689d11811', 'd3371924-40d2-48b3-91a3-4d7622272349', 'processional', 'Imagen principal del paso.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."cults" ("id", "brotherhood_entity_id", "image_entity_id", "place_id", "status", "is_recurring", "cult_type", "title", "month", "date_rule", "recurrence_label", "display_order", "description")
values ('f61d7131-cf1e-489f-9e30-f5da7471b516', '0e4d1e8e-54ed-4a3f-a3b3-951be6d43505', '38e07d3a-7d32-436e-9ae8-31991a2d7aa4', 'ffb97fbf-63a5-4753-aa92-c7fab68c1013', 'published', true, 'Quinario', 'Solemne Quinario a Nuestro Padre Jesús Cautivo', null, 'Primera mitad de Cuaresma', 'Anual', 1, 'Culto anual documentado por la Hermandad.') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "place_id" = excluded."place_id", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "cult_type" = excluded."cult_type", "title" = excluded."title", "month" = excluded."month", "date_rule" = excluded."date_rule", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order", "description" = excluded."description";

insert into public."cult_entities" ("id", "cult_id", "entity_id", "role", "notes")
values ('d98c3c92-b1fe-41e3-bb0a-4474cfc14555', 'f61d7131-cf1e-489f-9e30-f5da7471b516', '38e07d3a-7d32-436e-9ae8-31991a2d7aa4', 'honoree', 'Titular al que se dedica el culto.') on conflict ("id") do update set "cult_id" = excluded."cult_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "cult_id")
values ('6af0cfba-022f-41f0-8e1d-e4096e9ac0f2', '95c1c1bd-0aba-4787-a5e1-b144a896a81e', 'f61d7131-cf1e-489f-9e30-f5da7471b516') on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id";

insert into public."cults" ("id", "brotherhood_entity_id", "image_entity_id", "place_id", "status", "is_recurring", "cult_type", "title", "month", "date_rule", "recurrence_label", "display_order", "description")
values ('7dd87b1f-5ae8-4645-a80e-9aeb83c000db', '0e4d1e8e-54ed-4a3f-a3b3-951be6d43505', '38e07d3a-7d32-436e-9ae8-31991a2d7aa4', 'ffb97fbf-63a5-4753-aa92-c7fab68c1013', 'published', true, 'Función Principal', 'Función Principal de Instituto', null, 'Domingo posterior al Quinario', 'Anual', 2, 'Culto anual documentado por la Hermandad.') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "place_id" = excluded."place_id", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "cult_type" = excluded."cult_type", "title" = excluded."title", "month" = excluded."month", "date_rule" = excluded."date_rule", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order", "description" = excluded."description";

insert into public."cult_entities" ("id", "cult_id", "entity_id", "role", "notes")
values ('89b1f4d6-b754-4dd6-9f8c-d60a1d9f7990', '7dd87b1f-5ae8-4645-a80e-9aeb83c000db', '38e07d3a-7d32-436e-9ae8-31991a2d7aa4', 'honoree', 'Titular al que se dedica el culto.') on conflict ("id") do update set "cult_id" = excluded."cult_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "cult_id")
values ('32175ed3-3929-4c9b-9f08-d97504b8dc2d', '95c1c1bd-0aba-4787-a5e1-b144a896a81e', '7dd87b1f-5ae8-4645-a80e-9aeb83c000db') on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id";

insert into public."cults" ("id", "brotherhood_entity_id", "image_entity_id", "place_id", "status", "is_recurring", "cult_type", "title", "month", "date_rule", "recurrence_label", "display_order", "description")
values ('b40093f4-0b6b-4f42-98de-fbf9ecfefe7c', '0e4d1e8e-54ed-4a3f-a3b3-951be6d43505', '38e07d3a-7d32-436e-9ae8-31991a2d7aa4', 'ffb97fbf-63a5-4753-aa92-c7fab68c1013', 'published', true, 'Besamanos', 'Devoto Besamanos a Nuestro Padre Jesús Cautivo', null, 'Cuaresma', 'Anual', 3, 'Culto anual documentado por la Hermandad.') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "place_id" = excluded."place_id", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "cult_type" = excluded."cult_type", "title" = excluded."title", "month" = excluded."month", "date_rule" = excluded."date_rule", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order", "description" = excluded."description";

insert into public."cult_entities" ("id", "cult_id", "entity_id", "role", "notes")
values ('63677cd6-1b3a-4758-bba3-1f4572c71b97', 'b40093f4-0b6b-4f42-98de-fbf9ecfefe7c', '38e07d3a-7d32-436e-9ae8-31991a2d7aa4', 'honoree', 'Titular al que se dedica el culto.') on conflict ("id") do update set "cult_id" = excluded."cult_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "cult_id")
values ('d4d5b05b-0791-4a87-8459-702c4087269f', '95c1c1bd-0aba-4787-a5e1-b144a896a81e', 'b40093f4-0b6b-4f42-98de-fbf9ecfefe7c') on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id";

insert into public."cults" ("id", "brotherhood_entity_id", "image_entity_id", "place_id", "status", "is_recurring", "cult_type", "title", "month", "date_rule", "recurrence_label", "display_order", "description")
values ('48df3fdf-f715-47e9-bda9-50e7b0613db2', '0e4d1e8e-54ed-4a3f-a3b3-951be6d43505', '38e07d3a-7d32-436e-9ae8-31991a2d7aa4', 'ffb97fbf-63a5-4753-aa92-c7fab68c1013', 'published', true, 'Vía Crucis', 'Vía Crucis de Nuestro Padre Jesús Cautivo', null, 'Cuaresma', 'Anual', 4, 'Culto anual documentado por la Hermandad.') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "place_id" = excluded."place_id", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "cult_type" = excluded."cult_type", "title" = excluded."title", "month" = excluded."month", "date_rule" = excluded."date_rule", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order", "description" = excluded."description";

insert into public."cult_entities" ("id", "cult_id", "entity_id", "role", "notes")
values ('95017f5c-f086-4af4-a1b7-d98f49dc8094', '48df3fdf-f715-47e9-bda9-50e7b0613db2', '38e07d3a-7d32-436e-9ae8-31991a2d7aa4', 'honoree', 'Titular al que se dedica el culto.') on conflict ("id") do update set "cult_id" = excluded."cult_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "cult_id")
values ('6bb1cef8-fdce-44d1-bfa7-5deafd713403', '95c1c1bd-0aba-4787-a5e1-b144a896a81e', '48df3fdf-f715-47e9-bda9-50e7b0613db2') on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id";

insert into public."cults" ("id", "brotherhood_entity_id", "image_entity_id", "place_id", "status", "is_recurring", "cult_type", "title", "month", "date_rule", "recurrence_label", "display_order", "description")
values ('fad6c2d1-d0d6-4e46-875e-5160ec4eb6dd', '0e4d1e8e-54ed-4a3f-a3b3-951be6d43505', '2dffc8db-555c-4a39-ba9f-f1c689d11811', 'ffb97fbf-63a5-4753-aa92-c7fab68c1013', 'published', true, 'Triduo', 'Solemne Triduo a Nuestra Señora de las Mercedes Coronada', null, 'Septiembre', 'Anual', 5, 'Culto anual documentado por la Hermandad.') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "place_id" = excluded."place_id", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "cult_type" = excluded."cult_type", "title" = excluded."title", "month" = excluded."month", "date_rule" = excluded."date_rule", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order", "description" = excluded."description";

insert into public."cult_entities" ("id", "cult_id", "entity_id", "role", "notes")
values ('1368a9cc-99c0-497e-a0f5-739edba5cbc6', 'fad6c2d1-d0d6-4e46-875e-5160ec4eb6dd', '2dffc8db-555c-4a39-ba9f-f1c689d11811', 'honoree', 'Titular al que se dedica el culto.') on conflict ("id") do update set "cult_id" = excluded."cult_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "cult_id")
values ('3329f3ce-5594-43e7-afb0-9adc426bf378', '95c1c1bd-0aba-4787-a5e1-b144a896a81e', 'fad6c2d1-d0d6-4e46-875e-5160ec4eb6dd') on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id";

insert into public."cults" ("id", "brotherhood_entity_id", "image_entity_id", "place_id", "status", "is_recurring", "cult_type", "title", "month", "date_rule", "recurrence_label", "display_order", "description")
values ('9268bd62-e36a-44d7-9f3c-382b1181360e', '0e4d1e8e-54ed-4a3f-a3b3-951be6d43505', '2dffc8db-555c-4a39-ba9f-f1c689d11811', 'ffb97fbf-63a5-4753-aa92-c7fab68c1013', 'published', true, 'Función Solemne', 'Función Solemne a Nuestra Señora de las Mercedes Coronada', null, 'Septiembre', 'Anual', 6, 'Culto anual documentado por la Hermandad.') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "place_id" = excluded."place_id", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "cult_type" = excluded."cult_type", "title" = excluded."title", "month" = excluded."month", "date_rule" = excluded."date_rule", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order", "description" = excluded."description";

insert into public."cult_entities" ("id", "cult_id", "entity_id", "role", "notes")
values ('f1a934d8-9901-4374-a94c-82a6e87e1cf3', '9268bd62-e36a-44d7-9f3c-382b1181360e', '2dffc8db-555c-4a39-ba9f-f1c689d11811', 'honoree', 'Titular al que se dedica el culto.') on conflict ("id") do update set "cult_id" = excluded."cult_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "cult_id")
values ('65f12cdb-3b31-4cb6-bb82-47a9b95a10d7', '95c1c1bd-0aba-4787-a5e1-b144a896a81e', '9268bd62-e36a-44d7-9f3c-382b1181360e') on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id";

insert into public."cults" ("id", "brotherhood_entity_id", "image_entity_id", "place_id", "status", "is_recurring", "cult_type", "title", "month", "date_rule", "recurrence_label", "display_order", "description")
values ('504e7b63-c44a-4db9-9cb0-8dbcac5f7ddd', '0e4d1e8e-54ed-4a3f-a3b3-951be6d43505', null, 'ffb97fbf-63a5-4753-aa92-c7fab68c1013', 'published', true, 'Triduo', 'Triduo al Santísimo Sacramento', null, 'En torno al Corpus Christi', 'Anual', 7, 'Culto anual documentado por la Hermandad.') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "place_id" = excluded."place_id", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "cult_type" = excluded."cult_type", "title" = excluded."title", "month" = excluded."month", "date_rule" = excluded."date_rule", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order", "description" = excluded."description";

insert into public."source_links" ("id", "source_id", "cult_id")
values ('011cd822-2ea7-4262-a1db-1d8e48625ad7', '95c1c1bd-0aba-4787-a5e1-b144a896a81e', '504e7b63-c44a-4db9-9cb0-8dbcac5f7ddd') on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id";

insert into public."outings" ("id", "brotherhood_entity_id", "outing_type", "character", "title", "outing_date", "year", "municipality_id", "origin_place_id", "destination_text", "description", "event_status", "status", "slug")
values ('647d7025-7c18-4528-8224-63e0e4d9388d', '0e4d1e8e-54ed-4a3f-a3b3-951be6d43505', 'Estación de Penitencia', 'ordinary', 'Santa Genoveva · Estación de Penitencia 2026', '2026-03-30', 2026, 'ca85889c-21fe-4367-8477-a57656b25da4', 'ffb97fbf-63a5-4753-aa92-c7fab68c1013', 'Santa Iglesia Catedral de Sevilla', 'Estación de penitencia del Lunes Santo de 2026.', 'held', 'published', 'santa-genoveva-estacion-penitencia-2026') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "outing_type" = excluded."outing_type", "character" = excluded."character", "title" = excluded."title", "outing_date" = excluded."outing_date", "year" = excluded."year", "municipality_id" = excluded."municipality_id", "origin_place_id" = excluded."origin_place_id", "destination_text" = excluded."destination_text", "description" = excluded."description", "event_status" = excluded."event_status", "status" = excluded."status", "slug" = excluded."slug";

insert into public."outing_entities" ("id", "outing_id", "entity_id", "role", "notes")
values ('d2f48b97-2073-4b41-96da-d552cbebab9a', '647d7025-7c18-4528-8224-63e0e4d9388d', '38e07d3a-7d32-436e-9ae8-31991a2d7aa4', 'processional_image', 'Imagen participante en la estación de penitencia.') on conflict ("id") do update set "outing_id" = excluded."outing_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."outing_entities" ("id", "outing_id", "entity_id", "role", "notes")
values ('8e4e4e86-1022-4679-bd28-672175103290', '647d7025-7c18-4528-8224-63e0e4d9388d', '2dffc8db-555c-4a39-ba9f-f1c689d11811', 'secondary_image', 'Imagen participante en la estación de penitencia.') on conflict ("id") do update set "outing_id" = excluded."outing_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "outing_id")
values ('132301ee-46a5-4ebe-8533-6cd71e50937e', '95c1c1bd-0aba-4787-a5e1-b144a896a81e', '647d7025-7c18-4528-8224-63e0e4d9388d') on conflict ("id") do update set "source_id" = excluded."source_id", "outing_id" = excluded."outing_id";

insert into public."outing_entities" ("id", "outing_id", "entity_id", "role", "notes")
values ('a2908915-ed9e-45a7-9049-f3fab25e1b70', 'b73f2543-4840-43af-ae52-06b116bebf67', '2dffc8db-555c-4a39-ba9f-f1c689d11811', 'processional_image', 'Nuestra Señora de las Mercedes Coronada preside el Rosario matutino anunciado para el 27 de septiembre de 2026.') on conflict ("id") do update set "outing_id" = excluded."outing_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('ec06d612-83e5-4a60-9135-9229960c200f', 'event', 'Fundación de la Hermandad de Santa Genoveva', 'fundacion-santa-genoveva-1956', 'Las primeras Reglas de la corporación fueron aprobadas en 1956.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."events" ("entity_id", "event_type", "event_date_text", "place_id", "description", "event_category", "brotherhood_entity_id", "municipality_id", "event_status")
values ('ec06d612-83e5-4a60-9135-9229960c200f', 'Hito histórico', '1956', 'ffb97fbf-63a5-4753-aa92-c7fab68c1013', 'Las primeras Reglas de la corporación fueron aprobadas en 1956.', 'historical', '0e4d1e8e-54ed-4a3f-a3b3-951be6d43505', 'ca85889c-21fe-4367-8477-a57656b25da4', 'held') on conflict ("entity_id") do update set "event_type" = excluded."event_type", "event_date_text" = excluded."event_date_text", "place_id" = excluded."place_id", "description" = excluded."description", "event_category" = excluded."event_category", "brotherhood_entity_id" = excluded."brotherhood_entity_id", "municipality_id" = excluded."municipality_id", "event_status" = excluded."event_status";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('598a69b0-d5b1-46b1-8871-6e9252bd25e3', '60572e31-51af-4a68-9f18-bd208598b98c', 'ec06d612-83e5-4a60-9135-9229960c200f') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('c0c81816-9bcb-4596-9e75-f9b21d7c9c1c', 'event', 'Primera estación completa de Santa Genoveva', 'primera-estacion-santa-genoveva-1958', 'La cofradía realizó su primera estación completa a la Catedral.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."events" ("entity_id", "event_type", "event_date_text", "place_id", "description", "event_category", "brotherhood_entity_id", "municipality_id", "event_status")
values ('c0c81816-9bcb-4596-9e75-f9b21d7c9c1c', 'Hito histórico', '1958', null, 'La cofradía realizó su primera estación completa a la Catedral.', 'historical', '0e4d1e8e-54ed-4a3f-a3b3-951be6d43505', 'ca85889c-21fe-4367-8477-a57656b25da4', 'held') on conflict ("entity_id") do update set "event_type" = excluded."event_type", "event_date_text" = excluded."event_date_text", "place_id" = excluded."place_id", "description" = excluded."description", "event_category" = excluded."event_category", "brotherhood_entity_id" = excluded."brotherhood_entity_id", "municipality_id" = excluded."municipality_id", "event_status" = excluded."event_status";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('4234a30e-bf6e-4458-a296-e196a8f58ba6', '60572e31-51af-4a68-9f18-bd208598b98c', 'c0c81816-9bcb-4596-9e75-f9b21d7c9c1c') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('f1f82a0d-a54f-415a-91d8-ba93f858e6b1', 'event', 'Cautivo de Santa Genoveva en el Vía Crucis del Consejo', 'cautivo-santa-genoveva-via-crucis-1993', 'Nuestro Padre Jesús Cautivo presidió el Vía Crucis de las Hermandades.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."events" ("entity_id", "event_type", "event_date_text", "place_id", "description", "event_category", "brotherhood_entity_id", "municipality_id", "event_status")
values ('f1f82a0d-a54f-415a-91d8-ba93f858e6b1', 'Hito histórico', '1993', null, 'Nuestro Padre Jesús Cautivo presidió el Vía Crucis de las Hermandades.', 'historical', '0e4d1e8e-54ed-4a3f-a3b3-951be6d43505', 'ca85889c-21fe-4367-8477-a57656b25da4', 'held') on conflict ("entity_id") do update set "event_type" = excluded."event_type", "event_date_text" = excluded."event_date_text", "place_id" = excluded."place_id", "description" = excluded."description", "event_category" = excluded."event_category", "brotherhood_entity_id" = excluded."brotherhood_entity_id", "municipality_id" = excluded."municipality_id", "event_status" = excluded."event_status";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('3d5f09be-b458-4b00-b73e-fea49880761d', '60572e31-51af-4a68-9f18-bd208598b98c', 'f1f82a0d-a54f-415a-91d8-ba93f858e6b1') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('f3100d8d-3f74-4c4a-aaf2-7e8bc78b772a', 'event', 'Coronación canónica de la Virgen de las Mercedes', 'coronacion-mercedes-santa-genoveva-1997', 'Nuestra Señora de las Mercedes fue coronada canónicamente.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."events" ("entity_id", "event_type", "event_date_text", "place_id", "description", "event_category", "brotherhood_entity_id", "municipality_id", "event_status")
values ('f3100d8d-3f74-4c4a-aaf2-7e8bc78b772a', 'Hito histórico', '23 de septiembre de 1997', null, 'Nuestra Señora de las Mercedes fue coronada canónicamente.', 'historical', '0e4d1e8e-54ed-4a3f-a3b3-951be6d43505', 'ca85889c-21fe-4367-8477-a57656b25da4', 'held') on conflict ("entity_id") do update set "event_type" = excluded."event_type", "event_date_text" = excluded."event_date_text", "place_id" = excluded."place_id", "description" = excluded."description", "event_category" = excluded."event_category", "brotherhood_entity_id" = excluded."brotherhood_entity_id", "municipality_id" = excluded."municipality_id", "event_status" = excluded."event_status";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('326a3c23-5708-45b0-9695-dc62f024577d', '7bebeedc-9788-4f42-9019-5195cd0b72a4', 'f3100d8d-3f74-4c4a-aaf2-7e8bc78b772a') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."brotherhood_habits" ("id", "brotherhood_entity_id", "name", "tunic_description", "hood_description", "cord_description", "footwear_description", "sort_order", "notes", "status")
values ('c5029d99-2d93-4dfd-bb20-5619ea0e7271', '0e4d1e8e-54ed-4a3f-a3b3-951be6d43505', 'Hábito de Santa Genoveva', 'Túnica blanca con capa blanca.', 'Antifaz negro con escudo mercedario.', 'Correa mercedaria.', 'Calzado negro.', 1, 'Hábito único de la estación de penitencia.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "name" = excluded."name", "tunic_description" = excluded."tunic_description", "hood_description" = excluded."hood_description", "cord_description" = excluded."cord_description", "footwear_description" = excluded."footwear_description", "sort_order" = excluded."sort_order", "notes" = excluded."notes", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('f8f0a5e5-c356-4a33-84bc-cf391a2a0fed', 'heritage_asset', 'Talla del paso del Cautivo de Santa Genoveva', 'talla-paso-cautivo-santa-genoveva', 'Programa de talla neobarroca del paso del Señor.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."heritage_assets" ("entity_id", "parent_entity_id", "asset_type", "description", "current_condition", "is_current", "display_order", "is_featured")
values ('f8f0a5e5-c356-4a33-84bc-cf391a2a0fed', '0e4d1e8e-54ed-4a3f-a3b3-951be6d43505', 'Paso procesional', 'Programa de talla neobarroca del paso del Señor.', 'Conservado', true, 1, true) on conflict ("entity_id") do update set "parent_entity_id" = excluded."parent_entity_id", "asset_type" = excluded."asset_type", "description" = excluded."description", "current_condition" = excluded."current_condition", "is_current" = excluded."is_current", "display_order" = excluded."display_order", "is_featured" = excluded."is_featured";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('dac21fe8-40ec-4f7f-8a9c-cde628f55dd3', 'heritage_asset', 'Conjunto de palio de la Virgen de las Mercedes', 'conjunto-palio-mercedes-santa-genoveva', 'Conjunto patrimonial del paso de palio.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."heritage_assets" ("entity_id", "parent_entity_id", "asset_type", "description", "current_condition", "is_current", "display_order", "is_featured")
values ('dac21fe8-40ec-4f7f-8a9c-cde628f55dd3', '0e4d1e8e-54ed-4a3f-a3b3-951be6d43505', 'Bordados y orfebrería', 'Conjunto patrimonial del paso de palio.', 'Conservado', true, 2, false) on conflict ("entity_id") do update set "parent_entity_id" = excluded."parent_entity_id", "asset_type" = excluded."asset_type", "description" = excluded."description", "current_condition" = excluded."current_condition", "is_current" = excluded."is_current", "display_order" = excluded."display_order", "is_featured" = excluded."is_featured";

insert into public."music_accompaniment_periods" ("id", "brotherhood_entity_id", "band_entity_id", "step_entity_id", "position", "outing_type", "date_from_text", "year_from", "is_current", "notes", "public_brotherhood_name", "public_step_name", "public_brotherhood_slug", "public_municipality_name", "public_municipality_slug", "public_province", "status")
values ('98e6f29c-1d71-418e-821f-5a780fe4715e', '0e4d1e8e-54ed-4a3f-a3b3-951be6d43505', '8b2e073f-17ae-482c-ae21-9dccd5aac09e', 'fffbed2b-cae5-40bc-9236-cfe18d631c73', 'Tras el paso de misterio', 'Lunes Santo', 'Desde 2019', 2019, true, 'Vigente en 2026.', 'Hermandad de Santa Genoveva', 'Nuestro Padre Jesús Cautivo', 'santa-genoveva', 'Sevilla', 'sevilla', 'Sevilla', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "band_entity_id" = excluded."band_entity_id", "step_entity_id" = excluded."step_entity_id", "position" = excluded."position", "outing_type" = excluded."outing_type", "date_from_text" = excluded."date_from_text", "year_from" = excluded."year_from", "is_current" = excluded."is_current", "notes" = excluded."notes", "public_brotherhood_name" = excluded."public_brotherhood_name", "public_step_name" = excluded."public_step_name", "public_brotherhood_slug" = excluded."public_brotherhood_slug", "public_municipality_name" = excluded."public_municipality_name", "public_municipality_slug" = excluded."public_municipality_slug", "public_province" = excluded."public_province", "status" = excluded."status";

insert into public."music_accompaniment_periods" ("id", "brotherhood_entity_id", "band_entity_id", "step_entity_id", "position", "outing_type", "date_from_text", "is_current", "notes", "public_brotherhood_name", "public_step_name", "public_brotherhood_slug", "public_municipality_name", "public_municipality_slug", "public_province", "status")
values ('cc1204b9-ee5f-412b-9e4c-df811a4e8b6a', '0e4d1e8e-54ed-4a3f-a3b3-951be6d43505', '24e2b89a-4d72-4ea8-9144-8972cf751046', 'd3371924-40d2-48b3-91a3-4d7622272349', 'Tras el paso de palio', 'Lunes Santo', 'Vigente · 2026', true, 'Acompañamiento incluido en el calendario penitencial oficial de 2026.', 'Hermandad de Santa Genoveva', 'Nuestra Señora de las Mercedes Coronada', 'santa-genoveva', 'Sevilla', 'sevilla', 'Sevilla', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "band_entity_id" = excluded."band_entity_id", "step_entity_id" = excluded."step_entity_id", "position" = excluded."position", "outing_type" = excluded."outing_type", "date_from_text" = excluded."date_from_text", "is_current" = excluded."is_current", "notes" = excluded."notes", "public_brotherhood_name" = excluded."public_brotherhood_name", "public_step_name" = excluded."public_step_name", "public_brotherhood_slug" = excluded."public_brotherhood_slug", "public_municipality_name" = excluded."public_municipality_name", "public_municipality_slug" = excluded."public_municipality_slug", "public_province" = excluded."public_province", "status" = excluded."status";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('ab4b5a92-effb-4a70-a8bb-82b255a194ac', '95c1c1bd-0aba-4787-a5e1-b144a896a81e', '0e4d1e8e-54ed-4a3f-a3b3-951be6d43505') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('a228aac0-2748-4fce-81b7-4971161abb51', '60572e31-51af-4a68-9f18-bd208598b98c', '0e4d1e8e-54ed-4a3f-a3b3-951be6d43505') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('0ae08cc6-eff2-4023-92b8-3db7dce6ce59', 'c56b0dc9-c20d-402e-81cd-6e570fc6ac5a', '0e4d1e8e-54ed-4a3f-a3b3-951be6d43505') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('aff36106-d5d4-4575-87d8-89eca156d21b', '7bebeedc-9788-4f42-9019-5195cd0b72a4', '0e4d1e8e-54ed-4a3f-a3b3-951be6d43505') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('32020c4e-5465-43cb-bc2d-7f90e3b5315f', '900d5d07-d515-48ee-9d2f-71a1a782cf63', '0e4d1e8e-54ed-4a3f-a3b3-951be6d43505') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('462e511b-300d-409a-9cfa-1dd3c5c34020', 'fed6a046-3a6a-468e-a95d-279c20ece25c', '0e4d1e8e-54ed-4a3f-a3b3-951be6d43505') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('4baf0981-7808-400f-8ac8-00560559a875', '9666f211-0155-4435-878f-899f8ccabb6e', '0e4d1e8e-54ed-4a3f-a3b3-951be6d43505') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('f0a8e5b3-84a6-4f7a-aa1f-3525aa271a50', 'c56b0dc9-c20d-402e-81cd-6e570fc6ac5a', '38e07d3a-7d32-436e-9ae8-31991a2d7aa4') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('21680ad7-808d-44e6-84d1-ca09e023effd', '7bebeedc-9788-4f42-9019-5195cd0b72a4', '2dffc8db-555c-4a39-ba9f-f1c689d11811') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('1a8d5446-582f-4f25-b58d-7f728784c9b8', '900d5d07-d515-48ee-9d2f-71a1a782cf63', 'f8f0a5e5-c356-4a33-84bc-cf391a2a0fed') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('5fc3ab0d-e4c7-4ede-a54a-076959f76f0e', 'fed6a046-3a6a-468e-a95d-279c20ece25c', 'dac21fe8-40ec-4f7f-8a9c-cde628f55dd3') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('06ba8b18-dff2-46eb-b662-7e6680e03e0f', 'Web oficial · Hermandad de Santa Marta', 'https://hermandaddesantamarta.org/', 'web', 'Hermandad de Santa Marta', '2026-09-14', 'Identidad, actualidad y cultos oficiales.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('f920b9de-c569-4e90-8758-1c3dba720957', 'Misterio procesional · Hermandad de Santa Marta', 'https://hermandaddesantamarta.org/cofradia/misterio-procesional/', 'web', 'Hermandad de Santa Marta', '2026-09-14', 'Composición, autorías y sentido del único paso.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('964906b6-8248-41e2-a9b4-c8711ee8e8b1', 'Lunes Santo 2026 · Hermandad de Santa Marta', 'https://hermandaddesantamarta.org/lunes-santo-2026/', 'web', 'Hermandad de Santa Marta', '2026-09-14', 'Estación de penitencia de 2026 y carácter silencioso.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('655ccb4b-7878-4f76-a574-6e57e1266303', 'brotherhood', 'Hermandad de Santa Marta', 'santa-marta-sevilla', 'Hermandad sacramental y de penitencia con sede en San Andrés.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."brotherhoods" ("entity_id", "official_name", "popular_name", "foundation_text", "municipality_id", "canonical_see_place_id", "neighborhood", "website_url", "brotherhood_types", "current_procession_day", "history_text", "notes")
values ('655ccb4b-7878-4f76-a574-6e57e1266303', 'Real, Muy Ilustre y Venerable Hermandad del Santísimo Sacramento, Inmaculada Concepción, Ánimas Benditas y Cofradía de Nazarenos del Santísimo Cristo de la Caridad en su Traslado al Sepulcro, Nuestra Señora de las Penas, Santa Marta y San Andrés Apóstol', 'Santa Marta', '1948', 'ca85889c-21fe-4367-8477-a57656b25da4', '850cfa4d-9b76-412f-aeca-a38e3e2fa91f', 'San Andrés', 'https://hermandaddesantamarta.org/', ARRAY['Penitencia', 'Sacramental']::text[], 'Lunes Santo', 'Fundada en 1948 por iniciativa vinculada al gremio de hostelería, realizó su primera estación de penitencia en 1953 y se fusionó con la Sacramental de San Andrés.', 'La estación de penitencia se realiza en silencio. Sin fotografías nuevas sin licencia reutilizable.') on conflict ("entity_id") do update set "official_name" = excluded."official_name", "popular_name" = excluded."popular_name", "foundation_text" = excluded."foundation_text", "municipality_id" = excluded."municipality_id", "canonical_see_place_id" = excluded."canonical_see_place_id", "neighborhood" = excluded."neighborhood", "website_url" = excluded."website_url", "brotherhood_types" = excluded."brotherhood_types", "current_procession_day" = excluded."current_procession_day", "history_text" = excluded."history_text", "notes" = excluded."notes";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('9d04b768-d56d-4ade-aba4-98afce335d2b', 'image', 'Santísimo Cristo de la Caridad', 'santisimo-cristo-caridad-santa-marta-sevilla', 'Cristo yacente de Luis Ortega Bru para el misterio del Traslado al Sepulcro.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."images" ("entity_id", "image_type", "execution_date_text", "current_condition", "description", "is_dress_image")
values ('9d04b768-d56d-4ade-aba4-98afce335d2b', 'Cristo yacente', '1953', 'extant', 'Imagen del Redentor yacente trasladado al sepulcro.', false) on conflict ("entity_id") do update set "image_type" = excluded."image_type", "execution_date_text" = excluded."execution_date_text", "current_condition" = excluded."current_condition", "description" = excluded."description", "is_dress_image" = excluded."is_dress_image";

insert into public."brotherhood_images" ("id", "brotherhood_entity_id", "image_entity_id", "relation_type", "notes", "status")
values ('6f45f807-78fc-4f0a-bd73-358c1f1d3a5a', '655ccb4b-7878-4f76-a574-6e57e1266303', '9d04b768-d56d-4ade-aba4-98afce335d2b', 'titular', 'Titular vigente documentado.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_authorships" ("id", "image_entity_id", "agent_entity_id", "authorship_type", "role_name", "date_from_text", "certainty", "notes", "status")
values ('a340d86e-f28e-4e32-9572-8afc39e6109a', '9d04b768-d56d-4ade-aba4-98afce335d2b', '13000000-0000-0000-0000-000000000001', 'author', 'escultor', '1953', 'documented', 'Autoría documentada.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "agent_entity_id" = excluded."agent_entity_id", "authorship_type" = excluded."authorship_type", "role_name" = excluded."role_name", "date_from_text" = excluded."date_from_text", "certainty" = excluded."certainty", "notes" = excluded."notes", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('939dafde-d5eb-4b01-9fd2-ed9713446a6f', 'image', 'Nuestra Señora de las Penas', 'nuestra-senora-penas-santa-marta-sevilla', 'Dolorosa de Sebastián Santos integrada en el misterio procesional.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."images" ("entity_id", "image_type", "execution_date_text", "current_condition", "description", "is_dress_image")
values ('939dafde-d5eb-4b01-9fd2-ed9713446a6f', 'Dolorosa', '1958', 'extant', 'Dolorosa que acompaña al Santísimo Cristo de la Caridad en el Traslado al Sepulcro.', true) on conflict ("entity_id") do update set "image_type" = excluded."image_type", "execution_date_text" = excluded."execution_date_text", "current_condition" = excluded."current_condition", "description" = excluded."description", "is_dress_image" = excluded."is_dress_image";

insert into public."brotherhood_images" ("id", "brotherhood_entity_id", "image_entity_id", "relation_type", "notes", "status")
values ('0e0b9e9e-dd60-4162-a908-855f9f1e521e', '655ccb4b-7878-4f76-a574-6e57e1266303', '939dafde-d5eb-4b01-9fd2-ed9713446a6f', 'titular', 'Titular vigente documentado.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_authorships" ("id", "image_entity_id", "agent_entity_id", "authorship_type", "role_name", "date_from_text", "certainty", "notes", "status")
values ('3f3197d5-379c-43e3-bd1e-336e3e275fe1', '939dafde-d5eb-4b01-9fd2-ed9713446a6f', '13fb6b36-f879-41ef-ab19-90d97e693972', 'author', 'escultor', '1958', 'documented', 'Autoría documentada.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "agent_entity_id" = excluded."agent_entity_id", "authorship_type" = excluded."authorship_type", "role_name" = excluded."role_name", "date_from_text" = excluded."date_from_text", "certainty" = excluded."certainty", "notes" = excluded."notes", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('c6807fe8-5a72-4ec5-89c2-dc632ef3111d', 'image', 'Santa Marta', 'santa-marta-titular-sevilla', 'Titular hagiográfica de la corporación.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."images" ("entity_id", "image_type", "execution_date_text", "current_condition", "description", "is_dress_image")
values ('c6807fe8-5a72-4ec5-89c2-dc632ef3111d', 'Santa', '1950', 'extant', 'Imagen titular de Santa Marta, patrona del gremio de hostelería.', false) on conflict ("entity_id") do update set "image_type" = excluded."image_type", "execution_date_text" = excluded."execution_date_text", "current_condition" = excluded."current_condition", "description" = excluded."description", "is_dress_image" = excluded."is_dress_image";

insert into public."brotherhood_images" ("id", "brotherhood_entity_id", "image_entity_id", "relation_type", "notes", "status")
values ('bdabb11e-9371-4343-8d57-35f4784fcdf2', '655ccb4b-7878-4f76-a574-6e57e1266303', 'c6807fe8-5a72-4ec5-89c2-dc632ef3111d', 'titular', 'Titular vigente documentado.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_authorships" ("id", "image_entity_id", "agent_entity_id", "authorship_type", "role_name", "date_from_text", "certainty", "notes", "status")
values ('a8f09d75-5020-4f87-aa41-202d35e0e7a6', 'c6807fe8-5a72-4ec5-89c2-dc632ef3111d', '13fb6b36-f879-41ef-ab19-90d97e693972', 'author', 'escultor', '1950', 'documented', 'Autoría documentada.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "agent_entity_id" = excluded."agent_entity_id", "authorship_type" = excluded."authorship_type", "role_name" = excluded."role_name", "date_from_text" = excluded."date_from_text", "certainty" = excluded."certainty", "notes" = excluded."notes", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('045d0bc2-ad5f-4a1b-be7b-d5088d43e362', 'image', 'San Andrés Apóstol de Santa Marta', 'san-andres-apostol-santa-marta-sevilla', 'Titular apostólico de la Hermandad de Santa Marta.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."images" ("entity_id", "image_type", "execution_date_text", "current_condition", "description", "is_dress_image")
values ('045d0bc2-ad5f-4a1b-be7b-d5088d43e362', 'Apóstol', 'Cronología no precisada', 'extant', 'Titular vinculado a la sede canónica de San Andrés.', false) on conflict ("entity_id") do update set "image_type" = excluded."image_type", "execution_date_text" = excluded."execution_date_text", "current_condition" = excluded."current_condition", "description" = excluded."description", "is_dress_image" = excluded."is_dress_image";

insert into public."brotherhood_images" ("id", "brotherhood_entity_id", "image_entity_id", "relation_type", "notes", "status")
values ('1d3ea0cd-8227-4a7c-82a6-07ddb5ca0bc8', '655ccb4b-7878-4f76-a574-6e57e1266303', '045d0bc2-ad5f-4a1b-be7b-d5088d43e362', 'titular', 'Titular vigente documentado.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_authorships" ("id", "image_entity_id", "agent_entity_id", "authorship_type", "role_name", "date_from_text", "certainty", "notes", "status")
values ('65736c7f-00c1-4716-99bb-57627be98c49', '045d0bc2-ad5f-4a1b-be7b-d5088d43e362', null, 'anonymous', 'escultor', 'Cronología no precisada', 'unknown', 'Autoría no identificada por la fuente oficial.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "agent_entity_id" = excluded."agent_entity_id", "authorship_type" = excluded."authorship_type", "role_name" = excluded."role_name", "date_from_text" = excluded."date_from_text", "certainty" = excluded."certainty", "notes" = excluded."notes", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('9cb44e26-9be2-443d-b133-d42afb331efe', 'step', 'Paso del Traslado al Sepulcro de Santa Marta', 'paso-traslado-sepulcro-santa-marta-sevilla', 'Único paso de la Hermandad de Santa Marta, concebido por Luis Ortega Bru.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."steps" ("entity_id", "step_type", "current_condition", "execution_date_text", "description")
values ('9cb44e26-9be2-443d-b133-d42afb331efe', 'Misterio', 'preserved', null, 'Representa el traslado de Cristo al Sepulcro por José de Arimatea y Nicodemo, acompañado por la Virgen, San Juan y las santas mujeres.') on conflict ("entity_id") do update set "step_type" = excluded."step_type", "current_condition" = excluded."current_condition", "execution_date_text" = excluded."execution_date_text", "description" = excluded."description";

insert into public."brotherhood_steps" ("id", "brotherhood_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('5cfa0b2b-482e-49f0-83dc-19f6f8736903', '655ccb4b-7878-4f76-a574-6e57e1266303', '9cb44e26-9be2-443d-b133-d42afb331efe', 'current', 'Paso procesional vigente.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_steps" ("id", "image_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('a00ac9e6-2a96-4824-9c24-03f06e7befed', '9d04b768-d56d-4ade-aba4-98afce335d2b', '9cb44e26-9be2-443d-b133-d42afb331efe', 'processional', 'Imagen principal del paso.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_steps" ("id", "image_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('06497cf9-f563-40e9-8a2c-f1e7cb34dbfe', '939dafde-d5eb-4b01-9fd2-ed9713446a6f', '9cb44e26-9be2-443d-b133-d42afb331efe', 'secondary', 'Imagen integrada en el conjunto procesional.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_steps" ("id", "image_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('3d6d25dd-3c51-44f4-aa2a-63b37ed1f01e', 'c6807fe8-5a72-4ec5-89c2-dc632ef3111d', '9cb44e26-9be2-443d-b133-d42afb331efe', 'secondary', 'Imagen integrada en el conjunto procesional.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."cults" ("id", "brotherhood_entity_id", "image_entity_id", "place_id", "status", "is_recurring", "cult_type", "title", "month", "date_rule", "recurrence_label", "display_order", "description")
values ('53549553-75f2-4294-8bef-1cebb9d45936', '655ccb4b-7878-4f76-a574-6e57e1266303', '9d04b768-d56d-4ade-aba4-98afce335d2b', '850cfa4d-9b76-412f-aeca-a38e3e2fa91f', 'published', true, 'Quinario', 'Solemne Quinario al Santísimo Cristo de la Caridad', null, 'Cuaresma', 'Anual', 1, 'Culto anual de la corporación.') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "place_id" = excluded."place_id", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "cult_type" = excluded."cult_type", "title" = excluded."title", "month" = excluded."month", "date_rule" = excluded."date_rule", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order", "description" = excluded."description";

insert into public."cult_entities" ("id", "cult_id", "entity_id", "role", "notes")
values ('a8da67e5-11f1-45ea-ac48-fb96a60908f2', '53549553-75f2-4294-8bef-1cebb9d45936', '9d04b768-d56d-4ade-aba4-98afce335d2b', 'honoree', 'Titular al que se dedica el culto.') on conflict ("id") do update set "cult_id" = excluded."cult_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "cult_id")
values ('deea7f41-a593-4d15-9e15-6d0c0539ef16', '06ba8b18-dff2-46eb-b662-7e6680e03e0f', '53549553-75f2-4294-8bef-1cebb9d45936') on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id";

insert into public."cults" ("id", "brotherhood_entity_id", "image_entity_id", "place_id", "status", "is_recurring", "cult_type", "title", "month", "date_rule", "recurrence_label", "display_order", "description")
values ('b0e5bcd9-48c8-4ddb-aa11-d4fc7b043145', '655ccb4b-7878-4f76-a574-6e57e1266303', '9d04b768-d56d-4ade-aba4-98afce335d2b', '850cfa4d-9b76-412f-aeca-a38e3e2fa91f', 'published', true, 'Función Principal', 'Función Principal de Instituto', null, 'Domingo posterior al Quinario', 'Anual', 2, 'Culto anual de la corporación.') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "place_id" = excluded."place_id", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "cult_type" = excluded."cult_type", "title" = excluded."title", "month" = excluded."month", "date_rule" = excluded."date_rule", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order", "description" = excluded."description";

insert into public."cult_entities" ("id", "cult_id", "entity_id", "role", "notes")
values ('87eafbaf-86ca-4000-ba8b-cc120131b981', 'b0e5bcd9-48c8-4ddb-aa11-d4fc7b043145', '9d04b768-d56d-4ade-aba4-98afce335d2b', 'honoree', 'Titular al que se dedica el culto.') on conflict ("id") do update set "cult_id" = excluded."cult_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "cult_id")
values ('efa2998c-769c-4854-9bea-6416ea5625ad', '06ba8b18-dff2-46eb-b662-7e6680e03e0f', 'b0e5bcd9-48c8-4ddb-aa11-d4fc7b043145') on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id";

insert into public."cults" ("id", "brotherhood_entity_id", "image_entity_id", "place_id", "status", "is_recurring", "cult_type", "title", "month", "date_rule", "recurrence_label", "display_order", "description")
values ('0beae48b-b085-4ef2-be1d-8b7132c9a6a3', '655ccb4b-7878-4f76-a574-6e57e1266303', '9d04b768-d56d-4ade-aba4-98afce335d2b', '850cfa4d-9b76-412f-aeca-a38e3e2fa91f', 'published', true, 'Vía Crucis', 'Vía Crucis del Santísimo Cristo de la Caridad', null, 'Primer martes de Cuaresma', 'Anual', 3, 'Culto anual de la corporación.') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "place_id" = excluded."place_id", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "cult_type" = excluded."cult_type", "title" = excluded."title", "month" = excluded."month", "date_rule" = excluded."date_rule", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order", "description" = excluded."description";

insert into public."cult_entities" ("id", "cult_id", "entity_id", "role", "notes")
values ('32d64fa3-7a5f-44cf-8b0b-f40879cbab23', '0beae48b-b085-4ef2-be1d-8b7132c9a6a3', '9d04b768-d56d-4ade-aba4-98afce335d2b', 'honoree', 'Titular al que se dedica el culto.') on conflict ("id") do update set "cult_id" = excluded."cult_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "cult_id")
values ('2d81be5c-6189-45cb-8adb-621ce981800b', '06ba8b18-dff2-46eb-b662-7e6680e03e0f', '0beae48b-b085-4ef2-be1d-8b7132c9a6a3') on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id";

insert into public."cults" ("id", "brotherhood_entity_id", "image_entity_id", "place_id", "status", "is_recurring", "cult_type", "title", "month", "date_rule", "recurrence_label", "display_order", "description")
values ('493a06c3-dccb-4587-af2e-bb9eb897f684', '655ccb4b-7878-4f76-a574-6e57e1266303', 'c6807fe8-5a72-4ec5-89c2-dc632ef3111d', '850cfa4d-9b76-412f-aeca-a38e3e2fa91f', 'published', true, 'Triduo', 'Solemne Triduo a Santa Marta', null, 'En torno al 29 de julio', 'Anual', 4, 'Culto anual de la corporación.') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "place_id" = excluded."place_id", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "cult_type" = excluded."cult_type", "title" = excluded."title", "month" = excluded."month", "date_rule" = excluded."date_rule", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order", "description" = excluded."description";

insert into public."cult_entities" ("id", "cult_id", "entity_id", "role", "notes")
values ('b29965e6-eb4f-4fc7-816d-6af095a98c16', '493a06c3-dccb-4587-af2e-bb9eb897f684', 'c6807fe8-5a72-4ec5-89c2-dc632ef3111d', 'honoree', 'Titular al que se dedica el culto.') on conflict ("id") do update set "cult_id" = excluded."cult_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "cult_id")
values ('75493b7c-97fc-4a72-87f1-7e68f4127877', '06ba8b18-dff2-46eb-b662-7e6680e03e0f', '493a06c3-dccb-4587-af2e-bb9eb897f684') on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id";

insert into public."cults" ("id", "brotherhood_entity_id", "image_entity_id", "place_id", "status", "is_recurring", "cult_type", "title", "month", "date_rule", "recurrence_label", "display_order", "description")
values ('c5d82ba7-9e17-426e-a6c9-0871eaada05f', '655ccb4b-7878-4f76-a574-6e57e1266303', '939dafde-d5eb-4b01-9fd2-ed9713446a6f', '850cfa4d-9b76-412f-aeca-a38e3e2fa91f', 'published', true, 'Triduo', 'Cultos a Nuestra Señora de las Penas', null, 'Mes de noviembre', 'Anual', 5, 'Culto anual de la corporación.') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "place_id" = excluded."place_id", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "cult_type" = excluded."cult_type", "title" = excluded."title", "month" = excluded."month", "date_rule" = excluded."date_rule", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order", "description" = excluded."description";

insert into public."cult_entities" ("id", "cult_id", "entity_id", "role", "notes")
values ('de0583a7-31cd-4946-8671-a46f196bf148', 'c5d82ba7-9e17-426e-a6c9-0871eaada05f', '939dafde-d5eb-4b01-9fd2-ed9713446a6f', 'honoree', 'Titular al que se dedica el culto.') on conflict ("id") do update set "cult_id" = excluded."cult_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "cult_id")
values ('b1d9129d-f587-44b5-af7d-c44b67fac321', '06ba8b18-dff2-46eb-b662-7e6680e03e0f', 'c5d82ba7-9e17-426e-a6c9-0871eaada05f') on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id";

insert into public."cults" ("id", "brotherhood_entity_id", "image_entity_id", "place_id", "status", "is_recurring", "cult_type", "title", "month", "date_rule", "recurrence_label", "display_order", "description")
values ('3928294b-2fa3-4056-abba-474f9dd9d384', '655ccb4b-7878-4f76-a574-6e57e1266303', null, '850cfa4d-9b76-412f-aeca-a38e3e2fa91f', 'published', true, 'Triduo', 'Cultos al Santísimo Sacramento', null, 'En torno al Corpus Christi', 'Anual', 6, 'Culto anual de la corporación.') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "place_id" = excluded."place_id", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "cult_type" = excluded."cult_type", "title" = excluded."title", "month" = excluded."month", "date_rule" = excluded."date_rule", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order", "description" = excluded."description";

insert into public."source_links" ("id", "source_id", "cult_id")
values ('2be5beea-e73a-492a-a237-aab1ff2fd9c5', '06ba8b18-dff2-46eb-b662-7e6680e03e0f', '3928294b-2fa3-4056-abba-474f9dd9d384') on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id";

insert into public."outings" ("id", "brotherhood_entity_id", "outing_type", "character", "title", "outing_date", "year", "municipality_id", "origin_place_id", "destination_text", "description", "event_status", "status", "slug")
values ('17a35a4d-b1af-42a4-bc2c-84d92c5cf069', '655ccb4b-7878-4f76-a574-6e57e1266303', 'Estación de Penitencia', 'ordinary', 'Santa Marta · Estación de Penitencia 2026', '2026-03-30', 2026, 'ca85889c-21fe-4367-8477-a57656b25da4', '850cfa4d-9b76-412f-aeca-a38e3e2fa91f', 'Santa Iglesia Catedral de Sevilla', 'Estación de penitencia del Lunes Santo de 2026.', 'held', 'published', 'santa-marta-estacion-penitencia-2026') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "outing_type" = excluded."outing_type", "character" = excluded."character", "title" = excluded."title", "outing_date" = excluded."outing_date", "year" = excluded."year", "municipality_id" = excluded."municipality_id", "origin_place_id" = excluded."origin_place_id", "destination_text" = excluded."destination_text", "description" = excluded."description", "event_status" = excluded."event_status", "status" = excluded."status", "slug" = excluded."slug";

insert into public."outing_entities" ("id", "outing_id", "entity_id", "role", "notes")
values ('658d0e20-9444-4564-a055-c20eb9666147', '17a35a4d-b1af-42a4-bc2c-84d92c5cf069', '9d04b768-d56d-4ade-aba4-98afce335d2b', 'processional_image', 'Imagen participante en la estación de penitencia.') on conflict ("id") do update set "outing_id" = excluded."outing_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."outing_entities" ("id", "outing_id", "entity_id", "role", "notes")
values ('0e2da427-1d89-4dff-a9a9-6322d2867378', '17a35a4d-b1af-42a4-bc2c-84d92c5cf069', '939dafde-d5eb-4b01-9fd2-ed9713446a6f', 'secondary_image', 'Imagen participante en la estación de penitencia.') on conflict ("id") do update set "outing_id" = excluded."outing_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."outing_entities" ("id", "outing_id", "entity_id", "role", "notes")
values ('cb3d409a-0df3-4a78-ba88-f2afe66441be', '17a35a4d-b1af-42a4-bc2c-84d92c5cf069', 'c6807fe8-5a72-4ec5-89c2-dc632ef3111d', 'secondary_image', 'Imagen participante en la estación de penitencia.') on conflict ("id") do update set "outing_id" = excluded."outing_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "outing_id")
values ('1318f307-b6ef-490d-9094-152d423fafdd', '964906b6-8248-41e2-a9b4-c8711ee8e8b1', '17a35a4d-b1af-42a4-bc2c-84d92c5cf069') on conflict ("id") do update set "source_id" = excluded."source_id", "outing_id" = excluded."outing_id";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('bfde5d49-35ea-4a82-92d0-9ed671c97269', 'event', 'Fundación de la Hermandad de Santa Marta', 'fundacion-santa-marta-sevilla-1948', 'La corporación fue fundada en 1948 por miembros del gremio de hostelería.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."events" ("entity_id", "event_type", "event_date_text", "place_id", "description", "event_category", "brotherhood_entity_id", "municipality_id", "event_status")
values ('bfde5d49-35ea-4a82-92d0-9ed671c97269', 'Hito histórico', '1948', null, 'La corporación fue fundada en 1948 por miembros del gremio de hostelería.', 'historical', '655ccb4b-7878-4f76-a574-6e57e1266303', 'ca85889c-21fe-4367-8477-a57656b25da4', 'held') on conflict ("entity_id") do update set "event_type" = excluded."event_type", "event_date_text" = excluded."event_date_text", "place_id" = excluded."place_id", "description" = excluded."description", "event_category" = excluded."event_category", "brotherhood_entity_id" = excluded."brotherhood_entity_id", "municipality_id" = excluded."municipality_id", "event_status" = excluded."event_status";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('3e18cab2-ae34-47b3-8675-f7f078f56e08', '06ba8b18-dff2-46eb-b662-7e6680e03e0f', 'bfde5d49-35ea-4a82-92d0-9ed671c97269') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('832b8411-1e35-4d20-a895-756e788d7ce6', 'event', 'Primera estación de penitencia de Santa Marta', 'primera-estacion-santa-marta-1953', 'La Hermandad realizó su primera estación de penitencia a la Catedral.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."events" ("entity_id", "event_type", "event_date_text", "place_id", "description", "event_category", "brotherhood_entity_id", "municipality_id", "event_status")
values ('832b8411-1e35-4d20-a895-756e788d7ce6', 'Hito histórico', '1953', null, 'La Hermandad realizó su primera estación de penitencia a la Catedral.', 'historical', '655ccb4b-7878-4f76-a574-6e57e1266303', 'ca85889c-21fe-4367-8477-a57656b25da4', 'held') on conflict ("entity_id") do update set "event_type" = excluded."event_type", "event_date_text" = excluded."event_date_text", "place_id" = excluded."place_id", "description" = excluded."description", "event_category" = excluded."event_category", "brotherhood_entity_id" = excluded."brotherhood_entity_id", "municipality_id" = excluded."municipality_id", "event_status" = excluded."event_status";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('84386d00-8c2a-45b8-86a9-f2ffcdc96334', '06ba8b18-dff2-46eb-b662-7e6680e03e0f', '832b8411-1e35-4d20-a895-756e788d7ce6') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('55cd348d-b766-4c3e-a4f9-d6b927649ca7', 'event', 'Traslado de Santa Marta a San Andrés', 'traslado-santa-marta-san-andres', 'La corporación estableció su sede canónica en la Parroquia de San Andrés.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."events" ("entity_id", "event_type", "event_date_text", "place_id", "description", "event_category", "brotherhood_entity_id", "municipality_id", "event_status")
values ('55cd348d-b766-4c3e-a4f9-d6b927649ca7', 'Hito histórico', '1952', '850cfa4d-9b76-412f-aeca-a38e3e2fa91f', 'La corporación estableció su sede canónica en la Parroquia de San Andrés.', 'historical', '655ccb4b-7878-4f76-a574-6e57e1266303', 'ca85889c-21fe-4367-8477-a57656b25da4', 'held') on conflict ("entity_id") do update set "event_type" = excluded."event_type", "event_date_text" = excluded."event_date_text", "place_id" = excluded."place_id", "description" = excluded."description", "event_category" = excluded."event_category", "brotherhood_entity_id" = excluded."brotherhood_entity_id", "municipality_id" = excluded."municipality_id", "event_status" = excluded."event_status";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('6ac99143-aba7-452c-9899-db56b6ee7837', '06ba8b18-dff2-46eb-b662-7e6680e03e0f', '55cd348d-b766-4c3e-a4f9-d6b927649ca7') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."brotherhood_habits" ("id", "brotherhood_entity_id", "name", "tunic_description", "hood_description", "cord_description", "footwear_description", "sort_order", "notes", "status")
values ('6733f376-1fe2-4cae-98fa-0e23e95ab3fb', '655ccb4b-7878-4f76-a574-6e57e1266303', 'Hábito de Santa Marta', 'Túnica negra de cola.', 'Antifaz negro.', 'Cinturón ancho de esparto.', 'Calzado negro.', 1, 'Hábito penitencial de ruán negro; la cofradía discurre en silencio.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "name" = excluded."name", "tunic_description" = excluded."tunic_description", "hood_description" = excluded."hood_description", "cord_description" = excluded."cord_description", "footwear_description" = excluded."footwear_description", "sort_order" = excluded."sort_order", "notes" = excluded."notes", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('206fcc89-44b5-4c47-8349-e8b849e481e5', 'heritage_asset', 'Conjunto escultórico del Traslado al Sepulcro', 'conjunto-traslado-sepulcro-santa-marta', 'Composición de Luis Ortega Bru con la Virgen y Santa Marta de Sebastián Santos.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."heritage_assets" ("entity_id", "parent_entity_id", "asset_type", "description", "current_condition", "is_current", "display_order", "is_featured")
values ('206fcc89-44b5-4c47-8349-e8b849e481e5', '655ccb4b-7878-4f76-a574-6e57e1266303', 'Misterio procesional', 'Composición de Luis Ortega Bru con la Virgen y Santa Marta de Sebastián Santos.', 'Conservado', true, 1, true) on conflict ("entity_id") do update set "parent_entity_id" = excluded."parent_entity_id", "asset_type" = excluded."asset_type", "description" = excluded."description", "current_condition" = excluded."current_condition", "is_current" = excluded."is_current", "display_order" = excluded."display_order", "is_featured" = excluded."is_featured";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('6339148e-f518-4efc-a597-4dc1be9d37e0', '06ba8b18-dff2-46eb-b662-7e6680e03e0f', '655ccb4b-7878-4f76-a574-6e57e1266303') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('928091c7-2f1c-45e1-8dd5-f77f841adbc6', 'f920b9de-c569-4e90-8758-1c3dba720957', '655ccb4b-7878-4f76-a574-6e57e1266303') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('88b8f048-ddb3-451a-92f3-77ba55e73ac2', '964906b6-8248-41e2-a9b4-c8711ee8e8b1', '655ccb4b-7878-4f76-a574-6e57e1266303') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('850f1163-0afa-4430-96bd-a9f977dd8b7e', '9666f211-0155-4435-878f-899f8ccabb6e', '655ccb4b-7878-4f76-a574-6e57e1266303') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('32d7228d-0a8e-45e5-9e23-3fda7d2548db', 'f920b9de-c569-4e90-8758-1c3dba720957', '9cb44e26-9be2-443d-b133-d42afb331efe') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('db898eee-7e8c-47f3-9b26-33feadb1dfe8', 'f920b9de-c569-4e90-8758-1c3dba720957', '206fcc89-44b5-4c47-8349-e8b849e481e5') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('19cb485b-88de-4780-a33c-461ab513d6e5', 'Web oficial · Hermandad de la Vera+Cruz de Sevilla', 'https://veracruzsevilla.org/', 'web', 'Hermandad de la Santísima Vera+Cruz', '2026-09-14', 'Identidad y actualidad oficial.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('e89c8931-5c79-42af-b829-328e366bd925', 'Titulares · Vera+Cruz de Sevilla', 'https://veracruzsevilla.org/hermandad/titulares/', 'web', 'Hermandad de la Santísima Vera+Cruz', '2026-09-14', 'Lignum Crucis, Cristo, Virgen y cultos principales.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('55083df9-d813-4cf0-87bf-edd58862c817', 'Reglas de Cultos y Estación de Penitencia · Vera+Cruz', 'https://veracruzsevilla.org/hermandad/reglas/titulo-iii-de-los-cultos-y-la-espiritualidad/', 'web', 'Hermandad de la Santísima Vera+Cruz', '2026-09-14', 'Cultos anuales, hábito y estilo procesional.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('56a9ea00-d0b6-4a9a-8061-7c0c43086640', 'Nuestra sede · Vera+Cruz de Sevilla', 'https://veracruzsevilla.org/hermandad/nuestra-sede/', 'web', 'Hermandad de la Santísima Vera+Cruz', '2026-09-14', 'Capilla del Dulce Nombre de Jesús y sede canónica.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('64288517-7b12-4495-a8d9-3c9034b680ba', 'Guía Cruz de Guía 2026 · Vera+Cruz', 'https://files.qualifio.com/library/prisa_noticias/emails/emisoras%202026/radio%20sevilla_%20cruz%20de%20guia%202026.pdf', 'web', 'Radio Sevilla · Cadena SER', '2026-09-14', 'Guía de la Semana Santa de Sevilla que documenta a la Capilla Musical Gólgota en la Vera+Cruz de 2026.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('05c7d9b0-06e0-46fb-94ec-1b2aaebb86cc', 'brotherhood', 'Hermandad de la Vera+Cruz', 'vera-cruz-sevilla', 'Archicofradía franciscana del Lunes Santo con sede en la Capilla del Dulce Nombre de Jesús.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."brotherhoods" ("entity_id", "official_name", "popular_name", "foundation_text", "municipality_id", "canonical_see_place_id", "neighborhood", "website_url", "brotherhood_types", "current_procession_day", "history_text", "notes")
values ('05c7d9b0-06e0-46fb-94ec-1b2aaebb86cc', 'Muy Antigua, Siempre Ilustre, Venerable, Pontificia, Real, Fervorosa, Humilde y Seráfica Hermandad y Archicofradía de Nazarenos de la Santísima Vera Cruz, Sangre de Nuestro Señor Jesucristo y Tristezas de María Santísima', 'Vera+Cruz', 'Siglo XV; reorganizada en 1942', 'ca85889c-21fe-4367-8477-a57656b25da4', '16599c30-45a9-443a-93ae-4b085401e776', 'San Vicente', 'https://veracruzsevilla.org/', ARRAY['Penitencia']::text[], 'Lunes Santo', 'Cofradía de origen bajomedieval vinculada a la devoción franciscana de la Vera Cruz. Fue reorganizada en 1942 y realiza estación con el antiguo crucificado y la Virgen de las Tristezas.', 'Música sacra de capilla, sin banda procesional. Sin fotografías nuevas sin licencia reutilizable.') on conflict ("entity_id") do update set "official_name" = excluded."official_name", "popular_name" = excluded."popular_name", "foundation_text" = excluded."foundation_text", "municipality_id" = excluded."municipality_id", "canonical_see_place_id" = excluded."canonical_see_place_id", "neighborhood" = excluded."neighborhood", "website_url" = excluded."website_url", "brotherhood_types" = excluded."brotherhood_types", "current_procession_day" = excluded."current_procession_day", "history_text" = excluded."history_text", "notes" = excluded."notes";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('907cf576-0456-4aa7-851a-1d14bf37d52c', 'image', 'Santísimo Cristo de la Vera Cruz', 'santisimo-cristo-vera-cruz-sevilla', 'Crucificado anónimo sevillano de la primera mitad del siglo XVI.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."images" ("entity_id", "image_type", "execution_date_text", "current_condition", "description", "is_dress_image")
values ('907cf576-0456-4aa7-851a-1d14bf37d52c', 'Crucificado', 'Primera mitad del siglo XVI', 'extant', 'Cristo muerto de 1,35 metros, fijado al madero con tres clavos y relacionado con el círculo de Roque de Balduque.', false) on conflict ("entity_id") do update set "image_type" = excluded."image_type", "execution_date_text" = excluded."execution_date_text", "current_condition" = excluded."current_condition", "description" = excluded."description", "is_dress_image" = excluded."is_dress_image";

insert into public."brotherhood_images" ("id", "brotherhood_entity_id", "image_entity_id", "relation_type", "notes", "status")
values ('5bca698b-ccc5-4aa1-bbc0-ed87176c8266', '05c7d9b0-06e0-46fb-94ec-1b2aaebb86cc', '907cf576-0456-4aa7-851a-1d14bf37d52c', 'titular', 'Titular vigente documentado.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_authorships" ("id", "image_entity_id", "agent_entity_id", "authorship_type", "role_name", "date_from_text", "certainty", "notes", "status")
values ('91933055-5e03-4d9a-9b9c-06de58bafadc', '907cf576-0456-4aa7-851a-1d14bf37d52c', null, 'anonymous', 'escultor', 'Primera mitad del siglo XVI', 'unknown', 'Autoría no identificada por la fuente oficial.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "agent_entity_id" = excluded."agent_entity_id", "authorship_type" = excluded."authorship_type", "role_name" = excluded."role_name", "date_from_text" = excluded."date_from_text", "certainty" = excluded."certainty", "notes" = excluded."notes", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('cfee7d18-daa2-463d-9e65-5f42e544aaa0', 'image', 'María Santísima de las Tristezas', 'maria-santisima-tristezas-vera-cruz-sevilla', 'Dolorosa de Antonio Illanes realizada en 1942.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."images" ("entity_id", "image_type", "execution_date_text", "current_condition", "description", "is_dress_image")
values ('cfee7d18-daa2-463d-9e65-5f42e544aaa0', 'Dolorosa de vestir', '1942', 'extant', 'Dolorosa de candelero encargada al reorganizarse la corporación.', true) on conflict ("entity_id") do update set "image_type" = excluded."image_type", "execution_date_text" = excluded."execution_date_text", "current_condition" = excluded."current_condition", "description" = excluded."description", "is_dress_image" = excluded."is_dress_image";

insert into public."brotherhood_images" ("id", "brotherhood_entity_id", "image_entity_id", "relation_type", "notes", "status")
values ('d916cd6c-f453-4a72-838c-a61d81d22b31', '05c7d9b0-06e0-46fb-94ec-1b2aaebb86cc', 'cfee7d18-daa2-463d-9e65-5f42e544aaa0', 'titular', 'Titular vigente documentado.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_authorships" ("id", "image_entity_id", "agent_entity_id", "authorship_type", "role_name", "date_from_text", "certainty", "notes", "status")
values ('0342b875-dcc4-4bb7-b1aa-e575afd38628', 'cfee7d18-daa2-463d-9e65-5f42e544aaa0', '3c317cca-c1ac-4339-8994-78226fa57737', 'author', 'escultor', '1942', 'documented', 'Autoría documentada.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "agent_entity_id" = excluded."agent_entity_id", "authorship_type" = excluded."authorship_type", "role_name" = excluded."role_name", "date_from_text" = excluded."date_from_text", "certainty" = excluded."certainty", "notes" = excluded."notes", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('41f7f8a3-3fc6-4656-b2e1-3b105d4bb6e1', 'step', 'Paso del Santísimo Cristo de la Vera Cruz', 'paso-santisimo-cristo-vera-cruz-sevilla', 'Paso procesional neobarroco del antiguo Crucificado.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."steps" ("entity_id", "step_type", "current_condition", "execution_date_text", "description")
values ('41f7f8a3-3fc6-4656-b2e1-3b105d4bb6e1', 'Paso de Cristo', 'preserved', '2008', 'Paso de madera de caoba en su color que porta al Santísimo Cristo de la Vera Cruz.') on conflict ("entity_id") do update set "step_type" = excluded."step_type", "current_condition" = excluded."current_condition", "execution_date_text" = excluded."execution_date_text", "description" = excluded."description";

insert into public."brotherhood_steps" ("id", "brotherhood_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('2e6fff53-dee7-4de9-97ae-4134df522edc', '05c7d9b0-06e0-46fb-94ec-1b2aaebb86cc', '41f7f8a3-3fc6-4656-b2e1-3b105d4bb6e1', 'current', 'Paso procesional vigente.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_steps" ("id", "image_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('841b9f6b-6a4f-462d-9db5-df070b6b0d99', '907cf576-0456-4aa7-851a-1d14bf37d52c', '41f7f8a3-3fc6-4656-b2e1-3b105d4bb6e1', 'processional', 'Imagen principal del paso.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('e8832e37-67f0-4f1b-af12-a76cb160be2d', 'step', 'Paso de palio de María Santísima de las Tristezas', 'paso-palio-tristezas-vera-cruz-sevilla', 'Paso de palio de María Santísima de las Tristezas.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."steps" ("entity_id", "step_type", "current_condition", "execution_date_text", "description")
values ('e8832e37-67f0-4f1b-af12-a76cb160be2d', 'Palio', 'preserved', null, 'Paso de palio de sobria configuración para la titular mariana.') on conflict ("entity_id") do update set "step_type" = excluded."step_type", "current_condition" = excluded."current_condition", "execution_date_text" = excluded."execution_date_text", "description" = excluded."description";

insert into public."brotherhood_steps" ("id", "brotherhood_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('9a79edaa-1fb6-4afa-b896-005a8500412b', '05c7d9b0-06e0-46fb-94ec-1b2aaebb86cc', 'e8832e37-67f0-4f1b-af12-a76cb160be2d', 'current', 'Paso procesional vigente.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_steps" ("id", "image_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('4c6902ab-d266-4c50-b2eb-1a3f32257fdf', 'cfee7d18-daa2-463d-9e65-5f42e544aaa0', 'e8832e37-67f0-4f1b-af12-a76cb160be2d', 'processional', 'Imagen principal del paso.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."cults" ("id", "brotherhood_entity_id", "image_entity_id", "place_id", "status", "is_recurring", "cult_type", "title", "month", "date_rule", "recurrence_label", "display_order", "description")
values ('8704b811-06d7-4bf1-9d93-f960e0b24b90', '05c7d9b0-06e0-46fb-94ec-1b2aaebb86cc', '907cf576-0456-4aa7-851a-1d14bf37d52c', '16599c30-45a9-443a-93ae-4b085401e776', 'published', true, 'Quinario', 'Solemne Quinario al Santísimo Cristo de la Vera Cruz', null, 'Desde el Miércoles de Ceniza', 'Anual', 1, 'Culto anual recogido en las Reglas y fuentes oficiales.') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "place_id" = excluded."place_id", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "cult_type" = excluded."cult_type", "title" = excluded."title", "month" = excluded."month", "date_rule" = excluded."date_rule", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order", "description" = excluded."description";

insert into public."cult_entities" ("id", "cult_id", "entity_id", "role", "notes")
values ('fd21d5a3-0bd6-45fc-960e-5a12db1f4d88', '8704b811-06d7-4bf1-9d93-f960e0b24b90', '907cf576-0456-4aa7-851a-1d14bf37d52c', 'honoree', 'Titular al que se dedica el culto.') on conflict ("id") do update set "cult_id" = excluded."cult_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "cult_id")
values ('9caedfcf-fbb4-4c7c-bce0-77ca4323bb66', '55083df9-d813-4cf0-87bf-edd58862c817', '8704b811-06d7-4bf1-9d93-f960e0b24b90') on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id";

insert into public."cults" ("id", "brotherhood_entity_id", "image_entity_id", "place_id", "status", "is_recurring", "cult_type", "title", "month", "date_rule", "recurrence_label", "display_order", "description")
values ('1a42e9f9-58db-423b-8a11-3028afdfe5f7', '05c7d9b0-06e0-46fb-94ec-1b2aaebb86cc', '907cf576-0456-4aa7-851a-1d14bf37d52c', '16599c30-45a9-443a-93ae-4b085401e776', 'published', true, 'Función Principal', 'Función Principal de Instituto', null, 'Domingo posterior al Quinario', 'Anual', 2, 'Culto anual recogido en las Reglas y fuentes oficiales.') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "place_id" = excluded."place_id", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "cult_type" = excluded."cult_type", "title" = excluded."title", "month" = excluded."month", "date_rule" = excluded."date_rule", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order", "description" = excluded."description";

insert into public."cult_entities" ("id", "cult_id", "entity_id", "role", "notes")
values ('bfcacc20-bef7-4094-be1d-9e576f09fc5f', '1a42e9f9-58db-423b-8a11-3028afdfe5f7', '907cf576-0456-4aa7-851a-1d14bf37d52c', 'honoree', 'Titular al que se dedica el culto.') on conflict ("id") do update set "cult_id" = excluded."cult_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "cult_id")
values ('b4ce2de3-6e51-46f1-9d1a-c15cb205234b', '55083df9-d813-4cf0-87bf-edd58862c817', '1a42e9f9-58db-423b-8a11-3028afdfe5f7') on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id";

insert into public."cults" ("id", "brotherhood_entity_id", "image_entity_id", "place_id", "status", "is_recurring", "cult_type", "title", "month", "date_rule", "recurrence_label", "display_order", "description")
values ('7307fcc9-0317-4d3c-9a04-d45874857510', '05c7d9b0-06e0-46fb-94ec-1b2aaebb86cc', '907cf576-0456-4aa7-851a-1d14bf37d52c', '16599c30-45a9-443a-93ae-4b085401e776', 'published', true, 'Besapié', 'Solemne Besapié al Santísimo Cristo de la Vera Cruz', null, 'Viernes de Dolores', 'Anual', 3, 'Culto anual recogido en las Reglas y fuentes oficiales.') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "place_id" = excluded."place_id", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "cult_type" = excluded."cult_type", "title" = excluded."title", "month" = excluded."month", "date_rule" = excluded."date_rule", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order", "description" = excluded."description";

insert into public."cult_entities" ("id", "cult_id", "entity_id", "role", "notes")
values ('41188316-a06d-4ca9-94f6-d62b076569c8', '7307fcc9-0317-4d3c-9a04-d45874857510', '907cf576-0456-4aa7-851a-1d14bf37d52c', 'honoree', 'Titular al que se dedica el culto.') on conflict ("id") do update set "cult_id" = excluded."cult_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "cult_id")
values ('df9024d5-7c33-4ddd-ad9c-8276b0dc6eca', '55083df9-d813-4cf0-87bf-edd58862c817', '7307fcc9-0317-4d3c-9a04-d45874857510') on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id";

insert into public."cults" ("id", "brotherhood_entity_id", "image_entity_id", "place_id", "status", "is_recurring", "cult_type", "title", "month", "date_rule", "recurrence_label", "display_order", "description")
values ('11827b90-5e9d-4172-82fc-0cd631259eaa', '05c7d9b0-06e0-46fb-94ec-1b2aaebb86cc', '907cf576-0456-4aa7-851a-1d14bf37d52c', '16599c30-45a9-443a-93ae-4b085401e776', 'published', true, 'Vía Crucis', 'Vía Crucis del Santísimo Cristo de la Vera Cruz', null, 'Viernes de Dolores', 'Anual', 4, 'Culto anual recogido en las Reglas y fuentes oficiales.') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "place_id" = excluded."place_id", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "cult_type" = excluded."cult_type", "title" = excluded."title", "month" = excluded."month", "date_rule" = excluded."date_rule", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order", "description" = excluded."description";

insert into public."cult_entities" ("id", "cult_id", "entity_id", "role", "notes")
values ('395bf5ad-1163-4210-9a6e-4cdcc15396df', '11827b90-5e9d-4172-82fc-0cd631259eaa', '907cf576-0456-4aa7-851a-1d14bf37d52c', 'honoree', 'Titular al que se dedica el culto.') on conflict ("id") do update set "cult_id" = excluded."cult_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "cult_id")
values ('a321af5b-b147-4bc6-a506-82e97eb5fec3', '55083df9-d813-4cf0-87bf-edd58862c817', '11827b90-5e9d-4172-82fc-0cd631259eaa') on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id";

insert into public."cults" ("id", "brotherhood_entity_id", "image_entity_id", "place_id", "status", "is_recurring", "cult_type", "title", "month", "date_rule", "recurrence_label", "display_order", "description")
values ('ef20a723-dd18-4650-9a28-5a8352a83a63', '05c7d9b0-06e0-46fb-94ec-1b2aaebb86cc', 'cfee7d18-daa2-463d-9e65-5f42e544aaa0', '16599c30-45a9-443a-93ae-4b085401e776', 'published', true, 'Rosario de la Aurora', 'Rosario de la Aurora con María Santísima de las Tristezas', null, 'Septiembre', 'Anual', 5, 'Culto anual recogido en las Reglas y fuentes oficiales.') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "place_id" = excluded."place_id", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "cult_type" = excluded."cult_type", "title" = excluded."title", "month" = excluded."month", "date_rule" = excluded."date_rule", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order", "description" = excluded."description";

insert into public."cult_entities" ("id", "cult_id", "entity_id", "role", "notes")
values ('9bb5d4d1-2c9b-4959-b109-50ddc745dd70', 'ef20a723-dd18-4650-9a28-5a8352a83a63', 'cfee7d18-daa2-463d-9e65-5f42e544aaa0', 'honoree', 'Titular al que se dedica el culto.') on conflict ("id") do update set "cult_id" = excluded."cult_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "cult_id")
values ('2b22c4ee-8b3c-43ed-838e-288793ea2141', '55083df9-d813-4cf0-87bf-edd58862c817', 'ef20a723-dd18-4650-9a28-5a8352a83a63') on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id";

insert into public."cults" ("id", "brotherhood_entity_id", "image_entity_id", "place_id", "status", "is_recurring", "cult_type", "title", "month", "date_rule", "recurrence_label", "display_order", "description")
values ('45eb41ba-65f6-4b20-bda3-3d82f3543d46', '05c7d9b0-06e0-46fb-94ec-1b2aaebb86cc', 'cfee7d18-daa2-463d-9e65-5f42e544aaa0', '16599c30-45a9-443a-93ae-4b085401e776', 'published', true, 'Triduo', 'Solemne Triduo a María Santísima de las Tristezas', null, 'Diciembre', 'Anual', 6, 'Culto anual recogido en las Reglas y fuentes oficiales.') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "place_id" = excluded."place_id", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "cult_type" = excluded."cult_type", "title" = excluded."title", "month" = excluded."month", "date_rule" = excluded."date_rule", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order", "description" = excluded."description";

insert into public."cult_entities" ("id", "cult_id", "entity_id", "role", "notes")
values ('7ff31024-0d08-485b-96a6-13578471ee02', '45eb41ba-65f6-4b20-bda3-3d82f3543d46', 'cfee7d18-daa2-463d-9e65-5f42e544aaa0', 'honoree', 'Titular al que se dedica el culto.') on conflict ("id") do update set "cult_id" = excluded."cult_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "cult_id")
values ('a80f27b7-8fb6-4fe1-b7ab-0e8f165ea640', '55083df9-d813-4cf0-87bf-edd58862c817', '45eb41ba-65f6-4b20-bda3-3d82f3543d46') on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id";

insert into public."cults" ("id", "brotherhood_entity_id", "image_entity_id", "place_id", "status", "is_recurring", "cult_type", "title", "month", "date_rule", "recurrence_label", "display_order", "description")
values ('15b905fe-e071-408a-8151-bd9fa6bacc6d', '05c7d9b0-06e0-46fb-94ec-1b2aaebb86cc', null, '16599c30-45a9-443a-93ae-4b085401e776', 'published', true, 'Función Solemne', 'Función a la Santísima Vera Cruz', null, '14 de septiembre', 'Anual', 7, 'Culto anual recogido en las Reglas y fuentes oficiales.') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "place_id" = excluded."place_id", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "cult_type" = excluded."cult_type", "title" = excluded."title", "month" = excluded."month", "date_rule" = excluded."date_rule", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order", "description" = excluded."description";

insert into public."source_links" ("id", "source_id", "cult_id")
values ('48fb0a5c-f871-4930-a8af-474c08b9b86d', '55083df9-d813-4cf0-87bf-edd58862c817', '15b905fe-e071-408a-8151-bd9fa6bacc6d') on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id";

insert into public."outings" ("id", "brotherhood_entity_id", "outing_type", "character", "title", "outing_date", "year", "municipality_id", "origin_place_id", "destination_text", "description", "event_status", "status", "slug")
values ('bcca37a1-6699-471d-9518-b88119ac6d6b', '05c7d9b0-06e0-46fb-94ec-1b2aaebb86cc', 'Estación de Penitencia', 'ordinary', 'Vera+Cruz · Estación de Penitencia 2026', '2026-03-30', 2026, 'ca85889c-21fe-4367-8477-a57656b25da4', '16599c30-45a9-443a-93ae-4b085401e776', 'Santa Iglesia Catedral de Sevilla', 'Estación de penitencia del Lunes Santo de 2026.', 'held', 'published', 'vera-cruz-sevilla-estacion-penitencia-2026') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "outing_type" = excluded."outing_type", "character" = excluded."character", "title" = excluded."title", "outing_date" = excluded."outing_date", "year" = excluded."year", "municipality_id" = excluded."municipality_id", "origin_place_id" = excluded."origin_place_id", "destination_text" = excluded."destination_text", "description" = excluded."description", "event_status" = excluded."event_status", "status" = excluded."status", "slug" = excluded."slug";

insert into public."outing_entities" ("id", "outing_id", "entity_id", "role", "notes")
values ('47ec0412-83d9-4529-908c-23e6e209a8c9', 'bcca37a1-6699-471d-9518-b88119ac6d6b', '907cf576-0456-4aa7-851a-1d14bf37d52c', 'processional_image', 'Imagen participante en la estación de penitencia.') on conflict ("id") do update set "outing_id" = excluded."outing_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."outing_entities" ("id", "outing_id", "entity_id", "role", "notes")
values ('f8a98a95-ec63-41d2-8348-b762b6c7457f', 'bcca37a1-6699-471d-9518-b88119ac6d6b', 'cfee7d18-daa2-463d-9e65-5f42e544aaa0', 'secondary_image', 'Imagen participante en la estación de penitencia.') on conflict ("id") do update set "outing_id" = excluded."outing_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "outing_id")
values ('e9fe3ce8-c323-4654-9ad7-999a75155fd5', '9666f211-0155-4435-878f-899f8ccabb6e', 'bcca37a1-6699-471d-9518-b88119ac6d6b') on conflict ("id") do update set "source_id" = excluded."source_id", "outing_id" = excluded."outing_id";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('bc3f66ef-d9bf-4e44-9eb7-ea88837a6c82', 'event', 'Origen histórico de la Vera+Cruz de Sevilla', 'origen-vera-cruz-sevilla-siglo-xv', 'La corporación hunde sus raíces en el movimiento de cofradías de la Vera Cruz de finales de la Edad Media.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."events" ("entity_id", "event_type", "event_date_text", "place_id", "description", "event_category", "brotherhood_entity_id", "municipality_id", "event_status")
values ('bc3f66ef-d9bf-4e44-9eb7-ea88837a6c82', 'Hito histórico', 'Siglo XV', null, 'La corporación hunde sus raíces en el movimiento de cofradías de la Vera Cruz de finales de la Edad Media.', 'historical', '05c7d9b0-06e0-46fb-94ec-1b2aaebb86cc', 'ca85889c-21fe-4367-8477-a57656b25da4', 'held') on conflict ("entity_id") do update set "event_type" = excluded."event_type", "event_date_text" = excluded."event_date_text", "place_id" = excluded."place_id", "description" = excluded."description", "event_category" = excluded."event_category", "brotherhood_entity_id" = excluded."brotherhood_entity_id", "municipality_id" = excluded."municipality_id", "event_status" = excluded."event_status";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('b54f0883-de63-4b45-8548-ffe783c61162', '19cb485b-88de-4780-a33c-461ab513d6e5', 'bc3f66ef-d9bf-4e44-9eb7-ea88837a6c82') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('45b56a38-d386-4e01-8015-8c493ad7b934', 'event', 'Reorganización de la Vera+Cruz de Sevilla', 'reorganizacion-vera-cruz-sevilla-1942', 'La Hermandad fue reorganizada y encargó a Antonio Illanes la actual Virgen de las Tristezas.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."events" ("entity_id", "event_type", "event_date_text", "place_id", "description", "event_category", "brotherhood_entity_id", "municipality_id", "event_status")
values ('45b56a38-d386-4e01-8015-8c493ad7b934', 'Hito histórico', '1942', null, 'La Hermandad fue reorganizada y encargó a Antonio Illanes la actual Virgen de las Tristezas.', 'historical', '05c7d9b0-06e0-46fb-94ec-1b2aaebb86cc', 'ca85889c-21fe-4367-8477-a57656b25da4', 'held') on conflict ("entity_id") do update set "event_type" = excluded."event_type", "event_date_text" = excluded."event_date_text", "place_id" = excluded."place_id", "description" = excluded."description", "event_category" = excluded."event_category", "brotherhood_entity_id" = excluded."brotherhood_entity_id", "municipality_id" = excluded."municipality_id", "event_status" = excluded."event_status";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('203a2469-bf04-454e-bf78-e1b761e70c40', 'e89c8931-5c79-42af-b829-328e366bd925', '45b56a38-d386-4e01-8015-8c493ad7b934') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('25fcaa17-6aa3-48b4-bc29-7216a3ed582f', 'event', 'Restauración del Cristo de la Vera Cruz', 'restauracion-cristo-vera-cruz-sevilla-1978', 'Francisco Arquillo restauró la imagen y recuperó la policromía original del sudario.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."events" ("entity_id", "event_type", "event_date_text", "place_id", "description", "event_category", "brotherhood_entity_id", "municipality_id", "event_status")
values ('25fcaa17-6aa3-48b4-bc29-7216a3ed582f', 'Hito histórico', '1978', null, 'Francisco Arquillo restauró la imagen y recuperó la policromía original del sudario.', 'historical', '05c7d9b0-06e0-46fb-94ec-1b2aaebb86cc', 'ca85889c-21fe-4367-8477-a57656b25da4', 'held') on conflict ("entity_id") do update set "event_type" = excluded."event_type", "event_date_text" = excluded."event_date_text", "place_id" = excluded."place_id", "description" = excluded."description", "event_category" = excluded."event_category", "brotherhood_entity_id" = excluded."brotherhood_entity_id", "municipality_id" = excluded."municipality_id", "event_status" = excluded."event_status";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('001336b0-c161-4166-9a64-c27dacda9e28', 'e89c8931-5c79-42af-b829-328e366bd925', '25fcaa17-6aa3-48b4-bc29-7216a3ed582f') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."brotherhood_habits" ("id", "brotherhood_entity_id", "name", "tunic_description", "hood_description", "cord_description", "footwear_description", "sort_order", "notes", "status")
values ('b9426f48-160a-4deb-80a9-7fb9bf3104cb', '05c7d9b0-06e0-46fb-94ec-1b2aaebb86cc', 'Hábito de Vera+Cruz', 'Túnica de ruán negro con cola.', 'Antifaz alto de ruán negro.', 'Cinturón ancho y cordón franciscano de esparto.', 'Calzado negro.', 1, 'La estación se desarrolla en recogimiento y silencio, con música sacra cuando procede.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "name" = excluded."name", "tunic_description" = excluded."tunic_description", "hood_description" = excluded."hood_description", "cord_description" = excluded."cord_description", "footwear_description" = excluded."footwear_description", "sort_order" = excluded."sort_order", "notes" = excluded."notes", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('13841b88-c813-4ec0-b66e-7f46e5ef39b7', 'heritage_asset', 'Santo Lignum Crucis de la Vera+Cruz de Sevilla', 'santo-lignum-crucis-vera-cruz-sevilla', 'Reliquia entregada en 1954 e incorporada en 1965 a un relicario de plata de Villarreal.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."heritage_assets" ("entity_id", "parent_entity_id", "asset_type", "description", "current_condition", "is_current", "display_order", "is_featured")
values ('13841b88-c813-4ec0-b66e-7f46e5ef39b7', '05c7d9b0-06e0-46fb-94ec-1b2aaebb86cc', 'Reliquia', 'Reliquia entregada en 1954 e incorporada en 1965 a un relicario de plata de Villarreal.', 'Conservado', true, 1, true) on conflict ("entity_id") do update set "parent_entity_id" = excluded."parent_entity_id", "asset_type" = excluded."asset_type", "description" = excluded."description", "current_condition" = excluded."current_condition", "is_current" = excluded."is_current", "display_order" = excluded."display_order", "is_featured" = excluded."is_featured";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('89cdf2d2-5ffa-42aa-ad3e-5928b1083615', 'heritage_asset', 'Paso de caoba del Cristo de la Vera Cruz', 'paso-caoba-cristo-vera-cruz-sevilla', 'Paso neobarroco en madera de caoba estrenado en 2008.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."heritage_assets" ("entity_id", "parent_entity_id", "asset_type", "description", "current_condition", "is_current", "display_order", "is_featured")
values ('89cdf2d2-5ffa-42aa-ad3e-5928b1083615', '05c7d9b0-06e0-46fb-94ec-1b2aaebb86cc', 'Paso procesional', 'Paso neobarroco en madera de caoba estrenado en 2008.', 'Conservado', true, 2, false) on conflict ("entity_id") do update set "parent_entity_id" = excluded."parent_entity_id", "asset_type" = excluded."asset_type", "description" = excluded."description", "current_condition" = excluded."current_condition", "is_current" = excluded."is_current", "display_order" = excluded."display_order", "is_featured" = excluded."is_featured";

insert into public."music_accompaniment_periods" ("id", "brotherhood_entity_id", "band_entity_id", "step_entity_id", "position", "outing_type", "date_from_text", "is_current", "notes", "public_brotherhood_name", "public_step_name", "public_brotherhood_slug", "public_municipality_name", "public_municipality_slug", "public_province", "status")
values ('cb511eee-e6f9-463f-a50f-e0550d12a7e9', '05c7d9b0-06e0-46fb-94ec-1b2aaebb86cc', '895dd76d-9b7f-4e5e-bda0-7a3515e75532', 'e8832e37-67f0-4f1b-af12-a76cb160be2d', 'Tras el paso de palio', 'Lunes Santo', 'Vigente · 2026', true, 'Acompañamiento de capilla musical dentro del carácter sobrio de la estación.', 'Hermandad de la Vera+Cruz', 'María Santísima de las Tristezas', 'vera-cruz-sevilla', 'Sevilla', 'sevilla', 'Sevilla', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "band_entity_id" = excluded."band_entity_id", "step_entity_id" = excluded."step_entity_id", "position" = excluded."position", "outing_type" = excluded."outing_type", "date_from_text" = excluded."date_from_text", "is_current" = excluded."is_current", "notes" = excluded."notes", "public_brotherhood_name" = excluded."public_brotherhood_name", "public_step_name" = excluded."public_step_name", "public_brotherhood_slug" = excluded."public_brotherhood_slug", "public_municipality_name" = excluded."public_municipality_name", "public_municipality_slug" = excluded."public_municipality_slug", "public_province" = excluded."public_province", "status" = excluded."status";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('7ee4eab7-6c9e-4e29-a6ef-2e3bea62b143', '19cb485b-88de-4780-a33c-461ab513d6e5', '05c7d9b0-06e0-46fb-94ec-1b2aaebb86cc') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('732eafa0-2f8b-411e-997e-28517bbe7dba', 'e89c8931-5c79-42af-b829-328e366bd925', '05c7d9b0-06e0-46fb-94ec-1b2aaebb86cc') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('393cbe18-dfdb-4da6-89e7-7fa002fd29c0', '55083df9-d813-4cf0-87bf-edd58862c817', '05c7d9b0-06e0-46fb-94ec-1b2aaebb86cc') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('1fdd38c4-4a11-45df-8d71-f8b0664233a9', '56a9ea00-d0b6-4a9a-8061-7c0c43086640', '05c7d9b0-06e0-46fb-94ec-1b2aaebb86cc') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('ffe6e907-b4ee-4ffa-91f2-6ca3e516e098', '9666f211-0155-4435-878f-899f8ccabb6e', '05c7d9b0-06e0-46fb-94ec-1b2aaebb86cc') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('48281502-e390-46c4-954c-49fb1b63cf6d', 'e89c8931-5c79-42af-b829-328e366bd925', '907cf576-0456-4aa7-851a-1d14bf37d52c') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('1c1a6aa7-f568-46ae-95aa-65aeac4b264a', 'e89c8931-5c79-42af-b829-328e366bd925', 'cfee7d18-daa2-463d-9e65-5f42e544aaa0') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('79989d8d-877a-441e-8526-a208ab5358d6', 'e89c8931-5c79-42af-b829-328e366bd925', '13841b88-c813-4ec0-b66e-7f46e5ef39b7') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('1fc02b4f-7b3c-4808-97e8-4d1e673d5c5f', 'e89c8931-5c79-42af-b829-328e366bd925', '89cdf2d2-5ffa-42aa-ad3e-5928b1083615') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."source_links" ("id", "source_id", "music_accompaniment_period_id")
values ('42157b24-c6f3-4fc8-86b8-1364699d1055', '64288517-7b12-4495-a8d9-3c9034b680ba', 'cb511eee-e6f9-463f-a50f-e0550d12a7e9') on conflict ("id") do update set "source_id" = excluded."source_id", "music_accompaniment_period_id" = excluded."music_accompaniment_period_id";

commit;
