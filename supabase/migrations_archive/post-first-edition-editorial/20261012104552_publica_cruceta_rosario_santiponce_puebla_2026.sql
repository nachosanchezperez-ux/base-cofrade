-- Hilo Cofrade · cruceta interpretada de Nuestra Señora del Rosario Coronada
-- Santiponce · 10 de octubre de 2026 · Banda Municipal de Música de La Puebla del Río
-- Solo DML editorial. Las repeticiones expresan el número de interpretaciones
-- documentado por las dos láminas, sin presuponer consecutividad, orden procesional
-- ni punto del recorrido.

begin;

do $preflight$
begin
  if (select count(*) from public.outings where slug = 'santiponce-rosario-coronada-2026-10-10' and status = 'published') <> 1 then
    raise exception 'La procesión del Rosario de Santiponce 2026 no es unívoca';
  end if;
  if (select count(*) from public.entities where entity_type = 'brotherhood' and slug = 'hermandad-rosario-santiponce' and status = 'published') <> 1 then
    raise exception 'La Hermandad del Rosario de Santiponce no es unívoca';
  end if;
  if (select count(*) from public.entities where entity_type = 'band' and slug = 'banda-municipal-de-musica-de-la-puebla-del-rio' and status = 'published') <> 1 then
    raise exception 'La Banda Municipal de La Puebla del Río no es unívoca';
  end if;
  if (select count(*) from public.entities where entity_type = 'step' and slug = 'paso-palio-rosario-coronada-santiponce' and status = 'published') <> 1 then
    raise exception 'El paso del Rosario de Santiponce no es unívoco';
  end if;
end
$preflight$;

update public.outings
set event_status = 'held', updated_at = now()
where slug = 'santiponce-rosario-coronada-2026-10-10';

update public.outing_music_positions position
set step_entity_id = step.id, updated_at = now()
from public.outings outing
join public.entities step on step.entity_type = 'step' and step.slug = 'paso-palio-rosario-coronada-santiponce'
where position.outing_id = outing.id
  and outing.slug = 'santiponce-rosario-coronada-2026-10-10'
  and position.position_code = 'behind_glory'
  and position.status = 'published';

with seed(id, name, slug, summary) as (values
  ('964d2d2e-16bb-449f-921f-fbde3e7950a5'::uuid, 'Camilo Pérez Monllor', 'camilo-perez-monllor', 'Compositor acreditado en el repertorio interpretado de Nuestra Señora del Rosario de Santiponce en 2026.'),
  ('66065cae-a7c3-421e-a690-816eff9eaea1'::uuid, 'José Manuel Marín Legido', 'jose-manuel-marin-legido', 'Autor del Himno de la Coronación de la Virgen del Rosario de Santiponce.'),
  ('a97982fb-b4e7-40a1-a07e-dc5e66a158c9'::uuid, 'Miguel Ángel Marín Legido', 'miguel-angel-marin-legido', 'Autor del Himno de la Coronación de la Virgen del Rosario de Santiponce.'),
  ('67eeefda-0ab7-4d28-91b6-ef941f72cd56'::uuid, 'Antonio Fernández', 'antonio-fernandez-arreglista-rosario-santiponce', 'Responsable de los arreglos musicales del Himno de la Coronación de la Virgen del Rosario de Santiponce.')
)
insert into public.entities (id, entity_type, name, slug, summary, status)
select id, 'agent', name, slug, summary, 'published' from seed
where not exists (select 1 from public.entities existing where existing.entity_type = 'agent' and existing.slug = seed.slug);

insert into public.agents (entity_id, agent_kind, description)
select entity.id, 'person', entity.summary
from public.entities entity
where entity.entity_type = 'agent' and entity.slug in (
  'camilo-perez-monllor','jose-manuel-marin-legido','miguel-angel-marin-legido','antonio-fernandez-arreglista-rosario-santiponce'
)
on conflict (entity_id) do nothing;

