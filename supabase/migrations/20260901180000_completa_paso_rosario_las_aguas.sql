-- Corrección editorial · Las Aguas · paso del Rosario e imágenes del misterio
-- DML idempotente sobre el modelo First Edition; sin DDL ni RLS.


insert into public.sources(name,url,source_type,author_or_publisher,publication_date,accessed_at,notes)
select * from(values
('Las Aguas · Patrimonio','https://lasaguas.es/patrimonio/','Web oficial','Hermandad de Las Aguas',null::date,date'2026-09-01','Descripción de los tres pasos.'),
('Las Aguas · Imágenes secundarias','https://lasaguas.es/otras-imagenes/','Web oficial','Hermandad de Las Aguas',null::date,date'2026-09-01','Imágenes del misterio.'),
('Procesión del Rosario · 2025','https://cofradiastv.com/horario-e-itinerario-procesion-virgen-del-rosario-de-las-aguas-sevilla-18-de-octubre-del-2025','Prensa especializada','Cofradías TV',date'2025-10-13',date'2026-09-01','Rosario en Cruz de Guía y Mairena tras el paso.')
)v(name,url,source_type,author_or_publisher,publication_date,accessed_at,notes)
where not exists(select 1 from public.sources s where s.url=v.url);

insert into public.entities(entity_type,name,slug,summary,status)
select * from(values
('step','Paso procesional de Nuestra Señora del Rosario','paso-gloria-nuestra-senora-rosario-las-aguas-sevilla','Paso de gloria de Nuestra Señora del Rosario, Patrona del Arenal, configurado entre 2013 y 2019.','published'),
('image','San Juan Evangelista','san-juan-evangelista-misterio-las-aguas','Obra de Luis Álvarez Duarte de 1973.','published'),
('image','Ángel del misterio de Las Aguas','angel-misterio-las-aguas','Obra de Juan Abascal de 1962.','published'),
('image','Santa María Magdalena','santa-maria-magdalena-misterio-las-aguas','Obra de Luis Álvarez Duarte bendecida en 1998.','published')
)v(entity_type,name,slug,summary,status)
where not exists(select 1 from public.entities e where e.slug=v.slug);

update public.entities set status='published',updated_at=now() where slug in('paso-gloria-nuestra-senora-rosario-las-aguas-sevilla','san-juan-evangelista-misterio-las-aguas','angel-misterio-las-aguas','santa-maria-magdalena-misterio-las-aguas');

insert into public.entities(entity_type,name,slug,summary,status)
select 'agent','Juan Abascal Fuentes','juan-abascal-fuentes','Escultor e imaginero sevillano, autor del Ángel del misterio de Las Aguas.','published'
where not exists(select 1 from public.entities where slug='juan-abascal-fuentes');
insert into public.agents(entity_id,agent_kind,description)select id,'person',summary from public.entities where slug='juan-abascal-fuentes'on conflict(entity_id)do update set agent_kind=excluded.agent_kind,description=excluded.description;
with d(image_slug,agent_slug,date_from_text)as(values
('san-juan-evangelista-misterio-las-aguas','luis-alvarez-duarte','1973'),
('angel-misterio-las-aguas','juan-abascal-fuentes','1962'),
('santa-maria-magdalena-misterio-las-aguas','luis-alvarez-duarte','1998'))
insert into public.image_authorships(image_entity_id,agent_entity_id,authorship_type,role_name,date_from_text,certainty,notes,status)
select i.id,a.id,'author','autor',d.date_from_text,'documented','Autoría documentada por la Hermandad.','published'from d join public.entities i on i.slug=d.image_slug join public.entities a on a.slug=d.agent_slug
where not exists(select 1 from public.image_authorships x where x.image_entity_id=i.id and x.agent_entity_id=a.id and x.role_name='autor');

