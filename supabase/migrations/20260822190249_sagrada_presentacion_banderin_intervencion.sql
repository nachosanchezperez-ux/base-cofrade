-- Completa la ficha patrimonial del banderín de la Agrupación Musical Juvenil
-- Sagrada Presentación con la intervención documentada que permite mostrar el
-- mismo patrón relacional que el banderín de Las Cigarreras.

with refs as (
  select
    (select id from entities where slug = 'banderin-agrupacion-musical-juvenil-sagrada-presentacion' limit 1) as banderin_id,
    (select id from entities where slug = 'jesus-rosado-borja' limit 1) as agent_id
),
inserted_intervention as (
  insert into heritage_interventions (
    target_entity_id,
    agent_entity_id,
    discipline,
    element_name,
    intervention_type,
    phase,
    date_from,
    date_from_text,
    description,
    status
  )
  select
    refs.banderin_id,
    refs.agent_id,
    'Bordados',
    'Banderín',
    'Transformación',
    'Adaptación textil',
    date '2025-01-05',
    '2025',
    'Transformación del soporte primitivo a terciopelo morado e incorporación del nombre de la Agrupación conforme a su identidad corporativa.',
    'published'
  from refs
  where refs.banderin_id is not null
    and refs.agent_id is not null
    and not exists (
      select 1
      from heritage_interventions hi
      where hi.target_entity_id = refs.banderin_id
        and hi.agent_entity_id = refs.agent_id
        and hi.intervention_type = 'Transformación'
        and hi.date_from = date '2025-01-05'
    )
  returning id, target_entity_id
),
target_intervention as (
  select id, target_entity_id from inserted_intervention
  union all
  select hi.id, hi.target_entity_id
  from refs
  join heritage_interventions hi
    on hi.target_entity_id = refs.banderin_id
   and hi.agent_entity_id = refs.agent_id
   and hi.intervention_type = 'Transformación'
   and hi.date_from = date '2025-01-05'
  where not exists (select 1 from inserted_intervention)
  limit 1
)
insert into source_links (source_id, intervention_id, scope, notes)
select
  s.id,
  ti.id,
  'Patrimonio · Banderín · Transformación 2025',
  'Documenta la transformación ejecutada en los talleres de Jesús Rosado Borja.'
from target_intervention ti
join sources s
  on s.url = 'https://hermandaddesanbenito.net/insignias-de-la-hermandad/'
where not exists (
  select 1
  from source_links sl
  where sl.source_id = s.id
    and sl.intervention_id = ti.id
);
