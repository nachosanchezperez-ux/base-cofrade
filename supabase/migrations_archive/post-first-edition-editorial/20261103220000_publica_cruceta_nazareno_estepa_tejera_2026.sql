-- Hilo Cofrade · repertorio interpretado de Nuestro Padre Jesús Nazareno
-- Estepa · 2 de noviembre de 2026 · Banda del Maestro Tejera
-- La fuente directa documenta 21 obras, sin multiplicidades ni orden cronológico.

begin;

do $preflight$
begin
  if (select count(*) from public.outings where slug='estepa-jesus-nazareno-2026-11-02' and outing_date=date '2026-11-02' and status='published') <> 1 then
    raise exception 'La salida de Jesús Nazareno de Estepa no es unívoca';
  end if;
  if (select count(*) from public.entities where entity_type='brotherhood' and slug='jesus-nazareno-estepa' and status='published') <> 1 then
    raise exception 'La Hermandad de Jesús Nazareno de Estepa no es unívoca';
  end if;
  if (select count(*) from public.entities where entity_type='band' and slug='banda-de-musica-del-maestro-tejera' and status='published') <> 1 then
    raise exception 'Maestro Tejera no es unívoca';
  end if;
  if (select count(*) from public.entities where entity_type='step' and slug='paso-jesus-nazareno-estepa' and status='published') <> 1 then
    raise exception 'El paso de Jesús Nazareno de Estepa no es unívoco';
  end if;
end
$preflight$;

update public.outings
set event_status='held', updated_at=now()
where slug='estepa-jesus-nazareno-2026-11-02';

update public.outing_music_positions position
set step_entity_id=step.id,
    position_label='Tras el paso de Nuestro Padre Jesús Nazareno en el regreso',
    notes='Acompañamiento musical documentado únicamente para el regreso desde el Cementerio Municipal hasta San Sebastián.',
    updated_at=now()
from public.outings outing
join public.entities step on step.entity_type='step' and step.slug='paso-jesus-nazareno-estepa'
where position.outing_id=outing.id and outing.slug='estepa-jesus-nazareno-2026-11-02'
  and position.position_code='processional_music' and position.status<>'archived';

with seed(name,slug,summary) as (values
  ('Frédéric François Chopin','frederic-francois-chopin','Compositor de la Marcha fúnebre documentada en repertorios procesionales.'),
  ('Eduardo López Juarranz','eduardo-lopez-juarranz','Compositor de la marcha procesional Piedad.'),
  ('Enrique Báez Centella','enrique-baez-centella','Compositor de la marcha Virgen de las Angustias.'),
  ('Enrico Petrella','enrico-petrella','Compositor de la ópera Ione, cuya marcha fúnebre forma parte del repertorio procesional.'),
  ('Mariano San Miguel Urcelay','mariano-san-miguel-urcelay','Compositor de la marcha fúnebre Mektub.'),
  ('Charles François Gounod','charles-francois-gounod','Compositor de Juana de Arco, adaptada al repertorio procesional para banda.')
)
insert into public.entities(entity_type,name,slug,summary,status)
select 'agent',name,slug,summary,'published' from seed
where not exists(select 1 from public.entities existing where existing.entity_type='agent' and existing.slug=seed.slug);

with seed(slug) as (values
  ('frederic-francois-chopin'),('eduardo-lopez-juarranz'),('enrique-baez-centella'),
  ('enrico-petrella'),('mariano-san-miguel-urcelay'),('charles-francois-gounod')
)
insert into public.agents(entity_id,agent_kind,description)
select entity.id,'person',entity.summary from seed
join public.entities entity on entity.entity_type='agent' and entity.slug=seed.slug
on conflict(entity_id) do nothing;

