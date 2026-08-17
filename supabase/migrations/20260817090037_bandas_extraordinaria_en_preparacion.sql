-- Hilo Cofrade · Entidades musicales de la extraordinaria en preparación
-- Migración 037
--
-- La programación del 22/08/2026 necesita relacionar las bandas como entidades
-- desde ahora, pero sus fichas públicas todavía no están documentalmente cerradas.
-- Conservamos las entidades y sus relaciones en el grafo y evitamos publicar
-- fichas mínimas únicamente por aparecer en la Home.
--
-- Cuando cada expediente esté listo, se publicará la entidad desde el flujo
-- editorial ordinario. El briefing de la Home ya resolverá entonces su enlace
-- automáticamente por entity_id + slug, sin cambios en el componente.

update public.entities
set status = 'draft'
where id in (
  'a2208260-0000-0000-0000-000000000040', -- Banda Municipal de Música de Bollullos del Condado
  'a2208260-0000-0000-0000-000000000041'  -- Banda de Música de la Oliva de Salteras
);
