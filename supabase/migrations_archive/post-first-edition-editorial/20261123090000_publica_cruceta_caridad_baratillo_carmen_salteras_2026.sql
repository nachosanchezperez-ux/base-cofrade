-- Hilo Cofrade · repertorio interpretado en el traslado de regreso de
-- María Santísima de la Caridad en su Soledad.
-- Sevilla · 22 de noviembre de 2026 · Carmen de Salteras.
-- La lámina oficial documenta nueve obras en orden de interpretación.

begin;

do $preflight$
begin
  if (select count(*) from public.outings where slug='baratillo-caridad-regreso-funcion-solemne-2026' and outing_date=date '2026-11-22' and status='published') <> 1 then
    raise exception 'El traslado de regreso de la Virgen de la Caridad no es unívoco';
  end if;
  if (select count(*) from public.entities where entity_type='brotherhood' and slug='el-baratillo' and status='published') <> 1 then
    raise exception 'La Hermandad del Baratillo no es unívoca';
  end if;
  if (select count(*) from public.entities where entity_type='image' and slug='maria-santisima-de-la-caridad-en-su-soledad' and status='published') <> 1 then
    raise exception 'La Virgen de la Caridad no es unívoca';
  end if;
  if (select count(*) from public.entities where entity_type='step' and slug='paso-de-palio-de-maria-santisima-de-la-caridad' and status='published') <> 1 then
    raise exception 'El paso de palio de la Virgen de la Caridad no es unívoco';
  end if;
  if (select count(*) from public.entities where entity_type='band' and slug='carmen-de-salteras' and status='published') <> 1 then
    raise exception 'Carmen de Salteras no es unívoca';
  end if;
end
$preflight$;

update public.outings
set event_status='held', updated_at=now()
where slug='baratillo-caridad-regreso-funcion-solemne-2026';

update public.outing_music_positions position
set step_entity_id=step.id, updated_at=now()
from public.outings outing
join public.entities step on step.entity_type='step' and step.slug='paso-de-palio-de-maria-santisima-de-la-caridad'
where position.outing_id=outing.id and outing.slug='baratillo-caridad-regreso-funcion-solemne-2026'
  and position.position_code='processional_music' and position.status<>'archived';

insert into public.entities(entity_type,name,slug,summary,status)
select 'agent','Rafael González-Serna Bono','rafael-gonzalez-serna-bono',
       'Compositor y autor sevillano, creador de Coronación en el Rocío.','published'
where not exists(select 1 from public.entities where entity_type='agent' and slug='rafael-gonzalez-serna-bono');

insert into public.agents(entity_id,agent_kind,description)
select id,'person',summary from public.entities where entity_type='agent' and slug='rafael-gonzalez-serna-bono'
on conflict(entity_id) do nothing;

insert into public.entities(entity_type,name,slug,summary,status)
select 'march','Coronación en el Rocío','coronacion-en-el-rocio-rafael-gonzalez-serna',
       'Marcha procesional de Rafael González-Serna Bono, con arreglo de Jesús Joaquín Espinosa de los Monteros Pérez.','published'
where not exists(select 1 from public.entities where entity_type='march' and slug='coronacion-en-el-rocio-rafael-gonzalez-serna');

insert into public.marches(entity_id,music_type,work_type,description,eligible_for_daily)
select id,'Banda de Música','Marcha procesional',summary,false
from public.entities where entity_type='march' and slug='coronacion-en-el-rocio-rafael-gonzalez-serna'
on conflict(entity_id) do nothing;

with seed(author_slug,author_role,note) as (values
  ('rafael-gonzalez-serna-bono','composer','Composición de Rafael González-Serna Bono.'),
  ('jesus-joaquin-espinosa-de-los-monteros-perez','arranger','Arreglo de Jesús Joaquín Espinosa de los Monteros Pérez.')
)
insert into public.march_authors(march_entity_id,agent_entity_id,author_role,notes,status)
select march.id,author.id,seed.author_role,seed.note,'published'
from seed
join public.entities march on march.entity_type='march' and march.slug='coronacion-en-el-rocio-rafael-gonzalez-serna'
join public.entities author on author.entity_type='agent' and author.slug=seed.author_slug
where not exists(select 1 from public.march_authors existing where existing.march_entity_id=march.id and existing.agent_entity_id=author.id and existing.author_role=seed.author_role and existing.status<>'archived');

insert into public.sources(name,url,source_type,author_or_publisher,publication_date,accessed_at,notes)
select 'Repertorio interpretado · Caridad del Baratillo 2026',null,'social_media',
       'Sociedad Filarmónica Nuestra Señora del Carmen de Salteras',date '2026-11-23',date '2026-11-23',
       'Lámina oficial del repertorio interpretado en el traslado de regreso de María Santísima de la Caridad en su Soledad. Documenta nueve obras en el orden publicado.'