with seed(slug,title,summary,work_type) as (values
  ('miserere-popular','Miserere','Pieza de tradición popular documentada por Maestro Tejera en el repertorio de Jesús Nazareno de Estepa de 2026.','Marcha procesional'),
  ('marcha-funebre-frederic-chopin','Marcha Fúnebre','Marcha fúnebre de Frédéric François Chopin interpretada en repertorio procesional.','Adaptación'),
  ('jesus-de-las-penas-antonio-pantion','Jesús de las Penas','Marcha procesional de Antonio Pantión Pérez.','Marcha procesional'),
  ('cristo-buena-muerte-jose-albero','Cristo de la Buena Muerte','Marcha procesional de José Albero Francés.','Marcha procesional'),
  ('jesus-cruz-hombro-jose-manuel-delgado','Jesús con la Cruz al Hombro','Marcha procesional de José Manuel Delgado Rodríguez.','Marcha procesional'),
  ('piedad-eduardo-lopez-juarranz','Piedad','Marcha procesional de Eduardo López Juarranz.','Marcha procesional'),
  ('virgen-angustias-enrique-baez','Virgen de las Angustias','Marcha procesional de Enrique Báez Centella.','Marcha procesional'),
  ('nuestra-senora-montserrat-pedro-brana','Nuestra Señora de Montserrat','Marcha procesional de Pedro Braña Martínez.','Marcha procesional'),
  ('quinta-angustia-jose-font-marimont','Quinta Angustia','Marcha procesional de José Font y Marimont.','Marcha procesional'),
  ('memoria-eterna-german-alvarez-beigbeder','Memoria Eterna','Marcha procesional de Germán Álvarez Beigbeder.','Marcha procesional'),
  ('ione-enrico-petrella','Ione','Marcha fúnebre procedente de la ópera Ione, de Enrico Petrella.','Adaptación'),
  ('mektub-mariano-san-miguel','Mektub','Marcha fúnebre de Mariano San Miguel Urcelay.','Marcha procesional'),
  ('juana-arco-charles-gounod','Juana de Arco','Marcha fúnebre de Charles François Gounod incorporada al repertorio procesional.','Adaptación')
)
insert into public.entities(entity_type,name,slug,summary,status)
select 'march',title,slug,summary,'published' from seed
where not exists(select 1 from public.entities existing where existing.entity_type='march' and existing.slug=seed.slug);

with seed(slug,work_type) as (values
  ('miserere-popular','Marcha procesional'),
  ('marcha-funebre-frederic-chopin','Adaptación'),
  ('jesus-de-las-penas-antonio-pantion','Marcha procesional'),
  ('cristo-buena-muerte-jose-albero','Marcha procesional'),
  ('jesus-cruz-hombro-jose-manuel-delgado','Marcha procesional'),
  ('piedad-eduardo-lopez-juarranz','Marcha procesional'),
  ('virgen-angustias-enrique-baez','Marcha procesional'),
  ('nuestra-senora-montserrat-pedro-brana','Marcha procesional'),
  ('quinta-angustia-jose-font-marimont','Marcha procesional'),
  ('memoria-eterna-german-alvarez-beigbeder','Marcha procesional'),
  ('ione-enrico-petrella','Adaptación'),
  ('mektub-mariano-san-miguel','Marcha procesional'),
  ('juana-arco-charles-gounod','Adaptación')
)
insert into public.marches(entity_id,music_type,work_type,description,eligible_for_daily)
select entity.id,'Banda de Música',seed.work_type,entity.summary,false
from seed join public.entities entity on entity.entity_type='march' and entity.slug=seed.slug
on conflict(entity_id) do nothing;

with seed(march_slug,author_slug) as (values
  ('marcha-funebre-frederic-chopin','frederic-francois-chopin'),
  ('jesus-de-las-penas-antonio-pantion','antonio-pantion-perez'),
  ('cristo-buena-muerte-jose-albero','jose-albero-frances'),
  ('jesus-cruz-hombro-jose-manuel-delgado','jose-manuel-delgado-rodriguez'),
  ('piedad-eduardo-lopez-juarranz','eduardo-lopez-juarranz'),
  ('virgen-angustias-enrique-baez','enrique-baez-centella'),
  ('nuestra-senora-montserrat-pedro-brana','pedro-brana-martinez'),
  ('quinta-angustia-jose-font-marimont','jose-font-y-marimont'),
  ('memoria-eterna-german-alvarez-beigbeder','german-alvarez-beigbeder'),
  ('ione-enrico-petrella','enrico-petrella'),
  ('mektub-mariano-san-miguel','mariano-san-miguel-urcelay'),
  ('juana-arco-charles-gounod','charles-francois-gounod')
)
insert into public.march_authors(march_entity_id,agent_entity_id,author_role,notes,status)
select march.id,author.id,'composer','Autoría publicada por la Banda del Maestro Tejera.','published'
from seed join public.entities march on march.entity_type='march' and march.slug=seed.march_slug
join public.entities author on author.entity_type='agent' and author.slug=seed.author_slug
where not exists(select 1 from public.march_authors existing where existing.march_entity_id=march.id and existing.agent_entity_id=author.id and existing.author_role='composer' and existing.status<>'archived');

insert into public.sources(name,url,source_type,author_or_publisher,publication_date,accessed_at,notes)
select 'Repertorio musical · Jesús Nazareno de Estepa 2026',null,'social_media',
       'Banda de Música del Maestro Tejera',date '2026-11-02',date '2026-11-03',
       'Lámina oficial. Documenta 21 obras, sin multiplicidades; no documenta puntos exactos de interpretación ni orden cronológico.'
