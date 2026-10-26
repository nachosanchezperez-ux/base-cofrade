-- Hilo Cofrade · repertorio interpretado de Nuestra Señora del Santo Rosario
-- La Macarena · Sevilla · 25 de octubre de 2026 · Carmen de Salteras
-- La fuente consolida 22 obras y 37 interpretaciones. Las multiplicidades no
-- expresan consecutividad ni permiten reconstruir el orden procesional.

begin;

do $preflight$
begin
  if (select count(*) from public.outings where slug='macarena-procesion-santo-rosario-2026-10-25' and outing_date=date '2026-10-25' and status='published') <> 1 then
    raise exception 'La procesión del Santo Rosario de la Macarena de 2026 no es unívoca';
  end if;
  if (select count(*) from public.entities where entity_type='brotherhood' and slug='hermandad-de-la-macarena' and status='published') <> 1 then
    raise exception 'La Hermandad de la Macarena no es unívoca';
  end if;
  if (select count(*) from public.entities where entity_type='image' and slug='nuestra-senora-santo-rosario-macarena' and status='published') <> 1 then
    raise exception 'Nuestra Señora del Santo Rosario de la Macarena no es unívoca';
  end if;
  if (select count(*) from public.entities where entity_type='band' and slug='carmen-de-salteras' and status='published') <> 1 then
    raise exception 'Carmen de Salteras no es unívoca';
  end if;
end
$preflight$;

update public.outings
set event_status='held', updated_at=now()
where slug='macarena-procesion-santo-rosario-2026-10-25';

insert into public.entities(entity_type,name,slug,summary,status)
select 'step','Paso procesional de Nuestra Señora del Santo Rosario','paso-santo-rosario-macarena',
       'Paso de Gloria de Nuestra Señora del Santo Rosario de la Hermandad de la Macarena.','published'
where not exists(select 1 from public.entities where entity_type='step' and slug='paso-santo-rosario-macarena');

insert into public.steps(entity_id,step_type,description,current_state_notes)
select id,'Paso procesional de Gloria',
       'Paso que porta a Nuestra Señora del Santo Rosario en su procesión anual por la feligresía de la Macarena.',
       'Documentado en la salida celebrada el 25 de octubre de 2026.'
from public.entities where entity_type='step' and slug='paso-santo-rosario-macarena'
on conflict (entity_id) do update set step_type=excluded.step_type,description=excluded.description,current_state_notes=excluded.current_state_notes;

insert into public.brotherhood_steps(brotherhood_entity_id,step_entity_id,relation_type,date_from_text,notes,status)
select brotherhood.id,step.id,'processional_step','Vigente en 2026',
       'Paso procesional de la titular letífica de la Hermandad.','published'
from public.entities brotherhood
join public.entities step on step.entity_type='step' and step.slug='paso-santo-rosario-macarena'
where brotherhood.entity_type='brotherhood' and brotherhood.slug='hermandad-de-la-macarena'
and not exists(
  select 1 from public.brotherhood_steps existing
  where existing.brotherhood_entity_id=brotherhood.id and existing.step_entity_id=step.id
    and existing.relation_type='processional_step' and existing.status<>'archived'
);

update public.outing_music_positions position
set step_entity_id=step.id, updated_at=now()
from public.outings outing, public.entities step
where position.outing_id=outing.id and outing.slug='macarena-procesion-santo-rosario-2026-10-25'
  and position.position_code='behind_glory' and position.status<>'archived'
  and step.entity_type='step' and step.slug='paso-santo-rosario-macarena';

insert into public.entities(entity_type,name,slug,summary,status)
select 'march','Rosario de la Macarena','rosario-de-la-macarena-pedro-morales',
       'Marcha procesional de Pedro Morales Muñoz.','published'
where not exists(select 1 from public.entities where entity_type='march' and slug='rosario-de-la-macarena-pedro-morales');

