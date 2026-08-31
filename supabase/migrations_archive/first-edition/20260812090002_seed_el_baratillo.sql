-- Hilo Cofrade · Piloto relacional: El Baratillo
-- Datos iniciales basados en la ficha ya documentada del prototipo.
-- El objetivo de esta migración es validar relaciones, no completar todavía toda la ficha.

-- IDs estables para poder relacionar el piloto sin depender de valores generados.
-- Hermandad
insert into public.entities (id, entity_type, name, slug, summary, status)
values (
  '10000000-0000-0000-0000-000000000001',
  'brotherhood',
  'El Baratillo',
  'el-baratillo',
  'Hermandad sevillana con sede en la Capilla de la Piedad, en el Arenal.',
  'published'
)
on conflict (id) do nothing;

-- Lugar: Capilla de la Piedad
insert into public.places (id, municipality_id, name, slug, place_type)
select
  '20000000-0000-0000-0000-000000000001',
  m.id,
  'Capilla de la Piedad',
  'capilla-de-la-piedad-sevilla',
  'capilla'
from public.municipalities m
where m.slug = 'sevilla'
on conflict (id) do nothing;

insert into public.brotherhoods (
  entity_id,
  official_name,
  popular_name,
  foundation_text,
  municipality_id,
  canonical_see_place_id,
  neighborhood,
  crest_path,
  brotherhood_types,
  current_procession_day
)
select
  '10000000-0000-0000-0000-000000000001',
  'Antigua y Fervorosa Hermandad de la Santa Cruz y Cofradía de Nazarenos del Santísimo Cristo de la Misericordia y Nuestra Señora de la Piedad, Patriarca Bendito Señor San José, y María Santísima de la Caridad en su Soledad',
  'El Baratillo',
  '1693',
  m.id,
  '20000000-0000-0000-0000-000000000001',
  'Arenal',
  '/escudos/el-baratillo.svg',
  array['Penitencia'],
  'Miércoles Santo'
from public.municipalities m
where m.slug = 'sevilla'
on conflict (entity_id) do nothing;

-- -----------------------------------------------------------------------------
-- Advocaciones
-- -----------------------------------------------------------------------------

insert into public.entities (id, entity_type, name, slug, status) values
('11000000-0000-0000-0000-000000000001','advocation','Santísimo Cristo de la Misericordia','advocacion-santisimo-cristo-de-la-misericordia','published'),
('11000000-0000-0000-0000-000000000002','advocation','Nuestra Señora de la Piedad','advocacion-nuestra-senora-de-la-piedad','published'),
('11000000-0000-0000-0000-000000000003','advocation','María Santísima de la Caridad en su Soledad','advocacion-maria-santisima-de-la-caridad-en-su-soledad','published'),
('11000000-0000-0000-0000-000000000004','advocation','Patriarca Bendito Señor San José','advocacion-patriarca-bendito-senor-san-jose','published')
on conflict (id) do nothing;

insert into public.advocations (entity_id, advocation_type) values
('11000000-0000-0000-0000-000000000001','Cristo'),
('11000000-0000-0000-0000-000000000002','Virgen'),
('11000000-0000-0000-0000-000000000003','Virgen'),
('11000000-0000-0000-0000-000000000004','Santo')
on conflict (entity_id) do nothing;

-- -----------------------------------------------------------------------------
-- Imágenes físicas actuales
-- -----------------------------------------------------------------------------

insert into public.entities (id, entity_type, name, slug, status) values
('12000000-0000-0000-0000-000000000001','image','Santísimo Cristo de la Misericordia','santisimo-cristo-de-la-misericordia','published'),
('12000000-0000-0000-0000-000000000002','image','Nuestra Señora de la Piedad','nuestra-senora-de-la-piedad','published'),
('12000000-0000-0000-0000-000000000003','image','María Santísima de la Caridad en su Soledad','maria-santisima-de-la-caridad-en-su-soledad','published'),
('12000000-0000-0000-0000-000000000004','image','Patriarca Bendito Señor San José','patriarca-bendito-senor-san-jose','published')
on conflict (id) do nothing;

insert into public.images (
  entity_id, advocation_entity_id, image_type, execution_date_text, current_condition
) values
('12000000-0000-0000-0000-000000000001','11000000-0000-0000-0000-000000000001','Cristo','1950','extant'),
('12000000-0000-0000-0000-000000000002','11000000-0000-0000-0000-000000000002','Virgen','1945','extant'),
('12000000-0000-0000-0000-000000000003','11000000-0000-0000-0000-000000000003','Virgen · Dolorosa','1931','extant'),
('12000000-0000-0000-0000-000000000004','11000000-0000-0000-0000-000000000004','Santo','Siglo XVIII','extant')
on conflict (entity_id) do nothing;

