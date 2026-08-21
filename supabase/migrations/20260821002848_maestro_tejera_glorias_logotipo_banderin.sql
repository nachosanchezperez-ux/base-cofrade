-- Hilo Cofrade · Maestro Tejera: identidad visual, banderín y contratos de
-- Glorias y cultos externos de Sevilla capital y provincia.
--
-- La migración conserva el UUID de la banda, el contrato ya existente de la
-- Encarnación y todos los acompañamientos de Semana Santa. Las entidades
-- auxiliares se crean con UUID generados por PostgreSQL y permanecen en borrador
-- hasta que dispongan de ficha propia.

-- -----------------------------------------------------------------------------
-- 1. Identidad visual y Spotify
-- -----------------------------------------------------------------------------

update public.bands band
set logo_path = '/bandas/maestro-tejera/logotipo.webp'
from public.entities entity
where band.entity_id = entity.id
  and entity.entity_type = 'band'
  and entity.slug = 'banda-de-musica-del-maestro-tejera';

insert into public.entity_social_links (
  entity_id, platform, url, label, display_order, is_public
)
select
  band.id,
  'spotify',
  'https://open.spotify.com/artist/1NHEuJrDVMZmcw1oPASjxW',
  'Spotify',
  5,
  true
from public.entities band
where band.entity_type = 'band'
  and band.slug = 'banda-de-musica-del-maestro-tejera'
on conflict (entity_id, platform) do update set
  url = excluded.url,
  label = excluded.label,
  display_order = excluded.display_order,
  is_public = excluded.is_public,
  updated_at = now();

insert into public.entities (
  entity_type, name, slug, summary, status
)
values (
  'heritage_asset',
  'Banderín de la Banda de Música del Maestro Tejera',
  'banderin-banda-musica-maestro-tejera',
  'Banderín corporativo azul con la lira y la Giralda bordadas en oro.',
  'published'
)
on conflict (slug) do update set
  name = excluded.name,
  summary = excluded.summary,
  status = excluded.status,
  updated_at = now();

insert into public.heritage_assets (
  entity_id, parent_entity_id, asset_type, description, technique,
  is_current, is_featured, display_order,
  public_image_path, public_image_alt, public_image_credit, origin_notes
)
select
  asset.id,
  band.id,
  'Banderín',
  'Banderín corporativo confeccionado en terciopelo azul. El paño presenta una lira con la Giralda bordada en oro, ornamentación vegetal y la denominación Tejera.',
  'Bordado en oro y seda sobre terciopelo',
  true,
  true,
  0,
  '/bandas/maestro-tejera/banderin.webp',
  'Banderín azul de la Banda de Música del Maestro Tejera con la Giralda bordada en oro',
  'Fotografía · Banda de Música Maestro Tejera',
  'Fotografía facilitada para la ficha de la banda. Autoría y fecha de ejecución del banderín pendientes de documentación.'
from public.entities asset
join public.entities band
  on band.entity_type = 'band'
 and band.slug = 'banda-de-musica-del-maestro-tejera'
where asset.entity_type = 'heritage_asset'
  and asset.slug = 'banderin-banda-musica-maestro-tejera'
on conflict (entity_id) do update set
  parent_entity_id = excluded.parent_entity_id,
  asset_type = excluded.asset_type,
  description = excluded.description,
  technique = excluded.technique,
  is_current = excluded.is_current,
  is_featured = excluded.is_featured,
  display_order = excluded.display_order,
  public_image_path = excluded.public_image_path,
  public_image_alt = excluded.public_image_alt,
  public_image_credit = excluded.public_image_credit,
  origin_notes = excluded.origin_notes;

update public.bands band
set banderin_entity_id = asset.id
from public.entities band_entity
join public.entities asset
  on asset.entity_type = 'heritage_asset'
 and asset.slug = 'banderin-banda-musica-maestro-tejera'
where band.entity_id = band_entity.id
  and band_entity.entity_type = 'band'
  and band_entity.slug = 'banda-de-musica-del-maestro-tejera';

-- -----------------------------------------------------------------------------
-- 2. Entidades auxiliares de Sevilla y provincia
-- -----------------------------------------------------------------------------