with seed(id, slug, title, description, composition_year) as (values
  ('be150e4f-20c8-4a85-ad24-103ad36e344e'::uuid, 'la-virgen-del-rosario-lopez-gandara', 'La Virgen del Rosario', 'Marcha de Cristóbal López Gándara dedicada a Nuestra Señora del Rosario Coronada de Santiponce.', 2022),
  ('c82c6ec5-d92c-4d8f-8414-36474ad3867a'::uuid, 'la-divina-pastora-camilo-perez-monllor', 'La Divina Pastora', 'Marcha de Camilo Pérez Monllor documentada en la procesión del Rosario de Santiponce de 2026.', null::integer),
  ('3f9ec84c-99c7-4012-ac8d-472e59f2b803'::uuid, 'esos-tus-ojos-david-hurtado', 'Esos tus ojos', 'Marcha de David Hurtado Torres dedicada a Nuestra Señora del Rosario Doloroso de San Pablo.', 2015),
  ('c0d684ec-438c-4611-a4e4-99f431e158da'::uuid, 'himno-coronacion-virgen-rosario-santiponce-marin-legido', 'Himno de la Coronación de la Virgen del Rosario', 'Himno de la Coronación Canónica de Nuestra Señora del Rosario de Santiponce, de José Manuel y Miguel Ángel Marín Legido, con arreglos de Antonio Fernández.', 2008)
)
insert into public.entities (id, entity_type, name, slug, summary, status)
select id, 'march', title, slug, description, 'published' from seed
where not exists (select 1 from public.entities existing where existing.entity_type = 'march' and existing.slug = seed.slug);

with seed(slug, description, composition_year) as (values
  ('la-virgen-del-rosario-lopez-gandara', 'Marcha dedicada a Nuestra Señora del Rosario Coronada de Santiponce.', 2022),
  ('la-divina-pastora-camilo-perez-monllor', 'Obra documentada en el repertorio interpretado de Santiponce en 2026.', null::integer),
  ('esos-tus-ojos-david-hurtado', 'Marcha dedicada a Nuestra Señora del Rosario Doloroso de San Pablo.', 2015),
  ('himno-coronacion-virgen-rosario-santiponce-marin-legido', 'Himno de la Coronación Canónica de Nuestra Señora del Rosario de Santiponce.', 2008)
)
insert into public.marches (entity_id, music_type, work_type, description, composition_year, eligible_for_daily)
select entity.id, 'Banda de Música', 'Marcha procesional', seed.description, seed.composition_year, false
from seed join public.entities entity on entity.entity_type = 'march' and entity.slug = seed.slug
where not exists (select 1 from public.marches existing where existing.entity_id = entity.id);

with seed(march_slug, author_slug, author_role) as (values
  ('la-virgen-del-rosario-lopez-gandara', 'cristobal-lopez-gandara', 'composer'),
  ('la-divina-pastora-camilo-perez-monllor', 'camilo-perez-monllor', 'composer'),
  ('esos-tus-ojos-david-hurtado', 'david-hurtado-torres', 'composer'),
  ('himno-coronacion-virgen-rosario-santiponce-marin-legido', 'jose-manuel-marin-legido', 'composer'),
  ('himno-coronacion-virgen-rosario-santiponce-marin-legido', 'miguel-angel-marin-legido', 'composer'),
  ('himno-coronacion-virgen-rosario-santiponce-marin-legido', 'antonio-fernandez-arreglista-rosario-santiponce', 'adapter')
)
insert into public.march_authors (march_entity_id, agent_entity_id, author_role, status)
select march.id, author.id, seed.author_role, 'published'
from seed
join public.entities march on march.entity_type = 'march' and march.slug = seed.march_slug
join public.entities author on author.entity_type = 'agent' and author.slug = seed.author_slug
where not exists (
  select 1 from public.march_authors existing
  where existing.march_entity_id = march.id and existing.agent_entity_id = author.id
    and existing.author_role = seed.author_role and existing.status <> 'archived'
);

