-- Hilo Cofrade · repertorio interpretado tras Nuestra Señora de la Salud de San Gonzalo
-- Estación de Penitencia · Lunes Santo · Sevilla · 30 de marzo de 2026
-- Solo DML editorial. Sin DDL, RLS, arquitectura ni UX nueva.

begin;

do $preflight$
begin
  if (
    select count(*) from public.outings
    where slug = 'estacion-penitencia-san-gonzalo-2026'
      and outing_date = date '2026-03-30'
      and status = 'published'
  ) <> 1 then
    raise exception 'La estación de penitencia de San Gonzalo de 2026 no es unívoca';
  end if;

  if (
    select count(*) from public.entities step
    join public.brotherhood_steps relation on relation.step_entity_id = step.id
    join public.entities brotherhood on brotherhood.id = relation.brotherhood_entity_id
    where brotherhood.slug = 'hermandad-de-san-gonzalo'
      and step.slug = 'paso-palio-virgen-salud-san-gonzalo'
      and step.status = 'published'
  ) <> 1 then
    raise exception 'El palio de Nuestra Señora de la Salud de San Gonzalo no es unívoco';
  end if;

  if (
    select count(*) from public.entities
    where entity_type = 'band'
      and slug = 'banda-musica-santa-ana-dos-hermanas'
      and status = 'published'
  ) <> 1 then
    raise exception 'La Banda de Música Santa Ana de Dos Hermanas no es unívoca';
  end if;
end
$preflight$;

insert into public.sources (name, url, source_type, author_or_publisher, publication_date, accessed_at, notes)
select
  'Repertorio interpretado · Nuestra Señora de la Salud de San Gonzalo 2026',
  null,
  'social_media',
  'Hermandad de San Gonzalo',
  null,
  date '2026-09-14',
  'Dos láminas oficiales rotuladas «Hermandad de San Gonzalo · Lunes Santo». Documentan 80 menciones de marchas y sus créditos tras el palio. La relación se consolida en 66 obras distintas; no documenta puntos del recorrido ni consecutividad.'
where not exists (
  select 1 from public.sources
  where name = 'Repertorio interpretado · Nuestra Señora de la Salud de San Gonzalo 2026'
    and author_or_publisher = 'Hermandad de San Gonzalo'
);

insert into public.outing_music_positions (
  outing_id, step_entity_id, position_code, position_label, sequence_no, notes, status
)
select outing.id, step.id, 'behind_step', 'Tras el paso de palio', 2,
       'Acompañamiento musical documentado tras el palio de Nuestra Señora de la Salud.', 'published'
from public.outings outing
join public.entities step on step.slug = 'paso-palio-virgen-salud-san-gonzalo'
where outing.slug = 'estacion-penitencia-san-gonzalo-2026'
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
       'La Banda de Música Santa Ana de Dos Hermanas acompañó al paso de palio.', 'published'
from public.outing_music_positions position
join public.outings outing on outing.id = position.outing_id
join public.entities band on band.slug = 'banda-musica-santa-ana-dos-hermanas'
where outing.slug = 'estacion-penitencia-san-gonzalo-2026'
  and position.sequence_no = 2
on conflict (music_position_id, band_entity_id, sequence_no) do update set
  participation_mode = excluded.participation_mode,
  notes = excluded.notes,
  status = excluded.status;

with author_seed(name, slug) as (values
  ('Rafael Romero Foncubierta', 'rafael-romero-foncubierta'),
  ('David Gómez Ramírez', 'david-gomez-ramirez'),
  ('José Miguel López Rueda', 'agente-jose-miguel-lopez-rueda'),
  ('Pablo Ojeda Jiménez', 'pablo-ojeda-jimenez'),
  ('Pedro Braña Martínez', 'pedro-brana-martinez'),
  ('Manuel Marvizón Carvallo', 'manuel-marvizon-carvallo'),
  ('Manuel Ruiz Vidriet', 'manuel-ruiz-vidriet'),
  ('Bienvenido Puelles Oliver', 'bienvenido-puelles-oliver'),
  ('José Velázquez Sánchez', 'jose-velazquez-sanchez'),
  ('Abel Moreno Gómez', 'abel-moreno-gomez'),
  ('Juan Velázquez Sánchez', 'juan-velazquez-sanchez'),
  ('Ángel Alcaide Barroso', 'angel-alcaide-barroso'),
  ('Pedro Morales Muñoz', 'pedro-morales-munoz'),
  ('Daniel Albarrán Acosta', 'daniel-albarran-acosta'),
  ('José María Jiménez Oliva', 'jose-maria-jimenez-oliva'),
  ('Manuel López Farfán', 'manuel-lopez-farfan'),
  ('Felipe Sigüenza', 'felipe-siguenza'),
  ('Carlos Puelles Cervantes', 'agente-carlos-puelles-cervantes'),
  ('Cristóbal López Gándara', 'cristobal-lopez-gandara'),
  ('Félix de Carboneras', 'felix-de-carboneras'),
  ('Rubén Jordán Flores', 'ruben-jordan-flores'),
  ('Víctor Arturo López López', 'victor-arturo-lopez-lopez'),
  ('Elías Santiago Vico', 'elias-santiago-vico'),
  ('José Ramón Lozano Garrido', 'jose-ramon-lozano-garrido'),
  ('Joaquín Eligio', 'agente-joaquin-eligio'),
  ('José Colomé', 'agente-jose-colome'),
  ('Alfonso López Cortés', 'agente-alfonso-lopez-cortes'),
  ('José Albero Francés', 'jose-albero-frances'),
  ('Manuel Borrego Hernández', 'manuel-borrego-hernandez'),
  ('David Hurtado Torres', 'david-hurtado-torres'),
  ('José Luis Gómez Jaldón', 'jose-luis-gomez-jaldon'),
  ('Juan de Dios Espinosa Ordóñez', 'juan-de-dios-espinosa-ordonez'),
  ('Pedro Gámez Laserna', 'pedro-gamez-laserna'),
  ('Fulgencio Morón Ródenas', 'fulgencio-moron-rodenas'),
  ('José León Alapont', 'jose-leon-alapont'),
  ('Jesús Joaquín Espinosa de los Monteros Pérez', 'jesus-joaquin-espinosa-de-los-monteros-perez'),
  ('Carlos Guillén González', 'carlos-guillen-gonzalez'),
  ('Manuel Retobollo Orden', 'manuel-retobollo-orden'),
  ('Natalia de Martín', 'natalia-de-martin'),
  ('Jesús Manuel Martín Prieto', 'jesus-manuel-martin-prieto')
)
insert into public.entities (entity_type, name, slug, summary, status)
select 'agent', seed.name, seed.slug,
       'Autor vinculado al repertorio interpretado tras Nuestra Señora de la Salud de San Gonzalo en 2026.',
       'published'
