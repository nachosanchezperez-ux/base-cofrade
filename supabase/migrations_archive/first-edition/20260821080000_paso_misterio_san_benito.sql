-- Hilo Cofrade · Paso de misterio de la Sagrada Presentación · San Benito
--
-- Completa la entidad canónica que ya existe en producción. La migración
-- documenta la configuración material del paso, sus principales fases y los
-- agentes citados por la web oficial de la Hermandad, sin duplicar el paso,
-- la imagen titular ni el acompañamiento musical previamente relacionados.

begin;

-- -----------------------------------------------------------------------------
-- 1. Ficha técnica del paso canónico
-- -----------------------------------------------------------------------------

do $$
begin
  if not exists (
    select 1
    from public.entities
    where id = '2c49d077-e377-492d-8e30-25fa823bdcd8'::uuid
      and entity_type = 'step'
  ) then
    raise exception 'No existe el paso canónico de la Sagrada Presentación de San Benito';
  end if;
end
$$;

update public.entities
set
  name = 'Paso de misterio de la Sagrada Presentación de Jesús al Pueblo',
  summary = 'Paso de estilo barroco rocalla diseñado y tallado por Antonio Martín Fernández entre 1967 y 1968. Se ilumina con seis candelabros de guardabrisas y reúne cartelas pasionistas, bustos de los Evangelistas y veinticuatro querubines de Francisco Buiza.',
  status = 'published',
  updated_at = now()
where id = '2c49d077-e377-492d-8e30-25fa823bdcd8'::uuid
  and entity_type = 'step';

update public.steps
set
  step_type = 'Misterio',
  current_condition = 'preserved',
  style = 'Barroco rocalla',
  materials = 'Madera de pino de Flandes tallada y dorada, madera policromada, metal plateado y terciopelo morado',
  carrier_system = 'Costaleros',
  execution_date_text = '1967–1968 · configuración completada y renovada entre 1969 y 2020',
  description = 'Paso de estilo barroco rocalla diseñado y tallado por Antonio Martín Fernández entre 1967 y 1968. La canastilla incorpora ocho cartelas con símbolos pasionistas, cuatro tondos con los Evangelistas y veinticuatro querubines. Los respiraderos muestran escenas de la vida de Jesús y un apostolado en miniatura.',
  current_state_notes = 'La parihuela actual fue realizada por Carpintería Melo en 2018. El dorado vigente corresponde a la intervención de Manolo y Antonio Doradores desarrollada entre 2018 y 2020.',
  notes = 'El conjunto se ilumina mediante seis candelabros de guardabrisas.'
where entity_id = '2c49d077-e377-492d-8e30-25fa823bdcd8'::uuid;

-- -----------------------------------------------------------------------------
-- 2. Agentes y talleres documentados por la fuente oficial
-- -----------------------------------------------------------------------------

with agent_seed(name, slug, agent_kind, summary, discipline) as (
  values
    ('Antonio Martín Fernández', 'antonio-martin-fernandez', 'person', 'Diseñador y tallista del paso de misterio de la Sagrada Presentación de Jesús al Pueblo de San Benito.', 'Talla'),
    ('Francisco Bailac', 'francisco-bailac', 'person', 'Ebanista responsable de la estructura original del paso de misterio de la Sagrada Presentación de San Benito.', 'Carpintería'),
    ('Taller de Herrera y Feria', 'taller-herrera-y-feria', 'workshop', 'Taller responsable del dorado original del paso de misterio de la Sagrada Presentación de San Benito.', 'Dorado'),
    ('Carpintería Melo', 'carpinteria-melo', 'workshop', 'Taller autor de la parihuela actual del paso de misterio de la Sagrada Presentación de San Benito.', 'Carpintería'),
    ('Manolo y Antonio Doradores', 'manolo-y-antonio-doradores', 'workshop', 'Taller responsable del dorado actual del paso de misterio de la Sagrada Presentación de San Benito.', 'Dorado'),
    ('Juan Antonio Blanco', 'juan-antonio-blanco', 'person', 'Escultor del apostolado en miniatura de los respiraderos del paso de misterio de San Benito.', 'Escultura'),
    ('María del Carmen Gómez Tocón', 'maria-del-carmen-gomez-tocon', 'person', 'Autora de los faldones actuales del paso de misterio de San Benito.', 'Confección'),
    ('Piedad Muñoz', 'piedad-munoz', 'person', 'Bordadora de los broches incorporados a los faldones del paso de misterio de San Benito.', 'Bordado'),
    ('José Luis Asián Cano', 'jose-luis-asian-cano', 'person', 'Diseñador de los broches de los faldones del paso de misterio de San Benito.', 'Diseño'),
    ('Juan Sánchez Vela', 'juan-sanchez-vela', 'person', 'Coautor del llamador del paso de misterio de la Sagrada Presentación de San Benito.', 'Orfebrería'),
    ('Antonio Herranz', 'antonio-herranz', 'person', 'Coautor del llamador del paso de misterio de la Sagrada Presentación de San Benito.', 'Orfebrería'),
    ('José Sanjuán Navarro', 'jose-sanjuan-navarro', 'person', 'Autor de la loba capitolina que remata el trono de Pilato del misterio de San Benito.', 'Escultura'),
    ('Orfebrería Villarreal', 'orfebreria-villarreal', 'workshop', 'Taller autor del senatus del soldado romano del misterio de San Benito.', 'Orfebrería')
)
insert into public.entities (
  id, entity_type, name, slug, summary, status
)
select
  gen_random_uuid(),
  'agent',
  seed.name,
  seed.slug,
  seed.summary,
  'published'
