# Certificación de Apply y cierre · Carmona · HC-016

**Fecha:** 25 de septiembre de 2026  
**Import:** `c0160035-0000-4000-8000-000000000001`  
**PR:** #933  
**Resultado editorial:** **APPLY CERRADO · QA VERDE · STAGING RECONCILIADO**

## Apply

La autorización expresa del usuario cubrió:

`Apply → QA → reconciliación staging → QA producción → cierre #933`

Antes del Apply se ejecutó de nuevo el preflight rollback-only:

`PREFLIGHT_CARMONA_SQL_OK_ROLLED_BACK`

El candidato aplicado fue:

`supabase/migrations_archive/post-first-edition-editorial/20260925070000_apply_carmona_octavo_macrolote_hc016.sql`

Resultado devuelto por Supabase:

`APPLY_CARMONA_SQL_OK_COMMITTED`

Recuentos:

- logical_dml: **530**;
- entities: **75**;
- new_outings: **11**;
- source_links: **129**;
- music_positions: **18**;
- music_assignments: **17**.

## QA estructural y semántico

El QA post-Apply de solo lectura devolvió:

- `counts_ok = true`;
- `semantic_ok = true`.

Recuentos certificados:

- 9 corporaciones;
- 6 Bandas nuevas;
- 42 Imágenes;
- 29 relaciones de titularidad;
- 9 sedes;
- 18 Pasos;
- 18 relaciones corporación–Paso;
- 31 relaciones Imagen–Paso;
- 11 series;
- 11 salidas nuevas;
- 50 participaciones;
- 18 posiciones musicales;
- 17 assignments;
- 14 periodos musicales;
- 129 source_links.

Reglas semánticas certificadas:

- Servitas 19/09 reutiliza el UUID histórico y queda `held`;
- la Fuente servita original queda reparada;
- no se infiere Paso para Servitas 19/09;
- Desamparados queda sin assignment musical;
- no existen corporaciones duplicadas para Desamparados ni La Borriquita;
- MAFERMAN no recibe assignment histórico sin evidencia posterior.

## Reconciliación de staging

Resultado:

`RECONCILE_CARMONA_STAGING_OK_COMMITTED`

Estado final del import:

- status: `completed`;
- expected_items: 530;
- staged_items: 530;
- valid_items: 530;
- invalid_items: 0;
- applied_items: **530**;
- failed_items: **0**;
- post_apply_qa: `PASS`.

## QA público

La publicación se validó contra el deployment productivo:

- deployment: `dpl_FLPvzp9K8yM3nminuUq9jLuDEFzm`;
- SHA de producción durante el QA: `30ba99ade2210160eae04c45bf18c43627baf734`;
- 15 fichas nuevas de Hermandades/Bandas comprobadas;
- **15/15 HTTP 200**;
- ficha de Expiración verificada con canonical, sede, titulares y pasos renderizados;
- 0 respuestas 4xx en el deployment durante la ventana de QA;
- 0 respuestas 5xx;
- 0 clusters de error runtime.

Las rutas comprobadas cubren las nueve corporaciones y las seis Bandas nuevas.

## Intervenciones paralelas

Mientras Carmona estaba abierta, `main` incorporó HC-PERF-SUPABASE-01/02/03.

Estos cambios son independientes del lote:

- 17 migraciones estructurales en Supabase;
- optimización de Home y reducción de fan-out de source_links;
- sin cambios del contrato de tablas usado por Carmona;
- el Apply y el QA se ejecutaron sobre ese estado actual.

## Cierre

**HC-016 · Carmona queda CERRADO y publicado.**

No queda staging pendiente de Carmona. El namespace `c0160035-*` pasa de reservado a productivo.

La integración de #933 es documental/archivo de recetas y no necesita reejecutar datos.