insert into public.images(entity_id,image_type,execution_date_text,material,current_condition,description,iconography,is_dress_image)
select e.id,d.image_type,d.execution_date_text,'Madera tallada y policromada','extant',e.summary,d.iconography,d.is_dress_image
from(values
('san-juan-evangelista-misterio-las-aguas','Santo · Imagen secundaria','1973','San Juan dirige la mirada hacia el Crucificado.',false),
('angel-misterio-las-aguas','Ángel · Imagen secundaria','1962; intervenciones en 1966, 1989 y 2012','Ángel que recoge la sangre y el agua del costado de Cristo.',false),
('santa-maria-magdalena-misterio-las-aguas','Santa · Imagen secundaria','1998','María Magdalena arrodillada a los pies de la Cruz.',true)
)d(slug,image_type,execution_date_text,iconography,is_dress_image)join public.entities e on e.slug=d.slug
on conflict(entity_id)do update set image_type=excluded.image_type,execution_date_text=excluded.execution_date_text,material=excluded.material,current_condition=excluded.current_condition,description=excluded.description,iconography=excluded.iconography,is_dress_image=excluded.is_dress_image;

insert into public.steps(entity_id,step_type,current_condition,description,style,materials,execution_date_text,current_state_notes,carrier_system)
select id,'Paso procesional de Gloria','preserved','Paso procesional de Nuestra Señora del Rosario, Patrona del Arenal.','Neobarroco','Madera tallada, dorada y policromada','Respiraderos y parihuela de 2014; peana concluida en 2019','Respiraderos readaptados por Jesús Mendoza; parihuela de Sergio Muñiz; peana concluida por Manuel Verdugo; antiguos candelabros del Cristo.','Costaleros'
from public.entities where slug='paso-gloria-nuestra-senora-rosario-las-aguas-sevilla'
on conflict(entity_id)do update set step_type=excluded.step_type,current_condition=excluded.current_condition,description=excluded.description,style=excluded.style,materials=excluded.materials,execution_date_text=excluded.execution_date_text,current_state_notes=excluded.current_state_notes,carrier_system=excluded.carrier_system;

insert into public.brotherhood_steps(brotherhood_entity_id,step_entity_id,relation_type,notes,status)
select h.id,st.id,'processional_step','Paso procesional de gloria de Nuestra Señora del Rosario.','published'
from public.entities h,public.entities st where h.slug='las-aguas-sevilla'and st.slug='paso-gloria-nuestra-senora-rosario-las-aguas-sevilla'
and not exists(select 1 from public.brotherhood_steps x where x.brotherhood_entity_id=h.id and x.step_entity_id=st.id and x.relation_type='processional_step'and x.date_to is null);

with d(image_slug,step_slug,notes)as(values
('santisimo-cristo-aguas-sevilla','paso-misterio-cristo-aguas-sevilla','Titular cristífero.'),
('nuestra-madre-senora-mayor-dolor-las-aguas','paso-misterio-cristo-aguas-sevilla','Titular mariana.'),
('san-juan-evangelista-misterio-las-aguas','paso-misterio-cristo-aguas-sevilla','Imagen secundaria.'),
('angel-misterio-las-aguas','paso-misterio-cristo-aguas-sevilla','Imagen secundaria.'),
('santa-maria-magdalena-misterio-las-aguas','paso-misterio-cristo-aguas-sevilla','Imagen secundaria.'),
('maria-santisima-guadalupe-las-aguas','paso-palio-guadalupe-las-aguas-sevilla','Titular del palio.'),
('nuestra-senora-rosario-las-aguas','paso-gloria-nuestra-senora-rosario-las-aguas-sevilla','Titular del paso de gloria.'))
insert into public.image_steps(image_entity_id,step_entity_id,relation_type,notes,status)
select i.id,st.id,'processes_on',d.notes,'published'from d join public.entities i on i.slug=d.image_slug join public.entities st on st.slug=d.step_slug
where not exists(select 1 from public.image_steps x where x.image_entity_id=i.id and x.step_entity_id=st.id and x.relation_type='processes_on'and x.date_to is null);