insert into public.municipalities (
  name, slug, province, autonomous_community, country
)
values
  ('Sevilla', 'sevilla', 'Sevilla', 'Andalucía', 'España'),
  ('Camas', 'camas', 'Sevilla', 'Andalucía', 'España'),
  ('Carrión de los Céspedes', 'carrion-de-los-cespedes', 'Sevilla', 'Andalucía', 'España'),
  ('Villanueva del Ariscal', 'villanueva-del-ariscal', 'Sevilla', 'Andalucía', 'España'),
  ('Benacazón', 'benacazon', 'Sevilla', 'Andalucía', 'España'),
  ('Dos Hermanas', 'dos-hermanas', 'Sevilla', 'Andalucía', 'España'),
  ('Gerena', 'gerena', 'Sevilla', 'Andalucía', 'España')
on conflict (slug) do update set
  name = excluded.name,
  province = excluded.province,
  autonomous_community = excluded.autonomous_community,
  country = excluded.country;

drop table if exists pg_temp._hc_tejera_glory_brotherhoods;
create temporary table _hc_tejera_glory_brotherhoods (
  slug text primary key,
  name text not null,
  official_name text not null,
  municipality_slug text not null,
  brotherhood_types text[] not null
) on commit drop;

insert into _hc_tejera_glory_brotherhoods values
  (
    'hermandad-araceli-sevilla',
    'Nuestra Señora de Araceli',
    'Hermandad de Nuestra Señora de Araceli',
    'sevilla', array['Gloria']::text[]
  ),
  (
    'sacramental-san-pedro-sevilla',
    'Sacramental de San Pedro',
    'Hermandad Sacramental de San Pedro',
    'sevilla', array['Sacramental']::text[]
  ),
  (
    'quinta-angustia-sevilla',
    'La Quinta Angustia',
    'Hermandad Sacramental de la Quinta Angustia',
    'sevilla', array['Penitencia', 'Sacramental']::text[]
  ),
  (
    'madre-dios-rosario-triana',
    'Madre de Dios del Rosario',
    'Hermandad Sacramental de Madre de Dios del Rosario, Patrona de Capataces y Costaleros',
    'sevilla', array['Gloria', 'Sacramental']::text[]
  ),
  (
    'hermandad-nieves-sevilla',
    'Nuestra Señora de las Nieves',
    'Hermandad de Nuestra Señora de las Nieves',
    'sevilla', array['Gloria']::text[]
  ),
  (
    'siete-palabras-sevilla',
    'Las Siete Palabras',
    'Hermandad de las Siete Palabras',
    'sevilla', array['Penitencia', 'Sacramental']::text[]
  ),
  (
    'reina-todos-santos-sevilla',
    'Reina de Todos los Santos',
    'Hermandad Sacramental de Nuestra Señora Reina de Todos los Santos',
    'sevilla', array['Gloria', 'Sacramental']::text[]
  ),
  (
    'pura-limpia-postigo-sevilla',
    'Pura y Limpia del Postigo',
    'Hermandad de la Pura y Limpia Concepción del Postigo',
    'sevilla', array['Gloria']::text[]
  ),
  (
    'dolores-camas',
    'Nuestra Señora de los Dolores de Camas',
    'Hermandad Sacramental de Nuestra Señora de los Dolores de Camas',
    'camas', array['Penitencia', 'Sacramental']::text[]
  ),
  (
    'consolacion-carrion-cespedes',
    'Nuestra Señora de Consolación',
    'Hermandad de Nuestra Señora de Consolación de Carrión de los Céspedes',
    'carrion-de-los-cespedes', array['Gloria', 'Sacramental']::text[]
  ),
  (
    'sacramental-villanueva-ariscal',
    'Sacramental de Villanueva del Ariscal',
    'Hermandad Sacramental de Villanueva del Ariscal',
    'villanueva-del-ariscal', array['Sacramental']::text[]
  ),
  (
    'nieves-benacazon',
    'Nuestra Señora de las Nieves Coronada',
    'Hermandad de Nuestra Señora de las Nieves Coronada de Benacazón',
    'benacazon', array['Gloria']::text[]
  ),
  (
    'vera-cruz-dos-hermanas',
    'Vera Cruz de Dos Hermanas',
    'Hermandad de la Vera Cruz de Dos Hermanas',
    'dos-hermanas', array['Penitencia', 'Gloria']::text[]
  ),
  (
    'gran-poder-gerena',
    'Gran Poder de Gerena',
    'Agrupación Parroquial del Gran Poder de Gerena',
    'gerena', array['Penitencia', 'Gloria']::text[]
  );

