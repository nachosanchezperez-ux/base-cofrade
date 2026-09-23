-- Hilo Cofrade · repertorio interpretado de Nuestra Señora del Carmen de Estepa
-- 12 de septiembre de 2026 · Banda de Música de Estepa
-- Solo DML editorial. Sin DDL, RLS, arquitectura ni UX nueva.

begin;

do $preflight$
begin
  if (
    select count(*) from public.outings
    where slug = 'estepa-carmen-2026-09-12'
      and outing_date = date '2026-09-12'
      and status = 'published'
  ) <> 1 then
    raise exception 'La procesión de Nuestra Señora del Carmen de Estepa no es unívoca';
  end if;

  if (
    select count(*) from public.entities
    where entity_type = 'band'
      and slug = 'banda-musica-estepa'
      and status = 'published'
  ) <> 1 then
    raise exception 'La Banda de Música de Estepa no es unívoca';
  end if;

  if (
    select count(*) from public.entities
    where entity_type = 'step'
      and slug = 'paso-carmen-estepa'
      and status = 'published'
  ) <> 1 then
    raise exception 'El paso de Nuestra Señora del Carmen de Estepa no es unívoco';
  end if;

  if (
    select count(*)
    from public.outing_music_assignments assignment
    join public.outing_music_positions position on position.id = assignment.music_position_id
    join public.outings outing on outing.id = position.outing_id
    where outing.slug = 'estepa-carmen-2026-09-12'
      and position.position_code = 'after_step'
      and assignment.band_entity_id = (
        select id from public.entities
        where entity_type = 'band' and slug = 'banda-musica-estepa'
      )
      and assignment.status = 'published'
  ) <> 1 then
    raise exception 'El acompañamiento de la Banda de Música de Estepa no es unívoco';
  end if;
end
$preflight$;

insert into public.sources (name, url, source_type, author_or_publisher, publication_date, accessed_at, notes)
select
  'Repertorio interpretado · Nuestra Señora del Carmen de Estepa 2026',
  null,
  'social_media',
  'Banda de Música de Estepa',
  null,
  date '2026-09-23',
  'Carrusel oficial completo de tres láminas. Documenta 28 obras distintas y 28 interpretaciones, sin indicar multiplicidades, puntos del recorrido, chicotás ni cronología interna.'
where not exists (
  select 1 from public.sources
  where name = 'Repertorio interpretado · Nuestra Señora del Carmen de Estepa 2026'
    and author_or_publisher = 'Banda de Música de Estepa'
);

with author_seed(name, slug) as (values
  ('Braulio Uralde Bringas', 'braulio-uralde-bringas'),
  ('Manuel Jesús Rodríguez Lara', 'manuel-jesus-rodriguez-lara'),
  ('Francisco Javier Sojo Blanco', 'francisco-javier-sojo-blanco'),
  ('Alfonso Lozano Ruiz', 'alfonso-lozano-ruiz'),
  ('Eloy García López', 'eloy-garcia-lopez'),
  ('Cristóbal Oudrid', 'cristobal-oudrid'),
  ('Juan Antonio Carmona Páez', 'juan-antonio-carmona-paez'),
  ('Bartolomé Pérez Casas', 'bartolome-perez-casas'),
  ('Francisco Grau Vegara', 'francisco-grau-vegara')
)
insert into public.entities (entity_type, name, slug, summary, status)
select 'agent', seed.name, seed.slug,
       'Autor vinculado al repertorio interpretado por la Banda de Música de Estepa tras Nuestra Señora del Carmen en 2026.',
       'published'
from author_seed seed
where not exists (
  select 1 from public.entities entity
  where entity.entity_type = 'agent'
    and lower(translate(entity.name, 'ÁÉÍÓÚÜÑáéíóúüñ', 'AEIOUUNaeiouun')) =
        lower(translate(seed.name, 'ÁÉÍÓÚÜÑáéíóúüñ', 'AEIOUUNaeiouun'))
);

