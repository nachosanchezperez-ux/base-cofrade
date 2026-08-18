-- Hilo Cofrade · Agrupación Musical Ntra. Sra. de la Encarnación
-- Migración 042
--
-- Completa el piloto real de Encarnación con el mismo nivel relacional que
-- Las Cigarreras: identidad visual, sede, acompañamientos actuales e histórico,
-- dirección, banderín y fuentes. Las Hermandades y Pasos de apoyo permanecen en
-- borrador si todavía no disponen de ficha pública completa.

-- -----------------------------------------------------------------------------
-- IDENTIDAD DE LA FORMACIÓN
-- -----------------------------------------------------------------------------

update public.bands
set
  description = 'Agrupación Musical Nuestra Señora de la Encarnación, formación propia de la Hermandad de San Benito nacida en 1990. Su trayectoria está estrechamente vinculada al acompañamiento procesional del misterio de la Sagrada Presentación de Jesús al Pueblo y a otras hermandades sevillanas.',
  headquarters_text = 'Calle Tesalónica · Polígono Industrial San Pablo · Sevilla',
  primary_color = '#1B82B4',
  secondary_color = '#20262C',
  logo_path = '/bandas/encarnacion/imagotipo.svg'
where entity_id = 'cb04a5d8-e81e-4405-a001-9d5a60840924';

insert into public.entity_social_links (
  entity_id, platform, url, label, display_order, is_public
) values (
  'cb04a5d8-e81e-4405-a001-9d5a60840924',
  'website',
  'https://www.amencarnacion.com/',
  'Web oficial',
  10,
  true
)
on conflict (entity_id, platform) do update set
  url = excluded.url,
  label = excluded.label,
  display_order = excluded.display_order,
  is_public = excluded.is_public;

-- -----------------------------------------------------------------------------
-- HERMANDADES DE APOYO
-- No se publican por el mero hecho de necesitarlas para una relación musical.
-- -----------------------------------------------------------------------------

insert into public.entities (id, entity_type, name, slug, status)
values
  ('a4220000-0000-0000-0000-000000000001', 'brotherhood', 'Hermandad de Pino Montano', 'hermandad-de-pino-montano', 'draft'),
  ('a4220000-0000-0000-0000-000000000002', 'brotherhood', 'Hermandad del Divino Perdón', 'hermandad-del-divino-perdon', 'draft'),
  ('a4220000-0000-0000-0000-000000000003', 'brotherhood', 'Hermandad de la Paz', 'hermandad-de-la-paz', 'draft'),
  ('a4220000-0000-0000-0000-000000000004', 'brotherhood', 'Hermandad de San Benito', 'san-benito', 'draft')
on conflict (slug) do update set name = excluded.name;

insert into public.brotherhoods (
  entity_id, official_name, popular_name, municipality_id,
  brotherhood_types, current_procession_day
)
select
  entity.id,
  data.official_name,
  data.popular_name,
  municipality.id,
  array['Penitencia']::text[],
  data.procession_day
from (values
  (
    'hermandad-de-pino-montano',
    'Hermandad y Cofradía de Nazarenos de Nuestro Padre Jesús de Nazaret, María Santísima del Amor, San Marcos Evangelista y San Isidro Labrador',
    'Pino Montano',
    'Viernes de Dolores'
  ),
  (
    'hermandad-del-divino-perdon',
    'Franciscana Hermandad de Penitencia y Cofradía de Nazarenos de María Santísima de la Purísima Concepción, Santo Cáliz de Nuestro Padre Jesús del Divino Perdón y Beata Ana María de Javouhey',
    'Divino Perdón',
    'Sábado de Pasión'
  ),
  (
    'hermandad-de-la-paz',
    'Real y Fervorosa Hermandad Sacramental del Señor San Sebastián y Nuestra Señora del Prado y Cofradía de Nazarenos de Nuestro Padre Jesús de la Victoria y María Santísima de la Paz',
    'La Paz',
    'Domingo de Ramos'
  ),
  (
    'san-benito',
    'Hermandad del Santísimo Sacramento, Pontificia y Real Archicofradía de Nazarenos de la Sagrada Presentación de Jesús al Pueblo, Santísimo Cristo de la Sangre, Nuestra Señora de la Encarnación Coronada y San Benito Abad',
    'San Benito',
    'Martes Santo'
  )
) as data(slug, official_name, popular_name, procession_day)
join public.entities entity on entity.slug = data.slug
join public.municipalities municipality on municipality.slug = 'sevilla'
on conflict (entity_id) do update set
  official_name = excluded.official_name,
  popular_name = excluded.popular_name,
  municipality_id = excluded.municipality_id,
  brotherhood_types = excluded.brotherhood_types,
  current_procession_day = excluded.current_procession_day;

