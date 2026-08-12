-- Hilo Cofrade · Segundo piloto relacional: Asunción de Cantillana
-- Migración 013
--
-- Fuente principal: web oficial de la Hermandad de la Asunción de Cantillana.
-- Esta primera carga incorpora identidad, sede, colores, titular, paso,
-- acontecimientos esenciales, cultos estables y la procesión de 2026.

-- -----------------------------------------------------------------------------
-- Municipio y sede canónica
-- -----------------------------------------------------------------------------

insert into public.municipalities (
  id, name, slug, province, autonomous_community, country
) values (
  '30000000-0000-0000-0000-000000000001',
  'Cantillana',
  'cantillana',
  'Sevilla',
  'Andalucía',
  'España'
)
on conflict (slug) do nothing;

insert into public.places (
  id, municipality_id, name, slug, place_type
)
select
  '31000000-0000-0000-0000-000000000001',
  m.id,
  'Iglesia Parroquial de Nuestra Señora de la Asunción',
  'iglesia-parroquial-nuestra-senora-de-la-asuncion-cantillana',
  'iglesia parroquial'
from public.municipalities m
where m.slug = 'cantillana'
on conflict (id) do nothing;

-- -----------------------------------------------------------------------------
-- Hermandad
-- -----------------------------------------------------------------------------

insert into public.entities (id, entity_type, name, slug, summary, status)
values (
  '30000000-0000-0000-0000-000000000002',
  'brotherhood',
  'Asunción de Cantillana',
  'asuncion-de-cantillana',
  'Real hermandad de gloria de Cantillana, fundada como rosario femenino en 1805 y establecida canónicamente en la parroquia de Nuestra Señora de la Asunción.',
  'published'
)
on conflict (id) do nothing;

insert into public.brotherhoods (
  entity_id,
  official_name,
  popular_name,
  foundation_text,
  municipality_id,
  canonical_see_place_id,
  website_url,
  brotherhood_types,
  current_procession_day,
  notes
)
select
  '30000000-0000-0000-0000-000000000002',
  'Antigua, Fervorosa y Real Hermandad de Nuestra Señora de la Asunción y Santísimo Rosario',
  'Asunción de Cantillana',
  '1805 · Reglas aprobadas el 1 de marzo; refrendadas por el Real Consejo de Castilla en 1807',
  m.id,
  '31000000-0000-0000-0000-000000000001',
  'https://asunciondecantillana.es/',
  array['Gloria'],
  '15 de agosto',
  'La corporación tiene su origen en el primer rosario femenino legalmente constituido en Cantillana.'
from public.municipalities m
where m.slug = 'cantillana'
on conflict (entity_id) do nothing;

insert into public.brotherhood_colors (
  id, brotherhood_entity_id, color_name, hex_value, color_role, sort_order, notes
) values
(
  '39000000-0000-0000-0000-000000000001',
  '30000000-0000-0000-0000-000000000002',
  'Celeste',
  null,
  'primary',
  1,
  'Color distintivo confirmado por la Hermandad. Tono hexadecimal institucional pendiente de confirmar.'
),
(
  '39000000-0000-0000-0000-000000000002',
  '30000000-0000-0000-0000-000000000002',
  'Blanco',
  '#FFFFFF',
  'secondary',
  2,
  'Color distintivo confirmado por la Hermandad.'
)
on conflict (id) do nothing;

-- -----------------------------------------------------------------------------
-- Advocación e imagen titular
-- -----------------------------------------------------------------------------

insert into public.entities (id, entity_type, name, slug, summary, status) values
(
  '32000000-0000-0000-0000-000000000001',
  'advocation',
  'Nuestra Señora de la Asunción',
  'advocacion-nuestra-senora-de-la-asuncion-cantillana',
  'Advocación mariana titular de la parroquia y de la Hermandad de la Asunción de Cantillana.',
  'published'
),
(
  '33000000-0000-0000-0000-000000000001',
  'image',
  'Nuestra Señora de la Asunción de Cantillana',
  'nuestra-senora-de-la-asuncion-cantillana',
  'Imagen gloriosa de tamaño natural, de autor desconocido y fechada por la Hermandad en el siglo XVI.',
  'published'
)
on conflict (id) do nothing;

insert into public.advocations (entity_id, advocation_type, description)
values (
  '32000000-0000-0000-0000-000000000001',
  'Virgen',
  'Asunción gloriosa de la Virgen María a los cielos.'
)
on conflict (entity_id) do nothing;

insert into public.images (
  entity_id,
  advocation_entity_id,
  image_type,
  execution_date_text,
  current_condition,
  description,
  notes
) values (
  '33000000-0000-0000-0000-000000000001',
  '32000000-0000-0000-0000-000000000001',
  'Virgen · Gloriosa',
  'Siglo XVI',
  'extant',
  'Escultura de tamaño natural que representa la Asunción gloriosa de la Virgen.',
  'Autor desconocido. La actual imagen titular fue adquirida por la Hermandad en 1840.'
)
on conflict (entity_id) do nothing;

