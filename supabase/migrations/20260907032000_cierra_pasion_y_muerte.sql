-- Hilo Cofrade · cierre documental avanzado de Pasión y Muerte
-- Corte editorial: 2026-09-06
-- Solo DML editorial. Sin DDL, nuevas tablas, RLS, arquitectura ni UX.

do $$
begin
  if (select count(*) from public.entities where slug='pasion-y-muerte' and entity_type='brotherhood') <> 1 then
    raise exception 'La ficha canónica de Pasión y Muerte no es unívoca';
  end if;
  if (select count(*) from public.brotherhood_images bi join public.entities h on h.id=bi.brotherhood_entity_id where h.slug='pasion-y-muerte' and bi.status='published') <> 3 then
    raise exception 'El núcleo de tres titulares visuales de Pasión y Muerte no está intacto';
  end if;
  if (select count(*) from public.brotherhood_steps bs join public.entities h on h.id=bs.brotherhood_entity_id where h.slug='pasion-y-muerte' and bs.status='published') <> 3 then
    raise exception 'El núcleo de tres pasos de Pasión y Muerte no está intacto';
  end if;
end $$;

with source_data(name,url,source_type,publisher,publication_date,notes) as (
  values
    ('Pasión y Muerte · Historia','https://hermandadpasionymuerte.es/?page_id=1363','Fuente oficial','Hermandad de Pasión y Muerte',null::date,'Historia institucional, cultos externos, salidas y cronología de la corporación.'),
    ('Pasión y Muerte · Sedes','https://hermandadpasionymuerte.es/?page_id=1314','Fuente oficial','Hermandad de Pasión y Muerte',null::date,'Sedes canónicas históricas, sede vigente y sede de salida desde 2022.'),
    ('Pasión y Muerte · Resurrección de Nuestro Señor','https://hermandadpasionymuerte.es/?page_id=1307','Fuente oficial','Hermandad de Pasión y Muerte',null::date,'Titularidad no visual y función anual del Domingo de Resurrección.'),
    ('Pasión y Muerte · Nuestra Señora del Desconsuelo y Visitación','https://hermandadpasionymuerte.es/?page_id=1309','Fuente oficial','Hermandad de Pasión y Muerte',null::date,'Titular, Rosario público desde 2012 y vínculo histórico con la Hermandad de la Estrella.'),
    ('Pasión y Muerte · Cultos al Santísimo Cristo 2026','https://hermandadpasionymuerte.es/?p=3423','Fuente oficial','Hermandad de Pasión y Muerte',date '2026-03-09','Quinario y Función Solemne de marzo de 2026.'),
    ('Pasión y Muerte · Quinario celebrado 2026','https://hermandadpasionymuerte.es/?p=3466','Fuente oficial','Hermandad de Pasión y Muerte',date '2026-03-18','Memoria posterior del Quinario celebrado en marzo de 2026.'),
    ('Pasión y Muerte · Vía Crucis celebrado 2026','https://hermandadpasionymuerte.es/?p=3414','Fuente oficial','Hermandad de Pasión y Muerte',date '2026-03-08','Memoria posterior del Vía Crucis del 6 de marzo de 2026.'),
    ('Pasión y Muerte · Cultos al Desconsuelo 2026','https://hermandadpasionymuerte.es/?p=3592','Fuente oficial','Hermandad de Pasión y Muerte',date '2026-05-20','Triduo y Función Solemne de mayo de 2026.'),
    ('Pasión y Muerte · Triduo del Desconsuelo celebrado 2026','https://hermandadpasionymuerte.es/?p=3642','Fuente oficial','Hermandad de Pasión y Muerte',date '2026-05-31','Memoria posterior del Triduo celebrado en mayo de 2026.'),
    ('Pasión y Muerte · Función de la Resurrección 2026','https://hermandadpasionymuerte.es/?p=3560','Fuente oficial','Hermandad de Pasión y Muerte',date '2026-04-04','Convocatoria de la Función Solemne del Domingo de Resurrección de 2026.'),
    ('Pasión y Muerte · Cultos de Santa María del Buen Aire 2026','https://hermandadpasionymuerte.es/?p=3844','Fuente oficial','Hermandad de Pasión y Muerte',date '2026-08-27','Triduo y Función Principal de septiembre de 2026.'),
    ('Pasión y Muerte · Calendario oficial de septiembre de 2026','https://hermandadpasionymuerte.es/','Fuente oficial','Hermandad de Pasión y Muerte',date '2026-09-01','Calendario oficial con cultos y salida de Santa María del Buen Aire.'),
    ('Pasión y Muerte · Estación de penitencia 2026','https://hermandadpasionymuerte.es/?p=3369','Fuente oficial','Hermandad de Pasión y Muerte',date '2026-02-22','Convocatoria de la estación a Santa Ana del 27 de marzo de 2026.'),
    ('Pasión y Muerte · Normas de la estación 2026','https://hermandadpasionymuerte.es/?p=3512','Fuente oficial','Hermandad de Pasión y Muerte',date '2026-03-24','Sede de salida y destino de la estación de penitencia de 2026.'),
    ('Pasión y Muerte · Memoria posterior de la estación 2026','https://hermandadpasionymuerte.es/?p=3555','Fuente oficial','Hermandad de Pasión y Muerte',date '2026-03-28','Confirmación posterior de la estación de penitencia del Viernes de Dolores de 2026.')
)
insert into public.sources(name,url,source_type,author_or_publisher,publication_date,accessed_at,notes)
select name,url,source_type,publisher,publication_date,date '2026-09-06',notes
from source_data d where not exists(select 1 from public.sources s where s.url=d.url);

