-- Hilo Cofrade · cierre documental avanzado de La Carretería
-- Corte editorial: 2026-09-06
-- Solo DML editorial. Sin DDL, nuevas tablas, RLS, arquitectura ni UX.

do $$
begin
  if (select count(*) from public.entities where slug = 'hermandad-de-la-carreteria' and entity_type = 'brotherhood') <> 1 then
    raise exception 'La ficha canónica de La Carretería no es unívoca';
  end if;
  if (select count(*) from public.brotherhood_steps bs join public.entities h on h.id = bs.brotherhood_entity_id where h.slug = 'hermandad-de-la-carreteria' and bs.status = 'published') <> 2 then
    raise exception 'La Carretería no conserva sus dos pasos publicados';
  end if;
end $$;

with source_data(name,url,source_type,publisher,publication_date,notes) as (
  values
    ('Carretería · Inicios','https://hermandaddelacarreteria.org/inicios/','Web oficial','Hermandad de la Carretería',null::date,'Origen tradicional de la corporación en los Húmeros de la Carretería.'),
    ('Carretería · Hospital de San Andrés','https://hermandaddelacarreteria.org/hospital-de-san-andres/','Web oficial','Hermandad de la Carretería',null::date,'Sede entre 1560 y 1587 y lugar de aprobación de las primeras Reglas.'),
    ('Carretería · Parroquia de San Miguel','https://hermandaddelacarreteria.org/parroquia-de-san-miguel/','Web oficial','Hermandad de la Carretería',null::date,'Sede histórica entre 1587 y 1592.'),
    ('Carretería · Iglesia de San Francisco de Paula','https://hermandaddelacarreteria.org/iglesia-de-san-francisco-de-paula/','Web oficial','Hermandad de la Carretería',null::date,'Sede histórica entre 1592 y 1761.'),
    ('Carretería · Capilla propia','https://hermandaddelacarreteria.org/capilla-de-la-carreteria/','Web oficial','Hermandad de la Carretería',null::date,'Capilla iniciada en 1753 y bendecida el 15 de agosto de 1761.'),
    ('Carretería · Insignias y enseres','https://hermandaddelacarreteria.org/insignias/','Web oficial','Hermandad de la Carretería',null::date,'Cruz de Guía, Senatus, Sinelabe, Libro de Reglas y otras insignias.'),
    ('Carretería · Boletín 171 · cultos 2026','https://hermandaddelacarreteria.org/boletin/171/files/basic-html/page45.html','Publicación oficial','Hermandad de la Carretería',date '2026-02-01','Convocatoria del Quinario y Vía Crucis de febrero de 2026.'),
    ('Carretería · Boletín 171 · memoria de cultos 2025','https://hermandaddelacarreteria.org/boletin/171/files/basic-html/page41.html','Publicación oficial','Hermandad de la Carretería',date '2026-02-01','Memoria del Triduo del Mayor Dolor, Resurrección y San Francisco de Paula.'),
    ('Consejo de Hermandades · nómina de la Semana Santa 2026','https://www.hermandades-de-sevilla.org/consejo/nomina-de-las-cofradias-de-la-semana-santa-de-sevilla-2026/','Fuente institucional','Consejo General de Hermandades y Cofradías de Sevilla',date '2026-03-01','Confirma la estación del Viernes Santo de 2026 y su salida a las 16:40.'),
    ('Sevilla Actualidad · itinerario de La Carretería 2026','https://www.sevillaactualidad.com/cofradias/590090-horario-y-recorrido-de-la-hermandad-de-la-carreteria-2026/','Prensa local','Sevilla Actualidad',date '2026-04-02','Horario e itinerario de la estación de penitencia del 3 de abril de 2026.'),
    ('Ayuntamiento de Sevilla · La Carretería en la calle 2026','https://www.facebook.com/AyuntamientodeSevilla/videos/1427855495241369/','Fuente institucional','Ayuntamiento de Sevilla',date '2026-04-03','Registro audiovisual municipal de la cofradía en la calle el Viernes Santo de 2026.'),
    ('Juan José Gómez, capataz del Mayor Dolor','https://alcalainformacion.com/2025/06/18/juan-jose-gomez-sera-el-nuevo-capataz-de-la-esperanza-en-alcala/','Prensa local','Alcalá Información',date '2025-06-18','Confirma la continuidad de Juan José Gómez Sánchez como capataz del Mayor Dolor desde 1993.')
)
insert into public.sources(name,url,source_type,author_or_publisher,publication_date,accessed_at,notes)
select name,url,source_type,publisher,publication_date,date '2026-09-06',notes
from source_data d where not exists (select 1 from public.sources s where s.url=d.url);

-- Sedes canónicas: se conserva el recorrido histórico sin confundirlo con la sede vigente.
with place_data(name,slug,place_type,address,notes) as (
  values
    ('Hospital de San Andrés de los Toneleros','hospital-san-andres-toneleros-sevilla','Hospital histórico','Calle Toneleros, Sevilla','Sede histórica de la corporación entre 1560 y 1587; el edificio no se conserva.'),
    ('Parroquia de San Miguel de Sevilla','parroquia-san-miguel-historica-sevilla','Parroquia histórica','Plaza del Duque, Sevilla','Sede histórica entre 1587 y 1592; templo desaparecido.'),
    ('Iglesia de San Francisco de Paula de Sevilla','iglesia-san-francisco-paula-historica-sevilla','Iglesia histórica','Calle Jesús del Gran Poder, Sevilla','Sede de la Archicofradía entre 1592 y 1761; el enclave corresponde al antiguo colegio de los Mínimos.')
)
insert into public.places(municipality_id,name,slug,place_type,address,notes)
select m.id,d.name,d.slug,d.place_type,d.address,d.notes
from place_data d cross join public.municipalities m
where m.slug='sevilla' and not exists(select 1 from public.places p where p.slug=d.slug);

