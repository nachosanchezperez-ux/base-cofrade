# Certificación · manifiesto determinista de Lebrija · HC-016

**Fecha:** 19 de septiembre de 2026  
**Base:** `5fbd8c72a4fb8d18368d0188052683263820c0da`  
**Resultado:** **MANIFIESTO 473/473 CONGELADO**  
**Namespace:** `c0160033-*`  
**Import reservado:** `c0160033-0000-4000-8000-000000000001`  
**Staging:** 0 · **Apply:** 0

## Certificación

La congelación se ha rehecho sobre el row-by-row corregido de **473 DML**.

Puertas revalidadas antes de reservar los IDs:

- namespace `c0160033-*`: **0 filas** en producción/importador;
- 64 slugs nuevos de `entities`: **0 colisiones**;
- 6 slugs de `places`: **0 colisiones**;
- 2 slugs de municipios soporte: **0 colisiones**;
- 3 agentes nuevos: **0 coincidencias nominales exactas**;
- 32 referencias URL planificadas: **31 nuevas + 1 REUSE**;
- las 31 URLs nuevas: **0 coincidencias exactas** en `sources.url`;
- **32/32 REUSE** reconciliados.

Contrato exacto:

- **473 DML**;
- **471 upsert**;
- **2 update**;
- **0 delete**;
- **32 REUSE**.

## Estabilidad de IDs

Se preservan íntegramente los UUID lógicos del manifiesto previo de 465 operaciones.

La corrección de San Pedro añade únicamente ocho UUID nuevos:

1. Fuente · `c0160033-0131-4000-8000-000000000031`.
2. Outing · `c0160033-0974-4000-8000-000000000014`.
3. Outing entity · `c0160033-1004-4000-8000-000000000024`.
4. Music position · `c0160033-1022-4000-8000-000000000012`.
5. Music assignment · `c0160033-1042-4000-8000-000000000012`.
6. Music period · `c0160033-1062-4000-8000-000000000012`.
7. Source link · `c0160033-2122-4000-8000-000000000122`.
8. Source link · `c0160033-2123-4000-8000-000000000123`.

La serie anual de San Pedro ya estaba reservada como:
`c0160033-0955-4000-8000-000000000015`.

## Posiciones del futuro import

Las posiciones quedan congeladas de 1 a **473**. Los futuros `bulk_import_items.id` se calcularán mediante:

`md5('HC016-LEBRIJA-20260919-' || position)::uuid`

El orden de ejecución lo determina la posición del import, no el ordinal interno de los UUID lógicos.

## Puerta

Autorizado:

**construir SQL exacto de 473 DML → comprobar contrato BEGIN/ROLLBACK → ejecutar el payload completo con ROLLBACK → certificar 0 residuos.**

No autorizado:

- staging;
- creación de `bulk_imports`;
- Apply;
- segundo municipio;
- DDL;
- RLS.
