-- HC-016 · decimotercer contexto real: Sagrada Resurrección de Sevilla

-- Receta editorial canónica archivada tras Apply gobernado en producción.

-- Solo DML. No crea tablas, tipos, funciones, políticas ni índices.

-- Base reconciliada: 9ff59aa4542bf1a976c29b38fad4acba9a6f1f86.

-- Lote: feb6f1c2-4df3-4208-a4d8-b808d97609e9 (164/164; 0 inválidos; 0 fallos).



begin;



insert into public.entities (id, entity_type, name, slug, summary, status)
values ('4994d166-adcc-4a52-84ec-61473540ed82', 'brotherhood', 'La Resurrección', 'la-resurreccion', 'Hermandad lasaliana, sacramental y penitencial con sede en Santa Marina. Cierra la Semana Santa de Sevilla con dos pasos el Domingo de Resurrección.', 'published')
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.brotherhoods (entity_id, official_name, popular_name, foundation_text, municipality_id, canonical_see_place_id, neighborhood, website_url, instagram_url, brotherhood_types, current_procession_day, history_text, notes)
values ('4994d166-adcc-4a52-84ec-61473540ed82', 'Ilustre y Lasaliana Hermandad Sacramental y Cofradía de Nazarenos de la Santa Cruz, Sagrada Resurrección de Nuestro Señor Jesucristo, Nuestra Señora de la Aurora, María Santísima del Amor, San Juan Bautista de La Salle y Santa Marina', 'La Resurrección', '1969; primeras reglas aprobadas el 19 de marzo de 1972', 'ca85889c-21fe-4367-8477-a57656b25da4', '0f5d685a-cceb-4dd7-afc4-38fdbde0249a', 'San Julián', 'https://www.hermandaddelaresurreccion.com/', 'https://www.instagram.com/resurreccionsev/', ARRAY['Penitencia', 'Sacramental']::text[], 'Domingo de Resurrección', 'Nacida en 1969 en el Colegio La Purísima de La Salle, obtuvo reglas como corporación de gloria en 1972. La Sagrada Resurrección, de Francisco Buiza, salió por primera vez en 1973; Nuestra Señora de la Aurora, de Antonio Joaquín Dubé, fue bendecida en 1978. En 1981 recibió carácter penitencial y sacramental y el uso de Santa Marina; hizo su primera estación de penitencia en 1982, volvió al templo restaurado en 1987 y fijó allí su sede permanente en 1991. El paso de palio se incorporó en 1992.', 'Contexto HC-016 cerrado con información oficial. El escudo y la multimedia permanecen sin publicar por no constar autorización de uso.')
on conflict (entity_id) do update set
  official_name = excluded.official_name,
  popular_name = excluded.popular_name,
  foundation_text = excluded.foundation_text,
  municipality_id = excluded.municipality_id,
  canonical_see_place_id = excluded.canonical_see_place_id,
  neighborhood = excluded.neighborhood,
  website_url = excluded.website_url,
  instagram_url = excluded.instagram_url,
  brotherhood_types = excluded.brotherhood_types,
  current_procession_day = excluded.current_procession_day,
  history_text = excluded.history_text,
  notes = excluded.notes;

insert into public.sources (id, name, url, source_type, author_or_publisher, accessed_at, notes)
values ('7a9be5f2-0996-44f8-a673-4aafb758087b', 'Ficha de la cofradía · Hermandad de la Resurrección', 'https://www.hermandaddelaresurreccion.com/ficha-cofradia/', 'web', 'Hermandad de la Resurrección', '2026-09-13', 'Identidad, hábito, pasos y música vigente.')
on conflict (id) do update set
  name = excluded.name,
  url = excluded.url,
  source_type = excluded.source_type,
  author_or_publisher = excluded.author_or_publisher,
  accessed_at = excluded.accessed_at,
  notes = excluded.notes;

insert into public.sources (id, name, url, source_type, author_or_publisher, accessed_at, notes)
values ('c5dcb794-f1b3-49bd-ac4e-f352dfbcbf1f', 'Pasos · Hermandad de la Resurrección', 'https://www.hermandaddelaresurreccion.com/pasos/', 'web', 'Hermandad de la Resurrección', '2026-09-13', 'Descripción oficial del paso de Cristo y del palio.')
on conflict (id) do update set
  name = excluded.name,
  url = excluded.url,
  source_type = excluded.source_type,
  author_or_publisher = excluded.author_or_publisher,
  accessed_at = excluded.accessed_at,
  notes = excluded.notes;

insert into public.sources (id, name, url, source_type, author_or_publisher, accessed_at, notes)
values ('a0c9f05e-f929-4884-86cf-69892728b308', 'Sagrada Resurrección de Nuestro Señor Jesucristo', 'https://www.hermandaddelaresurreccion.com/sagrada-resurreccion/', 'web', 'Hermandad de la Resurrección', '2026-09-13', 'Autoría, material, medidas, bendición e intervenciones.')
on conflict (id) do update set
  name = excluded.name,
  url = excluded.url,
  source_type = excluded.source_type,
  author_or_publisher = excluded.author_or_publisher,
  accessed_at = excluded.accessed_at,
  notes = excluded.notes;

insert into public.sources (id, name, url, source_type, author_or_publisher, accessed_at, notes)
values ('fe43aace-4eec-433a-8c4b-ac5be094ab31', 'Nuestra Señora de la Aurora', 'https://www.hermandaddelaresurreccion.com/nuestra-senora-de-la-aurora/', 'web', 'Hermandad de la Resurrección', '2026-09-13', 'Autoría, material y bendición de la dolorosa.')
on conflict (id) do update set
  name = excluded.name,
  url = excluded.url,
  source_type = excluded.source_type,
  author_or_publisher = excluded.author_or_publisher,
  accessed_at = excluded.accessed_at,
  notes = excluded.notes;

insert into public.sources (id, name, url, source_type, author_or_publisher, accessed_at, notes)
values ('56e34e47-2437-4491-b14e-1e667f8729ab', 'Otros titulares · Hermandad de la Resurrección', 'https://www.hermandaddelaresurreccion.com/otros-titulares/', 'web', 'Hermandad de la Resurrección', '2026-09-13', 'María Santísima del Amor, Santa Marina y San Juan Bautista de La Salle.')
on conflict (id) do update set
  name = excluded.name,
  url = excluded.url,
  source_type = excluded.source_type,
  author_or_publisher = excluded.author_or_publisher,
  accessed_at = excluded.accessed_at,
  notes = excluded.notes;

insert into public.sources (id, name, url, source_type, author_or_publisher, accessed_at, notes)
values ('bb9bce21-1fb1-4008-9a5b-89b04dfc802b', 'Actualidad y agenda · Hermandad de la Resurrección', 'https://www.hermandaddelaresurreccion.com/', 'web', 'Hermandad de la Resurrección', '2026-09-13', 'Cultos anunciados para septiembre de 2026 y canales oficiales.')
on conflict (id) do update set
  name = excluded.name,
  url = excluded.url,
  source_type = excluded.source_type,
  author_or_publisher = excluded.author_or_publisher,
  accessed_at = excluded.accessed_at,
  notes = excluded.notes;

insert into public.sources (id, name, url, source_type, author_or_publisher, accessed_at, notes)
values ('efb021de-95e0-412f-b529-47add102612a', 'Horario e itinerario de la estación de penitencia 2026', 'https://www.hermandaddelaresurreccion.com/informacion-sobre-el-horario-e-itinerario-de-la-estacion-de-penitencia-2026/', 'web', 'Hermandad de la Resurrección', '2026-09-13', 'Fecha, horarios e itinerario oficial de 2026.')
on conflict (id) do update set
  name = excluded.name,
  url = excluded.url,
  source_type = excluded.source_type,
  author_or_publisher = excluded.author_or_publisher,
  accessed_at = excluded.accessed_at,
  notes = excluded.notes;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('e6af042a-9ce8-41e3-a243-f11553bc532b', 'agent', 'Jesús Santos Calero', 'jesus-santos-calero', 'Escultor documentado de María Santísima del Amor.', 'published')
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.agents (entity_id, agent_kind, description)
values ('e6af042a-9ce8-41e3-a243-f11553bc532b', 'person', 'Escultor documentado de María Santísima del Amor.')
on conflict (entity_id) do update set
  agent_kind = excluded.agent_kind,
  description = excluded.description;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('74423dbf-4d3d-4c2e-945f-620f67d17b55', 'agent', 'Miguel Ángel Pérez Fernández', 'miguel-angel-perez-fernandez', 'Escultor y restaurador documentado por la Hermandad.', 'published')
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.agents (entity_id, agent_kind, description)
values ('74423dbf-4d3d-4c2e-945f-620f67d17b55', 'person', 'Escultor y restaurador documentado por la Hermandad.')
on conflict (entity_id) do update set
  agent_kind = excluded.agent_kind,
  description = excluded.description;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('8ce933e8-0b82-420b-b14f-356aaf04c2ae', 'agent', 'Ricardo Llamas León', 'ricardo-llamas-leon', 'Escultor documentado por la Hermandad.', 'published')
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.agents (entity_id, agent_kind, description)
values ('8ce933e8-0b82-420b-b14f-356aaf04c2ae', 'person', 'Escultor documentado por la Hermandad.')
on conflict (entity_id) do update set
  agent_kind = excluded.agent_kind,
  description = excluded.description;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('f5425304-10bc-4f7f-a876-59fc2a8b1d56', 'image', 'Sagrada Resurrección de Nuestro Señor Jesucristo', 'sagrada-resurreccion-nuestro-senor-jesucristo', 'Obra de Francisco Buiza Fernández, bendecida el 14 de abril de 1973.', 'published')
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.images (entity_id, image_type, execution_date_text, material, current_condition, dimensions_text, description, is_dress_image)
values ('f5425304-10bc-4f7f-a876-59fc2a8b1d56', 'Cristo resucitado', '1973', 'Madera de pino policromada', 'extant', '1,74 m; bloque escultórico de 2,10 m', 'Obra de Francisco Buiza Fernández, bendecida el 14 de abril de 1973.', false)
on conflict (entity_id) do update set
  image_type = excluded.image_type,
  execution_date_text = excluded.execution_date_text,
  material = excluded.material,
  current_condition = excluded.current_condition,
  dimensions_text = excluded.dimensions_text,
  description = excluded.description,
  is_dress_image = excluded.is_dress_image;

insert into public.brotherhood_images (id, brotherhood_entity_id, image_entity_id, relation_type, date_from_text, notes, status)
values ('a8b2a78c-4b92-44cb-818f-539f9af08aca', '4994d166-adcc-4a52-84ec-61473540ed82', 'f5425304-10bc-4f7f-a876-59fc2a8b1d56', 'titular', '1973', 'Titular vigente documentado por la Hermandad.', 'published')
on conflict (id) do update set
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  image_entity_id = excluded.image_entity_id,
  relation_type = excluded.relation_type,
  date_from_text = excluded.date_from_text,
  notes = excluded.notes,
  status = excluded.status;

