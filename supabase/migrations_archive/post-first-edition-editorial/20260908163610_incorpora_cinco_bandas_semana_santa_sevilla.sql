begin;

-- Incorpora cinco formaciones y seis acompañamientos vigentes en la Semana Santa
-- de Sevilla. Los Estudiantes se crea únicamente como nodo relacional en borrador:
-- no se publica una ficha de hermandad incompleta.

do $$
declare
  conflicting_slugs text;
  missing_targets text;
begin
  select string_agg(slug, ', ' order by slug)
    into conflicting_slugs
  from public.entities
  where slug in (
    'agrupacion-musical-la-sentencia-jerez',
    'agrupacion-musical-nazareno-la-algaba',
    'banda-musica-alcala-guadaira',
    'banda-musica-carmen-villalba-alcor',
    'banda-municipal-fernando-guerrero-los-palacios'
  )
    and entity_type <> 'band';

  if conflicting_slugs is not null then
    raise exception 'Slugs reservados por entidades que no son bandas: %', conflicting_slugs;
  end if;

  select string_agg(required.slug, ', ' order by required.slug)
    into missing_targets
  from (
    values
      ('torreblanca-jesus-cautivo'),
      ('san-jeronimo-sevilla'),
      ('siete-palabras-sevilla'),
      ('quinta-angustia-sevilla'),
      ('hermandad-del-sol')
  ) as required(slug)
  left join public.entities entity
    on entity.slug = required.slug
   and entity.entity_type = 'brotherhood'
  where entity.id is null;

  if missing_targets is not null then
    raise exception 'Faltan hermandades canónicas necesarias: %', missing_targets;
  end if;

  select string_agg(required.slug, ', ' order by required.slug)
    into missing_targets
  from (
    values
      ('paso-misterio-cautivo-pilato-torreblanca'),
      ('paso-misterio-amor-divina-misericordia-san-jeronimo')
  ) as required(slug)
  left join public.entities entity
    on entity.slug = required.slug
   and entity.entity_type = 'step'
  where entity.id is null;

  if missing_targets is not null then
    raise exception 'Faltan pasos canónicos necesarios: %', missing_targets;
  end if;
end
$$;

insert into public.municipalities (slug, name, province, autonomous_community, country)
values
  ('villalba-del-alcor', 'Villalba del Alcor', 'Huelva', 'Andalucía', 'España'),
  ('los-palacios-y-villafranca', 'Los Palacios y Villafranca', 'Sevilla', 'Andalucía', 'España')
on conflict (slug) do update
set name = excluded.name,
    province = excluded.province,
    autonomous_community = excluded.autonomous_community,
    country = excluded.country;

insert into public.entities (entity_type, slug, name, summary, status)
values (
  'brotherhood',
  'hermandad-de-los-estudiantes-sevilla',
  'Hermandad de los Estudiantes',
  'Nodo relacional en revisión para documentar acompañamientos musicales; la ficha pública de la hermandad permanece pendiente.',
  'draft'
)
on conflict (slug) do nothing;

do $$
begin
  if not exists (
    select 1
    from public.entities
    where slug = 'hermandad-de-los-estudiantes-sevilla'
      and entity_type = 'brotherhood'
  ) then
    raise exception 'El slug de Los Estudiantes pertenece a otro tipo de entidad';
  end if;
end
$$;

create temporary table desired_bands (
  slug text primary key,
  popular_name text not null,
  official_name text not null,
  summary text not null,
  description text not null,
  band_type text not null,
  municipality_slug text not null,
  headquarters text not null,
  foundation_text text,
  website_url text,
  instagram_url text,
  facebook_url text
) on commit drop;