from author_seed seed
where not exists (
  select 1 from public.entities entity
  where entity.entity_type = 'agent'
    and lower(translate(entity.name, 'ÁÉÍÓÚÜÑáéíóúüñ', 'AEIOUUNaeiouun')) =
        lower(translate(seed.name, 'ÁÉÍÓÚÜÑáéíóúüñ', 'AEIOUUNaeiouun'))
);

with author_seed(name) as (values
  ('Rafael Romero Foncubierta'),('David Gómez Ramírez'),('José Miguel López Rueda'),
  ('Pablo Ojeda Jiménez'),('Pedro Braña Martínez'),('Manuel Marvizón Carvallo'),
  ('Manuel Ruiz Vidriet'),('Bienvenido Puelles Oliver'),('José Velázquez Sánchez'),
  ('Abel Moreno Gómez'),('Juan Velázquez Sánchez'),('Ángel Alcaide Barroso'),
  ('Pedro Morales Muñoz'),('Daniel Albarrán Acosta'),('José María Jiménez Oliva'),
  ('Manuel López Farfán'),('Felipe Sigüenza'),('Carlos Puelles Cervantes'),
  ('Cristóbal López Gándara'),('Félix de Carboneras'),('Rubén Jordán Flores'),
  ('Víctor Arturo López López'),('Elías Santiago Vico'),('José Ramón Lozano Garrido'),
  ('Joaquín Eligio'),('José Colomé'),('Alfonso López Cortés'),('José Albero Francés'),
  ('Manuel Borrego Hernández'),('David Hurtado Torres'),('José Luis Gómez Jaldón'),
  ('Juan de Dios Espinosa Ordóñez'),('Pedro Gámez Laserna'),('Fulgencio Morón Ródenas'),
  ('José León Alapont'),('Jesús Joaquín Espinosa de los Monteros Pérez'),
  ('Carlos Guillén González'),('Manuel Retobollo Orden'),('Natalia de Martín'),
  ('Jesús Manuel Martín Prieto')
)
insert into public.agents (entity_id, agent_kind, description)
select entity.id, 'person', entity.summary
from author_seed seed
join public.entities entity on entity.entity_type = 'agent'
  and lower(translate(entity.name, 'ÁÉÍÓÚÜÑáéíóúüñ', 'AEIOUUNaeiouun')) =
      lower(translate(seed.name, 'ÁÉÍÓÚÜÑáéíóúüñ', 'AEIOUUNaeiouun'))
on conflict (entity_id) do nothing;

