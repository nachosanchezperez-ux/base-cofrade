-- Hilo Cofrade · repertorio interpretado de la Divina Pastora de Padre Pío
-- Procesión de Gloria · Sevilla · 12 de septiembre de 2026
-- Solo DML editorial. Sin DDL, RLS, arquitectura ni UX nueva.

begin;

do $preflight$
begin
  if (
    select count(*) from public.entities
    where entity_type = 'brotherhood' and slug = 'pastora-padre-pio' and status = 'published'
  ) <> 1 then
    raise exception 'La Hermandad de la Pastora de Padre Pío no es unívoca';
  end if;

  if (
    select count(*) from public.entities step
    join public.brotherhood_steps relation on relation.step_entity_id = step.id
    join public.entities brotherhood on brotherhood.id = relation.brotherhood_entity_id
    where brotherhood.slug = 'pastora-padre-pio'
      and step.slug = 'paso-procesional-divina-pastora-padre-pio'
      and step.status = 'published'
  ) <> 1 then
    raise exception 'El paso de la Divina Pastora de Padre Pío no es unívoco';
  end if;

  if (
    select count(*) from public.places
    where slug = 'parroquia-buen-pastor-san-juan-cruz-padre-pio'
  ) <> 1 then
    raise exception 'La sede de la Pastora de Padre Pío no es unívoca';
  end if;
end
$preflight$;

insert into public.sources (name, url, source_type, author_or_publisher, publication_date, accessed_at, notes)
select
  'Repertorio interpretado · Divina Pastora de Padre Pío 2026',
  null,
  'social_media',
  'Banda de Música Ciudad de Dos Hermanas',
  null,
  date '2026-09-13',
  'Lámina publicada por la formación tras la procesión. Enumera 29 interpretaciones tras el paso, con el Himno Nacional al inicio y al cierre, y Ganando Barlovento como pasacalles. No documenta puntos del recorrido ni consecutividad.'
where not exists (
  select 1 from public.sources
  where name = 'Repertorio interpretado · Divina Pastora de Padre Pío 2026'
    and author_or_publisher = 'Banda de Música Ciudad de Dos Hermanas'
);

insert into public.sources (name, url, source_type, author_or_publisher, publication_date, accessed_at, notes)
select
  'La Divina Pastora de Padre Pío volvió a recorrer su barrio en el Dulce Nombre de María',
  'https://www.artesacro.org/Noticia/Ver/169053/divina-pastora-padre-pio-volvio-recorrer-su-barrio-dulce-nombre-maria',
  'Medio especializado',
  'Arte Sacro',
  date '2026-09-13',
  date '2026-09-13',
  'Crónica contemporánea para la celebración de la procesión, la salida a las 20:00, el itinerario, la sede y el acompañamiento de la Banda de Música Ciudad de Dos Hermanas.'
where not exists (
  select 1 from public.sources
  where url = 'https://www.artesacro.org/Noticia/Ver/169053/divina-pastora-padre-pio-volvio-recorrer-su-barrio-dulce-nombre-maria'
);

insert into public.entities (entity_type, name, slug, summary, status)
select
  'band',
  'Banda de Música Ciudad de Dos Hermanas',
  'banda-musica-ciudad-dos-hermanas',
  'Formación musical nazarena fundada en 2018 y dirigida por José Ramón Lozano Garrido.',
  'published'
where not exists (
  select 1 from public.entities
  where entity_type = 'band' and slug = 'banda-musica-ciudad-dos-hermanas'
);

update public.entities
set name = 'Banda de Música Ciudad de Dos Hermanas',
    summary = 'Formación musical nazarena fundada en 2018 y dirigida por José Ramón Lozano Garrido.',
    status = 'published',
    updated_at = now()
where entity_type = 'band' and slug = 'banda-musica-ciudad-dos-hermanas';

insert into public.bands (
  entity_id, band_type, municipality_id, foundation_text, instagram_url,
  description, headquarters_text
)
select
  band.id,
  'Banda de Música',
  municipality.id,
  '16 de diciembre de 2018',
  'https://www.instagram.com/bmciudaddoshnas/',
  'Banda de música de Dos Hermanas que acompañó a la Divina Pastora de Padre Pío en su procesión del 12 de septiembre de 2026.',
  'Dos Hermanas (Sevilla)'
