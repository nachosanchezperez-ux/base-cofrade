-- Solo para la base local desechable de CI. Todos los datos sintéticos se revierten.
begin;
do $$
declare
  outing_id uuid;
  result public.outings;
  rejected boolean := false;
begin
  insert into public.outings(outing_type,title,outing_date,status)
  values ('Procesión de Gloria','QA sintético cambio de fecha','2026-11-08','draft') returning id into outing_id;
  begin
    update public.outings set outing_date='2026-11-15' where id=outing_id;
  exception when others then
    if sqlerrm not like '%motivo y fuente%' then raise; end if;
    rejected := true;
  end;
  if not rejected then raise exception 'El cambio sin evidencia debe rechazarse'; end if;
  update public.outings set outing_date='2026-11-15',schedule_change='{"reason":"QA lluvia","sourceUrl":"https://example.org/qa"}' where id=outing_id;
  select * into result from public.outings where id=outing_id;
  if result.event_status <> 'rescheduled' or result.schedule_change->>'previousDate' <> '2026-11-08' or result.schedule_change->>'revision' <> '1' then raise exception 'Reprogramación incoherente'; end if;
  update public.outings set event_status='postponed' where id=outing_id;
  select * into result from public.outings where id=outing_id;
  if result.outing_date <> '2026-11-15'::date or result.schedule_change->>'revision' <> '2' then raise exception 'El aplazamiento debe conservar la convocatoria anterior'; end if;
  update public.outings set outing_date='2026-12-01' where id=outing_id;
  select * into result from public.outings where id=outing_id;
  if result.event_status <> 'rescheduled' or result.schedule_change->>'revision' <> '3' then raise exception 'Reanudación incoherente'; end if;
  raise notice 'PASS: cadena completa, seed y transiciones sobre el esquema real';
end;
$$;
rollback;