insert into desired_bands values
  (
    'agrupacion-musical-la-sentencia-jerez',
    'La Sentencia de Jerez',
    'Agrupación Musical La Sentencia',
    'Agrupación musical de Jerez de la Frontera fundada en 1981.',
    'Formación jerezana fundada el 7 de julio de 1981. Acompaña al Cautivo de Torreblanca desde 2019 y tiene renovado este compromiso hasta 2028.',
    'Agrupación musical',
    'jerez-de-la-frontera',
    'Jerez de la Frontera (Cádiz)',
    '7 de julio de 1981',
    'https://amlasentencia.com/',
    'https://www.instagram.com/am_lasentencia/',
    'https://www.facebook.com/lasentencia/'
  ),
  (
    'agrupacion-musical-nazareno-la-algaba',
    'Nazareno de La Algaba',
    'Agrupación Musical Nuestro Padre Jesús Nazareno de La Algaba',
    'Agrupación musical de La Algaba fundada en 1978.',
    'Formación de La Algaba fundada en 1978. En 2026 acompaña al Señor del Amor de San Jerónimo y el vínculo está renovado para 2027.',
    'Agrupación musical',
    'la-algaba',
    'La Algaba (Sevilla)',
    '1978',
    null,
    'https://www.instagram.com/nazarenoalgaba/',
    null
  ),
  (
    'banda-musica-alcala-guadaira',
    'Banda de Alcalá',
    'Banda de Música de Alcalá de Guadaíra',
    'Banda de música de Alcalá de Guadaíra con origen en 1864.',
    'Formación alcalareña con origen documentado en 1864, conocida también como Banda Municipal de Alcalá. En 2026 acompaña el palio de Los Estudiantes.',
    'Banda de música',
    'alcala-de-guadaira',
    'Alcalá de Guadaíra (Sevilla)',
    '1864',
    null,
    null,
    'https://www.facebook.com/BandadeAlcala/'
  ),
  (
    'banda-musica-carmen-villalba-alcor',
    'Carmen de Villalba',
    'Banda de Música Nuestra Señora del Carmen de Villalba del Alcor',
    'Banda de música de Villalba del Alcor vinculada a las Siete Palabras y la Quinta Angustia.',
    'Formación onubense que acompaña a la Virgen de la Cabeza de las Siete Palabras desde 2016 y al Sagrado Descendimiento de la Quinta Angustia desde 2022.',
    'Banda de música',
    'villalba-del-alcor',
    'Villalba del Alcor (Huelva)',
    null,
    null,
    'https://www.instagram.com/bmcarmendevillalba/',
    null
  ),
  (
    'banda-municipal-fernando-guerrero-los-palacios',
    'Fernando Guerrero',
    'Banda Municipal de Música Fernando Guerrero',
    'Banda municipal de Los Palacios y Villafranca.',
    'Formación de Los Palacios y Villafranca que acompaña al palio de Nuestra Señora del Sol desde 2025.',
    'Banda de música',
    'los-palacios-y-villafranca',
    'Los Palacios y Villafranca (Sevilla)',
    null,
    null,
    'https://www.instagram.com/bm_fernando_guerrero/',
    'https://www.facebook.com/banda.fernandoguerrero/'
  );

insert into public.entities (entity_type, slug, name, summary, status)
select 'band', slug, popular_name, summary, 'published'
from desired_bands
on conflict (slug) do update
set entity_type = excluded.entity_type,
    name = excluded.name,
    summary = excluded.summary,
    status = excluded.status;

insert into public.bands (
  entity_id,
  band_type,
  municipality_id,
  headquarters_text,
  foundation_text,
  description,
  website_url,
  instagram_url
)
select
  entity.id,
  desired.band_type,
  municipality.id,
  desired.headquarters,
  desired.foundation_text,
  desired.description,
  desired.website_url,
  desired.instagram_url
from desired_bands desired
join public.entities entity on entity.slug = desired.slug
join public.municipalities municipality on municipality.slug = desired.municipality_slug
on conflict (entity_id) do update
set band_type = excluded.band_type,
    municipality_id = excluded.municipality_id,
    headquarters_text = excluded.headquarters_text,
    foundation_text = excluded.foundation_text,
    description = excluded.description,
    website_url = coalesce(excluded.website_url, public.bands.website_url),
    instagram_url = coalesce(excluded.instagram_url, public.bands.instagram_url);

