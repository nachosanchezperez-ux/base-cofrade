-- HC-016 · decimosexto contexto real: Vera-Cruz de Alcalá del Río
-- FIRST EDITION FREEZE: receta editorial DML, sin DDL ni cambios de RLS.

begin;

insert into public.sources (id, name, url, source_type, author_or_publisher, publication_date, accessed_at, notes)
values
  ('f5cf1261-0034-4c53-b160-08c7a3ffda81', 'San Gregorio de Osset regresa a su ermita en Alcalá del Río', 'https://www.elpespunte.es/articulo/cofrade/san-gregorio-osset-regresa-tarde-ermita-alcala-rio/20260909143843150240.html', 'Medio especializado', 'El Pespunte', '2026-09-09', '2026-09-15', 'Novena, función y procesión de regreso de San Gregorio; organización, portadores, música y vínculo histórico con la Vera-Cruz.'),
  ('3ed47715-9192-4534-be0a-c8fb8e8be49e', 'Hermandad de la Vera-Cruz de Alcalá del Río · Facebook oficial', 'https://www.facebook.com/p/Hermandad-de-la-Vera-Cruz-Alcal%C3%A1-del-R%C3%ADo-100064737994661/', 'Canal oficial', 'Hermandad de la Vera-Cruz de Alcalá del Río', null, '2026-09-15', 'Página oficial de la corporación en Facebook.')
on conflict (id) do update set
  name = excluded.name,
  url = excluded.url,
  source_type = excluded.source_type,
  author_or_publisher = excluded.author_or_publisher,
  publication_date = excluded.publication_date,
  accessed_at = excluded.accessed_at,
  notes = excluded.notes;

insert into public.places (id, municipality_id, name, slug, place_type, notes)
values ('2f00ad36-69ae-434d-8131-e23a44cdea11', '1d4fb3b2-6b33-4575-9516-35ec617c1d22', 'Parroquia de Santa María de la Asunción', 'parroquia-santa-maria-asuncion-alcala-del-rio', 'Parroquia', 'Templo parroquial que recibe los pasos durante la estación de penitencia y acoge los cultos patronales de San Gregorio.')
on conflict (id) do update set
  municipality_id = excluded.municipality_id,
  name = excluded.name,
  slug = excluded.slug,
  place_type = excluded.place_type,
  notes = excluded.notes;

update public.entities
set
  name = 'Hermandad de la Vera-Cruz de Alcalá del Río',
  summary = 'Hermandad crucera fundada en 1483 y establecida desde entonces en la Real Ermita de San Gregorio de Osset. Realiza su estación de penitencia el Jueves Santo con el Cristo de la Vera-Cruz y María Santísima de las Angustias Coronada.',
  status = 'published'
where id = '00dc20d4-b0f2-4ceb-a16f-b8d0d37d2fb6';

update public.brotherhoods
set
  official_name = 'Antigua, Real, Ilustre y Fervorosa Hermandad y Cofradía de Nazarenos del Santísimo Cristo de la Vera-Cruz y María Santísima de las Angustias Coronada',
  popular_name = 'Vera-Cruz',
  foundation_text = '1483',
  municipality_id = '1d4fb3b2-6b33-4575-9516-35ec617c1d22',
  canonical_see_place_id = 'a76c8821-55da-4721-99da-0ac74454b0c3',
  brotherhood_types = array['Penitencia']::text[],
  current_procession_day = 'Jueves Santo',
  history_text = 'La corporación se documenta desde el 2 de mayo de 1483 en la entonces Casa de San Gregorio. La ermita fue ampliada e inaugurada el 30 de noviembre de 1500; la Cofradía tenía estatutos al menos desde 1542 y las escrituras de 1563 y 1579 consolidaron su ocupación de las capillas laterales. Su relación con San Gregorio de Osset se mantuvo durante los siglos XVII y XVIII. La Virgen de las Angustias fue coronada en 1971 y la coronación obtuvo reconocimiento canónico en 1996.',
  notes = 'Las atribuciones de los titulares se mantienen como tales: el Cristo a Roque de Balduque y la Virgen a José Montes de Oca. El testimonio devocional de 1645 no se usa para identificar sin reservas la imagen mariana actual.',
  website_url = 'https://www.vera-cruz.org/'
where entity_id = '00dc20d4-b0f2-4ceb-a16f-b8d0d37d2fb6';

insert into public.entity_social_links (id, entity_id, platform, url, label, display_order, is_public)
values
  ('5f5d805e-69df-46c6-ae4d-7214716a7b76', '00dc20d4-b0f2-4ceb-a16f-b8d0d37d2fb6', 'website', 'https://www.vera-cruz.org/', 'Web oficial', 1, true),
  ('ee7cb06c-a19a-49e9-9500-6e26802ad8cf', '00dc20d4-b0f2-4ceb-a16f-b8d0d37d2fb6', 'facebook', 'https://www.facebook.com/p/Hermandad-de-la-Vera-Cruz-Alcal%C3%A1-del-R%C3%ADo-100064737994661/', 'Facebook oficial', 2, true)
on conflict (entity_id, platform) do update set
  url = excluded.url,
  label = excluded.label,
  display_order = excluded.display_order,
  is_public = excluded.is_public;

insert into public.entities (id, entity_type, name, slug, summary, status)
values
  ('47209727-3e34-4d0f-91a9-9005388b2420', 'agent', 'Francisco Verdugo', 'francisco-verdugo-tallista', 'Autor del paso procesional del Santísimo Cristo de la Vera-Cruz estrenado en 2012.', 'published'),
  ('f9c05379-f1b5-4f39-a06d-fcd77cb80d1c', 'agent', 'Luisa Rodríguez', 'luisa-rodriguez-bordadora', 'Autora a la que se atribuye el manto de María Santísima de las Angustias Coronada.', 'published')
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.agents (entity_id, agent_kind, description)
values
  ('47209727-3e34-4d0f-91a9-9005388b2420', 'person', 'Artista documentado como autor del paso de Cristo de 2012.'),
  ('f9c05379-f1b5-4f39-a06d-fcd77cb80d1c', 'person', 'Bordadora a la que la Hermandad atribuye el manto de salida de la Virgen.')
on conflict (entity_id) do update set
  agent_kind = excluded.agent_kind,
  description = excluded.description;

insert into public.entities (id, entity_type, name, slug, summary, status)
values
  ('2b8a0c4c-8476-45d7-9eb8-dae80a6eb177', 'image', 'Santísimo Cristo de la Vera-Cruz', 'santisimo-cristo-vera-cruz-alcala-del-rio', 'Crucificado de tamaño menor que el natural, atribuido con sólidos fundamentos a Roque de Balduque entre 1557 y 1561.', 'published'),
  ('7bbea24c-9f5a-45c3-8646-fb498041f974', 'image', 'María Santísima de las Angustias Coronada', 'maria-santisima-angustias-coronada-alcala-del-rio', 'Dolorosa atribuida a José Montes de Oca en la década de 1720 y coronada en 1971, con reconocimiento canónico en 1996.', 'published'),
  ('1bb46c64-e303-4c4f-bc35-202937208813', 'image', 'San Gregorio de Osset', 'san-gregorio-osset-alcala-del-rio', 'Imagen del patrón de Alcalá del Río, vinculada históricamente a la Vera-Cruz y a la ermita que comparte su nombre.', 'published')
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.images (entity_id, image_type, execution_date_text, material, current_condition, description, notes, current_state_notes)
values
  ('2b8a0c4c-8476-45d7-9eb8-dae80a6eb177', 'Crucificado', 'Entre 1557 y 1561', 'Madera policromada', 'extant', 'Crucificado de tamaño menor que el natural, atribuido con sólidos fundamentos a Roque de Balduque.', 'La fuente oficial admite que algún autor propone una cronología anterior.', 'La autoría se publica como atribución, no como certeza documental.'),
  ('7bbea24c-9f5a-45c3-8646-fb498041f974', 'Dolorosa', 'Década de 1720', 'Madera policromada', 'extant', 'Dolorosa atribuida a José Montes de Oca y coronada en 1971.', 'La devoción a las Angustias se documenta ya en 1645, antes del nacimiento del escultor; ese testimonio no demuestra que se trate de la talla actual.', 'La atribución a Montes de Oca se conserva con cautela.'),
  ('1bb46c64-e303-4c4f-bc35-202937208813', 'Santo patrono', 'Cronología por documentar', 'Material por documentar', 'extant', 'Imagen de San Gregorio de Osset que preside sus cultos patronales y regresa cada septiembre a la ermita.', 'No se asignan autoría ni cronología sin una fuente patrimonial específica.', null)
