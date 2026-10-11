# Directorio de Hermandades: localidad y calendario

## Alcance aprobado

Revisión de #1115, no una sección nueva: una sola zona territorial, una apertura por localidad, Semana Santa por jornadas y Glorias por meses. Sacramentales y Agrupaciones son filtros de carácter que se cruzan con el calendario. Sevilla capital primero; resto alfabético. No se reproducen cifras, escudos ni jornadas del mockup ilustrativo.

## Implementación candidata

Se retiran los hubs duplicados de capital/provincia y el segundo índice global. BrotherhoodPublicIndex se integra en el único directorio: localidades visibles, listas cerradas inicialmente, encabezados de jornada/mes sin desplegables anidados. La vista Todas conserva perfiles sin calendario. Contadores por identidad única; una Hermandad mixta puede figurar en ambos calendarios con la misma ficha. Madrugada se presenta como Madrugá sin alterar la taxonomía canónica.

Los campos existentes determinan la jornada y el mes. No hay fechas ni convocatorias anuales inferidas. Sin fecha documentada queda al final. Se reutilizan escudos publicados, cargados al abrir la localidad; sin escudo no se fabrica uno ni se reserva una gran imagen. Nombres de 16–17 px, controles de al menos 44 px, listas en dos columnas de escritorio y una móvil, fondo blanco.

El SSR inicial sigue limitado al mismo subconjunto indexable del JSON-LD. Búsqueda explícita y selección municipal conservan todas las fichas públicas; el contenido encontrado sustituye al índice, no lo duplica. Los enlaces municipales proceden de las landings elegibles; las jornadas enlazan solo cuando existe una faceta elegible. No cambian URLs, criterios de indexabilidad, sitemap, caché, datos ni permisos.

## Concurrencia

Partida de la candidata 28b1075979ca6cab976ea37dcf0168c9145ffeba. Reconciliación con main f45f56745ac8377db5d6ce67ed97ea5a3feb38cc: los tres commits posteriores solo comparten el tablero, no los componentes del directorio. Se conserva íntegro el tablero de main; la nota histórica de #1115 queda sustituida por esta revisión en su PR. Antes de integrar debe incorporarse el cierre vigente al tablero canónico, sin restaurar el corte antiguo.

#1097 comparte app/hermandades/page.js: su párrafo objetivo permanece intacto. #1118 comparte navegación general, no estos componentes. #1113/#1111/#1086/#1020/#1019 permanecen independientes.

## Verificación pendiente de la candidata

Nueve pruebas conductuales nuevas cubren orden de jornadas, Madrugá, meses y desconocidos, pertenencias mixtas, filtros cruzados, otras corporaciones, inmutabilidad, frontera SSR, búsquedas públicas, localidades y anclas antiguas/nuevas. Se conservan las cuatro pruebas anteriores de navegación. CI y build deben verificarse para el SHA nuevo; los 1.522 tests del corte anterior no certifican esta revisión.

Pendiente QA visual e interacción hidratada: apertura/cierre, cambios de calendario/carácter, recuentos, búsquedas, selección municipal, limpieza, foco y fragmentos; móvil y escritorio. No publicar hasta completar esa puerta. No se han activado servicios, recursos de pago ni escrituras en Supabase. La revisión en preview no equivale a publicación.
