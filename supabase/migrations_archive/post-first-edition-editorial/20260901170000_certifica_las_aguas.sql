-- Lote editorial · Hermandades · certificación de Las Aguas
-- Solo DML sobre el modelo First Edition existente. No introduce DDL ni RLS.

do $$
begin
  if (select count(*) from public.entities where slug = 'las-aguas-sevilla') <> 1 then
    raise exception 'La ficha canónica de Las Aguas no es unívoca';
  end if;
end $$;

insert into public.sources (
  name, url, source_type, author_or_publisher, publication_date, accessed_at, notes
)
select v.name, v.url, v.source_type, v.publisher, v.publication_date, date '2026-09-01', v.notes
from (values
  ('Las Aguas · Santísimo Cristo de las Aguas', 'https://www.hermandaddelasaguas.org/titulares/stmo-cristo-de-las-aguas', 'Web oficial', 'Hermandad de Las Aguas', null::date, 'Titular, autoría y cronología de la imagen.'),
  ('Las Aguas · Nuestra Madre y Señora del Mayor Dolor', 'https://www.hermandaddelasaguas.org/titulares/ntra-madre-y-senora-del-mayor-dolor', 'Web oficial', 'Hermandad de Las Aguas', null::date, 'Titular y ficha de la imagen dolorosa.'),
  ('Las Aguas · María Santísima de Guadalupe', 'https://www.hermandaddelasaguas.org/titulares/maria-santisima-de-guadalupe', 'Web oficial', 'Hermandad de Las Aguas', null::date, 'Titular, autoría, ejecución y bendición.'),
  ('Las Aguas · Nuestra Señora del Rosario', 'https://www.hermandaddelasaguas.org/titulares/ntra-sra-del-rosario', 'Web oficial', 'Hermandad de Las Aguas', null::date, 'Titular gloriosa y ficha de la imagen.'),
  ('Las Aguas · Paso de Misterio', 'https://www.hermandaddelasaguas.org/cofradia/pasos/paso-de-misterio', 'Web oficial', 'Hermandad de Las Aguas', null::date, 'Descripción patrimonial y dimensiones del paso de misterio.'),
  ('Las Aguas · Paso de Palio', 'https://www.hermandaddelasaguas.org/cofradia/pasos/paso-de-palio', 'Web oficial', 'Hermandad de Las Aguas', null::date, 'Descripción patrimonial del paso de palio de Guadalupe.'),
  ('Las Aguas · Diputación de Cuadrillas', 'https://www.hermandaddelasaguas.org/secciones/diputacion-de-cuadrillas', 'Web oficial', 'Hermandad de Las Aguas', null::date, 'Información oficial de las cuadrillas y su capataz.'),
  ('Gonzalo Carrión, capataz general de Las Aguas', 'https://www.gentedepaz.es/gonzalo-carrion-capataz-general-de-las-aguas/', 'Prensa especializada', 'Gente de Paz', date '2018-07-10', 'Nombramiento como capataz general para ambos pasos desde la Semana Santa de 2019.')
) as v(name, url, source_type, publisher, publication_date, notes)
where not exists (select 1 from public.sources s where s.url = v.url);

update public.sources
set accessed_at = date '2026-09-01'
where url in (
  'https://www.hermandaddelasaguas.org/titulares/stmo-cristo-de-las-aguas',
  'https://www.hermandaddelasaguas.org/titulares/ntra-madre-y-senora-del-mayor-dolor',
  'https://www.hermandaddelasaguas.org/titulares/maria-santisima-de-guadalupe',
  'https://www.hermandaddelasaguas.org/titulares/ntra-sra-del-rosario',
  'https://www.hermandaddelasaguas.org/cofradia/pasos/paso-de-misterio',
  'https://www.hermandaddelasaguas.org/cofradia/pasos/paso-de-palio',
  'https://www.hermandaddelasaguas.org/secciones/diputacion-de-cuadrillas',
  'https://www.gentedepaz.es/gonzalo-carrion-capataz-general-de-las-aguas/'
);

