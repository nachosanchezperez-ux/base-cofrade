-- Hilo Cofrade · Briefing cofrade de la próxima extraordinaria
-- Migración 036
--
-- Completa el caso real de Aznalcázar con información de servicio estructurada:
-- horarios, lugares, bandas por tramo y música litúrgica.
--
-- La información precisa de programación fue aportada directamente al proyecto
-- el 17/08/2026. Se conserva esa procedencia y se añade una fuente pública que
-- corrobora la participación de la Oliva de Salteras.

-- -----------------------------------------------------------------------------
-- LUGARES
-- -----------------------------------------------------------------------------

insert into public.places (
  id, municipality_id, name, slug, place_type
)
select
  'a2208260-0000-0000-0000-000000000010',
  m.id,
  'Capilla-Oratorio de Santiago Apóstol',
  'capilla-oratorio-santiago-apostol-aznalcazar',
  'capilla-oratorio'
from public.municipalities m
where m.slug = 'aznalcazar'
on conflict (slug) do update set
  municipality_id = excluded.municipality_id,
  name = excluded.name,
  place_type = excluded.place_type;

insert into public.places (
  id, municipality_id, name, slug, place_type
)
select
  'a2208260-0000-0000-0000-000000000011',
  m.id,
  'Plaza del Cabildo',
  'plaza-del-cabildo-aznalcazar',
  'plaza'
from public.municipalities m
where m.slug = 'aznalcazar'
on conflict (slug) do update set
  municipality_id = excluded.municipality_id,
  name = excluded.name,
  place_type = excluded.place_type;

-- La salida parte de la Capilla-Oratorio. La plaza del Cabildo es un hito
-- intermedio esencial, no el destino final de toda la jornada.
update public.outings
set
  departure_time = '19:00',
  origin_place_id = 'a2208260-0000-0000-0000-000000000010',
  route_summary = 'Capilla-Oratorio de Santiago Apóstol → plaza del Cabildo → procesión triunfal por Aznalcázar.'
where id = 'a2208260-0000-0000-0000-000000000002';

-- -----------------------------------------------------------------------------
-- HORARIOS E HITOS
-- -----------------------------------------------------------------------------

insert into public.outing_schedule_items (
  id, outing_id, sequence_no, label, item_date, item_time, time_text, place_id, notes
) values
(
  'a2208260-0000-0000-0000-000000000020',
  'a2208260-0000-0000-0000-000000000002',
  1,
  'Salida',
  '2026-08-22',
  '19:00',
  null,
  'a2208260-0000-0000-0000-000000000010',
  'La Virgen parte hacia la plaza del Cabildo acompañada por la Banda Municipal de Música de Bollullos del Condado.'
),
(
  'a2208260-0000-0000-0000-000000000021',
  'a2208260-0000-0000-0000-000000000002',
  2,
  'Misa estacional',
  '2026-08-22',
  '20:00',
  null,
  'a2208260-0000-0000-0000-000000000011',
  'La parte musical de la celebración litúrgica corre a cargo del Coro Apóstol Santiago.'
),
(
  'a2208260-0000-0000-0000-000000000022',
  'a2208260-0000-0000-0000-000000000002',
  3,
  'Procesión triunfal',
  '2026-08-22',
  null,
  'Tras la misa',
  'a2208260-0000-0000-0000-000000000011',
  'Tras la misa comienza la procesión por las calles de Aznalcázar, acompañada por la Banda de Música de la Oliva de Salteras.'
)
on conflict (outing_id, sequence_no) do update set
  label = excluded.label,
  item_date = excluded.item_date,
  item_time = excluded.item_time,
  time_text = excluded.time_text,
  place_id = excluded.place_id,
  notes = excluded.notes;

-- -----------------------------------------------------------------------------
-- MUNICIPIOS DE LAS FORMACIONES MUSICALES
-- -----------------------------------------------------------------------------