-- Lugares históricos que aún no tenían nodo propio en el grafo.
with place_data(name,slug,place_type,notes) as (
  values
    ('Parroquia de Nuestra Señora de la O','parroquia-nuestra-senora-de-la-o-sevilla','Parroquia','Primera sede canónica documentada de la corporación, entre 1992 y 1997.'),
    ('Templo de San Vicente de Paúl','templo-san-vicente-de-paul-triana','Iglesia','Sede canónica documentada entre 1997 y 2001.'),
    ('Real Parroquia de Señora Santa Ana','real-parroquia-senora-santa-ana-triana','Parroquia','Destino de la estación de penitencia y de salidas extraordinarias de la corporación.')
)
insert into public.places(municipality_id,name,slug,place_type,notes)
select m.id,d.name,d.slug,d.place_type,d.notes
from place_data d join public.municipalities m on m.slug='sevilla'
where not exists(select 1 from public.places p where p.slug=d.slug);

-- Sedes canónicas históricas, sede vigente y sede de salida.
with location_data(place_slug,location_type,date_from_text,date_to_text,is_current,notes) as (
  values
    ('parroquia-nuestra-senora-de-la-o-sevilla','Sede canónica','1992','1997',false,'Primera sede canónica documentada por la Hermandad.'),
    ('templo-san-vicente-de-paul-triana','Sede canónica','1997','2001',false,'Sede canónica anterior al traslado definitivo al Buen Aire.'),
    ('parroquia-nuestra-senora-buen-aire-sevilla','Sede canónica','Desde 2001',null::text,true,'Sede canónica vigente de la corporación.'),
    ('parroquia-san-juan-bosco-triana','Sede de salida','Desde 2022',null::text,true,'Sede de salida de la estación de penitencia por razones de seguridad.')
)
insert into public.entity_locations(entity_id,place_id,municipality_id,location_type,date_from_text,date_to_text,is_current,notes,status)
select h.id,p.id,m.id,d.location_type,d.date_from_text,d.date_to_text,d.is_current,d.notes,'published'
from location_data d join public.entities h on h.slug='pasion-y-muerte' join public.places p on p.slug=d.place_slug join public.municipalities m on m.slug='sevilla'
where not exists(select 1 from public.entity_locations el where el.entity_id=h.id and el.place_id=p.id and el.location_type=d.location_type and el.status<>'archived');

insert into public.source_links(source_id,entity_location_id,scope,notes)
select s.id,el.id,'Sede histórica o vigente','Cronología publicada por la propia Hermandad.'
from public.sources s join public.entity_locations el on true join public.entities h on h.id=el.entity_id
where s.url='https://hermandadpasionymuerte.es/?page_id=1314' and h.slug='pasion-y-muerte'
  and not exists(select 1 from public.source_links sl where sl.source_id=s.id and sl.entity_location_id=el.id);

insert into public.source_links(source_id,entity_id,scope,notes)
select s.id,h.id,'Historia e identidad','Historia institucional publicada por la propia Hermandad.'
from public.sources s join public.entities h on h.slug='pasion-y-muerte'
where s.url='https://hermandadpasionymuerte.es/?page_id=1363'
  and not exists(select 1 from public.source_links sl where sl.source_id=s.id and sl.entity_id=h.id and sl.scope='Historia e identidad');

-- Resurrección de Nuestro Señor: titular no visual, sin fabricar una imagen procesional.
insert into public.entities(entity_type,name,slug,summary,status)
select 'advocation','Resurrección de Nuestro Señor','resurreccion-nuestro-senor-pasion-y-muerte-sevilla','Titular no visual de la Hermandad de Pasión y Muerte, celebrado litúrgicamente cada Domingo de Resurrección.','published'
where not exists(select 1 from public.entities where slug='resurreccion-nuestro-senor-pasion-y-muerte-sevilla');

insert into public.entity_relations(source_entity_id,relation_type,target_entity_id,date_from_text,notes,status)
select h.id,'has_titular',t.id,'Vigente en 2026','Titularidad no representada por una imagen de talla.','published'
from public.entities h join public.entities t on t.slug='resurreccion-nuestro-senor-pasion-y-muerte-sevilla'
where h.slug='pasion-y-muerte'
  and not exists(select 1 from public.entity_relations er where er.source_entity_id=h.id and er.target_entity_id=t.id and er.relation_type='has_titular' and er.status<>'archived');

insert into public.source_links(source_id,entity_relation_id,scope,notes)
select s.id,er.id,'Titularidad no visual','La Hermandad declara expresamente la titularidad y la ausencia de talla.'
from public.sources s join public.entity_relations er on true join public.entities h on h.id=er.source_entity_id join public.entities t on t.id=er.target_entity_id
where s.url='https://hermandadpasionymuerte.es/?page_id=1307' and h.slug='pasion-y-muerte' and t.slug='resurreccion-nuestro-senor-pasion-y-muerte-sevilla' and er.relation_type='has_titular'
  and not exists(select 1 from public.source_links sl where sl.source_id=s.id and sl.entity_relation_id=er.id);

