-- Hermandad de la Divina Pastora de Capuchinos (Sevilla) (12/10/2026). Propietario: «Es de Sevilla y continuamos».
-- Fuentes: Archidiócesis de Sevilla, web de la Banda Las Nieves de Olivares, Gente de Paz (2022) y ArteSacro (2025).
-- La autoría de la imagen no es unánime: se recogen las dos versiones (atribución a José Fernández Guerrero / talla anónima).
-- No se documenta el autor del paso ni su fecha: el paso se registra sin ellos.
-- Reversión: divina-pastora-capuchinos-rollback.sql.

-- 1 · Fuentes nuevas
insert into public.sources (id, name, url, source_type, author_or_publisher, accessed_at, notes) values
 ('7a5c0e05-2026-4012-8000-00000000ca18', 'La Pastora de Capuchinos', 'https://www.archisevillasiempreadelante.org/pastora-de-capuchinos/',
  'Fuente diocesana', 'Archidiócesis de Sevilla', '2026-10-12',
  'Sede en el convento de las Santas Justa y Rufina (Capuchinos); imagen atribuida a José Fernández Guerrero; coronaciones de 1921 y 2004.'),
 ('7a5c0e05-2026-4012-8000-00000000ca19', 'Divina Pastora de las Almas (Pastora de Capuchinos) · Las Nieves de Olivares',
  'https://lasnievesdeolivares.com/divina-pastora-de-las-almas-pastora-de-capuchinos/', 'Web oficial de banda', 'Banda de Música Las Nieves de Olivares', '2026-10-12',
  'Acompañamiento de la banda a la Pastora de Capuchinos; describe la imagen como talla anónima.'),
 ('7a5c0e05-2026-4012-8000-00000000ca20', 'Las Nieves de Olivares acompañará a la Pastora de Capuchinos en su procesión triunfal de mayo de 2022',
  'https://www.gentedepaz.es/las-nieves-de-olivares-acompanara-a-la-pastora-de-capuchinos-en-su-procesion-triunfal-de-mayo-de-2022-con-motivo-del-centenario-de-su-coronacion/',
  'Medio cofrade', 'Gente de Paz', '2026-10-12',
  'Inicio del acompañamiento de Las Nieves en 2022 (centenario de la coronación). Atribución a Fernández Guerrero citando a Martínez Alcalde; restauración de Sebastián Santos (1956) y cuerpo de Francisco Buiza (1982).'),
 ('7a5c0e05-2026-4012-8000-00000000ca21', 'Emoción y devoción en la procesión de la Divina Pastora de Capuchinos',
  'https://www.artesacro.org/Noticia/Ver/161920/emocion-devocion-procesion-divina-pastora-capuchinos', 'Medio especializado', 'ArteSacro', '2026-10-12',
  'Crónica de la procesión del 25/05/2025: paso con exorno floral de Miguel Murillo y acompañamiento de Las Nieves de Olivares.')
on conflict (id) do nothing;

-- 2 · Ficha de la Hermandad
update public.entities set summary = 'Hermandad de gloria de la Divina Pastora de las Almas Coronada, con sede en el convento de las Santas Justa y Rufina (Capuchinos), en Sevilla. Procesiona el último domingo de mayo.'
where id = '47db4c8f-a4af-4733-8099-d39754cb57b3' and summary = 'Hermandad de gloria de Capuchinos, Sevilla.';
update public.brotherhoods set municipality_id = 'ca85889c-21fe-4367-8477-a57656b25da4', brotherhood_types = array['Gloria'],
  current_procession_day = 'Último domingo de mayo', neighborhood = 'Capuchinos',
  notes = 'Sede: convento de las Santas Justa y Rufina (Capuchinos). Titular coronada litúrgicamente el 22 de mayo de 1921; la coronación fue elevada a canónica en 2004.'
where entity_id = '47db4c8f-a4af-4733-8099-d39754cb57b3' and municipality_id is null and notes is null;

-- 3 · Imagen y paso
insert into public.entities (id, entity_type, name, slug, summary, status) values
 ('7a5c0e05-2026-4012-8000-0000000005d1', 'image', 'Divina Pastora de las Almas Coronada', 'divina-pastora-almas-capuchinos-sevilla',
  'Titular de la Hermandad de la Divina Pastora de Capuchinos (Sevilla). Imagen de finales del siglo XVIII o principios del XIX atribuida a José Fernández Guerrero; otras fuentes la consideran anónima. Coronada en 1921; coronación canónica en 2004.', 'draft'),
 ('7a5c0e05-2026-4012-8000-0000000005d2', 'step', 'Paso de la Divina Pastora de las Almas Coronada', 'paso-divina-pastora-capuchinos-sevilla',
  'Paso procesional de la Divina Pastora de Capuchinos, que sale el último domingo de mayo.', 'draft')
