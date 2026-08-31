-- Patrimonio musical de San Benito.
-- Alcance: 86 marchas procesionales documentadas por la Hermandad.
-- Las 9 piezas de capilla/coplas quedan fuera deliberadamente hasta disponer
-- de una entidad musical más amplia que Marcha.

create temporary table _hc_sb_m(
  k integer primary key,
  name text not null,
  year integer not null,
  music_type text not null,
  input_slug text
) on commit drop;

insert into _hc_sb_m(k,name,year,music_type) values
(1,'Presentación',1974,'Agrupación Musical'),
(2,'Sagrada Presentación',1990,'Agrupación Musical'),
(3,'Jesús al Pueblo',1993,'Agrupación Musical'),
(4,'Sangre de Cristo',1993,'Agrupación Musical'),
(5,'Costaleros de Dios',1994,'Agrupación Musical'),
(6,'Jesús Sacramentado',1994,'Agrupación Musical'),
(7,'Presentación y trabajadera',1994,'Agrupación Musical'),
(8,'Sangre y costal',1994,'Agrupación Musical'),
(9,'Presentado a Sevilla',1996,'Agrupación Musical'),
(10,'Reina de la Calzada',1998,'Agrupación Musical'),
(11,'Reina y Madre, Encarnación',1999,'Agrupación Musical'),
(12,'A los pies de Sor Ángela',2000,'Agrupación Musical'),
(13,'Señor de la Calzá',2000,'Agrupación Musical'),
(14,'… y en la Calzá lo presentaron',2000,'Agrupación Musical'),
(15,'Presentación en San Benito',2001,'Agrupación Musical'),
(16,'Costaleros de Fe',2002,'Agrupación Musical'),
(17,'Himno al Santísimo Cristo de la Sangre',2002,'Agrupación Musical'),
(18,'Jesús de la Presentación',2003,'Agrupación Musical'),
(19,'Rabí de Galilea',2004,'Agrupación Musical'),
(20,'Encarnación',2006,'Agrupación Musical'),
(21,'Y Contigo hasta el Cielo',2007,'Agrupación Musical'),
(22,'Martes Santo en la Calzá',2008,'Agrupación Musical'),
(23,'Por Pilato condenado',2008,'Agrupación Musical'),
(24,'Un costal y una faja… de penitencia',2008,'Agrupación Musical'),
(25,'Sagrada Presentación',2010,'Agrupación Musical'),
(26,'Arriba el Hijo de Dios',2012,'Agrupación Musical'),
(27,'Hermanos de Sangre',2012,'Agrupación Musical'),
(28,'Padre mío de la Presentación',2012,'Agrupación Musical'),
(29,'Pasión en la Calzá',2013,'Agrupación Musical'),
(30,'Entregado a su Pueblo',2014,'Agrupación Musical'),
(31,'Oriente de Sevilla',2015,'Agrupación Musical'),
(32,'La condena de un Inocente',2015,'Agrupación Musical'),
(33,'Hijos de la Encarnación',2017,'Agrupación Musical'),
(34,'Encarnación de Plata',2019,'Agrupación Musical'),
(35,'La Elección',2020,'Agrupación Musical'),
(36,'¡Crucifícalo!',2024,'Agrupación Musical'),
(37,'En las tinieblas de mis dudas',2026,'Agrupación Musical'),
(38,'El Stmo. Cristo de la Sangre',1966,'Cornetas y Tambores'),
(39,'Cristo de la Presentación',1969,'Cornetas y Tambores'),
(40,'Presentación al Pueblo',1989,'Cornetas y Tambores'),
(41,'Cristo de la Sangre',1993,'Cornetas y Tambores'),
(42,'Sangre',1995,'Cornetas y Tambores'),
(43,'Plaza de Pilatos',1999,'Cornetas y Tambores'),
(44,'Llora Sevilla',2001,'Cornetas y Tambores'),
(45,'Amén',2001,'Cornetas y Tambores'),
(46,'Aniversario',2002,'Cornetas y Tambores'),
(47,'Al Santísimo Cristo de la Sangre',2002,'Cornetas y Tambores'),
(48,'Señor de la Presentación',2003,'Cornetas y Tambores'),
(49,'Costaleros de tu Sangre',2004,'Cornetas y Tambores'),
(50,'Al Cristo de la Calzá',2005,'Cornetas y Tambores'),
(51,'Dormido en tu Cruz',2007,'Cornetas y Tambores'),
(52,'Derramando su Sangre',2008,'Cornetas y Tambores'),
(53,'Mi Hermandad',2012,'Cornetas y Tambores'),
(54,'Sangre de mi Sangre',2014,'Cornetas y Tambores'),
(55,'Ave María Encarnación',2019,'Cornetas y Tambores'),
(56,'Sheli ata da’m',2019,'Cornetas y Tambores'),
(57,'Sangre Redentora',2020,'Cornetas y Tambores'),
(58,'La Sangre del Justo',2021,'Cornetas y Tambores'),
(59,'El Pacto de Sangre',2024,'Cornetas y Tambores'),
(60,'Jesús ante el Pueblo',1951,'Banda de Música'),
(61,'Virgen de la Encarnación',1968,'Banda de Música'),
(62,'Nuestra Señora de la Encarnación',1971,'Banda de Música'),
(63,'Cristo de la Sangre',1972,'Banda de Música'),
(64,'Presentación de Jesús al Pueblo',1980,'Banda de Música'),
(65,'Encarnación de la Calzada',1983,'Banda de Música'),
(66,'Cristo de la Presentación',1984,'Banda de Música'),
(67,'Madre de la Encarnación',1985,'Banda de Música'),
(68,'Encarnación Coronada',1994,'Banda de Música'),
(69,'Coronación en la Calzada',1994,'Banda de Música'),
(70,'Coronación',1994,'Banda de Música'),
(71,'El Ángel te corona',1996,'Banda de Música'),
(72,'Bajo tu mirada',2002,'Banda de Música'),
(73,'Costaleros de San Benito',2002,'Banda de Música'),
(74,'Aquella Paloma…',2003,'Banda de Música'),
(75,'Palomita de Triana',2004,'Banda de Música'),
(76,'Reina de la Calzá',2005,'Banda de Música'),
(77,'Jesús ante el Pueblo (Adaptación)',2008,'Banda de Música'),
(78,'Reina de la Encarnación',2013,'Banda de Música'),
(79,'Reina y Madre de la Encarnación',2016,'Banda de Música'),
(80,'Encarnación',2017,'Banda de Música'),
(81,'XXV Aniversario Encarnación',2019,'Banda de Música'),
(82,'A tus pies, Encarnación',2019,'Banda de Música'),
(83,'Nuestra Señora de la Encarnación. Lo efímero',2019,'Banda de Música'),
(84,'Himno Coronación (Adaptación)',2022,'Banda de Música'),
(85,'Encarnación Soberana',2024,'Banda de Música'),
(86,'Soberana Encarnación',2025,'Banda de Música');

