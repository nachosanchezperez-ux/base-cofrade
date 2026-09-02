-- Lote editorial · Hermandad Sacramental de Padre Pío
-- Solo DML sobre el modelo First Edition existente. No introduce DDL ni RLS.

insert into public.sources (
  name, url, source_type, author_or_publisher, publication_date, accessed_at, notes
)
select v.name, v.url, v.source_type, v.publisher, v.publication_date,
       date '2026-09-02', v.notes
from (values
  ('Padre Pío · sitio oficial', 'https://hermandadpadrepio.com/', 'Web oficial', 'Hermandad de Padre Pío', null::date, 'Identidad institucional, escudo y canales oficiales.'),
  ('Padre Pío · historia', 'https://hermandadpadrepio.com/hermandad/historia/', 'Web oficial', 'Hermandad de Padre Pío', null::date, 'Historia institucional, hitos fundacionales y evolución de la estación de penitencia.'),
  ('Padre Pío · Santísimo Sacramento', 'https://hermandadpadrepio.com/sagrados-titulares/santisimo-sacramento/', 'Web oficial', 'Hermandad de Padre Pío', null::date, 'Carácter sacramental y cultos eucarísticos de la corporación.'),
  ('Padre Pío · Santa Cruz en el Monte Calvario', 'https://hermandadpadrepio.com/sagrados-titulares/santa-cruz-en-el-monte-calvario/', 'Web oficial', 'Hermandad de Padre Pío', null::date, 'Origen de la devoción a la Santa Cruz e incorporación como titular en 2011.'),
  ('Padre Pío · Nuestro Padre Jesús de la Salud y Clemencia', 'https://hermandadpadrepio.com/sagrados-titulares/ntro-padre-jesus-de-la-salud-y-clemencia/', 'Web oficial', 'Hermandad de Padre Pío', null::date, 'Autoría, cronología, materiales, dimensiones e iconografía del titular cristífero.'),
  ('Padre Pío · Santísima Virgen Madre de la Divina Gracia', 'https://hermandadpadrepio.com/sagrados-titulares/stma-virgen-madre-de-la-divina-gracia/', 'Web oficial', 'Hermandad de Padre Pío', null::date, 'Autoría, cronología, dimensiones e intervenciones de la titular mariana.'),
  ('Padre Pío · San Juan de la Cruz', 'https://hermandadpadrepio.com/sagrados-titulares/san-juan-de-la-cruz/', 'Web oficial', 'Hermandad de Padre Pío', null::date, 'Titularidad de San Juan de la Cruz y procedencia del relicario.'),
  ('Padre Pío · ficha de la cofradía', 'https://hermandadpadrepio.com/cofradia/ficha-cofradia/', 'Web oficial', 'Hermandad de Padre Pío', null::date, 'Denominación oficial, pasos, capataces, cuadrillas y acompañamientos.'),
  ('Padre Pío · hábito nazareno', 'https://hermandadpadrepio.com/cofradia/habito-nazareno/', 'Web oficial', 'Hermandad de Padre Pío', null::date, 'Descripción completa del hábito penitencial conforme a la Regla 16.ª.'),
  ('Padre Pío · acompañamiento musical', 'https://hermandadpadrepio.com/comunicado-oficial-acompanamiento-musical/', 'Web oficial', 'Hermandad de Padre Pío', date '2024-11-13', 'Renovación de los acompañamientos del Señor para 2025 y 2026 y del palio para 2025.'),
  ('Padre Pío · agradecimiento del Sábado de Pasión 2026', 'https://hermandadpadrepio.com/carta-de-agradecimiento-por-el-pasado-sabado-de-pasion/', 'Web oficial', 'Hermandad de Padre Pío', date '2026-04-06', 'Confirmación de las formaciones musicales participantes en la estación de penitencia de 2026.'),
  ('Padre Pío · salida extraordinaria de la Divina Gracia', 'https://hermandadpadrepio.com/la-santisima-virgen-madre-de-la-divina-gracia-recorrera-las-calles-de-padre-pio-en-la-salida-extraordinaria-con-motivo-del-xxv-aniversario-de-la-parroquia/', 'Web oficial', 'Hermandad de Padre Pío', date '2026-07-23', 'Fecha, horario, motivo, itinerario y acompañamiento de la salida extraordinaria de octubre de 2026.'),
  ('Padre Pío · cordones y flecos de bellota del palio', 'https://hermandadpadrepio.com/estreno-de-nuevos-cordones-y-flecos-de-bellota-para-el-palio-de-la-santisima-virgen-madre-de-la-divina-gracia/', 'Web oficial', 'Hermandad de Padre Pío', date '2026-08-25', 'Estreno, donación, autoras y limpieza de las bambalinas del palio.'),
  ('Sábado de Pasión de 2026 · datos de interés', 'https://inriinformacion.com/2026/03/28/los-principales-datos-de-interes-del-sabado-de-pasion-de-2026/', 'Prensa especializada', 'INRI Información', date '2026-03-28', 'Contraste actualizado de capataces, acompañamientos y estado del nuevo paso del Señor.'),
  ('Parroquia del Buen Pastor y San Juan de la Cruz · ficha urbana', 'https://www.visitarsevilla.com/parroquias-buen-pastor-padre-pio-y-nuestra-senora-del-aguila-palmete/', 'Guía local', 'Visitar Sevilla', date '2026-07-28', 'Dirección y localización de la sede canónica en Padre Pío.')
) as v(name, url, source_type, publisher, publication_date, notes)
where not exists (select 1 from public.sources s where s.url = v.url);

