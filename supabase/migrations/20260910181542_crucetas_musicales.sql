-- Hilo Cofrade · Crucetas musicales
-- Modelo relacional para repertorios realmente interpretados en una salida.
-- La primera carga documenta la procesión triunfal de la Divina Pastora de
-- Cantillana del 8 de septiembre de 2026, cuando las entidades editoriales
-- necesarias ya existen (la migración sigue siendo aplicable sobre una base vacía).

create table public.musical_repertoires (
  id uuid default gen_random_uuid() primary key,
  slug text not null unique,
  outing_id uuid not null references public.outings(id) on delete cascade,
  band_entity_id uuid not null references public.entities(id) on delete restrict,
  step_entity_id uuid references public.entities(id) on delete set null,
  source_id uuid references public.sources(id) on delete set null,
  title text not null,
  repertoire_kind text not null default 'performed',
  notes text,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint musical_repertoires_kind_check
    check (repertoire_kind in ('performed', 'planned', 'partial')),
  constraint musical_repertoires_status_check
    check (status in ('draft', 'review', 'published', 'archived')),
  constraint musical_repertoires_outing_band_key
    unique (outing_id, band_entity_id)
);

create table public.musical_repertoire_entries (
  id uuid default gen_random_uuid() primary key,
  repertoire_id uuid not null references public.musical_repertoires(id) on delete cascade,
  march_entity_id uuid not null references public.entities(id) on delete restrict,
  display_title text not null,
  source_credit text,
  performance_count integer not null default 1,
  display_order integer not null default 1,
  notes text,
  created_at timestamptz not null default now(),
  constraint musical_repertoire_entries_count_check check (performance_count > 0),
  constraint musical_repertoire_entries_order_check check (display_order > 0),
  constraint musical_repertoire_entries_work_key unique (repertoire_id, march_entity_id),
  constraint musical_repertoire_entries_display_order_key unique (repertoire_id, display_order)
);

comment on table public.musical_repertoires is
  'Repertorios documentados para una banda en una salida concreta.';
comment on column public.musical_repertoires.repertoire_kind is
  'performed: publicado tras la salida; planned: previsión; partial: reconstrucción incompleta.';
comment on column public.musical_repertoire_entries.performance_count is
  'Número de interpretaciones declarado por la fuente. No expresa si fueron consecutivas.';
comment on column public.musical_repertoire_entries.display_order is
  'Orden editorial de la fuente, sin inferencia cronológica dentro de la procesión.';

create index musical_repertoires_outing_idx
  on public.musical_repertoires (outing_id);
create index musical_repertoires_band_idx
  on public.musical_repertoires (band_entity_id);
create index musical_repertoires_step_idx
  on public.musical_repertoires (step_entity_id)
  where step_entity_id is not null;
create index musical_repertoire_entries_repertoire_idx
  on public.musical_repertoire_entries (repertoire_id, display_order);
create index musical_repertoire_entries_march_idx
  on public.musical_repertoire_entries (march_entity_id);

alter table public.musical_repertoires enable row level security;
alter table public.musical_repertoire_entries enable row level security;

create policy "Published musical repertoires"
  on public.musical_repertoires
  for select
  to anon, authenticated
  using (
    status = 'published'
    and exists (
      select 1 from public.outings outing
      where outing.id = outing_id and outing.status = 'published'
    )
    and exists (
      select 1 from public.entities band
      where band.id = band_entity_id
        and band.entity_type = 'band'
        and band.status = 'published'
    )
  );

create policy "Entries of published musical repertoires"
  on public.musical_repertoire_entries
  for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.musical_repertoires repertoire
      where repertoire.id = repertoire_id and repertoire.status = 'published'
    )
  );

create policy "Panel members can read musical repertoires"
  on public.musical_repertoires
  for select
  to authenticated
  using ((select public.is_panel_member()));

create policy "Editors can create musical repertoires"
  on public.musical_repertoires
  for insert
  to authenticated
  with check (
    (select public.can_edit_panel())
    and (status <> 'published' or (select public.can_publish_panel()))
  );

create policy "Editors can update musical repertoires"
  on public.musical_repertoires
  for update
  to authenticated
  using (
    (select public.can_edit_panel())
    and (status <> 'published' or (select public.can_publish_panel()))
  )
  with check (
    (select public.can_edit_panel())
    and (status <> 'published' or (select public.can_publish_panel()))
  );

