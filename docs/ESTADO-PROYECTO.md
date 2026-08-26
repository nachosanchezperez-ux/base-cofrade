# Estado operativo de Hilo Cofrade

> Fuente canónica para Hilo Orquestador. GitHub, Vercel y Supabase prevalecen siempre sobre este documento. Antes de cualquier acción significativa deben refrescarse las herramientas.

## Estado verificado

- Revisión: **26 de agosto de 2026 · Panel #353 en revisión visual · #360 ya integrado en producción**.
- Repositorio: `nachosanchezperez-ux/base-cofrade`.
- Rama principal: `main`.
- `main` actual al refrescar: `f2ae88887de7b3f4a3ae8d0b07d809514bdf1521` — **Glorias · normaliza el tono editorial de los textos (#360)**.
- Supabase: `Hilocofrade` (`kcevwkucqzcyrqaimyhl`) → **ACTIVE_HEALTHY**, región `eu-west-1`.
- La clasificación de Glorias se mantiene en `brotherhoods.brotherhood_types`; las procesiones concretas siguen usando `outings` con `outing_type = Procesión de Gloria`.
- Estado editorial observado de Glorias al 26/08/2026: **34 Hermandades con tipo Gloria · 9 con próxima Procesión de Gloria futura documentada · 25 sin próxima fecha futura documentada**. Son métricas dinámicas, no cifras de producto hardcodeadas.

## Vercel · configuración regional canónica

- Plan observado: **Pro**.
- Configuración versionada: una única región primaria mediante `regions: ["dub1"]`.
- No existe `functionFailoverRegions` ni otra región pasiva versionada.
- No volver a añadir regiones pasivas o failover de Functions sin comprobar primero las prestaciones del plan vigente.

**VERCEL · PUERTA DE QA → 🟢 OPERATIVA**

## Producción cerrada recientemente

- #349 · Primera edición · cierre técnico, rendimiento y navegación → **FUSIONADA Y DESPLEGADA**.
- #351 · Vercel · recuperar previews sin regiones pasivas Enterprise → **FUSIONADA Y DESPLEGADA**.
- #342 · Hermandades · portada editable + programa de mano y resumen unificado → **FUSIONADA Y DESPLEGADA**.
- #350 · Glorias · calendario y fichas de procesiones de Sevilla → **FUSIONADA Y DESPLEGADA**.
- #352 · Pastora · primera ficha cerrada → **FUSIONADA Y DESPLEGADA**.
- #354 · Pastora · corrige año visible de marcha → **FUSIONADA Y DESPLEGADA**.
- #358 · Hermandades · información práctica sin repetir cabecera → **FUSIONADA Y DESPLEGADA**.
- #360 · Glorias · tono editorial público → **FUSIONADA Y DESPLEGADA**.

## Frentes abiertos reales

### #353 · Panel · acceso directo desde Inicio

- **ABIERTA · revisión visual de Dirección**.
- Rama: `feat/panel-inicio-todos-modulos-20260825`.
- Reconciliada con `main` tras #360; debe mantenerse en **0 commits por detrás** antes de integrar.
- Centraliza la navegación del Panel y expone accesos directos coherentes en móvil y PC.
- Inicio prioriza Hermandades, Imágenes, Pasos y Bandas y conserva el resto de módulos en grupos compactos.
- Menú móvil exhaustivo, compacto y con objetivos táctiles.
- Contrato responsive de filtros protegido contra geometrías inline de escritorio.
- Añade **Panel → Glorias** como vista editorial sobre el modelo existente, sin nueva entidad ni tabla:
  - Hermandades con `brotherhood_types` que contiene `Gloria`;
  - próximas salidas `outings` cuyo tipo es `Procesión de Gloria`;
  - próximas fechas primero y pendientes después;
  - acceso directo a ficha de Hermandad y gestión de Salidas.
- Head funcional de Glorias validado: `b23791d46793bc30c0b7c598df2f55218afe69ea`.
- CI #980 → **SUCCESS**; `npm test` y `npm run build` → **PASS**.
- Preview funcional: `dpl_26dbXy8T5om1DMrY4J6TEp4ARyY6` → **READY**.
- Runtime preview `error`/`fatal` → **0** en la ventana comprobada.
- Sin cambios de esquema, migraciones, RLS ni Storage.
- Tras la reconciliación con #360 debe repetirse la barrera CI/build/preview sobre el head final antes de producción.

### #49 · Importador documental asistido

- **APARCADA**.
- No utilizar como base; no actualizar, rebasar, fusionar ni aplicar sus migraciones.

## Migraciones · estado operativo

- #353 no introduce ninguna migración.
- #360 no introdujo cambios de Supabase.
- Antes de cualquier nuevo DDL o migración, refrescar nuevamente historial local/remoto completo.

## Panel V2 · principios vigentes

- Front público stateless; Panel autenticado y editorial.
- `media_assets` es el archivo común y los usos se expresan mediante relaciones.
- `PORTADA ≠ GALERÍA ≠ ESCUDO ≠ OTROS RECURSOS`.
- Todo recurso visible en una ficha debe tender a poder editarse desde el mismo contexto.
- Los bytes se cargan directamente desde navegador a Supabase Storage mediante URL firmada cuando corresponde.
- Móvil: inputs de 16 px, objetivos táctiles adecuados, safe areas, navegación inferior y guardado contextual.
- Multimedia se conserva como biblioteca avanzada, no como paso obligatorio para tareas editoriales cotidianas.
- Un universo público importante puede tener una **vista operativa propia en Panel** sin duplicar el modelo. `Glorias` aplica este patrón sobre Hermandades + Salidas.

## Bloqueos y precauciones reales

1. No crear ni aplicar migraciones sin refrescar antes el historial local/remoto completo.
2. #49 continúa fuera de alcance.
3. No reintroducir `functionFailoverRegions` o regiones pasivas sin revisar el plan de Vercel.
4. La protección contra contraseñas filtradas de Supabase Auth continúa como acción manual de seguridad previa al lanzamiento.
5. Antes de fusionar #353, refrescar `main` una última vez y repetir CI/build/preview si ha avanzado.

## Orden operativo vigente

1. Cerrar revisión visual de #353 en móvil y PC.
2. Verificar #353 sobre el `main` real tras #360.
3. Integrar #353 solo con CI/build/preview verdes y 0 commits por detrás.
4. Mantener #49 aparcada.

**ESTADO-PROYECTO → 🟡 #353 EN REVISIÓN VISUAL · PANEL GLORIAS IMPLEMENTADO · #360 YA EN PRODUCCIÓN · PRODUCCIÓN ESTABLE · #49 APARCADA**
