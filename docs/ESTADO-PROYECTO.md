# Hilo Cofrade · Estado canónico

**Corte validado:** 31 de agosto de 2026 · 06:33 UTC
**Régimen:** `FIRST EDITION FREEZE` activo

## Estado general

**PRIMERA EDICIÓN → 🟢 CERRADA Y CONGELADA**

- Baseline técnico y visual cerrado.
- Matriz manual 390/768/1024/1440 aprobada por Dirección.
- No hay una nueva fase funcional abierta.
- Durante el freeze solo se permiten contenido, datos, fotografías, Fuentes,
  seguridad, legal, bugs e incidencias reales.

## GitHub y baseline técnico

- `main`: `f160b34c3b09b997d9dae214dfa56315c589aff2`.
- Último merge: #443, igualá del Rosario de Santiago.
- #442, normalización visual del logotipo de Tres Caídas: fusionada.
- PR abiertas: #439 y #432.
- #439 reconciliada con este `main`: 475/475 tests, build de producción,
  TypeScript, CI #1221 y preview Vercel verdes.
- #439 no se fusiona porque su rama Supabase continúa roja; el bloqueo está
  aislado y no afecta a `main` ni a producción.

## Producción y Vercel

**PRODUCCIÓN → 🟢 ESTABLE**

- Deployment: `dpl_F2yg72LS91EmUNEZArcRJZiVm59G`.
- Commit desplegado: `f160b34c3b09b997d9dae214dfa56315c589aff2`.
- Estado: `READY`; región operativa: `dub1`.
- Dominios: `https://hilocofrade.es` y `https://www.hilocofrade.es`.
- Runtime del deployment: sin errores ni fatales en el corte.
- Smoke HTTP 200 en Home, Directorio, Hermandad, Banda, Gloria, Igualás,
  Extraordinarias, Legal, Privacidad, Cookies, Panel y `/colabora`.

## #439 · Aportaciones públicas seguras

**Estado → 🟣 BLOQUEADA POR REPRODUCIBILIDAD HISTÓRICA DE RAMAS**

- Head: `b84ecfa388d4130fcb6afb91bb040429d0a049bd`.
- Base real: `main` `f160b34c`.
- GitHub: mergeable; CI y preview Vercel verdes.
- Auditoría de código: validación estricta de payload y tipos, límites de
  archivos, recodificación de imágenes, Turnstile preparado, rate limit,
  cuarentena privada, escritura solo servidor, errores públicos genéricos y
  ninguna publicación automática en el grafo.
- El flag solo abre el canal con valor literal
  `PUBLIC_CONTRIBUTIONS_ENABLED=true` y configuración completa.
- La versión auditada devuelve una página cerrada antes de renderizar el
  formulario y rechaza la acción antes del honeypot cuando el flag está apagado.
- No se fusiona mientras la rama Supabase no reproduzca todo el historial.

## Aportaciones públicas

**APORTACIONES → ⚪ INFRAESTRUCTURA PREPARADA · 🔒 DESACTIVADAS**

- Producción muestra «Las aportaciones públicas aún no están abiertas».
- No existe formulario público activo.
- La página declara que no recoge propuestas ni datos personales.
- `contributions`: RLS activa, 0 filas y sin `SELECT`/`INSERT` para `anon` ni
  `authenticated`.
- No se ha activado Turnstile ni cambiado el flag a `true`.

## #432 · Fondo configurable de logotipos de Bandas

**Estado → 🟣 BLOQUEADA POR CAUSA CONCRETA**

- Head: `e9a8468ea45ab815acf546413fd786fe0c024b49`.
- GitHub: abierta y no mergeable frente al `main` actual.
- Preview Vercel histórica: `READY`.
- No existe actualmente una rama Supabase propia de #432.
- La auditoría funcional conserva sentido: campo nullable reutilizable,
  validación HEX `#RRGGBB`, opción «Sin fondo», selector y preview; Panel y Front
  comparten el mismo valor.
- No contiene estilos por slug, excepciones por Banda ni una segunda lógica de
  tamaño; no duplica el tratamiento visual genérico vigente.
- No se revalida ni fusiona hasta disponer de una rama Supabase reproducible y
  reconciliarla con `main`.

## Migración 048 y ramas Supabase

**048 → 🟢 DIAGNOSTICADA Y REPRODUCIDA · CADENA POSTERIOR → 🟣 BLOQUEADA**

- `20260818133048_consolidar_san_benito` presupone una Hermandad, tres Pasos,
  titulares, sede y relaciones canónicas creadas antes desde el Panel.
- En ramas `with_data=false` esos registros no existen; por eso 048 lanzaba
  «no existe el registro canónico de San Benito».
- Se eligió estrategia C: baseline idempotente anterior a 048, sin reescribir
  la migración ni cambiar los datos reales de San Benito.
- La rama de #439 superó 048 y avanzó hasta 054. Un segundo baseline mínimo
  permitió superar 054 y llegar a 057.
- Bloqueo actual exacto: `20260819130530_logotipo_portadas_puebla` espera la
  Banda Municipal de Música de La Puebla del Río y tres publicaciones creadas
  históricamente fuera de las migraciones.
- La sucesión 048 → 054 → 057 demuestra un problema global del historial. No se
  añaden más parches por entidad: la solución pendiente es un baseline de datos
  versionado y completo, o una política segura de ramas con copia controlada.

## Git ↔ Supabase

**PRODUCCIÓN → 🟢 ALINEADA**

- Git `main`: 191 migraciones.
- Supabase producción: 191 migraciones.
- Última versión común:
  `20260831061147_publica_iguala_rosario_santiago_2026`.
- `20260830232314_close_public_contribution_endpoint` está aplicada y
  versionada; no se ejecutó de nuevo.
- Los baselines investigados y la migración segura nueva permanecen solo en
  #439; al no fusionarse, no crean divergencia en producción.
- Proyecto Supabase: `ACTIVE_HEALTHY`; 77 tablas públicas con RLS activa.

## Seguridad, Auth y Legal

**SEGURIDAD → 🟢 EN PRODUCCIÓN · #439 SIN ROJOS DE CÓDIGO**

- Front público anónimo y stateless; Panel autenticado y no indexable.
- RLS de `contributions` activa y canal público sin privilegios.
- Sin secretos en cliente, claves sensibles públicas, datos personales en logs,
  SQL ni stack traces expuestos por #439.
- `/aviso-legal`, `/privacidad` y `/cookies`: operativas.
- La activación futura exige un corte separado de Legal → Privacidad →
  Seguridad → Turnstile → QA → Activación.

## Salud del grafo

**GRAFO → 🟢 SIN BLOQUEOS NUCLEARES**

- 0 relaciones de entidad con extremos inexistentes.
- 0 relaciones publicadas con extremos no públicos.
- 0 relaciones Hermandad–Paso, Hermandad–Imagen o Imagen–Paso con extremos
  inexistentes.
- 0 claves foráneas públicas sin validar.

## Freeze

`FIRST EDITION FREEZE` continúa activo. No se abren funcionalidades, entidades,
módulos, Homes, rediseños ni una Segunda Edición. El único frente siguiente
admisible es resolver de forma general la reproducibilidad histórica de ramas
Supabase; después se revalidarán #439 y #432 por separado.
