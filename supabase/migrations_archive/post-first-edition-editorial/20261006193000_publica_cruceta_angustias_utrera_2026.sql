-- Hilo Cofrade · Jesús Nazareno de Utrera · 3 de octubre de 2026
-- Repertorio interpretado por la Banda de Música Virgen de las Angustias.
-- Solo DML editorial; reutiliza el grafo y el esquema vigentes.

begin;

do $preflight$
begin
  if (select count(*) from public.outings where slug = 'utrera-angustias-2026' and outing_date = date '2026-10-03' and status = 'published') <> 1 then
    raise exception 'La salida de las Angustias de Utrera no es unívoca';
  end if;
  if (select count(*) from public.entities where entity_type = 'brotherhood' and slug = 'hermandad-jesus-nazareno-utrera' and status = 'published') <> 1 then
    raise exception 'Jesús Nazareno de Utrera no es una Hermandad canónica unívoca';
  end if;
  if (select count(*) from public.entities where entity_type = 'image' and slug = 'nuestra-senora-angustias-utrera' and status = 'published') <> 1 then
    raise exception 'Nuestra Señora de las Angustias de Utrera no es unívoca';
  end if;
  if (select count(*) from public.entities where entity_type = 'step' and slug = 'paso-palio-angustias-utrera' and status = 'published') <> 1 then
    raise exception 'El paso de las Angustias de Utrera no es unívoco';
  end if;
  if (select count(*) from public.entities where entity_type = 'band' and slug = 'banda-musica-virgen-angustias-sanlucar-mayor' and status = 'published') <> 1 then
    raise exception 'La Banda de Música Virgen de las Angustias no es unívoca';
  end if;
  if (
    select count(*) from public.outing_music_assignments assignment
    join public.outing_music_positions position on position.id = assignment.music_position_id
    join public.outings outing on outing.id = position.outing_id
    join public.entities band on band.id = assignment.band_entity_id
    where outing.slug = 'utrera-angustias-2026'
      and position.position_label = 'Procesión triunfal de regreso'
      and band.slug = 'banda-musica-virgen-angustias-sanlucar-mayor'
      and assignment.status = 'published'
  ) <> 1 then
    raise exception 'El acompañamiento del regreso triunfal no es unívoco';
  end if;
end
$preflight$;

update public.outings set event_status = 'held', updated_at = now()
where slug = 'utrera-angustias-2026' and event_status <> 'held';

insert into public.sources (name, url, source_type, author_or_publisher, publication_date, accessed_at, notes)
select 'Repertorio interpretado · procesión triunfal de Nuestra Señora de las Angustias Coronada 2026', null, 'social_media',
       'Hermandad de Jesús Nazareno de Utrera', date '2026-10-03', date '2026-10-04',
       'Dos láminas de la cuenta oficial jesusnazarenoutrera. Documentan 41 interpretaciones consolidadas en 39 obras y sus puntos o tramos.'
where not exists (
  select 1 from public.sources where name = 'Repertorio interpretado · procesión triunfal de Nuestra Señora de las Angustias Coronada 2026'
    and author_or_publisher = 'Hermandad de Jesús Nazareno de Utrera'
);

with seed(name, url, source_type, publisher, publication_date, notes) as (values
  ('Dos nuevas marchas para la Coronación de las Angustias de Utrera', 'https://www.utreraweb.com/noticias-de-utrera/hermandades/2026/21460/la-virgen-de-las-angustias-de-utrera-estrenara-dos-nuevas-marchas-con-motivo-de-su-coronacion', 'news', 'UTRERAWeb', date '2026-09-17', 'Acredita autorías y dedicatorias de Regina Angustiarum Coronata y Madre del Señor.'),
  ('Madre del Señor · edición digital', 'https://www.qobuz.com/gb-en/album/madre-del-senor-banda-de-musica-virgen-de-las-angustias-de-sanlucar-la-mayor/hh1ty6hr4sios', 'music_platform', 'Qobuz', date '2026-10-03', 'Edición digital de la Banda; acredita a Juan Manuel Miranda Fernández como compositor.'),
  ('Regina Angustiarum Coronata · grabación oficial', 'https://www.youtube.com/watch?v=uBViSM3aGig', 'video', 'Banda de Música Virgen de las Angustias', date '2026-10-03', 'Grabación publicada por la formación.')
)
insert into public.sources (name, url, source_type, author_or_publisher, publication_date, accessed_at, notes)
select seed.name, seed.url, seed.source_type, seed.publisher, seed.publication_date, date '2026-10-04', seed.notes
from seed where not exists (select 1 from public.sources existing where existing.url = seed.url);