-- Vinculación institucional: Encarnación es formación propia de San Benito.
-- El guard de la 038 evita que la relación sea pública mientras San Benito siga
-- en borrador.
insert into public.entity_relations (
  id, source_entity_id, relation_type, target_entity_id, status, notes
)
select
  'a4221000-0000-0000-0000-000000000001',
  'cb04a5d8-e81e-4405-a001-9d5a60840924',
  'belongs_to_brotherhood',
  brotherhood.id,
  case when brotherhood.status = 'published' then 'published' else 'draft' end,
  'Formación musical propia de la Hermandad de San Benito.'
from public.entities brotherhood
where brotherhood.slug = 'san-benito'
  and not exists (
    select 1
    from public.entity_relations existing
    where existing.source_entity_id = 'cb04a5d8-e81e-4405-a001-9d5a60840924'
      and existing.relation_type = 'belongs_to_brotherhood'
      and existing.status <> 'archived'
  );

-- -----------------------------------------------------------------------------
-- PASOS DE APOYO
-- -----------------------------------------------------------------------------

insert into public.entities (id, entity_type, name, slug, status)
values
  ('b4220000-0000-0000-0000-000000000001', 'step', 'Paso de misterio de Nuestro Padre Jesús de Nazaret', 'paso-misterio-jesus-de-nazaret-pino-montano', 'draft'),
  ('b4220000-0000-0000-0000-000000000002', 'step', 'Paso de Nuestro Padre Jesús del Divino Perdón', 'paso-jesus-del-divino-perdon', 'draft'),
  ('b4220000-0000-0000-0000-000000000003', 'step', 'Paso de Nuestro Padre Jesús de la Victoria', 'paso-jesus-de-la-victoria-la-paz', 'draft'),
  ('b4220000-0000-0000-0000-000000000004', 'step', 'Paso de misterio de la Sagrada Presentación de Jesús al Pueblo', 'paso-sagrada-presentacion-san-benito', 'draft'),
  ('b4220000-0000-0000-0000-000000000005', 'step', 'Paso del Santísimo Cristo de la Sangre', 'paso-cristo-de-la-sangre-san-benito', 'draft')
on conflict (slug) do update set name = excluded.name;

insert into public.steps (entity_id, step_type, current_condition)
select
  entity.id,
  data.step_type,
  'preserved'
from (values
  ('paso-misterio-jesus-de-nazaret-pino-montano', 'Misterio'),
  ('paso-jesus-del-divino-perdon', 'Misterio'),
  ('paso-jesus-de-la-victoria-la-paz', 'Misterio'),
  ('paso-sagrada-presentacion-san-benito', 'Misterio'),
  ('paso-cristo-de-la-sangre-san-benito', 'Cristo')
) as data(slug, step_type)
join public.entities entity on entity.slug = data.slug
on conflict (entity_id) do update set
  step_type = excluded.step_type,
  current_condition = excluded.current_condition;

insert into public.brotherhood_steps (
  id, brotherhood_entity_id, step_entity_id, relation_type, status
)
select
  data.id::uuid,
  brotherhood.id,
  step.id,
  'processional_step',
  case
    when brotherhood.status = 'published' and step.status = 'published' then 'published'
    else 'draft'
  end
