-- HC-016 · undécimo contexto real: Divina Misericordia · Rosario de Santiago
-- Receta editorial canónica archivada tras Apply gobernado en producción.
-- Solo DML. No crea tablas, tipos, funciones, políticas ni índices.
-- Base reconciliada: ba4035789c4bfc46bb4af62f70d7ce1ea999f309.
-- Lote principal: 577b05a4-6ae2-42b5-ad22-641e3fbf0602 (162/169).
-- Remate de reutilización Banda de Alcalá: a658a495-7831-4368-ab18-eafb12575454 (5/5).
-- Los dos nodos nuevos fallidos de banda se omiten: se reutiliza la entidad canónica 8e754023-a46a-4587-8952-4696c70d0bd0.

begin;

insert into public.sources (id, name, url, source_type, author_or_publisher, accessed_at, notes)
values ('9ba9a02c-a848-4102-b716-a6d33d1d968c', 'Parroquia de Santiago · Hermandad de la Divina Misericordia', 'https://parroquiasantiagoalcala.es/rosario-de-santiago/', 'Fuente institucional', 'Parroquia de Santiago el Mayor de Alcalá de Guadaíra', '2026-09-13', 'Identidad, sede e historia institucional.')
on conflict (id) do update set
  name = excluded.name,
  url = excluded.url,
  source_type = excluded.source_type,
  author_or_publisher = excluded.author_or_publisher,
  accessed_at = excluded.accessed_at,
  notes = excluded.notes;

insert into public.sources (id, name, url, source_type, author_or_publisher, accessed_at, notes)
values ('04123de3-18e5-47da-9cd8-74cf12db8856', 'Rosario de Santiago · web oficial', 'https://rosariodesantiago.blogspot.com/', 'Web oficial', 'Hermandad de la Divina Misericordia · Rosario de Santiago', '2026-09-13', 'Web institucional y canales oficiales.')
on conflict (id) do update set
  name = excluded.name,
  url = excluded.url,
  source_type = excluded.source_type,
  author_or_publisher = excluded.author_or_publisher,
  accessed_at = excluded.accessed_at,
  notes = excluded.notes;

insert into public.sources (id, name, url, source_type, author_or_publisher, accessed_at, notes)
values ('1eb7891c-3eca-4f83-8f6c-503e9b12ad8e', 'Rosario de Santiago · historia oficial', 'https://rosariodesantiago.blogspot.com/p/historia.html', 'Web oficial', 'Hermandad de la Divina Misericordia · Rosario de Santiago', '2026-09-13', 'Historia documentada desde 1579 y reorganización contemporánea.')
on conflict (id) do update set
  name = excluded.name,
  url = excluded.url,
  source_type = excluded.source_type,
  author_or_publisher = excluded.author_or_publisher,
  accessed_at = excluded.accessed_at,
  notes = excluded.notes;

insert into public.sources (id, name, url, source_type, author_or_publisher, accessed_at, notes)
values ('a7a17be8-0de1-48eb-8345-8e1c008871ea', 'Rosario de Santiago · titulares oficiales', 'https://rosariodesantiago.blogspot.com/p/titulares.html', 'Web oficial', 'Hermandad de la Divina Misericordia · Rosario de Santiago', '2026-09-13', 'Autoría, datación, tipología, dimensiones e iconografía de los cuatro titulares.')
on conflict (id) do update set
  name = excluded.name,
  url = excluded.url,
  source_type = excluded.source_type,
  author_or_publisher = excluded.author_or_publisher,
  accessed_at = excluded.accessed_at,
  notes = excluded.notes;

insert into public.sources (id, name, url, source_type, author_or_publisher, accessed_at, notes)
values ('0fe6ed87-446a-463a-b2c0-4becb56bdc33', 'Consejo de Alcalá · Hermandad de la Divina Misericordia', 'https://www.consejohermandadesalcala.es/hermandad-de-la-divina-misericordia/', 'Fuente institucional', 'Consejo Local de Hermandades y Cofradías de Alcalá de Guadaíra', '2026-09-13', 'Doble carácter, salidas, cultos, titulares, autores, sede, canales e historia.')
on conflict (id) do update set
  name = excluded.name,
  url = excluded.url,
  source_type = excluded.source_type,
  author_or_publisher = excluded.author_or_publisher,
  accessed_at = excluded.accessed_at,
  notes = excluded.notes;

insert into public.sources (id, name, url, source_type, author_or_publisher, accessed_at, notes)
values ('cab4248c-3b30-4c1a-9bb9-6ef225d33c32', 'Semana Santa de Alcalá · Divina Misericordia 2026', 'https://www.ssantadealcala.org/2026/04/sabadosanto-divinamisericordia.html', 'Fuente especializada', 'SSantadeAlcala', '2026-09-13', 'Datos de la estación de penitencia celebrada el 4 de abril de 2026.')
on conflict (id) do update set
  name = excluded.name,
  url = excluded.url,
  source_type = excluded.source_type,
  author_or_publisher = excluded.author_or_publisher,
  accessed_at = excluded.accessed_at,
  notes = excluded.notes;

insert into public.sources (id, name, url, source_type, author_or_publisher, accessed_at, notes)
values ('a9f8470c-c74e-41fc-b04e-b41f5189b733', 'Semana Santa de Alcalá · Rosario de Santiago 2025', 'https://www.ssantadealcala.org/2025/10/salida-rosario-santiago.html', 'Fuente especializada', 'SSantadeAlcala', '2026-09-13', 'Salida de Gloria, recorrido y acompañamiento musical del 5 de octubre de 2025.')
on conflict (id) do update set
  name = excluded.name,
  url = excluded.url,
  source_type = excluded.source_type,
  author_or_publisher = excluded.author_or_publisher,
  accessed_at = excluded.accessed_at,
  notes = excluded.notes;

insert into public.sources (id, name, url, source_type, author_or_publisher, accessed_at, notes)
values ('ae64662b-6e5f-43d5-80bb-9bcf0ee11302', 'Consejo de Alcalá · Rosario de Santiago en el cartel de Glorias 2026', 'https://www.consejohermandadesalcala.es/tag/rosariosantiago/', 'Fuente institucional', 'Consejo Local de Hermandades y Cofradías de Alcalá de Guadaíra', '2026-09-13', 'Cartel de las Glorias alcalareñas de 2026 dedicado a la Virgen del Rosario de Santiago.')
on conflict (id) do update set
  name = excluded.name,
  url = excluded.url,
  source_type = excluded.source_type,
  author_or_publisher = excluded.author_or_publisher,
  accessed_at = excluded.accessed_at,
  notes = excluded.notes;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('4ff33303-55ae-4bfc-a81b-9d72a9e15722', 'brotherhood', 'Hermandad de la Divina Misericordia · Rosario de Santiago', 'divina-misericordia-rosario-santiago-alcala', 'Hermandad dominica de Penitencia y Gloria de Alcalá de Guadaíra, con sede en Santiago el Mayor y cuatro titulares documentados.', 'published')
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.brotherhoods (entity_id, official_name, popular_name, foundation_text, municipality_id, canonical_see_place_id, website_url, instagram_url, brotherhood_types, current_procession_day, history_text, notes)
values ('4ff33303-55ae-4bfc-a81b-9d72a9e15722', 'Dominica Hermandad de Nuestra Señora la Virgen del Rosario y Patriarca Bendito Señor San José y Cofradía de Penitencia de la Divina Misericordia y María Santísima de la Trinidad', 'Divina Misericordia · Rosario de Santiago', 'Antecedentes documentados desde 1579; reorganización desde 2004; Hermandad desde mayo de 2016', 'b1d9fe05-a80a-4cde-9e72-bf4f9647e0a3', 'fba2db1c-6caf-4f98-b893-22048e746690', 'https://rosariodesantiago.blogspot.com/', 'https://www.instagram.com/rosariostgoalcala/', ARRAY['Penitencia', 'Gloria']::text[], 'Sábado Santo', 'La Cofradía del Rosario de Santiago está documentada desde 1579. Tras la destrucción de la primitiva titular en 1936, Manuel Pineda Calderón realizó la actual Virgen del Rosario en 1944. La devoción fue revitalizada desde 2004; la corporación fue erigida como Agrupación Parroquial en 2011 y como Hermandad de Penitencia y Gloria en mayo de 2016. El Señor de la Divina Misericordia fue bendecido en 2011, María Santísima de la Trinidad en 2013 y la primera estación de penitencia con nazarenos tuvo lugar en 2017.', 'Hermandad de doble naturaleza. La Virgen del Rosario procesiona el domingo más cercano al 7 de octubre; San José participa en la procesión del Corpus. María Santísima de la Trinidad aún no procesiona en la estación de penitencia.')
on conflict (entity_id) do update set
  official_name = excluded.official_name,
  popular_name = excluded.popular_name,
  foundation_text = excluded.foundation_text,
  municipality_id = excluded.municipality_id,
  canonical_see_place_id = excluded.canonical_see_place_id,
  website_url = excluded.website_url,
  instagram_url = excluded.instagram_url,
  brotherhood_types = excluded.brotherhood_types,
  current_procession_day = excluded.current_procession_day,
  history_text = excluded.history_text,
  notes = excluded.notes;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('45370864-f7cc-4223-90b9-a38c0d5787de', 'image', 'Santísimo Cristo de la Divina Misericordia', 'santisimo-cristo-divina-misericordia-alcala', 'Conjunto escultórico de Cristo muerto sostenido y elevado por un ángel, obra de Edwin González Solís de 2011.', 'published')
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.images (entity_id, image_type, execution_date_text, current_condition, description, dimensions_text, height_cm, iconography, is_dress_image, current_state_notes)
values ('45370864-f7cc-4223-90b9-a38c0d5787de', 'Grupo escultórico', 'Noviembre de 2011', 'extant', 'Conjunto totalmente anatomizado cuya composición sugiere la aceptación del sacrificio de Cristo y el tránsito hacia la Resurrección.', '220 cm de altura', 220, 'Cristo muerto, con las llagas de la Pasión, sostenido y elevado por un ángel como alegoría del sacrificio redentor.', FALSE, NULL)
on conflict (entity_id) do update set
  image_type = excluded.image_type,
  execution_date_text = excluded.execution_date_text,
  current_condition = excluded.current_condition,
  description = excluded.description,
  dimensions_text = excluded.dimensions_text,
  height_cm = excluded.height_cm,
  iconography = excluded.iconography,
  is_dress_image = excluded.is_dress_image,
  current_state_notes = excluded.current_state_notes;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('50c2e211-343a-45a2-a949-b64a472713e8', 'image', 'Nuestra Señora la Virgen del Rosario de Santiago', 'nuestra-senora-virgen-rosario-santiago-alcala', 'Titular letífica de 1944, obra de Manuel Pineda Calderón, representada de pie con el Niño Jesús.', 'published')
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.images (entity_id, image_type, execution_date_text, current_condition, description, dimensions_text, height_cm, iconography, is_dress_image, current_state_notes)
values ('50c2e211-343a-45a2-a949-b64a472713e8', 'Imagen de candelero con Niño Jesús', 'Mayo de 1944', 'extant', 'Imagen de candelero con pelo tallado; el Niño Jesús, completamente anatomizado, aparece en actitud semisedente y bendiciendo.', '160 cm de altura', 160, 'Virgen de pie con el Niño Jesús en el brazo izquierdo, cetro en la mano derecha, corona, ráfaga y media luna.', TRUE, NULL)
on conflict (entity_id) do update set
  image_type = excluded.image_type,
  execution_date_text = excluded.execution_date_text,
  current_condition = excluded.current_condition,
  description = excluded.description,
  dimensions_text = excluded.dimensions_text,
  height_cm = excluded.height_cm,
  iconography = excluded.iconography,
  is_dress_image = excluded.is_dress_image,
  current_state_notes = excluded.current_state_notes;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('0251ad9c-38f0-477a-b1c8-34341644072f', 'image', 'María Santísima de la Trinidad', 'maria-santisima-trinidad-alcala', 'Dolorosa de vestir realizada por Edwin González Solís en 2013.', 'published')
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.images (entity_id, image_type, execution_date_text, current_condition, description, dimensions_text, height_cm, iconography, is_dress_image, current_state_notes)
values ('0251ad9c-38f0-477a-b1c8-34341644072f', 'Dolorosa de candelero', 'Mayo de 2013', 'extant', 'Imagen de candelero para vestir, de serena y profunda aflicción, con policromía al óleo rica en veladuras.', '170 cm de altura', 170, 'Virgen dolorosa en la muerte del Señor, vinculada espiritualmente al misterio pascual y trinitario.', TRUE, 'Titular vigente que aún no procesiona en la estación de penitencia.')
on conflict (entity_id) do update set
  image_type = excluded.image_type,
  execution_date_text = excluded.execution_date_text,
  current_condition = excluded.current_condition,
  description = excluded.description,
  dimensions_text = excluded.dimensions_text,
  height_cm = excluded.height_cm,
  iconography = excluded.iconography,
  is_dress_image = excluded.is_dress_image,
  current_state_notes = excluded.current_state_notes;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('14b70746-ddb5-41ef-9931-c2ea2d71b308', 'image', 'Patriarca Bendito Señor San José', 'patriarca-bendito-senor-san-jose-alcala', 'Imagen de vestir de San José, obra de David Valenciano Larios de 2008.', 'published')
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.images (entity_id, image_type, execution_date_text, current_condition, description, dimensions_text, height_cm, iconography, is_dress_image, current_state_notes)
values ('14b70746-ddb5-41ef-9931-c2ea2d71b308', 'Imagen de vestir', 'Junio de 2008', 'extant', 'Imagen concebida también para acompañar a la Virgen del Rosario en el Belén parroquial durante la Navidad.', '160 cm de altura', 160, 'San José con vara de azucenas llevando de la mano al Niño Jesús.', TRUE, NULL)
on conflict (entity_id) do update set
  image_type = excluded.image_type,
  execution_date_text = excluded.execution_date_text,
  current_condition = excluded.current_condition,
  description = excluded.description,
  dimensions_text = excluded.dimensions_text,
  height_cm = excluded.height_cm,
  iconography = excluded.iconography,
  is_dress_image = excluded.is_dress_image,
  current_state_notes = excluded.current_state_notes;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('34989235-7315-4b98-b56d-88493d006592', 'agent', 'Edwin González Solís', 'edwin-gonzalez-solis', 'Escultor autor del Santísimo Cristo de la Divina Misericordia y de María Santísima de la Trinidad de Alcalá de Guadaíra.', 'published')
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.agents (entity_id, agent_kind, municipality_id, description)
values ('34989235-7315-4b98-b56d-88493d006592', 'person', 'b1d9fe05-a80a-4cde-9e72-bf4f9647e0a3', 'Escultor autor del Santísimo Cristo de la Divina Misericordia y de María Santísima de la Trinidad de Alcalá de Guadaíra.')
on conflict (entity_id) do update set
  agent_kind = excluded.agent_kind,
  municipality_id = excluded.municipality_id,
  description = excluded.description;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('cd61bdba-9e20-465f-a32c-44a0870f4b32', 'agent', 'Manuel Pineda Calderón', 'manuel-pineda-calderon', 'Imaginero autor de Nuestra Señora la Virgen del Rosario de Santiago en 1944.', 'published')
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.agents (entity_id, agent_kind, municipality_id, description)
values ('cd61bdba-9e20-465f-a32c-44a0870f4b32', 'person', 'b1d9fe05-a80a-4cde-9e72-bf4f9647e0a3', 'Imaginero autor de Nuestra Señora la Virgen del Rosario de Santiago en 1944.')
on conflict (entity_id) do update set
  agent_kind = excluded.agent_kind,
  municipality_id = excluded.municipality_id,
  description = excluded.description;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('4f17463e-33d9-4a7f-b7af-8a1e56560946', 'agent', 'David Valenciano Larios', 'david-valenciano-larios', 'Escultor autor de la imagen del Patriarca Bendito Señor San José en 2008.', 'published')
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.agents (entity_id, agent_kind, municipality_id, description)
values ('4f17463e-33d9-4a7f-b7af-8a1e56560946', 'person', 'b1d9fe05-a80a-4cde-9e72-bf4f9647e0a3', 'Escultor autor de la imagen del Patriarca Bendito Señor San José en 2008.')
on conflict (entity_id) do update set
  agent_kind = excluded.agent_kind,
  municipality_id = excluded.municipality_id,
  description = excluded.description;

