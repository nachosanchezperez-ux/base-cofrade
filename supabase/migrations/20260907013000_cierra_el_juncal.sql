-- Hilo Cofrade · cierre documental avanzado de El Juncal
-- Corte editorial: 2026-09-06
-- Solo DML editorial. Sin DDL, nuevas tablas, RLS, arquitectura ni UX.

do $$
begin
  if (select count(*) from public.entities where slug='juncal-sevilla' and entity_type='brotherhood') <> 1 then
    raise exception 'La ficha canónica de El Juncal no es unívoca';
  end if;
  if (select count(*) from public.brotherhood_steps bs join public.entities h on h.id=bs.brotherhood_entity_id where h.slug='juncal-sevilla' and bs.status='published') <> 1 then
    raise exception 'El paso procesional previo de El Juncal no está intacto';
  end if;
end $$;

with source_data(name,url,source_type,publisher,publication_date,notes) as (
  values
    ('El Juncal · Historia','https://hermandaddeljuncal.blogspot.com/p/blog-page_3.html','Web oficial','Real Hermandad Sacramental del Juncal',null::date,'Fundación, título, sede, cronología institucional, paso y patrimonio.'),
    ('El Juncal · Sagrados titulares','https://hermandaddeljuncal.blogspot.com/p/titulares.html','Web oficial','Real Hermandad Sacramental del Juncal',null::date,'Titularidades, autorías, cronologías y cultos estables.'),
    ('El Juncal · Contacto oficial','https://hermandaddeljuncal.blogspot.com/','Web oficial','Real Hermandad Sacramental del Juncal',null::date,'Dirección oficial de la corporación en Plaza del Sella, 8.'),
    ('El Juncal · Cultos y salida de septiembre 2026','https://lacajacofrade.es/hermandad-juncal-cartel-salida-procesional/','Medio especializado','La Caja Cofrade',date '2026-09-03','Programa de septiembre, salida del 12 de septiembre, itinerario y Banda de la Cruz Roja.'),
    ('El Juncal · Cuaresma 2026','https://www.artesacro.org/Noticia/Ver/166481/hermandad-juncal-presenta-su-calendario-cultos-y-actos-cuaresma-2026','Medio especializado','Arte Sacro',date '2026-03-20','Calendario cuaresmal de 2026: besamanos, quinario, función, besapiés y Vía Crucis.')
)
insert into public.sources(name,url,source_type,author_or_publisher,publication_date,accessed_at,notes)
select name,url,source_type,publisher,publication_date,date '2026-09-06',notes
from source_data d where not exists(select 1 from public.sources s where s.url=d.url);

update public.entities
set name='Real Hermandad Sacramental del Juncal',
    summary='Corporación sacramental y letífica fundada en 1968 en el barrio sevillano del Juncal, con salida anual de Nuestra Señora del Juncal en septiembre.',
    updated_at=now()
where slug='juncal-sevilla';

update public.brotherhoods
set official_name='Real Hermandad del Santísimo Sacramento, Nuestro Padre Jesús Cautivo en Su Soledad, Nuestra Señora del Juncal y María Santísima de la Esperanza, Reina de los Mártires',
    popular_name='El Juncal',
    foundation_text='11 de junio de 1968',
    current_procession_day='Septiembre',
    history_text='La corporación se constituyó formalmente como hermandad sacramental y letífica el 11 de junio de 1968, a raíz del Congreso Eucarístico celebrado en Sevilla. Incorporó como titular a Nuestro Padre Jesús Cautivo en Su Soledad en 1973; María Santísima de la Esperanza, Reina de los Mártires, quedó incorporada al título en 2011. La Casa Real concedió el título de Real en 2012 y el templo de Nuestra Señora del Juncal recuperó su condición parroquial en 2014.',
    notes='Sede canónica en la Parroquia de Nuestra Señora del Juncal. La salida letífica anual se documenta por edición; en 2026 está anunciada para el 12 de septiembre.'
where entity_id=(select id from public.entities where slug='juncal-sevilla');

insert into public.places(municipality_id,name,slug,place_type,address,notes)
select m.id,'Parroquia de Nuestra Señora del Juncal','parroquia-nuestra-senora-juncal-sevilla','Parroquia','Plaza del Sella, 8, 41005 Sevilla','Sede canónica de la Real Hermandad Sacramental del Juncal.'
from public.municipalities m where m.slug='sevilla'
  and not exists(select 1 from public.places where slug='parroquia-nuestra-senora-juncal-sevilla');

update public.brotherhoods
set canonical_see_place_id=(select id from public.places where slug='parroquia-nuestra-senora-juncal-sevilla')
where entity_id=(select id from public.entities where slug='juncal-sevilla');

insert into public.entity_locations(entity_id,place_id,municipality_id,location_type,date_from_text,is_current,notes,status)
select h.id,p.id,m.id,'Sede canónica','Vigente en 2026',true,'Parroquia de Nuestra Señora del Juncal, Plaza del Sella, 8.','published'
from public.entities h join public.places p on p.slug='parroquia-nuestra-senora-juncal-sevilla' join public.municipalities m on m.slug='sevilla'
where h.slug='juncal-sevilla'
  and not exists(select 1 from public.entity_locations el where el.entity_id=h.id and el.place_id=p.id and el.location_type='Sede canónica' and el.status<>'archived');

insert into public.source_links(source_id,entity_id,scope,notes)
select s.id,h.id,'Historia e identidad','Cronología y título publicados por la propia Hermandad.'
from public.sources s join public.entities h on h.slug='juncal-sevilla'
where s.url='https://hermandaddeljuncal.blogspot.com/p/blog-page_3.html'
  and not exists(select 1 from public.source_links sl where sl.source_id=s.id and sl.entity_id=h.id and sl.scope='Historia e identidad');

insert into public.source_links(source_id,entity_location_id,scope,notes)
select s.id,el.id,'Sede canónica vigente','Dirección oficial y origen de la salida de 2026.'
from public.sources s join public.entity_locations el on true join public.entities h on h.id=el.entity_id join public.places p on p.id=el.place_id
where s.url='https://hermandaddeljuncal.blogspot.com/' and h.slug='juncal-sevilla' and p.slug='parroquia-nuestra-senora-juncal-sevilla'
  and not exists(select 1 from public.source_links sl where sl.source_id=s.id and sl.entity_location_id=el.id);

