-- Hermandad de Jesús de La Algaba (12/10/2026). Propietario: «Sigamos» (mismo criterio que «Hazlo todo»: completar y publicar).
-- Fuentes: guía «La Algaba: Patrimonio entre naranjos» (educaand) y Banda de la Cruz Roja (Madrugá).
-- Reversión: jesus-la-algaba-rollback.sql.

-- 1 · Fuente nueva
insert into public.sources (id, name, url, source_type, author_or_publisher, accessed_at, notes) values
 ('7a5c0e05-2026-4012-8000-00000000ca17', 'La Algaba: Patrimonio entre naranjos · Hermandad de Jesús Nazareno (Jesús)',
  'https://sites.google.com/g.educaand.es/guiapatrimoniomatilde/hermandad-de-jes%C3%BAs-nazareno-jes%C3%BAs', 'Fuente institucional', 'Guía de patrimonio (educaand)', '2026-10-12',
  'Nombre oficial, sede (Iglesia de Jesús), titulares con autorías y fechas, paso de Cristo (Antonio Martín, 1958; caídas de Hermanas Ramas, 2008), palio y salida en la madrugada del Viernes Santo.')
on conflict (id) do nothing;

-- 2 · Ficha de la Hermandad
update public.entities set summary = 'Pontificia, Real e Ilustre Hermandad de Nuestro Padre Jesús Nazareno de La Algaba, con sede en la Iglesia de Jesús. Hace estación de penitencia en la madrugada del Viernes Santo con dos pasos: Jesús Nazareno y la Virgen de los Dolores bajo palio.'
where id = 'c6100000-0000-4000-8000-000000000004' and summary is null;
update public.brotherhoods set official_name = 'Pontificia, Real e Ilustre Hermandad de Nuestro Padre Jesús Nazareno',
  popular_name = 'Hermandad de Jesús', brotherhood_types = array['Penitencia'], current_procession_day = 'Madrugá',
  notes = 'Sede: Iglesia de Jesús. La denominación completa añade las advocaciones de Dolores, San Juan Evangelista y Santa Cruz del Convento.'
where entity_id = 'c6100000-0000-4000-8000-000000000004' and notes is null;

-- 3 · Imágenes y pasos (se crean ya publicados: la Hermandad se publica en el paso 4)
insert into public.entities (id, entity_type, name, slug, summary, status) values
 ('7a5c0e05-2026-4012-8000-0000000005c1', 'image', 'Nuestro Padre Jesús Nazareno', 'jesus-nazareno-la-algaba',
  'Imagen anónima de 1685, atribuida a La Roldana. Titular de la Hermandad de Jesús de La Algaba; sale en la madrugada del Viernes Santo.', 'draft'),
 ('7a5c0e05-2026-4012-8000-0000000005c2', 'image', 'Nuestra Señora de los Dolores', 'dolores-la-algaba',
  'Dolorosa de candelero para vestir, de 1,67 metros, atribuida a Juan de Astorga. Sale bajo palio en la madrugada del Viernes Santo.', 'draft'),
 ('7a5c0e05-2026-4012-8000-0000000005c3', 'image', 'San Juan Evangelista', 'san-juan-evangelista-la-algaba',
  'Obra del algabeño Miguel Ángel Domínguez (2005), titular de la Hermandad de Jesús de La Algaba.', 'draft'),
 ('7a5c0e05-2026-4012-8000-0000000005c4', 'step', 'Paso de Nuestro Padre Jesús Nazareno', 'paso-jesus-nazareno-la-algaba',
  'Paso de madera tallada y dorada de Antonio Martín (1958), con caídas bordadas por Hermanas Ramas (2008). Primer paso de la Madrugá.', 'draft'),
 ('7a5c0e05-2026-4012-8000-0000000005c5', 'step', 'Paso de palio de Nuestra Señora de los Dolores', 'paso-palio-dolores-la-algaba',
  'Paso de palio de la Virgen de los Dolores, segundo paso de la Madrugá.', 'draft')
on conflict (id) do nothing;
insert into public.images (entity_id, image_type, description, execution_date_text) values
 ('7a5c0e05-2026-4012-8000-0000000005c1', 'Nazareno', 'Imagen anónima de 1685 según un documento; se atribuye a La Roldana.', '1685'),
 ('7a5c0e05-2026-4012-8000-0000000005c2', 'Dolorosa de candelero', 'Imagen de candelero para vestir de 1,67 metros, atribuida a Juan de Astorga.', null),
 ('7a5c0e05-2026-4012-8000-0000000005c3', 'San Juan Evangelista', 'Obra del algabeño Miguel Ángel Domínguez.', '2005')
on conflict (entity_id) do nothing;
insert into public.steps (entity_id, step_type, description, execution_date_text) values
 ('7a5c0e05-2026-4012-8000-0000000005c4', 'Paso de Cristo', 'Madera tallada y dorada por Antonio Martín (1958). Caídas bordadas por Hermanas Ramas (2008).', '1958'),
 ('7a5c0e05-2026-4012-8000-0000000005c5', 'Paso de palio', 'Segundo paso de la estación de penitencia de la Madrugá.', null)