insert into public.entities (entity_type, name, slug, summary, status)
select v.entity_type, v.name, v.slug, v.summary, 'published'
from (values
  ('image', 'Santísimo Cristo de las Aguas', 'santisimo-cristo-aguas-sevilla', 'Crucificado realizado por Antonio Illanes Rodríguez en 1940 y titular de la Hermandad de Las Aguas.'),
  ('image', 'María Santísima de Guadalupe', 'maria-santisima-guadalupe-las-aguas', 'Dolorosa realizada por Luis Álvarez Duarte en 1965–1966 y bendecida el 19 de febrero de 1967.'),
  ('image', 'Nuestra Señora del Rosario', 'nuestra-senora-rosario-las-aguas', 'Imagen gloriosa de talla completa, anónima y fechada en el siglo XVIII, titular de la Hermandad de Las Aguas.'),
  ('step', 'Paso de palio de María Santísima de Guadalupe', 'paso-palio-guadalupe-las-aguas-sevilla', 'Paso de palio de terciopelo azul bordado en oro, con piezas ejecutadas entre 1988 y 2005.'),
  ('agent', 'Antonio Illanes Rodríguez', 'antonio-illanes-rodriguez', 'Escultor e imaginero español, autor del Santísimo Cristo de las Aguas de Sevilla.'),
  ('agent', 'José Romero Morillo', 'jose-romero-morillo', 'Escultor vinculado a la ejecución de Nuestra Madre y Señora del Mayor Dolor de Las Aguas.'),
  ('agent', 'Gonzalo Carrión Fernández', 'gonzalo-carrion-fernandez', 'Capataz general de la Hermandad de Las Aguas desde la Semana Santa de 2019.')
) as v(entity_type, name, slug, summary)
where not exists (select 1 from public.entities e where e.slug = v.slug);

with editorial_data as (
  select * from (values
    ('santisimo-cristo-aguas-sevilla', 'Santísimo Cristo de las Aguas', 'Crucificado realizado por Antonio Illanes Rodríguez en 1940 y titular de la Hermandad de Las Aguas.'),
    ('nuestra-madre-senora-mayor-dolor-las-aguas', 'Nuestra Madre y Señora del Mayor Dolor', 'Dolorosa ejecutada en 1944 por José Romero Morillo y sacada de punto por Antonio Eslava Rubio a partir de la imagen de José Montes de Oca perdida en 1942.'),
    ('maria-santisima-guadalupe-las-aguas', 'María Santísima de Guadalupe', 'Dolorosa realizada por Luis Álvarez Duarte en 1965–1966 y bendecida el 19 de febrero de 1967.'),
    ('nuestra-senora-rosario-las-aguas', 'Nuestra Señora del Rosario', 'Imagen gloriosa de talla completa, anónima y fechada en el siglo XVIII, titular de la Hermandad de Las Aguas.'),
    ('paso-misterio-cristo-aguas-sevilla', 'Paso de misterio del Santísimo Cristo de las Aguas', 'Paso barroco en madera de cedro tallada y dorada, estrenado en talla completa en 2007 y concluido en 2011.'),
    ('paso-palio-guadalupe-las-aguas-sevilla', 'Paso de palio de María Santísima de Guadalupe', 'Paso de palio de terciopelo azul bordado en oro, con piezas ejecutadas entre 1988 y 2005.')
  ) as d(slug, name, summary)
)
update public.entities e
set name = d.name, summary = d.summary, status = 'published', updated_at = now()
from editorial_data d
where e.slug = d.slug;

insert into public.agents (entity_id, agent_kind, description)
select e.id, 'person', e.summary
from public.entities e
where e.slug in ('antonio-illanes-rodriguez', 'jose-romero-morillo', 'gonzalo-carrion-fernandez')
on conflict (entity_id) do update set
  agent_kind = excluded.agent_kind,
  description = excluded.description;

insert into public.images (
  entity_id, image_type, execution_date_text, material, current_condition,
  description, iconography, is_dress_image
)
select e.id, d.image_type, d.execution_date_text, d.material, 'extant',
       e.summary, d.iconography, d.is_dress_image