insert into public.image_authorships (id, image_entity_id, agent_entity_id, authorship_type, role_name, date_from_text, certainty, notes, status)
values ('aab3525d-df51-4ad9-a56c-6b4c22fd8097', '45370864-f7cc-4223-90b9-a38c0d5787de', '34989235-7315-4b98-b56d-88493d006592', 'author', 'Autor', 'Noviembre de 2011', 'documented', 'Autoría y datación publicadas por la Hermandad.', 'published')
on conflict (id) do update set
  image_entity_id = excluded.image_entity_id,
  agent_entity_id = excluded.agent_entity_id,
  authorship_type = excluded.authorship_type,
  role_name = excluded.role_name,
  date_from_text = excluded.date_from_text,
  certainty = excluded.certainty,
  notes = excluded.notes,
  status = excluded.status;

insert into public.image_authorships (id, image_entity_id, agent_entity_id, authorship_type, role_name, date_from_text, certainty, notes, status)
values ('27ccb55c-d306-4f61-a7a3-5bc20855fd84', '50c2e211-343a-45a2-a949-b64a472713e8', 'cd61bdba-9e20-465f-a32c-44a0870f4b32', 'author', 'Autor', 'Mayo de 1944', 'documented', 'Autoría y datación publicadas por la Hermandad.', 'published')
on conflict (id) do update set
  image_entity_id = excluded.image_entity_id,
  agent_entity_id = excluded.agent_entity_id,
  authorship_type = excluded.authorship_type,
  role_name = excluded.role_name,
  date_from_text = excluded.date_from_text,
  certainty = excluded.certainty,
  notes = excluded.notes,
  status = excluded.status;

insert into public.image_authorships (id, image_entity_id, agent_entity_id, authorship_type, role_name, date_from_text, certainty, notes, status)
values ('0bc8371f-adc0-40b1-893f-860c2f6437f6', '0251ad9c-38f0-477a-b1c8-34341644072f', '34989235-7315-4b98-b56d-88493d006592', 'author', 'Autor', 'Mayo de 2013', 'documented', 'Autoría y datación publicadas por la Hermandad.', 'published')
on conflict (id) do update set
  image_entity_id = excluded.image_entity_id,
  agent_entity_id = excluded.agent_entity_id,
  authorship_type = excluded.authorship_type,
  role_name = excluded.role_name,
  date_from_text = excluded.date_from_text,
  certainty = excluded.certainty,
  notes = excluded.notes,
  status = excluded.status;

insert into public.image_authorships (id, image_entity_id, agent_entity_id, authorship_type, role_name, date_from_text, certainty, notes, status)
values ('32bef13b-f4da-4ebe-87a4-de35aaef5349', '14b70746-ddb5-41ef-9931-c2ea2d71b308', '4f17463e-33d9-4a7f-b7af-8a1e56560946', 'author', 'Autor', 'Junio de 2008', 'documented', 'Autoría y datación publicadas por la Hermandad.', 'published')
on conflict (id) do update set
  image_entity_id = excluded.image_entity_id,
  agent_entity_id = excluded.agent_entity_id,
  authorship_type = excluded.authorship_type,
  role_name = excluded.role_name,
  date_from_text = excluded.date_from_text,
  certainty = excluded.certainty,
  notes = excluded.notes,
  status = excluded.status;

insert into public.brotherhood_images (id, brotherhood_entity_id, image_entity_id, relation_type, date_from_text, notes, status)
values ('376826ff-6555-407b-a08b-3899b4ead757', '4ff33303-55ae-4bfc-a81b-9d72a9e15722', '45370864-f7cc-4223-90b9-a38c0d5787de', 'titular', 'Titularidad vigente en 2026', 'Titular vigente de la corporación.', 'published')
on conflict (id) do update set
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  image_entity_id = excluded.image_entity_id,
  relation_type = excluded.relation_type,
  date_from_text = excluded.date_from_text,
  notes = excluded.notes,
  status = excluded.status;

insert into public.brotherhood_images (id, brotherhood_entity_id, image_entity_id, relation_type, date_from_text, notes, status)
values ('3fd61165-9518-4c77-9d84-0c9b6e44bbcf', '4ff33303-55ae-4bfc-a81b-9d72a9e15722', '50c2e211-343a-45a2-a949-b64a472713e8', 'titular', 'Titularidad vigente en 2026', 'Titular vigente de la corporación.', 'published')
on conflict (id) do update set
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  image_entity_id = excluded.image_entity_id,
  relation_type = excluded.relation_type,
  date_from_text = excluded.date_from_text,
  notes = excluded.notes,
  status = excluded.status;

insert into public.brotherhood_images (id, brotherhood_entity_id, image_entity_id, relation_type, date_from_text, notes, status)
values ('54a05d09-f222-4c93-9eee-dd18833b1ca5', '4ff33303-55ae-4bfc-a81b-9d72a9e15722', '0251ad9c-38f0-477a-b1c8-34341644072f', 'titular', 'Titularidad vigente en 2026', 'Titular dolorosa que todavía no procesiona en la estación de penitencia.', 'published')
on conflict (id) do update set
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  image_entity_id = excluded.image_entity_id,
  relation_type = excluded.relation_type,
  date_from_text = excluded.date_from_text,
  notes = excluded.notes,
  status = excluded.status;

insert into public.brotherhood_images (id, brotherhood_entity_id, image_entity_id, relation_type, date_from_text, notes, status)
values ('e24bc1de-4040-4247-a90d-eb83bb123ea8', '4ff33303-55ae-4bfc-a81b-9d72a9e15722', '14b70746-ddb5-41ef-9931-c2ea2d71b308', 'titular', 'Titularidad vigente en 2026', 'Titular vigente de la corporación.', 'published')
on conflict (id) do update set
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  image_entity_id = excluded.image_entity_id,
  relation_type = excluded.relation_type,
  date_from_text = excluded.date_from_text,
  notes = excluded.notes,
  status = excluded.status;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('44756bb8-50b6-49b5-92ec-ee7adc748afe', 'step', 'Paso del Santísimo Cristo de la Divina Misericordia', 'paso-santisimo-cristo-divina-misericordia-alcala', 'Paso procesional del conjunto de la Divina Misericordia en la estación de penitencia del Sábado Santo.', 'published')
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.steps (entity_id, step_type, description, current_state_notes)
values ('44756bb8-50b6-49b5-92ec-ee7adc748afe', 'Paso procesional de misterio', 'Paso que porta al Santísimo Cristo de la Divina Misericordia, sostenido por un ángel, en la estación de penitencia.', 'Procesionó en la estación de penitencia del 4 de abril de 2026.')
on conflict (entity_id) do update set
  step_type = excluded.step_type,
  description = excluded.description,
  current_state_notes = excluded.current_state_notes;

insert into public.steps (entity_id, step_type, description, current_state_notes)
values ('86142714-0de4-479f-89ed-b588adfb99a1', 'Paso procesional de Gloria', 'Paso que porta a Nuestra Señora la Virgen del Rosario de Santiago en su procesión de Gloria del domingo más cercano al 7 de octubre.', 'Documentado en la salida celebrada el 5 de octubre de 2025.')
on conflict (entity_id) do update set
  step_type = excluded.step_type,
  description = excluded.description,
  current_state_notes = excluded.current_state_notes;

insert into public.brotherhood_steps (id, brotherhood_entity_id, step_entity_id, relation_type, date_from_text, notes, status)
values ('8ca24b8e-3cdf-43d4-bd04-75f2084a2a09', '4ff33303-55ae-4bfc-a81b-9d72a9e15722', '44756bb8-50b6-49b5-92ec-ee7adc748afe', 'processional_step', 'Vigente en 2026', 'Paso único de la estación de penitencia de 2026.', 'published')
on conflict (id) do update set
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  step_entity_id = excluded.step_entity_id,
  relation_type = excluded.relation_type,
  date_from_text = excluded.date_from_text,
  notes = excluded.notes,
  status = excluded.status;

insert into public.image_steps (id, image_entity_id, step_entity_id, relation_type, date_from_text, notes, status)
values ('38cfe36b-050a-4d3e-87da-9db712e94833', '45370864-f7cc-4223-90b9-a38c0d5787de', '44756bb8-50b6-49b5-92ec-ee7adc748afe', 'processes_on', 'Vigente en 2026', 'El conjunto de la Divina Misericordia preside el paso de la estación de penitencia.', 'published')
on conflict (id) do update set
  image_entity_id = excluded.image_entity_id,
  step_entity_id = excluded.step_entity_id,
  relation_type = excluded.relation_type,
  date_from_text = excluded.date_from_text,
  notes = excluded.notes,
  status = excluded.status;

