-- Santísimo Cristo del Amor en su Entrada Triunfal en Jerusalén · Huévar del Aljarafe (12/10/2026).
-- Propietario: «Hazlo todo» (completar y publicar). Fuentes: ArteSacro 2026 y 2025.
-- Reversión: cristo-amor-huevar-rollback.sql.
-- Nota: el registro la llamaba «Asociación (de Fieles Devotos)»; ArteSacro (abril de 2026) la denomina Agrupación Parroquial.

-- 1 · Fuentes
insert into public.sources (id, name, url, source_type, author_or_publisher, accessed_at, publication_date, notes) values
 ('7a5c0e05-2026-4012-8000-00000000ca15', 'El Domingo de Ramos, la Borriquita abre la Semana Santa de Huévar del Aljarafe', 'https://www.artesacro.org/Noticia.asp?idreg=167374',
  'Prensa cofrade', 'ArteSacro', '2026-10-12', '2026-04-08',
  'Agrupación Parroquial del Santísimo Cristo del Amor en su Entrada Triunfal en Jerusalén; sede en la parroquia de Nuestra Señora de la Asunción; Cristo de los Talleres de Olot (finales del siglo XX); A.M. Nuestro Padre Jesús de la Redención.'),
 ('7a5c0e05-2026-4012-8000-00000000ca16', 'Domingo de Ramos en Huévar del Aljarafe', 'https://www.artesacro.org/Noticia/Ver/161370/provincia-domingo-ramos-huevar-aljarafe',
  'Prensa cofrade', 'ArteSacro', '2026-10-12', '2025-04-24',
  'Un único paso con la Entrada Triunfal, obra de los talleres de Olot, que llegó a Huévar en 1993.')
on conflict (id) do nothing;

-- 2 · Ficha de la Agrupación
update public.entities set name = 'Agrupación Parroquial del Santísimo Cristo del Amor de Huévar del Aljarafe',
  summary = 'Agrupación Parroquial del Santísimo Cristo del Amor en su Entrada Triunfal en Jerusalén, con sede en la parroquia de Nuestra Señora de la Asunción de Huévar del Aljarafe. Abre la Semana Santa del pueblo el Domingo de Ramos.'
where id = 'f800d9c7-547e-41aa-bb57-09e029ee9085' and name = 'Asociación del Santísimo Cristo del Amor de Huévar del Aljarafe';
update public.brotherhoods set official_name = 'Agrupación Parroquial del Santísimo Cristo del Amor en su Entrada Triunfal en Jerusalén',
  popular_name = 'La Borriquita de Huévar', brotherhood_types = array['Agrupación Parroquial','Penitencia'],
  notes = 'Sede: parroquia de Nuestra Señora de la Asunción. Antes registrada como Asociación de Fieles Devotos. Sale el Domingo de Ramos.'
where entity_id = 'f800d9c7-547e-41aa-bb57-09e029ee9085' and notes is null;

-- 3 · Imagen y paso
insert into public.entities (id, entity_type, name, slug, summary, status) values
 ('7a5c0e05-2026-4012-8000-0000000005b1', 'image', 'Santísimo Cristo del Amor en su Entrada Triunfal en Jerusalén', 'santisimo-cristo-amor-huevar-aljarafe',
  'Imagen de los Talleres de Olot (finales del siglo XX), titular de la Agrupación Parroquial de Huévar del Aljarafe. Sale el Domingo de Ramos.', 'draft'),
 ('7a5c0e05-2026-4012-8000-0000000005b2', 'step', 'Paso de la Entrada Triunfal en Jerusalén', 'paso-entrada-triunfal-huevar-aljarafe',
  'Único paso de la Agrupación: la Entrada Triunfal en Jerusalén, obra de los talleres de Olot, que llegó a Huévar en 1993.', 'draft')
on conflict (id) do nothing;
insert into public.images (entity_id, image_type, description, execution_date_text) values
 ('7a5c0e05-2026-4012-8000-0000000005b1', 'Cristo · Entrada en Jerusalén', 'Obra de los Talleres de Olot, de finales del siglo XX. Preside el paso de la Entrada Triunfal, que llegó a Huévar en 1993.', 'Finales del siglo XX')