from (values
  ('b4221000-0000-0000-0000-000000000001', 'hermandad-de-pino-montano', 'paso-misterio-jesus-de-nazaret-pino-montano'),
  ('b4221000-0000-0000-0000-000000000002', 'hermandad-del-divino-perdon', 'paso-jesus-del-divino-perdon'),
  ('b4221000-0000-0000-0000-000000000003', 'hermandad-de-la-paz', 'paso-jesus-de-la-victoria-la-paz'),
  ('b4221000-0000-0000-0000-000000000004', 'san-benito', 'paso-sagrada-presentacion-san-benito'),
  ('b4221000-0000-0000-0000-000000000005', 'san-benito', 'paso-cristo-de-la-sangre-san-benito')
) as data(id, brotherhood_slug, step_slug)
join public.entities brotherhood on brotherhood.slug = data.brotherhood_slug
join public.entities step on step.slug = data.step_slug
on conflict (id) do update set
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  step_entity_id = excluded.step_entity_id,
  relation_type = excluded.relation_type,
  status = excluded.status;

-- -----------------------------------------------------------------------------
-- FUENTES
-- -----------------------------------------------------------------------------

insert into public.sources (
  id, name, url, source_type, author_or_publisher, publication_date, accessed_at
)
values
  (
    'c4220000-0000-0000-0000-000000000001',
    'Historia · Agrupación Musical Nuestra Señora de la Encarnación',
    'https://www.amencarnacion.com/historia/',
    'Web oficial',
    'Agrupación Musical Nuestra Señora de la Encarnación',
    null,
    '2026-08-17'
  ),
  (
    'c4220000-0000-0000-0000-000000000002',
    '25.º aniversario del acompañamiento musical en Pino Montano',
    'https://hermandadpinomontano.es/concierto-a-m-ntra-sra-de-la-encarnacion/',
    'Web oficial',
    'Hermandad de Pino Montano',
    '2022-03-10',
    '2026-08-17'
  ),
  (
    'c4220000-0000-0000-0000-000000000003',
    'Pino Montano · acompañamiento musical',
    'https://www.hermandades-de-sevilla.org/semanasanta/vd_pino_montano.html',
    'Fuente institucional',
    'Consejo General de Hermandades y Cofradías de Sevilla',
    null,
    '2026-08-17'
  ),
  (
    'c4220000-0000-0000-0000-000000000004',
    'Divino Perdón · acompañamiento musical',
    'https://www.hermandades-de-sevilla.org/semanasanta/sp_divino_perdon.html',
    'Fuente institucional',
    'Consejo General de Hermandades y Cofradías de Sevilla',
    null,
    '2026-08-17'
  ),
  (
    'c4220000-0000-0000-0000-000000000005',
    'Inicio del acompañamiento al Divino Perdón',
    'https://cofradiastv.com/la-agrupacion-musical-de-san-benito-acompanara-al-senor-del-divino-perdon-en-su-procesion-extraordinaria-del-5-de-octubre/',
    'Prensa cofrade',
    'Cofradías TV',
    '2025-09-02',
    '2026-08-17'
  ),
  (
    'c4220000-0000-0000-0000-000000000006',
    'La Paz · acompañamiento musical',
    'https://www.hermandades-de-sevilla.org/semanasanta/dramos_la_paz.html',
    'Fuente institucional',
    'Consejo General de Hermandades y Cofradías de Sevilla',
    null,
    '2026-08-17'
  ),
  (
    'c4220000-0000-0000-0000-000000000007',
    'San Benito · acompañamiento musical',
    'https://www.hermandades-de-sevilla.org/semanasanta/mt_san_benito.html',
    'Fuente institucional',
    'Consejo General de Hermandades y Cofradías de Sevilla',
    null,
    '2026-08-17'
  ),
  (
    'c4220000-0000-0000-0000-000000000008',
    'Bendecido el nuevo banderín',
    'https://www.amencarnacion.com/bendecido-el-nuevo-banderin/',
    'Web oficial',
    'Agrupación Musical Nuestra Señora de la Encarnación',
    '2014-03-26',
    '2026-08-17'
  ),
  (
    'c4220000-0000-0000-0000-000000000009',
    'Insignias de la Hermandad de San Benito',
    'https://hermandaddesanbenito.net/insignias-de-la-hermandad/',
    'Web oficial',
    'Hermandad de San Benito',
    null,
    '2026-08-17'
  ),
  (
    'c4220000-0000-0000-0000-00000000000a',
    'Una despedida y una bienvenida',
    'https://www.amencarnacion.com/una-despedida-y-una-bienvenida/',
    'Web oficial',
    'Agrupación Musical Nuestra Señora de la Encarnación',
    '2022-09-22',
    '2026-08-17'
  ),
  (
    'c4220000-0000-0000-0000-00000000000b',
    'Sede social · Agrupación Musical Nuestra Señora de la Encarnación',
    'https://www.amencarnacion.com/sede-social/',
    'Web oficial',
    'Agrupación Musical Nuestra Señora de la Encarnación',
    null,
    '2026-08-17'
  )
