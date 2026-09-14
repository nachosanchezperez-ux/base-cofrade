-- HC-016 · macrolote transversal: las seis Hermandades de la Madrugada de Sevilla
-- Receta editorial canónica para Apply gobernado. Solo DML: sin DDL, funciones, políticas ni índices.
-- Macarena y Gran Poder se preservan; El Silencio y El Calvario se crean; Esperanza de Triana y Los Gitanos se completan.
-- Lote aplicado: 96cc4393-fefa-4756-965b-8af1c0f59941 · completed · 262/262 · 257 insert · 5 update · 0 fallos.

begin;

insert into public.places (id, municipality_id, name, slug, place_type, address, notes)
values ('939c25f2-1c40-45ac-a827-ae8da2fb9e0d', 'ca85889c-21fe-4367-8477-a57656b25da4', 'Real Iglesia de San Antonio Abad', 'real-iglesia-san-antonio-abad-sevilla', 'Iglesia', 'Calle Alfonso XII, 3, 41001 Sevilla', 'Sede canónica de la Hermandad del Silencio.')
on conflict (id) do update set municipality_id = excluded.municipality_id, name = excluded.name, slug = excluded.slug, place_type = excluded.place_type, address = excluded.address, notes = excluded.notes;

insert into public.places (id, municipality_id, name, slug, place_type, address, notes)
values ('4f5f1f50-3555-4a47-a188-6ee57c481971', 'ca85889c-21fe-4367-8477-a57656b25da4', 'Capilla de los Marineros', 'capilla-marineros-sevilla', 'Capilla', 'Calle Pureza, 53, 41010 Sevilla', 'Sede canónica de la Hermandad de la Esperanza de Triana.')
on conflict (id) do update set municipality_id = excluded.municipality_id, name = excluded.name, slug = excluded.slug, place_type = excluded.place_type, address = excluded.address, notes = excluded.notes;

insert into public.places (id, municipality_id, name, slug, place_type, address, notes)
values ('2fa34697-c3d0-4f0e-a34b-e8776ba71a37', 'ca85889c-21fe-4367-8477-a57656b25da4', 'Santuario de Nuestro Padre Jesús de la Salud y María Santísima de las Angustias', 'santuario-gitanos-sevilla', 'Santuario', 'Plaza Señor de la Salud, 41003 Sevilla', 'Sede canónica de la Hermandad de Los Gitanos, en la antigua iglesia del Valle.')
on conflict (id) do update set municipality_id = excluded.municipality_id, name = excluded.name, slug = excluded.slug, place_type = excluded.place_type, address = excluded.address, notes = excluded.notes;

insert into public.sources (id, name, url, source_type, author_or_publisher, accessed_at, notes)
values ('007b2e35-4715-46cd-a6db-53dea6f697b5', 'Nuestra historia · Hermandad del Silencio', 'https://www.hermandaddeelsilencio.org/historia/', 'web', 'Hermandad del Silencio', '2026-09-14', 'Fundación, reglas y trayectoria histórica.')
on conflict (id) do update set name = excluded.name, url = excluded.url, source_type = excluded.source_type, author_or_publisher = excluded.author_or_publisher, accessed_at = excluded.accessed_at, notes = excluded.notes;

insert into public.sources (id, name, url, source_type, author_or_publisher, accessed_at, notes)
values ('f1671069-c731-4990-af62-dea47d0d24ef', 'Nuestro Padre Jesús Nazareno · Hermandad del Silencio', 'https://www.hermandaddeelsilencio.org/nuestro-padre-jesus-nazareno/', 'web', 'Hermandad del Silencio', '2026-09-14', 'Iconografía y descripción oficial del titular.')
on conflict (id) do update set name = excluded.name, url = excluded.url, source_type = excluded.source_type, author_or_publisher = excluded.author_or_publisher, accessed_at = excluded.accessed_at, notes = excluded.notes;

insert into public.sources (id, name, url, source_type, author_or_publisher, accessed_at, notes)
values ('d25fdea0-8a96-4f39-a800-62fc463ec53d', 'María Santísima de la Concepción · Hermandad del Silencio', 'https://www.hermandaddeelsilencio.org/maria-santisima-de-la-concepcion/', 'web', 'Hermandad del Silencio', '2026-09-14', 'Autoría, fecha e iconografía de la dolorosa.')
on conflict (id) do update set name = excluded.name, url = excluded.url, source_type = excluded.source_type, author_or_publisher = excluded.author_or_publisher, accessed_at = excluded.accessed_at, notes = excluded.notes;

insert into public.sources (id, name, url, source_type, author_or_publisher, accessed_at, notes)
values ('8bcf6e88-56bf-4f7c-ac66-eaaca10b4ca7', 'Santa Cruz en Jerusalén · Hermandad del Silencio', 'https://www.hermandaddeelsilencio.org/santa-cruz-en-jerusalen/', 'web', 'Hermandad del Silencio', '2026-09-14', 'Titular y patrimonio propio de la Archicofradía.')
on conflict (id) do update set name = excluded.name, url = excluded.url, source_type = excluded.source_type, author_or_publisher = excluded.author_or_publisher, accessed_at = excluded.accessed_at, notes = excluded.notes;

insert into public.sources (id, name, url, source_type, author_or_publisher, accessed_at, notes)
values ('cd607504-af50-45b9-a53b-514d42ffa82a', 'Sede canónica · Hermandad del Silencio', 'https://www.hermandaddeelsilencio.org/sede-canonica/', 'web', 'Hermandad del Silencio', '2026-09-14', 'Real Iglesia de San Antonio Abad y dirección oficial.')
on conflict (id) do update set name = excluded.name, url = excluded.url, source_type = excluded.source_type, author_or_publisher = excluded.author_or_publisher, accessed_at = excluded.accessed_at, notes = excluded.notes;

insert into public.sources (id, name, url, source_type, author_or_publisher, accessed_at, notes)
values ('694b8200-9a26-45ac-ae13-686e1869e228', 'Boletín Silencio 170 · febrero de 2026', 'https://www.hermandaddeelsilencio.org/wp-content/uploads/2026/02/SILENCIO-170-WEB-.pdf', 'web', 'Hermandad del Silencio', '2026-09-14', 'Cultos y estación de penitencia de 2026.')
on conflict (id) do update set name = excluded.name, url = excluded.url, source_type = excluded.source_type, author_or_publisher = excluded.author_or_publisher, accessed_at = excluded.accessed_at, notes = excluded.notes;

insert into public.sources (id, name, url, source_type, author_or_publisher, accessed_at, notes)
values ('d3ab4156-8e52-443a-a795-d1ef31e103ee', 'Historia · Hermandad del Calvario', 'https://hermandaddelcalvario.org/historia/', 'web', 'Hermandad del Calvario', '2026-09-14', 'Origen histórico y reorganización de la corporación.')
on conflict (id) do update set name = excluded.name, url = excluded.url, source_type = excluded.source_type, author_or_publisher = excluded.author_or_publisher, accessed_at = excluded.accessed_at, notes = excluded.notes;

insert into public.sources (id, name, url, source_type, author_or_publisher, accessed_at, notes)
values ('53736e10-1e16-4744-aea8-e0b68ade9114', 'Santísimo Cristo del Calvario', 'https://hermandaddelcalvario.org/sto-cristo-del-calvario/', 'web', 'Hermandad del Calvario', '2026-09-14', 'Autoría documentada, datación e historia material del crucificado.')
on conflict (id) do update set name = excluded.name, url = excluded.url, source_type = excluded.source_type, author_or_publisher = excluded.author_or_publisher, accessed_at = excluded.accessed_at, notes = excluded.notes;

insert into public.sources (id, name, url, source_type, author_or_publisher, accessed_at, notes)
values ('4e28fdd9-9544-479f-a1f5-9ca926daba23', 'Nuestra Señora de la Presentación', 'https://hermandaddelcalvario.org/ntra-sra-de-la-presentacion-2/', 'web', 'Hermandad del Calvario', '2026-09-14', 'Atribución, datación y restauración de la dolorosa.')
on conflict (id) do update set name = excluded.name, url = excluded.url, source_type = excluded.source_type, author_or_publisher = excluded.author_or_publisher, accessed_at = excluded.accessed_at, notes = excluded.notes;

insert into public.sources (id, name, url, source_type, author_or_publisher, accessed_at, notes)
values ('5cb79497-87e1-4705-a924-01736af27278', 'Paso del Santísimo Cristo del Calvario', 'https://hermandaddelcalvario.org/paso-stmo-cristo-del-calvario/', 'web', 'Hermandad del Calvario', '2026-09-14', 'Diseño, autores, materiales y primera salida del paso.')
on conflict (id) do update set name = excluded.name, url = excluded.url, source_type = excluded.source_type, author_or_publisher = excluded.author_or_publisher, accessed_at = excluded.accessed_at, notes = excluded.notes;

insert into public.sources (id, name, url, source_type, author_or_publisher, accessed_at, notes)
values ('156f939a-2584-40a0-a96b-14827f86abde', 'Paso de Nuestra Señora de la Presentación', 'https://hermandaddelcalvario.org/paso-ntra-sra-de-la-presentacion/', 'web', 'Hermandad del Calvario', '2026-09-14', 'Historia y autores del paso de palio.')
on conflict (id) do update set name = excluded.name, url = excluded.url, source_type = excluded.source_type, author_or_publisher = excluded.author_or_publisher, accessed_at = excluded.accessed_at, notes = excluded.notes;

insert into public.sources (id, name, url, source_type, author_or_publisher, accessed_at, notes)
values ('cd7c2e60-3709-4543-a472-25f942e91669', 'Cultos · Hermandad del Calvario', 'https://hermandaddelcalvario.org/quinario/', 'web', 'Hermandad del Calvario', '2026-09-14', 'Quinario, Función Principal y cultos internos.')
on conflict (id) do update set name = excluded.name, url = excluded.url, source_type = excluded.source_type, author_or_publisher = excluded.author_or_publisher, accessed_at = excluded.accessed_at, notes = excluded.notes;

insert into public.sources (id, name, url, source_type, author_or_publisher, accessed_at, notes)
values ('3b8256c9-2367-4967-ad84-d853002cdaca', 'Estación de Penitencia · Hermandad del Calvario', 'https://hermandaddelcalvario.org/estacion-de-penitencia/', 'web', 'Hermandad del Calvario', '2026-09-14', 'Estación de penitencia y estructura del cortejo.')
on conflict (id) do update set name = excluded.name, url = excluded.url, source_type = excluded.source_type, author_or_publisher = excluded.author_or_publisher, accessed_at = excluded.accessed_at, notes = excluded.notes;

insert into public.sources (id, name, url, source_type, author_or_publisher, accessed_at, notes)
values ('574b4549-be76-4892-ae8c-127ca70317c8', 'Identidad y sede · Hermandad del Calvario', 'https://hermandaddelcalvario.org/aviso-legal/', 'web', 'Hermandad del Calvario', '2026-09-14', 'Nombre oficial y sede canónica en la Real Parroquia de Santa María Magdalena.')
on conflict (id) do update set name = excluded.name, url = excluded.url, source_type = excluded.source_type, author_or_publisher = excluded.author_or_publisher, accessed_at = excluded.accessed_at, notes = excluded.notes;

insert into public.sources (id, name, url, source_type, author_or_publisher, accessed_at, notes)
values ('f006315d-634e-4fdf-a12e-3b8dddd1929a', 'Síntesis histórica · Esperanza de Triana', 'https://esperanzadetriana.es/sintesis-historica/', 'web', 'Hermandad Sacramental de la Esperanza de Triana', '2026-09-14', 'Historia corporativa, fusiones, sedes y acontecimientos principales.')
on conflict (id) do update set name = excluded.name, url = excluded.url, source_type = excluded.source_type, author_or_publisher = excluded.author_or_publisher, accessed_at = excluded.accessed_at, notes = excluded.notes;

insert into public.sources (id, name, url, source_type, author_or_publisher, accessed_at, notes)
values ('1c3f9b7b-3204-4080-abd4-8cd97c75de3a', 'Santísimo Cristo de las Tres Caídas', 'https://esperanzadetriana.es/stmo-cristo-de-las-tres-caidas/', 'web', 'Hermandad Sacramental de la Esperanza de Triana', '2026-09-14', 'Datación y atribución del titular.')
on conflict (id) do update set name = excluded.name, url = excluded.url, source_type = excluded.source_type, author_or_publisher = excluded.author_or_publisher, accessed_at = excluded.accessed_at, notes = excluded.notes;

insert into public.sources (id, name, url, source_type, author_or_publisher, accessed_at, notes)
values ('07c1b914-0deb-47b1-a050-0915c9fb6eb0', 'Nuestra Señora de la Esperanza', 'https://esperanzadetriana.es/ntra-sra-de-la-esperanza/', 'web', 'Hermandad Sacramental de la Esperanza de Triana', '2026-09-14', 'Descripción, datación y estado de atribución de la titular.')
on conflict (id) do update set name = excluded.name, url = excluded.url, source_type = excluded.source_type, author_or_publisher = excluded.author_or_publisher, accessed_at = excluded.accessed_at, notes = excluded.notes;

insert into public.sources (id, name, url, source_type, author_or_publisher, accessed_at, notes)
values ('819dc85e-8474-48f1-a672-36106d0ff005', 'Paso del Santísimo Cristo de las Tres Caídas', 'https://esperanzadetriana.es/paso-stmo-cristo-de-las-tres-caidas/', 'web', 'Hermandad Sacramental de la Esperanza de Triana', '2026-09-14', 'Historia material del paso de misterio.')
on conflict (id) do update set name = excluded.name, url = excluded.url, source_type = excluded.source_type, author_or_publisher = excluded.author_or_publisher, accessed_at = excluded.accessed_at, notes = excluded.notes;

insert into public.sources (id, name, url, source_type, author_or_publisher, accessed_at, notes)
values ('f9b73b7a-cd5b-407a-acf6-346de8a2dc6a', 'Paso de Nuestra Señora de la Esperanza', 'https://esperanzadetriana.es/7624-2/', 'web', 'Hermandad Sacramental de la Esperanza de Triana', '2026-09-14', 'Descripción e historia material del paso de palio.')
on conflict (id) do update set name = excluded.name, url = excluded.url, source_type = excluded.source_type, author_or_publisher = excluded.author_or_publisher, accessed_at = excluded.accessed_at, notes = excluded.notes;

insert into public.sources (id, name, url, source_type, author_or_publisher, accessed_at, notes)
values ('3f433ef3-dcff-4d17-a5b3-7f72e6f49570', 'Calendario de cultos 2026 · Esperanza de Triana', 'https://esperanzadetriana.es/calendario-de-cultos/', 'web', 'Hermandad Sacramental de la Esperanza de Triana', '2026-09-14', 'Cultos y estación de penitencia de 2026.')
on conflict (id) do update set name = excluded.name, url = excluded.url, source_type = excluded.source_type, author_or_publisher = excluded.author_or_publisher, accessed_at = excluded.accessed_at, notes = excluded.notes;

insert into public.sources (id, name, url, source_type, author_or_publisher, accessed_at, notes)
values ('2d6fb8f8-3b4b-4b6a-a6af-335f8ca86671', 'Web oficial · Esperanza de Triana', 'https://esperanzadetriana.es/', 'web', 'Hermandad Sacramental de la Esperanza de Triana', '2026-09-14', 'Identidad, sede y canales oficiales.')
on conflict (id) do update set name = excluded.name, url = excluded.url, source_type = excluded.source_type, author_or_publisher = excluded.author_or_publisher, accessed_at = excluded.accessed_at, notes = excluded.notes;

insert into public.sources (id, name, url, source_type, author_or_publisher, accessed_at, notes)
values ('0e32b8ab-8ea0-47bb-aff5-1608d5352ff0', 'Historia · Hermandad de Los Gitanos', 'https://www.hermandaddelosgitanos.com/historia/', 'web', 'Hermandad Sacramental de Los Gitanos', '2026-09-14', 'Reglas, sedes y trayectoria histórica.')
on conflict (id) do update set name = excluded.name, url = excluded.url, source_type = excluded.source_type, author_or_publisher = excluded.author_or_publisher, accessed_at = excluded.accessed_at, notes = excluded.notes;

insert into public.sources (id, name, url, source_type, author_or_publisher, accessed_at, notes)
values ('b4d87e45-873e-4623-a417-db1fc6d65256', 'Sede canónica · Hermandad de Los Gitanos', 'https://www.hermandaddelosgitanos.com/sede-canonica/', 'web', 'Hermandad Sacramental de Los Gitanos', '2026-09-14', 'Santuario, traslado de 1999 y localización.')
on conflict (id) do update set name = excluded.name, url = excluded.url, source_type = excluded.source_type, author_or_publisher = excluded.author_or_publisher, accessed_at = excluded.accessed_at, notes = excluded.notes;

insert into public.sources (id, name, url, source_type, author_or_publisher, accessed_at, notes)
values ('ff2532d8-42df-4e17-a4a0-e982f7aacdc6', 'Nuestro Padre Jesús de la Salud', 'https://www.hermandaddelosgitanos.com/ntro-padre-jesus-la-salud/', 'web', 'Hermandad Sacramental de Los Gitanos', '2026-09-14', 'Autoría, fecha y descripción del Nazareno.')
on conflict (id) do update set name = excluded.name, url = excluded.url, source_type = excluded.source_type, author_or_publisher = excluded.author_or_publisher, accessed_at = excluded.accessed_at, notes = excluded.notes;

insert into public.sources (id, name, url, source_type, author_or_publisher, accessed_at, notes)
values ('5f6f5f0c-7730-40ee-a161-797fd2cb3e28', 'María Santísima de las Angustias Coronada', 'https://www.hermandaddelosgitanos.com/maria-santisima-las-angustias-coronada/', 'web', 'Hermandad Sacramental de Los Gitanos', '2026-09-14', 'Autoría, fecha y descripción de la dolorosa.')
on conflict (id) do update set name = excluded.name, url = excluded.url, source_type = excluded.source_type, author_or_publisher = excluded.author_or_publisher, accessed_at = excluded.accessed_at, notes = excluded.notes;

insert into public.sources (id, name, url, source_type, author_or_publisher, accessed_at, notes)
values ('8fa0bedd-5c39-45ee-a73f-d76fb86d66fb', 'Paso de Cristo · Hermandad de Los Gitanos', 'https://www.hermandaddelosgitanos.com/paso-de-cristo/', 'web', 'Hermandad Sacramental de Los Gitanos', '2026-09-14', 'Autoría, datación y programa iconográfico del paso.')
on conflict (id) do update set name = excluded.name, url = excluded.url, source_type = excluded.source_type, author_or_publisher = excluded.author_or_publisher, accessed_at = excluded.accessed_at, notes = excluded.notes;

