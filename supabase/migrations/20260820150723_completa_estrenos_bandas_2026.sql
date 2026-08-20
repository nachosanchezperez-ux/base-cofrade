-- Hilo Cofrade · Estrenos e incorporaciones de repertorio de las bandas en 2026
--
-- La tabla band_premieres representa la incorporación de una obra al repertorio
-- de una formación. Por eso se incluyen también las adaptaciones que las propias
-- bandas presentan como estreno en 2026.

create temporary table _hc_premieres_2026 (
  band_slug text not null,
  title text not null,
  composer_name text not null,
  premiere_date date,
  venue_text text,
  municipality_text text,
  video_url text not null,
  description text not null,
  primary_source_url text not null,
  display_order integer not null,
  primary key (band_slug, title)
) on commit drop;

insert into _hc_premieres_2026 values
  (
    'banda-del-sol', 'Cuando Triana se va…', 'José Manuel Ortega León',
    '2026-02-14', 'Iglesia Conventual del Santo Ángel', 'Sevilla',
    'https://www.youtube.com/watch?v=4wiwz4pjLzo',
    'Marcha inspirada en el regreso de las hermandades trianeras después de su presentación ante la Capilla de la Piedad del Baratillo.',
    'https://www.youtube.com/watch?v=4wiwz4pjLzo', 10
  ),
  (
    'banda-del-sol', 'Rezaré', 'Silvio y Sacramento · adaptación de Alejandro Blanco y Francisco Javier Pérez',
    '2026-03-09', 'Cartuja Center CITE · XXXVII Gala El Llamador', 'Sevilla',
    'https://www.youtube.com/watch?v=7cyyFSW2Ot4',
    'Adaptación de la canción de Silvio y Sacramento, presentada en la XXXVII Gala El Llamador.',
    'https://www.youtube.com/watch?v=7cyyFSW2Ot4', 20
  ),
  (
    'banda-del-sol', 'SôL Aniversario. 50 Años de SôL Por Sevilla Siempre, Volumen I', 'Israel Jiménez Chozas',
    '2026-03-09', 'Cartuja Center CITE · XXXVII Gala El Llamador', 'Sevilla',
    'https://www.youtube.com/watch?v=yHcsPteMOPE',
    'Primera obra del proyecto conmemorativo que recorre composiciones emblemáticas de los cincuenta años de la Banda del Sol.',
    'https://www.youtube.com/watch?v=yHcsPteMOPE', 30
  ),
  (
    'banda-del-sol', 'La Borriquita', 'Fernando Aguado Hernández',
    '2026-03-21', 'Parroquia de Santa María de la Cabeza', 'Sevilla',
    'https://www.youtube.com/watch?v=54-fJ17uhL8',
    'Marcha presentada por la Banda del Sol durante su concierto en la Parroquia de Santa María de la Cabeza.',
    'https://www.youtube.com/watch?v=54-fJ17uhL8', 40
  ),

  (
    'banda-municipal-de-musica-de-la-puebla-del-rio', 'Y en la hora novena', 'Darío Martínez Párraga',
    '2026-02-18', 'Iglesia Conventual del Santo Ángel', 'Sevilla',
    'https://www.youtube.com/watch?v=pczq6dTHxU8',
    'Marcha dedicada al Santísimo Cristo de los Desamparados y estrenada en el concierto «De Sevilla para Sevilla» del Miércoles de Ceniza.',
    'https://www.youtube.com/watch?v=pczq6dTHxU8', 10
  ),
  (
    'banda-municipal-de-musica-de-la-puebla-del-rio', 'Todo aquel que la mira…', 'Antonio David Rodríguez',
    '2026-02-22', 'Hermandad de la Vera+Cruz', 'Alcalá del Río',
    'https://www.youtube.com/watch?v=4RYG2E_UsWU',
    'Estreno presentado por la Banda Municipal de La Puebla del Río en su concierto para la Vera+Cruz de Alcalá del Río.',
    'https://www.youtube.com/watch?v=4RYG2E_UsWU', 20
  ),
  (
    'banda-municipal-de-musica-de-la-puebla-del-rio', 'Cachorro Eterno', 'Cristóbal López Gándara',
    '2026-03-09', 'Cartuja Center CITE · XXXVII Gala El Llamador', 'Sevilla',
    'https://www.youtube.com/watch?v=687i0Gx9DAk',
    'Estreno conjunto de las bandas de La Puebla del Río y La Oliva de Salteras en la XXXVII Gala El Llamador.',
    'https://www.youtube.com/watch?v=687i0Gx9DAk', 30
  ),
  (
    'banda-municipal-de-musica-de-la-puebla-del-rio', '¡Cachorro de Dios, Cachorro!', 'Carlos Puelles Cervantes',
    '2026-03-13', 'Basílica del Santísimo Cristo de la Expiración', 'Sevilla',
    'https://www.youtube.com/watch?v=4rHKFsGfxqs',
    'Marcha estrenada por la Banda Municipal de La Puebla del Río en la sede canónica de la Hermandad del Cachorro.',
    'https://www.youtube.com/watch?v=4rHKFsGfxqs', 40
  ),

  (
    'carmen-de-salteras', 'Jesús Nazareno', 'Jesús Joaquín Espinosa de los Monteros',
    '2026-02-28', 'Plaza Hernández Amores', 'Murcia',
    'https://www.youtube.com/watch?v=eW_y91vtuWw',
    'Estreno absoluto con motivo del CDXXV aniversario de la cofradía murciana de Nuestro Padre Jesús Nazareno.',
    'https://elcarmendesalteras.es/el-carmen-estrenara-en-murcia-jesus-nazareno-la-nueva-marcha-de-espinosa-de-los-monteros/', 10
  ),
  (
    'carmen-de-salteras', 'La Esperanza de Judá', 'Borja Romero González',
    '2026-03-13', 'Basílica de la Macarena', 'Sevilla',
    'https://www.youtube.com/watch?v=ae28xhOn2-M',
    'Marcha dedicada a María Santísima de la Esperanza Macarena y estrenada en el concierto de Cuaresma de 2026.',
    'https://www.youtube.com/watch?v=ae28xhOn2-M', 20
  ),
  (
    'carmen-de-salteras', 'Estampas Macarenas', 'Carlos Guillén González',
    '2026-03-13', 'Basílica de la Macarena', 'Sevilla',
    'https://www.youtube.com/watch?v=CFZlQIR67xM',
    'Marcha dedicada a María Santísima de la Esperanza Macarena y estrenada en el concierto de Cuaresma de 2026.',
    'https://www.youtube.com/watch?v=CFZlQIR67xM', 30
  ),

  (
    'agrupacion-musical-nuestra-senora-de-la-encarnacion', 'Eterna Victoria', 'Juan Manuel Carmona',
    '2026-02-07', 'Parroquia de San Jacinto', 'Sevilla',
    'https://www.youtube.com/watch?v=DKXa6CXFEkk',
    'Obra dedicada a la Hermandad de la Paz y estrenada por la Agrupación Musical de la Encarnación.',
    'https://inriinformacion.com/2026/02/25/asi-suena-la-nueva-marcha-de-encarnacion-de-san-benito-eterna-victoria/', 10
  ),
  (
    'agrupacion-musical-nuestra-senora-de-la-encarnacion', 'En las tinieblas de mis dudas', 'Cristóbal López Gándara',
    '2026-02-28', 'Parroquia de San Ignacio de Loyola · Polígono San Pablo', 'Sevilla',
    'https://www.youtube.com/watch?v=gUOoyPJCH7Y',
    'Marcha dedicada a Nuestro Padre Jesús de la Presentación al Pueblo de la Hermandad de San Benito.',
    'https://inriinformacion.com/2026/03/16/asi-suena-la-nueva-marcha-de-encarnacion-de-san-benito-en-las-tinieblas-de-mis-dudas/', 20
  ),
  (
    'agrupacion-musical-nuestra-senora-de-la-encarnacion', 'En el Camino del Perdón', 'José María Conejo',
    null, 'Iglesia de San Gregorio', 'Sevilla',
    'https://www.youtube.com/watch?v=rI5fuJ3n5zg',
    'Obra dedicada a Nuestro Padre Jesús del Divino Perdón de la Hermandad del Divino Perdón del Parque Alcosa.',
    'https://www.youtube.com/watch?v=rI5fuJ3n5zg', 30
  ),
  (
    'agrupacion-musical-nuestra-senora-de-la-encarnacion', 'El Legado de Nazaret', 'Francisco David Álvarez Barroso',
    null, 'Concierto de Pino Montano', 'Sevilla',
    'https://www.youtube.com/watch?v=ND_K8v9Efwg',
    'Obra conmemorativa de los treinta años de la Encarnación tras Nuestro Padre Jesús de Nazaret de Pino Montano.',
    'https://www.youtube.com/watch?v=ND_K8v9Efwg', 40
  ),

  (
    'las-cigarreras', 'La otra mejilla', 'Francisco Javier González Ríos',
    '2026-01-30', 'Iglesia Conventual del Santo Ángel', 'Sevilla',
    'https://www.youtube.com/watch?v=tCMsviwTetg',
    'Marcha dedicada a la Hermandad de la Bofetá e incorporada al repertorio de Las Cigarreras en 2026.',
    'https://lascigarreras.net/repertorio/la-otra-mejilla/', 10
  ),
  (
    'las-cigarreras', 'Ánima Christi', 'Marco Frisina · adaptación de Cristóbal López Gándara',
    '2026-02-27', 'Teatro María Auxiliadora', 'Sevilla',
    'https://www.youtube.com/watch?v=fJ7ID-pC9gI',
    'Adaptación para cornetas y tambores incorporada al repertorio de Las Cigarreras en 2026.',
    'https://lascigarreras.net/repertorio/anima-christi/', 20
  ),
  (
    'las-cigarreras', 'Más cerca, oh Dios, de ti', 'Lowell Mason · adaptación de Cristóbal López Gándara',
    '2026-02-27', 'Teatro María Auxiliadora', 'Sevilla',
    'https://www.youtube.com/watch?v=pOb5EqeY4KM',
    'Adaptación para cornetas y tambores incorporada al repertorio de Las Cigarreras en 2026.',
    'https://lascigarreras.net/repertorio/mas-cerca-oh-dios-de-ti/', 30
  ),
  (
    'las-cigarreras', 'Yo soy la luz del mundo', 'Manuel Alejandro González Cruz',
    '2026-03-06', 'Parroquia de San Roque', 'Sevilla',
    'https://www.youtube.com/watch?v=JiEroqM_31w',
    'Marcha presentada por Las Cigarreras en la Parroquia de San Roque durante la Cuaresma de 2026.',
    'https://lascigarreras.net/repertorio/yo-soy-la-luz-del-mundo/', 40
  );