-- La relación con la Estrella ya existía en borrador. Se documenta, pero no se
-- publica mientras el nodo canónico de la Hermandad de la Estrella siga en draft.
update public.entity_relations er
set date_from_text=coalesce(er.date_from_text,'2011'),
    notes='La Hermandad de la Estrella amadrinó la primera estación con nazarenos de 2011 y cedió su Cruz de Guía.'
where er.source_entity_id=(select id from public.entities where slug='pasion-y-muerte')
  and er.target_entity_id=(select id from public.entities where slug='hermandad-de-la-estrella')
  and er.relation_type='godmother_brotherhood';

insert into public.source_links(source_id,entity_relation_id,scope,notes)
select s.id,er.id,'Hermandad madrina','El Consejo de Cofradías documenta el padrinazgo de la Estrella en 2011.'
from public.sources s join public.entity_relations er on true join public.entities h on h.id=er.source_entity_id join public.entities t on t.id=er.target_entity_id
where s.url='https://www.hermandades-de-sevilla.org/semanasanta/vd_pasion_y_muerte.html' and h.slug='pasion-y-muerte' and t.slug='hermandad-de-la-estrella' and er.relation_type='godmother_brotherhood'
  and not exists(select 1 from public.source_links sl where sl.source_id=s.id and sl.entity_relation_id=er.id);

-- Cultos recurrentes. Las reglas estables se separan de cada edición anual.
with cult_data(image_slug,cult_type,title,date_rule,month,time_text,description,recurrence_label,display_order) as (
  values
    ('santisimo-cristo-pasion-muerte-sevilla','Vía Crucis','Vía Crucis del Santísimo Cristo de Pasión y Muerte','Cuaresma; fecha según calendario anual',3::smallint,'Hora según convocatoria anual','Vía Crucis externo por las calles de la feligresía.','Anual · Cuaresma',10),
    ('santisimo-cristo-pasion-muerte-sevilla','Quinario','Solemne Quinario al Santísimo Cristo de Pasión y Muerte','Cinco días de Cuaresma; fechas según calendario anual',3::smallint,'20:00 en la edición de 2026','Quinario anual al titular cristífero.','Anual · Cuaresma',20),
    ('santisimo-cristo-pasion-muerte-sevilla','Función Solemne','Función Solemne al Santísimo Cristo de Pasión y Muerte','Domingo posterior al Quinario',3::smallint,'Hora según convocatoria anual','Función anual al titular cristífero.','Anual · tras el Quinario',30),
    ('nuestra-senora-desconsuelo-visitacion','Triduo','Solemne Triduo a Nuestra Señora del Desconsuelo y Visitación','En torno a la festividad de la Visitación; fechas según calendario anual',5::smallint,'Hora según convocatoria anual','Triduo anual a la titular dolorosa.','Anual · mayo',40),
    ('nuestra-senora-desconsuelo-visitacion','Función Solemne','Función Solemne a Nuestra Señora del Desconsuelo y Visitación','Festividad de la Visitación o fecha determinada en el calendario anual',5::smallint,'Hora según convocatoria anual','Función anual a la titular dolorosa.','Anual · Visitación',50),
    (null::text,'Función Solemne','Función Solemne a la Resurrección de Nuestro Señor','Domingo de Resurrección',null::smallint,'Hora según convocatoria anual','Función anual al titular no visual de la Resurrección.','Anual · Domingo de Resurrección',60),
    ('santa-maria-buen-aire-sevilla','Triduo','Solemne Triduo a Santa María del Buen Aire','Septiembre; fechas según calendario anual',9::smallint,'Hora según convocatoria anual','Triduo anual a la titular letífica.','Anual · septiembre',70),
    ('santa-maria-buen-aire-sevilla','Función Principal','Función Principal de Instituto a Santa María del Buen Aire','Domingo posterior al Triduo',9::smallint,'Hora según convocatoria anual','Función Principal anual en honor a la titular letífica.','Anual · septiembre',80)
)
insert into public.cults(brotherhood_entity_id,image_entity_id,cult_type,title,date_rule,month,time_text,place_id,description,status,is_recurring,recurrence_label,display_order,notes)
select h.id,i.id,d.cult_type,d.title,d.date_rule,d.month,d.time_text,p.id,d.description,'published',true,d.recurrence_label,d.display_order,'Regla estable contrastada; las fechas concretas viven en cult_occurrences.'
from cult_data d join public.entities h on h.slug='pasion-y-muerte' join public.places p on p.slug='parroquia-nuestra-senora-buen-aire-sevilla' left join public.entities i on i.slug=d.image_slug
where not exists(select 1 from public.cults c where c.brotherhood_entity_id=h.id and c.title=d.title and c.is_recurring);