update public.sources
set accessed_at = date '2026-09-02'
where url in (
  'https://hermandadpadrepio.com/',
  'https://hermandadpadrepio.com/hermandad/historia/',
  'https://hermandadpadrepio.com/sagrados-titulares/santisimo-sacramento/',
  'https://hermandadpadrepio.com/sagrados-titulares/santa-cruz-en-el-monte-calvario/',
  'https://hermandadpadrepio.com/sagrados-titulares/ntro-padre-jesus-de-la-salud-y-clemencia/',
  'https://hermandadpadrepio.com/sagrados-titulares/stma-virgen-madre-de-la-divina-gracia/',
  'https://hermandadpadrepio.com/sagrados-titulares/san-juan-de-la-cruz/',
  'https://hermandadpadrepio.com/cofradia/ficha-cofradia/',
  'https://hermandadpadrepio.com/cofradia/habito-nazareno/',
  'https://hermandadpadrepio.com/comunicado-oficial-acompanamiento-musical/',
  'https://hermandadpadrepio.com/carta-de-agradecimiento-por-el-pasado-sabado-de-pasion/',
  'https://hermandadpadrepio.com/la-santisima-virgen-madre-de-la-divina-gracia-recorrera-las-calles-de-padre-pio-en-la-salida-extraordinaria-con-motivo-del-xxv-aniversario-de-la-parroquia/',
  'https://hermandadpadrepio.com/estreno-de-nuevos-cordones-y-flecos-de-bellota-para-el-palio-de-la-santisima-virgen-madre-de-la-divina-gracia/',
  'https://inriinformacion.com/2026/03/28/los-principales-datos-de-interes-del-sabado-de-pasion-de-2026/',
  'https://www.visitarsevilla.com/parroquias-buen-pastor-padre-pio-y-nuestra-senora-del-aguila-palmete/'
);

insert into public.municipalities (name, slug, province, autonomous_community, country)
select 'San Fernando', 'san-fernando-cadiz', 'Cádiz', 'Andalucía', 'España'
where not exists (select 1 from public.municipalities where slug = 'san-fernando-cadiz');

insert into public.places (municipality_id, name, slug, place_type, address, notes)
select m.id, 'Parroquia del Buen Pastor y San Juan de la Cruz',
       'parroquia-buen-pastor-san-juan-cruz-padre-pio', 'Parroquia',
       'Ronda de la Doctora Oeste, 36, 41006 Sevilla',
       'Sede canónica de la Hermandad Sacramental de Padre Pío.'
from public.municipalities m
where m.slug = 'sevilla'
  and not exists (
    select 1 from public.places p
    where p.slug = 'parroquia-buen-pastor-san-juan-cruz-padre-pio'
  );

insert into public.entities (entity_type, name, slug, summary, status)
values (
  'brotherhood',
  'Padre Pío',
  'padre-pio-sevilla',
  'Hermandad sacramental y de penitencia del barrio de Padre Pío, erigida como Hermandad en 2005 y con estación de penitencia el Sábado de Pasión.',
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
  canonical_see_place_id, neighborhood, website_url, instagram_url, crest_path,
  brotherhood_types, current_procession_day, history_text, notes
)
select e.id,
  'Hermandad Sacramental de la Santa Cruz en el Monte Calvario y Cofradía de Nazarenos de Ntro. Padre Jesús de la Salud y Clemencia, Stma. Virgen Madre de la Divina Gracia y San Juan de la Cruz',
  'Padre Pío',
  'Germen en 1978; Agrupación Parroquial en 1986; Hermandad desde el 4 de enero de 2005',
  m.id, p.id, 'Padre Pío', 'https://hermandadpadrepio.com/',
  'https://www.instagram.com/hdadpadrepio/', '/escudos/padre-pio.png',
  array['Sacramental','Penitencia']::text[], 'Sábado de Pasión',
  'La corporación hunde sus raíces en la Peña Flamenca Juan Antonio Chacón y su cruz de mayo de 1978. La Agrupación Parroquial se fundó en 1986; incorporó a la Virgen Madre de la Divina Gracia en 1987, realizó su primera salida el Sábado de Pasión de 1993 e incorporó a Nuestro Padre Jesús de la Salud y Clemencia en 1996. Fue erigida como Hermandad el 4 de enero de 2005, comenzó a realizar estación a la Parroquia de Nuestra Señora de los Dolores del Cerro del Águila en 2008 y trasladó su estación del Viernes de Dolores al Sábado de Pasión en 2016.',
  'La Santa Cruz en el Monte Calvario es titular desde 2011 y recuerda el germen de la cruz de mayo. El carácter sacramental y la titularidad de San Juan de la Cruz forman parte de la denominación y de las Reglas de la corporación.'
from public.entities e
join public.municipalities m on m.slug = 'sevilla'
join public.places p on p.slug = 'parroquia-buen-pastor-san-juan-cruz-padre-pio'
where e.slug = 'padre-pio-sevilla'
on conflict (entity_id) do update set
  official_name = excluded.official_name,
  popular_name = excluded.popular_name,
  foundation_text = excluded.foundation_text,
  municipality_id = excluded.municipality_id,
  canonical_see_place_id = excluded.canonical_see_place_id,
  neighborhood = excluded.neighborhood,
  website_url = excluded.website_url,
  instagram_url = excluded.instagram_url,
  crest_path = excluded.crest_path,
  brotherhood_types = excluded.brotherhood_types,
  current_procession_day = excluded.current_procession_day,
  history_text = excluded.history_text,
  notes = excluded.notes;

insert into public.entity_locations (
  entity_id, place_id, municipality_id, location_type, is_current, notes, status
)
select e.id, p.id, p.municipality_id, 'canonical_see', true,
       'Sede canónica actual.', 'published'
from public.entities e
join public.places p on p.slug = 'parroquia-buen-pastor-san-juan-cruz-padre-pio'
where e.slug = 'padre-pio-sevilla'
  and not exists (
    select 1 from public.entity_locations el
    where el.entity_id = e.id and el.place_id = p.id and el.is_current
  );

with social_data as (
  select * from (values
    ('website', 'https://hermandadpadrepio.com/', 'Web oficial', 0),
    ('facebook', 'https://www.facebook.com/hdadpadrepio/', 'Facebook oficial', 10),
    ('x', 'https://twitter.com/Hdadpadrepio', 'X oficial', 20),
    ('instagram', 'https://www.instagram.com/hdadpadrepio/', 'Instagram oficial', 30),
    ('youtube', 'https://www.youtube.com/channel/UCdCaj8vGPMoLtFj8OWw3h_A', 'YouTube oficial', 40)
  ) as d(platform, url, label, display_order)
)
insert into public.entity_social_links (
  entity_id, platform, url, label, display_order, is_public
)
select e.id, d.platform, d.url, d.label, d.display_order, true
from social_data d
join public.entities e on e.slug = 'padre-pio-sevilla'
on conflict (entity_id, platform) do update set
  url = excluded.url,
  label = excluded.label,
  display_order = excluded.display_order,
  is_public = true,
  updated_at = now();