from (values
  ('santisimo-cristo-aguas-sevilla', 'Cristo · Crucificado', '1940', 'Madera tallada y policromada', 'Cristo muerto en la cruz, del cuyo costado manan sangre y agua.', false),
  ('nuestra-madre-senora-mayor-dolor-las-aguas', 'Virgen · Dolorosa', '1944', 'Madera tallada y policromada', 'Dolorosa situada a los pies del Santísimo Cristo de las Aguas en el paso de misterio.', true),
  ('maria-santisima-guadalupe-las-aguas', 'Virgen · Dolorosa', '1965–1966; bendecida el 19 de febrero de 1967', 'Madera tallada y policromada', 'Dolorosa que preside el paso de palio de la Hermandad.', true),
  ('nuestra-senora-rosario-las-aguas', 'Virgen · Gloria', 'Siglo XVIII', 'Madera tallada y policromada', 'Virgen con el Niño, de talla completa y vinculada a la antigua Hermandad del Rosario del Arenal.', false)
) as d(slug, image_type, execution_date_text, material, iconography, is_dress_image)
join public.entities e on e.slug = d.slug
on conflict (entity_id) do update set
  image_type = excluded.image_type,
  execution_date_text = excluded.execution_date_text,
  material = excluded.material,
  current_condition = excluded.current_condition,
  description = excluded.description,
  iconography = excluded.iconography,
  is_dress_image = excluded.is_dress_image;

with link_data as (
  select * from (values
    ('santisimo-cristo-aguas-sevilla', 'Titular cristífero de la Hermandad.'),
    ('nuestra-madre-senora-mayor-dolor-las-aguas', 'Titular mariana integrada en el misterio del Calvario.'),
    ('maria-santisima-guadalupe-las-aguas', 'Titular mariana que procesiona bajo palio.'),
    ('nuestra-senora-rosario-las-aguas', 'Titular gloriosa procedente de la corporación fusionada en 1977.')
  ) as d(image_slug, notes)
)
insert into public.brotherhood_images (
  brotherhood_entity_id, image_entity_id, relation_type, notes, status
)
select h.id, i.id, 'titular', d.notes, 'published'
from link_data d
join public.entities h on h.slug = 'las-aguas-sevilla'
join public.entities i on i.slug = d.image_slug
where not exists (
  select 1 from public.brotherhood_images bi
  where bi.brotherhood_entity_id = h.id and bi.image_entity_id = i.id
    and bi.relation_type = 'titular' and bi.date_to is null
);

with authorship_data as (
  select * from (values
    ('santisimo-cristo-aguas-sevilla', 'antonio-illanes-rodriguez', 'author', 'autor', '1940', 'documented', 'Autoría documentada por la Hermandad.'),
    ('nuestra-madre-senora-mayor-dolor-las-aguas', 'jose-romero-morillo', 'author', 'autor', '1944', 'documented', 'Ejecutor de la imagen actual.'),
    ('nuestra-madre-senora-mayor-dolor-las-aguas', 'antonio-eslava-rubio', 'author', 'sacado de punto', '1944', 'documented', 'Intervención técnica documentada sobre el modelo de la imagen desaparecida de José Montes de Oca.'),
    ('maria-santisima-guadalupe-las-aguas', 'luis-alvarez-duarte', 'author', 'autor', '1965–1966', 'documented', 'La web oficial fecha la ejecución en 1965 y la ficha del Consejo en 1966; se conserva el intervalo y la bendición de 1967.'),
    ('nuestra-senora-rosario-las-aguas', null::text, 'anonymous', 'autor', 'Siglo XVIII', 'unknown', 'Obra anónima cercana a la estética de Pedro Duque Cornejo, sin atribución documental confirmada.')
  ) as d(image_slug, agent_slug, authorship_type, role_name, date_from_text, certainty, notes)
)
insert into public.image_authorships (
  image_entity_id, agent_entity_id, authorship_type, role_name,
  date_from_text, certainty, notes, status
)
select i.id, a.id, d.authorship_type, d.role_name,
       d.date_from_text, d.certainty, d.notes, 'published'