insert into public.brotherhood_images (
  id,
  brotherhood_entity_id,
  image_entity_id,
  relation_type,
  date_from_text,
  notes,
  status
) values (
  '33100000-0000-0000-0000-000000000001',
  '30000000-0000-0000-0000-000000000002',
  '33000000-0000-0000-0000-000000000001',
  'titular',
  '1840',
  'Imagen titular adquirida por la Hermandad y colocada al culto en 1840.',
  'published'
)
on conflict (id) do nothing;

insert into public.entity_locations (
  id,
  entity_id,
  place_id,
  municipality_id,
  custodian_entity_id,
  location_type,
  date_from_text,
  is_current,
  notes,
  status
)
select
  '33200000-0000-0000-0000-000000000001',
  '33000000-0000-0000-0000-000000000001',
  '31000000-0000-0000-0000-000000000001',
  m.id,
  '30000000-0000-0000-0000-000000000002',
  'physical_location',
  '1840',
  true,
  'Recibe culto en el retablo mayor de la iglesia parroquial.',
  'published'
from public.municipalities m
where m.slug = 'cantillana'
on conflict (id) do nothing;

-- -----------------------------------------------------------------------------
-- Paso procesional
-- -----------------------------------------------------------------------------

insert into public.entities (id, entity_type, name, slug, summary, status)
values (
  '34000000-0000-0000-0000-000000000001',
  'step',
  'Paso procesional de Nuestra Señora de la Asunción de Cantillana',
  'paso-procesional-nuestra-senora-de-la-asuncion-cantillana',
  'Paso sobre el que Nuestra Señora de la Asunción procesiona cada 15 de agosto por Cantillana.',
  'published'
)
on conflict (id) do nothing;

insert into public.steps (entity_id, step_type, current_condition, description)
values (
  '34000000-0000-0000-0000-000000000001',
  'Paso procesional de Gloria',
  'in_use',
  'Paso procesional de Nuestra Señora de la Asunción de Cantillana.'
)
on conflict (entity_id) do nothing;

insert into public.brotherhood_steps (
  id, brotherhood_entity_id, step_entity_id, relation_type, notes, status
) values (
  '34100000-0000-0000-0000-000000000001',
  '30000000-0000-0000-0000-000000000002',
  '34000000-0000-0000-0000-000000000001',
  'processional_step',
  'Paso procesional actual de la imagen titular.',
  'published'
)
on conflict (id) do nothing;

insert into public.image_steps (
  id, image_entity_id, step_entity_id, relation_type, notes, status
) values (
  '34200000-0000-0000-0000-000000000001',
  '33000000-0000-0000-0000-000000000001',
  '34000000-0000-0000-0000-000000000001',
  'processes_on',
  'La imagen procesiona sobre este paso en su salida anual del 15 de agosto.',
  'published'
)
on conflict (id) do nothing;

-- -----------------------------------------------------------------------------
-- Acontecimientos históricos esenciales
-- -----------------------------------------------------------------------------

insert into public.entities (id, entity_type, name, slug, status) values
(
  '35000000-0000-0000-0000-000000000001',
  'event',
  'Aprobación de las reglas de la Hermandad de la Asunción de Cantillana',
  'aprobacion-reglas-asuncion-cantillana-1805',
  'published'
),
(
  '35000000-0000-0000-0000-000000000002',
  'event',
  'Adquisición de la imagen de Nuestra Señora de la Asunción',
  'adquisicion-imagen-asuncion-cantillana-1840',
  'published'
),
(
  '35000000-0000-0000-0000-000000000003',
  'event',
  'Primera celebración del acto de la Subida',
  'primera-subida-asuncion-cantillana-1933',
  'published'
)
on conflict (id) do nothing;

insert into public.events (
  entity_id, event_type, event_date, event_date_text, place_id, description
) values
(
  '35000000-0000-0000-0000-000000000001',
  'Fundación',
  '1805-03-01',
  '1 de marzo de 1805',
  null,
  'La autoridad eclesiástica aprobó las reglas del Rosario de la Asunción, primer rosario femenino legalmente constituido en Cantillana.'
),
(
  '35000000-0000-0000-0000-000000000002',
  'Patrimonio',
  null,
  '1840',
  '31000000-0000-0000-0000-000000000001',
  'La Hermandad adquirió la actual imagen titular y la colocó al culto en la iglesia parroquial.'
),
(
  '35000000-0000-0000-0000-000000000003',
  'Fiesta',
  null,
  '1933',
  '31000000-0000-0000-0000-000000000001',
  'Se celebró por primera vez el acto de la Subida de Nuestra Señora de la Asunción a su trono.'
)
on conflict (entity_id) do nothing;