insert into public.marches(entity_id,music_type,work_type,description,eligible_for_daily)
select id,'Banda de Música','Marcha procesional','Marcha procesional de Pedro Morales Muñoz.',false
from public.entities where entity_type='march' and slug='rosario-de-la-macarena-pedro-morales'
on conflict (entity_id) do nothing;

with seed(march_slug,author_slug) as (values
  ('rosario-de-la-macarena-pedro-morales','pedro-morales-munoz'),
  ('rocio-manuel-ruiz-vidriet','manuel-perez-tejera')
)
insert into public.march_authors(march_entity_id,agent_entity_id,author_role,notes,status)
select march.id,author.id,'composer','Autoría publicada por Carmen de Salteras en el repertorio del 25 de octubre de 2026.','published'
from seed
join public.entities march on march.entity_type='march' and march.slug=seed.march_slug
join public.entities author on author.entity_type='agent' and author.slug=seed.author_slug
where not exists(
  select 1 from public.march_authors existing
  where existing.march_entity_id=march.id and existing.agent_entity_id=author.id
    and existing.author_role='composer' and existing.status<>'archived'
);

insert into public.sources(name,url,source_type,author_or_publisher,publication_date,accessed_at,notes)
select 'Repertorio musical · Santo Rosario de la Macarena 2026',null,'social_media',
       'Sociedad Filarmónica Nuestra Señora del Carmen de Salteras',date '2026-10-26',date '2026-10-26',
       'Dos láminas oficiales. Documentan 22 obras y 37 interpretaciones, con ocho multiplicidades expresas; no documentan puntos del recorrido, consecutividad ni orden cronológico.'
where not exists(
  select 1 from public.sources where name='Repertorio musical · Santo Rosario de la Macarena 2026'
    and author_or_publisher='Sociedad Filarmónica Nuestra Señora del Carmen de Salteras'
);

with refs as (
  select source.id source_id,outing.id outing_id,assignment.id assignment_id
  from public.sources source
  join public.outings outing on outing.slug='macarena-procesion-santo-rosario-2026-10-25'
  join public.outing_music_positions position on position.outing_id=outing.id and position.position_code='behind_glory' and position.status<>'archived'
  join public.outing_music_assignments assignment on assignment.music_position_id=position.id and assignment.status<>'archived'
  join public.entities band on band.id=assignment.band_entity_id and band.slug='carmen-de-salteras'
  where source.name='Repertorio musical · Santo Rosario de la Macarena 2026'
)
insert into public.source_links(source_id,outing_id,scope,notes)
select source_id,outing_id,'Repertorio interpretado','Fuente directa de la cruceta publicada por la Banda.' from refs
where not exists(select 1 from public.source_links existing where existing.source_id=refs.source_id and existing.outing_id=refs.outing_id);

with refs as (
  select source.id source_id,assignment.id assignment_id
  from public.sources source
  join public.outings outing on outing.slug='macarena-procesion-santo-rosario-2026-10-25'
  join public.outing_music_positions position on position.outing_id=outing.id and position.position_code='behind_glory' and position.status<>'archived'
  join public.outing_music_assignments assignment on assignment.music_position_id=position.id and assignment.status<>'archived'
  join public.entities band on band.id=assignment.band_entity_id and band.slug='carmen-de-salteras'
  where source.name='Repertorio musical · Santo Rosario de la Macarena 2026'
)
insert into public.source_links(source_id,outing_music_assignment_id,scope,notes)
select source_id,assignment_id,'Acompañamiento musical','Vincula la cruceta con Carmen de Salteras tras el paso.' from refs
where not exists(select 1 from public.source_links existing where existing.source_id=refs.source_id and existing.outing_music_assignment_id=refs.assignment_id);