from authorship_data d
join public.entities i on i.slug = d.image_slug
left join public.entities a on a.slug = d.agent_slug
where not exists (
  select 1 from public.image_authorships ia
  where ia.image_entity_id = i.id
    and ia.authorship_type = d.authorship_type
    and ia.role_name = d.role_name
    and ia.agent_entity_id is not distinct from a.id
);

insert into public.steps (
  entity_id, step_type, current_condition, description, style, materials,
  dimensions_text, length_cm, width_cm, height_cm, carrier_system,
  execution_date_text, current_state_notes
)
select e.id, d.step_type, 'preserved', d.description, d.style, d.materials,
       d.dimensions_text, d.length_cm, d.width_cm, d.height_cm, 'Costaleros',
       d.execution_date_text, d.current_state_notes
from (values
  ('paso-misterio-cristo-aguas-sevilla', 'Misterio', 'Representa la muerte de Cristo en el Calvario, con Nuestra Madre y Señora del Mayor Dolor, San Juan Evangelista, Santa María Magdalena y el ángel que recoge en un cáliz la sangre y el agua del costado.', 'Barroco', 'Madera de cedro tallada, dorada y estofada', '561 × 264 × 373 cm, incluidas maniguetas y candelabros sin guardabrisas', 561::numeric, 264::numeric, 373::numeric, 'Talla completa estrenada en 2007; dorado concluido en 2011', 'Canastilla, crestería y respiraderos de Hermanos Caballero; candelabros de Mariano Sánchez del Pino; dorado y estofado de Enrique Castellanos; cartelas de Fernando Aguado.'),
  ('paso-palio-guadalupe-las-aguas-sevilla', 'Palio', 'Paso de palio de María Santísima de Guadalupe, con bambalinas azules y un programa ornamental vinculado a Guadalupe, la Inmaculada y el Santo Rosario.', 'Neobarroco sevillano', 'Terciopelo azul bordado en oro y orfebrería de plata', null::text, null::numeric, null::numeric, null::numeric, 'Palio bordado en 1988; techo de palio diseñado y ejecutado en 2005', 'Bordados de Sobrinos de Esperanza Elena Caro; techo diseñado por Luis Álvarez Duarte y bordado por Charo Bernardino; diseños ornamentales de Antonio Dubé de Luque.')
) as d(slug, step_type, description, style, materials, dimensions_text, length_cm, width_cm, height_cm, execution_date_text, current_state_notes)
join public.entities e on e.slug = d.slug
on conflict (entity_id) do update set
  step_type = excluded.step_type,
  current_condition = excluded.current_condition,
  description = excluded.description,
  style = excluded.style,
  materials = excluded.materials,
  dimensions_text = excluded.dimensions_text,
  length_cm = excluded.length_cm,
  width_cm = excluded.width_cm,
  height_cm = excluded.height_cm,
  carrier_system = excluded.carrier_system,
  execution_date_text = excluded.execution_date_text,
  current_state_notes = excluded.current_state_notes;

with step_link_data as (
  select * from (values
    ('paso-misterio-cristo-aguas-sevilla', 'Paso de misterio actual.'),
    ('paso-palio-guadalupe-las-aguas-sevilla', 'Paso de palio actual.')
  ) as d(step_slug, notes)
)
insert into public.brotherhood_steps (
  brotherhood_entity_id, step_entity_id, relation_type, notes, status
)
select h.id, st.id, 'processional_step', d.notes, 'published'
from step_link_data d
join public.entities h on h.slug = 'las-aguas-sevilla'
join public.entities st on st.slug = d.step_slug
where not exists (
  select 1 from public.brotherhood_steps bs
  where bs.brotherhood_entity_id = h.id and bs.step_entity_id = st.id
    and bs.relation_type = 'processional_step' and bs.date_to is null
);