with author_seed(name) as (values
  ('Braulio Uralde Bringas'),
  ('Manuel Jesús Rodríguez Lara'),
  ('Francisco Javier Sojo Blanco'),
  ('Alfonso Lozano Ruiz'),
  ('Eloy García López'),
  ('Cristóbal Oudrid'),
  ('Juan Antonio Carmona Páez'),
  ('Bartolomé Pérez Casas'),
  ('Francisco Grau Vegara')
)
insert into public.agents (entity_id, agent_kind, description)
select entity.id, 'person', entity.summary
from author_seed seed
join public.entities entity on entity.entity_type = 'agent'
  and lower(translate(entity.name, 'ÁÉÍÓÚÜÑáéíóúüñ', 'AEIOUUNaeiouun')) =
      lower(translate(seed.name, 'ÁÉÍÓÚÜÑáéíóúüñ', 'AEIOUUNaeiouun'))
on conflict (entity_id) do nothing;

with march_seed(slug, title) as (values
  ('nuestro-padre-jesus-emilio-cebrian', 'Nuestro Padre Jesús'),
  ('corpus-christi-braulio-uralde', 'Corpus Christi'),
  ('el-cielo-de-castillejos-manuel-jesus-rodriguez', 'El Cielo de Castillejos'),
  ('dogma-de-la-asuncion-pedro-morales', 'Dogma de la Asunción'),
  ('esperanza-del-cielo-francisco-javier-sojo', 'Esperanza del Cielo'),
  ('danos-la-paz-jesus-joaquin-espinosa', 'Danos la Paz'),
  ('cristo-de-la-vera-cruz-manuel-borrego', 'Cristo de la Vera Cruz'),
  ('la-sangre-y-la-gloria-alfonso-lozano', 'La Sangre y la Gloria'),
  ('hiniesta-jose-martinez-peralto', 'Hiniesta'),
  ('alma-de-la-trinidad-eloy-garcia', 'Alma de la Trinidad'),
  ('virgen-de-la-estrella-pedro-gamez-laserna', 'Virgen de la Estrella'),
  ('maria-santisima-del-subterraneo-pedro-gamez-laserna', 'María Santísima del Subterráneo'),
  ('salve-cristobal-oudrid-juan-antonio-carmona', 'Salve')
)
insert into public.entities (entity_type, name, slug, summary, status)
select 'march', seed.title, seed.slug,
       'Obra documentada en el repertorio interpretado por la Banda de Música de Estepa tras Nuestra Señora del Carmen el 12 de septiembre de 2026.',
       'published'
from march_seed seed
where not exists (
  select 1 from public.entities entity
  where entity.entity_type = 'march' and entity.slug = seed.slug
);

with march_seed(slug) as (values
  ('nuestro-padre-jesus-emilio-cebrian'),
  ('corpus-christi-braulio-uralde'),
  ('el-cielo-de-castillejos-manuel-jesus-rodriguez'),
  ('dogma-de-la-asuncion-pedro-morales'),
  ('esperanza-del-cielo-francisco-javier-sojo'),
  ('danos-la-paz-jesus-joaquin-espinosa'),
  ('cristo-de-la-vera-cruz-manuel-borrego'),
  ('la-sangre-y-la-gloria-alfonso-lozano'),
  ('hiniesta-jose-martinez-peralto'),
  ('alma-de-la-trinidad-eloy-garcia'),
  ('virgen-de-la-estrella-pedro-gamez-laserna'),
  ('maria-santisima-del-subterraneo-pedro-gamez-laserna'),
  ('salve-cristobal-oudrid-juan-antonio-carmona')
)
insert into public.marches (entity_id, music_type, work_type, description, eligible_for_daily)
select entity.id, 'Banda de Música', 'Marcha procesional',
       'Interpretada por la Banda de Música de Estepa tras Nuestra Señora del Carmen el 12 de septiembre de 2026.',
       false
from march_seed seed
join public.entities entity on entity.entity_type = 'march' and entity.slug = seed.slug
where not exists (select 1 from public.marches march where march.entity_id = entity.id);

