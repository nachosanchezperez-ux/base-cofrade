-- Hilo Cofrade · San Esteban · carga relacional base
-- Piloto de investigación → normalización → grafo Hilo Cofrade.
--
-- Incluye Hermandad, titulares, pasos, fases patrimoniales, procedencias
-- históricas, música actual, dos hábitos, centenario, extraordinaria y fuentes.
-- Los capataces actuales quedan fuera: las fuentes oficiales localizadas no
-- acreditan de forma inequívoca un nombramiento vigente para 2026.

begin;

-- -----------------------------------------------------------------------------
-- 0. Precondiciones
-- -----------------------------------------------------------------------------
do $$
begin
  if not exists (
    select 1 from public.municipalities
    where id = 'ca85889c-21fe-4367-8477-a57656b25da4'::uuid and slug = 'sevilla'
  ) then
    raise exception 'San Esteban: falta el municipio canónico de Sevilla';
  end if;

  if not exists (
    select 1 from public.entities
    where id = 'fca6ffda-bf99-436d-9a04-6de87d764670'::uuid
      and entity_type = 'brotherhood' and slug = 'hermandad-del-cachorro'
  ) then
    raise exception 'San Esteban: falta la Hermandad del Cachorro canónica';
  end if;

  if not exists (
    select 1 from public.entities
    where id = 'aae6486d-3c23-4ffe-a7b3-17d737233155'::uuid
      and entity_type = 'brotherhood' and slug = 'hermandad-de-la-amargura'
  ) then
    raise exception 'San Esteban: falta la Hermandad de la Amargura canónica';
  end if;

  if not exists (
    select 1 from public.outings
    where id = 'c42261be-f699-41d2-a51d-a79719d438cb'::uuid
      and slug = 'sevilla-salud-y-buen-viaje-2026'
      and outing_date = date '2026-11-22'
  ) then
    raise exception 'San Esteban: falta la extraordinaria ya registrada del 22/11/2026';
  end if;

  if exists (
    select 1 from public.entities where slug = 'san-esteban' and entity_type <> 'brotherhood'
  ) then
    raise exception 'San Esteban: el slug san-esteban pertenece a otro tipo de entidad';
  end if;
end
$$;

-- -----------------------------------------------------------------------------
-- 1. Lugares
-- -----------------------------------------------------------------------------
insert into public.places (id, municipality_id, name, slug, place_type, address, notes)
values
  (
    gen_random_uuid(), 'ca85889c-21fe-4367-8477-a57656b25da4'::uuid,
    'Iglesia de San Esteban', 'iglesia-de-san-esteban-sevilla', 'Iglesia',
    'Calle San Esteban, s/n, 41003 Sevilla',
    'Sede canónica de la Hermandad de San Esteban.'
  ),
  (
    gen_random_uuid(), 'ca85889c-21fe-4367-8477-a57656b25da4'::uuid,
    'Santa Iglesia Catedral de Sevilla', 'santa-iglesia-catedral-sevilla', 'Catedral',
    null, 'Santa, Metropolitana y Patriarcal Iglesia Catedral de Sevilla.'
  ),
  (
    gen_random_uuid(), 'ca85889c-21fe-4367-8477-a57656b25da4'::uuid,
    'Iglesia de San Bartolomé', 'iglesia-san-bartolome-sevilla', 'Iglesia',
    null, 'En su sacristía se acordó la fundación de San Esteban el 9 de mayo de 1926.'
  )
on conflict (slug) do update set
  municipality_id = excluded.municipality_id,
  name = excluded.name,
  place_type = excluded.place_type,
  address = coalesce(public.places.address, excluded.address),
  notes = coalesce(public.places.notes, excluded.notes),
  updated_at = now();

-- -----------------------------------------------------------------------------
-- 2. Hermandad
-- -----------------------------------------------------------------------------
insert into public.entities (id, entity_type, name, slug, summary, status)
values (
  gen_random_uuid(), 'brotherhood', 'Hermandad de San Esteban', 'san-esteban',
  'Hermandad de penitencia sevillana fundada el 9 de mayo de 1926, con sede canónica en la Iglesia de San Esteban y estación de penitencia en la tarde del Martes Santo.',
  'published'
)
on conflict (slug) do update set
  name = excluded.name, summary = excluded.summary, status = excluded.status, updated_at = now();

insert into public.brotherhoods (
  entity_id, official_name, popular_name, foundation_text, municipality_id,
  canonical_see_place_id, website_url, brotherhood_types,
  current_procession_day, history_text, notes
)
select
  e.id,
  'Fervorosa Hermandad y Cofradía de Nazarenos de Nuestro Padre Jesús de la Salud y Buen Viaje, María Santísima Madre de los Desamparados, San Juan de Ribera y Protomártir San Esteban',
  'San Esteban', '9 de mayo de 1926',
  'ca85889c-21fe-4367-8477-a57656b25da4'::uuid, p.id,
  'https://www.hermandadsanesteban.org/', array['Penitencia']::text[], 'Martes Santo',
  'La Hermandad fue fundada el 9 de mayo de 1926 por treinta y dos personas reunidas en la sacristía de la parroquia de San Bartolomé, bajo la dirección de Rafael Galán Escalante. Realizó su primera estación de penitencia el Martes Santo 26 de marzo de 1929.',
  'En 2026 celebra su centenario fundacional.'
from public.entities e
join public.places p on p.slug = 'iglesia-de-san-esteban-sevilla'
where e.slug = 'san-esteban' and e.entity_type = 'brotherhood'
on conflict (entity_id) do update set
  official_name = excluded.official_name,
  popular_name = excluded.popular_name,
  foundation_text = excluded.foundation_text,
  municipality_id = excluded.municipality_id,
  canonical_see_place_id = excluded.canonical_see_place_id,
  website_url = excluded.website_url,
  brotherhood_types = excluded.brotherhood_types,
  current_procession_day = excluded.current_procession_day,
  history_text = excluded.history_text,
  notes = excluded.notes;

-- -----------------------------------------------------------------------------
-- 3. Titulares procesionales
-- -----------------------------------------------------------------------------
with seed(name, slug, summary) as (
  values
    (
      'Nuestro Padre Jesús de la Salud y Buen Viaje',
      'nuestro-padre-jesus-salud-buen-viaje-san-esteban',
      'Imagen cristífera de autor desconocido, con cabeza de barro cocido posiblemente de comienzos del siglo XVI y cuerpo de madera vinculado a una intervención del siglo XVIII.'
    ),
    (
      'María Santísima Madre de los Desamparados',
      'maria-santisima-madre-desamparados-san-esteban',
      'Dolorosa de candelero realizada por Manuel Galiano Delgado en 1927 y bendecida el 8 de mayo de ese año.'
    )
)
insert into public.entities (id, entity_type, name, slug, summary, status)
select gen_random_uuid(), 'image', name, slug, summary, 'published' from seed
on conflict (slug) do update set
  name = excluded.name, summary = excluded.summary, status = excluded.status, updated_at = now();

insert into public.images (
  entity_id, image_type, execution_date_text, material, current_condition,
  description, notes, iconography, anatomical_type, is_dress_image, current_state_notes
)
select
  e.id, 'Cristo',
  'Cabeza posiblemente de comienzos del siglo XVI; cuerpo e intervención de mediados del siglo XVIII',
  'Barro cocido en la cabeza y madera tallada en el cuerpo', 'extant',
  'Representa a Cristo sentado tras la flagelación, coronado de espinas, cubierto con clámide púrpura y con las manos atadas sosteniendo una caña a modo de cetro.',
  'La autoría es desconocida. La complejidad material apunta a una cabeza anterior, posiblemente de comienzos del siglo XVI, adaptada con un cuerpo de madera en el siglo XVIII; en ese momento se habrían incorporado también las cinco lágrimas.',
  'Ecce Homo / burla de Cristo coronado de espinas', 'Imagen de talla', false,
  'Imagen conservada y al culto en la Iglesia de San Esteban.'
from public.entities e
where e.slug = 'nuestro-padre-jesus-salud-buen-viaje-san-esteban'
on conflict (entity_id) do update set
  image_type = excluded.image_type,
  execution_date_text = excluded.execution_date_text,
  material = excluded.material,
  current_condition = excluded.current_condition,
  description = excluded.description,
  notes = excluded.notes,
  iconography = excluded.iconography,
  anatomical_type = excluded.anatomical_type,
  is_dress_image = excluded.is_dress_image,
  current_state_notes = excluded.current_state_notes;

