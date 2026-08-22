-- Hilo Cofrade · Importación masiva por lotes
-- Staging seguro, validación previa y trazabilidad para cargas CSV/JSON/JSONL.

create table if not exists public.bulk_imports (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  source_name text,
  source_format text not null default 'json',
  status text not null default 'staging' check (status in ('staging', 'ready', 'processing', 'completed', 'completed_with_errors', 'cancelled')),
  expected_items integer not null default 0 check (expected_items >= 0),
  staged_items integer not null default 0 check (staged_items >= 0),
  valid_items integer not null default 0 check (valid_items >= 0),
  invalid_items integer not null default 0 check (invalid_items >= 0),
  applied_items integer not null default 0 check (applied_items >= 0),
  failed_items integer not null default 0 check (failed_items >= 0),
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists public.bulk_import_items (
  id uuid primary key default gen_random_uuid(),
  import_id uuid not null references public.bulk_imports(id) on delete cascade,
  position integer not null check (position >= 0),
  table_name text not null,
  operation text not null default 'insert' check (operation in ('insert', 'upsert')),
  priority smallint not null default 100,
  record jsonb not null,
  status text not null default 'valid' check (status in ('valid', 'invalid', 'applied', 'failed')),
  validation_errors jsonb not null default '[]'::jsonb,
  error_text text,
  result jsonb,
  applied_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (import_id, position)
);

create index if not exists bulk_imports_status_created_idx
  on public.bulk_imports(status, created_at desc);

create index if not exists bulk_import_items_queue_idx
  on public.bulk_import_items(import_id, status, priority, position);

alter table public.bulk_imports enable row level security;
alter table public.bulk_import_items enable row level security;

create policy "Panel members can read bulk imports"
  on public.bulk_imports for select
  using (public.is_panel_member());

create policy "Editors can create bulk imports"
  on public.bulk_imports for insert
  with check (
    public.can_edit_panel()
    and (created_by is null or created_by = auth.uid())
  );

create policy "Editors can update bulk imports"
  on public.bulk_imports for update
  using (public.can_edit_panel())
  with check (public.can_edit_panel());

create policy "Admins can delete bulk imports"
  on public.bulk_imports for delete
  using (public.can_admin_panel());

create policy "Panel members can read bulk import items"
  on public.bulk_import_items for select
  using (public.is_panel_member());

create policy "Editors can create bulk import items"
  on public.bulk_import_items for insert
  with check (
    public.can_edit_panel()
    and exists (
      select 1 from public.bulk_imports bi where bi.id = import_id
    )
  );

create policy "Editors can update bulk import items"
  on public.bulk_import_items for update
  using (public.can_edit_panel())
  with check (public.can_edit_panel());

create policy "Admins can delete bulk import items"
  on public.bulk_import_items for delete
  using (public.can_admin_panel());

comment on table public.bulk_imports is 'Cabecera y progreso de cargas masivas desde el Panel.';
comment on table public.bulk_import_items is 'Registros normalizados de una carga masiva antes y después de aplicarlos al grafo.';
comment on column public.bulk_import_items.record is 'Operación declarativa: table, operation, on_conflict, data y refs opcionales.';