insert into public.entities (entity_type, name, slug, status)
select 'brotherhood', desired.name, desired.slug, 'draft'
from _hc_tejera_glory_brotherhoods desired
on conflict (slug) do update set
  name = excluded.name,
  updated_at = now();

insert into public.brotherhoods (
  entity_id, official_name, popular_name,
  municipality_id, brotherhood_types
)
select
  entity.id,
  desired.official_name,
  desired.name,
  municipality.id,
  desired.brotherhood_types
from _hc_tejera_glory_brotherhoods desired
join public.entities entity
  on entity.entity_type = 'brotherhood'
 and entity.slug = desired.slug
join public.municipalities municipality
  on municipality.slug = desired.municipality_slug
on conflict (entity_id) do update set
  official_name = excluded.official_name,
  popular_name = excluded.popular_name,
  municipality_id = excluded.municipality_id,
  brotherhood_types = excluded.brotherhood_types;

update public.brotherhoods brotherhood
set brotherhood_types = (
  select array_agg(distinct type_name order by type_name)
  from unnest(brotherhood.brotherhood_types || array['Gloria']::text[]) type_name
)
from public.entities entity
where brotherhood.entity_id = entity.id
  and entity.entity_type = 'brotherhood'
  and entity.slug = 'hermandad-de-la-mision-sevilla';

-- -----------------------------------------------------------------------------
-- 3. Quince contratos nuevos. El de la Encarnación se conserva con su mismo ID.
-- -----------------------------------------------------------------------------

drop table if exists pg_temp._hc_tejera_glory_contracts;
create temporary table _hc_tejera_glory_contracts (
  brotherhood_slug text primary key,
  outing_type text not null,
  position text not null,
  date_from_text text not null,
  public_brotherhood_name text not null,
  public_step_name text not null,
  notes text not null,
  source_url text not null,
  source_name text not null,
  source_type text not null,
  publisher text,
  publication_date date
) on commit drop;