insert into public.entities (entity_type, name, slug, summary, status)
values
  ('image', 'Nuestro Padre Jesús de la Salud y Clemencia', 'nuestro-padre-jesus-salud-clemencia-padre-pio', 'Nazareno realizado por Fernando Murciano Abad en 1996 para la Hermandad de Padre Pío.', 'published'),
  ('image', 'Santísima Virgen Madre de la Divina Gracia', 'santisima-virgen-madre-divina-gracia-padre-pio', 'Dolorosa de candelero realizada por Luis Álvarez Duarte en 1987 para la Hermandad de Padre Pío.', 'published'),
  ('step', 'Paso de Nuestro Padre Jesús de la Salud y Clemencia', 'paso-senor-salud-clemencia-padre-pio', 'Paso del Nazareno de Padre Pío, cuyo nuevo proyecto procesional se encuentra en ejecución.', 'published'),
  ('step', 'Paso de palio de la Santísima Virgen Madre de la Divina Gracia', 'paso-palio-madre-divina-gracia-padre-pio', 'Paso de palio de la titular mariana de la Hermandad de Padre Pío.', 'published'),
  ('heritage_asset', 'Relicario de San Juan de la Cruz', 'relicario-san-juan-cruz-padre-pio', 'Relicario vinculado al titular carmelita y donado por la Hermandad de la Esperanza de Triana.', 'published')
on conflict (slug) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  summary = excluded.summary,
  status = excluded.status,
  updated_at = now();

insert into public.images (
  entity_id, image_type, execution_date_text, material, technique,
  dimensions_text, height_cm, current_condition, description, iconography,
  anatomical_type, is_dress_image, current_state_notes, notes
)
select e.id, d.image_type, d.execution_date_text, d.material, d.technique,
       d.dimensions_text, d.height_cm, 'extant', d.description, d.iconography,
       d.anatomical_type, true, d.current_state_notes, d.notes
from (values
  ('nuestro-padre-jesus-salud-clemencia-padre-pio', 'Nazareno', 'Concluido y bendecido en 1996', 'Madera de cedro en cabeza y manos; cuerpo de pino de Flandes', 'Talla policromada al óleo', '182 cm de talla y 8 cm de peana', 182::numeric, 'Jesús con la cruz a cuestas camino del Calvario.', 'Camino del Calvario', 'Imagen de vestir', 'La articulación de los brazos emplea bornes de madera.', 'Encargado a Fernando Murciano Abad en 1993 y ejecutado durante nueve meses.'),
  ('santisima-virgen-madre-divina-gracia-padre-pio', 'Virgen · Dolorosa', '1987; bendecida en diciembre de 1987', 'Madera de cedro', 'Talla policromada de candelero', '167 cm de altura', 167::numeric, 'Dolorosa de rostro ovalado, cabeza ligeramente inclinada y cuatro lágrimas.', 'Virgen dolorosa durante la Pasión', 'Imagen de vestir', 'Intervenida por Luis Álvarez Duarte en 1993 y restaurada por el mismo autor en 2009.', 'Las páginas oficiales de la titular y de historia discrepan en los días exactos de entrega y bendición; se conserva la cronología segura de diciembre de 1987.')
) as d(slug, image_type, execution_date_text, material, technique, dimensions_text, height_cm, description, iconography, anatomical_type, current_state_notes, notes)
join public.entities e on e.slug = d.slug
on conflict (entity_id) do update set
  image_type = excluded.image_type,
  execution_date_text = excluded.execution_date_text,
  material = excluded.material,
  technique = excluded.technique,
  dimensions_text = excluded.dimensions_text,
  height_cm = excluded.height_cm,
  current_condition = excluded.current_condition,
  description = excluded.description,
  iconography = excluded.iconography,
  anatomical_type = excluded.anatomical_type,
  is_dress_image = excluded.is_dress_image,
  current_state_notes = excluded.current_state_notes,
  notes = excluded.notes;

with image_link_data as (
  select * from (values
    ('nuestro-padre-jesus-salud-clemencia-padre-pio', 'Desde 1996', 'Titular cristífero y primera imagen de la estación de penitencia.'),
    ('santisima-virgen-madre-divina-gracia-padre-pio', 'Desde 1987', 'Titular mariana que procesiona bajo palio.')
  ) as d(image_slug, date_from_text, notes)
)
insert into public.brotherhood_images (
  brotherhood_entity_id, image_entity_id, relation_type, date_from_text, notes, status
)
select h.id, i.id, 'titular', d.date_from_text, d.notes, 'published'
from image_link_data d
join public.entities h on h.slug = 'padre-pio-sevilla'
join public.entities i on i.slug = d.image_slug
where not exists (
  select 1 from public.brotherhood_images bi
  where bi.brotherhood_entity_id = h.id
    and bi.image_entity_id = i.id
    and bi.relation_type = 'titular'
    and bi.date_to is null
);

with authorship_data as (
  select * from (values
    ('nuestro-padre-jesus-salud-clemencia-padre-pio', 'fernando-murciano-abad', '1996', 'Autoría documentada por la Hermandad.'),
    ('santisima-virgen-madre-divina-gracia-padre-pio', 'luis-alvarez-duarte', '1987', 'Autoría documentada por la Hermandad.')
  ) as d(image_slug, agent_slug, date_from_text, notes)
)
insert into public.image_authorships (
  image_entity_id, agent_entity_id, authorship_type, role_name,
  date_from_text, certainty, notes, status
)
select i.id, a.id, 'author', 'autor', d.date_from_text,
       'documented', d.notes, 'published'
from authorship_data d
join public.entities i on i.slug = d.image_slug
join public.entities a on a.slug = d.agent_slug
where not exists (
  select 1 from public.image_authorships ia
  where ia.image_entity_id = i.id
    and ia.agent_entity_id = a.id
    and ia.authorship_type = 'author'
    and ia.role_name = 'autor'
);

with relation_data as (
  select * from (values
    ('fernando-murciano-abad', 'nuestro-padre-jesus-salud-clemencia-padre-pio', '1996'),
    ('luis-alvarez-duarte', 'santisima-virgen-madre-divina-gracia-padre-pio', '1987')
  ) as d(agent_slug, image_slug, date_from_text)
)
insert into public.entity_relations (
  source_entity_id, relation_type, target_entity_id, date_from_text, notes, status
)
select a.id, 'author_of', i.id, d.date_from_text,
       'Relación de autoría documentada.', 'published'