insert into public.entity_relations (
  source_entity_id, relation_type, target_entity_id, date_from_text, status
) values
('35000000-0000-0000-0000-000000000001','involves','30000000-0000-0000-0000-000000000002','1805','published'),
('35000000-0000-0000-0000-000000000002','involves','30000000-0000-0000-0000-000000000002','1840','published'),
('35000000-0000-0000-0000-000000000002','involves','33000000-0000-0000-0000-000000000001','1840','published'),
('35000000-0000-0000-0000-000000000003','involves','30000000-0000-0000-0000-000000000002','1933','published'),
('35000000-0000-0000-0000-000000000003','involves','33000000-0000-0000-0000-000000000001','1933','published')
on conflict do nothing;

-- -----------------------------------------------------------------------------
-- Cultos estables
-- -----------------------------------------------------------------------------

insert into public.cults (
  id,
  brotherhood_entity_id,
  image_entity_id,
  cult_type,
  title,
  date_rule,
  month,
  time_text,
  place_id,
  description,
  status,
  is_recurring,
  recurrence_label,
  display_order
) values
(
  '38000000-0000-0000-0000-000000000001',
  '30000000-0000-0000-0000-000000000002',
  '33000000-0000-0000-0000-000000000001',
  'Novena',
  'Solemne Novena a Nuestra Señora de la Asunción',
  'Comienza el 14 de agosto y continúa del 16 al 23 de agosto',
  8,
  null,
  '31000000-0000-0000-0000-000000000001',
  'Novena anual en honor de la imagen titular.',
  'published',
  true,
  'Agosto',
  10
),
(
  '38000000-0000-0000-0000-000000000002',
  '30000000-0000-0000-0000-000000000002',
  '33000000-0000-0000-0000-000000000001',
  'Función Solemne',
  'Función Solemne de la Asunción',
  '15 de agosto',
  8,
  '11:00',
  '31000000-0000-0000-0000-000000000001',
  'Función Solemne celebrada en la mañana de la festividad de la Asunción.',
  'published',
  true,
  '15 de agosto',
  20
),
(
  '38000000-0000-0000-0000-000000000003',
  '30000000-0000-0000-0000-000000000002',
  '33000000-0000-0000-0000-000000000001',
  'Triduo',
  'Solemne Triduo conmemorativo del Dogma de la Asunción',
  '29, 30 y 31 de octubre',
  10,
  null,
  '31000000-0000-0000-0000-000000000001',
  'Triduo anual en conmemoración de la proclamación del Dogma de la Asunción.',
  'published',
  true,
  'Finales de octubre',
  30
),
(
  '38000000-0000-0000-0000-000000000004',
  '30000000-0000-0000-0000-000000000002',
  '33000000-0000-0000-0000-000000000001',
  'Función Votiva',
  'Función Votiva del Dogma de la Asunción',
  '1 de noviembre',
  11,
  null,
  '31000000-0000-0000-0000-000000000001',
  'Función Votiva celebrada cada 1 de noviembre.',
  'published',
  true,
  '1 de noviembre',
  40
)
on conflict (id) do nothing;

insert into public.cult_entities (cult_id, entity_id, role)
select c.id, '33000000-0000-0000-0000-000000000001', 'honoree'
from public.cults c
where c.id in (
  '38000000-0000-0000-0000-000000000001',
  '38000000-0000-0000-0000-000000000002',
  '38000000-0000-0000-0000-000000000003',
  '38000000-0000-0000-0000-000000000004'
)
on conflict do nothing;

-- -----------------------------------------------------------------------------
-- Salida ordinaria de 2026
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
  route_summary,
  description,
  event_status,
  status
)
select
  '37000000-0000-0000-0000-000000000001',
  '30000000-0000-0000-0000-000000000002',
  'Procesión de Gloria',
  'ordinary',
  'Procesión de Nuestra Señora de la Asunción 2026',
  '2026-08-15',
  2026,
  m.id,
  '31000000-0000-0000-0000-000000000001',
  '31000000-0000-0000-0000-000000000001',
  'Procesión anual por las calles de Cantillana.',
  'Salida procesional anual de Nuestra Señora de la Asunción en la noche del 15 de agosto.',
  'announced',
  'published'
from public.municipalities m
where m.slug = 'cantillana'
on conflict (id) do nothing;

insert into public.outing_entities (outing_id, entity_id, role) values
('37000000-0000-0000-0000-000000000001','33000000-0000-0000-0000-000000000001','processional_image'),
('37000000-0000-0000-0000-000000000001','34000000-0000-0000-0000-000000000001','processional_step')
on conflict do nothing;

-- -----------------------------------------------------------------------------
-- Fuentes oficiales
-- -----------------------------------------------------------------------------

