-- Hilo Cofrade · Importador documental asistido
-- Migración 049
--
-- Separa estrictamente propuestas automáticas del grafo canónico.
-- El HTML/documento fuente no se persiste: solo metadatos, candidatos,
-- evidencias breves y el resultado de la revisión/aplicación.

create table public.document_imports (
  id uuid primary key default gen_random_uuid(),
  target_entity_id uuid references public.entities(id) on delete set null,
  source_id uuid references public.sources(id) on delete set null,
  source_url text not null,
  source_title text,
  status text not null default 'review' check (
    status in ('review', 'applied', 'discarded', 'failed')
  ),
  analysis_version integer not null default 1,
  analysis jsonb not null default '{}'::jsonb,
  application_summary jsonb,
  model_name text,
  content_sha256 text,
  fetched_at timestamptz,
  applied_at timestamptz,
  error_text text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index document_imports_status_idx
  on public.document_imports(status, created_at desc);

create index document_imports_target_idx
  on public.document_imports(target_entity_id, created_at desc);

create trigger document_imports_set_updated_at
before update on public.document_imports
for each row execute function public.set_updated_at();

alter table public.document_imports enable row level security;

create policy "Panel members can read document imports"
on public.document_imports for select to authenticated
using ((select public.is_panel_member()));

create policy "Editors can create document imports"
on public.document_imports for insert to authenticated
with check (
  (select public.can_edit_panel())
  and (created_by is null or created_by = (select auth.uid()))
);

create policy "Editors can update document imports"
on public.document_imports for update to authenticated
using ((select public.can_edit_panel()))
with check ((select public.can_edit_panel()));

create policy "Admins can delete document imports"
on public.document_imports for delete to authenticated
using ((select public.can_admin_panel()));

grant select, insert, update, delete on public.document_imports to authenticated;