with seed(march_slug, dedicatee_slug, dedication_text) as (values
  ('la-virgen-del-rosario-lopez-gandara', 'nuestra-senora-rosario-coronada-santiponce', 'A Nuestra Señora del Rosario Coronada de Santiponce.'),
  ('esos-tus-ojos-david-hurtado', 'nuestra-senora-del-rosario-doloroso-san-pablo', 'A Nuestra Señora del Rosario Doloroso de San Pablo.'),
  ('himno-coronacion-virgen-rosario-santiponce-marin-legido', 'nuestra-senora-rosario-coronada-santiponce', 'Himno de su Coronación Canónica.')
)
insert into public.march_dedications (march_entity_id, dedicatee_entity_id, dedication_type, dedication_text, status)
select march.id, dedicatee.id, 'image', seed.dedication_text, 'published'
from seed
join public.entities march on march.entity_type = 'march' and march.slug = seed.march_slug
join public.entities dedicatee on dedicatee.entity_type = 'image' and dedicatee.slug = seed.dedicatee_slug
where not exists (
  select 1 from public.march_dedications existing
  where existing.march_entity_id = march.id and existing.dedicatee_entity_id = dedicatee.id and existing.status <> 'archived'
);

insert into public.sources (id, name, source_type, author_or_publisher, publication_date, accessed_at, notes)
select '01be0a80-7188-4736-a07b-427e533b1906'::uuid,
       'Repertorio musical · Rosario de Santiponce 2026', 'social_media',
       'Hermandad del Rosario de Santiponce', date '2026-10-12', date '2026-10-12',
       'Dos láminas publicadas tras la procesión con 33 interpretaciones de 31 obras. La fuente no acredita orden procesional, puntos del recorrido ni consecutividad.'
where not exists (
  select 1 from public.sources where name = 'Repertorio musical · Rosario de Santiponce 2026'
    and author_or_publisher = 'Hermandad del Rosario de Santiponce'
);

with source as (
  select id from public.sources where name = 'Repertorio musical · Rosario de Santiponce 2026'
    and author_or_publisher = 'Hermandad del Rosario de Santiponce' order by created_at limit 1
)
insert into public.musical_repertoires (
  id, slug, outing_id, band_entity_id, step_entity_id, source_id, title, repertoire_kind,
  notes, primary_color, accent_color, status
)
select 'd49e6ab5-fd20-4e50-a877-d87998ffea77'::uuid,
       'rosario-santiponce-puebla-rio-2026', outing.id, band.id, step.id, source.id,
       'Rosario de Santiponce · 10 de octubre de 2026 · Banda Municipal de La Puebla del Río',
       'performed',
       'Repertorio interpretado: 31 obras distintas y 33 interpretaciones. Himno Nacional y La Virgen del Rosario de Cristóbal López Gándara figuran dos veces. ×2 no presupone consecutividad, orden procesional ni ubicación.',
       '#651F2A', '#D5A532', 'published'
from public.outings outing
join public.entities band on band.entity_type = 'band' and band.slug = 'banda-municipal-de-musica-de-la-puebla-del-rio'
join public.entities step on step.entity_type = 'step' and step.slug = 'paso-palio-rosario-coronada-santiponce'
cross join source
where outing.slug = 'santiponce-rosario-coronada-2026-10-10'
on conflict (slug) do update set
  outing_id = excluded.outing_id, band_entity_id = excluded.band_entity_id,
  step_entity_id = excluded.step_entity_id, source_id = excluded.source_id,
  title = excluded.title, repertoire_kind = excluded.repertoire_kind, notes = excluded.notes,
  primary_color = excluded.primary_color, accent_color = excluded.accent_color,
  status = excluded.status, updated_at = now();

delete from public.musical_repertoire_entries
where repertoire_id = (select id from public.musical_repertoires where slug = 'rosario-santiponce-puebla-rio-2026');