insert into public.sources (
  id, name, url, source_type, author_or_publisher, accessed_at
) values
(
  '36000000-0000-0000-0000-000000000001',
  'Hermandad de la Asunción de Cantillana',
  'https://asunciondecantillana.es/',
  'Web oficial',
  'Hermandad de la Asunción de Cantillana',
  '2026-08-12'
),
(
  '36000000-0000-0000-0000-000000000002',
  'Orígenes devocionales y fundación',
  'https://www.asunciondecantillana.es/historia/origenes-devocionales-y-fundacion',
  'Web oficial',
  'Hermandad de la Asunción de Cantillana',
  '2026-08-12'
),
(
  '36000000-0000-0000-0000-000000000003',
  'Siglo XIX',
  'https://www.asunciondecantillana.es/historia/siglo-xix',
  'Web oficial',
  'Hermandad de la Asunción de Cantillana',
  '2026-08-12'
),
(
  '36000000-0000-0000-0000-000000000004',
  'Iconografía de Nuestra Señora de la Asunción',
  'https://www.asunciondecantillana.es/titular/iconografia',
  'Web oficial',
  'Hermandad de la Asunción de Cantillana',
  '2026-08-12'
),
(
  '36000000-0000-0000-0000-000000000005',
  'Paso procesional',
  'https://www.asunciondecantillana.es/patrimonio/paso-procesional',
  'Web oficial',
  'Hermandad de la Asunción de Cantillana',
  '2026-08-12'
),
(
  '36000000-0000-0000-0000-000000000006',
  'Pregón y cultos de agosto',
  'https://www.asunciondecantillana.es/fiestas/agosto',
  'Web oficial',
  'Hermandad de la Asunción de Cantillana',
  '2026-08-12'
),
(
  '36000000-0000-0000-0000-000000000007',
  'Fiesta de la Subida',
  'https://www.asunciondecantillana.es/fiestas/septiembre',
  'Web oficial',
  'Hermandad de la Asunción de Cantillana',
  '2026-08-12'
),
(
  '36000000-0000-0000-0000-000000000008',
  'El Dogma de la Asunción',
  'https://www.asunciondecantillana.es/fiestas/dogma',
  'Web oficial',
  'Hermandad de la Asunción de Cantillana',
  '2026-08-12'
),
(
  '36000000-0000-0000-0000-000000000009',
  'Escudo y medalla',
  'https://www.asunciondecantillana.es/asuncionistas/escudo-y-medalla',
  'Web oficial',
  'Hermandad de la Asunción de Cantillana',
  '2026-08-12'
),
(
  '36000000-0000-0000-0000-000000000010',
  'Principios del siglo XX',
  'https://www.asunciondecantillana.es/historia/principios-del-siglo-xx',
  'Web oficial',
  'Hermandad de la Asunción de Cantillana',
  '2026-08-12'
)
on conflict (id) do nothing;

insert into public.source_links (source_id, entity_id, scope) values
('36000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000002','Ficha general y sede canónica'),
('36000000-0000-0000-0000-000000000002','30000000-0000-0000-0000-000000000002','Fundación y aprobación de reglas'),
('36000000-0000-0000-0000-000000000003','33000000-0000-0000-0000-000000000001','Adquisición de la imagen titular en 1840'),
('36000000-0000-0000-0000-000000000004','33000000-0000-0000-0000-000000000001','Iconografía, datación y autoría desconocida'),
('36000000-0000-0000-0000-000000000005','34000000-0000-0000-0000-000000000001','Paso procesional'),
('36000000-0000-0000-0000-000000000007','35000000-0000-0000-0000-000000000003','Origen de la Fiesta de la Subida'),
('36000000-0000-0000-0000-000000000009','30000000-0000-0000-0000-000000000002','Colores distintivos celeste y blanco'),
('36000000-0000-0000-0000-000000000010','35000000-0000-0000-0000-000000000003','Primera celebración de la Subida en 1933')
on conflict do nothing;

insert into public.source_links (source_id, cult_id, scope) values
('36000000-0000-0000-0000-000000000006','38000000-0000-0000-0000-000000000001','Solemne Novena'),
('36000000-0000-0000-0000-000000000006','38000000-0000-0000-0000-000000000002','Función Solemne del 15 de agosto'),
('36000000-0000-0000-0000-000000000008','38000000-0000-0000-0000-000000000003','Triduo del Dogma'),
('36000000-0000-0000-0000-000000000008','38000000-0000-0000-0000-000000000004','Función Votiva del 1 de noviembre')
on conflict do nothing;

insert into public.source_links (source_id, outing_id, scope) values
(
  '36000000-0000-0000-0000-000000000006',
  '37000000-0000-0000-0000-000000000001',
  'Procesión anual del 15 de agosto'
)
on conflict do nothing;