with location_data(place_slug,date_from_text,date_to_text,is_current,notes,source_url) as (
  values
    ('hospital-san-andres-toneleros-sevilla','1560','1587',false,'Sede en la que fueron aprobadas las primeras Reglas de 1586.','https://hermandaddelacarreteria.org/hospital-de-san-andres/'),
    ('parroquia-san-miguel-historica-sevilla','1587','1592',false,'Traslado motivado por la reducción de hospitales.','https://hermandaddelacarreteria.org/parroquia-de-san-miguel/'),
    ('iglesia-san-francisco-paula-historica-sevilla','1592','1761',false,'Etapa vinculada al Colegio de los Mínimos.','https://hermandaddelacarreteria.org/iglesia-de-san-francisco-de-paula/'),
    ('capilla-mayor-dolor-carreteria-sevilla','1761',null::text,true,'Sede propia bendecida el 15 de agosto de 1761.','https://hermandaddelacarreteria.org/capilla-de-la-carreteria/')
), inserted as (
  insert into public.entity_locations(entity_id,place_id,municipality_id,location_type,date_from_text,date_to_text,is_current,notes,status)
  select h.id,p.id,m.id,case when d.is_current then 'Sede canónica' else 'Sede histórica' end,d.date_from_text,d.date_to_text,d.is_current,d.notes,'published'
  from location_data d join public.places p on p.slug=d.place_slug cross join public.entities h cross join public.municipalities m
  where h.slug='hermandad-de-la-carreteria' and m.slug='sevilla'
    and not exists(select 1 from public.entity_locations el where el.entity_id=h.id and el.place_id=p.id and el.location_type=case when d.is_current then 'Sede canónica' else 'Sede histórica' end)
  returning id,place_id
)
select count(*) from inserted;

with links as (
  select el.id,s.id source_id,case when el.is_current then 'Sede canónica vigente' else 'Sede histórica' end scope
  from public.entity_locations el join public.entities h on h.id=el.entity_id join public.places p on p.id=el.place_id
  join public.sources s on s.url=case p.slug
    when 'hospital-san-andres-toneleros-sevilla' then 'https://hermandaddelacarreteria.org/hospital-de-san-andres/'
    when 'parroquia-san-miguel-historica-sevilla' then 'https://hermandaddelacarreteria.org/parroquia-de-san-miguel/'
    when 'iglesia-san-francisco-paula-historica-sevilla' then 'https://hermandaddelacarreteria.org/iglesia-de-san-francisco-de-paula/'
    else 'https://hermandaddelacarreteria.org/capilla-de-la-carreteria/' end
  where h.slug='hermandad-de-la-carreteria' and p.slug in ('hospital-san-andres-toneleros-sevilla','parroquia-san-miguel-historica-sevilla','iglesia-san-francisco-paula-historica-sevilla','capilla-mayor-dolor-carreteria-sevilla')
)
insert into public.source_links(source_id,entity_location_id,scope,notes)
select source_id,id,scope,'Cronología publicada por la propia Hermandad.' from links l
where not exists(select 1 from public.source_links sl where sl.source_id=l.source_id and sl.entity_location_id=l.id);

-- Hábito penitencial.
insert into public.brotherhood_habits(brotherhood_entity_id,name,tunic_description,hood_description,cord_description,shield_description,footwear_description,sort_order,notes,status)
select h.id,'Hábito de nazareno','Túnica de terciopelo azul oscuro, con cola.','Antifaz de terciopelo azul oscuro.','Cíngulo dorado.','Cruz de Santiago bordada en el antifaz.','Guantes de piel negra; la fuente institucional no concreta el calzado.',1,'Configuración identificativa adoptada en 1886.','published'
from public.entities h where h.slug='hermandad-de-la-carreteria'
on conflict(brotherhood_entity_id,name) do update set tunic_description=excluded.tunic_description,hood_description=excluded.hood_description,cord_description=excluded.cord_description,shield_description=excluded.shield_description,footwear_description=excluded.footwear_description,notes=excluded.notes,status='published';

insert into public.source_links(source_id,brotherhood_habit_id,scope,notes)
select s.id,bh.id,'Hábito penitencial','Descripción institucional del hábito de nazareno.'
from public.sources s join public.brotherhood_habits bh on true join public.entities h on h.id=bh.brotherhood_entity_id
where s.url='https://www.hermandades-de-sevilla.org/semanasanta/vs_la_carreteria.html' and h.slug='hermandad-de-la-carreteria'
and not exists(select 1 from public.source_links sl where sl.source_id=s.id and sl.brotherhood_habit_id=bh.id);