create temporary table _hc_premiere_sources_2026 (
  band_slug text not null,
  title text not null,
  source_name text not null,
  source_url text not null,
  source_type text not null,
  publisher text not null,
  scope text not null,
  primary key (band_slug, title, source_url)
) on commit drop;

insert into _hc_premiere_sources_2026
select
  premiere.band_slug,
  premiere.title,
  premiere.title || ' · vídeo de referencia',
  premiere.video_url,
  'video',
  case premiere.band_slug
    when 'banda-del-sol' then 'Banda de Cornetas y Tambores Nuestra Señora del Sol'
    when 'banda-municipal-de-musica-de-la-puebla-del-rio' then
      case when premiere.title = 'Cachorro Eterno' then 'Trianero Cofrade' else 'Banda Municipal de Música de La Puebla del Río' end
    when 'carmen-de-salteras' then 'Sociedad Filarmónica Nuestra Señora del Carmen de Salteras'
    when 'agrupacion-musical-nuestra-senora-de-la-encarnacion' then 'Agrupación Musical Nuestra Señora de la Encarnación'
    when 'las-cigarreras' then 'Banda de Cornetas y Tambores Nuestra Señora de la Victoria · Las Cigarreras'
  end,
  'Vídeo del estreno o interpretación de referencia de 2026'
