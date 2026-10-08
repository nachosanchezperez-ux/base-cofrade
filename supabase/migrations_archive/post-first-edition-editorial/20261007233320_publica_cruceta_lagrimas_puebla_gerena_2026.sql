-- Hilo Cofrade · Cruceta del Rosario de las Lágrimas · La Puebla de Cazalla · 4 de octubre de 2026.
-- Repertorio interpretado por la Banda Municipal de Música de Gerena.
-- Solo DML editorial: una fila por obra y multiplicidad literal de la fuente.

begin;

do $preflight$
begin
  if (
    select count(*) from public.outings
    where slug = 'la-puebla-cazalla-lagrimas-rosario-aurora-2026-10-04'
      and outing_date = date '2026-10-04'
      and status = 'published'
  ) <> 1 then
    raise exception 'El Rosario de las Lágrimas de La Puebla de Cazalla no es unívoco';
  end if;

  if (
    select count(*) from public.entities
    where entity_type = 'brotherhood'
      and slug = 'jesus-nazareno-la-puebla-de-cazalla'
      and status = 'published'
  ) <> 1 then
    raise exception 'La Hermandad de Jesús Nazareno de La Puebla de Cazalla no es unívoca';
  end if;

  if (
    select count(*) from public.entities
    where entity_type = 'image'
      and slug = 'maria-santisima-lagrimas-la-puebla-de-cazalla'
      and status = 'published'
  ) <> 1 then
    raise exception 'María Santísima de las Lágrimas de La Puebla de Cazalla no es unívoca';
  end if;

  if (
    select count(*) from public.entities
    where entity_type = 'band'
      and slug = 'banda-municipal-musica-gerena'
      and status = 'published'
  ) <> 1 then
    raise exception 'La Banda Municipal de Música de Gerena no es unívoca';
  end if;

  if (
    select count(*)
    from public.outing_music_assignments assignment
    join public.outing_music_positions position on position.id = assignment.music_position_id
    join public.outings outing on outing.id = position.outing_id
    join public.entities band on band.id = assignment.band_entity_id
    where outing.slug = 'la-puebla-cazalla-lagrimas-rosario-aurora-2026-10-04'
      and band.slug = 'banda-municipal-musica-gerena'
      and position.position_label = 'Regreso tras el Rosario de la Aurora'
      and assignment.status = 'published'
  ) <> 1 then
    raise exception 'El acompañamiento de Gerena en el regreso no es unívoco';
  end if;
end
$preflight$;

update public.outings
set event_status = 'held', updated_at = now()
where slug = 'la-puebla-cazalla-lagrimas-rosario-aurora-2026-10-04'
  and event_status <> 'held';