insert into public.images (
  entity_id, image_type, execution_date_text, material, current_condition,
  description, notes, iconography, anatomical_type, is_dress_image, current_state_notes
)
select
  e.id, 'Virgen · Dolorosa', '1927', 'Madera de pino', 'extant',
  'Dolorosa de candelero realizada por Manuel Galiano Delgado en 1927. Fue bendecida el 8 de mayo de 1927 en la iglesia del Hospital Central, donde se encontraba depositada durante las obras de restauración de San Esteban.',
  'La advocación inicialmente propuesta fue Nuestra Señora de la Asunción en el Misterio de su Dolor; tras no ser admitida, fue bendecida como María Santísima Virgen de los Desamparados.',
  'Dolorosa', 'Candelero', true,
  'Imagen conservada y al culto en la Iglesia de San Esteban.'
from public.entities e
where e.slug = 'maria-santisima-madre-desamparados-san-esteban'
on conflict (entity_id) do update set
  image_type = excluded.image_type,
  execution_date_text = excluded.execution_date_text,
  material = excluded.material,
  current_condition = excluded.current_condition,
  description = excluded.description,
  notes = excluded.notes,
  iconography = excluded.iconography,
  anatomical_type = excluded.anatomical_type,
  is_dress_image = excluded.is_dress_image,
  current_state_notes = excluded.current_state_notes;

insert into public.brotherhood_images (
  id, brotherhood_entity_id, image_entity_id, relation_type, notes, status
)
select gen_random_uuid(), b.id, i.id, 'titular',
  'Titular procesional de la Hermandad de San Esteban.', 'published'
from public.entities b
cross join public.entities i
where b.slug = 'san-esteban'
  and i.slug in (
    'nuestro-padre-jesus-salud-buen-viaje-san-esteban',
    'maria-santisima-madre-desamparados-san-esteban'
  )
  and not exists (
    select 1 from public.brotherhood_images bi
    where bi.brotherhood_entity_id = b.id and bi.image_entity_id = i.id
      and bi.relation_type = 'titular' and bi.status <> 'archived'
  );

-- -----------------------------------------------------------------------------
-- 4. Agentes y autorías
-- -----------------------------------------------------------------------------
with seed(name, slug, agent_kind, summary, discipline) as (
  values
    ('Manuel Galiano Delgado', 'manuel-galiano-delgado', 'person', 'Escultor autor de María Santísima Madre de los Desamparados de San Esteban en 1927.', 'Escultura'),
    ('Antonio Cruz Gómez', 'antonio-cruz-gomez', 'person', 'Tallista de la canastilla del paso actualmente utilizado por Nuestro Padre Jesús de la Salud y Buen Viaje, ejecutada en 1887.', 'Talla'),
    ('Talleres de Olaya y Govea', 'talleres-olaya-y-govea', 'workshop', 'Talleres responsables del dorado histórico del paso adquirido por San Esteban al Cachorro.', 'Dorado'),
    ('José Gil', 'jose-gil', 'person', 'Autor de los respiraderos incorporados en 1909 al paso posteriormente adquirido por San Esteban.', 'Talla'),
    ('Fernando Murciano Abad', 'fernando-murciano-abad', 'person', 'Restaurador de las figuras secundarias del misterio de San Esteban entre 2015 y 2016.', 'Restauración'),
    ('Enrique Castellanos Luque', 'enrique-castellanos-luque', 'person', 'Responsable de la restauración y dorado integral del paso del Señor de San Esteban entre 2014 y 2016.', 'Dorado'),
    ('Manuel Ballesteros', 'manuel-ballesteros', 'person', 'Coautor del nuevo suelo del paso de misterio de San Esteban estrenado en 2017.', 'Carpintería'),
    ('Alejandro Cascajares', 'alejandro-cascajares', 'person', 'Coautor del nuevo suelo del paso de misterio de San Esteban estrenado en 2017.', 'Carpintería'),
    ('David Calleja Ruiz', 'david-calleja-ruiz', 'person', 'Autor de los ropajes de las figuras secundarias del misterio de San Esteban estrenados en 2017.', 'Confección'),
    ('Leopoldo Padilla', 'leopoldo-padilla', 'person', 'Artífice de la malla de hilos de oro del palio de la Virgen de los Desamparados en 1964.', 'Bordado'),
    ('Ignacio Gómez Millán', 'ignacio-gomez-millan', 'person', 'Diseñador del conjunto de bordados del palio de María Santísima Madre de los Desamparados.', 'Diseño'),
    ('Esperanza Elena Caro', 'esperanza-elena-caro', 'person', 'Bordadora cuyo taller ejecutó las sucesivas fases del palio de la Virgen de los Desamparados.', 'Bordado'),
    ('José Antonio Grande de León', 'jose-antonio-grande-de-leon', 'person', 'Restaurador del palio de María Santísima Madre de los Desamparados entre 2007 y 2010.', 'Bordado'),
    ('Juan Fernández', 'juan-fernandez', 'person', 'Orfebre autor de diversos elementos históricos del palio de San Esteban.', 'Orfebrería'),
    ('Alejandro Marmolejo', 'alejandro-marmolejo', 'person', 'Orfebre responsable de la restauración de los varales del palio de San Esteban en 2017.', 'Orfebrería')
)
insert into public.entities (id, entity_type, name, slug, summary, status)
select gen_random_uuid(), 'agent', name, slug, summary, 'published'
from seed
where not exists (select 1 from public.entities e where e.slug = seed.slug);

with seed(slug, agent_kind, description) as (
  values
    ('manuel-galiano-delgado', 'person', 'Escultor autor de María Santísima Madre de los Desamparados de San Esteban en 1927.'),
    ('antonio-cruz-gomez', 'person', 'Tallista de la canastilla del paso actualmente utilizado por Nuestro Padre Jesús de la Salud y Buen Viaje, ejecutada en 1887.'),
    ('talleres-olaya-y-govea', 'workshop', 'Talleres responsables del dorado histórico del paso adquirido por San Esteban al Cachorro.'),
    ('jose-gil', 'person', 'Autor de los respiraderos incorporados en 1909 al paso posteriormente adquirido por San Esteban.'),
    ('fernando-murciano-abad', 'person', 'Restaurador de las figuras secundarias del misterio de San Esteban entre 2015 y 2016.'),
    ('enrique-castellanos-luque', 'person', 'Responsable de la restauración y dorado integral del paso del Señor de San Esteban entre 2014 y 2016.'),
    ('manuel-ballesteros', 'person', 'Coautor del nuevo suelo del paso de misterio de San Esteban estrenado en 2017.'),
    ('alejandro-cascajares', 'person', 'Coautor del nuevo suelo del paso de misterio de San Esteban estrenado en 2017.'),
    ('david-calleja-ruiz', 'person', 'Autor de los ropajes de las figuras secundarias del misterio de San Esteban estrenados en 2017.'),
    ('leopoldo-padilla', 'person', 'Artífice de la malla de hilos de oro del palio de la Virgen de los Desamparados en 1964.'),
    ('ignacio-gomez-millan', 'person', 'Diseñador del conjunto de bordados del palio de María Santísima Madre de los Desamparados.'),
    ('esperanza-elena-caro', 'person', 'Bordadora cuyo taller ejecutó las sucesivas fases del palio de la Virgen de los Desamparados.'),
    ('jose-antonio-grande-de-leon', 'person', 'Restaurador del palio de María Santísima Madre de los Desamparados entre 2007 y 2010.'),
    ('juan-fernandez', 'person', 'Orfebre autor de diversos elementos históricos del palio de San Esteban.'),
    ('alejandro-marmolejo', 'person', 'Orfebre responsable de la restauración de los varales del palio de San Esteban en 2017.')
)
insert into public.agents (entity_id, agent_kind, description)
select e.id, seed.agent_kind, seed.description
from seed
join public.entities e on e.slug = seed.slug and e.entity_type = 'agent'
on conflict (entity_id) do update set
  description = coalesce(nullif(public.agents.description, ''), excluded.description);