on conflict (entity_id) do update set
  image_type = excluded.image_type,
  execution_date_text = excluded.execution_date_text,
  material = excluded.material,
  current_condition = excluded.current_condition,
  description = excluded.description,
  notes = excluded.notes,
  current_state_notes = excluded.current_state_notes;

insert into public.image_authorships (id, image_entity_id, agent_entity_id, authorship_type, role_name, date_from_text, certainty, notes, status)
values
  ('759bc63d-328d-41b4-8d8b-aacf05778cff', '2b8a0c4c-8476-45d7-9eb8-dae80a6eb177', '62dbe08b-b99f-4db2-a9a0-ebbc6930e827', 'attributed_to', 'escultor', 'Entre 1557 y 1561', 'attributed', 'Atribución sostenida con sólidos fundamentos por la historia oficial de la Hermandad.', 'published'),
  ('3366cad2-a985-4e77-a14b-76e5016747f3', '7bbea24c-9f5a-45c3-8646-fb498041f974', '0875a668-af38-4d7d-9ecd-d7aff487608f', 'attributed_to', 'escultor', 'Década de 1720', 'attributed', 'Atribución actual de la Hermandad; se conserva la cautela derivada del testimonio devocional de 1645.', 'published')
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
values
  ('8dff3c86-3dc0-4eaf-916d-d02374545626', '00dc20d4-b0f2-4ceb-a16f-b8d0d37d2fb6', '2b8a0c4c-8476-45d7-9eb8-dae80a6eb177', 'titular', 'Entre 1557 y 1561', 'Titular cristífero de la corporación.', 'published'),
  ('bebbeaf2-6b53-486f-b0de-70c203586a74', '00dc20d4-b0f2-4ceb-a16f-b8d0d37d2fb6', '7bbea24c-9f5a-45c3-8646-fb498041f974', 'titular', 'Devoción documentada desde 1645; talla actual atribuida al siglo XVIII', 'Titular mariana coronada.', 'published'),
  ('55ed0dde-a8ee-4e27-ba29-03bc8bc38192', '00dc20d4-b0f2-4ceb-a16f-b8d0d37d2fb6', '1bb46c64-e303-4c4f-bc35-202937208813', 'cult_image', 'Vínculo documentado desde el siglo XV', 'Patrón de Alcalá del Río cuyo culto y ermita están históricamente ligados a la Vera-Cruz.', 'published')
on conflict (id) do update set
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  image_entity_id = excluded.image_entity_id,
  relation_type = excluded.relation_type,
  date_from_text = excluded.date_from_text,
  notes = excluded.notes,
  status = excluded.status;

update public.entities
set
  summary = 'Paso del Santísimo Cristo de la Vera-Cruz realizado por Francisco Verdugo y estrenado el Jueves Santo de 2012.',
  status = 'published'
where id = 'f04cf7fc-c51f-451c-89d4-f14106620548';

update public.steps
set
  step_type = 'Paso de Cristo',
  current_condition = 'preserved',
  materials = 'Madera tallada y orfebrería de plata',
  execution_date_text = '2012',
  carrier_system = 'Hermanos nazarenos sobre los hombros',
  description = 'Paso de Francisco Verdugo estrenado en 2012. El Cristo aparece sobre monte de claveles rojos, con Santa María Magdalena a los pies, velo de tinieblas y un pelícano de plata situado al pie de la cruz.',
  current_state_notes = 'Tras el paso discurre la Decuria Romana.'
where entity_id = 'f04cf7fc-c51f-451c-89d4-f14106620548';

update public.entities
set
  summary = 'Paso de palio asociado al legado de Antonio Reverte, terminado en 1903 y estrenado en 1904, con bordados históricos y orfebrería de Villarreal.',
  status = 'published'
where id = 'f535b4f2-e038-4725-a93f-d2b18f35d63f';

update public.steps
set
  step_type = 'Paso de palio',
  current_condition = 'preserved',
  materials = 'Textiles bordados, madera y orfebrería',
  execution_date_text = 'Terminado en 1903; estrenado en 1904',
  carrier_system = 'Hermanos nazarenos sobre los hombros',
  description = 'Paso de palio regalado a la Virgen por Antonio Reverte. Conserva manto atribuido a Luisa Rodríguez, palio y faldón de las Hermanas Antúnez, techo y saya de Juan Manuel Rodríguez Ojeda, y corona y orfebrería de Villarreal.',
  current_state_notes = 'La atribución del manto y las distintas autorías se mantienen separadas por elemento.'
where entity_id = 'f535b4f2-e038-4725-a93f-d2b18f35d63f';

update public.brotherhood_steps
set relation_type = 'actual', date_from_text = '2012', notes = 'Paso actual del Santísimo Cristo.', status = 'published'
where id = '83e9de66-9d82-412f-9438-d8317ecc4bf9';

update public.brotherhood_steps
set relation_type = 'actual', date_from_text = '1903; estrenado en 1904', notes = 'Paso de palio actual de María Santísima de las Angustias Coronada.', status = 'published'
where id = '86fbc5ed-9786-4446-a759-5913ea1ea4fd';

insert into public.image_steps (id, image_entity_id, step_entity_id, relation_type, date_from_text, notes, status)
values
  ('fc4e6b3a-755e-428f-9163-942dcf308707', '2b8a0c4c-8476-45d7-9eb8-dae80a6eb177', 'f04cf7fc-c51f-451c-89d4-f14106620548', 'processional_image', '2012', 'El titular procesiona en el paso actual.', 'published'),
  ('08e5414b-26a2-439c-b09f-4db6c7791a68', '7bbea24c-9f5a-45c3-8646-fb498041f974', 'f535b4f2-e038-4725-a93f-d2b18f35d63f', 'processional_image', '1904', 'La titular procesiona en su paso de palio.', 'published')
on conflict (id) do update set
  image_entity_id = excluded.image_entity_id,
  step_entity_id = excluded.step_entity_id,
  relation_type = excluded.relation_type,
  date_from_text = excluded.date_from_text,
  notes = excluded.notes,
  status = excluded.status;

insert into public.step_phases (id, step_entity_id, phase_name, phase_type, date_from, date_from_text, description, notes, status)
values ('a5c4bca9-8f9e-4fdd-ae47-d48d7c0a695e', 'f04cf7fc-c51f-451c-89d4-f14106620548', 'Paso actual de Francisco Verdugo', 'current_configuration', '2012-04-05', 'Jueves Santo de 2012', 'Estreno del paso procesional actual del Santísimo Cristo.', 'La fecha corresponde al Jueves Santo de 2012.', 'published')
on conflict (id) do update set
  step_entity_id = excluded.step_entity_id,
  phase_name = excluded.phase_name,
  phase_type = excluded.phase_type,
  date_from = excluded.date_from,
  date_from_text = excluded.date_from_text,
  description = excluded.description,
  notes = excluded.notes,
  status = excluded.status;

