-- Hilo Cofrade · repertorio interpretado en el Rosario de la Aurora
-- Santa Genoveva · 27 de septiembre de 2026 · Carmen de Salteras
-- Solo DML editorial. Sin DDL, RLS, arquitectura ni UX nueva.

begin;

do $preflight$
begin
  if (
    select count(*) from public.outings
    where slug = 'sevilla-santa-genoveva-mercedes-rosario-2026-09-27'
      and outing_date = date '2026-09-27'
      and status = 'published'
  ) <> 1 then
    raise exception 'El Rosario de la Aurora de Nuestra Señora de las Mercedes Coronada no es unívoco';
  end if;

  if (
    select count(*) from public.entities
    where entity_type = 'brotherhood'
      and slug = 'santa-genoveva'
      and status = 'published'
  ) <> 1 then
    raise exception 'La Hermandad de Santa Genoveva no es unívoca';
  end if;

  if (
    select count(*) from public.entities
    where entity_type = 'image'
      and slug = 'nuestra-senora-mercedes-coronada-santa-genoveva'
      and status = 'published'
  ) <> 1 then
    raise exception 'Nuestra Señora de las Mercedes Coronada no es unívoca';
  end if;

  if (
    select count(*) from public.entities
    where entity_type = 'band'
      and slug = 'carmen-de-salteras'
      and status = 'published'
  ) <> 1 then
    raise exception 'Carmen de Salteras no es una Banda canónica unívoca';
  end if;

  if (
    select count(*)
    from public.outing_music_assignments assignment
    join public.outing_music_positions position on position.id = assignment.music_position_id
    join public.outings outing on outing.id = position.outing_id
    join public.entities band on band.id = assignment.band_entity_id
    where outing.slug = 'sevilla-santa-genoveva-mercedes-rosario-2026-09-27'
      and position.position_label = 'Regreso del Rosario de la Aurora'
      and band.slug = 'carmen-de-salteras'
      and assignment.status = 'published'
  ) <> 1 then
    raise exception 'El acompañamiento de Carmen de Salteras en el regreso no es unívoco';
  end if;
end
$preflight$;

update public.outings
set event_status = 'held',
    updated_at = now()
where slug = 'sevilla-santa-genoveva-mercedes-rosario-2026-09-27'
  and event_status <> 'held';

insert into public.sources (name, url, source_type, author_or_publisher, publication_date, accessed_at, notes)
select
  'Repertorio interpretado · Rosario de la Aurora de Nuestra Señora de las Mercedes Coronada 2026',
  null,
  'social_media',
  'Carmen de Salteras',
  date '2026-09-27',
  date '2026-09-27',
  'Lámina oficial publicada por la Banda tras el Rosario. Documenta 13 menciones consolidadas en 12 obras distintas; Reina de las Mercedes figura dos veces. No informa de calles, chicotás ni consecutividad.'
where not exists (
  select 1 from public.sources
  where name = 'Repertorio interpretado · Rosario de la Aurora de Nuestra Señora de las Mercedes Coronada 2026'
    and author_or_publisher = 'Carmen de Salteras'
);

with author_seed(name, slug) as (values
  ('Pedro Gálvez Jiménez', 'pedro-galvez-jimenez'),
  ('José Manuel García Pulido', 'jose-manuel-garcia-pulido'),
  ('Rafael Wals Dantas', 'rafael-wals-dantas')
)
insert into public.entities (entity_type, name, slug, summary, status)
select 'agent', seed.name, seed.slug,
       'Compositor vinculado al repertorio interpretado por Carmen de Salteras en el Rosario de Nuestra Señora de las Mercedes Coronada de 2026.',
       'published'
from author_seed seed
where not exists (
  select 1 from public.entities entity
  where entity.entity_type = 'agent'
    and lower(translate(entity.name, 'ÁÉÍÓÚÜÑáéíóúüñ', 'AEIOUUNaeiouun')) =
        lower(translate(seed.name, 'ÁÉÍÓÚÜÑáéíóúüñ', 'AEIOUUNaeiouun'))
);

with author_seed(slug) as (values
  ('pedro-galvez-jimenez'),
  ('jose-manuel-garcia-pulido'),
  ('rafael-wals-dantas')
)
insert into public.agents (entity_id, agent_kind, description)
select entity.id, 'person', entity.summary
from author_seed seed
join public.entities entity on entity.entity_type = 'agent' and entity.slug = seed.slug
on conflict (entity_id) do nothing;

