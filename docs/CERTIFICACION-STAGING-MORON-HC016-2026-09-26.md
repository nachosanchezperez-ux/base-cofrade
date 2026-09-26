# Certificación de staging · Morón de la Frontera · HC-016

**Fecha:** 26 de septiembre de 2026  
**Import:** `c0160037-0000-4000-8000-000000000001`  
**Estado:** **READY · 504/504 VÁLIDAS · 0 APLICADAS**  
**Apply autorizado:** **NO**  
**Dry-run de Apply autorizado:** **NO**  
**Namespace editorial:** `c0160037-*` · **0 filas materializadas**

## 1. Alcance ejecutado

El staging se ejecutó con autorización expresa del usuario y quedó limitado a:

- `public.bulk_imports`;
- `public.bulk_import_items`.

No se ejecutó ninguna de las 504 operaciones editoriales del manifiesto. No se creó el municipio, ninguna Hermandad, Banda, Imagen, Paso, Salida, relación, Fuente o posición musical.

Resultado persistido:

- expected_items: **504**;
- staged_items: **504**;
- valid_items: **504**;
- invalid_items: **0**;
- applied_items: **0**;
- failed_items: **0**;
- status: `ready`;
- staging_result: `STAGING_MORON_MANIFEST_OK`;
- apply_authorized: `false`;
- dry_run_apply_authorized: `false`.

## 2. Desglose certificado

| Familia | Esperado | Staging | PASS |
|---|---:|---:|---|
| municipalities | 1 | 1 | ✅ |
| sources | 24 | 24 | ✅ |
| places | 8 | 8 | ✅ |
| entities | 73 | 73 | ✅ |
| brotherhoods | 10 | 10 | ✅ |
| bands | 10 | 10 | ✅ |
| images | 35 | 35 | ✅ |
| brotherhood_images | 20 | 20 | ✅ |
| entity_locations | 10 | 10 | ✅ |
| steps | 18 | 18 | ✅ |
| brotherhood_steps | 18 | 18 | ✅ |
| image_steps | 35 | 35 | ✅ |
| outing_series | 10 | 10 | ✅ |
| outings | 10 | 10 | ✅ |
| outing_entities | 53 | 53 | ✅ |
| outing_music_positions | 19 | 19 | ✅ |
| outing_music_assignments | 19 | 19 | ✅ |
| music_accompaniment_periods | 19 | 19 | ✅ |
| source_links | 112 | 112 | ✅ |
| **TOTAL** | **504** | **504** | ✅ |

Las 504 posiciones son únicas y consecutivas, desde 1 hasta 504. Las 504 operaciones de staging declaran `upsert`; no existe ninguna fila con operación distinta.

## 3. QA de staging

Verificado sobre `bulk_import_items`:

- filas: **504**;
- posiciones únicas: **504**;
- mínimo: **1**;
- máximo: **504**;
- status `valid`: **504**;
- status `invalid`: **0**;
- status `applied`: **0**;
- `applied_at IS NOT NULL`: **0**;
- `result IS NOT NULL`: **0**;
- `error_text IS NOT NULL`: **0**.

El staging es por tanto puramente declarativo y no contiene señales de ejecución.

## 4. Post-staging preflight

Después de persistir el staging se ejecutó un preflight de solo lectura contra el estado real.

Token:

`POST_STAGING_PREFLIGHT_MORON_OK`

Resultado:

- **15/15 guardas PASS**;
- 19/19 familias con recuento exacto;
- municipio `moron-de-la-frontera`: **0 filas materializadas**;
- namespace editorial `c0160037-*`: **0 filas**;
- colisiones de slugs de entities: **0**;
- colisiones de slugs de places: **0**;
- colisiones de URLs de sources: **0**;
- 4/4 REUSE musicales presentes y tipados;
- taxonomías `mystery`, `palio`, `cross_guide` presentes;
- `participation_mode=unspecified` presente;
- `event_status=held` presente.

## 5. HC-AUTO-03

Permanece fuera de este frente y sin cambios:

- status: `ready`;
- expected: **55**;
- valid: **55**;
- applied: **0**;
- failed: **0**.

## 6. Contrato congelado

Se preserva el manifiesto integrado mediante #973:

- 504 operaciones futuras;
- 504 UPSERT/INSERT planificadas;
- 0 UPDATE;
- 0 DELETE;
- 4 REUSE externos;
- 35 Imágenes canónicas para 37 figuras físicas;
- 18 Pasos;
- 10 Salidas históricas 2026;
- 18 posiciones musicales de Paso + 1 Cruz de Guía;
- Ars Sacra: NO RELACIONAR 2026.

## 7. Puerta

**MORÓN DE LA FRONTERA · STAGING CERRADO Y CERTIFICADO.**

Este cierre **NO autoriza dry-run de Apply ni Apply**.

Cualquier siguiente fase debe partir de este import exacto, revalidar drift de `main`, producción y Supabase y requerir una orden posterior separada.
