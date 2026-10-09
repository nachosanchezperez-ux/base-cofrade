-- Hilo Cofrade · dos crucetas de Sevilla · 4 de octubre de 2026
-- Los Panaderos · regreso de Regla Coronada · Banda de Música Santa Ana.
-- Santa Lucía · procesión de gloria · Banda de Música Liceo de Sevilla.
-- Solo DML editorial; una fila por obra y multiplicidad literal de la fuente.

begin;

do $preflight$
begin
  if (select count(*) from public.outings where slug = 'sevilla-regla-coronada-2026' and outing_date = date '2026-10-04' and status = 'published') <> 1 then
    raise exception 'La salida extraordinaria de Regla Coronada no es unívoca';
  end if;
  if (select count(*) from public.outings where slug = 'santa-lucia-sevilla-procesion-2026-10-04' and outing_date = date '2026-10-04' and status = 'published') <> 1 then
    raise exception 'La procesión de Santa Lucía no es unívoca';
  end if;
  if (select count(*) from public.entities where entity_type = 'brotherhood' and slug = 'hermandad-de-los-panaderos' and status = 'published') <> 1 then
    raise exception 'Los Panaderos no es una Hermandad canónica unívoca';
  end if;
  if (select count(*) from public.entities where entity_type = 'brotherhood' and slug = 'santa-lucia-sevilla' and status = 'published') <> 1 then
    raise exception 'Santa Lucía no es una Hermandad canónica unívoca';
  end if;
  if (select count(*) from public.entities where entity_type = 'step' and slug = 'paso-palio-regla-coronada-panaderos' and status = 'published') <> 1 then
    raise exception 'El paso de Regla Coronada no es unívoco';
  end if;
  if (select count(*) from public.entities where entity_type = 'step' and slug = 'paso-santa-lucia-sevilla' and status = 'published') <> 1 then
    raise exception 'El paso de Santa Lucía no es unívoco';
  end if;
  if (select count(*) from public.entities where entity_type = 'band' and slug = 'banda-musica-santa-ana-dos-hermanas' and status = 'published') <> 1 then
    raise exception 'Santa Ana no es una Banda canónica unívoca';
  end if;
  if (select count(*) from public.entities where entity_type = 'band' and slug = 'banda-musica-liceo-sevilla' and status = 'published') <> 1 then
    raise exception 'Liceo de Sevilla no es una Banda canónica unívoca';
  end if;
  if (
    select count(*) from public.outing_music_assignments assignment
    join public.outing_music_positions position on position.id = assignment.music_position_id
    join public.outings outing on outing.id = position.outing_id
    join public.entities band on band.id = assignment.band_entity_id
    where outing.slug = 'sevilla-regla-coronada-2026'
      and band.slug = 'banda-musica-santa-ana-dos-hermanas'
      and assignment.segment_start_label = 'Convento de San Leandro'
      and assignment.segment_end_label = 'Capilla de San Andrés'
      and assignment.status = 'published'
  ) <> 1 then
    raise exception 'El acompañamiento de Santa Ana en el regreso no es unívoco';
  end if;
  if (
    select count(*) from public.outing_music_assignments assignment
    join public.outing_music_positions position on position.id = assignment.music_position_id
    join public.outings outing on outing.id = position.outing_id
    join public.entities band on band.id = assignment.band_entity_id
    where outing.slug = 'santa-lucia-sevilla-procesion-2026-10-04'
      and band.slug = 'banda-musica-liceo-sevilla'
      and assignment.status = 'published'
  ) <> 1 then
    raise exception 'El acompañamiento del Liceo de Sevilla no es unívoco';
  end if;
end
$preflight$;

update public.outings set event_status = 'held', updated_at = now()
where slug in ('sevilla-regla-coronada-2026', 'santa-lucia-sevilla-procesion-2026-10-04')
  and event_status <> 'held';