with seed(name, url, source_type, publisher, publication_date, accessed_at, notes) as (values
  (
    'Repertorio interpretado · Rosario extraordinario de María Santísima de las Lágrimas 2026',
    null::text,
    'social_media',
    'Banda Municipal de Música de Gerena y Hermandad de Jesús Nazareno de La Puebla de Cazalla',
    null::date,
    date '2026-10-08',
    'Lámina oficial posterior al Rosario. Documenta 31 interpretaciones consolidadas en 29 obras.'
  ),
  (
    'Directorio diocesano · Jesús Nazareno de La Puebla de Cazalla',
    'https://www.cofradiasyhermandades.es/fichacofradia-COFRADIAS-LaPueblaDeCazalla-JesusNazareno-OXF1elhZbUF0cjI5d2tENVlyQ3JjZz09',
    'website',
    'Consejo Diocesano para las Hermandades y Cofradías de la Archidiócesis de Sevilla',
    null::date,
    date '2026-10-08',
    'Identifica las autorías y la dedicación a María Santísima de las Lágrimas de las marchas propias documentadas.'
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
  ('Jesús Moreno Núñez', 'jesus-moreno-nunez', 'Compositor de Reina de la Madrugá, marcha dedicada a María Santísima de las Lágrimas de La Puebla de Cazalla.'),
  ('Pablo Jiménez Jiménez', 'pablo-jimenez-jimenez', 'Compositor de Lágrimas de Estrella, marcha dedicada a María Santísima de las Lágrimas de La Puebla de Cazalla.'),
  ('Pedro López', 'pedro-lopez-compositor-lagrimas-puebla', 'Compositor del Himno a la Virgen de las Lágrimas de La Puebla de Cazalla, fechado en 1989.')
)
insert into public.entities (entity_type, name, slug, summary, status)
select 'agent', name, slug, summary, 'published'
from seed
where not exists (
  select 1 from public.entities existing where existing.entity_type = 'agent' and existing.slug = seed.slug
);

with seed(slug) as (values
  ('jesus-moreno-nunez'),
  ('pablo-jimenez-jimenez'),
  ('pedro-lopez-compositor-lagrimas-puebla')
)
insert into public.agents (entity_id, agent_kind, description)
select entity.id, 'person', entity.summary
from seed
join public.entities entity on entity.entity_type = 'agent' and entity.slug = seed.slug
on conflict (entity_id) do nothing;

with seed(slug, title, summary) as (values
  (
    'lagrimas-de-estrella-pablo-jimenez',
    'Lágrimas de Estrella',
    'Marcha de Pablo Jiménez Jiménez dedicada a María Santísima de las Lágrimas de La Puebla de Cazalla.'
  ),
  (
    'himno-a-la-virgen-de-las-lagrimas-pedro-lopez',
    'Himno a la Virgen de las Lágrimas',
    'Marcha de Pedro López dedicada a María Santísima de las Lágrimas de La Puebla de Cazalla.'
  )
)
insert into public.entities (entity_type, name, slug, summary, status)
select 'march', title, slug, summary, 'published'
from seed
where not exists (
  select 1 from public.entities existing where existing.entity_type = 'march' and existing.slug = seed.slug
);

with seed(slug, composition_year) as (values
  ('lagrimas-de-estrella-pablo-jimenez', null::integer),
  ('himno-a-la-virgen-de-las-lagrimas-pedro-lopez', 1989)
)
insert into public.marches (entity_id, composition_year, music_type, work_type, description, eligible_for_daily)
select entity.id, seed.composition_year, 'Banda de Música', 'Marcha procesional', entity.summary, false
from seed
join public.entities entity on entity.entity_type = 'march' and entity.slug = seed.slug
where not exists (select 1 from public.marches existing where existing.entity_id = entity.id);

with seed(march_slug, author_slug) as (values
  ('reina-de-la-madruga-j-moreno', 'jesus-moreno-nunez'),
  ('lagrimas-de-estrella-pablo-jimenez', 'pablo-jimenez-jimenez'),
  ('himno-a-la-virgen-de-las-lagrimas-pedro-lopez', 'pedro-lopez-compositor-lagrimas-puebla')
)
insert into public.march_authors (march_entity_id, agent_entity_id, author_role, notes, status)
select march.id, author.id, 'composer', 'Autoría documentada en la lámina y desarrollada por el directorio diocesano.', 'published'
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

with seed(march_slug) as (values
  ('reina-de-la-madruga-j-moreno'),
  ('lagrimas-de-estrella-pablo-jimenez'),
  ('himno-a-la-virgen-de-las-lagrimas-pedro-lopez')
), dedicatee as (
  select id from public.entities
  where entity_type = 'image' and slug = 'maria-santisima-lagrimas-la-puebla-de-cazalla'
)
insert into public.march_dedications (
  march_entity_id, dedicatee_entity_id, dedication_type, dedication_text, date_from, date_from_text, notes, status
)
select march.id, dedicatee.id, 'dedicated_to', 'María Santísima de las Lágrimas de La Puebla de Cazalla',
       case when seed.march_slug = 'himno-a-la-virgen-de-las-lagrimas-pedro-lopez' then date '1989-01-01' else null end,
       case when seed.march_slug = 'himno-a-la-virgen-de-las-lagrimas-pedro-lopez' then '1989' else null end,
       'Dedicatoria documentada por el directorio diocesano.', 'published'
from seed
join public.entities march on march.entity_type = 'march' and march.slug = seed.march_slug
cross join dedicatee
where not exists (
  select 1 from public.march_dedications existing
  where existing.march_entity_id = march.id
    and existing.dedicatee_entity_id = dedicatee.id
    and existing.status <> 'archived'
);

with refs as (
  select
    (select id from public.sources where name = 'Repertorio interpretado · Rosario extraordinario de María Santísima de las Lágrimas 2026' order by created_at limit 1) source_id,
    (select id from public.outings where slug = 'la-puebla-cazalla-lagrimas-rosario-aurora-2026-10-04') outing_id
)
insert into public.source_links (source_id, outing_id, scope, notes)
select source_id, outing_id, 'Repertorio interpretado', 'Vincula la lámina con la salida celebrada.'
from refs
where not exists (
  select 1 from public.source_links existing
  where existing.source_id = refs.source_id and existing.outing_id = refs.outing_id
);

with refs as (
  select
    (select id from public.sources where name = 'Repertorio interpretado · Rosario extraordinario de María Santísima de las Lágrimas 2026' order by created_at limit 1) source_id,
    (select assignment.id
     from public.outing_music_assignments assignment
     join public.outing_music_positions position on position.id = assignment.music_position_id
     join public.outings outing on outing.id = position.outing_id
     where outing.slug = 'la-puebla-cazalla-lagrimas-rosario-aurora-2026-10-04'
       and assignment.band_entity_id = (select id from public.entities where entity_type = 'band' and slug = 'banda-municipal-musica-gerena')
       and position.position_label = 'Regreso tras el Rosario de la Aurora') assignment_id
)
insert into public.source_links (source_id, outing_music_assignment_id, scope, notes)
select source_id, assignment_id, 'Acompañamiento musical', 'Vincula la cruceta con la Banda Municipal de Música de Gerena y el regreso.'
from refs
where not exists (
  select 1 from public.source_links existing
  where existing.source_id = refs.source_id
    and existing.outing_music_assignment_id = refs.assignment_id
);

with source as (
  select id from public.sources
  where name = 'Directorio diocesano · Jesús Nazareno de La Puebla de Cazalla'
  order by created_at limit 1
), marches(slug) as (values
  ('reina-de-la-madruga-j-moreno'),
  ('lagrimas-de-estrella-pablo-jimenez'),
  ('himno-a-la-virgen-de-las-lagrimas-pedro-lopez')
)
insert into public.source_links (source_id, entity_id, scope, notes)
select source.id, entity.id, 'Autoría y dedicatoria musical', 'Documenta el título canónico, la autoría y su vínculo con María Santísima de las Lágrimas.'
from source
cross join marches
join public.entities entity on entity.entity_type = 'march' and entity.slug = marches.slug
where not exists (
  select 1 from public.source_links existing
  where existing.source_id = source.id and existing.entity_id = entity.id
);

with source as (
  select id from public.sources
  where name = 'Directorio diocesano · Jesús Nazareno de La Puebla de Cazalla'
  order by created_at limit 1
), dedications as (
  select dedication.id
  from public.march_dedications dedication
  join public.entities march on march.id = dedication.march_entity_id
  join public.entities dedicatee on dedicatee.id = dedication.dedicatee_entity_id
  where march.slug in (
    'reina-de-la-madruga-j-moreno',
    'lagrimas-de-estrella-pablo-jimenez',
    'himno-a-la-virgen-de-las-lagrimas-pedro-lopez'
  )
    and dedicatee.slug = 'maria-santisima-lagrimas-la-puebla-de-cazalla'
    and dedication.status = 'published'
)
insert into public.source_links (source_id, march_dedication_id, scope, notes)
select source.id, dedications.id, 'Dedicatoria musical', 'Respalda la dedicatoria a María Santísima de las Lágrimas.'
from source cross join dedications
where not exists (
  select 1 from public.source_links existing
  where existing.source_id = source.id and existing.march_dedication_id = dedications.id
);

with seed(slug, title, notes) as (values
  (
    'jesus-nazareno-puebla-lagrimas-gerena-2026',
    'Hermandad de Jesús Nazareno · 4 de octubre de 2026 · Banda Municipal de Música de Gerena',
    'Repertorio interpretado en el regreso del Rosario de la Aurora de María Santísima de las Lágrimas: 29 obras y 31 interpretaciones. El Día del Señor y Virgen de las Lágrimas figuran dos veces en la lámina; ×2 no presupone consecutividad.'
  )
)
insert into public.musical_repertoires (
  slug, outing_id, band_entity_id, step_entity_id, source_id, title, repertoire_kind, notes, status
)
select seed.slug, outing.id, band.id, null,
       source.id, seed.title, 'performed', seed.notes, 'published'
from seed
join public.outings outing on outing.slug = 'la-puebla-cazalla-lagrimas-rosario-aurora-2026-10-04'
join public.entities band on band.entity_type = 'band' and band.slug = 'banda-municipal-musica-gerena'
join public.sources source on source.name = 'Repertorio interpretado · Rosario extraordinario de María Santísima de las Lágrimas 2026'
on conflict (slug) do update set
  outing_id = excluded.outing_id,
  band_entity_id = excluded.band_entity_id,
  step_entity_id = excluded.step_entity_id,
  source_id = excluded.source_id,
  title = excluded.title,
  repertoire_kind = excluded.repertoire_kind,
  notes = excluded.notes,
  status = excluded.status,
  updated_at = now();

delete from public.musical_repertoire_entries
where repertoire_id = (
  select id from public.musical_repertoires where slug = 'jesus-nazareno-puebla-lagrimas-gerena-2026'
);

with seed(display_order, march_slug, display_title, source_credit, performance_count, notes) as (values
  (1, 'reina-de-la-madruga-j-moreno', 'Reina de la Madrugá', 'J. Moreno', 1, null::text),
  (2, 'tu-eres-el-orgullo-de-nuestro-pueblo-pablo-ojeda', 'Tú eres el orgullo de nuestro pueblo', 'P. Ojeda', 1, null),
  (3, 'coronacion-de-la-macarena-pedro-brana', 'Coronación de la Macarena', 'P. Braña', 1, null),
  (4, 'lagrimas-de-estrella-pablo-jimenez', 'Lágrimas de Estrella', 'P. Jiménez', 1, null),
  (5, 'al-cielo-la-reina-de-triana-gomez-jaldon-espinosa', 'Al cielo la Reina de Triana', 'J. L. Gómez Jaldón', 1, null),
  (6, 'himno-a-la-virgen-de-las-lagrimas-pedro-lopez', 'Virgen de las Lágrimas', 'P. López', 2, 'Aparece dos veces en la lámina; ×2 solo expresa dos interpretaciones documentadas.'),
  (7, 'espiritu-santo-pablo-ojeda', 'Espíritu Santo', 'P. Ojeda', 1, null),
  (8, 'coronacion-puntas-marvizon', 'Coronación', 'Marvizón & Puntas', 1, null),
  (9, 'rocio-manuel-ruiz-vidriet', 'Rocío', 'Vidriet & Tejera', 1, null),
  (10, 'macarena-abel-moreno', 'Macarena', 'A. Moreno', 1, 'Se vincula a la obra de Abel Moreno, no a sus homónimas.'),
  (11, 'la-gloria-de-un-pueblo-felix-carboneras', 'La Gloria de un Pueblo', 'F. de Carboneras', 1, null),
  (12, 'virgen-de-las-aguas-santiago-ramos', 'Virgen de las Aguas', 'S. Ramos', 1, null),
  (13, 'reina-de-gerena-coronada-manuel-jesus-castro', 'Reina de Gerena Coronada', 'M. J. Castro', 1, null),
  (14, 'y-amanecio-en-tu-albayzin-elias-santiago', 'Y amaneció en tu Albayzín', 'E. Santiago', 1, null),
  (15, 'reina-de-triana-jose-miguel-lopez', 'Reina de Triana', 'J. M. López Rueda', 1, null),
  (16, 'la-estrella-jose-pena', 'La Estrella', 'J. Peña', 1, null),
  (17, 'triana-felix-de-carboneras', 'Triana', 'F. de Carboneras', 1, null),
  (18, 'como-tu-ninguna-david-hurtado', 'Como tú, ninguna', 'D. Hurtado', 1, null),
  (19, 'siempre-la-esperanza-jesus-joaquin-espinosa', 'Siempre la Esperanza', 'J. J. Espinosa', 1, null),
  (20, 'aniversario-macareno-jose-velazquez', 'Aniversario Macareno', 'J. Velázquez', 1, null),
  (21, 'rosario-de-montesion-juan-velazquez', 'Rosario de Montesión', 'J. Velázquez', 1, null),
  (22, 'esperanza-de-triana-coronada-jose-albero', 'Esperanza de Triana Coronada', 'J. Albero', 1, null),
  (23, 'marcha-el-dia-del-senor', 'El Día del Señor', 'A. López', 2, 'Aparece dos veces en la lámina; ×2 solo expresa dos interpretaciones documentadas.'),
  (24, 'y-te-corono-sevilla-d-segado', 'Y te coronó Sevilla', 'D. Segado', 1, null),
  (25, 'pasa-la-virgen-macarena-pedro-gamez-laserna', 'Pasa la Virgen Macarena', 'P. Gámez Laserna', 1, null),
  (26, 'la-estrella-sublime-manuel-lopez-farfan', 'La Estrella Sublime', 'M. López Farfán', 1, null),
  (27, 'costaleros-virgen-amparo-jose-ramon-lozano', 'Costaleros de la Virgen del Amparo', 'J. R. Lozano', 1, null),
  (28, 'pasan-los-campanilleros-manuel-lopez-farfan', 'Pasan los Campanilleros', 'M. López Farfán', 1, null),
  (29, 'marcha-encarnacion-coronada-bm-1994', 'Encarnación Coronada', 'A. Moreno', 1, null)
)
insert into public.musical_repertoire_entries (
  repertoire_id, march_entity_id, display_title, source_credit, performance_count, display_order, notes
)
select repertoire.id, march.id, seed.display_title, seed.source_credit,
       seed.performance_count, seed.display_order, seed.notes
from seed
join public.musical_repertoires repertoire on repertoire.slug = 'jesus-nazareno-puebla-lagrimas-gerena-2026'
join public.entities march on march.entity_type = 'march' and march.slug = seed.march_slug;

do $assertions$
declare v_repertoire uuid;
begin
  select id into strict v_repertoire
  from public.musical_repertoires
  where slug = 'jesus-nazareno-puebla-lagrimas-gerena-2026';

  if (select count(*) from public.musical_repertoire_entries where repertoire_id = v_repertoire) <> 29 then
    raise exception 'La cruceta de las Lágrimas debe contener 29 obras';
  end if;

  if (select sum(performance_count) from public.musical_repertoire_entries where repertoire_id = v_repertoire) <> 31 then
    raise exception 'La cruceta de las Lágrimas debe sumar 31 interpretaciones';
  end if;

  if exists (
    select 1 from public.musical_repertoire_entries
    where repertoire_id = v_repertoire and march_entity_id is null
  ) then
    raise exception 'La cruceta de las Lágrimas no puede contener obras huérfanas';
  end if;

  if (
    select count(*) from public.musical_repertoire_entries
    where repertoire_id = v_repertoire and performance_count = 2
  ) <> 2 then
    raise exception 'La cruceta de las Lágrimas debe conservar exactamente dos multiplicidades ×2';
  end if;
end
$assertions$;

commit;
