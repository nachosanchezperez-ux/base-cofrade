# Hilo Cofrade · Estado canónico

**Corte validado:** 31 de agosto de 2026 · 16:15 UTC

**Régimen:** `FIRST EDITION FREEZE` activo

**Fase activa:** editorial, documental y corrección de incidencias reales

## Estado general

**PRIMERA EDICIÓN → 🟢 CERRADA, CERTIFICADA Y CONGELADA**

- Baseline funcional y estructural: `a025098528351656503460596d28b5318e39daf5` (#432).
- Último `main` funcional validado en este corte: `38792223b3780938b344d5c37e24f321d600a734` (#466).
- Producción está `READY` y el `Production SEO Smoke` #56 termina `SUCCESS` sobre ese SHA.
- La matriz manual 390/768/1024/1440 de Primera Edición permanece aprobada.
- El freeze no permite abrir arquitectura, módulos ni una Segunda Edición; sí permite contenido, datos, fotografías, Fuentes, seguridad, legal, bugs e incidencias reales.

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
- #466 · Las Cigarreras elevada como ficha patrón de Bandas: fusionada en `38792223b3780938b344d5c37e24f321d600a734`.

### PR abiertas en este corte

- #465 · `Panel Bandas · entrada directa y edición visual contextual`.
  - Alcance exclusivo de Panel/Bandas.
  - Sin migraciones, esquema, RLS ni datos editoriales.
  - No solapa el trabajo de agenda/Glorias de este corte.
- #467 · `UX · cierre responsive de bandas y validación final`.
  - Alcance de presentación de Bandas.
  - Pendiente de matriz visual antes de una eventual fusión.
  - No solapa `outings`, Glorias, Romerías ni Fuentes de este corte.

No debe fusionarse ninguna PR únicamente para “limpiar” el estado. Cada frente conserva su propia puerta de QA.

## Producción y Vercel

**PRODUCCIÓN → 🟢 ESTABLE**

- Deployment funcional vigente en el momento del corte: `dpl_CbA1P7o3exP9A4KPjVPyxNoqiVKr`.
- Commit desplegado: `38792223b3780938b344d5c37e24f321d600a734`.
- Estado: `READY`; target: producción.
- Dominios canónicos: `https://hilocofrade.es` y `https://www.hilocofrade.es`.
- `Production SEO Smoke` #56: `SUCCESS`.
- Comprobación runtime de los últimos 30 minutos: sin logs `error` ni `fatal`.
- Las fichas de Procesiones de Gloria son dinámicas (`force-dynamic`), por lo que las correcciones editoriales de Supabase se reflejan sin un redeploy de aplicación.

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

## Supabase · esquema, migraciones y ramas

**PROYECTO DE PRODUCCIÓN → 🟢 `ACTIVE_HEALTHY`**

El ciclo editorial del 8 de septiembre modifica únicamente datos ya soportados por el modelo (`outings`, `sources`, `source_links`, `outing_schedule_items`); no añade DDL, RLS ni nuevas tablas.

Migraciones registradas en producción en el momento del corte:

1. `20260831070000_first_edition_baseline`
2. `20260831071000_secure_public_contributions_reconciled`
3. `20260831072000_add_band_logo_background_color`
4. `20260831074355_publica_tres_igualas_septiembre_2026`
5. `20260831135520_publica_centuria_y_corrige_logo_tres_caidas`
6. `20260831141610_normalize_mairena_logo_and_readability`
7. `20260831150414_publica_centuria_y_corrige_logo_tres_caidas`
8. `20260831154654_completa_discografia_presentacion_pueblo`

### Observación de ramas Supabase

- El proyecto productivo responde `ACTIVE_HEALTHY`.
- `list_branches` informa únicamente `main`, pero su estado de integración aparece como `MIGRATIONS_FAILED` mientras el preview project status figura `ACTIVE_HEALTHY`.
- Este corte no intenta reparar ni reinterpretar ese estado porque no requiere una rama de desarrollo ni modifica esquema.
- Antes de volver a usar Supabase Preview Branches debe abrirse una reconciliación específica y comprobar la causa real del estado `MIGRATIONS_FAILED`; no asumir que el baseline reproducible anterior sigue vigente sin esa comprobación.

## Seguridad, Auth, Storage y Legal

**SEGURIDAD → 🟢 SIN BLOQUEO DETECTADO EN ESTE CICLO**

- No se alteran políticas RLS, Auth, permisos ni secretos.
- No se realizan cambios de Storage.
- Las superficies `/aviso-legal`, `/privacidad` y `/cookies` permanecen fuera de este frente.
- La edición editorial se ha realizado sobre campos ya existentes y fuentes trazables.

## Salud del grafo

**GRAFO → 🟢 SIN NUEVOS BLOQUEOS**

- No se crean nuevas entidades para completar la agenda del 8 de septiembre.
- Las relaciones musicales existentes se conservan.
- Setefilla mantiene su taxonomía real de Romería.
- Coria gana recorrido estructurado sin alterar IDs ni relaciones.
- Las cronologías de Osuna, Utrera y Setefilla quedan normalizadas en `outing_schedule_items`.

## Freeze y siguiente frente

`FIRST EDITION FREEZE` continúa activo.

La fase activa sigue siendo editorial/documental: completar y verificar Bandas, Glorias, Romerías, Igualás, Hermandades, fotografías y Fuentes sobre el modelo cerrado. Las PR #465 y #467 mantienen sus propias puertas de QA y no deben mezclarse con el trabajo de agenda.

Siguiente prioridad editorial después de este lote: revisar las citas del 10–15 de septiembre por proximidad, empezando por Santa María del Buen Aire, Gerena, Castillo de Lebrija, Dolores de Camas, Vera Cruz de Tocina y Dolores de La Rinconada, sin inventar horarios ni acompañamientos no confirmados.