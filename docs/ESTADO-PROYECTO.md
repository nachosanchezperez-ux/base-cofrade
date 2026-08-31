# Hilo Cofrade · Estado canónico

**Corte validado:** 31 de agosto de 2026 · 09:20 UTC
**Régimen:** `FIRST EDITION FREEZE` activo

## Estado general

**PRIMERA EDICIÓN → 🟢 CERRADA Y CONGELADA**

- Baseline técnico y visual cerrado.
- Matriz manual 390/768/1024/1440 aprobada por Dirección.
- No hay una nueva fase funcional abierta.
- Durante el freeze solo se permiten contenido, datos, fotografías, Fuentes,
  seguridad, legal, bugs e incidencias reales.

## GitHub y baseline técnico

- `main`: `2a8e01adb7f9c2b7edc7c19f24caf21d56f8a042`.
- Último merge: #445, tres igualás oficiales de septiembre de 2026.
- #439: fusionada en `378b20be3301f42635673ae9f41bbe6104a90b40`.
- Única PR abierta: #432.
- #432 head: `4efca69bf5c43f09f3af61bb3beae5481a8fa930`;
  mergeable, CI #1238 verde y preview Vercel `READY`.
- Suite del head de #432: 484/484; build y TypeScript correctos.

## Producción y Vercel

**PRODUCCIÓN → 🟢 ESTABLE**

- Deployment: `dpl_7xcbC8yBwYQuCNxfzLtjHUuxPaTd`.
- Commit desplegado: `2a8e01adb7f9c2b7edc7c19f24caf21d56f8a042`.
- Estado: `READY`; región operativa: `dub1`.
- Dominios: `https://hilocofrade.es` y `https://www.hilocofrade.es`.
- Runtime: sin errores ni fatales en el corte.
- Smoke correcto en Home, Directorio, Hermandad, Banda, Gloria, Igualás,
  Extraordinarias, Legal, Privacidad, Cookies, Panel y `/colabora`.

## #439 · Aportaciones públicas seguras

**Estado → 🟢 FUSIONADA · SERVICIO CERRADO**

- La infraestructura segura y el baseline reproducible están versionados en
  `main`.
- `PUBLIC_CONTRIBUTIONS_ENABLED` permanece `false`.
- `/colabora` no renderiza un formulario y declara que no recoge propuestas
  ni datos personales.
- El endpoint falla cerrado; Turnstile está preparado, pero no activado.
- La activación futura requiere un corte separado de Legal → Privacidad →
  Seguridad → Turnstile → QA → Activación.

## Aportaciones públicas

**APORTACIONES → ⚪ INFRAESTRUCTURA PREPARADA · 🔒 DESACTIVADAS**

- `contributions`: RLS activa y 0 filas.
- `anon`: sin `SELECT`, `INSERT`, `UPDATE` ni `DELETE`.
- `authenticated`: sin `INSERT` ni `DELETE`; lectura y actualización solo
  mediante políticas de miembros/editor del Panel.
- La cuarentena de archivos permanece privada.
- No se ha publicado ningún formulario ni activado el flag.

## #432 · Fondo configurable de logotipos de Bandas

**Estado → 🟢 LISTA PARA FUSIÓN**

- Campo nullable reutilizable, validación HEX `#RRGGBB`, selector, preview y
  opción «Sin fondo».
- Panel y Front comparten `bands.logo_background_color`.
- No contiene estilos por slug, excepciones por Banda ni una segunda lógica de
  tamaño; conserva el normalizador óptico y `object-fit: contain`.
- La rama Supabase temporal reprodujo baseline, seguridad, #432 y seed.
- Persistencia real comprobada con Maestro Tejera (`#F2F2F2`), rechazo de HEX
  inválido y reversión a `NULL`; Las Cigarreras conservó el comportamiento sin
  fondo.
- La rama temporal fue eliminada tras el QA; producción no se tocó.
- Preview del head: `dpl_EWUjETd7YhHRs8Ezu2riWVThPrij`, `READY`.

## Migración 048 y reproducibilidad de ramas

**048 → 🟢 AISLADA POR BASELINE · BLOQUEO REAL POSTERIOR IDENTIFICADO**

- `20260818133048_consolidar_san_benito` era una migración histórica de datos
  no reproducible sin los registros canónicos de producción.
- No se reescribió la historia ni se alteraron datos reales de San Benito.
- La estrategia C quedó materializada mediante baseline único y seed mínimo,
  idempotente y sin aportaciones.
- Con ese baseline, una rama vacía supera 048. El fallo vigente apareció después:
  `20260831074355_publica_tres_igualas_septiembre_2026` asumía tres Hermandades
  presentes en producción.
- #432 contiene la corrección general: si una Hermandad fuente no existe en una
  preview vacía, su convocatoria se omite sin crear datos ficticios ni relajar
  integridad. El resultado de producción permanece idéntico.

## Git ↔ Supabase

**PRODUCCIÓN → 🟢 ALINEADA**

- Historial activo Git/Supabase:
  `20260831070000_first_edition_baseline`,
  `20260831071000_secure_public_contributions_reconciled` y
  `20260831074355_publica_tres_igualas_septiembre_2026`.
- Diferencias de historial en producción: ninguna.
- Proyecto Supabase: `ACTIVE_HEALTHY`.
- Ramas de desarrollo activas tras el QA: ninguna.

## Seguridad, Auth y Legal

**SEGURIDAD → 🟢**

- Front público anónimo y stateless; Panel autenticado y no indexable.
- Sin secretos sensibles en cliente, datos personales en logs, SQL ni stack
  traces públicos.
- `/aviso-legal`, `/privacidad` y `/cookies`: operativas.

## Salud del grafo

**GRAFO → 🟢 SIN BLOQUEOS NUCLEARES**

- 0 relaciones genéricas con extremos inexistentes.
- 0 relaciones publicadas con extremos no públicos.
- 0 relaciones Hermandad–Paso, Hermandad–Imagen o Imagen–Paso con extremos
  inexistentes.
- 0 claves foráneas públicas sin validar.

## Freeze

`FIRST EDITION FREEZE` continúa activo. No se abren funcionalidades, entidades,
módulos, Homes, rediseños ni una Segunda Edición.

La única decisión pendiente de Dirección es fusionar o no #432, ya clasificada
como lista para fusión. Las aportaciones públicas permanecen desactivadas.