with seed(display_order, march_slug, display_title, source_credit) as (values
  (1, 'himno-nacional-espana', 'Himno Nacional', null::text),
  (2, 'la-virgen-del-rosario-lopez-gandara', 'La Virgen del Rosario', 'C. L. Gándara'),
  (3, 'como-tu-ninguna-david-hurtado', 'Como tú, ninguna', 'D. Hurtado'),
  (4, 'marcha-virgen-de-los-negritos-pedro-morales', 'Virgen de los Negritos', 'P. Morales'),
  (5, 'auxilium-christianorum-jaime-texidor', 'Auxilium Christianorum', 'J. Texidor'),
  (6, 'marcha-encarnacion-bm-2017', 'Encarnación', 'C. L. Gándara'),
  (7, 'madre-hiniesta-manuel-marvizon', 'Madre Hiniesta', 'M. Marvizón'),
  (8, 'marcha-bendita-la-hora-que-el-mundo-te-vio', 'Bendita la hora que el mundo te vio', 'D. Albarrán'),
  (9, 'virgen-de-la-estrella-pedro-gamez-laserna', 'Virgen de la Estrella', 'P. Gámez Laserna'),
  (10, 'la-divina-pastora-camilo-perez-monllor', 'La Divina Pastora', 'C. P. Monllor'),
  (11, 'virgen-macarena-francisco-javier-alonso-delgado', 'Virgen Macarena', 'Fco. J. Alonso Delgado'),
  (12, 'virgen-del-rosario-german-alvarez-beigbeder', 'Virgen del Rosario', 'G. A. Beigbeder'),
  (13, 'madruga-macarena-pablo-ojeda', 'Madrugá Macarena', 'P. Ojeda'),
  (14, 'y-amanecio-en-tu-albayzin-elias-santiago', 'Y amaneció en tu Albaycín', 'E. Santiago'),
  (15, 'coronacion-de-la-paz-david-hurtado', 'Coronación de la Paz', 'D. Hurtado'),
  (16, 'la-estrella-sublime-manuel-lopez-farfan', 'La Estrella Sublime', 'M. L. Farfán'),
  (17, 'quien-te-vio-y-no-te-recuerda-david-hurtado', '¿Quién te vio y no te recuerda? Saeta Jerezana', 'D. Hurtado'),
  (18, 'esos-tus-ojos-david-hurtado', 'Esos tus ojos', 'D. Hurtado'),
  (19, 'la-estrella-trianera-pedro-galvez', 'La Estrella Trianera', 'P. Gálvez'),
  (20, 'pasa-la-virgen-macarena-pedro-gamez-laserna', 'Pasa la Virgen Macarena', 'P. Gámez Laserna'),
  (21, 'marcha-cachorro-eterno', 'Cachorro Eterno', 'C. L. Gándara'),
  (22, 'la-virgen-de-las-angustias-david-hurtado', 'La Virgen de las Angustias', 'D. Hurtado'),
  (23, 'esperanza-macarena-pedro-morales', 'Esperanza Macarena', 'P. Morales'),
  (24, 'macarena-abel-moreno', 'Macarena', 'A. Moreno'),
  (25, 'la-asuncion-de-cantillana-pedro-brana', 'La Asunción de Cantillana', 'P. Braña'),
  (26, 'pasa-la-virgen-de-la-candelaria-lopez-gandara', 'Pasa la Virgen de la Candelaria', 'C. L. Gándara'),
  (27, 'cuando-pasa-la-esperanza-lopez-gandara', 'Cuando pasa la Esperanza', 'C. L. Gándara'),
  (28, 'himno-coronacion-virgen-rosario-santiponce-marin-legido', 'Himno de la Coronación de la Virgen del Rosario', 'J. M. y M. A. Marín Legido'),
  (29, 'la-virgen-del-rosario-lopez-gandara', 'La Virgen del Rosario', 'C. L. Gándara'),
  (30, 'coronacion-puntas-marvizon', 'Coronación', 'M. Marvizón'),
  (31, 'pasan-los-campanilleros-manuel-lopez-farfan', 'Pasan los Campanilleros', 'M. L. Farfán'),
  (32, 'coronacion-de-la-macarena-pedro-brana', 'Coronación de la Macarena', 'P. Braña'),
  (33, 'himno-nacional-espana', 'Himno Nacional', null)
)
insert into public.musical_repertoire_entries (
  repertoire_id, march_entity_id, display_title, source_credit, performance_count, display_order, notes
)
select repertoire.id, march.id, min(seed.display_title), min(seed.source_credit), count(*)::integer, min(seed.display_order),
       case when count(*) > 1
         then 'La obra figura dos veces en las láminas; ×2 no presupone consecutividad.'
         else 'Obra documentada en la fuente; la posición no equivale a orden procesional.'
       end
