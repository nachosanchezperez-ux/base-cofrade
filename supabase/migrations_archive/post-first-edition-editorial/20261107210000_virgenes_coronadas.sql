-- Vírgenes Coronadas de la provincia de Sevilla · carga editorial (07/11/2026)
-- PENDIENTE DE AUTORIZACIÓN. No aplicar sin la orden expresa de Nacho.
-- Solo DML, sin DDL. Idempotente: puede ejecutarse dos veces sin duplicar nada.
--
-- Qué hace
--   A. Da de alta como agentes (personas) a los seis prelados que coronaron.
--   B. Unifica el tipo de los acontecimientos de coronación ya cargados
--      (había «Coronación», «Coronación canónica» y «Coronación Canónica») y
--      completa la fecha estructurada de los que solo la tenían en texto.
--      Corrige una fecha: Santa Genoveva, 15/08/1997 (constaba 23/09/1997;
--      Wikipedia y cofradiasyhermandades.es coinciden en el 15 de agosto).
--   C. Enlaza cada coronación con su imagen (involves) y con su prelado
--      (officiated_by) cuando la fuente lo indica.
--   D. Crea las coronaciones documentadas que faltaban (23 acontecimientos).
--   E. Registra las fuentes de lo nuevo.
--
-- Datos con solo el año (sin día): Trinidad 2006, Divina Pastora de
-- Capuchinos 1921/2004 y Soledad de Cantillana 2024; proceden de las fichas de
-- imagen ya publicadas en Hilo Cofrade. Sin prelado cuando la fuente no lo dice.
--
-- Recuperación
--   · Copia de los 34 acontecimientos tocados en el bloque B, con su tipo y
--     fecha previos: doc del proyecto claude/backup-coronaciones-2026-11-07.json.
--     update public.events set event_type = <previo>, event_date = <previo>,
--       event_date_text = <previo> where entity_id = <id>;
--   · Lo nuevo cuelga de IDs con prefijo c0261107-: borrar esas entidades
--     elimina en cascada sus events, agents, agent_roles y relaciones:
--     delete from public.entities where id::text like 'c0261107-%';
--   · Relaciones añadidas a acontecimientos ya existentes:
--     delete from public.entity_relations where relation_type = 'officiated_by';
--     delete from public.entity_relations where relation_type = 'involves' and notes = 'Imagen coronada';
--     delete from public.source_links where scope = 'Vírgenes Coronadas · fecha y prelado';

begin;

-- ─────────────────────────────────────────────────────────────────────────
-- A. Prelados
-- ─────────────────────────────────────────────────────────────────────────
with prelates(id, slug, name, summary, role_name, date_from_text, date_to_text) as (values
  ('c0261107-0a00-4000-8000-000000000001'::uuid, 'ciriaco-maria-sancha-y-hervas', 'Ciriaco María Sancha y Hervás',
   'Arzobispo de Toledo y primado de España. Coronó a la Virgen de los Reyes en la Catedral de Sevilla en 1904.',
   'Arzobispo de Toledo y primado de España', '1898', '1909'),
  ('c0261107-0a00-4000-8000-000000000002'::uuid, 'pedro-segura-y-saenz', 'Pedro Segura y Sáenz',
   'Arzobispo de Sevilla entre 1937 y 1957.', 'Arzobispo de Sevilla', '1937', '1957'),
  ('c0261107-0a00-4000-8000-000000000003'::uuid, 'jose-maria-bueno-monreal', 'José María Bueno Monreal',
   'Arzobispo de Sevilla entre 1957 y 1982.', 'Arzobispo de Sevilla', '1957', '1982'),
  ('c0261107-0a00-4000-8000-000000000004'::uuid, 'carlos-amigo-vallejo', 'Carlos Amigo Vallejo',
   'Arzobispo de Sevilla entre 1982 y 2009.', 'Arzobispo de Sevilla', '1982', '2009'),
  ('c0261107-0a00-4000-8000-000000000005'::uuid, 'juan-jose-asenjo-pelegrina', 'Juan José Asenjo Pelegrina',
   'Arzobispo de Sevilla entre 2009 y 2021.', 'Arzobispo de Sevilla', '2009', '2021'),
  ('c0261107-0a00-4000-8000-000000000006'::uuid, 'jose-angel-saiz-meneses', 'José Ángel Saiz Meneses',
   'Arzobispo de Sevilla desde 2021.', 'Arzobispo de Sevilla', '2021', null)
), new_entities as (
  insert into public.entities (id, entity_type, name, slug, summary, status)
  select id, 'agent', name, slug, summary, 'published' from prelates
  where not exists (select 1 from public.entities e where e.slug = prelates.slug)
  returning id
), new_agents as (
  insert into public.agents (entity_id, agent_kind, description)
  select p.id, 'person', p.summary from prelates p join new_entities n on n.id = p.id
  returning entity_id
)
insert into public.agent_roles (agent_entity_id, role_name, date_from_text, date_to_text)
select p.id, p.role_name, p.date_from_text, p.date_to_text from prelates p join new_agents a on a.entity_id = p.id;

