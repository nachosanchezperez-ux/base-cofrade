-- Hilo Cofrade · cierre avanzado de Consolación de Osuna
-- Corte editorial: 2026-09-06
-- Solo DML editorial. Sin DDL, RLS, arquitectura ni UX.
-- La cronología de la imagen se conserva como discutida entre catálogo BIC y tradición local.

with source_data(name,url,source_type,publisher,publication_date,notes) as (
 values
 ('Consejo Diocesano · Hermandad de Nuestra Señora de Consolación, Patrona de Osuna','https://www.cofradiasyhermandades.es/fichacofradia-COFRADIAS-Osuna-Consolacion-eGNOaGVrTXFoRGxGdzE2Y2RCU252UT09','Institucional','Consejo Diocesano para las Hermandades y Cofradías de la Archidiócesis de Sevilla',null::date,'Fundación en 1624 y sede canónica.'),
 ('Nuestra Señora de Consolación · Ayuntamiento de Osuna','https://www.osuna.es/es/turismo/conoce-osuna/osuna-en-fiestas/ntra.-sra.-de-consolacion/','Fuente institucional','Ayuntamiento de Osuna',null::date,'Patronazgo desde 1624, procesión anual y tradición local sobre la procedencia de la imagen.'),
 ('Iglesia de Nuestra Señora de Consolación · Ayuntamiento de Osuna','https://www.osuna.es/es/turismo/que-ver/monumentos/iglesias/iglesia-de-ntra.-sra.-de-consolacion/','Fuente institucional','Ayuntamiento de Osuna',null::date,'Descripción del templo y de la imagen de vestir que preside el retablo mayor.'),
 ('BOE · BIC Iglesia de Nuestra Señora de Consolación de Osuna','https://boe.es/diario_boe/txt.php?id=BOE-A-2002-688','Institucional','Boletín Oficial del Estado',date '2002-01-11','Catálogo BIC: Nuestra Señora de la Consolación, madera y pigmentos, imagen de vestir, anónima, anterior a 1400 y reformada en el siglo XVII.'),
 ('El Pespunte · Actos de la Vela de Consolación 2026','https://www.elpespunte.es/articulo/cofrade/son-actos-vela-consolacion-2026-osuna-viernes-dia-patrona/20260904164950149406.html','Prensa especializada','El Pespunte',date '2026-09-04','Programa 2026: Función Principal, salida, 24 costaleros, equipo de capataces y Banda Villa de Osuna.'),
 ('Osuna prepara sus Fiestas Patronales 2026','https://www.diarioavanza.es/provincia/osuna/osuna-prepara-fiestas-patronales-nueve-dias-actividades-honor-virgen-consolacion/20260831141850026048.html','Prensa local','Diario Avanza',date '2026-08-31','Novena 2026 del 30 de agosto al 7 de septiembre y programa de cultos.'),
 ('Convenio con la Banda de Música Villa de Osuna','https://www.osuna.es/es/cultura/noticias/El-Ayuntamiento-de-Osuna-firma-con-la-Banda-de-Musica-Villa-de-Osuna-un-nuevo-convenio-de-colaboracion/','Web institucional','Ayuntamiento de Osuna',date '2025-12-23','Convenio municipal de cuatro años que incluye la procesión de Nuestra Señora de Consolación.'),
 ('Arte Sacro · Procesión de Nuestra Señora de Consolación de Osuna 2017','https://www.artesacro.org/Noticia/Ver/119424/provincia-osuna-acompano-su-patrona-nuestra-senora-consolacion-su-gloriosa','Prensa especializada','Arte Sacro',date '2017-09-08','Describe el paso con peana y respiraderos de plata y cuatro candelabros de guardabrisas.'),
 ('Canal Sur · IV Centenario del Patronazgo de Consolación en Osuna','https://www.canalsur.es/rtva/comunicacion/patrona-osuna-sevilla-protagonista-misa_1_1303233.html','Medio público','Canal Sur RTVA',date '2024-11-24','Clausura de los actos del IV centenario del patronazgo y constancia de la procesión desde 1624.')
)
insert into sources(name,url,source_type,author_or_publisher,publication_date,accessed_at,notes)
select name,url,source_type,publisher,publication_date,date '2026-09-06',notes from source_data d
where not exists (select 1 from sources s where s.url=d.url);

