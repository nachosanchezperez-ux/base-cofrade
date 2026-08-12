-- Hilo Cofrade · Ampliación documental de la Asunción de Cantillana
-- Migración 014
--
-- Fuente primaria:
--   https://www.asunciondecantillana.es/titular/iconografia
--   https://www.asunciondecantillana.es/patrimonio/paso-procesional
--
-- Esta migración amplía la ficha de la imagen titular, documenta sus
-- restauraciones y registra la evolución histórica del paso procesional.
-- Los nombres de autor que pueden ser variantes de una misma persona se
-- conservan separados mientras no exista una fuente que permita unificarlos.

-- -----------------------------------------------------------------------------
-- Imagen titular: descripción material e iconográfica
-- -----------------------------------------------------------------------------

update public.images
set
  technique = 'Escultura policromada y estofada',
  dimensions_text = 'Tamaño natural',
  iconography = 'La Virgen se representa semiarrodillada sobre una nube de querubines, con una rodilla hincada y la otra semilevantada. Inclina ligeramente el cuerpo hacia la izquierda, dirige el rostro al cielo y abre los brazos en actitud de movimiento, vuelo y contemplación de Dios.',
  anatomical_type = 'Escultura de tamaño natural, semiarrodillada',
  is_dress_image = false,
  current_state_notes = 'Conservada al culto en el retablo mayor. La web oficial documenta una restauración previa a su llegada a Cantillana y otras cuatro intervenciones entre 1936 y 2015.',
  description = 'Escultura de tamaño natural del siglo XVI y autor desconocido. Representa a la Virgen semiarrodillada sobre una nube de querubines, con el rostro elevado al cielo y los brazos abiertos. El vestido y el manto presentan una rica decoración estofada en oro y motivos florales.',
  notes = 'Adquirida por la Hermandad en 1840. La web oficial considera incierto su origen y señala como probable un culto anterior en el convento del Regina Angelorum de Sevilla; tras la desamortización quedó bajo custodia del arzobispado.'
where entity_id = '33000000-0000-0000-0000-000000000001';

-- -----------------------------------------------------------------------------
-- Autores y restauradores de la imagen
-- -----------------------------------------------------------------------------

insert into public.entities (id, entity_type, name, slug, summary, status) values
(
  '3a000000-0000-0000-0000-000000000001',
  'agent',
  'Gabriel de Astorga',
  'gabriel-de-astorga',
  'Escultor al que la web oficial atribuye, con probabilidad, la restauración de la imagen antes de su llegada a Cantillana en 1840.',
  'published'
),
(
  '3a000000-0000-0000-0000-000000000002',
  'agent',
  'José Rivera',
  'jose-rivera-restaurador-asuncion-cantillana',
  'Restaurador citado con este nombre por la Hermandad en la intervención de la imagen realizada a comienzos de la década de 1940.',
  'published'
),
(
  '3a000000-0000-0000-0000-000000000003',
  'agent',
  'José Rodríguez Rivero-Carrera',
  'jose-rodriguez-rivero-carrera',
  'Restaurador de Nuestra Señora de la Asunción de Cantillana en 1999.',
  'published'
),
(
  '3a000000-0000-0000-0000-000000000004',
  'agent',
  'Pedro Manzano',
  'pedro-manzano-restaurador',
  'Restaurador de Nuestra Señora de la Asunción de Cantillana en 2015.',
  'published'
)
on conflict (id) do nothing;

insert into public.agents (
  entity_id, agent_kind, description, active_notes
) values
(
  '3a000000-0000-0000-0000-000000000001',
  'person',
  'Escultor documentado en la ficha por su intervención atribuida sobre la imagen titular.',
  'La autoría de la restauración se expresa como probable en la fuente oficial.'
),
(
  '3a000000-0000-0000-0000-000000000002',
  'person',
  'Restaurador citado en la historia material de la imagen titular.',
  'La fuente oficial utiliza la forma José Rivera. No se unifica con otros nombres similares sin evidencia documental.'
),
(
  '3a000000-0000-0000-0000-000000000003',
  'person',
  'Restaurador citado en la historia material de la imagen titular.',
  null
),
(
  '3a000000-0000-0000-0000-000000000004',
  'person',
  'Restaurador citado en la historia material de la imagen titular.',
  null
)
on conflict (entity_id) do nothing;