insert into public.image_authorships (id, image_entity_id, agent_entity_id, authorship_type, role_name, date_from_text, certainty, notes, status)
values ('a5e3cd84-6206-4188-b424-6d7abb997a41', 'f5425304-10bc-4f7f-a876-59fc2a8b1d56', '160be307-5396-41a2-8903-7467a8c330f3', 'author', 'escultor', '1973', 'documented', 'Autoría documentada por la ficha oficial.', 'published')
on conflict (id) do update set
  image_entity_id = excluded.image_entity_id,
  agent_entity_id = excluded.agent_entity_id,
  authorship_type = excluded.authorship_type,
  role_name = excluded.role_name,
  date_from_text = excluded.date_from_text,
  certainty = excluded.certainty,
  notes = excluded.notes,
  status = excluded.status;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('4b2c83d4-701d-49b6-bca3-11dd85d4b9e9', 'image', 'Nuestra Señora de la Aurora', 'nuestra-senora-aurora-resurreccion', 'Dolorosa de Antonio Joaquín Dubé de Luque, bendecida el 29 de octubre de 1978.', 'published')
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.images (entity_id, image_type, execution_date_text, material, current_condition, description, is_dress_image)
values ('4b2c83d4-701d-49b6-bca3-11dd85d4b9e9', 'Dolorosa de candelero', '1978', 'Madera de cedro policromada', 'extant', 'Dolorosa de Antonio Joaquín Dubé de Luque, bendecida el 29 de octubre de 1978.', true)
on conflict (entity_id) do update set
  image_type = excluded.image_type,
  execution_date_text = excluded.execution_date_text,
  material = excluded.material,
  current_condition = excluded.current_condition,
  description = excluded.description,
  is_dress_image = excluded.is_dress_image;

insert into public.brotherhood_images (id, brotherhood_entity_id, image_entity_id, relation_type, date_from_text, notes, status)
values ('6113e2a3-0f61-4f8c-bf14-cd32666ca430', '4994d166-adcc-4a52-84ec-61473540ed82', '4b2c83d4-701d-49b6-bca3-11dd85d4b9e9', 'titular', '1978', 'Titular vigente documentado por la Hermandad.', 'published')
on conflict (id) do update set
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  image_entity_id = excluded.image_entity_id,
  relation_type = excluded.relation_type,
  date_from_text = excluded.date_from_text,
  notes = excluded.notes,
  status = excluded.status;

insert into public.image_authorships (id, image_entity_id, agent_entity_id, authorship_type, role_name, date_from_text, certainty, notes, status)
values ('eea69f37-8add-44bc-87b2-dc227a83b3e1', '4b2c83d4-701d-49b6-bca3-11dd85d4b9e9', '75cfa838-7f68-492e-b49f-e308c0a38496', 'author', 'escultor', '1978', 'documented', 'Autoría documentada por la ficha oficial.', 'published')
on conflict (id) do update set
  image_entity_id = excluded.image_entity_id,
  agent_entity_id = excluded.agent_entity_id,
  authorship_type = excluded.authorship_type,
  role_name = excluded.role_name,
  date_from_text = excluded.date_from_text,
  certainty = excluded.certainty,
  notes = excluded.notes,
  status = excluded.status;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('79387715-05a9-478e-b7d1-6fb84b21bcf3', 'image', 'María Santísima del Amor', 'maria-santisima-amor-resurreccion', 'Primera dolorosa de la corporación, obra de Jesús Santos Calero; regresó a la Hermandad en 1994 y es titular desde 2005.', 'published')
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.images (entity_id, image_type, execution_date_text, current_condition, description, is_dress_image)
values ('79387715-05a9-478e-b7d1-6fb84b21bcf3', 'Dolorosa', '1969', 'extant', 'Primera dolorosa de la corporación, obra de Jesús Santos Calero; regresó a la Hermandad en 1994 y es titular desde 2005.', true)
on conflict (entity_id) do update set
  image_type = excluded.image_type,
  execution_date_text = excluded.execution_date_text,
  current_condition = excluded.current_condition,
  description = excluded.description,
  is_dress_image = excluded.is_dress_image;

insert into public.brotherhood_images (id, brotherhood_entity_id, image_entity_id, relation_type, date_from_text, notes, status)
values ('d5d29579-c545-4306-b4f3-6a28bd89bf1e', '4994d166-adcc-4a52-84ec-61473540ed82', '79387715-05a9-478e-b7d1-6fb84b21bcf3', 'titular', 'Desde 2005', 'Titular vigente documentado por la Hermandad.', 'published')
on conflict (id) do update set
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  image_entity_id = excluded.image_entity_id,
  relation_type = excluded.relation_type,
  date_from_text = excluded.date_from_text,
  notes = excluded.notes,
  status = excluded.status;

insert into public.image_authorships (id, image_entity_id, agent_entity_id, authorship_type, role_name, date_from_text, certainty, notes, status)
values ('d8a2497e-4dac-48ca-8785-f2a43421bbee', '79387715-05a9-478e-b7d1-6fb84b21bcf3', 'e6af042a-9ce8-41e3-a243-f11553bc532b', 'author', 'escultor', '1969', 'documented', 'Autoría documentada por la ficha oficial.', 'published')
on conflict (id) do update set
  image_entity_id = excluded.image_entity_id,
  agent_entity_id = excluded.agent_entity_id,
  authorship_type = excluded.authorship_type,
  role_name = excluded.role_name,
  date_from_text = excluded.date_from_text,
  certainty = excluded.certainty,
  notes = excluded.notes,
  status = excluded.status;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('556ae4a4-0ee3-4efd-befe-7e0b4de12458', 'image', 'Santa Marina', 'santa-marina-resurreccion', 'Imagen de Miguel Ángel Pérez Fernández y Ricardo Llamas León, bendecida el 15 de julio de 2007.', 'published')
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.images (entity_id, image_type, execution_date_text, material, current_condition, description, is_dress_image)
values ('556ae4a4-0ee3-4efd-befe-7e0b4de12458', 'Santa mártir', '2007', 'Madera policromada', 'extant', 'Imagen de Miguel Ángel Pérez Fernández y Ricardo Llamas León, bendecida el 15 de julio de 2007.', false)
on conflict (entity_id) do update set
  image_type = excluded.image_type,
  execution_date_text = excluded.execution_date_text,
  material = excluded.material,
  current_condition = excluded.current_condition,
  description = excluded.description,
  is_dress_image = excluded.is_dress_image;

insert into public.brotherhood_images (id, brotherhood_entity_id, image_entity_id, relation_type, date_from_text, notes, status)
values ('3669bfe7-3962-45e6-aa97-a3696f81ad11', '4994d166-adcc-4a52-84ec-61473540ed82', '556ae4a4-0ee3-4efd-befe-7e0b4de12458', 'titular', 'Desde 2005', 'Titular vigente documentado por la Hermandad.', 'published')
on conflict (id) do update set
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  image_entity_id = excluded.image_entity_id,
  relation_type = excluded.relation_type,
  date_from_text = excluded.date_from_text,
  notes = excluded.notes,
  status = excluded.status;

insert into public.image_authorships (id, image_entity_id, agent_entity_id, authorship_type, role_name, date_from_text, certainty, notes, status)
values ('9ea27b41-8f92-4913-a6e5-4527d4de4451', '556ae4a4-0ee3-4efd-befe-7e0b4de12458', '74423dbf-4d3d-4c2e-945f-620f67d17b55', 'author', 'escultor', '2007', 'documented', 'Autoría documentada por la ficha oficial.', 'published')
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
values ('2e06b587-fed6-4377-a00c-a2bc8f03ed1f', '556ae4a4-0ee3-4efd-befe-7e0b4de12458', '8ce933e8-0b82-420b-b14f-356aaf04c2ae', 'author', 'escultor', '2007', 'documented', 'Coautoría documentada por la ficha oficial.', 'published')
on conflict (id) do update set
  image_entity_id = excluded.image_entity_id,
  agent_entity_id = excluded.agent_entity_id,
  authorship_type = excluded.authorship_type,
  role_name = excluded.role_name,
  date_from_text = excluded.date_from_text,
  certainty = excluded.certainty,
  notes = excluded.notes,
  status = excluded.status;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('4fa12803-73a4-4baa-ba0a-0824f654b8df', 'image', 'San Juan Bautista de La Salle', 'san-juan-bautista-la-salle-resurreccion', 'Imagen de Miguel Ángel Pérez Fernández y Ricardo Llamas León realizada en 2008.', 'published')
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.images (entity_id, image_type, execution_date_text, material, current_condition, description, is_dress_image)
values ('4fa12803-73a4-4baa-ba0a-0824f654b8df', 'Santo fundador', '2008', 'Madera de cedro policromada', 'extant', 'Imagen de Miguel Ángel Pérez Fernández y Ricardo Llamas León realizada en 2008.', false)
on conflict (entity_id) do update set
  image_type = excluded.image_type,
  execution_date_text = excluded.execution_date_text,
  material = excluded.material,
  current_condition = excluded.current_condition,
  description = excluded.description,
  is_dress_image = excluded.is_dress_image;

insert into public.brotherhood_images (id, brotherhood_entity_id, image_entity_id, relation_type, date_from_text, notes, status)
values ('325d8d6f-420c-4fd9-a486-05fd82626686', '4994d166-adcc-4a52-84ec-61473540ed82', '4fa12803-73a4-4baa-ba0a-0824f654b8df', 'titular', 'Desde 2005', 'Titular vigente documentado por la Hermandad.', 'published')
on conflict (id) do update set
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  image_entity_id = excluded.image_entity_id,
  relation_type = excluded.relation_type,
  date_from_text = excluded.date_from_text,
  notes = excluded.notes,
  status = excluded.status;

insert into public.image_authorships (id, image_entity_id, agent_entity_id, authorship_type, role_name, date_from_text, certainty, notes, status)
values ('f34ca835-0da1-4147-8cba-fafcab96b531', '4fa12803-73a4-4baa-ba0a-0824f654b8df', '74423dbf-4d3d-4c2e-945f-620f67d17b55', 'author', 'escultor', '2008', 'documented', 'Autoría documentada por la ficha oficial.', 'published')
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
values ('f25391b7-8f88-4aec-9adc-394181946b43', '4fa12803-73a4-4baa-ba0a-0824f654b8df', '8ce933e8-0b82-420b-b14f-356aaf04c2ae', 'author', 'escultor', '2008', 'documented', 'Coautoría documentada por la ficha oficial.', 'published')
on conflict (id) do update set
  image_entity_id = excluded.image_entity_id,
  agent_entity_id = excluded.agent_entity_id,
  authorship_type = excluded.authorship_type,
  role_name = excluded.role_name,
  date_from_text = excluded.date_from_text,
  certainty = excluded.certainty,
  notes = excluded.notes,
  status = excluded.status;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('4d28d6db-f4eb-4683-80d2-5e8b7caa59a7', 'step', 'Paso de la Sagrada Resurrección', 'paso-sagrada-resurreccion-sevilla', 'Paso de madera tallada y dorada diseñado y ejecutado originalmente por José Martínez en 1973, con reforma integral desarrollada entre 2013 y 2016 y nuevos elementos completados hasta 2022.', 'published')
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.steps (entity_id, step_type, execution_date_text, current_condition, description, current_state_notes)
values ('4d28d6db-f4eb-4683-80d2-5e8b7caa59a7', 'misterio', '1973; reformado entre 2013 y 2016', 'preserved', 'Paso de madera tallada y dorada diseñado y ejecutado originalmente por José Martínez en 1973, con reforma integral desarrollada entre 2013 y 2016 y nuevos elementos completados hasta 2022.', 'Configuración actual documentada por la Hermandad.')
on conflict (entity_id) do update set
  step_type = excluded.step_type,
  execution_date_text = excluded.execution_date_text,
  current_condition = excluded.current_condition,
  description = excluded.description,
  current_state_notes = excluded.current_state_notes;

insert into public.brotherhood_steps (id, brotherhood_entity_id, step_entity_id, relation_type, date_from_text, notes, status)
values ('0d3816fd-9ab8-43fb-85b2-1608ada83759', '4994d166-adcc-4a52-84ec-61473540ed82', '4d28d6db-f4eb-4683-80d2-5e8b7caa59a7', 'processional_step', '1973; reformado entre 2013 y 2016', 'Paso procesional vigente.', 'published')
on conflict (id) do update set
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  step_entity_id = excluded.step_entity_id,
  relation_type = excluded.relation_type,
  date_from_text = excluded.date_from_text,
  notes = excluded.notes,
  status = excluded.status;

