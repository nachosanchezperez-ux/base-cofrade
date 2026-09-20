# HC-SEO-02 · Indexación y sitemaps segmentados

Fecha de corte: 20 de septiembre de 2026.

## Objetivo

Convertir el sitemap público en una herramienta de diagnóstico por familias sin romper la URL histórica `/sitemap.xml`. La segmentación permite comparar URLs enviadas e indexadas en Search Console y priorizar el enlazado interno de las familias con menor cobertura.

## Línea base de Search Console

La propiedad de dominio `hilocofrade.es` mostraba, con datos hasta el 18–19 de septiembre:

- 58 clics, 1.906 impresiones, 3 % de CTR y posición media 22,7 en los últimos tres meses;
- 86 páginas indexadas y 771 no indexadas;
- 742 URLs en `Descubierta: actualmente sin indexar`;
- 26 URLs excluidas por `noindex`, 1 redirección, 1 canonical alternativa y 1 URL rastreada sin indexar;
- 429 páginas descubiertas en el sitemap leído por Google el 20 de septiembre;
- 0 elementos de evento reconocidos y 5 breadcrumbs válidos;
- datos de campo insuficientes para Core Web Vitals.

Las páginas con más tracción orgánica pertenecen sobre todo a Extraordinarias, Igualás y fichas concretas de Hermandades. Esto justifica mantener Agenda como familia propia y medir por separado los directorios relacionales.

## Cambio técnico

Se conserva `/sitemap.xml` como inventario completo y se publican ocho vistas disjuntas del mismo conjunto:

| Familia | Ruta | Contenido |
| --- | --- | --- |
| General | `/sitemaps/general.xml` | Inicio, directorio y páginas públicas no incluidas en otra familia |
| Hermandades | `/sitemaps/hermandades.xml` | Directorio, taxonomías y fichas de Hermandades |
| Bandas | `/sitemaps/bandas.xml` | Directorio y fichas de Bandas |
| Imágenes | `/sitemaps/imagenes.xml` | Directorio y fichas de Imágenes |
| Pasos | `/sitemaps/pasos.xml` | Directorio y fichas de Pasos |
| Marchas | `/sitemaps/marchas.xml` | Fichas de Marchas |
| Crucetas | `/sitemaps/crucetas.xml` | Directorio y fichas de Crucetas musicales |
| Agenda | `/sitemaps/agenda.xml` | Agenda, Extraordinarias, Igualás y ensayos, y Glorias |

`robots.txt` anuncia el sitemap completo y los ocho sitemaps de diagnóstico. La generación compartida queda cacheada durante una hora para evitar multiplicar consultas a datos; cada URL solo puede pertenecer a una familia.

## Validación local

- Suite completa: 996 pruebas superadas, 0 fallos.
- `next build`: correcto con Next.js 16.3.0.
- Smoke HTTP sobre el build de producción local: nueve sitemaps con XML válido y tipo `application/xml`.
- Partición local sin credenciales: 19 URLs raíz = 19 URLs segmentadas, 19 únicas, 0 ausentes y 0 adicionales.
- Familia inexistente: respuesta 404.

La comprobación local usa los fallbacks públicos al no disponer de las variables de Supabase. La comprobación de volumen real debe realizarse en el preview conectado antes de fusionar.

## Puertas antes de producción

1. Comprobar en preview que la unión de las ocho familias coincide exactamente con `/sitemap.xml` y no contiene duplicados.
2. Confirmar que no aparecen rutas `/api/` ni `/panel/`.
3. Verificar respuesta 200, XML y canonicalidad de una muestra de cada familia.
4. Fusionar solo con autorización explícita.
5. Tras el despliegue, enviar los ocho sitemaps a Search Console y registrar sus recuentos iniciales.
6. No solicitar la validación del estado `Descubierta: actualmente sin indexar` hasta que Google haya leído los nuevos sitemaps.

## Próximo corte

HC-SEO-03 debe reforzar arquitectura y enlazado interno empezando por Agenda/Extraordinarias y Hermandades, que ya muestran demanda orgánica, y por las familias que Search Console revele con peor relación entre URLs enviadas e indexadas.
