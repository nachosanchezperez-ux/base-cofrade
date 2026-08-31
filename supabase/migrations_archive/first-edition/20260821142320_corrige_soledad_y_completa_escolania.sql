-- Hilo Cofrade · correcciones de la Soledad de Cantillana y ficha oficial
-- de la Escolanía Salesiana María Auxiliadora de Sevilla.
-- Conserva los UUID existentes y resuelve las nuevas relaciones por slug.

-- 1. Nombre público de El Carmen y final documentado de Mairena.

update public.entities
set name = 'El Carmen', updated_at = now()
where entity_type = 'brotherhood' and slug = 'carmen-doloroso';

update public.brotherhoods profile
set popular_name = 'El Carmen'
from public.entities brotherhood
where profile.entity_id = brotherhood.id
  and brotherhood.slug = 'carmen-doloroso';

update public.music_accompaniment_periods period
set public_brotherhood_name = 'El Carmen', updated_at = now()
from public.entities band
where period.band_entity_id = band.id
  and band.slug = 'banda-de-musica-nuestra-senora-de-la-soledad-cantillana'
  and period.public_brotherhood_slug = 'carmen-doloroso'
  and period.status <> 'archived';

update public.music_accompaniment_periods period
set
  date_from_text = '2017–2026', year_from = 2017,
  date_to_text = 'Hasta 2026', year_to = 2026,
  notes = 'Etapa documentada entre 2017 y 2026. La Banda Municipal de Coria del Río tomará el relevo en 2027.',
  updated_at = now()
from public.entities band
where period.band_entity_id = band.id
  and band.slug = 'banda-de-musica-nuestra-senora-de-la-soledad-cantillana'
  and period.public_brotherhood_slug = 'borriquita-mairena-del-alcor'
  and period.status <> 'archived';

-- 2. Identidad propia y ficha visual de la Escolanía.

update public.entities
set
  name = 'Escolanía Salesiana María Auxiliadora de Sevilla',
  slug = 'escolania-salesiana-maria-auxiliadora-sevilla',
  summary = 'Coro sacro infantil y juvenil fundado en 1999 en la Casa Salesiana de la Santísima Trinidad de Sevilla, dedicado a la formación musical y humana y al acompañamiento litúrgico y cofrade.',
  status = 'published',
  updated_at = now()
where entity_type = 'band'
  and slug in (
    'escolania-salesiana-capilla-musical-maria-auxiliadora',
    'escolania-salesiana-maria-auxiliadora-sevilla'
  );

do $$
begin
  if not exists (
    select 1 from public.entities
    where entity_type = 'band'
      and slug = 'escolania-salesiana-maria-auxiliadora-sevilla'
  ) then
    raise exception 'No se ha encontrado el nodo previo de la Escolanía Salesiana';
  end if;
end $$;

update public.bands profile
set
  band_type = 'Escolanía',
  municipality_id = municipality.id,
  foundation_text = '1999',
  website_url = 'https://escolania.es/',
  instagram_url = 'https://www.instagram.com/esma_sevilla/',
  description = 'Coro sacro infantil y juvenil de la Casa Salesiana de la Santísima Trinidad de Sevilla. Desde 1999 combina la formación vocal y humana de niños y jóvenes con la recuperación, interpretación y difusión del patrimonio musical sacro. Su repertorio supera las 80 obras e incluye canto gregoriano, polifonía renacentista y composiciones contemporáneas. Participa en cultos, vía crucis, procesiones, conciertos y, desde 2018, en el Corpus Christi de Sevilla.',
  primary_color = '#DC001B',
  secondary_color = '#4F5961',
  logo_path = '/bandas/escolania-salesiana-maria-auxiliadora/logotipo.webp',
  hero_image_path = '/bandas/escolania-salesiana-maria-auxiliadora/formacion.webp',
  hero_image_alt = 'Escolanos de la Escolanía Salesiana María Auxiliadora durante una actuación coral',
  hero_image_credit = 'Fotografía · Escolanía Salesiana María Auxiliadora',
  linked_brotherhood_name = null,
  headquarters_text = 'Casa Salesiana de la Santísima Trinidad · C/ María Auxiliadora, 18E · Sevilla',
  youtube_url = 'https://www.youtube.com/channel/UCWIB1Idst7Snp7RWGYXWCTA',
  banderin_entity_id = null