on conflict (entity_id) do nothing;
insert into public.steps (entity_id, step_type, description, execution_date_text) values
 ('7a5c0e05-2026-4012-8000-0000000005b2', 'Paso de misterio', 'Escena de la Entrada Triunfal en Jerusalén, obra de los talleres de Olot. Llegó a Huévar del Aljarafe en 1993.', '1993 (llegada a Huévar)')
on conflict (entity_id) do nothing;

-- 4 · Publicación (entidades) y relaciones publicadas
update public.entities set status = 'published' where status = 'draft'
  and id in ('f800d9c7-547e-41aa-bb57-09e029ee9085', '7a5c0e05-2026-4012-8000-0000000005b1', '7a5c0e05-2026-4012-8000-0000000005b2');
insert into public.brotherhood_images (id, brotherhood_entity_id, image_entity_id, relation_type, status) values
 ('7a5c0e05-2026-4012-8000-0000000005b3', 'f800d9c7-547e-41aa-bb57-09e029ee9085', '7a5c0e05-2026-4012-8000-0000000005b1', 'titular', 'published')
on conflict (id) do nothing;
insert into public.brotherhood_steps (id, brotherhood_entity_id, step_entity_id, relation_type, status) values
 ('7a5c0e05-2026-4012-8000-0000000005b4', 'f800d9c7-547e-41aa-bb57-09e029ee9085', '7a5c0e05-2026-4012-8000-0000000005b2', 'processional_step', 'published')
on conflict (id) do nothing;
insert into public.image_steps (id, image_entity_id, step_entity_id, relation_type, status) values
 ('7a5c0e05-2026-4012-8000-0000000005b5', '7a5c0e05-2026-4012-8000-0000000005b1', '7a5c0e05-2026-4012-8000-0000000005b2', 'processes_on', 'published')
on conflict (id) do nothing;

-- 5 · Música: La Redención (A.M. Nuestro Padre Jesús de la Redención), confirmada en 2026, al paso
update public.music_accompaniment_periods set step_entity_id = '7a5c0e05-2026-4012-8000-0000000005b2',
  public_step_name = 'Paso de la Entrada Triunfal en Jerusalén',
  public_brotherhood_name = 'Agrupación Parroquial del Santísimo Cristo del Amor de Huévar del Aljarafe'
where id = 'e657ac93-ed8f-45a4-9e51-8c190354e3e3' and step_entity_id is null;

-- 6 · Enlaces a fuentes
insert into public.source_links (source_id, entity_id, brotherhood_step_id, image_step_id, music_accompaniment_period_id, scope)
select v.s, v.e, v.bs, v.isx, v.p, 'Documentación de la Borriquita de Huévar' from (values
  ('7a5c0e05-2026-4012-8000-00000000ca15'::uuid, 'f800d9c7-547e-41aa-bb57-09e029ee9085'::uuid, null::uuid, null::uuid, null::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca15'::uuid, '7a5c0e05-2026-4012-8000-0000000005b1'::uuid, null::uuid, null::uuid, null::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca16'::uuid, '7a5c0e05-2026-4012-8000-0000000005b2'::uuid, null::uuid, null::uuid, null::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca16'::uuid, null::uuid, '7a5c0e05-2026-4012-8000-0000000005b4'::uuid, null::uuid, null::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca16'::uuid, null::uuid, null::uuid, '7a5c0e05-2026-4012-8000-0000000005b5'::uuid, null::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca15'::uuid, null::uuid, null::uuid, null::uuid, 'e657ac93-ed8f-45a4-9e51-8c190354e3e3'::uuid)
) v(s, e, bs, isx, p)
where not exists (select 1 from public.source_links x where x.source_id = v.s and x.entity_id is not distinct from v.e
  and x.brotherhood_step_id is not distinct from v.bs and x.image_step_id is not distinct from v.isx and x.music_accompaniment_period_id is not distinct from v.p);
