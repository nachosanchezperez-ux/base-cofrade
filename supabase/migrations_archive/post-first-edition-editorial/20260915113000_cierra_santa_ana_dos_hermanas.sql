-- HC-016 · decimoquinto contexto real: Santa Ana de Dos Hermanas
-- FIRST EDITION FREEZE: receta editorial DML, sin DDL ni cambios de RLS.

begin;

insert into public.sources (id, name, url, source_type, author_or_publisher, publication_date, accessed_at, notes)
values
  ('4b202272-1b32-46d7-8b35-6cfbca177cb2', 'Santa Ana celebra sus cultos y procesión', 'https://www.periodicoelnazareno.es/santa-ana-celebra-sus-cultos-y-procesion/', 'Medio local', 'Periódico El Nazareno', '2026-07-18', '2026-09-15', 'Programa de cultos, procesión y traslado de julio de 2026.'),
  ('048c317a-c462-4f10-9e20-da2e50e34f9b', 'Procesión de Santa Ana de Dos Hermanas 2026: recorrido, bandas y dónde verla en directo', 'https://www.elpespunte.es/articulo/cofrade/procesion-santa-ana-dos-hermanas-2026-recorrido-bandas-donde-verla-directo/20260726111651142604.html', 'Medio especializado', 'El Pespunte', '2026-07-26', '2026-09-15', 'Recorrido, cortejo, paso de tumbilla, retransmisión municipal y acompañamiento musical de la edición de 2026.'),
  ('b985fad5-cefb-4e42-8855-cf8e63cf1506', 'Santa Ana, Patrona de Dos Hermanas · archivo fotográfico', 'https://commons.wikimedia.org/wiki/File:Santa_Ana,_Patrona_de_Dos_Hermanas.jpg', 'Repositorio multimedia abierto', 'Wikimedia Commons', '2022-07-20', '2026-09-15', 'Fotografía de Daniel Jiménez bajo CC0 1.0; la página canónica documenta sujeto, autoría, licencia y descripción.'),
  ('5dc0c0d5-dad4-4b61-91b8-07c1fbd6e882', 'Provincia. Santa Ana, Patrona de Dos Hermanas', 'https://www.artesacro.org/Noticia/Ver/78701/provincia-santa-ana-patrona-dos-hermanas', 'Medio especializado', 'Arte Sacro', null, '2026-09-15', 'Historia, iconografía gótica y descripción del conjunto procesional.')
on conflict (id) do update set
  name = excluded.name,
  url = excluded.url,
  source_type = excluded.source_type,
  author_or_publisher = excluded.author_or_publisher,
  publication_date = excluded.publication_date,
  accessed_at = excluded.accessed_at,
  notes = excluded.notes;

update public.entities
set
  name = 'Santa Ana de Dos Hermanas',
  summary = 'Hermandad letífica de la Patrona de Dos Hermanas, con reglas aprobadas en 1523. Da culto a un grupo gótico de Santa Ana Triple y celebra su procesión anual cada 26 de julio.',
  status = 'published'
where id = '4bfb37c4-06ff-4ac5-b04d-539e280861ba';

update public.brotherhoods
set
  official_name = 'Muy Antigua, Venerable, Fervorosa y Real Hermandad y Cofradía de Nuestra Señora Santa Ana, Patrona de Dos Hermanas',
  popular_name = 'Hermandad de Santa Ana',
  foundation_text = '1523',
  municipality_id = '24e0b757-f3fd-4d9c-82c9-2a758444f2d6',
  canonical_see_place_id = 'e1eb33bd-4fa2-4b7c-8a23-26c2fbafc799',
  brotherhood_types = array['Gloria']::text[],
  current_procession_day = '26 de julio',
  history_text = 'Las reglas de la corporación fueron aprobadas en 1523 y constituyen uno de los testimonios documentales más antiguos de Dos Hermanas. La Hermandad da culto a Santa Ana, Patrona de la ciudad, representada junto a la Virgen y el Niño en la iconografía de Santa Ana Triple. La imagen permanece en su capilla, adosada a Santa María Magdalena, y pasa a la parroquia para los cultos principales y la procesión del 26 de julio.',
  notes = 'La cronología y la autoría de la imagen se expresan con prudencia: grupo gótico de principios del siglo XIV y autor desconocido.',
  instagram_url = 'https://www.instagram.com/hdadsantaanadh/'
where entity_id = '4bfb37c4-06ff-4ac5-b04d-539e280861ba';

insert into public.entity_social_links (id, entity_id, platform, url, label, display_order, is_public)
values ('d97ee963-32d1-4af7-a96e-0165c2859587', '4bfb37c4-06ff-4ac5-b04d-539e280861ba', 'instagram', 'https://www.instagram.com/hdadsantaanadh/', 'Instagram oficial', 1, true)
on conflict (entity_id, platform) do update set
  url = excluded.url,
  label = excluded.label,
  display_order = excluded.display_order,
  is_public = excluded.is_public;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('bc6b349b-b483-49cc-bb0f-df882f220611', 'image', 'Nuestra Señora Santa Ana', 'nuestra-senora-santa-ana-dos-hermanas', 'Grupo escultórico gótico de Santa Ana Triple, fechado prudentemente a principios del siglo XIV y venerado como Patrona de Dos Hermanas.', 'published')
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.images (entity_id, image_type, execution_date_text, material, current_condition, description, iconography, current_state_notes)
values ('bc6b349b-b483-49cc-bb0f-df882f220611', 'Grupo escultórico de Santa Ana Triple', 'Principios del siglo XIV', 'Madera policromada', 'extant', 'Conjunto de pequeño formato y ascendencia gótica que presenta a Santa Ana con la Virgen María y el Niño Jesús.', 'Santa Ana Triple: el Niño se sienta sobre la Virgen y María sobre Santa Ana, formando un grupo compacto.', 'La atribución permanece anónima; no se transforma la datación estilística en autoría.')
on conflict (entity_id) do update set
  image_type = excluded.image_type,
  execution_date_text = excluded.execution_date_text,
  material = excluded.material,
  current_condition = excluded.current_condition,
  description = excluded.description,
  iconography = excluded.iconography,
  current_state_notes = excluded.current_state_notes;

