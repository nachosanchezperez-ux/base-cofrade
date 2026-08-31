-- Hilo Cofrade · canal público de aportaciones con cola editorial privada
--
-- El navegador no escribe directamente en estas tablas. La Server Action usa
-- una clave secreta solo después de validar origen, CAPTCHA, límites y datos.

alter table public.contributions
  drop constraint if exists contributions_status_check;

update public.contributions
set status = 'applied'
where status = 'published';

alter table public.contributions
  add column if not exists page_url text,
  add column if not exists source_urls text[] not null default '{}',
  add column if not exists photo_credit text,
  add column if not exists photo_alt_text text,
  add column if not exists rights_confirmed boolean not null default false,
  add column if not exists privacy_version text not null default 'public-contributions-2026-08-31',
  add column if not exists consented_at timestamptz,
  add column if not exists client_fingerprint_hash text,
  add column if not exists submission_hash text,
  add column if not exists assigned_to uuid references auth.users(id) on delete set null,
  add column if not exists reviewed_by uuid references auth.users(id) on delete set null,
  add column if not exists reviewed_at timestamptz,
  add column if not exists resolved_at timestamptz,
  add column if not exists internal_notes text,
  add column if not exists resolution_summary text,
  add column if not exists expires_at timestamptz not null default (now() + interval '12 months');

alter table public.contributions
  add constraint contributions_type_check check (
    contribution_type in ('correction', 'new_record', 'media', 'suggestion')
  ),
  add constraint contributions_status_check check (
    status in ('pending', 'in_review', 'needs_info', 'accepted', 'rejected', 'applied', 'expired')
  ),
  add constraint contributions_contact_email_length_check check (
    contact_email is null or char_length(contact_email) <= 254
  ),
  add constraint contributions_submission_hash_check check (
    submission_hash is null or submission_hash ~ '^[0-9a-f]{64}$'
  ),
  add constraint contributions_fingerprint_hash_check check (
    client_fingerprint_hash is null or client_fingerprint_hash ~ '^[0-9a-f]{64}$'
  );

create index if not exists contributions_review_queue_idx
on public.contributions(status, created_at desc);

create index if not exists contributions_type_created_idx
on public.contributions(contribution_type, created_at desc);

create index if not exists contributions_submission_hash_idx
on public.contributions(submission_hash, created_at desc)
where submission_hash is not null;

create index if not exists contributions_assigned_to_idx
on public.contributions(assigned_to, status, created_at desc)
where assigned_to is not null;

create table if not exists public.contribution_attachments (
  id uuid primary key default gen_random_uuid(),
  contribution_id uuid not null references public.contributions(id) on delete cascade,
  storage_path text not null unique,
  original_name text not null,
  declared_mime_type text not null,
  verified_mime_type text not null check (
    verified_mime_type in ('image/jpeg', 'image/png', 'image/webp')
  ),
  byte_size integer not null check (byte_size > 0 and byte_size <= 5242880),
  width integer not null check (width > 0 and width <= 12000),
  height integer not null check (height > 0 and height <= 12000),
  sha256 text not null check (sha256 ~ '^[0-9a-f]{64}$'),
  status text not null default 'quarantined' check (
    status in ('quarantined', 'accepted', 'rejected', 'deleted')
  ),
  credit text,
  alt_text text,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  deleted_at timestamptz
);

create index if not exists contribution_attachments_contribution_idx
on public.contribution_attachments(contribution_id, created_at);

create index if not exists contribution_attachments_sha256_idx
on public.contribution_attachments(sha256, created_at desc);

create table if not exists public.contribution_attempts (
  id bigint generated always as identity primary key,
  fingerprint_hash text not null check (fingerprint_hash ~ '^[0-9a-f]{64}$'),
  attempted_at timestamptz not null default now()
);

create index if not exists contribution_attempts_fingerprint_time_idx
on public.contribution_attempts(fingerprint_hash, attempted_at desc);

create index if not exists contribution_attempts_time_idx
on public.contribution_attempts(attempted_at desc);

alter table public.contribution_attachments enable row level security;
alter table public.contribution_attempts enable row level security;

revoke all privileges on table public.contributions
from public, anon, authenticated;
revoke all privileges on table public.contribution_attachments
from public, anon, authenticated;
revoke all privileges on table public.contribution_attempts
from public, anon, authenticated;