-- Reutiliza agentes canónicos ya existentes.
insert into public.agents (entity_id, agent_kind, description)
select e.id, 'person',
  case e.slug
    when 'antonio-castillo-lastrucci' then 'Escultor autor de las figuras secundarias del misterio de San Esteban en 1940.'
    when 'jose-sanjuan-navarro' then 'Escultor que adaptó en 1964 las figuras secundarias del misterio de San Esteban para el uso de ropajes naturales.'
    when 'manuel-de-los-rios' then 'Orfebre autor de la candelería, respiraderos actuales y llamador del palio de San Esteban.'
    when 'jose-luis-asian-cano' then 'Diseñador vinculado a distintas piezas patrimoniales de la Semana Santa de Sevilla.'
  end
from public.entities e
where e.slug in ('antonio-castillo-lastrucci','jose-sanjuan-navarro','manuel-de-los-rios','jose-luis-asian-cano')
on conflict (entity_id) do nothing;

with seed(slug, discipline, notes) as (
  values
    ('manuel-galiano-delgado', 'Escultura', 'Autoría de María Santísima Madre de los Desamparados.'),
    ('antonio-cruz-gomez', 'Talla', 'Talla del paso del Señor, 1887.'),
    ('talleres-olaya-y-govea', 'Dorado', 'Dorado histórico del paso adquirido al Cachorro.'),
    ('jose-gil', 'Talla', 'Respiraderos de 1909.'),
    ('antonio-castillo-lastrucci', 'Escultura', 'Figuras secundarias del misterio, 1940.'),
    ('jose-sanjuan-navarro', 'Escultura', 'Adaptación de las figuras secundarias, 1964.'),
    ('fernando-murciano-abad', 'Restauración', 'Restauración de las figuras secundarias, 2015–2016.'),
    ('enrique-castellanos-luque', 'Dorado', 'Restauración y dorado integral, 2014–2016.'),
    ('manuel-ballesteros', 'Carpintería', 'Nuevo suelo del paso de misterio, 2017.'),
    ('alejandro-cascajares', 'Carpintería', 'Nuevo suelo del paso de misterio, 2017.'),
    ('david-calleja-ruiz', 'Confección', 'Ropajes de las figuras secundarias, 2017.'),
    ('leopoldo-padilla', 'Bordado', 'Malla del palio, 1964.'),
    ('ignacio-gomez-millan', 'Diseño', 'Diseño del palio.'),
    ('esperanza-elena-caro', 'Bordado', 'Ejecución de las fases del palio.'),
    ('manuel-de-los-rios', 'Orfebrería', 'Candelería y orfebrería del palio.'),
    ('jose-luis-asian-cano', 'Diseño', 'Diseño de los respiraderos actuales, citado por la fuente oficial como José Asián Cano.'),
    ('jose-antonio-grande-de-leon', 'Bordado', 'Restauración del palio, 2007–2010.'),
    ('juan-fernandez', 'Orfebrería', 'Elementos históricos del paso de palio.'),
    ('alejandro-marmolejo', 'Orfebrería', 'Restauración de los varales, 2017.')
)
insert into public.agent_disciplines (agent_entity_id, discipline, is_primary, notes)
select e.id, seed.discipline, true, seed.notes
from seed
join public.entities e on e.slug = seed.slug and e.entity_type = 'agent'
on conflict (agent_entity_id, discipline) do nothing;

insert into public.image_authorships (
  id, image_entity_id, agent_entity_id, authorship_type, role_name,
  date_from_text, certainty, notes, status
)
select gen_random_uuid(), i.id, null, 'anonymous', 'Autoría', 'Obra de cronología compleja',
  'unknown',
  'Autor desconocido. La fuente oficial distingue una cabeza de barro cocido posiblemente de comienzos del siglo XVI y un cuerpo de madera asociado a una intervención del siglo XVIII.',
  'published'
from public.entities i
where i.slug = 'nuestro-padre-jesus-salud-buen-viaje-san-esteban'
  and not exists (
    select 1 from public.image_authorships ia
    where ia.image_entity_id = i.id and ia.authorship_type = 'anonymous' and ia.status <> 'archived'
  );

insert into public.image_authorships (
  id, image_entity_id, agent_entity_id, authorship_type, role_name,
  date_from_text, certainty, notes, status
)
select gen_random_uuid(), i.id, a.id, 'author', 'Escultor', '1927', 'documented',
  'Manuel Galiano Delgado se comprometió a finalizar la obra a finales de abril de 1927.',
  'published'
from public.entities i
join public.entities a on a.slug = 'manuel-galiano-delgado'
where i.slug = 'maria-santisima-madre-desamparados-san-esteban'
  and not exists (
    select 1 from public.image_authorships ia
    where ia.image_entity_id = i.id and ia.agent_entity_id = a.id
      and ia.authorship_type = 'author' and ia.status <> 'archived'
  );

-- -----------------------------------------------------------------------------
-- 5. Pasos y relaciones procesionales
-- -----------------------------------------------------------------------------
with seed(name, slug, summary) as (
  values
    (
      'Paso de misterio de Nuestro Padre Jesús de la Salud y Buen Viaje',
      'paso-misterio-salud-buen-viaje-san-esteban',
      'Paso neobarroco adquirido por San Esteban a la Hermandad del Cachorro en 1930, cuya talla principal fue ejecutada por Antonio Cruz Gómez en 1887.'
    ),
    (
      'Paso de palio de María Santísima Madre de los Desamparados',
      'paso-palio-madre-desamparados-san-esteban',
      'Paso de palio configurado mediante distintas fases patrimoniales, con varales procedentes de la Hermandad de la Amargura y palio bordado entre 1964 y 1975.'
    )
)
insert into public.entities (id, entity_type, name, slug, summary, status)
select gen_random_uuid(), 'step', name, slug, summary, 'published' from seed
on conflict (slug) do update set
  name = excluded.name, summary = excluded.summary, status = excluded.status, updated_at = now();

insert into public.steps (
  entity_id, step_type, current_condition, description, notes, style,
  materials, carrier_system, execution_date_text, current_state_notes
)
select e.id, 'Misterio', 'preserved',
  'Paso que representa la burla a Cristo tras la coronación de espinas. Las andas actuales fueron adquiridas en 1930 a la Hermandad del Cachorro y reúnen elementos realizados y transformados en diferentes momentos.',
  'Las cuatro figuras secundarias del misterio fueron ejecutadas por Antonio Castillo Lastrucci en 1940.',
  'Neobarroco', 'Madera tallada y dorada, esculturas policromadas y candelabros de guardabrisas',
  'Costaleros', '1887 · configuración enriquecida y transformada entre 1909 y 2017',
  'Conserva la canastilla histórica adquirida al Cachorro, junto a respiraderos, candelabros y otros elementos de distintas fases.'
from public.entities e where e.slug = 'paso-misterio-salud-buen-viaje-san-esteban'
on conflict (entity_id) do update set
  step_type = excluded.step_type, current_condition = excluded.current_condition,
  description = excluded.description, notes = excluded.notes, style = excluded.style,
  materials = excluded.materials, carrier_system = excluded.carrier_system,
  execution_date_text = excluded.execution_date_text,
  current_state_notes = excluded.current_state_notes;

insert into public.steps (
  entity_id, step_type, current_condition, description, notes, style,
  materials, carrier_system, execution_date_text, current_state_notes
)
select e.id, 'Palio', 'preserved',
  'Paso de palio de María Santísima Madre de los Desamparados, configurado a través de distintas fases de orfebrería y bordado durante los siglos XX y XXI.',
  'Sus varales son los antiguos de cobre plateado de la Hermandad de la Amargura, adquiridos por San Esteban en 1929.',
  'Neobarroco', 'Plata de ley y metal plateado, terciopelo, malla de oro y bordados en oro y sedas',
  'Costaleros', '1929–2014 · conjunto formado por piezas de distintas etapas',
  'Los respiraderos actuales son de Manuel de los Ríos (1997) y el conjunto del palio fue bordado por fases entre 1964 y 1975.'
