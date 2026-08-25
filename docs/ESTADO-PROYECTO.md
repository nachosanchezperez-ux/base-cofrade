# Estado operativo de Hilo Cofrade

> Fuente canónica para Hilo Orquestador. GitHub, Vercel y Supabase prevalecen siempre sobre este documento. Antes de cualquier acción significativa deben refrescarse las herramientas.

## Estado verificado

- Revisión: **25 de agosto de 2026 · 13:17–13:25 CEST**.
- Repositorio: `nachosanchezperez-ux/base-cofrade`.
- Rama principal: `main`.
- `main` actual: `345a5d30a1bfeec00390c08bc2213843eb0af1fb` — **Visor reutilizable de recorridos y normalización editorial (#345)**.
- Producción: `dpl_Dmkwk3s167HPCL62Lo7d7KPFjdT7` → **READY**.
- Runtime de producción comprobado tras #345: **0 logs `error` / `fatal`** en la ventana revisada.
- Supabase: `Hilocofrade` (`kcevwkucqzcyrqaimyhl`) → **ACTIVE_HEALTHY**.
- Historial remoto de migraciones: **151 versiones distintas**, desde `20260812090001` hasta `20260825094306`, sin duplicados de timestamp detectados.
- Migraciones remotas previamente divergentes:
  - `20260824104227_extraordinaria_dolores_cerro_fotografia_fuente_oficial` → **RECONCILIADA EN GIT** mediante #347; SQL recuperado literalmente de `supabase_migrations.schema_migrations` y no reejecutado.
  - `20260825094306_normaliza_textos_publicos_musica_extraordinarias` → **VERSIONADA EN GIT Y RECONCILIADA** mediante #345; el archivo coincide con la migración ya aplicada en remoto y no se reejecutó.
- No existe una migración remota posterior a `20260825094306` en la última comprobación.

## Producción cerrada recientemente

- #337 · Portada editorial + Hero V2 de Imágenes → **FUSIONADA Y DESPLEGADA**.
- #339 · Panel V2 · fotografía contextual y operación móvil → **FUSIONADA Y DESPLEGADA**.
- #340 / #341 · SEO de Extraordinarias → **FUSIONADAS Y DESPLEGADAS**.
- #343 · Enlaces Hermandades/Bandas → Extraordinarias → **FUSIONADA Y DESPLEGADA**.
- #344 · Edición contextual del escudo de Hermandad → **FUSIONADA Y DESPLEGADA**.
- #345 · Visor reutilizable de recorridos + normalización editorial → **FUSIONADA Y DESPLEGADA**.
- #347 · Reconciliación de migración remota `20260824104227` → **FUSIONADA**.

## Frentes abiertos reales

### #342 · Hermandades · portada editable + programa de mano y resumen unificado

- **ABIERTA / DRAFT**.
- Es el siguiente frente estructural a cerrar una vez resuelto #346.
- Incluye `Panel → Hermandades → Portada`, reutilización de `media_assets`, relación `hero`, encuadre PC/móvil y modos Automático/Cubrir/Completa.
- No introduce migraciones, esquema ni RLS.
- Debe reconciliarse de nuevo con el `main` vigente antes de validar o fusionar.
- Requiere smoke autenticado real en Pastora de Cantillana, San Benito y El Baratillo.
- Auditor debe bloquear cualquier excepción por `slug` o hardcode en la solución definitiva de Hermandades.

### #346 · Escudos · más tamaño y sin marco en el directorio

- **ABIERTA**.
- Ajuste visual aislado pendiente de clasificación final.
- Debe comprobarse contra el `main` vigente: mergeability, CI, preview, responsive, ausencia de excepciones por Hermandad y ausencia de solape con #342.
- Si sigue siendo pequeño, aislado y plenamente validado puede cerrarse antes de #342; en caso contrario debe quedar aparcado.

### #49 · Importador documental asistido

- **APARCADA**.
- No utilizar como base.
- No rebasar, fusionar ni aplicar sus migraciones 049/050 dentro del carril actual.

## Migraciones · estado canónico

```text
Supabase remoto                     🟢 ACTIVE_HEALTHY
Versiones remotas                   151
Timestamps remotos duplicados       0 detectados
Última versión remota               20260825094306
20260824104227 en Git               🟢 SÍ
20260825094306 en Git               🟢 SÍ
Nueva migración durante alineación  ⛔ NO
Nueva ejecución SQL remota          ⛔ NO
```

La reconciliación se ha realizado versionando la realidad ya aplicada, no modificando datos correctos de producción para forzar una coincidencia.

## Panel V2 · principios vigentes

- Front público stateless.
- Panel autenticado/editorial.
- `media_assets` es el archivo común; los usos se expresan mediante relaciones.
- Todo recurso visible en una ficha debe tender a poder editarse desde el mismo contexto.
- Carga de bytes directa desde navegador a Supabase Storage mediante URL firmada cuando corresponde.
- Móvil: inputs de 16 px, objetivos táctiles adecuados, safe areas, navegación inferior y guardado contextual.
- Escudo de Hermandad editable desde la ficha, sin introducir rutas técnicas manualmente.
- Multimedia se conserva como biblioteca avanzada, no como paso obligatorio para tareas editoriales cotidianas.

## Precauciones

1. **No crear ni aplicar nuevas migraciones** sin refrescar primero el historial remoto/local completo.
2. #49 continúa fuera de alcance.
3. No desarrollar en paralelo dos soluciones para la cabecera/portada de Hermandades: #342 es el carril estructural designado.
4. Antes de fusionar cualquier PR abierta, refrescar `main` y comprobar solapes reales.

## Orden operativo vigente

1. Clasificar y cerrar o aparcar conscientemente #346.
2. Convertir #342 en único frente estructural activo.
3. Reconciliar #342 con `main`.
4. Tests, CI, build y preview.
5. Smoke autenticado real: Pastora de Cantillana, San Benito y El Baratillo.
6. Auditoría de arquitectura/media/SEO/móvil.
7. Fusionar #342 únicamente si no hay bloqueo.
8. Verificar producción y runtime.
9. Actualizar nuevamente este documento.
10. Analizar la mayor fricción cotidiana del Panel móvil y proponer **un solo siguiente corte**, sin implementarlo automáticamente.

**ESTADO-PROYECTO → 🟢 ALINEACIÓN GIT ↔ SUPABASE ↔ VERCEL RECUPERADA · #346 PENDIENTE DE CLASIFICACIÓN · #342 SIGUIENTE FRENTE ESTRUCTURAL**
