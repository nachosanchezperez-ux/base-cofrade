-- Hilo Cofrade · Semana Santa 2026 de la Banda de Música de la Soledad de Cantillana.
--
-- Registra exclusivamente acompañamientos tras pasos, separados de Glorias,
-- procesiones eucarísticas, pasacalles y otras actuaciones. Las entidades de
-- hermandades y pasos permanecen en borrador hasta completar sus fichas.

-- -----------------------------------------------------------------------------
-- 1. Geografía mínima de los contratos
-- -----------------------------------------------------------------------------

insert into public.municipalities (
  name, slug, province, autonomous_community, country
)
values
  ('Mairena del Alcor', 'mairena-del-alcor', 'Sevilla', 'Andalucía', 'España'),
  ('Córdoba', 'cordoba', 'Córdoba', 'Andalucía', 'España'),
  ('Jerez de la Frontera', 'jerez-de-la-frontera', 'Cádiz', 'Andalucía', 'España')
on conflict (slug) do update set
  name = excluded.name,
  province = excluded.province,
  autonomous_community = excluded.autonomous_community,
  country = excluded.country;

-- -----------------------------------------------------------------------------
-- 2. Hermandades y pasos auxiliares, siempre por slug y sin UUID manuales
-- -----------------------------------------------------------------------------

drop table if exists pg_temp._hc_soledad_ss_brotherhoods;
create temporary table _hc_soledad_ss_brotherhoods (
  slug text primary key,
  name text not null,
  official_name text not null,
  municipality_slug text not null,
  procession_day text not null
) on commit drop;

insert into _hc_soledad_ss_brotherhoods values
  (
    'borriquita-mairena-del-alcor',
    'La Borriquita de Mairena del Alcor',
    'Fervorosa Hermandad y Cofradía de Nazarenos de Nuestro Padre Jesús de la Salud en su Sagrada y Triunfal Entrada en Jerusalén y Nuestra Señora de los Ángeles',
    'mairena-del-alcor', 'Domingo de Ramos'
  ),
  (
    'hermandad-sentencia-cordoba',
    'Hermandad de la Sentencia de Córdoba',
    'Ilustre Hermandad del Santísimo Sacramento y Nuestra Señora de la Alegría, y Cofradía de Nazarenos de Nuestro Padre Jesús de la Sentencia, María Santísima de Gracia y Amparo y San Nicolás de Bari',
    'cordoba', 'Lunes Santo'
  ),
  (
    'hermandad-defension-jerez',
    'Hermandad de la Defensión',
    'Hermandad de la Defensión de Jerez de la Frontera',
    'jerez-de-la-frontera', 'Martes Santo'
  ),
  (
    'carmen-doloroso',
    'El Carmen Doloroso',
    'Hermandad de Nuestra Señora del Carmen en sus Misterios Dolorosos',
    'sevilla', 'Miércoles Santo'
  ),
  (
    'soledad-cantillana',
    'La Soledad de Cantillana',
    'Hermandad Servita y Cofradía de Nazarenos del Santo Entierro de Nuestro Señor Jesucristo y Nuestra Señora de la Soledad Coronada',
    'cantillana', 'Viernes Santo'
  ),
  (
    'servitas-sevilla',
    'Los Servitas',
    'Real, Ilustre y Venerable Hermandad de Nazarenos y Primitiva Cofradía Servita de Nuestra Señora de los Dolores, Santísimo Cristo de la Providencia, María Santísima de la Soledad y San Marcos Evangelista',
    'sevilla', 'Sábado Santo'
  );

insert into public.entities (entity_type, name, slug, status)
select 'brotherhood', desired.name, desired.slug, 'draft'
from _hc_soledad_ss_brotherhoods desired
on conflict (slug) do update set
  name = excluded.name,
  updated_at = now();

insert into public.brotherhoods (
  entity_id, official_name, popular_name, municipality_id,
  brotherhood_types, current_procession_day
)
select
  entity.id, desired.official_name, desired.name, municipality.id,
  array['Penitencia']::text[], desired.procession_day