insert into _hc_tejera_glory_contracts values
  (
    'hermandad-araceli-sevilla', 'Procesión de gloria',
    'Tras el paso de Nuestra Señora de Araceli', 'Mayo de 2026',
    'Nuestra Señora de Araceli', 'Paso procesional de Nuestra Señora de Araceli',
    'Contrato renovado para la procesión de gloria de mayo de 2026.',
    'https://eldiariocofrade.org/sevilla/la-hermandad-de-nuestra-senora-de-araceli-renueva-su-compromiso-musical-con-la-banda-del-maestro-tejera-para-la-procesion-de-mayo/',
    'Araceli renueva su compromiso musical con Maestro Tejera para mayo de 2026',
    'Prensa cofrade', 'El Diario Cofrade', '2026-01-27'
  ),
  (
    'sacramental-san-pedro-sevilla', 'Procesión eucarística',
    'Tras el Santísimo Sacramento', '31 de mayo de 2026',
    'Sacramental de San Pedro', 'Paso de la Custodia del Corpus Christi',
    'Acompañamiento musical de la procesión eucarística de la feligresía de San Pedro.',
    'https://www.hermandades-de-sevilla.org/consejo/diez-procesiones-eucaristicas-saldran-el-domingo-31-de-mayo/',
    'Diez procesiones eucarísticas saldrán el domingo 31 de mayo',
    'Web oficial', 'Consejo General de Hermandades y Cofradías de Sevilla', null
  ),
  (
    'quinta-angustia-sevilla', 'Procesión eucarística',
    'Tras el paso del Niño Jesús del Dulce Nombre', '7 de junio de 2026',
    'La Quinta Angustia', 'Paso del Niño Jesús del Dulce Nombre',
    'Acompañamiento musical dentro de la procesión eucarística de la Parroquia de la Magdalena.',
    'https://www.hermandades-de-sevilla.org/consejo/siete-procesiones-eucaristicas-salen-el-domingo-del-corpus/',
    'Siete procesiones eucarísticas salen el domingo del Corpus',
    'Web oficial', 'Consejo General de Hermandades y Cofradías de Sevilla', null
  ),
  (
    'hermandad-de-la-mision-sevilla', 'Procesión de gloria',
    'Tras el paso del Inmaculado Corazón de María', '13 de junio de 2026',
    'La Misión', 'Paso del Inmaculado Corazón de María',
    'Acompañamiento musical de la procesión de gloria por las calles de Heliópolis.',
    'https://www.facebook.com/bmmaestrotejera/posts/13-de-junioel-pr%C3%B3ximo-s%C3%A1bado-acompa%C3%B1aremos-musicalmente-a-la-procesi%C3%B3n-del-inmac/1630634582175553/',
    'Procesión del Inmaculado Corazón de María · 13 de junio de 2026',
    'Red social oficial', 'Banda de Música del Maestro Tejera', null
  ),
  (
    'madre-dios-rosario-triana', 'Procesión de gloria',
    'Tras el paso de Madre de Dios del Rosario', 'Relación anual vigente',
    'Madre de Dios del Rosario', 'Paso procesional de Madre de Dios del Rosario',
    'Vínculo anual de la banda con la Patrona de Capataces y Costaleros; última edición documentada en 2025.',
    'https://madredediosdelrosario.wordpress.com/atencion-al-hermano/',
    'Procesión de Madre de Dios del Rosario',
    'Web oficial', 'Hermandad de Madre de Dios del Rosario', null
  ),
  (
    'hermandad-nieves-sevilla', 'Procesión de gloria',
    'Tras el paso de Nuestra Señora de las Nieves', 'Relación anual vigente',
    'Nuestra Señora de las Nieves', 'Paso procesional de Nuestra Señora de las Nieves',
    'Relación anual de la corporación de Santa María la Blanca; última edición documentada en 2025.',
    'https://www.hermandades-de-sevilla.org/events/hermandades-de-gloria-que-procesionan-el-19-de-octubre-2/',
    'Hermandades de Gloria que procesionan el 19 de octubre',
    'Web oficial', 'Consejo General de Hermandades y Cofradías de Sevilla', null
  ),
  (
    'siete-palabras-sevilla', 'Procesión de gloria',
    'Tras el paso de Nuestra Señora del Rosario', 'Relación anual vigente',
    'Rosario de San Vicente', 'Paso procesional de Nuestra Señora del Rosario',
    'Relación anual vinculada a la procesión del Rosario de San Vicente; última edición documentada en 2025.',
    'https://www.hermandades-de-sevilla.org/consejo/las-procesiones-del-rosario-de-santa-catalina-y-de-san-vicente-estrenan-las-glorias-de-noviembre/',
    'Las procesiones del Rosario de Santa Catalina y de San Vicente',
    'Web oficial', 'Consejo General de Hermandades y Cofradías de Sevilla', null
  ),
  (
    'reina-todos-santos-sevilla', 'Procesión de gloria',
    'Tras el paso de Nuestra Señora Reina de Todos los Santos', 'Relación anual vigente',
    'Reina de Todos los Santos', 'Paso procesional de Nuestra Señora Reina de Todos los Santos',
    'Relación anual de la corporación de Omnium Sanctorum; última edición documentada en 2025.',
    'https://www.hermandades-de-sevilla.org/consejo/la-virgen-del-amparo-y-la-reina-de-todos-los-santos-procesionan-este-domingo-en-sevilla/',
    'La Virgen del Amparo y la Reina de Todos los Santos procesionan en Sevilla',
    'Web oficial', 'Consejo General de Hermandades y Cofradías de Sevilla', null
  ),
  (
    'pura-limpia-postigo-sevilla', 'Procesión de gloria',
    'Tras el paso de la Pura y Limpia Concepción', 'Relación anual vigente',
    'Pura y Limpia del Postigo', 'Paso procesional de la Pura y Limpia Concepción',
    'Relación anual con la procesión de la Pura y Limpia del Postigo; última edición documentada en 2025.',
    'https://www.puraylimpiadelpostigo.org/2025/11/17/solemnes-cultos-a-la-pura-y-limpia-2025/',
    'Solemnes cultos a la Pura y Limpia 2025',
    'Web oficial', 'Hermandad de la Pura y Limpia Concepción', '2025-11-17'
  ),
  (
    'dolores-camas', 'Procesión extraordinaria',
    'Tras el paso de Nuestra Señora de los Dolores', '30 de mayo de 2026',
    'Nuestra Señora de los Dolores de Camas', 'Paso procesional de Nuestra Señora de los Dolores',
    'Contrato puntual para la procesión extraordinaria de 2026; no se presenta como relación anual.',
    'https://www.facebook.com/ayuntamiento.decamas/posts/%EF%B8%8F-tradiciones-cuenta-atr%C3%A1s-para-la-procesi%C3%B3n-extraordinaria-de-nuestra-se%C3%B1ora-ma/1413319070839308/',
    'Procesión extraordinaria de Nuestra Señora de los Dolores de Camas',
    'Información municipal', 'Ayuntamiento de Camas', null
  ),
  (
    'consolacion-carrion-cespedes', 'Procesión eucarística',
    'Tras el paso de Nuestra Señora de Consolación', '4 de junio de 2026',
    'Nuestra Señora de Consolación', 'Paso procesional de Nuestra Señora de Consolación',
    'Acompañamiento musical durante el Corpus Christi de Carrión de los Céspedes.',
    'https://www.facebook.com/bmmaestrotejera/posts/-4-de-junio-ma%C3%B1ana-jueves-4-de-junio-tendremos-el-honor-de-acompa%C3%B1ar-musicalment/1622747852964226/',
    'Corpus Christi de Carrión de los Céspedes · 4 de junio de 2026',
    'Red social oficial', 'Banda de Música del Maestro Tejera', null
  ),
  (
    'sacramental-villanueva-ariscal', 'Procesión eucarística',
    'Tras el Santísimo Sacramento', '25 de julio de 2026',
    'Sacramental de Villanueva del Ariscal', 'Paso de la Custodia del Corpus Christi',
    'Acompañamiento musical en la procesión del Corpus Christi de Villanueva del Ariscal.',
    'https://www.facebook.com/bmmaestrotejera/posts/-25-de-julio-%F0%9D%91%BA%F0%9D%91%A8%F0%9D%91%B3%F0%9D%91%B0%F0%9D%91%AB%F0%9D%91%A8-%F0%9D%91%B7%F0%9D%91%B9%F0%9D%91%B6%F0%9D%91%AA%F0%9D%91%AC%F0%9D%91%BA%F0%9D%91%B0%F0%9D%91%B6%F0%9D%91%B5%F0%9D%91%A8%F0%9D%91%B3-hoy-nos-trasladamos-a-villanueva-del-ariscal-par/1670666251505719/',
    'Corpus Christi de Villanueva del Ariscal · 25 de julio de 2026',
    'Red social oficial', 'Banda de Música del Maestro Tejera', null
  ),
  (
    'nieves-benacazon', 'Procesión de gloria',
    'Tras el paso de Nuestra Señora de las Nieves Coronada', '2 de agosto de 2026',
    'Nuestra Señora de las Nieves Coronada', 'Paso procesional de Nuestra Señora de las Nieves Coronada',
    'Acompañamiento musical de la procesión de la Patrona de Benacazón.',
    'https://www.instagram.com/reel/DbsgwCXMzGi/',
    'Procesión de Nuestra Señora de las Nieves Coronada de Benacazón 2026',
    'Crónica audiovisual', 'Provincia Cofrade', null
  ),
  (
    'vera-cruz-dos-hermanas', 'Procesión de gloria',
    'Tras el paso de Nuestra Señora de la Asunción a los Cielos', '15 de agosto de 2026',
    'Vera Cruz de Dos Hermanas', 'Paso de Nuestra Señora de la Asunción a los Cielos',
    'Acompañamiento musical de la procesión gloriosa de la Señorita de San Sebastián.',
    'https://www.elpespunte.es/articulo/cofrade/cultos-procesion-virgen-asuncion-dos-hermanas-2026-horarios-recorrido-banda/20260810124310144834.html',
    'Cultos y procesión de la Virgen de la Asunción de Dos Hermanas 2026',
    'Prensa cofrade', 'El Pespunte', '2026-08-10'
  ),
  (
    'gran-poder-gerena', 'Procesión de gloria',
    'Tras el paso de María Santísima del Rosario', '10 de octubre de 2026',
    'Gran Poder de Gerena', 'Paso procesional de María Santísima del Rosario',
    'Contrato anunciado para la salida procesional de María Santísima del Rosario de 2026.',
    'https://www.instagram.com/p/DbBeMwclVDP/',
    'Salida procesional de María Santísima del Rosario de Gerena 2026',
    'Red social oficial', 'Agrupación Parroquial del Gran Poder de Gerena', null
  );

