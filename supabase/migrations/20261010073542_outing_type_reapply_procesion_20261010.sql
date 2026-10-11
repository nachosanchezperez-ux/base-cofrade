-- Estructura de la tabla donde se guarda el mapeo pendiente de reaplicar a las
-- Procesiones extraordinarias (tipo original -> tipo y subtipo objetivo).
-- Solo esquema: en producción la tabla se rellenó a partir del respaldo del 09/10/2026.

create schema if not exists private;

create table if not exists private.outing_type_reapply_20261010 (
  id uuid primary key,
  tipo_original text,
  tipo_objetivo text,
  subtipo_objetivo text
);

revoke all on private.outing_type_reapply_20261010 from anon, authenticated;