insert into public.entities (id, entity_type, name, slug, summary, status)
values
  ('ca5812c5-30fe-45e4-91e0-43ff8c513889', 'heritage_asset', 'Pelícano de plata del paso del Cristo', 'pelicano-plata-cristo-vera-cruz-alcala', 'Símbolo eucarístico situado al pie de la cruz al menos desde el siglo XVIII.', 'published'),
  ('3cb7468c-636d-4dc5-b0fd-e019065c057a', 'heritage_asset', 'Manto de María Santísima de las Angustias', 'manto-angustias-vera-cruz-alcala', 'Manto de salida atribuido a Luisa Rodríguez.', 'published'),
  ('10503762-5cad-4b9c-94ec-362b63f5ec27', 'heritage_asset', 'Palio y faldón de las Hermanas Antúnez', 'palio-faldon-hermanas-antunez-angustias-alcala', 'Bordados históricos del paso de palio, vinculados al conjunto terminado en 1903.', 'published'),
  ('045f054d-28b2-4e5c-8f3b-e247b99cc5b9', 'heritage_asset', 'Techo de palio y saya de Rodríguez Ojeda', 'techo-palio-saya-rodriguez-ojeda-angustias-alcala', 'Piezas textiles de Juan Manuel Rodríguez Ojeda.', 'published'),
  ('51f51561-f220-4445-a38c-e44c608f963a', 'heritage_asset', 'Corona de oro y orfebrería de Villarreal', 'corona-orfebreria-villarreal-angustias-alcala', 'Conjunto de corona y orfebrería del paso atribuido al taller Villarreal.', 'published')
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.heritage_assets (entity_id, parent_entity_id, asset_type, description, current_condition, date_from_text, is_current, materials, iconography, display_order, is_featured)
values
  ('ca5812c5-30fe-45e4-91e0-43ff8c513889', 'f04cf7fc-c51f-451c-89d4-f14106620548', 'Orfebrería procesional', 'Pelícano de plata dispuesto al pie de la cruz como símbolo de la entrega de Cristo.', 'preserved', 'Presente desde el siglo XVIII', true, 'Plata', 'Pelícano eucarístico.', 1, true),
  ('3cb7468c-636d-4dc5-b0fd-e019065c057a', 'f535b4f2-e038-4725-a93f-d2b18f35d63f', 'Manto procesional', 'Manto de salida atribuido por la Hermandad a Luisa Rodríguez.', 'preserved', 'Cronología por documentar', true, 'Textil bordado', null, 1, true),
  ('10503762-5cad-4b9c-94ec-362b63f5ec27', 'f535b4f2-e038-4725-a93f-d2b18f35d63f', 'Bordados de palio', 'Palio y faldón realizados por las Hermanas Antúnez dentro del conjunto histórico regalado por Antonio Reverte.', 'preserved', 'Terminado en 1903; estrenado en 1904', true, 'Textiles bordados', null, 2, true),
  ('045f054d-28b2-4e5c-8f3b-e247b99cc5b9', 'f535b4f2-e038-4725-a93f-d2b18f35d63f', 'Bordados de palio', 'Techo de palio y saya realizados por Juan Manuel Rodríguez Ojeda.', 'preserved', 'Cronología por documentar', true, 'Textiles bordados', null, 3, false),
  ('51f51561-f220-4445-a38c-e44c608f963a', 'f535b4f2-e038-4725-a93f-d2b18f35d63f', 'Orfebrería procesional', 'Corona de oro y orfebrería del paso realizadas por Villarreal.', 'preserved', 'Cronología por documentar', true, 'Oro y metal labrado', null, 4, true)
on conflict (entity_id) do update set
  parent_entity_id = excluded.parent_entity_id,
  asset_type = excluded.asset_type,
  description = excluded.description,
  current_condition = excluded.current_condition,
  date_from_text = excluded.date_from_text,
  is_current = excluded.is_current,
  materials = excluded.materials,
  iconography = excluded.iconography,
  display_order = excluded.display_order,
  is_featured = excluded.is_featured;

insert into public.heritage_interventions (id, target_entity_id, agent_entity_id, discipline, element_name, intervention_type, phase, date_from, date_from_text, description, status)
values
  ('90349104-b9be-460b-a6ba-0f339dffaf2e', 'f04cf7fc-c51f-451c-89d4-f14106620548', '47209727-3e34-4d0f-91a9-9005388b2420', 'Talla', 'Paso del Santísimo Cristo', 'Realización', 'Obra actual', '2012-04-05', '2012', 'Realización del paso procesional actual.', 'published'),
  ('558959a7-a576-4707-8867-4e8b1d971691', '3cb7468c-636d-4dc5-b0fd-e019065c057a', 'f9c05379-f1b5-4f39-a06d-fcd77cb80d1c', 'Bordado', 'Manto', 'Autoría atribuida', 'Obra histórica', null, 'Cronología por documentar', 'Manto atribuido a Luisa Rodríguez.', 'published'),
  ('68209d8b-f019-4a24-9737-51b703978e06', '10503762-5cad-4b9c-94ec-362b63f5ec27', '3a000000-0000-0000-0000-000000000013', 'Bordado', 'Palio y faldón', 'Realización', 'Conjunto histórico', null, '1903–1904', 'Palio y faldón de las Hermanas Antúnez.', 'published'),
  ('434711c7-6124-4547-807d-054fea4f368b', '045f054d-28b2-4e5c-8f3b-e247b99cc5b9', '7578b2f6-dc2b-47d7-bb0f-8474328c8937', 'Bordado', 'Techo de palio y saya', 'Realización', 'Conjunto histórico', null, 'Cronología por documentar', 'Techo de palio y saya de Juan Manuel Rodríguez Ojeda.', 'published'),
  ('2085e9a6-7cd7-42c1-9a0d-ece8ebb76ea1', '51f51561-f220-4445-a38c-e44c608f963a', '2d3a4242-c44f-4ec3-a239-aa01bd7af3c4', 'Orfebrería', 'Corona y orfebrería del paso', 'Realización', 'Conjunto actual', null, 'Cronología por documentar', 'Corona de oro y orfebrería atribuidas al taller Villarreal.', 'published')
on conflict (id) do update set
  target_entity_id = excluded.target_entity_id,
  agent_entity_id = excluded.agent_entity_id,
  discipline = excluded.discipline,
  element_name = excluded.element_name,
  intervention_type = excluded.intervention_type,
  phase = excluded.phase,
  date_from = excluded.date_from,
  date_from_text = excluded.date_from_text,
  description = excluded.description,
  status = excluded.status;