-- Capataces: dos agentes distintos; no se reutiliza el nodo homónimo de Juan Manuel Gómez Sánchez.
insert into public.entities(entity_type,name,slug,summary,status)
select 'agent','Juan José Gómez Sánchez','juan-jose-gomez-sanchez-capataz','Capataz sevillano vinculado desde 1993 al paso de Nuestra Señora del Mayor Dolor en su Soledad de La Carretería.','published'
where not exists(select 1 from public.entities where slug='juan-jose-gomez-sanchez-capataz');
insert into public.agents(entity_id,agent_kind,municipality_id,description)
select a.id,'person',m.id,'Capataz del paso de palio de Nuestra Señora del Mayor Dolor en su Soledad.'
from public.entities a cross join public.municipalities m where a.slug='juan-jose-gomez-sanchez-capataz' and m.slug='sevilla'
on conflict(entity_id) do update set description=excluded.description;

with personnel(step_slug,agent_slug,role_name,year_from,notes) as (
  values
    ('paso-misterio-tres-necesidades-carreteria','juan-jose-cobos-rosales','Capataz',2026,'Responsable del paso de misterio en la nómina contemporánea consultada.'),
    ('paso-palio-mayor-dolor-carreteria','juan-jose-gomez-sanchez-capataz','Capataz',1993,'Responsable del paso de palio desde 1993; continuidad documentada en 2025 y en la ficha institucional vigente.')
)
insert into public.step_personnel_periods(step_entity_id,agent_entity_id,role_name,year_from,is_current,notes,status)
select st.id,a.id,d.role_name,d.year_from,true,d.notes,'published' from personnel d join public.entities st on st.slug=d.step_slug join public.entities a on a.slug=d.agent_slug
where not exists(select 1 from public.step_personnel_periods sp where sp.step_entity_id=st.id and sp.agent_entity_id=a.id and sp.role_name=d.role_name and sp.is_current);

with personnel_sources as (
  select sp.id,s.id source_id
  from public.step_personnel_periods sp join public.entities st on st.id=sp.step_entity_id join public.entities a on a.id=sp.agent_entity_id
  join public.sources s on s.url=case when a.slug='juan-jose-gomez-sanchez-capataz' then 'https://alcalainformacion.com/2025/06/18/juan-jose-gomez-sera-el-nuevo-capataz-de-la-esperanza-en-alcala/' else 'https://www.hermandades-de-sevilla.org/semanasanta/vs_la_carreteria.html' end
  where st.slug in ('paso-misterio-tres-necesidades-carreteria','paso-palio-mayor-dolor-carreteria') and sp.is_current
)
insert into public.source_links(source_id,step_personnel_period_id,scope,notes)
select source_id,id,'Capataz actual','Vinculación nominal con el paso correspondiente.' from personnel_sources x
where not exists(select 1 from public.source_links sl where sl.source_id=x.source_id and sl.step_personnel_period_id=x.id);

-- Cultos recurrentes. Las fechas anuales concretas solo viven en cult_occurrences.
with cult_data(image_slug,cult_type,title,date_rule,month,description,recurrence_label,display_order) as (
  values
    ('santisimo-cristo-salud-carreteria','Quinario','Solemne Quinario al Santísimo Cristo de la Salud y María Santísima de la Luz','Cinco días de febrero; fechas concretas según calendario anual',2::smallint,'Quinario con Rosario, ejercicio del Quinario y Santa Misa.','Anual · Cuaresma',10),
    ('santisimo-cristo-salud-carreteria','Función Principal','Función Principal de Instituto','Domingo posterior al Quinario',2::smallint,'Función Principal de Instituto de la Archicofradía.','Anual · tras el Quinario',20),
    ('santisimo-cristo-salud-carreteria','Veneración','Besapiés al Cristo de la Salud y Besamanos a María Santísima de la Luz','En Cuaresma; fecha concreta según calendario anual',3::smallint,'Veneración conjunta de los titulares del paso de misterio.','Anual · Cuaresma',30),
    ('nuestra-senora-mayor-dolor-soledad-carreteria','Triduo','Solemne Triduo a Nuestra Señora del Mayor Dolor en su Soledad','Tres días de mayo; fechas concretas según calendario anual',5::smallint,'Triduo anual y Jubileo Circular de las Cuarenta Horas.','Anual · mayo',40),
    ('nuestra-senora-mayor-dolor-soledad-carreteria','Besamanos','Besamanos a Nuestra Señora del Mayor Dolor en su Soledad','Después del Triduo de mayo',5::smallint,'Veneración anual de la titular dolorosa.','Anual · mayo',50),
    (null::text,'Misa Solemne','Misa en honor de la Gloriosa Resurrección de Nuestro Señor Jesucristo','Domingo de Resurrección',null::smallint,'Celebración eucarística de la Gloriosa Resurrección.','Anual · Domingo de Resurrección',60),
    (null::text,'Misa Solemne','Misa en honor de San Francisco de Paula','En torno a su festividad; fecha concreta según calendario anual',4::smallint,'Culto anual al titular incorporado durante la estancia en el Colegio de los Mínimos.','Anual · primavera',70),
    ('maria-santisima-luz-tres-necesidades-carreteria','Misa Solemne','Misa en honor de Nuestra Señora de la Luz en sus Misterios Gloriosos','8 de septiembre',9::smallint,'Misa anual en honor de la advocación fundacional de la Luz.','Cada 8 de septiembre',80)
)
insert into public.cults(brotherhood_entity_id,image_entity_id,cult_type,title,date_rule,month,place_id,description,status,is_recurring,recurrence_label,display_order,notes)
select h.id,i.id,d.cult_type,d.title,d.date_rule,d.month,p.id,d.description,'published',true,d.recurrence_label,d.display_order,'Regla estable contrastada en calendarios y boletines oficiales; no se proyectan horarios de una edición a otra.'
from cult_data d cross join public.entities h join public.places p on p.slug='capilla-mayor-dolor-carreteria-sevilla' left join public.entities i on i.slug=d.image_slug
where h.slug='hermandad-de-la-carreteria' and not exists(select 1 from public.cults c where c.brotherhood_entity_id=h.id and c.title=d.title and c.is_recurring);

