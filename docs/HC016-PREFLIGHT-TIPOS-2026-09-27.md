# HC-016 · barrera de tipos de Hermandad

## Alcance autorizado

Refuerzo preventivo tras el cierre de Morón. Base verificada: main b7a7021a8e6ddf55c12d7450b2166988b95ebec4, producción dpl_6vKD4uMpqCtWhprTvWGJdg5xLy4G READY, Supabase ACTIVE_HEALTHY y 17 migraciones. #1000 permanece independiente. No se ejecutan DML, DDL, migraciones ni cambios RLS; no se reabre ningún municipio ni se corrigen registros ajenos.

## Importador del Panel

- INSERT y UPSERT efectivo INSERT requieren brotherhood_types explícito.
- El array debe tener al menos un elemento, sin NULL, duplicados, arrays anidados ni valores no canónicos. No se normaliza ni se infiere una clasificación.
- El catálogo se reutiliza de DIRECTORY_TYPES: Penitencia, Gloria, Sacramental, Agrupación Parroquial.
- UPDATE parcial sin el campo consulta y valida los tipos persistidos. Si son válidos se conserva el payload parcial; si están vacíos o son inválidos se bloquea hasta aportar una clasificación validada.
- Un tipo explícito válido permite corregir una fila vacía. No se admiten referencias para calcular tipos.
- Un registro inválido bloquea canApply del lote entero. Apply individual vuelve a preflightar antes de escribir.

La garantía cubre las filas brotherhoods incluidas en el lote del Panel; no inspecciona municipios ajenos ni todas las relaciones del grafo. No sustituye el QA de publicación ni convierte Apply por bloques en una transacción atómica.

## Puerta obligatoria para SQL directo HC-016

El SQL externo no pasa automáticamente por JavaScript. No declarar protegido un candidato por el mero hecho de que exista esta validación en el Panel.

1. Congelar el universo completo de IDs de Hermandad del candidato, incluidas las reutilizadas, en un archivo JSON: array de UUID explícitos, sin duplicados.
2. Incluir clasificación canónica validada en cada alta y conservar los tipos existentes en las reutilizaciones.
3. Generar la comprobación sin conexión a base:

   `node scripts/hc016-brotherhood-types-guard.mjs universo-ids.json > guard-tipos.sql`

4. Incorporar el bloque generado después del DML y **antes de ROLLBACK** en el dry-run. El universo debe coincidir con el manifiesto; no inferirlo mediante nombres, slugs o LIKE. El guard comprueba presencia de todas las filas y tipos resultantes, incluidas las REUSE.
5. Mantener las restantes puertas: frontera pública compartida de directorio/hub/sitemap, snapshot, preservación de tipos existentes, ausencia de cambios ajenos y cero residuos tras rollback.
6. Congelar el mismo guard dentro del candidato Apply, después del mismo DML y **antes de COMMIT**. Una excepción aborta la transacción: no omitirla, capturarla para continuar ni separar el guard en otra sesión.

El generador rechaza universos vacíos, UUID no válidos y duplicados. Solo produce un DO con lecturas, bloqueo compartido de las filas objetivo y RAISE EXCEPTION; no modifica datos, no contiene COMMIT y no abre conexión. No es una constraint de base: un SQL manual que omita esta puerta sigue pudiendo saltarse el contrato. El preflight HC-016 debe bloquear cualquier candidato que no la incorpore.

## Verificación

- Suite completa: 1.281/1.281 pruebas; build correcto.
- Regresiones: omisión equivalente a Morón, vacío, NULL, casing, valor inesperado, duplicados, array anidado, alta válida, actualización parcial con tipo persistido válido/inválido y corrección explícita.
- Guard SQL probado sin DML: Loreto y Santa Cruz pasan; UUID inexistente produce HC016_SCOPE; fila existente con array vacío produce HC016_TYPES. Las transacciones de prueba no contienen operaciones de escritura.
- Morón conserva su certificación y principal 504/504. No se reaplica ningún lote.