insert into public.sources (id, name, url, source_type, author_or_publisher, accessed_at, notes)
values ('b1979a73-ac64-4731-a868-9c76c901e434', 'Paso de palio · Hermandad de Los Gitanos', 'https://www.hermandaddelosgitanos.com/paso-de-palio/', 'web', 'Hermandad Sacramental de Los Gitanos', '2026-09-14', 'Bordados, diseño y orfebrería del paso de palio.')
on conflict (id) do update set name = excluded.name, url = excluded.url, source_type = excluded.source_type, author_or_publisher = excluded.author_or_publisher, accessed_at = excluded.accessed_at, notes = excluded.notes;

insert into public.sources (id, name, url, source_type, author_or_publisher, accessed_at, notes)
values ('32a71f06-e654-4374-a7de-86fd5f2f870b', 'Cultos · Hermandad de Los Gitanos', 'https://www.hermandaddelosgitanos.com/cultos/', 'web', 'Hermandad Sacramental de Los Gitanos', '2026-09-14', 'Cultos de reglas dedicados a los titulares y al Santísimo Sacramento.')
on conflict (id) do update set name = excluded.name, url = excluded.url, source_type = excluded.source_type, author_or_publisher = excluded.author_or_publisher, accessed_at = excluded.accessed_at, notes = excluded.notes;

insert into public.sources (id, name, url, source_type, author_or_publisher, accessed_at, notes)
values ('f7185187-4b02-42c7-a643-1c3dd3111218', 'Web oficial · Hermandad de Los Gitanos', 'https://www.hermandaddelosgitanos.com/', 'web', 'Hermandad Sacramental de Los Gitanos', '2026-09-14', 'Actividad vigente, contacto y canales oficiales en 2026.')
on conflict (id) do update set name = excluded.name, url = excluded.url, source_type = excluded.source_type, author_or_publisher = excluded.author_or_publisher, accessed_at = excluded.accessed_at, notes = excluded.notes;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('f94f1ab8-b8e9-4a94-ace4-a0b6c6c1c4e5', 'brotherhood', 'El Silencio', 'el-silencio-sevilla', 'Archicofradía de la Madrugada con sede en la Real Iglesia de San Antonio Abad; realiza su estación de penitencia en silencio.', 'published')
on conflict (id) do update set entity_type = excluded.entity_type, name = excluded.name, slug = excluded.slug, summary = excluded.summary, status = excluded.status;

insert into public.brotherhoods (entity_id, official_name, popular_name, foundation_text, municipality_id, canonical_see_place_id, neighborhood, website_url, brotherhood_types, current_procession_day, history_text, notes)
values ('f94f1ab8-b8e9-4a94-ace4-a0b6c6c1c4e5', 'Archicofradía Pontificia y Real de Nuestro Padre Jesús Nazareno, Santa Cruz en Jerusalén y María Santísima de la Concepción', 'El Silencio', 'Fundada en la Cuaresma de 1340; reglas aprobadas en 1356', 'ca85889c-21fe-4367-8477-a57656b25da4', '939c25f2-1c40-45ac-a827-ae8da2fb9e0d', 'Centro', 'https://www.hermandaddeelsilencio.org/', ARRAY['Penitencia']::text[], 'Madrugada', 'Fundada en Omnium Sanctorum durante la Cuaresma de 1340, obtuvo reglas en 1356. Desde 1579 está vinculada a su capilla de Jesús Nazareno en San Antonio Abad. Su estación de penitencia conserva el silencio como rasgo corporativo.', 'El silencio procesional es una característica documentada, no una ausencia de información musical. Escudo y multimedia quedan sin publicar por falta de licencia reutilizable.')
on conflict (entity_id) do update set official_name = excluded.official_name, popular_name = excluded.popular_name, foundation_text = excluded.foundation_text, municipality_id = excluded.municipality_id, canonical_see_place_id = excluded.canonical_see_place_id, neighborhood = excluded.neighborhood, website_url = excluded.website_url, brotherhood_types = excluded.brotherhood_types, current_procession_day = excluded.current_procession_day, history_text = excluded.history_text, notes = excluded.notes;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('9d1c58e3-161e-46ce-aa72-0123777902d3', 'image', 'Nuestro Padre Jesús Nazareno', 'nuestro-padre-jesus-nazareno-silencio-sevilla', 'Representa a Jesús aceptando y abrazando la Cruz antes de iniciar el camino hacia el Calvario.', 'published')
on conflict (id) do update set entity_type = excluded.entity_type, name = excluded.name, slug = excluded.slug, summary = excluded.summary, status = excluded.status;

insert into public.images (entity_id, current_condition, image_type, description, is_dress_image)
values ('9d1c58e3-161e-46ce-aa72-0123777902d3', 'extant', 'Nazareno', 'Representa a Jesús aceptando y abrazando la Cruz antes de iniciar el camino hacia el Calvario.', true)
on conflict (entity_id) do update set current_condition = excluded.current_condition, image_type = excluded.image_type, description = excluded.description, is_dress_image = excluded.is_dress_image;

insert into public.brotherhood_images (id, brotherhood_entity_id, image_entity_id, relation_type, notes, status)
values ('cc368e5f-565b-4eb0-a3ba-0a6b71ebf9bd', 'f94f1ab8-b8e9-4a94-ace4-a0b6c6c1c4e5', '9d1c58e3-161e-46ce-aa72-0123777902d3', 'titular', 'Titular vigente documentado por la Hermandad.', 'published')
on conflict (id) do update set brotherhood_entity_id = excluded.brotherhood_entity_id, image_entity_id = excluded.image_entity_id, relation_type = excluded.relation_type, notes = excluded.notes, status = excluded.status;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('2799e5bc-e9f0-4861-a116-6be6802dfd50', 'image', 'María Santísima de la Concepción', 'maria-santisima-concepcion-silencio-sevilla', 'Dolorosa tallada por Sebastián Santos Rojas en 1951; representa a la Virgen en la calle de la Amargura acompañada por San Juan Evangelista.', 'published')
on conflict (id) do update set entity_type = excluded.entity_type, name = excluded.name, slug = excluded.slug, summary = excluded.summary, status = excluded.status;

insert into public.images (entity_id, current_condition, image_type, execution_date_text, material, description, is_dress_image)
values ('2799e5bc-e9f0-4861-a116-6be6802dfd50', 'extant', 'Dolorosa de candelero', '1951', 'Madera de cedro', 'Dolorosa tallada por Sebastián Santos Rojas en 1951; representa a la Virgen en la calle de la Amargura acompañada por San Juan Evangelista.', true)
on conflict (entity_id) do update set current_condition = excluded.current_condition, image_type = excluded.image_type, execution_date_text = excluded.execution_date_text, material = excluded.material, description = excluded.description, is_dress_image = excluded.is_dress_image;

insert into public.brotherhood_images (id, brotherhood_entity_id, image_entity_id, relation_type, notes, status)
values ('ae4f0d51-18a0-4a64-ab9a-83f5deb74e63', 'f94f1ab8-b8e9-4a94-ace4-a0b6c6c1c4e5', '2799e5bc-e9f0-4861-a116-6be6802dfd50', 'titular', 'Titular vigente documentado por la Hermandad.', 'published')
on conflict (id) do update set brotherhood_entity_id = excluded.brotherhood_entity_id, image_entity_id = excluded.image_entity_id, relation_type = excluded.relation_type, notes = excluded.notes, status = excluded.status;

insert into public.image_authorships (id, image_entity_id, agent_entity_id, authorship_type, role_name, date_from_text, certainty, notes, status)
values ('47edcef8-a386-411d-a011-468df1931981', '2799e5bc-e9f0-4861-a116-6be6802dfd50', '13fb6b36-f879-41ef-ab19-90d97e693972', 'author', 'escultor', '1951', 'documented', 'Autoría documentada por la ficha oficial.', 'published')
on conflict (id) do update set image_entity_id = excluded.image_entity_id, agent_entity_id = excluded.agent_entity_id, authorship_type = excluded.authorship_type, role_name = excluded.role_name, date_from_text = excluded.date_from_text, certainty = excluded.certainty, notes = excluded.notes, status = excluded.status;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('755fecc2-b9f0-4d4b-ad45-c66584e195a3', 'step', 'Paso de Nuestro Padre Jesús Nazareno', 'paso-nuestro-padre-jesus-nazareno-silencio', 'Paso procesional de Nuestro Padre Jesús Nazareno en la estación de penitencia de la Madrugada.', 'published')
on conflict (id) do update set entity_type = excluded.entity_type, name = excluded.name, slug = excluded.slug, summary = excluded.summary, status = excluded.status;

insert into public.steps (entity_id, current_condition, step_type, description)
values ('755fecc2-b9f0-4d4b-ad45-c66584e195a3', 'preserved', 'Paso de Cristo', 'Paso procesional de Nuestro Padre Jesús Nazareno en la estación de penitencia de la Madrugada.')
on conflict (entity_id) do update set current_condition = excluded.current_condition, step_type = excluded.step_type, description = excluded.description;

insert into public.brotherhood_steps (id, brotherhood_entity_id, step_entity_id, relation_type, notes, status)
values ('85a783a7-12cb-4b29-af7f-436171999c28', 'f94f1ab8-b8e9-4a94-ace4-a0b6c6c1c4e5', '755fecc2-b9f0-4d4b-ad45-c66584e195a3', 'current', 'Paso procesional vigente.', 'published')
on conflict (id) do update set brotherhood_entity_id = excluded.brotherhood_entity_id, step_entity_id = excluded.step_entity_id, relation_type = excluded.relation_type, notes = excluded.notes, status = excluded.status;

insert into public.image_steps (id, image_entity_id, step_entity_id, relation_type, notes, status)
values ('57c697a5-5a4f-44a0-ac5c-06147117460c', '9d1c58e3-161e-46ce-aa72-0123777902d3', '755fecc2-b9f0-4d4b-ad45-c66584e195a3', 'processional', 'Imagen principal del paso.', 'published')
on conflict (id) do update set image_entity_id = excluded.image_entity_id, step_entity_id = excluded.step_entity_id, relation_type = excluded.relation_type, notes = excluded.notes, status = excluded.status;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('a410ee0d-37ef-4463-ab7c-b5912f8c2cf6', 'step', 'Paso de palio de María Santísima de la Concepción', 'paso-palio-concepcion-silencio', 'Paso de palio de María Santísima de la Concepción en la estación de penitencia de la Madrugada.', 'published')
on conflict (id) do update set entity_type = excluded.entity_type, name = excluded.name, slug = excluded.slug, summary = excluded.summary, status = excluded.status;

insert into public.steps (entity_id, current_condition, step_type, description)
values ('a410ee0d-37ef-4463-ab7c-b5912f8c2cf6', 'preserved', 'Paso de palio', 'Paso de palio de María Santísima de la Concepción en la estación de penitencia de la Madrugada.')
on conflict (entity_id) do update set current_condition = excluded.current_condition, step_type = excluded.step_type, description = excluded.description;

insert into public.brotherhood_steps (id, brotherhood_entity_id, step_entity_id, relation_type, notes, status)
values ('dccfb7e7-b414-460c-a70a-0e04763fa821', 'f94f1ab8-b8e9-4a94-ace4-a0b6c6c1c4e5', 'a410ee0d-37ef-4463-ab7c-b5912f8c2cf6', 'current', 'Paso procesional vigente.', 'published')
on conflict (id) do update set brotherhood_entity_id = excluded.brotherhood_entity_id, step_entity_id = excluded.step_entity_id, relation_type = excluded.relation_type, notes = excluded.notes, status = excluded.status;

insert into public.image_steps (id, image_entity_id, step_entity_id, relation_type, notes, status)
values ('deee29b1-093e-443b-a38a-218498a6e3b9', '2799e5bc-e9f0-4861-a116-6be6802dfd50', 'a410ee0d-37ef-4463-ab7c-b5912f8c2cf6', 'processional', 'Imagen principal del paso.', 'published')
on conflict (id) do update set image_entity_id = excluded.image_entity_id, step_entity_id = excluded.step_entity_id, relation_type = excluded.relation_type, notes = excluded.notes, status = excluded.status;

insert into public.cults (id, brotherhood_entity_id, image_entity_id, place_id, status, is_recurring, cult_type, title, month, date_rule, recurrence_label, display_order, description)
values ('928390e2-bee9-4034-a13e-400e4c8141a0', 'f94f1ab8-b8e9-4a94-ace4-a0b6c6c1c4e5', '9d1c58e3-161e-46ce-aa72-0123777902d3', '939c25f2-1c40-45ac-a827-ae8da2fb9e0d', 'published', true, 'Función Solemne', 'Solemne Función a Nuestro Padre Jesús Nazareno', 1, 'En torno al 27 de enero', 'Anual', 1, 'Función solemne anual al titular.')
on conflict (id) do update set brotherhood_entity_id = excluded.brotherhood_entity_id, image_entity_id = excluded.image_entity_id, place_id = excluded.place_id, status = excluded.status, is_recurring = excluded.is_recurring, cult_type = excluded.cult_type, title = excluded.title, month = excluded.month, date_rule = excluded.date_rule, recurrence_label = excluded.recurrence_label, display_order = excluded.display_order, description = excluded.description;

insert into public.cult_entities (id, cult_id, entity_id, role, notes)
values ('eaff2774-d3fc-4ee9-ad6c-c6a7dcd52c80', '928390e2-bee9-4034-a13e-400e4c8141a0', '9d1c58e3-161e-46ce-aa72-0123777902d3', 'honoree', 'Titular al que se dedica el culto.')
on conflict (id) do update set cult_id = excluded.cult_id, entity_id = excluded.entity_id, role = excluded.role, notes = excluded.notes;

insert into public.cults (id, brotherhood_entity_id, image_entity_id, place_id, status, is_recurring, cult_type, title, date_rule, recurrence_label, display_order, description)
values ('8493b0a0-e13c-45ed-a7f7-b785b69d1720', 'f94f1ab8-b8e9-4a94-ace4-a0b6c6c1c4e5', '9d1c58e3-161e-46ce-aa72-0123777902d3', '939c25f2-1c40-45ac-a827-ae8da2fb9e0d', 'published', true, 'Quinario', 'Solemne Quinario a Nuestro Padre Jesús Nazareno', 'Cuaresma', 'Anual', 2, 'Quinario cuaresmal al titular cristífero.')
on conflict (id) do update set brotherhood_entity_id = excluded.brotherhood_entity_id, image_entity_id = excluded.image_entity_id, place_id = excluded.place_id, status = excluded.status, is_recurring = excluded.is_recurring, cult_type = excluded.cult_type, title = excluded.title, date_rule = excluded.date_rule, recurrence_label = excluded.recurrence_label, display_order = excluded.display_order, description = excluded.description;

insert into public.cult_entities (id, cult_id, entity_id, role, notes)
values ('996e60ac-1e03-48b5-a1bc-19dec6d86fc1', '8493b0a0-e13c-45ed-a7f7-b785b69d1720', '9d1c58e3-161e-46ce-aa72-0123777902d3', 'honoree', 'Titular al que se dedica el culto.')
on conflict (id) do update set cult_id = excluded.cult_id, entity_id = excluded.entity_id, role = excluded.role, notes = excluded.notes;

insert into public.cults (id, brotherhood_entity_id, image_entity_id, place_id, status, is_recurring, cult_type, title, month, date_rule, recurrence_label, display_order, description)
values ('97a73835-cf41-49b2-a5cc-70fdd73ffaa1', 'f94f1ab8-b8e9-4a94-ace4-a0b6c6c1c4e5', '2799e5bc-e9f0-4861-a116-6be6802dfd50', '939c25f2-1c40-45ac-a827-ae8da2fb9e0d', 'published', true, 'Culto solemne', 'Cultos a María Santísima de la Concepción', 12, 'En torno a la Inmaculada Concepción', 'Anual', 3, 'Cultos anuales a la titular mariana.')
on conflict (id) do update set brotherhood_entity_id = excluded.brotherhood_entity_id, image_entity_id = excluded.image_entity_id, place_id = excluded.place_id, status = excluded.status, is_recurring = excluded.is_recurring, cult_type = excluded.cult_type, title = excluded.title, month = excluded.month, date_rule = excluded.date_rule, recurrence_label = excluded.recurrence_label, display_order = excluded.display_order, description = excluded.description;

insert into public.cult_entities (id, cult_id, entity_id, role, notes)
values ('b7940196-84d1-432c-a5c1-0d2756e3a0df', '97a73835-cf41-49b2-a5cc-70fdd73ffaa1', '2799e5bc-e9f0-4861-a116-6be6802dfd50', 'honoree', 'Titular al que se dedica el culto.')
on conflict (id) do update set cult_id = excluded.cult_id, entity_id = excluded.entity_id, role = excluded.role, notes = excluded.notes;

insert into public.outings (id, brotherhood_entity_id, outing_type, character, title, outing_date, year, municipality_id, origin_place_id, destination_text, description, event_status, status, slug)
values ('ab9ae46c-438d-4c47-ac9e-c65aab075ab0', 'f94f1ab8-b8e9-4a94-ace4-a0b6c6c1c4e5', 'Estación de Penitencia', 'ordinary', 'El Silencio · Estación de Penitencia 2026', '2026-04-03', 2026, 'ca85889c-21fe-4367-8477-a57656b25da4', '939c25f2-1c40-45ac-a827-ae8da2fb9e0d', 'Santa Iglesia Catedral de Sevilla', 'Estación de Penitencia de la Madrugada del Viernes Santo de 2026.', 'held', 'published', 'silencio-estacion-penitencia-2026')
on conflict (id) do update set brotherhood_entity_id = excluded.brotherhood_entity_id, outing_type = excluded.outing_type, character = excluded.character, title = excluded.title, outing_date = excluded.outing_date, year = excluded.year, municipality_id = excluded.municipality_id, origin_place_id = excluded.origin_place_id, destination_text = excluded.destination_text, description = excluded.description, event_status = excluded.event_status, status = excluded.status, slug = excluded.slug;

insert into public.outing_entities (id, outing_id, entity_id, role, notes)
values ('de937559-24a5-4358-adef-bebf65a304b7', 'ab9ae46c-438d-4c47-ac9e-c65aab075ab0', '9d1c58e3-161e-46ce-aa72-0123777902d3', 'processional_image', 'Titular participante en la estación de penitencia.')
on conflict (id) do update set outing_id = excluded.outing_id, entity_id = excluded.entity_id, role = excluded.role, notes = excluded.notes;

insert into public.outing_entities (id, outing_id, entity_id, role, notes)
values ('f579e109-ba8a-4566-aee7-d8c902514b0d', 'ab9ae46c-438d-4c47-ac9e-c65aab075ab0', '2799e5bc-e9f0-4861-a116-6be6802dfd50', 'processional_image', 'Titular participante en la estación de penitencia.')
on conflict (id) do update set outing_id = excluded.outing_id, entity_id = excluded.entity_id, role = excluded.role, notes = excluded.notes;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('6b7c71bb-46f9-42ce-a548-817a3b7fdde5', 'event', 'Fundación de la primitiva hermandad de nazarenos', 'fundacion-silencio-1340', 'La corporación sitúa su fundación en Omnium Sanctorum durante la Cuaresma de 1340.', 'published')
on conflict (id) do update set entity_type = excluded.entity_type, name = excluded.name, slug = excluded.slug, summary = excluded.summary, status = excluded.status;

