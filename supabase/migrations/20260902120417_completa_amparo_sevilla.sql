-- Lote editorial · Real, Venerable e Ilustre Hermandad de Nuestra Señora del Amparo
-- Solo DML sobre el modelo First Edition existente. No introduce DDL ni RLS.

insert into public.sources (
  name, url, source_type, author_or_publisher, publication_date, accessed_at, notes
)
select v.name, v.url, v.source_type, v.publisher, v.publication_date,
       date '2026-09-02', v.notes
from (values
  ('Amparo · sitio oficial', 'https://hermandaddelamparo.com/', 'Web oficial', 'Hermandad de Nuestra Señora del Amparo', null::date, 'Identidad institucional y portal oficial.'),
  ('Amparo · historia', 'https://hermandaddelamparo.com/historia/', 'Web oficial', 'Hermandad de Nuestra Señora del Amparo', null::date, 'Historia, fundación, Reglas y principales hitos de la corporación.'),
  ('Amparo · Nuestra Señora del Amparo', 'https://hermandaddelamparo.com/nuestra-senora-del-amparo/', 'Web oficial', 'Hermandad de Nuestra Señora del Amparo', null::date, 'Autoría atribuida, descripción, iconografía y restauraciones de la titular.'),
  ('Amparo · paso procesional', 'https://hermandaddelamparo.com/paso-procesional/', 'Web oficial', 'Hermandad de Nuestra Señora del Amparo', null::date, 'Autoría, cronología y descripción patrimonial del paso.'),
  ('Amparo · capilla', 'https://hermandaddelamparo.com/capilla/', 'Web oficial', 'Hermandad de Nuestra Señora del Amparo', null::date, 'Ubicación de la capilla y del camarín dentro de la Real Parroquia de Santa María Magdalena.'),
  ('Amparo · calendario anual de cultos', 'https://hermandaddelamparo.com/calendario-anual-de-cultos/', 'Web oficial', 'Hermandad de Nuestra Señora del Amparo', null::date, 'Cultos ordinarios, Fiesta del Patrocinio y calendario anual.'),
  ('Amparo · horarios parroquiales y de misas', 'https://hermandaddelamparo.com/horarios-parroquiales-y-de-misas/', 'Web oficial', 'Hermandad de Nuestra Señora del Amparo', null::date, 'Horarios de apertura, misas parroquiales y cultos en la capilla.'),
  ('Amparo · contacto', 'https://hermandaddelamparo.com/contacto/', 'Web oficial', 'Hermandad de Nuestra Señora del Amparo', null::date, 'Denominación, sede y dirección postal oficiales.'),
  ('Amparo · programa de la Coronación Canónica', 'https://hermandaddelamparo.com/coronacion-canonica-proyecto-pastoral-y-formativo/', 'Web oficial', 'Hermandad de Nuestra Señora del Amparo', date '2025-10-28', 'Programa oficial, ceremonia de coronación y procesión del 8 de noviembre de 2026.'),
  ('Archidiócesis de Sevilla · Coronación Canónica del Amparo', 'https://www.archisevilla.org/el-arzobispo-coronara-a-la-virgen-del-amparo-en-noviembre-de-2026/', 'Fuente diocesana oficial', 'Archidiócesis de Sevilla', date '2025-06-28', 'Confirmación diocesana de la coronación canónica y de la presidencia del Arzobispo de Sevilla.'),
  ('101TV · salidas extraordinarias de Sevilla en 2026', 'https://www.101tv.es/sevilla-semana-santa/estas-son-las-salidas-extraordinarias-que-se-celebraran-en-sevilla-en-lo-que-resta-de-2026/', 'Medio de comunicación', '101TV Sevilla', null::date, 'Relación de salidas extraordinarias y acompañamientos musicales anunciados para 2026.'),
  ('Amparo · música procesional', 'https://hermandaddelamparo.com/musica-procesional/', 'Web oficial', 'Hermandad de Nuestra Señora del Amparo', null::date, 'Patrimonio musical dedicado a Nuestra Señora del Amparo.')
) as v(name, url, source_type, publisher, publication_date, notes)
where not exists (select 1 from public.sources s where s.url = v.url);

update public.sources
set accessed_at = date '2026-09-02'
where url in (
  'https://hermandaddelamparo.com/',
  'https://hermandaddelamparo.com/historia/',
  'https://hermandaddelamparo.com/nuestra-senora-del-amparo/',
  'https://hermandaddelamparo.com/paso-procesional/',
  'https://hermandaddelamparo.com/capilla/',
  'https://hermandaddelamparo.com/calendario-anual-de-cultos/',
  'https://hermandaddelamparo.com/horarios-parroquiales-y-de-misas/',
  'https://hermandaddelamparo.com/contacto/',
  'https://hermandaddelamparo.com/coronacion-canonica-proyecto-pastoral-y-formativo/',
  'https://www.archisevilla.org/el-arzobispo-coronara-a-la-virgen-del-amparo-en-noviembre-de-2026/',
  'https://www.101tv.es/sevilla-semana-santa/estas-son-las-salidas-extraordinarias-que-se-celebraran-en-sevilla-en-lo-que-resta-de-2026/',
  'https://hermandaddelamparo.com/musica-procesional/'
);

