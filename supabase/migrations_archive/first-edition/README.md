# Historial de migraciones · Primera Edición

Este directorio conserva las migraciones ejecutadas durante la construcción de
la Primera Edición hasta `20260831061147`, junto con los dos baselines
experimentales de #439.

No forma parte de la cadena ejecutable de Supabase. Las ramas nuevas aplican:

1. `20260831070000_first_edition_baseline.sql`;
2. las migraciones posteriores al baseline;
3. `supabase/seed.sql`, con datos mínimos de QA sin datos personales.

La separación evita que una preview `with_data=false` dependa de registros
creados históricamente desde el Panel. El archivo mantiene la trazabilidad
editorial y permite auditar las decisiones anteriores sin volver a ejecutar
DML histórico.

Regla desde este corte: toda migración nueva debe ser reproducible sobre el
baseline y no puede presuponer filas de producción ni datos del seed. Si
necesita datos canónicos, debe crearlos de forma idempotente dentro de la propia
migración.
