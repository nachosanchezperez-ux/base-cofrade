-- Hilo Cofrade · cierre documental HC-016 de Guadalupe de San Buenaventura
-- Corte editorial: 2026-09-13
-- Solo DML editorial. Sin DDL, nuevas tablas, RLS, arquitectura ni UX.

do $$
begin
  if (select count(*) from public.entities where slug = 'guadalupe-san-buenaventura' and entity_type = 'brotherhood' and status = 'published') <> 1 then
    raise exception 'La ficha canónica de Guadalupe de San Buenaventura no es unívoca';
  end if;

  if (select count(*) from public.entities where slug = 'paso-procesional-nuestra-senora-guadalupe-san-buenaventura' and entity_type = 'step' and status = 'published') <> 1 then
    raise exception 'El paso procesional previo de Guadalupe no está intacto';
  end if;

  if (select count(*) from public.places where slug = 'convento-san-buenaventura-sevilla') <> 1 then
    raise exception 'La sede canónica de San Buenaventura no es unívoca';
  end if;
end $$;

with source_data(name, url, source_type, publisher, publication_date, notes) as (
  values
    ('Guadalupe de Sevilla · web oficial', 'https://hermandaddeguadalupe.wordpress.com/', 'Web oficial', 'Franciscana Hermandad de Nuestra Señora de Guadalupe', null::date, 'Web institucional vigente, agenda y canal oficial en X.'),
    ('Guadalupe de Sevilla · imagen titular', 'https://hermandaddeguadalupe.wordpress.com/nuestra-senora-de-guadalupe/', 'Web oficial', 'Franciscana Hermandad de Nuestra Señora de Guadalupe', null::date, 'Tipología, autoría, material, iconografía y entronización de la imagen.'),
    ('Guadalupe de Sevilla · historia', 'https://hermandaddeguadalupe.wordpress.com/historia/', 'Web oficial', 'Franciscana Hermandad de Nuestra Señora de Guadalupe', null::date, 'Fundación, hitos institucionales y cronología histórica de la corporación.'),
    ('Guadalupe de Sevilla · cultos 2026', 'https://hermandaddeguadalupe.wordpress.com/cultos/', 'Web oficial', 'Franciscana Hermandad de Nuestra Señora de Guadalupe', null::date, 'Calendario anual de misas, funciones, besamanos, Vía Lucis y cultos de septiembre de 2026.'),
    ('Guadalupe de Sevilla · sede canónica', 'https://hermandaddeguadalupe.wordpress.com/sede-canonica/', 'Web oficial', 'Franciscana Hermandad de Nuestra Señora de Guadalupe', null::date, 'Ubicación de culto de la titular en la Iglesia Conventual de San Buenaventura.')
)
insert into public.sources(name, url, source_type, author_or_publisher, publication_date, accessed_at, notes)
select name, url, source_type, publisher, publication_date, date '2026-09-13', notes
from source_data d
where not exists (select 1 from public.sources s where s.url = d.url);

update public.sources s
set name = d.name,
    source_type = d.source_type,
    author_or_publisher = d.publisher,
    publication_date = d.publication_date,
    accessed_at = date '2026-09-13',
    notes = d.notes
from (values
  ('Guadalupe de Sevilla · web oficial', 'https://hermandaddeguadalupe.wordpress.com/', 'Web oficial', 'Franciscana Hermandad de Nuestra Señora de Guadalupe', null::date, 'Web institucional vigente, agenda y canal oficial en X.'),
  ('Guadalupe de Sevilla · imagen titular', 'https://hermandaddeguadalupe.wordpress.com/nuestra-senora-de-guadalupe/', 'Web oficial', 'Franciscana Hermandad de Nuestra Señora de Guadalupe', null::date, 'Tipología, autoría, material, iconografía y entronización de la imagen.'),
  ('Guadalupe de Sevilla · historia', 'https://hermandaddeguadalupe.wordpress.com/historia/', 'Web oficial', 'Franciscana Hermandad de Nuestra Señora de Guadalupe', null::date, 'Fundación, hitos institucionales y cronología histórica de la corporación.'),
  ('Guadalupe de Sevilla · cultos 2026', 'https://hermandaddeguadalupe.wordpress.com/cultos/', 'Web oficial', 'Franciscana Hermandad de Nuestra Señora de Guadalupe', null::date, 'Calendario anual de misas, funciones, besamanos, Vía Lucis y cultos de septiembre de 2026.'),
  ('Guadalupe de Sevilla · sede canónica', 'https://hermandaddeguadalupe.wordpress.com/sede-canonica/', 'Web oficial', 'Franciscana Hermandad de Nuestra Señora de Guadalupe', null::date, 'Ubicación de culto de la titular en la Iglesia Conventual de San Buenaventura.')
) d(name, url, source_type, publisher, publication_date, notes)
where s.url = d.url;