insert into public.image_steps (id, image_entity_id, step_entity_id, relation_type, date_from_text, notes, status)
values ('7439cc34-3485-4de7-9569-4990eb9d89c2', '50c2e211-343a-45a2-a949-b64a472713e8', '86142714-0de4-479f-89ed-b588adfb99a1', 'processes_on', 'Documentado en 2025', 'La Virgen del Rosario presidió este paso en la salida de Gloria del 5 de octubre de 2025.', 'published')
on conflict (id) do update set
  image_entity_id = excluded.image_entity_id,
  step_entity_id = excluded.step_entity_id,
  relation_type = excluded.relation_type,
  date_from_text = excluded.date_from_text,
  notes = excluded.notes,
  status = excluded.status;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('7d0aa85b-b657-4ca2-9846-1dc4f8f11c74', 'band', 'Capilla Musical Dulce Nombre', 'capilla-musical-dulce-nombre-alcala', 'Formación de capilla que acompañó al Santísimo Cristo de la Divina Misericordia en 2026.', 'published')
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.bands (entity_id, band_type, municipality_id, description)
values ('7d0aa85b-b657-4ca2-9846-1dc4f8f11c74', 'Capilla Musical', 'b1d9fe05-a80a-4cde-9e72-bf4f9647e0a3', 'Formación de capilla que acompañó al Santísimo Cristo de la Divina Misericordia en 2026.')
on conflict (entity_id) do update set
  band_type = excluded.band_type,
  municipality_id = excluded.municipality_id,
  description = excluded.description;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('4c0f1466-35b5-4287-9125-7ef8c534184b', 'band', 'Escolanía de María Santísima de la Trinidad', 'escolania-maria-santisima-trinidad-alcala', 'Escolanía que acompañó al Santísimo Cristo de la Divina Misericordia en 2026.', 'published')
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.bands (entity_id, band_type, municipality_id, description)
values ('4c0f1466-35b5-4287-9125-7ef8c534184b', 'Escolanía', 'b1d9fe05-a80a-4cde-9e72-bf4f9647e0a3', 'Escolanía que acompañó al Santísimo Cristo de la Divina Misericordia en 2026.')
on conflict (entity_id) do update set
  band_type = excluded.band_type,
  municipality_id = excluded.municipality_id,
  description = excluded.description;

insert into public.music_accompaniment_periods (id, brotherhood_entity_id, band_entity_id, step_entity_id, position, outing_type, year_from, date_from_text, is_current, notes, status)
values ('75bb321a-6a40-4910-9cd0-847405838eba', '4ff33303-55ae-4bfc-a81b-9d72a9e15722', '7d0aa85b-b657-4ca2-9846-1dc4f8f11c74', '44756bb8-50b6-49b5-92ec-ee7adc748afe', 'Acompañamiento del paso', 'Estación de penitencia', 2026, 'Confirmado para la estación de penitencia de 2026', TRUE, 'Vigencia confirmada para 2026; no se infiere continuidad posterior.', 'published')
on conflict (id) do update set
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  band_entity_id = excluded.band_entity_id,
  step_entity_id = excluded.step_entity_id,
  position = excluded.position,
  outing_type = excluded.outing_type,
  year_from = excluded.year_from,
  date_from_text = excluded.date_from_text,
  is_current = excluded.is_current,
  notes = excluded.notes,
  status = excluded.status;

insert into public.music_accompaniment_periods (id, brotherhood_entity_id, band_entity_id, step_entity_id, position, outing_type, year_from, date_from_text, is_current, notes, status)
values ('e866293e-dabc-4aef-a6d5-797bbd136ebd', '4ff33303-55ae-4bfc-a81b-9d72a9e15722', '4c0f1466-35b5-4287-9125-7ef8c534184b', '44756bb8-50b6-49b5-92ec-ee7adc748afe', 'Acompañamiento del paso', 'Estación de penitencia', 2026, 'Confirmado para la estación de penitencia de 2026', TRUE, 'Vigencia confirmada para 2026; no se infiere continuidad posterior.', 'published')
on conflict (id) do update set
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  band_entity_id = excluded.band_entity_id,
  step_entity_id = excluded.step_entity_id,
  position = excluded.position,
  outing_type = excluded.outing_type,
  year_from = excluded.year_from,
  date_from_text = excluded.date_from_text,
  is_current = excluded.is_current,
  notes = excluded.notes,
  status = excluded.status;

insert into public.brotherhood_habits (id, brotherhood_entity_id, name, tunic_description, hood_description, cord_description, footwear_description, sort_order, notes, status)
values ('b5e229bf-96f8-4583-99af-fd43a155e0ea', '4ff33303-55ae-4bfc-a81b-9d72a9e15722', 'Hábito de nazareno', 'Túnica blanca.', 'Antifaz negro.', 'Cinturón de cuero negro.', 'Sandalias negras.', 10, 'Descripción vigente en la estación de penitencia de 2026.', 'published')
on conflict (id) do update set
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  name = excluded.name,
  tunic_description = excluded.tunic_description,
  hood_description = excluded.hood_description,
  cord_description = excluded.cord_description,
  footwear_description = excluded.footwear_description,
  sort_order = excluded.sort_order,
  notes = excluded.notes,
  status = excluded.status;

insert into public.brotherhood_procession_stats (id, brotherhood_entity_id, year, procession_date, procession_day, nazarenos_count, total_nazarenos_count, musical_accompaniment_count, departure_time, entrance_time, source_id, status, notes)
values ('9e758d5f-837b-4799-8bf2-9fec3bbbb18e', '4ff33303-55ae-4bfc-a81b-9d72a9e15722', 2026, '2026-04-04', 'Sábado Santo', 60, 60, 2, '19:00', '22:15', 'cab4248c-3b30-4c1a-9bb9-6ef225d33c32', 'published', 'Datos publicados para la estación de penitencia de 2026.')
on conflict (id) do update set
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  year = excluded.year,
  procession_date = excluded.procession_date,
  procession_day = excluded.procession_day,
  nazarenos_count = excluded.nazarenos_count,
  total_nazarenos_count = excluded.total_nazarenos_count,
  musical_accompaniment_count = excluded.musical_accompaniment_count,
  departure_time = excluded.departure_time,
  entrance_time = excluded.entrance_time,
  source_id = excluded.source_id,
  status = excluded.status,
  notes = excluded.notes;

insert into public.cults (id, brotherhood_entity_id, image_entity_id, cult_type, title, date_rule, month, place_id, description, status, is_recurring, recurrence_label, display_order, notes)
values ('d3d7029f-5dfd-428a-94ec-eba96f20191d', '4ff33303-55ae-4bfc-a81b-9d72a9e15722', '45370864-f7cc-4223-90b9-a38c0d5787de', 'Triduo', 'Triduo al Santísimo Cristo de la Divina Misericordia', 'Durante la Cuaresma', NULL, 'fba2db1c-6caf-4f98-b893-22048e746690', 'Triduo cuaresmal en honor del Señor.', 'published', TRUE, 'Anual', 10, 'Culto principal documentado por el Consejo Local de Hermandades.')
on conflict (id) do update set
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  image_entity_id = excluded.image_entity_id,
  cult_type = excluded.cult_type,
  title = excluded.title,
  date_rule = excluded.date_rule,
  month = excluded.month,
  place_id = excluded.place_id,
  description = excluded.description,
  status = excluded.status,
  is_recurring = excluded.is_recurring,
  recurrence_label = excluded.recurrence_label,
  display_order = excluded.display_order,
  notes = excluded.notes;

insert into public.cult_entities (id, cult_id, entity_id, role, notes)
values ('d7e8c5b7-dab1-4b22-a5a4-5b7c3d991a36', 'd3d7029f-5dfd-428a-94ec-eba96f20191d', '45370864-f7cc-4223-90b9-a38c0d5787de', 'Titular del culto', 'Titular expresamente vinculada al culto principal.')
on conflict (id) do update set
  cult_id = excluded.cult_id,
  entity_id = excluded.entity_id,
  role = excluded.role,
  notes = excluded.notes;

insert into public.cults (id, brotherhood_entity_id, image_entity_id, cult_type, title, date_rule, month, place_id, description, status, is_recurring, recurrence_label, display_order, notes)
values ('41daf2b0-ea94-4e6f-a1ce-dda5f93082f4', '4ff33303-55ae-4bfc-a81b-9d72a9e15722', '45370864-f7cc-4223-90b9-a38c0d5787de', 'Función Solemne', 'Función Solemne al Santísimo Cristo de la Divina Misericordia', 'Durante la Cuaresma', NULL, 'fba2db1c-6caf-4f98-b893-22048e746690', 'Función solemne cuaresmal en honor del Señor.', 'published', TRUE, 'Anual', 20, 'Culto principal documentado por el Consejo Local de Hermandades.')
on conflict (id) do update set
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  image_entity_id = excluded.image_entity_id,
  cult_type = excluded.cult_type,
  title = excluded.title,
  date_rule = excluded.date_rule,
  month = excluded.month,
  place_id = excluded.place_id,
  description = excluded.description,
  status = excluded.status,
  is_recurring = excluded.is_recurring,
  recurrence_label = excluded.recurrence_label,
  display_order = excluded.display_order,
  notes = excluded.notes;

insert into public.cult_entities (id, cult_id, entity_id, role, notes)
values ('d68a8e36-501d-4d57-9b22-6b0ed7e5108b', '41daf2b0-ea94-4e6f-a1ce-dda5f93082f4', '45370864-f7cc-4223-90b9-a38c0d5787de', 'Titular del culto', 'Titular expresamente vinculada al culto principal.')
on conflict (id) do update set
  cult_id = excluded.cult_id,
  entity_id = excluded.entity_id,
  role = excluded.role,
  notes = excluded.notes;

insert into public.cults (id, brotherhood_entity_id, image_entity_id, cult_type, title, date_rule, month, place_id, description, status, is_recurring, recurrence_label, display_order, notes)
values ('89f83f86-0edf-40a4-8d79-d93851725c4b', '4ff33303-55ae-4bfc-a81b-9d72a9e15722', '45370864-f7cc-4223-90b9-a38c0d5787de', 'Veneración', 'Veneración al Señor de la Divina Misericordia y María Santísima de la Trinidad', 'Durante los cultos cuaresmales', NULL, 'fba2db1c-6caf-4f98-b893-22048e746690', 'Veneración conjunta al Señor y a la Dolorosa.', 'published', TRUE, 'Anual', 30, 'Culto principal documentado por el Consejo Local de Hermandades.')
on conflict (id) do update set
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  image_entity_id = excluded.image_entity_id,
  cult_type = excluded.cult_type,
  title = excluded.title,
  date_rule = excluded.date_rule,
  month = excluded.month,
  place_id = excluded.place_id,
  description = excluded.description,
  status = excluded.status,
  is_recurring = excluded.is_recurring,
  recurrence_label = excluded.recurrence_label,
  display_order = excluded.display_order,
  notes = excluded.notes;

insert into public.cult_entities (id, cult_id, entity_id, role, notes)
values ('49d56361-fa00-4103-9806-e845dbb8d561', '89f83f86-0edf-40a4-8d79-d93851725c4b', '45370864-f7cc-4223-90b9-a38c0d5787de', 'Titular del culto', 'Titular expresamente vinculada al culto principal.')
on conflict (id) do update set
  cult_id = excluded.cult_id,
  entity_id = excluded.entity_id,
  role = excluded.role,
  notes = excluded.notes;

insert into public.cults (id, brotherhood_entity_id, image_entity_id, cult_type, title, date_rule, month, place_id, description, status, is_recurring, recurrence_label, display_order, notes)
values ('e3ddea98-2325-42ef-b255-e64e5c471b2c', '4ff33303-55ae-4bfc-a81b-9d72a9e15722', '50c2e211-343a-45a2-a949-b64a472713e8', 'Triduo', 'Triduo a Nuestra Señora la Virgen del Rosario', 'En fechas previas al domingo más cercano al 7 de octubre', 10, 'fba2db1c-6caf-4f98-b893-22048e746690', 'Triduo en honor de la titular letífica.', 'published', TRUE, 'Anual', 40, 'Culto principal documentado por el Consejo Local de Hermandades.')
on conflict (id) do update set
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  image_entity_id = excluded.image_entity_id,
  cult_type = excluded.cult_type,
  title = excluded.title,
  date_rule = excluded.date_rule,
  month = excluded.month,
  place_id = excluded.place_id,
  description = excluded.description,
  status = excluded.status,
  is_recurring = excluded.is_recurring,
  recurrence_label = excluded.recurrence_label,
  display_order = excluded.display_order,
  notes = excluded.notes;

insert into public.cult_entities (id, cult_id, entity_id, role, notes)
values ('499637ea-7fe2-4a84-86b7-76c9b86a1b65', 'e3ddea98-2325-42ef-b255-e64e5c471b2c', '50c2e211-343a-45a2-a949-b64a472713e8', 'Titular del culto', 'Titular expresamente vinculada al culto principal.')
on conflict (id) do update set
  cult_id = excluded.cult_id,
  entity_id = excluded.entity_id,
  role = excluded.role,
  notes = excluded.notes;

insert into public.cults (id, brotherhood_entity_id, image_entity_id, cult_type, title, date_rule, month, place_id, description, status, is_recurring, recurrence_label, display_order, notes)
values ('6a13c990-9a16-4cb6-900c-d6a5d80c0e5b', '4ff33303-55ae-4bfc-a81b-9d72a9e15722', '50c2e211-343a-45a2-a949-b64a472713e8', 'Función Principal', 'Función Principal de Instituto de Nuestra Señora la Virgen del Rosario', 'Domingo más cercano al 7 de octubre', 10, 'fba2db1c-6caf-4f98-b893-22048e746690', 'Función Principal de Instituto con Protestación de Fe.', 'published', TRUE, 'Anual', 50, 'Culto principal documentado por el Consejo Local de Hermandades.')
on conflict (id) do update set
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  image_entity_id = excluded.image_entity_id,
  cult_type = excluded.cult_type,
  title = excluded.title,
  date_rule = excluded.date_rule,
  month = excluded.month,
  place_id = excluded.place_id,
  description = excluded.description,
  status = excluded.status,
  is_recurring = excluded.is_recurring,
  recurrence_label = excluded.recurrence_label,
  display_order = excluded.display_order,
  notes = excluded.notes;

