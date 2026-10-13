-- Hermandad de la Humillación de Camas (12/10/2026). Propietario: «Vamos a continuar» (mismo criterio: completar y publicar).
-- Fuentes: Turismo Aljarafe, ArteSacro (2014) y revista «Camas Cofrade 2023» del Ayuntamiento de Camas.
-- Nombre oficial según «Camas Cofrade 2023» (Turismo Aljarafe recoge la denominación anterior de Agrupación Parroquial).
-- San Pedro se vincula como imagen secundaria del misterio (forma parte de la escena de las Negaciones).
-- No se crean la Inmaculada Concepción ni la Virgen Gloriosa: ninguna fuente las describe.
-- Los acompañamientos de 2023-2026 que no están en la base (Virgen de los Reyes, Cigarreras, Mairena) se proponen aparte, sin aplicar.
-- Reversión: humillacion-camas-rollback.sql.

-- 1 · Fuentes nuevas
insert into public.sources (id, name, url, source_type, author_or_publisher, accessed_at, notes) values
 ('7a5c0e05-2026-4012-8000-00000000ca25', 'Hermandad de la Humillación · Turismo Aljarafe',
  'https://turismo.aljarafe.com/recursos-turisticos/guias-turisticas/Hermandad-de-la-Humillacion.', 'Fuente institucional turística', 'Mancomunidad de Desarrollo y Fomento del Aljarafe', '2026-10-12',
  'Orígenes en 1991, Agrupación Parroquial en 2009, primera estación de penitencia en 2013. Soberano Poder (2006) y Humillación (2004), de Ángel Velázquez Vega. Dos pasos; salida el Sábado de Pasión.'),
 ('7a5c0e05-2026-4012-8000-00000000ca26', 'La Humillación de Camas estrenó la imagen de San Pedro en su paso de misterio',
  'https://www.artesacro.org/Noticia.asp?idreg=94562', 'Medio especializado', 'ArteSacro', '2026-10-12',
  'Publicado el 24/04/2014. San Pedro de Ángel Velázquez Vega, «autor de todas las imágenes de la Hermandad», estrenado en el paso de misterio el Sábado de Pasión.'),
 ('7a5c0e05-2026-4012-8000-00000000ca27', 'Camas Cofrade 2023',
  'https://www.camas.es/export/sites/camas/.galleries/documentos-noticias/camas-cofrade-2023.pdf', 'Documento municipal', 'Ayuntamiento de Camas', '2026-10-12',
  'Nombre oficial, dos pasos el Sábado de Pasión (17:00-00:30), Virgen de los Reyes tras el misterio y Cigarreras tras el palio en 2023.')
on conflict (id) do nothing;

-- 2 · Ficha de la Hermandad
update public.entities set summary = 'Hermandad de Jesús del Soberano Poder en las Negaciones de San Pedro y María Santísima de la Humillación, de Camas. Sale el Sábado de Pasión con paso de misterio y paso de palio.'
where id = 'c6100000-0000-4000-8000-000000000016' and summary is null;
update public.brotherhoods set official_name = 'Hermandad de la Inmaculada Concepción de María y Cofradía de Nazarenos de Jesús del Soberano Poder en las Negaciones de San Pedro y María Santísima de la Humillación',
  popular_name = 'Hermandad de la Humillación', brotherhood_types = array['Penitencia'], current_procession_day = 'Sábado de Pasión',
  notes = 'Orígenes en 1991; Agrupación Parroquial desde 2009; primera estación de penitencia en 2013. Todas sus imágenes son de Ángel Velázquez Vega.'
where entity_id = 'c6100000-0000-4000-8000-000000000016' and notes is null;

-- 3 · Imágenes y pasos
insert into public.entities (id, entity_type, name, slug, summary, status) values
 ('7a5c0e05-2026-4012-8000-0000000005f1', 'image', 'Nuestro Padre Jesús del Soberano Poder', 'soberano-poder-camas',
  'Cristo maniatado de Ángel Velázquez Vega (2006), en cedro. Titular de la Hermandad de la Humillación de Camas; preside el misterio de las Negaciones de San Pedro.', 'draft'),
 ('7a5c0e05-2026-4012-8000-0000000005f2', 'image', 'María Santísima de la Humillación', 'humillacion-camas',
  'Dolorosa de candelero de Ángel Velázquez Vega (2004). Titular de la Hermandad de la Humillación de Camas; sale bajo palio el Sábado de Pasión.', 'draft'),
 ('7a5c0e05-2026-4012-8000-0000000005f3', 'image', 'San Pedro', 'san-pedro-camas',
  'Imagen de Ángel Velázquez Vega para el misterio de las Negaciones de la Hermandad de la Humillación de Camas, estrenada en 2014.', 'draft'),
 ('7a5c0e05-2026-4012-8000-0000000005f4', 'step', 'Paso de misterio de las Negaciones de San Pedro', 'paso-misterio-negaciones-camas',
  'Paso de misterio de Jesús del Soberano Poder en las Negaciones de San Pedro, primer paso del Sábado de Pasión en Camas.', 'draft'),
 ('7a5c0e05-2026-4012-8000-0000000005f5', 'step', 'Paso de palio de María Santísima de la Humillación', 'paso-palio-humillacion-camas',
  'Paso de palio de la Virgen de la Humillación, segundo paso del Sábado de Pasión en Camas.', 'draft')