from public.entities band, public.municipalities municipality
where profile.entity_id = band.id
  and band.slug = 'escolania-salesiana-maria-auxiliadora-sevilla'
  and municipality.slug = 'sevilla';

update public.band_names name
set
  is_current = false,
  date_to_text = coalesce(name.date_to_text, 'Denominación provisional corregida en 2026'),
  notes = coalesce(name.notes, 'Registro previo que mezclaba la Escolanía y la Capilla Musical como una sola formación.')
from public.entities band
where name.band_entity_id = band.id
  and band.slug = 'escolania-salesiana-maria-auxiliadora-sevilla'
  and name.is_current
  and name.name not in (
    'Escolanía Salesiana María Auxiliadora de Sevilla',
    'Escolanía Salesiana María Auxiliadora'
  );

insert into public.band_names (
  band_entity_id, name, short_name, name_type,
  date_from_text, is_current, notes
)
select band.id, desired.name, desired.short_name, desired.name_type,
       'Denominación vigente en 2026', true, desired.notes
from public.entities band
cross join (
  values
    ('Escolanía Salesiana María Auxiliadora de Sevilla', 'Escolanía Salesiana María Auxiliadora', 'official', 'Denominación oficial publicada por la propia formación.'),
    ('Escolanía Salesiana María Auxiliadora', 'ESMA Sevilla', 'popular', 'Denominación breve de uso público.')
) as desired(name, short_name, name_type, notes)
where band.slug = 'escolania-salesiana-maria-auxiliadora-sevilla'
  and not exists (
    select 1 from public.band_names existing
    where existing.band_entity_id = band.id
      and existing.name = desired.name
      and existing.name_type = desired.name_type
      and existing.is_current
  );

insert into public.band_colors (
  band_entity_id, color_name, hex_value, color_role,
  sort_order, notes, status
)
select band.id, desired.color_name, desired.hex_value,
       desired.color_role, desired.sort_order, desired.notes, 'published'
from public.entities band
cross join (
  values
    ('Rojo de la identidad', '#DC001B', 'primary', 1::smallint, 'Color principal del logotipo oficial.'),
    ('Gris de la identidad', '#4F5961', 'secondary', 2::smallint, 'Color secundario del logotipo oficial.'),
    ('Blanco', '#FFFFFF', 'identity', 3::smallint, 'Fondo de contraste para el logotipo oficial.')
) as desired(color_name, hex_value, color_role, sort_order, notes)
where band.slug = 'escolania-salesiana-maria-auxiliadora-sevilla'
on conflict (band_entity_id, color_name) do update set
  hex_value = excluded.hex_value,
  color_role = excluded.color_role,
  sort_order = excluded.sort_order,
  notes = excluded.notes,
  status = excluded.status,
  updated_at = now();

insert into public.entity_social_links (
  entity_id, platform, url, label, display_order, is_public
)
select band.id, desired.platform, desired.url, desired.label,
       desired.display_order, true
from public.entities band
cross join (
  values
    ('website', 'https://escolania.es/', 'Web oficial', 1::smallint),
    ('facebook', 'https://www.facebook.com/ESMASevilla/', 'Facebook oficial', 2::smallint),
    ('instagram', 'https://www.instagram.com/esma_sevilla/', 'Instagram oficial', 3::smallint),
    ('x', 'https://x.com/ESMASevilla', 'X oficial', 4::smallint),
    ('youtube', 'https://www.youtube.com/channel/UCWIB1Idst7Snp7RWGYXWCTA', 'YouTube oficial', 5::smallint)
) as desired(platform, url, label, display_order)
where band.slug = 'escolania-salesiana-maria-auxiliadora-sevilla'
on conflict (entity_id, platform) do update set
  url = excluded.url,
  label = excluded.label,
  display_order = excluded.display_order,
  is_public = excluded.is_public,
  updated_at = now();

-- 3. Dirección musical.