-- ─────────────────────────────────────────────────────────────────────────
-- B. Tipos y fechas de los acontecimientos ya cargados
-- ─────────────────────────────────────────────────────────────────────────
update public.events e set
  event_type = v.event_type,
  event_date = coalesce(v.event_date, e.event_date),
  event_date_text = coalesce(v.event_date_text, e.event_date_text),
  updated_at = now()
from (values
  ('15000000-0000-0000-0000-000000000002'::uuid, 'Coronación litúrgica', null::date, null::text),
  ('15000000-0000-0000-0000-000000000003'::uuid, 'Reconocimiento canónico de coronación', null, null),
  ('b838a5f1-1d9f-4718-a820-de94e485224a'::uuid, 'Coronación canónica', null, null),
  ('ddf4d5d7-4627-487a-b055-4c40c2436e61'::uuid, 'Coronación canónica', null, null),
  ('dbd612da-bf7b-4459-83c4-928ca5d75844'::uuid, 'Breve pontificio de coronación', null, null),
  ('449f7825-9ff7-4722-856d-8319c3fdd697'::uuid, 'Coronación litúrgica', null, null),
  ('47e6634f-1cd7-48a8-9e8e-9449b130b3c2'::uuid, 'Coronación canónica', null, null),
  ('24058506-cf30-4e83-bcc0-b390adbc8923'::uuid, 'Coronación canónica', null, null),
  ('c12d36e7-765d-4cb3-af03-bd037f22cc2b'::uuid, 'Coronación canónica', null, null),
  ('b1c686e5-9c91-4009-87d4-7d33c35924d8'::uuid, 'Reconocimiento canónico de coronación', null, null),
  ('bb9fae45-07fc-493e-a16d-d79b413d8096'::uuid, 'Coronación canónica', null, null),
  ('7efd07f7-d9cd-4322-be6f-0be4b579ec88'::uuid, 'Coronación canónica', null, null),
  ('d66c8bff-a89c-4ad0-8f25-d7c81df36a51'::uuid, 'Coronación canónica', null, null),
  ('3dedab6d-ac3f-48ae-bfd4-cd76cb53c432'::uuid, 'Coronación canónica', null, null),
  ('7e0df0bb-9a4e-4b0f-95c8-3a802ab5b129'::uuid, 'Coronación canónica', null, null),
  ('42fb9003-73d8-4dff-8ab6-f1ddb26177ac'::uuid, 'Coronación canónica', null, null),
  ('c1419d4b-2993-4a92-9abd-c36b7cd55ecb'::uuid, 'Coronación canónica', null, null),
  ('2ee6f0ce-0872-4a92-9b30-0dfe6948464a'::uuid, 'Coronación pontificia', null, null),
  ('07f9196a-08de-401f-a99c-f2ae34d30c33'::uuid, 'Coronación canónica', null, null),
  ('97eefe57-3dad-47d3-9121-9eef494745a9'::uuid, 'Coronación canónica', null, null),
  ('c0160800-c500-4000-8000-000000000004'::uuid, 'Coronación canónica', null, null),
  ('5f82f6c4-e961-43a2-9df9-f1017fd7b57f'::uuid, 'Coronación canónica', null, null),
  ('ce4c1b8f-9792-4e61-b682-4f2e895b60fc'::uuid, 'Coronación canónica', null, null),
  ('7831a96c-d237-4bd4-9cdc-fb897d399605'::uuid, 'Coronación canónica', null, null),
  ('880da4bd-fc09-4e1f-b977-5c0de063d0fb'::uuid, 'Inicio de expediente de coronación', null, null),
  ('18b13ead-e3e1-4b20-bbd3-7c15de05b2bd'::uuid, 'Coronación canónica', null, null),
  -- Hitos históricos que eran coronaciones: tipo y fecha estructurada.
  ('b418ca88-3d8f-4277-bfaf-6c9d7abb4908'::uuid, 'Coronación canónica', '1954-11-21', null),
  ('f9ce1568-5a3c-40f2-ab7b-108e463646f2'::uuid, 'Coronación canónica', '1984-06-02', null),
  ('6061d789-f693-4d1c-937f-5221e24125fe'::uuid, 'Coronación canónica', '1999-10-31', null),
  ('167bedc9-3225-4b34-b9db-3506b683a703'::uuid, 'Coronación canónica', '1974-05-23', null),
  ('320bc706-d3ef-444c-9cf9-82642445b0be'::uuid, 'Coronación canónica', '2005-10-08', null),
  ('9455fd18-6ef2-424d-8277-f7d6379a7021'::uuid, 'Coronación canónica', '2004-10-31', '31 de octubre de 2004'),
  ('766c32e9-1415-4520-95e5-6374ab858dff'::uuid, 'Coronación canónica', '2025-07-05', null),
  ('f3100d8d-3f74-4c4a-aaf2-7e8bc78b772a'::uuid, 'Reconocimiento canónico de coronación', '1997-08-15', '15 de agosto de 1997')
) as v(entity_id, event_type, event_date, event_date_text)
where e.entity_id = v.entity_id
  and (e.event_type is distinct from v.event_type
       or (v.event_date is not null and e.event_date is distinct from v.event_date));

