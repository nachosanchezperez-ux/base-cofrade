# Hilo Cofrade · Estado canónico

**Corte validado:** 31 de agosto de 2026 · 14:30 UTC

**Régimen:** `FIRST EDITION FREEZE` activo

**Fase activa:** editorial y documental

## Estado general

**PRIMERA EDICIÓN → 🟢 CERRADA, CERTIFICADA Y CONGELADA**

- Baseline funcional y estructural: `a025098528351656503460596d28b5318e39daf5`.
- Último commit funcional validado en este corte:
  `c8407c9e2566ea1594127290e1bf4ee022f3fc7f`.
- La evolución posterior al baseline contiene únicamente certificación canónica
  (#452), mantenimiento SEO P0 (#453 y #454) y una corrección visual real de
  Bandas (#455); no abre una nueva edición ni amplía la arquitectura.
- Matriz manual 390/768/1024/1440 aprobada por Dirección.
- No hay un frente funcional abierto ni PR abiertas en el corte.
- Durante el freeze solo se permiten contenido, datos, fotografías, Fuentes,
  seguridad, legal, bugs e incidencias reales.

## GitHub y baseline técnico

- Baseline funcional/estructural: `a025098528351656503460596d28b5318e39daf5`
  (#432).
- Último `main` funcional comprobado: `c8407c9e2566ea1594127290e1bf4ee022f3fc7f`
  (#455).
- #439: fusionada en `378b20be3301f42635673ae9f41bbe6104a90b40`.
- #432: fusionada en `a025098528351656503460596d28b5318e39daf5`.
- #452: certifica el baseline canónico y mantiene `FIRST EDITION FREEZE`.
- #453: SEO P0 fusionado en `d26fde8dd0dac51bd9a6c4b86345bba1784cc8a9`.
- #454: limpieza SEO de Igualás fusionada en
  `8bfca4d4cf23460a414d3f507f8a1f2774551299`.
- #455: corrección visual de Mairena fusionada en
  `c8407c9e2566ea1594127290e1bf4ee022f3fc7f`.
- PR abiertas: 0 en el corte funcional.
- La última ejecución `Production SEO Smoke` sobre ese commit funcional es la
  #22 y termina `SUCCESS`.
- Las sincronizaciones documentales posteriores no alteran el baseline funcional
  ni obligan a reescribir este SHA de forma recursiva.

## Producción y Vercel

**PRODUCCIÓN → 🟢 ESTABLE**

- Último deployment funcional validado: `dpl_7vRuFGN8j2SiKmKN1eohANnjXcpT`.
- Commit funcional desplegado: `c8407c9e2566ea1594127290e1bf4ee022f3fc7f`.
- Estado: `READY`; target: producción.
- Dominios: `https://hilocofrade.es` y `https://www.hilocofrade.es`, con
  redirección canónica correcta.
- Runtime: 0 errores detectados en la última hora y 0 respuestas 5xx en el
  deployment funcional validado; la muestra observada registra 49 respuestas
  200.
- El `Production SEO Smoke` automático del deployment funcional validado pasa
  correctamente sobre Home, Directorio, Extraordinarias, Glorias, Igualás,
  Baratillo, Cigarreras y una URL dinámica de cada agenda obtenida desde el
  sitemap.

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
- No hubo migraciones, cambios de esquema, RLS, datos ni Panel.
- No se hizo una conversión masiva a ISR durante el freeze: la optimización de
  caché queda reservada a una incidencia o métrica de rendimiento verificable.

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
- Producción registra la migración y conserva las 32 Bandas con `NULL`: no hubo
  normalización masiva ni cambio visual por defecto.

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

**PRODUCCIÓN → 🟢 ALINEADA**

- Git y Supabase registran exactamente 4 migraciones activas:
  `20260831070000_first_edition_baseline`,
  `20260831071000_secure_public_contributions_reconciled`,
  `20260831072000_add_band_logo_background_color` y
  `20260831074355_publica_tres_igualas_septiembre_2026`.
- Diferencias de historial: ninguna.
- Proyecto Supabase: `ACTIVE_HEALTHY`.
- Ramas de desarrollo activas: ninguna; solo permanece `main`.

## Seguridad, Auth, Storage y Legal

**SEGURIDAD → 🟢 SIN BLOQUEO DE PRODUCCIÓN**

- Todas las tablas públicas tienen RLS activa.
- Auth registra 1 usuario y el Panel 1 miembro activo; no se extrajeron datos
  personales durante el control.
- Los seis avisos sobre funciones `SECURITY DEFINER` corresponden a funciones
  autenticadas del Panel: no son ejecutables por `anon`, fijan `search_path` y
  comprueban el rol activo antes de operar.
- Los dos avisos de tablas RLS sin política quedan cerrados por defecto:
  `contribution_attempts` no tiene privilegios API y `completeness_rules`, aunque
  conserva grants heredados, no expone filas al carecer de políticas.
- Storage separa medios públicos de la cuarentena privada; no hay políticas
  anónimas de escritura.
- `/aviso-legal`, `/privacidad` y `/cookies`: operativas.
- Los avisos de rendimiento restantes son deuda de optimización no bloqueante;
  no se abre una limpieza masiva durante el freeze sin una incidencia medible.

## Salud del grafo

**GRAFO → 🟢 SIN BLOQUEOS NUCLEARES**

- 0 relaciones genéricas con extremos inexistentes.
- 0 relaciones publicadas con extremos no públicos.
- 0 claves foráneas públicas sin validar.

## Freeze y fase activa

`FIRST EDITION FREEZE` continúa activo. No se abren funcionalidades, entidades,
módulos, Homes, rediseños ni una Segunda Edición.

La fase activa es exclusivamente editorial/documental: completar y verificar
Bandas, Glorias, Igualás, Hermandades, fotografías y Fuentes sobre el modelo ya
cerrado. El SEO P0 queda cerrado como mantenimiento compatible con el freeze, no
queda ninguna PR funcional abierta en este corte y las aportaciones públicas
permanecen desactivadas.