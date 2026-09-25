# Certificación de preflight SQL · Carmona · HC-016

**Fecha:** 25 de septiembre de 2026  
**Proyecto Supabase:** `kcevwkucqzcyrqaimyhl`  
**Rama:** `hc016/carmona-pre-row-by-row`  
**PR:** #933  
**Payload:** [`20260925050000_preflight_carmona_octavo_macrolote_hc016.sql`](../supabase/migrations_archive/post-first-edition-editorial/20260925050000_preflight_carmona_octavo_macrolote_hc016.sql)  
**Resultado:** **PREFLIGHT CERRADO · ROLLBACK CONFIRMADO · 0 RESIDUOS**

## Ejecución autorizada

La autorización recibida cubría exclusivamente el **preflight SQL rollback-only**. No autorizaba staging ni Apply.

El payload se recuperó directamente de la rama y se ejecutó contra producción dentro de su propia transacción.

### Primer intento

El primer envío abortó antes del primer INSERT por un error sintáctico en la tercera guarda: el delimitador `DO $$` había quedado persistido como `DO $` durante una transformación documental.

Error:

`ERROR 42601 · syntax error at or near "$"`

No se ejecutó el lote editorial. Se corrigió exclusivamente el delimitador procedural, se verificaron los cuatro bloques `DO $$ ... $$;` y se reintentó el mismo contrato.

### Segundo intento

Resultado devuelto por Supabase:

`PREFLIGHT_CARMONA_SQL_OK_ROLLED_BACK`

Recuentos devueltos:

- logical_dml: **530**;
- entities: **75**;
- new_outings: **11**;
- source_links: **129**;
- music_positions: **18**;
- music_assignments: **17**.

Todas las invariantes del manifiesto fueron superadas antes de alcanzar el `ROLLBACK`.

## Postflight de residuos

Después del ensayo se consultaron las familias afectadas por el namespace `c0160035-*`.

Resultado: **0 residuos totales**.

Familias comprobadas:

- `entities`: 0;
- `sources`: 0;
- `places`: 0;
- `brotherhood_images`: 0;
- `entity_locations`: 0;
- `brotherhood_steps`: 0;
- `image_steps`: 0;
- `outing_series`: 0;
- `outings`: 0;
- `outing_entities`: 0;
- `outing_music_positions`: 0;
- `outing_music_assignments`: 0;
- `music_accompaniment_periods`: 0;
- `source_links`: 0.

`all_zero = true`.

## Comprobación de los REUSE modificados durante el ensayo

El `ROLLBACK` devolvió también los dos nodos externos que el payload actualiza temporalmente a su estado productivo previo.

### Fuente servita

UUID `f5c7c0c1-63c8-42b3-b1e8-fac89b01de83`

Después del rollback:

- nombre: `Servitas Carmona · publicación oficial en Instagram`;
- URL: `NULL`;
- publication_date: `NULL`.

### Salida servita del 19/09

UUID `ea6ab0d1-e6c4-4ea1-8727-92cee4ce3218`

Después del rollback:

- slug original conservado;
- `event_status = announced`;
- `brotherhood_entity_id = NULL`;
- `origin_place_id = NULL`.

Por tanto, el ensayo **no dejó cambios persistentes en producción**.

## Contrato certificado

El preflight demuestra que el lote congelado puede materializarse coherentemente bajo el estado de base observado en esta ejecución:

- 530 DML lógicas;
- 8 REUSE externos;
- 0 DELETE;
- 0 DDL;
- 0 RLS;
- 75 entidades nuevas;
- 42 Imágenes;
- 18 Pasos;
- 11 Salidas nuevas;
- una Salida servita reutilizada;
- 50 participaciones de Salida;
- 18 posiciones musicales;
- 17 assignments;
- 14 periodos musicales;
- 129 source_links.

## Siguiente puerta

**Preflight SQL: CERRADO Y CERTIFICADO.**

Este cierre **no autoriza staging ni Apply**.

La siguiente acción posible es preparar/ejecutar staging del manifiesto de Carmona únicamente tras una autorización separada. Hasta entonces producción permanece sin cambios.
