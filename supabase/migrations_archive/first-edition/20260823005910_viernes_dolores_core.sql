-- Hilo Cofrade · Viernes de Dolores · núcleo relacional
-- Versión aplicada en Supabase: 20260823005910
-- Carga idempotente de las seis hermandades de Sevilla capital, sus titulares,
-- identidad, hábitos, colores y fuentes base.

begin;

with sevilla as (select id from public.municipalities where slug='sevilla' limit 1),
seed(name,slug,place_type,address,notes) as (values
('Parroquia Jesús Obrero','parroquia-jesus-obrero-sevilla','Parroquia','Calle Padre José Sebastián Bandarán, 5, 41013 Sevilla','Sede canónica de Bendición y Esperanza.'),
('Parroquia de San Isidro Labrador','parroquia-san-isidro-labrador-pino-montano','Parroquia','Plaza María Santísima del Amor, s/n, 41015 Sevilla','Sede canónica de Pino Montano.'),
('Parroquia de San Antonio María Claret','parroquia-san-antonio-maria-claret-sevilla','Parroquia','Avenida Padre García Tejero, 8, 41012 Sevilla','Sede canónica de La Misión.'),
('Parroquia del Sagrado Corazón de Jesús de Bellavista','parroquia-sagrado-corazon-jesus-bellavista','Parroquia','Calle Asensio y Toledo, 25, 41014 Sevilla','Sede actual del Dulce Nombre de Bellavista.'),
('Parroquia de Nuestra Señora del Buen Aire','parroquia-nuestra-senora-buen-aire-sevilla','Parroquia','Calle Virgen de Fátima, 8, 41010 Sevilla','Sede canónica de Pasión y Muerte.'),
('Parroquia de San Juan Bosco de Triana','parroquia-san-juan-bosco-triana','Parroquia','Calle Condes de Bustillo, 17, 41010 Sevilla','Sede de salida de Pasión y Muerte desde 2022.'),
('Parroquia del Sagrario de la Catedral de Sevilla','parroquia-sagrario-catedral-sevilla','Parroquia',null,'Sede canónica del Cristo de la Corona.'))
insert into public.places(id,municipality_id,name,slug,place_type,address,notes)
select gen_random_uuid(),sevilla.id,seed.name,seed.slug,seed.place_type,seed.address,seed.notes from seed cross join sevilla
on conflict(slug) do update set municipality_id=excluded.municipality_id,name=excluded.name,place_type=excluded.place_type,address=coalesce(public.places.address,excluded.address),notes=excluded.notes,updated_at=now();

with seed(name,slug,summary) as (values
('Hermandad de Bendición y Esperanza','bendicion-y-esperanza','Hermandad de penitencia del Polígono Sur que realiza su estación de penitencia el Viernes de Dolores.'),
('Hermandad de Pino Montano','hermandad-de-pino-montano','Hermandad de penitencia de Pino Montano que procesiona con dos pasos el Viernes de Dolores.'),
('Hermandad de la Misión','hermandad-de-la-mision-sevilla','Archicofradía de Gloria, Hermandad Sacramental y Cofradía de Nazarenos con sede en Heliópolis.'),
('Hermandad del Dulce Nombre de Bellavista','dulce-nombre-bellavista','Hermandad de penitencia de Bellavista que procesiona con misterio y palio el Viernes de Dolores.'),
('Hermandad de Pasión y Muerte','pasion-y-muerte','Hermandad de penitencia y gloria de Triana, de carácter sobrio y de silencio.'),
('Hermandad del Santísimo Cristo de la Corona','cristo-de-la-corona','Hermandad de penitencia con sede en la Parroquia del Sagrario de la Catedral de Sevilla.'))
insert into public.entities(id,entity_type,name,slug,summary,status)
select gen_random_uuid(),'brotherhood',name,slug,summary,'published' from seed
on conflict(slug) do update set name=excluded.name,summary=excluded.summary,status='published',updated_at=now();