insert into public.places (municipality_id, name, slug, place_type, address, notes)
select m.id, 'Real Parroquia de Santa María Magdalena',
       'real-parroquia-santa-maria-magdalena-sevilla', 'Parroquia',
       'Calle Bailén, 5, 41001 Sevilla',
       'Sede canónica de la Hermandad de Nuestra Señora del Amparo; la capilla se sitúa en la nave del Evangelio.'
from public.municipalities m
where m.slug = 'sevilla'
  and not exists (
    select 1 from public.places p
    where p.slug = 'real-parroquia-santa-maria-magdalena-sevilla'
  );

update public.places
set opening_hours_text = E'Apertura\nLunes y viernes · 07:45–11:00 y 18:30–21:00\nMartes a jueves y sábados · 07:45–13:30 y 18:30–21:00 (invierno) · 07:45–11:00 y 19:30–21:00 (verano)\nDomingos y festivos · 08:45–14:00 y 18:30–21:00 (invierno) · 08:45–13:00 y 19:30–21:45 (verano)\n\nMisas\nLaborables · 08:00 (excepto sábados), 09:00, 10:00, 19:00 y 20:15\nDomingos y festivos · 09:00, 10:30, 12:00, 13:15 (invierno), 19:00 (invierno) y 20:15',
    opening_hours_verified_at = date '2026-09-02',
    updated_at = now()
where slug = 'real-parroquia-santa-maria-magdalena-sevilla';

insert into public.entities (entity_type, name, slug, summary, status)
values (
  'brotherhood',
  'Nuestra Señora del Amparo',
  'amparo-sevilla',
  'Hermandad de gloria de la Real Parroquia de Santa María Magdalena, fundada en 1735 y con Reglas aprobadas en 1736.',
  'published'
)
on conflict (slug) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  summary = excluded.summary,
  status = excluded.status,
  updated_at = now();

insert into public.brotherhoods (
  entity_id, official_name, popular_name, foundation_text, municipality_id,
  canonical_see_place_id, neighborhood, website_url, instagram_url,
  brotherhood_types, current_procession_day, history_text, notes
)
select h.id,
  'Real, Venerable e Ilustre Hermandad de Nuestra Señora del Amparo',
  'El Amparo',
  'Hermandad formada en 1735; primeras Reglas aprobadas el 22 de diciembre de 1736',
  m.id, p.id, 'La Magdalena', 'https://hermandaddelamparo.com/',
  'https://www.instagram.com/r_peccatorum/',
  array['Gloria']::text[], 'Segundo domingo de noviembre',
  'La devoción se vincula a la institución del Amparo de María Santísima y San José, dedicada desde el siglo XVI a la acogida de niños expósitos. En 1735 se formó la Hermandad para atender el culto de la imagen y sus primeras Reglas fueron aprobadas el 22 de diciembre de 1736. Tras el terremoto de Lisboa de 1755, la Parroquia y la corporación formularon un voto perpetuo de cultos en acción de gracias. La Hermandad acompañó a la Parroquia en sus traslados hasta quedar establecida en 1848 en el antiguo convento dominico de San Pablo. Durante el siglo XX impulsó el actual camarín, estrenó el paso procesional y participó en hitos como el Congreso Mariano de 1929, la procesión de 1946 y el Pregón de las Glorias de 1996.',
  'Nuestra Señora del Amparo es Patrona y Protectora de la feligresía de Santa María Magdalena. Su coronación canónica está fijada para el 8 de noviembre de 2026.'
from public.entities h
join public.municipalities m on m.slug = 'sevilla'
join public.places p on p.slug = 'real-parroquia-santa-maria-magdalena-sevilla'
where h.slug = 'amparo-sevilla'
on conflict (entity_id) do update set
  official_name = excluded.official_name,
  popular_name = excluded.popular_name,
  foundation_text = excluded.foundation_text,
  municipality_id = excluded.municipality_id,
  canonical_see_place_id = excluded.canonical_see_place_id,
  neighborhood = excluded.neighborhood,
  website_url = excluded.website_url,
  instagram_url = excluded.instagram_url,
  brotherhood_types = excluded.brotherhood_types,
  current_procession_day = excluded.current_procession_day,
  history_text = excluded.history_text,
  notes = excluded.notes;