from _hc_premieres_2026 premiere;

insert into _hc_premiere_sources_2026 values
  (
    'carmen-de-salteras', 'Jesús Nazareno',
    'El Carmen estrenará en Murcia «Jesús Nazareno»',
    'https://elcarmendesalteras.es/el-carmen-estrenara-en-murcia-jesus-nazareno-la-nueva-marcha-de-espinosa-de-los-monteros/',
    'website', 'Sociedad Filarmónica Nuestra Señora del Carmen de Salteras',
    'Anuncio oficial del estreno absoluto, autoría, fecha y lugar'
  ),
  (
    'agrupacion-musical-nuestra-senora-de-la-encarnacion', 'Eterna Victoria',
    'Así suena «Eterna Victoria»',
    'https://inriinformacion.com/2026/02/25/asi-suena-la-nueva-marcha-de-encarnacion-de-san-benito-eterna-victoria/',
    'website', 'INRI Información',
    'Crónica del estreno, autoría, dedicatoria, fecha y lugar'
  ),
  (
    'agrupacion-musical-nuestra-senora-de-la-encarnacion', 'En las tinieblas de mis dudas',
    'Así suena «En las tinieblas de mis dudas»',
    'https://inriinformacion.com/2026/03/16/asi-suena-la-nueva-marcha-de-encarnacion-de-san-benito-en-las-tinieblas-de-mis-dudas/',
    'website', 'INRI Información',
    'Crónica del estreno, autoría, dedicatoria, fecha y lugar'
  ),
  (
    'las-cigarreras', 'La otra mejilla', 'La otra mejilla · ficha de repertorio',
    'https://lascigarreras.net/repertorio/la-otra-mejilla/',
    'website', 'Las Cigarreras', 'Ficha oficial de repertorio, autoría, dedicatoria, fecha y lugar'
  ),
  (
    'las-cigarreras', 'Ánima Christi', 'Ánima Christi · ficha de repertorio',
    'https://lascigarreras.net/repertorio/anima-christi/',
    'website', 'Las Cigarreras', 'Ficha oficial de repertorio, adaptación, fecha y lugar'
  ),
  (
    'las-cigarreras', 'Más cerca, oh Dios, de ti', 'Más cerca, oh Dios, de ti · ficha de repertorio',
    'https://lascigarreras.net/repertorio/mas-cerca-oh-dios-de-ti/',
    'website', 'Las Cigarreras', 'Ficha oficial de repertorio, adaptación, fecha y lugar'
  ),
  (
    'las-cigarreras', 'Yo soy la luz del mundo', 'Yo soy la luz del mundo · ficha de repertorio',
    'https://lascigarreras.net/repertorio/yo-soy-la-luz-del-mundo/',
    'website', 'Las Cigarreras', 'Ficha oficial de repertorio, autoría, fecha y lugar'
  )