with seed(name, publisher, notes) as (values
  ('Repertorio interpretado · Regla Coronada de Los Panaderos 2026', 'Banda de Música Santa Ana de Dos Hermanas', 'Lámina oficial #SuenaSantaAna. Documenta el repertorio del traslado extraordinario de regreso: 27 interpretaciones consolidadas en 25 obras.'),
  ('Repertorio interpretado · Santa Lucía de Sevilla 2026', 'Hermandad de Santa Lucía y Banda de Música Liceo de Sevilla', 'Dos láminas publicadas en colaboración por las cuentas oficiales. Documentan 33 obras y 33 interpretaciones.')
)
insert into public.sources (name, url, source_type, author_or_publisher, publication_date, accessed_at, notes)
select name, null, 'social_media', publisher, null, date '2026-10-07', notes
from seed
where not exists (select 1 from public.sources existing where existing.name = seed.name and existing.author_or_publisher = seed.publisher);

with seed(name, slug) as (values
  ('Rafael Ruiz Amé', 'rafael-ruiz-ame'),
  ('Manuel Font de Anta', 'manuel-font-de-anta'),
  ('José Núñez Mayoral', 'jose-nunez-mayoral'),
  ('Francisco Jesús Lozano', 'francisco-jesus-lozano'),
  ('Antonio Álvarez Alonso', 'antonio-alvarez-alonso'),
  ('David Segado Ramírez', 'david-segado-ramirez')
)
insert into public.entities (entity_type, name, slug, summary, status)
select 'agent', name, slug, 'Compositor documentado en las crucetas sevillanas del 4 de octubre de 2026.', 'published'
from seed where not exists (select 1 from public.entities e where e.entity_type = 'agent' and e.slug = seed.slug);

with seed(slug) as (values
  ('rafael-ruiz-ame'), ('manuel-font-de-anta'), ('jose-nunez-mayoral'),
  ('francisco-jesus-lozano'), ('antonio-alvarez-alonso'), ('david-segado-ramirez')
)
insert into public.agents (entity_id, agent_kind, description)
select e.id, 'person', e.summary from seed join public.entities e on e.entity_type = 'agent' and e.slug = seed.slug
on conflict (entity_id) do nothing;

with seed(slug, title) as (values
  ('virgen-de-regla-rafael-ruiz-ame', 'Virgen de Regla'),
  ('miradlo-en-la-cruz-david-hurtado', '¡Miradlo en la Cruz!'),
  ('amarguras-manuel-font-de-anta', 'Amarguras'),
  ('sevilla-cofradiera-pedro-gamez-laserna', 'Sevilla Cofradiera'),
  ('madre-de-regla-coronada-jose-nunez-mayoral', 'Madre de Regla Coronada'),
  ('solea-dame-la-mano-manuel-font-de-anta', 'Soleá, dame la mano'),
  ('regla-de-las-almas-francisco-jesus-lozano-jose-colome', 'Regla de las Almas'),
  ('santa-maria-de-regla-jose-ramon-lozano', 'Santa María de Regla'),
  ('churumbelerias-emilio-cebrian', '¡Churumbelerías!'),
  ('dios-te-salve-rocio-manuel-jesus-castro', 'Dios te Salve, Rocío'),
  ('el-6002-capitan-leon-manuel-lopez-farfan', 'El 6002. Capitán León'),
  ('himno-a-santa-lucia-javier-calvo-gavino', 'Himno a Santa Lucía'),
  ('la-madre-de-dios-daniel-albarran', 'La Madre de Dios'),
  ('nuestra-senora-de-las-lagrimas-pedro-morales', 'Nuestra Señora de las Lágrimas'),
  ('suspiros-de-espana-antonio-alvarez-alonso', 'Suspiros de España'),
  ('triana-tu-esperanza-jose-de-la-vega', 'Triana, tu Esperanza'),
  ('virgen-de-los-estudiantes-abel-moreno', 'Virgen de los Estudiantes')
)
insert into public.entities (entity_type, name, slug, summary, status)
select 'march', title, slug, 'Obra documentada en una cruceta musical sevillana del 4 de octubre de 2026.', 'published'
from seed where not exists (select 1 from public.entities e where e.entity_type = 'march' and e.slug = seed.slug);

