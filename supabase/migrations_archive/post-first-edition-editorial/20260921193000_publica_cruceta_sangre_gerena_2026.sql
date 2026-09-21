-- Hilo Cofrade · repertorio interpretado en la Coronación Canónica de María Santísima de la Sangre
-- Vera-Cruz de Gerena · 12 de septiembre de 2026 · Banda Municipal de Música de Gerena
-- Solo DML editorial. Sin DDL, RLS, arquitectura ni UX nueva.

begin;

do $preflight$
begin
  if (
    select count(*) from public.outings
    where slug = 'gerena-sangre-2026'
      and outing_date = date '2026-09-12'
      and status = 'published'
  ) <> 1 then
    raise exception 'La salida de la Coronación Canónica de la Virgen de la Sangre no es unívoca';
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
    select count(*) from public.entities
    where entity_type = 'step'
      and slug = 'paso-palio-sangre-gerena'
      and status = 'published'
  ) <> 1 then
    raise exception 'El paso de palio de María Santísima de la Sangre no es unívoco';
  end if;

  if (
    select count(*)
    from public.outing_music_positions position
    join public.outings outing on outing.id = position.outing_id
    where outing.slug = 'gerena-sangre-2026'
      and position.position_label in ('Traslado de ida', 'Tras el paso en la procesión triunfal')
  ) <> 2 then
    raise exception 'Los dos tramos musicales documentados de la salida de Gerena no son unívocos';
  end if;
end
$preflight$;

insert into public.sources (name, url, source_type, author_or_publisher, publication_date, accessed_at, notes)
select
  'Repertorio interpretado · Coronación Canónica de María Santísima de la Sangre 2026',
  null,
  'social_media',
  'Banda Municipal de Música de Gerena',
  null,
  date '2026-09-21',
  'Lámina publicada tras la coronación. Documenta 59 menciones: 9 en el traslado de ida y 50 en la procesión triunfal de regreso. Se consolidan en 48 obras distintas, sin inferir consecutividad, calle, chicotá ni cronología interna.'
where not exists (
  select 1 from public.sources
  where name = 'Repertorio interpretado · Coronación Canónica de María Santísima de la Sangre 2026'
    and author_or_publisher = 'Banda Municipal de Música de Gerena'
);

update public.outing_music_assignments assignment
set band_entity_id = band.id,
    band_name_text = null,
    notes = case
      when position.position_label = 'Traslado de ida'
        then 'La Banda Municipal de Música de Gerena interpretó el repertorio documentado en el traslado de ida.'
      else 'La Banda Municipal de Música de Gerena interpretó el repertorio documentado tras el paso en la procesión triunfal de regreso.'
    end,
    status = 'published'
from public.outing_music_positions position
join public.outings outing on outing.id = position.outing_id
join public.entities band on band.entity_type = 'band' and band.slug = 'banda-municipal-musica-gerena'
where assignment.music_position_id = position.id
  and outing.slug = 'gerena-sangre-2026'
  and position.position_label in ('Traslado de ida', 'Tras el paso en la procesión triunfal');

with author_seed(name, slug) as (values
  ('Víctor Manuel Ferrer Castillo', 'victor-manuel-ferrer-castillo'),
  ('Manuel Jesús Castro Gomila', 'manuel-jesus-castro-gomila'),
  ('Manuela Carrero Fuentes', 'manuela-carrero-fuentes')
)
insert into public.entities (entity_type, name, slug, summary, status)
select 'agent', seed.name, seed.slug,
       'Autor vinculado al repertorio interpretado en la Coronación Canónica de María Santísima de la Sangre de Gerena en 2026.',
       'published'
from author_seed seed
where not exists (
  select 1 from public.entities entity
  where entity.entity_type = 'agent'
    and lower(translate(entity.name, 'ÁÉÍÓÚÜÑáéíóúüñ', 'AEIOUUNaeiouun')) =
        lower(translate(seed.name, 'ÁÉÍÓÚÜÑáéíóúüñ', 'AEIOUUNaeiouun'))
);

