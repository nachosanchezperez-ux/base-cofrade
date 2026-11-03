-- Nombre propio de la cruceta del Rosario de la Macarena (25/10/2026)
-- Autorizado por Nacho el 03/11/2026: «En la de La Macarena, ponemos Virgen del
-- Rosario de la Macarena». Usa la columna display_name (migración 20261103180000,
-- #1375). Aplicado en producción el 04/11/2026 a las 00:25 (hora de Madrid).
-- Estado previo: display_name nulo (la cruceta se presentaba como «La Macarena»).
-- Recuperación: update public.musical_repertoires set display_name=null
--   where slug='santo-rosario-macarena-carmen-salteras-2026';

update public.musical_repertoires
set display_name = 'Virgen del Rosario de la Macarena', updated_at = now()
where slug = 'santo-rosario-macarena-carmen-salteras-2026'
  and status = 'published'
  and display_name is null;