from public.entities e where e.slug = 'paso-palio-madre-desamparados-san-esteban'
on conflict (entity_id) do update set
  step_type = excluded.step_type, current_condition = excluded.current_condition,
  description = excluded.description, notes = excluded.notes, style = excluded.style,
  materials = excluded.materials, carrier_system = excluded.carrier_system,
  execution_date_text = excluded.execution_date_text,
  current_state_notes = excluded.current_state_notes;

insert into public.brotherhood_steps (
  id, brotherhood_entity_id, step_entity_id, relation_type, notes, status
)
select gen_random_uuid(), b.id, s.id, 'processional_step',
  'Paso procesional actual de la Hermandad de San Esteban.', 'published'
from public.entities b
cross join public.entities s
where b.slug = 'san-esteban'
  and s.slug in ('paso-misterio-salud-buen-viaje-san-esteban','paso-palio-madre-desamparados-san-esteban')
  and not exists (
    select 1 from public.brotherhood_steps bs
    where bs.brotherhood_entity_id = b.id and bs.step_entity_id = s.id
      and bs.relation_type = 'processional_step' and bs.status <> 'archived'
  );

insert into public.image_steps (id, image_entity_id, step_entity_id, relation_type, notes, status)
select gen_random_uuid(), i.id, s.id, 'processes_on', 'Relación procesional actual.', 'published'
from (
  values
    ('nuestro-padre-jesus-salud-buen-viaje-san-esteban','paso-misterio-salud-buen-viaje-san-esteban'),
    ('maria-santisima-madre-desamparados-san-esteban','paso-palio-madre-desamparados-san-esteban')
) x(image_slug, step_slug)
join public.entities i on i.slug = x.image_slug
join public.entities s on s.slug = x.step_slug
where not exists (
  select 1 from public.image_steps ix
  where ix.image_entity_id = i.id and ix.step_entity_id = s.id
    and ix.relation_type = 'processes_on' and ix.status <> 'archived'
);

-- -----------------------------------------------------------------------------
-- 6. Fases patrimoniales
-- -----------------------------------------------------------------------------
with seed(step_slug, phase_name, phase_type, date_from, date_from_text, date_to_text, description, notes) as (
  values
    ('paso-misterio-salud-buen-viaje-san-esteban','Talla original de la canastilla','Ejecución',null::date,'1887',null,'Antonio Cruz Gómez ejecutó en 1887 la talla del paso que posteriormente pasaría del Cachorro a San Esteban.','El dorado posterior se realizó en los talleres de Olaya y Govea.'),
    ('paso-misterio-salud-buen-viaje-san-esteban','Respiraderos incorporados por el Cachorro','Ejecución',null::date,'1909',null,'Los respiraderos que forman parte del conjunto actual fueron incorporados por la Hermandad del Cachorro en 1909 y son obra de José Gil.',null),
    ('paso-misterio-salud-buen-viaje-san-esteban','Adquisición a la Hermandad del Cachorro','Adquisición',date '1930-01-24','24 de enero de 1930',null,'San Esteban adquirió a la Hermandad del Santísimo Cristo de la Expiración de Triana el paso compuesto por parihuela, canasto, respiraderos y seis candelabros.','El contrato fijó un precio de 7.000 pesetas.'),
    ('paso-misterio-salud-buen-viaje-san-esteban','Figuras secundarias del misterio','Escultura',null::date,'1940',null,'Antonio Castillo Lastrucci ejecutó las cuatro figuras secundarias que completan el misterio de la burla a Cristo.','La autoría consta en el contrato firmado en 1940.'),
    ('paso-misterio-salud-buen-viaje-san-esteban','Adaptación de las figuras secundarias','Transformación',null::date,'1964',null,'José Sanjuán Navarro retiró las vestiduras encoladas para permitir el uso de ropajes naturales.',null),
    ('paso-misterio-salud-buen-viaje-san-esteban','Restauración integral y nuevo dorado','Restauración',null::date,'2014','2016','Enrique Castellanos Luque acometió la restauración y el dorado integral del paso.',null),
    ('paso-misterio-salud-buen-viaje-san-esteban','Restauración de las figuras secundarias','Restauración',null::date,'2015','2016','Fernando Murciano Abad restauró las figuras secundarias del misterio entre 2015 y 2016.',null),
    ('paso-misterio-salud-buen-viaje-san-esteban','Renovaciones del misterio','Renovación',null::date,'2017',null,'El paso estrenó un nuevo suelo realizado por Manuel Ballesteros y Alejandro Cascajares, mientras las figuras secundarias recibieron nuevos ropajes de David Calleja Ruiz.',null),
    ('paso-palio-madre-desamparados-san-esteban','Varales procedentes de la Hermandad de la Amargura','Adquisición',date '1929-01-20','20 de enero de 1929',null,'San Esteban adquirió los antiguos varales de cobre plateado de la Hermandad de la Amargura.','Fueron enriquecidos en 1964 por Juan Fernández y restaurados en 2017 por Alejandro Marmolejo.'),
    ('paso-palio-madre-desamparados-san-esteban','Ejecución del palio bordado','Bordado',null::date,'1964','1975','Leopoldo Padilla realizó en 1964 la malla de hilos de oro; Ignacio Gómez Millán proyectó el dibujo y el taller de Esperanza Elena Caro ejecutó por fases bambalinas, gloria y techo entre 1965 y 1975.',null),
    ('paso-palio-madre-desamparados-san-esteban','Candelería actual','Orfebrería',null::date,'1989',null,'Manuel de los Ríos realizó la candelería actual en metal plateado repujado, compuesta por 86 piezas.',null),
    ('paso-palio-madre-desamparados-san-esteban','Respiraderos actuales y llamador','Orfebrería',null::date,'1997',null,'Manuel de los Ríos ejecutó en plata de ley los respiraderos actuales y el llamador. Los respiraderos siguen un diseño de José Asián Cano.',null),
    ('paso-palio-madre-desamparados-san-esteban','Restauración del palio','Restauración',null::date,'2007','2010','José Antonio Grande de León realizó una profunda restauración del palio, sustituyendo la malla soporte, limpiando y enriqueciendo techo y caídas.',null),
    ('paso-palio-madre-desamparados-san-esteban','Manto de salida','Bordado',null::date,'2014',null,'La Virgen estrenó un manto de salida bordado en hilo de oro sobre terciopelo azul, ejecutado por el taller de bordados de la Hermandad.',null)
)
insert into public.step_phases (
  id, step_entity_id, phase_name, phase_type, date_from, date_from_text,
  date_to_text, description, notes, status
)
select gen_random_uuid(), s.id, seed.phase_name, seed.phase_type, seed.date_from,
  seed.date_from_text, seed.date_to_text, seed.description, seed.notes, 'published'
from seed
join public.entities s on s.slug = seed.step_slug and s.entity_type = 'step'
where not exists (
  select 1 from public.step_phases sp
  where sp.step_entity_id = s.id and sp.phase_name = seed.phase_name and sp.status <> 'archived'
);