insert into public.image_authorships (id, image_entity_id, authorship_type, role_name, date_from_text, certainty, notes, status)
values ('8367b21e-4c73-4676-abbf-61ae72d3d46e', 'bc6b349b-b483-49cc-bb0f-df882f220611', 'anonymous', 'autor', 'Principios del siglo XIV', 'unknown', 'Autor desconocido; la datación se conserva como aproximación histórica y estilística.', 'published')
on conflict (id) do update set
  image_entity_id = excluded.image_entity_id,
  authorship_type = excluded.authorship_type,
  role_name = excluded.role_name,
  date_from_text = excluded.date_from_text,
  certainty = excluded.certainty,
  notes = excluded.notes,
  status = excluded.status;

insert into public.brotherhood_images (id, brotherhood_entity_id, image_entity_id, relation_type, date_from_text, notes, status)
values ('3c8c11b3-816f-43f2-bf4b-13cf97485715', '4bfb37c4-06ff-4ac5-b04d-539e280861ba', 'bc6b349b-b483-49cc-bb0f-df882f220611', 'titular', 'Documentada por las reglas de 1523', 'Titular y Patrona de Dos Hermanas.', 'published')
on conflict (id) do update set
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  image_entity_id = excluded.image_entity_id,
  relation_type = excluded.relation_type,
  date_from_text = excluded.date_from_text,
  notes = excluded.notes,
  status = excluded.status;

insert into public.entities (id, entity_type, name, slug, summary, status)
values ('2219446a-f48b-4364-aedf-528fca06edba', 'step', 'Paso de tumbilla de Santa Ana', 'paso-tumbilla-santa-ana-dos-hermanas', 'Paso procesional de gloria cubierto por una singular tumbilla sostenida por cuatro varales, con respiraderos de José Jiménez.', 'published')
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.steps (entity_id, step_type, current_condition, materials, execution_date_text, carrier_system, description, current_state_notes)
values ('2219446a-f48b-4364-aedf-528fca06edba', 'Paso procesional de Gloria', 'preserved', 'Madera, textiles y orfebrería de plata', 'Configuración histórica; tumbilla y respiraderos de José Jiménez', 'Costaleros', 'Paso de gloria cubierto por una tumbilla sostenida por cuatro varales. La imagen se dispone sobre sillón de caoba con incrustaciones de plata y queda enmarcada por una ráfaga de dieciocho placas repujadas.', 'La tipología recuerda al paso de la Virgen de los Reyes; no se asigna una fecha de ejecución no publicada.')
on conflict (entity_id) do update set
  step_type = excluded.step_type,
  current_condition = excluded.current_condition,
  materials = excluded.materials,
  execution_date_text = excluded.execution_date_text,
  carrier_system = excluded.carrier_system,
  description = excluded.description,
  current_state_notes = excluded.current_state_notes;

insert into public.brotherhood_steps (id, brotherhood_entity_id, step_entity_id, relation_type, date_from_text, notes, status)
values ('fdebf019-d5fc-46c0-b26d-f6f66b7c2231', '4bfb37c4-06ff-4ac5-b04d-539e280861ba', '2219446a-f48b-4364-aedf-528fca06edba', 'actual', 'Fecha de incorporación por documentar', 'Paso actual de la procesión anual de Santa Ana.', 'published')
on conflict (id) do update set
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  step_entity_id = excluded.step_entity_id,
  relation_type = excluded.relation_type,
  date_from_text = excluded.date_from_text,
  notes = excluded.notes,
  status = excluded.status;

insert into public.image_steps (id, image_entity_id, step_entity_id, relation_type, date_from_text, notes, status)
values ('79712dc8-5c82-45d9-8f6b-1e54d7a358c9', 'bc6b349b-b483-49cc-bb0f-df882f220611', '2219446a-f48b-4364-aedf-528fca06edba', 'processional_image', 'Vigente en 2026', 'La titular procesiona en este paso cada 26 de julio.', 'published')
on conflict (id) do update set
  image_entity_id = excluded.image_entity_id,
  step_entity_id = excluded.step_entity_id,
  relation_type = excluded.relation_type,
  date_from_text = excluded.date_from_text,
  notes = excluded.notes,
  status = excluded.status;

