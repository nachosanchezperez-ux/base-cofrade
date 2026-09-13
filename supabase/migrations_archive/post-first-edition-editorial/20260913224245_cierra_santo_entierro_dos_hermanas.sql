-- HC-016 · duodécimo contexto real: Santo Entierro de Dos Hermanas
-- Receta editorial canónica archivada tras Apply gobernado en producción.
-- Solo DML. No crea tablas, tipos, funciones, políticas ni índices.
-- Base reconciliada: 054e2490abb9a92c582ba99d5b80aac27bb65ce6.
-- Lote: 9b527bb5-f011-497c-92ca-d2071e3aeb49 (99/99; 0 inválidos; 0 fallos).

begin;

-- Reutiliza sin modificar la Fuente canónica ya existente:
-- fe26768c-ae35-4deb-a3a4-bb485a0b401d · Santo Entierro de Dos Hermanas · ficha diocesana.

insert into public.sources (id, name, url, source_type, author_or_publisher, accessed_at, notes)
values ('6812cf58-cbdf-4909-a8e7-4220c6c730a4', 'Provincia. Una mirada a la Hermandad del Santo Entierro de Dos Hermanas', 'https://www.artesacro.org/Noticia/Ver/24922/provincia-mirada-provincia-hermandad-santo-entierro-dos-hermanas', 'web', 'Arte Sacro', '2026-09-13', 'Historia, titulares, pasos, hábito y patrimonio.')
on conflict (id) do update set
  name = excluded.name,
  url = excluded.url,
  source_type = excluded.source_type,
  author_or_publisher = excluded.author_or_publisher,
  accessed_at = excluded.accessed_at,
  notes = excluded.notes;

insert into public.sources (id, name, url, source_type, author_or_publisher, publication_date, accessed_at, notes)
values ('fae169ec-e20c-462d-a727-d6e549c340e9', 'La Soledad de Dos Hermanas', 'https://periodicolasemana.es/2019/72564/memoria-dh/la-soledad-de-dos-hermanas/', 'web', 'Periódico La Semana', '2019-01-01', '2026-09-13', 'Datación prudente, documentación histórica, incendio de 1936 y restauración de 1940.')
on conflict (id) do update set
  name = excluded.name,
  url = excluded.url,
  source_type = excluded.source_type,
  author_or_publisher = excluded.author_or_publisher,
  publication_date = excluded.publication_date,
  accessed_at = excluded.accessed_at,
  notes = excluded.notes;

insert into public.sources (id, name, url, source_type, author_or_publisher, publication_date, accessed_at, notes)
values ('8ba85e23-d35c-429f-b66c-e6f33799f71d', 'Santo Entierro', 'https://doshermanas.com/2009/03/18/santo-entierro/', 'web', 'Dos Hermanas', '2009-03-18', '2026-09-13', 'Ficha local de pasos, hábito y patrimonio.')
on conflict (id) do update set
  name = excluded.name,
  url = excluded.url,
  source_type = excluded.source_type,
  author_or_publisher = excluded.author_or_publisher,
  publication_date = excluded.publication_date,
  accessed_at = excluded.accessed_at,
  notes = excluded.notes;

insert into public.sources (id, name, url, source_type, author_or_publisher, publication_date, accessed_at, notes)
values ('e130385f-a089-48e3-a01f-c5365f462a99', 'Horario y recorrido del Santo Entierro de Dos Hermanas · Sábado Santo 2026', 'https://www.elpespunte.es/articulo/dos-hermanas/horario-recorrido-santo-entierro-dos-hermanas-sabado-santo/20260404174116129303.html', 'web', 'El Pespunte', '2026-04-04', '2026-09-13', 'Salida de Sábado Santo, horarios, recorrido, cortejo y música.')
on conflict (id) do update set
  name = excluded.name,
  url = excluded.url,
  source_type = excluded.source_type,
  author_or_publisher = excluded.author_or_publisher,
  publication_date = excluded.publication_date,
  accessed_at = excluded.accessed_at,
  notes = excluded.notes;

insert into public.sources (id, name, url, source_type, author_or_publisher, publication_date, accessed_at, notes)
values ('3d8b49c2-93fe-4746-9df3-c309f2215a9b', 'Procesión del Resucitado de Dos Hermanas', 'https://www.artesacro.org/Noticia/Ver/150293/provincia-galeria-domingo-resurreccion-procesion-resucitado-dos-hermanas', 'web', 'Arte Sacro', '2023-04-09', '2026-09-13', 'Documenta la salida del Resucitado y la Banda Juvenil Santa Ana.')
on conflict (id) do update set
  name = excluded.name,
  url = excluded.url,
  source_type = excluded.source_type,
  author_or_publisher = excluded.author_or_publisher,
  publication_date = excluded.publication_date,
  accessed_at = excluded.accessed_at,
  notes = excluded.notes;

insert into public.sources (id, name, url, source_type, author_or_publisher, publication_date, accessed_at, notes)
values ('963848bd-d0be-4038-96c2-b3dfe33014e2', 'Besapié del Cristo Resucitado de Dos Hermanas', 'https://www.artesacro.org/Noticia/Ver/167519/galeria-besapie-cristo-resucitado-dos-hermanas-luis-m-fernandez', 'web', 'Arte Sacro', '2026-04-16', '2026-09-13', 'Documenta el culto al Cristo Resucitado; no se infiere una fecha exacta del acto.')
on conflict (id) do update set
  name = excluded.name,
  url = excluded.url,
  source_type = excluded.source_type,
  author_or_publisher = excluded.author_or_publisher,
  publication_date = excluded.publication_date,
  accessed_at = excluded.accessed_at,
  notes = excluded.notes;