from agent_seed seed
where not exists (
  select 1
  from public.entities existing
  where existing.slug = seed.slug
);

-- Los tres agentes ya presentes en el grafo también quedan disponibles para
-- que sus responsabilidades se muestren en la cronología del paso.
update public.entities
set status = 'published', updated_at = now()
where entity_type = 'agent'
  and slug in (
    'antonio-castillo-lastrucci',
    'francisco-buiza',
    'manuel-de-los-rios'
  );

with agent_seed(slug, agent_kind, description) as (
  values
    ('antonio-martin-fernandez', 'person', 'Diseñador y tallista del paso de misterio de la Sagrada Presentación de Jesús al Pueblo de San Benito.'),
    ('francisco-bailac', 'person', 'Ebanista responsable de la estructura original del paso de misterio de la Sagrada Presentación de San Benito.'),
    ('taller-herrera-y-feria', 'workshop', 'Taller responsable del dorado original del paso de misterio de la Sagrada Presentación de San Benito.'),
    ('carpinteria-melo', 'workshop', 'Taller autor de la parihuela actual del paso de misterio de la Sagrada Presentación de San Benito.'),
    ('manolo-y-antonio-doradores', 'workshop', 'Taller responsable del dorado actual del paso de misterio de la Sagrada Presentación de San Benito.'),
    ('juan-antonio-blanco', 'person', 'Escultor del apostolado en miniatura de los respiraderos del paso de misterio de San Benito.'),
    ('maria-del-carmen-gomez-tocon', 'person', 'Autora de los faldones actuales del paso de misterio de San Benito.'),
    ('piedad-munoz', 'person', 'Bordadora de los broches incorporados a los faldones del paso de misterio de San Benito.'),
    ('jose-luis-asian-cano', 'person', 'Diseñador de los broches de los faldones del paso de misterio de San Benito.'),
    ('juan-sanchez-vela', 'person', 'Coautor del llamador del paso de misterio de la Sagrada Presentación de San Benito.'),
    ('antonio-herranz', 'person', 'Coautor del llamador del paso de misterio de la Sagrada Presentación de San Benito.'),
    ('jose-sanjuan-navarro', 'person', 'Autor de la loba capitolina que remata el trono de Pilato del misterio de San Benito.'),
    ('orfebreria-villarreal', 'workshop', 'Taller autor del senatus del soldado romano del misterio de San Benito.')
)
insert into public.agents (
  entity_id, agent_kind, description
)
select
  entity.id,
  seed.agent_kind,
  seed.description
from agent_seed seed
join public.entities entity
  on entity.slug = seed.slug
 and entity.entity_type = 'agent'
on conflict (entity_id) do update
set description = coalesce(nullif(public.agents.description, ''), excluded.description);

