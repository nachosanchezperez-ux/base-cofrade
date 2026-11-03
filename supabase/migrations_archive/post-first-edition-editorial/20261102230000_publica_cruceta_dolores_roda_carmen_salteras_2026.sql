-- Hilo Cofrade · repertorio interpretado de María Santísima de los Dolores Coronada
-- La Roda de Andalucía · 2 de noviembre de 2026 · Carmen de Salteras
-- La fuente directa documenta 15 obras, sin multiplicidades ni orden cronológico.

begin;

do $preflight$
begin
  if (select count(*) from public.outings where slug='la-roda-andalucia-dolores-cementerio-2026-11-02' and outing_date=date '2026-11-02' and status='published') <> 1 then
    raise exception 'El traslado extraordinario de Dolores Coronada no es unívoco';
  end if;
  if (select count(*) from public.entities where entity_type='brotherhood' and slug='hermandad-dolores-roda-andalucia') <> 1 then
    raise exception 'La Hermandad de los Dolores de La Roda no es unívoca';
  end if;
  if (select count(*) from public.entities where entity_type='band' and slug='carmen-de-salteras' and status='published') <> 1 then
    raise exception 'Carmen de Salteras no es unívoca';
  end if;
end
$preflight$;

update public.outings
set event_status='held',
    public_notes=case when coalesce(public_notes,'') ilike '%Carmen de Salteras%'
      then public_notes
      else concat_ws(' ',public_notes,'En el regreso, Carmen de Salteras acompañó a la Virgen desde la calle Erillas hasta la Parroquia de Santa Ana.') end,
    updated_at=now()
where slug='la-roda-andalucia-dolores-cementerio-2026-11-02';

insert into public.entities(entity_type,name,slug,summary,status)
select 'image','María Santísima de los Dolores Coronada','maria-santisima-dolores-coronada-roda',
       'Titular mariana de la Hermandad de los Dolores de La Roda de Andalucía.','published'
where not exists(select 1 from public.entities where entity_type='image' and slug='maria-santisima-dolores-coronada-roda');

insert into public.images(entity_id,image_type,current_condition,description,iconography,is_dress_image,current_state_notes)
select id,'Dolorosa','extant','María Santísima de los Dolores Coronada, titular mariana de La Roda de Andalucía.',
       'Dolorosa bajo la advocación de los Dolores',true,
       'Documentada en el traslado extraordinario al Cementerio Municipal del 2 de noviembre de 2026.'
from public.entities where entity_type='image' and slug='maria-santisima-dolores-coronada-roda'
on conflict(entity_id) do update set image_type=excluded.image_type,current_condition=excluded.current_condition,
  description=excluded.description,iconography=excluded.iconography,is_dress_image=excluded.is_dress_image,
  current_state_notes=excluded.current_state_notes;

insert into public.brotherhood_images(brotherhood_entity_id,image_entity_id,relation_type,notes,status)
select brotherhood.id,image.id,'titular','Titular mariana de la Hermandad.','published'
from public.entities brotherhood
join public.entities image on image.entity_type='image' and image.slug='maria-santisima-dolores-coronada-roda'
where brotherhood.entity_type='brotherhood' and brotherhood.slug='hermandad-dolores-roda-andalucia'
  and not exists(select 1 from public.brotherhood_images existing where existing.brotherhood_entity_id=brotherhood.id and existing.image_entity_id=image.id and existing.status<>'archived');

insert into public.outing_entities(outing_id,entity_id,role,notes)
select outing.id,image.id,'processional_image','Titular trasladada en andas al Cementerio Municipal.'
from public.outings outing
join public.entities image on image.entity_type='image' and image.slug='maria-santisima-dolores-coronada-roda'
where outing.slug='la-roda-andalucia-dolores-cementerio-2026-11-02'
  and not exists(select 1 from public.outing_entities existing where existing.outing_id=outing.id and existing.entity_id=image.id and existing.role='processional_image');

insert into public.entities(entity_type,name,slug,summary,status)
select 'step','Andas procesionales de María Santísima de los Dolores Coronada','andas-dolores-coronada-roda-2026',
       'Andas utilizadas en el traslado extraordinario al Cementerio Municipal de La Roda de Andalucía de 2026.','published'