with march_seed(slug, title) as (values
  ('salve-nuestra-senora-salud-romero-gomez', 'Salve a Nuestra Señora de la Salud'),
  ('salud-de-triana-jose-miguel-lopez', 'Salud de Triana'),
  ('tu-eres-orgullo-nuestro-pueblo-pablo-ojeda', 'Tú eres el orgullo de nuestro pueblo'),
  ('coronacion-de-la-macarena-pedro-brana', 'Coronación de la Macarena'),
  ('coronacion-puntas-marvizon', 'Coronación'),
  ('rocio-manuel-ruiz-vidriet', 'Rocío'),
  ('coronacion-nuestra-senora-salud-bienvenido-puelles', 'Coronación de Nuestra Señora de la Salud'),
  ('aniversario-macareno-jose-velazquez', 'Aniversario Macareno'),
  ('la-asuncion-de-cantillana-pedro-brana', 'La Asunción de Cantillana'),
  ('marcha-encarnacion-coronada-bm-1994', 'Encarnación Coronada'),
  ('rosario-de-montesion-juan-velazquez', 'Rosario de Montesión'),
  ('esperanza-trianera-angel-alcaide', 'Esperanza Trianera'),
  ('senorita-de-triana-pedro-morales', 'Señorita de Triana'),
  ('coronacion-de-la-salud-daniel-albarran', 'Coronación de la Salud'),
  ('salve-rocio-de-triana-jimenez-puelles', 'Salve, Rocío de Triana'),
  ('salud-del-barrio-mio-bienvenido-puelles', 'Salud del barrio mío'),
  ('pasan-los-campanilleros-manuel-lopez-farfan', 'Pasan los Campanilleros'),
  ('aires-de-triana-felipe-siguenza', 'Aires de Triana'),
  ('corona-de-estrella-bienvenido-puelles', 'Corona de Estrella'),
  ('madre-de-la-salud-david-gomez', 'Madre de la Salud'),
  ('reina-de-triana-jose-miguel-lopez', 'Reina de Triana'),
  ('la-blanca-estela-carlos-puelles', 'La Blanca Estela'),
  ('macarena-abel-moreno', 'Macarena'),
  ('marcha-virgen-de-los-negritos-pedro-morales', 'Virgen de los Negritos'),
  ('esperanza-macarena-pedro-morales', 'Esperanza Macarena'),
  ('salud-siempre-manuel-marvizon', 'Salud Siempre'),
  ('pasa-la-virgen-de-la-candelaria-lopez-gandara', 'Pasa la Virgen de la Candelaria'),
  ('la-gloria-de-un-pueblo-felix-carboneras', 'La Gloria de un Pueblo'),
  ('la-mision-de-la-esperanza-ruben-jordan', 'La Misión de la Esperanza'),
  ('la-virgen-de-sevilla-victor-arturo-lopez', 'La Virgen de Sevilla'),
  ('madre-hiniesta-manuel-marvizon', 'Madre Hiniesta'),
  ('y-amanecio-en-tu-albayzin-elias-santiago', 'Y amaneció en tu Albayzín'),
  ('virgen-de-regla-coronada-jose-ramon-lozano', 'Virgen de Regla Coronada'),
  ('marcha-la-salud-en-triana', 'La Salud en Triana'),
  ('marcha-el-dia-del-senor', 'El Día del Señor'),
  ('esperanza-de-triana-coronada-jose-albero', 'Esperanza de Triana Coronada'),
  ('triana-felix-de-carboneras', 'Triana'),
  ('salus-infirmorum-manuel-borrego', 'Salus Infirmorum'),
  ('como-tu-ninguna-david-hurtado', 'Como Tú, Ninguna'),
  ('costaleros-virgen-amparo-jose-ramon-lozano', 'Costaleros de la Virgen del Amparo'),
  ('al-cielo-la-reina-de-triana-gomez-jaldon-espinosa', 'Al cielo la Reina de Triana'),
  ('la-estrella-sublime-manuel-lopez-farfan', 'La Estrella Sublime'),
  ('la-virgen-de-las-angustias-david-hurtado', 'La Virgen de las Angustias'),
  ('el-mayor-dolor-daniel-albarran', 'El Mayor Dolor'),
  ('pasa-la-virgen-macarena-pedro-gamez-laserna', 'Pasa la Virgen Macarena'),
  ('cristo-en-la-alcazaba-fulgencio-moron', 'Cristo en la Alcazaba'),
  ('se-arrodilla-triana-david-hurtado', 'Se arrodilla Triana'),
  ('la-madruga-abel-moreno', 'La Madrugá'),
  ('aurora-reina-manana-pablo-ojeda', 'Aurora, Reina de la Mañana'),
  ('espiritu-santo-pablo-ojeda', 'Espíritu Santo'),
  ('la-virgen-de-castilleja-victor-arturo-lopez', 'La Virgen de Castilleja'),
  ('siempre-macarena-jose-leon-alapont', 'Siempre Macarena'),
  ('marcha-nanas-del-baratillo', 'Nanas del Baratillo'),
  ('madre-del-divino-perdon-joaquin-eligio', 'Madre del Divino Perdón'),
  ('quien-te-vio-y-no-te-recuerda-david-hurtado', '¿Quién te vio y no te recuerda?'),
  ('virgen-de-la-paz-pedro-morales', 'Virgen de la Paz'),
  ('y-en-triana-la-o-espinosa-monteros', 'Y en Triana la O'),
  ('creo-en-la-esperanza-carlos-guillen', 'Creo en la Esperanza'),
  ('madruga-macarena-pablo-ojeda', 'Madrugá Macarena'),
  ('virgen-coronada-de-estrellas-manuel-retobollo', 'Virgen coronada de estrellas'),
  ('tu-solea-rosario-natalia-de-martin', 'Tu soleá, Rosario'),
  ('fuente-de-la-salud-bienvenido-puelles', 'Fuente de la Salud'),
  ('siempre-la-esperanza-jesus-joaquin-espinosa', 'Siempre la Esperanza'),
  ('corona-de-azahares-carlos-puelles', 'Corona de Azahares'),
  ('reina-madre-capitana-jose-luis-gomez-jaldon', 'Reina, Madre y Capitana'),
  ('salud-del-soberano-jesus-manuel-martin', 'Salud del Soberano')
)
insert into public.entities (entity_type, name, slug, summary, status)
select 'march', seed.title, seed.slug,
       'Obra documentada en el repertorio interpretado tras Nuestra Señora de la Salud de San Gonzalo el Lunes Santo de 2026.',
       'published'
from march_seed seed
where not exists (
  select 1 from public.entities entity
  where entity.entity_type = 'march' and entity.slug = seed.slug
);

