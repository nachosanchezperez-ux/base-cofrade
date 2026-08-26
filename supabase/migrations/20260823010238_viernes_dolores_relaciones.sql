-- Hilo Cofrade · Viernes de Dolores · relaciones
-- Versión aplicada en Supabase: 20260823010238
-- Pasos actuales, fases patrimoniales, música, capataces, relaciones históricas
-- y proyecto futuro de palio de Desconsuelo.

begin;

with seed(name,slug,summary) as (values
('Paso de misterio de Bendición y Esperanza','paso-misterio-bendicion-esperanza','Paso de misterio del Santo Encuentro de Bendición y Esperanza.'),
('Paso de misterio de Nuestro Padre Jesús de Nazaret','paso-misterio-jesus-de-nazaret-pino-montano','Paso de misterio del Prendimiento de Pino Montano.'),
('Paso de palio de María Santísima del Amor','paso-palio-maria-santisima-amor-pino-montano','Paso de palio de María Santísima del Amor.'),
('Paso de misterio del Santo Cristo de la Misión','paso-misterio-jesus-mision-sevilla','Paso de misterio del Santo Cristo de la Misión, Nuestra Señora del Amparo y San Juan Evangelista.'),
('Paso de misterio de Nuestro Padre Jesús de la Salud y Remedios','paso-misterio-salud-remedios-bellavista','Paso de misterio del Prendimiento de Bellavista.'),
('Paso de palio de María Santísima del Dulce Nombre','paso-palio-dulce-nombre-bellavista','Paso de palio de María Santísima del Dulce Nombre en sus Dolores y Compasión.'),
('Paso del Santísimo Cristo de Pasión y Muerte','paso-santisimo-cristo-pasion-muerte-sevilla','Paso procesional del Santísimo Cristo de Pasión y Muerte.'),
('Paso del Santísimo Cristo de la Corona','paso-santisimo-cristo-corona-sevilla','Paso procesional del Santísimo Cristo de la Corona.'))
insert into public.entities(id,entity_type,name,slug,summary,status)
select gen_random_uuid(),'step',name,slug,summary,'published' from seed
on conflict(slug) do update set name=excluded.name,summary=excluded.summary,status='published',updated_at=now();

with seed(slug,step_type,description,notes,execution_date_text) as (values
('paso-misterio-bendicion-esperanza','Misterio','Representa el encuentro de Jesús con su Madre en la calle de la Amargura.','El conjunto escultórico es obra de Juan Antonio Blanco Ramos.','Configuración contemporánea; incorpora parihuela y respiraderos adquiridos a la Redención en 2022.'),
('paso-misterio-jesus-de-nazaret-pino-montano','Misterio','Representa el Prendimiento de Jesús en Getsemaní.','La Hermandad continúa desarrollando su proyecto patrimonial de paso de misterio.','Configuración contemporánea en evolución.'),
('paso-palio-maria-santisima-amor-pino-montano','Palio','Paso de palio de María Santísima del Amor.','Conjunto patrimonial ejecutado y enriquecido por fases.','Configuración contemporánea.'),
('paso-misterio-jesus-mision-sevilla','Misterio','Representa el encuentro del Señor con su Madre y las Santas Mujeres camino del Calvario.','Procesionan el Santo Cristo de la Misión, Nuestra Señora del Amparo y San Juan Evangelista, junto a figuras secundarias.','Configuración contemporánea.'),
('paso-misterio-salud-remedios-bellavista','Misterio','Representa el Prendimiento de Jesús en Getsemaní.','Figuras secundarias de Miguel Ángel Valverde (2006) y Juan Manuel Montaño (2017).','2006–2017.'),
('paso-palio-dulce-nombre-bellavista','Palio','Paso de palio de María Santísima del Dulce Nombre en sus Dolores y Compasión.','La Virgen procesiona bajo palio desde 1999.','Desde 1999.'),
('paso-santisimo-cristo-pasion-muerte-sevilla','Cristo','Paso del Santísimo Cristo de Pasión y Muerte, de estética sobria.','Canastilla de Manuel Toledano Gómez; cartelas y ángeles de Mariano Sánchez del Pino; acabado en caoba completado en 2016 por Hermanos Caballeros.','2009; acabado completado en 2016.'),
('paso-santisimo-cristo-corona-sevilla','Nazareno','Paso procesional del Santísimo Cristo de la Corona.','Un único paso en la estación de penitencia.','Configuración contemporánea.'))
insert into public.steps(entity_id,step_type,current_condition,description,notes,execution_date_text,current_state_notes)
select e.id,seed.step_type,'preserved',seed.description,seed.notes,seed.execution_date_text,'Paso procesional actual.' from seed join public.entities e on e.slug=seed.slug
on conflict(entity_id) do update set step_type=excluded.step_type,current_condition=excluded.current_condition,description=excluded.description,notes=excluded.notes,execution_date_text=excluded.execution_date_text,current_state_notes=excluded.current_state_notes;

