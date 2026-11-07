-- Vírgenes Coronadas · coronaciones fijadas para 2026, 2027 y 2028 (07/11/2026)
-- Autorizado por Nacho el 07/11/2026 («También hay que sumar las próximas
-- coronaciones fijadas tanto para 2026, 2027 y 2028»). Solo DML. Idempotente.
-- Aplicado en producción el 07/11/2026 (hora de Madrid) por SQL directo. Verificado:
-- 9 coronaciones nuevas (1 celebrada, 8 anunciadas), 4 imágenes en revisión,
-- municipio de Peñaflor y Gerena pasada a announced.
--
-- Criterio: una coronación se carga como celebrada (held) solo con constancia
-- posterior al acto; si no, queda anunciada (announced), aunque la fecha haya
-- pasado. Así quedan La Roda (20/06/2026), Gerena (12/09/2026) y Utrera
-- (03/10/2026). Gerena se había cargado como held en el lote anterior con una
-- noticia del mismo día: se corrige a announced (estado previo: held).
--
-- Imágenes sin ficha en Hilo (Villadiego, Esperanza de La Roda, Remedios de
-- Los Palacios y Dolores de Guillena): se crean con status 'review' y solo el
-- nombre y el tipo; no generan página pública hasta completarlas.
-- Se crea el municipio de Peñaflor, que no existía.
--
-- Recuperación:
--   delete from public.entities where id::text like 'c0261107-c0e1-%' or id::text like 'c0261107-1a00-%';
--   delete from public.municipalities where slug = 'penaflor' and id = 'c0261107-3a00-4000-8000-000000000001';
--   update public.events set event_status = 'held' where entity_id = 'c0261107-c0e0-4000-8000-000000000024';

begin;

insert into public.municipalities (id, name, slug, province, autonomous_community, country)
select 'c0261107-3a00-4000-8000-000000000001', 'Peñaflor', 'penaflor', 'Sevilla', 'Andalucía', 'España'
where not exists (select 1 from public.municipalities where slug = 'penaflor');

-- Imágenes nuevas, en revisión
with new_images(id, slug, name, image_type) as (values
  ('c0261107-1a00-4000-8000-000000000001'::uuid, 'nuestra-senora-villadiego-penaflor', 'Nuestra Señora de Villadiego', 'Virgen de Gloria'),
  ('c0261107-1a00-4000-8000-000000000002'::uuid, 'virgen-esperanza-la-roda-de-andalucia', 'Nuestra Señora de la Esperanza', 'Virgen'),
  ('c0261107-1a00-4000-8000-000000000003'::uuid, 'maria-santisima-remedios-vera-cruz-los-palacios', 'María Santísima de los Remedios', 'Dolorosa'),
  ('c0261107-1a00-4000-8000-000000000004'::uuid, 'maria-santisima-dolores-vera-cruz-guillena', 'María Santísima de los Dolores', 'Dolorosa')
), ins as (
  insert into public.entities (id, entity_type, name, slug, status)
  select id, 'image', name, slug, 'review' from new_images
  where not exists (select 1 from public.entities e where e.id = new_images.id or e.slug = new_images.slug)
  returning id
)
insert into public.images (entity_id, image_type)
select n.id, n.image_type from new_images n join ins on ins.id = n.id;

-- Gerena: sin constancia posterior al acto, queda anunciada
update public.events set event_status = 'announced', updated_at = now()
where entity_id = 'c0261107-c0e0-4000-8000-000000000024' and event_status = 'held';

