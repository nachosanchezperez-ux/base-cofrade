# El hilo escondido · Piloto de juego cofrade · 12/10/2026

## Alcance y estado

Piloto autocontenido para Hilo Cofrade. Se desarrolla en rama independiente y PR de revisión; **no supone autorización de merge ni publicación en producción** hasta superar CI, preview, QA móvil y revisión editorial.

- **Ruta permanente:** /juegos/el-hilo-escondido (un solo canonical, sin páginas por partida).
- **Acceso:** enlace discreto en «Descubre hoy», más «Explorar» en navegación.
- **Dos juegos:** «El hilo del día» (una palabra); «La última chicotá» (tres palabras encadenadas).
- **Mecánica propia:** adivinanza inicial + tres pistas temáticas voluntarias + tres errores como máximo para cualquier forma de responder. No se copia la cuadrícula ni la clasificación de otros juegos.
- **Puntuación:** 100 por palabra acertada, menos 15 por pista abierta y 18 por error anterior, mínimo 10 si acierta; 0 si agota las oportunidades. Experto: hasta 300.
- **Vínculo enciclopédico:** al terminar una palabra, se muestra definición y enlace al directorio relevante. Cuando exista el glosario «De capirote a trabajadera», los vínculos podrán apuntar a su ficha editorial verificada.
- **Cofradle:** mención opcional como recurso externo independiente, nunca incrustado ni presentado como socio.

## Datos y actualización

Un banco estático inicial de vocabulario, con tres pistas y una definición editorial por término, sin inventar enlaces individuales de entidades. La fecha se calcula en **Europe/Madrid**. Ambos modos usan selección determinista que todos los visitantes comparten.

**Limitación deliberada del piloto:** los retos empiezan a repetirse cuando se agota el banco de términos y las cadenas expertas son menos numerosas. Antes de convertirlo en un producto diario permanente se necesita un calendario editorial más amplio, con revisión humana de los términos, dificultad y pistas. No simular una renovación infinita ni la existencia de un sistema de publicación editorial que todavía no está desarrollado.

## Privacidad, coste y seguridad

- Sin registro, terceros, cookies analíticas propias del juego ni escrituras a Supabase.
- La partida y la racha de aciertos se guardan en localStorage del navegador cuando está disponible; no hay sincronización entre dispositivos.
- No hay clasificación pública ni rankings. La puntuación es personal; el banco está empaquetado en el frontend, por lo que **no es una competición resistente a trampas**.
- Compartir voluntario mediante Web Share API o copiar al portapapeles. El texto no revela la solución.
- Sin coste incremental de terceros ni despliegues especiales ni migraciones.
- Conexiones actuales a directorios existentes; evitar dar por publicada una futura página de glosario.

## QA antes de integrar

1. npm test y npm run build: sin regresiones en Next.js 16.
2. Preview: ruta HTTP 200 y canonical estable; comprobar la aparición en «Explorar», en «Descubre hoy» y en sitemap.
3. QA móvil 320 / 375 / 390 / 430 / 768 / 1366 px, incluidos teclado, foco visible, no desbordamiento y botones táctiles.
4. Juego: acierto sin pistas, error, respuesta repetida, pistas intercaladas, agotamiento de intentos, retorno a mitad de partida, cambio de modalidad, fin de experta, copia/compartir y cambio de día en Madrid.
5. Revisar contenido: ortografía, significado y pistas por quien conoce la terminología antes del GO editorial.
6. No tocar funciones de panel, la agenda, las relaciones ni PRs abiertas. El acceso de home es una tarjeta compacta, no un bloque nuevo de noticias.

## Siguiente fase, fuera de esta PR

Calendario editorial de tres meses o más sin repetición, vinculación con glosario y fichas documentadas por término, telemetría agregada solo conforme a consentimiento y controles de privacidad existentes; no asumir ni desplegar estas funciones sin una decisión posterior.

## Revisión integral · 12/10/2026 (tarde)

