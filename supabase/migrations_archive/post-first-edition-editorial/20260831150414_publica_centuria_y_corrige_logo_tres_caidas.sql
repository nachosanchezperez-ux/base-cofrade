-- Marcador canónico de una aplicación histórica duplicada en producción.
--
-- La versión 20260831135520 ya contiene el resultado final, reutilizable e
-- idempotente de Centuria Romana Macarena. Producción registró nuevamente ese
-- contenido con la versión 20260831150414 antes de consolidarse el baseline.
-- Mantener esta migración como no-op alinea el historial sin repetir DML en
-- bases nuevas ni alterar los datos reales ya reconciliados.

do $$
begin
  null;
end $$;
