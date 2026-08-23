# Estado operativo de Hilo Cofrade

> Registro vivo para Hilo Orquestador. GitHub, Vercel y Supabase son la fuente de verdad. Este documento guarda el último baseline observado y las decisiones de coordinación activas; si existe discrepancia, prevalece siempre el estado real de las herramientas.

## Baseline observado

- Comprobación: **2026-08-23 12:46 CEST**
- Repositorio: `nachosanchezperez-ux/base-cofrade`
- Rama principal: `main`
- `main`: `1c6a4a7cd9c963c4afab96022ccc9af6f21f5947`
- Último cambio integrado: **#245 · Correcciones varias de fichas de Hermandad**
- #242 · Directorio unificado: **fusionada** antes de #245.
- Proyecto Vercel: `base-cofrade`
- Producción: **READY** sobre `1c6a4a7cd9c963c4afab96022ccc9af6f21f5947`
- Supabase: proyecto `Hilocofrade` (`kcevwkucqzcyrqaimyhl`) **ACTIVE_HEALTHY**.

El SHA anterior no pretende ser permanente. Antes de actuar, el Orquestador debe consultar de nuevo `main` y tomar el SHA real como nueva referencia operativa.

## Regla de uso

Antes de una tarea significativa:

1. refrescar `main`;
2. consultar PR abiertas;
3. identificar archivos o áreas compartidas;
4. comprobar Vercel;
5. comprobar Supabase/migraciones si la tarea toca datos;
6. clasificar riesgo y decidir secuencia de trabajo.

Al terminar una tarea que cambie ramas, PR, migraciones, bloqueos o producción, actualizar este registro solo si la información modifica decisiones futuras.

## Auditoría del backlog · 2026-08-23

Estados operativos usados en esta limpieza:

- **🟢 FUSIONAR**: la línea sigue vigente y no requiere reconstrucción conceptual. Antes de integrar debe reconciliarse con el `main` real del momento, pasar pruebas y generar preview nuevo.
- **🔵 RECONSTRUIR**: la intención sigue siendo válida, pero la rama debe rehacerse sobre el `main` actual para preservar cambios posteriores y evitar deuda.
- **⚪ APARCAR**: trabajo válido pero bloqueado o no listo para producción. No se integra hasta resolver sus prerrequisitos.
- **⚫ CERRAR POR SUPERADO**: el objetivo ya fue absorbido o sustituido por otra implementación. En esta auditoría no hay ninguna PR en este estado.

| PR | Área | Estado operativo | Evidencia / decisión |
|---|---|---|---|
| #214 · Autoridad pública de Hermandades | Supabase público / autoridad editorial | 🟢 **FUSIONAR** | Mergeable. Vercel verde. Solo cambia `brotherhood-authority.js` y documentación. Supabase confirma lectura pública de `brotherhood_section_authority`, lectura de Hermandades publicadas y `current_step_personnel` con `security_invoker=true`. |
| #232 · Calendario responsive de Extraordinarias | UI Extraordinarias | 🟢 **FUSIONAR** | Mergeable. Vercel verde. Único archivo: `components/ExtraordinaryDirectory.module.css`. Sin datos, Panel ni migraciones. |
| #211 · Cabecera de Bandas | UI Bandas / directorio | 🟢 **FUSIONAR** | Mergeable. Vercel verde. El `main` actual todavía usa el tratamiento anterior de Bandas en `RelationalEntityHero`; #242 no toca ninguno de los cuatro archivos de #211. No está superada. |
| #234 · También en Hilo Cofrade | Grafo relacional / Tira del hilo | 🟢 **FUSIONAR** | Mergeable. Vercel verde. El patch sigue alineado con el `RelationalThread` actual, usa cliente público, filtra `published` y enriquece solo nodos visibles para limitar consultas. |
| #239 · Sede y visita | Hermandades, Panel, Lugares | 🔵 **RECONSTRUIR** | Aunque GitHub la marca mergeable, está 12 commits por detrás y toca `lib/supabase/brotherhood-display.js`, modificado por #245. Rehacer sobre `main` preservando las reglas de patrimonio/salidas de #245 y la integración de Directorio. |
| #168 · Tira del hilo 2.11 | Grafo / API / Pregunta | 🔵 **RECONSTRUIR** | No mergeable y 218 commits por detrás. La intención de descubrimiento guiado sigue sin estar absorbida por `/pregunta`, pero debe reimplantarse sobre el Graph Reasoning y la UX actuales. |
| #49 · Importador documental MVP | Panel, IA, Supabase, ingesta | ⚪ **APARCAR** | Draft, no mergeable y 463 commits por detrás. Las tres migraciones del branch siguen sin aplicar en Supabase. El preview verde de su HEAD antiguo no basta para producción. Requiere rediseño/reconciliación antes de retomar. |