-- Titulares: tres imágenes y la titularidad sacramental no visual.
with image_data(name,slug,summary) as (
  values
    ('Nuestra Señora del Juncal','nuestra-senora-juncal-sevilla','Titular letífica y patrona popular del barrio del Juncal, bendecida en 1966.'),
    ('Nuestro Padre Jesús Cautivo en Su Soledad','jesus-cautivo-soledad-juncal-sevilla','Imagen cristífera del siglo XVII, incorporada como titular en 1973.'),
    ('María Santísima de la Esperanza, Reina de los Mártires','esperanza-reina-martires-juncal-sevilla','Titular dolorosa incorporada al título de la Hermandad en 2011.')
)
insert into public.entities(entity_type,name,slug,summary,status)
select 'image',name,slug,summary,'published' from image_data d
where not exists(select 1 from public.entities e where e.slug=d.slug);

with image_data(slug,image_type,execution_date_text,material,description,iconography,is_dress_image,current_state_notes) as (
  values
    ('nuestra-senora-juncal-sevilla','Gloria','1965–1966','Talla policromada','Imagen completa sedente, de 67 centímetros, realizada por José Rivera García y bendecida el 5 de junio de 1966.','Virgen sedente con el Niño; adaptación local inspirada en la patrona de Irún.',false,'Preside el altar mayor de la Parroquia de Nuestra Señora del Juncal.'),
    ('jesus-cautivo-soledad-juncal-sevilla','Cristo cautivo','Siglo XVII','Talla policromada','Imagen anónima atribuida a Francisco Antonio Ruiz Gijón, cedida por la Hermandad de los Panaderos e incorporada como titular en 1973.','Cristo cautivo en soledad.',false,'Restaurada por Antonio Gavira Alba en 1972 y por Juan Manuel Miñarro López en 1999.'),
    ('esperanza-reina-martires-juncal-sevilla','Dolorosa','1992–1993','Talla policromada','Dolorosa realizada por Javier Roan y bendecida el 23 de febrero de 1993; llegó a la parroquia del Juncal el 31 de mayo de 1996.','María dolorosa bajo la advocación de la Esperanza, Reina de los Mártires.',true,'La cronología institucional consultada sitúa la hechura entre 1992 y 1993; se conserva esa horquilla sin forzar una fecha única.')
)
insert into public.images(entity_id,image_type,execution_date_text,material,current_condition,description,iconography,is_dress_image,current_state_notes)
select e.id,d.image_type,d.execution_date_text,d.material,'extant',d.description,d.iconography,d.is_dress_image,d.current_state_notes
from image_data d join public.entities e on e.slug=d.slug
on conflict(entity_id) do update set image_type=excluded.image_type,execution_date_text=excluded.execution_date_text,material=excluded.material,current_condition='extant',description=excluded.description,iconography=excluded.iconography,is_dress_image=excluded.is_dress_image,current_state_notes=excluded.current_state_notes;

with relation_data(image_slug,date_from_text,notes) as (
  values
    ('nuestra-senora-juncal-sevilla','Desde la fundación en 1968','Titular letífica y titular de la parroquia.'),
    ('jesus-cautivo-soledad-juncal-sevilla','Desde 1973','Titular cristífero incorporado tras su cesión por la Hermandad de los Panaderos.'),
    ('esperanza-reina-martires-juncal-sevilla','Desde 2011','Titular dolorosa incorporada al título por las Reglas aprobadas en 2011.')
)
insert into public.brotherhood_images(brotherhood_entity_id,image_entity_id,relation_type,date_from_text,notes,status)
select h.id,i.id,'titular',d.date_from_text,d.notes,'published'
from relation_data d join public.entities h on h.slug='juncal-sevilla' join public.entities i on i.slug=d.image_slug
where not exists(select 1 from public.brotherhood_images bi where bi.brotherhood_entity_id=h.id and bi.image_entity_id=i.id and bi.relation_type='titular' and bi.status<>'archived');

insert into public.entity_relations(source_entity_id,relation_type,target_entity_id,date_from_text,notes,status)
select h.id,'has_titular',t.id,'Desde la fundación en 1968','El Santísimo Sacramento expresa el carácter sacramental fundacional de la corporación.','published'
from public.entities h join public.entities t on t.slug='santisimo-sacramento'
where h.slug='juncal-sevilla'
  and not exists(select 1 from public.entity_relations er where er.source_entity_id=h.id and er.target_entity_id=t.id and er.relation_type='has_titular' and er.status<>'archived');

with agent_data(name,slug,description) as (
  values
    ('José Rivera García','jose-rivera-garcia','Escultor e imaginero, autor de Nuestra Señora del Juncal.'),
    ('Javier Roan','javier-roan','Imaginero, autor de María Santísima de la Esperanza, Reina de los Mártires.')
)
insert into public.entities(entity_type,name,slug,summary,status)
select 'agent',name,slug,description,'published' from agent_data d
where not exists(select 1 from public.entities e where e.slug=d.slug);

with agent_data(slug,description) as (
  values
    ('jose-rivera-garcia','Escultor e imaginero, autor de Nuestra Señora del Juncal.'),
    ('javier-roan','Imaginero, autor de María Santísima de la Esperanza, Reina de los Mártires.')
)
insert into public.agents(entity_id,agent_kind,description)
select e.id,'person',d.description from agent_data d join public.entities e on e.slug=d.slug
on conflict(entity_id) do update set agent_kind='person',description=excluded.description;

with authorship_data(image_slug,agent_slug,authorship_type,role_name,date_from_text,certainty,notes) as (
  values
    ('nuestra-senora-juncal-sevilla','jose-rivera-garcia','author','Escultor','1965–1966','documented','Autoría publicada por la Hermandad.'),
    ('jesus-cautivo-soledad-juncal-sevilla','francisco-antonio-ruiz-gijon','attributed_to','Escultor','Siglo XVII','attributed','Atribución, no autoría documentada.'),
    ('esperanza-reina-martires-juncal-sevilla','javier-roan','author','Imaginero','1992–1993','documented','Autoría coincidente en las fuentes institucionales; la fecha exacta presenta variantes.')
)
insert into public.image_authorships(image_entity_id,agent_entity_id,authorship_type,role_name,date_from_text,certainty,notes,status)
select i.id,a.id,d.authorship_type,d.role_name,d.date_from_text,d.certainty,d.notes,'published'
from authorship_data d join public.entities i on i.slug=d.image_slug join public.entities a on a.slug=d.agent_slug
where not exists(select 1 from public.image_authorships ia where ia.image_entity_id=i.id and ia.agent_entity_id=a.id and ia.authorship_type=d.authorship_type and ia.role_name=d.role_name);