insert into public.sources (id, name, url, source_type, author_or_publisher, publication_date, accessed_at, notes)
values ('cf3a38ca-b96d-4d8b-b507-9cc69129c13a', 'Función principal al Santísimo Cristo Yacente de Dos Hermanas', 'https://www.artesacro.org/Noticia/Ver/23300/hoy-funcion-principal-santisimo-cristo-yacente-dos-hermanas', 'web', 'Arte Sacro', '2008-02-24', '2026-09-13', 'Evidencia histórica de triduo y función; no se traslada su calendario a 2026.')
on conflict (id) do update set
  name = excluded.name,
  url = excluded.url,
  source_type = excluded.source_type,
  author_or_publisher = excluded.author_or_publisher,
  publication_date = excluded.publication_date,
  accessed_at = excluded.accessed_at,
  notes = excluded.notes;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('000e79af-9f0c-42d7-9c10-08a0eb2e8490', 'brotherhood', 'Santo Entierro de Dos Hermanas', 'santo-entierro-dos-hermanas', 'Hermandad de Dos Hermanas con sede en Santa María Magdalena. Realiza estación de penitencia el Sábado Santo con el Cristo Yacente y Nuestra Señora de la Soledad y mantiene la procesión del Cristo Resucitado el Domingo de Resurrección.', 'published')
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.brotherhoods (entity_id, official_name, popular_name, foundation_text, municipality_id, canonical_see_place_id, brotherhood_types, current_procession_day, history_text, notes, instagram_url)
values ('000e79af-9f0c-42d7-9c10-08a0eb2e8490', 'Antigua y Fervorosa Hermandad y Cofradía de Nazarenos del Triunfo de la Santa Cruz sobre la Muerte, Santo Entierro y Resurrección de Nuestro Señor Jesucristo y Nuestra Señora de la Soledad', 'Santo Entierro de Dos Hermanas', 'Finales del siglo XVI; documentada hacia 1596', '24e0b757-f3fd-4d9c-82c9-2a758444f2d6', '62b23280-a700-4965-b1e4-dcc5545a9d8c', ARRAY['Penitencia']::text[], 'Sábado Santo y Domingo de Resurrección', 'La corporación se documenta a finales del siglo XVI. Su devoción histórica reúne al Cristo Yacente, Nuestra Señora de la Soledad y el Cristo Resucitado. La salida penitencial del Sábado Santo y la procesión del Resucitado se modelan como calendarios distintos.', 'La datación histórica se expresa de forma prudente. No se atribuye autor conocido a la Soledad ni al Resucitado.', 'https://www.instagram.com/hdadsantoentierro/')
on conflict (entity_id) do update set
  official_name = excluded.official_name,
  popular_name = excluded.popular_name,
  foundation_text = excluded.foundation_text,
  municipality_id = excluded.municipality_id,
  canonical_see_place_id = excluded.canonical_see_place_id,
  brotherhood_types = excluded.brotherhood_types,
  current_procession_day = excluded.current_procession_day,
  history_text = excluded.history_text,
  notes = excluded.notes,
  instagram_url = excluded.instagram_url;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('ac08220a-32cd-4af4-978a-3a9c2403b273', 'image', 'Santísimo Cristo Yacente', 'santisimo-cristo-yacente-dos-hermanas', 'Imagen titular de Cristo Yacente, obra de Juan Manuel Miñarro López, bendecida el 19 de febrero de 1995.', 'published')
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('ac3676a4-0794-4342-81f6-8154a4c5ee82', 'image', 'Nuestra Señora de la Soledad', 'nuestra-senora-soledad-dos-hermanas', 'Imagen titular de candelero, anónima y fechada prudentemente a comienzos del siglo XVII.', 'published')
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('10279eb9-3d71-4ae1-a482-2b4921d95b36', 'image', 'Cristo Resucitado', 'cristo-resucitado-dos-hermanas', 'Imagen titular anónima, datada entre finales del siglo XVIII y comienzos del XIX, que procesiona el Domingo de Resurrección.', 'published')
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.images (entity_id, image_type, execution_date_text, material, current_condition, description)
values ('ac08220a-32cd-4af4-978a-3a9c2403b273', 'Cristo yacente', '1995', 'Madera policromada', 'extant', 'Cristo Yacente realizado por Juan Manuel Miñarro López y bendecido el 19 de febrero de 1995.')
on conflict (entity_id) do update set
  image_type = excluded.image_type,
  execution_date_text = excluded.execution_date_text,
  material = excluded.material,
  current_condition = excluded.current_condition,
  description = excluded.description;

insert into public.images (entity_id, image_type, execution_date_text, current_condition, dimensions_text, is_dress_image, description)
values ('ac3676a4-0794-4342-81f6-8154a4c5ee82', 'Dolorosa de candelero', 'Comienzos del siglo XVII', 'extant', '1,53 m de altura', TRUE, 'Dolorosa anónima de candelero. Sobrevivió con pocos daños al incendio parroquial de julio de 1936 y fue restaurada en 1940 por José Luis Ferrer de Couto Lamas.')
on conflict (entity_id) do update set
  image_type = excluded.image_type,
  execution_date_text = excluded.execution_date_text,
  current_condition = excluded.current_condition,
  dimensions_text = excluded.dimensions_text,
  is_dress_image = excluded.is_dress_image,
  description = excluded.description;

insert into public.images (entity_id, image_type, execution_date_text, current_condition, description)
values ('10279eb9-3d71-4ae1-a482-2b4921d95b36', 'Cristo resucitado', 'Finales del siglo XVIII o comienzos del XIX', 'extant', 'Titular anónimo vinculado históricamente a la procesión del Domingo de Resurrección.')
on conflict (entity_id) do update set
  image_type = excluded.image_type,
  execution_date_text = excluded.execution_date_text,
  current_condition = excluded.current_condition,
  description = excluded.description;

insert into public.brotherhood_images (id, brotherhood_entity_id, image_entity_id, relation_type, date_from_text, notes, status)
values ('cd13ae16-3925-4d04-b353-7d42f1a4771d', '000e79af-9f0c-42d7-9c10-08a0eb2e8490', 'ac08220a-32cd-4af4-978a-3a9c2403b273', 'titular', '1995', 'Titular actual; bendecido el 19 de febrero de 1995.', 'published')
on conflict (id) do update set
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  image_entity_id = excluded.image_entity_id,
  relation_type = excluded.relation_type,
  date_from_text = excluded.date_from_text,
  notes = excluded.notes,
  status = excluded.status;

insert into public.brotherhood_images (id, brotherhood_entity_id, image_entity_id, relation_type, date_from_text, notes, status)
values ('bbb2e996-0cb6-4388-9eff-8ec09249bba9', '000e79af-9f0c-42d7-9c10-08a0eb2e8490', 'ac3676a4-0794-4342-81f6-8154a4c5ee82', 'titular', 'Comienzos del siglo XVII', 'Titular histórica de la corporación.', 'published')
on conflict (id) do update set
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  image_entity_id = excluded.image_entity_id,
  relation_type = excluded.relation_type,
  date_from_text = excluded.date_from_text,
  notes = excluded.notes,
  status = excluded.status;

insert into public.brotherhood_images (id, brotherhood_entity_id, image_entity_id, relation_type, date_from_text, notes, status)
values ('500005d6-4f76-4f80-a3e6-d2c7730f48c6', '000e79af-9f0c-42d7-9c10-08a0eb2e8490', '10279eb9-3d71-4ae1-a482-2b4921d95b36', 'titular', 'Finales del siglo XVIII o comienzos del XIX', 'Titular de la Resurrección.', 'published')
on conflict (id) do update set
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  image_entity_id = excluded.image_entity_id,
  relation_type = excluded.relation_type,
  date_from_text = excluded.date_from_text,
  notes = excluded.notes,
  status = excluded.status;

insert into public.image_authorships (id, image_entity_id, agent_entity_id, authorship_type, role_name, date_from_text, certainty, notes, status)
values ('225d2a91-4ac6-432f-9399-d493bfa68e49', 'ac08220a-32cd-4af4-978a-3a9c2403b273', '67ccc278-fa71-4aaf-87a7-d42093a6ad7e', 'author', 'escultor', '1995', 'documented', 'Autoría documentada de la imagen actual.', 'published')
on conflict (id) do update set
  image_entity_id = excluded.image_entity_id,
  agent_entity_id = excluded.agent_entity_id,
  authorship_type = excluded.authorship_type,
  role_name = excluded.role_name,
  date_from_text = excluded.date_from_text,
  certainty = excluded.certainty,
  notes = excluded.notes,
  status = excluded.status;

insert into public.image_authorships (id, image_entity_id, authorship_type, role_name, date_from_text, certainty, notes, status)
values ('98ef35a4-77ab-4748-ad5c-32f8110664f6', 'ac3676a4-0794-4342-81f6-8154a4c5ee82', 'anonymous', 'autor', 'Comienzos del siglo XVII', 'unknown', 'Autor desconocido; se evita convertir hipótesis de círculo o taller en atribución.', 'published')
on conflict (id) do update set
  image_entity_id = excluded.image_entity_id,
  authorship_type = excluded.authorship_type,
  role_name = excluded.role_name,
  date_from_text = excluded.date_from_text,
  certainty = excluded.certainty,
  notes = excluded.notes,
  status = excluded.status;