update public.brotherhood_steps bs
set status = 'published', notes = 'Paso de misterio actual.'
from public.entities h, public.entities st
where h.slug = 'las-aguas-sevilla'
  and st.slug = 'paso-misterio-cristo-aguas-sevilla'
  and bs.brotherhood_entity_id = h.id
  and bs.step_entity_id = st.id
  and bs.date_to is null;

insert into public.brotherhood_habits (
  brotherhood_entity_id, name, tunic_description, hood_description,
  cord_description, notes, sort_order, status
)
select h.id, 'Hábito de nazareno', 'Túnica blanca de cola',
       'Antifaz morado', 'Cinturón de esparto de 15 cm de ancho',
       'Indumentaria descrita por el Consejo de Hermandades y Cofradías de Sevilla.',
       1, 'published'
from public.entities h where h.slug = 'las-aguas-sevilla'
on conflict (brotherhood_entity_id, name) do update set
  tunic_description = excluded.tunic_description,
  hood_description = excluded.hood_description,
  cord_description = excluded.cord_description,
  notes = excluded.notes,
  sort_order = excluded.sort_order,
  status = excluded.status,
  updated_at = now();

with color_data as (
  select * from (values
    ('Morado', null::text, 'primary', 1, 'Color del antifaz y de la identidad penitencial.'),
    ('Blanco', null::text, 'secondary', 2, 'Color de la túnica de cola.')
  ) as d(color_name, hex_value, color_role, sort_order, notes)
)
insert into public.brotherhood_colors (
  brotherhood_entity_id, color_name, hex_value, color_role, sort_order, notes, status
)
select h.id, d.color_name, d.hex_value, d.color_role, d.sort_order, d.notes, 'published'
from color_data d join public.entities h on h.slug = 'las-aguas-sevilla'
on conflict (brotherhood_entity_id, color_name) do update set
  hex_value = excluded.hex_value,
  color_role = excluded.color_role,
  sort_order = excluded.sort_order,
  notes = excluded.notes,
  status = excluded.status,
  updated_at = now();

with personnel_data as (
  select * from (values
    ('paso-misterio-cristo-aguas-sevilla', 'Capataz', 2019, 'Capataz general de la cofradía; al frente de ambos pasos.'),
    ('paso-palio-guadalupe-las-aguas-sevilla', 'Capataz', 2019, 'Capataz general de la cofradía; al frente de ambos pasos.')
  ) as d(step_slug, role_name, year_from, notes)
)
insert into public.step_personnel_periods (
  step_entity_id, agent_entity_id, role_name, year_from, is_current, notes, status
)
select st.id, a.id, d.role_name, d.year_from, true, d.notes, 'published'
from personnel_data d
join public.entities st on st.slug = d.step_slug
join public.entities a on a.slug = 'gonzalo-carrion-fernandez'
where not exists (
  select 1 from public.step_personnel_periods spp
  where spp.step_entity_id = st.id and spp.agent_entity_id = a.id
    and spp.role_name = d.role_name and spp.is_current
);

with music_data as (
  select * from (values
    ('centuria-romana-macarena', null::text, 'Cruz de Guía · sección juvenil', 'Vigente en la estación de penitencia de 2026; inicio por documentar', 'La sección juvenil de la Centuria abre el cortejo.'),
    ('banda-municipal-musica-mairena-del-alcor', 'paso-palio-guadalupe-las-aguas-sevilla', 'Tras el paso de palio', 'Vigente en la estación de penitencia de 2026; inicio por documentar', 'Acompañamiento musical actual de María Santísima de Guadalupe.')
  ) as d(band_slug, step_slug, position, date_from_text, notes)
)
insert into public.music_accompaniment_periods (
  brotherhood_entity_id, band_entity_id, step_entity_id, position, outing_type,
  date_from_text, is_current, notes, status,
  public_brotherhood_name, public_step_name, public_brotherhood_slug,
  public_municipality_name, public_municipality_slug, public_province
)
select h.id, b.id, st.id, d.position, 'Lunes Santo',
       d.date_from_text, true, d.notes, 'published',
       'Hermandad de las Aguas',
       case when d.step_slug is null then 'Cruz de Guía' else 'María Santísima de Guadalupe' end,
       'las-aguas-sevilla', 'Sevilla', 'sevilla', 'Sevilla'