on conflict (id) do update set
  name = excluded.name,
  url = excluded.url,
  source_type = excluded.source_type,
  author_or_publisher = excluded.author_or_publisher,
  publication_date = excluded.publication_date,
  accessed_at = excluded.accessed_at;

insert into public.source_links (id, source_id, entity_id, scope)
values
  (
    'c4230000-0000-0000-0000-000000000001',
    'c4220000-0000-0000-0000-000000000001',
    'cb04a5d8-e81e-4405-a001-9d5a60840924',
    'Historia, fundación y evolución de los acompañamientos de la formación'
  ),
  (
    'c4230000-0000-0000-0000-000000000002',
    'c4220000-0000-0000-0000-00000000000b',
    'cb04a5d8-e81e-4405-a001-9d5a60840924',
    'Sede social y espacios de ensayo'
  )
on conflict (id) do update set
  source_id = excluded.source_id,
  entity_id = excluded.entity_id,
  scope = excluded.scope;

-- -----------------------------------------------------------------------------
-- ACOMPAÑAMIENTOS ACTUALES E HISTÓRICO
-- -----------------------------------------------------------------------------

insert into public.music_accompaniment_periods (
  id, brotherhood_entity_id, band_entity_id, step_entity_id,
  public_brotherhood_name, public_brotherhood_slug, public_step_name,
  position, outing_type, date_from_text, year_from, year_to,
  is_current, notes, status
)
select
  data.id::uuid,
  brotherhood.id,
  'cb04a5d8-e81e-4405-a001-9d5a60840924',
  step.id,
  data.public_brotherhood_name,
  brotherhood.slug,
  data.public_step_name,
  'Tras el paso',
  data.outing_type,
  data.date_from_text,
  data.year_from,
  data.year_to,
  data.is_current,
  data.notes,
  'published'
