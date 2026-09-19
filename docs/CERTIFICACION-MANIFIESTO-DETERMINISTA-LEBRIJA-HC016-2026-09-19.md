# Certificación · manifiesto determinista de Lebrija · HC-016

**Fecha:** 19 de septiembre de 2026  
**Base:** `1997d61f7fe0f38b3df3398dba85c01a90572e39`  
**Resultado:** **MANIFIESTO 465/465 CONGELADO**  
**Namespace:** `c0160033-*`  
**Import reservado:** `c0160033-0000-4000-8000-000000000001`  
**Staging:** 0 · **Apply:** 0

## Certificación

Se revalidó producción antes de congelar IDs:

- namespace: 0 filas;
- bulk imports del namespace: 0;
- 64 slugs de entidades: 0 colisiones;
- 6 slugs de lugares: 0 colisiones;
- 2 slugs de municipios soporte: 0 colisiones;
- 3 agentes nuevos: 0 coincidencias nominales exactas;
- Fuentes: 30 URLs nuevas + 1 URL exacta reconciliada como REUSE.

Contrato exacto:

- **465 DML**;
- **463 upsert**;
- **2 update**;
- **0 delete**;
- **32 REUSE**.

La corrección final respecto al corte 464 incorpora a San Juan Evangelista de la Borriquita como tercera imagen procesional de la estación de penitencia, compartiendo el misterio con Nuestro Padre Jesús en su Entrada Triunfal. No crea Paso adicional.

## Puerta

Autorizado:
**payload SQL exacto → ejecución transaccional completa → ROLLBACK → QA de residuos**.

No autorizado:
- staging;
- Apply;
- segundo municipio;
- DDL;
- RLS.
