-- HC-006 · Conversión de public.accompaniments (legado) a la capa canónica de salida.
-- PLAN DE SOLO LECTURA. Devuelve exactamente las filas que crearía candidate.sql.
--
-- Selección: filas heredadas publicadas cuya salida publicada NO tiene todavía
-- ninguna posición musical publicada. Las salidas que ya tienen música curada
-- (33 cubiertas + 3 solo salida + 1 parcial) quedan fuera para no alterar
-- información existente.

with legacy as (
  select a.*, o.outing_type, o.status as outing_status
  from public.accompaniments a
  join public.outings o on o.id = a.outing_id
  where a.status = 'published'
    and o.status = 'published'
    and not exists (
      select 1 from public.outing_music_positions p
      where p.outing_id = a.outing_id and p.status = 'published'
    )
), coded as (
  select l.*,
    case
      when l.position ~* '^(cruz de gu[ií]a|tras la cruz de gu[ií]a)' then 'cross_guide'
      when l.position ~* '^abriendo' then 'opening'
      when l.position ~* '^(ante|delante)' then 'before_step'
      when l.position ~* '^tras' and l.outing_type ilike 'procesi%n de gloria' then 'behind_glory'
      when l.position ~* '^tras' then 'behind_step'
      else 'processional_music'
    end as position_code
  from legacy l
), ranked as (
  select c.*,
    case c.position_code
      when 'cross_guide' then 10
      when 'opening' then 10
      when 'before_step' then 20
      when 'behind_step' then case when c.position ~* 'palio|virgen|nuestra se[ñn]ora|mar[ií]a sant' then 40 else 30 end
      when 'behind_glory' then 40
      else 50
    end as position_rank
  from coded c
)
select
  md5('hc006-legacy-position:' || r.id::text)::uuid as position_id,
  md5('hc006-legacy-assignment:' || r.id::text)::uuid as assignment_id,
  r.id as legacy_id,
  r.outing_id,
  r.step_entity_id,
  r.position_code,
  r.position as position_label,
  row_number() over (partition by r.outing_id order by r.position_rank, r.created_at, r.id)::int as sequence_no,
  r.band_entity_id,
  r.notes
from ranked r
order by r.outing_id, sequence_no;