from public.entities band
join public.municipalities municipality on municipality.slug = 'dos-hermanas'
where band.slug = 'banda-musica-ciudad-dos-hermanas'
on conflict (entity_id) do update set
  band_type = excluded.band_type,
  municipality_id = excluded.municipality_id,
  foundation_text = excluded.foundation_text,
  instagram_url = excluded.instagram_url,
  description = excluded.description,
  headquarters_text = excluded.headquarters_text;

do $outing$
declare
  v_brotherhood_id uuid;
  v_place_id uuid;
  v_municipality_id uuid;
begin
  select id into strict v_brotherhood_id from public.entities
  where entity_type = 'brotherhood' and slug = 'pastora-padre-pio';

  select id, municipality_id into strict v_place_id, v_municipality_id from public.places
  where slug = 'parroquia-buen-pastor-san-juan-cruz-padre-pio';

  insert into public.outings (
    brotherhood_entity_id, outing_type, character, title, outing_date, year,
    departure_time, municipality_id, origin_place_id, destination_place_id,
    origin_text, destination_text, reason, route_summary, description,
    public_notes, event_status, status, slug, organizer_name
  )
  select
    v_brotherhood_id,
    'Procesión de Gloria',
    'ordinary',
    'Procesión de la Divina Pastora de las Almas de Padre Pío 2026',
    date '2026-09-12',
    2026,
    time '20:00',
    v_municipality_id,
    v_place_id,
    v_place_id,
    'Parroquia del Buen Pastor y San Juan de la Cruz',
    'Parroquia del Buen Pastor y San Juan de la Cruz',
    'Festividad del Dulce Nombre de María',
    'Vía de servicio, Ronda de la Doctora Oeste, San Juan de Aznalfarache, Alájar, Mairena del Aljarafe, Valencina de la Concepción, Lora de Estepa, Las Cabezas de San Juan, La Puebla del Río, Ronda de Padre Pío, Rafael García Minguel, Castilleja de la Cuesta, Carrión de los Céspedes, La Puebla de Cazalla, Castilblanco de los Arroyos, Bollullos, El Castillo de las Guardas, Villaverde, La Pañoleta y Martín de la Jara.',
    'Procesión de Gloria de la Divina Pastora de las Almas por las calles de Padre Pío, acompañada musicalmente por la Banda de Música Ciudad de Dos Hermanas.',
    'La edición coincidió con el XXV aniversario de la Parroquia del Buen Pastor y San Juan de la Cruz.',
    'held',
    'published',
    'procesion-divina-pastora-padre-pio-2026',
    'Hermandad de la Divina Pastora de Padre Pío'
  where not exists (
    select 1 from public.outings where slug = 'procesion-divina-pastora-padre-pio-2026'
  );

  update public.outings
  set brotherhood_entity_id = v_brotherhood_id,
      outing_type = 'Procesión de Gloria',
      character = 'ordinary',
      title = 'Procesión de la Divina Pastora de las Almas de Padre Pío 2026',
      outing_date = date '2026-09-12',
      year = 2026,
      departure_time = time '20:00',
      municipality_id = v_municipality_id,
      origin_place_id = v_place_id,
      destination_place_id = v_place_id,
      origin_text = 'Parroquia del Buen Pastor y San Juan de la Cruz',
      destination_text = 'Parroquia del Buen Pastor y San Juan de la Cruz',
      reason = 'Festividad del Dulce Nombre de María',
      route_summary = 'Vía de servicio, Ronda de la Doctora Oeste, San Juan de Aznalfarache, Alájar, Mairena del Aljarafe, Valencina de la Concepción, Lora de Estepa, Las Cabezas de San Juan, La Puebla del Río, Ronda de Padre Pío, Rafael García Minguel, Castilleja de la Cuesta, Carrión de los Céspedes, La Puebla de Cazalla, Castilblanco de los Arroyos, Bollullos, El Castillo de las Guardas, Villaverde, La Pañoleta y Martín de la Jara.',
      description = 'Procesión de Gloria de la Divina Pastora de las Almas por las calles de Padre Pío, acompañada musicalmente por la Banda de Música Ciudad de Dos Hermanas.',
      public_notes = 'La edición coincidió con el XXV aniversario de la Parroquia del Buen Pastor y San Juan de la Cruz.',
      event_status = 'held',
      status = 'published',
      organizer_name = 'Hermandad de la Divina Pastora de Padre Pío',
      updated_at = now()
  where slug = 'procesion-divina-pastora-padre-pio-2026';