with seed(b_slug,s_slug) as (values
('bendicion-y-esperanza','paso-misterio-bendicion-esperanza'),
('hermandad-de-pino-montano','paso-misterio-jesus-de-nazaret-pino-montano'),('hermandad-de-pino-montano','paso-palio-maria-santisima-amor-pino-montano'),
('hermandad-de-la-mision-sevilla','paso-misterio-jesus-mision-sevilla'),
('dulce-nombre-bellavista','paso-misterio-salud-remedios-bellavista'),('dulce-nombre-bellavista','paso-palio-dulce-nombre-bellavista'),
('pasion-y-muerte','paso-santisimo-cristo-pasion-muerte-sevilla'),
('cristo-de-la-corona','paso-santisimo-cristo-corona-sevilla'))
insert into public.brotherhood_steps(id,brotherhood_entity_id,step_entity_id,relation_type,notes,status)
select gen_random_uuid(),b.id,s.id,'processional_step','Paso procesional actual.','published'
from seed join public.entities b on b.slug=seed.b_slug join public.entities s on s.slug=seed.s_slug
where not exists(select 1 from public.brotherhood_steps x where x.brotherhood_entity_id=b.id and x.step_entity_id=s.id and x.relation_type='processional_step' and x.status<>'archived');
update public.brotherhood_steps bs set status='published'
from public.entities b,public.entities s
where bs.brotherhood_entity_id=b.id and bs.step_entity_id=s.id and bs.relation_type='processional_step'
  and b.slug in ('bendicion-y-esperanza','hermandad-de-pino-montano','hermandad-de-la-mision-sevilla','dulce-nombre-bellavista','pasion-y-muerte','cristo-de-la-corona')
  and s.slug in ('paso-misterio-bendicion-esperanza','paso-misterio-jesus-de-nazaret-pino-montano','paso-palio-maria-santisima-amor-pino-montano','paso-misterio-jesus-mision-sevilla','paso-misterio-salud-remedios-bellavista','paso-palio-dulce-nombre-bellavista','paso-santisimo-cristo-pasion-muerte-sevilla','paso-santisimo-cristo-corona-sevilla');

