-- Hilo Cofrade · Montemayor · Sevilla · 10 de octubre de 2026.
-- Repertorio interpretado por la Banda de Música Liceo de Sevilla.
-- Solo DML editorial: 24 obras y 24 interpretaciones, sin orden procesional inferido.

begin;

do $preflight$
begin
  if (select count(*) from public.entities where entity_type='brotherhood' and slug='montemayor-sevilla' and status='published') <> 1 then
    raise exception 'La Hermandad de Montemayor de Sevilla no es unívoca';
  end if;
  if (select count(*) from public.entities where entity_type='image' and slug='imagen-montemayor-sevilla' and status='published') <> 1 then
    raise exception 'La imagen de Montemayor de Sevilla no es unívoca';
  end if;
  if (select count(*) from public.entities where entity_type='step' and slug='paso-montemayor-sevilla' and status='published') <> 1 then
    raise exception 'El paso de Montemayor de Sevilla no es unívoco';
  end if;
  if (select count(*) from public.entities where entity_type='band' and slug='banda-musica-liceo-sevilla' and status='published') <> 1 then
    raise exception 'La Banda de Música Liceo de Sevilla no es unívoca';
  end if;
  if (select count(*) from public.places where slug='iglesia-san-juan-palma-sevilla') <> 1
     and (select count(*) from public.places where id='dae660ec-b75e-4811-bab0-e0b114cffbc8') <> 1 then
    raise exception 'La iglesia de San Juan de la Palma no es unívoca';
  end if;
end
$preflight$;

insert into public.sources (name,url,source_type,author_or_publisher,publication_date,accessed_at,notes)
select 'Repertorio interpretado · Montemayor de Sevilla 2026',null,'social_media','Banda de Música Liceo de Sevilla',null,date '2026-10-22',
       'Lámina oficial Repertorio Montemayor 2026. Documenta 24 obras y no publica multiplicidades ni orden procesional.'
where not exists (select 1 from public.sources where name='Repertorio interpretado · Montemayor de Sevilla 2026' and author_or_publisher='Banda de Música Liceo de Sevilla');

insert into public.sources (name,url,source_type,author_or_publisher,publication_date,accessed_at,notes)
select 'ArteSacro · Salida procesional de Montemayor 2026','https://www.artesacro.org/Noticia/Ver/169443/hoy-salida-procesional-ntra-sra-montemayor','news','ArteSacro',date '2026-10-10',date '2026-10-22',
       'Documenta la procesión del 10 de octubre, la sede de San Juan de la Palma y el acompañamiento del Liceo de Sevilla.'
where not exists (select 1 from public.sources where url='https://www.artesacro.org/Noticia/Ver/169443/hoy-salida-procesional-ntra-sra-montemayor');

with seed(name,url,publisher,notes) as (values
  ('Montemayor · estreno y dedicatoria','https://www.gentedepaz.es/la-banda-de-musica-del-sol-estrenara-la-marcha-montemayor/','Gente de Paz','Acredita la autoría de Manuel Fernández Aranda y la vinculación de la obra con la filial sevillana de Montemayor.'),
  ('Por ti, Montemayor · autoría','https://www.aytomoguer.es/es/ayuntamiento/noticias/Espectacular-Dia-de-la-Virgen-en-Moguer-con-la-Funcion-de-la-Matriz-y-la-solemne-procesion-de-Ntra.-Sra.-de-Montemayor-Coronada/','Ayuntamiento de Moguer','Acredita la obra Por ti, Montemayor y su autoría de Manuel Marvizón.'),
  ('La Gracia de María · ficha de obra','https://www.patrimoniomusical.com/bd-marcha-5083','Patrimonio Musical','Acredita autoría, año y dedicatoria a la Virgen de Gracia y Esperanza de San Roque.'),
  ('Nuestra Señora del Patrocinio · ficha de obra','https://www.patrimoniomusical.com/bd-marcha-17','Patrimonio Musical','Acredita autoría, año y dedicatoria a la Virgen del Patrocinio del Cachorro.'),
  ('Virgen de los Reyes · ficha audiovisual','https://www.youtube.com/watch?v=UMltWUvv9Cg','Marchas de Procesión','Acredita autoría, año y dedicatoria a Nuestra Señora de los Reyes, patrona de Sevilla.')
)
insert into public.sources (name,url,source_type,author_or_publisher,accessed_at,notes)
select name,url,'website',publisher,date '2026-10-22',notes from seed
where not exists (select 1 from public.sources s where s.url=seed.url);