with source as (
  select id from public.sources
  where name='Repertorio musical · Santo Rosario de la Macarena 2026'
    and author_or_publisher='Sociedad Filarmónica Nuestra Señora del Carmen de Salteras'
  order by created_at limit 1
)
insert into public.musical_repertoires(
  slug,outing_id,band_entity_id,step_entity_id,source_id,title,repertoire_kind,notes,
  primary_color,accent_color,status
)
select 'santo-rosario-macarena-carmen-salteras-2026',outing.id,band.id,step.id,source.id,
       'La Macarena · 25 de octubre de 2026 · Carmen de Salteras','performed',
       'Repertorio interpretado: 22 obras y 37 interpretaciones. Las multiplicidades proceden de la fuente y no expresan consecutividad; la disposición de las láminas no se presenta como orden procesional.',
       '#2B1D15','#B48A2B','published'
from public.outings outing
join public.entities band on band.entity_type='band' and band.slug='carmen-de-salteras'
join public.entities step on step.entity_type='step' and step.slug='paso-santo-rosario-macarena'
cross join source
where outing.slug='macarena-procesion-santo-rosario-2026-10-25'
on conflict (slug) do update set
  outing_id=excluded.outing_id,band_entity_id=excluded.band_entity_id,step_entity_id=excluded.step_entity_id,
  source_id=excluded.source_id,title=excluded.title,repertoire_kind=excluded.repertoire_kind,
  notes=excluded.notes,primary_color=excluded.primary_color,accent_color=excluded.accent_color,
  status=excluded.status,updated_at=now();

with seed(display_order,march_slug,display_title,source_credit,performance_count) as (values
  (1,'rosario-macareno-jose-albero','Rosario Macareno','José Albero Francés',2),
  (2,'esperanza-macarena-pedro-morales','Esperanza Macarena','Pedro Morales Muñoz',3),
  (3,'rosario-de-la-macarena-pedro-morales','Rosario de la Macarena','Pedro Morales Muñoz',1),
  (4,'pasa-la-virgen-macarena-pedro-gamez-laserna','Pasa la Virgen Macarena','Pedro Gámez Laserna',3),
  (5,'coronacion-de-la-macarena-pedro-brana','Coronación de la Macarena','Pedro Braña Martínez',5),
  (6,'macarena-abel-moreno','Macarena','Abel Moreno Gómez',4),
  (7,'siempre-macarena-jose-leon-alapont','Siempre Macarena','José León Alapont',1),
  (8,'como-tu-ninguna-david-hurtado','Como tú, ninguna','David Hurtado Torres',2),
  (9,'virgen-macarena-francisco-javier-alonso-delgado','Virgen Macarena','Francisco Javier Alonso Delgado',1),
  (10,'hiniesta-coronada-jose-albero','Hiniesta Coronada','José Albero Francés',1),
  (11,'la-estrella-sublime-manuel-lopez-farfan','La Estrella Sublime','Manuel López Farfán',2),
  (12,'aniversario-macareno-jose-velazquez','Aniversario Macareno','José Velázquez Sánchez',1),
  (13,'procesion-de-semana-santa-en-sevilla-pascual-marquina','Procesión de Semana Santa en Sevilla','Pascual Marquina Narro',1),
  (14,'virgen-de-la-paz-pedro-morales','Virgen de la Paz','Pedro Morales Muñoz',1),
  (15,'virgen-de-las-aguas-santiago-ramos','Virgen de las Aguas','Santiago Ramos Castro',2),
  (16,'pasan-los-campanilleros-manuel-lopez-farfan','Pasan los Campanilleros','Manuel López Farfán',1),
  (17,'rocio-manuel-ruiz-vidriet','Rocío','Manuel Ruiz Vidriet y Manuel Pérez Tejera',1),
  (18,'la-virgen-de-sevilla-victor-arturo-lopez','La Virgen de Sevilla','Víctor Arturo López López',1),
  (19,'macarena-emilio-cebrian','Macarena','Emilio Cebrián Ruiz',1),
  (20,'sevilla-cofradiera-pedro-gamez-laserna','Sevilla Cofradiera','Pedro Gámez Laserna',1),
  (21,'tu-eres-el-orgullo-de-nuestro-pueblo-pablo-ojeda','Tú eres el orgullo de nuestro pueblo','Pablo Ojeda Jiménez',1),
  (22,'se-siempre-nuestra-esperanza-ruben-jordan','Sé siempre nuestra Esperanza','Rubén Jordán Flores',1)
)
insert into public.musical_repertoire_entries(
  repertoire_id,march_entity_id,display_title,source_credit,performance_count,display_order,notes
)
select repertoire.id,march.id,seed.display_title,seed.source_credit,seed.performance_count,seed.display_order,
       'Obra y multiplicidad documentadas por la fuente; la posición editorial no equivale a orden procesional.'