insert into public.media_assets (
  id, storage_path, media_type, title, caption, alt_text, author_name, source_name, source_url,
  rights_status, rights_holder, license, permission_notes, taken_or_created_date, width_px, height_px
)
values (
  '804575bf-37e6-4570-9aab-f705674e833d',
  '/media/hermandades/santa-ana-dos-hermanas/santa-ana-daniel-jimenez.webp',
  'image',
  'Nuestra Señora Santa Ana, Patrona de Dos Hermanas',
  'Grupo escultórico de Santa Ana Triple venerado como Patrona de Dos Hermanas.',
  'Santa Ana, la Virgen María y el Niño Jesús en el grupo escultórico de la Patrona de Dos Hermanas.',
  'Daniel Jiménez',
  'Wikimedia Commons',
  'https://commons.wikimedia.org/wiki/File:Santa_Ana,_Patrona_de_Dos_Hermanas.jpg',
  'public_domain',
  'Daniel Jiménez',
  'CC0 1.0',
  'La página canónica de Wikimedia Commons identifica la obra, a Daniel Jiménez como autor y la dedicación CC0 1.0. Se verificó visualmente que la fotografía representa al grupo de Santa Ana de Dos Hermanas; el archivo local solo se optimizó a WebP y conserva la atribución y procedencia.',
  '2022-07-20',
  1284,
  1854
)
on conflict (storage_path) do update set
  media_type = excluded.media_type,
  title = excluded.title,
  caption = excluded.caption,
  alt_text = excluded.alt_text,
  author_name = excluded.author_name,
  source_name = excluded.source_name,
  source_url = excluded.source_url,
  rights_status = excluded.rights_status,
  rights_holder = excluded.rights_holder,
  license = excluded.license,
  permission_notes = excluded.permission_notes,
  taken_or_created_date = excluded.taken_or_created_date,
  width_px = excluded.width_px,
  height_px = excluded.height_px,
  updated_at = now();

insert into public.entity_media (id, entity_id, media_asset_id, relation_type, sort_order, is_cover, notes, focus_x, focus_y, mobile_focus_x, mobile_focus_y, fit_mode)
values
  ('5f734ba7-ba2e-4ba4-b488-5ad668cc6b9c', '4bfb37c4-06ff-4ac5-b04d-539e280861ba', '804575bf-37e6-4570-9aab-f705674e833d', 'hero', 0, false, 'Cabecera abierta CC0 de la ficha de la Hermandad.', 50, 42, 50, 38, 'cover'),
  ('41e7d596-88de-4c12-a4aa-79a093df4bd8', 'bc6b349b-b483-49cc-bb0f-df882f220611', '804575bf-37e6-4570-9aab-f705674e833d', 'hero', 0, true, 'Portada documental de la ficha de la imagen.', 50, 45, 50, 42, 'cover')
on conflict (entity_id, media_asset_id, relation_type) do update set
  sort_order = excluded.sort_order,
  is_cover = excluded.is_cover,
  notes = excluded.notes,
  focus_x = excluded.focus_x,
  focus_y = excluded.focus_y,
  mobile_focus_x = excluded.mobile_focus_x,
  mobile_focus_y = excluded.mobile_focus_y,
  fit_mode = excluded.fit_mode;

insert into public.cults (id, brotherhood_entity_id, image_entity_id, cult_type, title, date_rule, month, time_text, place_id, description, status, is_recurring, recurrence_label, display_order, notes)
values
  ('b9c5ead0-ec12-44d1-a989-254b2561c827', '4bfb37c4-06ff-4ac5-b04d-539e280861ba', 'bc6b349b-b483-49cc-bb0f-df882f220611', 'Besamanos', 'Besamanos a Nuestra Señora Santa Ana', 'Días previos a la festividad de Santa Ana', 7, '10:00–13:00 y 18:30–21:00 en 2026', '62b23280-a700-4965-b1e4-dcc5545a9d8c', 'Veneración pública de la Patrona en Santa María Magdalena.', 'published', true, 'Julio; calendario anual por confirmar', 1, 'En 2026 se celebró los días 20 y 21 de julio.'),
  ('b7cda0fc-8c60-4c65-8603-f5b87bbd4fe1', '4bfb37c4-06ff-4ac5-b04d-539e280861ba', 'bc6b349b-b483-49cc-bb0f-df882f220611', 'Triduo', 'Triduo en honor a Nuestra Señora Santa Ana', 'Tres días anteriores a la festividad', 7, '20:45 en 2026', '62b23280-a700-4965-b1e4-dcc5545a9d8c', 'Triduo anual dedicado a la Patrona.', 'published', true, '23–25 de julio', 2, 'La regla 23–25 de julio queda respaldada por la edición de 2026.'),
  ('a2fbe0ec-5062-4586-b5b8-9551d3f8d6e9', '4bfb37c4-06ff-4ac5-b04d-539e280861ba', 'bc6b349b-b483-49cc-bb0f-df882f220611', 'Función solemne', 'Función solemne de Santa Ana', '26 de julio', 7, '11:00 en 2026', '62b23280-a700-4965-b1e4-dcc5545a9d8c', 'Función solemne en la festividad de Santa Ana.', 'published', true, '26 de julio', 3, 'En 2026 intervino la Coral Santa Ángela de la Cruz.')
on conflict (id) do update set
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  image_entity_id = excluded.image_entity_id,
  cult_type = excluded.cult_type,
  title = excluded.title,
  date_rule = excluded.date_rule,
  month = excluded.month,
  time_text = excluded.time_text,
  place_id = excluded.place_id,
  description = excluded.description,
  status = excluded.status,
  is_recurring = excluded.is_recurring,
  recurrence_label = excluded.recurrence_label,
  display_order = excluded.display_order,
  notes = excluded.notes;

insert into public.cult_entities (id, cult_id, entity_id, role, notes)
values
  ('8e230baf-a506-4570-952c-83c99684baaa', 'b9c5ead0-ec12-44d1-a989-254b2561c827', 'bc6b349b-b483-49cc-bb0f-df882f220611', 'titular', 'Imagen objeto del culto.'),
  ('f99481e4-f2b7-4929-a4ea-72e808cc25d2', 'b7cda0fc-8c60-4c65-8603-f5b87bbd4fe1', 'bc6b349b-b483-49cc-bb0f-df882f220611', 'titular', 'Imagen objeto del culto.'),
  ('ce9de1a9-98ca-4cee-9067-bd8f443ffa1e', 'a2fbe0ec-5062-4586-b5b8-9551d3f8d6e9', 'bc6b349b-b483-49cc-bb0f-df882f220611', 'titular', 'Imagen objeto del culto.')
