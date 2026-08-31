-- Hilo Cofrade · reconciliación del historial remoto
--
-- Esta versión representa la repetición idempotente de
-- 20260823230534_guard_core_public_relations.sql realizada durante la
-- reconciliación Git ↔ Supabase del ciclo 1 de Salud del grafo.
--
-- En una base nueva, la versión 20260823230534 ya deja aplicado el esquema
-- completo. Por tanto, este marcador no necesita ejecutar cambios adicionales.
-- Su presencia mantiene el historial local alineado con la versión remota
-- 20260823231543 sin duplicar efectos ni manipular la tabla de migraciones.

select 1;