with seed(i_slug,s_slug) as (values
('jesus-bendicion-santo-encuentro','paso-misterio-bendicion-esperanza'),('santa-maria-esperanza-soledad-bendicion','paso-misterio-bendicion-esperanza'),
('nuestro-padre-jesus-de-nazaret-pino-montano','paso-misterio-jesus-de-nazaret-pino-montano'),('maria-santisima-amor-pino-montano','paso-palio-maria-santisima-amor-pino-montano'),
('santo-cristo-mision-sevilla','paso-misterio-jesus-mision-sevilla'),('nuestra-senora-amparo-mision','paso-misterio-jesus-mision-sevilla'),('san-juan-evangelista-mision-sevilla','paso-misterio-jesus-mision-sevilla'),
('jesus-salud-remedios-bellavista','paso-misterio-salud-remedios-bellavista'),('maria-santisima-dulce-nombre-bellavista','paso-palio-dulce-nombre-bellavista'),
('santisimo-cristo-pasion-muerte-sevilla','paso-santisimo-cristo-pasion-muerte-sevilla'),
('santisimo-cristo-corona-sevilla','paso-santisimo-cristo-corona-sevilla'))
insert into public.image_steps(id,image_entity_id,step_entity_id,relation_type,notes,status)
select gen_random_uuid(),i.id,s.id,'processes_on','Relación procesional vigente.','published'
from seed join public.entities i on i.slug=seed.i_slug join public.entities s on s.slug=seed.s_slug
where not exists(select 1 from public.image_steps x where x.image_entity_id=i.id and x.step_entity_id=s.id and x.relation_type='processes_on' and x.status<>'archived');

with seed(name,slug,summary) as (values
('Miguel Ángel Valverde','miguel-angel-valverde','Imaginero de las figuras secundarias del misterio de Bellavista en 2006.'),
('Juan Manuel Montaño','juan-manuel-montano','Imaginero de San Juan y Judas del misterio de Bellavista en 2017.'),
('Manuel Toledano Gómez','manuel-toledano-gomez','Tallista autor del paso del Santísimo Cristo de Pasión y Muerte.'),
('Mariano Sánchez del Pino','mariano-sanchez-del-pino','Autor de cartelas y ángeles del paso del Santísimo Cristo de Pasión y Muerte.'),
('Antonio Castro del Pozo','antonio-castro-del-pozo','Diseñador del proyecto futuro de paso de palio y manto de Nuestra Señora del Desconsuelo y Visitación.'))
insert into public.entities(id,entity_type,name,slug,summary,status)
select gen_random_uuid(),'agent',name,slug,summary,'published' from seed
on conflict(slug) do update set name=excluded.name,summary=excluded.summary,status='published',updated_at=now();
insert into public.agents(entity_id,agent_kind,description)
select e.id,'person',e.summary from public.entities e where e.slug in ('miguel-angel-valverde','juan-manuel-montano','manuel-toledano-gomez','mariano-sanchez-del-pino','antonio-castro-del-pozo')
on conflict(entity_id) do update set description=excluded.description;

with seed(step_slug,phase_name,phase_type,date_text,description) as (values
('paso-misterio-bendicion-esperanza','Adquisición de parihuela y respiraderos a la Redención','Adquisición','2022','Incorporación al paso de una parihuela y unos respiraderos adquiridos a la Hermandad de la Redención.'),
('paso-misterio-salud-remedios-bellavista','Figuras secundarias del misterio','Escultura','2006','Miguel Ángel Valverde realizó las primeras figuras secundarias del misterio.'),
('paso-misterio-salud-remedios-bellavista','Ampliación de las figuras secundarias','Escultura','2017','Juan Manuel Montaño realizó San Juan y Judas para el misterio.'),
('paso-santisimo-cristo-pasion-muerte-sevilla','Ejecución del paso actual','Talla','2009','Manuel Toledano Gómez ejecutó la canastilla del paso; Mariano Sánchez del Pino realizó cartelas y ángeles.'),
('paso-santisimo-cristo-pasion-muerte-sevilla','Finalización en caoba','Intervención','2016','Hermanos Caballeros completó el acabado en caoba del paso.'))
insert into public.step_phases(id,step_entity_id,phase_name,phase_type,date_from_text,description,status)
select gen_random_uuid(),s.id,seed.phase_name,seed.phase_type,seed.date_text,seed.description,'published'
from seed join public.entities s on s.slug=seed.step_slug
where not exists(select 1 from public.step_phases p where p.step_entity_id=s.id and p.phase_name=seed.phase_name and p.status<>'archived');