insert into public.events (entity_id, event_type, event_date_text, place_id, description, event_category, brotherhood_entity_id, municipality_id, event_status)
values ('6b7c71bb-46f9-42ce-a548-817a3b7fdde5', 'Hito histórico', 'Cuaresma de 1340', null, 'La corporación sitúa su fundación en Omnium Sanctorum durante la Cuaresma de 1340.', 'historical', 'f94f1ab8-b8e9-4a94-ace4-a0b6c6c1c4e5', 'ca85889c-21fe-4367-8477-a57656b25da4', 'held')
on conflict (entity_id) do update set event_type = excluded.event_type, event_date_text = excluded.event_date_text, place_id = excluded.place_id, description = excluded.description, event_category = excluded.event_category, brotherhood_entity_id = excluded.brotherhood_entity_id, municipality_id = excluded.municipality_id, event_status = excluded.event_status;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('c4139f5e-1d27-44c3-ab93-ad03756f296d', 'event', 'Aprobación de las primeras reglas', 'reglas-silencio-1356', 'El arzobispo Nuño de Fuentes aprobó sus reglas en 1356.', 'published')
on conflict (id) do update set entity_type = excluded.entity_type, name = excluded.name, slug = excluded.slug, summary = excluded.summary, status = excluded.status;

insert into public.events (entity_id, event_type, event_date_text, place_id, description, event_category, brotherhood_entity_id, municipality_id, event_status)
values ('c4139f5e-1d27-44c3-ab93-ad03756f296d', 'Hito histórico', '1356', null, 'El arzobispo Nuño de Fuentes aprobó sus reglas en 1356.', 'historical', 'f94f1ab8-b8e9-4a94-ace4-a0b6c6c1c4e5', 'ca85889c-21fe-4367-8477-a57656b25da4', 'held')
on conflict (entity_id) do update set event_type = excluded.event_type, event_date_text = excluded.event_date_text, place_id = excluded.place_id, description = excluded.description, event_category = excluded.event_category, brotherhood_entity_id = excluded.brotherhood_entity_id, municipality_id = excluded.municipality_id, event_status = excluded.event_status;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('bfddd1bb-696f-43c0-a762-518b42231650', 'event', 'Establecimiento en la capilla de Jesús Nazareno', 'capilla-silencio-1579', 'La Archicofradía quedó establecida en su capilla propia de Jesús Nazareno.', 'published')
on conflict (id) do update set entity_type = excluded.entity_type, name = excluded.name, slug = excluded.slug, summary = excluded.summary, status = excluded.status;

insert into public.events (entity_id, event_type, event_date_text, place_id, description, event_category, brotherhood_entity_id, municipality_id, event_status)
values ('bfddd1bb-696f-43c0-a762-518b42231650', 'Hito histórico', '1579', '939c25f2-1c40-45ac-a827-ae8da2fb9e0d', 'La Archicofradía quedó establecida en su capilla propia de Jesús Nazareno.', 'historical', 'f94f1ab8-b8e9-4a94-ace4-a0b6c6c1c4e5', 'ca85889c-21fe-4367-8477-a57656b25da4', 'held')
on conflict (entity_id) do update set event_type = excluded.event_type, event_date_text = excluded.event_date_text, place_id = excluded.place_id, description = excluded.description, event_category = excluded.event_category, brotherhood_entity_id = excluded.brotherhood_entity_id, municipality_id = excluded.municipality_id, event_status = excluded.event_status;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('5e17de35-b32a-429a-a348-850a6794cb93', 'heritage_asset', 'Santa Cruz en Jerusalén', 'santa-cruz-jerusalen-silencio', 'Titular y elemento patrimonial propio de la Archicofradía del Silencio.', 'published')
on conflict (id) do update set entity_type = excluded.entity_type, name = excluded.name, slug = excluded.slug, summary = excluded.summary, status = excluded.status;

insert into public.heritage_assets (entity_id, parent_entity_id, asset_type, description, current_condition, is_current, display_order, is_featured)
values ('5e17de35-b32a-429a-a348-850a6794cb93', 'f94f1ab8-b8e9-4a94-ace4-a0b6c6c1c4e5', 'Cruz titular', 'Santa Cruz en Jerusalén, titular de la Archicofradía.', 'Conservada', true, 1, true)
on conflict (entity_id) do update set parent_entity_id = excluded.parent_entity_id, asset_type = excluded.asset_type, description = excluded.description, current_condition = excluded.current_condition, is_current = excluded.is_current, display_order = excluded.display_order, is_featured = excluded.is_featured;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('6c50dc05-e054-4316-a046-900451467952', 'brotherhood', 'El Calvario', 'el-calvario-sevilla', 'Hermandad de la Madrugada con sede en la Real Parroquia de Santa María Magdalena y dos pasos de carácter sobrio.', 'published')
on conflict (id) do update set entity_type = excluded.entity_type, name = excluded.name, slug = excluded.slug, summary = excluded.summary, status = excluded.status;

insert into public.brotherhoods (entity_id, official_name, popular_name, foundation_text, municipality_id, canonical_see_place_id, neighborhood, website_url, brotherhood_types, current_procession_day, history_text, notes)
values ('6c50dc05-e054-4316-a046-900451467952', 'Pontificia y Real Hermandad y Cofradía de Nazarenos del Santísimo Cristo del Calvario y Nuestra Señora de la Presentación', 'El Calvario', 'Antecedente fundacional en 1571; reorganizada en el siglo XIX', 'ca85889c-21fe-4367-8477-a57656b25da4', '8ede17e4-36d1-4594-abb8-170a2caac793', 'Centro', 'https://hermandaddelcalvario.org/', ARRAY['Penitencia']::text[], 'Madrugada', 'Tiene su antecedente en la Hermandad de la Presentación de Nuestra Señora, fundada en 1571 por la comunidad mulata de Sevilla. La corporación actual fue reorganizada en el siglo XIX y mantiene su sede canónica en la Real Parroquia de Santa María Magdalena.', 'La estación de penitencia se desarrolla sin acompañamiento musical. Escudo y multimedia quedan sin publicar por falta de licencia reutilizable.')
on conflict (entity_id) do update set official_name = excluded.official_name, popular_name = excluded.popular_name, foundation_text = excluded.foundation_text, municipality_id = excluded.municipality_id, canonical_see_place_id = excluded.canonical_see_place_id, neighborhood = excluded.neighborhood, website_url = excluded.website_url, brotherhood_types = excluded.brotherhood_types, current_procession_day = excluded.current_procession_day, history_text = excluded.history_text, notes = excluded.notes;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('df840bed-6867-4d25-af22-e4ae259d1b6a', 'image', 'Santísimo Cristo del Calvario', 'santisimo-cristo-calvario-sevilla', 'Crucificado manierista documentado como obra de Francisco de Ocampo entre 1611 y 1612.', 'published')
on conflict (id) do update set entity_type = excluded.entity_type, name = excluded.name, slug = excluded.slug, summary = excluded.summary, status = excluded.status;

insert into public.images (entity_id, current_condition, image_type, execution_date_text, description, is_dress_image)
values ('df840bed-6867-4d25-af22-e4ae259d1b6a', 'extant', 'Crucificado', '1611–1612', 'Crucificado manierista documentado como obra de Francisco de Ocampo entre 1611 y 1612.', false)
on conflict (entity_id) do update set current_condition = excluded.current_condition, image_type = excluded.image_type, execution_date_text = excluded.execution_date_text, description = excluded.description, is_dress_image = excluded.is_dress_image;

insert into public.brotherhood_images (id, brotherhood_entity_id, image_entity_id, relation_type, notes, status)
values ('132e65a4-c4ed-42b6-ac06-60bf356685ff', '6c50dc05-e054-4316-a046-900451467952', 'df840bed-6867-4d25-af22-e4ae259d1b6a', 'titular', 'Titular vigente documentado por la Hermandad.', 'published')
on conflict (id) do update set brotherhood_entity_id = excluded.brotherhood_entity_id, image_entity_id = excluded.image_entity_id, relation_type = excluded.relation_type, notes = excluded.notes, status = excluded.status;

insert into public.image_authorships (id, image_entity_id, agent_entity_id, authorship_type, role_name, date_from_text, certainty, notes, status)
values ('aa23d22b-991c-440d-adc4-4dfe20853141', 'df840bed-6867-4d25-af22-e4ae259d1b6a', '111d783e-16c0-4571-9c1c-93eaee474e87', 'author', 'escultor', '1611–1612', 'documented', 'Autoría acreditada por el documento hallado durante la restauración de 1940.', 'published')
on conflict (id) do update set image_entity_id = excluded.image_entity_id, agent_entity_id = excluded.agent_entity_id, authorship_type = excluded.authorship_type, role_name = excluded.role_name, date_from_text = excluded.date_from_text, certainty = excluded.certainty, notes = excluded.notes, status = excluded.status;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('902fbffe-9bae-4b0c-a7ab-fa9965c83286', 'image', 'Nuestra Señora de la Presentación', 'nuestra-senora-presentacion-calvario-sevilla', 'Dolorosa de candelero atribuida a Juan de Astorga y fechada por criterios estilísticos entre 1834 y 1839.', 'published')
on conflict (id) do update set entity_type = excluded.entity_type, name = excluded.name, slug = excluded.slug, summary = excluded.summary, status = excluded.status;

insert into public.images (entity_id, current_condition, image_type, execution_date_text, description, is_dress_image)
values ('902fbffe-9bae-4b0c-a7ab-fa9965c83286', 'extant', 'Dolorosa de candelero', '1834–1839, atribución estilística', 'Dolorosa de candelero atribuida a Juan de Astorga y fechada por criterios estilísticos entre 1834 y 1839.', true)
on conflict (entity_id) do update set current_condition = excluded.current_condition, image_type = excluded.image_type, execution_date_text = excluded.execution_date_text, description = excluded.description, is_dress_image = excluded.is_dress_image;

insert into public.brotherhood_images (id, brotherhood_entity_id, image_entity_id, relation_type, notes, status)
values ('f4d4952a-7eff-4b96-a00e-5054b2e4e38a', '6c50dc05-e054-4316-a046-900451467952', '902fbffe-9bae-4b0c-a7ab-fa9965c83286', 'titular', 'Titular vigente documentado por la Hermandad.', 'published')
on conflict (id) do update set brotherhood_entity_id = excluded.brotherhood_entity_id, image_entity_id = excluded.image_entity_id, relation_type = excluded.relation_type, notes = excluded.notes, status = excluded.status;

insert into public.image_authorships (id, image_entity_id, agent_entity_id, authorship_type, role_name, date_from_text, certainty, notes, status)
values ('a8d11270-4478-48a4-a459-3792b697b57b', '902fbffe-9bae-4b0c-a7ab-fa9965c83286', 'a5264497-9e32-49ab-9773-130fe8ae7a76', 'attributed_to', 'escultor', '1834–1839', 'attributed', 'Atribución estilística, no autoría documental.', 'published')
on conflict (id) do update set image_entity_id = excluded.image_entity_id, agent_entity_id = excluded.agent_entity_id, authorship_type = excluded.authorship_type, role_name = excluded.role_name, date_from_text = excluded.date_from_text, certainty = excluded.certainty, notes = excluded.notes, status = excluded.status;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('40be5e18-ef23-4ebf-a50e-e3f56a2db46b', 'step', 'Paso del Santísimo Cristo del Calvario', 'paso-santisimo-cristo-calvario', 'Diseñado por Francisco Farfán Ramos, tallado en caoba por Salvador Domínguez Gordillo y estrenado en 1909.', 'published')
on conflict (id) do update set entity_type = excluded.entity_type, name = excluded.name, slug = excluded.slug, summary = excluded.summary, status = excluded.status;

insert into public.steps (entity_id, current_condition, step_type, execution_date_text, materials, style, description)
values ('40be5e18-ef23-4ebf-a50e-e3f56a2db46b', 'preserved', 'Paso de Cristo', '1909', 'Madera de caoba y plata oxidada', 'Renacimiento', 'Diseñado por Francisco Farfán Ramos, tallado en caoba por Salvador Domínguez Gordillo y estrenado en 1909.')
on conflict (entity_id) do update set current_condition = excluded.current_condition, step_type = excluded.step_type, execution_date_text = excluded.execution_date_text, materials = excluded.materials, style = excluded.style, description = excluded.description;

insert into public.brotherhood_steps (id, brotherhood_entity_id, step_entity_id, relation_type, notes, status)
values ('f42dc5ca-bbe7-4c5e-a106-1f0f4ef8b108', '6c50dc05-e054-4316-a046-900451467952', '40be5e18-ef23-4ebf-a50e-e3f56a2db46b', 'current', 'Paso procesional vigente.', 'published')
on conflict (id) do update set brotherhood_entity_id = excluded.brotherhood_entity_id, step_entity_id = excluded.step_entity_id, relation_type = excluded.relation_type, notes = excluded.notes, status = excluded.status;

insert into public.image_steps (id, image_entity_id, step_entity_id, relation_type, notes, status)
values ('35051649-3ba9-42e4-a438-6e77a73590cb', 'df840bed-6867-4d25-af22-e4ae259d1b6a', '40be5e18-ef23-4ebf-a50e-e3f56a2db46b', 'processional', 'Imagen principal del paso.', 'published')
on conflict (id) do update set image_entity_id = excluded.image_entity_id, step_entity_id = excluded.step_entity_id, relation_type = excluded.relation_type, notes = excluded.notes, status = excluded.status;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('9074c19c-0a89-4d37-a720-9a819b479f96', 'step', 'Paso de palio de Nuestra Señora de la Presentación', 'paso-palio-presentacion-calvario', 'Palio de cajón estrenado en 1916, con diseño y bordados de Juan Manuel Rodríguez Ojeda y posteriores restauraciones y ampliaciones.', 'published')
on conflict (id) do update set entity_type = excluded.entity_type, name = excluded.name, slug = excluded.slug, summary = excluded.summary, status = excluded.status;

insert into public.steps (entity_id, current_condition, step_type, execution_date_text, materials, description)
values ('9074c19c-0a89-4d37-a720-9a819b479f96', 'preserved', 'Paso de palio', '1916 y ampliaciones posteriores', 'Bordados en oro, terciopelo y orfebrería', 'Palio de cajón estrenado en 1916, con diseño y bordados de Juan Manuel Rodríguez Ojeda y posteriores restauraciones y ampliaciones.')
on conflict (entity_id) do update set current_condition = excluded.current_condition, step_type = excluded.step_type, execution_date_text = excluded.execution_date_text, materials = excluded.materials, description = excluded.description;

insert into public.brotherhood_steps (id, brotherhood_entity_id, step_entity_id, relation_type, notes, status)
values ('bb229a79-51d2-4525-a46a-15911d36ca94', '6c50dc05-e054-4316-a046-900451467952', '9074c19c-0a89-4d37-a720-9a819b479f96', 'current', 'Paso procesional vigente.', 'published')
on conflict (id) do update set brotherhood_entity_id = excluded.brotherhood_entity_id, step_entity_id = excluded.step_entity_id, relation_type = excluded.relation_type, notes = excluded.notes, status = excluded.status;

insert into public.image_steps (id, image_entity_id, step_entity_id, relation_type, notes, status)
values ('b0e8eb47-7959-4d8b-ad72-eb808e182c52', '902fbffe-9bae-4b0c-a7ab-fa9965c83286', '9074c19c-0a89-4d37-a720-9a819b479f96', 'processional', 'Imagen principal del paso.', 'published')
on conflict (id) do update set image_entity_id = excluded.image_entity_id, step_entity_id = excluded.step_entity_id, relation_type = excluded.relation_type, notes = excluded.notes, status = excluded.status;

insert into public.cults (id, brotherhood_entity_id, image_entity_id, place_id, status, is_recurring, cult_type, title, date_rule, recurrence_label, display_order, description)
values ('2f130e9f-84cf-4595-a6a7-582448b14c51', '6c50dc05-e054-4316-a046-900451467952', 'df840bed-6867-4d25-af22-e4ae259d1b6a', '8ede17e4-36d1-4594-abb8-170a2caac793', 'published', true, 'Quinario', 'Solemne Quinario al Santísimo Cristo del Calvario', 'Cuaresma, coincidiendo con el Jubileo Circular de las Cuarenta Horas', 'Anual', 1, 'Quinario culminado con procesión claustral y renovación de la consagración al Sagrado Corazón.')
on conflict (id) do update set brotherhood_entity_id = excluded.brotherhood_entity_id, image_entity_id = excluded.image_entity_id, place_id = excluded.place_id, status = excluded.status, is_recurring = excluded.is_recurring, cult_type = excluded.cult_type, title = excluded.title, date_rule = excluded.date_rule, recurrence_label = excluded.recurrence_label, display_order = excluded.display_order, description = excluded.description;

insert into public.cult_entities (id, cult_id, entity_id, role, notes)
values ('6c434b52-f246-4a1a-aebc-bec9c634be03', '2f130e9f-84cf-4595-a6a7-582448b14c51', 'df840bed-6867-4d25-af22-e4ae259d1b6a', 'honoree', 'Titular al que se dedica el culto.')
on conflict (id) do update set cult_id = excluded.cult_id, entity_id = excluded.entity_id, role = excluded.role, notes = excluded.notes;

insert into public.cults (id, brotherhood_entity_id, image_entity_id, place_id, status, is_recurring, cult_type, title, date_rule, recurrence_label, display_order, description)
values ('05815751-9c2d-4aae-a472-aae7ccc5ba50', '6c50dc05-e054-4316-a046-900451467952', 'df840bed-6867-4d25-af22-e4ae259d1b6a', '8ede17e4-36d1-4594-abb8-170a2caac793', 'published', true, 'Función Principal', 'Función Principal de Instituto', 'Al finalizar el Quinario', 'Anual', 2, 'Principal culto anual con pública Protestación de Fe.')
on conflict (id) do update set brotherhood_entity_id = excluded.brotherhood_entity_id, image_entity_id = excluded.image_entity_id, place_id = excluded.place_id, status = excluded.status, is_recurring = excluded.is_recurring, cult_type = excluded.cult_type, title = excluded.title, date_rule = excluded.date_rule, recurrence_label = excluded.recurrence_label, display_order = excluded.display_order, description = excluded.description;

insert into public.cult_entities (id, cult_id, entity_id, role, notes)
values ('cafe51b2-bda8-464b-aef1-2028c30c7f37', '05815751-9c2d-4aae-a472-aae7ccc5ba50', 'df840bed-6867-4d25-af22-e4ae259d1b6a', 'honoree', 'Titular al que se dedica el culto.')
on conflict (id) do update set cult_id = excluded.cult_id, entity_id = excluded.entity_id, role = excluded.role, notes = excluded.notes;