create temporary table tmp_coronaciones_anunciadas on commit drop as
select * from (values
  -- id, slug, nombre, tipo, fecha, texto, estado, imagen (slug), municipio, lugar, prelado
  ('c0261107-c0e1-4000-8000-000000000001'::uuid, 'coronacion-canonica-virgen-villadiego-2026', 'Coronación canónica de Nuestra Señora de Villadiego', 'Coronación canónica', '2026-05-09'::date, '9 de mayo de 2026', 'held', 'nuestra-senora-villadiego-penaflor', 'penaflor', null::text, 'jose-angel-saiz-meneses'),
  ('c0261107-c0e1-4000-8000-000000000002'::uuid, 'coronacion-canonica-esperanza-la-roda-2026', 'Coronación canónica de Nuestra Señora de la Esperanza de La Roda de Andalucía', 'Coronación canónica', '2026-06-20', '20 de junio de 2026', 'announced', 'virgen-esperanza-la-roda-de-andalucia', 'la-roda-de-andalucia', null, 'jose-angel-saiz-meneses'),
  ('c0261107-c0e1-4000-8000-000000000003'::uuid, 'coronacion-canonica-angustias-utrera-2026', 'Coronación canónica de Nuestra Señora de las Angustias de Utrera', 'Coronación canónica', '2026-10-03', '3 de octubre de 2026', 'announced', 'nuestra-senora-angustias-utrera', 'utrera', 'Plaza del Altozano', 'jose-angel-saiz-meneses'),
  ('c0261107-c0e1-4000-8000-000000000004'::uuid, 'coronacion-canonica-virgen-guaditoca-2027', 'Coronación canónica de Nuestra Señora de Guaditoca', 'Coronación canónica', '2027-07-03', '3 de julio de 2027', 'announced', 'nuestra-senora-guaditoca-guadalcanal', 'guadalcanal', 'Paseo del Palacio', 'jose-angel-saiz-meneses'),
  ('c0261107-c0e1-4000-8000-000000000005'::uuid, 'coronacion-canonica-piedad-sanlucar-la-mayor-2027', 'Coronación canónica de María Santísima de la Piedad de Sanlúcar la Mayor', 'Coronación canónica', '2027-09-25', '25 de septiembre de 2027', 'announced', 'maria-santisima-piedad-sanlucar-la-mayor', 'sanlucar-la-mayor', null, null),
  ('c0261107-c0e1-4000-8000-000000000006'::uuid, 'coronacion-canonica-remedios-los-palacios-2027', 'Coronación canónica de María Santísima de los Remedios de Los Palacios y Villafranca', 'Coronación canónica', '2027-10-23', '23 de octubre de 2027', 'announced', 'maria-santisima-remedios-vera-cruz-los-palacios', 'los-palacios-y-villafranca', null, 'jose-angel-saiz-meneses'),
  ('c0261107-c0e1-4000-8000-000000000007'::uuid, 'coronacion-canonica-nieves-olivares-2028', 'Coronación canónica de Santa María de las Nieves de Olivares', 'Coronación canónica', '2028-04-29', '29 de abril de 2028', 'announced', 'santa-maria-nieves-olivares', 'olivares', null, 'jose-angel-saiz-meneses'),
  ('c0261107-c0e1-4000-8000-000000000008'::uuid, 'coronacion-canonica-dolores-osuna-2028', 'Coronación canónica de Nuestra Madre y Señora de los Dolores de Osuna', 'Coronación canónica', '2028-06-10', '10 de junio de 2028', 'announced', 'virgen-dolores-servitas-osuna', 'osuna', null, null),
  ('c0261107-c0e1-4000-8000-000000000009'::uuid, 'coronacion-canonica-dolores-guillena-2028', 'Coronación canónica de María Santísima de los Dolores de Guillena', 'Coronación canónica', '2028-07-01', '1 de julio de 2028', 'announced', 'maria-santisima-dolores-vera-cruz-guillena', 'guillena', 'Plaza de España', 'jose-angel-saiz-meneses')
) as t(id, slug, name, event_type, event_date, event_date_text, event_status, image_slug, municipality_slug, location_text, prelate_slug);

insert into public.entities (id, entity_type, name, slug, status)
select n.id, 'event', n.name, n.slug, 'published'
from tmp_coronaciones_anunciadas n
where exists (select 1 from public.entities i where i.slug = n.image_slug and i.entity_type = 'image')
  and not exists (select 1 from public.entities e where e.id = n.id or e.slug = n.slug);

insert into public.events (entity_id, event_type, event_date, event_date_text, event_category, event_status,
                           brotherhood_entity_id, municipality_id, location_text, description)
