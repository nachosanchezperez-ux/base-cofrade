-- Hilo Cofrade · cruceta interpretada de Nuestra Señora del Castillo Coronada
-- Procesión de Gloria de Lebrija · 12 de septiembre de 2026
-- Solo DML editorial. Sin DDL, RLS, arquitectura ni UX nueva.

begin;

do $preflight$
begin
  if (
    select count(*)
    from public.outings outing
    join public.entities brotherhood on brotherhood.id = outing.brotherhood_entity_id
    where brotherhood.slug = 'castillo-lebrija'
      and outing.outing_date = date '2026-09-12'
      and outing.outing_type = 'Procesión de Gloria'
      and outing.status = 'published'
  ) <> 1 then
    raise exception 'La salida canónica de la Virgen del Castillo de 2026 no es unívoca';
  end if;

  if (
    select count(*)
    from public.entities
    where slug = 'castillo-lebrija'
      and entity_type = 'brotherhood'
      and status = 'published'
  ) <> 1 then
    raise exception 'La Hermandad del Castillo de Lebrija no es unívoca';
  end if;
end
$preflight$;

-- La Banda figuraba como texto libre en la salida. Se crea su ficha canónica
-- y se reconcilia la asignación musical existente.
insert into public.entities (entity_type, name, slug, summary, status)
select
  'band',
  'Banda de Música Virgen del Castillo de Lebrija',
  'banda-musica-virgen-castillo-lebrija',
  'Formación musical de Lebrija vinculada a la procesión anual de Nuestra Señora del Castillo Coronada.',
  'published'
where not exists (
  select 1 from public.entities
  where entity_type = 'band' and slug = 'banda-musica-virgen-castillo-lebrija'
);

update public.entities
set name = 'Banda de Música Virgen del Castillo de Lebrija',
    summary = 'Formación musical de Lebrija vinculada a la procesión anual de Nuestra Señora del Castillo Coronada.',
    status = 'published',
    updated_at = now()
where entity_type = 'band' and slug = 'banda-musica-virgen-castillo-lebrija';

insert into public.bands (
  entity_id, band_type, municipality_id, description, primary_color, secondary_color,
  linked_brotherhood_name, headquarters_text, logo_background_color
)
select
  band.id,
  'Banda de Música',
  municipality.id,
  'Banda de música de Lebrija que acompañó a Nuestra Señora del Castillo Coronada en su procesión de Gloria del 12 de septiembre de 2026.',
  '#123F91',
  '#FFFFFF',
  'Hermandad del Castillo de Lebrija',
  'Lebrija (Sevilla)',
  '#FFFFFF'
from public.entities band
join public.municipalities municipality on municipality.slug = 'lebrija'
where band.slug = 'banda-musica-virgen-castillo-lebrija'
on conflict (entity_id) do update set
  band_type = excluded.band_type,
  municipality_id = excluded.municipality_id,
  description = excluded.description,
  primary_color = excluded.primary_color,
  secondary_color = excluded.secondary_color,
  linked_brotherhood_name = excluded.linked_brotherhood_name,
  headquarters_text = excluded.headquarters_text,
  logo_background_color = excluded.logo_background_color;

update public.outing_music_assignments assignment
set band_entity_id = band.id,
    band_name_text = null
from public.outing_music_positions position
join public.outings outing on outing.id = position.outing_id
join public.entities brotherhood on brotherhood.id = outing.brotherhood_entity_id
join public.entities band on band.slug = 'banda-musica-virgen-castillo-lebrija' and band.entity_type = 'band'
where assignment.music_position_id = position.id
  and brotherhood.slug = 'castillo-lebrija'
  and outing.outing_date = date '2026-09-12'
  and position.position_code = 'behind_step'
  and assignment.status = 'published';

-- Autorías nuevas necesarias para las obras locales. El resto se resuelve
-- contra los perfiles ya existentes en el catálogo de marchas.
with author_seed(name, slug) as (values
  ('Francisco Manuel López López', 'francisco-manuel-lopez-lopez'),
  ('José María Dorantes Ramos', 'jose-maria-dorantes-ramos'),
  ('Félix de Carboneras', 'felix-de-carboneras'),
  ('Fulgencio Morón Ródenas', 'fulgencio-moron-rodenas')
)
insert into public.entities (entity_type, name, slug, summary, status)
select
  'agent', seed.name, seed.slug,
  'Autor acreditado en el repertorio interpretado tras Nuestra Señora del Castillo Coronada en 2026.',
  'published'
