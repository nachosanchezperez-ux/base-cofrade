# Certificación de preflight SQL · Écija · HC-016

**Fecha:** 25 de septiembre de 2026  
**Proyecto Supabase:** `kcevwkucqzcyrqaimyhl`  
**Payload:** `supabase/migrations_archive/post-first-edition-editorial/20260925083000_preflight_ecija_noveno_macrolote_hc016.sql`  
**Blob SQL ejecutado:** `4d31951fd722e618da6802d3c92744325ca2bb49`  
**Resultado:** **PREFLIGHT CERRADO · ROLLBACK CONFIRMADO · 0 RESIDUOS**

## Ejecución autorizada

La autorización recibida cubría exclusivamente el **preflight SQL rollback-only de Écija**.

No autorizaba:
- staging;
- Apply.

## Resultado

Supabase devolvió:

`PREFLIGHT_ECIJA_SQL_OK_ROLLED_BACK`

Recuentos:

- logical_dml: **776**;
- new_entities: **96**;
- outings: **16**;
- source_links: **227**;
- music_positions: **32**;
- music_assignments: **28**.

El payload alcanzó todas las invariantes y terminó en `ROLLBACK`.

## Postflight

Se comprobaron 16 familias bajo el namespace `c0160036-*`:

- entities;
- sources;
- places;
- brotherhood_images;
- entity_locations;
- brotherhood_steps;
- image_steps;
- outing_series;
- outings;
- outing_entities;
- outing_music_positions;
- outing_music_assignments;
- music_accompaniment_periods;
- source_links;
- bulk_imports;
- bulk_import_items.

Resultado:

- `total_residues = 0`;
- `all_zero = true`.

## Nodos externos UPDATE/REUSE

Los tres nodos externos modificados temporalmente durante el ensayo volvieron a su estado previo:

### Expiración de Écija
- entity_status = `draft`;
- municipality_id = `NULL`;
- canonical_see_place_id = `NULL`;
- current_procession_day = `NULL`.

### Confalón de Écija
- entity_status = `draft`;
- municipality_id = `NULL`;
- canonical_see_place_id = `NULL`;
- current_procession_day = `NULL`.

### Paso del Cristo de la Columna y Azotes
- entity_status = `draft`;
- step_type = `NULL`;
- description = `NULL`.

## Contrato certificado

El ensayo demuestra que el lote puede materializarse coherentemente sobre el estado de base observado:

- 776 DML;
- 770 UPSERT;
- 6 UPDATE/REUSE;
- 15 nodos externos reutilizados;
- 0 DELETE;
- 0 DDL;
- 0 RLS.

## Siguiente puerta

**Preflight SQL: CERRADO Y CERTIFICADO.**

La siguiente puerta posible es **staging del manifiesto de Écija**, pero requiere autorización separada.

Apply continúa fuera de alcance.