on conflict (id) do update set
  cult_id = excluded.cult_id,
  entity_id = excluded.entity_id,
  role = excluded.role,
  notes = excluded.notes;

insert into public.cult_occurrences (id, cult_id, year, start_date, end_date, place_id, description_override, event_status, status, notes)
values
  ('262a1195-369c-49d9-bc9e-025567da022e', 'b9c5ead0-ec12-44d1-a989-254b2561c827', 2026, '2026-07-20', '2026-07-21', '62b23280-a700-4965-b1e4-dcc5545a9d8c', 'Besamanos de 10:00 a 13:00 y de 18:30 a 21:00.', 'held', 'published', 'Edición celebrada; no se proyectan sus horarios a otros años.'),
  ('72509c4e-f3c0-4c88-b5db-c29bf9468ddb', 'b7cda0fc-8c60-4c65-8603-f5b87bbd4fe1', 2026, '2026-07-23', '2026-07-25', '62b23280-a700-4965-b1e4-dcc5545a9d8c', 'Triduo a las 20:45.', 'held', 'published', 'Edición celebrada.'),
  ('6a58a8b8-c5a7-45c1-b80f-427be38f8d6e', 'a2fbe0ec-5062-4586-b5b8-9551d3f8d6e9', 2026, '2026-07-26', '2026-07-26', '62b23280-a700-4965-b1e4-dcc5545a9d8c', 'Función solemne a las 11:00 con la Coral Santa Ángela de la Cruz.', 'held', 'published', 'Edición celebrada.')
on conflict (id) do update set
  cult_id = excluded.cult_id,
  year = excluded.year,
  start_date = excluded.start_date,
  end_date = excluded.end_date,
  place_id = excluded.place_id,
  description_override = excluded.description_override,
  event_status = excluded.event_status,
  status = excluded.status,
  notes = excluded.notes;

insert into public.outings (id, brotherhood_entity_id, outing_type, character, title, outing_date, year, departure_time, municipality_id, origin_place_id, destination_place_id, route_summary, description, event_status, status, organizer_name, slug)
values
  ('0c5b397e-38ad-47e2-899d-7861b9c4c604', '4bfb37c4-06ff-4ac5-b04d-539e280861ba', 'Procesión de Gloria', 'ordinary', 'Procesión de Santa Ana 2026', '2026-07-26', 2026, '20:30', '24e0b757-f3fd-4d9c-82c9-2a758444f2d6', '62b23280-a700-4965-b1e4-dcc5545a9d8c', '62b23280-a700-4965-b1e4-dcc5545a9d8c', 'Plaza de la Constitución, San Francisco, Antonia Díaz, Calderón de la Barca, Divina Pastora, Santa Cruz, plaza Menéndez y Pelayo, Santa María Magdalena, Botica, plaza del Arenal, Nuestra Señora de Valme y plaza de la Constitución.', 'Procesión anual de la Patrona con representación de las hermandades locales y de la Corporación Municipal. La retransmisión municipal comenzó a las 20:00; esa hora no se confunde con la salida, fijada a las 20:30.', 'held', 'published', 'Hermandad de Santa Ana', 'procesion-santa-ana-dos-hermanas-2026'),
  ('db4e2434-34c5-4d87-8784-491d7b48497d', '4bfb37c4-06ff-4ac5-b04d-539e280861ba', 'Traslado', 'ordinary', 'Traslado de Santa Ana a su capilla 2026', '2026-07-27', 2026, '21:00', '24e0b757-f3fd-4d9c-82c9-2a758444f2d6', '62b23280-a700-4965-b1e4-dcc5545a9d8c', 'e1eb33bd-4fa2-4b7c-8a23-26c2fbafc799', 'Desde Santa María Magdalena hasta la Capilla de Santa Ana.', 'Traslado de regreso de la Patrona a su capilla tras los cultos de julio, con la Banda de Música Santa Ana.', 'held', 'published', 'Hermandad de Santa Ana', 'traslado-santa-ana-capilla-dos-hermanas-2026')
on conflict (id) do update set
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  outing_type = excluded.outing_type,
  character = excluded.character,
  title = excluded.title,
  outing_date = excluded.outing_date,
  year = excluded.year,
  departure_time = excluded.departure_time,
  municipality_id = excluded.municipality_id,
  origin_place_id = excluded.origin_place_id,
  destination_place_id = excluded.destination_place_id,
  route_summary = excluded.route_summary,
  description = excluded.description,
  event_status = excluded.event_status,
  status = excluded.status,
  organizer_name = excluded.organizer_name,
  slug = excluded.slug;

insert into public.outing_entities (id, outing_id, entity_id, role, notes)
values
  ('a6263eec-e709-4b3f-b269-935353b19dc2', '0c5b397e-38ad-47e2-899d-7861b9c4c604', 'bc6b349b-b483-49cc-bb0f-df882f220611', 'titular_procesional', 'Titular participante en la procesión.'),
  ('77509c6a-1512-4c9c-9903-de99c4cfaeac', '0c5b397e-38ad-47e2-899d-7861b9c4c604', '2219446a-f48b-4364-aedf-528fca06edba', 'paso_procesional', 'Paso utilizado en la salida.'),
  ('0eeefe11-7379-4806-b283-d0462e017dcc', 'db4e2434-34c5-4d87-8784-491d7b48497d', 'bc6b349b-b483-49cc-bb0f-df882f220611', 'titular_trasladada', 'Titular trasladada de vuelta a su capilla.')