**Reconciliación:** la PR #1147 implementa el mismo juego en la misma URL con otra base de código. Se mantiene #1146 como implementación única; de #1147 se incorporan dos términos revisados (CANDELERÍA y FALDÓN). Se descarta su pista de CANASTO («arquitectura sobre ruedas»: los pasos no llevan ruedas). Recomendación: cerrar #1147 como sustituida. Rama reconciliada con `main` por merge (sin reescribir historia), incluidas #1144, #1145 y #1148.

### Problemas reales corregidos

| Problema | Corrección |
|---|---|
| El reto diario recorría el banco en orden: 42 de 59 días seguidos repetían ámbito (siete días «Bajo el paso» consecutivos) | Orden que reparte los ámbitos por todo el ciclo: 0 días seguidos del mismo tema; ninguna palabra se repite en 52 días |
| La última chicotá del 12/10 resolvía PALIO, que era el reto diario del 13/10; dos días con el mismo término en ambos modos | Calendario experto alineado con el ciclo: ninguna cadena contiene el reto diario de ±5 días y ninguna se repite antes de 6 días |
| Solo 8 cadenas expertas (repetición semanal) | 17 cadenas, todas en rotación |
| La pista de LLAMADOR decía «también se le llama martillo» y escribir MARTILLO contaba como error | Sinónimos documentados aceptados: MARTILLO, MECHA, TURÍBULO, CANASTO, BACALAO |
| Pistas que adelantaban el cabo siguiente en el modo experto (CAPIROTE → antifaz, CORNETA → tambor, CERA → cirios, CRUCETA → marchas, INSIGNIA → estandartes, CANASTILLA → respiraderos) | Pistas reescritas y orden de cadena corregido; test automático que lo impide |
| La racha mostrada no caducaba: tras días sin jugar seguía mostrando la anterior | La racha visible vuelve a 0 si se salta un día |
| La portada importaba el CSS completo del juego (~850 líneas) para un acceso de una línea | Módulo propio `HiddenThreadTeaser.module.css` |
| Textos de 9–10 px en móvil (contador, modalidades, etiquetas) | Mínimo de 11 px; botones de pista a 14 px |

### Contenido revisado

- ZANCADA no es vocabulario cofrade propio: se sustituye por **ARRIÁ** (par de LEVANTÁ).
- **TÚNICA** y **PENITENTE** no se distinguían de HÁBITO y NAZARENO: nuevas adivinanzas («en lugar de cirio llevo una cruz al hombro»).
- **ESTANDARTE**: se diferencia de la bandera (tela pendiente de un travesaño) y se añade «bacalao».
- **SIMPECADO**, **EXORNO**, **CHICOTÁ** y **CANASTILLA**: afirmaciones imprecisas o circulares corregidas.
- Test automático: ninguna adivinanza o pista contiene su propia respuesta.

### Mejoras de juego

- **Último intento con primera letra**: cuando queda una oportunidad se revela la inicial, sin coste.
- Una respuesta con un número de letras distinto o repetida **no consume intento**, y se dice expresamente.
- **Cuenta atrás** hasta el próximo reto (medianoche de Sevilla) y mención de la racha al terminar.
- Resultado compartido con una línea de cabos (`✦` sin ayudas, `✓` acertado, `✕` fallado), sin revelar soluciones y sin cuadrícula de colores.
- Retroalimentación visual de acierto y fallo, con `prefers-reduced-motion` respetado.

### Pendiente

- **GO editorial humano** sobre las 52 palabras y 17 cadenas (este documento no lo sustituye).
- Ampliar el banco antes de la publicación estable: a partir del día 53 el ciclo diario se repite.
- Ver el juego en un iPhone físico (la QA se hizo en Chromium con emulación móvil).
- Enlazar cada término a su ficha del glosario «De capirote a trabajadera» cuando esté publicado; hoy enlazan a directorios existentes.

## QA visual e interactiva · 12/10/2026

La preview de Vercel no es accesible desde el navegador de esta sesión (el proxy bloquea `*.vercel.app`), así que el componente real se empaquetó con los estilos globales del sitio y se probó en Chromium con emulación táctil. La preview sí se verificó por HTTP (200, canonical y prerender).