update public.entities
set name = 'Franciscana Hermandad de Nuestra Señora de Guadalupe',
    summary = 'Hermandad de Gloria fundada en 1959 por extremeños residentes en Sevilla, con sede en San Buenaventura y procesión anual de Nuestra Señora de Guadalupe en septiembre.',
    updated_at = now()
where slug = 'guadalupe-san-buenaventura';

update public.brotherhoods
set official_name = 'Franciscana Hermandad de Nuestra Señora de Guadalupe',
    popular_name = 'Guadalupe de San Buenaventura',
    foundation_text = '13 de julio de 1959',
    website_url = 'https://hermandaddeguadalupe.wordpress.com/',
    instagram_url = null,
    current_procession_day = 'Septiembre',
    history_text = 'La Hermandad fue fundada por extremeños residentes en Sevilla y sus reglas fueron aprobadas el 13 de julio de 1959. La imagen, obra de Juan Abascal Fuentes, fue entronizada en San Buenaventura el 28 de febrero de 1960. En abril de 1992 fue trasladada al Monasterio de Santa María de la Rábida para la exposición «Los franciscanos y el Nuevo Mundo» y desde septiembre de 1994 realiza su procesión anual. La corporación recibió la Carta de Hermandad y el título de Franciscana el 14 de marzo de 2007. La Virgen presidió el Pregón de las Glorias de Sevilla de 2017; en 2018 la Hermandad acogió el IX Encuentro Nacional de Hermandades de Guadalupe; en 2019 celebró el primer besamanos de la imagen y en 2023 recibió el premio Guadalupe-Hispanidad.',
    notes = 'Fundada por extremeños residentes en Sevilla, la corporación recibió el título de Franciscana en 2007. Nuestra Señora de Guadalupe, obra de Juan Abascal Fuentes entronizada en 1960, procesiona anualmente en septiembre desde 1994.'
where entity_id = (select id from public.entities where slug = 'guadalupe-san-buenaventura');

insert into public.entity_social_links(entity_id, platform, url, label, display_order, is_public)
select h.id, d.platform, d.url, d.label, d.display_order, true
from public.entities h
cross join (values
  ('website', 'https://hermandaddeguadalupe.wordpress.com/', 'Web oficial', 10::smallint),
  ('x', 'https://x.com/HdadGuadalupe', 'X · @HdadGuadalupe', 20::smallint)
) d(platform, url, label, display_order)
where h.slug = 'guadalupe-san-buenaventura'
on conflict(entity_id, platform) do update set
  url = excluded.url,
  label = excluded.label,
  display_order = excluded.display_order,
  is_public = true,
  updated_at = now();

insert into public.entity_locations(entity_id, place_id, municipality_id, location_type, date_from_text, is_current, notes, status)
select h.id, p.id, m.id, 'Sede canónica', 'Desde 1959', true, 'Iglesia Conventual de San Buenaventura, en la calle Carlos Cañal de Sevilla.', 'published'
from public.entities h
join public.places p on p.slug = 'convento-san-buenaventura-sevilla'
join public.municipalities m on m.slug = 'sevilla'
where h.slug = 'guadalupe-san-buenaventura'
  and not exists (
    select 1 from public.entity_locations el
    where el.entity_id = h.id and el.place_id = p.id and el.location_type = 'Sede canónica' and el.status <> 'archived'
  );

insert into public.source_links(source_id, entity_id, scope, notes)
select s.id, h.id, d.scope, d.notes
from (values
  ('https://hermandaddeguadalupe.wordpress.com/', 'Identidad y canales oficiales', 'Web institucional vigente y enlace oficial en X.'),
  ('https://hermandaddeguadalupe.wordpress.com/historia/', 'Historia institucional', 'Fundación, título franciscano y principales hitos históricos.'),
  ('https://hermandaddeguadalupe.wordpress.com/cultos/', 'Calendario de cultos 2026', 'Programación anual publicada por la propia Hermandad.')
) d(url, scope, notes)
join public.sources s on s.url = d.url
join public.entities h on h.slug = 'guadalupe-san-buenaventura'
where not exists (
  select 1 from public.source_links sl where sl.source_id = s.id and sl.entity_id = h.id and sl.scope = d.scope
);

insert into public.source_links(source_id, entity_location_id, scope, notes)
select s.id, el.id, 'Sede canónica vigente', 'La Hermandad y su titular reciben culto en San Buenaventura.'
from public.sources s
join public.entities h on h.slug = 'guadalupe-san-buenaventura'
join public.entity_locations el on el.entity_id = h.id and el.location_type = 'Sede canónica' and el.status <> 'archived'
where s.url = 'https://hermandaddeguadalupe.wordpress.com/sede-canonica/'
  and not exists (select 1 from public.source_links sl where sl.source_id = s.id and sl.entity_location_id = el.id);

-- Imagen titular, autoría y ubicación devocional.
insert into public.entities(entity_type, name, slug, summary, status)
select 'image', 'Nuestra Señora de Guadalupe', 'nuestra-senora-guadalupe-san-buenaventura', 'Escultura sedente de la Virgen de Guadalupe, tallada por Juan Abascal Fuentes en madera de encina y entronizada en San Buenaventura en 1960.', 'published'
where not exists (select 1 from public.entities where slug = 'nuestra-senora-guadalupe-san-buenaventura');

