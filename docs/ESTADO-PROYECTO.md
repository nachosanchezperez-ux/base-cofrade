# Estado operativo de Hilo Cofrade

> Fuente canónica para Hilo Orquestador. GitHub, Vercel y Supabase prevalecen siempre sobre este documento. Antes de cualquier acción significativa deben refrescarse las herramientas.

## Estado verificado

- Revisión: **25 de agosto de 2026 · cierre técnico de primera edición**.
- Repositorio: `nachosanchezperez-ux/base-cofrade`.
- Rama principal: `main`.
- `main` actual: `8d48a47a3ed6e43b7f1d096964c2fe25f3869ea5` — **Escudos: más tamaño y sin marco en el directorio (#346)**.
- Producción: `dpl_EPbARXLyPRdB9sxZfXcDNWm5413D` → **READY**.
- Runtime de producción: se detectaron timeouts en `/extraordinarias/[slug]` al consultar `source_links`; la causa quedó corregida en base con un índice específico y debe verificarse de nuevo tras desplegar el cierre de primera edición.
- Supabase: `Hilocofrade` (`kcevwkucqzcyrqaimyhl`) → **ACTIVE_HEALTHY**.
- Historial local y remoto de migraciones: **171 versiones alineadas**, desde `20260812090001` hasta `20260825141316`, sin versiones ausentes ni duplicados de timestamp detectados.
- Migraciones remotas previamente divergentes:
  - `20260824104227_extraordinaria_dolores_cerro_fotografia_fuente_oficial` → **RECONCILIADA EN GIT** mediante #347; SQL recuperado literalmente de `supabase_migrations.schema_migrations` y no reejecutado.
  - `20260825094306_normaliza_textos_publicos_musica_extraordinarias` → **VERSIONADA EN GIT Y RECONCILIADA** mediante #345; el archivo coincide con la migración ya aplicada en remoto y no se reejecutó.
- Última migración remota comprobada: `20260825141316_index_extraordinary_source_links`.

## Producción cerrada recientemente

- #337 · Portada editorial + Hero V2 de Imágenes → **FUSIONADA Y DESPLEGADA**.
- #339 · Panel V2 · fotografía contextual y operación móvil → **FUSIONADA Y DESPLEGADA**.
- #340 / #341 · SEO de Extraordinarias → **FUSIONADAS Y DESPLEGADAS**.
- #343 · Enlaces Hermandades/Bandas → Extraordinarias → **FUSIONADA Y DESPLEGADA**.
- #344 · Edición contextual del escudo de Hermandad → **FUSIONADA Y DESPLEGADA**.
- #345 · Visor reutilizable de recorridos + normalización editorial → **FUSIONADA Y DESPLEGADA**.
- #347 · Reconciliación de migración remota `20260824104227` → **FUSIONADA**.
- #346 · Escudos más grandes y sin marco en directorio → **FUSIONADA Y DESPLEGADA**.

## Frentes abiertos reales

### #342 · Hermandades · portada editable + programa de mano y resumen unificado

- **ABIERTA / DRAFT**.
- Es el único frente estructural activo para cerrar la primera edición.
- Incluye `Panel → Hermandades → Portada`, reutilización de `media_assets`, relación `hero`, encuadre PC/móvil y modos Automático/Cubrir/Completa.
- No introduce migraciones, esquema ni RLS.
- Está reconciliada con `main`, mergeable, con CI verde y preview READY en la última comprobación.
- Requiere smoke autenticado real en Pastora de Cantillana, San Benito y El Baratillo.
- Auditor debe bloquear cualquier excepción por `slug` o hardcode en la solución definitiva de Hermandades.

### #49 · Importador documental asistido

- **APARCADA**.
- No utilizar como base.
- No rebasar, fusionar ni aplicar sus migraciones 049/050 dentro del carril actual.

## Migraciones · estado canónico

```text
Supabase remoto                     🟢 ACTIVE_HEALTHY
Versiones locales/remotas           171 / 171
Timestamps remotos duplicados       0 detectados
Última versión remota               20260825141316
20260824104227 en Git               🟢 SÍ
20260825094306 en Git               🟢 SÍ
Historial completo alineado         🟢 SÍ
Índice fuentes extraordinarias      🟢 APLICADO
```

La reconciliación se realizó registrando como aplicadas las migraciones cuyos efectos ya estaban verificados en producción, sin reejecutar sus SQL. Después se aplicaron dos endurecimientos de permisos, una alineación del contrato SVG de Storage y un índice de rendimiento, todos versionados en Git.

## Cierre técnico de primera edición en curso

- Funciones de Vercel preparadas para ejecutarse en `dub1`, junto a Supabase `eu-west-1`, con `fra1` como failover.
- Consulta de fuentes de Extraordinarias reducida a un único viaje y respaldada por `source_links_outing_idx`.
- Permisos internos de funciones trigger retirados de `anon` y `authenticated`; importador documental aparcado también en ACL.
- Bucket `hilo-media` alineado con el editor de escudos SVG saneados.
- Home con dos accesos inequívocos de primera visita: Directorio y próximas Extraordinarias.
- `robots.txt` reserva APIs, Panel y rutas técnicas de prueba.
- Suite local: **306 tests verdes**. Build de Next.js 16.3: **verde**; los únicos avisos locales corresponden a la ausencia deliberada de variables de Supabase en el entorno de build.
- Checklist canónica: `docs/PRIMERA-EDICION-LANZAMIENTO.md`.

Advisors de seguridad restantes:

- cinco avisos sobre helpers `SECURITY DEFINER` del Panel son intencionales: comprueban `auth.uid()` y son consumidos por las políticas RLS; revocar su ejecución a `authenticated` rompería el control editorial;
- `completeness_rules` permanece cerrada por RLS y sin política pública de forma deliberada;
- la protección contra contraseñas filtradas sigue desactivada y es la única acción manual de seguridad previa al lanzamiento.

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

1. Desplegar y validar el corte técnico de primera edición en preview.
2. Medir Home, Directorio, Extraordinarias y Pastora desde la nueva región; confirmar cero timeouts.
3. Completar el smoke autenticado de #342: Pastora de Cantillana, San Benito y El Baratillo.
4. Fusionar #342 únicamente si no hay bloqueo.
5. Activar protección contra contraseñas filtradas en Supabase Auth.
6. Ejecutar la matriz pública final de móvil/escritorio y accesibilidad esencial.
7. Fusionar, verificar producción y congelar el alcance de la edición 1.0.
8. Mover cualquier mejora no bloqueante al backlog posterior al lanzamiento.

**ESTADO-PROYECTO → 🟢 GIT ↔ SUPABASE ALINEADOS · CIERRE TÉCNICO DE PRIMERA EDICIÓN EN VALIDACIÓN · #342 ÚNICO FRENTE ESTRUCTURAL**