insert into public.image_steps (id, image_entity_id, step_entity_id, relation_type, date_from_text, notes, status)
values ('768ac008-1837-4ff6-b2c5-dd2ac9fe7051', 'f5425304-10bc-4f7f-a876-59fc2a8b1d56', '4d28d6db-f4eb-4683-80d2-5e8b7caa59a7', 'processes_on', '1973; reformado entre 2013 y 2016', 'Relación procesional vigente.', 'published')
on conflict (id) do update set
  image_entity_id = excluded.image_entity_id,
  step_entity_id = excluded.step_entity_id,
  relation_type = excluded.relation_type,
  date_from_text = excluded.date_from_text,
  notes = excluded.notes,
  status = excluded.status;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('0451579b-abe8-401f-ae86-1740941a2093', 'step', 'Paso de palio de Nuestra Señora de la Aurora', 'paso-palio-aurora-resurreccion', 'Paso de palio con orfebrería de los Hermanos Delgado López y bordados de José Ramón Paleteiro; la parihuela actual fue realizada en 2019 por Juan Amador García Casas.', 'published')
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.steps (entity_id, step_type, execution_date_text, current_condition, description, current_state_notes)
values ('0451579b-abe8-401f-ae86-1740941a2093', 'palio', 'Conjunto iniciado en 1987; parihuela actual de 2019', 'preserved', 'Paso de palio con orfebrería de los Hermanos Delgado López y bordados de José Ramón Paleteiro; la parihuela actual fue realizada en 2019 por Juan Amador García Casas.', 'Configuración actual documentada por la Hermandad.')
on conflict (entity_id) do update set
  step_type = excluded.step_type,
  execution_date_text = excluded.execution_date_text,
  current_condition = excluded.current_condition,
  description = excluded.description,
  current_state_notes = excluded.current_state_notes;

insert into public.brotherhood_steps (id, brotherhood_entity_id, step_entity_id, relation_type, date_from_text, notes, status)
values ('dcd874d0-f782-4484-a85c-a232b799feb1', '4994d166-adcc-4a52-84ec-61473540ed82', '0451579b-abe8-401f-ae86-1740941a2093', 'processional_step', 'Conjunto iniciado en 1987; parihuela actual de 2019', 'Paso procesional vigente.', 'published')
on conflict (id) do update set
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  step_entity_id = excluded.step_entity_id,
  relation_type = excluded.relation_type,
  date_from_text = excluded.date_from_text,
  notes = excluded.notes,
  status = excluded.status;

insert into public.image_steps (id, image_entity_id, step_entity_id, relation_type, date_from_text, notes, status)
values ('64c5f2a4-ef67-4783-9014-bbdb9731ae57', '4b2c83d4-701d-49b6-bca3-11dd85d4b9e9', '0451579b-abe8-401f-ae86-1740941a2093', 'processes_on', 'Conjunto iniciado en 1987; parihuela actual de 2019', 'Relación procesional vigente.', 'published')
on conflict (id) do update set
  image_entity_id = excluded.image_entity_id,
  step_entity_id = excluded.step_entity_id,
  relation_type = excluded.relation_type,
  date_from_text = excluded.date_from_text,
  notes = excluded.notes,
  status = excluded.status;

insert into public.brotherhood_habits (id, brotherhood_entity_id, name, tunic_description, hood_description, cord_description, buttons_description, shield_description, notes, status, sort_order)
values ('c27cf432-2441-40c1-9c4f-4e837b658374', '4994d166-adcc-4a52-84ec-61473540ed82', 'Hábito nazareno', 'Túnica y capa blancas.', 'Antifaz blanco con el escudo de La Salle.', 'Cíngulo azul y blanco.', 'Botonadura y bocamangas azules.', 'Escudo de la Hermandad sobre el lado izquierdo de la capa.', 'Descripción textual oficial; no se publica imagen sin autorización.', 'published', 1)
on conflict (id) do update set
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  name = excluded.name,
  tunic_description = excluded.tunic_description,
  hood_description = excluded.hood_description,
  cord_description = excluded.cord_description,
  buttons_description = excluded.buttons_description,
  shield_description = excluded.shield_description,
  notes = excluded.notes,
  status = excluded.status,
  sort_order = excluded.sort_order;

insert into public.cults (id, brotherhood_entity_id, image_entity_id, cult_type, title, date_rule, month, place_id, description, status, is_recurring, recurrence_label, display_order)
values ('609ae08c-bcca-446d-939a-aa8a05031d2b', '4994d166-adcc-4a52-84ec-61473540ed82', '4b2c83d4-701d-49b6-bca3-11dd85d4b9e9', 'triduo', 'Triduo a Nuestra Señora de la Aurora', 'Primeros días de septiembre', 9, '0f5d685a-cceb-4dd7-afc4-38fdbde0249a', 'Culto interno documentado en la agenda oficial de la Hermandad.', 'published', true, 'Primeros días de septiembre', 1)
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
  display_order = excluded.display_order;

insert into public.cult_entities (id, cult_id, entity_id, role, notes)
values ('d70bc660-beda-40a0-a7cc-0a9b470dbea6', '609ae08c-bcca-446d-939a-aa8a05031d2b', '4b2c83d4-701d-49b6-bca3-11dd85d4b9e9', 'honoree', 'Relación explícita del culto.')
on conflict (id) do update set
  cult_id = excluded.cult_id,
  entity_id = excluded.entity_id,
  role = excluded.role,
  notes = excluded.notes;

insert into public.cults (id, brotherhood_entity_id, image_entity_id, cult_type, title, date_rule, month, place_id, description, status, is_recurring, recurrence_label, display_order)
values ('cade81aa-4bf8-41ad-be06-112a4802c428', '4994d166-adcc-4a52-84ec-61473540ed82', '4b2c83d4-701d-49b6-bca3-11dd85d4b9e9', 'funcion', 'Función a Nuestra Señora de la Aurora', '8 de septiembre', 9, '0f5d685a-cceb-4dd7-afc4-38fdbde0249a', 'Culto interno documentado en la agenda oficial de la Hermandad.', 'published', true, '8 de septiembre', 2)
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
  display_order = excluded.display_order;

insert into public.cult_entities (id, cult_id, entity_id, role, notes)
values ('fdea3b39-e455-4e78-81aa-721f8e2e458d', 'cade81aa-4bf8-41ad-be06-112a4802c428', '4b2c83d4-701d-49b6-bca3-11dd85d4b9e9', 'honoree', 'Relación explícita del culto.')
on conflict (id) do update set
  cult_id = excluded.cult_id,
  entity_id = excluded.entity_id,
  role = excluded.role,
  notes = excluded.notes;

insert into public.cults (id, brotherhood_entity_id, cult_type, title, date_rule, month, place_id, description, status, is_recurring, recurrence_label, display_order)
values ('83787a5c-9e5a-42c8-a369-bf9645315008', '4994d166-adcc-4a52-84ec-61473540ed82', 'funcion', 'Función de la Santa Cruz', '14 de septiembre', 9, '0f5d685a-cceb-4dd7-afc4-38fdbde0249a', 'Culto interno documentado en la agenda oficial de la Hermandad.', 'published', true, '14 de septiembre', 3)
on conflict (id) do update set
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  cult_type = excluded.cult_type,
  title = excluded.title,
  date_rule = excluded.date_rule,
  month = excluded.month,
  place_id = excluded.place_id,
  description = excluded.description,
  status = excluded.status,
  is_recurring = excluded.is_recurring,
  recurrence_label = excluded.recurrence_label,
  display_order = excluded.display_order;

insert into public.cult_entities (id, cult_id, entity_id, role, notes)
values ('e85210d9-b4f7-4b5d-98ae-6e3d8c71be0f', '83787a5c-9e5a-42c8-a369-bf9645315008', '4994d166-adcc-4a52-84ec-61473540ed82', 'organizer', 'Relación explícita del culto.')
on conflict (id) do update set
  cult_id = excluded.cult_id,
  entity_id = excluded.entity_id,
  role = excluded.role,
  notes = excluded.notes;

insert into public.cults (id, brotherhood_entity_id, cult_type, title, date_rule, place_id, description, status, is_recurring, recurrence_label, display_order)
values ('226ea85e-915a-44f0-8f0a-9ec80485af98', '4994d166-adcc-4a52-84ec-61473540ed82', 'culto eucarístico', 'Culto eucarístico mensual', 'Periodicidad mensual anunciada por la Hermandad', '0f5d685a-cceb-4dd7-afc4-38fdbde0249a', 'Culto interno documentado en la agenda oficial de la Hermandad.', 'published', true, 'Periodicidad mensual anunciada por la Hermandad', 4)
on conflict (id) do update set
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  cult_type = excluded.cult_type,
  title = excluded.title,
  date_rule = excluded.date_rule,
  place_id = excluded.place_id,
  description = excluded.description,
  status = excluded.status,
  is_recurring = excluded.is_recurring,
  recurrence_label = excluded.recurrence_label,
  display_order = excluded.display_order;

insert into public.cult_entities (id, cult_id, entity_id, role, notes)
values ('d6c0e441-6cce-4b5d-a431-8204fa7cc2de', '226ea85e-915a-44f0-8f0a-9ec80485af98', '4994d166-adcc-4a52-84ec-61473540ed82', 'organizer', 'Relación explícita del culto.')
on conflict (id) do update set
  cult_id = excluded.cult_id,
  entity_id = excluded.entity_id,
  role = excluded.role,
  notes = excluded.notes;

insert into public.cult_occurrences (id, cult_id, year, start_date, end_date, place_id, event_status, status, notes)
values ('0d1627a8-056e-40b9-ab8f-6c75563a096f', '609ae08c-bcca-446d-939a-aa8a05031d2b', 2026, '2026-09-05', '2026-09-07', '0f5d685a-cceb-4dd7-afc4-38fdbde0249a', 'held', 'published', 'Edición 2026 documentada en la agenda oficial consultada el 13 de septiembre.')
on conflict (id) do update set
  cult_id = excluded.cult_id,
  year = excluded.year,
  start_date = excluded.start_date,
  end_date = excluded.end_date,
  place_id = excluded.place_id,
  event_status = excluded.event_status,
  status = excluded.status,
  notes = excluded.notes;

insert into public.cult_occurrences (id, cult_id, year, start_date, end_date, place_id, event_status, status, notes)
values ('650cd1f5-69ef-4907-bcd2-500ad31a466d', 'cade81aa-4bf8-41ad-be06-112a4802c428', 2026, '2026-09-08', '2026-09-08', '0f5d685a-cceb-4dd7-afc4-38fdbde0249a', 'held', 'published', 'Edición 2026 documentada en la agenda oficial consultada el 13 de septiembre.')
on conflict (id) do update set
  cult_id = excluded.cult_id,
  year = excluded.year,
  start_date = excluded.start_date,
  end_date = excluded.end_date,
  place_id = excluded.place_id,
  event_status = excluded.event_status,
  status = excluded.status,
  notes = excluded.notes;

