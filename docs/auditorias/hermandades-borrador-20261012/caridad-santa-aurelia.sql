-- Agrupación Parroquial María Santísima de la Caridad (San Lucas Evangelista, Santa Aurelia, Sevilla) · 12/10/2026.
-- Encargo del propietario: completar la ficha. Todo en BORRADOR hasta su autorización para publicar.
-- Fuentes: Banda Las Nieves de Olivares (subpágina de la Agrupación) e Inri Información (2022).
-- Reversión: caridad-santa-aurelia-rollback.sql.

insert into public.sources (id, name, url, source_type, author_or_publisher, accessed_at, publication_date, notes) values
 ('7a5c0e05-2026-4012-8000-00000000ca13', 'Agrupación Parroquial María Santísima de la Caridad · Banda Las Nieves de Olivares',
  'https://lasnievesdeolivares.com/agrupacion-parroquial-maria-santisima-de-la-caridad/', 'Web oficial', 'A.M. Las Nieves de Olivares', '2026-10-12', null,
  'Sede en la parroquia de San Lucas Evangelista (Santa Aurelia). Imagen de Antonio Joaquín Dubé de Luque (1998). Sale el quinto sábado de Cuaresma. La banda acompaña desde 2025.'),
 ('7a5c0e05-2026-4012-8000-00000000ca14', 'La Virgen de la Caridad de San Lucas hará su salida procesional por Santa Aurelia',
  'https://inriinformacion.com/2022/04/02/la-virgen-de-la-caridad-de-san-lucas-hara-su-salida-procesional-por-santa-aurelia/', 'Prensa cofrade', 'Inri Información', '2026-10-12', '2022-04-02',
  'Primera procesión como grupo de fieles (2 de abril de 2022), bajo palio, con la Banda de Música del Maestro Tejera. Data la imagen en 2008.')
on conflict (id) do nothing;

update public.entities set summary = 'Agrupación parroquial de María Santísima de la Caridad, con sede en la parroquia de San Lucas Evangelista del barrio de Santa Aurelia (Sevilla). Sale bajo palio el quinto sábado de Cuaresma.'
where id = '75c1871f-fe7e-4ed3-b6a6-6d8a257add62' and summary = 'Agrupación parroquial de Santa Aurelia, Sevilla.';
update public.brotherhoods set official_name = 'Agrupación Parroquial María Santísima de la Caridad', neighborhood = 'Santa Aurelia',
  brotherhood_types = array['Agrupación Parroquial','Penitencia'],
  notes = 'Sede: parroquia de San Lucas Evangelista. Grupo de fieles en 2020; primera procesión en 2022. Sale el quinto sábado de Cuaresma.'
where entity_id = '75c1871f-fe7e-4ed3-b6a6-6d8a257add62' and notes is null;

insert into public.entities (id, entity_type, name, slug, summary, status) values
 ('7a5c0e05-2026-4012-8000-0000000059a1', 'image', 'María Santísima de la Caridad', 'caridad-santa-aurelia-sevilla',
  'Dolorosa de Antonio Joaquín Dubé de Luque, titular de la Agrupación Parroquial de la parroquia de San Lucas Evangelista (Santa Aurelia, Sevilla). La banda Las Nieves de Olivares la data en 1998 e Inri Información, en 2008.', 'draft'),
 ('7a5c0e05-2026-4012-8000-0000000059b1', 'step', 'Paso de palio de María Santísima de la Caridad', 'paso-palio-caridad-santa-aurelia-sevilla',
  'Paso de palio en el que María Santísima de la Caridad sale el quinto sábado de Cuaresma por Santa Aurelia.', 'draft')
on conflict (id) do nothing;
insert into public.images (entity_id, image_type, description, execution_date_text) values
 ('7a5c0e05-2026-4012-8000-0000000059a1', 'Dolorosa',
  'Obra de Antonio Joaquín Dubé de Luque. Las fuentes no coinciden en la fecha: 1998 según la banda Las Nieves de Olivares y 2008 según Inri Información.', '1998 o 2008 (fuentes discrepantes)')
on conflict (entity_id) do nothing;
insert into public.steps (entity_id, step_type, description) values
 ('7a5c0e05-2026-4012-8000-0000000059b1', 'Paso de palio', 'La Virgen sale bajo palio desde su primera procesión, el 2 de abril de 2022.')