with sevilla as (select id from public.municipalities where slug='sevilla' limit 1),
seed(slug,official_name,popular_name,foundation_text,place_slug,neighborhood,website_url,types,history_text,notes) as (values
('bendicion-y-esperanza','Hermandad Salesiana y Cofradía de Nazarenos de Nuestro Padre Jesús de la Bendición en el Santo Encuentro con Santa María de la Esperanza en su Soledad y Nuestra Señora de la Humildad y Caridad, Sal y Luz','Bendición y Esperanza','1992 (orígenes); Hermandad de Penitencia desde el 24 de mayo de 2024','parroquia-jesus-obrero-sevilla','Polígono Sur','https://bendicionyesperanza.es/',array['Penitencia']::text[],'Sus orígenes se sitúan en una Cruz de Mayo de 1992. Fue Asociación de Fieles desde 2005, Agrupación Parroquial en 2012 y Hermandad de Penitencia desde el 24 de mayo de 2024. Realizó su primera estación de penitencia como Hermandad en 2025.','En 2026 constaban 788 hermanos y 120 nazarenos.'),
('hermandad-de-pino-montano','Hermandad y Cofradía de Nazarenos de Nuestro Padre Jesús de Nazaret, María Santísima del Amor, San Marcos Evangelista y San Isidro Labrador','Pino Montano','Década de 1980; Agrupación Parroquial en 2000; Hermandad desde 2007','parroquia-san-isidro-labrador-pino-montano','Pino Montano','https://hermandadpinomontano.es/',array['Penitencia']::text[],'Nacida en el entorno escolar y vecinal del barrio en la década de 1980. Fue reconocida como Agrupación Parroquial en 2000 y erigida Hermandad de Penitencia en 2007.','Procesiona con dos pasos.'),
('hermandad-de-la-mision-sevilla','Archicofradía del Inmaculado Corazón de María, Hermandad Sacramental y Cofradía de Nazarenos del Santo Cristo de la Misión, Nuestra Señora del Amparo, San Juan Evangelista y San Antonio María Claret','La Misión','1948 (reorganización); agregación y estatutos en 1949','parroquia-san-antonio-maria-claret-sevilla','Heliópolis','https://archicofradiamision.es/',array['Gloria','Sacramental','Penitencia']::text[],'La reorganización en Heliópolis comenzó en 1948 y la Archicofradía quedó agregada y estatutariamente configurada en 1949. Incorporó su carácter sacramental en 1987 y el penitencial en 2007; estrenó túnicas el Viernes de Dolores de 2008.','Triple carácter: Gloria, Sacramental y Penitencia.'),
('dulce-nombre-bellavista','Hermandad de Penitencia y Cofradía de Nazarenos de Nuestro Padre Jesús de la Salud y Remedios y María Santísima del Dulce Nombre en sus Dolores y Compasión','Dulce Nombre de Bellavista','1992 (refundación penitencial); Agrupación Parroquial en 1995; Hermandad desde 2006','parroquia-sagrado-corazon-jesus-bellavista','Bellavista','https://www.dulcenombrebellavista.es/',array['Penitencia']::text[],'La actual corporación penitencial comenzó a gestarse en 1992, fue aprobada como Agrupación Parroquial en 1995 y como Hermandad de Penitencia en 2006. La Virgen procesiona bajo palio desde 1999.','Desde 2019 reside en la Parroquia del Sagrado Corazón de Jesús.'),
('pasion-y-muerte','Hermandad de Santa María del Buen Aire y Cofradía de Nazarenos del Santísimo Cristo de Pasión y Muerte, Resurrección de Nuestro Señor y Nuestra Señora del Desconsuelo y Visitación','Pasión y Muerte','1993 (grupo de oración); Agrupación Parroquial en 2001; Hermandad desde 2011','parroquia-nuestra-senora-buen-aire-sevilla','Triana','https://hermandadpasionymuerte.es/',array['Penitencia','Gloria']::text[],'Nació como grupo de oración en 1993, pasó a Agrupación Parroquial en 2001 y fue erigida Hermandad de Penitencia y Gloria en 2011. Desde 2022 realiza la estación de penitencia desde la Parroquia de San Juan Bosco.','El Viernes de Dolores procesiona únicamente el Santísimo Cristo de Pasión y Muerte.'),
('cristo-de-la-corona','Hermandad y Cofradía del Santísimo Cristo de la Corona y Nuestra Señora del Rosario','Cristo de la Corona','Raíces históricas en el siglo XVII; Hermandad de Penitencia desde el 9 de marzo de 2000','parroquia-sagrario-catedral-sevilla','Centro',null,array['Penitencia']::text[],'La devoción histórica al Cristo de la Corona está documentada desde el siglo XVII. La corporación fue revitalizada en época contemporánea y quedó erigida como Hermandad de Penitencia el 9 de marzo de 2000.','Procesiona con un solo paso.'))
insert into public.brotherhoods(entity_id,official_name,popular_name,foundation_text,municipality_id,canonical_see_place_id,neighborhood,website_url,brotherhood_types,current_procession_day,history_text,notes)
select e.id,seed.official_name,seed.popular_name,seed.foundation_text,sevilla.id,p.id,seed.neighborhood,seed.website_url,seed.types,'Viernes de Dolores',seed.history_text,seed.notes
from seed join public.entities e on e.slug=seed.slug join public.places p on p.slug=seed.place_slug cross join sevilla
on conflict(entity_id) do update set official_name=excluded.official_name,popular_name=excluded.popular_name,foundation_text=excluded.foundation_text,municipality_id=excluded.municipality_id,canonical_see_place_id=excluded.canonical_see_place_id,neighborhood=excluded.neighborhood,website_url=coalesce(excluded.website_url,public.brotherhoods.website_url),brotherhood_types=excluded.brotherhood_types,current_procession_day=excluded.current_procession_day,history_text=excluded.history_text,notes=excluded.notes;