with march_seed(slug) as (values
  ('salve-nuestra-senora-salud-romero-gomez'),('salud-de-triana-jose-miguel-lopez'),
  ('tu-eres-orgullo-nuestro-pueblo-pablo-ojeda'),('coronacion-de-la-macarena-pedro-brana'),
  ('coronacion-puntas-marvizon'),('rocio-manuel-ruiz-vidriet'),
  ('coronacion-nuestra-senora-salud-bienvenido-puelles'),('aniversario-macareno-jose-velazquez'),
  ('la-asuncion-de-cantillana-pedro-brana'),('marcha-encarnacion-coronada-bm-1994'),
  ('rosario-de-montesion-juan-velazquez'),('esperanza-trianera-angel-alcaide'),
  ('senorita-de-triana-pedro-morales'),('coronacion-de-la-salud-daniel-albarran'),
  ('salve-rocio-de-triana-jimenez-puelles'),('salud-del-barrio-mio-bienvenido-puelles'),
  ('pasan-los-campanilleros-manuel-lopez-farfan'),('aires-de-triana-felipe-siguenza'),
  ('corona-de-estrella-bienvenido-puelles'),('madre-de-la-salud-david-gomez'),
  ('reina-de-triana-jose-miguel-lopez'),('la-blanca-estela-carlos-puelles'),
  ('macarena-abel-moreno'),('marcha-virgen-de-los-negritos-pedro-morales'),
  ('esperanza-macarena-pedro-morales'),('salud-siempre-manuel-marvizon'),
  ('pasa-la-virgen-de-la-candelaria-lopez-gandara'),('la-gloria-de-un-pueblo-felix-carboneras'),
  ('la-mision-de-la-esperanza-ruben-jordan'),('la-virgen-de-sevilla-victor-arturo-lopez'),
  ('madre-hiniesta-manuel-marvizon'),('y-amanecio-en-tu-albayzin-elias-santiago'),
  ('virgen-de-regla-coronada-jose-ramon-lozano'),('marcha-la-salud-en-triana'),
  ('marcha-el-dia-del-senor'),('esperanza-de-triana-coronada-jose-albero'),
  ('triana-felix-de-carboneras'),('salus-infirmorum-manuel-borrego'),
  ('como-tu-ninguna-david-hurtado'),('costaleros-virgen-amparo-jose-ramon-lozano'),
  ('al-cielo-la-reina-de-triana-gomez-jaldon-espinosa'),('la-estrella-sublime-manuel-lopez-farfan'),
  ('la-virgen-de-las-angustias-david-hurtado'),('el-mayor-dolor-daniel-albarran'),
  ('pasa-la-virgen-macarena-pedro-gamez-laserna'),('cristo-en-la-alcazaba-fulgencio-moron'),
  ('se-arrodilla-triana-david-hurtado'),('la-madruga-abel-moreno'),
  ('aurora-reina-manana-pablo-ojeda'),('espiritu-santo-pablo-ojeda'),
  ('la-virgen-de-castilleja-victor-arturo-lopez'),('siempre-macarena-jose-leon-alapont'),
  ('marcha-nanas-del-baratillo'),('madre-del-divino-perdon-joaquin-eligio'),
  ('quien-te-vio-y-no-te-recuerda-david-hurtado'),('virgen-de-la-paz-pedro-morales'),
  ('y-en-triana-la-o-espinosa-monteros'),('creo-en-la-esperanza-carlos-guillen'),
  ('madruga-macarena-pablo-ojeda'),('virgen-coronada-de-estrellas-manuel-retobollo'),
  ('tu-solea-rosario-natalia-de-martin'),('fuente-de-la-salud-bienvenido-puelles'),
  ('siempre-la-esperanza-jesus-joaquin-espinosa'),('corona-de-azahares-carlos-puelles'),
  ('reina-madre-capitana-jose-luis-gomez-jaldon'),('salud-del-soberano-jesus-manuel-martin')
)
insert into public.marches (entity_id, music_type, work_type, description, eligible_for_daily)
select entity.id, 'Banda de Música', 'Marcha procesional',
       'Interpretada por la Banda de Música Santa Ana de Dos Hermanas tras Nuestra Señora de la Salud de San Gonzalo en 2026.',
       false
from march_seed seed
join public.entities entity on entity.entity_type = 'march' and entity.slug = seed.slug
where not exists (select 1 from public.marches march where march.entity_id = entity.id);