where not exists(select 1 from public.entities where entity_type='step' and slug='andas-dolores-coronada-roda-2026');

insert into public.steps(entity_id,step_type,description,carrier_system,current_state_notes)
select id,'Andas procesionales','Andas empleadas para el traslado de María Santísima de los Dolores Coronada al Cementerio Municipal.',
       'Andas','Documentadas en la salida celebrada el 2 de noviembre de 2026.'
from public.entities where entity_type='step' and slug='andas-dolores-coronada-roda-2026'
on conflict(entity_id) do update set step_type=excluded.step_type,description=excluded.description,
  carrier_system=excluded.carrier_system,current_state_notes=excluded.current_state_notes;

insert into public.brotherhood_steps(brotherhood_entity_id,step_entity_id,relation_type,date_from_text,notes,status)
select brotherhood.id,step.id,'processional_step','2 de noviembre de 2026','Andas documentadas para el traslado extraordinario al Cementerio Municipal.','published'
from public.entities brotherhood
join public.entities step on step.entity_type='step' and step.slug='andas-dolores-coronada-roda-2026'
where brotherhood.entity_type='brotherhood' and brotherhood.slug='hermandad-dolores-roda-andalucia'
  and not exists(select 1 from public.brotherhood_steps existing where existing.brotherhood_entity_id=brotherhood.id and existing.step_entity_id=step.id and existing.status<>'archived');

insert into public.outing_music_positions(outing_id,step_entity_id,position_code,position_label,sequence_no,notes,status)
select outing.id,step.id,'behind_glory','Tras las andas de María Santísima de los Dolores Coronada',1,
       'Acompañamiento musical documentado únicamente para el regreso desde la calle Erillas.','published'
from public.outings outing
join public.entities step on step.entity_type='step' and step.slug='andas-dolores-coronada-roda-2026'
where outing.slug='la-roda-andalucia-dolores-cementerio-2026-11-02'
on conflict(outing_id,sequence_no) do update set step_entity_id=excluded.step_entity_id,position_code=excluded.position_code,
  position_label=excluded.position_label,notes=excluded.notes,status=excluded.status,updated_at=now();

insert into public.outing_music_assignments(music_position_id,band_entity_id,participation_mode,sequence_no,segment_start_label,segment_end_label,notes,status)
select position.id,band.id,'segment',1,'Calle Erillas','Parroquia de Santa Ana',
       'Carmen de Salteras acompañó el regreso desde la calle Erillas hasta la entrada en Santa Ana.','published'
from public.outing_music_positions position
join public.outings outing on outing.id=position.outing_id and outing.slug='la-roda-andalucia-dolores-cementerio-2026-11-02'
join public.entities band on band.entity_type='band' and band.slug='carmen-de-salteras'
where position.position_code='behind_glory' and position.status<>'archived'
  and not exists(select 1 from public.outing_music_assignments existing where existing.music_position_id=position.id and existing.band_entity_id=band.id and existing.status<>'archived');

with seed(name,slug,summary) as (values
  ('Ricardo Dorado Janeiro','ricardo-dorado-janeiro','Compositor y director vinculado al repertorio procesional para banda de música.'),
  ('José Gardey Cuevas','jose-gardey-cuevas','Compositor vinculado al repertorio procesional para banda de música.'),
  ('Luis Rivas Gómez','luis-rivas-gomez','Compositor vinculado al repertorio procesional para banda de música.'),
  ('Manuel Font Fernández de la Herranz','manuel-font-fernandez-de-la-herranz','Compositor vinculado al repertorio procesional sevillano.'),
  ('Vicente Gómez-Zarzuela Pérez','vicente-gomez-zarzuela-perez','Compositor de la marcha procesional Virgen del Valle.'),
  ('Cesáreo Gabaráin Azurmendi','cesareo-gabarain-azurmendi','Sacerdote y compositor de música religiosa.')
)
insert into public.entities(entity_type,name,slug,summary,status)
select 'agent',name,slug,summary,'published' from seed
where not exists(select 1 from public.entities existing where existing.entity_type='agent' and existing.slug=seed.slug);

