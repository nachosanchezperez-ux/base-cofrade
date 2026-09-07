# HC-016.3 · Circuito seguro del importador

## Alcance

HC-016.3 cierra el hueco entre el preflight por registro de HC-016.1, la reutilización de Fuentes de HC-016.2 y la aplicación por bloques ya existente.

No introduce DDL, tablas, migraciones, RPC estructural ni cambios RLS.

## Auditoría del punto de partida

HC-016.1 ya cubría:

- contratos explícitos de `entities`, `brotherhoods`, `bands` y `sources`;
- rechazo de columnas inválidas;
- obligatorios condicionados al INSERT efectivo;
- referencias inexistentes y ambiguas;
- cálculo efectivo de INSERT o UPDATE.

HC-016.2 ya cubría:

- canonicalización estable de URLs;
- retirada de `utm_*`, identificadores de tracking y fragmentos;
- conservación y orden estable de query útil;
- equivalencia con o sin barra final cuando procede;
- reutilización de la Fuente más antigua equivalente;
- `effective_operation = reuse` y referencias deterministas a Fuentes.

Los huecos reales eran:

1. `finalize` permitía dejar `ready` un lote con filas inválidas y Apply escribía las válidas;
2. las colisiones solo se protegían por envío, no necesariamente entre envíos distintos;
3. una referencia a una entidad creada por otra fila del mismo lote se consultaba únicamente en la base existente;
4. el detalle no mostraba el plan efectivo completo por fila;
5. el texto del Panel describía expresamente una aplicación parcial.

## Garantía de preflight

Antes de pasar a `ready`, todas las filas se vuelven a validar como un conjunto. Apply queda bloqueado salvo que se cumpla:

- registros preflightados = registros declarados;
- inválidos = 0;
- referencias sin resolver = 0;
- ambigüedades no permitidas = 0;
- colisiones internas = 0;
- operación efectiva conocida en todas las filas.

La misma barrera se recalcula cuando el lote está `ready`, antes de cambiarlo a `processing`. Ninguna escritura canónica comienza si el resultado global deja de ser válido.

## Dependencias

La planificación reutiliza `bulkImportPriority`:

```text
Fuente → Entidad → Hermandad/Banda → Relaciones → Vínculos de Fuente
```

Las referencias pueden quedar `resolved` contra una fila existente o `planned` contra una fila válida de menor prioridad dentro del propio lote. Apply conserva la misma prioridad, por lo que un archivo desordenado genera el mismo plan efectivo que su versión ordenada.

## Lote canónico de regresión

`test/fixtures/hc-016-canonical-batch.json` cubre:

- cinco variantes equivalentes de una Fuente existente → `reuse` del mismo ID;
- Fuente nueva → `insert`;
- upsert existente → `update`;
- registro nuevo → `insert`;
- columna inválida → `INVALID_COLUMN`;
- obligatorio ausente en INSERT efectivo → `MISSING_REQUIRED_FIELD`;
- referencia inexistente → `UNRESOLVED_REFERENCE`;
- referencia ambigua → `AMBIGUOUS_REFERENCE`;
- destino incompatible repetido → `BATCH_COLLISION`;
- cadena relacional ordenada y desordenada → mismo plan.

El fixture utiliza un fake de Supabase y no escribe datos editoriales ni usa producción como banco de pruebas.

## Resultado por fila

Cada fila expone:

- tabla;
- operación solicitada;
- operación efectiva (`insert`, `update` o `reuse`);
- referencias resueltas o planificadas;
- errores;
- estado.

Los contadores del historial y el detalle separan las operaciones efectivas.

## Límite explícito

La barrera evita escrituras cuando un error determinista ya es conocible en preflight. No convierte Apply en una transacción SQL atómica de todo el lote. Alcanzar esa atomicidad exigiría ampliar la capa estructural y queda fuera de HC-016.3; #492 continúa abierta y aislada antes de cualquier cambio de esquema.
