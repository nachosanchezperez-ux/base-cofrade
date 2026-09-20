# HC-SEO-03 · Arquitectura e interlinking de Marchas

Fecha de corte: 20 de septiembre de 2026.

## Diagnóstico

La línea base de Search Console dejó 742 URLs en `Descubierta: actualmente sin indexar`. Tras HC-SEO-02, el inventario público quedó medido por familias y mostró que Marchas era la mayor familia individual:

- 560 fichas de Marchas en el sitemap;
- ninguna ruta pública `/marchas`;
- ausencia de Marchas en el menú `Explorar`;
- el Directorio explicaba que estas obras solo se descubrían mediante búsqueda, Tira del hilo y relaciones;
- las migas de cada ficha de Marcha regresaban a Crucetas musicales, no a una colección propia.

El resultado era una familia extensa cuyos enlaces dependían principalmente de sitemaps y relaciones parciales. HC-SEO-03 crea una página madre rastreable para distribuir autoridad y ofrecer una ruta de navegación estable.

## Cambio

### Directorio `/marchas`

La nueva página:

- publica todas las Marchas con estado `published` y `slug` válido;
- pagina las lecturas amplias de entidades y carga perfiles y autorías por lotes;
- agrupa alfabéticamente todas las obras en HTML enlazable;
- muestra compositor, datación y tipo musical cuando están documentados;
- declara canonical, Open Graph, Twitter Card, breadcrumbs y `CollectionPage`;
- usa ISR de quince minutos;
- mantiene un estado vacío seguro en desarrollo sin credenciales y falla de forma visible en Vercel si falta la configuración pública de Supabase.

### Interlinking

- `Explorar` enlaza el nuevo directorio en escritorio y móvil.
- `/directorio` incorpora Marchas en su `hasPart` y presenta un acceso visible al archivo musical.
- Las fichas `/marchas/[slug]` usan `Inicio → Marchas → obra` en HTML y JSON-LD.
- `/marchas` entra en el sitemap con prioridad `0.88` y frecuencia semanal.
- El sitemap segmentado de Marchas pasará de 560 a 561 URLs en producción.

## Validación local

- Tests SEO específicos: 25/25.
- Suite completa: 999/999.
- `next build`: correcto con Next.js 16.3.0.
- Ruta `/marchas`: estática con revalidación de quince minutos.
- Smoke HTTP local: 200, `text/html`, un único H1 y canonical `https://hilocofrade.es/marchas`.
- Sitemap local: incluye el hub `/marchas` en la familia correcta.

La build local no dispone de variables de Supabase y por ello valida el estado vacío. El preview conectado debe confirmar las 560 fichas, sus grupos alfabéticos y el volumen final del sitemap.

## Puertas de preview

1. Confirmar que `/marchas` responde 200 y publica 560 enlaces únicos a fichas.
2. Verificar que todas las URLs del directorio pertenecen a `/marchas/[slug]` y están incluidas en `/sitemaps/marchas.xml`.
3. Comprobar título, canonical, H1, breadcrumbs y datos estructurados.
4. Revisar escritorio y móvil: índice alfabético, tarjetas y ausencia de scroll horizontal.
5. Confirmar CI, Vercel y runtime limpios.
6. No fusionar sin autorización explícita.

## Siguiente corte

Tras medir Marchas, HC-SEO-04 debe reforzar contenido editorial y datos estructurados de las familias con demanda ya observada en Search Console: Extraordinarias, Agenda y Hermandades.
