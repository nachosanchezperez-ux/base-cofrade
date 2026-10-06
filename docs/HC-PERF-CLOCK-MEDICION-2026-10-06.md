# HC-PERF · medición de la corrección de reloj · 6/10/2026

**NO-GO para producción.** Esta medición corresponde al código `fc7bcd547f3c4197bf1c0b13593416604719ee82`, preview `dpl_CrDRQELD2DEwFvf34necV1PkZgjg`, https://base-cofrade-dndvjm3n2-desdeel-arenal.vercel.app/ . Producción de referencia: `c1d9ef70b049c7d5317b9251822343b23280a622`, deployment `dpl_7jXMVaowgF8A9JEfGgSyoirkB9Nc`. Ambos READY, región de función dub1.

## Condiciones

Mismo ejecutor y protocolo por modo: GET HTML Brotli, primera petición y cinco repeticiones por cada una de las siete rutas en ambos entornos, secuencial con límite de una petición por segundo. `reuse`: curl HTTP/2 y seis transferencias en un proceso; `new`: HTTP/1.1, Connection: close y una conexión por petición. Sin purgas ni parámetros para forzar MISS. Un fallo de transporte se conserva como intento fallido, nunca se convierte en un TTFB cero ni se cuenta como respuesta del servidor.

Preview protegida: autorización explícita del usuario para generar acceso temporal solo para la comprobación; autenticación establecida fuera de la serie y cookie reutilizada para medir URLs limpias. El token y la cookie no se publican. La protección y el hostname difieren de producción; la comparación no aísla causalmente el coste del código. Tampoco una conexión nueva demuestra caché de datos fría.

El proxy del ejecutor añade varios segundos a túnel/TLS. El CSV separa conexión, túnel/TLS (`appconnect - connect`), espera desde pretransferencia (`starttransfer - pretransfer`) y descarga HTML (`total - starttransfer`), compresión, bytes transferidos/decodificados y región observable. Ninguna de estas métricas mide velocidad visual, LCP, INP, CLS ni Core Web Vitals.

## Resultado

168 intentos: 163 HTTP 200 con Brotli y 5 fallos de transporte (HTTP 000, sin respuesta de la aplicación). Túnel/TLS en conexiones nuevas correctas: 5,379–19,980 s. Los 163 HTML tienen una H1, canonical y JSON-LD parseable. Evidencias: [CSV completo](./evidence/HC-PERF-CLOCK-2026-10-06.csv) y [contenido/SEO por respuesta](./evidence/HC-PERF-CLOCK-CONTENT-2026-10-06.json).

| Ruta | Producción TTFB mediana (rango) | Caché | Preview TTFB mediana (rango) | Caché |
|---|---:|---|---:|---|
| Portada | 0.173 (0.168–0.209) s | MISS×4 | 0.461 (0.401–0.480) s | MISS×5 |
| El Baratillo | 0.058 (0.056–0.059) s | HIT×1, STALE×2 | 0.143 (0.124–0.257) s | HIT×3, STALE×2 |
| Banda del Sol | 0.055 (0.047–0.170) s | HIT×3, STALE×2 | 0.137 (0.130–0.237) s | HIT×3, STALE×2 |
| Bendición y Esperanza | 0.099 (0.048–0.161) s | HIT×3, STALE×2 | 0.141 (0.128–0.257) s | HIT×3, STALE×2 |
| Jesús Presentado al Pueblo | 0.065 (0.054–0.163) s | HIT×2, STALE×3 | 0.139 (0.127–0.240) s | HIT×4, STALE×1 |
| Aurora, Reina de la Mañana | 0.065 (0.053–0.163) s | HIT×4, STALE×1 | 0.130 (0.127–0.256) s | HIT×4, STALE×1 |
| Cruceta San Gonzalo | 0.055 (0.042–0.252) s | HIT×4, STALE×1 | 0.130 (0.130–0.350) s | HIT×4, STALE×1 |

La tabla usa solo respuestas HTTP 200 con `num_connects=0`. Por fallos al conectar, producción aporta cuatro observaciones reutilizadas de portada y tres de Baratillo; el resto de celdas aporta cinco. Los intentos fallidos y las conexiones de establecimiento están en el CSV, sin ocultarlos ni sustituirlos por respuestas de otra tanda.

La portada conserva MISS/private/no-store tanto en producción como en la corrección: el cambio evita cachear el reloj, no persigue convertir el HTML en HIT. La mediana observada de la candidata es mayor. **No se certifica mejora de rendimiento ni se atribuye la diferencia entera al código**, dada la protección de preview. Las seis fichas muestran STALE/HIT; no se reproduce un frío controlado que permita explicar las demoras históricas de Paso/Marcha. No se cambian sus consultas.

## Actualidad y validación

Las doce respuestas de portada de la preview corregida (ambos modos) contienen dos tarjetas del martes 6 y ninguna del lunes 5. Es evidencia del contenido servido durante esta ventana; la prueba de medianoche/inicio/final procede del ensayo aislado con Next Cache real, no de desplazar el reloj en producción.

CI `37421011464` SUCCESS, 1473/1473 tests y build local PASS para el SHA de código medido. Navegador: siete rutas cargadas, H1/canónicas de fichas presentes y sin overflow horizontal observado a 1363 px. Logs error/fatal de la preview: sin entradas entre 05:49:46 y 06:19:46 UTC; no equivale a ausencia global de errores.

Supabase consultado en esta continuación: solo rama principal de Hilocofrade, sin base de preview aislada. No se prueban escrituras del Panel sobre producción ni se crean servicios/ramas de pago. El ensayo de invalidación local PASS no sustituye la prueba editorial integral. Móvil sigue pendiente: la API del navegador no expone cambio de viewport. Frío controlado de Paso/Marcha y comparación causal de rendimiento siguen pendientes.

## Riesgo y reversión

No fusionar ni desplegar esta PR. Datos editoriales aún sujetos a stale-while-revalidate; el reloj se calcula por petición y no actualiza automáticamente una pestaña abierta. Para descartar la corrección, revertirla conservando `connection()` incondicional como en producción; no restaurar la propuesta ISR insegura. Sin migraciones, índices, datos ni permisos que deshacer.
