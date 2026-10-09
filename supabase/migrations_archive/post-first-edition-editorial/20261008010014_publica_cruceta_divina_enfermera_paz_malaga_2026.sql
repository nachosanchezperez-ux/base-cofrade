-- Hilo Cofrade · Cruceta de la Esperanza Divina Enfermera · Sevilla · 3 de octubre de 2026.
-- Repertorio interpretado por la Banda de Música Nuestra Señora de la Paz de Málaga.
-- Solo DML editorial: una fila por obra y multiplicidad literal de la fuente.

begin;

do $preflight$
begin
  if (
    select count(*) from public.outings
    where slug = 'gloria-divina-enfermera-2026'
      and outing_date = date '2026-10-03'
      and status = 'published'
  ) <> 1 then
    raise exception 'La procesión de la Divina Enfermera de 2026 no es unívoca';
  end if;

  if (
    select count(*) from public.entities
    where entity_type = 'brotherhood'
      and slug = 'hermandad-sagrada-lanzada'
      and status = 'published'
  ) <> 1 then
    raise exception 'La Hermandad de la Sagrada Lanzada no es unívoca';
  end if;

  if (
    select count(*) from public.entities
    where entity_type = 'image'
      and slug = 'nuestra-senora-esperanza-divina-enfermera'
      and status = 'published'
  ) <> 1 then
    raise exception 'La Esperanza Divina Enfermera no es unívoca';
  end if;

  if (
    select count(*) from public.entities
    where entity_type = 'step'
      and slug = 'paso-procesional-divina-enfermera'
      and status = 'published'
  ) <> 1 then
    raise exception 'El paso de la Divina Enfermera no es unívoco';
  end if;

  if (
    select count(*)
    from public.outing_music_positions position
    join public.outings outing on outing.id = position.outing_id
    where outing.slug = 'gloria-divina-enfermera-2026'
      and position.sequence_no = 2
      and position.position_code = 'behind_glory'
      and position.step_entity_id = (
        select id from public.entities
        where entity_type = 'step' and slug = 'paso-procesional-divina-enfermera'
      )
  ) <> 1 then
    raise exception 'La posición musical tras el paso de la Divina Enfermera no es unívoca';
  end if;

  if (
    select count(*)
    from public.outing_music_assignments assignment
    join public.outing_music_positions position on position.id = assignment.music_position_id
    join public.outings outing on outing.id = position.outing_id
    where outing.slug = 'gloria-divina-enfermera-2026'
      and position.sequence_no = 2
      and assignment.sequence_no = 1
      and assignment.band_name_text = 'Banda de Música Nuestra Señora de la Paz de Málaga'
  ) <> 1 then
    raise exception 'El acompañamiento textual de la Banda de la Paz de Málaga no es unívoco';
  end if;
end
$preflight$;

insert into public.municipalities (name, slug, province, autonomous_community, country)
select 'Málaga', 'malaga', 'Málaga', 'Andalucía', 'España'
where not exists (select 1 from public.municipalities where slug = 'malaga');

insert into public.entities (entity_type, name, slug, summary, status)
select
  'band',
  'Banda de Música Nuestra Señora de la Paz de Málaga',
  'banda-musica-nuestra-senora-paz-malaga',
  'Formación de la Asociación Músico-Cultural Nuestra Señora de la Paz, con sede en Málaga.',
  'published'
where not exists (
  select 1 from public.entities
  where entity_type = 'band' and slug = 'banda-musica-nuestra-senora-paz-malaga'
);

update public.entities
set name = 'Banda de Música Nuestra Señora de la Paz de Málaga',
    summary = 'Formación de la Asociación Músico-Cultural Nuestra Señora de la Paz, con sede en Málaga.',
    status = 'published',
    updated_at = now()
where entity_type = 'band' and slug = 'banda-musica-nuestra-senora-paz-malaga';

insert into public.bands (
  entity_id, band_type, municipality_id, foundation_text, website_url, description,
  primary_color, secondary_color, headquarters_text, logo_background_color
)
select
  band.id,
  'Banda de Música',
  municipality.id,
  '1999',
  'https://www.lapazmalaga.com/',
  'Banda de música de Málaga que acompañó a Nuestra Señora de la Esperanza Divina Enfermera en su procesión de 2026.',
  '#061B3A',
  '#FFFFFF',
  'Málaga',
  '#FFFFFF'
