-- Hilo Cofrade · cierre documental de la Hermandad de los Negritos
-- Corte editorial: 2026-09-06
-- Solo DML editorial. Sin DDL, nuevas tablas, RLS ni arquitectura.

do $$
begin
  if (select count(*) from public.entities where slug='hermandad-de-los-negritos' and entity_type='brotherhood') <> 1 then
    raise exception 'La ficha canónica de Los Negritos no es unívoca';
  end if;
  if (select count(*) from public.march_dedications md join public.entities i on i.id=md.dedicatee_entity_id where i.slug='nuestra-senora-de-los-angeles-negritos' and md.status='published') < 1 then
    raise exception 'La dedicatoria musical previa de la Virgen de los Negritos no está intacta';
  end if;
end $$;

with source_data(name,url,source_type,publisher,publication_date,notes) as (
  values
    ('Los Negritos · Historia','https://www.hermandadlosnegritos.org/hermandad/historia/','Web oficial','Hermandad de los Negritos',null::date,'Origen bajomedieval, fundador, traslado y primeras Reglas.'),
    ('Los Negritos · Cristo de la Fundación','https://www.hermandadlosnegritos.org/cristo-de-la-fundacion/','Web oficial','Hermandad de los Negritos',null::date,'Autoría, fecha, adquisición e iconografía del crucificado.'),
    ('Los Negritos · Nuestra Señora de los Ángeles','https://www.hermandadlosnegritos.org/nuestra-senora-de-los-angeles/','Web oficial','Hermandad de los Negritos',null::date,'Cronología, transformaciones y coronación pontificia de la dolorosa.'),
    ('Los Negritos · Cultos 2026','https://www.hermandadlosnegritos.org/vida-de-la-hdad/cultos/','Web oficial','Hermandad de los Negritos',null::date,'Calendario anual oficial de cultos para 2026.'),
    ('Los Negritos · Triduo 2026','https://www.hermandadlosnegritos.org/triduo-y-funcion-solemne-a-la-virgen-de-los-angeles-coronada/','Web oficial','Hermandad de los Negritos',date '2026-07-19','Convocatoria del triduo, función y Jubileo Circular de agosto de 2026.'),
    ('Los Negritos · Contacto','https://www.hermandadlosnegritos.org/mail/','Web oficial','Hermandad de los Negritos',null::date,'Dirección y horario de apertura de la capilla.'),
    ('Los Negritos · Cargos de confianza 2026','https://www.hermandadlosnegritos.org/nombramiento-de-los-cargos-de-confianza/','Web oficial','Hermandad de los Negritos',date '2026-07-22','Capataces ratificados el 21 de julio de 2026.'),
    ('Los Negritos · Archivo musical','https://www.hermandadlosnegritos.org/archivos/musical/','Web oficial','Hermandad de los Negritos',null::date,'Patrimonio musical dedicado a los titulares.'),
    ('Consejo de Hermandades · Los Negritos','https://www.hermandades-de-sevilla.org/semanasanta/js_los_negritos.html','Fuente institucional','Consejo General de Hermandades y Cofradías de Sevilla',null::date,'Título, sede, hábito, pasos, patrimonio y acompañamientos musicales.'),
    ('Jueves Santo 2026 · Los Negritos','https://cadenaser.com/andalucia/2026/04/02/las-hermandades-del-jueves-santo-estaran-15-minutos-mas-en-carrera-oficial-radio-sevilla/','Medio generalista','Cadena SER',date '2026-04-02','Horarios e itinerario anunciados para la estación de penitencia de 2026.'),
    ('Vía Crucis del Consejo · 1977','https://www.hermandades-de-sevilla.org/13957-2/hermandades-viacrucis-consejo/','Fuente institucional','Consejo General de Hermandades y Cofradías de Sevilla',null::date,'Relación histórica de imágenes que presidieron el Vía Crucis de las Cofradías.'),
    ('Coronación de la Virgen de los Ángeles · programa','https://www.sevillaactualidad.com/cofradias/125703-un-extenso-programa-marca-la-coronacion-de-la-virgen-de-los-angeles/','Medio generalista','Sevilla Actualidad',date '2019-02-19','Programa de traslados y salida de la coronación pontificia de 2019.'),
    ('Salidas extraordinarias andaluzas de 2019','https://paliodeplata.com/noticias/salidas-extraordinarias-en-andalucia-2019/','Medio especializado','Palio de Plata',null::date,'Relación retrospectiva de salidas extraordinarias celebradas en 2019.')
)
insert into public.sources(name,url,source_type,author_or_publisher,publication_date,accessed_at,notes)
select name,url,source_type,publisher,publication_date,date '2026-09-06',notes from source_data d
where not exists(select 1 from public.sources s where s.url=d.url);

update public.entities set
  name='Hermandad de los Negritos',
  summary='Antigua corporación sevillana de penitencia, con raíces en una hermandad de negros fundada a finales del siglo XIV y sede en la Capilla de Nuestra Señora de los Ángeles.',
  status='published',updated_at=now()
where slug='hermandad-de-los-negritos';

update public.brotherhoods set
  official_name='Muy Antigua, Pontificia y Franciscana Hermandad y Cofradía de Nazarenos del Santísimo Cristo de la Fundación y Nuestra Señora de los Ángeles Coronada',
  popular_name='Los Negritos',foundation_text='Finales del siglo XIV; tradicionalmente, 1393',
  neighborhood='San Roque',website_url='https://www.hermandadlosnegritos.org/',
  crest_path='https://www.hermandadlosnegritos.org/prueba/wp-content/uploads/2012/04/logohermandad.png',
  brotherhood_types=array['Penitencia'],current_procession_day='Jueves Santo',
  history_text='La corporación hunde sus raíces en la hermandad de negros vinculada al hospital promovido por el arzobispo Gonzalo de Mena a finales del siglo XIV. Tras distintos emplazamientos, se estableció en el actual solar en 1550 y aprobó Reglas en 1554. Su continuidad histórica, la devoción al Cristo de la Fundación y a Nuestra Señora de los Ángeles y su singular identidad franciscana forman uno de los testimonios más antiguos de la religiosidad afrodescendiente en Sevilla.',
  notes='Sede canónica en la Capilla de Nuestra Señora de los Ángeles, calle Recaredo, 19. Estación de penitencia el Jueves Santo.'
where entity_id=(select id from public.entities where slug='hermandad-de-los-negritos');

