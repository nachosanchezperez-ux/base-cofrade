alter table public.entities
  add column content_updated_at timestamptz,
  add column editorial_reviewed_at timestamptz;

comment on column public.entities.content_updated_at is
  'Fecha de la última actualización editorial significativa del contenido público de la entidad.';
comment on column public.entities.editorial_reviewed_at is
  'Fecha de la última revisión editorial de la ficha, aunque no haya cambios de contenido.';

create index entities_editorial_review_queue_idx
  on public.entities (editorial_reviewed_at, entity_type, status)
  where status = 'published'
    and entity_type in ('brotherhood','band','image','step','march');