with march_seed(slug, title) as (values
  ('la-virgen-de-las-mercedes-pedro-galvez', 'La Virgen de las Mercedes'),
  ('reina-de-las-mercedes-juan-velazquez', 'Reina de las Mercedes'),
  ('senora-de-santa-genoveva-jose-manuel-garcia-pulido', 'Señora de Santa Genoveva'),
  ('la-virgen-del-carmen-rafael-wals-dantas', 'La Virgen del Carmen'),
  ('virgen-macarena-francisco-javier-alonso-delgado', 'Virgen Macarena'),
  ('mercedes-cristobal-lopez-gandara', 'Mercedes'),
  ('virgen-de-las-mercedes-manuel-marvizon', 'Virgen de las Mercedes')
)
insert into public.entities (entity_type, name, slug, summary, status)
select 'march', seed.title, seed.slug,
       'Obra documentada en el repertorio interpretado por Carmen de Salteras en el regreso del Rosario de Nuestra Señora de las Mercedes Coronada el 27 de septiembre de 2026.',
       'published'
from march_seed seed
where not exists (
  select 1 from public.entities entity
  where entity.entity_type = 'march' and entity.slug = seed.slug
);

with march_seed(slug, composition_year) as (values
  ('la-virgen-de-las-mercedes-pedro-galvez', 2024),
  ('reina-de-las-mercedes-juan-velazquez', 1993),
  ('senora-de-santa-genoveva-jose-manuel-garcia-pulido', 2003),
  ('la-virgen-del-carmen-rafael-wals-dantas', 2012),
  ('virgen-macarena-francisco-javier-alonso-delgado', 2005),
  ('mercedes-cristobal-lopez-gandara', 2021),
  ('virgen-de-las-mercedes-manuel-marvizon', 2006)
)
insert into public.marches (
  entity_id, composition_year, music_type, work_type, description, eligible_for_daily
)
select entity.id, seed.composition_year, 'Banda de Música', 'Marcha procesional',
       'Interpretada por Carmen de Salteras en el regreso del Rosario de Nuestra Señora de las Mercedes Coronada el 27 de septiembre de 2026.',
       false
from march_seed seed
join public.entities entity on entity.entity_type = 'march' and entity.slug = seed.slug
where not exists (select 1 from public.marches march where march.entity_id = entity.id);

with author_seed(march_slug, author_slug) as (values
  ('la-virgen-de-las-mercedes-pedro-galvez', 'pedro-galvez-jimenez'),
  ('reina-de-las-mercedes-juan-velazquez', 'juan-velazquez-sanchez'),
  ('senora-de-santa-genoveva-jose-manuel-garcia-pulido', 'jose-manuel-garcia-pulido'),
  ('la-virgen-del-carmen-rafael-wals-dantas', 'rafael-wals-dantas'),
  ('virgen-macarena-francisco-javier-alonso-delgado', 'javier-alonso-delgado'),
  ('mercedes-cristobal-lopez-gandara', 'cristobal-lopez-gandara'),
  ('virgen-de-las-mercedes-manuel-marvizon', 'manuel-marvizon-carvallo')
)
insert into public.march_authors (march_entity_id, agent_entity_id, author_role, notes, status)
select march.id, author.id, 'composer',
       case when seed.march_slug = 'virgen-macarena-francisco-javier-alonso-delgado'
         then 'La fuente firma Francisco Javier Alonso Delgado; se reutiliza la ficha canónica Javier Alonso Delgado.'
         else null end,
       'published'
from author_seed seed
join public.entities march on march.entity_type = 'march' and march.slug = seed.march_slug
join public.entities author on author.entity_type = 'agent' and author.slug = seed.author_slug
where not exists (
  select 1 from public.march_authors existing
  where existing.march_entity_id = march.id
    and existing.agent_entity_id = author.id
    and existing.author_role = 'composer'
    and existing.status <> 'archived'
);

