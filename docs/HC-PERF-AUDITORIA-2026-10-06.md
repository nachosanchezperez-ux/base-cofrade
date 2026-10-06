# HC-PERF · auditoría del 6 de octubre de 2026

## Decisión

**Actualización posterior:** la propuesta ISR descrita en esta auditoría se ha sustituido por la corrección de datos/reloj documentada al final. Las 168 mediciones y el QA anterior conservan su SHA original; no certifican el código nuevo. NO-GO pendiente de las puertas restantes.

**NO-GO para producción de la propuesta ISR de #1020.** No hay autorización de fusión ni despliegue productivo. Se conserva la candidata en borrador para revisión; no se presenta como corrección certificada. No se han cambiado consultas de Pasos/Marchas ni datos editoriales, ejecutado migraciones/índices, purgado producción o ampliado planes.

## Preflight y reconciliación

- Producción actual: `c1d9ef70b049c7d5317b9251822343b23280a622`, `dpl_7jXMVaowgF8A9JEfGgSyoirkB9Nc`, READY, región `dub1`.
- Preview medida: `93accf1b9d5b480a495ad5bbd0daa71409f3537c`, `dpl_HUwxFoWr1SdXMBJ8tHJS6KvYQ5Ke`, READY, región `dub1`. URL: https://base-cofrade-fplttsl65-desdeel-arenal.vercel.app . Requiere acceso de Vercel.
- La candidata se reconcilia con el main actual. Los cambios entre su base previa `a4333722` y main afectan a sitemaps y sus tests; no cambian las siete rutas medidas. Las mediciones pertenecen al SHA de preview indicado, no se adjudican al nuevo SHA documental/de reconciliación.
- PR abiertas revisadas: #1019, #1020 y #1086. No se modifica el trabajo editorial de #1019 ni Colabora #1086. Instrucciones leídas: AGENTS.md, HILO-ORQUESTADOR.md y ESTADO-PROYECTO.md; documentación de caché incluida en Next 16.3.0 instalado.

## Causas confirmadas y límites

`3e047a0ca3a8426f983b3773eb95c56ad7d985c1` (24/09, «fix(p0): full build without Supabase and strict cached directories») añadió `await connection()` a la portada. La declaración excluye su renderizado del prerender; hoy la ruta conserva `private, no-cache, no-store` y MISS. El propósito documentado de aquella modificación fue resiliencia P0 de build, no una decisión demostrada sobre actos. La portada temporal evolucionó posteriormente.

La página ya reutiliza `getHomeSnapshot()` mediante `unstable_cache`, 60 s y tag `home-public`; MISS de HTML **no equivale** a consultar toda la base en cada visita. La snapshot incluye `homeTemporal`, estado de próximas salidas y selección de contenido diario: no es una caché de datos independiente del reloj.

La candidata existente condiciona `connection()` a la ausencia de variables públicas de Supabase y conserva dos niveles de caché de 60 s. Los tests estructurales comprueban código/configuración, no garantizan caducidad real. No se aprueba ISR de toda la portada.

Pasos ya usa `cache(getPasoPageBySlug)` para compartir lectura entre metadatos y página; Marchas combina `cache()` y `unstable_cache` (900 s). Los lectores tienen grupos `Promise.all`; subsisten dependencias secuenciales justificadas por IDs y relaciones. El fetch público tiene límites/reintentos. En producción hubo MISS naturales: la espera desde el envío (descontando pretransferencia, no como tiempo puro de servidor) fue 1,123/0,332 s en Paso y 0,857/0,358 s en Marcha. En preview se observaron STALE/HIT, sin un MISS controlado. Ninguna muestra permite atribuir los antiguos 1,92/3,32 s a duplicados, relaciones, invalidaciones o timeout. No se eliminan relaciones ni se proponen índices sin evidencia de consulta lenta.

## Medición reproducible

Fecha: 06/10/2026. Siete rutas; una primera pasada y cinco repeticiones por ruta, entorno y modo. Carga secuencial, límite máximo de una petición por segundo, GET HTML con compresión y sin purgas/cache-busting. Una conexión inicial de la serie reutilizada no equivale a caché fría. No se fabrica ningún MISS en producción.

- Serie `reuse`: seis transferencias curl en un proceso mediante `--next`, HTTP/2; se observa `num_connects=1` al inicio y `0` en las cinco repeticiones.
- Serie `new`: HTTP/1.1 con `Connection: close`; cada muestra verifica `num_connects=1`. No se compara ese protocolo con HTTP/2 como si fueran idénticos.
- Mismos parámetros por modo para producción y preview; la preview necesita cookie de acceso Vercel y usa otro hostname. Es una comparación operativa con esas limitaciones, **no una atribución causal de mejora porcentual**.
- El proxy de ejecución añade varios segundos a túnel/TLS en las conexiones nuevas. `tunnel_tls_seconds = time_appconnect - time_connect` incluye establecimiento a través del proxy; no mide exclusivamente TLS de origen. `request_wait_seconds = time_starttransfer - time_pretransfer` se registra por separado.
- `html_download_seconds = time_total - time_starttransfer`; tamaño transferido comprimido y tamaño HTML decodificado separados. Esto no mide render visual, LCP, INP, CLS ni Core Web Vitals.
- Las 168 respuestas esperadas se documentan individualmente. Cabeceras observadas, Age, compresión y región por `x-vercel-id` en [CSV](./evidence/HC-PERF-2026-10-06.csv). Los tiempos incluyen este punto de observación, no una conexión residencial española.

