# HC-SEO-09 · Hermandades por localidad

Fecha: 2026-09-21

## Diagnóstico

El directorio público ya agrupaba las Hermandades por municipio y el buscador entendía consultas territoriales, pero no existía una URL canónica para la intención directa «Hermandades de [localidad]». El acceso se resolvía mediante filtros de cliente y anclas dentro de `/hermandades`.

La fotografía previa a este cambio contiene 198 fichas que superan el mínimo editorial compartido del sitemap, distribuidas en 32 localidades. Once localidades reúnen al menos tres fichas indexables y pueden sostener una página territorial sin generar contenido escaso.

## Solución

- Nueva ruta `/hermandades/localidad/[localidad]`.
- Umbral editorial mínimo de tres Hermandades indexables.
- Fuente única de verdad: la misma función `getPublicIndexableEntityEntries` que gobierna el índice SSR y el sitemap.
- Título, descripción, canonical y metadatos sociales específicos por localidad.
- `BreadcrumbList`, `CollectionPage` e `ItemList` mediante el componente común del directorio.
- Respuesta 404 con `noindex` para localidades inexistentes o que no alcanzan el umbral.
- Enlaces desde el índice SSR de Hermandades e inclusión automática en el sitemap.

## Localidades elegibles en el corte inicial

- Sevilla capital.
- Alcalá de Guadaíra.
- Cantillana.
- Coria del Río.
- Estepa.
- Gerena.
- La Rinconada.
- Lebrija.
- Osuna.
- Pilas.
- Utrera.

La lista no queda codificada de forma manual: se recalcula desde las fichas indexables y crecerá cuando una localidad alcance el umbral.

## Límites

- No se modifica Supabase, el esquema ni el contenido editorial.
- No se publican páginas de una o dos fichas.
- Las corporaciones que no superan el mínimo editorial siguen visibles en la experiencia general cuando corresponde, pero no cuentan para crear ni poblar estas landings SEO.
- No se crean excepciones por nombre de municipio.

## Validación

- Pruebas unitarias de umbral, slug de Sevilla capital y filtrado territorial.
- Pruebas de contrato sobre indexabilidad, metadatos, 404, enlazado y sitemap.
- Suite completa con `npm test`.
- Compilación de producción con `npm run build`.
- Postflight sobre una localidad amplia, una localidad situada en el umbral y una localidad delgada.