from author_seed seed
where not exists (
  select 1 from public.entities entity
  where entity.entity_type = 'agent'
    and lower(translate(entity.name, 'ÁÉÍÓÚÜÑáéíóúüñ', 'AEIOUUNaeiouun')) =
        lower(translate(seed.name, 'ÁÉÍÓÚÜÑáéíóúüñ', 'AEIOUUNaeiouun'))
);

with author_seed(name) as (values
  ('Francisco Manuel López López'),
  ('José María Dorantes Ramos'),
  ('Félix de Carboneras'),
  ('Fulgencio Morón Ródenas')
)
insert into public.agents (entity_id, agent_kind, description)
select entity.id, 'person', entity.summary
from author_seed seed
join public.entities entity on entity.entity_type = 'agent'
  and lower(translate(entity.name, 'ÁÉÍÓÚÜÑáéíóúüñ', 'AEIOUUNaeiouun')) =
      lower(translate(seed.name, 'ÁÉÍÓÚÜÑáéíóúüñ', 'AEIOUUNaeiouun'))
on conflict (entity_id) do nothing;

with march_seed(slug, title) as (values
  ('aurora-reina-manana-pablo-ojeda', 'Aurora, Reina de la Mañana'),
  ('candelaria-manuel-marvizon', 'Candelaria'),
  ('castillo-coronada-francisco-manuel-lopez', 'Castillo Coronada'),
  ('como-tu-ninguna-david-hurtado', 'Como Tú, Ninguna'),
  ('coronacion-puntas-marvizon', 'Coronación'),
  ('coronacion-de-la-macarena-pedro-brana', 'Coronación de la Macarena'),
  ('marcha-encarnacion-coronada-bm-1994', 'Encarnación Coronada'),
  ('esperanza-manuel-marvizon', 'Esperanza'),
  ('esperanza-macarena-pedro-morales', 'Esperanza Macarena'),
  ('espiritu-santo-pablo-ojeda', 'Espíritu Santo'),
  ('la-estrella-sublime-manuel-lopez-farfan', 'La Estrella Sublime'),
  ('la-esperanza-de-triana-manuel-lopez-farfan', 'La Esperanza de Triana'),
  ('virgen-desamparados-lopez-gandara-2017', 'La Virgen de los Desamparados'),
  ('macarena-emilio-cebrian', 'Macarena'),
  ('macarena-abel-moreno', 'Macarena'),
  ('madre-del-castillo-coronada-jose-maria-dorantes', 'Madre del Castillo Coronada'),
  ('madre-hiniesta-manuel-marvizon', 'Madre Hiniesta'),
  ('marcha-pasa-la-virgen-de-la-soledad-pedro-morales', 'Pasa la Virgen de la Soledad'),
  ('pasa-la-virgen-macarena-pedro-gamez-laserna', 'Pasa la Virgen Macarena'),
  ('pasan-los-campanilleros-manuel-lopez-farfan', 'Pasan los Campanilleros'),
  ('patrona-lebrija-coronada-abel-moreno', 'Patrona de Lebrija Coronada'),
  ('triana-felix-de-carboneras', 'Triana'),
  ('virgen-de-la-paz-pedro-morales', 'Virgen de la Paz'),
  ('marcha-virgen-de-los-negritos-pedro-morales', 'Virgen de los Negritos'),
  ('virgen-de-montserrat-pedro-morales', 'Virgen de Montserrat'),
  ('virgen-del-castillo-coronada-fulgencio-moron', 'Virgen del Castillo Coronada')
)
insert into public.entities (entity_type, name, slug, summary, status)
select
  'march', seed.title, seed.slug,
  'Obra documentada en el repertorio interpretado tras Nuestra Señora del Castillo Coronada el 12 de septiembre de 2026.',
  'published'
from march_seed seed
where not exists (
  select 1 from public.entities entity
  where entity.entity_type = 'march' and entity.slug = seed.slug
);