with image_sources(image_slug) as (
  values ('nuestra-senora-juncal-sevilla'),('jesus-cautivo-soledad-juncal-sevilla'),('esperanza-reina-martires-juncal-sevilla')
)
insert into public.source_links(source_id,entity_id,scope,notes)
select s.id,i.id,'Titular · autoría y cronología','Ficha de titulares publicada por la propia Hermandad.'
from image_sources d join public.entities i on i.slug=d.image_slug join public.sources s on s.url='https://hermandaddeljuncal.blogspot.com/p/titulares.html'
where not exists(select 1 from public.source_links sl where sl.source_id=s.id and sl.entity_id=i.id and sl.scope='Titular · autoría y cronología');

insert into public.source_links(source_id,brotherhood_image_id,scope,notes)
select s.id,bi.id,'Titularidad vigente','Relación titular publicada por la propia Hermandad.'
from public.sources s join public.brotherhood_images bi on true join public.entities h on h.id=bi.brotherhood_entity_id
where s.url='https://hermandaddeljuncal.blogspot.com/p/titulares.html' and h.slug='juncal-sevilla'
  and not exists(select 1 from public.source_links sl where sl.source_id=s.id and sl.brotherhood_image_id=bi.id);

insert into public.source_links(source_id,image_authorship_id,scope,notes)
select s.id,ia.id,'Autoría o atribución','Autoría, atribución y cronología descritas por la Hermandad.'
from public.sources s join public.image_authorships ia on true join public.entities i on i.id=ia.image_entity_id
where s.url='https://hermandaddeljuncal.blogspot.com/p/titulares.html' and i.slug in ('nuestra-senora-juncal-sevilla','jesus-cautivo-soledad-juncal-sevilla','esperanza-reina-martires-juncal-sevilla')
  and not exists(select 1 from public.source_links sl where sl.source_id=s.id and sl.image_authorship_id=ia.id);

insert into public.source_links(source_id,entity_relation_id,scope,notes)
select s.id,er.id,'Titularidad sacramental','El carácter sacramental y sus cultos se describen en la página oficial de titulares.'
from public.sources s join public.entity_relations er on true join public.entities h on h.id=er.source_entity_id join public.entities t on t.id=er.target_entity_id
where s.url='https://hermandaddeljuncal.blogspot.com/p/titulares.html' and h.slug='juncal-sevilla' and t.slug='santisimo-sacramento' and er.relation_type='has_titular'
  and not exists(select 1 from public.source_links sl where sl.source_id=s.id and sl.entity_relation_id=er.id);

-- El patrimonio del paso se cuelga del paso, no de la cartela general de la Hermandad.
update public.steps
set current_condition='preserved',
    execution_date_text='Conjunto configurado entre 1968 y 1979',
    materials='Orfebrería y estructura procesional',
    description='Paso procesional de Nuestra Señora del Juncal, estrenado por fases entre 1968 y 1979.',
    current_state_notes='El conjunto documentado conserva como hitos la parihuela y peanas de 1968, los respiraderos de 1971, los candelabros de 1977–1978 y las jarras y el llamador de 1979.'
where entity_id=(select id from public.entities where slug='paso-procesional-nuestra-senora-juncal');

insert into public.image_steps(image_entity_id,step_entity_id,relation_type,date_from_text,notes,status)
select i.id,st.id,'processes_on','Vigente en 2026','Nuestra Señora del Juncal preside su paso en la salida letífica anual.','published'
from public.entities i join public.entities st on st.slug='paso-procesional-nuestra-senora-juncal'
where i.slug='nuestra-senora-juncal-sevilla'
  and not exists(select 1 from public.image_steps ix where ix.image_entity_id=i.id and ix.step_entity_id=st.id and ix.relation_type='processes_on' and ix.status<>'archived');

with asset_data(name,slug,asset_type,description,date_from_text,materials,historical_context,display_order) as (
  values
    ('Parihuela, peana y sobrepeana del paso del Juncal','parihuela-peanas-paso-juncal','Estructura y peanas','Parihuela, peana y sobrepeana realizadas por Antonio Santos Campanario.','1968','Estructura procesional y orfebrería','Primer estreno del paso procesional de la Virgen.',10),
    ('Respiraderos del paso del Juncal','respiraderos-paso-juncal','Respiraderos','Respiraderos completos realizados por José López Camacho y Guillermo Clavería Domínguez.','1971','Orfebrería','Segunda gran fase documentada del conjunto.',20),
    ('Candelabros de guardabrisas del paso del Juncal','candelabros-guardabrisas-paso-juncal','Candelabros de guardabrisas','Juego de cuatro candelabros realizado por la orfebrería Viuda de Villarreal.','1977–1978','Orfebrería','Dos piezas se estrenaron en 1977 y el juego quedó concluido en 1978.',30),
    ('Jarras y llamador del paso del Juncal','jarras-llamador-paso-juncal','Jarras y llamador','Juego de seis jarras y llamador realizados por Manuel de los Ríos.','1979','Orfebrería','Incorporación que completó las andas procesionales documentadas.',40)
)
insert into public.entities(entity_type,name,slug,summary,status)
select 'heritage_asset',name,slug,description,'published' from asset_data d
where not exists(select 1 from public.entities e where e.slug=d.slug);