insert into public.cult_occurrences(cult_id,year,start_date,end_date,place_id,description_override,event_status,status,notes)
select c.id,2026,date '2026-02-16',date '2026-02-20',p.id,'Quinario celebrado a las 20:15 h.','held','published','Edición 2026 documentada por el Boletín 171.'
from public.cults c join public.entities h on h.id=c.brotherhood_entity_id join public.places p on p.slug='capilla-mayor-dolor-carreteria-sevilla'
where h.slug='hermandad-de-la-carreteria' and c.title='Solemne Quinario al Santísimo Cristo de la Salud y María Santísima de la Luz'
and not exists(select 1 from public.cult_occurrences co where co.cult_id=c.id and co.year=2026);

with cult_links as (
  select c.id cult_id,s.id source_id
  from public.cults c join public.entities h on h.id=c.brotherhood_entity_id
  join public.sources s on s.url=case when c.display_order <= 30 then 'https://hermandaddelacarreteria.org/boletin/171/files/basic-html/page45.html' else 'https://hermandaddelacarreteria.org/boletin/171/files/basic-html/page41.html' end
  where h.slug='hermandad-de-la-carreteria'
)
insert into public.source_links(source_id,cult_id,scope,notes)
select source_id,cult_id,'Culto recurrente','Programación oficial de la Hermandad.' from cult_links x
where not exists(select 1 from public.source_links sl where sl.source_id=x.source_id and sl.cult_id=x.cult_id);

insert into public.source_links(source_id,cult_occurrence_id,scope,notes)
select s.id,co.id,'Quinario 2026','Fechas y horario publicados en el Boletín 171.'
from public.sources s join public.cults c on c.title='Solemne Quinario al Santísimo Cristo de la Salud y María Santísima de la Luz' join public.cult_occurrences co on co.cult_id=c.id and co.year=2026
where s.url='https://hermandaddelacarreteria.org/boletin/171/files/basic-html/page45.html'
and not exists(select 1 from public.source_links sl where sl.source_id=s.id and sl.cult_occurrence_id=co.id);

-- Salidas: serie penitencial, culto externo anual y edición celebrada de 2026.
with series_data(outing_type,title,month,date_rule,route_summary,description,display_order) as (
  values
    ('Estación de penitencia','Estación de penitencia del Viernes Santo',null::smallint,'Viernes Santo','Capilla de la Carretería · Carrera Oficial y Catedral · regreso a la Capilla.','Salida anual con el misterio de las Tres Necesidades y Nuestra Señora del Mayor Dolor en su Soledad.',1),
    ('Vía Crucis','Vía Crucis del Santísimo Cristo de la Salud',2::smallint,'Después del Quinario; fecha concreta según calendario anual','Capilla de la Carretería · Parroquia del Sagrario · regreso a la Capilla.','Culto externo anual con el Santísimo Cristo de la Salud.',2)
)
insert into public.outing_series(brotherhood_entity_id,outing_type,character,title,month,date_rule,municipality_id,origin_place_id,destination_place_id,route_summary,description,display_order,status,notes)
select h.id,d.outing_type,'ordinary',d.title,d.month,d.date_rule,m.id,p.id,case when d.outing_type='Vía Crucis' then ps.id else p.id end,d.route_summary,d.description,d.display_order,'published','Serie habitual; fecha, horario e itinerario detallado se documentan por edición.'
from series_data d cross join public.entities h cross join public.municipalities m join public.places p on p.slug='capilla-mayor-dolor-carreteria-sevilla' join public.places ps on ps.slug='parroquia-sagrario-catedral-sevilla'
where h.slug='hermandad-de-la-carreteria' and m.slug='sevilla'
and not exists(select 1 from public.outing_series os where os.brotherhood_entity_id=h.id and os.outing_type=d.outing_type and os.status<>'archived');