with seed(slug) as (values
  ('virgen-de-regla-rafael-ruiz-ame'), ('miradlo-en-la-cruz-david-hurtado'),
  ('amarguras-manuel-font-de-anta'), ('sevilla-cofradiera-pedro-gamez-laserna'),
  ('madre-de-regla-coronada-jose-nunez-mayoral'), ('solea-dame-la-mano-manuel-font-de-anta'),
  ('regla-de-las-almas-francisco-jesus-lozano-jose-colome'), ('santa-maria-de-regla-jose-ramon-lozano'),
  ('churumbelerias-emilio-cebrian'), ('dios-te-salve-rocio-manuel-jesus-castro'),
  ('el-6002-capitan-leon-manuel-lopez-farfan'), ('himno-a-santa-lucia-javier-calvo-gavino'),
  ('la-madre-de-dios-daniel-albarran'), ('nuestra-senora-de-las-lagrimas-pedro-morales'),
  ('suspiros-de-espana-antonio-alvarez-alonso'), ('triana-tu-esperanza-jose-de-la-vega'),
  ('virgen-de-los-estudiantes-abel-moreno')
)
insert into public.marches (entity_id, composition_year, music_type, work_type, description, eligible_for_daily)
select e.id, null, 'Banda de Música', 'Marcha procesional',
       'Interpretada y documentada en una cruceta musical sevillana del 4 de octubre de 2026.', false
from seed join public.entities e on e.entity_type = 'march' and e.slug = seed.slug
where not exists (select 1 from public.marches m where m.entity_id = e.id);

with seed(march_slug, author_slug) as (values
  ('virgen-de-regla-rafael-ruiz-ame', 'rafael-ruiz-ame'),
  ('miradlo-en-la-cruz-david-hurtado', 'david-hurtado-torres'),
  ('amarguras-manuel-font-de-anta', 'manuel-font-de-anta'),
  ('sevilla-cofradiera-pedro-gamez-laserna', 'pedro-gamez-laserna'),
  ('madre-de-regla-coronada-jose-nunez-mayoral', 'jose-nunez-mayoral'),
  ('solea-dame-la-mano-manuel-font-de-anta', 'manuel-font-de-anta'),
  ('regla-de-las-almas-francisco-jesus-lozano-jose-colome', 'francisco-jesus-lozano'),
  ('regla-de-las-almas-francisco-jesus-lozano-jose-colome', 'agente-jose-colome'),
  ('santa-maria-de-regla-jose-ramon-lozano', 'jose-ramon-lozano-garrido'),
  ('churumbelerias-emilio-cebrian', 'emilio-cebrian-ruiz'),
  ('dios-te-salve-rocio-manuel-jesus-castro', 'manuel-jesus-castro-gomila'),
  ('el-6002-capitan-leon-manuel-lopez-farfan', 'manuel-lopez-farfan'),
  ('himno-a-santa-lucia-javier-calvo-gavino', 'javier-calvo-gavino'),
  ('la-madre-de-dios-daniel-albarran', 'daniel-albarran-acosta'),
  ('nuestra-senora-de-las-lagrimas-pedro-morales', 'pedro-morales-munoz'),
  ('suspiros-de-espana-antonio-alvarez-alonso', 'antonio-alvarez-alonso'),
  ('triana-tu-esperanza-jose-de-la-vega', 'jose-de-la-vega-sanchez'),
  ('virgen-de-los-estudiantes-abel-moreno', 'abel-moreno-gomez'),
  ('y-te-corono-sevilla-d-segado', 'david-segado-ramirez')
)
insert into public.march_authors (march_entity_id, agent_entity_id, author_role, notes, status)
select march.id, author.id, 'composer', 'Autoría literal publicada en la lámina de la cruceta.', 'published'
from seed join public.entities march on march.entity_type = 'march' and march.slug = seed.march_slug
join public.entities author on author.entity_type = 'agent' and author.slug = seed.author_slug
where not exists (
  select 1 from public.march_authors x
  where x.march_entity_id = march.id and x.agent_entity_id = author.id and x.author_role = 'composer' and x.status <> 'archived'
);

