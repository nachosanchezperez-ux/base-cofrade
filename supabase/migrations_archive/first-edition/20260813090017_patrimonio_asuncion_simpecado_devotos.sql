-- Hilo Cofrade · Catálogo patrimonial y Simpecado de los Devotos
-- Migración 017
--
-- Desarrolla heritage_assets como ficha documental de obras y enseres. Las
-- autorías se mantienen en heritage_interventions para que cada agente pueda
-- relacionarse con distintas piezas, fases y disciplinas sin duplicar datos.

-- -----------------------------------------------------------------------------
-- Ficha documental de las piezas patrimoniales
-- -----------------------------------------------------------------------------

alter table public.heritage_assets
  add column if not exists technique text,
  add column if not exists materials text,
  add column if not exists dimensions_text text,
  add column if not exists iconography text,
  add column if not exists historical_context text,
  add column if not exists provenance_text text,
  add column if not exists blessing_date date,
  add column if not exists blessing_date_text text,
  add column if not exists display_order integer not null default 0,
  add column if not exists is_featured boolean not null default false;

create index if not exists heritage_assets_parent_order_idx
  on public.heritage_assets(parent_entity_id, display_order, date_from);

-- -----------------------------------------------------------------------------
-- Simpecado de los Devotos · 2021
-- -----------------------------------------------------------------------------

insert into public.entities (id, entity_type, name, slug, summary, status) values (
  '3d000000-0000-0000-0000-000000000001',
  'heritage_asset',
  'Simpecado de los Devotos',
  'simpecado-de-los-devotos-asuncion-cantillana',
  'Exvoto ofrecido por un grupo de devotos asuncionistas durante la pandemia de COVID-19 y bendecido el 15 de agosto de 2021.',
  'published'
)
on conflict (id) do update set
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.heritage_assets (
  entity_id,
  parent_entity_id,
  asset_type,
  description,
  technique,
  iconography,
  historical_context,
  provenance_text,
  blessing_date,
  blessing_date_text,
  date_from,
  date_from_text,
  is_current,
  origin_notes,
  display_order,
  is_featured,
  notes
) values (
  '3d000000-0000-0000-0000-000000000001',
  '30000000-0000-0000-0000-000000000002',
  'Simpecado',
  'El Simpecado de los Devotos nació como exvoto de un grupo de devotos asuncionistas durante la pandemia de COVID-19. Siguiendo el ejemplo de las fundadoras de la Corporación, se encomendaron a la Santísima Virgen y ofrecieron esta nueva pieza, bendecida el 15 de agosto de 2021.',
  'Diseño ornamental de inspiración textil histórica',
  'El dibujo recoge la transición del tardobarroco al clasicismo de finales del siglo XVIII y comienzos del XIX. Adopta el corte característico del taller de las Hermanas Zuloaga, con penacho, orejetas superiores, amplio desarrollo de los picos inferiores y ornamentación vegetal.',
  'La pieza fue promovida durante la epidemia causada por la COVID-19 como testimonio de gratitud y devoción.',
  'Donación colectiva de un grupo de devotos asuncionistas a modo de exvoto.',
  '2021-08-15',
  '15 de agosto de 2021',
  '2021-08-15',
  '2021',
  true,
  'Concebido como una obra contemporánea conectada con modelos históricos del patrimonio textil cofrade.',
  10,
  true,
  'La ficha queda abierta a incorporar materiales, dimensiones, taller de ejecución e imágenes autorizadas cuando consten documentalmente.'
)
on conflict (entity_id) do update set
  parent_entity_id = excluded.parent_entity_id,
  asset_type = excluded.asset_type,
  description = excluded.description,
  technique = excluded.technique,
  iconography = excluded.iconography,
  historical_context = excluded.historical_context,
  provenance_text = excluded.provenance_text,
  blessing_date = excluded.blessing_date,
  blessing_date_text = excluded.blessing_date_text,
  date_from = excluded.date_from,
  date_from_text = excluded.date_from_text,
  is_current = excluded.is_current,
  origin_notes = excluded.origin_notes,
  display_order = excluded.display_order,
  is_featured = excluded.is_featured,
  notes = excluded.notes;

-- -----------------------------------------------------------------------------
-- Autores y relaciones con la obra
-- -----------------------------------------------------------------------------

insert into public.entities (id, entity_type, name, slug, summary, status) values
(
  '3a000000-0000-0000-0000-000000000010',
  'agent',
  'José Ignacio Sánchez Rico',
  'jose-ignacio-sanchez-rico',
  'Artista responsable de la dirección artística del Simpecado de los Devotos de la Asunción de Cantillana.',
  'published'
),
(
  '3a000000-0000-0000-0000-000000000011',
  'agent',
  'Javier Sánchez de los Reyes',
  'javier-sanchez-de-los-reyes',
  'Diseñador y dibujante del Simpecado de los Devotos de la Asunción de Cantillana.',
  'published'
)
on conflict (id) do update set
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.agents (entity_id, agent_kind, description) values
(
  '3a000000-0000-0000-0000-000000000010',
  'person',
  'Artista y proyectista vinculado a la creación de patrimonio cofrade.'
),
(
  '3a000000-0000-0000-0000-000000000011',
  'person',
  'Diseñador y dibujante vinculado a la creación de patrimonio cofrade.'
)
on conflict (entity_id) do update set
  agent_kind = excluded.agent_kind,
  description = excluded.description;