from (values
  (
    'd4220000-0000-0000-0000-000000000001',
    'hermandad-de-pino-montano',
    'paso-misterio-jesus-de-nazaret-pino-montano',
    'Hermandad de Pino Montano',
    'Paso de misterio de Nuestro Padre Jesús de Nazaret',
    'Viernes de Dolores',
    '1997 · inicio inferido a partir del 25.º aniversario del acompañamiento conmemorado en 2022',
    1997,
    null::integer,
    true,
    'La continuidad está documentada en 2026. El año inicial 1997 es una inferencia aritmética a partir del 25.º aniversario del acompañamiento celebrado en 2022.'
  ),
  (
    'd4220000-0000-0000-0000-000000000002',
    'hermandad-del-divino-perdon',
    'paso-jesus-del-divino-perdon',
    'Hermandad del Divino Perdón',
    'Paso de Nuestro Padre Jesús del Divino Perdón',
    'Sábado de Pasión',
    '2026',
    2026,
    null::integer,
    true,
    'Nueva vinculación para la Semana Santa de 2026, anunciada en septiembre de 2025.'
  ),
  (
    'd4220000-0000-0000-0000-000000000003',
    'hermandad-de-la-paz',
    'paso-jesus-de-la-victoria-la-paz',
    'Hermandad de la Paz',
    'Paso de Nuestro Padre Jesús de la Victoria',
    'Domingo de Ramos',
    '2001',
    2001,
    null::integer,
    true,
    'La historia oficial de la Agrupación sitúa en 2001 el inicio del acompañamiento a Nuestro Padre Jesús de la Victoria.'
  ),
  (
    'd4220000-0000-0000-0000-000000000004',
    'san-benito',
    'paso-sagrada-presentacion-san-benito',
    'Hermandad de San Benito',
    'Paso de misterio de la Sagrada Presentación de Jesús al Pueblo',
    'Martes Santo',
    '1995',
    1995,
    null::integer,
    true,
    'Desde 1995 la Agrupación acompaña al misterio de la Sagrada Presentación de Jesús al Pueblo.'
  ),
  (
    'd4220000-0000-0000-0000-000000000005',
    'san-benito',
    'paso-cristo-de-la-sangre-san-benito',
    'Hermandad de San Benito',
    'Paso del Santísimo Cristo de la Sangre',
    'Martes Santo',
    '1993–1994',
    1993,
    1994,
    false,
    'La Agrupación acompañó al Santísimo Cristo de la Sangre durante las Semanas Santas de 1993 y 1994 antes de pasar al misterio de la Sagrada Presentación en 1995.'
  )
) as data(
  id, brotherhood_slug, step_slug, public_brotherhood_name, public_step_name,
  outing_type, date_from_text, year_from, year_to, is_current, notes
)
join public.entities brotherhood on brotherhood.slug = data.brotherhood_slug
join public.entities step on step.slug = data.step_slug
on conflict (id) do update set
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  band_entity_id = excluded.band_entity_id,
  step_entity_id = excluded.step_entity_id,
  public_brotherhood_name = excluded.public_brotherhood_name,
  public_brotherhood_slug = excluded.public_brotherhood_slug,
  public_step_name = excluded.public_step_name,
  position = excluded.position,
  outing_type = excluded.outing_type,
  date_from_text = excluded.date_from_text,
  year_from = excluded.year_from,
  year_to = excluded.year_to,
  is_current = excluded.is_current,
  notes = excluded.notes,
  status = excluded.status;

insert into public.source_links (
  id, source_id, music_accompaniment_period_id, scope
)
values
  ('c4231000-0000-0000-0000-000000000001', 'c4220000-0000-0000-0000-000000000002', 'd4220000-0000-0000-0000-000000000001', 'Antigüedad del vínculo: 25.º aniversario conmemorado en 2022'),
  ('c4231000-0000-0000-0000-000000000002', 'c4220000-0000-0000-0000-000000000003', 'd4220000-0000-0000-0000-000000000001', 'Acompañamiento musical vigente'),
  ('c4231000-0000-0000-0000-000000000003', 'c4220000-0000-0000-0000-000000000004', 'd4220000-0000-0000-0000-000000000002', 'Acompañamiento musical vigente'),
  ('c4231000-0000-0000-0000-000000000004', 'c4220000-0000-0000-0000-000000000005', 'd4220000-0000-0000-0000-000000000002', 'Inicio de la nueva vinculación'),
  ('c4231000-0000-0000-0000-000000000005', 'c4220000-0000-0000-0000-000000000001', 'd4220000-0000-0000-0000-000000000003', 'Inicio del vínculo en 2001'),
  ('c4231000-0000-0000-0000-000000000006', 'c4220000-0000-0000-0000-000000000006', 'd4220000-0000-0000-0000-000000000003', 'Acompañamiento musical vigente'),
  ('c4231000-0000-0000-0000-000000000007', 'c4220000-0000-0000-0000-000000000001', 'd4220000-0000-0000-0000-000000000004', 'Inicio del acompañamiento al misterio en 1995'),
  ('c4231000-0000-0000-0000-000000000008', 'c4220000-0000-0000-0000-000000000007', 'd4220000-0000-0000-0000-000000000004', 'Acompañamiento musical vigente'),
  ('c4231000-0000-0000-0000-000000000009', 'c4220000-0000-0000-0000-000000000001', 'd4220000-0000-0000-0000-000000000005', 'Acompañamiento histórico al Cristo de la Sangre en 1993 y 1994')