from public.entities band
join public.municipalities municipality on municipality.slug = 'malaga'
where band.entity_type = 'band' and band.slug = 'banda-musica-nuestra-senora-paz-malaga'
on conflict (entity_id) do update set
  band_type = excluded.band_type,
  municipality_id = excluded.municipality_id,
  foundation_text = excluded.foundation_text,
  website_url = excluded.website_url,
  description = excluded.description,
  primary_color = excluded.primary_color,
  secondary_color = excluded.secondary_color,
  headquarters_text = excluded.headquarters_text,
  logo_background_color = excluded.logo_background_color;

update public.outings
set event_status = 'held', updated_at = now()
where slug = 'gloria-divina-enfermera-2026'
  and event_status <> 'held';

with seed(name, url, source_type, publisher, publication_date, accessed_at, notes) as (values
  (
    'Repertorio interpretado · Esperanza Divina Enfermera 2026',
    null::text,
    'social_media',
    'Banda de Música Nuestra Señora de la Paz de Málaga',
    null::date,
    date '2026-10-08',
    'Lámina publicada por la banda tras la procesión. Documenta 28 interpretaciones consolidadas en 27 obras.'
  ),
  (
    'La Paz Málaga · Quiénes somos',
    'https://www.lapazmalaga.com/banda',
    'website',
    'Asociación Músico-Cultural Nuestra Señora de la Paz',
    null::date,
    date '2026-10-08',
    'Fuente oficial para la identidad, sede e historia básica de la formación.'
  ),
  (
    'ArteSacro · Salida procesional de la Esperanza Divina Enfermera 2026',
    'https://www.artesacro.org/Noticia/Ver/169251/hoy-salida-procesional-esperanza-divina-enfermera',
    'news',
    'ArteSacro',
    date '2026-10-03',
    date '2026-10-08',
    'Documenta que la Banda de Música Nuestra Señora de la Paz de Málaga acompañó tras el paso.'
  ),
  (
    'Directorio diocesano · Esperanza Divina Enfermera',
    'https://www.cofradiasyhermandades.es/fichaimagineriaytallas.php?Nuestra+Se%C3%B1ora+de+la+Esperanza+%E2%80%9CDivina+Enfermera%E2%80%9D=&ii=7593003',
    'website',
    'Consejo Diocesano para las Hermandades y Cofradías de la Archidiócesis de Sevilla',
    null::date,
    date '2026-10-08',
    'Documenta Esperanza Divina Enfermera, de José de la Vega Sánchez, fechada en 1980.'
  )
)
insert into public.sources (name, url, source_type, author_or_publisher, publication_date, accessed_at, notes)
select name, url, source_type, publisher, publication_date, accessed_at, notes
from seed
where not exists (
  select 1 from public.sources existing
  where existing.name = seed.name and existing.author_or_publisher = seed.publisher
);

with seed(name, slug, summary) as (values
  ('Sergio Bueno de la Peña', 'sergio-bueno-de-la-pena', 'Compositor malagueño vinculado al repertorio procesional para banda de música.'),
  ('Jaime Texidor Dalmau', 'jaime-texidor-dalmau', 'Compositor de la marcha procesional Auxilium Christianorum.')
)
insert into public.entities (entity_type, name, slug, summary, status)
select 'agent', name, slug, summary, 'published'
from seed
where not exists (
  select 1 from public.entities existing where existing.entity_type = 'agent' and existing.slug = seed.slug
);

with seed(slug) as (values ('sergio-bueno-de-la-pena'), ('jaime-texidor-dalmau'))
insert into public.agents (entity_id, agent_kind, description)
select entity.id, 'person', entity.summary
from seed
join public.entities entity on entity.entity_type = 'agent' and entity.slug = seed.slug
on conflict (entity_id) do nothing;

