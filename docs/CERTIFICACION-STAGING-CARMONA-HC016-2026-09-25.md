# Certificación de staging · Carmona · HC-016

**Fecha:** 25 de septiembre de 2026  
**Import:** `c0160035-0000-4000-8000-000000000001`  
**Estado:** **READY · 530/530 VÁLIDAS · 0 APLICADAS**  
**Apply autorizado:** **NO**

## Registro

El staging fue ejecutado con autorización expresa del usuario y se limitó a:

- `public.bulk_imports`;
- `public.bulk_import_items`.

No ejecutó el payload editorial ni modificó entidades, salidas, relaciones, Fuentes o música.

Resultado persistido:

- expected_items: **530**;
- staged_items: **530**;
- valid_items: **530**;
- invalid_items: **0**;
- applied_items: **0**;
- failed_items: **0**;
- status: `ready`;
- staging_result: `STAGING_CARMONA_MANIFEST_OK`;
- apply_authorized: `false`.

## Desglose

El manifiesto conserva 530 posiciones únicas y consecutivas:

- sources: 35;
- places: 7;
- entities: 75;
- brotherhoods: 9;
- bands: 6;
- images: 42;
- brotherhood_images: 29;
- entity_locations: 9;
- steps: 18;
- brotherhood_steps: 18;
- image_steps: 31;
- outing_series: 11;
- outings: 12;
- outing_entities: 50;
- outing_music_positions: 18;
- outing_music_assignments: 17;
- music_accompaniment_periods: 14;
- source_links: 129.

Operación efectiva:

- **528 UPSERT**;
- **2 UPDATE**: Fuente Servitas y Salida Servitas 19/09;
- 8 REUSE externos referenciados por el lote.

## Preflight después del staging

Después de persistir el staging se volvió a ejecutar el payload rollback-only completo sobre el estado real de Supabase, ya con **17 migraciones**.

Resultado:

`PREFLIGHT_CARMONA_SQL_OK_ROLLED_BACK`

- logical_dml: 530;
- entities: 75;
- new_outings: 11;
- source_links: 129;
- music_positions: 18;
- music_assignments: 17;
- residuos editoriales después del rollback: **0**.

## Reconciliación con main

Durante la apertura de Carmona, `main` avanzó a `0ee0c78adac28f63e2ecd04b08c146e4342b44bf` por HC-PERF-SUPABASE-01.

Ese cambio:

- añade dos migraciones de rendimiento para `home_knowledge_threads`;
- lleva producción a 17 migraciones;
- no modifica tablas ni contratos usados por el lote de Carmona;
- no altera el payload editorial;
- ha sido incorporado al estado canónico de #933.

## Siguiente puerta

El staging queda **cerrado y certificado**.

El candidato de Apply puede prepararse y revisarse, pero **no puede ejecutarse sin autorización expresa nueva**.