where not exists(select 1 from public.sources where name='Repertorio musical · Jesús Nazareno de Estepa 2026' and author_or_publisher='Banda de Música del Maestro Tejera');

with refs as (
  select source.id source_id,outing.id outing_id,assignment.id assignment_id
  from public.sources source
  join public.outings outing on outing.slug='estepa-jesus-nazareno-2026-11-02'
  join public.outing_music_positions position on position.outing_id=outing.id and position.status<>'archived'
  join public.outing_music_assignments assignment on assignment.music_position_id=position.id and assignment.status<>'archived'
  join public.entities band on band.id=assignment.band_entity_id and band.slug='banda-de-musica-del-maestro-tejera'
  where source.name='Repertorio musical · Jesús Nazareno de Estepa 2026'
)
insert into public.source_links(source_id,outing_id,scope,notes)
select source_id,outing_id,'Repertorio interpretado','Fuente directa de la cruceta publicada por la Banda.' from refs
where not exists(select 1 from public.source_links existing where existing.source_id=refs.source_id and existing.outing_id=refs.outing_id);

with refs as (
  select source.id source_id,assignment.id assignment_id
  from public.sources source
  join public.outings outing on outing.slug='estepa-jesus-nazareno-2026-11-02'
  join public.outing_music_positions position on position.outing_id=outing.id and position.status<>'archived'
  join public.outing_music_assignments assignment on assignment.music_position_id=position.id and assignment.status<>'archived'
  join public.entities band on band.id=assignment.band_entity_id and band.slug='banda-de-musica-del-maestro-tejera'
  where source.name='Repertorio musical · Jesús Nazareno de Estepa 2026'
)
insert into public.source_links(source_id,outing_music_assignment_id,scope,notes)
select source_id,assignment_id,'Acompañamiento musical','Vincula la cruceta con Maestro Tejera en el regreso desde el Cementerio Municipal.' from refs
where not exists(select 1 from public.source_links existing where existing.source_id=refs.source_id and existing.outing_music_assignment_id=refs.assignment_id);

with source as (
  select id from public.sources where name='Repertorio musical · Jesús Nazareno de Estepa 2026'
    and author_or_publisher='Banda de Música del Maestro Tejera' order by created_at limit 1
)
insert into public.musical_repertoires(slug,outing_id,band_entity_id,step_entity_id,source_id,title,repertoire_kind,notes,primary_color,accent_color,status)
select 'jesus-nazareno-estepa-maestro-tejera-2026',outing.id,band.id,step.id,source.id,
       'Jesús Nazareno de Estepa · 2 de noviembre de 2026 · Maestro Tejera','performed',
       'Repertorio interpretado: 21 obras y 21 interpretaciones. No hay multiplicidades expresas; la disposición de la lámina no se presenta como orden procesional. El acompañamiento corresponde al regreso desde el Cementerio Municipal.',
       '#5A3D68','#C9B38A','published'
from public.outings outing
join public.entities band on band.entity_type='band' and band.slug='banda-de-musica-del-maestro-tejera'
join public.entities step on step.entity_type='step' and step.slug='paso-jesus-nazareno-estepa'
cross join source
where outing.slug='estepa-jesus-nazareno-2026-11-02'
on conflict(slug) do update set outing_id=excluded.outing_id,band_entity_id=excluded.band_entity_id,step_entity_id=excluded.step_entity_id,
  source_id=excluded.source_id,title=excluded.title,repertoire_kind=excluded.repertoire_kind,notes=excluded.notes,
  primary_color=excluded.primary_color,accent_color=excluded.accent_color,status=excluded.status,updated_at=now();