insert into public.entity_locations (
  entity_id, place_id, municipality_id, location_type, is_current, notes, status
)
select h.id, p.id, p.municipality_id, 'canonical_see', true,
       'Sede canónica y capilla de la titular.', 'published'
from public.entities h
join public.places p on p.slug = 'real-parroquia-santa-maria-magdalena-sevilla'
where h.slug = 'amparo-sevilla'
  and not exists (
    select 1 from public.entity_locations el
    where el.entity_id = h.id and el.place_id = p.id and el.is_current
  );

with social_data as (
  select * from (values
    ('website', 'https://hermandaddelamparo.com/', 'Web oficial', 0),
    ('facebook', 'https://www.facebook.com/hermandaddelamparo', 'Facebook oficial', 10),
    ('x', 'https://x.com/r_peccatorum', 'X oficial', 20),
    ('instagram', 'https://www.instagram.com/r_peccatorum/', 'Instagram oficial', 30)
  ) as d(platform, url, label, display_order)
)
insert into public.entity_social_links (
  entity_id, platform, url, label, display_order, is_public
)
select h.id, d.platform, d.url, d.label, d.display_order, true
from social_data d
join public.entities h on h.slug = 'amparo-sevilla'
on conflict (entity_id, platform) do update set
  url = excluded.url,
  label = excluded.label,
  display_order = excluded.display_order,
  is_public = true,
  updated_at = now();

insert into public.entities (entity_type, name, slug, summary, status)
values
  ('image', 'Nuestra Señora del Amparo', 'nuestra-senora-amparo-sevilla', 'Imagen mariana del siglo XVI atribuida a Roque de Balduque, Patrona y Protectora de la feligresía de Santa María Magdalena.', 'published'),
  ('step', 'Paso procesional de Nuestra Señora del Amparo', 'paso-nuestra-senora-amparo-sevilla', 'Paso estrenado en 1927 y realizado en el taller de Antonio Corrales sobre proyecto de Montenegro.', 'published'),
  ('agent', 'Roque de Balduque', 'roque-de-balduque', 'Escultor flamenco activo en Sevilla en el siglo XVI, a quien se atribuye Nuestra Señora del Amparo.', 'published'),
  ('agent', 'Antonio de Alfián', 'antonio-de-alfian', 'Pintor del siglo XVI relacionado documentalmente con la policromía y el estofado de Nuestra Señora del Amparo.', 'published'),
  ('agent', 'Almudena Fernández García', 'almudena-fernandez-garcia', 'Conservadora-restauradora que intervino en la limpieza de Nuestra Señora del Amparo en 2015.', 'published'),
  ('agent', 'José Joaquín Fijo León', 'jose-joaquin-fijo-leon', 'Conservador-restaurador que intervino en la limpieza de Nuestra Señora del Amparo en 2015.', 'published')
on conflict (slug) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  summary = excluded.summary,
  status = excluded.status,
  updated_at = now();

insert into public.agents (entity_id, agent_kind, description)
select e.id, 'person', e.summary
from public.entities e
where e.slug in (
  'roque-de-balduque', 'antonio-de-alfian', 'almudena-fernandez-garcia',
  'jose-joaquin-fijo-leon'
)
on conflict (entity_id) do update set
  agent_kind = excluded.agent_kind,
  description = coalesce(public.agents.description, excluded.description);

insert into public.images (
  entity_id, image_type, execution_date_text, material, technique,
  current_condition, description, iconography, anatomical_type,
  is_dress_image, current_state_notes, notes
)
select i.id, 'Virgen con Niño', 'Siglo XVI', 'Madera',
       'Talla policromada y estofada', 'extant',
       'La Virgen aparece de pie, con túnica jacinto, toca marfileña y manto azul verdoso ricamente estofado. Sostiene al Niño Jesús sobre el brazo izquierdo.',
       'Virgen gloriosa con el Niño Jesús', 'Talla completa', false,
       'Restaurada entre 1986 y 1987 y sometida a una nueva limpieza en 2015.',
       'La autoría se conserva como atribución a Roque de Balduque. La fuente oficial relaciona indirectamente a Antonio de Alfián con el estofado y la pintura.'
from public.entities i
where i.slug = 'nuestra-senora-amparo-sevilla'
on conflict (entity_id) do update set
  image_type = excluded.image_type,
  execution_date_text = excluded.execution_date_text,
  material = excluded.material,
  technique = excluded.technique,
  current_condition = excluded.current_condition,
  description = excluded.description,
  iconography = excluded.iconography,
  anatomical_type = excluded.anatomical_type,
  is_dress_image = excluded.is_dress_image,
  current_state_notes = excluded.current_state_notes,
  notes = excluded.notes;

insert into public.brotherhood_images (
  brotherhood_entity_id, image_entity_id, relation_type, date_from_text, notes, status
)
select h.id, i.id, 'titular', 'Devoción documentada desde el siglo XVI; Hermandad desde 1735',
       'Única titular y centro devocional de la corporación.', 'published'
