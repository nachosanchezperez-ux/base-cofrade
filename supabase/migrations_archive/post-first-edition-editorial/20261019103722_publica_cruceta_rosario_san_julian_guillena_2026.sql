-- Hilo Cofrade · repertorio interpretado de Nuestra Señora del Rosario de San Julián
-- Sevilla · 18 de octubre de 2026 · Banda de Música Villa de Guillena
-- La fuente relaciona dos piezas de pasacalles y veinticuatro marchas.
-- No se deducen puntos del recorrido, consecutividad ni repeticiones no expresadas.

begin;

do $preflight$
begin
  if (select count(*) from public.outings where slug='rosario-san-julian-procesion-2026' and outing_date=date '2026-10-18' and status='published') <> 1 then
    raise exception 'La procesión del Rosario de San Julián de 2026 no es unívoca';
  end if;
  if (select count(*) from public.entities where entity_type='brotherhood' and slug='rosario-san-julian-sevilla' and status='published') <> 1 then
    raise exception 'La Hermandad del Rosario de San Julián no es unívoca';
  end if;
  if (select count(*) from public.entities where entity_type='band' and slug='banda-musica-villa-guillena' and status='published') <> 1 then
    raise exception 'La Banda de Música Villa de Guillena no es unívoca';
  end if;
  if (select count(*) from public.entities where entity_type='step' and slug='paso-rosario-san-julian-sevilla' and status='published') <> 1 then
    raise exception 'El paso del Rosario de San Julián no es unívoco';
  end if;
end
$preflight$;

update public.outings
set event_status='held',
    public_notes=replace(
      public_notes,
      'No consta itinerario detallado, hora de entrada ni acompañamiento musical en el cartel aportado.',
      'El acompañamiento musical fue ofrecido por la Banda de Música Villa de Guillena.'
    ),
    updated_at=now()
where slug='rosario-san-julian-procesion-2026';

insert into public.outing_music_positions (
  outing_id, step_entity_id, position_code, position_label, sequence_no, notes, status
)
select outing.id, step.id, 'behind_glory', 'Tras el paso de Nuestra Señora del Rosario', 1,
       'Acompañamiento musical documentado tras el paso de Nuestra Señora del Rosario de San Julián.', 'published'
from public.outings outing
join public.entities step on step.entity_type='step' and step.slug='paso-rosario-san-julian-sevilla'
where outing.slug='rosario-san-julian-procesion-2026'
on conflict (outing_id, sequence_no) do update set
  step_entity_id=excluded.step_entity_id,
  position_code=excluded.position_code,
  position_label=excluded.position_label,
  notes=excluded.notes,
  status=excluded.status,
  updated_at=now();

insert into public.outing_music_assignments (
  music_position_id, band_entity_id, participation_mode, sequence_no, notes, status
)
select position.id, band.id, 'full_route', 1,
       'La Banda de Música Villa de Guillena acompañó a Nuestra Señora del Rosario de San Julián.', 'published'
from public.outing_music_positions position
join public.outings outing on outing.id=position.outing_id
join public.entities band on band.entity_type='band' and band.slug='banda-musica-villa-guillena'
where outing.slug='rosario-san-julian-procesion-2026' and position.sequence_no=1
on conflict (music_position_id, band_entity_id, sequence_no) do update set
  participation_mode=excluded.participation_mode,
  notes=excluded.notes,
  status=excluded.status;

with seed(id,name,slug,summary) as (values
  ('cc4b4554-5b00-4cb4-99b6-a8ed2125a9b1'::uuid,'Francisco Alonso López','francisco-alonso-lopez','Compositor español de música lírica, pasodobles y repertorio para banda.'),
  ('21e49d44-f38b-461d-8d1d-6639e2073fe1'::uuid,'Luis Manuel Catalán Núñez','luis-manuel-catalan-nunez','Compositor de música procesional acreditado en Domine, Deus Noster.'),
  ('a9149e77-7577-4cd5-ad2f-6e5d2ee5e132'::uuid,'Manuel Gómez de Arribas','manuel-gomez-de-arribas','Compositor y director de banda, autor de la marcha Aquella Virgen.'),
  ('c2f85314-5915-4745-92a7-f949c20b1510'::uuid,'Javier Alonso Barba','javier-alonso-barba','Compositor de Rosario de San Julián, marcha dedicada a la titular de la corporación.')
)
insert into public.entities(id,entity_type,name,slug,summary,status)
select id,'agent',name,slug,summary,'published' from seed
where not exists(select 1 from public.entities existing where existing.entity_type='agent' and existing.slug=seed.slug);