insert into public.entities (entity_type,name,slug,summary,status)
select 'agent','Manuel Fernández Aranda','manuel-fernandez-aranda','Compositor de la marcha procesional Montemayor.','published'
where not exists (select 1 from public.entities where entity_type='agent' and slug='manuel-fernandez-aranda');

insert into public.agents (entity_id,agent_kind,description)
select id,'person','Compositor documentado en la cruceta de Montemayor de Sevilla de 2026.'
from public.entities where entity_type='agent' and slug='manuel-fernandez-aranda'
on conflict (entity_id) do nothing;

insert into public.entities (entity_type,name,slug,summary,status)
select 'image','Nuestra Señora de los Reyes','nuestra-senora-reyes-patrona-sevilla','Patrona de Sevilla y de su Archidiócesis.','published'
where not exists (select 1 from public.entities where entity_type='image' and slug='nuestra-senora-reyes-patrona-sevilla');

insert into public.images (entity_id,image_type,description)
select id,'Gloria','Imagen de Nuestra Señora de los Reyes, patrona de Sevilla y de su Archidiócesis.'
from public.entities where entity_type='image' and slug='nuestra-senora-reyes-patrona-sevilla'
on conflict (entity_id) do update set image_type=excluded.image_type,description=excluded.description;

with seed(slug,title,summary) as (values
  ('la-gracia-de-maria-cristobal-lopez-gandara','La Gracia de María','Marcha procesional de Cristóbal López Gándara, compuesta en 2016.'),
  ('montemayor-manuel-fernandez-aranda','Montemayor','Marcha procesional de Manuel Fernández Aranda dedicada a la devoción de Montemayor.'),
  ('nuestra-senora-del-patrocinio-pedro-gamez-laserna','Nuestra Señora del Patrocinio','Marcha procesional de Pedro Gámez Laserna, compuesta en 1969.'),
  ('por-ti-montemayor-manuel-marvizon','Por ti, Montemayor','Marcha procesional de Manuel Marvizón Carvallo dedicada a Nuestra Señora de Montemayor.'),
  ('virgen-de-los-reyes-abel-moreno','Virgen de los Reyes','Marcha de Gloria de Abel Moreno Gómez, compuesta en 1990.')
)
insert into public.entities (entity_type,name,slug,summary,status)
select 'march',title,slug,summary,'published' from seed
where not exists (select 1 from public.entities e where e.entity_type='march' and e.slug=seed.slug);

with seed(slug,year,description) as (values
  ('la-gracia-de-maria-cristobal-lopez-gandara',2016,'Marcha dedicada a Nuestra Señora de Gracia y Esperanza de la Hermandad de San Roque.'),
  ('montemayor-manuel-fernandez-aranda',2020,'Marcha vinculada a la Hermandad filial sevillana de Nuestra Señora de Montemayor.'),
  ('nuestra-senora-del-patrocinio-pedro-gamez-laserna',1969,'Marcha dedicada a Nuestra Señora del Patrocinio de la Hermandad del Cachorro.'),
  ('por-ti-montemayor-manuel-marvizon',null::integer,'Marcha dedicada a Nuestra Señora de Montemayor.'),
  ('virgen-de-los-reyes-abel-moreno',1990,'Marcha dedicada a Nuestra Señora de los Reyes, patrona de Sevilla.')
)
insert into public.marches (entity_id,composition_year,music_type,work_type,description,eligible_for_daily)
select e.id,seed.year,'Banda de Música','Marcha procesional',seed.description,false
from seed join public.entities e on e.entity_type='march' and e.slug=seed.slug
where not exists (select 1 from public.marches m where m.entity_id=e.id);