insert into places(municipality_id,name,slug,place_type,address,notes)
select m.id,'Iglesia Parroquial de Nuestra Señora de Consolación','iglesia-parroquial-consolacion-osuna','Parroquia','Plaza de la Consolación, 1, 41640 Osuna, Sevilla','Sede canónica y social de la Hermandad de Nuestra Señora de Consolación, Patrona de Osuna.'
from municipalities m where m.slug='osuna'
and not exists (select 1 from places where slug='iglesia-parroquial-consolacion-osuna');

update entities set name='Hermandad de Nuestra Señora de Consolación, Patrona de Osuna',summary='Hermandad de Gloria fundada en 1624 en torno a Nuestra Señora de Consolación, Patrona de Osuna, con salida anual cada 8 de septiembre.',updated_at=now() where slug='consolacion-osuna';
update brotherhoods set official_name='Hermandad de Nuestra Señora de Consolación, Patrona de Osuna',popular_name='Consolación de Osuna',foundation_text='1624',canonical_see_place_id=(select id from places where slug='iglesia-parroquial-consolacion-osuna'),history_text='La Hermandad y el patronazgo de Nuestra Señora de Consolación sobre Osuna se documentan desde 1624. La tradición municipal vincula la imagen a una llegada desde Inglaterra en el siglo XVI, mientras el catálogo BIC publicado en el BOE la fecha como obra anónima anterior a 1400 reformada en el siglo XVII; ambas capas se conservan sin forzar una síntesis no demostrada.' where entity_id=(select id from entities where slug='consolacion-osuna');

insert into entities(entity_type,name,slug,summary,status)
select 'image','Nuestra Señora de Consolación','nuestra-senora-consolacion-osuna','Imagen de vestir de Nuestra Señora de Consolación, Patrona de Osuna. El catálogo BIC la fecha anterior a 1400 con reforma en el siglo XVII; la tradición local la vincula al siglo XVI.','published'
where not exists (select 1 from entities where slug='nuestra-senora-consolacion-osuna');
insert into images(entity_id,image_type,execution_date_text,material,technique,current_condition,description,iconography,anatomical_type,is_dress_image,current_state_notes)
select i.id,'Virgen de Gloria','Anterior a 1400 según el catálogo BIC; tradición local vinculada al siglo XVI','Madera policromada','Tallado y policromado','extant','Imagen de vestir de Nuestra Señora de Consolación, de 0,80 m según el catálogo BIC, venerada en el retablo mayor de su parroquia.','Virgen de Consolación','Imagen de vestir',true,'Cronología discutida entre la catalogación BIC y la tradición local; no se fija una fecha única.' from entities i where i.slug='nuestra-senora-consolacion-osuna'
on conflict(entity_id) do update set image_type=excluded.image_type,execution_date_text=excluded.execution_date_text,material=excluded.material,technique=excluded.technique,current_condition=excluded.current_condition,description=excluded.description,iconography=excluded.iconography,anatomical_type=excluded.anatomical_type,is_dress_image=excluded.is_dress_image,current_state_notes=excluded.current_state_notes;
insert into image_authorships(image_entity_id,agent_entity_id,authorship_type,role_name,date_from_text,certainty,notes,status)
select i.id,null,'anonymous','Autor desconocido','Cronología discutida','unknown','El catálogo BIC mantiene la autoría como anónima.','published' from entities i where i.slug='nuestra-senora-consolacion-osuna'
and not exists(select 1 from image_authorships ia where ia.image_entity_id=i.id and ia.authorship_type='anonymous');
insert into brotherhood_images(brotherhood_entity_id,image_entity_id,relation_type,date_from_text,notes,status)
select h.id,i.id,'Titular','Patrona desde 1624','Titular mariana y Patrona de Osuna.','published' from entities h join entities i on i.slug='nuestra-senora-consolacion-osuna' where h.slug='consolacion-osuna'
and not exists(select 1 from brotherhood_images bi where bi.brotherhood_entity_id=h.id and bi.image_entity_id=i.id);
insert into entity_locations(entity_id,place_id,municipality_id,location_type,date_from_text,is_current,notes,status)
select i.id,p.id,m.id,'Culto habitual','Actual',true,'La imagen preside el retablo mayor de la Parroquia de Nuestra Señora de Consolación.','published' from entities i join places p on p.slug='iglesia-parroquial-consolacion-osuna' join municipalities m on m.slug='osuna' where i.slug='nuestra-senora-consolacion-osuna'
and not exists(select 1 from entity_locations el where el.entity_id=i.id and el.place_id=p.id and el.is_current);