with refs as (
  select (select id from public.sources where name = 'Repertorio interpretado · Regla Coronada de Los Panaderos 2026' order by created_at limit 1) source_id,
         (select id from public.outings where slug = 'sevilla-regla-coronada-2026') outing_id,
         (select assignment.id from public.outing_music_assignments assignment
          join public.outing_music_positions position on position.id = assignment.music_position_id
          join public.outings outing on outing.id = position.outing_id
          where outing.slug = 'sevilla-regla-coronada-2026'
            and assignment.band_entity_id = (select id from public.entities where entity_type = 'band' and slug = 'banda-musica-santa-ana-dos-hermanas')
            and assignment.segment_start_label = 'Convento de San Leandro'
            and assignment.segment_end_label = 'Capilla de San Andrés') assignment_id
  union all
  select (select id from public.sources where name = 'Repertorio interpretado · Santa Lucía de Sevilla 2026' order by created_at limit 1),
         (select id from public.outings where slug = 'santa-lucia-sevilla-procesion-2026-10-04'),
         (select assignment.id from public.outing_music_assignments assignment
          join public.outing_music_positions position on position.id = assignment.music_position_id
          join public.outings outing on outing.id = position.outing_id
          where outing.slug = 'santa-lucia-sevilla-procesion-2026-10-04'
            and assignment.band_entity_id = (select id from public.entities where entity_type = 'band' and slug = 'banda-musica-liceo-sevilla'))
)
insert into public.source_links (source_id, outing_id, scope, notes)
select source_id, outing_id, 'Repertorio interpretado', 'Vincula la cruceta con la salida documentada.'
from refs
where not exists (
  select 1 from public.source_links x
  where x.source_id = refs.source_id and x.outing_id = refs.outing_id
);

with refs as (
  select (select id from public.sources where name = 'Repertorio interpretado · Regla Coronada de Los Panaderos 2026' order by created_at limit 1) source_id,
         (select assignment.id from public.outing_music_assignments assignment
          join public.outing_music_positions position on position.id = assignment.music_position_id
          join public.outings outing on outing.id = position.outing_id
          where outing.slug = 'sevilla-regla-coronada-2026'
            and assignment.band_entity_id = (select id from public.entities where entity_type = 'band' and slug = 'banda-musica-santa-ana-dos-hermanas')
            and assignment.segment_start_label = 'Convento de San Leandro'
            and assignment.segment_end_label = 'Capilla de San Andrés') assignment_id
  union all
  select (select id from public.sources where name = 'Repertorio interpretado · Santa Lucía de Sevilla 2026' order by created_at limit 1),
         (select assignment.id from public.outing_music_assignments assignment
          join public.outing_music_positions position on position.id = assignment.music_position_id
          join public.outings outing on outing.id = position.outing_id
          where outing.slug = 'santa-lucia-sevilla-procesion-2026-10-04'
            and assignment.band_entity_id = (select id from public.entities where entity_type = 'band' and slug = 'banda-musica-liceo-sevilla'))
)
insert into public.source_links (source_id, outing_music_assignment_id, scope, notes)
select source_id, assignment_id, 'Acompañamiento musical', 'Vincula la cruceta con la Banda y el tramo documentados.'
from refs
where not exists (
  select 1 from public.source_links x
  where x.source_id = refs.source_id and x.outing_music_assignment_id = refs.assignment_id
);

with seed(slug, outing_slug, band_slug, step_slug, source_name, title, notes) as (values
  ('los-panaderos-regla-coronada-santa-ana-2026', 'sevilla-regla-coronada-2026', 'banda-musica-santa-ana-dos-hermanas', 'paso-palio-regla-coronada-panaderos', 'Repertorio interpretado · Regla Coronada de Los Panaderos 2026', 'Los Panaderos · 4 de octubre de 2026 · Santa Ana de Dos Hermanas', 'Repertorio del traslado extraordinario de regreso desde el Convento de San Leandro: 25 obras y 27 interpretaciones. Himno Nacional y Madre de Regla Coronada figuran dos veces en la lámina; ×2 no presupone consecutividad.'),
  ('santa-lucia-liceo-sevilla-2026', 'santa-lucia-sevilla-procesion-2026-10-04', 'banda-musica-liceo-sevilla', 'paso-santa-lucia-sevilla', 'Repertorio interpretado · Santa Lucía de Sevilla 2026', 'Santa Lucía · 4 de octubre de 2026 · Liceo de Sevilla', 'Repertorio de la procesión de gloria: 33 obras y 33 interpretaciones. No se añade orden procesional ni ubicación no publicados.')
)
insert into public.musical_repertoires (slug, outing_id, band_entity_id, step_entity_id, source_id, title, repertoire_kind, notes, status)
select seed.slug, outing.id, band.id, step.id, source.id, seed.title, 'performed', seed.notes, 'published'
from seed
join public.outings outing on outing.slug = seed.outing_slug
join public.entities band on band.entity_type = 'band' and band.slug = seed.band_slug
join public.entities step on step.entity_type = 'step' and step.slug = seed.step_slug
join public.sources source on source.name = seed.source_name
on conflict (slug) do update set outing_id = excluded.outing_id, band_entity_id = excluded.band_entity_id,
  step_entity_id = excluded.step_entity_id, source_id = excluded.source_id, title = excluded.title,
  repertoire_kind = excluded.repertoire_kind, notes = excluded.notes, status = excluded.status, updated_at = now();