from relation_data d
join public.entities a on a.slug = d.agent_slug
join public.entities i on i.slug = d.image_slug
where not exists (
  select 1 from public.entity_relations er
  where er.source_entity_id = a.id
    and er.target_entity_id = i.id
    and er.relation_type = 'author_of'
);

insert into public.steps (
  entity_id, step_type, current_condition, description, carrier_system,
  execution_date_text, current_state_notes
)
select e.id, d.step_type, d.current_condition, d.description, 'Costaleros',
       d.execution_date_text, d.current_state_notes
from (values
  ('paso-senor-salud-clemencia-padre-pio', 'Nazareno', null::text, 'Paso procesional de Nuestro Padre Jesús de la Salud y Clemencia. La Hermandad se encuentra inmersa en la ejecución de un nuevo paso para el Señor.', 'Primera fase estrenada en 2025; proyecto en ejecución en 2026', 'La primera fase del nuevo paso se estrenó en 2025 y el proyecto continuaba en ejecución durante la estación de penitencia de 2026.'),
  ('paso-palio-madre-divina-gracia-padre-pio', 'Palio', 'preserved', 'Paso de palio de la Santísima Virgen Madre de la Divina Gracia.', 'Conjunto actual; mejoras documentadas en agosto de 2026', 'Las bambalinas fueron objeto de limpieza y mejora el 24 de agosto de 2026. El nuevo juego de cordones y flecos de bellota está anunciado para la salida extraordinaria del 11 de octubre de 2026.')
) as d(slug, step_type, current_condition, description, execution_date_text, current_state_notes)
join public.entities e on e.slug = d.slug
on conflict (entity_id) do update set
  step_type = excluded.step_type,
  current_condition = excluded.current_condition,
  description = excluded.description,
  carrier_system = excluded.carrier_system,
  execution_date_text = excluded.execution_date_text,
  current_state_notes = excluded.current_state_notes;

with step_link_data as (
  select * from (values
    ('paso-senor-salud-clemencia-padre-pio', 'Paso actual del titular cristífero.'),
    ('paso-palio-madre-divina-gracia-padre-pio', 'Paso actual de la titular mariana.')
  ) as d(step_slug, notes)
)
insert into public.brotherhood_steps (
  brotherhood_entity_id, step_entity_id, relation_type, notes, status
)
select h.id, st.id, 'processional_step', d.notes, 'published'
from step_link_data d
join public.entities h on h.slug = 'padre-pio-sevilla'
join public.entities st on st.slug = d.step_slug
where not exists (
  select 1 from public.brotherhood_steps bs
  where bs.brotherhood_entity_id = h.id
    and bs.step_entity_id = st.id
    and bs.relation_type = 'processional_step'
    and bs.date_to is null
);

with image_step_data as (
  select * from (values
    ('nuestro-padre-jesus-salud-clemencia-padre-pio', 'paso-senor-salud-clemencia-padre-pio', 'Desde 1996', 'Imagen principal del paso del Señor.'),
    ('santisima-virgen-madre-divina-gracia-padre-pio', 'paso-palio-madre-divina-gracia-padre-pio', 'Desde 1993', 'Imagen principal del paso de palio.')
  ) as d(image_slug, step_slug, date_from_text, notes)
)
insert into public.image_steps (
  image_entity_id, step_entity_id, relation_type, date_from_text, notes, status
)
select i.id, st.id, 'processes_on', d.date_from_text, d.notes, 'published'
from image_step_data d
join public.entities i on i.slug = d.image_slug
join public.entities st on st.slug = d.step_slug
where not exists (
  select 1 from public.image_steps ist
  where ist.image_entity_id = i.id
    and ist.step_entity_id = st.id
    and ist.relation_type = 'processes_on'
);

insert into public.entities (entity_type, name, slug, summary, status)
values
  ('agent', 'Diego Borrego Gómez', 'diego-borrego-gomez', 'Capataz del paso de Nuestro Padre Jesús de la Salud y Clemencia en 2026.', 'published'),
  ('agent', 'Rafael Rodríguez Benítez', 'rafael-rodriguez-benitez', 'Capataz del paso de palio de la Santísima Virgen Madre de la Divina Gracia en 2026, conocido como Rafa Torres.', 'published')
on conflict (slug) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  summary = coalesce(public.entities.summary, excluded.summary),
  status = 'published',
  updated_at = now();

insert into public.agents (entity_id, agent_kind, description)
select e.id, 'person', e.summary
from public.entities e
where e.slug in ('diego-borrego-gomez', 'rafael-rodriguez-benitez')
on conflict (entity_id) do update set
  agent_kind = excluded.agent_kind,
  description = coalesce(public.agents.description, excluded.description);

with personnel_data as (
  select * from (values
    ('paso-senor-salud-clemencia-padre-pio', 'diego-borrego-gomez', 'Vigente en 2026', 'Capataz del paso del Señor.'),
    ('paso-palio-madre-divina-gracia-padre-pio', 'rafael-rodriguez-benitez', 'Vigente en 2026', 'Capataz del paso de palio; conocido como Rafa Torres.')
  ) as d(step_slug, agent_slug, date_from_text, notes)
)
insert into public.step_personnel_periods (
  step_entity_id, agent_entity_id, role_name, date_from_text, is_current, notes, status
)
select st.id, a.id, 'Capataz', d.date_from_text, true, d.notes, 'published'
from personnel_data d
join public.entities st on st.slug = d.step_slug
join public.entities a on a.slug = d.agent_slug
where not exists (
  select 1 from public.step_personnel_periods spp
  where spp.step_entity_id = st.id
    and spp.agent_entity_id = a.id
    and spp.role_name = 'Capataz'
    and spp.is_current
);

insert into public.entities (entity_type, name, slug, summary, status)
values
  ('band', 'Agrupación Musical Lágrimas de Dolores', 'agrupacion-musical-lagrimas-dolores-san-fernando', 'Agrupación musical de San Fernando (Cádiz) que acompaña al Señor de la Salud y Clemencia de Padre Pío.', 'published'),
  ('band', 'Banda de Música Virgen de las Angustias', 'banda-musica-virgen-angustias-sanlucar-mayor', 'Banda de música de Sanlúcar la Mayor que acompaña a la Virgen Madre de la Divina Gracia de Padre Pío.', 'published')
on conflict (slug) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  summary = excluded.summary,
  status = excluded.status,
  updated_at = now();

