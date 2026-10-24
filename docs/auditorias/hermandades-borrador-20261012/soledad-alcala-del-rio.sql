-- Hermandad de la Soledad de Alcalá del Río (13/10/2026). Propietario: «Pasemos a otra» (mismo criterio: completar y publicar).
-- Fuentes: ArteSacro (08/04/2016) y 21Noticias (10/04/2026).
-- Se reutiliza el lugar existente «Real Ermita de San Gregorio de Osset» (también sede de la Vera-Cruz).
-- Las bandas del Cristo y de la Canina citadas en 2016 no se dan de alta: 21Noticias (2026) cita otras sin asignarlas a un paso.
-- Reversión: soledad-alcala-del-rio-rollback.sql.

-- 1 · Fuentes nuevas
insert into public.sources (id, name, url, source_type, author_or_publisher, accessed_at, notes) values
 ('7a5c0e05-2026-4012-8000-00000000ca32', 'La devoción a la Soledad y Santo Entierro de Cristo Yacente en Alcalá del Río',
  'https://www.artesacro.org/Noticia/Ver/109972/provincia-devocion-soledad-y-santo-entierro-cristo-yacente-alcala-rio8207', 'Medio especializado', 'ArteSacro', '2026-10-13',
  'Publicado el 08/04/2016. Sede en San Gregorio de Osset; Cristo yacente anónimo del XVI en pasta de madera con brazos articulados; Dolorosa de mediados del XVI coronada en 1996; Canina de Juan de Astorga (1844); Cruz Roja tras la Virgen.'),
 ('7a5c0e05-2026-4012-8000-00000000ca33', 'De 1556 a hoy: la imponente procesión de la Soledad que conecta siglos en Alcalá del Río',
  'https://21noticias.com/2026/04/10/de-1556-a-hoy-la-imponente-procesion-de-la-soledad-que-conecta-siglos-en-alcala-del-rio/', 'Medio local', '21Noticias', '2026-10-13',
  'Publicado el 10/04/2026. Nombre oficial, sede, titulares, tres pasos (Canina, urna neobarroca de 1987 y palio) y salida el Viernes Santo.')
on conflict (id) do nothing;

-- 2 · Ficha de la Hermandad
update public.entities set summary = 'Hermandad del Santo Entierro y de Nuestra Señora de los Dolores en su Soledad Coronada, con sede en la Real Ermita de San Gregorio de Osset de Alcalá del Río. Sale el Viernes Santo con la Canina, el Santo Entierro y el palio de la Soledad.'
where id = 'c6100000-0000-4000-8000-000000000005' and summary is null;
update public.brotherhoods set official_name = 'Real, Muy Antigua, Ilustre y Fervorosa Hermandad y Cofradía de Nazarenos del Santo Entierro en su Misericordia y Nuestra Señora de los Dolores en su Soledad Coronada',
  popular_name = 'Hermandad de la Soledad', brotherhood_types = array['Penitencia'], current_procession_day = 'Viernes Santo',
  canonical_see_place_id = 'a76c8821-55da-4721-99da-0ac74454b0c3',
  notes = 'Sede: Real Ermita de San Gregorio de Osset. Primera referencia documental en una cláusula testamentaria de 1556; primeras reglas conocidas de 1582, al fusionarse con la Hermandad de San Bartolomé. La procesión va de la ermita a la parroquia, donde se celebra el Sermón del Descendimiento, y regresa de madrugada.'
where entity_id = 'c6100000-0000-4000-8000-000000000005' and notes is null and canonical_see_place_id is null;