insert into public.image_authorships (id, image_entity_id, authorship_type, role_name, date_from_text, certainty, notes, status)
values ('678de99e-d724-4968-8aa9-7cf401e53522', '10279eb9-3d71-4ae1-a482-2b4921d95b36', 'anonymous', 'autor', 'Finales del siglo XVIII o comienzos del XIX', 'unknown', 'Autor desconocido.', 'published')
on conflict (id) do update set
  image_entity_id = excluded.image_entity_id,
  authorship_type = excluded.authorship_type,
  role_name = excluded.role_name,
  date_from_text = excluded.date_from_text,
  certainty = excluded.certainty,
  notes = excluded.notes,
  status = excluded.status;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('7e162d56-1468-41f1-8068-0a4c88d2e167', 'step', 'Paso del Santísimo Cristo Yacente', 'paso-santisimo-cristo-yacente-dos-hermanas', 'Paso de Cristo Yacente, realizado por Manuel Pineda Calderón en 1960 y dotado de urna de plata en 1970.', 'published')
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.steps (entity_id, step_type, current_condition, style, materials, execution_date_text, description)
values ('7e162d56-1468-41f1-8068-0a4c88d2e167', 'Misterio', 'preserved', 'Neorrenacentista', 'Caoba de Guinea y pino de Flandes', '1960', 'Paso del Cristo Yacente realizado por Manuel Pineda Calderón. La urna acristalada incorpora orfebrería de Hijos de Juan Fernández de 1970.')
on conflict (entity_id) do update set
  step_type = excluded.step_type,
  current_condition = excluded.current_condition,
  style = excluded.style,
  materials = excluded.materials,
  execution_date_text = excluded.execution_date_text,
  description = excluded.description;

insert into public.brotherhood_steps (id, brotherhood_entity_id, step_entity_id, relation_type, date_from_text, notes, status)
values ('454b1809-4240-4e65-9726-e9fc12a2a76e', '000e79af-9f0c-42d7-9c10-08a0eb2e8490', '7e162d56-1468-41f1-8068-0a4c88d2e167', 'actual', '1960', 'Paso actual del Cristo Yacente.', 'published')
on conflict (id) do update set
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  step_entity_id = excluded.step_entity_id,
  relation_type = excluded.relation_type,
  date_from_text = excluded.date_from_text,
  notes = excluded.notes,
  status = excluded.status;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('ecabca9b-7fc9-4ac5-a273-e1ee75c7c1d8', 'step', 'Paso de palio de Nuestra Señora de la Soledad', 'paso-palio-nuestra-senora-soledad-santo-entierro-dos-hermanas', 'Paso de palio de cajón en terciopelo negro, con bordados y orfebrería desarrollados principalmente en las décadas de 1970 a 1990.', 'published')
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.steps (entity_id, step_type, current_condition, style, materials, execution_date_text, description)
values ('ecabca9b-7fc9-4ac5-a273-e1ee75c7c1d8', 'Palio', 'preserved', 'Palio de cajón', 'Terciopelo negro y orfebrería plateada', 'Conjunto desarrollado durante las décadas de 1970 a 1990', 'Paso de palio de Nuestra Señora de la Soledad. La ficha separa las fechas documentadas de candelería, jarras, varales, respiraderos, candelabros y peana.')
on conflict (entity_id) do update set
  step_type = excluded.step_type,
  current_condition = excluded.current_condition,
  style = excluded.style,
  materials = excluded.materials,
  execution_date_text = excluded.execution_date_text,
  description = excluded.description;

insert into public.brotherhood_steps (id, brotherhood_entity_id, step_entity_id, relation_type, date_from_text, notes, status)
values ('c6adec42-8748-4956-b733-a2bfaf827ef4', '000e79af-9f0c-42d7-9c10-08a0eb2e8490', 'ecabca9b-7fc9-4ac5-a273-e1ee75c7c1d8', 'actual', 'Siglo XX', 'Paso actual de Nuestra Señora de la Soledad.', 'published')
on conflict (id) do update set
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  step_entity_id = excluded.step_entity_id,
  relation_type = excluded.relation_type,
  date_from_text = excluded.date_from_text,
  notes = excluded.notes,
  status = excluded.status;

insert into public.image_steps (id, image_entity_id, step_entity_id, relation_type, date_from_text, status)
values ('a8cf16f0-05c3-4771-8692-a3620efbcc96', 'ac08220a-32cd-4af4-978a-3a9c2403b273', '7e162d56-1468-41f1-8068-0a4c88d2e167', 'procesiona_en', '1995', 'published')
on conflict (id) do update set
  image_entity_id = excluded.image_entity_id,
  step_entity_id = excluded.step_entity_id,
  relation_type = excluded.relation_type,
  date_from_text = excluded.date_from_text,
  status = excluded.status;

insert into public.image_steps (id, image_entity_id, step_entity_id, relation_type, notes, status)
values ('20672fd6-de4e-4727-891f-86b1f8f6974d', 'ac3676a4-0794-4342-81f6-8154a4c5ee82', 'ecabca9b-7fc9-4ac5-a273-e1ee75c7c1d8', 'procesiona_en', 'Paso de palio actual.', 'published')
on conflict (id) do update set
  image_entity_id = excluded.image_entity_id,
  step_entity_id = excluded.step_entity_id,
  relation_type = excluded.relation_type,
  notes = excluded.notes,
  status = excluded.status;

insert into public.brotherhood_habits (id, brotherhood_entity_id, name, tunic_description, hood_description, cord_description, footwear_description, sort_order, notes, status)
values ('ea4f542d-507f-4f68-86e6-420cebfccc24', '000e79af-9f0c-42d7-9c10-08a0eb2e8490', 'Hábito de nazareno', 'Túnica negra de ruán con cola.', 'Antifaz negro.', 'Cinturón de esparto.', 'Calzado negro.', 1, 'Descripción documentada por fuentes históricas y locales.', 'published')
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

insert into public.cults (id, brotherhood_entity_id, image_entity_id, cult_type, title, place_id, description, status, is_recurring, recurrence_label, display_order, notes)
values ('978f7c59-b75e-417b-a784-0d3e16f028d3', '000e79af-9f0c-42d7-9c10-08a0eb2e8490', 'ac08220a-32cd-4af4-978a-3a9c2403b273', 'Besapiés', 'Besapiés del Santísimo Cristo Yacente', '62b23280-a700-4965-b1e4-dcc5545a9d8c', 'Culto documentado históricamente; no se fija una fecha de 2026.', 'published', TRUE, 'Culto periódico; fecha anual por confirmar', 1, 'Culto documentado históricamente; no se fija una fecha de 2026.')
on conflict (id) do update set
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  image_entity_id = excluded.image_entity_id,
  cult_type = excluded.cult_type,
  title = excluded.title,
  place_id = excluded.place_id,
  description = excluded.description,
  status = excluded.status,
  is_recurring = excluded.is_recurring,
  recurrence_label = excluded.recurrence_label,
  display_order = excluded.display_order,
  notes = excluded.notes;

insert into public.cult_entities (id, cult_id, entity_id, role, notes)
values ('a2a230eb-090e-4d06-8770-e9fb4e15e020', '978f7c59-b75e-417b-a784-0d3e16f028d3', 'ac08220a-32cd-4af4-978a-3a9c2403b273', 'titular', 'Imagen objeto del culto.')
on conflict (id) do update set
  cult_id = excluded.cult_id,
  entity_id = excluded.entity_id,
  role = excluded.role,
  notes = excluded.notes;

insert into public.cults (id, brotherhood_entity_id, image_entity_id, cult_type, title, place_id, description, status, is_recurring, recurrence_label, display_order, notes)
values ('3525bc3e-2e23-4982-8a20-9906d61ded96', '000e79af-9f0c-42d7-9c10-08a0eb2e8490', 'ac08220a-32cd-4af4-978a-3a9c2403b273', 'Triduo', 'Triduo al Santísimo Cristo Yacente', '62b23280-a700-4965-b1e4-dcc5545a9d8c', 'La fuente histórica documenta su celebración; no se extrapolan fechas de 2008 a 2026.', 'published', TRUE, 'Culto periódico; fecha anual por confirmar', 2, 'La fuente histórica documenta su celebración; no se extrapolan fechas de 2008 a 2026.')
on conflict (id) do update set
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  image_entity_id = excluded.image_entity_id,
  cult_type = excluded.cult_type,
  title = excluded.title,
  place_id = excluded.place_id,
  description = excluded.description,
  status = excluded.status,
  is_recurring = excluded.is_recurring,
  recurrence_label = excluded.recurrence_label,
  display_order = excluded.display_order,
  notes = excluded.notes;

