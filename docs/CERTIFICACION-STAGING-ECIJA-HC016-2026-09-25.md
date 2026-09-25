# Certificación de staging · Écija · HC-016

**Fecha:** 25 de septiembre de 2026  
**Import:** `c0160036-0000-4000-8000-000000000001`  
**Estado:** **READY · 776/776 VÁLIDAS · 0 APLICADAS**  
**Apply autorizado:** **NO**

## Registro

El staging se ejecutó con autorización expresa y se limitó exclusivamente a:

- `public.bulk_imports`;
- `public.bulk_import_items`.

No ejecutó el payload editorial.

Resultado:

- expected_items: **776**;
- staged_items: **776**;
- valid_items: **776**;
- invalid_items: **0**;
- applied_items: **0**;
- failed_items: **0**;
- status: `ready`;
- staging_result: `STAGING_ECIJA_MANIFEST_OK`;
- apply_authorized: `false`.

## QA del manifiesto

- 776 posiciones;
- 776 posiciones únicas;
- 770 operaciones efectivas UPSERT;
- 6 operaciones efectivas UPDATE/REUSE;
- 0 filas no válidas;
- 0 filas con `applied_at`;
- 0 filas con `result`.

Las seis posiciones UPDATE/REUSE son:

- 56 · entity Expiración;
- 58 · entity Confalón;
- 132 · entity Paso Columna/Azotes;
- 155 · brotherhood Expiración;
- 157 · brotherhood Confalón;
- 280 · step Columna/Azotes.

## Desglose

- sources: 40;
- places: 11;
- entities: 99;
- brotherhoods: 15;
- bands: 18;
- images: 34;
- brotherhood_images: 34;
- entity_locations: 15;
- steps: 32;
- brotherhood_steps: 32;
- image_steps: 34;
- outing_series: 16;
- outings: 16;
- outing_entities: 66;
- outing_music_positions: 32;
- outing_music_assignments: 28;
- music_accompaniment_periods: 27;
- source_links: 227.

## Preflight post-staging

Después de persistir el staging se volvió a ejecutar el payload rollback-only completo.

Resultado:

`PREFLIGHT_ECIJA_SQL_OK_ROLLED_BACK`

Postflight:

- 0 residuos editoriales bajo `c0160036-*`;
- Expiración = `draft`;
- Confalón = `draft`;
- Paso Columna/Azotes = `draft`;
- staging conserva `ready · 776/776 · applied=0`.

## Siguiente puerta

Staging: **CERRADO Y CERTIFICADO**.

El candidato de Apply puede prepararse, pero no ejecutarse sin autorización expresa.