with seed(march_slug,author_slug) as (values
  ('la-gracia-de-maria-cristobal-lopez-gandara','cristobal-lopez-gandara'),
  ('montemayor-manuel-fernandez-aranda','manuel-fernandez-aranda'),
  ('nuestra-senora-del-patrocinio-pedro-gamez-laserna','pedro-gamez-laserna'),
  ('por-ti-montemayor-manuel-marvizon','manuel-marvizon-carvallo'),
  ('virgen-de-los-reyes-abel-moreno','abel-moreno-gomez')
)
insert into public.march_authors (march_entity_id,agent_entity_id,author_role,notes,status)
select march.id,author.id,'composer','Autoría publicada y verificada.','published'
from seed
join public.entities march on march.entity_type='march' and march.slug=seed.march_slug
join public.entities author on author.entity_type='agent' and author.slug=seed.author_slug
where not exists (select 1 from public.march_authors x where x.march_entity_id=march.id and x.agent_entity_id=author.id and x.author_role='composer' and x.status<>'archived');

with seed(march_slug,dedicatee_slug,dedication_text) as (values
  ('la-gracia-de-maria-cristobal-lopez-gandara','nuestra-senora-gracia-esperanza-san-roque','Nuestra Señora de Gracia y Esperanza de la Hermandad de San Roque.'),
  ('montemayor-manuel-fernandez-aranda','imagen-montemayor-sevilla','Nuestra Señora de Montemayor y su Hermandad filial de Sevilla.'),
  ('nuestra-senora-del-patrocinio-pedro-gamez-laserna','nuestra-madre-senora-patrocinio-dolorosa-cachorro','Nuestra Señora del Patrocinio de la Hermandad del Cachorro.'),
  ('por-ti-montemayor-manuel-marvizon','imagen-montemayor-sevilla','Nuestra Señora de Montemayor.'),
  ('virgen-de-los-reyes-abel-moreno','nuestra-senora-reyes-patrona-sevilla','Nuestra Señora de los Reyes, patrona de Sevilla y de su Archidiócesis.')
)
insert into public.march_dedications (march_entity_id,dedicatee_entity_id,dedication_type,dedication_text,notes,status)
select march.id,dedicatee.id,'dedicated_to',seed.dedication_text,'Dedicatoria documental; no inferida a partir del título.','published'
from seed
join public.entities march on march.entity_type='march' and march.slug=seed.march_slug
join public.entities dedicatee on dedicatee.slug=seed.dedicatee_slug
on conflict (march_entity_id,dedicatee_entity_id,dedication_type) do update set dedication_text=excluded.dedication_text,notes=excluded.notes,status=excluded.status;

with seed(march_slug,video_id,title) as (values
  ('amarguras-manuel-font-de-anta','PxmgLZQkoxk','Amarguras · Manuel Font de Anta'),
  ('nuestra-senora-del-patrocinio-pedro-gamez-laserna','By1WwsKBEy0','Nuestra Señora del Patrocinio · Pedro Gámez Laserna'),
  ('virgen-de-los-reyes-abel-moreno','UMltWUvv9Cg','Virgen de los Reyes · Abel Moreno Gómez')
)
insert into public.march_recordings (march_entity_id,band_entity_id,youtube_video_id,external_url,title,notes,is_featured,status)
select march.id,null::uuid,seed.video_id,'https://www.youtube.com/watch?v='||seed.video_id,seed.title,'Audición pública verificada para la ficha de la Marcha.',true,'published'
from seed join public.entities march on march.entity_type='march' and march.slug=seed.march_slug
where not exists (select 1 from public.march_recordings r where r.youtube_video_id=seed.video_id);

