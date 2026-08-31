-- Hilo Cofrade · Simpecados históricos de la Asunción de Cantillana
-- Migración 018
--
-- Completa el catálogo iniciado en la migración 017 con el Simpecado
-- Fundacional, el Simpecado de Gran Gala y el Simpecado Rojo. El orden de
-- presentación sigue la antigüedad documentada de las cuatro piezas.

-- -----------------------------------------------------------------------------
-- Piezas patrimoniales
-- -----------------------------------------------------------------------------

insert into public.entities (id, entity_type, name, slug, summary, status) values
(
  '3d000000-0000-0000-0000-000000000002',
  'heritage_asset',
  'Simpecado Fundacional',
  'simpecado-fundacional-asuncion-cantillana',
  'Simpecado de 1804 ofrecido como acción de gracias tras la epidemia de peste amarilla de 1800 y bendecido en mayo de 1805.',
  'published'
),
(
  '3d000000-0000-0000-0000-000000000003',
  'heritage_asset',
  'Simpecado de Gran Gala',
  'simpecado-de-gran-gala-asuncion-cantillana',
  'Obra neoclásica de las primeras décadas del siglo XIX, ejecutada por el taller de las Hermanas Zuloaga.',
  'published'
),
(
  '3d000000-0000-0000-0000-000000000004',
  'heritage_asset',
  'Simpecado Rojo',
  'simpecado-rojo-asuncion-cantillana',
  'Simpecado estrenado en 1957 para la Subida y el Rosario conmemorativo del Dogma de la Asunción.',
  'published'
)
on conflict (id) do update set
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.heritage_assets (
  entity_id,
  parent_entity_id,
  asset_type,
  description,
  technique,
  materials,
  iconography,
  historical_context,
  provenance_text,
  blessing_date,
  blessing_date_text,
  date_from,
  date_from_text,
  is_current,
  origin_notes,
  display_order,
  is_featured,
  notes
) values
(
  '3d000000-0000-0000-0000-000000000002',
  '30000000-0000-0000-0000-000000000002',
  'Simpecado',
  'El Simpecado Fundacional fue encargado y costeado por doña María de Cozar y otras damas de Cantillana como acción de gracias por la protección atribuida a la Virgen de la Asunción durante la epidemia de peste amarilla de 1800. Fue bendecido en mayo de 1805, antes del primer cabildo de elecciones del Rosario asuncionista.',
  'Obra textil con pintura central',
  'Terciopelo carmesí · asta de plata · cruz de metal',
  'De estética tardorrococó y perfil muy recortado, presenta amplias aletas superiores y un airoso penacho central. La pintura coetánea y anónima representa la Gloriosa Asunción sobre un trono de querubines, acompañada por dos ángeles mancebos.',
  'La obra nació en el contexto fundacional del Rosario asuncionista y como memoria devocional de la epidemia de 1800.',
  'Encargado y costeado por doña María de Cozar y otras damas de la villa.',
  null,
  'Mayo de 1805',
  '1804-01-01',
  '1804',
  true,
  'Procesiona anualmente el 1 de noviembre. Fue restaurado y pasado a nuevo terciopelo en 2010 en el Taller de Bordados de las Hnas. Ramas de Brenes.',
  10,
  true,
  'La pintura central es de autor desconocido.'
),
(
  '3d000000-0000-0000-0000-000000000003',
  '30000000-0000-0000-0000-000000000002',
  'Simpecado',
  'El Simpecado de Gran Gala es una obra de las primeras décadas del siglo XIX. Un escrito hallado en su interior durante la restauración de 2011 permitió documentar su ejecución por el taller de las Hermanas Zuloaga, maestras de bordado y conservadoras de la Catedral de Sevilla.',
  'Bordado en oro sobre tisú de plata',
  'Oro · tisú de plata blanco · flores de talco · asta de plata · cruz dorada',
  'De estilo neoclásico, desarrolla grandes roleos laterales, cuernos de la abundancia, tallos vegetales simétricos y numerosas flores de talco. El óvalo central contiene una pintura anónima de sabor italianizante, posiblemente inspirada en el medallón superior del retablo mayor parroquial.',
  'Su color blanco responde a la solemnidad litúrgica de la Asunción. La autoría quedó acreditada por el documento localizado durante la restauración de 2011.',
  'Obra del taller de las Hermanas Zuloaga.',
  null,
  null,
  null,
  'Primeras décadas del siglo XIX',
  true,
  'Procesiona en los rosarios de mujeres de la víspera del 15 de agosto y de la última noche de Novena, además de en las salidas extraordinarias de la Asunción Gloriosa.',
  20,
  false,
  'La pintura del óvalo central es anónima. La fuente oficial documenta una restauración en 2011, sin identificar en esta ficha a su responsable.'
),
(
  '3d000000-0000-0000-0000-000000000004',
  '30000000-0000-0000-0000-000000000002',
  'Simpecado',
  'Estrenado en 1957, fue concebido para procesionar en la carreta de plata el día de la Subida y presidir el Santo Rosario del 1 de noviembre, conmemorativo de la proclamación del Dogma de la Asunción.',
  'Confección textil con pintura central',
  'Terciopelo granate · piezas procedentes de las ropas de salida de la Virgen Asunta venerada en San Bartolomé',
  'Presenta motivos asimétricos de tallos, flores y grandes hojas que cubren el tejido alrededor del medallón central. La pintura del óvalo, obra de Juan Antonio Rodríguez, está inspirada en la efigie de la Titular del templo parroquial.',
  'La pieza quedó vinculada desde su estreno a dos hitos del calendario asuncionista: la Subida y la conmemoración del Dogma.',
  'Confeccionado con piezas de las ropas de salida de la Virgen Asunta de San Bartolomé, atribuidas por su estilo a las Hermanas Antúnez de Sevilla.',
  null,
  null,
  '1957-01-01',
  '1957',
  true,
  'Creado para la carreta de plata en la Subida y para el Santo Rosario del 1 de noviembre.',
  30,
  false,
  'La relación con las Hermanas Antúnez se conserva como atribución estilística, no como autoría documental cerrada.'
)
on conflict (entity_id) do update set
  parent_entity_id = excluded.parent_entity_id,
  asset_type = excluded.asset_type,
  description = excluded.description,
  technique = excluded.technique,
  materials = excluded.materials,
  iconography = excluded.iconography,
  historical_context = excluded.historical_context,
  provenance_text = excluded.provenance_text,
  blessing_date = excluded.blessing_date,
  blessing_date_text = excluded.blessing_date_text,
  date_from = excluded.date_from,
  date_from_text = excluded.date_from_text,
  is_current = excluded.is_current,
  origin_notes = excluded.origin_notes,
  display_order = excluded.display_order,
  is_featured = excluded.is_featured,
  notes = excluded.notes;