with asset_data(slug,asset_type,description,date_from_text,materials,historical_context,display_order) as (
  values
    ('parihuela-peanas-paso-juncal','Estructura y peanas','Parihuela, peana y sobrepeana realizadas por Antonio Santos Campanario.','1968','Estructura procesional y orfebrería','Primer estreno del paso procesional de la Virgen.',10),
    ('respiraderos-paso-juncal','Respiraderos','Respiraderos completos realizados por José López Camacho y Guillermo Clavería Domínguez.','1971','Orfebrería','Segunda gran fase documentada del conjunto.',20),
    ('candelabros-guardabrisas-paso-juncal','Candelabros de guardabrisas','Juego de cuatro candelabros realizado por la orfebrería Viuda de Villarreal.','1977–1978','Orfebrería','Dos piezas se estrenaron en 1977 y el juego quedó concluido en 1978.',30),
    ('jarras-llamador-paso-juncal','Jarras y llamador','Juego de seis jarras y llamador realizados por Manuel de los Ríos.','1979','Orfebrería','Incorporación que completó las andas procesionales documentadas.',40)
)
insert into public.heritage_assets(entity_id,parent_entity_id,asset_type,description,current_condition,date_from_text,is_current,materials,historical_context,display_order,is_featured)
select e.id,st.id,d.asset_type,d.description,'preserved',d.date_from_text,true,d.materials,d.historical_context,d.display_order,true
from asset_data d join public.entities e on e.slug=d.slug join public.entities st on st.slug='paso-procesional-nuestra-senora-juncal'
on conflict(entity_id) do update set parent_entity_id=excluded.parent_entity_id,asset_type=excluded.asset_type,description=excluded.description,current_condition=excluded.current_condition,date_from_text=excluded.date_from_text,is_current=true,materials=excluded.materials,historical_context=excluded.historical_context,display_order=excluded.display_order,is_featured=true;

insert into public.source_links(source_id,entity_id,scope,notes)
select s.id,e.id,'Patrimonio del paso','Cronología y talleres publicados en la historia oficial de la Hermandad.'
from public.sources s join public.entities e on e.slug in ('parihuela-peanas-paso-juncal','respiraderos-paso-juncal','candelabros-guardabrisas-paso-juncal','jarras-llamador-paso-juncal')
where s.url='https://hermandaddeljuncal.blogspot.com/p/blog-page_3.html'
  and not exists(select 1 from public.source_links sl where sl.source_id=s.id and sl.entity_id=e.id);

insert into public.source_links(source_id,brotherhood_step_id,scope,notes)
select s.id,bs.id,'Paso procesional','Cronología oficial del paso de Nuestra Señora del Juncal.'
from public.sources s join public.brotherhood_steps bs on true join public.entities h on h.id=bs.brotherhood_entity_id join public.entities st on st.id=bs.step_entity_id
where s.url='https://hermandaddeljuncal.blogspot.com/p/blog-page_3.html' and h.slug='juncal-sevilla' and st.slug='paso-procesional-nuestra-senora-juncal'
  and not exists(select 1 from public.source_links sl where sl.source_id=s.id and sl.brotherhood_step_id=bs.id);

insert into public.source_links(source_id,image_step_id,scope,notes)
select s.id,ix.id,'Titular en su paso','La salida de 2026 identifica a la Virgen y a su paso procesional.'
from public.sources s join public.image_steps ix on true join public.entities i on i.id=ix.image_entity_id join public.entities st on st.id=ix.step_entity_id
where s.url='https://lacajacofrade.es/hermandad-juncal-cartel-salida-procesional/' and i.slug='nuestra-senora-juncal-sevilla' and st.slug='paso-procesional-nuestra-senora-juncal'
  and not exists(select 1 from public.source_links sl where sl.source_id=s.id and sl.image_step_id=ix.id);

update public.music_accompaniment_periods
set step_entity_id=(select id from public.entities where slug='paso-procesional-nuestra-senora-juncal'),
    outing_type='Procesión de gloria',
    position='Tras el paso de Nuestra Señora del Juncal',
    year_from=coalesce(year_from,2026),
    date_from_text=case when year_from is null then 'Documentado en 2026' else date_from_text end,
    public_step_name='Paso procesional de Nuestra Señora del Juncal',
    notes='Acompañamiento vigente documentado para la salida de Gloria de 2026; no se fija una antigüedad anterior sin fuente unívoca.',
    updated_at=now()
where brotherhood_entity_id=(select id from public.entities where slug='juncal-sevilla')
  and band_entity_id=(select id from public.entities where slug='banda-musica-cruz-roja-sevilla') and is_current;

insert into public.source_links(source_id,music_accompaniment_period_id,scope,notes)
select s.id,mp.id,'Acompañamiento musical vigente','La convocatoria de 2026 confirma a la Banda de Música de la Cruz Roja tras la Virgen.'
from public.sources s join public.music_accompaniment_periods mp on true
where s.url='https://lacajacofrade.es/hermandad-juncal-cartel-salida-procesional/' and mp.brotherhood_entity_id=(select id from public.entities where slug='juncal-sevilla') and mp.is_current
  and not exists(select 1 from public.source_links sl where sl.source_id=s.id and sl.music_accompaniment_period_id=mp.id);

-- Cultos recurrentes y sus ediciones exactas de 2026.
with cult_data(image_slug,cult_type,title,date_rule,month,description,recurrence_label,display_order) as (
  values
    (null::text,'Exposición eucarística','Exposición del Santísimo y Misa de Hermandad','Primer viernes de cada mes',null::smallint,'Culto sacramental mensual de la corporación.','Mensual · primer viernes',10),
    ('jesus-cautivo-soledad-juncal-sevilla','Besamanos','Besamanos a Nuestro Padre Jesús Cautivo en Su Soledad','Primer viernes de marzo',3::smallint,'Veneración cuaresmal al titular cristífero.','Anual · Cuaresma',20),
    ('jesus-cautivo-soledad-juncal-sevilla','Quinario','Solemne Quinario a Nuestro Padre Jesús Cautivo en Su Soledad','Cinco días de Cuaresma; fechas según calendario anual',3::smallint,'Quinario anual al titular cristífero.','Anual · Cuaresma',30),
    ('jesus-cautivo-soledad-juncal-sevilla','Función Solemne','Función Solemne a Nuestro Padre Jesús Cautivo en Su Soledad','Domingo posterior al Quinario',3::smallint,'Función anual al titular cristífero.','Anual · tras el Quinario',40),
    ('jesus-cautivo-soledad-juncal-sevilla','Besapiés','Besapiés a Nuestro Padre Jesús Cautivo en Su Soledad','Sábado de Cuaresma; fecha según calendario anual',3::smallint,'Veneración cuaresmal al titular cristífero.','Anual · Cuaresma',50),
    ('jesus-cautivo-soledad-juncal-sevilla','Vía Crucis','Vía Crucis de Nuestro Padre Jesús Cautivo en Su Soledad','Viernes de Dolores',3::smallint,'Vía Crucis anual por las calles de la feligresía.','Anual · Viernes de Dolores',60),
    (null::text,'Triduo sacramental','Triduo al Santísimo Sacramento','Junio; fechas según calendario anual',6::smallint,'Triduo sacramental anual.','Anual · junio',70),
    ('nuestra-senora-juncal-sevilla','Triduo','Solemne Triduo a Nuestra Señora del Juncal','Tres días previos a la salida de septiembre',9::smallint,'Triduo anual a la titular letífica.','Anual · septiembre',80),
    ('nuestra-senora-juncal-sevilla','Función Principal','Función Principal de Instituto','Domingo posterior al Triduo y a la salida',9::smallint,'Función principal anual de la corporación.','Anual · septiembre',90)
)
insert into public.cults(brotherhood_entity_id,image_entity_id,cult_type,title,date_rule,month,place_id,description,status,is_recurring,recurrence_label,display_order,notes)
select h.id,i.id,d.cult_type,d.title,d.date_rule,d.month,p.id,d.description,'published',true,d.recurrence_label,d.display_order,'La regla estable se separa de cada edición anual en cult_occurrences.'
from cult_data d join public.entities h on h.slug='juncal-sevilla' join public.places p on p.slug='parroquia-nuestra-senora-juncal-sevilla' left join public.entities i on i.slug=d.image_slug
where not exists(select 1 from public.cults c where c.brotherhood_entity_id=h.id and c.title=d.title and c.is_recurring);