with seed(name, slug) as (values
  ('Rafael Romero Tortosa', 'rafael-romero-tortosa'),
  ('Juan Manuel Miranda Fernández', 'juan-manuel-miranda-fernandez'),
  ('Carlos Llano Picón', 'carlos-llano-picon')
)
insert into public.entities (entity_type, name, slug, summary, status)
select 'agent', name, slug, 'Compositor documentado en la cruceta de las Angustias de Utrera de 2026.', 'published'
from seed where not exists (select 1 from public.entities e where e.entity_type = 'agent' and e.slug = seed.slug);

with seed(slug) as (values ('rafael-romero-tortosa'), ('juan-manuel-miranda-fernandez'), ('carlos-llano-picon'))
insert into public.agents (entity_id, agent_kind, description)
select e.id, 'person', e.summary from seed join public.entities e on e.entity_type = 'agent' and e.slug = seed.slug
on conflict (entity_id) do nothing;

with seed(slug, title, composition_year) as (values
  ('regina-angustiarum-coronata-rafael-romero', 'Regina Angustiarum Coronata', 2026),
  ('madre-del-senor-juan-manuel-miranda', 'Madre del Señor', 2026),
  ('la-gitana-carlos-llano-picon', 'La Gitana', null::integer),
  ('reina-de-la-o-antonio-david-rodriguez', 'Reina de la O', 2013),
  ('triana-de-esperanza-claudio-gomez-calado', 'Triana de Esperanza', null::integer),
  ('reina-la-esperanza-felix-de-carboneras', 'Reina la Esperanza', 2022),
  ('esperanza-de-vida-manuel-marvizon', 'Esperanza de Vida', 2017)
)
insert into public.entities (entity_type, name, slug, summary, status)
select 'march', title, slug, 'Obra documentada en el repertorio de las Angustias de Utrera del 3 de octubre de 2026.', 'published'
from seed where not exists (select 1 from public.entities e where e.entity_type = 'march' and e.slug = seed.slug);

with seed(slug, composition_year) as (values
  ('regina-angustiarum-coronata-rafael-romero', 2026), ('madre-del-senor-juan-manuel-miranda', 2026),
  ('la-gitana-carlos-llano-picon', null::integer), ('reina-de-la-o-antonio-david-rodriguez', 2013),
  ('triana-de-esperanza-claudio-gomez-calado', null::integer), ('reina-la-esperanza-felix-de-carboneras', 2022),
  ('esperanza-de-vida-manuel-marvizon', 2017)
)
insert into public.marches (entity_id, composition_year, music_type, work_type, description, eligible_for_daily)
select e.id, seed.composition_year, 'Banda de Música', 'Marcha procesional',
       'Interpretada por la Banda de Música Virgen de las Angustias en Utrera el 3 de octubre de 2026.', false
from seed join public.entities e on e.entity_type = 'march' and e.slug = seed.slug
where not exists (select 1 from public.marches m where m.entity_id = e.id);