-- ─────────────────────────────────────────────────────────────────────────
-- D. Coronaciones nuevas (entidad + acontecimiento)
--    Hermandad y municipio salen de la imagen; Reyes no tiene hermandad.
-- ─────────────────────────────────────────────────────────────────────────
create temporary table tmp_coronaciones_nuevas on commit drop as
select * from (values
  -- id, slug, nombre, tipo, fecha, texto de fecha, imagen (slug), municipio de respaldo, lugar
  ('c0261107-c0e0-4000-8000-000000000001'::uuid, 'coronacion-canonica-virgen-de-los-reyes-1904', 'Coronación canónica de la Virgen de los Reyes', 'Coronación canónica', '1904-12-04'::date, '4 de diciembre de 1904', 'nuestra-senora-reyes-patrona-sevilla', 'sevilla', 'Catedral de Sevilla'),
  ('c0261107-c0e0-4000-8000-000000000002'::uuid, 'coronacion-canonica-maria-auxiliadora-trinidad-1954', 'Coronación canónica de María Auxiliadora de la Trinidad', 'Coronación canónica', '1954-05-13', '13 de mayo de 1954', 'maria-auxiliadora-coronada-trinidad-sevilla', 'sevilla', null),
  ('c0261107-c0e0-4000-8000-000000000003'::uuid, 'coronacion-liturgica-gracia-esperanza-san-roque-1947', 'Coronación litúrgica de Nuestra Señora de Gracia y Esperanza', 'Coronación litúrgica', '1947-03-23', '23 de marzo de 1947', 'nuestra-senora-gracia-esperanza-san-roque', 'sevilla', null),
  ('c0261107-c0e0-4000-8000-000000000004'::uuid, 'reconocimiento-canonico-gracia-esperanza-san-roque-1997', 'Reconocimiento canónico de la coronación de Nuestra Señora de Gracia y Esperanza', 'Reconocimiento canónico de coronación', '1997-08-15', '15 de agosto de 1997', 'nuestra-senora-gracia-esperanza-san-roque', 'sevilla', null),
  ('c0261107-c0e0-4000-8000-000000000005'::uuid, 'coronacion-liturgica-mercedes-santa-genoveva-1972', 'Coronación litúrgica de Nuestra Señora de las Mercedes de Santa Genoveva', 'Coronación litúrgica', '1972-09-23', '23 de septiembre de 1972', 'nuestra-senora-mercedes-coronada-santa-genoveva', 'sevilla', null),
  ('c0261107-c0e0-4000-8000-000000000006'::uuid, 'coronacion-liturgica-mercedes-puerta-real-1972', 'Coronación litúrgica de Nuestra Señora de las Mercedes de la Puerta Real', 'Coronación litúrgica', '1972-09-24', '24 de septiembre de 1972', 'nuestra-senora-mercedes-coronada-puerta-real', 'sevilla', null),
  ('c0261107-c0e0-4000-8000-000000000007'::uuid, 'reconocimiento-canonico-mercedes-puerta-real-1998', 'Reconocimiento canónico de la coronación de Nuestra Señora de las Mercedes de la Puerta Real', 'Reconocimiento canónico de coronación', '1998-10-15', '15 de octubre de 1998', 'nuestra-senora-mercedes-coronada-puerta-real', 'sevilla', null),
  ('c0261107-c0e0-4000-8000-000000000008'::uuid, 'coronacion-liturgica-soledad-gerena-1974', 'Coronación litúrgica de Nuestra Señora de la Soledad de Gerena', 'Coronación litúrgica', '1974-09-01', '1 de septiembre de 1974', 'nuestra-senora-soledad-coronada-gerena', 'gerena', null),
  ('c0261107-c0e0-4000-8000-000000000009'::uuid, 'reconocimiento-canonico-soledad-gerena-1999', 'Reconocimiento canónico de la coronación de Nuestra Señora de la Soledad de Gerena', 'Reconocimiento canónico de coronación', '1999-06-29', '29 de junio de 1999', 'nuestra-senora-soledad-coronada-gerena', 'gerena', null),
  ('c0261107-c0e0-4000-8000-000000000010'::uuid, 'coronacion-canonica-virgen-de-valme-1973', 'Coronación canónica de Nuestra Señora de Valme', 'Coronación canónica', '1973-06-23', '23 de junio de 1973', 'nuestra-senora-valme-coronada-dos-hermanas', null, null),
  ('c0261107-c0e0-4000-8000-000000000011'::uuid, 'coronacion-canonica-maria-auxiliadora-utrera-1981', 'Coronación canónica de María Auxiliadora de Utrera', 'Coronación canónica', '1981-05-24', '24 de mayo de 1981', 'maria-auxiliadora-coronada-imagen-historica-maria-auxiliadora-adma-utrera', null, null),
  ('c0261107-c0e0-4000-8000-000000000012'::uuid, 'coronacion-canonica-dolores-la-roda-1991', 'Coronación canónica de María Santísima de los Dolores de La Roda de Andalucía', 'Coronación canónica', '1991-09-15', '15 de septiembre de 1991', 'maria-santisima-dolores-coronada-roda', null, null),
  ('c0261107-c0e0-4000-8000-000000000013'::uuid, 'coronacion-canonica-encarnacion-san-benito-1994', 'Coronación canónica de Nuestra Señora de la Encarnación de San Benito', 'Coronación canónica', '1994-12-10', '10 de diciembre de 1994', 'nuestra-senora-de-la-encarnacion-coronada', 'sevilla', null),
  ('c0261107-c0e0-4000-8000-000000000014'::uuid, 'coronacion-canonica-dolores-soledad-alcala-del-rio-1996', 'Coronación canónica de Nuestra Señora de los Dolores en su Soledad de Alcalá del Río', 'Coronación canónica', '1996-06-15', '15 de junio de 1996', 'dolores-soledad-alcala-del-rio', null, null),
  ('c0261107-c0e0-4000-8000-000000000015'::uuid, 'coronacion-canonica-virgen-del-aguila-2000', 'Coronación canónica de Santa María del Águila', 'Coronación canónica', '2000-06-03', '3 de junio de 2000', 'virgen-aguila-alcala-guadaira-aguila', null, null),
  ('c0261107-c0e0-4000-8000-000000000016'::uuid, 'coronacion-canonica-esperanza-trinidad-2006', 'Coronación canónica de Nuestra Señora de la Esperanza de la Trinidad', 'Coronación canónica', null, '2006', 'nuestra-senora-esperanza-coronada-trinidad-sevilla', 'sevilla', null),
  ('c0261107-c0e0-4000-8000-000000000017'::uuid, 'coronacion-canonica-virgen-de-la-o-2007', 'Coronación canónica de María Santísima de la O', 'Coronación canónica', '2007-06-02', '2 de junio de 2007', 'maria-santisima-o-coronada-sevilla', 'sevilla', null),
  ('c0261107-c0e0-4000-8000-000000000018'::uuid, 'coronacion-popular-divina-pastora-capuchinos-1921', 'Coronación de la Divina Pastora de Capuchinos', 'Coronación popular', null, '1921', 'divina-pastora-almas-capuchinos-sevilla', 'sevilla', null),
  ('c0261107-c0e0-4000-8000-000000000019'::uuid, 'coronacion-canonica-divina-pastora-capuchinos-2004', 'Coronación canónica de la Divina Pastora de Capuchinos', 'Coronación canónica', null, '2004', 'divina-pastora-almas-capuchinos-sevilla', 'sevilla', null),
  ('c0261107-c0e0-4000-8000-000000000020'::uuid, 'coronacion-canonica-inmaculada-castilleja-2013', 'Coronación canónica de la Inmaculada Concepción de Castilleja de la Cuesta', 'Coronación canónica', '2013-09-07', '7 de septiembre de 2013', 'inmaculada-concepcion-coronada-castilleja-cuesta', 'castilleja-de-la-cuesta', 'Jardines del Convento de las Madres Irlandesas'),
  ('c0261107-c0e0-4000-8000-000000000021'::uuid, 'coronacion-pontificia-virgen-de-los-angeles-2019', 'Coronación pontificia de Nuestra Señora de los Ángeles', 'Coronación pontificia', '2019-05-18', '18 de mayo de 2019', 'nuestra-senora-de-los-angeles-negritos', 'sevilla', null),
  ('c0261107-c0e0-4000-8000-000000000022'::uuid, 'coronacion-canonica-soledad-cantillana-2024', 'Coronación canónica de Nuestra Señora de la Soledad de Cantillana', 'Coronación canónica', null, '2024', 'nuestra-senora-soledad-coronada-cantillana', 'cantillana', null),
  ('c0261107-c0e0-4000-8000-000000000023'::uuid, 'coronacion-canonica-remedios-estepa-2025', 'Coronación canónica de Nuestra Señora de los Remedios de Estepa', 'Coronación canónica', '2025-05-03', '3 de mayo de 2025', 'nuestra-senora-remedios-coronada-estepa', 'estepa', null),
  ('c0261107-c0e0-4000-8000-000000000024'::uuid, 'coronacion-canonica-sangre-gerena-2026', 'Coronación canónica de María Santísima de la Sangre de Gerena', 'Coronación canónica', '2026-09-12', '12 de septiembre de 2026', 'maria-santisima-sangre-gerena', 'gerena', 'Plaza Fernández Velasco')
) as t(id, slug, name, event_type, event_date, event_date_text, image_slug, municipality_slug, location_text);