from _hc_soledad_ss_brotherhoods desired
join public.entities entity
  on entity.entity_type = 'brotherhood'
 and entity.slug = desired.slug
join public.municipalities municipality
  on municipality.slug = desired.municipality_slug
on conflict (entity_id) do update set
  official_name = excluded.official_name,
  popular_name = excluded.popular_name,
  municipality_id = excluded.municipality_id,
  brotherhood_types = excluded.brotherhood_types,
  current_procession_day = excluded.current_procession_day;

drop table if exists pg_temp._hc_soledad_ss_steps;
create temporary table _hc_soledad_ss_steps (
  brotherhood_slug text not null,
  slug text primary key,
  name text not null,
  step_type text not null
) on commit drop;

insert into _hc_soledad_ss_steps values
  (
    'borriquita-mairena-del-alcor',
    'paso-palio-nuestra-senora-angeles-mairena-del-alcor',
    'Paso de palio de Nuestra Señora de los Ángeles', 'Palio'
  ),
  (
    'hermandad-sentencia-cordoba',
    'paso-palio-maria-santisima-gracia-amparo-cordoba',
    'Paso de palio de María Santísima de Gracia y Amparo', 'Palio'
  ),
  (
    'hermandad-defension-jerez',
    'paso-palio-maria-santisima-o-defension-jerez',
    'Paso de palio de María Santísima de la O', 'Palio'
  ),
  (
    'carmen-doloroso',
    'paso-palio-virgen-carmen-misterios-dolorosos',
    'Paso de palio de Nuestra Señora del Carmen en sus Misterios Dolorosos', 'Palio'
  ),
  (
    'soledad-cantillana',
    'paso-palio-soledad-coronada-cantillana',
    'Paso de palio de Nuestra Señora de la Soledad Coronada', 'Palio'
  ),
  (
    'servitas-sevilla',
    'paso-misterio-piedad-servitas-sevilla',
    'Paso de misterio del Santísimo Cristo de la Providencia y Nuestra Señora de los Dolores', 'Misterio'
  );

insert into public.entities (entity_type, name, slug, status)
select 'step', desired.name, desired.slug, 'draft'
from _hc_soledad_ss_steps desired
on conflict (slug) do update set
  name = excluded.name,
  updated_at = now();

insert into public.steps (entity_id, step_type, current_condition)
select entity.id, desired.step_type, 'preserved'
from _hc_soledad_ss_steps desired
join public.entities entity
  on entity.entity_type = 'step'
 and entity.slug = desired.slug
on conflict (entity_id) do update set
  step_type = excluded.step_type,
  current_condition = excluded.current_condition;

insert into public.brotherhood_steps (
  brotherhood_entity_id, step_entity_id, relation_type, status
)
select brotherhood.id, step.id, 'processional_step', 'draft'
from _hc_soledad_ss_steps desired
join public.entities brotherhood
  on brotherhood.entity_type = 'brotherhood'
 and brotherhood.slug = desired.brotherhood_slug
join public.entities step
  on step.entity_type = 'step'
 and step.slug = desired.slug
where not exists (
  select 1
  from public.brotherhood_steps existing
  where existing.brotherhood_entity_id = brotherhood.id
    and existing.step_entity_id = step.id
    and existing.relation_type = 'processional_step'
    and existing.status <> 'archived'
);

-- -----------------------------------------------------------------------------
-- 3. Seis acompañamientos tras pasos en la Semana Santa de 2026
-- -----------------------------------------------------------------------------

drop table if exists pg_temp._hc_soledad_ss_contracts;
create temporary table _hc_soledad_ss_contracts (
  brotherhood_slug text not null,
  step_slug text not null,
  outing_type text not null,
  position text not null,
  date_from_text text not null,
  year_from integer,
  date_to_text text,
  year_to integer,
  public_brotherhood_name text not null,
  public_step_name text not null,
  notes text not null,
  primary key (brotherhood_slug, step_slug)
) on commit drop;