with seed(march_slug, author_slug) as (values
  ('regina-angustiarum-coronata-rafael-romero', 'rafael-romero-tortosa'),
  ('madre-del-senor-juan-manuel-miranda', 'juan-manuel-miranda-fernandez'),
  ('la-gitana-carlos-llano-picon', 'carlos-llano-picon'),
  ('reina-de-la-o-antonio-david-rodriguez', 'antonio-david-rodriguez-gomez'),
  ('triana-de-esperanza-claudio-gomez-calado', 'claudio-gomez-calado'),
  ('reina-la-esperanza-felix-de-carboneras', 'felix-de-carboneras'),
  ('esperanza-de-vida-manuel-marvizon', 'manuel-marvizon-carvallo')
)
insert into public.march_authors (march_entity_id, agent_entity_id, author_role, notes, status)
select march.id, author.id, 'composer', 'Autoría documentada en la fuente o en la edición musical.', 'published'
from seed join public.entities march on march.entity_type = 'march' and march.slug = seed.march_slug
join public.entities author on author.entity_type = 'agent' and author.slug = seed.author_slug
where not exists (select 1 from public.march_authors x where x.march_entity_id = march.id and x.agent_entity_id = author.id and x.author_role = 'composer' and x.status <> 'archived');

with seed(march_slug, dedicatee_slug, dedication_text) as (values
  ('regina-angustiarum-coronata-rafael-romero', 'nuestra-senora-angustias-utrera', 'Dedicada expresamente a Nuestra Señora de las Angustias de Utrera con motivo de su coronación canónica.'),
  ('madre-del-senor-juan-manuel-miranda', 'nuestra-senora-angustias-utrera', 'Dedicada expresamente a Nuestra Señora de las Angustias de Utrera con motivo de su coronación canónica.'),
  ('reina-de-la-o-antonio-david-rodriguez', 'maria-santisima-o-coronada-sevilla', 'Dedicada a María Santísima de la O Coronada.'),
  ('reina-la-esperanza-felix-de-carboneras', 'hermandad-esperanza-de-triana-sevilla', 'Dedicada a la Esperanza de Triana.')
)
insert into public.march_dedications (march_entity_id, dedicatee_entity_id, dedication_type, dedication_text, notes, status)
select march.id, dedicatee.id, 'dedicated_to', seed.dedication_text,
       'Solo se incorporan dedicatorias documentadas; no se infieren las restantes.', 'published'
from seed join public.entities march on march.entity_type = 'march' and march.slug = seed.march_slug
join public.entities dedicatee on dedicatee.slug = seed.dedicatee_slug
on conflict (march_entity_id, dedicatee_entity_id, dedication_type) do update set dedication_text = excluded.dedication_text, notes = excluded.notes, status = excluded.status;

update public.band_release_tracks track set march_entity_id = march.id
from public.band_releases release, public.entities march
where track.release_id = release.id and release.band_entity_id = (select id from public.entities where entity_type = 'band' and slug = 'banda-musica-virgen-angustias-sanlucar-mayor')
  and release.title = 'La Gitana' and track.title = 'La Gitana' and march.entity_type = 'march' and march.slug = 'la-gitana-carlos-llano-picon';

insert into public.band_releases (band_entity_id, title, release_type, release_year, release_date, release_date_text, description, external_url, status)
select band.id, 'Madre del Señor', 'single', 2026, date '2026-10-03', '03/10/2026', 'Edición digital oficial de la formación.',
       'https://www.qobuz.com/gb-en/album/madre-del-senor-banda-de-musica-virgen-de-las-angustias-de-sanlucar-la-mayor/hh1ty6hr4sios', 'published'
from public.entities band where band.entity_type = 'band' and band.slug = 'banda-musica-virgen-angustias-sanlucar-mayor'
on conflict (band_entity_id, title, release_year) do update set release_date = excluded.release_date, release_date_text = excluded.release_date_text,
  description = excluded.description, external_url = excluded.external_url, status = excluded.status, updated_at = now();

insert into public.band_release_tracks (release_id, sequence_no, title, march_entity_id, duration_text, notes)
select release.id, 1, 'Madre del Señor', march.id, '4:53', 'Qobuz acredita compositor e intérprete.'
from public.band_releases release join public.entities band on band.id = release.band_entity_id
join public.entities march on march.entity_type = 'march' and march.slug = 'madre-del-senor-juan-manuel-miranda'
where band.slug = 'banda-musica-virgen-angustias-sanlucar-mayor' and release.title = 'Madre del Señor' and release.release_year = 2026
on conflict (release_id, sequence_no) do update set title = excluded.title, march_entity_id = excluded.march_entity_id, duration_text = excluded.duration_text, notes = excluded.notes;