insert into public.entities (id, entity_type, name, slug, status)
select n.id, 'event', n.name, n.slug, 'published'
from tmp_coronaciones_nuevas n
where exists (select 1 from public.entities i where i.slug = n.image_slug and i.entity_type = 'image')
  and not exists (select 1 from public.entities e where e.id = n.id or e.slug = n.slug);

insert into public.events (entity_id, event_type, event_date, event_date_text, event_category, event_status,
                           brotherhood_entity_id, municipality_id, location_text, description)
select n.id, n.event_type, n.event_date, n.event_date_text, 'historical', 'held',
       b.brotherhood_entity_id,
       coalesce(bro.municipality_id, m.id),
       n.location_text,
       n.name || '.'
from tmp_coronaciones_nuevas n
join public.entities ev on ev.id = n.id
join public.entities i on i.slug = n.image_slug and i.entity_type = 'image'
left join lateral (
  select bi.brotherhood_entity_id from public.brotherhood_images bi
  where bi.image_entity_id = i.id
  order by (lower(bi.relation_type) = 'titular') desc, bi.created_at
  limit 1
) b on true
left join public.brotherhoods bro on bro.entity_id = b.brotherhood_entity_id
left join public.municipalities m on m.slug = n.municipality_slug
where not exists (select 1 from public.events e where e.entity_id = n.id);