create temporary table desired_band_names (
  band_slug text not null,
  name text not null,
  name_type text not null
) on commit drop;

insert into desired_band_names values
  ('agrupacion-musical-la-sentencia-jerez', 'Agrupación Musical La Sentencia', 'official'),
  ('agrupacion-musical-la-sentencia-jerez', 'La Sentencia de Jerez', 'popular'),
  ('agrupacion-musical-nazareno-la-algaba', 'Agrupación Musical Nuestro Padre Jesús Nazareno de La Algaba', 'official'),
  ('agrupacion-musical-nazareno-la-algaba', 'Nazareno de La Algaba', 'popular'),
  ('banda-musica-alcala-guadaira', 'Banda de Música de Alcalá de Guadaíra', 'official'),
  ('banda-musica-alcala-guadaira', 'Banda de Alcalá', 'popular'),
  ('banda-musica-alcala-guadaira', 'Banda Municipal de Alcalá', 'popular'),
  ('banda-musica-carmen-villalba-alcor', 'Banda de Música Nuestra Señora del Carmen de Villalba del Alcor', 'official'),
  ('banda-musica-carmen-villalba-alcor', 'Carmen de Villalba', 'popular'),
  ('banda-municipal-fernando-guerrero-los-palacios', 'Banda Municipal de Música Fernando Guerrero', 'official'),
  ('banda-municipal-fernando-guerrero-los-palacios', 'Fernando Guerrero', 'popular');

insert into public.band_names (band_entity_id, name, name_type, is_current)
select entity.id, desired.name, desired.name_type, true
from desired_band_names desired
join public.entities entity on entity.slug = desired.band_slug
where not exists (
  select 1
  from public.band_names existing
  where existing.band_entity_id = entity.id
    and existing.name = desired.name
    and existing.name_type = desired.name_type
);

create temporary table desired_social_links (
  band_slug text not null,
  platform text not null,
  url text not null
) on commit drop;

insert into desired_social_links
select slug, 'website', website_url from desired_bands where website_url is not null
union all
select slug, 'instagram', instagram_url from desired_bands where instagram_url is not null
union all
select slug, 'facebook', facebook_url from desired_bands where facebook_url is not null;

insert into public.entity_social_links (entity_id, platform, url)
select entity.id, desired.platform, desired.url
from desired_social_links desired
join public.entities entity on entity.slug = desired.band_slug
on conflict (entity_id, platform) do update
set url = excluded.url;

create temporary table desired_sources (
  url text primary key,
  title text not null,
  publisher text not null,
  source_type text not null,
  published_at date
) on commit drop;