with occurrence_data(cult_title,start_date,end_date,event_status,description,notes) as (
  values
    ('Vía Crucis del Santísimo Cristo de Pasión y Muerte',date '2026-03-06',date '2026-03-06','held','Vía Crucis celebrado el 6 de marzo de 2026 por las calles de la feligresía.','La galería oficial posterior confirma expresamente la celebración.'),
    ('Solemne Quinario al Santísimo Cristo de Pasión y Muerte',date '2026-03-10',date '2026-03-14','held','Quinario celebrado del 10 al 14 de marzo de 2026, a las 20:00.','La memoria oficial posterior confirma la finalización de los cultos.'),
    ('Función Solemne al Santísimo Cristo de Pasión y Muerte',date '2026-03-15',date '2026-03-15','announced','Función convocada para el 15 de marzo de 2026, a las 13:00.','No se transforma en celebrada sin una memoria posterior unívoca.'),
    ('Solemne Triduo a Nuestra Señora del Desconsuelo y Visitación',date '2026-05-28',date '2026-05-30','held','Triduo celebrado del 28 al 30 de mayo de 2026, a las 20:00.','La memoria oficial posterior confirma la finalización del Triduo.'),
    ('Función Solemne a Nuestra Señora del Desconsuelo y Visitación',date '2026-05-31',date '2026-05-31','announced','Función convocada para el 31 de mayo de 2026, a las 13:00.','No se transforma en celebrada sin una memoria posterior unívoca.'),
    ('Función Solemne a la Resurrección de Nuestro Señor',date '2026-04-05',date '2026-04-05','announced','Función convocada para el Domingo de Resurrección de 2026, a las 13:00.','La fuente localizada es una convocatoria previa.'),
    ('Solemne Triduo a Santa María del Buen Aire',date '2026-09-17',date '2026-09-19','announced','Triduo anunciado del 17 al 19 de septiembre de 2026, a las 20:00.','Fecha futura en el corte editorial.'),
    ('Función Principal de Instituto a Santa María del Buen Aire',date '2026-09-20',date '2026-09-20','announced','Función Principal anunciada para el 20 de septiembre de 2026, a las 13:00.','Fecha futura en el corte editorial.')
)
insert into public.cult_occurrences(cult_id,year,start_date,end_date,place_id,description_override,event_status,status,notes)
select c.id,2026,d.start_date,d.end_date,p.id,d.description,d.event_status,'published',d.notes
from occurrence_data d join public.cults c on c.brotherhood_entity_id=(select id from public.entities where slug='pasion-y-muerte') and c.title=d.cult_title join public.places p on p.slug='parroquia-nuestra-senora-buen-aire-sevilla'
on conflict(cult_id,year,start_date) do update set end_date=excluded.end_date,place_id=excluded.place_id,description_override=excluded.description_override,event_status=excluded.event_status,status='published',notes=excluded.notes,updated_at=now();

with cult_sources(cult_title,source_url) as (
  values
    ('Vía Crucis del Santísimo Cristo de Pasión y Muerte','https://hermandadpasionymuerte.es/?page_id=1363'),
    ('Solemne Quinario al Santísimo Cristo de Pasión y Muerte','https://hermandadpasionymuerte.es/?p=3423'),
    ('Función Solemne al Santísimo Cristo de Pasión y Muerte','https://hermandadpasionymuerte.es/?p=3423'),
    ('Solemne Triduo a Nuestra Señora del Desconsuelo y Visitación','https://hermandadpasionymuerte.es/?p=3592'),
    ('Función Solemne a Nuestra Señora del Desconsuelo y Visitación','https://hermandadpasionymuerte.es/?p=3592'),
    ('Función Solemne a la Resurrección de Nuestro Señor','https://hermandadpasionymuerte.es/?page_id=1307'),
    ('Solemne Triduo a Santa María del Buen Aire','https://hermandadpasionymuerte.es/?p=3844'),
    ('Función Principal de Instituto a Santa María del Buen Aire','https://hermandadpasionymuerte.es/?p=3844')
)
insert into public.source_links(source_id,cult_id,scope,notes)
select s.id,c.id,'Culto recurrente','Regla y carácter anual documentados por la Hermandad.'
from cult_sources d join public.sources s on s.url=d.source_url join public.cults c on c.brotherhood_entity_id=(select id from public.entities where slug='pasion-y-muerte') and c.title=d.cult_title
where not exists(select 1 from public.source_links sl where sl.source_id=s.id and sl.cult_id=c.id);

with occurrence_sources(cult_title,source_url) as (
  values
    ('Vía Crucis del Santísimo Cristo de Pasión y Muerte','https://hermandadpasionymuerte.es/?p=3414'),
    ('Solemne Quinario al Santísimo Cristo de Pasión y Muerte','https://hermandadpasionymuerte.es/?p=3466'),
    ('Función Solemne al Santísimo Cristo de Pasión y Muerte','https://hermandadpasionymuerte.es/?p=3423'),
    ('Solemne Triduo a Nuestra Señora del Desconsuelo y Visitación','https://hermandadpasionymuerte.es/?p=3642'),
    ('Función Solemne a Nuestra Señora del Desconsuelo y Visitación','https://hermandadpasionymuerte.es/?p=3592'),
    ('Función Solemne a la Resurrección de Nuestro Señor','https://hermandadpasionymuerte.es/?p=3560'),
    ('Solemne Triduo a Santa María del Buen Aire','https://hermandadpasionymuerte.es/?p=3844'),
    ('Función Principal de Instituto a Santa María del Buen Aire','https://hermandadpasionymuerte.es/?p=3844')
)
insert into public.source_links(source_id,cult_occurrence_id,scope,notes)
select s.id,co.id,'Edición 2026','Fecha y estado temporal contrastados en la fuente enlazada.'
from occurrence_sources d join public.sources s on s.url=d.source_url join public.cults c on c.brotherhood_entity_id=(select id from public.entities where slug='pasion-y-muerte') and c.title=d.cult_title join public.cult_occurrences co on co.cult_id=c.id and co.year=2026
where not exists(select 1 from public.source_links sl where sl.source_id=s.id and sl.cult_occurrence_id=co.id);