with seed(name,slug,summary) as (values
('Juan Antonio Blanco Ramos','juan-antonio-blanco-ramos','Imaginero autor de los titulares de Bendición y Esperanza.'),
('Fernando Castejón López','fernando-castejon-lopez','Escultor e imaginero autor de los titulares de Pino Montano.'),
('José Manuel Bonilla Cornejo','jose-manuel-bonilla-cornejo','Imaginero autor del Santo Cristo de la Misión y de la actual Nuestra Señora del Amparo.'),
('Rafael Barbero Medina','rafael-barbero-medina','Escultor autor del Inmaculado Corazón de María de la Misión.'),
('Antonio Eslava Rubio','antonio-eslava-rubio','Imaginero autor de San Juan Evangelista de la Misión.'),
('Manuel Pereira','manuel-pereira-escultor','Escultor portugués del Barroco, autor de Nuestra Señora del Rosario de la Corona.'))
insert into public.entities(id,entity_type,name,slug,summary,status)
select gen_random_uuid(),'agent',name,slug,summary,'published' from seed
on conflict(slug) do update set name=excluded.name,summary=excluded.summary,status='published',updated_at=now();
insert into public.agents(entity_id,agent_kind,description)
select e.id,'person',e.summary from public.entities e where e.slug in ('juan-antonio-blanco-ramos','fernando-castejon-lopez','jose-manuel-bonilla-cornejo','rafael-barbero-medina','antonio-eslava-rubio','manuel-pereira-escultor')
on conflict(entity_id) do update set description=excluded.description;