insert into public.cults (id, brotherhood_entity_id, image_entity_id, place_id, status, is_recurring, cult_type, title, date_rule, time_text, recurrence_label, display_order, description)
values ('d30cabd4-e74c-45eb-a097-b23374ed1b61', '6c50dc05-e054-4316-a046-900451467952', 'df840bed-6867-4d25-af22-e4ae259d1b6a', '8ede17e4-36d1-4594-abb8-170a2caac793', 'published', true, 'Misa de Hermandad', 'Viernes del Calvario', 'Viernes del curso, de septiembre a junio, salvo excepciones', '20:15', 'Semanal durante el curso', 3, 'Misa de Hermandad celebrada en la capilla corporativa.')
on conflict (id) do update set brotherhood_entity_id = excluded.brotherhood_entity_id, image_entity_id = excluded.image_entity_id, place_id = excluded.place_id, status = excluded.status, is_recurring = excluded.is_recurring, cult_type = excluded.cult_type, title = excluded.title, date_rule = excluded.date_rule, time_text = excluded.time_text, recurrence_label = excluded.recurrence_label, display_order = excluded.display_order, description = excluded.description;

insert into public.cult_entities (id, cult_id, entity_id, role, notes)
values ('71bf2bd4-6ce4-47a0-ac94-5ac3073ac52b', 'd30cabd4-e74c-45eb-a097-b23374ed1b61', 'df840bed-6867-4d25-af22-e4ae259d1b6a', 'honoree', 'Titular al que se dedica el culto.')
on conflict (id) do update set cult_id = excluded.cult_id, entity_id = excluded.entity_id, role = excluded.role, notes = excluded.notes;

insert into public.cults (id, brotherhood_entity_id, image_entity_id, place_id, status, is_recurring, cult_type, title, month, date_rule, recurrence_label, display_order, description)
values ('11460593-40f1-4518-a55f-0baf96bdb609', '6c50dc05-e054-4316-a046-900451467952', '902fbffe-9bae-4b0c-a7ab-fa9965c83286', '8ede17e4-36d1-4594-abb8-170a2caac793', 'published', true, 'Triduo', 'Solemne Triduo a Nuestra Señora de la Presentación', 11, 'Noviembre', 'Anual', 4, 'Triduo anual dedicado a la titular mariana.')
on conflict (id) do update set brotherhood_entity_id = excluded.brotherhood_entity_id, image_entity_id = excluded.image_entity_id, place_id = excluded.place_id, status = excluded.status, is_recurring = excluded.is_recurring, cult_type = excluded.cult_type, title = excluded.title, month = excluded.month, date_rule = excluded.date_rule, recurrence_label = excluded.recurrence_label, display_order = excluded.display_order, description = excluded.description;

insert into public.cult_entities (id, cult_id, entity_id, role, notes)
values ('165b7eb6-f9f1-4dc7-a819-ce32ff45c76b', '11460593-40f1-4518-a55f-0baf96bdb609', '902fbffe-9bae-4b0c-a7ab-fa9965c83286', 'honoree', 'Titular al que se dedica el culto.')
on conflict (id) do update set cult_id = excluded.cult_id, entity_id = excluded.entity_id, role = excluded.role, notes = excluded.notes;

insert into public.outings (id, brotherhood_entity_id, outing_type, character, title, outing_date, year, municipality_id, origin_place_id, destination_text, description, event_status, status, slug)
values ('9d72eeca-b994-4d49-a4e9-0579f01910dd', '6c50dc05-e054-4316-a046-900451467952', 'Estación de Penitencia', 'ordinary', 'El Calvario · Estación de Penitencia 2026', '2026-04-03', 2026, 'ca85889c-21fe-4367-8477-a57656b25da4', '8ede17e4-36d1-4594-abb8-170a2caac793', 'Santa Iglesia Catedral de Sevilla', 'Estación de Penitencia de la Madrugada del Viernes Santo de 2026.', 'held', 'published', 'calvario-estacion-penitencia-2026')
on conflict (id) do update set brotherhood_entity_id = excluded.brotherhood_entity_id, outing_type = excluded.outing_type, character = excluded.character, title = excluded.title, outing_date = excluded.outing_date, year = excluded.year, municipality_id = excluded.municipality_id, origin_place_id = excluded.origin_place_id, destination_text = excluded.destination_text, description = excluded.description, event_status = excluded.event_status, status = excluded.status, slug = excluded.slug;

insert into public.outing_entities (id, outing_id, entity_id, role, notes)
values ('8d0f6e2a-113b-4595-a730-94b2a66d496d', '9d72eeca-b994-4d49-a4e9-0579f01910dd', 'df840bed-6867-4d25-af22-e4ae259d1b6a', 'processional_image', 'Titular participante en la estación de penitencia.')
on conflict (id) do update set outing_id = excluded.outing_id, entity_id = excluded.entity_id, role = excluded.role, notes = excluded.notes;

insert into public.outing_entities (id, outing_id, entity_id, role, notes)
values ('af58ddf2-114d-4f6f-af03-8941045d4ede', '9d72eeca-b994-4d49-a4e9-0579f01910dd', '902fbffe-9bae-4b0c-a7ab-fa9965c83286', 'processional_image', 'Titular participante en la estación de penitencia.')
on conflict (id) do update set outing_id = excluded.outing_id, entity_id = excluded.entity_id, role = excluded.role, notes = excluded.notes;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('671fac16-bafb-49d3-a445-2c799d834bce', 'event', 'Fundación de la Hermandad de la Presentación', 'fundacion-presentacion-1571', 'La Hermandad de la Presentación de Nuestra Señora fue fundada en el Hospital de Nuestra Señora de Belén.', 'published')
on conflict (id) do update set entity_type = excluded.entity_type, name = excluded.name, slug = excluded.slug, summary = excluded.summary, status = excluded.status;

insert into public.events (entity_id, event_type, event_date_text, place_id, description, event_category, brotherhood_entity_id, municipality_id, event_status)
values ('671fac16-bafb-49d3-a445-2c799d834bce', 'Hito histórico', '1571', null, 'La Hermandad de la Presentación de Nuestra Señora fue fundada en el Hospital de Nuestra Señora de Belén.', 'historical', '6c50dc05-e054-4316-a046-900451467952', 'ca85889c-21fe-4367-8477-a57656b25da4', 'held')
on conflict (entity_id) do update set event_type = excluded.event_type, event_date_text = excluded.event_date_text, place_id = excluded.place_id, description = excluded.description, event_category = excluded.event_category, brotherhood_entity_id = excluded.brotherhood_entity_id, municipality_id = excluded.municipality_id, event_status = excluded.event_status;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('29e57678-0146-472a-a6e9-55f10438bb68', 'event', 'Reorganización de la Hermandad del Calvario', 'reorganizacion-calvario-1888', 'La corporación fue reorganizada en el siglo XIX con la iconografía del Calvario.', 'published')
on conflict (id) do update set entity_type = excluded.entity_type, name = excluded.name, slug = excluded.slug, summary = excluded.summary, status = excluded.status;

insert into public.events (entity_id, event_type, event_date_text, place_id, description, event_category, brotherhood_entity_id, municipality_id, event_status)
values ('29e57678-0146-472a-a6e9-55f10438bb68', 'Hito histórico', '1888', null, 'La corporación fue reorganizada en el siglo XIX con la iconografía del Calvario.', 'historical', '6c50dc05-e054-4316-a046-900451467952', 'ca85889c-21fe-4367-8477-a57656b25da4', 'held')
on conflict (entity_id) do update set event_type = excluded.event_type, event_date_text = excluded.event_date_text, place_id = excluded.place_id, description = excluded.description, event_category = excluded.event_category, brotherhood_entity_id = excluded.brotherhood_entity_id, municipality_id = excluded.municipality_id, event_status = excluded.event_status;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('ff561b4a-f828-4285-a58a-eb086b8989f2', 'event', 'Primera salida del paso del Cristo', 'estreno-paso-calvario-1909', 'El actual paso del Santísimo Cristo del Calvario efectuó su primera salida procesional.', 'published')
on conflict (id) do update set entity_type = excluded.entity_type, name = excluded.name, slug = excluded.slug, summary = excluded.summary, status = excluded.status;

insert into public.events (entity_id, event_type, event_date_text, place_id, description, event_category, brotherhood_entity_id, municipality_id, event_status)
values ('ff561b4a-f828-4285-a58a-eb086b8989f2', 'Hito histórico', '1909', null, 'El actual paso del Santísimo Cristo del Calvario efectuó su primera salida procesional.', 'historical', '6c50dc05-e054-4316-a046-900451467952', 'ca85889c-21fe-4367-8477-a57656b25da4', 'held')
on conflict (entity_id) do update set event_type = excluded.event_type, event_date_text = excluded.event_date_text, place_id = excluded.place_id, description = excluded.description, event_category = excluded.event_category, brotherhood_entity_id = excluded.brotherhood_entity_id, municipality_id = excluded.municipality_id, event_status = excluded.event_status;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('abacb5ec-eca1-4d1c-afb7-41ce07c17cc4', 'event', 'Estreno del paso de palio', 'estreno-palio-presentacion-1916', 'Se estrenó el actual palio de Nuestra Señora de la Presentación.', 'published')
on conflict (id) do update set entity_type = excluded.entity_type, name = excluded.name, slug = excluded.slug, summary = excluded.summary, status = excluded.status;

insert into public.events (entity_id, event_type, event_date_text, place_id, description, event_category, brotherhood_entity_id, municipality_id, event_status)
values ('abacb5ec-eca1-4d1c-afb7-41ce07c17cc4', 'Hito histórico', '1916', null, 'Se estrenó el actual palio de Nuestra Señora de la Presentación.', 'historical', '6c50dc05-e054-4316-a046-900451467952', 'ca85889c-21fe-4367-8477-a57656b25da4', 'held')
on conflict (entity_id) do update set event_type = excluded.event_type, event_date_text = excluded.event_date_text, place_id = excluded.place_id, description = excluded.description, event_category = excluded.event_category, brotherhood_entity_id = excluded.brotherhood_entity_id, municipality_id = excluded.municipality_id, event_status = excluded.event_status;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('f3f06e37-23cd-4ab4-8129-21c9f8acadd3', 'brotherhood', 'Esperanza de Triana', 'hermandad-esperanza-de-triana-sevilla', 'Hermandad sacramental y de penitencia de Triana, con sede en la Capilla de los Marineros y dos pasos en la Madrugada.', 'published')
on conflict (id) do update set entity_type = excluded.entity_type, name = excluded.name, slug = excluded.slug, summary = excluded.summary, status = excluded.status;

insert into public.brotherhoods (entity_id, official_name, popular_name, foundation_text, municipality_id, canonical_see_place_id, neighborhood, website_url, brotherhood_types, current_procession_day, history_text, notes)
values ('f3f06e37-23cd-4ab4-8129-21c9f8acadd3', 'Hermandad Sacramental de la Esperanza de Triana', 'Esperanza de Triana', 'Tradición fundacional desde 1418; Hermandad de las Tres Caídas fundada en 1608', 'ca85889c-21fe-4367-8477-a57656b25da4', '4f5f1f50-3555-4a47-a188-6ee57c481971', 'Triana', 'https://esperanzadetriana.es/', ARRAY['Penitencia', 'Sacramental']::text[], 'Madrugada', 'La tradición histórica sitúa en 1418 una hermandad de luz de la Esperanza en Santa Ana. La Hermandad de las Tres Caídas se fundó en 1608 y quedó unida a la Esperanza en 1616. La primera estación a la Catedral tuvo lugar en 1845; la corporación regresó a la Capilla de los Marineros en 1962.', 'Se publican únicamente autorías y dataciones expresamente documentadas o atribuidas por la propia Hermandad. Escudo y multimedia quedan sin publicar por falta de licencia reutilizable.')
on conflict (entity_id) do update set official_name = excluded.official_name, popular_name = excluded.popular_name, foundation_text = excluded.foundation_text, municipality_id = excluded.municipality_id, canonical_see_place_id = excluded.canonical_see_place_id, neighborhood = excluded.neighborhood, website_url = excluded.website_url, brotherhood_types = excluded.brotherhood_types, current_procession_day = excluded.current_procession_day, history_text = excluded.history_text, notes = excluded.notes;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('2889b9e9-8d41-447d-aed1-0922a7ae9c19', 'image', 'Santísimo Cristo de las Tres Caídas', 'santisimo-cristo-tres-caidas-esperanza-triana', 'Talla policromada realizada en torno a 1607 y atribuida tradicionalmente a Marcos de Cabrera.', 'published')
on conflict (id) do update set entity_type = excluded.entity_type, name = excluded.name, slug = excluded.slug, summary = excluded.summary, status = excluded.status;

insert into public.images (entity_id, current_condition, image_type, execution_date_text, material, description, is_dress_image)
values ('2889b9e9-8d41-447d-aed1-0922a7ae9c19', 'extant', 'Nazareno caído', 'En torno a 1607', 'Madera policromada', 'Talla policromada realizada en torno a 1607 y atribuida tradicionalmente a Marcos de Cabrera.', true)
on conflict (entity_id) do update set current_condition = excluded.current_condition, image_type = excluded.image_type, execution_date_text = excluded.execution_date_text, material = excluded.material, description = excluded.description, is_dress_image = excluded.is_dress_image;

insert into public.brotherhood_images (id, brotherhood_entity_id, image_entity_id, relation_type, notes, status)
values ('22c44ddc-dee8-4372-a077-491812cc41e0', 'f3f06e37-23cd-4ab4-8129-21c9f8acadd3', '2889b9e9-8d41-447d-aed1-0922a7ae9c19', 'titular', 'Titular vigente documentado por la Hermandad.', 'published')
on conflict (id) do update set brotherhood_entity_id = excluded.brotherhood_entity_id, image_entity_id = excluded.image_entity_id, relation_type = excluded.relation_type, notes = excluded.notes, status = excluded.status;

insert into public.image_authorships (id, image_entity_id, agent_entity_id, authorship_type, role_name, date_from_text, certainty, notes, status)
values ('889793a0-d2e9-4066-a6e4-e5552096841f', '2889b9e9-8d41-447d-aed1-0922a7ae9c19', 'ff3b1c8b-2c17-49cd-990d-a3f79b1c739d', 'attributed_to', 'escultor', 'En torno a 1607', 'attributed', 'Atribución mantenida por especialistas; no consta documentación de autoría.', 'published')
on conflict (id) do update set image_entity_id = excluded.image_entity_id, agent_entity_id = excluded.agent_entity_id, authorship_type = excluded.authorship_type, role_name = excluded.role_name, date_from_text = excluded.date_from_text, certainty = excluded.certainty, notes = excluded.notes, status = excluded.status;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('8acc8be8-ad29-4fc6-a778-8688920a32fc', 'image', 'Nuestra Señora de la Esperanza', 'nuestra-senora-esperanza-triana', 'Dolorosa de 1,70 m que conserva cuerpo y cuello de origen y responde a rasgos formales del siglo XVII; su autoría permanece incierta.', 'published')
on conflict (id) do update set entity_type = excluded.entity_type, name = excluded.name, slug = excluded.slug, summary = excluded.summary, status = excluded.status;

insert into public.images (entity_id, current_condition, image_type, execution_date_text, material, dimensions_text, description, is_dress_image)
values ('8acc8be8-ad29-4fc6-a778-8688920a32fc', 'extant', 'Dolorosa de candelero', 'Siglo XVII; autoría incierta', 'Madera policromada', '1,70 m', 'Dolorosa de 1,70 m que conserva cuerpo y cuello de origen y responde a rasgos formales del siglo XVII; su autoría permanece incierta.', true)
on conflict (entity_id) do update set current_condition = excluded.current_condition, image_type = excluded.image_type, execution_date_text = excluded.execution_date_text, material = excluded.material, dimensions_text = excluded.dimensions_text, description = excluded.description, is_dress_image = excluded.is_dress_image;

insert into public.brotherhood_images (id, brotherhood_entity_id, image_entity_id, relation_type, notes, status)
values ('21200808-966e-4d12-a204-e72c1943350d', 'f3f06e37-23cd-4ab4-8129-21c9f8acadd3', '8acc8be8-ad29-4fc6-a778-8688920a32fc', 'titular', 'Titular vigente documentado por la Hermandad.', 'published')
on conflict (id) do update set brotherhood_entity_id = excluded.brotherhood_entity_id, image_entity_id = excluded.image_entity_id, relation_type = excluded.relation_type, notes = excluded.notes, status = excluded.status;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('75f532f3-f458-47e6-a18b-f7d5a3e9c799', 'step', 'Paso de misterio del Santísimo Cristo de las Tres Caídas', 'paso-misterio-tres-caidas-triana', 'Paso de misterio del Santísimo Cristo de las Tres Caídas, con una historia material documentada desde comienzos del siglo XVIII.', 'published')
on conflict (id) do update set entity_type = excluded.entity_type, name = excluded.name, slug = excluded.slug, summary = excluded.summary, status = excluded.status;

insert into public.steps (entity_id, current_condition, step_type, description)
values ('75f532f3-f458-47e6-a18b-f7d5a3e9c799', 'preserved', 'Paso de misterio', 'Paso de misterio del Santísimo Cristo de las Tres Caídas, con una historia material documentada desde comienzos del siglo XVIII.')
on conflict (entity_id) do update set current_condition = excluded.current_condition, step_type = excluded.step_type, description = excluded.description;

insert into public.brotherhood_steps (id, brotherhood_entity_id, step_entity_id, relation_type, notes, status)
values ('86b566f5-d44a-490d-ac2c-cf0e3f5eab71', 'f3f06e37-23cd-4ab4-8129-21c9f8acadd3', '75f532f3-f458-47e6-a18b-f7d5a3e9c799', 'current', 'Paso procesional vigente.', 'published')
on conflict (id) do update set brotherhood_entity_id = excluded.brotherhood_entity_id, step_entity_id = excluded.step_entity_id, relation_type = excluded.relation_type, notes = excluded.notes, status = excluded.status;

insert into public.image_steps (id, image_entity_id, step_entity_id, relation_type, notes, status)
values ('2c306ee4-65a5-4729-a0be-48aa4febb369', '2889b9e9-8d41-447d-aed1-0922a7ae9c19', '75f532f3-f458-47e6-a18b-f7d5a3e9c799', 'processional', 'Imagen principal del paso.', 'published')
on conflict (id) do update set image_entity_id = excluded.image_entity_id, step_entity_id = excluded.step_entity_id, relation_type = excluded.relation_type, notes = excluded.notes, status = excluded.status;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('81f272ef-3d6c-41cd-a0cd-251fe7990231', 'step', 'Paso de palio de Nuestra Señora de la Esperanza', 'paso-palio-esperanza-triana', 'Conjunto regionalista inspirado en la cerámica y la simbología marinera de Triana.', 'published')
on conflict (id) do update set entity_type = excluded.entity_type, name = excluded.name, slug = excluded.slug, summary = excluded.summary, status = excluded.status;

