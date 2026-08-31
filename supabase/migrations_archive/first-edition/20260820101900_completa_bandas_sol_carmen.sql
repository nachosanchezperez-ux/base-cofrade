-- Hilo Cofrade · Fichas completas de Banda del Sol y Carmen de Salteras
--
-- 1. Separa la vinculación institucional de los acompañamientos musicales.
-- 2. Asocia la Banda del Sol con la Hermandad del Sol.
-- 3. El Carmen de Salteras queda sin hermandad asociada.
-- 4. Completa dirección, acompañamientos de Semana Santa 2026, discografía,
--    estrenos recientes y fuentes documentales de ambas formaciones.

-- -----------------------------------------------------------------------------
-- 1. Identidad editorial y relación institucional correcta
-- -----------------------------------------------------------------------------

update public.entities
set summary = case slug
  when 'banda-del-sol' then
    'Banda sevillana de cornetas y tambores fundada en 1975, asociada a la Hermandad del Sol y con presencia estable en la Semana Santa de Sevilla.'
  when 'carmen-de-salteras' then
    'Sociedad filarmónica independiente de Salteras, fundada en 1928, con una de las trayectorias más estables de la música procesional andaluza.'
end
where entity_type = 'band'
  and slug in ('banda-del-sol', 'carmen-de-salteras');

update public.bands band
set
  linked_brotherhood_name = case entity.slug
    when 'banda-del-sol' then 'Hermandad del Sol'
    when 'carmen-de-salteras' then null
  end,
  description = case entity.slug
    when 'banda-del-sol' then
      'La Banda de Cornetas y Tambores Nuestra Señora del Sol nació en Sevilla en 1975 y está asociada a la Hermandad del Sol. En la Semana Santa de 2026 acompaña a la Borriquita, la Sentencia de Córdoba, la Piedad del Baratillo, Nuestro Padre Jesús Nazareno de La O y el Santo Cristo Varón de Dolores. Estos contratos musicales se documentan como acompañamientos y no como pertenencia a las hermandades.'
    when 'carmen-de-salteras' then
      'La Sociedad Filarmónica Nuestra Señora del Carmen de Salteras, fundada en 1928, es una institución musical independiente y no se asocia institucionalmente a ninguna hermandad. Su calendario penitencial de 2026 comprende La Amargura, Santa Genoveva, Los Blancos de Salteras, El Baratillo, el Gran Poder de Castilleja de la Cuesta, La Macarena, La O y Los Dolores de La Roda de Andalucía.'
  end,
  hero_image_alt = case entity.slug
    when 'banda-del-sol' then
      'Banda del Sol tras el paso de la Piedad de la Hermandad del Baratillo'
    when 'carmen-de-salteras' then
      'Músicos del Carmen de Salteras tras el paso de palio de María Santísima de la Caridad en su Soledad'
  end
from public.entities entity
where band.entity_id = entity.id
  and entity.entity_type = 'band'
  and entity.slug in ('banda-del-sol', 'carmen-de-salteras');

-- La Hermandad del Sol se prepara como entidad relacionable. Permanece en
-- borrador hasta que exista una ficha pública completa.
insert into public.entities (entity_type, name, slug, summary, status)
values (
  'brotherhood',
  'Hermandad del Sol',
  'hermandad-del-sol',
  'Hermandad sevillana con sede en la parroquia de San Diego de Alcalá y vinculada institucionalmente a la Banda del Sol.',
  'draft'
)
on conflict (slug) do update set
  name = excluded.name,
  summary = coalesce(public.entities.summary, excluded.summary);

-- Los contratos del Baratillo no son asociaciones institucionales.
delete from public.entity_relations relation
using public.entities band, public.entities brotherhood
where relation.source_entity_id = band.id
  and relation.target_entity_id = brotherhood.id
  and relation.relation_type in ('belongs_to_brotherhood', 'associated_with_brotherhood')
  and band.entity_type = 'band'
  and band.slug in ('banda-del-sol', 'carmen-de-salteras')
  and brotherhood.slug = 'el-baratillo';

-- El Carmen no queda vinculado institucionalmente a ninguna hermandad.
delete from public.entity_relations relation
using public.entities band
where relation.source_entity_id = band.id
  and band.entity_type = 'band'
  and band.slug = 'carmen-de-salteras'
  and relation.relation_type in ('belongs_to_brotherhood', 'associated_with_brotherhood');

insert into public.entity_relations (
  source_entity_id, relation_type, target_entity_id,
  date_from_text, notes, status
)
select
  band.id,
  'associated_with_brotherhood',
  brotherhood.id,
  'Vinculación institucional vigente',
  'La Banda del Sol está asociada a la Hermandad del Sol. Sus contratos con otras corporaciones se registran separadamente como acompañamientos musicales.',
  'published'
from public.entities band
join public.entities brotherhood
  on brotherhood.slug = 'hermandad-del-sol'
 and brotherhood.entity_type = 'brotherhood'
where band.slug = 'banda-del-sol'
  and band.entity_type = 'band'
  and not exists (
    select 1
    from public.entity_relations existing
    where existing.source_entity_id = band.id
      and existing.target_entity_id = brotherhood.id
      and existing.relation_type = 'associated_with_brotherhood'
  );

-- -----------------------------------------------------------------------------
-- 2. Hermandades y pasos auxiliares para los acompañamientos vigentes
-- -----------------------------------------------------------------------------

create temporary table _hc_music_entities (
  entity_type text not null,
  name text not null,
  slug text primary key
) on commit drop;