from public.entities h
join public.entities i on i.slug = 'nuestra-senora-amparo-sevilla'
where h.slug = 'amparo-sevilla'
  and not exists (
    select 1 from public.brotherhood_images bi
    where bi.brotherhood_entity_id = h.id and bi.image_entity_id = i.id
      and bi.relation_type = 'titular' and bi.date_to is null
  );

insert into public.image_authorships (
  image_entity_id, agent_entity_id, authorship_type, role_name,
  date_from_text, certainty, notes, status
)
select i.id, a.id, 'attributed_to', 'autor', 'Siglo XVI', 'attributed',
       'Atribución sostenida por la Hermandad y respaldada por documentación indirecta estudiada por José Roda Peña.', 'published'
from public.entities i
join public.entities a on a.slug = 'roque-de-balduque'
where i.slug = 'nuestra-senora-amparo-sevilla'
  and not exists (
    select 1 from public.image_authorships ia
    where ia.image_entity_id = i.id and ia.agent_entity_id = a.id
      and ia.authorship_type = 'attributed_to' and ia.role_name = 'autor'
  );

insert into public.image_authorships (
  image_entity_id, agent_entity_id, authorship_type, role_name,
  date_from_text, certainty, notes, status
)
select i.id, a.id, 'attributed_to', 'policromía y estofado', 'Siglo XVI', 'attributed',
       'Relación indirecta recogida por la fuente oficial; no se presenta como autoría plenamente documentada.', 'published'
from public.entities i
join public.entities a on a.slug = 'antonio-de-alfian'
where i.slug = 'nuestra-senora-amparo-sevilla'
  and not exists (
    select 1 from public.image_authorships ia
    where ia.image_entity_id = i.id and ia.agent_entity_id = a.id
      and ia.role_name = 'policromía y estofado'
  );

insert into public.steps (
  entity_id, step_type, current_condition, description, style, materials,
  carrier_system, execution_date_text, current_state_notes
)
select st.id, 'Gloria', 'preserved',
       'Paso procesional estrenado en 1927, realizado en el taller de Antonio Corrales con talla de Rafael y Luis Domínguez sobre proyecto de Montenegro. Integra una peana neoclásica tallada por Lucas de Prada en 1831 según diseño de Melchor Cano. Sus cuatro candelabros de guardabrisas rematan en faroles de orfebrería de Jorge Ferrer.',
       'Conjunto barroco en torno a una peana neoclásica', 'Madera tallada y dorada; orfebrería',
       'Costaleros', 'Estrenado en 1927',
       'Conjunto procesional vigente de Nuestra Señora del Amparo.'
from public.entities st
where st.slug = 'paso-nuestra-senora-amparo-sevilla'
on conflict (entity_id) do update set
  step_type = excluded.step_type,
  current_condition = excluded.current_condition,
  description = excluded.description,
  style = excluded.style,
  materials = excluded.materials,
  carrier_system = excluded.carrier_system,
  execution_date_text = excluded.execution_date_text,
  current_state_notes = excluded.current_state_notes;

insert into public.brotherhood_steps (
  brotherhood_entity_id, step_entity_id, relation_type, date_from_text, notes, status
)
select h.id, st.id, 'processional_step', 'Desde 1927',
       'Paso procesional actual de la titular.', 'published'
from public.entities h
join public.entities st on st.slug = 'paso-nuestra-senora-amparo-sevilla'
where h.slug = 'amparo-sevilla'
  and not exists (
    select 1 from public.brotherhood_steps bs
    where bs.brotherhood_entity_id = h.id and bs.step_entity_id = st.id
      and bs.relation_type = 'processional_step' and bs.date_to is null
  );

insert into public.image_steps (
  image_entity_id, step_entity_id, relation_type, date_from_text, notes, status
)
select i.id, st.id, 'processes_on', 'Desde 1927',
       'Imagen principal y única del paso procesional.', 'published'
from public.entities i
join public.entities st on st.slug = 'paso-nuestra-senora-amparo-sevilla'
where i.slug = 'nuestra-senora-amparo-sevilla'
  and not exists (
    select 1 from public.image_steps ist
    where ist.image_entity_id = i.id and ist.step_entity_id = st.id
      and ist.relation_type = 'processes_on'
  );

insert into public.heritage_interventions (
  target_entity_id, agent_entity_id, discipline, element_name,
  intervention_type, date_from_text, date_to_text, description, status
)
select i.id, a.id, 'Conservación y restauración', 'Nuestra Señora del Amparo',
       'Restauración', '1986', '1987',
       'Restauración de la imagen promovida con la colaboración de la Caja de Ahorros San Fernando de Sevilla.', 'published'