with march_seed(slug) as (values
  ('aurora-reina-manana-pablo-ojeda'),('candelaria-manuel-marvizon'),
  ('castillo-coronada-francisco-manuel-lopez'),('como-tu-ninguna-david-hurtado'),
  ('coronacion-puntas-marvizon'),('coronacion-de-la-macarena-pedro-brana'),
  ('marcha-encarnacion-coronada-bm-1994'),('esperanza-manuel-marvizon'),
  ('esperanza-macarena-pedro-morales'),('espiritu-santo-pablo-ojeda'),
  ('la-estrella-sublime-manuel-lopez-farfan'),('la-esperanza-de-triana-manuel-lopez-farfan'),
  ('virgen-desamparados-lopez-gandara-2017'),('macarena-emilio-cebrian'),
  ('macarena-abel-moreno'),('madre-del-castillo-coronada-jose-maria-dorantes'),
  ('madre-hiniesta-manuel-marvizon'),('marcha-pasa-la-virgen-de-la-soledad-pedro-morales'),
  ('pasa-la-virgen-macarena-pedro-gamez-laserna'),('pasan-los-campanilleros-manuel-lopez-farfan'),
  ('patrona-lebrija-coronada-abel-moreno'),('triana-felix-de-carboneras'),
  ('virgen-de-la-paz-pedro-morales'),('marcha-virgen-de-los-negritos-pedro-morales'),
  ('virgen-de-montserrat-pedro-morales'),('virgen-del-castillo-coronada-fulgencio-moron')
)
insert into public.marches (entity_id, music_type, work_type, description, eligible_for_daily)
select entity.id, 'Banda de Música', 'Marcha procesional',
       'Interpretada en la procesión de Gloria de Nuestra Señora del Castillo Coronada de Lebrija en 2026.',
       false
from march_seed seed
join public.entities entity on entity.entity_type = 'march' and entity.slug = seed.slug
where not exists (select 1 from public.marches march where march.entity_id = entity.id);

with author_seed(march_slug, author_name) as (values
  ('aurora-reina-manana-pablo-ojeda', 'Pablo Ojeda Jiménez'),
  ('candelaria-manuel-marvizon', 'Manuel Marvizón Carvallo'),
  ('castillo-coronada-francisco-manuel-lopez', 'Francisco Manuel López López'),
  ('como-tu-ninguna-david-hurtado', 'David Hurtado Torres'),
  ('coronacion-puntas-marvizon', 'Manuel Marvizón Carvallo'),
  ('coronacion-puntas-marvizon', 'Juan José Puntas Fernández'),
  ('coronacion-de-la-macarena-pedro-brana', 'Pedro Braña Martínez'),
  ('marcha-encarnacion-coronada-bm-1994', 'Abel Moreno Gómez'),
  ('esperanza-manuel-marvizon', 'Manuel Marvizón Carvallo'),
  ('esperanza-macarena-pedro-morales', 'Pedro Morales Muñoz'),
  ('espiritu-santo-pablo-ojeda', 'Pablo Ojeda Jiménez'),
  ('la-estrella-sublime-manuel-lopez-farfan', 'Manuel López Farfán'),
  ('la-esperanza-de-triana-manuel-lopez-farfan', 'Manuel López Farfán'),
  ('virgen-desamparados-lopez-gandara-2017', 'Cristóbal López Gándara'),
  ('macarena-emilio-cebrian', 'Emilio Cebrián Ruiz'),
  ('macarena-abel-moreno', 'Abel Moreno Gómez'),
  ('madre-del-castillo-coronada-jose-maria-dorantes', 'José María Dorantes Ramos'),
  ('madre-hiniesta-manuel-marvizon', 'Manuel Marvizón Carvallo'),
  ('marcha-pasa-la-virgen-de-la-soledad-pedro-morales', 'Pedro Morales Muñoz'),
  ('pasa-la-virgen-macarena-pedro-gamez-laserna', 'Pedro Gámez Laserna'),
  ('pasan-los-campanilleros-manuel-lopez-farfan', 'Manuel López Farfán'),
  ('patrona-lebrija-coronada-abel-moreno', 'Abel Moreno Gómez'),
  ('triana-felix-de-carboneras', 'Félix de Carboneras'),
  ('virgen-de-la-paz-pedro-morales', 'Pedro Morales Muñoz'),
  ('marcha-virgen-de-los-negritos-pedro-morales', 'Pedro Morales Muñoz'),
  ('virgen-de-montserrat-pedro-morales', 'Pedro Morales Muñoz'),
  ('virgen-del-castillo-coronada-fulgencio-moron', 'Fulgencio Morón Ródenas')
)
insert into public.march_authors (march_entity_id, agent_entity_id, author_role, status)
select march.id, author.id, 'composer', 'published'
from author_seed seed
join public.entities march on march.entity_type = 'march' and march.slug = seed.march_slug
join public.entities author on author.entity_type = 'agent'
  and lower(translate(author.name, 'ÁÉÍÓÚÜÑáéíóúüñ', 'AEIOUUNaeiouun')) =
      lower(translate(seed.author_name, 'ÁÉÍÓÚÜÑáéíóúüñ', 'AEIOUUNaeiouun'))
