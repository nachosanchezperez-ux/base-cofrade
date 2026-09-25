# Preparación del preflight SQL · Carmona · HC-016

**Fecha:** 25 de septiembre de 2026  
**Estado:** PREPARADO Y REVISADO ESTÁTICAMENTE · **NO EJECUTADO**  
**Rama:** `hc016/carmona-pre-row-by-row`  
**PR:** #933  
**Payload:** [`20260925050000_preflight_carmona_octavo_macrolote_hc016.sql`](../supabase/migrations_archive/post-first-edition-editorial/20260925050000_preflight_carmona_octavo_macrolote_hc016.sql)

## Contrato

- **530 operaciones DML lógicas**;
- **8 REUSE externos**;
- **0 DELETE**;
- **0 DDL**;
- **0 RLS**;
- ejecución futura exclusivamente dentro de `BEGIN … ROLLBACK`;
- token de éxito: `PREFLIGHT_CARMONA_SQL_OK_ROLLED_BACK`.

## Revisión estática

El archivo archivado se releyó desde GitHub y se comprobó de forma independiente:

| Familia | Esperado | Archivo |
|---|---:|---:|
| sources nuevos | 34 | 34 |
| source UPDATE/REUSE | 1 | 1 |
| places | 7 | 7 |
| entities | 75 | 75 |
| brotherhoods | 9 | 9 |
| bands | 6 | 6 |
| images | 42 | 42 |
| brotherhood_images | 29 | 29 |
| entity_locations | 9 | 9 |
| steps | 18 | 18 |
| brotherhood_steps | 18 | 18 |
| image_steps | 31 | 31 |
| outing_series | 11 | 11 |
| outings nuevos | 11 | 11 |
| outing UPDATE/REUSE | 1 | 1 |
| outing_entities | 50 | 50 |
| outing_music_positions | 18 | 18 |
| outing_music_assignments | 17 | 17 |
| music_accompaniment_periods | 14 | 14 |
| source_links | 129 | 129 |
| **TOTAL** | **530** | **530** |

También se verificó:

- exactamente un `BEGIN`;
- exactamente un `ROLLBACK`;
- token de éxito único;
- 0 líneas de sentencia que comiencen por `DELETE`, `ALTER`, `CREATE`, `DROP`, `TRUNCATE`, `GRANT` o `REVOKE`;
- secuencia musical normalizada por cortejo: primera posición = 1; segunda = 2;
- Desamparados conserva una posición explícita de silencio y 0 assignments;
- MAFERMAN existe como entidad candidata, pero 0 assignments de septiembre;
- Servitas 19/09 conserva su UUID y slug y no recibe relación de Paso.

## Colisiones semánticas

La base productiva fue consultada **solo en lectura** después de generar el SQL.

Resultado: **0 colisiones** para:

- 75 slugs de entidades;
- nombres exactos de las 6 Bandas nuevas;
- 7 slugs de Lugares;
- 34 URLs de Fuentes nuevas.

Estas mismas comprobaciones quedaron incorporadas al payload como **Guardia 3**, para repetirse automáticamente el día del ensayo.

## Guardas previas del payload

1. **Namespace:** aborta si existe cualquier residuo `c0160035-*` en las familias troncales.
2. **REUSE:** aborta si falta cualquiera de los ocho UUID externos congelados.
3. **Semántica:** aborta si aparece una colisión nueva de slug, Banda, Lugar o URL antes del ensayo.

## Estado de seguridad

Este documento **no certifica un dry-run**. El SQL no se ha enviado a Supabase y no se ha abierto transacción alguna.

La siguiente puerta exige una autorización expresa para ejecutar el preflight rollback-only. Esa ejecución deberá producir todas las invariantes y terminar en `ROLLBACK`; solo entonces podrá certificarse el ensayo y evaluar staging. **Apply continúa fuera de alcance.**
