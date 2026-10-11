create table if not exists public.concert_programs (
  id uuid primary key default gen_random_uuid(),
  event_entity_id uuid not null references public.entities(id) on delete cascade,
  band_entity_id uuid not null references public.entities(id) on delete restrict,
  source_id uuid references public.sources(id) on delete set null,
  title text not null default 'Programa musical',
  program_kind text not null default 'announced' check (program_kind = any (array['announced'::text, 'performed'::text])),
  notes text,
  status text not null default 'published' check (status = any (array['draft'::text, 'review'::text, 'published'::text, 'archived'::text])),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (event_entity_id, band_entity_id)
);

create table if not exists public.concert_program_entries (
  id uuid primary key default gen_random_uuid(),
  concert_program_id uuid not null references public.concert_programs(id) on delete cascade,
  march_entity_id uuid references public.entities(id) on delete restrict,
  display_title text not null check (btrim(display_title) <> ''),
  author_text text,
  performance_order integer not null check (performance_order > 0),
  premiere_label text,
  notes text,
  created_at timestamptz not null default now(),
  unique (concert_program_id, performance_order)
);

comment on table public.concert_programs is
  'Programas musicales anunciados o documentados para conciertos de la agenda. No sustituye a musical_repertoires, reservado a repertorios interpretados en salidas procesionales.';

comment on column public.concert_programs.program_kind is
  'announced: programa previo anunciado; performed: programa ejecutado y documentado tras el concierto.';

comment on column public.concert_program_entries.march_entity_id is
  'Vínculo opcional a la ficha canónica de la marcha cuando ya existe en Hilo Cofrade.';

create index if not exists concert_programs_event_idx
  on public.concert_programs(event_entity_id, status);

create index if not exists concert_programs_band_idx
  on public.concert_programs(band_entity_id);

create index if not exists concert_program_entries_program_idx
  on public.concert_program_entries(concert_program_id, performance_order);

create index if not exists concert_program_entries_march_idx
  on public.concert_program_entries(march_entity_id)
  where march_entity_id is not null;

alter table public.concert_programs enable row level security;
alter table public.concert_program_entries enable row level security;

revoke all on public.concert_programs from public, anon, authenticated;
revoke all on public.concert_program_entries from public, anon, authenticated;

grant select on public.concert_programs to anon, authenticated;
grant select on public.concert_program_entries to anon, authenticated;
grant insert, update, delete on public.concert_programs to authenticated;
grant insert, update, delete on public.concert_program_entries to authenticated;

create policy "Published concert programs"
on public.concert_programs
for select
to anon, authenticated
using (
  status = 'published'::text
  and exists (
    select 1
    from public.events event
    join public.entities event_entity on event_entity.id = event.entity_id
    where event.entity_id = concert_programs.event_entity_id
      and event.event_category = 'concert'::text
      and event_entity.entity_type = 'event'::text
      and event_entity.status = 'published'::text
  )
  and exists (
    select 1
    from public.entities band
    where band.id = concert_programs.band_entity_id
      and band.entity_type = 'band'::text
      and band.status = 'published'::text
  )
);

create policy "Panel members can read concert programs"
on public.concert_programs
for select
to authenticated
using ((select public.is_panel_member()));

create policy "Editors can create concert programs"
on public.concert_programs
for insert
to authenticated
with check (
  (select public.can_edit_panel())
  and (status <> 'published'::text or (select public.can_publish_panel()))
);

create policy "Editors can update concert programs"
on public.concert_programs
for update
to authenticated
using (
  (select public.can_edit_panel())
  and (status <> 'published'::text or (select public.can_publish_panel()))
)
with check (
  (select public.can_edit_panel())
  and (status <> 'published'::text or (select public.can_publish_panel()))
);

create policy "Admins can delete concert programs"
on public.concert_programs
for delete
to authenticated
using ((select public.can_admin_panel()));

create policy "Published concert program entries"
on public.concert_program_entries
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.concert_programs program
    join public.events event on event.entity_id = program.event_entity_id
    join public.entities event_entity on event_entity.id = event.entity_id
    join public.entities band on band.id = program.band_entity_id
    where program.id = concert_program_entries.concert_program_id
      and program.status = 'published'::text
      and event.event_category = 'concert'::text
      and event_entity.entity_type = 'event'::text
      and event_entity.status = 'published'::text
      and band.entity_type = 'band'::text
      and band.status = 'published'::text
  )
);

create policy "Panel members can read concert program entries"
on public.concert_program_entries
for select
to authenticated
using ((select public.is_panel_member()));

create policy "Editors can create concert program entries"
on public.concert_program_entries
for insert
to authenticated
with check ((select public.can_edit_panel()));

create policy "Editors can update concert program entries"
on public.concert_program_entries
for update
to authenticated
using ((select public.can_edit_panel()))
with check ((select public.can_edit_panel()));

create policy "Admins can delete concert program entries"
on public.concert_program_entries
for delete
to authenticated
using ((select public.can_admin_panel()));
