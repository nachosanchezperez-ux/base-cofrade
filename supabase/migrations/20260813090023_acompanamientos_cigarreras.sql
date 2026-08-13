-- Hilo Cofrade · Acompañamientos actuales de Las Cigarreras
--
-- Documenta la Semana Santa 2026 publicada por la propia banda. Las fichas de
-- hermandad y paso se crean en borrador para alimentar las relaciones sin
-- publicar páginas incompletas.

insert into public.entities (id, entity_type, name, slug, status)
values
  ('c1000000-0000-0000-0000-000000000001', 'brotherhood', 'Hermandad de la Misión', 'hermandad-de-la-mision-sevilla', 'draft'),
  ('c1000000-0000-0000-0000-000000000002', 'brotherhood', 'Hermandad de la Sagrada Cena', 'hermandad-de-la-sagrada-cena-sevilla', 'draft'),
  ('c1000000-0000-0000-0000-000000000003', 'brotherhood', 'Hermandad de San Gonzalo', 'hermandad-de-san-gonzalo', 'draft'),
  ('c1000000-0000-0000-0000-000000000004', 'brotherhood', 'Hermandad del Dulce Nombre', 'hermandad-del-dulce-nombre-sevilla', 'draft'),
  ('c1000000-0000-0000-0000-000000000005', 'brotherhood', 'Hermandad de los Panaderos', 'hermandad-de-los-panaderos', 'draft'),
  ('c1000000-0000-0000-0000-000000000006', 'brotherhood', 'Hermandad de Las Cigarreras', 'hermandad-de-las-cigarreras', 'draft'),
  ('c1000000-0000-0000-0000-000000000007', 'brotherhood', 'Hermandad de la Carretería', 'hermandad-de-la-carreteria', 'draft'),
  ('c1000000-0000-0000-0000-000000000008', 'brotherhood', 'Hermandad de la Trinidad', 'hermandad-de-la-trinidad-sevilla', 'draft')
on conflict (slug) do update set name = excluded.name;

insert into public.brotherhoods (
  entity_id, official_name, popular_name, municipality_id, brotherhood_types
)
select
  e.id,
  v.official_name,
  v.popular_name,
  m.id,
  array['Penitencia']::text[]
from (values
  ('hermandad-de-la-mision-sevilla', 'Hermandad de la Misión', 'La Misión'),
  ('hermandad-de-la-sagrada-cena-sevilla', 'Hermandad de la Sagrada Cena', 'La Cena'),
  ('hermandad-de-san-gonzalo', 'Hermandad de San Gonzalo', 'San Gonzalo'),
  ('hermandad-del-dulce-nombre-sevilla', 'Hermandad del Dulce Nombre', 'La Bofetá'),
  ('hermandad-de-los-panaderos', 'Hermandad de los Panaderos', 'Los Panaderos'),
  ('hermandad-de-las-cigarreras', 'Hermandad de Las Cigarreras', 'Las Cigarreras'),
  ('hermandad-de-la-carreteria', 'Hermandad de la Carretería', 'La Carretería'),
  ('hermandad-de-la-trinidad-sevilla', 'Hermandad de la Trinidad', 'La Trinidad')
) as v(slug, official_name, popular_name)
join public.entities e on e.slug = v.slug
join public.municipalities m on m.slug = 'sevilla'
on conflict (entity_id) do update set
  official_name = excluded.official_name,
  popular_name = excluded.popular_name,
  municipality_id = excluded.municipality_id,
  brotherhood_types = excluded.brotherhood_types;

insert into public.entities (id, entity_type, name, slug, status)
values
  ('c1100000-0000-0000-0000-000000000001', 'step', 'Paso de misterio de Nuestro Padre Jesús de la Misión', 'paso-misterio-jesus-mision-sevilla', 'draft'),
  ('c1100000-0000-0000-0000-000000000002', 'step', 'Paso de misterio del Señor de la Sagrada Cena', 'paso-misterio-sagrada-cena-sevilla', 'draft'),
  ('c1100000-0000-0000-0000-000000000003', 'step', 'Paso de misterio de Nuestro Padre Jesús del Soberano Poder ante Caifás', 'paso-misterio-soberano-poder-san-gonzalo', 'draft'),
  ('c1100000-0000-0000-0000-000000000004', 'step', 'Paso de misterio de Nuestro Padre Jesús ante Anás', 'paso-misterio-jesus-ante-anas', 'draft'),
  ('c1100000-0000-0000-0000-000000000005', 'step', 'Paso de misterio de Nuestro Padre Jesús del Soberano Poder en su Prendimiento', 'paso-misterio-soberano-poder-prendimiento', 'draft'),
  ('c1100000-0000-0000-0000-000000000006', 'step', 'Paso de misterio de Nuestro Señor Jesucristo Atado a la Columna', 'paso-misterio-jesucristo-atado-columna', 'draft'),
  ('c1100000-0000-0000-0000-000000000007', 'step', 'Paso de misterio del Santísimo Cristo de la Salud y María Santísima de la Luz', 'paso-misterio-tres-necesidades-carreteria', 'draft'),
  ('c1100000-0000-0000-0000-000000000008', 'step', 'Paso de misterio del Sagrado Decreto de la Santísima Trinidad', 'paso-misterio-sagrado-decreto-trinidad', 'draft')