from seed
join public.musical_repertoires repertoire on repertoire.slug='santo-rosario-macarena-carmen-salteras-2026'
join public.entities march on march.entity_type='march' and march.slug=seed.march_slug
on conflict (repertoire_id,march_entity_id) do update set
  display_title=excluded.display_title,source_credit=excluded.source_credit,
  performance_count=excluded.performance_count,display_order=excluded.display_order,notes=excluded.notes;

do $postflight$
declare v_repertoire uuid;
begin
  select id into strict v_repertoire from public.musical_repertoires where slug='santo-rosario-macarena-carmen-salteras-2026';
  if (select count(*) from public.musical_repertoire_entries where repertoire_id=v_repertoire) <> 22 then
    raise exception 'La cruceta del Santo Rosario de la Macarena debe contener 22 obras';
  end if;
  if (select count(distinct march_entity_id) from public.musical_repertoire_entries where repertoire_id=v_repertoire) <> 22 then
    raise exception 'La cruceta debe conservar 22 obras distintas';
  end if;
  if (select sum(performance_count) from public.musical_repertoire_entries where repertoire_id=v_repertoire) <> 37 then
    raise exception 'La cruceta del Santo Rosario debe sumar 37 interpretaciones';
  end if;
  if (select count(*) from public.musical_repertoire_entries where repertoire_id=v_repertoire and performance_count>1) <> 8 then
    raise exception 'La cruceta debe conservar exactamente ocho multiplicidades';
  end if;
  if (select performance_count from public.musical_repertoire_entries entry join public.entities march on march.id=entry.march_entity_id where entry.repertoire_id=v_repertoire and march.slug='coronacion-de-la-macarena-pedro-brana') <> 5 then
    raise exception 'Coronación de la Macarena debe conservar la multiplicidad ×5';
  end if;
  if (select count(*) from public.musical_repertoire_entries entry join public.entities march on march.id=entry.march_entity_id where entry.repertoire_id=v_repertoire and march.slug in ('macarena-abel-moreno','macarena-emilio-cebrian')) <> 2 then
    raise exception 'Las dos Macarena deben permanecer separadas por autor';
  end if;
  if (select count(*) from public.musical_repertoires repertoire
      join public.outings outing on outing.id=repertoire.outing_id
      join public.entities band on band.id=repertoire.band_entity_id
      join public.entities step on step.id=repertoire.step_entity_id
      where repertoire.id=v_repertoire and outing.outing_date=date '2026-10-25' and outing.event_status='held'
        and band.slug='carmen-de-salteras' and step.slug='paso-santo-rosario-macarena'
        and repertoire.primary_color='#2B1D15' and repertoire.accent_color='#B48A2B') <> 1 then
    raise exception 'La identidad Hermandad-fecha-Banda-paso-paleta no es íntegra';
  end if;
  if exists(
    select 1 from public.musical_repertoire_entries entry
    left join public.march_authors author on author.march_entity_id=entry.march_entity_id and author.status='published'
    where entry.repertoire_id=v_repertoire group by entry.id having count(author.id)=0
  ) then raise exception 'Todas las obras deben conservar al menos una autoría publicada'; end if;
end
$postflight$;

commit;