insert into public.march_recordings (march_entity_id, band_entity_id, recording_date, youtube_video_id, external_url, title, notes, is_featured, status)
select march.id, band.id, date '2026-10-03', 'uBViSM3aGig', 'https://www.youtube.com/watch?v=uBViSM3aGig',
       'Regina Angustiarum Coronata', 'Grabación oficial publicada por la Banda.', true, 'published'
from public.entities march cross join public.entities band
where march.entity_type = 'march' and march.slug = 'regina-angustiarum-coronata-rafael-romero'
  and band.entity_type = 'band' and band.slug = 'banda-musica-virgen-angustias-sanlucar-mayor'
  and not exists (select 1 from public.march_recordings r where r.youtube_video_id = 'uBViSM3aGig');

insert into public.band_release_sources (release_id, source_id, scope)
select release.id, source.id, 'Edición, fecha, intérprete, autoría y duración'
from public.band_releases release join public.entities band on band.id = release.band_entity_id
join public.sources source on source.url = 'https://www.qobuz.com/gb-en/album/madre-del-senor-banda-de-musica-virgen-de-las-angustias-de-sanlucar-la-mayor/hh1ty6hr4sios'
where band.slug = 'banda-musica-virgen-angustias-sanlucar-mayor' and release.title = 'Madre del Señor' and release.release_year = 2026
on conflict (release_id, source_id) do update set scope = excluded.scope;

with evidence(source_url, entity_slug, scope, notes) as (values
  ('https://www.utreraweb.com/noticias-de-utrera/hermandades/2026/21460/la-virgen-de-las-angustias-de-utrera-estrenara-dos-nuevas-marchas-con-motivo-de-su-coronacion', 'regina-angustiarum-coronata-rafael-romero', 'Autoría y dedicatoria', 'Acredita autoría y dedicatoria.'),
  ('https://www.utreraweb.com/noticias-de-utrera/hermandades/2026/21460/la-virgen-de-las-angustias-de-utrera-estrenara-dos-nuevas-marchas-con-motivo-de-su-coronacion', 'madre-del-senor-juan-manuel-miranda', 'Autoría y dedicatoria', 'Acredita autoría y dedicatoria.'),
  ('https://www.qobuz.com/gb-en/album/madre-del-senor-banda-de-musica-virgen-de-las-angustias-de-sanlucar-la-mayor/hh1ty6hr4sios', 'madre-del-senor-juan-manuel-miranda', 'Edición y escucha', 'Edición digital oficial.'),
  ('https://www.youtube.com/watch?v=uBViSM3aGig', 'regina-angustiarum-coronata-rafael-romero', 'Grabación y escucha', 'Grabación oficial de la formación.')
)
insert into public.source_links (source_id, entity_id, scope, notes)
select source.id, entity.id, evidence.scope, evidence.notes
from evidence join public.sources source on source.url = evidence.source_url
join public.entities entity on entity.slug = evidence.entity_slug
where not exists (select 1 from public.source_links x where x.source_id = source.id and x.entity_id = entity.id);

with refs as (
  select (select id from public.sources where name = 'Repertorio interpretado · procesión triunfal de Nuestra Señora de las Angustias Coronada 2026' order by created_at limit 1) source_id,
         (select id from public.outings where slug = 'utrera-angustias-2026') outing_id,
         (select assignment.id from public.outing_music_assignments assignment
          join public.outing_music_positions position on position.id = assignment.music_position_id
          join public.outings outing on outing.id = position.outing_id
          where outing.slug = 'utrera-angustias-2026' and position.position_label = 'Procesión triunfal de regreso'
            and assignment.band_entity_id = (select id from public.entities where entity_type = 'band' and slug = 'banda-musica-virgen-angustias-sanlucar-mayor')) assignment_id
)
insert into public.source_links (source_id, outing_id, scope, notes)
select source_id, outing_id, 'Repertorio interpretado', 'Fuente directa de la cruceta.' from refs
where not exists (select 1 from public.source_links x where x.source_id = refs.source_id and x.outing_id = refs.outing_id);

