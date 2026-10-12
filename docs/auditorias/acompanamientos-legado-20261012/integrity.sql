-- Comprobaciones de integridad (solo lectura) para antes y después de candidate.sql.
-- Cada fila debe devolver 0 salvo los recuentos informativos (prefijo «info_»).

select 'legado_sin_cobertura_canonica' as check_name, count(*) as value
from public.accompaniments a
join public.outings o on o.id = a.outing_id
where a.status = 'published' and o.status = 'published'
  and not exists (
    select 1 from public.outing_music_positions p
    join public.outing_music_assignments s on s.music_position_id = p.id
    where p.outing_id = a.outing_id and s.band_entity_id = a.band_entity_id
      and p.status = 'published' and s.status = 'published'
  )
  and not exists (
    select 1 from public.music_accompaniment_periods m
    where m.status = 'published' and m.brotherhood_entity_id = o.brotherhood_entity_id
      and m.band_entity_id = a.band_entity_id
      and (a.step_entity_id is null or m.step_entity_id is null or m.step_entity_id = a.step_entity_id)
      and (m.year_from is null or m.year_from <= a.year)
      and (m.year_to is null or m.year_to >= a.year)
  )
union all
select 'posiciones_secuencia_duplicada', count(*) from (
  select outing_id, sequence_no from public.outing_music_positions group by 1, 2 having count(*) > 1
) x
union all
select 'asignaciones_sin_banda_publicada', count(*)
from public.outing_music_assignments s
join public.entities e on e.id = s.band_entity_id
where s.status = 'published' and e.status <> 'published'
union all
select 'convertidas_duplicadas_misma_salida_banda_etiqueta', count(*) from (
  select p.outing_id, s.band_entity_id, p.position_label
  from public.outing_music_positions p
  join public.outing_music_assignments s on s.music_position_id = p.id
  where p.status = 'published' and s.status = 'published'
  group by 1, 2, 3 having count(*) > 1
) y
union all
select 'info_posiciones_convertidas', count(*)
from public.outing_music_positions p
join public.accompaniments a on p.id = md5('hc006-legacy-position:' || a.id::text)::uuid
union all
select 'info_legado_total', count(*) from public.accompaniments;
