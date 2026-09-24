# P0 · Segundo bloqueo de build: Autores

## Evidencia directa

El panel autenticado de Vercel para `dpl_HvvX3bXYLyrNSAM2ihEPyw7X5FNS`, preview de #932 sobre `fd7b5a9`, muestra compilación correcta y fallo posterior en prerender:

- `Failed to build /autores/page: /autores (attempt 1 of 3) because it took more than 60 seconds.`
- `Failed to build /autores/page: /autores after 3 attempts.`
- `Export encountered an error on /autores/page: /autores, exiting the build.`

La corrección previa de Agenda no cubría esta ruta. A diferencia de la hipótesis descartada en #930, existe ahora evidencia directa que justifica aislarla.

## Corrección y validación

`connection()` se ejecuta antes del lector del directorio de Autores. Se conserva el lector existente, sus criterios de indexabilidad, metadatos y caché de 900 segundos. No se devuelven perfiles inventados ni una lista vacía para ocultar fallos.

`node scripts/verify-authors-build-resilience.mjs` verifica en un servidor local controlado:

1. Backend 503 durante el build: build correcto, cero consultas y ruta dinámica.
2. Petición en frío con backend fallido: HTTP 500 sin exponer el mensaje interno.
3. Recuperación del backend: HTTP 200, autor ficticio de prueba en SSR y canonical original.
4. Nueva caída dentro del TTL: contenido cacheado, HTTP 200 y cero consultas adicionales.

No se envían datos de prueba a servicios externos. El script reemplaza el build local por uno acotado: no usar ese artefacto para desplegar sin reconstruir.

## Base de datos

Una prueba `select 1` continúa fallando con `Connection terminated due to connection timeout`. Los logs Realtime consultados entre 18:00 y 21:00 UTC contienen `connection not available and request was dropped from queue after 15000ms` a las 19:19 UTC. No prueban corrupción del esquema ni justifican ejecutar las sugerencias genéricas de Ecto de borrar/crear tablas. Supabase se mantiene en modo de inspección; no se reinicia ni modifica.

## Publicación

Reunir esta corrección y la separación de sitemaps en #932, con un único nuevo commit remoto/preview. No integrar #931. CI, build remoto y QA deben verificarse antes de decidir el paso a producción. Una preview READY no acredita recuperación de Supabase: falta ventana limpia para cerrar P0 y liberar trabajo editorial.