on conflict (id) do nothing;
insert into public.images (entity_id, image_type, description, execution_date_text) values
 ('7a5c0e05-2026-4012-8000-0000000005f1', 'Cautivo',
  'Obra de Ángel Velázquez Vega (Santiponce), 2006. Talla en cedro americano, de tamaño natural, que representa a Cristo maniatado, caminante y alicaído; policromía al óleo.', '2006'),
 ('7a5c0e05-2026-4012-8000-0000000005f2', 'Dolorosa de candelero',
  'Obra de Ángel Velázquez Vega, 2004. Imagen de candelero para vestir con manos y mascarilla talladas en cedro americano, inspirada en modelos de Castillo Lastrucci.', '2004'),
 ('7a5c0e05-2026-4012-8000-0000000005f3', 'Imagen secundaria de misterio',
  'Obra de Ángel Velázquez Vega, estrenada en el paso de misterio el Sábado de Pasión de 2014.', '2014')
on conflict (entity_id) do nothing;
insert into public.steps (entity_id, step_type, description, execution_date_text) values
 ('7a5c0e05-2026-4012-8000-0000000005f4', 'Paso de misterio', 'Misterio de las Negaciones de San Pedro. Autor y fecha no documentados.', null),
 ('7a5c0e05-2026-4012-8000-0000000005f5', 'Paso de palio', 'Autor y fecha no documentados.', null)
on conflict (entity_id) do nothing;

-- 4 · Publicación de entidades y relaciones
update public.entities set status = 'published' where status = 'draft' and id in ('c6100000-0000-4000-8000-000000000016',
  '7a5c0e05-2026-4012-8000-0000000005f1','7a5c0e05-2026-4012-8000-0000000005f2','7a5c0e05-2026-4012-8000-0000000005f3',
  '7a5c0e05-2026-4012-8000-0000000005f4','7a5c0e05-2026-4012-8000-0000000005f5');
insert into public.brotherhood_images (id, brotherhood_entity_id, image_entity_id, relation_type, status) values
 ('7a5c0e05-2026-4012-8000-0000000005f6', 'c6100000-0000-4000-8000-000000000016', '7a5c0e05-2026-4012-8000-0000000005f1', 'titular', 'published'),
 ('7a5c0e05-2026-4012-8000-0000000005f7', 'c6100000-0000-4000-8000-000000000016', '7a5c0e05-2026-4012-8000-0000000005f2', 'titular', 'published'),
 ('7a5c0e05-2026-4012-8000-0000000005f8', 'c6100000-0000-4000-8000-000000000016', '7a5c0e05-2026-4012-8000-0000000005f3', 'secondary_image', 'published')
on conflict (id) do nothing;
insert into public.brotherhood_steps (id, brotherhood_entity_id, step_entity_id, relation_type, status) values
 ('7a5c0e05-2026-4012-8000-0000000005f9', 'c6100000-0000-4000-8000-000000000016', '7a5c0e05-2026-4012-8000-0000000005f4', 'processional_step', 'published'),
 ('7a5c0e05-2026-4012-8000-0000000005fa', 'c6100000-0000-4000-8000-000000000016', '7a5c0e05-2026-4012-8000-0000000005f5', 'processional_step', 'published')
on conflict (id) do nothing;
insert into public.image_steps (id, image_entity_id, step_entity_id, relation_type, status) values
 ('7a5c0e05-2026-4012-8000-0000000005fb', '7a5c0e05-2026-4012-8000-0000000005f1', '7a5c0e05-2026-4012-8000-0000000005f4', 'processes_on', 'published'),
 ('7a5c0e05-2026-4012-8000-0000000005fc', '7a5c0e05-2026-4012-8000-0000000005f2', '7a5c0e05-2026-4012-8000-0000000005f5', 'processes_on', 'published'),
 ('7a5c0e05-2026-4012-8000-0000000005fd', '7a5c0e05-2026-4012-8000-0000000005f3', '7a5c0e05-2026-4012-8000-0000000005f4', 'processes_on', 'published')