with seed(slug) as (values
  ('ricardo-dorado-janeiro'),('jose-gardey-cuevas'),('luis-rivas-gomez'),
  ('manuel-font-fernandez-de-la-herranz'),('vicente-gomez-zarzuela-perez'),('cesareo-gabarain-azurmendi')
)
insert into public.agents(entity_id,agent_kind,description)
select entity.id,'person',entity.summary from seed join public.entities entity on entity.entity_type='agent' and entity.slug=seed.slug
on conflict(entity_id) do nothing;

with seed(slug,title,summary) as (values
  ('dolorosa-la-roda-instrumentacion-pedro-morales','Dolorosa La Roda','Obra presentada por Carmen de Salteras con instrumentación de Pedro Morales Muñoz.'),
  ('la-amargura-jesus-joaquin-espinosa','La Amargura','Marcha procesional de Jesús Joaquín Espinosa de los Monteros Pérez.'),
  ('mater-mea-ricardo-dorado','Mater Mea','Marcha procesional de Ricardo Dorado Janeiro.'),
  ('valle-de-sevilla-jose-de-la-vega','Valle de Sevilla','Marcha procesional de José de la Vega Sánchez.'),
  ('virgen-de-la-o-gardey-rivas','Virgen de la O','Marcha procesional de José Gardey Cuevas y Luis Rivas Gómez.'),
  ('la-sagrada-lanzada-manuel-font','La Sagrada Lanzada','Marcha procesional de Manuel Font Fernández de la Herranz.'),
  ('virgen-del-valle-vicente-gomez-zarzuela','Virgen del Valle','Marcha procesional de Vicente Gómez-Zarzuela Pérez.'),
  ('la-muerte-no-es-el-final-cesareo-gabarain','La muerte no es el final','Composición religiosa de Cesáreo Gabaráin Azurmendi interpretada en repertorio procesional.')
)
insert into public.entities(entity_type,name,slug,summary,status)
select 'march',title,slug,summary,'published' from seed
where not exists(select 1 from public.entities existing where existing.entity_type='march' and existing.slug=seed.slug);

with seed(slug,work_type) as (values
  ('dolorosa-la-roda-instrumentacion-pedro-morales','Marcha procesional'),
  ('la-amargura-jesus-joaquin-espinosa','Marcha procesional'),
  ('mater-mea-ricardo-dorado','Marcha procesional'),('valle-de-sevilla-jose-de-la-vega','Marcha procesional'),
  ('virgen-de-la-o-gardey-rivas','Marcha procesional'),('la-sagrada-lanzada-manuel-font','Marcha procesional'),
  ('virgen-del-valle-vicente-gomez-zarzuela','Marcha procesional'),('la-muerte-no-es-el-final-cesareo-gabarain','Himno')
)
insert into public.marches(entity_id,music_type,work_type,description,eligible_for_daily)
select entity.id,'Banda de Música',seed.work_type,entity.summary,false
from seed join public.entities entity on entity.entity_type='march' and entity.slug=seed.slug
on conflict(entity_id) do nothing;