on conflict (id) do update set
  source_id = excluded.source_id,
  music_accompaniment_period_id = excluded.music_accompaniment_period_id,
  scope = excluded.scope;

-- -----------------------------------------------------------------------------
-- DIRECCIÓN ACTUAL
-- -----------------------------------------------------------------------------

insert into public.entities (id, entity_type, name, slug, summary, status)
values (
  'e4220000-0000-0000-0000-000000000001',
  'agent',
  'Ángel Rodríguez Romero',
  'angel-rodriguez-romero',
  'Director de la Agrupación Musical Nuestra Señora de la Encarnación.',
  'published'
)
on conflict (slug) do update set
  name = excluded.name,
  summary = excluded.summary;

update public.entities
set status = 'published'
where slug = 'angel-rodriguez-romero'
  and status <> 'archived';

insert into public.agents (
  entity_id, agent_kind, description
)
select
  id,
  'person',
  'Músico y director de la Agrupación Musical Nuestra Señora de la Encarnación. Forma parte de la formación desde 1996 y ejerció como subdirector desde el curso 2005-2006 antes de asumir la dirección en 2022.'
from public.entities
where slug = 'angel-rodriguez-romero'
on conflict (entity_id) do update set
  agent_kind = excluded.agent_kind,
  description = excluded.description;

insert into public.band_agents (
  id, band_entity_id, agent_entity_id, role_name,
  date_from, date_from_text, is_current, notes
)
select
  'b4230000-0000-0000-0000-000000000001',
  'cb04a5d8-e81e-4405-a001-9d5a60840924',
  agent.id,
  'Director',
  '2022-09-14',
  'Septiembre de 2022',
  true,
  'Miembro de la Agrupación desde 1996 y subdirector desde el curso 2005-2006.'
from public.entities agent
where agent.slug = 'angel-rodriguez-romero'
on conflict (id) do update set
  band_entity_id = excluded.band_entity_id,
  agent_entity_id = excluded.agent_entity_id,
  role_name = excluded.role_name,
  date_from = excluded.date_from,
  date_from_text = excluded.date_from_text,
  is_current = excluded.is_current,
  notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope)
select
  'c4232000-0000-0000-0000-000000000001',
  'c4220000-0000-0000-0000-00000000000a',
  agent.id,
  'Designación como director y trayectoria previa dentro de la Agrupación'
from public.entities agent
where agent.slug = 'angel-rodriguez-romero'
on conflict (id) do update set
  source_id = excluded.source_id,
  entity_id = excluded.entity_id,
  scope = excluded.scope;

-- -----------------------------------------------------------------------------
-- PATRIMONIO · BANDERÍN DE LA AGRUPACIÓN MUSICAL
-- -----------------------------------------------------------------------------

insert into public.entities (id, entity_type, name, slug, summary, status)
values (
  'f4220000-0000-0000-0000-000000000001',
  'heritage_asset',
  'Banderín de la Agrupación Musical Nuestra Señora de la Encarnación',
  'banderin-agrupacion-musical-nuestra-senora-de-la-encarnacion',
  'Banderín de la formación bendecido y estrenado en 2014, con bordados de Jesús Rosado e imaginería de Juan Antonio Blanco Ramos.',
  'published'
)
on conflict (slug) do update set
  name = excluded.name,
  summary = excluded.summary,
  status = excluded.status;