## Comparación contra `main`

Referencia de comparación: `1c6a4a7cd9c963c4afab96022ccc9af6f21f5947`.

| PR | Ahead | Behind | Archivos que aún difieren |
|---|---:|---:|---:|
| #214 | 2 | 107 | 2 |
| #232 | 8 | 24 | 1 |
| #211 | 7 | 131 | 4 |
| #234 | 4 | 20 | 4 |
| #239 | 9 | 12 | 8 |
| #168 | 6 | 218 | 6 |
| #49 | 15 | 463 | 9 |

El número de commits por detrás no determina por sí solo la decisión. Se prioriza el solape real de archivos, la vigencia conceptual, la mergeabilidad, el estado de Vercel y el riesgo de regresión.

## Decisiones por frente

### #214 · Autoridad pública de Hermandades

El `main` actual todavía crea un cliente de servidor dependiente de sesión en `lib/supabase/brotherhood-authority.js`. #214 lo sustituye por `createPublicClient()` sin tocar RLS ni esquema.

Auditoría directa de Supabase:

- `brotherhood_section_authority`: política `anon` de lectura limitada a Hermandades publicadas;
- `brotherhoods`: política pública de lectura limitada a entidades publicadas;
- `current_step_personnel`: `security_invoker=true`.

Decisión: **integración ordinaria, no reconstrucción**.

### #232 · Extraordinarias responsive

Cambio puramente visual y localizado. No se cruza con los cambios recientes de Home ni con Directorio.

Decisión: **integración ordinaria** con smoke móvil/escritorio de `/extraordinarias`.

### #211 · Cabecera de Bandas

La implementación sigue aportando una diferencia no presente en `main`: logotipo como protagonista de la hero, fallback por iniciales y tratamiento específico de Bandas. #242 no toca `app/bandas/page.js`, `RelationalEntityHero.js` ni sus CSS asociados.

Decisión: **integración ordinaria**, verificando antes Las Cigarreras, Maestro Tejera, La Puebla y una banda sin logotipo.

### #234 · También en Hilo Cofrade

La línea no está absorbida por `main`. Convierte `RelationalThread` en servidor para resolver presencia relacional y conserva la interacción/telemetría en un cliente separado.

La capa `relational-presence.js`:

- usa `createPublicClient()`;
- trabaja solo con entidades y relaciones `published`;
- resuelve por lotes;
- enriquece únicamente los nodos visibles;
- falla de forma segura devolviendo los items originales si una consulta no puede resolverse.

Decisión: **integración ordinaria**, con smoke de Hermandad, Imagen, Paso y Banda y revisión de latencia.

### #239 · Sede y visita

Es una línea válida y además coherente con el modelo relacional de Hilo Cofrade: el Lugar es el nodo y varias Hermandades pueden compartirlo. No debe cerrarse.

Sin embargo, su rama nació antes de #242 y #245 y vuelve a modificar la ficha pública y `brotherhood-display.js`. Por protocolo, no se integra tal cual.

Decisión: **reconstruir sobre el `main` vigente**, reaplicando solo su funcionalidad propia y conservando íntegramente las reglas de #245.

### #168 · Tira del hilo 2.11

La capacidad de pedir `otro hilo`, `sorpréndeme` o una conexión curiosa sigue sin estar incorporada en la página `/pregunta` actual. El concepto continúa siendo válido, pero la rama está demasiado separada del grafo y de la API actuales y GitHub la marca no mergeable.

Decisión: **reconstruir**, preferiblemente después de #234 para que ambas capas del descubrimiento relacional se diseñen sobre una única base.

### #49 · Importador documental MVP

El objetivo sigue siendo estratégico, pero la rama no está lista para producción.

Estado real de Supabase: no aparecen aplicadas las migraciones:

- `20260818134549_document_imports.sql`;
- `20260818150550_document_imports_music.sql`;
- `20260818235551_document_imports_agent_guard.sql`.

Además, la rama está 463 commits por detrás y modifica navegación del Panel, lógica de ingesta y tres migraciones.