-- El Simpecado de los Devotos, creado en la migración 017, cierra la serie.
update public.heritage_assets
set display_order = 40
where entity_id = '3d000000-0000-0000-0000-000000000001';

-- -----------------------------------------------------------------------------
-- Talleres, autores y restauradores
-- -----------------------------------------------------------------------------

insert into public.entities (id, entity_type, name, slug, summary, status) values
(
  '3a000000-0000-0000-0000-000000000012',
  'agent',
  'Hermanas Zuloaga',
  'hermanas-zuloaga',
  'Taller al que se atribuye documentalmente la hechura del Simpecado de Gran Gala de la Asunción de Cantillana.',
  'published'
),
(
  '3a000000-0000-0000-0000-000000000013',
  'agent',
  'Hermanas Antúnez',
  'hermanas-antunez',
  'Taller sevillano al que se atribuyen por su estilo las piezas textiles reutilizadas en el Simpecado Rojo.',
  'published'
),
(
  '3a000000-0000-0000-0000-000000000014',
  'agent',
  'Juan Antonio Rodríguez',
  'juan-antonio-rodriguez-pintor-simpecado-rojo',
  'Autor de la pintura del óvalo central del Simpecado Rojo de la Asunción de Cantillana.',
  'published'
),
(
  '3a000000-0000-0000-0000-000000000015',
  'agent',
  'Taller de Bordados de las Hnas. Ramas de Brenes',
  'taller-bordados-hermanas-ramas-brenes',
  'Taller responsable de la restauración y el pasado a nuevo terciopelo del Simpecado Fundacional en 2010.',
  'published'
)
on conflict (id) do update set
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.agents (entity_id, agent_kind, description) values
(
  '3a000000-0000-0000-0000-000000000012',
  'workshop',
  'Taller histórico de bordado documentado en la autoría del Simpecado de Gran Gala.'
),
(
  '3a000000-0000-0000-0000-000000000013',
  'workshop',
  'Taller histórico de bordado relacionado mediante atribución estilística con las piezas del Simpecado Rojo.'
),
(
  '3a000000-0000-0000-0000-000000000014',
  'person',
  'Pintor documentado por la ejecución del óvalo central del Simpecado Rojo.'
),
(
  '3a000000-0000-0000-0000-000000000015',
  'workshop',
  'Taller de bordados de Brenes documentado por la restauración del Simpecado Fundacional.'
)
on conflict (entity_id) do update set
  agent_kind = excluded.agent_kind,
  description = excluded.description;

