-- Evita recorridos completos al resolver el usuario de la última edición.
create index legal_drafts_updated_by_idx on public.legal_drafts(updated_by);