insert into public.cult_entities (id, cult_id, entity_id, role, notes)
values ('77dba28a-b341-44e1-bddf-c9e386635493', '6a13c990-9a16-4cb6-900c-d6a5d80c0e5b', '50c2e211-343a-45a2-a949-b64a472713e8', 'Titular del culto', 'Titular expresamente vinculada al culto principal.')
on conflict (id) do update set
  cult_id = excluded.cult_id,
  entity_id = excluded.entity_id,
  role = excluded.role,
  notes = excluded.notes;

insert into public.cults (id, brotherhood_entity_id, image_entity_id, cult_type, title, date_rule, month, place_id, description, status, is_recurring, recurrence_label, display_order, notes)
values ('cca09a90-3eb2-4eda-b44f-f7aecb46f422', '4ff33303-55ae-4bfc-a81b-9d72a9e15722', '50c2e211-343a-45a2-a949-b64a472713e8', 'Veneración y Santa Misa', 'Veneración y Santa Misa de la festividad de Nuestra Señora del Rosario', '7 de octubre', 10, 'fba2db1c-6caf-4f98-b893-22048e746690', 'Veneración y Santa Misa en la festividad litúrgica de Nuestra Señora del Rosario.', 'published', TRUE, 'Anual', 60, 'Culto principal documentado por el Consejo Local de Hermandades.')
on conflict (id) do update set
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  image_entity_id = excluded.image_entity_id,
  cult_type = excluded.cult_type,
  title = excluded.title,
  date_rule = excluded.date_rule,
  month = excluded.month,
  place_id = excluded.place_id,
  description = excluded.description,
  status = excluded.status,
  is_recurring = excluded.is_recurring,
  recurrence_label = excluded.recurrence_label,
  display_order = excluded.display_order,
  notes = excluded.notes;

insert into public.cult_entities (id, cult_id, entity_id, role, notes)
values ('9c32a8cd-e05d-4df1-aa3b-79a478133d4a', 'cca09a90-3eb2-4eda-b44f-f7aecb46f422', '50c2e211-343a-45a2-a949-b64a472713e8', 'Titular del culto', 'Titular expresamente vinculada al culto principal.')
on conflict (id) do update set
  cult_id = excluded.cult_id,
  entity_id = excluded.entity_id,
  role = excluded.role,
  notes = excluded.notes;

insert into public.cults (id, brotherhood_entity_id, image_entity_id, cult_type, title, date_rule, month, place_id, description, status, is_recurring, recurrence_label, display_order, notes)
values ('d733e1bf-a591-495b-9dac-a6b4919bd0b9', '4ff33303-55ae-4bfc-a81b-9d72a9e15722', '14b70746-ddb5-41ef-9931-c2ea2d71b308', 'Función Solemne', 'Función en honor del Patriarca Bendito Señor San José', '19 de marzo', 3, 'fba2db1c-6caf-4f98-b893-22048e746690', 'Función en honor de San José en su festividad.', 'published', TRUE, 'Anual', 70, 'Culto principal documentado por el Consejo Local de Hermandades.')
on conflict (id) do update set
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  image_entity_id = excluded.image_entity_id,
  cult_type = excluded.cult_type,
  title = excluded.title,
  date_rule = excluded.date_rule,
  month = excluded.month,
  place_id = excluded.place_id,
  description = excluded.description,
  status = excluded.status,
  is_recurring = excluded.is_recurring,
  recurrence_label = excluded.recurrence_label,
  display_order = excluded.display_order,
  notes = excluded.notes;

insert into public.cult_entities (id, cult_id, entity_id, role, notes)
values ('30fa08de-12df-49df-b39f-4d8d5fcf5522', 'd733e1bf-a591-495b-9dac-a6b4919bd0b9', '14b70746-ddb5-41ef-9931-c2ea2d71b308', 'Titular del culto', 'Titular expresamente vinculada al culto principal.')
on conflict (id) do update set
  cult_id = excluded.cult_id,
  entity_id = excluded.entity_id,
  role = excluded.role,
  notes = excluded.notes;

insert into public.cults (id, brotherhood_entity_id, image_entity_id, cult_type, title, date_rule, month, place_id, description, status, is_recurring, recurrence_label, display_order, notes)
values ('c5c2b731-9788-4bd3-9f8e-0ec10f414cff', '4ff33303-55ae-4bfc-a81b-9d72a9e15722', '0251ad9c-38f0-477a-b1c8-34341644072f', 'Vigilia', 'Vigilia en honor de María Santísima de la Trinidad', 'Víspera del Domingo de la Santísima Trinidad', NULL, 'fba2db1c-6caf-4f98-b893-22048e746690', 'Vigilia en honor de la Dolorosa.', 'published', TRUE, 'Anual', 80, 'Culto principal documentado por el Consejo Local de Hermandades.')
on conflict (id) do update set
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  image_entity_id = excluded.image_entity_id,
  cult_type = excluded.cult_type,
  title = excluded.title,
  date_rule = excluded.date_rule,
  month = excluded.month,
  place_id = excluded.place_id,
  description = excluded.description,
  status = excluded.status,
  is_recurring = excluded.is_recurring,
  recurrence_label = excluded.recurrence_label,
  display_order = excluded.display_order,
  notes = excluded.notes;

insert into public.cult_entities (id, cult_id, entity_id, role, notes)
values ('da3c75a9-41f0-4cca-acea-fffba786bb74', 'c5c2b731-9788-4bd3-9f8e-0ec10f414cff', '0251ad9c-38f0-477a-b1c8-34341644072f', 'Titular del culto', 'Titular expresamente vinculada al culto principal.')
on conflict (id) do update set
  cult_id = excluded.cult_id,
  entity_id = excluded.entity_id,
  role = excluded.role,
  notes = excluded.notes;

insert into public.cults (id, brotherhood_entity_id, image_entity_id, cult_type, title, date_rule, month, place_id, description, status, is_recurring, recurrence_label, display_order, notes)
values ('ae267238-0832-490a-9778-9c5a49d11e93', '4ff33303-55ae-4bfc-a81b-9d72a9e15722', '0251ad9c-38f0-477a-b1c8-34341644072f', 'Función Solemne', 'Función en honor de María Santísima de la Trinidad', 'Domingo de la Santísima Trinidad, siguiente a Pentecostés', NULL, 'fba2db1c-6caf-4f98-b893-22048e746690', 'Función en honor de la Virgen de la Trinidad.', 'published', TRUE, 'Anual', 90, 'Culto principal documentado por el Consejo Local de Hermandades.')
on conflict (id) do update set
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  image_entity_id = excluded.image_entity_id,
  cult_type = excluded.cult_type,
  title = excluded.title,
  date_rule = excluded.date_rule,
  month = excluded.month,
  place_id = excluded.place_id,
  description = excluded.description,
  status = excluded.status,
  is_recurring = excluded.is_recurring,
  recurrence_label = excluded.recurrence_label,
  display_order = excluded.display_order,
  notes = excluded.notes;

insert into public.cult_entities (id, cult_id, entity_id, role, notes)
values ('c8370457-86e4-40fc-9d9f-dbd393869458', 'ae267238-0832-490a-9778-9c5a49d11e93', '0251ad9c-38f0-477a-b1c8-34341644072f', 'Titular del culto', 'Titular expresamente vinculada al culto principal.')
on conflict (id) do update set
  cult_id = excluded.cult_id,
  entity_id = excluded.entity_id,
  role = excluded.role,
  notes = excluded.notes;

insert into public.cult_entities (id, cult_id, entity_id, role, notes)
values ('15c1f756-0811-4e2b-ad1a-341e154f19c8', '89f83f86-0edf-40a4-8d79-d93851725c4b', '0251ad9c-38f0-477a-b1c8-34341644072f', 'Titular venerada', 'La veneración cuaresmal comprende también a María Santísima de la Trinidad.')
on conflict (id) do update set
  cult_id = excluded.cult_id,
  entity_id = excluded.entity_id,
  role = excluded.role,
  notes = excluded.notes;

insert into public.outings (id, brotherhood_entity_id, outing_type, character, title, outing_date, year, departure_time, return_time, municipality_id, origin_place_id, destination_place_id, reason, description, route_summary, event_status, status, slug, origin_text, destination_text)
values ('ffa686ad-7f22-4b89-b995-109e54662162', '4ff33303-55ae-4bfc-a81b-9d72a9e15722', 'Estación de penitencia', 'ordinary', 'Estación de penitencia de la Divina Misericordia 2026', '2026-04-04', 2026, '19:00', '22:15', 'b1d9fe05-a80a-4cde-9e72-bf4f9647e0a3', 'fba2db1c-6caf-4f98-b893-22048e746690', 'fba2db1c-6caf-4f98-b893-22048e746690', 'Estación de penitencia del Sábado Santo', 'Estación de penitencia celebrada con el Santísimo Cristo de la Divina Misericordia.', 'Plaza del Derribo, Herreros, Ayuntamiento, Nuestra Señora del Águila, Juan Abad, Sor Catalina, Conde de Guadalhorce, Madueño de los Aires, Plaza de la Plazuela, Carrera Oficial, Gutiérrez de Alba, Pérez Galdós, Plaza del Paraíso, La Plata, Plaza de Cervantes, Pescadería, Menéndez Pelayo, Coracha, Fernán Gutiérrez y Plaza del Derribo.', 'held', 'published', 'estacion-penitencia-divina-misericordia-alcala-2026', 'Parroquia de Santiago el Mayor', 'Parroquia de Santiago el Mayor')
on conflict (id) do update set
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  outing_type = excluded.outing_type,
  character = excluded.character,
  title = excluded.title,
  outing_date = excluded.outing_date,
  year = excluded.year,
  departure_time = excluded.departure_time,
  return_time = excluded.return_time,
  municipality_id = excluded.municipality_id,
  origin_place_id = excluded.origin_place_id,
  destination_place_id = excluded.destination_place_id,
  reason = excluded.reason,
  description = excluded.description,
  route_summary = excluded.route_summary,
  event_status = excluded.event_status,
  status = excluded.status,
  slug = excluded.slug,
  origin_text = excluded.origin_text,
  destination_text = excluded.destination_text;

insert into public.outings (id, brotherhood_entity_id, outing_type, character, title, outing_date, year, departure_time, return_time, municipality_id, origin_place_id, destination_place_id, reason, description, route_summary, event_status, status, slug, origin_text, destination_text)
values ('3bacd8cf-c10e-4fb5-9bf1-ef729f9ad0a9', '4ff33303-55ae-4bfc-a81b-9d72a9e15722', 'Procesión de Gloria', 'ordinary', 'Procesión de Nuestra Señora la Virgen del Rosario de Santiago 2025', '2025-10-05', 2025, '18:30', '22:15', 'b1d9fe05-a80a-4cde-9e72-bf4f9647e0a3', 'fba2db1c-6caf-4f98-b893-22048e746690', 'fba2db1c-6caf-4f98-b893-22048e746690', 'Cultos en honor de Nuestra Señora del Rosario', 'Procesión de Gloria celebrada por las calles de la feligresía.', 'Plaza del Derribo, Herreros, Nuestra Señora del Águila, Juan Abad, Sor Catalina, Conde de Guadalhorce, Madueño de los Aires, La Plazuela, Plaza de Cervantes, Alcalá y Orti, Pescadería, Menéndez Pelayo, Coracha, Fernán Gutiérrez y Plaza del Derribo.', 'held', 'published', 'procesion-rosario-santiago-alcala-2025', 'Parroquia de Santiago el Mayor', 'Parroquia de Santiago el Mayor')
on conflict (id) do update set
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  outing_type = excluded.outing_type,
  character = excluded.character,
  title = excluded.title,
  outing_date = excluded.outing_date,
  year = excluded.year,
  departure_time = excluded.departure_time,
  return_time = excluded.return_time,
  municipality_id = excluded.municipality_id,
  origin_place_id = excluded.origin_place_id,
  destination_place_id = excluded.destination_place_id,
  reason = excluded.reason,
  description = excluded.description,
  route_summary = excluded.route_summary,
  event_status = excluded.event_status,
  status = excluded.status,
  slug = excluded.slug,
  origin_text = excluded.origin_text,
  destination_text = excluded.destination_text;

insert into public.outing_entities (id, outing_id, entity_id, role, notes)
values ('9186242f-846a-4db5-8ca7-cf6d7c41509e', 'ffa686ad-7f22-4b89-b995-109e54662162', '45370864-f7cc-4223-90b9-a38c0d5787de', 'Titular procesional', 'Preside la estación de penitencia.')
on conflict (id) do update set
  outing_id = excluded.outing_id,
  entity_id = excluded.entity_id,
  role = excluded.role,
  notes = excluded.notes;