insert into public.cult_occurrences (id, cult_id, year, start_date, end_date, place_id, event_status, status, notes)
values ('516a9cda-af3e-4d46-bcb7-8310a370f566', '83787a5c-9e5a-42c8-a369-bf9645315008', 2026, '2026-09-14', '2026-09-14', '0f5d685a-cceb-4dd7-afc4-38fdbde0249a', 'announced', 'published', 'Edición 2026 documentada en la agenda oficial consultada el 13 de septiembre.')
on conflict (id) do update set
  cult_id = excluded.cult_id,
  year = excluded.year,
  start_date = excluded.start_date,
  end_date = excluded.end_date,
  place_id = excluded.place_id,
  event_status = excluded.event_status,
  status = excluded.status,
  notes = excluded.notes;

insert into public.cult_occurrences (id, cult_id, year, start_date, end_date, place_id, event_status, status, notes)
values ('a2d02fbe-a89c-4ab4-9c43-4aa32291abf6', '226ea85e-915a-44f0-8f0a-9ec80485af98', 2026, '2026-09-24', '2026-09-24', '0f5d685a-cceb-4dd7-afc4-38fdbde0249a', 'announced', 'published', 'Edición 2026 documentada en la agenda oficial consultada el 13 de septiembre.')
on conflict (id) do update set
  cult_id = excluded.cult_id,
  year = excluded.year,
  start_date = excluded.start_date,
  end_date = excluded.end_date,
  place_id = excluded.place_id,
  event_status = excluded.event_status,
  status = excluded.status,
  notes = excluded.notes;

insert into public.cult_occurrence_days (id, cult_occurrence_id, day_number, day_label, celebration_date, place_id)
values ('b2eedab6-071e-44c8-b70f-789244566db5', '0d1627a8-056e-40b9-ab8f-6c75563a096f', 1, 'Día 1', '2026-09-05', '0f5d685a-cceb-4dd7-afc4-38fdbde0249a')
on conflict (id) do update set
  cult_occurrence_id = excluded.cult_occurrence_id,
  day_number = excluded.day_number,
  day_label = excluded.day_label,
  celebration_date = excluded.celebration_date,
  place_id = excluded.place_id;

insert into public.cult_occurrence_days (id, cult_occurrence_id, day_number, day_label, celebration_date, place_id)
values ('55a8d48d-2e01-4cca-8a72-b013208bf401', '0d1627a8-056e-40b9-ab8f-6c75563a096f', 2, 'Día 2', '2026-09-06', '0f5d685a-cceb-4dd7-afc4-38fdbde0249a')
on conflict (id) do update set
  cult_occurrence_id = excluded.cult_occurrence_id,
  day_number = excluded.day_number,
  day_label = excluded.day_label,
  celebration_date = excluded.celebration_date,
  place_id = excluded.place_id;

insert into public.cult_occurrence_days (id, cult_occurrence_id, day_number, day_label, celebration_date, place_id)
values ('c302ce77-e571-4ea5-97f0-711a212933d7', '0d1627a8-056e-40b9-ab8f-6c75563a096f', 3, 'Día 3', '2026-09-07', '0f5d685a-cceb-4dd7-afc4-38fdbde0249a')
on conflict (id) do update set
  cult_occurrence_id = excluded.cult_occurrence_id,
  day_number = excluded.day_number,
  day_label = excluded.day_label,
  celebration_date = excluded.celebration_date,
  place_id = excluded.place_id;

insert into public.outings (id, brotherhood_entity_id, outing_type, character, title, outing_date, return_date, year, departure_time, return_time, municipality_id, origin_place_id, destination_place_id, route_summary, description, event_status, status, organizer_name, slug, reference_code)
values ('a7e8f388-2723-46d5-a4af-2a495ce03e5c', '4994d166-adcc-4a52-84ec-61473540ed82', 'station_of_penance', 'ordinary', 'Estación de penitencia 2026', '2026-04-05', '2026-04-05', 2026, '08:15', '16:30', 'ca85889c-21fe-4367-8477-a57656b25da4', '0f5d685a-cceb-4dd7-afc4-38fdbde0249a', '0f5d685a-cceb-4dd7-afc4-38fdbde0249a', 'Santa Marina, San Luis, Feria, Alameda de Hércules, centro histórico, carrera oficial y regreso a Santa Marina.', 'Estación de penitencia del Domingo de Resurrección con los pasos de la Sagrada Resurrección y Nuestra Señora de la Aurora.', 'held', 'published', 'Hermandad de la Resurrección', 'estacion-penitencia-resurreccion-sevilla-2026', 'RES-SEV-2026')
on conflict (id) do update set
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  outing_type = excluded.outing_type,
  character = excluded.character,
  title = excluded.title,
  outing_date = excluded.outing_date,
  return_date = excluded.return_date,
  year = excluded.year,
  departure_time = excluded.departure_time,
  return_time = excluded.return_time,
  municipality_id = excluded.municipality_id,
  origin_place_id = excluded.origin_place_id,
  destination_place_id = excluded.destination_place_id,
  route_summary = excluded.route_summary,
  description = excluded.description,
  event_status = excluded.event_status,
  status = excluded.status,
  organizer_name = excluded.organizer_name,
  slug = excluded.slug,
  reference_code = excluded.reference_code;

insert into public.outing_entities (id, outing_id, entity_id, role, notes)
values ('9ec53881-6933-4435-a51f-aca718cf8227', 'a7e8f388-2723-46d5-a4af-2a495ce03e5c', 'f5425304-10bc-4f7f-a876-59fc2a8b1d56', 'titular', 'Titular participante en la estación de penitencia.')
on conflict (id) do update set
  outing_id = excluded.outing_id,
  entity_id = excluded.entity_id,
  role = excluded.role,
  notes = excluded.notes;

insert into public.outing_entities (id, outing_id, entity_id, role, notes)
values ('31b6ea6b-2656-41de-bfe7-42ae823c21b8', 'a7e8f388-2723-46d5-a4af-2a495ce03e5c', '4b2c83d4-701d-49b6-bca3-11dd85d4b9e9', 'titular', 'Titular participante en la estación de penitencia.')
on conflict (id) do update set
  outing_id = excluded.outing_id,
  entity_id = excluded.entity_id,
  role = excluded.role,
  notes = excluded.notes;

insert into public.outing_music_positions (id, outing_id, position_code, position_label, sequence_no, notes, status)
values ('235ae75f-7edd-48a8-a056-3aaa089ae133', 'a7e8f388-2723-46d5-a4af-2a495ce03e5c', 'cross_guide', 'Cruz de Guía', 1, 'Posición vigente documentada por la ficha oficial.', 'published')
on conflict (id) do update set
  outing_id = excluded.outing_id,
  position_code = excluded.position_code,
  position_label = excluded.position_label,
  sequence_no = excluded.sequence_no,
  notes = excluded.notes,
  status = excluded.status;

insert into public.outing_music_assignments (id, music_position_id, band_entity_id, participation_mode, sequence_no, notes, status)
values ('321843a9-a693-4b48-9f7d-c6b818c5e5fa', '235ae75f-7edd-48a8-a056-3aaa089ae133', 'c4d5e8c5-0613-44c0-ae2b-776c5cd69cf9', 'full_route', 1, 'Acompañamiento documentado para la configuración vigente.', 'published')
on conflict (id) do update set
  music_position_id = excluded.music_position_id,
  band_entity_id = excluded.band_entity_id,
  participation_mode = excluded.participation_mode,
  sequence_no = excluded.sequence_no,
  notes = excluded.notes,
  status = excluded.status;

insert into public.outing_music_positions (id, outing_id, step_entity_id, position_code, position_label, sequence_no, notes, status)
values ('54ab4204-594e-4719-9ef3-240803c428d2', 'a7e8f388-2723-46d5-a4af-2a495ce03e5c', '4d28d6db-f4eb-4683-80d2-5e8b7caa59a7', 'behind_step', 'Tras el paso de la Sagrada Resurrección', 2, 'Posición vigente documentada por la ficha oficial.', 'published')
on conflict (id) do update set
  outing_id = excluded.outing_id,
  step_entity_id = excluded.step_entity_id,
  position_code = excluded.position_code,
  position_label = excluded.position_label,
  sequence_no = excluded.sequence_no,
  notes = excluded.notes,
  status = excluded.status;

insert into public.outing_music_assignments (id, music_position_id, band_entity_id, participation_mode, sequence_no, notes, status)
values ('67ca5e24-ceee-43fc-93d8-837c17e68724', '54ab4204-594e-4719-9ef3-240803c428d2', 'b829bf98-78fa-4f0f-9aeb-cd965c779853', 'full_route', 1, 'Acompañamiento documentado para la configuración vigente.', 'published')
on conflict (id) do update set
  music_position_id = excluded.music_position_id,
  band_entity_id = excluded.band_entity_id,
  participation_mode = excluded.participation_mode,
  sequence_no = excluded.sequence_no,
  notes = excluded.notes,
  status = excluded.status;

insert into public.outing_music_positions (id, outing_id, step_entity_id, position_code, position_label, sequence_no, notes, status)
values ('a86aff1f-68d8-44a8-8b6a-20829fc0cbf5', 'a7e8f388-2723-46d5-a4af-2a495ce03e5c', '0451579b-abe8-401f-ae86-1740941a2093', 'behind_step', 'Tras el paso de Nuestra Señora de la Aurora', 3, 'Posición vigente documentada por la ficha oficial.', 'published')
on conflict (id) do update set
  outing_id = excluded.outing_id,
  step_entity_id = excluded.step_entity_id,
  position_code = excluded.position_code,
  position_label = excluded.position_label,
  sequence_no = excluded.sequence_no,
  notes = excluded.notes,
  status = excluded.status;

insert into public.outing_music_assignments (id, music_position_id, band_entity_id, participation_mode, sequence_no, notes, status)
values ('2c843e4f-75ca-4ae4-a606-f7b8a280ff43', 'a86aff1f-68d8-44a8-8b6a-20829fc0cbf5', 'a23934c9-93e9-4bf1-886e-d98ec170b74f', 'full_route', 1, 'Acompañamiento documentado para la configuración vigente.', 'published')
on conflict (id) do update set
  music_position_id = excluded.music_position_id,
  band_entity_id = excluded.band_entity_id,
  participation_mode = excluded.participation_mode,
  sequence_no = excluded.sequence_no,
  notes = excluded.notes,
  status = excluded.status;

insert into public.music_accompaniment_periods (id, brotherhood_entity_id, band_entity_id, step_entity_id, position, outing_type, year_from, date_from_text, year_to, date_to_text, is_current, notes, status, public_brotherhood_name, public_brotherhood_slug, public_municipality_name, public_municipality_slug, public_province)
values ('dd0ae1ea-597d-4703-9263-b0631f053207', '4994d166-adcc-4a52-84ec-61473540ed82', 'b829bf98-78fa-4f0f-9aeb-cd965c779853', '4d28d6db-f4eb-4683-80d2-5e8b7caa59a7', 'Tras el paso de Cristo', 'station_of_penance', 1983, '1983', 1987, '1987', false, '1983–1987; la cronología oficial corrige el inicio previamente cargado como 1982.', 'published', 'La Resurrección', 'la-resurreccion', 'Sevilla', 'sevilla', 'Sevilla')
on conflict (id) do update set
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  band_entity_id = excluded.band_entity_id,
  step_entity_id = excluded.step_entity_id,
  position = excluded.position,
  outing_type = excluded.outing_type,
  year_from = excluded.year_from,
  date_from_text = excluded.date_from_text,
  year_to = excluded.year_to,
  date_to_text = excluded.date_to_text,
  is_current = excluded.is_current,
  notes = excluded.notes,
  status = excluded.status,
  public_brotherhood_name = excluded.public_brotherhood_name,
  public_brotherhood_slug = excluded.public_brotherhood_slug,
  public_municipality_name = excluded.public_municipality_name,
  public_municipality_slug = excluded.public_municipality_slug,
  public_province = excluded.public_province;

