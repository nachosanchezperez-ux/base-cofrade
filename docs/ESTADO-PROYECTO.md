# Estado operativo de Hilo Cofrade

> Registro vivo para Hilo Orquestador. GitHub, Vercel y Supabase son la fuente de verdad. Si existe discrepancia, prevalece siempre el estado real de las herramientas. Este documento resume decisiones vigentes, no actúa como diario de commits.

## Baseline operativo

- Revisión: **2026-08-23 17:38 CEST**.
- Repositorio: `nachosanchezperez-ux/base-cofrade`.
- Rama principal observada al cerrar el corte funcional: `main`.
- `main`: `c37a29711f8bdc7791d303f8182b130fd3f0d7fe`.
- Último frente funcional de Arquitectura pública: **#267 · Blinda la autoridad pública de Pasos**.
- Proyecto Vercel: `base-cofrade`.
- Producción funcional: **READY** en `dpl_A6Y4yCwkhQ92Y8XxwTnv6DPpAuXM`, alineada con `c37a29711f8bdc7791d303f8182b130fd3f0d7fe`.
- Supabase: `Hilocofrade` (`kcevwkucqzcyrqaimyhl`) **ACTIVE_HEALTHY** en la última comprobación aplicable.
- Última migración remota estructural verificada: `20260823134318_mass_import_relational_integrity`.
- PR estructural antigua: **#49**, aparcada; no usar su rama como base técnica.

Antes de cada tarea significativa el Orquestador debe volver a refrescar `main`, PR abiertas, Vercel y Supabase cuando proceda. Los identificadores anteriores son un baseline funcional, no referencias permanentes.

## Secuencia de Dirección activa

1. Smoke transversal de producción → **🟢 CERRADO**.
2. Directorio unificado → **🟢 CERRADO**.
3. Fichas de Hermandad → **🟢 CERRADO**.
4. Limpieza del backlog estructural → **🟢 CERRADO**.
5. Auditoría de cargas relacionales recientes → **🟢 CERRADO**.
6. **Arquitectura pública / separación Front ↔ Panel → EN CURSO**.
   - Home → **🟢 CERRADO**.
   - Hermandades → **🟢 CERRADO**.
   - Imágenes → **🟢 CERRADO**.
   - Pasos → **🟢 CERRADO**.
   - **Bandas → SIGUIENTE CORTE**.
   - Extraordinarias.
   - Marchas.
   - Personas / agentes.
7. Salud del grafo.
8. Registro y formalización de decisiones HC.
9. Elegir un único siguiente gran frente.

No abrir otro frente estructural que compita con el corte activo del Carril A.

## Carriles paralelos autorizados

### Carril A · Técnico crítico

Responsable principal: **Hilo Tech**, con Hilo Supabase / Datos / QA cuando proceda.

Objetivo actual:

- cerrar Arquitectura pública entidad por entidad;
- **corte activo: Bandas**;
- orden posterior: Extraordinarias → Marchas → Personas/agentes.

Carril A tiene prioridad de bloqueo sobre la entidad activa. Mientras una entidad esté en auditoría no modificar sin coordinación explícita:

- loaders públicos;
- RLS o políticas relacionadas;
- vistas / RPC de su lectura pública;
- contratos de datos consumidos por el Front;
- rutas públicas de esa entidad;
- componentes transversales incluidos en su barrera de regresión.

### Carril B · Producto y operación

Puede avanzar en paralelo sobre Panel, importación masiva vigente y UX operativa siempre que no toque la autoridad pública del corte activo.

La infraestructura vigente sigue siendo `app/panel/(protected)/datos/importar`, `lib/panel/bulk-import*.js` y `20260822204505_bulk_import_pipeline.sql`. Los endurecimientos operativos recientes del importador se integraron antes de #267 sin solape con Pasos.

No reactivar la arquitectura técnica de #49.

### Carril C · Contenido y enriquecimiento