-- Tres series externas estables: Penitencia, Gloria y Rosario público.
with series_data(outing_type,title,month,date_rule,origin_slug,destination_slug,route_summary,description,display_order) as (
  values
    ('Estación de penitencia','Estación de penitencia del Viernes de Dolores',null::smallint,'Viernes de Dolores','parroquia-san-juan-bosco-triana','real-parroquia-senora-santa-ana-triana','Parroquia de San Juan Bosco · Real Parroquia de Señora Santa Ana · regreso a San Juan Bosco.','Estación anual del Santísimo Cristo de Pasión y Muerte.',10),
    ('Procesión de gloria','Salida procesional de Santa María del Buen Aire',9::smallint,'Septiembre; fecha según calendario anual','parroquia-nuestra-senora-buen-aire-sevilla','parroquia-nuestra-senora-buen-aire-sevilla','Parroquia de Nuestra Señora del Buen Aire · feligresía de Triana · regreso a la Parroquia.','Salida letífica anual de Santa María del Buen Aire, reactivada en 2008.',20),
    ('Rosario público','Rosario público de Nuestra Señora del Desconsuelo y Visitación',null::smallint,'Fecha según convocatoria anual','parroquia-nuestra-senora-buen-aire-sevilla','parroquia-nuestra-senora-buen-aire-sevilla','Parroquia de Nuestra Señora del Buen Aire · feligresía de Triana · regreso a la Parroquia.','Culto externo anual presidido por la dolorosa desde 2012.',30)
)
insert into public.outing_series(brotherhood_entity_id,outing_type,character,title,month,date_rule,municipality_id,origin_place_id,destination_place_id,route_summary,description,display_order,status,notes)
select h.id,d.outing_type,'ordinary',d.title,d.month,d.date_rule,m.id,op.id,dp.id,d.route_summary,d.description,d.display_order,'published','La serie estable se separa de cada edición anual y no fija horarios variables.'
from series_data d join public.entities h on h.slug='pasion-y-muerte' join public.municipalities m on m.slug='sevilla' join public.places op on op.slug=d.origin_slug join public.places dp on dp.slug=d.destination_slug
where not exists(select 1 from public.outing_series os where os.brotherhood_entity_id=h.id and os.title=d.title and os.status<>'archived');

-- Estación celebrada el 27 de marzo de 2026.
insert into public.outings(brotherhood_entity_id,outing_type,character,title,outing_date,year,departure_time,return_time,return_date,municipality_id,origin_place_id,destination_place_id,route_summary,route,description,public_notes,event_status,status,outing_series_id,slug,reference_code,origin_text,destination_text)
select h.id,'Estación de penitencia','ordinary','Estación de penitencia de Pasión y Muerte 2026',date '2026-03-27',2026,time '20:00',time '00:30',date '2026-03-28',m.id,op.id,dp.id,
  'San Juan Bosco · Santa Ana · Pureza · San Jacinto · regreso a San Juan Bosco.',
  jsonb_build_object('itineraries',jsonb_build_array(jsonb_build_object('id','route','label','Recorrido','points',jsonb_build_array(
    jsonb_build_object('id','p01','role','start','label','Condes de Bustillo'),jsonb_build_object('id','p02','role','stop','label','Evangelista'),jsonb_build_object('id','p03','role','stop','label','Prosperidad'),jsonb_build_object('id','p04','role','stop','label','Trabajo'),jsonb_build_object('id','p05','role','stop','label','Febo'),jsonb_build_object('id','p06','role','stop','label','Evangelista'),jsonb_build_object('id','p07','role','stop','label','Pagés del Corro'),jsonb_build_object('id','p08','role','stop','label','Victoria'),jsonb_build_object('id','p09','role','stop','label','Rodrigo de Triana'),jsonb_build_object('id','p10','role','stop','label','Plazuela de Señora Santa Ana'),jsonb_build_object('id','p11','role','stop','label','Párroco Don Eugenio'),jsonb_build_object('id','p12','role','stop','label','Pureza'),jsonb_build_object('id','p13','role','stop','label','Fabié'),jsonb_build_object('id','p14','role','stop','label','Rodrigo de Triana'),jsonb_build_object('id','p15','role','stop','label','San Jacinto'),jsonb_build_object('id','p16','role','end','label','Condes de Bustillo')
  )))),
  'Estación de penitencia a la Real Parroquia de Señora Santa Ana con el único paso del Santísimo Cristo de Pasión y Muerte.','La memoria oficial del 28 de marzo confirma la estación del Viernes de Dolores; música y horario proceden de la guía de 2026.','held','published',os.id,'estacion-penitencia-pasion-muerte-2026','PASION-MUERTE-EP-2026',op.name,dp.name