insert into public.agent_disciplines (agent_entity_id, discipline, is_primary, notes) values
('3a000000-0000-0000-0000-000000000010','Dirección artística',true,'Dirección artística del Simpecado de los Devotos.'),
('3a000000-0000-0000-0000-000000000010','Diseño',false,null),
('3a000000-0000-0000-0000-000000000011','Diseño',true,'Diseño y dibujo del Simpecado de los Devotos.'),
('3a000000-0000-0000-0000-000000000011','Dibujo',false,null)
on conflict (agent_entity_id, discipline) do update set
  is_primary = excluded.is_primary,
  notes = excluded.notes;

insert into public.heritage_interventions (
  id,
  target_entity_id,
  agent_entity_id,
  discipline,
  element_name,
  intervention_type,
  phase,
  date_from,
  date_from_text,
  description,
  status
) values
(
  '3e000000-0000-0000-0000-000000000001',
  '3d000000-0000-0000-0000-000000000001',
  '3a000000-0000-0000-0000-000000000010',
  'Dirección artística',
  'Simpecado de los Devotos',
  'Creación',
  'Dirección artística',
  '2021-08-15',
  '2021',
  'Dirección artística de la nueva pieza ofrecida por los devotos.',
  'published'
),
(
  '3e000000-0000-0000-0000-000000000002',
  '3d000000-0000-0000-0000-000000000001',
  '3a000000-0000-0000-0000-000000000011',
  'Diseño y dibujo',
  'Simpecado de los Devotos',
  'Creación',
  'Diseño',
  '2021-08-15',
  '2021',
  'Autor del dibujo y del planteamiento ornamental de la pieza.',
  'published'
)
on conflict (id) do update set
  target_entity_id = excluded.target_entity_id,
  agent_entity_id = excluded.agent_entity_id,
  discipline = excluded.discipline,
  element_name = excluded.element_name,
  intervention_type = excluded.intervention_type,
  phase = excluded.phase,
  date_from = excluded.date_from,
  date_from_text = excluded.date_from_text,
  description = excluded.description,
  status = excluded.status;

-- La bendición se conserva también como hito cronológico de la Hermandad.
insert into public.heritage_updates (
  id,
  brotherhood_entity_id,
  update_type,
  title,
  update_date,
  year,
  target_entity_id,
  element_name,
  discipline,
  description,
  status
) values (
  '3b000000-0000-0000-0000-000000000006',
  '30000000-0000-0000-0000-000000000002',
  'estreno',
  'Bendición del Simpecado de los Devotos',
  '2021-08-15',
  2021,
  '3d000000-0000-0000-0000-000000000001',
  'Simpecado de los Devotos',
  'Diseño y patrimonio textil',
  'La nueva pieza, ofrecida como exvoto por un grupo de devotos asuncionistas, fue bendecida el 15 de agosto de 2021.',
  'published'
)
on conflict (id) do update set
  title = excluded.title,
  update_date = excluded.update_date,
  year = excluded.year,
  target_entity_id = excluded.target_entity_id,
  element_name = excluded.element_name,
  discipline = excluded.discipline,
  description = excluded.description,
  status = excluded.status;

insert into public.heritage_update_agents (
  heritage_update_id, agent_entity_id, role_name, discipline, notes
) values
(
  '3b000000-0000-0000-0000-000000000006',
  '3a000000-0000-0000-0000-000000000010',
  'Dirección artística',
  'Dirección artística',
  null
),
(
  '3b000000-0000-0000-0000-000000000006',
  '3a000000-0000-0000-0000-000000000011',
  'Dibujo y diseño',
  'Diseño',
  null
)
on conflict (heritage_update_id, agent_entity_id, role_name) do update set
  discipline = excluded.discipline,
  notes = excluded.notes;

-- -----------------------------------------------------------------------------
-- Fuente oficial
-- -----------------------------------------------------------------------------

insert into public.sources (
  id, name, url, source_type, author_or_publisher, accessed_at
) values (
  '36000000-0000-0000-0000-000000000011',
  'Simpecado de los Devotos',
  'https://www.asunciondecantillana.es/patrimonio/simpecados/simpecado-de-los-devotos',
  'Web oficial',
  'Hermandad de la Asunción de Cantillana',
  '2026-08-13'
)
on conflict (id) do update set
  name = excluded.name,
  url = excluded.url,
  source_type = excluded.source_type,
  author_or_publisher = excluded.author_or_publisher,
  accessed_at = excluded.accessed_at;

insert into public.source_links (source_id, entity_id, scope) values (
  '36000000-0000-0000-0000-000000000011',
  '3d000000-0000-0000-0000-000000000001',
  'Historia, bendición, promotores, dirección artística, dibujo y descripción formal del Simpecado'
);

insert into public.source_links (source_id, intervention_id, scope) values
(
  '36000000-0000-0000-0000-000000000011',
  '3e000000-0000-0000-0000-000000000001',
  'Dirección artística de José Ignacio Sánchez Rico'
),
(
  '36000000-0000-0000-0000-000000000011',
  '3e000000-0000-0000-0000-000000000002',
  'Dibujo y diseño de Javier Sánchez de los Reyes'
);

insert into public.source_links (source_id, heritage_update_id, scope) values (
  '36000000-0000-0000-0000-000000000011',
  '3b000000-0000-0000-0000-000000000006',
  'Bendición del Simpecado el 15 de agosto de 2021'
);