grant all privileges on table public.contributions to service_role;
grant all privileges on table public.contribution_attachments to service_role;
grant all privileges on table public.contribution_attempts to service_role;
grant usage, select on sequence public.contribution_attempts_id_seq to service_role;

grant select, update on table public.contributions to authenticated;
grant select, update on table public.contribution_attachments to authenticated;

drop policy if exists "Panel members can read contributions" on public.contributions;
create policy "Panel members can read contributions"
on public.contributions for select to authenticated
using ((select public.is_panel_member()));

drop policy if exists "Panel editors can update contributions" on public.contributions;
create policy "Panel editors can update contributions"
on public.contributions for update to authenticated
using ((select public.can_edit_panel()))
with check ((select public.can_edit_panel()));

drop policy if exists "Panel members can read contribution attachments"
on public.contribution_attachments;
create policy "Panel members can read contribution attachments"
on public.contribution_attachments for select to authenticated
using ((select public.is_panel_member()));

drop policy if exists "Panel editors can update contribution attachments"
on public.contribution_attachments;
create policy "Panel editors can update contribution attachments"
on public.contribution_attachments for update to authenticated
using ((select public.can_edit_panel()))
with check ((select public.can_edit_panel()));

create or replace function public.consume_contribution_rate_limit(
  p_fingerprint_hash text
)
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
  if p_fingerprint_hash is null
    or p_fingerprint_hash !~ '^[0-9a-f]{64}$' then
    return false;
  end if;

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(p_fingerprint_hash, 18018)
  );

  delete from public.contribution_attempts
  where attempted_at < pg_catalog.now() - interval '48 hours';

  select
    count(*) filter (where attempted_at >= pg_catalog.now() - interval '15 minutes'),
    count(*) filter (where attempted_at >= pg_catalog.now() - interval '24 hours')
  into attempts_15_minutes, attempts_24_hours
  from public.contribution_attempts
  where fingerprint_hash = p_fingerprint_hash;

  select count(*)
  into attempts_global_hour
  from public.contribution_attempts
  where attempted_at >= pg_catalog.now() - interval '1 hour';

  if attempts_15_minutes >= 5
    or attempts_24_hours >= 20
    or attempts_global_hour >= 300 then
    return false;
  end if;

  insert into public.contribution_attempts(fingerprint_hash)
  values (p_fingerprint_hash);

  return true;
end
$$;

revoke all on function public.consume_contribution_rate_limit(text)
from public, anon, authenticated;
grant execute on function public.consume_contribution_rate_limit(text)
to service_role;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'hilo-contributions-quarantine',
  'hilo-contributions-quarantine',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Panel members can inspect contribution quarantine"
on storage.objects;
create policy "Panel members can inspect contribution quarantine"
on storage.objects for select to authenticated
using (
  bucket_id = 'hilo-contributions-quarantine'
  and (select public.is_panel_member())
);

drop policy if exists "Panel editors can remove contribution quarantine"
on storage.objects;
create policy "Panel editors can remove contribution quarantine"
on storage.objects for delete to authenticated
using (
  bucket_id = 'hilo-contributions-quarantine'
  and (select public.can_edit_panel())
);

comment on table public.contributions is
  'Cola editorial privada de aportaciones públicas. Nunca modifica el grafo automáticamente.';
comment on table public.contribution_attachments is
  'Fotografías públicas aisladas en cuarentena privada hasta revisión humana.';
comment on table public.contribution_attempts is
  'Huellas HMAC efímeras para limitar abuso; nunca almacena la IP en claro.';

do $$
begin
  if has_table_privilege('anon', 'public.contributions', 'select')
    or has_table_privilege('anon', 'public.contributions', 'insert')
    or has_table_privilege('anon', 'public.contributions', 'update')
    or has_table_privilege('anon', 'public.contributions', 'delete') then
    raise exception 'HC-018 security: anon conserva privilegios sobre contributions';
  end if;

  if has_table_privilege('authenticated', 'public.contributions', 'insert')
    or has_table_privilege('authenticated', 'public.contributions', 'delete') then
    raise exception 'HC-018 security: authenticated puede crear o borrar contributions';
  end if;
end
$$;
