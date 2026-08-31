-- Hilo Cofrade · Acompañamiento histórico de Las Cigarreras con San Bernardo
--
-- Conserva el periodo 1993–2003 como una relación histórica y vincula la
-- curiosidad resultante con la hermandad, la marcha y su compositor.

-- -----------------------------------------------------------------------------
-- Hermandad y paso relacionado
-- -----------------------------------------------------------------------------

insert into public.entities (id, entity_type, name, slug, status)
values (
  'e1000000-0000-0000-0000-000000000001',
  'brotherhood',
  'Hermandad de San Bernardo',
  'hermandad-de-san-bernardo',
  'draft'
)
on conflict (slug) do update set
  name = excluded.name;

insert into public.brotherhoods (
  entity_id, official_name, popular_name, municipality_id,
  brotherhood_types, current_procession_day
)
select
  h.id,
  'Hermandad de San Bernardo',
  'San Bernardo',
  m.id,
  array['Penitencia']::text[],
  'Miércoles Santo'
from public.entities h
join public.municipalities m on m.slug = 'sevilla'
where h.slug = 'hermandad-de-san-bernardo'
on conflict (entity_id) do update set
  official_name = excluded.official_name,
  popular_name = excluded.popular_name,
  municipality_id = excluded.municipality_id,
  brotherhood_types = excluded.brotherhood_types,
  current_procession_day = excluded.current_procession_day;

insert into public.entities (id, entity_type, name, slug, status)
values (
  'e1100000-0000-0000-0000-000000000001',
  'step',
  'Paso de misterio del Santísimo Cristo de la Salud',
  'paso-misterio-cristo-salud-san-bernardo',
  'draft'
)
on conflict (slug) do update set
  name = excluded.name;

insert into public.steps (entity_id, step_type, current_condition)
select id, 'Misterio', 'preserved'
from public.entities
where slug = 'paso-misterio-cristo-salud-san-bernardo'
on conflict (entity_id) do update set
  step_type = excluded.step_type,
  current_condition = excluded.current_condition;

insert into public.brotherhood_steps (
  id, brotherhood_entity_id, step_entity_id, relation_type, status
)
select
  'e1200000-0000-0000-0000-000000000001',
  h.id,
  s.id,
  'processional_step',
  'published'
from public.entities h
join public.entities s on s.slug = 'paso-misterio-cristo-salud-san-bernardo'
where h.slug = 'hermandad-de-san-bernardo'
on conflict (id) do update set
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  step_entity_id = excluded.step_entity_id,
  relation_type = excluded.relation_type,
  status = excluded.status;

-- -----------------------------------------------------------------------------
-- Periodo histórico
-- -----------------------------------------------------------------------------

insert into public.music_accompaniment_periods (
  id, brotherhood_entity_id, band_entity_id, step_entity_id,
  public_brotherhood_name, public_brotherhood_slug, public_step_name,
  position, outing_type, year_from, year_to, is_current, notes, status
)
select
  'e1300000-0000-0000-0000-000000000001',
  h.id,
  b.id,
  s.id,
  'Hermandad de San Bernardo',
  'hermandad-de-san-bernardo',
  'Paso de misterio del Santísimo Cristo de la Salud',
  'Tras el paso del Cristo de la Salud',
  'Miércoles Santo',
  1993,
  2003,
  false,
  null,
  'published'
from public.entities h
join public.entities b on b.slug = 'las-cigarreras'
join public.entities s on s.slug = 'paso-misterio-cristo-salud-san-bernardo'
where h.slug = 'hermandad-de-san-bernardo'
on conflict (id) do update set
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  band_entity_id = excluded.band_entity_id,
  step_entity_id = excluded.step_entity_id,
  public_brotherhood_name = excluded.public_brotherhood_name,
  public_brotherhood_slug = excluded.public_brotherhood_slug,
  public_step_name = excluded.public_step_name,
  position = excluded.position,
  outing_type = excluded.outing_type,
  year_from = excluded.year_from,
  year_to = excluded.year_to,
  is_current = excluded.is_current,
  notes = excluded.notes,
  status = excluded.status;

-- -----------------------------------------------------------------------------
-- Marcha y compositor reutilizables
-- -----------------------------------------------------------------------------