with refs as (
  select (select id from public.sources where name = 'Repertorio interpretado · procesión triunfal de Nuestra Señora de las Angustias Coronada 2026' order by created_at limit 1) source_id,
         (select assignment.id from public.outing_music_assignments assignment
          join public.outing_music_positions position on position.id = assignment.music_position_id
          join public.outings outing on outing.id = position.outing_id
          where outing.slug = 'utrera-angustias-2026' and position.position_label = 'Procesión triunfal de regreso'
            and assignment.band_entity_id = (select id from public.entities where entity_type = 'band' and slug = 'banda-musica-virgen-angustias-sanlucar-mayor')) assignment_id
)
insert into public.source_links (source_id, outing_music_assignment_id, scope, notes)
select source_id, assignment_id, 'Acompañamiento musical', 'Vincula la cruceta con el regreso acompañado por la Banda.' from refs
where not exists (select 1 from public.source_links x where x.source_id = refs.source_id and x.outing_music_assignment_id = refs.assignment_id);

with refs as (
  select (select id from public.outings where slug = 'utrera-angustias-2026') outing_id,
         (select id from public.entities where entity_type = 'band' and slug = 'banda-musica-virgen-angustias-sanlucar-mayor') band_id,
         (select id from public.entities where entity_type = 'step' and slug = 'paso-palio-angustias-utrera') step_id,
         (select id from public.sources where name = 'Repertorio interpretado · procesión triunfal de Nuestra Señora de las Angustias Coronada 2026' order by created_at limit 1) source_id
)
insert into public.musical_repertoires (slug, outing_id, band_entity_id, step_entity_id, source_id, title, repertoire_kind, notes, status)
select 'jesus-nazareno-utrera-angustias-banda-angustias-2026', outing_id, band_id, step_id, source_id,
       'Jesús Nazareno de Utrera · 3 de octubre de 2026 · Banda de Música Virgen de las Angustias', 'performed',
       'Las láminas documentan 41 interpretaciones consolidadas en 39 obras. Regina Angustiarum Coronata y Madre del Señor figuran como ×2, sin deducir consecutividad. Los puntos se conservan solo cuando los publica la fuente.', 'published'
from refs
on conflict (slug) do update set outing_id = excluded.outing_id, band_entity_id = excluded.band_entity_id, step_entity_id = excluded.step_entity_id,
 source_id = excluded.source_id, title = excluded.title, repertoire_kind = excluded.repertoire_kind, notes = excluded.notes, status = excluded.status, updated_at = now();

delete from public.musical_repertoire_entries where repertoire_id = (select id from public.musical_repertoires where slug = 'jesus-nazareno-utrera-angustias-banda-angustias-2026');