with seed(slug, title, summary, composition_year) as (values
  ('esperanza-divina-enfermera-jose-de-la-vega', 'Esperanza, Divina Enfermera', 'Marcha de José de la Vega Sánchez dedicada a Nuestra Señora de la Esperanza Divina Enfermera.', 1980),
  ('tras-tu-verde-manto-rafael-wals', 'Tras tu verde manto', 'Marcha procesional de Rafael Wals Dantas.', null::integer),
  ('amparo-alfonso-lopez-cortes', 'Amparo', 'Marcha procesional de Alfonso López Cortés.', null),
  ('regina-pacis-manuel-borrego', 'Regina Pacis', 'Marcha procesional de Manuel Borrego Hernández.', null),
  ('carmen-coronada-sergio-bueno', 'Carmen Coronada', 'Marcha procesional de Sergio Bueno de la Peña.', 2004),
  ('carmen-daniel-albarran', 'Carmen', 'Marcha procesional de Daniel Albarrán Acosta.', null),
  ('auxilium-christianorum-jaime-texidor', 'Auxilium Christianorum', 'Marcha procesional de Jaime Texidor Dalmau.', 1955),
  ('saeta-cordobesa-pedro-gamez-laserna', 'Saeta Cordobesa', 'Marcha procesional de Pedro Gámez Laserna.', null),
  ('la-estrella-trianera-pedro-galvez', 'La Estrella Trianera', 'Marcha procesional de Pedro Gálvez Jiménez.', 2026),
  ('virgen-del-rosario-coronada-pablo-ojeda', 'Virgen del Rosario Coronada', 'Marcha procesional de Pablo Ojeda Jiménez.', null)
)
insert into public.entities (entity_type, name, slug, summary, status)
select 'march', title, slug, summary, 'published'
from seed
where not exists (
  select 1 from public.entities existing where existing.entity_type = 'march' and existing.slug = seed.slug
);

with seed(slug, composition_year) as (values
  ('esperanza-divina-enfermera-jose-de-la-vega', 1980),
  ('tras-tu-verde-manto-rafael-wals', null::integer),
  ('amparo-alfonso-lopez-cortes', null),
  ('regina-pacis-manuel-borrego', null),
  ('carmen-coronada-sergio-bueno', 2004),
  ('carmen-daniel-albarran', null),
  ('auxilium-christianorum-jaime-texidor', 1955),
  ('saeta-cordobesa-pedro-gamez-laserna', null),
  ('la-estrella-trianera-pedro-galvez', 2026),
  ('virgen-del-rosario-coronada-pablo-ojeda', null)
)
insert into public.marches (entity_id, composition_year, music_type, work_type, description, eligible_for_daily)
select entity.id, seed.composition_year, 'Banda de Música', 'Marcha procesional', entity.summary, false
from seed
join public.entities entity on entity.entity_type = 'march' and entity.slug = seed.slug
where not exists (select 1 from public.marches existing where existing.entity_id = entity.id);

with seed(march_slug, author_slug) as (values
  ('esperanza-divina-enfermera-jose-de-la-vega', 'jose-de-la-vega-sanchez'),
  ('tras-tu-verde-manto-rafael-wals', 'rafael-wals-dantas'),
  ('amparo-alfonso-lopez-cortes', 'agente-alfonso-lopez-cortes'),
  ('regina-pacis-manuel-borrego', 'manuel-borrego-hernandez'),
  ('carmen-coronada-sergio-bueno', 'sergio-bueno-de-la-pena'),
  ('carmen-daniel-albarran', 'daniel-albarran-acosta'),
  ('auxilium-christianorum-jaime-texidor', 'jaime-texidor-dalmau'),
  ('saeta-cordobesa-pedro-gamez-laserna', 'pedro-gamez-laserna'),
  ('la-estrella-trianera-pedro-galvez', 'pedro-galvez-jimenez'),
  ('virgen-del-rosario-coronada-pablo-ojeda', 'pablo-ojeda-jimenez')
)
insert into public.march_authors (march_entity_id, agent_entity_id, author_role, notes, status)
select march.id, author.id, 'composer', 'Autoría consignada en la lámina publicada por la banda.', 'published'
from seed
join public.entities march on march.entity_type = 'march' and march.slug = seed.march_slug
join public.entities author on author.entity_type = 'agent' and author.slug = seed.author_slug
where not exists (
  select 1 from public.march_authors existing
  where existing.march_entity_id = march.id
    and existing.agent_entity_id = author.id
    and existing.author_role = 'composer'
    and existing.status <> 'archived'
);

with refs as (
  select
    (select id from public.entities where entity_type = 'march' and slug = 'esperanza-divina-enfermera-jose-de-la-vega') march_id,
    (select id from public.entities where entity_type = 'image' and slug = 'nuestra-senora-esperanza-divina-enfermera') dedicatee_id
)
insert into public.march_dedications (
  march_entity_id, dedicatee_entity_id, dedication_type, dedication_text,
  date_from, date_from_text, notes, status
)
select march_id, dedicatee_id, 'dedicated_to', 'Nuestra Señora de la Esperanza Divina Enfermera',
       date '1980-01-01', '1980', 'Dedicatoria y fecha documentadas por el directorio diocesano.', 'published'