from public.entities i
join public.entities a on a.slug = 'jose-rodriguez-rivero-carrera'
where i.slug = 'nuestra-senora-amparo-sevilla'
  and not exists (
    select 1 from public.heritage_interventions hi
    where hi.target_entity_id = i.id and hi.agent_entity_id = a.id
      and hi.intervention_type = 'Restauración' and hi.date_from_text = '1986'
  );

with cleaning_agents as (
  select id from public.entities
  where slug in ('almudena-fernandez-garcia', 'jose-joaquin-fijo-leon')
)
insert into public.heritage_interventions (
  target_entity_id, agent_entity_id, discipline, element_name,
  intervention_type, date_from_text, description, status
)
select i.id, a.id, 'Conservación y restauración', 'Nuestra Señora del Amparo',
       'Limpieza', '2015', 'Limpieza de conservación de la imagen.', 'published'
from public.entities i
cross join cleaning_agents a
where i.slug = 'nuestra-senora-amparo-sevilla'
  and not exists (
    select 1 from public.heritage_interventions hi
    where hi.target_entity_id = i.id and hi.agent_entity_id = a.id
      and hi.intervention_type = 'Limpieza' and hi.date_from_text = '2015'
  );

with cult_data as (
  select * from (values
    ('Misa de Hermandad', 'Misa semanal en la capilla de Nuestra Señora del Amparo', 'Todos los lunes', 1::smallint, '20:15', true, 'Lunes', 10),
    ('Función Solemne', 'Función Solemne de la Mediación Universal de Nuestra Señora', 'Uno de los sábados de mayo, preferentemente el segundo', 5::smallint, null::text, true, 'Mayo', 20),
    ('Cultos del Patrocinio', 'Novena, Función Principal de Instituto y procesión de Nuestra Señora del Amparo', 'En torno al segundo domingo de noviembre', 11::smallint, null::text, true, 'Noviembre', 30),
    ('Misa Solemne', 'Misa Solemne de la Expectación de Nuestra Señora', '18 de diciembre', 12::smallint, null::text, true, '18 de diciembre', 40)
  ) as d(cult_type, title, date_rule, month, time_text, is_recurring, recurrence_label, display_order)
)
insert into public.cults (
  brotherhood_entity_id, image_entity_id, cult_type, title, date_rule,
  month, time_text, place_id, description, status, is_recurring,
  recurrence_label, display_order
)
select h.id, i.id, d.cult_type, d.title, d.date_rule,
       d.month, d.time_text, p.id,
       'Culto ordinario de la Hermandad de Nuestra Señora del Amparo.',
       'published', d.is_recurring, d.recurrence_label, d.display_order
from cult_data d
join public.entities h on h.slug = 'amparo-sevilla'
join public.entities i on i.slug = 'nuestra-senora-amparo-sevilla'
join public.places p on p.slug = 'real-parroquia-santa-maria-magdalena-sevilla'
where not exists (
  select 1 from public.cults c
  where c.brotherhood_entity_id = h.id and c.title = d.title and c.is_recurring
);

insert into public.outings (
  brotherhood_entity_id, outing_type, "character", title, outing_date,
  year, departure_time, municipality_id, origin_place_id, origin_text,
  destination_place_id, destination_text, reason, route_summary,
  description, public_notes, event_status, status, slug, reference_code,
  organizer_name
)
select h.id, 'Procesión extraordinaria', 'extraordinary',
       'Solemne procesión de la Coronación Canónica de Nuestra Señora del Amparo',
       date '2026-11-08', 2026, time '17:00', m.id, p.id, p.name,
       p.id, p.name, 'Coronación Canónica de Nuestra Señora del Amparo',
       'Visita al Excelentísimo Ayuntamiento de Sevilla y posterior procesión por las calles de la feligresía de Santa María Magdalena.',
       'Nuestra Señora del Amparo saldrá en solemne procesión durante la tarde de su coronación canónica.',
       'La Función Principal de Instituto y la ceremonia de coronación se celebrarán a las 10:00 en la Real Parroquia de Santa María Magdalena. El itinerario detallado, la hora de entrada y el acompañamiento musical de la procesión permanecen pendientes de anuncio oficial.',
       'announced', 'published', 'sevilla-amparo-2026', 'SEVILLA-AMPARO-2026',
       'Real, Venerable e Ilustre Hermandad de Nuestra Señora del Amparo'
from public.entities h
join public.municipalities m on m.slug = 'sevilla'
join public.places p on p.slug = 'real-parroquia-santa-maria-magdalena-sevilla'
where h.slug = 'amparo-sevilla'
  and not exists (
    select 1 from public.outings o where o.slug = 'sevilla-amparo-2026'
  );