insert into public.music_accompaniment_periods (id, brotherhood_entity_id, band_entity_id, step_entity_id, position, outing_type, year_from, date_from_text, is_current, notes, status, public_brotherhood_name, public_brotherhood_slug, public_municipality_name, public_municipality_slug, public_province)
values ('0de5a136-c5b3-4377-9ecc-a22ae9a44c35', '4994d166-adcc-4a52-84ec-61473540ed82', 'b829bf98-78fa-4f0f-9aeb-cd965c779853', '4d28d6db-f4eb-4683-80d2-5e8b7caa59a7', 'Tras el paso de Cristo', 'station_of_penance', 1989, '1989', true, 'Desde 1989; continuidad vigente documentada por la Hermandad.', 'published', 'La Resurrección', 'la-resurreccion', 'Sevilla', 'sevilla', 'Sevilla')
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
  status = excluded.status,
  public_brotherhood_name = excluded.public_brotherhood_name,
  public_brotherhood_slug = excluded.public_brotherhood_slug,
  public_municipality_name = excluded.public_municipality_name,
  public_municipality_slug = excluded.public_municipality_slug,
  public_province = excluded.public_province;

insert into public.music_accompaniment_periods (id, brotherhood_entity_id, band_entity_id, position, outing_type, date_from_text, is_current, notes, status, public_brotherhood_name, public_brotherhood_slug, public_municipality_name, public_municipality_slug, public_province)
values ('1afb4dd9-b122-4432-9bba-6bb4ba4bba68', '4994d166-adcc-4a52-84ec-61473540ed82', 'c4d5e8c5-0613-44c0-ae2b-776c5cd69cf9', 'Cruz de Guía', 'station_of_penance', 'Vigente en 2026; inicio no determinado', true, 'Formación juvenil vigente en la Cruz de Guía; no se fija año inicial no documentado.', 'published', 'La Resurrección', 'la-resurreccion', 'Sevilla', 'sevilla', 'Sevilla')
on conflict (id) do update set
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  band_entity_id = excluded.band_entity_id,
  position = excluded.position,
  outing_type = excluded.outing_type,
  date_from_text = excluded.date_from_text,
  is_current = excluded.is_current,
  notes = excluded.notes,
  status = excluded.status,
  public_brotherhood_name = excluded.public_brotherhood_name,
  public_brotherhood_slug = excluded.public_brotherhood_slug,
  public_municipality_name = excluded.public_municipality_name,
  public_municipality_slug = excluded.public_municipality_slug,
  public_province = excluded.public_province;

insert into public.music_accompaniment_periods (id, brotherhood_entity_id, band_entity_id, step_entity_id, position, outing_type, year_from, date_from_text, year_to, date_to_text, is_current, notes, status, public_brotherhood_name, public_brotherhood_slug, public_municipality_name, public_municipality_slug, public_province)
values ('b218dd81-bb7e-4a38-b094-7ba9d365f700', '4994d166-adcc-4a52-84ec-61473540ed82', 'c6000000-0000-4000-8000-000000000001', '0451579b-abe8-401f-ae86-1740941a2093', 'Tras el paso de palio', 'station_of_penance', 1992, '1992', 1993, '1993', false, 'Acompañamiento histórico de 1992 y 1993.', 'published', 'La Resurrección', 'la-resurreccion', 'Sevilla', 'sevilla', 'Sevilla')
on conflict (id) do update set
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  band_entity_id = excluded.band_entity_id,
  step_entity_id = excluded.step_entity_id,
  position = excluded.position,
  outing_type = excluded.outing_type,
  year_from = excluded.year_from,
  date_from_text = excluded.date_from_text,
  year_to = excluded.year_to,
  date_to_text = excluded.date_to_text,
  is_current = excluded.is_current,
  notes = excluded.notes,
  status = excluded.status,
  public_brotherhood_name = excluded.public_brotherhood_name,
  public_brotherhood_slug = excluded.public_brotherhood_slug,
  public_municipality_name = excluded.public_municipality_name,
  public_municipality_slug = excluded.public_municipality_slug,
  public_province = excluded.public_province;

insert into public.music_accompaniment_periods (id, brotherhood_entity_id, band_entity_id, step_entity_id, position, outing_type, year_from, date_from_text, year_to, date_to_text, is_current, notes, status, public_brotherhood_name, public_brotherhood_slug, public_municipality_name, public_municipality_slug, public_province)
values ('11b34575-c17b-408f-8d05-6f04a8618f9a', '4994d166-adcc-4a52-84ec-61473540ed82', '7a0f25e9-4901-4fb2-b35e-c851c24fb845', '0451579b-abe8-401f-ae86-1740941a2093', 'Tras el paso de palio', 'station_of_penance', 1994, '1994', 1995, '1995', false, 'Acompañamiento histórico de 1994 y 1995.', 'published', 'La Resurrección', 'la-resurreccion', 'Sevilla', 'sevilla', 'Sevilla')
on conflict (id) do update set
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  band_entity_id = excluded.band_entity_id,
  step_entity_id = excluded.step_entity_id,
  position = excluded.position,
  outing_type = excluded.outing_type,
  year_from = excluded.year_from,
  date_from_text = excluded.date_from_text,
  year_to = excluded.year_to,
  date_to_text = excluded.date_to_text,
  is_current = excluded.is_current,
  notes = excluded.notes,
  status = excluded.status,
  public_brotherhood_name = excluded.public_brotherhood_name,
  public_brotherhood_slug = excluded.public_brotherhood_slug,
  public_municipality_name = excluded.public_municipality_name,
  public_municipality_slug = excluded.public_municipality_slug,
  public_province = excluded.public_province;