-- Titulares actuales. San José es titular aunque no exista relación Imagen ↔ Paso.
insert into public.brotherhood_images (
  brotherhood_entity_id, image_entity_id, relation_type, date_from_text, status
) values
('10000000-0000-0000-0000-000000000001','12000000-0000-0000-0000-000000000001','titular',null,'published'),
('10000000-0000-0000-0000-000000000001','12000000-0000-0000-0000-000000000002','titular',null,'published'),
('10000000-0000-0000-0000-000000000001','12000000-0000-0000-0000-000000000003','titular','1931','published'),
('10000000-0000-0000-0000-000000000001','12000000-0000-0000-0000-000000000004','titular',null,'published')
on conflict do nothing;

-- Ubicación/custodia actual: la hermandad y el lugar físico se modelan por separado.
insert into public.entity_locations (
  entity_id, place_id, municipality_id, custodian_entity_id, location_type, is_current, status
)
select
  image_id,
  '20000000-0000-0000-0000-000000000001',
  m.id,
  '10000000-0000-0000-0000-000000000001',
  'physical_location',
  true,
  'published'
from public.municipalities m
cross join (values
  ('12000000-0000-0000-0000-000000000001'::uuid),
  ('12000000-0000-0000-0000-000000000002'::uuid),
  ('12000000-0000-0000-0000-000000000003'::uuid),
  ('12000000-0000-0000-0000-000000000004'::uuid)
) as x(image_id)
where m.slug = 'sevilla';

-- -----------------------------------------------------------------------------
-- Autores / agentes
-- -----------------------------------------------------------------------------

insert into public.entities (id, entity_type, name, slug, status) values
('13000000-0000-0000-0000-000000000001','agent','Luis Ortega Bru','luis-ortega-bru','published'),
('13000000-0000-0000-0000-000000000002','agent','José Rodríguez Fernández-Andes','jose-rodriguez-fernandez-andes','published')
on conflict (id) do nothing;

insert into public.agents (entity_id, agent_kind) values
('13000000-0000-0000-0000-000000000001','person'),
('13000000-0000-0000-0000-000000000002','person')
on conflict (entity_id) do nothing;

insert into public.agent_roles (agent_entity_id, role_name) values
('13000000-0000-0000-0000-000000000001','Imaginero'),
('13000000-0000-0000-0000-000000000002','Imaginero')
on conflict do nothing;

-- Autorías de las imágenes físicas, no de la advocación.
insert into public.entity_relations (source_entity_id, relation_type, target_entity_id, status) values
('13000000-0000-0000-0000-000000000001','author_of','12000000-0000-0000-0000-000000000001','published'),
('13000000-0000-0000-0000-000000000002','author_of','12000000-0000-0000-0000-000000000002','published'),
('13000000-0000-0000-0000-000000000002','author_of','12000000-0000-0000-0000-000000000003','published')
on conflict do nothing;

-- -----------------------------------------------------------------------------
-- Pasos actuales
-- -----------------------------------------------------------------------------

insert into public.entities (id, entity_type, name, slug, status) values
('14000000-0000-0000-0000-000000000001','step','Paso del Santísimo Cristo de la Misericordia y Nuestra Señora de la Piedad','paso-de-la-piedad','published'),
('14000000-0000-0000-0000-000000000002','step','Paso de palio de María Santísima de la Caridad en su Soledad','paso-de-palio-de-maria-santisima-de-la-caridad','published')
on conflict (id) do nothing;

insert into public.steps (entity_id, step_type, current_condition, description) values
('14000000-0000-0000-0000-000000000001','Paso de Misterio','in_use','Paso que representa la Piedad.'),
('14000000-0000-0000-0000-000000000002','Paso de Palio','in_use','Paso de palio de María Santísima de la Caridad en su Soledad.')
on conflict (entity_id) do nothing;

insert into public.brotherhood_steps (brotherhood_entity_id, step_entity_id, relation_type, status) values
('10000000-0000-0000-0000-000000000001','14000000-0000-0000-0000-000000000001','processional_step','published'),
('10000000-0000-0000-0000-000000000001','14000000-0000-0000-0000-000000000002','processional_step','published')
on conflict do nothing;

insert into public.image_steps (image_entity_id, step_entity_id, relation_type, status) values
('12000000-0000-0000-0000-000000000001','14000000-0000-0000-0000-000000000001','processes_on','published'),
('12000000-0000-0000-0000-000000000002','14000000-0000-0000-0000-000000000001','processes_on','published'),
('12000000-0000-0000-0000-000000000003','14000000-0000-0000-0000-000000000002','processes_on','published')
on conflict do nothing;

-- Nota deliberada: San José no tiene fila en image_steps.
-- Por tanto, la interfaz puede deducir que es titular pero no procesiona.

-- -----------------------------------------------------------------------------
-- Acontecimientos históricos
-- -----------------------------------------------------------------------------