insert into public.outing_entities (id, outing_id, entity_id, role, notes)
values ('1bd5737c-664a-4d00-94bf-b4f2ee5fd635', '3bacd8cf-c10e-4fb5-9bf1-ef729f9ad0a9', '50c2e211-343a-45a2-a949-b64a472713e8', 'Titular procesional', 'Preside la procesión de Gloria.')
on conflict (id) do update set
  outing_id = excluded.outing_id,
  entity_id = excluded.entity_id,
  role = excluded.role,
  notes = excluded.notes;

insert into public.outing_music_positions (id, outing_id, step_entity_id, position_code, position_label, sequence_no, notes, status)
values ('59b20834-78fd-4e10-8359-7dff2f18146b', 'ffa686ad-7f22-4b89-b995-109e54662162', '44756bb8-50b6-49b5-92ec-ee7adc748afe', 'acompanamiento_paso', 'Acompañamiento del paso', 1, 'Dos formaciones acompañaron el paso en 2026.', 'published')
on conflict (id) do update set
  outing_id = excluded.outing_id,
  step_entity_id = excluded.step_entity_id,
  position_code = excluded.position_code,
  position_label = excluded.position_label,
  sequence_no = excluded.sequence_no,
  notes = excluded.notes,
  status = excluded.status;

insert into public.outing_music_positions (id, outing_id, step_entity_id, position_code, position_label, sequence_no, notes, status)
values ('9da2ce58-bccc-44bd-82df-cbe15736347f', '3bacd8cf-c10e-4fb5-9bf1-ef729f9ad0a9', '86142714-0de4-479f-89ed-b588adfb99a1', 'tras_paso', 'Tras el paso', 1, 'Acompañamiento musical de la edición de 2025.', 'published')
on conflict (id) do update set
  outing_id = excluded.outing_id,
  step_entity_id = excluded.step_entity_id,
  position_code = excluded.position_code,
  position_label = excluded.position_label,
  sequence_no = excluded.sequence_no,
  notes = excluded.notes,
  status = excluded.status;

insert into public.outing_music_assignments (id, music_position_id, band_entity_id, participation_mode, sequence_no, notes, status)
values ('150f7f52-20a8-42df-9f6a-f70c7bfb587a', '59b20834-78fd-4e10-8359-7dff2f18146b', '7d0aa85b-b657-4ca2-9846-1dc4f8f11c74', 'full_route', 1, 'Acompañamiento publicado para la estación de penitencia de 2026.', 'published')
on conflict (id) do update set
  music_position_id = excluded.music_position_id,
  band_entity_id = excluded.band_entity_id,
  participation_mode = excluded.participation_mode,
  sequence_no = excluded.sequence_no,
  notes = excluded.notes,
  status = excluded.status;

insert into public.outing_music_assignments (id, music_position_id, band_entity_id, participation_mode, sequence_no, notes, status)
values ('66f2d0c6-0d9d-4eb8-9705-a1af17218e27', '59b20834-78fd-4e10-8359-7dff2f18146b', '4c0f1466-35b5-4287-9125-7ef8c534184b', 'full_route', 2, 'Acompañamiento publicado para la estación de penitencia de 2026.', 'published')
on conflict (id) do update set
  music_position_id = excluded.music_position_id,
  band_entity_id = excluded.band_entity_id,
  participation_mode = excluded.participation_mode,
  sequence_no = excluded.sequence_no,
  notes = excluded.notes,
  status = excluded.status;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('32bab08e-1da4-4c91-b9ed-5ec142ae5fcc', 'heritage_asset', 'Retablo de Nuestra Señora del Rosario de Santiago', 'retablo-nuestra-senora-rosario-santiago-alcala', 'Retablo histórico de la cabecera de la nave del Evangelio, restaurado y adaptado en 2011 para devolver a la Virgen del Rosario a su emplazamiento histórico.', 'published')
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.heritage_assets (entity_id, parent_entity_id, asset_type, description, current_condition, date_from_text, is_current, historical_context, display_order, is_featured, usage_text)
values ('32bab08e-1da4-4c91-b9ed-5ec142ae5fcc', '4ff33303-55ae-4bfc-a81b-9d72a9e15722', 'Retablo', 'Retablo histórico de la cabecera de la nave del Evangelio, restaurado y adaptado en 2011 para devolver a la Virgen del Rosario a su emplazamiento histórico.', 'En uso', 'Restaurado y adaptado en 2011', TRUE, 'Vinculado a la recuperación contemporánea de la Hermandad en Santiago el Mayor.', 10, TRUE, 'Lugar habitual de veneración de Nuestra Señora del Rosario.')
on conflict (entity_id) do update set
  parent_entity_id = excluded.parent_entity_id,
  asset_type = excluded.asset_type,
  description = excluded.description,
  current_condition = excluded.current_condition,
  date_from_text = excluded.date_from_text,
  is_current = excluded.is_current,
  historical_context = excluded.historical_context,
  display_order = excluded.display_order,
  is_featured = excluded.is_featured,
  usage_text = excluded.usage_text;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('ffc0b72f-be94-43d4-9cee-72a07403561d', 'heritage_asset', 'Capilla penitencial de la Divina Misericordia', 'capilla-penitencial-divina-misericordia-alcala', 'Espacio habilitado por la corporación para la imagen del Señor y bendecido el 27 de noviembre de 2011.', 'published')
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.heritage_assets (entity_id, parent_entity_id, asset_type, description, current_condition, date_from_text, is_current, historical_context, display_order, is_featured, usage_text)
values ('ffc0b72f-be94-43d4-9cee-72a07403561d', '4ff33303-55ae-4bfc-a81b-9d72a9e15722', 'Capilla', 'Espacio habilitado por la corporación para la imagen del Señor y bendecido el 27 de noviembre de 2011.', 'En uso', '2011', TRUE, 'Vinculado a la recuperación contemporánea de la Hermandad en Santiago el Mayor.', 20, TRUE, 'Lugar de veneración del Santísimo Cristo de la Divina Misericordia.')
on conflict (entity_id) do update set
  parent_entity_id = excluded.parent_entity_id,
  asset_type = excluded.asset_type,
  description = excluded.description,
  current_condition = excluded.current_condition,
  date_from_text = excluded.date_from_text,
  is_current = excluded.is_current,
  historical_context = excluded.historical_context,
  display_order = excluded.display_order,
  is_featured = excluded.is_featured,
  usage_text = excluded.usage_text;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('a5eba7ed-21d2-4b99-b523-ee4d0d2b6b42', 'event', 'Primera referencia documental de la Cofradía del Rosario de Santiago', 'primera-referencia-cofradia-rosario-santiago-1579', 'La primera referencia documental conocida de la Cofradía del Rosario de Santiago data de 1579.', 'published')
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.events (entity_id, event_type, event_date, event_date_text, place_id, description, event_category, brotherhood_entity_id, municipality_id, event_status, location_text)
values ('a5eba7ed-21d2-4b99-b523-ee4d0d2b6b42', 'Hito histórico', NULL, '1579', NULL, 'Primera referencia documental citada por el profesor Romero Mensaque.', 'historical', '4ff33303-55ae-4bfc-a81b-9d72a9e15722', 'b1d9fe05-a80a-4cde-9e72-bf4f9647e0a3', 'held', 'Alcalá de Guadaíra')
on conflict (entity_id) do update set
  event_type = excluded.event_type,
  event_date = excluded.event_date,
  event_date_text = excluded.event_date_text,
  place_id = excluded.place_id,
  description = excluded.description,
  event_category = excluded.event_category,
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  municipality_id = excluded.municipality_id,
  event_status = excluded.event_status,
  location_text = excluded.location_text;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('62325a78-de57-487a-b7f5-cd86258e3ef1', 'event', 'Destrucción de la primitiva Virgen del Rosario de Santiago', 'destruccion-virgen-rosario-santiago-1936', 'La primitiva titular fue destruida durante el asalto a la parroquia del 18 de julio de 1936.', 'published')
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.events (entity_id, event_type, event_date, event_date_text, place_id, description, event_category, brotherhood_entity_id, municipality_id, event_status, location_text)
values ('62325a78-de57-487a-b7f5-cd86258e3ef1', 'Pérdida patrimonial', '1936-07-18', '18 de julio de 1936', NULL, 'Destrucción de la imagen primitiva; la actual titular fue realizada en 1944.', 'historical', '4ff33303-55ae-4bfc-a81b-9d72a9e15722', 'b1d9fe05-a80a-4cde-9e72-bf4f9647e0a3', 'held', 'Alcalá de Guadaíra')
on conflict (entity_id) do update set
  event_type = excluded.event_type,
  event_date = excluded.event_date,
  event_date_text = excluded.event_date_text,
  place_id = excluded.place_id,
  description = excluded.description,
  event_category = excluded.event_category,
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  municipality_id = excluded.municipality_id,
  event_status = excluded.event_status,
  location_text = excluded.location_text;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('cc3301f9-98da-4e67-93e1-471f7df016f5', 'event', 'Reorganización contemporánea del Rosario de Santiago', 'reorganizacion-rosario-santiago-alcala-2004', 'En julio de 2004 un grupo de jóvenes de la parroquia impulsó la recuperación del culto y la Hermandad.', 'published')
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.events (entity_id, event_type, event_date, event_date_text, place_id, description, event_category, brotherhood_entity_id, municipality_id, event_status, location_text)
values ('cc3301f9-98da-4e67-93e1-471f7df016f5', 'Reorganización', NULL, 'Julio de 2004', NULL, 'Creación de una Asociación Parroquial para revitalizar el culto de la Virgen.', 'historical', '4ff33303-55ae-4bfc-a81b-9d72a9e15722', 'b1d9fe05-a80a-4cde-9e72-bf4f9647e0a3', 'held', 'Alcalá de Guadaíra')
on conflict (entity_id) do update set
  event_type = excluded.event_type,
  event_date = excluded.event_date,
  event_date_text = excluded.event_date_text,
  place_id = excluded.place_id,
  description = excluded.description,
  event_category = excluded.event_category,
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  municipality_id = excluded.municipality_id,
  event_status = excluded.event_status,
  location_text = excluded.location_text;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('60462d44-d119-44cf-b1a9-c5c5ba4713e3', 'event', 'Primer Rosario de la Aurora al Santuario del Águila', 'primer-rosario-aurora-santiago-alcala-2005', 'En octubre de 2005 se organizó el primer Rosario de la Aurora hasta el Santuario del Águila.', 'published')
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.events (entity_id, event_type, event_date, event_date_text, place_id, description, event_category, brotherhood_entity_id, municipality_id, event_status, location_text)
values ('60462d44-d119-44cf-b1a9-c5c5ba4713e3', 'Culto externo', NULL, 'Octubre de 2005', NULL, 'Primer Rosario de la Aurora de la etapa contemporánea.', 'historical', '4ff33303-55ae-4bfc-a81b-9d72a9e15722', 'b1d9fe05-a80a-4cde-9e72-bf4f9647e0a3', 'held', 'Alcalá de Guadaíra')
on conflict (entity_id) do update set
  event_type = excluded.event_type,
  event_date = excluded.event_date,
  event_date_text = excluded.event_date_text,
  place_id = excluded.place_id,
  description = excluded.description,
  event_category = excluded.event_category,
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  municipality_id = excluded.municipality_id,
  event_status = excluded.event_status,
  location_text = excluded.location_text;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('cc279b10-18c3-4b35-b9c5-572211eae697', 'event', 'Recuperación de la procesión de Gloria del Rosario de Santiago', 'primera-procesion-gloria-rosario-santiago-2006', 'La Virgen del Rosario volvió a procesionar en solitario por la feligresía en octubre de 2006.', 'published')
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.events (entity_id, event_type, event_date, event_date_text, place_id, description, event_category, brotherhood_entity_id, municipality_id, event_status, location_text)
values ('cc279b10-18c3-4b35-b9c5-572211eae697', 'Procesión histórica', NULL, 'Octubre de 2006', NULL, 'Primera procesión de Gloria en solitario de la imagen tras décadas.', 'historical', '4ff33303-55ae-4bfc-a81b-9d72a9e15722', 'b1d9fe05-a80a-4cde-9e72-bf4f9647e0a3', 'held', 'Alcalá de Guadaíra')
on conflict (entity_id) do update set
  event_type = excluded.event_type,
  event_date = excluded.event_date,
  event_date_text = excluded.event_date_text,
  place_id = excluded.place_id,
  description = excluded.description,
  event_category = excluded.event_category,
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  municipality_id = excluded.municipality_id,
  event_status = excluded.event_status,
  location_text = excluded.location_text;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('f00da61b-048b-4acc-9951-2f6f3f08db6f', 'event', 'Bendición del Santísimo Cristo de la Divina Misericordia', 'bendicion-divina-misericordia-alcala-2011', 'El conjunto de la Divina Misericordia fue bendecido en Santiago el Mayor el 27 de noviembre de 2011.', 'published')
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.events (entity_id, event_type, event_date, event_date_text, place_id, description, event_category, brotherhood_entity_id, municipality_id, event_status, location_text)
values ('f00da61b-048b-4acc-9951-2f6f3f08db6f', 'Bendición', '2011-11-27', '27 de noviembre de 2011', 'fba2db1c-6caf-4f98-b893-22048e746690', 'Bendición del Señor y de la nueva capilla penitencial.', 'historical', '4ff33303-55ae-4bfc-a81b-9d72a9e15722', 'b1d9fe05-a80a-4cde-9e72-bf4f9647e0a3', 'held', 'Alcalá de Guadaíra')
on conflict (entity_id) do update set
  event_type = excluded.event_type,
  event_date = excluded.event_date,
  event_date_text = excluded.event_date_text,
  place_id = excluded.place_id,
  description = excluded.description,
  event_category = excluded.event_category,
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  municipality_id = excluded.municipality_id,
  event_status = excluded.event_status,
  location_text = excluded.location_text;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('5693b73b-3c2c-44f1-82a8-5c8e96d09534', 'event', 'Primera salida penitencial de la Divina Misericordia', 'primera-salida-penitencial-divina-misericordia-alcala-2012', 'La Agrupación Parroquial realizó su primera salida penitencial el Sábado Santo de 2012.', 'published')
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.events (entity_id, event_type, event_date, event_date_text, place_id, description, event_category, brotherhood_entity_id, municipality_id, event_status, location_text)
values ('5693b73b-3c2c-44f1-82a8-5c8e96d09534', 'Primera salida', '2012-04-07', '7 de abril de 2012', NULL, 'Primera salida penitencial acompañando al Santísimo Cristo de la Divina Misericordia.', 'historical', '4ff33303-55ae-4bfc-a81b-9d72a9e15722', 'b1d9fe05-a80a-4cde-9e72-bf4f9647e0a3', 'held', 'Alcalá de Guadaíra')
on conflict (entity_id) do update set
  event_type = excluded.event_type,
  event_date = excluded.event_date,
  event_date_text = excluded.event_date_text,
  place_id = excluded.place_id,
  description = excluded.description,
  event_category = excluded.event_category,
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  municipality_id = excluded.municipality_id,
  event_status = excluded.event_status,
  location_text = excluded.location_text;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('8f6469f6-1996-4bd7-9023-2ad0652bf5cb', 'event', 'Bendición de María Santísima de la Trinidad', 'bendicion-maria-santisima-trinidad-alcala-2013', 'María Santísima de la Trinidad fue bendecida el 25 de mayo de 2013.', 'published')
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.events (entity_id, event_type, event_date, event_date_text, place_id, description, event_category, brotherhood_entity_id, municipality_id, event_status, location_text)
values ('8f6469f6-1996-4bd7-9023-2ad0652bf5cb', 'Bendición', '2013-05-25', '25 de mayo de 2013', 'fba2db1c-6caf-4f98-b893-22048e746690', 'Bendición de la Dolorosa en la Parroquia de Santiago el Mayor.', 'historical', '4ff33303-55ae-4bfc-a81b-9d72a9e15722', 'b1d9fe05-a80a-4cde-9e72-bf4f9647e0a3', 'held', 'Alcalá de Guadaíra')
on conflict (entity_id) do update set
  event_type = excluded.event_type,
  event_date = excluded.event_date,
  event_date_text = excluded.event_date_text,
  place_id = excluded.place_id,
  description = excluded.description,
  event_category = excluded.event_category,
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  municipality_id = excluded.municipality_id,
  event_status = excluded.event_status,
  location_text = excluded.location_text;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('e0cd548e-7286-464c-bb8e-b4e383543bcf', 'event', 'Erección como Hermandad de Penitencia y Gloria', 'ereccion-hermandad-divina-misericordia-alcala-2016', 'La corporación fue erigida como Hermandad de Penitencia y Gloria en mayo de 2016.', 'published')
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.events (entity_id, event_type, event_date, event_date_text, place_id, description, event_category, brotherhood_entity_id, municipality_id, event_status, location_text)
values ('e0cd548e-7286-464c-bb8e-b4e383543bcf', 'Hito institucional', NULL, 'Mayo de 2016', NULL, 'Erección canónica de la Hermandad con doble naturaleza penitencial y letífica.', 'historical', '4ff33303-55ae-4bfc-a81b-9d72a9e15722', 'b1d9fe05-a80a-4cde-9e72-bf4f9647e0a3', 'held', 'Alcalá de Guadaíra')
on conflict (entity_id) do update set
  event_type = excluded.event_type,
  event_date = excluded.event_date,
  event_date_text = excluded.event_date_text,
  place_id = excluded.place_id,
  description = excluded.description,
  event_category = excluded.event_category,
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  municipality_id = excluded.municipality_id,
  event_status = excluded.event_status,
  location_text = excluded.location_text;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('0084587c-cce7-4caf-a681-dcba15ee585c', 'event', 'Primera estación de penitencia con nazarenos', 'primera-estacion-nazarenos-divina-misericordia-alcala-2017', 'La Hermandad efectuó su primera estación de penitencia con nazarenos el Sábado Santo de 2017.', 'published')
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.events (entity_id, event_type, event_date, event_date_text, place_id, description, event_category, brotherhood_entity_id, municipality_id, event_status, location_text)
values ('0084587c-cce7-4caf-a681-dcba15ee585c', 'Primera estación de penitencia', NULL, 'Sábado Santo de 2017', NULL, 'Primera estación de penitencia como Hermandad con cortejo de nazarenos.', 'historical', '4ff33303-55ae-4bfc-a81b-9d72a9e15722', 'b1d9fe05-a80a-4cde-9e72-bf4f9647e0a3', 'held', 'Alcalá de Guadaíra')
on conflict (entity_id) do update set
  event_type = excluded.event_type,
  event_date = excluded.event_date,
  event_date_text = excluded.event_date_text,
  place_id = excluded.place_id,
  description = excluded.description,
  event_category = excluded.event_category,
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  municipality_id = excluded.municipality_id,
  event_status = excluded.event_status,
  location_text = excluded.location_text;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('d222741e-b07d-4a27-8729-f938f9410e2c', 'event', 'La Virgen del Rosario de Santiago en el cartel de las Glorias 2026', 'cartel-glorias-alcala-rosario-santiago-2026', 'El cartel de las Glorias alcalareñas de 2026, obra de Pablo Rosa Rodríguez, está dedicado a la Virgen del Rosario de Santiago.', 'published')
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.events (entity_id, event_type, event_date, event_date_text, place_id, description, event_category, brotherhood_entity_id, municipality_id, event_status, location_text)
values ('d222741e-b07d-4a27-8729-f938f9410e2c', 'Cartel', '2026-04-11', '11 de abril de 2026', NULL, 'Presentación del cartel de las Glorias alcalareñas de 2026.', 'historical', '4ff33303-55ae-4bfc-a81b-9d72a9e15722', 'b1d9fe05-a80a-4cde-9e72-bf4f9647e0a3', 'held', 'Alcalá de Guadaíra')
on conflict (entity_id) do update set
  event_type = excluded.event_type,
  event_date = excluded.event_date,
  event_date_text = excluded.event_date_text,
  place_id = excluded.place_id,
  description = excluded.description,
  event_category = excluded.event_category,
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  municipality_id = excluded.municipality_id,
  event_status = excluded.event_status,
  location_text = excluded.location_text;