delete from public.musical_repertoire_entries
where repertoire_id in (select id from public.musical_repertoires where slug in ('los-panaderos-regla-coronada-santa-ana-2026', 'santa-lucia-liceo-sevilla-2026'));

with seed(display_order, march_slug, display_title, source_credit, performance_count, notes) as (values
  (1, 'himno-nacional-espana', 'Himno Nacional', 'Bartolomé Pérez Casas / Francisco Grau', 2, 'Aparece dos veces en la lámina; ×2 solo expresa dos interpretaciones documentadas.'),
  (2, 'virgen-de-regla-rafael-ruiz-ame', 'Virgen de Regla', 'Rafael Ruiz Amé', 1, null),
  (3, 'coronacion-puntas-marvizon', 'Coronación', 'Manuel Marvizón y Juan José Puntas', 1, null),
  (4, 'macarena-abel-moreno', 'Macarena', 'Abel Moreno Gómez', 1, 'Se vincula a la obra de Abel Moreno, no a sus homónimas.'),
  (5, 'virgen-de-montserrat-pedro-morales', 'Virgen de Montserrat', 'Pedro Morales Muñoz', 1, null),
  (6, 'miradlo-en-la-cruz-david-hurtado', '¡Miradlo en la Cruz!', 'David Hurtado Torres', 1, null),
  (7, 'virgen-de-regla-coronada-jose-ramon-lozano', 'Virgen de Regla Coronada', 'José Ramón Lozano Garrido', 1, null),
  (8, 'amarguras-manuel-font-de-anta', 'Amarguras', 'Manuel Font de Anta', 1, null),
  (9, 'coronacion-de-la-macarena-pedro-brana', 'Coronación de la Macarena', 'Pedro Braña Martínez', 1, null),
  (10, 'cristo-en-la-alcazaba-fulgencio-moron', 'Cristo en la Alcazaba', 'Fulgencio Morón Ródenas', 1, null),
  (11, 'sevilla-cofradiera-pedro-gamez-laserna', 'Sevilla Cofradiera', 'Pedro Gámez Laserna', 1, null),
  (12, 'aurora-reina-manana-pablo-ojeda', 'Aurora, Reina de la Mañana', 'Pablo Ojeda Jiménez', 1, null),
  (13, 'madre-de-regla-coronada-jose-nunez-mayoral', 'Madre de Regla Coronada', 'José Núñez Mayoral', 2, 'Aparece dos veces en la lámina; ×2 solo expresa dos interpretaciones documentadas.'),
  (14, 'virgen-de-la-paz-pedro-morales', 'Virgen de la Paz', 'Pedro Morales Muñoz', 1, null),
  (15, 'procesion-de-semana-santa-en-sevilla-pascual-marquina', 'Procesión de Semana Santa en Sevilla', 'Pascual Marquina Narro', 1, null),
  (16, 'la-virgen-de-sevilla-victor-arturo-lopez', 'La Virgen de Sevilla', 'Víctor Arturo López López', 1, null),
  (17, 'pasa-la-virgen-macarena-pedro-gamez-laserna', 'Pasa la Virgen Macarena', 'Pedro Gámez Laserna', 1, null),
  (18, 'marcha-encarnacion-coronada-bm-1994', 'Encarnación Coronada', 'Abel Moreno Gómez', 1, null),
  (19, 'madruga-macarena-pablo-ojeda', 'Madrugá Macarena', 'Pablo Ojeda Jiménez', 1, null),
  (20, 'senorita-de-triana-pedro-morales', 'Señorita de Triana', 'Pedro Morales Muñoz', 1, null),
  (21, 'esperanza-trianera-angel-alcaide', 'Esperanza Trianera', 'Ángel Alcaide', 1, null),
  (22, 'solea-dame-la-mano-manuel-font-de-anta', 'Soleá, dame la mano', 'Manuel Font de Anta', 1, null),
  (23, 'madre-hiniesta-manuel-marvizon', 'Madre Hiniesta', 'Manuel Marvizón Carvallo', 1, null),
  (24, 'regla-de-las-almas-francisco-jesus-lozano-jose-colome', 'Regla de las Almas', 'Francisco Jesús Lozano y José Colomé', 1, null),
  (25, 'santa-maria-de-regla-jose-ramon-lozano', 'Santa María de Regla', 'José Ramón Lozano Garrido', 1, null)
)
insert into public.musical_repertoire_entries (repertoire_id, march_entity_id, display_title, source_credit, performance_count, display_order, notes)
select repertoire.id, march.id, seed.display_title, seed.source_credit, seed.performance_count, seed.display_order, seed.notes
from seed join public.musical_repertoires repertoire on repertoire.slug = 'los-panaderos-regla-coronada-santa-ana-2026'
join public.entities march on march.entity_type = 'march' and march.slug = seed.march_slug;