from music_data d
join public.entities h on h.slug = 'las-aguas-sevilla'
join public.entities b on b.slug = d.band_slug
left join public.entities st on st.slug = d.step_slug
where not exists (
  select 1 from public.music_accompaniment_periods mp
  where mp.brotherhood_entity_id = h.id and mp.band_entity_id = b.id
    and mp.step_entity_id is not distinct from st.id
    and mp.position = d.position and mp.is_current
);

update public.music_accompaniment_periods mp
set status = 'published',
    public_brotherhood_name = 'Hermandad de las Aguas',
    public_step_name = 'Santísimo Cristo de las Aguas',
    public_brotherhood_slug = 'las-aguas-sevilla',
    public_municipality_name = 'Sevilla',
    public_municipality_slug = 'sevilla',
    public_province = 'Sevilla',
    updated_at = now()
from public.entities h, public.entities b, public.entities st
where h.slug = 'las-aguas-sevilla'
  and b.slug = 'banda-cornetas-tambores-rosario-cadiz'
  and st.slug = 'paso-misterio-cristo-aguas-sevilla'
  and mp.brotherhood_entity_id = h.id
  and mp.band_entity_id = b.id
  and mp.step_entity_id = st.id
  and mp.is_current;

update public.places p
set opening_hours_text = E'Apertura\nLunes y viernes · 18:30–20:30\nDomingos · 12:00–14:00\nSábados · Cerrado\n\nMisas\nViernes · 20:30\nDomingos y festivos · 13:00',
    opening_hours_verified_at = date '2026-09-01',
    updated_at = now()
where p.slug = 'capilla-nuestra-senora-rosario-dos-mayo';

with entity_source_data as (
  select * from (values
    ('santisimo-cristo-aguas-sevilla', 'https://www.hermandaddelasaguas.org/titulares/stmo-cristo-de-las-aguas', 'Identidad, autoría y cronología'),
    ('nuestra-madre-senora-mayor-dolor-las-aguas', 'https://www.hermandaddelasaguas.org/titulares/ntra-madre-y-senora-del-mayor-dolor', 'Identidad y ficha oficial'),
    ('maria-santisima-guadalupe-las-aguas', 'https://www.hermandaddelasaguas.org/titulares/maria-santisima-de-guadalupe', 'Identidad, autoría y cronología'),
    ('nuestra-senora-rosario-las-aguas', 'https://www.hermandaddelasaguas.org/titulares/ntra-sra-del-rosario', 'Identidad y ficha oficial'),
    ('paso-misterio-cristo-aguas-sevilla', 'https://www.hermandaddelasaguas.org/cofradia/pasos/paso-de-misterio', 'Descripción patrimonial y dimensiones'),
    ('paso-palio-guadalupe-las-aguas-sevilla', 'https://www.hermandaddelasaguas.org/cofradia/pasos/paso-de-palio', 'Descripción patrimonial')
  ) as d(entity_slug, source_url, scope)
)
insert into public.source_links (source_id, entity_id, scope, notes)
select s.id, e.id, d.scope, 'Certificación editorial de Las Aguas · 1 de septiembre de 2026'
from entity_source_data d
join public.entities e on e.slug = d.entity_slug
join public.sources s on s.url = d.source_url
where not exists (
  select 1 from public.source_links sl
  where sl.source_id = s.id and sl.entity_id = e.id and sl.scope = d.scope
);