with seed(display_order, march_slug, display_title, source_credit, performance_count, notes) as (values
  (1, 'regina-angustiarum-coronata-rafael-romero', 'Regina Angustiarum Coronata', 'Rafael Romero Tortosa', 2, 'Plaza del Altozano y San Juan Bosco. ×2 solo expresa dos interpretaciones documentadas.'),
  (2, 'coronacion-de-la-macarena-pedro-brana', 'Coronación de la Macarena', 'Pedro Braña Martínez', 1, 'Plaza del Altozano.'),
  (3, 'aniversario-macareno-jose-velazquez', 'Aniversario Macareno', 'José Velázquez', 1, 'Plaza del Altozano.'),
  (4, 'la-estrella-sublime-manuel-lopez-farfan', 'Estrella Sublime', 'Manuel López Farfán', 1, 'Clemente de la Cuadra.'),
  (5, 'marcha-encarnacion-coronada-bm-1994', 'Encarnación Coronada', 'Abel Moreno Gómez', 1, 'Clemente de la Cuadra.'),
  (6, 'marcha-el-dia-del-senor', 'El Día del Señor', 'Alfonso López Cortés', 1, 'Clemente de la Cuadra.'),
  (7, 'y-en-triana-la-o-espinosa-monteros', 'Y en Triana, la O', 'J. J. Espinosa de los Monteros Pérez', 1, 'Clemente de la Cuadra.'),
  (8, 'madre-del-senor-juan-manuel-miranda', 'Madre del Señor', 'Juan Manuel Miranda Fernández', 2, 'Clemente de la Cuadra–Álvarez Quintero y San Juan Bosco. ×2 solo expresa dos interpretaciones documentadas.'),
  (9, 'madruga-macarena-pablo-ojeda', 'Madrugá Macarena', 'Pablo Ojeda Jiménez', 1, 'Álvarez Quintero.'),
  (10, 'aurora-reina-manana-pablo-ojeda', 'Aurora, Reina de la Mañana', 'Pablo Ojeda Jiménez', 1, 'Álvarez Quintero–Sevilla.'),
  (11, 'siempre-la-esperanza-jesus-joaquin-espinosa', 'Siempre la Esperanza', 'J. J. Espinosa de los Monteros Pérez', 1, 'Sevilla.'),
  (12, 'coronacion-puntas-marvizon', 'Coronación', 'Manuel Marvizón Carvallo y Juan José Puntas Fernández', 1, 'Sevilla–Plaza de la Constitución.'),
  (13, 'pasa-la-virgen-macarena-pedro-gamez-laserna', 'Pasa la Virgen Macarena', 'Pedro Gámez Laserna', 1, 'Plaza de la Constitución–Ruiz Gijón.'),
  (14, 'madre-de-los-gitanos-coronada-abel-moreno', 'Madre de los Gitanos Coronada', 'Abel Moreno Gómez', 1, 'Ruiz Gijón.'),
  (15, 'la-gitana-carlos-llano-picon', 'La Gitana', 'Carlos Llano Picón', 1, 'Parroquia de Santiago.'),
  (16, 'tu-eres-el-orgullo-de-nuestro-pueblo-pablo-ojeda', 'Tú eres el Orgullo de Nuestro Pueblo', 'Pablo Ojeda Jiménez', 1, 'Ponce de León.'),
  (17, 'se-siempre-nuestra-esperanza-ruben-jordan', 'Sé Siempre Nuestra Esperanza', 'Rubén Jordán Flores', 1, 'Ponce de León–Catalina de Perea.'),
  (18, 'esperanza-macarena-pedro-morales', 'Esperanza Macarena', 'Pedro Morales Muñoz', 1, 'Catalina de Perea.'),
  (19, 'pasan-los-campanilleros-manuel-lopez-farfan', 'Pasan los Campanilleros', 'Manuel López Farfán', 1, 'Plaza Enrique de la Cuadra.'),
  (20, 'rosario-de-montesion-juan-velazquez', 'Rosario de Montesión', 'Juan Velázquez Sánchez', 1, 'San Fernando.'),
  (21, 'reina-de-la-o-antonio-david-rodriguez', 'Reina de la O', 'Antonio David Rodríguez Gómez', 1, 'San Fernando–Santa Ángela de la Cruz.'),
  (22, 'madre-hiniesta-manuel-marvizon', 'Madre Hiniesta', 'Manuel Marvizón Carvallo', 1, 'San Fernando–Santa Ángela de la Cruz.'),
  (23, 'rocio-manuel-ruiz-vidriet', 'Rocío', 'Manuel Ruiz Vidriet y Manuel Pérez Tejera', 1, 'Santa Ángela de la Cruz.'),
  (24, 'a-ti-manue-juan-jose-puntas', 'A ti, Manué', 'Juan José Puntas Fernández', 1, 'Santa Ángela de la Cruz–Sor Marciala de la Cruz.'),
  (25, 'triana-de-esperanza-claudio-gomez-calado', 'Triana de Esperanza', 'Claudio Gómez Calado', 1, 'Sor Marciala de la Cruz–Antonio Maura.'),
  (26, 'reina-la-esperanza-felix-de-carboneras', 'Reina de Esperanza', 'Félix de Carboneras', 1, 'Porche de Santa María. Título literal de la lámina vinculado a la obra canónica Reina la Esperanza.'),
  (27, 'triana-felix-de-carboneras', 'Triana', 'Félix de Carboneras', 1, 'Mota de Santa María–Menéndez Pelayo.'),
  (28, 'se-arrodilla-triana-david-hurtado', 'Se arrodilla Triana', 'David Hurtado Torres', 1, 'Menéndez Pelayo.'),
  (29, 'la-gloria-de-un-pueblo-felix-carboneras', 'La Gloria de un Pueblo', 'Félix de Carboneras', 1, 'Menéndez Pelayo–Fray Cipriano de Utrera.'),
  (30, 'espiritu-santo-pablo-ojeda', 'Espíritu Santo', 'Pablo Ojeda Jiménez', 1, 'Fray Cipriano de Utrera–Alcalde Antonio Sousa.'),
  (31, 'como-tu-ninguna-david-hurtado', 'Como Tú, Ninguna', 'David Hurtado Torres', 1, 'Alcalde Antonio Sousa–Álvarez Hazañas.'),
  (32, 'senorita-de-triana-pedro-morales', 'Señorita de Triana', 'Pedro Morales Muñoz', 1, 'Plaza del Altozano.'),
  (33, 'esperanza-de-vida-manuel-marvizon', 'Esperanza de Vida', 'Manuel Marvizón Carvallo', 1, 'Plaza del Altozano.'),
  (34, 'esperanza-de-triana-coronada-jose-albero', 'Esperanza de Triana Coronada', 'José Albero Francés', 1, 'Virgen de Consolación.'),
  (35, 'macarena-abel-moreno', 'Macarena', 'Abel Moreno Gómez', 1, 'Virgen de Consolación. Se reutiliza la obra de Abel Moreno, no sus homónimas.'),
  (36, 'al-cielo-la-reina-de-triana-gomez-jaldon-espinosa', 'Al Cielo la Reina de Triana', 'José Luis Gómez Jaldón', 1, 'Virgen de Consolación; la ficha conserva la autoría canónica completa.'),
  (37, 'creo-en-la-esperanza-carlos-guillen', 'Creo en la Esperanza', 'Carlos Guillén González', 1, 'Virgen de Consolación–San Juan Bosco.'),
  (38, 'danos-la-paz-jesus-joaquin-espinosa', 'Danos la Paz', 'J. J. Espinosa de los Monteros Pérez', 1, 'San Juan Bosco.'),
  (39, 'himno-nacional-espana', 'Himno Nacional', null, 1, 'Recogida; la fuente no atribuye autoría.')
)
insert into public.musical_repertoire_entries (repertoire_id, march_entity_id, display_title, source_credit, performance_count, display_order, notes)
select repertoire.id, march.id, seed.display_title, seed.source_credit, seed.performance_count, seed.display_order, seed.notes
from seed join public.musical_repertoires repertoire on repertoire.slug = 'jesus-nazareno-utrera-angustias-banda-angustias-2026'
join public.entities march on march.entity_type = 'march' and march.slug = seed.march_slug;

do $assertions$
declare v_id uuid;
begin
  select id into strict v_id from public.musical_repertoires where slug = 'jesus-nazareno-utrera-angustias-banda-angustias-2026';
  if (select count(*) from public.musical_repertoire_entries where repertoire_id = v_id) <> 39 then raise exception 'La cruceta debe contener 39 obras'; end if;
  if (select sum(performance_count) from public.musical_repertoire_entries where repertoire_id = v_id) <> 41 then raise exception 'La cruceta debe sumar 41 interpretaciones'; end if;
end
$assertions$;

commit;