insert into public.outings(brotherhood_entity_id,outing_type,character,title,outing_date,year,departure_time,return_time,municipality_id,origin_place_id,destination_place_id,route_summary,route,description,event_status,status,outing_series_id,slug,reference_code,origin_text,destination_text)
select h.id,'Estación de penitencia','ordinary','Estación de penitencia de La Carretería 2026',date '2026-04-03',2026,time '16:40',time '22:15',m.id,p.id,p.id,
  'Capilla de la Carretería · Arenal · Carrera Oficial y Catedral · regreso a la Capilla.',
  jsonb_build_object('itineraries',jsonb_build_array(jsonb_build_object('id','route','label','Recorrido','points',jsonb_build_array(
    jsonb_build_object('id','p01','role','start','label','Real de la Carretería'),
    jsonb_build_object('id','p02','role','stop','label','Toneleros'),
    jsonb_build_object('id','p03','role','stop','label','Antonia Díaz'),
    jsonb_build_object('id','p04','role','stop','label','Arfe'),
    jsonb_build_object('id','p05','role','stop','label','Puerta del Arenal'),
    jsonb_build_object('id','p06','role','stop','label','Castelar'),
    jsonb_build_object('id','p07','role','stop','label','Gamazo'),
    jsonb_build_object('id','p08','role','stop','label','Joaquín Guichot'),
    jsonb_build_object('id','p09','role','stop','label','Barcelona'),
    jsonb_build_object('id','p10','role','stop','label','Plaza Nueva'),
    jsonb_build_object('id','p11','role','stop','label','Tetuán'),
    jsonb_build_object('id','p12','role','stop','label','Velázquez'),
    jsonb_build_object('id','p13','role','stop','label','O’Donnell'),
    jsonb_build_object('id','p14','role','stop','label','Carrera Oficial'),
    jsonb_build_object('id','p15','role','stop','label','Plaza del Triunfo'),
    jsonb_build_object('id','p16','role','stop','label','Santo Tomás'),
    jsonb_build_object('id','p17','role','stop','label','Adolfo Rodríguez Jurado'),
    jsonb_build_object('id','p18','role','stop','label','Santander'),
    jsonb_build_object('id','p19','role','stop','label','Temprado'),
    jsonb_build_object('id','p20','role','stop','label','Dos de Mayo'),
    jsonb_build_object('id','p21','role','stop','label','Rodo'),
    jsonb_build_object('id','p22','role','end','label','Real de la Carretería')
  )))),
  'Estación de penitencia celebrada el Viernes Santo de 2026 con los dos pasos de la corporación.','held','published',os.id,'estacion-penitencia-carreteria-2026','CARRETERIA-EP-2026',p.name,p.name
from public.entities h cross join public.municipalities m join public.places p on p.slug='capilla-mayor-dolor-carreteria-sevilla' join public.outing_series os on os.brotherhood_entity_id=h.id and os.outing_type='Estación de penitencia'
where h.slug='hermandad-de-la-carreteria' and m.slug='sevilla' and not exists(select 1 from public.outings o where o.slug='estacion-penitencia-carreteria-2026');

insert into public.outings(brotherhood_entity_id,outing_type,character,title,outing_date,year,departure_time,municipality_id,origin_place_id,destination_place_id,route_summary,description,event_status,status,outing_series_id,slug,reference_code,origin_text,destination_text)
select h.id,'Vía Crucis','ordinary','Vía Crucis del Santísimo Cristo de la Salud 2026',date '2026-02-21',2026,time '19:00',m.id,p.id,ps.id,'Capilla de la Carretería · Parroquia del Sagrario · regreso a la Capilla.','Culto externo celebrado tras el Quinario de 2026.','held','published',os.id,'via-crucis-cristo-salud-carreteria-2026','CARRETERIA-VC-2026',p.name,ps.name
from public.entities h cross join public.municipalities m join public.places p on p.slug='capilla-mayor-dolor-carreteria-sevilla' join public.places ps on ps.slug='parroquia-sagrario-catedral-sevilla' join public.outing_series os on os.brotherhood_entity_id=h.id and os.outing_type='Vía Crucis'
where h.slug='hermandad-de-la-carreteria' and m.slug='sevilla' and not exists(select 1 from public.outings o where o.slug='via-crucis-cristo-salud-carreteria-2026');

-- El Vía Crucis del Consejo de 2010 estaba documentado pero permanecía artificialmente en borrador.
update public.outings set municipality_id=(select id from public.municipalities where slug='sevilla'),origin_place_id=(select id from public.places where slug='capilla-mayor-dolor-carreteria-sevilla'),origin_text='Capilla de Nuestra Señora del Mayor Dolor',destination_place_id=(select id from public.places where slug='parroquia-sagrario-catedral-sevilla'),destination_text='Santa Iglesia Catedral de Sevilla',status='published',updated_at=now()
where slug='via-crucis-consejo-2010-hermandad-de-la-carreteria';

with outing_entities_data(outing_slug,entity_slug,role,notes) as (
  values
    ('estacion-penitencia-carreteria-2026','santisimo-cristo-salud-carreteria','processional_image','Titular cristífero del paso de misterio.'),
    ('estacion-penitencia-carreteria-2026','maria-santisima-luz-tres-necesidades-carreteria','processional_image','Titular mariana del paso de misterio.'),
    ('estacion-penitencia-carreteria-2026','nuestra-senora-mayor-dolor-soledad-carreteria','processional_image','Titular del paso de palio.'),
    ('via-crucis-cristo-salud-carreteria-2026','santisimo-cristo-salud-carreteria','processional_image','Imagen que presidió el culto externo.'),
    ('via-crucis-consejo-2010-hermandad-de-la-carreteria','santisimo-cristo-salud-carreteria','processional_image','Imagen que presidió el Vía Crucis del Consejo de 2010.')
)
insert into public.outing_entities(outing_id,entity_id,role,notes)
select o.id,e.id,d.role,d.notes from outing_entities_data d join public.outings o on o.slug=d.outing_slug join public.entities e on e.slug=d.entity_slug
on conflict(outing_id,entity_id,role) do update set notes=excluded.notes;

