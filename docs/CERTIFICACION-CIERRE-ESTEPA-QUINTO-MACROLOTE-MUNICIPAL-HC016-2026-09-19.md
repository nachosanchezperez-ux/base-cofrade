# Certificación de cierre · Estepa · quinto macrolote municipal HC-016

**Fecha:** 19 de septiembre de 2026  
**Import:** `c0160032-0000-4000-8000-000000000001`  
**Namespace:** `c0160032-*`  
**Régimen:** FIRST EDITION FREEZE  
**Esquema:** sin DDL · sin cambios de RLS  
**Estado final:** **CERRADO Y CERTIFICADO**

## 1. Refresh final

El Apply se ejecutó únicamente después de refrescar las cuatro superficies operativas:

- GitHub `main`: `0c4e9ddcdcf4d1fdffe7d86d22874d50b90a13ac`;
- PR abiertas: **0**;
- Vercel producción: `dpl_6WfzreQehmpjFby8sB8VsZpXQSoW` · **READY** · alias `hilocofrade.es` sin error;
- Supabase `Hilocofrade`: **ACTIVE_HEALTHY** · **12/12** migraciones estructurales.

## 2. Puertas previas al Apply

Antes de escribir el grafo productivo se revalidó:

| Control | Resultado |
|---|---:|
| REUSE | **21/21** |
| REUSE ausentes | **0** |
| Colisiones de namespace | **0** |
| Colisiones de slugs de entidad | **0** |
| Colisiones de slugs de lugares | **0** |
| Colisiones de slugs de municipios | **0** |
| Colisiones de URLs de Fuente | **0** |
| Source links sobre la Fuente candidata a borrar | **0** |
| Manifest | **495/495** |
| Posiciones únicas | **495/495** |
| IDs de staging únicos | **495/495** |
| Filas válidas | **495** |
| Inválidas | **0** |
| Aplicadas antes del Apply | **0** |
| Fallos antes del Apply | **0** |

El manifiesto conservó el hash `36e4ef5449b77311616a35173d2f5190`.

El payload congelado fue el blob `52892537871a2ba9cbbe7fe9030d1b9005369d6c`, con **145.295 caracteres** y contrato `BEGIN + ROLLBACK`, sin `COMMIT` ni escrituras sobre el importador.

## 3. Preflight global final

El payload exacto se ejecutó de nuevo en producción dentro de transacción y terminó en `ROLLBACK`.

Resultado:

`PREFLIGHT_ESTEPA_SQL_OK_ROLLED_BACK`

Recuento certificado:

- **495** DML;
- **490** upsert;
- **4** update;
- **1** delete;
- **21** REUSE.

No quedó residuo productivo del preflight.

## 4. Apply transaccional

Con todas las guardas en verde, el mismo núcleo DML se ejecutó dentro de una única transacción. El import y sus 495 items se bloquearon para impedir una ejecución concurrente o doble.

Resultado:

`APPLY_ESTEPA_OK_COMMITTED`

El `COMMIT` solo se produjo después de superar las guardas internas de grafo. En la misma transacción se cerró el importador:

| Campo | Resultado |
|---|---:|
| Estado | `completed` |
| Expected | 495 |
| Staged | 495 |
| Valid | 495 |
| Invalid | 0 |
| Applied | **495** |
| Failed | **0** |
| Items `applied` | **495/495** |

`apply_authorized=true` queda registrado en la metadata del import.

## 5. Fotografía productiva del grafo

Tras el Apply:

| Control | Resultado |
|---|---:|
| Hermandades publicadas de Estepa | **13** |
| Hermandades nuevas | **12** |
| Imágenes publicadas relacionadas | **28** |
| Pasos publicados relacionados | **18** |
| Bandas nuevas | **7** |
| Bandas locales publicadas de Estepa | **4** |
| outing_series nuevas | **13** |
| Salidas nuevas | **13** |
| Salidas `held` | **11** |
| Salidas `announced` | **2** |
| Posiciones musicales | **16** |
| Asignaciones musicales | **16** |
| Periodos musicales | **14** |
| Cultos | **8** |
| Ediciones cultuales | **8** |
| Acontecimientos | **1** |
| Fuentes nuevas | **23** |
| Enlaces de Fuente | **143** |
| Entidades nuevas `c0160032-*` | **67/67 publicadas** |
| Lugares nuevos | **4** |
| Municipios soporte nuevos | **2** |

## 6. Guardas editoriales preservadas

- La Fuente duplicada `dc375c1f-9318-4de9-ae1f-d1f10a7d050f` fue eliminada después de verificar **0 referencias**.
- La Fuente canónica `72ac1537-8940-4455-8e8d-c17169baa0aa` permanece.
- El Paso existente de Nuestro Padre Jesús Nazareno y sus relaciones Hermandad–Paso e Imagen–Paso quedan `published`.
- Los Estudiantes conservan **0 posiciones musicales inventadas**.
- Santa Ana conserva **0 posiciones musicales inventadas**.
- Colisiones externas de slug tras el Apply: **0**.
- Colisiones de las 23 URLs nuevas de Fuente: **0**.

## 7. QA público

Se comprobó el alias productivo `hilocofrade.es` después del Apply.

### Hermandades

Las **13/13** fichas de Hermandad de Estepa responden HTTP **200**, publican canonical propio y `index, follow`:

- Borriquita;
- Angustias;
- San Pedro;
- Estudiantes;
- Dulce Nombre;
- Calvario;
- Paz y Caridad;
- Santo Entierro;
- Asunción;
- Remedios;
- Carmen;
- Santa Ana;
- Jesús Nazareno.

### Bandas

Las **7/7** fichas nuevas de Banda responden HTTP **200**, canonical propio e `index, follow`.

### Superficies transversales

- `/hermandades`: HTTP **200** y Estepa visible;
- `/bandas`: HTTP **200** y Estepa visible;
- `/agenda-cofrade`: HTTP **200** y contenido de Estepa visible;
- `/sitemap.xml`: HTTP **200** y referencias territoriales de Estepa presentes.

Las fichas individuales de Hermandades y Bandas siguen sin incorporarse al sitemap dinámico, comportamiento transversal ya existente y no específico de Estepa. No se abre una corrección SEO municipal para forzar una excepción.

## 8. Runtime

Deployment productivo certificado:

- ID: `dpl_6WfzreQehmpjFby8sB8VsZpXQSoW`;
- estado: **READY**;
- alias error: **null**;
- errores runtime en la ventana posterior al QA: **0**;
- respuestas 4xx observadas: **0**;
- respuestas 5xx observadas: **0**.

## 9. Cierre operativo

**ESTEPA · CERRADA Y CERTIFICADA.**

No queda un frente editorial municipal activo. No se abre automáticamente Osuna, Utrera, Sanlúcar la Mayor ni ningún municipio procedente de rankings anteriores.

El siguiente movimiento municipal, cuando se ordene, debe partir de un **nuevo recálculo provincial desde cero**.