with discipline_seed(slug, discipline, is_primary, notes) as (
  values
    ('antonio-martin-fernandez', 'Talla', true, 'Diseño y talla del paso de misterio de la Sagrada Presentación.'),
    ('antonio-martin-fernandez', 'Diseño', false, 'Diseño del paso de misterio de la Sagrada Presentación.'),
    ('francisco-bailac', 'Carpintería', true, 'Ebanistería del paso de misterio de la Sagrada Presentación.'),
    ('taller-herrera-y-feria', 'Dorado', true, 'Dorado original del paso de misterio de la Sagrada Presentación.'),
    ('carpinteria-melo', 'Carpintería', true, 'Parihuela actual del paso de misterio de la Sagrada Presentación.'),
    ('manolo-y-antonio-doradores', 'Dorado', true, 'Dorado actual del paso de misterio de la Sagrada Presentación.'),
    ('francisco-buiza', 'Escultura', true, 'Cartelas, tondos y querubines del paso de misterio de la Sagrada Presentación.'),
    ('juan-antonio-blanco', 'Escultura', true, 'Apostolado en miniatura de los respiraderos.'),
    ('maria-del-carmen-gomez-tocon', 'Confección', true, 'Ejecución de los faldones actuales.'),
    ('piedad-munoz', 'Bordado', true, 'Bordado de los broches de los faldones.'),
    ('jose-luis-asian-cano', 'Diseño', true, 'Diseño de los broches de los faldones.'),
    ('juan-sanchez-vela', 'Orfebrería', true, 'Llamador del paso de misterio de la Sagrada Presentación.'),
    ('antonio-herranz', 'Orfebrería', true, 'Llamador del paso de misterio de la Sagrada Presentación.'),
    ('jose-sanjuan-navarro', 'Escultura', true, 'Loba capitolina del trono de Pilato.'),
    ('antonio-castillo-lastrucci', 'Escultura', true, 'Sillón de Pilato incorporado al misterio.'),
    ('orfebreria-villarreal', 'Orfebrería', true, 'Senatus del soldado romano.'),
    ('manuel-de-los-rios', 'Orfebrería', true, 'Trompeta del centurión y espada del soldado romano.')
)
insert into public.agent_disciplines (
  agent_entity_id, discipline, is_primary, notes
)
select
  entity.id,
  seed.discipline,
  seed.is_primary,
  seed.notes
from discipline_seed seed
join public.entities entity
  on entity.slug = seed.slug
 and entity.entity_type = 'agent'
on conflict (agent_entity_id, discipline) do nothing;

-- -----------------------------------------------------------------------------
-- 3. Fases patrimoniales
-- -----------------------------------------------------------------------------

with phase_seed(
  phase_name, phase_type, date_from_text, date_to_text, description, notes
) as (
  values
    (
      'Elementos de la escena',
      'Configuración',
      '1939',
      '1999',
      'El trono de Pilato reúne piezas realizadas e incorporadas en distintas fechas: la loba capitolina de José Sanjuán Navarro (1939), el sillón de Antonio Castillo Lastrucci (1948), el senatus de Villarreal (1965), el propio trono de Antonio Martín (1985), el pebetero del mismo autor (1992) y las piezas de Manuel de los Ríos para el centurión y el soldado romano (1984 y 1999).',
      'La fuente oficial documenta cada elemento y su cronología individual.'
    ),
    (
      'Diseño, talla y dorado original',
      'Ejecución',
      '1967',
      '1969',
      'Antonio Martín Fernández diseñó y talló en madera de pino de Flandes el paso barroco rocalla entre 1967 y 1968. La ebanistería fue realizada por Francisco Bailac y el dorado original por el taller de Herrera y Feria entre 1968 y 1969.',
      null
    ),
    (
      'Programa escultórico de canastilla y respiraderos',
      'Ejecución',
      '1968',
      null,
      'Antonio Martín talló las ocho cartelas con símbolos pasionistas de la canastilla. Francisco Buiza realizó los cuatro tondos con los bustos de los Evangelistas, los veinticuatro querubines y las cuatro cartelas policromadas de los respiraderos con escenas de la vida de Jesús.',
      'Las escenas de los respiraderos se inspiran en ilustraciones de Estampas Bíblicas. Antiguo y Nuevo Testamento, publicado en Barcelona en 1934.'
    ),
    (
      'Faldones actuales',
      'Bordado y confección',
      '1983',
      '2006',
      'Los faldones de terciopelo morado fueron ejecutados por María del Carmen Gómez Tocón en 2006. Incorporan en las esquinas broches bordados en oro por Piedad Muñoz en 1983, según diseño de José Luis Asián Cano.',
      null
    ),
    (
      'Llamador',
      'Orfebrería',
      '1987',
      null,
      'Juan Sánchez Vela y Antonio Herranz ejecutaron en bronce fundido y dorado el llamador, que representa la Giralda y la torre de la parroquia de San Benito unidas por el antiguo puente de la Calzá, con los restos del acueducto de los Caños de Carmona.',
      null
    ),
    (
      'Apostolado de los respiraderos',
      'Escultura',
      '2003',
      null,
      'Juan Antonio Blanco talló en madera de cedro policromada y estofada las miniaturas de los doce apóstoles dispuestas en los respiraderos.',
      null
    ),
    (
      'Parihuela y dorado actual',
      'Renovación',
      '2018',
      '2020',
      'Carpintería Melo realizó la parihuela actual en 2018. Entre 2018 y 2020, los talleres de Manolo y Antonio Doradores ejecutaron el dorado vigente del paso.',
      null
    )
)
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
)
select
  gen_random_uuid(),
  '2c49d077-e377-492d-8e30-25fa823bdcd8'::uuid,
  seed.phase_name,
  seed.phase_type,
  seed.date_from_text,
  seed.date_to_text,
  seed.description,
  seed.notes,
  'published'