insert into public.music_accompaniment_periods (id, brotherhood_entity_id, band_entity_id, step_entity_id, position, outing_type, year_from, date_from_text, is_current, notes, status, public_brotherhood_name, public_brotherhood_slug, public_municipality_name, public_municipality_slug, public_province)
values ('d8f3f91f-cbac-4a6f-b230-8a510d6eb52b', '4994d166-adcc-4a52-84ec-61473540ed82', 'a23934c9-93e9-4bf1-886e-d98ec170b74f', '0451579b-abe8-401f-ae86-1740941a2093', 'Tras el paso de palio', 'station_of_penance', 1996, '1996', true, 'Acompañamiento vigente desde 1996.', 'published', 'La Resurrección', 'la-resurreccion', 'Sevilla', 'sevilla', 'Sevilla')
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
  status = excluded.status,
  public_brotherhood_name = excluded.public_brotherhood_name,
  public_brotherhood_slug = excluded.public_brotherhood_slug,
  public_municipality_name = excluded.public_municipality_name,
  public_municipality_slug = excluded.public_municipality_slug,
  public_province = excluded.public_province;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('a28e02d1-15d0-4a98-b4b4-73a65b431c04', 'heritage_asset', 'Canastilla del paso de la Sagrada Resurrección', 'cristo-canastilla', 'Madera tallada y dorada; diseño original de José Martínez y reforma contemporánea documentada por la Hermandad.', 'published')
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.heritage_assets (entity_id, parent_entity_id, asset_type, description, current_condition, date_from_text, is_current, display_order, usage_text)
values ('a28e02d1-15d0-4a98-b4b4-73a65b431c04', '4d28d6db-f4eb-4683-80d2-5e8b7caa59a7', 'canastilla', 'Madera tallada y dorada; diseño original de José Martínez y reforma contemporánea documentada por la Hermandad.', 'Vigente', '1973; reforma 2013–2016', true, 1, 'Integrado en el conjunto procesional de la Hermandad.')
on conflict (entity_id) do update set
  parent_entity_id = excluded.parent_entity_id,
  asset_type = excluded.asset_type,
  description = excluded.description,
  current_condition = excluded.current_condition,
  date_from_text = excluded.date_from_text,
  is_current = excluded.is_current,
  display_order = excluded.display_order,
  usage_text = excluded.usage_text;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('20ebbba6-6746-48aa-8e09-34c9bd3f37a3', 'heritage_asset', 'Candelabros y esquinas del paso de la Sagrada Resurrección', 'cristo-candelabros', 'Conjunto de Francisco Verdugo con cuatro ángeles de Manuel Martín Nieto.', 'published')
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.heritage_assets (entity_id, parent_entity_id, asset_type, description, current_condition, date_from_text, is_current, display_order, usage_text)
values ('20ebbba6-6746-48aa-8e09-34c9bd3f37a3', '4d28d6db-f4eb-4683-80d2-5e8b7caa59a7', 'candelabros', 'Conjunto de Francisco Verdugo con cuatro ángeles de Manuel Martín Nieto.', 'Vigente', 'Completados hasta 2022', true, 2, 'Integrado en el conjunto procesional de la Hermandad.')
on conflict (entity_id) do update set
  parent_entity_id = excluded.parent_entity_id,
  asset_type = excluded.asset_type,
  description = excluded.description,
  current_condition = excluded.current_condition,
  date_from_text = excluded.date_from_text,
  is_current = excluded.is_current,
  display_order = excluded.display_order,
  usage_text = excluded.usage_text;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('89329cd3-a24e-45c9-b3ff-347eb401a292', 'heritage_asset', 'Peana de Nuestra Señora de la Aurora', 'palio-peana', 'Peana de los Hermanos Delgado López.', 'published')
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.heritage_assets (entity_id, parent_entity_id, asset_type, description, current_condition, date_from_text, is_current, display_order, usage_text)
values ('89329cd3-a24e-45c9-b3ff-347eb401a292', '0451579b-abe8-401f-ae86-1740941a2093', 'orfebrería', 'Peana de los Hermanos Delgado López.', 'Vigente', '1987', true, 3, 'Integrado en el conjunto procesional de la Hermandad.')
on conflict (entity_id) do update set
  parent_entity_id = excluded.parent_entity_id,
  asset_type = excluded.asset_type,
  description = excluded.description,
  current_condition = excluded.current_condition,
  date_from_text = excluded.date_from_text,
  is_current = excluded.is_current,
  display_order = excluded.display_order,
  usage_text = excluded.usage_text;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('41eb0412-188c-4e44-803f-16683c76eab9', 'heritage_asset', 'Varales del paso de palio', 'palio-varales', 'Varales ejecutados por los Hermanos Delgado López.', 'published')
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.heritage_assets (entity_id, parent_entity_id, asset_type, description, current_condition, date_from_text, is_current, display_order, usage_text)
values ('41eb0412-188c-4e44-803f-16683c76eab9', '0451579b-abe8-401f-ae86-1740941a2093', 'orfebrería', 'Varales ejecutados por los Hermanos Delgado López.', 'Vigente', '1988–1990', true, 4, 'Integrado en el conjunto procesional de la Hermandad.')
on conflict (entity_id) do update set
  parent_entity_id = excluded.parent_entity_id,
  asset_type = excluded.asset_type,
  description = excluded.description,
  current_condition = excluded.current_condition,
  date_from_text = excluded.date_from_text,
  is_current = excluded.is_current,
  display_order = excluded.display_order,
  usage_text = excluded.usage_text;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('ef4d7e21-0752-4118-8499-7fc06507fd7d', 'heritage_asset', 'Candelería del paso de palio', 'palio-candeleria', 'Candelería de los Hermanos Delgado López.', 'published')
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.heritage_assets (entity_id, parent_entity_id, asset_type, description, current_condition, date_from_text, is_current, display_order, usage_text)
values ('ef4d7e21-0752-4118-8499-7fc06507fd7d', '0451579b-abe8-401f-ae86-1740941a2093', 'orfebrería', 'Candelería de los Hermanos Delgado López.', 'Vigente', '1990', true, 5, 'Integrado en el conjunto procesional de la Hermandad.')
on conflict (entity_id) do update set
  parent_entity_id = excluded.parent_entity_id,
  asset_type = excluded.asset_type,
  description = excluded.description,
  current_condition = excluded.current_condition,
  date_from_text = excluded.date_from_text,
  is_current = excluded.is_current,
  display_order = excluded.display_order,
  usage_text = excluded.usage_text;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('ffebbf82-57de-48ae-a5eb-06faba40c884', 'heritage_asset', 'Respiraderos del paso de palio', 'palio-respiraderos', 'Respiraderos del conjunto procesional de la Aurora.', 'published')
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.heritage_assets (entity_id, parent_entity_id, asset_type, description, current_condition, date_from_text, is_current, display_order, usage_text)
values ('ffebbf82-57de-48ae-a5eb-06faba40c884', '0451579b-abe8-401f-ae86-1740941a2093', 'orfebrería', 'Respiraderos del conjunto procesional de la Aurora.', 'Vigente', '1992', true, 6, 'Integrado en el conjunto procesional de la Hermandad.')
on conflict (entity_id) do update set
  parent_entity_id = excluded.parent_entity_id,
  asset_type = excluded.asset_type,
  description = excluded.description,
  current_condition = excluded.current_condition,
  date_from_text = excluded.date_from_text,
  is_current = excluded.is_current,
  display_order = excluded.display_order,
  usage_text = excluded.usage_text;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('d2afdd27-1fd2-4796-9a99-34976f102842', 'heritage_asset', 'Llamador del paso de palio', 'palio-llamador', 'Llamador realizado por Manuel de los Ríos.', 'published')
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.heritage_assets (entity_id, parent_entity_id, asset_type, description, current_condition, date_from_text, is_current, display_order, usage_text)
values ('d2afdd27-1fd2-4796-9a99-34976f102842', '0451579b-abe8-401f-ae86-1740941a2093', 'orfebrería', 'Llamador realizado por Manuel de los Ríos.', 'Vigente', '1992', true, 7, 'Integrado en el conjunto procesional de la Hermandad.')
on conflict (entity_id) do update set
  parent_entity_id = excluded.parent_entity_id,
  asset_type = excluded.asset_type,
  description = excluded.description,
  current_condition = excluded.current_condition,
  date_from_text = excluded.date_from_text,
  is_current = excluded.is_current,
  display_order = excluded.display_order,
  usage_text = excluded.usage_text;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('2f885bc3-6fdd-43c1-bc9f-97ab401e8264', 'heritage_asset', 'Bordados del paso de palio', 'palio-bordados', 'Bordados de José Ramón Paleteiro según el proyecto documentado por la Hermandad.', 'published')
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.heritage_assets (entity_id, parent_entity_id, asset_type, description, current_condition, date_from_text, is_current, display_order, usage_text)
values ('2f885bc3-6fdd-43c1-bc9f-97ab401e8264', '0451579b-abe8-401f-ae86-1740941a2093', 'bordado', 'Bordados de José Ramón Paleteiro según el proyecto documentado por la Hermandad.', 'Vigente', '2019', true, 8, 'Integrado en el conjunto procesional de la Hermandad.')
on conflict (entity_id) do update set
  parent_entity_id = excluded.parent_entity_id,
  asset_type = excluded.asset_type,
  description = excluded.description,
  current_condition = excluded.current_condition,
  date_from_text = excluded.date_from_text,
  is_current = excluded.is_current,
  display_order = excluded.display_order,
  usage_text = excluded.usage_text;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('977befd3-379b-4320-b7d4-4fab058f5266', 'heritage_asset', 'Manto y faldones de Nuestra Señora de la Aurora', 'aurora-manto', 'Conjunto realizado por Ildefonso Jiménez.', 'published')
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.heritage_assets (entity_id, parent_entity_id, asset_type, description, current_condition, date_from_text, is_current, display_order, usage_text)
values ('977befd3-379b-4320-b7d4-4fab058f5266', '4b2c83d4-701d-49b6-bca3-11dd85d4b9e9', 'bordado', 'Conjunto realizado por Ildefonso Jiménez.', 'Vigente', '2010', true, 9, 'Integrado en el conjunto procesional de la Hermandad.')
on conflict (entity_id) do update set
  parent_entity_id = excluded.parent_entity_id,
  asset_type = excluded.asset_type,
  description = excluded.description,
  current_condition = excluded.current_condition,
  date_from_text = excluded.date_from_text,
  is_current = excluded.is_current,
  display_order = excluded.display_order,
  usage_text = excluded.usage_text;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('8f1f600f-bfba-4ea9-8b54-de69df30524c', 'event', 'Fundación en el entorno lasaliano', 'resurreccion-fundacion', 'La corporación nace en el Colegio La Purísima de La Salle.', 'published')
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.events (entity_id, event_type, event_date_text, place_id, description, event_category, brotherhood_entity_id, municipality_id, event_status, location_text)
values ('8f1f600f-bfba-4ea9-8b54-de69df30524c', 'foundation', '1969', '0f5d685a-cceb-4dd7-afc4-38fdbde0249a', 'La corporación nace en el Colegio La Purísima de La Salle.', 'historical', '4994d166-adcc-4a52-84ec-61473540ed82', 'ca85889c-21fe-4367-8477-a57656b25da4', 'held', 'Sevilla')
on conflict (entity_id) do update set
  event_type = excluded.event_type,
  event_date_text = excluded.event_date_text,
  place_id = excluded.place_id,
  description = excluded.description,
  event_category = excluded.event_category,
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  municipality_id = excluded.municipality_id,
  event_status = excluded.event_status,
  location_text = excluded.location_text;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('aab0b16c-40f3-4b56-b5ec-a8fccff011cc', 'event', 'Aprobación de las primeras reglas', 'resurreccion-reglas', 'Primeras reglas como hermandad de gloria.', 'published')
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.events (entity_id, event_type, event_date, event_date_text, place_id, description, event_category, brotherhood_entity_id, municipality_id, event_status, location_text)
values ('aab0b16c-40f3-4b56-b5ec-a8fccff011cc', 'canonical_approval', '1972-03-19', '19 de marzo de 1972', '0f5d685a-cceb-4dd7-afc4-38fdbde0249a', 'Primeras reglas como hermandad de gloria.', 'historical', '4994d166-adcc-4a52-84ec-61473540ed82', 'ca85889c-21fe-4367-8477-a57656b25da4', 'held', 'Sevilla')
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
values ('7b92260c-1089-4684-9289-b695c1c5af7d', 'event', 'Primera procesión de la Sagrada Resurrección', 'resurreccion-primera-salida', 'Primera salida de la imagen de Francisco Buiza.', 'published')
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.events (entity_id, event_type, event_date, event_date_text, place_id, description, event_category, brotherhood_entity_id, municipality_id, event_status, location_text)
values ('7b92260c-1089-4684-9289-b695c1c5af7d', 'first_procession', '1973-04-22', '22 de abril de 1973', '0f5d685a-cceb-4dd7-afc4-38fdbde0249a', 'Primera salida de la imagen de Francisco Buiza.', 'historical', '4994d166-adcc-4a52-84ec-61473540ed82', 'ca85889c-21fe-4367-8477-a57656b25da4', 'held', 'Sevilla')
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
values ('157fbe56-3dbd-414e-af18-3ac363e00fd4', 'event', 'Bendición de Nuestra Señora de la Aurora', 'resurreccion-aurora-bendicion', 'Bendición de la dolorosa de Antonio Joaquín Dubé.', 'published')
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.events (entity_id, event_type, event_date, event_date_text, place_id, description, event_category, brotherhood_entity_id, municipality_id, event_status, location_text)
values ('157fbe56-3dbd-414e-af18-3ac363e00fd4', 'blessing', '1978-10-29', '29 de octubre de 1978', '0f5d685a-cceb-4dd7-afc4-38fdbde0249a', 'Bendición de la dolorosa de Antonio Joaquín Dubé.', 'historical', '4994d166-adcc-4a52-84ec-61473540ed82', 'ca85889c-21fe-4367-8477-a57656b25da4', 'held', 'Sevilla')
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
values ('f7031721-4fcc-4a73-9c4a-1e17b0a039b3', 'event', 'Carácter penitencial y sacramental', 'resurreccion-penitencial', 'Decreto que incorpora los caracteres penitencial y sacramental.', 'published')
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.events (entity_id, event_type, event_date, event_date_text, place_id, description, event_category, brotherhood_entity_id, municipality_id, event_status, location_text)
values ('f7031721-4fcc-4a73-9c4a-1e17b0a039b3', 'canonical_decree', '1981-10-12', '12 de octubre de 1981', '0f5d685a-cceb-4dd7-afc4-38fdbde0249a', 'Decreto que incorpora los caracteres penitencial y sacramental.', 'historical', '4994d166-adcc-4a52-84ec-61473540ed82', 'ca85889c-21fe-4367-8477-a57656b25da4', 'held', 'Sevilla')
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
values ('ef39800a-32a0-45d2-b791-7a1e31f3e0d6', 'event', 'Primera estación de penitencia', 'resurreccion-primera-estacion', 'Primera estación de penitencia desde Santa Marina.', 'published')
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.events (entity_id, event_type, event_date, event_date_text, place_id, description, event_category, brotherhood_entity_id, municipality_id, event_status, location_text)
values ('ef39800a-32a0-45d2-b791-7a1e31f3e0d6', 'first_station', '1982-04-11', '11 de abril de 1982', '0f5d685a-cceb-4dd7-afc4-38fdbde0249a', 'Primera estación de penitencia desde Santa Marina.', 'historical', '4994d166-adcc-4a52-84ec-61473540ed82', 'ca85889c-21fe-4367-8477-a57656b25da4', 'held', 'Sevilla')
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
values ('4bf2cf42-8e0e-47a2-9420-4e19577679d0', 'event', 'Regreso a Santa Marina restaurada', 'resurreccion-regreso-santa-marina', 'La Hermandad regresa al templo tras su restauración.', 'published')
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.events (entity_id, event_type, event_date_text, place_id, description, event_category, brotherhood_entity_id, municipality_id, event_status, location_text)
values ('4bf2cf42-8e0e-47a2-9420-4e19577679d0', 'headquarters', '1987', '0f5d685a-cceb-4dd7-afc4-38fdbde0249a', 'La Hermandad regresa al templo tras su restauración.', 'historical', '4994d166-adcc-4a52-84ec-61473540ed82', 'ca85889c-21fe-4367-8477-a57656b25da4', 'held', 'Sevilla')
on conflict (entity_id) do update set
  event_type = excluded.event_type,
  event_date_text = excluded.event_date_text,
  place_id = excluded.place_id,
  description = excluded.description,
  event_category = excluded.event_category,
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  municipality_id = excluded.municipality_id,
  event_status = excluded.event_status,
  location_text = excluded.location_text;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('61c7e132-a75a-40ff-913d-d12fca382f61', 'event', 'Sede permanente en Santa Marina', 'resurreccion-sede-permanente', 'Santa Marina se convierte en sede permanente.', 'published')
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.events (entity_id, event_type, event_date_text, place_id, description, event_category, brotherhood_entity_id, municipality_id, event_status, location_text)
values ('61c7e132-a75a-40ff-913d-d12fca382f61', 'headquarters', '1991', '0f5d685a-cceb-4dd7-afc4-38fdbde0249a', 'Santa Marina se convierte en sede permanente.', 'historical', '4994d166-adcc-4a52-84ec-61473540ed82', 'ca85889c-21fe-4367-8477-a57656b25da4', 'held', 'Sevilla')
on conflict (entity_id) do update set
  event_type = excluded.event_type,
  event_date_text = excluded.event_date_text,
  place_id = excluded.place_id,
  description = excluded.description,
  event_category = excluded.event_category,
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  municipality_id = excluded.municipality_id,
  event_status = excluded.event_status,
  location_text = excluded.location_text;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('885f548c-fba1-4ad3-be1a-21e31d5967f0', 'event', 'Incorporación del paso de palio', 'resurreccion-primer-palio', 'Nuestra Señora de la Aurora se incorpora a la estación de penitencia bajo palio.', 'published')
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.events (entity_id, event_type, event_date, event_date_text, place_id, description, event_category, brotherhood_entity_id, municipality_id, event_status, location_text)
values ('885f548c-fba1-4ad3-be1a-21e31d5967f0', 'first_procession', '1992-04-19', '19 de abril de 1992', '0f5d685a-cceb-4dd7-afc4-38fdbde0249a', 'Nuestra Señora de la Aurora se incorpora a la estación de penitencia bajo palio.', 'historical', '4994d166-adcc-4a52-84ec-61473540ed82', 'ca85889c-21fe-4367-8477-a57656b25da4', 'held', 'Sevilla')
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
values ('fd745cb7-5b32-4953-809c-79bb8db35257', 'event', 'Incorporación de titulares lasalianos', 'resurreccion-titulares-2005', 'María Santísima del Amor, Santa Marina y San Juan Bautista de La Salle quedan incorporados a la titularidad.', 'published')
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.events (entity_id, event_type, event_date_text, place_id, description, event_category, brotherhood_entity_id, municipality_id, event_status, location_text)
values ('fd745cb7-5b32-4953-809c-79bb8db35257', 'canonical_decree', '2005', '0f5d685a-cceb-4dd7-afc4-38fdbde0249a', 'María Santísima del Amor, Santa Marina y San Juan Bautista de La Salle quedan incorporados a la titularidad.', 'historical', '4994d166-adcc-4a52-84ec-61473540ed82', 'ca85889c-21fe-4367-8477-a57656b25da4', 'held', 'Sevilla')
on conflict (entity_id) do update set
  event_type = excluded.event_type,
  event_date_text = excluded.event_date_text,
  place_id = excluded.place_id,
  description = excluded.description,
  event_category = excluded.event_category,
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  municipality_id = excluded.municipality_id,
  event_status = excluded.event_status,
  location_text = excluded.location_text;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('5a6dda30-5bc0-45a7-93e0-5a8f703d4f8d', 'event', 'Vía Lucis extraordinario de la Aurora', 'resurreccion-via-lucis-aurora', 'Salida extraordinaria dentro del ciclo del cincuentenario.', 'published')
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.events (entity_id, event_type, event_date, event_date_text, place_id, description, event_category, brotherhood_entity_id, municipality_id, event_status, location_text)
values ('5a6dda30-5bc0-45a7-93e0-5a8f703d4f8d', 'extraordinary_procession', '2022-05-22', '22 de mayo de 2022', '0f5d685a-cceb-4dd7-afc4-38fdbde0249a', 'Salida extraordinaria dentro del ciclo del cincuentenario.', 'historical', '4994d166-adcc-4a52-84ec-61473540ed82', 'ca85889c-21fe-4367-8477-a57656b25da4', 'held', 'Sevilla')
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
values ('1a1058de-0cdd-4b77-a438-45c80e7437bd', 'event', 'Salida extraordinaria de la Sagrada Resurrección', 'resurreccion-extraordinaria-cristo', 'Salida extraordinaria dentro del ciclo del cincuentenario.', 'published')
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.events (entity_id, event_type, event_date, event_date_text, place_id, description, event_category, brotherhood_entity_id, municipality_id, event_status, location_text)
values ('1a1058de-0cdd-4b77-a438-45c80e7437bd', 'extraordinary_procession', '2022-10-22', '22 de octubre de 2022', '0f5d685a-cceb-4dd7-afc4-38fdbde0249a', 'Salida extraordinaria dentro del ciclo del cincuentenario.', 'historical', '4994d166-adcc-4a52-84ec-61473540ed82', 'ca85889c-21fe-4367-8477-a57656b25da4', 'held', 'Sevilla')
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
values ('ecc2d5ba-e6f4-4880-8fe2-841822d16311', '4994d166-adcc-4a52-84ec-61473540ed82', 'x', 'https://twitter.com/resurreccionsev?lang=es', 'X / Twitter', 1, true)
on conflict (id) do update set
  entity_id = excluded.entity_id,
  platform = excluded.platform,
  url = excluded.url,
  label = excluded.label,
  display_order = excluded.display_order,
  is_public = excluded.is_public;