select n.id, n.event_type, n.event_date, n.event_date_text, 'historical', n.event_status,
       b.brotherhood_entity_id, m.id, n.location_text, n.name || '.'
from tmp_coronaciones_anunciadas n
join public.entities ev on ev.id = n.id
join public.entities i on i.slug = n.image_slug and i.entity_type = 'image'
left join lateral (
  select bi.brotherhood_entity_id from public.brotherhood_images bi
  where bi.image_entity_id = i.id
  order by (lower(bi.relation_type) = 'titular') desc, bi.created_at
  limit 1
) b on true
left join public.municipalities m on m.slug = n.municipality_slug
where not exists (select 1 from public.events e where e.entity_id = n.id);

insert into public.entity_relations (source_entity_id, relation_type, target_entity_id, status, notes)
select n.id, 'involves', i.id, 'published', 'Imagen coronada'
from tmp_coronaciones_anunciadas n
join public.events ev on ev.entity_id = n.id
join public.entities i on i.slug = n.image_slug and i.entity_type = 'image'
where not exists (select 1 from public.entity_relations r where r.source_entity_id = n.id and r.target_entity_id = i.id and r.relation_type = 'involves');

insert into public.entity_relations (source_entity_id, relation_type, target_entity_id, status, notes)
select n.id, 'officiated_by', p.id, 'published', 'Prelado que impuso la corona'
from tmp_coronaciones_anunciadas n
join public.events ev on ev.entity_id = n.id
join public.entities p on p.slug = n.prelate_slug and p.entity_type = 'agent'
where n.prelate_slug is not null
  and not exists (select 1 from public.entity_relations r where r.source_entity_id = n.id and r.target_entity_id = p.id and r.relation_type = 'officiated_by');

with new_sources(name, url, source_type, author) as (values
  ('Las calles que vieron el martirio de Antonio Molle Lazo se vuelcan con la coronación de la Virgen de Villadiego', 'https://infovaticana.com/2026/05/10/las-calles-que-vieron-el-martirio-de-antonio-molle-lazo-se-vuelcan-con-la-coronacion-de-la-virgen-de-villadiego/', 'Prensa', 'Infovaticana'),
  ('Coronaciones canónicas (etiqueta)', 'https://www.archisevilla.org/tag/coronacion-canonica/', 'Fuente diocesana oficial', 'Archidiócesis de Sevilla'),
  ('Extraordinarias en Sevilla 2026: calendario completo de procesiones, vía crucis y coronaciones', 'https://cofradiastv.com/extraordinarias-en-sevilla-2026-calendario-completo-de-procesiones-via-crucis-y-coronaciones/', 'Medio cofrade', 'CofradiasTV'),
  ('La Ciudad de Utrera, madrina de la coronación de la Virgen de las Angustias', 'https://www.archisevilla.org/la-ciudad-de-utrera-madrina-de-la-coronacion-de-la-virgen-de-las-angustias/', 'Fuente diocesana oficial', 'Archidiócesis de Sevilla'),
  ('El arzobispo coronará a la Virgen de Guaditoca, patrona de Guadalcanal, el 3 de julio de 2027', 'https://www.archisevilla.org/el-arzobispo-coronara-a-la-virgen-de-guaditoca-patrona-de-guadalcanal-el-3-de-julio-de-2027/', 'Fuente diocesana oficial', 'Archidiócesis de Sevilla'),
  ('Anunciada la Coronación Canónica de la Virgen de la Piedad de Sanlúcar la Mayor', 'https://www.artesacro.org/Noticia/Ver/160961/provincia-anunciada-coronacion-canonica-virgen-piedad-sanlucar-mayor', 'Prensa cofrade', 'ArteSacro'),
  ('La coronación canónica de la Virgen de Los Remedios de Los Palacios y Villafranca será en octubre de 2027', 'https://www.archisevilla.org/la-coronacion-canonica-de-la-virgen-de-los-remedios-de-los-palacios-y-villafranca-sera-en-octubre-de-2027/', 'Fuente diocesana oficial', 'Archidiócesis de Sevilla'),
  ('El arzobispo anuncia la coronación canónica de la Virgen de las Nieves de Olivares', 'https://www.archisevilla.org/el-arzobispo-anuncia-la-coronacion-canonica-de-la-virgen-de-las-nieves-de-olivares/', 'Fuente diocesana oficial', 'Archidiócesis de Sevilla'),
  ('La Hermandad de los Dolores de Osuna llama a la unión y participación de todo el pueblo de cara a la Coronación Canónica en 2028', 'https://www.elpespunte.es/cofrade/hermandad-dolores-osuna-llama-union-participacion-todo-pueblo-cara-2028/20261106105130160630.html', 'Prensa cofrade', 'El Pespunte'),
  ('La Virgen de los Dolores de Guillena será coronada el 1 de julio de 2028', 'https://www.vivasevilla.es/articulo/sevilla/virgen-dolores-guillena-sera-coronada-1-julio-2028/20260706084027010038.html', 'Prensa', 'Viva Sevilla')
)
insert into public.sources (name, url, source_type, author_or_publisher, accessed_at)
select s.name, s.url, s.source_type, s.author, date '2026-11-07'
from new_sources s
where not exists (select 1 from public.sources x where x.url = s.url);

