# Corrección de las dependencias de build

## Cambio

Las 15 páginas pendientes esperan a `connection()` antes de leer datos. La
precarga de slugs de Hermandades devuelve una lista vacía: las fichas se generan
al recibir su primera petición y conservan ISR de 900 segundos. No se cambia el
layout raíz a renderizado dinámico.

Los directorios utilizan cachés compartidas de lecturas estrictas en
`lib/supabase/public-directory-cache.js`: 900 segundos para catálogos e
indexabilidad y 300 para calendarios. Imágenes y Pasos conservan sus cachés
existentes. Una consulta rechazada no devuelve `[]` desde estas nuevas cachés.
El directorio combinado propaga la opción estricta a sus cuatro fuentes.
También se aplica a los directorios de Bandas por tipo y localidad para impedir
que una lectura fallida se interprete como un filtro sin resultados.

Igualás y Ensayos deja de forzar prerender estático y utiliza el lector estricto
cacheado. La Home conserva su snapshot de 60 segundos, con nueva clave v15,
y exige que las consultas del directorio y los contadores terminen correctamente
antes de almacenar el snapshot. No se han eliminado los fallbacks visuales o
editoriales auxiliares de la Home; una auditoría de fallos parciales de todas
esas fuentes sigue siendo un alcance diferente a la caída total probada aquí.

## Validación

Ejecutar `node scripts/verify-full-build-outage.mjs --runtime` en un worktree
sin configuración de producción. El script hace un build normal en frío con
backend local 503 y exige cero consultas; después arranca Next en producción
local y verifica estados HTTP, recuperación, canonical y caché. No utilizar
su `.next` para publicar: contiene configuración ficticia.

La suite existente actualiza únicamente expectativas incompatibles con esta
corrección: ya no se precalientan fichas de Hermandades, Igualás utiliza caché
de datos sin prerender forzado, y la clave del snapshot de Home es v15.

Resultados locales del 24/09/2026:

- Build completo normal: código 0, cero peticiones al backend 503.
- HTTP en frío: las 16 rutas probadas devuelven 500, sin exponer el mensaje
  interno del backend. Incluye Home, los 14 directorios y El Baratillo.
- Recuperación de Bandas: HTTP 200, contenido SSR de la fixture y canonical.
- Nueva caída: Bandas sigue en 200 con el contenido cacheado y cero consultas
  adicionales. Un calendario vacío por consulta correcta vuelve a 200.
- Suite del proyecto: 1.159 pruebas correctas, cero fallos.
- Evidencias: `docs/qa/p0-build-outage-2026-09-24/corrected-*`.

## Límites y publicación

Esta corrección permite compilar aunque Supabase esté caído. No recupera la
instancia de Supabase ni puede proporcionar contenido que nunca se haya leído
correctamente. En frío, el error se propaga; con una caché válida se puede
reutilizar contenido. Los tiempos de respuesta con datos reales, la renovación
de caché vencida y todas las fichas parametrizadas necesitan QA adicional antes
de cerrar el P0.

Sin cambios SQL, de esquema, permisos, datos, credenciales o infraestructura.
No se fusiona con main ni se despliega a producción en esta corrección.