insert into public.steps (entity_id, current_condition, step_type, style, materials, description)
values ('81f272ef-3d6c-41cd-a0cd-251fe7990231', 'preserved', 'Paso de palio', 'Regionalista', 'Orfebrería y bordados', 'Conjunto regionalista inspirado en la cerámica y la simbología marinera de Triana.')
on conflict (entity_id) do update set current_condition = excluded.current_condition, step_type = excluded.step_type, style = excluded.style, materials = excluded.materials, description = excluded.description;

insert into public.brotherhood_steps (id, brotherhood_entity_id, step_entity_id, relation_type, notes, status)
values ('66e3cb3f-f475-4b41-a54a-732ae2c4fb23', 'f3f06e37-23cd-4ab4-8129-21c9f8acadd3', '81f272ef-3d6c-41cd-a0cd-251fe7990231', 'current', 'Paso procesional vigente.', 'published')
on conflict (id) do update set brotherhood_entity_id = excluded.brotherhood_entity_id, step_entity_id = excluded.step_entity_id, relation_type = excluded.relation_type, notes = excluded.notes, status = excluded.status;

insert into public.image_steps (id, image_entity_id, step_entity_id, relation_type, notes, status)
values ('5124be9b-7f9b-4d05-abd5-abfa0bf557b3', '8acc8be8-ad29-4fc6-a778-8688920a32fc', '81f272ef-3d6c-41cd-a0cd-251fe7990231', 'processional', 'Imagen principal del paso.', 'published')
on conflict (id) do update set image_entity_id = excluded.image_entity_id, step_entity_id = excluded.step_entity_id, relation_type = excluded.relation_type, notes = excluded.notes, status = excluded.status;

insert into public.cults (id, brotherhood_entity_id, image_entity_id, place_id, status, is_recurring, cult_type, title, month, date_rule, recurrence_label, display_order, description)
values ('54991ac2-f74b-49ed-ae45-0637ff36c80a', 'f3f06e37-23cd-4ab4-8129-21c9f8acadd3', '2889b9e9-8d41-447d-aed1-0922a7ae9c19', '4f5f1f50-3555-4a47-a188-6ee57c481971', 'published', true, 'Quinario', 'Solemne Quinario al Santísimo Cristo de las Tres Caídas', 2, '10 al 14 de febrero de 2026', 'Anual', 1, 'Quinario de 2026 culminado con Función Principal el 15 de febrero.')
on conflict (id) do update set brotherhood_entity_id = excluded.brotherhood_entity_id, image_entity_id = excluded.image_entity_id, place_id = excluded.place_id, status = excluded.status, is_recurring = excluded.is_recurring, cult_type = excluded.cult_type, title = excluded.title, month = excluded.month, date_rule = excluded.date_rule, recurrence_label = excluded.recurrence_label, display_order = excluded.display_order, description = excluded.description;

insert into public.cult_entities (id, cult_id, entity_id, role, notes)
values ('40b8f6de-3639-46a7-a4d8-3f066fd77921', '54991ac2-f74b-49ed-ae45-0637ff36c80a', '2889b9e9-8d41-447d-aed1-0922a7ae9c19', 'honoree', 'Titular al que se dedica el culto.')
on conflict (id) do update set cult_id = excluded.cult_id, entity_id = excluded.entity_id, role = excluded.role, notes = excluded.notes;

insert into public.cults (id, brotherhood_entity_id, image_entity_id, place_id, status, is_recurring, cult_type, title, month, date_rule, recurrence_label, display_order, description)
values ('a972384a-9355-469f-a5eb-bb07e9baf5b5', 'f3f06e37-23cd-4ab4-8129-21c9f8acadd3', '2889b9e9-8d41-447d-aed1-0922a7ae9c19', '4f5f1f50-3555-4a47-a188-6ee57c481971', 'published', true, 'Besamanos', 'Devoto Besamanos del Santísimo Cristo de las Tres Caídas', 2, '18 al 22 de febrero de 2026', 'Anual', 2, 'Veneración del titular durante la Cuaresma de 2026.')
on conflict (id) do update set brotherhood_entity_id = excluded.brotherhood_entity_id, image_entity_id = excluded.image_entity_id, place_id = excluded.place_id, status = excluded.status, is_recurring = excluded.is_recurring, cult_type = excluded.cult_type, title = excluded.title, month = excluded.month, date_rule = excluded.date_rule, recurrence_label = excluded.recurrence_label, display_order = excluded.display_order, description = excluded.description;

insert into public.cult_entities (id, cult_id, entity_id, role, notes)
values ('a01f39e2-526e-4aef-a746-0e10c9a30b97', 'a972384a-9355-469f-a5eb-bb07e9baf5b5', '2889b9e9-8d41-447d-aed1-0922a7ae9c19', 'honoree', 'Titular al que se dedica el culto.')
on conflict (id) do update set cult_id = excluded.cult_id, entity_id = excluded.entity_id, role = excluded.role, notes = excluded.notes;

insert into public.cults (id, brotherhood_entity_id, image_entity_id, place_id, status, is_recurring, cult_type, title, month, date_rule, recurrence_label, display_order, description)
values ('66d37dd1-3342-43a1-ad58-14cd53292c3a', 'f3f06e37-23cd-4ab4-8129-21c9f8acadd3', '8acc8be8-ad29-4fc6-a778-8688920a32fc', '4f5f1f50-3555-4a47-a188-6ee57c481971', 'published', true, 'Septenario', 'Solemne Septenario a Nuestra Señora de la Esperanza', 3, '8 al 14 de marzo de 2026', 'Anual', 3, 'Septenario de 2026 culminado con Función Principal de Instituto el 15 de marzo.')
on conflict (id) do update set brotherhood_entity_id = excluded.brotherhood_entity_id, image_entity_id = excluded.image_entity_id, place_id = excluded.place_id, status = excluded.status, is_recurring = excluded.is_recurring, cult_type = excluded.cult_type, title = excluded.title, month = excluded.month, date_rule = excluded.date_rule, recurrence_label = excluded.recurrence_label, display_order = excluded.display_order, description = excluded.description;

insert into public.cult_entities (id, cult_id, entity_id, role, notes)
values ('efcbdfa6-10b9-44b5-a205-1fad9c1e6549', '66d37dd1-3342-43a1-ad58-14cd53292c3a', '8acc8be8-ad29-4fc6-a778-8688920a32fc', 'honoree', 'Titular al que se dedica el culto.')
on conflict (id) do update set cult_id = excluded.cult_id, entity_id = excluded.entity_id, role = excluded.role, notes = excluded.notes;

insert into public.cults (id, brotherhood_entity_id, image_entity_id, place_id, status, is_recurring, cult_type, title, month, date_rule, recurrence_label, display_order, description)
values ('a1b28515-4198-4c81-a350-58bccbb2f470', 'f3f06e37-23cd-4ab4-8129-21c9f8acadd3', '8acc8be8-ad29-4fc6-a778-8688920a32fc', '4f5f1f50-3555-4a47-a188-6ee57c481971', 'published', true, 'Triduo y besamanos', 'Triduo y Besamanos a Nuestra Señora de la Esperanza', 12, '15 al 18 de diciembre de 2026', 'Anual', 4, 'Cultos de diciembre en honor de la Esperanza.')
on conflict (id) do update set brotherhood_entity_id = excluded.brotherhood_entity_id, image_entity_id = excluded.image_entity_id, place_id = excluded.place_id, status = excluded.status, is_recurring = excluded.is_recurring, cult_type = excluded.cult_type, title = excluded.title, month = excluded.month, date_rule = excluded.date_rule, recurrence_label = excluded.recurrence_label, display_order = excluded.display_order, description = excluded.description;

insert into public.cult_entities (id, cult_id, entity_id, role, notes)
values ('4debd1bd-917e-4e85-a881-818a856947f4', 'a1b28515-4198-4c81-a350-58bccbb2f470', '8acc8be8-ad29-4fc6-a778-8688920a32fc', 'honoree', 'Titular al que se dedica el culto.')
on conflict (id) do update set cult_id = excluded.cult_id, entity_id = excluded.entity_id, role = excluded.role, notes = excluded.notes;

insert into public.outings (id, brotherhood_entity_id, outing_type, character, title, outing_date, year, municipality_id, origin_place_id, destination_text, description, event_status, status, slug)
values ('3850c8a8-b3d1-4e85-ac9b-26c2f6e078fc', 'f3f06e37-23cd-4ab4-8129-21c9f8acadd3', 'Estación de Penitencia', 'ordinary', 'Esperanza de Triana · Estación de Penitencia 2026', '2026-04-03', 2026, 'ca85889c-21fe-4367-8477-a57656b25da4', '4f5f1f50-3555-4a47-a188-6ee57c481971', 'Santa Iglesia Catedral de Sevilla', 'Estación de Penitencia de la Madrugada del Viernes Santo de 2026.', 'held', 'published', 'esperanza-triana-estacion-penitencia-2026')
on conflict (id) do update set brotherhood_entity_id = excluded.brotherhood_entity_id, outing_type = excluded.outing_type, character = excluded.character, title = excluded.title, outing_date = excluded.outing_date, year = excluded.year, municipality_id = excluded.municipality_id, origin_place_id = excluded.origin_place_id, destination_text = excluded.destination_text, description = excluded.description, event_status = excluded.event_status, status = excluded.status, slug = excluded.slug;

insert into public.outing_entities (id, outing_id, entity_id, role, notes)
values ('d6e6c159-e97b-43bb-a7fb-6f56996c23d9', '3850c8a8-b3d1-4e85-ac9b-26c2f6e078fc', '2889b9e9-8d41-447d-aed1-0922a7ae9c19', 'processional_image', 'Titular participante en la estación de penitencia.')
on conflict (id) do update set outing_id = excluded.outing_id, entity_id = excluded.entity_id, role = excluded.role, notes = excluded.notes;

insert into public.outing_entities (id, outing_id, entity_id, role, notes)
values ('c781835e-c672-4448-a068-6946c8dd5b4e', '3850c8a8-b3d1-4e85-ac9b-26c2f6e078fc', '8acc8be8-ad29-4fc6-a778-8688920a32fc', 'processional_image', 'Titular participante en la estación de penitencia.')
on conflict (id) do update set outing_id = excluded.outing_id, entity_id = excluded.entity_id, role = excluded.role, notes = excluded.notes;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('6db96898-5051-4b80-aa22-6b1a3b8180c7', 'event', 'Fundación tradicional de la Hermandad de la Esperanza', 'fundacion-esperanza-triana-1418', 'La síntesis oficial sitúa en 1418 una hermandad de luz de la Esperanza en Santa Ana.', 'published')
on conflict (id) do update set entity_type = excluded.entity_type, name = excluded.name, slug = excluded.slug, summary = excluded.summary, status = excluded.status;

insert into public.events (entity_id, event_type, event_date_text, place_id, description, event_category, brotherhood_entity_id, municipality_id, event_status)
values ('6db96898-5051-4b80-aa22-6b1a3b8180c7', 'Hito histórico', '1418', null, 'La síntesis oficial sitúa en 1418 una hermandad de luz de la Esperanza en Santa Ana.', 'historical', 'f3f06e37-23cd-4ab4-8129-21c9f8acadd3', 'ca85889c-21fe-4367-8477-a57656b25da4', 'held')
on conflict (entity_id) do update set event_type = excluded.event_type, event_date_text = excluded.event_date_text, place_id = excluded.place_id, description = excluded.description, event_category = excluded.event_category, brotherhood_entity_id = excluded.brotherhood_entity_id, municipality_id = excluded.municipality_id, event_status = excluded.event_status;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('dcaf13d5-1e60-4e6a-aab4-295133a23b47', 'event', 'Fundación de la Hermandad de las Tres Caídas', 'fundacion-tres-caidas-triana-1608', 'La Hermandad de las Tres Caídas se fundó en el convento de las Mínimas de Triana.', 'published')
on conflict (id) do update set entity_type = excluded.entity_type, name = excluded.name, slug = excluded.slug, summary = excluded.summary, status = excluded.status;

insert into public.events (entity_id, event_type, event_date_text, place_id, description, event_category, brotherhood_entity_id, municipality_id, event_status)
values ('dcaf13d5-1e60-4e6a-aab4-295133a23b47', 'Hito histórico', '4 de marzo de 1608', null, 'La Hermandad de las Tres Caídas se fundó en el convento de las Mínimas de Triana.', 'historical', 'f3f06e37-23cd-4ab4-8129-21c9f8acadd3', 'ca85889c-21fe-4367-8477-a57656b25da4', 'held')
on conflict (entity_id) do update set event_type = excluded.event_type, event_date_text = excluded.event_date_text, place_id = excluded.place_id, description = excluded.description, event_category = excluded.event_category, brotherhood_entity_id = excluded.brotherhood_entity_id, municipality_id = excluded.municipality_id, event_status = excluded.event_status;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('1babe565-027a-4007-a837-3a798b9ec798', 'event', 'Primera estación a la Catedral', 'primera-estacion-triana-1845', 'La corporación realizó por primera vez estación de penitencia a la Catedral atravesando el puente de barcas.', 'published')
on conflict (id) do update set entity_type = excluded.entity_type, name = excluded.name, slug = excluded.slug, summary = excluded.summary, status = excluded.status;

insert into public.events (entity_id, event_type, event_date_text, place_id, description, event_category, brotherhood_entity_id, municipality_id, event_status)
values ('1babe565-027a-4007-a837-3a798b9ec798', 'Hito histórico', '1845', null, 'La corporación realizó por primera vez estación de penitencia a la Catedral atravesando el puente de barcas.', 'historical', 'f3f06e37-23cd-4ab4-8129-21c9f8acadd3', 'ca85889c-21fe-4367-8477-a57656b25da4', 'held')
on conflict (entity_id) do update set event_type = excluded.event_type, event_date_text = excluded.event_date_text, place_id = excluded.place_id, description = excluded.description, event_category = excluded.event_category, brotherhood_entity_id = excluded.brotherhood_entity_id, municipality_id = excluded.municipality_id, event_status = excluded.event_status;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('a8cd94b7-424d-40dc-a7bb-ee4bf5d4880a', 'event', 'Regreso a la Capilla de los Marineros', 'regreso-capilla-marineros-1962', 'La Hermandad regresó a la Capilla de los Marineros.', 'published')
on conflict (id) do update set entity_type = excluded.entity_type, name = excluded.name, slug = excluded.slug, summary = excluded.summary, status = excluded.status;

insert into public.events (entity_id, event_type, event_date_text, place_id, description, event_category, brotherhood_entity_id, municipality_id, event_status)
values ('a8cd94b7-424d-40dc-a7bb-ee4bf5d4880a', 'Hito histórico', 'Viernes Santo de 1962', '4f5f1f50-3555-4a47-a188-6ee57c481971', 'La Hermandad regresó a la Capilla de los Marineros.', 'historical', 'f3f06e37-23cd-4ab4-8129-21c9f8acadd3', 'ca85889c-21fe-4367-8477-a57656b25da4', 'held')
on conflict (entity_id) do update set event_type = excluded.event_type, event_date_text = excluded.event_date_text, place_id = excluded.place_id, description = excluded.description, event_category = excluded.event_category, brotherhood_entity_id = excluded.brotherhood_entity_id, municipality_id = excluded.municipality_id, event_status = excluded.event_status;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('f9ce1568-5a3c-40f2-ab7b-108e463646f2', 'event', 'Coronación canónica pontificia de la Esperanza', 'coronacion-esperanza-triana-1984', 'Nuestra Señora de la Esperanza fue coronada canónicamente por bula pontificia.', 'published')
on conflict (id) do update set entity_type = excluded.entity_type, name = excluded.name, slug = excluded.slug, summary = excluded.summary, status = excluded.status;

insert into public.events (entity_id, event_type, event_date_text, place_id, description, event_category, brotherhood_entity_id, municipality_id, event_status)
values ('f9ce1568-5a3c-40f2-ab7b-108e463646f2', 'Hito histórico', '2 de junio de 1984', null, 'Nuestra Señora de la Esperanza fue coronada canónicamente por bula pontificia.', 'historical', 'f3f06e37-23cd-4ab4-8129-21c9f8acadd3', 'ca85889c-21fe-4367-8477-a57656b25da4', 'held')
on conflict (entity_id) do update set event_type = excluded.event_type, event_date_text = excluded.event_date_text, place_id = excluded.place_id, description = excluded.description, event_category = excluded.event_category, brotherhood_entity_id = excluded.brotherhood_entity_id, municipality_id = excluded.municipality_id, event_status = excluded.event_status;

insert into public.music_accompaniment_periods (id, brotherhood_entity_id, band_entity_id, step_entity_id, position, outing_type, date_from_text, year_from, is_current, status, public_brotherhood_name, public_step_name, public_brotherhood_slug, public_municipality_name, public_municipality_slug, public_province)
values ('19649a0d-1151-41b5-91a4-17e3986da673', 'f3f06e37-23cd-4ab4-8129-21c9f8acadd3', '0a86bfb1-afe6-448a-88b9-127867f5b1a9', '75f532f3-f458-47e6-a18b-f7d5a3e9c799', 'Tras el paso del Santísimo Cristo de las Tres Caídas', 'Madrugá', 'Desde 1981', 1981, true, 'published', 'Esperanza de Triana', 'Santísimo Cristo de las Tres Caídas', 'hermandad-esperanza-de-triana-sevilla', 'Sevilla', 'sevilla', 'Sevilla')
on conflict (id) do update set brotherhood_entity_id = excluded.brotherhood_entity_id, band_entity_id = excluded.band_entity_id, step_entity_id = excluded.step_entity_id, position = excluded.position, outing_type = excluded.outing_type, date_from_text = excluded.date_from_text, year_from = excluded.year_from, is_current = excluded.is_current, status = excluded.status, public_brotherhood_name = excluded.public_brotherhood_name, public_step_name = excluded.public_step_name, public_brotherhood_slug = excluded.public_brotherhood_slug, public_municipality_name = excluded.public_municipality_name, public_municipality_slug = excluded.public_municipality_slug, public_province = excluded.public_province;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('c6100000-0000-4000-8000-000000000015', 'brotherhood', 'Los Gitanos', 'hermandad-gitanos-sevilla', 'Hermandad sacramental y de penitencia con sede en el Santuario de Nuestro Padre Jesús de la Salud y María Santísima de las Angustias.', 'published')
on conflict (id) do update set entity_type = excluded.entity_type, name = excluded.name, slug = excluded.slug, summary = excluded.summary, status = excluded.status;