with seed(step_slug,phase_name,agent_slug,discipline,role_name) as (values
('paso-misterio-salud-remedios-bellavista','Figuras secundarias del misterio','miguel-angel-valverde','Escultura','Imaginero'),
('paso-misterio-salud-remedios-bellavista','Ampliación de las figuras secundarias','juan-manuel-montano','Escultura','Imaginero'),
('paso-santisimo-cristo-pasion-muerte-sevilla','Ejecución del paso actual','manuel-toledano-gomez','Talla','Tallista'),
('paso-santisimo-cristo-pasion-muerte-sevilla','Ejecución del paso actual','mariano-sanchez-del-pino','Escultura','Cartelas y ángeles'),
('paso-santisimo-cristo-pasion-muerte-sevilla','Finalización en caoba','hermanos-caballeros','Carpintería / acabado','Taller'))
insert into public.step_phase_agents(id,step_phase_id,agent_entity_id,discipline,role_name)
select gen_random_uuid(),p.id,a.id,seed.discipline,seed.role_name
from seed join public.entities s on s.slug=seed.step_slug join public.step_phases p on p.step_entity_id=s.id and p.phase_name=seed.phase_name join public.entities a on a.slug=seed.agent_slug
where not exists(select 1 from public.step_phase_agents x where x.step_phase_id=p.id and x.agent_entity_id=a.id and x.discipline=seed.discipline and coalesce(x.role_name,'')=coalesce(seed.role_name,''));

insert into public.entities(id,entity_type,name,slug,summary,status)
values
(gen_random_uuid(),'brotherhood','Hermandad de la Redención','hermandad-de-la-redencion','Referencia relacional mínima para procedencias patrimoniales.','draft'),
(gen_random_uuid(),'brotherhood','Hermandad de la Estrella','hermandad-de-la-estrella','Referencia relacional mínima para relaciones históricas.','draft')
on conflict(slug) do nothing;

with seed(source_slug,relation_type,target_slug,date_text,notes) as (values
('paso-misterio-bendicion-esperanza','includes_elements_acquired_from_brotherhood','hermandad-de-la-redencion','2022','Parihuela y respiraderos adquiridos a la Hermandad de la Redención.'),
('bendicion-y-esperanza','godmother_brotherhood','hermandad-de-la-carreteria','2025','La Hermandad de la Carretería actuó como madrina de la corporación.'),
('dulce-nombre-bellavista','godmother_brotherhood','hermandad-del-dulce-nombre-sevilla',null,'Relación de madrinazgo con la Hermandad del Dulce Nombre de San Lorenzo.'),
('pasion-y-muerte','godmother_brotherhood','hermandad-de-la-estrella','2011','La Hermandad de la Estrella fue madrina en la erección de la Hermandad.'))
insert into public.entity_relations(id,source_entity_id,relation_type,target_entity_id,date_from_text,notes,status)
select gen_random_uuid(),src.id,seed.relation_type,tgt.id,seed.date_text,seed.notes,'draft'
from seed join public.entities src on src.slug=seed.source_slug join public.entities tgt on tgt.slug=seed.target_slug
where not exists(select 1 from public.entity_relations r where r.source_entity_id=src.id and r.relation_type=seed.relation_type and r.target_entity_id=tgt.id and r.status<>'archived');