-- ─────────────────────────────────────────────────────────────────────────
-- C. Relaciones: coronación → imagen y coronación → prelado
-- ─────────────────────────────────────────────────────────────────────────
with image_links(event_id, image_slug) as (values
  ('ddf4d5d7-4627-487a-b055-4c40c2436e61'::uuid, 'maria-santisima-esperanza-macarena'),
  ('449f7825-9ff7-4722-856d-8319c3fdd697'::uuid, 'maria-santisima-angustias-coronada-alcala-del-rio'),
  ('b1c686e5-9c91-4009-87d4-7d33c35924d8'::uuid, 'maria-santisima-angustias-coronada-alcala-del-rio'),
  ('3dedab6d-ac3f-48ae-bfd4-cd76cb53c432'::uuid, 'nuestra-senora-valle-sevilla'),
  ('97eefe57-3dad-47d3-9121-9eef494745a9'::uuid, 'maria-santisima-de-la-paz-sevilla'),
  ('c0160800-c500-4000-8000-000000000004'::uuid, 'nuestra-senora-salud-san-gonzalo'),
  ('c1419d4b-2993-4a92-9abd-c36b7cd55ecb'::uuid, 'maria-santisima-regla-coronada-panaderos'),
  ('b418ca88-3d8f-4277-bfaf-6c9d7abb4908'::uuid, 'maria-santisima-amargura-coronada'),
  ('f9ce1568-5a3c-40f2-ab7b-108e463646f2'::uuid, 'nuestra-senora-esperanza-triana'),
  ('6061d789-f693-4d1c-937f-5221e24125fe'::uuid, 'maria-santisima-estrella-sevilla'),
  ('167bedc9-3225-4b34-b9db-3506b683a703'::uuid, 'maria-santisima-hiniesta-gloriosa-coronada-sevilla'),
  ('320bc706-d3ef-444c-9cf9-82642445b0be'::uuid, 'nuestra-senora-palma-coronada-buen-fin-sevilla'),
  ('9455fd18-6ef2-424d-8277-f7d6379a7021'::uuid, 'maria-santisima-rosario-monte-sion-sevilla'),
  ('766c32e9-1415-4520-95e5-6374ab858dff'::uuid, 'maria-santisima-rocio-coronada-redencion'),
  ('f3100d8d-3f74-4c4a-aaf2-7e8bc78b772a'::uuid, 'nuestra-senora-mercedes-coronada-santa-genoveva')
), all_links as (
  select event_id, image_slug from image_links
  union all
  select id, image_slug from tmp_coronaciones_nuevas
)
insert into public.entity_relations (source_entity_id, relation_type, target_entity_id, status, notes)
select l.event_id, 'involves', i.id, 'published', 'Imagen coronada'
from all_links l
join public.events ev on ev.entity_id = l.event_id
join public.entities i on i.slug = l.image_slug and i.entity_type = 'image'
where not exists (
  select 1 from public.entity_relations r
  where r.source_entity_id = l.event_id and r.target_entity_id = i.id and r.relation_type = 'involves'
);