insert into public.cults (id, brotherhood_entity_id, image_entity_id, cult_type, title, date_rule, month, time_text, place_id, description, status, is_recurring, recurrence_label, display_order, notes)
values
  ('1d3ab3c0-c7fd-427d-a856-e30e1362c5fd', '00dc20d4-b0f2-4ceb-a16f-b8d0d37d2fb6', '2b8a0c4c-8476-45d7-9eb8-dae80a6eb177', 'Oración', 'Ángelus, ejercicio de las Cinco Llagas y Santo Rosario', 'Jueves Santo', null, '12:00 en 2026', 'a76c8821-55da-4721-99da-0ac74454b0c3', 'Oración de mediodía en la Capilla de San Gregorio.', 'published', true, 'Jueves Santo', 1, 'La hora corresponde a la edición de 2026.'),
  ('6bfe4b69-8a15-44b6-b2ab-764d0d0662e4', '00dc20d4-b0f2-4ceb-a16f-b8d0d37d2fb6', null, 'Santos Oficios', 'Santos Oficios del Jueves Santo', 'Jueves Santo', null, '15:45 en 2026', '2f00ad36-69ae-434d-8131-e23a44cdea11', 'Celebración de los Santos Oficios en la parroquia.', 'published', true, 'Jueves Santo', 2, 'La hora corresponde a la edición de 2026.'),
  ('5a0e9f50-7242-4da8-b2f9-8a08b91372c5', '00dc20d4-b0f2-4ceb-a16f-b8d0d37d2fb6', '1bb46c64-e303-4c4f-bc35-202937208813', 'Novena', 'Novena a San Gregorio de Osset', 'Del 31 de agosto al 8 de septiembre', 9, 'Horario anual por confirmar', '2f00ad36-69ae-434d-8131-e23a44cdea11', 'Novena patronal con Rosario y ejercicio de Novena.', 'published', true, '31 de agosto–8 de septiembre', 3, 'La edición de 2026 incluyó Exposición del Santísimo, acto penitencial comunitario y Unción de Enfermos.'),
  ('67fbd6fe-ac0b-4905-a6c8-4edc6b1ee3c3', '00dc20d4-b0f2-4ceb-a16f-b8d0d37d2fb6', '1bb46c64-e303-4c4f-bc35-202937208813', 'Función solemne', 'Función solemne de San Gregorio de Osset', '9 de septiembre', 9, '11:00 en 2026', '2f00ad36-69ae-434d-8131-e23a44cdea11', 'Función solemne en honor al patrón de Alcalá del Río.', 'published', true, '9 de septiembre', 4, 'La hora corresponde a la edición de 2026.')
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
  ('edf476b0-046b-45c4-82d3-628e087d1c66', '1d3ab3c0-c7fd-427d-a856-e30e1362c5fd', '2b8a0c4c-8476-45d7-9eb8-dae80a6eb177', 'titular', 'Titular cristífero de la oración.'),
  ('ecdb1cc3-4904-49a7-b04b-8f17b6b17253', '6bfe4b69-8a15-44b6-b2ab-764d0d0662e4', '00dc20d4-b0f2-4ceb-a16f-b8d0d37d2fb6', 'corporacion', 'Culto de la corporación en la parroquia.'),
  ('1656267b-2bf5-4846-94a6-5c3001d4f0cc', '5a0e9f50-7242-4da8-b2f9-8a08b91372c5', '1bb46c64-e303-4c4f-bc35-202937208813', 'titular', 'Imagen objeto del culto patronal.'),
  ('8e9669bd-e524-4cf1-8d9c-caf7d7646309', '67fbd6fe-ac0b-4905-a6c8-4edc6b1ee3c3', '1bb46c64-e303-4c4f-bc35-202937208813', 'titular', 'Imagen objeto del culto patronal.')
on conflict (id) do update set
  cult_id = excluded.cult_id,
  entity_id = excluded.entity_id,
  role = excluded.role,
  notes = excluded.notes;

insert into public.cult_occurrences (id, cult_id, year, start_date, end_date, place_id, description_override, event_status, status, notes)
values
  ('40bb6867-a405-4869-a41e-f4ff9e9d28df', '1d3ab3c0-c7fd-427d-a856-e30e1362c5fd', 2026, '2026-04-02', '2026-04-02', 'a76c8821-55da-4721-99da-0ac74454b0c3', 'Ángelus, Cinco Llagas y Rosario a las 12:00.', 'held', 'published', 'Edición celebrada.'),
  ('0c419019-24de-4640-99a9-6d4c17ee8152', '6bfe4b69-8a15-44b6-b2ab-764d0d0662e4', 2026, '2026-04-02', '2026-04-02', '2f00ad36-69ae-434d-8131-e23a44cdea11', 'Santos Oficios a las 15:45.', 'held', 'published', 'Edición celebrada.'),
  ('4594e157-29b2-4393-bd44-34e1f533e505', '5a0e9f50-7242-4da8-b2f9-8a08b91372c5', 2026, '2026-08-31', '2026-09-08', '2f00ad36-69ae-434d-8131-e23a44cdea11', 'Novena con Rosario y ejercicio propio.', 'held', 'published', 'Edición celebrada.'),
  ('f0de6588-ce70-4980-a30d-82e0be0c9c5f', '67fbd6fe-ac0b-4905-a6c8-4edc6b1ee3c3', 2026, '2026-09-09', '2026-09-09', '2f00ad36-69ae-434d-8131-e23a44cdea11', 'Función solemne a las 11:00.', 'held', 'published', 'Edición celebrada.')
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

insert into public.outings (id, brotherhood_entity_id, outing_type, character, title, outing_date, return_date, year, departure_time, return_time, municipality_id, origin_place_id, destination_place_id, route_summary, description, event_status, status, organizer_name, slug)
values
  ('63c5dea6-7b99-408e-b070-351abee1f7fb', '00dc20d4-b0f2-4ceb-a16f-b8d0d37d2fb6', 'Estación de penitencia', 'ordinary', 'Estación de penitencia del Jueves Santo 2026', '2026-04-02', '2026-04-03', 2026, '18:00', '04:30', '1d4fb3b2-6b33-4575-9516-35ec617c1d22', 'a76c8821-55da-4721-99da-0ac74454b0c3', 'a76c8821-55da-4721-99da-0ac74454b0c3', 'Real Ermita de San Gregorio, Parroquia de Santa María de la Asunción y regreso nocturno a la ermita.', 'Salida de los dos pasos a las 18:00; entrada del palio en la parroquia a las 22:30; Vía Crucis y salida de regreso a las 00:30; entrada final a las 04:30.', 'held', 'published', 'Hermandad de la Vera-Cruz', 'estacion-penitencia-vera-cruz-alcala-del-rio-2026'),
  ('9c8b4b11-0cd5-4102-8713-91948ffbb4d0', '00dc20d4-b0f2-4ceb-a16f-b8d0d37d2fb6', 'Traslado', 'ordinary', 'Regreso de San Gregorio de Osset a su ermita 2026', '2026-09-09', '2026-09-09', 2026, '20:30', null, '1d4fb3b2-6b33-4575-9516-35ec617c1d22', '2f00ad36-69ae-434d-8131-e23a44cdea11', 'a76c8821-55da-4721-99da-0ac74454b0c3', 'Parroquia de Santa María de la Asunción y Real Ermita de San Gregorio de Osset.', 'Traslado patronal organizado por la Vera-Cruz, con la imagen portada por los nazarenos de paso del Santísimo Cristo.', 'held', 'published', 'Hermandad de la Vera-Cruz', 'regreso-san-gregorio-osset-alcala-del-rio-2026')
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
  slug = excluded.slug;

insert into public.outing_entities (id, outing_id, entity_id, role, notes)
values
  ('794f08e1-6931-4216-975b-14ea0da59920', '63c5dea6-7b99-408e-b070-351abee1f7fb', '2b8a0c4c-8476-45d7-9eb8-dae80a6eb177', 'titular_procesional', 'Titular cristífero.'),
  ('0f48c2c2-9037-4dd4-981a-b27d2294a0a0', '63c5dea6-7b99-408e-b070-351abee1f7fb', '7bbea24c-9f5a-45c3-8646-fb498041f974', 'titular_procesional', 'Titular mariana.'),
  ('8708a011-1a35-41d2-9dc4-0c3077f27df1', '63c5dea6-7b99-408e-b070-351abee1f7fb', 'f04cf7fc-c51f-451c-89d4-f14106620548', 'paso_procesional', 'Paso del Cristo.'),
  ('e342a482-ebfb-4609-aec8-309cbfee6d49', '63c5dea6-7b99-408e-b070-351abee1f7fb', 'f535b4f2-e038-4725-a93f-d2b18f35d63f', 'paso_procesional', 'Paso de palio.'),
  ('23d63216-73ee-42e2-92c3-3400b4233b63', '9c8b4b11-0cd5-4102-8713-91948ffbb4d0', '1bb46c64-e303-4c4f-bc35-202937208813', 'titular_trasladada', 'Imagen patronal trasladada de regreso a su ermita.')
on conflict (id) do update set
  outing_id = excluded.outing_id,
  entity_id = excluded.entity_id,
  role = excluded.role,
  notes = excluded.notes;