with occurrence_data(cult_title,start_date,end_date,description,source_url) as (
  values
    ('Besamanos a Nuestro Padre Jesús Cautivo en Su Soledad',date '2026-03-06',date '2026-03-06','Besamanos convocado de 10:00 a 14:00 y de 17:00 a 20:00.','https://www.artesacro.org/Noticia/Ver/166481/hermandad-juncal-presenta-su-calendario-cultos-y-actos-cuaresma-2026'),
    ('Solemne Quinario a Nuestro Padre Jesús Cautivo en Su Soledad',date '2026-03-10',date '2026-03-14','Quinario convocado del 10 al 14 de marzo, a las 19:00.','https://www.artesacro.org/Noticia/Ver/166481/hermandad-juncal-presenta-su-calendario-cultos-y-actos-cuaresma-2026'),
    ('Función Solemne a Nuestro Padre Jesús Cautivo en Su Soledad',date '2026-03-15',date '2026-03-15','Función solemne convocada para las 12:00.','https://www.artesacro.org/Noticia/Ver/166481/hermandad-juncal-presenta-su-calendario-cultos-y-actos-cuaresma-2026'),
    ('Besapiés a Nuestro Padre Jesús Cautivo en Su Soledad',date '2026-03-21',date '2026-03-21','Besapiés convocado de 10:00 a 14:00 y de 17:00 a 20:00.','https://www.artesacro.org/Noticia/Ver/166481/hermandad-juncal-presenta-su-calendario-cultos-y-actos-cuaresma-2026'),
    ('Vía Crucis de Nuestro Padre Jesús Cautivo en Su Soledad',date '2026-03-27',date '2026-03-27','Vía Crucis convocado para el Viernes de Dolores.','https://www.artesacro.org/Noticia/Ver/166481/hermandad-juncal-presenta-su-calendario-cultos-y-actos-cuaresma-2026'),
    ('Solemne Triduo a Nuestra Señora del Juncal',date '2026-09-09',date '2026-09-11','Rosario a las 20:00 y ejercicio de triduo con eucaristía a las 20:30.','https://lacajacofrade.es/hermandad-juncal-cartel-salida-procesional/'),
    ('Función Principal de Instituto',date '2026-09-13',date '2026-09-13','Función presidida por el arzobispo de Sevilla, José Ángel Saiz Meneses.','https://lacajacofrade.es/hermandad-juncal-cartel-salida-procesional/')
)
insert into public.cult_occurrences(cult_id,year,start_date,end_date,place_id,description_override,event_status,status,notes)
select c.id,2026,d.start_date,d.end_date,p.id,d.description,'announced','published','La fuente localizada es una convocatoria; no se transforma en celebración sin memoria posterior.'
from occurrence_data d join public.cults c on c.brotherhood_entity_id=(select id from public.entities where slug='juncal-sevilla') and c.title=d.cult_title join public.places p on p.slug='parroquia-nuestra-senora-juncal-sevilla'
on conflict(cult_id,year,start_date) do update set end_date=excluded.end_date,place_id=excluded.place_id,description_override=excluded.description_override,event_status=excluded.event_status,status='published',notes=excluded.notes,updated_at=now();

insert into public.source_links(source_id,cult_id,scope,notes)
select s.id,c.id,'Culto recurrente','Regla estable documentada por las fuentes oficial e institucionales consultadas.'
from public.cults c join public.sources s on s.url=case when c.month=3 then 'https://www.artesacro.org/Noticia/Ver/166481/hermandad-juncal-presenta-su-calendario-cultos-y-actos-cuaresma-2026' when c.month=9 then 'https://lacajacofrade.es/hermandad-juncal-cartel-salida-procesional/' else 'https://hermandaddeljuncal.blogspot.com/p/titulares.html' end
where c.brotherhood_entity_id=(select id from public.entities where slug='juncal-sevilla')
  and not exists(select 1 from public.source_links sl where sl.source_id=s.id and sl.cult_id=c.id);

