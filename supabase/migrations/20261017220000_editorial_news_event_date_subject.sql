-- Noticias de «El Hilo se mueve» · fecha del acto y protagonista sin ficha.
--
-- Fase 1 (solo esquema) para llevar al Panel todas las noticias que aún viven
-- en lib/hilo-movements-data.js y dejar de mantenerlas en código.
--
--   * event_date: día en que ocurre lo que la noticia anuncia (un estreno, un
--     concierto, una exposición que termina). Cuando pasa, la web lo indica
--     («Ya celebrado») y el Panel avisa de que conviene revisar el texto, para
--     que una noticia no siga hablando en futuro de algo que ya ocurrió.
--   * subject_label / subject_kind: protagonista que no tiene ficha propia en
--     Hilo Cofrade (p. ej. «Consejo de Hermandades de Sevilla» · «Sección de
--     Gloria»). Sustituye a la excepción editorial que hoy solo admite el código.
--
-- Cambio aditivo: columnas opcionales; no modifica ni borra filas existentes.
-- Sin cambios de RLS: las políticas vigentes de editorial_content ya cubren
-- lectura pública de lo publicado y escritura de editores.

alter table public.editorial_content
  add column if not exists event_date date,
  add column if not exists subject_label text,
  add column if not exists subject_kind text;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'editorial_content_subject_kind_needs_label_check') then
    alter table public.editorial_content
      add constraint editorial_content_subject_kind_needs_label_check
      check (subject_kind is null or subject_label is not null);
  end if;
end $$;