update public.entities
set name = 'Nuestra Señora de Guadalupe',
    summary = 'Escultura sedente de la Virgen de Guadalupe, tallada por Juan Abascal Fuentes en madera de encina y entronizada en San Buenaventura en 1960.',
    status = 'published',
    updated_at = now()
where slug = 'nuestra-senora-guadalupe-san-buenaventura';

insert into public.images(entity_id, image_type, execution_date_text, material, technique, current_condition, description, iconography, anatomical_type, is_dress_image, current_state_notes)
select i.id, 'Virgen de Gloria', '1960', 'Madera de encina', 'Talla policromada y vestida', 'extant',
       'Escultura sedente realizada como copia fiel de la imagen de la Patrona de Extremadura y Reina de la Hispanidad venerada en el Real Monasterio de Guadalupe.',
       'Virgen sedente con el Niño, corona de plata sobredorada, rostrillo y cetro, sobre peana dorada.',
       'Escultura sedente', true,
       'Entronizada el 28 de febrero de 1960 en la Iglesia Conventual de San Buenaventura.'
from public.entities i where i.slug = 'nuestra-senora-guadalupe-san-buenaventura'
on conflict(entity_id) do update set
  image_type = excluded.image_type,
  execution_date_text = excluded.execution_date_text,
  material = excluded.material,
  technique = excluded.technique,
  current_condition = excluded.current_condition,
  description = excluded.description,
  iconography = excluded.iconography,
  anatomical_type = excluded.anatomical_type,
  is_dress_image = excluded.is_dress_image,
  current_state_notes = excluded.current_state_notes;

insert into public.brotherhood_images(brotherhood_entity_id, image_entity_id, relation_type, date_from_text, notes, status)
select h.id, i.id, 'titular', 'Desde 1959; entronizada en 1960', 'Titular mariana y procesional de la corporación.', 'published'
from public.entities h join public.entities i on i.slug = 'nuestra-senora-guadalupe-san-buenaventura'
where h.slug = 'guadalupe-san-buenaventura'
  and not exists (
    select 1 from public.brotherhood_images bi
    where bi.brotherhood_entity_id = h.id and bi.image_entity_id = i.id and bi.relation_type = 'titular' and bi.status <> 'archived'
  );

update public.agents
set description = 'Escultor e imaginero sevillano, autor de Nuestra Señora de Guadalupe de San Buenaventura y de otras obras de imaginería religiosa.'
where entity_id = (select id from public.entities where slug = 'juan-abascal-fuentes');

insert into public.image_authorships(image_entity_id, agent_entity_id, authorship_type, role_name, date_from_text, certainty, notes, status)
select i.id, a.id, 'author', 'Escultor', '1960', 'documented', 'La web oficial identifica a Juan Abascal Fuentes como autor de la talla.', 'published'
from public.entities i join public.entities a on a.slug = 'juan-abascal-fuentes'
where i.slug = 'nuestra-senora-guadalupe-san-buenaventura'
  and not exists (
    select 1 from public.image_authorships ia
    where ia.image_entity_id = i.id and ia.agent_entity_id = a.id and ia.authorship_type = 'author' and ia.status <> 'archived'
  );

insert into public.entity_relations(source_entity_id, relation_type, target_entity_id, date_from_text, notes, status)
select a.id, 'author_of', i.id, '1960', 'Autoría documentada por la Hermandad de Guadalupe.', 'published'
from public.entities a join public.entities i on i.slug = 'nuestra-senora-guadalupe-san-buenaventura'
where a.slug = 'juan-abascal-fuentes'
  and not exists (
    select 1 from public.entity_relations er
    where er.source_entity_id = a.id and er.target_entity_id = i.id and er.relation_type = 'author_of' and er.status <> 'archived'
  );

insert into public.entity_locations(entity_id, place_id, municipality_id, custodian_entity_id, location_type, date_from, date_from_text, is_current, notes, status)
select i.id, p.id, m.id, h.id, 'Culto habitual', date '1960-02-28', 'Desde el 28 de febrero de 1960', true,
       'La imagen recibe culto en la capilla sacramental de la Iglesia Conventual de San Buenaventura.', 'published'
from public.entities i
join public.entities h on h.slug = 'guadalupe-san-buenaventura'
join public.places p on p.slug = 'convento-san-buenaventura-sevilla'
join public.municipalities m on m.slug = 'sevilla'
where i.slug = 'nuestra-senora-guadalupe-san-buenaventura'
  and not exists (
    select 1 from public.entity_locations el
    where el.entity_id = i.id and el.place_id = p.id and el.is_current and el.status <> 'archived'
  );