update _hc_sb_m
set input_slug = 'marcha-' ||
  trim(both '-' from regexp_replace(
    translate(lower(name),'áéíóúüñ','aeiouun'),
    '[^a-z0-9]+','-','g'
  )) || '-' ||
  case music_type
    when 'Agrupación Musical' then 'am'
    when 'Cornetas y Tambores' then 'ct'
    else 'bm'
  end || '-' || year::text;

create temporary table _hc_sb_a(
  march_k integer not null,
  author_name text not null,
  author_role text not null,
  agent_kind text not null
) on commit drop;

insert into _hc_sb_a(march_k,author_name,author_role,agent_kind) values
(1,'José Martín Martín','composer','person'),
(2,'Francisco del Toro Zamora','composer','person'),
(3,'Manuel Rodríguez Ruiz','composer','person'),
(4,'Manuel Herrera Raya','composer','person'),
(5,'Pascual González Moreno','composer','person'),
(6,'Antonio José López Escalante','composer','person'),
(7,'Manuel Rodríguez Ruiz','composer','person'),
(8,'Juan Ramón Rivera Fe','composer','person'),
(8,'Antonio José López Escalante','composer','person'),
(9,'Antonio José López Escalante','composer','person'),
(10,'Rafael Vázquez Mateo','composer','person'),
(10,'Luis Tovar Morilla','composer','person'),
(11,'Francisco David Álvarez Barroso','composer','person'),
(12,'Francisco David Álvarez Barroso','composer','person'),
(13,'Juan Brachi Domínguez','composer','person'),
(13,'Francisco David Álvarez Barroso','composer','person'),
(14,'Pedro Manuel Pacheco Palomo','composer','person'),
(15,'Juan Manuel Martínez Lara','composer','person'),
(15,'Jesús Gómez Rodríguez','composer','person'),
(16,'Javier Calvo Gaviño','composer','person'),
(17,'Francisco David Álvarez Barroso','composer','person'),
(18,'Francisco David Álvarez Barroso','composer','person'),
(19,'Vicente Chazeta Doblas','composer','person'),
(19,'Javier Calvo Gaviño','composer','person'),
(20,'Francisco David Álvarez Barroso','composer','person'),
(21,'José Manuel Mena Hervás','composer','person'),
(22,'Emilio Muñoz Serna','composer','person'),
(23,'Francisco José Carrasco Benítez','composer','person'),
(24,'Juan Luis del Valle','composer','person'),
(25,'Francisco David Álvarez Barroso','composer','person'),
(26,'Antonio José López Escalante','composer','person'),
(27,'Javier Calvo Gaviño','composer','person'),
(28,'Francisco Ortiz Morón','composer','person'),
(29,'Manuel Jesús Guerrero Marín','composer','person'),
(30,'José Manuel Mena Hervás','composer','person'),
(31,'Miguel Ángel Font Morgado','composer','person'),
(32,'Antonio Moreno Pozo','composer','person'),
(33,'Francisco David Álvarez Barroso','composer','person'),
(34,'Francisco Javier Torres Simón','composer','person'),
(35,'Alberto González Ponce','composer','person'),
(36,'Cristóbal López Gándara','composer','person'),
(37,'Cristóbal López Gándara','composer','person'),
(38,'Alberto Escámez','composer','person'),
(38,'Policía Armada','adapter','institution'),
(39,'Juan Manuel Gómez Sánchez','composer','person'),
(40,'José Antonio Herrera Solís','composer','person'),
(40,'Pedro Manuel Pacheco Palomo','composer','person'),
(41,'José Albero Francés','composer','person'),
(42,'Pedro Manuel Pacheco Palomo','composer','person'),
(43,'José Ramón Pérez Soto','composer','person'),
(44,'Pedro Manuel Pacheco Palomo','composer','person'),
(45,'Pedro Manuel Pacheco Palomo','composer','person'),
(46,'Pedro Manuel Pacheco Palomo','composer','person'),
(47,'Antonio José López Escalante','composer','person'),
(48,'Juan Manuel Gómez Sánchez','composer','person'),
(49,'Sergio Pérez Rodríguez','composer','person'),
(50,'José Manuel Reina Romero','composer','person'),
(50,'Rafael Vázquez Mateo','composer','person'),
(51,'Juan Manuel Gómez Sánchez','composer','person'),
(52,'David Álvarez García','composer','person'),
(53,'Francisco Javier González Ríos','composer','person'),
(54,'Cristopher Jiménez Cabeza','composer','person'),
(54,'Jonathan Jiménez Cabeza','composer','person'),
(55,'Francisco Javier González Ríos','composer','person'),
(56,'Francisco Javier González Ríos','composer','person'),
(57,'Francisco David Álvarez Barroso','composer','person'),
(58,'Antonio J. Caparros Ridao','composer','person'),
(59,'Abraham Padilla Consuegra','composer','person'),
(60,'Manuel Mejías Pérez','composer','person'),
(61,'José Campano Bravo','composer','person'),
(62,'Pedro Braña Martínez','composer','person'),
(63,'José Campano Bravo','composer','person'),
(64,'José Pinto Sánchez','composer','person'),
(65,'Juan de los Santos Sánchez','composer','person'),
(66,'Abel Moreno Gómez','composer','person'),
(67,'Manuel Torres Díez','composer','person'),
(68,'Abel Moreno Gómez','composer','person'),
(69,'Pascual González Moreno','composer','person'),
(70,'Eliseo Capel Paricio','composer','person'),
(71,'Juan de los Santos Sánchez','composer','person'),
(72,'Carlos Jiménez García','composer','person'),
(73,'Francisco José Escobar Lamas','composer','person'),
(74,'Pedro Manuel Pacheco Palomo','composer','person'),
(75,'Francisco José Escobar Lamas','composer','person'),
(76,'Javier Calvo Gaviño','composer','person'),
(77,'Arturo Barea Tejada','adapter','person'),
(77,'José Manuel Toscano','adapter','person'),
(78,'Ignacio Borrego González','composer','person'),
(79,'Carlos Guillén González','composer','person'),
(80,'Cristóbal López Gándara','composer','person'),
(81,'Abel Moreno Gómez','composer','person'),
(82,'Pablo Perea Garrido','composer','person'),
(83,'José Manuel Franco Gómez','composer','person'),
(84,'Francisco José Escobar Lamas','adapter','person'),
(85,'Jesús Jiménez Palma','composer','person'),
(86,'Daniel Albarrán Acosta','composer','person');

