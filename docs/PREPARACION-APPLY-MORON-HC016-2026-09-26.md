# Preparación de Apply · Morón de la Frontera · HC-016

**Fecha:** 26 de septiembre de 2026  
**Estado:** **CANDIDATO PREPARADO · NO AUTORIZADO · NO EJECUTADO**  
**Staging:** `c0160037-0000-4000-8000-000000000001` · ready 504/504  
**Dry-run:** `DRY_RUN_MORON_SQL_OK_ROLLED_BACK`

## Candidato

Archivo:

`supabase/migrations_archive/post-first-edition-editorial/20260926113000_apply_moron_decimo_macrolote_hc016.sql`

Blob Git:

`29e83ff336ea4de8d7bcc99005d6a33ec948d90b`

Commit de creación:

`96d93728b052c2a3efe677c5b04b21fcbe539956`

Token previsto:

`APPLY_MORON_SQL_OK_COMMITTED`

## Equivalencia reversible

El candidato se deriva exclusivamente del dry-run certificado.

Al revertir estas cuatro diferencias:

1. cabecera APPLY → DRY-RUN;
2. comentario de estado;
3. token `APPLY_MORON_SQL_OK_COMMITTED` → `DRY_RUN_MORON_SQL_OK_ROLLED_BACK`;
4. `COMMIT` → `ROLLBACK`;

el contenido coincide **byte a byte** con el payload de dry-run certificado.

## Revisión estática

Candidato:

- 1 `BEGIN`;
- 1 `COMMIT`;
- 0 `ROLLBACK`;
- 0 `DELETE`;
- 0 DDL;
- 0 RLS;
- 504 DML lógicas;
- 4 REUSE externos.

## Seguridad

El import conserva:

- `apply_candidate.prepared = true`;
- `apply_candidate.authorized = false`;
- `apply_authorized = false`;
- `next_gate = explicit Apply authorization`.

**El candidato no se ha enviado a Supabase ni ejecutado.**

## Siguiente puerta

Morón queda **APTO PARA APPLY**, pero el Apply real requiere una orden expresa separada.