create policy "Admins can delete musical repertoires"
  on public.musical_repertoires
  for delete
  to authenticated
  using ((select public.can_admin_panel()));

create policy "Panel members can read musical repertoire entries"
  on public.musical_repertoire_entries
  for select
  to authenticated
  using ((select public.is_panel_member()));

create policy "Editors can create musical repertoire entries"
  on public.musical_repertoire_entries
  for insert
  to authenticated
  with check ((select public.can_edit_panel()));

create policy "Editors can update musical repertoire entries"
  on public.musical_repertoire_entries
  for update
  to authenticated
  using ((select public.can_edit_panel()))
  with check ((select public.can_edit_panel()));

create policy "Editors can delete musical repertoire entries"
  on public.musical_repertoire_entries
  for delete
  to authenticated
  using ((select public.can_edit_panel()));

grant select on public.musical_repertoires to anon;
grant select on public.musical_repertoire_entries to anon;
grant select, insert, update, delete on public.musical_repertoires to authenticated;
grant select, insert, update, delete on public.musical_repertoire_entries to authenticated;
grant all on public.musical_repertoires to service_role;
grant all on public.musical_repertoire_entries to service_role;

do $seed$
declare
  v_outing_id uuid;
  v_band_id uuid;
  v_step_id uuid;
  v_source_id uuid;
  v_repertoire_id uuid;
