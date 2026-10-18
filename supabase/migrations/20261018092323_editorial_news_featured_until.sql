-- Noticias de «El Hilo se mueve» · noticia destacada (#1253).
--
-- La noticia principal de la portada y del índice era siempre la más reciente.
-- Con este campo el editor elige desde el Panel cuál destaca y hasta qué día:
--
--   * featured_until: último día (incluido) en que la noticia es la destacada.
--     Pasada esa fecha deja de serlo sola, sin que nadie tenga que acordarse
--     de desmarcarla. Vacío = no destacada.
--
-- Cambio aditivo: columna opcional; no modifica ni borra filas existentes.
-- Reversible: alter table public.editorial_content drop column featured_until;
-- Sin cambios de RLS: las políticas vigentes de editorial_content ya cubren
-- lectura pública de lo publicado y escritura de editores.

alter table public.editorial_content
  add column if not exists featured_until date;

comment on column public.editorial_content.featured_until is
  'Noticias: último día (incluido) en que la noticia es la destacada de El Hilo se mueve. Null = no destacada.';
