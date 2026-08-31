# Hilo Cofrade · Estado canónico

**Corte validado:** 31 de agosto de 2026 · 12:30 UTC

**Régimen:** `FIRST EDITION FREEZE` activo

**Fase activa:** editorial y documental

## Estado general

**PRIMERA EDICIÓN → 🟢 CERRADA, CERTIFICADA Y CONGELADA**

- Baseline funcional y estructural: `a025098528351656503460596d28b5318e39daf5`.
- `main` total validado antes de esta actualización documental:
  `95dab43cd11ba07bfeb3d1780a29c0cf73b6dc87`.
- La evolución posterior al baseline contiene una corrección real de presentación
  (#448), cierres editoriales/de contenido (#449 y #450) y un endurecimiento de
  validación cerrado por defecto (#451); no abre una nueva edición ni amplía la
  arquitectura.
- Matriz manual 390/768/1024/1440 aprobada por Dirección.
- No hay un frente funcional abierto ni PR abiertas en el corte.
- Durante el freeze solo se permiten contenido, datos, fotografías, Fuentes,
  seguridad, legal, bugs e incidencias reales.

## GitHub y baseline técnico

- Baseline funcional/estructural: `a025098528351656503460596d28b5318e39daf5`
  (#432).
- Último `main` total comprobado: `95dab43cd11ba07bfeb3d1780a29c0cf73b6dc87`
  (#451).
- #439: fusionada en `378b20be3301f42635673ae9f41bbe6104a90b40`.
- #432: fusionada en `a025098528351656503460596d28b5318e39daf5`.
- PR abiertas: 0.
- El commit total tiene CI #1252 y Vercel en verde. La suite de #451 quedó en
  485/485 con build y `git diff --check` correctos.

## Producción y Vercel

**PRODUCCIÓN → 🟢 ESTABLE**

- Deployment: `dpl_F1Hb9zVis6XgfrJWsTadCusNnfwn`.
- Commit desplegado: `95dab43cd11ba07bfeb3d1780a29c0cf73b6dc87`.
- Estado: `READY`; target: producción.
- Dominios: `https://hilocofrade.es` y `https://www.hilocofrade.es`, con
  redirección canónica correcta.
- Runtime del deployment exacto: 0 errores, 0 fatales y 0 respuestas 5xx en el
  corte; no hay hilos de revisión Vercel sin resolver.
- Smoke HTTP 200 correcto en Home, Directorio, Hermandad, Imagen, Paso, Banda,
  Extraordinarias, Gloria, Igualás, Tira del hilo, Legal, Privacidad, Cookies,
  Panel y `/colabora`.

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
cerrado. No queda ninguna PR abierta en este corte y las aportaciones públicas
permanecen desactivadas.
