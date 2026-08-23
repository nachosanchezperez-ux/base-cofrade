# Estado operativo de Hilo Cofrade

> Registro vivo para Hilo Orquestador. El estado real de GitHub, Vercel y Supabase prevalece siempre sobre este documento si existe discrepancia.

## Última comprobación

- Fecha: **2026-08-23 11:47 CEST**
- Repositorio: `nachosanchezperez-ux/base-cofrade`
- Rama principal: `main`
- SHA de `main`: `cf32dd63237f3bebba65f5b03dfd217c84c6dcd3`
- Último cambio de `main`: **Home 2.3: Extraordinarias navegables desde la portada**
- Proyecto Vercel: `base-cofrade`
- Producción Vercel: **READY** sobre `cf32dd63237f3bebba65f5b03dfd217c84c6dcd3`

## Regla de uso

Antes de empezar una tarea significativa:

1. refrescar `main`;
2. consultar PR abiertas;
3. identificar archivos compartidos;
4. comprobar Vercel;
5. comprobar migraciones si la tarea toca datos;
6. decidir si la tarea puede ejecutarse aislada o necesita reconciliación previa.

Al terminar una tarea que cambie ramas, PR, migraciones o producción, actualizar este registro.

## PR abiertas

| PR | Rama | Área | Riesgo | Estado operativo |
|---|---|---|---|---|
| #245 · Correcciones varias de fichas de hermandad | `agent/correcciones-varias-20260823` | Presentación de Hermandades | 🟠 | Mergeable. Preview reciente READY. Toca `lib/supabase/brotherhood-display.js`. |
| #242 · Directorio unificado | `feat/directorio-unificado-20260823` | Directorios, navegación, loaders públicos | 🟠 | Mergeable. Preview reciente READY. Sin migraciones. Toca `HiloHeader.js` y capa de directorio público. |
| #239 · Sede y visita | `feat/hermandades-sede-visita-20260823` | Hermandades, Panel, Lugares | 🟠 | Mergeable. Comparte `lib/supabase/brotherhood-display.js` con #245. Reconciliar antes de integrar ambas. |
| #234 · También en Hilo Cofrade | `feat/tambien-en-hilo-20260822` | Grafo relacional / Tira del hilo | 🟠 | Mergeable. Cambia el componente compartido `RelationalThread` y su enriquecimiento público. |
| #232 · Calendario responsive de Extraordinarias | `agent/extraordinarias-listado-movil-20260822` | UI Extraordinarias | 🟢 | Mergeable. Cambio localizado en `ExtraordinaryDirectory.module.css`. |
| #214 · Autoridad pública de Hermandades | `feat/public-client-brotherhood-page-phase-a` | Supabase público / autoridad editorial | 🟠 | Mergeable. Corte deliberadamente aislado. No cambia RLS ni UI. |
| #211 · Cabecera de Bandas | `ui/bandas-hero-logo-protagonista` | UI Bandas / directorio | 🟠 | Mergeable. Toca `RelationalEntityHero.js` y la página de Bandas. |
| #168 · Tira del hilo 2.11 | `agent/tira-del-hilo-2-11-descubrimiento` | Grafo / API / Pregunta | 🟠 | **No mergeable** en el estado consultado. Reconciliar con `main` antes de continuar. |
| #49 · Importador documental MVP | `agent/importador-documental-mvp` | Panel, IA, Supabase, ingesta | 🔴 | **No mergeable y no listo para producción**. Tiene migraciones 049 y 050 pendientes de aplicar y smokes pendientes. No fusionar. |

## Conflictos y solapes conocidos

### Conflicto directo: #239 ↔ #245

Ambas PR modifican:

`lib/supabase/brotherhood-display.js`

Regla:

- no fusionarlas de forma independiente sin reconciliar;
- elegir primero la que deba entrar en `main`;
- actualizar la otra desde el `main` resultante;
- revisar que las reglas de presentación de patrimonio/salidas de #245 sobreviven junto con la nueva información de sede de #239.

### Navegación global: #242

#242 modifica `components/HiloHeader.js`.

Cualquier trabajo nuevo sobre navegación global, menú `Explorar` o estructura del header debe partir de esta rama o esperar a que se integre, para evitar reimplementar la misma zona.

### Componentes relacionales: #234 y #211

No comparten actualmente el mismo archivo según la revisión realizada, pero ambas afectan al sistema relacional visible. Antes de una refactorización global de heroes, tarjetas o `Tira del hilo`, revisar ambas.

