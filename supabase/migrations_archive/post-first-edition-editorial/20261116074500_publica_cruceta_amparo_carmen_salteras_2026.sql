-- Hilo Cofrade · repertorio interpretado de Nuestra Señora del Amparo Coronada
-- Sevilla · 15 de noviembre de 2026 · Carmen de Salteras
-- Las cuatro láminas oficiales documentan el orden real: 42 obras y 45 interpretaciones.

begin;

do $preflight$
begin
  if (select count(*) from public.outings where slug='sevilla-amparo-2026' and outing_date=date '2026-11-15' and status='published' and event_status='held') <> 1 then
    raise exception 'La procesión de Nuestra Señora del Amparo no es unívoca o no consta celebrada';
  end if;
  if (select count(*) from public.entities where entity_type='band' and slug='carmen-de-salteras' and status='published') <> 1 then
    raise exception 'Carmen de Salteras no es unívoca';
  end if;
  if (select count(*) from public.entities where entity_type='step' and slug='paso-nuestra-senora-amparo-sevilla' and status='published') <> 1 then
    raise exception 'El paso de Nuestra Señora del Amparo no es unívoco';
  end if;
end
$preflight$;

with seed(name,slug,summary) as (values
  ('Perfecto Artola Prats','perfecto-artola-prats','Compositor y director vinculado al repertorio procesional para banda de música.'),
  ('Joaquín de la Orden Román','joaquin-de-la-orden-roman','Compositor vinculado al repertorio procesional para banda de música.'),
  ('Dionisio Ortiz Corral','dionisio-ortiz-corral','Compositor vinculado al repertorio procesional para banda de música.'),
  ('Francisco Melguizo Fernández','francisco-melguizo-fernandez','Compositor vinculado al repertorio procesional para banda de música.')
)
insert into public.entities(entity_type,name,slug,summary,status)
select 'agent',name,slug,summary,'published' from seed
where not exists(select 1 from public.entities existing where existing.entity_type='agent' and existing.slug=seed.slug);

with seed(slug) as (values
  ('perfecto-artola-prats'),('joaquin-de-la-orden-roman'),('dionisio-ortiz-corral'),('francisco-melguizo-fernandez')
)
insert into public.agents(entity_id,agent_kind,description)
select entity.id,'person',entity.summary from seed join public.entities entity on entity.entity_type='agent' and entity.slug=seed.slug
on conflict(entity_id) do nothing;

with seed(slug,title,summary) as (values
  ('virgen-del-carmen-perfecto-artola','Virgen del Carmen','Marcha procesional de Perfecto Artola Prats.'),
  ('el-corpus-braulio-uralde','El Corpus','Marcha procesional de Braulio Uralde Bringas.'),
  ('salvacion-david-hurtado','Salvación','Marcha procesional de David Hurtado Torres.'),
  ('nuestra-senora-de-la-presentacion-pedro-brana','Nuestra Señora de la Presentación','Marcha procesional de Pedro Braña Martínez.'),
  ('desamparo-german-alvarez-beigbeder','Desamparo','Marcha procesional de Germán Álvarez Beigbeder.'),
  ('nuestra-senora-de-la-oliva-de-la-orden-ortiz','Nuestra Señora de la Oliva','Marcha procesional de Joaquín de la Orden Román y Dionisio Ortiz Corral.'),
  ('nuestra-senora-de-villaviciosa-pedro-brana','Nuestra Señora de Villaviciosa','Marcha procesional de Pedro Braña Martínez.'),
  ('la-musica-del-silencio-francisco-melguizo','La Música del Silencio','Marcha procesional de Francisco Melguizo Fernández.'),
  ('cristo-de-la-sangre-emilio-cebrian','Cristo de la Sangre','Marcha procesional de Emilio Cebrián Ruiz.'),
  ('reina-de-todos-los-santos-jose-manuel-delgado','Reina de Todos los Santos','Marcha procesional de José Manuel Delgado Rodríguez.')
)
insert into public.entities(entity_type,name,slug,summary,status)
select 'march',title,slug,summary,'published' from seed
where not exists(select 1 from public.entities existing where existing.entity_type='march' and existing.slug=seed.slug);

