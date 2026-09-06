-- Hilo Cofrade · cierre documental avanzado de La Misión de Heliópolis
-- Corte editorial: 2026-09-06
-- Solo DML editorial. Sin DDL, nuevas tablas, RLS, arquitectura ni UX.

do $$
begin
  if (select count(*) from public.entities where slug='hermandad-de-la-mision-sevilla' and entity_type='brotherhood') <> 1 then
    raise exception 'La ficha canónica de La Misión de Heliópolis no es unívoca';
  end if;
  if (select count(*) from public.brotherhood_images bi join public.entities h on h.id=bi.brotherhood_entity_id where h.slug='hermandad-de-la-mision-sevilla' and bi.status='published') <> 4 then
    raise exception 'El núcleo de cuatro imágenes titulares de La Misión no está intacto';
  end if;
end $$;

with source_data(name,url,source_type,publisher,publication_date,notes) as (
  values
    ('La Misión · Historia','https://archicofradiamision.es/historia/','Web oficial','Archicofradía de la Misión',null::date,'Origen devocional, reorganización, agregación, caracteres sacramental y penitencial y cronología de las imágenes.'),
    ('La Misión · Parroquia','https://archicofradiamision.es/parroquia/','Web oficial','Archicofradía de la Misión',null::date,'Sede canónica y dirección de la Parroquia de San Antonio María Claret.'),
    ('La Misión · Cofradía','https://archicofradiamision.es/cofradia/','Web oficial','Archicofradía de la Misión',null::date,'Hábito y recorridos habituales de la estación de penitencia y la procesión de Gloria.'),
    ('La Misión · Calendario de cultos 2026','https://archicofradiamision.es/calendario-de-cultos/','Web oficial','Archicofradía de la Misión',date '2026-01-01','Calendario oficial de cultos de 2026.'),
    ('La Misión · Boletín mayo 2026','https://archicofradiamision.es/wp-content/uploads/2026/05/Boletin_Mayo2026.pdf','Publicación oficial','Archicofradía de la Misión',date '2026-05-01','Memoria posterior de la estación y el Vía Crucis; convocatorias e itinerarios de las procesiones eucarística y de Gloria.'),
    ('La Misión · Procesión del Inmaculado Corazón de María 2026','https://archicofradiamision.es/procesion-del-inmaculado-corazon-de-maria-2026/','Web oficial','Archicofradía de la Misión',date '2026-06-01','Convocatoria oficial de la procesión de Gloria del 13 de junio de 2026.'),
    ('La Misión · Inmaculado Corazón de María','https://archicofradiamision.es/inmaculado-corazon-de-maria/','Web oficial','Archicofradía de la Misión',null::date,'Autoría, fecha, materiales, medidas e iconografía de la titular gloriosa.'),
    ('La Misión · Santo Cristo de la Misión','https://archicofradiamision.es/santo-cristo-de-la-mision/','Web oficial','Archicofradía de la Misión',null::date,'Autoría, fecha y materiales del titular cristífero.'),
    ('La Misión · Nuestra Señora del Amparo','https://archicofradiamision.es/nuestra-senora-del-amparo/','Web oficial','Archicofradía de la Misión',null::date,'Historia material y cronología de la titular dolorosa.'),
    ('La Misión · San Juan Evangelista','https://archicofradiamision.es/san-juan-evangelista/','Web oficial','Archicofradía de la Misión',null::date,'Autoría, fecha y procedencia de San Juan Evangelista.'),
    ('La Misión · Santísimo Sacramento','https://archicofradiamision.es/santisimo-sacramento/','Web oficial','Archicofradía de la Misión',null::date,'Titularidad sacramental, cultos eucarísticos y procesión anual.'),
    ('La Misión · San Antonio María Claret','https://archicofradiamision.es/san-antonio-maria-claret/','Web oficial','Archicofradía de la Misión',null::date,'Titularidad y contexto claretiano de la corporación.')
)
insert into public.sources(name,url,source_type,author_or_publisher,publication_date,accessed_at,notes)
select name,url,source_type,publisher,publication_date,date '2026-09-06',notes
from source_data d where not exists(select 1 from public.sources s where s.url=d.url);

-- Identidad e historia: se mantiene un único nodo para la corporación de Heliópolis.
update public.brotherhoods
set history_text='La devoción al Inmaculado Corazón de María nació en la iglesia parisina de Saint-Eugène en 1836 y tuvo una primera implantación sevillana en 1907. Tras la llegada de los claretianos a Heliópolis en 1940, la reorganización comenzó en 1948 y la Archicofradía quedó agregada y estatutariamente configurada en 1949. Incorporó su carácter sacramental en 1987 y el penitencial en 2007; estrenó túnicas el Viernes de Dolores de 2008.'
where entity_id=(select id from public.entities where slug='hermandad-de-la-mision-sevilla');

insert into public.entity_locations(entity_id,place_id,municipality_id,location_type,date_from_text,is_current,notes,status)
select h.id,p.id,m.id,'Sede canónica','Desde la reorganización en Heliópolis',true,'Parroquia de San Antonio María Claret, Avenida Padre García Tejero, 8.','published'
from public.entities h join public.places p on p.slug='parroquia-san-antonio-maria-claret-sevilla' join public.municipalities m on m.slug='sevilla'
where h.slug='hermandad-de-la-mision-sevilla'
  and not exists(select 1 from public.entity_locations el where el.entity_id=h.id and el.place_id=p.id and el.location_type='Sede canónica');

insert into public.source_links(source_id,entity_location_id,scope,notes)
select s.id,el.id,'Sede canónica vigente','Dirección publicada por la propia Archicofradía.'
from public.sources s join public.entity_locations el on true join public.entities h on h.id=el.entity_id join public.places p on p.id=el.place_id
where s.url='https://archicofradiamision.es/parroquia/' and h.slug='hermandad-de-la-mision-sevilla' and p.slug='parroquia-san-antonio-maria-claret-sevilla'
  and not exists(select 1 from public.source_links sl where sl.source_id=s.id and sl.entity_location_id=el.id);