insert into desired_sources values
  ('https://amlasentencia.com/renovacion-%C2%B7-cautivo-de-torreblanca/', 'Renovación · Cautivo de Torreblanca', 'Agrupación Musical La Sentencia', 'official', '2025-08-13'),
  ('https://www.artesacro.org/Noticia/Ver/168035/banda-nazareno-algaba-seguira-acompanando-senor-amor-san-jeronimo', 'La banda Nazareno de La Algaba seguirá acompañando al Señor del Amor de San Jerónimo', 'Arte Sacro', 'press', '2026-06-03'),
  ('https://www.elpespunte.es/articulo/cofrade/resurreccion-rinconada-cambia-banda-nazareno-algaba-sonara-domingo-resurreccion/20260628195610139501.html', 'La Resurrección de La Rinconada cambia de banda: Nazareno de La Algaba sonará el Domingo de Resurrección', 'El Pespunte', 'press', '2026-06-28'),
  ('https://cadenaser.com/andalucia/2025/07/13/la-banda-de-alcala-de-guadaira-lleva-su-musica-al-corazon-de-paris-y-conquista-disneyland-radio-sevilla/', 'La Banda de Alcalá de Guadaíra lleva su música al corazón de París', 'Cadena SER', 'press', '2025-07-13'),
  ('https://www.facebook.com/BandadeAlcala/videos/tardes-de-primaverahermandad-de-los-estudiantes-de-sevilla-suenaalcal%C3%A1/1365285658337769/', 'Tardes de primavera: Hermandad de los Estudiantes de Sevilla', 'Banda de Alcalá', 'official', '2026-05-24'),
  ('https://www.diariodesevilla.es/semana_santa/siete-palabras-renovacion-carmen-villalba-2027_0_1837318192.html', 'Las Siete Palabras renueva a la banda del Carmen de Villalba hasta 2027', 'Diario de Sevilla', 'press', '2023-10-10'),
  ('https://www.diariodesevilla.es/semana_santa/quinta-angustia-grau-patrimonio-musical-cofradia-jueves-santo-video_0_1835818213.html', 'La Quinta Angustia y la música de su cofradía', 'Diario de Sevilla', 'press', '2023-10-05'),
  ('https://www.instagram.com/bmcarmendevillalba/', 'Perfil oficial de la Banda del Carmen de Villalba', 'Banda de Música Nuestra Señora del Carmen', 'official', null),
  ('https://cadenaser.com/andalucia/2025/01/27/el-i-encuentro-nacional-de-hermandades-de-penitencia-del-rocio-eje-este-lunes-del-programa-cruz-de-guia-radio-sevilla/', 'El I Encuentro Nacional de Hermandades de Penitencia del Rocío', 'Cadena SER', 'press', '2025-01-27'),
  ('https://www.facebook.com/banda.fernandoguerrero/', 'Perfil oficial de la Banda Municipal Fernando Guerrero', 'Banda Municipal de Música Fernando Guerrero', 'official', null),
  ('https://musicofrades.com/acompanamientos-musicales-de-la-semana-santa-de-sevilla-2026/', 'Acompañamientos musicales de la Semana Santa de Sevilla 2026', 'Musicofrades', 'reference', '2026-02-22');

insert into public.sources (url, name, author_or_publisher, source_type, publication_date, accessed_at)
select url, title, publisher, source_type, published_at, date '2026-09-08'
from desired_sources desired
where not exists (select 1 from public.sources existing where existing.url = desired.url);

update public.sources existing
set name = desired.title,
    author_or_publisher = desired.publisher,
    source_type = desired.source_type,
    publication_date = desired.published_at,
    accessed_at = date '2026-09-08'
from desired_sources desired
where existing.url = desired.url;

create temporary table desired_entity_sources (
  band_slug text not null,
  source_url text not null,
  scope text not null
) on commit drop;

insert into desired_entity_sources values
  ('agrupacion-musical-la-sentencia-jerez', 'https://amlasentencia.com/renovacion-%C2%B7-cautivo-de-torreblanca/', 'identity'),
  ('agrupacion-musical-nazareno-la-algaba', 'https://www.elpespunte.es/articulo/cofrade/resurreccion-rinconada-cambia-banda-nazareno-algaba-sonara-domingo-resurreccion/20260628195610139501.html', 'identity'),
  ('agrupacion-musical-nazareno-la-algaba', 'https://www.artesacro.org/Noticia/Ver/168035/banda-nazareno-algaba-seguira-acompanando-senor-amor-san-jeronimo', 'current_accompaniment'),
  ('banda-musica-alcala-guadaira', 'https://cadenaser.com/andalucia/2025/07/13/la-banda-de-alcala-de-guadaira-lleva-su-musica-al-corazon-de-paris-y-conquista-disneyland-radio-sevilla/', 'identity'),
  ('banda-musica-alcala-guadaira', 'https://www.facebook.com/BandadeAlcala/videos/tardes-de-primaverahermandad-de-los-estudiantes-de-sevilla-suenaalcal%C3%A1/1365285658337769/', 'current_accompaniment'),
  ('banda-musica-carmen-villalba-alcor', 'https://www.instagram.com/bmcarmendevillalba/', 'identity'),
  ('banda-musica-carmen-villalba-alcor', 'https://www.diariodesevilla.es/semana_santa/siete-palabras-renovacion-carmen-villalba-2027_0_1837318192.html', 'current_accompaniment'),
  ('banda-musica-carmen-villalba-alcor', 'https://www.diariodesevilla.es/semana_santa/quinta-angustia-grau-patrimonio-musical-cofradia-jueves-santo-video_0_1835818213.html', 'current_accompaniment'),
  ('banda-municipal-fernando-guerrero-los-palacios', 'https://www.facebook.com/banda.fernandoguerrero/', 'identity'),
  ('banda-municipal-fernando-guerrero-los-palacios', 'https://cadenaser.com/andalucia/2025/01/27/el-i-encuentro-nacional-de-hermandades-de-penitencia-del-rocio-eje-este-lunes-del-programa-cruz-de-guia-radio-sevilla/', 'current_accompaniment');