insert into public.cult_entities (id, cult_id, entity_id, role, notes)
values ('6d2bff16-f65b-46b7-9b6d-c6e6d6be059e', '3525bc3e-2e23-4982-8a20-9906d61ded96', 'ac08220a-32cd-4af4-978a-3a9c2403b273', 'titular', 'Imagen objeto del culto.')
on conflict (id) do update set
  cult_id = excluded.cult_id,
  entity_id = excluded.entity_id,
  role = excluded.role,
  notes = excluded.notes;

insert into public.cults (id, brotherhood_entity_id, image_entity_id, cult_type, title, place_id, description, status, is_recurring, recurrence_label, display_order, notes)
values ('fc174a64-afb5-4972-a85a-27e077391477', '000e79af-9f0c-42d7-9c10-08a0eb2e8490', 'ac08220a-32cd-4af4-978a-3a9c2403b273', 'Función principal', 'Función principal al Santísimo Cristo Yacente', '62b23280-a700-4965-b1e4-dcc5545a9d8c', 'La fuente histórica documenta su celebración; no se extrapola la fecha de 2008.', 'published', TRUE, 'Culto periódico; fecha anual por confirmar', 3, 'La fuente histórica documenta su celebración; no se extrapola la fecha de 2008.')
on conflict (id) do update set
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  image_entity_id = excluded.image_entity_id,
  cult_type = excluded.cult_type,
  title = excluded.title,
  place_id = excluded.place_id,
  description = excluded.description,
  status = excluded.status,
  is_recurring = excluded.is_recurring,
  recurrence_label = excluded.recurrence_label,
  display_order = excluded.display_order,
  notes = excluded.notes;

insert into public.cult_entities (id, cult_id, entity_id, role, notes)
values ('2ed248e1-38cf-4e74-8a76-18420f012fd5', 'fc174a64-afb5-4972-a85a-27e077391477', 'ac08220a-32cd-4af4-978a-3a9c2403b273', 'titular', 'Imagen objeto del culto.')
on conflict (id) do update set
  cult_id = excluded.cult_id,
  entity_id = excluded.entity_id,
  role = excluded.role,
  notes = excluded.notes;

insert into public.cults (id, brotherhood_entity_id, image_entity_id, cult_type, title, place_id, description, status, is_recurring, recurrence_label, display_order, notes)
values ('b1f50ab8-e696-4224-8e4b-acacae1acf1a', '000e79af-9f0c-42d7-9c10-08a0eb2e8490', 'ac3676a4-0794-4342-81f6-8154a4c5ee82', 'Triduo', 'Triduo a Nuestra Señora de la Soledad', '62b23280-a700-4965-b1e4-dcc5545a9d8c', 'Culto documentado en la historia de la corporación; calendario actual no fijado.', 'published', TRUE, 'Culto periódico; fecha anual por confirmar', 4, 'Culto documentado en la historia de la corporación; calendario actual no fijado.')
on conflict (id) do update set
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  image_entity_id = excluded.image_entity_id,
  cult_type = excluded.cult_type,
  title = excluded.title,
  place_id = excluded.place_id,
  description = excluded.description,
  status = excluded.status,
  is_recurring = excluded.is_recurring,
  recurrence_label = excluded.recurrence_label,
  display_order = excluded.display_order,
  notes = excluded.notes;

insert into public.cult_entities (id, cult_id, entity_id, role, notes)
values ('e2e0528d-b22c-41be-bada-8ab5bbb0f28e', 'b1f50ab8-e696-4224-8e4b-acacae1acf1a', 'ac3676a4-0794-4342-81f6-8154a4c5ee82', 'titular', 'Imagen objeto del culto.')
on conflict (id) do update set
  cult_id = excluded.cult_id,
  entity_id = excluded.entity_id,
  role = excluded.role,
  notes = excluded.notes;

insert into public.cults (id, brotherhood_entity_id, image_entity_id, cult_type, title, place_id, description, status, is_recurring, recurrence_label, display_order, notes)
values ('7aa7ebe3-89a1-48af-8447-76d38e8dbc52', '000e79af-9f0c-42d7-9c10-08a0eb2e8490', '10279eb9-3d71-4ae1-a482-2b4921d95b36', 'Besapié', 'Besapié del Cristo Resucitado', '62b23280-a700-4965-b1e4-dcc5545a9d8c', 'Documentado en 2026 sin inferir una fecha exacta del acto a partir de la publicación.', 'published', TRUE, 'Culto periódico; fecha anual por confirmar', 5, 'Documentado en 2026 sin inferir una fecha exacta del acto a partir de la publicación.')
on conflict (id) do update set
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  image_entity_id = excluded.image_entity_id,
  cult_type = excluded.cult_type,
  title = excluded.title,
  place_id = excluded.place_id,
  description = excluded.description,
  status = excluded.status,
  is_recurring = excluded.is_recurring,
  recurrence_label = excluded.recurrence_label,
  display_order = excluded.display_order,
  notes = excluded.notes;

insert into public.cult_entities (id, cult_id, entity_id, role, notes)
values ('06389906-982e-47dd-aede-c2755c0829ed', '7aa7ebe3-89a1-48af-8447-76d38e8dbc52', '10279eb9-3d71-4ae1-a482-2b4921d95b36', 'titular', 'Imagen objeto del culto.')
on conflict (id) do update set
  cult_id = excluded.cult_id,
  entity_id = excluded.entity_id,
  role = excluded.role,
  notes = excluded.notes;

insert into public.outings (id, brotherhood_entity_id, outing_type, character, title, outing_date, year, departure_time, return_time, municipality_id, origin_place_id, destination_place_id, event_status, status, route_summary, public_notes, slug)
values ('5a9602ba-a24a-4136-b853-a15cea1846a0', '000e79af-9f0c-42d7-9c10-08a0eb2e8490', 'Estación de penitencia', 'ordinary', 'Estación de penitencia del Sábado Santo 2026', '2026-04-04', 2026, '18:30', '22:30', '24e0b757-f3fd-4d9c-82c9-2a758444f2d6', '62b23280-a700-4965-b1e4-dcc5545a9d8c', '62b23280-a700-4965-b1e4-dcc5545a9d8c', 'held', 'published', 'Santa María Magdalena y calles de Dos Hermanas; itinerario íntegro conservado en la fuente.', 'Salida de Sábado Santo con el Cristo Yacente y Nuestra Señora de la Soledad. No se mezcla con la procesión del Resucitado del día siguiente.', 'estacion-penitencia-santo-entierro-dos-hermanas-2026')
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
  event_status = excluded.event_status,
  status = excluded.status,
  route_summary = excluded.route_summary,
  public_notes = excluded.public_notes,
  slug = excluded.slug;

