-- Hilo Cofrade · borradores legales privados y editables desde el Panel
--
-- El contenido de trabajo se carga como dato privado en cada entorno y no se
-- versiona en Git. El estado "ready" tampoco publica el documento.

create table public.legal_drafts (
  id uuid primary key default gen_random_uuid(),
  document_key text not null unique check (document_key in (
    'direction_sheet', 'legal_notice', 'privacy_policy', 'storage_policy'
  )),
  title text not null,
  body text not null default '',
  status text not null default 'draft' check (status in ('draft', 'review', 'ready')),
  internal_notes text,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger legal_drafts_set_updated_at
before update on public.legal_drafts
for each row execute function public.set_updated_at();

alter table public.legal_drafts enable row level security;

revoke all on table public.legal_drafts from public, anon;
revoke all on table public.legal_drafts from authenticated;
grant select, insert, update on table public.legal_drafts to authenticated;

create policy "Panel members can read legal drafts"
on public.legal_drafts for select to authenticated
using ((select public.is_panel_member()));

create policy "Panel editors can add legal drafts"
on public.legal_drafts for insert to authenticated
with check ((select public.can_edit_panel()));

create policy "Panel editors can update legal drafts"
on public.legal_drafts for update to authenticated
using ((select public.can_edit_panel()))
with check ((select public.can_edit_panel()));

insert into public.legal_drafts (document_key, title, body, status, internal_notes)
values
  (
    'direction_sheet',
    'Ficha de Dirección y control de publicación',
    '# Datos que debe confirmar Dirección\n\n- Responsable legal: [COMPLETAR]\n- Email público: [COMPLETAR]\n- Contacto público: [COMPLETAR]\n\n# Puertas antes de publicar\n\n- [ ] Resolver todos los campos pendientes.\n- [ ] Revisión técnica y jurídica final.\n- [ ] Aprobar expresamente la publicación.',
    'draft',
    'Documento interno. No publicar mientras queden marcadores pendientes.'
  ),
  (
    'legal_notice',
    'Aviso legal',
    '# Aviso legal\n\n[COMPLETAR Y REVISAR ANTES DE PUBLICAR]',
    'draft',
    'Borrador privado.'
  ),
  (
    'privacy_policy',
    'Política de privacidad',
    '# Política de privacidad\n\n[COMPLETAR Y REVISAR ANTES DE PUBLICAR]',
    'draft',
    'Borrador privado.'
  ),
  (
    'storage_policy',
    'Cookies y almacenamiento local',
    '# Cookies y almacenamiento local\n\n[COMPLETAR Y REVISAR ANTES DE PUBLICAR]',
    'draft',
    'Borrador privado.'
  )
on conflict (document_key) do nothing;
