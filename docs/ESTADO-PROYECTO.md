# Hilo Cofrade · Estado canónico

**Corte validado:** 31 de agosto de 2026 · 15:00 UTC

**Régimen:** `FIRST EDITION FREEZE` activo

**Fase activa:** editorial y documental

## Estado general

**PRIMERA EDICIÓN → 🟢 CERRADA, CERTIFICADA Y CONGELADA**

- Baseline funcional y estructural: `a025098528351656503460596d28b5318e39daf5`.
- Último commit funcional validado en este corte:
  `34e390adeab7306f92a34e07f65577c1979c56d3`.
- La evolución posterior al baseline contiene certificación canónica (#452),
  mantenimiento SEO P0 (#453 y #454), correcciones reales de Bandas (#455 y
  #458) y el bugfix de música de Glorias (#459); no abre una nueva edición ni
  amplía la arquitectura.
- Matriz manual 390/768/1024/1440 aprobada por Dirección.
- No hay un frente funcional abierto ni PR funcionales abiertas en el corte.
- Durante el freeze solo se permiten contenido, datos, fotografías, Fuentes,
  seguridad, legal, bugs e incidencias reales.

## GitHub y baseline técnico

- Baseline funcional/estructural: `a025098528351656503460596d28b5318e39daf5`
  (#432).
- Último `main` funcional comprobado: `34e390adeab7306f92a34e07f65577c1979c56d3`
  (#459).
- #439: fusionada en `378b20be3301f42635673ae9f41bbe6104a90b40`.
- #432: fusionada en `a025098528351656503460596d28b5318e39daf5`.
- #452: certifica el baseline canónico y mantiene `FIRST EDITION FREEZE`.
- #453: SEO P0 fusionado en `d26fde8dd0dac51bd9a6c4b86345bba1784cc8a9`.
- #454: limpieza SEO de Igualás fusionada en
  `8bfca4d4cf23460a414d3f507f8a1f2774551299`.
- #455: corrección visual de Mairena fusionada en
  `c8407c9e2566ea1594127290e1bf4ee022f3fc7f`.
- #458: publica Centuria Romana Macarena y corrige la presentación de Tres
  Caídas, fusionada en `5d2009bdabf2b50bb75da07ce0c0254ce2be0b2c`.
- #459: hace visibles los acompañamientos musicales de Glorias cuando su posición
  documentada es `procession`, `opening` o `behind_step`, además de
  `processional_music`, fusionada en `34e390adeab7306f92a34e07f65577c1979c56d3`.
- PR funcionales abiertas: 0 en el corte.
- `Production SEO Smoke` #32 sobre `34e390adeab7306f92a34e07f65577c1979c56d3`
  termina `SUCCESS`.
- Las sincronizaciones documentales posteriores no alteran el baseline funcional
  ni obligan a reescribir este SHA de forma recursiva.

## Producción y Vercel

**PRODUCCIÓN → 🟢 ESTABLE**

- Último deployment funcional validado: `dpl_8Y9g9XKeYiaTcUrrjc1m2YN7ofXM`.
- Commit funcional desplegado: `34e390adeab7306f92a34e07f65577c1979c56d3`.
- Estado: `READY`; target: producción.
- Dominios: `https://hilocofrade.es` y `https://www.hilocofrade.es`.
- Runtime: 0 errores detectados en la comprobación de los últimos 30 minutos.
- El `Production SEO Smoke` automático del deployment funcional validado pasa
  correctamente sobre las superficies SEO protegidas y URLs dinámicas obtenidas
  desde el sitemap.
- QA en producción confirma la música visible en Osuna, Utrera y Aguas Santas
  tras #459.

## SEO P0 · mantenimiento técnico

**Estado → 🟢 CERRADO Y EN PRODUCCIÓN**

- Igualás y Ensayos publica títulos y descriptions específicos por convocatoria,
  canonical individual y relación `WebPage ↔ Event`.
- `Event.startDate` incorpora la hora real y el offset de `Europe/Madrid` cuando
  el horario está documentado.
- El organizador se enlaza a la Hermandad pública cuando existe y la ubicación se
  estructura como `Place` + `PostalAddress` sin inventar direcciones.
- Las descriptions evitan repetir fecha, hora, Hermandad, lugar, Paso o
  responsables cuando ya aparecen en el texto base.
- Extraordinarias calcula el offset de `Europe/Madrid` por fecha y ya no fija
  artificialmente `+02:00`; el horario de invierno queda cubierto.
- Procesiones de Gloria expone la fotografía principal mediante
  `primaryImageOfPage` y `Event.image` cuando existe.
- El smoke SEO de producción se dispara tras deployments de producción y también
  puede ejecutarse manualmente; exige HTTP 200, canonical y JSON-LD en las
  superficies protegidas.
- La canonical de la raíz se normaliza como `https://hilocofrade.es`, evitando
  falsos negativos por una barra final equivalente.
- No se hizo una conversión masiva a ISR durante el freeze: la optimización de
  caché queda reservada a una incidencia o métrica de rendimiento verificable.

## Ciclo editorial SEO · agenda próxima

**Estado → 🟢 PRIMER LOTE CONTRASTADO Y PUBLICADO**

- Cerro del Águila (6/09) y la igualá de Santa María del Buen Aire (10/09) se
  revisan como suficientemente documentadas y no se añaden textos de relleno.
- Utrera (8/09): se corrige la salida de Nuestra Señora de Consolación Coronada a
  las `07:00`, se documentan el Santo Rosario, el entorno del Real y Parque del V
  Centenario y el Coro de la Virgen de Consolación.
- Osuna (8/09): se incorpora el itinerario 2026, la salida a las `20:15`, el
  contexto de la Función Principal y la Banda de Música Villa de Osuna.
- Gerena (12/09): se refuerza el contexto de la Coronación Canónica con traslado
  a las `17:00`, Pontifical a las `19:30` y procesión triunfal desde las `22:30`.
- Se incorporan Fuentes específicas de 2026 para Utrera, Osuna y Gerena sin
  inventar fechas de publicación cuando la fuente no las expone.
- #459 corrige un fallo transversal de presentación que ocultaba música ya
  documentada en Glorias. La corrección conserva los códigos semánticos reales y
  no crea nuevas Bandas ni cambia el modelo.
- Este lote modifica únicamente contenido editorial en producción y una capa de
  lectura/presentación; no añade esquema, migraciones, RLS ni módulos.

## #439 · Aportaciones públicas seguras

**Estado → 🟢 FUSIONADA · SERVICIO CERRADO**

- La infraestructura segura y el baseline reproducible están versionados en
  `main`.
- `PUBLIC_CONTRIBUTIONS_ENABLED` permanece `false`.
- `/colabora` no renderiza un formulario y declara que las aportaciones no están
  abiertas.
- El endpoint evalúa el flag antes de procesar el payload y falla cerrado.
- RLS, rate limit, ticket de formulario, origen, honeypot, deduplicación,
  validación de tipos/archivos y cuarentena privada permanecen preparados.
- Turnstile está preparado, pero no activado.
- #451 exige una fuente pública o un archivo para propuestas de información
  nueva; refuerza la validación, pero no activa envíos ni modifica secretos.

### Puerta obligatoria para una activación futura

Una decisión posterior de Dirección deberá abrir un corte independiente y
completar, en este orden, sin reutilizar esta certificación como autorización:

1. decisión explícita de Dirección;
2. revisión de finalidad y minimización de datos;
3. actualización de Legal y Privacidad;
4. revisión de conservación, borrado y derechos de las personas;
5. configuración y prueba de Turnstile;
6. confirmación de secretos solo en servidor;
7. revisión de límites de payload y tipos de archivo;
8. comprobación de recodificación y cuarentena;
9. comprobación de rate limit, honeypot y deduplicación;
10. auditoría RLS y permisos efectivos;
11. QA de errores, logs y ausencia de datos personales;
12. preview técnica y QA visual;
13. activación controlada del flag;
14. smoke y vigilancia posterior en producción.

## Aportaciones públicas

**APORTACIONES → ⚪ INFRAESTRUCTURA PREPARADA · 🔒 DESACTIVADAS**

- `contributions`: RLS activa y 0 filas.
- `contribution_attempts`: RLS activa, sin políticas ni privilegios API y 0
  filas.
- `anon`: sin acceso a aportaciones.
- `authenticated`: sin `INSERT` ni `DELETE`; lectura y actualización solo bajo
  las políticas del Panel.
- La cuarentena `hilo-contributions-quarantine` es privada, limitada a 8 MiB y
  tipos JPEG, PNG, WebP y PDF.
- No se ha publicado ningún formulario, activado Turnstile ni cambiado el flag.

## #432 · Fondo configurable de logotipos de Bandas

**Estado → 🟢 FUSIONADA E INTEGRADA**

- Campo nullable reutilizable, validación HEX `#RRGGBB`, selector, preview y
  opción «Sin fondo».
- Panel y Front comparten `bands.logo_background_color`.
- No contiene estilos por slug, excepciones por Banda ni una segunda lógica de
  tamaño; conserva el normalizador óptico y `object-fit: contain`.
- La configuración por defecto no fuerza una normalización masiva de colores.

## Reproducibilidad de ramas y deuda histórica

**SUPABASE PREVIEW BRANCHES → 🟢 BASELINE REPRODUCIBLE**

- La cadena ejecutable comienza en
  `20260831070000_first_edition_baseline` y continúa con el cierre de seguridad.
- El seed de preview es mínimo, idempotente y no contiene aportaciones, usuarios
  ni datos personales.
- Las migraciones históricas 048 (San Benito) y 057 (La Puebla), junto con el
  historial anterior a la Primera Edición, permanecen archivadas fuera de la
  cadena ejecutable.
- San Benito, La Puebla y la antigua migración de Igualás ya no son bloqueos de
  ramas vacías. No se reescribieron datos reales ni se relajó integridad.
- Las pruebas de historial único y baseline de rama permanecen versionadas en
  `main`.

## Git ↔ Supabase

**PRODUCCIÓN → 🟢 ALINEADA EN ESQUEMA**

- El ciclo editorial de este corte no añade migraciones ni modifica esquema.
- Las actualizaciones de Utrera, Osuna y Gerena son contenido editorial sobre el
  modelo ya certificado.
- Proyecto Supabase: `ACTIVE_HEALTHY` en la última comprobación del frente.
- No se ha relajado RLS ni alterado permisos por este trabajo.

## Seguridad, Auth, Storage y Legal

**SEGURIDAD → 🟢 SIN BLOQUEO DE PRODUCCIÓN**

- Todas las tablas públicas mantienen RLS activa según el cierre certificado.
- Las funciones autenticadas del Panel y las superficies legales permanecen sin
  cambios en este ciclo.
- Storage separa medios públicos de la cuarentena privada; no hay políticas
  anónimas de escritura.
- `/aviso-legal`, `/privacidad` y `/cookies`: operativas.
- Los avisos de rendimiento restantes son deuda de optimización no bloqueante;
  no se abre una limpieza masiva durante el freeze sin una incidencia medible.

## Salud del grafo

**GRAFO → 🟢 SIN BLOQUEOS NUCLEARES**

- No se han introducido nuevas entidades ni relaciones estructurales en este
  ciclo.
- La música de Glorias ya documentada vuelve a ser visible sin alterar sus
  códigos de posición.

## Freeze y fase activa

`FIRST EDITION FREEZE` continúa activo. No se abren funcionalidades, entidades,
módulos, Homes, rediseños ni una Segunda Edición.

La fase activa es exclusivamente editorial/documental: completar y verificar
Bandas, Glorias, Igualás, Hermandades, fotografías y Fuentes sobre el modelo ya
cerrado. El SEO P0 permanece cerrado; este ciclo avanza contenido y corrige
incidencias reales de presentación sin ampliar la arquitectura. No queda ninguna
PR funcional abierta en este corte y las aportaciones públicas permanecen
desactivadas.