insert into public.outing_schedule_items (id, outing_id, sequence_no, label, item_date, item_time, time_text, place_id, place_text, notes)
values
  ('0fc593eb-e3f2-43c8-9415-7a63532a1ff2', '63c5dea6-7b99-408e-b070-351abee1f7fb', 1, 'Tradicional Paseo', '2026-04-02', '17:00', '17:00', null, 'Plaza del Calvario', 'Acto previo a la salida procesional.'),
  ('fe41545a-52fd-4e7d-b925-250a3057550f', '63c5dea6-7b99-408e-b070-351abee1f7fb', 2, 'Salida procesional', '2026-04-02', '18:00', '18:00', 'a76c8821-55da-4721-99da-0ac74454b0c3', null, 'Salida desde San Gregorio.'),
  ('5aa01f42-c18a-40c0-b774-c00d211bffd3', '63c5dea6-7b99-408e-b070-351abee1f7fb', 3, 'Entrada del palio en la parroquia', '2026-04-02', '22:30', '22:30', '2f00ad36-69ae-434d-8131-e23a44cdea11', null, 'Final del cortejo de ida.'),
  ('6fe021f7-e095-4f68-98d7-595f03a38640', '63c5dea6-7b99-408e-b070-351abee1f7fb', 4, 'Vía Crucis y salida de regreso', '2026-04-03', '00:30', '00:30', '2f00ad36-69ae-434d-8131-e23a44cdea11', null, 'Inicio del regreso nocturno.'),
  ('69a0ca40-3665-4000-8e30-4b1180016c1f', '63c5dea6-7b99-408e-b070-351abee1f7fb', 5, 'Entrada del palio en San Gregorio', '2026-04-03', '04:30', '04:30', 'a76c8821-55da-4721-99da-0ac74454b0c3', null, 'Cierre de la estación de penitencia.')
on conflict (id) do update set
  outing_id = excluded.outing_id,
  sequence_no = excluded.sequence_no,
  label = excluded.label,
  item_date = excluded.item_date,
  item_time = excluded.item_time,
  time_text = excluded.time_text,
  place_id = excluded.place_id,
  place_text = excluded.place_text,
  notes = excluded.notes;

insert into public.outing_music_positions (id, outing_id, step_entity_id, position_code, position_label, sequence_no, notes, status)
values
  ('80014948-a8fe-4c5c-8e9c-670a65e400bf', '63c5dea6-7b99-408e-b070-351abee1f7fb', null, 'cross_guide', 'Tras la Cruz de Guía en el cortejo de ida', 1, 'Tramo de ida hasta la parroquia.', 'published'),
  ('972d0519-930c-4f28-8707-49f4c4f51aef', '63c5dea6-7b99-408e-b070-351abee1f7fb', 'f04cf7fc-c51f-451c-89d4-f14106620548', 'after_christ', 'Tras el Santísimo Cristo en el cortejo de ida', 2, 'Tramo de ida hasta la parroquia.', 'published'),
  ('cfc2058a-2c87-42d5-ab53-e29b0bc10518', '63c5dea6-7b99-408e-b070-351abee1f7fb', 'f535b4f2-e038-4725-a93f-d2b18f35d63f', 'after_palio', 'Tras el palio en el cortejo de ida', 3, 'Tramo de ida hasta la parroquia.', 'published'),
  ('090af6a2-dd5a-4e5c-9235-04438ce2f808', '63c5dea6-7b99-408e-b070-351abee1f7fb', 'f04cf7fc-c51f-451c-89d4-f14106620548', 'after_christ', 'Tras el Santísimo Cristo en el regreso', 4, 'Tramo nocturno de regreso a San Gregorio.', 'published'),
  ('d9ba4648-47c8-4fac-a5b9-325b124eaf8a', '63c5dea6-7b99-408e-b070-351abee1f7fb', 'f535b4f2-e038-4725-a93f-d2b18f35d63f', 'after_palio', 'Tras la Virgen en el regreso', 5, 'Tramo nocturno de regreso a San Gregorio.', 'published'),
  ('278b6049-a820-4ec4-bcb9-e2ecf5db46be', '9c8b4b11-0cd5-4102-8713-91948ffbb4d0', null, 'after_procession', 'Tras San Gregorio en el regreso a su ermita', 1, 'Traslado patronal de 2026.', 'published')
on conflict (id) do update set
  outing_id = excluded.outing_id,
  step_entity_id = excluded.step_entity_id,
  position_code = excluded.position_code,
  position_label = excluded.position_label,
  sequence_no = excluded.sequence_no,
  notes = excluded.notes,
  status = excluded.status;

insert into public.outing_music_assignments (id, music_position_id, band_entity_id, participation_mode, sequence_no, segment_start_label, segment_end_label, notes, status)
values
  ('8de3ca52-e7b0-4800-855f-afbb94266850', '80014948-a8fe-4c5c-8e9c-670a65e400bf', 'de6bb885-b80e-4c26-a176-7f72af419d63', 'segment', 1, 'Real Ermita de San Gregorio', 'Parroquia de Santa María de la Asunción', 'Edición de 2026.', 'published'),
  ('712f8861-724e-42b0-b98c-a15cf1c71f3d', '972d0519-930c-4f28-8707-49f4c4f51aef', 'da951f85-de4c-48a4-bd97-b8c9f835d9b4', 'segment', 1, 'Real Ermita de San Gregorio', 'Parroquia de Santa María de la Asunción', 'Edición de 2026.', 'published'),
  ('15de26cf-0801-4a6d-ada9-c3a02a0a86f1', 'cfc2058a-2c87-42d5-ab53-e29b0bc10518', 'b5ab8fa7-e3e1-4667-a2db-23bea160aa52', 'segment', 1, 'Real Ermita de San Gregorio', 'Parroquia de Santa María de la Asunción', 'Edición de 2026.', 'published'),
  ('188dc867-00b1-4e2e-adb2-1a2cc39d07df', '090af6a2-dd5a-4e5c-9235-04438ce2f808', '31f46874-049b-4c33-aa68-b65ded5dfda9', 'segment', 1, 'Parroquia de Santa María de la Asunción', 'Real Ermita de San Gregorio', 'Edición de 2026.', 'published'),
  ('79faa036-27e7-4221-b4fb-e89d6761ae66', 'd9ba4648-47c8-4fac-a5b9-325b124eaf8a', 'da951f85-de4c-48a4-bd97-b8c9f835d9b4', 'segment', 1, 'Parroquia de Santa María de la Asunción', 'Real Ermita de San Gregorio', 'Edición de 2026.', 'published'),
  ('e2c7ec4c-fb8d-4cfe-acd5-f80286cc2ab1', '278b6049-a820-4ec4-bcb9-e2ecf5db46be', '1360a588-e570-4e27-a0d5-67f6cbd4ab34', 'full_route', 1, null, null, 'Regreso de San Gregorio de 2026.', 'published')
on conflict (id) do update set
  music_position_id = excluded.music_position_id,
  band_entity_id = excluded.band_entity_id,
  participation_mode = excluded.participation_mode,
  sequence_no = excluded.sequence_no,
  segment_start_label = excluded.segment_start_label,
  segment_end_label = excluded.segment_end_label,
  notes = excluded.notes,
  status = excluded.status;

update public.music_accompaniment_periods
set
  step_entity_id = 'f04cf7fc-c51f-451c-89d4-f14106620548',
  position = 'Tras el Santísimo Cristo de la Vera-Cruz en el cortejo de regreso',
  outing_type = 'Estación de penitencia',
  notes = 'Vínculo documentado desde 2003. En 2026 la banda acompañó al Cristo en el regreso nocturno desde la parroquia hasta San Gregorio.',
  status = 'published',
  public_step_name = 'Paso del Santísimo Cristo de la Vera-Cruz'
where id = '09d7a70b-fc42-404d-a895-a2b7bab719cc';

update public.music_accompaniment_periods
set
  position = 'Tras el Cristo en el cortejo de ida y tras la Virgen en el regreso',
  outing_type = 'Estación de penitencia',
  notes = 'La relación vigente comenzó en el Jueves Santo de 2016. En 2026 La Puebla acompañó al Cristo en el cortejo de ida y a la Virgen en el regreso nocturno.',
  status = 'published',
  public_step_name = 'Paso del Santísimo Cristo · Paso de palio de María Santísima de las Angustias Coronada'
where id = '00b07fdf-4795-4986-9135-59c3e04622b0';