where not exists (
  select 1 from public.march_authors existing
  where existing.march_entity_id = march.id
    and existing.agent_entity_id = author.id
    and existing.author_role = 'composer'
    and existing.status <> 'archived'
);

do $cruceta$
declare
  v_outing_id uuid;
  v_band_id uuid;
  v_source_id uuid;
  v_repertoire_id uuid;
begin
  select outing.id into strict v_outing_id
  from public.outings outing
  join public.entities brotherhood on brotherhood.id = outing.brotherhood_entity_id
  where brotherhood.slug = 'castillo-lebrija'
    and outing.outing_date = date '2026-09-12'
    and outing.outing_type = 'Procesión de Gloria';

  select id into strict v_band_id
  from public.entities
  where entity_type = 'band' and slug = 'banda-musica-virgen-castillo-lebrija';

  update public.outings
  set event_status = 'held', updated_at = now()
  where id = v_outing_id;

  insert into public.sources (
    name, source_type, author_or_publisher, publication_date, accessed_at, notes
  )
  select
    'Repertorio musical 2026 · Virgen del Castillo de Lebrija',
    'social_media',
    'Banda de Música Virgen del Castillo de Lebrija',
    null,
    date '2026-09-13',
    'Lámina publicada tras la procesión con las 26 marchas interpretadas. La fuente no indica repeticiones, orden cronológico ni puntos del recorrido.'
  where not exists (
    select 1 from public.sources
    where name = 'Repertorio musical 2026 · Virgen del Castillo de Lebrija'
      and author_or_publisher = 'Banda de Música Virgen del Castillo de Lebrija'
  );

  select id into strict v_source_id
  from public.sources
  where name = 'Repertorio musical 2026 · Virgen del Castillo de Lebrija'
    and author_or_publisher = 'Banda de Música Virgen del Castillo de Lebrija'
  order by created_at
  limit 1;

  insert into public.musical_repertoires (
    slug, outing_id, band_entity_id, source_id, title,
    repertoire_kind, notes, status
  ) values (
    'virgen-castillo-lebrija-procesion-2026',
    v_outing_id,
    v_band_id,
    v_source_id,
    'Repertorio interpretado tras Nuestra Señora del Castillo Coronada · 2026',
    'performed',
    'Repertorio publicado tras la procesión. Todas las obras se registran con una interpretación porque la lámina no documenta repeticiones.',
    'published'
  )
  on conflict (slug) do update set
    outing_id = excluded.outing_id,
    band_entity_id = excluded.band_entity_id,
    source_id = excluded.source_id,
    title = excluded.title,
    repertoire_kind = excluded.repertoire_kind,
    notes = excluded.notes,
    status = excluded.status,
    updated_at = now()
  returning id into v_repertoire_id;

  delete from public.musical_repertoire_entries where repertoire_id = v_repertoire_id;

  with entry_seed(display_order, march_slug, display_title, source_credit) as (values
    (1, 'aurora-reina-manana-pablo-ojeda', 'Aurora, Reina de la Mañana', 'Pablo Ojeda Jiménez'),
    (2, 'candelaria-manuel-marvizon', 'Candelaria', 'Manuel Marvizón'),
    (3, 'castillo-coronada-francisco-manuel-lopez', 'Castillo Coronada', 'Francisco Manuel López López'),
    (4, 'como-tu-ninguna-david-hurtado', 'Como Tú, Ninguna', 'David Hurtado Torres'),
    (5, 'coronacion-puntas-marvizon', 'Coronación', 'Manuel Marvizón / Juan José Puntas Fernández'),
    (6, 'coronacion-de-la-macarena-pedro-brana', 'Coronación de la Macarena', 'Pedro Braña Martínez'),
    (7, 'marcha-encarnacion-coronada-bm-1994', 'Encarnación Coronada', 'Abel Moreno Gómez'),
    (8, 'esperanza-manuel-marvizon', 'Esperanza', 'Manuel Marvizón Carvallo'),
    (9, 'esperanza-macarena-pedro-morales', 'Esperanza Macarena', 'Pedro Morales Muñoz'),
    (10, 'espiritu-santo-pablo-ojeda', 'Espíritu Santo', 'Pablo Ojeda Jiménez'),
    (11, 'la-estrella-sublime-manuel-lopez-farfan', 'Estrella Sublime', 'Manuel López Farfán'),
    (12, 'la-esperanza-de-triana-manuel-lopez-farfan', 'La Esperanza de Triana', 'Manuel López Farfán'),
    (13, 'virgen-desamparados-lopez-gandara-2017', 'La Virgen de los Desamparados', 'Cristóbal López Gándara'),
    (14, 'macarena-emilio-cebrian', '¡Macarena!', 'Emilio Cebrián Ruiz'),
    (15, 'macarena-abel-moreno', 'Macarena', 'Abel Moreno Gómez'),
    (16, 'madre-del-castillo-coronada-jose-maria-dorantes', 'Madre del Castillo Coronada', 'José María Dorantes Ramos'),
    (17, 'madre-hiniesta-manuel-marvizon', 'Madre Hiniesta', 'Manuel Marvizón'),
    (18, 'marcha-pasa-la-virgen-de-la-soledad-pedro-morales', 'Pasa la Virgen de la Soledad', 'Pedro Morales Muñoz'),
    (19, 'pasa-la-virgen-macarena-pedro-gamez-laserna', 'Pasa la Virgen Macarena', 'Pedro Gámez Laserna'),
    (20, 'pasan-los-campanilleros-manuel-lopez-farfan', 'Pasan los Campanilleros', 'Manuel López Farfán'),
    (21, 'patrona-lebrija-coronada-abel-moreno', 'Patrona de Lebrija Coronada', 'Abel Moreno Gómez'),
    (22, 'triana-felix-de-carboneras', 'Triana', 'Félix de Carboneras'),
    (23, 'virgen-de-la-paz-pedro-morales', 'Virgen de la Paz', 'Pedro Morales Muñoz'),
    (24, 'marcha-virgen-de-los-negritos-pedro-morales', 'Virgen de los Negritos', 'Pedro Morales Muñoz'),
    (25, 'virgen-de-montserrat-pedro-morales', 'Virgen de Montserrat', 'Pedro Morales Muñoz'),
    (26, 'virgen-del-castillo-coronada-fulgencio-moron', 'Virgen del Castillo Coronada', 'Fulgencio Morón Ródenas')
  )
  insert into public.musical_repertoire_entries (
    repertoire_id, march_entity_id, display_title, source_credit,
    performance_count, display_order
  )
  select
    v_repertoire_id, march.id, seed.display_title, seed.source_credit,
    1, seed.display_order
  from entry_seed seed
  join public.entities march on march.entity_type = 'march' and march.slug = seed.march_slug;

  if (select count(*) from public.musical_repertoire_entries where repertoire_id = v_repertoire_id) <> 26 then
    raise exception 'La cruceta de la Virgen del Castillo debe contener 26 obras';
  end if;

  if (select sum(performance_count) from public.musical_repertoire_entries where repertoire_id = v_repertoire_id) <> 26 then
    raise exception 'La cruceta de la Virgen del Castillo debe sumar 26 interpretaciones documentadas';
  end if;

  if (
    select count(*)
    from public.outing_music_positions position
    join public.outing_music_assignments assignment on assignment.music_position_id = position.id
    where position.outing_id = v_outing_id
      and assignment.band_entity_id = v_band_id
      and position.status = 'published'
      and assignment.status = 'published'
  ) <> 1 then
    raise exception 'La Banda no ha quedado relacionada canónicamente con la salida';
  end if;
end
$cruceta$;

commit;