insert into public.agent_disciplines (agent_entity_id, discipline, is_primary, notes) values
('3a000000-0000-0000-0000-000000000012','Bordado',true,'Hechura del Simpecado de Gran Gala.'),
('3a000000-0000-0000-0000-000000000012','Conservación textil',false,'La fuente oficial las identifica como maestras de bordado y conservadoras de la Catedral de Sevilla.'),
('3a000000-0000-0000-0000-000000000013','Bordado',true,'Atribución estilística de las piezas textiles reutilizadas en el Simpecado Rojo.'),
('3a000000-0000-0000-0000-000000000014','Pintura',true,'Óvalo central del Simpecado Rojo.'),
('3a000000-0000-0000-0000-000000000015','Restauración textil',true,'Restauración del Simpecado Fundacional en 2010.'),
('3a000000-0000-0000-0000-000000000015','Bordado',false,null)
on conflict (agent_entity_id, discipline) do update set
  is_primary = excluded.is_primary,
  notes = excluded.notes;

insert into public.heritage_interventions (
  id,
  target_entity_id,
  agent_entity_id,
  discipline,
  element_name,
  intervention_type,
  phase,
  date_from,
  date_from_text,
  description,
  status
) values
(
  '3e000000-0000-0000-0000-000000000003',
  '3d000000-0000-0000-0000-000000000002',
  '3a000000-0000-0000-0000-000000000015',
  'Restauración textil',
  'Simpecado Fundacional',
  'Restauración',
  'Restauración y pasado a nuevo terciopelo',
  '2010-01-01',
  '2010',
  'Restauración de la pieza y pasado de los bordados a un nuevo soporte de terciopelo.',
  'published'
),
(
  '3e000000-0000-0000-0000-000000000004',
  '3d000000-0000-0000-0000-000000000003',
  '3a000000-0000-0000-0000-000000000012',
  'Bordado',
  'Simpecado de Gran Gala',
  'Creación',
  'Hechura',
  null,
  'Primeras décadas del siglo XIX',
  'Ejecución del bordado en oro sobre tisú de plata blanco.',
  'published'
),
(
  '3e000000-0000-0000-0000-000000000005',
  '3d000000-0000-0000-0000-000000000004',
  '3a000000-0000-0000-0000-000000000013',
  'Bordado',
  'Piezas textiles del Simpecado Rojo',
  'Atribución',
  'Piezas textiles reutilizadas',
  null,
  'Anterior a 1957',
  'Las piezas procedentes de las ropas de salida de la Virgen Asunta de San Bartolomé se atribuyen por su estilo al taller de las Hermanas Antúnez.',
  'published'
),
(
  '3e000000-0000-0000-0000-000000000006',
  '3d000000-0000-0000-0000-000000000004',
  '3a000000-0000-0000-0000-000000000014',
  'Pintura',
  'Óvalo central del Simpecado Rojo',
  'Creación',
  'Pintura del medallón',
  '1957-01-01',
  '1957',
  'Pintura inspirada en la efigie de Nuestra Señora de la Asunción venerada en el templo parroquial.',
  'published'
)
on conflict (id) do update set
  target_entity_id = excluded.target_entity_id,
  agent_entity_id = excluded.agent_entity_id,
  discipline = excluded.discipline,
  element_name = excluded.element_name,
  intervention_type = excluded.intervention_type,
  phase = excluded.phase,
  date_from = excluded.date_from,
  date_from_text = excluded.date_from_text,
  description = excluded.description,
  status = excluded.status;