insert into public.source_links(source_id,entity_id,scope,notes)
select s.id,h.id,'Historia e identidad','Historia institucional publicada por la Archicofradía.'
from public.sources s cross join public.entities h
where s.url='https://archicofradiamision.es/historia/' and h.slug='hermandad-de-la-mision-sevilla'
  and not exists(select 1 from public.source_links sl where sl.source_id=s.id and sl.entity_id=h.id and sl.scope='Historia e identidad');

insert into public.source_links(source_id,brotherhood_habit_id,scope,notes)
select s.id,bh.id,'Hábito penitencial','Descripción oficial de la túnica, antifaz, escapulario, botonadura, cíngulo y calzado.'
from public.sources s join public.brotherhood_habits bh on true join public.entities h on h.id=bh.brotherhood_entity_id
where s.url='https://archicofradiamision.es/cofradia/' and h.slug='hermandad-de-la-mision-sevilla'
  and not exists(select 1 from public.source_links sl where sl.source_id=s.id and sl.brotherhood_habit_id=bh.id);

-- Titulares no visuales: se relacionan como advocaciones, sin fabricar imágenes procesionales.
insert into public.entities(entity_type,name,slug,summary,status)
select 'advocation','San Antonio María Claret','san-antonio-maria-claret','Titular y referencia fundacional claretiana de la Archicofradía de la Misión de Heliópolis.','published'
where not exists(select 1 from public.entities where slug='san-antonio-maria-claret');

with titular_data(target_slug,notes) as (
  values
    ('santisimo-sacramento','Titular sacramental de la corporación desde la incorporación de este carácter en 1987.'),
    ('san-antonio-maria-claret','Titular que expresa la identidad claretiana de la corporación.')
)
insert into public.entity_relations(source_entity_id,relation_type,target_entity_id,notes,status)
select h.id,'has_titular',t.id,d.notes,'published'
from titular_data d join public.entities h on h.slug='hermandad-de-la-mision-sevilla' join public.entities t on t.slug=d.target_slug
where not exists(select 1 from public.entity_relations er where er.source_entity_id=h.id and er.target_entity_id=t.id and er.relation_type='has_titular' and er.status<>'archived');

with relation_sources as (
  select er.id relation_id,s.id source_id
  from public.entity_relations er join public.entities h on h.id=er.source_entity_id join public.entities t on t.id=er.target_entity_id
  join public.sources s on s.url=case t.slug when 'santisimo-sacramento' then 'https://archicofradiamision.es/santisimo-sacramento/' else 'https://archicofradiamision.es/san-antonio-maria-claret/' end
  where h.slug='hermandad-de-la-mision-sevilla' and er.relation_type='has_titular' and t.slug in ('santisimo-sacramento','san-antonio-maria-claret')
)
insert into public.source_links(source_id,entity_relation_id,scope,notes)
select source_id,relation_id,'Titularidad no visual','Titularidad publicada por la propia Archicofradía.' from relation_sources x
where not exists(select 1 from public.source_links sl where sl.source_id=x.source_id and sl.entity_relation_id=x.relation_id);

-- Paso de Gloria: se crea solo la relación procesional comprobada, sin atribuir autoría ni cronología no publicadas.
insert into public.entities(entity_type,name,slug,summary,status)
select 'step','Paso del Inmaculado Corazón de María','paso-inmaculado-corazon-maria-mision-sevilla','Paso de Gloria de la titular mariana por las calles de Heliópolis.','published'
where not exists(select 1 from public.entities where slug='paso-inmaculado-corazon-maria-mision-sevilla');

insert into public.steps(entity_id,step_type,current_condition,description,current_state_notes)
select st.id,'Paso de Gloria','preserved','Paso procesional del Inmaculado Corazón de María en su salida anual por Heliópolis.','No se fijan autoría, fecha de ejecución ni cuadrilla sin una fuente oficial unívoca.'
from public.entities st where st.slug='paso-inmaculado-corazon-maria-mision-sevilla'
on conflict(entity_id) do update set step_type=excluded.step_type,current_condition=excluded.current_condition,description=excluded.description,current_state_notes=excluded.current_state_notes;

insert into public.brotherhood_steps(brotherhood_entity_id,step_entity_id,relation_type,date_from_text,notes,status)
select h.id,st.id,'processional_step','Vigente en 2026','Paso de la procesión anual del Inmaculado Corazón de María.','published'
from public.entities h join public.entities st on st.slug='paso-inmaculado-corazon-maria-mision-sevilla'
where h.slug='hermandad-de-la-mision-sevilla'
  and not exists(select 1 from public.brotherhood_steps bs where bs.brotherhood_entity_id=h.id and bs.step_entity_id=st.id and bs.relation_type='processional_step' and bs.status<>'archived');

insert into public.image_steps(image_entity_id,step_entity_id,relation_type,date_from_text,notes,status)
select i.id,st.id,'processes_on','Vigente en 2026','La titular gloriosa preside este paso en su procesión anual.','published'
from public.entities i join public.entities st on st.slug='paso-inmaculado-corazon-maria-mision-sevilla'
where i.slug='inmaculado-corazon-maria-mision-sevilla'
  and not exists(select 1 from public.image_steps ix where ix.image_entity_id=i.id and ix.step_entity_id=st.id and ix.relation_type='processes_on' and ix.status<>'archived');

update public.music_accompaniment_periods
set step_entity_id=(select id from public.entities where slug='paso-inmaculado-corazon-maria-mision-sevilla'),
    year_from=coalesce(year_from,2026),
    public_step_name='Paso del Inmaculado Corazón de María',
    updated_at=now()
where brotherhood_entity_id=(select id from public.entities where slug='hermandad-de-la-mision-sevilla')
  and band_entity_id=(select id from public.entities where slug='banda-de-musica-del-maestro-tejera')
  and outing_type='Procesión de gloria' and is_current;

