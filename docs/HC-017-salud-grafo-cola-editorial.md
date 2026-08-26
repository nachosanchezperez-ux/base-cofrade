# HC-017 · Salud del grafo como cola editorial continua

**Estado:** CERRADA  
**Fecha de cierre:** 24/08/2026  
**Ámbito:** integridad, cobertura, priorización y mejora sistémica del conocimiento

## Decisión

Salud del grafo es la cola editorial permanente de Hilo Cofrade. Su objetivo no es declarar que nunca existen incidencias, sino convertirlas en mejoras medibles y reutilizables.

El ciclo canónico es:

```text
INCIDENCIA
→ PATRÓN
→ PRIORIDAD
→ SOLUCIÓN SISTÉMICA
→ VALIDACIÓN
→ MEDICIÓN
```

## Principios

1. Las incidencias se agrupan por patrón antes de corregirse ficha por ficha.
2. La prioridad distingue integridad, documentación, relaciones, cobertura y presentación.
3. Una solución sistémica prevalece sobre una sucesión de excepciones locales.
4. No todas las relaciones obedecen al mismo contrato: se diferencian relaciones nucleares y proyecciones públicas deliberadas.
5. Una corrección conserva UUID, Fuentes e histórico siempre que sea posible.
6. Las guardas preventivas deben acompañar a la reconciliación del dato.
7. Toda reducción se mide antes y después.
8. El Panel ofrece acciones editoriales concretas, no solo métricas abstractas.
9. La cola vuelve a fotografiarse periódicamente; cerrar un ciclo no cierra la disciplina.

## Primer ciclo cerrado

El primer ciclo detectó seis relaciones nucleares publicadas con uno o ambos extremos no publicables.

Ámbito:

- Hermandad ↔ Imagen;
- Hermandad ↔ Paso;
- Imagen ↔ Paso.

Resultado:

```text
Relaciones nucleares incoherentes
6 → 0
```

Se implantaron funciones, triggers, políticas y pruebas transaccionales para impedir la regresión.

Las proyecciones deliberadas de acompañamientos musicales y dedicatorias se conservaron porque disponen de un contrato público desacoplado y no deben degradarse mediante una regla mecánica.

## Implementación vigente

- `lib/panel/data-health.js`;
- Panel → Datos → Salud;
- guardas de relaciones públicas;
- pruebas de invariantes y autoridad pública;
- migraciones:
  - `20260823230534_guard_core_public_relations`;
  - `20260823231543_guard_core_public_relations`;
  - `20260823231639_complete_core_relation_invariant`.

## Severidad y acción

La cola puede clasificar incidencias como críticas, advertencias o mejoras informativas y dirigir a la sección exacta del Panel donde resolverlas.

La ausencia de Fuente, media, autoría, contexto o ficha especializada no se trata igual que una violación de integridad. La severidad debe reflejar el riesgo real.

## Regla de no regresión

No se persigue un cero cosmético ocultando incidencias ni despublicando información válida sin análisis. Cada nuevo patrón debe justificar su contrato, su solución y su métrica.

**SALUD DEL GRAFO → 🟢 COLA EDITORIAL CANÓNICA**
