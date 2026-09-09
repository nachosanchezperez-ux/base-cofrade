-- Hilo Cofrade · relaciones de acontecimientos de la Purísima de La Algaba
-- Los acontecimientos se relacionan explícitamente con la Hermandad;
-- la coronación de 2004 también con la titular.

insert into public.entity_relations (
  source_entity_id, relation_type, target_entity_id, date_from, notes, status
)
select e.id,
       'involves',
       h.id,
       ev.event_date,
       'Acontecimiento histórico de la Hermandad de la Purísima de La Algaba.',
       'published'
from public.entities e
join public.events ev on ev.entity_id = e.id
join public.entities h on h.slug = 'purisima-de-la-algaba'
where e.slug in (
  'aprobacion-reglas-purisima-la-algaba-1870',
  'primera-romeria-purisima-la-algaba-1935',
  'coronacion-canonica-purisima-la-algaba-2004'
)
and not exists (
  select 1
  from public.entity_relations er
  where er.source_entity_id = e.id
    and er.relation_type = 'involves'
    and er.target_entity_id = h.id
);

insert into public.entity_relations (
  source_entity_id, relation_type, target_entity_id, date_from, notes, status
)
select e.id,
       'involves',
       i.id,
       date '2004-05-23',
       'La coronación canónica de 2004 involucra directamente a la titular.',
       'published'
from public.entities e
join public.entities i on i.slug = 'purisima-concepcion-maria-coronada-la-algaba'
where e.slug = 'coronacion-canonica-purisima-la-algaba-2004'
and not exists (
  select 1
  from public.entity_relations er
  where er.source_entity_id = e.id
    and er.relation_type = 'involves'
    and er.target_entity_id = i.id
);