insert into public.source_links(source_id,brotherhood_step_id,scope,notes)
select s.id,bs.id,'Paso de Gloria','La página oficial describe la procesión anual presidida por la titular.'
from public.sources s join public.brotherhood_steps bs on true join public.entities h on h.id=bs.brotherhood_entity_id join public.entities st on st.id=bs.step_entity_id
where s.url='https://archicofradiamision.es/cofradia/' and h.slug='hermandad-de-la-mision-sevilla' and st.slug='paso-inmaculado-corazon-maria-mision-sevilla'
  and not exists(select 1 from public.source_links sl where sl.source_id=s.id and sl.brotherhood_step_id=bs.id);

insert into public.source_links(source_id,image_step_id,scope,notes)
select s.id,ix.id,'Titular en su paso de Gloria','Relación procesional publicada por la Archicofradía.'
from public.sources s join public.image_steps ix on true join public.entities i on i.id=ix.image_entity_id join public.entities st on st.id=ix.step_entity_id
where s.url='https://archicofradiamision.es/procesion-del-inmaculado-corazon-de-maria-2026/' and i.slug='inmaculado-corazon-maria-mision-sevilla' and st.slug='paso-inmaculado-corazon-maria-mision-sevilla'
  and not exists(select 1 from public.source_links sl where sl.source_id=s.id and sl.image_step_id=ix.id);

-- Cultos recurrentes: la regla estable se separa de cada edición anual.
with cult_data(image_slug,cult_type,title,date_rule,month,description,recurrence_label,display_order) as (
  values
    ('santo-cristo-mision-sevilla','Besamanos','Besamanos al Santo Cristo de la Misión','Primer domingo de marzo; fecha concreta según calendario anual',3::smallint,'Veneración anual al titular cristífero.','Anual · Cuaresma',10),
    ('santo-cristo-mision-sevilla','Quinario','Solemne Quinario al Santo Cristo de la Misión','Cinco días de Cuaresma; fechas concretas según calendario anual',3::smallint,'Quinario anual al Santo Cristo de la Misión.','Anual · Cuaresma',20),
    (null::text,'Función Principal','Función Principal de Instituto','Domingo posterior al Quinario',3::smallint,'Función Principal de Instituto de la Archicofradía.','Anual · tras el Quinario',30),
    ('santo-cristo-mision-sevilla','Vía Crucis','Vía Crucis del Santo Cristo de la Misión','Viernes anterior al Viernes de Dolores',3::smallint,'Vía Crucis anual y posterior subida del titular a su paso.','Anual · Cuaresma',40),
    ('inmaculado-corazon-maria-mision-sevilla','Novena','Solemne Novena al Inmaculado Corazón de María','Nueve días hasta el sábado posterior al Corpus Christi',6::smallint,'Novena anual a la titular gloriosa.','Anual · junio',50),
    (null::text,'Triduo','Triduo a Jesús Sacramentado','Tres días de septiembre; fechas concretas según calendario anual',9::smallint,'Triduo sacramental anual.','Anual · septiembre',60),
    ('nuestra-senora-amparo-mision','Triduo','Solemne Triduo a Nuestra Señora del Amparo','Tres días de noviembre; fechas concretas según calendario anual',11::smallint,'Triduo anual a la titular dolorosa.','Anual · noviembre',70),
    ('nuestra-senora-amparo-mision','Besamanos','Besamanos a Nuestra Señora del Amparo','Domingo posterior al Triduo',11::smallint,'Veneración anual a Nuestra Señora del Amparo.','Anual · noviembre',80),
    ('nuestra-senora-amparo-mision','Función Solemne','Función Solemne a Nuestra Señora del Amparo','Domingo posterior al Triduo',11::smallint,'Función anual a Nuestra Señora del Amparo.','Anual · noviembre',90),
    (null::text,'Misa de Réquiem','Misa de Réquiem por los hermanos difuntos','Noviembre; fecha concreta según calendario anual',11::smallint,'Eucaristía anual por los hermanos difuntos.','Anual · noviembre',100),
    ('san-juan-evangelista-mision-sevilla','Función Solemne','Función Solemne a San Juan Evangelista','28 de diciembre',12::smallint,'Función anual al titular San Juan Evangelista.','Cada 28 de diciembre',110),
    (null::text,'Exposición eucarística','Exposición del Santísimo Sacramento y Santa Misa','Cada jueves',null::smallint,'Culto eucarístico semanal de la corporación sacramental.','Semanal · jueves',120)
)
insert into public.cults(brotherhood_entity_id,image_entity_id,cult_type,title,date_rule,month,place_id,description,status,is_recurring,recurrence_label,display_order,notes)
select h.id,i.id,d.cult_type,d.title,d.date_rule,d.month,p.id,d.description,'published',true,d.recurrence_label,d.display_order,'Regla estable tomada del calendario y las páginas oficiales; las fechas anuales viven en cult_occurrences.'
from cult_data d join public.entities h on h.slug='hermandad-de-la-mision-sevilla' join public.places p on p.slug='parroquia-san-antonio-maria-claret-sevilla' left join public.entities i on i.slug=d.image_slug
where not exists(select 1 from public.cults c where c.brotherhood_entity_id=h.id and c.title=d.title and c.is_recurring);