where not exists(select 1 from public.sources where name='Repertorio interpretado · Caridad del Baratillo 2026' and author_or_publisher='Sociedad Filarmónica Nuestra Señora del Carmen de Salteras');

with refs as (
  select source.id source_id,outing.id outing_id
  from public.sources source cross join public.outings outing
  where source.name='Repertorio interpretado · Caridad del Baratillo 2026'
    and outing.slug='baratillo-caridad-regreso-funcion-solemne-2026'
)
insert into public.source_links(source_id,outing_id,scope,notes)
select source_id,outing_id,'Repertorio interpretado','Fuente directa de la cruceta y de su orden.' from refs
where not exists(select 1 from public.source_links existing where existing.source_id=refs.source_id and existing.outing_id=refs.outing_id);

with refs as (
  select source.id source_id,assignment.id assignment_id
  from public.sources source
  join public.outings outing on outing.slug='baratillo-caridad-regreso-funcion-solemne-2026'
  join public.outing_music_positions position on position.outing_id=outing.id and position.position_code='processional_music' and position.status<>'archived'
  join public.outing_music_assignments assignment on assignment.music_position_id=position.id and assignment.status<>'archived'
  join public.entities band on band.id=assignment.band_entity_id and band.slug='carmen-de-salteras'
  where source.name='Repertorio interpretado · Caridad del Baratillo 2026'
)
insert into public.source_links(source_id,outing_music_assignment_id,scope,notes)
select source_id,assignment_id,'Acompañamiento musical','Vincula la cruceta con Carmen de Salteras en el traslado de regreso.' from refs
where not exists(select 1 from public.source_links existing where existing.source_id=refs.source_id and existing.outing_music_assignment_id=refs.assignment_id);

with refs as (
  select source.id source_id,march.id march_id
  from public.sources source
  cross join public.entities march
  where source.name='Spotify · Coronación en el Rocío'
    and march.entity_type='march' and march.slug='coronacion-en-el-rocio-rafael-gonzalez-serna'
)
insert into public.source_links(source_id,entity_id,scope,notes)
select source_id,march_id,'Edición digital','Fuente discográfica existente de la obra.' from refs
where not exists(select 1 from public.source_links existing where existing.source_id=refs.source_id and existing.entity_id=refs.march_id);

with source as (
  select id from public.sources where name='Repertorio interpretado · Caridad del Baratillo 2026'
    and author_or_publisher='Sociedad Filarmónica Nuestra Señora del Carmen de Salteras' order by created_at limit 1
)
insert into public.musical_repertoires(slug,outing_id,band_entity_id,step_entity_id,source_id,title,display_name,repertoire_kind,notes,primary_color,accent_color,status)
select 'caridad-baratillo-carmen-salteras-2026',outing.id,band.id,step.id,source.id,
       'María Santísima de la Caridad en su Soledad · 22 de noviembre de 2026 · Carmen de Salteras',
       'María Santísima de la Caridad en su Soledad','performed',
       'Repertorio interpretado: nueve obras y nueve interpretaciones. Se conserva el orden publicado en la lámina oficial, desde La Caridad del Arenal hasta Coronación en el Rocío.',
       '#2E1B12','#C79A24','published'
from public.outings outing
join public.entities band on band.entity_type='band' and band.slug='carmen-de-salteras'
join public.entities step on step.entity_type='step' and step.slug='paso-de-palio-de-maria-santisima-de-la-caridad'
cross join source
where outing.slug='baratillo-caridad-regreso-funcion-solemne-2026'
on conflict(slug) do update set outing_id=excluded.outing_id,band_entity_id=excluded.band_entity_id,step_entity_id=excluded.step_entity_id,
  source_id=excluded.source_id,title=excluded.title,display_name=excluded.display_name,repertoire_kind=excluded.repertoire_kind,notes=excluded.notes,
  primary_color=excluded.primary_color,accent_color=excluded.accent_color,status=excluded.status,updated_at=now();

