-- Hermandad de la Esperanza de Arahal (12/10/2026). Propietario: «Hazlo» (completar y publicar).
-- Fuentes: web de la Hermandad, ArteSacro (2009) y Archidiócesis de Sevilla (Jubileo 2025).
-- No se crea imagen de Santa María Magdalena (cotitular en el nombre) porque ninguna fuente la describe.
-- San Juan se registra como titular sin relación con un paso: las fuentes no dicen en cuál procesiona.
-- Reversión: esperanza-arahal-rollback.sql.

-- 1 · Fuentes nuevas
insert into public.sources (id, name, url, source_type, author_or_publisher, accessed_at, notes) values
 ('7a5c0e05-2026-4012-8000-00000000ca22', 'Santísimo Cristo de la Esperanza · Hermandad de la Esperanza de Arahal',
  'https://hermandadesperanzaarahal.es/blog/santisimo-cristo-de-la-esperanza/', 'Web oficial de la Hermandad', 'Hermandad de la Esperanza de Arahal', '2026-10-12',
  'Cristo de Manuel Pineda Calderón (encargo 1946, llegada 1947), cedro, cruz arbórea; restaurado en 2009 por Pedro E. Manzano (IAPH). Angustias y San Juan, también de Pineda Calderón.'),
 ('7a5c0e05-2026-4012-8000-00000000ca23', 'Una mirada a la provincia. La Hermandad de la Esperanza de Arahal',
  'https://www.artesacro.org/Noticia/Ver/49049/provincia-mirada-provincia-hermandad-esperanza-arahal', 'Medio especializado', 'ArteSacro (Eduardo Fdez. López)', '2026-10-12',
  'Publicado el 11/05/2009. Nombre oficial, sede en Santa María Magdalena, Angustias de Pineda Calderón (1938), descripción de los dos pasos y salida el Viernes Santo por la tarde.'),
 ('7a5c0e05-2026-4012-8000-00000000ca24', 'Jubileo 2025: Santísimo Cristo de la Esperanza (Parroquia de Santa María Magdalena, Arahal)',
  'https://www.archisevilla.org/jubileo-2025-santisimo-cristo-de-la-esperanza-parroquia-de-santa-maria-magdalena-arahal/', 'Fuente diocesana', 'Archidiócesis de Sevilla', '2026-10-12',
  'Cristo de Pineda Calderón (1946-1947), autor también de las otras dos imágenes titulares; sede en la parroquia de Santa María Magdalena.')
on conflict (id) do nothing;

-- 2 · Ficha de la Hermandad
update public.entities set summary = 'Hermandad Sacramental del Santísimo Cristo de la Esperanza y Nuestra Señora de las Angustias, con sede en la parroquia de Santa María Magdalena de Arahal. Hace estación de penitencia la tarde del Viernes Santo con paso de Cristo y paso de palio.'
where id = 'c6100000-0000-4000-8000-000000000010' and summary is null;
update public.brotherhoods set official_name = 'Hermandad Sacramental y Cofradía de Nazarenos del Santísimo Cristo de la Esperanza, Nuestra Señora de las Angustias, San Juan Evangelista y Santa María Magdalena',
  popular_name = 'Hermandad de la Esperanza', brotherhood_types = array['Sacramental','Penitencia'], current_procession_day = 'Viernes Santo',
  notes = 'Sede: parroquia de Santa María Magdalena. Fundada en la primera mitad del siglo XVII; conocida antiguamente como «la de los treinta y tres hermanos». Nazarenos con túnica de capa blanca y antifaz verde.'
where entity_id = 'c6100000-0000-4000-8000-000000000010' and notes is null;