insert into _hc_soledad_ss_contracts values
  (
    'borriquita-mairena-del-alcor',
    'paso-palio-nuestra-senora-angeles-mairena-del-alcor',
    'Domingo de Ramos', 'Tras el paso de palio de Nuestra Señora de los Ángeles',
    '2017–2026', 2017, 'Hasta 2026', 2026,
    'La Borriquita de Mairena del Alcor',
    'Paso de palio de Nuestra Señora de los Ángeles',
    'Etapa documentada entre 2017 y 2026. La Banda Municipal de Coria del Río tomará el relevo en 2027.'
  ),
  (
    'hermandad-sentencia-cordoba',
    'paso-palio-maria-santisima-gracia-amparo-cordoba',
    'Lunes Santo', 'Tras el paso de palio de María Santísima de Gracia y Amparo',
    'Retorno en 2026', 2026, null, null,
    'Hermandad de la Sentencia de Córdoba',
    'Paso de palio de María Santísima de Gracia y Amparo',
    'Acompañamiento de la estación de penitencia de 2026, retomando una vinculación que ya existió en la década de 1980.'
  ),
  (
    'hermandad-defension-jerez',
    'paso-palio-maria-santisima-o-defension-jerez',
    'Martes Santo', 'Tras el paso de palio de María Santísima de la O',
    'Vigente en 2026', 2026, null, null,
    'Hermandad de la Defensión',
    'Paso de palio de María Santísima de la O',
    'Acompañamiento renovado para el Martes Santo de 2026 en Jerez de la Frontera.'
  ),
  (
    'carmen-doloroso',
    'paso-palio-virgen-carmen-misterios-dolorosos',
    'Miércoles Santo', 'Tras el paso de palio de la Virgen del Carmen',
    'Vigente en 2026', 2026, null, null,
    'El Carmen Doloroso',
    'Paso de palio de Nuestra Señora del Carmen en sus Misterios Dolorosos',
    'Acompañamiento renovado para la estación de penitencia del Miércoles Santo de 2026 en Sevilla.'
  ),
  (
    'soledad-cantillana',
    'paso-palio-soledad-coronada-cantillana',
    'Viernes Santo', 'Tras el paso de palio de Nuestra Señora de la Soledad Coronada',
    'Vigente en 2026', 2026, null, null,
    'La Soledad de Cantillana',
    'Paso de palio de Nuestra Señora de la Soledad Coronada',
    'Acompañamiento de la formación local a la Patrona de Cantillana en la Solemne Procesión General del Santo Entierro de 2026.'
  ),
  (
    'servitas-sevilla',
    'paso-misterio-piedad-servitas-sevilla',
    'Sábado Santo', 'Tras el paso de misterio de la Piedad',
    'Vigente en 2026', 2026, null, null,
    'Los Servitas',
    'Paso de misterio del Santísimo Cristo de la Providencia y Nuestra Señora de los Dolores',
    'Acompañamiento confirmado para la estación de penitencia del Sábado Santo de 2026 en Sevilla.'
  );

update public.music_accompaniment_periods period
set
  step_entity_id = step.id,
  position = desired.position,
  outing_type = desired.outing_type,
  date_from = null,
  date_from_text = desired.date_from_text,
  year_from = desired.year_from,
  date_to = null,
  date_to_text = desired.date_to_text,
  year_to = desired.year_to,
  is_current = true,
  notes = desired.notes,
  status = 'published',
  public_brotherhood_name = desired.public_brotherhood_name,
  public_step_name = desired.public_step_name,
  public_brotherhood_slug = desired.brotherhood_slug,
  public_municipality_name = municipality.name,
  public_municipality_slug = municipality.slug,
  public_province = municipality.province,
  updated_at = now()
from _hc_soledad_ss_contracts desired
join public.entities band
  on band.entity_type = 'band'
 and band.slug = 'banda-de-musica-nuestra-senora-de-la-soledad-cantillana'
join public.entities brotherhood
  on brotherhood.entity_type = 'brotherhood'
 and brotherhood.slug = desired.brotherhood_slug