insert into public.music_accompaniment_periods (
  id, brotherhood_entity_id, band_entity_id, step_entity_id, position, outing_type, date_from_text,
  is_current, notes, status, public_brotherhood_name, public_step_name, public_brotherhood_slug,
  public_municipality_name, public_municipality_slug, public_province
)
values
  ('2a1a4b87-219c-4650-8562-9480285d8445', '00dc20d4-b0f2-4ceb-a16f-b8d0d37d2fb6', 'de6bb885-b80e-4c26-a176-7f72af419d63', null, 'Tras la Cruz de Guía en el cortejo de ida', 'Estación de penitencia', 'Vigente en 2026; inicio no documentado', true, 'Asignación vigente en la edición de 2026; no se infiere un año inicial.', 'published', 'Hermandad de la Vera-Cruz de Alcalá del Río', 'Cruz de Guía', 'vera-cruz-alcala-del-rio', 'Alcalá del Río', 'alcala-del-rio', 'Sevilla'),
  ('c7926632-72ad-4918-acb5-c3e86ca01975', '00dc20d4-b0f2-4ceb-a16f-b8d0d37d2fb6', 'b5ab8fa7-e3e1-4667-a2db-23bea160aa52', 'f535b4f2-e038-4725-a93f-d2b18f35d63f', 'Tras el palio en el cortejo de ida', 'Estación de penitencia', 'Vigente en 2026; inicio no documentado', true, 'Asignación vigente en la edición de 2026; no se infiere un año inicial.', 'published', 'Hermandad de la Vera-Cruz de Alcalá del Río', 'Paso de palio de María Santísima de las Angustias Coronada', 'vera-cruz-alcala-del-rio', 'Alcalá del Río', 'alcala-del-rio', 'Sevilla')
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

insert into public.brotherhood_procession_stats (
  id, brotherhood_entity_id, year, procession_date, procession_day, nazarenos_count,
  acolytes_count, total_procession_count, departure_time, entrance_time, source_id,
  status, notes, members_count, members_count_kind, members_source_id
)
values (
  'efb73965-881c-418a-9ce6-5758cbb3c1cc', '00dc20d4-b0f2-4ceb-a16f-b8d0d37d2fb6', 2026,
  '2026-04-02', 'Jueves Santo', 902, 32, 1568, '18:00', '04:30',
  '347cccd0-1ff0-4594-9896-9860816f703f', 'published',
  'La fuente desglosa además 364 mantillas, 43 ángeles, 177 nazarenos de paso, 22 integrantes entre santas mujeres y decuria y 28 mayores devotos.',
  2650, 'exact', '347cccd0-1ff0-4594-9896-9860816f703f'
)
on conflict (id) do update set
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  year = excluded.year,
  procession_date = excluded.procession_date,
  procession_day = excluded.procession_day,
  nazarenos_count = excluded.nazarenos_count,
  acolytes_count = excluded.acolytes_count,
  total_procession_count = excluded.total_procession_count,
  departure_time = excluded.departure_time,
  entrance_time = excluded.entrance_time,
  source_id = excluded.source_id,
  status = excluded.status,
  notes = excluded.notes,
  members_count = excluded.members_count,
  members_count_kind = excluded.members_count_kind,
  members_source_id = excluded.members_source_id;

insert into public.entities (id, entity_type, name, slug, summary, status)
values
  ('71e7cf1c-f146-4bce-9801-203b88d5bc52', 'event', 'Origen documentado de la Vera-Cruz', 'origen-vera-cruz-alcala-del-rio-1483', 'Un grupo de alcalareños se reunía bajo el signo de la Santa Cruz en la Casa de San Gregorio desde el 2 de mayo de 1483.', 'published'),
  ('6303c91d-f636-4d08-ace8-02a5af72ab51', 'event', 'Ampliación de la Ermita de San Gregorio', 'ampliacion-ermita-san-gregorio-alcala-1500', 'La ampliación de la ermita fue inaugurada el 30 de noviembre de 1500.', 'published'),
  ('9d12a6fa-3e30-44f7-b84e-373e05c23133', 'event', 'Estatutos documentados de la Vera-Cruz', 'estatutos-vera-cruz-alcala-1542', 'La Cofradía contaba con estatutos al menos desde 1542.', 'published'),
  ('449f7825-9ff7-4722-856d-8319c3fdd697', 'event', 'Coronación de María Santísima de las Angustias', 'coronacion-angustias-alcala-1971', 'La Virgen fue coronada por el cardenal Bueno Monreal el 10 de octubre de 1971.', 'published'),
  ('b1c686e5-9c91-4009-87d4-7d33c35924d8', 'event', 'Reconocimiento canónico de la Coronación', 'reconocimiento-canonico-coronacion-angustias-alcala-1996', 'La Coronación de 1971 fue reconocida como canónica el 10 de octubre de 1996.', 'published'),
  ('e625575d-b048-49ab-a67b-58d67d9a225e', 'event', 'Estreno del nuevo paso del Santísimo Cristo', 'estreno-paso-cristo-vera-cruz-alcala-2012', 'El paso actual del Cristo de la Vera-Cruz se estrenó el Jueves Santo de 2012.', 'published')