insert into public.entities(id,entity_type,name,slug,summary,status)
values(gen_random_uuid(),'event','Aprobación del proyecto de paso de palio de Nuestra Señora del Desconsuelo y Visitación','aprobacion-proyecto-palio-desconsuelo-2026','El Cabildo General Extraordinario aprobó el 20 de junio de 2026 un nuevo proyecto de paso de palio para Nuestra Señora del Desconsuelo y Visitación, diseñado por Antonio Castro del Pozo.','published')
on conflict(slug) do update set name=excluded.name,summary=excluded.summary,status='published',updated_at=now();
insert into public.events(entity_id,event_type,event_date,event_date_text,description)
select e.id,'Proyecto patrimonial',date '2026-06-20','20 de junio de 2026','Aprobación del diseño completo del futuro paso de palio y manto procesional de Nuestra Señora del Desconsuelo y Visitación.' from public.entities e where e.slug='aprobacion-proyecto-palio-desconsuelo-2026'
on conflict(entity_id) do update set event_type=excluded.event_type,event_date=excluded.event_date,event_date_text=excluded.event_date_text,description=excluded.description;
with seed(target_slug,notes) as (values
('pasion-y-muerte','Proyecto aprobado por la Hermandad.'),('nuestra-senora-desconsuelo-visitacion','Titular para la que se proyecta el futuro paso.'),('antonio-castro-del-pozo','Diseñador del conjunto.'))
insert into public.entity_relations(id,source_entity_id,relation_type,target_entity_id,notes,status)
select gen_random_uuid(),ev.id,'involves',t.id,seed.notes,'published' from seed join public.entities ev on ev.slug='aprobacion-proyecto-palio-desconsuelo-2026' join public.entities t on t.slug=seed.target_slug
where not exists(select 1 from public.entity_relations r where r.source_entity_id=ev.id and r.relation_type='involves' and r.target_entity_id=t.id and r.status<>'archived');

with seed(name,slug,summary) as (values
('Agrupación Musical Santa María de la Esperanza','agrupacion-musical-santa-maria-esperanza-sevilla','Formación que acompaña actualmente el misterio de Bendición y Esperanza.'),
('Agrupación Musical Nuestro Padre Jesús de la Redención','agrupacion-musical-nuestro-padre-jesus-redencion-sevilla','Formación que acompaña actualmente el misterio del Dulce Nombre de Bellavista.'),
('Banda de Música Santa Ana de Dos Hermanas','banda-musica-santa-ana-dos-hermanas','Banda de música que acompaña actualmente el palio de Bellavista.'),
('Capilla Musical Gólgota','capilla-musical-golgota-sevilla','Capilla musical que acompaña al Santísimo Cristo de Pasión y Muerte.'),
('Capilla Musical Lignum Crucis','capilla-musical-lignum-crucis-sevilla','Capilla musical que acompaña al Santísimo Cristo de la Corona.'),
('Escolanía Salesiana María Auxiliadora','escolania-maria-auxiliadora-sevilla','Escolanía que acompaña al Santísimo Cristo de la Corona.'))
insert into public.entities(id,entity_type,name,slug,summary,status)
select gen_random_uuid(),'band',name,slug,summary,'published' from seed
on conflict(slug) do update set name=excluded.name,summary=excluded.summary,status='published',updated_at=now();

with sevilla as (select id from public.municipalities where slug='sevilla' limit 1),dos_hermanas as (select id from public.municipalities where slug='dos-hermanas' limit 1),
seed(slug,band_type,municipality_slug,description) as (values
('agrupacion-musical-santa-maria-esperanza-sevilla','Agrupación Musical','sevilla','Referencia relacional mínima; ficha completa pendiente.'),
('agrupacion-musical-nuestro-padre-jesus-redencion-sevilla','Agrupación Musical','sevilla','Referencia relacional mínima; ficha completa pendiente.'),
('banda-musica-santa-ana-dos-hermanas','Banda de Música','dos-hermanas','Referencia relacional mínima; ficha completa pendiente.'),
('capilla-musical-golgota-sevilla','Capilla Musical','sevilla','Referencia relacional mínima; ficha completa pendiente.'),
('capilla-musical-lignum-crucis-sevilla','Capilla Musical','sevilla','Referencia relacional mínima; ficha completa pendiente.'),
('escolania-maria-auxiliadora-sevilla','Escolanía','sevilla','Referencia relacional mínima; ficha completa pendiente.'))
insert into public.bands(entity_id,band_type,municipality_id,description)
select e.id,seed.band_type,case seed.municipality_slug when 'dos-hermanas' then dos_hermanas.id else sevilla.id end,seed.description
from seed join public.entities e on e.slug=seed.slug cross join sevilla cross join dos_hermanas
on conflict(entity_id) do update set band_type=excluded.band_type,municipality_id=excluded.municipality_id,description=excluded.description;