from refs
where not exists (
  select 1 from public.march_dedications existing
  where existing.march_entity_id = refs.march_id
    and existing.dedicatee_entity_id = refs.dedicatee_id
    and existing.status <> 'archived'
);

update public.outing_music_positions position
set notes = 'Acompañamiento musical documentado tras el paso de la Esperanza Divina Enfermera.',
    status = 'published',
    updated_at = now()
from public.outings outing
where outing.id = position.outing_id
  and outing.slug = 'gloria-divina-enfermera-2026'
  and position.position_code = 'behind_glory'
  and position.sequence_no = 2;

update public.outing_music_assignments assignment
set band_entity_id = band.id,
    band_name_text = null,
    participation_mode = 'full_route',
    notes = 'La Banda de Música Nuestra Señora de la Paz de Málaga acompañó tras el paso.',
    status = 'published'
from public.outing_music_positions position
join public.outings outing on outing.id = position.outing_id
cross join public.entities band
where assignment.music_position_id = position.id
  and outing.slug = 'gloria-divina-enfermera-2026'
  and position.position_code = 'behind_glory'
  and position.sequence_no = 2
  and assignment.sequence_no = 1
  and assignment.band_name_text = 'Banda de Música Nuestra Señora de la Paz de Málaga'
  and band.entity_type = 'band'
  and band.slug = 'banda-musica-nuestra-senora-paz-malaga';

with refs as (
  select
    (select id from public.sources where name = 'Repertorio interpretado · Esperanza Divina Enfermera 2026' order by created_at limit 1) source_id,
    (select id from public.outings where slug = 'gloria-divina-enfermera-2026') outing_id
)
insert into public.source_links (source_id, outing_id, scope, notes)
select source_id, outing_id, 'Repertorio interpretado', 'Vincula la lámina con la procesión celebrada.'
from refs
where not exists (
  select 1 from public.source_links existing
  where existing.source_id = refs.source_id and existing.outing_id = refs.outing_id
);

with refs as (
  select
    (select id from public.sources where name = 'ArteSacro · Salida procesional de la Esperanza Divina Enfermera 2026' order by created_at limit 1) source_id,
    assignment.id assignment_id
  from public.outing_music_assignments assignment
  join public.outing_music_positions position on position.id = assignment.music_position_id
  join public.outings outing on outing.id = position.outing_id
  join public.entities band on band.id = assignment.band_entity_id
  where outing.slug = 'gloria-divina-enfermera-2026'
    and band.slug = 'banda-musica-nuestra-senora-paz-malaga'
    and position.position_code = 'behind_glory'
    and position.sequence_no = 2
)
insert into public.source_links (source_id, outing_music_assignment_id, scope, notes)
select source_id, assignment_id, 'Acompañamiento musical', 'Documenta la banda situada tras el paso.'
from refs
where not exists (
  select 1 from public.source_links existing
  where existing.source_id = refs.source_id
    and existing.outing_music_assignment_id = refs.assignment_id
);

with refs as (
  select
    (select id from public.sources where name = 'La Paz Málaga · Quiénes somos' order by created_at limit 1) source_id,
    (select id from public.entities where entity_type = 'band' and slug = 'banda-musica-nuestra-senora-paz-malaga') entity_id
)
insert into public.source_links (source_id, entity_id, scope, notes)
select source_id, entity_id, 'Identidad de la formación', 'Fuente oficial de la banda.'
from refs
where not exists (
  select 1 from public.source_links existing
  where existing.source_id = refs.source_id and existing.entity_id = refs.entity_id
);

with source as (
  select id from public.sources
  where name = 'Directorio diocesano · Esperanza Divina Enfermera'
  order by created_at limit 1
), march as (
  select id from public.entities
  where entity_type = 'march' and slug = 'esperanza-divina-enfermera-jose-de-la-vega'
)
insert into public.source_links (source_id, entity_id, scope, notes)
select source.id, march.id, 'Autoría, fecha y dedicatoria musical',
       'Documenta la obra propia vinculada a la Esperanza Divina Enfermera.'
from source cross join march
where not exists (
  select 1 from public.source_links existing
  where existing.source_id = source.id and existing.entity_id = march.id
);

