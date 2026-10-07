# Depuración del directorio de Hermandades

## Estado

**Implementado en #1115; revisión visual pendiente. No integrado ni publicado.**

Petición del usuario: depurar las redundancias de `/hermandades`. Base inicial
`bb967bc7103ceba3b4df2e1a59b463976cbab310`, reconciliada con
`69dc03456208cef4c8d2a34360824d105c23d1e2` después de integrar #1114.

La candidata revisada por HTTP es `7e672d6a208571194ec8eec4fed4a09483c19928`,
deployment `dpl_GqzddXHiHzThNgwBs7jvK3TchdHa` READY. La retirada posterior del
visor temporal y esta documentación no alteran el código de la página ni sus
componentes. No reutilizar una revisión de HTML como certificado visual.

## Problema comprobado

La página repetía las categorías en las tarjetas generales, una segunda fila de
Sevilla y los módulos inmediatamente siguientes. Había un buscador municipal
además de la búsqueda y el selector generales. El índice territorial desplegaba
cientos de enlaces tras los accesos de navegación y repetía una fila de municipios.

Los contadores de categorías procedían de todas las fichas públicas, mientras sus
destinos usan el subconjunto indexable. V4 generaba además enlaces de calendario
sin comprobar el mínimo de tres fichas indexables que exigen las facetas.

## Solución

- Buscador principal primero; categorías más compactas, con recuentos de sus destinos.
- Retirada de la fila `capitalQuick`, del segundo buscador y de rótulos repetidos.
- Calendario de Sevilla conservado; Sacramentales y Agrupaciones pasan a enlaces ligeros.
- Un índice territorial plegable mediante `details` nativo. Mantiene todos sus enlaces
  renderizados por servidor, listas, IDs y páginas municipales canónicas en los encabezados.
- El servidor envía únicamente los contadores y rutas elegibles adicionales. El buscador
  y los municipios conservan el conjunto completo de fichas públicas.
- Las jornadas o meses sin landing elegible abren resultados locales, también para las
  glorias sin fecha documentada. El contexto queda visible y se limpia al cambiar territorio
  o municipio. Los botones trasladan el foco a los resultados; el selector conserva el suyo.

No se modifican entidades, pertenencias legítimas a varios tipos, relaciones, fuentes,
esquema, permisos, caché, sitemap ni criterios de indexabilidad. El párrafo introductorio
que modifica #1097 permanece intacto. El visor de anchuras de la candidata inicial se
retira de la rama antes de cualquier integración; su ruta no es parte de la entrega.

## Evidencia

- Node 24.19.0 / Next 16.3.0: **1.522/1.522 pruebas locales en UTC PASS**; build PASS.
- Cuatro pruebas conductuales nuevas: frontera de facetas, conservación de fichas públicas
  en búsqueda, periodos concretos/vacíos y filtros combinados con restablecimiento.
- CI `verify` SUCCESS en la candidata; una ejecución adicional omitida no sustituye ese resultado.
- HTTP autenticado de la preview: **200**, H1 esperado, canonical productiva propia y `index, follow`.
- Payload: **281 fichas públicas únicas**. JSON-LD e índice HTML: **266 fichas indexables únicas**,
  con conjuntos iguales, sin ausencias ni elementos extra. `details` está cerrado y conserva
  los enlaces en el HTML.
- Categorías de la candidata: **206 Semana Santa, 85 Glorias, 62 Sacramentales, 12 Agrupaciones**.
  Son categorías superpuestas, no sumandos de un total de corporaciones.
- Los **14 enlaces de calendario** pertenecen al mapa de rutas elegibles y presentan su
  recuento exacto. Resurrección (1), Junio (2), Diciembre (1) y Sin fecha documentada (1)
  son botones de filtro, no enlaces a facetas inexistentes.
- El mapa completo coincide con las **22 facetas elegibles** recalculadas desde el
  conjunto indexable. Los accesos de Sevilla capital muestran 37 Sacramentales y
  5 Agrupaciones, coherentes con sus destinos.
- Dos destinos de la misma preview verificados por HTTP: `/hermandades/semana-santa`
  devuelve 200 y 206 elementos; `/hermandades/gloria/sevilla-capital/mayo` devuelve
  200 y 3 elementos. Ambos conservan H1, canonical e indexación esperados.

## Bloqueo y siguiente paso

El navegador pudo inspeccionar la versión productiva anterior. Al abrir la candidata
agotó 300 segundos de espera; la consulta de diagnóstico y la recuperación de sesión
agotaron también sus esperas. Se detuvieron los intentos. Esto no acredita un fallo de
la web: el fetch autenticado de la candidata devuelve HTML correcto.

Quedan pendientes la inspección visual móvil/escritorio y las interacciones hidratadas:
búsqueda, selector con teclado, filtros locales, limpieza, apertura/cierre del índice y
anclas a contenido dentro del `details`. Los IDs se conservan; no se ha certificado su
revelado automático al entrar con un fragmento.

La guía `docs/HILO-ORQUESTADOR.md` exige verificar responsive y navegación antes del
cierre. La skill de verificación de Vercel exige evidencia del flujo completo. Estas
comprobaciones quedan pendientes; los resultados HTTP no las sustituyen.

Completar esa revisión con navegador operativo, reconciliar de nuevo `main` y #1097,
integrar solo la candidata validada y comprobar `/hermandades` en producción. No crear
otra PR para el mismo cambio ni repetir operaciones de datos.

## Reversión

Revertir el commit de presentación si finalmente se integra y aparece una regresión.
No hay migración ni contenido que restaurar.
