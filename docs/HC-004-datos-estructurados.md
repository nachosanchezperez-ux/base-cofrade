# HC-004 · Datos estructurados y autoridad editorial

**Estado:** IMPLEMENTADA / VIGENTE  
**Ámbito:** modelo de datos, Panel y Front público

## Decisión

El conocimiento persistente de Hilo Cofrade se almacena de forma **estructurada y editable desde el Panel**. El Front consume Supabase como autoridad y no mantiene copias locales de contenido editorial para rescatar fichas o relaciones.

## Reglas

- Entidades, atributos y relaciones con semántica propia se modelan en campos o tablas estructuradas.
- El texto libre se reserva para descripción, contexto o notas; no sustituye una relación canónica existente.
- Todo contenido persistente mostrado por el Front debe tener una vía de edición manual en el Panel o derivarse de datos editables.
- Un dato derivado no se duplica en un segundo formulario.
- Los fallbacks solo pueden ser neutros y de presentación; nunca pueden contener una copia específica de datos reales.
- Las fuentes se vinculan al dato, entidad o relación correspondiente.
- La publicación pública respeta estados editoriales y RLS.

## Contrato relacionado

`docs/panel-front-parity.md` mantiene la matriz Front ↔ Panel y sus guardas de regresión. HC-001 gobierna la naturaleza relacional del conocimiento y HC-005 su dimensión temporal.

## Regla de no regresión

No introducir constantes específicas de una entidad, catálogos JSON paralelos o contenido hardcodeado que contradiga o sustituya la autoridad de Supabase/Panel.