with officiants(event_id, prelate_slug) as (values
  -- Acontecimientos ya cargados (prelado según su descripción o la fuente citada)
  ('15000000-0000-0000-0000-000000000002'::uuid, 'jose-maria-bueno-monreal'),
  ('15000000-0000-0000-0000-000000000003'::uuid, 'carlos-amigo-vallejo'),
  ('b838a5f1-1d9f-4718-a820-de94e485224a'::uuid, 'jose-maria-bueno-monreal'),
  ('ddf4d5d7-4627-487a-b055-4c40c2436e61'::uuid, 'jose-maria-bueno-monreal'),
  ('449f7825-9ff7-4722-856d-8319c3fdd697'::uuid, 'jose-maria-bueno-monreal'),
  ('47e6634f-1cd7-48a8-9e8e-9449b130b3c2'::uuid, 'jose-maria-bueno-monreal'),
  ('24058506-cf30-4e83-bcc0-b390adbc8923'::uuid, 'carlos-amigo-vallejo'),
  ('c12d36e7-765d-4cb3-af03-bd037f22cc2b'::uuid, 'carlos-amigo-vallejo'),
  ('b1c686e5-9c91-4009-87d4-7d33c35924d8'::uuid, 'carlos-amigo-vallejo'),
  ('bb9fae45-07fc-493e-a16d-d79b413d8096'::uuid, 'carlos-amigo-vallejo'),
  ('7efd07f7-d9cd-4322-be6f-0be4b579ec88'::uuid, 'carlos-amigo-vallejo'),
  ('d66c8bff-a89c-4ad0-8f25-d7c81df36a51'::uuid, 'carlos-amigo-vallejo'),
  ('3dedab6d-ac3f-48ae-bfd4-cd76cb53c432'::uuid, 'carlos-amigo-vallejo'),
  ('7e0df0bb-9a4e-4b0f-95c8-3a802ab5b129'::uuid, 'carlos-amigo-vallejo'),
  ('42fb9003-73d8-4dff-8ab6-f1ddb26177ac'::uuid, 'carlos-amigo-vallejo'),
  ('c1419d4b-2993-4a92-9abd-c36b7cd55ecb'::uuid, 'juan-jose-asenjo-pelegrina'),
  ('c0160800-c500-4000-8000-000000000004'::uuid, 'juan-jose-asenjo-pelegrina'),
  ('5f82f6c4-e961-43a2-9df9-f1017fd7b57f'::uuid, 'juan-jose-asenjo-pelegrina'),
  ('7831a96c-d237-4bd4-9cdc-fb897d399605'::uuid, 'jose-angel-saiz-meneses'),
  ('18b13ead-e3e1-4b20-bbd3-7c15de05b2bd'::uuid, 'jose-angel-saiz-meneses'),
  ('b418ca88-3d8f-4277-bfaf-6c9d7abb4908'::uuid, 'pedro-segura-y-saenz'),
  ('f9ce1568-5a3c-40f2-ab7b-108e463646f2'::uuid, 'carlos-amigo-vallejo'),
  ('6061d789-f693-4d1c-937f-5221e24125fe'::uuid, 'carlos-amigo-vallejo'),
  ('167bedc9-3225-4b34-b9db-3506b683a703'::uuid, 'jose-maria-bueno-monreal'),
  ('320bc706-d3ef-444c-9cf9-82642445b0be'::uuid, 'carlos-amigo-vallejo'),
  ('766c32e9-1415-4520-95e5-6374ab858dff'::uuid, 'jose-angel-saiz-meneses'),
  ('f3100d8d-3f74-4c4a-aaf2-7e8bc78b772a'::uuid, 'carlos-amigo-vallejo'),
  -- Coronaciones nuevas
  ('c0261107-c0e0-4000-8000-000000000001'::uuid, 'ciriaco-maria-sancha-y-hervas'),
  ('c0261107-c0e0-4000-8000-000000000002'::uuid, 'pedro-segura-y-saenz'),
  ('c0261107-c0e0-4000-8000-000000000003'::uuid, 'pedro-segura-y-saenz'),
  ('c0261107-c0e0-4000-8000-000000000004'::uuid, 'carlos-amigo-vallejo'),
  ('c0261107-c0e0-4000-8000-000000000005'::uuid, 'jose-maria-bueno-monreal'),
  ('c0261107-c0e0-4000-8000-000000000006'::uuid, 'jose-maria-bueno-monreal'),
  ('c0261107-c0e0-4000-8000-000000000007'::uuid, 'carlos-amigo-vallejo'),
  ('c0261107-c0e0-4000-8000-000000000008'::uuid, 'jose-maria-bueno-monreal'),
  ('c0261107-c0e0-4000-8000-000000000009'::uuid, 'carlos-amigo-vallejo'),
  ('c0261107-c0e0-4000-8000-000000000010'::uuid, 'jose-maria-bueno-monreal'),
  ('c0261107-c0e0-4000-8000-000000000011'::uuid, 'jose-maria-bueno-monreal'),
  ('c0261107-c0e0-4000-8000-000000000012'::uuid, 'carlos-amigo-vallejo'),
  ('c0261107-c0e0-4000-8000-000000000013'::uuid, 'carlos-amigo-vallejo'),
  ('c0261107-c0e0-4000-8000-000000000014'::uuid, 'carlos-amigo-vallejo'),
  ('c0261107-c0e0-4000-8000-000000000015'::uuid, 'carlos-amigo-vallejo'),
  ('c0261107-c0e0-4000-8000-000000000024'::uuid, 'jose-angel-saiz-meneses')
)
insert into public.entity_relations (source_entity_id, relation_type, target_entity_id, status, notes)
select o.event_id, 'officiated_by', p.id, 'published', 'Prelado que impuso la corona'
from officiants o
join public.events ev on ev.entity_id = o.event_id
join public.entities p on p.slug = o.prelate_slug and p.entity_type = 'agent'
where not exists (
  select 1 from public.entity_relations r
  where r.source_entity_id = o.event_id and r.target_entity_id = p.id and r.relation_type = 'officiated_by'
);