insert into public.source_links(source_id, entity_id, scope, notes)
select s.id, i.id, 'Imagen titular · autoría, material e iconografía', 'Descripción publicada por la propia Hermandad.'
from public.sources s join public.entities i on i.slug = 'nuestra-senora-guadalupe-san-buenaventura'
where s.url = 'https://hermandaddeguadalupe.wordpress.com/nuestra-senora-de-guadalupe/'
  and not exists (select 1 from public.source_links sl where sl.source_id = s.id and sl.entity_id = i.id and sl.scope = 'Imagen titular · autoría, material e iconografía');

insert into public.source_links(source_id, brotherhood_image_id, scope, notes)
select s.id, bi.id, 'Titularidad vigente', 'La Hermandad presenta a Nuestra Señora de Guadalupe como su titular.'
from public.sources s
join public.entities h on h.slug = 'guadalupe-san-buenaventura'
join public.brotherhood_images bi on bi.brotherhood_entity_id = h.id and bi.status <> 'archived'
join public.entities i on i.id = bi.image_entity_id and i.slug = 'nuestra-senora-guadalupe-san-buenaventura'
where s.url = 'https://hermandaddeguadalupe.wordpress.com/nuestra-senora-de-guadalupe/'
  and not exists (select 1 from public.source_links sl where sl.source_id = s.id and sl.brotherhood_image_id = bi.id);

insert into public.source_links(source_id, image_authorship_id, scope, notes)
select s.id, ia.id, 'Autoría documentada', 'Juan Abascal Fuentes figura como autor de la talla de 1960.'
from public.sources s
join public.entities i on i.slug = 'nuestra-senora-guadalupe-san-buenaventura'
join public.image_authorships ia on ia.image_entity_id = i.id and ia.status <> 'archived'
where s.url = 'https://hermandaddeguadalupe.wordpress.com/nuestra-senora-de-guadalupe/'
  and not exists (select 1 from public.source_links sl where sl.source_id = s.id and sl.image_authorship_id = ia.id);

insert into public.source_links(source_id, entity_location_id, scope, notes)
select s.id, el.id, 'Ubicación de culto', 'Capilla sacramental de San Buenaventura.'
from public.sources s
join public.entities i on i.slug = 'nuestra-senora-guadalupe-san-buenaventura'
join public.entity_locations el on el.entity_id = i.id and el.is_current and el.status <> 'archived'
where s.url = 'https://hermandaddeguadalupe.wordpress.com/sede-canonica/'
  and not exists (select 1 from public.source_links sl where sl.source_id = s.id and sl.entity_location_id = el.id);

-- Paso procesional: ficha técnica, autoría y relación con la titular.
update public.entities
set summary = 'Paso barroco de Nuestra Señora de Guadalupe, diseñado y ejecutado por el taller de Manuel Guzmán Bejarano en cedro real americano y dorado en pan de oro.',
    updated_at = now()
where slug = 'paso-procesional-nuestra-senora-guadalupe-san-buenaventura';

update public.steps
set current_condition = 'preserved',
    style = 'Barroco',
    materials = 'Madera de cedro real americano, terminada en pan de oro',
    description = 'Paso procesional de estilo barroco diseñado y ejecutado por el taller de Manuel Guzmán Bejarano.',
    current_state_notes = 'El frontal del paso formó parte en 2021 de la exposición «Glorias» organizada por el Consejo de Hermandades y Cofradías de Sevilla.'
where entity_id = (select id from public.entities where slug = 'paso-procesional-nuestra-senora-guadalupe-san-buenaventura');

insert into public.agents(entity_id, agent_kind, description)
select a.id, 'person', 'Tallista sevillano cuyo taller diseñó y ejecutó el paso procesional de Nuestra Señora de Guadalupe de San Buenaventura.'
from public.entities a where a.slug = 'manuel-guzman-bejarano'
on conflict(entity_id) do update set agent_kind = 'person', description = excluded.description;

insert into public.image_steps(image_entity_id, step_entity_id, relation_type, date_from_text, notes, status)
select i.id, st.id, 'processes_on', 'Relación vigente en 2026', 'Nuestra Señora de Guadalupe preside este paso en su salida anual de septiembre.', 'published'
from public.entities i join public.entities st on st.slug = 'paso-procesional-nuestra-senora-guadalupe-san-buenaventura'
where i.slug = 'nuestra-senora-guadalupe-san-buenaventura'
  and not exists (
    select 1 from public.image_steps ix
    where ix.image_entity_id = i.id and ix.step_entity_id = st.id and ix.relation_type = 'processes_on' and ix.status <> 'archived'
  );

insert into public.step_phases(step_entity_id, phase_name, phase_type, description, notes, status)
select st.id, 'Diseño, talla y dorado del paso', 'Ejecución',
       'Diseño y ejecución barroca en madera de cedro real americano, terminada en pan de oro.',
       'La fuente oficial consultada no precisa la fecha de ejecución del conjunto.', 'published'
