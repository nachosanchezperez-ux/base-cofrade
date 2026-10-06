# Novedades públicas · 6 de octubre de 2026

## Estado y alcance

Implementación en `feat/novedades-publicas-20261006`, pendiente de preview y QA de navegador.
Objetivo: hacer visibles las incorporaciones recientes desde cualquier página pública.
La petición inicial toma como ejemplo el cambio musical de la Calle Real de Castilleja.
Este documento no certifica publicación en producción ni una decisión GO definitiva.

## Contrato funcional

- Cabecera: botón «Novedades», con indicador discreto cuando hay revisiones sin ver.
- Panel: hasta diez novedades públicas, ordenadas por su fecha de incorporación o actividad.
- Cada entrada presenta categoría, título, resumen, fecha y enlace directo al contenido.
- Un cambio musical enlaza a `/semana-santa/2027/cambios-musicales#cambio-<id>`.
- «Últimos hilos incorporados» muestra tres entradas seleccionadas del mismo origen.
- «Ver todas las novedades» abre el panel desde esa sección de portada.
- La selección interna admite cuatro entradas para conservar «Hilo para descubrir» en Hoy.
- La diversidad por familia y tipo se aplica a la selección de portada; el panel conserva el orden temporal.
- El diálogo nativo contempla Escape, cierre, clic fuera, recorrido de teclado y devolución del foco.
- Buscador, menú y novedades coordinan su apertura para evitar superficies superpuestas.

## Origen de los datos

| Fuente | Contenido incorporado | Fecha utilizada |
| --- | --- | --- |
| `getHomeDiscoveryThreads` | Relaciones editoriales de `home_knowledge_threads` y novedades recientes de Marchas | Actividad agregada `latest_at`; publicaciones recientes existentes |
| `getMusicChangesForYear(2027)` | Cambios musicales públicos ya registrados para la Semana Santa de 2027 | `created_at` del periodo musical entrante |
| Crucetas públicas | `musical_repertoires` publicados, de tipo `performed`, con salida publicada y banda pública | `created_at` de la cruceta |

Las tres fuentes son lecturas públicas y se combinan en `lib/supabase/platform-updates.js`.
El constructor `lib/platform-updates.js` valida contenido, fecha y destino antes de ordenar.
Se excluyen fechas inválidas o futuras y enlaces externos; el cliente vuelve a validar el resultado.
Se deduplican identificadores y acciones equivalentes; el periodo saliente no genera un segundo aviso.
Los nombres y relaciones se toman de los lectores existentes, sin excepciones por el caso de Castilleja.
Esta funcionalidad no requiere nuevas tablas, migraciones ni escrituras en Supabase.

## Fechas y significado editorial

«Añadido» identifica cambios musicales, crucetas y publicaciones recientes de Marchas.
«Actualizado» identifica actividad editorial o relacional procedente de los hilos existentes.
Estas fechas describen la incorporación o actividad registrada en Hilo Cofrade.
La fecha del acto o la edición musical permanece en el contenido, por ejemplo «Madrugá de 2027».
Las etiquetas «hoy», «ayer» y fecha abreviada se calculan con `Europe/Madrid`.
La comparación de días y años respeta el calendario local, incluido el cambio de hora.
El servidor recalcula la etiqueta relativa al entregar el feed; el panel también la presenta en Madrid.
`generatedAt` informa de cuándo se respondió a la petición y no representa una nueva incorporación.

## Estado de lectura

- Al abrir el panel y completar una carga correcta se marcan como vistas sus revisiones actuales.
- Es una marca del panel consultado; no acredita lectura individual ni exige pulsar cada enlace.
- Se conserva en `localStorage`, clave `hilo:novedades:seen:v1`, con un máximo de cien revisiones.
- `revisionKey` depende del identificador, tipo, título, resumen, dato destacado y enlace.
- Refrescar la caché, cambiar «hoy» por «ayer» o actualizar una imagen no crea un aviso sin ver.
- Una modificación de esos campos de contenido produce una revisión nueva.
- El evento `storage` sincroniza la marca entre pestañas del mismo navegador.
- Si el almacenamiento está denegado o es inválido, el panel continúa con estado en memoria.
- Sin almacenamiento persistente, una nueva visita puede volver a mostrar las novedades como pendientes.
- No hay sincronización entre dispositivos ni dependencia de una cuenta de usuario.