update public.outings o
set brotherhood_entity_id = h.id,
    outing_type = 'Procesión extraordinaria',
    "character" = 'extraordinary',
    title = 'Solemne procesión de la Coronación Canónica de Nuestra Señora del Amparo',
    outing_date = date '2026-11-08',
    year = 2026,
    departure_time = time '17:00',
    municipality_id = m.id,
    origin_place_id = p.id,
    origin_text = p.name,
    destination_place_id = p.id,
    destination_text = p.name,
    reason = 'Coronación Canónica de Nuestra Señora del Amparo',
    route_summary = 'Visita al Excelentísimo Ayuntamiento de Sevilla y posterior procesión por las calles de la feligresía de Santa María Magdalena.',
    description = 'Nuestra Señora del Amparo saldrá en solemne procesión durante la tarde de su coronación canónica.',
    public_notes = 'La Función Principal de Instituto y la ceremonia de coronación se celebrarán a las 10:00 en la Real Parroquia de Santa María Magdalena. La procesión comenzará a las 17:00, visitará el Ayuntamiento y continuará por la feligresía. El itinerario detallado y la hora de entrada permanecen pendientes de anuncio oficial.',
    event_status = 'announced',
    status = 'published',
    reference_code = 'SEVILLA-AMPARO-2026',
    organizer_name = 'Real, Venerable e Ilustre Hermandad de Nuestra Señora del Amparo',
    updated_at = now()
from public.entities h, public.municipalities m, public.places p
where o.slug = 'sevilla-amparo-2026'
  and h.slug = 'amparo-sevilla'
  and m.slug = 'sevilla'
  and p.slug = 'real-parroquia-santa-maria-magdalena-sevilla';

insert into public.outing_entities (outing_id, entity_id, role, notes)
select o.id, i.id, 'processional_image',
       'Titular mariana coronada canónicamente en la mañana del 8 de noviembre de 2026.'
from public.outings o
join public.entities i on i.slug = 'nuestra-senora-amparo-sevilla'
where o.slug = 'sevilla-amparo-2026'
on conflict (outing_id, entity_id, role) do update set notes = excluded.notes;

with schedule_data as (
  select * from (values
    (1, 'Función Principal y Coronación Canónica', time '10:00', 'Real Parroquia de Santa María Magdalena', 'Ceremonia presidida por el Arzobispo de Sevilla.'),
    (2, 'Salida procesional', time '17:00', 'Real Parroquia de Santa María Magdalena', 'Inicio de la procesión extraordinaria.'),
    (3, 'Visita al Ayuntamiento de Sevilla', null::time, 'Excelentísimo Ayuntamiento de Sevilla', 'Visita prevista dentro del recorrido procesional antes de continuar por la feligresía.')
  ) as d(sequence_no, label, item_time, place_text, notes)
)
insert into public.outing_schedule_items (
  outing_id, sequence_no, label, item_date, item_time, time_text,
  place_id, place_text, notes
)
select o.id, d.sequence_no, d.label, date '2026-11-08', d.item_time,
       case when d.item_time is null then null else to_char(d.item_time, 'HH24:MI') end,
       case when d.sequence_no in (1, 2) then p.id else null end,
       d.place_text, d.notes
from schedule_data d
join public.outings o on o.slug = 'sevilla-amparo-2026'
join public.places p on p.slug = 'real-parroquia-santa-maria-magdalena-sevilla'
on conflict (outing_id, sequence_no) do update set
  label = excluded.label,
  item_date = excluded.item_date,
  item_time = excluded.item_time,
  time_text = excluded.time_text,
  place_id = excluded.place_id,
  place_text = excluded.place_text,
  notes = excluded.notes;

with entity_source_data as (
  select * from (values
    ('amparo-sevilla', 'https://hermandaddelamparo.com/', 'Identidad institucional'),
    ('amparo-sevilla', 'https://hermandaddelamparo.com/historia/', 'Historia y fundación'),
    ('nuestra-senora-amparo-sevilla', 'https://hermandaddelamparo.com/nuestra-senora-del-amparo/', 'Titular, iconografía y conservación'),
    ('paso-nuestra-senora-amparo-sevilla', 'https://hermandaddelamparo.com/paso-procesional/', 'Paso procesional'),
    ('amparo-sevilla', 'https://hermandaddelamparo.com/musica-procesional/', 'Patrimonio musical')
  ) as d(entity_slug, source_url, scope)
)
insert into public.source_links (source_id, entity_id, scope, notes)
select s.id, e.id, d.scope, 'Cierre documental del Amparo · 2 de septiembre de 2026'
from entity_source_data d
join public.entities e on e.slug = d.entity_slug
join public.sources s on s.url = d.source_url
where not exists (
  select 1 from public.source_links sl
  where sl.source_id = s.id and sl.entity_id = e.id and sl.scope = d.scope
);