insert into public.entities (entity_type, name, slug, summary, status)
values (
  'agent', 'Óscar M. Paredes Grau', 'oscar-m-paredes-grau',
  'Director musical de la Escolanía Salesiana María Auxiliadora de Sevilla.',
  'published'
)
on conflict (slug) do update set
  name = excluded.name,
  summary = excluded.summary,
  status = excluded.status,
  updated_at = now();

insert into public.agents (entity_id, agent_kind, municipality_id, description)
select agent.id, 'person', municipality.id,
       'Director musical formado en Canto y Composición en los conservatorios Cristóbal de Morales y Manuel Castillo de Sevilla. Su trabajo combina dirección coral, pedagogía y formación musical.'
from public.entities agent, public.municipalities municipality
where agent.slug = 'oscar-m-paredes-grau'
  and municipality.slug = 'sevilla'
on conflict (entity_id) do update set
  agent_kind = excluded.agent_kind,
  municipality_id = excluded.municipality_id,
  description = excluded.description;

update public.band_agents assignment
set is_current = true, is_public = true,
    notes = 'Dirección musical documentada por la web oficial de la Escolanía.'
from public.entities band, public.entities agent
where assignment.band_entity_id = band.id
  and assignment.agent_entity_id = agent.id
  and assignment.role_name = 'Dirección musical'
  and band.slug = 'escolania-salesiana-maria-auxiliadora-sevilla'
  and agent.slug = 'oscar-m-paredes-grau';

insert into public.band_agents (
  band_entity_id, agent_entity_id, role_name,
  date_from_text, is_current, notes, is_public
)
select band.id, agent.id, 'Dirección musical', 'Vigente en 2026', true,
       'Dirección musical documentada por la web oficial de la Escolanía.', true
from public.entities band, public.entities agent
where band.slug = 'escolania-salesiana-maria-auxiliadora-sevilla'
  and agent.slug = 'oscar-m-paredes-grau'
  and not exists (
    select 1 from public.band_agents existing
    where existing.band_entity_id = band.id
      and existing.agent_entity_id = agent.id
      and existing.role_name = 'Dirección musical'
      and existing.is_current
  );

-- 4. Nodos auxiliares para los acompañamientos de Semana Santa.

drop table if exists pg_temp._hc_escolania_brotherhoods;
create temporary table _hc_escolania_brotherhoods (
  slug text primary key,
  name text not null,
  official_name text not null,
  procession_day text not null
) on commit drop;

insert into _hc_escolania_brotherhoods values
  ('la-corona', 'La Corona', 'Hermandad del Santísimo Cristo de la Corona', 'Viernes de Dolores'),
  ('el-valle', 'El Valle', 'Pontificia, Real, Ilustre y Primitiva Archicofradía de Nazarenos del Santísimo Cristo de la Coronación de Espinas, Nuestro Padre Jesús con la Cruz al Hombro, Nuestra Señora del Valle y Santa Mujer Verónica', 'Jueves Santo'),
  ('sagrada-mortaja', 'La Sagrada Mortaja', 'Hermandad de la Sagrada Mortaja', 'Viernes Santo');

insert into public.entities (entity_type, name, slug, status)
select 'brotherhood', desired.name, desired.slug, 'draft'
from _hc_escolania_brotherhoods desired
on conflict (slug) do update set name = excluded.name, updated_at = now();

insert into public.brotherhoods (
  entity_id, official_name, popular_name, municipality_id,
  brotherhood_types, current_procession_day
)
select brotherhood.id, desired.official_name, desired.name, municipality.id,
       array['Penitencia']::text[], desired.procession_day
from _hc_escolania_brotherhoods desired
join public.entities brotherhood on brotherhood.slug = desired.slug
join public.municipalities municipality on municipality.slug = 'sevilla'
on conflict (entity_id) do update set
  official_name = excluded.official_name,
  popular_name = excluded.popular_name,
  municipality_id = excluded.municipality_id,
  brotherhood_types = excluded.brotherhood_types,
  current_procession_day = excluded.current_procession_day;

drop table if exists pg_temp._hc_escolania_steps;
create temporary table _hc_escolania_steps (
  brotherhood_slug text not null,
  slug text primary key,
  name text not null,
  step_type text not null
) on commit drop;