on conflict (band_slug, title, source_url) do update set
  source_name = excluded.source_name,
  source_type = excluded.source_type,
  publisher = excluded.publisher,
  scope = excluded.scope;

update public.sources source
set
  name = desired.source_name,
  source_type = desired.source_type,
  author_or_publisher = desired.publisher,
  accessed_at = current_date
from (
  select distinct on (source_url)
    source_url, source_name, source_type, publisher
  from _hc_premiere_sources_2026
  order by source_url, source_name
) desired
where source.url = desired.source_url;

insert into public.sources (
  name, url, source_type, author_or_publisher, accessed_at
)
select
  desired.source_name,
  desired.source_url,
  desired.source_type,
  desired.publisher,
  current_date
from (
  select distinct on (source_url)
    source_url, source_name, source_type, publisher
  from _hc_premiere_sources_2026
  order by source_url, source_name
) desired
where not exists (
  select 1
  from public.sources existing
  where existing.url = desired.source_url
);

insert into public.band_premieres (
  band_entity_id, title, composer_name, premiere_year, premiere_date,
  venue_text, municipality_text, video_url, description, source_id,
  status, display_order
)
select
  band.id,
  desired.title,
  desired.composer_name,
  2026,
  desired.premiere_date,
  desired.venue_text,
  desired.municipality_text,
  desired.video_url,
  desired.description,
  source.id,
  'published',
  desired.display_order
from _hc_premieres_2026 desired
join public.entities band
  on band.slug = desired.band_slug
 and band.entity_type = 'band'
join lateral (
  select candidate.id
  from public.sources candidate
  where candidate.url = desired.primary_source_url
  order by candidate.created_at, candidate.id
  limit 1
) source on true
on conflict (band_entity_id, title, premiere_year) do update set
  composer_name = excluded.composer_name,
  premiere_date = excluded.premiere_date,
  venue_text = excluded.venue_text,
  municipality_text = excluded.municipality_text,
  video_url = excluded.video_url,
  description = excluded.description,
  source_id = excluded.source_id,
  status = excluded.status,
  display_order = excluded.display_order,
  updated_at = now();

insert into public.source_links (
  source_id, band_premiere_id, scope
)
select
  source.id,
  premiere.id,
  desired.scope
from _hc_premiere_sources_2026 desired
join public.entities band
  on band.slug = desired.band_slug
 and band.entity_type = 'band'
join public.band_premieres premiere
  on premiere.band_entity_id = band.id
 and premiere.title = desired.title
 and premiere.premiere_year = 2026
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
    and existing.band_premiere_id = premiere.id
);

do $$
declare
  missing_premieres integer;
  missing_sources integer;
begin
  select count(*) into missing_premieres
  from _hc_premieres_2026 desired
  left join public.entities band
    on band.slug = desired.band_slug
   and band.entity_type = 'band'
  left join public.band_premieres premiere
    on premiere.band_entity_id = band.id
   and premiere.title = desired.title
   and premiere.premiere_year = 2026
   and premiere.status = 'published'
   and premiere.video_url = desired.video_url
  where premiere.id is null;

  if missing_premieres <> 0 then
    raise exception 'Estrenos de 2026 incompletos o sin vídeo: %', missing_premieres;
  end if;

  select count(*) into missing_sources
  from _hc_premiere_sources_2026 desired
  join public.entities band
    on band.slug = desired.band_slug
   and band.entity_type = 'band'
  join public.band_premieres premiere
    on premiere.band_entity_id = band.id
   and premiere.title = desired.title
   and premiere.premiere_year = 2026
  where not exists (
    select 1
    from public.source_links source_link
    join public.sources source on source.id = source_link.source_id
    where source_link.band_premiere_id = premiere.id
      and source.url = desired.source_url
  );

  if missing_sources <> 0 then
    raise exception 'Fuentes de estrenos de 2026 incompletas: %', missing_sources;
  end if;
end $$;