begin
  select outing.id into v_outing_id
  from public.outings outing
  join public.entities brotherhood on brotherhood.id = outing.brotherhood_entity_id
  where brotherhood.slug = 'pastora-de-cantillana'
    and outing.outing_date = date '2026-09-08'
    and outing.outing_type = 'Procesión de Gloria'
  order by outing.created_at
  limit 1;

  select id into v_band_id
  from public.entities
  where entity_type = 'band'
    and slug = 'banda-de-musica-nuestra-senora-de-la-soledad-cantillana';

  select id into v_step_id
  from public.entities
  where entity_type = 'step'
    and slug = 'paso-procesional-divina-pastora-cantillana';

  if v_outing_id is null or v_band_id is null then
    return;
  end if;

  update public.outings
  set event_status = 'held', updated_at = now()
  where id = v_outing_id and event_status is distinct from 'held';

  insert into public.sources (
    name, source_type, author_or_publisher, publication_date, accessed_at, notes
  )
  select
    'Cruceta interpretada · Pastora de Cantillana 2026',
    'social_media',
    'Banda de Música de Nuestra Señora de la Soledad de Cantillana',
    date '2026-09-08',
    date '2026-09-10',
    'Tres láminas publicadas por la formación tras finalizar la procesión. La cifra de cada obra se conserva sin inferir si las interpretaciones fueron consecutivas.'
  where not exists (
    select 1 from public.sources
    where name = 'Cruceta interpretada · Pastora de Cantillana 2026'
      and author_or_publisher = 'Banda de Música de Nuestra Señora de la Soledad de Cantillana'
  );

  select id into v_source_id
  from public.sources
  where name = 'Cruceta interpretada · Pastora de Cantillana 2026'
    and author_or_publisher = 'Banda de Música de Nuestra Señora de la Soledad de Cantillana'
  order by created_at
  limit 1;

  with author_seed(name, slug) as (values
    ('Daniel Albarrán Acosta','daniel-albarran-acosta'),
    ('José Félix García Domínguez','jose-felix-garcia-dominguez'),
    ('Pedro Morales Muñoz','pedro-morales-munoz'),
    ('Cristóbal López Gándara','cristobal-lopez-gandara'),
    ('Manuel Marvizón Carvallo','manuel-marvizon-carvallo'),
    ('Juan José Puntas Fernández','juan-jose-puntas-fernandez'),
    ('Pablo Ojeda Jiménez','pablo-ojeda-jimenez'),
    ('Pedro Braña Martínez','pedro-brana-martinez'),
    ('José Albero Francés','jose-albero-frances'),
    ('Emilio Cebrián Ruiz','emilio-cebrian-ruiz'),
    ('Manuel Ruiz Vidriet','manuel-ruiz-vidriet'),
    ('Santiago Ramos Castro','santiago-ramos-castro'),
    ('Manuel Retobollo Orden','manuel-retobollo-orden'),
    ('Abel Moreno Gómez','abel-moreno-gomez'),
    ('J. Arriaga','j-arriaga'),
    ('Manuel García Martín','manuel-garcia-martin'),
    ('Jesús Joaquín Espinosa de los Monteros Pérez','jesus-joaquin-espinosa-de-los-monteros-perez'),
    ('Manuel López Farfán','manuel-lopez-farfan'),
    ('José Velázquez Sánchez','jose-velazquez-sanchez'),
    ('Juan de Dios Espinosa Ordóñez','juan-de-dios-espinosa-ordonez'),
    ('Pablo Sánchez Sánchez','pablo-sanchez-sanchez'),
    ('Juan Velázquez Sánchez','juan-velazquez-sanchez'),
    ('Fray Sebastián de Villaviciosa','fray-sebastian-de-villaviciosa'),
    ('José Luis Gómez Jaldón','jose-luis-gomez-jaldon'),
    ('Pascual Marquina Narro','pascual-marquina-narro'),
    ('Alfonso López Cortés','agente-alfonso-lopez-cortes'),
    ('Óscar Navarro González','oscar-navarro-gonzalez'),
    ('José de la Vega Sánchez','jose-de-la-vega-sanchez'),
    ('Germán Álvarez Beigbeder','german-alvarez-beigbeder'),
    ('Jesús Sanz Lagares','jesus-sanz-lagares'),
    ('Román San José Redondo','roman-san-jose-redondo'),
    ('David Hurtado Torres','david-hurtado-torres'),
    ('Pedro Gámez Laserna','pedro-gamez-laserna'),
    ('Víctor Arturo López López','victor-arturo-lopez-lopez')
  )
  insert into public.entities (entity_type, name, slug, summary, status)
  select
    'agent', seed.name, seed.slug,
    'Autor acreditado en el repertorio interpretado de la Pastora de Cantillana en 2026.',
    'published'
  from author_seed seed
  where not exists (
    select 1 from public.entities entity
    where entity.entity_type = 'agent'
      and lower(translate(entity.name, 'ÁÉÍÓÚÜÑáéíóúüñ', 'AEIOUUNaeiouun')) =
          lower(translate(seed.name, 'ÁÉÍÓÚÜÑáéíóúüñ', 'AEIOUUNaeiouun'))
  );

  with march_seed(slug, title, work_type) as (values
    ('marcha-bendita-la-hora-que-el-mundo-te-vio','Bendita la hora que el mundo te vio','Marcha procesional'),
    ('pastora-reina-de-cantillana-jose-felix-garcia','Pastora, Reina de Cantillana','Marcha procesional'),
    ('himno-nacional-espana','Himno nacional','Himno'),
    ('pastora-de-cantillana-pedro-morales','Pastora de Cantillana','Marcha procesional'),
    ('esperanza-macarena-pedro-morales','Esperanza Macarena','Marcha procesional'),
    ('reina-y-pastora-de-cantillana','Reina y Pastora de Cantillana','Marcha procesional'),
    ('siempre-pastora-manuel-marvizon','Siempre, Pastora','Marcha procesional'),
    ('coronacion-puntas-marvizon','Coronación','Marcha procesional'),
    ('espiritu-santo-pablo-ojeda','Espíritu Santo','Marcha procesional'),
    ('coronacion-de-la-macarena-pedro-brana','Coronación de la Macarena','Marcha procesional'),
    ('esperanza-de-triana-coronada-jose-albero','Esperanza de Triana Coronada','Marcha procesional'),
    ('macarena-emilio-cebrian','Macarena','Marcha procesional'),
    ('rocio-manuel-ruiz-vidriet','Rocío','Marcha procesional'),
    ('virgen-de-las-aguas-santiago-ramos','Virgen de las Aguas','Marcha procesional'),
    ('virgen-coronada-de-estrellas-manuel-retobollo','Virgen coronada de estrellas','Marcha procesional'),
    ('madre-de-los-gitanos-coronada-abel-moreno','Madre de los Gitanos Coronada','Marcha procesional'),
    ('virgen-de-la-paz-pedro-morales','Virgen de la Paz','Marcha procesional'),
    ('tu-eres-el-orgullo-de-nuestro-pueblo-pablo-ojeda','Tú eres el orgullo de nuestro pueblo','Marcha procesional'),
    ('a-ti-manue-juan-jose-puntas','A ti, Manué','Marcha procesional'),
    ('madruga-macarena-pablo-ojeda','Madrugá Macarena','Marcha procesional'),
    ('pasan-los-campanilleros-manuel-lopez-farfan','Pasan los Campanilleros','Marcha procesional'),
    ('gloria-a-ti-adaptacion-banda','Gloria a ti · adaptación para banda','Adaptación'),
    ('la-virgen-de-cantillana-jesus-joaquin-espinosa','La Virgen de Cantillana','Marcha procesional'),
    ('la-estrella-sublime-manuel-lopez-farfan','La Estrella Sublime','Marcha procesional'),
    ('aniversario-macareno-jose-velazquez','Aniversario Macareno','Marcha procesional'),
    ('consuelo-de-cantillana-juan-de-dios-espinosa','Consuelo de Cantillana','Marcha procesional'),
    ('virgen-del-dulce-nombre-pedro-morales','Virgen del Dulce Nombre','Marcha procesional'),
    ('la-pastora-de-espana-pablo-sanchez','La Pastora de España','Marcha procesional'),
    ('rosario-de-montesion-juan-velazquez','Rosario de Montesión','Marcha procesional'),
    ('himno-divina-pastora-cantillana','Himno de la Divina Pastora de Cantillana','Himno'),
    ('madre-de-los-pastorenos','Madre de los Pastoreños','Marcha procesional'),
    ('al-cielo-la-reina-de-triana-gomez-jaldon-espinosa','Al cielo la Reina de Triana','Marcha procesional'),
    ('procesion-de-semana-santa-en-sevilla-pascual-marquina','Procesión de Semana Santa en Sevilla','Marcha procesional'),
    ('cuando-pasa-la-esperanza-lopez-gandara','Cuando pasa la Esperanza','Marcha procesional'),
    ('madre-hiniesta-manuel-marvizon','Madre Hiniesta','Marcha procesional'),
    ('augusta-patrona-coronada-pablo-ojeda','Augusta Patrona Coronada','Marcha procesional'),
    ('marcha-el-dia-del-senor','El Día del Señor','Marcha procesional'),
    ('macarena-abel-moreno','Macarena','Marcha procesional'),
    ('pasa-la-virgen-de-la-candelaria-lopez-gandara','Pasa la Virgen de la Candelaria','Marcha procesional'),
    ('hosanna-in-excelsis-oscar-navarro','Hosanna in Excelsis','Marcha procesional'),
    ('triana-tu-esperanza-jose-de-la-vega','Triana, tú Esperanza','Marcha procesional'),
    ('virgen-del-rosario-german-alvarez-beigbeder','Virgen del Rosario','Marcha procesional'),
    ('al-cielo-con-la-reina-de-cantillana-jesus-sanz-lagares','Al cielo con la Reina de Cantillana','Marcha procesional'),
    ('el-turuta-roman-san-jose-redondo','El Turuta','Marcha procesional'),
    ('siempre-la-esperanza-jesus-joaquin-espinosa','Siempre la Esperanza','Marcha procesional'),
    ('se-arrodilla-triana-david-hurtado','Se arrodilla Triana','Marcha procesional'),
    ('pasa-la-virgen-macarena-pedro-gamez-laserna','Pasa la Virgen Macarena','Marcha procesional'),
    ('la-virgen-de-sevilla-victor-arturo-lopez','La Virgen de Sevilla','Marcha procesional')
  )
  insert into public.entities (entity_type, name, slug, summary, status)
  select
    'march', seed.title, seed.slug,
    'Obra documentada en el repertorio interpretado tras la Divina Pastora de Cantillana el 8 de septiembre de 2026.',
    'published'
  from march_seed seed
  where not exists (
    select 1 from public.entities entity
    where entity.entity_type = 'march' and entity.slug = seed.slug
  );

  with march_seed(slug, work_type) as (values
    ('marcha-bendita-la-hora-que-el-mundo-te-vio','Marcha procesional'),('pastora-reina-de-cantillana-jose-felix-garcia','Marcha procesional'),
    ('himno-nacional-espana','Himno'),('pastora-de-cantillana-pedro-morales','Marcha procesional'),('esperanza-macarena-pedro-morales','Marcha procesional'),
    ('reina-y-pastora-de-cantillana','Marcha procesional'),('siempre-pastora-manuel-marvizon','Marcha procesional'),('coronacion-puntas-marvizon','Marcha procesional'),
    ('espiritu-santo-pablo-ojeda','Marcha procesional'),('coronacion-de-la-macarena-pedro-brana','Marcha procesional'),('esperanza-de-triana-coronada-jose-albero','Marcha procesional'),
    ('macarena-emilio-cebrian','Marcha procesional'),('rocio-manuel-ruiz-vidriet','Marcha procesional'),('virgen-de-las-aguas-santiago-ramos','Marcha procesional'),
    ('virgen-coronada-de-estrellas-manuel-retobollo','Marcha procesional'),('madre-de-los-gitanos-coronada-abel-moreno','Marcha procesional'),
    ('virgen-de-la-paz-pedro-morales','Marcha procesional'),('tu-eres-el-orgullo-de-nuestro-pueblo-pablo-ojeda','Marcha procesional'),('a-ti-manue-juan-jose-puntas','Marcha procesional'),
    ('madruga-macarena-pablo-ojeda','Marcha procesional'),('pasan-los-campanilleros-manuel-lopez-farfan','Marcha procesional'),('gloria-a-ti-adaptacion-banda','Adaptación'),
    ('la-virgen-de-cantillana-jesus-joaquin-espinosa','Marcha procesional'),('la-estrella-sublime-manuel-lopez-farfan','Marcha procesional'),
    ('aniversario-macareno-jose-velazquez','Marcha procesional'),('consuelo-de-cantillana-juan-de-dios-espinosa','Marcha procesional'),
    ('virgen-del-dulce-nombre-pedro-morales','Marcha procesional'),('la-pastora-de-espana-pablo-sanchez','Marcha procesional'),('rosario-de-montesion-juan-velazquez','Marcha procesional'),
    ('himno-divina-pastora-cantillana','Himno'),('madre-de-los-pastorenos','Marcha procesional'),('al-cielo-la-reina-de-triana-gomez-jaldon-espinosa','Marcha procesional'),
    ('procesion-de-semana-santa-en-sevilla-pascual-marquina','Marcha procesional'),('cuando-pasa-la-esperanza-lopez-gandara','Marcha procesional'),
    ('madre-hiniesta-manuel-marvizon','Marcha procesional'),('augusta-patrona-coronada-pablo-ojeda','Marcha procesional'),('marcha-el-dia-del-senor','Marcha procesional'),
    ('macarena-abel-moreno','Marcha procesional'),('pasa-la-virgen-de-la-candelaria-lopez-gandara','Marcha procesional'),('hosanna-in-excelsis-oscar-navarro','Marcha procesional'),
    ('triana-tu-esperanza-jose-de-la-vega','Marcha procesional'),('virgen-del-rosario-german-alvarez-beigbeder','Marcha procesional'),
    ('al-cielo-con-la-reina-de-cantillana-jesus-sanz-lagares','Marcha procesional'),('el-turuta-roman-san-jose-redondo','Marcha procesional'),
    ('siempre-la-esperanza-jesus-joaquin-espinosa','Marcha procesional'),('se-arrodilla-triana-david-hurtado','Marcha procesional'),
    ('pasa-la-virgen-macarena-pedro-gamez-laserna','Marcha procesional'),('la-virgen-de-sevilla-victor-arturo-lopez','Marcha procesional')
  )
  insert into public.marches (entity_id, music_type, work_type, description, eligible_for_daily)
  select entity.id, 'Banda de Música', seed.work_type,
    'Interpretada en la procesión triunfal de la Divina Pastora de Cantillana de 2026.', false
  from march_seed seed
  join public.entities entity on entity.entity_type = 'march' and entity.slug = seed.slug
  where not exists (select 1 from public.marches march where march.entity_id = entity.id);

  with author_seed(march_slug, author_name, author_role) as (values
    ('marcha-bendita-la-hora-que-el-mundo-te-vio','Daniel Albarrán Acosta','composer'),
    ('pastora-reina-de-cantillana-jose-felix-garcia','José Félix García Domínguez','composer'),
    ('pastora-de-cantillana-pedro-morales','Pedro Morales Muñoz','composer'),
    ('esperanza-macarena-pedro-morales','Pedro Morales Muñoz','composer'),
    ('reina-y-pastora-de-cantillana','Cristóbal López Gándara','composer'),
    ('siempre-pastora-manuel-marvizon','Manuel Marvizón Carvallo','composer'),
    ('coronacion-puntas-marvizon','Juan José Puntas Fernández','composer'),
    ('coronacion-puntas-marvizon','Manuel Marvizón Carvallo','composer'),
    ('espiritu-santo-pablo-ojeda','Pablo Ojeda Jiménez','composer'),
    ('coronacion-de-la-macarena-pedro-brana','Pedro Braña Martínez','composer'),
    ('esperanza-de-triana-coronada-jose-albero','José Albero Francés','composer'),
    ('macarena-emilio-cebrian','Emilio Cebrián Ruiz','composer'),
    ('rocio-manuel-ruiz-vidriet','Manuel Ruiz Vidriet','composer'),
    ('virgen-de-las-aguas-santiago-ramos','Santiago Ramos Castro','composer'),
    ('virgen-coronada-de-estrellas-manuel-retobollo','Manuel Retobollo Orden','composer'),
    ('madre-de-los-gitanos-coronada-abel-moreno','Abel Moreno Gómez','composer'),
    ('virgen-de-la-paz-pedro-morales','Pedro Morales Muñoz','composer'),
    ('tu-eres-el-orgullo-de-nuestro-pueblo-pablo-ojeda','Pablo Ojeda Jiménez','composer'),
    ('a-ti-manue-juan-jose-puntas','Juan José Puntas Fernández','composer'),
    ('madruga-macarena-pablo-ojeda','Pablo Ojeda Jiménez','composer'),
    ('pasan-los-campanilleros-manuel-lopez-farfan','Manuel López Farfán','composer'),
    ('gloria-a-ti-adaptacion-banda','J. Arriaga','composer'),
    ('gloria-a-ti-adaptacion-banda','Manuel García Martín','adapter'),
    ('la-virgen-de-cantillana-jesus-joaquin-espinosa','Jesús Joaquín Espinosa de los Monteros Pérez','composer'),
    ('la-estrella-sublime-manuel-lopez-farfan','Manuel López Farfán','composer'),
    ('aniversario-macareno-jose-velazquez','José Velázquez Sánchez','composer'),
    ('consuelo-de-cantillana-juan-de-dios-espinosa','Juan de Dios Espinosa Ordóñez','composer'),
    ('virgen-del-dulce-nombre-pedro-morales','Pedro Morales Muñoz','composer'),
    ('la-pastora-de-espana-pablo-sanchez','Pablo Sánchez Sánchez','composer'),
    ('rosario-de-montesion-juan-velazquez','Juan Velázquez Sánchez','composer'),
    ('himno-divina-pastora-cantillana','Fray Sebastián de Villaviciosa','composer'),
    ('madre-de-los-pastorenos','Juan de Dios Espinosa Ordóñez','composer'),
    ('al-cielo-la-reina-de-triana-gomez-jaldon-espinosa','José Luis Gómez Jaldón','composer'),
    ('al-cielo-la-reina-de-triana-gomez-jaldon-espinosa','Juan de Dios Espinosa Ordóñez','composer'),
    ('procesion-de-semana-santa-en-sevilla-pascual-marquina','Pascual Marquina Narro','composer'),
    ('cuando-pasa-la-esperanza-lopez-gandara','Cristóbal López Gándara','composer'),
    ('madre-hiniesta-manuel-marvizon','Manuel Marvizón Carvallo','composer'),
    ('augusta-patrona-coronada-pablo-ojeda','Pablo Ojeda Jiménez','composer'),
    ('marcha-el-dia-del-senor','Alfonso López Cortés','composer'),
    ('macarena-abel-moreno','Abel Moreno Gómez','composer'),
    ('pasa-la-virgen-de-la-candelaria-lopez-gandara','Cristóbal López Gándara','composer'),
    ('hosanna-in-excelsis-oscar-navarro','Óscar Navarro González','composer'),
    ('triana-tu-esperanza-jose-de-la-vega','José de la Vega Sánchez','composer'),
    ('virgen-del-rosario-german-alvarez-beigbeder','Germán Álvarez Beigbeder','composer'),
    ('al-cielo-con-la-reina-de-cantillana-jesus-sanz-lagares','Jesús Sanz Lagares','composer'),
    ('el-turuta-roman-san-jose-redondo','Román San José Redondo','composer'),
    ('siempre-la-esperanza-jesus-joaquin-espinosa','Jesús Joaquín Espinosa de los Monteros Pérez','composer'),
    ('se-arrodilla-triana-david-hurtado','David Hurtado Torres','composer'),
    ('pasa-la-virgen-macarena-pedro-gamez-laserna','Pedro Gámez Laserna','composer'),
    ('la-virgen-de-sevilla-victor-arturo-lopez','Víctor Arturo López López','composer')
  )
  insert into public.march_authors (march_entity_id, agent_entity_id, author_role, status)
  select march.id, agent.id, seed.author_role, 'published'
  from author_seed seed
  join public.entities march on march.entity_type = 'march' and march.slug = seed.march_slug
  join public.entities agent on agent.entity_type = 'agent'
    and lower(translate(agent.name, 'ÁÉÍÓÚÜÑáéíóúüñ', 'AEIOUUNaeiouun')) =
        lower(translate(seed.author_name, 'ÁÉÍÓÚÜÑáéíóúüñ', 'AEIOUUNaeiouun'))
  where not exists (
    select 1 from public.march_authors existing
    where existing.march_entity_id = march.id
      and existing.agent_entity_id = agent.id
      and existing.author_role = seed.author_role
      and existing.status <> 'archived'
  );

  insert into public.musical_repertoires (
    slug, outing_id, band_entity_id, step_entity_id, source_id,
    title, repertoire_kind, notes, status
  ) values (
    'pastora-cantillana-procesion-2026', v_outing_id, v_band_id, v_step_id, v_source_id,
    'Repertorio interpretado tras la Divina Pastora de Cantillana · 2026',
    'performed',
    'Repertorio publicado por la banda al finalizar la procesión. Las cantidades se reproducen como número de interpretaciones, sin deducir si fueron consecutivas ni el punto del recorrido.',
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

  with entry_seed(display_order, march_slug, display_title, source_credit, performance_count) as (values
    (1,'marcha-bendita-la-hora-que-el-mundo-te-vio','Bendita la hora que el mundo te vio','Daniel Albarrán Acosta',2),
    (2,'pastora-reina-de-cantillana-jose-felix-garcia','Pastora, Reina de Cantillana','José Félix García Domínguez',2),
    (3,'himno-nacional-espana','Himno nacional',null,3),
    (4,'pastora-de-cantillana-pedro-morales','Pastora de Cantillana','Pedro Morales Muñoz',2),
    (5,'esperanza-macarena-pedro-morales','Esperanza Macarena','Pedro Morales Muñoz',1),
    (6,'reina-y-pastora-de-cantillana','Reina y Pastora de Cantillana','Cristóbal López Gándara',3),
    (7,'siempre-pastora-manuel-marvizon','Siempre, Pastora','Manuel Marvizón Carvallo',1),
    (8,'coronacion-puntas-marvizon','Coronación','Juan José Puntas Fernández / Manuel Marvizón Carvallo',1),
    (9,'espiritu-santo-pablo-ojeda','Espíritu Santo','Pablo Ojeda Jiménez',1),
    (10,'coronacion-de-la-macarena-pedro-brana','Coronación de la Macarena','Pedro Braña Martínez',1),
    (11,'esperanza-de-triana-coronada-jose-albero','Esperanza de Triana Coronada','José Albero Francés',1),
    (12,'macarena-emilio-cebrian','Macarena','Emilio Cebrián Ruiz',1),
    (13,'rocio-manuel-ruiz-vidriet','Rocío','Manuel Ruiz Vidriet',1),
    (14,'virgen-de-las-aguas-santiago-ramos','Virgen de las Aguas','Santiago Ramos Castro',1),
    (15,'virgen-coronada-de-estrellas-manuel-retobollo','Virgen coronada de estrellas','Manuel Retobollo Orden',1),
    (16,'madre-de-los-gitanos-coronada-abel-moreno','Madre de los Gitanos Coronada','Abel Moreno Gómez',1),
    (17,'virgen-de-la-paz-pedro-morales','Virgen de la Paz','Pedro Morales Muñoz',1),
    (18,'tu-eres-el-orgullo-de-nuestro-pueblo-pablo-ojeda','Tú eres el orgullo de nuestro pueblo','Pablo Ojeda Jiménez',1),
    (19,'a-ti-manue-juan-jose-puntas','A ti, Manué','Juan José Puntas Fernández',1),
    (20,'madruga-macarena-pablo-ojeda','Madrugá Macarena','Pablo Ojeda Jiménez',1),
    (21,'pasan-los-campanilleros-manuel-lopez-farfan','Pasan los Campanilleros','Manuel López Farfán',2),
    (22,'gloria-a-ti-adaptacion-banda','Gloria a ti','J. Arriaga · arreglo de Manuel García Martín',1),
    (23,'la-virgen-de-cantillana-jesus-joaquin-espinosa','La Virgen de Cantillana','Jesús Joaquín Espinosa de los Monteros Pérez',1),
    (24,'la-estrella-sublime-manuel-lopez-farfan','La Estrella Sublime','Manuel López Farfán',1),
    (25,'aniversario-macareno-jose-velazquez','Aniversario Macareno','José Velázquez Sánchez',1),
    (26,'consuelo-de-cantillana-juan-de-dios-espinosa','Consuelo de Cantillana','Juan de Dios Espinosa Ordóñez',1),
    (27,'virgen-del-dulce-nombre-pedro-morales','Virgen del Dulce Nombre','Pedro Morales Muñoz',1),
    (28,'la-pastora-de-espana-pablo-sanchez','La Pastora de España','Pablo Sánchez Sánchez',1),
    (29,'rosario-de-montesion-juan-velazquez','Rosario de Montesión','Juan Velázquez Sánchez',1),
    (30,'himno-divina-pastora-cantillana','Himno a la Divina Pastora','Fray Sebastián de Villaviciosa',2),
    (31,'madre-de-los-pastorenos','Madre de los Pastoreños','Juan de Dios Espinosa Ordóñez',1),
    (32,'al-cielo-la-reina-de-triana-gomez-jaldon-espinosa','Al cielo la Reina de Triana','José Luis Gómez Jaldón / Juan de Dios Espinosa Ordóñez',1),
    (33,'procesion-de-semana-santa-en-sevilla-pascual-marquina','Procesión de Semana Santa en Sevilla','Pascual Marquina Narro',1),
    (34,'cuando-pasa-la-esperanza-lopez-gandara','Cuando pasa la Esperanza','Cristóbal López Gándara',1),
    (35,'madre-hiniesta-manuel-marvizon','Madre Hiniesta','Manuel Marvizón Carvallo',1),
    (36,'augusta-patrona-coronada-pablo-ojeda','Augusta Patrona Coronada','Pablo Ojeda Jiménez',1),
    (37,'marcha-el-dia-del-senor','El día del Señor','Alfonso López Cortés',1),
    (38,'macarena-abel-moreno','Macarena','Abel Moreno Gómez',1),
    (39,'pasa-la-virgen-de-la-candelaria-lopez-gandara','Pasa la Virgen de la Candelaria','Cristóbal López Gándara',1),
    (40,'hosanna-in-excelsis-oscar-navarro','Hosanna in Excelsis','Óscar Navarro González',1),
    (41,'triana-tu-esperanza-jose-de-la-vega','Triana, tú Esperanza','José de la Vega Sánchez',1),
    (42,'virgen-del-rosario-german-alvarez-beigbeder','Virgen del Rosario','Germán Álvarez Beigbeder',1),
    (43,'al-cielo-con-la-reina-de-cantillana-jesus-sanz-lagares','Al cielo con la Reina de Cantillana','Jesús Sanz Lagares',1),
    (44,'el-turuta-roman-san-jose-redondo','El Turuta','Román San José Redondo',4),
    (45,'siempre-la-esperanza-jesus-joaquin-espinosa','Siempre la Esperanza','Jesús Joaquín Espinosa de los Monteros Pérez',1),
    (46,'se-arrodilla-triana-david-hurtado','Se arrodilla Triana','David Hurtado Torres',1),
    (47,'pasa-la-virgen-macarena-pedro-gamez-laserna','Pasa la Virgen Macarena','Pedro Gámez Laserna',1),
    (48,'la-virgen-de-sevilla-victor-arturo-lopez','La Virgen de Sevilla','Víctor Arturo López López',1)
  )
  insert into public.musical_repertoire_entries (
    repertoire_id, march_entity_id, display_title, source_credit,
    performance_count, display_order
  )
  select
    v_repertoire_id, march.id, seed.display_title, seed.source_credit,
    seed.performance_count, seed.display_order
  from entry_seed seed
  join public.entities march on march.entity_type = 'march' and march.slug = seed.march_slug;

  if (select count(*) from public.musical_repertoire_entries where repertoire_id = v_repertoire_id) <> 48 then
    raise exception 'La cruceta de la Pastora de Cantillana debe contener 48 obras';
  end if;

  if (select sum(performance_count) from public.musical_repertoire_entries where repertoire_id = v_repertoire_id) <> 60 then
    raise exception 'La cruceta de la Pastora de Cantillana debe sumar 60 interpretaciones';
  end if;
end
$seed$;