insert into public.heritage_assets (
  entity_id, parent_entity_id, asset_type, description, technique,
  date_from, date_from_text, origin_notes, is_current, is_featured, display_order
)
select
  asset.id,
  'cb04a5d8-e81e-4405-a001-9d5a60840924',
  'Banderín',
  'Paño de terciopelo morado con ornamentación barroca y escudo de la Hermandad bordado en oro. La gloria representa el misterio de la Encarnación, inspirada en la obra de Murillo, mediante una talla en alto relieve de madera de cedro real, dorada y estofada.',
  'Bordado en oro, talla en madera de cedro, dorado, estofado y orfebrería',
  '2014-03-25',
  '2014',
  'El paño actual fue bendecido el 25 de marzo de 2014. El asta de alpaca plateada conserva el templete barroco con una pequeña reproducción del Señor de la Presentación realizada por Orfebrería Andaluza en 2003.',
  true,
  true,
  0
from public.entities asset
where asset.slug = 'banderin-agrupacion-musical-nuestra-senora-de-la-encarnacion'
on conflict (entity_id) do update set
  parent_entity_id = excluded.parent_entity_id,
  asset_type = excluded.asset_type,
  description = excluded.description,
  technique = excluded.technique,
  date_from = excluded.date_from,
  date_from_text = excluded.date_from_text,
  origin_notes = excluded.origin_notes,
  is_current = excluded.is_current,
  is_featured = excluded.is_featured,
  display_order = excluded.display_order;

update public.bands band
set banderin_entity_id = asset.id
from public.entities asset
where band.entity_id = 'cb04a5d8-e81e-4405-a001-9d5a60840924'
  and asset.slug = 'banderin-agrupacion-musical-nuestra-senora-de-la-encarnacion';

-- Autores y talleres: se reutiliza Orfebrería Andaluza si ya existe.
insert into public.entities (id, entity_type, name, slug, summary, status)
values
  (
    'e4220000-0000-0000-0000-000000000002',
    'agent',
    'Jesús Rosado Borja',
    'jesus-rosado-borja',
    'Bordador y responsable de taller de bordados.',
    'published'
  ),
  (
    'e4220000-0000-0000-0000-000000000003',
    'agent',
    'Juan Antonio Blanco Ramos',
    'juan-antonio-blanco-ramos',
    'Artista vinculado a trabajos de imaginería y pintura para la Hermandad de San Benito.',
    'published'
  ),
  (
    'e4220000-0000-0000-0000-000000000004',
    'agent',
    'Manuel de los Ríos e hijos',
    'manuel-de-los-rios-e-hijos',
    'Taller de orfebrería sevillano conocido comercialmente como Orfebrería Andaluza.',
    'published'
  )
on conflict (slug) do update set
  name = excluded.name,
  summary = excluded.summary;

update public.entities
set status = 'published'
where slug in (
  'jesus-rosado-borja',
  'juan-antonio-blanco-ramos',
  'manuel-de-los-rios-e-hijos'
)
  and status <> 'archived';

insert into public.agents (entity_id, agent_kind, description)
select entity.id, data.agent_kind, data.description
from (values
  ('jesus-rosado-borja', 'person', 'Bordador y responsable de un taller especializado en bordado artístico.'),
  ('juan-antonio-blanco-ramos', 'person', 'Artista autor de la imaginería de la gloria del banderín de la Agrupación Musical Nuestra Señora de la Encarnación.'),
  ('manuel-de-los-rios-e-hijos', 'workshop', 'Taller de orfebrería sevillano conocido comercialmente como Orfebrería Andaluza.')
) as data(slug, agent_kind, description)
join public.entities entity on entity.slug = data.slug
on conflict (entity_id) do update set
  agent_kind = excluded.agent_kind,
  description = excluded.description;

insert into public.agent_names (
  agent_entity_id, name, name_type, is_current, notes
)
select
  agent.id,
  'Orfebrería Andaluza',
  'commercial',
  true,
  'Denominación comercial documentada del taller.'