with authorship_source_data as (
  select * from (values
    ('santisimo-cristo-aguas-sevilla', 'antonio-illanes-rodriguez', 'autor', 'https://www.hermandaddelasaguas.org/titulares/stmo-cristo-de-las-aguas'),
    ('nuestra-madre-senora-mayor-dolor-las-aguas', 'jose-romero-morillo', 'autor', 'https://www.hermandades-de-sevilla.org/semanasanta/ls_las_aguas.html'),
    ('nuestra-madre-senora-mayor-dolor-las-aguas', 'antonio-eslava-rubio', 'sacado de punto', 'https://www.hermandades-de-sevilla.org/semanasanta/ls_las_aguas.html'),
    ('maria-santisima-guadalupe-las-aguas', 'luis-alvarez-duarte', 'autor', 'https://www.hermandaddelasaguas.org/titulares/maria-santisima-de-guadalupe')
  ) as d(image_slug, agent_slug, role_name, source_url)
)
insert into public.source_links (source_id, image_authorship_id, scope, notes)
select s.id, ia.id, 'Autoría', 'Autoría y cronología de la imagen.'
from authorship_source_data d
join public.entities i on i.slug = d.image_slug
join public.entities a on a.slug = d.agent_slug
join public.image_authorships ia on ia.image_entity_id = i.id and ia.agent_entity_id = a.id and ia.role_name = d.role_name
join public.sources s on s.url = d.source_url
where not exists (
  select 1 from public.source_links sl
  where sl.source_id = s.id and sl.image_authorship_id = ia.id
);

insert into public.source_links (source_id, image_authorship_id, scope, notes)
select s.id, ia.id, 'Autoría', 'Obra anónima del siglo XVIII; la cercanía estilística no se convierte en atribución.'
from public.entities i
join public.image_authorships ia on ia.image_entity_id = i.id and ia.authorship_type = 'anonymous'
join public.sources s on s.url = 'https://www.hermandaddelasaguas.org/titulares/ntra-sra-del-rosario'
where i.slug = 'nuestra-senora-rosario-las-aguas'
and not exists (
  select 1 from public.source_links sl
  where sl.source_id = s.id and sl.image_authorship_id = ia.id
);

with brotherhood_step_source_data as (
  select * from (values
    ('paso-misterio-cristo-aguas-sevilla', 'https://www.hermandaddelasaguas.org/cofradia/pasos/paso-de-misterio'),
    ('paso-palio-guadalupe-las-aguas-sevilla', 'https://www.hermandaddelasaguas.org/cofradia/pasos/paso-de-palio')
  ) as d(step_slug, source_url)
)
insert into public.source_links (source_id, brotherhood_step_id, scope, notes)
select s.id, bs.id, 'Paso procesional', 'Relación vigente entre la Hermandad y el paso.'
from brotherhood_step_source_data d
join public.entities h on h.slug = 'las-aguas-sevilla'
join public.entities st on st.slug = d.step_slug
join public.brotherhood_steps bs on bs.brotherhood_entity_id = h.id and bs.step_entity_id = st.id and bs.date_to is null
join public.sources s on s.url = d.source_url
where not exists (
  select 1 from public.source_links sl
  where sl.source_id = s.id and sl.brotherhood_step_id = bs.id
);

insert into public.source_links (source_id, brotherhood_habit_id, scope, notes)
select s.id, bh.id, 'Hábito de nazareno', 'Túnica blanca de cola, antifaz morado y cinturón de esparto de 15 cm.'
from public.entities h
join public.brotherhood_habits bh on bh.brotherhood_entity_id = h.id and bh.name = 'Hábito de nazareno'
join public.sources s on s.url = 'https://www.hermandades-de-sevilla.org/semanasanta/ls_las_aguas.html'
where h.slug = 'las-aguas-sevilla'
and not exists (
  select 1 from public.source_links sl
  where sl.source_id = s.id and sl.brotherhood_habit_id = bh.id
);

insert into public.source_links (source_id, step_personnel_period_id, scope, notes)
select s.id, spp.id, 'Capataz general', 'Nombramiento vigente desde la Semana Santa de 2019.'
from public.entities a
join public.step_personnel_periods spp on spp.agent_entity_id = a.id and spp.is_current
join public.entities st on st.id = spp.step_entity_id
join public.sources s on s.url = 'https://www.gentedepaz.es/gonzalo-carrion-capataz-general-de-las-aguas/'
where a.slug = 'gonzalo-carrion-fernandez'
  and st.slug in ('paso-misterio-cristo-aguas-sevilla', 'paso-palio-guadalupe-las-aguas-sevilla')
