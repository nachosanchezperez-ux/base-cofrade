# Certificación · auditoría de acontecimientos pasados en `announced`

**Corte temporal:** 15 de septiembre de 2026, fecha local `Europe/Madrid`

**HEAD inicial:** `9a8de434bba436d92eed005d7d3b78d3c0643258`

**Lote HC-016:** `c0160021-0000-4000-8000-000000000001`

## Inventario real

La consulta canónica usa la fecha local de Madrid y, para las ocurrencias de Culto, `COALESCE(end_date, start_date)`. Esta última regla evita perder las ocurrencias de un solo día cuyo `end_date` es nulo.

| Tabla | Pasados en `announced` al inicio |
|---|---:|
| `events` | 20 |
| `outings` | 38 |
| `cult_occurrences` | 67 |
| **Total** | **125** |

El inventario registro a registro —ID, slug cuando existe en el modelo, título, corporación, tipo, municipio, fecha, estado, Fuentes y relaciones— queda conservado en [`AUDITORIA-PAST-ANNOUNCED-INVENTARIO-2026-09-15.csv`](./AUDITORIA-PAST-ANNOUNCED-INVENTARIO-2026-09-15.csv).

## Clasificación documental

| Clasificación | Registros | Acción |
|---|---:|---|
| Celebración confirmada | 13 | `held` |
| Suspensión o cancelación confirmada | 0 | Ninguna |
| Aplazamiento confirmado | 0 | Ninguna |
| Sin evidencia posterior suficiente | 112 | Se conserva `announced` |
| Duplicado o relación incorrecta | 0 | Ninguna |

No se ha utilizado como prueba el mero vencimiento, una convocatoria previa, un calendario automático ni una publicación que solo anuncie el acto.

## Registros confirmados

### Acontecimientos históricos

| ID | Acontecimiento | Fecha | Evidencia ya vinculada |
|---|---|---|---|
| `35000000-0000-0000-0000-000000000001` | Aprobación de las reglas de la Asunción de Cantillana | 1805-03-01 | Historia oficial de la Hermandad |
| `0f528808-a102-49b1-a30c-11ec7b41a7a5` | Fundación de San Esteban | 1926-05-09 | Artículo histórico oficial de la Hermandad |
| `15000000-0000-0000-0000-000000000002` | Imposición de la corona de María Santísima de la Caridad | 1960-03-20 | Historia oficial del Baratillo |
| `15000000-0000-0000-0000-000000000003` | Reconocimiento canónico de la coronación de la Caridad | 2009-01-01 | Historia oficial del Baratillo |

Los cuatro nodos conservan una relación canónica `involves` con su Hermandad o Imagen y una Fuente retrospectiva. No se ha alterado el grafo.

### Salidas de 2026