- **Anchuras 320, 375, 390, 430, 768 y 1366 px:** sin desplazamiento horizontal, sin textos menores de 11 px y sin errores de JavaScript.
- **Primera pantalla en móvil:** el campo de respuesta pasa a ir justo bajo la adivinanza y las pistas debajo; cabecera del juego compactada. En un iPhone de 390×844 la adivinanza y el campo quedan visibles sin desplazar (antes el campo aparecía a ~1.050 px). En 375×667 la adivinanza es visible y el campo queda a un desplazamiento corto.
- **Flujo diario:** longitud errónea y palabra repetida no consumen intento; pista abierta; tres fallos con su aviso; primera letra en el último intento; MARTILLO aceptado; definición y enlace; +31 puntos; cuenta atrás; racha; texto compartido sin solución; partida conservada al recargar.
- **Flujo experto:** tres cabos con un fallo intercalado, progreso por cabo, conexión final, 282/300 y línea `✦ ✓ ✦`.
- **Corregido en la QA:** el contador «01 / 01» del modo diario (sin significado) se retira; al terminar el modo experto el tercer cabo seguía como «en curso».
- **Teclado:** el foco recorre enlace de vuelta, modalidades, enlace de la respuesta, compartir y Cofradle con foco visible.

## Acceso directo y promoción de Cofradle · 12/10/2026 (noche)

**Problema de usabilidad:** tras el primer rediseño, las cinco categorías, los indicadores y otros bloques se encontraban antes de la partida real; la invitación a Cofradle quedaba tras todo el juego. La promoción anterior además produjo JSX inválido y provocó fallo de compilación, por lo que no era publicable.

**Solución implementada en la misma PR #1146:**

- En la cabecera hay dos acciones visibles sin explorar menús: «Jugar aquí» (salta a una ancla existente desde el render inicial) y «Jugar en Cofradle» (abre el sitio externo de forma independiente).
- Las modalidades y el formulario aparecen antes que las estadísticas, las categorías futuras y la información editorial. La prioridad es poder empezar a jugar inmediatamente.
- Cofradle tiene además una tarjeta visual completa y pulsable, con dos motivos ilustrativos de hermandades y música, un botón gráfico «Jugar ahora» y una advertencia clara sobre el destino externo.
- En móvil, dentro de la tarjeta Cofradle se muestra primero el titular y la acción; la composición decorativa queda detrás, para no demorar el clic.
- El recuadro decorativo no promete enlaces independientes a cada modalidad: toda la tarjeta lleva a la portada de cofradle.es.
- No se añaden nuevas URLs, dependencias ni migraciones. Prueba de regresión de enlaces y orden de lectura en `test/hilo-hidden-play-entry.test.mjs`.

**Barrera de cierre:** comprobar CI y preview del SHA final; conservar pendiente la revisión editorial del banco y el ensayo en iPhone físico. No considerar el juego publicado.

## Replanteamiento visual de entrada · 12/10/2026 (revisión)

La promoción grande de Cofradle situada **después de la partida** y el tablero de cinco categorías bloqueadas no conseguían transmitir «entrar y jugar». Esta revisión sustituye expresamente el diseño descrito en el apartado anterior; el texto anterior se conserva como contexto histórico.

- **Primera pantalla:** cabecera compacta «¿Jugamos?» y dos grandes tarjetas, cada una entera pulsable: «El hilo escondido» (ancla hacia la partida ya disponible) y «Cofradle» (enlace directo externo). No es necesario pulsar botones intermedios, entrar en un menú ni completar antes el juego local.
- **Visual propio:** carta burdeos con misterio y tres cabos para Hilo Cofrade; carta azul con una miniatura tipográfica de hermandad y marcha para Cofradle. No se reutiliza ni se inventa un logotipo oficial de Cofradle.
- **Móvil:** tarjetas apiladas y compactas; la acción de cada juego aparece antes de la ilustración. Ambas opciones quedan inmediatamente bajo el titular.
- **Después de elegir:** la partida aparece directamente con sus modos, adivinanza y campo de respuesta; desaparecen la promoción duplicada de Cofradle y el tablero de cinco opciones todavía inactivas.
- **Categorías futuras:** se anuncian solo en una línea secundaria al final, sin presentarlas como clicables.
- **Identidad y límites:** jerarquía de juego, colores Hilo Cofrade y aviso de que Cofradle es externo e independiente. Sin nueva dependencia, modelo de datos, URL ni cambio de mecánica.
- **Regresión:** `test/hilo-hidden-play-entry.test.mjs` comprueba que los dos enlaces son reales, que la partida tiene ancla SSR, que no existen duplicados promocionales y que la versión móvil está prevista.