insert into public.entity_social_links (id, entity_id, platform, url, label, display_order, is_public)
values ('bd679b6b-d874-4b8a-90b7-798b7d0d858c', '4994d166-adcc-4a52-84ec-61473540ed82', 'facebook', 'https://www.facebook.com/resureccionsev/', 'Facebook', 2, true)
on conflict (id) do update set
  entity_id = excluded.entity_id,
  platform = excluded.platform,
  url = excluded.url,
  label = excluded.label,
  display_order = excluded.display_order,
  is_public = excluded.is_public;

insert into public.entity_social_links (id, entity_id, platform, url, label, display_order, is_public)
values ('3c1edc6d-5818-451f-8cee-c6252823bac9', '4994d166-adcc-4a52-84ec-61473540ed82', 'instagram', 'https://www.instagram.com/resurreccionsev/', 'Instagram', 3, true)
on conflict (id) do update set
  entity_id = excluded.entity_id,
  platform = excluded.platform,
  url = excluded.url,
  label = excluded.label,
  display_order = excluded.display_order,
  is_public = excluded.is_public;

insert into public.entity_social_links (id, entity_id, platform, url, label, display_order, is_public)
values ('d41a511e-a019-41f8-a6fa-6762bf629153', '4994d166-adcc-4a52-84ec-61473540ed82', 'youtube', 'https://www.youtube.com/channel/UCnpg0G5yZt5k44M_yOQvFaw/featured', 'YouTube', 4, true)
on conflict (id) do update set
  entity_id = excluded.entity_id,
  platform = excluded.platform,
  url = excluded.url,
  label = excluded.label,
  display_order = excluded.display_order,
  is_public = excluded.is_public;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('c620b407-2471-46d1-8a4c-1046b5c11b42', '04e6e7ba-0b36-4acd-9ace-cf10be0da20a', '4994d166-adcc-4a52-84ec-61473540ed82', 'Historia institucional', 'Cronología oficial de la Hermandad.')
on conflict (id) do update set
  source_id = excluded.source_id,
  entity_id = excluded.entity_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('1ae85b9f-97d9-4366-b7fd-d7abe76f2f3f', '7a9be5f2-0996-44f8-a673-4aafb758087b', '4994d166-adcc-4a52-84ec-61473540ed82', 'Ficha canónica', 'Identidad, hábito, pasos y música vigente.')
on conflict (id) do update set
  source_id = excluded.source_id,
  entity_id = excluded.entity_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('91024e5e-506d-427c-ab9e-65e1dfbf2734', 'a0c9f05e-f929-4884-86cf-69892728b308', 'f5425304-10bc-4f7f-a876-59fc2a8b1d56', 'Titular y autoría', 'Ficha oficial de la imagen.')
on conflict (id) do update set
  source_id = excluded.source_id,
  entity_id = excluded.entity_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('64393630-862d-4888-a592-ea5e9c929490', 'fe43aace-4eec-433a-8c4b-ac5be094ab31', '4b2c83d4-701d-49b6-bca3-11dd85d4b9e9', 'Titular y autoría', 'Ficha oficial de la imagen.')
on conflict (id) do update set
  source_id = excluded.source_id,
  entity_id = excluded.entity_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('d6f52646-6fa1-4f4d-af36-e88ecb5ceeb2', '56e34e47-2437-4491-b14e-1e667f8729ab', '79387715-05a9-478e-b7d1-6fb84b21bcf3', 'Titular y autoría', 'Ficha oficial de la imagen.')
on conflict (id) do update set
  source_id = excluded.source_id,
  entity_id = excluded.entity_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('138c383c-cf92-4481-a741-d296e9867360', '56e34e47-2437-4491-b14e-1e667f8729ab', '556ae4a4-0ee3-4efd-befe-7e0b4de12458', 'Titular y autoría', 'Ficha oficial de la imagen.')
on conflict (id) do update set
  source_id = excluded.source_id,
  entity_id = excluded.entity_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('18760803-9bfb-46b9-ab10-bb55f5713baf', '56e34e47-2437-4491-b14e-1e667f8729ab', '4fa12803-73a4-4baa-ba0a-0824f654b8df', 'Titular y autoría', 'Ficha oficial de la imagen.')
on conflict (id) do update set
  source_id = excluded.source_id,
  entity_id = excluded.entity_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('71a5c97c-b7aa-4fe7-a3f3-a165ac3fe7ef', 'c5dcb794-f1b3-49bd-ac4e-f352dfbcbf1f', '4d28d6db-f4eb-4683-80d2-5e8b7caa59a7', 'Paso procesional', 'Descripción oficial del paso.')
on conflict (id) do update set
  source_id = excluded.source_id,
  entity_id = excluded.entity_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('1b76bdf4-6848-4c0d-a7c8-5d96870ab2ff', 'c5dcb794-f1b3-49bd-ac4e-f352dfbcbf1f', '0451579b-abe8-401f-ae86-1740941a2093', 'Paso procesional', 'Descripción oficial del paso.')
on conflict (id) do update set
  source_id = excluded.source_id,
  entity_id = excluded.entity_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('67d4114f-7d92-44da-9de8-8df504b7fd3c', 'c5dcb794-f1b3-49bd-ac4e-f352dfbcbf1f', 'a28e02d1-15d0-4a98-b4b4-73a65b431c04', 'Patrimonio procesional', 'Elemento descrito en la página oficial de pasos.')
on conflict (id) do update set
  source_id = excluded.source_id,
  entity_id = excluded.entity_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('61168c91-2eaf-452a-b5ab-680d362fd8ec', 'c5dcb794-f1b3-49bd-ac4e-f352dfbcbf1f', '20ebbba6-6746-48aa-8e09-34c9bd3f37a3', 'Patrimonio procesional', 'Elemento descrito en la página oficial de pasos.')
on conflict (id) do update set
  source_id = excluded.source_id,
  entity_id = excluded.entity_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('3edfca3e-c5b0-4582-82be-92a9fa10d107', 'c5dcb794-f1b3-49bd-ac4e-f352dfbcbf1f', '89329cd3-a24e-45c9-b3ff-347eb401a292', 'Patrimonio procesional', 'Elemento descrito en la página oficial de pasos.')
on conflict (id) do update set
  source_id = excluded.source_id,
  entity_id = excluded.entity_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('5a8c902d-11cf-45d6-827e-4ea39b3b6153', 'c5dcb794-f1b3-49bd-ac4e-f352dfbcbf1f', '41eb0412-188c-4e44-803f-16683c76eab9', 'Patrimonio procesional', 'Elemento descrito en la página oficial de pasos.')
on conflict (id) do update set
  source_id = excluded.source_id,
  entity_id = excluded.entity_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('2aaa3270-2be1-4852-bafc-7ad3aa783c5c', 'c5dcb794-f1b3-49bd-ac4e-f352dfbcbf1f', 'ef4d7e21-0752-4118-8499-7fc06507fd7d', 'Patrimonio procesional', 'Elemento descrito en la página oficial de pasos.')
