# Hilo Cofrade · Estado canónico

**Corte validado:** 1 de septiembre de 2026 · 14:06 UTC

**Régimen:** `FIRST EDITION FREEZE` activo

**Fase activa:** editorial, documental y corrección de incidencias reales

## Estado general

**PRIMERA EDICIÓN → 🟢 CERRADA, CERTIFICADA Y CONGELADA**

- Baseline funcional y estructural: `a025098528351656503460596d28b5318e39daf5` (#432).
- Último commit funcional/editorial validado: `c4e422a7a9448fc8a8f12a25fdd0d2244a7cdb1b` (#499).
- HEAD real de `main` observado inmediatamente antes de esta sincronización: `c4e422a7a9448fc8a8f12a25fdd0d2244a7cdb1b` (#499).
- #499 avanza el baseline editorial y aplica una corrección mínima de presentación sobre el módulo existente de Hermandades; no modifica arquitectura, esquema ni RLS. El commit que contiene este propio corte puede avanzar de nuevo el HEAD sin convertirse en un cambio funcional adicional; para el SHA vivo prevalece siempre `main` real.
- Deployment de producción observado inmediatamente antes de esta sincronización: `dpl_J9PdCHAaiHcMuZpyZKrGsPRBJo3Y`, `READY`, sobre `c4e422a7a9448fc8a8f12a25fdd0d2244a7cdb1b`.
- Supabase productivo registra la migración DML `20260901135411_documenta_horarios_templos_septiembre_2026`; Git y remoto quedan reconciliados en 22/22 versiones.
- Vercel informa `SUCCESS` para el HEAD desplegado; el deployment actual y los últimos 15 minutos del proyecto no registran errores ni fatales.
- La matriz manual 390/768/1024/1440 de Primera Edición permanece aprobada.
- El freeze no permite abrir arquitectura, módulos ni una Segunda Edición; sí permite contenido, datos, fotografías, Fuentes, seguridad, legal, bugs e incidencias reales.
- Cola UX/estructural objeto de este corte: **0 frentes abiertos**.
- PR UX/estructurales abiertas al cerrar este corte: **0**.
- #467, #470 y #471 siguen cerradas; no se reabre ninguna.
- La última actuación editorial es #499, horarios de La Milagrosa, Baratillo, Estrella y Cachorro, ya fusionada, aplicada y desplegada sin publicar fichas que permanecían en borrador.

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
- #475 · fotografía del Rosario vespertino 2026 de Las Aguas: fusionada como contenido.
- #476 · igualá 2026 de la Pastora de Triana: fusionada como contenido.
- #477 · fotografías en el calendario de Procesiones de Gloria: fusionada como corrección real.
- #478 y #479 · auditoría de Presentación al Pueblo, reconciliación de su migración y limpieza de nota pública: fusionadas.
- #480 y #481 · traslado al Risco de la Pastora de Cantillana y ubicación contextual de su vídeo: fusionadas.
- #482 · segunda fase documental de Presentación al Pueblo: fusionada; utiliza el modelo vigente y no abre arquitectura nueva.
- #483 · versión remota de la migración de #482 reconciliada en Git sin reejecutar SQL.
- #485 · tratamiento transversal y responsive de fotografías de Glorias: fusionada como bug real, con fallback seguro y sin excepciones nominales.
- #486 · conflictos documentales de Presentación al Pueblo: cerrados como contenido.
- #487 · timestamp remoto de #486 reconciliado en Git sin reejecutar SQL.
- #467 · cierre UX de Bandas: fusionada con delta final exclusivamente transversal de notas redundantes; la excepción nominal del logo de Virgen de los Reyes fue descartada.
- #488–#490 · banderín de Presentación al Pueblo y reconciliación del recurso: fusionadas y desplegadas.
- #491 · primera auditoría documental de Cruz Roja: fusionada y desplegada; completa acompañamientos actuales e históricos, Fuentes y novedades de repertorio sobre el modelo vigente.
- #497 · La Oliva de Salteras y Rosario de Cádiz: fusionada, aplicada y desplegada; incorpora identidad, 14 acompañamientos vigentes, 50 ediciones, 274 pistas y Fuentes trazables sin DDL ni RLS.
- #499 · horarios de templos y sedes: fusionada, aplicada y desplegada; documenta La Milagrosa, Baratillo, Estrella y Cachorro con Fuentes oficiales, reutiliza el modelo vigente y preserva los borradores editoriales.

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

- Deployment de producción observado antes de este commit documental: `dpl_J9PdCHAaiHcMuZpyZKrGsPRBJo3Y`.
- Commit desplegado en ese corte: `c4e422a7a9448fc8a8f12a25fdd0d2244a7cdb1b` (#499), último cambio funcional/editorial validado.
- Estado: `READY`; target: producción.
- Dominios canónicos: `https://hilocofrade.es` y `https://www.hilocofrade.es`.
- Vercel informa `SUCCESS` para el commit desplegado.
- Comprobación runtime: el deployment actual no registra `error/fatal` en los últimos 15 minutos.
- Smoke específico de #499: la ficha pública de El Baratillo responde HTTP 200 sobre `dpl_J9PdCHAaiHcMuZpyZKrGsPRBJo3Y` y muestra «Horarios del templo», el texto multilínea completo y «Verificado · sept 2026».
- El smoke general anterior de Home, Hermandades, Bandas, Procesiones de Gloria, Igualás y Ensayos, Extraordinarias, Tira del hilo (`/pregunta`) y Panel permanece válido; #499 no modifica rutas.
- Las fichas de Procesiones de Gloria son dinámicas (`force-dynamic`), por lo que las correcciones editoriales de Supabase se reflejan sin un redeploy de aplicación.
- El commit que actualiza este documento es exclusivamente documental y no altera el baseline editorial de #499.

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

El cierre técnico permanece intacto. Los cambios posteriores son editoriales o correcciones reales sobre el modelo vigente.

**GIT ↔ SUPABASE → 🟢 22/22 VERSIONES RECONCILIADAS EN PRODUCCIÓN**

- Última versión: `20260901135411_documenta_horarios_templos_septiembre_2026`.
- El proyecto productivo responde en PostgreSQL 17.6.1, región `eu-west-1`.
- La auditoría de este corte no ejecutó DDL, no modificó RLS y no reescribió migraciones históricas.
- La integración automática ya había registrado `20260901135411`; una aplicación manual idempotente añadió temporalmente una segunda entrada de historial. Tras comprobar que la versión temporal contenía una sola sentencia frente a las ocho de la versión canónica, se retiró exclusivamente esa entrada extra. Los datos no se duplicaron y el historial volvió a 22/22.
- La continuidad editorial puede seguir utilizando las tablas y relaciones existentes.

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
10. `20260831213932_publica_iguala_divina_pastora_triana_2026`
11. `20260831220820_incorpora_video_traslado_risco_cantillana`
12. `20260831220940_audita_presentacion_pueblo`
13. `20260831221003_normaliza_tipo_traslado_risco_cantillana`
14. `20260831221120_corrige_nota_publica_presentacion_rinconada`
15. `20260831223715_corrige_video_traslado_risco_en_salida`
16. `20260831225216_completa_presentacion_pueblo_fase2`
17. `20260831230357_cierra_conflictos_presentacion_pueblo`
18. `20260901001916_presenta_banderin_presentacion_al_pueblo`
19. `20260901002206_ajusta_banderin_presentacion_fondo_negro`
20. `20260901004026_cruz_roja_fase1_documental`
21. `20260901083249_incorpora_oliva_salteras_rosario_cadiz`
22. `20260901135411_documenta_horarios_templos_septiembre_2026`

### Observación de ramas Supabase

**PREVIEW BRANCHES → 🟣 DEUDA TÉCNICA AISLADA**

- No existe ninguna preview activa; `list_branches` devuelve únicamente `main`.
- #497 volvió a reproducir el error en una rama limpia y la rama efímera fue retirada automáticamente tras el merge. El resultado sigue siendo `MIGRATIONS_FAILED` por SQLSTATE `23514`: `source_links_one_target`.
- Primera migración que falla: `20260831135520_publica_centuria_y_corrige_logo_tres_caidas.sql`.
- Statement: bloque `do $$`, inserción final en `public.source_links (source_id, entity_id, scope, notes)` para la Fuente «Tres Caídas de Triana · emblema oficial».
- Fila observada: `b225b14b-79fb-46e1-8a3b-040b5d3509b1`; `source_id=a1c237f1-665f-4e36-89ad-de4ff1d25c78`; `entity_id=NULL`; alcance «Identidad visual».
- Precondición asumida: existencia previa del slug `banda-cornetas-tambores-santisimo-cristo-tres-caidas-sevilla`.
- En producción el nodo, la Fuente y su vínculo existen válidamente. En una rama nueva, las migraciones se ejecutan antes del seed; el seed mínimo solo crea Maestro Tejera y Las Cigarreras. La subconsulta devuelve `NULL` y la fila queda con cero destinos, cuando la restricción exige exactamente uno.
- Clasificación principal: **D · DML histórico no reproducible**. Factores contribuyentes: baseline de esquema sin datos productivos y seed mínimo posterior a las migraciones.
- La migración ya aplicada en producción no se edita por conveniencia de branching.
- Deuda formal: #492 · `Reconciliar Supabase Preview Branches`.
- Prioridad: resolver antes del próximo cambio de esquema.

Hasta cerrar #492 quedan bloqueados:

- nuevo DDL;
- nuevas tablas;
- nuevas migraciones estructurales;
- cambios de RLS.

No quedan bloqueados:

- contenido y Fuentes;
- fotografías trazables;
- discografía, estrenos y acompañamientos;
- históricos y relaciones soportadas por el modelo actual.

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

- La Oliva queda publicada con 8 acompañamientos actuales, 27 ediciones y 198 pistas; Rosario queda publicada con 6 acompañamientos actuales, 23 ediciones y 76 pistas.
- Los 14 acompañamientos del lote tienen Paso y Fuente; no queda ninguno sin extremo relacional o soporte documental.
- Las 50 ediciones publicadas tienen al menos una pista y una Fuente; las 22 ediciones históricas inventariadas conservan carátula, `alt` y crédito.
- No hay grupos duplicados de acompañamientos actuales ni `source_links` huérfanos detectados.
- Santa Marta queda expresamente fuera de los acompañamientos vigentes de Rosario; cualquier relación previa se conserva solo como histórica hasta 2025.
- El paso de Columna de Cádiz usa un nodo propio y no reutiliza el paso homónimo ya perteneciente a Las Cigarreras en Sevilla.

## Freeze y siguiente frente

`FIRST EDITION FREEZE` continúa activo.

**FRONTES UX/ESTRUCTURALES ABIERTOS → 0.**

**MODO ACTIVO → EDITORIAL / DOCUMENTAL.**

**NUEVO DDL / NUEVA TABLA / MIGRACIÓN ESTRUCTURAL / RLS → ⛔ BLOQUEADO HASTA CERRAR #492.**

La fase activa vuelve a ser completar y verificar Bandas, Glorias, Romerías, Igualás, Hermandades, fotografías y Fuentes sobre el modelo cerrado. No abrir nuevas funcionalidades por inercia; cualquier excepción debe justificarse como bug real, seguridad o incidencia verificable compatible con el freeze.

La limpieza física de assets huérfanos no forma parte de #471 ni de la cola UX: queda como mantenimiento futuro independiente y conservador.

### Lote editorial · Bandas · La Oliva + Rosario

**ESTADO → 🟢 CERTIFICADO · FUSIONADO · APLICADO · DESPLEGADO**

- La Oliva de Salteras y Rosario de Cádiz forman el lote cerrado por #497.
- Identidad, nombres, colores, logotipos y canales oficiales quedan estructurados sobre el modelo existente.
- Se incorporan relaciones actuales, cronologías prudentes, Fuentes, discografía física y catálogo digital sin inventar inicios no acreditados.
- No se añade fotografía principal: ausencia de foto prevalece sobre material sin derechos trazables.
- CI #1375: `SUCCESS`; `npm test`: 520/520; `npm run build`: verde.
- La migración completa se validó primero contra producción dentro de `BEGIN … ROLLBACK` y después quedó aplicada como versión `20260901083249`.
- Cruz Roja no se reabre y no se abre un lote adicional en este corte.

### Lote editorial · Horarios de templos y sedes

**ESTADO → 🟢 CERTIFICADO · FUSIONADO · APLICADO · DESPLEGADO**

- #499 documenta los horarios comunicados para septiembre de La Milagrosa, Baratillo, Estrella y Cachorro.
- Se reutilizan `places.opening_hours_text`, `opening_hours_verified_at`, `entity_locations` y Fuentes del modelo cerrado; no se añade DDL ni se modifica RLS.
- La presentación pública pasa a titular «Horarios del templo» y respeta los saltos de línea del contenido.
- El Baratillo queda visible en su ficha publicada. Cachorro, Estrella y La Milagrosa conservan su estado editorial `draft`; se incorporan sus datos y ubicaciones sin publicarlas prematuramente.
- Las cuatro Fuentes quedan enlazadas una sola vez a su entidad correspondiente y los cuatro horarios constan como verificados el 1 de septiembre de 2026.
- CI #1379: `SUCCESS`; `npm test`: 522/522; `npm run build`: verde; `git diff --check`: verde.
- La migración se validó primero contra producción dentro de `BEGIN … ROLLBACK` y quedó aplicada como `20260901135411_documenta_horarios_templos_septiembre_2026`.
- Producción `dpl_J9PdCHAaiHcMuZpyZKrGsPRBJo3Y`: `READY`; smoke de El Baratillo HTTP 200 y runtime sin `error/fatal` en los últimos 15 minutos.

**SIGUIENTE ACCIÓN → DETENERSE Y DEVOLVER A DIRECCIÓN.**

La vigilancia de Glorias, Igualás y Extraordinarias continúa únicamente por cambios oficiales de horario, itinerario, acompañamiento, suspensión, aplazamiento o convocatoria nueva.