insert into public.outings (id, brotherhood_entity_id, outing_type, character, title, outing_date, year, departure_time, return_time, municipality_id, origin_place_id, destination_place_id, event_status, status, public_notes, slug)
values ('01e973d2-0ee2-4c01-9d56-233cbf122096', '000e79af-9f0c-42d7-9c10-08a0eb2e8490', 'Procesión de Gloria', 'ordinary', 'Procesión del Cristo Resucitado 2026', '2026-04-05', 2026, '12:30', '14:00', '24e0b757-f3fd-4d9c-82c9-2a758444f2d6', '62b23280-a700-4965-b1e4-dcc5545a9d8c', '62b23280-a700-4965-b1e4-dcc5545a9d8c', 'held', 'published', 'Procesión del Domingo de Resurrección, separada de la estación de penitencia del Sábado Santo.', 'procesion-cristo-resucitado-dos-hermanas-2026')
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
  event_status = excluded.event_status,
  status = excluded.status,
  public_notes = excluded.public_notes,
  slug = excluded.slug;

insert into public.outing_entities (id, outing_id, entity_id, role, notes)
values ('783d2e3a-28d5-437f-b23d-12ecd1a5ed91', '5a9602ba-a24a-4136-b853-a15cea1846a0', 'ac08220a-32cd-4af4-978a-3a9c2403b273', 'titular_procesional', 'Titular participante en esta salida.')
on conflict (id) do update set
  outing_id = excluded.outing_id,
  entity_id = excluded.entity_id,
  role = excluded.role,
  notes = excluded.notes;

insert into public.outing_entities (id, outing_id, entity_id, role, notes)
values ('f04e4c90-d04f-4461-8bad-2c6b1c278c12', '5a9602ba-a24a-4136-b853-a15cea1846a0', 'ac3676a4-0794-4342-81f6-8154a4c5ee82', 'titular_procesional', 'Titular participante en esta salida.')
on conflict (id) do update set
  outing_id = excluded.outing_id,
  entity_id = excluded.entity_id,
  role = excluded.role,
  notes = excluded.notes;

insert into public.outing_entities (id, outing_id, entity_id, role, notes)
values ('28eb249d-114a-439e-9984-28ea7ec6f0ca', '01e973d2-0ee2-4c01-9d56-233cbf122096', '10279eb9-3d71-4ae1-a482-2b4921d95b36', 'titular_procesional', 'Titular participante en esta salida.')
on conflict (id) do update set
  outing_id = excluded.outing_id,
  entity_id = excluded.entity_id,
  role = excluded.role,
  notes = excluded.notes;

insert into public.outing_music_positions (id, outing_id, step_entity_id, position_code, position_label, sequence_no, notes, status)
values ('fbee374b-75c9-42d3-98a1-d69fd702f5b8', '5a9602ba-a24a-4136-b853-a15cea1846a0', '7e162d56-1468-41f1-8068-0a4c88d2e167', 'before_step', 'Ante el paso del Cristo Yacente', 1, 'Asignación documentada para la edición indicada.', 'published')
on conflict (id) do update set
  outing_id = excluded.outing_id,
  step_entity_id = excluded.step_entity_id,
  position_code = excluded.position_code,
  position_label = excluded.position_label,
  sequence_no = excluded.sequence_no,
  notes = excluded.notes,
  status = excluded.status;

insert into public.outing_music_assignments (id, music_position_id, band_name_text, participation_mode, sequence_no, notes, status)
values ('31cbc7e7-ba5b-45d8-8412-15a30fb97edb', 'fbee374b-75c9-42d3-98a1-d69fd702f5b8', 'Música de capilla', 'full_route', 1, 'Edición documentada; no se generaliza a otros años.', 'published')
on conflict (id) do update set
  music_position_id = excluded.music_position_id,
  band_name_text = excluded.band_name_text,
  participation_mode = excluded.participation_mode,
  sequence_no = excluded.sequence_no,
  notes = excluded.notes,
  status = excluded.status;

insert into public.outing_music_positions (id, outing_id, step_entity_id, position_code, position_label, sequence_no, notes, status)
values ('499f44ea-212d-43b3-b9ca-6877aaa33b65', '5a9602ba-a24a-4136-b853-a15cea1846a0', 'ecabca9b-7fc9-4ac5-a273-e1ee75c7c1d8', 'after_step', 'Tras el paso de palio', 2, 'Asignación documentada para la edición indicada.', 'published')
on conflict (id) do update set
  outing_id = excluded.outing_id,
  step_entity_id = excluded.step_entity_id,
  position_code = excluded.position_code,
  position_label = excluded.position_label,
  sequence_no = excluded.sequence_no,
  notes = excluded.notes,
  status = excluded.status;

insert into public.outing_music_assignments (id, music_position_id, band_entity_id, participation_mode, sequence_no, notes, status)
values ('f8c3a464-60a4-468d-965b-68799807f72f', '499f44ea-212d-43b3-b9ca-6877aaa33b65', 'e1fe592f-c67d-42c3-9f2f-67137ef629ec', 'full_route', 1, 'Edición documentada; no se generaliza a otros años.', 'published')
on conflict (id) do update set
  music_position_id = excluded.music_position_id,
  band_entity_id = excluded.band_entity_id,
  participation_mode = excluded.participation_mode,
  sequence_no = excluded.sequence_no,
  notes = excluded.notes,
  status = excluded.status;

insert into public.outing_music_positions (id, outing_id, position_code, position_label, sequence_no, notes, status)
values ('c5511e18-9c8b-4019-ab9a-ed82d7666129', '01e973d2-0ee2-4c01-9d56-233cbf122096', 'after_procession', 'Acompañamiento del Cristo Resucitado', 1, 'Asignación documentada para la edición indicada.', 'published')
on conflict (id) do update set
  outing_id = excluded.outing_id,
  position_code = excluded.position_code,
  position_label = excluded.position_label,
  sequence_no = excluded.sequence_no,
  notes = excluded.notes,
  status = excluded.status;

insert into public.outing_music_assignments (id, music_position_id, band_name_text, participation_mode, sequence_no, notes, status)
values ('f34111b9-68a2-4f0a-ad45-a53a046adb57', 'c5511e18-9c8b-4019-ab9a-ed82d7666129', 'Banda Juvenil de Música Santa Ana de Dos Hermanas', 'full_route', 1, 'Edición documentada; no se generaliza a otros años.', 'published')
on conflict (id) do update set
  music_position_id = excluded.music_position_id,
  band_name_text = excluded.band_name_text,
  participation_mode = excluded.participation_mode,
  sequence_no = excluded.sequence_no,
  notes = excluded.notes,
  status = excluded.status;

insert into public.music_accompaniment_periods (id, brotherhood_entity_id, band_entity_id, step_entity_id, position, outing_type, year_from, is_current, notes, status, public_brotherhood_name, public_step_name, public_brotherhood_slug, public_municipality_name, public_municipality_slug, public_province)
values ('a875f93d-9875-4d8b-ac58-8c9e55c9db4a', '000e79af-9f0c-42d7-9c10-08a0eb2e8490', 'e1fe592f-c67d-42c3-9f2f-67137ef629ec', 'ecabca9b-7fc9-4ac5-a273-e1ee75c7c1d8', 'Tras el paso de palio de Nuestra Señora de la Soledad', 'Estación de penitencia', 2026, TRUE, 'Vigencia documentada para el Sábado Santo de 2026.', 'published', 'Santo Entierro de Dos Hermanas', 'Paso de palio de Nuestra Señora de la Soledad', 'santo-entierro-dos-hermanas', 'Dos Hermanas', 'dos-hermanas', 'Sevilla')
on conflict (id) do update set
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  band_entity_id = excluded.band_entity_id,
  step_entity_id = excluded.step_entity_id,
  position = excluded.position,
  outing_type = excluded.outing_type,
  year_from = excluded.year_from,
  is_current = excluded.is_current,
  notes = excluded.notes,
  status = excluded.status,
  public_brotherhood_name = excluded.public_brotherhood_name,
  public_step_name = excluded.public_step_name,
  public_brotherhood_slug = excluded.public_brotherhood_slug,
  public_municipality_name = excluded.public_municipality_name,
  public_municipality_slug = excluded.public_municipality_slug,
  public_province = excluded.public_province;

