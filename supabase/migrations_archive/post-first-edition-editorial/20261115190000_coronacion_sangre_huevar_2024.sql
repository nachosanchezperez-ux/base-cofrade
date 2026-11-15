-- Vírgenes Coronadas · Coronación canónica de María Santísima de la Sangre de
-- Huévar del Aljarafe (8 de junio de 2024).
-- Autorizado por Nacho el 15/11/2026 («Incorpora: 8 de junio de 2024.
-- Coronación de la Sangre de Huévar»). Solo DML. Idempotente.
-- Aplicado en producción el 15/11/2026 (hora de Madrid) por SQL directo.
--
-- Fuentes:
--   - Archidiócesis de Sevilla (agenda): 8/6/2024, 20:00, preside el arzobispo
--     José Ángel Saiz Meneses.
--   - esRadio (7/6/2024): plaza de España de Huévar del Aljarafe.
-- Constancia posterior: la hermandad ya figura en Hilo como «de la Sangre
-- Coronada» y la confirmación de Nacho. Se carga como celebrada (held).
--
-- La imagen no tenía ficha en Hilo: se crea publicada (se sirve noindex
-- mientras sea escasa) y se vincula como titular de la Hermandad de la Vera
-- Cruz y María Santísima de la Sangre Coronada.
--
-- Recuperación:
--   delete from public.entities where id in ('c0261115-1a00-4000-8000-000000000001',
--                                            'c0261115-c0e1-4000-8000-000000000001');

begin;

insert into public.entities (id, entity_type, name, slug, status)
select 'c0261115-1a00-4000-8000-000000000001', 'image', 'María Santísima de la Sangre',
       'maria-santisima-sangre-huevar-del-aljarafe', 'published'
where not exists (select 1 from public.entities e
                  where e.id = 'c0261115-1a00-4000-8000-000000000001'
                     or e.slug = 'maria-santisima-sangre-huevar-del-aljarafe');

insert into public.images (entity_id, image_type)
select 'c0261115-1a00-4000-8000-000000000001', 'Virgen'
where exists (select 1 from public.entities where id = 'c0261115-1a00-4000-8000-000000000001')
  and not exists (select 1 from public.images where entity_id = 'c0261115-1a00-4000-8000-000000000001');

insert into public.brotherhood_images (brotherhood_entity_id, image_entity_id, relation_type, status)
select 'd7a8f7e9-df25-40bd-b62b-d2873717a51f', 'c0261115-1a00-4000-8000-000000000001', 'titular', 'published'
where exists (select 1 from public.images where entity_id = 'c0261115-1a00-4000-8000-000000000001')
  and not exists (select 1 from public.brotherhood_images
                  where brotherhood_entity_id = 'd7a8f7e9-df25-40bd-b62b-d2873717a51f'
                    and image_entity_id = 'c0261115-1a00-4000-8000-000000000001');

insert into public.entities (id, entity_type, name, slug, status)
select 'c0261115-c0e1-4000-8000-000000000001', 'event',
       'Coronación canónica de María Santísima de la Sangre de Huévar del Aljarafe',
       'coronacion-canonica-sangre-huevar-2024', 'published'
where not exists (select 1 from public.entities e
                  where e.id = 'c0261115-c0e1-4000-8000-000000000001'
                     or e.slug = 'coronacion-canonica-sangre-huevar-2024');

insert into public.events (entity_id, event_type, event_date, event_date_text, event_category, event_status,
                           brotherhood_entity_id, municipality_id, location_text, description)
select 'c0261115-c0e1-4000-8000-000000000001', 'Coronación canónica', date '2024-06-08', '8 de junio de 2024',
       'historical', 'held', 'd7a8f7e9-df25-40bd-b62b-d2873717a51f', m.id, 'Plaza de España',
       'Coronación canónica de María Santísima de la Sangre de Huévar del Aljarafe.'
from public.municipalities m
where m.slug = 'huevar-del-aljarafe'
  and exists (select 1 from public.entities where id = 'c0261115-c0e1-4000-8000-000000000001')
  and not exists (select 1 from public.events where entity_id = 'c0261115-c0e1-4000-8000-000000000001');

insert into public.entity_relations (source_entity_id, relation_type, target_entity_id, status, notes)
select 'c0261115-c0e1-4000-8000-000000000001', 'involves', 'c0261115-1a00-4000-8000-000000000001', 'published', 'Imagen coronada'
where exists (select 1 from public.events where entity_id = 'c0261115-c0e1-4000-8000-000000000001')
  and not exists (select 1 from public.entity_relations
                  where source_entity_id = 'c0261115-c0e1-4000-8000-000000000001'
                    and target_entity_id = 'c0261115-1a00-4000-8000-000000000001'
                    and relation_type = 'involves');

insert into public.entity_relations (source_entity_id, relation_type, target_entity_id, status, notes)
select 'c0261115-c0e1-4000-8000-000000000001', 'officiated_by', p.id, 'published', 'Prelado que impuso la corona'
from public.entities p
where p.slug = 'jose-angel-saiz-meneses' and p.entity_type = 'agent'
  and exists (select 1 from public.events where entity_id = 'c0261115-c0e1-4000-8000-000000000001')
  and not exists (select 1 from public.entity_relations r
                  where r.source_entity_id = 'c0261115-c0e1-4000-8000-000000000001'
                    and r.target_entity_id = p.id and r.relation_type = 'officiated_by');

with new_sources(name, url, source_type, author) as (values
  ('Coronación de la Virgen de la Sangre (Huévar del Aljarafe)', 'https://www.archisevilla.org/evento/coronacion-de-la-virgen-de-la-sangre-huevar-del-aljarafe/', 'Fuente diocesana oficial', 'Archidiócesis de Sevilla'),
  ('Cajón de sastre: Coronación canónica de la Virgen de la Sangre de Huévar', 'https://esradio.libertaddigital.com/fonoteca/2024-06-07/cajon-de-sastre-coronacion-canonica-de-la-virgen-de-la-sangre-de-huevar-7134767.html', 'Prensa', 'esRadio')
)
insert into public.sources (name, url, source_type, author_or_publisher, accessed_at)
select s.name, s.url, s.source_type, s.author, date '2026-11-15'
from new_sources s
where not exists (select 1 from public.sources x where x.url = s.url);

with event_sources(url) as (values
  ('https://www.archisevilla.org/evento/coronacion-de-la-virgen-de-la-sangre-huevar-del-aljarafe/'),
  ('https://esradio.libertaddigital.com/fonoteca/2024-06-07/cajon-de-sastre-coronacion-canonica-de-la-virgen-de-la-sangre-de-huevar-7134767.html')
)
insert into public.source_links (source_id, entity_id, scope, notes)
select s.id, 'c0261115-c0e1-4000-8000-000000000001', 'Vírgenes Coronadas · fecha y prelado', null
from event_sources es
join lateral (select id from public.sources where url = es.url order by created_at limit 1) s on true
where exists (select 1 from public.events where entity_id = 'c0261115-c0e1-4000-8000-000000000001')
  and not exists (select 1 from public.source_links l
                  where l.source_id = s.id and l.entity_id = 'c0261115-c0e1-4000-8000-000000000001');

commit;