with seed(step_slug, phase_name, agent_slug, discipline, role_name, notes) as (
  values
    ('paso-misterio-salud-buen-viaje-san-esteban','Talla original de la canastilla','antonio-cruz-gomez','Talla','Tallista',null),
    ('paso-misterio-salud-buen-viaje-san-esteban','Talla original de la canastilla','talleres-olaya-y-govea','Dorado','Doradores','Dorado histórico posterior a la talla.'),
    ('paso-misterio-salud-buen-viaje-san-esteban','Respiraderos incorporados por el Cachorro','jose-gil','Talla','Autor',null),
    ('paso-misterio-salud-buen-viaje-san-esteban','Figuras secundarias del misterio','antonio-castillo-lastrucci','Escultura','Escultor',null),
    ('paso-misterio-salud-buen-viaje-san-esteban','Adaptación de las figuras secundarias','jose-sanjuan-navarro','Escultura','Intervención',null),
    ('paso-misterio-salud-buen-viaje-san-esteban','Restauración integral y nuevo dorado','enrique-castellanos-luque','Dorado','Restaurador y dorador',null),
    ('paso-misterio-salud-buen-viaje-san-esteban','Restauración de las figuras secundarias','fernando-murciano-abad','Restauración','Restaurador',null),
    ('paso-misterio-salud-buen-viaje-san-esteban','Renovaciones del misterio','manuel-ballesteros','Carpintería','Coautor del suelo',null),
    ('paso-misterio-salud-buen-viaje-san-esteban','Renovaciones del misterio','alejandro-cascajares','Carpintería','Coautor del suelo',null),
    ('paso-misterio-salud-buen-viaje-san-esteban','Renovaciones del misterio','david-calleja-ruiz','Confección','Autor de los ropajes',null),
    ('paso-palio-madre-desamparados-san-esteban','Varales procedentes de la Hermandad de la Amargura','juan-fernandez','Orfebrería','Enriquecimiento de los varales','Intervención de 1964.'),
    ('paso-palio-madre-desamparados-san-esteban','Varales procedentes de la Hermandad de la Amargura','alejandro-marmolejo','Orfebrería','Restaurador','Restauración de 2017.'),
    ('paso-palio-madre-desamparados-san-esteban','Ejecución del palio bordado','leopoldo-padilla','Bordado','Autor de la malla',null),
    ('paso-palio-madre-desamparados-san-esteban','Ejecución del palio bordado','ignacio-gomez-millan','Diseño','Diseñador',null),
    ('paso-palio-madre-desamparados-san-esteban','Ejecución del palio bordado','esperanza-elena-caro','Bordado','Ejecución del bordado','Trabajo realizado en su taller.'),
    ('paso-palio-madre-desamparados-san-esteban','Candelería actual','manuel-de-los-rios','Orfebrería','Orfebre',null),
    ('paso-palio-madre-desamparados-san-esteban','Respiraderos actuales y llamador','manuel-de-los-rios','Orfebrería','Orfebre',null),
    ('paso-palio-madre-desamparados-san-esteban','Respiraderos actuales y llamador','jose-luis-asian-cano','Diseño','Diseñador','La fuente oficial lo cita como José Asián Cano.'),
    ('paso-palio-madre-desamparados-san-esteban','Restauración del palio','jose-antonio-grande-de-leon','Bordado','Restaurador',null)
)
insert into public.step_phase_agents (
  id, step_phase_id, agent_entity_id, discipline, role_name, notes
)
select gen_random_uuid(), phase.id, agent.id, seed.discipline, seed.role_name, seed.notes
from seed
join public.entities step on step.slug = seed.step_slug
join public.step_phases phase on phase.step_entity_id = step.id
  and phase.phase_name = seed.phase_name and phase.status <> 'archived'
join public.entities agent on agent.slug = seed.agent_slug and agent.entity_type = 'agent'
where not exists (
  select 1 from public.step_phase_agents spa
  where spa.step_phase_id = phase.id and spa.agent_entity_id = agent.id
    and spa.discipline = seed.discipline
    and coalesce(spa.role_name, '') = coalesce(seed.role_name, '')
);

-- -----------------------------------------------------------------------------
-- 7. Procedencias históricas entre hermandades
-- -----------------------------------------------------------------------------
insert into public.entity_relations (
  id, source_entity_id, relation_type, target_entity_id,
  date_from, date_from_text, notes, status
)
select gen_random_uuid(), step.id, 'acquired_from_brotherhood',
  'fca6ffda-bf99-436d-9a04-6de87d764670'::uuid,
  date '1930-01-24', '24 de enero de 1930',
  'San Esteban adquirió a la Hermandad del Cachorro las andas compuestas por parihuela, canasto, respiraderos y seis candelabros. La talla principal había sido realizada por Antonio Cruz Gómez en 1887.',
  'published'
from public.entities step
where step.slug = 'paso-misterio-salud-buen-viaje-san-esteban'
  and not exists (
    select 1 from public.entity_relations er
    where er.source_entity_id = step.id
      and er.relation_type = 'acquired_from_brotherhood'
      and er.target_entity_id = 'fca6ffda-bf99-436d-9a04-6de87d764670'::uuid
      and er.status <> 'archived'
  );

insert into public.entity_relations (
  id, source_entity_id, relation_type, target_entity_id,
  date_from, date_from_text, notes, status
)
select gen_random_uuid(), step.id, 'includes_elements_acquired_from_brotherhood',
  'aae6486d-3c23-4ffe-a7b3-17d737233155'::uuid,
  date '1929-01-20', '20 de enero de 1929',
  'El paso de palio conserva los antiguos varales de cobre plateado de la Hermandad de la Amargura, adquiridos el 20 de enero de 1929.',
  'published'
from public.entities step
where step.slug = 'paso-palio-madre-desamparados-san-esteban'
  and not exists (
    select 1 from public.entity_relations er
    where er.source_entity_id = step.id
      and er.relation_type = 'includes_elements_acquired_from_brotherhood'
      and er.target_entity_id = 'aae6486d-3c23-4ffe-a7b3-17d737233155'::uuid
      and er.status <> 'archived'
  );

-- -----------------------------------------------------------------------------
-- 8. Acompañamientos musicales actuales
-- -----------------------------------------------------------------------------
insert into public.entities (id, entity_type, name, slug, summary, status)
values (
  gen_random_uuid(), 'band', 'Agrupación Musical Virgen de los Reyes',
  'agrupacion-musical-virgen-de-los-reyes-sevilla',
  'Agrupación musical que acompaña actualmente al paso de Nuestro Padre Jesús de la Salud y Buen Viaje en el Martes Santo.',
  'published'
)
on conflict (slug) do update set
  name = excluded.name, summary = excluded.summary, status = excluded.status, updated_at = now();

insert into public.bands (entity_id, band_type, municipality_id, description)
select e.id, 'Agrupación Musical', 'ca85889c-21fe-4367-8477-a57656b25da4'::uuid,
  'Referencia relacional mínima creada para documentar su acompañamiento actual a San Esteban. La ficha de la banda podrá completarse posteriormente.'
from public.entities e
where e.slug = 'agrupacion-musical-virgen-de-los-reyes-sevilla'
on conflict (entity_id) do update set
  band_type = excluded.band_type,
  municipality_id = excluded.municipality_id,
  description = coalesce(nullif(public.bands.description, ''), excluded.description);

insert into public.music_accompaniment_periods (
  id, brotherhood_entity_id, band_entity_id, step_entity_id, position,
  outing_type, year_from, is_current, notes, status,
  public_brotherhood_name, public_step_name, public_brotherhood_slug,
  public_municipality_name, public_municipality_slug, public_province
)
select gen_random_uuid(), b.id, band.id, step.id, 'Tras el paso del Señor',
  'Estación de Penitencia', 2022, true,
  'La relación histórica oficial de bandas señala 2022 como inicio del periodo actual.',
  'published', 'Hermandad de San Esteban', 'Nuestro Padre Jesús de la Salud y Buen Viaje',
  'san-esteban', 'Sevilla', 'sevilla', 'Sevilla'
from public.entities b
join public.entities band on band.slug = 'agrupacion-musical-virgen-de-los-reyes-sevilla'
join public.entities step on step.slug = 'paso-misterio-salud-buen-viaje-san-esteban'
where b.slug = 'san-esteban'
  and not exists (
    select 1 from public.music_accompaniment_periods map
    where map.brotherhood_entity_id = b.id and map.band_entity_id = band.id
      and map.step_entity_id = step.id and map.year_from = 2022
      and map.is_current = true and map.status <> 'archived'
  );

insert into public.music_accompaniment_periods (
  id, brotherhood_entity_id, band_entity_id, step_entity_id, position,
  outing_type, year_from, is_current, notes, status,
  public_brotherhood_name, public_step_name, public_brotherhood_slug,
  public_municipality_name, public_municipality_slug, public_province
)
select gen_random_uuid(), b.id, 'a23934c9-93e9-4bf1-886e-d98ec170b74f'::uuid, step.id,
  'Tras el paso de la Virgen', 'Estación de Penitencia', 2022, true,
  'La relación histórica oficial de bandas señala 2022 como inicio del periodo actual.',
  'published', 'Hermandad de San Esteban', 'María Santísima Madre de los Desamparados',
  'san-esteban', 'Sevilla', 'sevilla', 'Sevilla'
from public.entities b
join public.entities step on step.slug = 'paso-palio-madre-desamparados-san-esteban'
where b.slug = 'san-esteban'
  and not exists (
    select 1 from public.music_accompaniment_periods map
    where map.brotherhood_entity_id = b.id
      and map.band_entity_id = 'a23934c9-93e9-4bf1-886e-d98ec170b74f'::uuid
      and map.step_entity_id = step.id and map.year_from = 2022
      and map.is_current = true and map.status <> 'archived'
  );

