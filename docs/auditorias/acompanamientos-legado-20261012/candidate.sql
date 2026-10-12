-- HC-006 · Conversión de public.accompaniments (legado) a la capa canónica de salida.
-- CANDIDATO NO APLICADO. Requiere autorización expresa del propietario.
--
-- Efecto: crea 60 posiciones (outing_music_positions) y 60 asignaciones
-- (outing_music_assignments) en 34 salidas publicadas que hoy no tienen música
-- propia. No modifica ni borra filas existentes; public.accompaniments queda intacta.
--
-- Propiedades:
--   * IDs deterministas (md5 del id heredado): repetir la ejecución no duplica nada;
--   * solo actúa sobre salidas sin posiciones publicadas: no altera música curada;
--   * participation_mode = 'unspecified': el legado no documentaba tramos;
--   * la etiqueta pública conserva literalmente el texto de posición heredado;
--   * comprobación final: si no se crean exactamente las filas previstas, se revierte todo.
--
-- Reversión: rollback.sql (borra únicamente los IDs deterministas creados aquí).

do $convert$
declare
  planned int;
  positions_created int;
  assignments_created int;
begin
  create temp table hc006_plan on commit drop as
  with legacy as (
    select a.*, o.outing_type
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
  from ranked r;

  select count(*) into planned from hc006_plan;

  insert into public.outing_music_positions (id, outing_id, step_entity_id, position_code, position_label, sequence_no, status)
  select position_id, outing_id, step_entity_id, position_code, position_label, sequence_no, 'published'
  from hc006_plan
  on conflict (id) do nothing;
  get diagnostics positions_created = row_count;

  insert into public.outing_music_assignments (id, music_position_id, band_entity_id, participation_mode, sequence_no, notes, status)
  select assignment_id, position_id, band_entity_id, 'unspecified', 1, notes, 'published'
  from hc006_plan
  on conflict (id) do nothing;
  get diagnostics assignments_created = row_count;

  if positions_created <> planned or assignments_created <> planned then
    raise exception 'HC-006: se esperaban % posiciones y asignaciones; se crearían % y %. Se revierte.',
      planned, positions_created, assignments_created;
  end if;

  raise notice 'HC-006: % posiciones y % asignaciones creadas.', positions_created, assignments_created;
end $convert$;