insert into public.brotherhood_procession_stats (id, brotherhood_entity_id, year, procession_date, procession_day, nazarenos_count, departure_time, entrance_time, source_id, status, notes)
values ('0293086a-689a-4eef-a7de-ed4ed37d5db0', '000e79af-9f0c-42d7-9c10-08a0eb2e8490', 2026, '2026-04-04', 'Sábado Santo', 180, '18:30', '22:30', 'e130385f-a089-48e3-a01f-c5365f462a99', 'published', 'Cifra publicada para la salida del Sábado Santo; no comprende la procesión del Resucitado.')
on conflict (id) do update set
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  year = excluded.year,
  procession_date = excluded.procession_date,
  procession_day = excluded.procession_day,
  nazarenos_count = excluded.nazarenos_count,
  departure_time = excluded.departure_time,
  entrance_time = excluded.entrance_time,
  source_id = excluded.source_id,
  status = excluded.status,
  notes = excluded.notes;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('2886e5a2-c1b1-47d4-8d6d-2837599eeda2', 'heritage_asset', 'Urna del paso del Santísimo Cristo Yacente', 'urna-yacente-santo-entierro-dos-hermanas', 'Urna acristalada de lenguaje renacentista realizada en plata por Hijos de Juan Fernández.', 'published')
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.heritage_assets (entity_id, parent_entity_id, asset_type, description, current_condition, date_from_text, is_current, materials, display_order, is_featured)
values ('2886e5a2-c1b1-47d4-8d6d-2837599eeda2', '7e162d56-1468-41f1-8068-0a4c88d2e167', 'Orfebrería procesional', 'Urna acristalada de lenguaje renacentista realizada en plata por Hijos de Juan Fernández.', 'Conservado', '1970', TRUE, 'Plata y cristal', 1, TRUE)
on conflict (entity_id) do update set
  parent_entity_id = excluded.parent_entity_id,
  asset_type = excluded.asset_type,
  description = excluded.description,
  current_condition = excluded.current_condition,
  date_from_text = excluded.date_from_text,
  is_current = excluded.is_current,
  materials = excluded.materials,
  display_order = excluded.display_order,
  is_featured = excluded.is_featured;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('88fdef3d-aa5b-40d5-9848-429d8d56d743', 'heritage_asset', 'Bordados del paso de palio de Nuestra Señora de la Soledad', 'palio-bordados-santo-entierro-dos-hermanas', 'Conjunto de palio, manto y faldones bordados por el taller Carrasquilla.', 'published')
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.heritage_assets (entity_id, parent_entity_id, asset_type, description, current_condition, date_from_text, is_current, materials, display_order, is_featured)
values ('88fdef3d-aa5b-40d5-9848-429d8d56d743', 'ecabca9b-7fc9-4ac5-a273-e1ee75c7c1d8', 'Bordado procesional', 'Conjunto de palio, manto y faldones bordados por el taller Carrasquilla.', 'Conservado', 'Finales del siglo XX', TRUE, 'Terciopelo negro e hilo metálico', 2, FALSE)
on conflict (entity_id) do update set
  parent_entity_id = excluded.parent_entity_id,
  asset_type = excluded.asset_type,
  description = excluded.description,
  current_condition = excluded.current_condition,
  date_from_text = excluded.date_from_text,
  is_current = excluded.is_current,
  materials = excluded.materials,
  display_order = excluded.display_order,
  is_featured = excluded.is_featured;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('b782dc06-1f48-4872-ae01-28bb33f7903d', 'heritage_asset', 'Orfebrería del paso de palio de Nuestra Señora de la Soledad', 'palio-orfebreria-santo-entierro-dos-hermanas', 'Conjunto documentado de candelería, jarras, varales, respiraderos, candelabros y peana, ejecutado en varias fases.', 'published')
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.heritage_assets (entity_id, parent_entity_id, asset_type, description, current_condition, date_from_text, is_current, materials, display_order, is_featured)
values ('b782dc06-1f48-4872-ae01-28bb33f7903d', 'ecabca9b-7fc9-4ac5-a273-e1ee75c7c1d8', 'Orfebrería procesional', 'Conjunto documentado de candelería, jarras, varales, respiraderos, candelabros y peana, ejecutado en varias fases.', 'Conservado', '1977–1997', TRUE, 'Metal plateado', 3, FALSE)
on conflict (entity_id) do update set
  parent_entity_id = excluded.parent_entity_id,
  asset_type = excluded.asset_type,
  description = excluded.description,
  current_condition = excluded.current_condition,
  date_from_text = excluded.date_from_text,
  is_current = excluded.is_current,
  materials = excluded.materials,
  display_order = excluded.display_order,
  is_featured = excluded.is_featured;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('a2b45e88-71b8-402b-ae5d-f98301b1095d', 'event', 'Fundación y primeras noticias documentales', 'fundacion-santo-entierro-dos-hermanas', 'La corporación aparece documentada a finales del siglo XVI.', 'published')
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.events (entity_id, event_type, event_date_text, place_id, description, event_category, brotherhood_entity_id, municipality_id, event_status, location_text)
values ('a2b45e88-71b8-402b-ae5d-f98301b1095d', 'foundation', 'Hacia 1596', '62b23280-a700-4965-b1e4-dcc5545a9d8c', 'La corporación aparece documentada a finales del siglo XVI.', 'historical', '000e79af-9f0c-42d7-9c10-08a0eb2e8490', '24e0b757-f3fd-4d9c-82c9-2a758444f2d6', 'held', 'Iglesia Parroquial de Santa María Magdalena, Dos Hermanas')
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
values ('4372871a-593f-47b0-88d2-45c31d3895e9', 'event', 'Incendio parroquial de 1936', 'incendio-1936-santo-entierro-dos-hermanas', 'Nuestra Señora de la Soledad sobrevivió con pocos daños al incendio de la parroquia.', 'published')
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.events (entity_id, event_type, event_date, event_date_text, place_id, description, event_category, brotherhood_entity_id, municipality_id, event_status, location_text)
values ('4372871a-593f-47b0-88d2-45c31d3895e9', 'historical_event', '1936-07-01', 'Julio de 1936', '62b23280-a700-4965-b1e4-dcc5545a9d8c', 'Nuestra Señora de la Soledad sobrevivió con pocos daños al incendio de la parroquia.', 'historical', '000e79af-9f0c-42d7-9c10-08a0eb2e8490', '24e0b757-f3fd-4d9c-82c9-2a758444f2d6', 'held', 'Iglesia Parroquial de Santa María Magdalena, Dos Hermanas')
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
values ('4536184e-a7fd-4b88-ae4d-851fc234de55', 'event', 'Restauración de Nuestra Señora de la Soledad', 'restauracion-soledad-1940-santo-entierro-dos-hermanas', 'José Luis Ferrer de Couto Lamas restauró la imagen en 1940.', 'published')
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.events (entity_id, event_type, event_date_text, place_id, description, event_category, brotherhood_entity_id, municipality_id, event_status, location_text)
values ('4536184e-a7fd-4b88-ae4d-851fc234de55', 'restoration', '1940', '62b23280-a700-4965-b1e4-dcc5545a9d8c', 'José Luis Ferrer de Couto Lamas restauró la imagen en 1940.', 'historical', '000e79af-9f0c-42d7-9c10-08a0eb2e8490', '24e0b757-f3fd-4d9c-82c9-2a758444f2d6', 'held', 'Iglesia Parroquial de Santa María Magdalena, Dos Hermanas')
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
values ('b7c920d9-80d6-4ad6-afe9-a448574d66f6', 'event', 'Bendición del Santísimo Cristo Yacente', 'bendicion-yacente-1995-santo-entierro-dos-hermanas', 'Bendición de la imagen actual, obra de Juan Manuel Miñarro López.', 'published')
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.events (entity_id, event_type, event_date, event_date_text, place_id, description, event_category, brotherhood_entity_id, municipality_id, event_status, location_text)
values ('b7c920d9-80d6-4ad6-afe9-a448574d66f6', 'blessing', '1995-02-19', '19 de febrero de 1995', '62b23280-a700-4965-b1e4-dcc5545a9d8c', 'Bendición de la imagen actual, obra de Juan Manuel Miñarro López.', 'historical', '000e79af-9f0c-42d7-9c10-08a0eb2e8490', '24e0b757-f3fd-4d9c-82c9-2a758444f2d6', 'held', 'Iglesia Parroquial de Santa María Magdalena, Dos Hermanas')
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
values ('7033890c-ef97-435d-81a4-0f3390f5cb10', '000e79af-9f0c-42d7-9c10-08a0eb2e8490', 'instagram', 'https://www.instagram.com/hdadsantoentierro/', 'Instagram oficial', 1, TRUE)
on conflict (id) do update set
  entity_id = excluded.entity_id,
  platform = excluded.platform,
  url = excluded.url,
  label = excluded.label,
  display_order = excluded.display_order,
  is_public = excluded.is_public;

