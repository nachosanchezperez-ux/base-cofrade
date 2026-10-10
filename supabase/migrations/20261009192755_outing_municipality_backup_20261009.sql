-- Estructura de la tabla de respaldo usada al completar el municipio de los Vía Crucis
-- del Consejo General de Hermandades y Cofradías de Sevilla (09/10/2026).
-- Solo esquema: los datos del respaldo existen únicamente en producción.

create schema if not exists private;

create table if not exists private.outing_municipality_backup_20261009 (
  id uuid primary key,
  antes uuid,
  despues uuid,
  creado timestamptz not null default now()
);

revoke all on private.outing_municipality_backup_20261009 from anon, authenticated;