insert into public.places(municipality_id,name,slug,place_type,address,opening_hours_text,opening_hours_verified_at,notes)
select m.id,'Capilla de Nuestra Señora de los Ángeles','capilla-nuestra-senora-angeles-negritos-sevilla','Capilla','Calle Recaredo, 19, 41003 Sevilla','Lunes a sábado, 18:00–20:00; domingos, 10:00–12:00.',date '2026-09-06','Sede canónica de la Hermandad de los Negritos.'
from public.municipalities m where m.slug='sevilla' and not exists(select 1 from public.places where slug='capilla-nuestra-senora-angeles-negritos-sevilla');

update public.places set opening_hours_text='Lunes a sábado, 18:00–20:00; domingos, 10:00–12:00.',opening_hours_verified_at=date '2026-09-06',updated_at=now()
where slug='capilla-nuestra-senora-angeles-negritos-sevilla';

update public.brotherhoods set canonical_see_place_id=(select id from public.places where slug='capilla-nuestra-senora-angeles-negritos-sevilla')
where entity_id=(select id from public.entities where slug='hermandad-de-los-negritos');

insert into public.entity_locations(entity_id,place_id,municipality_id,location_type,date_from_text,is_current,notes,status)
select h.id,p.id,m.id,'Sede canónica','Desde 1550',true,'Capilla propia en la calle Recaredo, 19.','published'
from public.entities h join public.places p on p.slug='capilla-nuestra-senora-angeles-negritos-sevilla' join public.municipalities m on m.slug='sevilla'
where h.slug='hermandad-de-los-negritos' and not exists(select 1 from public.entity_locations el where el.entity_id=h.id and el.place_id=p.id and el.is_current and el.status<>'archived');

with color_data(color_name,hex_value,color_role,sort_order,notes) as (
 values ('Azul corporativo','#2F5D91','primary',10,'Azul asociado al escapulario y cordón del hábito.'),('Blanco','#FFFFFF','identity',20,'Blanco de la túnica de cola.'),('Celeste','#66B8D4','secondary',30,'Matiz complementario para fondos y acentos de la ficha.')
)
insert into public.brotherhood_colors(brotherhood_entity_id,color_name,hex_value,color_role,sort_order,notes,status)
select h.id,d.color_name,d.hex_value,d.color_role,d.sort_order,d.notes,'published' from color_data d join public.entities h on h.slug='hermandad-de-los-negritos'
on conflict(brotherhood_entity_id,color_name) do update set hex_value=excluded.hex_value,color_role=excluded.color_role,sort_order=excluded.sort_order,notes=excluded.notes,status='published',updated_at=now();

insert into public.brotherhood_habits(brotherhood_entity_id,name,tunic_description,hood_description,cord_description,footwear_description,sort_order,notes,status)
select h.id,'Hábito nazareno','Túnica blanca de cola.','Antifaz blanco.','Cordón y escapulario azules.','Sandalias negras de dos tiras.',10,'Descripción institucional del hábito de la cofradía.','published'
from public.entities h where h.slug='hermandad-de-los-negritos'
on conflict(brotherhood_entity_id,name) do update set tunic_description=excluded.tunic_description,hood_description=excluded.hood_description,cord_description=excluded.cord_description,footwear_description=excluded.footwear_description,notes=excluded.notes,status='published',updated_at=now();

insert into public.entities(entity_type,name,slug,summary,status)
select 'image','Santísimo Cristo de la Fundación','santisimo-cristo-fundacion-negritos','Crucificado manierista realizado por Andrés de Ocampo en 1622.','published'
where not exists(select 1 from public.entities where slug='santisimo-cristo-fundacion-negritos');

update public.entities set name='Nuestra Señora de los Ángeles Coronada',summary='Dolorosa anónima documentada en la primera mitad del siglo XVII, transformada en el siglo XX y coronada pontificiamente en 2019.',status='published',updated_at=now()
where slug='nuestra-senora-de-los-angeles-negritos';

insert into public.images(entity_id,image_type,execution_date_text,material,current_condition,description,iconography,is_dress_image,current_state_notes)
select e.id,'Crucificado','1622','Madera tallada y policromada','extant','Crucificado manierista adquirido en 1622 a Pablo Legot por 1.400 reales y documentado como obra de Andrés de Ocampo.','Cristo muerto en la cruz.',false,'Titular cristífero de la corporación.' from public.entities e where e.slug='santisimo-cristo-fundacion-negritos'
on conflict(entity_id) do update set image_type=excluded.image_type,execution_date_text=excluded.execution_date_text,material=excluded.material,current_condition=excluded.current_condition,description=excluded.description,iconography=excluded.iconography,is_dress_image=excluded.is_dress_image,current_state_notes=excluded.current_state_notes;

insert into public.images(entity_id,image_type,execution_date_text,material,current_condition,description,iconography,is_dress_image,current_state_notes)
select e.id,'Dolorosa','Primera mitad del siglo XVII; posible morfología de finales del XVI','Madera tallada y policromada','extant','Imagen anónima profundamente transformada por Juan Miguel Sánchez en 1952 y Antonio Dubé de Luque en 1984, con su actual fisonomía de Virgen Niña.','María dolorosa bajo la advocación de los Ángeles.',true,'Coronada pontificiamente el 18 de mayo de 2019.' from public.entities e where e.slug='nuestra-senora-de-los-angeles-negritos'
on conflict(entity_id) do update set image_type=excluded.image_type,execution_date_text=excluded.execution_date_text,material=excluded.material,current_condition=excluded.current_condition,description=excluded.description,iconography=excluded.iconography,is_dress_image=excluded.is_dress_image,current_state_notes=excluded.current_state_notes;

with rel(image_slug,date_text,notes) as (values ('santisimo-cristo-fundacion-negritos','Desde 1622','Titular cristífero.'),('nuestra-senora-de-los-angeles-negritos','Documentada desde el siglo XVII','Titular mariana coronada pontificiamente.'))
insert into public.brotherhood_images(brotherhood_entity_id,image_entity_id,relation_type,date_from_text,notes,status)
select h.id,i.id,'titular',d.date_text,d.notes,'published' from rel d join public.entities h on h.slug='hermandad-de-los-negritos' join public.entities i on i.slug=d.image_slug
where not exists(select 1 from public.brotherhood_images bi where bi.brotherhood_entity_id=h.id and bi.image_entity_id=i.id and bi.relation_type='titular' and bi.status<>'archived');