join public.brotherhoods brotherhood_profile
  on brotherhood_profile.entity_id = brotherhood.id
join public.municipalities municipality
  on municipality.id = brotherhood_profile.municipality_id
join public.entities step
  on step.entity_type = 'step'
 and step.slug = desired.step_slug
where period.band_entity_id = band.id
  and period.brotherhood_entity_id = brotherhood.id
  and period.is_current
  and period.status <> 'archived';

insert into public.music_accompaniment_periods (
  brotherhood_entity_id, band_entity_id, step_entity_id,
  position, outing_type, date_from_text, year_from,
  date_to_text, year_to, is_current, notes, status,
  public_brotherhood_name, public_step_name, public_brotherhood_slug,
  public_municipality_name, public_municipality_slug, public_province
)
select
  brotherhood.id, band.id, step.id,
  desired.position, desired.outing_type, desired.date_from_text, desired.year_from,
  desired.date_to_text, desired.year_to, true, desired.notes, 'published',
  desired.public_brotherhood_name, desired.public_step_name, desired.brotherhood_slug,
  municipality.name, municipality.slug, municipality.province
from _hc_soledad_ss_contracts desired
join public.entities band
  on band.entity_type = 'band'
 and band.slug = 'banda-de-musica-nuestra-senora-de-la-soledad-cantillana'
join public.entities brotherhood
  on brotherhood.entity_type = 'brotherhood'
 and brotherhood.slug = desired.brotherhood_slug
join public.brotherhoods brotherhood_profile
  on brotherhood_profile.entity_id = brotherhood.id
join public.municipalities municipality
  on municipality.id = brotherhood_profile.municipality_id
join public.entities step
  on step.entity_type = 'step'
 and step.slug = desired.step_slug
where not exists (
  select 1
  from public.music_accompaniment_periods existing
  where existing.band_entity_id = band.id
    and existing.brotherhood_entity_id = brotherhood.id
    and existing.is_current
    and existing.status <> 'archived'
);

-- -----------------------------------------------------------------------------
-- 4. Fuentes específicas de cada periodo
-- -----------------------------------------------------------------------------

drop table if exists pg_temp._hc_soledad_ss_sources;
create temporary table _hc_soledad_ss_sources (
  url text primary key,
  name text not null,
  source_type text not null,
  publisher text,
  publication_date date
) on commit drop;

insert into _hc_soledad_ss_sources values
  (
    'https://www.hermandaddelaborriquita.com/cuaresma-2026/',
    'Cuaresma 2026 · La Borriquita de Mairena del Alcor',
    'Web oficial', 'Hermandad de la Borriquita de Mairena del Alcor', null
  ),
  (
    'https://www.elpespunte.es/articulo/cofrade/banda-coria-deja-estrella-mas-35-anos-firma-borriquita-mairena/20260730192204143398.html',
    'La Soledad de Cantillana cierra su etapa en la Borriquita de Mairena',
    'Prensa cofrade', 'El Pespunte', '2026-07-30'
  ),
  (
    'https://hermandaddelasentencia.org/acompanamientos-musicales-lunes-santo-2026/',
    'Acompañamientos musicales del Lunes Santo de 2026',
    'Web oficial', 'Hermandad de la Sentencia de Córdoba', '2025-11-04'
  ),
  (
    'https://www.lapasionenjerez.com/actualidad/la-hermandad-de-la-defension-anuncia-nuevos-nombramientos-y-cambios-musicales-para-2026',
    'La Defensión anuncia sus acompañamientos musicales para 2026',
    'Prensa cofrade', 'La Pasión en Jerez', '2025-07-17'
  ),
  (
    'https://inriinformacion.com/2025/07/02/el-carmen-renueva-a-pasion-de-linares-y-a-la-soledad-de-cantillana-para-2026/',
    'El Carmen renueva a la Soledad de Cantillana para 2026',
    'Prensa cofrade', 'INRI Información', '2025-07-02'
  ),
  (
    'https://cofradiastv.com/sevilla/cantillana/',
    'Contratos musicales del Viernes Santo de Cantillana de 2026',
    'Prensa cofrade', 'CofradiasTV', '2025-11-13'
  ),
  (
    'https://lavozdesevilla.es/el-postigo/semana-santa/sabado-santo/los-servitas/',
    'Los Servitas · acompañamientos musicales del Sábado Santo de 2026',
    'Guía cofrade', 'La Voz de Sevilla', null
  );