Puede continuar cargando contenido y relaciones sobre el modelo vigente: Hermandades, Imágenes, Pasos, Bandas, capataces, acompañamientos, fuentes, extraordinarias, patrimonio, históricos y media.

Debe preservar IDs, relaciones canónicas e históricos. Si una carga revela una carencia del modelo, elevarla al Orquestador; no improvisar nuevas tablas o campos durante el corte activo.

### Regla de coordinación

Antes de iniciar trabajo paralelo comprobar solape por archivos, tablas/vistas/RPC, contratos de datos, entidad pública activa, migraciones y componentes compartidos. Si existe solape sensible, gana Carril A. Si no existe, los carriles pueden fusionar de forma independiente sobre el `main` real actualizado.

## Backlog estructural

- #232 Extraordinarias responsive → **fusionada**.
- #211 Cabecera de Bandas → **fusionada**.
- #234 `También en Hilo Cofrade` → **fusionada**.
- #239 Sede y visita → **reconstruida y fusionada**.
- #168 Tira del hilo 2.11 → **cerrada por superada**.
- #49 Importador documental MVP → **aparcada**. Si se recupera la idea URL → análisis → propuesta → revisión, reconstruir desde el `main` vigente.
- #214 Autoridad pública de Hermandades → **integrada**; no reabrir su rama antigua.

Regla permanente: no conservar ramas caducadas por coste hundido. Si la intención sigue siendo válida, reconstruir sobre el `main` real.

## Integridad de cargas relacionales

PR **#252 · Audita y protege las importaciones relacionales** → **🟢 CERRADA**.

Migración canónica: `20260823134318_mass_import_relational_integrity.sql`.

Resultado estable:

- duplicados de Cristo de la Corona y Escolanía Salesiana consolidados sin cambiar IDs canónicos;
- fuentes relacionales reunificadas;
- `source_links` legacy normalizados cuando existía correspondencia inequívoca;
- guarda de propietario vigente único para pasos procesionales;
- guardas contextuales de identidad de bandas dentro del mismo municipio;
- no imponer unicidad global de nombre porque existen homónimos legítimos.

## Arquitectura pública · cierres

### Home → 🟢 cerrado

PR **#254** dejó barrera de regresión sobre una cadena pública/stateless. Vistas `security_invoker=true`, RLS/rol `anon`, CI, preview, producción y runtime verificados.

### Hermandades → 🟢 cerrado

PR **#256** migró a cliente público `brotherhoods.js`, `brotherhood-display.js` y `brotherhood-musical-heritage.js`. PR **#257** eliminó la última dependencia cookie-aware en `BrotherhoodRelationalExtras.js` y extendió la barrera a la capa relacional.

Reglas canónicas: Patrimonio general separado de Patrimonio musical; Sede como relación con `places`; sin excepciones por slug; ficha y enriquecimiento relacional públicos sin sesión editorial.

### Imágenes → 🟢 cerrado

PR **#261** confirmó que directorio, ficha, media y enriquecimiento relacional ya utilizaban cliente público stateless. Se añadió `test/image-public-authority-boundary.test.mjs` y se verificaron RLS, rol `anon`, vistas `security_invoker`, CI, preview, producción y runtime.

### Pasos → 🟢 cerrado

PR **#267 · Blinda la autoridad pública de Pasos** → **🟢 FUSIONADA**.

La auditoría completa de `/pasos` y `/pasos/[slug]` localizó una única dependencia cookie-aware directa:

- `lib/supabase/step-heritage.js`.

Cambio aplicado:

- `step-heritage.js` pasa de `@/lib/supabase/server` a `createPublicClient()` de `@/lib/supabase/public`;
- no se alteraron consultas, filtros, shape, UI, rutas, datos, esquema ni políticas;
- nuevo `test/step-public-authority-boundary.test.mjs` protege directorio, ficha, media, patrimonio, Hermandad relacionada, `Tira del hilo`, presencia relacional y el contrato stateless del cliente público.