from public.entities st where st.slug = 'paso-procesional-nuestra-senora-guadalupe-san-buenaventura'
  and not exists (
    select 1 from public.step_phases sp where sp.step_entity_id = st.id and sp.phase_name = 'Diseño, talla y dorado del paso' and sp.status <> 'archived'
  );

insert into public.step_phase_agents(step_phase_id, agent_entity_id, discipline, role_name, notes)
select sp.id, a.id, 'Talla y diseño', 'Taller autor', 'La Hermandad atribuye al taller de Manuel Guzmán Bejarano el diseño y la ejecución del paso.'
from public.step_phases sp
join public.entities st on st.id = sp.step_entity_id and st.slug = 'paso-procesional-nuestra-senora-guadalupe-san-buenaventura'
join public.entities a on a.slug = 'manuel-guzman-bejarano'
where sp.phase_name = 'Diseño, talla y dorado del paso'
  and not exists (
    select 1 from public.step_phase_agents spa where spa.step_phase_id = sp.id and spa.agent_entity_id = a.id and spa.discipline = 'Talla y diseño'
  );

insert into public.source_links(source_id, entity_id, scope, notes)
select s.id, st.id, 'Paso procesional · técnica y autoría', 'Descripción oficial publicada con motivo de la cesión del paso en 2025.'
from public.sources s join public.entities st on st.slug = 'paso-procesional-nuestra-senora-guadalupe-san-buenaventura'
where s.url = 'https://hermandaddeguadalupe.wordpress.com/2025/09/14/cesion-del-paso-procesional-a-la-hermandad-de-la-corona/'
  and not exists (select 1 from public.source_links sl where sl.source_id = s.id and sl.entity_id = st.id and sl.scope = 'Paso procesional · técnica y autoría');

insert into public.source_links(source_id, brotherhood_step_id, scope, notes)
select s.id, bs.id, 'Paso procesional · pertenencia y descripción', 'La Hermandad documenta como propio el paso cedido a la Hermandad de la Corona en 2025.'
from public.sources s
join public.entities h on h.slug = 'guadalupe-san-buenaventura'
join public.brotherhood_steps bs on bs.brotherhood_entity_id = h.id and bs.status <> 'archived'
where s.url = 'https://hermandaddeguadalupe.wordpress.com/2025/09/14/cesion-del-paso-procesional-a-la-hermandad-de-la-corona/'
  and not exists (select 1 from public.source_links sl where sl.source_id = s.id and sl.brotherhood_step_id = bs.id and sl.scope = 'Paso procesional · pertenencia y descripción');

insert into public.source_links(source_id, image_step_id, scope, notes)
select s.id, ix.id, 'Relación procesional', 'La titular procesiona sobre el paso propio de la Hermandad.'
from public.sources s
join public.entities i on i.slug = 'nuestra-senora-guadalupe-san-buenaventura'
join public.image_steps ix on ix.image_entity_id = i.id and ix.status <> 'archived'
where s.url = 'https://hermandaddeguadalupe.wordpress.com/2025/09/14/cesion-del-paso-procesional-a-la-hermandad-de-la-corona/'
  and not exists (select 1 from public.source_links sl where sl.source_id = s.id and sl.image_step_id = ix.id);

insert into public.source_links(source_id, step_phase_id, scope, notes)
select s.id, sp.id, 'Fase de ejecución del paso', 'Estilo, material, acabado y taller autor publicados por la Hermandad.'
from public.sources s
join public.entities st on st.slug = 'paso-procesional-nuestra-senora-guadalupe-san-buenaventura'
join public.step_phases sp on sp.step_entity_id = st.id and sp.phase_name = 'Diseño, talla y dorado del paso'
where s.url = 'https://hermandaddeguadalupe.wordpress.com/2025/09/14/cesion-del-paso-procesional-a-la-hermandad-de-la-corona/'
  and not exists (select 1 from public.source_links sl where sl.source_id = s.id and sl.step_phase_id = sp.id);

-- Cultos estables y próximas convocatorias de 2026.
update public.cults
set image_entity_id = (select id from public.entities where slug = 'nuestra-senora-guadalupe-san-buenaventura'),
    display_order = case title
      when 'Solemne triduo en honor de Nuestra Señora de Guadalupe' then 60
      when 'Función Principal en honor de Nuestra Señora de Guadalupe' then 70
      else display_order
    end
where brotherhood_entity_id = (select id from public.entities where slug = 'guadalupe-san-buenaventura');