on conflict (id) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.events (entity_id, event_type, event_date, event_date_text, place_id, description, event_category, brotherhood_entity_id, municipality_id, event_status, location_text)
values
  ('71e7cf1c-f146-4bce-9801-203b88d5bc52', 'Fundación', '1483-05-02', '2 de mayo de 1483', 'a76c8821-55da-4721-99da-0ac74454b0c3', 'Origen documentado de la Cofradía bajo el signo de la Santa Cruz.', 'historical', '00dc20d4-b0f2-4ceb-a16f-b8d0d37d2fb6', '1d4fb3b2-6b33-4575-9516-35ec617c1d22', 'held', 'Casa de San Gregorio, actual ermita'),
  ('6303c91d-f636-4d08-ace8-02a5af72ab51', 'Hito histórico', '1500-11-30', '30 de noviembre de 1500', 'a76c8821-55da-4721-99da-0ac74454b0c3', 'Inauguración de la ampliación de la Ermita de San Gregorio.', 'historical', '00dc20d4-b0f2-4ceb-a16f-b8d0d37d2fb6', '1d4fb3b2-6b33-4575-9516-35ec617c1d22', 'held', 'Ermita de San Gregorio'),
  ('9d12a6fa-3e30-44f7-b84e-373e05c23133', 'Aprobación de reglas', null, '1542', 'a76c8821-55da-4721-99da-0ac74454b0c3', 'Existencia documentada de estatutos de la Cofradía.', 'historical', '00dc20d4-b0f2-4ceb-a16f-b8d0d37d2fb6', '1d4fb3b2-6b33-4575-9516-35ec617c1d22', 'held', 'Alcalá del Río'),
  ('449f7825-9ff7-4722-856d-8319c3fdd697', 'Coronación', '1971-10-10', '10 de octubre de 1971', 'a76c8821-55da-4721-99da-0ac74454b0c3', 'Coronación de María Santísima de las Angustias por el cardenal Bueno Monreal.', 'historical', '00dc20d4-b0f2-4ceb-a16f-b8d0d37d2fb6', '1d4fb3b2-6b33-4575-9516-35ec617c1d22', 'held', 'Alcalá del Río'),
  ('b1c686e5-9c91-4009-87d4-7d33c35924d8', 'Coronación canónica', '1996-10-10', '10 de octubre de 1996', 'a76c8821-55da-4721-99da-0ac74454b0c3', 'Decreto de reconocimiento canónico de la Coronación de 1971.', 'historical', '00dc20d4-b0f2-4ceb-a16f-b8d0d37d2fb6', '1d4fb3b2-6b33-4575-9516-35ec617c1d22', 'held', 'Alcalá del Río'),
  ('e625575d-b048-49ab-a67b-58d67d9a225e', 'Patrimonio', '2012-04-05', 'Jueves Santo de 2012', 'a76c8821-55da-4721-99da-0ac74454b0c3', 'Estreno del paso procesional actual del Santísimo Cristo.', 'historical', '00dc20d4-b0f2-4ceb-a16f-b8d0d37d2fb6', '1d4fb3b2-6b33-4575-9516-35ec617c1d22', 'held', 'Alcalá del Río')
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
  ('ba03423f-4d20-4b4c-9dca-400b9e4d3d4e', '4fc8c2bd-b98e-4634-8c0e-70bfb63365f7', '00dc20d4-b0f2-4ceb-a16f-b8d0d37d2fb6', 'Historia y sede', 'Historia oficial.'),
  ('7cc941f0-0c85-4f24-9ea5-3346341df963', '4fc8c2bd-b98e-4634-8c0e-70bfb63365f7', '2b8a0c4c-8476-45d7-9eb8-dae80a6eb177', 'Titular y atribución', 'Historia oficial.'),
  ('4b5e1fea-617a-4a8e-abcf-d44a31c714f0', '4fc8c2bd-b98e-4634-8c0e-70bfb63365f7', '7bbea24c-9f5a-45c3-8646-fb498041f974', 'Titular, atribución y coronación', 'Historia oficial.'),
  ('24bd0bf5-963e-4629-9ed4-f29b02c21c47', 'f5cf1261-0034-4c53-b160-08c7a3ffda81', '1bb46c64-e303-4c4f-bc35-202937208813', 'San Gregorio de Osset', 'Cultos y regreso de 2026.'),
  ('1683e3cc-a3e5-4ee4-809f-58a62e3cf12e', '3ed47715-9192-4534-be0a-c8fb8e8be49e', '00dc20d4-b0f2-4ceb-a16f-b8d0d37d2fb6', 'Canal oficial', 'Facebook de la Hermandad.'),
  ('3873a167-3b14-439b-b5cd-ca51901b6a01', '4fc8c2bd-b98e-4634-8c0e-70bfb63365f7', '71e7cf1c-f146-4bce-9801-203b88d5bc52', 'Origen de 1483', 'Hito histórico.'),
  ('523e1adb-9094-4335-97d4-2ba4c0a3ac3c', '4fc8c2bd-b98e-4634-8c0e-70bfb63365f7', '6303c91d-f636-4d08-ace8-02a5af72ab51', 'Ampliación de 1500', 'Hito histórico.'),
  ('c7b3069c-efb6-46f2-9270-0a61a48a6bdc', '4fc8c2bd-b98e-4634-8c0e-70bfb63365f7', '9d12a6fa-3e30-44f7-b84e-373e05c23133', 'Estatutos de 1542', 'Hito histórico.'),
  ('1c2d8b78-ecb8-44e5-9090-9934762ff7dd', '4fc8c2bd-b98e-4634-8c0e-70bfb63365f7', '449f7825-9ff7-4722-856d-8319c3fdd697', 'Coronación de 1971', 'Hito histórico.'),
  ('ca2bbe9a-4196-4870-8730-72dd259e5ae0', '4fc8c2bd-b98e-4634-8c0e-70bfb63365f7', 'b1c686e5-9c91-4009-87d4-7d33c35924d8', 'Reconocimiento de 1996', 'Hito histórico.'),
  ('65f2052c-d91e-4d4c-a5a9-699bb9ece938', '4fc8c2bd-b98e-4634-8c0e-70bfb63365f7', 'e625575d-b048-49ab-a67b-58d67d9a225e', 'Estreno de 2012', 'Hito patrimonial.'),
  ('e7c22732-714d-4d0a-8327-5f2970e0bba1', '347cccd0-1ff0-4594-9896-9860816f703f', 'ca5812c5-30fe-45e4-91e0-43ff8c513889', 'Pelícano de plata', 'Descripción oficial del paso.'),
  ('35fac081-e517-47a6-afc2-c08db349cd5b', '347cccd0-1ff0-4594-9896-9860816f703f', '3cb7468c-636d-4dc5-b0fd-e019065c057a', 'Manto', 'Descripción oficial del palio.'),
  ('280fbf62-9aa1-4ee7-a3b1-74154a5d7772', '347cccd0-1ff0-4594-9896-9860816f703f', '10503762-5cad-4b9c-94ec-362b63f5ec27', 'Palio y faldón', 'Descripción oficial del palio.'),
  ('b96ad2fe-3b4d-4b29-92d6-a7a2c32f181b', '347cccd0-1ff0-4594-9896-9860816f703f', '045f054d-28b2-4e5c-8f3b-e247b99cc5b9', 'Techo y saya', 'Descripción oficial del palio.'),
  ('b21e2aae-7b22-4ada-aeb5-a2a7ae18ac8a', '347cccd0-1ff0-4594-9896-9860816f703f', '51f51561-f220-4445-a38c-e44c608f963a', 'Corona y orfebrería', 'Descripción oficial del palio.')
on conflict (id) do update set
  source_id = excluded.source_id,
  entity_id = excluded.entity_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, image_authorship_id, scope, notes)
values
  ('81547a62-50f7-4a21-ae43-54c120dd471f', '4fc8c2bd-b98e-4634-8c0e-70bfb63365f7', '759bc63d-328d-41b4-8d8b-aacf05778cff', 'Atribución del Cristo', 'Roque de Balduque, con cautela expresa.'),
  ('91629397-7502-4585-bc0a-b697edc2fd35', '4fc8c2bd-b98e-4634-8c0e-70bfb63365f7', '3366cad2-a985-4e77-a14b-76e5016747f3', 'Atribución de la Virgen', 'José Montes de Oca, con cautela expresa.')
on conflict (id) do update set
  source_id = excluded.source_id,
  image_authorship_id = excluded.image_authorship_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, step_phase_id, scope, notes)
values ('bc3953c2-9217-4ede-94a2-a03970b9e264', '347cccd0-1ff0-4594-9896-9860816f703f', 'a5c4bca9-8f9e-4fdd-ae47-d48d7c0a695e', 'Paso actual de 2012', 'Programa oficial de 2026.')
on conflict (id) do update set source_id=excluded.source_id, step_phase_id=excluded.step_phase_id, scope=excluded.scope, notes=excluded.notes;

insert into public.source_links (id, source_id, intervention_id, scope, notes)
values ('5e932803-cd09-4b1c-b71b-9daf3dbf6f99', '347cccd0-1ff0-4594-9896-9860816f703f', '90349104-b9be-460b-a6ba-0f339dffaf2e', 'Autoría del paso de Cristo', 'Francisco Verdugo, 2012.')
on conflict (id) do update set source_id=excluded.source_id, intervention_id=excluded.intervention_id, scope=excluded.scope, notes=excluded.notes;

insert into public.source_links (id, source_id, cult_id, scope, notes)
values
  ('1cc70fbd-fdde-4240-8005-6c7e15c10801', '347cccd0-1ff0-4594-9896-9860816f703f', '1d3ab3c0-c7fd-427d-a856-e30e1362c5fd', 'Oración del Jueves Santo', 'Horario de 2026.'),
  ('f956bdbf-188a-4900-b551-2bb3e640605a', '347cccd0-1ff0-4594-9896-9860816f703f', '6bfe4b69-8a15-44b6-b2ab-764d0d0662e4', 'Santos Oficios', 'Horario de 2026.'),
  ('0fa52186-e52e-4102-a5a0-13e5becbcf42', 'f5cf1261-0034-4c53-b160-08c7a3ffda81', '5a0e9f50-7242-4da8-b2f9-8a08b91372c5', 'Novena de San Gregorio', 'Fechas de 2026.'),
  ('f0cc8d68-6115-4728-a0f6-eb1efbfd21b6', 'f5cf1261-0034-4c53-b160-08c7a3ffda81', '67fbd6fe-ac0b-4905-a6c8-4edc6b1ee3c3', 'Función de San Gregorio', 'Fecha y hora de 2026.')
on conflict (id) do update set
  source_id = excluded.source_id,
  cult_id = excluded.cult_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, outing_id, scope, notes)
