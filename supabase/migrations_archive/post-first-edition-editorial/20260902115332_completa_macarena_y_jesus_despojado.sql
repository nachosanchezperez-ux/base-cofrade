-- Cierre editorial · La Macarena y Jesús Despojado
-- Solo DML sobre el modelo First Edition existente. No introduce DDL ni RLS.

do $$
declare
  v_macarena uuid;
  v_despojado uuid;
  v_mac_misterio uuid;
  v_mac_palio uuid;
  v_des_misterio uuid;
  v_des_palio uuid;
  v_sentencia uuid;
  v_esperanza uuid;
  v_rosario uuid;
  v_jesus_despojado uuid;
  v_dolores uuid;
  v_san_juan uuid;
  v_agent uuid;
  v_source_mac uuid;
  v_source_des uuid;
  v_record record;
begin
  select id into strict v_macarena from public.entities where slug='hermandad-de-la-macarena';
  select id into strict v_despojado from public.entities where slug='hermandad-jesus-despojado-sevilla';

  insert into public.sources(name,url,source_type,author_or_publisher,accessed_at,notes) values
    ('Macarena · ficha institucional del Consejo','https://www.hermandades-de-sevilla.org/semanasanta/madrug_la_macarena.html','Fuente institucional','Consejo General de Hermandades y Cofradías de Sevilla',date '2026-09-02','Historia, titulares, pasos, hábito, capataces, música y patrimonio procesional.'),
    ('Macarena · titulares oficiales','https://www.hermandaddelamacarena.es/titulares/','Web oficial','Hermandad de la Macarena',date '2026-09-02','Relación oficial de titulares de la corporación.'),
    ('Jesús Despojado · ficha institucional del Consejo','https://www.hermandades-de-sevilla.org/semanasanta/dramos_jesus_despojado.html','Fuente institucional','Consejo General de Hermandades y Cofradías de Sevilla',date '2026-09-02','Historia, titulares, pasos, hábito, capataces, música y patrimonio procesional.')
  on conflict do nothing;

  select id into strict v_source_mac from public.sources where url='https://www.hermandades-de-sevilla.org/semanasanta/madrug_la_macarena.html' order by created_at limit 1;
  select id into strict v_source_des from public.sources where url='https://www.hermandades-de-sevilla.org/semanasanta/dramos_jesus_despojado.html' order by created_at limit 1;

  -- Agentes documentados. Cada intervención conserva su rol específico.
  for v_record in select * from (values
    ('felipe-de-morales-nieto','Felipe de Morales Nieto','person'),
    ('antonio-perea-sanchez','Antonio Perea Sánchez','person'),
    ('manuel-ramos-corona','Manuel Ramos Corona','person'),
    ('rafael-rodriguez-quiros','Rafael Rodríguez Quirós','person'),
    ('pedro-diaz-diaz','Pedro Díaz Díaz','person')
  ) x(slug,name,kind)
  loop
    select id into v_agent from public.entities where slug=v_record.slug;
    if v_agent is null then
      insert into public.entities(entity_type,name,slug,summary,status)
      values('agent',v_record.name,v_record.slug,'Autor o responsable documentado en fuentes institucionales de las hermandades auditadas.','published')
      returning id into v_agent;
    else
      update public.entities set status='published',updated_at=now() where id=v_agent;
    end if;
    insert into public.agents(entity_id,agent_kind,description)
    values(v_agent,v_record.kind,'Agente documentado en patrimonio o dirección de pasos procesionales.')
    on conflict(entity_id) do update set agent_kind=excluded.agent_kind,description=excluded.description;
  end loop;

  -- LA MACARENA · tres titulares y dos pasos.
  select id into v_esperanza from public.entities where slug='maria-santisima-esperanza-macarena';
  update public.entities set
    name='María Santísima de la Esperanza Macarena',
    summary='Dolorosa anónima del siglo XVII, coronada canónicamente en 1964 y titular de la Hermandad de la Macarena.',
    status='published',updated_at=now()
  where id=v_esperanza;

  select id into v_sentencia from public.entities where slug='nuestro-padre-jesus-sentencia-macarena';
  if v_sentencia is null then
    insert into public.entities(entity_type,name,slug,summary,status)
    values('image','Nuestro Padre Jesús de la Sentencia','nuestro-padre-jesus-sentencia-macarena','Titular cristífero realizado por Felipe de Morales Nieto en 1654.','published')
    returning id into v_sentencia;
  end if;

  select id into v_rosario from public.entities where slug='nuestra-senora-santo-rosario-macarena';
  if v_rosario is null then
    insert into public.entities(entity_type,name,slug,summary,status)
    values('image','Nuestra Señora del Santo Rosario','nuestra-senora-santo-rosario-macarena','Titular letífica incorporada a la corporación tras la fusión aprobada en 1793.','published')
    returning id into v_rosario;
  end if;

  insert into public.images(entity_id,image_type,execution_date_text,material,technique,current_condition,description,iconography,anatomical_type,is_dress_image,current_state_notes) values
    (v_sentencia,'Cristo cautivo','1654','Madera policromada','Talla policromada','extant','Cristo maniatado preside el misterio de la sentencia de Pilato.','Sentencia de muerte de Cristo','Talla completa',true,'Autoría original de Felipe de Morales Nieto; no se confunde con las figuras secundarias posteriores.'),
    (v_esperanza,'Dolorosa','Siglo XVII','Madera policromada','Talla de vestir','extant','Dolorosa de autor desconocido y devoción universal, coronada canónicamente el 31 de mayo de 1964.','Dolorosa bajo palio','Imagen de vestir',true,'La fuente institucional mantiene la autoría como desconocida.'),
    (v_rosario,'Virgen gloriosa',null,'Madera policromada','Talla policromada','extant','Titular de gloria de la corporación, vinculada a la hermandad del Santo Rosario fusionada en 1793.','Nuestra Señora del Santo Rosario','Imagen de vestir',true,'Recibe culto en una capilla lateral de la basílica.')
  on conflict(entity_id) do update set image_type=excluded.image_type,execution_date_text=excluded.execution_date_text,material=excluded.material,technique=excluded.technique,current_condition=excluded.current_condition,description=excluded.description,iconography=excluded.iconography,anatomical_type=excluded.anatomical_type,is_dress_image=excluded.is_dress_image,current_state_notes=excluded.current_state_notes;

  insert into public.brotherhood_images(brotherhood_entity_id,image_entity_id,relation_type,date_from_text,notes,status)
  select v_macarena,d.image_id,'titular',d.date_text,d.notes,'published'
  from (values
    (v_sentencia,'Desde 1654','Titular cristífero y figura principal del paso de misterio.'),
    (v_esperanza,'Vinculación histórica','Titular mariana de penitencia.'),
    (v_rosario,'Fusión aprobada en 1793','Titular letífica de la corporación.')
  ) d(image_id,date_text,notes)
  where not exists(select 1 from public.brotherhood_images bi where bi.brotherhood_entity_id=v_macarena and bi.image_entity_id=d.image_id);
  update public.brotherhood_images set status='published' where brotherhood_entity_id=v_macarena and image_entity_id in(v_sentencia,v_esperanza,v_rosario);

  select id into v_agent from public.entities where slug='felipe-de-morales-nieto';
  insert into public.image_authorships(image_entity_id,agent_entity_id,authorship_type,role_name,date_from_text,certainty,notes,status)
  select v_sentencia,v_agent,'author','autor','1654','documented','Autoría original documentada por el Consejo de Hermandades.','published'
  where not exists(select 1 from public.image_authorships where image_entity_id=v_sentencia and agent_entity_id=v_agent and authorship_type='author');
  insert into public.image_authorships(image_entity_id,agent_entity_id,authorship_type,role_name,date_from_text,certainty,notes,status)
  select v_esperanza,null,'anonymous','autor desconocido','Siglo XVII','unknown','La ficha institucional no atribuye la imagen a un autor concreto.','published'
  where not exists(select 1 from public.image_authorships where image_entity_id=v_esperanza and authorship_type='anonymous');

  select id into v_mac_palio from public.entities where slug='paso-palio-esperanza-macarena';
  update public.entities set name='Paso de palio de María Santísima de la Esperanza Macarena',summary='Paso de palio de la Esperanza Macarena, con bordados y orfebrería esenciales del patrimonio macareno.',status='published',updated_at=now() where id=v_mac_palio;
  select id into v_mac_misterio from public.entities where slug='paso-misterio-sentencia-macarena';
  if v_mac_misterio is null then
    insert into public.entities(entity_type,name,slug,summary,status)
    values('step','Paso de misterio de Nuestro Padre Jesús de la Sentencia','paso-misterio-sentencia-macarena','Representa la lectura de la sentencia de Pilato a Cristo.','published') returning id into v_mac_misterio;
  end if;
  insert into public.steps(entity_id,step_type,current_condition,description,style,materials,execution_date_text,carrier_system,current_state_notes) values
    (v_mac_misterio,'Misterio','preserved','Cristo maniatado comparece ante Pilato, que se lava las manos, con Claudia Prócula, soldados y sayones. Las figuras son de Antonio Castillo Lastrucci salvo el Señor y el centurión de Luis Álvarez Duarte.','Neobarroco','Madera tallada y dorada, plata y esculturas policromadas','Canastilla de Pérez Calvo, estrenada en 1955','Costaleros','Conserva cuatro templetes relicarios de Fernando Marmolejo.'),
    (v_mac_palio,'Palio','preserved','Paso de palio de la Esperanza Macarena con mantos históricos, corona de oro y conjunto bordado ligado al modelo macareno.','Regionalista','Terciopelo bordado en oro y orfebrería','Conjunto histórico con piezas de los siglos XIX y XX','Costaleros','Alterna los mantos de Malla, Tisú y Coronación documentados por la fuente institucional.')
  on conflict(entity_id) do update set step_type=excluded.step_type,current_condition=excluded.current_condition,description=excluded.description,style=excluded.style,materials=excluded.materials,execution_date_text=excluded.execution_date_text,carrier_system=excluded.carrier_system,current_state_notes=excluded.current_state_notes;
  insert into public.brotherhood_steps(brotherhood_entity_id,step_entity_id,relation_type,notes,status)
  select v_macarena,d.step_id,'owns',d.notes,'published' from (values(v_mac_misterio,'Primer paso de la estación de penitencia.'),(v_mac_palio,'Segundo paso de la estación de penitencia.')) d(step_id,notes)
  where not exists(select 1 from public.brotherhood_steps bs where bs.brotherhood_entity_id=v_macarena and bs.step_entity_id=d.step_id);
  insert into public.image_steps(image_entity_id,step_entity_id,relation_type,notes,status)
  select d.image_id,d.step_id,'processes_on',d.notes,'published' from (values(v_sentencia,v_mac_misterio,'Imagen principal del misterio.'),(v_esperanza,v_mac_palio,'Imagen principal del palio.')) d(image_id,step_id,notes)
  where not exists(select 1 from public.image_steps x where x.image_entity_id=d.image_id and x.step_entity_id=d.step_id and x.relation_type='processes_on');

  update public.music_accompaniment_periods set step_entity_id=v_mac_misterio,position='Tras el paso del Señor',outing_type='Estación de penitencia',updated_at=now()
  where brotherhood_entity_id=v_macarena and is_current and band_entity_id=(select id from public.entities where slug='centuria-romana-macarena');
  update public.music_accompaniment_periods set step_entity_id=v_mac_palio,position='Tras el paso de palio',outing_type='Estación de penitencia',updated_at=now()
  where brotherhood_entity_id=v_macarena and is_current and band_entity_id=(select id from public.entities where slug='carmen-de-salteras');

  insert into public.brotherhood_habits(brotherhood_entity_id,name,tunic_description,hood_description,sort_order,notes,status) values
    (v_macarena,'Cortejo del Señor','Túnica de color merino','Antifaz morado',1,'Hábito de los nazarenos que acompañan a Nuestro Padre Jesús de la Sentencia.','published'),
    (v_macarena,'Cortejo de la Virgen','Túnica de color merino','Antifaz verde',2,'Hábito de los nazarenos que acompañan a la Esperanza Macarena.','published')
  on conflict do nothing;
  insert into public.brotherhood_colors(brotherhood_entity_id,color_name,hex_value,color_role,sort_order,notes,status) values
    (v_macarena,'Merino',null,'primary',1,'Color documentado de la túnica; no se fija un HEX institucional.','published'),
    (v_macarena,'Verde',null,'secondary',2,'Color documentado del antifaz del cortejo de la Virgen.','published'),
    (v_macarena,'Morado',null,'accent',3,'Color documentado del antifaz del cortejo del Señor.','published')
  on conflict(brotherhood_entity_id,color_name) do update set color_role=excluded.color_role,sort_order=excluded.sort_order,notes=excluded.notes,status=excluded.status,updated_at=now();

  -- JESÚS DESPOJADO · tres titulares y dos pasos.
  for v_record in select * from (values
    ('nuestro-padre-jesus-despojado-vestiduras-sevilla','Nuestro Padre Jesús Despojado de sus Vestiduras','Titular cristífero realizado por Antonio Perea Sánchez en 1939.'),
    ('maria-santisima-dolores-misericordia-sevilla','María Santísima de los Dolores y Misericordia','Dolorosa realizada por Antonio Eslava Rubio y bendecida en 1962.'),
    ('san-juan-evangelista-jesus-despojado-sevilla','San Juan Evangelista','Cotitular que acompaña a la Virgen en el paso de palio.')
  ) x(slug,name,summary)
  loop
    select id into v_agent from public.entities where slug=v_record.slug;
    if v_agent is null then insert into public.entities(entity_type,name,slug,summary,status) values('image',v_record.name,v_record.slug,v_record.summary,'published') returning id into v_agent;
    else update public.entities set name=v_record.name,summary=v_record.summary,status='published',updated_at=now() where id=v_agent; end if;
  end loop;
  select id into strict v_jesus_despojado from public.entities where slug='nuestro-padre-jesus-despojado-vestiduras-sevilla';
  select id into strict v_dolores from public.entities where slug='maria-santisima-dolores-misericordia-sevilla';
  select id into strict v_san_juan from public.entities where slug='san-juan-evangelista-jesus-despojado-sevilla';
  insert into public.images(entity_id,image_type,execution_date_text,material,technique,current_condition,description,iconography,anatomical_type,is_dress_image,current_state_notes) values
    (v_jesus_despojado,'Cristo de misterio','1939','Madera policromada','Talla policromada','extant','Cristo es despojado de sus vestiduras antes de la crucifixión.','Despojo de las vestiduras de Cristo','Talla completa',true,'Obra realizada por Antonio Perea Sánchez durante la Guerra Civil.'),
    (v_dolores,'Dolorosa','1962','Madera policromada','Talla de vestir','extant','Dolorosa realizada por Antonio Eslava Rubio para la corporación reorganizada.','Dolorosa bajo palio','Imagen de vestir',true,'Bendecida en 1962.'),
    (v_san_juan,'San Juan Evangelista','Siglo XX','Madera policromada','Talla de vestir','extant','San Juan acompaña a María Santísima de los Dolores y Misericordia bajo palio.','San Juan junto a la Virgen','Imagen de vestir',true,'La fecha y autoría exactas quedan pendientes de una fuente oficial específica.')
  on conflict(entity_id) do update set image_type=excluded.image_type,execution_date_text=excluded.execution_date_text,material=excluded.material,technique=excluded.technique,current_condition=excluded.current_condition,description=excluded.description,iconography=excluded.iconography,anatomical_type=excluded.anatomical_type,is_dress_image=excluded.is_dress_image,current_state_notes=excluded.current_state_notes;
  insert into public.brotherhood_images(brotherhood_entity_id,image_entity_id,relation_type,date_from_text,notes,status)
  select v_despojado,d.image_id,'titular',d.date_text,d.notes,'published' from (values(v_jesus_despojado,'Desde 1939','Titular cristífero y figura principal del misterio.'),(v_dolores,'Desde 1962','Titular mariana.'),(v_san_juan,'Vinculación vigente','Cotitular que acompaña a la Virgen bajo palio.')) d(image_id,date_text,notes)
  where not exists(select 1 from public.brotherhood_images bi where bi.brotherhood_entity_id=v_despojado and bi.image_entity_id=d.image_id);

  select id into v_agent from public.entities where slug='antonio-perea-sanchez';
  insert into public.image_authorships(image_entity_id,agent_entity_id,authorship_type,role_name,date_from_text,certainty,status)
  select v_jesus_despojado,v_agent,'author','autor','1939','documented','published' where not exists(select 1 from public.image_authorships where image_entity_id=v_jesus_despojado and agent_entity_id=v_agent and authorship_type='author');
  select id into v_agent from public.entities where slug='antonio-eslava-rubio';
  insert into public.image_authorships(image_entity_id,agent_entity_id,authorship_type,role_name,date_from_text,certainty,status)
  select v_dolores,v_agent,'author','autor','1962','documented','published' where not exists(select 1 from public.image_authorships where image_entity_id=v_dolores and agent_entity_id=v_agent and authorship_type='author');

  select id into v_des_misterio from public.entities where slug='paso-misterio-jesus-despojado-sevilla';
  if v_des_misterio is null then insert into public.entities(entity_type,name,slug,summary,status) values('step','Paso de misterio de Nuestro Padre Jesús Despojado','paso-misterio-jesus-despojado-sevilla','Paso neobarroco del misterio del Despojo de las Vestiduras.','published') returning id into v_des_misterio; end if;
  select id into v_des_palio from public.entities where slug='paso-palio-dolores-misericordia-sevilla';
  if v_des_palio is null then insert into public.entities(entity_type,name,slug,summary,status) values('step','Paso de palio de María Santísima de los Dolores y Misericordia','paso-palio-dolores-misericordia-sevilla','Paso de palio de inspiración romántica y decimonónica.','published') returning id into v_des_palio; end if;
  insert into public.steps(entity_id,step_type,current_condition,description,style,materials,execution_date_text,carrier_system,current_state_notes) values
    (v_des_misterio,'Misterio','preserved','Paso diseñado por Antonio Martín Fernández y tallado por Francisco Bailac Cenizo; representa el Despojo con figuras secundarias de Manuel Ramos Corona estrenadas desde 1998.','Neobarroco','Madera tallada y dorada, bordados y esculturas policromadas','Talla completada en 1978; dorado de Hermanos González en 2016','Costaleros','Los santos de las esquinas representan las sedes históricas de la corporación.'),
    (v_des_palio,'Palio','preserved','Palio de modelo romántico y decimonónico con piezas históricas de las Antúnez y respiraderos de Cayetano González, completado con bordados contemporáneos de Grande de León.','Romántico','Terciopelo azul, bordados en hilo metálico dorado y orfebrería','Piezas desde 1886; incorporaciones de 2007, 2012 y 2022','Costaleros','Conjunto patrimonial formado por piezas históricas y contemporáneas documentadas.')
  on conflict(entity_id) do update set step_type=excluded.step_type,current_condition=excluded.current_condition,description=excluded.description,style=excluded.style,materials=excluded.materials,execution_date_text=excluded.execution_date_text,carrier_system=excluded.carrier_system,current_state_notes=excluded.current_state_notes;
  insert into public.brotherhood_steps(brotherhood_entity_id,step_entity_id,relation_type,notes,status)
  select v_despojado,d.step_id,'owns',d.notes,'published' from (values(v_des_misterio,'Primer paso de la estación de penitencia.'),(v_des_palio,'Segundo paso de la estación de penitencia.')) d(step_id,notes)
  where not exists(select 1 from public.brotherhood_steps bs where bs.brotherhood_entity_id=v_despojado and bs.step_entity_id=d.step_id);
  insert into public.image_steps(image_entity_id,step_entity_id,relation_type,notes,status)
  select d.image_id,d.step_id,'processes_on',d.notes,'published' from (values(v_jesus_despojado,v_des_misterio,'Imagen principal del misterio.'),(v_dolores,v_des_palio,'Imagen principal del palio.'),(v_san_juan,v_des_palio,'Acompaña a la Virgen bajo palio.')) d(image_id,step_id,notes)
  where not exists(select 1 from public.image_steps x where x.image_entity_id=d.image_id and x.step_entity_id=d.step_id and x.relation_type='processes_on');

  update public.music_accompaniment_periods set step_entity_id=v_des_misterio,position='Tras el paso de misterio',outing_type='Estación de penitencia',updated_at=now()
  where brotherhood_entity_id=v_despojado and band_entity_id=(select id from public.entities where slug='agrupacion-musical-virgen-de-los-reyes-sevilla');

  insert into public.brotherhood_habits(brotherhood_entity_id,name,tunic_description,hood_description,cord_description,buttons_description,shield_description,footwear_description,sort_order,notes,status)
  select v_despojado,'Hábito penitencial','Sotana de color crema y capa negra','Antifaz negro','Cíngulo morado','Botonadura morada','Escudo mercedario en el antifaz y escudo de la Hermandad en el lado izquierdo de la capa','Calcetines blancos, zapatos negros y guantes blancos',1,'Descripción institucional vigente.','published'
  where not exists(select 1 from public.brotherhood_habits where brotherhood_entity_id=v_despojado);
  insert into public.brotherhood_colors(brotherhood_entity_id,color_name,hex_value,color_role,sort_order,notes,status) values
    (v_despojado,'Crema',null,'primary',1,'Color documentado de la sotana; sin fijar un HEX institucional.','published'),
    (v_despojado,'Negro','#000000','secondary',2,'Color documentado de capa y antifaz.','published'),
    (v_despojado,'Morado',null,'accent',3,'Color documentado de botonadura y cíngulo.','published')
  on conflict(brotherhood_entity_id,color_name) do update set hex_value=excluded.hex_value,color_role=excluded.color_role,sort_order=excluded.sort_order,notes=excluded.notes,status=excluded.status,updated_at=now();

  -- Patrimonio destacado: entidades relacionadas, no texto aislado.
  for v_record in select * from (values
    ('manto-malla-esperanza-macarena','Manto de Malla de la Esperanza Macarena',v_macarena,'Manto','Terciopelo bordado en oro','Juan Manuel Rodríguez Ojeda','Manto procesional histórico documentado por el Consejo.',v_source_mac),
    ('manto-tisu-esperanza-macarena','Manto de Tisú de la Esperanza Macarena',v_macarena,'Manto','Tisú bordado en oro','Juan Manuel Rodríguez Ojeda','Manto procesional histórico documentado por el Consejo.',v_source_mac),
    ('manto-coronacion-esperanza-macarena','Manto de la Coronación de la Esperanza Macarena',v_macarena,'Manto','Tejido bordado en oro','Esperanza Elena Caro','Manto procesional asociado a la coronación canónica.',v_source_mac),
    ('cruz-guia-jesus-despojado-2024','Cruz de Guía de Jesús Despojado',v_despojado,'Insignia','Madera tallada y dorada con pintura y orfebrería','Francisco Verdugo, Hermanos González, Manuel Mazuecos y Alejandro Marmolejo','Cruz de Guía estrenada en 2024.',v_source_des),
    ('bambalinas-exteriores-dolores-misericordia','Bambalinas exteriores del palio de Dolores y Misericordia',v_despojado,'Bordado','Terciopelo bordado','José Antonio Grande de León','Bambalinas exteriores realizadas en 2007.',v_source_des),
    ('manto-salida-dolores-misericordia','Manto de salida de Dolores y Misericordia',v_despojado,'Manto','Tejido bordado','José Antonio Grande de León','Manto de salida realizado en 2012.',v_source_des)
  ) x(slug,name,parent_id,asset_type,materials,technique,description,source_id)
  loop
    select id into v_agent from public.entities where slug=v_record.slug;
    if v_agent is null then insert into public.entities(entity_type,name,slug,summary,status) values('heritage_asset',v_record.name,v_record.slug,v_record.description,'published') returning id into v_agent; else update public.entities set status='published',updated_at=now() where id=v_agent; end if;
    insert into public.heritage_assets(entity_id,parent_entity_id,asset_type,description,current_condition,is_current,materials,technique,display_order,is_featured)
    values(v_agent,v_record.parent_id,v_record.asset_type,v_record.description,'preserved',true,v_record.materials,v_record.technique,0,false)
    on conflict(entity_id) do update set parent_entity_id=excluded.parent_entity_id,asset_type=excluded.asset_type,description=excluded.description,current_condition=excluded.current_condition,is_current=excluded.is_current,materials=excluded.materials,technique=excluded.technique;
    insert into public.source_links(source_id,entity_id,scope,notes)
    select v_record.source_id,v_agent,'Patrimonio documentado','Cierre editorial de Hermandades · 2 de septiembre de 2026'
    where not exists(select 1 from public.source_links where source_id=v_record.source_id and entity_id=v_agent);
  end loop;

  -- Trazabilidad de titulares, pasos, hábitos, capataces y acompañamientos.
  insert into public.source_links(source_id,entity_id,scope,notes)
  select d.source_id,d.entity_id,d.scope,'Cierre editorial de Hermandades · 2 de septiembre de 2026'
  from (values
    (v_source_mac,v_macarena,'Historia, titulares y estación de penitencia'),(v_source_mac,v_sentencia,'Autoría y titularidad'),(v_source_mac,v_esperanza,'Cronología, autoría y coronación'),(v_source_mac,v_rosario,'Titularidad y fusión histórica'),(v_source_mac,v_mac_misterio,'Descripción patrimonial del paso'),(v_source_mac,v_mac_palio,'Descripción patrimonial del paso'),
    (v_source_des,v_despojado,'Historia, titulares y estación de penitencia'),(v_source_des,v_jesus_despojado,'Autoría y cronología'),(v_source_des,v_dolores,'Autoría y cronología'),(v_source_des,v_san_juan,'Titularidad y relación procesional'),(v_source_des,v_des_misterio,'Descripción patrimonial del paso'),(v_source_des,v_des_palio,'Descripción patrimonial del paso')
  ) d(source_id,entity_id,scope)
  where not exists(select 1 from public.source_links sl where sl.source_id=d.source_id and sl.entity_id=d.entity_id and sl.scope=d.scope);

  insert into public.source_links(source_id,brotherhood_habit_id,scope,notes)
  select case when h.brotherhood_entity_id=v_macarena then v_source_mac else v_source_des end,h.id,'Hábito penitencial','Descripción institucional vigente.'
  from public.brotherhood_habits h where h.brotherhood_entity_id in(v_macarena,v_despojado)
    and not exists(select 1 from public.source_links sl where sl.brotherhood_habit_id=h.id);
  insert into public.source_links(source_id,music_accompaniment_period_id,scope,notes)
  select case when m.brotherhood_entity_id=v_macarena then v_source_mac else v_source_des end,m.id,'Acompañamiento procesional','Fuente institucional vigente.'
  from public.music_accompaniment_periods m where m.brotherhood_entity_id in(v_macarena,v_despojado) and m.is_current
    and not exists(select 1 from public.source_links sl where sl.music_accompaniment_period_id=m.id);

  -- Capataces vigentes, con periodos separados por paso.
  for v_record in select * from (values
    ('antonio-santiago-munoz',v_mac_misterio,v_source_mac),
    ('antonio-santiago-munoz',v_mac_palio,v_source_mac),
    ('rafael-rodriguez-quiros',v_des_misterio,v_source_des),
    ('pedro-diaz-diaz',v_des_palio,v_source_des)
  ) x(agent_slug,step_id,source_id)
  loop
    select id into strict v_agent from public.entities where slug=v_record.agent_slug;
    insert into public.step_personnel_periods(step_entity_id,agent_entity_id,role_name,date_from_text,is_current,notes,status)
    select v_record.step_id,v_agent,'Capataz','Vigente en 2026',true,'Responsabilidad actual documentada por el Consejo de Hermandades.','published'
    where not exists(select 1 from public.step_personnel_periods p where p.step_entity_id=v_record.step_id and p.agent_entity_id=v_agent and p.role_name='Capataz' and p.is_current);
    insert into public.source_links(source_id,step_personnel_period_id,scope,notes)
    select v_record.source_id,p.id,'Capataz actual','Ficha institucional consultada el 2 de septiembre de 2026.'
    from public.step_personnel_periods p where p.step_entity_id=v_record.step_id and p.agent_entity_id=v_agent and p.role_name='Capataz' and p.is_current
      and not exists(select 1 from public.source_links sl where sl.source_id=v_record.source_id and sl.step_personnel_period_id=p.id);
  end loop;

  -- Certificación relacional. Media queda vacía deliberadamente: no hay licencia reutilizable acreditada.
  if (select count(*) from public.brotherhood_images where brotherhood_entity_id=v_macarena and status='published') < 3 then raise exception 'Macarena: faltan titulares publicados'; end if;
  if (select count(*) from public.brotherhood_steps where brotherhood_entity_id=v_macarena and status='published') <> 2 then raise exception 'Macarena: deben existir dos pasos publicados'; end if;
  if (select count(*) from public.brotherhood_images where brotherhood_entity_id=v_despojado and status='published') < 3 then raise exception 'Jesús Despojado: faltan titulares publicados'; end if;
  if (select count(*) from public.brotherhood_steps where brotherhood_entity_id=v_despojado and status='published') <> 2 then raise exception 'Jesús Despojado: deben existir dos pasos publicados'; end if;
  if exists(select 1 from public.music_accompaniment_periods m where m.brotherhood_entity_id in(v_macarena,v_despojado) and m.is_current and m.step_entity_id is null) then raise exception 'Los acompañamientos vigentes deben apuntar a su paso exacto'; end if;
end
$$;