insert into public.outings (
  brotherhood_entity_id,outing_type,character,title,outing_date,year,departure_time,
  municipality_id,origin_place_id,destination_place_id,reason,description,event_status,status,
  public_notes,organizer_name,slug,origin_text,destination_text
)
select brotherhood.id,'Procesión de Gloria','ordinary','Procesión de Nuestra Señora de Montemayor · 2026',date '2026-10-10',2026,time '19:15',
       municipality.id,place.id,place.id,'Procesión anual de Nuestra Señora de Montemayor.',
       'Procesión de Gloria de Nuestra Señora de Montemayor por las calles de Sevilla.','held','published',
       'Procesión celebrada el 10 de octubre de 2026. Acompañamiento musical: Banda de Música Liceo de Sevilla.',
       'Hermandad de Nuestra Señora de Montemayor de Sevilla','sevilla-montemayor-procesion-2026-10-10','Iglesia de San Juan de la Palma','Iglesia de San Juan de la Palma'
from public.entities brotherhood
join public.municipalities municipality on municipality.slug='sevilla'
join public.places place on place.id='dae660ec-b75e-4811-bab0-e0b114cffbc8'
where brotherhood.entity_type='brotherhood' and brotherhood.slug='montemayor-sevilla'
and not exists (select 1 from public.outings where slug='sevilla-montemayor-procesion-2026-10-10');

insert into public.outing_entities (outing_id,entity_id,role,notes)
select outing.id,image.id,'processional_image','Nuestra Señora de Montemayor preside la procesión de Gloria.'
from public.outings outing
join public.entities image on image.entity_type='image' and image.slug='imagen-montemayor-sevilla'
where outing.slug='sevilla-montemayor-procesion-2026-10-10'
on conflict (outing_id,entity_id,role) do update set notes=excluded.notes;

delete from public.outing_music_positions where outing_id=(select id from public.outings where slug='sevilla-montemayor-procesion-2026-10-10');

insert into public.outing_music_positions (outing_id,position_code,position_label,sequence_no,step_entity_id,notes,status)
select outing.id,'behind_glory','Tras Nuestra Señora de Montemayor',1,step.id,'Acompañamiento musical documentado en la procesión de 2026.','published'
from public.outings outing
join public.entities step on step.entity_type='step' and step.slug='paso-montemayor-sevilla'
where outing.slug='sevilla-montemayor-procesion-2026-10-10';

insert into public.outing_music_assignments (music_position_id,band_entity_id,participation_mode,sequence_no,notes,status)
select position.id,band.id,'full_route',1,'Banda de Música Liceo de Sevilla tras Nuestra Señora de Montemayor.','published'
from public.outing_music_positions position
join public.outings outing on outing.id=position.outing_id
join public.entities band on band.entity_type='band' and band.slug='banda-musica-liceo-sevilla'
where outing.slug='sevilla-montemayor-procesion-2026-10-10' and position.position_code='behind_glory';

insert into public.source_links (source_id,outing_id,scope,notes)
select source.id,outing.id,'Procesión de Gloria','Documenta fecha, sede y acompañamiento musical.'
from public.sources source join public.outings outing on outing.slug='sevilla-montemayor-procesion-2026-10-10'
where source.url='https://www.artesacro.org/Noticia/Ver/169443/hoy-salida-procesional-ntra-sra-montemayor'
and not exists (select 1 from public.source_links x where x.source_id=source.id and x.outing_id=outing.id);

with refs as (
  select source.id source_id,assignment.id assignment_id
  from public.sources source
  join public.outings outing on outing.slug='sevilla-montemayor-procesion-2026-10-10'
  join public.outing_music_positions position on position.outing_id=outing.id and position.position_code='behind_glory'
  join public.outing_music_assignments assignment on assignment.music_position_id=position.id
  where source.name='Repertorio interpretado · Montemayor de Sevilla 2026'
)
insert into public.source_links (source_id,outing_music_assignment_id,scope,notes)
select source_id,assignment_id,'Acompañamiento musical','La lámina oficial documenta la Banda y el repertorio interpretado.' from refs
where not exists (select 1 from public.source_links x where x.source_id=refs.source_id and x.outing_music_assignment_id=refs.assignment_id);