-- -----------------------------------------------------------------------------
-- Restauraciones documentadas
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
  '3b000000-0000-0000-0000-000000000007',
  '30000000-0000-0000-0000-000000000002',
  'restauracion',
  'Restauración del Simpecado Fundacional',
  2010,
  '3d000000-0000-0000-0000-000000000002',
  'Simpecado Fundacional',
  'Restauración textil',
  'La pieza fue restaurada y pasada a nuevo terciopelo en el Taller de Bordados de las Hnas. Ramas de Brenes.',
  'published'
),
(
  '3b000000-0000-0000-0000-000000000008',
  '30000000-0000-0000-0000-000000000002',
  'restauracion',
  'Restauración del Simpecado de Gran Gala',
  2011,
  '3d000000-0000-0000-0000-000000000003',
  'Simpecado de Gran Gala',
  'Restauración textil',
  'Durante esta intervención se encontró en el interior el escrito que permitió documentar la autoría del taller de las Hermanas Zuloaga.',
  'published'
)
on conflict (id) do update set
  title = excluded.title,
  year = excluded.year,
  target_entity_id = excluded.target_entity_id,
  element_name = excluded.element_name,
  discipline = excluded.discipline,
  description = excluded.description,
  status = excluded.status;

insert into public.heritage_update_agents (
  heritage_update_id, agent_entity_id, role_name, discipline, notes
) values (
  '3b000000-0000-0000-0000-000000000007',
  '3a000000-0000-0000-0000-000000000015',
  'Restauración y pasado a nuevo terciopelo',
  'Restauración textil',
  null
)
on conflict (heritage_update_id, agent_entity_id, role_name) do update set
  discipline = excluded.discipline,
  notes = excluded.notes;

-- -----------------------------------------------------------------------------
-- Fuentes oficiales
-- -----------------------------------------------------------------------------

insert into public.sources (
  id, name, url, source_type, author_or_publisher, accessed_at
) values
(
  '36000000-0000-0000-0000-000000000012',
  'Simpecado Fundacional',
  'https://www.asunciondecantillana.es/patrimonio/simpecados/simpecado-fundacional',
  'Web oficial',
  'Hermandad de la Asunción de Cantillana',
  '2026-08-13'
),
(
  '36000000-0000-0000-0000-000000000013',
  'Simpecado de Gran Gala',
  'https://www.asunciondecantillana.es/patrimonio/simpecados/simpecado-de-gran-gala',
  'Web oficial',
  'Hermandad de la Asunción de Cantillana',
  '2026-08-13'
),
(
  '36000000-0000-0000-0000-000000000014',
  'Simpecado Rojo',
  'https://www.asunciondecantillana.es/patrimonio/simpecados/simpecado-rojo',
  'Web oficial',
  'Hermandad de la Asunción de Cantillana',
  '2026-08-13'
)
on conflict (id) do update set
  name = excluded.name,
  url = excluded.url,
  source_type = excluded.source_type,
  author_or_publisher = excluded.author_or_publisher,
  accessed_at = excluded.accessed_at;

insert into public.source_links (source_id, entity_id, scope) values
(
  '36000000-0000-0000-0000-000000000012',
  '3d000000-0000-0000-0000-000000000002',
  'Datación, origen, bendición, descripción formal, uso procesional y restauración del Simpecado Fundacional'
),
(
  '36000000-0000-0000-0000-000000000013',
  '3d000000-0000-0000-0000-000000000003',
  'Datación, autoría, técnica, materiales, descripción formal, uso procesional y restauración del Simpecado de Gran Gala'
),
(
  '36000000-0000-0000-0000-000000000014',
  '3d000000-0000-0000-0000-000000000004',
  'Estreno, finalidad, procedencia textil, atribución, descripción formal y pintura del Simpecado Rojo'
);

insert into public.source_links (source_id, intervention_id, scope) values
(
  '36000000-0000-0000-0000-000000000012',
  '3e000000-0000-0000-0000-000000000003',
  'Restauración y pasado a nuevo terciopelo en 2010'
),
(
  '36000000-0000-0000-0000-000000000013',
  '3e000000-0000-0000-0000-000000000004',
  'Hechura del Simpecado por el taller de las Hermanas Zuloaga'
),
(
  '36000000-0000-0000-0000-000000000014',
  '3e000000-0000-0000-0000-000000000005',
  'Atribución estilística de las piezas textiles a las Hermanas Antúnez'
),
(
  '36000000-0000-0000-0000-000000000014',
  '3e000000-0000-0000-0000-000000000006',
  'Autoría de Juan Antonio Rodríguez en la pintura del óvalo central'
);

insert into public.source_links (source_id, heritage_update_id, scope) values
(
  '36000000-0000-0000-0000-000000000012',
  '3b000000-0000-0000-0000-000000000007',
  'Restauración del Simpecado Fundacional en 2010'
),
(
  '36000000-0000-0000-0000-000000000013',
  '3b000000-0000-0000-0000-000000000008',
  'Restauración del Simpecado de Gran Gala en 2011 y hallazgo documental'
);
