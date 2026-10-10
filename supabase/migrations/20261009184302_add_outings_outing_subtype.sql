-- Variante opcional del tipo de salida. El tipo (outing_type) pertenece a una lista
-- cerrada y corta; lo que distingue una variante concreta va aquí.
-- Ejemplos: Traslado -> misional, de regreso, colectivo, en Vía Crucis;
--           Vía Crucis -> del Consejo de Hermandades y Cofradías.
-- Si es ordinaria o extraordinaria se sigue guardando en "character".

alter table public.outings
  add column if not exists outing_subtype text;

comment on column public.outings.outing_subtype is
  'Variante del tipo de acto (p. ej. Traslado -> misional, de regreso, colectivo, en Vía Crucis). El carácter ordinario/extraordinario va en "character".';