with seed(name,slug,summary) as (values
('Nuestro Padre Jesús de la Bendición en el Santo Encuentro','jesus-bendicion-santo-encuentro','Nazareno de Juan Antonio Blanco Ramos, 2010.'),
('Santa María de la Esperanza en su Soledad','santa-maria-esperanza-soledad-bendicion','Dolorosa de Juan Antonio Blanco Ramos, 2010.'),
('Nuestro Padre Jesús de Nazaret','nuestro-padre-jesus-de-nazaret-pino-montano','Imagen de Fernando Castejón López, 1989.'),
('María Santísima del Amor','maria-santisima-amor-pino-montano','Dolorosa de Fernando Castejón López, 1998.'),
('Santo Cristo de la Misión','santo-cristo-mision-sevilla','Nazareno de José Manuel Bonilla Cornejo, 1988.'),
('Nuestra Señora del Amparo','nuestra-senora-amparo-mision','Dolorosa actual de José Manuel Bonilla Cornejo, 1999.'),
('Inmaculado Corazón de María','inmaculado-corazon-maria-mision-sevilla','Titular letífica de Rafael Barbero Medina, 1960.'),
('San Juan Evangelista','san-juan-evangelista-mision-sevilla','Imagen de Antonio Eslava Rubio, 1970.'),
('Nuestro Padre Jesús de la Salud y Remedios','jesus-salud-remedios-bellavista','Cautivo de Antonio Castillo Lastrucci, 1964.'),
('María Santísima del Dulce Nombre en sus Dolores y Compasión','maria-santisima-dulce-nombre-bellavista','Dolorosa de Luis Álvarez Duarte, 1969.'),
('Santísimo Cristo de Pasión y Muerte','santisimo-cristo-pasion-muerte-sevilla','Crucificado de José Antonio Navarro Arteaga, 1997.'),
('Nuestra Señora del Desconsuelo y Visitación','nuestra-senora-desconsuelo-visitacion','Dolorosa de José Antonio Navarro Arteaga, 2001.'),
('Santa María del Buen Aire','santa-maria-buen-aire-sevilla','Virgen de gloria anónima del siglo XVIII.'),
('Santísimo Cristo de la Corona','santisimo-cristo-corona-sevilla','Nazareno anónimo de finales del siglo XVI.'),
('Nuestra Señora del Rosario','nuestra-senora-rosario-corona-sevilla','Virgen del Rosario de Manuel Pereira, 1638.'))
insert into public.entities(id,entity_type,name,slug,summary,status)
select gen_random_uuid(),'image',name,slug,summary,'published' from seed
on conflict(slug) do update set name=excluded.name,summary=excluded.summary,status='published',updated_at=now();