from phase_seed seed
where not exists (
  select 1
  from public.step_phases existing
  where existing.step_entity_id = '2c49d077-e377-492d-8e30-25fa823bdcd8'::uuid
    and existing.phase_name = seed.phase_name
    and existing.status <> 'archived'
);

with phase_agent_seed(phase_name, agent_slug, discipline, role_name, notes) as (
  values
    ('Elementos de la escena', 'jose-sanjuan-navarro', 'Escultura', 'Autor de la loba capitolina', 'Pieza fechada en 1939.'),
    ('Elementos de la escena', 'antonio-castillo-lastrucci', 'Escultura', 'Autor del sillón de Pilato', 'Pieza fechada en 1948 y enriquecida por Antonio Martín en 1985.'),
    ('Elementos de la escena', 'antonio-martin-fernandez', 'Talla', 'Autor del trono y del pebetero', 'Trono de 1985 y pebetero de 1992.'),
    ('Elementos de la escena', 'orfebreria-villarreal', 'Orfebrería', 'Autor del senatus', 'Pieza de metal plateado fechada en 1965.'),
    ('Elementos de la escena', 'manuel-de-los-rios', 'Orfebrería', 'Autor de las piezas del centurión y del soldado romano', 'Espada de 1984 y trompeta de plata sobredorada de 1999.'),
    ('Diseño, talla y dorado original', 'antonio-martin-fernandez', 'Diseño', 'Diseñador del paso', null),
    ('Diseño, talla y dorado original', 'antonio-martin-fernandez', 'Talla', 'Tallista del paso', null),
    ('Diseño, talla y dorado original', 'francisco-bailac', 'Carpintería', 'Ebanista', null),
    ('Diseño, talla y dorado original', 'taller-herrera-y-feria', 'Dorado', 'Responsable del dorado original', null),
    ('Programa escultórico de canastilla y respiraderos', 'antonio-martin-fernandez', 'Talla', 'Autor de las cartelas pasionistas', null),
    ('Programa escultórico de canastilla y respiraderos', 'francisco-buiza', 'Escultura', 'Autor de los tondos, querubines y cartelas de los respiraderos', null),
    ('Faldones actuales', 'maria-del-carmen-gomez-tocon', 'Confección', 'Autora de los faldones', null),
    ('Faldones actuales', 'piedad-munoz', 'Bordado', 'Autora del bordado de los broches', null),
    ('Faldones actuales', 'jose-luis-asian-cano', 'Diseño', 'Diseñador de los broches', null),
    ('Llamador', 'juan-sanchez-vela', 'Orfebrería', 'Coautor del llamador', null),
    ('Llamador', 'antonio-herranz', 'Orfebrería', 'Coautor del llamador', null),
    ('Apostolado de los respiraderos', 'juan-antonio-blanco', 'Escultura', 'Autor del apostolado en miniatura', null),
    ('Parihuela y dorado actual', 'carpinteria-melo', 'Carpintería', 'Autor de la parihuela actual', null),
    ('Parihuela y dorado actual', 'manolo-y-antonio-doradores', 'Dorado', 'Responsable del dorado actual', null)
)
insert into public.step_phase_agents (
  id,
  step_phase_id,
  agent_entity_id,
  discipline,
  role_name,
  notes
)
select
  gen_random_uuid(),
  phase.id,
  agent.id,
  seed.discipline,
  seed.role_name,
  seed.notes
from phase_agent_seed seed
join public.step_phases phase
  on phase.step_entity_id = '2c49d077-e377-492d-8e30-25fa823bdcd8'::uuid
 and phase.phase_name = seed.phase_name
 and phase.status <> 'archived'
join public.entities agent
  on agent.slug = seed.agent_slug
 and agent.entity_type = 'agent'
where not exists (
  select 1
  from public.step_phase_agents existing
  where existing.step_phase_id = phase.id
    and existing.agent_entity_id = agent.id
    and existing.discipline = seed.discipline
    and existing.element_entity_id is null
);

-- -----------------------------------------------------------------------------
-- 4. Fuente oficial y trazabilidad
-- -----------------------------------------------------------------------------

