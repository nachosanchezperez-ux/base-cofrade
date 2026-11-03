-- Publicación de la Hermandad de los Dolores de La Roda de Andalucía
-- Autorizado por Nacho el 03/11/2026 («Publicamos»), a raíz de la cruceta del
-- traslado extraordinario del 2 de noviembre de 2026 (Carmen de Salteras).
-- Aplicado en producción el 03/11/2026 a las 17:53 (hora de Madrid) por SQL directo.
--
-- Estado previo: status='draft' (updated_at 2026-08-20 10:19:00+00).
-- La ficha aún no cumple el mínimo editorial (sin tipo ni resumen), por lo que
-- se sirve con robots noindex, follow hasta que se complete.
--
-- Recuperación: update public.entities set status='draft', updated_at=now()
--   where id='061f2c22-c1c8-4f55-8d63-4933bea12efc';

update public.entities
set status = 'published', updated_at = now()
where id = '061f2c22-c1c8-4f55-8d63-4933bea12efc'
  and entity_type = 'brotherhood'
  and slug = 'hermandad-dolores-roda-andalucia'
  and status = 'draft';