with author_seed(march_slug, author_name, author_role) as (values
  ('salve-nuestra-senora-salud-romero-gomez', 'Rafael Romero Foncubierta', 'composer'),
  ('salve-nuestra-senora-salud-romero-gomez', 'David Gómez Ramírez', 'composer'),
  ('salud-de-triana-jose-miguel-lopez', 'José Miguel López Rueda', 'composer'),
  ('tu-eres-orgullo-nuestro-pueblo-pablo-ojeda', 'Pablo Ojeda Jiménez', 'composer'),
  ('coronacion-de-la-macarena-pedro-brana', 'Pedro Braña Martínez', 'composer'),
  ('coronacion-puntas-marvizon', 'Manuel Marvizón Carvallo', 'composer'),
  ('rocio-manuel-ruiz-vidriet', 'Manuel Ruiz Vidriet', 'composer'),
  ('coronacion-nuestra-senora-salud-bienvenido-puelles', 'Bienvenido Puelles Oliver', 'composer'),
  ('aniversario-macareno-jose-velazquez', 'José Velázquez Sánchez', 'composer'),
  ('la-asuncion-de-cantillana-pedro-brana', 'Pedro Braña Martínez', 'composer'),
  ('marcha-encarnacion-coronada-bm-1994', 'Abel Moreno Gómez', 'composer'),
  ('rosario-de-montesion-juan-velazquez', 'Juan Velázquez Sánchez', 'composer'),
  ('esperanza-trianera-angel-alcaide', 'Ángel Alcaide Barroso', 'composer'),
  ('senorita-de-triana-pedro-morales', 'Pedro Morales Muñoz', 'composer'),
  ('coronacion-de-la-salud-daniel-albarran', 'Daniel Albarrán Acosta', 'composer'),
  ('salve-rocio-de-triana-jimenez-puelles', 'José María Jiménez Oliva', 'composer'),
  ('salve-rocio-de-triana-jimenez-puelles', 'Bienvenido Puelles Oliver', 'composer'),
  ('salud-del-barrio-mio-bienvenido-puelles', 'Bienvenido Puelles Oliver', 'composer'),
  ('pasan-los-campanilleros-manuel-lopez-farfan', 'Manuel López Farfán', 'composer'),
  ('aires-de-triana-felipe-siguenza', 'Felipe Sigüenza', 'composer'),
  ('corona-de-estrella-bienvenido-puelles', 'Bienvenido Puelles Oliver', 'composer'),
  ('madre-de-la-salud-david-gomez', 'David Gómez Ramírez', 'composer'),
  ('reina-de-triana-jose-miguel-lopez', 'José Miguel López Rueda', 'composer'),
  ('la-blanca-estela-carlos-puelles', 'Carlos Puelles Cervantes', 'composer'),
  ('macarena-abel-moreno', 'Abel Moreno Gómez', 'composer'),
  ('marcha-virgen-de-los-negritos-pedro-morales', 'Pedro Morales Muñoz', 'composer'),
  ('esperanza-macarena-pedro-morales', 'Pedro Morales Muñoz', 'composer'),
  ('salud-siempre-manuel-marvizon', 'Manuel Marvizón Carvallo', 'composer'),
  ('pasa-la-virgen-de-la-candelaria-lopez-gandara', 'Cristóbal López Gándara', 'composer'),
  ('la-gloria-de-un-pueblo-felix-carboneras', 'Félix de Carboneras', 'composer'),
  ('la-mision-de-la-esperanza-ruben-jordan', 'Rubén Jordán Flores', 'composer'),
  ('la-virgen-de-sevilla-victor-arturo-lopez', 'Víctor Arturo López López', 'composer'),
  ('madre-hiniesta-manuel-marvizon', 'Manuel Marvizón Carvallo', 'composer'),
  ('y-amanecio-en-tu-albayzin-elias-santiago', 'Elías Santiago Vico', 'composer'),
  ('virgen-de-regla-coronada-jose-ramon-lozano', 'José Ramón Lozano Garrido', 'composer'),
  ('marcha-la-salud-en-triana', 'Joaquín Eligio', 'composer'),
  ('marcha-la-salud-en-triana', 'José Colomé', 'composer'),
  ('marcha-el-dia-del-senor', 'Alfonso López Cortés', 'composer'),
  ('esperanza-de-triana-coronada-jose-albero', 'José Albero Francés', 'composer'),
  ('triana-felix-de-carboneras', 'Félix de Carboneras', 'composer'),
  ('salus-infirmorum-manuel-borrego', 'Manuel Borrego Hernández', 'composer'),
  ('como-tu-ninguna-david-hurtado', 'David Hurtado Torres', 'composer'),
  ('costaleros-virgen-amparo-jose-ramon-lozano', 'José Ramón Lozano Garrido', 'composer'),
  ('al-cielo-la-reina-de-triana-gomez-jaldon-espinosa', 'José Luis Gómez Jaldón', 'composer'),
  ('la-estrella-sublime-manuel-lopez-farfan', 'Manuel López Farfán', 'composer'),
  ('la-virgen-de-las-angustias-david-hurtado', 'David Hurtado Torres', 'composer'),
  ('el-mayor-dolor-daniel-albarran', 'Daniel Albarrán Acosta', 'composer'),
  ('pasa-la-virgen-macarena-pedro-gamez-laserna', 'Pedro Gámez Laserna', 'composer'),
  ('cristo-en-la-alcazaba-fulgencio-moron', 'Fulgencio Morón Ródenas', 'composer'),
  ('se-arrodilla-triana-david-hurtado', 'David Hurtado Torres', 'composer'),
  ('la-madruga-abel-moreno', 'Abel Moreno Gómez', 'composer'),
  ('aurora-reina-manana-pablo-ojeda', 'Pablo Ojeda Jiménez', 'composer'),
  ('espiritu-santo-pablo-ojeda', 'Pablo Ojeda Jiménez', 'composer'),
  ('la-virgen-de-castilleja-victor-arturo-lopez', 'Víctor Arturo López López', 'composer'),
  ('siempre-macarena-jose-leon-alapont', 'José León Alapont', 'composer'),
  ('marcha-nanas-del-baratillo', 'David Hurtado Torres', 'composer'),
  ('madre-del-divino-perdon-joaquin-eligio', 'Joaquín Eligio', 'composer'),
  ('quien-te-vio-y-no-te-recuerda-david-hurtado', 'David Hurtado Torres', 'composer'),
  ('virgen-de-la-paz-pedro-morales', 'Pedro Morales Muñoz', 'composer'),
  ('y-en-triana-la-o-espinosa-monteros', 'Jesús Joaquín Espinosa de los Monteros Pérez', 'composer'),
  ('creo-en-la-esperanza-carlos-guillen', 'Carlos Guillén González', 'composer'),
  ('madruga-macarena-pablo-ojeda', 'Pablo Ojeda Jiménez', 'composer'),
  ('virgen-coronada-de-estrellas-manuel-retobollo', 'Manuel Retobollo Orden', 'composer'),
  ('tu-solea-rosario-natalia-de-martin', 'Natalia de Martín', 'composer'),
  ('fuente-de-la-salud-bienvenido-puelles', 'Bienvenido Puelles Oliver', 'composer'),
  ('siempre-la-esperanza-jesus-joaquin-espinosa', 'Jesús Joaquín Espinosa de los Monteros Pérez', 'composer'),
  ('corona-de-azahares-carlos-puelles', 'Carlos Puelles Cervantes', 'composer'),
  ('reina-madre-capitana-jose-luis-gomez-jaldon', 'José Luis Gómez Jaldón', 'composer'),
  ('salud-del-soberano-jesus-manuel-martin', 'Jesús Manuel Martín Prieto', 'composer')
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
  v_position_id uuid;
  v_assignment_id uuid;
  v_repertoire_id uuid;
begin
  select id into strict v_outing_id from public.outings
  where slug = 'estacion-penitencia-san-gonzalo-2026';
  select id into strict v_band_id from public.entities
  where entity_type = 'band' and slug = 'banda-musica-santa-ana-dos-hermanas';
  select id into strict v_step_id from public.entities
  where entity_type = 'step' and slug = 'paso-palio-virgen-salud-san-gonzalo';
  select id into strict v_source_id from public.sources
  where name = 'Repertorio interpretado · Nuestra Señora de la Salud de San Gonzalo 2026'
    and author_or_publisher = 'Hermandad de San Gonzalo'
  order by created_at limit 1;
  select position.id into strict v_position_id
  from public.outing_music_positions position
  where position.outing_id = v_outing_id and position.sequence_no = 2;
  select assignment.id into strict v_assignment_id
  from public.outing_music_assignments assignment
  where assignment.music_position_id = v_position_id
    and assignment.band_entity_id = v_band_id and assignment.sequence_no = 1;

  insert into public.source_links (source_id, outing_id, scope, notes)
  select v_source_id, v_outing_id, 'Repertorio interpretado',
         'Fuente directa para las marchas interpretadas tras el palio el Lunes Santo de 2026.'
  where not exists (
    select 1 from public.source_links where source_id = v_source_id and outing_id = v_outing_id
  );

  insert into public.source_links (source_id, outing_music_assignment_id, scope, notes)
  select v_source_id, v_assignment_id, 'Acompañamiento musical',
         'Vincula el repertorio con la Banda de Música Santa Ana de Dos Hermanas.'
  where not exists (
    select 1 from public.source_links
    where source_id = v_source_id and outing_music_assignment_id = v_assignment_id
  );

  insert into public.musical_repertoires (
    slug, outing_id, band_entity_id, step_entity_id, source_id, title,
    repertoire_kind, notes, status
  ) values (
    'virgen-salud-san-gonzalo-lunes-santo-2026',
    v_outing_id,
    v_band_id,
    v_step_id,
    v_source_id,
    'Repertorio interpretado tras Nuestra Señora de la Salud · Lunes Santo 2026',
    'performed',
    'Las dos láminas documentan 80 menciones consolidadas en 66 obras distintas. Las cifras ×2, ×3 o ×4 expresan cuántas veces figura interpretada cada marcha, sin deducir orden, punto del recorrido ni consecutividad. «La Gloria del Pueblo» se reconcilia con «La Gloria de un Pueblo», del mismo autor.',
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
    (1, 'salve-nuestra-senora-salud-romero-gomez', 'Salve a Ntra. Sra. de la Salud', 'Rafael Romero Foncubierta y David Gómez Ramírez', 4, null::text),
    (2, 'salud-de-triana-jose-miguel-lopez', 'Salud de Triana', 'José Miguel López Rueda', 2, null::text),
    (3, 'tu-eres-orgullo-nuestro-pueblo-pablo-ojeda', 'Tu Eres el Orgullo de Ntro. Pueblo', 'Pablo Ojeda', 2, null::text),
    (4, 'coronacion-de-la-macarena-pedro-brana', 'Coronación de la Macarena', 'Pedro Braña Martínez', 2, null::text),
    (5, 'coronacion-puntas-marvizon', 'Coronación', 'Manuel Marvizón', 1, null::text),
    (6, 'rocio-manuel-ruiz-vidriet', 'Rocío', 'Manuel Ruiz Vidriet', 1, null::text),
    (7, 'coronacion-nuestra-senora-salud-bienvenido-puelles', 'Coronación de Ntra. Sra. de la Salud', 'Bienvenido Puelles Oliver', 2, null::text),
    (8, 'aniversario-macareno-jose-velazquez', 'Aniversario Macareno', 'José Velázquez', 1, null::text),
    (9, 'la-asuncion-de-cantillana-pedro-brana', 'La Asunción de Cantillana', 'Pedro Braña Martínez', 1, null::text),
    (10, 'marcha-encarnacion-coronada-bm-1994', 'Encarnación Coronada', 'Abel Moreno', 1, null::text),
    (11, 'rosario-de-montesion-juan-velazquez', 'Rosario de Montesión', 'Juan Velázquez Sánchez', 1, null::text),
    (12, 'esperanza-trianera-angel-alcaide', 'Esperanza Trianera', 'Ángel Alcaide Barroso Vázquez', 1, null::text),
    (13, 'senorita-de-triana-pedro-morales', 'Señorita de Triana', 'Pedro Morales', 1, null::text),
    (14, 'coronacion-de-la-salud-daniel-albarran', 'Coronación de la Salud', 'Daniel Albarrán', 1, null::text),
    (15, 'salve-rocio-de-triana-jimenez-puelles', 'Salve, Rocío de Triana', 'José María Jiménez y Bienvenido Puelles', 1, null::text),
    (16, 'salud-del-barrio-mio-bienvenido-puelles', 'Salud del Barrio Mío', 'Bienvenido Puelles Oliver', 1, null::text),
    (17, 'pasan-los-campanilleros-manuel-lopez-farfan', 'Pasan los Campanilleros', 'Manuel López Farfán', 1, null::text),
    (18, 'aires-de-triana-felipe-siguenza', 'Aires de Triana', 'Felipe Sigüenza', 2, null::text),
    (19, 'corona-de-estrella-bienvenido-puelles', 'Corona de Estrella', 'Bienvenido Puelles Oliver', 1, null::text),
    (20, 'madre-de-la-salud-david-gomez', 'Madre de la Salud', 'David Gómez Ramírez', 1, null::text),
    (21, 'reina-de-triana-jose-miguel-lopez', 'Reina de Triana', 'José Miguel López Rueda', 1, null::text),
    (22, 'la-blanca-estela-carlos-puelles', 'La Blanca Estela', 'Carlos Puelles Cervantes', 1, null::text),
    (23, 'macarena-abel-moreno', 'Macarena', 'Abel Moreno', 1, null::text),
    (24, 'marcha-virgen-de-los-negritos-pedro-morales', 'Virgen de los Negritos', 'Pedro Morales', 1, null::text),
    (25, 'esperanza-macarena-pedro-morales', 'Esperanza Macarena', 'Pedro Morales', 1, null::text),
    (26, 'salud-siempre-manuel-marvizon', 'Salud Siempre', 'Manuel Marvizón', 1, null::text),
    (27, 'pasa-la-virgen-de-la-candelaria-lopez-gandara', 'Pasa la Virgen de la Candelaria', 'Cristóbal López Gándara', 1, null::text),
    (28, 'la-gloria-de-un-pueblo-felix-carboneras', 'La Gloria de un Pueblo', 'Félix de Carboneras', 2, 'La segunda lámina la rotula «La Gloria del Pueblo»; se conserva como la misma obra por coincidencia de autoría.'),
    (29, 'la-mision-de-la-esperanza-ruben-jordan', 'La Misión de la Esperanza', 'Rubén Jordán', 2, null::text),
    (30, 'la-virgen-de-sevilla-victor-arturo-lopez', 'La Virgen de Sevilla', 'Víctor Arturo López López', 1, null::text),
    (31, 'madre-hiniesta-manuel-marvizon', 'Madre Hiniesta', 'Manuel Marvizón', 1, null::text),
    (32, 'y-amanecio-en-tu-albayzin-elias-santiago', 'Y Amaneció en tu Albayzín', 'Elías Santiago Vico', 2, null::text),
    (33, 'virgen-de-regla-coronada-jose-ramon-lozano', 'Virgen de Regla Coronada', 'José Ramón Lozano', 1, null::text),
    (34, 'marcha-la-salud-en-triana', 'La Salud en Triana', 'Joaquín Eligio y José Colomé', 3, null::text),
    (35, 'marcha-el-dia-del-senor', 'El Día del Señor', 'Alfonso Pérez', 2, 'Se conserva literalmente el crédito de las láminas; la ficha canónica mantiene la autoría catalogada.'),
    (36, 'esperanza-de-triana-coronada-jose-albero', 'Esperanza de Triana Coronada', 'José Albero Francés', 1, null::text),
    (37, 'triana-felix-de-carboneras', 'Triana', 'Félix de Carboneras', 1, null::text),
    (38, 'salus-infirmorum-manuel-borrego', 'Salus Infirmorum', 'Manuel Borrego Hernández', 1, null::text),
    (39, 'como-tu-ninguna-david-hurtado', 'Como Tú, Ninguna', 'David Hurtado', 1, null::text),
    (40, 'costaleros-virgen-amparo-jose-ramon-lozano', 'Costaleros de la Virgen del Amparo', 'José Ramón Lozano', 1, null::text),
    (41, 'al-cielo-la-reina-de-triana-gomez-jaldon-espinosa', 'Al Cielo la Reina de Triana', 'José Luis Gómez Jaldón', 1, null::text),
    (42, 'la-estrella-sublime-manuel-lopez-farfan', 'La Estrella Sublime', 'Manuel López Farfán', 1, null::text),
    (43, 'la-virgen-de-las-angustias-david-hurtado', 'La Virgen de las Angustias', 'David Hurtado', 1, null::text),
    (44, 'el-mayor-dolor-daniel-albarran', 'El Mayor Dolor', 'Daniel Albarrán', 1, null::text),
    (45, 'pasa-la-virgen-macarena-pedro-gamez-laserna', 'Pasa la Virgen Macarena', 'Pedro Gámez Laserna', 1, null::text),
    (46, 'cristo-en-la-alcazaba-fulgencio-moron', 'Cristo en la Alcazaba', 'Fulgencio Morón', 1, null::text),
    (47, 'se-arrodilla-triana-david-hurtado', 'Se Arrodilla Triana', 'David Hurtado', 1, null::text),
    (48, 'la-madruga-abel-moreno', 'La Madrugá', 'Abel Moreno', 1, null::text),
    (49, 'aurora-reina-manana-pablo-ojeda', 'Aurora, Reina de la Mañana', 'Pablo Ojeda', 1, null::text),
    (50, 'espiritu-santo-pablo-ojeda', 'Espíritu Santo', 'Pablo Ojeda', 1, null::text),
    (51, 'la-virgen-de-castilleja-victor-arturo-lopez', 'La Virgen de Castilleja', 'Víctor Arturo López', 1, null::text),
    (52, 'siempre-macarena-jose-leon-alapont', 'Siempre Macarena', 'José León Alapont', 1, null::text),
    (53, 'marcha-nanas-del-baratillo', 'Nanas del Baratillo', 'David Hurtado', 1, null::text),
    (54, 'madre-del-divino-perdon-joaquin-eligio', 'Madre del Divino Perdón', 'Joaquín Eligio', 1, null::text),
    (55, 'quien-te-vio-y-no-te-recuerda-david-hurtado', '¿Quién te vio y no te recuerda?', 'David Hurtado', 1, null::text),
    (56, 'virgen-de-la-paz-pedro-morales', 'Virgen de la Paz', 'Pedro Morales', 1, null::text),
    (57, 'y-en-triana-la-o-espinosa-monteros', 'Y en Triana la O', 'Jesús Joaquín Espinosa de los Monteros', 1, null::text),
    (58, 'creo-en-la-esperanza-carlos-guillen', 'Creo en la Esperanza', 'Carlos Guillén González', 1, null::text),
    (59, 'madruga-macarena-pablo-ojeda', 'Madrugá Macarena', 'Pablo Ojeda', 1, null::text),
    (60, 'virgen-coronada-de-estrellas-manuel-retobollo', 'Virgen Coronada de Estrellas', 'Manuel Rebollo Orden', 1, 'Se conserva literalmente el crédito de la lámina; la ficha canónica usa Manuel Retobollo Orden.'),
    (61, 'tu-solea-rosario-natalia-de-martin', 'Tu Soleá, Rosario', 'Natalia de Martín', 1, null::text),
    (62, 'fuente-de-la-salud-bienvenido-puelles', 'Fuente de la Salud', 'Bienvenido Puelles Oliver', 1, null::text),
    (63, 'siempre-la-esperanza-jesus-joaquin-espinosa', 'Siempre la Esperanza', 'Jesús Joaquín Espinosa de los Monteros', 1, null::text),
    (64, 'corona-de-azahares-carlos-puelles', 'Corona de Azahares', 'Carlos Puelles Cervantes', 1, null::text),
    (65, 'reina-madre-capitana-jose-luis-gomez-jaldon', 'Reina, Madre y Capitana', 'José Luis Gómez Jaldón', 1, null::text),
    (66, 'salud-del-soberano-jesus-manuel-martin', 'Salud del Soberano', 'Jesús Manuel Martín Prieto', 1, null::text)
  )
  insert into public.musical_repertoire_entries (
    repertoire_id, march_entity_id, display_title, source_credit,
    performance_count, display_order, notes
  )
  select v_repertoire_id, march.id, seed.display_title, seed.source_credit,
         seed.performance_count, seed.display_order, seed.notes
  from entry_seed seed
  join public.entities march on march.entity_type = 'march' and march.slug = seed.march_slug;

  if (select count(*) from public.musical_repertoire_entries where repertoire_id = v_repertoire_id) <> 66 then
    raise exception 'La cruceta de San Gonzalo debe contener 66 obras distintas';
  end if;

  if (select sum(performance_count) from public.musical_repertoire_entries where repertoire_id = v_repertoire_id) <> 80 then
    raise exception 'La cruceta de San Gonzalo debe sumar 80 menciones interpretadas';
  end if;

  if (
    select performance_count from public.musical_repertoire_entries entry
    join public.entities march on march.id = entry.march_entity_id
    where entry.repertoire_id = v_repertoire_id and march.slug = 'salve-nuestra-senora-salud-romero-gomez'
  ) <> 4 then
    raise exception 'La Salve a Nuestra Señora de la Salud debe conservar sus cuatro apariciones';
  end if;

  if (
    select performance_count from public.musical_repertoire_entries entry
    join public.entities march on march.id = entry.march_entity_id
    where entry.repertoire_id = v_repertoire_id and march.slug = 'marcha-la-salud-en-triana'
  ) <> 3 then
    raise exception 'La Salud en Triana debe conservar sus tres apariciones';
  end if;
end
$cruceta$;

commit;