with seed(slug,image_type,date_text,material,description,notes,is_dress) as (values
('jesus-bendicion-santo-encuentro','Cristo','2010','Madera de cedro','Nazareno de cuerpo entero que representa el encuentro de Jesús con su Madre.','Mide aproximadamente 184 cm.',false),
('santa-maria-esperanza-soledad-bendicion','Virgen · Dolorosa','2010','Madera de cedro','Dolorosa titular de Bendición y Esperanza.','Mide aproximadamente 167 cm; manos unidas y cinco lágrimas.',true),
('nuestro-padre-jesus-de-nazaret-pino-montano','Cristo','1989','Madera de cedro','Imagen de vestir de cuerpo anatómico completo que representa a Jesús apresado en el huerto.','Policromada al óleo; 1,75 m.',true),
('maria-santisima-amor-pino-montano','Virgen · Dolorosa','1998','Madera de cedro','Dolorosa de candelero policromada al óleo.','Bendecida el 1 de abril de 1998; 1,65 m.',true),
('santo-cristo-mision-sevilla','Cristo','1988','Pino de Flandes y cedro','Nazareno de talla completa salvo los brazos articulados, con la cruz sobre el hombro derecho.','Entregado el 3 de marzo de 1988; 172 cm.',true),
('nuestra-senora-amparo-mision','Virgen · Dolorosa','1999','Madera de cedro','Dolorosa de candelero a tamaño natural.','La imagen actual es réplica de la anterior de 1967.',true),
('inmaculado-corazon-maria-mision-sevilla','Virgen · Gloria','1960','Madera de ciprés','Imagen neobarroca sedente del Inmaculado Corazón de María con el Niño Jesús.','Policromada, dorada y estofada; 165 x 80 x 79 cm.',false),
('san-juan-evangelista-mision-sevilla','Santo','1970','Madera de pino de Flandes','San Juan Evangelista representado como un joven adolescente.','Llegó a La Misión en 1986 procedente de Jesús Despojado.',false),
('jesus-salud-remedios-bellavista','Cristo','1964','Madera tallada y policromada','Cristo cautivo titular de Bellavista.','Obra póstuma de Antonio Castillo Lastrucci destinada inicialmente a una cofradía jerezana no fundada.',false),
('maria-santisima-dulce-nombre-bellavista','Virgen · Dolorosa','1969','Madera tallada y policromada','Dolorosa de candelero titular de Bellavista.','Advocación y bendición documentadas en 1969.',true),
('santisimo-cristo-pasion-muerte-sevilla','Cristo','1997','Madera de cedro','Crucificado que representa a Cristo inmediatamente después de expirar.','Mide 1,82 m; bendecido el 22 de marzo de 2002.',false),
('nuestra-senora-desconsuelo-visitacion','Virgen · Dolorosa','2001','Madera tallada y policromada','Dolorosa de cabeza inclinada y manos entrelazadas.','Bendecida en 2002; aún no procesiona bajo palio el Viernes de Dolores.',true),
('santa-maria-buen-aire-sevilla','Virgen · Gloria','Siglo XVIII','Madera y telas encoladas','Virgen de gloria sedente.','Autor anónimo de la escuela barroca sevillana.',false),
('santisimo-cristo-corona-sevilla','Cristo','Último cuarto del siglo XVI','Madera tallada y policromada','Nazareno anónimo de talla completa con la cruz al hombro.','Uno de los nazarenos procesionales más antiguos de Sevilla.',false),
('nuestra-senora-rosario-corona-sevilla','Virgen · Gloria','1638','Madera tallada y policromada','Virgen del Rosario con el Niño Jesús.','Obra de Manuel Pereira; restaurada en 2020.',false))
insert into public.images(entity_id,image_type,execution_date_text,material,current_condition,description,notes,is_dress_image,current_state_notes)
select e.id,seed.image_type,seed.date_text,seed.material,'extant',seed.description,seed.notes,seed.is_dress,'Imagen al culto.' from seed join public.entities e on e.slug=seed.slug
on conflict(entity_id) do update set image_type=excluded.image_type,execution_date_text=excluded.execution_date_text,material=excluded.material,current_condition=excluded.current_condition,description=excluded.description,notes=excluded.notes,is_dress_image=excluded.is_dress_image,current_state_notes=excluded.current_state_notes;