from public.entities h join public.municipalities m on m.slug='sevilla' join public.places op on op.slug='parroquia-san-juan-bosco-triana' join public.places dp on dp.slug='real-parroquia-senora-santa-ana-triana' join public.outing_series os on os.brotherhood_entity_id=h.id and os.title='Estación de penitencia del Viernes de Dolores'
where h.slug='pasion-y-muerte' and not exists(select 1 from public.outings o where o.slug='estacion-penitencia-pasion-muerte-2026');

-- Gloria anunciada para el 26 de septiembre de 2026: sin inventar itinerario no publicado.
insert into public.outings(brotherhood_entity_id,outing_type,character,title,outing_date,year,departure_time,return_time,return_date,municipality_id,origin_place_id,destination_place_id,route_summary,description,public_notes,event_status,status,outing_series_id,slug,reference_code,origin_text,destination_text)
select h.id,'Procesión de gloria','ordinary','Salida procesional de Santa María del Buen Aire 2026',date '2026-09-26',2026,time '21:00',time '00:00',date '2026-09-27',m.id,p.id,p.id,
  'Parroquia de Nuestra Señora del Buen Aire · feligresía de Triana · regreso a la Parroquia.',
  'Salida anual de Santa María del Buen Aire por las calles de su feligresía.','Convocada para el 26 de septiembre de 2026; el recorrido concreto queda pendiente de publicación oficial.','announced','published',os.id,'salida-santa-maria-buen-aire-2026','PASION-MUERTE-GLORIA-2026',p.name,p.name
from public.entities h join public.municipalities m on m.slug='sevilla' join public.places p on p.slug='parroquia-nuestra-senora-buen-aire-sevilla' join public.outing_series os on os.brotherhood_entity_id=h.id and os.title='Salida procesional de Santa María del Buen Aire'
where h.slug='pasion-y-muerte' and not exists(select 1 from public.outings o where o.slug='salida-santa-maria-buen-aire-2026');

-- Extraordinaria de 2016: se conserva sin fecha exacta porque la fuente solo publica el año.
insert into public.outings(brotherhood_entity_id,outing_type,character,title,year,municipality_id,origin_place_id,destination_place_id,reason,route_summary,description,event_status,status,slug,reference_code,origin_text,destination_text)
select h.id,'Procesión extraordinaria','extraordinary','Salida extraordinaria de Santa María del Buen Aire a Santa Ana',2016,m.id,op.id,dp.id,'50 aniversario de la Parroquia de Nuestra Señora del Buen Aire y 750 aniversario de la Real Parroquia de Señora Santa Ana','Parroquia de Nuestra Señora del Buen Aire · Real Parroquia de Señora Santa Ana.','Salida extraordinaria de Santa María del Buen Aire a la Real Parroquia de Señora Santa Ana.','held','published','salida-extraordinaria-santa-maria-buen-aire-2016','PASION-MUERTE-EXTRA-2016',op.name,dp.name
from public.entities h join public.municipalities m on m.slug='sevilla' join public.places op on op.slug='parroquia-nuestra-senora-buen-aire-sevilla' join public.places dp on dp.slug='real-parroquia-senora-santa-ana-triana'
where h.slug='pasion-y-muerte' and not exists(select 1 from public.outings o where o.slug='salida-extraordinaria-santa-maria-buen-aire-2016');

with outing_entities_data(outing_slug,entity_slug,role,notes) as (
  values
    ('estacion-penitencia-pasion-muerte-2026','santisimo-cristo-pasion-muerte-sevilla','processional_image','Titular que preside el único paso de la estación de penitencia.'),
    ('salida-santa-maria-buen-aire-2026','santa-maria-buen-aire-sevilla','processional_image','Titular que preside la procesión de Gloria.'),
    ('salida-extraordinaria-santa-maria-buen-aire-2016','santa-maria-buen-aire-sevilla','processional_image','Titular de la salida extraordinaria de 2016.')
)
insert into public.outing_entities(outing_id,entity_id,role,notes)
select o.id,e.id,d.role,d.notes from outing_entities_data d join public.outings o on o.slug=d.outing_slug join public.entities e on e.slug=d.entity_slug
on conflict(outing_id,entity_id,role) do update set notes=excluded.notes;

with position_data(outing_slug,step_slug,position_code,position_label,notes) as (
  values
    ('estacion-penitencia-pasion-muerte-2026','paso-santisimo-cristo-pasion-muerte-sevilla','before_christ','Delante del paso del Santísimo Cristo','Trío de capilla durante el recorrido completo.'),
    ('salida-santa-maria-buen-aire-2026','paso-procesional-santa-maria-buen-aire-sevilla','behind_glory','Tras el paso de Santa María del Buen Aire','Acompañamiento anunciado para la procesión de Gloria de 2026.')
)
insert into public.outing_music_positions(outing_id,step_entity_id,position_code,position_label,sequence_no,notes,status)
select o.id,st.id,d.position_code,d.position_label,1,d.notes,'published'
from position_data d join public.outings o on o.slug=d.outing_slug join public.entities st on st.slug=d.step_slug
on conflict(outing_id,sequence_no) do update set step_entity_id=excluded.step_entity_id,position_code=excluded.position_code,position_label=excluded.position_label,notes=excluded.notes,status='published',updated_at=now();