insert into public.agent_disciplines (
  agent_entity_id, discipline, is_primary, notes
) values
('3a000000-0000-0000-0000-000000000001','Restauración',true,'Intervención atribuida por la fuente oficial.'),
('3a000000-0000-0000-0000-000000000001','Escultura',false,null),
('3a000000-0000-0000-0000-000000000002','Restauración',true,null),
('3a000000-0000-0000-0000-000000000003','Restauración',true,null),
('3a000000-0000-0000-0000-000000000004','Restauración',true,null)
on conflict (agent_entity_id, discipline) do nothing;

-- -----------------------------------------------------------------------------
-- Restauraciones de la imagen
-- -----------------------------------------------------------------------------

insert into public.heritage_updates (
  id,
  brotherhood_entity_id,
  update_type,
  title,
  year,
  target_entity_id,
  element_name,
  discipline,
  description,
  status
) values
(
  '3b000000-0000-0000-0000-000000000001',
  '30000000-0000-0000-0000-000000000002',
  'restauracion',
  'Restauración previa a la llegada de la imagen a Cantillana',
  1840,
  '33000000-0000-0000-0000-000000000001',
  'Nuestra Señora de la Asunción',
  'Restauración escultórica',
  'Antes de su llegada a Cantillana, la imagen recibió una restauración que la web oficial atribuye, con toda probabilidad, a Gabriel de Astorga.',
  'published'
),
(
  '3b000000-0000-0000-0000-000000000002',
  '30000000-0000-0000-0000-000000000002',
  'restauracion',
  'Restauración durante la estancia de la imagen en Sevilla',
  1936,
  '33000000-0000-0000-0000-000000000001',
  'Nuestra Señora de la Asunción',
  'Restauración escultórica',
  'Primera de las cuatro restauraciones enumeradas por la Hermandad. Se realizó durante la estancia de la imagen en Sevilla en la Guerra Civil, entre 1936 y 1937. La fuente no identifica al responsable.',
  'published'
),
(
  '3b000000-0000-0000-0000-000000000003',
  '30000000-0000-0000-0000-000000000002',
  'restauracion',
  'Restauración de comienzos de la década de 1940',
  1940,
  '33000000-0000-0000-0000-000000000001',
  'Nuestra Señora de la Asunción',
  'Restauración escultórica',
  'Intervención realizada en los primeros años de la década de 1940 por José Rivera.',
  'published'
),
(
  '3b000000-0000-0000-0000-000000000004',
  '30000000-0000-0000-0000-000000000002',
  'restauracion',
  'Restauración de Nuestra Señora de la Asunción en 1999',
  1999,
  '33000000-0000-0000-0000-000000000001',
  'Nuestra Señora de la Asunción',
  'Restauración escultórica',
  'Restauración realizada por José Rodríguez Rivero-Carrera.',
  'published'
),
(
  '3b000000-0000-0000-0000-000000000005',
  '30000000-0000-0000-0000-000000000002',
  'restauracion',
  'Restauración de Nuestra Señora de la Asunción en 2015',
  2015,
  '33000000-0000-0000-0000-000000000001',
  'Nuestra Señora de la Asunción',
  'Restauración escultórica',
  'Restauración realizada por Pedro Manzano.',
  'published'
)
on conflict (id) do nothing;