insert into public.entity_social_links (id, entity_id, platform, url, label, display_order, is_public)
values ('fabbbba0-e90a-4efc-a7cc-ef1361c8b98f', '000e79af-9f0c-42d7-9c10-08a0eb2e8490', 'x', 'https://x.com/SEntierroDosHer', 'X oficial', 2, TRUE)
on conflict (id) do update set
  entity_id = excluded.entity_id,
  platform = excluded.platform,
  url = excluded.url,
  label = excluded.label,
  display_order = excluded.display_order,
  is_public = excluded.is_public;

insert into public.source_links (id, entity_id, scope, source_id)
values ('6867f617-a52c-44db-88dc-f55d73eea8dc', '000e79af-9f0c-42d7-9c10-08a0eb2e8490', 'Identidad general', 'fe26768c-ae35-4deb-a3a4-bb485a0b401d')
on conflict (id) do update set
  entity_id = excluded.entity_id,
  scope = excluded.scope,
  source_id = excluded.source_id;

insert into public.source_links (id, entity_id, scope, source_id)
values ('87841b30-82ca-4840-9be8-c4575e062ae1', '000e79af-9f0c-42d7-9c10-08a0eb2e8490', 'Historia, titulares, pasos y hábito', '6812cf58-cbdf-4909-a8e7-4220c6c730a4')
on conflict (id) do update set
  entity_id = excluded.entity_id,
  scope = excluded.scope,
  source_id = excluded.source_id;

insert into public.source_links (id, brotherhood_image_id, scope, source_id)
values ('3de0fd3a-e329-4e18-9a10-d8cff1ed6143', 'cd13ae16-3925-4d04-b353-7d42f1a4771d', 'Titular y bendición', '6812cf58-cbdf-4909-a8e7-4220c6c730a4')
on conflict (id) do update set
  brotherhood_image_id = excluded.brotherhood_image_id,
  scope = excluded.scope,
  source_id = excluded.source_id;

insert into public.source_links (id, image_authorship_id, scope, source_id)
values ('8f7f90f2-736c-4193-8d95-605c01cae0fc', '225d2a91-4ac6-432f-9399-d493bfa68e49', 'Autoría del Cristo Yacente', '6812cf58-cbdf-4909-a8e7-4220c6c730a4')
on conflict (id) do update set
  image_authorship_id = excluded.image_authorship_id,
  scope = excluded.scope,
  source_id = excluded.source_id;

insert into public.source_links (id, brotherhood_image_id, scope, source_id)
values ('6c696083-a6b3-4cfa-986d-ad5c0fab7857', 'bbb2e996-0cb6-4388-9eff-8ec09249bba9', 'Datación e historia de la Soledad', 'fae169ec-e20c-462d-a727-d6e549c340e9')
on conflict (id) do update set
  brotherhood_image_id = excluded.brotherhood_image_id,
  scope = excluded.scope,
  source_id = excluded.source_id;

insert into public.source_links (id, image_authorship_id, scope, source_id)
values ('ca3d5b81-9062-441a-8207-74c5666340f5', '98ef35a4-77ab-4748-ad5c-32f8110664f6', 'Autoría anónima prudente', 'fae169ec-e20c-462d-a727-d6e549c340e9')
on conflict (id) do update set
  image_authorship_id = excluded.image_authorship_id,
  scope = excluded.scope,
  source_id = excluded.source_id;

insert into public.source_links (id, brotherhood_image_id, scope, source_id)
values ('7451252a-17af-459f-bd2d-a7ecb5f9ee31', '500005d6-4f76-4f80-a3e6-d2c7730f48c6', 'Titular y datación del Resucitado', '6812cf58-cbdf-4909-a8e7-4220c6c730a4')
on conflict (id) do update set
  brotherhood_image_id = excluded.brotherhood_image_id,
  scope = excluded.scope,
  source_id = excluded.source_id;

insert into public.source_links (id, image_authorship_id, scope, source_id)
values ('12c8a646-a2a1-42ad-9866-859c66b57f57', '678de99e-d724-4968-8aa9-7cf401e53522', 'Autoría anónima', '6812cf58-cbdf-4909-a8e7-4220c6c730a4')
on conflict (id) do update set
  image_authorship_id = excluded.image_authorship_id,
  scope = excluded.scope,
  source_id = excluded.source_id;

insert into public.source_links (id, brotherhood_step_id, scope, source_id)
values ('66a0c1c2-b6c3-4c1c-9cea-d6289e26dece', '454b1809-4240-4e65-9726-e9fc12a2a76e', 'Paso del Cristo Yacente', '6812cf58-cbdf-4909-a8e7-4220c6c730a4')
on conflict (id) do update set
  brotherhood_step_id = excluded.brotherhood_step_id,
  scope = excluded.scope,
  source_id = excluded.source_id;

insert into public.source_links (id, brotherhood_step_id, scope, source_id)
values ('e5a87c29-33dc-4a83-bc91-c354715a32e0', 'c6adec42-8748-4956-b733-a2bfaf827ef4', 'Paso de palio', '8ba85e23-d35c-429f-b66c-e6f33799f71d')
on conflict (id) do update set
  brotherhood_step_id = excluded.brotherhood_step_id,
  scope = excluded.scope,
  source_id = excluded.source_id;

insert into public.source_links (id, image_step_id, scope, source_id)
values ('08c109fa-45a7-49ba-b1f5-ab95b0552e0f', 'a8cf16f0-05c3-4771-8692-a3620efbcc96', 'Relación imagen-paso', '6812cf58-cbdf-4909-a8e7-4220c6c730a4')
on conflict (id) do update set
  image_step_id = excluded.image_step_id,
  scope = excluded.scope,
  source_id = excluded.source_id;

insert into public.source_links (id, image_step_id, scope, source_id)
values ('5950600e-e48e-466d-912a-d52f2d6d65eb', '20672fd6-de4e-4727-891f-86b1f8f6974d', 'Relación imagen-paso', '8ba85e23-d35c-429f-b66c-e6f33799f71d')
on conflict (id) do update set
  image_step_id = excluded.image_step_id,
  scope = excluded.scope,
  source_id = excluded.source_id;