insert into public.bands (entity_id, band_type, municipality_id, description)
select e.id, d.band_type, m.id, e.summary
from (values
  ('agrupacion-musical-lagrimas-dolores-san-fernando', 'Agrupación musical', 'san-fernando-cadiz'),
  ('banda-musica-virgen-angustias-sanlucar-mayor', 'Banda de música', 'sanlucar-la-mayor')
) as d(slug, band_type, municipality_slug)
join public.entities e on e.slug = d.slug
join public.municipalities m on m.slug = d.municipality_slug
on conflict (entity_id) do update set
  band_type = excluded.band_type,
  municipality_id = excluded.municipality_id,
  description = excluded.description;

with band_name_data as (
  select * from (values
    ('agrupacion-musical-lagrimas-dolores-san-fernando', 'Agrupación Musical Lágrimas de Dolores', 'A. M. Lágrimas de Dolores'),
    ('banda-musica-virgen-angustias-sanlucar-mayor', 'Banda de Música Virgen de las Angustias', 'Virgen de las Angustias')
  ) as d(slug, name, short_name)
)
insert into public.band_names (
  band_entity_id, name, short_name, name_type, date_from_text, is_current, notes
)
select e.id, d.name, d.short_name, 'official', 'Vigente en 2026', true,
       'Denominación empleada por la Hermandad de Padre Pío.'
from band_name_data d
join public.entities e on e.slug = d.slug
where not exists (
  select 1 from public.band_names bn
  where bn.band_entity_id = e.id and bn.name = d.name and bn.is_current
);

with music_data as (
  select * from (values
    ('agrupacion-musical-lagrimas-dolores-san-fernando', 'paso-senor-salud-clemencia-padre-pio', 'Tras el paso del Señor', 'Acompañamiento de la estación de penitencia', 'Vigente en la estación de penitencia de 2026; inicio por documentar', 'Acompañamiento musical actual de Nuestro Padre Jesús de la Salud y Clemencia.'),
    ('banda-musica-virgen-angustias-sanlucar-mayor', 'paso-palio-madre-divina-gracia-padre-pio', 'Tras el paso de palio', 'Acompañamiento de la estación de penitencia', 'Vigente en la estación de penitencia de 2026; inicio por documentar', 'Acompañamiento musical actual de la Santísima Virgen Madre de la Divina Gracia.')
  ) as d(band_slug, step_slug, position, outing_type, date_from_text, notes)
)
insert into public.music_accompaniment_periods (
  brotherhood_entity_id, band_entity_id, step_entity_id, "position", outing_type,
  date_from_text, is_current, notes, status,
  public_brotherhood_name, public_step_name, public_brotherhood_slug,
  public_municipality_name, public_municipality_slug, public_province
)
select h.id, b.id, st.id, d.position, d.outing_type,
       d.date_from_text, true, d.notes, 'published',
       'Padre Pío', st.name, 'padre-pio-sevilla', 'Sevilla', 'sevilla', 'Sevilla'
from music_data d
join public.entities h on h.slug = 'padre-pio-sevilla'
join public.entities b on b.slug = d.band_slug
join public.entities st on st.slug = d.step_slug
where not exists (
  select 1 from public.music_accompaniment_periods mp
  where mp.brotherhood_entity_id = h.id
    and mp.band_entity_id = b.id
    and mp.step_entity_id = st.id
    and mp."position" = d.position
    and mp.is_current
);

insert into public.brotherhood_habits (
  brotherhood_entity_id, name, tunic_description, hood_description,
  cord_description, buttons_description, shield_description,
  footwear_description, notes, sort_order, status
)
select h.id, 'Hábito penitencial',
  'Túnica y capa de color marfil o crema',
  'Antifaz burdeos con el escudo carmelitano a la altura del pecho y la medalla de la Hermandad debajo',
  'Cíngulo burdeos con caída al lado izquierdo',
  'Botones burdeos en todo el frontal de la túnica y en las bocamangas',
  'Escudo de la Hermandad a la altura del hombro izquierdo; escudo carmelitano en el antifaz',
  'Calcetines blancos lisos, zapatos negros y guantes blancos lisos',
  'Descripción conforme a la Regla 16.ª de la Hermandad.', 1, 'published'
from public.entities h
where h.slug = 'padre-pio-sevilla'
on conflict (brotherhood_entity_id, name) do update set
  tunic_description = excluded.tunic_description,
  hood_description = excluded.hood_description,
  cord_description = excluded.cord_description,
  buttons_description = excluded.buttons_description,
  shield_description = excluded.shield_description,
  footwear_description = excluded.footwear_description,
  notes = excluded.notes,
  sort_order = excluded.sort_order,
  status = excluded.status,
  updated_at = now();

with color_data as (
  select * from (values
    ('Burdeos', null::text, 'primary', 1, 'Color del antifaz, cíngulo y botonadura; la fuente no fija un HEX institucional.'),
    ('Marfil', null::text, 'secondary', 2, 'Color de la túnica y la capa; la fuente también lo denomina crema.')
  ) as d(color_name, hex_value, color_role, sort_order, notes)
)
insert into public.brotherhood_colors (
  brotherhood_entity_id, color_name, hex_value, color_role, sort_order, notes, status
)
select h.id, d.color_name, d.hex_value, d.color_role, d.sort_order, d.notes, 'published'
from color_data d
join public.entities h on h.slug = 'padre-pio-sevilla'
on conflict (brotherhood_entity_id, color_name) do update set
  hex_value = excluded.hex_value,
  color_role = excluded.color_role,
  sort_order = excluded.sort_order,
  notes = excluded.notes,
  status = excluded.status,
  updated_at = now();

insert into public.heritage_assets (
  entity_id, parent_entity_id, asset_type, description, current_condition,
  notes, is_current, origin_notes, display_order, is_featured
)
select asset.id, h.id, 'Relicario',
       'Relicario dedicado a San Juan de la Cruz, titular de la corporación.',
       'extant', 'La fuente oficial documenta su existencia y procedencia.', true,
       'Donado por la Hermandad de la Esperanza de Triana.', 10, false
from public.entities asset
join public.entities h on h.slug = 'padre-pio-sevilla'
where asset.slug = 'relicario-san-juan-cruz-padre-pio'
on conflict (entity_id) do update set
  parent_entity_id = excluded.parent_entity_id,
  asset_type = excluded.asset_type,
  description = excluded.description,
  current_condition = excluded.current_condition,
  notes = excluded.notes,
  is_current = excluded.is_current,
  origin_notes = excluded.origin_notes,
  display_order = excluded.display_order,
  is_featured = excluded.is_featured;

