-- Hilo Cofrade · Patrimonio y autores reutilizables de Las Cigarreras
--
-- 1) Vincula cada estreno con su marcha y modela compositores y adaptadores
--    como agentes reutilizables.
-- 2) Incorpora el banderín como pieza patrimonial opcional de la banda.
-- 3) Prepara el enlace a cada hermandad sin publicar fichas incompletas.

-- -----------------------------------------------------------------------------
-- Relaciones públicas y archivo visual de piezas patrimoniales
-- -----------------------------------------------------------------------------

alter table public.music_accompaniment_periods
  add column if not exists public_brotherhood_slug text;

update public.music_accompaniment_periods mp
set public_brotherhood_slug = e.slug
from public.entities e
where e.id = mp.brotherhood_entity_id
  and mp.band_entity_id = 'b1000000-0000-0000-0000-000000000001';

alter table public.heritage_assets
  add column if not exists public_image_path text,
  add column if not exists public_image_alt text,
  add column if not exists public_image_credit text;

-- -----------------------------------------------------------------------------
-- Marchas y autorías normalizadas
-- -----------------------------------------------------------------------------

alter table public.band_premieres
  add column if not exists march_entity_id uuid references public.entities(id) on delete set null;

alter table public.march_authors
  add column if not exists status text not null default 'published';

alter table public.march_authors
  drop constraint if exists march_authors_status_check;

alter table public.march_authors
  add constraint march_authors_status_check check (
    status in ('draft','review','published','archived')
  );

drop policy if exists "Public march authors" on public.march_authors;
drop policy if exists "Published march authors" on public.march_authors;

create policy "Published march authors"
on public.march_authors for select
using (
  status = 'published'
  and exists (
    select 1 from public.entities e
    where e.id = march_entity_id and e.status = 'published'
  )
);

insert into public.entities (id, entity_type, name, slug, summary, status) values
(
  'd1000000-0000-0000-0000-000000000001',
  'agent',
  'Manuel Alejandro González Cruz',
  'manuel-alejandro-gonzalez-cruz',
  'Compositor relacionado con el repertorio de Las Cigarreras.',
  'published'
),
(
  'd1000000-0000-0000-0000-000000000002',
  'agent',
  'Marco Frisina',
  'marco-frisina',
  'Compositor de Ánima Christi.',
  'published'
),
(
  'd1000000-0000-0000-0000-000000000003',
  'agent',
  'Cristóbal López Gándara',
  'cristobal-lopez-gandara',
  'Compositor y adaptador: adapta Ánima Christi para cornetas y tambores y compone ¡Viva la Asunción Gloriosa! para banda de música.',
  'published'
)
on conflict (slug) do update set
  name = excluded.name,
  summary = excluded.summary,
  status = excluded.status;

insert into public.agents (entity_id, agent_kind, description)
select e.id, 'person', v.description
from (values
  ('manuel-alejandro-gonzalez-cruz', 'Compositor de música procesional.'),
  ('marco-frisina', 'Compositor de música sacra.'),
  ('cristobal-lopez-gandara', 'Compositor y adaptador de música procesional.')
) as v(slug, description)
join public.entities e on e.slug = v.slug
on conflict (entity_id) do update set
  agent_kind = excluded.agent_kind,
  description = excluded.description;

insert into public.agent_disciplines (agent_entity_id, discipline, is_primary, notes)
select e.id, v.discipline, v.is_primary, v.notes
from (values
  ('manuel-alejandro-gonzalez-cruz', 'Composición', true, null),
  ('marco-frisina', 'Composición', true, null),
  ('cristobal-lopez-gandara', 'Composición', true, null),
  ('cristobal-lopez-gandara', 'Adaptación musical', false, 'Adaptación de Ánima Christi para cornetas y tambores.')
) as v(slug, discipline, is_primary, notes)
join public.entities e on e.slug = v.slug
on conflict (agent_entity_id, discipline) do update set
  is_primary = excluded.is_primary,
  notes = excluded.notes;

insert into public.entities (id, entity_type, name, slug, summary, status) values
(
  'd1100000-0000-0000-0000-000000000001',
  'march',
  'Yo soy la luz del mundo',
  'marcha-yo-soy-la-luz-del-mundo',
  'Marcha estrenada por Las Cigarreras en 2026.',
  'published'
),
(
  'd1100000-0000-0000-0000-000000000002',
  'march',
  'Ánima Christi',
  'marcha-anima-christi',
  'Obra de Marco Frisina adaptada para cornetas y tambores por Cristóbal López Gándara.',
  'published'
),
(
  'd1100000-0000-0000-0000-000000000003',
  'march',
  '¡Viva la Asunción Gloriosa!',
  'marcha-viva-la-asuncion-gloriosa',
  'Marcha para banda de música compuesta por Cristóbal López Gándara.',
  'published'
)
on conflict (slug) do update set
  name = excluded.name,
  summary = excluded.summary,
  status = excluded.status;