insert into public.source_links (id, brotherhood_habit_id, scope, source_id)
values ('a65ac629-b5c4-4277-a442-fee2d5452c32', 'ea4f542d-507f-4f68-86e6-420cebfccc24', 'Hábito de nazareno', '6812cf58-cbdf-4909-a8e7-4220c6c730a4')
on conflict (id) do update set
  brotherhood_habit_id = excluded.brotherhood_habit_id,
  scope = excluded.scope,
  source_id = excluded.source_id;

insert into public.source_links (id, outing_id, scope, source_id)
values ('339b7f35-4e26-4a70-a0f8-9878762728fd', '5a9602ba-a24a-4136-b853-a15cea1846a0', 'Salida, horarios, recorrido y cortejo de 2026', 'e130385f-a089-48e3-a01f-c5365f462a99')
on conflict (id) do update set
  outing_id = excluded.outing_id,
  scope = excluded.scope,
  source_id = excluded.source_id;

insert into public.source_links (id, outing_id, scope, notes, source_id)
values ('372ebf75-4ddb-45e3-90f2-e726c5d1e64e', '01e973d2-0ee2-4c01-9d56-233cbf122096', 'Continuidad de la procesión del Resucitado', 'La fuente acredita la procesión y su música; la edición 2026 se mantiene separada del Sábado Santo.', '3d8b49c2-93fe-4746-9df3-c309f2215a9b')
on conflict (id) do update set
  outing_id = excluded.outing_id,
  scope = excluded.scope,
  notes = excluded.notes,
  source_id = excluded.source_id;

insert into public.source_links (id, outing_music_assignment_id, scope, source_id)
values ('e25390d7-5e95-41a7-ab25-bb94b39802d6', '31cbc7e7-ba5b-45d8-8412-15a30fb97edb', 'Música de capilla en 2026', 'e130385f-a089-48e3-a01f-c5365f462a99')
on conflict (id) do update set
  outing_music_assignment_id = excluded.outing_music_assignment_id,
  scope = excluded.scope,
  source_id = excluded.source_id;

insert into public.source_links (id, outing_music_assignment_id, scope, source_id)
values ('408d197f-c99c-40ac-a995-9b1778204686', 'f8c3a464-60a4-468d-965b-68799807f72f', 'Maestro Tejera tras el palio en 2026', 'e130385f-a089-48e3-a01f-c5365f462a99')
on conflict (id) do update set
  outing_music_assignment_id = excluded.outing_music_assignment_id,
  scope = excluded.scope,
  source_id = excluded.source_id;

insert into public.source_links (id, music_accompaniment_period_id, scope, source_id)
values ('ff843296-eade-4e3b-8b4a-dc15f47a8580', 'a875f93d-9875-4d8b-ac58-8c9e55c9db4a', 'Vigencia musical documentada en 2026', 'e130385f-a089-48e3-a01f-c5365f462a99')
on conflict (id) do update set
  music_accompaniment_period_id = excluded.music_accompaniment_period_id,
  scope = excluded.scope,
  source_id = excluded.source_id;

insert into public.source_links (id, outing_music_assignment_id, scope, source_id)
values ('fe73e1ce-a585-494f-8666-ac28539268ec', 'f34111b9-68a2-4f0a-ad45-a53a046adb57', 'Banda Juvenil Santa Ana en la procesión del Resucitado', '3d8b49c2-93fe-4746-9df3-c309f2215a9b')
on conflict (id) do update set
  outing_music_assignment_id = excluded.outing_music_assignment_id,
  scope = excluded.scope,
  source_id = excluded.source_id;

insert into public.source_links (id, cult_id, scope, source_id)
values ('b6fe480e-b7d0-4ef5-971e-3beb1a6e741e', '3525bc3e-2e23-4982-8a20-9906d61ded96', 'Triduo documentado históricamente', 'cf3a38ca-b96d-4d8b-b507-9cc69129c13a')
on conflict (id) do update set
  cult_id = excluded.cult_id,
  scope = excluded.scope,
  source_id = excluded.source_id;

insert into public.source_links (id, cult_id, scope, source_id)
values ('ff78f8de-09ea-46ec-8606-7d46e57ff65a', 'fc174a64-afb5-4972-a85a-27e077391477', 'Función documentada históricamente', 'cf3a38ca-b96d-4d8b-b507-9cc69129c13a')
on conflict (id) do update set
  cult_id = excluded.cult_id,
  scope = excluded.scope,
  source_id = excluded.source_id;

insert into public.source_links (id, cult_id, scope, source_id)
values ('f0d93a52-7314-4304-930d-b4b57db6056a', '7aa7ebe3-89a1-48af-8447-76d38e8dbc52', 'Besapié documentado en 2026', '963848bd-d0be-4038-96c2-b3dfe33014e2')
on conflict (id) do update set
  cult_id = excluded.cult_id,
  scope = excluded.scope,
  source_id = excluded.source_id;

insert into public.source_links (id, entity_id, scope, source_id)
values ('f2e68522-281d-4cec-85d4-989afa663d98', '2886e5a2-c1b1-47d4-8d6d-2837599eeda2', 'Patrimonio procesional', '6812cf58-cbdf-4909-a8e7-4220c6c730a4')
on conflict (id) do update set
  entity_id = excluded.entity_id,
  scope = excluded.scope,
  source_id = excluded.source_id;

insert into public.source_links (id, entity_id, scope, source_id)
values ('3acd8d4b-836f-43b9-b500-1592db991bb3', '88fdef3d-aa5b-40d5-9848-429d8d56d743', 'Patrimonio procesional', '8ba85e23-d35c-429f-b66c-e6f33799f71d')
on conflict (id) do update set
  entity_id = excluded.entity_id,
  scope = excluded.scope,
  source_id = excluded.source_id;

insert into public.source_links (id, entity_id, scope, source_id)
values ('0ce245e9-5149-4398-b99e-1b387d73028f', 'b782dc06-1f48-4872-ae01-28bb33f7903d', 'Patrimonio procesional', '8ba85e23-d35c-429f-b66c-e6f33799f71d')
on conflict (id) do update set
  entity_id = excluded.entity_id,
  scope = excluded.scope,
  source_id = excluded.source_id;

insert into public.source_links (id, entity_id, scope, source_id)
values ('2622ff97-ccb1-4478-86c8-65244afc34bd', 'a2b45e88-71b8-402b-ae5d-f98301b1095d', 'Acontecimiento histórico', '6812cf58-cbdf-4909-a8e7-4220c6c730a4')
on conflict (id) do update set
  entity_id = excluded.entity_id,
  scope = excluded.scope,
  source_id = excluded.source_id;

insert into public.source_links (id, entity_id, scope, source_id)
values ('6c22864c-0060-4378-9cb2-c7532bb55a7d', 'b7c920d9-80d6-4ad6-afe9-a448574d66f6', 'Acontecimiento histórico', '6812cf58-cbdf-4909-a8e7-4220c6c730a4')
on conflict (id) do update set
  entity_id = excluded.entity_id,
  scope = excluded.scope,
  source_id = excluded.source_id;

insert into public.source_links (id, entity_id, scope, source_id)
values ('b8758ef4-940d-4262-a230-df5830499c1b', '4372871a-593f-47b0-88d2-45c31d3895e9', 'Acontecimiento histórico', 'fae169ec-e20c-462d-a727-d6e549c340e9')
on conflict (id) do update set
  entity_id = excluded.entity_id,
  scope = excluded.scope,
  source_id = excluded.source_id;

insert into public.source_links (id, entity_id, scope, source_id)
values ('c651b58b-b1cc-42e2-b47c-2863263caf86', '4536184e-a7fd-4b88-ae4d-851fc234de55', 'Acontecimiento histórico', 'fae169ec-e20c-462d-a727-d6e549c340e9')
on conflict (id) do update set
  entity_id = excluded.entity_id,
  scope = excluded.scope,
  source_id = excluded.source_id;

commit;