insert into entities(entity_type,name,slug,summary,status)
select 'step','Paso de Nuestra Señora de Consolación de Osuna','paso-nuestra-senora-consolacion-osuna','Paso de Gloria de la Patrona de Osuna, con peana y respiraderos de plata y cuatro candelabros de guardabrisas.','published'
where not exists(select 1 from entities where slug='paso-nuestra-senora-consolacion-osuna');
insert into steps(entity_id,step_type,current_condition,description,current_state_notes)
select st.id,'Paso de Gloria','preserved','Paso procesional con peana y respiraderos de plata y cuatro candelabros de guardabrisas en las esquinas.','Para 2026 se anuncian 24 costaleros. No se fija autoría o fecha completa del conjunto sin fuente unívoca.' from entities st where st.slug='paso-nuestra-senora-consolacion-osuna'
on conflict(entity_id) do update set step_type=excluded.step_type,current_condition=excluded.current_condition,description=excluded.description,current_state_notes=excluded.current_state_notes;
insert into brotherhood_steps(brotherhood_entity_id,step_entity_id,relation_type,date_from_text,notes,status)
select h.id,st.id,'Paso procesional','Actual','Paso de la salida gloriosa anual del 8 de septiembre.','published' from entities h join entities st on st.slug='paso-nuestra-senora-consolacion-osuna' where h.slug='consolacion-osuna'
and not exists(select 1 from brotherhood_steps bs where bs.brotherhood_entity_id=h.id and bs.step_entity_id=st.id);
insert into image_steps(image_entity_id,step_entity_id,relation_type,date_from_text,notes,status)
select i.id,st.id,'Procesiona en','Actual','La Patrona procesiona en este paso.','published' from entities i join entities st on st.slug='paso-nuestra-senora-consolacion-osuna' where i.slug='nuestra-senora-consolacion-osuna'
and not exists(select 1 from image_steps x where x.image_entity_id=i.id and x.step_entity_id=st.id);

insert into entities(entity_type,name,slug,summary,status)
select 'band','Banda de Música Villa de Osuna','banda-musica-villa-osuna','Formación musical de Osuna vinculada mediante convenio municipal a la procesión de Nuestra Señora de Consolación.','published'
where not exists(select 1 from entities where slug='banda-musica-villa-osuna');
insert into bands(entity_id,band_type,municipality_id,description)
select b.id,'Banda de Música',m.id,'Formación musical de Osuna. El convenio municipal vigente desde diciembre de 2025 incluye la procesión de Nuestra Señora de Consolación entre sus actuaciones.' from entities b join municipalities m on m.slug='osuna' where b.slug='banda-musica-villa-osuna'
on conflict(entity_id) do update set band_type=excluded.band_type,municipality_id=excluded.municipality_id,description=excluded.description;
insert into music_accompaniment_periods(brotherhood_entity_id,band_entity_id,step_entity_id,position,outing_type,year_from,year_to,is_current,notes,status)
select h.id,b.id,st.id,'Tras el paso','Procesión de Gloria',2025,2028,true,'Vigencia derivada del convenio municipal de cuatro años firmado el 23 de diciembre de 2025, que incluye expresamente la procesión de Nuestra Señora de Consolación. No se presenta como contrato directo de la Hermandad.','published'
from entities h join entities b on b.slug='banda-musica-villa-osuna' join entities st on st.slug='paso-nuestra-senora-consolacion-osuna' where h.slug='consolacion-osuna'
and not exists(select 1 from music_accompaniment_periods mp where mp.brotherhood_entity_id=h.id and mp.band_entity_id=b.id and mp.step_entity_id=st.id and mp.position='Tras el paso' and mp.year_from=2025);