with author_seed(march_slug, author_name, author_role) as (values
  ('nuestro-padre-jesus-emilio-cebrian', 'Emilio Cebrián Ruiz', 'composer'),
  ('corpus-christi-braulio-uralde', 'Braulio Uralde Bringas', 'composer'),
  ('el-cielo-de-castillejos-manuel-jesus-rodriguez', 'Manuel Jesús Rodríguez Lara', 'composer'),
  ('dogma-de-la-asuncion-pedro-morales', 'Pedro Morales Muñoz', 'composer'),
  ('esperanza-del-cielo-francisco-javier-sojo', 'Francisco Javier Sojo Blanco', 'composer'),
  ('danos-la-paz-jesus-joaquin-espinosa', 'Jesús Joaquín Espinosa de los Monteros Pérez', 'composer'),
  ('cristo-de-la-vera-cruz-manuel-borrego', 'Manuel Borrego Hernández', 'composer'),
  ('la-sangre-y-la-gloria-alfonso-lozano', 'Alfonso Lozano Ruiz', 'composer'),
  ('hiniesta-jose-martinez-peralto', 'José Martínez Peralto', 'composer'),
  ('alma-de-la-trinidad-eloy-garcia', 'Eloy García López', 'composer'),
  ('virgen-de-la-estrella-pedro-gamez-laserna', 'Pedro Gámez Laserna', 'composer'),
  ('maria-santisima-del-subterraneo-pedro-gamez-laserna', 'Pedro Gámez Laserna', 'composer'),
  ('salve-cristobal-oudrid-juan-antonio-carmona', 'Cristóbal Oudrid', 'composer'),
  ('salve-cristobal-oudrid-juan-antonio-carmona', 'Juan Antonio Carmona Páez', 'arranger'),
  ('himno-nacional-espana', 'Bartolomé Pérez Casas', 'arranger'),
  ('himno-nacional-espana', 'Francisco Grau Vegara', 'arranger')
)
insert into public.march_authors (march_entity_id, agent_entity_id, author_role, notes, status)
select march.id, author.id, seed.author_role,
       case when seed.march_slug = 'himno-nacional-espana'
         then 'Crédito instrumental consignado por la fuente de la Banda de Música de Estepa.'
         else null end,
       'published'
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

with dedication_seed(march_slug, dedicatee_slug, dedication_text) as (values
  ('el-cielo-de-castillejos-manuel-jesus-rodriguez', 'nuestra-senora-asuncion-estepa', 'Dedicada a Nuestra Señora de la Asunción de Estepa.'),
  ('esperanza-del-cielo-francisco-javier-sojo', 'maria-santisima-esperanza-coronada-estepa', 'Dedicada a María Santísima de la Esperanza Coronada de Estepa.'),
  ('dogma-de-la-asuncion-pedro-morales', 'nuestra-senora-de-la-asuncion-cantillana', 'Dedicada a Nuestra Señora de la Asunción de Cantillana.'),
  ('cristo-de-la-vera-cruz-manuel-borrego', 'santisimo-cristo-vera-cruz-alcala-del-rio', 'Dedicada al Santísimo Cristo de la Vera-Cruz de Alcalá del Río.')
)
insert into public.march_dedications (
  march_entity_id, dedicatee_entity_id, dedication_type, dedication_text, notes, status
)
select march.id, dedicatee.id, 'dedicated_to', seed.dedication_text,
       'Vinculación editorial contrastada al incorporar la cruceta de Nuestra Señora del Carmen de Estepa de 2026.',
       'published'
from dedication_seed seed
join public.entities march on march.entity_type = 'march' and march.slug = seed.march_slug
join public.entities dedicatee on dedicatee.slug = seed.dedicatee_slug
on conflict (march_entity_id, dedicatee_entity_id, dedication_type) do update set
  dedication_text = excluded.dedication_text,
  notes = excluded.notes,
  status = excluded.status;

-- Tres grabaciones de la propia Banda ya estaban catalogadas sin vínculo a la marcha.
with track_link(track_title, march_slug) as (values
  ('Danos la Paz', 'danos-la-paz-jesus-joaquin-espinosa'),
  ('Esperanza Del Cielo', 'esperanza-del-cielo-francisco-javier-sojo'),
  ('Procesión de Semana Santa en Sevilla', 'procesion-de-semana-santa-en-sevilla-pascual-marquina')
)
update public.band_release_tracks track
set march_entity_id = march.id
from public.band_releases release,
     track_link seed
join public.entities march on march.entity_type = 'march' and march.slug = seed.march_slug
join public.entities band on band.entity_type = 'band' and band.slug = 'banda-musica-estepa'
where track.release_id = release.id
  and release.band_entity_id = band.id
  and lower(track.title) = lower(seed.track_title);