with source as (
  select id from public.sources
  where name = 'Directorio diocesano · Esperanza Divina Enfermera'
  order by created_at limit 1
), dedication as (
  select d.id
  from public.march_dedications d
  join public.entities march on march.id = d.march_entity_id
  join public.entities dedicatee on dedicatee.id = d.dedicatee_entity_id
  where march.slug = 'esperanza-divina-enfermera-jose-de-la-vega'
    and dedicatee.slug = 'nuestra-senora-esperanza-divina-enfermera'
    and d.status = 'published'
)
insert into public.source_links (source_id, march_dedication_id, scope, notes)
select source.id, dedication.id, 'Dedicatoria musical', 'Respalda la dedicatoria a la titular letífica.'
from source cross join dedication
where not exists (
  select 1 from public.source_links existing
  where existing.source_id = source.id and existing.march_dedication_id = dedication.id
);

with seed(slug, title, notes) as (values
  (
    'sagrada-lanzada-divina-enfermera-paz-malaga-2026',
    'La Sagrada Lanzada · 3 de octubre de 2026 · Banda de Música Nuestra Señora de la Paz de Málaga',
    'Repertorio interpretado tras el paso de Nuestra Señora de la Esperanza Divina Enfermera: 27 obras y 28 interpretaciones. Coronación de la Macarena figura dos veces en la lámina; ×2 no presupone consecutividad.'
  )
)
insert into public.musical_repertoires (
  slug, outing_id, band_entity_id, step_entity_id, source_id, title, repertoire_kind,
  notes, primary_color, accent_color, status
)
select seed.slug, outing.id, band.id, step.id, source.id,
       seed.title, 'performed', seed.notes, '#061B3A', '#D6BF91', 'published'
from seed
join public.outings outing on outing.slug = 'gloria-divina-enfermera-2026'
join public.entities band on band.entity_type = 'band' and band.slug = 'banda-musica-nuestra-senora-paz-malaga'
join public.entities step on step.entity_type = 'step' and step.slug = 'paso-procesional-divina-enfermera'
join public.sources source on source.name = 'Repertorio interpretado · Esperanza Divina Enfermera 2026'
on conflict (slug) do update set
  outing_id = excluded.outing_id,
  band_entity_id = excluded.band_entity_id,
  step_entity_id = excluded.step_entity_id,
  source_id = excluded.source_id,
  title = excluded.title,
  repertoire_kind = excluded.repertoire_kind,
  notes = excluded.notes,
  primary_color = excluded.primary_color,
  accent_color = excluded.accent_color,
  status = excluded.status,
  updated_at = now();

delete from public.musical_repertoire_entries
where repertoire_id = (
  select id from public.musical_repertoires
  where slug = 'sagrada-lanzada-divina-enfermera-paz-malaga-2026'
);

