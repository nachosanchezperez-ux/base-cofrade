# Estado operativo de Hilo Cofrade

> Registro vivo para Hilo Orquestador. GitHub, Vercel y Supabase son la fuente de verdad. Si existe discrepancia, prevalece siempre el estado real de las herramientas. Este documento resume decisiones vigentes, no actúa como diario de commits.

## Baseline operativo

- Revisión: **2026-08-23 17:14 CEST**.
- Repositorio: `nachosanchezperez-ux/base-cofrade`.
- Rama principal observada al cerrar el corte funcional: `main`.
- Commit funcional de Arquitectura pública: `41dc3d2576aa1c2e97ea8766c3b08c1dea8b924d`.
- Último frente funcional integrado: **#261 · Blinda la autoridad pública de Imágenes**.
- Proyecto Vercel: `base-cofrade`.
- Producción funcional: **READY** en `dpl_DHVcsgRXk9GfJmKEqz2WSiKAF1Qv`, alineada con `41dc3d2576aa1c2e97ea8766c3b08c1dea8b924d`.
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
   - **Pasos → SIGUIENTE CORTE**.
   - Bandas.
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
- **corte activo: Pasos**;
- orden posterior: Bandas → Extraordinarias → Marchas → Personas/agentes.

Carril A tiene prioridad de bloqueo sobre la entidad activa. Mientras una entidad esté en auditoría no modificar sin coordinación explícita:

- loaders públicos;
- RLS o políticas relacionadas;
- vistas / RPC de su lectura pública;
- contratos de datos consumidos por el Front;
- rutas públicas de esa entidad;
- componentes transversales incluidos en su barrera de regresión.

### Carril B · Producto y operación

Puede avanzar en paralelo sobre Panel, importación masiva vigente y UX operativa siempre que no toque la autoridad pública del corte activo.

Puede trabajar en:

- `bulk_imports` / `bulk_import_items`;
- validación previa y detección de duplicados;
- resumen de cambios;
- mensajes de éxito/error;
- navegación y responsive del Panel;
- mejoras de transporte/carga que no cambien modelo público, RLS ni contratos de la entidad activa.

No debe reactivar la arquitectura técnica de #49.

### Carril C · Contenido y enriquecimiento

Puede continuar cargando contenido y relaciones sobre el modelo vigente:

- Hermandades, Imágenes, Pasos y Bandas;
- capataces y acompañamientos;
- fuentes y trazabilidad;
- extraordinarias;
- patrimonio e históricos;
- escudos, fotografías, hábitos y media.

Debe preservar IDs, relaciones canónicas e históricos. Si una carga revela una carencia del modelo, elevarla al Orquestador; no improvisar nuevas tablas/campos durante el corte activo.

### Regla de coordinación

Antes de iniciar trabajo paralelo comprobar solape por:

1. archivos;
2. tablas / vistas / RPC;
3. contratos de datos;
4. entidad pública activa;
5. migraciones;
6. componentes compartidos.

Si existe solape sensible, gana Carril A. Si no existe, los carriles pueden fusionar de forma independiente sobre el `main` real actualizado.

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

Migración canónica:

- `20260823134318_mass_import_relational_integrity.sql`.

Resultado estable:

- duplicados de Cristo de la Corona y Escolanía Salesiana consolidados sin cambiar IDs canónicos;
- fuentes relacionales reunificadas;
- `source_links` legacy normalizados cuando existía correspondencia inequívoca;
- guarda de propietario vigente único para pasos procesionales;
- guardas contextuales de identidad de bandas dentro del mismo municipio;
- no imponer unicidad global de nombre porque existen homónimos legítimos.

La infraestructura masiva vigente está en `app/panel/(protected)/datos/importar`, `lib/panel/bulk-import*.js` y `20260822204505_bulk_import_pipeline.sql`.

## Arquitectura pública · cierres

### Home → 🟢 cerrado

PR **#254** dejó barrera de regresión sobre una cadena que ya era pública/stateless.