update public.sources source
set
  name = desired.name,
  source_type = desired.source_type,
  author_or_publisher = desired.publisher,
  publication_date = desired.publication_date,
  accessed_at = '2026-08-21'::date
from _hc_soledad_ss_sources desired
where source.url = desired.url;

insert into public.sources (
  name, url, source_type, author_or_publisher, publication_date, accessed_at
)
select
  desired.name, desired.url, desired.source_type, desired.publisher,
  desired.publication_date, '2026-08-21'::date
from _hc_soledad_ss_sources desired
where not exists (
  select 1 from public.sources source where source.url = desired.url
);

drop table if exists pg_temp._hc_soledad_ss_source_links;
create temporary table _hc_soledad_ss_source_links (
  brotherhood_slug text not null,
  step_slug text not null,
  source_url text not null,
  scope text not null,
  primary key (brotherhood_slug, step_slug, source_url)
) on commit drop;

insert into _hc_soledad_ss_source_links values
  (
    'borriquita-mairena-del-alcor',
    'paso-palio-nuestra-senora-angeles-mairena-del-alcor',
    'https://www.hermandaddelaborriquita.com/cuaresma-2026/',
    'Acompañamiento tras el palio en el Domingo de Ramos de 2026'
  ),
  (
    'borriquita-mairena-del-alcor',
    'paso-palio-nuestra-senora-angeles-mairena-del-alcor',
    'https://www.elpespunte.es/articulo/cofrade/banda-coria-deja-estrella-mas-35-anos-firma-borriquita-mairena/20260730192204143398.html',
    'Periodo completo 2017–2026 y relevo anunciado para 2027'
  ),
  (
    'hermandad-sentencia-cordoba',
    'paso-palio-maria-santisima-gracia-amparo-cordoba',
    'https://hermandaddelasentencia.org/acompanamientos-musicales-lunes-santo-2026/',
    'Acompañamiento tras el palio en el Lunes Santo de 2026'
  ),
  (
    'hermandad-defension-jerez',
    'paso-palio-maria-santisima-o-defension-jerez',
    'https://www.lapasionenjerez.com/actualidad/la-hermandad-de-la-defension-anuncia-nuevos-nombramientos-y-cambios-musicales-para-2026',
    'Acompañamiento tras el palio en el Martes Santo de 2026'
  ),
  (
    'carmen-doloroso',
    'paso-palio-virgen-carmen-misterios-dolorosos',
    'https://inriinformacion.com/2025/07/02/el-carmen-renueva-a-pasion-de-linares-y-a-la-soledad-de-cantillana-para-2026/',
    'Acompañamiento tras el palio en el Miércoles Santo de 2026'
  ),
  (
    'soledad-cantillana',
    'paso-palio-soledad-coronada-cantillana',
    'https://cofradiastv.com/sevilla/cantillana/',
    'Acompañamiento a la Virgen de la Soledad Coronada en el Viernes Santo de 2026'
  ),
  (
    'servitas-sevilla',
    'paso-misterio-piedad-servitas-sevilla',
    'https://lavozdesevilla.es/el-postigo/semana-santa/sabado-santo/los-servitas/',
    'Acompañamiento tras el misterio de la Piedad en el Sábado Santo de 2026'
  );

insert into public.source_links (
  source_id, music_accompaniment_period_id, scope
)
select source.id, period.id, desired.scope
from _hc_soledad_ss_source_links desired
join public.entities band
  on band.entity_type = 'band'
 and band.slug = 'banda-de-musica-nuestra-senora-de-la-soledad-cantillana'