from seed
join public.musical_repertoires repertoire on repertoire.slug = 'rosario-santiponce-puebla-rio-2026'
join public.entities march on march.entity_type = 'march' and march.slug = seed.march_slug
group by repertoire.id, march.id;

do $postflight$
declare v_repertoire uuid;
begin
  select id into strict v_repertoire from public.musical_repertoires where slug = 'rosario-santiponce-puebla-rio-2026';
  if (select count(*) from public.musical_repertoire_entries where repertoire_id = v_repertoire) <> 31 then
    raise exception 'La cruceta de Santiponce debe contener 31 obras';
  end if;
  if (select count(distinct march_entity_id) from public.musical_repertoire_entries where repertoire_id = v_repertoire) <> 31 then
    raise exception 'La cruceta de Santiponce debe contener 31 obras distintas';
  end if;
  if (select sum(performance_count) from public.musical_repertoire_entries where repertoire_id = v_repertoire) <> 33 then
    raise exception 'La cruceta de Santiponce debe sumar 33 interpretaciones';
  end if;
  if (select count(*) from public.musical_repertoire_entries where repertoire_id = v_repertoire and performance_count = 2) <> 2 then
    raise exception 'La cruceta de Santiponce debe conservar exactamente dos multiplicidades ×2';
  end if;
  if (select performance_count from public.musical_repertoire_entries entry join public.entities march on march.id=entry.march_entity_id where entry.repertoire_id=v_repertoire and march.slug='himno-nacional-espana') <> 2 then
    raise exception 'El Himno Nacional debe registrar ×2';
  end if;
  if (select performance_count from public.musical_repertoire_entries entry join public.entities march on march.id=entry.march_entity_id where entry.repertoire_id=v_repertoire and march.slug='la-virgen-del-rosario-lopez-gandara') <> 2 then
    raise exception 'La Virgen del Rosario de López Gándara debe registrar ×2';
  end if;
  if (select count(*) from public.musical_repertoires repertoire join public.outings outing on outing.id=repertoire.outing_id join public.entities band on band.id=repertoire.band_entity_id join public.entities step on step.id=repertoire.step_entity_id where repertoire.id=v_repertoire and outing.outing_date=date '2026-10-10' and outing.event_status='held' and band.slug='banda-municipal-de-musica-de-la-puebla-del-rio' and step.slug='paso-palio-rosario-coronada-santiponce' and repertoire.primary_color='#651F2A' and repertoire.accent_color='#D5A532') <> 1 then
    raise exception 'La identidad Hermandad-fecha-Banda-paso-paleta no es íntegra';
  end if;
  if exists (
    select 1 from public.musical_repertoire_entries entry
    left join public.march_authors author on author.march_entity_id=entry.march_entity_id and author.status='published'
    where entry.repertoire_id=v_repertoire group by entry.id having count(author.id)=0
  ) then
    raise exception 'Todas las obras deben conservar al menos una autoría publicada';
  end if;
end
$postflight$;

commit;