with seed(display_order, march_slug, display_title, source_credit) as (values
  (1, 'al-cielo-la-reina-de-triana-gomez-jaldon-espinosa', 'Al Cielo la Reina de Triana', 'José Luis Gómez Jaldón'),
  (2, 'aniversario-macareno-jose-velazquez', 'Aniversario Macareno', 'José Velázquez Sánchez'),
  (3, 'bajo-tu-amparo-ruben-jordan-flores', 'Bajo Tu Amparo', 'Rubén Jordán Flores'),
  (4, 'coronacion-puntas-marvizon', 'Coronación', 'Manuel Marvizón Carvallo / Juan José Puntas Fernández'),
  (5, 'coronacion-de-la-macarena-pedro-brana', 'Coronación de la Macarena', 'Pedro Braña Martínez'),
  (6, 'churumbelerias-emilio-cebrian', '¡¡Churumbelerías!!', 'Emilio Cebrián Ruiz'),
  (7, 'dios-te-salve-rocio-manuel-jesus-castro', 'Dios te Salve, Rocío', 'Manuel Jesús Castro Gomila'),
  (8, 'el-6002-capitan-leon-manuel-lopez-farfan', 'El 6002. Capitán León', 'Manuel López Farfán'),
  (9, 'marcha-el-dia-del-senor', 'El Día del Señor', 'Alfonso López Cortés'),
  (10, 'el-mayor-dolor-daniel-albarran', 'El Mayor Dolor', 'Daniel Albarrán Acosta'),
  (11, 'esperanza-de-triana-coronada-jose-albero', 'Esperanza de Triana Coronada', 'José Albero Francés'),
  (12, 'esperanza-macarena-pedro-morales', 'Esperanza Macarena', 'Pedro Morales Muñoz'),
  (13, 'espiritu-santo-pablo-ojeda', 'Espíritu Santo', 'Pablo Ojeda Jiménez'),
  (14, 'himno-a-santa-lucia-javier-calvo-gavino', 'Himno a Santa Lucía', 'Javier Calvo Gaviño'),
  (15, 'hiniesta-jose-martinez-peralto', 'Hiniesta', 'José Martínez Peralto'),
  (16, 'marcha-la-emperatriz-hispana-2017', 'La Emperatriz Hispana', 'Daniel Albarrán Acosta'),
  (17, 'la-estrella-sublime-manuel-lopez-farfan', 'La Estrella Sublime', 'Manuel López Farfán'),
  (18, 'la-madre-de-dios-daniel-albarran', 'La Madre de Dios', 'Daniel Albarrán Acosta'),
  (19, 'la-sangre-y-la-gloria-alfonso-lozano', 'La Sangre y la Gloria', 'Alfonso Lozano Ruiz'),
  (20, 'macarena-abel-moreno', 'Macarena', 'Abel Moreno Gómez'),
  (21, 'madre-de-los-gitanos-coronada-abel-moreno', 'Madre de los Gitanos Coronada', 'Abel Moreno Gómez'),
  (22, 'madruga-macarena-pablo-ojeda', 'Madrugá Macarena', 'Pablo Ojeda Jiménez'),
  (23, 'nuestra-senora-de-las-lagrimas-pedro-morales', 'Nuestra Señora de las Lágrimas', 'Pedro Morales Muñoz'),
  (24, 'pasan-los-campanilleros-manuel-lopez-farfan', 'Pasan los Campanilleros', 'Manuel López Farfán'),
  (25, 'reina-de-la-o-antonio-david-rodriguez', 'Reina de la O', 'Antonio David Rodríguez Gómez'),
  (26, 'rosario-de-montesion-juan-velazquez', 'Rosario de Montesión', 'Juan Velázquez Sánchez'),
  (27, 'siempre-la-esperanza-jesus-joaquin-espinosa', 'Siempre la Esperanza', 'Jesús Joaquín Espinosa de los Monteros Pérez'),
  (28, 'siempre-macarena-jose-leon-alapont', 'Siempre Macarena', 'José León Alapont'),
  (29, 'suspiros-de-espana-antonio-alvarez-alonso', 'Suspiros de España', 'Antonio Álvarez Alonso'),
  (30, 'triana-tu-esperanza-jose-de-la-vega', 'Triana, Tu Esperanza', 'José de la Vega Sánchez'),
  (31, 'virgen-de-la-estrella-pedro-gamez-laserna', 'Virgen de la Estrella', 'Pedro Gámez Laserna'),
  (32, 'virgen-de-los-estudiantes-abel-moreno', 'Virgen de los Estudiantes', 'Abel Moreno Gómez'),
  (33, 'y-te-corono-sevilla-d-segado', 'Y Te Coronó Sevilla', 'David Segado Ramírez')
)
insert into public.musical_repertoire_entries (repertoire_id, march_entity_id, display_title, source_credit, performance_count, display_order, notes)
select repertoire.id, march.id, seed.display_title, seed.source_credit, 1, seed.display_order,
       case when seed.march_slug = 'macarena-abel-moreno' then 'Se vincula a la obra de Abel Moreno, no a sus homónimas.' else null end
