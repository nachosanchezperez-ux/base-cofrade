# El Hilo se mueve · Primer piloto

## Mandato y alcance

Nacho autoriza el 7 de octubre llevar a implementación «La vida de nuestras hermandades, conectada». El corte es una portada, una página propia y una continuación breve en las fichas relacionadas. No es un agregador ni un cambio de nombre del registro de incorporaciones.

Estado inicial de entrega: **implementado en rama de propuesta; no publicado en producción**. La PR es la evidencia de checks, preview y siguientes verificaciones. No integrar sin revisión responsive. Reconciliar `docs/ESTADO-PROYECTO.md` antes del cierre productivo.

## Contrato editorial

- Cada novedad tiene una hermandad protagonista, resumen propio, contexto, fecha de anuncio (o ausencia explícita), fecha documental, fuente y relaciones.
- El registro se mantiene una sola vez en `lib/hilo-movements-data.js`; portada, página y ficha reutilizan esa entrada. Una importación no fabrica actualidad.
- El piloto es curado en código y revisado en PR. No hay rastreador permanente, autopublicación, panel editorial ni cuentas nuevas.
- `El Hilo se mueve` contiene novedades de la vida de las hermandades. `Últimos hilos incorporados` y el botón `Novedades` conservan su significado de incorporaciones a la plataforma.
- `Tira del hilo` solo aparece junto a una propuesta de descubrimiento concreta.
- `Hilos abiertos` y `Siguiendo el Hilo` son fases posteriores, no capacidades entregadas en este corte.

## Piloto documentado

Dos entradas: San Esteban (anuncio del 6/10/2026, Santa Ana tras el palio desde 2027) y El Baratillo (comunicado conjunto del 24/09/2026, continuidad de tres acompañamientos). No se presentan como dos anuncios de hoy.

San Esteban usa el ID de la **Banda de Música** María Santísima de la Victoria, no el de Cornetas y Tambores Las Cigarreras. El cambio pertenece a Madre de los Desamparados. No se añaden efectos sobre terceras hermandades ni duración contractual no documentada.

Fuentes e identidades contrastadas con `docs/SAN-ESTEBAN-SANTA-ANA-2026-10-06.md`, `docs/RENOVACIONES-BANDAS-2026-10-06.md` y lectura de las entidades y periodos publicados en Supabase. Cada entrada conserva el enlace público de su fuente.

## Implementación

- `/el-hilo-se-mueve`: búsqueda GET, municipio y tema según contenido real; vacío y error distinguidos; fuentes desplegables y fechas de calendario de Madrid.
- Portada: bloque de capítulos equilibrados antes de las incorporaciones técnicas. Se conserva toda la portada anterior y la cuarta tarjeta de Hoy.
- Hermandad: resumen desplegable al finalizar la ficha, añadido desde el layout. Se preservan la página completa, sus dos variantes de lectura y el portal de históricos musicales. Las fichas sin entrada editorial no consultan el nuevo lector.
- Consulta pública de identidades y escudos autorizados, caché de 60 segundos, con la etiqueta existente `public-platform-updates`. Una raíz no publicada oculta su entrada; entidades relacionadas no publicadas no generan enlaces.
- No hay DML, DDL, migraciones, RLS, autenticación ni dependencias de aplicación nuevas. No se alteran acompañamientos, fechas, imágenes ni históricos.
- Canonical propia y vistas filtradas no indexables. El alta en sitemap y el postflight de producción quedan ligados a la futura decisión de publicación; no se acredita indexación.

## Preflight y concurrencia

Base `bb967bc7103ceba3b4df2e1a59b463976cbab310`, árbol `da2d2f85890abd2c9aae96d89647667f30fae3ed`. Producción READY `dpl_BpH4kBCRx5Rjfv1fKAUG31D1KTbq`. Permanecen ajenas #1097, #1086, #1020 y #1019. No se modifica `app/hermandades/[slug]/page.js`, compartido por #1019. Antes de integrar, volver a comparar main, PR abiertas y estado operativo.

## Verificación

El prototipo local compiló y pasó las 1.500 pruebas existentes más 17 pruebas específicas. El HTML del nuevo hub respondió HTTP 200 con los dos capítulos y datos públicos. La PR debe registrar la repetición de build y suite completa sobre el commit remoto exacto, CI, preview y revisión visual. No se da por realizada ninguna prueba de navegador solo por compilar CSS.

## Revisión del 9 de octubre de 2026

Rama reconciliada sin conflictos con main `59edee119b5c81b470897c4899ffc8ecc5a4c25b`. Se mantiene el modelo editorial y las fuentes del piloto. Cabecera burdeos, tarjetas marfil, escudos destacados, protagonistas visibles desde portada y lenguaje cofrade («Entre varales y cornetas», «Relevo de sones», «Sones que siguen»). Acceso permanente desde Explorar en móvil y escritorio. Encabezados de novedades h2 en el directorio y h3 en portada; foco visible, filtros GET etiquetados y fuentes desplegables nativas. Alta canónica en sitemap general; filtros conservan noindex.

Verificación local: 1.596/1.596 pruebas, compilación Next.js correcta, diff sin errores de espacios. La revisión visual y funcional del commit final y el postflight son necesarios antes del GO.

### QA visual y funcional cerrada · GO a integración

Candidato `fc54571f6ed357aec7bc146aa10046bfd1bcbff1`, preview `dpl_9EhaFE8c1P47M8UGNhHbZe515ryF` READY. CI 37924419753 success. Build local correcto y 1.596 pruebas correctas.

Chromium real con viewports de 320, 390, 430, 768, 1024 y 1440 px: inspección de capturas y ausencia de desbordamiento; filtros por texto, municipio y tema, quitar filtros, vacío Utrera y fuentes desplegables. Apertura de fuentes con Enter. Las dos tarjetas de portada llevan al capítulo correcto. Las dos fichas de hermandad muestran únicamente su entrada al abrir el resumen. Menú móvil permite acceder directamente a la sección. Los nueve destinos canónicos/internos responden HTTP 200 y los fragmentos de cambios musicales y música del Baratillo existen. Canonical propia, vistas filtradas noindex y ruta incluida en sitemap general.

Axe-core: cero infracciones de las reglas WCAG 2 A/AA y 2.1 AA examinadas en el contenido principal para las seis anchuras. No equivale a certificación completa con lector de pantalla ni pruebas en dispositivos físicos. El entorno usa Chromium de runner aislado, sin añadir dependencias a la aplicación. Se corrigieron selectores del arnés (nombre accesible con flecha del menú y etiquetas de select), no fallos funcionales de la sección.

Resultado reproducible: `scripts/qa-hilo-movements.cjs`; configurar QA_BASE_URL, QA_CHROMIUM_PATH y QA_AXE_PATH. QA_ACCESS_FILE acepta un JSON local de acceso temporal a preview; no versionar ese archivo ni sus cookies. QA_PROXY_TLS=1 solo se utilizó para el certificado del proxy del entorno de pruebas. Evidencia sin credenciales: `docs/evidence/el-hilo-se-mueve-2026-10-09/qa-results.json`.

La decisión original NO-GO queda superada por esta revisión: **GO a integración**, conservando el piloto curado y sin escrituras en Supabase. La certificación de despliegue productivo y sus SHAs se registra en el cierre de la PR #1113.