**Por certificar:** revisión visual/interactiva del nuevo selector en pantallas reales, posterior al rediseño. No reutilizar como evidencia las capturas y pruebas visuales de la versión anterior.

## Contrato definitivo de jerarquía · 12/10/2026 (noche)

**Decisión editorial del propietario:** Cofradle no es una segunda opción equivalente al juego propio. Se recomienda únicamente **al final**. Por tanto, las decisiones de «dos tarjetas de elección» y de «promoción destacada junto al juego» de los apartados anteriores quedan **sustituidas**; se conservan solo para trazabilidad.

- La URL pública del juego comienza con cabecera compacta **«El hilo escondido»** y lleva directamente a las modalidades y a la adivinanza, sin tarjeta intermedia ni botón de inicio.
- La partida propia tiene prioridad de lectura, atención y espacio visible, tanto en móvil como en escritorio.
- Las futuras categorías (hermandades, imágenes, marchas y autores) se mencionan discretamente después de la partida mientras no sean jugables.
- Una vez terminado el componente del juego aparece una sola recomendación final, compacta pero reconocible, para **Cofradle**.
- Cofradle enlaza a su página oficial como sitio externo e independiente, sin marca simulada ni mecánicas copiadas. No aparece en la cabecera ni como opción principal.
- No se modifican palabras, pistas, puntuación, progreso, Supabase ni rutas. No hay nuevas dependencias.
- Barrera automática: `test/hilo-hidden-play-entry.test.mjs` impide volver a situar Cofradle antes del juego.

**GO:** se requiere CI y preview READY del SHA final, más comprobación visual móvil antes de publicar. Esta revisión no implica merge a producción.


## Mejora del ritmo del juego · 12/10/2026 (corte de revisión)

**Objetivo:** reforzar la sensación de jugar sin volver a añadir pantallas, modalidades falsas ni promociones antes del desafío.

- **Intentos unificados:** tarjetas y respuesta escrita descuentan del mismo máximo de **3 errores** por cabo. Antes las tarjetas limitaban a 3 y el teclado a 4, una inconsistencia que podía cerrar partidas inesperadamente al alternarlos.
- **Pista en un toque:** un botón progresivo presenta una pista adicional cada vez (-15 puntos), con contexto inmediato. Sustituye la fila de tres botones de pistas.
- **Victoria inmediata:** definición, puntuación y acción de continuación aparecen **justo bajo las tarjetas de respuesta**, no escondidas después de los botones y el historial.
- **Segunda partida:** el reto diario completado invita a jugar «La última chicotá»; al terminar el experto se puede volver al reto del día. No se crean partidas infinitas, se respetan los retos de cada fecha y su progreso.
- **Continuar el experto:** el siguiente cabo desplaza y enfoca de manera accesible la cabecera de la pregunta nueva, respetando «reducir movimiento».
- **Persistencia de preview:** el progreso local pasa a versión 2 para no reutilizar partidas incompatibles con el nuevo límite. Los visitantes que hubiesen jugado en previews anteriores pueden ver su partida restablecida; el piloto aún no está publicado en producción.
- **Alcance:** ningún cambio en contenidos relacionales, Supabase, fichas, sitemap, datos personales, Vercel producción ni URL. Cofradle sigue siendo una recomendación final externa e independiente.

**Pruebas añadidas:** intentos mezclados (teclado + toque), opciones duplicadas, límite compartido, progreso local versión 2 y presencia del nuevo flujo visual.

**Pendientes antes del GO:** comprobar la última preview e interacción real en móvil, además de revisión editorial del banco de palabras. No confundir build verde con QA táctil completada.