insert into public.source_links (source_id, entity_location_id, scope, notes)
select s.id, el.id, 'Sede canónica y horarios',
       'Dirección y horarios verificados el 2 de septiembre de 2026.'
from public.sources s
join public.entities h on h.slug = 'amparo-sevilla'
join public.entity_locations el on el.entity_id = h.id and el.is_current
where s.url = 'https://hermandaddelamparo.com/horarios-parroquiales-y-de-misas/'
  and not exists (
    select 1 from public.source_links sl
    where sl.source_id = s.id and sl.entity_location_id = el.id
  );

with authorship_source_data as (
  select * from (values
    ('roque-de-balduque', 'autor'),
    ('antonio-de-alfian', 'policromía y estofado')
  ) as d(agent_slug, role_name)
)
insert into public.source_links (source_id, image_authorship_id, scope, notes)
select s.id, ia.id, 'Autoría atribuida',
       'La fuente oficial conserva la relación con prudencia documental.'
from authorship_source_data d
join public.entities i on i.slug = 'nuestra-senora-amparo-sevilla'
join public.entities a on a.slug = d.agent_slug
join public.image_authorships ia
  on ia.image_entity_id = i.id and ia.agent_entity_id = a.id and ia.role_name = d.role_name
join public.sources s on s.url = 'https://hermandaddelamparo.com/nuestra-senora-del-amparo/'
where not exists (
  select 1 from public.source_links sl
  where sl.source_id = s.id and sl.image_authorship_id = ia.id
);

insert into public.source_links (source_id, intervention_id, scope, notes)
select s.id, hi.id, 'Conservación de la titular',
       'Restauraciones e intervenciones recogidas por la ficha oficial.'
from public.heritage_interventions hi
join public.entities i on i.id = hi.target_entity_id and i.slug = 'nuestra-senora-amparo-sevilla'
join public.sources s on s.url = 'https://hermandaddelamparo.com/nuestra-senora-del-amparo/'
where not exists (
  select 1 from public.source_links sl
  where sl.source_id = s.id and sl.intervention_id = hi.id
);

insert into public.source_links (source_id, brotherhood_image_id, scope, notes)
select s.id, bi.id, 'Titular de la Hermandad',
       'Relación institucional y devocional documentada.'
from public.entities h
join public.brotherhood_images bi on bi.brotherhood_entity_id = h.id and bi.date_to is null
join public.sources s on s.url = 'https://hermandaddelamparo.com/nuestra-senora-del-amparo/'
where h.slug = 'amparo-sevilla'
  and not exists (
    select 1 from public.source_links sl
    where sl.source_id = s.id and sl.brotherhood_image_id = bi.id
  );

insert into public.source_links (source_id, brotherhood_step_id, scope, notes)
select s.id, bs.id, 'Paso procesional',
       'Relación vigente entre la Hermandad y su paso.'
from public.entities h
join public.brotherhood_steps bs on bs.brotherhood_entity_id = h.id and bs.date_to is null
join public.sources s on s.url = 'https://hermandaddelamparo.com/paso-procesional/'
where h.slug = 'amparo-sevilla'
  and not exists (
    select 1 from public.source_links sl
    where sl.source_id = s.id and sl.brotherhood_step_id = bs.id
  );

insert into public.source_links (source_id, image_step_id, scope, notes)
select s.id, ist.id, 'Imagen en su paso procesional',
       'Relación procesional vigente.'
from public.entities i
join public.image_steps ist on ist.image_entity_id = i.id
join public.sources s on s.url = 'https://hermandaddelamparo.com/paso-procesional/'
where i.slug = 'nuestra-senora-amparo-sevilla'
  and not exists (
    select 1 from public.source_links sl
    where sl.source_id = s.id and sl.image_step_id = ist.id
  );

insert into public.source_links (source_id, cult_id, scope, notes)
select s.id, c.id, 'Calendario anual de cultos',
       'Culto ordinario publicado por la Hermandad.'
from public.entities h
join public.cults c on c.brotherhood_entity_id = h.id and c.status = 'published'
join public.sources s on s.url = 'https://hermandaddelamparo.com/calendario-anual-de-cultos/'
where h.slug = 'amparo-sevilla'
  and not exists (
    select 1 from public.source_links sl
    where sl.source_id = s.id and sl.cult_id = c.id
  );

with outing_sources as (
  select url, scope from (values
    ('https://hermandaddelamparo.com/coronacion-canonica-proyecto-pastoral-y-formativo/', 'Programa oficial de la Coronación Canónica'),
    ('https://www.archisevilla.org/el-arzobispo-coronara-a-la-virgen-del-amparo-en-noviembre-de-2026/', 'Confirmación diocesana de la Coronación Canónica')
  ) as d(url, scope)
)
insert into public.source_links (source_id, outing_id, scope, notes)
select s.id, o.id, d.scope,
       'Fecha, ceremonia, horario de salida y alcance del recorrido confirmados.'