with positions(step_slug,position_code,position_label,sequence_no) as (
  values ('paso-misterio-tres-necesidades-carreteria','mystery','Tras el paso de misterio',1),('paso-palio-mayor-dolor-carreteria','palio','Tras el paso de palio',2)
)
insert into public.outing_music_positions(outing_id,step_entity_id,position_code,position_label,sequence_no,notes,status)
select o.id,st.id,d.position_code,d.position_label,d.sequence_no,'Acompañamiento de la estación de penitencia de 2026.','published'
from positions d join public.outings o on o.slug='estacion-penitencia-carreteria-2026' join public.entities st on st.slug=d.step_slug
on conflict(outing_id,sequence_no) do update set step_entity_id=excluded.step_entity_id,position_code=excluded.position_code,position_label=excluded.position_label,notes=excluded.notes,status='published';

with assignments(position_code,band_slug) as (
  values ('mystery','las-cigarreras'),('palio','banda-musica-julian-cerdan-sanlucar')
)
insert into public.outing_music_assignments(music_position_id,band_entity_id,participation_mode,sequence_no,notes,status)
select op.id,b.id,'full_route',1,'Acompañamiento musical documentado para la edición de 2026.','published'
from assignments d join public.outing_music_positions op on op.position_code=d.position_code join public.outings o on o.id=op.outing_id and o.slug='estacion-penitencia-carreteria-2026' join public.entities b on b.slug=d.band_slug
where not exists(select 1 from public.outing_music_assignments oma where oma.music_position_id=op.id and oma.band_entity_id=b.id and oma.sequence_no=1);

-- Compatibilidad con el indicador técnico y las consultas históricas que aún leen accompaniments.
with accompaniment_data(step_slug,band_slug,position) as (
  values
    ('paso-misterio-tres-necesidades-carreteria','las-cigarreras','Tras el paso de misterio'),
    ('paso-palio-mayor-dolor-carreteria','banda-musica-julian-cerdan-sanlucar','Tras el paso de palio')
)
insert into public.accompaniments(outing_id,band_entity_id,step_entity_id,position,year,notes,status)
select o.id,b.id,st.id,d.position,2026,'Acompañamiento de la estación de penitencia de 2026.','published'
from accompaniment_data d join public.outings o on o.slug='estacion-penitencia-carreteria-2026' join public.entities b on b.slug=d.band_slug join public.entities st on st.slug=d.step_slug
where not exists(select 1 from public.accompaniments a where a.outing_id=o.id and a.band_entity_id=b.id and a.step_entity_id=st.id and a.year=2026);

with outing_links as (
  select o.id outing_id,s.id source_id,'Edición 2026' scope
  from public.outings o join public.sources s on s.url=case when o.slug='via-crucis-cristo-salud-carreteria-2026' then 'https://hermandaddelacarreteria.org/boletin/171/files/basic-html/page45.html' else 'https://www.hermandades-de-sevilla.org/consejo/nomina-de-las-cofradias-de-la-semana-santa-de-sevilla-2026/' end
  where o.slug in ('estacion-penitencia-carreteria-2026','via-crucis-cristo-salud-carreteria-2026')
)
insert into public.source_links(source_id,outing_id,scope,notes)
select source_id,outing_id,scope,'Fecha y carácter de la salida.' from outing_links x where not exists(select 1 from public.source_links sl where sl.source_id=x.source_id and sl.outing_id=x.outing_id);

insert into public.source_links(source_id,outing_id,scope,notes)
select s.id,o.id,'Celebración e itinerario 2026','Registro posterior de celebración y recorrido publicado.' from public.sources s join public.outings o on o.slug='estacion-penitencia-carreteria-2026'
where s.url in ('https://www.sevillaactualidad.com/cofradias/590090-horario-y-recorrido-de-la-hermandad-de-la-carreteria-2026/','https://www.facebook.com/AyuntamientodeSevilla/videos/1427855495241369/')
and not exists(select 1 from public.source_links sl where sl.source_id=s.id and sl.outing_id=o.id);

with series_links as (
  select os.id series_id,s.id source_id
  from public.outing_series os join public.entities h on h.id=os.brotherhood_entity_id join public.sources s on s.url=case when os.outing_type='Vía Crucis' then 'https://hermandaddelacarreteria.org/boletin/171/files/basic-html/page45.html' else 'https://www.hermandades-de-sevilla.org/semanasanta/vs_la_carreteria.html' end
  where h.slug='hermandad-de-la-carreteria'
)
insert into public.source_links(source_id,outing_series_id,scope,notes)
select source_id,series_id,'Salida habitual','Periodicidad y carácter de la salida.' from series_links x where not exists(select 1 from public.source_links sl where sl.source_id=x.source_id and sl.outing_series_id=x.series_id);

