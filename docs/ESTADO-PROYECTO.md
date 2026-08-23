# Estado operativo de Hilo Cofrade

> Registro vivo para Hilo Orquestador. GitHub, Vercel y Supabase son la fuente de verdad. Este documento guarda el último **baseline observado** y los riesgos de coordinación conocidos; si existe discrepancia, prevalece el estado real de las herramientas.

## Baseline observado

- Comprobación: **2026-08-23 11:47 CEST**
- Repositorio: `nachosanchezperez-ux/base-cofrade`
- Rama principal: `main`
- Baseline de `main` al iniciar la comprobación: `cf32dd63237f3bebba65f5b03dfd217c84c6dcd3`
- Último cambio observado entonces: **Home 2.3: Extraordinarias navegables desde la portada**
- Proyecto Vercel: `base-cofrade`
- Producción observada: **READY** sobre `cf32dd63237f3bebba65f5b03dfd217c84c6dcd3`

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

## PR abiertas en el baseline

| PR | Área | Riesgo | Estado observado |
|---|---|---|---|
| #245 · Correcciones varias de fichas de hermandad | Presentación de Hermandades | 🟠 | Mergeable. Preview READY. Toca `lib/supabase/brotherhood-display.js`. |
| #242 · Directorio unificado | Directorios, navegación, loaders públicos | 🟠 | Mergeable. Preview READY. Sin migraciones. Toca `HiloHeader.js`. |
| #239 · Sede y visita | Hermandades, Panel, Lugares | 🟠 | Mergeable. Comparte `lib/supabase/brotherhood-display.js` con #245. |
| #234 · También en Hilo Cofrade | Grafo relacional / Tira del hilo | 🟠 | Mergeable. Cambia `RelationalThread` y enriquecimiento relacional público. |
| #232 · Calendario responsive de Extraordinarias | UI Extraordinarias | 🟢 | Mergeable. Cambio localizado en `ExtraordinaryDirectory.module.css`. |
| #214 · Autoridad pública de Hermandades | Supabase público / autoridad editorial | 🟠 | Mergeable. Corte aislado; no cambia RLS ni UI. |
| #211 · Cabecera de Bandas | UI Bandas / directorio | 🟠 | Mergeable. Toca `RelationalEntityHero.js` y la página de Bandas. |
| #168 · Tira del hilo 2.11 | Grafo / API / Pregunta | 🟠 | **No mergeable** en el baseline. Reconciliar con `main`. |
| #49 · Importador documental MVP | Panel, IA, Supabase, ingesta | 🔴 | **No mergeable y no listo para producción**. Migraciones 049/050 y smokes pendientes. |

## Conflictos y solapes conocidos

### #239 ↔ #245 · conflicto directo

Ambas PR modifican:

`lib/supabase/brotherhood-display.js`

Secuencia obligatoria:

1. elegir cuál entra primero en `main`;
2. integrar esa PR;
3. actualizar la otra desde el nuevo `main`;
4. resolver el archivo compartido conservando tanto las reglas de presentación de #245 como la nueva información de sede de #239;
5. volver a probar antes de fusionar.

### #242 · navegación global

#242 modifica `components/HiloHeader.js`. Cualquier cambio nuevo en menú global, `Explorar` o estructura del header debe revisar primero esa rama para no reimplementar la misma zona.

### #234 + #168 · Tira del hilo / grafo

Representan dos líneas complementarias del mismo sistema:

- #234: enriquecimiento visible de relaciones;
- #168: descubrimiento guiado del grafo.

Cualquier cambio en Graph Reasoning, `RelationalThread`, `/pregunta` o la API de `tira-del-hilo` debe revisar ambas.

### #49 · importador documental

Mantener bloqueado para producción hasta:

- aplicar migración 049;
- aplicar migración 050;
- reconciliar con `main`;
- smoke autenticado de `Presentación y Sangre`;
- smoke relacional de titulares de San Benito;
- verificar ausencia de duplicados y cargas parciales.

## Vercel

### Producción observada en el baseline

- Estado: **READY**
- Rama: `main`
- SHA observado: `cf32dd63237f3bebba65f5b03dfd217c84c6dcd3`
- Framework: Next.js
- Build: Turbopack

### Previews observados

- #245: **READY** sobre `978e0e71f7d5a281cfce12de608a3945bf8475c5`
- #242: **READY** sobre `bd493ad7c821fce2e28f64c87aa7ec9280c3fe41`

No asumir que una PR sigue verde porque lo estuvo anteriormente. Comprobar el deployment correspondiente al HEAD actual antes de integrar.

## Supabase y migraciones

Estado conocido en el baseline:

- #245, #242, #239, #234, #232, #214 y #211 declaran no necesitar migraciones en su alcance actual;
- #49 depende expresamente de migraciones **049** y **050**, pendientes según su PR;
- antes de tocar esquema, comparar historial local y remoto;
- no modificar una migración ya aplicada en remoto.

Este bloque debe refrescarse directamente contra Supabase antes de ejecutar cualquier cambio de esquema.

## Zonas sensibles

### Hermandades

Trabajo simultáneo en:

- presentación: #245;
- sede y visita: #239;
- autoridad pública: #214.

Un nuevo cambio sobre loaders o ficha pública de Hermandad debe comprobar estas tres líneas.

### Directorios

#242 es la referencia actual para la experiencia unificada. No crear una segunda arquitectura paralela de Hermandades, Imágenes, Pasos o Bandas sin compararla antes.

### Tira del hilo

Revisar conjuntamente #234 y #168 antes de modificar el sistema relacional visible o el descubrimiento del grafo.

### Ingesta masiva

#49 es la base experimental del importador documental, pero está bloqueada. Una nueva solución de subida masiva debe decidir expresamente si reutiliza, sustituye o se mantiene separada de ese MVP.

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

## Prioridad de coordinación del baseline

1. Mantener `main` estable y producción verde.
2. Secuenciar #239 y #245 por su archivo compartido.
3. Integrar cambios pequeños y aislados antes de ramas antiguas transversales cuando no creen deuda.
4. Reconciliar #168 antes de intentar integrarla.
5. Mantener #49 bloqueada hasta completar migraciones y smokes.

## Qué debe registrarse

Este archivo no es un diario de commits. Solo debe conservar información que cambie decisiones de coordinación:

- baseline reciente de `main` y producción;
- PR activas relevantes;
- conflictos de archivos;
- migraciones pendientes/aplicadas;
- bloqueos;
- decisiones de secuenciación.