on conflict (id) do update set
  source_id = excluded.source_id,
  entity_id = excluded.entity_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('1df3c11c-e165-426f-8bf0-84315e7783ce', 'c5dcb794-f1b3-49bd-ac4e-f352dfbcbf1f', 'ffebbf82-57de-48ae-a5eb-06faba40c884', 'Patrimonio procesional', 'Elemento descrito en la página oficial de pasos.')
on conflict (id) do update set
  source_id = excluded.source_id,
  entity_id = excluded.entity_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('ffd402ef-57f9-4168-a00d-bffd37387a34', 'c5dcb794-f1b3-49bd-ac4e-f352dfbcbf1f', 'd2afdd27-1fd2-4796-9a99-34976f102842', 'Patrimonio procesional', 'Elemento descrito en la página oficial de pasos.')
on conflict (id) do update set
  source_id = excluded.source_id,
  entity_id = excluded.entity_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('2ff15886-92d5-4fc8-b6b9-e633fd9c7961', 'c5dcb794-f1b3-49bd-ac4e-f352dfbcbf1f', '2f885bc3-6fdd-43c1-bc9f-97ab401e8264', 'Patrimonio procesional', 'Elemento descrito en la página oficial de pasos.')
on conflict (id) do update set
  source_id = excluded.source_id,
  entity_id = excluded.entity_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('236c28c3-fd57-4a7f-8f74-d49ad4d43897', 'c5dcb794-f1b3-49bd-ac4e-f352dfbcbf1f', '977befd3-379b-4320-b7d4-4fab058f5266', 'Patrimonio procesional', 'Elemento descrito en la página oficial de pasos.')
on conflict (id) do update set
  source_id = excluded.source_id,
  entity_id = excluded.entity_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, cult_id, scope, notes)
values ('de7d86c9-2966-48df-a03c-e02694836c61', 'bb9bce21-1fb1-4008-9a5b-89b04dfc802b', '609ae08c-bcca-446d-939a-aa8a05031d2b', 'Culto 2026', 'Agenda oficial consultada el 13 de septiembre de 2026.')
on conflict (id) do update set
  source_id = excluded.source_id,
  cult_id = excluded.cult_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, cult_id, scope, notes)
values ('1d85971f-af3a-48ed-8d8e-d8aeeb88e78a', 'bb9bce21-1fb1-4008-9a5b-89b04dfc802b', 'cade81aa-4bf8-41ad-be06-112a4802c428', 'Culto 2026', 'Agenda oficial consultada el 13 de septiembre de 2026.')
on conflict (id) do update set
  source_id = excluded.source_id,
  cult_id = excluded.cult_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, cult_id, scope, notes)
values ('b47c0de5-e5de-4daa-a4b3-cd1ca9f5822c', 'bb9bce21-1fb1-4008-9a5b-89b04dfc802b', '83787a5c-9e5a-42c8-a369-bf9645315008', 'Culto 2026', 'Agenda oficial consultada el 13 de septiembre de 2026.')
on conflict (id) do update set
  source_id = excluded.source_id,
  cult_id = excluded.cult_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, cult_id, scope, notes)
values ('261e4473-6665-496f-87d8-c961060c6cfb', 'bb9bce21-1fb1-4008-9a5b-89b04dfc802b', '226ea85e-915a-44f0-8f0a-9ec80485af98', 'Culto 2026', 'Agenda oficial consultada el 13 de septiembre de 2026.')
on conflict (id) do update set
  source_id = excluded.source_id,
  cult_id = excluded.cult_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, outing_id, scope, notes)
values ('77d7bcea-d73d-478d-b1d8-d948edfe188a', 'efb021de-95e0-412f-b529-47add102612a', 'a7e8f388-2723-46d5-a4af-2a495ce03e5c', 'Salida 2026', 'Horario e itinerario oficiales de la estación de penitencia.')
on conflict (id) do update set
  source_id = excluded.source_id,
  outing_id = excluded.outing_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, music_accompaniment_period_id, scope, notes)
values ('e765feac-7baf-4aa8-8dad-a2c7cb02bf08', 'a41d5424-9c7b-47e4-b762-857e64e79114', 'dd0ae1ea-597d-4703-9263-b0631f053207', 'Acompañamiento musical', 'Cronología musical oficial.')
on conflict (id) do update set
  source_id = excluded.source_id,
  music_accompaniment_period_id = excluded.music_accompaniment_period_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, music_accompaniment_period_id, scope, notes)
values ('c0fd49e5-1788-43e3-9afd-8cf1f0481923', 'a41d5424-9c7b-47e4-b762-857e64e79114', '0de5a136-c5b3-4377-9ecc-a22ae9a44c35', 'Acompañamiento musical', 'Cronología musical oficial.')
on conflict (id) do update set
  source_id = excluded.source_id,
  music_accompaniment_period_id = excluded.music_accompaniment_period_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, music_accompaniment_period_id, scope, notes)
values ('52034189-96f4-4f49-b80a-5415d077cfe0', 'a41d5424-9c7b-47e4-b762-857e64e79114', '1afb4dd9-b122-4432-9bba-6bb4ba4bba68', 'Acompañamiento musical', 'Cronología musical oficial.')
on conflict (id) do update set
  source_id = excluded.source_id,
  music_accompaniment_period_id = excluded.music_accompaniment_period_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, music_accompaniment_period_id, scope, notes)
values ('296a73af-843d-40e5-9002-2830702607b0', 'a41d5424-9c7b-47e4-b762-857e64e79114', 'b218dd81-bb7e-4a38-b094-7ba9d365f700', 'Acompañamiento musical', 'Cronología musical oficial.')
on conflict (id) do update set
  source_id = excluded.source_id,
  music_accompaniment_period_id = excluded.music_accompaniment_period_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, music_accompaniment_period_id, scope, notes)
values ('728ad38c-93fe-476a-b6e2-8ec8e558fd77', 'a41d5424-9c7b-47e4-b762-857e64e79114', '11b34575-c17b-408f-8d05-6f04a8618f9a', 'Acompañamiento musical', 'Cronología musical oficial.')
on conflict (id) do update set
  source_id = excluded.source_id,
  music_accompaniment_period_id = excluded.music_accompaniment_period_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, music_accompaniment_period_id, scope, notes)
values ('6c3a8c72-2c73-49b7-9d68-727364bca26b', 'a41d5424-9c7b-47e4-b762-857e64e79114', 'd8f3f91f-cbac-4a6f-b230-8a510d6eb52b', 'Acompañamiento musical', 'Cronología musical oficial.')
on conflict (id) do update set
  source_id = excluded.source_id,
  music_accompaniment_period_id = excluded.music_accompaniment_period_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('977c03e6-ba5f-4aa7-bfb7-bf735816fcb5', '04e6e7ba-0b36-4acd-9ace-cf10be0da20a', '8f1f600f-bfba-4ea9-8b54-de69df30524c', 'Acontecimiento histórico', 'Cronología oficial de la Hermandad.')
on conflict (id) do update set
  source_id = excluded.source_id,
  entity_id = excluded.entity_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('19b507d9-d922-4620-b627-33f890135ed1', '04e6e7ba-0b36-4acd-9ace-cf10be0da20a', 'aab0b16c-40f3-4b56-b5ec-a8fccff011cc', 'Acontecimiento histórico', 'Cronología oficial de la Hermandad.')
on conflict (id) do update set
  source_id = excluded.source_id,
  entity_id = excluded.entity_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('7181d526-b348-4ef1-a3e8-d847eb5eb2b5', '04e6e7ba-0b36-4acd-9ace-cf10be0da20a', '7b92260c-1089-4684-9289-b695c1c5af7d', 'Acontecimiento histórico', 'Cronología oficial de la Hermandad.')
on conflict (id) do update set
  source_id = excluded.source_id,
  entity_id = excluded.entity_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('74205f0f-8d8a-4245-a107-d4d69ba8afd1', '04e6e7ba-0b36-4acd-9ace-cf10be0da20a', '157fbe56-3dbd-414e-af18-3ac363e00fd4', 'Acontecimiento histórico', 'Cronología oficial de la Hermandad.')
on conflict (id) do update set
  source_id = excluded.source_id,
  entity_id = excluded.entity_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('6aa1000b-9849-40e9-8377-180bfe20b68c', '04e6e7ba-0b36-4acd-9ace-cf10be0da20a', 'f7031721-4fcc-4a73-9c4a-1e17b0a039b3', 'Acontecimiento histórico', 'Cronología oficial de la Hermandad.')
on conflict (id) do update set
  source_id = excluded.source_id,
  entity_id = excluded.entity_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('dca4e01b-5ba3-4127-b3ae-2a12a0d97ead', '04e6e7ba-0b36-4acd-9ace-cf10be0da20a', 'ef39800a-32a0-45d2-b791-7a1e31f3e0d6', 'Acontecimiento histórico', 'Cronología oficial de la Hermandad.')
on conflict (id) do update set
  source_id = excluded.source_id,
  entity_id = excluded.entity_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('f1172148-95b9-4cd6-978f-e30097bcbf13', '04e6e7ba-0b36-4acd-9ace-cf10be0da20a', '4bf2cf42-8e0e-47a2-9420-4e19577679d0', 'Acontecimiento histórico', 'Cronología oficial de la Hermandad.')
on conflict (id) do update set
  source_id = excluded.source_id,
  entity_id = excluded.entity_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('52740989-4cd2-402a-ba7c-7ee9c9927320', '04e6e7ba-0b36-4acd-9ace-cf10be0da20a', '61c7e132-a75a-40ff-913d-d12fca382f61', 'Acontecimiento histórico', 'Cronología oficial de la Hermandad.')
on conflict (id) do update set
  source_id = excluded.source_id,
  entity_id = excluded.entity_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('1ab3dacc-cbf7-48c7-a2cb-4e3e551199dc', '04e6e7ba-0b36-4acd-9ace-cf10be0da20a', '885f548c-fba1-4ad3-be1a-21e31d5967f0', 'Acontecimiento histórico', 'Cronología oficial de la Hermandad.')
on conflict (id) do update set
  source_id = excluded.source_id,
  entity_id = excluded.entity_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('133ff274-d52f-4784-8c68-9791ff6168d0', '04e6e7ba-0b36-4acd-9ace-cf10be0da20a', 'fd745cb7-5b32-4953-809c-79bb8db35257', 'Acontecimiento histórico', 'Cronología oficial de la Hermandad.')
on conflict (id) do update set
  source_id = excluded.source_id,
  entity_id = excluded.entity_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('111ced84-7b53-4ab2-b489-60dc62be2cc5', '04e6e7ba-0b36-4acd-9ace-cf10be0da20a', '5a6dda30-5bc0-45a7-93e0-5a8f703d4f8d', 'Acontecimiento histórico', 'Cronología oficial de la Hermandad.')
on conflict (id) do update set
  source_id = excluded.source_id,
  entity_id = excluded.entity_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
values ('e54efa77-0200-4eb3-bcc9-5e5412c93bc7', '04e6e7ba-0b36-4acd-9ace-cf10be0da20a', '1a1058de-0cdd-4b77-a438-45c80e7437bd', 'Acontecimiento histórico', 'Cronología oficial de la Hermandad.')
on conflict (id) do update set
  source_id = excluded.source_id,
  entity_id = excluded.entity_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, brotherhood_habit_id, scope, notes)
values ('d9491749-0435-4f80-84b8-1938988cf104', '7a9be5f2-0996-44f8-a673-4aafb758087b', 'c27cf432-2441-40c1-9c4f-4e837b658374', 'Hábito nazareno', 'Descripción oficial del hábito.')
on conflict (id) do update set
  source_id = excluded.source_id,
  brotherhood_habit_id = excluded.brotherhood_habit_id,
  scope = excluded.scope,
  notes = excluded.notes;



commit;
