-- HC-016 · macrolote transversal: Jueves Santo de Sevilla
-- Cierra siete corporaciones; preserva Los Negritos y El Valle, remata Las Cigarreras y Quinta Angustia, y publica La Exaltación, Monte-Sión y Pasión.
-- Control de homónimos: Pasión no reutiliza Pasión y Muerte; Virgen del Valle no reutiliza la patrona de Écija; Monte-Sión conserva su Cristo de la Salud propio.
-- Solo DML. Receta idempotente archivada fuera de la cadena estructural activa.
-- Lote gobernado c0160019-0000-4000-8000-000000000001: 223/223, 0 inválidas, 0 fallos.

begin;

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('4a7ba56e-ef86-4859-b8a7-d5fd954647c7', 'La Exaltación · Consejo de Hermandades', 'https://www.hermandades-de-sevilla.org/semanasanta/js_la_exaltacion.html', 'web', 'Consejo General de Hermandades y Cofradías de Sevilla', '2026-09-14', 'Identidad, sede, titulares, pasos, hábito, capataces, patrimonio y música en 2026.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('b5b287e5-afce-41f4-aa72-f12c520c7bff', 'Las Cigarreras · Consejo de Hermandades', 'https://www.hermandades-de-sevilla.org/semanasanta/js_columna_y_azotes.html', 'web', 'Consejo General de Hermandades y Cofradías de Sevilla', '2026-09-14', 'Identidad, sede, titulares, pasos, hábito, patrimonio y música en 2026.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('33b540d5-e003-4af7-a7e8-8004f15abb84', 'Monte-Sión · Consejo de Hermandades', 'https://www.hermandades-de-sevilla.org/semanasanta/js_montesion.html', 'web', 'Consejo General de Hermandades y Cofradías de Sevilla', '2026-09-14', 'Identidad, sede, titulares, pasos, hábito, capataces, patrimonio y música en 2026.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('76c67856-725e-4542-a6ce-c55cf11527db', 'Pasión · Consejo de Hermandades', 'https://www.hermandades-de-sevilla.org/semanasanta/js_pasion.html', 'web', 'Consejo General de Hermandades y Cofradías de Sevilla', '2026-09-14', 'Identidad, sede, titulares, pasos, hábito, capataces, patrimonio y música en 2026.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('7cf91fd1-7bc8-4310-a1f5-d8776907067d', 'Web oficial · Hermandad de la Exaltación', 'https://www.laexaltacion.org/', 'web', 'Hermandad de la Exaltación', '2026-09-14', 'Referencia institucional y cultual de la corporación.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('191c15b5-3827-4758-9ecf-6c6cae97a2ae', 'Web oficial · Hermandad de las Cigarreras', 'https://www.columnayazotes.es/', 'web', 'Hermandad de las Cigarreras', '2026-09-14', 'Referencia institucional y cultual de la corporación.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('f818365c-1a79-43fb-9407-e0a3bee5eea3', 'Web oficial · Hermandad de Monte-Sión', 'https://hermandaddemontesion.com/', 'web', 'Hermandad de Monte-Sión', '2026-09-14', 'Referencia institucional y cultual de la corporación.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('718c04f5-0cee-4440-89da-698aa75f3aee', 'Cultos · Quinta Angustia', 'https://laquintaangustia.org/hermandad/cultos/', 'web', 'Hermandad de la Quinta Angustia', '2026-09-14', 'Calendario estable de cultos de la corporación.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "accessed_at", "notes")
values ('1279a4de-2ccc-45aa-a58c-f216c9fb5b27', 'Web oficial · Archicofradía de Pasión', 'https://www.hermandaddepasion.org/', 'web', 'Archicofradía de Pasión', '2026-09-14', 'Referencia institucional y cultual de la corporación.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."places" ("id", "municipality_id", "name", "slug", "place_type", "address", "notes")
values ('0c2cdcea-f026-4bd6-95e6-f24d5fbe111e', 'ca85889c-21fe-4367-8477-a57656b25da4', 'Capilla de Nuestra Señora del Rosario de Monte-Sión', 'capilla-rosario-monte-sion-sevilla', 'Capilla', 'Calle Feria, 29, Sevilla', 'Sede canónica de la Hermandad de Monte-Sión.') on conflict ("id") do update set "municipality_id" = excluded."municipality_id", "name" = excluded."name", "slug" = excluded."slug", "place_type" = excluded."place_type", "address" = excluded."address", "notes" = excluded."notes";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('180d4b2a-9eef-468b-988c-6763dc13a368', 'image', 'Santísimo Cristo de la Exaltación', 'santisimo-cristo-exaltacion-sevilla', 'Crucificado titular de la Hermandad de la Exaltación, atribuido al círculo de Pedro Roldán.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('d686b479-13cd-4109-83c2-4d666df00155', 'image', 'Nuestra Señora de las Lágrimas', 'nuestra-senora-lagrimas-exaltacion-sevilla', 'Dolorosa titular anónima del siglo XVII, atribuida tradicionalmente a Luisa Roldán.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('c0b3516c-08ff-44ce-9377-71d042cd7870', 'image', 'Señor de la Sagrada Oración en el Huerto', 'senor-oracion-huerto-monte-sion-sevilla', 'Titular cristífero de Monte-Sión, obra del siglo XVII atribuida a Pedro Roldán.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('778b7f75-d530-45cd-9b3e-179caf2b46ae', 'image', 'María Santísima del Rosario en sus Misterios Dolorosos Coronada', 'maria-santisima-rosario-monte-sion-sevilla', 'Dolorosa titular de Monte-Sión, anónima del siglo XVI y coronada canónicamente en 2004.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('3a8d24be-e26c-499f-a6bd-061698c89da0', 'image', 'Santísimo Cristo de la Salud', 'santisimo-cristo-salud-monte-sion-sevilla', 'Crucificado titular de Monte-Sión, obra de Luis Ortega Bru.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('a658cd94-3577-4953-a98c-2657c9d6222a', 'image', 'Nuestro Padre Jesús de la Pasión', 'nuestro-padre-jesus-pasion-sevilla', 'Nazareno de Juan Martínez Montañés realizado hacia 1610–1615.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('cb0b275f-a57b-4bee-88cb-d52aaf17dcc5', 'image', 'Nuestra Madre y Señora de la Merced', 'nuestra-madre-senora-merced-pasion-sevilla', 'Dolorosa de Sebastián Santos Rojas realizada en 1966.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."images" ("entity_id", "image_type", "execution_date_text", "current_condition", "description", "is_dress_image")
values ('180d4b2a-9eef-468b-988c-6763dc13a368', 'Cristo crucificado', 'Segunda mitad del siglo XVII', 'extant', 'Imagen titular documentada por la ficha institucional del Consejo.', false) on conflict ("entity_id") do update set "image_type" = excluded."image_type", "execution_date_text" = excluded."execution_date_text", "current_condition" = excluded."current_condition", "description" = excluded."description", "is_dress_image" = excluded."is_dress_image";

insert into public."image_authorships" ("id", "image_entity_id", "agent_entity_id", "authorship_type", "role_name", "date_from_text", "certainty", "notes", "status")
values ('0f8af27b-c9a0-45c9-8fe9-c4d5c0b2def0', '180d4b2a-9eef-468b-988c-6763dc13a368', '262d4bc3-0c79-4344-b40c-9a2f689aafb5', 'attributed_to', 'Escultor', 'Segunda mitad del siglo XVII', 'attributed', 'Autoría según la fuente institucional.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "agent_entity_id" = excluded."agent_entity_id", "authorship_type" = excluded."authorship_type", "role_name" = excluded."role_name", "date_from_text" = excluded."date_from_text", "certainty" = excluded."certainty", "notes" = excluded."notes", "status" = excluded."status";

insert into public."images" ("entity_id", "image_type", "execution_date_text", "current_condition", "description", "is_dress_image")
values ('d686b479-13cd-4109-83c2-4d666df00155', 'Dolorosa', 'Siglo XVII', 'extant', 'Imagen titular documentada por la ficha institucional del Consejo.', true) on conflict ("entity_id") do update set "image_type" = excluded."image_type", "execution_date_text" = excluded."execution_date_text", "current_condition" = excluded."current_condition", "description" = excluded."description", "is_dress_image" = excluded."is_dress_image";

insert into public."images" ("entity_id", "image_type", "execution_date_text", "current_condition", "description", "is_dress_image")
values ('c0b3516c-08ff-44ce-9377-71d042cd7870', 'Cristo orante', 'Siglo XVII; cuerpo de 1942 retallado en 1976', 'extant', 'Imagen titular documentada por la ficha institucional del Consejo.', false) on conflict ("entity_id") do update set "image_type" = excluded."image_type", "execution_date_text" = excluded."execution_date_text", "current_condition" = excluded."current_condition", "description" = excluded."description", "is_dress_image" = excluded."is_dress_image";

insert into public."image_authorships" ("id", "image_entity_id", "agent_entity_id", "authorship_type", "role_name", "date_from_text", "certainty", "notes", "status")
values ('f019e153-779b-450d-a189-d8df2218da81', 'c0b3516c-08ff-44ce-9377-71d042cd7870', '262d4bc3-0c79-4344-b40c-9a2f689aafb5', 'attributed_to', 'Escultor', 'Siglo XVII; cuerpo de 1942 retallado en 1976', 'attributed', 'Autoría según la fuente institucional.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "agent_entity_id" = excluded."agent_entity_id", "authorship_type" = excluded."authorship_type", "role_name" = excluded."role_name", "date_from_text" = excluded."date_from_text", "certainty" = excluded."certainty", "notes" = excluded."notes", "status" = excluded."status";

insert into public."images" ("entity_id", "image_type", "execution_date_text", "current_condition", "description", "is_dress_image")
values ('778b7f75-d530-45cd-9b3e-179caf2b46ae', 'Dolorosa', 'Siglo XVI', 'extant', 'Imagen titular documentada por la ficha institucional del Consejo.', true) on conflict ("entity_id") do update set "image_type" = excluded."image_type", "execution_date_text" = excluded."execution_date_text", "current_condition" = excluded."current_condition", "description" = excluded."description", "is_dress_image" = excluded."is_dress_image";

insert into public."images" ("entity_id", "image_type", "execution_date_text", "current_condition", "description", "is_dress_image")
values ('3a8d24be-e26c-499f-a6bd-061698c89da0', 'Cristo crucificado', 'Siglo XX', 'extant', 'Imagen titular documentada por la ficha institucional del Consejo.', false) on conflict ("entity_id") do update set "image_type" = excluded."image_type", "execution_date_text" = excluded."execution_date_text", "current_condition" = excluded."current_condition", "description" = excluded."description", "is_dress_image" = excluded."is_dress_image";

insert into public."image_authorships" ("id", "image_entity_id", "agent_entity_id", "authorship_type", "role_name", "date_from_text", "certainty", "notes", "status")
values ('c91a522a-5618-4c2f-9b6b-3b1d212c6b45', '3a8d24be-e26c-499f-a6bd-061698c89da0', '160be307-5396-41a2-8903-7467a8c330f3', 'author', 'Escultor', 'Siglo XX', 'documented', 'Autoría según la fuente institucional.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "agent_entity_id" = excluded."agent_entity_id", "authorship_type" = excluded."authorship_type", "role_name" = excluded."role_name", "date_from_text" = excluded."date_from_text", "certainty" = excluded."certainty", "notes" = excluded."notes", "status" = excluded."status";

insert into public."images" ("entity_id", "image_type", "execution_date_text", "current_condition", "description", "is_dress_image")
values ('a658cd94-3577-4953-a98c-2657c9d6222a', 'Cristo · Nazareno', 'Hacia 1610–1615', 'extant', 'Imagen titular documentada por la ficha institucional del Consejo.', true) on conflict ("entity_id") do update set "image_type" = excluded."image_type", "execution_date_text" = excluded."execution_date_text", "current_condition" = excluded."current_condition", "description" = excluded."description", "is_dress_image" = excluded."is_dress_image";

insert into public."image_authorships" ("id", "image_entity_id", "agent_entity_id", "authorship_type", "role_name", "date_from_text", "certainty", "notes", "status")
values ('c88540a7-0b60-4eaa-bd05-b0e27958630f', 'a658cd94-3577-4953-a98c-2657c9d6222a', '57db8e95-ba59-4584-be70-6a68a145286f', 'author', 'Escultor', 'Hacia 1610–1615', 'documented', 'Autoría según la fuente institucional.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "agent_entity_id" = excluded."agent_entity_id", "authorship_type" = excluded."authorship_type", "role_name" = excluded."role_name", "date_from_text" = excluded."date_from_text", "certainty" = excluded."certainty", "notes" = excluded."notes", "status" = excluded."status";

insert into public."images" ("entity_id", "image_type", "execution_date_text", "current_condition", "description", "is_dress_image")
values ('cb0b275f-a57b-4bee-88cb-d52aaf17dcc5', 'Dolorosa', '1966', 'extant', 'Imagen titular documentada por la ficha institucional del Consejo.', true) on conflict ("entity_id") do update set "image_type" = excluded."image_type", "execution_date_text" = excluded."execution_date_text", "current_condition" = excluded."current_condition", "description" = excluded."description", "is_dress_image" = excluded."is_dress_image";

insert into public."image_authorships" ("id", "image_entity_id", "agent_entity_id", "authorship_type", "role_name", "date_from_text", "certainty", "notes", "status")
values ('816430b2-7fd6-4b65-9ab0-0725cca587a6', 'cb0b275f-a57b-4bee-88cb-d52aaf17dcc5', '13fb6b36-f879-41ef-ab19-90d97e693972', 'author', 'Escultor', '1966', 'documented', 'Autoría según la fuente institucional.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "agent_entity_id" = excluded."agent_entity_id", "authorship_type" = excluded."authorship_type", "role_name" = excluded."role_name", "date_from_text" = excluded."date_from_text", "certainty" = excluded."certainty", "notes" = excluded."notes", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('9fe6b1eb-eb97-45b6-adc2-daac78ed50f2', 'step', 'Paso de palio de Nuestra Señora de las Lágrimas', 'paso-palio-lagrimas-exaltacion-sevilla', 'Paso de palio con bordados de Rodríguez Ojeda e Hijos del Olmo y orfebrería de Villarreal.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('ac693db2-a465-4542-a5e2-fd69ff61fd34', 'step', 'Paso de misterio de la Sagrada Oración en el Huerto', 'paso-misterio-oracion-huerto-monte-sion-sevilla', 'Misterio de la Oración en el Huerto con canastilla de Manuel Calvo Camacho.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('c459a65b-82e6-4b0a-9428-7e857524fb29', 'step', 'Paso de palio de María Santísima del Rosario', 'paso-palio-rosario-monte-sion-sevilla', 'Paso de palio realizado en 2004 con orfebrería de Ramón León, Villarreal y Hermanos Delgado.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('fefa1e26-3c40-42c5-b3d9-445b7bdd757b', 'step', 'Paso de Nuestro Padre Jesús de la Pasión', 'paso-nuestro-padre-jesus-pasion-sevilla', 'Paso diseñado y ejecutado por Cayetano González en 1943.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

update public."entities" set "status" = 'published' where "id" = '28da3455-77f9-488f-995b-589e5a19aa1c';

insert into public."steps" ("entity_id", "step_type", "execution_date_text", "style", "description", "current_condition")
values ('28da3455-77f9-488f-995b-589e5a19aa1c', 'Misterio', 'Siglos XVII–XX', 'Barroco', 'Paso del misterio de la Exaltación con relieves históricos y figuras vinculadas al círculo de Pedro Roldán.', 'preserved') on conflict ("entity_id") do update set "step_type" = excluded."step_type", "execution_date_text" = excluded."execution_date_text", "style" = excluded."style", "description" = excluded."description", "current_condition" = excluded."current_condition";

update public."entities" set "status" = 'published' where "id" = '9fe6b1eb-eb97-45b6-adc2-daac78ed50f2';

insert into public."steps" ("entity_id", "step_type", "execution_date_text", "style", "description", "current_condition")
values ('9fe6b1eb-eb97-45b6-adc2-daac78ed50f2', 'Palio', 'Siglo XX', 'Regionalista', 'Palio de Nuestra Señora de las Lágrimas.', 'preserved') on conflict ("entity_id") do update set "step_type" = excluded."step_type", "execution_date_text" = excluded."execution_date_text", "style" = excluded."style", "description" = excluded."description", "current_condition" = excluded."current_condition";

update public."entities" set "status" = 'published' where "id" = 'ac693db2-a465-4542-a5e2-fd69ff61fd34';

insert into public."steps" ("entity_id", "step_type", "execution_date_text", "style", "description", "current_condition")
values ('ac693db2-a465-4542-a5e2-fd69ff61fd34', 'Misterio', '1957; restaurado y dorado entre 1985 y 1987', 'Neobarroco', 'Paso del Señor de la Oración en el Huerto.', 'preserved') on conflict ("entity_id") do update set "step_type" = excluded."step_type", "execution_date_text" = excluded."execution_date_text", "style" = excluded."style", "description" = excluded."description", "current_condition" = excluded."current_condition";

update public."entities" set "status" = 'published' where "id" = 'c459a65b-82e6-4b0a-9428-7e857524fb29';

insert into public."steps" ("entity_id", "step_type", "execution_date_text", "style", "description", "current_condition")
values ('c459a65b-82e6-4b0a-9428-7e857524fb29', 'Palio', '2004', 'Bordado y orfebrería', 'Paso de palio de la Virgen del Rosario.', 'preserved') on conflict ("entity_id") do update set "step_type" = excluded."step_type", "execution_date_text" = excluded."execution_date_text", "style" = excluded."style", "description" = excluded."description", "current_condition" = excluded."current_condition";

update public."entities" set "status" = 'published' where "id" = 'fefa1e26-3c40-42c5-b3d9-445b7bdd757b';

insert into public."steps" ("entity_id", "step_type", "execution_date_text", "style", "description", "current_condition")
values ('fefa1e26-3c40-42c5-b3d9-445b7bdd757b', 'Nazareno', '1943–1949', 'Neobarroco', 'Paso de plata, marfil y madera dorada de Nuestro Padre Jesús de la Pasión.', 'preserved') on conflict ("entity_id") do update set "step_type" = excluded."step_type", "execution_date_text" = excluded."execution_date_text", "style" = excluded."style", "description" = excluded."description", "current_condition" = excluded."current_condition";

update public."entities" set "status" = 'published' where "id" = 'ea34723d-ab74-482a-b7ff-776afda6f50a';

insert into public."steps" ("entity_id", "step_type", "execution_date_text", "style", "description", "current_condition")
values ('ea34723d-ab74-482a-b7ff-776afda6f50a', 'Palio', '1929; orfebrería renovada posteriormente', 'Neogótico', 'Paso de palio de Nuestra Madre y Señora de la Merced.', 'preserved') on conflict ("entity_id") do update set "step_type" = excluded."step_type", "execution_date_text" = excluded."execution_date_text", "style" = excluded."style", "description" = excluded."description", "current_condition" = excluded."current_condition";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('76eebd4c-3364-4744-9b12-2f4f37331e83', 'brotherhood', 'La Exaltación', 'hermandad-de-la-exaltacion-sevilla', 'Hermandad de Sevilla que realiza estación de penitencia el Jueves Santo.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."brotherhoods" ("entity_id", "official_name", "popular_name", "foundation_text", "municipality_id", "canonical_see_place_id", "neighborhood", "website_url", "brotherhood_types", "current_procession_day", "history_text", "notes")
values ('76eebd4c-3364-4744-9b12-2f4f37331e83', 'Pontificia, Real y Muy Ilustre Hermandad Sacramental, Purísima Concepción, Ánimas Benditas del Purgatorio, San Sebastián Mártir, Santa Catalina de Alejandría y Archicofradía de Nazarenos del Santísimo Cristo de la Exaltación y Nuestra Señora de las Lágrimas', 'La Exaltación', 'Siglo XVI; documentada en la procesión del Corpus de 1602', 'ca85889c-21fe-4367-8477-a57656b25da4', '1d7c8e53-4a96-42fb-b105-9e63f2d784ca', 'Santa Catalina', 'https://www.laexaltacion.org/', ARRAY['Penitencia']::text[], 'Jueves Santo', 'Corporación histórica de Santa Catalina, unida a la Hermandad Sacramental de la parroquia por decreto de 23 de septiembre de 1964.', 'Ficha cerrada en el macrolote Jueves Santo HC-016 de 2026.') on conflict ("entity_id") do update set "official_name" = excluded."official_name", "popular_name" = excluded."popular_name", "foundation_text" = excluded."foundation_text", "municipality_id" = excluded."municipality_id", "canonical_see_place_id" = excluded."canonical_see_place_id", "neighborhood" = excluded."neighborhood", "website_url" = excluded."website_url", "brotherhood_types" = excluded."brotherhood_types", "current_procession_day" = excluded."current_procession_day", "history_text" = excluded."history_text", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('868ae5fe-1645-4e30-bac1-c90034e752ae', '4a7ba56e-ef86-4859-b8a7-d5fd954647c7', '76eebd4c-3364-4744-9b12-2f4f37331e83', 'Identidad, sede, titulares, pasos, hábito, patrimonio y música') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('31aaac3b-eec8-476a-8fc9-1c6c5a4fdccc', '7cf91fd1-7bc8-4310-a1f5-d8776907067d', '76eebd4c-3364-4744-9b12-2f4f37331e83', 'Identidad institucional y cultos') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."brotherhood_images" ("id", "brotherhood_entity_id", "image_entity_id", "relation_type", "notes", "status")
values ('dd0995fa-95e8-49eb-a874-55fd0da69b18', '76eebd4c-3364-4744-9b12-2f4f37331e83', '180d4b2a-9eef-468b-988c-6763dc13a368', 'titular', 'Titular de la corporación.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."brotherhood_images" ("id", "brotherhood_entity_id", "image_entity_id", "relation_type", "notes", "status")
values ('b22dff4e-0676-43b4-9675-c2b4687b264a', '76eebd4c-3364-4744-9b12-2f4f37331e83', 'd686b479-13cd-4109-83c2-4d666df00155', 'titular', 'Titular de la corporación.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."brotherhood_steps" ("id", "brotherhood_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('8f995483-4fe5-41d2-89db-40b703e5ab6b', '76eebd4c-3364-4744-9b12-2f4f37331e83', '28da3455-77f9-488f-995b-589e5a19aa1c', 'processional', 'Paso canónico de la estación de penitencia.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."brotherhood_steps" ("id", "brotherhood_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('50280e80-2acf-42e4-a2bd-46db72368211', '76eebd4c-3364-4744-9b12-2f4f37331e83', '9fe6b1eb-eb97-45b6-adc2-daac78ed50f2', 'processional', 'Paso canónico de la estación de penitencia.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_steps" ("id", "image_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('d25ae22a-ab4e-48c8-a87c-803305e87179', '180d4b2a-9eef-468b-988c-6763dc13a368', '28da3455-77f9-488f-995b-589e5a19aa1c', 'processional', 'Relación canónica del cortejo del Jueves Santo.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_steps" ("id", "image_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('070b441d-7cbd-4db8-934c-981af82c741b', 'd686b479-13cd-4109-83c2-4d666df00155', '9fe6b1eb-eb97-45b6-adc2-daac78ed50f2', 'processional', 'Relación canónica del cortejo del Jueves Santo.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."cults" ("id", "brotherhood_entity_id", "cult_type", "title", "date_rule", "place_id", "description", "status", "is_recurring", "recurrence_label", "display_order")
values ('b57fe395-8f38-4097-a837-c9a5f19f31cc', '76eebd4c-3364-4744-9b12-2f4f37331e83', 'Quinario', 'Solemne Quinario al Santísimo Cristo de la Exaltación', 'Cuaresma', '1d7c8e53-4a96-42fb-b105-9e63f2d784ca', 'Culto anual documentado por la corporación o la ficha institucional.', 'published', true, 'Anual', 1) on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "cult_type" = excluded."cult_type", "title" = excluded."title", "date_rule" = excluded."date_rule", "place_id" = excluded."place_id", "description" = excluded."description", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order";

insert into public."source_links" ("id", "source_id", "cult_id", "scope")
values ('7530a959-24ae-41c7-8441-1b31a9ef7417', '7cf91fd1-7bc8-4310-a1f5-d8776907067d', 'b57fe395-8f38-4097-a837-c9a5f19f31cc', null) on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id", "scope" = excluded."scope";

insert into public."cults" ("id", "brotherhood_entity_id", "cult_type", "title", "date_rule", "place_id", "description", "status", "is_recurring", "recurrence_label", "display_order")
values ('b8527072-8cf5-479f-b65c-2c21fba2c6df', '76eebd4c-3364-4744-9b12-2f4f37331e83', 'Septenario', 'Septenario a Nuestra Señora de las Lágrimas', 'Cuaresma', '1d7c8e53-4a96-42fb-b105-9e63f2d784ca', 'Culto anual documentado por la corporación o la ficha institucional.', 'published', true, 'Anual', 2) on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "cult_type" = excluded."cult_type", "title" = excluded."title", "date_rule" = excluded."date_rule", "place_id" = excluded."place_id", "description" = excluded."description", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order";

insert into public."source_links" ("id", "source_id", "cult_id", "scope")
values ('d814aa5d-ab9d-48df-a359-8c61980db3b6', '7cf91fd1-7bc8-4310-a1f5-d8776907067d', 'b8527072-8cf5-479f-b65c-2c21fba2c6df', null) on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id", "scope" = excluded."scope";

insert into public."cults" ("id", "brotherhood_entity_id", "cult_type", "title", "date_rule", "place_id", "description", "status", "is_recurring", "recurrence_label", "display_order")
values ('192c5404-f09e-4080-8e30-91fd000cd5f9', '76eebd4c-3364-4744-9b12-2f4f37331e83', 'Función', 'Función de la Exaltación de la Santa Cruz', 'Domingo posterior al 14 de septiembre', '1d7c8e53-4a96-42fb-b105-9e63f2d784ca', 'Culto anual documentado por la corporación o la ficha institucional.', 'published', true, 'Anual', 3) on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "cult_type" = excluded."cult_type", "title" = excluded."title", "date_rule" = excluded."date_rule", "place_id" = excluded."place_id", "description" = excluded."description", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order";

insert into public."source_links" ("id", "source_id", "cult_id", "scope")
values ('3544b520-4d20-4049-ba10-140bd5de3ad8', '7cf91fd1-7bc8-4310-a1f5-d8776907067d', '192c5404-f09e-4080-8e30-91fd000cd5f9', null) on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id", "scope" = excluded."scope";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('a87c8b5f-2f83-457e-81ba-cbd363c94232', 'heritage_asset', 'Relieves del paso de misterio de la Exaltación', 'exaltacion-1-patrimonio', 'Conjunto de ocho relieves barrocos de la canastilla.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."heritage_assets" ("entity_id", "parent_entity_id", "asset_type", "description", "current_condition", "is_current", "display_order", "is_featured")
values ('a87c8b5f-2f83-457e-81ba-cbd363c94232', '76eebd4c-3364-4744-9b12-2f4f37331e83', 'Paso procesional', 'Conjunto de ocho relieves barrocos de la canastilla.', 'Conservado', true, 1, true) on conflict ("entity_id") do update set "parent_entity_id" = excluded."parent_entity_id", "asset_type" = excluded."asset_type", "description" = excluded."description", "current_condition" = excluded."current_condition", "is_current" = excluded."is_current", "display_order" = excluded."display_order", "is_featured" = excluded."is_featured";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('29bfefe1-cdaa-4e76-baf9-9a74b636115f', '4a7ba56e-ef86-4859-b8a7-d5fd954647c7', 'a87c8b5f-2f83-457e-81ba-cbd363c94232', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('4999732f-5ea7-4111-ad67-2a3a1aa0e851', 'heritage_asset', 'Bordados del palio de Nuestra Señora de las Lágrimas', 'exaltacion-2-patrimonio', 'Bambalinas de Rodríguez Ojeda y manto de Hijos del Olmo.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."heritage_assets" ("entity_id", "parent_entity_id", "asset_type", "description", "current_condition", "is_current", "display_order", "is_featured")
values ('4999732f-5ea7-4111-ad67-2a3a1aa0e851', '76eebd4c-3364-4744-9b12-2f4f37331e83', 'Bordado', 'Bambalinas de Rodríguez Ojeda y manto de Hijos del Olmo.', 'Conservado', true, 2, false) on conflict ("entity_id") do update set "parent_entity_id" = excluded."parent_entity_id", "asset_type" = excluded."asset_type", "description" = excluded."description", "current_condition" = excluded."current_condition", "is_current" = excluded."is_current", "display_order" = excluded."display_order", "is_featured" = excluded."is_featured";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('4da37a27-4d1b-4c42-8b4d-ff33ffdba017', '4a7ba56e-ef86-4859-b8a7-d5fd954647c7', '4999732f-5ea7-4111-ad67-2a3a1aa0e851', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."brotherhood_habits" ("id", "brotherhood_entity_id", "name", "tunic_description", "hood_description", "cord_description", "sort_order", "notes", "status")
values ('666dcf96-3332-482f-b8ce-0fc21d5d388d', '76eebd4c-3364-4744-9b12-2f4f37331e83', 'Hábito de la Exaltación', 'Túnica blanca de cola con botones morados.', 'Antifaz morado.', 'Cinturón de esparto.', 1, 'Hábito penitencial documentado por el Consejo.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "name" = excluded."name", "tunic_description" = excluded."tunic_description", "hood_description" = excluded."hood_description", "cord_description" = excluded."cord_description", "sort_order" = excluded."sort_order", "notes" = excluded."notes", "status" = excluded."status";

insert into public."source_links" ("id", "source_id", "brotherhood_habit_id", "scope")
values ('785ce8cf-28da-4a61-bfa2-d81b177bc26c', '4a7ba56e-ef86-4859-b8a7-d5fd954647c7', '666dcf96-3332-482f-b8ce-0fc21d5d388d', null) on conflict ("id") do update set "source_id" = excluded."source_id", "brotherhood_habit_id" = excluded."brotherhood_habit_id", "scope" = excluded."scope";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('338d5100-fd92-419c-acfd-2502d56250a5', 'event', 'Unión con la Sacramental de Santa Catalina', 'union-sacramental-exaltacion-1964', 'La cofradía quedó unida canónicamente a la Hermandad Sacramental de Santa Catalina.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."events" ("entity_id", "event_type", "event_date_text", "description", "event_category", "brotherhood_entity_id", "municipality_id", "event_status")
values ('338d5100-fd92-419c-acfd-2502d56250a5', 'Hito histórico', '23 de septiembre de 1964', 'La cofradía quedó unida canónicamente a la Hermandad Sacramental de Santa Catalina.', 'historical', '76eebd4c-3364-4744-9b12-2f4f37331e83', 'ca85889c-21fe-4367-8477-a57656b25da4', 'held') on conflict ("entity_id") do update set "event_type" = excluded."event_type", "event_date_text" = excluded."event_date_text", "description" = excluded."description", "event_category" = excluded."event_category", "brotherhood_entity_id" = excluded."brotherhood_entity_id", "municipality_id" = excluded."municipality_id", "event_status" = excluded."event_status";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('b9d9ad08-6883-4aa8-aa48-15e8096bbc05', '4a7ba56e-ef86-4859-b8a7-d5fd954647c7', '338d5100-fd92-419c-acfd-2502d56250a5', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."outings" ("id", "brotherhood_entity_id", "outing_type", "character", "title", "outing_date", "year", "departure_time", "return_time", "return_date", "municipality_id", "origin_place_id", "destination_text", "route_summary", "description", "event_status", "status", "slug")
values ('f0b6fb88-f6a2-4727-8fb0-36518623873b', '76eebd4c-3364-4744-9b12-2f4f37331e83', 'Estación de Penitencia', 'ordinary', 'La Exaltación · Estación de Penitencia 2026', '2026-04-02', 2026, '15:20', '23:40', null, 'ca85889c-21fe-4367-8477-a57656b25da4', '1d7c8e53-4a96-42fb-b105-9e63f2d784ca', 'Santa Iglesia Catedral de Sevilla', 'Itinerario oficial del Jueves Santo de 2026 con tránsito por la Carrera Oficial.', 'Estación de penitencia celebrada el Jueves Santo de 2026.', 'held', 'published', 'exaltacion-estacion-penitencia-2026') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "outing_type" = excluded."outing_type", "character" = excluded."character", "title" = excluded."title", "outing_date" = excluded."outing_date", "year" = excluded."year", "departure_time" = excluded."departure_time", "return_time" = excluded."return_time", "return_date" = excluded."return_date", "municipality_id" = excluded."municipality_id", "origin_place_id" = excluded."origin_place_id", "destination_text" = excluded."destination_text", "route_summary" = excluded."route_summary", "description" = excluded."description", "event_status" = excluded."event_status", "status" = excluded."status", "slug" = excluded."slug";

insert into public."outing_entities" ("id", "outing_id", "entity_id", "role", "notes")
values ('419dc2da-25f8-469f-87a1-d652ec9067aa', 'f0b6fb88-f6a2-4727-8fb0-36518623873b', '180d4b2a-9eef-468b-988c-6763dc13a368', 'processional_image', 'Imagen participante en el cortejo de 2026.') on conflict ("id") do update set "outing_id" = excluded."outing_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."outing_entities" ("id", "outing_id", "entity_id", "role", "notes")
values ('3ead1b4e-f35f-4ecc-b95b-699b4b843938', 'f0b6fb88-f6a2-4727-8fb0-36518623873b', 'd686b479-13cd-4109-83c2-4d666df00155', 'processional_image', 'Imagen participante en el cortejo de 2026.') on conflict ("id") do update set "outing_id" = excluded."outing_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "outing_id", "scope")
values ('253588a0-2d49-479e-89ff-94e2419fe90f', 'c65e3532-d8c6-4589-822f-62d35c7c0e1e', 'f0b6fb88-f6a2-4727-8fb0-36518623873b', null) on conflict ("id") do update set "source_id" = excluded."source_id", "outing_id" = excluded."outing_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "outing_id", "scope")
values ('95e80790-2993-4e88-b6ed-8d7856b77024', '4a7ba56e-ef86-4859-b8a7-d5fd954647c7', 'f0b6fb88-f6a2-4727-8fb0-36518623873b', null) on conflict ("id") do update set "source_id" = excluded."source_id", "outing_id" = excluded."outing_id", "scope" = excluded."scope";

insert into public."accompaniments" ("id", "outing_id", "band_entity_id", "step_entity_id", "position", "year", "notes", "status")
values ('2e94013c-4d5f-4184-8d4c-3fde595020fe', 'f0b6fb88-f6a2-4727-8fb0-36518623873b', '15f8a3fe-b8f3-45ca-8e3c-984fd0638146', '28da3455-77f9-488f-995b-589e5a19aa1c', 'Tras el paso de misterio', 2026, 'Acompañamiento vigente documentado para 2026.', 'published') on conflict ("id") do update set "outing_id" = excluded."outing_id", "band_entity_id" = excluded."band_entity_id", "step_entity_id" = excluded."step_entity_id", "position" = excluded."position", "year" = excluded."year", "notes" = excluded."notes", "status" = excluded."status";

update public."music_accompaniment_periods" set "step_entity_id" = '28da3455-77f9-488f-995b-589e5a19aa1c', "position" = 'Tras el paso de misterio', "date_from_text" = 'Vigente en 2026', "is_current" = true, "status" = 'published' where "id" = 'ff01e9ba-105f-4863-8a2b-4bc8f087b95c';

insert into public."accompaniments" ("id", "outing_id", "band_entity_id", "step_entity_id", "position", "year", "notes", "status")
values ('d0441133-ea1f-4de2-9813-2a4be4d44a47', 'f0b6fb88-f6a2-4727-8fb0-36518623873b', '95e4daf1-9db6-4bdb-805a-9f68833c8da1', '9fe6b1eb-eb97-45b6-adc2-daac78ed50f2', 'Tras el paso de palio', 2026, 'Acompañamiento vigente documentado para 2026.', 'published') on conflict ("id") do update set "outing_id" = excluded."outing_id", "band_entity_id" = excluded."band_entity_id", "step_entity_id" = excluded."step_entity_id", "position" = excluded."position", "year" = excluded."year", "notes" = excluded."notes", "status" = excluded."status";

insert into public."music_accompaniment_periods" ("id", "brotherhood_entity_id", "band_entity_id", "step_entity_id", "position", "outing_type", "date_from_text", "year_from", "is_current", "notes", "public_brotherhood_name", "public_step_name", "public_brotherhood_slug", "public_municipality_name", "public_municipality_slug", "public_province", "status")
values ('0d4b2625-4e67-4cb4-b5f5-c63495e6c5d5', '76eebd4c-3364-4744-9b12-2f4f37331e83', '95e4daf1-9db6-4bdb-805a-9f68833c8da1', '9fe6b1eb-eb97-45b6-adc2-daac78ed50f2', 'Tras el paso de palio', 'Jueves Santo', 'Vigente en 2026', 2026, true, 'Vigencia constatada en 2026; no presupone continuidad posterior.', 'La Exaltación', 'Tras el paso de palio', 'hermandad-de-la-exaltacion-sevilla', 'Sevilla', 'sevilla', 'Sevilla', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "band_entity_id" = excluded."band_entity_id", "step_entity_id" = excluded."step_entity_id", "position" = excluded."position", "outing_type" = excluded."outing_type", "date_from_text" = excluded."date_from_text", "year_from" = excluded."year_from", "is_current" = excluded."is_current", "notes" = excluded."notes", "public_brotherhood_name" = excluded."public_brotherhood_name", "public_step_name" = excluded."public_step_name", "public_brotherhood_slug" = excluded."public_brotherhood_slug", "public_municipality_name" = excluded."public_municipality_name", "public_municipality_slug" = excluded."public_municipality_slug", "public_province" = excluded."public_province", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('b2000000-0000-0000-0000-000000000001', 'brotherhood', 'Hermandad de Las Cigarreras', 'hermandad-de-las-cigarreras', 'Hermandad de Sevilla que realiza estación de penitencia el Jueves Santo.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

update public."brotherhoods" set "current_procession_day" = 'Jueves Santo', "notes" = 'Ficha cerrada en el macrolote Jueves Santo HC-016 de 2026.', "history_text" = 'La Hermandad de la Sagrada Columna y Azotes fue fundada en 1563 y está históricamente vinculada a la Fábrica de Tabacos de Sevilla.' where "entity_id" = 'b2000000-0000-0000-0000-000000000001';

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('67003730-e2d3-4293-90aa-3e748476621d', 'b5b287e5-afce-41f4-aa72-f12c520c7bff', 'b2000000-0000-0000-0000-000000000001', 'Identidad, sede, titulares, pasos, hábito, patrimonio y música') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('2e608d03-ad9b-4a51-aac0-8d17ff595dc8', '191c15b5-3827-4758-9ecf-6c6cae97a2ae', 'b2000000-0000-0000-0000-000000000001', 'Identidad institucional y cultos') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."cults" ("id", "brotherhood_entity_id", "cult_type", "title", "date_rule", "place_id", "description", "status", "is_recurring", "recurrence_label", "display_order")
values ('5aa92488-8428-4677-a76f-7b91613e246b', 'b2000000-0000-0000-0000-000000000001', 'Quinario', 'Solemne Quinario a Nuestro Padre Jesús Atado a la Columna', 'Cuaresma', '301a4867-f6be-4625-ad88-5dc032f80973', 'Culto anual documentado por la corporación o la ficha institucional.', 'published', true, 'Anual', 1) on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "cult_type" = excluded."cult_type", "title" = excluded."title", "date_rule" = excluded."date_rule", "place_id" = excluded."place_id", "description" = excluded."description", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order";

insert into public."source_links" ("id", "source_id", "cult_id", "scope")
values ('da7f33e3-b9a9-4c9a-9b0e-6f67fc2346bb', '191c15b5-3827-4758-9ecf-6c6cae97a2ae', '5aa92488-8428-4677-a76f-7b91613e246b', null) on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id", "scope" = excluded."scope";

insert into public."cults" ("id", "brotherhood_entity_id", "cult_type", "title", "date_rule", "place_id", "description", "status", "is_recurring", "recurrence_label", "display_order")
values ('a96f9f90-4e05-486a-851d-2da3f4e4d06f', 'b2000000-0000-0000-0000-000000000001', 'Función Principal', 'Función Principal de Instituto', 'Cuaresma', '301a4867-f6be-4625-ad88-5dc032f80973', 'Culto anual documentado por la corporación o la ficha institucional.', 'published', true, 'Anual', 2) on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "cult_type" = excluded."cult_type", "title" = excluded."title", "date_rule" = excluded."date_rule", "place_id" = excluded."place_id", "description" = excluded."description", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order";

insert into public."source_links" ("id", "source_id", "cult_id", "scope")
values ('5f9b4a57-d294-4dd3-aab4-fde2bae23946', '191c15b5-3827-4758-9ecf-6c6cae97a2ae', 'a96f9f90-4e05-486a-851d-2da3f4e4d06f', null) on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id", "scope" = excluded."scope";

insert into public."cults" ("id", "brotherhood_entity_id", "cult_type", "title", "date_rule", "place_id", "description", "status", "is_recurring", "recurrence_label", "display_order")
values ('4745c554-be01-43ad-803c-ee34595de68d', 'b2000000-0000-0000-0000-000000000001', 'Triduo', 'Triduo a María Santísima de la Victoria', 'Noviembre', '301a4867-f6be-4625-ad88-5dc032f80973', 'Culto anual documentado por la corporación o la ficha institucional.', 'published', true, 'Anual', 3) on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "cult_type" = excluded."cult_type", "title" = excluded."title", "date_rule" = excluded."date_rule", "place_id" = excluded."place_id", "description" = excluded."description", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order";

insert into public."source_links" ("id", "source_id", "cult_id", "scope")
values ('0a224fe9-e08a-41a4-9d73-8102e227da12', '191c15b5-3827-4758-9ecf-6c6cae97a2ae', '4745c554-be01-43ad-803c-ee34595de68d', null) on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id", "scope" = excluded."scope";

insert into public."cults" ("id", "brotherhood_entity_id", "cult_type", "title", "date_rule", "place_id", "description", "status", "is_recurring", "recurrence_label", "display_order")
values ('e415a7b1-76c4-45ef-8b59-942a4f3f678d', 'b2000000-0000-0000-0000-000000000001', 'Besamanos', 'Besamanos a María Santísima de la Victoria', 'Noviembre', '301a4867-f6be-4625-ad88-5dc032f80973', 'Culto anual documentado por la corporación o la ficha institucional.', 'published', true, 'Anual', 4) on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "cult_type" = excluded."cult_type", "title" = excluded."title", "date_rule" = excluded."date_rule", "place_id" = excluded."place_id", "description" = excluded."description", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order";

insert into public."source_links" ("id", "source_id", "cult_id", "scope")
values ('45180a54-fe69-43e2-b506-a35cf147451f', '191c15b5-3827-4758-9ecf-6c6cae97a2ae', 'e415a7b1-76c4-45ef-8b59-942a4f3f678d', null) on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id", "scope" = excluded."scope";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('242ac76a-19ca-4648-b346-ceddae392f05', 'heritage_asset', 'Paso de misterio de Columna y Azotes', 'cigarreras-1-patrimonio', 'Conjunto procesional del misterio de la Sagrada Columna y Azotes.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."heritage_assets" ("entity_id", "parent_entity_id", "asset_type", "description", "current_condition", "is_current", "display_order", "is_featured")
values ('242ac76a-19ca-4648-b346-ceddae392f05', 'b2000000-0000-0000-0000-000000000001', 'Paso procesional', 'Conjunto procesional del misterio de la Sagrada Columna y Azotes.', 'Conservado', true, 1, true) on conflict ("entity_id") do update set "parent_entity_id" = excluded."parent_entity_id", "asset_type" = excluded."asset_type", "description" = excluded."description", "current_condition" = excluded."current_condition", "is_current" = excluded."is_current", "display_order" = excluded."display_order", "is_featured" = excluded."is_featured";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('41dbd278-265b-4a5f-8c1c-f7f5f19d52b4', 'b5b287e5-afce-41f4-aa72-f12c520c7bff', '242ac76a-19ca-4648-b346-ceddae392f05', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('cd90270a-c490-4f63-bbaa-f47a60868c58', 'heritage_asset', 'Conjunto de palio de María Santísima de la Victoria', 'cigarreras-2-patrimonio', 'Conjunto procesional del paso de palio de la Virgen de la Victoria.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."heritage_assets" ("entity_id", "parent_entity_id", "asset_type", "description", "current_condition", "is_current", "display_order", "is_featured")
values ('cd90270a-c490-4f63-bbaa-f47a60868c58', 'b2000000-0000-0000-0000-000000000001', 'Bordado y orfebrería', 'Conjunto procesional del paso de palio de la Virgen de la Victoria.', 'Conservado', true, 2, false) on conflict ("entity_id") do update set "parent_entity_id" = excluded."parent_entity_id", "asset_type" = excluded."asset_type", "description" = excluded."description", "current_condition" = excluded."current_condition", "is_current" = excluded."is_current", "display_order" = excluded."display_order", "is_featured" = excluded."is_featured";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('decf632d-c7fc-459b-b135-a3878fc54311', 'b5b287e5-afce-41f4-aa72-f12c520c7bff', 'cd90270a-c490-4f63-bbaa-f47a60868c58', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."brotherhood_habits" ("id", "brotherhood_entity_id", "name", "tunic_description", "hood_description", "cord_description", "sort_order", "notes", "status")
values ('bd09e486-2cd0-4212-8ce6-637ff679ef86', 'b2000000-0000-0000-0000-000000000001', 'Hábito de Las Cigarreras', 'Túnica de raso morado con capa color crema.', 'Antifaz morado.', 'Cíngulo morado y oro.', 1, 'Hábito penitencial documentado por el Consejo.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "name" = excluded."name", "tunic_description" = excluded."tunic_description", "hood_description" = excluded."hood_description", "cord_description" = excluded."cord_description", "sort_order" = excluded."sort_order", "notes" = excluded."notes", "status" = excluded."status";

insert into public."source_links" ("id", "source_id", "brotherhood_habit_id", "scope")
values ('8ca7ef72-ab5c-41f0-9a83-0e52592ea81c', 'b5b287e5-afce-41f4-aa72-f12c520c7bff', 'bd09e486-2cd0-4212-8ce6-637ff679ef86', null) on conflict ("id") do update set "source_id" = excluded."source_id", "brotherhood_habit_id" = excluded."brotherhood_habit_id", "scope" = excluded."scope";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('a864f258-ee57-43bd-94d5-8e24fa86ad7a', 'event', 'Fundación de la Hermandad de la Columna y Azotes', 'fundacion-cigarreras-1563', 'La corporación fija su origen fundacional en 1563.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."events" ("entity_id", "event_type", "event_date_text", "description", "event_category", "brotherhood_entity_id", "municipality_id", "event_status")
values ('a864f258-ee57-43bd-94d5-8e24fa86ad7a', 'Hito histórico', '1563', 'La corporación fija su origen fundacional en 1563.', 'historical', 'b2000000-0000-0000-0000-000000000001', 'ca85889c-21fe-4367-8477-a57656b25da4', 'held') on conflict ("entity_id") do update set "event_type" = excluded."event_type", "event_date_text" = excluded."event_date_text", "description" = excluded."description", "event_category" = excluded."event_category", "brotherhood_entity_id" = excluded."brotherhood_entity_id", "municipality_id" = excluded."municipality_id", "event_status" = excluded."event_status";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('9aadbddd-ca17-4d6a-8849-6d0e89b16ff6', 'b5b287e5-afce-41f4-aa72-f12c520c7bff', 'a864f258-ee57-43bd-94d5-8e24fa86ad7a', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."outings" ("id", "brotherhood_entity_id", "outing_type", "character", "title", "outing_date", "year", "departure_time", "return_time", "return_date", "municipality_id", "origin_place_id", "destination_text", "route_summary", "description", "event_status", "status", "slug")
values ('ec8adb13-766f-43bb-9d65-f9273d8679fa', 'b2000000-0000-0000-0000-000000000001', 'Estación de Penitencia', 'ordinary', 'Hermandad de Las Cigarreras · Estación de Penitencia 2026', '2026-04-02', 2026, '17:00', '00:45', '2026-04-03', 'ca85889c-21fe-4367-8477-a57656b25da4', '301a4867-f6be-4625-ad88-5dc032f80973', 'Santa Iglesia Catedral de Sevilla', 'Itinerario oficial del Jueves Santo de 2026 con tránsito por la Carrera Oficial.', 'Estación de penitencia celebrada el Jueves Santo de 2026.', 'held', 'published', 'cigarreras-estacion-penitencia-2026') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "outing_type" = excluded."outing_type", "character" = excluded."character", "title" = excluded."title", "outing_date" = excluded."outing_date", "year" = excluded."year", "departure_time" = excluded."departure_time", "return_time" = excluded."return_time", "return_date" = excluded."return_date", "municipality_id" = excluded."municipality_id", "origin_place_id" = excluded."origin_place_id", "destination_text" = excluded."destination_text", "route_summary" = excluded."route_summary", "description" = excluded."description", "event_status" = excluded."event_status", "status" = excluded."status", "slug" = excluded."slug";

insert into public."outing_entities" ("id", "outing_id", "entity_id", "role", "notes")
values ('be5f1ce7-5000-459c-8151-137cf3ae7fb9', 'ec8adb13-766f-43bb-9d65-f9273d8679fa', '8620d9f5-f489-418f-9f56-9c2a92a057b6', 'processional_image', 'Imagen participante en el cortejo de 2026.') on conflict ("id") do update set "outing_id" = excluded."outing_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."outing_entities" ("id", "outing_id", "entity_id", "role", "notes")
values ('29a4ae54-4b26-4eaa-83b8-2ea73e3a5eba', 'ec8adb13-766f-43bb-9d65-f9273d8679fa', '7b0c12f2-7646-40df-9322-cdfea67e8f74', 'processional_image', 'Imagen participante en el cortejo de 2026.') on conflict ("id") do update set "outing_id" = excluded."outing_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."outing_entities" ("id", "outing_id", "entity_id", "role", "notes")
values ('995f4249-f565-4121-883a-681e95f72407', 'ec8adb13-766f-43bb-9d65-f9273d8679fa', '03ead0cc-0de7-441b-9863-3f05e0eae877', 'processional_image', 'Imagen participante en el cortejo de 2026.') on conflict ("id") do update set "outing_id" = excluded."outing_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "outing_id", "scope")
values ('378e6785-9769-4b42-b87b-ba749e7b2798', 'c65e3532-d8c6-4589-822f-62d35c7c0e1e', 'ec8adb13-766f-43bb-9d65-f9273d8679fa', null) on conflict ("id") do update set "source_id" = excluded."source_id", "outing_id" = excluded."outing_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "outing_id", "scope")
values ('5741a20d-c368-43fb-9cd8-9601a5232944', 'b5b287e5-afce-41f4-aa72-f12c520c7bff', 'ec8adb13-766f-43bb-9d65-f9273d8679fa', null) on conflict ("id") do update set "source_id" = excluded."source_id", "outing_id" = excluded."outing_id", "scope" = excluded."scope";

insert into public."accompaniments" ("id", "outing_id", "band_entity_id", "step_entity_id", "position", "year", "notes", "status")
values ('4f15e068-5284-4e58-8f1a-cb827749a7ff', 'ec8adb13-766f-43bb-9d65-f9273d8679fa', 'b1000000-0000-0000-0000-000000000001', 'c1100000-0000-0000-0000-000000000006', 'Tras el paso de misterio', 2026, 'Acompañamiento vigente documentado para 2026.', 'published') on conflict ("id") do update set "outing_id" = excluded."outing_id", "band_entity_id" = excluded."band_entity_id", "step_entity_id" = excluded."step_entity_id", "position" = excluded."position", "year" = excluded."year", "notes" = excluded."notes", "status" = excluded."status";

update public."music_accompaniment_periods" set "step_entity_id" = 'c1100000-0000-0000-0000-000000000006', "position" = 'Tras el paso de misterio', "date_from_text" = 'Vigente en 2026', "is_current" = true, "status" = 'published' where "id" = 'c1300000-0000-0000-0000-000000000006';

insert into public."accompaniments" ("id", "outing_id", "band_entity_id", "step_entity_id", "position", "year", "notes", "status")
values ('0235d3c7-68e9-4357-9ba2-8e98779983f6', 'ec8adb13-766f-43bb-9d65-f9273d8679fa', 'a23934c9-93e9-4bf1-886e-d98ec170b74f', 'a3cbd813-a88e-4bee-8bd3-633b4a5ae583', 'Tras el paso de palio', 2026, 'Acompañamiento vigente documentado para 2026.', 'published') on conflict ("id") do update set "outing_id" = excluded."outing_id", "band_entity_id" = excluded."band_entity_id", "step_entity_id" = excluded."step_entity_id", "position" = excluded."position", "year" = excluded."year", "notes" = excluded."notes", "status" = excluded."status";

update public."music_accompaniment_periods" set "step_entity_id" = 'a3cbd813-a88e-4bee-8bd3-633b4a5ae583', "position" = 'Tras el paso de palio', "date_from_text" = 'Vigente en 2026', "is_current" = true, "status" = 'published' where "id" = '2d0ec74d-516f-4766-8863-422288338ed4';

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('947590f0-b8f5-4056-8914-90c833819d18', 'brotherhood', 'Hermandad de Monte-Sión', 'hermandad-monte-sion-sevilla', 'Hermandad de Sevilla que realiza estación de penitencia el Jueves Santo.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."brotherhoods" ("entity_id", "official_name", "popular_name", "foundation_text", "municipality_id", "canonical_see_place_id", "neighborhood", "website_url", "brotherhood_types", "current_procession_day", "history_text", "notes")
values ('947590f0-b8f5-4056-8914-90c833819d18', 'Pontificia, Real, Ilustre, Antigua y Dominica Hermandad y Archicofradía de Nazarenos de la Sagrada Oración de Nuestro Señor Jesucristo en el Huerto, Santísimo Cristo de la Salud y María Santísima del Rosario en sus Misterios Dolorosos Coronada y Santo Domingo de Guzmán', 'Monte-Sión', '1560, según la tradición de la corporación', 'ca85889c-21fe-4367-8477-a57656b25da4', '0c2cdcea-f026-4bd6-95e6-f24d5fbe111e', 'Feria', 'https://hermandaddemontesion.com/', ARRAY['Penitencia']::text[], 'Jueves Santo', 'La tradición sitúa su origen en 1560. Tras la destrucción de 1936, la capilla fue restaurada y bendecida en 1952; la Virgen del Rosario fue coronada canónicamente en 2004.', 'Ficha cerrada en el macrolote Jueves Santo HC-016 de 2026.') on conflict ("entity_id") do update set "official_name" = excluded."official_name", "popular_name" = excluded."popular_name", "foundation_text" = excluded."foundation_text", "municipality_id" = excluded."municipality_id", "canonical_see_place_id" = excluded."canonical_see_place_id", "neighborhood" = excluded."neighborhood", "website_url" = excluded."website_url", "brotherhood_types" = excluded."brotherhood_types", "current_procession_day" = excluded."current_procession_day", "history_text" = excluded."history_text", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('0c16818f-27c7-4851-bdb2-259bec72c445', '33b540d5-e003-4af7-a7e8-8004f15abb84', '947590f0-b8f5-4056-8914-90c833819d18', 'Identidad, sede, titulares, pasos, hábito, patrimonio y música') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('c9bf6fbf-9d54-4a9b-b698-dbc794454bac', 'f818365c-1a79-43fb-9407-e0a3bee5eea3', '947590f0-b8f5-4056-8914-90c833819d18', 'Identidad institucional y cultos') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."brotherhood_images" ("id", "brotherhood_entity_id", "image_entity_id", "relation_type", "notes", "status")
values ('be83ee39-92cf-46c2-90ed-dd1720fb0323', '947590f0-b8f5-4056-8914-90c833819d18', 'c0b3516c-08ff-44ce-9377-71d042cd7870', 'titular', 'Titular de la corporación.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."brotherhood_images" ("id", "brotherhood_entity_id", "image_entity_id", "relation_type", "notes", "status")
values ('774ffbe5-521a-495f-afc8-71565514a4ea', '947590f0-b8f5-4056-8914-90c833819d18', '778b7f75-d530-45cd-9b3e-179caf2b46ae', 'titular', 'Titular de la corporación.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."brotherhood_images" ("id", "brotherhood_entity_id", "image_entity_id", "relation_type", "notes", "status")
values ('8592d520-3409-4701-bffd-ac1c15ff190a', '947590f0-b8f5-4056-8914-90c833819d18', '3a8d24be-e26c-499f-a6bd-061698c89da0', 'titular', 'Titular no procesional el Jueves Santo.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."brotherhood_steps" ("id", "brotherhood_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('e4aee64a-e0a6-4ce8-8360-d161754c5053', '947590f0-b8f5-4056-8914-90c833819d18', 'ac693db2-a465-4542-a5e2-fd69ff61fd34', 'processional', 'Paso canónico de la estación de penitencia.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."brotherhood_steps" ("id", "brotherhood_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('758a089f-6bea-4387-a132-3b2f8d9ca012', '947590f0-b8f5-4056-8914-90c833819d18', 'c459a65b-82e6-4b0a-9428-7e857524fb29', 'processional', 'Paso canónico de la estación de penitencia.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_steps" ("id", "image_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('89b9f67c-09c0-4e06-9b33-9c4c75d5fa72', 'c0b3516c-08ff-44ce-9377-71d042cd7870', 'ac693db2-a465-4542-a5e2-fd69ff61fd34', 'processional', 'Relación canónica del cortejo del Jueves Santo.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_steps" ("id", "image_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('c03e2f98-281e-4bd2-a42b-970cb254001b', '778b7f75-d530-45cd-9b3e-179caf2b46ae', 'c459a65b-82e6-4b0a-9428-7e857524fb29', 'processional', 'Relación canónica del cortejo del Jueves Santo.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."cults" ("id", "brotherhood_entity_id", "cult_type", "title", "date_rule", "place_id", "description", "status", "is_recurring", "recurrence_label", "display_order")
values ('7946e0d9-f9c1-4d9c-bde4-cbd742578fc6', '947590f0-b8f5-4056-8914-90c833819d18', 'Quinario', 'Solemne Quinario al Señor de la Oración en el Huerto', 'Cuaresma', '0c2cdcea-f026-4bd6-95e6-f24d5fbe111e', 'Culto anual documentado por la corporación o la ficha institucional.', 'published', true, 'Anual', 1) on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "cult_type" = excluded."cult_type", "title" = excluded."title", "date_rule" = excluded."date_rule", "place_id" = excluded."place_id", "description" = excluded."description", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order";

insert into public."source_links" ("id", "source_id", "cult_id", "scope")
values ('3b666dc8-b749-44f5-a18b-7237a675f32e', 'f818365c-1a79-43fb-9407-e0a3bee5eea3', '7946e0d9-f9c1-4d9c-bde4-cbd742578fc6', null) on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id", "scope" = excluded."scope";

insert into public."cults" ("id", "brotherhood_entity_id", "cult_type", "title", "date_rule", "place_id", "description", "status", "is_recurring", "recurrence_label", "display_order")
values ('4e1e1e26-5e2c-4c87-b38b-a19dbe468234', '947590f0-b8f5-4056-8914-90c833819d18', 'Triduo', 'Triduo al Santísimo Cristo de la Salud', 'Cuaresma', '0c2cdcea-f026-4bd6-95e6-f24d5fbe111e', 'Culto anual documentado por la corporación o la ficha institucional.', 'published', true, 'Anual', 2) on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "cult_type" = excluded."cult_type", "title" = excluded."title", "date_rule" = excluded."date_rule", "place_id" = excluded."place_id", "description" = excluded."description", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order";

insert into public."source_links" ("id", "source_id", "cult_id", "scope")
values ('7f1001ce-6d4a-4dc9-9b6a-c4516a683526', 'f818365c-1a79-43fb-9407-e0a3bee5eea3', '4e1e1e26-5e2c-4c87-b38b-a19dbe468234', null) on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id", "scope" = excluded."scope";

insert into public."cults" ("id", "brotherhood_entity_id", "cult_type", "title", "date_rule", "place_id", "description", "status", "is_recurring", "recurrence_label", "display_order")
values ('b62dbc9e-fcee-4bb9-b726-5df43dca903e', '947590f0-b8f5-4056-8914-90c833819d18', 'Vía Crucis', 'Vía Crucis del Santísimo Cristo de la Salud', 'Cuaresma', '0c2cdcea-f026-4bd6-95e6-f24d5fbe111e', 'Culto anual documentado por la corporación o la ficha institucional.', 'published', true, 'Anual', 3) on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "cult_type" = excluded."cult_type", "title" = excluded."title", "date_rule" = excluded."date_rule", "place_id" = excluded."place_id", "description" = excluded."description", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order";

insert into public."source_links" ("id", "source_id", "cult_id", "scope")
values ('db7a46cc-1616-4de9-9e34-119d44669376', 'f818365c-1a79-43fb-9407-e0a3bee5eea3', 'b62dbc9e-fcee-4bb9-b726-5df43dca903e', null) on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id", "scope" = excluded."scope";

insert into public."cults" ("id", "brotherhood_entity_id", "cult_type", "title", "date_rule", "place_id", "description", "status", "is_recurring", "recurrence_label", "display_order")
values ('2ec4c64d-30ac-4a65-87d5-3de5152c97c3', '947590f0-b8f5-4056-8914-90c833819d18', 'Triduo', 'Triduo a María Santísima del Rosario', 'Octubre', '0c2cdcea-f026-4bd6-95e6-f24d5fbe111e', 'Culto anual documentado por la corporación o la ficha institucional.', 'published', true, 'Anual', 4) on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "cult_type" = excluded."cult_type", "title" = excluded."title", "date_rule" = excluded."date_rule", "place_id" = excluded."place_id", "description" = excluded."description", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order";

insert into public."source_links" ("id", "source_id", "cult_id", "scope")
values ('2ef25621-5ee4-4a22-b18e-1e93f8b71b85', 'f818365c-1a79-43fb-9407-e0a3bee5eea3', '2ec4c64d-30ac-4a65-87d5-3de5152c97c3', null) on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id", "scope" = excluded."scope";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('fe987e7e-9b61-495a-bb6a-ab2bab0359e3', 'heritage_asset', 'Canastilla del misterio de Monte-Sión', 'montesion-1-patrimonio', 'Canastilla de Manuel Calvo Camacho estrenada en 1957.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."heritage_assets" ("entity_id", "parent_entity_id", "asset_type", "description", "current_condition", "is_current", "display_order", "is_featured")
values ('fe987e7e-9b61-495a-bb6a-ab2bab0359e3', '947590f0-b8f5-4056-8914-90c833819d18', 'Paso procesional', 'Canastilla de Manuel Calvo Camacho estrenada en 1957.', 'Conservado', true, 1, true) on conflict ("entity_id") do update set "parent_entity_id" = excluded."parent_entity_id", "asset_type" = excluded."asset_type", "description" = excluded."description", "current_condition" = excluded."current_condition", "is_current" = excluded."is_current", "display_order" = excluded."display_order", "is_featured" = excluded."is_featured";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('7382281f-b6c3-4d17-9e9e-1c2c7d155bf3', '33b540d5-e003-4af7-a7e8-8004f15abb84', 'fe987e7e-9b61-495a-bb6a-ab2bab0359e3', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('7891d973-d6b2-4436-89cb-af9fbd4f9c50', 'heritage_asset', 'Palio de la Coronación de la Virgen del Rosario', 'montesion-2-patrimonio', 'Palio realizado en 2004 con motivo de la coronación canónica.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."heritage_assets" ("entity_id", "parent_entity_id", "asset_type", "description", "current_condition", "is_current", "display_order", "is_featured")
values ('7891d973-d6b2-4436-89cb-af9fbd4f9c50', '947590f0-b8f5-4056-8914-90c833819d18', 'Bordado y orfebrería', 'Palio realizado en 2004 con motivo de la coronación canónica.', 'Conservado', true, 2, false) on conflict ("entity_id") do update set "parent_entity_id" = excluded."parent_entity_id", "asset_type" = excluded."asset_type", "description" = excluded."description", "current_condition" = excluded."current_condition", "is_current" = excluded."is_current", "display_order" = excluded."display_order", "is_featured" = excluded."is_featured";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('2d9492a2-e43c-4a8d-b088-ea30046c1ce0', '33b540d5-e003-4af7-a7e8-8004f15abb84', '7891d973-d6b2-4436-89cb-af9fbd4f9c50', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."brotherhood_habits" ("id", "brotherhood_entity_id", "name", "tunic_description", "hood_description", "cord_description", "sort_order", "notes", "status")
values ('4b9dade4-81e0-4c9f-8295-eddf05ec3ec3', '947590f0-b8f5-4056-8914-90c833819d18', 'Hábito de Monte-Sión', 'Túnica y capa color crema con botonadura negra.', 'Antifaz de terciopelo negro.', 'Cordón de seda blanco y negro.', 1, 'Hábito penitencial documentado por el Consejo.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "name" = excluded."name", "tunic_description" = excluded."tunic_description", "hood_description" = excluded."hood_description", "cord_description" = excluded."cord_description", "sort_order" = excluded."sort_order", "notes" = excluded."notes", "status" = excluded."status";

insert into public."source_links" ("id", "source_id", "brotherhood_habit_id", "scope")
values ('054612d5-1ddc-4e3d-a675-ff9e33f12d67', '33b540d5-e003-4af7-a7e8-8004f15abb84', '4b9dade4-81e0-4c9f-8295-eddf05ec3ec3', null) on conflict ("id") do update set "source_id" = excluded."source_id", "brotherhood_habit_id" = excluded."brotherhood_habit_id", "scope" = excluded."scope";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('9455fd18-6ef2-424d-8277-f7d6379a7021', 'event', 'Coronación canónica de la Virgen del Rosario', 'coronacion-canonicamente-rosario-monte-sion-2004', 'María Santísima del Rosario fue coronada canónicamente en 2004.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."events" ("entity_id", "event_type", "event_date_text", "description", "event_category", "brotherhood_entity_id", "municipality_id", "event_status")
values ('9455fd18-6ef2-424d-8277-f7d6379a7021', 'Hito histórico', '2004', 'María Santísima del Rosario fue coronada canónicamente en 2004.', 'historical', '947590f0-b8f5-4056-8914-90c833819d18', 'ca85889c-21fe-4367-8477-a57656b25da4', 'held') on conflict ("entity_id") do update set "event_type" = excluded."event_type", "event_date_text" = excluded."event_date_text", "description" = excluded."description", "event_category" = excluded."event_category", "brotherhood_entity_id" = excluded."brotherhood_entity_id", "municipality_id" = excluded."municipality_id", "event_status" = excluded."event_status";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('7759ca31-9d26-4a60-8b40-1e44717e38e7', '33b540d5-e003-4af7-a7e8-8004f15abb84', '9455fd18-6ef2-424d-8277-f7d6379a7021', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."outings" ("id", "brotherhood_entity_id", "outing_type", "character", "title", "outing_date", "year", "departure_time", "return_time", "return_date", "municipality_id", "origin_place_id", "destination_text", "route_summary", "description", "event_status", "status", "slug")
values ('01e8e7e7-f72e-41ee-86f7-1845f2877887', '947590f0-b8f5-4056-8914-90c833819d18', 'Estación de Penitencia', 'ordinary', 'Hermandad de Monte-Sión · Estación de Penitencia 2026', '2026-04-02', 2026, '17:30', '01:30', '2026-04-03', 'ca85889c-21fe-4367-8477-a57656b25da4', '0c2cdcea-f026-4bd6-95e6-f24d5fbe111e', 'Santa Iglesia Catedral de Sevilla', 'Itinerario oficial del Jueves Santo de 2026 con tránsito por la Carrera Oficial.', 'Estación de penitencia celebrada el Jueves Santo de 2026.', 'held', 'published', 'montesion-estacion-penitencia-2026') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "outing_type" = excluded."outing_type", "character" = excluded."character", "title" = excluded."title", "outing_date" = excluded."outing_date", "year" = excluded."year", "departure_time" = excluded."departure_time", "return_time" = excluded."return_time", "return_date" = excluded."return_date", "municipality_id" = excluded."municipality_id", "origin_place_id" = excluded."origin_place_id", "destination_text" = excluded."destination_text", "route_summary" = excluded."route_summary", "description" = excluded."description", "event_status" = excluded."event_status", "status" = excluded."status", "slug" = excluded."slug";

insert into public."outing_entities" ("id", "outing_id", "entity_id", "role", "notes")
values ('973b985e-7ddf-41a4-89eb-ecd6f8d31dd1', '01e8e7e7-f72e-41ee-86f7-1845f2877887', 'c0b3516c-08ff-44ce-9377-71d042cd7870', 'processional_image', 'Imagen participante en el cortejo de 2026.') on conflict ("id") do update set "outing_id" = excluded."outing_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."outing_entities" ("id", "outing_id", "entity_id", "role", "notes")
values ('543b8f87-cb51-41a5-9b51-555fdb6bf35b', '01e8e7e7-f72e-41ee-86f7-1845f2877887', '778b7f75-d530-45cd-9b3e-179caf2b46ae', 'processional_image', 'Imagen participante en el cortejo de 2026.') on conflict ("id") do update set "outing_id" = excluded."outing_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "outing_id", "scope")
values ('32dbecda-c765-457e-a518-93d5ad1e99c2', 'c65e3532-d8c6-4589-822f-62d35c7c0e1e', '01e8e7e7-f72e-41ee-86f7-1845f2877887', null) on conflict ("id") do update set "source_id" = excluded."source_id", "outing_id" = excluded."outing_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "outing_id", "scope")
values ('a389fc99-cae8-4e27-a3c2-c80e11f7227b', '33b540d5-e003-4af7-a7e8-8004f15abb84', '01e8e7e7-f72e-41ee-86f7-1845f2877887', null) on conflict ("id") do update set "source_id" = excluded."source_id", "outing_id" = excluded."outing_id", "scope" = excluded."scope";

insert into public."accompaniments" ("id", "outing_id", "band_entity_id", "step_entity_id", "position", "year", "notes", "status")
values ('97ccf42a-a1fe-458a-81f0-3db1d729432d', '01e8e7e7-f72e-41ee-86f7-1845f2877887', 'c6000000-0000-4000-8000-000000000002', 'ac693db2-a465-4542-a5e2-fd69ff61fd34', 'Tras el paso de misterio', 2026, 'Acompañamiento vigente documentado para 2026.', 'published') on conflict ("id") do update set "outing_id" = excluded."outing_id", "band_entity_id" = excluded."band_entity_id", "step_entity_id" = excluded."step_entity_id", "position" = excluded."position", "year" = excluded."year", "notes" = excluded."notes", "status" = excluded."status";

update public."music_accompaniment_periods" set "step_entity_id" = 'ac693db2-a465-4542-a5e2-fd69ff61fd34', "position" = 'Tras el paso de misterio', "date_from_text" = 'Vigente en 2026', "is_current" = true, "status" = 'published' where "id" = 'b75df8ea-61cd-4063-8250-660466b550e4';

insert into public."accompaniments" ("id", "outing_id", "band_entity_id", "step_entity_id", "position", "year", "notes", "status")
values ('5e673360-6126-4d9c-adb7-e9f2508137ad', '01e8e7e7-f72e-41ee-86f7-1845f2877887', 'c6000000-0000-4000-8000-000000000001', 'c459a65b-82e6-4b0a-9428-7e857524fb29', 'Tras el paso de palio', 2026, 'Acompañamiento vigente documentado para 2026.', 'published') on conflict ("id") do update set "outing_id" = excluded."outing_id", "band_entity_id" = excluded."band_entity_id", "step_entity_id" = excluded."step_entity_id", "position" = excluded."position", "year" = excluded."year", "notes" = excluded."notes", "status" = excluded."status";

update public."music_accompaniment_periods" set "step_entity_id" = 'c459a65b-82e6-4b0a-9428-7e857524fb29', "position" = 'Tras el paso de palio', "date_from_text" = 'Vigente en 2026', "is_current" = true, "status" = 'published' where "id" = 'c1f2b2f1-0cfd-42aa-b53c-0d0637c24bcc';

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('f627ce61-52f2-441d-8c7f-2fd086109709', 'brotherhood', 'La Quinta Angustia', 'quinta-angustia-sevilla', 'Hermandad de Sevilla que realiza estación de penitencia el Jueves Santo.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

update public."brotherhoods" set "current_procession_day" = 'Jueves Santo', "notes" = 'Ficha cerrada en el macrolote Jueves Santo HC-016 de 2026.' where "entity_id" = 'f627ce61-52f2-441d-8c7f-2fd086109709';

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('7ef8a2cf-a9f3-451a-8681-455e9f5dc78a', 'f9ebb143-509d-48fc-9b52-c9b4f4b43807', 'f627ce61-52f2-441d-8c7f-2fd086109709', 'Identidad, sede, titulares, pasos, hábito, patrimonio y música') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('8f2bfa3e-635e-468f-8eb7-7900199555e7', '718c04f5-0cee-4440-89da-698aa75f3aee', 'f627ce61-52f2-441d-8c7f-2fd086109709', 'Identidad institucional y cultos') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."cults" ("id", "brotherhood_entity_id", "cult_type", "title", "date_rule", "place_id", "description", "status", "is_recurring", "recurrence_label", "display_order")
values ('f464166b-d0fb-4606-92bd-9abdc4935167', 'f627ce61-52f2-441d-8c7f-2fd086109709', 'Quinario', 'Solemne Quinario al Sagrado Descendimiento', 'Cuaresma', '16599c30-45a9-443a-93ae-4b085401e776', 'Culto anual documentado por la corporación o la ficha institucional.', 'published', true, 'Anual', 1) on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "cult_type" = excluded."cult_type", "title" = excluded."title", "date_rule" = excluded."date_rule", "place_id" = excluded."place_id", "description" = excluded."description", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order";

insert into public."source_links" ("id", "source_id", "cult_id", "scope")
values ('f4e0a032-526d-4709-aa11-652069dfe15b', '718c04f5-0cee-4440-89da-698aa75f3aee', 'f464166b-d0fb-4606-92bd-9abdc4935167', null) on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id", "scope" = excluded."scope";

insert into public."cults" ("id", "brotherhood_entity_id", "cult_type", "title", "date_rule", "place_id", "description", "status", "is_recurring", "recurrence_label", "display_order")
values ('e841e51b-2ec5-436f-ab23-4d5628841b3c', 'f627ce61-52f2-441d-8c7f-2fd086109709', 'Función Principal', 'Función Principal de Instituto', 'Cuaresma', '16599c30-45a9-443a-93ae-4b085401e776', 'Culto anual documentado por la corporación o la ficha institucional.', 'published', true, 'Anual', 2) on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "cult_type" = excluded."cult_type", "title" = excluded."title", "date_rule" = excluded."date_rule", "place_id" = excluded."place_id", "description" = excluded."description", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order";

insert into public."source_links" ("id", "source_id", "cult_id", "scope")
values ('41c4b822-afe3-462b-8a3f-1c09d3561651', '718c04f5-0cee-4440-89da-698aa75f3aee', 'e841e51b-2ec5-436f-ab23-4d5628841b3c', null) on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id", "scope" = excluded."scope";

insert into public."cults" ("id", "brotherhood_entity_id", "cult_type", "title", "date_rule", "place_id", "description", "status", "is_recurring", "recurrence_label", "display_order")
values ('7994c849-8d06-4098-a8d0-30e20c146bfb', 'f627ce61-52f2-441d-8c7f-2fd086109709', 'Rosario', 'Santo Rosario de la Hermandad', 'Todos los jueves', '16599c30-45a9-443a-93ae-4b085401e776', 'Culto anual documentado por la corporación o la ficha institucional.', 'published', true, 'Anual', 3) on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "cult_type" = excluded."cult_type", "title" = excluded."title", "date_rule" = excluded."date_rule", "place_id" = excluded."place_id", "description" = excluded."description", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order";

insert into public."source_links" ("id", "source_id", "cult_id", "scope")
values ('218e8a79-a8b7-4d58-9bc1-d5e3a5ae4676', '718c04f5-0cee-4440-89da-698aa75f3aee', '7994c849-8d06-4098-a8d0-30e20c146bfb', null) on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id", "scope" = excluded."scope";

insert into public."cults" ("id", "brotherhood_entity_id", "cult_type", "title", "date_rule", "place_id", "description", "status", "is_recurring", "recurrence_label", "display_order")
values ('03d20751-a1b9-41dc-9ebd-50788c30405c', 'f627ce61-52f2-441d-8c7f-2fd086109709', 'Procesión eucarística', 'Procesión eucarística con el Dulce Nombre de Jesús', 'Domingo posterior al Jueves de Corpus', '16599c30-45a9-443a-93ae-4b085401e776', 'Culto anual documentado por la corporación o la ficha institucional.', 'published', true, 'Anual', 4) on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "cult_type" = excluded."cult_type", "title" = excluded."title", "date_rule" = excluded."date_rule", "place_id" = excluded."place_id", "description" = excluded."description", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order";

insert into public."source_links" ("id", "source_id", "cult_id", "scope")
values ('87d5a00d-4b5d-4e03-a244-024cc0568e44', '718c04f5-0cee-4440-89da-698aa75f3aee', '03d20751-a1b9-41dc-9ebd-50788c30405c', null) on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id", "scope" = excluded."scope";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('d18931e4-82aa-4634-82c4-ad75efabcf7a', 'heritage_asset', 'Paso del Sagrado Descendimiento', 'quinta-1-patrimonio', 'Canastilla de bronce, ébano, caoba y palo de rosa estrenada en 1904.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."heritage_assets" ("entity_id", "parent_entity_id", "asset_type", "description", "current_condition", "is_current", "display_order", "is_featured")
values ('d18931e4-82aa-4634-82c4-ad75efabcf7a', 'f627ce61-52f2-441d-8c7f-2fd086109709', 'Paso procesional', 'Canastilla de bronce, ébano, caoba y palo de rosa estrenada en 1904.', 'Conservado', true, 1, true) on conflict ("entity_id") do update set "parent_entity_id" = excluded."parent_entity_id", "asset_type" = excluded."asset_type", "description" = excluded."description", "current_condition" = excluded."current_condition", "is_current" = excluded."is_current", "display_order" = excluded."display_order", "is_featured" = excluded."is_featured";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('5cd354fc-01f0-4657-a28c-c97ac1fae9b4', 'f9ebb143-509d-48fc-9b52-c9b4f4b43807', 'd18931e4-82aa-4634-82c4-ad75efabcf7a', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('2ba60fb9-e882-4573-ba17-1813b68dc904', 'heritage_asset', 'Bordados de las figuras del misterio', 'quinta-2-patrimonio', 'Conjunto de Antonio del Canto y Teresa del Castillo, de mediados del siglo XIX.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."heritage_assets" ("entity_id", "parent_entity_id", "asset_type", "description", "current_condition", "is_current", "display_order", "is_featured")
values ('2ba60fb9-e882-4573-ba17-1813b68dc904', 'f627ce61-52f2-441d-8c7f-2fd086109709', 'Bordado', 'Conjunto de Antonio del Canto y Teresa del Castillo, de mediados del siglo XIX.', 'Conservado', true, 2, false) on conflict ("entity_id") do update set "parent_entity_id" = excluded."parent_entity_id", "asset_type" = excluded."asset_type", "description" = excluded."description", "current_condition" = excluded."current_condition", "is_current" = excluded."is_current", "display_order" = excluded."display_order", "is_featured" = excluded."is_featured";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('dc9c413b-c77e-4bee-aa08-7c6d9e28a8e0', 'f9ebb143-509d-48fc-9b52-c9b4f4b43807', '2ba60fb9-e882-4573-ba17-1813b68dc904', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."brotherhood_habits" ("id", "brotherhood_entity_id", "name", "tunic_description", "hood_description", "cord_description", "sort_order", "notes", "status")
values ('b3f0756a-79cc-40be-8cf4-4c50b031a7f3', 'f627ce61-52f2-441d-8c7f-2fd086109709', 'Hábito de la Quinta Angustia', 'Túnica morada de lana de merino con capa.', 'Antifaz morado.', 'Cíngulo morado.', 1, 'Hábito penitencial documentado por el Consejo.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "name" = excluded."name", "tunic_description" = excluded."tunic_description", "hood_description" = excluded."hood_description", "cord_description" = excluded."cord_description", "sort_order" = excluded."sort_order", "notes" = excluded."notes", "status" = excluded."status";

insert into public."source_links" ("id", "source_id", "brotherhood_habit_id", "scope")
values ('46017a16-3bb8-4670-aefa-753f43474cdd', 'f9ebb143-509d-48fc-9b52-c9b4f4b43807', 'b3f0756a-79cc-40be-8cf4-4c50b031a7f3', null) on conflict ("id") do update set "source_id" = excluded."source_id", "brotherhood_habit_id" = excluded."brotherhood_habit_id", "scope" = excluded."scope";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('10ea6280-698b-4d2f-a8a4-dcda2abd6bed', 'event', 'Fusión de las dos corporaciones de la Quinta Angustia', 'fusion-quinta-angustia-1851', 'La cofradía del Descendimiento y la del Dulce Nombre de Jesús quedaron unidas en 1851.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."events" ("entity_id", "event_type", "event_date_text", "description", "event_category", "brotherhood_entity_id", "municipality_id", "event_status")
values ('10ea6280-698b-4d2f-a8a4-dcda2abd6bed', 'Hito histórico', '1851', 'La cofradía del Descendimiento y la del Dulce Nombre de Jesús quedaron unidas en 1851.', 'historical', 'f627ce61-52f2-441d-8c7f-2fd086109709', 'ca85889c-21fe-4367-8477-a57656b25da4', 'held') on conflict ("entity_id") do update set "event_type" = excluded."event_type", "event_date_text" = excluded."event_date_text", "description" = excluded."description", "event_category" = excluded."event_category", "brotherhood_entity_id" = excluded."brotherhood_entity_id", "municipality_id" = excluded."municipality_id", "event_status" = excluded."event_status";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('b38024d1-9586-40e4-83ce-12e89408e7b9', 'f9ebb143-509d-48fc-9b52-c9b4f4b43807', '10ea6280-698b-4d2f-a8a4-dcda2abd6bed', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."outings" ("id", "brotherhood_entity_id", "outing_type", "character", "title", "outing_date", "year", "departure_time", "return_time", "return_date", "municipality_id", "origin_place_id", "destination_text", "route_summary", "description", "event_status", "status", "slug")
values ('0b9ce109-976c-4f96-bf9f-e14bbd0d653f', 'f627ce61-52f2-441d-8c7f-2fd086109709', 'Estación de Penitencia', 'ordinary', 'La Quinta Angustia · Estación de Penitencia 2026', '2026-04-02', 2026, '19:36', '00:09', '2026-04-03', 'ca85889c-21fe-4367-8477-a57656b25da4', '16599c30-45a9-443a-93ae-4b085401e776', 'Santa Iglesia Catedral de Sevilla', 'Itinerario oficial del Jueves Santo de 2026 con tránsito por la Carrera Oficial.', 'Estación de penitencia celebrada el Jueves Santo de 2026.', 'held', 'published', 'quinta-estacion-penitencia-2026') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "outing_type" = excluded."outing_type", "character" = excluded."character", "title" = excluded."title", "outing_date" = excluded."outing_date", "year" = excluded."year", "departure_time" = excluded."departure_time", "return_time" = excluded."return_time", "return_date" = excluded."return_date", "municipality_id" = excluded."municipality_id", "origin_place_id" = excluded."origin_place_id", "destination_text" = excluded."destination_text", "route_summary" = excluded."route_summary", "description" = excluded."description", "event_status" = excluded."event_status", "status" = excluded."status", "slug" = excluded."slug";

insert into public."outing_entities" ("id", "outing_id", "entity_id", "role", "notes")
values ('7a2b1777-46a6-495a-9311-3a207c249dee', '0b9ce109-976c-4f96-bf9f-e14bbd0d653f', '077e7b67-662a-4137-afcb-39deeb7efc7c', 'processional_image', 'Imagen participante en el cortejo de 2026.') on conflict ("id") do update set "outing_id" = excluded."outing_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."outing_entities" ("id", "outing_id", "entity_id", "role", "notes")
values ('24499e62-9c49-44e6-8115-c76d0b6e651f', '0b9ce109-976c-4f96-bf9f-e14bbd0d653f', 'd9c91c8e-7ad3-447f-a383-0d12bde3a2af', 'processional_image', 'Imagen participante en el cortejo de 2026.') on conflict ("id") do update set "outing_id" = excluded."outing_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."outing_entities" ("id", "outing_id", "entity_id", "role", "notes")
values ('d092a9c0-679f-414f-b7f9-a384830ac27f', '0b9ce109-976c-4f96-bf9f-e14bbd0d653f', 'a9761f72-da08-4146-a10d-b4d13f46b44a', 'processional_image', 'Imagen participante en el cortejo de 2026.') on conflict ("id") do update set "outing_id" = excluded."outing_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "outing_id", "scope")
values ('be5b6b84-b9b1-45d3-8f57-9447146e195b', 'c65e3532-d8c6-4589-822f-62d35c7c0e1e', '0b9ce109-976c-4f96-bf9f-e14bbd0d653f', null) on conflict ("id") do update set "source_id" = excluded."source_id", "outing_id" = excluded."outing_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "outing_id", "scope")
values ('e36fb5dd-302b-4905-b7c2-3d49c0d8162b', 'f9ebb143-509d-48fc-9b52-c9b4f4b43807', '0b9ce109-976c-4f96-bf9f-e14bbd0d653f', null) on conflict ("id") do update set "source_id" = excluded."source_id", "outing_id" = excluded."outing_id", "scope" = excluded."scope";

insert into public."accompaniments" ("id", "outing_id", "band_entity_id", "step_entity_id", "position", "year", "notes", "status")
values ('b4b91752-acfa-4c15-8dc1-d4d731a51c3f', '0b9ce109-976c-4f96-bf9f-e14bbd0d653f', '9bd59d4e-2a61-499d-8d07-99012e9fb8d9', 'd7c3fe1e-2dc4-495f-a0bb-50e1a736bc47', 'Tras el paso del Sagrado Descendimiento', 2026, 'Acompañamiento vigente documentado para 2026.', 'published') on conflict ("id") do update set "outing_id" = excluded."outing_id", "band_entity_id" = excluded."band_entity_id", "step_entity_id" = excluded."step_entity_id", "position" = excluded."position", "year" = excluded."year", "notes" = excluded."notes", "status" = excluded."status";

update public."music_accompaniment_periods" set "step_entity_id" = 'd7c3fe1e-2dc4-495f-a0bb-50e1a736bc47', "position" = 'Tras el paso del Sagrado Descendimiento', "date_from_text" = 'Vigente en 2026', "is_current" = true, "status" = 'published' where "id" = 'fc5fda09-3d1c-4cbd-aa97-fb06b3ca8772';

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('e9391be0-b38a-4667-bd58-92c5368c8666', 'brotherhood', 'Pasión', 'hermandad-de-pasion-sevilla', 'Hermandad de Sevilla que realiza estación de penitencia el Jueves Santo.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."brotherhoods" ("entity_id", "official_name", "popular_name", "foundation_text", "municipality_id", "canonical_see_place_id", "neighborhood", "website_url", "brotherhood_types", "current_procession_day", "history_text", "notes")
values ('e9391be0-b38a-4667-bd58-92c5368c8666', 'Archicofradía del Santísimo Sacramento, Pontificia y Real de Nazarenos de Nuestro Padre Jesús de la Pasión y Nuestra Madre y Señora de la Merced', 'Pasión', 'Segundo tercio del siglo XVI; primeras Reglas conservadas de 1598', 'ca85889c-21fe-4367-8477-a57656b25da4', 'cb5dc8bf-87a8-45be-b1e5-0aa2a5c331d3', 'Alfalfa', 'https://www.hermandaddepasion.org/', ARRAY['Penitencia']::text[], 'Jueves Santo', 'Fundada en el convento de la Merced, la corporación se trasladó al Salvador en 1868 y se fusionó con la Sacramental del templo en 1918.', 'Ficha cerrada en el macrolote Jueves Santo HC-016 de 2026.') on conflict ("entity_id") do update set "official_name" = excluded."official_name", "popular_name" = excluded."popular_name", "foundation_text" = excluded."foundation_text", "municipality_id" = excluded."municipality_id", "canonical_see_place_id" = excluded."canonical_see_place_id", "neighborhood" = excluded."neighborhood", "website_url" = excluded."website_url", "brotherhood_types" = excluded."brotherhood_types", "current_procession_day" = excluded."current_procession_day", "history_text" = excluded."history_text", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('63101596-c40e-415b-b88f-8daf2725d92b', '76c67856-725e-4542-a6ce-c55cf11527db', 'e9391be0-b38a-4667-bd58-92c5368c8666', 'Identidad, sede, titulares, pasos, hábito, patrimonio y música') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('123dae44-4b36-4ebf-bce1-b881664ed426', '1279a4de-2ccc-45aa-a58c-f216c9fb5b27', 'e9391be0-b38a-4667-bd58-92c5368c8666', 'Identidad institucional y cultos') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."brotherhood_images" ("id", "brotherhood_entity_id", "image_entity_id", "relation_type", "notes", "status")
values ('2ce531b5-d427-4219-b495-36a7838fa645', 'e9391be0-b38a-4667-bd58-92c5368c8666', 'a658cd94-3577-4953-a98c-2657c9d6222a', 'titular', 'Titular de la corporación.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."brotherhood_images" ("id", "brotherhood_entity_id", "image_entity_id", "relation_type", "notes", "status")
values ('e40fd0ea-24cf-4850-91fa-e4de3e811c04', 'e9391be0-b38a-4667-bd58-92c5368c8666', 'cb0b275f-a57b-4bee-88cb-d52aaf17dcc5', 'titular', 'Titular de la corporación.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."brotherhood_steps" ("id", "brotherhood_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('d60b3b0a-5c23-4d61-b721-975d824ebc7c', 'e9391be0-b38a-4667-bd58-92c5368c8666', 'fefa1e26-3c40-42c5-b3d9-445b7bdd757b', 'processional', 'Paso canónico de la estación de penitencia.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."brotherhood_steps" ("id", "brotherhood_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('1d5ad58c-02d7-4a01-bb3a-81f17b49850d', 'e9391be0-b38a-4667-bd58-92c5368c8666', 'ea34723d-ab74-482a-b7ff-776afda6f50a', 'processional', 'Paso canónico de la estación de penitencia.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_steps" ("id", "image_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('b682499d-ca9b-43ec-bc95-9742e71109f0', 'a658cd94-3577-4953-a98c-2657c9d6222a', 'fefa1e26-3c40-42c5-b3d9-445b7bdd757b', 'processional', 'Relación canónica del cortejo del Jueves Santo.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_steps" ("id", "image_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('ce4488eb-a08e-47e7-8080-3e1839ef31cc', 'cb0b275f-a57b-4bee-88cb-d52aaf17dcc5', 'ea34723d-ab74-482a-b7ff-776afda6f50a', 'processional', 'Relación canónica del cortejo del Jueves Santo.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."cults" ("id", "brotherhood_entity_id", "cult_type", "title", "date_rule", "place_id", "description", "status", "is_recurring", "recurrence_label", "display_order")
values ('91dd1216-9380-458d-bdd7-1d33386d154b', 'e9391be0-b38a-4667-bd58-92c5368c8666', 'Quinario', 'Solemne Quinario a Nuestro Padre Jesús de la Pasión', 'Cuaresma', 'cb5dc8bf-87a8-45be-b1e5-0aa2a5c331d3', 'Culto anual documentado por la corporación o la ficha institucional.', 'published', true, 'Anual', 1) on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "cult_type" = excluded."cult_type", "title" = excluded."title", "date_rule" = excluded."date_rule", "place_id" = excluded."place_id", "description" = excluded."description", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order";

insert into public."source_links" ("id", "source_id", "cult_id", "scope")
values ('e28b4076-877c-4fd9-9f1e-16a30d10f969', '1279a4de-2ccc-45aa-a58c-f216c9fb5b27', '91dd1216-9380-458d-bdd7-1d33386d154b', null) on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id", "scope" = excluded."scope";

insert into public."cults" ("id", "brotherhood_entity_id", "cult_type", "title", "date_rule", "place_id", "description", "status", "is_recurring", "recurrence_label", "display_order")
values ('a9f24f19-e65b-4015-93da-c48e2102f395', 'e9391be0-b38a-4667-bd58-92c5368c8666', 'Función Principal', 'Función Principal de Instituto', 'Pascua de Pentecostés', 'cb5dc8bf-87a8-45be-b1e5-0aa2a5c331d3', 'Culto anual documentado por la corporación o la ficha institucional.', 'published', true, 'Anual', 2) on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "cult_type" = excluded."cult_type", "title" = excluded."title", "date_rule" = excluded."date_rule", "place_id" = excluded."place_id", "description" = excluded."description", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order";

insert into public."source_links" ("id", "source_id", "cult_id", "scope")
values ('dbda948f-1dc0-472a-9269-cd63f095f16e', '1279a4de-2ccc-45aa-a58c-f216c9fb5b27', 'a9f24f19-e65b-4015-93da-c48e2102f395', null) on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id", "scope" = excluded."scope";

insert into public."cults" ("id", "brotherhood_entity_id", "cult_type", "title", "date_rule", "place_id", "description", "status", "is_recurring", "recurrence_label", "display_order")
values ('3af2cc92-0c17-4f1d-a2ec-683131b59c8e', 'e9391be0-b38a-4667-bd58-92c5368c8666', 'Triduo', 'Triduo al Santísimo Sacramento y a la Virgen del Voto', 'Calendario anual', 'cb5dc8bf-87a8-45be-b1e5-0aa2a5c331d3', 'Culto anual documentado por la corporación o la ficha institucional.', 'published', true, 'Anual', 3) on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "cult_type" = excluded."cult_type", "title" = excluded."title", "date_rule" = excluded."date_rule", "place_id" = excluded."place_id", "description" = excluded."description", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order";

insert into public."source_links" ("id", "source_id", "cult_id", "scope")
values ('7685a356-d219-4f56-89be-909ff43d2287', '1279a4de-2ccc-45aa-a58c-f216c9fb5b27', '3af2cc92-0c17-4f1d-a2ec-683131b59c8e', null) on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id", "scope" = excluded."scope";

insert into public."cults" ("id", "brotherhood_entity_id", "cult_type", "title", "date_rule", "place_id", "description", "status", "is_recurring", "recurrence_label", "display_order")
values ('ca537ffe-ca31-4941-bba6-274af4c5b533', 'e9391be0-b38a-4667-bd58-92c5368c8666', 'Novena', 'Novena a Nuestra Madre y Señora de la Merced', 'Septiembre', 'cb5dc8bf-87a8-45be-b1e5-0aa2a5c331d3', 'Culto anual documentado por la corporación o la ficha institucional.', 'published', true, 'Anual', 4) on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "cult_type" = excluded."cult_type", "title" = excluded."title", "date_rule" = excluded."date_rule", "place_id" = excluded."place_id", "description" = excluded."description", "status" = excluded."status", "is_recurring" = excluded."is_recurring", "recurrence_label" = excluded."recurrence_label", "display_order" = excluded."display_order";

insert into public."source_links" ("id", "source_id", "cult_id", "scope")
values ('e7fbc744-b36e-4062-98f4-1775ae9b0741', '1279a4de-2ccc-45aa-a58c-f216c9fb5b27', 'ca537ffe-ca31-4941-bba6-274af4c5b533', null) on conflict ("id") do update set "source_id" = excluded."source_id", "cult_id" = excluded."cult_id", "scope" = excluded."scope";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('fbaa6ce1-685f-4af0-9e1f-75f448715c06', 'heritage_asset', 'Paso de Nuestro Padre Jesús de la Pasión', 'pasion-1-patrimonio', 'Obra de Cayetano González en plata, marfil y madera dorada.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."heritage_assets" ("entity_id", "parent_entity_id", "asset_type", "description", "current_condition", "is_current", "display_order", "is_featured")
values ('fbaa6ce1-685f-4af0-9e1f-75f448715c06', 'e9391be0-b38a-4667-bd58-92c5368c8666', 'Paso procesional', 'Obra de Cayetano González en plata, marfil y madera dorada.', 'Conservado', true, 1, true) on conflict ("entity_id") do update set "parent_entity_id" = excluded."parent_entity_id", "asset_type" = excluded."asset_type", "description" = excluded."description", "current_condition" = excluded."current_condition", "is_current" = excluded."is_current", "display_order" = excluded."display_order", "is_featured" = excluded."is_featured";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('0a69cc30-4417-463e-9fb3-efda19cf89ba', '76c67856-725e-4542-a6ce-c55cf11527db', 'fbaa6ce1-685f-4af0-9e1f-75f448715c06', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('948461e9-4c83-4ddb-839f-a8651b5c2032', 'heritage_asset', 'Conjunto de palio de la Virgen de la Merced', 'pasion-2-patrimonio', 'Conjunto neogótico estrenado en 1929.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."heritage_assets" ("entity_id", "parent_entity_id", "asset_type", "description", "current_condition", "is_current", "display_order", "is_featured")
values ('948461e9-4c83-4ddb-839f-a8651b5c2032', 'e9391be0-b38a-4667-bd58-92c5368c8666', 'Bordado y orfebrería', 'Conjunto neogótico estrenado en 1929.', 'Conservado', true, 2, false) on conflict ("entity_id") do update set "parent_entity_id" = excluded."parent_entity_id", "asset_type" = excluded."asset_type", "description" = excluded."description", "current_condition" = excluded."current_condition", "is_current" = excluded."is_current", "display_order" = excluded."display_order", "is_featured" = excluded."is_featured";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('f19d5149-9cdd-4580-8076-4a58e214a18e', '76c67856-725e-4542-a6ce-c55cf11527db', '948461e9-4c83-4ddb-839f-a8651b5c2032', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."brotherhood_habits" ("id", "brotherhood_entity_id", "name", "tunic_description", "hood_description", "cord_description", "sort_order", "notes", "status")
values ('1b2ee283-8878-44ab-9032-5440138075c5', 'e9391be0-b38a-4667-bd58-92c5368c8666', 'Hábito de Pasión', 'Túnica negra de ruán de hilo con cola.', 'Antifaz negro con escudo mercedario.', 'Cinturón y cíngulo de esparto amarillo.', 1, 'Hábito penitencial documentado por el Consejo.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "name" = excluded."name", "tunic_description" = excluded."tunic_description", "hood_description" = excluded."hood_description", "cord_description" = excluded."cord_description", "sort_order" = excluded."sort_order", "notes" = excluded."notes", "status" = excluded."status";

insert into public."source_links" ("id", "source_id", "brotherhood_habit_id", "scope")
values ('81ffec27-0289-44cc-bbc9-fe4f03197de1', '76c67856-725e-4542-a6ce-c55cf11527db', '1b2ee283-8878-44ab-9032-5440138075c5', null) on conflict ("id") do update set "source_id" = excluded."source_id", "brotherhood_habit_id" = excluded."brotherhood_habit_id", "scope" = excluded."scope";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('5d6cbb30-f9dc-44e6-8052-c30a86a9fd47', 'event', 'Traslado de Pasión al Salvador', 'traslado-pasion-salvador-1868', 'La Archicofradía fijó su sede en la iglesia colegial del Divino Salvador.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."events" ("entity_id", "event_type", "event_date_text", "description", "event_category", "brotherhood_entity_id", "municipality_id", "event_status")
values ('5d6cbb30-f9dc-44e6-8052-c30a86a9fd47', 'Hito histórico', '1868', 'La Archicofradía fijó su sede en la iglesia colegial del Divino Salvador.', 'historical', 'e9391be0-b38a-4667-bd58-92c5368c8666', 'ca85889c-21fe-4367-8477-a57656b25da4', 'held') on conflict ("entity_id") do update set "event_type" = excluded."event_type", "event_date_text" = excluded."event_date_text", "description" = excluded."description", "event_category" = excluded."event_category", "brotherhood_entity_id" = excluded."brotherhood_entity_id", "municipality_id" = excluded."municipality_id", "event_status" = excluded."event_status";

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('a1734229-105a-4588-84d6-3d9cf91d451c', '76c67856-725e-4542-a6ce-c55cf11527db', '5d6cbb30-f9dc-44e6-8052-c30a86a9fd47', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

insert into public."outings" ("id", "brotherhood_entity_id", "outing_type", "character", "title", "outing_date", "year", "departure_time", "return_time", "return_date", "municipality_id", "origin_place_id", "destination_text", "route_summary", "description", "event_status", "status", "slug")
values ('bb2c7a85-9037-4fa8-a8c8-2b79f079d559', 'e9391be0-b38a-4667-bd58-92c5368c8666', 'Estación de Penitencia', 'ordinary', 'Pasión · Estación de Penitencia 2026', '2026-04-02', 2026, '20:20', '01:30', '2026-04-03', 'ca85889c-21fe-4367-8477-a57656b25da4', 'cb5dc8bf-87a8-45be-b1e5-0aa2a5c331d3', 'Santa Iglesia Catedral de Sevilla', 'Itinerario oficial del Jueves Santo de 2026 con tránsito por la Carrera Oficial.', 'Estación de penitencia celebrada el Jueves Santo de 2026.', 'held', 'published', 'pasion-estacion-penitencia-2026') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "outing_type" = excluded."outing_type", "character" = excluded."character", "title" = excluded."title", "outing_date" = excluded."outing_date", "year" = excluded."year", "departure_time" = excluded."departure_time", "return_time" = excluded."return_time", "return_date" = excluded."return_date", "municipality_id" = excluded."municipality_id", "origin_place_id" = excluded."origin_place_id", "destination_text" = excluded."destination_text", "route_summary" = excluded."route_summary", "description" = excluded."description", "event_status" = excluded."event_status", "status" = excluded."status", "slug" = excluded."slug";

insert into public."outing_entities" ("id", "outing_id", "entity_id", "role", "notes")
values ('25575287-029b-4382-a9b5-60f6ed84e459', 'bb2c7a85-9037-4fa8-a8c8-2b79f079d559', 'a658cd94-3577-4953-a98c-2657c9d6222a', 'processional_image', 'Imagen participante en el cortejo de 2026.') on conflict ("id") do update set "outing_id" = excluded."outing_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."outing_entities" ("id", "outing_id", "entity_id", "role", "notes")
values ('a1f0c247-93d2-4126-89ce-f352b3afc057', 'bb2c7a85-9037-4fa8-a8c8-2b79f079d559', 'cb0b275f-a57b-4bee-88cb-d52aaf17dcc5', 'processional_image', 'Imagen participante en el cortejo de 2026.') on conflict ("id") do update set "outing_id" = excluded."outing_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "outing_id", "scope")
values ('ea007997-a378-4727-954d-933a52d5dcff', 'c65e3532-d8c6-4589-822f-62d35c7c0e1e', 'bb2c7a85-9037-4fa8-a8c8-2b79f079d559', null) on conflict ("id") do update set "source_id" = excluded."source_id", "outing_id" = excluded."outing_id", "scope" = excluded."scope";

insert into public."source_links" ("id", "source_id", "outing_id", "scope")
values ('d8af0011-b13d-438c-9b3b-aeb5c54a73b6', '76c67856-725e-4542-a6ce-c55cf11527db', 'bb2c7a85-9037-4fa8-a8c8-2b79f079d559', null) on conflict ("id") do update set "source_id" = excluded."source_id", "outing_id" = excluded."outing_id", "scope" = excluded."scope";

insert into public."accompaniments" ("id", "outing_id", "band_entity_id", "step_entity_id", "position", "year", "notes", "status")
values ('e5a1728e-1973-4a56-ba1b-e1366441848e', 'bb2c7a85-9037-4fa8-a8c8-2b79f079d559', 'a2208260-0000-0000-0000-000000000041', 'ea34723d-ab74-482a-b7ff-776afda6f50a', 'Tras el paso de palio', 2026, 'Acompañamiento vigente documentado para 2026.', 'published') on conflict ("id") do update set "outing_id" = excluded."outing_id", "band_entity_id" = excluded."band_entity_id", "step_entity_id" = excluded."step_entity_id", "position" = excluded."position", "year" = excluded."year", "notes" = excluded."notes", "status" = excluded."status";

update public."music_accompaniment_periods" set "step_entity_id" = 'ea34723d-ab74-482a-b7ff-776afda6f50a', "position" = 'Tras el paso de palio', "date_from_text" = 'Vigente en 2026', "is_current" = true, "status" = 'published' where "id" = '87e2aac5-6a8d-416a-b467-9ddc491fec4c';

insert into public."source_links" ("id", "source_id", "entity_id", "scope")
values ('07c763fb-d7d2-4a33-b037-826bb5faaf08', '76c67856-725e-4542-a6ce-c55cf11527db', 'e9391be0-b38a-4667-bd58-92c5368c8666', 'El paso del Señor realiza la estación sin acompañamiento musical') on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope";

update public."outings" set "status" = 'published' where "id" = '6de2df57-9e4b-48e5-8441-9cdb6bf86d25';

update public."outings" set "status" = 'published' where "id" = 'c894983d-7c1b-4675-bf75-4dd7a6d0330f';

commit;