with seed(b_slug,band_slug,step_slug,position,date_text,year_from,notes) as (values
('bendicion-y-esperanza','agrupacion-musical-santa-maria-esperanza-sevilla','paso-misterio-bendicion-esperanza','Tras el paso de misterio',null,2014,'Vinculación vigente en 2026; acompañamiento documentado desde 2014.'),
('dulce-nombre-bellavista','agrupacion-musical-nuestro-padre-jesus-redencion-sevilla','paso-misterio-salud-remedios-bellavista','Tras el paso de misterio','Vigente en 2026',null,'Acompañamiento vigente en 2026; fecha inicial exacta pendiente de completar.'),
('dulce-nombre-bellavista','banda-musica-santa-ana-dos-hermanas','paso-palio-dulce-nombre-bellavista','Tras el paso de palio','Vigente en 2026',null,'Acompañamiento vigente en 2026; fecha inicial exacta pendiente de completar.'),
('pasion-y-muerte','capilla-musical-golgota-sevilla','paso-santisimo-cristo-pasion-muerte-sevilla','Delante del paso','Vigente en 2026',null,'Acompañamiento de capilla musical vigente en 2026.'),
('cristo-de-la-corona','capilla-musical-lignum-crucis-sevilla','paso-santisimo-cristo-corona-sevilla','Delante del paso','Vigente en 2026',null,'Acompañamiento vigente en 2026.'),
('cristo-de-la-corona','escolania-maria-auxiliadora-sevilla','paso-santisimo-cristo-corona-sevilla','Delante del paso','Vigente en 2026',null,'Acompañamiento vigente en 2026 junto a Lignum Crucis.'))
insert into public.music_accompaniment_periods(id,brotherhood_entity_id,band_entity_id,step_entity_id,position,outing_type,date_from_text,year_from,is_current,notes,status,public_brotherhood_name,public_step_name,public_brotherhood_slug,public_municipality_name,public_municipality_slug,public_province)
select gen_random_uuid(),b.id,band.id,s.id,seed.position,'Estación de Penitencia',seed.date_text,seed.year_from,true,seed.notes,'published',b.name,s.name,b.slug,'Sevilla','sevilla','Sevilla'
from seed join public.entities b on b.slug=seed.b_slug join public.entities band on band.slug=seed.band_slug join public.entities s on s.slug=seed.step_slug
where not exists(select 1 from public.music_accompaniment_periods m where m.brotherhood_entity_id=b.id and m.band_entity_id=band.id and m.step_entity_id=s.id and m.is_current=true and m.status<>'archived');

with seed(name,slug,summary) as (values
('Francisco Javier Pagés Fernández','francisco-javier-pages-fernandez','Capataz del paso de misterio de Pino Montano en 2026.'),
('Fernando Martín Alés','fernando-martin-ales','Capataz del paso de palio de Pino Montano en 2026.'),
('Antonio Manuel Santiago Cabello','antonio-manuel-santiago-cabello','Capataz de la Hermandad de la Misión en 2026.'),
('José Miguel Varela Peral','jose-miguel-varela-peral','Capataz del misterio de Bellavista en 2026.'),
('Rafael Rodríguez Benítez','rafael-rodriguez-benitez','Capataz del palio de Bellavista en 2026.'),
('Manuel Vizcaya López','manuel-vizcaya-lopez','Capataz del Santísimo Cristo de Pasión y Muerte en 2026.'),
('José Miguel Álvarez Castro','jose-miguel-alvarez-castro','Capataz del Santísimo Cristo de la Corona en 2026.'))
insert into public.entities(id,entity_type,name,slug,summary,status)
select gen_random_uuid(),'agent',name,slug,summary,'published' from seed
on conflict(slug) do update set name=excluded.name,summary=excluded.summary,status='published',updated_at=now();
insert into public.agents(entity_id,agent_kind,description)
select e.id,'person',e.summary from public.entities e where e.slug in ('francisco-javier-pages-fernandez','fernando-martin-ales','antonio-manuel-santiago-cabello','jose-miguel-varela-peral','rafael-rodriguez-benitez','manuel-vizcaya-lopez','jose-miguel-alvarez-castro')
on conflict(entity_id) do update set description=excluded.description;