with seed(display_order, march_slug, display_title, source_credit, performance_count, notes) as (values
  (1, 'esperanza-divina-enfermera-jose-de-la-vega', 'Esperanza, Divina Enfermera', 'José de la Vega', 1, null::text),
  (2, 'cuando-pasa-la-esperanza-lopez-gandara', 'Cuando pasa la Esperanza', 'Cristóbal López Gándara', 1, null),
  (3, 'virgen-de-la-estrella-pedro-gamez-laserna', 'Virgen de la Estrella', 'P. Gámez Laserna', 1, null),
  (4, 'marcha-pasa-la-virgen-de-la-soledad-pedro-morales', 'Pasa la Virgen de la Soledad', 'Pedro Morales', 1, null),
  (5, 'virgen-de-las-aguas-santiago-ramos', 'Virgen de las Aguas', 'Santiago Ramos', 1, null),
  (6, 'tras-tu-verde-manto-rafael-wals', 'Tras tu verde manto', 'Rafael Wals', 1, null),
  (7, 'amparo-alfonso-lopez-cortes', '¡Amparo!', 'Alfonso López Cortés', 1, 'Se vincula a la obra de Alfonso López Cortés, no a sus homónimas.'),
  (8, 'pasan-los-campanilleros-manuel-lopez-farfan', 'Pasan los Campanilleros', 'M. L. Farfán', 1, null),
  (9, 'macarena-emilio-cebrian', '¡Macarena!', 'Emilio Cebrián', 1, 'Se vincula a la obra de Emilio Cebrián, no a sus homónimas.'),
  (10, 'regina-pacis-manuel-borrego', 'Regina Pacis', 'Manuel Borrego', 1, null),
  (11, 'carmen-coronada-sergio-bueno', 'Carmen Coronada', 'Sergio Bueno', 1, null),
  (12, 'esperanza-macarena-pedro-morales', 'Esperanza Macarena', 'Pedro Morales', 1, null),
  (13, 'marcha-dulce-nombre-de-jesus-pedro-morales', 'Dulce Nombre de Jesús', 'Pedro Morales', 1, null),
  (14, 'carmen-daniel-albarran', 'Carmen', 'Daniel Albarrán', 1, null),
  (15, 'triana-tu-esperanza-jose-de-la-vega', 'Triana, tu Esperanza', 'José de la Vega', 1, null),
  (16, 'auxilium-christianorum-jaime-texidor', 'Auxilium Christianorum', 'Texidor', 1, null),
  (17, 'la-estrella-sublime-manuel-lopez-farfan', 'La Estrella Sublime', 'M. L. Farfán', 1, null),
  (18, 'coronacion-de-la-macarena-pedro-brana', 'Coronación de la Macarena', 'Pedro Braña', 2, 'Aparece dos veces en la lámina; ×2 solo expresa dos interpretaciones documentadas.'),
  (19, 'saeta-cordobesa-pedro-gamez-laserna', 'Saeta Cordobesa', 'P. Gámez Laserna', 1, null),
  (20, 'la-estrella-trianera-pedro-galvez', 'La Estrella Trianera', 'Pedro Gálvez', 1, null),
  (21, 'rosario-de-montesion-juan-velazquez', 'Rosario de Montesión', 'Juan Velázquez', 1, null),
  (22, 'pasa-la-virgen-macarena-pedro-gamez-laserna', 'Pasa la Virgen Macarena', 'P. Gámez Laserna', 1, null),
  (23, 'virgen-del-rosario-coronada-pablo-ojeda', 'Virgen del Rosario Coronada', 'Pablo Ojeda', 1, null),
  (24, 'como-tu-ninguna-david-hurtado', 'Como tú, ninguna', 'David Hurtado', 1, null),
  (25, 'la-virgen-del-carmen-rafael-wals-dantas', 'La Virgen del Carmen', 'Rafael Wals', 1, null),
  (26, 'marcha-madre-y-senora-del-buen-fin-pedro-morales', 'Madre y Señora del Buen Fin', 'Pedro Morales', 1, null),
  (27, 'marcha-cachorro-eterno', 'Cachorro Eterno', 'Cristóbal López Gándara', 1, null)
)
insert into public.musical_repertoire_entries (
  repertoire_id, march_entity_id, display_title, source_credit, performance_count, display_order, notes
)
select repertoire.id, march.id, seed.display_title, seed.source_credit,
       seed.performance_count, seed.display_order, seed.notes
from seed
join public.musical_repertoires repertoire
  on repertoire.slug = 'sagrada-lanzada-divina-enfermera-paz-malaga-2026'
join public.entities march on march.entity_type = 'march' and march.slug = seed.march_slug;

do $assertions$
declare v_repertoire uuid;
begin
  select id into strict v_repertoire
  from public.musical_repertoires
  where slug = 'sagrada-lanzada-divina-enfermera-paz-malaga-2026';

  if (select count(*) from public.musical_repertoire_entries where repertoire_id = v_repertoire) <> 27 then
    raise exception 'La cruceta de la Divina Enfermera debe contener 27 obras';
  end if;

  if (select sum(performance_count) from public.musical_repertoire_entries where repertoire_id = v_repertoire) <> 28 then
    raise exception 'La cruceta de la Divina Enfermera debe sumar 28 interpretaciones';
  end if;

  if exists (
    select 1 from public.musical_repertoire_entries
    where repertoire_id = v_repertoire and march_entity_id is null
  ) then
    raise exception 'La cruceta de la Divina Enfermera no puede contener obras huérfanas';
  end if;

  if (
    select count(*) from public.musical_repertoire_entries
    where repertoire_id = v_repertoire and performance_count = 2
  ) <> 1 then
    raise exception 'La cruceta de la Divina Enfermera debe conservar exactamente una multiplicidad ×2';
  end if;

  if (
    select count(*)
    from public.outing_music_assignments assignment
    join public.outing_music_positions position on position.id = assignment.music_position_id
    join public.outings outing on outing.id = position.outing_id
    join public.entities band on band.id = assignment.band_entity_id
    where outing.slug = 'gloria-divina-enfermera-2026'
      and band.slug = 'banda-musica-nuestra-senora-paz-malaga'
      and position.position_code = 'behind_glory'
      and position.sequence_no = 2
      and assignment.status = 'published'
  ) <> 1 then
    raise exception 'El acompañamiento de La Paz de Málaga tras el paso debe ser unívoco';
  end if;
end
$assertions$;

commit;