and not exists (
  select 1 from public.source_links sl
  where sl.source_id = s.id and sl.step_personnel_period_id = spp.id
);

insert into public.source_links (source_id, music_accompaniment_period_id, scope, notes)
select s.id, mp.id, 'Acompañamiento musical 2026', 'Relación musical vigente publicada por el Consejo de Hermandades.'
from public.entities h
join public.music_accompaniment_periods mp on mp.brotherhood_entity_id = h.id and mp.is_current
join public.entities b on b.id = mp.band_entity_id
join public.sources s on s.url = 'https://www.hermandades-de-sevilla.org/semanasanta/ls_las_aguas.html'
where h.slug = 'las-aguas-sevilla'
  and b.slug in ('centuria-romana-macarena', 'banda-municipal-musica-mairena-del-alcor')
and not exists (
  select 1 from public.source_links sl
  where sl.source_id = s.id and sl.music_accompaniment_period_id = mp.id
);

insert into public.source_links (source_id, entity_location_id, scope, notes)
select s.id, el.id, 'Sede y horarios', 'Horario de apertura y misas verificado el 1 de septiembre de 2026.'
from public.entities h
join public.entity_locations el on el.entity_id = h.id and el.is_current
join public.places p on p.id = el.place_id and p.slug = 'capilla-nuestra-senora-rosario-dos-mayo'
join public.sources s on s.url = 'https://www.hermandaddelasaguas.org/'
where h.slug = 'las-aguas-sevilla'
and not exists (
  select 1 from public.source_links sl
  where sl.source_id = s.id and sl.entity_location_id = el.id and sl.scope = 'Sede y horarios'
);

do $$
declare
  image_count integer;
  step_count integer;
  music_count integer;
  personnel_count integer;
  habit_count integer;
  invalid_links integer;
begin
  select count(*) into image_count
  from public.brotherhood_images bi
  join public.entities h on h.id = bi.brotherhood_entity_id
  join public.entities i on i.id = bi.image_entity_id
  where h.slug = 'las-aguas-sevilla' and bi.status = 'published'
    and i.status = 'published' and bi.date_to is null;

  select count(*) into step_count
  from public.brotherhood_steps bs
  join public.entities h on h.id = bs.brotherhood_entity_id
  join public.entities st on st.id = bs.step_entity_id
  join public.steps s on s.entity_id = st.id
  where h.slug = 'las-aguas-sevilla' and bs.status = 'published'
    and st.status = 'published' and bs.date_to is null;

  select count(*) into music_count
  from public.music_accompaniment_periods mp
  join public.entities h on h.id = mp.brotherhood_entity_id
  where h.slug = 'las-aguas-sevilla' and mp.is_current and mp.status = 'published';

  select count(*) into personnel_count
  from public.step_personnel_periods spp
  join public.entities st on st.id = spp.step_entity_id
  where st.slug in ('paso-misterio-cristo-aguas-sevilla', 'paso-palio-guadalupe-las-aguas-sevilla')
    and spp.is_current and spp.status = 'published';

  select count(*) into habit_count
  from public.brotherhood_habits bh
  join public.entities h on h.id = bh.brotherhood_entity_id
  where h.slug = 'las-aguas-sevilla' and bh.status = 'published';

  select count(*) into invalid_links
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

  if image_count <> 4 then raise exception 'Las Aguas no queda con cuatro titulares publicados'; end if;
  if step_count <> 2 then raise exception 'Las Aguas no queda con dos pasos publicados'; end if;
  if music_count <> 3 then raise exception 'Las Aguas no queda con tres posiciones musicales actuales'; end if;
  if personnel_count <> 2 then raise exception 'Las Aguas no queda con capataz actual en ambos pasos'; end if;
  if habit_count <> 1 then raise exception 'Las Aguas no queda con hábito publicado'; end if;
  if invalid_links <> 0 then raise exception 'El lote deja vínculos de Fuente inválidos'; end if;
end $$;