with seed(slug) as (values
  ('virgen-del-carmen-perfecto-artola'),('el-corpus-braulio-uralde'),('salvacion-david-hurtado'),
  ('nuestra-senora-de-la-presentacion-pedro-brana'),('desamparo-german-alvarez-beigbeder'),
  ('nuestra-senora-de-la-oliva-de-la-orden-ortiz'),('nuestra-senora-de-villaviciosa-pedro-brana'),
  ('la-musica-del-silencio-francisco-melguizo'),('cristo-de-la-sangre-emilio-cebrian'),
  ('reina-de-todos-los-santos-jose-manuel-delgado')
)
insert into public.marches(entity_id,music_type,work_type,description,eligible_for_daily)
select entity.id,'Banda de Música','Marcha procesional',entity.summary,false
from seed join public.entities entity on entity.entity_type='march' and entity.slug=seed.slug
on conflict(entity_id) do nothing;

with seed(march_slug,author_slug) as (values
  ('virgen-del-carmen-perfecto-artola','perfecto-artola-prats'),
  ('el-corpus-braulio-uralde','braulio-uralde-bringas'),
  ('salvacion-david-hurtado','david-hurtado-torres'),
  ('nuestra-senora-de-la-presentacion-pedro-brana','pedro-brana-martinez'),
  ('desamparo-german-alvarez-beigbeder','german-alvarez-beigbeder'),
  ('nuestra-senora-de-la-oliva-de-la-orden-ortiz','joaquin-de-la-orden-roman'),
  ('nuestra-senora-de-la-oliva-de-la-orden-ortiz','dionisio-ortiz-corral'),
  ('nuestra-senora-de-villaviciosa-pedro-brana','pedro-brana-martinez'),
  ('la-musica-del-silencio-francisco-melguizo','francisco-melguizo-fernandez'),
  ('cristo-de-la-sangre-emilio-cebrian','emilio-cebrian-ruiz'),
  ('reina-de-todos-los-santos-jose-manuel-delgado','jose-manuel-delgado-rodriguez'),
  ('marcha-caridad','pedro-gamez-laserna')
)
insert into public.march_authors(march_entity_id,agent_entity_id,author_role,notes,status)
select march.id,author.id,'composer','Autoría publicada en las láminas oficiales del repertorio interpretado.','published'
from seed join public.entities march on march.entity_type='march' and march.slug=seed.march_slug
join public.entities author on author.entity_type='agent' and author.slug=seed.author_slug
where not exists(select 1 from public.march_authors existing where existing.march_entity_id=march.id and existing.agent_entity_id=author.id and existing.author_role='composer' and existing.status<>'archived');

insert into public.sources(name,url,source_type,author_or_publisher,publication_date,accessed_at,notes)
select 'Repertorio interpretado · Amparo Coronada 2026',null,'social_media',
       'Sociedad Filarmónica Nuestra Señora del Carmen de Salteras',date '2026-11-16',date '2026-11-16',
       'Cuatro láminas oficiales. Documentan 42 obras y su orden real de interpretación; ¡Ampárame! figura dos veces y Bajo tu Amparo, tres.'
where not exists(select 1 from public.sources where name='Repertorio interpretado · Amparo Coronada 2026' and author_or_publisher='Sociedad Filarmónica Nuestra Señora del Carmen de Salteras');

with refs as (
  select source.id source_id,outing.id outing_id
  from public.sources source cross join public.outings outing
  where source.name='Repertorio interpretado · Amparo Coronada 2026' and outing.slug='sevilla-amparo-2026'
)
insert into public.source_links(source_id,outing_id,scope,notes)
select source_id,outing_id,'Repertorio interpretado','Fuente directa de la cruceta y de su orden real.' from refs
where not exists(select 1 from public.source_links existing where existing.source_id=refs.source_id and existing.outing_id=refs.outing_id);

with refs as (
  select source.id source_id,assignment.id assignment_id
  from public.sources source
  join public.outings outing on outing.slug='sevilla-amparo-2026'
  join public.outing_music_positions position on position.outing_id=outing.id and position.position_code='behind_step' and position.status<>'archived'
  join public.outing_music_assignments assignment on assignment.music_position_id=position.id and assignment.status<>'archived'
  join public.entities band on band.id=assignment.band_entity_id and band.slug='carmen-de-salteras'
  where source.name='Repertorio interpretado · Amparo Coronada 2026'
)
insert into public.source_links(source_id,outing_music_assignment_id,scope,notes)
select source_id,assignment_id,'Acompañamiento musical','Vincula la cruceta con Carmen de Salteras tras el paso.' from refs
where not exists(select 1 from public.source_links existing where existing.source_id=refs.source_id and existing.outing_music_assignment_id=refs.assignment_id);