with seed(step_slug,agent_slug) as (values
('paso-misterio-bendicion-esperanza','manuel-roldan-rojas'),
('paso-misterio-jesus-de-nazaret-pino-montano','francisco-javier-pages-fernandez'),('paso-palio-maria-santisima-amor-pino-montano','fernando-martin-ales'),
('paso-misterio-jesus-mision-sevilla','antonio-santiago-munoz'),('paso-misterio-jesus-mision-sevilla','antonio-manuel-santiago-cabello'),
('paso-misterio-salud-remedios-bellavista','jose-miguel-varela-peral'),('paso-palio-dulce-nombre-bellavista','rafael-rodriguez-benitez'),
('paso-santisimo-cristo-pasion-muerte-sevilla','manuel-vizcaya-lopez'),('paso-santisimo-cristo-corona-sevilla','jose-miguel-alvarez-castro'))
insert into public.step_personnel_periods(id,step_entity_id,agent_entity_id,role_name,date_from_text,is_current,notes,status)
select gen_random_uuid(),s.id,a.id,'Capataz','Vigente en 2026',true,'Capatacía documentada para la estación de penitencia de 2026.','published'
from seed join public.entities s on s.slug=seed.step_slug join public.entities a on a.slug=seed.agent_slug
where not exists(select 1 from public.step_personnel_periods p where p.step_entity_id=s.id and p.agent_entity_id=a.id and lower(p.role_name)='capataz' and p.is_current=true and p.status<>'archived');

with seed(name,url,publisher) as (values
('Viernes de Dolores 2026 · Pino Montano','https://sevilla.abc.es/pasionensevilla/agenda-cofrade/viernes-de-dolores-2026-pino-montano.html','ABC de Sevilla · Pasión en Sevilla'),
('Viernes de Dolores 2026 · La Misión','https://sevilla.abc.es/pasionensevilla/agenda-cofrade/viernes-de-dolores-2026-la-mision.html','ABC de Sevilla · Pasión en Sevilla'),
('Viernes de Dolores 2026 · Dulce Nombre de Bellavista','https://sevilla.abc.es/pasionensevilla/agenda-cofrade/viernes-de-dolores-2026-dulce-nombre-de-bellavista.html','ABC de Sevilla · Pasión en Sevilla'),
('Viernes de Dolores 2026 · Pasión y Muerte','https://sevilla.abc.es/pasionensevilla/agenda-cofrade/viernes-de-dolores-2026-pasion-y-muerte.html','ABC de Sevilla · Pasión en Sevilla'),
('Viernes de Dolores 2026 · Cristo de la Corona','https://sevilla.abc.es/pasionensevilla/agenda-cofrade/viernes-de-dolores-2026-la-corona.html','ABC de Sevilla · Pasión en Sevilla'),
('Proyecto de paso de palio de Desconsuelo · 20/06/2026','https://hermandadpasionymuerte.es/?p=3720','Hermandad de Pasión y Muerte'))
insert into public.sources(id,name,url,source_type,author_or_publisher,accessed_at,notes)
select gen_random_uuid(),seed.name,seed.url,case when seed.publisher='Hermandad de Pasión y Muerte' then 'Fuente oficial' else 'Prensa especializada' end,seed.publisher,date '2026-08-23','Fuente del lote relacional Viernes de Dolores.' from seed
where not exists(select 1 from public.sources s where s.url=seed.url);