insert into public.agents(entity_id,agent_kind,description)
select entity.id,'person',entity.summary
from public.entities entity
where entity.entity_type='agent' and entity.slug in (
  'francisco-alonso-lopez','luis-manuel-catalan-nunez','manuel-gomez-de-arribas','javier-alonso-barba'
)
on conflict (entity_id) do nothing;

with seed(id,slug,title,description,composition_year,work_type) as (values
  ('6b051582-3262-4212-8aaf-4bbb94d45a25'::uuid,'las-corsarias-francisco-alonso','Las Corsarias','Pasodoble de la bandera de la obra lírica Las Corsarias, utilizado como pasacalles.',1919,'Adaptación'),
  ('18b536b8-4eba-47cf-a43b-fccc87e5e7d4'::uuid,'rosario-reina-san-julian-juan-dios-espinosa','Rosario, Reina de San Julián','Marcha dedicada a Nuestra Señora del Rosario de San Julián.',2001,'Marcha procesional'),
  ('d976a288-7cc7-42c2-9a1c-9fb8606bae96'::uuid,'domine-deus-noster-luis-manuel-catalan','Domine, Deus Noster','Marcha procesional de Luis Manuel Catalán Núñez.',2015,'Marcha procesional'),
  ('be26f435-cf57-4bc2-9da9-8a4707f88f3c'::uuid,'aquella-virgen-manuel-gomez-arribas','Aquella Virgen','Marcha procesional de Manuel Gómez de Arribas.',1960,'Marcha procesional'),
  ('f105d092-fd11-418c-9b7d-2798b25c7198'::uuid,'rosario-san-julian-javier-alonso-barba','Rosario de San Julián','Marcha dedicada a Nuestra Señora del Rosario de San Julián.',2000,'Marcha procesional'),
  ('3467407d-57d4-4321-8461-feb812fcb1e5'::uuid,'rosario-macareno-jose-albero','Rosario Macareno','Marcha procesional de José Albero Francés.',null::integer,'Marcha procesional'),
  ('e11fbecd-3dc2-4ac3-8ff9-a4f280c81986'::uuid,'en-tus-manos-consolacion-anonimo','En tus manos, Consolación','Marcha de autoría anónima dedicada a Santa María de Consolación Madre de la Iglesia.',2021,'Marcha procesional'),
  ('fa2ed596-1590-4dda-a15d-34bb54100240'::uuid,'siervo-de-tus-dolores-fulgencio-moron','Siervo de tus Dolores','Marcha de Fulgencio Morón Ródenas dedicada a la Hermandad de los Servitas de Sevilla.',1989,'Marcha procesional'),
  ('1f46cac4-a124-4311-b14f-71834016e8fa'::uuid,'luz-en-la-soledad-oscar-navarro','Luz en la Soledad','Marcha procesional de Óscar Navarro González.',2010,'Marcha procesional')
)
insert into public.entities(id,entity_type,name,slug,summary,status)
select id,'march',title,slug,description,'published' from seed
where not exists(select 1 from public.entities existing where existing.entity_type='march' and existing.slug=seed.slug);