with seed(march_slug,author_slug,author_role,note) as (values
  ('dolorosa-la-roda-instrumentacion-pedro-morales','pedro-morales-munoz','arranger','Instrumentación atribuida expresamente a Pedro Morales Muñoz por la fuente directa; no se infiere la composición.'),
  ('la-amargura-jesus-joaquin-espinosa','jesus-joaquin-espinosa-de-los-monteros-perez','composer','Autoría publicada por Carmen de Salteras.'),
  ('mater-mea-ricardo-dorado','ricardo-dorado-janeiro','composer','Autoría publicada por Carmen de Salteras.'),
  ('valle-de-sevilla-jose-de-la-vega','jose-de-la-vega-sanchez','composer','Autoría publicada por Carmen de Salteras.'),
  ('virgen-de-la-o-gardey-rivas','jose-gardey-cuevas','composer','Autoría publicada por Carmen de Salteras.'),
  ('virgen-de-la-o-gardey-rivas','luis-rivas-gomez','composer','Autoría publicada por Carmen de Salteras.'),
  ('la-sagrada-lanzada-manuel-font','manuel-font-fernandez-de-la-herranz','composer','Autoría publicada por Carmen de Salteras.'),
  ('virgen-del-valle-vicente-gomez-zarzuela','vicente-gomez-zarzuela-perez','composer','Autoría publicada por Carmen de Salteras.'),
  ('la-muerte-no-es-el-final-cesareo-gabarain','cesareo-gabarain-azurmendi','composer','Autoría publicada por Carmen de Salteras.')
)
insert into public.march_authors(march_entity_id,agent_entity_id,author_role,notes,status)
select march.id,author.id,seed.author_role,seed.note,'published'
from seed join public.entities march on march.entity_type='march' and march.slug=seed.march_slug
join public.entities author on author.entity_type='agent' and author.slug=seed.author_slug
where not exists(select 1 from public.march_authors existing where existing.march_entity_id=march.id and existing.agent_entity_id=author.id and existing.author_role=seed.author_role and existing.status<>'archived');

insert into public.sources(name,url,source_type,author_or_publisher,publication_date,accessed_at,notes)
select 'Repertorio musical · Dolores Coronada de La Roda 2026',null,'social_media',
       'Sociedad Filarmónica Nuestra Señora del Carmen de Salteras',date '2026-11-02',date '2026-11-02',
       'Dos láminas oficiales. Documentan 15 obras, sin multiplicidades; no documentan puntos exactos de interpretación ni orden cronológico.'
where not exists(select 1 from public.sources where name='Repertorio musical · Dolores Coronada de La Roda 2026' and author_or_publisher='Sociedad Filarmónica Nuestra Señora del Carmen de Salteras');

insert into public.sources(name,url,source_type,author_or_publisher,publication_date,accessed_at,notes)
select 'ArteSacro · Dolores Coronada en el Cementerio de La Roda · 2026','https://www.artesacro.org/Noticia/Ver/169730','news',
       'ArteSacro',date '2026-11-02',date '2026-11-02',
       'Documenta el traslado en andas, los horarios y el acompañamiento de Carmen de Salteras en el regreso desde la calle Erillas.'
where not exists(select 1 from public.sources where url='https://www.artesacro.org/Noticia/Ver/169730');

with refs as (
  select source.id source_id,outing.id outing_id,assignment.id assignment_id
  from public.sources source
  join public.outings outing on outing.slug='la-roda-andalucia-dolores-cementerio-2026-11-02'
  join public.outing_music_positions position on position.outing_id=outing.id and position.position_code='behind_glory' and position.status<>'archived'
  join public.outing_music_assignments assignment on assignment.music_position_id=position.id and assignment.status<>'archived'
  join public.entities band on band.id=assignment.band_entity_id and band.slug='carmen-de-salteras'
  where source.name='Repertorio musical · Dolores Coronada de La Roda 2026'
)
insert into public.source_links(source_id,outing_id,scope,notes)
select source_id,outing_id,'Repertorio interpretado','Fuente directa de la cruceta publicada por la Banda.' from refs
where not exists(select 1 from public.source_links existing where existing.source_id=refs.source_id and existing.outing_id=refs.outing_id);

with refs as (
  select source.id source_id,assignment.id assignment_id
  from public.sources source
  join public.outings outing on outing.slug='la-roda-andalucia-dolores-cementerio-2026-11-02'
  join public.outing_music_positions position on position.outing_id=outing.id and position.position_code='behind_glory' and position.status<>'archived'
  join public.outing_music_assignments assignment on assignment.music_position_id=position.id and assignment.status<>'archived'
  join public.entities band on band.id=assignment.band_entity_id and band.slug='carmen-de-salteras'
  where source.name='Repertorio musical · Dolores Coronada de La Roda 2026'
)
insert into public.source_links(source_id,outing_music_assignment_id,scope,notes)
select source_id,assignment_id,'Acompañamiento musical','Vincula la cruceta con Carmen de Salteras en el tramo documentado.' from refs
where not exists(select 1 from public.source_links existing where existing.source_id=refs.source_id and existing.outing_music_assignment_id=refs.assignment_id);