with source as (
  select id from public.sources where name='Repertorio interpretado · Amparo Coronada 2026'
    and author_or_publisher='Sociedad Filarmónica Nuestra Señora del Carmen de Salteras' order by created_at limit 1
)
insert into public.musical_repertoires(slug,outing_id,band_entity_id,step_entity_id,source_id,title,display_name,repertoire_kind,notes,primary_color,accent_color,status)
select 'amparo-sevilla-carmen-salteras-2026',outing.id,band.id,step.id,source.id,
       'Nuestra Señora del Amparo Coronada · 15 de noviembre de 2026 · Carmen de Salteras',
       'Nuestra Señora del Amparo Coronada','performed',
       'Repertorio interpretado: 42 obras y 45 interpretaciones. El orden de la fuente es el orden real de interpretación, desde ¡Bendita seas, dulce Madre del Amparo! hasta Reina de Todos los Santos. Se conservan las multiplicidades exactas: ¡Ampárame! ×2 y Bajo tu Amparo ×3.',
       '#3A2215','#C28A16','published'
from public.outings outing
join public.entities band on band.entity_type='band' and band.slug='carmen-de-salteras'
join public.entities step on step.entity_type='step' and step.slug='paso-nuestra-senora-amparo-sevilla'
cross join source
where outing.slug='sevilla-amparo-2026'
on conflict(slug) do update set outing_id=excluded.outing_id,band_entity_id=excluded.band_entity_id,step_entity_id=excluded.step_entity_id,
  source_id=excluded.source_id,title=excluded.title,display_name=excluded.display_name,repertoire_kind=excluded.repertoire_kind,notes=excluded.notes,
  primary_color=excluded.primary_color,accent_color=excluded.accent_color,status=excluded.status,updated_at=now();