with seed(slug,description,composition_year,work_type) as (values
  ('las-corsarias-francisco-alonso','Pasodoble de la bandera de la obra lírica Las Corsarias, utilizado como pasacalles.',1919,'Adaptación'),
  ('rosario-reina-san-julian-juan-dios-espinosa','Marcha dedicada a Nuestra Señora del Rosario de San Julián.',2001,'Marcha procesional'),
  ('domine-deus-noster-luis-manuel-catalan','Marcha procesional de Luis Manuel Catalán Núñez.',2015,'Marcha procesional'),
  ('aquella-virgen-manuel-gomez-arribas','Marcha procesional de Manuel Gómez de Arribas.',1960,'Marcha procesional'),
  ('rosario-san-julian-javier-alonso-barba','Marcha dedicada a Nuestra Señora del Rosario de San Julián.',2000,'Marcha procesional'),
  ('rosario-macareno-jose-albero','Marcha procesional de José Albero Francés.',null::integer,'Marcha procesional'),
  ('en-tus-manos-consolacion-anonimo','Marcha de autoría anónima dedicada a Santa María de Consolación Madre de la Iglesia.',2021,'Marcha procesional'),
  ('siervo-de-tus-dolores-fulgencio-moron','Marcha dedicada a la Hermandad de los Servitas de Sevilla.',1989,'Marcha procesional'),
  ('luz-en-la-soledad-oscar-navarro','Marcha procesional de Óscar Navarro González.',2010,'Marcha procesional')
)
insert into public.marches(entity_id,music_type,work_type,description,composition_year,eligible_for_daily)
select entity.id,'Banda de Música',seed.work_type,seed.description,seed.composition_year,false
from seed join public.entities entity on entity.entity_type='march' and entity.slug=seed.slug
where not exists(select 1 from public.marches existing where existing.entity_id=entity.id);

with seed(march_slug,author_slug) as (values
  ('las-corsarias-francisco-alonso','francisco-alonso-lopez'),
  ('rosario-reina-san-julian-juan-dios-espinosa','juan-de-dios-espinosa-ordonez'),
  ('domine-deus-noster-luis-manuel-catalan','luis-manuel-catalan-nunez'),
  ('aquella-virgen-manuel-gomez-arribas','manuel-gomez-de-arribas'),
  ('rosario-san-julian-javier-alonso-barba','javier-alonso-barba'),
  ('rosario-macareno-jose-albero','jose-albero-frances'),
  ('siervo-de-tus-dolores-fulgencio-moron','fulgencio-moron-rodenas'),
  ('luz-en-la-soledad-oscar-navarro','oscar-navarro-gonzalez')
)
insert into public.march_authors(march_entity_id,agent_entity_id,author_role,status)
select march.id,author.id,'composer','published'
from seed
join public.entities march on march.entity_type='march' and march.slug=seed.march_slug
join public.entities author on author.entity_type='agent' and author.slug=seed.author_slug
where not exists(
  select 1 from public.march_authors existing
  where existing.march_entity_id=march.id and existing.agent_entity_id=author.id
    and existing.author_role='composer' and existing.status<>'archived'
);

with seed(march_slug,dedicatee_slug,dedication_text) as (values
  ('rosario-reina-san-julian-juan-dios-espinosa','imagen-rosario-san-julian-sevilla','A Nuestra Señora del Rosario de San Julián.'),
  ('rosario-san-julian-javier-alonso-barba','imagen-rosario-san-julian-sevilla','A Nuestra Señora del Rosario de San Julián.'),
  ('en-tus-manos-consolacion-anonimo','santa-maria-consolacion-madre-iglesia-sed','A Santa María de Consolación Madre de la Iglesia.'),
  ('siervo-de-tus-dolores-fulgencio-moron','nuestra-senora-dolores-servitas-sevilla','A la Hermandad de los Servitas de Sevilla.')
)
insert into public.march_dedications(march_entity_id,dedicatee_entity_id,dedication_type,dedication_text,status)
select march.id,dedicatee.id,'image',seed.dedication_text,'published'
from seed
join public.entities march on march.entity_type='march' and march.slug=seed.march_slug
join public.entities dedicatee on dedicatee.entity_type='image' and dedicatee.slug=seed.dedicatee_slug
where not exists(
  select 1 from public.march_dedications existing
  where existing.march_entity_id=march.id and existing.dedicatee_entity_id=dedicatee.id and existing.status<>'archived'
);

insert into public.sources(id,name,source_type,author_or_publisher,publication_date,accessed_at,notes)
select 'a95d7558-0710-4c3e-8f4d-282175c2beaa'::uuid,
       'Repertorio musical · Rosario de San Julián 2026','social_media',
       'Banda de Música Villa de Guillena',null,date '2026-10-19',
       'Lámina publicada tras la procesión con dos piezas de pasacalles y veinticuatro marchas. Documenta 26 obras y 26 interpretaciones; no acredita puntos del recorrido, consecutividad ni repeticiones.'
where not exists(
  select 1 from public.sources where name='Repertorio musical · Rosario de San Julián 2026'
    and author_or_publisher='Banda de Música Villa de Guillena'
);