Seguridad verificada:

- tablas directas de la cadena de Pasos con RLS activa y `SELECT` para `anon`;
- `step_brotherhood_history` → `security_invoker=true`;
- `step_image_history` → `security_invoker=true`;
- `step_phase_details` → `security_invoker=true`;
- rol `anon`: 25 entidades Paso publicadas, 31 relaciones Hermandad↔Paso, 30 Imagen↔Paso, 86 acompañamientos actuales, 46 fases patrimoniales y 67 responsables de fase;
- Paso de la Piedad bajo `anon`: **11 fases, 17 responsables y 1 fuente**;
- no se requirió migración ni modificación de políticas.

Concurrencia:

- #267 fue reconstruida sobre el `main` real cuando los trabajos paralelos del Carril B avanzaron;
- las integraciones paralelas previas al merge solo afectaban Panel/importación masiva y no compartían archivos, RLS, rutas, loaders ni contratos de Pasos;
- el head final se construyó sobre `6ab41a84a1915cf6e97fe8450fde504d5f7a2fa7` y se fusionó por squash como `c37a29711f8bdc7791d303f8182b130fd3f0d7fe`.

Verificación técnica y pública:

- CI de #267: **success**;
- preview final: **READY**;
- `/pasos` en preview: **HTTP 200**, 25 pasos publicados;
- las fichas del preview quedaron detrás de SSO de Vercel, por lo que la comprobación rica se realizó en producción;
- producción funcional: `dpl_A6Y4yCwkhQ92Y8XxwTnv6DPpAuXM` **READY**;
- `/pasos`: **HTTP 200**, 25 pasos publicados;
- `/pasos/paso-de-la-piedad`: **HTTP 200**, preservando Hermandad, dos imágenes, Banda del Sol, `Tira del hilo`, 11 fases patrimoniales, responsables y fuente;
- `/pasos/paso-procesional-divina-pastora-cantillana`: **HTTP 200**, preservando Hermandad, imagen, Banda de la Soledad, `Tira del hilo`, fases de 1919 y 2008 y fuente;
- runtime del deployment funcional: sin logs `error`/`fatal` tras los smokes.

Conclusión: **PASOS · AUTORIDAD PÚBLICA → 🟢 CERRADO**.

## Zonas sensibles permanentes

### Directorios

`/directorio` y sus familias son la arquitectura canónica. Reutilizar sus filtros y segmentación; no crear listados paralelos.

### Tira del hilo

#234 es la base integrada; #168 está superada. No crear una segunda lógica de grafo paralela.

### Datos

- reutilizar entidades canónicas antes de crear nuevas;
- preservar IDs, relaciones, fuentes e históricos;
- no degradar entidades reales a texto libre cuando existe relación estructurada;
- resolver identidad por contexto, no mediante unicidad global de nombres.

## Método obligatorio para el siguiente corte

**Bandas** debe auditarse de extremo a extremo:

1. localizar todos los loaders/componentes usados por `/bandas` y `/bandas/[slug]`;
2. detectar dependencias de `@/lib/supabase/server`, `@supabase/ssr`, `next/headers` o sesión editorial;
3. comprobar RLS, vistas y funciones implicadas;
4. migrar solo las lecturas públicas que lo necesiten;
5. añadir o ampliar barrera de regresión;
6. CI + preview;
7. smoke público sin sesión;
8. producción + runtime;
9. actualizar este registro si cambia el mapa de coordinación.

## Regla para «¿Qué toca ahora?»

No generar una lluvia de ideas. Refrescar el estado real, localizar el punto de la secuencia y devolver una sola acción ejecutable.

**Siguiente acción actual: auditar Bandas de extremo a extremo para verificar su autoridad pública, RLS/vistas y ausencia de dependencias de sesión/cookies.**