with cult_data(cult_type, title, date_rule, month, time_text, description, is_recurring, recurrence_label, display_order, notes) as (
  values
    ('Misa de Hermandad', 'Misa mensual de Hermandad', 'Una celebración mensual según el calendario anual', null::smallint, '20:00', 'Misa mensual de la corporación. En 2026 se celebra en fechas publicadas de enero a diciembre.', true, 'Mensual', 10, 'La fecha concreta se documenta por edición anual.'),
    ('Función Solemne', 'Función por el aniversario de la hechura y entronización', 'En torno al aniversario del 28 de febrero; en 2026, el 15 de febrero', 2::smallint, '13:00', 'Función solemne conmemorativa de la hechura de la imagen y de su entronización en San Buenaventura.', true, 'Anual', 20, 'La fecha concreta puede ajustarse en cada edición.'),
    ('Besamanos', 'Devoto besamanos a Nuestra Señora de Guadalupe', '23 y 24 de mayo en 2026', 5::smallint, null::text, 'Besamanos de la titular durante dos jornadas conforme al calendario de 2026.', true, 'Anual según calendario', 30, 'La fuente oficial documenta expresamente la edición de 2026.'),
    ('Vía Lucis', 'Vía Lucis Mariano de Nuestra Señora de Guadalupe', '23 de mayo en 2026, después de la misa', 5::smallint, 'Tras la misa de las 20:00', 'Rezo del Vía Lucis Mariano después de la misa de Hermandad.', true, 'Anual según calendario', 40, 'La fuente oficial documenta expresamente la edición de 2026.'),
    ('Función Solemne', 'Función por la fiesta popular de la Virgen de Guadalupe', '8 de septiembre', 9::smallint, '20:00', 'Solemne función en la fiesta popular de Nuestra Señora de Guadalupe.', true, 'Anual', 50, null::text),
    ('Misa de difuntos', 'Misa por los hermanos difuntos', 'Según calendario anual; en 2026, el 14 de noviembre', 11::smallint, '20:00', 'Misa de Hermandad por los hermanos difuntos.', true, 'Anual', 80, 'La fecha concreta se documenta por edición anual.'),
    ('Misa votiva', 'Misa por las personas afectadas por el cáncer', 'Según calendario anual; en 2026, el 5 de diciembre', 12::smallint, '20:00', 'Celebración por las personas que luchan contra el cáncer y por quienes las acompañan.', true, 'Anual', 90, 'La fecha concreta se documenta por edición anual.')
)
insert into public.cults(brotherhood_entity_id, image_entity_id, cult_type, title, date_rule, month, time_text, place_id, description, status, is_recurring, recurrence_label, display_order, notes)
select h.id, i.id, d.cult_type, d.title, d.date_rule, d.month, d.time_text, p.id, d.description, 'published', d.is_recurring, d.recurrence_label, d.display_order, d.notes
from cult_data d
join public.entities h on h.slug = 'guadalupe-san-buenaventura'
join public.entities i on i.slug = 'nuestra-senora-guadalupe-san-buenaventura'
join public.places p on p.slug = 'convento-san-buenaventura-sevilla'
where not exists (
  select 1 from public.cults c where c.brotherhood_entity_id = h.id and c.title = d.title and c.status <> 'archived'
);

with future_dates(title, start_date) as (
  values
    ('Misa mensual de Hermandad', date '2026-10-10'),
    ('Misa mensual de Hermandad', date '2026-11-07'),
    ('Misa mensual de Hermandad', date '2026-12-05'),
    ('Misa por los hermanos difuntos', date '2026-11-14'),
    ('Misa por las personas afectadas por el cáncer', date '2026-12-05')
)
insert into public.cult_occurrences(cult_id, year, start_date, end_date, place_id, event_status, status, notes)
select c.id, 2026, d.start_date, d.start_date, p.id, 'announced', 'published', 'Convocatoria incluida en el calendario oficial de cultos de 2026.'
from future_dates d
join public.entities h on h.slug = 'guadalupe-san-buenaventura'
join public.cults c on c.brotherhood_entity_id = h.id and c.title = d.title and c.status <> 'archived'
join public.places p on p.slug = 'convento-san-buenaventura-sevilla'
where not exists (
  select 1 from public.cult_occurrences co where co.cult_id = c.id and co.start_date = d.start_date and co.status <> 'archived'
);

insert into public.cult_occurrence_days(cult_occurrence_id, day_number, day_label, celebration_date, start_time, time_text, place_id)
select co.id, 1, 'Celebración', co.start_date, time '20:00', '20:00', co.place_id
from public.cult_occurrences co
join public.cults c on c.id = co.cult_id
join public.entities h on h.id = c.brotherhood_entity_id and h.slug = 'guadalupe-san-buenaventura'
where co.year = 2026 and co.start_date in (date '2026-10-10', date '2026-11-07', date '2026-11-14', date '2026-12-05')
  and c.title in ('Misa mensual de Hermandad', 'Misa por los hermanos difuntos', 'Misa por las personas afectadas por el cáncer')
  and not exists (select 1 from public.cult_occurrence_days cod where cod.cult_occurrence_id = co.id and cod.day_number = 1);

insert into public.source_links(source_id, cult_id, scope, notes)
select s.id, c.id, 'Culto y calendario 2026', 'Culto y fecha publicados en el calendario oficial de la Hermandad.'
from public.sources s
join public.entities h on h.slug = 'guadalupe-san-buenaventura'
join public.cults c on c.brotherhood_entity_id = h.id and c.status <> 'archived'
where s.url = 'https://hermandaddeguadalupe.wordpress.com/cultos/'
  and not exists (select 1 from public.source_links sl where sl.source_id = s.id and sl.cult_id = c.id);