with occurrence_data(cult_title,start_date,end_date,event_status,description,notes) as (
  values
    ('Besamanos al Santo Cristo de la Misión',date '2026-03-01',date '2026-03-01','held','Veneración celebrada el 1 de marzo de 2026.','El boletín oficial posterior conserva la programación cuaresmal ya celebrada.'),
    ('Solemne Quinario al Santo Cristo de la Misión',date '2026-03-03',date '2026-03-07','held','Quinario celebrado del 3 al 7 de marzo de 2026, a las 19:45.','El boletín oficial posterior conserva la programación cuaresmal ya celebrada.'),
    ('Función Principal de Instituto',date '2026-03-08',date '2026-03-08','held','Función Principal celebrada el 8 de marzo de 2026, a las 12:30.','El boletín oficial posterior conserva la programación cuaresmal ya celebrada.'),
    ('Vía Crucis del Santo Cristo de la Misión',date '2026-03-20',date '2026-03-20','held','Vía Crucis y subida del titular a su paso celebrados el 20 de marzo de 2026.','La memoria oficial posterior confirma expresamente la celebración.'),
    ('Solemne Novena al Inmaculado Corazón de María',date '2026-06-05',date '2026-06-13','announced','Novena convocada del 5 al 13 de junio de 2026.','Se mantiene announced hasta localizar evidencia oficial posterior.'),
    ('Triduo a Jesús Sacramentado',date '2026-09-22',date '2026-09-24','announced','Triduo anunciado del 22 al 24 de septiembre de 2026.','Fecha futura en el corte editorial.'),
    ('Solemne Triduo a Nuestra Señora del Amparo',date '2026-11-05',date '2026-11-07','announced','Triduo anunciado del 5 al 7 de noviembre de 2026.','Fecha futura en el corte editorial.'),
    ('Besamanos a Nuestra Señora del Amparo',date '2026-11-08',date '2026-11-08','announced','Besamanos anunciado para el 8 de noviembre de 2026.','Fecha futura en el corte editorial.'),
    ('Función Solemne a Nuestra Señora del Amparo',date '2026-11-08',date '2026-11-08','announced','Función anunciada para el 8 de noviembre de 2026.','Fecha futura en el corte editorial.'),
    ('Misa de Réquiem por los hermanos difuntos',date '2026-11-19',date '2026-11-19','announced','Misa de Réquiem anunciada para el 19 de noviembre de 2026.','Fecha futura en el corte editorial.'),
    ('Función Solemne a San Juan Evangelista',date '2026-12-28',date '2026-12-28','announced','Función anunciada para el 28 de diciembre de 2026.','Fecha futura en el corte editorial.')
)
insert into public.cult_occurrences(cult_id,year,start_date,end_date,place_id,description_override,event_status,status,notes)
select c.id,2026,d.start_date,d.end_date,p.id,d.description,d.event_status,'published',d.notes
from occurrence_data d join public.cults c on c.brotherhood_entity_id=(select id from public.entities where slug='hermandad-de-la-mision-sevilla') and c.title=d.cult_title join public.places p on p.slug='parroquia-san-antonio-maria-claret-sevilla'
on conflict(cult_id,year,start_date) do update set end_date=excluded.end_date,place_id=excluded.place_id,description_override=excluded.description_override,event_status=excluded.event_status,status='published',notes=excluded.notes,updated_at=now();

insert into public.source_links(source_id,cult_id,scope,notes)
select s.id,c.id,'Culto recurrente','Regla anual publicada por la Archicofradía.'
from public.sources s join public.cults c on c.brotherhood_entity_id=(select id from public.entities where slug='hermandad-de-la-mision-sevilla')
where s.url=case when c.title='Exposición del Santísimo Sacramento y Santa Misa' then 'https://archicofradiamision.es/santisimo-sacramento/' else 'https://archicofradiamision.es/calendario-de-cultos/' end
  and not exists(select 1 from public.source_links sl where sl.source_id=s.id and sl.cult_id=c.id);

insert into public.source_links(source_id,cult_occurrence_id,scope,notes)
select s.id,co.id,'Culto 2026','Fecha y estado temporal contrastados en documentación oficial.'
from public.cult_occurrences co join public.cults c on c.id=co.cult_id join public.sources s on s.url=case when co.start_date<=date '2026-03-20' then 'https://archicofradiamision.es/wp-content/uploads/2026/05/Boletin_Mayo2026.pdf' else 'https://archicofradiamision.es/calendario-de-cultos/' end
where c.brotherhood_entity_id=(select id from public.entities where slug='hermandad-de-la-mision-sevilla') and co.year=2026
  and not exists(select 1 from public.source_links sl where sl.source_id=s.id and sl.cult_occurrence_id=co.id);

-- Tres salidas habituales y tres ediciones de 2026. No se registra como propia la participación en el Corpus catedralicio.
with series_data(outing_type,title,month,date_rule,route_summary,description,display_order) as (
  values
    ('Estación de penitencia','Estación de penitencia del Viernes de Dolores',null::smallint,'Viernes de Dolores','Parroquia de San Antonio María Claret · Hospital Virgen del Rocío · Heliópolis · regreso a la Parroquia.','Salida anual del paso de misterio del Santo Cristo de la Misión.',1),
    ('Procesión de gloria','Procesión del Inmaculado Corazón de María',6::smallint,'Sábado posterior al Corpus Christi','Parroquia de San Antonio María Claret · calles de Heliópolis · regreso a la Parroquia.','Salida anual de la titular gloriosa.',2),
    ('Procesión eucarística','Procesión eucarística de la Archicofradía',5::smallint,'En torno a la solemnidad del Corpus Christi','Parroquia de San Antonio María Claret · feligresía de Heliópolis · regreso a la Parroquia.','Procesión anual de Jesús Sacramentado por la feligresía.',3)
)
insert into public.outing_series(brotherhood_entity_id,outing_type,character,title,month,date_rule,municipality_id,origin_place_id,destination_place_id,route_summary,description,display_order,status,notes)
select h.id,d.outing_type,'ordinary',d.title,d.month,d.date_rule,m.id,p.id,p.id,d.route_summary,d.description,d.display_order,'published','Serie habitual; cada edición conserva por separado fecha, horario, itinerario y estado de celebración.'
from series_data d join public.entities h on h.slug='hermandad-de-la-mision-sevilla' join public.municipalities m on m.slug='sevilla' join public.places p on p.slug='parroquia-san-antonio-maria-claret-sevilla'
where not exists(select 1 from public.outing_series os where os.brotherhood_entity_id=h.id and os.outing_type=d.outing_type and os.status<>'archived');

