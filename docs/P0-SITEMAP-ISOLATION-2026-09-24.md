# P0 · Aislamiento de sitemaps

## Estado y base

Candidato local en `fix/p0-sitemap-isolation`, basado en `fd7b5a98f727e614249e1e81b8b29031ce8df0c5` (PR #932). No integra #931 ni sustituye su trabajo de rendimiento. No publicado ni desplegado.

La revisión actual confirma que #931 permanece draft y #932 ya trata el bloqueo del prerender de Agenda. El informe de #932 recoge `Failed to build /agenda-cofrade/page ... after 3 attempts`; no se ha obtenido en esta revisión un nuevo log de build remoto.

Los registros de producción muestran expiraciones de lecturas (~30 s), reintentos y carga del catálogo completo al servir sitemaps de familias individuales. La última consulta de 30 minutos devuelve 21 registros de error y 11 avisos; no es una ventana limpia ni una medición de usuarios afectados.

## Cambio

- Generación y caché por familia, con TTL 3600 y etiqueta compartida `seo-sitemap`.
- General e identificadores desconocidos no consultan lectores de datos.
- Marchas usa el lector canónico paginado; Autores mantiene su filtro de indexabilidad; Crucetas carga sus repertorios; Agenda carga secuencialmente sus cuatro fuentes.
- Bandas, Imágenes y Pasos pasan explícitamente las familias necesarias al validador. Hermandades conserva Imágenes y Pasos porque sus fuentes participan en el contrato editorial heredado.
- Imágenes y Pasos ya no recorren acompañamientos musicales ajenos a su validación.
- Las peticiones simultáneas a una misma familia comparten la promesa dentro del proceso. No es un límite global entre instancias; la caché persistente sigue siendo la de Next.
- Los lectores con fallback silencioso ahora admiten `throwOnError`, utilizado por el sitemap; se conserva el modo habitual de sus otros consumidores. En Bandas el `await` lleva también los fallos asíncronos de su núcleo al mismo manejador.
- El sitemap completo combina familias secuencialmente y elimina duplicados. `connection()` excluye sus consultas del prerender del build; los datos mantienen la caché por familia.
- Rutas y metadatos de las URLs válidas conservados. Una caída con caché fría produce error en vez de XML parcial exitoso.

## Verificación

- Suite completa: `npm test`, 1.159/1.159 pruebas correctas.

- Build completo Next 16.3.0 / Turbopack correcto, sin variables ni conexiones de producción; `/sitemap.xml` y `/agenda-cofrade` figuran dinámicos.
- 18 pruebas de comportamiento nuevas: selección de lectores de las nueve familias, validación de familias desconocidas, deduplicación de peticiones, propagación y reintento tras errores, URLs canónicas, metadatos de Marchas y contratos estrictos de los cinco lectores modificados.
- Servidor de producción local: `/sitemaps/general.xml` devuelve 200 y XML válido; familia desconocida 404; Hermandades sin backend configurado devuelve 500, no XML vacío exitoso.
- La primera compilación local falló por un enlace de node_modules externo al directorio de Turbopack. Se corrigió solo el entorno local y se repitió con éxito.
- Sin cambios de SQL, datos, RLS, migraciones, credenciales ni límites de Supabase.

## Puertas restantes

Este candidato depende de #932. Reconciliar main y esa PR antes de integrarlo. La recomendación anterior de esperar una ventana limpia antes de publicar cualquier corrección no era una prohibición del usuario. La ventana limpia es una puerta de cierre de P0; una preview correctiva acotada puede validarse antes. Quedan CI/preview remotas, QA con datos reales, comprobación de cobertura editorial y certificación de runtime. Un build local correcto no acredita recuperación de Supabase ni libera Carmona.

El cambio de clave de caché implica caché fría inicial; si Supabase sigue inaccesible, las familias con datos devolverán error. Este cambio reduce trabajo innecesario, pero no garantiza por sí solo la recuperación de la base.