insert into public.entities (entity_type, name, slug, summary, status)
values
  ('agent', 'Ana Sánchez', 'ana-sanchez-padre-pio', 'Hermana de Padre Pío que participó en los trabajos textiles del palio en 2026.', 'published'),
  ('agent', 'Isabel Sánchez', 'isabel-sanchez-padre-pio', 'Hermana de Padre Pío que participó en los trabajos textiles del palio en 2026.', 'published'),
  ('agent', 'M.ª Ángeles Barrionuevo', 'maria-angeles-barrionuevo-padre-pio', 'Hermana de Padre Pío que participó en los trabajos textiles del palio en 2026.', 'published'),
  ('agent', 'Dolores Arnozán', 'dolores-arnozan-padre-pio', 'Hermana de Padre Pío que participó en los trabajos textiles del palio en 2026.', 'published'),
  ('agent', 'Clara Bocanegra', 'clara-bocanegra-padre-pio', 'Hermana de Padre Pío que participó en los trabajos textiles del palio en 2026.', 'published'),
  ('agent', 'Rosario Expósito', 'rosario-exposito-padre-pio', 'Hermana de Padre Pío que participó en los trabajos textiles del palio en 2026.', 'published'),
  ('agent', 'Rosa María Pavón', 'rosa-maria-pavon-padre-pio', 'Hermana de Padre Pío que participó en los trabajos textiles del palio en 2026.', 'published')
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
  'ana-sanchez-padre-pio',
  'isabel-sanchez-padre-pio',
  'maria-angeles-barrionuevo-padre-pio',
  'dolores-arnozan-padre-pio',
  'clara-bocanegra-padre-pio',
  'rosario-exposito-padre-pio',
  'rosa-maria-pavon-padre-pio'
)
on conflict (entity_id) do update set
  agent_kind = excluded.agent_kind,
  description = excluded.description;

insert into public.heritage_updates (
  brotherhood_entity_id, update_type, title, update_date, year,
  target_entity_id, element_name, discipline, description, status
)
select h.id, d.update_type, d.title, d.update_date, 2026,
       st.id, d.element_name, d.discipline, d.description, 'published'
from (values
  ('restauracion', 'Limpieza y mejora de las bambalinas del palio', date '2026-08-24', 'Bambalinas del paso de palio', 'Conservación textil', 'Trabajos de limpieza y mejora concluidos el 24 de agosto de 2026 para la salida extraordinaria de la Virgen.'),
  ('estreno', 'Nuevos cordones y flecos de bellota para el palio', date '2026-10-11', 'Cordones y flecos de bellota de las cuatro bambalinas', 'Pasamanería', 'Estreno completo anunciado para la salida extraordinaria del 11 de octubre de 2026. El juego fue realizado para las cuatro bambalinas y donado íntegramente por un grupo de hermanos.')
) as d(update_type, title, update_date, element_name, discipline, description)
join public.entities h on h.slug = 'padre-pio-sevilla'
join public.entities st on st.slug = 'paso-palio-madre-divina-gracia-padre-pio'
where not exists (
  select 1 from public.heritage_updates hu
  where hu.brotherhood_entity_id = h.id
    and hu.update_type = d.update_type
    and hu.title = d.title
    and hu.update_date = d.update_date
);

with update_data as (
  select hu.id, hu.update_type
  from public.heritage_updates hu
  join public.entities h on h.id = hu.brotherhood_entity_id
  where h.slug = 'padre-pio-sevilla'
    and hu.title in (
      'Limpieza y mejora de las bambalinas del palio',
      'Nuevos cordones y flecos de bellota para el palio'
    )
), agent_data as (
  select id
  from public.entities
  where slug in (
    'ana-sanchez-padre-pio',
    'isabel-sanchez-padre-pio',
    'maria-angeles-barrionuevo-padre-pio',
    'dolores-arnozan-padre-pio',
    'clara-bocanegra-padre-pio',
    'rosario-exposito-padre-pio',
    'rosa-maria-pavon-padre-pio'
  )
)
insert into public.heritage_update_agents (
  heritage_update_id, agent_entity_id, role_name, discipline, notes
)
select u.id, a.id,
       case when u.update_type = 'estreno' then 'Realización' else 'Limpieza y mejora' end,
       case when u.update_type = 'estreno' then 'Pasamanería' else 'Conservación textil' end,
       'Trabajo desarrollado desde mediados de julio de 2026 en domicilios de devotas y en la Casa de Hermandad.'
from update_data u
cross join agent_data a
on conflict (heritage_update_id, agent_entity_id, role_name) do update set
  discipline = excluded.discipline,
  notes = excluded.notes;

insert into public.outings (
  brotherhood_entity_id, outing_type, "character", title, outing_date, return_date,
  year, departure_time, return_time, municipality_id, origin_place_id,
  origin_text, destination_place_id, destination_text, reason, route_summary,
  description, public_notes, event_status, status, slug, organizer_name
)
select h.id, 'Procesión extraordinaria', 'extraordinary',
       'Salida extraordinaria de la Santísima Virgen Madre de la Divina Gracia',
       date '2026-10-11', date '2026-10-12', 2026, time '18:00', time '00:00',
       m.id, p.id, p.name, p.id, p.name,
       'XXV aniversario de la dedicación de la Parroquia del Buen Pastor y San Juan de la Cruz',
       'Parroquia, Auxiliar Ronda Padre Pío, Doctora Oeste, San Juan de Aznalfarache, Valencina de la Concepción, La Roda de Andalucía, Alájar, Lora de Estepa, Puebla del Río, Ronda de Padre Pío, Rafael García Miquel, Villaverde, Carrión de los Céspedes, Castilleja de la Cuesta, Castilblanco de los Arroyos, Puebla de los Infantes, Carrión de los Céspedes, Villamanrique, El Castillo de las Guardas, Villaverde, La Pañoleta, Ronda de Padre Pío y entrada.',
       'La Santísima Virgen recorrerá las calles del barrio sobre su paso de palio.',
       'La Solemne Función por el aniversario parroquial se celebrará el 12 de octubre de 2026 y estará presidida por el Arzobispo de Sevilla.',
       'announced', 'published',
       'padre-pio-divina-gracia-salida-extraordinaria-2026-10-11',
       'Hermandad Sacramental de Padre Pío'