### Comparación actual: producción / candidata

TTFB de las cinco repeticiones con conexión reutilizada; primera petición y conexiones nuevas están en CSV. No es un «después» publicado.

| Ruta | Producción TTFB mediana (rango) | Caché | Preview TTFB mediana (rango) | Caché |
|---|---:|---|---:|---|
| Portada | 0.221 (0.167–0.431) s | MISS×5 | 0.155 (0.132–0.232) s | HIT×1, STALE×4 |
| El Baratillo | 0.061 (0.055–0.166) s | HIT×2, STALE×3 | 0.137 (0.129–0.242) s | HIT×3, STALE×2 |
| Banda del Sol | 0.065 (0.050–0.168) s | HIT×4, STALE×1 | 0.133 (0.128–0.318) s | HIT×4, STALE×1 |
| Bendición y Esperanza | 0.052 (0.047–0.332) s | HIT×4, MISS×1 | 0.130 (0.127–0.392) s | HIT×4, STALE×1 |
| Jesús Presentado al Pueblo | 0.051 (0.046–0.348) s | HIT×4, MISS×1 | 0.145 (0.129–0.239) s | HIT×4, STALE×1 |
| Aurora, Reina de la Mañana | 0.082 (0.051–0.358) s | HIT×4, MISS×1 | 0.132 (0.122–0.243) s | HIT×5 |
| Cruceta San Gonzalo | 0.052 (0.045–0.056) s | HIT×5 | 0.137 (0.124–0.285) s | HIT×3, STALE×2 |

## Caducidad y actualidad de la portada

La primera respuesta autenticada de la preview, obtenida el martes 6/10 aproximadamente a las 05:10 UTC, contenía en HTML visible «Lunes · 5 de octubre de 2026» y dos tarjetas «Lunes, 5 de octubre». Entre ellas, besamanos de Monte-Sión y concierto de Las Nieves de Olivares en San Pablo. Una lectura posterior de la misma URL sin parámetros mostró «Martes · 6 de octubre de 2026» y tarjetas del martes. La respuesta posterior del 06/10 a las 05:11:55 UTC llevaba `age: 84`, `x-vercel-cache: STALE` y `cache-control: public, max-age=0, must-revalidate`.

Esto demuestra renovación eventual, **no un límite duro de 60 s ni exactitud en la primera visita tras medianoche**. La primera respuesta no se incluye en el muestreo de latencia porque estaba estableciendo la autenticación. No se asocia a esa respuesta una cabecera HIT/STALE que no se capturó.

Las seis respuestas productivas de portada de la serie reutilizada ya mostraban martes 6. Las pruebas de funciones temporales cubren inicio, minuto final, minuto posterior, cruce de medianoche, promoción de jornada Madrid y actos de varios días. No cubren el HTML servido desde ISR ni la invalidación editorial real.

## Validación

- `TZ=UTC npm test`: **1471/1471 PASS** en la candidata reconciliada. Sin TZ explícita, antes de reconciliar, 1467/1468 PASS; el fallo de `crucetas-identity-hierarchy` desaparece con UTC. Se registra como dependencia del entorno de esa prueba, sin editar código ajeno al alcance.
- `npm run build`: **PASS** en la candidata reconciliada; ejecución sin variables de Supabase, por lo que valida además la rama de protección de build, no un build con datos productivos.
- `git diff --check`: PASS.
- SHA original medido: GitHub CI run `37343334942` SUCCESS y Vercel SUCCESS. Los checks del nuevo SHA deben consultarse en la PR; no se hereda esa certificación por suposición.
- HTML y SEO de las siete rutas: títulos reales, una H1, canonical productiva propia, robots de documento `index, follow`, JSON-LD sintácticamente válido. Vercel añade `x-robots-tag: noindex` a preview, como corresponde al entorno. No equivale a revisión visual ni de indexación Google.
- Agent-browser 0.38.1 y Chrome for Testing 154 instalados. Después, el entorno de ejecución rechazó sockets: `Failed to bind socket: Operation not permitted`; Chrome directo falló por el mismo motivo. No se afirma QA móvil/escritorio ni funcionamiento hidratado.
- Panel: lectura de código confirma `updateTag('home-public')` y `revalidatePath('/')` en `/panel/hoy`; otras familias usan invalidaciones de rutas. No se ejecutaron ediciones porque no se ha certificado una base aislada para esos writes. Invalidación integral **pendiente**.
- Frío controlado de Paso/Marcha **pendiente**. STALE/HIT o MISS naturales no acreditan que todas las capas de datos estuviesen vacías. No se atribuye una causa a la demora histórica.