insert into public.marches (entity_id, music_type, description)
select e.id, v.music_type, v.description
from (values
  ('marcha-yo-soy-la-luz-del-mundo', 'Marcha procesional', 'Estrenada por Las Cigarreras en 2026.'),
  ('marcha-anima-christi', 'Adaptación para cornetas y tambores', 'Adaptación de la obra de Marco Frisina estrenada por Las Cigarreras en 2026.'),
  ('marcha-viva-la-asuncion-gloriosa', 'Marcha para banda de música', 'Composición de Cristóbal López Gándara para banda de música.')
) as v(slug, music_type, description)
join public.entities e on e.slug = v.slug
on conflict (entity_id) do update set
  music_type = excluded.music_type,
  description = excluded.description;

insert into public.march_authors (
  march_entity_id, agent_entity_id, author_role, notes, status
)
select m.id, a.id, v.author_role, v.notes, 'published'
from (values
  ('marcha-yo-soy-la-luz-del-mundo', 'manuel-alejandro-gonzalez-cruz', 'composer', null),
  ('marcha-anima-christi', 'marco-frisina', 'composer', null),
  ('marcha-anima-christi', 'cristobal-lopez-gandara', 'adapter', 'Adaptación para cornetas y tambores.'),
  ('marcha-viva-la-asuncion-gloriosa', 'cristobal-lopez-gandara', 'composer', 'Composición para banda de música.')
) as v(march_slug, agent_slug, author_role, notes)
join public.entities m on m.slug = v.march_slug
join public.entities a on a.slug = v.agent_slug
on conflict (march_entity_id, agent_entity_id, author_role) do update set
  notes = excluded.notes,
  status = excluded.status;

update public.band_premieres bp
set march_entity_id = m.id,
    composer_name = 'Manuel Alejandro González Cruz'
from public.entities m
where bp.id = 'b1400000-0000-0000-0000-000000000001'
  and m.slug = 'marcha-yo-soy-la-luz-del-mundo';

update public.band_premieres bp
set march_entity_id = m.id,
    composer_name = 'Marco Frisina'
from public.entities m
where bp.id = 'b2700000-0000-0000-0000-000000000001'
  and m.slug = 'marcha-anima-christi';

-- -----------------------------------------------------------------------------
-- Banderín de Las Cigarreras
-- -----------------------------------------------------------------------------

insert into public.entities (id, entity_type, name, slug, summary, status) values
(
  'd1200000-0000-0000-0000-000000000001',
  'heritage_asset',
  'Banderín de Las Cigarreras',
  'banderin-de-las-cigarreras',
  'Banderín realizado en 1999 y restaurado en 2017.',
  'published'
)
on conflict (slug) do update set
  name = excluded.name,
  summary = excluded.summary,
  status = excluded.status;

insert into public.heritage_assets (
  entity_id, parent_entity_id, asset_type, description, technique,
  date_from, date_from_text, is_current, origin_notes, display_order,
  is_featured, public_image_path, public_image_alt, public_image_credit, notes
)
select
  asset.id,
  band.id,
  'Banderín',
  'Banderín corporativo realizado en 1999, con bordados de Antonio Garduño Navas y orfebrería de Manuel de los Ríos e hijos, firma conocida también como Orfebrería Andaluza. La pieza fue restaurada en 2017.',
  'Bordado y orfebrería',
  date '1999-01-01',
  '1999',
  true,
  'Restaurado en 2017: los bordados en el taller de Luis Miguel Garduño Lara y la orfebrería en el de Manuel de los Ríos e hijos.',
  10,
  true,
  '/bandas/las-cigarreras/banderin-cigarreras-2017.jpg',
  'Banderín bordado de Las Cigarreras tras su restauración de 2017',
  'Foto · Alejandro Mármol',
  null
from public.entities asset
join public.entities band on band.slug = 'las-cigarreras'
where asset.slug = 'banderin-de-las-cigarreras'
on conflict (entity_id) do update set
  parent_entity_id = excluded.parent_entity_id,
  asset_type = excluded.asset_type,
  description = excluded.description,
  technique = excluded.technique,
  date_from = excluded.date_from,
  date_from_text = excluded.date_from_text,
  is_current = excluded.is_current,
  origin_notes = excluded.origin_notes,
  display_order = excluded.display_order,
  is_featured = excluded.is_featured,
  public_image_path = excluded.public_image_path,
  public_image_alt = excluded.public_image_alt,
  public_image_credit = excluded.public_image_credit,
  notes = excluded.notes;