from public.entities agent
where agent.slug = 'manuel-de-los-rios-e-hijos'
  and not exists (
    select 1
    from public.agent_names existing
    where existing.agent_entity_id = agent.id
      and existing.name = 'Orfebrería Andaluza'
      and existing.is_current = true
  );

insert into public.heritage_interventions (
  id, target_entity_id, agent_entity_id, discipline,
  intervention_type, phase, element_name,
  date_from, date_from_text, description, status
)
select
  data.id::uuid,
  asset.id,
  agent.id,
  data.discipline,
  data.intervention_type,
  data.phase,
  data.element_name,
  data.date_from::date,
  data.date_from_text,
  data.description,
  'published'
from (values
  (
    'a4230000-0000-0000-0000-000000000001',
    'jesus-rosado-borja',
    'Bordados',
    'Realización',
    'Diseño y bordado',
    'Paño del banderín',
    '2014-03-25',
    '2014',
    'Diseño y confección de los bordados en oro del paño de terciopelo morado.'
  ),
  (
    'a4230000-0000-0000-0000-000000000002',
    'juan-antonio-blanco-ramos',
    'Imaginería',
    'Realización',
    'Gloria central',
    'Gloria del banderín',
    '2014-03-25',
    '2014',
    'Gloria en alto relieve tallada en madera de cedro real, dorada con oro fino y estofada, representando el misterio de la Encarnación.'
  ),
  (
    'a4230000-0000-0000-0000-000000000003',
    'manuel-de-los-rios-e-hijos',
    'Orfebrería',
    'Realización',
    'Asta y templete',
    'Asta del banderín',
    '2003-01-01',
    '2003',
    'Asta de alpaca plateada rematada por un templete barroco con una pequeña reproducción del Señor de la Presentación.'
  )
) as data(
  id, agent_slug, discipline, intervention_type, phase,
  element_name, date_from, date_from_text, description
)
join public.entities asset
  on asset.slug = 'banderin-agrupacion-musical-nuestra-senora-de-la-encarnacion'
join public.entities agent
  on agent.slug = data.agent_slug
on conflict (id) do update set
  target_entity_id = excluded.target_entity_id,
  agent_entity_id = excluded.agent_entity_id,
  discipline = excluded.discipline,
  intervention_type = excluded.intervention_type,
  phase = excluded.phase,
  element_name = excluded.element_name,
  date_from = excluded.date_from,
  date_from_text = excluded.date_from_text,
  description = excluded.description,
  status = excluded.status;

-- Fuentes del banderín: ficha patrimonial general y cada contribución.
insert into public.source_links (id, source_id, entity_id, scope)
select
  'c4233000-0000-0000-0000-000000000001',
  'c4220000-0000-0000-0000-000000000009',
  asset.id,
  'Descripción, autorías y cronología del banderín'
from public.entities asset
where asset.slug = 'banderin-agrupacion-musical-nuestra-senora-de-la-encarnacion'
on conflict (id) do update set
  source_id = excluded.source_id,
  entity_id = excluded.entity_id,
  scope = excluded.scope;

insert into public.source_links (id, source_id, intervention_id, scope)
values
  ('c4233000-0000-0000-0000-000000000002', 'c4220000-0000-0000-0000-000000000008', 'a4230000-0000-0000-0000-000000000001', 'Diseño y confección de los bordados del banderín'),
  ('c4233000-0000-0000-0000-000000000003', 'c4220000-0000-0000-0000-000000000008', 'a4230000-0000-0000-0000-000000000002', 'Autoría y técnica de la gloria del banderín'),
  ('c4233000-0000-0000-0000-000000000004', 'c4220000-0000-0000-0000-000000000009', 'a4230000-0000-0000-0000-000000000003', 'Autoría y datación del asta y templete')
on conflict (id) do update set
  source_id = excluded.source_id,
  intervention_id = excluded.intervention_id,
  scope = excluded.scope;