insert into public.entities (id, entity_type, name, slug, status) values
('15000000-0000-0000-0000-000000000001','event','Vía Crucis de las Hermandades 1985','via-crucis-hermandades-1985-baratillo','published'),
('15000000-0000-0000-0000-000000000002','event','Imposición de la corona de María Santísima de la Caridad','imposicion-corona-caridad-1960','published'),
('15000000-0000-0000-0000-000000000003','event','Reconocimiento canónico de la coronación de María Santísima de la Caridad','reconocimiento-coronacion-caridad-2009','published')
on conflict (id) do nothing;

insert into public.events (entity_id, event_type, event_date, event_date_text, description) values
(
 '15000000-0000-0000-0000-000000000001',
 'Vía Crucis de las Hermandades',
 null,
 '1985',
 'El Santísimo Cristo de la Misericordia presidió el Vía Crucis cuaresmal de las Hermandades de Penitencia de Sevilla junto a Nuestra Señora de la Piedad.'
),
(
 '15000000-0000-0000-0000-000000000002',
 'Coronación',
 '1960-03-20',
 '20 · marzo · 1960',
 'Imposición de la corona a María Santísima de la Caridad en su Soledad en la Capilla de la Piedad.'
),
(
 '15000000-0000-0000-0000-000000000003',
 'Coronación',
 '2009-01-01',
 '1 · enero · 2009',
 'Reconocimiento canónico del acto de imposición de la corona celebrado en 1960.'
)
on conflict (entity_id) do nothing;

insert into public.entity_relations (source_entity_id, relation_type, target_entity_id, status) values
('15000000-0000-0000-0000-000000000001','involves','10000000-0000-0000-0000-000000000001','published'),
('15000000-0000-0000-0000-000000000001','involves','12000000-0000-0000-0000-000000000001','published'),
('15000000-0000-0000-0000-000000000001','involves','12000000-0000-0000-0000-000000000002','published'),
('15000000-0000-0000-0000-000000000002','involves','12000000-0000-0000-0000-000000000003','published'),
('15000000-0000-0000-0000-000000000003','involves','12000000-0000-0000-0000-000000000003','published')
on conflict do nothing;

-- -----------------------------------------------------------------------------
-- Fuentes del piloto
-- -----------------------------------------------------------------------------

insert into public.sources (id, name, url, source_type, author_or_publisher) values
('16000000-0000-0000-0000-000000000001','Hermandad del Baratillo','https://hermandadelbaratillo.es/','Web oficial','Hermandad del Baratillo'),
('16000000-0000-0000-0000-000000000002','Semana Santa Open Data','https://semanasantaopendata.org/2026/hermandad/el-baratillo/','Base de datos','Semana Santa Open Data'),
('16000000-0000-0000-0000-000000000003','Consejo General de Hermandades y Cofradías de Sevilla','https://www.hermandades-de-sevilla.org/13957-2/hermandades-viacrucis-consejo/','Web institucional','Consejo General de Hermandades y Cofradías de Sevilla')
on conflict (id) do nothing;

insert into public.source_links (source_id, entity_id, scope) values
('16000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','Ficha general'),
('16000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000001','Estadísticas 2026'),
('16000000-0000-0000-0000-000000000003','15000000-0000-0000-0000-000000000001','Vía Crucis 1985'),
('16000000-0000-0000-0000-000000000001','12000000-0000-0000-0000-000000000003','María Santísima de la Caridad en su Soledad')
on conflict do nothing;

-- -----------------------------------------------------------------------------
-- Salida ordinaria 2026 (piloto)
-- -----------------------------------------------------------------------------

insert into public.outings (
  id,
  brotherhood_entity_id,
  outing_type,
  character,
  title,
  outing_date,
  year,
  municipality_id,
  origin_place_id,
  destination_place_id,
  description,
  event_status,
  status
)
select
  '17000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000001',
  'Estación de penitencia',
  'ordinary',
  'Estación de Penitencia 2026',
  null,
  2026,
  m.id,
  '20000000-0000-0000-0000-000000000001',
  null,
  'Estación de penitencia del Miércoles Santo de 2026.',
  'held',
  'published'
from public.municipalities m
where m.slug = 'sevilla'
on conflict (id) do nothing;

insert into public.outing_entities (outing_id, entity_id, role) values
('17000000-0000-0000-0000-000000000001','12000000-0000-0000-0000-000000000001','processional_image'),
('17000000-0000-0000-0000-000000000001','12000000-0000-0000-0000-000000000002','processional_image'),
('17000000-0000-0000-0000-000000000001','12000000-0000-0000-0000-000000000003','processional_image'),
('17000000-0000-0000-0000-000000000001','14000000-0000-0000-0000-000000000001','processional_step'),
('17000000-0000-0000-0000-000000000001','14000000-0000-0000-0000-000000000002','processional_step')
on conflict do nothing;

-- La jornada/datos estadísticos actuales siguen temporalmente en el prototipo.
-- En una siguiente migración se normalizarán estadísticas anuales y cultos.
