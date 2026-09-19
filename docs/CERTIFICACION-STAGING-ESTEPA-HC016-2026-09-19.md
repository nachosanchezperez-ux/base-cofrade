# Certificación · staging READY de Estepa · quinto macrolote municipal HC-016

**Fecha:** 19 de septiembre de 2026  
**Municipio:** Estepa  
**Import:** `c0160032-0000-4000-8000-000000000001`  
**Estado:** `ready`  
**Apply autorizado:** **NO**

## Veredicto

**ESTEPA · STAGING READY · 495/495 · 0 APPLY**

El mismo payload SQL archivado y preflighted se ha incorporado al circuito HC-016 mediante un staging gobernado. No se ha ejecutado ninguna operación editorial sobre las tablas de producción.

## Preflight previo al staging

Estado de entrada:

- main: `4aa0807b983ca376a62992bc393e27ae02b04df4`;
- 0 PR abiertas;
- Vercel producción: `dpl_FNzKdVi3Fy96FeV8yX8uBzGP9KMt` · READY;
- Supabase: ACTIVE_HEALTHY;
- migraciones: 12/12;
- namespace `c0160032-*`: libre;
- 21/21 REUSE presentes;
- Fuente duplicada candidata: 0 referencias;
- Estepa productiva antes del staging: 1 Hermandad · 0 Bandas · 2 Salidas.

## Payload de referencia

Archivo inmutable de staging:

`supabase/migrations_archive/post-first-edition-editorial/20260919120000_preflight_estepa_quinto_macrolote_hc016.sql`

Identidad:

- Git blob: `52892537871a2ba9cbbe7fe9030d1b9005369d6c`;
- commit de referencia: `4aa0807b983ca376a62992bc393e27ae02b04df4`;
- caracteres: 145.295;
- contiene BEGIN;
- contiene ROLLBACK;
- no contiene COMMIT;
- no toca `bulk_imports` ni `bulk_import_items`.

## Staging

`bulk_imports`:

| Campo | Valor |
|---|---:|
| expected_items | 495 |
| staged_items | 495 |
| valid_items | 495 |
| invalid_items | 0 |
| applied_items | 0 |
| failed_items | 0 |
| status | ready |

`bulk_import_items`:

- 495 filas;
- 495 posiciones únicas;
- 495 IDs deterministas únicos;
- 495 `status=valid`;
- 0 validation_errors;
- 490 operaciones efectivas `upsert`;
- 4 operaciones efectivas `update`;
- 1 operación efectiva `delete`.

El campo técnico `operation` permanece como `upsert` por el CHECK del importador. La operación editorial real queda guardada en `record.actual_operation`.

Hash del manifiesto:

`36e4ef5449b77311616a35173d2f5190`

## Breakdown

- municipalities: 2
- sources: 24 movimientos · 23 altas + 1 DELETE
- places: 4
- entities: 68 movimientos · 67 altas + 1 UPDATE
- brotherhoods: 12
- bands: 7
- band_names: 1
- agents: 3
- agent_names: 3
- agent_disciplines: 3
- images: 27
- brotherhood_images: 27
- image_authorships: 8
- steps: 18 movimientos · 17 altas + 1 UPDATE
- brotherhood_steps: 18 movimientos · 17 altas + 1 UPDATE
- image_steps: 20 movimientos · 19 altas + 1 UPDATE
- outing_series: 13
- outings: 13
- outing_entities: 18
- outing_music_positions: 16
- outing_music_assignments: 16
- music_accompaniment_periods: 14
- cults: 8
- cult_occurrences: 8
- events: 1
- source_links: 143

## Preflight global post-staging

Después de crear el staging se volvió a leer el mismo archivo desde GitHub y se ejecutó completo contra Supabase.

Resultado:

`PREFLIGHT_ESTEPA_SQL_OK_ROLLED_BACK`

Guardas:
- 13 Hermandades;
- 28 Imágenes;
- 18 Pasos;
- 7 Bandas nuevas;
- 13 Salidas;
- 16 posiciones;
- 16 asignaciones;
- 14 periodos;
- 8 Cultos;
- 8 ediciones;
- 23 Fuentes;
- 143 source_links;
- 0 música inventada en Estudiantes;
- 0 música inventada en Santa Ana;
- 0 residuos productivos.

## Estado productivo después del staging

El staging no altera el grafo editorial.

Continúan:

- namespace `c0160032-*` en entities: 0;
- namespace en sources: 0;
- namespace en places: 0;
- Estepa: 1 Hermandad publicada;
- Estepa: 0 Bandas locales publicadas;
- Estepa: 2 Salidas existentes.

## Puerta de Apply

El import está `ready`, pero:

`apply_authorized = false`

No se ejecutará Apply sin una nueva orden explícita.

Antes de un eventual Apply deberá repetirse:
1. refresh GitHub/Vercel/Supabase;
2. 21/21 REUSE;
3. namespace y slugs sin colisión;
4. manifiesto 495/495;
5. preflight global final;
6. solo entonces Apply transaccional + QA productivo.

