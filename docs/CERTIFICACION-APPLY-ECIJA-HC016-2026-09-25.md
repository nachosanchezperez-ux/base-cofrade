# Certificación de Apply y cierre · Écija · HC-016

**Fecha:** 25 de septiembre de 2026  
**Import:** `c0160036-0000-4000-8000-000000000001`  
**Resultado:** **APPLY CERRADO · QA VERDE · STAGING RECONCILIADO · PRODUCCIÓN VERIFICADA**

## Apply

Autorización expresa recibida para:

`Apply → QA estructural/semántico → reconciliación staging → QA producción → cierre del macrolote`

Preflight final inmediatamente anterior:

`PREFLIGHT_ECIJA_SQL_OK_ROLLED_BACK`

Apply ejecutado:

`supabase/migrations_archive/post-first-edition-editorial/20260925093000_apply_ecija_noveno_macrolote_hc016.sql`

Resultado:

`APPLY_ECIJA_SQL_OK_COMMITTED`

Recuentos devueltos:

- logical_dml: **776**;
- new_entities: **96**;
- outings: **16**;
- source_links: **227**;
- music_positions: **32**;
- music_assignments: **28**.

## QA estructural

Resultado:

- `counts_ok = true`;
- `semantic_ok = true`.

Recuentos certificados:

- 40 Fuentes nuevas;
- 11 Lugares nuevos;
- 96 entidades nuevas;
- 15 sujetos corporativos;
- 18 Bandas/Capillas nuevas;
- 34 Imágenes;
- 34 brotherhood_images;
- 15 sedes;
- 32 Pasos;
- 32 brotherhood_steps;
- 34 image_steps;
- 16 series;
- 16 Salidas;
- 66 participaciones;
- 32 posiciones musicales;
- 28 assignments;
- 27 periodos musicales;
- 227 source_links.

## QA semántico

Queda certificado que:

- 16/16 Salidas están `held` y `published`;
- 96/96 entidades nuevas están `published`;
- Expiración, Confalón y Columna/Azotes pasan de draft a published conservando UUID;
- Las Penas permanece como **Agrupación Parroquial**;
- Borriquita y Cautivo comparten una sola corporación;
- Virgen del Valle no recibe relaciones del lote;
- no se usa Rescatado de La Solana;
- no se usa Columna/Azotes de Las Cigarreras;
- no se usa el duplicado legado de Álvarez Quintero;
- Confalón/Esperanza utiliza el nodo canónico Álvarez Quintero `7fafdc04-cb94-47d8-814f-5537639660ff`;
- existe exactamente un assignment textual sin Banda para la capilla no identificada del Cautivo;
- existen cuatro posiciones sin assignment: vivas, Silencio, Mortaja y matracas;
- los 27 periodos musicales están cerrados a 2026 con `is_current=false`;
- no existe duplicación corporativa dentro del universo canónico.

## Reconciliación del staging

Resultado:

`RECONCILE_ECIJA_STAGING_OK_COMMITTED`

Estado final:

- status = `completed`;
- expected_items = 776;
- staged_items = 776;
- valid_items = 776;
- invalid_items = 0;
- applied_items = **776**;
- failed_items = **0**;
- post_apply_qa = `PASS`.

## QA público

Se verificaron **45 rutas públicas**:

### Corporaciones

- **15/15 HTTP 200**;
- title y canonical correctos en todas las fichas.

### Bandas/Capillas

- **18/18 HTTP 200**;
- title y canonical correctos.

### Imágenes

Muestra de 6 fichas:

- 6/6 HTTP 200;
- canonical correcto.

### Pasos

Muestra de 6 fichas:

- 6/6 HTTP 200;
- incluye el Paso reutilizado de Columna y Azotes;
- canonical correcto.

Deployment observado durante el QA:

`dpl_EtawA1fo9Qe9wB6spHSEtoFMiC6R`

SHA de producción:

`65653b885ad3a2ed168837954b76406be2074d66`

Logs:

- rutas con `ecija` y 4xx: **0**;
- rutas con `ecija` y 5xx: **0**;
- runtime errors: **0**.

### Observación no bloqueante

En la ventana global del deployment aparecieron dos 404 ajenos a rutas de Écija:

- `/null`;
- `/imagenes/null`.

No contienen `ecija`, no aparecieron en el barrido de las 45 rutas del lote y se consideran una incidencia técnica independiente del cierre municipal. No se atribuyen a Écija sin evidencia adicional.

## Cierre

**HC-016 · Écija queda CERRADO Y PUBLICADO.**

El namespace `c0160036-*` pasa de reservado a productivo.

No queda staging pendiente de Écija y el payload no debe reejecutarse.

HC-AUTO-03 continúa bloqueado.

La siguiente prioridad municipal deberá nacer de un nuevo recálculo provincial y una orden expresa.