insert into public.heritage_update_agents (
  heritage_update_id, agent_entity_id, role_name, discipline, notes
) values
(
  '3b000000-0000-0000-0000-000000000001',
  '3a000000-0000-0000-0000-000000000001',
  'Restaurador atribuido',
  'Restauración',
  'La web oficial atribuye esta intervención con toda probabilidad a Gabriel de Astorga.'
),
(
  '3b000000-0000-0000-0000-000000000003',
  '3a000000-0000-0000-0000-000000000002',
  'Restaurador',
  'Restauración',
  null
),
(
  '3b000000-0000-0000-0000-000000000004',
  '3a000000-0000-0000-0000-000000000003',
  'Restaurador',
  'Restauración',
  null
),
(
  '3b000000-0000-0000-0000-000000000005',
  '3a000000-0000-0000-0000-000000000004',
  'Restaurador',
  'Restauración',
  null
)
on conflict (heritage_update_id, agent_entity_id, role_name) do nothing;

-- -----------------------------------------------------------------------------
-- Autores y talleres vinculados al paso procesional
-- -----------------------------------------------------------------------------

insert into public.entities (id, entity_type, name, slug, summary, status) values
(
  '3a000000-0000-0000-0000-000000000005',
  'agent',
  'José Rodríguez Gil',
  'jose-rodriguez-gil-currito-el-dorador',
  'Artífice, conocido como Currito el dorador, de los seis candelabros del primitivo paso de la Asunción de Cantillana.',
  'published'
),
(
  '3a000000-0000-0000-0000-000000000006',
  'agent',
  'Cayetano González',
  'cayetano-gonzalez',
  'Artista que restauró y enriqueció el primitivo paso procesional de la Asunción de Cantillana en 1935.',
  'published'
),
(
  '3a000000-0000-0000-0000-000000000007',
  'agent',
  'José Rivero Carrera',
  'jose-rivero-carrera-paso-asuncion-cantillana',
  'Autor del sepulcro realizado en 1940 para el paso procesional de la Asunción de Cantillana.',
  'published'
),
(
  '3a000000-0000-0000-0000-000000000008',
  'agent',
  'Taller de Guzmán Bejarano',
  'taller-de-guzman-bejarano',
  'Taller responsable de los respiraderos realizados en 1958 para adaptar el paso a su nuevo sistema de costaleros.',
  'published'
),
(
  '3a000000-0000-0000-0000-000000000009',
  'agent',
  'Taller de Jiménez',
  'taller-de-jimenez-orfebreria-paso-asuncion-cantillana',
  'Taller responsable de la labor de orfebrería de los respiraderos incorporados al paso en 1958.',
  'published'
)
on conflict (id) do nothing;

insert into public.agents (
  entity_id, agent_kind, description, active_notes
) values
(
  '3a000000-0000-0000-0000-000000000005',
  'person',
  'Autor de elementos del primitivo paso procesional.',
  'La fuente oficial recoge el alias Currito el dorador.'
),
(
  '3a000000-0000-0000-0000-000000000006',
  'person',
  'Artista vinculado a la restauración y enriquecimiento del paso procesional.',
  null
),
(
  '3a000000-0000-0000-0000-000000000007',
  'person',
  'Autor del sepulcro incorporado al paso procesional en 1940.',
  'La fuente oficial utiliza la forma José Rivero Carrera. No se unifica con otros nombres similares sin evidencia documental.'
),
(
  '3a000000-0000-0000-0000-000000000008',
  'workshop',
  'Taller vinculado a la ejecución de los respiraderos del paso en 1958.',
  null
),
(
  '3a000000-0000-0000-0000-000000000009',
  'workshop',
  'Taller de orfebrería vinculado a los respiraderos del paso en 1958.',
  'La fuente oficial lo identifica únicamente como taller de Jiménez.'
)
on conflict (entity_id) do nothing;

insert into public.agent_names (
  id, agent_entity_id, name, name_type, is_current, notes
) values (
  '3a100000-0000-0000-0000-000000000001',
  '3a000000-0000-0000-0000-000000000005',
  'Currito el dorador',
  'alias',
  false,
  'Alias recogido por la web oficial de la Hermandad.'
)
on conflict (id) do nothing;