insert into public.source_links(source_id, cult_occurrence_id, scope, notes)
select s.id, co.id, 'Edición 2026', 'Fecha y horario publicados por la Hermandad.'
from public.sources s
join public.entities h on h.slug = 'guadalupe-san-buenaventura'
join public.cults c on c.brotherhood_entity_id = h.id
join public.cult_occurrences co on co.cult_id = c.id and co.year = 2026 and co.start_date >= date '2026-10-10'
where s.url = 'https://hermandaddeguadalupe.wordpress.com/cultos/'
  and not exists (select 1 from public.source_links sl where sl.source_id = s.id and sl.cult_occurrence_id = co.id);

-- Hitos históricos verificables que alimentan la cronología pública.
with event_data(slug, name, summary, event_type, event_date, event_date_text, description, location_text) as (
  values
    ('entronizacion-guadalupe-san-buenaventura-1960', 'Entronización de Nuestra Señora de Guadalupe en San Buenaventura', 'La imagen fue entronizada el 28 de febrero de 1960 en un solemne pontifical presidido por el cardenal Bueno Monreal.', 'Entronización', date '1960-02-28', '28 de febrero de 1960', 'Entronización de la imagen en la Iglesia Conventual de San Buenaventura.', 'Iglesia Conventual de San Buenaventura'),
    ('exposicion-rabida-guadalupe-sevilla-1992', 'Nuestra Señora de Guadalupe en la exposición de La Rábida', 'La imagen fue trasladada en abril de 1992 al Monasterio de Santa María de la Rábida para la exposición «Los franciscanos y el Nuevo Mundo».', 'Exposición', null::date, 'Abril de 1992', 'Traslado temporal de la titular al Monasterio de Santa María de la Rábida con motivo de una exposición.', 'Monasterio de Santa María de la Rábida'),
    ('titulo-franciscana-guadalupe-sevilla-2007', 'Concesión del título de Franciscana', 'La Curia Provincial concedió a la corporación la Carta de Hermandad y el título de Franciscana el 14 de marzo de 2007.', 'Hito institucional', date '2007-03-14', '14 de marzo de 2007', 'Concesión de la Carta de Hermandad y del título de Franciscana.', 'Sevilla'),
    ('premio-guadalupe-hispanidad-2023', 'Premio Guadalupe-Hispanidad 2023', 'La Hermandad recibió el premio Guadalupe-Hispanidad 2023 por mantener y acrecentar en Sevilla la devoción a la Virgen de Guadalupe.', 'Reconocimiento', date '2023-10-07', '7 de octubre de 2023', 'Entrega del premio Guadalupe-Hispanidad 2023 en el Real Monasterio de Santa María de Guadalupe.', 'Real Monasterio de Santa María de Guadalupe')
)
insert into public.entities(entity_type, name, slug, summary, status)
select 'event', d.name, d.slug, d.summary, 'published'
from event_data d
where not exists (select 1 from public.entities e where e.slug = d.slug);

with event_data(slug, event_type, event_date, event_date_text, description, location_text) as (
  values
    ('entronizacion-guadalupe-san-buenaventura-1960', 'Entronización', date '1960-02-28', '28 de febrero de 1960', 'Entronización de la imagen en la Iglesia Conventual de San Buenaventura.', 'Iglesia Conventual de San Buenaventura'),
    ('exposicion-rabida-guadalupe-sevilla-1992', 'Exposición', null::date, 'Abril de 1992', 'Traslado temporal de la titular al Monasterio de Santa María de la Rábida con motivo de una exposición.', 'Monasterio de Santa María de la Rábida'),
    ('titulo-franciscana-guadalupe-sevilla-2007', 'Hito institucional', date '2007-03-14', '14 de marzo de 2007', 'Concesión de la Carta de Hermandad y del título de Franciscana.', 'Sevilla'),
    ('premio-guadalupe-hispanidad-2023', 'Reconocimiento', date '2023-10-07', '7 de octubre de 2023', 'Entrega del premio Guadalupe-Hispanidad 2023 en el Real Monasterio de Santa María de Guadalupe.', 'Real Monasterio de Santa María de Guadalupe')
)
insert into public.events(entity_id, event_type, event_date, event_date_text, place_id, description, event_category, brotherhood_entity_id, municipality_id, event_status, location_text)
select ev.id, d.event_type, d.event_date, d.event_date_text,
       case when d.slug = 'entronizacion-guadalupe-san-buenaventura-1960' then p.id else null end,
       d.description, 'historical', h.id, m.id, 'held', d.location_text
from event_data d
join public.entities ev on ev.slug = d.slug
join public.entities h on h.slug = 'guadalupe-san-buenaventura'
join public.municipalities m on m.slug = 'sevilla'
join public.places p on p.slug = 'convento-san-buenaventura-sevilla'
where not exists (select 1 from public.events e where e.entity_id = ev.id);