with author_seed(name) as (values
  ('Víctor Manuel Ferrer Castillo'),
  ('Manuel Jesús Castro Gomila'),
  ('Manuela Carrero Fuentes')
)
insert into public.agents (entity_id, agent_kind, description)
select entity.id, 'person', entity.summary
from author_seed seed
join public.entities entity on entity.entity_type = 'agent'
  and lower(translate(entity.name, 'ÁÉÍÓÚÜÑáéíóúüñ', 'AEIOUUNaeiouun')) =
      lower(translate(seed.name, 'ÁÉÍÓÚÜÑáéíóúüñ', 'AEIOUUNaeiouun'))
on conflict (entity_id) do nothing;

with march_seed(slug, title) as (values
  ('virgen-de-la-sangre-manuel-vizcaino', 'Virgen de la Sangre'),
  ('hiniesta-coronada-jose-albero', 'Hiniesta Coronada'),
  ('maria-santisima-de-la-o-abel-moreno', 'María Santísima de la O'),
  ('sangre-coronada-a-nogales', 'Sangre Coronada'),
  ('mi-amargura-victor-manuel-ferrer', 'Mi Amargura'),
  ('la-sangre-de-gerena-jose-pena', 'La Sangre de Gerena'),
  ('virgen-de-la-sangre-coronada-manuel-marvizon', 'Virgen de la Sangre Coronada'),
  ('madre-mia-de-la-sangre-e-f-bautista', 'Madre mía de la Sangre'),
  ('reina-de-gerena-coronada-manuel-jesus-castro', 'Reina de Gerena Coronada'),
  ('y-te-corono-sevilla-d-segado', 'Y te coronó Sevilla'),
  ('la-estrella-jose-pena', 'La Estrella'),
  ('reina-de-vera-cruz-j-m-velazquez', 'Reina de Vera-Cruz'),
  ('madre-de-los-cruceros-de-gerena-manuela-carrero', 'Madre de los Cruceros de Gerena'),
  ('esperanza-que-guia-a-triana-jose-leon-alapont', 'Esperanza que guía a Triana'),
  ('reina-de-la-madruga-j-moreno', 'Reina de la Madrugá')
)
insert into public.entities (entity_type, name, slug, summary, status)
select 'march', seed.title, seed.slug,
       'Obra documentada en el repertorio interpretado por la Banda Municipal de Música de Gerena en la Coronación Canónica de María Santísima de la Sangre de 2026.',
       'published'
from march_seed seed
where not exists (
  select 1 from public.entities entity
  where entity.entity_type = 'march' and entity.slug = seed.slug
);

with march_seed(slug) as (values
  ('virgen-de-la-sangre-manuel-vizcaino'),
  ('hiniesta-coronada-jose-albero'),
  ('maria-santisima-de-la-o-abel-moreno'),
  ('sangre-coronada-a-nogales'),
  ('mi-amargura-victor-manuel-ferrer'),
  ('la-sangre-de-gerena-jose-pena'),
  ('virgen-de-la-sangre-coronada-manuel-marvizon'),
  ('madre-mia-de-la-sangre-e-f-bautista'),
  ('reina-de-gerena-coronada-manuel-jesus-castro'),
  ('y-te-corono-sevilla-d-segado'),
  ('la-estrella-jose-pena'),
  ('reina-de-vera-cruz-j-m-velazquez'),
  ('madre-de-los-cruceros-de-gerena-manuela-carrero'),
  ('esperanza-que-guia-a-triana-jose-leon-alapont'),
  ('reina-de-la-madruga-j-moreno')
)
insert into public.marches (entity_id, music_type, work_type, description, eligible_for_daily)
select entity.id, 'Banda de Música', 'Marcha procesional',
       'Interpretada por la Banda Municipal de Música de Gerena en la Coronación Canónica de María Santísima de la Sangre el 12 de septiembre de 2026.',
       false