insert into public.source_links (source_id, entity_id, scope)
select source.id, entity.id, desired.scope
from desired_entity_sources desired
join public.sources source on source.url = desired.source_url
join public.entities entity on entity.slug = desired.band_slug
where not exists (
  select 1
  from public.source_links existing
  where existing.source_id = source.id
    and existing.entity_id = entity.id
    and existing.scope = desired.scope
);

create temporary table desired_periods (
  band_slug text not null,
  brotherhood_slug text not null,
  step_slug text,
  position_text text not null,
  outing_name text not null,
  year_from integer,
  date_from_text text not null,
  public_brotherhood_name text not null,
  public_municipality_name text not null,
  public_step_name text not null,
  notes text not null,
  source_url text not null
) on commit drop;

insert into desired_periods values
  ('agrupacion-musical-la-sentencia-jerez', 'torreblanca-jesus-cautivo', 'paso-misterio-cautivo-pilato-torreblanca', 'Tras el paso de misterio de Nuestro Padre Jesús Cautivo ante Pilato', 'Sábado de Pasión', 2019, 'Desde 2019', 'Hermandad de Torreblanca', 'Sevilla', 'Nuestro Padre Jesús Cautivo ante Pilato', 'Relación iniciada en 2019 y renovada hasta 2028.', 'https://amlasentencia.com/renovacion-%C2%B7-cautivo-de-torreblanca/'),
  ('agrupacion-musical-nazareno-la-algaba', 'san-jeronimo-sevilla', 'paso-misterio-amor-divina-misericordia-san-jeronimo', 'Tras el paso de misterio de Nuestro Padre Jesús del Amor en su Divina Misericordia', 'Sábado de Pasión', null, 'Vigente en 2026', 'Hermandad de San Jerónimo', 'Sevilla', 'Nuestro Padre Jesús del Amor en su Divina Misericordia', 'Acompañamiento vigente en 2026 y renovado para 2027; inicio pendiente de documentación.', 'https://www.artesacro.org/Noticia/Ver/168035/banda-nazareno-algaba-seguira-acompanando-senor-amor-san-jeronimo'),
  ('banda-musica-alcala-guadaira', 'hermandad-de-los-estudiantes-sevilla', null, 'Tras el paso de palio de María Santísima de la Angustia', 'Martes Santo', null, 'Vigente en 2026', 'Hermandad de los Estudiantes', 'Sevilla', 'María Santísima de la Angustia', 'Acompañamiento vigente en 2026; inicio pendiente de documentación.', 'https://www.facebook.com/BandadeAlcala/videos/tardes-de-primaverahermandad-de-los-estudiantes-de-sevilla-suenaalcal%C3%A1/1365285658337769/'),
  ('banda-musica-carmen-villalba-alcor', 'siete-palabras-sevilla', null, 'Tras el paso de palio de Nuestra Señora de la Cabeza', 'Miércoles Santo', 2016, 'Desde 2016', 'Hermandad de las Siete Palabras', 'Sevilla', 'Nuestra Señora de la Cabeza', 'Relación iniciada en 2016 y renovada hasta 2027.', 'https://www.diariodesevilla.es/semana_santa/siete-palabras-renovacion-carmen-villalba-2027_0_1837318192.html'),
  ('banda-musica-carmen-villalba-alcor', 'quinta-angustia-sevilla', null, 'Tras el paso de misterio del Sagrado Descendimiento', 'Jueves Santo', 2022, 'Desde 2022', 'Hermandad de la Quinta Angustia', 'Sevilla', 'Sagrado Descendimiento', 'Contrato aprobado en 2020; primer acompañamiento efectivo en 2022 tras las suspensiones de la pandemia.', 'https://www.diariodesevilla.es/semana_santa/quinta-angustia-grau-patrimonio-musical-cofradia-jueves-santo-video_0_1835818213.html'),
  ('banda-municipal-fernando-guerrero-los-palacios', 'hermandad-del-sol', null, 'Tras el paso de palio de Nuestra Señora del Sol', 'Sábado Santo', 2025, 'Desde 2025', 'Hermandad del Sol', 'Sevilla', 'Nuestra Señora del Sol', 'Primer acompañamiento efectivo en la Semana Santa de 2025.', 'https://cadenaser.com/andalucia/2025/01/27/el-i-encuentro-nacional-de-hermandades-de-penitencia-del-rocio-eje-este-lunes-del-programa-cruz-de-guia-radio-sevilla/');