insert into public.musical_repertoires (
  slug,outing_id,band_entity_id,step_entity_id,source_id,title,repertoire_kind,notes,primary_color,accent_color,status
)
select 'montemayor-sevilla-liceo-2026',outing.id,band.id,step.id,source.id,
       'Montemayor · 10 de octubre de 2026 · Liceo de Sevilla','performed',
       'Repertorio interpretado: 24 obras y 24 interpretaciones. La posición en la lámina se conserva solo para lectura; no se presenta como orden procesional.',
       '#174F68','#F8B77D','published'
from public.outings outing
join public.entities band on band.entity_type='band' and band.slug='banda-musica-liceo-sevilla'
join public.entities step on step.entity_type='step' and step.slug='paso-montemayor-sevilla'
join public.sources source on source.name='Repertorio interpretado · Montemayor de Sevilla 2026'
where outing.slug='sevilla-montemayor-procesion-2026-10-10'
on conflict (slug) do update set outing_id=excluded.outing_id,band_entity_id=excluded.band_entity_id,step_entity_id=excluded.step_entity_id,
 source_id=excluded.source_id,title=excluded.title,repertoire_kind=excluded.repertoire_kind,notes=excluded.notes,
 primary_color=excluded.primary_color,accent_color=excluded.accent_color,status=excluded.status,updated_at=now();

delete from public.musical_repertoire_entries where repertoire_id=(select id from public.musical_repertoires where slug='montemayor-sevilla-liceo-2026');

with seed(display_order,march_slug,display_title,source_credit,performance_count,notes) as (values
  (1,'amarguras-manuel-font-de-anta','Amarguras','Manuel Font de Anta',1,null::text),
  (2,'bajo-tu-amparo-ruben-jordan-flores','Bajo Tu Amparo','Rubén Jordán Flores',1,null),
  (3,'como-tu-ninguna-david-hurtado','Como Tú, Ninguna','David Hurtado Torres',1,null),
  (4,'coronacion-de-la-macarena-pedro-brana','Coronación de la Macarena','Pedro Braña Martínez',1,null),
  (5,'creo-en-la-esperanza-carlos-guillen','Creo en la Esperanza','Carlos Guillén González',1,null),
  (6,'esperanza-macarena-pedro-morales','Esperanza Macarena','Pedro Morales Muñoz',1,null),
  (7,'la-estrella-sublime-manuel-lopez-farfan','La Estrella Sublime','Manuel López Farfán',1,null),
  (8,'la-gracia-de-maria-cristobal-lopez-gandara','La Gracia de María','Cristóbal López Gándara',1,null),
  (9,'macarena-abel-moreno','Macarena','Abel Moreno Gómez',1,'Se vincula a la obra de Abel Moreno, no a sus homónimas.'),
  (10,'macarena-emilio-cebrian','¡¡Macarena!!','Emilio Cebrián Ruiz',1,'Se vincula a la obra de Emilio Cebrián, no a sus homónimas.'),
  (11,'maria-santisima-de-la-o-abel-moreno','María Santísima de la O','Abel Moreno Gómez',1,null),
  (12,'maria-santisima-del-subterraneo-pedro-gamez-laserna','María Santísima del Subterráneo','Pedro Gámez Laserna',1,null),
  (13,'montemayor-manuel-fernandez-aranda','Montemayor','Manuel Fernández Aranda',1,null),
  (14,'nuestra-senora-del-patrocinio-pedro-gamez-laserna','Nuestra Señora del Patrocinio','Pedro Gámez Laserna',1,null),
  (15,'pasa-la-virgen-macarena-pedro-gamez-laserna','Pasa la Virgen Macarena','Pedro Gámez Laserna',1,null),
  (16,'pasan-los-campanilleros-manuel-lopez-farfan','Pasan los Campanilleros','Manuel López Farfán',1,null),
  (17,'por-ti-montemayor-manuel-marvizon','Por Ti, Montemayor','Manuel Marvizón Carvallo',1,null),
  (18,'procesion-de-semana-santa-en-sevilla-pascual-marquina','Procesión de Semana Santa en Sevilla','Pascual Marquina Narro',1,null),
  (19,'reina-de-la-o-antonio-david-rodriguez','Reina de la O','Antonio David Rodríguez Gómez',1,null),
  (20,'suspiros-de-espana-antonio-alvarez-alonso','Suspiros de España','Antonio Álvarez Alonso',1,null),
  (21,'virgen-de-la-estrella-pedro-gamez-laserna','Virgen de la Estrella','Pedro Gámez Laserna',1,null),
  (22,'virgen-de-la-paz-pedro-morales','Virgen de la Paz','Pedro Morales Muñoz',1,null),
  (23,'marcha-virgen-de-los-negritos-pedro-morales','Virgen de los Negritos','Pedro Morales Muñoz',1,null),
  (24,'virgen-de-los-reyes-abel-moreno','Virgen de los Reyes','Abel Moreno Gómez',1,null)
)
insert into public.musical_repertoire_entries (repertoire_id,march_entity_id,display_title,source_credit,performance_count,display_order,notes)
select repertoire.id,march.id,seed.display_title,seed.source_credit,seed.performance_count,seed.display_order,seed.notes
from seed
join public.musical_repertoires repertoire on repertoire.slug='montemayor-sevilla-liceo-2026'
join public.entities march on march.entity_type='march' and march.slug=seed.march_slug;