Verificado:

- vistas `security_invoker=true`;
- RLS y lectura pública;
- rol `anon` correcto;
- CI, preview, producción y runtime correctos.

### Hermandades → 🟢 cerrado

PR **#256** migró a cliente público:

- `lib/supabase/brotherhoods.js`;
- `lib/supabase/brotherhood-display.js`;
- `lib/supabase/brotherhood-musical-heritage.js`.

PR **#257** eliminó la última dependencia cookie-aware en `BrotherhoodRelationalExtras.js` y extendió la barrera a la capa relacional.

Reglas canónicas a preservar:

- Patrimonio general separado de Patrimonio musical;
- Sede como relación canónica con `places`;
- sin excepciones por slug;
- ficha y enriquecimiento relacional públicos sin sesión/cookies editoriales.

### Imágenes → 🟢 cerrado

PR **#261 · Blinda la autoridad pública de Imágenes** → **🟢 FUSIONADA**.

La auditoría completa confirmó que no era necesario reescribir loaders. La arquitectura funcional ya utilizaba cliente público stateless en:

- `app/imagenes/page.js` → `getImagesDirectory()`;
- `app/imagenes/[slug]/page.js` → `getImagenPageBySlug()` y multimedia pública;
- `lib/supabase/directories.js`;
- `lib/supabase/public-entity-pages.js`;
- `lib/supabase/entity-media.js`;
- `lib/supabase/brotherhoods.js` como dependencia de la Hermandad relacionada;
- `components/RelationalThread.js`;
- `lib/supabase/relational-presence.js`.

Seguridad verificada:

- `image_brotherhood_history` → `security_invoker=true`;
- `current_image_locations` → `security_invoker=true`;
- `image_authorship_details` → `security_invoker=true`;
- tablas directas de la cadena con RLS activa y SELECT anónimo previsto;
- las vistas no exponen imágenes no publicadas bajo rol `anon`;
- lecturas `anon` devuelven correctamente hermandad, paso, autoría, intervenciones, media y fuentes según cada ficha.

Cambio aplicado:

- nuevo `test/image-public-authority-boundary.test.mjs`;
- impide introducir `@/lib/supabase/server` o `next/headers` en la superficie pública;
- exige cliente público explícito en los loaders que crean Supabase;
- comprueba que `lib/supabase/public.js` siga siendo stateless;
- protege también el enriquecimiento relacional de `Tira del hilo`.

Verificación:

- #261: 1 archivo nuevo, sin cambios funcionales, datos, esquema, RLS, UI ni Panel;
- CI: **success**;
- preview Vercel: **READY**;
- `/imagenes` en preview: **HTTP 200** y 36 imágenes publicadas;
- las fichas individuales del preview estaban tras SSO de Vercel, por lo que no se declara smoke individual de preview;
- producción funcional: `dpl_DHVcsgRXk9GfJmKEqz2WSiKAF1Qv` **READY**;
- `/imagenes`: **HTTP 200**, 36 imágenes publicadas;
- `/imagenes/maria-santisima-victoria-cigarreras`: **HTTP 200**, con Hermandad, paso, Tira del hilo, restauraciones y fuentes;
- `/imagenes/divina-pastora-de-las-almas-de-cantillana`: **HTTP 200**, con fotografía, autoría atribuida, Hermandad, paso, Tira del hilo y fuente;
- runtime del deployment funcional: sin logs `error`/`fatal` tras los smokes.

Conclusión: **IMÁGENES · AUTORIDAD PÚBLICA → 🟢 CERRADO**.

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

**Pasos** debe auditarse de extremo a extremo:

1. localizar todos los loaders/componentes usados por `/pasos` y `/pasos/[slug]`;
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

**Siguiente acción actual: auditar Pasos de extremo a extremo para detectar cualquier dependencia pública de sesión/cookies, verificar RLS/vistas y dejar una barrera de regresión equivalente a Home, Hermandades e Imágenes.**