on conflict (slug) do update set name = excluded.name;

insert into public.steps (entity_id, step_type, current_condition)
select e.id, 'Misterio', 'in_use'
from public.entities e
where e.slug in (
  'paso-misterio-jesus-mision-sevilla',
  'paso-misterio-sagrada-cena-sevilla',
  'paso-misterio-soberano-poder-san-gonzalo',
  'paso-misterio-jesus-ante-anas',
  'paso-misterio-soberano-poder-prendimiento',
  'paso-misterio-jesucristo-atado-columna',
  'paso-misterio-tres-necesidades-carreteria',
  'paso-misterio-sagrado-decreto-trinidad'
)
on conflict (entity_id) do update set
  step_type = excluded.step_type,
  current_condition = excluded.current_condition;

insert into public.brotherhood_steps (
  id, brotherhood_entity_id, step_entity_id, relation_type, status
)
select
  v.id::uuid,
  h.id,
  s.id,
  'processional_step',
  'published'
from (values
  ('c1200000-0000-0000-0000-000000000001', 'hermandad-de-la-mision-sevilla', 'paso-misterio-jesus-mision-sevilla'),
  ('c1200000-0000-0000-0000-000000000002', 'hermandad-de-la-sagrada-cena-sevilla', 'paso-misterio-sagrada-cena-sevilla'),
  ('c1200000-0000-0000-0000-000000000003', 'hermandad-de-san-gonzalo', 'paso-misterio-soberano-poder-san-gonzalo'),
  ('c1200000-0000-0000-0000-000000000004', 'hermandad-del-dulce-nombre-sevilla', 'paso-misterio-jesus-ante-anas'),
  ('c1200000-0000-0000-0000-000000000005', 'hermandad-de-los-panaderos', 'paso-misterio-soberano-poder-prendimiento'),
  ('c1200000-0000-0000-0000-000000000006', 'hermandad-de-las-cigarreras', 'paso-misterio-jesucristo-atado-columna'),
  ('c1200000-0000-0000-0000-000000000007', 'hermandad-de-la-carreteria', 'paso-misterio-tres-necesidades-carreteria'),
  ('c1200000-0000-0000-0000-000000000008', 'hermandad-de-la-trinidad-sevilla', 'paso-misterio-sagrado-decreto-trinidad')
) as v(id, brotherhood_slug, step_slug)
join public.entities h on h.slug = v.brotherhood_slug
join public.entities s on s.slug = v.step_slug
on conflict (id) do update set
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  step_entity_id = excluded.step_entity_id,
  relation_type = excluded.relation_type,
  status = excluded.status;

insert into public.music_accompaniment_periods (
  id, brotherhood_entity_id, band_entity_id, step_entity_id, position,
  outing_type, year_from, is_current, notes, status
)
select
  v.id::uuid,
  h.id,
  b.id,
  s.id,
  'Tras el paso de misterio',
  v.outing_type,
  v.year_from,
  true,
  v.notes,
  'published'