with seed(display_order,march_slug,display_title,source_credit,performance_count) as (values
  (1,'bendita-seas-dulce-madre-del-amparo-romero-gonzalez','¡Bendita seas, dulce Madre del Amparo!','Borja Romero González',1),
  (2,'virgen-de-montserrat-pedro-morales','Virgen de Montserrat','Pedro Morales Muñoz',1),
  (3,'coronacion-del-amparo-espinosa-de-los-monteros','Coronación del Amparo','Jesús Joaquín Espinosa de los Monteros Pérez',1),
  (4,'la-virgen-del-amparo-alfonso-lozano','La Virgen del Amparo','Alfonso Lozano Ruiz',1),
  (5,'virgen-del-carmen-perfecto-artola','Virgen del Carmen','Perfecto Artola Prats',1),
  (6,'virgen-de-la-estrella-pedro-gamez-laserna','Virgen de la Estrella','Pedro Gámez Laserna',1),
  (7,'coronacion-de-la-macarena-pedro-brana','Coronación de la Macarena','Pedro Braña Martínez',1),
  (8,'la-estrella-sublime-manuel-lopez-farfan','La Estrella Sublime','Manuel López Farfán',1),
  (9,'triana-tu-esperanza-jose-de-la-vega','Triana, tu Esperanza','José de la Vega Sánchez',1),
  (10,'sevilla-cofradiera-pedro-gamez-laserna','Sevilla Cofradiera','Pedro Gámez Laserna',1),
  (11,'amparo-pedro-morales-munoz','Amparo','Pedro Morales Muñoz',1),
  (12,'coronacion-en-la-magdalena-ruben-jordan','Coronación en la Magdalena','Rubén Jordán Flores',1),
  (13,'hiniesta-jose-martinez-peralto','Hiniesta','José Martínez Peralto',1),
  (14,'el-corpus-braulio-uralde','El Corpus','Braulio Uralde',1),
  (15,'la-virgen-de-sevilla-victor-arturo-lopez','La Virgen de Sevilla','Víctor Arturo López López',1),
  (16,'esperanza-macarena-pedro-morales','Esperanza Macarena','Pedro Morales Muñoz',1),
  (17,'salvacion-david-hurtado','Salvación','David Hurtado Torres',1),
  (18,'marcha-caridad','Caridad','Fernando Oliveras González y Pedro Gámez Laserna',1),
  (19,'amparame-francisco-javier-moreno-ramos','¡Ampárame!','Francisco Javier Moreno Ramos',2),
  (20,'virgen-del-amparo-jose-martinez-peralto','Virgen del Amparo','José Martínez Peralto',1),
  (21,'nuestra-senora-de-la-presentacion-pedro-brana','Nuestra Señora de la Presentación','Pedro Braña Martínez',1),
  (22,'senorita-de-triana-pedro-morales','Señorita de Triana','Pedro Morales Muñoz',1),
  (23,'virgen-del-rosario-german-alvarez-beigbeder','Virgen del Rosario','Germán Álvarez Beigbeder',1),
  (24,'desamparo-german-alvarez-beigbeder','Desamparo','Germán Álvarez Beigbeder',1),
  (25,'maria-santisima-de-la-o-abel-moreno','María Santísima de la O','Abel Moreno Gómez',1),
  (26,'mercedes-cristobal-lopez-gandara','Mercedes','Cristóbal López Gándara',1),
  (27,'nuestra-senora-de-la-oliva-de-la-orden-ortiz','Nuestra Señora de la Oliva','Joaquín de la Orden Román y Dionisio Ortiz Corral',1),
  (28,'miradlo-en-la-cruz-david-hurtado','¡Miradlo en la Cruz!','David Hurtado Torres',1),
  (29,'virgen-de-las-aguas-santiago-ramos','Virgen de las Aguas','Santiago Ramos Castro',1),
  (30,'la-sangre-y-la-gloria-alfonso-lozano','La Sangre y la Gloria','Alfonso Lozano Ruiz',1),
  (31,'nuestra-senora-de-villaviciosa-pedro-brana','Nuestra Señora de Villaviciosa','Pedro Braña Martínez',1),
  (32,'procesion-de-semana-santa-en-sevilla-pascual-marquina','Procesión de Semana Santa en Sevilla','Pascual Marquina Narro',1),
  (33,'la-musica-del-silencio-francisco-melguizo','La Música del Silencio','Francisco Melguizo Fernández',1),
  (34,'nuestro-padre-jesus-emilio-cebrian','Nuestro Padre Jesús','Emilio Cebrián Ruiz',1),
  (35,'bajo-tu-amparo-ruben-jordan-flores','Bajo tu Amparo','Rubén Jordán Flores',3),
  (36,'quinta-angustia-jose-font-marimont','Quinta Angustia','José Font Marimont',1),
  (37,'cristo-de-la-sangre-emilio-cebrian','Cristo de la Sangre','Emilio Cebrián Ruiz',1),
  (38,'marcha-margot-joaquin-turina','Margot','Joaquín Turina Pérez',1),
  (39,'aquella-virgen-manuel-gomez-arribas','Aquella Virgen','Manuel Gómez de Arriba',1),
  (40,'al-amparo-de-maria-juan-caton-guillen','Al Amparo de María','Juan José Catón Guillén y Alberto Barea Tejada',1),
  (41,'pasan-los-campanilleros-manuel-lopez-farfan','Pasan los Campanilleros','Manuel López Farfán',1),
  (42,'reina-de-todos-los-santos-jose-manuel-delgado','Reina de Todos los Santos','José Manuel Delgado Rodríguez',1)
)
insert into public.musical_repertoire_entries(repertoire_id,march_entity_id,display_title,source_credit,performance_count,display_order,notes)
select repertoire.id,march.id,seed.display_title,seed.source_credit,seed.performance_count,seed.display_order,
       'Posición en el orden real de interpretación documentado por las cuatro láminas oficiales.'
from seed join public.musical_repertoires repertoire on repertoire.slug='amparo-sevilla-carmen-salteras-2026'
join public.entities march on march.entity_type='march' and march.slug=seed.march_slug
on conflict(repertoire_id,march_entity_id) do update set display_title=excluded.display_title,source_credit=excluded.source_credit,
  performance_count=excluded.performance_count,display_order=excluded.display_order,notes=excluded.notes;