-- 3 · Imágenes y pasos
insert into public.entities (id, entity_type, name, slug, summary, status) values
 ('7a5c0e05-2026-4012-8000-000000000a01', 'image', 'Señor de la Misericordia', 'misericordia-alcala-del-rio',
  'Cristo yacente anónimo del siglo XVI, en pasta de madera y con brazos articulados. Titular de la Hermandad de la Soledad de Alcalá del Río.', 'draft'),
 ('7a5c0e05-2026-4012-8000-000000000a02', 'image', 'Nuestra Señora de los Dolores en su Soledad Coronada', 'dolores-soledad-alcala-del-rio',
  'Dolorosa de autor desconocido, de mediados del siglo XVI. Coronada canónicamente en 1996. Titular de la Hermandad de la Soledad de Alcalá del Río.', 'draft'),
 ('7a5c0e05-2026-4012-8000-000000000a03', 'image', 'Triunfo de la Santa Cruz sobre la Muerte («la Canina»)', 'canina-alcala-del-rio',
  'Conjunto alegórico de Juan de Astorga (1844) que abre el cortejo de la Hermandad de la Soledad de Alcalá del Río.', 'draft'),
 ('7a5c0e05-2026-4012-8000-000000000a04', 'step', 'Paso del Triunfo de la Santa Cruz («la Canina»)', 'paso-canina-alcala-del-rio',
  'Paso alegórico que abre el cortejo del Viernes Santo de la Soledad de Alcalá del Río.', 'draft'),
 ('7a5c0e05-2026-4012-8000-000000000a05', 'step', 'Paso del Santo Entierro', 'paso-santo-entierro-alcala-del-rio',
  'Paso con la urna neobarroca de 1987 del Señor de la Misericordia.', 'draft'),
 ('7a5c0e05-2026-4012-8000-000000000a06', 'step', 'Paso de palio de Nuestra Señora de los Dolores en su Soledad', 'paso-palio-soledad-alcala-del-rio',
  'Paso de palio con bordados en oro sobre terciopelo negro y piezas de los siglos XVIII, XIX y XX.', 'draft')
on conflict (id) do nothing;
insert into public.images (entity_id, image_type, description, execution_date_text) values
 ('7a5c0e05-2026-4012-8000-000000000a01', 'Cristo yacente',
  'Obra anónima del siglo XVI, en pasta de madera, con brazos articulados. Las reglas de 1582 ya mencionan un Cristo con sepulcro.', 'Siglo XVI'),
 ('7a5c0e05-2026-4012-8000-000000000a02', 'Dolorosa',
  'Autor desconocido; datable hacia mediados del siglo XVI. Candelero restaurado en 1986 por Francisco de Paula. Coronada canónicamente en 1996 por el cardenal Carlos Amigo Vallejo.', 'Mediados del siglo XVI'),
 ('7a5c0e05-2026-4012-8000-000000000a03', 'Conjunto escultórico alegórico',
  'Obra de Juan de Astorga Cubero, fechada en 1844 por ArteSacro y 21Noticias.', '1844')
on conflict (entity_id) do nothing;
insert into public.steps (entity_id, step_type, description, execution_date_text) values
 ('7a5c0e05-2026-4012-8000-000000000a04', 'Paso alegórico', 'Abre el cortejo del Viernes Santo. Autor y fecha del paso no documentados.', null),
 ('7a5c0e05-2026-4012-8000-000000000a05', 'Paso de urna', 'Urna neobarroca de 1987 con el Señor de la Misericordia (21Noticias, 2026).', '1987'),
 ('7a5c0e05-2026-4012-8000-000000000a06', 'Paso de palio', 'Bordados en oro sobre terciopelo negro, con piezas de los siglos XVIII, XIX y XX (ArteSacro, 2016). Autores no documentados.', null)
on conflict (entity_id) do nothing;

-- 4 · Publicación de entidades y relaciones
update public.entities set status = 'published' where status = 'draft' and id in ('c6100000-0000-4000-8000-000000000005',
  '7a5c0e05-2026-4012-8000-000000000a01','7a5c0e05-2026-4012-8000-000000000a02','7a5c0e05-2026-4012-8000-000000000a03',
  '7a5c0e05-2026-4012-8000-000000000a04','7a5c0e05-2026-4012-8000-000000000a05','7a5c0e05-2026-4012-8000-000000000a06');
insert into public.brotherhood_images (id, brotherhood_entity_id, image_entity_id, relation_type, status) values
 ('7a5c0e05-2026-4012-8000-000000000a07', 'c6100000-0000-4000-8000-000000000005', '7a5c0e05-2026-4012-8000-000000000a01', 'titular', 'published'),
 ('7a5c0e05-2026-4012-8000-000000000a08', 'c6100000-0000-4000-8000-000000000005', '7a5c0e05-2026-4012-8000-000000000a02', 'titular', 'published'),
 ('7a5c0e05-2026-4012-8000-000000000a09', 'c6100000-0000-4000-8000-000000000005', '7a5c0e05-2026-4012-8000-000000000a03', 'secondary_image', 'published')
on conflict (id) do nothing;
insert into public.brotherhood_steps (id, brotherhood_entity_id, step_entity_id, relation_type, status) values
 ('7a5c0e05-2026-4012-8000-000000000a0a', 'c6100000-0000-4000-8000-000000000005', '7a5c0e05-2026-4012-8000-000000000a04', 'processional_step', 'published'),
 ('7a5c0e05-2026-4012-8000-000000000a0b', 'c6100000-0000-4000-8000-000000000005', '7a5c0e05-2026-4012-8000-000000000a05', 'processional_step', 'published'),
 ('7a5c0e05-2026-4012-8000-000000000a0c', 'c6100000-0000-4000-8000-000000000005', '7a5c0e05-2026-4012-8000-000000000a06', 'processional_step', 'published')