end
$outing$;

insert into public.outing_music_positions (
  outing_id, step_entity_id, position_code, position_label, sequence_no, notes, status
)
select outing.id, step.id, 'behind_step', 'Tras el paso', 1,
       'Acompañamiento musical documentado para toda la procesión.', 'published'
from public.outings outing
join public.entities step on step.slug = 'paso-procesional-divina-pastora-padre-pio'
where outing.slug = 'procesion-divina-pastora-padre-pio-2026'
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
select position.id, band.id, 'full_route', 1,
       'La banda acompañó a la Divina Pastora durante toda la procesión.', 'published'
from public.outing_music_positions position
join public.outings outing on outing.id = position.outing_id
join public.entities band on band.slug = 'banda-musica-ciudad-dos-hermanas'
where outing.slug = 'procesion-divina-pastora-padre-pio-2026'
  and position.sequence_no = 1
on conflict (music_position_id, band_entity_id, sequence_no) do update set
  participation_mode = excluded.participation_mode,
  notes = excluded.notes,
  status = excluded.status;

with author_seed(name, slug) as (values
  ('Ramón Sáez de Adana Lauzurica', 'ramon-saez-de-adana-lauzurica'),
  ('Vladimir Vavilov', 'vladimir-vavilov'),
  ('José Ramón Lozano Garrido', 'jose-ramon-lozano-garrido'),
  ('Martín Salas Martínez', 'martin-salas-martinez'),
  ('Jesús Manuel Martín Prieto', 'jesus-manuel-martin-prieto'),
  ('Rubén Jordán Flores', 'ruben-jordan-flores'),
  ('Antonio David Rodríguez Gómez', 'antonio-david-rodriguez-gomez'),
  ('José Miguel López Rueda', 'jose-miguel-lopez-rueda'),
  ('José Ramón Lozano Piña', 'jose-ramon-lozano-pina')
)
insert into public.entities (entity_type, name, slug, summary, status)
select 'agent', seed.name, seed.slug,
       'Autor vinculado a una obra del repertorio interpretado por la Banda de Música Ciudad de Dos Hermanas en 2026.',
       'published'
from author_seed seed
where not exists (
  select 1 from public.entities entity
  where entity.entity_type = 'agent'
    and lower(translate(entity.name, 'ÁÉÍÓÚÜÑáéíóúüñ', 'AEIOUUNaeiouun')) =
        lower(translate(seed.name, 'ÁÉÍÓÚÜÑáéíóúüñ', 'AEIOUUNaeiouun'))
);

with author_seed(name) as (values
  ('Ramón Sáez de Adana Lauzurica'),('Vladimir Vavilov'),('José Ramón Lozano Garrido'),
  ('Martín Salas Martínez'),('Jesús Manuel Martín Prieto'),('Rubén Jordán Flores'),
  ('Antonio David Rodríguez Gómez'),('José Miguel López Rueda'),('José Ramón Lozano Piña')
)
insert into public.agents (entity_id, agent_kind, description)
select entity.id, 'person', entity.summary
from author_seed seed
join public.entities entity on entity.entity_type = 'agent'
  and lower(translate(entity.name, 'ÁÉÍÓÚÜÑáéíóúüñ', 'AEIOUUNaeiouun')) =
      lower(translate(seed.name, 'ÁÉÍÓÚÜÑáéíóúüñ', 'AEIOUUNaeiouun'))
on conflict (entity_id) do nothing;