with refs as (
  select source.id source_id,outing.id outing_id from public.sources source
  cross join public.outings outing
  where source.url='https://www.artesacro.org/Noticia/Ver/169730' and outing.slug='la-roda-andalucia-dolores-cementerio-2026-11-02'
)
insert into public.source_links(source_id,outing_id,scope,notes)
select source_id,outing_id,'Crónica de la salida','Contrasta el soporte, los horarios y el tramo de acompañamiento musical.' from refs
where not exists(select 1 from public.source_links existing where existing.source_id=refs.source_id and existing.outing_id=refs.outing_id);

with source as (
  select id from public.sources where name='Repertorio musical · Dolores Coronada de La Roda 2026'
    and author_or_publisher='Sociedad Filarmónica Nuestra Señora del Carmen de Salteras' order by created_at limit 1
)
insert into public.musical_repertoires(slug,outing_id,band_entity_id,step_entity_id,source_id,title,repertoire_kind,notes,primary_color,accent_color,status)
select 'dolores-coronada-roda-carmen-salteras-2026',outing.id,band.id,step.id,source.id,
       'Hermandad de los Dolores · 2 de noviembre de 2026 · Carmen de Salteras','performed',
       'Repertorio interpretado: 15 obras y 15 interpretaciones. No hay multiplicidades expresas; la disposición de las láminas no se presenta como orden procesional. El acompañamiento corresponde al regreso desde la calle Erillas.',
       '#2B1D15','#B48A2B','published'
from public.outings outing
join public.entities band on band.entity_type='band' and band.slug='carmen-de-salteras'
join public.entities step on step.entity_type='step' and step.slug='andas-dolores-coronada-roda-2026'
cross join source
where outing.slug='la-roda-andalucia-dolores-cementerio-2026-11-02'
on conflict(slug) do update set outing_id=excluded.outing_id,band_entity_id=excluded.band_entity_id,step_entity_id=excluded.step_entity_id,
  source_id=excluded.source_id,title=excluded.title,repertoire_kind=excluded.repertoire_kind,notes=excluded.notes,
  primary_color=excluded.primary_color,accent_color=excluded.accent_color,status=excluded.status,updated_at=now();

with seed(display_order,march_slug,display_title,source_credit) as (values
  (1,'dolorosa-la-roda-instrumentacion-pedro-morales','Dolorosa La Roda','Instrumentación de Pedro Morales Muñoz'),
  (2,'nuestro-padre-jesus-emilio-cebrian','Nuestro Padre Jesús','Emilio Cebrián Ruiz'),
  (3,'alma-de-la-trinidad-eloy-garcia','Alma de la Trinidad','Eloy García López'),
  (4,'ave-maria-vavilov-arreglo-lozano-garrido','Ave María','Vladimir Vavilov'),
  (5,'macarena-emilio-cebrian','Macarena','Emilio Cebrián Ruiz'),
  (6,'el-mayor-dolor-daniel-albarran','El Mayor Dolor','Daniel Albarrán Acosta'),
  (7,'la-amargura-jesus-joaquin-espinosa','La Amargura','Jesús Joaquín Espinosa de los Monteros Pérez'),
  (8,'mater-mea-ricardo-dorado','Mater Mea','Ricardo Dorado Janeiro'),
  (9,'valle-de-sevilla-jose-de-la-vega','Valle de Sevilla','José de la Vega Sánchez'),
  (10,'virgen-de-la-o-gardey-rivas','Virgen de la O','José Gardey Cuevas y Luis Rivas Gómez'),
  (11,'la-sagrada-lanzada-manuel-font','La Sagrada Lanzada','Manuel Font Fernández de la Herranz'),
  (12,'la-sangre-y-la-gloria-alfonso-lozano','La Sangre y la Gloria','Alfonso Lozano Ruiz'),
  (13,'virgen-del-valle-vicente-gomez-zarzuela','Virgen del Valle','Vicente Gómez-Zarzuela Pérez'),
  (14,'marcha-margot-joaquin-turina','Margot','Joaquín Turina Pérez'),
  (15,'la-muerte-no-es-el-final-cesareo-gabarain','La muerte no es el final','Cesáreo Gabaráin Azurmendi')
)
insert into public.musical_repertoire_entries(repertoire_id,march_entity_id,display_title,source_credit,performance_count,display_order,notes)
select repertoire.id,march.id,seed.display_title,seed.source_credit,1,seed.display_order,
       'Obra documentada por la fuente; la posición editorial no equivale a orden procesional.'