do $cruceta$
declare
  v_outing_id uuid;
  v_band_id uuid;
  v_step_id uuid;
  v_source_id uuid;
  v_repertoire_id uuid;
  v_assignment_id uuid;
begin
  select id into strict v_outing_id from public.outings where slug = 'estepa-carmen-2026-09-12';
  select id into strict v_band_id from public.entities
  where entity_type = 'band' and slug = 'banda-musica-estepa';
  select id into strict v_step_id from public.entities
  where entity_type = 'step' and slug = 'paso-carmen-estepa';
  select id into strict v_source_id from public.sources
  where name = 'Repertorio interpretado · Nuestra Señora del Carmen de Estepa 2026'
    and author_or_publisher = 'Banda de Música de Estepa'
  order by created_at limit 1;
  select assignment.id into strict v_assignment_id
  from public.outing_music_assignments assignment
  join public.outing_music_positions position on position.id = assignment.music_position_id
  where position.outing_id = v_outing_id
    and position.position_code = 'after_step'
    and assignment.band_entity_id = v_band_id;

  insert into public.source_links (source_id, outing_id, scope, notes)
  select v_source_id, v_outing_id, 'Repertorio interpretado',
         'Fuente directa del repertorio interpretado tras Nuestra Señora del Carmen de Estepa.'
  where not exists (
    select 1 from public.source_links where source_id = v_source_id and outing_id = v_outing_id
  );

  insert into public.source_links (source_id, outing_music_assignment_id, scope, notes)
  select v_source_id, v_assignment_id, 'Acompañamiento musical',
         'Vincula la cruceta con la Banda de Música de Estepa.'
  where not exists (
    select 1 from public.source_links
    where source_id = v_source_id and outing_music_assignment_id = v_assignment_id
  );

  insert into public.musical_repertoires (
    slug, outing_id, band_entity_id, step_entity_id, source_id, title,
    repertoire_kind, notes, status
  ) values (
    'virgen-carmen-estepa-procesion-2026',
    v_outing_id,
    v_band_id,
    v_step_id,
    v_source_id,
    'Repertorio interpretado de Nuestra Señora del Carmen · 12 de septiembre de 2026',
    'performed',
    'El carrusel oficial completo consta de tres láminas y documenta 28 obras distintas y 28 interpretaciones. El orden de visualización conserva la sucesión editorial de la fuente, sin deducir orden cronológico, punto del recorrido, chicotá ni consecutividad. «Esperanza de Triana Coronada» conserva el crédito literal «José Alberto Francés» y se vincula a la ficha canónica de José Albero Francés.',
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
    (1, 'esperanza-de-triana-coronada-jose-albero', 'Esperanza de Triana Coronada', 'José Alberto Francés', 1, 'La fuente consigna «José Alberto Francés»; se reconcilia con el autor canónico José Albero Francés.'),
    (2, 'nuestro-padre-jesus-emilio-cebrian', 'Nuestro Padre Jesús', 'Emilio Cebrián Ruiz', 1, null),
    (3, 'corpus-christi-braulio-uralde', 'Corpus Christi', 'Braulio Uralde Bringas', 1, null),
    (4, 'hiniesta-coronada-jose-albero', 'Hiniesta Coronada', 'José Albero Francés', 1, null),
    (5, 'el-cielo-de-castillejos-manuel-jesus-rodriguez', 'El Cielo de Castillejos', 'Manuel Jesús Rodríguez Lara', 1, null),
    (6, 'dogma-de-la-asuncion-pedro-morales', 'Dogma de la Asunción', 'Pedro Morales Muñoz', 1, null),
    (7, 'marcha-al-cielo-con-ella', 'Al Cielo con Ella', 'Pedro Morales Muñoz', 1, null),
    (8, 'marcha-virgen-de-los-negritos-pedro-morales', 'Virgen de los Negritos', 'Pedro Morales Muñoz', 1, null),
    (9, 'pasa-la-virgen-macarena-pedro-gamez-laserna', 'Pasa la Virgen Macarena', 'Pedro Gámez Laserna', 1, null),
    (10, 'esperanza-del-cielo-francisco-javier-sojo', 'Esperanza del Cielo', 'Francisco Javier Sojo Blanco', 1, null),
    (11, 'danos-la-paz-jesus-joaquin-espinosa', 'Danos la Paz', 'J.J. Espinosa', 1, 'Se conserva el crédito abreviado de la fuente y se vincula al autor canónico Jesús Joaquín Espinosa de los Monteros Pérez.'),
    (12, 'cristo-de-la-vera-cruz-manuel-borrego', 'Cristo de la Vera Cruz', 'Manuel Borrego Hernández', 1, null),
    (13, 'la-sangre-y-la-gloria-alfonso-lozano', 'La Sangre y la Gloria', 'Alfonso Lozano Ruiz', 1, null),
    (14, 'marcha-nuestra-senora-guadalupe-pantion-1968', 'Nuestra Señora de Guadalupe', 'Antonio Pantión Pérez', 1, null),
    (15, 'coronacion-de-la-macarena-pedro-brana', 'Coronación de la Macarena', 'Pedro Braña Martínez', 1, null),
    (16, 'senorita-de-triana-pedro-morales', 'Señorita de Triana', 'Pedro Morales Muñoz', 1, null),
    (17, 'hiniesta-jose-martinez-peralto', 'Hiniesta', 'José Martínez Peralto', 1, null),
    (18, 'macarena-emilio-cebrian', 'Macarena', 'Emilio Cebrián Ruiz', 1, 'La autoría distingue esta obra de las marchas homónimas ya catalogadas.'),
    (19, 'alma-de-la-trinidad-eloy-garcia', 'Alma de la Trinidad', 'Eloy García López', 1, null),
    (20, 'virgen-de-la-estrella-pedro-gamez-laserna', 'Virgen de la Estrella', 'Pedro Gámez Laserna', 1, null),
    (21, 'pasan-los-campanilleros-manuel-lopez-farfan', 'Pasan los Campanilleros', 'Manuel López Farfán', 1, null),
    (22, 'triana-tu-esperanza-jose-de-la-vega', 'Triana, tu Esperanza', 'José de la Vega Sánchez', 1, null),
    (23, 'maria-santisima-del-subterraneo-pedro-gamez-laserna', 'María Santísima del Subterráneo', 'Pedro Gámez Laserna', 1, null),
    (24, 'virgen-de-montserrat-pedro-morales', 'Virgen de Montserrat', 'Pedro Morales Muñoz', 1, null),
    (25, 'virgen-de-la-paz-pedro-morales', 'Virgen de la Paz', 'Pedro Morales Muñoz', 1, null),
    (26, 'procesion-de-semana-santa-en-sevilla-pascual-marquina', 'Procesión de Semana Santa en Sevilla', 'Pascual Marquina Narro', 1, null),
    (27, 'salve-cristobal-oudrid-juan-antonio-carmona', 'Salve', 'Cristóbal Oudrid · adap. Juan Antonio Carmona Páez', 1, null),
    (28, 'himno-nacional-espana', 'Himno Nacional', 'Bartolomé Pérez Casas y Francisco Grau Vegara', 1, null)
  )
  insert into public.musical_repertoire_entries (
    repertoire_id, march_entity_id, display_title, source_credit,
    performance_count, display_order, notes
  )
  select v_repertoire_id, march.id, seed.display_title, seed.source_credit,
         seed.performance_count, seed.display_order, seed.notes
  from entry_seed seed
  join public.entities march on march.entity_type = 'march' and march.slug = seed.march_slug;

  if (select count(*) from public.musical_repertoire_entries where repertoire_id = v_repertoire_id) <> 28 then
    raise exception 'La cruceta de Nuestra Señora del Carmen de Estepa debe contener 28 obras distintas';
  end if;

  if (select sum(performance_count) from public.musical_repertoire_entries where repertoire_id = v_repertoire_id) <> 28 then
    raise exception 'La cruceta de Nuestra Señora del Carmen de Estepa debe sumar 28 interpretaciones';
  end if;

  if (
    select march.slug
    from public.musical_repertoire_entries entry
    join public.entities march on march.id = entry.march_entity_id
    where entry.repertoire_id = v_repertoire_id and entry.display_title = 'Macarena'
  ) <> 'macarena-emilio-cebrian' then
    raise exception 'Macarena debe quedar vinculada a Emilio Cebrián Ruiz';
  end if;
end
$cruceta$;

commit;
