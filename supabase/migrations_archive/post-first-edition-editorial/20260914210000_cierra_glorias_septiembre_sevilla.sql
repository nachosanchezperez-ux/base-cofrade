-- HC-016 · macrolote transversal: Glorias de septiembre de Sevilla
-- Cubre once corporaciones; preserva Guadalupe, Juncal, Luz, Santa Marina y Mercedes, y completa seis fichas.
-- Control de homónimos: Inmaculado Corazón de Torreblanca no reutiliza Torreblanca penitencial ni la titular de la Misión.
-- La cita de Torreblanca del 27 de septiembre se conserva como Romería, no como Procesión de Gloria.
-- Fechas futuras permanecen anunciadas; no se fabrican rutas, horas de entrada ni multimedia.
-- Solo DML. Receta idempotente archivada fuera de la cadena estructural activa.
-- Lote gobernado c0160020-0000-4000-8000-000000000001: 114/114, 0 inválidas, 0 fallos.

begin;

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "publication_date", "accessed_at", "notes")
values ('9738ac94-dce0-4f3d-996d-ac65ccbd3205', 'Consejo de Hermandades · Divina Pastora de Santa Ana', 'https://www.hermandades-de-sevilla.org/hermandades/gloria/septiembre/pastora-de-santa-ana/', 'Fuente institucional', 'Consejo General de Hermandades y Cofradías de Sevilla', null, '2026-09-14', 'Historia, titular, paso y patrimonio de la corporación.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "publication_date" = excluded."publication_date", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "publication_date", "accessed_at", "notes")
values ('69def863-73b5-44e0-b2ed-eabb6c506a68', 'Hermandades de Gloria que procesionan el 19 de septiembre de 2026', 'https://www.hermandades-de-sevilla.org/events/hermandades-de-gloria-que-procesionan-el-19-de-septiembre-2026/', 'Fuente institucional', 'Consejo General de Hermandades y Cofradías de Sevilla', null, '2026-09-14', 'Fecha y hora oficiales de las procesiones de la Pastora de Triana y Nuestra Señora de la Luz.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "publication_date" = excluded."publication_date", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "publication_date", "accessed_at", "notes")
values ('2b3111f8-bd42-4040-8234-dad613b740f8', 'Hermandades de Gloria que procesionan el 20 de septiembre de 2026', 'https://www.hermandades-de-sevilla.org/events/hermandades-de-gloria-que-procesionan-el-20-de-septiembre-2026/', 'Fuente institucional', 'Consejo General de Hermandades y Cofradías de Sevilla', null, '2026-09-14', 'Fecha y hora oficial de la procesión de la Divina Pastora de Santa Marina.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "publication_date" = excluded."publication_date", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "publication_date", "accessed_at", "notes")
values ('dd7eaedc-d807-4991-ac4c-a5b59e230f4d', 'Hermandades de Gloria que procesionan el 26 de septiembre de 2026', 'https://www.hermandades-de-sevilla.org/events/hermandades-de-gloria-que-procesionan-el-26-de-septiembre-2026/', 'Fuente institucional', 'Consejo General de Hermandades y Cofradías de Sevilla', null, '2026-09-14', 'Fecha y hora oficiales de Valvanera y Nuestra Señora de los Reyes de los Sastres.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "publication_date" = excluded."publication_date", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "publication_date", "accessed_at", "notes")
values ('66016805-3db8-443e-b1fe-63e00d3fdb54', 'Romería del Inmaculado Corazón de María de Torreblanca · 2026', 'https://www.hermandades-de-sevilla.org/events/hermandades-de-gloria-que-procesionan-el-27-de-septiembre-2026/', 'Fuente institucional', 'Consejo General de Hermandades y Cofradías de Sevilla', null, '2026-09-14', 'Convocatoria institucional de la romería del 27 de septiembre de 2026.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "publication_date" = excluded."publication_date", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."sources" ("id", "name", "url", "source_type", "author_or_publisher", "publication_date", "accessed_at", "notes")
values ('7182facd-3f1b-433b-9df9-17e51961571f', 'Web oficial · Hermandad del Inmaculado Corazón de María', 'https://www.hermandaddelinmaculadocorazondemaria.es/', 'Fuente institucional', 'Hermandad del Inmaculado Corazón de María de Torreblanca', null, '2026-09-14', 'Canal institucional de la corporación letífica de Torreblanca.') on conflict ("id") do update set "name" = excluded."name", "url" = excluded."url", "source_type" = excluded."source_type", "author_or_publisher" = excluded."author_or_publisher", "publication_date" = excluded."publication_date", "accessed_at" = excluded."accessed_at", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "entity_id", "scope", "notes")
values ('167b661a-597a-4c63-ae0f-3f2241ca3a97', '306e12fa-0ec7-418f-a01f-8c34972550ff', 'cdf907dc-f50e-4308-8f39-6c1d18bddb05', 'Censo institucional · Glorias de septiembre', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "entity_id", "scope", "notes")
values ('7080f240-712e-461b-bde5-1b06a56d4d8f', '306e12fa-0ec7-418f-a01f-8c34972550ff', 'd53478f8-3826-4bc8-a264-39ce3b8171da', 'Censo institucional · Glorias de septiembre', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "entity_id", "scope", "notes")
values ('106b0d3d-7bb8-4f5e-863f-e3d32ab5bc54', '306e12fa-0ec7-418f-a01f-8c34972550ff', 'fbd4fb0c-6fb6-4dc5-8667-5b681ce371f2', 'Censo institucional · Glorias de septiembre', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "entity_id", "scope", "notes")
values ('4e729e53-fbea-40da-9a73-856fc954746e', '306e12fa-0ec7-418f-a01f-8c34972550ff', 'bba71371-7526-45d3-bd5a-43bb9793752d', 'Censo institucional · Glorias de septiembre', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "entity_id", "scope", "notes")
values ('e32ba9dd-a63a-404c-aa1b-542dc88b685b', '306e12fa-0ec7-418f-a01f-8c34972550ff', 'c745bcac-65e8-47b6-8076-5caf040b382f', 'Censo institucional · Glorias de septiembre', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "entity_id", "scope", "notes")
values ('931adf08-7e33-4237-817c-81498cf4d6ef', '306e12fa-0ec7-418f-a01f-8c34972550ff', '83c2ed5c-4f63-42da-89e8-8f8d9eb1f9e6', 'Censo institucional · Glorias de septiembre', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "entity_id", "scope", "notes")
values ('478a8f80-f848-47c5-86fe-e06a66d7f0ab', '306e12fa-0ec7-418f-a01f-8c34972550ff', '2595d8b0-6a77-4c0d-a4f5-d18718bfd3db', 'Censo institucional · Glorias de septiembre', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "entity_id", "scope", "notes")
values ('a8331cc9-9cdb-4b55-a7c6-961a04f8b1ea', '306e12fa-0ec7-418f-a01f-8c34972550ff', 'a30dc45e-1614-4da8-a1dd-04c47f9cb5b2', 'Censo institucional · Glorias de septiembre', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "entity_id", "scope", "notes")
values ('24717b08-866c-4123-b0fc-54c6234660da', '306e12fa-0ec7-418f-a01f-8c34972550ff', '7bb3050f-c6ab-4159-bfa3-484a7095bee6', 'Censo institucional · Glorias de septiembre', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "entity_id", "scope", "notes")
values ('843a2b65-0e5b-4239-9e07-ee5a0f742a47', '306e12fa-0ec7-418f-a01f-8c34972550ff', '7ed59114-fd15-46fd-a836-9024728cf065', 'Censo institucional · Glorias de septiembre', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "entity_id", "scope", "notes")
values ('4f640098-0809-4b8b-8736-5f65d604099d', '306e12fa-0ec7-418f-a01f-8c34972550ff', '57856427-ae39-4e6d-9153-ac2ce3e01dd8', 'Censo institucional · Glorias de septiembre', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope", "notes" = excluded."notes";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('e4b03789-b759-4a43-8727-7b04935b112a', 'image', 'Divina Pastora de las Almas de Triana', 'divina-pastora-almas-triana', 'Imagen titular de la Pastora de Triana, obra de Gabriel de Astorga.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('4ff36f59-91d4-4b05-8cbd-b4bf954e2f63', 'image', 'Nuestra Señora de Valvanera', 'nuestra-senora-valvanera-sevilla', 'Imagen titular de la Hermandad de Valvanera, patrona del barrio de la Calzada.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('574e138c-bfe6-412c-9614-1fef4c2dda8b', 'image', 'Santa Lucía, Virgen y Mártir', 'santa-lucia-virgen-martir-sevilla', 'Imagen titular anónima de la escuela barroca sevillana.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('1b7634a6-5913-4708-95b4-594ac9dd8085', 'image', 'Divina Pastora de las Almas de Padre Pío', 'divina-pastora-almas-padre-pio', 'Imagen titular de la Hermandad de la Divina Pastora de Padre Pío.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('962b28a5-f018-41ef-8536-e5a9abfb5750', 'image', 'Inmaculado Corazón de María de Torreblanca', 'inmaculado-corazon-maria-imagen-torreblanca', 'Imagen titular propia de la Hermandad letífica de Torreblanca; no se confunde con la titular homónima de la Misión.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."images" ("entity_id", "image_type", "execution_date_text", "current_condition", "description", "is_dress_image")
values ('e4b03789-b759-4a43-8727-7b04935b112a', 'Virgen de Gloria', 'Siglo XIX', 'extant', 'Imagen de la Divina Pastora realizada por Gabriel de Astorga.', true) on conflict ("entity_id") do update set "image_type" = excluded."image_type", "execution_date_text" = excluded."execution_date_text", "current_condition" = excluded."current_condition", "description" = excluded."description", "is_dress_image" = excluded."is_dress_image";

insert into public."images" ("entity_id", "image_type", "execution_date_text", "current_condition", "description", "is_dress_image")
values ('4ff36f59-91d4-4b05-8cbd-b4bf954e2f63', 'Virgen de Gloria', 'Imagen histórica de cronología no fijada en la fuente', 'extant', 'Conjunto sedente de la Virgen sobre el águila y el árbol de la tradición de Valvanera.', false) on conflict ("entity_id") do update set "image_type" = excluded."image_type", "execution_date_text" = excluded."execution_date_text", "current_condition" = excluded."current_condition", "description" = excluded."description", "is_dress_image" = excluded."is_dress_image";

insert into public."images" ("entity_id", "image_type", "execution_date_text", "current_condition", "description", "is_dress_image")
values ('574e138c-bfe6-412c-9614-1fef4c2dda8b', 'Santa mártir', 'Escuela barroca sevillana', 'extant', 'Talla anónima de Santa Lucía con palma, espada y bandeja con los ojos.', false) on conflict ("entity_id") do update set "image_type" = excluded."image_type", "execution_date_text" = excluded."execution_date_text", "current_condition" = excluded."current_condition", "description" = excluded."description", "is_dress_image" = excluded."is_dress_image";

insert into public."images" ("entity_id", "image_type", "execution_date_text", "current_condition", "description", "is_dress_image")
values ('1b7634a6-5913-4708-95b4-594ac9dd8085', 'Virgen de Gloria', null, 'extant', 'Imagen titular venerada por la corporación de Padre Pío desde sus orígenes devocionales.', true) on conflict ("entity_id") do update set "image_type" = excluded."image_type", "execution_date_text" = excluded."execution_date_text", "current_condition" = excluded."current_condition", "description" = excluded."description", "is_dress_image" = excluded."is_dress_image";

insert into public."images" ("entity_id", "image_type", "execution_date_text", "material", "current_condition", "description", "is_dress_image")
values ('962b28a5-f018-41ef-8536-e5a9abfb5750', 'Virgen de Gloria', 'Anterior o coetánea a 1958; autoría no documentada', 'Escayola', 'extant', 'Imagen del Inmaculado Corazón de María venerada en la parroquia de Torreblanca.', false) on conflict ("entity_id") do update set "image_type" = excluded."image_type", "execution_date_text" = excluded."execution_date_text", "material" = excluded."material", "current_condition" = excluded."current_condition", "description" = excluded."description", "is_dress_image" = excluded."is_dress_image";

insert into public."brotherhood_images" ("id", "brotherhood_entity_id", "image_entity_id", "relation_type", "notes", "status")
values ('6da1958e-1900-4e2f-adbb-790939612151', 'c745bcac-65e8-47b6-8076-5caf040b382f', 'e4b03789-b759-4a43-8727-7b04935b112a', 'titular', 'Titular letífica de la corporación.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_steps" ("id", "image_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('91f277de-db48-4cf2-ab98-ec1344bed33d', 'e4b03789-b759-4a43-8727-7b04935b112a', '5d4448ca-faca-4119-ab45-35cbf57df629', 'processional', 'Imagen titular que preside el paso procesional.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."source_links" ("id", "source_id", "entity_id", "scope", "notes")
values ('27695851-9628-404b-8dfe-0c18766002ac', '9738ac94-dce0-4f3d-996d-ac65ccbd3205', 'e4b03789-b759-4a43-8727-7b04935b112a', 'Identidad y referencia artística', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "brotherhood_image_id", "scope", "notes")
values ('8d35e4b2-da51-4cc8-bf46-c21e426564c9', '9738ac94-dce0-4f3d-996d-ac65ccbd3205', '6da1958e-1900-4e2f-adbb-790939612151', 'Relación titular', null) on conflict ("id") do update set "source_id" = excluded."source_id", "brotherhood_image_id" = excluded."brotherhood_image_id", "scope" = excluded."scope", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "image_step_id", "scope", "notes")
values ('79f880fa-a9c1-4ced-adc6-2dc40d44666c', '9738ac94-dce0-4f3d-996d-ac65ccbd3205', '91f277de-db48-4cf2-ab98-ec1344bed33d', 'Relación con el paso', null) on conflict ("id") do update set "source_id" = excluded."source_id", "image_step_id" = excluded."image_step_id", "scope" = excluded."scope", "notes" = excluded."notes";

insert into public."brotherhood_images" ("id", "brotherhood_entity_id", "image_entity_id", "relation_type", "notes", "status")
values ('136caaa1-1ca9-48c0-8fc1-4ac328ae6424', '83c2ed5c-4f63-42da-89e8-8f8d9eb1f9e6', '4ff36f59-91d4-4b05-8cbd-b4bf954e2f63', 'titular', 'Titular letífica de la corporación.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_steps" ("id", "image_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('4434c0d1-6239-4b40-ac0d-f98107a4c8cc', '4ff36f59-91d4-4b05-8cbd-b4bf954e2f63', '5e92c7b4-1a68-43fd-9072-8c35e6b149da', 'processional', 'Imagen titular que preside el paso procesional.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."source_links" ("id", "source_id", "entity_id", "scope", "notes")
values ('81a278a7-071c-4efd-b0f9-ee3234fe59ea', 'd63a9f14-27e8-45bc-b901-6f32c7a584de', '4ff36f59-91d4-4b05-8cbd-b4bf954e2f63', 'Identidad y referencia artística', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "brotherhood_image_id", "scope", "notes")
values ('e9683fee-3b07-412c-854e-e293b9c4af9d', 'd63a9f14-27e8-45bc-b901-6f32c7a584de', '136caaa1-1ca9-48c0-8fc1-4ac328ae6424', 'Relación titular', null) on conflict ("id") do update set "source_id" = excluded."source_id", "brotherhood_image_id" = excluded."brotherhood_image_id", "scope" = excluded."scope", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "image_step_id", "scope", "notes")
values ('b7259998-00b2-4394-800a-fa1de2a1b78d', 'd63a9f14-27e8-45bc-b901-6f32c7a584de', '4434c0d1-6239-4b40-ac0d-f98107a4c8cc', 'Relación con el paso', null) on conflict ("id") do update set "source_id" = excluded."source_id", "image_step_id" = excluded."image_step_id", "scope" = excluded."scope", "notes" = excluded."notes";

insert into public."brotherhood_images" ("id", "brotherhood_entity_id", "image_entity_id", "relation_type", "notes", "status")
values ('d5adbd2c-43a4-4dd9-9da3-346438ef98f5', 'a30dc45e-1614-4da8-a1dd-04c47f9cb5b2', '574e138c-bfe6-412c-9614-1fef4c2dda8b', 'titular', 'Titular letífica de la corporación.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_steps" ("id", "image_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('68d7062a-6d4c-4d31-a634-46ffaca40870', '574e138c-bfe6-412c-9614-1fef4c2dda8b', 'c84b1f62-9e37-4a05-b218-7d46f3c951ea', 'processional', 'Imagen titular que preside el paso procesional.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."source_links" ("id", "source_id", "entity_id", "scope", "notes")
values ('dc4b6297-2417-4b05-b02e-201518cbb2e0', '0f61c9a4-e827-4b5d-91a3-6c2f8e704bd1', '574e138c-bfe6-412c-9614-1fef4c2dda8b', 'Identidad y referencia artística', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "brotherhood_image_id", "scope", "notes")
values ('cd07c791-6163-4d1d-80db-a3f35f44e514', '0f61c9a4-e827-4b5d-91a3-6c2f8e704bd1', 'd5adbd2c-43a4-4dd9-9da3-346438ef98f5', 'Relación titular', null) on conflict ("id") do update set "source_id" = excluded."source_id", "brotherhood_image_id" = excluded."brotherhood_image_id", "scope" = excluded."scope", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "image_step_id", "scope", "notes")
values ('9281894a-4999-4787-aca5-3515e91e59df', '0f61c9a4-e827-4b5d-91a3-6c2f8e704bd1', '68d7062a-6d4c-4d31-a634-46ffaca40870', 'Relación con el paso', null) on conflict ("id") do update set "source_id" = excluded."source_id", "image_step_id" = excluded."image_step_id", "scope" = excluded."scope", "notes" = excluded."notes";

insert into public."brotherhood_images" ("id", "brotherhood_entity_id", "image_entity_id", "relation_type", "notes", "status")
values ('83eeed66-d5ff-41d0-a207-783c9b7f5fd8', '57856427-ae39-4e6d-9153-ac2ce3e01dd8', '1b7634a6-5913-4708-95b4-594ac9dd8085', 'titular', 'Titular letífica de la corporación.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."image_steps" ("id", "image_entity_id", "step_entity_id", "relation_type", "notes", "status")
values ('dbb3d855-7480-4dcf-992f-58b6fbe446ac', '1b7634a6-5913-4708-95b4-594ac9dd8085', '81a54e2c-fbde-447c-bd79-d460838b23dd', 'processional', 'Imagen titular que preside el paso procesional.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "step_entity_id" = excluded."step_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."source_links" ("id", "source_id", "entity_id", "scope", "notes")
values ('7de82cd6-5bc5-4b47-89ad-ede0883f7f1e', 'b7e8d2a1-0c4f-4d68-9a35-21e9c7f64b12', '1b7634a6-5913-4708-95b4-594ac9dd8085', 'Identidad y referencia artística', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "brotherhood_image_id", "scope", "notes")
values ('13a617d5-6a44-4981-83d2-85c878164b7b', 'b7e8d2a1-0c4f-4d68-9a35-21e9c7f64b12', '83eeed66-d5ff-41d0-a207-783c9b7f5fd8', 'Relación titular', null) on conflict ("id") do update set "source_id" = excluded."source_id", "brotherhood_image_id" = excluded."brotherhood_image_id", "scope" = excluded."scope", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "image_step_id", "scope", "notes")
values ('64d38fd7-0413-403a-a4e9-48e6be1830f8', 'b7e8d2a1-0c4f-4d68-9a35-21e9c7f64b12', 'dbb3d855-7480-4dcf-992f-58b6fbe446ac', 'Relación con el paso', null) on conflict ("id") do update set "source_id" = excluded."source_id", "image_step_id" = excluded."image_step_id", "scope" = excluded."scope", "notes" = excluded."notes";

insert into public."brotherhood_images" ("id", "brotherhood_entity_id", "image_entity_id", "relation_type", "notes", "status")
values ('6f90f4a4-198a-494c-a04e-eedc4410c78f', '7ed59114-fd15-46fd-a836-9024728cf065', '962b28a5-f018-41ef-8536-e5a9abfb5750', 'titular', 'Titular letífica propia de la Hermandad del Inmaculado Corazón de María de Torreblanca.', 'published') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "image_entity_id" = excluded."image_entity_id", "relation_type" = excluded."relation_type", "notes" = excluded."notes", "status" = excluded."status";

insert into public."source_links" ("id", "source_id", "entity_id", "scope", "notes")
values ('0b9ff4ef-7bcb-4e85-b1c2-0533c379afd9', '7182facd-3f1b-433b-9df9-17e51961571f', '962b28a5-f018-41ef-8536-e5a9abfb5750', 'Identidad de la titular', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "brotherhood_image_id", "scope", "notes")
values ('d6f32a7b-cbda-427d-bac9-4a36331b2cdf', '7182facd-3f1b-433b-9df9-17e51961571f', '6f90f4a4-198a-494c-a04e-eedc4410c78f', 'Relación titular', null) on conflict ("id") do update set "source_id" = excluded."source_id", "brotherhood_image_id" = excluded."brotherhood_image_id", "scope" = excluded."scope", "notes" = excluded."notes";

insert into public."image_authorships" ("id", "image_entity_id", "agent_entity_id", "authorship_type", "role_name", "date_from_text", "certainty", "notes", "status")
values ('88d6aa7a-4605-4502-b187-b41615679f21', 'e4b03789-b759-4a43-8727-7b04935b112a', '3a000000-0000-0000-0000-000000000001', 'author', 'Escultor', 'Siglo XIX', 'documented', 'Autoría consignada por la ficha institucional del Consejo.', 'published') on conflict ("id") do update set "image_entity_id" = excluded."image_entity_id", "agent_entity_id" = excluded."agent_entity_id", "authorship_type" = excluded."authorship_type", "role_name" = excluded."role_name", "date_from_text" = excluded."date_from_text", "certainty" = excluded."certainty", "notes" = excluded."notes", "status" = excluded."status";

insert into public."source_links" ("id", "source_id", "image_authorship_id", "scope", "notes")
values ('acfca58a-1545-4bf0-bd15-d3369051a100', '9738ac94-dce0-4f3d-996d-ac65ccbd3205', '88d6aa7a-4605-4502-b187-b41615679f21', 'Autoría de la imagen', null) on conflict ("id") do update set "source_id" = excluded."source_id", "image_authorship_id" = excluded."image_authorship_id", "scope" = excluded."scope", "notes" = excluded."notes";

insert into public."places" ("id", "municipality_id", "name", "slug", "place_type", "address", "notes")
values ('85689979-460c-451f-b80b-9487551136f8', 'ca85889c-21fe-4367-8477-a57656b25da4', 'Parroquia del Inmaculado Corazón de María', 'parroquia-inmaculado-corazon-maria-torreblanca', 'Parroquia', null, 'Sede canónica de la Hermandad letífica del Inmaculado Corazón de María de Torreblanca.') on conflict ("id") do update set "municipality_id" = excluded."municipality_id", "name" = excluded."name", "slug" = excluded."slug", "place_type" = excluded."place_type", "address" = excluded."address", "notes" = excluded."notes";

update public."brotherhoods" set "foundation_text" = '12 de diciembre de 1880', "notes" = 'Ficha completada en el macrolote HC-016 de Glorias de septiembre de 2026.' where "entity_id" = 'c745bcac-65e8-47b6-8076-5caf040b382f';

update public."brotherhoods" set "official_name" = 'Hermandad del Inmaculado Corazón de María', "popular_name" = 'Inmaculado Corazón de María de Torreblanca', "foundation_text" = '1958', "municipality_id" = 'ca85889c-21fe-4367-8477-a57656b25da4', "canonical_see_place_id" = '85689979-460c-451f-b80b-9487551136f8', "neighborhood" = 'Torreblanca', "website_url" = 'https://www.hermandaddelinmaculadocorazondemaria.es/', "brotherhood_types" = ARRAY['Gloria']::text[], "history_text" = 'Corporación letífica fundada en 1958 en torno a la devoción del Inmaculado Corazón de María en Torreblanca. Celebra su romería anual en septiembre.', "notes" = 'Identidad separada de la Hermandad penitencial de los Dolores de Torreblanca y de la imagen homónima de la Misión.' where "entity_id" = '7ed59114-fd15-46fd-a836-9024728cf065';

insert into public."source_links" ("id", "source_id", "entity_id", "scope", "notes")
values ('3015d035-909d-40ce-b559-be59b26b2623', '7182facd-3f1b-433b-9df9-17e51961571f', '7ed59114-fd15-46fd-a836-9024728cf065', 'Identidad, sede y canal institucional', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope", "notes" = excluded."notes";

update public."steps" set "step_type" = 'Gloria', "execution_date_text" = 'Respiraderos de 1939; canastilla de 1993; candelabros de 2003', "description" = 'Paso de la Divina Pastora de Triana con respiraderos de Andrés Contreras, canastilla de Antonio Pérez Barrio y candelabros de Orfebrería Andaluza.', "current_condition" = 'preserved' where "entity_id" = '5d4448ca-faca-4119-ab45-35cbf57df629';

update public."steps" set "step_type" = 'Gloria', "execution_date_text" = '1997', "materials" = 'Metal plateado', "description" = 'Paso estrenado el 27 de septiembre de 1997, con canastilla, respiraderos y cartelas realizados por Manuel de los Ríos.', "current_condition" = 'preserved' where "entity_id" = '5e92c7b4-1a68-43fd-9072-8c35e6b149da';

update public."steps" set "step_type" = 'Gloria', "execution_date_text" = 'Peana del siglo XVIII; respiraderos de 1938; candelabros de 1961', "description" = 'Paso de Santa Lucía con peana procedente de Santa Paula, respiraderos de Francisco Ruiz y candelabros de Juan Pérez Calvo.', "current_condition" = 'preserved' where "entity_id" = 'c84b1f62-9e37-4a05-b218-7d46f3c951ea';

update public."steps" set "step_type" = 'Gloria', "current_condition" = 'preserved', "description" = 'Paso procesional de la Divina Pastora de las Almas de Padre Pío.' where "entity_id" = '81a54e2c-fbde-447c-bd79-d460838b23dd';

insert into public."source_links" ("id", "source_id", "entity_id", "scope", "notes")
values ('849872bf-6116-4c55-af14-d373f1d74f66', '9738ac94-dce0-4f3d-996d-ac65ccbd3205', '5d4448ca-faca-4119-ab45-35cbf57df629', 'Paso procesional', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "entity_id", "scope", "notes")
values ('afff3f5b-c705-459e-b382-b8be38aa52b6', 'd63a9f14-27e8-45bc-b901-6f32c7a584de', '5e92c7b4-1a68-43fd-9072-8c35e6b149da', 'Paso procesional', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "entity_id", "scope", "notes")
values ('3289ff3e-2f69-49eb-bc38-6c1f5da04fc1', '0f61c9a4-e827-4b5d-91a3-6c2f8e704bd1', 'c84b1f62-9e37-4a05-b218-7d46f3c951ea', 'Paso procesional', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "entity_id", "scope", "notes")
values ('20dbd0b2-d0af-446f-a7c5-c907bd5004c9', 'b7e8d2a1-0c4f-4d68-9a35-21e9c7f64b12', '81a54e2c-fbde-447c-bd79-d460838b23dd', 'Paso procesional', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope", "notes" = excluded."notes";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('80d492ae-0ed0-4900-a18c-5c7f3ad3e4bc', 'heritage_asset', 'Peana de Nuestra Señora de la Luz', 'patrimonio-luz-peana', 'Peana con angelitos entre guirnaldas, integrada en el paso diseñado por Castillo Lastrucci en 1944.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."heritage_assets" ("entity_id", "parent_entity_id", "asset_type", "description", "current_condition", "is_current", "display_order", "is_featured")
values ('80d492ae-0ed0-4900-a18c-5c7f3ad3e4bc', 'cdf907dc-f50e-4308-8f39-6c1d18bddb05', 'Peana', 'Peana con angelitos entre guirnaldas, integrada en el paso diseñado por Castillo Lastrucci en 1944.', 'Conservado', true, 1, true) on conflict ("entity_id") do update set "parent_entity_id" = excluded."parent_entity_id", "asset_type" = excluded."asset_type", "description" = excluded."description", "current_condition" = excluded."current_condition", "is_current" = excluded."is_current", "display_order" = excluded."display_order", "is_featured" = excluded."is_featured";

insert into public."source_links" ("id", "source_id", "entity_id", "scope", "notes")
values ('a21b5e22-2b50-40b5-bac4-86ab4dab0d9d', '128abd4c-a01a-4b08-8062-05d7bba46b9e', '80d492ae-0ed0-4900-a18c-5c7f3ad3e4bc', 'Patrimonio', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope", "notes" = excluded."notes";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('e312559f-c969-419a-8d9b-19ae32511853', 'heritage_asset', 'Canastilla y candelabros del paso de la Luz', 'patrimonio-luz-paso', 'Canastilla, cartelas, mascarones, ángeles y candelabros del conjunto concebido por Castillo Lastrucci.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."heritage_assets" ("entity_id", "parent_entity_id", "asset_type", "description", "current_condition", "is_current", "display_order", "is_featured")
values ('e312559f-c969-419a-8d9b-19ae32511853', 'cdf907dc-f50e-4308-8f39-6c1d18bddb05', 'Paso procesional', 'Canastilla, cartelas, mascarones, ángeles y candelabros del conjunto concebido por Castillo Lastrucci.', 'Conservado', true, 1, true) on conflict ("entity_id") do update set "parent_entity_id" = excluded."parent_entity_id", "asset_type" = excluded."asset_type", "description" = excluded."description", "current_condition" = excluded."current_condition", "is_current" = excluded."is_current", "display_order" = excluded."display_order", "is_featured" = excluded."is_featured";

insert into public."source_links" ("id", "source_id", "entity_id", "scope", "notes")
values ('d1ac9277-bde4-4117-bd19-e71fabc11c86', '128abd4c-a01a-4b08-8062-05d7bba46b9e', 'e312559f-c969-419a-8d9b-19ae32511853', 'Patrimonio', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope", "notes" = excluded."notes";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('8910a012-97b5-469e-a131-3034ece6680e', 'heritage_asset', 'Respiraderos del paso de la Pastora de Triana', 'patrimonio-pastora-triana-respiraderos', 'Respiraderos realizados por Andrés Contreras en 1939.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."heritage_assets" ("entity_id", "parent_entity_id", "asset_type", "description", "current_condition", "is_current", "display_order", "is_featured")
values ('8910a012-97b5-469e-a131-3034ece6680e', 'c745bcac-65e8-47b6-8076-5caf040b382f', 'Orfebrería', 'Respiraderos realizados por Andrés Contreras en 1939.', 'Conservado', true, 1, true) on conflict ("entity_id") do update set "parent_entity_id" = excluded."parent_entity_id", "asset_type" = excluded."asset_type", "description" = excluded."description", "current_condition" = excluded."current_condition", "is_current" = excluded."is_current", "display_order" = excluded."display_order", "is_featured" = excluded."is_featured";

insert into public."source_links" ("id", "source_id", "entity_id", "scope", "notes")
values ('33cd7b64-fa85-4e40-9319-ba60063341a6', '9738ac94-dce0-4f3d-996d-ac65ccbd3205', '8910a012-97b5-469e-a131-3034ece6680e', 'Patrimonio', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope", "notes" = excluded."notes";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('ad269cb8-246d-40c9-9fcc-94f092bfcd67', 'heritage_asset', 'Candelabros del paso de la Pastora de Triana', 'patrimonio-pastora-triana-candelabros', 'Candelabros repujados de nueve luces realizados en 2003 por Orfebrería Andaluza.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."heritage_assets" ("entity_id", "parent_entity_id", "asset_type", "description", "current_condition", "is_current", "display_order", "is_featured")
values ('ad269cb8-246d-40c9-9fcc-94f092bfcd67', 'c745bcac-65e8-47b6-8076-5caf040b382f', 'Orfebrería', 'Candelabros repujados de nueve luces realizados en 2003 por Orfebrería Andaluza.', 'Conservado', true, 1, true) on conflict ("entity_id") do update set "parent_entity_id" = excluded."parent_entity_id", "asset_type" = excluded."asset_type", "description" = excluded."description", "current_condition" = excluded."current_condition", "is_current" = excluded."is_current", "display_order" = excluded."display_order", "is_featured" = excluded."is_featured";

insert into public."source_links" ("id", "source_id", "entity_id", "scope", "notes")
values ('5e3523b9-5d44-472d-85aa-5c424bea800a', '9738ac94-dce0-4f3d-996d-ac65ccbd3205', 'ad269cb8-246d-40c9-9fcc-94f092bfcd67', 'Patrimonio', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope", "notes" = excluded."notes";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('e606af53-8556-4554-b5d5-4de71a0cd1f0', 'heritage_asset', 'Conjunto escultórico de Nuestra Señora de Valvanera', 'patrimonio-valvanera-conjunto', 'Conjunto sedente de la Virgen sobre un águila y un árbol, acompañado por las figuras de los dos varones de la tradición.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."heritage_assets" ("entity_id", "parent_entity_id", "asset_type", "description", "current_condition", "is_current", "display_order", "is_featured")
values ('e606af53-8556-4554-b5d5-4de71a0cd1f0', '83c2ed5c-4f63-42da-89e8-8f8d9eb1f9e6', 'Imaginería', 'Conjunto sedente de la Virgen sobre un águila y un árbol, acompañado por las figuras de los dos varones de la tradición.', 'Conservado', true, 1, true) on conflict ("entity_id") do update set "parent_entity_id" = excluded."parent_entity_id", "asset_type" = excluded."asset_type", "description" = excluded."description", "current_condition" = excluded."current_condition", "is_current" = excluded."is_current", "display_order" = excluded."display_order", "is_featured" = excluded."is_featured";

insert into public."source_links" ("id", "source_id", "entity_id", "scope", "notes")
values ('ef85e18b-c685-4732-b987-8782bb00f593', 'd63a9f14-27e8-45bc-b901-6f32c7a584de', 'e606af53-8556-4554-b5d5-4de71a0cd1f0', 'Patrimonio', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope", "notes" = excluded."notes";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('1a7ffb12-b223-44da-a1c4-1c19a2f3ffa4', 'heritage_asset', 'Cartelas del paso de Nuestra Señora de Valvanera', 'patrimonio-valvanera-cartelas', 'Cartelas del paso de 1997 con representaciones marianas, santos y el escudo corporativo.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."heritage_assets" ("entity_id", "parent_entity_id", "asset_type", "description", "current_condition", "is_current", "display_order", "is_featured")
values ('1a7ffb12-b223-44da-a1c4-1c19a2f3ffa4', '83c2ed5c-4f63-42da-89e8-8f8d9eb1f9e6', 'Orfebrería', 'Cartelas del paso de 1997 con representaciones marianas, santos y el escudo corporativo.', 'Conservado', true, 1, true) on conflict ("entity_id") do update set "parent_entity_id" = excluded."parent_entity_id", "asset_type" = excluded."asset_type", "description" = excluded."description", "current_condition" = excluded."current_condition", "is_current" = excluded."is_current", "display_order" = excluded."display_order", "is_featured" = excluded."is_featured";

insert into public."source_links" ("id", "source_id", "entity_id", "scope", "notes")
values ('0369d246-ee01-492c-aaf6-327937bd946a', 'd63a9f14-27e8-45bc-b901-6f32c7a584de', '1a7ffb12-b223-44da-a1c4-1c19a2f3ffa4', 'Patrimonio', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope", "notes" = excluded."notes";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('9f730c63-c776-479c-b1bd-f2860f17fe80', 'heritage_asset', 'Peana procesional de Santa Lucía', 'patrimonio-santa-lucia-peana', 'Peana del siglo XVIII adquirida al monasterio de Santa Paula.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."heritage_assets" ("entity_id", "parent_entity_id", "asset_type", "description", "current_condition", "is_current", "display_order", "is_featured")
values ('9f730c63-c776-479c-b1bd-f2860f17fe80', 'a30dc45e-1614-4da8-a1dd-04c47f9cb5b2', 'Talla', 'Peana del siglo XVIII adquirida al monasterio de Santa Paula.', 'Conservado', true, 1, true) on conflict ("entity_id") do update set "parent_entity_id" = excluded."parent_entity_id", "asset_type" = excluded."asset_type", "description" = excluded."description", "current_condition" = excluded."current_condition", "is_current" = excluded."is_current", "display_order" = excluded."display_order", "is_featured" = excluded."is_featured";

insert into public."source_links" ("id", "source_id", "entity_id", "scope", "notes")
values ('d691586e-b61a-4bbe-b3e3-4764c31dbc27', '0f61c9a4-e827-4b5d-91a3-6c2f8e704bd1', '9f730c63-c776-479c-b1bd-f2860f17fe80', 'Patrimonio', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope", "notes" = excluded."notes";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('fbe9c9ab-bc72-470c-a65c-4e3fe69016d4', 'heritage_asset', 'Respiraderos del paso de Santa Lucía', 'patrimonio-santa-lucia-respiraderos', 'Respiraderos realizados por Francisco Ruiz en 1938.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."heritage_assets" ("entity_id", "parent_entity_id", "asset_type", "description", "current_condition", "is_current", "display_order", "is_featured")
values ('fbe9c9ab-bc72-470c-a65c-4e3fe69016d4', 'a30dc45e-1614-4da8-a1dd-04c47f9cb5b2', 'Paso procesional', 'Respiraderos realizados por Francisco Ruiz en 1938.', 'Conservado', true, 1, true) on conflict ("entity_id") do update set "parent_entity_id" = excluded."parent_entity_id", "asset_type" = excluded."asset_type", "description" = excluded."description", "current_condition" = excluded."current_condition", "is_current" = excluded."is_current", "display_order" = excluded."display_order", "is_featured" = excluded."is_featured";

insert into public."source_links" ("id", "source_id", "entity_id", "scope", "notes")
values ('cb0935b5-143a-4f63-a43b-9e6b5c0ddcf7', '0f61c9a4-e827-4b5d-91a3-6c2f8e704bd1', 'fbe9c9ab-bc72-470c-a65c-4e3fe69016d4', 'Patrimonio', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope", "notes" = excluded."notes";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('7d2d8e6e-26ee-4b75-9f02-cf455a183fb4', 'heritage_asset', 'Candelabros del paso de Santa Lucía', 'patrimonio-santa-lucia-candelabros', 'Candelabros mayores realizados por Juan Pérez Calvo en 1961.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."heritage_assets" ("entity_id", "parent_entity_id", "asset_type", "description", "current_condition", "is_current", "display_order", "is_featured")
values ('7d2d8e6e-26ee-4b75-9f02-cf455a183fb4', 'a30dc45e-1614-4da8-a1dd-04c47f9cb5b2', 'Paso procesional', 'Candelabros mayores realizados por Juan Pérez Calvo en 1961.', 'Conservado', true, 1, true) on conflict ("entity_id") do update set "parent_entity_id" = excluded."parent_entity_id", "asset_type" = excluded."asset_type", "description" = excluded."description", "current_condition" = excluded."current_condition", "is_current" = excluded."is_current", "display_order" = excluded."display_order", "is_featured" = excluded."is_featured";

insert into public."source_links" ("id", "source_id", "entity_id", "scope", "notes")
values ('3f2569a3-9930-4bd8-8393-d2176cdd5496', '0f61c9a4-e827-4b5d-91a3-6c2f8e704bd1', '7d2d8e6e-26ee-4b75-9f02-cf455a183fb4', 'Patrimonio', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope", "notes" = excluded."notes";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('d1e6b99e-07df-490a-9e4d-f210b4c57316', 'heritage_asset', 'Tumbilla procesional de Nuestra Señora de los Reyes', 'patrimonio-sastres-tumbilla', 'Tumbilla que configura la singular presentación procesional de la patrona de los Sastres.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."heritage_assets" ("entity_id", "parent_entity_id", "asset_type", "description", "current_condition", "is_current", "display_order", "is_featured")
values ('d1e6b99e-07df-490a-9e4d-f210b4c57316', '7bb3050f-c6ab-4159-bfa3-484a7095bee6', 'Paso procesional', 'Tumbilla que configura la singular presentación procesional de la patrona de los Sastres.', 'Conservado', true, 1, true) on conflict ("entity_id") do update set "parent_entity_id" = excluded."parent_entity_id", "asset_type" = excluded."asset_type", "description" = excluded."description", "current_condition" = excluded."current_condition", "is_current" = excluded."is_current", "display_order" = excluded."display_order", "is_featured" = excluded."is_featured";

insert into public."source_links" ("id", "source_id", "entity_id", "scope", "notes")
values ('7fed6106-3e3f-415c-a1b6-79e10ca02e6a', 'daac3ace-134c-4ef2-9702-6a6097efc8dd', 'd1e6b99e-07df-490a-9e4d-f210b4c57316', 'Patrimonio', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope", "notes" = excluded."notes";

insert into public."entities" ("id", "entity_type", "name", "slug", "summary", "status")
values ('01b20277-ff87-493d-8bcb-d1a14e68fef9', 'heritage_asset', 'Conjunto procesional de la Divina Pastora de Padre Pío', 'patrimonio-padre-pio-patrimonio', 'Paso de la titular integrado en el patrimonio corporativo consolidado desde la etapa de Agrupación Parroquial.', 'published') on conflict ("id") do update set "entity_type" = excluded."entity_type", "name" = excluded."name", "slug" = excluded."slug", "summary" = excluded."summary", "status" = excluded."status";

insert into public."heritage_assets" ("entity_id", "parent_entity_id", "asset_type", "description", "current_condition", "is_current", "display_order", "is_featured")
values ('01b20277-ff87-493d-8bcb-d1a14e68fef9', '57856427-ae39-4e6d-9153-ac2ce3e01dd8', 'Paso procesional', 'Paso de la titular integrado en el patrimonio corporativo consolidado desde la etapa de Agrupación Parroquial.', 'Conservado', true, 1, true) on conflict ("entity_id") do update set "parent_entity_id" = excluded."parent_entity_id", "asset_type" = excluded."asset_type", "description" = excluded."description", "current_condition" = excluded."current_condition", "is_current" = excluded."is_current", "display_order" = excluded."display_order", "is_featured" = excluded."is_featured";

insert into public."source_links" ("id", "source_id", "entity_id", "scope", "notes")
values ('aff46a8a-243c-4b04-ba37-1805dfb86325', 'b7e8d2a1-0c4f-4d68-9a35-21e9c7f64b12', '01b20277-ff87-493d-8bcb-d1a14e68fef9', 'Patrimonio', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope", "notes" = excluded."notes";

update public."outings" set "departure_time" = '19:00', "event_status" = 'announced', "status" = 'published' where "id" = '4943b25e-666c-426b-9b8a-3d890a38a7f8';

update public."outings" set "departure_time" = '18:30', "event_status" = 'announced', "status" = 'published' where "id" = 'ec48ddb8-962a-404e-9d04-524338eeb125';

insert into public."source_links" ("id", "source_id", "outing_id", "scope", "notes")
values ('b35904bf-c689-4400-8054-384c8ade37bc', '69def863-73b5-44e0-b2ed-eabb6c506a68', '4943b25e-666c-426b-9b8a-3d890a38a7f8', 'Fecha y hora · 2026', null) on conflict ("id") do update set "source_id" = excluded."source_id", "outing_id" = excluded."outing_id", "scope" = excluded."scope", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "outing_id", "scope", "notes")
values ('c86b9d68-150b-4c8e-adba-5ec6a9f2b2b3', 'dd7eaedc-d807-4991-ac4c-a5b59e230f4d', 'ec48ddb8-962a-404e-9d04-524338eeb125', 'Fecha y hora · 2026', null) on conflict ("id") do update set "source_id" = excluded."source_id", "outing_id" = excluded."outing_id", "scope" = excluded."scope", "notes" = excluded."notes";

insert into public."outings" ("id", "brotherhood_entity_id", "outing_type", "character", "title", "outing_date", "year", "departure_time", "return_time", "municipality_id", "origin_place_id", "destination_place_id", "reason", "route", "description", "event_status", "status", "slug", "origin_text", "destination_text")
values ('ded6efa1-4f8c-4e11-b854-eb3c7007e325', '7bb3050f-c6ab-4159-bfa3-484a7095bee6', 'Procesión de Gloria', 'ordinary', 'Procesión de Nuestra Señora de los Reyes de los Sastres · 2026', '2026-09-26', 2026, '19:00', null, 'ca85889c-21fe-4367-8477-a57656b25da4', null, null, 'Procesión anual de la Hermandad de los Sastres.', null, 'Salida procesional anunciada por el Consejo para el 26 de septiembre de 2026.', 'announced', 'published', 'procesion-reyes-sastres-sevilla-2026', 'Parroquia de San Ildefonso', 'Parroquia de San Ildefonso') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "outing_type" = excluded."outing_type", "character" = excluded."character", "title" = excluded."title", "outing_date" = excluded."outing_date", "year" = excluded."year", "departure_time" = excluded."departure_time", "return_time" = excluded."return_time", "municipality_id" = excluded."municipality_id", "origin_place_id" = excluded."origin_place_id", "destination_place_id" = excluded."destination_place_id", "reason" = excluded."reason", "route" = excluded."route", "description" = excluded."description", "event_status" = excluded."event_status", "status" = excluded."status", "slug" = excluded."slug", "origin_text" = excluded."origin_text", "destination_text" = excluded."destination_text";

insert into public."outing_entities" ("id", "outing_id", "entity_id", "role", "notes")
values ('d06c84ca-4927-4deb-bbf7-21b413a2c915', 'ded6efa1-4f8c-4e11-b854-eb3c7007e325', 'b0a76878-8949-46a8-937d-50237828e087', 'processional_image', 'Imagen titular participante en la procesión anunciada de 2026.') on conflict ("id") do update set "outing_id" = excluded."outing_id", "entity_id" = excluded."entity_id", "role" = excluded."role", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "outing_id", "scope", "notes")
values ('bec74fcb-aa03-4575-8321-774610b3d9a3', 'dd7eaedc-d807-4991-ac4c-a5b59e230f4d', 'ded6efa1-4f8c-4e11-b854-eb3c7007e325', 'Fecha y hora · 2026', null) on conflict ("id") do update set "source_id" = excluded."source_id", "outing_id" = excluded."outing_id", "scope" = excluded."scope", "notes" = excluded."notes";

insert into public."outings" ("id", "brotherhood_entity_id", "outing_type", "character", "title", "outing_date", "year", "departure_time", "return_time", "municipality_id", "origin_place_id", "destination_place_id", "reason", "route", "description", "event_status", "status", "slug", "origin_text", "destination_text")
values ('3335fe85-6bd7-4a34-a642-2c9e0c56679a', '7ed59114-fd15-46fd-a836-9024728cf065', 'Romería', 'ordinary', 'Romería del Inmaculado Corazón de María de Torreblanca · 2026', '2026-09-27', 2026, '09:00', null, 'ca85889c-21fe-4367-8477-a57656b25da4', '85689979-460c-451f-b80b-9487551136f8', null, 'Romería anual de la corporación letífica de Torreblanca.', null, 'Romería anunciada para el 27 de septiembre de 2026; no se clasifica como Procesión de Gloria.', 'announced', 'published', 'romeria-inmaculado-corazon-maria-torreblanca-2026', 'Parroquia del Inmaculado Corazón de María', null) on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "outing_type" = excluded."outing_type", "character" = excluded."character", "title" = excluded."title", "outing_date" = excluded."outing_date", "year" = excluded."year", "departure_time" = excluded."departure_time", "return_time" = excluded."return_time", "municipality_id" = excluded."municipality_id", "origin_place_id" = excluded."origin_place_id", "destination_place_id" = excluded."destination_place_id", "reason" = excluded."reason", "route" = excluded."route", "description" = excluded."description", "event_status" = excluded."event_status", "status" = excluded."status", "slug" = excluded."slug", "origin_text" = excluded."origin_text", "destination_text" = excluded."destination_text";

insert into public."source_links" ("id", "source_id", "outing_id", "scope", "notes")
values ('2995212e-9b58-4efc-a307-281a9035ea85', '66016805-3db8-443e-b1fe-63e00d3fdb54', '3335fe85-6bd7-4a34-a642-2c9e0c56679a', 'Convocatoria oficial · 2026', null) on conflict ("id") do update set "source_id" = excluded."source_id", "outing_id" = excluded."outing_id", "scope" = excluded."scope", "notes" = excluded."notes";

insert into public."music_accompaniment_periods" ("id", "brotherhood_entity_id", "band_entity_id", "step_entity_id", "position", "outing_type", "date_from_text", "year_from", "is_current", "notes", "status", "public_brotherhood_name", "public_step_name", "public_brotherhood_slug", "public_municipality_name", "public_municipality_slug", "public_province")
values ('6e5c28b6-185b-4b0e-8e9a-6295ba8403e6', '57856427-ae39-4e6d-9153-ac2ce3e01dd8', '98c7b480-9917-439f-aea4-d26e474add78', '81a54e2c-fbde-447c-bd79-d460838b23dd', 'Tras el paso de la Divina Pastora', 'Procesión de Gloria', 'Vigente en 2026', 2026, true, 'Acompañamiento constatado en la procesión celebrada el 12 de septiembre de 2026; no presupone continuidad posterior.', 'published', 'Pastora de Padre Pío', 'Paso procesional de la Divina Pastora de las Almas', 'pastora-padre-pio', 'Sevilla', 'sevilla', 'Sevilla') on conflict ("id") do update set "brotherhood_entity_id" = excluded."brotherhood_entity_id", "band_entity_id" = excluded."band_entity_id", "step_entity_id" = excluded."step_entity_id", "position" = excluded."position", "outing_type" = excluded."outing_type", "date_from_text" = excluded."date_from_text", "year_from" = excluded."year_from", "is_current" = excluded."is_current", "notes" = excluded."notes", "status" = excluded."status", "public_brotherhood_name" = excluded."public_brotherhood_name", "public_step_name" = excluded."public_step_name", "public_brotherhood_slug" = excluded."public_brotherhood_slug", "public_municipality_name" = excluded."public_municipality_name", "public_municipality_slug" = excluded."public_municipality_slug", "public_province" = excluded."public_province";

insert into public."accompaniments" ("id", "outing_id", "band_entity_id", "step_entity_id", "position", "year", "notes", "status")
values ('2521d9cd-7f43-4e05-b3ef-90b0b9cb8438', 'c52f825e-bb8b-4ac4-9b22-fb8c98590e3d', '98c7b480-9917-439f-aea4-d26e474add78', '81a54e2c-fbde-447c-bd79-d460838b23dd', 'Tras el paso de la Divina Pastora', 2026, 'Acompañamiento musical de la procesión celebrada en 2026.', 'published') on conflict ("id") do update set "outing_id" = excluded."outing_id", "band_entity_id" = excluded."band_entity_id", "step_entity_id" = excluded."step_entity_id", "position" = excluded."position", "year" = excluded."year", "notes" = excluded."notes", "status" = excluded."status";

insert into public."source_links" ("id", "source_id", "music_accompaniment_period_id", "scope", "notes")
values ('deae793c-b0c7-44c3-8441-c88ebc25d95b', '69b2ed04-781c-4fa7-a5c9-10f0d4e47354', '6e5c28b6-185b-4b0e-8e9a-6295ba8403e6', 'Acompañamiento musical · 2026', null) on conflict ("id") do update set "source_id" = excluded."source_id", "music_accompaniment_period_id" = excluded."music_accompaniment_period_id", "scope" = excluded."scope", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "outing_id", "scope", "notes")
values ('ca1cbbad-c731-4aba-afdb-a2c30ff04b7f', '69b2ed04-781c-4fa7-a5c9-10f0d4e47354', 'c52f825e-bb8b-4ac4-9b22-fb8c98590e3d', 'Crónica de celebración · 2026', null) on conflict ("id") do update set "source_id" = excluded."source_id", "outing_id" = excluded."outing_id", "scope" = excluded."scope", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "entity_id", "scope", "notes")
values ('4c0a9186-97e3-4229-9cde-90d6790ca4cb', '9738ac94-dce0-4f3d-996d-ac65ccbd3205', 'c745bcac-65e8-47b6-8076-5caf040b382f', 'Historia, titular y paso', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "entity_id", "scope", "notes")
values ('1d14892a-b713-4f88-973e-ce9611d6d065', 'd63a9f14-27e8-45bc-b901-6f32c7a584de', '83c2ed5c-4f63-42da-89e8-8f8d9eb1f9e6', 'Historia, titular y paso', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "entity_id", "scope", "notes")
values ('68d8c9bb-48ec-4217-817c-5aab16f1ab41', '0f61c9a4-e827-4b5d-91a3-6c2f8e704bd1', 'a30dc45e-1614-4da8-a1dd-04c47f9cb5b2', 'Historia, titular, paso y cultos', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope", "notes" = excluded."notes";

insert into public."source_links" ("id", "source_id", "entity_id", "scope", "notes")
values ('85038c8c-870c-4d63-849f-310bd455de92', 'b7e8d2a1-0c4f-4d68-9a35-21e9c7f64b12', '57856427-ae39-4e6d-9153-ac2ce3e01dd8', 'Historia, sede y patrimonio', null) on conflict ("id") do update set "source_id" = excluded."source_id", "entity_id" = excluded."entity_id", "scope" = excluded."scope", "notes" = excluded."notes";

commit;