insert into public.entity_social_links (id, entity_id, platform, url, label, display_order, is_public)
values ('36305ed4-ea8c-4be0-b360-561e75732eab', '4ff33303-55ae-4bfc-a81b-9d72a9e15722', 'website', 'https://rosariodesantiago.blogspot.com/', 'Web oficial', 10, TRUE)
on conflict (id) do update set
  entity_id = excluded.entity_id,
  platform = excluded.platform,
  url = excluded.url,
  label = excluded.label,
  display_order = excluded.display_order,
  is_public = excluded.is_public;

insert into public.entity_social_links (id, entity_id, platform, url, label, display_order, is_public)
values ('7424fdd9-4e39-453a-957b-b07fe4631d27', '4ff33303-55ae-4bfc-a81b-9d72a9e15722', 'facebook', 'https://www.facebook.com/profile.php?id=100069128529775', 'Facebook oficial', 20, TRUE)
on conflict (id) do update set
  entity_id = excluded.entity_id,
  platform = excluded.platform,
  url = excluded.url,
  label = excluded.label,
  display_order = excluded.display_order,
  is_public = excluded.is_public;

insert into public.entity_social_links (id, entity_id, platform, url, label, display_order, is_public)
values ('c98eb058-7ca7-403e-9de2-c37184d198bc', '4ff33303-55ae-4bfc-a81b-9d72a9e15722', 'instagram', 'https://www.instagram.com/rosariostgoalcala/?hl=es', 'Instagram · @rosariostgoalcala', 30, TRUE)
on conflict (id) do update set
  entity_id = excluded.entity_id,
  platform = excluded.platform,
  url = excluded.url,
  label = excluded.label,
  display_order = excluded.display_order,
  is_public = excluded.is_public;

insert into public.entity_social_links (id, entity_id, platform, url, label, display_order, is_public)
values ('f1c5611b-9150-4fb3-a806-c537f2ef9d78', '4ff33303-55ae-4bfc-a81b-9d72a9e15722', 'x', 'https://twitter.com/RosarioStgo', 'X · @RosarioStgo', 40, TRUE)
on conflict (id) do update set
  entity_id = excluded.entity_id,
  platform = excluded.platform,
  url = excluded.url,
  label = excluded.label,
  display_order = excluded.display_order,
  is_public = excluded.is_public;

insert into public.entity_social_links (id, entity_id, platform, url, label, display_order, is_public)
values ('bcaca8fa-4d94-435d-8c2e-5ef9d69e04ee', '4ff33303-55ae-4bfc-a81b-9d72a9e15722', 'youtube', 'https://www.youtube.com/channel/UCF9tXKmYsuhIJDm25DOLzKA', 'YouTube oficial', 50, TRUE)
on conflict (id) do update set
  entity_id = excluded.entity_id,
  platform = excluded.platform,
  url = excluded.url,
  label = excluded.label,
  display_order = excluded.display_order,
  is_public = excluded.is_public;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('6a478cad-f5ab-44d8-832c-d23109d8497b', '9ba9a02c-a848-4102-b716-a6d33d1d968c', '4ff33303-55ae-4bfc-a81b-9d72a9e15722', 'Fuente general · parish', 'Fuente visible en la ficha matriz de la Hermandad.')
on conflict (id) do update set
  source_id = excluded.source_id,
  entity_id = excluded.entity_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('ba3fe7a1-eebf-4d9c-8eef-25f721ab290b', '04123de3-18e5-47da-9cd8-74cf12db8856', '4ff33303-55ae-4bfc-a81b-9d72a9e15722', 'Fuente general · home', 'Fuente visible en la ficha matriz de la Hermandad.')
on conflict (id) do update set
  source_id = excluded.source_id,
  entity_id = excluded.entity_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('07e8978b-90d0-43ee-99ca-ffa5e855fddb', '1eb7891c-3eca-4f83-8f6c-503e9b12ad8e', '4ff33303-55ae-4bfc-a81b-9d72a9e15722', 'Fuente general · history', 'Fuente visible en la ficha matriz de la Hermandad.')
on conflict (id) do update set
  source_id = excluded.source_id,
  entity_id = excluded.entity_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('b12c9834-1898-421c-9aff-9aca077be488', 'a7a17be8-0de1-48eb-8345-8e1c008871ea', '4ff33303-55ae-4bfc-a81b-9d72a9e15722', 'Fuente general · titulars', 'Fuente visible en la ficha matriz de la Hermandad.')
on conflict (id) do update set
  source_id = excluded.source_id,
  entity_id = excluded.entity_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('0eed11b9-83d9-40c0-b676-c706989fc5b6', '0fe6ed87-446a-463a-b2c0-4becb56bdc33', '4ff33303-55ae-4bfc-a81b-9d72a9e15722', 'Fuente general · council', 'Fuente visible en la ficha matriz de la Hermandad.')
on conflict (id) do update set
  source_id = excluded.source_id,
  entity_id = excluded.entity_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('331cfbfe-eaac-42d3-bf75-3402f0abfb8d', 'cab4248c-3b30-4c1a-9bb9-6ef225d33c32', '4ff33303-55ae-4bfc-a81b-9d72a9e15722', 'Fuente general · ss2026', 'Fuente visible en la ficha matriz de la Hermandad.')
on conflict (id) do update set
  source_id = excluded.source_id,
  entity_id = excluded.entity_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('b9ded8de-68af-4ff3-9a40-91f243709773', 'a9f8470c-c74e-41fc-b04e-b41f5189b733', '4ff33303-55ae-4bfc-a81b-9d72a9e15722', 'Fuente general · ss2025', 'Fuente visible en la ficha matriz de la Hermandad.')