from public.entities h
join public.municipalities m on m.slug = 'sevilla'
join public.places p on p.slug = 'parroquia-buen-pastor-san-juan-cruz-padre-pio'
where h.slug = 'padre-pio-sevilla'
  and not exists (
    select 1 from public.outings o
    where o.slug = 'padre-pio-divina-gracia-salida-extraordinaria-2026-10-11'
  );

insert into public.outing_entities (outing_id, entity_id, role, notes)
select o.id, i.id, 'processional_image',
       'Titular mariana que protagoniza la salida extraordinaria bajo palio.'
from public.outings o
join public.entities i on i.slug = 'santisima-virgen-madre-divina-gracia-padre-pio'
where o.slug = 'padre-pio-divina-gracia-salida-extraordinaria-2026-10-11'
on conflict (outing_id, entity_id, role) do update set notes = excluded.notes;

insert into public.outing_music_positions (
  outing_id, step_entity_id, position_code, position_label, sequence_no, notes, status
)
select o.id, st.id, 'tras_palio', 'Tras el paso de palio', 1,
       'Acompañamiento de la salida extraordinaria.', 'published'
from public.outings o
join public.entities st on st.slug = 'paso-palio-madre-divina-gracia-padre-pio'
where o.slug = 'padre-pio-divina-gracia-salida-extraordinaria-2026-10-11'
on conflict (outing_id, sequence_no) do update set
  step_entity_id = excluded.step_entity_id,
  position_code = excluded.position_code,
  position_label = excluded.position_label,
  notes = excluded.notes,
  status = excluded.status,
  updated_at = now();

insert into public.outing_music_assignments (
  music_position_id, band_entity_id, participation_mode, sequence_no, notes, status
)
select pos.id, band.id, 'full_route', 1,
       'Acompañamiento oficial anunciado para el 11 de octubre de 2026.', 'published'
from public.outings o
join public.outing_music_positions pos on pos.outing_id = o.id and pos.sequence_no = 1
join public.entities band on band.slug = 'banda-musica-virgen-angustias-sanlucar-mayor'
where o.slug = 'padre-pio-divina-gracia-salida-extraordinaria-2026-10-11'
  and not exists (
    select 1 from public.outing_music_assignments oma
    where oma.music_position_id = pos.id
      and oma.band_entity_id = band.id
      and oma.sequence_no = 1
  );

with entity_source_data as (
  select * from (values
    ('padre-pio-sevilla', 'https://hermandadpadrepio.com/', 'Identidad, escudo y canales oficiales'),
    ('padre-pio-sevilla', 'https://hermandadpadrepio.com/hermandad/historia/', 'Historia institucional'),
    ('padre-pio-sevilla', 'https://hermandadpadrepio.com/sagrados-titulares/santisimo-sacramento/', 'Carácter sacramental'),
    ('padre-pio-sevilla', 'https://hermandadpadrepio.com/sagrados-titulares/santa-cruz-en-el-monte-calvario/', 'Titularidad de la Santa Cruz'),
    ('padre-pio-sevilla', 'https://hermandadpadrepio.com/cofradia/ficha-cofradia/', 'Denominación y ficha de la cofradía'),
    ('nuestro-padre-jesus-salud-clemencia-padre-pio', 'https://hermandadpadrepio.com/sagrados-titulares/ntro-padre-jesus-de-la-salud-y-clemencia/', 'Ficha del titular'),
    ('santisima-virgen-madre-divina-gracia-padre-pio', 'https://hermandadpadrepio.com/sagrados-titulares/stma-virgen-madre-de-la-divina-gracia/', 'Ficha de la titular'),
    ('paso-senor-salud-clemencia-padre-pio', 'https://inriinformacion.com/2026/03/28/los-principales-datos-de-interes-del-sabado-de-pasion-de-2026/', 'Estado actual del nuevo paso'),
    ('paso-palio-madre-divina-gracia-padre-pio', 'https://hermandadpadrepio.com/cofradia/ficha-cofradia/', 'Ficha del paso de palio'),
    ('relicario-san-juan-cruz-padre-pio', 'https://hermandadpadrepio.com/sagrados-titulares/san-juan-de-la-cruz/', 'Procedencia del relicario'),
    ('agrupacion-musical-lagrimas-dolores-san-fernando', 'https://hermandadpadrepio.com/comunicado-oficial-acompanamiento-musical/', 'Acompañamiento oficial del Señor'),
    ('banda-musica-virgen-angustias-sanlucar-mayor', 'https://hermandadpadrepio.com/carta-de-agradecimiento-por-el-pasado-sabado-de-pasion/', 'Acompañamiento oficial del palio en 2026')
  ) as d(entity_slug, source_url, scope)
)
insert into public.source_links (source_id, entity_id, scope, notes)
select s.id, e.id, d.scope, 'Ficha editorial de Padre Pío · septiembre de 2026'
from entity_source_data d
join public.entities e on e.slug = d.entity_slug
join public.sources s on s.url = d.source_url
where not exists (
  select 1 from public.source_links sl
  where sl.source_id = s.id and sl.entity_id = e.id and sl.scope = d.scope
);

insert into public.source_links (source_id, entity_location_id, scope, notes)
select s.id, el.id, 'Sede canónica', 'Dirección contrastada el 2 de septiembre de 2026.'
from public.sources s
join public.entities h on h.slug = 'padre-pio-sevilla'
join public.entity_locations el on el.entity_id = h.id and el.is_current
where s.url = 'https://www.visitarsevilla.com/parroquias-buen-pastor-padre-pio-y-nuestra-senora-del-aguila-palmete/'
  and not exists (
    select 1 from public.source_links sl
    where sl.source_id = s.id and sl.entity_location_id = el.id
  );

insert into public.source_links (source_id, brotherhood_habit_id, scope, notes)
select s.id, bh.id, 'Hábito penitencial', 'Descripción oficial conforme a la Regla 16.ª.'
from public.sources s
join public.entities h on h.slug = 'padre-pio-sevilla'
join public.brotherhood_habits bh on bh.brotherhood_entity_id = h.id
where s.url = 'https://hermandadpadrepio.com/cofradia/habito-nazareno/'
  and not exists (
    select 1 from public.source_links sl
    where sl.source_id = s.id and sl.brotherhood_habit_id = bh.id
  );