create temporary table _hc_sb_mr(
  k integer primary key,
  entity_id uuid not null
) on commit drop;

insert into _hc_sb_mr(k,entity_id)
select distinct on (i.k) i.k,e.id
from _hc_sb_m i
join public.entities e
  on e.entity_type='march'
 and lower(trim(e.name))=lower(trim(i.name))
join public.marches m
  on m.entity_id=e.id
 and m.composition_year=i.year
order by i.k,e.created_at;

insert into public.entities(entity_type,name,slug,summary,status)
select 'march',i.name,i.input_slug,
       'Composición del archivo musical de la Hermandad de San Benito.',
       'published'
from _hc_sb_m i
where not exists(select 1 from _hc_sb_mr r where r.k=i.k)
on conflict(slug) do nothing;

insert into _hc_sb_mr(k,entity_id)
select i.k,e.id
from _hc_sb_m i
join public.entities e on e.slug=i.input_slug
where not exists(select 1 from _hc_sb_mr r where r.k=i.k);

insert into public.marches(
  entity_id,composition_year,composition_date_text,music_type,
  description,eligible_for_daily,daily_priority,notes
)
select r.entity_id,i.year,i.year::text,i.music_type,
       'Composición incluida por la Hermandad de San Benito en su archivo musical oficial.',
       false,0,
       'Clasificación musical y año tomados del Archivo musical oficial de la Hermandad de San Benito.'