insert into public.brotherhoods (entity_id, official_name, popular_name, foundation_text, municipality_id, canonical_see_place_id, neighborhood, website_url, brotherhood_types, current_procession_day, history_text, notes)
values ('c6100000-0000-4000-8000-000000000015', 'Hermandad Sacramental de Los Gitanos', 'Los Gitanos', 'Primeras reglas aprobadas el 7 de diciembre de 1753', 'ca85889c-21fe-4367-8477-a57656b25da4', '2fa34697-c3d0-4f0e-a34b-e8776ba71a37', 'Centro', 'https://www.hermandaddelosgitanos.com/', ARRAY['Penitencia', 'Sacramental']::text[], 'Madrugada', 'La corporación obtuvo sus primeras reglas el 7 de diciembre de 1753. Se estableció en el Convento del Pópulo en 1754 y realizó su primera estación a la Catedral en 1759. Desde 1999 tiene su sede en la antigua iglesia del Valle, hoy Santuario de Nuestro Padre Jesús de la Salud y María Santísima de las Angustias.', 'La relación con sus formaciones musicales existentes se reutiliza sin duplicarlas. Escudo y multimedia quedan sin publicar por falta de licencia reutilizable.')
on conflict (entity_id) do update set official_name = excluded.official_name, popular_name = excluded.popular_name, foundation_text = excluded.foundation_text, municipality_id = excluded.municipality_id, canonical_see_place_id = excluded.canonical_see_place_id, neighborhood = excluded.neighborhood, website_url = excluded.website_url, brotherhood_types = excluded.brotherhood_types, current_procession_day = excluded.current_procession_day, history_text = excluded.history_text, notes = excluded.notes;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('bcebc2a6-54cc-4c58-a649-b489bc177d5b', 'image', 'Nuestro Padre Jesús de la Salud', 'nuestro-padre-jesus-salud-gitanos-sevilla', 'Nazareno realizado por José Rodríguez Fernández-Andes en 1938 y bendecido el 10 de abril de ese año.', 'published')
on conflict (id) do update set entity_type = excluded.entity_type, name = excluded.name, slug = excluded.slug, summary = excluded.summary, status = excluded.status;

insert into public.images (entity_id, current_condition, image_type, execution_date_text, description, is_dress_image)
values ('bcebc2a6-54cc-4c58-a649-b489bc177d5b', 'extant', 'Nazareno', '1938', 'Nazareno realizado por José Rodríguez Fernández-Andes en 1938 y bendecido el 10 de abril de ese año.', true)
on conflict (entity_id) do update set current_condition = excluded.current_condition, image_type = excluded.image_type, execution_date_text = excluded.execution_date_text, description = excluded.description, is_dress_image = excluded.is_dress_image;

insert into public.brotherhood_images (id, brotherhood_entity_id, image_entity_id, relation_type, notes, status)
values ('c48b669e-c478-4239-a078-536070b159b8', 'c6100000-0000-4000-8000-000000000015', 'bcebc2a6-54cc-4c58-a649-b489bc177d5b', 'titular', 'Titular vigente documentado por la Hermandad.', 'published')
on conflict (id) do update set brotherhood_entity_id = excluded.brotherhood_entity_id, image_entity_id = excluded.image_entity_id, relation_type = excluded.relation_type, notes = excluded.notes, status = excluded.status;

insert into public.image_authorships (id, image_entity_id, agent_entity_id, authorship_type, role_name, date_from_text, certainty, notes, status)
values ('0519c3ac-d194-4837-af5a-277828085c05', 'bcebc2a6-54cc-4c58-a649-b489bc177d5b', '13000000-0000-0000-0000-000000000002', 'author', 'escultor', '1938', 'documented', 'Autoría documentada por la Hermandad.', 'published')
on conflict (id) do update set image_entity_id = excluded.image_entity_id, agent_entity_id = excluded.agent_entity_id, authorship_type = excluded.authorship_type, role_name = excluded.role_name, date_from_text = excluded.date_from_text, certainty = excluded.certainty, notes = excluded.notes, status = excluded.status;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('45d47ba0-d2cd-44f0-a9b0-863de87938ed', 'image', 'María Santísima de las Angustias Coronada', 'maria-santisima-angustias-gitanos-sevilla', 'Dolorosa realizada por José Rodríguez Fernández-Andes y bendecida el 14 de marzo de 1937.', 'published')
on conflict (id) do update set entity_type = excluded.entity_type, name = excluded.name, slug = excluded.slug, summary = excluded.summary, status = excluded.status;

insert into public.images (entity_id, current_condition, image_type, execution_date_text, description, is_dress_image)
values ('45d47ba0-d2cd-44f0-a9b0-863de87938ed', 'extant', 'Dolorosa de candelero', '1937', 'Dolorosa realizada por José Rodríguez Fernández-Andes y bendecida el 14 de marzo de 1937.', true)
on conflict (entity_id) do update set current_condition = excluded.current_condition, image_type = excluded.image_type, execution_date_text = excluded.execution_date_text, description = excluded.description, is_dress_image = excluded.is_dress_image;

insert into public.brotherhood_images (id, brotherhood_entity_id, image_entity_id, relation_type, notes, status)
values ('20ef5966-be6c-451f-aed9-8e283cf65490', 'c6100000-0000-4000-8000-000000000015', '45d47ba0-d2cd-44f0-a9b0-863de87938ed', 'titular', 'Titular vigente documentado por la Hermandad.', 'published')
on conflict (id) do update set brotherhood_entity_id = excluded.brotherhood_entity_id, image_entity_id = excluded.image_entity_id, relation_type = excluded.relation_type, notes = excluded.notes, status = excluded.status;

insert into public.image_authorships (id, image_entity_id, agent_entity_id, authorship_type, role_name, date_from_text, certainty, notes, status)
values ('646ff219-7229-438a-a2df-4b93f9a2a544', '45d47ba0-d2cd-44f0-a9b0-863de87938ed', '13000000-0000-0000-0000-000000000002', 'author', 'escultor', '1937', 'documented', 'Autoría documentada por la Hermandad.', 'published')
on conflict (id) do update set image_entity_id = excluded.image_entity_id, agent_entity_id = excluded.agent_entity_id, authorship_type = excluded.authorship_type, role_name = excluded.role_name, date_from_text = excluded.date_from_text, certainty = excluded.certainty, notes = excluded.notes, status = excluded.status;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('43491e4a-db27-4221-a512-70bc265f6b66', 'step', 'Paso de Nuestro Padre Jesús de la Salud', 'paso-nuestro-padre-jesus-salud-gitanos', 'Paso neobarroco tallado por Antonio Martín Fernández en 1979, con imaginería de Francisco Buiza.', 'published')
on conflict (id) do update set entity_type = excluded.entity_type, name = excluded.name, slug = excluded.slug, summary = excluded.summary, status = excluded.status;

insert into public.steps (entity_id, current_condition, step_type, execution_date_text, style, description)
values ('43491e4a-db27-4221-a512-70bc265f6b66', 'preserved', 'Paso de Cristo', '1979', 'Neobarroco', 'Paso neobarroco tallado por Antonio Martín Fernández en 1979, con imaginería de Francisco Buiza.')
on conflict (entity_id) do update set current_condition = excluded.current_condition, step_type = excluded.step_type, execution_date_text = excluded.execution_date_text, style = excluded.style, description = excluded.description;

insert into public.brotherhood_steps (id, brotherhood_entity_id, step_entity_id, relation_type, notes, status)
values ('821316c0-8d24-4b9a-ad5f-9f3d61830343', 'c6100000-0000-4000-8000-000000000015', '43491e4a-db27-4221-a512-70bc265f6b66', 'current', 'Paso procesional vigente.', 'published')
on conflict (id) do update set brotherhood_entity_id = excluded.brotherhood_entity_id, step_entity_id = excluded.step_entity_id, relation_type = excluded.relation_type, notes = excluded.notes, status = excluded.status;

insert into public.image_steps (id, image_entity_id, step_entity_id, relation_type, notes, status)
values ('27b62e0c-517f-423b-a530-1222a9d3c967', 'bcebc2a6-54cc-4c58-a649-b489bc177d5b', '43491e4a-db27-4221-a512-70bc265f6b66', 'processional', 'Imagen principal del paso.', 'published')
on conflict (id) do update set image_entity_id = excluded.image_entity_id, step_entity_id = excluded.step_entity_id, relation_type = excluded.relation_type, notes = excluded.notes, status = excluded.status;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('ee6fce46-3185-417e-a0ab-39b2d4ae8bcd', 'step', 'Paso de palio de María Santísima de las Angustias', 'paso-palio-angustias-gitanos', 'Palio bordado por Fernández y Enríquez en 1994 reproduciendo el diseño de Ignacio Gómez Millán de 1938; varales de Ramón León de 2000.', 'published')
on conflict (id) do update set entity_type = excluded.entity_type, name = excluded.name, slug = excluded.slug, summary = excluded.summary, status = excluded.status;

insert into public.steps (entity_id, current_condition, step_type, execution_date_text, materials, description)
values ('ee6fce46-3185-417e-a0ab-39b2d4ae8bcd', 'preserved', 'Paso de palio', '1994 y orfebrería posterior', 'Bordados y plata', 'Palio bordado por Fernández y Enríquez en 1994 reproduciendo el diseño de Ignacio Gómez Millán de 1938; varales de Ramón León de 2000.')
on conflict (entity_id) do update set current_condition = excluded.current_condition, step_type = excluded.step_type, execution_date_text = excluded.execution_date_text, materials = excluded.materials, description = excluded.description;

insert into public.brotherhood_steps (id, brotherhood_entity_id, step_entity_id, relation_type, notes, status)
values ('e3a254b5-1e90-4f6e-ab27-8a4c5961d14d', 'c6100000-0000-4000-8000-000000000015', 'ee6fce46-3185-417e-a0ab-39b2d4ae8bcd', 'current', 'Paso procesional vigente.', 'published')
on conflict (id) do update set brotherhood_entity_id = excluded.brotherhood_entity_id, step_entity_id = excluded.step_entity_id, relation_type = excluded.relation_type, notes = excluded.notes, status = excluded.status;

insert into public.image_steps (id, image_entity_id, step_entity_id, relation_type, notes, status)
values ('3fed5c0c-b19c-4a52-a7dc-a7a836c348bf', '45d47ba0-d2cd-44f0-a9b0-863de87938ed', 'ee6fce46-3185-417e-a0ab-39b2d4ae8bcd', 'processional', 'Imagen principal del paso.', 'published')
on conflict (id) do update set image_entity_id = excluded.image_entity_id, step_entity_id = excluded.step_entity_id, relation_type = excluded.relation_type, notes = excluded.notes, status = excluded.status;

insert into public.cults (id, brotherhood_entity_id, image_entity_id, place_id, status, is_recurring, cult_type, title, month, date_rule, recurrence_label, display_order, description)
values ('86b4af90-55de-4c65-a6b8-f5cb7bd9e567', 'c6100000-0000-4000-8000-000000000015', '45d47ba0-d2cd-44f0-a9b0-863de87938ed', '2fa34697-c3d0-4f0e-a34b-e8776ba71a37', 'published', true, 'Triduo y besamanos', 'Solemne Triduo a María Santísima de las Angustias', 2, 'Tres días antes de la fiesta de la Presentación del Señor o domingo inmediato', 'Anual', 1, 'Triduo culminado con Eucaristía y besamanos a la titular.')
on conflict (id) do update set brotherhood_entity_id = excluded.brotherhood_entity_id, image_entity_id = excluded.image_entity_id, place_id = excluded.place_id, status = excluded.status, is_recurring = excluded.is_recurring, cult_type = excluded.cult_type, title = excluded.title, month = excluded.month, date_rule = excluded.date_rule, recurrence_label = excluded.recurrence_label, display_order = excluded.display_order, description = excluded.description;

insert into public.cult_entities (id, cult_id, entity_id, role, notes)
values ('e1b5ae8f-0838-4ed4-a0f2-efc6924a172a', '86b4af90-55de-4c65-a6b8-f5cb7bd9e567', '45d47ba0-d2cd-44f0-a9b0-863de87938ed', 'honoree', 'Titular al que se dedica el culto.')
on conflict (id) do update set cult_id = excluded.cult_id, entity_id = excluded.entity_id, role = excluded.role, notes = excluded.notes;

insert into public.cults (id, brotherhood_entity_id, image_entity_id, place_id, status, is_recurring, cult_type, title, date_rule, recurrence_label, display_order, description)
values ('dd1db918-27d6-4d3e-a1be-20e08d93a095', 'c6100000-0000-4000-8000-000000000015', 'bcebc2a6-54cc-4c58-a649-b489bc177d5b', '2fa34697-c3d0-4f0e-a34b-e8776ba71a37', 'published', true, 'Quinario', 'Solemne Quinario a Nuestro Padre Jesús de la Salud', 'Cuaresma', 'Anual', 2, 'Quinario con comunión general, Función Principal de Instituto y Protestación de Fe.')
on conflict (id) do update set brotherhood_entity_id = excluded.brotherhood_entity_id, image_entity_id = excluded.image_entity_id, place_id = excluded.place_id, status = excluded.status, is_recurring = excluded.is_recurring, cult_type = excluded.cult_type, title = excluded.title, date_rule = excluded.date_rule, recurrence_label = excluded.recurrence_label, display_order = excluded.display_order, description = excluded.description;

insert into public.cult_entities (id, cult_id, entity_id, role, notes)
values ('e5126edc-b739-485b-af96-1edeb97365dc', 'dd1db918-27d6-4d3e-a1be-20e08d93a095', 'bcebc2a6-54cc-4c58-a649-b489bc177d5b', 'honoree', 'Titular al que se dedica el culto.')
on conflict (id) do update set cult_id = excluded.cult_id, entity_id = excluded.entity_id, role = excluded.role, notes = excluded.notes;

insert into public.cults (id, brotherhood_entity_id, image_entity_id, place_id, status, is_recurring, cult_type, title, date_rule, recurrence_label, display_order, description)
values ('bb9c5c51-6612-4f37-a27f-7ff86cd60bb0', 'c6100000-0000-4000-8000-000000000015', '45d47ba0-d2cd-44f0-a9b0-863de87938ed', '2fa34697-c3d0-4f0e-a34b-e8776ba71a37', 'published', true, 'Misa Solemne', 'Misa Solemne a María Santísima de las Angustias', 'Viernes de Dolores', 'Anual', 3, 'Misa solemne con la titular dispuesta en su paso de salida.')
on conflict (id) do update set brotherhood_entity_id = excluded.brotherhood_entity_id, image_entity_id = excluded.image_entity_id, place_id = excluded.place_id, status = excluded.status, is_recurring = excluded.is_recurring, cult_type = excluded.cult_type, title = excluded.title, date_rule = excluded.date_rule, recurrence_label = excluded.recurrence_label, display_order = excluded.display_order, description = excluded.description;

insert into public.cult_entities (id, cult_id, entity_id, role, notes)
values ('6fc30653-ee50-46b7-a930-844e9b4c57c6', 'bb9c5c51-6612-4f37-a27f-7ff86cd60bb0', '45d47ba0-d2cd-44f0-a9b0-863de87938ed', 'honoree', 'Titular al que se dedica el culto.')
on conflict (id) do update set cult_id = excluded.cult_id, entity_id = excluded.entity_id, role = excluded.role, notes = excluded.notes;

insert into public.cults (id, brotherhood_entity_id, image_entity_id, place_id, status, is_recurring, cult_type, title, date_rule, recurrence_label, display_order, description)
values ('8fd625c0-5c3a-41a8-a35c-6e5b8830ba32', 'c6100000-0000-4000-8000-000000000015', 'bcebc2a6-54cc-4c58-a649-b489bc177d5b', '2fa34697-c3d0-4f0e-a34b-e8776ba71a37', 'published', true, 'Besamanos', 'Besamanos a Nuestro Padre Jesús de la Salud', 'Domingo de Ramos', 'Anual', 4, 'Veneración del Señor previa al Vía Crucis de traslado del Lunes Santo.')
on conflict (id) do update set brotherhood_entity_id = excluded.brotherhood_entity_id, image_entity_id = excluded.image_entity_id, place_id = excluded.place_id, status = excluded.status, is_recurring = excluded.is_recurring, cult_type = excluded.cult_type, title = excluded.title, date_rule = excluded.date_rule, recurrence_label = excluded.recurrence_label, display_order = excluded.display_order, description = excluded.description;

insert into public.cult_entities (id, cult_id, entity_id, role, notes)
values ('28393968-322d-439c-ab10-bd0aa890c79e', '8fd625c0-5c3a-41a8-a35c-6e5b8830ba32', 'bcebc2a6-54cc-4c58-a649-b489bc177d5b', 'honoree', 'Titular al que se dedica el culto.')
on conflict (id) do update set cult_id = excluded.cult_id, entity_id = excluded.entity_id, role = excluded.role, notes = excluded.notes;

insert into public.outings (id, brotherhood_entity_id, outing_type, character, title, outing_date, year, municipality_id, origin_place_id, destination_text, description, event_status, status, slug)
values ('ef206835-3c75-4979-a4cb-c4c1ff8416de', 'c6100000-0000-4000-8000-000000000015', 'Estación de Penitencia', 'ordinary', 'Los Gitanos · Estación de Penitencia 2026', '2026-04-03', 2026, 'ca85889c-21fe-4367-8477-a57656b25da4', '2fa34697-c3d0-4f0e-a34b-e8776ba71a37', 'Santa Iglesia Catedral de Sevilla', 'Estación de Penitencia de la Madrugada del Viernes Santo de 2026.', 'held', 'published', 'gitanos-estacion-penitencia-2026')
on conflict (id) do update set brotherhood_entity_id = excluded.brotherhood_entity_id, outing_type = excluded.outing_type, character = excluded.character, title = excluded.title, outing_date = excluded.outing_date, year = excluded.year, municipality_id = excluded.municipality_id, origin_place_id = excluded.origin_place_id, destination_text = excluded.destination_text, description = excluded.description, event_status = excluded.event_status, status = excluded.status, slug = excluded.slug;

insert into public.outing_entities (id, outing_id, entity_id, role, notes)
values ('24997c13-98a8-4460-a6f7-97b0d3d1885c', 'ef206835-3c75-4979-a4cb-c4c1ff8416de', 'bcebc2a6-54cc-4c58-a649-b489bc177d5b', 'processional_image', 'Titular participante en la estación de penitencia.')
on conflict (id) do update set outing_id = excluded.outing_id, entity_id = excluded.entity_id, role = excluded.role, notes = excluded.notes;