on conflict (entity_id) do nothing;
insert into public.brotherhood_images (id, brotherhood_entity_id, image_entity_id, relation_type, status) values
 ('7a5c0e05-2026-4012-8000-0000000059c1', '75c1871f-fe7e-4ed3-b6a6-6d8a257add62', '7a5c0e05-2026-4012-8000-0000000059a1', 'titular', 'draft')
on conflict (id) do nothing;
insert into public.brotherhood_steps (id, brotherhood_entity_id, step_entity_id, relation_type, status) values
 ('7a5c0e05-2026-4012-8000-0000000059d1', '75c1871f-fe7e-4ed3-b6a6-6d8a257add62', '7a5c0e05-2026-4012-8000-0000000059b1', 'processional_step', 'draft')
on conflict (id) do nothing;
insert into public.image_steps (id, image_entity_id, step_entity_id, relation_type, status) values
 ('7a5c0e05-2026-4012-8000-0000000059e1', '7a5c0e05-2026-4012-8000-0000000059a1', '7a5c0e05-2026-4012-8000-0000000059b1', 'processes_on', 'draft')
on conflict (id) do nothing;

-- Música: Las Nieves de Olivares (vigente desde 2025) → paso de palio; Maestro Tejera en 2022 (histórico documentado).
update public.music_accompaniment_periods set step_entity_id = '7a5c0e05-2026-4012-8000-0000000059b1',
  public_step_name = 'Paso de palio de María Santísima de la Caridad', position = 'Tras el paso de palio'
where id = '6ecae90c-effb-46c3-a3d3-69571760ded7' and step_entity_id is null;
insert into public.music_accompaniment_periods (id, brotherhood_entity_id, band_entity_id, step_entity_id, position, outing_type, is_current,
  year_from, year_to, date_from_text, notes, status, public_band_name, public_brotherhood_name, public_brotherhood_slug, public_step_name)
values ('7a5c0e05-2026-4012-8000-0000000059f1', '75c1871f-fe7e-4ed3-b6a6-6d8a257add62', 'e1fe592f-c67d-42c3-9f2f-67137ef629ec',
  '7a5c0e05-2026-4012-8000-0000000059b1', 'Tras el paso de palio', 'Procesión penitencial', false, 2022, 2022, '2022',
  'Primera procesión de la Virgen (2 de abril de 2022).', 'published', 'Maestro Tejera',
  'Agrupación Parroquial María Santísima de la Caridad de Santa Aurelia', 'agrupacion-parroquial-caridad-santa-aurelia-sevilla',
  'Paso de palio de María Santísima de la Caridad')
on conflict (id) do nothing;

insert into public.source_links (source_id, entity_id, brotherhood_step_id, image_step_id, music_accompaniment_period_id, scope)
select v.s, v.e, v.bs, v.isx, v.p, 'Documentación de la Agrupación de la Caridad' from (values
  ('7a5c0e05-2026-4012-8000-00000000ca13'::uuid, '75c1871f-fe7e-4ed3-b6a6-6d8a257add62'::uuid, null::uuid, null::uuid, null::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca13'::uuid, '7a5c0e05-2026-4012-8000-0000000059a1'::uuid, null::uuid, null::uuid, null::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca14'::uuid, '7a5c0e05-2026-4012-8000-0000000059a1'::uuid, null::uuid, null::uuid, null::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca14'::uuid, '7a5c0e05-2026-4012-8000-0000000059b1'::uuid, null::uuid, null::uuid, null::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca14'::uuid, null::uuid, '7a5c0e05-2026-4012-8000-0000000059d1'::uuid, null::uuid, null::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca14'::uuid, null::uuid, null::uuid, '7a5c0e05-2026-4012-8000-0000000059e1'::uuid, null::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca13'::uuid, null::uuid, null::uuid, null::uuid, '6ecae90c-effb-46c3-a3d3-69571760ded7'::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca14'::uuid, null::uuid, null::uuid, null::uuid, '7a5c0e05-2026-4012-8000-0000000059f1'::uuid)
) v(s, e, bs, isx, p)
where not exists (select 1 from public.source_links x where x.source_id = v.s and x.entity_id is not distinct from v.e
  and x.brotherhood_step_id is not distinct from v.bs and x.image_step_id is not distinct from v.isx and x.music_accompaniment_period_id is not distinct from v.p);