update public.music_accompaniment_periods period
set
  step_entity_id = null,
  position = desired.position,
  outing_type = desired.outing_type,
  date_from = null,
  date_from_text = desired.date_from_text,
  year_from = null,
  date_to = null,
  date_to_text = null,
  year_to = null,
  is_current = true,
  notes = desired.notes,
  status = 'published',
  public_brotherhood_name = desired.public_brotherhood_name,
  public_step_name = desired.public_step_name,
  public_brotherhood_slug = desired.brotherhood_slug,
  updated_at = now()
from _hc_tejera_glory_contracts desired
join public.entities band
  on band.entity_type = 'band'
 and band.slug = 'banda-de-musica-del-maestro-tejera'
join public.entities brotherhood
  on brotherhood.entity_type = 'brotherhood'
 and brotherhood.slug = desired.brotherhood_slug
where period.band_entity_id = band.id
  and period.brotherhood_entity_id = brotherhood.id
  and period.outing_type = desired.outing_type
  and period.public_step_name = desired.public_step_name
  and period.is_current
  and period.status <> 'archived';

insert into public.music_accompaniment_periods (
  brotherhood_entity_id, band_entity_id, step_entity_id,
  position, outing_type, date_from_text,
  is_current, notes, status,
  public_brotherhood_name, public_step_name, public_brotherhood_slug
)
select
  brotherhood.id,
  band.id,
  null,
  desired.position,
  desired.outing_type,
  desired.date_from_text,
  true,
  desired.notes,
  'published',
  desired.public_brotherhood_name,
  desired.public_step_name,
  desired.brotherhood_slug