with seed(display_order,march_slug,display_title,source_credit) as (values
  (1,'miserere-popular','Miserere','Popular'),
  (2,'marcha-funebre-frederic-chopin','Marcha Fúnebre','Frédéric Chopin'),
  (3,'jesus-de-las-penas-antonio-pantion','Jesús de las Penas','Antonio Pantión'),
  (4,'el-cristo-de-la-salud-lopez-farfan-1939','El Cristo de la Salud','Manuel López Farfán'),
  (5,'mater-mea-ricardo-dorado','Mater Mea','Ricardo Dorado'),
  (6,'cristo-buena-muerte-jose-albero','Cristo de la Buena Muerte','José Albero'),
  (7,'jesus-cruz-hombro-jose-manuel-delgado','Jesús con la Cruz al Hombro','José Manuel Delgado'),
  (8,'piedad-eduardo-lopez-juarranz','Piedad','Eduardo Juarranz'),
  (9,'virgen-angustias-enrique-baez','Virgen de las Angustias','Enrique Báez'),
  (10,'nuestra-senora-montserrat-pedro-brana','Nuestra Señora de Montserrat','Pedro Braña'),
  (11,'virgen-del-valle-vicente-gomez-zarzuela','Virgen del Valle','Gómez Zarzuela'),
  (12,'quinta-angustia-jose-font-marimont','Quinta Angustia','Font Marimont'),
  (13,'la-madruga-abel-moreno','La Madrugá','Abel Moreno'),
  (14,'memoria-eterna-german-alvarez-beigbeder','Memoria Eterna','Germán Álvarez Beigbeder'),
  (15,'ione-enrico-petrella','Ione','Enrico Petrella'),
  (16,'mektub-mariano-san-miguel','Mektub','Mariano San Miguel'),
  (17,'juana-arco-charles-gounod','Juana de Arco','Charles François Gounod'),
  (18,'miradlo-en-la-cruz-david-hurtado','¡Miradlo en la Cruz!','David Hurtado'),
  (19,'solea-dame-la-mano-manuel-font-de-anta','Soleá dame la mano','Manuel Font de Anta'),
  (20,'marcha-tus-dolores-son-mis-penas','Tus Dolores son mis penas','Antonio Pantión'),
  (21,'amarguras-manuel-font-de-anta','Amarguras','Manuel Font de Anta')
)
insert into public.musical_repertoire_entries(repertoire_id,march_entity_id,display_title,source_credit,performance_count,display_order,notes)
select repertoire.id,march.id,seed.display_title,seed.source_credit,1,seed.display_order,
       'Obra documentada por la fuente; la posición editorial no equivale a orden procesional.'
from seed join public.musical_repertoires repertoire on repertoire.slug='jesus-nazareno-estepa-maestro-tejera-2026'
join public.entities march on march.entity_type='march' and march.slug=seed.march_slug
on conflict(repertoire_id,march_entity_id) do update set display_title=excluded.display_title,source_credit=excluded.source_credit,
  performance_count=excluded.performance_count,display_order=excluded.display_order,notes=excluded.notes;

do $postflight$
declare v_repertoire uuid;
begin
  select id into strict v_repertoire from public.musical_repertoires where slug='jesus-nazareno-estepa-maestro-tejera-2026';
  if (select count(*) from public.musical_repertoire_entries where repertoire_id=v_repertoire) <> 21 then raise exception 'La cruceta debe contener 21 obras'; end if;
  if (select count(distinct march_entity_id) from public.musical_repertoire_entries where repertoire_id=v_repertoire) <> 21 then raise exception 'La cruceta debe conservar 21 obras distintas'; end if;
  if (select sum(performance_count) from public.musical_repertoire_entries where repertoire_id=v_repertoire) <> 21 then raise exception 'La cruceta debe sumar 21 interpretaciones'; end if;
  if exists(select 1 from public.musical_repertoire_entries where repertoire_id=v_repertoire and performance_count<>1) then raise exception 'La fuente no contiene multiplicidades'; end if;
  if (select count(*) from public.musical_repertoire_entries entry join public.entities march on march.id=entry.march_entity_id where entry.repertoire_id=v_repertoire and march.slug='cristo-buena-muerte-jose-albero') <> 1 then raise exception 'Cristo de la Buena Muerte debe resolver la obra de José Albero'; end if;
  if (select count(*) from public.musical_repertoire_entries entry join public.entities march on march.id=entry.march_entity_id where entry.repertoire_id=v_repertoire and march.slug='nuestra-senora-montserrat-pedro-brana') <> 1 then raise exception 'Nuestra Señora de Montserrat debe resolver la obra de Pedro Braña'; end if;
  if (select count(*) from public.musical_repertoires repertoire
      join public.outings outing on outing.id=repertoire.outing_id
      join public.entities band on band.id=repertoire.band_entity_id
      join public.entities step on step.id=repertoire.step_entity_id
      join public.outing_music_positions position on position.outing_id=outing.id and position.step_entity_id=step.id and position.status<>'archived'
      join public.outing_music_assignments assignment on assignment.music_position_id=position.id and assignment.band_entity_id=band.id and assignment.status<>'archived'
      where repertoire.id=v_repertoire and outing.outing_date=date '2026-11-02' and outing.event_status='held'
        and band.slug='banda-de-musica-del-maestro-tejera' and step.slug='paso-jesus-nazareno-estepa'
        and assignment.participation_mode='segment' and assignment.segment_start_label='Cementerio Municipal de Estepa'
        and assignment.segment_end_label='San Sebastián'
        and repertoire.primary_color='#5A3D68' and repertoire.accent_color='#C9B38A') <> 1 then
    raise exception 'La identidad fecha-Banda-paso-tramo-paleta no es íntegra';
  end if;
end
$postflight$;

commit;