from seed join public.musical_repertoires repertoire on repertoire.slug = 'santa-lucia-liceo-sevilla-2026'
join public.entities march on march.entity_type = 'march' and march.slug = seed.march_slug;

do $assertions$
declare v_panaderos uuid; v_santa_lucia uuid;
begin
  select id into strict v_panaderos from public.musical_repertoires where slug = 'los-panaderos-regla-coronada-santa-ana-2026';
  select id into strict v_santa_lucia from public.musical_repertoires where slug = 'santa-lucia-liceo-sevilla-2026';
  if (select count(*) from public.musical_repertoire_entries where repertoire_id = v_panaderos) <> 25 then raise exception 'Los Panaderos debe contener 25 obras'; end if;
  if (select sum(performance_count) from public.musical_repertoire_entries where repertoire_id = v_panaderos) <> 27 then raise exception 'Los Panaderos debe sumar 27 interpretaciones'; end if;
  if (select count(*) from public.musical_repertoire_entries where repertoire_id = v_santa_lucia) <> 33 then raise exception 'Santa Lucía debe contener 33 obras'; end if;
  if (select sum(performance_count) from public.musical_repertoire_entries where repertoire_id = v_santa_lucia) <> 33 then raise exception 'Santa Lucía debe sumar 33 interpretaciones'; end if;
  if exists (
    select 1 from public.musical_repertoire_entries
    where repertoire_id in (v_panaderos, v_santa_lucia) and march_entity_id is null
  ) then raise exception 'Las crucetas no pueden contener obras huérfanas'; end if;
end
$assertions$;

commit;