-- -----------------------------------------------------------------------------
-- 9. Indumentaria: nazarenos y manigueteros
-- -----------------------------------------------------------------------------
insert into public.brotherhood_habits (
  brotherhood_entity_id, name, tunic_description, hood_description,
  cord_description, buttons_description, shield_description,
  footwear_description, sort_order, notes, status
)
select b.id, 'Hábito de nazareno',
  'Túnica de color crema y capa de color azul celeste.',
  'Antifaz de color azul celeste.',
  'Cíngulo o cordón de seda en azul celeste y crema, anudado a la izquierda de la botonadura.',
  'Botones de color azul celeste.',
  'Escudo de la Hermandad en el antifaz y escudo de San Juan de Ribera en la capa, a la altura del antebrazo izquierdo.',
  'Guantes y calcetines blancos; sandalias o zapatos negros.',
  1::smallint, 'Indumentaria vigente descrita por la Regla 114.ª de la Hermandad.', 'published'
from public.entities b where b.slug = 'san-esteban'
on conflict (brotherhood_entity_id, name) do update set
  tunic_description = excluded.tunic_description,
  hood_description = excluded.hood_description,
  cord_description = excluded.cord_description,
  buttons_description = excluded.buttons_description,
  shield_description = excluded.shield_description,
  footwear_description = excluded.footwear_description,
  sort_order = excluded.sort_order,
  notes = excluded.notes,
  status = excluded.status,
  updated_at = now();

insert into public.brotherhood_habits (
  brotherhood_entity_id, name, tunic_description, hood_description,
  cord_description, buttons_description, shield_description,
  footwear_description, sort_order, notes, status
)
select b.id, 'Hábito de maniguetero',
  'Túnica de cola de lanilla o sarga en color azul añil.',
  'Antifaz de igual tejido y color azul añil, sin armazón de capirote.',
  'Cinturón de abacá de unos seis centímetros de ancho.',
  null,
  'Escudo de la Hermandad prendido a la altura del pecho.',
  'Guantes, calcetines y zapatos negros, sin hebilla ni adorno.',
  2::smallint,
  'Recuerda la indumentaria usada por la Hermandad entre 1946 y 1967. Los manigueteros, incorporados al cortejo en la década de 1980, recuperaron esta túnica de cola como vestigio histórico.',
  'published'
from public.entities b where b.slug = 'san-esteban'
on conflict (brotherhood_entity_id, name) do update set
  tunic_description = excluded.tunic_description,
  hood_description = excluded.hood_description,
  cord_description = excluded.cord_description,
  buttons_description = excluded.buttons_description,
  shield_description = excluded.shield_description,
  footwear_description = excluded.footwear_description,
  sort_order = excluded.sort_order,
  notes = excluded.notes,
  status = excluded.status,
  updated_at = now();

-- -----------------------------------------------------------------------------
-- 10. Fundación y centenario como acontecimientos
-- -----------------------------------------------------------------------------
with seed(name, slug, summary) as (
  values
    (
      'Fundación de la Hermandad de San Esteban',
      'fundacion-hermandad-san-esteban-1926',
      'La Hermandad fue fundada el 9 de mayo de 1926 por treinta y dos personas reunidas en la sacristía de San Bartolomé.'
    ),
    (
      'Centenario fundacional de la Hermandad de San Esteban',
      'centenario-fundacional-san-esteban-1926-2026',
      'Conmemoración del centenario fundacional, culminada en 2026 con cultos y salidas extraordinarias de Nuestro Padre Jesús de la Salud y Buen Viaje.'
    )
)
insert into public.entities (id, entity_type, name, slug, summary, status)
select gen_random_uuid(), 'event', name, slug, summary, 'published' from seed
on conflict (slug) do update set
  name = excluded.name, summary = excluded.summary, status = excluded.status, updated_at = now();

insert into public.events (entity_id, event_type, event_date, event_date_text, place_id, description)
select e.id, 'Fundación', date '1926-05-09', '9 de mayo de 1926', p.id,
  'Treinta y dos personas reunidas en la sacristía de la parroquia de San Bartolomé, bajo la dirección de Rafael Galán Escalante, acordaron fundar la Hermandad.'
from public.entities e
join public.places p on p.slug = 'iglesia-san-bartolome-sevilla'
where e.slug = 'fundacion-hermandad-san-esteban-1926'
on conflict (entity_id) do update set
  event_type = excluded.event_type, event_date = excluded.event_date,
  event_date_text = excluded.event_date_text, place_id = excluded.place_id,
  description = excluded.description;

insert into public.events (entity_id, event_type, event_date, event_date_text, place_id, description)
select e.id, 'Efeméride', null, '1926–2026', null,
  'Centenario fundacional. El programa de 2026 incluye el traslado del Señor a la Catedral el 21 de noviembre, la misa de Cristo Rey en la Catedral el día 22 y la procesión extraordinaria de regreso.'
from public.entities e
where e.slug = 'centenario-fundacional-san-esteban-1926-2026'
on conflict (entity_id) do update set
  event_type = excluded.event_type, event_date = excluded.event_date,
  event_date_text = excluded.event_date_text, place_id = excluded.place_id,
  description = excluded.description;

with seed(event_slug, target_slug, notes) as (
  values
    ('fundacion-hermandad-san-esteban-1926','san-esteban','Fundación de la corporación.'),
    ('centenario-fundacional-san-esteban-1926-2026','san-esteban','Efeméride de la corporación.'),
    ('centenario-fundacional-san-esteban-1926-2026','nuestro-padre-jesus-salud-buen-viaje-san-esteban','Titular que protagoniza los cultos y salidas extraordinarias de noviembre de 2026.')
)
insert into public.entity_relations (id, source_entity_id, relation_type, target_entity_id, notes, status)
select gen_random_uuid(), ev.id, 'involves', target.id, seed.notes, 'published'
from seed
join public.entities ev on ev.slug = seed.event_slug
join public.entities target on target.slug = seed.target_slug
where not exists (
  select 1 from public.entity_relations er
  where er.source_entity_id = ev.id and er.relation_type = 'involves'
    and er.target_entity_id = target.id and er.status <> 'archived'
);

-- -----------------------------------------------------------------------------
-- 11. Noviembre de 2026: traslado + procesión extraordinaria
-- -----------------------------------------------------------------------------
update public.outings
set
  brotherhood_entity_id = (select id from public.entities where slug = 'san-esteban'),
  origin_place_id = (select id from public.places where slug = 'santa-iglesia-catedral-sevilla'),
  destination_place_id = (select id from public.places where slug = 'iglesia-de-san-esteban-sevilla'),
  organizer_name = 'Fervorosa Hermandad y Cofradía de Nazarenos de Nuestro Padre Jesús de la Salud y Buen Viaje, María Santísima Madre de los Desamparados, San Juan de Ribera y Protomártir San Esteban',
  origin_text = 'Santa Iglesia Catedral de Sevilla',
  destination_text = 'Iglesia de San Esteban',
  updated_at = now()
where id = 'c42261be-f699-41d2-a51d-a79719d438cb'::uuid;

insert into public.outings (
  id, brotherhood_entity_id, outing_type, character, title, outing_date, year,
  municipality_id, origin_place_id, destination_place_id, reason,
  description, event_status, status, route_summary, public_notes,
  organizer_name, slug, reference_code, origin_text, destination_text
)
select gen_random_uuid(), b.id, 'Traslado', 'extraordinary',
  'Traslado de Nuestro Padre Jesús de la Salud y Buen Viaje a la Catedral',
  date '2026-11-21', 2026, 'ca85889c-21fe-4367-8477-a57656b25da4'::uuid,
  origin.id, destination.id, 'I centenario fundacional',
  'Traslado de Nuestro Padre Jesús de la Salud y Buen Viaje desde la Iglesia de San Esteban hasta la Catedral de Sevilla dentro de los actos del centenario fundacional.',
  'announced', 'published',
  'Traslado desde la Iglesia de San Esteban hasta la Santa Iglesia Catedral de Sevilla.',
  'El traslado está anunciado para el 21 de noviembre de 2026. El recorrido y horario definitivos se completarán cuando exista información oficial suficiente.',
  'Fervorosa Hermandad y Cofradía de Nazarenos de Nuestro Padre Jesús de la Salud y Buen Viaje, María Santísima Madre de los Desamparados, San Juan de Ribera y Protomártir San Esteban',
  'sevilla-salud-buen-viaje-traslado-catedral-2026',
  'SEVILLA-SALUD-BUEN-VIAJE-TRASLADO-CATEDRAL-2026',
  'Iglesia de San Esteban', 'Santa Iglesia Catedral de Sevilla'