| ID | Salida | Fecha | Evidencia posterior incorporada |
|---|---|---|---|
| `d4debf08-2ffc-40ef-9e9b-001056634cf8` | Consolación de Utrera | 2026-09-08 | [UtreraWeb](https://www.utreraweb.com/noticias-de-utrera/feria/2026/21420/miles-de-fieles-acompanan-a-la-virgen-de-consolacion-en-su-procesion-por-utrera-video/) |
| `f2269fd6-67d9-470f-a1c3-1bc4f39c65db` | Romería de Setefilla | 2026-09-08 | [La Caja Cofrade](https://lacajacofrade.es/virgen-setefilla-2026-galeria-antonio-nuno/) |
| `fe8a73c6-d4bb-404e-9509-d3c911d862ce` | Estrella de Coria del Río | 2026-09-08 | Comunicación posterior del Ayuntamiento de Coria del Río |
| `ddb20bf2-4bf5-4976-b8e1-c8ec1b94e04e` | Virgen del Valle de Écija | 2026-09-08 | Comunicación posterior de la Hermandad del Rocío de Écija |
| `99467611-8d13-4f7e-8e31-2bb46f905e1e` | Consolación de Osuna | 2026-09-08 | Comunicación posterior de la Hermandad de Fátima de Osuna |
| `f5d2e6a6-21b4-4462-9510-e4f9292ae4af` | Sangre de Gerena · coronación | 2026-09-12 | [Mundo Cofrade](https://www.mundocofrade.es/articulo/actualidad/gerena-vive-jornada-historica-coronacion-canonica-virgen-sangre/20260914123359007998.html) |
| `323a20d6-b16e-4004-b171-351ecc420a2d` | Cristo de la Vera Cruz de Tocina | 2026-09-14 | Crónica posterior de El Pespunte |
| `34fd555f-8ca2-4651-90d6-ff7712635ec4` | Procesión eucarística de San Bernardo | 2026-09-14 | [Arte Sacro](https://www.artesacro.org/Noticia/Ver/169082/san-bernardo-recupero-paso-nino-jesus-procesion-santisimo) |

### Culto de 2026

La crónica posterior de Arte Sacro confirma expresamente que la Función de la Exaltación de la Santa Cruz de San Bernardo se celebró y que, a su término, tuvo lugar la procesión eucarística. Por ello la ocurrencia `e8a729e6-3f7c-47ea-a2d1-7e8d0440ff64` pasa también a `held` y comparte la misma Fuente posterior.

## Casos preservados

Quedan **112** registros pasados legítimamente en `announced`:

- 16 `events`, todos convocatorias de costaleros sin evidencia posterior suficiente;
- 30 `outings` con Fuentes previas, programas o calendarios, pero sin confirmación posterior bastante;
- 66 `cult_occurrences`: 64 con documentación previa y 2 sin Fuente vinculada.

La ausencia de crónica posterior no demuestra ni celebración ni cancelación. Los 112 casos quedan identificados individualmente en el inventario CSV para una revisión futura sin pérdida de contexto.

## Composición y resultado

| Operación lógica | Cantidad |
|---|---:|
| Actualizaciones de estado | 13 |
| Fuentes nuevas | 8 |
| Enlaces de trazabilidad nuevos | 9 |
| **Total HC-016** | **30** |

El staging terminó `30/30` válido, `0` inválido. Apply terminó `30/30`, `0` fallos. La receta fue ejecutada una segunda vez: permanecieron exactamente 8 Fuentes y 9 enlaces, confirmando idempotencia. No hubo DDL, tablas, migraciones estructurales, RLS, estados nuevos ni cambios ajenos al estado de los acontecimientos.

## QA de datos

- 13/13 destinos terminaron en `held`.
- 0 fechas futuras convertidas a `held` en `events`, `outings` o `cult_occurrences`.
- 0 slugs duplicados en `entities` y `outings`.
- 0 huérfanos en `source_links`, `outing_entities`, `accompaniments` y `cult_occurrences`.
- 0 elementos pasados en `upcoming_calendar_items`.
- 0 elementos de fecha incorrecta en `today_calendar_items`.
- 0 cancelaciones, suspensiones o aplazamientos inferidos.

## QA técnico y cierre

- Suite completa: **784/784 tests**, 0 fallos.
- Build de producción y TypeScript: correctos con Next.js 16.3.0.
- `git diff --check`: correcto.
- Las advertencias del build corresponden a la ausencia deliberada de variables públicas de Supabase en el entorno local; el build finalizó correctamente y las consultas de datos se verificaron directamente contra el proyecto remoto.
- PR, SHA final, deployment y errores runtime se consignan en el cierre operativo una vez terminado el pipeline. Glorias de octubre no se abrió durante esta auditoría.

## Recomendación única

Una vez que la PR de esta auditoría esté fusionada, producción coincida con su SHA y vuelvan a existir 0 PR abiertas, **procede abrir Glorias de octubre como el siguiente y único macrolote**. No se recomienda mezclarlo con una segunda pasada sobre los 112 registros preservados: estos requieren nueva evidencia posterior, no más inferencia.