from _hc_tejera_glory_contracts desired
join public.entities band
  on band.entity_type = 'band'
 and band.slug = 'banda-de-musica-del-maestro-tejera'
join public.entities brotherhood
  on brotherhood.entity_type = 'brotherhood'
 and brotherhood.slug = desired.brotherhood_slug
where not exists (
  select 1
  from public.music_accompaniment_periods existing
  where existing.band_entity_id = band.id
    and existing.brotherhood_entity_id = brotherhood.id
    and existing.outing_type = desired.outing_type
    and existing.public_step_name = desired.public_step_name
    and existing.is_current
    and existing.status <> 'archived'
);

-- -----------------------------------------------------------------------------
-- 4. Una fuente trazable para cada contrato nuevo
-- -----------------------------------------------------------------------------

update public.sources source
set
  name = desired.source_name,
  source_type = desired.source_type,
  author_or_publisher = desired.publisher,
  publication_date = desired.publication_date,
  accessed_at = '2026-08-21'::date
from _hc_tejera_glory_contracts desired
where source.url = desired.source_url;

insert into public.sources (
  name, url, source_type, author_or_publisher,
  publication_date, accessed_at
)
select
  desired.source_name,
  desired.source_url,
  desired.source_type,
  desired.publisher,
  desired.publication_date,
  '2026-08-21'::date
from _hc_tejera_glory_contracts desired
where not exists (
  select 1 from public.sources source where source.url = desired.source_url
);

insert into public.source_links (
  source_id, music_accompaniment_period_id, scope
)
select
  source.id,
  period.id,
  'Vigencia, fecha y ubicación del acompañamiento musical'
from _hc_tejera_glory_contracts desired
join public.entities band
  on band.entity_type = 'band'
 and band.slug = 'banda-de-musica-del-maestro-tejera'
join public.entities brotherhood
  on brotherhood.entity_type = 'brotherhood'
 and brotherhood.slug = desired.brotherhood_slug