from public.entities b
join public.places origin on origin.slug = 'iglesia-de-san-esteban-sevilla'
join public.places destination on destination.slug = 'santa-iglesia-catedral-sevilla'
where b.slug = 'san-esteban'
  and not exists (
    select 1 from public.outings where slug = 'sevilla-salud-buen-viaje-traslado-catedral-2026'
  );

insert into public.outing_entities (id, outing_id, entity_id, role, notes)
select gen_random_uuid(), 'c42261be-f699-41d2-a51d-a79719d438cb'::uuid, e.id,
  case e.entity_type when 'image' then 'processional_image' else 'processional_step' end,
  case e.entity_type
    when 'image' then 'Nuestro Padre Jesús de la Salud y Buen Viaje protagoniza la procesión extraordinaria del centenario.'
    else 'El Señor procesionará sobre su paso de salida, sin las figuras secundarias del misterio.'
  end
from public.entities e
where e.slug in ('nuestro-padre-jesus-salud-buen-viaje-san-esteban','paso-misterio-salud-buen-viaje-san-esteban')
  and not exists (
    select 1 from public.outing_entities oe
    where oe.outing_id = 'c42261be-f699-41d2-a51d-a79719d438cb'::uuid
      and oe.entity_id = e.id
      and oe.role = case e.entity_type when 'image' then 'processional_image' else 'processional_step' end
  );

insert into public.outing_entities (id, outing_id, entity_id, role, notes)
select gen_random_uuid(), o.id, i.id, 'processional_image',
  'Titular trasladado a la Catedral el 21 de noviembre de 2026.'
from public.outings o
join public.entities i on i.slug = 'nuestro-padre-jesus-salud-buen-viaje-san-esteban'
where o.slug = 'sevilla-salud-buen-viaje-traslado-catedral-2026'
  and not exists (
    select 1 from public.outing_entities oe
    where oe.outing_id = o.id and oe.entity_id = i.id and oe.role = 'processional_image'
  );

-- -----------------------------------------------------------------------------
-- 12. Fuentes oficiales y enlaces
-- -----------------------------------------------------------------------------
with seed(name, url, notes) as (
  values
    ('Fundación y centenario · Hermandad de San Esteban','https://www.hermandadsanesteban.org/97-anos-de-la-fundacion-de-la-hermandad-de-san-esteban/','Historia fundacional y primera estación de penitencia.'),
    ('Nuestro Padre Jesús de la Salud y Buen Viaje · Hermandad de San Esteban','https://www.hermandadsanesteban.org/ntro-padre-jesus-salud-y-buen-viaje/','Ficha oficial del titular cristífero.'),
    ('María Santísima Madre de los Desamparados · Hermandad de San Esteban','https://www.hermandadsanesteban.org/maria-stma-madre-desamparados/','Ficha oficial de la titular mariana.'),
    ('Paso de Cristo · Hermandad de San Esteban','https://www.hermandadsanesteban.org/paso-cristo/','Ficha patrimonial oficial del paso de misterio.'),
    ('Paso de Virgen · Hermandad de San Esteban','https://www.hermandadsanesteban.org/paso-virgen/','Ficha patrimonial oficial del paso de palio.'),
    ('Bandas de Música · Hermandad de San Esteban','https://www.hermandadsanesteban.org/bandas-musica/','Relación histórica oficial de acompañamientos musicales.'),
    ('Cultos 2026 · Hermandad de San Esteban','https://www.hermandadsanesteban.org/cultos/','Calendario oficial con traslado y procesión extraordinaria de noviembre de 2026.'),
    ('Reglas de la Hermandad de San Esteban','https://hermandadsanesteban.org/wp-content/uploads/2019/07/REGLAS.pdf','La Regla 114 describe la indumentaria de nazarenos y manigueteros.'),
    ('Ficha de la Cofradía 2018 · Hermandad de San Esteban','https://www.hermandadsanesteban.org/ficha-de-la-cofradia-2018-informacion-para-prensa-y-webs-cofrades/','Fuente complementaria para sede e indumentaria nazarena.')
)
insert into public.sources (id, name, url, source_type, author_or_publisher, accessed_at, notes)
select gen_random_uuid(), seed.name, seed.url, 'Fuente oficial', 'Hermandad de San Esteban',
  date '2026-08-22', seed.notes
from seed
where not exists (select 1 from public.sources s where s.url = seed.url);

with seed(url, entity_slug, scope, notes) as (
  values
    ('https://www.hermandadsanesteban.org/97-anos-de-la-fundacion-de-la-hermandad-de-san-esteban/','san-esteban','Identidad e historia','Fundación y primera estación de penitencia.'),
    ('https://www.hermandadsanesteban.org/97-anos-de-la-fundacion-de-la-hermandad-de-san-esteban/','fundacion-hermandad-san-esteban-1926','Acontecimiento','Fundación de 1926.'),
    ('https://www.hermandadsanesteban.org/ntro-padre-jesus-salud-y-buen-viaje/','nuestro-padre-jesus-salud-buen-viaje-san-esteban','Imagen','Autoría, cronología material e iconografía.'),
    ('https://www.hermandadsanesteban.org/maria-stma-madre-desamparados/','maria-santisima-madre-desamparados-san-esteban','Imagen','Autoría, bendición, cronología y tipología.'),
    ('https://www.hermandadsanesteban.org/paso-cristo/','paso-misterio-salud-buen-viaje-san-esteban','Paso','Historia material y configuración del paso.'),
    ('https://www.hermandadsanesteban.org/paso-virgen/','paso-palio-madre-desamparados-san-esteban','Paso','Orfebrería, bordados e historia material del palio.'),
    ('https://www.hermandadsanesteban.org/cultos/','centenario-fundacional-san-esteban-1926-2026','Acontecimiento','Programa de cultos y salidas de noviembre de 2026.')
)
insert into public.source_links (id, source_id, entity_id, scope, notes)
select gen_random_uuid(), s.id, e.id, seed.scope, seed.notes
from seed
join public.sources s on s.url = seed.url
join public.entities e on e.slug = seed.entity_slug
where not exists (
  select 1 from public.source_links sl
  where sl.source_id = s.id and sl.entity_id = e.id
    and coalesce(sl.scope,'') = coalesce(seed.scope,'')
);

insert into public.source_links (id, source_id, image_authorship_id, scope, notes)
select gen_random_uuid(), s.id, ia.id, 'Autoría', 'Fuente oficial de la imagen.'
from public.image_authorships ia
join public.entities i on i.id = ia.image_entity_id
join public.sources s on s.url = case i.slug
  when 'nuestro-padre-jesus-salud-buen-viaje-san-esteban'
    then 'https://www.hermandadsanesteban.org/ntro-padre-jesus-salud-y-buen-viaje/'
  else 'https://www.hermandadsanesteban.org/maria-stma-madre-desamparados/' end
where i.slug in ('nuestro-padre-jesus-salud-buen-viaje-san-esteban','maria-santisima-madre-desamparados-san-esteban')
  and ia.status <> 'archived'
  and not exists (
    select 1 from public.source_links sl
    where sl.source_id = s.id and sl.image_authorship_id = ia.id
  );

insert into public.source_links (id, source_id, step_phase_id, scope, notes)
select gen_random_uuid(), src.id, phase.id, 'Cronología patrimonial', 'Ficha patrimonial oficial del paso.'
from public.step_phases phase
join public.entities step on step.id = phase.step_entity_id
join public.sources src on src.url = case step.slug
  when 'paso-misterio-salud-buen-viaje-san-esteban' then 'https://www.hermandadsanesteban.org/paso-cristo/'
  else 'https://www.hermandadsanesteban.org/paso-virgen/' end