with seed(display_order,march_slug,display_title,source_credit) as (values
  (1,'marcha-la-caridad-del-arenal','La Caridad del Arenal','Jesús Joaquín Espinosa de los Monteros Pérez'),
  (2,'marcha-nanas-del-baratillo','Nanas del Baratillo','David Hurtado Torres'),
  (3,'bendita-seas-dulce-madre-del-amparo-romero-gonzalez','¡Bendita seas, dulce Madre del Amparo!','Borja Romero González'),
  (4,'pasa-la-virgen-macarena-pedro-gamez-laserna','Pasa la Virgen Macarena','Pedro Gámez Laserna'),
  (5,'marcha-caridad','Caridad','Fernando Oliveras González y Pedro Gámez Laserna'),
  (6,'cuando-pasa-la-esperanza-lopez-gandara','Cuando pasa la Esperanza','Cristóbal López Gándara'),
  (7,'bajo-tu-amparo-ruben-jordan-flores','Bajo tu Amparo','Rubén Jordán Flores'),
  (8,'la-esperanza-de-triana-manuel-lopez-farfan','La Esperanza de Triana','Manuel López Farfán'),
  (9,'coronacion-en-el-rocio-rafael-gonzalez-serna','Coronación en el Rocío','Jesús Joaquín Espinosa de los Monteros Pérez y Rafael González Serna')
)
insert into public.musical_repertoire_entries(repertoire_id,march_entity_id,display_title,source_credit,performance_count,display_order,notes)
select repertoire.id,march.id,seed.display_title,seed.source_credit,1,seed.display_order,
       'Posición en el orden documentado por la lámina oficial.'
from seed join public.musical_repertoires repertoire on repertoire.slug='caridad-baratillo-carmen-salteras-2026'
join public.entities march on march.entity_type='march' and march.slug=seed.march_slug
on conflict(repertoire_id,march_entity_id) do update set display_title=excluded.display_title,source_credit=excluded.source_credit,
  performance_count=excluded.performance_count,display_order=excluded.display_order,notes=excluded.notes;

do $postflight$
declare v_repertoire uuid;
begin
  select id into strict v_repertoire from public.musical_repertoires where slug='caridad-baratillo-carmen-salteras-2026';
  if (select count(*) from public.musical_repertoire_entries where repertoire_id=v_repertoire) <> 9 then raise exception 'La cruceta debe contener nueve obras'; end if;
  if (select count(distinct march_entity_id) from public.musical_repertoire_entries where repertoire_id=v_repertoire) <> 9 then raise exception 'La cruceta debe conservar nueve obras distintas'; end if;
  if (select sum(performance_count) from public.musical_repertoire_entries where repertoire_id=v_repertoire) <> 9 then raise exception 'La cruceta debe sumar nueve interpretaciones'; end if;
  if exists(select 1 from public.musical_repertoire_entries where repertoire_id=v_repertoire and performance_count<>1) then raise exception 'La fuente no contiene multiplicidades'; end if;
  if (select count(*) from public.musical_repertoire_entries entry join public.entities march on march.id=entry.march_entity_id where entry.repertoire_id=v_repertoire and entry.display_order=1 and march.slug='marcha-la-caridad-del-arenal') <> 1 then raise exception 'La Caridad del Arenal debe abrir la cruceta'; end if;
  if (select count(*) from public.musical_repertoire_entries entry join public.entities march on march.id=entry.march_entity_id where entry.repertoire_id=v_repertoire and entry.display_order=9 and march.slug='coronacion-en-el-rocio-rafael-gonzalez-serna') <> 1 then raise exception 'Coronación en el Rocío debe cerrar la cruceta'; end if;
  if (select count(*) from public.march_authors author join public.entities march on march.id=author.march_entity_id where march.slug='coronacion-en-el-rocio-rafael-gonzalez-serna' and author.status='published' and author.author_role in ('composer','arranger')) <> 2 then raise exception 'Coronación en el Rocío debe conservar composición y arreglo'; end if;
  if (select count(*) from public.musical_repertoires repertoire
      join public.outings outing on outing.id=repertoire.outing_id
      join public.entities band on band.id=repertoire.band_entity_id
      join public.entities step on step.id=repertoire.step_entity_id
      join public.outing_music_positions position on position.outing_id=outing.id and position.step_entity_id=step.id and position.position_code='processional_music' and position.status<>'archived'
      join public.outing_music_assignments assignment on assignment.music_position_id=position.id and assignment.band_entity_id=band.id and assignment.status<>'archived'
      where repertoire.id=v_repertoire and outing.outing_date=date '2026-11-22' and outing.event_status='held'
        and band.slug='carmen-de-salteras' and step.slug='paso-de-palio-de-maria-santisima-de-la-caridad'
        and assignment.participation_mode='full_route' and repertoire.primary_color='#2E1B12' and repertoire.accent_color='#C79A24') <> 1 then
    raise exception 'La identidad fecha-Banda-paso-posición-paleta no es íntegra';
  end if;
  if exists(select 1 from public.musical_repertoire_entries entry left join public.march_authors author on author.march_entity_id=entry.march_entity_id and author.status='published' where entry.repertoire_id=v_repertoire group by entry.id having count(author.id)=0) then raise exception 'Todas las obras deben conservar al menos una autoría publicada'; end if;
end
$postflight$;

commit;
