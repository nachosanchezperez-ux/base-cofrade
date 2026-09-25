# Preparación del preflight SQL · Écija · HC-016

**Fecha:** 25 de septiembre de 2026  
**Estado:** PREPARADO, CORREGIDO Y REVISADO ESTÁTICAMENTE · **NO EJECUTADO**  
**Rama:** `hc016/ecija-pre-row-by-row-20260925`  
**Payload:** [`20260925083000_preflight_ecija_noveno_macrolote_hc016.sql`](../supabase/migrations_archive/post-first-edition-editorial/20260925083000_preflight_ecija_noveno_macrolote_hc016.sql)

## Contrato

- 776 operaciones DML lógicas;
- 15 REUSE externos;
- 0 DELETE;
- 0 DDL;
- 0 RLS;
- ejecución futura exclusivamente en `BEGIN … ROLLBACK`;
- token esperado: `PREFLIGHT_ECIJA_SQL_OK_ROLLED_BACK`.

## Revisión estática

| Familia | Esperado | Archivo |
|---|---:|---:|
| sources | 40 | 40 |
| places | 11 | 11 |
| entities | 99 | 99 |
| brotherhoods | 15 | 15 |
| bands | 18 | 18 |
| images | 34 | 34 |
| brotherhood_images | 34 | 34 |
| entity_locations | 15 | 15 |
| steps | 32 | 32 |
| brotherhood_steps | 32 | 32 |
| image_steps | 34 | 34 |
| outing_series | 16 | 16 |
| outings | 16 | 16 |
| outing_entities | 66 | 66 |
| outing_music_positions | 32 | 32 |
| outing_music_assignments | 28 | 28 |
| music_accompaniment_periods | 27 | 27 |
| source_links | 227 | 227 |
| **TOTAL** | **776** | **776** |

Además:

- 1 `BEGIN`;
- 1 `ROLLBACK`;
- 0 `COMMIT`;
- 4 bloques `DO $$ … $$;`;
- token de éxito único;
- 0 sentencias `DELETE`, `ALTER`, `CREATE`, `DROP`, `TRUNCATE`, `GRANT` o `REVOKE`;
- 4 bloques `DO $ … $;` correctamente cerrados;
- 26 UUID externos auditados contra producción: **0 inexistentes**.

## Corrección durante la revisión

La primera revisión estática detectó un UUID de municipio de Utrera mal transcrito en la fila de BCT Nuestra Señora de la Palma.

- UUID incorrecto: `e4319248-831a-4f4c-8a1f-d6cf83f2446e`;
- UUID canónico: `e4319248-831a-4f4c-adb8-19c496f95dd6`.

Se corrigió tanto en el plan row-by-row como en el payload SQL.

Después de la corrección se auditaron **todos los UUID externos** del archivo y el resultado fue `missing = []`.

El payload revisado conserva exactamente:

- 776/776 filas lógicas;
- 1 `BEGIN`;
- 1 `ROLLBACK`;
- 0 `COMMIT`;
- token único `PREFLIGHT_ECIJA_SQL_OK_ROLLED_BACK`.

## Guardas del payload

1. namespace `c0160036-*` vacío;
2. existencia exacta de los 15 REUSE externos;
3. ausencia de colisiones de slugs, Lugares y URLs nuevas;
4. invariantes finales del manifiesto.

## Invariantes principales

- 96 entidades nuevas bajo namespace;
- Expiración y Confalón conservan UUID y pasan a `published`;
- el Paso de Columna y Azotes conserva su UUID;
- Virgen del Valle recibe 0 relaciones;
- Borriquita y Cautivo comparten corporación;
- Las Penas conserva tipo Agrupación Parroquial;
- 16 Salidas `held`;
- 32 Pasos / 34 image_steps;
- 4 posiciones sin assignment;
- la capilla no identificada del Cautivo se conserva como assignment textual;
- 27 periodos musicales cerrados a 2026;
- Álvarez Quintero usa el nodo canónico;
- el duplicado legado no recibe relaciones nuevas;
- ECI-F41 no genera Fuente duplicada;
- ECI-F26 no se materializa.

## Seguridad

Este documento **no certifica un dry-run**.

El SQL no se ha enviado a Supabase.

La siguiente puerta exige autorización expresa para ejecutar el preflight rollback-only. Staging y Apply continúan fuera de alcance.