-- Patrimonio: los elementos integrados en cada paso dependen de ese Paso, no de la Hermandad.
with asset_data(parent_slug,name,slug,asset_type,description,date_from_text,technique,materials,historical_context,display_order,is_featured,source_url) as (
  values
    ('paso-misterio-tres-necesidades-carreteria','Candelabros de forja del paso de misterio','candelabros-forja-misterio-carreteria','Iluminación','Conjunto de seis candelabros con 44 luces y guardabrisas.','1844','Forja y plateado','Hierro plateado','Proceden del paso estrenado en 1844 y continúan en el paso actual.',10,true,'https://hermandaddelacarreteria.org/paso-del-sagrado-misterio/'),
    ('paso-misterio-tres-necesidades-carreteria','Angelotes pasionistas del paso de misterio','angelotes-pasionistas-misterio-carreteria','Imaginería secundaria','Cuatro angelotes de las esquinas portan clavos, flagelos, esponja y lanza.','Siglo XVII','Talla y policromía','Madera tallada y policromada','Relacionados por la Hermandad con el contrato del conjunto de 1677.',20,true,'https://hermandaddelacarreteria.org/paso-del-sagrado-misterio/'),
    ('paso-palio-mayor-dolor-carreteria','Peana de plata del paso de palio','peana-plata-palio-carreteria','Orfebrería','Peana de plata de ley con medallón dorado de la Resurrección.','1999','Orfebrería','Plata de ley','Obra de Orfebrería Maestrante integrada en el paso de palio.',10,true,'https://hermandaddelacarreteria.org/paso-de-palio/'),
    ('paso-palio-mayor-dolor-carreteria','Respiraderos y maniguetas del paso de palio','respiraderos-maniguetas-palio-carreteria','Orfebrería','Respiraderos y maniguetas de plata según diseño de José Asián Cano.','2001','Orfebrería','Plata de ley','Conjunto realizado por Orfebrería Triana.',20,true,'https://hermandaddelacarreteria.org/paso-de-palio/'),
    ('hermandad-de-la-carreteria','Cruz de Guía de La Carretería','cruz-guia-carreteria-1700','Insignia','Cruz de caoba revestida con motivos vegetales y placas de plata.','1700','Carpintería y orfebrería','Madera de caoba y plata','La Hermandad la identifica como la Cruz de Guía más antigua conservada entre las cofradías que hacen estación a la Catedral.',10,true,'https://hermandaddelacarreteria.org/insignias/'),
    ('hermandad-de-la-carreteria','Sinelabe de La Carretería','sinelabe-carreteria-1861','Insignia','Banda de terciopelo azul marino bordada en oro con la leyenda Sinelabe Concepta.','1861','Bordado en oro','Terciopelo azul marino e hilo de oro','Bordado por Teresa del Castillo y donado por los Duques de Montpensier.',20,true,'https://hermandaddelacarreteria.org/insignias/'),
    ('hermandad-de-la-carreteria','Libro de Reglas de La Carretería','libro-reglas-carreteria-1749','Documento patrimonial','Libro de Reglas con cubierta de plata, marfil y carey.','1749','Encuadernación y orfebrería','Plata de ley, marfil y carey','Conserva ilustraciones históricas de la Resurrección y el Calvario.',30,true,'https://hermandaddelacarreteria.org/insignias/')
)
insert into public.entities(entity_type,name,slug,summary,status)
select 'heritage_asset',d.name,d.slug,d.description,'published' from asset_data d where not exists(select 1 from public.entities e where e.slug=d.slug);

with asset_data(parent_slug,slug,asset_type,description,date_from_text,technique,materials,historical_context,display_order,is_featured) as (
  values
    ('paso-misterio-tres-necesidades-carreteria','candelabros-forja-misterio-carreteria','Iluminación','Conjunto de seis candelabros con 44 luces y guardabrisas.','1844','Forja y plateado','Hierro plateado','Proceden del paso estrenado en 1844 y continúan en el paso actual.',10,true),
    ('paso-misterio-tres-necesidades-carreteria','angelotes-pasionistas-misterio-carreteria','Imaginería secundaria','Cuatro angelotes de las esquinas portan clavos, flagelos, esponja y lanza.','Siglo XVII','Talla y policromía','Madera tallada y policromada','Relacionados por la Hermandad con el contrato del conjunto de 1677.',20,true),
    ('paso-palio-mayor-dolor-carreteria','peana-plata-palio-carreteria','Orfebrería','Peana de plata de ley con medallón dorado de la Resurrección.','1999','Orfebrería','Plata de ley','Obra de Orfebrería Maestrante integrada en el paso de palio.',10,true),
    ('paso-palio-mayor-dolor-carreteria','respiraderos-maniguetas-palio-carreteria','Orfebrería','Respiraderos y maniguetas de plata según diseño de José Asián Cano.','2001','Orfebrería','Plata de ley','Conjunto realizado por Orfebrería Triana.',20,true),
    ('hermandad-de-la-carreteria','cruz-guia-carreteria-1700','Insignia','Cruz de caoba revestida con motivos vegetales y placas de plata.','1700','Carpintería y orfebrería','Madera de caoba y plata','La Hermandad la identifica como la Cruz de Guía más antigua conservada entre las cofradías que hacen estación a la Catedral.',10,true),
    ('hermandad-de-la-carreteria','sinelabe-carreteria-1861','Insignia','Banda de terciopelo azul marino bordada en oro con la leyenda Sinelabe Concepta.','1861','Bordado en oro','Terciopelo azul marino e hilo de oro','Bordado por Teresa del Castillo y donado por los Duques de Montpensier.',20,true),
    ('hermandad-de-la-carreteria','libro-reglas-carreteria-1749','Documento patrimonial','Libro de Reglas con cubierta de plata, marfil y carey.','1749','Encuadernación y orfebrería','Plata de ley, marfil y carey','Conserva ilustraciones históricas de la Resurrección y el Calvario.',30,true)
)
insert into public.heritage_assets(entity_id,parent_entity_id,asset_type,description,date_from_text,is_current,technique,materials,historical_context,display_order,is_featured)
select e.id,p.id,d.asset_type,d.description,d.date_from_text,true,d.technique,d.materials,d.historical_context,d.display_order,d.is_featured
from asset_data d join public.entities e on e.slug=d.slug join public.entities p on p.slug=d.parent_slug
on conflict(entity_id) do update set parent_entity_id=excluded.parent_entity_id,asset_type=excluded.asset_type,description=excluded.description,date_from_text=excluded.date_from_text,is_current=true,technique=excluded.technique,materials=excluded.materials,historical_context=excluded.historical_context,display_order=excluded.display_order,is_featured=excluded.is_featured;