insert into public.municipalities (
  id, name, slug, province, autonomous_community, country
) values
(
  'a2208260-0000-0000-0000-000000000030',
  'Bollullos del Condado',
  'bollullos-del-condado',
  'Huelva',
  'Andalucía',
  'España'
),
(
  'a2208260-0000-0000-0000-000000000031',
  'Salteras',
  'salteras',
  'Sevilla',
  'Andalucía',
  'España'
)
on conflict (slug) do update set
  name = excluded.name,
  province = excluded.province,
  autonomous_community = excluded.autonomous_community,
  country = excluded.country;

-- -----------------------------------------------------------------------------
-- BANDAS
-- -----------------------------------------------------------------------------

insert into public.entities (
  id, entity_type, name, slug, summary, status
) values
(
  'a2208260-0000-0000-0000-000000000040',
  'band',
  'Banda Municipal de Música de Bollullos del Condado',
  'banda-municipal-musica-bollullos-del-condado',
  'Formación musical de Bollullos del Condado vinculada a la programación de la extraordinaria de las Angustias de Aznalcázar de 2026.',
  'published'
),
(
  'a2208260-0000-0000-0000-000000000041',
  'band',
  'Banda de Música de la Oliva de Salteras',
  'banda-musica-oliva-salteras',
  'Formación musical de Salteras vinculada a la programación de la extraordinaria de las Angustias de Aznalcázar de 2026.',
  'published'
)
on conflict (id) do update set
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.bands (
  entity_id, band_type, municipality_id, description
)
select
  'a2208260-0000-0000-0000-000000000040',
  'Banda de Música',
  m.id,
  'Acompaña a María Santísima de las Angustias desde la Capilla-Oratorio de Santiago Apóstol hasta la plaza del Cabildo el 22 de agosto de 2026.'
from public.municipalities m
where m.slug = 'bollullos-del-condado'
on conflict (entity_id) do update set
  band_type = excluded.band_type,
  municipality_id = excluded.municipality_id,
  description = excluded.description;

insert into public.bands (
  entity_id, band_type, municipality_id, description
)
select
  'a2208260-0000-0000-0000-000000000041',
  'Banda de Música',
  m.id,
  'Acompaña la procesión triunfal de María Santísima de las Angustias tras la misa estacional del 22 de agosto de 2026.'
from public.municipalities m
where m.slug = 'salteras'
on conflict (entity_id) do update set
  band_type = excluded.band_type,
  municipality_id = excluded.municipality_id,
  description = excluded.description;

-- Dos bloques musicales distintos porque la jornada cambia de acompañamiento
-- antes y después de la misa estacional.
insert into public.outing_music_positions (
  id, outing_id, sequence_no, position_code, position_label, notes, status
) values
(
  'a2208260-0000-0000-0000-000000000050',
  'a2208260-0000-0000-0000-000000000002',
  1,
  'behind_step',
  'Salida → plaza del Cabildo',
  'Acompañamiento desde la salida de la Capilla-Oratorio hasta la llegada a la plaza del Cabildo.',
  'published'
),
(
  'a2208260-0000-0000-0000-000000000051',
  'a2208260-0000-0000-0000-000000000002',
  2,
  'behind_step',
  'Procesión triunfal tras la misa',
  'Acompañamiento de la segunda parte de la jornada, una vez finalizada la misa estacional.',
  'published'
)
on conflict (outing_id, sequence_no) do update set
  position_code = excluded.position_code,
  position_label = excluded.position_label,
  notes = excluded.notes,
  status = excluded.status;