on conflict (id) do update set
  outing_id = excluded.outing_id,
  entity_id = excluded.entity_id,
  role = excluded.role,
  notes = excluded.notes;

insert into public.outing_music_positions (id, outing_id, step_entity_id, position_code, position_label, sequence_no, notes, status)
values
  ('45568232-eb3c-4196-915a-ab6968cc27e4', '0c5b397e-38ad-47e2-899d-7861b9c4c604', null, 'cross_guide', 'Abriendo el cortejo', 1, 'Posición documentada para la edición de 2026.', 'published'),
  ('bcb7b598-6416-44e2-8c38-174541f46537', '0c5b397e-38ad-47e2-899d-7861b9c4c604', '2219446a-f48b-4364-aedf-528fca06edba', 'after_step', 'Tras el paso de Santa Ana', 2, 'Posición documentada para la edición de 2026.', 'published'),
  ('05136fee-158f-4815-a81a-c84318d02ea1', 'db4e2434-34c5-4d87-8784-491d7b48497d', null, 'after_procession', 'Acompañamiento del traslado', 1, 'Posición documentada para el traslado de 2026.', 'published')
on conflict (id) do update set
  outing_id = excluded.outing_id,
  step_entity_id = excluded.step_entity_id,
  position_code = excluded.position_code,
  position_label = excluded.position_label,
  sequence_no = excluded.sequence_no,
  notes = excluded.notes,
  status = excluded.status;

insert into public.outing_music_assignments (id, music_position_id, band_entity_id, participation_mode, sequence_no, notes, status)
values
  ('0193edcf-bcd3-443b-8407-1a0b8c6a4332', '45568232-eb3c-4196-915a-ab6968cc27e4', '31f46874-049b-4c33-aa68-b65ded5dfda9', 'full_route', 1, 'Presentación al Pueblo abrió el cortejo y tocó además antes de la entrada.', 'published'),
  ('2c5fde6d-b4f4-4174-a1ae-8f67ab1a2212', 'bcb7b598-6416-44e2-8c38-174541f46537', '49b5a3e0-c7d6-4dac-980e-3eddc355a7d1', 'full_route', 1, 'Banda de Música Santa Ana tras el paso de la Patrona.', 'published'),
  ('84a5aad3-769b-4fb3-a8a0-dd48535af1bb', '05136fee-158f-4815-a81a-c84318d02ea1', '49b5a3e0-c7d6-4dac-980e-3eddc355a7d1', 'full_route', 1, 'Acompañamiento documentado en el traslado del 27 de julio de 2026.', 'published')
on conflict (id) do update set
  music_position_id = excluded.music_position_id,
  band_entity_id = excluded.band_entity_id,
  participation_mode = excluded.participation_mode,
  sequence_no = excluded.sequence_no,
  notes = excluded.notes,
  status = excluded.status;

update public.music_accompaniment_periods
set
  step_entity_id = '2219446a-f48b-4364-aedf-528fca06edba',
  position = 'Abriendo el cortejo',
  outing_type = 'Procesión de Gloria',
  date_from_text = 'Presencia documentada al menos desde 2012 · vigente en 2026',
  is_current = true,
  notes = 'La participación está acreditada audiovisualmente en 2012 y continúa vigente en 2026. Ese año abrió el cortejo y conmemoró diez años como hermana honoraria. El inicio musical exacto no está documentado.',
  status = 'published',
  public_brotherhood_name = 'Hermandad de Santa Ana',
  public_step_name = 'Paso de tumbilla de Santa Ana',
  public_brotherhood_slug = 'hermandad-santa-ana-dos-hermanas',
  public_municipality_name = 'Dos Hermanas',
  public_municipality_slug = 'dos-hermanas',
  public_province = 'Sevilla'
where id = '21883777-df91-483d-8284-a190d621b8ad';

insert into public.music_accompaniment_periods (
  id, brotherhood_entity_id, band_entity_id, step_entity_id, position, outing_type, date_from_text,
  is_current, notes, status, public_brotherhood_name, public_step_name, public_brotherhood_slug,
  public_municipality_name, public_municipality_slug, public_province
)
values (
  'e67e2f81-49ba-4293-849a-dc65834cc732', '4bfb37c4-06ff-4ac5-b04d-539e280861ba',
  '49b5a3e0-c7d6-4dac-980e-3eddc355a7d1', '2219446a-f48b-4364-aedf-528fca06edba',
  'Tras el paso de Santa Ana y en el traslado de regreso', 'Procesión de Gloria',
  'Vigente en 2026; inicio no documentado', true,
  'La Banda de Música Santa Ana acompañó el paso el 26 de julio y el traslado a la capilla el día 27. No se fija un año inicial sin fuente.',
  'published', 'Hermandad de Santa Ana', 'Paso de tumbilla de Santa Ana',
  'hermandad-santa-ana-dos-hermanas', 'Dos Hermanas', 'dos-hermanas', 'Sevilla'
)
on conflict (id) do update set
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  band_entity_id = excluded.band_entity_id,
  step_entity_id = excluded.step_entity_id,
  position = excluded.position,
  outing_type = excluded.outing_type,
  date_from_text = excluded.date_from_text,
  is_current = excluded.is_current,
  notes = excluded.notes,
  status = excluded.status,
  public_brotherhood_name = excluded.public_brotherhood_name,
  public_step_name = excluded.public_step_name,
  public_brotherhood_slug = excluded.public_brotherhood_slug,
  public_municipality_name = excluded.public_municipality_name,
  public_municipality_slug = excluded.public_municipality_slug,
  public_province = excluded.public_province;