with asset_sources as (
  select e.id entity_id,s.id source_id
  from public.entities e join public.heritage_assets ha on ha.entity_id=e.id join public.entities p on p.id=ha.parent_entity_id
  join public.sources s on s.url=case when p.slug='paso-misterio-tres-necesidades-carreteria' then 'https://hermandaddelacarreteria.org/paso-del-sagrado-misterio/' when p.slug='paso-palio-mayor-dolor-carreteria' then 'https://hermandaddelacarreteria.org/paso-de-palio/' else 'https://hermandaddelacarreteria.org/insignias/' end
  where e.slug in ('candelabros-forja-misterio-carreteria','angelotes-pasionistas-misterio-carreteria','peana-plata-palio-carreteria','respiraderos-maniguetas-palio-carreteria','cruz-guia-carreteria-1700','sinelabe-carreteria-1861','libro-reglas-carreteria-1749')
)
insert into public.source_links(source_id,entity_id,scope,notes)
select source_id,entity_id,'Patrimonio','Descripción publicada por la Hermandad.' from asset_sources x
where not exists(select 1 from public.source_links sl where sl.source_id=x.source_id and sl.entity_id=x.entity_id);

-- Reconciliación de borradores heredados sin borrar historia.
update public.brotherhood_images set status='archived',notes=coalesce(notes||' ','')||'Duplicado editorial sustituido por el nodo canónico publicado.' where id='db20dcd9-e4ed-4da9-a252-2f1354cbd2e0' and status='draft';
update public.entities set status='archived',updated_at=now() where slug='nuestra-senora-del-mayor-dolor-en-su-soledad-carreteria' and status='draft';
update public.entity_relations set status='published' where id in ('4bb96a1d-294c-4446-883c-bdbfcc23359d','4c8290d1-878b-4dae-8db8-5760c18674c2') and status='draft';

-- Fuente general de ficha para conservar el indicador técnico sin confundirlo con la trazabilidad granular.
insert into public.source_links(source_id,entity_id,scope,notes)
select s.id,h.id,'Ficha institucional','Identidad, historia, hábito, capataces y música.' from public.sources s cross join public.entities h
where s.url='https://www.hermandades-de-sevilla.org/semanasanta/vs_la_carreteria.html' and h.slug='hermandad-de-la-carreteria'
and not exists(select 1 from public.source_links sl where sl.source_id=s.id and sl.entity_id=h.id);

do $$
declare
  h_id uuid := (select id from public.entities where slug='hermandad-de-la-carreteria');
  completion integer;
begin
  if (select count(*) from public.entity_locations where entity_id=h_id and status='published') <> 4 then raise exception 'La cronología de sedes de La Carretería no quedó completa'; end if;
  if (select count(*) from public.brotherhood_images where brotherhood_entity_id=h_id and status='published') <> 3 then raise exception 'El núcleo de titulares publicado contiene duplicados o ausencias'; end if;
  if (select count(*) from public.cults where brotherhood_entity_id=h_id and status='published') <> 8 then raise exception 'Los ocho ciclos de culto no quedaron publicados'; end if;
  if (select count(*) from public.outing_series where brotherhood_entity_id=h_id and status='published') <> 2 then raise exception 'Las salidas habituales no quedaron separadas'; end if;
  if (select count(*) from public.outings where brotherhood_entity_id=h_id and status='published') < 3 then raise exception 'Las salidas documentadas siguen incompletas'; end if;
  if (select count(*) from public.step_personnel_periods sp join public.brotherhood_steps bs on bs.step_entity_id=sp.step_entity_id where bs.brotherhood_entity_id=h_id and sp.status='published' and sp.is_current) <> 2 then raise exception 'Los dos capataces actuales no quedaron vinculados'; end if;
  if (select count(*) from public.heritage_assets ha where ha.parent_entity_id=h_id or ha.parent_entity_id in (select step_entity_id from public.brotherhood_steps where brotherhood_entity_id=h_id)) <> 8 then raise exception 'El inventario patrimonial nuclear no quedó completo'; end if;
  if exists(select 1 from public.outings o where o.brotherhood_entity_id=h_id and o.status='published' and not exists(select 1 from public.source_links sl where sl.outing_id=o.id)) then raise exception 'Existe una salida publicada sin Fuente'; end if;
  select completion_percentage into completion from public.brotherhood_completeness where entity_id=h_id;
  if completion <> 100 then raise exception 'La ficha técnica de La Carretería queda en % en vez de 100',completion; end if;
end $$;
