-- HC-018: serialize the rolling duplicate check and INSERT. No new public API,
-- no new table, no automatic publication and no backfill of editorial data.
create or replace function public.guard_contribution_duplicate()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if new.submission_hash is null then
    return new;
  end if;
  -- A stale repeatable-read snapshot must not defeat the lock/check contract.
  if pg_catalog.current_setting('transaction_isolation') <> 'read committed' then
    raise exception 'Contribution reservation requires read committed';
  end if;
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(new.submission_hash, 18019)
  );
  if exists (
    select 1 from public.contributions c
    where c.submission_hash = new.submission_hash
      and c.id <> new.id
      and c.created_at >= pg_catalog.now() - interval '24 hours'
  ) then
    raise exception 'Recent duplicate contribution' using errcode = '23505';
  end if;
  return new;
end
$$;

revoke all on function public.guard_contribution_duplicate()
from public, anon, authenticated;
grant execute on function public.guard_contribution_duplicate() to service_role;

drop trigger if exists contributions_guard_duplicate on public.contributions;
create trigger contributions_guard_duplicate
before insert or update of submission_hash, created_at on public.contributions
for each row execute function public.guard_contribution_duplicate();

-- One lock for the global counter as well as the per-fingerprint counter.
-- Network/CAPTCHA/file parsing stays outside this short transaction.
create or replace function public.consume_contribution_rate_limit(p_fingerprint_hash text)
returns boolean
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  attempts_15_minutes integer;
  attempts_24_hours integer;
  attempts_global_hour integer;
begin
  if p_fingerprint_hash is null or p_fingerprint_hash !~ '^[0-9a-f]{64}$' then
    return false;
  end if;
  if pg_catalog.current_setting('transaction_isolation') <> 'read committed' then
    return false;
  end if;
  perform pg_catalog.pg_advisory_xact_lock(18018, 1);
  delete from public.contribution_attempts
    where attempted_at < pg_catalog.now() - interval '48 hours';
  select
    count(*) filter (where attempted_at >= pg_catalog.now() - interval '15 minutes'),
    count(*) filter (where attempted_at >= pg_catalog.now() - interval '24 hours')
  into attempts_15_minutes, attempts_24_hours
  from public.contribution_attempts where fingerprint_hash = p_fingerprint_hash;
  select count(*) into attempts_global_hour from public.contribution_attempts
    where attempted_at >= pg_catalog.now() - interval '1 hour';
  if attempts_15_minutes >= 5 or attempts_24_hours >= 20 or attempts_global_hour >= 300 then
    return false;
  end if;
  insert into public.contribution_attempts(fingerprint_hash) values (p_fingerprint_hash);
  return true;
end
$$;

revoke all on function public.consume_contribution_rate_limit(text)
from public, anon, authenticated;
grant execute on function public.consume_contribution_rate_limit(text) to service_role;