values
  ('03dcf528-b029-4719-9f7b-167a7f41651e', '347cccd0-1ff0-4594-9896-9860816f703f', '63c5dea6-7b99-408e-b070-351abee1f7fb', 'Jueves Santo 2026', 'Horarios, pasos y música.'),
  ('b683a6cb-453c-45a9-ac1d-1400f7d6dced', 'f5cf1261-0034-4c53-b160-08c7a3ffda81', '9c8b4b11-0cd5-4102-8713-91948ffbb4d0', 'Regreso de San Gregorio', 'Organización, horario, portadores y destino.')
on conflict (id) do update set
  source_id = excluded.source_id,
  outing_id = excluded.outing_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, music_accompaniment_period_id, scope, notes)
values
  ('9c14d9ac-b6b0-42ac-9fa9-575544da57e9', '347cccd0-1ff0-4594-9896-9860816f703f', '2a1a4b87-219c-4650-8562-9480285d8445', 'Nazareno de La Algaba', 'Posición y vigencia en 2026.'),
  ('1245c8d7-fb23-434f-b98a-5a858d05996e', '347cccd0-1ff0-4594-9896-9860816f703f', 'c7926632-72ad-4918-acb5-c3e86ca01975', 'Virgen de las Mercedes de Bollullos', 'Posición y vigencia en 2026.')
on conflict (id) do update set
  source_id = excluded.source_id,
  music_accompaniment_period_id = excluded.music_accompaniment_period_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, outing_music_assignment_id, scope, notes)
values ('a33dd437-a2f9-4c77-8551-0a46c29e89c2', 'f5cf1261-0034-4c53-b160-08c7a3ffda81', 'e2c7ec4c-fb8d-4cfe-acd5-f80286cc2ab1', 'Música del regreso de San Gregorio', 'Banda del Valle de Burguillos en 2026.')
on conflict (id) do update set source_id=excluded.source_id, outing_music_assignment_id=excluded.outing_music_assignment_id, scope=excluded.scope, notes=excluded.notes;

insert into public.bulk_imports (
  id, label, source_name, source_format, status, expected_items, staged_items,
  valid_items, invalid_items, applied_items, failed_items, metadata, completed_at
)
values (
  'c0160024-0000-4000-8000-000000000001',
  'HC-016 · Vera-Cruz de Alcalá del Río',
  'Web oficial y fuentes especializadas · 2026-09-15',
  'jsonl', 'completed', 0, 0, 0, 0, 0, 0,
  jsonb_build_object(
    'scope', 'Vera-Cruz de Alcalá del Río',
    'schema', 'unchanged',
    'preserved', 'Santa Ana y los cierres HC-016 anteriores',
    'collision_guard', 'Se reutilizan Hermandad, Ermita, dos Pasos, bandas y autores existentes'
  ),
  now()
)
on conflict (id) do update set
  label=excluded.label, source_name=excluded.source_name, source_format=excluded.source_format,
  status=excluded.status, metadata=excluded.metadata, completed_at=excluded.completed_at;

with operations(table_name, scope) as (
  values
    ('sources','2 fuentes'), ('places','parroquia'), ('entities','Hermandad'), ('brotherhoods','perfil'),
    ('entity_social_links','2 canales'), ('entities','2 agentes'), ('agents','2 fichas de agente'),
    ('entities','3 imágenes'), ('images','3 fichas de imagen'), ('image_authorships','2 atribuciones'),
    ('brotherhood_images','3 relaciones'), ('entities','2 pasos reutilizados'), ('steps','2 pasos completados'),
    ('brotherhood_steps','2 relaciones publicadas'), ('image_steps','2 relaciones'), ('step_phases','fase 2012'),
    ('entities','5 piezas patrimoniales'), ('heritage_assets','5 fichas patrimoniales'),
    ('heritage_interventions','5 autorías patrimoniales'), ('cults','4 cultos'), ('cult_entities','4 relaciones'),
    ('cult_occurrences','4 ediciones 2026'), ('outings','2 salidas'), ('outing_entities','5 participantes'),
    ('outing_schedule_items','5 hitos horarios'), ('outing_music_positions','6 posiciones'),
    ('outing_music_assignments','6 asignaciones'), ('music_accompaniment_periods','2 periodos reutilizados'),
    ('music_accompaniment_periods','2 periodos nuevos'), ('brotherhood_procession_stats','estadística 2026'),
    ('entities','6 acontecimientos'), ('events','6 fichas históricas'), ('source_links','historia e identidad'),
    ('source_links','atribuciones de titulares'), ('source_links','patrimonio de los pasos'),
    ('source_links','cultos de 2026'), ('source_links','salidas de 2026'), ('source_links','música vigente'),
    ('source_links','regreso de San Gregorio'), ('outings','control de estados pasados'),
    ('entities','control de slugs'), ('source_links','control de trazabilidad'), ('bulk_imports','cierre del lote')
), numbered as (
  select table_name, scope, row_number() over () - 1 as position from operations
)
insert into public.bulk_import_items (id, import_id, position, table_name, operation, priority, record, status, validation_errors, result, applied_at)
select
  gen_random_uuid(), 'c0160024-0000-4000-8000-000000000001', position, table_name, 'upsert', 100,
  jsonb_build_object('scope', scope, 'recipe', '20260915180000_cierra_vera_cruz_alcala_del_rio.sql'),
  'applied', '[]'::jsonb, jsonb_build_object('status','applied'), now()
from numbered
on conflict (import_id, position) do update set
  table_name=excluded.table_name, operation=excluded.operation, priority=excluded.priority,
  record=excluded.record, status=excluded.status, validation_errors=excluded.validation_errors,
  error_text=null, result=excluded.result, applied_at=excluded.applied_at;

update public.bulk_imports
set
  expected_items = (select count(*) from public.bulk_import_items where import_id='c0160024-0000-4000-8000-000000000001'),
  staged_items = (select count(*) from public.bulk_import_items where import_id='c0160024-0000-4000-8000-000000000001'),
  valid_items = (select count(*) from public.bulk_import_items where import_id='c0160024-0000-4000-8000-000000000001'),
  invalid_items = 0,
  applied_items = (select count(*) from public.bulk_import_items where import_id='c0160024-0000-4000-8000-000000000001'),
  failed_items = 0,
  completed_at = now()
where id='c0160024-0000-4000-8000-000000000001';

do $$
begin
  if (select count(*) from public.brotherhood_images where brotherhood_entity_id='00dc20d4-b0f2-4ceb-a16f-b8d0d37d2fb6' and status='published') <> 3 then
    raise exception 'Vera-Cruz no conserva sus tres imágenes relacionadas';
  end if;

  if (select count(*) from public.brotherhood_steps where brotherhood_entity_id='00dc20d4-b0f2-4ceb-a16f-b8d0d37d2fb6' and status='published') <> 2 then
    raise exception 'Vera-Cruz no conserva sus dos pasos publicados';
  end if;

  if (select count(*) from public.outings where brotherhood_entity_id='00dc20d4-b0f2-4ceb-a16f-b8d0d37d2fb6' and status='published') <> 2 then
    raise exception 'Las dos salidas de Vera-Cruz no quedaron separadas';
  end if;

  if exists (
    select 1 from public.outings
    where brotherhood_entity_id='00dc20d4-b0f2-4ceb-a16f-b8d0d37d2fb6'
      and outing_date < current_date and event_status='announced'
  ) then
    raise exception 'Vera-Cruz conserva una salida pasada como announced';
  end if;

  if exists (select 1 from public.entities group by slug having count(*) > 1) then
    raise exception 'La receta deja slugs duplicados';
  end if;

  if (select applied_items from public.bulk_imports where id='c0160024-0000-4000-8000-000000000001')
     <> (select count(*) from public.bulk_import_items where import_id='c0160024-0000-4000-8000-000000000001') then
    raise exception 'El recuento aplicado de Vera-Cruz no coincide con staging';
  end if;
end
$$;

commit;