on conflict (id) do nothing;
insert into public.image_steps (id, image_entity_id, step_entity_id, relation_type, status) values
 ('7a5c0e05-2026-4012-8000-000000000a0d', '7a5c0e05-2026-4012-8000-000000000a03', '7a5c0e05-2026-4012-8000-000000000a04', 'processes_on', 'published'),
 ('7a5c0e05-2026-4012-8000-000000000a0e', '7a5c0e05-2026-4012-8000-000000000a01', '7a5c0e05-2026-4012-8000-000000000a05', 'processes_on', 'published'),
 ('7a5c0e05-2026-4012-8000-000000000a0f', '7a5c0e05-2026-4012-8000-000000000a02', '7a5c0e05-2026-4012-8000-000000000a06', 'processes_on', 'published')
on conflict (id) do nothing;

-- 5 · Música: Cruz Roja tras el palio, desde 1991
update public.music_accompaniment_periods set step_entity_id = '7a5c0e05-2026-4012-8000-000000000a06',
  public_step_name = 'Paso de palio de Nuestra Señora de los Dolores en su Soledad'
where id = 'efb12f82-0263-4c00-a368-c5bb05e76583' and step_entity_id is null;

-- 6 · Fuentes
insert into public.source_links (source_id, entity_id, brotherhood_step_id, image_step_id, music_accompaniment_period_id, scope)
select v.s, v.e, v.bs, v.isx, v.p, 'Documentación de la Hermandad de la Soledad de Alcalá del Río' from (values
  ('7a5c0e05-2026-4012-8000-00000000ca32'::uuid, 'c6100000-0000-4000-8000-000000000005'::uuid, null::uuid, null::uuid, null::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca33'::uuid, 'c6100000-0000-4000-8000-000000000005'::uuid, null::uuid, null::uuid, null::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca32'::uuid, '7a5c0e05-2026-4012-8000-000000000a01'::uuid, null::uuid, null::uuid, null::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca33'::uuid, '7a5c0e05-2026-4012-8000-000000000a01'::uuid, null::uuid, null::uuid, null::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca32'::uuid, '7a5c0e05-2026-4012-8000-000000000a02'::uuid, null::uuid, null::uuid, null::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca33'::uuid, '7a5c0e05-2026-4012-8000-000000000a02'::uuid, null::uuid, null::uuid, null::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca32'::uuid, '7a5c0e05-2026-4012-8000-000000000a03'::uuid, null::uuid, null::uuid, null::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca33'::uuid, '7a5c0e05-2026-4012-8000-000000000a03'::uuid, null::uuid, null::uuid, null::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca33'::uuid, '7a5c0e05-2026-4012-8000-000000000a04'::uuid, null::uuid, null::uuid, null::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca33'::uuid, '7a5c0e05-2026-4012-8000-000000000a05'::uuid, null::uuid, null::uuid, null::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca32'::uuid, '7a5c0e05-2026-4012-8000-000000000a06'::uuid, null::uuid, null::uuid, null::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca33'::uuid, null::uuid, '7a5c0e05-2026-4012-8000-000000000a0a'::uuid, null::uuid, null::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca33'::uuid, null::uuid, '7a5c0e05-2026-4012-8000-000000000a0b'::uuid, null::uuid, null::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca33'::uuid, null::uuid, '7a5c0e05-2026-4012-8000-000000000a0c'::uuid, null::uuid, null::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca33'::uuid, null::uuid, null::uuid, '7a5c0e05-2026-4012-8000-000000000a0d'::uuid, null::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca33'::uuid, null::uuid, null::uuid, '7a5c0e05-2026-4012-8000-000000000a0e'::uuid, null::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca32'::uuid, null::uuid, null::uuid, '7a5c0e05-2026-4012-8000-000000000a0f'::uuid, null::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca32'::uuid, null::uuid, null::uuid, null::uuid, 'efb12f82-0263-4c00-a368-c5bb05e76583'::uuid)
) v(s, e, bs, isx, p)
where not exists (select 1 from public.source_links x where x.source_id = v.s and x.entity_id is not distinct from v.e
  and x.brotherhood_step_id is not distinct from v.bs and x.image_step_id is not distinct from v.isx
  and x.music_accompaniment_period_id is not distinct from v.p);