from march_seed seed
join public.entities entity on entity.entity_type = 'march' and entity.slug = seed.slug
where not exists (select 1 from public.marches march where march.entity_id = entity.id);

with author_seed(march_slug, author_name) as (values
  ('hiniesta-coronada-jose-albero', 'José Albero Francés'),
  ('maria-santisima-de-la-o-abel-moreno', 'Abel Moreno Gómez'),
  ('mi-amargura-victor-manuel-ferrer', 'Víctor Manuel Ferrer Castillo'),
  ('la-sangre-de-gerena-jose-pena', 'José Peña Rubio'),
  ('virgen-de-la-sangre-coronada-manuel-marvizon', 'Manuel Marvizón Carvallo'),
  ('reina-de-gerena-coronada-manuel-jesus-castro', 'Manuel Jesús Castro Gomila'),
  ('la-estrella-jose-pena', 'José Peña Rubio'),
  ('madre-de-los-cruceros-de-gerena-manuela-carrero', 'Manuela Carrero Fuentes'),
  ('esperanza-que-guia-a-triana-jose-leon-alapont', 'José León Alapont')
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

-- La discografía de la propia Banda ya está catalogada. Se vinculan sus pistas
-- con las fichas canónicas para que la escucha aparezca también desde la marcha.
with track_link(track_title, march_slug) as (values
  ('Virgen de la Sangre', 'virgen-de-la-sangre-manuel-vizcaino'),
  ('Sangre Coronada', 'sangre-coronada-a-nogales'),
  ('Madre de los Cruceros de Gerena', 'madre-de-los-cruceros-de-gerena-manuela-carrero'),
  ('La Sangre de Gerena', 'la-sangre-de-gerena-jose-pena'),
  ('Reina de Vera-Cruz', 'reina-de-vera-cruz-j-m-velazquez'),
  ('Virgen de la Sangre Coronada', 'virgen-de-la-sangre-coronada-manuel-marvizon'),
  ('Reina de Gerena Coronada', 'reina-de-gerena-coronada-manuel-jesus-castro'),
  ('Madre mía de la Sangre | Himno de la Coronación', 'madre-mia-de-la-sangre-e-f-bautista'),
  ('Madre Mía de la Sangre | Himno de la Coronación', 'madre-mia-de-la-sangre-e-f-bautista')
)
update public.band_release_tracks track
set march_entity_id = march.id
from public.band_releases release,
     track_link seed
join public.entities march on march.entity_type = 'march' and march.slug = seed.march_slug
join public.entities band on band.entity_type = 'band' and band.slug = 'banda-municipal-musica-gerena'
where track.release_id = release.id
  and release.band_entity_id = band.id
  and track.title = seed.track_title;

do $cruceta$
declare
  v_outing_id uuid;
  v_band_id uuid;
  v_step_id uuid;
  v_source_id uuid;
  v_repertoire_id uuid;
  v_assignment_id uuid;
begin
  select id into strict v_outing_id from public.outings where slug = 'gerena-sangre-2026';
  select id into strict v_band_id from public.entities
  where entity_type = 'band' and slug = 'banda-municipal-musica-gerena';
  select id into strict v_step_id from public.entities
  where entity_type = 'step' and slug = 'paso-palio-sangre-gerena';
  select id into strict v_source_id from public.sources
  where name = 'Repertorio interpretado · Coronación Canónica de María Santísima de la Sangre 2026'
    and author_or_publisher = 'Banda Municipal de Música de Gerena'
  order by created_at limit 1;

  insert into public.source_links (source_id, outing_id, scope, notes)
  select v_source_id, v_outing_id, 'Repertorio interpretado',
         'Fuente directa del repertorio interpretado en el traslado de ida y la procesión triunfal de regreso.'
  where not exists (
    select 1 from public.source_links where source_id = v_source_id and outing_id = v_outing_id
  );

  for v_assignment_id in
    select assignment.id
    from public.outing_music_assignments assignment
    join public.outing_music_positions position on position.id = assignment.music_position_id
    where position.outing_id = v_outing_id
      and position.position_label in ('Traslado de ida', 'Tras el paso en la procesión triunfal')
      and assignment.band_entity_id = v_band_id
  loop
    insert into public.source_links (source_id, outing_music_assignment_id, scope, notes)
    select v_source_id, v_assignment_id, 'Acompañamiento musical',
           'Vincula el tramo documentado con la Banda Municipal de Música de Gerena.'
    where not exists (
      select 1 from public.source_links
      where source_id = v_source_id and outing_music_assignment_id = v_assignment_id
    );
  end loop;

  insert into public.musical_repertoires (
    slug, outing_id, band_entity_id, step_entity_id, source_id, title,
    repertoire_kind, notes, status
  ) values (
    'virgen-sangre-gerena-coronacion-2026',
    v_outing_id,
    v_band_id,
    v_step_id,
    v_source_id,
    'Repertorio interpretado de María Santísima de la Sangre · 12 de septiembre de 2026',
    'performed',
    'La lámina de la Banda documenta 59 menciones consolidadas en 48 obras: 9 en el traslado de ida y 50 en la procesión triunfal de regreso. El orden editorial sigue la primera aparición en la fuente. Las cifras ×2 y ×3 expresan únicamente cuántas veces figura interpretada cada marcha, sin deducir consecutividad, punto del recorrido ni chicotá. El rótulo «Madre de los Cruceos de Gerena» se reconcilia con el título canónico «Madre de los Cruceros de Gerena».',
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
    (1, 'ave-maria-vavilov-arreglo-lozano-garrido', 'Ave María', 'V. Vavilov', 1, 'Traslado de ida.'),
    (2, 'virgen-de-la-sangre-manuel-vizcaino', 'Virgen de la Sangre', 'M. Vizcaíno', 3, 'Figura una vez en el traslado de ida y dos en la procesión triunfal de regreso.'),
    (3, 'coronacion-puntas-marvizon', 'Coronación', 'Marvizón y Puntas', 1, 'Traslado de ida.'),
    (4, 'virgen-de-la-paz-pedro-morales', 'Virgen de la Paz', 'P. Morales', 1, 'Traslado de ida.'),
    (5, 'marcha-encarnacion-de-la-calzada-bm-1983', 'Encarnación de la Calzada', 'J. de los Santos', 2, 'Figura en el traslado de ida y en la procesión triunfal de regreso.'),
    (6, 'madre-de-los-gitanos-coronada-abel-moreno', 'Madre de los Gitanos Coronada', 'A. Moreno', 1, 'Traslado de ida.'),
    (7, 'hiniesta-coronada-jose-albero', 'Hiniesta Coronada', 'J. Albero', 1, 'Traslado de ida.'),
    (8, 'maria-santisima-de-la-o-abel-moreno', 'María Santísima de la O', 'A. Moreno', 1, 'Traslado de ida.'),
    (9, 'la-estrella-sublime-manuel-lopez-farfan', 'La Estrella Sublime', 'M. L. Farfán', 1, 'Traslado de ida.'),
    (10, 'sangre-coronada-a-nogales', 'Sangre Coronada', 'A. Nogales', 1, 'Procesión triunfal de regreso.'),
    (11, 'mi-amargura-victor-manuel-ferrer', 'Mi Amargura', 'V. M. Ferrer', 1, 'Procesión triunfal de regreso.'),
    (12, 'la-sangre-de-gerena-jose-pena', 'La Sangre de Gerena', 'J. Peña', 1, 'Procesión triunfal de regreso.'),
    (13, 'virgen-de-la-sangre-coronada-manuel-marvizon', 'Virgen de la Sangre Coronada', 'M. Marvizón', 1, 'Procesión triunfal de regreso.'),
    (14, 'madre-mia-de-la-sangre-e-f-bautista', 'Madre mía de la Sangre', 'E. F. Bautista', 1, 'Procesión triunfal de regreso.'),
    (15, 'reina-de-gerena-coronada-manuel-jesus-castro', 'Reina de Gerena Coronada', 'M. J. Castro', 3, 'Procesión triunfal de regreso.'),
    (16, 'y-te-corono-sevilla-d-segado', 'Y te coronó Sevilla', 'D. Segado', 2, 'Procesión triunfal de regreso.'),
    (17, 'reina-de-triana-jose-miguel-lopez', 'Reina de Triana', 'J. M. López Rueda', 1, 'Procesión triunfal de regreso.'),
    (18, 'virgen-coronada-de-estrellas-manuel-retobollo', 'Virgen Coronada de Estrellas', 'M. Rebollo', 2, 'Procesión triunfal de regreso; se conserva literalmente el crédito de la lámina.'),
    (19, 'rosario-de-montesion-juan-velazquez', 'Rosario de Montesión', 'J. Velázquez', 1, 'Procesión triunfal de regreso.'),
    (20, 'la-estrella-jose-pena', 'La Estrella', 'J. Peña', 1, 'Procesión triunfal de regreso.'),
    (21, 'esperanza-de-triana-coronada-jose-albero', 'Esperanza de Triana Coronada', 'J. Albero', 1, 'Procesión triunfal de regreso.'),
    (22, 'costaleros-virgen-amparo-jose-ramon-lozano', 'Costaleros de la Virgen del Amparo', 'J. R. Lozano', 2, 'Procesión triunfal de regreso.'),
    (23, 'la-gloria-de-un-pueblo-felix-carboneras', 'La Gloria de un Pueblo', 'F. de Carboneras', 2, 'Procesión triunfal de regreso.'),
    (24, 'triana-felix-de-carboneras', 'Triana', 'F. de Carboneras', 1, 'Procesión triunfal de regreso.'),
    (25, 'coronacion-de-la-macarena-pedro-brana', 'Coronación de la Macarena', 'P. Braña', 2, 'Procesión triunfal de regreso.'),
    (26, 'como-tu-ninguna-david-hurtado', 'Como tú, ninguna', 'D. Hurtado', 1, 'Procesión triunfal de regreso.'),
    (27, 'la-mision-de-la-esperanza-ruben-jordan', 'La Misión de la Esperanza', 'R. Jordán', 1, 'Procesión triunfal de regreso.'),
    (28, 'al-cielo-la-reina-de-triana-gomez-jaldon-espinosa', 'Al Cielo la Reina de Triana', 'J. L. Gómez Jaldón', 2, 'Procesión triunfal de regreso.'),
    (29, 'siempre-macarena-jose-leon-alapont', 'Siempre Macarena', 'J. León Alapont', 1, 'Procesión triunfal de regreso.'),
    (30, 'marcha-el-dia-del-senor', 'El Día del Señor', 'A. L. Cortés', 1, 'Procesión triunfal de regreso.'),
    (31, 'pasa-la-virgen-macarena-pedro-gamez-laserna', 'Pasa la Virgen Macarena', 'P. G. Laserna', 1, 'Procesión triunfal de regreso.'),
    (32, 'esperanza-macarena-pedro-morales', 'Esperanza Macarena', 'P. Morales', 1, 'Procesión triunfal de regreso.'),
    (33, 'pasan-los-campanilleros-manuel-lopez-farfan', 'Pasan los Campanilleros', 'M. L. Farfán', 1, 'Procesión triunfal de regreso.'),
    (34, 'aniversario-macareno-jose-velazquez', 'Aniversario Macareno', 'J. Velázquez', 1, 'Procesión triunfal de regreso.'),
    (35, 'madruga-macarena-pablo-ojeda', 'Madrugá Macarena', 'P. Ojeda', 1, 'Procesión triunfal de regreso.'),
    (36, 'marcha-encarnacion-coronada-bm-1994', 'Encarnación Coronada', 'A. Moreno', 1, 'Procesión triunfal de regreso.'),
    (37, 'se-arrodilla-triana-david-hurtado', 'Se arrodilla Triana', 'D. Hurtado', 1, 'Procesión triunfal de regreso.'),
    (38, 'tu-eres-el-orgullo-de-nuestro-pueblo-pablo-ojeda', 'Tú eres el orgullo de nuestro pueblo', 'P. Ojeda', 1, 'Procesión triunfal de regreso.'),
    (39, 'rocio-manuel-ruiz-vidriet', 'Rocío', 'Vidriet y Tejera', 1, 'Procesión triunfal de regreso; se conserva literalmente el crédito conjunto de la lámina.'),
    (40, 'senorita-de-triana-pedro-morales', 'Señorita de Triana', 'P. Morales', 1, 'Procesión triunfal de regreso.'),
    (41, 'y-amanecio-en-tu-albayzin-elias-santiago', 'Y amaneció en tu Albayzín', 'E. Santiago', 1, 'Procesión triunfal de regreso.'),
    (42, 'reina-de-vera-cruz-j-m-velazquez', 'Reina de Vera-Cruz', 'J. M. Velázquez', 1, 'Procesión triunfal de regreso.'),
    (43, 'espiritu-santo-pablo-ojeda', 'Espíritu Santo', 'P. Ojeda', 1, 'Procesión triunfal de regreso.'),
    (44, 'pasa-la-virgen-de-la-candelaria-lopez-gandara', 'Pasa la Virgen de la Candelaria', 'C. L. Gándara', 1, 'Procesión triunfal de regreso.'),
    (45, 'macarena-abel-moreno', 'Macarena', 'A. Moreno', 1, 'Procesión triunfal de regreso.'),
    (46, 'esperanza-que-guia-a-triana-jose-leon-alapont', 'Esperanza que guía a Triana', 'J. León Alapont', 1, 'Procesión triunfal de regreso.'),
    (47, 'madre-de-los-cruceros-de-gerena-manuela-carrero', 'Madre de los Cruceros de Gerena', 'M. Carrero', 1, 'Procesión triunfal de regreso. La lámina dice «Madre de los Cruceos de Gerena»; se reconcilia con el título canónico.'),
    (48, 'reina-de-la-madruga-j-moreno', 'Reina de la Madrugá', 'J. Moreno', 1, 'Procesión triunfal de regreso.')
  )
  insert into public.musical_repertoire_entries (
    repertoire_id, march_entity_id, display_title, source_credit,
    performance_count, display_order, notes
  )
  select v_repertoire_id, march.id, seed.display_title, seed.source_credit,
         seed.performance_count, seed.display_order, seed.notes
  from entry_seed seed
  join public.entities march on march.entity_type = 'march' and march.slug = seed.march_slug;

  if (select count(*) from public.musical_repertoire_entries where repertoire_id = v_repertoire_id) <> 48 then
    raise exception 'La cruceta de la Virgen de la Sangre debe contener 48 obras distintas';
  end if;

  if (select sum(performance_count) from public.musical_repertoire_entries where repertoire_id = v_repertoire_id) <> 59 then
    raise exception 'La cruceta de la Virgen de la Sangre debe sumar 59 menciones interpretadas';
  end if;

  if (
    select performance_count from public.musical_repertoire_entries entry
    join public.entities march on march.id = entry.march_entity_id
    where entry.repertoire_id = v_repertoire_id and march.slug = 'virgen-de-la-sangre-manuel-vizcaino'
  ) <> 3 then
    raise exception 'Virgen de la Sangre debe conservar sus tres apariciones';
  end if;

  if (
    select performance_count from public.musical_repertoire_entries entry
    join public.entities march on march.id = entry.march_entity_id
    where entry.repertoire_id = v_repertoire_id and march.slug = 'reina-de-gerena-coronada-manuel-jesus-castro'
  ) <> 3 then
    raise exception 'Reina de Gerena Coronada debe conservar sus tres apariciones';
  end if;
end
$cruceta$;

commit;