insert into _hc_escolania_steps values
  ('la-corona', 'paso-santisimo-cristo-corona-sevilla', 'Paso del Santísimo Cristo de la Corona', 'Cristo'),
  ('el-valle', 'paso-cristo-coronacion-espinas-valle', 'Paso del Santísimo Cristo de la Coronación de Espinas', 'Misterio');

insert into public.entities (entity_type, name, slug, status)
select 'step', desired.name, desired.slug, 'draft'
from _hc_escolania_steps desired
on conflict (slug) do update set name = excluded.name, updated_at = now();

insert into public.steps (entity_id, step_type, current_condition)
select step.id, desired.step_type, 'preserved'
from _hc_escolania_steps desired
join public.entities step on step.slug = desired.slug
on conflict (entity_id) do update set
  step_type = excluded.step_type,
  current_condition = excluded.current_condition;

insert into public.brotherhood_steps (
  brotherhood_entity_id, step_entity_id, relation_type, status
)
select brotherhood.id, step.id, 'processional_step', 'draft'
from _hc_escolania_steps desired
join public.entities brotherhood on brotherhood.slug = desired.brotherhood_slug
join public.entities step on step.slug = desired.slug
where not exists (
  select 1 from public.brotherhood_steps existing
  where existing.brotherhood_entity_id = brotherhood.id
    and existing.step_entity_id = step.id
    and existing.relation_type = 'processional_step'
    and existing.status <> 'archived'
  );

-- 5. Cuatro acompañamientos habituales de Semana Santa.

drop table if exists pg_temp._hc_escolania_contracts;
create temporary table _hc_escolania_contracts (
  brotherhood_slug text primary key,
  step_slug text,
  outing_type text not null,
  position text not null,
  public_brotherhood_name text not null,
  public_step_name text,
  notes text not null,
  source_url text not null
) on commit drop;

insert into _hc_escolania_contracts values
  ('la-corona', 'paso-santisimo-cristo-corona-sevilla', 'Viernes de Dolores', 'Acompañamiento coral al Santísimo Cristo de la Corona', 'La Corona', 'Paso del Santísimo Cristo de la Corona', 'Acompañamiento oficial programado para el Viernes de Dolores de 2026.', 'https://escolania.es/evento/acompanamiento-al-stmo-cristo-de-la-corona/'),
  ('la-cena', 'paso-cristo-humildad-y-paciencia-la-cena', 'Domingo de Ramos', 'Acompañamiento coral al Santísimo Cristo de la Humildad y Paciencia', 'La Cena', 'Paso del Santísimo Cristo de la Humildad y Paciencia', 'La Escolanía acompaña al Cristo de la Humildad y Paciencia durante su estación de penitencia. En 2026 participa junto a la Capilla Musical María Auxiliadora.', 'https://escolania.es/evento/acompanamiento-santisimo-cristo-de-la-humildad-y-paciencia/'),
  ('el-valle', 'paso-cristo-coronacion-espinas-valle', 'Jueves Santo', 'Acompañamiento coral al Santísimo Cristo de la Coronación de Espinas', 'El Valle', 'Paso del Santísimo Cristo de la Coronación de Espinas', 'Acompañamiento oficial programado para el Jueves Santo de 2026.', 'https://escolania.es/evento/acompaamiento-santsimo-cristo-de-la-coronacin-de-espinas/'),
  ('sagrada-mortaja', null, 'Viernes Santo', 'Acompañamiento coral en el cortejo de la Sagrada Mortaja', 'La Sagrada Mortaja', null, 'La web oficial incluye a la Sagrada Mortaja entre los acompañamientos habituales de la Escolanía en la Semana Santa de Sevilla.', 'https://escolania.es/trayectoria-y-experiencia/');

update public.music_accompaniment_periods period
set
  step_entity_id = step.id,
  position = desired.position,
  outing_type = desired.outing_type,
  date_from = null,
  date_from_text = 'Vigente en 2026',
  year_from = 2026,
  date_to = null,
  date_to_text = null,
  year_to = null,
  is_current = true,
  notes = desired.notes,
  status = 'published',
  public_brotherhood_name = desired.public_brotherhood_name,
  public_step_name = desired.public_step_name,
  public_brotherhood_slug = desired.brotherhood_slug,
  public_municipality_name = 'Sevilla',
  public_municipality_slug = 'sevilla',
  public_province = 'Sevilla',
  updated_at = now()