with seed(b_slug,url) as (values
('bendicion-y-esperanza','https://bendicionyesperanza.es/?p=3499'),
('hermandad-de-pino-montano','https://sevilla.abc.es/pasionensevilla/agenda-cofrade/viernes-de-dolores-2026-pino-montano.html'),
('hermandad-de-la-mision-sevilla','https://sevilla.abc.es/pasionensevilla/agenda-cofrade/viernes-de-dolores-2026-la-mision.html'),
('dulce-nombre-bellavista','https://sevilla.abc.es/pasionensevilla/agenda-cofrade/viernes-de-dolores-2026-dulce-nombre-de-bellavista.html'),
('pasion-y-muerte','https://sevilla.abc.es/pasionensevilla/agenda-cofrade/viernes-de-dolores-2026-pasion-y-muerte.html'),
('cristo-de-la-corona','https://sevilla.abc.es/pasionensevilla/agenda-cofrade/viernes-de-dolores-2026-la-corona.html'))
insert into public.source_links(id,source_id,music_accompaniment_period_id,scope,notes)
select gen_random_uuid(),src.id,m.id,'Acompañamiento musical 2026','Fuente para el acompañamiento vigente.'
from seed join public.entities b on b.slug=seed.b_slug join public.sources src on src.url=seed.url join public.music_accompaniment_periods m on m.brotherhood_entity_id=b.id and m.is_current=true and m.status<>'archived'
where m.step_entity_id is not null and not exists(select 1 from public.source_links sl where sl.source_id=src.id and sl.music_accompaniment_period_id=m.id);

with seed(b_slug,url) as (values
('bendicion-y-esperanza','https://bendicionyesperanza.es/?p=3499'),
('hermandad-de-pino-montano','https://sevilla.abc.es/pasionensevilla/agenda-cofrade/viernes-de-dolores-2026-pino-montano.html'),
('hermandad-de-la-mision-sevilla','https://sevilla.abc.es/pasionensevilla/agenda-cofrade/viernes-de-dolores-2026-la-mision.html'),
('dulce-nombre-bellavista','https://sevilla.abc.es/pasionensevilla/agenda-cofrade/viernes-de-dolores-2026-dulce-nombre-de-bellavista.html'),
('pasion-y-muerte','https://sevilla.abc.es/pasionensevilla/agenda-cofrade/viernes-de-dolores-2026-pasion-y-muerte.html'),
('cristo-de-la-corona','https://sevilla.abc.es/pasionensevilla/agenda-cofrade/viernes-de-dolores-2026-la-corona.html'))
insert into public.source_links(id,source_id,step_personnel_period_id,scope,notes)
select gen_random_uuid(),src.id,p.id,'Capataz 2026','Fuente para la capatacía vigente.'
from seed join public.entities b on b.slug=seed.b_slug join public.brotherhood_steps bs on bs.brotherhood_entity_id=b.id and bs.status='published' join public.sources src on src.url=seed.url join public.step_personnel_periods p on p.step_entity_id=bs.step_entity_id and p.is_current=true and p.status<>'archived'
where not exists(select 1 from public.source_links sl where sl.source_id=src.id and sl.step_personnel_period_id=p.id);

insert into public.source_links(id,source_id,entity_id,scope,notes)
select gen_random_uuid(),s.id,e.id,'Proyecto patrimonial 2026','Fuente oficial de la aprobación del proyecto futuro de palio.'
from public.sources s join public.entities e on e.slug='aprobacion-proyecto-palio-desconsuelo-2026'
where s.url='https://hermandadpasionymuerte.es/?p=3720'
  and not exists(select 1 from public.source_links sl where sl.source_id=s.id and sl.entity_id=e.id);

commit;