with march_seed(slug, title, work_type) as (values
  ('ganando-barlovento-ramon-saez-adana', 'Ganando Barlovento', 'Adaptación'),
  ('ave-maria-vavilov-arreglo-lozano-garrido', 'Ave María', 'Adaptación'),
  ('himno-nacional-de-espana', 'Himno Nacional de España', 'Himno'),
  ('coronacion-puntas-marvizon', 'Coronación', 'Marcha procesional'),
  ('rosario-de-montesion-juan-velazquez', 'Rosario de Montesión', 'Marcha procesional'),
  ('marcha-el-dia-del-senor', 'El Día del Señor', 'Marcha procesional'),
  ('espiritu-santo-pablo-ojeda', 'Espíritu Santo', 'Marcha procesional'),
  ('madruga-macarena-pablo-ojeda', 'Madrugá Macarena', 'Marcha procesional'),
  ('callejuela-de-la-o-paco-lola-martin-salas', 'Callejuela de la O', 'Marcha procesional'),
  ('virgen-de-la-palma-manuel-marvizon', 'Virgen de la Palma', 'Marcha procesional'),
  ('virgen-de-la-paz-pedro-morales', 'Virgen de la Paz', 'Marcha procesional'),
  ('la-estrella-sublime-manuel-lopez-farfan', 'La Estrella Sublime', 'Marcha procesional'),
  ('siempre-la-esperanza-jesus-joaquin-espinosa', 'Siempre la Esperanza', 'Marcha procesional'),
  ('pasan-los-campanilleros-manuel-lopez-farfan', 'Pasan los Campanilleros', 'Marcha procesional'),
  ('esperanza-macarena-pedro-morales', 'Esperanza Macarena', 'Marcha procesional'),
  ('triana-tu-esperanza-jose-de-la-vega', 'Triana, tú Esperanza', 'Marcha procesional'),
  ('marcha-encarnacion-coronada-bm-1994', 'Encarnación Coronada', 'Marcha procesional'),
  ('amanecer-con-triana-jesus-manuel-martin', 'Amanecer con Triana', 'Marcha procesional'),
  ('se-siempre-nuestra-esperanza-ruben-jordan', 'Sé Siempre Nuestra Esperanza', 'Marcha procesional'),
  ('rocio-manuel-ruiz-vidriet', 'Rocío', 'Marcha procesional'),
  ('marcha-caridad-del-guadalquivir', 'Caridad del Guadalquivir', 'Marcha procesional'),
  ('marcha-la-caridad-del-arenal', 'La Caridad del Arenal', 'Marcha procesional'),
  ('marcha-reina', '¡Reina!', 'Marcha procesional'),
  ('madre-tu-dulce-nombre-antonio-david-rodriguez', 'Madre, tu Dulce Nombre', 'Marcha procesional'),
  ('dolores-del-cerro-coronada-jose-miguel-lopez', 'Dolores del Cerro Coronada', 'Marcha procesional'),
  ('macarena-abel-moreno', 'Macarena', 'Marcha procesional'),
  ('triana-felix-de-carboneras', 'Triana', 'Marcha procesional'),
  ('hermanos-costaleros-abel-moreno', 'Hermanos Costaleros', 'Marcha procesional'),
  ('madre-jose-ramon-lozano-pina', 'Madre', 'Marcha procesional')
)
insert into public.entities (entity_type, name, slug, summary, status)
select 'march', seed.title, seed.slug,
       'Obra documentada en el repertorio interpretado tras la Divina Pastora de Padre Pío el 12 de septiembre de 2026.',
       'published'
from march_seed seed
where not exists (
  select 1 from public.entities entity
  where entity.entity_type = 'march' and entity.slug = seed.slug
);