insert into public.entity_relations(source_entity_id, relation_type, target_entity_id, date_from_text, notes, status)
select ev.id, 'involves', h.id, coalesce(e.event_date_text, extract(year from e.event_date)::text), 'Acontecimiento histórico de la Hermandad de Guadalupe.', 'published'
from public.entities ev
join public.events e on e.entity_id = ev.id
join public.entities h on h.slug = 'guadalupe-san-buenaventura'
where ev.slug in ('entronizacion-guadalupe-san-buenaventura-1960', 'exposicion-rabida-guadalupe-sevilla-1992', 'titulo-franciscana-guadalupe-sevilla-2007', 'premio-guadalupe-hispanidad-2023')
  and not exists (
    select 1 from public.entity_relations er where er.source_entity_id = ev.id and er.target_entity_id = h.id and er.relation_type = 'involves' and er.status <> 'archived'
  );

insert into public.entity_relations(source_entity_id, relation_type, target_entity_id, date_from_text, notes, status)
select ev.id, 'involves', i.id, coalesce(e.event_date_text, extract(year from e.event_date)::text), 'Acontecimiento histórico vinculado a Nuestra Señora de Guadalupe.', 'published'
from public.entities ev
join public.events e on e.entity_id = ev.id
join public.entities i on i.slug = 'nuestra-senora-guadalupe-san-buenaventura'
where ev.slug in ('entronizacion-guadalupe-san-buenaventura-1960', 'exposicion-rabida-guadalupe-sevilla-1992', 'premio-guadalupe-hispanidad-2023')
  and not exists (
    select 1 from public.entity_relations er where er.source_entity_id = ev.id and er.target_entity_id = i.id and er.relation_type = 'involves' and er.status <> 'archived'
  );

insert into public.source_links(source_id, entity_id, scope, notes)
select s.id, ev.id, 'Hito histórico', 'Acontecimiento recogido en la historia oficial de la Hermandad.'
from public.sources s
join public.entities ev on ev.slug in ('entronizacion-guadalupe-san-buenaventura-1960', 'exposicion-rabida-guadalupe-sevilla-1992', 'titulo-franciscana-guadalupe-sevilla-2007', 'premio-guadalupe-hispanidad-2023')
where s.url = 'https://hermandaddeguadalupe.wordpress.com/historia/'
  and not exists (select 1 from public.source_links sl where sl.source_id = s.id and sl.entity_id = ev.id);

-- Refuerza con la fuente oficial la participación ya registrada en el Pregón de las Glorias de 2017.
insert into public.source_links(source_id, entity_id, scope, notes)
select s.id, ev.id, 'Pregón de las Glorias 2017', 'La historia oficial confirma que la Virgen presidió el pregón en la Catedral el 22 de abril de 2017.'
from public.sources s join public.entities ev on ev.slug = 'pregon-glorias-sevilla-2017'
where s.url = 'https://hermandaddeguadalupe.wordpress.com/historia/'
  and not exists (select 1 from public.source_links sl where sl.source_id = s.id and sl.entity_id = ev.id and sl.scope = 'Pregón de las Glorias 2017');

do $$
declare
  h_id uuid;
  i_id uuid;
  st_id uuid;
begin
  select id into h_id from public.entities where slug = 'guadalupe-san-buenaventura';
  select id into i_id from public.entities where slug = 'nuestra-senora-guadalupe-san-buenaventura';
  select id into st_id from public.entities where slug = 'paso-procesional-nuestra-senora-guadalupe-san-buenaventura';

  if (select count(*) from public.brotherhood_images where brotherhood_entity_id = h_id and image_entity_id = i_id and status = 'published') <> 1 then
    raise exception 'La titular no quedó vinculada de forma unívoca';
  end if;
  if (select count(*) from public.image_authorships where image_entity_id = i_id and status = 'published') <> 1 then
    raise exception 'La autoría de la titular no quedó documentada';
  end if;
  if (select count(*) from public.image_steps where image_entity_id = i_id and step_entity_id = st_id and status = 'published') <> 1 then
    raise exception 'La relación entre la titular y el paso no quedó publicada';
  end if;
  if (select count(*) from public.step_phases where step_entity_id = st_id and status = 'published') <> 1 then
    raise exception 'La autoría técnica del paso no quedó estructurada';
  end if;
  if (select count(*) from public.cults where brotherhood_entity_id = h_id and status = 'published') <> 9 then
    raise exception 'El catálogo de cultos de Guadalupe no quedó completo';
  end if;
  if (select count(*) from public.events where brotherhood_entity_id = h_id and event_category = 'historical') < 5 then
    raise exception 'La cronología histórica de Guadalupe quedó incompleta';
  end if;
  if (select count(*) from public.entity_social_links where entity_id = h_id and is_public) <> 2 then
    raise exception 'Los canales oficiales de Guadalupe no quedaron completos';
  end if;
end $$;