with cult_data as (
 select * from (values
 ('Novena','Solemne Novena a Nuestra Señora de Consolación','Del 30 de agosto al 7 de septiembre',8::smallint,'Nueve jornadas de culto previas a la festividad patronal del 8 de septiembre.','30 de agosto–7 de septiembre',10),
 ('Función Principal','Función Principal de Instituto','8 de septiembre, antes de la salida procesional',9::smallint,'Función Principal de Instituto en la festividad de la Patrona.','Cada 8 de septiembre',20)
 ) d(cult_type,title,date_rule,month,description,recurrence_label,display_order)
)
insert into cults(brotherhood_entity_id,image_entity_id,cult_type,title,date_rule,month,place_id,description,status,is_recurring,recurrence_label,display_order,notes)
select h.id,i.id,d.cult_type,d.title,d.date_rule,d.month,p.id,d.description,'published',true,d.recurrence_label,d.display_order,'Regla recurrente documentada por la programación contemporánea.' from cult_data d join entities h on h.slug='consolacion-osuna' join entities i on i.slug='nuestra-senora-consolacion-osuna' join places p on p.slug='iglesia-parroquial-consolacion-osuna'
where not exists(select 1 from cults c where c.brotherhood_entity_id=h.id and c.title=d.title and c.is_recurring);
insert into cult_occurrences(cult_id,year,start_date,end_date,place_id,event_status,status,notes)
select c.id,2026,date '2026-08-30',date '2026-09-07',p.id,'announced','published','Novena 2026 en curso en la fecha de auditoría.' from cults c join places p on p.slug='iglesia-parroquial-consolacion-osuna' where c.brotherhood_entity_id=(select id from entities where slug='consolacion-osuna') and c.title='Solemne Novena a Nuestra Señora de Consolación'
and not exists(select 1 from cult_occurrences co where co.cult_id=c.id and co.year=2026 and co.start_date=date '2026-08-30');
insert into cult_occurrences(cult_id,year,start_date,end_date,place_id,event_status,status,notes)
select c.id,2026,date '2026-09-08',date '2026-09-08',p.id,'announced','published','Función Principal anunciada a las 19:00 h.' from cults c join places p on p.slug='iglesia-parroquial-consolacion-osuna' where c.brotherhood_entity_id=(select id from entities where slug='consolacion-osuna') and c.title='Función Principal de Instituto'
and not exists(select 1 from cult_occurrences co where co.cult_id=c.id and co.year=2026 and co.start_date=date '2026-09-08');