with seed(b_slug,i_slug) as (values
('bendicion-y-esperanza','jesus-bendicion-santo-encuentro'),('bendicion-y-esperanza','santa-maria-esperanza-soledad-bendicion'),
('hermandad-de-pino-montano','nuestro-padre-jesus-de-nazaret-pino-montano'),('hermandad-de-pino-montano','maria-santisima-amor-pino-montano'),
('hermandad-de-la-mision-sevilla','santo-cristo-mision-sevilla'),('hermandad-de-la-mision-sevilla','nuestra-senora-amparo-mision'),('hermandad-de-la-mision-sevilla','inmaculado-corazon-maria-mision-sevilla'),('hermandad-de-la-mision-sevilla','san-juan-evangelista-mision-sevilla'),
('dulce-nombre-bellavista','jesus-salud-remedios-bellavista'),('dulce-nombre-bellavista','maria-santisima-dulce-nombre-bellavista'),
('pasion-y-muerte','santisimo-cristo-pasion-muerte-sevilla'),('pasion-y-muerte','nuestra-senora-desconsuelo-visitacion'),('pasion-y-muerte','santa-maria-buen-aire-sevilla'),
('cristo-de-la-corona','santisimo-cristo-corona-sevilla'),('cristo-de-la-corona','nuestra-senora-rosario-corona-sevilla'))
insert into public.brotherhood_images(id,brotherhood_entity_id,image_entity_id,relation_type,notes,status)
select gen_random_uuid(),b.id,i.id,'titular','Titular de la corporación.','published' from seed join public.entities b on b.slug=seed.b_slug join public.entities i on i.slug=seed.i_slug
where not exists(select 1 from public.brotherhood_images x where x.brotherhood_entity_id=b.id and x.image_entity_id=i.id and x.relation_type='titular' and x.status<>'archived');
update public.brotherhood_images bi set status='published'
from public.entities b,public.entities i
where bi.brotherhood_entity_id=b.id and bi.image_entity_id=i.id and bi.relation_type='titular'
  and b.slug in ('bendicion-y-esperanza','hermandad-de-pino-montano','hermandad-de-la-mision-sevilla','dulce-nombre-bellavista','pasion-y-muerte','cristo-de-la-corona')
  and i.slug in ('jesus-bendicion-santo-encuentro','santa-maria-esperanza-soledad-bendicion','nuestro-padre-jesus-de-nazaret-pino-montano','maria-santisima-amor-pino-montano','santo-cristo-mision-sevilla','nuestra-senora-amparo-mision','inmaculado-corazon-maria-mision-sevilla','san-juan-evangelista-mision-sevilla','jesus-salud-remedios-bellavista','maria-santisima-dulce-nombre-bellavista','santisimo-cristo-pasion-muerte-sevilla','nuestra-senora-desconsuelo-visitacion','santa-maria-buen-aire-sevilla','santisimo-cristo-corona-sevilla','nuestra-senora-rosario-corona-sevilla');

with seed(image_slug,agent_slug,date_text) as (values
('jesus-bendicion-santo-encuentro','juan-antonio-blanco-ramos','2010'),('santa-maria-esperanza-soledad-bendicion','juan-antonio-blanco-ramos','2010'),
('nuestro-padre-jesus-de-nazaret-pino-montano','fernando-castejon-lopez','1989'),('maria-santisima-amor-pino-montano','fernando-castejon-lopez','1998'),
('santo-cristo-mision-sevilla','jose-manuel-bonilla-cornejo','1988'),('nuestra-senora-amparo-mision','jose-manuel-bonilla-cornejo','1999'),('inmaculado-corazon-maria-mision-sevilla','rafael-barbero-medina','1960'),('san-juan-evangelista-mision-sevilla','antonio-eslava-rubio','1970'),
('jesus-salud-remedios-bellavista','antonio-castillo-lastrucci','1964'),('maria-santisima-dulce-nombre-bellavista','luis-alvarez-duarte','1969'),
('santisimo-cristo-pasion-muerte-sevilla','jose-antonio-navarro-arteaga','1997'),('nuestra-senora-desconsuelo-visitacion','jose-antonio-navarro-arteaga','2001'),
('nuestra-senora-rosario-corona-sevilla','manuel-pereira-escultor','1638'))
insert into public.image_authorships(id,image_entity_id,agent_entity_id,authorship_type,role_name,date_from_text,certainty,notes,status)
select gen_random_uuid(),i.id,a.id,'author','Imaginero / escultor',seed.date_text,'documented','Autoría documentada.','published'
from seed join public.entities i on i.slug=seed.image_slug join public.entities a on a.slug=seed.agent_slug
where not exists(select 1 from public.image_authorships x where x.image_entity_id=i.id and x.agent_entity_id=a.id and x.authorship_type='author' and x.status<>'archived');
with seed(image_slug,date_text) as (values ('santa-maria-buen-aire-sevilla','Siglo XVIII'),('santisimo-cristo-corona-sevilla','Último cuarto del siglo XVI'))
insert into public.image_authorships(id,image_entity_id,agent_entity_id,authorship_type,role_name,date_from_text,certainty,notes,status)
select gen_random_uuid(),i.id,null,'anonymous','Autoría',seed.date_text,'unknown','Autor anónimo.','published' from seed join public.entities i on i.slug=seed.image_slug
where not exists(select 1 from public.image_authorships x where x.image_entity_id=i.id and x.authorship_type='anonymous' and x.status<>'archived');