join public.music_accompaniment_periods period
  on period.band_entity_id = band.id
 and period.brotherhood_entity_id = brotherhood.id
 and period.outing_type = desired.outing_type
 and period.public_step_name = desired.public_step_name
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
-- 5. Invariantes editoriales
-- -----------------------------------------------------------------------------

do $$
declare
  band_id uuid;
  banderin_id uuid;
  holy_week_count integer;
  glory_count integer;
  sourced_glory_count integer;
  duplicate_count integer;
begin
  select entity.id into band_id
  from public.entities entity
  where entity.entity_type = 'band'
    and entity.slug = 'banda-de-musica-del-maestro-tejera';

  if band_id is null then
    raise exception 'No existe la banda de Maestro Tejera';
  end if;

  select band.banderin_entity_id into banderin_id
  from public.bands band
  where band.entity_id = band_id;

  if banderin_id is null or not exists (
    select 1
    from public.heritage_assets asset
    where asset.entity_id = banderin_id
      and asset.parent_entity_id = band_id
      and asset.asset_type = 'Banderín'
      and asset.public_image_path = '/bandas/maestro-tejera/banderin.webp'
  ) then
    raise exception 'El banderín de Maestro Tejera no ha quedado vinculado correctamente';
  end if;

  select count(*) into holy_week_count
  from public.music_accompaniment_periods period
  where period.band_entity_id = band_id
    and period.is_current
    and period.status = 'published'
    and period.outing_type = any (array[
      'Viernes de Dolores', 'Sábado de Pasión', 'Domingo de Ramos',
      'Lunes Santo', 'Martes Santo', 'Miércoles Santo', 'Jueves Santo',
      'Madrugada', 'Viernes Santo', 'Sábado Santo', 'Domingo de Resurrección'
    ]::text[]);

  if holy_week_count <> 7 then
    raise exception 'Maestro Tejera debe conservar 7 contratos de Semana Santa; encontrados: %', holy_week_count;
  end if;

  select count(*) into glory_count
  from public.music_accompaniment_periods period
  where period.band_entity_id = band_id
    and period.is_current
    and period.status = 'published'
    and not (period.outing_type = any (array[
      'Viernes de Dolores', 'Sábado de Pasión', 'Domingo de Ramos',
      'Lunes Santo', 'Martes Santo', 'Miércoles Santo', 'Jueves Santo',
      'Madrugada', 'Viernes Santo', 'Sábado Santo', 'Domingo de Resurrección'
    ]::text[]));

  if glory_count <> 16 then
    raise exception 'Maestro Tejera debe tener 16 contratos de Glorias y cultos externos; encontrados: %', glory_count;
  end if;

  select count(distinct period.id) into sourced_glory_count
  from public.music_accompaniment_periods period
  join public.source_links source_link
    on source_link.music_accompaniment_period_id = period.id
  where period.band_entity_id = band_id
    and period.is_current
    and period.status = 'published'
    and not (period.outing_type = any (array[
      'Viernes de Dolores', 'Sábado de Pasión', 'Domingo de Ramos',
      'Lunes Santo', 'Martes Santo', 'Miércoles Santo', 'Jueves Santo',
      'Madrugada', 'Viernes Santo', 'Sábado Santo', 'Domingo de Resurrección'
    ]::text[]));

  if sourced_glory_count <> 16 then
    raise exception 'Los 16 contratos de Glorias y cultos externos deben tener fuente; encontrados: %', sourced_glory_count;
  end if;

  select count(*) into duplicate_count
  from (
    select brotherhood_entity_id, outing_type, public_step_name
    from public.music_accompaniment_periods
    where band_entity_id = band_id
      and is_current
      and status <> 'archived'
    group by brotherhood_entity_id, outing_type, public_step_name
    having count(*) > 1
  ) duplicates;

  if duplicate_count <> 0 then
    raise exception 'La migración ha generado contratos vigentes duplicados';
  end if;

  if (
    select count(*)
    from public.entity_social_links link
    where link.entity_id = band_id
      and lower(link.platform) = 'spotify'
      and link.url = 'https://open.spotify.com/artist/1NHEuJrDVMZmcw1oPASjxW'
      and link.is_public
  ) <> 1 then
    raise exception 'El perfil de Spotify no ha quedado normalizado';
  end if;
end $$;