with event_sources(event_id, url) as (values
  ('c0261107-c0e1-4000-8000-000000000001'::uuid, 'https://infovaticana.com/2026/05/10/las-calles-que-vieron-el-martirio-de-antonio-molle-lazo-se-vuelcan-con-la-coronacion-de-la-virgen-de-villadiego/'),
  ('c0261107-c0e1-4000-8000-000000000002'::uuid, 'https://www.archisevilla.org/tag/coronacion-canonica/'),
  ('c0261107-c0e1-4000-8000-000000000002'::uuid, 'https://cofradiastv.com/extraordinarias-en-sevilla-2026-calendario-completo-de-procesiones-via-crucis-y-coronaciones/'),
  ('c0261107-c0e1-4000-8000-000000000003'::uuid, 'https://www.archisevilla.org/la-ciudad-de-utrera-madrina-de-la-coronacion-de-la-virgen-de-las-angustias/'),
  ('c0261107-c0e1-4000-8000-000000000004'::uuid, 'https://www.archisevilla.org/el-arzobispo-coronara-a-la-virgen-de-guaditoca-patrona-de-guadalcanal-el-3-de-julio-de-2027/'),
  ('c0261107-c0e1-4000-8000-000000000005'::uuid, 'https://www.artesacro.org/Noticia/Ver/160961/provincia-anunciada-coronacion-canonica-virgen-piedad-sanlucar-mayor'),
  ('c0261107-c0e1-4000-8000-000000000006'::uuid, 'https://www.archisevilla.org/la-coronacion-canonica-de-la-virgen-de-los-remedios-de-los-palacios-y-villafranca-sera-en-octubre-de-2027/'),
  ('c0261107-c0e1-4000-8000-000000000007'::uuid, 'https://www.archisevilla.org/el-arzobispo-anuncia-la-coronacion-canonica-de-la-virgen-de-las-nieves-de-olivares/'),
  ('c0261107-c0e1-4000-8000-000000000008'::uuid, 'https://www.elpespunte.es/cofrade/hermandad-dolores-osuna-llama-union-participacion-todo-pueblo-cara-2028/20261106105130160630.html'),
  ('c0261107-c0e1-4000-8000-000000000009'::uuid, 'https://www.vivasevilla.es/articulo/sevilla/virgen-dolores-guillena-sera-coronada-1-julio-2028/20260706084027010038.html')
)
insert into public.source_links (source_id, entity_id, scope, notes)
select s.id, es.event_id, 'Vírgenes Coronadas · fecha y prelado', null
from event_sources es
join public.events ev on ev.entity_id = es.event_id
join lateral (select id from public.sources where url = es.url order by created_at limit 1) s on true
where not exists (select 1 from public.source_links l where l.source_id = s.id and l.entity_id = es.event_id);

commit;
