# Certificación · preflight SQL de Lebrija · sexto macrolote municipal HC-016

**Fecha:** 20 de septiembre de 2026  
**Base:** `cfe09de269b05c3c7eca42c89046b3eccab1b6bc`  
**Resultado:** `PREFLIGHT_LEBRIJA_SQL_OK_ROLLED_BACK`  
**Apply:** 0

## Contrato

- 473/473 DML;
- 471 INSERT/UPSERT;
- 2 UPDATE;
- 0 DELETE;
- 32/32 REUSE;
- 0 DDL y 0 RLS.

El payload completo se ejecutó contra Supabase producción dentro de una única transacción. Las validaciones internas finalizaron correctamente y se ejecutó `ROLLBACK` explícito.

## Payload

`supabase/migrations_archive/post-first-edition-editorial/20260920090000_preflight_lebrija_sexto_macrolote_hc016.sql`

- Git blob: `8cad07054b7ed90a90dd3f304d8d8ca34b693451`;
- SHA-256: `bd42b741fa2d2a177b00f756c9b11383d952cce93b9f75dcebdd94c12a9a78cc`;
- caracteres: 143.343;
- contiene `BEGIN` y `ROLLBACK`;
- no contiene `COMMIT` ni escrituras sobre el importador.

## Integridad simulada

- 12 corporaciones;
- 24 Imágenes canónicas, una de ellas REUSE;
- 23 Pasos;
- 16 series;
- 14 Salidas nuevas;
- 12 relaciones musicales;
- 5 Cultos;
- 123 enlaces de Fuente;
- 0 duplicados, huérfanos nucleares o colisiones.

Los conteos de las 25 tablas afectadas y la huella del universo Castillo coincidieron antes y después. El namespace productivo `c0160033-*` permaneció vacío.

## Veredicto

**LEBRIJA · PAYLOAD SQL VALIDADO · 0 RESIDUOS**