with dedication_seed(march_slug, dedicatee_slug, dedication_text) as (values
  ('la-virgen-de-las-mercedes-pedro-galvez', 'nuestra-senora-mercedes-coronada-santa-genoveva', 'Dedicada a Nuestra Señora de las Mercedes Coronada de Santa Genoveva.'),
  ('reina-de-las-mercedes-juan-velazquez', 'nuestra-senora-mercedes-coronada-santa-genoveva', 'Dedicada a Nuestra Señora de las Mercedes Coronada de Santa Genoveva.'),
  ('senora-de-santa-genoveva-jose-manuel-garcia-pulido', 'nuestra-senora-mercedes-coronada-santa-genoveva', 'Dedicada a Nuestra Señora de las Mercedes Coronada de Santa Genoveva.'),
  ('virgen-macarena-francisco-javier-alonso-delgado', 'maria-santisima-esperanza-macarena', 'Dedicada a María Santísima de la Esperanza Macarena.'),
  ('mercedes-cristobal-lopez-gandara', 'nuestra-senora-mercedes-coronada-santa-genoveva', 'Dedicada a Nuestra Señora de las Mercedes Coronada de Santa Genoveva.'),
  ('virgen-de-las-mercedes-manuel-marvizon', 'nuestra-senora-mercedes-coronada-santa-genoveva', 'Dedicada a la Hermandad de Santa Genoveva y a Nuestra Señora de las Mercedes Coronada.'),
  ('coronacion-puntas-marvizon', 'nuestra-senora-dolores-cerro-aguila', 'Dedicada a Nuestra Señora de los Dolores del Cerro del Águila con motivo de su coronación canónica.'),
  ('rosario-de-montesion-juan-velazquez', 'maria-santisima-rosario-monte-sion-sevilla', 'Dedicada a María Santísima del Rosario en sus Misterios Dolorosos de Monte-Sión.'),
  ('pasa-la-virgen-macarena-pedro-gamez-laserna', 'maria-santisima-esperanza-macarena', 'Dedicada a María Santísima de la Esperanza Macarena.'),
  ('pasan-los-campanilleros-manuel-lopez-farfan', 'siete-palabras-sevilla', 'Dedicada a la Hermandad de las Siete Palabras de Sevilla.')
)
insert into public.march_dedications (
  march_entity_id, dedicatee_entity_id, dedication_type, dedication_text, notes, status
)
select march.id, dedicatee.id, 'dedicated_to', seed.dedication_text,
       'Vinculación editorial contrastada al incorporar la cruceta del Rosario de las Mercedes de Santa Genoveva de 2026.',
       'published'
from dedication_seed seed
join public.entities march on march.entity_type = 'march' and march.slug = seed.march_slug
join public.entities dedicatee on dedicatee.slug = seed.dedicatee_slug
on conflict (march_entity_id, dedicatee_entity_id, dedication_type) do update set
  dedication_text = excluded.dedication_text,
  notes = excluded.notes,
  status = excluded.status;

-- La discografía de Carmen de Salteras ya contenía estas dos pistas sin vínculo canónico.
with track_link(track_title, march_slug) as (values
  ('La Virgen de las Mercedes', 'la-virgen-de-las-mercedes-pedro-galvez'),
  ('La Virgen del Carmen', 'la-virgen-del-carmen-rafael-wals-dantas')
)
update public.band_release_tracks track
set march_entity_id = march.id
from public.band_releases release,
     track_link seed
join public.entities march on march.entity_type = 'march' and march.slug = seed.march_slug
join public.entities band on band.entity_type = 'band' and band.slug = 'carmen-de-salteras'
where track.release_id = release.id
  and release.band_entity_id = band.id
  and lower(track.title) = lower(seed.track_title);

do $cruceta$
declare
  v_outing_id uuid;
  v_band_id uuid;
  v_source_id uuid;
  v_repertoire_id uuid;
  v_assignment_id uuid;
