# Certificación de cierre · Lebrija · sexto macrolote municipal HC-016

**Fecha:** 20 de septiembre de 2026  
**Import:** `c0160033-0000-4000-8000-000000000001`  
**Namespace:** `c0160033-*`  
**Régimen:** FIRST EDITION FREEZE  
**Esquema:** sin DDL · sin cambios de RLS  
**Estado final:** **CERRADO Y CERTIFICADO**

## 1. Refresh final

El Apply se ejecutó después de refrescar las superficies operativas:

- GitHub `main`: `7183f9dcd7cdaa65c683d1e3288349c29f3cf738`;
- PR abiertas: **0**;
- Vercel producción: `dpl_8Mn6ca5Se5h4HFPTGPmXRxVCS1vW` · **READY** · SHA coincidente con `main`;
- `hilocofrade.es`: HTTP **200**;
- Supabase `Hilocofrade`: **ACTIVE_HEALTHY** · PostgreSQL 17 · **12/12** migraciones estructurales.

## 2. Puertas previas al Apply

| Control | Resultado |
|---|---:|
| REUSE | **32/32** |
| REUSE ausentes | **0** |
| Colisiones de namespace | **0** |
| Colisiones de slugs de entidad | **0** |
| Colisiones de slugs de lugares | **0** |
| Colisiones de slugs de municipios | **0** |
| Colisiones de URLs de Fuente | **0** |
| Manifiesto | **473/473** |
| Posiciones únicas | **473/473** |
| IDs de staging únicos | **473/473** |
| Filas válidas | **473** |
| Inválidas | **0** |
| Aplicadas antes del Apply | **0** |
| Fallos antes del Apply | **0** |

El manifiesto conservó el MD5 `cc290edd20e22703dd0f5eb9aa65d95d`.

El payload congelado es el blob Git `8cad07054b7ed90a90dd3f304d8d8ca34b693451`, SHA-256 `bd42b741fa2d2a177b00f756c9b11383d952cce93b9f75dcebdd94c12a9a78cc`, con **143.343 caracteres** y contrato `BEGIN + ROLLBACK`.

## 3. Preflight global final

El payload exacto se ejecutó otra vez en producción dentro de una única transacción y terminó en `ROLLBACK`.

Resultado:

`PREFLIGHT_LEBRIJA_SQL_OK_ROLLED_BACK`

Recuento certificado:

- **473** DML;
- **471** upsert;
- **2** update;
- **0** delete;
- **32** REUSE;
- **0 residuos**.

## 4. Apply transaccional

El mismo núcleo DML se ejecutó en una única transacción con:

- bloqueo asesor por lote;
- bloqueo del import y de sus 473 items;
- guardas sobre estado, hash, posiciones, IDs y reparto de operaciones;
- validaciones internas del grafo antes del cierre del importador;
- `COMMIT` único después de superar todas las guardas.

Resultado:

`APPLY_LEBRIJA_OK_COMMITTED`

| Campo | Resultado |
|---|---:|
| Estado | `completed` |
| Expected | 473 |
| Staged | 473 |
| Valid | 473 |
| Invalid | 0 |
| Applied | **473** |
| Failed | **0** |
| Items `applied` | **473/473** |
| `apply_authorized` | `true` |

## 5. Fotografía productiva

| Control | Resultado |
|---|---:|
| Corporaciones publicadas de Lebrija | **12** |
| Hermandades nuevas | **11** |
| Imágenes canónicas relacionadas | **24** |
| Imágenes nuevas | **23** |
| Pasos canónicos | **23** |
| Salidas nuevas | **14** |
| Series nuevas | **16** |
| Posiciones musicales nuevas | **12** |
| Asignaciones musicales nuevas | **12** |
| Periodos musicales nuevos | **12** |
| Cultos nuevos | **5** |
| Ediciones cultuales nuevas | **3** |
| Fuentes nuevas | **31** |
| Enlaces de Fuente nuevos | **123** |
| Entidades nuevas | **64** |
| Lugares nuevos | **6** |
| Municipios soporte nuevos | **2** |

Los dos `UPDATE` quedan limitados y verificados:

- Salida de Nuestra Señora del Castillo: serie canónica enlazada y estado `held`;
- Hermandad del Castillo: `current_procession_day = 'Jueves Santo y 12 de septiembre'`.

## 6. Integridad

Resultado del QA posterior al commit:

- colisiones de slugs de entidad: **0**;
- colisiones de slugs de lugar: **0**;
- colisiones de slugs de municipio: **0**;
- colisiones de URLs de Fuente: **0**;
- Hermandades huérfanas: **0**;
- Bandas huérfanas: **0**;
- Imágenes huérfanas: **0**;
- Pasos huérfanos: **0**;
- relaciones Hermandad–Imagen, Hermandad–Paso e Imagen–Paso huérfanas: **0**;
- Salidas y series huérfanas: **0**;
- posiciones, asignaciones y periodos musicales huérfanos: **0**;
- Cultos y ediciones huérfanas: **0**;
- enlaces de Fuente sin Fuente o sin objeto relacionado: **0**.

## 7. QA público

Se verificaron las doce fichas de Hermandad y las cuatro fichas nuevas de Banda:

- **16/16** responden HTTP **200**;
- **16/16** publican canonical propio;
- **15/16** publican `index, follow`;
- todas corresponden al deployment productivo certificado.

La ficha de **Rocío de Lebrija** responde HTTP 200 y canonical propio, pero publica `noindex, follow`. No es un fallo del Apply: el mínimo editorial transversal exige, además de identidad, resumen y Fuentes, una relación visible entre Imágenes, Pasos, cronología, música, patrimonio o Cultos. La ficha solo dispone por ahora de la Salida documentada y permanece como deuda editorial legítima, sin inventar relaciones.

Superficies transversales:

- `/hermandades`: HTTP **200** y Lebrija visible;
- `/bandas`: HTTP **200** y Lebrija visible;
- `/agenda-cofrade`: HTTP **200**;
- `/sitemap.xml`: HTTP **200**.

Las fichas individuales de Hermandades y Bandas continúan fuera del sitemap dinámico. Es una limitación transversal ya existente y no se abre una excepción específica para Lebrija.

## 8. Runtime

En la ventana posterior al QA del deployment `dpl_8Mn6ca5Se5h4HFPTGPmXRxVCS1vW`:

- errores `error` / `fatal`: **0**;
- respuestas observadas: **48 HTTP 200** y **1 HTTP 308**;
- respuestas 4xx observadas: **0**;
- respuestas 5xx observadas: **0**.

## 9. Cierre operativo

**LEBRIJA · CERRADA Y CERTIFICADA.**

No queda un frente editorial municipal activo. No se abre automáticamente Osuna, Carmona, Écija, Utrera, Sanlúcar la Mayor ni ningún municipio procedente de rankings anteriores.

El siguiente movimiento municipal requiere un nuevo recálculo provincial desde cero y una orden expresa.
