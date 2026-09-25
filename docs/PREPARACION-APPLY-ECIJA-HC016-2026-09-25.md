# Preparación de Apply · Écija · HC-016

**Fecha:** 25 de septiembre de 2026  
**Estado:** **CANDIDATO PREPARADO · NO AUTORIZADO · NO EJECUTADO**  
**Staging:** `c0160036-0000-4000-8000-000000000001` · ready 776/776

## Candidato

Archivo:

`supabase/migrations_archive/post-first-edition-editorial/20260925093000_apply_ecija_noveno_macrolote_hc016.sql`

Blob Git:

`30a26f8b6cad2fb26b1cf2527ad63ae814c9a5e5`

Commit de creación:

`cb5cdf24040d2afc95e392d6b7cd90421500987b`

Token previsto:

`APPLY_ECIJA_SQL_OK_COMMITTED`

## Equivalencia

El candidato se deriva exclusivamente del preflight certificado.

Al revertir:

1. cabecera APPLY → PREFLIGHT;
2. comentario de estado;
3. token `APPLY_ECIJA_SQL_OK_COMMITTED` → `PREFLIGHT_ECIJA_SQL_OK_ROLLED_BACK`;
4. `COMMIT` → `ROLLBACK`;

el archivo coincide **byte a byte** con el preflight certificado.

Revisión estática:

- 1 `BEGIN`;
- 1 `COMMIT`;
- 0 `ROLLBACK`;
- 0 `DELETE`;
- 0 DDL;
- 0 RLS;
- 0 `CREATE/ALTER/DROP/TRUNCATE/GRANT/REVOKE`.

## Contrato

- 776 DML;
- 770 UPSERT;
- 6 UPDATE/REUSE;
- 15 nodos externos reutilizados;
- 0 DELETE;
- 0 DDL;
- 0 RLS.

## Seguridad

El import mantiene en metadata:

- `apply_candidate.prepared = true`;
- `apply_candidate.authorized = false`;
- `next_gate = explicit Apply authorization`.

**El candidato NO se ha ejecutado.**

La siguiente puerta requiere una autorización separada para Apply.