with seed(b_slug,name,tunic,hood,cord,buttons,shield,footwear,notes) as (values
('bendicion-y-esperanza','Hábito de nazareno','Túnica y capa de sarga blanca.','Antifaz de sarga verde.','Cíngulo verde y negro.','Botonadura negra.','Escudo de la Hermandad bordado.','Guantes negros, calcetines blancos y zapatos negros de vestir.','Ficha oficial de 2026.'),
('hermandad-de-pino-montano','Hábito de nazareno','Túnica y capa de sarga blanca.','Antifaz de sarga morada; capirote de 70 cm.','Cíngulo morado y rojo.','Botonadura morada.','Escudo en la capa y JHS en el antifaz.','Guantes y calcetines blancos; zapatos negros o pies descalzos.','Portadores de cruces y manigueteros no llevan capirote.'),
('hermandad-de-la-mision-sevilla','Hábito de nazareno','Túnica de sarga blanca con escapulario azul pavo.','Antifaz azul pavo.','Cíngulo azul y blanco.','Botonadura azul pavo.','Simbología claretiana según Reglas.','Zapatos negros de cuero y calcetines blancos.','Indumentaria penitencial.'),
('dulce-nombre-bellavista','Hábito de nazareno','Túnica blanca de cola.','Antifaz morado.','Cíngulo según Reglas.','Botonadura morada.','Escudo corporativo.','Calzado oscuro según normativa.','Hábito general de la cofradía.'),
('pasion-y-muerte','Hábito de nazareno','Túnica de ruán negro de cola.','Antifaz y capirote de ruán negro.','Cinturón ancho de esparto.','Sin botonadura destacada.','Escudo oculto bajo el antifaz según la normativa.','Alpargatas y calcetines negros.','Hábito de riguroso negro.'),
('cristo-de-la-corona','Hábito de nazareno','Túnica de cola de ruán morado.','Antifaz y capirote de ruán morado.','Cinturón de esparto.','Sin dato específico documentado.','Escudo corporativo según Reglas.','Calzado negro de esparto.','Cera de color tiniebla.'))
insert into public.brotherhood_habits(brotherhood_entity_id,name,tunic_description,hood_description,cord_description,buttons_description,shield_description,footwear_description,sort_order,notes,status)
select b.id,seed.name,seed.tunic,seed.hood,seed.cord,seed.buttons,seed.shield,seed.footwear,1,seed.notes,'published' from seed join public.entities b on b.slug=seed.b_slug
on conflict(brotherhood_entity_id,name) do update set tunic_description=excluded.tunic_description,hood_description=excluded.hood_description,cord_description=excluded.cord_description,buttons_description=excluded.buttons_description,shield_description=excluded.shield_description,footwear_description=excluded.footwear_description,sort_order=excluded.sort_order,notes=excluded.notes,status='published',updated_at=now();

with seed(b_slug,color_name,hex_value,color_role,sort_order,notes) as (values
('bendicion-y-esperanza','Verde',null,'primary',1,'Color de antifaz y cíngulo; HEX institucional no documentado.'),('bendicion-y-esperanza','Blanco','#FFFFFF','secondary',2,'Color de túnica y capa.'),
('hermandad-de-pino-montano','Morado',null,'primary',1,'Color de antifaz y botonadura; HEX institucional no documentado.'),('hermandad-de-pino-montano','Blanco','#FFFFFF','secondary',2,'Color de túnica y capa.'),
('hermandad-de-la-mision-sevilla','Azul pavo',null,'primary',1,'Color de la indumentaria penitencial; HEX institucional no documentado.'),('hermandad-de-la-mision-sevilla','Blanco','#FFFFFF','secondary',2,'Color de la túnica.'),
('dulce-nombre-bellavista','Morado',null,'primary',1,'Color de antifaz y botonadura; HEX institucional no documentado.'),('dulce-nombre-bellavista','Blanco','#FFFFFF','secondary',2,'Color de la túnica.'),
('pasion-y-muerte','Morado',null,'primary',1,'Color de la cera y presente en el proyecto futuro de palio.'),('pasion-y-muerte','Negro','#000000','secondary',2,'Color del hábito y de la estética corporativa.'),
('cristo-de-la-corona','Morado',null,'primary',1,'Color del hábito; HEX institucional no documentado.'))
insert into public.brotherhood_colors(id,brotherhood_entity_id,color_name,hex_value,color_role,sort_order,notes,status)
select gen_random_uuid(),b.id,seed.color_name,seed.hex_value,seed.color_role,seed.sort_order,seed.notes,'published' from seed join public.entities b on b.slug=seed.b_slug
on conflict(brotherhood_entity_id,color_name) do update set hex_value=excluded.hex_value,color_role=excluded.color_role,sort_order=excluded.sort_order,notes=excluded.notes,status='published',updated_at=now();