with people(name,slug) as (values ('Francisco José Hidalgo Humanes','francisco-jose-hidalgo-humanes'),('Manuel Ortega Domínguez','manuel-ortega-dominguez'),('José Ignacio Gutiérrez Díaz','jose-ignacio-gutierrez-diaz'))
insert into entities(entity_type,name,slug,summary,status)
select 'agent',name,slug,'Miembro del equipo de capataces y auxiliares anunciado para la procesión de Consolación de Osuna en 2026.','published' from people p where not exists(select 1 from entities e where e.slug=p.slug);
with people(slug) as (values ('francisco-jose-hidalgo-humanes'),('manuel-ortega-dominguez'),('jose-ignacio-gutierrez-diaz'))
insert into agents(entity_id,agent_kind,municipality_id,description)
select e.id,'person',m.id,'Integrante del equipo de capataces y auxiliares de la procesión de Nuestra Señora de Consolación de Osuna en 2026.' from people p join entities e on e.slug=p.slug join municipalities m on m.slug='osuna'
where not exists(select 1 from agents a where a.entity_id=e.id);
with people(slug) as (values ('francisco-jose-hidalgo-humanes'),('manuel-ortega-dominguez'),('jose-ignacio-gutierrez-diaz'))
insert into step_personnel_periods(step_entity_id,agent_entity_id,role_name,year_from,year_to,is_current,notes,status)
select st.id,e.id,'Equipo de capataces y auxiliares',2026,2026,true,'Integrante del equipo anunciado para la procesión patronal de 2026; la fuente no desglosa el rol exacto de cada nombre.','published' from people p join entities e on e.slug=p.slug join entities st on st.slug='paso-nuestra-senora-consolacion-osuna'
where not exists(select 1 from step_personnel_periods spp where spp.step_entity_id=st.id and spp.agent_entity_id=e.id and spp.year_from=2026);

update outings set origin_place_id=(select id from places where slug='iglesia-parroquial-consolacion-osuna'),destination_place_id=(select id from places where slug='iglesia-parroquial-consolacion-osuna') where slug='osuna-consolacion-2026-09-08';
insert into outing_entities(outing_id,entity_id,role,notes)
select o.id,i.id,'processional_image','Titular que preside la procesión patronal de 2026.' from outings o join entities i on i.slug='nuestra-senora-consolacion-osuna' where o.slug='osuna-consolacion-2026-09-08'
on conflict(outing_id,entity_id,role) do update set notes=excluded.notes;
update outing_music_positions set step_entity_id=(select id from entities where slug='paso-nuestra-senora-consolacion-osuna') where outing_id=(select id from outings where slug='osuna-consolacion-2026-09-08') and position_label='Tras el paso';
update outing_music_assignments set band_entity_id=(select id from entities where slug='banda-musica-villa-osuna') where music_position_id in (select id from outing_music_positions where outing_id=(select id from outings where slug='osuna-consolacion-2026-09-08')) and band_name_text='Banda de Música Villa de Osuna';

with event_data(slug,name,event_type,event_date,event_date_text,description) as (
 values
 ('patronazgo-consolacion-osuna-1624','Patronazgo de Nuestra Señora de Consolación sobre Osuna','Patronazgo',null::date,'1624','Nuestra Señora de Consolación es Patrona de Osuna desde 1624.'),
 ('iv-centenario-patronazgo-consolacion-osuna-2024','IV Centenario del Patronazgo de Nuestra Señora de Consolación','Efeméride',date '2024-11-24',null::text,'Clausura de los actos conmemorativos del IV Centenario del Patronazgo de Nuestra Señora de Consolación sobre Osuna.')
)
insert into entities(entity_type,name,slug,summary,status)
select 'event',name,slug,description,'published' from event_data d where not exists(select 1 from entities e where e.slug=d.slug);
with event_data(slug,event_type,event_date,event_date_text,description) as (
 values
 ('patronazgo-consolacion-osuna-1624','Patronazgo',null::date,'1624','Nuestra Señora de Consolación es Patrona de Osuna desde 1624.'),
 ('iv-centenario-patronazgo-consolacion-osuna-2024','Efeméride',date '2024-11-24',null::text,'Clausura de los actos conmemorativos del IV Centenario del Patronazgo de Nuestra Señora de Consolación sobre Osuna.')
)
insert into events(entity_id,event_type,event_date,event_date_text,place_id,description,event_category,brotherhood_entity_id,municipality_id,event_status,location_text)
select e.id,d.event_type,d.event_date,d.event_date_text,case when d.slug like '%2024' then (select id from places where slug='iglesia-parroquial-consolacion-osuna') else null end,d.description,'historical',h.id,m.id,'held','Osuna' from event_data d join entities e on e.slug=d.slug join entities h on h.slug='consolacion-osuna' join municipalities m on m.slug='osuna'
where not exists(select 1 from events ev where ev.entity_id=e.id);
insert into entity_relations(source_entity_id,relation_type,target_entity_id,date_from_text,notes,status)
select ev.id,'involves',h.id,coalesce(events.event_date_text,extract(year from events.event_date)::text),'Acontecimiento histórico de la Hermandad.' ,'published' from entities ev join events on events.entity_id=ev.id join entities h on h.slug='consolacion-osuna' where ev.slug in ('patronazgo-consolacion-osuna-1624','iv-centenario-patronazgo-consolacion-osuna-2024')
and not exists(select 1 from entity_relations r where r.source_entity_id=ev.id and r.target_entity_id=h.id and r.relation_type='involves');
insert into entity_relations(source_entity_id,relation_type,target_entity_id,date_from_text,notes,status)
select ev.id,'involves',i.id,'1624','El patronazgo se refiere a la titular mariana.','published' from entities ev join entities i on i.slug='nuestra-senora-consolacion-osuna' where ev.slug='patronazgo-consolacion-osuna-1624'
and not exists(select 1 from entity_relations r where r.source_entity_id=ev.id and r.target_entity_id=i.id and r.relation_type='involves');