-- ─────────────────────────────────────────────────────────────────────────
-- E. Fuentes de lo nuevo
-- ─────────────────────────────────────────────────────────────────────────
with new_sources(name, url, source_type, author) as (values
  ('Anexo: Advocaciones marianas coronadas canónicamente en España', 'https://es.wikipedia.org/wiki/Anexo:Advocaciones_marianas_coronadas_can%C3%B3nicamente_en_Espa%C3%B1a', 'Fuente secundaria', 'Wikipedia'),
  ('Anexo: Procesiones de la Semana Santa de Sevilla', 'https://es.wikipedia.org/wiki/Anexo:Procesiones_de_la_Semana_Santa_de_Sevilla', 'Fuente secundaria', 'Wikipedia'),
  ('Virgen de los Reyes (Sevilla)', 'https://es.wikipedia.org/wiki/Virgen_de_los_Reyes_(Sevilla)', 'Fuente secundaria', 'Wikipedia'),
  ('Virgen de la Amargura (Sevilla)', 'https://es.wikipedia.org/wiki/Virgen_de_la_Amargura_(Sevilla)', 'Fuente secundaria', 'Wikipedia'),
  ('Carta de Pablo VI con motivo de la coronación de la Virgen de la Esperanza', 'https://www.vatican.va/content/paul-vi/es/letters/1964/documents/hf_p-vi_let_19640531_macarena.html', 'Fuente oficial', 'Santa Sede'),
  ('Nuestra Señora de las Mercedes Coronada (Santa Genoveva)', 'https://cofradiasyhermandades.es/fichaimagineriaytallas.php?ii=7591102', 'Base de datos', 'Cofradías y Hermandades de la Semana Santa de España'),
  ('Boletín extraordinario sobre la Coronación Canónica de María Santísima del Rocío', 'https://hermandadredencion.com/wp-content/uploads/2025/12/BOLETI%CC%81N%20EXTRAORDINARIO.pdf', 'Fuente oficial', 'Hermandad de la Redención'),
  ('Gerena coronará a la Virgen de la Sangre con una corona de 3,2 kilos de oro', 'https://infovaticana.com/2026/09/12/gerena-coronara-a-la-virgen-de-la-sangre-con-una-corona-de-32-kilos-de-oro-donado-por-sus-devotos/', 'Prensa', 'Infovaticana'),
  ('Octava de los Remedios de Estepa 2025', 'https://www.festivalesdeespana.com/festival/fiestas-patronales-de-la-virgen-de-los-remedios-de-estepa-estepa/2025', 'Fuente secundaria', 'Festivales de España'),
  ('Castilleja de la Cuesta', 'https://es.hispanopedia.com/wiki/Castilleja_de_la_Cuesta', 'Fuente secundaria', 'Hispanopedia')
)
insert into public.sources (name, url, source_type, author_or_publisher, accessed_at)
select s.name, s.url, s.source_type, s.author, date '2026-11-07'
from new_sources s
where not exists (select 1 from public.sources x where x.url = s.url);