-- 3 · Imágenes y pasos
insert into public.entities (id, entity_type, name, slug, summary, status) values
 ('7a5c0e05-2026-4012-8000-0000000005e1', 'image', 'Santísimo Cristo de la Esperanza', 'cristo-esperanza-arahal',
  'Crucificado muerto de Manuel Pineda Calderón (1946-1947), en cedro y con cruz arbórea. Titular de la Hermandad de la Esperanza de Arahal.', 'draft'),
 ('7a5c0e05-2026-4012-8000-0000000005e2', 'image', 'Nuestra Señora de las Angustias', 'angustias-arahal',
  'Dolorosa de Manuel Pineda Calderón. Titular de la Hermandad de la Esperanza de Arahal; procesiona bajo palio el Viernes Santo.', 'draft'),
 ('7a5c0e05-2026-4012-8000-0000000005e3', 'image', 'San Juan Evangelista', 'san-juan-evangelista-arahal',
  'Obra de Manuel Pineda Calderón, titular de la Hermandad de la Esperanza de Arahal.', 'draft'),
 ('7a5c0e05-2026-4012-8000-0000000005e4', 'step', 'Paso del Santísimo Cristo de la Esperanza', 'paso-cristo-esperanza-arahal',
  'Paso neobarroco de madera dorada y policromada, con candelabros de guardabrisas.', 'draft'),
 ('7a5c0e05-2026-4012-8000-0000000005e5', 'step', 'Paso de palio de Nuestra Señora de las Angustias', 'paso-palio-angustias-arahal',
  'Paso de palio con palio rojo bordado en oro por Francisco Expósito y respiraderos de Eduardo Seco Imberg procedentes del Buen Fin de Sevilla.', 'draft')
on conflict (id) do nothing;
insert into public.images (entity_id, image_type, description, execution_date_text) values
 ('7a5c0e05-2026-4012-8000-0000000005e1', 'Crucificado',
  'Obra de Manuel Pineda Calderón: encargada en 1946, llegó a Arahal en la primavera de 1947. Cristo muerto en madera de cedro, cruz arbórea, inspirado en los crucificados de Juan de Mesa. Restaurado en 2009 por Pedro E. Manzano Beltrán (IAPH). Es el tercer crucificado titular: el primitivo se destruyó en 1936 y el de Enrique Orce (1938) se conserva en la parroquia de Nuestra Señora de la Victoria.',
  '1946-1947'),
 ('7a5c0e05-2026-4012-8000-0000000005e2', 'Dolorosa', 'Obra de Manuel Pineda Calderón; ArteSacro (2009) la fecha en 1938.', '1938'),
 ('7a5c0e05-2026-4012-8000-0000000005e3', 'San Juan Evangelista', 'Obra de Manuel Pineda Calderón.', null)
on conflict (entity_id) do nothing;
insert into public.steps (entity_id, step_type, description, execution_date_text) values
 ('7a5c0e05-2026-4012-8000-0000000005e4', 'Paso de Crucificado',
  'Neobarroco, de madera dorada y policromada, con talla de hojarasca y cartelas con frutas y escenas de la Pasión; alumbrado por candelabros de guardabrisas (ArteSacro, 2009). Autor y fecha no documentados.', null),
 ('7a5c0e05-2026-4012-8000-0000000005e5', 'Paso de palio',
  'Palio renacentista rojo bordado en oro fino por el hermano Francisco Expósito según diseño del hermano Andrés Morell, encargado a los talleres sevillanos de Villarreal y estrenado en la década de 1960. Respiraderos de Eduardo Seco Imberg (años 30), adquiridos en 1961 a la Hermandad del Buen Fin de Sevilla y reformados después. Varales, ánforas y candelabros de cola de Villarreal (ArteSacro, 2009).',
  'Década de 1960')
on conflict (entity_id) do nothing;

-- 4 · Publicación de entidades y relaciones
update public.entities set status = 'published' where status = 'draft' and id in ('c6100000-0000-4000-8000-000000000010',
  '7a5c0e05-2026-4012-8000-0000000005e1','7a5c0e05-2026-4012-8000-0000000005e2','7a5c0e05-2026-4012-8000-0000000005e3',
  '7a5c0e05-2026-4012-8000-0000000005e4','7a5c0e05-2026-4012-8000-0000000005e5');
insert into public.brotherhood_images (id, brotherhood_entity_id, image_entity_id, relation_type, status) values
 ('7a5c0e05-2026-4012-8000-0000000005e6', 'c6100000-0000-4000-8000-000000000010', '7a5c0e05-2026-4012-8000-0000000005e1', 'titular', 'published'),
 ('7a5c0e05-2026-4012-8000-0000000005e7', 'c6100000-0000-4000-8000-000000000010', '7a5c0e05-2026-4012-8000-0000000005e2', 'titular', 'published'),
 ('7a5c0e05-2026-4012-8000-0000000005e8', 'c6100000-0000-4000-8000-000000000010', '7a5c0e05-2026-4012-8000-0000000005e3', 'titular', 'published')