on conflict (id) do nothing;

-- 5 · Música: Santa María Magdalena de Arahal tras el misterio, desde 2024
update public.music_accompaniment_periods set step_entity_id = '7a5c0e05-2026-4012-8000-0000000005f4',
  public_step_name = 'Paso de misterio de las Negaciones de San Pedro'
where id = '8a294ba7-a11f-4525-8cef-e7fd2ef6b38d' and step_entity_id is null;

-- 6 · Fuentes
insert into public.source_links (source_id, entity_id, brotherhood_step_id, image_step_id, scope)
select v.s, v.e, v.bs, v.isx, 'Documentación de la Hermandad de la Humillación de Camas' from (values
  ('7a5c0e05-2026-4012-8000-00000000ca25'::uuid, 'c6100000-0000-4000-8000-000000000016'::uuid, null::uuid, null::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca27'::uuid, 'c6100000-0000-4000-8000-000000000016'::uuid, null::uuid, null::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca25'::uuid, '7a5c0e05-2026-4012-8000-0000000005f1'::uuid, null::uuid, null::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca25'::uuid, '7a5c0e05-2026-4012-8000-0000000005f2'::uuid, null::uuid, null::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca26'::uuid, '7a5c0e05-2026-4012-8000-0000000005f3'::uuid, null::uuid, null::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca27'::uuid, '7a5c0e05-2026-4012-8000-0000000005f4'::uuid, null::uuid, null::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca27'::uuid, '7a5c0e05-2026-4012-8000-0000000005f5'::uuid, null::uuid, null::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca27'::uuid, null::uuid, '7a5c0e05-2026-4012-8000-0000000005f9'::uuid, null::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca27'::uuid, null::uuid, '7a5c0e05-2026-4012-8000-0000000005fa'::uuid, null::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca27'::uuid, null::uuid, null::uuid, '7a5c0e05-2026-4012-8000-0000000005fb'::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca27'::uuid, null::uuid, null::uuid, '7a5c0e05-2026-4012-8000-0000000005fc'::uuid),
  ('7a5c0e05-2026-4012-8000-00000000ca26'::uuid, null::uuid, null::uuid, '7a5c0e05-2026-4012-8000-0000000005fd'::uuid)
) v(s, e, bs, isx)
where not exists (select 1 from public.source_links x where x.source_id = v.s and x.entity_id is not distinct from v.e
  and x.brotherhood_step_id is not distinct from v.bs and x.image_step_id is not distinct from v.isx);

-- 7 · Confirmación del propietario (12/10/2026): «Actualmente toca A.M. Santa María Magdalena de Arahal tras el misterio».
insert into public.sources (id, name, url, source_type, author_or_publisher, accessed_at, notes) values
 ('7a5c0e05-2026-4012-8000-00000000ca28', 'Humillación de Camas · banda del misterio · confirmación editorial', null, 'Aportación directa', 'Dirección de Hilo Cofrade', '2026-10-12',
  'El propietario confirma el 12/10/2026 que actualmente acompaña al misterio la A.M. Santa María Magdalena de Arahal.')
on conflict (id) do nothing;
insert into public.source_links (source_id, music_accompaniment_period_id, scope)
select '7a5c0e05-2026-4012-8000-00000000ca28', '8a294ba7-a11f-4525-8cef-e7fd2ef6b38d', 'Confirmación editorial del acompañamiento vigente'
where not exists (select 1 from public.source_links where source_id = '7a5c0e05-2026-4012-8000-00000000ca28' and music_accompaniment_period_id = '8a294ba7-a11f-4525-8cef-e7fd2ef6b38d');

-- 8 · Confirmación del propietario (13/10/2026): «La A.M. Virgen de los Reyes deja el misterio en 2023 y en 2024 llega Santa María Magdalena de Arahal».
--     Periodo histórico nuevo. El año de inicio no está documentado: se deja como texto (sin inventar año).
insert into public.sources (id, name, url, source_type, author_or_publisher, accessed_at, notes) values
 ('7a5c0e05-2026-4012-8000-00000000ca29', 'Humillación de Camas · Virgen de los Reyes hasta 2023 · confirmación editorial', null, 'Aportación directa', 'Dirección de Hilo Cofrade', '2026-10-13',
  'El propietario confirma el 13/10/2026 que la A.M. Virgen de los Reyes deja el misterio en 2023 y que en 2024 llega Santa María Magdalena de Arahal.')