with march_seed(slug, work_type) as (values
  ('ganando-barlovento-ramon-saez-adana', 'Adaptación'),
  ('ave-maria-vavilov-arreglo-lozano-garrido', 'Adaptación'),
  ('himno-nacional-de-espana', 'Himno'),
  ('coronacion-puntas-marvizon', 'Marcha procesional'),('rosario-de-montesion-juan-velazquez', 'Marcha procesional'),
  ('marcha-el-dia-del-senor', 'Marcha procesional'),('espiritu-santo-pablo-ojeda', 'Marcha procesional'),
  ('madruga-macarena-pablo-ojeda', 'Marcha procesional'),('callejuela-de-la-o-paco-lola-martin-salas', 'Marcha procesional'),
  ('virgen-de-la-palma-manuel-marvizon', 'Marcha procesional'),('virgen-de-la-paz-pedro-morales', 'Marcha procesional'),
  ('la-estrella-sublime-manuel-lopez-farfan', 'Marcha procesional'),('siempre-la-esperanza-jesus-joaquin-espinosa', 'Marcha procesional'),
  ('pasan-los-campanilleros-manuel-lopez-farfan', 'Marcha procesional'),('esperanza-macarena-pedro-morales', 'Marcha procesional'),
  ('triana-tu-esperanza-jose-de-la-vega', 'Marcha procesional'),('marcha-encarnacion-coronada-bm-1994', 'Marcha procesional'),
  ('amanecer-con-triana-jesus-manuel-martin', 'Marcha procesional'),('se-siempre-nuestra-esperanza-ruben-jordan', 'Marcha procesional'),
  ('rocio-manuel-ruiz-vidriet', 'Marcha procesional'),('marcha-caridad-del-guadalquivir', 'Marcha procesional'),
  ('marcha-la-caridad-del-arenal', 'Marcha procesional'),('marcha-reina', 'Marcha procesional'),
  ('madre-tu-dulce-nombre-antonio-david-rodriguez', 'Marcha procesional'),('dolores-del-cerro-coronada-jose-miguel-lopez', 'Marcha procesional'),
  ('macarena-abel-moreno', 'Marcha procesional'),('triana-felix-de-carboneras', 'Marcha procesional'),
  ('hermanos-costaleros-abel-moreno', 'Marcha procesional'),('madre-jose-ramon-lozano-pina', 'Marcha procesional')
)
insert into public.marches (entity_id, music_type, work_type, description, eligible_for_daily)
select entity.id, 'Banda de Música', seed.work_type,
       'Interpretada por la Banda de Música Ciudad de Dos Hermanas en la procesión de la Divina Pastora de Padre Pío de 2026.',
       false
from march_seed seed
join public.entities entity on entity.entity_type = 'march' and entity.slug = seed.slug
where not exists (select 1 from public.marches march where march.entity_id = entity.id);

with author_seed(march_slug, author_name, author_role) as (values
  ('ganando-barlovento-ramon-saez-adana', 'Ramón Sáez de Adana Lauzurica', 'composer'),
  ('ave-maria-vavilov-arreglo-lozano-garrido', 'Vladimir Vavilov', 'composer'),
  ('ave-maria-vavilov-arreglo-lozano-garrido', 'José Ramón Lozano Garrido', 'arranger'),
  ('callejuela-de-la-o-paco-lola-martin-salas', 'Paco Lola', 'composer'),
  ('callejuela-de-la-o-paco-lola-martin-salas', 'Martín Salas Martínez', 'composer'),
  ('virgen-de-la-palma-manuel-marvizon', 'Manuel Marvizón Carvallo', 'composer'),
  ('amanecer-con-triana-jesus-manuel-martin', 'Jesús Manuel Martín Prieto', 'composer'),
  ('se-siempre-nuestra-esperanza-ruben-jordan', 'Rubén Jordán Flores', 'composer'),
  ('madre-tu-dulce-nombre-antonio-david-rodriguez', 'Antonio David Rodríguez Gómez', 'composer'),
  ('dolores-del-cerro-coronada-jose-miguel-lopez', 'José Miguel López Rueda', 'composer'),
  ('hermanos-costaleros-abel-moreno', 'Abel Moreno Gómez', 'composer'),
  ('madre-jose-ramon-lozano-pina', 'José Ramón Lozano Piña', 'composer')
)
insert into public.march_authors (march_entity_id, agent_entity_id, author_role, status)
select march.id, author.id, seed.author_role, 'published'
from author_seed seed
join public.entities march on march.entity_type = 'march' and march.slug = seed.march_slug
join public.entities author on author.entity_type = 'agent'
  and lower(translate(author.name, 'ÁÉÍÓÚÜÑáéíóúüñ', 'AEIOUUNaeiouun')) =
      lower(translate(seed.author_name, 'ÁÉÍÓÚÜÑáéíóúüñ', 'AEIOUUNaeiouun'))
where not exists (
  select 1 from public.march_authors existing
  where existing.march_entity_id = march.id
    and existing.agent_entity_id = author.id
    and existing.author_role = seed.author_role
    and existing.status <> 'archived'
);

do $cruceta$
declare
  v_outing_id uuid;
  v_band_id uuid;
  v_step_id uuid;
  v_source_id uuid;
  v_article_source_id uuid;
  v_position_id uuid;
  v_assignment_id uuid;
  v_repertoire_id uuid;