with d(band_slug,position,notes)as(values
('banda-cornetas-tambores-rosario-cadiz','Cruz de Guía','Rosario de Cádiz abre el cortejo.'),
('banda-municipal-musica-mairena-del-alcor','Tras el paso','Mairena acompaña a Nuestra Señora del Rosario.'))
insert into public.music_accompaniment_periods(brotherhood_entity_id,band_entity_id,step_entity_id,position,outing_type,date_from_text,is_current,notes,status,public_brotherhood_name,public_step_name,public_brotherhood_slug,public_municipality_name,public_municipality_slug,public_province)
select h.id,b.id,st.id,d.position,'Procesión de Gloria','Vigente; documentado en 2025 y confirmado para la ficha actual',true,d.notes,'published','Hermandad de las Aguas','Nuestra Señora del Rosario','las-aguas-sevilla','Sevilla','sevilla','Sevilla'
from d join public.entities h on h.slug='las-aguas-sevilla'join public.entities b on b.slug=d.band_slug join public.entities st on st.slug='paso-gloria-nuestra-senora-rosario-las-aguas-sevilla'
where not exists(select 1 from public.music_accompaniment_periods x where x.brotherhood_entity_id=h.id and x.band_entity_id=b.id and x.step_entity_id=st.id and x.position=d.position and x.is_current);

update public.brotherhood_colors bc set status='published',sort_order=case color_name when'Morado'then 1 else 2 end,color_role=case color_name when'Morado'then'primary'else'secondary'end,updated_at=now()
from public.entities h where h.slug='las-aguas-sevilla'and bc.brotherhood_entity_id=h.id and bc.color_name in('Morado','Blanco');

with d(entity_slug,source_url,scope)as(values
('paso-gloria-nuestra-senora-rosario-las-aguas-sevilla','https://lasaguas.es/patrimonio/','Patrimonio procesional'),
('san-juan-evangelista-misterio-las-aguas','https://lasaguas.es/otras-imagenes/','Imagen secundaria'),
('angel-misterio-las-aguas','https://lasaguas.es/otras-imagenes/','Imagen secundaria'),
('santa-maria-magdalena-misterio-las-aguas','https://lasaguas.es/otras-imagenes/','Imagen secundaria'))
insert into public.source_links(source_id,entity_id,scope,notes)
select s.id,e.id,d.scope,'Corrección editorial 2026'from d join public.sources s on s.url=d.source_url join public.entities e on e.slug=d.entity_slug
where not exists(select 1 from public.source_links x where x.source_id=s.id and x.entity_id=e.id and x.scope=d.scope);

insert into public.source_links(source_id,music_accompaniment_period_id,scope,notes)
select s.id,mp.id,'Acompañamiento musical de Gloria','Rosario en Cruz de Guía y Mairena tras el paso.'
from public.sources s join public.entities st on st.slug='paso-gloria-nuestra-senora-rosario-las-aguas-sevilla'join public.music_accompaniment_periods mp on mp.step_entity_id=st.id and mp.is_current
where s.url='https://cofradiastv.com/horario-e-itinerario-procesion-virgen-del-rosario-de-las-aguas-sevilla-18-de-octubre-del-2025'
and not exists(select 1 from public.source_links x where x.source_id=s.id and x.music_accompaniment_period_id=mp.id);

do $$declare a int;b int;c int;d int;e int;begin
select count(*)into a from public.brotherhood_steps x join public.entities h on h.id=x.brotherhood_entity_id join public.entities st on st.id=x.step_entity_id join public.steps p on p.entity_id=st.id where h.slug='las-aguas-sevilla'and x.status='published'and st.status='published'and x.date_to is null;
select count(*)into b from public.image_steps x join public.entities st on st.id=x.step_entity_id where st.slug='paso-misterio-cristo-aguas-sevilla'and x.status='published'and x.date_to is null;
select count(*)into c from public.image_steps x join public.entities st on st.id=x.step_entity_id where st.slug='paso-gloria-nuestra-senora-rosario-las-aguas-sevilla'and x.status='published'and x.date_to is null;
select count(*)into d from public.music_accompaniment_periods x join public.entities st on st.id=x.step_entity_id where st.slug='paso-gloria-nuestra-senora-rosario-las-aguas-sevilla'and x.is_current and x.status='published';
select count(*)into e from public.brotherhood_colors x join public.entities h on h.id=x.brotherhood_entity_id where h.slug='las-aguas-sevilla'and x.status='published'and x.color_name in('Morado','Blanco');
if a<>3 or b<>5 or c<>1 or d<>2 or e<>2 then raise exception'Validación: %,%,%,%,%',a,b,c,d,e;end if;end$$;