on conflict (entity_id) do nothing;

-- 4 · Publicación de entidades y relaciones
update public.entities set status = 'published' where status = 'draft' and id in ('c6100000-0000-4000-8000-000000000004',
  '7a5c0e05-2026-4012-8000-0000000005c1','7a5c0e05-2026-4012-8000-0000000005c2','7a5c0e05-2026-4012-8000-0000000005c3',
  '7a5c0e05-2026-4012-8000-0000000005c4','7a5c0e05-2026-4012-8000-0000000005c5');
insert into public.brotherhood_images (id, brotherhood_entity_id, image_entity_id, relation_type, status) values
 ('7a5c0e05-2026-4012-8000-0000000005c6', 'c6100000-0000-4000-8000-000000000004', '7a5c0e05-2026-4012-8000-0000000005c1', 'titular', 'published'),
 ('7a5c0e05-2026-4012-8000-0000000005c7', 'c6100000-0000-4000-8000-000000000004', '7a5c0e05-2026-4012-8000-0000000005c2', 'titular', 'published'),
 ('7a5c0e05-2026-4012-8000-0000000005c8', 'c6100000-0000-4000-8000-000000000004', '7a5c0e05-2026-4012-8000-0000000005c3', 'titular', 'published')
on conflict (id) do nothing;
insert into public.brotherhood_steps (id, brotherhood_entity_id, step_entity_id, relation_type, status) values
 ('7a5c0e05-2026-4012-8000-0000000005c9', 'c6100000-0000-4000-8000-000000000004', '7a5c0e05-2026-4012-8000-0000000005c4', 'processional_step', 'published'),
 ('7a5c0e05-2026-4012-8000-0000000005ca', 'c6100000-0000-4000-8000-000000000004', '7a5c0e05-2026-4012-8000-0000000005c5', 'processional_step', 'published')
on conflict (id) do nothing;
insert into public.image_steps (id, image_entity_id, step_entity_id, relation_type, status) values
 ('7a5c0e05-2026-4012-8000-0000000005cb', '7a5c0e05-2026-4012-8000-0000000005c1', '7a5c0e05-2026-4012-8000-0000000005c4', 'processes_on', 'published'),
 ('7a5c0e05-2026-4012-8000-0000000005cc', '7a5c0e05-2026-4012-8000-0000000005c2', '7a5c0e05-2026-4012-8000-0000000005c5', 'processes_on', 'published')
on conflict (id) do nothing;

-- 5 · Música: Cruz Roja tras el palio de los Dolores, desde 2019
update public.music_accompaniment_periods set step_entity_id = '7a5c0e05-2026-4012-8000-0000000005c5',
  position = 'Tras el paso de palio', public_step_name = 'Paso de palio de Nuestra Señora de los Dolores'
where id = 'cac5f6ad-9ed0-4dbc-aa89-e21077821ea6' and step_entity_id is null;

-- 6 · Fuentes
insert into public.source_links (source_id, entity_id, brotherhood_step_id, image_step_id, scope)
select v.s, v.e, v.bs, v.isx, 'Documentación de la Hermandad de Jesús de La Algaba' from (values
  ('7a5c0e05-2026-4012-8000-00000000ca17'::uuid, 'c6100000-0000-4000-8000-000000000004'::uuid, null::uuid, null::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca17'::uuid, '7a5c0e05-2026-4012-8000-0000000005c1'::uuid, null::uuid, null::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca17'::uuid, '7a5c0e05-2026-4012-8000-0000000005c2'::uuid, null::uuid, null::uuid),
  ('99edd4fa-028b-425d-950f-13ea955163f8'::uuid, '7a5c0e05-2026-4012-8000-0000000005c2'::uuid, null::uuid, null::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca17'::uuid, '7a5c0e05-2026-4012-8000-0000000005c3'::uuid, null::uuid, null::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca17'::uuid, '7a5c0e05-2026-4012-8000-0000000005c4'::uuid, null::uuid, null::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca17'::uuid, '7a5c0e05-2026-4012-8000-0000000005c5'::uuid, null::uuid, null::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca17'::uuid, null::uuid, '7a5c0e05-2026-4012-8000-0000000005c9'::uuid, null::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca17'::uuid, null::uuid, '7a5c0e05-2026-4012-8000-0000000005ca'::uuid, null::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca17'::uuid, null::uuid, null::uuid, '7a5c0e05-2026-4012-8000-0000000005cb'::uuid),
  ('99edd4fa-028b-425d-950f-13ea955163f8'::uuid, null::uuid, null::uuid, '7a5c0e05-2026-4012-8000-0000000005cc'::uuid)
) v(s, e, bs, isx)
where not exists (select 1 from public.source_links x where x.source_id = v.s and x.entity_id is not distinct from v.e
  and x.brotherhood_step_id is not distinct from v.bs and x.image_step_id is not distinct from v.isx);