update public.brotherhood_images set status='published'
where brotherhood_entity_id=(select id from public.entities where slug='hermandad-de-los-negritos')
  and image_entity_id in (select id from public.entities where slug in ('santisimo-cristo-fundacion-negritos','nuestra-senora-de-los-angeles-negritos'))
  and relation_type='titular' and status<>'archived';

with agent_data(name,slug,kind,summary) as (values
 ('Andrés de Ocampo','andres-de-ocampo','person','Escultor e imaginero, autor del Cristo de la Fundación.'),
 ('Juan Miguel Sánchez','juan-miguel-sanchez','person','Pintor y diseñador sevillano, responsable de la transformación de la Virgen en 1952 y del diseño del palio.'),
 ('Antonio Hierro Pastor','antonio-hierro-pastor','person','Capataz del paso del Cristo de la Fundación.'),
 ('Hermanos Gallego Rodríguez','hermanos-gallego-rodriguez','institution','Equipo de capataces del paso de Nuestra Señora de los Ángeles.'),
 ('Capilla Musical Ars Sacra','capilla-musical-ars-sacra','institution','Formación de música de capilla.'),
 ('Grupo de Voces Graves De Profundis','grupo-voces-graves-de-profundis','institution','Conjunto vocal de voces graves.')
)
insert into public.entities(entity_type,name,slug,summary,status) select case when slug like 'capilla-musical%' or slug like 'grupo-voces%' then 'band' else 'agent' end,name,slug,summary,'published' from agent_data d
where not exists(select 1 from public.entities e where e.slug=d.slug);

with agent_data(slug,kind,summary) as (values
 ('andres-de-ocampo','person','Escultor e imaginero, autor del Cristo de la Fundación.'),('juan-miguel-sanchez','person','Pintor y diseñador sevillano.'),('antonio-hierro-pastor','person','Capataz del Cristo de la Fundación.'),('hermanos-gallego-rodriguez','institution','Equipo de capataces del palio de los Ángeles.')
)
insert into public.agents(entity_id,agent_kind,description) select e.id,d.kind,d.summary from agent_data d join public.entities e on e.slug=d.slug
on conflict(entity_id) do update set agent_kind=excluded.agent_kind,description=excluded.description;

with band_data(slug,band_type,description) as (values ('capilla-musical-ars-sacra','Capilla musical','Formación que acompaña al Cristo de la Fundación.'),('grupo-voces-graves-de-profundis','Música vocal','Grupo que acompaña con voces graves al Cristo de la Fundación.'))
insert into public.bands(entity_id,band_type,description) select e.id,d.band_type,d.description from band_data d join public.entities e on e.slug=d.slug
on conflict(entity_id) do update set band_type=excluded.band_type,description=excluded.description;

insert into public.image_authorships(image_entity_id,agent_entity_id,authorship_type,role_name,date_from_text,certainty,notes,status)
select i.id,a.id,'author','Escultor','1622','documented','Autoría documentada por la Hermandad.','published' from public.entities i join public.entities a on a.slug='andres-de-ocampo' where i.slug='santisimo-cristo-fundacion-negritos'
and not exists(select 1 from public.image_authorships ia where ia.image_entity_id=i.id and ia.agent_entity_id=a.id and ia.authorship_type='author');

insert into public.image_authorships(image_entity_id,agent_entity_id,authorship_type,role_name,date_from_text,certainty,notes,status)
select i.id,null,'anonymous','Autor desconocido','Primera mitad del siglo XVII','unknown','La autoría permanece anónima.','published' from public.entities i where i.slug='nuestra-senora-de-los-angeles-negritos'
and not exists(select 1 from public.image_authorships ia where ia.image_entity_id=i.id and ia.authorship_type='anonymous');

with intervention_data(agent_slug,date_text,description) as (values ('juan-miguel-sanchez','1952','Transformación de la imagen y definición de una nueva fisonomía.'),('antonio-dube-de-luque','1984','Intervención que consolidó la actual configuración de Virgen Niña.'))
insert into public.heritage_interventions(target_entity_id,agent_entity_id,discipline,element_name,intervention_type,date_from_text,description,status)
select i.id,a.id,'Imaginería','Nuestra Señora de los Ángeles','Transformación',d.date_text,d.description,'published' from intervention_data d join public.entities i on i.slug='nuestra-senora-de-los-angeles-negritos' join public.entities a on a.slug=d.agent_slug
where not exists(select 1 from public.heritage_interventions hi where hi.target_entity_id=i.id and hi.agent_entity_id=a.id and hi.date_from_text=d.date_text);

with step_data(name,slug,step_type,description,date_text,style,materials) as (values
 ('Paso del Santísimo Cristo de la Fundación','paso-cristo-fundacion-negritos','Misterio','Paso de caoba de Cuba tallado por Francisco Domínguez y estrenado en 1925.','1925','Neobarroco','Caoba de Cuba'),
 ('Paso de palio de Nuestra Señora de los Ángeles','paso-palio-virgen-angeles-negritos','Palio','Conjunto de palio diseñado por Juan Miguel Sánchez, con bordados de las Trinitarias y orfebrería de Manuel Seco y Ramón León.','Siglos XX–XXI','Diseño regionalista','Bordado y orfebrería')
)
insert into public.entities(entity_type,name,slug,summary,status) select 'step',name,slug,description,'published' from step_data d where not exists(select 1 from public.entities e where e.slug=d.slug);

with step_data(slug,step_type,description,date_text,style,materials) as (values
 ('paso-cristo-fundacion-negritos','Misterio','Paso de caoba de Cuba tallado por Francisco Domínguez y estrenado en 1925.','1925','Neobarroco','Caoba de Cuba'),
 ('paso-palio-virgen-angeles-negritos','Palio','Palio diseñado por Juan Miguel Sánchez, bordado por las Trinitarias; varales y candelería de Manuel Seco, y respiraderos y peana de Ramón León.','Siglos XX–XXI','Diseño regionalista','Bordado y orfebrería')
)
insert into public.steps(entity_id,step_type,current_condition,description,execution_date_text,style,materials,current_state_notes)
select e.id,d.step_type,'preserved',d.description,d.date_text,d.style,d.materials,'Conjunto procesional vigente.' from step_data d join public.entities e on e.slug=d.slug
on conflict(entity_id) do update set step_type=excluded.step_type,current_condition=excluded.current_condition,description=excluded.description,execution_date_text=excluded.execution_date_text,style=excluded.style,materials=excluded.materials,current_state_notes=excluded.current_state_notes;

