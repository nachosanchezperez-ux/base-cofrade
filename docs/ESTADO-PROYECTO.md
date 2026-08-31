# Hilo Cofrade · Estado canónico

**Corte validado:** 31 de agosto de 2026 · 19:52 UTC

**Régimen:** `FIRST EDITION FREEZE` activo

**Fase activa:** editorial, documental y corrección de incidencias reales

## Estado general

**PRIMERA EDICIÓN → 🟢 CERRADA, CERTIFICADA Y CONGELADA**

- Baseline funcional y estructural: `a025098528351656503460596d28b5318e39daf5` (#432).
- Último `main` funcional validado antes de esta sincronización documental: `b975b613c2d15a84c6adb3fdc3fb72268e8d3d8a` (#467).
- Producción funcional está `READY` sobre ese SHA en `dpl_G6ZEcc3rf1NHA9LSeP4C7TLQYL2T`.
- CI #1321 termina `SUCCESS` con `npm ci`, `npm test` y `npm run build` en verde.
- Runtime reciente de producción: sin errores detectados.
- La matriz manual 390/768/1024/1440 de Primera Edición permanece aprobada.
- El freeze no permite abrir arquitectura, módulos ni una Segunda Edición; sí permite contenido, datos, fotografías, Fuentes, seguridad, legal, bugs e incidencias reales.
- Cola UX/estructural objeto de este corte: **0 frentes abiertos**.
- PR abiertas al cerrar el corte funcional: **0**.

## GitHub · estado de trabajo

### Fusionado y vigente

- #439 · infraestructura de aportaciones públicas seguras: fusionada, servicio público desactivado.
- #432 · baseline reproducible y fondo configurable de logotipos de Bandas: fusionada.
- #453 y #454 · mantenimiento SEO P0: fusionado y en producción.
- #455 · corrección visual de Mairena: fusionada.
- #458 · Centuria Romana Macarena y presentación de Tres Caídas: fusionada.
- #459 · música de Glorias visible para posiciones `processional_music`, `procession`, `opening` y `behind_step`: fusionada.
- #460 · reutilización de la entidad canónica de Centuria para evitar duplicados: fusionada.
- #463 · menú de Bandas adaptado a la paleta de cada formación: fusionada.
- #464 · ampliación de la discografía de Presentación al Pueblo: fusionada.
- #465 · entrada directa y edición visual contextual de Bandas en Panel: fusionada.
- #466 · Las Cigarreras elevada como ficha patrón de Bandas: fusionada.
- #469 · corrección de cabeceras de `Dónde suena`: fusionada.
- #470 · identidad corporativa oficial de Hilo Cofrade: fusionada, desplegada y fijada como identidad canónica.
- #471 · gestión local de multimedia en Hermandades: fusionada y desplegada con política conservadora de desvinculación.
- #472 y #473 · ajustes posteriores de presencia de marca en cabecera/footer móvil: integrados y vigentes; no reabren #470.
- #474 · reparación de portadas de Presentación al Pueblo: fusionada concurrentemente durante el cierre y preservada al reconciliar #467.
- #467 · cierre UX de Bandas: fusionada con delta final exclusivamente transversal de notas redundantes; la excepción nominal del logo de Virgen de los Reyes fue descartada.

### PR abiertas en este corte

**Ninguna.**

No debe abrirse un nuevo frente UX/estructural para continuar el cierre. La fase vuelve a ser editorial/documental salvo bug real, seguridad o incidencia verificable compatible con el freeze.

## #470 · Identidad corporativa oficial

**Estado → 🟢 CERRADA · FUSIONADA · DESPLEGADA**

- La identidad oficial permanece fijada.
- Los cambios posteriores de #472/#473 se consideran ajustes integrados de la misma identidad, no una fase 2.
- #470 no debe reabrirse, rehacerse ni ampliarse durante este freeze salvo regresión demostrable.

## #471 · Gestión local de multimedia

**Estado → 🟢 CERRADA · FUSIONADA · DESPLEGADA**

- Merge funcional: `87a62cc837b0578a38ac4c40dafe815b804d9e67`.
- La gestión desde `Hermandad → Fotos y carteles` permite ver, editar, marcar como principal y desvincular recursos ya vinculados.
- Se validan UUID, `target_kind`, pertenencia del recurso a la Hermandad, vínculo `link + target + media_asset`, estados de derechos y `alt_text` obligatorio.
- Las operaciones de edición/desvinculación pasan por `requirePanelEditor` y generan audit log.
- Al retirar una portada puede promocionarse otra imagen vinculada.

### Auditoría de borrado

La auditoría confirmó que `media_assets` recibe FK directas desde:

- `entity_media.media_asset_id`;
- `cult_media.media_asset_id`;
- `outing_media.media_asset_id`.

También existen referencias por ruta sin FK directa en otros campos del modelo, entre ellos `heritage_assets.public_image_path` y `outings.hero_image_path`. Por tanto, contar solo las tres tablas de enlace no demuestra de forma exhaustiva que un asset esté huérfano.

Política vigente de Primera Edición:

**DESVINCULAR → CONSERVAR `media_assets` → CONSERVAR STORAGE.**

- #471 no ejecuta garbage collection automático.
- No borra objetos del bucket al desvincular.
- No expone una superficie de borrado arbitrario por `storage_path`.
- La limpieza física de assets huérfanos queda diferida a mantenimiento futuro con auditoría global de referencias; no es un frente UX abierto.

QA final de #471:

- CI #1314: `SUCCESS`.
- `npm ci`, `npm test` y `npm run build`: verde.
- Preview final: `READY`.
- Runtime preview: sin `error/fatal` detectados.
- Producción posterior al merge: `READY`, sin error runtime detectado.
- La protección SSO del preview impidió automatizar una inspección visual autenticada del Panel; no se declara una captura manual inexistente. El contrato responsive quedó revisado estáticamente y blindado por tests.

## #467 · cierre UX de Bandas

**Estado → 🟢 CERRADA · FUSIONADA · DESPLEGADA**

- SHA funcional final: `b975b613c2d15a84c6adb3fdc3fb72268e8d3d8a`.
- Delta final frente al `main` reconciliado: únicamente `lib/bands/accompaniments.js` y `test/band-accompaniments.test.mjs`.
- No modifica CSS, breakpoints, Hero, Directorio, esquema, RLS ni datos.

### Regla transversal de jornada redundante

La capa de presentación elimina únicamente segmentos que repiten literalmente la jornada/tipo ya visible en la cabecera y conserva el dato fuente.

Casos de contrato:

- `Sábado de Pasión.` con la misma cabecera → se oculta.
- `Miércoles Santo. Recorrido de vuelta por…` → conserva solo el contenido útil posterior.
- `Madrugá y mañana del Viernes Santo.` → se conserva íntegra.
- Observaciones documentales no equivalentes → se conservan.

### Excepción nominal descartada

No se integró la propuesta de tratar específicamente el slug de Virgen de los Reyes como `wide`.

No queda en `main` por #467:

- `if slug === ...` para ese logo;
- mapa `slug → wide`;
- `data-logo-presentation` específico;
- estilos `wide` dedicados;
- test nominal de Virgen de los Reyes.

Durante el freeze, un problema cosmético de proporción no justifica crear esquema ni una excepción creciente por nombres.

QA final de #467:

- CI #1321: `SUCCESS`.
- `npm ci`: verde.
- `npm test`: verde.
- `npm run build`: verde.
- Preview `dpl_3QVcHUTP5QRNX2VDgEWZqAVZK8Ne`: `READY`.
- Runtime preview: sin `error/fatal` detectados.
- Producción `dpl_G6ZEcc3rf1NHA9LSeP4C7TLQYL2T`: `READY`.
- Runtime producción reciente: sin errores detectados.
- Dominios `hilocofrade.es` y `www.hilocofrade.es` asociados al deployment final.

Nota administrativa: el conector de GitHub falló al quitar el estado draft de #467 por un error GraphQL interno. Tras reconciliar el avance concurrente de #474 y validar nuevamente el SHA final, `main` avanzó de forma no forzada a ese commit; GitHub reconoció automáticamente #467 como `closed` + `merged` con `merge_commit_sha = b975b613c2d15a84c6adb3fdc3fb72268e8d3d8a`.

## Producción y Vercel

**PRODUCCIÓN → 🟢 ESTABLE**

- Último deployment funcional validado antes de esta sincronización documental: `dpl_G6ZEcc3rf1NHA9LSeP4C7TLQYL2T`.
- Commit funcional desplegado: `b975b613c2d15a84c6adb3fdc3fb72268e8d3d8a`.
- Estado: `READY`; target: producción.
- Dominios canónicos: `https://hilocofrade.es` y `https://www.hilocofrade.es`.
- CI funcional de cierre #1321: `SUCCESS`.
- Comprobación runtime reciente: sin errores detectados.
- Las fichas de Procesiones de Gloria son dinámicas (`force-dynamic`), por lo que las correcciones editoriales de Supabase se reflejan sin un redeploy de aplicación.
- El commit que actualiza este documento es exclusivamente documental y no altera el baseline funcional anterior.

## SEO P0 · mantenimiento técnico

**Estado → 🟢 CERRADO Y EN PRODUCCIÓN**

- Igualás y Ensayos publica metadata específica por convocatoria, canonical individual y relación `WebPage ↔ Event`.
- `Event.startDate` usa hora documentada y offset de `Europe/Madrid` cuando corresponde.
- Extraordinarias calcula el offset de Madrid por fecha y no fija artificialmente `+02:00`.
- Procesiones de Gloria expone `primaryImageOfPage` y `Event.image` cuando existe fotografía documentada.
- El smoke SEO de producción protege Home, Directorios, Extraordinarias, Glorias, Igualás y URLs dinámicas del sitemap.
- No se abre una conversión masiva a ISR durante el freeze sin una incidencia o métrica verificable.

## Ciclo editorial SEO · primer lote

**Estado → 🟢 PUBLICADO Y VALIDADO**

- Cerro del Águila (6/09) y Santa María del Buen Aire (10/09) se revisaron sin añadir texto de relleno.
- Utrera (8/09): salida corregida a `07:00`, Santo Rosario, recorrido por el Real/Parque del V Centenario y Coro de la Virgen.
- Osuna (8/09): itinerario 2026, salida `20:15`, Función Principal y Banda de Música Villa de Osuna.
- Gerena (12/09): contexto de la Coronación Canónica con traslado `17:00`, Pontifical `19:30` y procesión triunfal desde `22:30`.
- Se incorporaron Fuentes específicas de 2026 sin inventar fechas de publicación ausentes.
- #459 corrigió el fallo transversal que ocultaba acompañamientos musicales ya documentados en varias Glorias.

## Ciclo editorial SEO · segundo lote · 8 de septiembre

**Estado → 🟢 DATOS CONTRASTADOS Y PUBLICADOS**

### Nuestra Señora de Aguas Santas · Villaverde del Río

- Se mantiene la salida documentada a las `22:00`.
- Se refuerza la descripción como procesión patronal en paso custodia y su tradición de detenerse de puerta en puerta por la localidad.
- Las Cigarreras permanece documentada y relacionada como acompañamiento tras el paso.
- No se incorpora una hora de regreso histórica como si fuera específica de 2026.
- No se fabrica un recorrido cerrado donde la propia tradición es puerta a puerta.

### Nuestra Señora de la Estrella Coronada · Coria del Río

- El itinerario 2026 oficial permanece completo y se identifica editorialmente como el cuarto de los seis recorridos, conocido como el del `Laberinto`.
- Se documenta que la Virgen regresa a estas calles ocho años después.
- El recorrido se normaliza también en `outings.route` como itinerario estructurado para conservar correctamente nombres como `Ramón y Cajal`, que el parser heredado podía dividir.
- La hora de salida y el acompañamiento musical permanecen sin completar mientras no exista una confirmación específica y suficientemente sólida para el 8 de septiembre de 2026.
- La ficha pública conserva expresamente `Por confirmar` en esos campos en lugar de inferir datos por tradición.

### Nuestra Señora de Consolación · Osuna

- Se conserva la salida a las `20:15`, el itinerario 2026 y la Banda de Música Villa de Osuna.
- Se añade cronología estructurada del 8 de septiembre:
  - `10:00` · apertura del templo;
  - `11:30` · misa de autoridades civiles y militares;
  - `18:00` · apertura vespertina;
  - `19:00` · Función Principal de Instituto;
  - `20:15` · salida procesional.
- La cronología queda en el modelo canónico aunque la ficha pública actual no tenga un módulo independiente de horarios.

### Nuestra Señora de Consolación Coronada · Utrera

- Se conserva la salida oficial a las `07:00` durante el Santo Rosario y el Coro de la Virgen.
- Se añade cronología estructurada del 8 de septiembre:
  - `00:00` · encendido de la Lámpara, Salve y repique de campanas;
  - `01:00` · inicio de peregrinaciones;
  - `06:00` · peregrinación de Los Molares y Misa de Peregrinos;
  - `07:00` · salida de la Virgen y Santo Rosario;
  - `12:30` · Solemne Función Principal;
  - `14:00–19:00` · paso de fieles ante la Virgen;
  - `23:00` · cierre del Santuario.
- La cronología queda estructurada sin forzar su presentación como un nuevo módulo durante el freeze.

### Nuestra Señora de Setefilla · Lora del Río

- Se mantiene correctamente clasificada como `Romería`; no se reetiqueta como `Procesión de Gloria` para encajarla artificialmente en un directorio.
- Se documenta el Santuario como origen/destino canónico y el carácter de la peregrinación desde Lora del Río.
- Se incorporan horarios y secuencia documentada:
  - llegada de romeros desde primeras horas de la madrugada;
  - `11:00` · Letanías y procesión de la Virgen alrededor de la Ermita;
  - a continuación · Función Principal de Instituto;
  - tras la Función · besamanos.
- Se elimina de la salida 2026 la referencia de 2020 sobre la suspensión por pandemia.
- Se sustituyen/añaden como soporte del evento 2026:
  - Hermandad Mayor de Nuestra Señora de Setefilla;
  - Agenda Cultural de Andalucía · Junta de Andalucía;
  - Turismo de la Provincia de Sevilla.
- El frontend actual no ofrece una ruta pública específica de Romerías; los datos quedan canónicos y disponibles para el grafo sin inventar una URL ni introducir Setefilla en `/procesiones-de-gloria`.

### Fotografías

- Las cinco citas revisadas no tienen `hero_image_path` documentado actualmente.
- No se han reutilizado imágenes web sin una evidencia clara de derechos/licencia o una aportación autorizada.
- Se prioriza ausencia de foto frente a incorporar material sin trazabilidad de uso.

## Vigilancia de agenda próxima

Se mantiene una vigilancia periódica de cambios sustanciales en fuentes oficiales o medios locales fiables para:

- Cerro del Águila · 6/09/2026;
- Aguas Santas · Villaverde del Río · 8/09/2026;
- Estrella · Coria del Río · 8/09/2026;
- Consolación · Osuna · 8/09/2026;
- Setefilla · Lora del Río · 8/09/2026;
- Consolación · Utrera · 8/09/2026;
- Santa María del Buen Aire · 10/09/2026;
- Virgen de la Sangre · Gerena · 12/09/2026.

Solo deben elevarse cambios de horario, itinerario, acompañamiento, suspensión/aplazamiento o avisos organizativos relevantes; no se generan avisos si no hay novedades.

## #439 · Aportaciones públicas seguras

**Estado → 🟢 FUSIONADA · SERVICIO CERRADO**

- La infraestructura segura está versionada en `main`.
- `PUBLIC_CONTRIBUTIONS_ENABLED` permanece `false`.
- `/colabora` no publica el formulario mientras el servicio esté desactivado.
- RLS, rate limit, ticket de formulario, origen, honeypot, deduplicación, validación de tipos/archivos y cuarentena privada permanecen preparados.
- Turnstile está preparado, pero su mera existencia no autoriza una activación pública.

### Puerta obligatoria para una activación futura

Una decisión posterior de Dirección deberá abrir un corte independiente y completar revisión legal/privacidad, conservación y borrado, Turnstile, secretos server-only, límites de payload, recodificación/cuarentena, rate limit, RLS, QA, preview y activación controlada antes de cambiar el flag.

## Aportaciones públicas

**APORTACIONES → ⚪ INFRAESTRUCTURA PREPARADA · 🔒 DESACTIVADAS**

- `contributions`: RLS activa.
- `contribution_attempts`: cerrada para API pública según el baseline certificado.
- `anon`: sin escritura directa sobre aportaciones.
- La cuarentena `hilo-contributions-quarantine` permanece privada.
- No se ha activado el formulario público en este ciclo.

## #432 · Fondo configurable de logotipos de Bandas

**Estado → 🟢 FUSIONADA E INTEGRADA**

- `bands.logo_background_color` sigue siendo nullable y reutilizable.
- Panel y Front comparten la configuración HEX y la opción sin fondo.
- El mecanismo no introduce excepciones estructurales por slug.
- #467 refuerza esta regla: no se añade una excepción nominal para Virgen de los Reyes.

## Supabase · esquema, migraciones y ramas

**PROYECTO DE PRODUCCIÓN → 🟢 `ACTIVE_HEALTHY`**

El cierre #471 no añade DDL, RLS ni nuevas tablas. #467 tampoco modifica Supabase. El avance concurrente #474 sí añadió y aplicó una migración editorial de datos para reparar portadas de Presentación al Pueblo.

Migraciones registradas en producción en el momento de este corte:

1. `20260831070000_first_edition_baseline`
2. `20260831071000_secure_public_contributions_reconciled`
3. `20260831072000_add_band_logo_background_color`
4. `20260831074355_publica_tres_igualas_septiembre_2026`
5. `20260831135520_publica_centuria_y_corrige_logo_tres_caidas`
6. `20260831141610_normalize_mairena_logo_and_readability`
7. `20260831150414_publica_centuria_y_corrige_logo_tres_caidas`
8. `20260831154654_completa_discografia_presentacion_pueblo`
9. `20260831193853_repara_portadas_presentacion_pueblo`

### Observación de ramas Supabase

- El proyecto productivo responde `ACTIVE_HEALTHY`.
- `list_branches` informa únicamente `main`, pero su estado de integración continúa como `MIGRATIONS_FAILED` mientras `preview_project_status` figura `ACTIVE_HEALTHY`.
- Este corte no intenta reparar ni reinterpretar ese estado porque #471/#467 no requieren una rama de desarrollo ni una nueva reconciliación de esquema.
- Antes de volver a usar Supabase Preview Branches debe abrirse una reconciliación específica y comprobar la causa real del estado `MIGRATIONS_FAILED`; no asumir que el baseline reproducible anterior sigue vigente sin esa comprobación.

## Seguridad, Auth, Storage y Legal

**SEGURIDAD → 🟢 SIN BLOQUEO DETECTADO EN ESTE CICLO**

- No se alteran políticas RLS, Auth, permisos ni secretos por #471/#467.
- #471 permite desvincular media, pero conserva tanto `media_assets` como el objeto de Storage.
- No se ejecuta borrado físico de Storage desde la nueva gestión local de Hermandades.
- La limpieza de huérfanos queda separada de la UX y requiere una auditoría global futura.
- Las superficies `/aviso-legal`, `/privacidad` y `/cookies` permanecen fuera de este frente.
- La edición editorial continúa sobre campos existentes y fuentes trazables.

## Salud del grafo

**GRAFO → 🟢 SIN NUEVOS BLOQUEOS**

- No se crean nuevas entidades para completar la agenda del 8 de septiembre.
- Las relaciones musicales existentes se conservan.
- Setefilla mantiene su taxonomía real de Romería.
- Coria gana recorrido estructurado sin alterar IDs ni relaciones.
- Las cronologías de Osuna, Utrera y Setefilla quedan normalizadas en `outing_schedule_items`.
- La gestión de #471 retira únicamente vínculos seleccionados y no borra el asset reutilizable del grafo.

## Freeze y siguiente frente

`FIRST EDITION FREEZE` continúa activo.

**FRONTES UX/ESTRUCTURALES ABIERTOS → 0.**

**MODO ACTIVO → EDITORIAL / DOCUMENTAL.**

La fase activa vuelve a ser completar y verificar Bandas, Glorias, Romerías, Igualás, Hermandades, fotografías y Fuentes sobre el modelo cerrado. No abrir nuevas funcionalidades por inercia; cualquier excepción debe justificarse como bug real, seguridad o incidencia verificable compatible con el freeze.

La limpieza física de assets huérfanos no forma parte de #471 ni de la cola UX: queda como mantenimiento futuro independiente y conservador.

Siguiente prioridad editorial ya documentada: revisar las citas del 10–15 de septiembre por proximidad, empezando por Santa María del Buen Aire, Gerena, Castillo de Lebrija, Dolores de Camas, Vera Cruz de Tocina y Dolores de La Rinconada, sin inventar horarios ni acompañamientos no confirmados.