insert into public.source_links (source_id, heritage_update_id, scope, notes)
select s.id, hu.id,
       case when hu.update_type = 'estreno' then 'Estreno anunciado' else 'Limpieza y mejora' end,
       'Publicación oficial del 25 de agosto de 2026.'
from public.sources s
join public.entities h on h.slug = 'padre-pio-sevilla'
join public.heritage_updates hu on hu.brotherhood_entity_id = h.id and hu.year = 2026
where s.url = 'https://hermandadpadrepio.com/estreno-de-nuevos-cordones-y-flecos-de-bellota-para-el-palio-de-la-santisima-virgen-madre-de-la-divina-gracia/'
  and hu.title in (
    'Limpieza y mejora de las bambalinas del palio',
    'Nuevos cordones y flecos de bellota para el palio'
  )
  and not exists (
    select 1 from public.source_links sl
    where sl.source_id = s.id and sl.heritage_update_id = hu.id
  );

insert into public.source_links (source_id, outing_id, scope, notes)
select s.id, o.id, 'Salida extraordinaria',
       'Anuncio oficial con fecha, horario, itinerario, motivo y acompañamiento.'
from public.sources s
join public.outings o on o.slug = 'padre-pio-divina-gracia-salida-extraordinaria-2026-10-11'
where s.url = 'https://hermandadpadrepio.com/la-santisima-virgen-madre-de-la-divina-gracia-recorrera-las-calles-de-padre-pio-en-la-salida-extraordinaria-con-motivo-del-xxv-aniversario-de-la-parroquia/'
  and not exists (
    select 1 from public.source_links sl
    where sl.source_id = s.id and sl.outing_id = o.id
  );

with personnel_sources as (
  select * from (values
    ('paso-senor-salud-clemencia-padre-pio', 'diego-borrego-gomez'),
    ('paso-palio-madre-divina-gracia-padre-pio', 'rafael-rodriguez-benitez')
  ) as d(step_slug, agent_slug)
)
insert into public.source_links (source_id, step_personnel_period_id, scope, notes)
select s.id, spp.id, 'Capataz vigente en 2026',
       'Ficha oficial de la cofradía y contraste especializado de 2026.'
from personnel_sources d
join public.entities st on st.slug = d.step_slug
join public.entities a on a.slug = d.agent_slug
join public.step_personnel_periods spp
  on spp.step_entity_id = st.id and spp.agent_entity_id = a.id and spp.is_current
join public.sources s on s.url = 'https://hermandadpadrepio.com/cofradia/ficha-cofradia/'
where not exists (
  select 1 from public.source_links sl
  where sl.source_id = s.id and sl.step_personnel_period_id = spp.id
);

insert into public.source_links (source_id, music_accompaniment_period_id, scope, notes)
select s.id, mp.id, 'Acompañamiento vigente en 2026',
       'Formación participante en la estación de penitencia de 2026.'
from public.sources s
join public.entities h on h.slug = 'padre-pio-sevilla'
join public.music_accompaniment_periods mp
  on mp.brotherhood_entity_id = h.id and mp.is_current
where s.url = 'https://hermandadpadrepio.com/carta-de-agradecimiento-por-el-pasado-sabado-de-pasion/'
  and not exists (
    select 1 from public.source_links sl
    where sl.source_id = s.id and sl.music_accompaniment_period_id = mp.id
  );

insert into public.source_links (source_id, outing_music_assignment_id, scope, notes)
select s.id, oma.id, 'Acompañamiento de la salida extraordinaria',
       'Banda anunciada para todo el recorrido del 11 de octubre de 2026.'
from public.sources s
join public.outings o on o.slug = 'padre-pio-divina-gracia-salida-extraordinaria-2026-10-11'
join public.outing_music_positions pos on pos.outing_id = o.id
join public.outing_music_assignments oma on oma.music_position_id = pos.id
where s.url = 'https://hermandadpadrepio.com/la-santisima-virgen-madre-de-la-divina-gracia-recorrera-las-calles-de-padre-pio-en-la-salida-extraordinaria-con-motivo-del-xxv-aniversario-de-la-parroquia/'
  and not exists (
    select 1 from public.source_links sl
    where sl.source_id = s.id and sl.outing_music_assignment_id = oma.id
  );

do $$
declare
  v_brotherhood_id uuid;
begin
  select id into strict v_brotherhood_id
  from public.entities
  where slug = 'padre-pio-sevilla';

  if (select count(*) from public.entities where slug = 'padre-pio-sevilla' and status = 'published') <> 1 then
    raise exception 'Padre Pío debe quedar como una única Hermandad publicada';
  end if;
  if (select count(*) from public.brotherhood_images where brotherhood_entity_id = v_brotherhood_id and status = 'published') <> 2 then
    raise exception 'Padre Pío debe quedar con sus dos imágenes procesionales publicadas';
  end if;
  if (select count(*) from public.brotherhood_steps where brotherhood_entity_id = v_brotherhood_id and status = 'published') <> 2 then
    raise exception 'Padre Pío debe quedar con sus dos pasos publicados';
  end if;
  if (select count(*) from public.music_accompaniment_periods where brotherhood_entity_id = v_brotherhood_id and is_current and status = 'published') <> 2 then
    raise exception 'Padre Pío debe quedar con sus dos acompañamientos actuales';
  end if;
  if (select count(*) from public.heritage_updates where brotherhood_entity_id = v_brotherhood_id and year = 2026 and status = 'published') <> 2 then
    raise exception 'Padre Pío debe conservar separados la limpieza y el estreno del palio';
  end if;
  if (
    select count(*)
    from public.heritage_update_agents hua
    join public.heritage_updates hu on hu.id = hua.heritage_update_id
    where hu.brotherhood_entity_id = v_brotherhood_id and hu.year = 2026
  ) <> 14 then
    raise exception 'Los dos trabajos del palio deben reconocer a sus siete autoras';
  end if;
  if (select count(*) from public.entity_social_links where entity_id = v_brotherhood_id and is_public) <> 5 then
    raise exception 'Padre Pío debe quedar con sus cinco canales oficiales';
  end if;
  if (select count(*) from public.outings where brotherhood_entity_id = v_brotherhood_id and slug = 'padre-pio-divina-gracia-salida-extraordinaria-2026-10-11' and status = 'published') <> 1 then
    raise exception 'La salida extraordinaria de la Divina Gracia debe quedar publicada';
  end if;
end
$$;