where step.slug in ('paso-misterio-salud-buen-viaje-san-esteban','paso-palio-madre-desamparados-san-esteban')
  and phase.status <> 'archived'
  and not exists (
    select 1 from public.source_links sl
    where sl.source_id = src.id and sl.step_phase_id = phase.id
  );

insert into public.source_links (id, source_id, entity_relation_id, scope, notes)
select gen_random_uuid(), src.id, er.id, 'Procedencia patrimonial',
  'La ficha oficial documenta la procedencia histórica.'
from public.entity_relations er
join public.entities step on step.id = er.source_entity_id
join public.sources src on src.url = case er.relation_type
  when 'acquired_from_brotherhood' then 'https://www.hermandadsanesteban.org/paso-cristo/'
  else 'https://www.hermandadsanesteban.org/paso-virgen/' end
where step.slug in ('paso-misterio-salud-buen-viaje-san-esteban','paso-palio-madre-desamparados-san-esteban')
  and er.relation_type in ('acquired_from_brotherhood','includes_elements_acquired_from_brotherhood')
  and not exists (
    select 1 from public.source_links sl
    where sl.source_id = src.id and sl.entity_relation_id = er.id
  );

insert into public.source_links (id, source_id, music_accompaniment_period_id, scope, notes)
select gen_random_uuid(), src.id, map.id, 'Acompañamiento musical',
  'Relación histórica oficial de bandas de la Hermandad.'
from public.music_accompaniment_periods map
join public.entities b on b.id = map.brotherhood_entity_id
join public.sources src on src.url = 'https://www.hermandadsanesteban.org/bandas-musica/'
where b.slug = 'san-esteban' and map.year_from = 2022 and map.is_current = true
  and map.status <> 'archived'
  and not exists (
    select 1 from public.source_links sl
    where sl.source_id = src.id and sl.music_accompaniment_period_id = map.id
  );

insert into public.source_links (id, source_id, brotherhood_habit_id, scope, notes)
select gen_random_uuid(), src.id, habit.id, 'Indumentaria', 'Regla 114.ª de la Hermandad.'
from public.brotherhood_habits habit
join public.entities b on b.id = habit.brotherhood_entity_id
join public.sources src on src.url = 'https://hermandadsanesteban.org/wp-content/uploads/2019/07/REGLAS.pdf'
where b.slug = 'san-esteban'
  and habit.name in ('Hábito de nazareno','Hábito de maniguetero')
  and habit.status <> 'archived'
  and not exists (
    select 1 from public.source_links sl
    where sl.source_id = src.id and sl.brotherhood_habit_id = habit.id
  );

insert into public.source_links (id, source_id, outing_id, scope, notes)
select gen_random_uuid(), src.id, o.id, 'Salida extraordinaria', 'Calendario oficial de cultos 2026.'
from public.outings o
join public.sources src on src.url = 'https://www.hermandadsanesteban.org/cultos/'
where o.slug in ('sevilla-salud-y-buen-viaje-2026','sevilla-salud-buen-viaje-traslado-catedral-2026')
  and not exists (
    select 1 from public.source_links sl
    where sl.source_id = src.id and sl.outing_id = o.id
  );

-- -----------------------------------------------------------------------------
-- 13. Validación final
-- -----------------------------------------------------------------------------
do $$
declare
  brotherhood_id uuid;
  lord_id uuid;
  virgin_id uuid;
  lord_step_id uuid;
  virgin_step_id uuid;
begin
  select id into brotherhood_id from public.entities where slug = 'san-esteban';
  select id into lord_id from public.entities where slug = 'nuestro-padre-jesus-salud-buen-viaje-san-esteban';
  select id into virgin_id from public.entities where slug = 'maria-santisima-madre-desamparados-san-esteban';
  select id into lord_step_id from public.entities where slug = 'paso-misterio-salud-buen-viaje-san-esteban';
  select id into virgin_step_id from public.entities where slug = 'paso-palio-madre-desamparados-san-esteban';

  if brotherhood_id is null or lord_id is null or virgin_id is null
     or lord_step_id is null or virgin_step_id is null then
    raise exception 'San Esteban: faltan entidades principales';
  end if;

  if not exists (
    select 1 from public.brotherhoods b
    where b.entity_id = brotherhood_id
      and b.canonical_see_place_id = (select id from public.places where slug = 'iglesia-de-san-esteban-sevilla')
      and b.current_procession_day = 'Martes Santo'
  ) then
    raise exception 'San Esteban: ficha de Hermandad incompleta';
  end if;

  if (
    select count(*) from public.brotherhood_images
    where brotherhood_entity_id = brotherhood_id
      and image_entity_id in (lord_id, virgin_id)
      and relation_type = 'titular' and status <> 'archived'
  ) <> 2 then
    raise exception 'San Esteban: deben quedar dos titulares procesionales enlazados';
  end if;

  if (
    select count(*) from public.brotherhood_steps
    where brotherhood_entity_id = brotherhood_id
      and step_entity_id in (lord_step_id, virgin_step_id)
      and relation_type = 'processional_step' and status <> 'archived'
  ) <> 2 then
    raise exception 'San Esteban: deben quedar dos pasos procesionales enlazados';
  end if;

  if (
    select count(*) from public.brotherhood_habits
    where brotherhood_entity_id = brotherhood_id
      and name in ('Hábito de nazareno','Hábito de maniguetero')
      and status = 'published'
  ) <> 2 then
    raise exception 'San Esteban: deben existir las dos variantes de hábito';
  end if;

  if (
    select count(*) from public.music_accompaniment_periods
    where brotherhood_entity_id = brotherhood_id
      and step_entity_id in (lord_step_id, virgin_step_id)
      and year_from = 2022 and is_current = true and status = 'published'
  ) <> 2 then
    raise exception 'San Esteban: faltan los dos acompañamientos musicales actuales';
  end if;

  if not exists (
    select 1 from public.entity_relations
    where source_entity_id = lord_step_id
      and target_entity_id = 'fca6ffda-bf99-436d-9a04-6de87d764670'::uuid
      and relation_type = 'acquired_from_brotherhood' and status = 'published'
  ) then
    raise exception 'San Esteban: falta la procedencia del paso del Señor desde el Cachorro';
  end if;

  if not exists (
    select 1 from public.entity_relations
    where source_entity_id = virgin_step_id
      and target_entity_id = 'aae6486d-3c23-4ffe-a7b3-17d737233155'::uuid
      and relation_type = 'includes_elements_acquired_from_brotherhood' and status = 'published'
  ) then
    raise exception 'San Esteban: falta la procedencia de los varales desde la Amargura';
  end if;

  if not exists (
    select 1 from public.outings
    where id = 'c42261be-f699-41d2-a51d-a79719d438cb'::uuid
      and brotherhood_entity_id = brotherhood_id
      and origin_place_id = (select id from public.places where slug = 'santa-iglesia-catedral-sevilla')
      and destination_place_id = (select id from public.places where slug = 'iglesia-de-san-esteban-sevilla')
  ) then
    raise exception 'San Esteban: la extraordinaria del 22/11 no quedó enlazada';
  end if;

  if (
    select count(*) from public.outing_entities
    where outing_id = 'c42261be-f699-41d2-a51d-a79719d438cb'::uuid
      and entity_id in (lord_id, lord_step_id)
  ) <> 2 then
    raise exception 'San Esteban: la extraordinaria debe relacionar al Señor y a su paso';
  end if;

  if not exists (
    select 1 from public.outings o
    join public.outing_entities oe on oe.outing_id = o.id
    where o.slug = 'sevilla-salud-buen-viaje-traslado-catedral-2026'
      and o.brotherhood_entity_id = brotherhood_id
      and oe.entity_id = lord_id and oe.role = 'processional_image'
  ) then
    raise exception 'San Esteban: falta el traslado del 21/11 vinculado al Señor';
  end if;

  if (
    select count(*) from public.step_phases sp
    where sp.step_entity_id in (lord_step_id, virgin_step_id) and sp.status = 'published'
  ) < 12 then
    raise exception 'San Esteban: la cronología patrimonial quedó incompleta';
  end if;
end
$$;

commit;