insert into public.entities (id, entity_type, name, slug, summary, status)
values
  ('ed9544cc-2105-4902-a628-e6e54618b059', 'heritage_asset', 'Tumbilla y respiraderos del paso de Santa Ana', 'tumbilla-respiraderos-santa-ana-dos-hermanas', 'Conjunto procesional de José Jiménez que singulariza el paso de la Patrona.', 'published'),
  ('388a457a-47fc-47e0-bdef-dd585cd62313', 'heritage_asset', 'Conjunto de plata de Santa Ana', 'conjunto-plata-santa-ana-dos-hermanas', 'Sillón, ráfaga y relicario de plata asociados a la presentación procesional de Santa Ana.', 'published')
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.heritage_assets (entity_id, parent_entity_id, asset_type, description, current_condition, date_from_text, is_current, materials, iconography, historical_context, display_order, is_featured)
values
  ('ed9544cc-2105-4902-a628-e6e54618b059', '2219446a-f48b-4364-aedf-528fca06edba', 'Conjunto procesional', 'Tumbilla sostenida por cuatro varales y respiraderos, obras de José Jiménez. Los escudos representan a la Hermandad, a la Orden de Predicadores y alegorías marianas.', 'preserved', 'Fecha por documentar', true, 'Textiles y orfebrería', 'Escudos corporativo y dominico y alegorías marianas.', 'La tumbilla confiere al paso una tipología ceremonial poco habitual y comparable a la disposición de la Virgen de los Reyes.', 1, true),
  ('388a457a-47fc-47e0-bdef-dd585cd62313', 'bc6b349b-b483-49cc-bb0f-df882f220611', 'Ajuar de orfebrería', 'Sillón de caoba con incrustaciones de plata, ráfaga de dieciocho placas repujadas y relicario de plata con cruz, rosario y campana vinculada a la tradición del hallazgo.', 'preserved', 'Cronología por documentar', true, 'Caoba, plata y metal dorado', 'Motivos florales y elementos de la tradición fundacional.', 'Conjunto asociado a la presentación de la Patrona, sin asignar cronologías no publicadas.', 2, true)
on conflict (entity_id) do update set
  parent_entity_id = excluded.parent_entity_id,
  asset_type = excluded.asset_type,
  description = excluded.description,
  current_condition = excluded.current_condition,
  date_from_text = excluded.date_from_text,
  is_current = excluded.is_current,
  materials = excluded.materials,
  iconography = excluded.iconography,
  historical_context = excluded.historical_context,
  display_order = excluded.display_order,
  is_featured = excluded.is_featured;

insert into public.entities (id, entity_type, name, slug, summary, status)
values
  ('26a2a32a-4fcd-490e-8c78-ed5143426e0a', 'event', 'Aprobación de las reglas de Santa Ana', 'aprobacion-reglas-santa-ana-dos-hermanas-1523', 'Las reglas de la Hermandad fueron aprobadas en 1523.', 'published'),
  ('be8c5181-bf66-468e-9b7a-4d5e10ac0966', 'event', 'Donación de una reliquia de San Joaquín', 'donacion-reliquia-san-joaquin-santa-ana-2017', 'La Hermandad recibió en 2017 una reliquia de San Joaquín que se coloca a los pies de Santa Ana.', 'published'),
  ('e22b4bfc-483e-453c-8e46-b9c7861d6e90', 'event', 'V Centenario fundacional de la Hermandad de Santa Ana', 'v-centenario-santa-ana-dos-hermanas-2023', 'La Hermandad celebró en 2023 los quinientos años de sus reglas de 1523.', 'published')
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.events (entity_id, event_type, event_date, event_date_text, place_id, description, event_category, brotherhood_entity_id, municipality_id, event_status, location_text)
values
  ('26a2a32a-4fcd-490e-8c78-ed5143426e0a', 'Aprobación de reglas', null, '1523', 'e1eb33bd-4fa2-4b7c-8a23-26c2fbafc799', 'Aprobación de las reglas conservadas de la Hermandad, referencia documental de su antigüedad.', 'historical', '4bfb37c4-06ff-4ac5-b04d-539e280861ba', '24e0b757-f3fd-4d9c-82c9-2a758444f2d6', 'held', 'Dos Hermanas'),
  ('be8c5181-bf66-468e-9b7a-4d5e10ac0966', 'Patrimonio', null, '2017', 'e1eb33bd-4fa2-4b7c-8a23-26c2fbafc799', 'Donación de una reliquia de San Joaquín, colocada a los pies del grupo escultórico.', 'historical', '4bfb37c4-06ff-4ac5-b04d-539e280861ba', '24e0b757-f3fd-4d9c-82c9-2a758444f2d6', 'held', 'Capilla de Santa Ana'),
  ('e22b4bfc-483e-453c-8e46-b9c7861d6e90', 'Centenario fundacional', null, '2023', 'e1eb33bd-4fa2-4b7c-8a23-26c2fbafc799', 'Celebración del V Centenario de las reglas aprobadas en 1523.', 'historical', '4bfb37c4-06ff-4ac5-b04d-539e280861ba', '24e0b757-f3fd-4d9c-82c9-2a758444f2d6', 'held', 'Dos Hermanas')
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

