-- Hilo Cofrade · Home diaria dinámica
-- Migración 030
--
-- Añade los primeros candidatos editoriales reutilizables y documenta
-- «Plegaria a la Virgen de la Asunción» como marcha para la rotación diaria.
-- El 15 de agosto de 2026 se fija como excepción editorial para conectar
-- la portada con la Asunción de Cantillana sin introducir lógica de fecha en JSX.

-- -----------------------------------------------------------------------------
-- Candidatos editoriales iniciales
-- -----------------------------------------------------------------------------

insert into public.editorial_content (
  id, content_type, title, summary, eligible_for_daily, daily_priority, status
) values
(
  'd3000000-0000-0000-0000-000000000001',
  'fact',
  '2.292 nazarenos en la estación de penitencia del Baratillo en 2026',
  'La cifra documentada de la cofradía permite relacionar la hermandad con su jornada, sus imágenes y sus pasos.',
  true,
  80,
  'published'
),
(
  'd3000000-0000-0000-0000-000000000002',
  'curiosity',
  'San José es titular del Baratillo aunque no forma parte de sus pasos procesionales',
  'La relación entre titularidad y presencia procesional se modela por separado: San José es titular, pero no tiene relación con un paso.',
  true,
  80,
  'published'
)
on conflict (id) do update set
  title = excluded.title,
  summary = excluded.summary,
  eligible_for_daily = excluded.eligible_for_daily,
  daily_priority = excluded.daily_priority,
  status = excluded.status;

insert into public.editorial_content_links (
  editorial_content_id, entity_id, relation_type, is_primary
) values
(
  'd3000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000001',
  'related',
  true
),
(
  'd3000000-0000-0000-0000-000000000002',
  '12000000-0000-0000-0000-000000000004',
  'related',
  true
)
on conflict (editorial_content_id, entity_id, relation_type) do update set
  is_primary = excluded.is_primary;

insert into public.source_links (source_id, editorial_content_id, scope)
select '16000000-0000-0000-0000-000000000002', 'd3000000-0000-0000-0000-000000000001', 'Dato Cofrade · nazarenos 2026'
where not exists (
  select 1 from public.source_links
  where source_id = '16000000-0000-0000-0000-000000000002'
    and editorial_content_id = 'd3000000-0000-0000-0000-000000000001'
);

insert into public.source_links (source_id, editorial_content_id, scope)
select '16000000-0000-0000-0000-000000000001', 'd3000000-0000-0000-0000-000000000002', 'Curiosidad · titularidad de San José'
where not exists (
  select 1 from public.source_links
  where source_id = '16000000-0000-0000-0000-000000000001'
    and editorial_content_id = 'd3000000-0000-0000-0000-000000000002'
);

-- -----------------------------------------------------------------------------
-- Marcha: Plegaria a la Virgen de la Asunción
-- -----------------------------------------------------------------------------

insert into public.entities (id, entity_type, name, slug, summary, status)
values (
  'd3010000-0000-0000-0000-000000000001',
  'agent',
  'Manuel López Farfán',
  'manuel-lopez-farfan',
  'Compositor y músico sevillano vinculado al repertorio procesional.',
  'published'
)
on conflict (slug) do update set
  name = excluded.name,
  summary = coalesce(public.entities.summary, excluded.summary),
  status = 'published';

insert into public.agents (entity_id, agent_kind, description)
select e.id, 'person', 'Compositor y músico sevillano vinculado al repertorio procesional.'
from public.entities e
where e.slug = 'manuel-lopez-farfan'
on conflict (entity_id) do update set
  agent_kind = excluded.agent_kind,
  description = coalesce(public.agents.description, excluded.description);

insert into public.agent_roles (agent_entity_id, role_name)
select e.id, 'Compositor'
from public.entities e
where e.slug = 'manuel-lopez-farfan'
  and not exists (
    select 1 from public.agent_roles ar
    where ar.agent_entity_id = e.id and ar.role_name = 'Compositor'
  );

insert into public.entities (id, entity_type, name, slug, summary, status)
values (
  'd3020000-0000-0000-0000-000000000001',
  'march',
  'Plegaria a la Virgen de la Asunción',
  'plegaria-a-la-virgen-de-la-asuncion',
  'Marcha procesional de Manuel López Farfán dedicada a la Virgen de la Asunción de Cantillana.',
  'published'
)
on conflict (slug) do update set
  name = excluded.name,
  summary = excluded.summary,
  status = 'published';

insert into public.marches (
  entity_id, composition_year, composition_date_text, music_type,
  youtube_video_id, description, eligible_for_daily, daily_priority
)
select
  e.id,
  1926,
  '1926',
  'Marcha procesional',
  'nOcty-P2C0E',
  'Marcha procesional dedicada a Nuestra Señora de la Asunción de Cantillana.',
  true,
  100