insert into public.entities (id, entity_type, name, slug, summary, status) values
(
  'd1300000-0000-0000-0000-000000000001',
  'agent',
  'Antonio Garduño Navas',
  'antonio-garduno-navas',
  'Bordador responsable de los bordados del banderín de Las Cigarreras en 1999.',
  'published'
),
(
  'd1300000-0000-0000-0000-000000000002',
  'agent',
  'Manuel de los Ríos e hijos',
  'manuel-de-los-rios-e-hijos',
  'Taller de orfebrería conocido también como Orfebrería Andaluza.',
  'published'
),
(
  'd1300000-0000-0000-0000-000000000003',
  'agent',
  'Luis Miguel Garduño Lara',
  'luis-miguel-garduno-lara',
  'Bordador responsable de la restauración textil del banderín de Las Cigarreras en 2017.',
  'published'
)
on conflict (slug) do update set
  name = excluded.name,
  summary = excluded.summary,
  status = excluded.status;

insert into public.agents (entity_id, agent_kind, description)
select e.id, v.agent_kind, v.description
from (values
  ('antonio-garduno-navas', 'person', 'Bordador relacionado con el patrimonio de Las Cigarreras.'),
  ('manuel-de-los-rios-e-hijos', 'workshop', 'Taller de orfebrería conocido también como Orfebrería Andaluza.'),
  ('luis-miguel-garduno-lara', 'person', 'Bordador y restaurador textil relacionado con el patrimonio de Las Cigarreras.')
) as v(slug, agent_kind, description)
join public.entities e on e.slug = v.slug
on conflict (entity_id) do update set
  agent_kind = excluded.agent_kind,
  description = excluded.description;

insert into public.agent_names (
  id, agent_entity_id, name, name_type, is_current, notes
)
select
  'd1400000-0000-0000-0000-000000000001',
  e.id,
  'Orfebrería Andaluza',
  'commercial',
  true,
  'Denominación comercial de Manuel de los Ríos e hijos.'
from public.entities e
where e.slug = 'manuel-de-los-rios-e-hijos'
on conflict (id) do update set
  agent_entity_id = excluded.agent_entity_id,
  name = excluded.name,
  name_type = excluded.name_type,
  is_current = excluded.is_current,
  notes = excluded.notes;

insert into public.agent_disciplines (agent_entity_id, discipline, is_primary, notes)
select e.id, v.discipline, v.is_primary, v.notes
from (values
  ('antonio-garduno-navas', 'Bordado', true, 'Realización del banderín en 1999.'),
  ('manuel-de-los-rios-e-hijos', 'Orfebrería', true, 'Realización y restauración de la orfebrería del banderín.'),
  ('luis-miguel-garduno-lara', 'Bordado', true, 'Restauración de los bordados en 2017.'),
  ('luis-miguel-garduno-lara', 'Restauración textil', false, 'Restauración del banderín en 2017.')
) as v(slug, discipline, is_primary, notes)
join public.entities e on e.slug = v.slug
on conflict (agent_entity_id, discipline) do update set
  is_primary = excluded.is_primary,
  notes = excluded.notes;

insert into public.heritage_interventions (
  id, target_entity_id, agent_entity_id, discipline, element_name,
  intervention_type, phase, date_from, date_from_text, description, status
)
select
  v.id::uuid,
  asset.id,
  agent.id,
  v.discipline,
  'Banderín de Las Cigarreras',
  v.intervention_type,
  v.phase,
  v.date_from,
  v.date_from_text,
  v.description,
  'published'
from (values
  ('d1500000-0000-0000-0000-000000000001', 'antonio-garduno-navas', 'Bordados', 'Realización', 'Bordado', date '1999-01-01', '1999', 'Realización de los bordados del banderín.'),
  ('d1500000-0000-0000-0000-000000000002', 'manuel-de-los-rios-e-hijos', 'Orfebrería', 'Realización', 'Orfebrería', date '1999-01-01', '1999', 'Realización de la orfebrería del banderín.'),
  ('d1500000-0000-0000-0000-000000000003', 'luis-miguel-garduno-lara', 'Bordados', 'Restauración', 'Restauración textil', date '2017-01-01', '2017', 'Restauración de los bordados del banderín.'),
  ('d1500000-0000-0000-0000-000000000004', 'manuel-de-los-rios-e-hijos', 'Orfebrería', 'Restauración', 'Restauración de orfebrería', date '2017-01-01', '2017', 'Restauración de la orfebrería del banderín.')
) as v(id, agent_slug, discipline, intervention_type, phase, date_from, date_from_text, description)
join public.entities asset on asset.slug = 'banderin-de-las-cigarreras'
join public.entities agent on agent.slug = v.agent_slug
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

update public.bands
set hero_image_credit = 'Foto · Las Cigarreras'
where entity_id = 'b1000000-0000-0000-0000-000000000001';