insert into public.source_links (id, source_id, entity_id, scope, notes)
values
  ('c40e866c-383b-4b62-8f94-39c390091894', '4b202272-1b32-46d7-8b35-6cfbca177cb2', '4bfb37c4-06ff-4ac5-b04d-539e280861ba', 'Cultos y calendario 2026', 'Fuente local del programa anual.'),
  ('917ffa92-489a-47f4-aeb5-7a6bbc3441a4', 'b985fad5-cefb-4e42-8855-cf8e63cf1506', 'bc6b349b-b483-49cc-bb0f-df882f220611', 'Imagen, iconografía y fotografía abierta', 'Página canónica del archivo CC0.'),
  ('99b59687-701c-43e6-a883-2a6590b5624e', '5dc0c0d5-dad4-4b61-91b8-07c1fbd6e882', '2219446a-f48b-4364-aedf-528fca06edba', 'Paso de tumbilla', 'Descripción histórica del paso.'),
  ('98e27566-1221-40f6-9ea6-80c098224ce0', 'b985fad5-cefb-4e42-8855-cf8e63cf1506', 'ed9544cc-2105-4902-a628-e6e54618b059', 'Tumbilla y respiraderos', 'Descripción de los elementos procesionales.'),
  ('f76945ec-3e0f-4296-9ccf-9a66139c0a62', 'b985fad5-cefb-4e42-8855-cf8e63cf1506', '388a457a-47fc-47e0-bdef-dd585cd62313', 'Conjunto de plata', 'Descripción del sillón, ráfaga y relicario.'),
  ('66d20e39-a6a0-4614-8db0-61706dd256fe', 'b985fad5-cefb-4e42-8855-cf8e63cf1506', '26a2a32a-4fcd-490e-8c78-ed5143426e0a', 'Reglas de 1523', 'Hito histórico.'),
  ('e7c2223c-9cb9-470f-a43b-e46f39df0f0d', 'b985fad5-cefb-4e42-8855-cf8e63cf1506', 'be8c5181-bf66-468e-9b7a-4d5e10ac0966', 'Reliquia de San Joaquín', 'Hito patrimonial.'),
  ('f39ee2fe-a9c6-4246-a2af-807b340f43ef', 'b985fad5-cefb-4e42-8855-cf8e63cf1506', 'e22b4bfc-483e-453c-8e46-b9c7861d6e90', 'V Centenario', 'Efeméride de 2023.')
on conflict (id) do update set
  source_id = excluded.source_id,
  entity_id = excluded.entity_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, cult_id, scope, notes)
values
  ('19f0e9d8-7bbd-44be-8324-6d7ccde3e101', '4b202272-1b32-46d7-8b35-6cfbca177cb2', 'b9c5ead0-ec12-44d1-a989-254b2561c827', 'Besamanos 2026', 'Fechas y horarios.'),
  ('481759bd-befe-4eae-a49c-40b7a30fdf70', '4b202272-1b32-46d7-8b35-6cfbca177cb2', 'b7cda0fc-8c60-4c65-8603-f5b87bbd4fe1', 'Triduo 2026', 'Fechas y horario.'),
  ('23029242-d5a8-4326-b06f-ee60d28dbf25', '4b202272-1b32-46d7-8b35-6cfbca177cb2', 'a2fbe0ec-5062-4586-b5b8-9551d3f8d6e9', 'Función solemne 2026', 'Fecha, hora y acompañamiento coral.')
on conflict (id) do update set
  source_id = excluded.source_id,
  cult_id = excluded.cult_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, outing_id, scope, notes)
values
  ('c60840dc-a4f0-4bee-9321-f4b97153a3cd', '048c317a-c462-4f10-9e20-da2e50e34f9b', '0c5b397e-38ad-47e2-899d-7861b9c4c604', 'Procesión de 2026', 'Recorrido, cortejo y música.'),
  ('461223d5-b40a-4e18-b8b5-45febd309233', '4b202272-1b32-46d7-8b35-6cfbca177cb2', 'db4e2434-34c5-4d87-8784-491d7b48497d', 'Traslado de 2026', 'Fecha, hora, destino y música.')
on conflict (id) do update set
  source_id = excluded.source_id,
  outing_id = excluded.outing_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, outing_id, scope, notes)
select
  '206c5e36-16f0-43b6-b0e2-211ff1193501',
  id,
  '0c5b397e-38ad-47e2-899d-7861b9c4c604',
  'Confirmación posterior de la procesión de 2026',
  'Crónica publicada después de la salida; respalda el estado held.'
from public.sources
where url = 'https://periodicolasemana.es/2026/149494/tramo-cofrade/dos-hermanas-con-su-patrona-en-la-procesion-del-26-de-julio/'
on conflict (id) do update set
  source_id = excluded.source_id,
  outing_id = excluded.outing_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, music_accompaniment_period_id, scope, notes)
values
  ('fe425ff7-c412-44c8-8e90-25a437e38e25', '048c317a-c462-4f10-9e20-da2e50e34f9b', '21883777-df91-483d-8284-a190d621b8ad', 'Presentación al Pueblo', 'Vigencia y posición en 2026.'),
  ('bb587ebc-137d-4759-afa2-355f3797f0dd', '4b202272-1b32-46d7-8b35-6cfbca177cb2', 'e67e2f81-49ba-4293-849a-dc65834cc732', 'Banda de Música Santa Ana', 'Vigencia en procesión y traslado de 2026.')