Decisión: **aparcar el PR actual**. Cuando se retome la ingesta masiva, evaluar primero el diseño del MVP contra el Panel y el modelo relacional actuales y reconstruir desde `main`; no aplicar migraciones antiguas de forma automática.

## Orden operativo aprobado

1. **#214** · autoridad pública de Hermandades.
2. **#232** · Extraordinarias responsive.
3. **#211** · cabecera de Bandas.
4. **#234** · También en Hilo Cofrade.
5. **Reconstruir #239** sobre el `main` resultante.
6. **Reconstruir #168** después de estabilizar #234.
7. **#49 permanece aparcada** hasta abrir un frente específico de ingesta masiva.

Antes de cada fusión:

1. refrescar `main`;
2. reconciliar la rama;
3. ejecutar pruebas relevantes;
4. generar preview nuevo en Vercel;
5. hacer smoke funcional;
6. fusionar solo si producción puede quedar verde.

## Vercel

### Producción observada

- Estado: **READY**
- Rama: `main`
- SHA: `1c6a4a7cd9c963c4afab96022ccc9af6f21f5947`
- Framework: Next.js
- Build: Turbopack

### Estado de los HEAD auditados

Los HEAD actuales de #214, #232, #211, #234, #239, #168 y #49 tienen estado Vercel `success`. Esto solo acredita que esos commits compilaron en su momento; no sustituye el preview obligatorio después de reconciliar cada rama con el `main` vigente.

## Supabase y migraciones

Estado observado:

- proyecto `Hilocofrade`: **ACTIVE_HEALTHY**;
- #214 no necesita migración y sus premisas RLS se han comprobado directamente;
- #232, #211, #234, #239 y #168 no declaran migraciones en su alcance actual;
- #49 contiene tres migraciones de ingesta y **ninguna figura aplicada** en `supabase_migrations.schema_migrations`.

Reglas permanentes:

- antes de tocar esquema, comparar historial local y remoto;
- no modificar una migración ya aplicada en remoto;
- no aplicar las migraciones de #49 hasta reconstruir y volver a auditar el importador.

## Zonas sensibles

### Hermandades

- #245 ya está integrado y es parte del `main` canónico.
- #214 puede entrar como corte técnico aislado.
- #239 debe reconstruirse sobre la ficha pública y loader actuales.

### Directorios

#242 ya está integrado y pasa a ser la arquitectura canónica del Directorio. Nuevos cambios de directorios deben partir de esa base.

### Tira del hilo

- #234 puede integrarse primero como enriquecimiento visible de nodos.
- #168 debe reconstruirse después para que el descubrimiento guiado reutilice el grafo actual y no cree una segunda lógica paralela.

### Ingesta masiva

#49 queda aparcada como referencia de producto y experimentación. No es una base técnica integrable en su estado actual.

## Protocolo de nueva tarea

### Antes

- [ ] Leer este registro.
- [ ] Consultar `main` real y guardar el nuevo baseline de trabajo.
- [ ] Leer PR abiertas relacionadas.
- [ ] Comparar archivos si existe solape.
- [ ] Comprobar Vercel.
- [ ] Comprobar Supabase si hay datos/esquema.
- [ ] Clasificar riesgo: verde, ámbar o rojo.
- [ ] Asignar responsable y apoyos según `HILO-ORQUESTADOR.md`.

### Durante

- [ ] Mantener el cambio aislado.
- [ ] Evitar excepciones específicas por entidad.
- [ ] Preservar IDs, relaciones e históricos.
- [ ] No modificar migraciones remotas ya aplicadas.

### Antes de integrar

- [ ] Reconciliar con el `main` real del momento.
- [ ] Ejecutar pruebas relevantes.
- [ ] Ejecutar build.
- [ ] Revisar preview Vercel.
- [ ] Revisar móvil/escritorio si hay UI.
- [ ] Verificar datos y relaciones si hay cambios de modelo.

### Después

- [ ] Confirmar estado final de PR o `main`.
- [ ] Confirmar producción si se fusionó.
- [ ] Actualizar este registro si cambió el mapa operativo.

## Qué debe registrarse

Este archivo no es un diario de commits. Solo debe conservar información que cambie decisiones de coordinación:

- baseline reciente de `main` y producción;
- PR activas relevantes;
- conflictos de archivos;
- migraciones pendientes/aplicadas;
- bloqueos;
- decisiones de secuenciación.