insert into public.agent_disciplines (
  agent_entity_id, discipline, is_primary, notes
) values
('3a000000-0000-0000-0000-000000000005','Talla',true,'Autor de seis candelabros tallados.'),
('3a000000-0000-0000-0000-000000000005','Dorado',false,'La fuente recoge el alias Currito el dorador.'),
('3a000000-0000-0000-0000-000000000006','Restauración',true,'Restauración y enriquecimiento del paso en 1935.'),
('3a000000-0000-0000-0000-000000000007','Talla',true,'Ejecución del sepulcro del paso.'),
('3a000000-0000-0000-0000-000000000008','Talla',true,'Respiraderos del paso.'),
('3a000000-0000-0000-0000-000000000009','Orfebrería',true,'Labor de orfebrería de los respiraderos.')
on conflict (agent_entity_id, discipline) do nothing;

-- -----------------------------------------------------------------------------
-- Paso procesional: datos generales y fases históricas
-- -----------------------------------------------------------------------------

update public.steps
set
  materials = 'Talla dorada, orfebrería, marfil y terciopelo de Lyon',
  carrier_system = 'Costaleros desde 1958',
  execution_date_text = 'Configuración histórica entre 1883 y 2009',
  current_state_notes = 'El aspecto actual procede de la restauración de 2007-2009: los antiguos respiraderos se adaptaron como canastilla y se realizaron nuevos respiraderos inspirados en los anteriores.',
  description = 'Paso procesional configurado a través de sucesivas fases desde 1883. Destaca el sepulcro realizado en 1940 e inspirado en la urna de San Fernando, la talla y orfebrería de los respiraderos y la decoración actual con querubines, bustos de marfil y faldones de terciopelo azul pavo.'
where entity_id = '34000000-0000-0000-0000-000000000001';

insert into public.step_phases (
  id,
  step_entity_id,
  phase_name,
  phase_type,
  date_from_text,
  date_to_text,
  description,
  notes,
  status
) values
(
  '3c000000-0000-0000-0000-000000000001',
  '34000000-0000-0000-0000-000000000001',
  'Configuración inicial del paso',
  'Ejecución',
  'Desde 1883',
  null,
  'La construcción comenzó a gestarse en 1883 a partir de unas andas sencillas y de reducido tamaño, con respiraderos dorados de roleos de acanto y seis candelabros tallados por José Rodríguez Gil, Currito el dorador.',
  'La fuente no precisa una fecha de terminación del primer conjunto.',
  'published'
),
(
  '3c000000-0000-0000-0000-000000000002',
  '34000000-0000-0000-0000-000000000001',
  'Restauración y enriquecimiento del primitivo paso',
  'Restauración',
  '1935',
  null,
  'Cayetano González restauró y enriqueció el primitivo paso, que mantuvo sus líneas generales hasta 1940.',
  null,
  'published'
),
(
  '3c000000-0000-0000-0000-000000000003',
  '34000000-0000-0000-0000-000000000001',
  'Ejecución del sepulcro',
  'Ejecución',
  '1940',
  null,
  'José Rivero Carrera realizó el sepulcro sobre el que asciende la imagen, inspirado en la urna de San Fernando.',
  null,
  'published'
),
(
  '3c000000-0000-0000-0000-000000000004',
  '34000000-0000-0000-0000-000000000001',
  'Adaptación para costaleros y nuevos respiraderos',
  'Transformación',
  '1958',
  null,
  'La incorporación de costaleros hizo necesarios nuevos respiraderos, ejecutados en el taller de Guzmán Bejarano con distintos materiales y una importante labor de orfebrería del taller de Jiménez.',
  null,
  'published'
),
(
  '3c000000-0000-0000-0000-000000000005',
  '34000000-0000-0000-0000-000000000001',
  'Última gran restauración y configuración actual',
  'Restauración',
  '2007',
  '2009',
  'Los antiguos respiraderos se adaptaron a canastilla y se hicieron nuevos respiraderos siguiendo el modelo anterior. El conjunto se enriqueció con doce querubines y bustos de marfil de los apóstoles, San José y la Virgen de la Soledad. También se renovaron los faldones en terciopelo de Lyon azul pavo; el delantero incorpora una cenefa en tisú de plata y oro y una cartela de seda con Pentecostés.',
  'La fuente oficial no identifica en esta página a los responsables de la intervención.',
  'published'
)
on conflict (id) do nothing;