on conflict (id) do update set
  source_id = excluded.source_id,
  music_accompaniment_period_id = excluded.music_accompaniment_period_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.bulk_imports (
  id, label, source_name, source_format, status, expected_items, staged_items,
  valid_items, invalid_items, applied_items, failed_items, metadata, completed_at
)
values (
  'c0160023-0000-4000-8000-000000000001',
  'HC-016 · Santa Ana de Dos Hermanas',
  'Fuentes abiertas y especializadas · 2026-09-15',
  'jsonl',
  'completed',
  49,
  49,
  49,
  0,
  49,
  0,
  jsonb_build_object(
    'scope', 'Santa Ana de Dos Hermanas',
    'schema', 'unchanged',
    'rights', '1 fotografía CC0 1.0 con procedencia completa',
    'preserved', 'Cierres HC-016 anteriores y datos ajenos a la ficha'
  ),
  now()
)
on conflict (id) do update set
  label = excluded.label,
  source_name = excluded.source_name,
  source_format = excluded.source_format,
  status = excluded.status,
  expected_items = excluded.expected_items,
  staged_items = excluded.staged_items,
  valid_items = excluded.valid_items,
  invalid_items = excluded.invalid_items,
  applied_items = excluded.applied_items,
  failed_items = excluded.failed_items,
  metadata = excluded.metadata,
  completed_at = excluded.completed_at;

with operations(table_name, scope) as (
  values
    ('sources','4 fuentes'), ('entities','actualización de Hermandad'), ('brotherhoods','perfil corporativo'),
    ('entity_social_links','Instagram oficial'), ('entities','titular'), ('images','ficha del titular'),
    ('image_authorships','autoría anónima prudente'), ('brotherhood_images','titularidad'), ('entities','paso'),
    ('steps','ficha del paso'), ('brotherhood_steps','paso actual'), ('image_steps','imagen en paso'),
    ('media_assets','fotografía CC0'), ('entity_media','cabecera de Hermandad e Imagen'), ('cults','3 cultos'),
    ('cult_entities','3 relaciones'), ('cult_occurrences','3 ediciones de 2026'), ('outings','procesión 2026'),
    ('outings','traslado 2026'), ('outing_entities','3 participantes'), ('outing_music_positions','3 posiciones'),
    ('outing_music_assignments','3 asignaciones'), ('music_accompaniment_periods','Presentación al Pueblo'),
    ('music_accompaniment_periods','Banda de Música Santa Ana'), ('entities','2 piezas patrimoniales'),
    ('heritage_assets','2 fichas patrimoniales'), ('entities','3 acontecimientos'), ('events','3 fichas históricas'),
    ('source_links','fuente general de cultos'), ('source_links','fuente de imagen'), ('source_links','fuente del paso'),
    ('source_links','fuente de tumbilla'), ('source_links','fuente del conjunto de plata'),
    ('source_links','fuente de reglas'), ('source_links','fuente de reliquia'), ('source_links','fuente de centenario'),
    ('source_links','fuente de besamanos'), ('source_links','fuente de triduo'), ('source_links','fuente de función'),
    ('source_links','fuente de procesión'), ('source_links','fuente de traslado'),
    ('source_links','confirmación posterior de la procesión'),
    ('source_links','fuente musical de Presentación'), ('source_links','fuente musical de Santa Ana'),
    ('entities','control de publicación'), ('outings','control de estados pasados'),
    ('media_assets','control de licencia abierta'), ('source_links','control de trazabilidad'),
    ('bulk_imports','cierre del lote')
), numbered as (
  select table_name, scope, row_number() over () - 1 as position
  from operations
)
insert into public.bulk_import_items (id, import_id, position, table_name, operation, priority, record, status, validation_errors, result, applied_at)
select
  gen_random_uuid(),
  'c0160023-0000-4000-8000-000000000001',
  position,
  table_name,
  'upsert',
  100,
  jsonb_build_object('scope', scope, 'recipe', '20260915113000_cierra_santa_ana_dos_hermanas.sql'),
  'applied',
  '[]'::jsonb,
  jsonb_build_object('status', 'applied'),
  now()
from numbered
on conflict (import_id, position) do update set
  table_name = excluded.table_name,
  operation = excluded.operation,
  priority = excluded.priority,
  record = excluded.record,
  status = excluded.status,
  validation_errors = excluded.validation_errors,
  error_text = null,
  result = excluded.result,
  applied_at = excluded.applied_at;

do $$
begin
  if (select count(*) from public.bulk_import_items where import_id = 'c0160023-0000-4000-8000-000000000001') <> 49 then
    raise exception 'El lote de Santa Ana no conserva sus 49 operaciones';
  end if;

  if not exists (
    select 1
    from public.media_assets
    where id = '804575bf-37e6-4570-9aab-f705674e833d'
      and rights_status = 'public_domain'
      and lower(license) = 'cc0 1.0'
      and author_name = 'Daniel Jiménez'
      and source_url = 'https://commons.wikimedia.org/wiki/File:Santa_Ana,_Patrona_de_Dos_Hermanas.jpg'
  ) then
    raise exception 'La procedencia CC0 de la fotografía de Santa Ana no quedó íntegra';
  end if;

  if (select count(*) from public.outings where brotherhood_entity_id = '4bfb37c4-06ff-4ac5-b04d-539e280861ba' and status = 'published') <> 2 then
    raise exception 'La procesión y el traslado de Santa Ana no quedaron separados';
  end if;

  if exists (
    select 1 from public.outings
    where brotherhood_entity_id = '4bfb37c4-06ff-4ac5-b04d-539e280861ba'
      and outing_date < current_date
      and event_status = 'announced'
  ) then
    raise exception 'Santa Ana conserva una salida pasada como announced';
  end if;
end
$$;

commit;
