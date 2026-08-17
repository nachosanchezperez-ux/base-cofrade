-- Hilo Cofrade · Próxima extraordinaria en Home
-- Migración 035
--
-- Objetivos:
-- 1) Dar tratamiento editorial visual a una salida concreta sin hardcodear la Home.
-- 2) Reutilizar `outings` y la vista existente de próximas extraordinarias.
-- 3) Incorporar como primer caso real la extraordinaria de María Santísima de las Angustias
--    de Aznalcázar del 22 de agosto de 2026.
--
-- Esta migración es independiente de la 034 (identidad/geografía de Hermandades).

-- -----------------------------------------------------------------------------
-- IMAGEN EDITORIAL DE UNA SALIDA
-- -----------------------------------------------------------------------------

alter table public.outings
  add column if not exists hero_image_path text,
  add column if not exists hero_image_alt text,
  add column if not exists hero_image_credit text;

comment on column public.outings.hero_image_path is
  'Ruta pública de la fotografía editorial principal de una salida cuando exista.';

comment on column public.outings.hero_image_alt is
  'Texto alternativo de la fotografía editorial principal de la salida.';

comment on column public.outings.hero_image_credit is
  'Crédito público de la fotografía editorial principal de la salida.';

-- La vista conserva todas sus columnas actuales y añade al final los campos
-- editoriales de imagen. La Home sigue dependiendo de un único origen dinámico.
create or replace view public.upcoming_extraordinary_outings as
select
  o.id,
  o.brotherhood_entity_id,
  coalesce(be.name, o.organizer_name) as brotherhood_name,
  o.organizer_name,
  o.title,
  o.outing_type,
  o.outing_date,
  o.departure_time,
  o.return_date,
  o.return_time,
  o.reason,
  o.municipality_id,
  m.name as municipality_name,
  o.origin_place_id,
  op.name as origin_place_name,
  o.destination_place_id,
  dp.name as destination_place_name,
  o.route_summary,
  o.hero_image_path,
  o.hero_image_alt,
  o.hero_image_credit
from public.outings o
left join public.entities be on be.id = o.brotherhood_entity_id
left join public.municipalities m on m.id = o.municipality_id
left join public.places op on op.id = o.origin_place_id
left join public.places dp on dp.id = o.destination_place_id
where o.status = 'published'
  and o.event_status = 'announced'
  and o.character = 'extraordinary'
  and o.outing_date >= current_date
order by o.outing_date, o.departure_time nulls last;

-- -----------------------------------------------------------------------------
-- PRIMER CASO REAL · ANGUSTIAS DE AZNALCÁZAR · 22/08/2026
-- -----------------------------------------------------------------------------

insert into public.municipalities (
  id, name, slug, province, autonomous_community, country
) values (
  'a2208260-0000-0000-0000-000000000001',
  'Aznalcázar',
  'aznalcazar',
  'Sevilla',
  'Andalucía',
  'España'
)
on conflict (slug) do update set
  name = excluded.name,
  province = excluded.province,
  autonomous_community = excluded.autonomous_community,
  country = excluded.country;

insert into public.outings (
  id,
  brotherhood_entity_id,
  organizer_name,
  outing_type,
  character,
  title,
  outing_date,
  year,
  municipality_id,
  reason,
  description,
  event_status,
  status,
  hero_image_path,
  hero_image_alt,
  hero_image_credit
)
select
  'a2208260-0000-0000-0000-000000000002',
  null,
  'Hermandad de Santiago de Aznalcázar',
  'Procesión extraordinaria',
  'extraordinary',
  'María Santísima de las Angustias',
  '2026-08-22',
  2026,
  m.id,
  'Con motivo del 450.º aniversario de la erección canónica de la Hermandad de Santiago.',
  'Procesión extraordinaria de María Santísima de las Angustias por las calles de Aznalcázar dentro de los actos del 450.º aniversario de la erección canónica de la Hermandad de Santiago.',
  'announced',
  'published',
  '/extraordinarias/angustias-aznalcazar-2026.jpg',
  'María Santísima de las Angustias de Aznalcázar',
  'Fotografía · Hermandad'
from public.municipalities m
where m.slug = 'aznalcazar'
on conflict (id) do update set
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  organizer_name = excluded.organizer_name,
  outing_type = excluded.outing_type,
  character = excluded.character,
  title = excluded.title,
  outing_date = excluded.outing_date,
  year = excluded.year,
  municipality_id = excluded.municipality_id,
  reason = excluded.reason,
  description = excluded.description,
  event_status = excluded.event_status,
  status = excluded.status,
  hero_image_path = excluded.hero_image_path,
  hero_image_alt = excluded.hero_image_alt,
  hero_image_credit = excluded.hero_image_credit;

-- Fuentes del acontecimiento. La primera fija la identidad de la corporación;
-- la segunda documenta fecha, carácter extraordinario y motivo conmemorativo.
insert into public.sources (
  id, name, url, source_type, author_or_publisher, accessed_at
) values
(
  'a2208260-0000-0000-0000-000000000003',
  'Hermandad de Santiago de Aznalcázar',
  'https://www.hermandadsantiagoaznalcazar.es/',
  'Web oficial',
  'Hermandad de Santiago de Aznalcázar',
  '2026-08-17'
),
(
  'a2208260-0000-0000-0000-000000000004',
  'Las Angustias de Aznalcázar saldrá en extraordinaria en 2026: todos los actos y cultos',
  'https://www.diariodesevilla.es/semana_santa/angustias-aznalcazar-saldra-extraordinaria-2026_0_2004416992.html',
  'Prensa',
  'Diario de Sevilla',
  '2026-08-17'
)
on conflict (id) do update set
  name = excluded.name,
  url = excluded.url,
  source_type = excluded.source_type,
  author_or_publisher = excluded.author_or_publisher,
  accessed_at = excluded.accessed_at;

insert into public.source_links (source_id, outing_id, scope) values
(
  'a2208260-0000-0000-0000-000000000003',
  'a2208260-0000-0000-0000-000000000002',
  'Identidad de la Hermandad organizadora'
),
(
  'a2208260-0000-0000-0000-000000000004',
  'a2208260-0000-0000-0000-000000000002',
  'Fecha, carácter extraordinario y 450.º aniversario de la erección canónica'
)
on conflict do nothing;