### Importador documental: #49

Bloqueado para producción hasta cumplir todos estos puntos:

- aplicar migración 049;
- aplicar migración 050;
- reconciliar la rama con `main`;
- smoke autenticado de `Presentación y Sangre`;
- smoke relacional de titulares de San Benito;
- comprobar ausencia de duplicados y relaciones parciales.

## Vercel

### Producción

- Estado: **READY**
- Rama: `main`
- SHA: `cf32dd63237f3bebba65f5b03dfd217c84c6dcd3`
- Build con Turbopack.

### Previews recientes observados

- #245: **READY** sobre `978e0e71f7d5a281cfce12de608a3945bf8475c5`
- #242: **READY** sobre `bd493ad7c821fce2e28f64c87aa7ec9280c3fe41`

No asumir que una PR antigua sigue verde solo porque lo estuvo anteriormente. Comprobar el último deployment de su HEAD antes de fusionar.

## Supabase y migraciones

Estado conocido en este registro:

- no se ha detectado necesidad de migración para #245, #242, #239, #234, #232, #214 o #211 según sus alcances declarados;
- #49 depende expresamente de migraciones **049** y **050**, todavía pendientes según la propia PR;
- antes de cualquier tarea que añada o modifique migraciones, comparar historial local y remoto y no editar una migración ya aplicada.

Este bloque debe refrescarse con Supabase antes de ejecutar cambios de esquema.

## Zonas sensibles actuales

### Hermandades

Hay trabajo simultáneo en:

- presentación (`#245`);
- sede y visita (`#239`);
- autoridad pública (`#214`).

Cualquier cambio nuevo sobre loaders o ficha pública de Hermandad debe comprobar estas tres líneas antes de tocar archivos compartidos.

### Directorios

#242 es actualmente la rama de referencia para la nueva experiencia unificada de directorios. No crear una segunda arquitectura paralela para Hermandades, Imágenes, Pasos o Bandas sin compararla antes.

### Tira del hilo / grafo

Hay dos líneas abiertas:

- #234: enriquecimiento visible de relaciones;
- #168: descubrimiento guiado del grafo.

Una modificación de Graph Reasoning, `RelationalThread`, `/pregunta` o la API de `tira-del-hilo` debe revisarlas conjuntamente.

### Ingesta masiva

#49 es la base experimental del importador documental, pero permanece bloqueada. Cualquier nueva solución de subida masiva debe decidir explícitamente si reutiliza, sustituye o se mantiene separada de ese MVP.

## Protocolo para nuevas tareas

### Antes

- [ ] Consultar este archivo.
- [ ] Leer estado real de `main`.
- [ ] Leer PR abiertas relacionadas.
- [ ] Comparar archivos si hay solape.
- [ ] Clasificar riesgo: verde, ámbar o rojo.
- [ ] Decidir especialista principal y apoyos.

### Durante

- [ ] Mantener el cambio lo más aislado posible.
- [ ] Evitar excepciones específicas por entidad.
- [ ] Preservar IDs, relaciones e históricos.
- [ ] No modificar migraciones remotas ya aplicadas.

### Antes de integrar

- [ ] Reconciliar con `main` actual.
- [ ] Ejecutar pruebas relevantes.
- [ ] Ejecutar build.
- [ ] Revisar preview Vercel.
- [ ] Revisar móvil y escritorio si hay UI.
- [ ] Verificar datos/relaciones si hay cambios de modelo.

### Después

- [ ] Confirmar estado final de PR o `main`.
- [ ] Confirmar producción si se ha fusionado.
- [ ] Actualizar este documento cuando cambie el mapa operativo.

## Criterio de prioridad actual

1. Mantener `main` estable y Vercel verde.
2. Resolver o secuenciar los solapes entre PR de Hermandades (#239 y #245).
3. Integrar cambios pequeños y aislados antes de ramas antiguas transversales, siempre que no creen deuda.
4. Reconciliar #168 antes de cualquier intento de integración.
5. Mantener #49 bloqueada hasta completar migraciones y smokes.

## Cómo actualizar este registro

No debe convertirse en un diario de commits. Solo registrar información que cambie decisiones de coordinación:

- nuevo SHA de `main` cuando sea relevante;
- PR abiertas/cerradas que afecten a trabajo en curso;
- conflictos de archivos;
- migraciones pendientes/aplicadas;
- estado de producción;
- bloqueos;
- decisiones de secuenciación.