insert into _hc_music_entities values
  ('brotherhood', 'Hermandad del Amor', 'hermandad-del-amor'),
  ('brotherhood', 'Hermandad de la Sentencia de Córdoba', 'hermandad-sentencia-cordoba'),
  ('brotherhood', 'Hermandad de La O', 'hermandad-de-la-o'),
  ('brotherhood', 'Hermandad de la Amargura', 'hermandad-de-la-amargura'),
  ('brotherhood', 'Hermandad de Santa Genoveva', 'santa-genoveva'),
  ('brotherhood', 'Hermandad de los Blancos de Salteras', 'hermandad-blancos-salteras'),
  ('brotherhood', 'Hermandad del Gran Poder de Castilleja de la Cuesta', 'hermandad-gran-poder-castilleja'),
  ('brotherhood', 'Hermandad de la Macarena', 'hermandad-de-la-macarena'),
  ('brotherhood', 'Hermandad de los Dolores de La Roda de Andalucía', 'hermandad-dolores-roda-andalucia'),
  ('step', 'Paso de la Sagrada Entrada en Jerusalén', 'paso-sagrada-entrada-en-jerusalen-borriquita'),
  ('step', 'Paso de Nuestro Padre Jesús de la Sentencia', 'paso-jesus-sentencia-cordoba'),
  ('step', 'Paso de Nuestro Padre Jesús Nazareno', 'paso-nuestro-padre-jesus-nazareno-la-o'),
  ('step', 'Paso del Santo Cristo Varón de Dolores', 'paso-santisimo-cristo-varon-de-dolores'),
  ('step', 'Paso de palio de María Santísima de la Amargura Coronada', 'paso-palio-maria-santisima-amargura-coronada'),
  ('step', 'Paso de palio de María Santísima de las Mercedes', 'paso-palio-maria-santisima-mercedes-santa-genoveva'),
  ('step', 'Paso de palio de María Santísima de los Dolores', 'paso-palio-maria-santisima-dolores-salteras'),
  ('step', 'Paso de misterio del Santísimo Cristo de la Vera Cruz', 'paso-misterio-cristo-vera-cruz-castilleja'),
  ('step', 'Paso de palio de María Santísima de la Esperanza Macarena Coronada', 'paso-palio-esperanza-macarena'),
  ('step', 'Paso de palio de María Santísima de La O Coronada', 'paso-palio-maria-santisima-de-la-o'),
  ('step', 'Paso de palio de María Santísima de los Dolores Coronada', 'paso-palio-dolores-coronada-roda');

insert into public.entities (entity_type, name, slug, status)
select entity_type, name, slug, 'draft'
from _hc_music_entities
on conflict (slug) do update set
  name = excluded.name;

-- -----------------------------------------------------------------------------
-- 3. Acompañamientos musicales vigentes de Semana Santa 2026
-- -----------------------------------------------------------------------------

create temporary table _hc_current_music (
  band_slug text not null,
  brotherhood_slug text not null,
  step_slug text,
  outing_type text not null,
  position text not null,
  date_from_text text not null,
  year_from integer,
  date_to_text text,
  year_to integer,
  public_brotherhood_name text not null,
  public_step_name text not null,
  notes text not null,
  source_url text not null,
  primary key (band_slug, brotherhood_slug)
) on commit drop;

