# HC-016 · Importación masiva gobernada

**Estado:** CERRADA  
**Fecha de cierre:** 24/08/2026  
**Ámbito:** Panel, cargas JSON/JSONL/CSV, integridad relacional y trazabilidad

## Decisión

La importación masiva de Hilo Cofrade es un flujo editorial gobernado. No consiste en ejecutar inserciones directas ni en publicar automáticamente un archivo recibido.

El contrato es:

```text
ANALIZAR
→ PREPARAR
→ VALIDAR
→ REVISAR
→ APLICAR POR LOTES
→ AUDITAR
→ RECUPERAR INCIDENCIAS
```

## Principios

1. Una carga se identifica como lote y conserva origen, formato, tamaño esperado, estado y métricas.
2. Los registros se validan antes de escribir en las tablas canónicas.
3. Las referencias se resuelven de forma determinista y deben ser unívocas.
4. Las colisiones internas y claves estables repetidas se detectan antes de aplicar.
5. El orden de aplicación respeta dependencias entre entidades y relaciones.
6. Los lotes se procesan en bloques controlados, no en una única operación opaca.
7. Los errores quedan asociados al registro concreto y pueden revisarse o reintentarse.
8. Una carga puede cancelarse mientras no haya iniciado escrituras.
9. El cierre genera trazabilidad en `audit_log`.
10. Las constraints, RLS y guardas del modelo siguen siendo la garantía final.

## Estados del lote

El flujo distingue, como mínimo:

- `staging`;
- `ready`;
- `processing`;
- `completed`;
- `completed_with_errors`;
- `cancelled`.

Los elementos mantienen sus propios estados de validación y aplicación.

## Implementación vigente

La arquitectura canónica está implementada mediante:

- `bulk_imports`;
- `bulk_import_items`;
- `lib/panel/bulk-import-config.js`;
- `lib/panel/bulk-import-parser.js`;
- `lib/panel/bulk-import.js`;
- `app/panel/(protected)/datos/importar/`;
- migraciones `20260822204505_bulk_import_pipeline` y `20260823134318_mass_import_relational_integrity`.

Admite fuentes JSON, JSONL y CSV dentro de los límites definidos por el Panel.

## Relación con la PR #49

La PR #49 correspondía a un importador documental asistido mediante OpenAI y fue **cerrada sin fusionar el 26/08/2026 por decisión de producto**.

No es la implementación de HC-016 y no debe utilizarse como base técnica. Hilo Cofrade no depende de una API generativa para importar contenido: JSON, JSONL y CSV son las entradas canónicas. Cualquier ampliación futura debe extender esta arquitectura de lotes, revisión humana e integridad vigente, sin crear una vía paralela de extracción automática.

## Publicación y revisión humana

La importación prepara y aplica datos según el estado explícito de cada registro. No convierte una fuente externa ni una salida de IA en verdad canónica.

Los ámbitos sensibles —media, derechos, relaciones nucleares, Fuentes y publicación— mantienen sus contratos específicos aunque el dato llegue por importación.

## Regla de no regresión

No se añadirá una vía paralela de carga directa que evite staging, validación, trazabilidad o guardas de base.

**IMPORTACIÓN MASIVA → 🟢 GOBERNADA**
