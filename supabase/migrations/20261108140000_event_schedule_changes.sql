-- hc-despliegue: tolerante
-- PREPARADA PARA REVISIÓN. No aplicar sin autorización. Sin cambios editoriales.
begin;
alter table public.outings add column schedule_change jsonb not null default '{}'::jsonb;
alter table public.cult_occurrences add column schedule_change jsonb not null default '{}'::jsonb;
alter table public.events add column schedule_change jsonb not null default '{}'::jsonb;
alter table public.outings drop constraint outings_event_status_check;
alter table public.outings add constraint outings_event_status_check check (event_status in ('announced','held','cancelled','suspended','postponed','rescheduled'));
alter table public.cult_occurrences drop constraint cult_occurrences_event_status_check;
alter table public.cult_occurrences add constraint cult_occurrences_event_status_check check (event_status in ('announced','held','cancelled','suspended','postponed','rescheduled'));
alter table public.events drop constraint events_status_check;
alter table public.events add constraint events_status_check check (event_status in ('announced','held','cancelled','suspended','postponed','rescheduled'));

-- Invocador: no amplía permisos ni cambia RLS. Las revisiones no dependen del
-- cliente y se serializan con el bloqueo normal de la fila de PostgreSQL.
create function public.track_event_schedule_change() returns trigger
language plpgsql security invoker set search_path = '' as $$
declare
  before_row jsonb := case when TG_OP = 'UPDATE' then to_jsonb(OLD) else '{}'::jsonb end;
  after_row jsonb := to_jsonb(NEW);
  previous jsonb := coalesce(before_row->'schedule_change', '{}'::jsonb);
  change_date boolean := TG_OP = 'UPDATE' and before_row->>TG_ARGV[0] is distinct from after_row->>TG_ARGV[0];
  change_status boolean := TG_OP = 'INSERT' or OLD.event_status is distinct from NEW.event_status;
  historical_date text := NEW.schedule_change->>'previousDate';
  register_history boolean := TG_OP = 'UPDATE' and change_status and NEW.event_status = 'rescheduled' and not change_date;
  change_end boolean := TG_OP = 'UPDATE' and before_row->>TG_ARGV[1] is distinct from after_row->>TG_ARGV[1];
  revision integer := coalesce((previous->>'revision')::integer,0);
  reason text := nullif(trim(NEW.schedule_change->>'reason'),'');
  source text := nullif(trim(NEW.schedule_change->>'sourceUrl'),'');
  history jsonb := coalesce(previous->'history','[]'::jsonb);
  stamp timestamptz := clock_timestamp();
begin
  if jsonb_typeof(NEW.schedule_change) <> 'object' then raise exception 'La revisión debe ser un objeto'; end if;
  if change_date and NEW.event_status in ('announced','postponed','rescheduled') and before_row->>TG_ARGV[0] is not null then
    NEW.event_status := 'rescheduled';
    change_status := true;
  end if;
  if (change_date or change_status) and NEW.event_status in ('postponed','rescheduled','cancelled','suspended') then
    if reason is null or source is null or source !~ '^https?://' then
      raise exception 'Indica motivo y fuente HTTP(S) del cambio de convocatoria';
    end if;
    if after_row->>TG_ARGV[0] is null then
      raise exception 'Conserva la fecha anterior al aplazar; no inventes una nueva fecha';
    end if;
    if NEW.event_status = 'rescheduled' and (TG_OP = 'INSERT' or before_row->>TG_ARGV[0] is null or (not change_date and (historical_date is null or historical_date !~ '^\d{4}-\d{2}-\d{2}$' or historical_date::date = (after_row->>TG_ARGV[0])::date))) then
      raise exception 'La reprogramación requiere fecha anterior y una nueva fecha distinta';
    end if;
  end if;
  if TG_OP = 'INSERT' then
    NEW.schedule_change := jsonb_build_object('revision',0,'changedAt',stamp,'reason',reason,'sourceUrl',source,'history','[]'::jsonb);
  elsif (after_row - 'schedule_change' - 'updated_at') is distinct from (before_row - 'schedule_change' - 'updated_at')
        or reason is distinct from nullif(previous->>'reason','') or source is distinct from nullif(previous->>'sourceUrl','') then
    if change_date or change_end or change_status then
      history := history || jsonb_build_array(jsonb_build_object('date',before_row->>TG_ARGV[0], 'endDate',before_row->>TG_ARGV[1], 'status',OLD.event_status,'changedAt',stamp,'reason',reason,'sourceUrl',source));
    end if;
    NEW.schedule_change := previous || jsonb_build_object('revision',revision+1,'changedAt',stamp,'reason',reason,'sourceUrl',source,'history',history);
    if change_date or (change_status and NEW.event_status = 'postponed') then
      NEW.schedule_change := NEW.schedule_change || jsonb_build_object('previousDate',before_row->>TG_ARGV[0], 'previousEndDate',before_row->>TG_ARGV[1]);
    end if;
    if register_history then
      NEW.schedule_change := NEW.schedule_change || jsonb_build_object('previousDate',historical_date);
    end if;
  else
    NEW.schedule_change := previous;
  end if;
  return NEW;
end;
$$;
create trigger track_outing_schedule_change before insert or update on public.outings for each row execute function public.track_event_schedule_change('outing_date','return_date');
create trigger track_cult_schedule_change before insert or update on public.cult_occurrences for each row execute function public.track_event_schedule_change('start_date','end_date');
create trigger track_other_event_schedule_change before insert or update on public.events for each row execute function public.track_event_schedule_change('event_date','event_date');
commit;