insert into public.outing_entities (id, outing_id, entity_id, role, notes)
values ('21e34580-65f5-4385-a2b2-8073b1054905', 'ef206835-3c75-4979-a4cb-c4c1ff8416de', '45d47ba0-d2cd-44f0-a9b0-863de87938ed', 'processional_image', 'Titular participante en la estación de penitencia.')
on conflict (id) do update set outing_id = excluded.outing_id, entity_id = excluded.entity_id, role = excluded.role, notes = excluded.notes;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('a4b77a6f-ce8d-4169-a280-6d74a36e70cf', 'event', 'Aprobación de las primeras reglas', 'reglas-gitanos-1753', 'Se aprobaron las primeras reglas de la Hermandad.', 'published')
on conflict (id) do update set entity_type = excluded.entity_type, name = excluded.name, slug = excluded.slug, summary = excluded.summary, status = excluded.status;

insert into public.events (entity_id, event_type, event_date_text, place_id, description, event_category, brotherhood_entity_id, municipality_id, event_status)
values ('a4b77a6f-ce8d-4169-a280-6d74a36e70cf', 'Hito histórico', '7 de diciembre de 1753', null, 'Se aprobaron las primeras reglas de la Hermandad.', 'historical', 'c6100000-0000-4000-8000-000000000015', 'ca85889c-21fe-4367-8477-a57656b25da4', 'held')
on conflict (entity_id) do update set event_type = excluded.event_type, event_date_text = excluded.event_date_text, place_id = excluded.place_id, description = excluded.description, event_category = excluded.event_category, brotherhood_entity_id = excluded.brotherhood_entity_id, municipality_id = excluded.municipality_id, event_status = excluded.event_status;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('60243b0c-d915-4648-a66c-126830cc75a4', 'event', 'Primera estación a la Catedral', 'primera-estacion-gitanos-1759', 'La Hermandad realizó su primera estación de penitencia a la Catedral desde el Convento del Pópulo.', 'published')
on conflict (id) do update set entity_type = excluded.entity_type, name = excluded.name, slug = excluded.slug, summary = excluded.summary, status = excluded.status;

insert into public.events (entity_id, event_type, event_date_text, place_id, description, event_category, brotherhood_entity_id, municipality_id, event_status)
values ('60243b0c-d915-4648-a66c-126830cc75a4', 'Hito histórico', 'Miércoles Santo de 1759', null, 'La Hermandad realizó su primera estación de penitencia a la Catedral desde el Convento del Pópulo.', 'historical', 'c6100000-0000-4000-8000-000000000015', 'ca85889c-21fe-4367-8477-a57656b25da4', 'held')
on conflict (entity_id) do update set event_type = excluded.event_type, event_date_text = excluded.event_date_text, place_id = excluded.place_id, description = excluded.description, event_category = excluded.event_category, brotherhood_entity_id = excluded.brotherhood_entity_id, municipality_id = excluded.municipality_id, event_status = excluded.event_status;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('969b8e52-ab28-48c7-a647-906eba08834b', 'event', 'Concesión del título de Real', 'titulo-real-gitanos-1815', 'Fernando VII concedió a la corporación el título de Real.', 'published')
on conflict (id) do update set entity_type = excluded.entity_type, name = excluded.name, slug = excluded.slug, summary = excluded.summary, status = excluded.status;

insert into public.events (entity_id, event_type, event_date_text, place_id, description, event_category, brotherhood_entity_id, municipality_id, event_status)
values ('969b8e52-ab28-48c7-a647-906eba08834b', 'Hito histórico', '1815', null, 'Fernando VII concedió a la corporación el título de Real.', 'historical', 'c6100000-0000-4000-8000-000000000015', 'ca85889c-21fe-4367-8477-a57656b25da4', 'held')
on conflict (entity_id) do update set event_type = excluded.event_type, event_date_text = excluded.event_date_text, place_id = excluded.place_id, description = excluded.description, event_category = excluded.event_category, brotherhood_entity_id = excluded.brotherhood_entity_id, municipality_id = excluded.municipality_id, event_status = excluded.event_status;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('eab4ff1d-bb90-4d4c-a167-cefe3dd4ac6f', 'event', 'Traslado a la iglesia del Valle', 'traslado-gitanos-valle-1999', 'La Hermandad se trasladó desde Santa Catalina a la antigua iglesia del Valle.', 'published')
on conflict (id) do update set entity_type = excluded.entity_type, name = excluded.name, slug = excluded.slug, summary = excluded.summary, status = excluded.status;

insert into public.events (entity_id, event_type, event_date_text, place_id, description, event_category, brotherhood_entity_id, municipality_id, event_status)
values ('eab4ff1d-bb90-4d4c-a167-cefe3dd4ac6f', 'Hito histórico', '14 de febrero de 1999', '2fa34697-c3d0-4f0e-a34b-e8776ba71a37', 'La Hermandad se trasladó desde Santa Catalina a la antigua iglesia del Valle.', 'historical', 'c6100000-0000-4000-8000-000000000015', 'ca85889c-21fe-4367-8477-a57656b25da4', 'held')
on conflict (entity_id) do update set event_type = excluded.event_type, event_date_text = excluded.event_date_text, place_id = excluded.place_id, description = excluded.description, event_category = excluded.event_category, brotherhood_entity_id = excluded.brotherhood_entity_id, municipality_id = excluded.municipality_id, event_status = excluded.event_status;

insert into public.music_accompaniment_periods (id, brotherhood_entity_id, band_entity_id, step_entity_id, position, outing_type, date_from_text, is_current, notes, status, public_brotherhood_name, public_step_name, public_brotherhood_slug, public_municipality_name, public_municipality_slug, public_province)
values ('a8e0a5c7-acf6-4a3c-8895-814df3332fe7', 'c6100000-0000-4000-8000-000000000015', 'c6000000-0000-4000-8000-000000000003', '43491e4a-db27-4221-a512-70bc265f6b66', 'Madrugá · Tras Nuestro Padre Jesús de la Salud', 'Madrugá', 'Vigente en 2026; inicio por documentar', true, 'Madrugá del Viernes Santo. Acompañamiento de su hermandad de origen, vigente en 2026.', 'published', 'Los Gitanos', 'Nuestro Padre Jesús de la Salud', 'hermandad-gitanos-sevilla', 'Sevilla', 'sevilla', 'Sevilla')
on conflict (id) do update set brotherhood_entity_id = excluded.brotherhood_entity_id, band_entity_id = excluded.band_entity_id, step_entity_id = excluded.step_entity_id, position = excluded.position, outing_type = excluded.outing_type, date_from_text = excluded.date_from_text, is_current = excluded.is_current, notes = excluded.notes, status = excluded.status, public_brotherhood_name = excluded.public_brotherhood_name, public_step_name = excluded.public_step_name, public_brotherhood_slug = excluded.public_brotherhood_slug, public_municipality_name = excluded.public_municipality_name, public_municipality_slug = excluded.public_municipality_slug, public_province = excluded.public_province;

