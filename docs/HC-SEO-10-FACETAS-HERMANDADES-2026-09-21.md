# HC-SEO-10 · Saneamiento de facetas de Hermandades

Fecha: 2026-09-21

## Diagnóstico

Las páginas históricas de Semana Santa, Gloria, Sacramentales y Agrupaciones Parroquiales se construían desde todo el directorio público. No compartían la frontera editorial del sitemap de fichas ni exigían una masa mínima antes de generar una URL.

La fotografía de producción previa contiene 138 rutas de detalle en estas cuatro familias. Solo 20 reúnen al menos tres perfiles que superan el mínimo editorial común:

- Semana Santa: 13 de 87.
- Gloria: 4 de 34.
- Sacramentales: 2 de 12.
- Agrupaciones Parroquiales: 1 de 5.

Las 118 restantes son combinaciones de una o dos fichas, o están formadas por perfiles que todavía no son indexables. El caso más visible es `/hermandades/sacramentales/dos-hermanas`: reúne cinco registros públicos, pero ninguno supera todavía el mínimo editorial de ficha.

## Solución

- Fuente compartida `getIndexableBrotherhoodDirectory` para las landings territoriales y los cuatro directorios de categoría.
- Umbral mínimo de tres perfiles indexables por faceta.
- La misma función calcula enlaces de los hubs, contenido de las rutas y URLs del sitemap.
- Las combinaciones inexistentes o delgadas responden 404 con `noindex`.
- Las páginas válidas conservan canonical, metadatos sociales, `BreadcrumbList`, `CollectionPage` e `ItemList`.
- Los hubs pasan de renderizado forzado por petición a revalidación cada 15 minutos.
- La variante editorial «Madrugá» se normaliza a la jornada canónica «Madrugada».
- Valores ajenos a la taxonomía de Semana Santa, como meses o descripciones festivas, dejan de generar rutas de jornada.

## Rutas elegibles en el corte inicial

- 10 jornadas de Sevilla capital.
- Viernes Santo de Lebrija.
- Jueves Santo y Viernes Santo de Osuna.
- Mayo, septiembre, octubre y noviembre de Gloria en Sevilla capital.
- Sacramentales de Sevilla capital y Alcalá de Guadaíra.
- Agrupaciones Parroquiales de Sevilla capital.

La lista no queda codificada manualmente. Se recalcula a partir de las fichas indexables y crecerá cuando una combinación alcance el umbral.

## Límites

- No se modifica Supabase, DDL, RLS ni contenido editorial.
- Las fichas que no superan el mínimo siguen disponibles en el directorio general cuando corresponde.
- No se crean excepciones por localidad, jornada, mes o categoría.
- No se eliminan rutas del enrutador: las facetas delgadas quedan recuperables automáticamente cuando alcancen tres fichas indexables.

## Validación

- Pruebas unitarias de umbral, selección de facetas y normalización de Madrugada.
- Pruebas de contrato sobre hubs, rutas dinámicas, `noindex`, 404 y sitemap.
- Suite completa con `npm test`.
- Compilación de producción con `npm run build`.
- Postflight sobre facetas amplias, una faceta situada en el umbral y combinaciones delgadas retiradas del sitemap.