with seed(name,url,source_type,publisher) as (values
('Ficha Cofradía Viernes de Dolores 2026 · Bendición y Esperanza','https://bendicionyesperanza.es/?p=3499','Fuente oficial','Hermandad de Bendición y Esperanza'),
('Historia · Bendición y Esperanza','https://bendicionyesperanza.es/?page_id=78','Fuente oficial','Hermandad de Bendición y Esperanza'),
('Pino Montano · Nuestro Padre Jesús de Nazaret','https://hermandadpinomontano.es/nuestro-padre-jesus-de-nazaret/','Fuente oficial','Hermandad de Pino Montano'),
('Pino Montano · María Santísima del Amor','https://hermandadpinomontano.es/maria-santisima-del-amor/','Fuente oficial','Hermandad de Pino Montano'),
('Historia · Hermandad de la Misión','https://archicofradiamision.es/historia/','Fuente oficial','Hermandad de la Misión'),
('Santo Cristo de la Misión','https://archicofradiamision.es/santo-cristo-de-la-mision/','Fuente oficial','Hermandad de la Misión'),
('Nuestra Señora del Amparo · La Misión','https://archicofradiamision.es/nuestra-senora-del-amparo/','Fuente oficial','Hermandad de la Misión'),
('Inmaculado Corazón de María · La Misión','https://archicofradiamision.es/inmaculado-corazon-de-maria/','Fuente oficial','Hermandad de la Misión'),
('San Juan Evangelista · La Misión','https://archicofradiamision.es/san-juan-evangelista/','Fuente oficial','Hermandad de la Misión'),
('Dulce Nombre de Bellavista · Consejo de Cofradías','https://www.hermandades-de-sevilla.org/semanasanta/vd_bellavista.html','Fuente institucional','Consejo General de Hermandades y Cofradías de Sevilla'),
('Estación de Penitencia 2026 · Pasión y Muerte','https://hermandadpasionymuerte.es/?p=3505','Fuente oficial','Hermandad de Pasión y Muerte'),
('Santísimo Cristo de Pasión y Muerte','https://hermandadpasionymuerte.es/?page_id=1360','Fuente oficial','Hermandad de Pasión y Muerte'),
('Santa María del Buen Aire','https://hermandadpasionymuerte.es/?page_id=1357','Fuente oficial','Hermandad de Pasión y Muerte'),
('Cristo de la Corona · Catedral de Sevilla 2026','https://www.catedraldesevilla.es/hoy-viernes-de-dolores-el-arzobispo-de-sevilla-presidira-la-procesion-del-cristo-de-la-corona/','Fuente institucional','Catedral de Sevilla'))
insert into public.sources(id,name,url,source_type,author_or_publisher,accessed_at,notes)
select gen_random_uuid(),seed.name,seed.url,seed.source_type,seed.publisher,date '2026-08-23','Fuente del lote Viernes de Dolores.' from seed
where not exists(select 1 from public.sources s where s.url=seed.url);

commit;