begin
  select id into strict v_outing_id from public.outings
  where slug = 'procesion-divina-pastora-padre-pio-2026';
  select id into strict v_band_id from public.entities
  where entity_type = 'band' and slug = 'banda-musica-ciudad-dos-hermanas';
  select id into strict v_step_id from public.entities
  where entity_type = 'step' and slug = 'paso-procesional-divina-pastora-padre-pio';
  select id into strict v_source_id from public.sources
  where name = 'Repertorio interpretado · Divina Pastora de Padre Pío 2026'
    and author_or_publisher = 'Banda de Música Ciudad de Dos Hermanas'
  order by created_at limit 1;
  select id into strict v_article_source_id from public.sources
  where url = 'https://www.artesacro.org/Noticia/Ver/169053/divina-pastora-padre-pio-volvio-recorrer-su-barrio-dulce-nombre-maria'
  order by created_at limit 1;
  select position.id into strict v_position_id
  from public.outing_music_positions position
  where position.outing_id = v_outing_id and position.sequence_no = 1;
  select assignment.id into strict v_assignment_id
  from public.outing_music_assignments assignment
  where assignment.music_position_id = v_position_id
    and assignment.band_entity_id = v_band_id and assignment.sequence_no = 1;

  insert into public.source_links (source_id, entity_id, scope, notes)
  select v_article_source_id, v_band_id, 'Identidad y trayectoria',
         'Fuente contemporánea para la fundación, procedencia y dirección musical de la banda.'
  where not exists (
    select 1 from public.source_links where source_id = v_article_source_id and entity_id = v_band_id
  );

  insert into public.source_links (source_id, outing_id, scope, notes)
  select v_article_source_id, v_outing_id, 'Crónica de la salida',
         'Confirma la celebración, la hora de salida, la sede, el itinerario y el acompañamiento musical.'
  where not exists (
    select 1 from public.source_links where source_id = v_article_source_id and outing_id = v_outing_id
  );

  insert into public.source_links (source_id, outing_music_assignment_id, scope, notes)
  select v_article_source_id, v_assignment_id, 'Acompañamiento musical',
         'Confirma a la Banda de Música Ciudad de Dos Hermanas durante toda la procesión.'
  where not exists (
    select 1 from public.source_links
    where source_id = v_article_source_id and outing_music_assignment_id = v_assignment_id
  );

  insert into public.musical_repertoires (
    slug, outing_id, band_entity_id, step_entity_id, source_id, title,
    repertoire_kind, notes, status
  ) values (
    'divina-pastora-padre-pio-procesion-2026',
    v_outing_id,
    v_band_id,
    v_step_id,
    v_source_id,
    'Repertorio interpretado tras la Divina Pastora de Padre Pío · 2026',
    'performed',
    'La fuente documenta 29 interpretaciones tras el paso y un pasacalles. El Himno Nacional figura dos veces; se conserva como ×2 sin deducir consecutividad.',
    'published'
  )
  on conflict (slug) do update set
    outing_id = excluded.outing_id,
    band_entity_id = excluded.band_entity_id,
    step_entity_id = excluded.step_entity_id,
    source_id = excluded.source_id,
    title = excluded.title,
    repertoire_kind = excluded.repertoire_kind,
    notes = excluded.notes,
    status = excluded.status,
    updated_at = now()
  returning id into v_repertoire_id;

  delete from public.musical_repertoire_entries where repertoire_id = v_repertoire_id;

  with entry_seed(display_order, march_slug, display_title, source_credit, performance_count, notes) as (values
    (1, 'ganando-barlovento-ramon-saez-adana', 'Ganando Barlovento', null::text, 1, 'Pasacalles indicado separadamente por la fuente.'),
    (2, 'ave-maria-vavilov-arreglo-lozano-garrido', 'Ave María', null::text, 1, null::text),
    (3, 'himno-nacional-de-espana', 'Himno Nacional de España', null::text, 2, 'La fuente lo enumera al inicio y al cierre del repertorio.'),
    (4, 'coronacion-puntas-marvizon', 'Coronación', null::text, 1, null::text),
    (5, 'rosario-de-montesion-juan-velazquez', 'Rosario de Montesión', null::text, 1, null::text),
    (6, 'marcha-el-dia-del-senor', 'El Día del Señor', null::text, 1, null::text),
    (7, 'espiritu-santo-pablo-ojeda', 'Espíritu Santo', null::text, 1, null::text),
    (8, 'madruga-macarena-pablo-ojeda', 'Madrugá Macarena', null::text, 1, null::text),
    (9, 'callejuela-de-la-o-paco-lola-martin-salas', 'Callejuela de la O', null::text, 1, null::text),
    (10, 'virgen-de-la-palma-manuel-marvizon', 'Virgen de la Palma', null::text, 1, null::text),
    (11, 'virgen-de-la-paz-pedro-morales', 'Virgen de la Paz', null::text, 1, null::text),
    (12, 'la-estrella-sublime-manuel-lopez-farfan', 'La Estrella Sublime', null::text, 1, null::text),
    (13, 'siempre-la-esperanza-jesus-joaquin-espinosa', 'Siempre la Esperanza', null::text, 1, null::text),
    (14, 'pasan-los-campanilleros-manuel-lopez-farfan', 'Pasan los Campanilleros', null::text, 1, null::text),
    (15, 'esperanza-macarena-pedro-morales', 'Esperanza Macarena', null::text, 1, null::text),
    (16, 'triana-tu-esperanza-jose-de-la-vega', 'Triana tu Esperanza', null::text, 1, null::text),
    (17, 'marcha-encarnacion-coronada-bm-1994', 'Encarnación Coronada', null::text, 1, null::text),
    (18, 'amanecer-con-triana-jesus-manuel-martin', 'Amanecer con Triana', null::text, 1, null::text),
    (19, 'se-siempre-nuestra-esperanza-ruben-jordan', 'Sé Siempre Nuestra Esperanza', null::text, 1, null::text),
    (20, 'rocio-manuel-ruiz-vidriet', 'Rocío', null::text, 1, null::text),
    (21, 'marcha-caridad-del-guadalquivir', 'Caridad del Guadalquivir', null::text, 1, null::text),
    (22, 'marcha-la-caridad-del-arenal', 'La Caridad del Arenal', null::text, 1, null::text),
    (23, 'marcha-reina', 'Reina', null::text, 1, null::text),
    (24, 'madre-tu-dulce-nombre-antonio-david-rodriguez', 'Madre tu Dulce Nombre', null::text, 1, null::text),
    (25, 'dolores-del-cerro-coronada-jose-miguel-lopez', 'Dolores del Cerro Coronada', null::text, 1, null::text),
    (26, 'macarena-abel-moreno', 'Macarena', 'Abel Moreno', 1, null::text),
    (27, 'triana-felix-de-carboneras', 'Triana', null::text, 1, null::text),
    (28, 'hermanos-costaleros-abel-moreno', 'Hermanos Costaleros', null::text, 1, null::text),
    (29, 'madre-jose-ramon-lozano-pina', 'Madre', null::text, 1, null::text)
  )
  insert into public.musical_repertoire_entries (
    repertoire_id, march_entity_id, display_title, source_credit,
    performance_count, display_order, notes
  )
  select v_repertoire_id, march.id, seed.display_title, seed.source_credit,
         seed.performance_count, seed.display_order, seed.notes
  from entry_seed seed
  join public.entities march on march.entity_type = 'march' and march.slug = seed.march_slug;

  if (select count(*) from public.musical_repertoire_entries where repertoire_id = v_repertoire_id) <> 29 then
    raise exception 'La cruceta de la Pastora de Padre Pío debe contener 29 obras distintas';
  end if;

  if (select sum(performance_count) from public.musical_repertoire_entries where repertoire_id = v_repertoire_id) <> 30 then
    raise exception 'La cruceta de la Pastora de Padre Pío debe sumar 30 interpretaciones';
  end if;

  if (
    select performance_count from public.musical_repertoire_entries entry
    join public.entities march on march.id = entry.march_entity_id
    where entry.repertoire_id = v_repertoire_id and march.slug = 'himno-nacional-de-espana'
  ) <> 2 then
    raise exception 'El Himno Nacional debe conservar sus dos apariciones documentadas';
  end if;

  if (
    select count(*) from public.outing_music_assignments assignment
    where assignment.music_position_id = v_position_id
      and assignment.band_entity_id = v_band_id and assignment.status = 'published'
  ) <> 1 then
    raise exception 'La Banda Ciudad de Dos Hermanas no ha quedado vinculada a la salida';
  end if;
end
$cruceta$;

commit;
