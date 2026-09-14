-- HC-016 · macrolote transversal: Viernes Santo de Sevilla
-- Cierra siete corporaciones; preserva La Carretería y completa las seis restantes.
-- Control de homónimos: San Isidoro penitencial no reutiliza la hermandad letífica de la Salud; Soledad de San Buenaventura conserva identidad propia.
-- Solo DML. Receta idempotente archivada fuera de la cadena estructural activa.
-- Lote gobernado c0160018-0000-4000-8000-000000000001: 270/270, 0 inválidas, 0 fallos.

begin;

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('8aeb970d-abfb-4e4c-a214-76f2d580e1e5', 'Viernes Santo 2026 · horarios y cortejos', 'https://semanasantaopendata.org/2026/dia/viernes-santo/', 'web', 'Semana Santa Open Data', '2026-09-14', 'Nómina de siete corporaciones, horarios oficiales y datos de cortejo de 2026.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('a1d2681a-b4da-474f-ad7c-e705d75f3106', 'El Cachorro · Consejo de Hermandades', 'https://www.hermandades-de-sevilla.org/semanasanta/vs_el_cachorro.html', 'web', 'Consejo General de Hermandades y Cofradías de Sevilla', '2026-09-14', 'Identidad, sede, titulares, pasos, hábito, capataces, patrimonio y música vigente en 2026.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('4f87b643-a691-43b2-bbc9-1884940817d0', 'La O · Consejo de Hermandades', 'https://www.hermandades-de-sevilla.org/semanasanta/vs_la_o.html', 'web', 'Consejo General de Hermandades y Cofradías de Sevilla', '2026-09-14', 'Identidad, sede, titulares, pasos, hábito, capataces, patrimonio y música vigente en 2026.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('e38d2cac-3e2f-4b16-b63f-03f0d634e480', 'San Isidoro · Consejo de Hermandades', 'https://www.hermandades-de-sevilla.org/semanasanta/vs_san_isidoro.html', 'web', 'Consejo General de Hermandades y Cofradías de Sevilla', '2026-09-14', 'Identidad, sede, titulares, pasos, hábito, capataces, patrimonio y música vigente en 2026.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('03cb59b6-b279-4024-a0ac-03450f081439', 'Montserrat · Consejo de Hermandades', 'https://www.hermandades-de-sevilla.org/semanasanta/vs_montserrat.html', 'web', 'Consejo General de Hermandades y Cofradías de Sevilla', '2026-09-14', 'Identidad, sede, titulares, pasos, hábito, capataces, patrimonio y música vigente en 2026.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('ae69bba1-f8f9-4bf2-ad71-cdc7c71a17ab', 'La Sagrada Mortaja · Consejo de Hermandades', 'https://www.hermandades-de-sevilla.org/semanasanta/vs_la_mortaja.html', 'web', 'Consejo General de Hermandades y Cofradías de Sevilla', '2026-09-14', 'Identidad, sede, titulares, pasos, hábito, capataces, patrimonio y música vigente en 2026.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('ba7431e8-767d-4f70-a840-f6a1e9cc61d2', 'Soledad de San Buenaventura · Consejo de Hermandades', 'https://www.hermandades-de-sevilla.org/semanasanta/vs_la_soledad.html', 'web', 'Consejo General de Hermandades y Cofradías de Sevilla', '2026-09-14', 'Identidad, sede, titulares, pasos, hábito, capataces, patrimonio y música vigente en 2026.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('9404c926-b7cb-4fec-ba2b-630ff8e49b0d', 'Web oficial · Hermandad del Cachorro', 'https://hermandaddelcachorro.org/', 'web', 'Hermandad del Cachorro', '2026-09-14', 'Cultos e identidad institucional.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('3df1c256-04a0-4ce5-8b70-52581e72a80b', 'Web oficial · Hermandad de La O', 'https://hermandaddelao.es/', 'web', 'Hermandad de La O', '2026-09-14', 'Cultos e identidad institucional.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('91c6e755-ddb7-45af-a973-68f35eacb038', 'Web oficial · Hermandad de San Isidoro', 'https://trescaidas.org/', 'web', 'Hermandad de las Tres Caídas de San Isidoro', '2026-09-14', 'Cultos e identidad institucional.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('04bfcdbb-5749-4e57-88d0-6d095555ac91', 'Web oficial · Hermandad de Montserrat', 'https://www.montserratsevilla.com/', 'web', 'Hermandad de Montserrat', '2026-09-14', 'Cultos e identidad institucional.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('d48e77e7-f907-4e86-8793-fd5bbc016d33', 'Web oficial · Hermandad de la Sagrada Mortaja', 'https://nueva.hermandadsagradamortaja.org/', 'web', 'Hermandad de la Sagrada Mortaja', '2026-09-14', 'Cultos e identidad institucional.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('45d3750e-edae-4060-aef0-06bd61f9b04c', 'Web oficial · Soledad de San Buenaventura', 'https://soledadsanbuenaventura.com/', 'web', 'Hermandad de la Soledad de San Buenaventura', '2026-09-14', 'Cultos e identidad institucional.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."places" ("id", "municipality_id", "name", "slug", "place_type", "address", "notes")
values ('d3d961bb-2bca-409c-8b91-f30f04c02fc2', 'ca85889c-21fe-4367-8477-a57656b25da4', 'Parroquia de San Isidoro', 'parroquia-san-isidoro-sevilla', 'Parroquia', 'Calle Luchana, Sevilla', 'Sede canónica de la Hermandad de las Tres Caídas de San Isidoro.') on conflict ("id") do update set "municipality_id" = excluded."municipality_id", "name" = excluded."name", "slug" = excluded."slug", "place_type" = excluded."place_type", "address" = excluded."address", "notes" = excluded."notes";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('ac1089c3-868d-4111-bc77-0359344aa182', 'image', 'Nuestro Padre Jesús Nazareno', 'nuestro-padre-jesus-nazareno-la-o-sevilla', 'Titular cristífero de La O, obra de Pedro Roldán de 1685.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('d7a584cb-84c5-4fed-b019-8b1f8041d837', 'image', 'María Santísima de la O Coronada', 'maria-santisima-o-coronada-sevilla', 'Dolorosa de Antonio Castillo Lastrucci realizada en 1937.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('33f9a00f-1bd0-42f9-8ff8-d62985e6c9ee', 'image', 'Nuestro Padre Jesús de las Tres Caídas', 'nuestro-padre-jesus-tres-caidas-san-isidoro-sevilla', 'Titular cristífero de San Isidoro, obra de Alonso Martínez.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('dc09ff6a-e28a-4018-9963-a124a2ea1bdc', 'image', 'Nuestra Señora de Loreto', 'nuestra-senora-loreto-san-isidoro-sevilla', 'Dolorosa titular de la Hermandad de San Isidoro.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('aee4e57a-9942-4428-9ce6-42974802266e', 'image', 'Nuestra Señora de Montserrat', 'nuestra-senora-montserrat-sevilla', 'Dolorosa titular de la Hermandad de Montserrat.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('6a4097f7-3c02-414c-a337-c70d085d4dc8', 'image', 'Nuestra Señora de la Soledad', 'nuestra-senora-soledad-san-buenaventura-sevilla', 'Dolorosa de Gabriel de Astorga, bendecida en 1851.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('6599fbfe-aad9-45fc-a348-e9f2813fed94', 'image', 'Santísimo Cristo de la Salvación', 'santisimo-cristo-salvacion-san-buenaventura-sevilla', 'Crucificado titular de Manuel Cerquera, 1935, que no participa en la estación penitencial.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('851d3baf-9533-4550-8bea-99a7e6e1473f', 'image', 'Santa Cruz en el Monte Calvario', 'santa-cruz-monte-calvario-san-buenaventura-sevilla', 'Titular fundacional de la Hermandad de la Soledad de San Buenaventura.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."images" ("entity_id", "image_type", "execution_date_text", "current_condition", "description", "is_dress_image")
values ('ac1089c3-868d-4111-bc77-0359344aa182', 'Cristo · Nazareno', '1685', 'extant', 'Obra atribuida o documentada de Pedro Roldán.', false) on conflict ("entity_id") do update set "image_type" = excluded."image_type", "execution_date_text" = excluded."execution_date_text", "current_condition" = excluded."current_condition", "description" = excluded."description", "is_dress_image" = excluded."is_dress_image";

insert into public."images" ("entity_id", "image_type", "execution_date_text", "current_condition", "description", "is_dress_image")
values ('d7a584cb-84c5-4fed-b019-8b1f8041d837', 'Dolorosa', '1937', 'extant', 'Obra atribuida o documentada de Antonio Castillo Lastrucci.', true) on conflict ("entity_id") do update set "image_type" = excluded."image_type", "execution_date_text" = excluded."execution_date_text", "current_condition" = excluded."current_condition", "description" = excluded."description", "is_dress_image" = excluded."is_dress_image";

insert into public."images" ("entity_id", "image_type", "execution_date_text", "current_condition", "description", "is_dress_image")
values ('33f9a00f-1bd0-42f9-8ff8-d62985e6c9ee', 'Cristo · Nazareno', 'Siglo XVII', 'extant', 'Obra atribuida o documentada de Alonso Martínez.', false) on conflict ("entity_id") do update set "image_type" = excluded."image_type", "execution_date_text" = excluded."execution_date_text", "current_condition" = excluded."current_condition", "description" = excluded."description", "is_dress_image" = excluded."is_dress_image";

insert into public."images" ("entity_id", "image_type", "execution_date_text", "current_condition", "description", "is_dress_image")
values ('dc09ff6a-e28a-4018-9963-a124a2ea1bdc', 'Dolorosa', 'Cronología histórica', 'extant', 'Autoría o cronología no cerrada más allá de la fuente institucional.', true) on conflict ("entity_id") do update set "image_type" = excluded."image_type", "execution_date_text" = excluded."execution_date_text", "current_condition" = excluded."current_condition", "description" = excluded."description", "is_dress_image" = excluded."is_dress_image";

insert into public."images" ("entity_id", "image_type", "execution_date_text", "current_condition", "description", "is_dress_image")
values ('aee4e57a-9942-4428-9ce6-42974802266e', 'Dolorosa', 'Siglo XVII', 'extant', 'Autoría o cronología no cerrada más allá de la fuente institucional.', true) on conflict ("entity_id") do update set "image_type" = excluded."image_type", "execution_date_text" = excluded."execution_date_text", "current_condition" = excluded."current_condition", "description" = excluded."description", "is_dress_image" = excluded."is_dress_image";

insert into public."images" ("entity_id", "image_type", "execution_date_text", "current_condition", "description", "is_dress_image")
values ('6a4097f7-3c02-414c-a337-c70d085d4dc8', 'Dolorosa', '1851', 'extant', 'Obra atribuida o documentada de Gabriel de Astorga.', true) on conflict ("entity_id") do update set "image_type" = excluded."image_type", "execution_date_text" = excluded."execution_date_text", "current_condition" = excluded."current_condition", "description" = excluded."description", "is_dress_image" = excluded."is_dress_image";

insert into public."images" ("entity_id", "image_type", "execution_date_text", "current_condition", "description", "is_dress_image")
values ('6599fbfe-aad9-45fc-a348-e9f2813fed94', 'Cristo crucificado', '1935', 'extant', 'Obra atribuida o documentada de Manuel Cerquera.', false) on conflict ("entity_id") do update set "image_type" = excluded."image_type", "execution_date_text" = excluded."execution_date_text", "current_condition" = excluded."current_condition", "description" = excluded."description", "is_dress_image" = excluded."is_dress_image";

insert into public."images" ("entity_id", "image_type", "execution_date_text", "current_condition", "description", "is_dress_image")
values ('851d3baf-9533-4550-8bea-99a7e6e1473f', 'Santa Cruz', 'Devoción fundacional', 'extant', 'Autoría o cronología no cerrada más allá de la fuente institucional.', false) on conflict ("entity_id") do update set "image_type" = excluded."image_type", "execution_date_text" = excluded."execution_date_text", "current_condition" = excluded."current_condition", "description" = excluded."description", "is_dress_image" = excluded."is_dress_image";

update public."entities" set "status" = 'published' where "id" = '0f2b156d-5f44-4cbf-aec1-fc4741e0839a';

insert into public."images" ("entity_id", "image_type", "execution_date_text", "current_condition", "description", "is_dress_image")
values ('0f2b156d-5f44-4cbf-aec1-fc4741e0839a', 'Cristo crucificado', '1619–1620', 'extant', 'Crucificado de Juan de Mesa, restaurado por Gabriel de Astorga en 1851 y por José Rodríguez Rivero-Carrera en 1982.', false) on conflict ("entity_id") do update set "image_type" = excluded."image_type", "execution_date_text" = excluded."execution_date_text", "current_condition" = excluded."current_condition", "description" = excluded."description", "is_dress_image" = excluded."is_dress_image";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('1dc264d9-5de4-4453-b51d-2c8dda14a8e0', 'step', 'Paso de Nuestro Padre Jesús de las Tres Caídas', 'paso-jesus-tres-caidas-san-isidoro-sevilla', 'Paso dorado de Francisco Ruiz Rodríguez para el Señor de las Tres Caídas.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('b60f5722-a03a-43b1-97e6-0d5714baefb5', 'step', 'Paso de palio de Nuestra Señora de Loreto', 'paso-palio-loreto-san-isidoro-sevilla', 'Paso de palio de orfebrería dorada y bordados inspirados en un paño persa.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('3972a543-2024-412d-a022-b4f0b2f996cd', 'step', 'Paso del Santísimo Cristo de la Conversión', 'paso-cristo-conversion-montserrat-sevilla', 'Paso de misterio del Cristo de la Conversión con los ladrones y Santa María Magdalena.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('1918582d-ac0e-4b2e-b099-a9746fd34635', 'step', 'Paso de Nuestra Señora de la Soledad', 'paso-soledad-san-buenaventura-sevilla', 'Paso neorrenacentista en caoba y plata diseñado por Emilio García Armenta y tallado por Guzmán Bejarano.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

update public."entities" set "status" = 'published' where "id" = '7cb8d395-7a91-48e0-bd80-0f66b2793695';

insert into public."steps" ("entity_id", "step_type", "execution_date_text", "style", "description", "current_condition")
values ('7cb8d395-7a91-48e0-bd80-0f66b2793695', 'Nazareno', '1976–1977', 'Neobarroco dorado', 'Paso de José Martínez Martínez con esculturas de Rafael Barbero.', 'preserved') on conflict ("entity_id") do update set "step_type" = excluded."step_type", "execution_date_text" = excluded."execution_date_text", "style" = excluded."style", "description" = excluded."description", "current_condition" = excluded."current_condition";

update public."entities" set "status" = 'published' where "id" = '014a5236-0fb4-49ef-9b5c-55a544adc0d3';

insert into public."steps" ("entity_id", "step_type", "execution_date_text", "style", "description", "current_condition")
values ('014a5236-0fb4-49ef-9b5c-55a544adc0d3', 'Palio', 'Siglo XX', 'Regionalista', 'Conjunto bordado de Guillermo Carrasquilla y orfebrería de Francisco Bautista.', 'preserved') on conflict ("entity_id") do update set "step_type" = excluded."step_type", "execution_date_text" = excluded."execution_date_text", "style" = excluded."style", "description" = excluded."description", "current_condition" = excluded."current_condition";

update public."entities" set "status" = 'published' where "id" = '1dc264d9-5de4-4453-b51d-2c8dda14a8e0';

insert into public."steps" ("entity_id", "step_type", "execution_date_text", "style", "description", "current_condition")
values ('1dc264d9-5de4-4453-b51d-2c8dda14a8e0', 'Nazareno', '1941', 'Neobarroco dorado', 'Paso de Francisco Ruiz Rodríguez, Curro el Dorador.', 'preserved') on conflict ("entity_id") do update set "step_type" = excluded."step_type", "execution_date_text" = excluded."execution_date_text", "style" = excluded."style", "description" = excluded."description", "current_condition" = excluded."current_condition";

update public."entities" set "status" = 'published' where "id" = 'b60f5722-a03a-43b1-97e6-0d5714baefb5';

insert into public."steps" ("entity_id", "step_type", "execution_date_text", "style", "description", "current_condition")
values ('b60f5722-a03a-43b1-97e6-0d5714baefb5', 'Palio', 'Siglo XX', 'Orfebrería dorada', 'Palio y manto de tisú de inspiración persa.', 'preserved') on conflict ("entity_id") do update set "step_type" = excluded."step_type", "execution_date_text" = excluded."execution_date_text", "style" = excluded."style", "description" = excluded."description", "current_condition" = excluded."current_condition";

update public."entities" set "status" = 'published' where "id" = '3972a543-2024-412d-a022-b4f0b2f996cd';

insert into public."steps" ("entity_id", "step_type", "execution_date_text", "style", "description", "current_condition")
values ('3972a543-2024-412d-a022-b4f0b2f996cd', 'Misterio', 'Siglos XIX–XX', 'Romántico', 'Misterio del Cristo de la Conversión entre San Dimas y Gestas.', 'preserved') on conflict ("entity_id") do update set "step_type" = excluded."step_type", "execution_date_text" = excluded."execution_date_text", "style" = excluded."style", "description" = excluded."description", "current_condition" = excluded."current_condition";

update public."entities" set "status" = 'published' where "id" = '90c2afd3-654b-4391-9861-b6ec9ba9898e';

insert into public."steps" ("entity_id", "step_type", "execution_date_text", "style", "description", "current_condition")
values ('90c2afd3-654b-4391-9861-b6ec9ba9898e', 'Palio', 'Siglo XIX', 'Romántico', 'Paso de palio de crestería rígida y terciopelo azul.', 'preserved') on conflict ("entity_id") do update set "step_type" = excluded."step_type", "execution_date_text" = excluded."execution_date_text", "style" = excluded."style", "description" = excluded."description", "current_condition" = excluded."current_condition";

update public."entities" set "status" = 'published' where "id" = '1918582d-ac0e-4b2e-b099-a9746fd34635';

insert into public."steps" ("entity_id", "step_type", "execution_date_text", "style", "description", "current_condition")
values ('1918582d-ac0e-4b2e-b099-a9746fd34635', 'Paso alegórico', '1957–1992', 'Neorrenacentista', 'Paso de caoba y plata con la Virgen al pie de la cruz.', 'preserved') on conflict ("entity_id") do update set "step_type" = excluded."step_type", "execution_date_text" = excluded."execution_date_text", "style" = excluded."style", "description" = excluded."description", "current_condition" = excluded."current_condition";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('fca6ffda-bf99-436d-9a04-6de87d764670', 'brotherhood', 'Hermandad del Cachorro', 'hermandad-del-cachorro', 'Hermandad de Sevilla que realiza estación de penitencia el Viernes Santo.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

update public."brotherhoods" set "current_procession_day" = 'Viernes Santo', "notes" = 'Ficha cerrada en el macrolote Viernes Santo HC-016 de 2026.' where "entity_id" = 'fca6ffda-bf99-436d-9a04-6de87d764670';

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('b81825e2-052d-485f-a77c-91234c079442', 'a1d2681a-b4da-474f-ad7c-e705d75f3106', 'fca6ffda-bf99-436d-9a04-6de87d764670', 'Identidad, sede, titulares y patrimonio') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('7e0c4038-0365-42da-a086-5ecb2a63f48f', '9404c926-b7cb-4fec-ba2b-630ff8e49b0d', 'fca6ffda-bf99-436d-9a04-6de87d764670', 'Identidad institucional y cultos') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."brotherhood_images" ("id", "brotherhood_entity_id", "image_entity_id", "relation_type", "notes", "status")
values ('ec160000-0000-4000-8000-000000000001', 'fca6ffda-bf99-436d-9a04-6de87d764670', '68cf0ffb-0497-4365-9ab0-1fdcf3dabf94', 'titular', 'Titular de la corporación.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."brotherhood_images" ("id", "brotherhood_entity_id", "image_entity_id", "relation_type", "notes", "status")
values ('ec160000-0000-4000-8000-000000000002', 'fca6ffda-bf99-436d-9a04-6de87d764670', 'dd65020c-8232-486e-b802-c2b5c7bde277', 'titular', 'Titular de la corporación.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."brotherhood_steps" ("id", "brotherhood_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('da662e1a-9b2b-47fa-b58e-82f0b03f180f', 'fca6ffda-bf99-436d-9a04-6de87d764670', 'c127626e-2015-4d8d-b657-7a658ff0ea19', 'processional', 'Paso canónico 1 de la estación de penitencia.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."brotherhood_steps" ("id", "brotherhood_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('d97a05ad-708b-413c-817f-d605e6b420ab', 'fca6ffda-bf99-436d-9a04-6de87d764670', '2814d4d4-5adf-4d07-982f-2c7772802a6d', 'processional', 'Paso canónico 2 de la estación de penitencia.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_steps" ("id", "image_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('6978634d-864f-485f-95f4-0064838482ee', '68cf0ffb-0497-4365-9ab0-1fdcf3dabf94', 'c127626e-2015-4d8d-b657-7a658ff0ea19', 'processional', 'Relación canónica del cortejo del Viernes Santo.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_steps" ("id", "image_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('a4895ec2-c5b8-46aa-9456-0ab04bb40744', 'dd65020c-8232-486e-b802-c2b5c7bde277', '2814d4d4-5adf-4d07-982f-2c7772802a6d', 'processional', 'Relación canónica del cortejo del Viernes Santo.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('4c081ece-34bf-4747-8745-15ee3728b067', 'heritage_asset', 'Paso del Santísimo Cristo de la Expiración', 'cachorro-paso-del-santisimo-cristo-de-la-expiracion', 'Andas neobarrocas de Guzmán Bejarano, 1974.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."heritage_assets" ("entity_id", "parent_entity_id", "asset_type", "description", "current_condition", "is_current", "display_order", "is_featured")
values ('4c081ece-34bf-4747-8745-15ee3728b067', 'fca6ffda-bf99-436d-9a04-6de87d764670', 'Paso procesional', 'Andas neobarrocas de Guzmán Bejarano, 1974.', 'Conservado', true, 1, true) on conflict ("entity_id") do update set "parent_entity_id" = excluded."parent_entity_id", "asset_type" = excluded."asset_type", "description" = excluded."description", "current_condition" = excluded."current_condition", "is_current" = excluded."is_current", "display_order" = excluded."display_order", "is_featured" = excluded."is_featured";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('2f0d0611-0a5f-49ca-81fb-68897822121d', 'a1d2681a-b4da-474f-ad7c-e705d75f3106', '4c081ece-34bf-4747-8745-15ee3728b067', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('70f9fa64-f0ef-4f6c-99b1-1dd5f8f74c00', 'heritage_asset', 'Conjunto de palio del Patrocinio', 'cachorro-conjunto-de-palio-del-patrocinio', 'Palio de malla y bordados históricos de la corporación.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."heritage_assets" ("entity_id", "parent_entity_id", "asset_type", "description", "current_condition", "is_current", "display_order", "is_featured")
values ('70f9fa64-f0ef-4f6c-99b1-1dd5f8f74c00', 'fca6ffda-bf99-436d-9a04-6de87d764670', 'Bordado y orfebrería', 'Palio de malla y bordados históricos de la corporación.', 'Conservado', true, 2, false) on conflict ("entity_id") do update set "parent_entity_id" = excluded."parent_entity_id", "asset_type" = excluded."asset_type", "description" = excluded."description", "current_condition" = excluded."current_condition", "is_current" = excluded."is_current", "display_order" = excluded."display_order", "is_featured" = excluded."is_featured";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('8c066267-d202-4f0e-a5a4-e7e3e69da333', 'a1d2681a-b4da-474f-ad7c-e705d75f3106', '70f9fa64-f0ef-4f6c-99b1-1dd5f8f74c00', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('bc6499a3-da66-4ca0-8a3c-7be4526a9eca', 'event', 'Dedicación de la Basílica del Cachorro', 'dedicacion-basilica-cachorro-1999', 'El templo fue dedicado al Santísimo Cristo de la Expiración.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."events" ("entity_id", "event_type", "event_date_text", "description", "event_category", "brotherhood_entity_id", "municipality_id", "event_status")
values ('bc6499a3-da66-4ca0-8a3c-7be4526a9eca', 'Hito histórico', '15 de diciembre de 1999', 'El templo fue dedicado al Santísimo Cristo de la Expiración.', 'historical', 'fca6ffda-bf99-436d-9a04-6de87d764670', 'ca85889c-21fe-4367-8477-a57656b25da4', 'held') on conflict ("entity_id") do update set "event_type" = excluded."event_type", "event_date_text" = excluded."event_date_text", "description" = excluded."description", "event_category" = excluded."event_category", "brotherhood_entity_id" = excluded."brotherhood_entity_id", "municipality_id" = excluded."municipality_id", "event_status" = excluded."event_status";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('82eaebb7-e664-4700-8b29-b71da857ff2b', 'a1d2681a-b4da-474f-ad7c-e705d75f3106', 'bc6499a3-da66-4ca0-8a3c-7be4526a9eca', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."brotherhood_habits" ("id", "brotherhood_entity_id", "name", "tunic_description", "hood_description", "cord_description", "sort_order", "notes", "status")
values ('79e192c4-a270-4b7e-ae2a-1845807a2fbb', 'fca6ffda-bf99-436d-9a04-6de87d764670', 'Hábito del Cachorro', 'Túnica negra y capa color marfil.', 'Antifaz negro.', 'Cordón blanco.', 1, 'Hábito penitencial documentado por el Consejo.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "name" = excluded."name", "tunic_description" = excluded."tunic_description", "hood_description" = excluded."hood_description", "cord_description" = excluded."cord_description", "sort_order" = excluded."sort_order", "notes" = excluded."notes", "status" = excluded."status";

insert into public."source_links" ("id", "source_id", "brotherhood_habit_id", "scope")
values ('29ecab35-b1ee-4e91-bbc0-1f1ab3d1f194', 'a1d2681a-b4da-474f-ad7c-e705d75f3106', '79e192c4-a270-4b7e-ae2a-1845807a2fbb', null) on conflict ("id") do update set "source_id" = excluded."source_id", "brotherhood_habit_id" = excluded."brotherhood_habit_id", "scope" = excluded."scope";

insert into public."outings" ("id", "brotherhood_entity_id", "outing_type", "character", "title", "outing_date", "year", "departure_time", "return_time", "municipality_id", "origin_place_id", "destination_text", "route_summary", "description", "event_status", "status", "slug")
values ('e470e9b0-82e8-4530-8e03-24da8355b8a0', 'fca6ffda-bf99-436d-9a04-6de87d764670', 'Estación de Penitencia', 'ordinary', 'Hermandad del Cachorro · Estación de Penitencia 2026', '2026-04-03', 2026, '15:35', '02:35', 'ca85889c-21fe-4367-8477-a57656b25da4', '12d45ff5-1430-41a6-bb32-da49af8ca62a', 'Santa Iglesia Catedral de Sevilla', 'Itinerario oficial del Viernes Santo de 2026 con tránsito por la Carrera Oficial.', 'Estación de penitencia celebrada el Viernes Santo de 2026.', 'held', 'published', 'cachorro-estacion-penitencia-2026') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "outing_type" = excluded."outing_type", "character" = excluded."character", "title" = excluded."title", "outing_date" = excluded."outing_date", "year" = excluded."year", "departure_time" = excluded."departure_time", "return_time" = excluded."return_time", "municipality_id" = excluded."municipality_id", "origin_place_id" = excluded."origin_place_id", "destination_text" = excluded."destination_text", "route_summary" = excluded."route_summary", "description" = excluded."description", "event_status" = excluded."event_status", "status" = excluded."status", "slug" = excluded."slug";

insert into public."outing_entities" ("id", "outing_id", "entity_id", "role", "notes")
values ('00fce380-465a-48d3-a88b-2d54bf2f8b02', 'e470e9b0-82e8-4530-8e03-24da8355b8a0', '68cf0ffb-0497-4365-9ab0-1fdcf3dabf94', 'processional_image', 'Imagen participante en el cortejo de 2026.') on conflict ("id") do update set "outing_id" = excluded."outing_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."outing_entities" ("id", "outing_id", "entity_id", "role", "notes")
values ('22c012c4-4a4c-4434-bb12-001a32725c21', 'e470e9b0-82e8-4530-8e03-24da8355b8a0', 'dd65020c-8232-486e-b802-c2b5c7bde277', 'processional_image', 'Imagen participante en el cortejo de 2026.') on conflict ("id") do update set "outing_id" = excluded."outing_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "outing_id", "scope")
values ('3881deff-f240-4d55-90f3-6c6fa1e84908', '8aeb970d-abfb-4e4c-a214-76f2d580e1e5', 'e470e9b0-82e8-4530-8e03-24da8355b8a0', null) on conflict ("id") do update set "source_id" = excluded."source_id", "outing_id" = excluded."outing_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "outing_id", "scope")
values ('b4279a62-a4f5-4c87-ba5b-56159d458b91', 'a1d2681a-b4da-474f-ad7c-e705d75f3106', 'e470e9b0-82e8-4530-8e03-24da8355b8a0', null) on conflict ("id") do update set "source_id" = excluded."source_id", "outing_id" = excluded."outing_id", "scope" = excluded."scope";

insert into public."accompaniments" ("id", "outing_id", "band_entity_id", "step_entity_id", "position", "year", "notes", "status")
values ('10ef27cc-0b44-4984-ac1b-b7b781473ee1', 'e470e9b0-82e8-4530-8e03-24da8355b8a0', 'da951f85-de4c-48a4-bd97-b8c9f835d9b4', 'c127626e-2015-4d8d-b657-7a658ff0ea19', 'Tras el paso del Cristo', 2026, 'Acompañamiento vigente y documentado para 2026.', 'published') on conflict ("id") do update set "outing_id" = excluded."outing_id", "band_entity_id" = excluded."band_entity_id", "step_entity_id" = excluded."step_entity_id", "position" = excluded."position", "year" = excluded."year", "notes" = excluded."notes", "status" = excluded."status";

insert into public."music_accompaniment_periods" ("id", "brotherhood_entity_id", "band_entity_id", "step_entity_id", "position", "outing_type", "date_from_text", "year_from", "is_current", "notes", "public_brotherhood_name", "public_step_name", "public_brotherhood_slug", "public_municipality_name", "public_municipality_slug", "public_province", "status")
values ('3ff2970c-534b-4b5c-b803-d7b99c99cfa3', 'fca6ffda-bf99-436d-9a04-6de87d764670', 'da951f85-de4c-48a4-bd97-b8c9f835d9b4', 'c127626e-2015-4d8d-b657-7a658ff0ea19', 'Tras el paso del Cristo', 'Viernes Santo', 'Vigente en 2026', null, true, 'Vigencia constatada para 2026; no presupone continuidad posterior.', 'Hermandad del Cachorro', 'Tras el paso del Cristo', 'hermandad-del-cachorro', 'Sevilla', 'sevilla', 'Sevilla', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "band_entity_id" = excluded."band_entity_id", "step_entity_id" = excluded."step_entity_id", "position" = excluded."position", "outing_type" = excluded."outing_type", "date_from_text" = excluded."date_from_text", "year_from" = excluded."year_from", "is_current" = excluded."is_current", "notes" = excluded."notes", "public_brotherhood_name" = excluded."public_brotherhood_name", "public_step_name" = excluded."public_step_name", "public_brotherhood_slug" = excluded."public_brotherhood_slug", "public_municipality_name" = excluded."public_municipality_name", "public_municipality_slug" = excluded."public_municipality_slug", "public_province" = excluded."public_province", "status" = excluded."status";

insert into public."source_links" ("id", "source_id", "music_accompaniment_period_id", "scope")
values ('a04ab9d4-8d7b-48f1-9b0b-a55331dadb62', 'a1d2681a-b4da-474f-ad7c-e705d75f3106', '3ff2970c-534b-4b5c-b803-d7b99c99cfa3', null) on conflict ("id") do update set "source_id" = excluded."source_id", "music_accompaniment_period_id" = excluded."music_accompaniment_period_id", "scope" = excluded."scope";

insert into public."accompaniments" ("id", "outing_id", "band_entity_id", "step_entity_id", "position", "year", "notes", "status")
values ('14f987bd-4df2-4311-a6dd-0d5be71522a1', 'e470e9b0-82e8-4530-8e03-24da8355b8a0', 'a2208260-0000-0000-0000-000000000041', '2814d4d4-5adf-4d07-982f-2c7772802a6d', 'Tras el paso de palio', 2026, 'Acompañamiento vigente y documentado para 2026.', 'published') on conflict ("id") do update set "outing_id" = excluded."outing_id", "band_entity_id" = excluded."band_entity_id", "step_entity_id" = excluded."step_entity_id", "position" = excluded."position", "year" = excluded."year", "notes" = excluded."notes", "status" = excluded."status";

insert into public."music_accompaniment_periods" ("id", "brotherhood_entity_id", "band_entity_id", "step_entity_id", "position", "outing_type", "date_from_text", "year_from", "is_current", "notes", "public_brotherhood_name", "public_step_name", "public_brotherhood_slug", "public_municipality_name", "public_municipality_slug", "public_province", "status")
values ('6599a0e4-5eab-4383-9943-43a99a5c277f', 'fca6ffda-bf99-436d-9a04-6de87d764670', 'a2208260-0000-0000-0000-000000000041', '2814d4d4-5adf-4d07-982f-2c7772802a6d', 'Tras el paso de palio', 'Viernes Santo', 'Vigente en 2026', null, true, 'Vigencia constatada para 2026; no presupone continuidad posterior.', 'Hermandad del Cachorro', 'Tras el paso de palio', 'hermandad-del-cachorro', 'Sevilla', 'sevilla', 'Sevilla', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "band_entity_id" = excluded."band_entity_id", "step_entity_id" = excluded."step_entity_id", "position" = excluded."position", "outing_type" = excluded."outing_type", "date_from_text" = excluded."date_from_text", "year_from" = excluded."year_from", "is_current" = excluded."is_current", "notes" = excluded."notes", "public_brotherhood_name" = excluded."public_brotherhood_name", "public_step_name" = excluded."public_step_name", "public_brotherhood_slug" = excluded."public_brotherhood_slug", "public_municipality_name" = excluded."public_municipality_name", "public_municipality_slug" = excluded."public_municipality_slug", "public_province" = excluded."public_province", "status" = excluded."status";

insert into public."source_links" ("id", "source_id", "music_accompaniment_period_id", "scope")
values ('6834e192-1632-48db-8ed4-f646407507b2', 'a1d2681a-b4da-474f-ad7c-e705d75f3106', '6599a0e4-5eab-4383-9943-43a99a5c277f', null) on conflict ("id") do update set "source_id" = excluded."source_id", "music_accompaniment_period_id" = excluded."music_accompaniment_period_id", "scope" = excluded."scope";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('75667214-b7e2-4997-8ee5-0b68bb7dfbc7', 'brotherhood', 'Hermandad de La O', 'hermandad-de-la-o', 'Hermandad de Sevilla que realiza estación de penitencia el Viernes Santo.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."brotherhoods" ("entity_id", "official_name", "popular_name", "foundation_text", "municipality_id", "canonical_see_place_id", "neighborhood", "website_url", "brotherhood_types", "current_procession_day", "history_text", "notes")
values ('75667214-b7e2-4997-8ee5-0b68bb7dfbc7', 'Pontificia, Real e Ilustre Archicofradía del Santísimo Sacramento, Nuestro Padre Jesús Nazareno y María Santísima de la O Coronada', 'La O', '1566; aprobación de las primeras Reglas penitenciales', 'ca85889c-21fe-4367-8477-a57656b25da4', '7e3c823f-7ebe-456a-9bec-65323f308a74', 'Triana', 'https://hermandaddelao.es/', ARRAY['Penitencia']::text[], 'Viernes Santo', 'La corporación procede de la antigua hermandad hospitalaria de la calle Castilla. Sus Reglas penitenciales fueron aprobadas en 1566 y en 1830 fue la primera cofradía de Triana que hizo estación a la Catedral cruzando el puente de barcas.', 'Ficha cerrada en el macrolote Viernes Santo HC-016 de 2026.') on conflict ("entity_id") do update set "official_name" = excluded."official_name", "popular_name" = excluded."popular_name", "foundation_text" = excluded."foundation_text", "municipality_id" = excluded."municipality_id", "canonical_see_place_id" = excluded."canonical_see_place_id", "neighborhood" = excluded."neighborhood", "website_url" = excluded."website_url", "brotherhood_types" = excluded."brotherhood_types", "current_procession_day" = excluded."current_procession_day", "history_text" = excluded."history_text", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('2350d3d8-63fc-4651-bf55-165fe6d1563a', '4f87b643-a691-43b2-bbc9-1884940817d0', '75667214-b7e2-4997-8ee5-0b68bb7dfbc7', 'Identidad, sede, titulares y patrimonio') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('714d6a52-63b4-434d-995c-eb2737d76bbc', '3df1c256-04a0-4ce5-8b70-52581e72a80b', '75667214-b7e2-4997-8ee5-0b68bb7dfbc7', 'Identidad institucional y cultos') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."brotherhood_images" ("id", "brotherhood_entity_id", "image_entity_id", "relation_type", "notes", "status")
values ('0779ad51-ff72-4a51-a84e-a2b9c792333e', '75667214-b7e2-4997-8ee5-0b68bb7dfbc7', 'ac1089c3-868d-4111-bc77-0359344aa182', 'titular', 'Titular de la corporación.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."brotherhood_images" ("id", "brotherhood_entity_id", "image_entity_id", "relation_type", "notes", "status")
values ('9a881fcb-7caf-4a77-a59b-440050ab91c0', '75667214-b7e2-4997-8ee5-0b68bb7dfbc7', 'd7a584cb-84c5-4fed-b019-8b1f8041d837', 'titular', 'Titular de la corporación.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."brotherhood_steps" ("id", "brotherhood_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('1a5b1ded-88bf-45e0-9e6a-1a9c18ecdbbe', '75667214-b7e2-4997-8ee5-0b68bb7dfbc7', '7cb8d395-7a91-48e0-bd80-0f66b2793695', 'processional', 'Paso canónico 1 de la estación de penitencia.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."brotherhood_steps" ("id", "brotherhood_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('c52ab905-4b0e-4918-b243-7f5e80837d76', '75667214-b7e2-4997-8ee5-0b68bb7dfbc7', '014a5236-0fb4-49ef-9b5c-55a544adc0d3', 'processional', 'Paso canónico 2 de la estación de penitencia.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_steps" ("id", "image_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('c0f987a3-c28a-41c1-9693-95992d078af3', 'ac1089c3-868d-4111-bc77-0359344aa182', '7cb8d395-7a91-48e0-bd80-0f66b2793695', 'processional', 'Relación canónica del cortejo del Viernes Santo.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_steps" ("id", "image_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('1dd751a7-c3ce-4ee0-97f8-2954a4e285fe', 'd7a584cb-84c5-4fed-b019-8b1f8041d837', '014a5236-0fb4-49ef-9b5c-55a544adc0d3', 'processional', 'Relación canónica del cortejo del Viernes Santo.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."cults" ("id", "brotherhood_entity_id", "cult_type", "title", "date_rule", "place_id", "description", "status", "is_recurring", "recurrence_label", "display_order")
values ('5c9e2396-e666-40c3-905f-563f8f3bd9dd', '75667214-b7e2-4997-8ee5-0b68bb7dfbc7', 'Quinario', 'Solemne Quinario a Nuestro Padre Jesús Nazareno', 'Cuaresma', '7e3c823f-7ebe-456a-9bec-65323f308a74', 'Culto anual documentado por la corporación.', 'published', true, 'Anual', 1) on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "cult_type" = excluded."cult_type", "title" = excluded."title", "date_rule" = excluded."date_rule", "place_id" = excluded."place_id", "description" = excluded."description", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order";

insert into public."source_links" ("id", "source_id", "cult_id", "scope")
values ('56b987aa-db3d-44d7-899c-573e033a2282', '3df1c256-04a0-4ce5-8b70-52581e72a80b', '5c9e2396-e666-40c3-905f-563f8f3bd9dd', null) on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id", "scope" = excluded."scope";

insert into public."cults" ("id", "brotherhood_entity_id", "cult_type", "title", "date_rule", "place_id", "description", "status", "is_recurring", "recurrence_label", "display_order")
values ('5e79399f-1cd9-42af-8df4-0fbf2906a20c', '75667214-b7e2-4997-8ee5-0b68bb7dfbc7', 'Función Principal', 'Función Principal de Instituto', 'Cuaresma', '7e3c823f-7ebe-456a-9bec-65323f308a74', 'Culto anual documentado por la corporación.', 'published', true, 'Anual', 2) on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "cult_type" = excluded."cult_type", "title" = excluded."title", "date_rule" = excluded."date_rule", "place_id" = excluded."place_id", "description" = excluded."description", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order";

insert into public."source_links" ("id", "source_id", "cult_id", "scope")
values ('f48a7267-5188-44f3-b5a5-2465a7f5fb14', '3df1c256-04a0-4ce5-8b70-52581e72a80b', '5e79399f-1cd9-42af-8df4-0fbf2906a20c', null) on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id", "scope" = excluded."scope";

insert into public."cults" ("id", "brotherhood_entity_id", "cult_type", "title", "date_rule", "place_id", "description", "status", "is_recurring", "recurrence_label", "display_order")
values ('7d58e1df-f21a-45f0-9f11-3d2da01b8680', '75667214-b7e2-4997-8ee5-0b68bb7dfbc7', 'Besapié', 'Besapié a Nuestro Padre Jesús Nazareno', 'Cuaresma', '7e3c823f-7ebe-456a-9bec-65323f308a74', 'Culto anual documentado por la corporación.', 'published', true, 'Anual', 3) on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "cult_type" = excluded."cult_type", "title" = excluded."title", "date_rule" = excluded."date_rule", "place_id" = excluded."place_id", "description" = excluded."description", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order";

insert into public."source_links" ("id", "source_id", "cult_id", "scope")
values ('9ae55e60-e012-4f00-9bc9-07d93f0e566f', '3df1c256-04a0-4ce5-8b70-52581e72a80b', '7d58e1df-f21a-45f0-9f11-3d2da01b8680', null) on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id", "scope" = excluded."scope";

insert into public."cults" ("id", "brotherhood_entity_id", "cult_type", "title", "date_rule", "place_id", "description", "status", "is_recurring", "recurrence_label", "display_order")
values ('2e819b4b-dbf3-438c-aaf2-2cbe4d8287ad', '75667214-b7e2-4997-8ee5-0b68bb7dfbc7', 'Triduo', 'Triduo a María Santísima de la O Coronada', 'Diciembre', '7e3c823f-7ebe-456a-9bec-65323f308a74', 'Culto anual documentado por la corporación.', 'published', true, 'Anual', 4) on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "cult_type" = excluded."cult_type", "title" = excluded."title", "date_rule" = excluded."date_rule", "place_id" = excluded."place_id", "description" = excluded."description", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order";

insert into public."source_links" ("id", "source_id", "cult_id", "scope")
values ('bf077e2f-aac3-4cd1-a8d9-1ecc5598f2ae', '3df1c256-04a0-4ce5-8b70-52581e72a80b', '2e819b4b-dbf3-438c-aaf2-2cbe4d8287ad', null) on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id", "scope" = excluded."scope";

insert into public."cults" ("id", "brotherhood_entity_id", "cult_type", "title", "date_rule", "place_id", "description", "status", "is_recurring", "recurrence_label", "display_order")
values ('1c9acf02-2f8b-4f99-8398-022e09e0170a', '75667214-b7e2-4997-8ee5-0b68bb7dfbc7', 'Besamanos', 'Besamanos a María Santísima de la O Coronada', 'Diciembre', '7e3c823f-7ebe-456a-9bec-65323f308a74', 'Culto anual documentado por la corporación.', 'published', true, 'Anual', 5) on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "cult_type" = excluded."cult_type", "title" = excluded."title", "date_rule" = excluded."date_rule", "place_id" = excluded."place_id", "description" = excluded."description", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order";

insert into public."source_links" ("id", "source_id", "cult_id", "scope")
values ('1492241b-4853-4a82-8499-54fff496e7da', '3df1c256-04a0-4ce5-8b70-52581e72a80b', '1c9acf02-2f8b-4f99-8398-022e09e0170a', null) on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id", "scope" = excluded."scope";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('247c17f3-331b-45d1-afc0-3c90e40d96a0', 'heritage_asset', 'Cruz de carey y plata de Nuestro Padre Jesús Nazareno', 'o-cruz-de-carey-y-plata-de-nuestro-padre-jesus-nazareno', 'Cruz realizada por Domingo José Balbuena en 1731.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."heritage_assets" ("entity_id", "parent_entity_id", "asset_type", "description", "current_condition", "is_current", "display_order", "is_featured")
values ('247c17f3-331b-45d1-afc0-3c90e40d96a0', '75667214-b7e2-4997-8ee5-0b68bb7dfbc7', 'Paso procesional', 'Cruz realizada por Domingo José Balbuena en 1731.', 'Conservado', true, 1, true) on conflict ("entity_id") do update set "parent_entity_id" = excluded."parent_entity_id", "asset_type" = excluded."asset_type", "description" = excluded."description", "current_condition" = excluded."current_condition", "is_current" = excluded."is_current", "display_order" = excluded."display_order", "is_featured" = excluded."is_featured";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('edf7b4c2-f869-4f96-8d2d-3b847b454ec9', '4f87b643-a691-43b2-bbc9-1884940817d0', '247c17f3-331b-45d1-afc0-3c90e40d96a0', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('0b758225-ace8-4b69-a0c2-74201c27ba64', 'heritage_asset', 'Manto de María Santísima de la O', 'o-manto-de-maria-santisima-de-la-o', 'Manto bordado por Guillermo Carrasquilla en 1936.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."heritage_assets" ("entity_id", "parent_entity_id", "asset_type", "description", "current_condition", "is_current", "display_order", "is_featured")
values ('0b758225-ace8-4b69-a0c2-74201c27ba64', '75667214-b7e2-4997-8ee5-0b68bb7dfbc7', 'Bordado', 'Manto bordado por Guillermo Carrasquilla en 1936.', 'Conservado', true, 2, false) on conflict ("entity_id") do update set "parent_entity_id" = excluded."parent_entity_id", "asset_type" = excluded."asset_type", "description" = excluded."description", "current_condition" = excluded."current_condition", "is_current" = excluded."is_current", "display_order" = excluded."display_order", "is_featured" = excluded."is_featured";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('ebc2b4ad-814e-41a1-9521-2d3fad11c384', '4f87b643-a691-43b2-bbc9-1884940817d0', '0b758225-ace8-4b69-a0c2-74201c27ba64', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('72bf5abf-d342-43c4-8754-9a35ac09c0df', 'event', 'Primera estación de Triana a la Catedral', 'primera-estacion-o-catedral-1830', 'La O fue la primera cofradía de Triana que hizo estación a la Catedral.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."events" ("entity_id", "event_type", "event_date_text", "description", "event_category", "brotherhood_entity_id", "municipality_id", "event_status")
values ('72bf5abf-d342-43c4-8754-9a35ac09c0df', 'Hito histórico', '1830', 'La O fue la primera cofradía de Triana que hizo estación a la Catedral.', 'historical', '75667214-b7e2-4997-8ee5-0b68bb7dfbc7', 'ca85889c-21fe-4367-8477-a57656b25da4', 'held') on conflict ("entity_id") do update set "event_type" = excluded."event_type", "event_date_text" = excluded."event_date_text", "description" = excluded."description", "event_category" = excluded."event_category", "brotherhood_entity_id" = excluded."brotherhood_entity_id", "municipality_id" = excluded."municipality_id", "event_status" = excluded."event_status";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('c487599c-cfa0-4787-b413-23dd3fbf53ff', '4f87b643-a691-43b2-bbc9-1884940817d0', '72bf5abf-d342-43c4-8754-9a35ac09c0df', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."brotherhood_habits" ("id", "brotherhood_entity_id", "name", "tunic_description", "hood_description", "cord_description", "sort_order", "notes", "status")
values ('66f9d595-c88d-43a7-bcf6-d9ddfa7e5528', '75667214-b7e2-4997-8ee5-0b68bb7dfbc7', 'Hábito de La O', 'Túnica de cola de raso morado romano.', 'Antifaz morado.', 'Cíngulo de seda morada y dorada.', 1, 'Hábito penitencial documentado por el Consejo.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "name" = excluded."name", "tunic_description" = excluded."tunic_description", "hood_description" = excluded."hood_description", "cord_description" = excluded."cord_description", "sort_order" = excluded."sort_order", "notes" = excluded."notes", "status" = excluded."status";

insert into public."source_links" ("id", "source_id", "brotherhood_habit_id", "scope")
values ('3c5f20d0-5e4e-4818-bc49-af9a4e2b6b71', '4f87b643-a691-43b2-bbc9-1884940817d0', '66f9d595-c88d-43a7-bcf6-d9ddfa7e5528', null) on conflict ("id") do update set "source_id" = excluded."source_id", "brotherhood_habit_id" = excluded."brotherhood_habit_id", "scope" = excluded."scope";

insert into public."outings" ("id", "brotherhood_entity_id", "outing_type", "character", "title", "outing_date", "year", "departure_time", "return_time", "municipality_id", "origin_place_id", "destination_text", "route_summary", "description", "event_status", "status", "slug")
values ('58244417-c306-4cec-9a4d-4a182f9a669e', '75667214-b7e2-4997-8ee5-0b68bb7dfbc7', 'Estación de Penitencia', 'ordinary', 'Hermandad de La O · Estación de Penitencia 2026', '2026-04-03', 2026, '18:00', '02:45', 'ca85889c-21fe-4367-8477-a57656b25da4', '7e3c823f-7ebe-456a-9bec-65323f308a74', 'Santa Iglesia Catedral de Sevilla', 'Itinerario oficial del Viernes Santo de 2026 con tránsito por la Carrera Oficial.', 'Estación de penitencia celebrada el Viernes Santo de 2026.', 'held', 'published', 'la-o-estacion-penitencia-2026') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "outing_type" = excluded."outing_type", "character" = excluded."character", "title" = excluded."title", "outing_date" = excluded."outing_date", "year" = excluded."year", "departure_time" = excluded."departure_time", "return_time" = excluded."return_time", "municipality_id" = excluded."municipality_id", "origin_place_id" = excluded."origin_place_id", "destination_text" = excluded."destination_text", "route_summary" = excluded."route_summary", "description" = excluded."description", "event_status" = excluded."event_status", "status" = excluded."status", "slug" = excluded."slug";

insert into public."outing_entities" ("id", "outing_id", "entity_id", "role", "notes")
values ('c65fa543-729c-4a57-b167-ba28c9cdb92d', '58244417-c306-4cec-9a4d-4a182f9a669e', 'ac1089c3-868d-4111-bc77-0359344aa182', 'processional_image', 'Imagen participante en el cortejo de 2026.') on conflict ("id") do update set "outing_id" = excluded."outing_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."outing_entities" ("id", "outing_id", "entity_id", "role", "notes")
values ('df964ebc-5f65-476e-9442-c4db52770b01', '58244417-c306-4cec-9a4d-4a182f9a669e', 'd7a584cb-84c5-4fed-b019-8b1f8041d837', 'processional_image', 'Imagen participante en el cortejo de 2026.') on conflict ("id") do update set "outing_id" = excluded."outing_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "outing_id", "scope")
values ('545c7c48-b2d0-4071-b15a-5d47a1bcc74b', '8aeb970d-abfb-4e4c-a214-76f2d580e1e5', '58244417-c306-4cec-9a4d-4a182f9a669e', null) on conflict ("id") do update set "source_id" = excluded."source_id", "outing_id" = excluded."outing_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "outing_id", "scope")
values ('5011d061-286d-4b7d-9a1c-b404c909a73b', '4f87b643-a691-43b2-bbc9-1884940817d0', '58244417-c306-4cec-9a4d-4a182f9a669e', null) on conflict ("id") do update set "source_id" = excluded."source_id", "outing_id" = excluded."outing_id", "scope" = excluded."scope";

insert into public."accompaniments" ("id", "outing_id", "band_entity_id", "step_entity_id", "position", "year", "notes", "status")
values ('70a46347-6783-4fd1-9625-95b85bb12689', '58244417-c306-4cec-9a4d-4a182f9a669e', '8c860cd1-11cb-4cbc-8a40-2eaec0543f8b', '7cb8d395-7a91-48e0-bd80-0f66b2793695', 'Tras Nuestro Padre Jesús Nazareno', 2026, 'Acompañamiento vigente y documentado para 2026.', 'published') on conflict ("id") do update set "outing_id" = excluded."outing_id", "band_entity_id" = excluded."band_entity_id", "step_entity_id" = excluded."step_entity_id", "position" = excluded."position", "year" = excluded."year", "notes" = excluded."notes", "status" = excluded."status";

insert into public."music_accompaniment_periods" ("id", "brotherhood_entity_id", "band_entity_id", "step_entity_id", "position", "outing_type", "date_from_text", "year_from", "is_current", "notes", "public_brotherhood_name", "public_step_name", "public_brotherhood_slug", "public_municipality_name", "public_municipality_slug", "public_province", "status")
values ('a9f76e4f-183f-4013-867c-e1e44b5459dc', '75667214-b7e2-4997-8ee5-0b68bb7dfbc7', '8c860cd1-11cb-4cbc-8a40-2eaec0543f8b', '7cb8d395-7a91-48e0-bd80-0f66b2793695', 'Tras Nuestro Padre Jesús Nazareno', 'Viernes Santo', 'Vigente en 2026', null, true, 'Vigencia constatada para 2026; no presupone continuidad posterior.', 'Hermandad de La O', 'Tras Nuestro Padre Jesús Nazareno', 'hermandad-de-la-o', 'Sevilla', 'sevilla', 'Sevilla', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "band_entity_id" = excluded."band_entity_id", "step_entity_id" = excluded."step_entity_id", "position" = excluded."position", "outing_type" = excluded."outing_type", "date_from_text" = excluded."date_from_text", "year_from" = excluded."year_from", "is_current" = excluded."is_current", "notes" = excluded."notes", "public_brotherhood_name" = excluded."public_brotherhood_name", "public_step_name" = excluded."public_step_name", "public_brotherhood_slug" = excluded."public_brotherhood_slug", "public_municipality_name" = excluded."public_municipality_name", "public_municipality_slug" = excluded."public_municipality_slug", "public_province" = excluded."public_province", "status" = excluded."status";

insert into public."source_links" ("id", "source_id", "music_accompaniment_period_id", "scope")
values ('b0ec3202-bd47-4657-a0fe-8500caf07318', '4f87b643-a691-43b2-bbc9-1884940817d0', 'a9f76e4f-183f-4013-867c-e1e44b5459dc', null) on conflict ("id") do update set "source_id" = excluded."source_id", "music_accompaniment_period_id" = excluded."music_accompaniment_period_id", "scope" = excluded."scope";

insert into public."accompaniments" ("id", "outing_id", "band_entity_id", "step_entity_id", "position", "year", "notes", "status")
values ('084147cc-f333-438c-a7a1-a415bcd790ca', '58244417-c306-4cec-9a4d-4a182f9a669e', '24e2b89a-4d72-4ea8-9144-8972cf751046', '014a5236-0fb4-49ef-9b5c-55a544adc0d3', 'Tras el paso de palio', 2026, 'Acompañamiento vigente y documentado para 2026.', 'published') on conflict ("id") do update set "outing_id" = excluded."outing_id", "band_entity_id" = excluded."band_entity_id", "step_entity_id" = excluded."step_entity_id", "position" = excluded."position", "year" = excluded."year", "notes" = excluded."notes", "status" = excluded."status";

insert into public."music_accompaniment_periods" ("id", "brotherhood_entity_id", "band_entity_id", "step_entity_id", "position", "outing_type", "date_from_text", "year_from", "is_current", "notes", "public_brotherhood_name", "public_step_name", "public_brotherhood_slug", "public_municipality_name", "public_municipality_slug", "public_province", "status")
values ('02c8210a-bc5a-4fff-b232-3fb9b502d1ea', '75667214-b7e2-4997-8ee5-0b68bb7dfbc7', '24e2b89a-4d72-4ea8-9144-8972cf751046', '014a5236-0fb4-49ef-9b5c-55a544adc0d3', 'Tras el paso de palio', 'Viernes Santo', 'Vigente en 2026', null, true, 'Vigencia constatada para 2026; no presupone continuidad posterior.', 'Hermandad de La O', 'Tras el paso de palio', 'hermandad-de-la-o', 'Sevilla', 'sevilla', 'Sevilla', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "band_entity_id" = excluded."band_entity_id", "step_entity_id" = excluded."step_entity_id", "position" = excluded."position", "outing_type" = excluded."outing_type", "date_from_text" = excluded."date_from_text", "year_from" = excluded."year_from", "is_current" = excluded."is_current", "notes" = excluded."notes", "public_brotherhood_name" = excluded."public_brotherhood_name", "public_step_name" = excluded."public_step_name", "public_brotherhood_slug" = excluded."public_brotherhood_slug", "public_municipality_name" = excluded."public_municipality_name", "public_municipality_slug" = excluded."public_municipality_slug", "public_province" = excluded."public_province", "status" = excluded."status";

insert into public."source_links" ("id", "source_id", "music_accompaniment_period_id", "scope")
values ('499054b7-e852-4dcd-85c6-70d444fff6d4', '4f87b643-a691-43b2-bbc9-1884940817d0', '02c8210a-bc5a-4fff-b232-3fb9b502d1ea', null) on conflict ("id") do update set "source_id" = excluded."source_id", "music_accompaniment_period_id" = excluded."music_accompaniment_period_id", "scope" = excluded."scope";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('33cb7482-167e-40ac-a25f-018751b979ac', 'brotherhood', 'Hermandad de San Isidoro', 'hermandad-san-isidoro-sevilla', 'Hermandad de Sevilla que realiza estación de penitencia el Viernes Santo.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."brotherhoods" ("entity_id", "official_name", "popular_name", "foundation_text", "municipality_id", "canonical_see_place_id", "neighborhood", "website_url", "brotherhood_types", "current_procession_day", "history_text", "notes")
values ('33cb7482-167e-40ac-a25f-018751b979ac', 'Antigua e Ilustre Hermandad del Santísimo Sacramento, María Santísima de las Nieves y Ánimas Benditas del Purgatorio y Pontificia y Real Archicofradía de Nazarenos de Nuestro Padre Jesús de las Tres Caídas, Nuestra Señora de Loreto y Señor San Isidoro', 'San Isidoro', 'Siglo XVII; establecida en San Isidoro desde 1668', 'ca85889c-21fe-4367-8477-a57656b25da4', 'd3d961bb-2bca-409c-8b91-f30f04c02fc2', 'Alfalfa', 'https://trescaidas.org/', ARRAY['Penitencia']::text[], 'Viernes Santo', 'La Hermandad quedó establecida en San Isidoro en 1668 y desde 1975 está unida a la Sacramental de la parroquia. Conserva un destacado patrimonio y archivo musical.', 'Ficha cerrada en el macrolote Viernes Santo HC-016 de 2026.') on conflict ("entity_id") do update set "official_name" = excluded."official_name", "popular_name" = excluded."popular_name", "foundation_text" = excluded."foundation_text", "municipality_id" = excluded."municipality_id", "canonical_see_place_id" = excluded."canonical_see_place_id", "neighborhood" = excluded."neighborhood", "website_url" = excluded."website_url", "brotherhood_types" = excluded."brotherhood_types", "current_procession_day" = excluded."current_procession_day", "history_text" = excluded."history_text", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('f1565b05-2785-4c55-85ca-d609a6c56431', 'e38d2cac-3e2f-4b16-b63f-03f0d634e480', '33cb7482-167e-40ac-a25f-018751b979ac', 'Identidad, sede, titulares y patrimonio') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('543d9e15-7d38-4875-b3db-22f2692c982d', '91c6e755-ddb7-45af-a973-68f35eacb038', '33cb7482-167e-40ac-a25f-018751b979ac', 'Identidad institucional y cultos') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."brotherhood_images" ("id", "brotherhood_entity_id", "image_entity_id", "relation_type", "notes", "status")
values ('3c080bf1-5ca6-460e-87c7-0b420286f221', '33cb7482-167e-40ac-a25f-018751b979ac', '33f9a00f-1bd0-42f9-8ff8-d62985e6c9ee', 'titular', 'Titular de la corporación.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."brotherhood_images" ("id", "brotherhood_entity_id", "image_entity_id", "relation_type", "notes", "status")
values ('2c6da324-c854-43c1-8828-4420f8b95b58', '33cb7482-167e-40ac-a25f-018751b979ac', 'dc09ff6a-e28a-4018-9963-a124a2ea1bdc', 'titular', 'Titular de la corporación.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."brotherhood_steps" ("id", "brotherhood_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('1b1e3482-567b-41a4-9c92-2452d7745d64', '33cb7482-167e-40ac-a25f-018751b979ac', '1dc264d9-5de4-4453-b51d-2c8dda14a8e0', 'processional', 'Paso canónico 1 de la estación de penitencia.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."brotherhood_steps" ("id", "brotherhood_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('5dcabc3b-7f48-4d60-9f33-63f636f6e2f2', '33cb7482-167e-40ac-a25f-018751b979ac', 'b60f5722-a03a-43b1-97e6-0d5714baefb5', 'processional', 'Paso canónico 2 de la estación de penitencia.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_steps" ("id", "image_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('4ccc94a1-a45a-43f4-81d8-e82d51565506', '33f9a00f-1bd0-42f9-8ff8-d62985e6c9ee', '1dc264d9-5de4-4453-b51d-2c8dda14a8e0', 'processional', 'Relación canónica del cortejo del Viernes Santo.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_steps" ("id", "image_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('6a1e0e5e-240c-447b-a76f-65a095fbe4a2', 'dc09ff6a-e28a-4018-9963-a124a2ea1bdc', 'b60f5722-a03a-43b1-97e6-0d5714baefb5', 'processional', 'Relación canónica del cortejo del Viernes Santo.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."cults" ("id", "brotherhood_entity_id", "cult_type", "title", "date_rule", "place_id", "description", "status", "is_recurring", "recurrence_label", "display_order")
values ('1d79a52e-f65e-4479-88d8-8338333cdc8b', '33cb7482-167e-40ac-a25f-018751b979ac', 'Quinario', 'Solemne Quinario a Nuestro Padre Jesús de las Tres Caídas', 'Cuaresma', 'd3d961bb-2bca-409c-8b91-f30f04c02fc2', 'Culto anual documentado por la corporación.', 'published', true, 'Anual', 1) on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "cult_type" = excluded."cult_type", "title" = excluded."title", "date_rule" = excluded."date_rule", "place_id" = excluded."place_id", "description" = excluded."description", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order";

insert into public."source_links" ("id", "source_id", "cult_id", "scope")
values ('db6f7311-0647-4938-a855-b7f6a07569b3', '91c6e755-ddb7-45af-a973-68f35eacb038', '1d79a52e-f65e-4479-88d8-8338333cdc8b', null) on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id", "scope" = excluded."scope";

insert into public."cults" ("id", "brotherhood_entity_id", "cult_type", "title", "date_rule", "place_id", "description", "status", "is_recurring", "recurrence_label", "display_order")
values ('c4a089c7-3f84-435d-b65f-79546a63b0ce', '33cb7482-167e-40ac-a25f-018751b979ac', 'Función Principal', 'Función Principal de Instituto', 'Cuaresma', 'd3d961bb-2bca-409c-8b91-f30f04c02fc2', 'Culto anual documentado por la corporación.', 'published', true, 'Anual', 2) on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "cult_type" = excluded."cult_type", "title" = excluded."title", "date_rule" = excluded."date_rule", "place_id" = excluded."place_id", "description" = excluded."description", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order";

insert into public."source_links" ("id", "source_id", "cult_id", "scope")
values ('9ca130b3-6d6d-4da5-8160-1ce07674dcbe', '91c6e755-ddb7-45af-a973-68f35eacb038', 'c4a089c7-3f84-435d-b65f-79546a63b0ce', null) on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id", "scope" = excluded."scope";

insert into public."cults" ("id", "brotherhood_entity_id", "cult_type", "title", "date_rule", "place_id", "description", "status", "is_recurring", "recurrence_label", "display_order")
values ('5d03407d-93a5-49e3-8770-8e4dff5b7743', '33cb7482-167e-40ac-a25f-018751b979ac', 'Besapié', 'Besapié a Nuestro Padre Jesús de las Tres Caídas', 'Cuaresma', 'd3d961bb-2bca-409c-8b91-f30f04c02fc2', 'Culto anual documentado por la corporación.', 'published', true, 'Anual', 3) on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "cult_type" = excluded."cult_type", "title" = excluded."title", "date_rule" = excluded."date_rule", "place_id" = excluded."place_id", "description" = excluded."description", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order";

insert into public."source_links" ("id", "source_id", "cult_id", "scope")
values ('6d5316a8-faec-4914-a405-78f41a945a25', '91c6e755-ddb7-45af-a973-68f35eacb038', '5d03407d-93a5-49e3-8770-8e4dff5b7743', null) on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id", "scope" = excluded."scope";

insert into public."cults" ("id", "brotherhood_entity_id", "cult_type", "title", "date_rule", "place_id", "description", "status", "is_recurring", "recurrence_label", "display_order")
values ('3f00d830-152a-4767-8693-839c8c85e5b4', '33cb7482-167e-40ac-a25f-018751b979ac', 'Triduo', 'Triduo a Nuestra Señora de Loreto', 'Diciembre', 'd3d961bb-2bca-409c-8b91-f30f04c02fc2', 'Culto anual documentado por la corporación.', 'published', true, 'Anual', 4) on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "cult_type" = excluded."cult_type", "title" = excluded."title", "date_rule" = excluded."date_rule", "place_id" = excluded."place_id", "description" = excluded."description", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order";

insert into public."source_links" ("id", "source_id", "cult_id", "scope")
values ('f66448ae-d102-429a-aadf-5a7fe9a27680', '91c6e755-ddb7-45af-a973-68f35eacb038', '3f00d830-152a-4767-8693-839c8c85e5b4', null) on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id", "scope" = excluded."scope";

insert into public."cults" ("id", "brotherhood_entity_id", "cult_type", "title", "date_rule", "place_id", "description", "status", "is_recurring", "recurrence_label", "display_order")
values ('f4d9e73f-7af7-4c5a-9761-5366629e0b7c', '33cb7482-167e-40ac-a25f-018751b979ac', 'Besamanos', 'Besamanos a Nuestra Señora de Loreto', 'Diciembre', 'd3d961bb-2bca-409c-8b91-f30f04c02fc2', 'Culto anual documentado por la corporación.', 'published', true, 'Anual', 5) on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "cult_type" = excluded."cult_type", "title" = excluded."title", "date_rule" = excluded."date_rule", "place_id" = excluded."place_id", "description" = excluded."description", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order";

insert into public."source_links" ("id", "source_id", "cult_id", "scope")
values ('b9ed1f03-8df9-442c-9c9f-61cd2f426d81', '91c6e755-ddb7-45af-a973-68f35eacb038', 'f4d9e73f-7af7-4c5a-9761-5366629e0b7c', null) on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id", "scope" = excluded."scope";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('63c25564-f36b-48bf-a7a7-a12436638c0c', 'heritage_asset', 'Paso de Nuestro Padre Jesús de las Tres Caídas', 'sanIsidoro-paso-de-nuestro-padre-jesus-de-las-tres-caidas', 'Paso dorado de Francisco Ruiz Rodríguez.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."heritage_assets" ("entity_id", "parent_entity_id", "asset_type", "description", "current_condition", "is_current", "display_order", "is_featured")
values ('63c25564-f36b-48bf-a7a7-a12436638c0c', '33cb7482-167e-40ac-a25f-018751b979ac', 'Paso procesional', 'Paso dorado de Francisco Ruiz Rodríguez.', 'Conservado', true, 1, true) on conflict ("entity_id") do update set "parent_entity_id" = excluded."parent_entity_id", "asset_type" = excluded."asset_type", "description" = excluded."description", "current_condition" = excluded."current_condition", "is_current" = excluded."is_current", "display_order" = excluded."display_order", "is_featured" = excluded."is_featured";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('353b4ae5-3d02-40f5-a911-9939134b2a90', 'e38d2cac-3e2f-4b16-b63f-03f0d634e480', '63c25564-f36b-48bf-a7a7-a12436638c0c', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('90bc5c3f-2a84-4bad-b5f5-d447cdefd1b7', 'heritage_asset', 'Conjunto de palio de Nuestra Señora de Loreto', 'sanIsidoro-conjunto-de-palio-de-nuestra-senora-de-loreto', 'Conjunto de tisú y orfebrería dorada.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."heritage_assets" ("entity_id", "parent_entity_id", "asset_type", "description", "current_condition", "is_current", "display_order", "is_featured")
values ('90bc5c3f-2a84-4bad-b5f5-d447cdefd1b7', '33cb7482-167e-40ac-a25f-018751b979ac', 'Bordado y orfebrería', 'Conjunto de tisú y orfebrería dorada.', 'Conservado', true, 2, false) on conflict ("entity_id") do update set "parent_entity_id" = excluded."parent_entity_id", "asset_type" = excluded."asset_type", "description" = excluded."description", "current_condition" = excluded."current_condition", "is_current" = excluded."is_current", "display_order" = excluded."display_order", "is_featured" = excluded."is_featured";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('6bc30625-8bec-4a98-a9c6-a456cd0ddcdf', 'e38d2cac-3e2f-4b16-b63f-03f0d634e480', '90bc5c3f-2a84-4bad-b5f5-d447cdefd1b7', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('9d5205b0-0a48-4fb7-bc0b-cb75dd2d6098', 'event', 'Unión con la Sacramental de San Isidoro', 'union-sacramental-san-isidoro-1975', 'La cofradía quedó unida a la Hermandad Sacramental de San Isidoro.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."events" ("entity_id", "event_type", "event_date_text", "description", "event_category", "brotherhood_entity_id", "municipality_id", "event_status")
values ('9d5205b0-0a48-4fb7-bc0b-cb75dd2d6098', 'Hito histórico', '1975', 'La cofradía quedó unida a la Hermandad Sacramental de San Isidoro.', 'historical', '33cb7482-167e-40ac-a25f-018751b979ac', 'ca85889c-21fe-4367-8477-a57656b25da4', 'held') on conflict ("entity_id") do update set "event_type" = excluded."event_type", "event_date_text" = excluded."event_date_text", "description" = excluded."description", "event_category" = excluded."event_category", "brotherhood_entity_id" = excluded."brotherhood_entity_id", "municipality_id" = excluded."municipality_id", "event_status" = excluded."event_status";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('c829dca8-c21c-4543-8514-53b7821459f3', 'e38d2cac-3e2f-4b16-b63f-03f0d634e480', '9d5205b0-0a48-4fb7-bc0b-cb75dd2d6098', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."brotherhood_habits" ("id", "brotherhood_entity_id", "name", "tunic_description", "hood_description", "cord_description", "sort_order", "notes", "status")
values ('9b71fd63-102a-4480-acc5-7831993da617', '33cb7482-167e-40ac-a25f-018751b979ac', 'Hábito de San Isidoro', 'Túnica negra de cola.', 'Antifaz negro.', 'Cinturón de esparto.', 1, 'Hábito penitencial documentado por el Consejo.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "name" = excluded."name", "tunic_description" = excluded."tunic_description", "hood_description" = excluded."hood_description", "cord_description" = excluded."cord_description", "sort_order" = excluded."sort_order", "notes" = excluded."notes", "status" = excluded."status";

insert into public."source_links" ("id", "source_id", "brotherhood_habit_id", "scope")
values ('5283cbc4-c538-4375-ba71-ee9f899b2ee4', 'e38d2cac-3e2f-4b16-b63f-03f0d634e480', '9b71fd63-102a-4480-acc5-7831993da617', null) on conflict ("id") do update set "source_id" = excluded."source_id", "brotherhood_habit_id" = excluded."brotherhood_habit_id", "scope" = excluded."scope";

insert into public."outings" ("id", "brotherhood_entity_id", "outing_type", "character", "title", "outing_date", "year", "departure_time", "return_time", "municipality_id", "origin_place_id", "destination_text", "route_summary", "description", "event_status", "status", "slug")
values ('4bdd5fd4-c31f-466f-adb1-702a05831a6c', '33cb7482-167e-40ac-a25f-018751b979ac', 'Estación de Penitencia', 'ordinary', 'Hermandad de San Isidoro · Estación de Penitencia 2026', '2026-04-03', 2026, '19:40', '00:15', 'ca85889c-21fe-4367-8477-a57656b25da4', 'd3d961bb-2bca-409c-8b91-f30f04c02fc2', 'Santa Iglesia Catedral de Sevilla', 'Itinerario oficial del Viernes Santo de 2026 con tránsito por la Carrera Oficial.', 'Estación de penitencia celebrada el Viernes Santo de 2026.', 'held', 'published', 'sanIsidoro-estacion-penitencia-2026') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "outing_type" = excluded."outing_type", "character" = excluded."character", "title" = excluded."title", "outing_date" = excluded."outing_date", "year" = excluded."year", "departure_time" = excluded."departure_time", "return_time" = excluded."return_time", "municipality_id" = excluded."municipality_id", "origin_place_id" = excluded."origin_place_id", "destination_text" = excluded."destination_text", "route_summary" = excluded."route_summary", "description" = excluded."description", "event_status" = excluded."event_status", "status" = excluded."status", "slug" = excluded."slug";

insert into public."outing_entities" ("id", "outing_id", "entity_id", "role", "notes")
values ('957007eb-45ad-4d9f-9898-3c26849b03ce', '4bdd5fd4-c31f-466f-adb1-702a05831a6c', '33f9a00f-1bd0-42f9-8ff8-d62985e6c9ee', 'processional_image', 'Imagen participante en el cortejo de 2026.') on conflict ("id") do update set "outing_id" = excluded."outing_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."outing_entities" ("id", "outing_id", "entity_id", "role", "notes")
values ('83fe4f81-27e9-463d-9ada-e02c68a8901a', '4bdd5fd4-c31f-466f-adb1-702a05831a6c', 'dc09ff6a-e28a-4018-9963-a124a2ea1bdc', 'processional_image', 'Imagen participante en el cortejo de 2026.') on conflict ("id") do update set "outing_id" = excluded."outing_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "outing_id", "scope")
values ('7f76fb1f-65f0-411d-8c18-9c52b3c1c959', '8aeb970d-abfb-4e4c-a214-76f2d580e1e5', '4bdd5fd4-c31f-466f-adb1-702a05831a6c', null) on conflict ("id") do update set "source_id" = excluded."source_id", "outing_id" = excluded."outing_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "outing_id", "scope")
values ('e6feaa54-6b1a-47b7-911d-66b914711b22', 'e38d2cac-3e2f-4b16-b63f-03f0d634e480', '4bdd5fd4-c31f-466f-adb1-702a05831a6c', null) on conflict ("id") do update set "source_id" = excluded."source_id", "outing_id" = excluded."outing_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('3ecc0db8-07db-4445-b734-f1232122ae65', 'e38d2cac-3e2f-4b16-b63f-03f0d634e480', '33cb7482-167e-40ac-a25f-018751b979ac', 'Estación de penitencia sin acompañamiento musical') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('b3897b5a-2a0c-4e59-930f-044d7aa26574', 'brotherhood', 'Montserrat', 'montserrat', 'Hermandad de Sevilla que realiza estación de penitencia el Viernes Santo.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

update public."brotherhoods" set "current_procession_day" = 'Viernes Santo', "notes" = 'Ficha cerrada en el macrolote Viernes Santo HC-016 de 2026.' where "entity_id" = 'b3897b5a-2a0c-4e59-930f-044d7aa26574';

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('8a0010fc-404a-4aef-a5f7-52822187975d', '03cb59b6-b279-4024-a0ac-03450f081439', 'b3897b5a-2a0c-4e59-930f-044d7aa26574', 'Identidad, sede, titulares y patrimonio') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('e7d8b61c-b093-4995-b321-33eb9666408f', '04bfcdbb-5749-4e57-88d0-6d095555ac91', 'b3897b5a-2a0c-4e59-930f-044d7aa26574', 'Identidad institucional y cultos') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."brotherhood_images" ("id", "brotherhood_entity_id", "image_entity_id", "relation_type", "notes", "status")
values ('4b8fd019-ae5f-4c11-9735-fc2a1554b759', 'b3897b5a-2a0c-4e59-930f-044d7aa26574', '0f2b156d-5f44-4cbf-aec1-fc4741e0839a', 'titular', 'Titular de la corporación.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."brotherhood_images" ("id", "brotherhood_entity_id", "image_entity_id", "relation_type", "notes", "status")
values ('ad698b1e-ccbf-4cfc-9e04-38b2306659b7', 'b3897b5a-2a0c-4e59-930f-044d7aa26574', 'aee4e57a-9942-4428-9ce6-42974802266e', 'titular', 'Titular de la corporación.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."brotherhood_steps" ("id", "brotherhood_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('a75678f2-1177-4e4c-867e-42d6a36a49c0', 'b3897b5a-2a0c-4e59-930f-044d7aa26574', '3972a543-2024-412d-a022-b4f0b2f996cd', 'processional', 'Paso canónico 1 de la estación de penitencia.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."brotherhood_steps" ("id", "brotherhood_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('3fef1b12-b050-40f4-9495-3c9b997db59a', 'b3897b5a-2a0c-4e59-930f-044d7aa26574', '90c2afd3-654b-4391-9861-b6ec9ba9898e', 'processional', 'Paso canónico 2 de la estación de penitencia.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_steps" ("id", "image_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('4ad95fb2-4d7f-4caa-b952-41ed42ca68c9', '0f2b156d-5f44-4cbf-aec1-fc4741e0839a', '3972a543-2024-412d-a022-b4f0b2f996cd', 'processional', 'Relación canónica del cortejo del Viernes Santo.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_steps" ("id", "image_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('1819b05f-0558-4465-ba43-310f801478c4', 'aee4e57a-9942-4428-9ce6-42974802266e', '90c2afd3-654b-4391-9861-b6ec9ba9898e', 'processional', 'Relación canónica del cortejo del Viernes Santo.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."cults" ("id", "brotherhood_entity_id", "cult_type", "title", "date_rule", "place_id", "description", "status", "is_recurring", "recurrence_label", "display_order")
values ('1d115502-0cd8-4074-92f4-148efbb6e4d8', 'b3897b5a-2a0c-4e59-930f-044d7aa26574', 'Quinario', 'Solemne Quinario al Santísimo Cristo de la Conversión', 'Cuaresma', '6db3bd60-5839-4c8f-af2d-99646127f868', 'Culto anual documentado por la corporación.', 'published', true, 'Anual', 1) on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "cult_type" = excluded."cult_type", "title" = excluded."title", "date_rule" = excluded."date_rule", "place_id" = excluded."place_id", "description" = excluded."description", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order";

insert into public."source_links" ("id", "source_id", "cult_id", "scope")
values ('a58ab4b8-38da-43c1-9d77-8c3ed14be6e0', '04bfcdbb-5749-4e57-88d0-6d095555ac91', '1d115502-0cd8-4074-92f4-148efbb6e4d8', null) on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id", "scope" = excluded."scope";

insert into public."cults" ("id", "brotherhood_entity_id", "cult_type", "title", "date_rule", "place_id", "description", "status", "is_recurring", "recurrence_label", "display_order")
values ('a62c10af-d1fb-4c47-a0c4-52793f73a41a', 'b3897b5a-2a0c-4e59-930f-044d7aa26574', 'Función Principal', 'Función Principal de Instituto', 'Cuaresma', '6db3bd60-5839-4c8f-af2d-99646127f868', 'Culto anual documentado por la corporación.', 'published', true, 'Anual', 2) on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "cult_type" = excluded."cult_type", "title" = excluded."title", "date_rule" = excluded."date_rule", "place_id" = excluded."place_id", "description" = excluded."description", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order";

insert into public."source_links" ("id", "source_id", "cult_id", "scope")
values ('c316cf06-d266-4d06-a227-ba63810d3cb6', '04bfcdbb-5749-4e57-88d0-6d095555ac91', 'a62c10af-d1fb-4c47-a0c4-52793f73a41a', null) on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id", "scope" = excluded."scope";

insert into public."cults" ("id", "brotherhood_entity_id", "cult_type", "title", "date_rule", "place_id", "description", "status", "is_recurring", "recurrence_label", "display_order")
values ('403fb198-aae9-4fff-bad9-95d8f8d0d8a4', 'b3897b5a-2a0c-4e59-930f-044d7aa26574', 'Besapié', 'Besapié al Santísimo Cristo de la Conversión', 'Cuaresma', '6db3bd60-5839-4c8f-af2d-99646127f868', 'Culto anual documentado por la corporación.', 'published', true, 'Anual', 3) on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "cult_type" = excluded."cult_type", "title" = excluded."title", "date_rule" = excluded."date_rule", "place_id" = excluded."place_id", "description" = excluded."description", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order";

insert into public."source_links" ("id", "source_id", "cult_id", "scope")
values ('359b74fa-1f75-4e35-b5f2-4d892d291dbe', '04bfcdbb-5749-4e57-88d0-6d095555ac91', '403fb198-aae9-4fff-bad9-95d8f8d0d8a4', null) on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id", "scope" = excluded."scope";

insert into public."cults" ("id", "brotherhood_entity_id", "cult_type", "title", "date_rule", "place_id", "description", "status", "is_recurring", "recurrence_label", "display_order")
values ('fd66c3ad-3d26-4997-aaa9-1bdb69d6f8d7', 'b3897b5a-2a0c-4e59-930f-044d7aa26574', 'Triduo', 'Triduo a Nuestra Señora de Montserrat', 'Noviembre', '6db3bd60-5839-4c8f-af2d-99646127f868', 'Culto anual documentado por la corporación.', 'published', true, 'Anual', 4) on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "cult_type" = excluded."cult_type", "title" = excluded."title", "date_rule" = excluded."date_rule", "place_id" = excluded."place_id", "description" = excluded."description", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order";

insert into public."source_links" ("id", "source_id", "cult_id", "scope")
values ('9de40f94-6822-4e60-b06e-db162b7d8546', '04bfcdbb-5749-4e57-88d0-6d095555ac91', 'fd66c3ad-3d26-4997-aaa9-1bdb69d6f8d7', null) on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id", "scope" = excluded."scope";

insert into public."cults" ("id", "brotherhood_entity_id", "cult_type", "title", "date_rule", "place_id", "description", "status", "is_recurring", "recurrence_label", "display_order")
values ('589000c3-2c4f-4069-aa99-dd3296a58305', 'b3897b5a-2a0c-4e59-930f-044d7aa26574', 'Besamanos', 'Besamanos a Nuestra Señora de Montserrat', 'Noviembre', '6db3bd60-5839-4c8f-af2d-99646127f868', 'Culto anual documentado por la corporación.', 'published', true, 'Anual', 5) on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "cult_type" = excluded."cult_type", "title" = excluded."title", "date_rule" = excluded."date_rule", "place_id" = excluded."place_id", "description" = excluded."description", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order";

insert into public."source_links" ("id", "source_id", "cult_id", "scope")
values ('721634f8-8970-4701-8322-41490be93b4d', '04bfcdbb-5749-4e57-88d0-6d095555ac91', '589000c3-2c4f-4069-aa99-dd3296a58305', null) on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id", "scope" = excluded."scope";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('ef291ae2-0e93-4051-bbba-13e981b5f891', 'heritage_asset', 'Paso del Cristo de la Conversión', 'montserrat-paso-del-cristo-de-la-conversion', 'Misterio de carácter romántico con los dos ladrones.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."heritage_assets" ("entity_id", "parent_entity_id", "asset_type", "description", "current_condition", "is_current", "display_order", "is_featured")
values ('ef291ae2-0e93-4051-bbba-13e981b5f891', 'b3897b5a-2a0c-4e59-930f-044d7aa26574', 'Paso procesional', 'Misterio de carácter romántico con los dos ladrones.', 'Conservado', true, 1, true) on conflict ("entity_id") do update set "parent_entity_id" = excluded."parent_entity_id", "asset_type" = excluded."asset_type", "description" = excluded."description", "current_condition" = excluded."current_condition", "is_current" = excluded."is_current", "display_order" = excluded."display_order", "is_featured" = excluded."is_featured";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('da386476-1847-4da2-b29b-a6abf03eab55', '03cb59b6-b279-4024-a0ac-03450f081439', 'ef291ae2-0e93-4051-bbba-13e981b5f891', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('421fa6de-2e92-49fb-876b-3c4d963294d5', 'heritage_asset', 'Conjunto de palio de Nuestra Señora de Montserrat', 'montserrat-conjunto-de-palio-de-nuestra-senora-de-montserrat', 'Palio de crestería rígida y terciopelo azul.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."heritage_assets" ("entity_id", "parent_entity_id", "asset_type", "description", "current_condition", "is_current", "display_order", "is_featured")
values ('421fa6de-2e92-49fb-876b-3c4d963294d5', 'b3897b5a-2a0c-4e59-930f-044d7aa26574', 'Bordado y orfebrería', 'Palio de crestería rígida y terciopelo azul.', 'Conservado', true, 2, false) on conflict ("entity_id") do update set "parent_entity_id" = excluded."parent_entity_id", "asset_type" = excluded."asset_type", "description" = excluded."description", "current_condition" = excluded."current_condition", "is_current" = excluded."is_current", "display_order" = excluded."display_order", "is_featured" = excluded."is_featured";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('510bc5cb-0e62-4009-a95a-078ae3d004d0', '03cb59b6-b279-4024-a0ac-03450f081439', '421fa6de-2e92-49fb-876b-3c4d963294d5', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('80cf2b60-46e9-4006-b701-9c5554a36154', 'event', 'Aprobación de las Reglas penitenciales de Montserrat', 'reglas-montserrat-1601', 'Las primeras Reglas penitenciales fijaban ya la estación del Viernes Santo.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."events" ("entity_id", "event_type", "event_date_text", "description", "event_category", "brotherhood_entity_id", "municipality_id", "event_status")
values ('80cf2b60-46e9-4006-b701-9c5554a36154', 'Hito histórico', '24 de abril de 1601', 'Las primeras Reglas penitenciales fijaban ya la estación del Viernes Santo.', 'historical', 'b3897b5a-2a0c-4e59-930f-044d7aa26574', 'ca85889c-21fe-4367-8477-a57656b25da4', 'held') on conflict ("entity_id") do update set "event_type" = excluded."event_type", "event_date_text" = excluded."event_date_text", "description" = excluded."description", "event_category" = excluded."event_category", "brotherhood_entity_id" = excluded."brotherhood_entity_id", "municipality_id" = excluded."municipality_id", "event_status" = excluded."event_status";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('0bf780b3-071e-4181-ad4b-4aa5ad1c1493', '03cb59b6-b279-4024-a0ac-03450f081439', '80cf2b60-46e9-4006-b701-9c5554a36154', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."brotherhood_habits" ("id", "brotherhood_entity_id", "name", "tunic_description", "hood_description", "cord_description", "sort_order", "notes", "status")
values ('66757447-8c91-4905-8f3a-7406d13b909a', 'b3897b5a-2a0c-4e59-930f-044d7aa26574', 'Hábitos de Montserrat', 'Túnica blanca de cola en el Cristo y crema en la Virgen.', 'Antifaz azul.', 'Esparto en el Cristo y cíngulo en la Virgen.', 1, 'Hábito penitencial documentado por el Consejo.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "name" = excluded."name", "tunic_description" = excluded."tunic_description", "hood_description" = excluded."hood_description", "cord_description" = excluded."cord_description", "sort_order" = excluded."sort_order", "notes" = excluded."notes", "status" = excluded."status";

insert into public."source_links" ("id", "source_id", "brotherhood_habit_id", "scope")
values ('f8265fb5-25cf-40fb-8c5e-d746ba661126', '03cb59b6-b279-4024-a0ac-03450f081439', '66757447-8c91-4905-8f3a-7406d13b909a', null) on conflict ("id") do update set "source_id" = excluded."source_id", "brotherhood_habit_id" = excluded."brotherhood_habit_id", "scope" = excluded."scope";

insert into public."outings" ("id", "brotherhood_entity_id", "outing_type", "character", "title", "outing_date", "year", "departure_time", "return_time", "municipality_id", "origin_place_id", "destination_text", "route_summary", "description", "event_status", "status", "slug")
values ('679dde75-1741-4bac-9fde-6d7583c0c100', 'b3897b5a-2a0c-4e59-930f-044d7aa26574', 'Estación de Penitencia', 'ordinary', 'Montserrat · Estación de Penitencia 2026', '2026-04-03', 2026, '20:30', '02:30', 'ca85889c-21fe-4367-8477-a57656b25da4', '6db3bd60-5839-4c8f-af2d-99646127f868', 'Santa Iglesia Catedral de Sevilla', 'Itinerario oficial del Viernes Santo de 2026 con tránsito por la Carrera Oficial.', 'Estación de penitencia celebrada el Viernes Santo de 2026.', 'held', 'published', 'montserrat-estacion-penitencia-2026') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "outing_type" = excluded."outing_type", "character" = excluded."character", "title" = excluded."title", "outing_date" = excluded."outing_date", "year" = excluded."year", "departure_time" = excluded."departure_time", "return_time" = excluded."return_time", "municipality_id" = excluded."municipality_id", "origin_place_id" = excluded."origin_place_id", "destination_text" = excluded."destination_text", "route_summary" = excluded."route_summary", "description" = excluded."description", "event_status" = excluded."event_status", "status" = excluded."status", "slug" = excluded."slug";

insert into public."outing_entities" ("id", "outing_id", "entity_id", "role", "notes")
values ('9995fc5c-fe8c-435f-9b53-67c6a1fb0f4f', '679dde75-1741-4bac-9fde-6d7583c0c100', '0f2b156d-5f44-4cbf-aec1-fc4741e0839a', 'processional_image', 'Imagen participante en el cortejo de 2026.') on conflict ("id") do update set "outing_id" = excluded."outing_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."outing_entities" ("id", "outing_id", "entity_id", "role", "notes")
values ('9f1ad48c-86ac-4be8-a579-c0404b8b3086', '679dde75-1741-4bac-9fde-6d7583c0c100', 'aee4e57a-9942-4428-9ce6-42974802266e', 'processional_image', 'Imagen participante en el cortejo de 2026.') on conflict ("id") do update set "outing_id" = excluded."outing_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "outing_id", "scope")
values ('13f9cff7-5274-410c-bc36-bb88463ecb07', '8aeb970d-abfb-4e4c-a214-76f2d580e1e5', '679dde75-1741-4bac-9fde-6d7583c0c100', null) on conflict ("id") do update set "source_id" = excluded."source_id", "outing_id" = excluded."outing_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "outing_id", "scope")
values ('77e1e781-0bd0-45c5-8e4d-ece0775cb105', '03cb59b6-b279-4024-a0ac-03450f081439', '679dde75-1741-4bac-9fde-6d7583c0c100', null) on conflict ("id") do update set "source_id" = excluded."source_id", "outing_id" = excluded."outing_id", "scope" = excluded."scope";

insert into public."accompaniments" ("id", "outing_id", "band_entity_id", "step_entity_id", "position", "year", "notes", "status")
values ('3a388434-87ce-484a-8db1-1390675a9ae1', '679dde75-1741-4bac-9fde-6d7583c0c100', '0a86bfb1-afe6-448a-88b9-127867f5b1a9', '3972a543-2024-412d-a022-b4f0b2f996cd', 'Tras el paso del Cristo', 2026, 'Acompañamiento vigente y documentado para 2026.', 'published') on conflict ("id") do update set "outing_id" = excluded."outing_id", "band_entity_id" = excluded."band_entity_id", "step_entity_id" = excluded."step_entity_id", "position" = excluded."position", "year" = excluded."year", "notes" = excluded."notes", "status" = excluded."status";

insert into public."music_accompaniment_periods" ("id", "brotherhood_entity_id", "band_entity_id", "step_entity_id", "position", "outing_type", "date_from_text", "year_from", "is_current", "notes", "public_brotherhood_name", "public_step_name", "public_brotherhood_slug", "public_municipality_name", "public_municipality_slug", "public_province", "status")
values ('285cdf9c-d790-4c83-b099-013ef74991cd', 'b3897b5a-2a0c-4e59-930f-044d7aa26574', '0a86bfb1-afe6-448a-88b9-127867f5b1a9', '3972a543-2024-412d-a022-b4f0b2f996cd', 'Tras el paso del Cristo', 'Viernes Santo', 'Vigente en 2026', null, true, 'Vigencia constatada para 2026; no presupone continuidad posterior.', 'Montserrat', 'Tras el paso del Cristo', 'montserrat', 'Sevilla', 'sevilla', 'Sevilla', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "band_entity_id" = excluded."band_entity_id", "step_entity_id" = excluded."step_entity_id", "position" = excluded."position", "outing_type" = excluded."outing_type", "date_from_text" = excluded."date_from_text", "year_from" = excluded."year_from", "is_current" = excluded."is_current", "notes" = excluded."notes", "public_brotherhood_name" = excluded."public_brotherhood_name", "public_step_name" = excluded."public_step_name", "public_brotherhood_slug" = excluded."public_brotherhood_slug", "public_municipality_name" = excluded."public_municipality_name", "public_municipality_slug" = excluded."public_municipality_slug", "public_province" = excluded."public_province", "status" = excluded."status";

insert into public."source_links" ("id", "source_id", "music_accompaniment_period_id", "scope")
values ('f8b29e07-a3c1-483d-933a-d29b6fdb8769', '03cb59b6-b279-4024-a0ac-03450f081439', '285cdf9c-d790-4c83-b099-013ef74991cd', null) on conflict ("id") do update set "source_id" = excluded."source_id", "music_accompaniment_period_id" = excluded."music_accompaniment_period_id", "scope" = excluded."scope";

insert into public."accompaniments" ("id", "outing_id", "band_entity_id", "step_entity_id", "position", "year", "notes", "status")
values ('abf712e3-0eb3-4c2b-8e58-a417a1a04275', '679dde75-1741-4bac-9fde-6d7583c0c100', 'e1fe592f-c67d-42c3-9f2f-67137ef629ec', '90c2afd3-654b-4391-9861-b6ec9ba9898e', 'Tras el paso de palio', 2026, 'Acompañamiento vigente y documentado para 2026.', 'published') on conflict ("id") do update set "outing_id" = excluded."outing_id", "band_entity_id" = excluded."band_entity_id", "step_entity_id" = excluded."step_entity_id", "position" = excluded."position", "year" = excluded."year", "notes" = excluded."notes", "status" = excluded."status";

insert into public."music_accompaniment_periods" ("id", "brotherhood_entity_id", "band_entity_id", "step_entity_id", "position", "outing_type", "date_from_text", "year_from", "is_current", "notes", "public_brotherhood_name", "public_step_name", "public_brotherhood_slug", "public_municipality_name", "public_municipality_slug", "public_province", "status")
values ('b78dc4b1-5764-4730-a84c-837e237b4eff', 'b3897b5a-2a0c-4e59-930f-044d7aa26574', 'e1fe592f-c67d-42c3-9f2f-67137ef629ec', '90c2afd3-654b-4391-9861-b6ec9ba9898e', 'Tras el paso de palio', 'Viernes Santo', 'Vigente en 2026', null, true, 'Vigencia constatada para 2026; no presupone continuidad posterior.', 'Montserrat', 'Tras el paso de palio', 'montserrat', 'Sevilla', 'sevilla', 'Sevilla', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "band_entity_id" = excluded."band_entity_id", "step_entity_id" = excluded."step_entity_id", "position" = excluded."position", "outing_type" = excluded."outing_type", "date_from_text" = excluded."date_from_text", "year_from" = excluded."year_from", "is_current" = excluded."is_current", "notes" = excluded."notes", "public_brotherhood_name" = excluded."public_brotherhood_name", "public_step_name" = excluded."public_step_name", "public_brotherhood_slug" = excluded."public_brotherhood_slug", "public_municipality_name" = excluded."public_municipality_name", "public_municipality_slug" = excluded."public_municipality_slug", "public_province" = excluded."public_province", "status" = excluded."status";

insert into public."source_links" ("id", "source_id", "music_accompaniment_period_id", "scope")
values ('cd70588b-9112-4a9e-9252-e96f01f55bcf', '03cb59b6-b279-4024-a0ac-03450f081439', 'b78dc4b1-5764-4730-a84c-837e237b4eff', null) on conflict ("id") do update set "source_id" = excluded."source_id", "music_accompaniment_period_id" = excluded."music_accompaniment_period_id", "scope" = excluded."scope";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('967703f5-16dd-472f-9098-f12c5ce18dbc', 'brotherhood', 'La Sagrada Mortaja', 'sagrada-mortaja', 'Hermandad de Sevilla que realiza estación de penitencia el Viernes Santo.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

update public."brotherhoods" set "current_procession_day" = 'Viernes Santo', "notes" = 'Ficha cerrada en el macrolote Viernes Santo HC-016 de 2026.' where "entity_id" = '967703f5-16dd-472f-9098-f12c5ce18dbc';

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('1e6a659f-8c0b-4353-a743-79f223032d50', 'ae69bba1-f8f9-4bf2-ad71-cdc7c71a17ab', '967703f5-16dd-472f-9098-f12c5ce18dbc', 'Identidad, sede, titulares y patrimonio') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('f10ea129-f1ca-4ba5-a73d-adf6b2c5373a', 'd48e77e7-f907-4e86-8793-fd5bbc016d33', '967703f5-16dd-472f-9098-f12c5ce18dbc', 'Identidad institucional y cultos') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."brotherhood_images" ("id", "brotherhood_entity_id", "image_entity_id", "relation_type", "notes", "status")
values ('c83b0aac-c429-4050-b025-16f22a472710', '967703f5-16dd-472f-9098-f12c5ce18dbc', '8466314d-8cc5-4b69-aade-77d7ed517752', 'titular', 'Titular de la corporación.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."brotherhood_images" ("id", "brotherhood_entity_id", "image_entity_id", "relation_type", "notes", "status")
values ('44522254-8b1e-448a-9b3f-8ba32e39478d', '967703f5-16dd-472f-9098-f12c5ce18dbc', '9f174708-1943-4377-b4c0-9260b37afa4f', 'titular', 'Titular de la corporación.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."brotherhood_steps" ("id", "brotherhood_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('68a4e69f-0334-4a9d-9be1-7e1ab611e904', '967703f5-16dd-472f-9098-f12c5ce18dbc', 'b7a16491-126f-4c6c-b36d-bfb75c3f5db3', 'processional', 'Paso canónico 1 de la estación de penitencia.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_steps" ("id", "image_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('6cc00a3f-ae21-4cd6-a4c3-081a595728a1', '8466314d-8cc5-4b69-aade-77d7ed517752', 'b7a16491-126f-4c6c-b36d-bfb75c3f5db3', 'processional', 'Relación canónica del cortejo del Viernes Santo.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('7c6bca73-73cf-47f8-967d-df366831ab79', 'heritage_asset', 'Dieciocho ciriales de la Sagrada Mortaja', 'mortaja-dieciocho-ciriales-de-la-sagrada-mortaja', 'Conjunto singular recuperado por la corporación desde 1940.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."heritage_assets" ("entity_id", "parent_entity_id", "asset_type", "description", "current_condition", "is_current", "display_order", "is_featured")
values ('7c6bca73-73cf-47f8-967d-df366831ab79', '967703f5-16dd-472f-9098-f12c5ce18dbc', 'Insignias procesionales', 'Conjunto singular recuperado por la corporación desde 1940.', 'Conservado', true, 1, true) on conflict ("entity_id") do update set "parent_entity_id" = excluded."parent_entity_id", "asset_type" = excluded."asset_type", "description" = excluded."description", "current_condition" = excluded."current_condition", "is_current" = excluded."is_current", "display_order" = excluded."display_order", "is_featured" = excluded."is_featured";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('1994fb80-97a1-4f0a-acd8-7dffdf5b7967', 'ae69bba1-f8f9-4bf2-ad71-cdc7c71a17ab', '7c6bca73-73cf-47f8-967d-df366831ab79', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('f6a2c5b1-eb7b-4bde-9856-c3147a4ee6a8', 'heritage_asset', 'Paso de misterio de la Sagrada Mortaja', 'mortaja-paso-de-misterio-de-la-sagrada-mortaja', 'Canastilla barroca con imágenes del círculo de Pedro Roldán.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."heritage_assets" ("entity_id", "parent_entity_id", "asset_type", "description", "current_condition", "is_current", "display_order", "is_featured")
values ('f6a2c5b1-eb7b-4bde-9856-c3147a4ee6a8', '967703f5-16dd-472f-9098-f12c5ce18dbc', 'Paso procesional', 'Canastilla barroca con imágenes del círculo de Pedro Roldán.', 'Conservado', true, 2, false) on conflict ("entity_id") do update set "parent_entity_id" = excluded."parent_entity_id", "asset_type" = excluded."asset_type", "description" = excluded."description", "current_condition" = excluded."current_condition", "is_current" = excluded."is_current", "display_order" = excluded."display_order", "is_featured" = excluded."is_featured";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('8e0c2f83-8494-4af4-8d88-33a4d7e84e7b', 'ae69bba1-f8f9-4bf2-ad71-cdc7c71a17ab', 'f6a2c5b1-eb7b-4bde-9856-c3147a4ee6a8', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('13b7d437-d36e-4515-8753-c35bcfcbb35e', 'event', 'Traslado definitivo al antiguo convento de la Paz', 'traslado-definitivo-mortaja-paz-1967', 'La Hermandad formalizó la posesión de su actual sede.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."events" ("entity_id", "event_type", "event_date_text", "description", "event_category", "brotherhood_entity_id", "municipality_id", "event_status")
values ('13b7d437-d36e-4515-8753-c35bcfcbb35e', 'Hito histórico', '14 de diciembre de 1967', 'La Hermandad formalizó la posesión de su actual sede.', 'historical', '967703f5-16dd-472f-9098-f12c5ce18dbc', 'ca85889c-21fe-4367-8477-a57656b25da4', 'held') on conflict ("entity_id") do update set "event_type" = excluded."event_type", "event_date_text" = excluded."event_date_text", "description" = excluded."description", "event_category" = excluded."event_category", "brotherhood_entity_id" = excluded."brotherhood_entity_id", "municipality_id" = excluded."municipality_id", "event_status" = excluded."event_status";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('5139c964-cb81-4d0f-93a4-85b81d712303', 'ae69bba1-f8f9-4bf2-ad71-cdc7c71a17ab', '13b7d437-d36e-4515-8753-c35bcfcbb35e', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."brotherhood_habits" ("id", "brotherhood_entity_id", "name", "tunic_description", "hood_description", "cord_description", "sort_order", "notes", "status")
values ('157c25d0-f602-440e-921b-c44677ee940e', '967703f5-16dd-472f-9098-f12c5ce18dbc', 'Hábito de la Sagrada Mortaja', 'Túnica morada con botones negros y capa negra.', 'Antifaz negro.', 'Cíngulo amarillo.', 1, 'Hábito penitencial documentado por el Consejo.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "name" = excluded."name", "tunic_description" = excluded."tunic_description", "hood_description" = excluded."hood_description", "cord_description" = excluded."cord_description", "sort_order" = excluded."sort_order", "notes" = excluded."notes", "status" = excluded."status";

insert into public."source_links" ("id", "source_id", "brotherhood_habit_id", "scope")
values ('bf43d4c6-d19e-434a-8e4e-9094528056e9', 'ae69bba1-f8f9-4bf2-ad71-cdc7c71a17ab', '157c25d0-f602-440e-921b-c44677ee940e', null) on conflict ("id") do update set "source_id" = excluded."source_id", "brotherhood_habit_id" = excluded."brotherhood_habit_id", "scope" = excluded."scope";

update public."outings" set "brotherhood_entity_id" = '967703f5-16dd-472f-9098-f12c5ce18dbc', "outing_type" = 'Estación de Penitencia', "character" = 'ordinary', "title" = 'La Sagrada Mortaja · Estación de Penitencia 2026', "outing_date" = '2026-04-03', "year" = 2026, "departure_time" = '20:00', "return_time" = '02:00', "municipality_id" = 'ca85889c-21fe-4367-8477-a57656b25da4', "origin_place_id" = 'c7ca0d52-0ef1-4b1f-be02-f8f2e6886e92', "destination_text" = 'Santa Iglesia Catedral de Sevilla', "route_summary" = 'Itinerario oficial del Viernes Santo de 2026 con tránsito por la Carrera Oficial.', "description" = 'Estación de penitencia celebrada el Viernes Santo de 2026.', "event_status" = 'held', "status" = 'published', "slug" = 'mortaja-estacion-penitencia-2026' where "id" = '4dc85375-46a0-43c0-8ed5-d40f7b727c14';

insert into public."outing_entities" ("id", "outing_id", "entity_id", "role", "notes")
values ('aa072931-367c-4e9d-a969-198c5cf164dc', '4dc85375-46a0-43c0-8ed5-d40f7b727c14', '8466314d-8cc5-4b69-aade-77d7ed517752', 'processional_image', 'Imagen participante en el cortejo de 2026.') on conflict ("id") do update set "outing_id" = excluded."outing_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."outing_entities" ("id", "outing_id", "entity_id", "role", "notes")
values ('e63f1b6d-ec80-48b1-b81a-9b7589d6e763', '4dc85375-46a0-43c0-8ed5-d40f7b727c14', '9f174708-1943-4377-b4c0-9260b37afa4f', 'processional_image', 'Imagen participante en el cortejo de 2026.') on conflict ("id") do update set "outing_id" = excluded."outing_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "outing_id", "scope")
values ('bdefe6a2-255c-4c14-a512-b0fe3f39be4b', '8aeb970d-abfb-4e4c-a214-76f2d580e1e5', '4dc85375-46a0-43c0-8ed5-d40f7b727c14', null) on conflict ("id") do update set "source_id" = excluded."source_id", "outing_id" = excluded."outing_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "outing_id", "scope")
values ('f9b87fe6-8a93-487b-a5b1-5719f1e169bd', 'ae69bba1-f8f9-4bf2-ad71-cdc7c71a17ab', '4dc85375-46a0-43c0-8ed5-d40f7b727c14', null) on conflict ("id") do update set "source_id" = excluded."source_id", "outing_id" = excluded."outing_id", "scope" = excluded."scope";

insert into public."accompaniments" ("id", "outing_id", "band_entity_id", "step_entity_id", "position", "year", "notes", "status")
values ('cd4acbb6-13b5-4152-90b3-b7c9517634ca', '4dc85375-46a0-43c0-8ed5-d40f7b727c14', '3582a51c-25a5-493b-8c5a-9dc22f9d11d2', 'b7a16491-126f-4c6c-b36d-bfb75c3f5db3', 'Escolanía en el cortejo', 2026, 'Acompañamiento vigente y documentado para 2026.', 'published') on conflict ("id") do update set "outing_id" = excluded."outing_id", "band_entity_id" = excluded."band_entity_id", "step_entity_id" = excluded."step_entity_id", "position" = excluded."position", "year" = excluded."year", "notes" = excluded."notes", "status" = excluded."status";

insert into public."music_accompaniment_periods" ("id", "brotherhood_entity_id", "band_entity_id", "step_entity_id", "position", "outing_type", "date_from_text", "year_from", "is_current", "notes", "public_brotherhood_name", "public_step_name", "public_brotherhood_slug", "public_municipality_name", "public_municipality_slug", "public_province", "status")
values ('2a983e85-5364-45cd-ae6f-d2818c4ebfd1', '967703f5-16dd-472f-9098-f12c5ce18dbc', '3582a51c-25a5-493b-8c5a-9dc22f9d11d2', 'b7a16491-126f-4c6c-b36d-bfb75c3f5db3', 'Escolanía en el cortejo', 'Viernes Santo', 'Vigente en 2026', null, true, 'Vigencia constatada para 2026; no presupone continuidad posterior.', 'La Sagrada Mortaja', 'Escolanía en el cortejo', 'sagrada-mortaja', 'Sevilla', 'sevilla', 'Sevilla', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "band_entity_id" = excluded."band_entity_id", "step_entity_id" = excluded."step_entity_id", "position" = excluded."position", "outing_type" = excluded."outing_type", "date_from_text" = excluded."date_from_text", "year_from" = excluded."year_from", "is_current" = excluded."is_current", "notes" = excluded."notes", "public_brotherhood_name" = excluded."public_brotherhood_name", "public_step_name" = excluded."public_step_name", "public_brotherhood_slug" = excluded."public_brotherhood_slug", "public_municipality_name" = excluded."public_municipality_name", "public_municipality_slug" = excluded."public_municipality_slug", "public_province" = excluded."public_province", "status" = excluded."status";

insert into public."source_links" ("id", "source_id", "music_accompaniment_period_id", "scope")
values ('c1f3313f-87ee-481f-b3a4-da3a87d87553', 'ae69bba1-f8f9-4bf2-ad71-cdc7c71a17ab', '2a983e85-5364-45cd-ae6f-d2818c4ebfd1', null) on conflict ("id") do update set "source_id" = excluded."source_id", "music_accompaniment_period_id" = excluded."music_accompaniment_period_id", "scope" = excluded."scope";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('09d2a6f8-d498-4881-a549-468c5e0793fe', 'brotherhood', 'Soledad de San Buenaventura', 'soledad-san-buenaventura-sevilla', 'Hermandad de Sevilla que realiza estación de penitencia el Viernes Santo.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."brotherhoods" ("entity_id", "official_name", "popular_name", "foundation_text", "municipality_id", "canonical_see_place_id", "neighborhood", "website_url", "brotherhood_types", "current_procession_day", "history_text", "notes")
values ('09d2a6f8-d498-4881-a549-468c5e0793fe', 'Real, Ilustre y Franciscana Hermandad y Cofradía de Nazarenos de la Santa Cruz en el Monte Calvario, Santísimo Cristo de la Salvación y Nuestra Señora de la Soledad', 'Soledad de San Buenaventura', '1656; convertida en cofradía de penitencia en 1847', 'ca85889c-21fe-4367-8477-a57656b25da4', '3921a29c-d758-4559-91de-4cb243618a20', 'Arenal', 'https://soledadsanbuenaventura.com/', ARRAY['Penitencia']::text[], 'Viernes Santo', 'Nacida en 1656 en torno a la Santa Cruz de Caño Quebrado, se convirtió en cofradía de penitencia en 1847 y se trasladó a San Buenaventura en 1850. La Virgen, obra de Gabriel de Astorga, fue bendecida en 1851.', 'Ficha cerrada en el macrolote Viernes Santo HC-016 de 2026.') on conflict ("entity_id") do update set "official_name" = excluded."official_name", "popular_name" = excluded."popular_name", "foundation_text" = excluded."foundation_text", "municipality_id" = excluded."municipality_id", "canonical_see_place_id" = excluded."canonical_see_place_id", "neighborhood" = excluded."neighborhood", "website_url" = excluded."website_url", "brotherhood_types" = excluded."brotherhood_types", "current_procession_day" = excluded."current_procession_day", "history_text" = excluded."history_text", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('8d6bc73f-60f4-4b87-9e41-a663c435c3ac', 'ba7431e8-767d-4f70-a840-f6a1e9cc61d2', '09d2a6f8-d498-4881-a549-468c5e0793fe', 'Identidad, sede, titulares y patrimonio') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('4457db17-38da-4ecb-96f6-0f3000d71ba1', '45d3750e-edae-4060-aef0-06bd61f9b04c', '09d2a6f8-d498-4881-a549-468c5e0793fe', 'Identidad institucional y cultos') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."brotherhood_images" ("id", "brotherhood_entity_id", "image_entity_id", "relation_type", "notes", "status")
values ('c2c096a5-d736-40eb-8bd0-2829c37fbde1', '09d2a6f8-d498-4881-a549-468c5e0793fe', '6a4097f7-3c02-414c-a337-c70d085d4dc8', 'titular', 'Titular de la corporación.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."brotherhood_images" ("id", "brotherhood_entity_id", "image_entity_id", "relation_type", "notes", "status")
values ('2d56e45e-efaf-4860-a2dd-51c4eb487a07', '09d2a6f8-d498-4881-a549-468c5e0793fe', '6599fbfe-aad9-45fc-a348-e9f2813fed94', 'titular', 'Titular no procesional en la estación de penitencia de 2026.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."brotherhood_images" ("id", "brotherhood_entity_id", "image_entity_id", "relation_type", "notes", "status")
values ('00d5f4c4-6aba-44a7-9c92-9817838d73d0', '09d2a6f8-d498-4881-a549-468c5e0793fe', '851d3baf-9533-4550-8bea-99a7e6e1473f', 'titular', 'Titular no procesional en la estación de penitencia de 2026.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."brotherhood_steps" ("id", "brotherhood_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('c396aa98-cdd7-4745-9361-be65505fd736', '09d2a6f8-d498-4881-a549-468c5e0793fe', '1918582d-ac0e-4b2e-b099-a9746fd34635', 'processional', 'Paso canónico 1 de la estación de penitencia.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_steps" ("id", "image_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('a9565e50-58c6-44ce-8bfb-c1d52f8fc16c', '6a4097f7-3c02-414c-a337-c70d085d4dc8', '1918582d-ac0e-4b2e-b099-a9746fd34635', 'processional', 'Relación canónica del cortejo del Viernes Santo.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."cults" ("id", "brotherhood_entity_id", "cult_type", "title", "date_rule", "place_id", "description", "status", "is_recurring", "recurrence_label", "display_order")
values ('18cdce7d-2391-40f1-9f46-0c15841e18e2', '09d2a6f8-d498-4881-a549-468c5e0793fe', 'Quinario', 'Solemne Quinario al Santísimo Cristo de la Salvación', 'Cuaresma', '3921a29c-d758-4559-91de-4cb243618a20', 'Culto anual documentado por la corporación.', 'published', true, 'Anual', 1) on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "cult_type" = excluded."cult_type", "title" = excluded."title", "date_rule" = excluded."date_rule", "place_id" = excluded."place_id", "description" = excluded."description", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order";

insert into public."source_links" ("id", "source_id", "cult_id", "scope")
values ('22f090ca-8f11-4a50-8794-fa2bc29bf833', '45d3750e-edae-4060-aef0-06bd61f9b04c', '18cdce7d-2391-40f1-9f46-0c15841e18e2', null) on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id", "scope" = excluded."scope";

insert into public."cults" ("id", "brotherhood_entity_id", "cult_type", "title", "date_rule", "place_id", "description", "status", "is_recurring", "recurrence_label", "display_order")
values ('a403e1e3-d1a6-468b-97fe-5e5340e91853', '09d2a6f8-d498-4881-a549-468c5e0793fe', 'Función Principal', 'Función Principal de Instituto', 'Cuaresma', '3921a29c-d758-4559-91de-4cb243618a20', 'Culto anual documentado por la corporación.', 'published', true, 'Anual', 2) on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "cult_type" = excluded."cult_type", "title" = excluded."title", "date_rule" = excluded."date_rule", "place_id" = excluded."place_id", "description" = excluded."description", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order";

insert into public."source_links" ("id", "source_id", "cult_id", "scope")
values ('1c5b8552-c0c8-432f-a0da-7121ec196bb5', '45d3750e-edae-4060-aef0-06bd61f9b04c', 'a403e1e3-d1a6-468b-97fe-5e5340e91853', null) on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id", "scope" = excluded."scope";

insert into public."cults" ("id", "brotherhood_entity_id", "cult_type", "title", "date_rule", "place_id", "description", "status", "is_recurring", "recurrence_label", "display_order")
values ('e55f7b8b-ad18-41eb-b0af-14aa29034bc2', '09d2a6f8-d498-4881-a549-468c5e0793fe', 'Besamanos', 'Besamanos a Nuestra Señora de la Soledad', 'Cuaresma', '3921a29c-d758-4559-91de-4cb243618a20', 'Culto anual documentado por la corporación.', 'published', true, 'Anual', 3) on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "cult_type" = excluded."cult_type", "title" = excluded."title", "date_rule" = excluded."date_rule", "place_id" = excluded."place_id", "description" = excluded."description", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order";

insert into public."source_links" ("id", "source_id", "cult_id", "scope")
values ('b1b07419-49ae-4c2b-bf9d-d5bff5beea95', '45d3750e-edae-4060-aef0-06bd61f9b04c', 'e55f7b8b-ad18-41eb-b0af-14aa29034bc2', null) on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id", "scope" = excluded."scope";

insert into public."cults" ("id", "brotherhood_entity_id", "cult_type", "title", "date_rule", "place_id", "description", "status", "is_recurring", "recurrence_label", "display_order")
values ('2e536465-35f5-43f7-a388-3d740cbe0aba', '09d2a6f8-d498-4881-a549-468c5e0793fe', 'Función', 'Función a Nuestra Señora de la Soledad', 'Septiembre', '3921a29c-d758-4559-91de-4cb243618a20', 'Culto anual documentado por la corporación.', 'published', true, 'Anual', 4) on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "cult_type" = excluded."cult_type", "title" = excluded."title", "date_rule" = excluded."date_rule", "place_id" = excluded."place_id", "description" = excluded."description", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order";

insert into public."source_links" ("id", "source_id", "cult_id", "scope")
values ('85cb2f3f-3014-4b07-a2cc-754fb81ffc48', '45d3750e-edae-4060-aef0-06bd61f9b04c', '2e536465-35f5-43f7-a388-3d740cbe0aba', null) on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id", "scope" = excluded."scope";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('7ef7b631-014d-4cac-8952-368558edac1a', 'heritage_asset', 'Cruz de Guía de la Soledad', 'soledad-cruz-de-guia-de-la-soledad', 'Copia de 1947 de la Cruz fundacional.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."heritage_assets" ("entity_id", "parent_entity_id", "asset_type", "description", "current_condition", "is_current", "display_order", "is_featured")
values ('7ef7b631-014d-4cac-8952-368558edac1a', '09d2a6f8-d498-4881-a549-468c5e0793fe', 'Insignia procesional', 'Copia de 1947 de la Cruz fundacional.', 'Conservado', true, 1, true) on conflict ("entity_id") do update set "parent_entity_id" = excluded."parent_entity_id", "asset_type" = excluded."asset_type", "description" = excluded."description", "current_condition" = excluded."current_condition", "is_current" = excluded."is_current", "display_order" = excluded."display_order", "is_featured" = excluded."is_featured";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('d48d546b-d19f-40b2-9fc4-b4d266362bee', 'ba7431e8-767d-4f70-a840-f6a1e9cc61d2', '7ef7b631-014d-4cac-8952-368558edac1a', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('c97a1c6d-f48f-4d53-a9b0-cd3efa79754b', 'heritage_asset', 'Paso de Nuestra Señora de la Soledad', 'soledad-paso-de-nuestra-senora-de-la-soledad', 'Caoba y plata con diseño de Emilio García Armenta y talla de Guzmán Bejarano.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."heritage_assets" ("entity_id", "parent_entity_id", "asset_type", "description", "current_condition", "is_current", "display_order", "is_featured")
values ('c97a1c6d-f48f-4d53-a9b0-cd3efa79754b', '09d2a6f8-d498-4881-a549-468c5e0793fe', 'Paso procesional', 'Caoba y plata con diseño de Emilio García Armenta y talla de Guzmán Bejarano.', 'Conservado', true, 2, false) on conflict ("entity_id") do update set "parent_entity_id" = excluded."parent_entity_id", "asset_type" = excluded."asset_type", "description" = excluded."description", "current_condition" = excluded."current_condition", "is_current" = excluded."is_current", "display_order" = excluded."display_order", "is_featured" = excluded."is_featured";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('8c5110fb-5927-4076-be0a-b2a43eff32f8', 'ba7431e8-767d-4f70-a840-f6a1e9cc61d2', 'c97a1c6d-f48f-4d53-a9b0-cd3efa79754b', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('b5c388ee-c047-48bf-b7c3-06c90be5a0d0', 'event', 'Bendición de Nuestra Señora de la Soledad', 'bendicion-soledad-san-buenaventura-1851', 'La imagen de Gabriel de Astorga fue bendecida el Viernes de Dolores.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."events" ("entity_id", "event_type", "event_date_text", "description", "event_category", "brotherhood_entity_id", "municipality_id", "event_status")
values ('b5c388ee-c047-48bf-b7c3-06c90be5a0d0', 'Hito histórico', '11 de abril de 1851', 'La imagen de Gabriel de Astorga fue bendecida el Viernes de Dolores.', 'historical', '09d2a6f8-d498-4881-a549-468c5e0793fe', 'ca85889c-21fe-4367-8477-a57656b25da4', 'held') on conflict ("entity_id") do update set "event_type" = excluded."event_type", "event_date_text" = excluded."event_date_text", "description" = excluded."description", "event_category" = excluded."event_category", "brotherhood_entity_id" = excluded."brotherhood_entity_id", "municipality_id" = excluded."municipality_id", "event_status" = excluded."event_status";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('f3613255-4f77-4674-9a4f-f14aec657bbc', 'ba7431e8-767d-4f70-a840-f6a1e9cc61d2', 'b5c388ee-c047-48bf-b7c3-06c90be5a0d0', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."brotherhood_habits" ("id", "brotherhood_entity_id", "name", "tunic_description", "hood_description", "cord_description", "sort_order", "notes", "status")
values ('830b4c55-cd3d-48bf-a214-f102a06bacc8', '09d2a6f8-d498-4881-a549-468c5e0793fe', 'Hábito de la Soledad de San Buenaventura', 'Túnica blanca de cola.', 'Antifaz negro.', 'Cinturón de esparto.', 1, 'Hábito penitencial documentado por el Consejo.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "name" = excluded."name", "tunic_description" = excluded."tunic_description", "hood_description" = excluded."hood_description", "cord_description" = excluded."cord_description", "sort_order" = excluded."sort_order", "notes" = excluded."notes", "status" = excluded."status";

insert into public."source_links" ("id", "source_id", "brotherhood_habit_id", "scope")
values ('76897212-930a-4e65-b82a-f0f81525cff8', 'ba7431e8-767d-4f70-a840-f6a1e9cc61d2', '830b4c55-cd3d-48bf-a214-f102a06bacc8', null) on conflict ("id") do update set "source_id" = excluded."source_id", "brotherhood_habit_id" = excluded."brotherhood_habit_id", "scope" = excluded."scope";

insert into public."outings" ("id", "brotherhood_entity_id", "outing_type", "character", "title", "outing_date", "year", "departure_time", "return_time", "municipality_id", "origin_place_id", "destination_text", "route_summary", "description", "event_status", "status", "slug")
values ('ed5311a5-d048-4bfa-903a-63546329d8c4', '09d2a6f8-d498-4881-a549-468c5e0793fe', 'Estación de Penitencia', 'ordinary', 'Soledad de San Buenaventura · Estación de Penitencia 2026', '2026-04-03', 2026, '17:50', '22:45', 'ca85889c-21fe-4367-8477-a57656b25da4', '3921a29c-d758-4559-91de-4cb243618a20', 'Santa Iglesia Catedral de Sevilla', 'Itinerario oficial del Viernes Santo de 2026 con tránsito por la Carrera Oficial.', 'Estación de penitencia celebrada el Viernes Santo de 2026.', 'held', 'published', 'soledad-estacion-penitencia-2026') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "outing_type" = excluded."outing_type", "character" = excluded."character", "title" = excluded."title", "outing_date" = excluded."outing_date", "year" = excluded."year", "departure_time" = excluded."departure_time", "return_time" = excluded."return_time", "municipality_id" = excluded."municipality_id", "origin_place_id" = excluded."origin_place_id", "destination_text" = excluded."destination_text", "route_summary" = excluded."route_summary", "description" = excluded."description", "event_status" = excluded."event_status", "status" = excluded."status", "slug" = excluded."slug";

insert into public."outing_entities" ("id", "outing_id", "entity_id", "role", "notes")
values ('4472b3b3-d60e-480c-9030-7f5a5044799b', 'ed5311a5-d048-4bfa-903a-63546329d8c4', '6a4097f7-3c02-414c-a337-c70d085d4dc8', 'processional_image', 'Imagen participante en el cortejo de 2026.') on conflict ("id") do update set "outing_id" = excluded."outing_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "outing_id", "scope")
values ('e57cf088-7004-429e-81a7-66fd5a89ff21', '8aeb970d-abfb-4e4c-a214-76f2d580e1e5', 'ed5311a5-d048-4bfa-903a-63546329d8c4', null) on conflict ("id") do update set "source_id" = excluded."source_id", "outing_id" = excluded."outing_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "outing_id", "scope")
values ('8d045811-de49-4525-80b6-44f4efbd4ac0', 'ba7431e8-767d-4f70-a840-f6a1e9cc61d2', 'ed5311a5-d048-4bfa-903a-63546329d8c4', null) on conflict ("id") do update set "source_id" = excluded."source_id", "outing_id" = excluded."outing_id", "scope" = excluded."scope";

insert into public."accompaniments" ("id", "outing_id", "band_entity_id", "step_entity_id", "position", "year", "notes", "status")
values ('1c3388a0-8f1e-4a56-ab50-6f45b5a7cc94', 'ed5311a5-d048-4bfa-903a-63546329d8c4', 'd6852052-92bb-4b54-b551-e52b656dea6d', '1918582d-ac0e-4b2e-b099-a9746fd34635', 'Tras el paso de Nuestra Señora de la Soledad', 2026, 'Acompañamiento vigente y documentado para 2026.', 'published') on conflict ("id") do update set "outing_id" = excluded."outing_id", "band_entity_id" = excluded."band_entity_id", "step_entity_id" = excluded."step_entity_id", "position" = excluded."position", "year" = excluded."year", "notes" = excluded."notes", "status" = excluded."status";

insert into public."music_accompaniment_periods" ("id", "brotherhood_entity_id", "band_entity_id", "step_entity_id", "position", "outing_type", "date_from_text", "year_from", "is_current", "notes", "public_brotherhood_name", "public_step_name", "public_brotherhood_slug", "public_municipality_name", "public_municipality_slug", "public_province", "status")
values ('7ac43d2d-f006-4d86-9f21-20075b4ca806', '09d2a6f8-d498-4881-a549-468c5e0793fe', 'd6852052-92bb-4b54-b551-e52b656dea6d', '1918582d-ac0e-4b2e-b099-a9746fd34635', 'Tras el paso de Nuestra Señora de la Soledad', 'Viernes Santo', 'Vigente en 2026', 2026, true, 'Vigencia constatada para 2026; no presupone continuidad posterior.', 'Soledad de San Buenaventura', 'Tras el paso de Nuestra Señora de la Soledad', 'soledad-san-buenaventura-sevilla', 'Sevilla', 'sevilla', 'Sevilla', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "band_entity_id" = excluded."band_entity_id", "step_entity_id" = excluded."step_entity_id", "position" = excluded."position", "outing_type" = excluded."outing_type", "date_from_text" = excluded."date_from_text", "year_from" = excluded."year_from", "is_current" = excluded."is_current", "notes" = excluded."notes", "public_brotherhood_name" = excluded."public_brotherhood_name", "public_step_name" = excluded."public_step_name", "public_brotherhood_slug" = excluded."public_brotherhood_slug", "public_municipality_name" = excluded."public_municipality_name", "public_municipality_slug" = excluded."public_municipality_slug", "public_province" = excluded."public_province", "status" = excluded."status";

insert into public."source_links" ("id", "source_id", "music_accompaniment_period_id", "scope")
values ('862b6192-7b24-45bc-bc99-8b6aba095a42', 'ba7431e8-767d-4f70-a840-f6a1e9cc61d2', '7ac43d2d-f006-4d86-9f21-20075b4ca806', null) on conflict ("id") do update set "source_id" = excluded."source_id", "music_accompaniment_period_id" = excluded."music_accompaniment_period_id", "scope" = excluded."scope";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('8f6eb70e-312b-4f8f-a06a-d9701838f3e3', 'band', 'Trío de Capilla Olmo, Vergara y Coca', 'trio-capilla-olmo-vergara-coca', 'Formación de capilla documentada en la Sagrada Mortaja en 2026.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."bands" ("entity_id", "band_type", "municipality_id", "description")
values ('8f6eb70e-312b-4f8f-a06a-d9701838f3e3', 'Música de capilla', 'ca85889c-21fe-4367-8477-a57656b25da4', 'Trío de capilla del cortejo de la Sagrada Mortaja.') on conflict ("entity_id") do update set "band_type" = excluded."band_type", "municipality_id" = excluded."municipality_id", "description" = excluded."description";

insert into public."music_accompaniment_periods" ("id", "brotherhood_entity_id", "band_entity_id", "step_entity_id", "position", "outing_type", "date_from_text", "year_from", "is_current", "notes", "public_brotherhood_name", "public_step_name", "public_brotherhood_slug", "public_municipality_name", "public_municipality_slug", "public_province", "status")
values ('fed0da79-3a26-4bba-8a90-dce3ea8d6d41', '967703f5-16dd-472f-9098-f12c5ce18dbc', '8f6eb70e-312b-4f8f-a06a-d9701838f3e3', 'b7a16491-126f-4c6c-b36d-bfb75c3f5db3', 'Música de capilla en el cortejo', 'Viernes Santo', 'Vigente en 2026', 2026, true, 'Vigencia constatada en 2026.', 'La Sagrada Mortaja', 'Paso de misterio', 'sagrada-mortaja', 'Sevilla', 'sevilla', 'Sevilla', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "band_entity_id" = excluded."band_entity_id", "step_entity_id" = excluded."step_entity_id", "position" = excluded."position", "outing_type" = excluded."outing_type", "date_from_text" = excluded."date_from_text", "year_from" = excluded."year_from", "is_current" = excluded."is_current", "notes" = excluded."notes", "public_brotherhood_name" = excluded."public_brotherhood_name", "public_step_name" = excluded."public_step_name", "public_brotherhood_slug" = excluded."public_brotherhood_slug", "public_municipality_name" = excluded."public_municipality_name", "public_municipality_slug" = excluded."public_municipality_slug", "public_province" = excluded."public_province", "status" = excluded."status";

insert into public."accompaniments" ("id", "outing_id", "band_entity_id", "step_entity_id", "position", "year", "notes", "status")
values ('eb2088a9-2827-4e99-9f78-8fab1bb3d9b1', '4dc85375-46a0-43c0-8ed5-d40f7b727c14', '8f6eb70e-312b-4f8f-a06a-d9701838f3e3', 'b7a16491-126f-4c6c-b36d-bfb75c3f5db3', 'Música de capilla en el cortejo', 2026, 'Acompañamiento vigente en 2026.', 'published') on conflict ("id") do update set "outing_id" = excluded."outing_id", "band_entity_id" = excluded."band_entity_id", "step_entity_id" = excluded."step_entity_id", "position" = excluded."position", "year" = excluded."year", "notes" = excluded."notes", "status" = excluded."status";

insert into public."source_links" ("id", "source_id", "music_accompaniment_period_id", "scope")
values ('e8923e5f-4c45-4ae7-bc93-4b8e9ce2c4bf', 'ae69bba1-f8f9-4bf2-ad71-cdc7c71a17ab', 'fed0da79-3a26-4bba-8a90-dce3ea8d6d41', null) on conflict ("id") do update set "source_id" = excluded."source_id", "music_accompaniment_period_id" = excluded."music_accompaniment_period_id", "scope" = excluded."scope";

commit;