with source as (
  select id from public.sources where name='Repertorio musical · Rosario de San Julián 2026'
    and author_or_publisher='Banda de Música Villa de Guillena' order by created_at limit 1
)
insert into public.musical_repertoires(
  id,slug,outing_id,band_entity_id,step_entity_id,source_id,title,repertoire_kind,
  notes,primary_color,accent_color,status
)
select 'e3b747ae-c8d8-4672-b7a8-907bbc27d40f'::uuid,
       'rosario-san-julian-guillena-2026',outing.id,band.id,step.id,source.id,
       'Rosario de San Julián · 18 de octubre de 2026 · Banda de Música Villa de Guillena',
       'performed',
       'Repertorio interpretado: 26 obras y 26 interpretaciones. La fuente distingue dos piezas de pasacalles y veinticuatro marchas; no documenta repeticiones ni permite inferir orden procesional o ubicación.',
       '#2C1D53','#8C342C','published'
from public.outings outing
join public.entities band on band.entity_type='band' and band.slug='banda-musica-villa-guillena'
join public.entities step on step.entity_type='step' and step.slug='paso-rosario-san-julian-sevilla'
cross join source
where outing.slug='rosario-san-julian-procesion-2026'
on conflict (slug) do update set
  outing_id=excluded.outing_id,band_entity_id=excluded.band_entity_id,step_entity_id=excluded.step_entity_id,
  source_id=excluded.source_id,title=excluded.title,repertoire_kind=excluded.repertoire_kind,
  notes=excluded.notes,primary_color=excluded.primary_color,accent_color=excluded.accent_color,
  status=excluded.status,updated_at=now();

delete from public.musical_repertoire_entries
where repertoire_id=(select id from public.musical_repertoires where slug='rosario-san-julian-guillena-2026');

with seed(display_order,march_slug,display_title,source_credit,section_note) as (values
  (1,'las-corsarias-francisco-alonso','Las Corsarias','Francisco Alonso López','Pasacalles documentado por la fuente.'),
  (2,'ganando-barlovento-ramon-saez-adana','Ganando Barlovento','Ramón Sáez de Adana Lauzurica','Pasacalles documentado por la fuente.'),
  (3,'rosario-reina-san-julian-juan-dios-espinosa','Rosario, Reina de San Julián','Juan de Dios Espinosa Ordóñez',null::text),
  (4,'virgen-de-la-estrella-pedro-gamez-laserna','Virgen de la Estrella','Pedro Gámez Laserna',null),
  (5,'coronacion-puntas-marvizon','Coronación','Manuel Marvizón y Juan José Puntas',null),
  (6,'domine-deus-noster-luis-manuel-catalan','Domine, Deus Noster','Luis Manuel Catalán Núñez',null),
  (7,'triana-tu-esperanza-jose-de-la-vega','Triana, tu Esperanza','José de la Vega Sánchez',null),
  (8,'reina-de-la-o-antonio-david-rodriguez','Reina de la O','Antonio David Rodríguez Gómez',null),
  (9,'aquella-virgen-manuel-gomez-arribas','Aquella Virgen','Manuel Gómez de Arribas',null),
  (10,'virgen-de-la-paz-pedro-morales','Virgen de la Paz','Pedro Morales Muñoz',null),
  (11,'la-virgen-de-sevilla-victor-arturo-lopez','La Virgen de Sevilla','Víctor Arturo López López',null),
  (12,'hiniesta-coronada-jose-albero','Hiniesta Coronada','José Albero Francés',null),
  (13,'marcha-al-cielo-con-ella','Al Cielo con Ella','Pedro Morales Muñoz',null),
  (14,'rosario-san-julian-javier-alonso-barba','Rosario de San Julián','Javier Alonso Barba',null),
  (15,'rosario-macareno-jose-albero','Rosario Macareno','José Albero Francés',null),
  (16,'la-estrella-sublime-manuel-lopez-farfan','La Estrella Sublime','Manuel López Farfán',null),
  (17,'hiniesta-jose-martinez-peralto','Hiniesta','José Martínez Peralto',null),
  (18,'en-tus-manos-consolacion-anonimo','En tus manos, Consolación','Anónimo',null),
  (19,'pasan-los-campanilleros-manuel-lopez-farfan','Pasan los Campanilleros','Manuel López Farfán',null),
  (20,'alma-de-la-trinidad-eloy-garcia','Alma de la Trinidad','Eloy García López',null),
  (21,'siempre-macarena-jose-leon-alapont','Siempre Macarena','José León Alapont',null),
  (22,'pasa-la-virgen-macarena-pedro-gamez-laserna','Pasa la Virgen Macarena','Pedro Gámez Laserna',null),
  (23,'siervo-de-tus-dolores-fulgencio-moron','Siervo de tus Dolores','Fulgencio Morón Ródenas',null),
  (24,'coronacion-de-la-macarena-pedro-brana','Coronación de la Macarena','Pedro Braña Martínez',null),
  (25,'luz-en-la-soledad-oscar-navarro','Luz en la Soledad','Óscar Navarro González',null),
  (26,'esperanza-macarena-pedro-morales','Esperanza Macarena','Pedro Morales Muñoz',null)
)
insert into public.musical_repertoire_entries(
  repertoire_id,march_entity_id,display_title,source_credit,performance_count,display_order,notes
)
select repertoire.id,march.id,seed.display_title,seed.source_credit,1,seed.display_order,
       coalesce(seed.section_note,'Obra documentada en la fuente; la posición en la lámina no equivale a orden procesional.')