from _hc_escolania_contracts desired
join public.entities band on band.slug = 'escolania-salesiana-maria-auxiliadora-sevilla'
join public.entities brotherhood on brotherhood.slug = desired.brotherhood_slug
left join public.entities step on step.slug = desired.step_slug
where period.band_entity_id = band.id
  and period.brotherhood_entity_id = brotherhood.id
  and period.is_current
  and period.status <> 'archived';

insert into public.music_accompaniment_periods (
  brotherhood_entity_id, band_entity_id, step_entity_id,
  position, outing_type, date_from_text, year_from,
  is_current, notes, status,
  public_brotherhood_name, public_step_name, public_brotherhood_slug,
  public_municipality_name, public_municipality_slug, public_province
)
select brotherhood.id, band.id, step.id,
       desired.position, desired.outing_type, 'Vigente en 2026', 2026,
       true, desired.notes, 'published',
       desired.public_brotherhood_name, desired.public_step_name, desired.brotherhood_slug,
       'Sevilla', 'sevilla', 'Sevilla'
from _hc_escolania_contracts desired
join public.entities band on band.slug = 'escolania-salesiana-maria-auxiliadora-sevilla'
join public.entities brotherhood on brotherhood.slug = desired.brotherhood_slug
left join public.entities step on step.slug = desired.step_slug
where not exists (
  select 1 from public.music_accompaniment_periods existing
  where existing.band_entity_id = band.id
    and existing.brotherhood_entity_id = brotherhood.id
    and existing.is_current
    and existing.status <> 'archived'
  );

-- 6. Fuentes oficiales y trazabilidad.

drop table if exists pg_temp._hc_escolania_sources;
create temporary table _hc_escolania_sources (
  url text primary key,
  name text not null,
  source_type text not null,
  scope text not null
) on commit drop;

insert into _hc_escolania_sources values
  ('https://escolania.es/', 'Escolanía Salesiana María Auxiliadora de Sevilla', 'Web oficial', 'Identidad, fundación en 1999 y descripción general de la formación'),
  ('https://escolania.es/la-escolania/', 'La Escolanía', 'Web oficial', 'Historia, misión, sede y dirección musical'),
  ('https://escolania.es/trayectoria-y-experiencia/', 'Trayectoria y experiencia', 'Web oficial', 'Acompañamientos cofrades, Corpus Christi y colaboraciones'),
  ('https://escolania.es/repertorio/', 'Repertorio de la Escolanía', 'Web oficial', 'Repertorio sacro y catálogo superior a 80 obras'),
  ('https://escolania.es/contacto/', 'Contacto de la Escolanía', 'Web oficial', 'Sede de la formación en la Casa Salesiana de la Santísima Trinidad'),
  ('https://escolania.es/evento/acompanamiento-al-stmo-cristo-de-la-corona/', 'Acompañamiento al Santísimo Cristo de la Corona', 'Agenda oficial', 'Acompañamiento del Viernes de Dolores de 2026'),
  ('https://escolania.es/evento/acompanamiento-santisimo-cristo-de-la-humildad-y-paciencia/', 'Acompañamiento al Santísimo Cristo de la Humildad y Paciencia', 'Agenda oficial', 'Acompañamiento del Domingo de Ramos de 2026'),
  ('https://escolania.es/evento/acompaamiento-santsimo-cristo-de-la-coronacin-de-espinas/', 'Acompañamiento al Santísimo Cristo de la Coronación de Espinas', 'Agenda oficial', 'Acompañamiento del Jueves Santo de 2026');

update public.sources source
set
  name = desired.name,
  source_type = desired.source_type,
  author_or_publisher = 'Escolanía Salesiana María Auxiliadora de Sevilla',
  accessed_at = '2026-08-21'::date
from _hc_escolania_sources desired
where source.url = desired.url;

insert into public.sources (
  name, url, source_type, author_or_publisher, accessed_at
)
select desired.name, desired.url, desired.source_type,
       'Escolanía Salesiana María Auxiliadora de Sevilla', '2026-08-21'::date