insert into public.outings(brotherhood_entity_id,outing_type,character,title,outing_date,year,departure_time,return_time,return_date,municipality_id,origin_place_id,destination_place_id,route_summary,route,description,public_notes,event_status,status,outing_series_id,slug,reference_code,origin_text,destination_text)
select h.id,'Estación de penitencia','ordinary','Estación de penitencia de La Misión 2026',date '2026-03-27',2026,time '18:15',time '01:30',date '2026-03-28',m.id,p.id,p.id,
  'Parroquia de San Antonio María Claret · Hospital Virgen del Rocío · Heliópolis · regreso a la Parroquia.',
  jsonb_build_object('itineraries',jsonb_build_array(jsonb_build_object('id','route','label','Recorrido','points',jsonb_build_array(
    jsonb_build_object('id','p01','role','start','label','Padre García Tejero'),jsonb_build_object('id','p02','role','stop','label','San Antonio María Claret'),jsonb_build_object('id','p03','role','stop','label','Padre Mediavilla'),jsonb_build_object('id','p04','role','stop','label','Periodista Ramón Resa'),jsonb_build_object('id','p05','role','stop','label','Torcuato Luca de Tena'),jsonb_build_object('id','p06','role','stop','label','Manuel Siurot'),jsonb_build_object('id','p07','role','stop','label','Cardenal Ilundain'),jsonb_build_object('id','p08','role','stop','label','Avenida de la Palmera'),jsonb_build_object('id','p09','role','stop','label','Monzón'),jsonb_build_object('id','p10','role','stop','label','Periodista Antonio del Junco'),jsonb_build_object('id','p11','role','stop','label','Reina Mercedes'),jsonb_build_object('id','p12','role','stop','label','Teba'),jsonb_build_object('id','p13','role','stop','label','Ensanche'),jsonb_build_object('id','p14','role','stop','label','Nicaragua'),jsonb_build_object('id','p15','role','stop','label','Tajo'),jsonb_build_object('id','p16','role','stop','label','Panamá'),jsonb_build_object('id','p17','role','stop','label','Ebro'),jsonb_build_object('id','p18','role','stop','label','Uruguay'),jsonb_build_object('id','p19','role','end','label','Padre García Tejero')
  )))),
  'Estación de penitencia celebrada el Viernes de Dolores de 2026 con 621 participantes.','La memoria oficial contabiliza 487 nazarenos, diputados, penitentes y auxiliares; 21 acólitos; 80 costaleros; 30 monaguillos y 3 representaciones simbólicas.','held','published',os.id,'la-mision-estacion-penitencia-2026','MISION-EP-2026',p.name,p.name
from public.entities h join public.municipalities m on m.slug='sevilla' join public.places p on p.slug='parroquia-san-antonio-maria-claret-sevilla' join public.outing_series os on os.brotherhood_entity_id=h.id and os.outing_type='Estación de penitencia'
where h.slug='hermandad-de-la-mision-sevilla' and not exists(select 1 from public.outings o where o.slug='la-mision-estacion-penitencia-2026');

insert into public.outings(brotherhood_entity_id,outing_type,character,title,outing_date,year,departure_time,return_time,return_date,municipality_id,origin_place_id,destination_place_id,route_summary,route,description,public_notes,event_status,status,outing_series_id,slug,reference_code,origin_text,destination_text)
select h.id,'Procesión de gloria','ordinary','Procesión del Inmaculado Corazón de María 2026',date '2026-06-13',2026,time '21:00',time '00:15',date '2026-06-14',m.id,p.id,p.id,
  'Parroquia de San Antonio María Claret · Heliópolis · regreso a la Parroquia.',
  jsonb_build_object('itineraries',jsonb_build_array(jsonb_build_object('id','route','label','Recorrido','points',jsonb_build_array(
    jsonb_build_object('id','p01','role','start','label','Padre García Tejero'),jsonb_build_object('id','p02','role','stop','label','Glorieta Alcalde Parias Merry'),jsonb_build_object('id','p03','role','stop','label','Teba'),jsonb_build_object('id','p04','role','stop','label','Ensanche'),jsonb_build_object('id','p05','role','stop','label','Plaza Santo Cristo de la Misión'),jsonb_build_object('id','p06','role','stop','label','Nicaragua'),jsonb_build_object('id','p07','role','stop','label','Tajo'),jsonb_build_object('id','p08','role','stop','label','Honduras'),jsonb_build_object('id','p09','role','stop','label','Ebro'),jsonb_build_object('id','p10','role','stop','label','Chile'),jsonb_build_object('id','p11','role','stop','label','Júcar'),jsonb_build_object('id','p12','role','stop','label','Uruguay'),jsonb_build_object('id','p13','role','end','label','Padre García Tejero')
  )))),
  'Procesión de Gloria convocada con el paso del Inmaculado Corazón de María.','La fecha ya ha pasado, pero se mantiene announced porque las fuentes localizadas son convocatorias previas y no una memoria posterior.','announced','published',os.id,'inmaculado-corazon-maria-mision-2026','MISION-GLORIA-2026',p.name,p.name
from public.entities h join public.municipalities m on m.slug='sevilla' join public.places p on p.slug='parroquia-san-antonio-maria-claret-sevilla' join public.outing_series os on os.brotherhood_entity_id=h.id and os.outing_type='Procesión de gloria'
where h.slug='hermandad-de-la-mision-sevilla' and not exists(select 1 from public.outings o where o.slug='inmaculado-corazon-maria-mision-2026');

