-- Vírgenes Coronadas · la coronación canónica de Nuestra Señora del Amparo
-- (8 de noviembre de 2026) pasa de anunciada a celebrada.
-- Confirmado por Nacho el 08/11/2026 («Amparo ya coronada»). Aplicado en
-- producción el 08/11/2026 por SQL directo. Solo DML. Idempotente.
--
-- Recuperación:
--   update public.events set event_status = 'announced'
--   where entity_id = '18b13ead-e3e1-4b20-bbd3-7c15de05b2bd';

begin;

update public.events
set event_status = 'held', updated_at = now()
where entity_id = '18b13ead-e3e1-4b20-bbd3-7c15de05b2bd'
  and event_date = '2026-11-08'
  and event_status = 'announced';

commit;