insert into public.music_accompaniment_periods (id, brotherhood_entity_id, band_entity_id, step_entity_id, position, outing_type, date_from_text, year_from, is_current, notes, status, public_brotherhood_name, public_step_name, public_brotherhood_slug, public_municipality_name, public_municipality_slug, public_province)
values ('9ff393ee-ed41-4b74-9ce8-a7fb78daa242', 'c6100000-0000-4000-8000-000000000015', 'c1611969-501b-4c33-8153-739ef4b2d588', 'ee6fce46-3185-417e-a0ab-39b2d4ae8bcd', 'Tras el paso de palio', 'Madrugá', 'Desde 2008', 2008, true, 'Madrugá y mañana del Viernes Santo.', 'published', 'Los Gitanos', 'María Santísima de las Angustias Coronada', 'hermandad-gitanos-sevilla', 'Sevilla', 'sevilla', 'Sevilla')
on conflict (id) do update set brotherhood_entity_id = excluded.brotherhood_entity_id, band_entity_id = excluded.band_entity_id, step_entity_id = excluded.step_entity_id, position = excluded.position, outing_type = excluded.outing_type, date_from_text = excluded.date_from_text, year_from = excluded.year_from, is_current = excluded.is_current, notes = excluded.notes, status = excluded.status, public_brotherhood_name = excluded.public_brotherhood_name, public_step_name = excluded.public_step_name, public_brotherhood_slug = excluded.public_brotherhood_slug, public_municipality_name = excluded.public_municipality_name, public_municipality_slug = excluded.public_municipality_slug, public_province = excluded.public_province;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('3fa0cda0-eabd-4ef9-a0c6-0db93c5e2b46', '007b2e35-4715-46cd-a6db-53dea6f697b5', 'f94f1ab8-b8e9-4a94-ace4-a0b6c6c1c4e5', 'general', 'Fuente oficial visible en la ficha de la Hermandad.')
on conflict (id) do update set source_id = excluded.source_id, entity_id = excluded.entity_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('5a5cd3a4-5393-4864-adbc-79129458da04', 'f1671069-c731-4990-af62-dea47d0d24ef', 'f94f1ab8-b8e9-4a94-ace4-a0b6c6c1c4e5', 'general', 'Fuente oficial visible en la ficha de la Hermandad.')
on conflict (id) do update set source_id = excluded.source_id, entity_id = excluded.entity_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('6d0ec35f-8647-4565-aacc-ee0547dd5ccb', 'd25fdea0-8a96-4f39-a800-62fc463ec53d', 'f94f1ab8-b8e9-4a94-ace4-a0b6c6c1c4e5', 'general', 'Fuente oficial visible en la ficha de la Hermandad.')
on conflict (id) do update set source_id = excluded.source_id, entity_id = excluded.entity_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('82b641f6-40db-43a3-a3ac-8e9762e08ee6', '8bcf6e88-56bf-4f7c-ac66-eaaca10b4ca7', 'f94f1ab8-b8e9-4a94-ace4-a0b6c6c1c4e5', 'general', 'Fuente oficial visible en la ficha de la Hermandad.')
on conflict (id) do update set source_id = excluded.source_id, entity_id = excluded.entity_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('47154f02-6ab6-4a6d-a1af-81302d09786f', 'cd607504-af50-45b9-a53b-514d42ffa82a', 'f94f1ab8-b8e9-4a94-ace4-a0b6c6c1c4e5', 'general', 'Fuente oficial visible en la ficha de la Hermandad.')
on conflict (id) do update set source_id = excluded.source_id, entity_id = excluded.entity_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('4f60757f-287b-4fe9-aa7f-66cfa0126317', '694b8200-9a26-45ac-ae13-686e1869e228', 'f94f1ab8-b8e9-4a94-ace4-a0b6c6c1c4e5', 'general', 'Fuente oficial visible en la ficha de la Hermandad.')
on conflict (id) do update set source_id = excluded.source_id, entity_id = excluded.entity_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('297021ee-365f-4b5c-a29d-ad220dddbdc2', 'd3ab4156-8e52-443a-a795-d1ef31e103ee', '6c50dc05-e054-4316-a046-900451467952', 'general', 'Fuente oficial visible en la ficha de la Hermandad.')
on conflict (id) do update set source_id = excluded.source_id, entity_id = excluded.entity_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('41807382-7b23-4f8b-a3ca-1072b3dea8f7', '53736e10-1e16-4744-aea8-e0b68ade9114', '6c50dc05-e054-4316-a046-900451467952', 'general', 'Fuente oficial visible en la ficha de la Hermandad.')
on conflict (id) do update set source_id = excluded.source_id, entity_id = excluded.entity_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('0e9179de-7d1b-4efc-ad62-23b808d34b56', '4e28fdd9-9544-479f-a1f5-9ca926daba23', '6c50dc05-e054-4316-a046-900451467952', 'general', 'Fuente oficial visible en la ficha de la Hermandad.')
on conflict (id) do update set source_id = excluded.source_id, entity_id = excluded.entity_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('3d37c864-07db-4ba6-a066-929e3360363a', '5cb79497-87e1-4705-a924-01736af27278', '6c50dc05-e054-4316-a046-900451467952', 'general', 'Fuente oficial visible en la ficha de la Hermandad.')
on conflict (id) do update set source_id = excluded.source_id, entity_id = excluded.entity_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('c03371a7-492c-4b07-a12f-f5ad567cb471', '156f939a-2584-40a0-a96b-14827f86abde', '6c50dc05-e054-4316-a046-900451467952', 'general', 'Fuente oficial visible en la ficha de la Hermandad.')
on conflict (id) do update set source_id = excluded.source_id, entity_id = excluded.entity_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('ca3e14c2-24dd-47af-a5c3-ee765bb0fff4', 'cd7c2e60-3709-4543-a472-25f942e91669', '6c50dc05-e054-4316-a046-900451467952', 'general', 'Fuente oficial visible en la ficha de la Hermandad.')
on conflict (id) do update set source_id = excluded.source_id, entity_id = excluded.entity_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('903eaaf5-b4b1-438d-ad6f-f2b051932f81', '3b8256c9-2367-4967-ad84-d853002cdaca', '6c50dc05-e054-4316-a046-900451467952', 'general', 'Fuente oficial visible en la ficha de la Hermandad.')
on conflict (id) do update set source_id = excluded.source_id, entity_id = excluded.entity_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('2e687cd2-e0a6-4c53-a5f4-8ea91ea1745e', '574b4549-be76-4892-ae8c-127ca70317c8', '6c50dc05-e054-4316-a046-900451467952', 'general', 'Fuente oficial visible en la ficha de la Hermandad.')
on conflict (id) do update set source_id = excluded.source_id, entity_id = excluded.entity_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('f4abcbc4-c00e-4c9f-aecf-abd6f2a16c6a', 'f006315d-634e-4fdf-a12e-3b8dddd1929a', 'f3f06e37-23cd-4ab4-8129-21c9f8acadd3', 'general', 'Fuente oficial visible en la ficha de la Hermandad.')
on conflict (id) do update set source_id = excluded.source_id, entity_id = excluded.entity_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('d356e781-edd8-47be-a9d2-4c6ab1ddd421', '1c3f9b7b-3204-4080-abd4-8cd97c75de3a', 'f3f06e37-23cd-4ab4-8129-21c9f8acadd3', 'general', 'Fuente oficial visible en la ficha de la Hermandad.')
on conflict (id) do update set source_id = excluded.source_id, entity_id = excluded.entity_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('b41802de-13d6-41ee-aa1e-0c50857f2dec', '07c1b914-0deb-47b1-a050-0915c9fb6eb0', 'f3f06e37-23cd-4ab4-8129-21c9f8acadd3', 'general', 'Fuente oficial visible en la ficha de la Hermandad.')
on conflict (id) do update set source_id = excluded.source_id, entity_id = excluded.entity_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('f1035d57-29b8-4831-a856-bf59c898e9bd', '819dc85e-8474-48f1-a672-36106d0ff005', 'f3f06e37-23cd-4ab4-8129-21c9f8acadd3', 'general', 'Fuente oficial visible en la ficha de la Hermandad.')
on conflict (id) do update set source_id = excluded.source_id, entity_id = excluded.entity_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('ba03b228-21e9-4043-a2e8-09c4d5e54f09', 'f9b73b7a-cd5b-407a-acf6-346de8a2dc6a', 'f3f06e37-23cd-4ab4-8129-21c9f8acadd3', 'general', 'Fuente oficial visible en la ficha de la Hermandad.')
on conflict (id) do update set source_id = excluded.source_id, entity_id = excluded.entity_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('73c0057c-b737-4370-a9cb-342d9a8a137b', '3f433ef3-dcff-4d17-a5b3-7f72e6f49570', 'f3f06e37-23cd-4ab4-8129-21c9f8acadd3', 'general', 'Fuente oficial visible en la ficha de la Hermandad.')
on conflict (id) do update set source_id = excluded.source_id, entity_id = excluded.entity_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('f97157bd-fde1-4e94-aaf4-a409f055d438', '2d6fb8f8-3b4b-4b6a-a6af-335f8ca86671', 'f3f06e37-23cd-4ab4-8129-21c9f8acadd3', 'general', 'Fuente oficial visible en la ficha de la Hermandad.')
on conflict (id) do update set source_id = excluded.source_id, entity_id = excluded.entity_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('84f3d54a-5d29-4b96-aa2a-c5ab335467e5', '0e32b8ab-8ea0-47bb-aff5-1608d5352ff0', 'c6100000-0000-4000-8000-000000000015', 'general', 'Fuente oficial visible en la ficha de la Hermandad.')
on conflict (id) do update set source_id = excluded.source_id, entity_id = excluded.entity_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('82ab8f39-ae6d-470d-ad86-61144514164a', 'b4d87e45-873e-4623-a417-db1fc6d65256', 'c6100000-0000-4000-8000-000000000015', 'general', 'Fuente oficial visible en la ficha de la Hermandad.')
on conflict (id) do update set source_id = excluded.source_id, entity_id = excluded.entity_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('da7d9078-0a17-45cf-a918-ceace81e4dbc', 'ff2532d8-42df-4e17-a4a0-e982f7aacdc6', 'c6100000-0000-4000-8000-000000000015', 'general', 'Fuente oficial visible en la ficha de la Hermandad.')
on conflict (id) do update set source_id = excluded.source_id, entity_id = excluded.entity_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('9edb12e6-83f1-4252-a961-1cb39a103127', '5f6f5f0c-7730-40ee-a161-797fd2cb3e28', 'c6100000-0000-4000-8000-000000000015', 'general', 'Fuente oficial visible en la ficha de la Hermandad.')
on conflict (id) do update set source_id = excluded.source_id, entity_id = excluded.entity_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('85c7ca76-ace1-48ee-a732-b8d2b61776ab', '8fa0bedd-5c39-45ee-a73f-d76fb86d66fb', 'c6100000-0000-4000-8000-000000000015', 'general', 'Fuente oficial visible en la ficha de la Hermandad.')
on conflict (id) do update set source_id = excluded.source_id, entity_id = excluded.entity_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('c8adcc23-8a92-4135-ad4f-9ffab086cc68', 'b1979a73-ac64-4731-a868-9c76c901e434', 'c6100000-0000-4000-8000-000000000015', 'general', 'Fuente oficial visible en la ficha de la Hermandad.')
on conflict (id) do update set source_id = excluded.source_id, entity_id = excluded.entity_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('3ec5e2fb-e8c3-401d-a8ca-d514bd552c63', '32a71f06-e654-4374-a7de-86fd5f2f870b', 'c6100000-0000-4000-8000-000000000015', 'general', 'Fuente oficial visible en la ficha de la Hermandad.')
on conflict (id) do update set source_id = excluded.source_id, entity_id = excluded.entity_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('8760d98a-91d7-47cb-afc7-242ac593a1b2', 'f7185187-4b02-42c7-a643-1c3dd3111218', 'c6100000-0000-4000-8000-000000000015', 'general', 'Fuente oficial visible en la ficha de la Hermandad.')
on conflict (id) do update set source_id = excluded.source_id, entity_id = excluded.entity_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('0ff9df4e-70c6-4153-ac32-2feafdb0a838', 'f1671069-c731-4990-af62-dea47d0d24ef', '9d1c58e3-161e-46ce-aa72-0123777902d3', 'specific', 'Fuente oficial del elemento relacionado.')
on conflict (id) do update set source_id = excluded.source_id, entity_id = excluded.entity_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('28ce1857-a516-4099-aa5f-e6a86a053b00', 'd25fdea0-8a96-4f39-a800-62fc463ec53d', '2799e5bc-e9f0-4861-a116-6be6802dfd50', 'specific', 'Fuente oficial del elemento relacionado.')
on conflict (id) do update set source_id = excluded.source_id, entity_id = excluded.entity_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('ff9c97c5-abce-4894-a5c8-416298feeaf0', '8bcf6e88-56bf-4f7c-ac66-eaaca10b4ca7', '5e17de35-b32a-429a-a348-850a6794cb93', 'specific', 'Fuente oficial del elemento relacionado.')
on conflict (id) do update set source_id = excluded.source_id, entity_id = excluded.entity_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('f91c8f3f-1c41-4adf-a55c-2dc20e09c590', '694b8200-9a26-45ac-ae13-686e1869e228', '755fecc2-b9f0-4d4b-ad45-c66584e195a3', 'specific', 'Fuente oficial del elemento relacionado.')
on conflict (id) do update set source_id = excluded.source_id, entity_id = excluded.entity_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('971397fb-717c-4271-a4c0-06527156161e', '694b8200-9a26-45ac-ae13-686e1869e228', 'a410ee0d-37ef-4463-ab7c-b5912f8c2cf6', 'specific', 'Fuente oficial del elemento relacionado.')
on conflict (id) do update set source_id = excluded.source_id, entity_id = excluded.entity_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('f6e838f0-81fc-4ddc-ab86-2d2da2d2dbf4', '53736e10-1e16-4744-aea8-e0b68ade9114', 'df840bed-6867-4d25-af22-e4ae259d1b6a', 'specific', 'Fuente oficial del elemento relacionado.')
on conflict (id) do update set source_id = excluded.source_id, entity_id = excluded.entity_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('24bbb347-0fa1-49d3-abd8-c223472a9ebd', '4e28fdd9-9544-479f-a1f5-9ca926daba23', '902fbffe-9bae-4b0c-a7ab-fa9965c83286', 'specific', 'Fuente oficial del elemento relacionado.')
on conflict (id) do update set source_id = excluded.source_id, entity_id = excluded.entity_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('6d76c1c3-a6f7-436a-aab4-4b0d97bc5524', '5cb79497-87e1-4705-a924-01736af27278', '40be5e18-ef23-4ebf-a50e-e3f56a2db46b', 'specific', 'Fuente oficial del elemento relacionado.')
on conflict (id) do update set source_id = excluded.source_id, entity_id = excluded.entity_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('8e97be33-fdee-45a6-a9b9-24b24a60d376', '156f939a-2584-40a0-a96b-14827f86abde', '9074c19c-0a89-4d37-a720-9a819b479f96', 'specific', 'Fuente oficial del elemento relacionado.')
on conflict (id) do update set source_id = excluded.source_id, entity_id = excluded.entity_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('b5fe3f59-4d78-4459-aa16-53e9bc023c57', '1c3f9b7b-3204-4080-abd4-8cd97c75de3a', '2889b9e9-8d41-447d-aed1-0922a7ae9c19', 'specific', 'Fuente oficial del elemento relacionado.')
on conflict (id) do update set source_id = excluded.source_id, entity_id = excluded.entity_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('10759ba8-f460-4bab-a740-96e5ca5651b0', '07c1b914-0deb-47b1-a050-0915c9fb6eb0', '8acc8be8-ad29-4fc6-a778-8688920a32fc', 'specific', 'Fuente oficial del elemento relacionado.')
on conflict (id) do update set source_id = excluded.source_id, entity_id = excluded.entity_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('a89644bf-2c2b-4380-a49e-736ec32e4a9e', '819dc85e-8474-48f1-a672-36106d0ff005', '75f532f3-f458-47e6-a18b-f7d5a3e9c799', 'specific', 'Fuente oficial del elemento relacionado.')
on conflict (id) do update set source_id = excluded.source_id, entity_id = excluded.entity_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('c8bf03da-144d-4fe8-a4dc-75c359028d47', 'f9b73b7a-cd5b-407a-acf6-346de8a2dc6a', '81f272ef-3d6c-41cd-a0cd-251fe7990231', 'specific', 'Fuente oficial del elemento relacionado.')
on conflict (id) do update set source_id = excluded.source_id, entity_id = excluded.entity_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('ac23034f-e334-4f7c-aceb-f636b78d9b69', 'ff2532d8-42df-4e17-a4a0-e982f7aacdc6', 'bcebc2a6-54cc-4c58-a649-b489bc177d5b', 'specific', 'Fuente oficial del elemento relacionado.')
on conflict (id) do update set source_id = excluded.source_id, entity_id = excluded.entity_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('444156c9-432a-4587-a6a0-d85e80303ef3', '5f6f5f0c-7730-40ee-a161-797fd2cb3e28', '45d47ba0-d2cd-44f0-a9b0-863de87938ed', 'specific', 'Fuente oficial del elemento relacionado.')
on conflict (id) do update set source_id = excluded.source_id, entity_id = excluded.entity_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('1bc091c9-0cbe-4636-a032-3647bd4ba68f', '8fa0bedd-5c39-45ee-a73f-d76fb86d66fb', '43491e4a-db27-4221-a512-70bc265f6b66', 'specific', 'Fuente oficial del elemento relacionado.')
on conflict (id) do update set source_id = excluded.source_id, entity_id = excluded.entity_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('34aadc55-16e3-4264-aca5-2332e2e70ee9', 'b1979a73-ac64-4731-a868-9c76c901e434', 'ee6fce46-3185-417e-a0ab-39b2d4ae8bcd', 'specific', 'Fuente oficial del elemento relacionado.')
on conflict (id) do update set source_id = excluded.source_id, entity_id = excluded.entity_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, cult_id, scope, notes)
values ('6e5610b9-c0df-4219-a126-504a3e6df3ae', '694b8200-9a26-45ac-ae13-686e1869e228', '928390e2-bee9-4034-a13e-400e4c8141a0', 'cult', 'Fuente oficial del culto.')
on conflict (id) do update set source_id = excluded.source_id, cult_id = excluded.cult_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, cult_id, scope, notes)
values ('a1a3ffa6-3aa8-4036-af1b-3e5ec90444e5', '694b8200-9a26-45ac-ae13-686e1869e228', '8493b0a0-e13c-45ed-a7f7-b785b69d1720', 'cult', 'Fuente oficial del culto.')
on conflict (id) do update set source_id = excluded.source_id, cult_id = excluded.cult_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, cult_id, scope, notes)
values ('48668008-2063-47fb-aaa9-4aa6e98bf796', 'd25fdea0-8a96-4f39-a800-62fc463ec53d', '97a73835-cf41-49b2-a5cc-70fdd73ffaa1', 'cult', 'Fuente oficial del culto.')
on conflict (id) do update set source_id = excluded.source_id, cult_id = excluded.cult_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, cult_id, scope, notes)
values ('b468ae59-7f0f-4b26-a1d5-b2f7b9a8c09e', 'cd7c2e60-3709-4543-a472-25f942e91669', '2f130e9f-84cf-4595-a6a7-582448b14c51', 'cult', 'Fuente oficial del culto.')
on conflict (id) do update set source_id = excluded.source_id, cult_id = excluded.cult_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, cult_id, scope, notes)
values ('ca49af47-2724-4f2a-a07a-fdd8ba655ad3', 'cd7c2e60-3709-4543-a472-25f942e91669', '05815751-9c2d-4aae-a472-aae7ccc5ba50', 'cult', 'Fuente oficial del culto.')
on conflict (id) do update set source_id = excluded.source_id, cult_id = excluded.cult_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, cult_id, scope, notes)
values ('606bb92f-321e-4cd2-aa2f-cdda3198469f', 'cd7c2e60-3709-4543-a472-25f942e91669', 'd30cabd4-e74c-45eb-a097-b23374ed1b61', 'cult', 'Fuente oficial del culto.')
on conflict (id) do update set source_id = excluded.source_id, cult_id = excluded.cult_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, cult_id, scope, notes)
values ('15d1d235-5376-40e1-a5f2-d6c7e13f7ef9', 'cd7c2e60-3709-4543-a472-25f942e91669', '11460593-40f1-4518-a55f-0baf96bdb609', 'cult', 'Fuente oficial del culto.')
on conflict (id) do update set source_id = excluded.source_id, cult_id = excluded.cult_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, cult_id, scope, notes)
values ('3bbc7abc-3f6d-4131-afaf-5538869e25ae', '3f433ef3-dcff-4d17-a5b3-7f72e6f49570', '54991ac2-f74b-49ed-ae45-0637ff36c80a', 'cult', 'Fuente oficial del culto.')
on conflict (id) do update set source_id = excluded.source_id, cult_id = excluded.cult_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, cult_id, scope, notes)
values ('4158a00d-6519-41ac-a8a4-ee0b9ef46092', '3f433ef3-dcff-4d17-a5b3-7f72e6f49570', 'a972384a-9355-469f-a5eb-bb07e9baf5b5', 'cult', 'Fuente oficial del culto.')
on conflict (id) do update set source_id = excluded.source_id, cult_id = excluded.cult_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, cult_id, scope, notes)
values ('6ac8b754-bb9e-44d5-a901-4e6fe18057fb', '3f433ef3-dcff-4d17-a5b3-7f72e6f49570', '66d37dd1-3342-43a1-ad58-14cd53292c3a', 'cult', 'Fuente oficial del culto.')
on conflict (id) do update set source_id = excluded.source_id, cult_id = excluded.cult_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, cult_id, scope, notes)
values ('dcebea30-6fc4-4eff-a862-32cc732bd53c', '3f433ef3-dcff-4d17-a5b3-7f72e6f49570', 'a1b28515-4198-4c81-a350-58bccbb2f470', 'cult', 'Fuente oficial del culto.')
on conflict (id) do update set source_id = excluded.source_id, cult_id = excluded.cult_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, cult_id, scope, notes)
values ('30af8def-c883-4055-ac97-eaf584dc2c88', '32a71f06-e654-4374-a7de-86fd5f2f870b', '86b4af90-55de-4c65-a6b8-f5cb7bd9e567', 'cult', 'Fuente oficial del culto.')
on conflict (id) do update set source_id = excluded.source_id, cult_id = excluded.cult_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, cult_id, scope, notes)
values ('13b2c82c-7fb2-4c7f-a225-02be45180595', '32a71f06-e654-4374-a7de-86fd5f2f870b', 'dd1db918-27d6-4d3e-a1be-20e08d93a095', 'cult', 'Fuente oficial del culto.')
on conflict (id) do update set source_id = excluded.source_id, cult_id = excluded.cult_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, cult_id, scope, notes)
values ('ee222a5a-8d8a-4343-ac2b-4496a3814e2d', '32a71f06-e654-4374-a7de-86fd5f2f870b', 'bb9c5c51-6612-4f37-a27f-7ff86cd60bb0', 'cult', 'Fuente oficial del culto.')
on conflict (id) do update set source_id = excluded.source_id, cult_id = excluded.cult_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, cult_id, scope, notes)
values ('1a0522c3-df65-40ba-a88e-02c1e93ca007', '32a71f06-e654-4374-a7de-86fd5f2f870b', '8fd625c0-5c3a-41a8-a35c-6e5b8830ba32', 'cult', 'Fuente oficial del culto.')
on conflict (id) do update set source_id = excluded.source_id, cult_id = excluded.cult_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, outing_id, scope, notes)
values ('b020f10c-4543-4d14-a3e5-561e719ce8ae', '694b8200-9a26-45ac-ae13-686e1869e228', 'ab9ae46c-438d-4c47-ac9e-c65aab075ab0', 'outing', 'Fuente oficial de la estación de penitencia.')
on conflict (id) do update set source_id = excluded.source_id, outing_id = excluded.outing_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, outing_id, scope, notes)
values ('42f7453d-a9e6-4ef3-ae54-aeaa98deafdd', '3b8256c9-2367-4967-ad84-d853002cdaca', '9d72eeca-b994-4d49-a4e9-0579f01910dd', 'outing', 'Fuente oficial de la estación de penitencia.')
on conflict (id) do update set source_id = excluded.source_id, outing_id = excluded.outing_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, outing_id, scope, notes)
values ('0eafd26b-8094-4b7e-ac70-603ed33644fb', '3f433ef3-dcff-4d17-a5b3-7f72e6f49570', '3850c8a8-b3d1-4e85-ac9b-26c2f6e078fc', 'outing', 'Fuente oficial de la estación de penitencia.')
on conflict (id) do update set source_id = excluded.source_id, outing_id = excluded.outing_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, outing_id, scope, notes)
values ('156e4136-ad89-4ea5-a2b0-359976ca04f0', 'f7185187-4b02-42c7-a643-1c3dd3111218', 'ef206835-3c75-4979-a4cb-c4c1ff8416de', 'outing', 'Fuente oficial de la estación de penitencia.')
on conflict (id) do update set source_id = excluded.source_id, outing_id = excluded.outing_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('0e5d6cf5-27b1-46d6-a9cd-583fdacdcdfc', '007b2e35-4715-46cd-a6db-53dea6f697b5', '6b7c71bb-46f9-42ce-a548-817a3b7fdde5', 'historical', 'Fuente oficial del acontecimiento histórico.')
on conflict (id) do update set source_id = excluded.source_id, entity_id = excluded.entity_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('2b21b0de-8834-4669-aafc-4efcb6d47237', '007b2e35-4715-46cd-a6db-53dea6f697b5', 'c4139f5e-1d27-44c3-ab93-ad03756f296d', 'historical', 'Fuente oficial del acontecimiento histórico.')
on conflict (id) do update set source_id = excluded.source_id, entity_id = excluded.entity_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('98f1a7d8-9f02-4dc7-ac02-9087a5749cf1', '007b2e35-4715-46cd-a6db-53dea6f697b5', 'bfddd1bb-696f-43c0-a762-518b42231650', 'historical', 'Fuente oficial del acontecimiento histórico.')
on conflict (id) do update set source_id = excluded.source_id, entity_id = excluded.entity_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('31c72908-8b81-4312-ae74-a632fbaffcdb', 'd3ab4156-8e52-443a-a795-d1ef31e103ee', '671fac16-bafb-49d3-a445-2c799d834bce', 'historical', 'Fuente oficial del acontecimiento histórico.')
on conflict (id) do update set source_id = excluded.source_id, entity_id = excluded.entity_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('c5c0ae93-a9f7-4767-a72a-e6034ae94de9', 'd3ab4156-8e52-443a-a795-d1ef31e103ee', '29e57678-0146-472a-a6e9-55f10438bb68', 'historical', 'Fuente oficial del acontecimiento histórico.')
on conflict (id) do update set source_id = excluded.source_id, entity_id = excluded.entity_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('5ce3e710-03ee-455b-a36f-e05661c886be', 'd3ab4156-8e52-443a-a795-d1ef31e103ee', 'ff561b4a-f828-4285-a58a-eb086b8989f2', 'historical', 'Fuente oficial del acontecimiento histórico.')
on conflict (id) do update set source_id = excluded.source_id, entity_id = excluded.entity_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('8e07b4f6-8132-4e07-a6bf-fe5077e706a6', 'd3ab4156-8e52-443a-a795-d1ef31e103ee', 'abacb5ec-eca1-4d1c-afb7-41ce07c17cc4', 'historical', 'Fuente oficial del acontecimiento histórico.')
on conflict (id) do update set source_id = excluded.source_id, entity_id = excluded.entity_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('2adc4629-2e61-4eef-a8c9-6b1c81b31193', 'f006315d-634e-4fdf-a12e-3b8dddd1929a', '6db96898-5051-4b80-aa22-6b1a3b8180c7', 'historical', 'Fuente oficial del acontecimiento histórico.')
on conflict (id) do update set source_id = excluded.source_id, entity_id = excluded.entity_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('76e872af-a22b-4879-a0d2-f8916589df4c', 'f006315d-634e-4fdf-a12e-3b8dddd1929a', 'dcaf13d5-1e60-4e6a-aab4-295133a23b47', 'historical', 'Fuente oficial del acontecimiento histórico.')
on conflict (id) do update set source_id = excluded.source_id, entity_id = excluded.entity_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('a61e8d9a-8562-49b3-af98-5f421ad1332d', 'f006315d-634e-4fdf-a12e-3b8dddd1929a', '1babe565-027a-4007-a837-3a798b9ec798', 'historical', 'Fuente oficial del acontecimiento histórico.')
on conflict (id) do update set source_id = excluded.source_id, entity_id = excluded.entity_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('3594fd59-d1b3-4065-a38d-d25ff17443a2', 'f006315d-634e-4fdf-a12e-3b8dddd1929a', 'a8cd94b7-424d-40dc-a7bb-ee4bf5d4880a', 'historical', 'Fuente oficial del acontecimiento histórico.')
on conflict (id) do update set source_id = excluded.source_id, entity_id = excluded.entity_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('7f2311b0-c1a9-4f70-a73a-e31fb18f8534', 'f006315d-634e-4fdf-a12e-3b8dddd1929a', 'f9ce1568-5a3c-40f2-ab7b-108e463646f2', 'historical', 'Fuente oficial del acontecimiento histórico.')
on conflict (id) do update set source_id = excluded.source_id, entity_id = excluded.entity_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('8179d563-3b08-470a-ad23-40834829d60a', '0e32b8ab-8ea0-47bb-aff5-1608d5352ff0', 'a4b77a6f-ce8d-4169-a280-6d74a36e70cf', 'historical', 'Fuente oficial del acontecimiento histórico.')
on conflict (id) do update set source_id = excluded.source_id, entity_id = excluded.entity_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('2e545b83-a9c2-4559-acd5-f2f155bac540', '0e32b8ab-8ea0-47bb-aff5-1608d5352ff0', '60243b0c-d915-4648-a66c-126830cc75a4', 'historical', 'Fuente oficial del acontecimiento histórico.')
on conflict (id) do update set source_id = excluded.source_id, entity_id = excluded.entity_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('fc365a8a-ae2c-462d-aae3-cc6c9c5109a6', '0e32b8ab-8ea0-47bb-aff5-1608d5352ff0', '969b8e52-ab28-48c7-a647-906eba08834b', 'historical', 'Fuente oficial del acontecimiento histórico.')
on conflict (id) do update set source_id = excluded.source_id, entity_id = excluded.entity_id, scope = excluded.scope, notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('18e4c2d7-cecc-4488-a475-1effaaaa41d6', '0e32b8ab-8ea0-47bb-aff5-1608d5352ff0', 'eab4ff1d-bb90-4d4c-a167-cefe3dd4ac6f', 'historical', 'Fuente oficial del acontecimiento histórico.')
on conflict (id) do update set source_id = excluded.source_id, entity_id = excluded.entity_id, scope = excluded.scope, notes = excluded.notes;

commit;