do $postflight$
declare v_repertoire uuid;
begin
  select id into strict v_repertoire from public.musical_repertoires where slug='amparo-sevilla-carmen-salteras-2026';
  if (select count(*) from public.musical_repertoire_entries where repertoire_id=v_repertoire) <> 42 then raise exception 'La cruceta debe contener 42 obras'; end if;
  if (select count(distinct march_entity_id) from public.musical_repertoire_entries where repertoire_id=v_repertoire) <> 42 then raise exception 'La cruceta debe conservar 42 obras distintas'; end if;
  if (select sum(performance_count) from public.musical_repertoire_entries where repertoire_id=v_repertoire) <> 45 then raise exception 'La cruceta debe sumar 45 interpretaciones'; end if;
  if (select count(*) from public.musical_repertoire_entries where repertoire_id=v_repertoire and performance_count>1) <> 2 then raise exception 'La cruceta debe contener dos multiplicidades'; end if;
  if (select count(*) from public.musical_repertoire_entries entry join public.entities march on march.id=entry.march_entity_id where entry.repertoire_id=v_repertoire and entry.display_order=1 and march.slug='bendita-seas-dulce-madre-del-amparo-romero-gonzalez') <> 1 then raise exception 'Bendita seas debe abrir el orden real'; end if;
  if (select count(*) from public.musical_repertoire_entries entry join public.entities march on march.id=entry.march_entity_id where entry.repertoire_id=v_repertoire and entry.display_order=42 and march.slug='reina-de-todos-los-santos-jose-manuel-delgado') <> 1 then raise exception 'Reina de Todos los Santos debe cerrar el orden real'; end if;
  if (select count(*) from public.musical_repertoire_entries entry join public.entities march on march.id=entry.march_entity_id where entry.repertoire_id=v_repertoire and march.slug='amparame-francisco-javier-moreno-ramos' and entry.performance_count=2) <> 1 then raise exception '¡Ampárame! debe conservar dos interpretaciones'; end if;
  if (select count(*) from public.musical_repertoire_entries entry join public.entities march on march.id=entry.march_entity_id where entry.repertoire_id=v_repertoire and march.slug='bajo-tu-amparo-ruben-jordan-flores' and entry.performance_count=3) <> 1 then raise exception 'Bajo tu Amparo debe conservar tres interpretaciones'; end if;
  if (select count(*) from public.musical_repertoire_entries entry join public.entities march on march.id=entry.march_entity_id where entry.repertoire_id=v_repertoire and march.slug in ('amparo-pedro-morales-munoz','virgen-del-amparo-jose-martinez-peralto','desamparo-german-alvarez-beigbeder','cristo-de-la-sangre-emilio-cebrian')) <> 4 then raise exception 'Los homónimos deben resolver las autorías documentadas'; end if;
  if (select count(*) from public.musical_repertoires repertoire
      join public.outings outing on outing.id=repertoire.outing_id
      join public.entities band on band.id=repertoire.band_entity_id
      join public.entities step on step.id=repertoire.step_entity_id
      join public.outing_music_positions position on position.outing_id=outing.id and position.step_entity_id=step.id and position.position_code='behind_step' and position.status<>'archived'
      join public.outing_music_assignments assignment on assignment.music_position_id=position.id and assignment.band_entity_id=band.id and assignment.status<>'archived'
      where repertoire.id=v_repertoire and outing.outing_date=date '2026-11-15' and outing.event_status='held'
        and band.slug='carmen-de-salteras' and step.slug='paso-nuestra-senora-amparo-sevilla'
        and assignment.participation_mode='full_route' and repertoire.primary_color='#3A2215' and repertoire.accent_color='#C28A16') <> 1 then
    raise exception 'La identidad fecha-Banda-paso-posición-paleta no es íntegra';
  end if;
  if exists(select 1 from public.musical_repertoire_entries entry left join public.march_authors author on author.march_entity_id=entry.march_entity_id and author.status='published' where entry.repertoire_id=v_repertoire group by entry.id having count(author.id)=0) then raise exception 'Todas las obras deben conservar al menos una autoría publicada'; end if;
end
$postflight$;

commit;