from _hc_sb_m i
join _hc_sb_mr r on r.k=i.k
where not exists(select 1 from public.marches m where m.entity_id=r.entity_id);

create temporary table _hc_sb_ar(
  author_name text primary key,
  entity_id uuid not null
) on commit drop;

insert into _hc_sb_ar(author_name,entity_id)
select distinct on (a.author_name) a.author_name,e.id
from (select distinct author_name from _hc_sb_a) a
join public.entities e
  on e.entity_type='agent'
 and lower(trim(e.name))=lower(trim(a.author_name))
join public.agents ag on ag.entity_id=e.id
order by a.author_name,e.created_at;

insert into public.entities(entity_type,name,slug,summary,status)
select 'agent',a.author_name,
       trim(both '-' from regexp_replace(
         translate(lower(a.author_name),'áéíóúüñ','aeiouun'),
         '[^a-z0-9]+','-','g'
       )),
       case when a.agent_kind='institution'
         then 'Entidad relacionada con la autoría o adaptación musical.'
         else 'Autor vinculado al patrimonio musical documentado de San Benito.'
       end,
       'published'
from (
  select distinct on (author_name) author_name,agent_kind
  from _hc_sb_a
  order by author_name,agent_kind
) a
where not exists(select 1 from _hc_sb_ar r where r.author_name=a.author_name)
on conflict(slug) do nothing;

insert into _hc_sb_ar(author_name,entity_id)
select a.author_name,e.id
from (select distinct author_name from _hc_sb_a) a
join public.entities e
  on e.slug=trim(both '-' from regexp_replace(
    translate(lower(a.author_name),'áéíóúüñ','aeiouun'),
    '[^a-z0-9]+','-','g'
  ))
where not exists(select 1 from _hc_sb_ar r where r.author_name=a.author_name);

insert into public.agents(entity_id,agent_kind)
select distinct r.entity_id,a.agent_kind
from _hc_sb_a a
join _hc_sb_ar r on r.author_name=a.author_name
where not exists(select 1 from public.agents ag where ag.entity_id=r.entity_id);

insert into public.agent_names(agent_entity_id,name,name_type,is_current,notes)
select r.entity_id,a.author_name,'official',true,
       'Nombre incorporado desde el Archivo musical oficial de la Hermandad de San Benito.'
from (select distinct author_name from _hc_sb_a) a
join _hc_sb_ar r on r.author_name=a.author_name
where not exists(
  select 1 from public.agent_names n
  where n.agent_entity_id=r.entity_id
    and lower(trim(n.name))=lower(trim(a.author_name))
);

insert into public.march_authors(
  march_entity_id,agent_entity_id,author_role,notes,status
)
select mr.entity_id,ar.entity_id,a.author_role,
       case when a.author_role='adapter'
         then 'Responsabilidad de adaptación indicada por la fuente oficial.'
         else 'Autoría indicada por la fuente oficial.'
       end,
       'published'
from _hc_sb_a a
join _hc_sb_mr mr on mr.k=a.march_k
join _hc_sb_ar ar on ar.author_name=a.author_name
on conflict(march_entity_id,agent_entity_id,author_role) do nothing;

insert into public.march_dedications(
  march_entity_id,dedicatee_entity_id,dedication_type,
  dedication_text,date_from_text,notes,status
)
select r.entity_id,b.id,'dedicated_to',
       'Composición incluida por la Hermandad de San Benito en su Archivo musical como obra dedicada a sus titulares.',
       i.year::text,
       'La fuente oficial agrupa la composición dentro del patrimonio musical dedicado a los titulares de la Hermandad; no se infiere un titular concreto cuando la página no lo explicita.',
       'published'