from seed join public.musical_repertoires repertoire on repertoire.slug='dolores-coronada-roda-carmen-salteras-2026'
join public.entities march on march.entity_type='march' and march.slug=seed.march_slug
on conflict(repertoire_id,march_entity_id) do update set display_title=excluded.display_title,source_credit=excluded.source_credit,
  performance_count=excluded.performance_count,display_order=excluded.display_order,notes=excluded.notes;

do $postflight$
declare v_repertoire uuid;
begin
  select id into strict v_repertoire from public.musical_repertoires where slug='dolores-coronada-roda-carmen-salteras-2026';
  if (select count(*) from public.musical_repertoire_entries where repertoire_id=v_repertoire) <> 15 then raise exception 'La cruceta debe contener 15 obras'; end if;
  if (select count(distinct march_entity_id) from public.musical_repertoire_entries where repertoire_id=v_repertoire) <> 15 then raise exception 'La cruceta debe conservar 15 obras distintas'; end if;
  if (select sum(performance_count) from public.musical_repertoire_entries where repertoire_id=v_repertoire) <> 15 then raise exception 'La cruceta debe sumar 15 interpretaciones'; end if;
  if exists(select 1 from public.musical_repertoire_entries where repertoire_id=v_repertoire and performance_count<>1) then raise exception 'La fuente no contiene multiplicidades'; end if;
  if (select count(*) from public.musical_repertoire_entries entry join public.entities march on march.id=entry.march_entity_id where entry.repertoire_id=v_repertoire and march.slug='macarena-emilio-cebrian') <> 1 then raise exception 'Macarena debe resolver la obra de Emilio Cebrián'; end if;
  if (select count(*) from public.musical_repertoire_entries entry join public.march_authors author on author.march_entity_id=entry.march_entity_id and author.author_role='arranger' and author.status='published' join public.entities march on march.id=entry.march_entity_id where entry.repertoire_id=v_repertoire and march.slug='dolorosa-la-roda-instrumentacion-pedro-morales') <> 1 then raise exception 'Dolorosa La Roda debe conservar la instrumentación de Pedro Morales'; end if;
  if (select count(*) from public.musical_repertoires repertoire
      join public.outings outing on outing.id=repertoire.outing_id
      join public.entities band on band.id=repertoire.band_entity_id
      join public.entities step on step.id=repertoire.step_entity_id
      join public.outing_music_positions position on position.outing_id=outing.id and position.step_entity_id=step.id and position.status<>'archived'
      join public.outing_music_assignments assignment on assignment.music_position_id=position.id and assignment.band_entity_id=band.id and assignment.status<>'archived'
      where repertoire.id=v_repertoire and outing.outing_date=date '2026-11-02' and outing.event_status='held'
        and band.slug='carmen-de-salteras' and step.slug='andas-dolores-coronada-roda-2026'
        and assignment.participation_mode='segment' and assignment.segment_start_label='Calle Erillas'
        and repertoire.primary_color='#2B1D15' and repertoire.accent_color='#B48A2B') <> 1 then
    raise exception 'La identidad fecha-Banda-andas-tramo-paleta no es íntegra';
  end if;
  if exists(select 1 from public.musical_repertoire_entries entry left join public.march_authors author on author.march_entity_id=entry.march_entity_id and author.status='published' where entry.repertoire_id=v_repertoire group by entry.id having count(author.id)=0) then raise exception 'Todas las obras deben conservar al menos una autoría publicada'; end if;
end
$postflight$;

commit;