from _hc_escolania_sources desired
where not exists (
  select 1 from public.sources source where source.url = desired.url
  );

insert into public.source_links (source_id, entity_id, scope)
select source.id, band.id, desired.scope
from _hc_escolania_sources desired
join public.entities band on band.slug = 'escolania-salesiana-maria-auxiliadora-sevilla'
join lateral (
  select candidate.id from public.sources candidate
  where candidate.url = desired.url
  order by candidate.created_at, candidate.id limit 1
) source on true
where not exists (
  select 1 from public.source_links existing
  where existing.source_id = source.id and existing.entity_id = band.id
  );

insert into public.source_links (
  source_id, music_accompaniment_period_id, scope
)
select source.id, period.id, 'Acompañamiento de Semana Santa documentado por la Escolanía'
from _hc_escolania_contracts desired
join public.entities band on band.slug = 'escolania-salesiana-maria-auxiliadora-sevilla'
join public.entities brotherhood on brotherhood.slug = desired.brotherhood_slug
join public.music_accompaniment_periods period
  on period.band_entity_id = band.id
 and period.brotherhood_entity_id = brotherhood.id
 and period.is_current and period.status = 'published'
join lateral (
  select candidate.id from public.sources candidate
  where candidate.url = desired.source_url
  order by candidate.created_at, candidate.id limit 1
) source on true
where not exists (
  select 1 from public.source_links existing
  where existing.source_id = source.id
    and existing.music_accompaniment_period_id = period.id
  );

-- 7. Invariantes editoriales y relacionales.

do $validation$
declare
  escolania_id uuid;
  soledad_id uuid;
  holy_week_count integer;
  source_count integer;
  direction_count integer;
  mairena_count integer;
  carmen_count integer;
begin
  select id into escolania_id from public.entities
  where entity_type = 'band' and slug = 'escolania-salesiana-maria-auxiliadora-sevilla';

  select id into soledad_id from public.entities
  where entity_type = 'band' and slug = 'banda-de-musica-nuestra-senora-de-la-soledad-cantillana';

  if escolania_id is null or soledad_id is null then
    raise exception 'No se han podido resolver las dos formaciones';
  end if;

  select count(*) into holy_week_count
  from public.music_accompaniment_periods
  where band_entity_id = escolania_id
    and is_current and status = 'published'
    and outing_type in ('Viernes de Dolores', 'Domingo de Ramos', 'Jueves Santo', 'Viernes Santo');

  if holy_week_count <> 4 then
    raise exception 'La Escolanía debe tener 4 acompañamientos de Semana Santa; encontrados: %', holy_week_count;
  end if;

  select count(distinct link.music_accompaniment_period_id) into source_count
  from public.source_links link
  join public.music_accompaniment_periods period
    on period.id = link.music_accompaniment_period_id
  where period.band_entity_id = escolania_id
    and period.is_current and period.status = 'published';

  if source_count <> 4 then
    raise exception 'Los 4 acompañamientos deben tener fuente; encontrados: %', source_count;
  end if;

  select count(*) into direction_count
  from public.band_agents
  where band_entity_id = escolania_id
    and role_name = 'Dirección musical' and is_current and is_public;

  if direction_count <> 1 then
    raise exception 'La Escolanía debe tener una dirección musical vigente; encontrados: %', direction_count;
  end if;

  select count(*) into mairena_count
  from public.music_accompaniment_periods
  where band_entity_id = soledad_id
    and public_brotherhood_slug = 'borriquita-mairena-del-alcor'
    and year_from = 2017 and year_to = 2026
    and date_to_text = 'Hasta 2026' and status <> 'archived';

  if mairena_count <> 1 then
    raise exception 'Mairena debe quedar registrada exclusivamente como 2017–2026';
  end if;

  select count(*) into carmen_count
  from public.music_accompaniment_periods
  where band_entity_id = soledad_id
    and public_brotherhood_slug = 'carmen-doloroso'
    and public_brotherhood_name = 'El Carmen'
    and status <> 'archived';

  if carmen_count <> 1 then
    raise exception 'La denominación pública del contrato debe ser El Carmen';
  end if;
end
$validation$;

notify pgrst, 'reload schema';