on conflict (id) do nothing;
insert into public.brotherhood_steps (id, brotherhood_entity_id, step_entity_id, relation_type, status) values
 ('7a5c0e05-2026-4012-8000-0000000005e9', 'c6100000-0000-4000-8000-000000000010', '7a5c0e05-2026-4012-8000-0000000005e4', 'processional_step', 'published'),
 ('7a5c0e05-2026-4012-8000-0000000005ea', 'c6100000-0000-4000-8000-000000000010', '7a5c0e05-2026-4012-8000-0000000005e5', 'processional_step', 'published')
on conflict (id) do nothing;
insert into public.image_steps (id, image_entity_id, step_entity_id, relation_type, status) values
 ('7a5c0e05-2026-4012-8000-0000000005eb', '7a5c0e05-2026-4012-8000-0000000005e1', '7a5c0e05-2026-4012-8000-0000000005e4', 'processes_on', 'published'),
 ('7a5c0e05-2026-4012-8000-0000000005ec', '7a5c0e05-2026-4012-8000-0000000005e2', '7a5c0e05-2026-4012-8000-0000000005e5', 'processes_on', 'published')
on conflict (id) do nothing;

-- 5 · Música: se enlazan los tres periodos existentes a su paso (sin tocar fechas ni bandas)
update public.music_accompaniment_periods set step_entity_id = '7a5c0e05-2026-4012-8000-0000000005e4',
  public_step_name = 'Paso del Santísimo Cristo de la Esperanza'
where id = '6bf4a8a1-3a4b-4699-8379-26aa96c35e32' and step_entity_id is null;
update public.music_accompaniment_periods set step_entity_id = '7a5c0e05-2026-4012-8000-0000000005e5'
where id in ('e52fefc4-7129-4f04-8633-196384641882', '69e37af7-c32c-421b-a9ec-a1a777db9959') and step_entity_id is null;

-- 6 · Fuentes
insert into public.source_links (source_id, entity_id, brotherhood_step_id, image_step_id, scope)
select v.s, v.e, v.bs, v.isx, 'Documentación de la Hermandad de la Esperanza de Arahal' from (values
  ('7a5c0e05-2026-4012-8000-00000000ca23'::uuid, 'c6100000-0000-4000-8000-000000000010'::uuid, null::uuid, null::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca24'::uuid, 'c6100000-0000-4000-8000-000000000010'::uuid, null::uuid, null::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca22'::uuid, '7a5c0e05-2026-4012-8000-0000000005e1'::uuid, null::uuid, null::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca24'::uuid, '7a5c0e05-2026-4012-8000-0000000005e1'::uuid, null::uuid, null::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca22'::uuid, '7a5c0e05-2026-4012-8000-0000000005e2'::uuid, null::uuid, null::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca23'::uuid, '7a5c0e05-2026-4012-8000-0000000005e2'::uuid, null::uuid, null::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca22'::uuid, '7a5c0e05-2026-4012-8000-0000000005e3'::uuid, null::uuid, null::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca24'::uuid, '7a5c0e05-2026-4012-8000-0000000005e3'::uuid, null::uuid, null::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca23'::uuid, '7a5c0e05-2026-4012-8000-0000000005e4'::uuid, null::uuid, null::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca23'::uuid, '7a5c0e05-2026-4012-8000-0000000005e5'::uuid, null::uuid, null::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca23'::uuid, null::uuid, '7a5c0e05-2026-4012-8000-0000000005e9'::uuid, null::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca23'::uuid, null::uuid, '7a5c0e05-2026-4012-8000-0000000005ea'::uuid, null::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca23'::uuid, null::uuid, null::uuid, '7a5c0e05-2026-4012-8000-0000000005eb'::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca23'::uuid, null::uuid, null::uuid, '7a5c0e05-2026-4012-8000-0000000005ec'::uuid)
) v(s, e, bs, isx)
where not exists (select 1 from public.source_links x where x.source_id = v.s and x.entity_id is not distinct from v.e
  and x.brotherhood_step_id is not distinct from v.bs and x.image_step_id is not distinct from v.isx);