from outing_sources d
join public.sources s on s.url = d.url
join public.outings o on o.slug = 'sevilla-amparo-2026'
where not exists (
  select 1 from public.source_links sl
  where sl.source_id = s.id and sl.outing_id = o.id
);

insert into public.source_links (source_id, outing_music_assignment_id, scope, notes)
select s.id, oma.id, 'Acompañamiento musical de la salida extraordinaria',
       'Carmen de Salteras figura como acompañamiento tras el paso en la relación publicada para 2026.'
from public.sources s
join public.outings o on o.slug = 'sevilla-amparo-2026'
join public.outing_music_positions omp on omp.outing_id = o.id
join public.outing_music_assignments oma on oma.music_position_id = omp.id
join public.entities band on band.id = oma.band_entity_id and band.slug = 'carmen-de-salteras'
where s.url = 'https://www.101tv.es/sevilla-semana-santa/estas-son-las-salidas-extraordinarias-que-se-celebraran-en-sevilla-en-lo-que-resta-de-2026/'
  and not exists (
    select 1 from public.source_links sl
    where sl.source_id = s.id and sl.outing_music_assignment_id = oma.id
  );

do $$
declare
  v_image_count integer;
  v_step_count integer;
  v_cult_count integer;
  v_schedule_count integer;
  v_outing_source_count integer;
  v_music_position_count integer;
  v_music_source_count integer;
  v_invalid_links integer;
begin
  select count(*) into v_image_count
  from public.brotherhood_images bi
  join public.entities h on h.id = bi.brotherhood_entity_id
  where h.slug = 'amparo-sevilla' and bi.status = 'published' and bi.date_to is null;

  select count(*) into v_step_count
  from public.brotherhood_steps bs
  join public.entities h on h.id = bs.brotherhood_entity_id
  where h.slug = 'amparo-sevilla' and bs.status = 'published' and bs.date_to is null;

  select count(*) into v_cult_count
  from public.cults c
  join public.entities h on h.id = c.brotherhood_entity_id
  where h.slug = 'amparo-sevilla' and c.status = 'published';

  select count(*) into v_schedule_count
  from public.outing_schedule_items osi
  join public.outings o on o.id = osi.outing_id
  where o.slug = 'sevilla-amparo-2026';

  select count(*) into v_music_source_count
  from public.source_links sl
  join public.outing_music_assignments oma on oma.id = sl.outing_music_assignment_id
  join public.outing_music_positions omp on omp.id = oma.music_position_id
  join public.outings o on o.id = omp.outing_id
  join public.entities band on band.id = oma.band_entity_id
  where o.slug = 'sevilla-amparo-2026' and band.slug = 'carmen-de-salteras';

  select count(*) into v_outing_source_count
  from public.source_links sl
  join public.outings o on o.id = sl.outing_id
  where o.slug = 'sevilla-amparo-2026';

  select count(*) into v_music_position_count
  from public.outing_music_positions omp
  join public.outings o on o.id = omp.outing_id
  where o.slug = 'sevilla-amparo-2026';

  select count(*) into v_invalid_links
  from public.source_links
  where num_nonnulls(
    entity_id, outing_id, cult_id, intervention_id, heritage_update_id,
    editorial_content_id, music_accompaniment_period_id, march_dedication_id,
    march_recording_id, image_authorship_id, brotherhood_image_id, entity_location_id,
    entity_relation_id, step_phase_id, step_personnel_period_id, brotherhood_step_id,
    image_step_id, agent_name_id, agent_role_id, cult_occurrence_id,
    outing_music_position_id, outing_music_assignment_id, outing_series_id,
    band_premiere_id, brotherhood_habit_id
  ) <> 1;

  if v_image_count <> 1 then raise exception 'El Amparo no queda con una titular publicada'; end if;
  if v_step_count <> 1 then raise exception 'El Amparo no queda con un paso publicado'; end if;
  if v_cult_count <> 4 then raise exception 'El Amparo no queda con cuatro bloques de cultos publicados'; end if;
  if v_schedule_count <> 3 then raise exception 'La extraordinaria del Amparo no conserva coronación, salida y visita'; end if;
  if v_outing_source_count < 3 then raise exception 'La extraordinaria del Amparo no conserva sus fuentes oficiales y musical'; end if;
  if v_music_position_count <> 1 then raise exception 'La extraordinaria del Amparo no conserva su único acompañamiento musical'; end if;
  if v_music_source_count < 1 then raise exception 'Carmen de Salteras queda sin fuente vinculada a la extraordinaria'; end if;
  if v_invalid_links <> 0 then raise exception 'El lote deja vínculos de Fuente inválidos'; end if;
end $$;
