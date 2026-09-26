# Certificación de dry-run SQL · Morón de la Frontera · HC-016

**Fecha:** 26 de septiembre de 2026  
**Staging:** `c0160037-0000-4000-8000-000000000001` · `ready` 504/504 · 0 aplicadas  
**Payload:** `supabase/migrations_archive/post-first-edition-editorial/20260926103000_dry_run_moron_decimo_macrolote_hc016.sql`  
**Blob Git:** `06da83b565c4c17b6f32a8d5ecaeda1201495528`  
**Resultado final:** **DRY-RUN CERRADO · ROLLBACK CONFIRMADO · 0 RESIDUOS**

## Contrato

- 504 operaciones DML lógicas;
- 504 UPSERT/INSERT;
- 4 REUSE externos;
- 0 UPDATE externos;
- 0 DELETE;
- 0 DDL;
- 0 RLS;
- 1 `BEGIN`;
- 1 `ROLLBACK`;
- 0 `COMMIT`.

## Primer intento

El primer dry-run abortó de forma segura por la restricción real:

`outing_music_positions_outing_id_sequence_no_key`

Jesús tenía simultáneamente:

- Cruz de Guía · `sequence_no=1`;
- Paso de Cristo · `sequence_no=1`;
- Palio · `sequence_no=2`.

La transacción abortó sin persistir filas. El postflight inmediato confirmó:

- namespace editorial `c0160037-*`: **0**;
- staging: **504 válidas**;
- applied_items: **0**.

## Corrección determinista

Se corrigió exclusivamente el orden musical de la salida de Jesús:

1. Cruz de Guía · juvenil Fuensanta;
2. Nuestro Padre Jesús Nazareno · AM Fuensanta;
3. María Santísima de los Dolores · Banda Municipal de Morón.

No cambia ninguna identidad, Fuente, Banda, Paso, Imagen, Salida o relación musical; únicamente satisface la unicidad estructural del orden dentro de la Salida.

El Plan ROW-BY-ROW queda reconciliado con esta secuencia.

## Segundo intento

Supabase devolvió:

`DRY_RUN_MORON_SQL_OK_ROLLED_BACK`

Recuentos certificados dentro de la transacción:

- logical_dml: **504**;
- entities: **73**;
- outings: **10**;
- source_links: **112**;
- music_positions: **19**;
- music_assignments: **19**.

Todas las invariantes del manifiesto fueron superadas antes del `ROLLBACK`.

## Postflight

Después del `ROLLBACK`:

- municipio materializado: **0**;
- namespace editorial `c0160037-*`: **0 filas**;
- staging: `ready 504/504`;
- applied_items: **0**;
- HC-AUTO-03 applied_items: **0**.

Por tanto, el dry-run no dejó datos editoriales persistentes.

## Gate

**MORÓN DE LA FRONTERA · DRY-RUN CERTIFICADO · APTO PARA APPLY.**

Este documento **no autoriza Apply**. La siguiente fase requiere una autorización expresa separada.