## Caché, carga y recuperación

`GET /api/novedades` devuelve `{ items, generatedAt }`; no expone operaciones de escritura.
La respuesta usa `Cache-Control: no-store` y `X-Robots-Tag: noindex, nofollow`.
El lector compartido emplea una caché pública de 60 segundos, con etiqueta `public-platform-updates`.
Las fuentes propagan sus errores: una carga incompleta no se convierte en un feed vacío correcto.
La API responde 503 cuando no puede entregar el resultado y proporciona un mensaje de reintento.
El cliente carga al montar, refresca al abrir si han pasado 60 segundos desde el último éxito
y vuelve a consultar al recuperar foco o visibilidad si han pasado cinco minutos desde el último intento.
Una petición en curso se reutiliza; el cliente la aborta a los quince segundos o al desmontarse.
Se distinguen carga, actualización, error con «Reintentar» y resultado vacío.
Un fallo conserva los elementos que el panel ya tenía y no los marca como vistos por ese fallo.
La portada mantiene su caché propia de 60 segundos y puede diferir brevemente del panel.
Si falla el origen nuevo, la portada recurre a `getDiverseHomeDiscoveryThreads(4)`.
Ese fallback conserva los hilos anteriores y la cuarta tarjeta de Hoy sin presentar un error como éxito del feed.

## Evidencia disponible

| Verificación | Resultado al redactar este documento |
| --- | --- |
| Suite completa de pruebas, ejecutada por el responsable de implementación | **1.477/1.477 PASS** |
| Build de producción | **PASS** |
| Auditoría independiente de código | Realizada: contrato, foco, almacenamiento, fechas, errores y selección de portada |
| Fechas en frontera de año y cambio de hora de Madrid | Comprobaciones puntuales con Node correctas |
| Incidencias detectadas durante revisión | Corregidas: flecha duplicada en panel/portada y conservación de la cuarta tarjeta de Hoy |
| Preview del cambio | **Pendiente** |
| QA visual y funcional en navegador | **Pendiente** |

Agent-browser y Chrome están disponibles, pero su arranque local falla al crear sockets:
`Operation not permitted (os error 1)`. No se ha sustituido esa comprobación por un supuesto PASS.
Quedan por comprobar en preview: carga real, diez novedades, tres entradas de portada y enlace de Calle Real;
anchuras de 320, 390, 430, 768, 1024, 1366 y 1600 px; foco, Escape, cierre exterior y Ctrl+K;
ausencia de desbordamiento, texto del panel de 16 px, controles de 44 px y persistencia tras recarga.
Los estados de error, vacío, reintento y almacenamiento denegado requieren evidencia de ejecución adicional.

## Límites y convivencia

El feed deriva de publicaciones existentes y de sus fechas `created_at` o actividad agregada de relaciones.
Los agregados pueden reflejar actualizaciones de datos; no equivalen a una fecha de primera publicación certificada.
No existe aquí un registro exhaustivo e inmutable de acciones: los cambios antiguos pueden salir de las diez entradas.
La edición actual cubre las tres fuentes descritas; no anuncia automáticamente cada cambio de horario o recorrido.
Es una novedad dentro de la web, sin notificaciones push, suscripciones ni envíos a otras aplicaciones.
La PR **#1020** coincide en `lib/supabase/home-snapshot.js`: reconciliar su evolución sin adoptar su trabajo de rendimiento.
La PR **#1097** puede coincidir en documentación de estado; comprobar esa convivencia antes de integrar.
Este corte no modifica `docs/ESTADO-PROYECTO.md`; el estado canónico se actualizará con la evidencia de preview y la decisión final.
