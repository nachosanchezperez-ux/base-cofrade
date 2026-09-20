# HC-SEO-07 · Patrimonio por localidad

Fecha: 2026-09-20

## Objetivo

Crear aterrizajes indexables para búsquedas locales de imágenes y pasos cofrades sin generar páginas delgadas ni duplicar taxonomías inconsistentes.

## Alcance

- Nuevas rutas `/imagenes/localidad/[localidad]` y `/pasos/localidad/[localidad]`.
- Enlaces rastreables desde los directorios principales.
- Metadatos sociales y canonical, `BreadcrumbList` y `CollectionPage` en cada aterrizaje.
- Inclusión automática en el sitemap.
- Respuesta 404 y `noindex` para localidades inexistentes o con menos de tres fichas publicadas.
- Reutilización de las consultas de imágenes y pasos dentro del sitemap para no duplicar esas cargas.

## Criterio editorial

Solo se crea una página indexable cuando la localidad reúne al menos tres fichas. Con los datos publicados al iniciar este lote, el umbral habilita 19 localidades de imágenes y 16 localidades de pasos.

Las rutas por tipología quedan fuera de este lote porque los valores actuales presentan variantes semánticamente equivalentes —por ejemplo, `Palio`, `Paso de palio` y `Paso de Palio`—. Antes de indexarlas conviene normalizar esa taxonomía para evitar canibalización y páginas redundantes.

## Validación prevista

- Pruebas unitarias del umbral, las rutas y el filtrado.
- Suite completa con `npm test`.
- Compilación de producción con `npm run build`.
- Revisión de una URL de Imágenes, una de Pasos y el sitemap en el preview.