begin
  select id into strict v_outing_id from public.outings
  where slug = 'sevilla-santa-genoveva-mercedes-rosario-2026-09-27';
  select id into strict v_band_id from public.entities
  where entity_type = 'band' and slug = 'carmen-de-salteras';
  select id into strict v_source_id from public.sources
  where name = 'Repertorio interpretado · Rosario de la Aurora de Nuestra Señora de las Mercedes Coronada 2026'
    and author_or_publisher = 'Carmen de Salteras'
  order by created_at limit 1;
  select assignment.id into strict v_assignment_id
  from public.outing_music_assignments assignment
  join public.outing_music_positions position on position.id = assignment.music_position_id
  where position.outing_id = v_outing_id
    and position.position_label = 'Regreso del Rosario de la Aurora'
    and assignment.band_entity_id = v_band_id;

  insert into public.source_links (source_id, outing_id, scope, notes)
  select v_source_id, v_outing_id, 'Repertorio interpretado',
         'Fuente directa del repertorio interpretado por Carmen de Salteras en el regreso.'
  where not exists (
    select 1 from public.source_links where source_id = v_source_id and outing_id = v_outing_id
  );

  insert into public.source_links (source_id, outing_music_assignment_id, scope, notes)
  select v_source_id, v_assignment_id, 'Acompañamiento musical',
         'Vincula la cruceta únicamente con el tramo de regreso acompañado por Carmen de Salteras.'
  where not exists (
    select 1 from public.source_links
    where source_id = v_source_id and outing_music_assignment_id = v_assignment_id
  );

  insert into public.musical_repertoires (
    slug, outing_id, band_entity_id, step_entity_id, source_id, title,
    repertoire_kind, notes, status
  ) values (
    'santa-genoveva-rosario-mercedes-carmen-salteras-2026',
    v_outing_id,
    v_band_id,
    null,
    v_source_id,
    'Santa Genoveva · Rosario de la Aurora 2026 · Carmen de Salteras',
    'performed',
    'La lámina oficial documenta 13 menciones consolidadas en 12 obras. «Reina de las Mercedes» aparece dos veces y se registra como ×2, sin deducir que las interpretaciones fueran consecutivas. El orden de visualización conserva la primera aparición editorial en la fuente, no una cronología del recorrido. La cruceta pertenece exclusivamente al regreso acompañado por Carmen de Salteras; la ida con el Coro Nuestra Señora de las Mercedes conserva su relación independiente.',
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
    (1, 'la-virgen-de-las-mercedes-pedro-galvez', 'La Virgen de las Mercedes', 'Pedro Gálvez Jiménez', 1, null),
    (2, 'coronacion-puntas-marvizon', 'Coronación', 'Juan José Puntas Fernández y Manuel Marvizón Carvallo', 1, null),
    (3, 'reina-de-las-mercedes-juan-velazquez', 'Reina de las Mercedes', 'Juan Velázquez Sánchez', 2, 'La obra figura dos veces en la lámina; ×2 expresa únicamente dos interpretaciones documentadas.'),
    (4, 'tu-eres-el-orgullo-de-nuestro-pueblo-pablo-ojeda', 'Tú eres el orgullo de nuestro pueblo', 'Pablo Ojeda Jiménez', 1, null),
    (5, 'senora-de-santa-genoveva-jose-manuel-garcia-pulido', 'Señora de Santa Genoveva', 'José Manuel García Pulido', 1, null),
    (6, 'la-virgen-del-carmen-rafael-wals-dantas', 'La Virgen del Carmen', 'Rafael Wals Dantas', 1, null),
    (7, 'rosario-de-montesion-juan-velazquez', 'Rosario de Montesión', 'Juan Velázquez Sánchez', 1, null),
    (8, 'virgen-macarena-francisco-javier-alonso-delgado', 'Virgen Macarena', 'Francisco Javier Alonso Delgado', 1, 'Se conserva el nombre completo que publica la Banda y se reutiliza la ficha canónica Javier Alonso Delgado.'),
    (9, 'pasa-la-virgen-macarena-pedro-gamez-laserna', 'Pasa la Virgen Macarena', 'Pedro Gámez Laserna', 1, null),
    (10, 'pasan-los-campanilleros-manuel-lopez-farfan', 'Pasan los Campanilleros', 'Manuel López Farfán', 1, null),
    (11, 'mercedes-cristobal-lopez-gandara', 'Mercedes', 'Cristóbal López Gándara', 1, null),
    (12, 'virgen-de-las-mercedes-manuel-marvizon', 'Virgen de las Mercedes', 'Manuel Marvizón Carvallo', 1, null)
  )
  insert into public.musical_repertoire_entries (
    repertoire_id, march_entity_id, display_title, source_credit,
    performance_count, display_order, notes
  )
  select v_repertoire_id, march.id, seed.display_title, seed.source_credit,
         seed.performance_count, seed.display_order, seed.notes
  from entry_seed seed
  join public.entities march on march.entity_type = 'march' and march.slug = seed.march_slug;

  if (select count(*) from public.musical_repertoire_entries where repertoire_id = v_repertoire_id) <> 12 then
    raise exception 'La cruceta del Rosario de las Mercedes debe contener 12 obras distintas';
  end if;

  if (select sum(performance_count) from public.musical_repertoire_entries where repertoire_id = v_repertoire_id) <> 13 then
    raise exception 'La cruceta del Rosario de las Mercedes debe sumar 13 interpretaciones';
  end if;

  if (
    select performance_count
    from public.musical_repertoire_entries entry
    join public.entities march on march.id = entry.march_entity_id
    where entry.repertoire_id = v_repertoire_id
      and march.slug = 'reina-de-las-mercedes-juan-velazquez'
  ) <> 2 then
    raise exception 'Reina de las Mercedes debe conservar sus dos apariciones';
  end if;
end
$cruceta$;

commit;