with rel(step_slug,notes) as (values ('paso-cristo-fundacion-negritos','Primer paso de la cofradía.'),('paso-palio-virgen-angeles-negritos','Segundo paso de la cofradía.'))
insert into public.brotherhood_steps(brotherhood_entity_id,step_entity_id,relation_type,notes,status)
select h.id,s.id,'processional_step',d.notes,'published' from rel d join public.entities h on h.slug='hermandad-de-los-negritos' join public.entities s on s.slug=d.step_slug
where not exists(select 1 from public.brotherhood_steps bs where bs.brotherhood_entity_id=h.id and bs.step_entity_id=s.id and bs.status<>'archived');

with rel(image_slug,step_slug) as (values ('santisimo-cristo-fundacion-negritos','paso-cristo-fundacion-negritos'),('nuestra-senora-de-los-angeles-negritos','paso-palio-virgen-angeles-negritos'))
insert into public.image_steps(image_entity_id,step_entity_id,relation_type,date_from_text,notes,status)
select i.id,s.id,'processes_on','Vigente en 2026','Titular y paso vinculados en la estación de penitencia.','published' from rel d join public.entities i on i.slug=d.image_slug join public.entities s on s.slug=d.step_slug
where not exists(select 1 from public.image_steps x where x.image_entity_id=i.id and x.step_entity_id=s.id and x.status<>'archived');

with asset_data(parent_slug,name,slug,asset_type,description,date_text,materials,display_order) as (values
 ('paso-cristo-fundacion-negritos','Canasto de caoba del Cristo de la Fundación','canasto-caoba-cristo-fundacion-negritos','Canasto','Canasto tallado por Francisco Domínguez para el paso del Cristo.','1925','Caoba de Cuba',10),
 ('paso-palio-virgen-angeles-negritos','Palio bordado de Nuestra Señora de los Ángeles','palio-bordado-angeles-negritos','Palio','Diseño de Juan Miguel Sánchez bordado por las religiosas Trinitarias.','Siglo XX','Terciopelo y bordado',10),
 ('paso-palio-virgen-angeles-negritos','Varales y candelería del palio','varales-candeleria-angeles-negritos','Orfebrería','Conjunto realizado por Manuel Seco.','Siglo XX','Metal plateado',20),
 ('paso-palio-virgen-angeles-negritos','Respiraderos y peana del palio','respiraderos-peana-angeles-negritos','Orfebrería','Conjunto realizado por Ramón León.','Época contemporánea','Metal plateado',30),
 ('hermandad-de-los-negritos','Simpecado histórico de los Negritos','simpecado-historico-negritos','Insignia','Simpecado carmesí con pintura mariana del siglo XVII.','Siglo XVII','Terciopelo, bordado y pintura',10),
 ('hermandad-de-los-negritos','Cruz de las Toallas','cruz-toallas-negritos','Insignia','Cruz histórica que abre el Vía Crucis de la Pía Unión el primer viernes de marzo.','Histórica','Madera y tejido',20)
)
insert into public.entities(entity_type,name,slug,summary,status) select 'heritage_asset',name,slug,description,'published' from asset_data d where not exists(select 1 from public.entities e where e.slug=d.slug);

with asset_data(parent_slug,slug,asset_type,description,date_text,materials,display_order) as (values
 ('paso-cristo-fundacion-negritos','canasto-caoba-cristo-fundacion-negritos','Canasto','Canasto tallado por Francisco Domínguez para el paso del Cristo.','1925','Caoba de Cuba',10),
 ('paso-palio-virgen-angeles-negritos','palio-bordado-angeles-negritos','Palio','Diseño de Juan Miguel Sánchez bordado por las religiosas Trinitarias.','Siglo XX','Terciopelo y bordado',10),
 ('paso-palio-virgen-angeles-negritos','varales-candeleria-angeles-negritos','Orfebrería','Conjunto realizado por Manuel Seco.','Siglo XX','Metal plateado',20),
 ('paso-palio-virgen-angeles-negritos','respiraderos-peana-angeles-negritos','Orfebrería','Conjunto realizado por Ramón León.','Época contemporánea','Metal plateado',30),
 ('hermandad-de-los-negritos','simpecado-historico-negritos','Insignia','Simpecado carmesí con pintura mariana del siglo XVII.','Siglo XVII','Terciopelo, bordado y pintura',10),
 ('hermandad-de-los-negritos','cruz-toallas-negritos','Insignia','Cruz histórica vinculada al Vía Crucis de la Pía Unión.','Histórica','Madera y tejido',20)
)
insert into public.heritage_assets(entity_id,parent_entity_id,asset_type,description,current_condition,date_from_text,is_current,materials,display_order,is_featured)
select a.id,p.id,d.asset_type,d.description,'preserved',d.date_text,true,d.materials,d.display_order,d.display_order=10 from asset_data d join public.entities a on a.slug=d.slug join public.entities p on p.slug=d.parent_slug
on conflict(entity_id) do update set parent_entity_id=excluded.parent_entity_id,asset_type=excluded.asset_type,description=excluded.description,current_condition=excluded.current_condition,date_from_text=excluded.date_from_text,is_current=true,materials=excluded.materials,display_order=excluded.display_order,is_featured=excluded.is_featured;

with personnel(step_slug,agent_slug,role_name) as (values ('paso-cristo-fundacion-negritos','antonio-hierro-pastor','Capataz'),('paso-palio-virgen-angeles-negritos','hermanos-gallego-rodriguez','Capataces'))
insert into public.step_personnel_periods(step_entity_id,agent_entity_id,role_name,date_from_text,year_from,is_current,notes,status)
select s.id,a.id,d.role_name,'Ratificados el 21 de julio de 2026',2026,true,'Cargo de confianza vigente tras la ratificación de 2026.','published' from personnel d join public.entities s on s.slug=d.step_slug join public.entities a on a.slug=d.agent_slug
where not exists(select 1 from public.step_personnel_periods sp where sp.step_entity_id=s.id and sp.agent_entity_id=a.id and sp.role_name=d.role_name and sp.is_current);

update public.music_accompaniment_periods set step_entity_id=(select id from public.entities where slug='paso-palio-virgen-angeles-negritos'),status='published',updated_at=now()
where brotherhood_entity_id=(select id from public.entities where slug='hermandad-de-los-negritos') and band_entity_id=(select id from public.entities where slug='sociedad-filarmonica-nuestra-senora-nieves-olivares') and is_current;