insert into public.sources (
  id,
  name,
  url,
  source_type,
  author_or_publisher,
  accessed_at,
  notes
)
select
  gen_random_uuid(),
  'San Benito · Paso de misterio de la Sagrada Presentación',
  'https://hermandaddesanbenito.net/misterio/',
  'Web oficial',
  'Hermandad de San Benito',
  '2026-08-21'::date,
  'Fuente oficial para la ficha técnica, las piezas y las fases patrimoniales del paso.'
where not exists (
  select 1
  from public.sources
  where url = 'https://hermandaddesanbenito.net/misterio/'
);

update public.sources
set
  name = 'San Benito · Paso de misterio de la Sagrada Presentación',
  source_type = 'Web oficial',
  author_or_publisher = 'Hermandad de San Benito',
  accessed_at = '2026-08-21'::date
where url = 'https://hermandaddesanbenito.net/misterio/';

insert into public.source_links (
  id,
  source_id,
  entity_id,
  scope,
  notes
)
select
  gen_random_uuid(),
  source.id,
  '2c49d077-e377-492d-8e30-25fa823bdcd8'::uuid,
  'Ficha técnica y patrimonio del paso',
  'La web oficial documenta el diseño, la talla, el dorado, la canastilla, los respiraderos, los faldones, el llamador y los elementos de la escena.'
from public.sources source
where source.url = 'https://hermandaddesanbenito.net/misterio/'
  and not exists (
    select 1
    from public.source_links existing
    where existing.source_id = source.id
      and existing.entity_id = '2c49d077-e377-492d-8e30-25fa823bdcd8'::uuid
  );

insert into public.source_links (
  id,
  source_id,
  step_phase_id,
  scope
)
select
  gen_random_uuid(),
  source.id,
  phase.id,
  'Fase patrimonial · ' || phase.phase_name
from public.sources source
join public.step_phases phase
  on phase.step_entity_id = '2c49d077-e377-492d-8e30-25fa823bdcd8'::uuid
 and phase.status <> 'archived'
where source.url = 'https://hermandaddesanbenito.net/misterio/'
  and not exists (
    select 1
    from public.source_links existing
    where existing.source_id = source.id
      and existing.step_phase_id = phase.id
  );

-- -----------------------------------------------------------------------------
-- 5. Validación final
-- -----------------------------------------------------------------------------

do $$
declare
  phase_count integer;
  phase_agent_count integer;
  phase_source_count integer;
begin
  if not exists (
    select 1
    from public.steps
    where entity_id = '2c49d077-e377-492d-8e30-25fa823bdcd8'::uuid
      and current_condition = 'preserved'
      and style = 'Barroco rocalla'
      and execution_date_text is not null
  ) then
    raise exception 'No se completó la ficha técnica del paso de San Benito';
  end if;

  select count(*)
  into phase_count
  from public.step_phases
  where step_entity_id = '2c49d077-e377-492d-8e30-25fa823bdcd8'::uuid
    and status <> 'archived';

  if phase_count <> 7 then
    raise exception 'El paso debe conservar exactamente 7 fases patrimoniales activas; encontradas: %', phase_count;
  end if;

  select count(*)
  into phase_agent_count
  from public.step_phase_agents agent_link
  join public.step_phases phase on phase.id = agent_link.step_phase_id
  where phase.step_entity_id = '2c49d077-e377-492d-8e30-25fa823bdcd8'::uuid
    and phase.status <> 'archived';

  if phase_agent_count < 19 then
    raise exception 'Faltan responsables en las fases patrimoniales del paso; encontrados: %', phase_agent_count;
  end if;

  select count(distinct source_link.step_phase_id)
  into phase_source_count
  from public.source_links source_link
  join public.sources source on source.id = source_link.source_id
  join public.step_phases phase on phase.id = source_link.step_phase_id
  where source.url = 'https://hermandaddesanbenito.net/misterio/'
    and phase.step_entity_id = '2c49d077-e377-492d-8e30-25fa823bdcd8'::uuid
    and phase.status <> 'archived';

  if phase_source_count <> 7 then
    raise exception 'No quedaron documentadas las siete fases del paso; encontradas: %', phase_source_count;
  end if;

  if not exists (
    select 1
    from public.source_links source_link
    join public.sources source on source.id = source_link.source_id
    where source.url = 'https://hermandaddesanbenito.net/misterio/'
      and source_link.entity_id = '2c49d077-e377-492d-8e30-25fa823bdcd8'::uuid
  ) then
    raise exception 'La fuente oficial no quedó vinculada a la ficha del paso';
  end if;
end
$$;

commit;