on conflict (id) do nothing;
insert into public.music_accompaniment_periods (id, brotherhood_entity_id, band_entity_id, step_entity_id, position, outing_type,
  date_from_text, date_to_text, year_to, is_current, notes, status, public_step_name, public_brotherhood_name, public_brotherhood_slug) values
 ('7a5c0e05-2026-4012-8000-0000000061a3', 'c6100000-0000-4000-8000-000000000016', 'b829bf98-78fa-4f0f-9aeb-cd965c779853', '7a5c0e05-2026-4012-8000-0000000005f4',
  'Tras el paso de misterio', 'Sábado de Pasión', 'Inicio no documentado · consta en 2023', 'Hasta el Sábado de Pasión de 2023', 2023, false,
  'Tras Nuestro Padre Jesús del Soberano Poder en las Negaciones de San Pedro. En 2024 le sucede Santa María Magdalena de Arahal.',
  'published', 'Paso de misterio de las Negaciones de San Pedro', 'Hermandad de la Humillación de Camas', 'hermandad-humillacion-camas')
on conflict (id) do nothing;
insert into public.source_links (source_id, music_accompaniment_period_id, scope)
select v.s, v.p, v.sc from (values
  ('7a5c0e05-2026-4012-8000-00000000ca27'::uuid, '7a5c0e05-2026-4012-8000-0000000061a3'::uuid, 'Camas Cofrade 2023: Virgen de los Reyes tras el misterio'),
  ('7a5c0e05-2026-4012-8000-00000000ca29'::uuid, '7a5c0e05-2026-4012-8000-0000000061a3'::uuid, 'Confirmación editorial del fin del acompañamiento en 2023'),
  ('7a5c0e05-2026-4012-8000-00000000ca29'::uuid, '8a294ba7-a11f-4525-8cef-e7fd2ef6b38d'::uuid, 'Confirmación editorial del inicio en 2024')
) v(s, p, sc)
where not exists (select 1 from public.source_links x where x.source_id = v.s and x.music_accompaniment_period_id = v.p);

-- 9 · Confirmación del propietario (13/10/2026): «El primer año de Mairena ha sido en 2026 aunque se firma al final de 2025».
insert into public.sources (id, name, url, source_type, author_or_publisher, accessed_at, notes) values
 ('7a5c0e05-2026-4012-8000-00000000ca30', 'Humillación de Camas · Mairena del Alcor en el palio desde 2026 · confirmación editorial', null, 'Aportación directa', 'Dirección de Hilo Cofrade', '2026-10-13',
  'El propietario confirma el 13/10/2026 que el primer año de la Banda de Mairena del Alcor tras el palio fue 2026, aunque se firmó a finales de 2025.')
on conflict (id) do nothing;
insert into public.music_accompaniment_periods (id, brotherhood_entity_id, band_entity_id, step_entity_id, position, outing_type,
  date_from_text, year_from, is_current, notes, status, public_step_name, public_brotherhood_name, public_brotherhood_slug) values
 ('7a5c0e05-2026-4012-8000-0000000061a4', 'c6100000-0000-4000-8000-000000000016', 'd6852052-92bb-4b54-b551-e52b656dea6d', '7a5c0e05-2026-4012-8000-0000000005f5',
  'Tras el paso de palio', 'Sábado de Pasión', 'Desde el Sábado de Pasión de 2026 · firmado en diciembre de 2025', 2026, true,
  'Tras María Santísima de la Humillación. Duración del contrato no documentada.',
  'published', 'Paso de palio de María Santísima de la Humillación', 'Hermandad de la Humillación de Camas', 'hermandad-humillacion-camas')
on conflict (id) do nothing;
insert into public.source_links (source_id, music_accompaniment_period_id, scope)
select v.s, '7a5c0e05-2026-4012-8000-0000000061a4'::uuid, v.sc from (values
  ('19b23e24-b3cf-4bea-b14b-bc061bcba2d7'::uuid, 'El Pespunte (12/12/2025): firma de Mairena del Alcor para el palio'),
  ('7a5c0e05-2026-4012-8000-00000000ca30'::uuid, 'Confirmación editorial del primer año (2026)')) v(s, sc)
where not exists (select 1 from public.source_links x where x.source_id = v.s and x.music_accompaniment_period_id = '7a5c0e05-2026-4012-8000-0000000061a4');
