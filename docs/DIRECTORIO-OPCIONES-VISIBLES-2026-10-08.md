# Directorio · Todas las opciones visibles

## Petición y base

La captura del usuario muestra Semana Santa/Glorias como botones y Sacramentales/Agrupaciones ocultas en el selector Carácter. Se unifican las cinco opciones en un bloque visible: Todas, Semana Santa, Glorias, Sacramentales y Agrupaciones Parroquiales. No se crea una sección nueva.

Preflight: main e627278d98888300c16f4909adaff046bfba383c (#1115 integrada), producción dpl_47Facfn1rvZ9Tf76G6CCuStKoN9u READY en hilocofrade.es. Las PR #1113/#1111/#1097/#1086/#1020/#1019 siguen independientes. #1097 comparte la página del hub, que este ajuste no modifica.

## Contrato

Una única selección activa, sin estado oculto de otro filtro. Se conservan las funciones de clasificación y organización por jornadas/meses. Las categorías sacramentales y agrupaciones filtran las identidades existentes y conservan su calendario; no reclasifican datos. Una identidad mixta puede pertenecer a varias opciones, pero cuenta una sola vez dentro de cada una y en Todas.

Las cinco opciones permanecen visibles al abrir cualquier localidad, incluso con cero resultados. Sus cifras no dependen de la opción anterior. Un vacío ofrece volver a Todas. Botones con nombre completo, estado aria-pressed, foco de teclado, texto de 16 px y mínimo 44 px. Flex-wrap sin desplazamiento horizontal; la etiqueta larga ocupa una fila completa en móvil. No se reducen nombres ni se usa un menú Más.

Se conservan búsqueda, limpieza, reinicio por consulta/territorio/localidad, anclas, escudos y enlaces. Sin cambios de lecturas, datos, URLs, SEO, caché, permisos ni dependencias de la aplicación.

## Validación

Cuatro pruebas SSR nuevas: cinco opciones por localidad, cifras de identidades mixtas, opciones a cero y frontera del índice. La QA existente se adapta a la nueva interacción: prueba las cinco opciones y recuentos en las diez combinaciones de Chromium/WebKit, además de búsqueda, vacío, limpieza, municipio, anclas y teclado. Mantiene snapshot público y adaptador temporal de lectores exclusivo del runner, restaurado al acabar. No equivale a navegador directo sobre Vercel ni a iPhone físico.

CI, build, capturas y despliegue deben comprobarse para el SHA de esta candidata. La evidencia y el cierre verificados se registrarán en su PR; no se declara publicación por crear la rama.