join public.entities brotherhood
  on brotherhood.entity_type = 'brotherhood'
 and brotherhood.slug = desired.brotherhood_slug
join public.entities step
  on step.entity_type = 'step'
 and step.slug = desired.step_slug
join public.music_accompaniment_periods period
  on period.band_entity_id = band.id
 and period.brotherhood_entity_id = brotherhood.id
 and period.step_entity_id = step.id
 and period.is_current
 and period.status = 'published'
join lateral (
  select candidate.id
  from public.sources candidate
  where candidate.url = desired.source_url
  order by candidate.created_at, candidate.id
  limit 1
) source on true
where not exists (
  select 1
  from public.source_links existing
  where existing.source_id = source.id
    and existing.music_accompaniment_period_id = period.id
);

-- -----------------------------------------------------------------------------
-- 5. Invariantes editoriales y relacionales
-- -----------------------------------------------------------------------------

do $validation$
declare
  band_id uuid;
  holy_week_count integer;
  glory_count integer;
  sourced_count integer;
  duplicate_count integer;
  mairena_count integer;
begin
  select id into band_id
  from public.entities
  where entity_type = 'band'
    and slug = 'banda-de-musica-nuestra-senora-de-la-soledad-cantillana';

  if band_id is null then
    raise exception 'No se ha encontrado la Banda de Música de la Soledad de Cantillana';
  end if;

  select count(*) into holy_week_count
  from public.music_accompaniment_periods
  where band_entity_id = band_id
    and is_current
    and status = 'published'
    and outing_type in (
      'Viernes de Dolores', 'Sábado de Pasión', 'Domingo de Ramos',
      'Lunes Santo', 'Martes Santo', 'Miércoles Santo', 'Jueves Santo',
      'Madrugada', 'Viernes Santo', 'Sábado Santo', 'Domingo de Resurrección'
    );

  if holy_week_count <> 6 then
    raise exception 'La Soledad de Cantillana debe tener 6 contratos de Semana Santa 2026; encontrados: %', holy_week_count;
  end if;

  select count(*) into glory_count
  from public.music_accompaniment_periods
  where band_entity_id = band_id
    and is_current
    and status = 'published'
    and outing_type in ('Procesión de gloria', 'Procesión eucarística', 'Procesión extraordinaria');

  if glory_count <> 2 then
    raise exception 'Los 2 contratos de Glorias ya publicados deben conservarse; encontrados: %', glory_count;
  end if;

  select count(distinct period.id) into sourced_count
  from public.music_accompaniment_periods period
  join public.source_links link
    on link.music_accompaniment_period_id = period.id
  where period.band_entity_id = band_id
    and period.is_current
    and period.status = 'published'
    and period.outing_type in (
      'Domingo de Ramos', 'Lunes Santo', 'Martes Santo',
      'Miércoles Santo', 'Viernes Santo', 'Sábado Santo'
    );

  if sourced_count <> 6 then
    raise exception 'Los 6 contratos de Semana Santa deben tener fuente; encontrados: %', sourced_count;
  end if;

  select count(*) into duplicate_count
  from (
    select brotherhood_entity_id, step_entity_id
    from public.music_accompaniment_periods
    where band_entity_id = band_id
      and is_current
      and status <> 'archived'
    group by brotherhood_entity_id, step_entity_id
    having count(*) > 1
  ) duplicates;

  if duplicate_count <> 0 then
    raise exception 'La migración ha generado acompañamientos vigentes duplicados';
  end if;

  select count(*) into mairena_count
  from public.music_accompaniment_periods period
  join public.entities brotherhood on brotherhood.id = period.brotherhood_entity_id
  where period.band_entity_id = band_id
    and brotherhood.slug = 'borriquita-mairena-del-alcor'
    and period.year_from = 2017
    and period.year_to = 2026
    and period.date_to_text = 'Hasta 2026';

  if mairena_count <> 1 then
    raise exception 'El cierre de la etapa de Mairena debe quedar documentado como 2017–2026';
  end if;
end
$validation$;

notify pgrst, 'reload schema';