insert into public.entities (id, entity_type, name, slug, summary, status)
values (
  'e1400000-0000-0000-0000-000000000001',
  'agent',
  'Francis González Ríos',
  'francis-gonzalez-rios',
  'Compositor de música procesional y autor de Refúgiame.',
  'published'
)
on conflict (slug) do update set
  name = excluded.name,
  summary = excluded.summary,
  status = excluded.status;

insert into public.agents (entity_id, agent_kind, description)
select id, 'person', 'Compositor de música procesional.'
from public.entities
where slug = 'francis-gonzalez-rios'
on conflict (entity_id) do update set
  agent_kind = excluded.agent_kind,
  description = excluded.description;

insert into public.agent_disciplines (agent_entity_id, discipline, is_primary)
select id, 'Composición', true
from public.entities
where slug = 'francis-gonzalez-rios'
on conflict (agent_entity_id, discipline) do update set
  is_primary = excluded.is_primary;

insert into public.entities (id, entity_type, name, slug, summary, status)
values (
  'e1500000-0000-0000-0000-000000000001',
  'march',
  'Refúgiame',
  'marcha-refugiame',
  'Marcha de Francis González Ríos nacida de la vinculación de Las Cigarreras con la Hermandad de San Bernardo.',
  'published'
)
on conflict (slug) do update set
  name = excluded.name,
  summary = excluded.summary,
  status = excluded.status;

insert into public.marches (entity_id, music_type, description)
select
  id,
  'Marcha procesional para cornetas y tambores',
  'Nacida de la vinculación de Las Cigarreras con la Hermandad de San Bernardo entre 1993 y 2003.'
from public.entities
where slug = 'marcha-refugiame'
on conflict (entity_id) do update set
  music_type = excluded.music_type,
  description = excluded.description;

insert into public.march_authors (
  march_entity_id, agent_entity_id, author_role, notes, status
)
select
  m.id,
  a.id,
  'composer',
  null,
  'published'
from public.entities m
join public.entities a on a.slug = 'francis-gonzalez-rios'
where m.slug = 'marcha-refugiame'
on conflict (march_entity_id, agent_entity_id, author_role) do update set
  notes = excluded.notes,
  status = excluded.status;

-- -----------------------------------------------------------------------------
-- Curiosidad editorial enlazada a todas las entidades implicadas
-- -----------------------------------------------------------------------------

insert into public.editorial_content (
  id, content_type, title, summary, body, eligible_for_daily, status
)
values (
  'e1600000-0000-0000-0000-000000000001',
  'curiosity',
  '¿Sabías que…?',
  'Las Cigarreras acompañó al Cristo de la Salud de la Hermandad de San Bernardo desde 1993 hasta 2003. De esta vinculación nace la marcha «Refúgiame», de Francis González Ríos.',
  'Las Cigarreras acompañó al Cristo de la Salud de la Hermandad de San Bernardo desde 1993 hasta 2003. De esta vinculación nace la marcha «Refúgiame», de Francis González Ríos.',
  false,
  'published'
)
on conflict (id) do update set
  content_type = excluded.content_type,
  title = excluded.title,
  summary = excluded.summary,
  body = excluded.body,
  eligible_for_daily = excluded.eligible_for_daily,
  status = excluded.status;

insert into public.editorial_content_links (
  id, editorial_content_id, entity_id, relation_type, is_primary
)
select
  v.link_id::uuid,
  'e1600000-0000-0000-0000-000000000001',
  e.id,
  v.relation_type,
  v.is_primary
from (values
  ('e1700000-0000-0000-0000-000000000001', 'las-cigarreras', 'historical_accompaniment', true),
  ('e1700000-0000-0000-0000-000000000002', 'hermandad-de-san-bernardo', 'related_brotherhood', false),
  ('e1700000-0000-0000-0000-000000000003', 'marcha-refugiame', 'featured_march', false),
  ('e1700000-0000-0000-0000-000000000004', 'francis-gonzalez-rios', 'composer', false)
) as v(link_id, entity_slug, relation_type, is_primary)
join public.entities e on e.slug = v.entity_slug
on conflict (id) do update set
  editorial_content_id = excluded.editorial_content_id,
  entity_id = excluded.entity_id,
  relation_type = excluded.relation_type,
  is_primary = excluded.is_primary;