from _hc_sb_m i
join _hc_sb_mr r on r.k=i.k
join public.entities b on b.slug='san-benito' and b.entity_type='brotherhood'
on conflict(march_entity_id,dedicatee_entity_id,dedication_type) do nothing;

insert into public.sources(
  name,url,source_type,author_or_publisher,accessed_at,notes
)
select v.name,v.url,'Web oficial','Hermandad de San Benito','2026-08-21'::date,
       'Fuente oficial del Archivo musical de la Hermandad de San Benito.'
from (values
  ('Archivo musical · Hermandad de San Benito','https://hermandaddesanbenito.net/archivo-musical/'),
  ('Archivo musical · Agrupaciones musicales · San Benito','https://hermandaddesanbenito.net/agrupaciones-musicales/'),
  ('Archivo musical · Cornetas y tambores · San Benito','https://hermandaddesanbenito.net/banda-de-cornetas-y-tambores/'),
  ('Archivo musical · Banda de música · San Benito','https://hermandaddesanbenito.net/banda-de-musica/')
) v(name,url)
where not exists(select 1 from public.sources s where s.url=v.url);

insert into public.source_links(source_id,entity_id,scope,notes)
select s.id,b.id,'Patrimonio musical',
       'La Hermandad presenta su archivo musical como conjunto de composiciones dedicadas a sus titulares.'
from public.sources s
join public.entities b on b.slug='san-benito' and b.entity_type='brotherhood'
where s.url='https://hermandaddesanbenito.net/archivo-musical/'
  and not exists(
    select 1 from public.source_links sl
    where sl.source_id=s.id and sl.entity_id=b.id
  );

insert into public.source_links(source_id,entity_id,scope,notes)
select s.id,r.entity_id,'Título, autoría, año y clasificación musical',
       'Registro documentado en la sección correspondiente del Archivo musical oficial.'
from _hc_sb_m i
join _hc_sb_mr r on r.k=i.k
join public.sources s on s.url=case i.music_type
  when 'Agrupación Musical' then 'https://hermandaddesanbenito.net/agrupaciones-musicales/'
  when 'Cornetas y Tambores' then 'https://hermandaddesanbenito.net/banda-de-cornetas-y-tambores/'
  else 'https://hermandaddesanbenito.net/banda-de-musica/'
end
where not exists(
  select 1 from public.source_links sl
  where sl.source_id=s.id and sl.entity_id=r.entity_id
);

insert into public.source_links(source_id,march_dedication_id,scope,notes)
select s.id,d.id,'Dedicación a los titulares de San Benito',
       'La inclusión en el Archivo musical oficial documenta su pertenencia al patrimonio musical dedicado a los titulares de la Hermandad.'
from _hc_sb_m i
join _hc_sb_mr r on r.k=i.k
join public.sources s on s.url=case i.music_type
  when 'Agrupación Musical' then 'https://hermandaddesanbenito.net/agrupaciones-musicales/'
  when 'Cornetas y Tambores' then 'https://hermandaddesanbenito.net/banda-de-cornetas-y-tambores/'
  else 'https://hermandaddesanbenito.net/banda-de-musica/'
end
join public.entities b on b.slug='san-benito' and b.entity_type='brotherhood'
join public.march_dedications d
  on d.march_entity_id=r.entity_id
 and d.dedicatee_entity_id=b.id
 and d.dedication_type='dedicated_to'
where not exists(
  select 1 from public.source_links sl
  where sl.source_id=s.id and sl.march_dedication_id=d.id
);

insert into public.source_links(source_id,agent_name_id,scope,notes)
select distinct s.id,n.id,'Nombre citado como autor o adaptador',
       'Nombre documentado en la sección correspondiente del Archivo musical oficial.'
from _hc_sb_a a
join _hc_sb_m i on i.k=a.march_k
join _hc_sb_ar ar on ar.author_name=a.author_name
join public.agent_names n
  on n.agent_entity_id=ar.entity_id
 and lower(trim(n.name))=lower(trim(a.author_name))
join public.sources s on s.url=case i.music_type
  when 'Agrupación Musical' then 'https://hermandaddesanbenito.net/agrupaciones-musicales/'
  when 'Cornetas y Tambores' then 'https://hermandaddesanbenito.net/banda-de-cornetas-y-tambores/'
  else 'https://hermandaddesanbenito.net/banda-de-musica/'
end
where not exists(
  select 1 from public.source_links sl
  where sl.source_id=s.id and sl.agent_name_id=n.id
);
