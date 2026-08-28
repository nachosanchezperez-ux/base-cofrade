-- Expone únicamente los documentos legales aprobados para el Front.
-- La ficha de Dirección, las notas internas y la identidad del editor permanecen privadas.

revoke all on table public.legal_drafts from anon;
grant select (document_key, title, body, status, updated_at)
on table public.legal_drafts to anon;

create policy "Public can read ready legal documents"
on public.legal_drafts for select to anon
using (
  status = 'ready'
  and document_key in ('legal_notice', 'privacy_policy', 'storage_policy')
);