insert into public.step_phase_agents (
  step_phase_id,
  agent_entity_id,
  discipline,
  role_name,
  notes
) values
(
  '3c000000-0000-0000-0000-000000000001',
  '3a000000-0000-0000-0000-000000000005',
  'Talla',
  'Autor de los seis candelabros',
  'Citado por la fuente como José Rodríguez Gil, Currito el dorador.'
),
(
  '3c000000-0000-0000-0000-000000000002',
  '3a000000-0000-0000-0000-000000000006',
  'Restauración',
  'Restaurador y autor del enriquecimiento',
  null
),
(
  '3c000000-0000-0000-0000-000000000003',
  '3a000000-0000-0000-0000-000000000007',
  'Talla',
  'Autor del sepulcro',
  null
),
(
  '3c000000-0000-0000-0000-000000000004',
  '3a000000-0000-0000-0000-000000000008',
  'Talla',
  'Taller de los respiraderos',
  null
),
(
  '3c000000-0000-0000-0000-000000000004',
  '3a000000-0000-0000-0000-000000000009',
  'Orfebrería',
  'Taller de la labor de orfebrería',
  null
)
on conflict (step_phase_id, agent_entity_id, discipline, element_entity_id) do nothing;

-- -----------------------------------------------------------------------------
-- Enlaces a las fuentes oficiales ya cargadas en la migración 013
-- -----------------------------------------------------------------------------

insert into public.source_links (
  source_id, heritage_update_id, scope
) values
(
  '36000000-0000-0000-0000-000000000004',
  '3b000000-0000-0000-0000-000000000001',
  'Restauración previa a la llegada a Cantillana, atribuida a Gabriel de Astorga'
),
(
  '36000000-0000-0000-0000-000000000004',
  '3b000000-0000-0000-0000-000000000002',
  'Restauración durante la Guerra Civil, entre 1936 y 1937'
),
(
  '36000000-0000-0000-0000-000000000004',
  '3b000000-0000-0000-0000-000000000003',
  'Restauración de comienzos de la década de 1940'
),
(
  '36000000-0000-0000-0000-000000000004',
  '3b000000-0000-0000-0000-000000000004',
  'Restauración de 1999'
),
(
  '36000000-0000-0000-0000-000000000004',
  '3b000000-0000-0000-0000-000000000005',
  'Restauración de 2015'
)
on conflict do nothing;

insert into public.source_links (
  source_id, step_phase_id, scope
) values
(
  '36000000-0000-0000-0000-000000000005',
  '3c000000-0000-0000-0000-000000000001',
  'Configuración inicial desde 1883 y candelabros de José Rodríguez Gil'
),
(
  '36000000-0000-0000-0000-000000000005',
  '3c000000-0000-0000-0000-000000000002',
  'Restauración y enriquecimiento de Cayetano González en 1935'
),
(
  '36000000-0000-0000-0000-000000000005',
  '3c000000-0000-0000-0000-000000000003',
  'Sepulcro de José Rivero Carrera en 1940'
),
(
  '36000000-0000-0000-0000-000000000005',
  '3c000000-0000-0000-0000-000000000004',
  'Adaptación para costaleros y respiraderos de 1958'
),
(
  '36000000-0000-0000-0000-000000000005',
  '3c000000-0000-0000-0000-000000000005',
  'Restauración de 2007-2009 y configuración actual'
)
on conflict do nothing;

insert into public.source_links (
  source_id, agent_name_id, scope
) values (
  '36000000-0000-0000-0000-000000000005',
  '3a100000-0000-0000-0000-000000000001',
  'Alias Currito el dorador'
)
on conflict do nothing;