insert into public.outing_music_assignments (
  id, music_position_id, band_entity_id, participation_mode, sequence_no,
  segment_start_label, segment_end_label, notes, status
) values
(
  'a2208260-0000-0000-0000-000000000060',
  'a2208260-0000-0000-0000-000000000050',
  'a2208260-0000-0000-0000-000000000040',
  'full_route',
  1,
  'Capilla-Oratorio de Santiago Apóstol',
  'Plaza del Cabildo',
  'Acompañamiento musical de la primera parte de la jornada.',
  'published'
),
(
  'a2208260-0000-0000-0000-000000000061',
  'a2208260-0000-0000-0000-000000000051',
  'a2208260-0000-0000-0000-000000000041',
  'full_route',
  1,
  'Plaza del Cabildo',
  null,
  'Acompañamiento musical de la procesión triunfal tras la misa.',
  'published'
)
on conflict (music_position_id, band_entity_id, sequence_no) do update set
  participation_mode = excluded.participation_mode,
  segment_start_label = excluded.segment_start_label,
  segment_end_label = excluded.segment_end_label,
  notes = excluded.notes,
  status = excluded.status;

-- -----------------------------------------------------------------------------
-- CORO · MÚSICA LITÚRGICA
-- -----------------------------------------------------------------------------

insert into public.entities (
  id, entity_type, name, slug, summary, status
) values (
  'a2208260-0000-0000-0000-000000000070',
  'agent',
  'Coro Apóstol Santiago',
  'coro-apostol-santiago-aznalcazar',
  'Formación coral vinculada a celebraciones litúrgicas de Aznalcázar.',
  'published'
)
on conflict (id) do update set
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.agents (
  entity_id, agent_kind, municipality_id, description
)
select
  'a2208260-0000-0000-0000-000000000070',
  'institution',
  m.id,
  'Interviene musicalmente en la misa estacional de la extraordinaria de María Santísima de las Angustias del 22 de agosto de 2026.'
from public.municipalities m
where m.slug = 'aznalcazar'
on conflict (entity_id) do update set
  agent_kind = excluded.agent_kind,
  municipality_id = excluded.municipality_id,
  description = excluded.description;

insert into public.outing_entities (
  outing_id, entity_id, role, notes
) values (
  'a2208260-0000-0000-0000-000000000002',
  'a2208260-0000-0000-0000-000000000070',
  'liturgical_music',
  'Interviene en la misa estacional de las 20:00 en la plaza del Cabildo.'
)
on conflict (outing_id, entity_id, role) do update set
  notes = excluded.notes;

-- -----------------------------------------------------------------------------
-- PROCEDENCIA
-- -----------------------------------------------------------------------------

insert into public.sources (
  id, name, url, source_type, author_or_publisher, accessed_at, notes
) values
(
  'a2208260-0000-0000-0000-000000000080',
  'Programación de la extraordinaria de las Angustias · 22/08/2026',
  null,
  'Aportación directa',
  'Aportación directa al proyecto Hilo Cofrade',
  '2026-08-17',
  'Horario, ubicaciones, Banda Municipal de Música de Bollullos del Condado, Coro Apóstol Santiago y Banda de Música de la Oliva de Salteras facilitados directamente al proyecto. Revisar si la Hermandad comunica cambios posteriores.'
),
(
  'a2208260-0000-0000-0000-000000000081',
  'Agenda Cofrade · 22 de agosto de 2026',
  'https://infocofrade.com/agenda/',
  'Agenda especializada',
  'Info Cofrade',
  '2026-08-17',
  'Corrobora la procesión extraordinaria del 22 de agosto y el acompañamiento de la Banda de Música de la Oliva de Salteras.'
)
on conflict (id) do update set
  name = excluded.name,
  url = excluded.url,
  source_type = excluded.source_type,
  author_or_publisher = excluded.author_or_publisher,
  accessed_at = excluded.accessed_at,
  notes = excluded.notes;

insert into public.source_links (source_id, outing_id, scope) values
(
  'a2208260-0000-0000-0000-000000000080',
  'a2208260-0000-0000-0000-000000000002',
  'Horario, lugares y programación musical detallada del 22 de agosto de 2026'
)
on conflict do nothing;

insert into public.source_links (source_id, outing_music_assignment_id, scope) values
(
  'a2208260-0000-0000-0000-000000000081',
  'a2208260-0000-0000-0000-000000000061',
  'Acompañamiento de la Banda de Música de la Oliva de Salteras'
)
on conflict do nothing;
