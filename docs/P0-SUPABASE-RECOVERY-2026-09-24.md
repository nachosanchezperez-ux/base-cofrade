# Diagnóstico para recuperación de Supabase · Hilo Cofrade

Estado a 24/09/2026, aproximadamente 19:50 UTC. Diagnóstico enviado por Gmail a support@supabase.com con autorización del usuario. Gmail confirmó etiqueta SENT; mensaje e hilo: 1a0d540fe251ab2c. Pendiente de respuesta y número de incidencia de Supabase.

## Solicitud preparada para soporte

**Asunto:** Proyecto eu-west-1 inaccesible después de la incidencia regional: SQL, Realtime, REST y Storage

Proyecto: Hilocofrade (`kcevwkucqzcyrqaimyhl`), región `eu-west-1`, PostgreSQL 17.6.1.155.

El proyecto figura `ACTIVE_HEALTHY`, pero no permite completar siquiera `select 1`: el conector de gestión devuelve `Connection terminated due to connection timeout`. La aplicación pública está degradada y los despliegues que consultan la base durante prerender no pueden completarse.

Solicitamos comprobar la salud real de la instancia y de su infraestructura subyacente, determinar si existe afectación residual de la incidencia regional del 24/09 y restaurar la conectividad. Por favor, indicar si se requiere un reinicio controlado; no autorizamos borrado, recreación del proyecto, restauración destructiva, cambio de plan ni modificación de datos/esquema con este informe.

Evidencias posteriores a la resolución regional anunciada a las 17:38 UTC:

- SQL de prueba `select 1`: timeout de conexión durante esta revisión.
- Realtime, 19:19:18 UTC: `connection not available and request was dropped from queue after 15000ms`, asociado a `MigrationsFailedToRun` interno.
- Management, 19:16:21 UTC: HTTP 522 en `/admin/v1/network-bans/retrieve`.
- REST, 19:44:49 UTC: HTTP 522 en una lectura de `outings`.
- Storage, 18:48:23 y 18:48:28 UTC: HTTP 544 al servir un objeto público, tanto desde el optimizador de imágenes como desde su fallback.
- La consulta de logs de 18:00 a 21:00 UTC devuelve registros de Realtime, Storage y Edge, pero no registros PostgreSQL. Esto no demuestra que PostgreSQL esté sano.

El aviso oficial `Project Lifecycle Issues in eu-west-1` del 24/09 informa de afectación de hardware subyacente y resolución a las 17:38 UTC: https://status.supabase.com/. La pertenencia a la misma región y la coincidencia temporal son contexto; no hemos demostrado que este proyecto formara parte de los afectados.

La aplicación conserva un deployment previo READY. Hemos reducido consultas innecesarias en los sitemaps y aislado Agenda y Autores del prerender. No se ha reiniciado, pausado, escalado ni modificado Supabase durante esta revisión.

## Correcciones y estado de publicación

- PR #932 actualizada con `c7e58a75d3bc534479d74956ef3fbb4cd1c44daf`.
- Árbol remoto comprobado igual al local: `6209a93419472e949c1ce6f24a105a6edbe2ce8f`.
- CI `verify`: success. Supabase Preview: skipped, no equivale a prueba de salud de la base.
- Pruebas locales: 1.159/1.159; prueba de Autores con backend 503, build sin consultas, recuperación SSR y caché correctos.
- Preview correctiva `dpl_4fiz9VXU2byBGC7jhD1DkJD9PquD`: ERROR confirmado al finalizar; compilación correcta y fallo posterior durante prerender de `/bandas`, con reintentos tras superar 60 segundos. No se lanza otra preview ni se fusiona la PR sin resolver/validar esta dependencia.
- Producción sigue en `218bcabfa3a8e6f4a1a2413f310a1a8a06173a67` (#927). No se ha publicado una versión nueva en el dominio.

## Continuación

1. Recuperar conectividad de Supabase mediante revisión de la instancia por el operador/proveedor. La autorización actual de Supabase es de solo lectura, sin reinicios ni cambios.
2. Verificar una consulta mínima, lecturas reales y recuperación de Storage.
3. Completar el build/QA de #932; comparar cobertura de sitemaps y páginas con contenido real.
4. Publicar únicamente el candidato validado y comprobar alineación de SHA.
5. Medir 30–60 minutos sin errores para cerrar P0; mantener Carmona, HC-AUTO-03 y nuevos trabajos editoriales bloqueados hasta entonces.
