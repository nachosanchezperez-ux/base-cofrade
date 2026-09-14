-- HC-016 · macrolote transversal: Sábado Santo de Sevilla
-- El Sol, Santo Entierro y Soledad de San Lorenzo; Trinidad y Servitas se preservan.
-- Solo DML. Receta idempotente archivada fuera de la cadena estructural activa.
-- Lote aplicado: 7fe7b65d-4f00-4d40-906f-82df8ee7c0a2 · completed · 206/206 · 199 insert · 7 update · 0 fallos.

begin;

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('c275a4ec-446b-4d05-b179-97282112ec99', 'Nómina de las cofradías de la Semana Santa de Sevilla 2026', 'https://www.hermandades-de-sevilla.org/consejo/nomina-de-las-cofradias-de-la-semana-santa-de-sevilla-2026/', 'web', 'Consejo General de Hermandades y Cofradías de Sevilla', '2026-09-14', 'Jornadas y nómina oficial de 2026.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('4029a705-5729-4819-bc4e-4bdb180e9793', 'Web oficial · Hermandad del Sol', 'https://hermandaddelsol.org/', 'web', 'Hermandad del Sol', '2026-09-14', 'Identidad corporativa, actividad y canales oficiales.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('3befe981-4200-4eeb-849f-7ac41fe7d6c3', 'El Sol · ficha del Consejo de Hermandades', 'https://www.hermandades-de-sevilla.org/semanasanta/ss_elsol.html', 'web', 'Consejo General de Hermandades y Cofradías de Sevilla', '2026-09-14', 'Historia, sede, titulares, cortejo y música de 2026.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('c65db041-08c0-42f4-a472-5d804ea69833', 'Sagrados Titulares · Hermandad del Sol', 'https://hermandaddelsol.org/la-hermandad/sagrados-titulares/', 'web', 'Hermandad del Sol', '2026-09-14', 'Titulares, cultos y estación de penitencia.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('be18d7a8-e9d2-4806-9664-42bb57d2851b', 'Cultos y Actos · Hermandad del Sol', 'https://hermandaddelsol.org/cultos-y-actos/', 'web', 'Hermandad del Sol', '2026-09-14', 'Programa cultual estable de la corporación.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('58d0c1a8-9f15-4b9e-bea2-2e7bffd49ebf', 'Nuestra Música · Hermandad del Sol', 'https://hermandaddelsol.org/grupos/nuestra-musica/', 'web', 'Hermandad del Sol', '2026-09-14', 'Vinculación de la Banda de Cornetas y Tambores Nuestra Señora del Sol.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('03c12810-14a4-47c6-a8b7-9fda270ec649', 'Web oficial · Santo Entierro de Sevilla', 'https://www.santoentierro.org/', 'web', 'Hermandad del Santo Entierro de Sevilla', '2026-09-14', 'Identidad vigente, cultos de 2026, canales y documentación del Cristo Yacente.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('e61aa1fb-8983-424a-8d6d-4392c805e755', 'El Santo Entierro · ficha del Consejo de Hermandades', 'https://www.hermandades-de-sevilla.org/semanasanta/ss_santoentierro.html', 'web', 'Consejo General de Hermandades y Cofradías de Sevilla', '2026-09-14', 'Cortejo, pasos y patrimonio procesional.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('7ce6e12d-5e87-4532-b6cb-29c31d3511e5', 'El Santo Entierro · acompañamiento musical 2026', 'https://www.planomato.com/es/sevilla/p/procesion-santo-entierro-sevilla-2026', 'web', 'Planomato', '2026-09-14', 'Configuración musical publicada para el Sábado Santo de 2026.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('77bd7d21-e0ef-458b-b716-1c00ce211771', 'Web oficial · Soledad de San Lorenzo', 'https://www.hermandaddelasoledad.org/', 'web', 'Hermandad Sacramental de la Soledad', '2026-09-14', 'Denominación oficial y actividad vigente.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('a5cf9097-1482-44a3-8996-00b4b41a3a97', 'María Santísima en su Soledad', 'https://www.hermandaddelasoledad.org/hermandad/titulares/maria-santisima-en-su-soledad/', 'web', 'Hermandad Sacramental de la Soledad', '2026-09-14', 'Descripción, cronología e iconografía de la titular.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('0dc714e2-eef4-47c7-8500-2f9b698e84c4', 'Paso procesional · Soledad de San Lorenzo', 'https://www.hermandaddelasoledad.org/hermandad/patrimonio/cultual/paso-procesional/', 'web', 'Hermandad Sacramental de la Soledad', '2026-09-14', 'Autoría, cronología y programa del paso.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('f799a2e8-8f4b-4332-af9b-95bc1d2290cc', 'Función Principal · Soledad de San Lorenzo', 'https://www.hermandaddelasoledad.org/cultos/funcion-principal/', 'web', 'Hermandad Sacramental de la Soledad', '2026-09-14', 'Función Principal de Instituto anual.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('8391cba2-3071-4177-9f73-9f1e0ca53e1b', 'Estación de Penitencia · Soledad de San Lorenzo', 'https://www.hermandaddelasoledad.org/cultos/estacion-de-penitencia/', 'web', 'Hermandad Sacramental de la Soledad', '2026-09-14', 'Estación del Sábado Santo, cortejo y hábito.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."places" ("id", "municipality_id", "name", "slug", "place_type", "address", "notes")
values ('65e37807-1737-4773-ae58-86972ba6d145', 'ca85889c-21fe-4367-8477-a57656b25da4', 'Capilla Sacramental de Nuestra Señora del Sol', 'capilla-sacramental-nuestra-senora-sol-sevilla', 'Capilla', 'Plaza del Aljarafe, Sevilla', 'Anexa a la Parroquia de San Diego de Alcalá; sede canónica de la Hermandad del Sol.') on conflict ("id") do update set "municipality_id" = excluded."municipality_id", "name" = excluded."name", "slug" = excluded."slug", "place_type" = excluded."place_type", "address" = excluded."address", "notes" = excluded."notes";

insert into public."places" ("id", "municipality_id", "name", "slug", "place_type", "address", "notes")
values ('12f55ed3-b354-47fb-9a22-6db5c8066078', 'ca85889c-21fe-4367-8477-a57656b25da4', 'Iglesia de San Gregorio', 'iglesia-san-gregorio-sevilla', 'Iglesia', 'Calle Alfonso XII, 14, Sevilla', 'Sede canónica de la Hermandad del Santo Entierro.') on conflict ("id") do update set "municipality_id" = excluded."municipality_id", "name" = excluded."name", "slug" = excluded."slug", "place_type" = excluded."place_type", "address" = excluded."address", "notes" = excluded."notes";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('30a3f84f-d1b9-409e-b97a-6d3f95421173', 'agent', 'Antonio Cardoso de Quirós', 'antonio-cardoso-de-quiros', 'Escultor documentado en la imaginería del Santo Entierro de Sevilla.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."agents" ("entity_id", "agent_kind", "description")
values ('30a3f84f-d1b9-409e-b97a-6d3f95421173', 'person', 'Autor documentado de la Virgen de Villaviciosa y del conjunto alegórico del Triunfo de la Santa Cruz.') on conflict ("entity_id") do update set "agent_kind" = excluded."agent_kind", "description" = excluded."description";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('417a2bc3-0396-435f-af3f-44e2cb711c86', 'brotherhood', 'Hermandad del Sol', 'hermandad-del-sol', 'Hermandad sacramental y de penitencia del Plantinar que realiza estación a la Catedral el Sábado Santo.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."brotherhoods" ("entity_id", "official_name", "popular_name", "foundation_text", "municipality_id", "canonical_see_place_id", "neighborhood", "website_url", "brotherhood_types", "current_procession_day", "history_text", "notes")
values ('417a2bc3-0396-435f-af3f-44e2cb711c86', 'Fervorosa, Mariana y Franciscana Hermandad Sacramental de la Inmaculada Concepción de María Santísima de la Salud y Cofradía de Nazarenos del Triunfo de la Santa Cruz, Santo Cristo Varón de Dolores de la Divina Misericordia, Nuestra Señora del Sol, San Juan Evangelista y Santa María Magdalena', 'El Sol', 'Origen documentado en 1932; Hermandad de Penitencia desde 2006', 'ca85889c-21fe-4367-8477-a57656b25da4', '65e37807-1737-4773-ae58-86972ba6d145', 'El Plantinar', 'https://hermandaddelsol.org/', ARRAY['Penitencia', 'Sacramental', 'Gloria']::text[], 'Sábado Santo', 'La corporación tiene su primera noticia documentada en 1932. Tras su etapa en Los Remedios se trasladó al Plantinar en 1989, fue erigida Hermandad de Gloria en 1995 y Hermandad de Penitencia en 2006. Hizo su primera estación penitencial en 2007 y se incorporó a la nómina del Sábado Santo.', 'Sin escudo ni fotografías públicas mientras no conste licencia reutilizable.') on conflict ("entity_id") do update set "official_name" = excluded."official_name", "popular_name" = excluded."popular_name", "foundation_text" = excluded."foundation_text", "municipality_id" = excluded."municipality_id", "canonical_see_place_id" = excluded."canonical_see_place_id", "neighborhood" = excluded."neighborhood", "website_url" = excluded."website_url", "brotherhood_types" = excluded."brotherhood_types", "current_procession_day" = excluded."current_procession_day", "history_text" = excluded."history_text", "notes" = excluded."notes";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('df534570-c3aa-4850-93c0-577c430d6d28', 'image', 'Santo Cristo Varón de Dolores de la Divina Misericordia', 'santo-cristo-varon-dolores-divina-misericordia-sol', 'Imagen de José Manuel Bonilla Cornejo concluida y bendecida en 2003.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."images" ("entity_id", "image_type", "execution_date_text", "current_condition", "description", "is_dress_image")
values ('df534570-c3aa-4850-93c0-577c430d6d28', 'Varón de Dolores', '2003', 'extant', 'Cristo vivo coronado de espinas que abraza la cruz con la mano izquierda y lleva la derecha al corazón.', false) on conflict ("entity_id") do update set "image_type" = excluded."image_type", "execution_date_text" = excluded."execution_date_text", "current_condition" = excluded."current_condition", "description" = excluded."description", "is_dress_image" = excluded."is_dress_image";

insert into public."brotherhood_images" ("id", "brotherhood_entity_id", "image_entity_id", "relation_type", "notes", "status")
values ('b7539844-1529-40e8-92b4-595c8f7d944b', '417a2bc3-0396-435f-af3f-44e2cb711c86', 'df534570-c3aa-4850-93c0-577c430d6d28', 'titular', 'Titular vigente documentado.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_authorships" ("id", "image_entity_id", "agent_entity_id", "authorship_type", "role_name", "date_from_text", "certainty", "notes", "status")
values ('3d608d47-6523-475d-89ba-4fad4b47f1aa', 'df534570-c3aa-4850-93c0-577c430d6d28', 'ad08ca9c-b9aa-4a2d-83f2-c2d880fe51b2', 'author', 'escultor', '2003', 'documented', null, 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "agent_entity_id" = excluded."agent_entity_id", "authorship_type" = excluded."authorship_type", "role_name" = excluded."role_name", "date_from_text" = excluded."date_from_text", "certainty" = excluded."certainty", "notes" = excluded."notes", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('7dcf7dd3-763a-4a35-80f7-f332afd261b7', 'image', 'Nuestra Señora del Sol', 'nuestra-senora-sol-sevilla', 'Dolorosa titular de la Hermandad del Sol, obra de José Manuel Bonilla Cornejo.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."images" ("entity_id", "image_type", "execution_date_text", "current_condition", "description", "is_dress_image")
values ('7dcf7dd3-763a-4a35-80f7-f332afd261b7', 'Dolorosa de vestir', 'Siglo XX', 'extant', 'Dolorosa de vestir concebida por José Manuel Bonilla Cornejo dentro del lenguaje iconográfico propio de la corporación.', true) on conflict ("entity_id") do update set "image_type" = excluded."image_type", "execution_date_text" = excluded."execution_date_text", "current_condition" = excluded."current_condition", "description" = excluded."description", "is_dress_image" = excluded."is_dress_image";

insert into public."brotherhood_images" ("id", "brotherhood_entity_id", "image_entity_id", "relation_type", "notes", "status")
values ('f23fa22b-1108-40ed-8791-0eecbd9601a8', '417a2bc3-0396-435f-af3f-44e2cb711c86', '7dcf7dd3-763a-4a35-80f7-f332afd261b7', 'titular', 'Titular vigente documentado.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_authorships" ("id", "image_entity_id", "agent_entity_id", "authorship_type", "role_name", "date_from_text", "certainty", "notes", "status")
values ('882c150b-972a-4d65-a36a-bfb68b7caccf', '7dcf7dd3-763a-4a35-80f7-f332afd261b7', 'ad08ca9c-b9aa-4a2d-83f2-c2d880fe51b2', 'author', 'escultor', 'Siglo XX', 'documented', null, 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "agent_entity_id" = excluded."agent_entity_id", "authorship_type" = excluded."authorship_type", "role_name" = excluded."role_name", "date_from_text" = excluded."date_from_text", "certainty" = excluded."certainty", "notes" = excluded."notes", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('a7920c82-744c-478d-931d-77768cd2cffc', 'image', 'San Juan Evangelista de la Hermandad del Sol', 'san-juan-evangelista-sol-sevilla', 'Imagen de José Manuel Bonilla Cornejo finalizada y bendecida en 2008.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."images" ("entity_id", "image_type", "execution_date_text", "current_condition", "description", "is_dress_image")
values ('a7920c82-744c-478d-931d-77768cd2cffc', 'Imagen secundaria', '2008', 'extant', 'Imagen de cuerpo entero tallada en madera de cedro para la Sacra Conversación.', false) on conflict ("entity_id") do update set "image_type" = excluded."image_type", "execution_date_text" = excluded."execution_date_text", "current_condition" = excluded."current_condition", "description" = excluded."description", "is_dress_image" = excluded."is_dress_image";

insert into public."brotherhood_images" ("id", "brotherhood_entity_id", "image_entity_id", "relation_type", "notes", "status")
values ('222036b1-a303-4a8e-995b-84b0f6f9b081', '417a2bc3-0396-435f-af3f-44e2cb711c86', 'a7920c82-744c-478d-931d-77768cd2cffc', 'titular', 'Titular vigente documentado.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_authorships" ("id", "image_entity_id", "agent_entity_id", "authorship_type", "role_name", "date_from_text", "certainty", "notes", "status")
values ('89c5b3e5-6958-4650-ad08-2dd6e135f7a0', 'a7920c82-744c-478d-931d-77768cd2cffc', 'ad08ca9c-b9aa-4a2d-83f2-c2d880fe51b2', 'author', 'escultor', '2008', 'documented', null, 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "agent_entity_id" = excluded."agent_entity_id", "authorship_type" = excluded."authorship_type", "role_name" = excluded."role_name", "date_from_text" = excluded."date_from_text", "certainty" = excluded."certainty", "notes" = excluded."notes", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('79f22de0-666a-45fe-85ab-1fc0751c8662', 'image', 'Santa María Magdalena de la Hermandad del Sol', 'santa-maria-magdalena-sol-sevilla', 'Imagen de José Manuel Bonilla Cornejo finalizada y bendecida en 2009.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."images" ("entity_id", "image_type", "execution_date_text", "current_condition", "description", "is_dress_image")
values ('79f22de0-666a-45fe-85ab-1fc0751c8662', 'Imagen secundaria de vestir', '2009', 'extant', 'Imagen de candelero integrada en la Sacra Conversación bajo palio.', true) on conflict ("entity_id") do update set "image_type" = excluded."image_type", "execution_date_text" = excluded."execution_date_text", "current_condition" = excluded."current_condition", "description" = excluded."description", "is_dress_image" = excluded."is_dress_image";

insert into public."brotherhood_images" ("id", "brotherhood_entity_id", "image_entity_id", "relation_type", "notes", "status")
values ('3ef0259f-75e2-46e6-8d40-1923874e77ef', '417a2bc3-0396-435f-af3f-44e2cb711c86', '79f22de0-666a-45fe-85ab-1fc0751c8662', 'titular', 'Titular vigente documentado.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_authorships" ("id", "image_entity_id", "agent_entity_id", "authorship_type", "role_name", "date_from_text", "certainty", "notes", "status")
values ('22226350-9e1c-4d5c-aeb4-0cefed400ec2', '79f22de0-666a-45fe-85ab-1fc0751c8662', 'ad08ca9c-b9aa-4a2d-83f2-c2d880fe51b2', 'author', 'escultor', '2009', 'documented', null, 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "agent_entity_id" = excluded."agent_entity_id", "authorship_type" = excluded."authorship_type", "role_name" = excluded."role_name", "date_from_text" = excluded."date_from_text", "certainty" = excluded."certainty", "notes" = excluded."notes", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('6dcd8910-0267-4bd1-80fa-55d385e80717', 'step', 'Paso del Santo Cristo Varón de Dolores', 'paso-santisimo-cristo-varon-de-dolores', 'Paso del Santo Cristo Varón de Dolores de la Divina Misericordia.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."steps" ("entity_id", "step_type", "current_condition", "description", "current_state_notes")
values ('6dcd8910-0267-4bd1-80fa-55d385e80717', 'Paso de Cristo', 'preserved', 'Paso procesional del Santo Cristo Varón de Dolores, en proceso documentado de remodelación durante 2025 y 2026.', 'La ficha no atribuye el conjunto completo sin una fuente técnica unívoca.') on conflict ("entity_id") do update set "step_type" = excluded."step_type", "current_condition" = excluded."current_condition", "description" = excluded."description", "current_state_notes" = excluded."current_state_notes";

insert into public."brotherhood_steps" ("id", "brotherhood_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('9f68cf29-d786-492f-9675-f71a1fdfe610', '417a2bc3-0396-435f-af3f-44e2cb711c86', '6dcd8910-0267-4bd1-80fa-55d385e80717', 'current', 'Paso procesional vigente.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_steps" ("id", "image_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('2283595d-8238-49b0-be42-584eade36408', 'df534570-c3aa-4850-93c0-577c430d6d28', '6dcd8910-0267-4bd1-80fa-55d385e80717', 'processional', 'Imagen principal del paso.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('76dba4ef-5d3e-47c7-b7de-d804e7d47717', 'step', 'Paso de la Sacra Conversación de Nuestra Señora del Sol', 'paso-sacra-conversacion-nuestra-senora-sol', 'Paso de palio de Nuestra Señora del Sol con San Juan Evangelista y Santa María Magdalena.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."steps" ("entity_id", "step_type", "current_condition", "execution_date_text", "materials", "style", "description")
values ('76dba4ef-5d3e-47c7-b7de-d804e7d47717', 'Palio', 'preserved', 'Configuración estrenada en 2009', null, null, 'Paso de palio que recupera la iconografía de la Sacra Conversación.') on conflict ("entity_id") do update set "step_type" = excluded."step_type", "current_condition" = excluded."current_condition", "execution_date_text" = excluded."execution_date_text", "materials" = excluded."materials", "style" = excluded."style", "description" = excluded."description";

insert into public."brotherhood_steps" ("id", "brotherhood_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('a87a82b9-5863-4e21-a0b5-9460f4f3c590', '417a2bc3-0396-435f-af3f-44e2cb711c86', '76dba4ef-5d3e-47c7-b7de-d804e7d47717', 'current', 'Paso procesional vigente.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_steps" ("id", "image_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('0687a6c2-f2b3-4f15-8a3c-b118d0f736f7', '7dcf7dd3-763a-4a35-80f7-f332afd261b7', '76dba4ef-5d3e-47c7-b7de-d804e7d47717', 'processional', 'Imagen principal del paso.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_steps" ("id", "image_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('125fdc86-ece2-47c4-9cee-0385038eccf9', 'a7920c82-744c-478d-931d-77768cd2cffc', '76dba4ef-5d3e-47c7-b7de-d804e7d47717', 'secondary', 'Imagen integrada en el conjunto procesional.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_steps" ("id", "image_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('0e6e1fd5-bef5-4331-bb8b-6f53bd9d5b05', '79f22de0-666a-45fe-85ab-1fc0751c8662', '76dba4ef-5d3e-47c7-b7de-d804e7d47717', 'secondary', 'Imagen integrada en el conjunto procesional.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."cults" ("id", "brotherhood_entity_id", "image_entity_id", "place_id", "status", "is_recurring", "cult_type", "title", "month", "date_rule", "recurrence_label", "display_order", "description")
values ('7e4171bc-591b-43ef-bbba-dd5dc0c00ac4', '417a2bc3-0396-435f-af3f-44e2cb711c86', 'df534570-c3aa-4850-93c0-577c430d6d28', '65e37807-1737-4773-ae58-86972ba6d145', 'published', true, 'Quinario', 'Solemne Quinario al Santo Cristo Varón de Dolores', null, 'Primera semana de Cuaresma, de martes a sábado', 'Anual', 1, 'Quinario cuaresmal anual al titular cristífero.') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "place_id" = excluded."place_id", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "cult_type" = excluded."cult_type", "title" = excluded."title", "month" = excluded."month", "date_rule" = excluded."date_rule", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order", "description" = excluded."description";

insert into public."cult_entities" ("id", "cult_id", "entity_id", "role", "notes")
values ('08e8ae67-f150-43ea-8e1d-7351eed49081', '7e4171bc-591b-43ef-bbba-dd5dc0c00ac4', 'df534570-c3aa-4850-93c0-577c430d6d28', 'honoree', 'Titular al que se dedica el culto.') on conflict ("id") do update set "cult_id" = excluded."cult_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "cult_id")
values ('f1695916-4876-47dd-b038-c43a2a894485', 'c65db041-08c0-42f4-a472-5d804ea69833', '7e4171bc-591b-43ef-bbba-dd5dc0c00ac4') on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id";

insert into public."cults" ("id", "brotherhood_entity_id", "image_entity_id", "place_id", "status", "is_recurring", "cult_type", "title", "month", "date_rule", "recurrence_label", "display_order", "description")
values ('bf2179b4-0fcc-45b9-8de8-099f0f04e791', '417a2bc3-0396-435f-af3f-44e2cb711c86', 'df534570-c3aa-4850-93c0-577c430d6d28', '65e37807-1737-4773-ae58-86972ba6d145', 'published', true, 'Función Principal', 'Función Principal de Instituto', null, 'Segundo Domingo de Cuaresma', 'Anual', 2, 'Función Principal de Instituto posterior al Quinario.') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "place_id" = excluded."place_id", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "cult_type" = excluded."cult_type", "title" = excluded."title", "month" = excluded."month", "date_rule" = excluded."date_rule", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order", "description" = excluded."description";

insert into public."cult_entities" ("id", "cult_id", "entity_id", "role", "notes")
values ('3c96c6c1-4e34-4b73-b4f1-cfaf9af4a51e', 'bf2179b4-0fcc-45b9-8de8-099f0f04e791', 'df534570-c3aa-4850-93c0-577c430d6d28', 'honoree', 'Titular al que se dedica el culto.') on conflict ("id") do update set "cult_id" = excluded."cult_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "cult_id")
values ('f7ca037d-25d0-4926-a98b-649752d918ed', 'c65db041-08c0-42f4-a472-5d804ea69833', 'bf2179b4-0fcc-45b9-8de8-099f0f04e791') on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id";

insert into public."cults" ("id", "brotherhood_entity_id", "image_entity_id", "place_id", "status", "is_recurring", "cult_type", "title", "month", "date_rule", "recurrence_label", "display_order", "description")
values ('2f6df7ad-08fb-43db-b76d-c2166dbe6885', '417a2bc3-0396-435f-af3f-44e2cb711c86', 'df534570-c3aa-4850-93c0-577c430d6d28', '65e37807-1737-4773-ae58-86972ba6d145', 'published', true, 'Besapié', 'Devoto Besapié al Santo Cristo Varón de Dolores', null, 'Fin de semana posterior al Quinario', 'Anual', 3, 'Veneración anual al titular cristífero.') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "place_id" = excluded."place_id", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "cult_type" = excluded."cult_type", "title" = excluded."title", "month" = excluded."month", "date_rule" = excluded."date_rule", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order", "description" = excluded."description";

insert into public."cult_entities" ("id", "cult_id", "entity_id", "role", "notes")
values ('3b405743-8bbb-444a-8710-76e57a204531', '2f6df7ad-08fb-43db-b76d-c2166dbe6885', 'df534570-c3aa-4850-93c0-577c430d6d28', 'honoree', 'Titular al que se dedica el culto.') on conflict ("id") do update set "cult_id" = excluded."cult_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "cult_id")
values ('afcfc364-f408-4d07-8b34-9131eef5a3be', 'c65db041-08c0-42f4-a472-5d804ea69833', '2f6df7ad-08fb-43db-b76d-c2166dbe6885') on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id";

insert into public."cults" ("id", "brotherhood_entity_id", "image_entity_id", "place_id", "status", "is_recurring", "cult_type", "title", "month", "date_rule", "recurrence_label", "display_order", "description")
values ('d2d1c865-f835-4900-bc6d-e82477f3a7e8', '417a2bc3-0396-435f-af3f-44e2cb711c86', '7dcf7dd3-763a-4a35-80f7-f332afd261b7', '65e37807-1737-4773-ae58-86972ba6d145', 'published', true, 'Triduo', 'Solemne Triduo a Nuestra Señora del Sol', null, 'Jueves, viernes y sábado previos al primer Domingo de Adviento', 'Anual', 4, 'Triduo anual a la titular mariana.') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "place_id" = excluded."place_id", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "cult_type" = excluded."cult_type", "title" = excluded."title", "month" = excluded."month", "date_rule" = excluded."date_rule", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order", "description" = excluded."description";

insert into public."cult_entities" ("id", "cult_id", "entity_id", "role", "notes")
values ('e36b968e-a273-42c5-b1fc-1fb79401281b', 'd2d1c865-f835-4900-bc6d-e82477f3a7e8', '7dcf7dd3-763a-4a35-80f7-f332afd261b7', 'honoree', 'Titular al que se dedica el culto.') on conflict ("id") do update set "cult_id" = excluded."cult_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "cult_id")
values ('34ff5d89-4a9f-4ac1-a9cc-574721c56bf8', 'c65db041-08c0-42f4-a472-5d804ea69833', 'd2d1c865-f835-4900-bc6d-e82477f3a7e8') on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id";

insert into public."cults" ("id", "brotherhood_entity_id", "image_entity_id", "place_id", "status", "is_recurring", "cult_type", "title", "month", "date_rule", "recurrence_label", "display_order", "description")
values ('3d19b3a7-c505-4617-9c46-8c837d461952', '417a2bc3-0396-435f-af3f-44e2cb711c86', '7dcf7dd3-763a-4a35-80f7-f332afd261b7', '65e37807-1737-4773-ae58-86972ba6d145', 'published', true, 'Función Solemne', 'Función Solemne a Nuestra Señora del Sol', null, 'Primer Domingo de Adviento', 'Anual', 5, 'Función anual a la titular mariana.') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "place_id" = excluded."place_id", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "cult_type" = excluded."cult_type", "title" = excluded."title", "month" = excluded."month", "date_rule" = excluded."date_rule", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order", "description" = excluded."description";

insert into public."cult_entities" ("id", "cult_id", "entity_id", "role", "notes")
values ('19620b84-3ba3-46c0-8d59-94a0968f2cb7', '3d19b3a7-c505-4617-9c46-8c837d461952', '7dcf7dd3-763a-4a35-80f7-f332afd261b7', 'honoree', 'Titular al que se dedica el culto.') on conflict ("id") do update set "cult_id" = excluded."cult_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "cult_id")
values ('3717b7de-08e8-40a5-bc7a-dd1373c8e4a9', 'c65db041-08c0-42f4-a472-5d804ea69833', '3d19b3a7-c505-4617-9c46-8c837d461952') on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id";

insert into public."outings" ("id", "brotherhood_entity_id", "outing_type", "character", "title", "outing_date", "year", "municipality_id", "origin_place_id", "destination_text", "description", "event_status", "status", "slug")
values ('fd1dfe51-9280-486d-b601-21776eda2814', '417a2bc3-0396-435f-af3f-44e2cb711c86', 'Estación de Penitencia', 'ordinary', 'El Sol · Estación de Penitencia 2026', '2026-04-04', 2026, 'ca85889c-21fe-4367-8477-a57656b25da4', '65e37807-1737-4773-ae58-86972ba6d145', 'Santa Iglesia Catedral de Sevilla', 'Estación de penitencia del Sábado Santo de 2026.', 'held', 'published', 'sol-estacion-penitencia-2026') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "outing_type" = excluded."outing_type", "character" = excluded."character", "title" = excluded."title", "outing_date" = excluded."outing_date", "year" = excluded."year", "municipality_id" = excluded."municipality_id", "origin_place_id" = excluded."origin_place_id", "destination_text" = excluded."destination_text", "description" = excluded."description", "event_status" = excluded."event_status", "status" = excluded."status", "slug" = excluded."slug";

insert into public."outing_entities" ("id", "outing_id", "entity_id", "role", "notes")
values ('2f421bb4-d438-40c6-a7cf-7b98a30d48be', 'fd1dfe51-9280-486d-b601-21776eda2814', 'df534570-c3aa-4850-93c0-577c430d6d28', 'processional_image', 'Imagen participante en la estación de penitencia.') on conflict ("id") do update set "outing_id" = excluded."outing_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."outing_entities" ("id", "outing_id", "entity_id", "role", "notes")
values ('8a42736d-ede6-48e5-9490-9c91f27801f9', 'fd1dfe51-9280-486d-b601-21776eda2814', '7dcf7dd3-763a-4a35-80f7-f332afd261b7', 'processional_image', 'Imagen participante en la estación de penitencia.') on conflict ("id") do update set "outing_id" = excluded."outing_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."outing_entities" ("id", "outing_id", "entity_id", "role", "notes")
values ('b830c567-b5bf-4be8-a045-41116fa01768', 'fd1dfe51-9280-486d-b601-21776eda2814', 'a7920c82-744c-478d-931d-77768cd2cffc', 'secondary_image', 'Imagen participante en la estación de penitencia.') on conflict ("id") do update set "outing_id" = excluded."outing_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."outing_entities" ("id", "outing_id", "entity_id", "role", "notes")
values ('e1534b39-37d5-4acf-8fca-9386994c5a23', 'fd1dfe51-9280-486d-b601-21776eda2814', '79f22de0-666a-45fe-85ab-1fc0751c8662', 'secondary_image', 'Imagen participante en la estación de penitencia.') on conflict ("id") do update set "outing_id" = excluded."outing_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "outing_id")
values ('7493fa15-5db3-4b8c-a6db-3e899fadc4c1', 'c275a4ec-446b-4d05-b179-97282112ec99', 'fd1dfe51-9280-486d-b601-21776eda2814') on conflict ("id") do update set "source_id" = excluded."source_id", "outing_id" = excluded."outing_id";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('fd6fe414-3c59-4f27-bfc3-1cfcba203801', 'event', 'Primera noticia documentada de la Hermandad del Sol', 'origen-hermandad-sol-1932', 'La primera noticia documentada de la corporación y de una salida procesional corresponde a 1932.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."events" ("entity_id", "event_type", "event_date_text", "place_id", "description", "event_category", "brotherhood_entity_id", "municipality_id", "event_status")
values ('fd6fe414-3c59-4f27-bfc3-1cfcba203801', 'Hito histórico', '1932', null, 'La primera noticia documentada de la corporación y de una salida procesional corresponde a 1932.', 'historical', '417a2bc3-0396-435f-af3f-44e2cb711c86', 'ca85889c-21fe-4367-8477-a57656b25da4', 'held') on conflict ("entity_id") do update set "event_type" = excluded."event_type", "event_date_text" = excluded."event_date_text", "place_id" = excluded."place_id", "description" = excluded."description", "event_category" = excluded."event_category", "brotherhood_entity_id" = excluded."brotherhood_entity_id", "municipality_id" = excluded."municipality_id", "event_status" = excluded."event_status";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('bbd58040-d8ed-480d-9596-38aa5ec81ec0', '3befe981-4200-4eeb-849f-7ac41fe7d6c3', 'fd6fe414-3c59-4f27-bfc3-1cfcba203801') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('be4da316-c819-4fda-8f28-1ec547e4f704', 'event', 'Erección como Hermandad de Penitencia', 'ereccion-penitencia-hermandad-sol-2006', 'La corporación fue erigida Hermandad de Penitencia con sede en San Diego de Alcalá.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."events" ("entity_id", "event_type", "event_date_text", "place_id", "description", "event_category", "brotherhood_entity_id", "municipality_id", "event_status")
values ('be4da316-c819-4fda-8f28-1ec547e4f704', 'Hito histórico', '16 de junio de 2006', '65e37807-1737-4773-ae58-86972ba6d145', 'La corporación fue erigida Hermandad de Penitencia con sede en San Diego de Alcalá.', 'historical', '417a2bc3-0396-435f-af3f-44e2cb711c86', 'ca85889c-21fe-4367-8477-a57656b25da4', 'held') on conflict ("entity_id") do update set "event_type" = excluded."event_type", "event_date_text" = excluded."event_date_text", "place_id" = excluded."place_id", "description" = excluded."description", "event_category" = excluded."event_category", "brotherhood_entity_id" = excluded."brotherhood_entity_id", "municipality_id" = excluded."municipality_id", "event_status" = excluded."event_status";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('6aa9f318-dc98-4e9c-8c04-ce7714f979f6', '3befe981-4200-4eeb-849f-7ac41fe7d6c3', 'be4da316-c819-4fda-8f28-1ec547e4f704') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('6181e827-ef67-4768-88ae-f351529d3765', 'event', 'Primera estación de penitencia de la Hermandad del Sol', 'primera-estacion-penitencia-sol-2007', 'La Hermandad realizó su primera estación de penitencia el Sábado de Pasión de 2007.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."events" ("entity_id", "event_type", "event_date_text", "place_id", "description", "event_category", "brotherhood_entity_id", "municipality_id", "event_status")
values ('6181e827-ef67-4768-88ae-f351529d3765', 'Hito histórico', '2007', null, 'La Hermandad realizó su primera estación de penitencia el Sábado de Pasión de 2007.', 'historical', '417a2bc3-0396-435f-af3f-44e2cb711c86', 'ca85889c-21fe-4367-8477-a57656b25da4', 'held') on conflict ("entity_id") do update set "event_type" = excluded."event_type", "event_date_text" = excluded."event_date_text", "place_id" = excluded."place_id", "description" = excluded."description", "event_category" = excluded."event_category", "brotherhood_entity_id" = excluded."brotherhood_entity_id", "municipality_id" = excluded."municipality_id", "event_status" = excluded."event_status";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('ccf77daa-cdda-4c61-8566-14f04c0a5e93', '3befe981-4200-4eeb-849f-7ac41fe7d6c3', '6181e827-ef67-4768-88ae-f351529d3765') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('d2eab2b0-8e0f-4072-a410-0cb3ed290a40', 'heritage_asset', 'Triunfo de la Santa Cruz de la Hermandad del Sol', 'triunfo-santa-cruz-hermandad-sol', 'Titular de la corporación desde 1932 y elemento de apertura de su cortejo.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."heritage_assets" ("entity_id", "parent_entity_id", "asset_type", "description", "current_condition", "is_current", "display_order", "is_featured")
values ('d2eab2b0-8e0f-4072-a410-0cb3ed290a40', '417a2bc3-0396-435f-af3f-44e2cb711c86', 'Cruz titular', 'Triunfo de la Santa Cruz, titular de la corporación desde su origen documentado.', 'Conservado', true, 1, true) on conflict ("entity_id") do update set "parent_entity_id" = excluded."parent_entity_id", "asset_type" = excluded."asset_type", "description" = excluded."description", "current_condition" = excluded."current_condition", "is_current" = excluded."is_current", "display_order" = excluded."display_order", "is_featured" = excluded."is_featured";

insert into public."brotherhood_habits" ("id", "brotherhood_entity_id", "name", "tunic_description", "hood_description", "cord_description", "footwear_description", "shield_description", "sort_order", "notes", "status")
values ('11711bf0-fba6-4708-814e-ded495b776bc', '417a2bc3-0396-435f-af3f-44e2cb711c86', 'Hábito del Sol', 'Túnica de cola color crema, de sarga.', 'Antifaz verde oscuro con esclavina prolongada.', 'Cinturón ancho de esparto en su color.', 'Zapatos negros con hebillas.', 'Escudo corporativo en el pecho.', 1, 'Configuración estrenada en 2026.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "name" = excluded."name", "tunic_description" = excluded."tunic_description", "hood_description" = excluded."hood_description", "cord_description" = excluded."cord_description", "footwear_description" = excluded."footwear_description", "shield_description" = excluded."shield_description", "sort_order" = excluded."sort_order", "notes" = excluded."notes", "status" = excluded."status";

insert into public."music_accompaniment_periods" ("id", "brotherhood_entity_id", "band_entity_id", "step_entity_id", "position", "outing_type", "date_from_text", "is_current", "notes", "status")
values ('ca12df75-1b39-44a9-9ec3-73c8a4e8273e', '417a2bc3-0396-435f-af3f-44e2cb711c86', '8c860cd1-11cb-4cbc-8a40-2eaec0543f8b', '6dcd8910-0267-4bd1-80fa-55d385e80717', 'Tras el Santo Cristo Varón de Dolores', 'Sábado Santo', 'Vigente · 2026', true, 'Banda de Cornetas y Tambores Nuestra Señora del Sol.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "band_entity_id" = excluded."band_entity_id", "step_entity_id" = excluded."step_entity_id", "position" = excluded."position", "outing_type" = excluded."outing_type", "date_from_text" = excluded."date_from_text", "is_current" = excluded."is_current", "notes" = excluded."notes", "status" = excluded."status";

insert into public."music_accompaniment_periods" ("id", "brotherhood_entity_id", "band_entity_id", "step_entity_id", "position", "outing_type", "date_from_text", "year_from", "is_current", "notes", "status")
values ('de469d42-e9ff-4d83-9a3c-c6154db13e1b', '417a2bc3-0396-435f-af3f-44e2cb711c86', '91dc3cfa-75c1-4306-97fb-7be35c3ed242', '76dba4ef-5d3e-47c7-b7de-d804e7d47717', 'Tras el paso de Nuestra Señora del Sol', 'Sábado Santo', 'Desde 2025', 2025, true, 'Banda Municipal de Música Fernando Guerrero de Los Palacios y Villafranca.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "band_entity_id" = excluded."band_entity_id", "step_entity_id" = excluded."step_entity_id", "position" = excluded."position", "outing_type" = excluded."outing_type", "date_from_text" = excluded."date_from_text", "year_from" = excluded."year_from", "is_current" = excluded."is_current", "notes" = excluded."notes", "status" = excluded."status";

insert into public."music_accompaniment_periods" ("id", "brotherhood_entity_id", "band_entity_id", "position", "outing_type", "date_from_text", "is_current", "notes", "status")
values ('3ce18f42-ebbb-462e-ae3f-b66daa167d8c', '417a2bc3-0396-435f-af3f-44e2cb711c86', '546d616f-4a2c-4ab0-9839-4e980d41d5f1', 'Cruz de Guía / Triunfo de la Santa Cruz', 'Sábado Santo', 'Vigente · 2026', true, 'Agrupación Musical Santa María de la Esperanza.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "band_entity_id" = excluded."band_entity_id", "position" = excluded."position", "outing_type" = excluded."outing_type", "date_from_text" = excluded."date_from_text", "is_current" = excluded."is_current", "notes" = excluded."notes", "status" = excluded."status";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('308f3f57-c8a5-4f2e-a415-87a50a5ea03c', 'c275a4ec-446b-4d05-b179-97282112ec99', '417a2bc3-0396-435f-af3f-44e2cb711c86') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('414420bf-3672-404d-bbfc-df83a9c1c75f', '4029a705-5729-4819-bc4e-4bdb180e9793', '417a2bc3-0396-435f-af3f-44e2cb711c86') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('42b8adfa-bfe5-429b-b390-bf6dc35f600a', '3befe981-4200-4eeb-849f-7ac41fe7d6c3', '417a2bc3-0396-435f-af3f-44e2cb711c86') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('85088622-5f74-4159-92a3-18ebddfe4ef3', 'c65db041-08c0-42f4-a472-5d804ea69833', '417a2bc3-0396-435f-af3f-44e2cb711c86') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('1cb355df-4636-48f9-87f1-39828590ff71', 'be18d7a8-e9d2-4806-9664-42bb57d2851b', '417a2bc3-0396-435f-af3f-44e2cb711c86') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('c4b0d639-4979-4bbd-a713-2f6f4e430979', '58d0c1a8-9f15-4b9e-bea2-2e7bffd49ebf', '417a2bc3-0396-435f-af3f-44e2cb711c86') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('da6a5866-36e9-4b48-9576-ede65a86b6e1', 'c65db041-08c0-42f4-a472-5d804ea69833', 'df534570-c3aa-4850-93c0-577c430d6d28') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('05218c70-8f07-480f-9c76-188626a01170', 'c65db041-08c0-42f4-a472-5d804ea69833', '7dcf7dd3-763a-4a35-80f7-f332afd261b7') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('c1385ece-6ca3-4661-ac68-bd2ae1aa8fc8', 'c65db041-08c0-42f4-a472-5d804ea69833', 'a7920c82-744c-478d-931d-77768cd2cffc') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('518841fe-ad59-46e6-89c4-5010b62ab988', 'c65db041-08c0-42f4-a472-5d804ea69833', '79f22de0-666a-45fe-85ab-1fc0751c8662') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('48f0138f-81db-43f8-b448-2e6106abe3d7', '3befe981-4200-4eeb-849f-7ac41fe7d6c3', '6dcd8910-0267-4bd1-80fa-55d385e80717') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('866ae438-e879-4ab0-a839-804478812506', '3befe981-4200-4eeb-849f-7ac41fe7d6c3', '76dba4ef-5d3e-47c7-b7de-d804e7d47717') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('3d93caa5-111d-41fa-a598-4a917a50e070', 'c65db041-08c0-42f4-a472-5d804ea69833', 'd2eab2b0-8e0f-4072-a410-0cb3ed290a40') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('f69e5728-af3d-4f3a-963a-81068b417a85', 'brotherhood', 'El Santo Entierro', 'santo-entierro-sevilla', 'Real Hermandad sacramental del Sábado Santo con sede en la Iglesia de San Gregorio y tres pasos.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."brotherhoods" ("entity_id", "official_name", "popular_name", "foundation_text", "municipality_id", "canonical_see_place_id", "neighborhood", "website_url", "instagram_url", "brotherhood_types", "current_procession_day", "history_text", "notes")
values ('f69e5728-af3d-4f3a-963a-81068b417a85', 'Real Hermandad Sacramental del Santo Entierro de Nuestro Señor Jesucristo, Triunfo de la Santa Cruz y María Santísima de Villaviciosa', 'El Santo Entierro', 'Orígenes históricos no documentados con precisión; corporación reorganizada en la Edad Moderna', 'ca85889c-21fe-4367-8477-a57656b25da4', '12f55ed3-b354-47fb-9a22-6db5c8066078', 'Centro', 'https://www.santoentierro.org/', 'https://www.instagram.com/santoentierrosevilla/', ARRAY['Penitencia', 'Sacramental']::text[], 'Sábado Santo', 'La Hermandad conserva una tradición fundacional antigua cuyo origen exacto no se fija sin documentación concluyente. Su cortejo del Sábado Santo integra el paso alegórico del Triunfo de la Santa Cruz, la urna del Santísimo Cristo Yacente y el Duelo de María Santísima de Villaviciosa.', 'La tradición sobre una fundación por Fernando III no se convierte en fecha canónica. Sin escudo ni fotografías públicas mientras no conste licencia reutilizable.') on conflict ("entity_id") do update set "official_name" = excluded."official_name", "popular_name" = excluded."popular_name", "foundation_text" = excluded."foundation_text", "municipality_id" = excluded."municipality_id", "canonical_see_place_id" = excluded."canonical_see_place_id", "neighborhood" = excluded."neighborhood", "website_url" = excluded."website_url", "instagram_url" = excluded."instagram_url", "brotherhood_types" = excluded."brotherhood_types", "current_procession_day" = excluded."current_procession_day", "history_text" = excluded."history_text", "notes" = excluded."notes";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('ab7afe9f-134e-4d62-8274-4e9933fcbaf6', 'image', 'Triunfo de la Santa Cruz sobre la Muerte', 'triunfo-santa-cruz-muerte-santo-entierro-sevilla', 'Conjunto alegórico conocido popularmente como la Canina.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."images" ("entity_id", "image_type", "execution_date_text", "current_condition", "description", "is_dress_image")
values ('ab7afe9f-134e-4d62-8274-4e9933fcbaf6', 'Grupo alegórico', '1691', 'extant', 'Alegoría del triunfo de la Cruz sobre la muerte y el pecado.', false) on conflict ("entity_id") do update set "image_type" = excluded."image_type", "execution_date_text" = excluded."execution_date_text", "current_condition" = excluded."current_condition", "description" = excluded."description", "is_dress_image" = excluded."is_dress_image";

insert into public."brotherhood_images" ("id", "brotherhood_entity_id", "image_entity_id", "relation_type", "notes", "status")
values ('66851765-313c-4b81-966b-b530930249c2', 'f69e5728-af3d-4f3a-963a-81068b417a85', 'ab7afe9f-134e-4d62-8274-4e9933fcbaf6', 'titular', 'Titular vigente documentado.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_authorships" ("id", "image_entity_id", "agent_entity_id", "authorship_type", "role_name", "date_from_text", "certainty", "notes", "status")
values ('f0c9625d-04f9-4879-860d-e2cfa519ace1', 'ab7afe9f-134e-4d62-8274-4e9933fcbaf6', '30a3f84f-d1b9-409e-b97a-6d3f95421173', 'author', 'escultor', '1691', 'documented', null, 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "agent_entity_id" = excluded."agent_entity_id", "authorship_type" = excluded."authorship_type", "role_name" = excluded."role_name", "date_from_text" = excluded."date_from_text", "certainty" = excluded."certainty", "notes" = excluded."notes", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('310fd9d8-2d28-49ce-a42d-9e461538460d', 'image', 'Santísimo Cristo Yacente del Santo Entierro de Sevilla', 'santisimo-cristo-yacente-santo-entierro-sevilla', 'Cristo Yacente tallado por Juan de Mesa en 1619, según documento hallado durante su restauración.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."images" ("entity_id", "image_type", "execution_date_text", "current_condition", "description", "is_dress_image")
values ('310fd9d8-2d28-49ce-a42d-9e461538460d', 'Cristo Yacente', '1619', 'extant', 'Imagen de Cristo muerto destinada a la urna procesional del Santo Entierro.', false) on conflict ("entity_id") do update set "image_type" = excluded."image_type", "execution_date_text" = excluded."execution_date_text", "current_condition" = excluded."current_condition", "description" = excluded."description", "is_dress_image" = excluded."is_dress_image";

insert into public."brotherhood_images" ("id", "brotherhood_entity_id", "image_entity_id", "relation_type", "notes", "status")
values ('e6186b89-7b57-423f-86df-59f2fbd065ed', 'f69e5728-af3d-4f3a-963a-81068b417a85', '310fd9d8-2d28-49ce-a42d-9e461538460d', 'titular', 'Titular vigente documentado.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_authorships" ("id", "image_entity_id", "agent_entity_id", "authorship_type", "role_name", "date_from_text", "certainty", "notes", "status")
values ('192caba4-8307-4f95-b294-752cf44c8009', '310fd9d8-2d28-49ce-a42d-9e461538460d', '68d39c3f-c9d7-43d3-9986-fb616de2b164', 'author', 'escultor', '1619', 'documented', 'Autoría confirmada por el documento hallado en el interior de la imagen durante la restauración.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "agent_entity_id" = excluded."agent_entity_id", "authorship_type" = excluded."authorship_type", "role_name" = excluded."role_name", "date_from_text" = excluded."date_from_text", "certainty" = excluded."certainty", "notes" = excluded."notes", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('76376323-07de-4d40-888a-3629e51c519b', 'image', 'María Santísima de Villaviciosa', 'maria-santisima-villaviciosa-sevilla', 'Dolorosa titular del Santo Entierro, obra de Antonio Cardoso de Quirós.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."images" ("entity_id", "image_type", "execution_date_text", "current_condition", "description", "is_dress_image")
values ('76376323-07de-4d40-888a-3629e51c519b', 'Dolorosa de vestir', '1691', 'extant', 'Dolorosa del paso del Duelo del Santo Entierro.', true) on conflict ("entity_id") do update set "image_type" = excluded."image_type", "execution_date_text" = excluded."execution_date_text", "current_condition" = excluded."current_condition", "description" = excluded."description", "is_dress_image" = excluded."is_dress_image";

insert into public."brotherhood_images" ("id", "brotherhood_entity_id", "image_entity_id", "relation_type", "notes", "status")
values ('978faec0-51dc-44ac-b1d5-9618d67a877b', 'f69e5728-af3d-4f3a-963a-81068b417a85', '76376323-07de-4d40-888a-3629e51c519b', 'titular', 'Titular vigente documentado.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_authorships" ("id", "image_entity_id", "agent_entity_id", "authorship_type", "role_name", "date_from_text", "certainty", "notes", "status")
values ('7e2b8e52-5d16-4a81-b66a-4a6eec130377', '76376323-07de-4d40-888a-3629e51c519b', '30a3f84f-d1b9-409e-b97a-6d3f95421173', 'author', 'escultor', '1691', 'documented', null, 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "agent_entity_id" = excluded."agent_entity_id", "authorship_type" = excluded."authorship_type", "role_name" = excluded."role_name", "date_from_text" = excluded."date_from_text", "certainty" = excluded."certainty", "notes" = excluded."notes", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('946cbf28-ac01-456b-871d-aafeb7bb1c0d', 'step', 'Paso del Triunfo de la Santa Cruz', 'paso-triunfo-santa-cruz-canina-sevilla', 'Paso alegórico conocido como la Canina.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."steps" ("entity_id", "step_type", "current_condition", "execution_date_text", "materials", "style", "description")
values ('946cbf28-ac01-456b-871d-aafeb7bb1c0d', 'Alegórico', 'preserved', null, null, null, 'Representa el triunfo de la Santa Cruz sobre la muerte y el pecado.') on conflict ("entity_id") do update set "step_type" = excluded."step_type", "current_condition" = excluded."current_condition", "execution_date_text" = excluded."execution_date_text", "materials" = excluded."materials", "style" = excluded."style", "description" = excluded."description";

insert into public."brotherhood_steps" ("id", "brotherhood_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('54b46e45-1b35-4270-b636-d61fabab1ee2', 'f69e5728-af3d-4f3a-963a-81068b417a85', '946cbf28-ac01-456b-871d-aafeb7bb1c0d', 'current', 'Paso procesional vigente.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_steps" ("id", "image_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('e4d71097-cfe4-4295-9df1-9a76ea8c3f00', 'ab7afe9f-134e-4d62-8274-4e9933fcbaf6', '946cbf28-ac01-456b-871d-aafeb7bb1c0d', 'processional', 'Imagen principal del paso.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('dec7f517-3330-42e7-af0c-1969defbbfc0', 'step', 'Paso de la urna del Santísimo Cristo Yacente', 'paso-urna-cristo-yacente-sevilla', 'Paso neogótico de la urna del Santísimo Cristo Yacente.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."steps" ("entity_id", "step_type", "current_condition", "execution_date_text", "materials", "style", "description")
values ('dec7f517-3330-42e7-af0c-1969defbbfc0', 'Urna', 'preserved', 'Conjunto contemporáneo completado en torno a 2000', 'Madera tallada y dorada; urna acristalada', 'Neogótico', 'Conjunto procesional con urna y candelabros, concebido como una catedral en miniatura.') on conflict ("entity_id") do update set "step_type" = excluded."step_type", "current_condition" = excluded."current_condition", "execution_date_text" = excluded."execution_date_text", "materials" = excluded."materials", "style" = excluded."style", "description" = excluded."description";

insert into public."brotherhood_steps" ("id", "brotherhood_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('8b6d69fc-cd6b-4a40-98d6-864627aeb12c', 'f69e5728-af3d-4f3a-963a-81068b417a85', 'dec7f517-3330-42e7-af0c-1969defbbfc0', 'current', 'Paso procesional vigente.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_steps" ("id", "image_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('8a37d6f5-c7b3-4c74-a70a-465b931b9a71', '310fd9d8-2d28-49ce-a42d-9e461538460d', 'dec7f517-3330-42e7-af0c-1969defbbfc0', 'processional', 'Imagen principal del paso.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('ae8ccdad-465d-4c5a-b939-12a4eab896d2', 'step', 'Paso del Duelo de María Santísima de Villaviciosa', 'paso-duelo-villaviciosa-sevilla', 'Paso del Duelo presidido por María Santísima de Villaviciosa.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."steps" ("entity_id", "step_type", "current_condition", "execution_date_text", "materials", "style", "description")
values ('ae8ccdad-465d-4c5a-b939-12a4eab896d2', 'Misterio', 'preserved', '1965', null, 'Neogótico', 'Representa el duelo tras la muerte de Cristo; la ficha mantiene pendiente el alta individual de las imágenes secundarias hasta contar con expediente propio suficiente.') on conflict ("entity_id") do update set "step_type" = excluded."step_type", "current_condition" = excluded."current_condition", "execution_date_text" = excluded."execution_date_text", "materials" = excluded."materials", "style" = excluded."style", "description" = excluded."description";

insert into public."brotherhood_steps" ("id", "brotherhood_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('49c43d6f-c5d5-42e3-9095-1c77f5c41188', 'f69e5728-af3d-4f3a-963a-81068b417a85', 'ae8ccdad-465d-4c5a-b939-12a4eab896d2', 'current', 'Paso procesional vigente.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_steps" ("id", "image_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('73326782-d07e-4df3-b740-b0fc15b29ff6', '76376323-07de-4d40-888a-3629e51c519b', 'ae8ccdad-465d-4c5a-b939-12a4eab896d2', 'processional', 'Imagen principal del paso.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."cults" ("id", "brotherhood_entity_id", "image_entity_id", "place_id", "status", "is_recurring", "cult_type", "title", "month", "date_rule", "recurrence_label", "display_order", "description")
values ('a9aa75e5-98f4-416f-bce3-c6ffe8221a5e', 'f69e5728-af3d-4f3a-963a-81068b417a85', '310fd9d8-2d28-49ce-a42d-9e461538460d', '12f55ed3-b354-47fb-9a22-6db5c8066078', 'published', true, 'Quinario', 'Quinario penitencial del Santo Entierro', null, 'Cuaresma', 'Anual', 1, 'Quinario penitencial anual previo a la Función Principal.') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "place_id" = excluded."place_id", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "cult_type" = excluded."cult_type", "title" = excluded."title", "month" = excluded."month", "date_rule" = excluded."date_rule", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order", "description" = excluded."description";

insert into public."cult_entities" ("id", "cult_id", "entity_id", "role", "notes")
values ('fd522782-5228-42c1-9bda-d258a215870e', 'a9aa75e5-98f4-416f-bce3-c6ffe8221a5e', '310fd9d8-2d28-49ce-a42d-9e461538460d', 'honoree', 'Titular al que se dedica el culto.') on conflict ("id") do update set "cult_id" = excluded."cult_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "cult_id")
values ('e0e20f96-b439-4bb0-9e0d-af4c8c1106fa', '03c12810-14a4-47c6-a8b7-9fda270ec649', 'a9aa75e5-98f4-416f-bce3-c6ffe8221a5e') on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id";

insert into public."cults" ("id", "brotherhood_entity_id", "image_entity_id", "place_id", "status", "is_recurring", "cult_type", "title", "month", "date_rule", "recurrence_label", "display_order", "description")
values ('2942c344-ce47-4d25-810e-6c848679c221', 'f69e5728-af3d-4f3a-963a-81068b417a85', '310fd9d8-2d28-49ce-a42d-9e461538460d', '12f55ed3-b354-47fb-9a22-6db5c8066078', 'published', true, 'Función Principal', 'Función Principal de Instituto', null, 'Domingo de Cuaresma', 'Anual', 2, 'Función Principal anual de la corporación.') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "place_id" = excluded."place_id", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "cult_type" = excluded."cult_type", "title" = excluded."title", "month" = excluded."month", "date_rule" = excluded."date_rule", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order", "description" = excluded."description";

insert into public."cult_entities" ("id", "cult_id", "entity_id", "role", "notes")
values ('3f04ca03-afe6-48cc-9a58-17038e7d00cf', '2942c344-ce47-4d25-810e-6c848679c221', '310fd9d8-2d28-49ce-a42d-9e461538460d', 'honoree', 'Titular al que se dedica el culto.') on conflict ("id") do update set "cult_id" = excluded."cult_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "cult_id")
values ('12faba2d-ea3d-435a-a19f-6e8c0ef1e20d', '03c12810-14a4-47c6-a8b7-9fda270ec649', '2942c344-ce47-4d25-810e-6c848679c221') on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id";

insert into public."cults" ("id", "brotherhood_entity_id", "image_entity_id", "place_id", "status", "is_recurring", "cult_type", "title", "month", "date_rule", "recurrence_label", "display_order", "description")
values ('14a89698-65dc-47de-bf0a-daf77fca34f1', 'f69e5728-af3d-4f3a-963a-81068b417a85', '76376323-07de-4d40-888a-3629e51c519b', '12f55ed3-b354-47fb-9a22-6db5c8066078', 'published', true, 'Triduo', 'Triduo a María Santísima de Villaviciosa', 11, 'Noviembre', 'Anual', 3, 'Triduo anual dedicado a la titular mariana.') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "place_id" = excluded."place_id", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "cult_type" = excluded."cult_type", "title" = excluded."title", "month" = excluded."month", "date_rule" = excluded."date_rule", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order", "description" = excluded."description";

insert into public."cult_entities" ("id", "cult_id", "entity_id", "role", "notes")
values ('9e655522-1abf-49b8-bbbd-88abc9f110f5', '14a89698-65dc-47de-bf0a-daf77fca34f1', '76376323-07de-4d40-888a-3629e51c519b', 'honoree', 'Titular al que se dedica el culto.') on conflict ("id") do update set "cult_id" = excluded."cult_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "cult_id")
values ('aac69737-a091-4737-b9e5-874dd8da07a1', '03c12810-14a4-47c6-a8b7-9fda270ec649', '14a89698-65dc-47de-bf0a-daf77fca34f1') on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id";

insert into public."outings" ("id", "brotherhood_entity_id", "outing_type", "character", "title", "outing_date", "year", "municipality_id", "origin_place_id", "destination_text", "description", "event_status", "status", "slug")
values ('980ddcca-1826-470b-a5c9-8a417728b786', 'f69e5728-af3d-4f3a-963a-81068b417a85', 'Estación de Penitencia', 'ordinary', 'Santo Entierro · Estación de Penitencia 2026', '2026-04-04', 2026, 'ca85889c-21fe-4367-8477-a57656b25da4', '12f55ed3-b354-47fb-9a22-6db5c8066078', 'Santa Iglesia Catedral de Sevilla', 'Estación de penitencia del Sábado Santo con los tres pasos de la corporación.', 'held', 'published', 'santo-entierro-sevilla-estacion-penitencia-2026') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "outing_type" = excluded."outing_type", "character" = excluded."character", "title" = excluded."title", "outing_date" = excluded."outing_date", "year" = excluded."year", "municipality_id" = excluded."municipality_id", "origin_place_id" = excluded."origin_place_id", "destination_text" = excluded."destination_text", "description" = excluded."description", "event_status" = excluded."event_status", "status" = excluded."status", "slug" = excluded."slug";

insert into public."outing_entities" ("id", "outing_id", "entity_id", "role", "notes")
values ('35b89753-5064-4de1-8d49-3d25d6eb76ed', '980ddcca-1826-470b-a5c9-8a417728b786', 'ab7afe9f-134e-4d62-8274-4e9933fcbaf6', 'processional_image', 'Titular participante en la estación de penitencia.') on conflict ("id") do update set "outing_id" = excluded."outing_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."outing_entities" ("id", "outing_id", "entity_id", "role", "notes")
values ('b7868699-5998-4898-9c71-983a67ddbdfa', '980ddcca-1826-470b-a5c9-8a417728b786', '310fd9d8-2d28-49ce-a42d-9e461538460d', 'processional_image', 'Titular participante en la estación de penitencia.') on conflict ("id") do update set "outing_id" = excluded."outing_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."outing_entities" ("id", "outing_id", "entity_id", "role", "notes")
values ('fcbd1708-3ae5-46bc-9e70-2c69fde9c578', '980ddcca-1826-470b-a5c9-8a417728b786', '76376323-07de-4d40-888a-3629e51c519b', 'processional_image', 'Titular participante en la estación de penitencia.') on conflict ("id") do update set "outing_id" = excluded."outing_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "outing_id")
values ('5d75df64-7b91-44b5-ad5f-9e16bfc6e30b', 'c275a4ec-446b-4d05-b179-97282112ec99', '980ddcca-1826-470b-a5c9-8a417728b786') on conflict ("id") do update set "source_id" = excluded."source_id", "outing_id" = excluded."outing_id";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('f75e537f-1cba-40e6-beb4-769a323a7594', 'event', 'Ejecución del Santísimo Cristo Yacente', 'ejecucion-cristo-yacente-sevilla-1619', 'Juan de Mesa concluyó en 1619 el Santísimo Cristo Yacente para la Hermandad.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."events" ("entity_id", "event_type", "event_date_text", "place_id", "description", "event_category", "brotherhood_entity_id", "municipality_id", "event_status")
values ('f75e537f-1cba-40e6-beb4-769a323a7594', 'Hito histórico', '1619', null, 'Juan de Mesa concluyó en 1619 el Santísimo Cristo Yacente para la Hermandad.', 'historical', 'f69e5728-af3d-4f3a-963a-81068b417a85', 'ca85889c-21fe-4367-8477-a57656b25da4', 'held') on conflict ("entity_id") do update set "event_type" = excluded."event_type", "event_date_text" = excluded."event_date_text", "place_id" = excluded."place_id", "description" = excluded."description", "event_category" = excluded."event_category", "brotherhood_entity_id" = excluded."brotherhood_entity_id", "municipality_id" = excluded."municipality_id", "event_status" = excluded."event_status";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('3cf58114-58a3-4cf5-8693-65a98b81df5d', '03c12810-14a4-47c6-a8b7-9fda270ec649', 'f75e537f-1cba-40e6-beb4-769a323a7594') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('8458c2da-fad3-489b-8eb6-e5b4d57b9c0f', 'event', 'Reorganización del cortejo del Santo Entierro', 'reorganizacion-santo-entierro-sevilla-siglo-xix', 'La corporación reorganizó y renovó su patrimonio procesional durante el siglo XIX.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."events" ("entity_id", "event_type", "event_date_text", "place_id", "description", "event_category", "brotherhood_entity_id", "municipality_id", "event_status")
values ('8458c2da-fad3-489b-8eb6-e5b4d57b9c0f', 'Hito histórico', 'Siglo XIX', null, 'La corporación reorganizó y renovó su patrimonio procesional durante el siglo XIX.', 'historical', 'f69e5728-af3d-4f3a-963a-81068b417a85', 'ca85889c-21fe-4367-8477-a57656b25da4', 'held') on conflict ("entity_id") do update set "event_type" = excluded."event_type", "event_date_text" = excluded."event_date_text", "place_id" = excluded."place_id", "description" = excluded."description", "event_category" = excluded."event_category", "brotherhood_entity_id" = excluded."brotherhood_entity_id", "municipality_id" = excluded."municipality_id", "event_status" = excluded."event_status";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('aeda1ad8-0373-4000-8ed4-1446cbf69bb4', 'e61aa1fb-8983-424a-8d6d-4392c805e755', '8458c2da-fad3-489b-8eb6-e5b4d57b9c0f') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('2dd5ba4a-ae2a-4610-af62-d20a398805ea', 'event', 'Cristo Yacente en el Vía Crucis de las Hermandades de 2025', 'cristo-yacente-via-crucis-sevilla-2025', 'El Santísimo Cristo Yacente presidió el Vía Crucis del Consejo de Hermandades de Sevilla de 2025.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."events" ("entity_id", "event_type", "event_date_text", "place_id", "description", "event_category", "brotherhood_entity_id", "municipality_id", "event_status")
values ('2dd5ba4a-ae2a-4610-af62-d20a398805ea', 'Hito histórico', '10 de marzo de 2025', null, 'El Santísimo Cristo Yacente presidió el Vía Crucis del Consejo de Hermandades de Sevilla de 2025.', 'historical', 'f69e5728-af3d-4f3a-963a-81068b417a85', 'ca85889c-21fe-4367-8477-a57656b25da4', 'held') on conflict ("entity_id") do update set "event_type" = excluded."event_type", "event_date_text" = excluded."event_date_text", "place_id" = excluded."place_id", "description" = excluded."description", "event_category" = excluded."event_category", "brotherhood_entity_id" = excluded."brotherhood_entity_id", "municipality_id" = excluded."municipality_id", "event_status" = excluded."event_status";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('e6743a60-1aba-4e36-afe1-e434c4b83fa0', '03c12810-14a4-47c6-a8b7-9fda270ec649', '2dd5ba4a-ae2a-4610-af62-d20a398805ea') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('0a59eeaf-debd-4343-b9a9-3994415e6da2', 'event', 'Restauración y hallazgo documental del Cristo Yacente', 'restauracion-hallazgo-cristo-yacente-2024-2025', 'La restauración permitió localizar y estudiar el documento que acredita la ejecución de la imagen por Juan de Mesa en 1619.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."events" ("entity_id", "event_type", "event_date_text", "place_id", "description", "event_category", "brotherhood_entity_id", "municipality_id", "event_status")
values ('0a59eeaf-debd-4343-b9a9-3994415e6da2', 'Hito histórico', '2024–2025', null, 'La restauración permitió localizar y estudiar el documento que acredita la ejecución de la imagen por Juan de Mesa en 1619.', 'historical', 'f69e5728-af3d-4f3a-963a-81068b417a85', 'ca85889c-21fe-4367-8477-a57656b25da4', 'held') on conflict ("entity_id") do update set "event_type" = excluded."event_type", "event_date_text" = excluded."event_date_text", "place_id" = excluded."place_id", "description" = excluded."description", "event_category" = excluded."event_category", "brotherhood_entity_id" = excluded."brotherhood_entity_id", "municipality_id" = excluded."municipality_id", "event_status" = excluded."event_status";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('49c3ef09-d7b9-41f9-9620-fcb2d88bf60e', '03c12810-14a4-47c6-a8b7-9fda270ec649', '0a59eeaf-debd-4343-b9a9-3994415e6da2') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."brotherhood_habits" ("id", "brotherhood_entity_id", "name", "tunic_description", "hood_description", "sort_order", "notes", "status")
values ('6c9c7bd4-9973-4b11-8833-a18818792862', 'f69e5728-af3d-4f3a-963a-81068b417a85', 'Hábito del Santo Entierro', 'Ropón negro de corte tradicional.', 'Antifaz negro.', 1, 'Los hermanos que acompañan al Cristo Yacente pueden integrar el cortejo de etiqueta conforme a la configuración propia de la corporación.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "name" = excluded."name", "tunic_description" = excluded."tunic_description", "hood_description" = excluded."hood_description", "sort_order" = excluded."sort_order", "notes" = excluded."notes", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('8480fe50-3ad1-42c4-af82-38d11bfd9071', 'band', 'Banda Sinfónica Municipal de Sevilla', 'banda-sinfonica-municipal-sevilla', 'Formación municipal documentada en el cortejo del Santo Entierro de 2026.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."bands" ("entity_id", "band_type", "municipality_id", "description")
values ('8480fe50-3ad1-42c4-af82-38d11bfd9071', 'Banda de música', 'ca85889c-21fe-4367-8477-a57656b25da4', 'Banda Sinfónica Municipal de Sevilla.') on conflict ("entity_id") do update set "band_type" = excluded."band_type", "municipality_id" = excluded."municipality_id", "description" = excluded."description";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('e1740c97-c1ff-494b-9345-f22833d91ba3', 'band', 'Unidad de Música del Cuartel General de la Fuerza Terrestre', 'unidad-musica-fuerza-terrestre-sevilla', 'Unidad de música militar documentada en el cortejo del Santo Entierro de 2026.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."bands" ("entity_id", "band_type", "municipality_id", "description")
values ('e1740c97-c1ff-494b-9345-f22833d91ba3', 'Música militar', 'ca85889c-21fe-4367-8477-a57656b25da4', 'Unidad de música militar con sede en Sevilla.') on conflict ("entity_id") do update set "band_type" = excluded."band_type", "municipality_id" = excluded."municipality_id", "description" = excluded."description";

insert into public."music_accompaniment_periods" ("id", "brotherhood_entity_id", "band_entity_id", "step_entity_id", "position", "outing_type", "date_from_text", "is_current", "notes", "status")
values ('3a2157b4-b0b3-466a-a596-d4e5f33beda2', 'f69e5728-af3d-4f3a-963a-81068b417a85', '8480fe50-3ad1-42c4-af82-38d11bfd9071', 'dec7f517-3330-42e7-af0c-1969defbbfc0', 'Tras el paso de la urna', 'Sábado Santo', 'Vigente · 2026', true, 'Banda Sinfónica Municipal de Sevilla.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "band_entity_id" = excluded."band_entity_id", "step_entity_id" = excluded."step_entity_id", "position" = excluded."position", "outing_type" = excluded."outing_type", "date_from_text" = excluded."date_from_text", "is_current" = excluded."is_current", "notes" = excluded."notes", "status" = excluded."status";

insert into public."music_accompaniment_periods" ("id", "brotherhood_entity_id", "band_entity_id", "step_entity_id", "position", "outing_type", "date_from_text", "is_current", "notes", "status")
values ('7f9e16f6-3d85-4ae8-b046-ab324813d389', 'f69e5728-af3d-4f3a-963a-81068b417a85', 'e1740c97-c1ff-494b-9345-f22833d91ba3', 'ae8ccdad-465d-4c5a-b939-12a4eab896d2', 'Tras el paso del Duelo', 'Sábado Santo', 'Vigente · 2026', true, 'Unidad de Música del Cuartel General de la Fuerza Terrestre.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "band_entity_id" = excluded."band_entity_id", "step_entity_id" = excluded."step_entity_id", "position" = excluded."position", "outing_type" = excluded."outing_type", "date_from_text" = excluded."date_from_text", "is_current" = excluded."is_current", "notes" = excluded."notes", "status" = excluded."status";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('d38577b6-0b9a-4e7f-b001-bd89730bc92b', 'c275a4ec-446b-4d05-b179-97282112ec99', 'f69e5728-af3d-4f3a-963a-81068b417a85') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('69817978-d88f-47b4-b4c6-b3512e2ede3b', '03c12810-14a4-47c6-a8b7-9fda270ec649', 'f69e5728-af3d-4f3a-963a-81068b417a85') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('0eb14d64-43fd-4dc8-8136-e4080a5b60c5', 'e61aa1fb-8983-424a-8d6d-4392c805e755', 'f69e5728-af3d-4f3a-963a-81068b417a85') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('c77670c4-a3a9-47de-815a-10f5fbcd1308', '7ce6e12d-5e87-4532-b6cb-29c31d3511e5', 'f69e5728-af3d-4f3a-963a-81068b417a85') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('eb91f2db-fe85-4bbb-b2f1-a24cb55e22fd', 'e61aa1fb-8983-424a-8d6d-4392c805e755', 'ab7afe9f-134e-4d62-8274-4e9933fcbaf6') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('88998421-4f4f-442f-b090-17d65c734a49', '03c12810-14a4-47c6-a8b7-9fda270ec649', '310fd9d8-2d28-49ce-a42d-9e461538460d') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('05a26078-41c0-4399-8ac7-3740c938e13b', 'e61aa1fb-8983-424a-8d6d-4392c805e755', '76376323-07de-4d40-888a-3629e51c519b') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('1d11eaac-8e53-4b10-aea7-e787ff3a606a', 'e61aa1fb-8983-424a-8d6d-4392c805e755', '946cbf28-ac01-456b-871d-aafeb7bb1c0d') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('6c5637c6-6f50-44e7-98de-483771ec49c2', 'e61aa1fb-8983-424a-8d6d-4392c805e755', 'dec7f517-3330-42e7-af0c-1969defbbfc0') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('6a06f59f-a348-40a2-b506-38d379f63631', 'e61aa1fb-8983-424a-8d6d-4392c805e755', 'ae8ccdad-465d-4c5a-b939-12a4eab896d2') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."source_links" ("id", "source_id", "music_accompaniment_period_id")
values ('1defd127-d8fc-4395-a390-002c3ad9297f', '7ce6e12d-5e87-4532-b6cb-29c31d3511e5', '3a2157b4-b0b3-466a-a596-d4e5f33beda2') on conflict ("id") do update set "source_id" = excluded."source_id", "music_accompaniment_period_id" = excluded."music_accompaniment_period_id";

insert into public."source_links" ("id", "source_id", "music_accompaniment_period_id")
values ('95050408-a580-4067-92a3-da8d7f0a88da', '7ce6e12d-5e87-4532-b6cb-29c31d3511e5', '7f9e16f6-3d85-4ae8-b046-ab324813d389') on conflict ("id") do update set "source_id" = excluded."source_id", "music_accompaniment_period_id" = excluded."music_accompaniment_period_id";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('1e85ab84-d074-49be-803c-b26201b20561', 'brotherhood', 'La Soledad de San Lorenzo', 'la-soledad-de-san-lorenzo', 'Primitiva cofradía de la Soledad de Sevilla, sacramental y penitencial, con sede en la Parroquia de San Lorenzo.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."brotherhoods" ("entity_id", "official_name", "popular_name", "foundation_text", "municipality_id", "canonical_see_place_id", "neighborhood", "website_url", "brotherhood_types", "current_procession_day", "history_text", "notes")
values ('1e85ab84-d074-49be-803c-b26201b20561', 'Pontificia y Real Hermandad Sacramental de Nuestra Señora de Roca-Amador, Ánimas Benditas, Beato Marcelo Spínola y Primitiva Cofradía de Nazarenos de María Santísima en su Soledad', 'La Soledad de San Lorenzo', '1557; primeras reglas, con existencia documentada desde 1549', 'ca85889c-21fe-4367-8477-a57656b25da4', '49c5d3af-b1ef-482d-b93c-d5991027958b', 'San Lorenzo', 'https://www.hermandaddelasoledad.org/', ARRAY['Penitencia', 'Sacramental']::text[], 'Sábado Santo', 'La cofradía está documentada desde 1549 y aprobó sus primeras reglas en 1557. Llegó a San Lorenzo en 1868 y se fusionó con la Sacramental del templo en 1977. Desde la reforma litúrgica de 1956 realiza estación de penitencia el Sábado Santo.', 'La estación se desarrolla sin acompañamiento musical. Sin escudo ni fotografías públicas mientras no conste licencia reutilizable.') on conflict ("entity_id") do update set "official_name" = excluded."official_name", "popular_name" = excluded."popular_name", "foundation_text" = excluded."foundation_text", "municipality_id" = excluded."municipality_id", "canonical_see_place_id" = excluded."canonical_see_place_id", "neighborhood" = excluded."neighborhood", "website_url" = excluded."website_url", "brotherhood_types" = excluded."brotherhood_types", "current_procession_day" = excluded."current_procession_day", "history_text" = excluded."history_text", "notes" = excluded."notes";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('4167b536-0cf4-42b5-81eb-8169bc724464', 'image', 'María Santísima en su Soledad', 'maria-santisima-soledad-san-lorenzo-sevilla', 'Dolorosa de vestir de cronología anterior a 1568 y autoría anónima.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."images" ("entity_id", "image_type", "execution_date_text", "current_condition", "description", "is_dress_image")
values ('4167b536-0cf4-42b5-81eb-8169bc724464', 'Dolorosa de vestir', 'Anterior a 1568', 'extant', 'Imagen de vestir de 163 cm que representa a la Virgen sola al pie de la Cruz.', true) on conflict ("entity_id") do update set "image_type" = excluded."image_type", "execution_date_text" = excluded."execution_date_text", "current_condition" = excluded."current_condition", "description" = excluded."description", "is_dress_image" = excluded."is_dress_image";

insert into public."brotherhood_images" ("id", "brotherhood_entity_id", "image_entity_id", "relation_type", "notes", "status")
values ('c9a7db2a-4388-483e-8cc3-f29b1ad6336a', '1e85ab84-d074-49be-803c-b26201b20561', '4167b536-0cf4-42b5-81eb-8169bc724464', 'titular', 'Titular vigente documentado.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_authorships" ("id", "image_entity_id", "agent_entity_id", "authorship_type", "role_name", "date_from_text", "certainty", "notes", "status")
values ('bd725ffa-b10a-4417-bdfc-6444d4d3c126', '4167b536-0cf4-42b5-81eb-8169bc724464', null, 'anonymous', 'escultor', 'Anterior a 1568', 'unknown', 'La fuente oficial conserva la cronología antigua sin identificar autor.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "agent_entity_id" = excluded."agent_entity_id", "authorship_type" = excluded."authorship_type", "role_name" = excluded."role_name", "date_from_text" = excluded."date_from_text", "certainty" = excluded."certainty", "notes" = excluded."notes", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('c9147978-255d-49c6-acf6-c79b532fd7c5', 'step', 'Paso de María Santísima en su Soledad', 'paso-maria-santisima-soledad-san-lorenzo', 'Paso neobarroco tallado y dorado estrenado en 1951.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."steps" ("entity_id", "step_type", "current_condition", "execution_date_text", "materials", "style", "description")
values ('c9147978-255d-49c6-acf6-c79b532fd7c5', 'Paso de Virgen', 'preserved', '1951', 'Madera tallada y dorada', 'Neobarroco', 'Concebido por Santiago Martínez Martín y plasmado por Francisco Ruiz Rodríguez, con un programa de azucenas e iconografía bíblica.') on conflict ("entity_id") do update set "step_type" = excluded."step_type", "current_condition" = excluded."current_condition", "execution_date_text" = excluded."execution_date_text", "materials" = excluded."materials", "style" = excluded."style", "description" = excluded."description";

insert into public."brotherhood_steps" ("id", "brotherhood_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('504e9c87-ec5f-49f9-b191-84566cd5acfb', '1e85ab84-d074-49be-803c-b26201b20561', 'c9147978-255d-49c6-acf6-c79b532fd7c5', 'current', 'Paso procesional vigente.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_steps" ("id", "image_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('33fc5f4d-240f-4df3-8510-097fb88bc593', '4167b536-0cf4-42b5-81eb-8169bc724464', 'c9147978-255d-49c6-acf6-c79b532fd7c5', 'processional', 'Imagen principal del paso.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."cults" ("id", "brotherhood_entity_id", "image_entity_id", "place_id", "status", "is_recurring", "cult_type", "title", "month", "date_rule", "recurrence_label", "display_order", "description")
values ('549d5f4d-49f1-490a-ba33-c95f2d5836bb', '1e85ab84-d074-49be-803c-b26201b20561', '4167b536-0cf4-42b5-81eb-8169bc724464', '49c5d3af-b1ef-482d-b93c-d5991027958b', 'published', true, 'Quinario', 'Solemne Quinario a María Santísima en su Soledad', null, 'Semana previa al primer Domingo de Cuaresma', 'Anual', 1, 'Quinario cuaresmal anual a la titular.') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "place_id" = excluded."place_id", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "cult_type" = excluded."cult_type", "title" = excluded."title", "month" = excluded."month", "date_rule" = excluded."date_rule", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order", "description" = excluded."description";

insert into public."cult_entities" ("id", "cult_id", "entity_id", "role", "notes")
values ('e61b90fc-5c60-493a-86bd-fa6b66ccec58', '549d5f4d-49f1-490a-ba33-c95f2d5836bb', '4167b536-0cf4-42b5-81eb-8169bc724464', 'honoree', 'Titular al que se dedica el culto.') on conflict ("id") do update set "cult_id" = excluded."cult_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "cult_id")
values ('42b10b92-1257-4af5-9f0c-8035ecea753a', 'f799a2e8-8f4b-4332-af9b-95bc1d2290cc', '549d5f4d-49f1-490a-ba33-c95f2d5836bb') on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id";

insert into public."cults" ("id", "brotherhood_entity_id", "image_entity_id", "place_id", "status", "is_recurring", "cult_type", "title", "month", "date_rule", "recurrence_label", "display_order", "description")
values ('31a95185-6f7a-490f-baf3-b5d0f88afe1e', '1e85ab84-d074-49be-803c-b26201b20561', '4167b536-0cf4-42b5-81eb-8169bc724464', '49c5d3af-b1ef-482d-b93c-d5991027958b', 'published', true, 'Función Principal', 'Función Principal de Instituto', null, 'Primer Domingo de Cuaresma', 'Anual', 2, 'Principal culto corporativo anual.') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "place_id" = excluded."place_id", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "cult_type" = excluded."cult_type", "title" = excluded."title", "month" = excluded."month", "date_rule" = excluded."date_rule", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order", "description" = excluded."description";

insert into public."cult_entities" ("id", "cult_id", "entity_id", "role", "notes")
values ('dfca9083-26fc-426f-9be0-25313961334a', '31a95185-6f7a-490f-baf3-b5d0f88afe1e', '4167b536-0cf4-42b5-81eb-8169bc724464', 'honoree', 'Titular al que se dedica el culto.') on conflict ("id") do update set "cult_id" = excluded."cult_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "cult_id")
values ('81a3e818-6963-485e-a52a-4dd213e0e3d5', 'f799a2e8-8f4b-4332-af9b-95bc1d2290cc', '31a95185-6f7a-490f-baf3-b5d0f88afe1e') on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id";

insert into public."cults" ("id", "brotherhood_entity_id", "image_entity_id", "place_id", "status", "is_recurring", "cult_type", "title", "month", "date_rule", "recurrence_label", "display_order", "description")
values ('217b687a-7db0-4395-90ff-d9c2ac848245', '1e85ab84-d074-49be-803c-b26201b20561', '4167b536-0cf4-42b5-81eb-8169bc724464', '49c5d3af-b1ef-482d-b93c-d5991027958b', 'published', true, 'Besamanos', 'Solemne Besamanos a María Santísima en su Soledad', null, 'Último viernes antes de Cuaresma y días inmediatos', 'Anual', 3, 'Veneración anual a la titular mariana.') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "place_id" = excluded."place_id", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "cult_type" = excluded."cult_type", "title" = excluded."title", "month" = excluded."month", "date_rule" = excluded."date_rule", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order", "description" = excluded."description";

insert into public."cult_entities" ("id", "cult_id", "entity_id", "role", "notes")
values ('f9317110-b0c4-4f5b-b6df-f01f3c2951f6', '217b687a-7db0-4395-90ff-d9c2ac848245', '4167b536-0cf4-42b5-81eb-8169bc724464', 'honoree', 'Titular al que se dedica el culto.') on conflict ("id") do update set "cult_id" = excluded."cult_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "cult_id")
values ('ce68cb7c-4e02-4b0a-a50e-864f22b62457', '77bd7d21-e0ef-458b-b716-1c00ce211771', '217b687a-7db0-4395-90ff-d9c2ac848245') on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id";

insert into public."outings" ("id", "brotherhood_entity_id", "outing_type", "character", "title", "outing_date", "year", "municipality_id", "origin_place_id", "destination_text", "description", "event_status", "status", "slug")
values ('e5756dde-7b46-49ad-abc9-e7f8579c8fd0', '1e85ab84-d074-49be-803c-b26201b20561', 'Estación de Penitencia', 'ordinary', 'Soledad de San Lorenzo · Estación de Penitencia 2026', '2026-04-04', 2026, 'ca85889c-21fe-4367-8477-a57656b25da4', '49c5d3af-b1ef-482d-b93c-d5991027958b', 'Santa Iglesia Catedral de Sevilla', 'Estación de penitencia del Sábado Santo con María Santísima en su Soledad.', 'held', 'published', 'soledad-san-lorenzo-estacion-penitencia-2026') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "outing_type" = excluded."outing_type", "character" = excluded."character", "title" = excluded."title", "outing_date" = excluded."outing_date", "year" = excluded."year", "municipality_id" = excluded."municipality_id", "origin_place_id" = excluded."origin_place_id", "destination_text" = excluded."destination_text", "description" = excluded."description", "event_status" = excluded."event_status", "status" = excluded."status", "slug" = excluded."slug";

insert into public."outing_entities" ("id", "outing_id", "entity_id", "role", "notes")
values ('66763d26-6f4d-4b93-bab3-de5eb55f0792', 'e5756dde-7b46-49ad-abc9-e7f8579c8fd0', '4167b536-0cf4-42b5-81eb-8169bc724464', 'processional_image', 'Titular participante en la estación de penitencia.') on conflict ("id") do update set "outing_id" = excluded."outing_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "outing_id")
values ('11bb2025-da27-434f-9c2c-dac2305ee728', '8391cba2-3071-4177-9f73-9f1e0ca53e1b', 'e5756dde-7b46-49ad-abc9-e7f8579c8fd0') on conflict ("id") do update set "source_id" = excluded."source_id", "outing_id" = excluded."outing_id";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('63ab4d3c-9bd2-4263-bfe6-db49ce1cfbca', 'event', 'Aprobación de las primeras reglas de la Soledad', 'primeras-reglas-soledad-san-lorenzo-1557', 'La cofradía quedó constituida oficialmente al aprobarse sus primeras reglas.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."events" ("entity_id", "event_type", "event_date_text", "place_id", "description", "event_category", "brotherhood_entity_id", "municipality_id", "event_status")
values ('63ab4d3c-9bd2-4263-bfe6-db49ce1cfbca', 'Hito histórico', '1557', null, 'La cofradía quedó constituida oficialmente al aprobarse sus primeras reglas.', 'historical', '1e85ab84-d074-49be-803c-b26201b20561', 'ca85889c-21fe-4367-8477-a57656b25da4', 'held') on conflict ("entity_id") do update set "event_type" = excluded."event_type", "event_date_text" = excluded."event_date_text", "place_id" = excluded."place_id", "description" = excluded."description", "event_category" = excluded."event_category", "brotherhood_entity_id" = excluded."brotherhood_entity_id", "municipality_id" = excluded."municipality_id", "event_status" = excluded."event_status";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('106efbe6-f956-4444-b815-36d982bd806f', 'a5cf9097-1482-44a3-8996-00b4b41a3a97', '63ab4d3c-9bd2-4263-bfe6-db49ce1cfbca') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('86789316-bc6b-403d-a2d7-994f257c0aa4', 'event', 'Paso de la Soledad al Sábado Santo', 'soledad-san-lorenzo-sabado-santo-1956', 'La reforma litúrgica trasladó la estación penitencial de la corporación del Viernes Santo al Sábado Santo.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."events" ("entity_id", "event_type", "event_date_text", "place_id", "description", "event_category", "brotherhood_entity_id", "municipality_id", "event_status")
values ('86789316-bc6b-403d-a2d7-994f257c0aa4', 'Hito histórico', '1956', null, 'La reforma litúrgica trasladó la estación penitencial de la corporación del Viernes Santo al Sábado Santo.', 'historical', '1e85ab84-d074-49be-803c-b26201b20561', 'ca85889c-21fe-4367-8477-a57656b25da4', 'held') on conflict ("entity_id") do update set "event_type" = excluded."event_type", "event_date_text" = excluded."event_date_text", "place_id" = excluded."place_id", "description" = excluded."description", "event_category" = excluded."event_category", "brotherhood_entity_id" = excluded."brotherhood_entity_id", "municipality_id" = excluded."municipality_id", "event_status" = excluded."event_status";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('2002e8f6-1e8d-4c84-bf28-1a9e8329042c', '8391cba2-3071-4177-9f73-9f1e0ca53e1b', '86789316-bc6b-403d-a2d7-994f257c0aa4') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('434c5fae-0d24-41e5-b89d-c0001b2e344c', 'heritage_asset', 'Azucenas e inscripción del paso de la Soledad', 'azucenas-inscripcion-paso-soledad-san-lorenzo', 'Programa ornamental e iconográfico del paso estrenado en 1951.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."heritage_assets" ("entity_id", "parent_entity_id", "asset_type", "description", "current_condition", "is_current", "display_order", "is_featured")
values ('434c5fae-0d24-41e5-b89d-c0001b2e344c', '1e85ab84-d074-49be-803c-b26201b20561', 'Programa iconográfico', 'Azucenas estofadas, capillas, evangelistas y una inscripción latina recorren el paso.', 'Conservado', true, 1, true) on conflict ("entity_id") do update set "parent_entity_id" = excluded."parent_entity_id", "asset_type" = excluded."asset_type", "description" = excluded."description", "current_condition" = excluded."current_condition", "is_current" = excluded."is_current", "display_order" = excluded."display_order", "is_featured" = excluded."is_featured";

insert into public."brotherhood_habits" ("id", "brotherhood_entity_id", "name", "tunic_description", "hood_description", "cord_description", "sort_order", "notes", "status")
values ('3bdb1996-a2e5-4724-9914-cdc4fc1e8d35', '1e85ab84-d074-49be-803c-b26201b20561', 'Hábito de la Soledad de San Lorenzo', 'Túnica blanca de cola, de sarga o lienzo.', 'Antifaz negro.', 'Escapulario y manguitos negros.', 1, 'Hábito descrito por la propia Hermandad para la estación de penitencia.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "name" = excluded."name", "tunic_description" = excluded."tunic_description", "hood_description" = excluded."hood_description", "cord_description" = excluded."cord_description", "sort_order" = excluded."sort_order", "notes" = excluded."notes", "status" = excluded."status";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('0fdda90d-3835-40a1-b468-fdc8de1cb1c7', 'c275a4ec-446b-4d05-b179-97282112ec99', '1e85ab84-d074-49be-803c-b26201b20561') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('8cd30e59-9aa3-4e41-a014-dbe40702f25e', '77bd7d21-e0ef-458b-b716-1c00ce211771', '1e85ab84-d074-49be-803c-b26201b20561') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('d410b79c-38a7-4473-9701-1d2d628f9bb0', 'a5cf9097-1482-44a3-8996-00b4b41a3a97', '1e85ab84-d074-49be-803c-b26201b20561') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('ce6ec184-15bc-4ad6-ae96-86826566071e', '0dc714e2-eef4-47c7-8500-2f9b698e84c4', '1e85ab84-d074-49be-803c-b26201b20561') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('5fe111eb-3c13-41e5-ba36-606b974972d2', 'f799a2e8-8f4b-4332-af9b-95bc1d2290cc', '1e85ab84-d074-49be-803c-b26201b20561') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('a53eb4b0-8ec9-46a9-b209-c975af29e36d', '8391cba2-3071-4177-9f73-9f1e0ca53e1b', '1e85ab84-d074-49be-803c-b26201b20561') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('a98967a6-e721-4635-82cb-d27cd4082e0f', 'a5cf9097-1482-44a3-8996-00b4b41a3a97', '4167b536-0cf4-42b5-81eb-8169bc724464') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('9fcffd28-4434-49cf-bde7-c15b0bb3ef75', '0dc714e2-eef4-47c7-8500-2f9b698e84c4', 'c9147978-255d-49c6-acf6-c79b532fd7c5') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

insert into public."source_links" ("id", "source_id", "entity_id")
values ('e2f0e0c8-2fb5-4ba2-a9ea-4ceb9bc81414', '0dc714e2-eef4-47c7-8500-2f9b698e84c4', '434c5fae-0d24-41e5-b89d-c0001b2e344c') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id";

commit;