with music_data(band_slug,step_slug,position,outing_type,date_text,year_from,notes) as (values
 ('capilla-musical-ars-sacra','paso-cristo-fundacion-negritos','Ante el paso del Santísimo Cristo de la Fundación','Estación de penitencia','Vigente en 2026',2026,'Música de capilla junto al grupo vocal De Profundis.'),
 ('grupo-voces-graves-de-profundis','paso-cristo-fundacion-negritos','Ante el paso del Santísimo Cristo de la Fundación','Estación de penitencia','Vigente en 2026',2026,'Voces graves junto a la Capilla Musical Ars Sacra.')
)
insert into public.music_accompaniment_periods(brotherhood_entity_id,band_entity_id,step_entity_id,position,outing_type,date_from_text,year_from,is_current,notes,status,public_brotherhood_name,public_step_name,public_brotherhood_slug,public_municipality_name,public_municipality_slug)
select h.id,b.id,s.id,d.position,d.outing_type,d.date_text,d.year_from,true,d.notes,'published','Los Negritos',s.name,'hermandad-de-los-negritos','Sevilla','sevilla' from music_data d join public.entities h on h.slug='hermandad-de-los-negritos' join public.entities b on b.slug=d.band_slug join public.entities s on s.slug=d.step_slug
where not exists(select 1 from public.music_accompaniment_periods mp where mp.brotherhood_entity_id=h.id and mp.band_entity_id=b.id and mp.step_entity_id=s.id and mp.is_current);

with cult_data(image_slug,cult_type,title,date_rule,month,time_text,description,display_order) as (values
 ('santisimo-cristo-fundacion-negritos','Quinario','Solemne Quinario al Santísimo Cristo de la Fundación','Cinco días de febrero; edición anual según calendario',2,'20:00','Quinario anual dedicado al titular cristífero.',10),
 ('santisimo-cristo-fundacion-negritos','Función Principal','Función Principal de Instituto','Domingo posterior al Quinario',2,'11:30','Función principal de la corporación.',20),
 ('nuestra-senora-de-los-angeles-negritos','Función','Función del aniversario de la Coronación Pontificia','18 de mayo',5,'20:30','Conmemoración anual de la coronación pontificia.',30),
 ('nuestra-senora-de-los-angeles-negritos','Triduo','Solemne Triduo a Nuestra Señora de los Ángeles Coronada','En torno al 2 de agosto',8,'20:00','Triduo anual de la titular mariana.',40),
 ('nuestra-senora-de-los-angeles-negritos','Función','Función Solemne a Nuestra Señora de los Ángeles Coronada','2 de agosto',8,'12:00','Función solemne de la festividad.',50),
 ('nuestra-senora-de-los-angeles-negritos','Jubileo','Jubileo Circular de las XL Horas','1 al 3 de agosto',8,null,'Turno de Jubileo Circular celebrado en la capilla.',60),
 ('nuestra-senora-de-los-angeles-negritos','Besamanos','Besamanos a Nuestra Señora de los Ángeles Coronada','6 al 8 de diciembre',12,'Horario variable','Veneración anual de la titular mariana.',70),
 ('nuestra-senora-de-los-angeles-negritos','Eucaristía','Eucaristía y Salve de la Inmaculada','8 de diciembre',12,'11:30','Eucaristía y Salve ante la titular.',80)
)
insert into public.cults(brotherhood_entity_id,image_entity_id,cult_type,title,date_rule,month,time_text,place_id,description,status,is_recurring,recurrence_label,display_order,notes)
select h.id,i.id,d.cult_type,d.title,d.date_rule,d.month,d.time_text,p.id,d.description,'published',true,'Anual',d.display_order,'Calendario oficial de 2026; cada edición conserva su propio estado.' from cult_data d join public.entities h on h.slug='hermandad-de-los-negritos' join public.entities i on i.slug=d.image_slug join public.places p on p.slug='capilla-nuestra-senora-angeles-negritos-sevilla'
where not exists(select 1 from public.cults c where c.brotherhood_entity_id=h.id and c.title=d.title and c.status<>'archived');

with occ(cult_title,start_date,end_date,description) as (values
 ('Solemne Quinario al Santísimo Cristo de la Fundación',date '2026-02-17',date '2026-02-21','Días 17 a 21 de febrero, a las 20:00.'),
 ('Función Principal de Instituto',date '2026-02-22',date '2026-02-22','22 de febrero, a las 11:30.'),
 ('Función del aniversario de la Coronación Pontificia',date '2026-05-18',date '2026-05-18','18 de mayo, a las 20:30.'),
 ('Solemne Triduo a Nuestra Señora de los Ángeles Coronada',date '2026-07-31',date '2026-08-03','31 de julio, 1 y 3 de agosto, a las 20:00.'),
 ('Función Solemne a Nuestra Señora de los Ángeles Coronada',date '2026-08-02',date '2026-08-02','2 de agosto, a las 12:00.'),
 ('Jubileo Circular de las XL Horas',date '2026-08-01',date '2026-08-03','Jubileo Circular del 1 al 3 de agosto.'),
 ('Besamanos a Nuestra Señora de los Ángeles Coronada',date '2026-12-06',date '2026-12-08','Besamanos del 6 al 8 de diciembre.'),
 ('Eucaristía y Salve de la Inmaculada',date '2026-12-08',date '2026-12-08','8 de diciembre, a las 11:30.')
)
insert into public.cult_occurrences(cult_id,year,start_date,end_date,place_id,description_override,event_status,status,notes)
select c.id,2026,d.start_date,d.end_date,p.id,d.description,'announced','published','La fuente es una convocatoria; no se presume celebración sin memoria posterior.' from occ d join public.cults c on c.brotherhood_entity_id=(select id from public.entities where slug='hermandad-de-los-negritos') and c.title=d.cult_title join public.places p on p.slug='capilla-nuestra-senora-angeles-negritos-sevilla'
on conflict(cult_id,year,start_date) do update set end_date=excluded.end_date,place_id=excluded.place_id,description_override=excluded.description_override,event_status=excluded.event_status,status='published',notes=excluded.notes,updated_at=now();