## Riesgo, reversión y siguiente puerta

Riesgo principal de la candidata: servir día/estado de acto anterior hasta la revalidación de la página y sus datos. Mantenerla en borrador y sin merge evita introducirlo en producción. No hay reversión productiva que ejecutar.

Si en una orden posterior se publicara esta candidata y apareciese una regresión, revertir únicamente su cambio en `app/page.js` para recuperar `await connection()` incondicional, mediante PR y build/preview; conservar cambios posteriores de main. No revertir migraciones ni contenido editorial. Este procedimiento no autoriza desplegar ahora.

Antes de GO: separar el reloj/cálculo temporal de los datos reutilizables, comprobar medianoche/inicio/final sobre respuesta real y caché vencida en entorno aislado, demostrar invalidación desde Panel, completar QA responsive e interacciones y reproducir frío controlado de Paso/Marcha. La mejora de TTFB por sí sola no satisface esas puertas.


## Corrección posterior · datos reutilizables y reloj por petición

Se descarta la activación de ISR de toda la portada: `connection()` vuelve a ser incondicional. No se intenta convertir el MISS de HTML en HIT a costa de la actualidad. La cabecera y la snapshot reciben un único `now` por petición, en Europe/Madrid.

`home-public-data-v22` conserva lecturas de contenido diario, candidatos de salidas, últimas incorporaciones, identidades visuales y contadores durante 60 s, con clave por día Madrid. No almacena la selección «en curso», las agrupaciones Hoy/Mañana ni el foco editorial temporal. Agenda se obtiene en paralelo a esa lectura y sigue reutilizando sus fuentes 300 s por día; su estado horario se calcula fuera de caché. El briefing se reutiliza por ID/fecha, 60 s. Las tres cachés participan en `home-public`, que ya invalida el Panel Hoy. No cambia ningún SQL, fuente, relación, metadato ni función editorial.

La selección de próximas salidas deja de descartar `isPast` antes de evaluar el horario: una Gloria que empezó ayer puede seguir en la calle tras medianoche. Canceladas y celebradas no se reactivan. Se preserva la convención previa de minuto final inclusivo; al minuto siguiente desaparece del directo. Los lectores originales siguen aportando las fechas/horas y contenidos públicos; no se añade acceso de sesión.

Esto mantiene la reutilización de consultas por visita y permite paralelizar la lectura de Agenda con los datos de portada. No se promete un porcentaje de mejora ni una caducidad editorial dura de 60 s: las lecturas siguen usando stale-while-revalidate. Lo que se recalcula en cada petición es el reloj sobre los datos disponibles. Tampoco implica actualización automática de una pestaña que permanece abierta sin nueva petición.

### Pruebas de la corrección

- **1473/1473 PASS** con `TZ=UTC npm test`; `npm run build` PASS y `git diff --check` PASS. Build sin configuración Supabase. Una primera compilación del worktree con node_modules enlazado fue rechazada por Turbopack; repetir con dependencias dentro del worktree completó el build.
- `home-snapshot-clock.test.mjs` ejecuta el ensamblador real y `unstable_cache`/`IncrementalCache` de Next instalado, con fuentes de prueba aisladas y sin HTTP/Supabase. Usa un proveedor local de caché de Next, en memoria y sin flush a disco. Para comprobar STALE envejece el timestamp de la entrada leída; Next decide la revalidación y la ejecuta realmente.
- Dos peticiones previas/posteriores al inicio comparten una lectura; el estado pasa a directo. La entrada vencida dispara revalidación. Medianoche de Madrid cambia la clave y promueve el besamanos del nuevo día manteniendo la salida nocturna. Final y minuto posterior cambian el estado sin nuevas consultas. `home-public` con expire=0 obliga a releer el contenido modificado en la fuente de prueba. Se comprueban banda/briefing y la exclusión de canceladas/celebradas.
- Esto prueba el comportamiento de la caché local de Next y el ensamblado; **no** acredita propagación distribuida en Vercel, formulario/autorización del Panel ni escritura en una base de preview. No se escribe producción.
- QA básico de escritorio anterior (HEAD `7d864de`, viewport 1363×936): siete rutas con contenido real, sin overflow horizontal observado; enlace Marcha → Cruceta funcional, 66 obras/80 interpretaciones. Móvil pendiente por falta de emulación en la API del navegador disponible.

### Puertas restantes y reversión de esta corrección

La PR permanece NO-GO hasta verificar preview/checks del nuevo SHA, comparar sus respuestas bajo condiciones equivalentes, validar edición real desde Panel sobre datos aislados y completar móvil/frío controlado de Pasos y Marchas. No hay optimización de fichas basada en una causa no reproducida.

Reversión de esta corrección: revertir su commit conservando `connection()` incondicional como en producción; no restaurar la candidata ISR insegura de forma automática. No hay datos o migraciones que deshacer. Ninguna reversión se ejecuta en producción en esta orden.