update public.music_accompaniment_periods period
set step_entity_id = step.id,
    position = desired.position_text,
    outing_type = desired.outing_name,
    year_from = desired.year_from,
    year_to = null,
    date_from_text = desired.date_from_text,
    date_to_text = null,
    is_current = true,
    public_brotherhood_name = desired.public_brotherhood_name,
    public_brotherhood_slug = desired.brotherhood_slug,
    public_municipality_name = desired.public_municipality_name,
    public_municipality_slug = 'sevilla',
    public_province = 'Sevilla',
    public_step_name = desired.public_step_name,
    notes = desired.notes,
    status = 'published'
from desired_periods desired
join public.entities band on band.slug = desired.band_slug
join public.entities brotherhood on brotherhood.slug = desired.brotherhood_slug
left join public.entities step on step.slug = desired.step_slug
where period.band_entity_id = band.id
  and period.brotherhood_entity_id = brotherhood.id
  and period.outing_type = desired.outing_name
  and period.position = desired.position_text;

insert into public.music_accompaniment_periods (
  band_entity_id,
  brotherhood_entity_id,
  step_entity_id,
  position,
  outing_type,
  year_from,
  year_to,
  date_from_text,
  date_to_text,
  is_current,
  public_brotherhood_name,
  public_brotherhood_slug,
  public_municipality_name,
  public_municipality_slug,
  public_province,
  public_step_name,
  notes,
  status
)
select
  band.id,
  brotherhood.id,
  step.id,
  desired.position_text,
  desired.outing_name,
  desired.year_from,
  null,
  desired.date_from_text,
  null,
  true,
  desired.public_brotherhood_name,
  desired.brotherhood_slug,
  desired.public_municipality_name,
  'sevilla',
  'Sevilla',
  desired.public_step_name,
  desired.notes,
  'published'
from desired_periods desired
join public.entities band on band.slug = desired.band_slug
join public.entities brotherhood on brotherhood.slug = desired.brotherhood_slug
left join public.entities step on step.slug = desired.step_slug
where not exists (
  select 1
  from public.music_accompaniment_periods existing
  where existing.band_entity_id = band.id
    and existing.brotherhood_entity_id = brotherhood.id
    and existing.outing_type = desired.outing_name
    and existing.position = desired.position_text
);