from seed
join public.musical_repertoires repertoire on repertoire.slug='rosario-san-julian-guillena-2026'
join public.entities march on march.entity_type='march' and march.slug=seed.march_slug;

do $postflight$
declare v_repertoire uuid;
begin
  select id into strict v_repertoire from public.musical_repertoires where slug='rosario-san-julian-guillena-2026';
  if (select count(*) from public.musical_repertoire_entries where repertoire_id=v_repertoire) <> 26 then
    raise exception 'La cruceta de San Julián debe contener 26 obras';
  end if;
  if (select count(distinct march_entity_id) from public.musical_repertoire_entries where repertoire_id=v_repertoire) <> 26 then
    raise exception 'La cruceta de San Julián debe contener 26 obras distintas';
  end if;
  if (select sum(performance_count) from public.musical_repertoire_entries where repertoire_id=v_repertoire) <> 26 then
    raise exception 'La cruceta de San Julián debe sumar 26 interpretaciones';
  end if;
  if exists(select 1 from public.musical_repertoire_entries where repertoire_id=v_repertoire and performance_count<>1) then
    raise exception 'La fuente de San Julián no documenta multiplicidades';
  end if;
  if (select count(*) from public.musical_repertoire_entries where repertoire_id=v_repertoire and notes='Pasacalles documentado por la fuente.') <> 2 then
    raise exception 'La cruceta debe conservar las dos piezas de pasacalles';
  end if;
  if (select count(*) from public.musical_repertoires repertoire
      join public.outings outing on outing.id=repertoire.outing_id
      join public.entities band on band.id=repertoire.band_entity_id
      join public.entities step on step.id=repertoire.step_entity_id
      where repertoire.id=v_repertoire and outing.outing_date=date '2026-10-18' and outing.event_status='held'
        and band.slug='banda-musica-villa-guillena' and step.slug='paso-rosario-san-julian-sevilla'
        and repertoire.primary_color='#2C1D53' and repertoire.accent_color='#8C342C') <> 1 then
    raise exception 'La identidad Hermandad-fecha-Banda-paso-paleta no es íntegra';
  end if;
  if (select count(*) from public.outing_music_assignments assignment
      join public.outing_music_positions position on position.id=assignment.music_position_id
      where position.outing_id=(select outing_id from public.musical_repertoires where id=v_repertoire)
        and assignment.band_entity_id=(select band_entity_id from public.musical_repertoires where id=v_repertoire)
        and assignment.status='published') <> 1 then
    raise exception 'El acompañamiento de la Banda de Guillena no quedó vinculado a la procesión';
  end if;
  if (select source_credit from public.musical_repertoire_entries entry
      join public.entities march on march.id=entry.march_entity_id
      where entry.repertoire_id=v_repertoire and march.slug='en-tus-manos-consolacion-anonimo') <> 'Anónimo' then
    raise exception 'La autoría anónima debe conservarse literalmente sin crear una persona ficticia';
  end if;
end
$postflight$;

commit;
