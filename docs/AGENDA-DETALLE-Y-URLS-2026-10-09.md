# Agenda · detalle móvil y criterio de URLs

## Decisión expresa del usuario

La información práctica debe leerse dentro de la agenda. Una cita puntual no justifica crear una página propia. Los actos recurrentes pueden disponer de una única URL permanente, sin año en el slug, con sus ediciones dentro. No crear una URL distinta cada año.

Registrar una convocatoria en datos no equivale a autorizar una nueva página indexable. La recurrencia debe acreditarse y vincularse a la serie canónica; no deducirla del título ni retirar el año de un slug automáticamente. Las fechas y horarios de cada edición se conservan: no proyectar una convocatoria al año siguiente.

Las URLs ya publicadas se conservan. Una futura consolidación exige inventario de equivalencias, comprobación de fuentes, canonical/sitemap y redirecciones al contenido equivalente. No redirigir masivamente fichas históricas a una agenda que ya no muestra sus datos.

## Implementación de esta entrega

- Ninguna ruta nueva, ninguna página de evento nueva, ningún cambio de slug ni canonical de las fichas existentes.
- En la agenda, el título abre la información dentro de su tarjeta. Las fichas publicadas se ofrecen como enlace secundario. Cada tarjeta tiene un fragmento `#acto-...` compartible y abre el detalle al cargar ese fragmento.
- Salida y entrada separadas; precisión aproximada o prevista tomada del horario documentado. Los horarios partidos de cultos conservan su texto y su programación diaria.
- Horarios y acompañamientos desde tablas públicas existentes, en lotes cacheados con las fuentes de Agenda; enlaces a Bandas y búsqueda del lugar en Maps. Sin DML/DDL/RLS ni nuevas dependencias.
- Fichas de rosarios existentes: fecha, salida, entrada y lugar juntos; acciones prácticas; horarios y música antes del recorrido; escudos sin marco y Fuentes/relaciones después de la información principal.
- Correctivo común: el final de un circuito de un solo tramo es Entrada, no punto de giro. Una misa vinculada a un templo repetido no se asigna automáticamente a ambas visitas; sigue visible en Horarios.

## Preflight y datos

Base `4fc0a2f5841a467b3c54fcf69d31d23549c5f779`; producción Vercel `dpl_Beov95Wr3oXLTzC4tyHHnUdtrG41` READY en ese SHA. Supabase ACTIVE_HEALTHY. PR abiertas: #1133, #1130, #1126, #1123, #1097, #1086, #1020 y #1019. #1020 modifica caché de las fuentes de Agenda; requiere reconciliación si se retoma. Tablero compartido con otros frentes.

Lectura de datos: 12 series públicas de rosarios. Entre las 42 salidas públicas de esa tipología, la lectura encontró una vinculación de serie (Humildad de Lebrija); el rosario del Cautivo de Dos Hermanas no está vinculado. Se registra como deuda editorial; esta mejora visual no inventa ni escribe esa relación.

La consolidación de las ediciones anuales existentes sigue pendiente de inventario y relaciones acreditadas. No se declara ejecutada. La creación automática de nuevas páginas sí queda bloqueada en esta entrega.

## Verificación

Pruebas y build locales; QA y estado de publicación se completan en la PR de esta rama. No certificar publicación hasta verificar su SHA desplegado.


### Resultado local

- 1.619 pruebas UTC PASS (incluidas tres de presentación y una regresión de circuito); build final sin ruta de QA PASS.
- Agenda conectada al lector público de Supabase: 62 actos; tarjeta del Cautivo con 19:30/21:00/23:30, precisión, Banda y recorrido. Título abre el detalle sin navegación. Fragmento compartido abre la tarjeta. Chromium en 320/390/430/768/1366 px: sin desbordamiento.
- Ficha de rosario: la lectura conectada reprodujo el desbordamiento inicial; un segundo intento agotó 60 s en este ejecutor. Para cerrar el ajuste visual se utilizó una copia temporal de la plantilla real con snapshot del acto (Agenda pública + horarios contrastados en SQL), sin modificar el lector productivo. Cinco anchuras PASS, cabecera práctica, itinerario a un toque, entrada 23:30 y misa excluida del recorrido. Se retiró esa ruta antes del build final y del commit.
- Causas del overflow corregidas: miga de navegación con título largo sin salto y margen del bloque relacional mayor que el margen móvil de la shell.
- No equivale a iPhone/Safari físico. La ficha final se debe comprobar en el despliegue conectado; no declarar aquel snapshot como consulta viva a Supabase.


## Barrera efectiva para nuevas páginas

Manifiesto congelado de **209 paths publicados**, construido con 196 filas públicas de Supabase y las URLs del sitemap Agenda recuperado el 9/10/2026. No es un catálogo que deba ampliarse en cada alta. Conserva las rutas históricas de Rosarios, Extraordinarias y Glorias.

Un slug nuevo en esas familias ya no basta para generar una ficha: los resolutores redirigen a su tarjeta de Agenda mediante fragmento, los lectores de Agenda/Glorias/Rosarios producen ese enlace y el sitemap excluye tanto la página nueva como los fragmentos. Las páginas anteriores y los hubs se conservan. No se borran convocatorias ni históricos. No se inventan relaciones de serie.

Una nueva página permanente requiere un diseño explícito a nivel de serie recurrente, fuera de este manifiesto de compatibilidad; no añadir aquí las sucesivas ediciones. La agenda solo lista próximas citas: un fragmento de un acto que ya terminó deja de abrir una tarjeta, sin borrar sus datos ni generar un archivo por evento.

Sin migraciones ni escrituras de datos. Caché de fuentes y sitemap versionadas. Pruebas de conservación del Cautivo, bloqueo de eventos/ediciones futuras, ausencia de fragmentos en sitemap, conservación de hubs y redirección conceptual de traslados.