insert into source_links(source_id,entity_id,scope,notes)
select s.id,h.id,d.scope,d.notes from (values
 ('https://www.cofradiasyhermandades.es/fichacofradia-COFRADIAS-Osuna-Consolacion-eGNOaGVrTXFoRGxGdzE2Y2RCU252UT09','Identidad y sede','Fundación y sede canónica.'),
 ('https://www.osuna.es/es/turismo/conoce-osuna/osuna-en-fiestas/ntra.-sra.-de-consolacion/','Patronazgo y tradición','Patronazgo, fecha anual y tradición de procedencia.'),
 ('https://boe.es/diario_boe/txt.php?id=BOE-A-2002-688','Patrimonio e imagen','Catalogación BIC de la imagen y del templo.'),
 ('https://www.elpespunte.es/articulo/cofrade/son-actos-vela-consolacion-2026-osuna-viernes-dia-patrona/20260904164950149406.html','Actualidad 2026','Cultos, salida, costaleros y equipo de capataces.'),
 ('https://www.osuna.es/es/cultura/noticias/El-Ayuntamiento-de-Osuna-firma-con-la-Banda-de-Musica-Villa-de-Osuna-un-nuevo-convenio-de-colaboracion/','Música vigente','Convenio musical vigente.')
) d(url,scope,notes) join sources s on s.url=d.url join entities h on h.slug='consolacion-osuna'
where not exists(select 1 from source_links sl where sl.source_id=s.id and sl.entity_id=h.id and sl.scope=d.scope);
insert into source_links(source_id,entity_id,scope,notes)
select s.id,i.id,d.scope,d.notes from (values
 ('https://boe.es/diario_boe/txt.php?id=BOE-A-2002-688','Catalogación artística','Autoría anónima, material, tamaño y cronología BIC.'),
 ('https://www.osuna.es/es/turismo/que-ver/monumentos/iglesias/iglesia-de-ntra.-sra.-de-consolacion/','Culto actual','Imagen de vestir que preside el retablo mayor.'),
 ('https://www.osuna.es/es/turismo/conoce-osuna/osuna-en-fiestas/ntra.-sra.-de-consolacion/','Tradición local','Tradición municipal sobre llegada desde Inglaterra en el siglo XVI.')
) d(url,scope,notes) join sources s on s.url=d.url join entities i on i.slug='nuestra-senora-consolacion-osuna'
where not exists(select 1 from source_links sl where sl.source_id=s.id and sl.entity_id=i.id and sl.scope=d.scope);
insert into source_links(source_id,entity_id,scope,notes)
select s.id,st.id,d.scope,d.notes from (values
 ('https://www.artesacro.org/Noticia/Ver/119424/provincia-osuna-acompano-su-patrona-nuestra-senora-consolacion-su-gloriosa','Paso procesional','Descripción del paso en 2017.'),
 ('https://www.elpespunte.es/articulo/cofrade/son-actos-vela-consolacion-2026-osuna-viernes-dia-patrona/20260904164950149406.html','Paso 2026','24 costaleros y equipo anunciado para 2026.')
) d(url,scope,notes) join sources s on s.url=d.url join entities st on st.slug='paso-nuestra-senora-consolacion-osuna'
where not exists(select 1 from source_links sl where sl.source_id=s.id and sl.entity_id=st.id and sl.scope=d.scope);
insert into source_links(source_id,music_accompaniment_period_id,scope,notes)
select s.id,mp.id,'Acompañamiento vigente','Convenio municipal 2025-2028 que incluye la procesión patronal.' from sources s join music_accompaniment_periods mp on mp.brotherhood_entity_id=(select id from entities where slug='consolacion-osuna') and mp.band_entity_id=(select id from entities where slug='banda-musica-villa-osuna') and mp.year_from=2025 where s.url='https://www.osuna.es/es/cultura/noticias/El-Ayuntamiento-de-Osuna-firma-con-la-Banda-de-Musica-Villa-de-Osuna-un-nuevo-convenio-de-colaboracion/'
and not exists(select 1 from source_links sl where sl.source_id=s.id and sl.music_accompaniment_period_id=mp.id);
insert into source_links(source_id,cult_id,scope,notes)
select s.id,c.id,'Culto 2026','Programación contemporánea del culto.' from sources s join cults c on c.brotherhood_entity_id=(select id from entities where slug='consolacion-osuna') where s.url=case when c.title='Solemne Novena a Nuestra Señora de Consolación' then 'https://www.diarioavanza.es/provincia/osuna/osuna-prepara-fiestas-patronales-nueve-dias-actividades-honor-virgen-consolacion/20260831141850026048.html' else 'https://www.elpespunte.es/articulo/cofrade/son-actos-vela-consolacion-2026-osuna-viernes-dia-patrona/20260904164950149406.html' end
and not exists(select 1 from source_links sl where sl.source_id=s.id and sl.cult_id=c.id);
insert into source_links(source_id,step_personnel_period_id,scope,notes)
select s.id,spp.id,'Equipo de capataces 2026','La fuente enumera el equipo sin desglosar la función individual.' from sources s join step_personnel_periods spp on spp.step_entity_id=(select id from entities where slug='paso-nuestra-senora-consolacion-osuna') and spp.year_from=2026 where s.url='https://www.elpespunte.es/articulo/cofrade/son-actos-vela-consolacion-2026-osuna-viernes-dia-patrona/20260904164950149406.html'
and not exists(select 1 from source_links sl where sl.source_id=s.id and sl.step_personnel_period_id=spp.id);
insert into source_links(source_id,entity_id,scope,notes)
select s.id,ev.id,'Acontecimiento histórico','Fuente del acontecimiento.' from entities ev join sources s on s.url=case when ev.slug='patronazgo-consolacion-osuna-1624' then 'https://www.osuna.es/es/turismo/conoce-osuna/osuna-en-fiestas/ntra.-sra.-de-consolacion/' else 'https://www.canalsur.es/rtva/comunicacion/patrona-osuna-sevilla-protagonista-misa_1_1303233.html' end where ev.slug in ('patronazgo-consolacion-osuna-1624','iv-centenario-patronazgo-consolacion-osuna-2024')
and not exists(select 1 from source_links sl where sl.source_id=s.id and sl.entity_id=ev.id and sl.scope='Acontecimiento histórico');
