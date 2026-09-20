# Certificación · staging READY de Lebrija · sexto macrolote municipal HC-016

**Fecha:** 20 de septiembre de 2026  
**Municipio:** Lebrija  
**Import:** `c0160033-0000-4000-8000-000000000001`  
**Estado:** `ready`  
**Apply autorizado:** **NO**

## Veredicto

**LEBRIJA · STAGING READY · 473/473 · 0 APPLY**

El payload SQL validado se ha incorporado al circuito HC-016 mediante staging gobernado. No se ha ejecutado ninguna DML editorial del lote sobre el grafo de producción.

## Estado del staging

| Campo | Valor |
|---|---:|
| expected_items | 473 |
| staged_items | 473 |
| valid_items | 473 |
| invalid_items | 0 |
| applied_items | 0 |
| failed_items | 0 |
| status | ready |

`bulk_import_items`:

- 473 filas;
- 473 posiciones únicas;
- 473 IDs deterministas únicos;
- 473 `status=valid`;
- 0 errores de validación;
- 471 operaciones editoriales `upsert`;
- 2 operaciones editoriales `update`.

El campo técnico `operation` permanece como `upsert` por el CHECK del importador. La operación editorial real se conserva en `record.actual_operation`.

Hash del manifiesto de staging:

`cc290edd20e22703dd0f5eb9aa65d95d`

## Preflight global posterior

Después de crear el staging se volvió a ejecutar el payload completo contra Supabase:

`PREFLIGHT_LEBRIJA_SQL_OK_ROLLED_BACK`

Resultado:

- 473/473 DML simuladas;
- 32/32 REUSE;
- `ROLLBACK` explícito;
- 0 residuos productivos;
- staging conservado en `ready`;
- `apply_authorized=false`.

## Estado productivo

Tras el staging:

- entities `c0160033-*`: 0;
- sources `c0160033-*`: 0;
- places `c0160033-*`: 0;
- outings `c0160033-*`: 0;
- source_links `c0160033-*`: 0.

## Puerta de Apply

El import está preparado, pero no autorizado para Apply. Antes de cualquier ejecución editorial deberá repetirse:

1. refresh GitHub, Vercel y Supabase;
2. 32/32 REUSE;
3. namespace, slugs y URLs;
4. manifiesto 473/473;
5. preflight global final;
6. autorización explícita de Apply.