on conflict (id) do update set
  source_id = excluded.source_id,
  entity_id = excluded.entity_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('9a7d2590-29ac-4fa7-8f10-72caccd717da', 'ae64662b-6e5f-43d5-80bb-9bcf0ee11302', '4ff33303-55ae-4bfc-a81b-9d72a9e15722', 'Fuente general · glorias2026', 'Fuente visible en la ficha matriz de la Hermandad.')
on conflict (id) do update set
  source_id = excluded.source_id,
  entity_id = excluded.entity_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('937d1bad-7fc6-44c2-bfd9-3d88fa76b7c5', 'a7a17be8-0de1-48eb-8345-8e1c008871ea', '45370864-f7cc-4223-90b9-a38c0d5787de', 'Titular · identidad e iconografía', 'Ficha oficial de titulares.')
on conflict (id) do update set
  source_id = excluded.source_id,
  entity_id = excluded.entity_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, image_authorship_id, scope, notes)
values ('9c601ecb-033e-441b-88ab-e9e6e12ef17e', 'a7a17be8-0de1-48eb-8345-8e1c008871ea', 'aab3525d-df51-4ad9-a56c-6b4c22fd8097', 'Titular · autoría y datación', 'Autoría documentada por la Hermandad.')
on conflict (id) do update set
  source_id = excluded.source_id,
  image_authorship_id = excluded.image_authorship_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, brotherhood_image_id, scope, notes)
values ('82c8d449-5f68-4d3a-a567-2ae7f727e268', '0fe6ed87-446a-463a-b2c0-4becb56bdc33', '376826ff-6555-407b-a08b-3899b4ead757', 'Titularidad vigente', 'El Consejo presenta la imagen como titular de la corporación.')
on conflict (id) do update set
  source_id = excluded.source_id,
  brotherhood_image_id = excluded.brotherhood_image_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('87ca5cfb-092d-48e6-aeea-a8ca170ebbf2', 'a7a17be8-0de1-48eb-8345-8e1c008871ea', '50c2e211-343a-45a2-a949-b64a472713e8', 'Titular · identidad e iconografía', 'Ficha oficial de titulares.')
on conflict (id) do update set
  source_id = excluded.source_id,
  entity_id = excluded.entity_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, image_authorship_id, scope, notes)
values ('65445495-e572-449b-a1e5-b55039dc6462', 'a7a17be8-0de1-48eb-8345-8e1c008871ea', '27ccb55c-d306-4f61-a7a3-5bc20855fd84', 'Titular · autoría y datación', 'Autoría documentada por la Hermandad.')
on conflict (id) do update set
  source_id = excluded.source_id,
  image_authorship_id = excluded.image_authorship_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, brotherhood_image_id, scope, notes)
values ('6920d3f3-f8ba-4eb0-87be-e06c2f1df395', '0fe6ed87-446a-463a-b2c0-4becb56bdc33', '3fd61165-9518-4c77-9d84-0c9b6e44bbcf', 'Titularidad vigente', 'El Consejo presenta la imagen como titular de la corporación.')
on conflict (id) do update set
  source_id = excluded.source_id,
  brotherhood_image_id = excluded.brotherhood_image_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('5a049e68-1406-45d3-9431-2b2e2387553a', 'a7a17be8-0de1-48eb-8345-8e1c008871ea', '0251ad9c-38f0-477a-b1c8-34341644072f', 'Titular · identidad e iconografía', 'Ficha oficial de titulares.')
on conflict (id) do update set
  source_id = excluded.source_id,
  entity_id = excluded.entity_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, image_authorship_id, scope, notes)
values ('e9c73c42-d7d5-4ce5-b586-24d485715135', 'a7a17be8-0de1-48eb-8345-8e1c008871ea', '0bc8371f-adc0-40b1-893f-860c2f6437f6', 'Titular · autoría y datación', 'Autoría documentada por la Hermandad.')
on conflict (id) do update set
  source_id = excluded.source_id,
  image_authorship_id = excluded.image_authorship_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, brotherhood_image_id, scope, notes)
values ('c2addf68-edb3-4aa5-9b9a-fd1e55bd4a72', '0fe6ed87-446a-463a-b2c0-4becb56bdc33', '54a05d09-f222-4c93-9eee-dd18833b1ca5', 'Titularidad vigente', 'El Consejo presenta la imagen como titular de la corporación.')
on conflict (id) do update set
  source_id = excluded.source_id,
  brotherhood_image_id = excluded.brotherhood_image_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('e1bda19d-e472-4ecf-b36f-4b65a75549c5', 'a7a17be8-0de1-48eb-8345-8e1c008871ea', '14b70746-ddb5-41ef-9931-c2ea2d71b308', 'Titular · identidad e iconografía', 'Ficha oficial de titulares.')
on conflict (id) do update set
  source_id = excluded.source_id,
  entity_id = excluded.entity_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, image_authorship_id, scope, notes)
values ('cb9ed4be-a2e5-4847-ae8e-52c1bf563c4d', 'a7a17be8-0de1-48eb-8345-8e1c008871ea', '32bef13b-f4da-4ebe-87a4-de35aaef5349', 'Titular · autoría y datación', 'Autoría documentada por la Hermandad.')
on conflict (id) do update set
  source_id = excluded.source_id,
  image_authorship_id = excluded.image_authorship_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, brotherhood_image_id, scope, notes)
values ('ea96fdb2-2791-4c43-b2f7-9a05452c37ca', '0fe6ed87-446a-463a-b2c0-4becb56bdc33', 'e24bc1de-4040-4247-a90d-eb83bb123ea8', 'Titularidad vigente', 'El Consejo presenta la imagen como titular de la corporación.')
on conflict (id) do update set
  source_id = excluded.source_id,
  brotherhood_image_id = excluded.brotherhood_image_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('1cf9c1dc-05ba-4611-8e7c-86d686c8c4a9', 'cab4248c-3b30-4c1a-9bb9-6ef225d33c32', '44756bb8-50b6-49b5-92ec-ee7adc748afe', 'Paso penitencial 2026', 'Paso único de la estación de penitencia de 2026.')
on conflict (id) do update set
  source_id = excluded.source_id,
  entity_id = excluded.entity_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, brotherhood_step_id, scope, notes)
values ('ee74cb8f-76f4-4ff1-a9f9-1d6d47fb8dea', '0fe6ed87-446a-463a-b2c0-4becb56bdc33', '8ca24b8e-3cdf-43d4-bd04-75f2084a2a09', 'Paso procesional', 'Relación vigente entre la Hermandad y el paso penitencial.')
on conflict (id) do update set
  source_id = excluded.source_id,
  brotherhood_step_id = excluded.brotherhood_step_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, image_step_id, scope, notes)
values ('e5038e56-5258-4594-a953-7047225d11f3', 'cab4248c-3b30-4c1a-9bb9-6ef225d33c32', '38cfe36b-050a-4d3e-87da-9db712e94833', 'Relación procesional 2026', 'El Señor procesiona sobre este paso.')
on conflict (id) do update set
  source_id = excluded.source_id,
  image_step_id = excluded.image_step_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('9b9f1392-209c-4c4a-9d15-8cfb016a42b4', 'a9f8470c-c74e-41fc-b04e-b41f5189b733', '86142714-0de4-479f-89ed-b588adfb99a1', 'Paso de Gloria 2025', 'Paso de la salida de Gloria celebrada en 2025.')
on conflict (id) do update set
  source_id = excluded.source_id,
  entity_id = excluded.entity_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, image_step_id, scope, notes)
values ('7a251ca3-e245-4a0e-812c-f5123273d0ca', 'a9f8470c-c74e-41fc-b04e-b41f5189b733', '7439cc34-3485-4de7-9569-4990eb9d89c2', 'Relación procesional 2025', 'La Virgen del Rosario procesionó sobre este paso.')
on conflict (id) do update set
  source_id = excluded.source_id,
  image_step_id = excluded.image_step_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, music_accompaniment_period_id, scope, notes)
values ('7954e03a-efa0-4ab0-a3b5-65a7dc664ab5', 'cab4248c-3b30-4c1a-9bb9-6ef225d33c32', '75bb321a-6a40-4910-9cd0-847405838eba', 'Música procesional 2026', 'Acompañamiento confirmado para la edición de 2026.')
on conflict (id) do update set
  source_id = excluded.source_id,
  music_accompaniment_period_id = excluded.music_accompaniment_period_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, music_accompaniment_period_id, scope, notes)
values ('93e166e9-4ab1-4886-9659-5d475bb2e14c', 'cab4248c-3b30-4c1a-9bb9-6ef225d33c32', 'e866293e-dabc-4aef-a6d5-797bbd136ebd', 'Música procesional 2026', 'Acompañamiento confirmado para la edición de 2026.')
on conflict (id) do update set
  source_id = excluded.source_id,
  music_accompaniment_period_id = excluded.music_accompaniment_period_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, brotherhood_habit_id, scope, notes)
values ('cf0dae26-63bd-4684-9253-72c1498f0023', 'cab4248c-3b30-4c1a-9bb9-6ef225d33c32', 'b5e229bf-96f8-4583-99af-fd43a155e0ea', 'Hábito penitencial 2026', 'Descripción publicada para el Sábado Santo de 2026.')
on conflict (id) do update set
  source_id = excluded.source_id,
  brotherhood_habit_id = excluded.brotherhood_habit_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, cult_id, scope, notes)
values ('092b1f35-953f-4bc3-a83f-ee589d86d0e8', '0fe6ed87-446a-463a-b2c0-4becb56bdc33', 'd3d7029f-5dfd-428a-94ec-eba96f20191d', 'Culto principal', 'Culto principal publicado por el Consejo Local.')
on conflict (id) do update set
  source_id = excluded.source_id,
  cult_id = excluded.cult_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, cult_id, scope, notes)
values ('dbcfe18c-fa82-4403-b1b4-542ef58c2d5f', '0fe6ed87-446a-463a-b2c0-4becb56bdc33', '41daf2b0-ea94-4e6f-a1ce-dda5f93082f4', 'Culto principal', 'Culto principal publicado por el Consejo Local.')
on conflict (id) do update set
  source_id = excluded.source_id,
  cult_id = excluded.cult_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, cult_id, scope, notes)
values ('1f3919af-f119-4aad-bdcf-55ec9d7c9ab9', '0fe6ed87-446a-463a-b2c0-4becb56bdc33', '89f83f86-0edf-40a4-8d79-d93851725c4b', 'Culto principal', 'Culto principal publicado por el Consejo Local.')
on conflict (id) do update set
  source_id = excluded.source_id,
  cult_id = excluded.cult_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, cult_id, scope, notes)
values ('0364b358-ef40-45c2-935f-e4ae32e56bae', '0fe6ed87-446a-463a-b2c0-4becb56bdc33', 'e3ddea98-2325-42ef-b255-e64e5c471b2c', 'Culto principal', 'Culto principal publicado por el Consejo Local.')
on conflict (id) do update set
  source_id = excluded.source_id,
  cult_id = excluded.cult_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, cult_id, scope, notes)
values ('dfbf95d4-cdce-4264-9dde-169242d4db88', '0fe6ed87-446a-463a-b2c0-4becb56bdc33', '6a13c990-9a16-4cb6-900c-d6a5d80c0e5b', 'Culto principal', 'Culto principal publicado por el Consejo Local.')
on conflict (id) do update set
  source_id = excluded.source_id,
  cult_id = excluded.cult_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, cult_id, scope, notes)
values ('c19c5c12-8c1d-49a6-be7d-e75eddcf9e45', '0fe6ed87-446a-463a-b2c0-4becb56bdc33', 'cca09a90-3eb2-4eda-b44f-f7aecb46f422', 'Culto principal', 'Culto principal publicado por el Consejo Local.')
on conflict (id) do update set
  source_id = excluded.source_id,
  cult_id = excluded.cult_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, cult_id, scope, notes)
values ('ab46bc5e-0468-4340-9e59-d7f5a9d9dcaf', '0fe6ed87-446a-463a-b2c0-4becb56bdc33', 'd733e1bf-a591-495b-9dac-a6b4919bd0b9', 'Culto principal', 'Culto principal publicado por el Consejo Local.')
on conflict (id) do update set
  source_id = excluded.source_id,
  cult_id = excluded.cult_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, cult_id, scope, notes)
values ('105aabd8-878d-4003-bff0-4b83e2d6db62', '0fe6ed87-446a-463a-b2c0-4becb56bdc33', 'c5c2b731-9788-4bd3-9f8e-0ec10f414cff', 'Culto principal', 'Culto principal publicado por el Consejo Local.')
on conflict (id) do update set
  source_id = excluded.source_id,
  cult_id = excluded.cult_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, cult_id, scope, notes)
values ('a30ce203-5f39-4e39-b5f5-68ec5027caa1', '0fe6ed87-446a-463a-b2c0-4becb56bdc33', 'ae267238-0832-490a-9778-9c5a49d11e93', 'Culto principal', 'Culto principal publicado por el Consejo Local.')
on conflict (id) do update set
  source_id = excluded.source_id,
  cult_id = excluded.cult_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, outing_id, scope, notes)