insert into _hc_current_music values
  (
    'banda-del-sol', 'hermandad-del-amor',
    'paso-sagrada-entrada-en-jerusalen-borriquita', 'Domingo de Ramos',
    'Tras el paso de la Sagrada Entrada en Jerusalén',
    'Vigente en 2026', null, null, null,
    'Hermandad del Amor · La Borriquita',
    'Paso de la Sagrada Entrada en Jerusalén',
    'La Banda del Sol acompaña a La Borriquita en el Domingo de Ramos de 2026.',
    'https://www.diariodesevilla.es/semana_santa/bandas-musica-semana-santa-sevilla-2026_0_2006120681.html'
  ),
  (
    'banda-del-sol', 'hermandad-sentencia-cordoba',
    'paso-jesus-sentencia-cordoba', 'Lunes Santo',
    'Tras Nuestro Padre Jesús de la Sentencia',
    'Retorno en 2026', 2026, null, null,
    'Hermandad de la Sentencia de Córdoba',
    'Paso de Nuestro Padre Jesús de la Sentencia',
    'La Banda del Sol regresó en 2026 tras el Señor de la Sentencia, después de anteriores etapas en los años ochenta y entre 2013 y 2016.',
    'https://www.elpespunte.es/articulo/cofrade/sones-sevilla-cantillana-hermandad-sentencia-cordoba/20251031000536113964.html'
  ),
  (
    'banda-del-sol', 'el-baratillo', 'paso-de-la-piedad',
    'Miércoles Santo', 'Tras el paso de la Piedad',
    'Vigente en 2026 · contrato hasta 2029', null, 'Hasta 2029', 2029,
    'Hermandad del Baratillo',
    'Paso del Santísimo Cristo de la Misericordia y Nuestra Señora de la Piedad',
    'Acompañamiento musical renovado para los Miércoles Santos de 2027, 2028 y 2029. No implica pertenencia ni asociación institucional con el Baratillo.',
    'https://hermandadelbaratillo.es/renovacion-del-contrato-con-la-banda-de-cc-tt-ntra-sra-del-sol/'
  ),
  (
    'banda-del-sol', 'hermandad-de-la-o',
    'paso-nuestro-padre-jesus-nazareno-la-o', 'Viernes Santo',
    'Tras Nuestro Padre Jesús Nazareno',
    'Desde 1984', 1984, null, null,
    'Hermandad de La O', 'Paso de Nuestro Padre Jesús Nazareno',
    'La Banda del Sol acompaña al Nazareno de La O desde la Semana Santa de 1984.',
    'https://www.hermandaddelao.es/viernes-santo/'
  ),
  (
    'banda-del-sol', 'hermandad-del-sol',
    'paso-santisimo-cristo-varon-de-dolores', 'Sábado Santo',
    'Tras el Santo Cristo Varón de Dolores',
    'Vigente en 2026', null, null, null,
    'Hermandad del Sol', 'Paso del Santo Cristo Varón de Dolores',
    'La formación asociada a la Hermandad del Sol acompaña al Santo Cristo Varón de Dolores en el Sábado Santo.',
    'https://www.101tv.es/sevilla/semana-santa/asi-se-ha-vivido-la-primera-parte-del-sabado-santo-en-sevilla-con-101tv/'
  ),
  (
    'carmen-de-salteras', 'hermandad-de-la-amargura',
    'paso-palio-maria-santisima-amargura-coronada', 'Domingo de Ramos',
    'Tras el paso de palio', 'Vigente en 2026', null, null, null,
    'Hermandad de la Amargura',
    'Paso de palio de María Santísima de la Amargura Coronada',
    'Acompañamiento incluido en el calendario penitencial oficial de la formación para 2026.',
    'https://elcarmendesalteras.es/nuestras-hermandades/hermandades-de-penitencia/'
  ),
  (
    'carmen-de-salteras', 'santa-genoveva',
    'paso-palio-maria-santisima-mercedes-santa-genoveva', 'Lunes Santo',
    'Tras el paso de palio', 'Vigente en 2026', null, null, null,
    'Hermandad de Santa Genoveva',
    'Paso de palio de María Santísima de las Mercedes',
    'Acompañamiento incluido en el calendario penitencial oficial de la formación para 2026.',
    'https://elcarmendesalteras.es/nuestras-hermandades/hermandades-de-penitencia/'
  ),
  (
    'carmen-de-salteras', 'hermandad-blancos-salteras',
    'paso-palio-maria-santisima-dolores-salteras', 'Martes Santo',
    'Tras el paso de palio', 'Vigente en 2026', null, null, null,
    'Hermandad de los Blancos de Salteras',
    'Paso de palio de María Santísima de los Dolores',
    'Acompañamiento incluido en el calendario penitencial oficial de la formación para 2026.',
    'https://elcarmendesalteras.es/nuestras-hermandades/hermandades-de-penitencia/'
  ),
  (
    'carmen-de-salteras', 'el-baratillo',
    'paso-de-palio-de-maria-santisima-de-la-caridad', 'Miércoles Santo',
    'Tras el paso de palio de la Caridad', 'Desde 1980', 1980, null, null,
    'Hermandad del Baratillo',
    'Paso de palio de María Santísima de la Caridad en su Soledad',
    'Acompañamiento ininterrumpido desde 1980. Es un contrato musical y no una asociación institucional con el Baratillo.',
    'https://hermandadelbaratillo.es/renovacion-con-la-sociedad-filarmonica-de-ntra-sra-del-carmen-de-salteras/'
  ),
  (
    'carmen-de-salteras', 'hermandad-gran-poder-castilleja',
    'paso-misterio-cristo-vera-cruz-castilleja', 'Jueves Santo',
    'Tras el paso de misterio', 'Vigente en 2026', null, null, null,
    'Hermandad del Gran Poder de Castilleja de la Cuesta',
    'Paso de misterio del Santísimo Cristo de la Vera Cruz',
    'Acompañamiento incluido en el calendario penitencial oficial de la formación para 2026.',
    'https://elcarmendesalteras.es/nuestras-hermandades/hermandades-de-penitencia/'
  ),
  (
    'carmen-de-salteras', 'hermandad-de-la-macarena',
    'paso-palio-esperanza-macarena', 'Madrugá',
    'Tras el paso de palio', 'Desde 1978', 1978, null, null,
    'Hermandad de la Macarena',
    'Paso de palio de María Santísima de la Esperanza Macarena Coronada',
    'La relación con la Esperanza Macarena alcanzó veinticinco años en 2002 y continúa vigente en 2026.',
    'https://elcarmendesalteras.es/discografia/macareno-del-carmen-25-aniversario/'
  ),
  (
    'carmen-de-salteras', 'hermandad-de-la-o',
    'paso-palio-maria-santisima-de-la-o', 'Viernes Santo',
    'Tras el paso de palio', 'Vigente en 2026', null, null, null,
    'Hermandad de La O', 'Paso de palio de María Santísima de La O Coronada',
    'Acompañamiento incluido en el calendario penitencial oficial de la formación para 2026.',
    'https://elcarmendesalteras.es/nuestras-hermandades/hermandades-de-penitencia/'
  ),
  (
    'carmen-de-salteras', 'hermandad-dolores-roda-andalucia',
    'paso-palio-dolores-coronada-roda', 'Sábado Santo',
    'Tras el paso de palio', 'Vigente en 2026', null, null, null,
    'Hermandad de los Dolores de La Roda de Andalucía',
    'Paso de palio de María Santísima de los Dolores Coronada',
    'Acompañamiento incluido en el calendario penitencial oficial de la formación para 2026.',
    'https://elcarmendesalteras.es/nuestras-hermandades/hermandades-de-penitencia/'
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
  updated_at = now()
from _hc_current_music desired
join public.entities band
  on band.slug = desired.band_slug and band.entity_type = 'band'
join public.entities brotherhood
  on brotherhood.slug = desired.brotherhood_slug and brotherhood.entity_type = 'brotherhood'
left join public.entities step
  on step.slug = desired.step_slug and step.entity_type = 'step'
where period.band_entity_id = band.id
  and period.brotherhood_entity_id = brotherhood.id
  and period.is_current
  and period.status <> 'archived';

insert into public.music_accompaniment_periods (
  brotherhood_entity_id, band_entity_id, step_entity_id, position,
  outing_type, date_from_text, year_from, date_to_text, year_to,
  is_current, notes, status, public_brotherhood_name,
  public_step_name, public_brotherhood_slug
)
select
  brotherhood.id, band.id, step.id, desired.position,
  desired.outing_type, desired.date_from_text, desired.year_from,
  desired.date_to_text, desired.year_to, true, desired.notes, 'published',
  desired.public_brotherhood_name, desired.public_step_name,
  desired.brotherhood_slug
from _hc_current_music desired
join public.entities band
  on band.slug = desired.band_slug and band.entity_type = 'band'
join public.entities brotherhood
  on brotherhood.slug = desired.brotherhood_slug and brotherhood.entity_type = 'brotherhood'
left join public.entities step
  on step.slug = desired.step_slug and step.entity_type = 'step'
where not exists (
  select 1
  from public.music_accompaniment_periods existing
  where existing.band_entity_id = band.id
    and existing.brotherhood_entity_id = brotherhood.id
    and existing.is_current
    and existing.status <> 'archived'
);

-- -----------------------------------------------------------------------------
-- 4. Dirección actual
-- -----------------------------------------------------------------------------

insert into public.entities (entity_type, name, slug, summary, status)
values
  (
    'agent', 'Nicolás Cubero', 'nicolas-cubero',
    'Director general de la Banda del Sol desde agosto de 2026.', 'draft'
  ),
  (
    'agent', 'Irene Gómez-Calado', 'irene-gomez-calado',
    'Directora artística y musical del Carmen de Salteras desde agosto de 2026.', 'draft'
  )
on conflict (slug) do update set
  name = excluded.name,
  summary = excluded.summary;

update public.band_agents assignment
set is_current = false,
    date_to_text = 'Hasta 2026'
from public.entities band
where assignment.band_entity_id = band.id
  and band.slug in ('banda-del-sol', 'carmen-de-salteras')
  and assignment.is_current
  and assignment.agent_entity_id not in (
    select id from public.entities
    where slug in ('nicolas-cubero', 'irene-gomez-calado')
  );

insert into public.band_agents (
  band_entity_id, agent_entity_id, role_name,
  date_from, date_from_text, is_current, notes
)
select
  band.id, agent.id, desired.role_name,
  desired.date_from, desired.date_from_text, true, desired.notes
from (
  values
    (
      'banda-del-sol'::text, 'nicolas-cubero'::text,
      'Director general'::text, '2026-08-01'::date, 'Desde agosto de 2026'::text,
      'Responsable de la nueva etapa general de la formación.'::text
    ),
    (
      'carmen-de-salteras', 'irene-gomez-calado',
      'Directora artística y musical', '2026-08-14'::date, 'Desde agosto de 2026',
      'Nombramiento por un año, con carácter renovable anualmente.'
    )
) desired(band_slug, agent_slug, role_name, date_from, date_from_text, notes)
join public.entities band
  on band.slug = desired.band_slug and band.entity_type = 'band'
join public.entities agent
  on agent.slug = desired.agent_slug and agent.entity_type = 'agent'
on conflict (band_entity_id, agent_entity_id, role_name, date_from) do update set
  date_from_text = excluded.date_from_text,
  date_to = null,
  date_to_text = null,
  is_current = true,
  notes = excluded.notes;

-- -----------------------------------------------------------------------------
-- 5. Discografía
-- -----------------------------------------------------------------------------

create temporary table _hc_band_releases (
  band_slug text not null,
  title text not null,
  release_type text not null,
  release_year integer not null,
  release_date date,
  description text,
  spotify_url text,
  external_url text,
  primary key (band_slug, title, release_year)
) on commit drop;

insert into _hc_band_releases values
  ('banda-del-sol', 'Cuando Triana se va… (Live)', 'single', 2026, null, 'Sencillo en directo y último lanzamiento del perfil oficial de Spotify en 2026.', null, 'https://inriinformacion.com/2026/03/17/asi-suena-la-nueva-marcha-de-la-banda-del-sol-cuando-triana-se-va/'),
  ('banda-del-sol', 'Piedad Coronada', 'single', 2025, null, 'Sencillo publicado en el perfil oficial de la formación.', null, null),
  ('banda-del-sol', 'Anístemi', 'single', 2025, null, 'Sencillo publicado en el perfil oficial de la formación.', null, 'https://inriinformacion.com/2025/04/02/asi-suena-la-nueva-marcha-de-la-banda-del-sol-anistemi/'),
  ('banda-del-sol', 'Paseo de la O', 'single', 2025, null, 'Sencillo publicado en el perfil oficial de la formación.', null, null),
  ('banda-del-sol', 'La Música de Sevilla: Sonidos de la Madrugá', 'ep', 2025, null, 'EP disponible en el perfil oficial de Spotify.', null, null),
  ('banda-del-sol', 'La Música de la Esperanza', 'single', 2024, null, 'Sencillo publicado en el perfil oficial de la formación.', null, null),
  ('banda-del-sol', 'Niña del Arenal', 'single', 2024, null, 'Sencillo publicado en el perfil oficial de la formación.', null, null),
  ('banda-del-sol', 'Sol de Pasión. Selección Musical para Semana Santa', 'compilation', 2012, null, 'Selección discográfica de marchas procesionales de la Banda del Sol.', 'https://open.spotify.com/album/4oi0CARPELXYaIIjE60LmW', null),
  ('banda-del-sol', 'Bendición', 'album', 2002, null, 'Trabajo discográfico de nueve marchas publicado por Pasarela.', 'https://open.spotify.com/album/1pdX8a8ulTRLYu8Mb6kOxP', null),
  ('banda-del-sol', 'Sones de Sol', 'album', 1999, null, 'Trabajo que reúne marchas, toques y composiciones identificativas de la formación.', 'https://open.spotify.com/album/5Vpgts6diR80y0k1E1XCRs', null),
  ('banda-del-sol', 'Sol. XX Aniversario', 'album', 1995, null, 'Trabajo conmemorativo del vigésimo aniversario de la banda.', null, null),
  ('banda-del-sol', 'Sol', 'album', 1993, null, 'Álbum de ocho marchas procesionales.', 'https://open.spotify.com/album/5jUxky6jWpOoZK1nTnAVk6', null),
  ('banda-del-sol', 'Cuando la Semana Santa Empieza', 'album', 1992, null, 'Trabajo discográfico concebido como recorrido sonoro por Sevilla.', 'https://open.spotify.com/album/23vpMmMUG5JbE4N5OZw6H1', null),
  ('banda-del-sol', 'Sonidos de Sevilla (XV Aniversario)', 'album', 1990, null, 'Trabajo conmemorativo del decimoquinto aniversario fundacional.', null, null),
  ('banda-del-sol', 'Banda de Cornetas y Tambores Nuestra Señora del Sol', 'album', 1989, null, 'Álbum histórico de la formación sevillana.', null, null),
  ('banda-del-sol', 'Marchas Procesionales', 'album', 1986, '1986-05-15', 'Uno de los primeros trabajos discográficos de la Banda del Sol.', 'https://open.spotify.com/album/7bThfwSP14PtuNkJ3GwJNr', null),
  ('carmen-de-salteras', 'Jesús Nazareno', 'single', 2026, null, 'Marcha de Jesús Joaquín Espinosa de los Monteros estrenada en Murcia.', null, 'https://elcarmendesalteras.es/el-carmen-estrenara-en-murcia-jesus-nazareno-la-nueva-marcha-de-espinosa-de-los-monteros/'),
  ('carmen-de-salteras', 'El Carisma Carmelitano', 'album', 2026, '2026-03-18', 'Trabajo discográfico dedicado al patrimonio musical carmelitano.', 'https://open.spotify.com/album/4Vkmh1XJYY23ExLyGLmmmW', 'https://elcarmendesalteras.es/presentamos-la-pintura-que-ilustrara-la-portada-de-nuestro-nuevo-disco/'),
  ('carmen-de-salteras', 'La Esperanza de Judá', 'single', 2026, null, 'Marcha dedicada a la Esperanza Macarena y estrenada en 2026.', null, null),
  ('carmen-de-salteras', 'Estampas Macarenas', 'single', 2026, null, 'Marcha dedicada a la Esperanza Macarena y estrenada en 2026.', null, null),
  ('carmen-de-salteras', 'Marchando hacia la Esperanza', 'ep', 2026, null, 'EP disponible en el perfil oficial de Spotify.', null, null),
  ('carmen-de-salteras', 'El Carmen', 'single', 2025, null, 'Lanzamiento dedicado a la identidad carmelitana de la formación.', null, 'https://elcarmendesalteras.es/discografia/el-carmen/'),
  ('carmen-de-salteras', 'La Virgen de las Mercedes', 'single', 2024, null, 'Grabación dirigida por Guillermo Martínez Arana.', null, 'https://elcarmendesalteras.es/discografia/la-virgen-de-las-mercedes/'),
  ('carmen-de-salteras', 'Coronada de Luz', 'ep', 2024, null, 'Marchas de coronación de la Virgen de la Sangre.', null, 'https://elcarmendesalteras.es/discografia/'),
  ('carmen-de-salteras', 'Como tú, ninguna', 'single', 2024, null, 'Revisión instrumental de la marcha de David Hurtado Torres.', null, 'https://elcarmendesalteras.es/discografia/como-tu-ninguna/'),
  ('carmen-de-salteras', 'Nanas del Baratillo', 'single', 2024, null, 'Marcha de David Hurtado Torres vinculada al Baratillo.', null, 'https://elcarmendesalteras.es/discografia/'),
  ('carmen-de-salteras', 'A mi Piedad en la tarde', 'single', 2024, null, 'Marcha de Pablo Ojeda Jiménez vinculada al Baratillo.', null, 'https://elcarmendesalteras.es/discografia/'),
  ('carmen-de-salteras', 'La Cruz de Mayo', 'single', 2024, null, 'Grabación de la marcha de Manuel Font de Anta.', null, 'https://elcarmendesalteras.es/discografia/la-cruz-de-mayo/'),
  ('carmen-de-salteras', 'Concierto de Cuaresma en la Macarena (2024)', 'live', 2024, '2024-03-19', 'Grabación en directo del concierto dedicado a la Esperanza Macarena.', null, null),
  ('carmen-de-salteras', 'Concierto en San Juan de la Palma (2023)', 'live', 2023, null, 'Grabación en directo disponible en Spotify.', null, null),
  ('carmen-de-salteras', 'Concierto 40 años de Baratillo (2022)', 'live', 2022, null, 'Grabación del concierto conmemorativo de cuarenta años de vinculación musical con el Baratillo.', null, null),
  ('carmen-de-salteras', 'Concierto de Cuaresma en la Macarena (2022)', 'live', 2022, null, 'Grabación en directo del concierto cuaresmal en la basílica macarena.', null, null),
  ('carmen-de-salteras', 'Carmen', 'album', 2019, null, 'Trabajo discográfico dirigido por Guillermo Martínez Arana.', null, 'https://elcarmendesalteras.es/discografia/carmen/'),
  ('carmen-de-salteras', 'El Tarantán', 'album', 2016, null, 'Trabajo incluido en el catálogo oficial de la formación.', null, 'https://elcarmendesalteras.es/discografia/'),
  ('carmen-de-salteras', 'Salteras y sus Bandas de Música', 'album', 2018, null, 'Proyecto promovido por el Ayuntamiento de Salteras para difundir la cultura musical local.', null, 'https://elcarmendesalteras.es/discografia/salteras-y-sus-bandas-de-musica/'),
  ('carmen-de-salteras', 'Madre… para ti mi música', 'album', 2012, '2012-06-25', 'Trabajo de trece marchas procesionales.', null, 'https://elcarmendesalteras.es/discografia/'),
  ('carmen-de-salteras', 'Un Recuerdo', 'album', 2007, null, 'Trabajo incluido en el catálogo oficial de la formación.', null, 'https://elcarmendesalteras.es/discografia/'),
  ('carmen-de-salteras', 'Lignum Crucis', 'album', 2006, null, 'Trabajo incluido en el catálogo oficial de la formación.', null, 'https://elcarmendesalteras.es/discografia/'),
  ('carmen-de-salteras', 'Andalucía Cofrade', 'album', 2006, null, 'Trabajo incluido en el catálogo oficial de la formación.', null, 'https://elcarmendesalteras.es/discografia/'),
  ('carmen-de-salteras', 'Cádiz Cofrade', 'live', 2005, '2005-06-27', 'Grabación en directo en el Gran Teatro Falla de Cádiz.', 'https://open.spotify.com/album/0jBsniAu1YGgYHid1cTqjA', 'https://elcarmendesalteras.es/discografia/cadiz-cofrade/'),
  ('carmen-de-salteras', 'Salve, Baratillo', 'album', 2003, '2003-06-23', 'Trabajo discográfico dedicado al patrimonio musical del Baratillo.', null, 'https://elcarmendesalteras.es/discografia/salve-baratillo/'),
  ('carmen-de-salteras', 'Para Sevilla por su fundación', 'album', 2003, null, 'Trabajo discográfico disponible en el perfil oficial de Spotify.', null, null),
  ('carmen-de-salteras', '25 Aniversario Macareno del Carmen', 'album', 2002, '2002-06-24', 'Trabajo grabado con motivo de los veinticinco años acompañando a la Esperanza Macarena.', null, 'https://elcarmendesalteras.es/discografia/macareno-del-carmen-25-aniversario/'),
  ('carmen-de-salteras', 'Ecce Homo', 'album', 2001, '2001-06-25', 'Álbum de catorce piezas procesionales.', 'https://open.spotify.com/album/0GKU4JALAFftzyVJXj6TL9', null),
  ('carmen-de-salteras', 'Reina del Salvador', 'album', 2001, '2001-06-25', 'Trabajo dedicado a María Santísima de la Amargura.', 'https://open.spotify.com/album/19BBlWatGglGuoWQujD7K1', null),
  ('carmen-de-salteras', 'Chicotá', 'album', 1994, '1994-06-27', 'Álbum de once marchas procesionales.', 'https://open.spotify.com/album/7yXF16uc9r6QGRW3X2krix', null),
  ('carmen-de-salteras', 'Marchas Procesionales', 'album', 1987, '1987-06-29', 'Trabajo dirigido por José Antonio Santos Herrera.', null, 'https://elcarmendesalteras.es/discografia/marchas-procesionales/');

insert into public.band_releases (
  band_entity_id, title, release_type, release_year, release_date,
  description, spotify_url, external_url, status
)
select
  band.id, desired.title, desired.release_type, desired.release_year,
  desired.release_date, desired.description, desired.spotify_url,
  desired.external_url, 'published'
from _hc_band_releases desired
join public.entities band
  on band.slug = desired.band_slug and band.entity_type = 'band'
on conflict (band_entity_id, title, release_year) do update set
  release_type = excluded.release_type,
  release_date = excluded.release_date,
  description = excluded.description,
  spotify_url = excluded.spotify_url,
  external_url = excluded.external_url,
  status = excluded.status,
  updated_at = now();

-- Pistas documentadas de los lanzamientos más representativos.
create temporary table _hc_release_tracks (
  band_slug text not null,
  release_title text not null,
  release_year integer not null,
  sequence_no integer not null,
  title text not null,
  duration_text text,
  primary key (band_slug, release_title, release_year, sequence_no)
) on commit drop;

insert into _hc_release_tracks values
  ('banda-del-sol', 'Bendición', 2002, 1, 'Barrabás', '3:05'),
  ('banda-del-sol', 'Bendición', 2002, 2, 'La O', '4:00'),
  ('banda-del-sol', 'Bendición', 2002, 3, 'Amor Mío', '3:18'),
  ('banda-del-sol', 'Bendición', 2002, 4, 'Y Sevilla te Despojó', '4:01'),
  ('banda-del-sol', 'Bendición', 2002, 5, 'Herodes', '4:03'),
  ('banda-del-sol', 'Bendición', 2002, 6, 'Santo Cristo de la Misión', '3:57'),
  ('banda-del-sol', 'Bendición', 2002, 7, 'El Renacer', '3:37'),
  ('banda-del-sol', 'Bendición', 2002, 8, 'Lágrimas de San Pedro', '5:29'),
  ('banda-del-sol', 'Bendición', 2002, 9, 'Bendición', '2:51'),
  ('carmen-de-salteras', 'El Carisma Carmelitano', 2026, 1, 'Virgen del Carmen (Salteras)', '5:13'),
  ('carmen-de-salteras', 'El Carisma Carmelitano', 2026, 2, 'Carmen de Santa Ana', '3:36'),
  ('carmen-de-salteras', 'El Carisma Carmelitano', 2026, 3, 'Carmen Doloroso', '4:42'),
  ('carmen-de-salteras', 'El Carisma Carmelitano', 2026, 4, 'Virgen del Carmen de San Gil', '4:29'),
  ('carmen-de-salteras', 'El Carisma Carmelitano', 2026, 5, 'Carmelitana', '4:11'),
  ('carmen-de-salteras', 'El Carisma Carmelitano', 2026, 6, 'Carmen', '5:03'),
  ('carmen-de-salteras', 'El Carisma Carmelitano', 2026, 7, 'El Carmen', '4:23'),
  ('carmen-de-salteras', 'El Carisma Carmelitano', 2026, 8, 'La Virgen del Carmen', '6:21'),
  ('carmen-de-salteras', 'El Carisma Carmelitano', 2026, 9, 'Himno a la Virgen del Carmen', '2:27'),
  ('carmen-de-salteras', 'El Carisma Carmelitano', 2026, 10, 'Reina del Carmelo', '5:22'),
  ('carmen-de-salteras', 'El Carisma Carmelitano', 2026, 11, 'Carmen de Salteras', '4:26');

insert into public.band_release_tracks (
  release_id, sequence_no, title, duration_text
)
select release.id, track.sequence_no, track.title, track.duration_text
from _hc_release_tracks track
join public.entities band
  on band.slug = track.band_slug and band.entity_type = 'band'
join public.band_releases release
  on release.band_entity_id = band.id
 and release.title = track.release_title
 and release.release_year = track.release_year
on conflict (release_id, sequence_no) do update set
  title = excluded.title,
  duration_text = excluded.duration_text;

-- -----------------------------------------------------------------------------
-- 6. Fuentes documentales
-- -----------------------------------------------------------------------------

create temporary table _hc_band_sources (
  band_slug text not null,
  name text not null,
  url text primary key,
  source_type text not null,
  publisher text not null,
  publication_date date,
  scope text not null
) on commit drop;

insert into _hc_band_sources values
  ('banda-del-sol', 'Nuestra música · Hermandad del Sol', 'https://hermandaddelsol.org/grupos/nuestra-musica/', 'Web oficial', 'Hermandad del Sol', null, 'Vinculación institucional, denominación y fundación de la Banda del Sol'),
  ('banda-del-sol', 'Perfil oficial de la Banda del Sol en Spotify', 'https://open.spotify.com/artist/2D3ZetVLafGW8DLFf2KpQu', 'Plataforma musical', 'Spotify', null, 'Catálogo discográfico y perfil oficial de artista'),
  ('banda-del-sol', 'Nicolás Cubero, nuevo director general de la Banda del Sol', 'https://www.diariodesevilla.es/semana_santa/nicolas-cubero-nuevo-director-general_0_2007633735.html', 'Prensa', 'Diario de Sevilla', '2026-08-01', 'Nombramiento de la dirección general'),
  ('banda-del-sol', 'Bandas y música en la Semana Santa de Sevilla 2026', 'https://www.diariodesevilla.es/semana_santa/bandas-musica-semana-santa-sevilla-2026_0_2006120681.html', 'Prensa', 'Diario de Sevilla', null, 'Acompañamiento de La Borriquita en 2026'),
  ('banda-del-sol', 'Sones de Sevilla y Cantillana para la Sentencia de Córdoba', 'https://www.elpespunte.es/articulo/cofrade/sones-sevilla-cantillana-hermandad-sentencia-cordoba/20251031000536113964.html', 'Prensa cofrade', 'El Pespunte', '2025-10-31', 'Acompañamiento de la Sentencia de Córdoba en 2026'),
  ('banda-del-sol', 'Renovación con la Banda del Sol', 'https://hermandadelbaratillo.es/renovacion-del-contrato-con-la-banda-de-cc-tt-ntra-sra-del-sol/', 'Web oficial', 'Hermandad del Baratillo', '2026-08-07', 'Acompañamiento de la Piedad hasta 2029'),
  ('banda-del-sol', 'Viernes Santo · Hermandad de La O', 'https://www.hermandaddelao.es/viernes-santo/', 'Web oficial', 'Hermandad de La O', null, 'Acompañamiento del Nazareno de La O desde 1984'),
  ('banda-del-sol', 'Sábado Santo 2026 · Hermandad del Sol', 'https://www.101tv.es/sevilla/semana-santa/asi-se-ha-vivido-la-primera-parte-del-sabado-santo-en-sevilla-con-101tv/', 'Prensa', '101TV', '2026-04-04', 'Acompañamiento del Santo Cristo Varón de Dolores en 2026'),
  ('banda-del-sol', 'Estreno de Cuando Triana se va…', 'https://inriinformacion.com/2026/03/17/asi-suena-la-nueva-marcha-de-la-banda-del-sol-cuando-triana-se-va/', 'Prensa cofrade', 'INRI Información', '2026-03-17', 'Estreno y autoría de la marcha'),
  ('carmen-de-salteras', 'Historia del Carmen de Salteras', 'https://elcarmendesalteras.es/historia/', 'Web oficial', 'Sociedad Filarmónica Nuestra Señora del Carmen de Salteras', null, 'Historia, denominación y fundación'),
  ('carmen-de-salteras', 'Hermandades de penitencia del Carmen de Salteras', 'https://elcarmendesalteras.es/nuestras-hermandades/hermandades-de-penitencia/', 'Web oficial', 'Sociedad Filarmónica Nuestra Señora del Carmen de Salteras', null, 'Calendario de acompañamientos penitenciales vigente'),
  ('carmen-de-salteras', 'Discografía del Carmen de Salteras', 'https://elcarmendesalteras.es/discografia/', 'Web oficial', 'Sociedad Filarmónica Nuestra Señora del Carmen de Salteras', null, 'Catálogo discográfico oficial'),
  ('carmen-de-salteras', 'Perfil oficial del Carmen de Salteras en Spotify', 'https://open.spotify.com/artist/77yqdpsmEhTAsUeG9dBaIE', 'Plataforma musical', 'Spotify', null, 'Catálogo discográfico y perfil oficial de artista'),
  ('carmen-de-salteras', 'Irene Gómez-Calado, nueva directora del Carmen de Salteras', 'https://www.diariodesevilla.es/semana_santa/irene-gomez-calado-nueva-directora_0_2007716003.html', 'Prensa', 'Diario de Sevilla', '2026-08-14', 'Nombramiento de la dirección artística y musical'),
  ('carmen-de-salteras', 'Renovación con el Carmen de Salteras', 'https://hermandadelbaratillo.es/renovacion-con-la-sociedad-filarmonica-de-ntra-sra-del-carmen-de-salteras/', 'Web oficial', 'Hermandad del Baratillo', '2022-02-16', 'Acompañamiento de la Caridad desde 1980'),
  ('carmen-de-salteras', 'Macareno del Carmen · 25 aniversario', 'https://elcarmendesalteras.es/discografia/macareno-del-carmen-25-aniversario/', 'Web oficial', 'Sociedad Filarmónica Nuestra Señora del Carmen de Salteras', null, 'Vinculación musical con la Esperanza Macarena desde 1978'),
  ('carmen-de-salteras', 'El Carmen estrenará Jesús Nazareno', 'https://elcarmendesalteras.es/el-carmen-estrenara-en-murcia-jesus-nazareno-la-nueva-marcha-de-espinosa-de-los-monteros/', 'Web oficial', 'Sociedad Filarmónica Nuestra Señora del Carmen de Salteras', '2026-02-28', 'Estreno y autoría de Jesús Nazareno'),
  ('carmen-de-salteras', 'Estrenos macarenos del Carmen en 2026', 'https://islapasion.net/asi-suena-estampas-macarenas-la-nueva-marcha-de-carlos-guillen-para-la-esperanza-macarena/', 'Prensa cofrade', 'Isla Pasión', '2026-03-17', 'Estrenos y autorías de La Esperanza de Judá y Estampas Macarenas'),
  ('carmen-de-salteras', 'Portada de El Carisma Carmelitano', 'https://elcarmendesalteras.es/presentamos-la-pintura-que-ilustrara-la-portada-de-nuestro-nuevo-disco/', 'Web oficial', 'Sociedad Filarmónica Nuestra Señora del Carmen de Salteras', '2026-03-04', 'Título, concepto y presentación del trabajo discográfico de 2026');

update public.sources source
set
  name = desired.name,
  source_type = desired.source_type,
  author_or_publisher = desired.publisher,
  publication_date = desired.publication_date,
  accessed_at = current_date
from _hc_band_sources desired
where source.url = desired.url;

insert into public.sources (
  name, url, source_type, author_or_publisher, publication_date, accessed_at
)
select name, url, source_type, publisher, publication_date, current_date
from _hc_band_sources desired
where not exists (
  select 1 from public.sources existing where existing.url = desired.url
);

insert into public.source_links (source_id, entity_id, scope)
select source.id, band.id, desired.scope
from _hc_band_sources desired
join public.sources source on source.url = desired.url
join public.entities band
  on band.slug = desired.band_slug and band.entity_type = 'band'
where not exists (
  select 1
  from public.source_links existing
  where existing.source_id = source.id
    and existing.entity_id = band.id
);

insert into public.source_links (
  source_id, music_accompaniment_period_id, scope
)
select source.id, period.id, desired.notes
from _hc_current_music desired
join public.sources source on source.url = desired.source_url
join public.entities band
  on band.slug = desired.band_slug and band.entity_type = 'band'
join public.entities brotherhood
  on brotherhood.slug = desired.brotherhood_slug and brotherhood.entity_type = 'brotherhood'
join public.music_accompaniment_periods period
  on period.band_entity_id = band.id
 and period.brotherhood_entity_id = brotherhood.id
 and period.is_current
 and period.status = 'published'
where not exists (
  select 1
  from public.source_links existing
  where existing.source_id = source.id
    and existing.music_accompaniment_period_id = period.id
);

-- Fuente específica de la asociación entre la Banda del Sol y su hermandad.
insert into public.source_links (source_id, entity_relation_id, scope)
select source.id, relation.id, 'Vinculación institucional de la Banda del Sol con la Hermandad del Sol'
from public.sources source
join public.entities band on band.slug = 'banda-del-sol'
join public.entities brotherhood on brotherhood.slug = 'hermandad-del-sol'
join public.entity_relations relation
  on relation.source_entity_id = band.id
 and relation.target_entity_id = brotherhood.id
 and relation.relation_type = 'associated_with_brotherhood'
where source.url = 'https://hermandaddelsol.org/grupos/nuestra-musica/'
  and not exists (
    select 1
    from public.source_links existing
    where existing.source_id = source.id
      and existing.entity_relation_id = relation.id
  );

-- Todas las publicaciones quedan vinculadas a la fuente de catálogo de cada banda.
insert into public.band_release_sources (release_id, source_id, scope)
select release.id, source.id, 'Catálogo discográfico de la formación'
from public.band_releases release
join public.entities band on band.id = release.band_entity_id
join public.sources source on source.url = case band.slug
  when 'banda-del-sol' then 'https://open.spotify.com/artist/2D3ZetVLafGW8DLFf2KpQu'
  when 'carmen-de-salteras' then 'https://elcarmendesalteras.es/discografia/'
end
where band.slug in ('banda-del-sol', 'carmen-de-salteras')
on conflict (release_id, source_id) do update set
  scope = excluded.scope;

-- -----------------------------------------------------------------------------
-- 7. Estrenos 2026
-- -----------------------------------------------------------------------------

create temporary table _hc_premieres (
  band_slug text not null,
  title text not null,
  composer_name text not null,
  premiere_date date not null,
  venue_text text,
  municipality_text text,
  description text not null,
  source_url text not null,
  display_order integer not null,
  primary key (band_slug, title)
) on commit drop;

insert into _hc_premieres values
  (
    'banda-del-sol', 'Cuando Triana se va…', 'José Manuel Ortega León',
    '2026-02-14', 'Iglesia conventual del Santo Ángel', 'Sevilla',
    'Marcha inspirada en el regreso de las hermandades trianeras después de su presentación ante la Capilla de la Piedad del Baratillo.',
    'https://inriinformacion.com/2026/03/17/asi-suena-la-nueva-marcha-de-la-banda-del-sol-cuando-triana-se-va/', 10
  ),
  (
    'carmen-de-salteras', 'Jesús Nazareno', 'Jesús Joaquín Espinosa de los Monteros',
    '2026-02-28', 'Plaza Hernández Amores', 'Murcia',
    'Estreno absoluto con motivo del CDXXV aniversario de la cofradía murciana de Nuestro Padre Jesús Nazareno.',
    'https://elcarmendesalteras.es/el-carmen-estrenara-en-murcia-jesus-nazareno-la-nueva-marcha-de-espinosa-de-los-monteros/', 10
  ),
  (
    'carmen-de-salteras', 'La Esperanza de Judá', 'Borja Romero González',
    '2026-03-13', 'Basílica de la Macarena', 'Sevilla',
    'Marcha dedicada a María Santísima de la Esperanza Macarena y estrenada en el concierto de Cuaresma de 2026.',
    'https://islapasion.net/asi-suena-estampas-macarenas-la-nueva-marcha-de-carlos-guillen-para-la-esperanza-macarena/', 20
  ),
  (
    'carmen-de-salteras', 'Estampas Macarenas', 'Carlos Guillén González',
    '2026-03-13', 'Basílica de la Macarena', 'Sevilla',
    'Marcha dedicada a María Santísima de la Esperanza Macarena y estrenada en el concierto de Cuaresma de 2026.',
    'https://islapasion.net/asi-suena-estampas-macarenas-la-nueva-marcha-de-carlos-guillen-para-la-esperanza-macarena/', 30
  );

insert into public.band_premieres (
  band_entity_id, title, composer_name, premiere_year, premiere_date,
  venue_text, municipality_text, description, source_id, status, display_order
)
select
  band.id, desired.title, desired.composer_name, 2026,
  desired.premiere_date, desired.venue_text, desired.municipality_text,
  desired.description, source.id, 'published', desired.display_order
from _hc_premieres desired
join public.entities band
  on band.slug = desired.band_slug and band.entity_type = 'band'
join public.sources source on source.url = desired.source_url
on conflict (band_entity_id, title, premiere_year) do update set
  composer_name = excluded.composer_name,
  premiere_date = excluded.premiere_date,
  venue_text = excluded.venue_text,
  municipality_text = excluded.municipality_text,
  description = excluded.description,
  source_id = excluded.source_id,
  status = excluded.status,
  display_order = excluded.display_order,
  updated_at = now();

-- -----------------------------------------------------------------------------
-- 8. Comprobaciones de integridad editorial
-- -----------------------------------------------------------------------------

do $$
declare
  sol_association_count integer;
  carmen_association_count integer;
  baratillo_institutional_count integer;
  sol_current_count integer;
  carmen_current_count integer;
  sol_release_count integer;
  carmen_release_count integer;
  direction_count integer;
begin
  select count(*) into sol_association_count
  from public.entity_relations relation
  join public.entities band on band.id = relation.source_entity_id
  join public.entities brotherhood on brotherhood.id = relation.target_entity_id
  where band.slug = 'banda-del-sol'
    and brotherhood.slug = 'hermandad-del-sol'
    and relation.relation_type = 'associated_with_brotherhood';

  select count(*) into carmen_association_count
  from public.entity_relations relation
  join public.entities band on band.id = relation.source_entity_id
  where band.slug = 'carmen-de-salteras'
    and relation.relation_type in ('belongs_to_brotherhood', 'associated_with_brotherhood');

  select count(*) into baratillo_institutional_count
  from public.entity_relations relation
  join public.entities band on band.id = relation.source_entity_id
  join public.entities brotherhood on brotherhood.id = relation.target_entity_id
  where band.slug in ('banda-del-sol', 'carmen-de-salteras')
    and brotherhood.slug = 'el-baratillo'
    and relation.relation_type in ('belongs_to_brotherhood', 'associated_with_brotherhood');

  select count(*) into sol_current_count
  from public.music_accompaniment_periods period
  join public.entities band on band.id = period.band_entity_id
  where band.slug = 'banda-del-sol'
    and period.is_current
    and period.status = 'published';

  select count(*) into carmen_current_count
  from public.music_accompaniment_periods period
  join public.entities band on band.id = period.band_entity_id
  where band.slug = 'carmen-de-salteras'
    and period.is_current
    and period.status = 'published';

  select count(*) into sol_release_count
  from public.band_releases release
  join public.entities band on band.id = release.band_entity_id
  where band.slug = 'banda-del-sol' and release.status = 'published';

  select count(*) into carmen_release_count
  from public.band_releases release
  join public.entities band on band.id = release.band_entity_id
  where band.slug = 'carmen-de-salteras' and release.status = 'published';

  select count(*) into direction_count
  from public.band_agents assignment
  join public.entities band on band.id = assignment.band_entity_id
  where band.slug in ('banda-del-sol', 'carmen-de-salteras')
    and assignment.is_current;

  if sol_association_count <> 1 then
    raise exception 'La Banda del Sol debe tener una asociación institucional con la Hermandad del Sol; encontradas: %', sol_association_count;
  end if;

  if carmen_association_count <> 0 then
    raise exception 'El Carmen de Salteras no debe tener hermandad asociada; encontradas: %', carmen_association_count;
  end if;

  if baratillo_institutional_count <> 0 then
    raise exception 'Los contratos con el Baratillo no deben figurar como asociaciones institucionales; encontradas: %', baratillo_institutional_count;
  end if;

  if sol_current_count < 5 then
    raise exception 'Se esperaban al menos 5 acompañamientos vigentes de la Banda del Sol; encontrados: %', sol_current_count;
  end if;

  if carmen_current_count < 8 then
    raise exception 'Se esperaban al menos 8 acompañamientos vigentes del Carmen; encontrados: %', carmen_current_count;
  end if;

  if sol_release_count < 16 or carmen_release_count < 25 then
    raise exception 'Discografía incompleta: Sol %, Carmen %', sol_release_count, carmen_release_count;
  end if;

  if direction_count < 2 then
    raise exception 'Deben existir responsables actuales para las dos bandas; encontrados: %', direction_count;
  end if;
end
$$;