with occurrence_sources as (
  select co.id occurrence_id,d.source_url
  from public.cult_occurrences co join public.cults c on c.id=co.cult_id
  join (values
    ('Besamanos a Nuestro Padre Jesús Cautivo en Su Soledad','https://www.artesacro.org/Noticia/Ver/166481/hermandad-juncal-presenta-su-calendario-cultos-y-actos-cuaresma-2026'),
    ('Solemne Quinario a Nuestro Padre Jesús Cautivo en Su Soledad','https://www.artesacro.org/Noticia/Ver/166481/hermandad-juncal-presenta-su-calendario-cultos-y-actos-cuaresma-2026'),
    ('Función Solemne a Nuestro Padre Jesús Cautivo en Su Soledad','https://www.artesacro.org/Noticia/Ver/166481/hermandad-juncal-presenta-su-calendario-cultos-y-actos-cuaresma-2026'),
    ('Besapiés a Nuestro Padre Jesús Cautivo en Su Soledad','https://www.artesacro.org/Noticia/Ver/166481/hermandad-juncal-presenta-su-calendario-cultos-y-actos-cuaresma-2026'),
    ('Vía Crucis de Nuestro Padre Jesús Cautivo en Su Soledad','https://www.artesacro.org/Noticia/Ver/166481/hermandad-juncal-presenta-su-calendario-cultos-y-actos-cuaresma-2026'),
    ('Solemne Triduo a Nuestra Señora del Juncal','https://lacajacofrade.es/hermandad-juncal-cartel-salida-procesional/'),
    ('Función Principal de Instituto','https://lacajacofrade.es/hermandad-juncal-cartel-salida-procesional/')
  ) d(cult_title,source_url) on d.cult_title=c.title
  where c.brotherhood_entity_id=(select id from public.entities where slug='juncal-sevilla') and co.year=2026
)
insert into public.source_links(source_id,cult_occurrence_id,scope,notes)
select s.id,x.occurrence_id,'Edición 2026','Fecha y horario publicados en la convocatoria de la edición.'
from occurrence_sources x join public.sources s on s.url=x.source_url
where not exists(select 1 from public.source_links sl where sl.source_id=s.id and sl.cult_occurrence_id=x.occurrence_id);

-- Salidas: Gloria y cultos externos separados; las extraordinarias quedan en histórico.
with series_data(outing_type,title,month,date_rule,description,display_order) as (
  values
    ('Procesión de gloria','Salida procesional de Nuestra Señora del Juncal',9::smallint,'Septiembre; fecha concreta según calendario anual','Salida letífica de la patrona popular del barrio por su feligresía.',10),
    ('Vía Crucis','Vía Crucis de Nuestro Padre Jesús Cautivo en Su Soledad',3::smallint,'Viernes de Dolores','Culto externo cuaresmal por las calles de la feligresía.',20),
    ('Procesión de impedidos','Procesión de Enfermos e Impedidos',5::smallint,'Mayo; fecha concreta según calendario anual','Procesión eucarística organizada por la Hermandad desde 1969.',30)
)
insert into public.outing_series(brotherhood_entity_id,outing_type,character,title,month,date_rule,municipality_id,origin_place_id,destination_place_id,route_summary,description,display_order,status,notes)
select h.id,d.outing_type,'ordinary',d.title,d.month,d.date_rule,m.id,p.id,p.id,'Parroquia de Nuestra Señora del Juncal · feligresía · regreso a la Parroquia.',d.description,d.display_order,'published','La serie estable se separa de sus ediciones anuales.'
from series_data d join public.entities h on h.slug='juncal-sevilla' join public.municipalities m on m.slug='sevilla' join public.places p on p.slug='parroquia-nuestra-senora-juncal-sevilla'
where not exists(select 1 from public.outing_series os where os.brotherhood_entity_id=h.id and os.outing_type=d.outing_type and os.status<>'archived');

insert into public.outings(brotherhood_entity_id,outing_type,character,title,outing_date,year,municipality_id,origin_place_id,destination_place_id,route_summary,route,description,public_notes,event_status,status,outing_series_id,slug,reference_code,origin_text,destination_text)
select h.id,'Procesión de gloria','ordinary','Salida procesional de Nuestra Señora del Juncal 2026',date '2026-09-12',2026,m.id,p.id,p.id,
  'Plaza del Sella · feligresía del Juncal · regreso a Plaza del Sella.',
  jsonb_build_object('itineraries',jsonb_build_array(jsonb_build_object('id','route','label','Recorrido','points',jsonb_build_array(
    jsonb_build_object('id','p01','role','start','label','Plaza del Sella'),jsonb_build_object('id','p02','role','stop','label','Araquil'),jsonb_build_object('id','p03','role','stop','label','Alberche'),jsonb_build_object('id','p04','role','stop','label','Avenida Alcalde Juan Fernández'),jsonb_build_object('id','p05','role','stop','label','Claudio Guerín'),jsonb_build_object('id','p06','role','stop','label','Madre Isabel Moreno'),jsonb_build_object('id','p07','role','stop','label','Pablo Legote'),jsonb_build_object('id','p08','role','stop','label','Avenida Ramón y Cajal'),jsonb_build_object('id','p09','role','stop','label','Deva'),jsonb_build_object('id','p10','role','stop','label','Tambre'),jsonb_build_object('id','p11','role','stop','label','Almar'),jsonb_build_object('id','p12','role','stop','label','Segre'),jsonb_build_object('id','p13','role','stop','label','Guadiato'),jsonb_build_object('id','p14','role','stop','label','Lozoya'),jsonb_build_object('id','p15','role','stop','label','Plaza del Juncal'),jsonb_build_object('id','p16','role','stop','label','Avenida Alcalde Juan Fernández'),jsonb_build_object('id','p17','role','stop','label','Nalón'),jsonb_build_object('id','p18','role','stop','label','Araquil'),jsonb_build_object('id','p19','role','end','label','Plaza del Sella')
  )))),
  'Salida anual de Nuestra Señora del Juncal por las calles del barrio, con la Banda de Música de la Cruz Roja.','Convocatoria vigente en el corte editorial; no se anticipa su celebración.','announced','published',os.id,'nuestra-senora-juncal-salida-2026','JUNCAL-GLORIA-2026',p.name,p.name
from public.entities h join public.municipalities m on m.slug='sevilla' join public.places p on p.slug='parroquia-nuestra-senora-juncal-sevilla' join public.outing_series os on os.brotherhood_entity_id=h.id and os.outing_type='Procesión de gloria'
where h.slug='juncal-sevilla' and not exists(select 1 from public.outings o where o.slug='nuestra-senora-juncal-salida-2026');