insert into public.source_links (source_id, music_accompaniment_period_id, scope)
select source.id, period.id, 'Evidencia del acompañamiento'
from desired_periods desired
join public.sources source on source.url = desired.source_url
join public.entities band on band.slug = desired.band_slug
join public.entities brotherhood on brotherhood.slug = desired.brotherhood_slug
join public.music_accompaniment_periods period
  on period.band_entity_id = band.id
 and period.brotherhood_entity_id = brotherhood.id
 and period.outing_type = desired.outing_name
 and period.position = desired.position_text
where not exists (
  select 1
  from public.source_links existing
  where existing.source_id = source.id
    and existing.music_accompaniment_period_id = period.id
    and existing.scope = 'Evidencia del acompañamiento'
);

-- La guía de 2026 funciona como comprobación transversal de las seis relaciones.
insert into public.source_links (source_id, music_accompaniment_period_id, scope)
select guide.id, period.id, 'Comprobación transversal de 2026'
from desired_periods desired
join public.sources guide
  on guide.url = 'https://musicofrades.com/acompanamientos-musicales-de-la-semana-santa-de-sevilla-2026/'
join public.entities band on band.slug = desired.band_slug
join public.entities brotherhood on brotherhood.slug = desired.brotherhood_slug
join public.music_accompaniment_periods period
  on period.band_entity_id = band.id
 and period.brotherhood_entity_id = brotherhood.id
 and period.outing_type = desired.outing_name
 and period.position = desired.position_text
where not exists (
  select 1
  from public.source_links existing
  where existing.source_id = guide.id
    and existing.music_accompaniment_period_id = period.id
    and existing.scope = 'Comprobación transversal de 2026'
);

do $$
declare
  band_count integer;
  period_count integer;
  sourced_period_count integer;
begin
  select count(*) into band_count
  from public.entities entity
  join public.bands band on band.entity_id = entity.id
  where entity.slug in (
    'agrupacion-musical-la-sentencia-jerez',
    'agrupacion-musical-nazareno-la-algaba',
    'banda-musica-alcala-guadaira',
    'banda-musica-carmen-villalba-alcor',
    'banda-municipal-fernando-guerrero-los-palacios'
  )
    and entity.status = 'published'
    ;

  if band_count <> 5 then
    raise exception 'Se esperaban 5 bandas publicadas y se encontraron %', band_count;
  end if;

  select count(*) into period_count
  from desired_periods desired
  join public.entities band on band.slug = desired.band_slug
  join public.entities brotherhood on brotherhood.slug = desired.brotherhood_slug
  join public.music_accompaniment_periods period
    on period.band_entity_id = band.id
   and period.brotherhood_entity_id = brotherhood.id
   and period.outing_type = desired.outing_name
   and period.position = desired.position_text
  where period.is_current
    and period.status = 'published'
    and period.year_from is not distinct from desired.year_from
    and period.date_from_text = desired.date_from_text;

  if period_count <> 6 then
    raise exception 'Se esperaban 6 acompañamientos vigentes y se encontraron %', period_count;
  end if;

  select count(distinct period.id) into sourced_period_count
  from desired_periods desired
  join public.entities band on band.slug = desired.band_slug
  join public.entities brotherhood on brotherhood.slug = desired.brotherhood_slug
  join public.music_accompaniment_periods period
    on period.band_entity_id = band.id
   and period.brotherhood_entity_id = brotherhood.id
   and period.outing_type = desired.outing_name
   and period.position = desired.position_text
  join public.source_links link on link.music_accompaniment_period_id = period.id;

  if sourced_period_count <> 6 then
    raise exception 'No todos los acompañamientos nuevos tienen fuentes enlazadas';
  end if;

  if not exists (
    select 1
    from public.entities
    where slug = 'hermandad-de-los-estudiantes-sevilla'
      and entity_type = 'brotherhood'
      and status = 'draft'
  ) then
    raise exception 'Los Estudiantes debe permanecer como nodo relacional en borrador';
  end if;
end
$$;

commit;