values ('37990829-a5ec-4407-abcb-915cb2009d78', 'cab4248c-3b30-4c1a-9bb9-6ef225d33c32', 'ffa686ad-7f22-4b89-b995-109e54662162', 'Estación de penitencia 2026', 'Horario, itinerario, paso y música de la salida celebrada.')
on conflict (id) do update set
  source_id = excluded.source_id,
  outing_id = excluded.outing_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, outing_id, scope, notes)
values ('5970337a-af3e-42b1-aaa3-f7af49a767bb', 'a9f8470c-c74e-41fc-b04e-b41f5189b733', '3bacd8cf-c10e-4fb5-9bf1-ef729f9ad0a9', 'Procesión de Gloria 2025', 'Horario, itinerario y música de la salida celebrada.')
on conflict (id) do update set
  source_id = excluded.source_id,
  outing_id = excluded.outing_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, outing_music_position_id, scope, notes)
values ('8adeb9e2-b89a-43e0-9f66-5ca78b44474c', 'cab4248c-3b30-4c1a-9bb9-6ef225d33c32', '59b20834-78fd-4e10-8359-7dff2f18146b', 'Posición musical 2026', 'Acompañamiento del paso en la edición de 2026.')
on conflict (id) do update set
  source_id = excluded.source_id,
  outing_music_position_id = excluded.outing_music_position_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, outing_music_assignment_id, scope, notes)
values ('40e5941d-dcc1-4a50-8596-daca75f4c354', 'cab4248c-3b30-4c1a-9bb9-6ef225d33c32', '150f7f52-20a8-42df-9f6a-f70c7bfb587a', 'Formación participante 2026', 'Capilla Musical Dulce Nombre.')
on conflict (id) do update set
  source_id = excluded.source_id,
  outing_music_assignment_id = excluded.outing_music_assignment_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, outing_music_assignment_id, scope, notes)
values ('8f21513a-090c-4a55-9572-03ea1757477b', 'cab4248c-3b30-4c1a-9bb9-6ef225d33c32', '66f2d0c6-0d9d-4eb8-9705-a1af17218e27', 'Formación participante 2026', 'Escolanía de María Santísima de la Trinidad.')
on conflict (id) do update set
  source_id = excluded.source_id,
  outing_music_assignment_id = excluded.outing_music_assignment_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, outing_music_position_id, scope, notes)
values ('eca9fb8a-d922-4081-9f15-e0d67a3a5570', 'a9f8470c-c74e-41fc-b04e-b41f5189b733', '9da2ce58-bccc-44bd-82df-cbe15736347f', 'Posición musical 2025', 'Banda situada tras el paso.')
on conflict (id) do update set
  source_id = excluded.source_id,
  outing_music_position_id = excluded.outing_music_position_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('032ab121-ece9-4707-a1ef-ff3012daaefd', '1eb7891c-3eca-4f83-8f6c-503e9b12ad8e', '32bab08e-1da4-4c91-b9ed-5ec142ae5fcc', 'Patrimonio', 'Elemento documentado en la historia oficial.')
on conflict (id) do update set
  source_id = excluded.source_id,
  entity_id = excluded.entity_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('87337b10-639d-48d3-b73b-5828dbf52ecb', '1eb7891c-3eca-4f83-8f6c-503e9b12ad8e', 'ffc0b72f-be94-43d4-9cee-72a07403561d', 'Patrimonio', 'Elemento documentado en la historia oficial.')
on conflict (id) do update set
  source_id = excluded.source_id,
  entity_id = excluded.entity_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('865f01ca-7927-496b-85ab-9ffb9ae267c3', '1eb7891c-3eca-4f83-8f6c-503e9b12ad8e', 'a5eba7ed-21d2-4b99-b523-ee4d0d2b6b42', 'Acontecimiento histórico', 'Hito documentado por la Fuente indicada.')
on conflict (id) do update set
  source_id = excluded.source_id,
  entity_id = excluded.entity_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('5fd0283a-0c43-48f8-8c16-7c92edb57ddb', '1eb7891c-3eca-4f83-8f6c-503e9b12ad8e', '62325a78-de57-487a-b7f5-cd86258e3ef1', 'Acontecimiento histórico', 'Hito documentado por la Fuente indicada.')
on conflict (id) do update set
  source_id = excluded.source_id,
  entity_id = excluded.entity_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('4309c69d-4812-497e-b25d-525165566c9a', '1eb7891c-3eca-4f83-8f6c-503e9b12ad8e', 'cc3301f9-98da-4e67-93e1-471f7df016f5', 'Acontecimiento histórico', 'Hito documentado por la Fuente indicada.')
on conflict (id) do update set
  source_id = excluded.source_id,
  entity_id = excluded.entity_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('8f59405b-2039-472e-a38f-44ddd76b8d1a', '1eb7891c-3eca-4f83-8f6c-503e9b12ad8e', '60462d44-d119-44cf-b1a9-c5c5ba4713e3', 'Acontecimiento histórico', 'Hito documentado por la Fuente indicada.')
on conflict (id) do update set
  source_id = excluded.source_id,
  entity_id = excluded.entity_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('60089a4e-637f-441a-bdf5-73d59c744ed4', '1eb7891c-3eca-4f83-8f6c-503e9b12ad8e', 'cc279b10-18c3-4b35-b9c5-572211eae697', 'Acontecimiento histórico', 'Hito documentado por la Fuente indicada.')
on conflict (id) do update set
  source_id = excluded.source_id,
  entity_id = excluded.entity_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('6ec9b87a-3f0f-435a-bcd5-f25fc4b238a9', '1eb7891c-3eca-4f83-8f6c-503e9b12ad8e', 'f00da61b-048b-4acc-9951-2f6f3f08db6f', 'Acontecimiento histórico', 'Hito documentado por la Fuente indicada.')
on conflict (id) do update set
  source_id = excluded.source_id,
  entity_id = excluded.entity_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('333ae930-1aa5-4059-9a04-8c611bd58345', '1eb7891c-3eca-4f83-8f6c-503e9b12ad8e', '5693b73b-3c2c-44f1-82a8-5c8e96d09534', 'Acontecimiento histórico', 'Hito documentado por la Fuente indicada.')
on conflict (id) do update set
  source_id = excluded.source_id,
  entity_id = excluded.entity_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('e8b93804-e64f-43da-a090-4ad5a593ac32', '1eb7891c-3eca-4f83-8f6c-503e9b12ad8e', '8f6469f6-1996-4bd7-9023-2ad0652bf5cb', 'Acontecimiento histórico', 'Hito documentado por la Fuente indicada.')
on conflict (id) do update set
  source_id = excluded.source_id,
  entity_id = excluded.entity_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('bd4cae18-2f5d-4119-8cba-31f20a0af75b', '0fe6ed87-446a-463a-b2c0-4becb56bdc33', 'e0cd548e-7286-464c-bb8e-b4e383543bcf', 'Acontecimiento histórico', 'Hito documentado por la Fuente indicada.')
on conflict (id) do update set
  source_id = excluded.source_id,
  entity_id = excluded.entity_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('022568dc-9f22-4aff-92c5-300a5f8cf70a', '0fe6ed87-446a-463a-b2c0-4becb56bdc33', '0084587c-cce7-4caf-a681-dcba15ee585c', 'Acontecimiento histórico', 'Hito documentado por la Fuente indicada.')
on conflict (id) do update set
  source_id = excluded.source_id,
  entity_id = excluded.entity_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('0f4bfddb-0214-4578-92a7-6f3cc6f1bbbb', 'ae64662b-6e5f-43d5-80bb-9bcf0ee11302', 'd222741e-b07d-4a27-8729-f938f9410e2c', 'Acontecimiento histórico', 'Hito documentado por la Fuente indicada.')
on conflict (id) do update set
  source_id = excluded.source_id,
  entity_id = excluded.entity_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('4ab2b57c-6203-4f1d-8029-1b2daf2f0462', 'cab4248c-3b30-4c1a-9bb9-6ef225d33c32', '7d0aa85b-b657-4ca2-9846-1dc4f8f11c74', 'Formación musical', 'Nodo relacional mínimo, limitado a la participación documentada.')
on conflict (id) do update set
  source_id = excluded.source_id,
  entity_id = excluded.entity_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('ed839de8-be9f-417e-8662-ee80b6f6a14b', 'cab4248c-3b30-4c1a-9bb9-6ef225d33c32', '4c0f1466-35b5-4287-9125-7ef8c534184b', 'Formación musical', 'Nodo relacional mínimo, limitado a la participación documentada.')
on conflict (id) do update set
  source_id = excluded.source_id,
  entity_id = excluded.entity_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.music_accompaniment_periods (id, brotherhood_entity_id, band_entity_id, step_entity_id, position, outing_type, year_from, year_to, date_from_text, date_to_text, is_current, notes, status)
values ('51891a0c-dd22-47f9-97e2-5a93e618906f', '4ff33303-55ae-4bfc-a81b-9d72a9e15722', '8e754023-a46a-4587-8952-4696c70d0bd0', '86142714-0de4-479f-89ed-b588adfb99a1', 'Tras el paso', 'Procesión de Gloria', 2025, 2025, 'Procesión del 5 de octubre de 2025', 'Edición de 2025', FALSE, 'Acompañamiento documentado para 2025; no se presenta como contrato vigente en 2026.', 'published')
on conflict (id) do update set
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  band_entity_id = excluded.band_entity_id,
  step_entity_id = excluded.step_entity_id,
  position = excluded.position,
  outing_type = excluded.outing_type,
  year_from = excluded.year_from,
  year_to = excluded.year_to,
  date_from_text = excluded.date_from_text,
  date_to_text = excluded.date_to_text,
  is_current = excluded.is_current,
  notes = excluded.notes,
  status = excluded.status;

insert into public.outing_music_assignments (id, music_position_id, band_entity_id, participation_mode, sequence_no, notes, status)
values ('dcf20aa7-883c-4c18-b7df-c1a7d638fe5d', '9da2ce58-bccc-44bd-82df-cbe15736347f', '8e754023-a46a-4587-8952-4696c70d0bd0', 'full_route', 1, 'Acompañamiento publicado para la procesión de Gloria de 2025.', 'published')
on conflict (id) do update set
  music_position_id = excluded.music_position_id,
  band_entity_id = excluded.band_entity_id,
  participation_mode = excluded.participation_mode,
  sequence_no = excluded.sequence_no,
  notes = excluded.notes,
  status = excluded.status;

insert into public.source_links (id, source_id, music_accompaniment_period_id, scope, notes)
values ('216df532-a91b-4bc8-966b-e75700bc84eb', 'a9f8470c-c74e-41fc-b04e-b41f5189b733', '51891a0c-dd22-47f9-97e2-5a93e618906f', 'Histórico musical 2025', 'Acompañamiento documentado solo para 2025.')
on conflict (id) do update set
  source_id = excluded.source_id,
  music_accompaniment_period_id = excluded.music_accompaniment_period_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, outing_music_assignment_id, scope, notes)
values ('e3a81c9a-87c2-4d94-a92d-09886fe19bda', 'a9f8470c-c74e-41fc-b04e-b41f5189b733', 'dcf20aa7-883c-4c18-b7df-c1a7d638fe5d', 'Formación participante 2025', 'Banda de Alcalá.')
on conflict (id) do update set
  source_id = excluded.source_id,
  outing_music_assignment_id = excluded.outing_music_assignment_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('034ac7de-f78f-40a9-924c-53761a0b6fe1', 'a9f8470c-c74e-41fc-b04e-b41f5189b733', '8e754023-a46a-4587-8952-4696c70d0bd0', 'Formación musical', 'Nodo canónico reutilizado para la participación documentada en 2025.')
on conflict (id) do update set
  source_id = excluded.source_id,
  entity_id = excluded.entity_id,
  scope = excluded.scope,
  notes = excluded.notes;

-- Postflight nuclear del contexto.
do $$
declare
  v_brotherhood uuid := '4ff33303-55ae-4bfc-a81b-9d72a9e15722';
begin
  if (select count(*) from public.brotherhood_images where brotherhood_entity_id=v_brotherhood) <> 4 then raise exception 'HC-016: imágenes incompletas'; end if;
  if (select count(*) from public.brotherhood_steps where brotherhood_entity_id=v_brotherhood) <> 2 then raise exception 'HC-016: pasos incompletos'; end if;
  if (select count(*) from public.cults where brotherhood_entity_id=v_brotherhood) <> 9 then raise exception 'HC-016: cultos incompletos'; end if;
  if (select count(*) from public.outings where brotherhood_entity_id=v_brotherhood) <> 2 then raise exception 'HC-016: salidas incompletas'; end if;
  if (select count(*) from public.music_accompaniment_periods where brotherhood_entity_id=v_brotherhood) <> 3 then raise exception 'HC-016: música incompleta'; end if;
end $$;

commit;
