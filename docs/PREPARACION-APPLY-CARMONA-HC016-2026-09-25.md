# Preparación de Apply · Carmona · HC-016

**Fecha:** 25 de septiembre de 2026  
**Estado:** **CANDIDATO PREPARADO · NO AUTORIZADO · NO EJECUTADO**  
**PR:** #933  
**Staging:** `c0160035-0000-4000-8000-000000000001` · ready 530/530

## Candidato

Archivo:

`supabase/migrations_archive/post-first-edition-editorial/20260925070000_apply_carmona_octavo_macrolote_hc016.sql`

Blob Git:

`4f7875bbe3c9823132a2ac0b3c836f020b8d83e6`

Commit de creación:

`8ffd1ccf82c32979765ac253cea5854bbf6dd2f0`

Token de éxito previsto:

`APPLY_CARMONA_SQL_OK_COMMITTED`

## Equivalencia con el preflight certificado

El candidato se generó exclusivamente a partir del payload rollback-only certificado.

Al revertir estas cuatro diferencias controladas:

1. cabecera PRE-FLIGHT/APPLY;
2. comentario de estado;
3. token `APPLY_CARMONA_SQL_OK_COMMITTED` → `PREFLIGHT_CARMONA_SQL_OK_ROLLED_BACK`;
4. `COMMIT` → `ROLLBACK`;

el contenido resultante coincide **byte a byte** con el preflight certificado.

Revisión estática:

- 1 `BEGIN`;
- 1 `COMMIT`;
- 0 `ROLLBACK`;
- 0 `DELETE`;
- 0 DDL;
- 0 RLS;
- 0 `CREATE/ALTER/DROP/TRUNCATE/GRANT/REVOKE`.

## Cadena post-Apply ya preparada

### QA solo lectura

`20260925070500_post_apply_qa_carmona_hc016.sql`

Contrato:

- 0 INSERT;
- 0 UPDATE;
- 0 DELETE;
- 0 DDL;
- valida todos los recuentos del grafo;
- valida Servitas septiembre en `held`;
- valida Fuente servita reparada;
- valida ausencia de Paso en septiembre;
- valida silencio de Desamparados;
- valida que no existan corporaciones duplicadas;
- valida que MAFERMAN no se haya inferido.

### Reconciliación del staging

`20260925071000_reconcile_staging_carmona_post_apply_hc016.sql`

Solo puede ejecutarse si el Apply y el QA anterior han sido correctos.

Alcance:

- 2 UPDATE;
- exclusivamente `bulk_import_items` y `bulk_imports`;
- 0 INSERT;
- 0 DELETE;
- 0 DDL.

Dejaría el import en:

- status = `completed`;
- applied_items = 530;
- failed_items = 0.

## Secuencia preparada para una futura autorización

`preflight final → Apply → QA lectura → reconciliar staging → QA público/producción → reconciliar #933`

La autorización de staging recibida **no autoriza esta secuencia de Apply**.