insert into public.outing_series(brotherhood_entity_id,outing_type,character,title,month,date_rule,municipality_id,origin_place_id,destination_place_id,route_summary,description,display_order,status,notes)
select h.id,'Estación de penitencia','ordinary','Estación de penitencia del Jueves Santo',null,'Jueves Santo',m.id,p.id,p.id,'Capilla de los Ángeles · Carrera Oficial · Capilla de los Ángeles.','Estación de penitencia anual con dos pasos.',10,'published','Serie ordinaria separada de sus ediciones.' from public.entities h join public.municipalities m on m.slug='sevilla' join public.places p on p.slug='capilla-nuestra-senora-angeles-negritos-sevilla'
where h.slug='hermandad-de-los-negritos' and not exists(select 1 from public.outing_series os where os.brotherhood_entity_id=h.id and os.outing_type='Estación de penitencia' and os.status<>'archived');

insert into public.outings(brotherhood_entity_id,outing_type,character,title,outing_date,year,departure_time,return_time,municipality_id,origin_place_id,destination_place_id,route_summary,route,description,public_notes,event_status,status,outing_series_id,slug,reference_code,origin_text,destination_text)
select h.id,'Estación de penitencia','ordinary','Estación de penitencia de Los Negritos 2026',date '2026-04-02',2026,time '15:00',time '23:20',m.id,p.id,p.id,'Recaredo · Carrera Oficial · Recaredo.',jsonb_build_object('itineraries',jsonb_build_array(jsonb_build_object('id','route','label','Recorrido','points',(select jsonb_agg(jsonb_build_object('id','p'||lpad(n::text,2,'0'),'role',case when n=1 then 'start' when n=37 then 'end' else 'stop' end,'label',label) order by n) from (values (1,'Recaredo'),(2,'Plaza de San Agustín'),(3,'Puerta Carmona'),(4,'San Esteban'),(5,'Pilatos'),(6,'Águilas'),(7,'Alfalfa'),(8,'Jesús de las Tres Caídas'),(9,'Cuesta del Rosario'),(10,'Villegas'),(11,'Salvador'),(12,'Sagasta'),(13,'Jovellanos'),(14,'Tetuán'),(15,'Velázquez'),(16,'O''Donnell'),(17,'Campana'),(18,'Carrera Oficial'),(19,'Cardenal Carlos Amigo'),(20,'Alemanes'),(21,'Álvarez Quintero'),(22,'Argote de Molina'),(23,'Placentines'),(24,'Francos'),(25,'Cuesta del Rosario'),(26,'Pescadería'),(27,'Ángel María Camacho'),(28,'Alfalfa'),(29,'Águilas'),(30,'Pilatos'),(31,'San Esteban'),(32,'Puerta Carmona'),(33,'Muro de los Navarros'),(34,'Guadalupe'),(35,'Recaredo'),(36,'Capilla de los Ángeles'),(37,'Entrada')) r(n,label))))),'Dos pasos realizan la estación de penitencia del Jueves Santo.','Horarios e itinerario proceden de la información publicada el mismo día; se conserva como edición anunciada al no haberse localizado memoria posterior.','announced','published',os.id,'los-negritos-estacion-penitencia-2026','NEGRITOS-EP-2026',p.name,p.name
from public.entities h join public.municipalities m on m.slug='sevilla' join public.places p on p.slug='capilla-nuestra-senora-angeles-negritos-sevilla' join public.outing_series os on os.brotherhood_entity_id=h.id and os.outing_type='Estación de penitencia'
where h.slug='hermandad-de-los-negritos' and not exists(select 1 from public.outings where slug='los-negritos-estacion-penitencia-2026');

update public.entities set status='published',summary='El Santísimo Cristo de la Fundación presidió el Vía Crucis de las Cofradías de Sevilla en 1977.',updated_at=now()
where slug='via-crucis-consejo-1977-hermandad-de-los-negritos';

update public.outings set title='Vía Crucis de las Cofradías presidido por el Cristo de la Fundación',outing_type='Vía Crucis',character='extraordinary',municipality_id=(select id from public.municipalities where slug='sevilla'),origin_place_id=(select id from public.places where slug='capilla-nuestra-senora-angeles-negritos-sevilla'),origin_text='Capilla de Nuestra Señora de los Ángeles',destination_text='Santa Iglesia Catedral de Sevilla',description='El Santísimo Cristo de la Fundación presidió el Vía Crucis de las Hermandades y Cofradías de Sevilla de 1977.',event_status='held',status='published',updated_at=now()
where slug='via-crucis-consejo-1977-hermandad-de-los-negritos';

with historical(slug,reference_code,title,outing_date,outing_type,reason,origin,destination,description) as (values
 ('virgen-angeles-rosario-vespertino-coronacion-2019','NEGRITOS-ROSARIO-2019','Rosario Vespertino extraordinario de Nuestra Señora de los Ángeles',date '2019-05-13','Rosario Vespertino','Coronación pontificia','Capilla de Nuestra Señora de los Ángeles','Parroquia de San Roque','Rosario extraordinario previo a la coronación pontificia.'),
 ('virgen-angeles-traslado-catedral-coronacion-2019','NEGRITOS-TRASLADO-2019','Traslado de Nuestra Señora de los Ángeles a la Catedral',date '2019-05-17','Traslado','Coronación pontificia','Parroquia de San Roque','Santa Iglesia Catedral de Sevilla','Traslado a la Catedral para la coronación pontificia.'),
 ('virgen-angeles-regreso-coronacion-2019','NEGRITOS-REGRESO-2019','Regreso triunfal de Nuestra Señora de los Ángeles Coronada',date '2019-05-18','Procesión extraordinaria','Coronación pontificia','Santa Iglesia Catedral de Sevilla','Capilla de Nuestra Señora de los Ángeles','Procesión de regreso tras la coronación pontificia celebrada el 18 de mayo de 2019.')
)
insert into public.outings(brotherhood_entity_id,outing_type,character,title,outing_date,year,municipality_id,reason,description,event_status,status,slug,reference_code,origin_text,destination_text)
select h.id,d.outing_type,'extraordinary',d.title,d.outing_date,2019,m.id,d.reason,d.description,'held','published',d.slug,d.reference_code,d.origin,d.destination from historical d join public.entities h on h.slug='hermandad-de-los-negritos' join public.municipalities m on m.slug='sevilla'
where not exists(select 1 from public.outings o where o.slug=d.slug);

