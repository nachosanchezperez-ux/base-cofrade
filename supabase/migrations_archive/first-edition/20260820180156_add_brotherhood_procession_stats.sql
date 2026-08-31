-- Hilo Cofrade · Estadísticas anuales de la estación de penitencia
--
-- Conserva por año las cifras publicadas de cada cortejo y su fuente.

create table public.brotherhood_procession_stats (
  id uuid primary key default gen_random_uuid(),
  brotherhood_entity_id uuid not null
    references public.entities(id) on delete cascade,
  year smallint not null,
  procession_date date,
  procession_day text,
  nazarenos_count integer,
  penitents_count integer,
  total_nazarenos_count integer,
  acolytes_count integer,
  monaguillos_count integer,
  musical_accompaniment_count integer,
  total_procession_count integer,
  position_by_nazarenos smallint,
  position_by_procession smallint,
  brotherhoods_in_day smallint,
  official_route_duration_minutes integer,
  official_career_duration_minutes integer,
  departure_time time without time zone,
  entrance_time time without time zone,
  source_id uuid references public.sources(id) on delete set null,
  status text not null default 'published',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint brotherhood_procession_stats_brotherhood_year_key
    unique (brotherhood_entity_id, year),
  constraint brotherhood_procession_stats_year_check
    check (year between 1900 and 2100),
  constraint brotherhood_procession_stats_status_check
    check (status in ('draft', 'review', 'published', 'archived')),
  constraint brotherhood_procession_stats_nonnegative_counts_check
    check (
      (nazarenos_count is null or nazarenos_count >= 0)
      and (penitents_count is null or penitents_count >= 0)
      and (total_nazarenos_count is null or total_nazarenos_count >= 0)
      and (acolytes_count is null or acolytes_count >= 0)
      and (monaguillos_count is null or monaguillos_count >= 0)
      and (musical_accompaniment_count is null or musical_accompaniment_count >= 0)
      and (total_procession_count is null or total_procession_count >= 0)
    ),
  constraint brotherhood_procession_stats_nonnegative_durations_check
    check (
      (official_route_duration_minutes is null or official_route_duration_minutes >= 0)
      and (official_career_duration_minutes is null or official_career_duration_minutes >= 0)
    ),
  constraint brotherhood_procession_stats_positions_check
    check (
      (position_by_nazarenos is null or position_by_nazarenos > 0)
      and (position_by_procession is null or position_by_procession > 0)
      and (brotherhoods_in_day is null or brotherhoods_in_day > 0)
      and (
        position_by_nazarenos is null
        or brotherhoods_in_day is null
        or position_by_nazarenos <= brotherhoods_in_day
      )
      and (
        position_by_procession is null
        or brotherhoods_in_day is null
        or position_by_procession <= brotherhoods_in_day
      )
    )
);

create index brotherhood_procession_stats_source_id_idx
  on public.brotherhood_procession_stats(source_id);

create index brotherhood_procession_stats_published_lookup_idx
  on public.brotherhood_procession_stats(brotherhood_entity_id, year desc)
  where status = 'published';

create trigger brotherhood_procession_stats_set_updated_at
before update on public.brotherhood_procession_stats
for each row execute function public.set_updated_at();

alter table public.brotherhood_procession_stats enable row level security;

create policy "Published brotherhood procession stats"
on public.brotherhood_procession_stats for select
to anon, authenticated
using (status = 'published');

create policy "Panel members can read brotherhood procession stats"
on public.brotherhood_procession_stats for select
to authenticated
using ((select public.is_panel_member()));

create policy "Editors can create brotherhood procession stats"
on public.brotherhood_procession_stats for insert
to authenticated
with check (
  (select public.can_edit_panel())
  and (status <> 'published' or (select public.can_publish_panel()))
);

create policy "Editors can update brotherhood procession stats"
on public.brotherhood_procession_stats for update
to authenticated
using (
  (select public.can_edit_panel())
  and (status <> 'published' or (select public.can_publish_panel()))
)
with check (
  (select public.can_edit_panel())
  and (status <> 'published' or (select public.can_publish_panel()))
);

create policy "Admins can delete brotherhood procession stats"
on public.brotherhood_procession_stats for delete
to authenticated
using ((select public.can_admin_panel()));

grant select on public.brotherhood_procession_stats to anon;
grant select, insert, update, delete on public.brotherhood_procession_stats to authenticated;
grant all privileges on public.brotherhood_procession_stats to service_role;

comment on table public.brotherhood_procession_stats is
  'Annual, source-backed statistics for a brotherhood''s principal procession.';

comment on column public.brotherhood_procession_stats.total_nazarenos_count is
  'Total of nazarenos and penitents when the source publishes a combined figure.';

comment on column public.brotherhood_procession_stats.total_procession_count is
  'Total people counted in the procession (cortejo) for the published year.';