insert into public.outings(brotherhood_entity_id,outing_type,character,title,outing_date,year,departure_time,return_time,municipality_id,origin_place_id,destination_place_id,route_summary,route,description,public_notes,event_status,status,outing_series_id,slug,reference_code,origin_text,destination_text)
select h.id,'Procesión eucarística','ordinary','Procesión eucarística de La Misión 2026',date '2026-05-31',2026,time '10:15',time '12:05',m.id,p.id,p.id,
  'Parroquia de San Antonio María Claret · feligresía de Heliópolis · regreso a la Parroquia.',
  jsonb_build_object('itineraries',jsonb_build_array(jsonb_build_object('id','route','label','Recorrido','points',jsonb_build_array(
    jsonb_build_object('id','p01','role','start','label','Padre García Tejero'),jsonb_build_object('id','p02','role','stop','label','San Antonio María Claret'),jsonb_build_object('id','p03','role','stop','label','Torcuato Luca de Tena'),jsonb_build_object('id','p04','role','stop','label','Monzón'),jsonb_build_object('id','p05','role','stop','label','Levante'),jsonb_build_object('id','p06','role','stop','label','Reina Mercedes'),jsonb_build_object('id','p07','role','stop','label','Teba'),jsonb_build_object('id','p08','role','stop','label','Ensanche'),jsonb_build_object('id','p09','role','end','label','Padre García Tejero')
  )))),
  'Procesión de Jesús Sacramentado por la feligresía, convocada para el 31 de mayo de 2026.','El boletín oficial corrige la fecha genérica del calendario y fija el 31 de mayo. Se mantiene announced hasta localizar evidencia posterior.','announced','published',os.id,'la-mision-procesion-eucaristica-2026','MISION-EUCARISTICA-2026',p.name,p.name
from public.entities h join public.municipalities m on m.slug='sevilla' join public.places p on p.slug='parroquia-san-antonio-maria-claret-sevilla' join public.outing_series os on os.brotherhood_entity_id=h.id and os.outing_type='Procesión eucarística'
where h.slug='hermandad-de-la-mision-sevilla' and not exists(select 1 from public.outings o where o.slug='la-mision-procesion-eucaristica-2026');

with outing_entities_data(outing_slug,entity_slug,role,notes) as (
  values
    ('la-mision-estacion-penitencia-2026','santo-cristo-mision-sevilla','processional_image','Titular cristífero del paso de misterio.'),
    ('inmaculado-corazon-maria-mision-2026','inmaculado-corazon-maria-mision-sevilla','processional_image','Titular que preside la procesión de Gloria.'),
    ('la-mision-procesion-eucaristica-2026','santisimo-sacramento','honoree','Titular sacramental de la procesión eucarística.')
)
insert into public.outing_entities(outing_id,entity_id,role,notes)
select o.id,e.id,d.role,d.notes from outing_entities_data d join public.outings o on o.slug=d.outing_slug join public.entities e on e.slug=d.entity_slug
on conflict(outing_id,entity_id,role) do update set notes=excluded.notes;

with position_data(outing_slug,step_slug,position_code,position_label,sequence_no,notes) as (
  values
    ('la-mision-estacion-penitencia-2026',null::text,'opening_band','Tras la Cruz de Guía',1,'Banda de apertura de la cofradía.'),
    ('la-mision-estacion-penitencia-2026','paso-misterio-jesus-mision-sevilla','behind_mystery','Tras el paso de misterio',2,'Acompañamiento del único paso de la estación.'),
    ('inmaculado-corazon-maria-mision-2026','paso-inmaculado-corazon-maria-mision-sevilla','behind_glory','Tras el paso del Inmaculado Corazón de María',1,'Acompañamiento anunciado para la procesión de Gloria.')
)
insert into public.outing_music_positions(outing_id,step_entity_id,position_code,position_label,sequence_no,notes,status)
select o.id,st.id,d.position_code,d.position_label,d.sequence_no,d.notes,'published'
from position_data d join public.outings o on o.slug=d.outing_slug left join public.entities st on st.slug=d.step_slug
on conflict(outing_id,sequence_no) do update set step_entity_id=excluded.step_entity_id,position_code=excluded.position_code,position_label=excluded.position_label,notes=excluded.notes,status='published',updated_at=now();

with assignment_data(outing_slug,position_code,band_slug,notes) as (
  values
    ('la-mision-estacion-penitencia-2026','opening_band','banda-cornetas-tambores-sagrada-columna-azotes-las-cigarreras','Acompañó tras la Cruz de Guía en la estación celebrada de 2026.'),
    ('la-mision-estacion-penitencia-2026','behind_mystery','las-cigarreras','Acompañó al paso de misterio en la estación celebrada de 2026.'),
    ('inmaculado-corazon-maria-mision-2026','behind_glory','banda-de-musica-del-maestro-tejera','Acompañamiento anunciado para el itinerario completo de la procesión de Gloria.')
)
insert into public.outing_music_assignments(music_position_id,band_entity_id,participation_mode,sequence_no,notes,status)
select op.id,b.id,'full_route',1,d.notes,'published'
from assignment_data d join public.outings o on o.slug=d.outing_slug join public.outing_music_positions op on op.outing_id=o.id and op.position_code=d.position_code join public.entities b on b.slug=d.band_slug
where not exists(select 1 from public.outing_music_assignments oma where oma.music_position_id=op.id and oma.band_entity_id=b.id and oma.sequence_no=1);

-- Compatibilidad con el indicador técnico y las lecturas históricas de acompañamientos.
with accompaniment_data(outing_slug,step_slug,band_slug,position,notes) as (
  values
    ('la-mision-estacion-penitencia-2026',null::text,'banda-cornetas-tambores-sagrada-columna-azotes-las-cigarreras','Tras la Cruz de Guía','Acompañamiento celebrado en la estación de penitencia de 2026.'),
    ('la-mision-estacion-penitencia-2026','paso-misterio-jesus-mision-sevilla','las-cigarreras','Tras el paso de misterio','Acompañamiento celebrado en la estación de penitencia de 2026.'),
    ('inmaculado-corazon-maria-mision-2026','paso-inmaculado-corazon-maria-mision-sevilla','banda-de-musica-del-maestro-tejera','Tras el paso del Inmaculado Corazón de María','Acompañamiento anunciado para la procesión de Gloria de 2026.')
)
insert into public.accompaniments(outing_id,band_entity_id,step_entity_id,position,year,notes,status)
select o.id,b.id,st.id,d.position,2026,d.notes,'published'
from accompaniment_data d join public.outings o on o.slug=d.outing_slug join public.entities b on b.slug=d.band_slug left join public.entities st on st.slug=d.step_slug
where not exists(select 1 from public.accompaniments a where a.outing_id=o.id and a.band_entity_id=b.id and a.step_entity_id is not distinct from st.id and a.year=2026);

