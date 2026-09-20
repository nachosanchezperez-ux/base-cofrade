# HC-SEO-06 · Bandas por tipo y localidad

Fecha: 20 de septiembre de 2026

## Objetivo

Convertir los filtros útiles del directorio de Bandas en páginas públicas con URL estable, contenido renderizado en servidor y señales SEO propias. Antes de este lote, las fichas enlazaban filtros mediante parámetros sobre `/bandas`; esas variantes compartían la misma canonical y no constituían destinos de búsqueda diferenciados.

## Superficies nuevas

- `/bandas/tipo/[tipo]`: agrupación por tipología musical.
- `/bandas/localidad/[localidad]`: agrupación por municipio.

Cada ruta:

- nace exclusivamente de bandas publicadas;
- devuelve 404 cuando la faceta no existe;
- declara título, descripción, canonical y metadatos sociales propios;
- publica `BreadcrumbList` y `CollectionPage` con su `ItemList`;
- conserva todas las fichas como enlaces HTML renderizados en servidor.

## Descubrimiento

- El directorio `/bandas` enlaza tipologías y localidades con recuentos calculados.
- Las fichas de Banda sustituyen los filtros con query string por rutas limpias.
- El sitemap incorpora las rutas de faceta derivadas de los datos públicos.
- Los parámetros antiguos de `/bandas?tipo=…` y `/bandas?localidad=…` siguen funcionando como compatibilidad de interfaz, pero dejan de ser el destino enlazado internamente.

## Gobierno y alcance

- No se añaden clasificaciones manuales ni páginas vacías.
- No hay cambios de esquema ni migraciones.
- No se modifica la lógica de publicación de fichas.
- El lote se mantiene en una rama y PR independientes; no autoriza fusión ni despliegue a producción.

## Verificación

- `node --test test/hc-seo-06.test.mjs test/seo-discovery-contract.test.mjs test/band-public-authority-boundary.test.mjs test/directory-card-contract.test.mjs`
- `npm test` — 1.000 tests superados.
- `npm run build` — compilación de Next.js 16.3.0 superada; las dos rutas dinámicas quedan registradas correctamente.