insert into public.outings(brotherhood_entity_id,outing_type,character,title,outing_date,year,municipality_id,origin_place_id,destination_place_id,route_summary,description,public_notes,event_status,status,outing_series_id,slug,reference_code,origin_text,destination_text)
select h.id,'Vía Crucis','ordinary','Vía Crucis de Nuestro Padre Jesús Cautivo en Su Soledad 2026',date '2026-03-27',2026,m.id,p.id,p.id,'Parroquia de Nuestra Señora del Juncal · calles de la feligresía · regreso a la Parroquia.','Vía Crucis externo convocado para el Viernes de Dolores de 2026.','La fuente localizada es una convocatoria; no se transforma en celebración sin memoria posterior.','announced','published',os.id,'via-crucis-cautivo-juncal-2026','JUNCAL-VIACRUCIS-2026',p.name,p.name
from public.entities h join public.municipalities m on m.slug='sevilla' join public.places p on p.slug='parroquia-nuestra-senora-juncal-sevilla' join public.outing_series os on os.brotherhood_entity_id=h.id and os.outing_type='Vía Crucis'
where h.slug='juncal-sevilla' and not exists(select 1 from public.outings o where o.slug='via-crucis-cautivo-juncal-2026');

insert into public.outings(brotherhood_entity_id,outing_type,character,title,outing_date,year,municipality_id,origin_place_id,destination_place_id,reason,route_summary,description,event_status,status,slug,reference_code,origin_text,destination_text)
select h.id,'Rosario de la Aurora','extraordinary','Rosario de la Aurora por el XXV aniversario fundacional',date '1993-06-20',1993,m.id,p.id,null,'XXV aniversario de la fundación de la Hermandad','Parroquia del Juncal · barriada de Híspalis.','Nuestra Señora del Juncal fue llevada en Rosario de la Aurora a Híspalis, donde se celebró una misa de acción de gracias.','held','published','juncal-rosario-aurora-xxv-aniversario-1993','JUNCAL-EXTRA-1993',p.name,'Barriada de Híspalis'
from public.entities h join public.municipalities m on m.slug='sevilla' join public.places p on p.slug='parroquia-nuestra-senora-juncal-sevilla'
where h.slug='juncal-sevilla' and not exists(select 1 from public.outings o where o.slug='juncal-rosario-aurora-xxv-aniversario-1993');

insert into public.outings(brotherhood_entity_id,outing_type,character,title,year,municipality_id,origin_place_id,destination_place_id,reason,route_summary,description,event_status,status,slug,reference_code,origin_text,destination_text)
select h.id,'Procesión extraordinaria','extraordinary','Procesión extraordinaria de Nuestro Padre Jesús Cautivo en Su Soledad',1998,m.id,p.id,p.id,'XXV aniversario de la cesión de la imagen por la Hermandad de los Panaderos','Parroquia de Nuestra Señora del Juncal · calles del barrio · regreso a la Parroquia.','Procesión extraordinaria celebrada en diciembre de 1998, portada por la cuadrilla de hermanos costaleros de la Hermandad de los Panaderos.','held','published','juncal-cautivo-extraordinaria-1998','JUNCAL-EXTRA-1998',p.name,p.name
from public.entities h join public.municipalities m on m.slug='sevilla' join public.places p on p.slug='parroquia-nuestra-senora-juncal-sevilla'
where h.slug='juncal-sevilla' and not exists(select 1 from public.outings o where o.slug='juncal-cautivo-extraordinaria-1998');

with outing_entities_data(outing_slug,entity_slug,role,notes) as (
  values
    ('nuestra-senora-juncal-salida-2026','nuestra-senora-juncal-sevilla','processional_image','Titular que preside la salida de Gloria.'),
    ('via-crucis-cautivo-juncal-2026','jesus-cautivo-soledad-juncal-sevilla','processional_image','Titular que preside el Vía Crucis.'),
    ('juncal-rosario-aurora-xxv-aniversario-1993','nuestra-senora-juncal-sevilla','processional_image','Titular llevada en el Rosario extraordinario.'),
    ('juncal-cautivo-extraordinaria-1998','jesus-cautivo-soledad-juncal-sevilla','processional_image','Titular de la procesión extraordinaria.')
)
insert into public.outing_entities(outing_id,entity_id,role,notes)
select o.id,e.id,d.role,d.notes from outing_entities_data d join public.outings o on o.slug=d.outing_slug join public.entities e on e.slug=d.entity_slug
on conflict(outing_id,entity_id,role) do update set notes=excluded.notes;

insert into public.outing_music_positions(outing_id,step_entity_id,position_code,position_label,sequence_no,notes,status)
select o.id,st.id,'behind_glory','Tras el paso de Nuestra Señora del Juncal',1,'Acompañamiento anunciado para el recorrido completo.','published'
from public.outings o join public.entities st on st.slug='paso-procesional-nuestra-senora-juncal'
where o.slug='nuestra-senora-juncal-salida-2026'
on conflict(outing_id,sequence_no) do update set step_entity_id=excluded.step_entity_id,position_code=excluded.position_code,position_label=excluded.position_label,notes=excluded.notes,status='published',updated_at=now();

insert into public.outing_music_assignments(music_position_id,band_entity_id,participation_mode,sequence_no,notes,status)
select op.id,b.id,'full_route',1,'Banda de Música de la Cruz Roja de Sevilla, anunciada para la salida de 2026.','published'
from public.outing_music_positions op join public.outings o on o.id=op.outing_id join public.entities b on b.slug='banda-musica-cruz-roja-sevilla'
where o.slug='nuestra-senora-juncal-salida-2026'
  and not exists(select 1 from public.outing_music_assignments oma where oma.music_position_id=op.id and oma.band_entity_id=b.id and oma.sequence_no=1);

insert into public.accompaniments(outing_id,band_entity_id,step_entity_id,position,year,notes,status)
select o.id,b.id,st.id,'Tras el paso de Nuestra Señora del Juncal',2026,'Acompañamiento anunciado para la salida de Gloria de 2026.','published'
from public.outings o join public.entities b on b.slug='banda-musica-cruz-roja-sevilla' join public.entities st on st.slug='paso-procesional-nuestra-senora-juncal'
where o.slug='nuestra-senora-juncal-salida-2026'
  and not exists(select 1 from public.accompaniments a where a.outing_id=o.id and a.band_entity_id=b.id and a.step_entity_id=st.id and a.year=2026);