with outing_source_data(outing_slug,source_url,scope,notes) as (
  values
    ('la-mision-estacion-penitencia-2026','https://archicofradiamision.es/wp-content/uploads/2026/05/Boletin_Mayo2026.pdf','Salida celebrada · 2026','Memoria oficial posterior: participantes, horarios, música y celebración.'),
    ('inmaculado-corazon-maria-mision-2026','https://archicofradiamision.es/wp-content/uploads/2026/05/Boletin_Mayo2026.pdf','Salida anunciada · 2026','Fecha, horarios e itinerario publicados antes de la salida.'),
    ('inmaculado-corazon-maria-mision-2026','https://archicofradiamision.es/procesion-del-inmaculado-corazon-de-maria-2026/','Convocatoria oficial · 2026','Convocatoria oficial sin prueba posterior de celebración.'),
    ('la-mision-procesion-eucaristica-2026','https://archicofradiamision.es/wp-content/uploads/2026/05/Boletin_Mayo2026.pdf','Salida anunciada · 2026','Fecha corregida, horarios e itinerario publicados antes de la salida.')
)
insert into public.source_links(source_id,outing_id,scope,notes)
select s.id,o.id,d.scope,d.notes from outing_source_data d join public.sources s on s.url=d.source_url join public.outings o on o.slug=d.outing_slug
where not exists(select 1 from public.source_links sl where sl.source_id=s.id and sl.outing_id=o.id and sl.scope=d.scope);

with series_sources(outing_type,source_url) as (
  values
    ('Estación de penitencia','https://archicofradiamision.es/cofradia/'),
    ('Procesión de gloria','https://archicofradiamision.es/cofradia/'),
    ('Procesión eucarística','https://archicofradiamision.es/santisimo-sacramento/')
)
insert into public.source_links(source_id,outing_series_id,scope,notes)
select s.id,os.id,'Salida habitual','Periodicidad y carácter de la salida publicados por la Archicofradía.'
from series_sources d join public.sources s on s.url=d.source_url join public.outing_series os on os.brotherhood_entity_id=(select id from public.entities where slug='hermandad-de-la-mision-sevilla') and os.outing_type=d.outing_type
where not exists(select 1 from public.source_links sl where sl.source_id=s.id and sl.outing_series_id=os.id);

insert into public.source_links(source_id,outing_music_position_id,scope,notes)
select s.id,op.id,'Posición musical · salida 2026','Posición dentro del cortejo descrita por la memoria o convocatoria oficial.'
from public.outing_music_positions op join public.outings o on o.id=op.outing_id join public.sources s on s.url='https://archicofradiamision.es/wp-content/uploads/2026/05/Boletin_Mayo2026.pdf'
where o.brotherhood_entity_id=(select id from public.entities where slug='hermandad-de-la-mision-sevilla')
  and not exists(select 1 from public.source_links sl where sl.source_id=s.id and sl.outing_music_position_id=op.id);

insert into public.source_links(source_id,outing_music_assignment_id,scope,notes)
select s.id,oma.id,'Acompañamiento musical · salida 2026','Formación y posición documentadas para la edición correspondiente.'
from public.outing_music_assignments oma join public.outing_music_positions op on op.id=oma.music_position_id join public.outings o on o.id=op.outing_id join public.sources s on s.url='https://archicofradiamision.es/wp-content/uploads/2026/05/Boletin_Mayo2026.pdf'
where o.brotherhood_entity_id=(select id from public.entities where slug='hermandad-de-la-mision-sevilla')
  and not exists(select 1 from public.source_links sl where sl.source_id=s.id and sl.outing_music_assignment_id=oma.id);

-- Patrimonio estrenado en 2026. Las piezas pertenecen al titular, no se cuelgan de la corporación.
with asset_data(name,slug,asset_type,description,materials,historical_context,display_order) as (
  values
    ('Potencias del Santo Cristo de la Misión · 2026','potencias-santo-cristo-mision-2026','Potencias','Juego de potencias estrenado por el Santo Cristo de la Misión el Viernes de Dolores de 2026.','Orfebrería; material no especificado en la memoria consultada.','Donación de la familia Martín Laffitte.',10),
    ('Casquillos de la cruz del Santo Cristo de la Misión · 2026','casquillos-cruz-santo-cristo-mision-2026','Orfebrería','Juego de casquillos para la cruz del Santo Cristo de la Misión, estrenado el Viernes de Dolores de 2026.','Orfebrería; material no especificado en la memoria consultada.','Estreno patrimonial de la estación de penitencia de 2026.',20)
)
insert into public.entities(entity_type,name,slug,summary,status)
select 'heritage_asset',d.name,d.slug,d.description,'published' from asset_data d
where not exists(select 1 from public.entities e where e.slug=d.slug);

