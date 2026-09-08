alter table public.brotherhood_procession_stats
  add column if not exists members_count integer,
  add column if not exists members_count_kind text,
  add column if not exists members_source_id uuid references public.sources(id) on delete set null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.brotherhood_procession_stats'::regclass
      and conname = 'brotherhood_procession_stats_members_count_nonnegative_check'
  ) then
    alter table public.brotherhood_procession_stats
      add constraint brotherhood_procession_stats_members_count_nonnegative_check
      check (members_count is null or members_count >= 0);
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.brotherhood_procession_stats'::regclass
      and conname = 'brotherhood_procession_stats_members_count_kind_check'
  ) then
    alter table public.brotherhood_procession_stats
      add constraint brotherhood_procession_stats_members_count_kind_check
      check (
        members_count_kind is null
        or members_count_kind in ('exact', 'approximate', 'minimum', 'maximum')
      );
  end if;
end $$;

comment on column public.brotherhood_procession_stats.members_count is
  'Número de hermanos de la corporación para el año de referencia.';
comment on column public.brotherhood_procession_stats.members_count_kind is
  'Naturaleza de la cifra: exact, approximate, minimum o maximum.';
comment on column public.brotherhood_procession_stats.members_source_id is
  'Fuente específica del número de hermanos, independiente de la fuente de datos procesionales.';