with assignment_data(outing_slug,position_code,band_slug,notes) as (
  values
    ('estacion-penitencia-pasion-muerte-2026','before_christ','capilla-musical-golgota-sevilla','Trío de Capilla Gólgota en la estación celebrada de 2026.'),
    ('salida-santa-maria-buen-aire-2026','behind_glory','banda-municipal-musica-mairena-del-alcor','Banda Municipal de Mairena del Alcor, anunciada para la Gloria de 2026.')
)
insert into public.outing_music_assignments(music_position_id,band_entity_id,participation_mode,sequence_no,notes,status)
select op.id,b.id,'full_route',1,d.notes,'published'
from assignment_data d join public.outings o on o.slug=d.outing_slug join public.outing_music_positions op on op.outing_id=o.id and op.position_code=d.position_code join public.entities b on b.slug=d.band_slug
where not exists(select 1 from public.outing_music_assignments oma where oma.music_position_id=op.id and oma.band_entity_id=b.id and oma.sequence_no=1);

with accompaniment_data(outing_slug,step_slug,band_slug,position,notes) as (
  values
    ('estacion-penitencia-pasion-muerte-2026','paso-santisimo-cristo-pasion-muerte-sevilla','capilla-musical-golgota-sevilla','Delante del paso del Santísimo Cristo','Acompañamiento de la estación celebrada de 2026.'),
    ('salida-santa-maria-buen-aire-2026','paso-procesional-santa-maria-buen-aire-sevilla','banda-municipal-musica-mairena-del-alcor','Tras el paso de Santa María del Buen Aire','Acompañamiento anunciado para la Gloria de 2026.')
)
insert into public.accompaniments(outing_id,band_entity_id,step_entity_id,position,year,notes,status)
select o.id,b.id,st.id,d.position,2026,d.notes,'published'
from accompaniment_data d join public.outings o on o.slug=d.outing_slug join public.entities b on b.slug=d.band_slug join public.entities st on st.slug=d.step_slug
where not exists(select 1 from public.accompaniments a where a.outing_id=o.id and a.band_entity_id=b.id and a.step_entity_id=st.id and a.year=2026);

-- Trazabilidad de salidas, series y música.
with outing_source_data(outing_slug,source_url,scope,notes) as (
  values
    ('estacion-penitencia-pasion-muerte-2026','https://hermandadpasionymuerte.es/?p=3555','Salida celebrada · 2026','Memoria oficial posterior que confirma la estación.'),
    ('estacion-penitencia-pasion-muerte-2026','https://sevilla.abc.es/pasionensevilla/agenda-cofrade/viernes-de-dolores-2026-pasion-y-muerte.html','Horario, itinerario y música · 2026','Guía especializada de la edición de 2026.'),
    ('salida-santa-maria-buen-aire-2026','https://hermandadpasionymuerte.es/','Salida anunciada · 2026','Calendario oficial con fecha y horario.'),
    ('salida-extraordinaria-santa-maria-buen-aire-2016','https://hermandadpasionymuerte.es/?page_id=1314','Histórico · salida extraordinaria','Crónica retrospectiva oficial de la salida de 2016.')
)
insert into public.source_links(source_id,outing_id,scope,notes)
select s.id,o.id,d.scope,d.notes from outing_source_data d join public.sources s on s.url=d.source_url join public.outings o on o.slug=d.outing_slug
where not exists(select 1 from public.source_links sl where sl.source_id=s.id and sl.outing_id=o.id and sl.scope=d.scope);

with series_sources(series_title,source_url) as (
  values
    ('Estación de penitencia del Viernes de Dolores','https://hermandadpasionymuerte.es/?page_id=1363'),
    ('Salida procesional de Santa María del Buen Aire','https://hermandadpasionymuerte.es/?page_id=1363'),
    ('Rosario público de Nuestra Señora del Desconsuelo y Visitación','https://hermandadpasionymuerte.es/?page_id=1309')
)
insert into public.source_links(source_id,outing_series_id,scope,notes)
select s.id,os.id,'Salida habitual','Periodicidad y carácter de la salida publicados por la Hermandad.'
from series_sources d join public.sources s on s.url=d.source_url join public.outing_series os on os.brotherhood_entity_id=(select id from public.entities where slug='pasion-y-muerte') and os.title=d.series_title
where not exists(select 1 from public.source_links sl where sl.source_id=s.id and sl.outing_series_id=os.id);

with music_sources(outing_slug,source_url) as (
  values
    ('estacion-penitencia-pasion-muerte-2026','https://sevilla.abc.es/pasionensevilla/agenda-cofrade/viernes-de-dolores-2026-pasion-y-muerte.html'),
    ('salida-santa-maria-buen-aire-2026','https://infocofrade.com/agenda/')
), targets as (
  select o.slug,op.id position_id,oma.id assignment_id,d.source_url
  from music_sources d join public.outings o on o.slug=d.outing_slug join public.outing_music_positions op on op.outing_id=o.id join public.outing_music_assignments oma on oma.music_position_id=op.id
)
insert into public.source_links(source_id,outing_music_position_id,scope,notes)
select s.id,t.position_id,'Posición musical · salida 2026','Posición de la formación documentada para la salida.'
from targets t join public.sources s on s.url=t.source_url
where not exists(select 1 from public.source_links sl where sl.source_id=s.id and sl.outing_music_position_id=t.position_id);