with event_sources(event_id, url) as (values
  ('c0261107-c0e0-4000-8000-000000000001'::uuid, 'https://es.wikipedia.org/wiki/Virgen_de_los_Reyes_(Sevilla)'),
  ('c0261107-c0e0-4000-8000-000000000002'::uuid, 'https://es.wikipedia.org/wiki/Anexo:Advocaciones_marianas_coronadas_can%C3%B3nicamente_en_Espa%C3%B1a'),
  ('c0261107-c0e0-4000-8000-000000000003'::uuid, 'https://es.wikipedia.org/wiki/Anexo:Advocaciones_marianas_coronadas_can%C3%B3nicamente_en_Espa%C3%B1a'),
  ('c0261107-c0e0-4000-8000-000000000004'::uuid, 'https://es.wikipedia.org/wiki/Anexo:Advocaciones_marianas_coronadas_can%C3%B3nicamente_en_Espa%C3%B1a'),
  ('c0261107-c0e0-4000-8000-000000000005'::uuid, 'https://cofradiasyhermandades.es/fichaimagineriaytallas.php?ii=7591102'),
  ('c0261107-c0e0-4000-8000-000000000005'::uuid, 'https://es.wikipedia.org/wiki/Anexo:Advocaciones_marianas_coronadas_can%C3%B3nicamente_en_Espa%C3%B1a'),
  ('f3100d8d-3f74-4c4a-aaf2-7e8bc78b772a'::uuid, 'https://cofradiasyhermandades.es/fichaimagineriaytallas.php?ii=7591102'),
  ('c0261107-c0e0-4000-8000-000000000006'::uuid, 'https://es.wikipedia.org/wiki/Anexo:Advocaciones_marianas_coronadas_can%C3%B3nicamente_en_Espa%C3%B1a'),
  ('c0261107-c0e0-4000-8000-000000000007'::uuid, 'https://es.wikipedia.org/wiki/Anexo:Advocaciones_marianas_coronadas_can%C3%B3nicamente_en_Espa%C3%B1a'),
  ('c0261107-c0e0-4000-8000-000000000008'::uuid, 'https://es.wikipedia.org/wiki/Anexo:Advocaciones_marianas_coronadas_can%C3%B3nicamente_en_Espa%C3%B1a'),
  ('c0261107-c0e0-4000-8000-000000000009'::uuid, 'https://es.wikipedia.org/wiki/Anexo:Advocaciones_marianas_coronadas_can%C3%B3nicamente_en_Espa%C3%B1a'),
  ('c0261107-c0e0-4000-8000-000000000010'::uuid, 'https://es.wikipedia.org/wiki/Anexo:Advocaciones_marianas_coronadas_can%C3%B3nicamente_en_Espa%C3%B1a'),
  ('c0261107-c0e0-4000-8000-000000000011'::uuid, 'https://es.wikipedia.org/wiki/Anexo:Advocaciones_marianas_coronadas_can%C3%B3nicamente_en_Espa%C3%B1a'),
  ('c0261107-c0e0-4000-8000-000000000012'::uuid, 'https://es.wikipedia.org/wiki/Anexo:Advocaciones_marianas_coronadas_can%C3%B3nicamente_en_Espa%C3%B1a'),
  ('c0261107-c0e0-4000-8000-000000000013'::uuid, 'https://es.wikipedia.org/wiki/Anexo:Advocaciones_marianas_coronadas_can%C3%B3nicamente_en_Espa%C3%B1a'),
  ('c0261107-c0e0-4000-8000-000000000014'::uuid, 'https://es.wikipedia.org/wiki/Anexo:Advocaciones_marianas_coronadas_can%C3%B3nicamente_en_Espa%C3%B1a'),
  ('c0261107-c0e0-4000-8000-000000000015'::uuid, 'https://es.wikipedia.org/wiki/Anexo:Advocaciones_marianas_coronadas_can%C3%B3nicamente_en_Espa%C3%B1a'),
  ('c0261107-c0e0-4000-8000-000000000017'::uuid, 'https://es.wikipedia.org/wiki/Anexo:Procesiones_de_la_Semana_Santa_de_Sevilla'),
  ('c0261107-c0e0-4000-8000-000000000020'::uuid, 'https://es.hispanopedia.com/wiki/Castilleja_de_la_Cuesta'),
  ('c0261107-c0e0-4000-8000-000000000021'::uuid, 'https://es.wikipedia.org/wiki/Anexo:Procesiones_de_la_Semana_Santa_de_Sevilla'),
  ('c0261107-c0e0-4000-8000-000000000023'::uuid, 'https://www.festivalesdeespana.com/festival/fiestas-patronales-de-la-virgen-de-los-remedios-de-estepa-estepa/2025'),
  ('c0261107-c0e0-4000-8000-000000000024'::uuid, 'https://infovaticana.com/2026/09/12/gerena-coronara-a-la-virgen-de-la-sangre-con-una-corona-de-32-kilos-de-oro-donado-por-sus-devotos/'),
  ('ddf4d5d7-4627-487a-b055-4c40c2436e61'::uuid, 'https://www.vatican.va/content/paul-vi/es/letters/1964/documents/hf_p-vi_let_19640531_macarena.html'),
  ('b418ca88-3d8f-4277-bfaf-6c9d7abb4908'::uuid, 'https://es.wikipedia.org/wiki/Virgen_de_la_Amargura_(Sevilla)'),
  ('9455fd18-6ef2-424d-8277-f7d6379a7021'::uuid, 'https://es.wikipedia.org/wiki/Anexo:Procesiones_de_la_Semana_Santa_de_Sevilla'),
  ('766c32e9-1415-4520-95e5-6374ab858dff'::uuid, 'https://hermandadredencion.com/wp-content/uploads/2025/12/BOLETI%CC%81N%20EXTRAORDINARIO.pdf')
)
insert into public.source_links (source_id, entity_id, scope, notes)
select s.id, es.event_id, 'Vírgenes Coronadas · fecha y prelado', null
from event_sources es
join public.events ev on ev.entity_id = es.event_id
join lateral (select id from public.sources where url = es.url order by created_at limit 1) s on true
where not exists (
  select 1 from public.source_links l where l.source_id = s.id and l.entity_id = es.event_id
);

commit;