from (values
  ('c1300000-0000-0000-0000-000000000001', 'hermandad-de-la-mision-sevilla', 'paso-misterio-jesus-mision-sevilla', 'Viernes de Dolores', 2008, null),
  ('c1300000-0000-0000-0000-000000000002', 'hermandad-de-la-sagrada-cena-sevilla', 'paso-misterio-sagrada-cena-sevilla', 'Domingo de Ramos', 1980, null),
  ('c1300000-0000-0000-0000-000000000003', 'hermandad-de-san-gonzalo', 'paso-misterio-soberano-poder-san-gonzalo', 'Lunes Santo', 1981, 'Con la excepción de 1984. Vinculación renovada por cuatro años en enero de 2026.'),
  ('c1300000-0000-0000-0000-000000000004', 'hermandad-del-dulce-nombre-sevilla', 'paso-misterio-jesus-ante-anas', 'Martes Santo', 1982, null),
  ('c1300000-0000-0000-0000-000000000005', 'hermandad-de-los-panaderos', 'paso-misterio-soberano-poder-prendimiento', 'Miércoles Santo', 1981, 'Con un paréntesis entre 1993 y 2003.'),
  ('c1300000-0000-0000-0000-000000000006', 'hermandad-de-las-cigarreras', 'paso-misterio-jesucristo-atado-columna', 'Jueves Santo', 1979, 'En 2026, Sagrada Columna y Azotes ocupó la trasera del misterio desde la Catedral hasta pasar los Jardines de Murillo.'),
  ('c1300000-0000-0000-0000-000000000007', 'hermandad-de-la-carreteria', 'paso-misterio-tres-necesidades-carreteria', 'Viernes Santo', 1986, null),
  ('c1300000-0000-0000-0000-000000000008', 'hermandad-de-la-trinidad-sevilla', 'paso-misterio-sagrado-decreto-trinidad', 'Sábado Santo', 1996, null)
) as v(id, brotherhood_slug, step_slug, outing_type, year_from, notes)
join public.entities h on h.slug = v.brotherhood_slug
join public.entities s on s.slug = v.step_slug
join public.entities b on b.slug = 'las-cigarreras'
on conflict (id) do update set
  brotherhood_entity_id = excluded.brotherhood_entity_id,
  band_entity_id = excluded.band_entity_id,
  step_entity_id = excluded.step_entity_id,
  position = excluded.position,
  outing_type = excluded.outing_type,
  year_from = excluded.year_from,
  is_current = excluded.is_current,
  notes = excluded.notes,
  status = excluded.status;

insert into public.sources (
  id, name, url, source_type, author_or_publisher, publication_date, accessed_at
)
values (
  'c1400000-0000-0000-0000-000000000001',
  'Nuestra Semana Santa 2026',
  'https://lascigarreras.net/nuestra-semana-santa-2025-2/',
  'website',
  'Las Cigarreras',
  date '2026-03-27',
  current_date
)
on conflict (id) do update set
  name = excluded.name,
  url = excluded.url,
  source_type = excluded.source_type,
  author_or_publisher = excluded.author_or_publisher,
  publication_date = excluded.publication_date,
  accessed_at = excluded.accessed_at;

insert into public.source_links (
  id, source_id, music_accompaniment_period_id, scope
)
select
  v.link_id::uuid,
  'c1400000-0000-0000-0000-000000000001',
  v.period_id::uuid,
  'Acompañamiento de Semana Santa 2026'
from (values
  ('c1500000-0000-0000-0000-000000000001', 'c1300000-0000-0000-0000-000000000001'),
  ('c1500000-0000-0000-0000-000000000002', 'c1300000-0000-0000-0000-000000000002'),
  ('c1500000-0000-0000-0000-000000000003', 'c1300000-0000-0000-0000-000000000003'),
  ('c1500000-0000-0000-0000-000000000004', 'c1300000-0000-0000-0000-000000000004'),
  ('c1500000-0000-0000-0000-000000000005', 'c1300000-0000-0000-0000-000000000005'),
  ('c1500000-0000-0000-0000-000000000006', 'c1300000-0000-0000-0000-000000000006'),
  ('c1500000-0000-0000-0000-000000000007', 'c1300000-0000-0000-0000-000000000007'),
  ('c1500000-0000-0000-0000-000000000008', 'c1300000-0000-0000-0000-000000000008')
) as v(link_id, period_id)
on conflict (id) do update set
  source_id = excluded.source_id,
  music_accompaniment_period_id = excluded.music_accompaniment_period_id,
  scope = excluded.scope;

-- Expone únicamente las etiquetas necesarias para las tarjetas públicas. De
-- este modo, las entidades en borrador pueden alimentar relaciones sin crear
-- enlaces a fichas todavía incompletas.
create or replace function public.get_public_band_accompaniments(target_band_id uuid)
returns table (
  id uuid,
  brotherhood_entity_id uuid,
  brotherhood_name text,
  brotherhood_slug text,
  step_entity_id uuid,
  step_name text
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    map.id,
    h.id,
    h.name,
    case when h.status = 'published' then h.slug else null end,
    s.id,
    s.name
  from public.music_accompaniment_periods map
  join public.entities b on b.id = map.band_entity_id and b.status = 'published'
  join public.entities h on h.id = map.brotherhood_entity_id
  left join public.entities s on s.id = map.step_entity_id
  where map.band_entity_id = target_band_id
    and map.status = 'published'
    and map.is_current = true;
$$;

revoke all on function public.get_public_band_accompaniments(uuid) from public;
grant execute on function public.get_public_band_accompaniments(uuid) to anon, authenticated;