with rel(outing_slug,image_slug) as (values ('los-negritos-estacion-penitencia-2026','santisimo-cristo-fundacion-negritos'),('los-negritos-estacion-penitencia-2026','nuestra-senora-de-los-angeles-negritos'),('via-crucis-consejo-1977-hermandad-de-los-negritos','santisimo-cristo-fundacion-negritos'),('virgen-angeles-rosario-vespertino-coronacion-2019','nuestra-senora-de-los-angeles-negritos'),('virgen-angeles-traslado-catedral-coronacion-2019','nuestra-senora-de-los-angeles-negritos'),('virgen-angeles-regreso-coronacion-2019','nuestra-senora-de-los-angeles-negritos'))
insert into public.outing_entities(outing_id,entity_id,role,notes) select o.id,i.id,'processional_image','Titular participante.' from rel d join public.outings o on o.slug=d.outing_slug join public.entities i on i.slug=d.image_slug
on conflict(outing_id,entity_id,role) do update set notes=excluded.notes;

with pos(step_slug,code,label,seq) as (values ('paso-cristo-fundacion-negritos','at_christ','Ante el paso del Santísimo Cristo de la Fundación',1),('paso-palio-virgen-angeles-negritos','behind_palio','Tras el paso de palio de Nuestra Señora de los Ángeles',2))
insert into public.outing_music_positions(outing_id,step_entity_id,position_code,position_label,sequence_no,notes,status)
select o.id,s.id,d.code,d.label,d.seq,'Acompañamiento anunciado para la estación de penitencia de 2026.','published' from pos d join public.outings o on o.slug='los-negritos-estacion-penitencia-2026' join public.entities s on s.slug=d.step_slug
on conflict(outing_id,sequence_no) do update set step_entity_id=excluded.step_entity_id,position_code=excluded.position_code,position_label=excluded.position_label,notes=excluded.notes,status='published',updated_at=now();

with music(code,band_slug,seq) as (values ('at_christ','capilla-musical-ars-sacra',1),('at_christ','grupo-voces-graves-de-profundis',2),('behind_palio','sociedad-filarmonica-nuestra-senora-nieves-olivares',1))
insert into public.outing_music_assignments(music_position_id,band_entity_id,participation_mode,sequence_no,notes,status)
select p.id,b.id,'full_route',d.seq,'Formación anunciada por el Consejo para la cofradía.','published' from music d join public.outing_music_positions p on p.outing_id=(select id from public.outings where slug='los-negritos-estacion-penitencia-2026') and p.position_code=d.code join public.entities b on b.slug=d.band_slug
where not exists(select 1 from public.outing_music_assignments a where a.music_position_id=p.id and a.band_entity_id=b.id and a.sequence_no=d.seq);

insert into public.accompaniments(outing_id,band_entity_id,step_entity_id,position,year,notes,status)
select o.id,b.id,s.id,d.position,2026,'Acompañamiento anunciado para la edición de 2026.','published' from (values ('capilla-musical-ars-sacra','paso-cristo-fundacion-negritos','Ante el paso del Cristo'),('grupo-voces-graves-de-profundis','paso-cristo-fundacion-negritos','Ante el paso del Cristo'),('sociedad-filarmonica-nuestra-senora-nieves-olivares','paso-palio-virgen-angeles-negritos','Tras el paso de palio')) d(band_slug,step_slug,position) join public.outings o on o.slug='los-negritos-estacion-penitencia-2026' join public.entities b on b.slug=d.band_slug join public.entities s on s.slug=d.step_slug
where not exists(select 1 from public.accompaniments a where a.outing_id=o.id and a.band_entity_id=b.id and a.step_entity_id=s.id and a.year=2026);

-- Fuente principal de cada bloque y de cada salida; los enlaces específicos conservan trazabilidad granular.
insert into public.source_links(source_id,entity_id,scope,notes)
select s.id,h.id,d.scope,d.notes from (values
 ('https://www.hermandadlosnegritos.org/hermandad/historia/','Historia e identidad','Historia publicada por la Hermandad.'),
 ('https://www.hermandadlosnegritos.org/mail/','Sede y contacto','Dirección y horarios oficiales.'),
 ('https://www.hermandades-de-sevilla.org/semanasanta/js_los_negritos.html','Ficha institucional','Título, hábito, pasos, patrimonio y música.'),
 ('https://www.hermandadlosnegritos.org/archivos/musical/','Patrimonio musical','Archivo musical oficial.')
) d(url,scope,notes) join public.sources s on s.url=d.url join public.entities h on h.slug='hermandad-de-los-negritos'
where not exists(select 1 from public.source_links sl where sl.source_id=s.id and sl.entity_id=h.id and sl.scope=d.scope);

with entity_sources(slug,url,scope) as (values
 ('santisimo-cristo-fundacion-negritos','https://www.hermandadlosnegritos.org/cristo-de-la-fundacion/','Titular · autoría y cronología'),
 ('nuestra-senora-de-los-angeles-negritos','https://www.hermandadlosnegritos.org/nuestra-senora-de-los-angeles/','Titular · cronología e intervenciones'),
 ('paso-cristo-fundacion-negritos','https://www.hermandades-de-sevilla.org/semanasanta/js_los_negritos.html','Paso y patrimonio'),
 ('paso-palio-virgen-angeles-negritos','https://www.hermandades-de-sevilla.org/semanasanta/js_los_negritos.html','Paso y patrimonio'),
 ('simpecado-historico-negritos','https://www.hermandades-de-sevilla.org/semanasanta/js_los_negritos.html','Patrimonio histórico'),
 ('cruz-toallas-negritos','https://www.hermandades-de-sevilla.org/semanasanta/js_los_negritos.html','Patrimonio histórico')
)
insert into public.source_links(source_id,entity_id,scope,notes) select s.id,e.id,d.scope,'Dato publicado en la fuente enlazada.' from entity_sources d join public.sources s on s.url=d.url join public.entities e on e.slug=d.slug
where not exists(select 1 from public.source_links sl where sl.source_id=s.id and sl.entity_id=e.id and sl.scope=d.scope);

insert into public.source_links(source_id,entity_location_id,scope,notes)
select s.id,el.id,'Sede canónica vigente','Dirección y horario publicados por la Hermandad.' from public.sources s join public.entity_locations el on el.entity_id=(select id from public.entities where slug='hermandad-de-los-negritos') and el.is_current
where s.url='https://www.hermandadlosnegritos.org/mail/' and not exists(select 1 from public.source_links sl where sl.source_id=s.id and sl.entity_location_id=el.id);