do $postflight$
declare v_repertoire_id uuid;
begin
  select id into v_repertoire_id from public.musical_repertoires where slug='montemayor-sevilla-liceo-2026';
  if v_repertoire_id is null then raise exception 'La cruceta de Montemayor no se ha creado'; end if;
  if (select count(*) from public.musical_repertoire_entries where repertoire_id=v_repertoire_id) <> 24 then raise exception 'La cruceta de Montemayor debe contener 24 obras'; end if;
  if (select sum(performance_count) from public.musical_repertoire_entries where repertoire_id=v_repertoire_id) <> 24 then raise exception 'La cruceta de Montemayor debe sumar 24 interpretaciones'; end if;
  if exists (select 1 from public.musical_repertoire_entries where repertoire_id=v_repertoire_id and performance_count<>1) then raise exception 'La fuente no declara multiplicidades'; end if;
  if (select count(*) from public.musical_repertoire_entries e join public.entities m on m.id=e.march_entity_id where e.repertoire_id=v_repertoire_id and m.slug in ('macarena-abel-moreno','macarena-emilio-cebrian')) <> 2 then raise exception 'Las dos Macarena deben conservar sus fichas canónicas separadas'; end if;
  if (select count(*) from public.musical_repertoires r join public.outings o on o.id=r.outing_id join public.entities b on b.id=r.band_entity_id join public.entities s on s.id=r.step_entity_id where r.id=v_repertoire_id and o.outing_date=date '2026-10-10' and o.event_status='held' and b.slug='banda-musica-liceo-sevilla' and s.slug='paso-montemayor-sevilla' and r.primary_color='#174F68' and r.accent_color='#F8B77D') <> 1 then raise exception 'La relación Hermandad-fecha-Banda-paso-paleta no es íntegra'; end if;
  if exists (select 1 from public.musical_repertoire_entries e left join public.march_authors a on a.march_entity_id=e.march_entity_id and a.status='published' where e.repertoire_id=v_repertoire_id group by e.id having count(a.id)=0) then raise exception 'Todas las obras deben conservar al menos una autoría publicada'; end if;
end
$postflight$;

commit;
