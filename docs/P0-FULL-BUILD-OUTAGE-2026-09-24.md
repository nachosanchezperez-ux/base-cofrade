# Compilación completa con Supabase indisponible

Prueba local completada el 24/09/2026 sobre el árbol correctivo de #932
(sitemaps, Agenda y Autores). No se ha desplegado ni consultado Supabase real.
Esta fase añade diagnóstico reproducible; no modifica las rutas de aplicación.

## Resultado observado

| Ejecución | Resultado | Consultas HTTP al backend local |
| --- | --- | ---: |
| Build normal, caché vacía | Falla en `/hermandades/el-baratillo` | 97 |
| Build con `--debug-prerender`, caché vacía | Termina el diagnóstico y falla en cuatro rutas | 328 |

Las cuatro rutas que Next identifica como errores de prerender son:

- `/hermandades/el-baratillo`: falla la consulta de la ficha. `generateStaticParams` precarga slugs locales, pero el contenido requiere Supabase; su layout también consulta el histórico musical.
- `/imagenes`: falla la carga de entidades relacionadas.
- `/marchas`: falla la consulta del directorio de marchas.
- `/pasos`: falla la carga de entidades relacionadas.

El escenario utiliza respuestas HTTP 503 inmediatas. No reproduce el tiempo de
espera de la infraestructura real: por eso `/bandas` no aparece como fallo fatal
en esta ejecución, aunque la preview anterior agotó su tiempo allí.
Los contadores incluyen reintentos y trabajo concurrente; no son consultas SQL
distintas ni permiten estimar por sí solos la carga de producción.

## Error silencioso confirmado

`/igualas-y-ensayos` genera HTML con **0 próximas / 0 documentadas** mientras su
consulta devuelve 503. Su metadata de salida contiene `x-nextjs-prerender: 1`
y un tiempo de 300 segundos. El lector captura el error y devuelve `[]`, y la
página fuerza renderizado estático. Esto demuestra una página vacía generada
durante el diagnóstico, no una respuesta HTTP observada en producción.

La revisión del código encuentra también lectores que convierten errores en
listas vacías en Bandas, Hermandades, Crucetas, Extraordinarias, Gloria y el
directorio combinado. La Home tiene fallbacks y una caché de snapshot que
requieren comprobar que no almacenen un resultado degradado como contenido válido.

## Inventario para la corrección conjunta

Quedan 15 páginas sin frontera explícita de petición antes de sus datos:

| Rutas | Tratamiento a revisar |
| --- | --- |
| `/` | Snapshot de Home; errores parciales y caché de 60 s |
| `/bandas`, `/crucetas-musicales`, `/directorio` | Lectores tolerantes que pueden ocultar errores |
| `/hermandades` y sus índices `/semana-santa`, `/gloria`, `/sacramentales`, `/agrupaciones-parroquiales` | Directorio y evaluación de indexabilidad compartidos |
| `/imagenes`, `/pasos`, `/marchas` | Fallos de prerender confirmados; conservar caché de datos al diferir la carga |
| `/extraordinarias`, `/procesiones-de-gloria`, `/igualas-y-ensayos` | Calendarios, caché de 300 s y fechas de Madrid |

Además, `/hermandades/[slug]` tiene precarga de slugs y carga de datos tanto en
layout como en metadata y página. Debe revisarse como una unidad. Los índices
de Agenda, Autores y el sitemap ya incorporan `connection()` en el candidato.
Las rutas con parámetros sin precarga no quedan verificadas en ejecución por
esta compilación; necesitan QA HTTP cuando haya un servidor de prueba.

## Criterios de aceptación de la corrección

1. Build normal en frío con backend 503: salida 0 y **cero consultas** al backend.
2. Conservar caché útil de datos; no convertir todo el sitio en lecturas sin caché por petición.
3. En frío, un fallo de lectura no debe convertirse en directorio vacío válido ni en un falso 404. Probar por HTTP estado y contenido, incluidos metadata y layout.
4. Con datos válidos: contenido, canonical e indexabilidad correctos. Volver a simular caída y comprobar reutilización de datos completos cuando corresponda.
5. No almacenar como éxito un fallo o snapshot parcial. Un resultado vacío legítimo debe seguir siendo distinguible de una consulta fallida.
6. Tras recuperar Supabase: consulta mínima, lecturas reales, Storage, build normal y QA de contenido; después preview correctiva y comprobación de SHA. La prueba local no acredita recuperación de producción.

## Reproducción y evidencias

Desde un worktree aislado con dependencias instaladas y sin archivos de entorno de Next:

```sh
node scripts/verify-full-build-outage.mjs --observe
node scripts/verify-full-build-outage.mjs --observe --debug-prerender
# Tras aplicar la corrección, gate de build y cero consultas:
node scripts/verify-full-build-outage.mjs
```

El script borra `.next`, usa URL local y claves ficticias, reduce las variables
heredadas y bloquea los `fetch` de aplicación hacia otros orígenes. El servidor
local cuenta peticiones y siempre devuelve 503. El proceso tiene límite de
cuatro minutos. Las ejecuciones observadas terminaron con código 1 sin alcanzar
ese límite. `--observe` permite consultas pero mantiene el fallo del build.

`--debug-prerender` es exclusivamente diagnóstico: no publicar su salida. Tampoco
publicar artefactos compilados con URL o claves ficticias. Se han eliminado los
artefactos `.next` después de recoger las evidencias.

Resultados y logs: `docs/qa/p0-build-outage-2026-09-24/`. La ausencia de entradas
en `prerendered` responde a que el build fallido no produjo el manifiesto final;
no significa que ninguna página generara HTML. `empty-calendar.json` recoge la
evidencia independiente de Igualás y Ensayos.

Supabase continúa bajo autorización de solo lectura y sin reinicios. No se ha
lanzado otra preview, fusionado una PR ni cambiado producción en esta fase.