on conflict (id) do nothing;
insert into public.images (entity_id, image_type, description, execution_date_text) values
 ('7a5c0e05-2026-4012-8000-0000000005d1', 'Virgen de Gloria',
  'Atribuida a José Fernández Guerrero (Martínez Alcalde), estilo neoclásico, probablemente realizada en Cádiz; la Banda Las Nieves la describe como talla anónima. Restaurada por Sebastián Santos en 1956 (nuevos ojos); nuevo cuerpo de Francisco Buiza en 1982. Coronación litúrgica el 22 de mayo de 1921, elevada a canónica en 2004 por el cardenal Carlos Amigo Vallejo.',
  'Finales del siglo XVIII o principios del XIX')
on conflict (entity_id) do nothing;
insert into public.steps (entity_id, step_type, description, execution_date_text) values
 ('7a5c0e05-2026-4012-8000-0000000005d2', 'Paso procesional de Gloria',
  'Paso de la procesión del último domingo de mayo. En 2025, exorno floral de Miguel Murillo. Autor y fecha de ejecución no documentados.', null)
on conflict (entity_id) do nothing;

-- 4 · Publicación de entidades y relaciones
update public.entities set status = 'published' where status = 'draft' and id in ('47db4c8f-a4af-4733-8099-d39754cb57b3',
  '7a5c0e05-2026-4012-8000-0000000005d1', '7a5c0e05-2026-4012-8000-0000000005d2');
insert into public.brotherhood_images (id, brotherhood_entity_id, image_entity_id, relation_type, status) values
 ('7a5c0e05-2026-4012-8000-0000000005d3', '47db4c8f-a4af-4733-8099-d39754cb57b3', '7a5c0e05-2026-4012-8000-0000000005d1', 'titular', 'published')
on conflict (id) do nothing;
insert into public.brotherhood_steps (id, brotherhood_entity_id, step_entity_id, relation_type, status) values
 ('7a5c0e05-2026-4012-8000-0000000005d4', '47db4c8f-a4af-4733-8099-d39754cb57b3', '7a5c0e05-2026-4012-8000-0000000005d2', 'processional_step', 'published')
on conflict (id) do nothing;
insert into public.image_steps (id, image_entity_id, step_entity_id, relation_type, status) values
 ('7a5c0e05-2026-4012-8000-0000000005d5', '7a5c0e05-2026-4012-8000-0000000005d1', '7a5c0e05-2026-4012-8000-0000000005d2', 'processes_on', 'published')
on conflict (id) do nothing;

-- 5 · Música: Las Nieves de Olivares tras el paso, desde 2022
update public.music_accompaniment_periods set step_entity_id = '7a5c0e05-2026-4012-8000-0000000005d2',
  public_step_name = 'Paso de la Divina Pastora de las Almas Coronada'
where id = '031533f0-1f83-409f-b4cd-d7765999efa8' and step_entity_id is null;

-- 6 · Fuentes
insert into public.source_links (source_id, entity_id, brotherhood_step_id, image_step_id, music_accompaniment_period_id, scope)
select v.s, v.e, v.bs, v.isx, v.p, 'Documentación de la Divina Pastora de Capuchinos' from (values
  ('7a5c0e05-2026-4012-8000-00000000ca18'::uuid, '47db4c8f-a4af-4733-8099-d39754cb57b3'::uuid, null::uuid, null::uuid, null::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca18'::uuid, '7a5c0e05-2026-4012-8000-0000000005d1'::uuid, null::uuid, null::uuid, null::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca19'::uuid, '7a5c0e05-2026-4012-8000-0000000005d1'::uuid, null::uuid, null::uuid, null::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca20'::uuid, '7a5c0e05-2026-4012-8000-0000000005d1'::uuid, null::uuid, null::uuid, null::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca21'::uuid, '7a5c0e05-2026-4012-8000-0000000005d2'::uuid, null::uuid, null::uuid, null::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca21'::uuid, null::uuid, '7a5c0e05-2026-4012-8000-0000000005d4'::uuid, null::uuid, null::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca21'::uuid, null::uuid, null::uuid, '7a5c0e05-2026-4012-8000-0000000005d5'::uuid, null::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca20'::uuid, null::uuid, null::uuid, null::uuid, '031533f0-1f83-409f-b4cd-d7765999efa8'::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca21'::uuid, null::uuid, null::uuid, null::uuid, '031533f0-1f83-409f-b4cd-d7765999efa8'::uuid)
) v(s, e, bs, isx, p)
where not exists (select 1 from public.source_links x where x.source_id = v.s and x.entity_id is not distinct from v.e
  and x.brotherhood_step_id is not distinct from v.bs and x.image_step_id is not distinct from v.isx
  and x.music_accompaniment_period_id is not distinct from v.p);