from public.entities e
where e.slug = 'plegaria-a-la-virgen-de-la-asuncion'
on conflict (entity_id) do update set
  composition_year = excluded.composition_year,
  composition_date_text = excluded.composition_date_text,
  music_type = excluded.music_type,
  youtube_video_id = excluded.youtube_video_id,
  description = excluded.description,
  eligible_for_daily = excluded.eligible_for_daily,
  daily_priority = excluded.daily_priority;

insert into public.march_authors (march_entity_id, agent_entity_id, author_role)
select m.id, a.id, 'composer'
from public.entities m
join public.entities a on a.slug = 'manuel-lopez-farfan'
where m.slug = 'plegaria-a-la-virgen-de-la-asuncion'
on conflict (march_entity_id, agent_entity_id, author_role) do nothing;

insert into public.march_dedications (
  march_entity_id, dedicatee_entity_id, dedication_type, dedication_text, date_from_text, status
)
select
  m.id,
  '33000000-0000-0000-0000-000000000001',
  'dedicated_to',
  'Dedicada a Nuestra Señora de la Asunción de Cantillana',
  '1926',
  'published'
from public.entities m
where m.slug = 'plegaria-a-la-virgen-de-la-asuncion'
on conflict (march_entity_id, dedicatee_entity_id, dedication_type) do update set
  dedication_text = excluded.dedication_text,
  date_from_text = excluded.date_from_text,
  status = excluded.status;

insert into public.sources (
  id, name, url, source_type, author_or_publisher
) values (
  'd3040000-0000-0000-0000-000000000001',
  'Plegaria a la Virgen de la Asunción · grabación de referencia',
  'https://www.youtube.com/watch?v=nOcty-P2C0E',
  'Grabación audiovisual',
  'YouTube'
)
on conflict (id) do update set
  name = excluded.name,
  url = excluded.url,
  source_type = excluded.source_type,
  author_or_publisher = excluded.author_or_publisher;

insert into public.march_recordings (
  id, march_entity_id, youtube_video_id, external_url, title, is_featured, status
)
select
  'd3030000-0000-0000-0000-000000000001',
  m.id,
  'nOcty-P2C0E',
  'https://www.youtube.com/watch?v=nOcty-P2C0E',
  'Plegaria a la Virgen de la Asunción',
  true,
  'published'
from public.entities m
where m.slug = 'plegaria-a-la-virgen-de-la-asuncion'
on conflict (id) do update set
  march_entity_id = excluded.march_entity_id,
  youtube_video_id = excluded.youtube_video_id,
  external_url = excluded.external_url,
  title = excluded.title,
  is_featured = excluded.is_featured,
  status = excluded.status;

insert into public.source_links (source_id, march_recording_id, scope)
select
  'd3040000-0000-0000-0000-000000000001',
  'd3030000-0000-0000-0000-000000000001',
  'Grabación de referencia'
where not exists (
  select 1 from public.source_links
  where source_id = 'd3040000-0000-0000-0000-000000000001'
    and march_recording_id = 'd3030000-0000-0000-0000-000000000001'
);

-- -----------------------------------------------------------------------------
-- Especial del 15 de agosto de 2026
-- -----------------------------------------------------------------------------

insert into public.daily_overrides (
  id, publish_date, content_type, title, summary, entity_id, sort_order, status, reason
) values (
  'd3050000-0000-0000-0000-000000000001',
  '2026-08-15',
  'ephemeris',
  '15 de agosto: la Asunción celebra su día grande en Cantillana',
  'La Hermandad de la Asunción celebra la festividad de su titular con la Función Solemne y la procesión anual por las calles de Cantillana.',
  '30000000-0000-0000-0000-000000000002',
  10,
  'published',
  'Especial editorial de la festividad de la Asunción'
)
on conflict (publish_date, content_type) do update set
  title = excluded.title,
  summary = excluded.summary,
  entity_id = excluded.entity_id,
  status = excluded.status,
  reason = excluded.reason;

insert into public.daily_overrides (
  id, publish_date, content_type, march_entity_id, sort_order, status, reason
)
select
  'd3050000-0000-0000-0000-000000000002',
  '2026-08-15',
  'march',
  m.id,
  40,
  'published',
  'Marcha vinculada a la festividad de la Asunción'
from public.entities m
where m.slug = 'plegaria-a-la-virgen-de-la-asuncion'
on conflict (publish_date, content_type) do update set
  march_entity_id = excluded.march_entity_id,
  status = excluded.status,
  reason = excluded.reason;