with asset_data(slug,asset_type,description,materials,historical_context,display_order) as (
  values
    ('potencias-santo-cristo-mision-2026','Potencias','Juego de potencias estrenado por el Santo Cristo de la Misión el Viernes de Dolores de 2026.','Orfebrería; material no especificado en la memoria consultada.','Donación de la familia Martín Laffitte.',10),
    ('casquillos-cruz-santo-cristo-mision-2026','Orfebrería','Juego de casquillos para la cruz del Santo Cristo de la Misión, estrenado el Viernes de Dolores de 2026.','Orfebrería; material no especificado en la memoria consultada.','Estreno patrimonial de la estación de penitencia de 2026.',20)
)
insert into public.heritage_assets(entity_id,parent_entity_id,asset_type,description,date_from_text,is_current,materials,historical_context,display_order,is_featured)
select e.id,cr.id,d.asset_type,d.description,'2026',true,d.materials,d.historical_context,d.display_order,true
from asset_data d join public.entities e on e.slug=d.slug join public.entities cr on cr.slug='santo-cristo-mision-sevilla'
on conflict(entity_id) do update set parent_entity_id=excluded.parent_entity_id,asset_type=excluded.asset_type,description=excluded.description,date_from_text=excluded.date_from_text,is_current=true,materials=excluded.materials,historical_context=excluded.historical_context,display_order=excluded.display_order,is_featured=excluded.is_featured;

insert into public.source_links(source_id,entity_id,scope,notes)
select s.id,e.id,'Patrimonio estrenado · 2026','Estreno y contexto publicados en la memoria oficial de la estación.'
from public.sources s join public.entities e on e.slug in ('potencias-santo-cristo-mision-2026','casquillos-cruz-santo-cristo-mision-2026')
where s.url='https://archicofradiamision.es/wp-content/uploads/2026/05/Boletin_Mayo2026.pdf'
  and not exists(select 1 from public.source_links sl where sl.source_id=s.id and sl.entity_id=e.id);

-- Trazabilidad granular de las cuatro imágenes titulares ya existentes.
with image_sources(image_slug,source_url) as (
  values
    ('inmaculado-corazon-maria-mision-sevilla','https://archicofradiamision.es/inmaculado-corazon-de-maria/'),
    ('santo-cristo-mision-sevilla','https://archicofradiamision.es/santo-cristo-de-la-mision/'),
    ('nuestra-senora-amparo-mision','https://archicofradiamision.es/nuestra-senora-del-amparo/'),
    ('san-juan-evangelista-mision-sevilla','https://archicofradiamision.es/san-juan-evangelista/')
)
insert into public.source_links(source_id,entity_id,scope,notes)
select s.id,i.id,'Titular · autoría y cronología','Ficha artística publicada por la Archicofradía.'
from image_sources d join public.sources s on s.url=d.source_url join public.entities i on i.slug=d.image_slug
where not exists(select 1 from public.source_links sl where sl.source_id=s.id and sl.entity_id=i.id and sl.scope='Titular · autoría y cronología');

do $$
declare
  h_id uuid := (select id from public.entities where slug='hermandad-de-la-mision-sevilla');
  completion integer;
begin
  if (select count(*) from public.entity_locations where entity_id=h_id and status='published' and is_current) <> 1 then raise exception 'La sede canónica relacional no quedó unívoca'; end if;
  if (select count(*) from public.brotherhood_images where brotherhood_entity_id=h_id and status='published') <> 4 then raise exception 'Los cuatro titulares visuales dejaron de ser unívocos'; end if;
  if (select count(*) from public.entity_relations where source_entity_id=h_id and relation_type='has_titular' and status='published' and target_entity_id in (select id from public.entities where slug in ('santisimo-sacramento','san-antonio-maria-claret'))) <> 2 then raise exception 'Las titularidades no visuales no quedaron relacionadas'; end if;
  if (select count(*) from public.brotherhood_steps where brotherhood_entity_id=h_id and status='published') <> 2 then raise exception 'Los pasos penitencial y de Gloria no quedaron publicados'; end if;
  if (select count(*) from public.cults where brotherhood_entity_id=h_id and status='published') <> 12 then raise exception 'Los doce cultos recurrentes no quedaron publicados'; end if;
  if (select count(*) from public.cult_occurrences co join public.cults c on c.id=co.cult_id where c.brotherhood_entity_id=h_id and co.year=2026 and co.status='published') <> 11 then raise exception 'Las once ocurrencias de 2026 no quedaron publicadas'; end if;
  if (select count(*) from public.outing_series where brotherhood_entity_id=h_id and status='published') <> 3 then raise exception 'Las tres salidas habituales no quedaron separadas'; end if;
  if (select count(*) from public.outings where brotherhood_entity_id=h_id and status='published') <> 3 then raise exception 'Las tres salidas de 2026 no quedaron publicadas'; end if;
  if exists(select 1 from public.outings o where o.brotherhood_entity_id=h_id and o.status='published' and not exists(select 1 from public.source_links sl where sl.outing_id=o.id)) then raise exception 'Existe una salida publicada sin Fuente'; end if;
  if (select count(*) from public.outing_music_assignments oma join public.outing_music_positions op on op.id=oma.music_position_id join public.outings o on o.id=op.outing_id where o.brotherhood_entity_id=h_id and oma.status='published') <> 3 then raise exception 'Las tres asignaciones musicales de 2026 no quedaron vinculadas'; end if;
  if (select count(*) from public.heritage_assets ha where ha.parent_entity_id=(select id from public.entities where slug='santo-cristo-mision-sevilla') and ha.entity_id in (select id from public.entities where slug in ('potencias-santo-cristo-mision-2026','casquillos-cruz-santo-cristo-mision-2026'))) <> 2 then raise exception 'Los dos estrenos patrimoniales no quedaron ligados al Cristo'; end if;
  if exists(select 1 from public.outings where brotherhood_entity_id=h_id and outing_date>date '2026-09-06' and event_status='held') then raise exception 'Existe una salida futura marcada como celebrada'; end if;
  if exists(select 1 from public.outings where brotherhood_entity_id=h_id and slug in ('inmaculado-corazon-maria-mision-2026','la-mision-procesion-eucaristica-2026') and event_status='held') then raise exception 'Una convocatoria sin memoria posterior se marcó como celebrada'; end if;
  select completion_percentage into completion from public.brotherhood_completeness where entity_id=h_id;
  if completion <> 100 then raise exception 'La ficha técnica de La Misión queda en % en vez de 100',completion; end if;
end $$;