with outing_source_data(outing_slug,source_url,scope,notes) as (
  values
    ('nuestra-senora-juncal-salida-2026','https://lacajacofrade.es/hermandad-juncal-cartel-salida-procesional/','Salida anunciada · 2026','Fecha, itinerario, titular y música publicados antes de la salida.'),
    ('via-crucis-cautivo-juncal-2026','https://www.artesacro.org/Noticia/Ver/166481/hermandad-juncal-presenta-su-calendario-cultos-y-actos-cuaresma-2026','Culto externo anunciado · 2026','Convocatoria cuaresmal sin memoria posterior localizada.'),
    ('juncal-rosario-aurora-xxv-aniversario-1993','https://hermandaddeljuncal.blogspot.com/p/blog-page_3.html','Histórico · salida extraordinaria','Crónica retrospectiva oficial del XXV aniversario.'),
    ('juncal-cautivo-extraordinaria-1998','https://hermandaddeljuncal.blogspot.com/p/blog-page_3.html','Histórico · salida extraordinaria','Crónica retrospectiva oficial del XXV aniversario de la cesión.')
)
insert into public.source_links(source_id,outing_id,scope,notes)
select s.id,o.id,d.scope,d.notes from outing_source_data d join public.sources s on s.url=d.source_url join public.outings o on o.slug=d.outing_slug
where not exists(select 1 from public.source_links sl where sl.source_id=s.id and sl.outing_id=o.id and sl.scope=d.scope);

with series_sources(outing_type,source_url) as (
  values
    ('Procesión de gloria','https://hermandaddeljuncal.blogspot.com/p/blog-page_3.html'),
    ('Vía Crucis','https://hermandaddeljuncal.blogspot.com/p/titulares.html'),
    ('Procesión de impedidos','https://hermandaddeljuncal.blogspot.com/p/titulares.html')
)
insert into public.source_links(source_id,outing_series_id,scope,notes)
select s.id,os.id,'Salida habitual','Periodicidad y carácter publicados por la propia Hermandad.'
from series_sources d join public.sources s on s.url=d.source_url join public.outing_series os on os.brotherhood_entity_id=(select id from public.entities where slug='juncal-sevilla') and os.outing_type=d.outing_type
where not exists(select 1 from public.source_links sl where sl.source_id=s.id and sl.outing_series_id=os.id);

insert into public.source_links(source_id,outing_music_position_id,scope,notes)
select s.id,op.id,'Posición musical · salida 2026','La banda acompaña al paso de la Virgen en la salida anunciada.'
from public.sources s join public.outing_music_positions op on true join public.outings o on o.id=op.outing_id
where s.url='https://lacajacofrade.es/hermandad-juncal-cartel-salida-procesional/' and o.slug='nuestra-senora-juncal-salida-2026'
  and not exists(select 1 from public.source_links sl where sl.source_id=s.id and sl.outing_music_position_id=op.id);

insert into public.source_links(source_id,outing_music_assignment_id,scope,notes)
select s.id,oma.id,'Acompañamiento musical · salida 2026','Formación y posición documentadas para la edición de 2026.'
from public.sources s join public.outing_music_assignments oma on true join public.outing_music_positions op on op.id=oma.music_position_id join public.outings o on o.id=op.outing_id
where s.url='https://lacajacofrade.es/hermandad-juncal-cartel-salida-procesional/' and o.slug='nuestra-senora-juncal-salida-2026'
  and not exists(select 1 from public.source_links sl where sl.source_id=s.id and sl.outing_music_assignment_id=oma.id);

do $$
declare
  h_id uuid := (select id from public.entities where slug='juncal-sevilla');
  completion integer;
begin
  if (select count(*) from public.entity_locations where entity_id=h_id and status='published' and is_current) <> 1 then raise exception 'La sede canónica no quedó unívoca'; end if;
  if (select count(*) from public.brotherhood_images where brotherhood_entity_id=h_id and status='published') <> 3 then raise exception 'Los tres titulares visuales no quedaron publicados'; end if;
  if (select count(*) from public.image_authorships ia join public.brotherhood_images bi on bi.image_entity_id=ia.image_entity_id where bi.brotherhood_entity_id=h_id and ia.status='published') <> 3 then raise exception 'Las tres autorías o atribuciones no quedaron documentadas'; end if;
  if (select count(*) from public.image_steps ix join public.entities st on st.id=ix.step_entity_id where ix.image_entity_id=(select id from public.entities where slug='nuestra-senora-juncal-sevilla') and st.slug='paso-procesional-nuestra-senora-juncal' and ix.status='published') <> 1 then raise exception 'La Virgen no quedó ligada a su paso'; end if;
  if (select count(*) from public.heritage_assets where parent_entity_id=(select id from public.entities where slug='paso-procesional-nuestra-senora-juncal') and is_current) <> 4 then raise exception 'El patrimonio del paso no quedó completo'; end if;
  if (select count(*) from public.cults where brotherhood_entity_id=h_id and status='published') <> 9 then raise exception 'Los nueve cultos recurrentes no quedaron publicados'; end if;
  if (select count(*) from public.cult_occurrences co join public.cults c on c.id=co.cult_id where c.brotherhood_entity_id=h_id and co.year=2026 and co.status='published') <> 7 then raise exception 'Las siete ocurrencias de 2026 no quedaron publicadas'; end if;
  if (select count(*) from public.outing_series where brotherhood_entity_id=h_id and status='published') <> 3 then raise exception 'Las tres salidas habituales no quedaron separadas'; end if;
  if (select count(*) from public.outings where brotherhood_entity_id=h_id and status='published') <> 4 then raise exception 'Las cuatro salidas documentadas no quedaron publicadas'; end if;
  if exists(select 1 from public.outings o where o.brotherhood_entity_id=h_id and o.status='published' and not exists(select 1 from public.source_links sl where sl.outing_id=o.id)) then raise exception 'Existe una salida publicada sin fuente'; end if;
  if exists(select 1 from public.outings where brotherhood_entity_id=h_id and outing_date>date '2026-09-06' and event_status='held') then raise exception 'Existe una salida futura marcada como celebrada'; end if;
  if (select count(*) from public.outing_music_assignments oma join public.outing_music_positions op on op.id=oma.music_position_id join public.outings o on o.id=op.outing_id where o.brotherhood_entity_id=h_id and oma.status='published') <> 1 then raise exception 'La música de la salida de 2026 no quedó vinculada'; end if;
  select completion_percentage into completion from public.brotherhood_completeness where entity_id=h_id;
  if completion <> 100 then raise exception 'La ficha técnica de El Juncal queda en % en vez de 100',completion; end if;
end $$;