insert into public.source_links(source_id,brotherhood_habit_id,scope,notes)
select s.id,bh.id,'Hábito nazareno','Descripción institucional del hábito.' from public.sources s join public.brotherhood_habits bh on bh.brotherhood_entity_id=(select id from public.entities where slug='hermandad-de-los-negritos')
where s.url='https://www.hermandades-de-sevilla.org/semanasanta/js_los_negritos.html' and not exists(select 1 from public.source_links sl where sl.source_id=s.id and sl.brotherhood_habit_id=bh.id);

insert into public.source_links(source_id,cult_id,scope,notes)
select s.id,c.id,'Culto recurrente','Calendario anual oficial.' from public.sources s join public.cults c on c.brotherhood_entity_id=(select id from public.entities where slug='hermandad-de-los-negritos')
where s.url='https://www.hermandadlosnegritos.org/vida-de-la-hdad/cultos/' and not exists(select 1 from public.source_links sl where sl.source_id=s.id and sl.cult_id=c.id);

insert into public.source_links(source_id,cult_occurrence_id,scope,notes)
select s.id,co.id,'Edición 2026','Fechas y horarios anunciados en el calendario oficial.' from public.sources s join public.cult_occurrences co on true join public.cults c on c.id=co.cult_id
where s.url='https://www.hermandadlosnegritos.org/vida-de-la-hdad/cultos/' and c.brotherhood_entity_id=(select id from public.entities where slug='hermandad-de-los-negritos') and co.year=2026 and not exists(select 1 from public.source_links sl where sl.source_id=s.id and sl.cult_occurrence_id=co.id);

with outing_sources(slug,url,scope) as (values
 ('los-negritos-estacion-penitencia-2026','https://cadenaser.com/andalucia/2026/04/02/las-hermandades-del-jueves-santo-estaran-15-minutos-mas-en-carrera-oficial-radio-sevilla/','Estación de penitencia · 2026'),
 ('via-crucis-consejo-1977-hermandad-de-los-negritos','https://www.hermandades-de-sevilla.org/13957-2/hermandades-viacrucis-consejo/','Histórico · Vía Crucis 1977'),
 ('virgen-angeles-rosario-vespertino-coronacion-2019','https://www.sevillaactualidad.com/cofradias/125703-un-extenso-programa-marca-la-coronacion-de-la-virgen-de-los-angeles/','Histórico · Coronación 2019'),
 ('virgen-angeles-traslado-catedral-coronacion-2019','https://paliodeplata.com/noticias/salidas-extraordinarias-en-andalucia-2019/','Histórico · Coronación 2019'),
 ('virgen-angeles-regreso-coronacion-2019','https://paliodeplata.com/noticias/salidas-extraordinarias-en-andalucia-2019/','Histórico · Coronación 2019')
)
insert into public.source_links(source_id,outing_id,scope,notes) select s.id,o.id,d.scope,'Fecha y carácter documentados en la fuente enlazada.' from outing_sources d join public.sources s on s.url=d.url join public.outings o on o.slug=d.slug
where not exists(select 1 from public.source_links sl where sl.source_id=s.id and sl.outing_id=o.id and sl.scope=d.scope);

insert into public.source_links(source_id,outing_series_id,scope,notes)
select s.id,os.id,'Salida habitual','Carácter anual y jornada institucional.' from public.sources s join public.outing_series os on os.brotherhood_entity_id=(select id from public.entities where slug='hermandad-de-los-negritos')
where s.url='https://www.hermandades-de-sevilla.org/semanasanta/js_los_negritos.html' and not exists(select 1 from public.source_links sl where sl.source_id=s.id and sl.outing_series_id=os.id);

insert into public.source_links(source_id,music_accompaniment_period_id,scope,notes)
select s.id,mp.id,'Acompañamiento musical vigente','Formación, paso y posición publicados por el Consejo.' from public.sources s join public.music_accompaniment_periods mp on mp.brotherhood_entity_id=(select id from public.entities where slug='hermandad-de-los-negritos') and mp.is_current
where s.url='https://www.hermandades-de-sevilla.org/semanasanta/js_los_negritos.html' and not exists(select 1 from public.source_links sl where sl.source_id=s.id and sl.music_accompaniment_period_id=mp.id);

do $$
declare h_id uuid := (select id from public.entities where slug='hermandad-de-los-negritos'); completion integer;
begin
  if (select count(*) from public.entity_locations where entity_id=h_id and status='published' and is_current) <> 1 then raise exception 'La sede canónica no quedó unívoca'; end if;
  if (select count(*) from public.brotherhood_images where brotherhood_entity_id=h_id and status='published') <> 2 then raise exception 'Los dos titulares no quedaron publicados'; end if;
  if (select count(*) from public.brotherhood_steps where brotherhood_entity_id=h_id and status='published') <> 2 then raise exception 'Los dos pasos no quedaron publicados'; end if;
  if (select count(*) from public.heritage_assets ha join public.brotherhood_steps bs on bs.step_entity_id=ha.parent_entity_id where bs.brotherhood_entity_id=h_id and ha.is_current) <> 4 then raise exception 'El patrimonio de los pasos no quedó completo'; end if;
  if (select count(*) from public.cults where brotherhood_entity_id=h_id and status='published') <> 8 then raise exception 'Los ocho cultos no quedaron publicados'; end if;
  if (select count(*) from public.cult_occurrences co join public.cults c on c.id=co.cult_id where c.brotherhood_entity_id=h_id and co.year=2026 and co.status='published') <> 8 then raise exception 'Las ocho ocurrencias de 2026 no quedaron publicadas'; end if;
  if (select count(*) from public.outings where brotherhood_entity_id=h_id and status='published') <> 5 then raise exception 'Las cinco salidas documentadas no quedaron publicadas'; end if;
  if exists(select 1 from public.outings o where o.brotherhood_entity_id=h_id and o.status='published' and not exists(select 1 from public.source_links sl where sl.outing_id=o.id)) then raise exception 'Existe una salida publicada sin fuente'; end if;
  if (select count(*) from public.music_accompaniment_periods where brotherhood_entity_id=h_id and is_current and status='published') <> 3 then raise exception 'Los tres acompañamientos vigentes no quedaron documentados'; end if;
  select completion_percentage into completion from public.brotherhood_completeness where entity_id=h_id;
  if completion <> 100 then raise exception 'La ficha de Los Negritos queda en % en vez de 100',completion; end if;
end $$;
