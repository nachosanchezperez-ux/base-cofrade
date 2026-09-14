-- HC-016 · macrolote transversal: Martes Santo de Sevilla
-- Candelaria, Los Javieres y Los Estudiantes; cinco cierres previos se preservan.
-- Solo DML. Receta idempotente archivada fuera de la cadena estructural activa.
-- Lote gobernado c0160015-0000-4000-8000-000000000001: 224/224 (213 insert, 11 update), 0 inválidas, 0 fallos.

begin;

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('b5f73fa6-1245-4ff1-8196-f85a789de112', 'Nómina de las cofradías de la Semana Santa de Sevilla 2026', 'https://www.hermandades-de-sevilla.org/consejo/nomina-de-las-cofradias-de-la-semana-santa-de-sevilla-2026/', 'web', 'Consejo General de Hermandades y Cofradías de Sevilla', '2026-09-14', 'Nómina oficial, orden y jornada del Martes Santo de 2026.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('687f51f0-af2e-4d63-95cd-9ff2bb1825ee', 'Web oficial · Hermandad de la Candelaria', 'https://www.hermandaddelacandelaria.com/', 'web', 'Hermandad de la Candelaria', '2026-09-14', 'Identidad, sede, titulares y patrimonio oficial.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('4b9aea7a-9c92-4019-8ac2-e628d4202826', 'Resumen histórico · Hermandad de la Candelaria', 'https://www.hermandaddelacandelaria.com/seccion.php?Id=1', 'web', 'Hermandad de la Candelaria', '2026-09-14', 'Fundación, primera estación, fusión sacramental e hitos.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('62a572ff-18a6-436f-93a5-d4250afd860f', 'Nuestro Padre Jesús de la Salud · Candelaria', 'https://www.hermandaddelacandelaria.com/seccion.php?Id=6', 'web', 'Hermandad de la Candelaria', '2026-09-14', 'Datación y debate de autoría del Nazareno.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('ef72d168-886b-4133-8d59-acedf502e75c', 'María Santísima de la Candelaria', 'https://www.hermandaddelacandelaria.com/seccion.php?Id=7', 'web', 'Hermandad de la Candelaria', '2026-09-14', 'Autoría, remodelación y descripción de la Dolorosa.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('05943d23-79b5-4c52-9db7-d3f45bf35db2', 'Patrimonio procesional · Candelaria', 'https://www.hermandaddelacandelaria.com/seccion.php?Id=27', 'web', 'Hermandad de la Candelaria', '2026-09-14', 'Paso del Señor y patrimonio procesional.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('7591d0a2-b937-4af5-9e15-1dc75adc6a65', 'Paso de palio · Candelaria', 'https://www.hermandaddelacandelaria.com/seccion.php?Id=28', 'web', 'Hermandad de la Candelaria', '2026-09-14', 'Diseño, bordados y orfebrería del palio.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('445cf5f1-5ff0-4c15-8193-bdc2db1bc278', 'Calendario de cultos de Regla · Candelaria', 'https://www.hermandaddelacandelaria.com/seccion.php?Id=10', 'web', 'Hermandad de la Candelaria', '2026-09-14', 'Ciclo anual de cultos de Regla publicado por la corporación.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."places" ("id", "municipality_id", "name", "slug", "place_type", "address", "notes")
values ('7f94ef03-dcfa-4991-aea8-bfd83cd0c20c', 'ca85889c-21fe-4367-8477-a57656b25da4', 'Parroquia de San Nicolás de Bari', 'parroquia-san-nicolas-bari-sevilla', 'Parroquia', 'Plaza de Nuestro Padre Jesús de la Salud, 41004 Sevilla', 'Sede canónica de la Hermandad de la Candelaria.') on conflict ("id") do update set "municipality_id" = excluded."municipality_id", "name" = excluded."name", "slug" = excluded."slug", "place_type" = excluded."place_type", "address" = excluded."address", "notes" = excluded."notes";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('111d783e-16c0-4571-9c1c-93eaee474e87', 'agent', 'Francisco de Ocampo', 'francisco-de-ocampo', 'Escultor al que se atribuye tradicionalmente el Nazareno de la Salud, con cautelas críticas expresas.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('5dfcff9b-0b66-4892-830d-da6f4a4890dc', 'agent', 'Manuel Galiano Delgado', 'manuel-galiano-delgado', 'Escultor autor de la Virgen de la Candelaria en 1924.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('c6100000-0000-4000-8000-000000000003', 'brotherhood', 'Hermandad de la Candelaria de Sevilla', 'hermandad-candelaria-sevilla', 'Hermandad sacramental y de penitencia de San Nicolás.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."brotherhoods" ("entity_id", "official_name", "popular_name", "foundation_text", "municipality_id", "canonical_see_place_id", "neighborhood", "website_url", "brotherhood_types", "current_procession_day", "history_text", "notes")
values ('c6100000-0000-4000-8000-000000000003', 'Real, Imperial, Ilustre y Fervorosa Hermandad del Santísimo Sacramento, Ánimas Benditas, Nuestra Señora del Subterráneo y Cofradía de Nazarenos de Nuestro Padre Jesús de la Salud, María Santísima de la Candelaria y Señor San Nicolás de Bari', 'La Candelaria', '1921; fusionada con la Sacramental de San Nicolás en 1977', 'ca85889c-21fe-4367-8477-a57656b25da4', '7f94ef03-dcfa-4991-aea8-bfd83cd0c20c', 'San Nicolás', 'https://www.hermandaddelacandelaria.com/', ARRAY['Penitencia', 'Sacramental']::text[], 'Martes Santo', 'Constituida en San Nicolás en 1921, realizó su primera estación en 1922 y se fusionó con la Sacramental parroquial en 1977.', 'Sin fotografías nuevas mientras no conste licencia reutilizable.') on conflict ("entity_id") do update set "official_name" = excluded."official_name", "popular_name" = excluded."popular_name", "foundation_text" = excluded."foundation_text", "municipality_id" = excluded."municipality_id", "canonical_see_place_id" = excluded."canonical_see_place_id", "neighborhood" = excluded."neighborhood", "website_url" = excluded."website_url", "brotherhood_types" = excluded."brotherhood_types", "current_procession_day" = excluded."current_procession_day", "history_text" = excluded."history_text", "notes" = excluded."notes";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('7d9ddfb2-324d-42ec-866c-def6478bd5e5', 'image', 'Nuestro Padre Jesús de la Salud', 'nuestro-padre-jesus-salud-candelaria-sevilla', 'Nazareno barroco de autoría discutida, documentado en 1622.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."images" ("entity_id", "image_type", "execution_date_text", "current_condition", "description", "is_dress_image")
values ('7d9ddfb2-324d-42ec-866c-def6478bd5e5', 'Nazareno de talla completa', 'Anterior a 1622', 'extant', 'Nazareno de talla completa, atribuido tradicionalmente a Francisco de Ocampo aunque la propia fuente oficial recoge dudas críticas.', false) on conflict ("entity_id") do update set "image_type" = excluded."image_type", "execution_date_text" = excluded."execution_date_text", "current_condition" = excluded."current_condition", "description" = excluded."description", "is_dress_image" = excluded."is_dress_image";

insert into public."brotherhood_images" ("id", "brotherhood_entity_id", "image_entity_id", "relation_type", "notes", "status")
values ('9e9a91df-f67d-43ff-9821-f20e63b85f3c', 'c6100000-0000-4000-8000-000000000003', '7d9ddfb2-324d-42ec-866c-def6478bd5e5', 'titular', 'Titular vigente documentado.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_authorships" ("id", "image_entity_id", "agent_entity_id", "authorship_type", "role_name", "date_from_text", "certainty", "notes", "status")
values ('8465d148-8c26-4e7b-952b-5e9812069384', '7d9ddfb2-324d-42ec-866c-def6478bd5e5', '111d783e-16c0-4571-9c1c-93eaee474e87', 'attributed_to', 'escultor', 'Anterior a 1622', 'attributed', 'Atribución documentada, no autoría contractual.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "agent_entity_id" = excluded."agent_entity_id", "authorship_type" = excluded."authorship_type", "role_name" = excluded."role_name", "date_from_text" = excluded."date_from_text", "certainty" = excluded."certainty", "notes" = excluded."notes", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('2b597213-f89e-4655-a443-ef3dbc93e8c7', 'image', 'María Santísima de la Candelaria', 'maria-santisima-candelaria-sevilla', 'Dolorosa de Manuel Galiano, 1924, profundamente remodelada por Antonio Dubé de Luque en 1967.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."images" ("entity_id", "image_type", "execution_date_text", "current_condition", "description", "is_dress_image")
values ('2b597213-f89e-4655-a443-ef3dbc93e8c7', 'Dolorosa de vestir', '1924; remodelada en 1967', 'extant', 'Dolorosa de candelero cuya fisonomía actual responde a la remodelación de Antonio Dubé de Luque.', true) on conflict ("entity_id") do update set "image_type" = excluded."image_type", "execution_date_text" = excluded."execution_date_text", "current_condition" = excluded."current_condition", "description" = excluded."description", "is_dress_image" = excluded."is_dress_image";

insert into public."brotherhood_images" ("id", "brotherhood_entity_id", "image_entity_id", "relation_type", "notes", "status")
values ('4190493c-39fc-4ddb-b78a-4d2f2bc1da33', 'c6100000-0000-4000-8000-000000000003', '2b597213-f89e-4655-a443-ef3dbc93e8c7', 'titular', 'Titular vigente documentado.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_authorships" ("id", "image_entity_id", "agent_entity_id", "authorship_type", "role_name", "date_from_text", "certainty", "notes", "status")
values ('0b0a08a0-dfa3-453e-8b39-1ead1b741048', '2b597213-f89e-4655-a443-ef3dbc93e8c7', '5dfcff9b-0b66-4892-830d-da6f4a4890dc', 'author', 'escultor', '1924; remodelada en 1967', 'documented', 'Autoría documentada.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "agent_entity_id" = excluded."agent_entity_id", "authorship_type" = excluded."authorship_type", "role_name" = excluded."role_name", "date_from_text" = excluded."date_from_text", "certainty" = excluded."certainty", "notes" = excluded."notes", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('71053edd-f658-43c2-bc08-44c2303c8464', 'step', 'Paso de Nuestro Padre Jesús de la Salud', 'paso-jesus-salud-candelaria-sevilla', 'Paso neobarroco rocalla de Antonio Vega Sánchez.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."steps" ("entity_id", "step_type", "current_condition", "execution_date_text", "description")
values ('71053edd-f658-43c2-bc08-44c2303c8464', 'Nazareno', 'preserved', '1964–1965', 'Canastilla y respiraderos de Antonio Vega Sánchez, inspirados en los retablos de San Nicolás.') on conflict ("entity_id") do update set "step_type" = excluded."step_type", "current_condition" = excluded."current_condition", "execution_date_text" = excluded."execution_date_text", "description" = excluded."description";

insert into public."brotherhood_steps" ("id", "brotherhood_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('622c728e-d067-44f2-b175-646520e60b8d', 'c6100000-0000-4000-8000-000000000003', '71053edd-f658-43c2-bc08-44c2303c8464', 'current', 'Paso procesional vigente.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_steps" ("id", "image_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('27cbbe4f-be1e-48a1-b39e-2901f144d14b', '7d9ddfb2-324d-42ec-866c-def6478bd5e5', '71053edd-f658-43c2-bc08-44c2303c8464', 'processional', 'Imagen principal del paso.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('dd07ac7b-e614-403a-a6e5-c579f0fb76ca', 'step', 'Paso de palio de María Santísima de la Candelaria', 'paso-palio-candelaria-sevilla', 'Conjunto de orfebrería y bordados sobre terciopelo azul verdoso.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."steps" ("entity_id", "step_type", "current_condition", "execution_date_text", "description")
values ('dd07ac7b-e614-403a-a6e5-c579f0fb76ca', 'Palio', 'preserved', 'Desde 1924', 'Palio diseñado por Juan Manuel Rodríguez Ojeda y estrenado en 1924, con posteriores fases de orfebrería.') on conflict ("entity_id") do update set "step_type" = excluded."step_type", "current_condition" = excluded."current_condition", "execution_date_text" = excluded."execution_date_text", "description" = excluded."description";

insert into public."brotherhood_steps" ("id", "brotherhood_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('26d574e4-db7a-4383-b379-250038c1afce', 'c6100000-0000-4000-8000-000000000003', 'dd07ac7b-e614-403a-a6e5-c579f0fb76ca', 'current', 'Paso procesional vigente.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_steps" ("id", "image_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('10937a3d-123b-48fc-b83c-8920ad4f2568', '2b597213-f89e-4655-a443-ef3dbc93e8c7', 'dd07ac7b-e614-403a-a6e5-c579f0fb76ca', 'processional', 'Imagen principal del paso.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."cults" ("id", "brotherhood_entity_id", "image_entity_id", "cult_type", "title", "date_rule", "month", "place_id", "description", "status", "is_recurring", "recurrence_label", "display_order")
values ('c05bc203-5cf7-4ae3-8a05-88c8240c2ee7', 'c6100000-0000-4000-8000-000000000003', '2b597213-f89e-4655-a443-ef3dbc93e8c7', 'Triduo', 'Triduo a María Santísima de la Candelaria', 'Finales de enero y víspera del 2 de febrero', 2, '7f94ef03-dcfa-4991-aea8-bfd83cd0c20c', 'Culto anual documentado por la corporación.', 'published', true, 'Anual', 1) on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "cult_type" = excluded."cult_type", "title" = excluded."title", "date_rule" = excluded."date_rule", "month" = excluded."month", "place_id" = excluded."place_id", "description" = excluded."description", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order";

insert into public."cult_entities" ("id", "cult_id", "entity_id", "role", "notes")
values ('d60585fb-caa8-49ff-ada6-7ee7aea6b4ab', 'c05bc203-5cf7-4ae3-8a05-88c8240c2ee7', '2b597213-f89e-4655-a443-ef3dbc93e8c7', 'honoree', 'Titular al que se dedica el culto.') on conflict ("id") do update set "cult_id" = excluded."cult_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "cult_id", "scope")
values ('45cf298e-a278-4aa0-ae15-d9b10371fd70', '445cf5f1-5ff0-4c15-8193-bdc2db1bc278', 'c05bc203-5cf7-4ae3-8a05-88c8240c2ee7', null) on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id", "scope" = excluded."scope";

insert into public."cults" ("id", "brotherhood_entity_id", "image_entity_id", "cult_type", "title", "date_rule", "month", "place_id", "description", "status", "is_recurring", "recurrence_label", "display_order")
values ('ab445390-4f2a-433e-abf5-91087087ea0b', 'c6100000-0000-4000-8000-000000000003', '2b597213-f89e-4655-a443-ef3dbc93e8c7', 'Función', 'Función solemne a María Santísima de la Candelaria', '2 de febrero', 2, '7f94ef03-dcfa-4991-aea8-bfd83cd0c20c', 'Culto anual documentado por la corporación.', 'published', true, 'Anual', 2) on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "cult_type" = excluded."cult_type", "title" = excluded."title", "date_rule" = excluded."date_rule", "month" = excluded."month", "place_id" = excluded."place_id", "description" = excluded."description", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order";

insert into public."cult_entities" ("id", "cult_id", "entity_id", "role", "notes")
values ('5e24976c-31f8-4a04-b7d0-9f2898ef5d4c', 'ab445390-4f2a-433e-abf5-91087087ea0b', '2b597213-f89e-4655-a443-ef3dbc93e8c7', 'honoree', 'Titular al que se dedica el culto.') on conflict ("id") do update set "cult_id" = excluded."cult_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "cult_id", "scope")
values ('fe12f534-f139-42f2-9671-55454ff0f642', '445cf5f1-5ff0-4c15-8193-bdc2db1bc278', 'ab445390-4f2a-433e-abf5-91087087ea0b', null) on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id", "scope" = excluded."scope";

insert into public."cults" ("id", "brotherhood_entity_id", "image_entity_id", "cult_type", "title", "date_rule", "month", "place_id", "description", "status", "is_recurring", "recurrence_label", "display_order")
values ('692ad80f-3b52-4134-ba17-197d44e81e6f', 'c6100000-0000-4000-8000-000000000003', '2b597213-f89e-4655-a443-ef3dbc93e8c7', 'Besamanos', 'Besamanos a María Santísima de la Candelaria', 'En torno al 2 de febrero', 2, '7f94ef03-dcfa-4991-aea8-bfd83cd0c20c', 'Culto anual documentado por la corporación.', 'published', true, 'Anual', 3) on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "cult_type" = excluded."cult_type", "title" = excluded."title", "date_rule" = excluded."date_rule", "month" = excluded."month", "place_id" = excluded."place_id", "description" = excluded."description", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order";

insert into public."cult_entities" ("id", "cult_id", "entity_id", "role", "notes")
values ('cc953880-1b63-46fb-87f3-53825c83a136', '692ad80f-3b52-4134-ba17-197d44e81e6f', '2b597213-f89e-4655-a443-ef3dbc93e8c7', 'honoree', 'Titular al que se dedica el culto.') on conflict ("id") do update set "cult_id" = excluded."cult_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "cult_id", "scope")
values ('55e6f51e-f0d3-4f70-8b85-94855eba3f6c', '445cf5f1-5ff0-4c15-8193-bdc2db1bc278', '692ad80f-3b52-4134-ba17-197d44e81e6f', null) on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id", "scope" = excluded."scope";

insert into public."cults" ("id", "brotherhood_entity_id", "image_entity_id", "cult_type", "title", "date_rule", "month", "place_id", "description", "status", "is_recurring", "recurrence_label", "display_order")
values ('8a29fbcd-c6fc-4402-a047-54a2396e5044', 'c6100000-0000-4000-8000-000000000003', '7d9ddfb2-324d-42ec-866c-def6478bd5e5', 'Besapié', 'Besapié a Nuestro Padre Jesús de la Salud', 'Cuaresma', null, '7f94ef03-dcfa-4991-aea8-bfd83cd0c20c', 'Culto anual documentado por la corporación.', 'published', true, 'Anual', 4) on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "cult_type" = excluded."cult_type", "title" = excluded."title", "date_rule" = excluded."date_rule", "month" = excluded."month", "place_id" = excluded."place_id", "description" = excluded."description", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order";

insert into public."cult_entities" ("id", "cult_id", "entity_id", "role", "notes")
values ('b74ea96f-093c-4140-9ea0-dd9ca4d532b1', '8a29fbcd-c6fc-4402-a047-54a2396e5044', '7d9ddfb2-324d-42ec-866c-def6478bd5e5', 'honoree', 'Titular al que se dedica el culto.') on conflict ("id") do update set "cult_id" = excluded."cult_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "cult_id", "scope")
values ('0826aa4b-93ce-4cb8-a656-79b1c4c45652', '445cf5f1-5ff0-4c15-8193-bdc2db1bc278', '8a29fbcd-c6fc-4402-a047-54a2396e5044', null) on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id", "scope" = excluded."scope";

insert into public."cults" ("id", "brotherhood_entity_id", "image_entity_id", "cult_type", "title", "date_rule", "month", "place_id", "description", "status", "is_recurring", "recurrence_label", "display_order")
values ('13e4fa9a-ebda-45a7-abc5-40351ff57972', 'c6100000-0000-4000-8000-000000000003', '7d9ddfb2-324d-42ec-866c-def6478bd5e5', 'Quinario', 'Quinario a Nuestro Padre Jesús de la Salud', 'Cuaresma', null, '7f94ef03-dcfa-4991-aea8-bfd83cd0c20c', 'Culto anual documentado por la corporación.', 'published', true, 'Anual', 5) on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "cult_type" = excluded."cult_type", "title" = excluded."title", "date_rule" = excluded."date_rule", "month" = excluded."month", "place_id" = excluded."place_id", "description" = excluded."description", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order";

insert into public."cult_entities" ("id", "cult_id", "entity_id", "role", "notes")
values ('34beb873-95c2-43b9-a2fc-cf9bbe8bdb25', '13e4fa9a-ebda-45a7-abc5-40351ff57972', '7d9ddfb2-324d-42ec-866c-def6478bd5e5', 'honoree', 'Titular al que se dedica el culto.') on conflict ("id") do update set "cult_id" = excluded."cult_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "cult_id", "scope")
values ('ad0dec14-a0be-4816-b1a9-0a927df1938e', '445cf5f1-5ff0-4c15-8193-bdc2db1bc278', '13e4fa9a-ebda-45a7-abc5-40351ff57972', null) on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id", "scope" = excluded."scope";

insert into public."cults" ("id", "brotherhood_entity_id", "image_entity_id", "cult_type", "title", "date_rule", "month", "place_id", "description", "status", "is_recurring", "recurrence_label", "display_order")
values ('cfe27aff-4b3d-4518-a6fe-a9e09350a145', 'c6100000-0000-4000-8000-000000000003', null, 'Triduo', 'Triduo sacramental', 'En torno al Corpus Christi', 6, '7f94ef03-dcfa-4991-aea8-bfd83cd0c20c', 'Culto anual documentado por la corporación.', 'published', true, 'Anual', 6) on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "cult_type" = excluded."cult_type", "title" = excluded."title", "date_rule" = excluded."date_rule", "month" = excluded."month", "place_id" = excluded."place_id", "description" = excluded."description", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order";

insert into public."source_links" ("id", "source_id", "cult_id", "scope")
values ('7c61c8a6-e7d4-4176-82a0-0f2243b73354', '445cf5f1-5ff0-4c15-8193-bdc2db1bc278', 'cfe27aff-4b3d-4518-a6fe-a9e09350a145', null) on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id", "scope" = excluded."scope";

insert into public."outings" ("id", "brotherhood_entity_id", "outing_type", "character", "title", "outing_date", "year", "municipality_id", "origin_place_id", "destination_text", "description", "event_status", "status", "slug")
values ('d5c987fe-552e-4a80-82d2-27f04fdb0bf8', 'c6100000-0000-4000-8000-000000000003', 'Estación de Penitencia', 'ordinary', 'La Candelaria · Estación de Penitencia 2026', '2026-03-31', 2026, 'ca85889c-21fe-4367-8477-a57656b25da4', '7f94ef03-dcfa-4991-aea8-bfd83cd0c20c', 'Santa Iglesia Catedral de Sevilla', 'Estación de penitencia del Martes Santo de 2026.', 'held', 'published', 'candelaria-estacion-penitencia-2026') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "outing_type" = excluded."outing_type", "character" = excluded."character", "title" = excluded."title", "outing_date" = excluded."outing_date", "year" = excluded."year", "municipality_id" = excluded."municipality_id", "origin_place_id" = excluded."origin_place_id", "destination_text" = excluded."destination_text", "description" = excluded."description", "event_status" = excluded."event_status", "status" = excluded."status", "slug" = excluded."slug";

insert into public."outing_entities" ("id", "outing_id", "entity_id", "role", "notes")
values ('01bfefc6-5a7c-4b96-88d4-64739dcf39e4', 'd5c987fe-552e-4a80-82d2-27f04fdb0bf8', '7d9ddfb2-324d-42ec-866c-def6478bd5e5', 'processional_image', 'Imagen participante en la estación de penitencia.') on conflict ("id") do update set "outing_id" = excluded."outing_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."outing_entities" ("id", "outing_id", "entity_id", "role", "notes")
values ('b83a2663-d254-4955-a1b6-e1ec7dc71260', 'd5c987fe-552e-4a80-82d2-27f04fdb0bf8', '2b597213-f89e-4655-a443-ef3dbc93e8c7', 'secondary_image', 'Imagen participante en la estación de penitencia.') on conflict ("id") do update set "outing_id" = excluded."outing_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "outing_id", "scope")
values ('edc04f58-a583-4693-a5bb-cff6178c9c7e', 'b5f73fa6-1245-4ff1-8196-f85a789de112', 'd5c987fe-552e-4a80-82d2-27f04fdb0bf8', null) on conflict ("id") do update set "source_id" = excluded."source_id", "outing_id" = excluded."outing_id", "scope" = excluded."scope";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('20385aa7-fcdd-46c9-a970-bf7b1727bac9', 'event', 'Fundación de la Hermandad de la Candelaria', 'fundacion-candelaria-sevilla-1921', 'Las primeras Reglas fueron aprobadas el 4 de junio y la corporación se constituyó el 26 de junio de 1921.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."events" ("entity_id", "event_type", "event_date_text", "place_id", "description", "event_category", "brotherhood_entity_id", "municipality_id", "event_status")
values ('20385aa7-fcdd-46c9-a970-bf7b1727bac9', 'Hito histórico', 'junio de 1921', '7f94ef03-dcfa-4991-aea8-bfd83cd0c20c', 'Las primeras Reglas fueron aprobadas el 4 de junio y la corporación se constituyó el 26 de junio de 1921.', 'historical', 'c6100000-0000-4000-8000-000000000003', 'ca85889c-21fe-4367-8477-a57656b25da4', 'held') on conflict ("entity_id") do update set "event_type" = excluded."event_type", "event_date_text" = excluded."event_date_text", "place_id" = excluded."place_id", "description" = excluded."description", "event_category" = excluded."event_category", "brotherhood_entity_id" = excluded."brotherhood_entity_id", "municipality_id" = excluded."municipality_id", "event_status" = excluded."event_status";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('94182dd5-3167-4777-9375-33651ca40f53', '4b9aea7a-9c92-4019-8ac2-e628d4202826', '20385aa7-fcdd-46c9-a970-bf7b1727bac9', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('dc53e489-6153-4771-ba63-a4342b9b732c', 'event', 'Primera estación de penitencia de la Candelaria', 'primera-estacion-candelaria-sevilla-1922', 'La Hermandad realizó su primera estación a la Catedral el Martes Santo de 1922.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."events" ("entity_id", "event_type", "event_date_text", "place_id", "description", "event_category", "brotherhood_entity_id", "municipality_id", "event_status")
values ('dc53e489-6153-4771-ba63-a4342b9b732c', 'Hito histórico', 'Martes Santo de 1922', null, 'La Hermandad realizó su primera estación a la Catedral el Martes Santo de 1922.', 'historical', 'c6100000-0000-4000-8000-000000000003', 'ca85889c-21fe-4367-8477-a57656b25da4', 'held') on conflict ("entity_id") do update set "event_type" = excluded."event_type", "event_date_text" = excluded."event_date_text", "place_id" = excluded."place_id", "description" = excluded."description", "event_category" = excluded."event_category", "brotherhood_entity_id" = excluded."brotherhood_entity_id", "municipality_id" = excluded."municipality_id", "event_status" = excluded."event_status";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('8d30651e-8729-4cb5-bf4b-196b13cda203', '4b9aea7a-9c92-4019-8ac2-e628d4202826', 'dc53e489-6153-4771-ba63-a4342b9b732c', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('7d5d5fa0-f2de-408e-a5a0-e6f06162b1b7', 'heritage_asset', 'Palio de Juan Manuel Rodríguez Ojeda de la Candelaria', 'palio-rodriguez-ojeda-candelaria-sevilla', 'Techo y bambalinas bordados en plata sobre terciopelo azul verdoso, estrenados en 1924.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."heritage_assets" ("entity_id", "parent_entity_id", "asset_type", "description", "current_condition", "is_current", "display_order", "is_featured")
values ('7d5d5fa0-f2de-408e-a5a0-e6f06162b1b7', 'c6100000-0000-4000-8000-000000000003', 'Bordado procesional', 'Techo y bambalinas bordados en plata sobre terciopelo azul verdoso, estrenados en 1924.', 'Conservado', true, 1, true) on conflict ("entity_id") do update set "parent_entity_id" = excluded."parent_entity_id", "asset_type" = excluded."asset_type", "description" = excluded."description", "current_condition" = excluded."current_condition", "is_current" = excluded."is_current", "display_order" = excluded."display_order", "is_featured" = excluded."is_featured";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('d8d94b96-d8ee-42c1-b2a9-5e336569a849', 'heritage_asset', 'Canastilla rocalla del paso del Señor de la Salud', 'canastilla-rocalla-salud-candelaria', 'Talla de Antonio Vega Sánchez, estrenada en la década de 1960.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."heritage_assets" ("entity_id", "parent_entity_id", "asset_type", "description", "current_condition", "is_current", "display_order", "is_featured")
values ('d8d94b96-d8ee-42c1-b2a9-5e336569a849', 'c6100000-0000-4000-8000-000000000003', 'Paso procesional', 'Talla de Antonio Vega Sánchez, estrenada en la década de 1960.', 'Conservado', true, 2, false) on conflict ("entity_id") do update set "parent_entity_id" = excluded."parent_entity_id", "asset_type" = excluded."asset_type", "description" = excluded."description", "current_condition" = excluded."current_condition", "is_current" = excluded."is_current", "display_order" = excluded."display_order", "is_featured" = excluded."is_featured";

insert into public."brotherhood_habits" ("id", "brotherhood_entity_id", "name", "tunic_description", "hood_description", "cord_description", "footwear_description", "sort_order", "notes", "status")
values ('5cd8c60e-f227-48bf-a74d-5a8318a367ee', 'c6100000-0000-4000-8000-000000000003', 'Hábito de la Candelaria', 'Túnica blanca de cola, antifaz azul y cinturón de esparto.', 'Túnica blanca de cola, antifaz azul y cinturón de esparto.', 'Cinturón de esparto.', 'Calzado negro.', 1, 'Hábito penitencial vigente.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "name" = excluded."name", "tunic_description" = excluded."tunic_description", "hood_description" = excluded."hood_description", "cord_description" = excluded."cord_description", "footwear_description" = excluded."footwear_description", "sort_order" = excluded."sort_order", "notes" = excluded."notes", "status" = excluded."status";

insert into public."music_accompaniment_periods" ("id", "brotherhood_entity_id", "band_entity_id", "step_entity_id", "position", "outing_type", "date_from_text", "year_from", "is_current", "notes", "public_brotherhood_name", "public_step_name", "public_brotherhood_slug", "public_municipality_name", "public_municipality_slug", "public_province", "status")
values ('592aa804-0a8f-42f1-b7f0-1e01d46397b9', 'c6100000-0000-4000-8000-000000000003', '0a86bfb1-afe6-448a-88b9-127867f5b1a9', '71053edd-f658-43c2-bc08-44c2303c8464', 'Tras el paso de Cristo', 'Martes Santo', 'Desde 2001', 2001, true, 'Acompañamiento vigente en 2026.', 'Hermandad de la Candelaria', 'Paso de Cristo', 'hermandad-candelaria-sevilla', 'Sevilla', 'sevilla', 'Sevilla', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "band_entity_id" = excluded."band_entity_id", "step_entity_id" = excluded."step_entity_id", "position" = excluded."position", "outing_type" = excluded."outing_type", "date_from_text" = excluded."date_from_text", "year_from" = excluded."year_from", "is_current" = excluded."is_current", "notes" = excluded."notes", "public_brotherhood_name" = excluded."public_brotherhood_name", "public_step_name" = excluded."public_step_name", "public_brotherhood_slug" = excluded."public_brotherhood_slug", "public_municipality_name" = excluded."public_municipality_name", "public_municipality_slug" = excluded."public_municipality_slug", "public_province" = excluded."public_province", "status" = excluded."status";

insert into public."source_links" ("id", "source_id", "music_accompaniment_period_id", "scope")
values ('bef8a2b2-6b37-4cf2-8a92-9bfa951ddedd', '687f51f0-af2e-4d63-95cd-9ff2bb1825ee', '592aa804-0a8f-42f1-b7f0-1e01d46397b9', null) on conflict ("id") do update set "source_id" = excluded."source_id", "music_accompaniment_period_id" = excluded."music_accompaniment_period_id", "scope" = excluded."scope";

insert into public."music_accompaniment_periods" ("id", "brotherhood_entity_id", "band_entity_id", "step_entity_id", "position", "outing_type", "date_from_text", "year_from", "is_current", "notes", "public_brotherhood_name", "public_step_name", "public_brotherhood_slug", "public_municipality_name", "public_municipality_slug", "public_province", "status")
values ('84931978-6773-45d3-acef-7d7865d2cd55', 'c6100000-0000-4000-8000-000000000003', 'c6000000-0000-4000-8000-000000000001', 'dd07ac7b-e614-403a-a6e5-c579f0fb76ca', 'Tras el paso de palio', 'Martes Santo', 'Desde 1984', 1984, true, 'Acompañamiento vigente desde 1984.', 'Hermandad de la Candelaria', 'Paso de palio', 'hermandad-candelaria-sevilla', 'Sevilla', 'sevilla', 'Sevilla', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "band_entity_id" = excluded."band_entity_id", "step_entity_id" = excluded."step_entity_id", "position" = excluded."position", "outing_type" = excluded."outing_type", "date_from_text" = excluded."date_from_text", "year_from" = excluded."year_from", "is_current" = excluded."is_current", "notes" = excluded."notes", "public_brotherhood_name" = excluded."public_brotherhood_name", "public_step_name" = excluded."public_step_name", "public_brotherhood_slug" = excluded."public_brotherhood_slug", "public_municipality_name" = excluded."public_municipality_name", "public_municipality_slug" = excluded."public_municipality_slug", "public_province" = excluded."public_province", "status" = excluded."status";

insert into public."source_links" ("id", "source_id", "music_accompaniment_period_id", "scope")
values ('bd52056a-7ddd-43b8-b506-6998c1cf3bbb', '687f51f0-af2e-4d63-95cd-9ff2bb1825ee', '84931978-6773-45d3-acef-7d7865d2cd55', null) on conflict ("id") do update set "source_id" = excluded."source_id", "music_accompaniment_period_id" = excluded."music_accompaniment_period_id", "scope" = excluded."scope";

insert into public."music_accompaniment_periods" ("id", "brotherhood_entity_id", "band_entity_id", "step_entity_id", "position", "outing_type", "date_from_text", "year_from", "is_current", "notes", "public_brotherhood_name", "public_step_name", "public_brotherhood_slug", "public_municipality_name", "public_municipality_slug", "public_province", "status")
values ('78afda1b-c942-4725-b93f-2bf2c9fc9e4b', 'c6100000-0000-4000-8000-000000000003', '543613d9-cae7-4430-a4c9-d3160f0fc358', null, 'Cruz de Guía · sección juvenil', 'Martes Santo', 'Vigente · 2026', null, true, 'La sección juvenil abre el cortejo en 2026.', 'Hermandad de la Candelaria', 'Paso de Cristo', 'hermandad-candelaria-sevilla', 'Sevilla', 'sevilla', 'Sevilla', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "band_entity_id" = excluded."band_entity_id", "step_entity_id" = excluded."step_entity_id", "position" = excluded."position", "outing_type" = excluded."outing_type", "date_from_text" = excluded."date_from_text", "year_from" = excluded."year_from", "is_current" = excluded."is_current", "notes" = excluded."notes", "public_brotherhood_name" = excluded."public_brotherhood_name", "public_step_name" = excluded."public_step_name", "public_brotherhood_slug" = excluded."public_brotherhood_slug", "public_municipality_name" = excluded."public_municipality_name", "public_municipality_slug" = excluded."public_municipality_slug", "public_province" = excluded."public_province", "status" = excluded."status";

insert into public."source_links" ("id", "source_id", "music_accompaniment_period_id", "scope")
values ('6a882b9a-4893-43dc-beb5-7aaaaf43892a', '687f51f0-af2e-4d63-95cd-9ff2bb1825ee', '78afda1b-c942-4725-b93f-2bf2c9fc9e4b', null) on conflict ("id") do update set "source_id" = excluded."source_id", "music_accompaniment_period_id" = excluded."music_accompaniment_period_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('5ecf55eb-1746-4f70-b706-96c881f638e4', '687f51f0-af2e-4d63-95cd-9ff2bb1825ee', 'c6100000-0000-4000-8000-000000000003', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('caa87982-cb62-4c29-a3b6-d69bfabc90db', '4b9aea7a-9c92-4019-8ac2-e628d4202826', 'c6100000-0000-4000-8000-000000000003', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('d6ae0d82-8c9a-4da7-ae47-6ce6320e4860', '62a572ff-18a6-436f-93a5-d4250afd860f', 'c6100000-0000-4000-8000-000000000003', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('9b8c7851-b3c4-4165-b019-0a52414ed9e7', 'ef72d168-886b-4133-8d59-acedf502e75c', 'c6100000-0000-4000-8000-000000000003', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('33d60cac-aee4-4f9f-9c8d-2ed9d82e3fdf', '05943d23-79b5-4c52-9db7-d3f45bf35db2', 'c6100000-0000-4000-8000-000000000003', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('cb9ca510-e645-4c5e-a9a7-49793625cf7b', '7591d0a2-b937-4af5-9e15-1dc75adc6a65', 'c6100000-0000-4000-8000-000000000003', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('c831be25-fc7c-49a1-9648-f94fd08a51e9', '445cf5f1-5ff0-4c15-8193-bdc2db1bc278', 'c6100000-0000-4000-8000-000000000003', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('b2a82080-1d6c-4105-af72-b646787346ad', 'b5f73fa6-1245-4ff1-8196-f85a789de112', 'c6100000-0000-4000-8000-000000000003', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('38358ffa-1aba-414c-8b84-194b40f4de33', '62a572ff-18a6-436f-93a5-d4250afd860f', '7d9ddfb2-324d-42ec-866c-def6478bd5e5', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('3da6b25b-4102-4f48-86fb-a92015d7d4bb', 'ef72d168-886b-4133-8d59-acedf502e75c', '2b597213-f89e-4655-a443-ef3dbc93e8c7', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('fb2c6f98-a1a0-4692-9601-7baec906e3d8', '7591d0a2-b937-4af5-9e15-1dc75adc6a65', '7d5d5fa0-f2de-408e-a5a0-e6f06162b1b7', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('0dea294c-fb06-4088-bc4e-3fd7ffba2b7d', '05943d23-79b5-4c52-9db7-d3f45bf35db2', 'd8d94b96-d8ee-42c1-b2a9-5e336569a849', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('6f4481af-4ffd-4be8-a28f-cc87ae78c490', 'Los Javieres · ficha corporativa', 'https://www.hermandades-de-sevilla.org/hermandades/penitencia/martes-santo/los-javieres/', 'web', 'Consejo General de Hermandades y Cofradías de Sevilla', '2026-09-14', 'Historia, titulares y primera estación de penitencia.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('5f35c634-87e1-41ad-a84c-2a48e972cbba', 'Los Javieres promueve la devoción al Sagrado Corazón', 'https://www.archisevilla.org/los-javieres-promueve-la-devocion-al-sagrado-corazon-en-el-mes-de-su-fiesta/', 'web', 'Archidiócesis de Sevilla', '2026-09-14', 'Nueva etapa tras el traslado de la sede canónica al Sagrado Corazón en 2026.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('a0d320b3-3d4c-46c9-a8f5-5e416308afc1', 'Traslado de Los Javieres al Sagrado Corazón', 'https://cadenaser.com/andalucia/2025/11/18/el-traslado-de-los-javieres-al-sagrado-corazon-ya-tiene-fecha-radio-sevilla/', 'web', 'Radio Sevilla · Cadena SER', '2026-09-14', 'Fecha, destino y comodato de la nueva sede canónica.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('9784e840-af76-4480-8773-b6a8329c78d8', 'Restauración del Cristo de las Almas', 'https://cadenaser.com/andalucia/2025/02/25/el-cristo-de-las-almas-repuesto-al-culto-tras-la-restauracion-acometida-por-laura-perez-melendez-radio-sevilla/', 'web', 'Radio Sevilla · Cadena SER', '2026-09-14', 'Autor, fecha y restauración terminada en 2025.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('abb481ab-a4cf-4e3c-9454-63f2705546f5', 'Martes Santo · Hermandad de los Javieres', 'https://bandajuliancerdan.com/martes-santo-hermandad-de-los-javieres/', 'web', 'Banda de Música Julián Cerdán', '2026-09-14', 'Más de veinticinco años tras Gracia y Amparo y vigencia en 2026.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."places" ("id", "municipality_id", "name", "slug", "place_type", "address", "notes")
values ('14de2a85-e68d-4d19-bff1-a4297b97b95d', 'ca85889c-21fe-4367-8477-a57656b25da4', 'Iglesia del Sagrado Corazón de Jesús y Capilla de los Luises', 'iglesia-sagrado-corazon-capilla-luises-sevilla', 'Iglesia', 'Calle Jesús del Gran Poder, Sevilla', 'Sede canónica de Los Javieres desde enero de 2026.') on conflict ("id") do update set "municipality_id" = excluded."municipality_id", "name" = excluded."name", "slug" = excluded."slug", "place_type" = excluded."place_type", "address" = excluded."address", "notes" = excluded."notes";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('f85c567e-4f8a-4070-a8f3-49254e66a19c', 'agent', 'José Luis Pires Azcárraga', 'jose-luis-pires-azcarraga', 'Escultor del Santísimo Cristo de las Almas en 1945.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('13000000-0000-0000-0000-000000000002', 'agent', 'José Rodríguez Fernández-Andes', 'jose-rodriguez-fernandez-andes', 'Escultor de María Santísima de Gracia y Amparo.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('fe21b491-a72f-4312-a2a1-45f0446f1ac8', 'brotherhood', 'Hermandad de los Javieres', 'hermandad-los-javieres-sevilla', 'Hermandad de penitencia nacida en el entorno de la Compañía de Jesús.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."brotherhoods" ("entity_id", "official_name", "popular_name", "foundation_text", "municipality_id", "canonical_see_place_id", "neighborhood", "website_url", "brotherhood_types", "current_procession_day", "history_text", "notes")
values ('fe21b491-a72f-4312-a2a1-45f0446f1ac8', 'Hermandad y Cofradía de Nazarenos del Santísimo Cristo de las Almas, María Santísima de Gracia y Amparo, San Francisco Javier y San Juan Evangelista', 'Los Javieres', '1945', 'ca85889c-21fe-4367-8477-a57656b25da4', '14de2a85-e68d-4d19-bff1-a4297b97b95d', 'Centro', 'https://hermandaddelosjavieres.com/', ARRAY['Penitencia']::text[], 'Martes Santo', 'Fundada en 1945 en el ámbito jesuita, realizó su primera estación en 1957. En enero de 2026 trasladó su sede canónica al Sagrado Corazón, lugar de su etapa fundacional.', 'El paso del Cristo realiza la estación en silencio. Sin fotografías nuevas mientras no conste licencia reutilizable.') on conflict ("entity_id") do update set "official_name" = excluded."official_name", "popular_name" = excluded."popular_name", "foundation_text" = excluded."foundation_text", "municipality_id" = excluded."municipality_id", "canonical_see_place_id" = excluded."canonical_see_place_id", "neighborhood" = excluded."neighborhood", "website_url" = excluded."website_url", "brotherhood_types" = excluded."brotherhood_types", "current_procession_day" = excluded."current_procession_day", "history_text" = excluded."history_text", "notes" = excluded."notes";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('110d1ae7-8a95-4d17-9302-edd4bad5c795', 'image', 'Santísimo Cristo de las Almas', 'santisimo-cristo-almas-javieres-sevilla', 'Crucificado de José Luis Pires Azcárraga, tallado en 1945.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."images" ("entity_id", "image_type", "execution_date_text", "current_condition", "description", "is_dress_image")
values ('110d1ae7-8a95-4d17-9302-edd4bad5c795', 'Cristo crucificado', '1945', 'extant', 'Cristo muerto en la cruz, restaurado por Laura Pérez Meléndez entre 2024 y 2025.', false) on conflict ("entity_id") do update set "image_type" = excluded."image_type", "execution_date_text" = excluded."execution_date_text", "current_condition" = excluded."current_condition", "description" = excluded."description", "is_dress_image" = excluded."is_dress_image";

insert into public."brotherhood_images" ("id", "brotherhood_entity_id", "image_entity_id", "relation_type", "notes", "status")
values ('86f93258-b289-4aeb-9d27-944734766b16', 'fe21b491-a72f-4312-a2a1-45f0446f1ac8', '110d1ae7-8a95-4d17-9302-edd4bad5c795', 'titular', 'Titular vigente documentado.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_authorships" ("id", "image_entity_id", "agent_entity_id", "authorship_type", "role_name", "date_from_text", "certainty", "notes", "status")
values ('909e6519-9be1-4377-ab70-d09768add038', '110d1ae7-8a95-4d17-9302-edd4bad5c795', 'f85c567e-4f8a-4070-a8f3-49254e66a19c', 'author', 'escultor', '1945', 'documented', 'Autoría documentada.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "agent_entity_id" = excluded."agent_entity_id", "authorship_type" = excluded."authorship_type", "role_name" = excluded."role_name", "date_from_text" = excluded."date_from_text", "certainty" = excluded."certainty", "notes" = excluded."notes", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('6d3ee4e7-d92d-4192-838e-31b0b707de98', 'image', 'María Santísima de Gracia y Amparo', 'maria-santisima-gracia-amparo-javieres-sevilla', 'Dolorosa de José Fernández-Andes vinculada a la Hermandad desde su etapa inicial.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."images" ("entity_id", "image_type", "execution_date_text", "current_condition", "description", "is_dress_image")
values ('6d3ee4e7-d92d-4192-838e-31b0b707de98', 'Dolorosa de vestir', 'Década de 1940', 'extant', 'Titular mariana que procesiona bajo palio acompañada por San Juan Evangelista.', true) on conflict ("entity_id") do update set "image_type" = excluded."image_type", "execution_date_text" = excluded."execution_date_text", "current_condition" = excluded."current_condition", "description" = excluded."description", "is_dress_image" = excluded."is_dress_image";

insert into public."brotherhood_images" ("id", "brotherhood_entity_id", "image_entity_id", "relation_type", "notes", "status")
values ('3b396365-5461-4ceb-80ba-cf09bdba8648', 'fe21b491-a72f-4312-a2a1-45f0446f1ac8', '6d3ee4e7-d92d-4192-838e-31b0b707de98', 'titular', 'Titular vigente documentado.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_authorships" ("id", "image_entity_id", "agent_entity_id", "authorship_type", "role_name", "date_from_text", "certainty", "notes", "status")
values ('b7321a8f-062e-413c-a204-d2b5103fb818', '6d3ee4e7-d92d-4192-838e-31b0b707de98', '13000000-0000-0000-0000-000000000002', 'author', 'escultor', 'Década de 1940', 'documented', 'Autoría documentada.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "agent_entity_id" = excluded."agent_entity_id", "authorship_type" = excluded."authorship_type", "role_name" = excluded."role_name", "date_from_text" = excluded."date_from_text", "certainty" = excluded."certainty", "notes" = excluded."notes", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('be13aef1-6210-43e8-ab44-2bcd378adfab', 'step', 'Paso del Santísimo Cristo de las Almas', 'paso-cristo-almas-javieres-sevilla', 'Paso del Crucificado de las Almas.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."steps" ("entity_id", "step_type", "current_condition", "execution_date_text", "description")
values ('be13aef1-6210-43e8-ab44-2bcd378adfab', 'Crucificado', 'preserved', null, 'Paso procesional del Cristo de las Almas; realiza la estación sin acompañamiento musical.') on conflict ("entity_id") do update set "step_type" = excluded."step_type", "current_condition" = excluded."current_condition", "execution_date_text" = excluded."execution_date_text", "description" = excluded."description";

insert into public."brotherhood_steps" ("id", "brotherhood_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('bf84990a-b6e2-4e9b-883c-bd912c0b62d6', 'fe21b491-a72f-4312-a2a1-45f0446f1ac8', 'be13aef1-6210-43e8-ab44-2bcd378adfab', 'current', 'Paso procesional vigente.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_steps" ("id", "image_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('0ef2d0a9-70b0-4e7a-a425-2f76f45da282', '110d1ae7-8a95-4d17-9302-edd4bad5c795', 'be13aef1-6210-43e8-ab44-2bcd378adfab', 'processional', 'Imagen principal del paso.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('375ddea3-2299-41d4-977f-16ffc9ce1f82', 'step', 'Paso de palio de María Santísima de Gracia y Amparo', 'paso-palio-gracia-amparo-javieres-sevilla', 'Paso de palio de Gracia y Amparo.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."steps" ("entity_id", "step_type", "current_condition", "execution_date_text", "description")
values ('375ddea3-2299-41d4-977f-16ffc9ce1f82', 'Palio', 'preserved', null, 'Paso de palio de la titular mariana de Los Javieres.') on conflict ("entity_id") do update set "step_type" = excluded."step_type", "current_condition" = excluded."current_condition", "execution_date_text" = excluded."execution_date_text", "description" = excluded."description";

insert into public."brotherhood_steps" ("id", "brotherhood_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('2722ba3d-4265-44a6-abf9-9f5f47328241', 'fe21b491-a72f-4312-a2a1-45f0446f1ac8', '375ddea3-2299-41d4-977f-16ffc9ce1f82', 'current', 'Paso procesional vigente.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_steps" ("id", "image_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('f0bcd067-3342-4205-9533-9476042da68a', '6d3ee4e7-d92d-4192-838e-31b0b707de98', '375ddea3-2299-41d4-977f-16ffc9ce1f82', 'processional', 'Imagen principal del paso.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."cults" ("id", "brotherhood_entity_id", "image_entity_id", "cult_type", "title", "date_rule", "month", "place_id", "description", "status", "is_recurring", "recurrence_label", "display_order")
values ('ef89b554-343e-4e8d-a705-a9fff8417923', 'fe21b491-a72f-4312-a2a1-45f0446f1ac8', '110d1ae7-8a95-4d17-9302-edd4bad5c795', 'Quinario', 'Quinario al Santísimo Cristo de las Almas', 'Cuaresma', null, '14de2a85-e68d-4d19-bff1-a4297b97b95d', 'Culto anual documentado por la corporación.', 'published', true, 'Anual', 1) on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "cult_type" = excluded."cult_type", "title" = excluded."title", "date_rule" = excluded."date_rule", "month" = excluded."month", "place_id" = excluded."place_id", "description" = excluded."description", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order";

insert into public."cult_entities" ("id", "cult_id", "entity_id", "role", "notes")
values ('d292d184-7902-41bb-8397-e8b1a8fb6dda', 'ef89b554-343e-4e8d-a705-a9fff8417923', '110d1ae7-8a95-4d17-9302-edd4bad5c795', 'honoree', 'Titular al que se dedica el culto.') on conflict ("id") do update set "cult_id" = excluded."cult_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "cult_id", "scope")
values ('0d4ceaa8-aecc-4d5c-9a43-47b27328722f', '6f4481af-4ffd-4be8-a28f-cc87ae78c490', 'ef89b554-343e-4e8d-a705-a9fff8417923', null) on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id", "scope" = excluded."scope";

insert into public."cults" ("id", "brotherhood_entity_id", "image_entity_id", "cult_type", "title", "date_rule", "month", "place_id", "description", "status", "is_recurring", "recurrence_label", "display_order")
values ('7720d5d2-4c56-447b-a124-a56058c66cea', 'fe21b491-a72f-4312-a2a1-45f0446f1ac8', '110d1ae7-8a95-4d17-9302-edd4bad5c795', 'Función Principal', 'Función Principal de Instituto', 'Cuaresma', null, '14de2a85-e68d-4d19-bff1-a4297b97b95d', 'Culto anual documentado por la corporación.', 'published', true, 'Anual', 2) on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "cult_type" = excluded."cult_type", "title" = excluded."title", "date_rule" = excluded."date_rule", "month" = excluded."month", "place_id" = excluded."place_id", "description" = excluded."description", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order";

insert into public."cult_entities" ("id", "cult_id", "entity_id", "role", "notes")
values ('eef474ec-ce09-4358-915c-35664c914b90', '7720d5d2-4c56-447b-a124-a56058c66cea', '110d1ae7-8a95-4d17-9302-edd4bad5c795', 'honoree', 'Titular al que se dedica el culto.') on conflict ("id") do update set "cult_id" = excluded."cult_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "cult_id", "scope")
values ('55f982fd-30a4-4622-b689-caacf996ba3d', '6f4481af-4ffd-4be8-a28f-cc87ae78c490', '7720d5d2-4c56-447b-a124-a56058c66cea', null) on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id", "scope" = excluded."scope";

insert into public."cults" ("id", "brotherhood_entity_id", "image_entity_id", "cult_type", "title", "date_rule", "month", "place_id", "description", "status", "is_recurring", "recurrence_label", "display_order")
values ('c9f64242-9504-4b05-98ee-2bc37cc13167', 'fe21b491-a72f-4312-a2a1-45f0446f1ac8', '110d1ae7-8a95-4d17-9302-edd4bad5c795', 'Besapié', 'Besapié al Santísimo Cristo de las Almas', 'Cuaresma', null, '14de2a85-e68d-4d19-bff1-a4297b97b95d', 'Culto anual documentado por la corporación.', 'published', true, 'Anual', 3) on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "cult_type" = excluded."cult_type", "title" = excluded."title", "date_rule" = excluded."date_rule", "month" = excluded."month", "place_id" = excluded."place_id", "description" = excluded."description", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order";

insert into public."cult_entities" ("id", "cult_id", "entity_id", "role", "notes")
values ('243faeb6-7290-4468-abbe-2a094c59a6f4', 'c9f64242-9504-4b05-98ee-2bc37cc13167', '110d1ae7-8a95-4d17-9302-edd4bad5c795', 'honoree', 'Titular al que se dedica el culto.') on conflict ("id") do update set "cult_id" = excluded."cult_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "cult_id", "scope")
values ('4f2117ec-8b5c-4bd6-923c-595c3eb32e3d', '6f4481af-4ffd-4be8-a28f-cc87ae78c490', 'c9f64242-9504-4b05-98ee-2bc37cc13167', null) on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id", "scope" = excluded."scope";

insert into public."cults" ("id", "brotherhood_entity_id", "image_entity_id", "cult_type", "title", "date_rule", "month", "place_id", "description", "status", "is_recurring", "recurrence_label", "display_order")
values ('343ae3ae-a266-4347-aa38-e45e68655c14', 'fe21b491-a72f-4312-a2a1-45f0446f1ac8', '6d3ee4e7-d92d-4192-838e-31b0b707de98', 'Triduo', 'Triduo a María Santísima de Gracia y Amparo', 'Otoño', null, '14de2a85-e68d-4d19-bff1-a4297b97b95d', 'Culto anual documentado por la corporación.', 'published', true, 'Anual', 4) on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "cult_type" = excluded."cult_type", "title" = excluded."title", "date_rule" = excluded."date_rule", "month" = excluded."month", "place_id" = excluded."place_id", "description" = excluded."description", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order";

insert into public."cult_entities" ("id", "cult_id", "entity_id", "role", "notes")
values ('70148ae8-a558-4e41-bf1d-db6766b1dfdb', '343ae3ae-a266-4347-aa38-e45e68655c14', '6d3ee4e7-d92d-4192-838e-31b0b707de98', 'honoree', 'Titular al que se dedica el culto.') on conflict ("id") do update set "cult_id" = excluded."cult_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "cult_id", "scope")
values ('57448c9c-1bdf-4c8d-8c24-8cd4986d87ed', '6f4481af-4ffd-4be8-a28f-cc87ae78c490', '343ae3ae-a266-4347-aa38-e45e68655c14', null) on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id", "scope" = excluded."scope";

insert into public."cults" ("id", "brotherhood_entity_id", "image_entity_id", "cult_type", "title", "date_rule", "month", "place_id", "description", "status", "is_recurring", "recurrence_label", "display_order")
values ('4a1337f1-b07f-4a19-98d6-7f9c2cdba182', 'fe21b491-a72f-4312-a2a1-45f0446f1ac8', '6d3ee4e7-d92d-4192-838e-31b0b707de98', 'Besamanos', 'Besamanos a María Santísima de Gracia y Amparo', 'Otoño', null, '14de2a85-e68d-4d19-bff1-a4297b97b95d', 'Culto anual documentado por la corporación.', 'published', true, 'Anual', 5) on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "cult_type" = excluded."cult_type", "title" = excluded."title", "date_rule" = excluded."date_rule", "month" = excluded."month", "place_id" = excluded."place_id", "description" = excluded."description", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order";

insert into public."cult_entities" ("id", "cult_id", "entity_id", "role", "notes")
values ('5dd9ecd4-f010-4219-abec-54015d16555b', '4a1337f1-b07f-4a19-98d6-7f9c2cdba182', '6d3ee4e7-d92d-4192-838e-31b0b707de98', 'honoree', 'Titular al que se dedica el culto.') on conflict ("id") do update set "cult_id" = excluded."cult_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "cult_id", "scope")
values ('3ab87391-0560-4013-a48a-2e9f7d799e33', '6f4481af-4ffd-4be8-a28f-cc87ae78c490', '4a1337f1-b07f-4a19-98d6-7f9c2cdba182', null) on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id", "scope" = excluded."scope";

insert into public."outings" ("id", "brotherhood_entity_id", "outing_type", "character", "title", "outing_date", "year", "municipality_id", "origin_place_id", "destination_text", "description", "event_status", "status", "slug")
values ('964f6550-a8df-4e2e-89a3-2f7d10e27558', 'fe21b491-a72f-4312-a2a1-45f0446f1ac8', 'Estación de Penitencia', 'ordinary', 'Los Javieres · Estación de Penitencia 2026', '2026-03-31', 2026, 'ca85889c-21fe-4367-8477-a57656b25da4', '14de2a85-e68d-4d19-bff1-a4297b97b95d', 'Santa Iglesia Catedral de Sevilla', 'Estación de penitencia del Martes Santo de 2026.', 'held', 'published', 'javieres-estacion-penitencia-2026') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "outing_type" = excluded."outing_type", "character" = excluded."character", "title" = excluded."title", "outing_date" = excluded."outing_date", "year" = excluded."year", "municipality_id" = excluded."municipality_id", "origin_place_id" = excluded."origin_place_id", "destination_text" = excluded."destination_text", "description" = excluded."description", "event_status" = excluded."event_status", "status" = excluded."status", "slug" = excluded."slug";

insert into public."outing_entities" ("id", "outing_id", "entity_id", "role", "notes")
values ('d1633348-7a8f-4d53-b81c-68e12274bc16', '964f6550-a8df-4e2e-89a3-2f7d10e27558', '110d1ae7-8a95-4d17-9302-edd4bad5c795', 'processional_image', 'Imagen participante en la estación de penitencia.') on conflict ("id") do update set "outing_id" = excluded."outing_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."outing_entities" ("id", "outing_id", "entity_id", "role", "notes")
values ('970ab9be-8071-4af8-bf16-817a00466048', '964f6550-a8df-4e2e-89a3-2f7d10e27558', '6d3ee4e7-d92d-4192-838e-31b0b707de98', 'secondary_image', 'Imagen participante en la estación de penitencia.') on conflict ("id") do update set "outing_id" = excluded."outing_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "outing_id", "scope")
values ('03f11dd6-b3ef-4c30-be86-3c251c1e5ad0', 'b5f73fa6-1245-4ff1-8196-f85a789de112', '964f6550-a8df-4e2e-89a3-2f7d10e27558', null) on conflict ("id") do update set "source_id" = excluded."source_id", "outing_id" = excluded."outing_id", "scope" = excluded."scope";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('c046da0a-6d1a-46bb-ba68-ed2c44ac0b6b', 'event', 'Fundación de la Hermandad de los Javieres', 'fundacion-javieres-sevilla-1945', 'La corporación nació en 1945 vinculada a la Congregación Mariana de los Javieres.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."events" ("entity_id", "event_type", "event_date_text", "place_id", "description", "event_category", "brotherhood_entity_id", "municipality_id", "event_status")
values ('c046da0a-6d1a-46bb-ba68-ed2c44ac0b6b', 'Hito histórico', '1945', null, 'La corporación nació en 1945 vinculada a la Congregación Mariana de los Javieres.', 'historical', 'fe21b491-a72f-4312-a2a1-45f0446f1ac8', 'ca85889c-21fe-4367-8477-a57656b25da4', 'held') on conflict ("entity_id") do update set "event_type" = excluded."event_type", "event_date_text" = excluded."event_date_text", "place_id" = excluded."place_id", "description" = excluded."description", "event_category" = excluded."event_category", "brotherhood_entity_id" = excluded."brotherhood_entity_id", "municipality_id" = excluded."municipality_id", "event_status" = excluded."event_status";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('18d7068d-bb4f-47ab-a9a0-2c9b86be686b', '6f4481af-4ffd-4be8-a28f-cc87ae78c490', 'c046da0a-6d1a-46bb-ba68-ed2c44ac0b6b', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('28118aa6-19fa-42c4-bc54-1477bff19c6f', 'event', 'Primera estación de penitencia de Los Javieres', 'primera-estacion-javieres-sevilla-1957', 'La Hermandad realizó su primera estación a la Catedral en 1957 con el Cristo de las Almas.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."events" ("entity_id", "event_type", "event_date_text", "place_id", "description", "event_category", "brotherhood_entity_id", "municipality_id", "event_status")
values ('28118aa6-19fa-42c4-bc54-1477bff19c6f', 'Hito histórico', 'Martes Santo de 1957', null, 'La Hermandad realizó su primera estación a la Catedral en 1957 con el Cristo de las Almas.', 'historical', 'fe21b491-a72f-4312-a2a1-45f0446f1ac8', 'ca85889c-21fe-4367-8477-a57656b25da4', 'held') on conflict ("entity_id") do update set "event_type" = excluded."event_type", "event_date_text" = excluded."event_date_text", "place_id" = excluded."place_id", "description" = excluded."description", "event_category" = excluded."event_category", "brotherhood_entity_id" = excluded."brotherhood_entity_id", "municipality_id" = excluded."municipality_id", "event_status" = excluded."event_status";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('f793adb6-919e-4d15-98dc-da6609dc16d0', '6f4481af-4ffd-4be8-a28f-cc87ae78c490', '28118aa6-19fa-42c4-bc54-1477bff19c6f', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('61502fd4-df28-4397-baaa-a1797b948498', 'event', 'Traslado de Los Javieres al Sagrado Corazón', 'traslado-javieres-sagrado-corazon-2026', 'Los titulares fueron trasladados desde Omnium Sanctorum a la nueva sede canónica del Sagrado Corazón.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."events" ("entity_id", "event_type", "event_date_text", "place_id", "description", "event_category", "brotherhood_entity_id", "municipality_id", "event_status")
values ('61502fd4-df28-4397-baaa-a1797b948498', 'Hito histórico', '17 de enero de 2026', '14de2a85-e68d-4d19-bff1-a4297b97b95d', 'Los titulares fueron trasladados desde Omnium Sanctorum a la nueva sede canónica del Sagrado Corazón.', 'historical', 'fe21b491-a72f-4312-a2a1-45f0446f1ac8', 'ca85889c-21fe-4367-8477-a57656b25da4', 'held') on conflict ("entity_id") do update set "event_type" = excluded."event_type", "event_date_text" = excluded."event_date_text", "place_id" = excluded."place_id", "description" = excluded."description", "event_category" = excluded."event_category", "brotherhood_entity_id" = excluded."brotherhood_entity_id", "municipality_id" = excluded."municipality_id", "event_status" = excluded."event_status";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('72b41d47-e71e-462f-bb2f-a5b898fb1a5d', 'a0d320b3-3d4c-46c9-a8f5-5e416308afc1', '61502fd4-df28-4397-baaa-a1797b948498', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('acede053-efc3-4cd6-8d2b-cd0bbdc8402b', 'heritage_asset', 'Cruz del Santísimo Cristo de las Almas', 'cruz-cristo-almas-javieres-sevilla', 'Cruz procesional del titular cristífero.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."heritage_assets" ("entity_id", "parent_entity_id", "asset_type", "description", "current_condition", "is_current", "display_order", "is_featured")
values ('acede053-efc3-4cd6-8d2b-cd0bbdc8402b', 'fe21b491-a72f-4312-a2a1-45f0446f1ac8', 'Atributo iconográfico', 'Cruz procesional del titular cristífero.', 'Conservado', true, 1, true) on conflict ("entity_id") do update set "parent_entity_id" = excluded."parent_entity_id", "asset_type" = excluded."asset_type", "description" = excluded."description", "current_condition" = excluded."current_condition", "is_current" = excluded."is_current", "display_order" = excluded."display_order", "is_featured" = excluded."is_featured";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('746b374d-dd2e-4932-b499-db3006e88083', 'heritage_asset', 'Conjunto de palio de Gracia y Amparo', 'conjunto-palio-gracia-amparo-javieres', 'Conjunto patrimonial del paso de palio de María Santísima de Gracia y Amparo.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."heritage_assets" ("entity_id", "parent_entity_id", "asset_type", "description", "current_condition", "is_current", "display_order", "is_featured")
values ('746b374d-dd2e-4932-b499-db3006e88083', 'fe21b491-a72f-4312-a2a1-45f0446f1ac8', 'Paso procesional', 'Conjunto patrimonial del paso de palio de María Santísima de Gracia y Amparo.', 'Conservado', true, 2, false) on conflict ("entity_id") do update set "parent_entity_id" = excluded."parent_entity_id", "asset_type" = excluded."asset_type", "description" = excluded."description", "current_condition" = excluded."current_condition", "is_current" = excluded."is_current", "display_order" = excluded."display_order", "is_featured" = excluded."is_featured";

insert into public."brotherhood_habits" ("id", "brotherhood_entity_id", "name", "tunic_description", "hood_description", "cord_description", "footwear_description", "sort_order", "notes", "status")
values ('f680b28e-23ed-40f6-9f17-90b219bd460e', 'fe21b491-a72f-4312-a2a1-45f0446f1ac8', 'Hábito de Los Javieres', 'Túnica y antifaz negros de ruán, con cinturón de esparto.', 'Túnica y antifaz negros de ruán, con cinturón de esparto.', 'Cinturón de esparto.', 'Calzado negro.', 1, 'Hábito penitencial vigente.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "name" = excluded."name", "tunic_description" = excluded."tunic_description", "hood_description" = excluded."hood_description", "cord_description" = excluded."cord_description", "footwear_description" = excluded."footwear_description", "sort_order" = excluded."sort_order", "notes" = excluded."notes", "status" = excluded."status";

insert into public."music_accompaniment_periods" ("id", "brotherhood_entity_id", "band_entity_id", "step_entity_id", "position", "outing_type", "date_from_text", "year_from", "is_current", "notes", "public_brotherhood_name", "public_step_name", "public_brotherhood_slug", "public_municipality_name", "public_municipality_slug", "public_province", "status")
values ('dfb0af9a-0c15-4113-98e6-7959f37b8253', 'fe21b491-a72f-4312-a2a1-45f0446f1ac8', 'a02d98fc-7c05-4b40-bf82-9fc3eca8bdb4', '375ddea3-2299-41d4-977f-16ffc9ce1f82', 'Tras el paso de palio', 'Martes Santo', 'Desde 1999', 1999, true, 'Vigente en 2026; el paso del Cristo procesiona en silencio.', 'Hermandad de los Javieres', 'Paso de palio', 'hermandad-los-javieres-sevilla', 'Sevilla', 'sevilla', 'Sevilla', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "band_entity_id" = excluded."band_entity_id", "step_entity_id" = excluded."step_entity_id", "position" = excluded."position", "outing_type" = excluded."outing_type", "date_from_text" = excluded."date_from_text", "year_from" = excluded."year_from", "is_current" = excluded."is_current", "notes" = excluded."notes", "public_brotherhood_name" = excluded."public_brotherhood_name", "public_step_name" = excluded."public_step_name", "public_brotherhood_slug" = excluded."public_brotherhood_slug", "public_municipality_name" = excluded."public_municipality_name", "public_municipality_slug" = excluded."public_municipality_slug", "public_province" = excluded."public_province", "status" = excluded."status";

insert into public."source_links" ("id", "source_id", "music_accompaniment_period_id", "scope")
values ('19311e47-ae1b-431c-8047-630a72849c89', 'abb481ab-a4cf-4e3c-9454-63f2705546f5', 'dfb0af9a-0c15-4113-98e6-7959f37b8253', null) on conflict ("id") do update set "source_id" = excluded."source_id", "music_accompaniment_period_id" = excluded."music_accompaniment_period_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('ed37e650-1110-4c0d-b2c8-169b91c8df7f', '6f4481af-4ffd-4be8-a28f-cc87ae78c490', 'fe21b491-a72f-4312-a2a1-45f0446f1ac8', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('5820d414-b3e0-4b6c-810e-22142595e885', '5f35c634-87e1-41ad-a84c-2a48e972cbba', 'fe21b491-a72f-4312-a2a1-45f0446f1ac8', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('d1a54ebb-94b6-45ba-ac95-841f78f0299c', 'a0d320b3-3d4c-46c9-a8f5-5e416308afc1', 'fe21b491-a72f-4312-a2a1-45f0446f1ac8', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('80e3ea55-a2ea-47cd-9a2f-2859d6249b8e', '9784e840-af76-4480-8773-b6a8329c78d8', 'fe21b491-a72f-4312-a2a1-45f0446f1ac8', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('ba81045e-130b-4702-88db-8e0846798b52', 'abb481ab-a4cf-4e3c-9454-63f2705546f5', 'fe21b491-a72f-4312-a2a1-45f0446f1ac8', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('1f281415-f4be-4691-8874-b66ece611ee5', 'b5f73fa6-1245-4ff1-8196-f85a789de112', 'fe21b491-a72f-4312-a2a1-45f0446f1ac8', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('a6181d3c-d5e8-4d23-af37-c7a008245e6f', '9784e840-af76-4480-8773-b6a8329c78d8', '110d1ae7-8a95-4d17-9302-edd4bad5c795', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('8848c134-a8df-4072-94a0-7aa5e1ad6ebd', '6f4481af-4ffd-4be8-a28f-cc87ae78c490', 'acede053-efc3-4cd6-8d2b-cd0bbdc8402b', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('a11252fe-7607-4ab2-ad1b-63a9aea77b9e', '6f4481af-4ffd-4be8-a28f-cc87ae78c490', '746b374d-dd2e-4932-b499-db3006e88083', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('421ae2de-6572-4259-85a7-678d544679d9', 'Web oficial · Hermandad de los Estudiantes', 'https://hermandaddelosestudiantes.es/', 'web', 'Hermandad de los Estudiantes', '2026-09-14', 'Identidad, actualidad, sede y vida corporativa.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('71de2d71-c572-4e1c-bcb2-ae2a9e004fbd', 'Cronología · Hermandad de los Estudiantes', 'https://hermandaddelosestudiantes.es/hermandad/historia/cronologia/', 'web', 'Hermandad de los Estudiantes', '2026-09-14', 'Fundación, primeras estaciones e hitos históricos.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('0f3f9b3d-f138-490d-8faf-c7ab36633718', 'Santísimo Cristo de la Buena Muerte · Estudiantes', 'https://hermandaddelosestudiantes.es/titulares/santisimo-cristo/', 'web', 'Hermandad de los Estudiantes', '2026-09-14', 'Contrato, autoría, datación y restauraciones del Crucificado.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('0f0001e4-7451-43e3-a2c0-578bfc0405f9', 'María Santísima de la Angustia · Estudiantes', 'https://hermandaddelosestudiantes.es/titulares/santisima-virgen/', 'web', 'Hermandad de los Estudiantes', '2026-09-14', 'Atribución, datación, advocación y restauraciones de la Dolorosa.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('dabb08af-443f-4f36-b4e3-21a8715adc79', 'Paso de Cristo · Estudiantes', 'https://hermandaddelosestudiantes.es/hermandad/paso-de-cristo/', 'web', 'Hermandad de los Estudiantes', '2026-09-14', 'Descripción del paso del Cristo de la Buena Muerte.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('9ffbb00b-f37e-447b-9870-8c0d6dcb9b9a', 'Paso de Virgen · Estudiantes', 'https://hermandaddelosestudiantes.es/hermandad/paso-de-virgen/', 'web', 'Hermandad de los Estudiantes', '2026-09-14', 'Proyecto de Joaquín Castilla, orfebrería y bordados del palio.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('79903b6b-1e1d-4497-ad45-5dff54bb96ac', 'Cofradía · Hermandad de los Estudiantes', 'https://hermandaddelosestudiantes.es/hermandad/cofradia/', 'web', 'Hermandad de los Estudiantes', '2026-09-14', 'Hábito, composición y música del cortejo.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."places" ("id", "municipality_id", "name", "slug", "place_type", "address", "notes")
values ('29095db8-07da-4ba1-bfb3-623a117c6633', 'ca85889c-21fe-4367-8477-a57656b25da4', 'Capilla de la Universidad de Sevilla', 'capilla-universidad-sevilla', 'Capilla', 'Calle San Fernando, 4, 41004 Sevilla', 'Sede canónica de la Hermandad de los Estudiantes; cerrada temporalmente por obras en septiembre de 2026.') on conflict ("id") do update set "municipality_id" = excluded."municipality_id", "name" = excluded."name", "slug" = excluded."slug", "place_type" = excluded."place_type", "address" = excluded."address", "notes" = excluded."notes";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('68d39c3f-c9d7-43d3-9986-fb616de2b164', 'agent', 'Juan de Mesa', 'juan-de-mesa', 'Escultor autor del Cristo de la Buena Muerte en 1620.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('a5264497-9e32-49ab-9773-130fe8ae7a76', 'agent', 'Juan de Astorga', 'juan-de-astorga', 'Escultor al que se atribuye María Santísima de la Angustia.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('52c9fcc7-46fd-49e0-9395-f76653ac783e', 'brotherhood', 'Hermandad de los Estudiantes', 'hermandad-de-los-estudiantes-sevilla', 'Hermandad universitaria de penitencia con sede en la antigua Fábrica de Tabacos.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."brotherhoods" ("entity_id", "official_name", "popular_name", "foundation_text", "municipality_id", "canonical_see_place_id", "neighborhood", "website_url", "brotherhood_types", "current_procession_day", "history_text", "notes")
values ('52c9fcc7-46fd-49e0-9395-f76653ac783e', 'Pontificia, Patriarcal e Ilustrísima Hermandad y Archicofradía de Nazarenos del Santísimo Cristo de la Buena Muerte y María Santísima de la Angustia', 'Los Estudiantes', '1924', 'ca85889c-21fe-4367-8477-a57656b25da4', '29095db8-07da-4ba1-bfb3-623a117c6633', 'Universidad', 'https://hermandaddelosestudiantes.es/', ARRAY['Penitencia']::text[], 'Martes Santo', 'Fundada por profesores y estudiantes en 1924 en la iglesia de la Anunciación, trasladó su sede a la Capilla de la Universidad en 1966.', 'El paso del Cristo realiza la estación en silencio. Los titulares permanecen temporalmente en el Sagrario por obras iniciadas en 2026; la sede canónica no se altera. Sin fotografías nuevas sin licencia reutilizable.') on conflict ("entity_id") do update set "official_name" = excluded."official_name", "popular_name" = excluded."popular_name", "foundation_text" = excluded."foundation_text", "municipality_id" = excluded."municipality_id", "canonical_see_place_id" = excluded."canonical_see_place_id", "neighborhood" = excluded."neighborhood", "website_url" = excluded."website_url", "brotherhood_types" = excluded."brotherhood_types", "current_procession_day" = excluded."current_procession_day", "history_text" = excluded."history_text", "notes" = excluded."notes";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('a8d91d56-300d-4b5c-b1f4-a69ce0f73294', 'image', 'Santísimo Cristo de la Buena Muerte', 'santisimo-cristo-buena-muerte-estudiantes-sevilla', 'Crucificado de Juan de Mesa, contratado y terminado en 1620.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."images" ("entity_id", "image_type", "execution_date_text", "current_condition", "description", "is_dress_image")
values ('a8d91d56-300d-4b5c-b1f4-a69ce0f73294', 'Cristo crucificado', '1620', 'extant', 'Crucificado tallado en cedro por Juan de Mesa; la autoría quedó confirmada documentalmente durante la restauración de 1983.', false) on conflict ("entity_id") do update set "image_type" = excluded."image_type", "execution_date_text" = excluded."execution_date_text", "current_condition" = excluded."current_condition", "description" = excluded."description", "is_dress_image" = excluded."is_dress_image";

insert into public."brotherhood_images" ("id", "brotherhood_entity_id", "image_entity_id", "relation_type", "notes", "status")
values ('984415ba-df8c-4ece-98b0-fd52ead0f6c9', '52c9fcc7-46fd-49e0-9395-f76653ac783e', 'a8d91d56-300d-4b5c-b1f4-a69ce0f73294', 'titular', 'Titular vigente documentado.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_authorships" ("id", "image_entity_id", "agent_entity_id", "authorship_type", "role_name", "date_from_text", "certainty", "notes", "status")
values ('7ea5490c-2d97-4a48-836a-fa9428169ab9', 'a8d91d56-300d-4b5c-b1f4-a69ce0f73294', '68d39c3f-c9d7-43d3-9986-fb616de2b164', 'author', 'escultor', '1620', 'documented', 'Autoría documentada.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "agent_entity_id" = excluded."agent_entity_id", "authorship_type" = excluded."authorship_type", "role_name" = excluded."role_name", "date_from_text" = excluded."date_from_text", "certainty" = excluded."certainty", "notes" = excluded."notes", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('66284ce3-2a65-4d24-9ced-504ebcdfc6da', 'image', 'María Santísima de la Angustia', 'maria-santisima-angustia-estudiantes-sevilla', 'Dolorosa atribuida a Juan de Astorga, realizada hacia 1817.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."images" ("entity_id", "image_type", "execution_date_text", "current_condition", "description", "is_dress_image")
values ('66284ce3-2a65-4d24-9ced-504ebcdfc6da', 'Dolorosa de vestir', 'Hacia 1817', 'extant', 'Dolorosa romántica procedente de la extinguida Cofradía del Despedimiento de Cristo.', true) on conflict ("entity_id") do update set "image_type" = excluded."image_type", "execution_date_text" = excluded."execution_date_text", "current_condition" = excluded."current_condition", "description" = excluded."description", "is_dress_image" = excluded."is_dress_image";

insert into public."brotherhood_images" ("id", "brotherhood_entity_id", "image_entity_id", "relation_type", "notes", "status")
values ('55f8a5b3-56a5-4af4-a2c9-d496ff0f6644', '52c9fcc7-46fd-49e0-9395-f76653ac783e', '66284ce3-2a65-4d24-9ced-504ebcdfc6da', 'titular', 'Titular vigente documentado.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_authorships" ("id", "image_entity_id", "agent_entity_id", "authorship_type", "role_name", "date_from_text", "certainty", "notes", "status")
values ('c25b68b2-3961-444d-9517-afd0067840b2', '66284ce3-2a65-4d24-9ced-504ebcdfc6da', 'a5264497-9e32-49ab-9773-130fe8ae7a76', 'attributed_to', 'escultor', 'Hacia 1817', 'attributed', 'Atribución documentada, no autoría contractual.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "agent_entity_id" = excluded."agent_entity_id", "authorship_type" = excluded."authorship_type", "role_name" = excluded."role_name", "date_from_text" = excluded."date_from_text", "certainty" = excluded."certainty", "notes" = excluded."notes", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('99581052-e927-4b99-85cd-005448e80159', 'step', 'Paso del Santísimo Cristo de la Buena Muerte', 'paso-cristo-buena-muerte-estudiantes-sevilla', 'Paso procesional del Crucificado universitario.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."steps" ("entity_id", "step_type", "current_condition", "execution_date_text", "description")
values ('99581052-e927-4b99-85cd-005448e80159', 'Crucificado', 'preserved', null, 'Paso sobrio del Cristo de la Buena Muerte, que procesiona en silencio.') on conflict ("entity_id") do update set "step_type" = excluded."step_type", "current_condition" = excluded."current_condition", "execution_date_text" = excluded."execution_date_text", "description" = excluded."description";

insert into public."brotherhood_steps" ("id", "brotherhood_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('472f9bac-918c-4ffe-b84e-52805bf8dd28', '52c9fcc7-46fd-49e0-9395-f76653ac783e', '99581052-e927-4b99-85cd-005448e80159', 'current', 'Paso procesional vigente.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_steps" ("id", "image_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('bcd6933d-fa93-4775-bc9d-acd93ee460ea', 'a8d91d56-300d-4b5c-b1f4-a69ce0f73294', '99581052-e927-4b99-85cd-005448e80159', 'processional', 'Imagen principal del paso.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('133f9820-09bb-4d05-9f6d-893f7269527d', 'step', 'Paso de palio de María Santísima de la Angustia', 'paso-palio-angustia-estudiantes-sevilla', 'Proyecto unitario de Joaquín Castilla Romero iniciado en 1943.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."steps" ("entity_id", "step_type", "current_condition", "execution_date_text", "description")
values ('133f9820-09bb-4d05-9f6d-893f7269527d', 'Palio', 'preserved', 'Desde 1943', 'Proyecto de Joaquín Castilla Romero, con orfebrería de Emilio García Armenta y bordados del taller de Esperanza Elena Caro.') on conflict ("entity_id") do update set "step_type" = excluded."step_type", "current_condition" = excluded."current_condition", "execution_date_text" = excluded."execution_date_text", "description" = excluded."description";

insert into public."brotherhood_steps" ("id", "brotherhood_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('17db39cb-ba23-4428-b3d5-fffe5b32b292', '52c9fcc7-46fd-49e0-9395-f76653ac783e', '133f9820-09bb-4d05-9f6d-893f7269527d', 'current', 'Paso procesional vigente.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_steps" ("id", "image_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('58ae9678-406d-4a6f-b66b-589e640f2a0f', '66284ce3-2a65-4d24-9ced-504ebcdfc6da', '133f9820-09bb-4d05-9f6d-893f7269527d', 'processional', 'Imagen principal del paso.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."cults" ("id", "brotherhood_entity_id", "image_entity_id", "cult_type", "title", "date_rule", "month", "place_id", "description", "status", "is_recurring", "recurrence_label", "display_order")
values ('d0cf2646-e16c-45c2-ab13-7a0c9303c205', '52c9fcc7-46fd-49e0-9395-f76653ac783e', 'a8d91d56-300d-4b5c-b1f4-a69ce0f73294', 'Quinario', 'Quinario al Santísimo Cristo de la Buena Muerte', 'Cuaresma', null, '29095db8-07da-4ba1-bfb3-623a117c6633', 'Culto anual documentado por la corporación.', 'published', true, 'Anual', 1) on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "cult_type" = excluded."cult_type", "title" = excluded."title", "date_rule" = excluded."date_rule", "month" = excluded."month", "place_id" = excluded."place_id", "description" = excluded."description", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order";

insert into public."cult_entities" ("id", "cult_id", "entity_id", "role", "notes")
values ('11d5b877-d8d7-42ab-95d3-cbdfd07935f4', 'd0cf2646-e16c-45c2-ab13-7a0c9303c205', 'a8d91d56-300d-4b5c-b1f4-a69ce0f73294', 'honoree', 'Titular al que se dedica el culto.') on conflict ("id") do update set "cult_id" = excluded."cult_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "cult_id", "scope")
values ('4ea63c54-67e3-459d-9f74-d61b37b5c477', '421ae2de-6572-4259-85a7-678d544679d9', 'd0cf2646-e16c-45c2-ab13-7a0c9303c205', null) on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id", "scope" = excluded."scope";

insert into public."cults" ("id", "brotherhood_entity_id", "image_entity_id", "cult_type", "title", "date_rule", "month", "place_id", "description", "status", "is_recurring", "recurrence_label", "display_order")
values ('e6071b2c-1b45-4593-908f-23adaf1e9fc3', '52c9fcc7-46fd-49e0-9395-f76653ac783e', 'a8d91d56-300d-4b5c-b1f4-a69ce0f73294', 'Función Principal', 'Función Principal de Instituto', 'Cuaresma', null, '29095db8-07da-4ba1-bfb3-623a117c6633', 'Culto anual documentado por la corporación.', 'published', true, 'Anual', 2) on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "cult_type" = excluded."cult_type", "title" = excluded."title", "date_rule" = excluded."date_rule", "month" = excluded."month", "place_id" = excluded."place_id", "description" = excluded."description", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order";

insert into public."cult_entities" ("id", "cult_id", "entity_id", "role", "notes")
values ('240d429b-ed17-4013-a374-9c2099113aea', 'e6071b2c-1b45-4593-908f-23adaf1e9fc3', 'a8d91d56-300d-4b5c-b1f4-a69ce0f73294', 'honoree', 'Titular al que se dedica el culto.') on conflict ("id") do update set "cult_id" = excluded."cult_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "cult_id", "scope")
values ('c34b8560-aa1f-4dbf-aa69-b5d0b848a202', '421ae2de-6572-4259-85a7-678d544679d9', 'e6071b2c-1b45-4593-908f-23adaf1e9fc3', null) on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id", "scope" = excluded."scope";

insert into public."cults" ("id", "brotherhood_entity_id", "image_entity_id", "cult_type", "title", "date_rule", "month", "place_id", "description", "status", "is_recurring", "recurrence_label", "display_order")
values ('54dcb36c-f85c-4ab9-b955-7221506c3ac3', '52c9fcc7-46fd-49e0-9395-f76653ac783e', 'a8d91d56-300d-4b5c-b1f4-a69ce0f73294', 'Besapié', 'Besapié al Santísimo Cristo de la Buena Muerte', 'Cuaresma', null, '29095db8-07da-4ba1-bfb3-623a117c6633', 'Culto anual documentado por la corporación.', 'published', true, 'Anual', 3) on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "cult_type" = excluded."cult_type", "title" = excluded."title", "date_rule" = excluded."date_rule", "month" = excluded."month", "place_id" = excluded."place_id", "description" = excluded."description", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order";

insert into public."cult_entities" ("id", "cult_id", "entity_id", "role", "notes")
values ('2c4fadf1-481b-4878-b224-cc10b4108a40', '54dcb36c-f85c-4ab9-b955-7221506c3ac3', 'a8d91d56-300d-4b5c-b1f4-a69ce0f73294', 'honoree', 'Titular al que se dedica el culto.') on conflict ("id") do update set "cult_id" = excluded."cult_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "cult_id", "scope")
values ('60ac243e-d2e7-4a0c-b5b1-fc7b74f93b80', '421ae2de-6572-4259-85a7-678d544679d9', '54dcb36c-f85c-4ab9-b955-7221506c3ac3', null) on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id", "scope" = excluded."scope";

insert into public."cults" ("id", "brotherhood_entity_id", "image_entity_id", "cult_type", "title", "date_rule", "month", "place_id", "description", "status", "is_recurring", "recurrence_label", "display_order")
values ('ed3cdcd5-c5ef-4307-8f47-7f2a31a20bc4', '52c9fcc7-46fd-49e0-9395-f76653ac783e', '66284ce3-2a65-4d24-9ced-504ebcdfc6da', 'Triduo', 'Triduo a María Santísima de la Angustia', 'Otoño', null, '29095db8-07da-4ba1-bfb3-623a117c6633', 'Culto anual documentado por la corporación.', 'published', true, 'Anual', 4) on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "cult_type" = excluded."cult_type", "title" = excluded."title", "date_rule" = excluded."date_rule", "month" = excluded."month", "place_id" = excluded."place_id", "description" = excluded."description", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order";

insert into public."cult_entities" ("id", "cult_id", "entity_id", "role", "notes")
values ('06da26f9-37b1-41fc-9225-43f8012816a1', 'ed3cdcd5-c5ef-4307-8f47-7f2a31a20bc4', '66284ce3-2a65-4d24-9ced-504ebcdfc6da', 'honoree', 'Titular al que se dedica el culto.') on conflict ("id") do update set "cult_id" = excluded."cult_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "cult_id", "scope")
values ('16957dcb-1dc2-4fc0-a547-f8e35643df15', '421ae2de-6572-4259-85a7-678d544679d9', 'ed3cdcd5-c5ef-4307-8f47-7f2a31a20bc4', null) on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id", "scope" = excluded."scope";

insert into public."cults" ("id", "brotherhood_entity_id", "image_entity_id", "cult_type", "title", "date_rule", "month", "place_id", "description", "status", "is_recurring", "recurrence_label", "display_order")
values ('f851472d-b07b-4721-9f76-2e6a6f1cc9d0', '52c9fcc7-46fd-49e0-9395-f76653ac783e', '66284ce3-2a65-4d24-9ced-504ebcdfc6da', 'Besamanos', 'Besamanos a María Santísima de la Angustia', 'Otoño', null, '29095db8-07da-4ba1-bfb3-623a117c6633', 'Culto anual documentado por la corporación.', 'published', true, 'Anual', 5) on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "cult_type" = excluded."cult_type", "title" = excluded."title", "date_rule" = excluded."date_rule", "month" = excluded."month", "place_id" = excluded."place_id", "description" = excluded."description", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order";

insert into public."cult_entities" ("id", "cult_id", "entity_id", "role", "notes")
values ('5780866e-e18d-4d16-8bdb-32ffe5ef668a', 'f851472d-b07b-4721-9f76-2e6a6f1cc9d0', '66284ce3-2a65-4d24-9ced-504ebcdfc6da', 'honoree', 'Titular al que se dedica el culto.') on conflict ("id") do update set "cult_id" = excluded."cult_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "cult_id", "scope")
values ('c05a423a-c806-4f4c-ba66-8e7f076c9e7e', '421ae2de-6572-4259-85a7-678d544679d9', 'f851472d-b07b-4721-9f76-2e6a6f1cc9d0', null) on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id", "scope" = excluded."scope";

insert into public."outings" ("id", "brotherhood_entity_id", "outing_type", "character", "title", "outing_date", "year", "municipality_id", "origin_place_id", "destination_text", "description", "event_status", "status", "slug")
values ('452ed4d9-89f0-4632-b2a5-760ad38f2bdb', '52c9fcc7-46fd-49e0-9395-f76653ac783e', 'Estación de Penitencia', 'ordinary', 'Los Estudiantes · Estación de Penitencia 2026', '2026-03-31', 2026, 'ca85889c-21fe-4367-8477-a57656b25da4', '29095db8-07da-4ba1-bfb3-623a117c6633', 'Santa Iglesia Catedral de Sevilla', 'Estación de penitencia del Martes Santo de 2026.', 'held', 'published', 'estudiantes-estacion-penitencia-2026') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "outing_type" = excluded."outing_type", "character" = excluded."character", "title" = excluded."title", "outing_date" = excluded."outing_date", "year" = excluded."year", "municipality_id" = excluded."municipality_id", "origin_place_id" = excluded."origin_place_id", "destination_text" = excluded."destination_text", "description" = excluded."description", "event_status" = excluded."event_status", "status" = excluded."status", "slug" = excluded."slug";

insert into public."outing_entities" ("id", "outing_id", "entity_id", "role", "notes")
values ('4a3ec5d5-2e7b-4629-9e51-57bbca5970e8', '452ed4d9-89f0-4632-b2a5-760ad38f2bdb', 'a8d91d56-300d-4b5c-b1f4-a69ce0f73294', 'processional_image', 'Imagen participante en la estación de penitencia.') on conflict ("id") do update set "outing_id" = excluded."outing_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."outing_entities" ("id", "outing_id", "entity_id", "role", "notes")
values ('5db8fed3-1a91-4180-9013-e06885d91d2c', '452ed4d9-89f0-4632-b2a5-760ad38f2bdb', '66284ce3-2a65-4d24-9ced-504ebcdfc6da', 'secondary_image', 'Imagen participante en la estación de penitencia.') on conflict ("id") do update set "outing_id" = excluded."outing_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "outing_id", "scope")
values ('cab215d8-c7b6-44e2-979b-75cd90c27deb', 'b5f73fa6-1245-4ff1-8196-f85a789de112', '452ed4d9-89f0-4632-b2a5-760ad38f2bdb', null) on conflict ("id") do update set "source_id" = excluded."source_id", "outing_id" = excluded."outing_id", "scope" = excluded."scope";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('3002e735-4960-4e44-be55-bad662735eee', 'event', 'Fundación de la Hermandad de los Estudiantes', 'fundacion-estudiantes-sevilla-1924', 'Las Reglas fueron aprobadas el 17 de septiembre y el cabildo fundacional se celebró el 17 de noviembre de 1924.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."events" ("entity_id", "event_type", "event_date_text", "place_id", "description", "event_category", "brotherhood_entity_id", "municipality_id", "event_status")
values ('3002e735-4960-4e44-be55-bad662735eee', 'Hito histórico', '17 de noviembre de 1924', null, 'Las Reglas fueron aprobadas el 17 de septiembre y el cabildo fundacional se celebró el 17 de noviembre de 1924.', 'historical', '52c9fcc7-46fd-49e0-9395-f76653ac783e', 'ca85889c-21fe-4367-8477-a57656b25da4', 'held') on conflict ("entity_id") do update set "event_type" = excluded."event_type", "event_date_text" = excluded."event_date_text", "place_id" = excluded."place_id", "description" = excluded."description", "event_category" = excluded."event_category", "brotherhood_entity_id" = excluded."brotherhood_entity_id", "municipality_id" = excluded."municipality_id", "event_status" = excluded."event_status";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('596e9cd7-9035-41b9-b389-b496b60ed39c', '71de2d71-c572-4e1c-bcb2-ae2a9e004fbd', '3002e735-4960-4e44-be55-bad662735eee', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('d37ea0e1-f4c7-4d72-9043-c0a839b67dd4', 'event', 'Primera estación del Cristo de la Buena Muerte con Los Estudiantes', 'primera-estacion-cristo-buena-muerte-estudiantes-1926', 'El Crucificado realizó su primera estación con la Hermandad el Martes Santo de 1926.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."events" ("entity_id", "event_type", "event_date_text", "place_id", "description", "event_category", "brotherhood_entity_id", "municipality_id", "event_status")
values ('d37ea0e1-f4c7-4d72-9043-c0a839b67dd4', 'Hito histórico', 'Martes Santo de 1926', null, 'El Crucificado realizó su primera estación con la Hermandad el Martes Santo de 1926.', 'historical', '52c9fcc7-46fd-49e0-9395-f76653ac783e', 'ca85889c-21fe-4367-8477-a57656b25da4', 'held') on conflict ("entity_id") do update set "event_type" = excluded."event_type", "event_date_text" = excluded."event_date_text", "place_id" = excluded."place_id", "description" = excluded."description", "event_category" = excluded."event_category", "brotherhood_entity_id" = excluded."brotherhood_entity_id", "municipality_id" = excluded."municipality_id", "event_status" = excluded."event_status";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('8b749160-ff7b-49f7-8c29-99e23f7c9e22', '0f3f9b3d-f138-490d-8faf-c7ab36633718', 'd37ea0e1-f4c7-4d72-9043-c0a839b67dd4', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('ee3b5853-1efe-4a38-a28f-545cd3f37d7f', 'event', 'Traslado temporal de los titulares de Los Estudiantes al Sagrario', 'traslado-temporal-estudiantes-sagrario-2026', 'Los titulares fueron trasladados temporalmente a la Parroquia del Sagrario durante las obras de la Capilla Universitaria.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."events" ("entity_id", "event_type", "event_date_text", "place_id", "description", "event_category", "brotherhood_entity_id", "municipality_id", "event_status")
values ('ee3b5853-1efe-4a38-a28f-545cd3f37d7f', 'Hito histórico', '10 de septiembre de 2026', '9438391f-7e7a-463c-a2ee-388dd5390d2f', 'Los titulares fueron trasladados temporalmente a la Parroquia del Sagrario durante las obras de la Capilla Universitaria.', 'historical', '52c9fcc7-46fd-49e0-9395-f76653ac783e', 'ca85889c-21fe-4367-8477-a57656b25da4', 'held') on conflict ("entity_id") do update set "event_type" = excluded."event_type", "event_date_text" = excluded."event_date_text", "place_id" = excluded."place_id", "description" = excluded."description", "event_category" = excluded."event_category", "brotherhood_entity_id" = excluded."brotherhood_entity_id", "municipality_id" = excluded."municipality_id", "event_status" = excluded."event_status";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('e73b0abd-bf31-47f2-b668-2da8375c1d81', '421ae2de-6572-4259-85a7-678d544679d9', 'ee3b5853-1efe-4a38-a28f-545cd3f37d7f', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('a4da9c52-7a53-43e7-9436-eb59ae68bc00', 'heritage_asset', 'Proyecto de palio de María Santísima de la Angustia', 'proyecto-palio-angustia-estudiantes', 'Conjunto unitario diseñado por Joaquín Castilla Romero, iniciado en 1943.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."heritage_assets" ("entity_id", "parent_entity_id", "asset_type", "description", "current_condition", "is_current", "display_order", "is_featured")
values ('a4da9c52-7a53-43e7-9436-eb59ae68bc00', '52c9fcc7-46fd-49e0-9395-f76653ac783e', 'Paso procesional', 'Conjunto unitario diseñado por Joaquín Castilla Romero, iniciado en 1943.', 'Conservado', true, 1, true) on conflict ("entity_id") do update set "parent_entity_id" = excluded."parent_entity_id", "asset_type" = excluded."asset_type", "description" = excluded."description", "current_condition" = excluded."current_condition", "is_current" = excluded."is_current", "display_order" = excluded."display_order", "is_featured" = excluded."is_featured";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('9ee1c5b8-782d-4e6a-b23c-e5298a01c85e', 'heritage_asset', 'Cruz del Santísimo Cristo de la Buena Muerte', 'cruz-cristo-buena-muerte-estudiantes', 'Cruz procesional del Crucificado universitario.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."heritage_assets" ("entity_id", "parent_entity_id", "asset_type", "description", "current_condition", "is_current", "display_order", "is_featured")
values ('9ee1c5b8-782d-4e6a-b23c-e5298a01c85e', '52c9fcc7-46fd-49e0-9395-f76653ac783e', 'Atributo iconográfico', 'Cruz procesional del Crucificado universitario.', 'Conservado', true, 2, false) on conflict ("entity_id") do update set "parent_entity_id" = excluded."parent_entity_id", "asset_type" = excluded."asset_type", "description" = excluded."description", "current_condition" = excluded."current_condition", "is_current" = excluded."is_current", "display_order" = excluded."display_order", "is_featured" = excluded."is_featured";

insert into public."brotherhood_habits" ("id", "brotherhood_entity_id", "name", "tunic_description", "hood_description", "cord_description", "footwear_description", "sort_order", "notes", "status")
values ('25380316-61f0-458d-b776-9fcc3e7214f7', '52c9fcc7-46fd-49e0-9395-f76653ac783e', 'Hábito de Los Estudiantes', 'Túnica y antifaz negros de ruán, de cola, con cinturón de esparto.', 'Túnica y antifaz negros de ruán, de cola, con cinturón de esparto.', 'Cinturón de esparto.', 'Calzado negro.', 1, 'Hábito penitencial vigente.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "name" = excluded."name", "tunic_description" = excluded."tunic_description", "hood_description" = excluded."hood_description", "cord_description" = excluded."cord_description", "footwear_description" = excluded."footwear_description", "sort_order" = excluded."sort_order", "notes" = excluded."notes", "status" = excluded."status";

insert into public."music_accompaniment_periods" ("id", "brotherhood_entity_id", "band_entity_id", "step_entity_id", "position", "outing_type", "date_from_text", "year_from", "is_current", "notes", "public_brotherhood_name", "public_step_name", "public_brotherhood_slug", "public_municipality_name", "public_municipality_slug", "public_province", "status")
values ('81747d98-2a4c-45a5-b6e8-c1d4f7f7f534', '52c9fcc7-46fd-49e0-9395-f76653ac783e', '8e754023-a46a-4587-8952-4696c70d0bd0', '133f9820-09bb-4d05-9f6d-893f7269527d', 'Tras el paso de palio', 'Martes Santo', 'Vigente · 2026', null, true, 'Acompañamiento vigente en 2026; el paso del Cristo procesiona en silencio.', 'Hermandad de los Estudiantes', 'Paso de palio', 'hermandad-de-los-estudiantes-sevilla', 'Sevilla', 'sevilla', 'Sevilla', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "band_entity_id" = excluded."band_entity_id", "step_entity_id" = excluded."step_entity_id", "position" = excluded."position", "outing_type" = excluded."outing_type", "date_from_text" = excluded."date_from_text", "year_from" = excluded."year_from", "is_current" = excluded."is_current", "notes" = excluded."notes", "public_brotherhood_name" = excluded."public_brotherhood_name", "public_step_name" = excluded."public_step_name", "public_brotherhood_slug" = excluded."public_brotherhood_slug", "public_municipality_name" = excluded."public_municipality_name", "public_municipality_slug" = excluded."public_municipality_slug", "public_province" = excluded."public_province", "status" = excluded."status";

insert into public."source_links" ("id", "source_id", "music_accompaniment_period_id", "scope")
values ('41d9a11d-3c17-4a4f-8cdf-80fa9ebf6068', '79903b6b-1e1d-4497-ad45-5dff54bb96ac', '81747d98-2a4c-45a5-b6e8-c1d4f7f7f534', null) on conflict ("id") do update set "source_id" = excluded."source_id", "music_accompaniment_period_id" = excluded."music_accompaniment_period_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('76bbd28e-e593-4212-86c6-331a129994ce', '421ae2de-6572-4259-85a7-678d544679d9', '52c9fcc7-46fd-49e0-9395-f76653ac783e', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('1ac1968d-6108-430e-b0d7-fec674e0c578', '71de2d71-c572-4e1c-bcb2-ae2a9e004fbd', '52c9fcc7-46fd-49e0-9395-f76653ac783e', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('93cf9c6f-0a95-4e54-9cae-268cde216bbf', '0f3f9b3d-f138-490d-8faf-c7ab36633718', '52c9fcc7-46fd-49e0-9395-f76653ac783e', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('d31b0e66-ae02-4fb9-a43a-be57083fb6a7', '0f0001e4-7451-43e3-a2c0-578bfc0405f9', '52c9fcc7-46fd-49e0-9395-f76653ac783e', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('231a89de-ca78-456d-b840-9e22c1666d2e', 'dabb08af-443f-4f36-b4e3-21a8715adc79', '52c9fcc7-46fd-49e0-9395-f76653ac783e', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('45be09e7-c2d4-4bcd-a400-c4aa8cd992b6', '9ffbb00b-f37e-447b-9870-8c0d6dcb9b9a', '52c9fcc7-46fd-49e0-9395-f76653ac783e', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('85b7669e-bbf8-4d10-b9d8-386b9038bc24', '79903b6b-1e1d-4497-ad45-5dff54bb96ac', '52c9fcc7-46fd-49e0-9395-f76653ac783e', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('624fb501-8254-49ba-bb4c-579c18be84bb', 'b5f73fa6-1245-4ff1-8196-f85a789de112', '52c9fcc7-46fd-49e0-9395-f76653ac783e', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('22c2bb19-a6d4-4887-bedf-0e4653b77ec9', '0f3f9b3d-f138-490d-8faf-c7ab36633718', 'a8d91d56-300d-4b5c-b1f4-a69ce0f73294', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('80d9640d-28c9-4de2-a066-d37b13a06d16', '0f0001e4-7451-43e3-a2c0-578bfc0405f9', '66284ce3-2a65-4d24-9ced-504ebcdfc6da', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('1482fa04-9114-4bdd-93f0-f9a0a5cc38a5', '9ffbb00b-f37e-447b-9870-8c0d6dcb9b9a', 'a4da9c52-7a53-43e7-9436-eb59ae68bc00', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('e2f06a9d-ff52-405e-b4ea-28d4279eea2c', 'dabb08af-443f-4f36-b4e3-21a8715adc79', '9ee1c5b8-782d-4e6a-b23c-e5298a01c85e', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

commit;