with music_sources(outing_slug,source_url) as (
  values
    ('estacion-penitencia-pasion-muerte-2026','https://sevilla.abc.es/pasionensevilla/agenda-cofrade/viernes-de-dolores-2026-pasion-y-muerte.html'),
    ('salida-santa-maria-buen-aire-2026','https://infocofrade.com/agenda/')
), targets as (
  select o.slug,oma.id assignment_id,d.source_url
  from music_sources d join public.outings o on o.slug=d.outing_slug join public.outing_music_positions op on op.outing_id=o.id join public.outing_music_assignments oma on oma.music_position_id=op.id
)
insert into public.source_links(source_id,outing_music_assignment_id,scope,notes)
select s.id,t.assignment_id,'Acompañamiento musical · salida 2026','Formación y participación documentadas para la edición.'
from targets t join public.sources s on s.url=t.source_url
where not exists(select 1 from public.source_links sl where sl.source_id=s.id and sl.outing_music_assignment_id=t.assignment_id);

-- Las relaciones históricas de acompañamiento se conservan y ganan una fuente explícita.
insert into public.source_links(source_id,music_accompaniment_period_id,scope,notes)
select s.id,mp.id,'Acompañamiento vigente','Formación y posición documentadas para la edición de 2026.'
from public.music_accompaniment_periods mp join public.sources s on s.url=case
  when mp.band_entity_id=(select id from public.entities where slug='capilla-musical-golgota-sevilla') then 'https://sevilla.abc.es/pasionensevilla/agenda-cofrade/viernes-de-dolores-2026-pasion-y-muerte.html'
  else 'https://infocofrade.com/agenda/' end
where mp.brotherhood_entity_id=(select id from public.entities where slug='pasion-y-muerte') and mp.is_current
  and not exists(select 1 from public.source_links sl where sl.source_id=s.id and sl.music_accompaniment_period_id=mp.id);

do $$
declare
  h_id uuid := (select id from public.entities where slug='pasion-y-muerte');
  completion integer;
begin
  if (select count(*) from public.entity_locations where entity_id=h_id and status='published') <> 4 then raise exception 'Las cuatro sedes históricas o vigentes no quedaron publicadas'; end if;
  if (select count(*) from public.entity_locations where entity_id=h_id and status='published' and is_current) <> 2 then raise exception 'La sede canónica y la sede de salida vigentes no quedaron separadas'; end if;
  if (select count(*) from public.entity_relations er join public.entities t on t.id=er.target_entity_id where er.source_entity_id=h_id and er.relation_type='has_titular' and t.slug='resurreccion-nuestro-senor-pasion-y-muerte-sevilla' and er.status='published') <> 1 then raise exception 'La Resurrección no quedó vinculada como titular no visual'; end if;
  if (select count(*) from public.entity_relations er where er.source_entity_id=h_id and er.relation_type='godmother_brotherhood' and er.date_from_text='2011' and exists(select 1 from public.source_links sl where sl.entity_relation_id=er.id)) <> 1 then raise exception 'La relación con la Hermandad madrina no quedó documentada'; end if;
  if (select count(*) from public.cults where brotherhood_entity_id=h_id and status='published') <> 8 then raise exception 'Los ocho cultos recurrentes no quedaron publicados'; end if;
  if (select count(*) from public.cult_occurrences co join public.cults c on c.id=co.cult_id where c.brotherhood_entity_id=h_id and co.year=2026 and co.status='published') <> 8 then raise exception 'Las ocho ocurrencias de 2026 no quedaron publicadas'; end if;
  if (select count(*) from public.outing_series where brotherhood_entity_id=h_id and status='published') <> 3 then raise exception 'Las tres salidas habituales no quedaron separadas'; end if;
  if (select count(*) from public.outings where brotherhood_entity_id=h_id and status='published') <> 3 then raise exception 'Las tres salidas documentadas no quedaron publicadas'; end if;
  if exists(select 1 from public.outings o where o.brotherhood_entity_id=h_id and o.status='published' and not exists(select 1 from public.source_links sl where sl.outing_id=o.id)) then raise exception 'Existe una salida publicada sin fuente'; end if;
  if exists(select 1 from public.outings where brotherhood_entity_id=h_id and outing_date>date '2026-09-06' and event_status='held') then raise exception 'Existe una salida futura marcada como celebrada'; end if;
  if (select count(*) from public.outing_music_assignments oma join public.outing_music_positions op on op.id=oma.music_position_id join public.outings o on o.id=op.outing_id where o.brotherhood_entity_id=h_id and oma.status='published') <> 2 then raise exception 'Los dos acompañamientos de 2026 no quedaron vinculados'; end if;
  if (select count(*) from public.accompaniments a join public.outings o on o.id=a.outing_id where o.brotherhood_entity_id=h_id and a.status='published') <> 2 then raise exception 'La compatibilidad musical de la ficha no quedó completa'; end if;
  select completion_percentage into completion from public.brotherhood_completeness where entity_id=h_id;
  if completion <> 100 then raise exception 'La ficha técnica de Pasión y Muerte queda en % en vez de 100',completion; end if;
end $$;
