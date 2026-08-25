# Estado operativo de Hilo Cofrade

> Fuente canónica para Hilo Orquestador. GitHub, Vercel y Supabase prevalecen siempre sobre este documento. Antes de cualquier acción significativa deben refrescarse las herramientas.

## Estado verificado

- Revisión: **25 de agosto de 2026 · puerta de QA recuperada, #342 y #350 cerradas, Pastora como primera ficha de Hermandad cerrada**.
- Repositorio: `nachosanchezperez-ux/base-cofrade`.
- Rama principal: `main`.
- `main` actual: `HEAD`; último commit funcional validado: `db4c9a4962fcdc7dbe3bb2f51ec2e9521d9a3ec5` — **Pastora · primera ficha cerrada (#352)**. El commit que contiene este documento puede ser posterior y solo documental.
- Producción funcional de #352: `dpl_BNcptGdzmGN6s7T2sCezwkDq64GB` → **READY**.
- Región real del deployment de producción: **`dub1`**.
- Runtime de producción del deployment actual: **sin registros `error` ni `fatal`** tras el smoke público.
- Supabase: `Hilocofrade` (`kcevwkucqzcyrqaimyhl`) → **ACTIVE_HEALTHY**, región `eu-west-1`.
- Historial local y remoto de migraciones: **171 / 171 versiones alineadas**, desde `20260812090001` hasta `20260825141316`, sin versiones ausentes ni timestamps duplicados.
- `20260824104227` y `20260825094306` continúan reconciliadas en Git y no se han reejecutado.

## Vercel · configuración regional canónica

- Plan observado: **Pro**.
- Configuración versionada: una única región primaria mediante `regions: ["dub1"]`.
- No existe `functionFailoverRegions` ni otra región pasiva versionada.
- La configuración anterior `functionFailoverRegions: ["fra1"]` activaba las regiones pasivas de Serverless Functions, función restringida al plan Enterprise, y bloqueaba los previews automáticos.
- #351 retiró únicamente la parte incompatible; no modificó lógica de aplicación ni infraestructura.
- Preview de validación #351: `dpl_GxpUsBd1z18zxhjXYkme4ruSE4Fz` → **READY**, región real `dub1`.
- Producción tras #351: `dpl_FrLuZYDnorpPk6unzLCKgscsWThu` → **READY**, región real `dub1`.
- Preview de #342: `dpl_6s9axDQDYRPMBFHSDjgtdKvNoYiZ` → **READY**, región real `dub1`.
- No volver a añadir regiones pasivas o failover de Functions sin comprobar primero las prestaciones del plan vigente.
- Los deployments anteriores observados en `iad1` pertenecen al estado previo; no describen la configuración activa actual.

**VERCEL · PUERTA DE QA → 🟢 RECUPERADA**

## Producción cerrada recientemente

- #349 · Primera edición · cierre técnico, rendimiento y navegación → **FUSIONADA Y DESPLEGADA**.
- #351 · Vercel · recuperar previews sin regiones pasivas Enterprise → **FUSIONADA Y DESPLEGADA**.
- #342 · Hermandades · portada editable + programa de mano y resumen unificado → **FUSIONADA Y DESPLEGADA**.
- #350 · Glorias · calendario y fichas de procesiones de Sevilla → **FUSIONADA Y DESPLEGADA**.
- #352 · Pastora · primera ficha cerrada → **FUSIONADA Y DESPLEGADA**.

### Resultado de #342

- CI #929 → **SUCCESS**; suite local → **318 / 318**; build Next.js 16.3 → **PASS**.
- Reconciliada con el `main` real sin conflictos y con un diff efectivo de 14 archivos.
- Smoke autenticado realizado en Pastora de Cantillana, San Benito y El Baratillo.
- Selección, guardado, recarga, reemplazo, edición, retirada, modos `auto`/`cover`/`contain` y foco independiente para móvil validados.
- Portada, escudo, galería y recurso original permanecen como usos distintos; derechos y créditos se conservan.
- El reemplazo conserva la portada anterior hasta validar el nuevo uso y aplica rollback defensivo si falla la limpieza.
- Las relaciones `hero` temporales del smoke se retiraron; las tres Hermandades quedaron restauradas a su estado inicial.
- Auditor: **sin bloqueo estructural ni relevante**, sin hardcodes por slug, segunda arquitectura de media o subida pesada vía Vercel Function.
- Producción posterior: `dpl_5zuNBzYN2ePdhEUnmn2ZqhGB4LkB` → **READY**; smoke público y runtime correctos.

### Resultado de #350

- Head auditado: `c36bfbdf6d0b0ff6946534bc5bbf87f2a3a137f0`; merge en `main`: `3e9e9d6122ce3c54735b84f3ce5625aac88c8063`.
- CI #933 → **SUCCESS**; suite local → **324 / 324**; build Next.js 16.3 → **PASS**.
- Preview automática: `dpl_Ae197XTYibbYMcGmkkLBHSyNxAsR` → **READY**, región real `dub1`; 76 respuestas 200 y ningún `error`/`fatal`.
- Auditoría DATA/Product conforme: reutiliza `outings` y el grafo existente; no crea una arquitectura paralela ni mezcla Procesión de Gloria con romería, traslado, extraordinaria o culto externo.
- El filtro conserva el concepto exacto `Procesión de Gloria` sin distinguir mayúsculas/minúsculas, evitando omisiones por variantes editoriales del Panel.
- Sin migraciones, cambios de RLS, Storage, excepciones por slug ni hardcodes de Hermandades.
- Home, Directorio, Extraordinarias, Hermandad, Imagen, Paso, Banda, listado y fichas de Glorias validados en preview.
- Contratos responsive/mobile-first conformes y sin desbordamiento horizontal; el smoke visual final se completó en navegador de escritorio.
- Producción: `dpl_AxnJnLQvciVwfmVHngpVzGaaFknA` → **READY**, región real `dub1`; 106 respuestas 200, sin 4xx, 5xx, `error` ni `fatal` tras el smoke.

### Resultado de #352

- La Pastora de Cantillana queda como primera ficha de Hermandad cerrada editorial y técnicamente.
- Se retiró la guía de retransmisión porque antecedía a la identidad y duplicaba salida, paso, capataces, bandas e hitos históricos ya presentes en sus secciones canónicas.
- La retirada es genérica: no introduce excepciones por slug ni una variante exclusiva para Pastora.
- Los marcadores internos de autoría, fecha u horario sin documentar dejan de mostrarse en público; no se inventa ni elimina información documentada.
- Conserva 1 titular, 1 paso, 1 procesión fechada, 6 ciclos recurrentes, 2 cultos, 5 Simpecados, 4 carteles, 1 pieza patrimonial, 2 bandas actuales, 21 dedicatorias musicales y 13 fuentes directas.
- CI → **SUCCESS**; suite local → **324 / 324**; build Next.js 16.3 y TypeScript → **PASS**.
- Preview automática: `dpl_3kFL6QTLGfWKRk4NqANrH1bSaYqY` → **READY**, región real `dub1`; 73 respuestas 200 y ningún `error`/`fatal`.
- Producción: `dpl_BNcptGdzmGN6s7T2sCezwkDq64GB` → **READY**, región real `dub1`; ficha, jerarquía, grafo y runtime validados sin error/fatal.
- Sin migraciones ni cambios de datos, RLS, Storage o Panel.

## Frentes abiertos reales

### #49 · Importador documental asistido

- **APARCADA**.
- No utilizar como base; no actualizar, rebasar, fusionar ni aplicar sus migraciones.

## Migraciones · estado canónico

```text
Supabase remoto                     🟢 ACTIVE_HEALTHY
Versiones locales/remotas           171 / 171
Timestamps remotos duplicados       0 detectados
Última versión remota               20260825141316
20260824104227 en Git               🟢 SÍ
20260825094306 en Git               🟢 SÍ
Historial completo alineado         🟢 SÍ
Cambios Supabase en #351/#342/#350/#352  NINGUNO
```

## Panel V2 · principios vigentes

- Front público stateless; Panel autenticado y editorial.
- `media_assets` es el archivo común y los usos se expresan mediante relaciones.
- `PORTADA ≠ GALERÍA ≠ ESCUDO ≠ OTROS RECURSOS`.
- Todo recurso visible en una ficha debe tender a poder editarse desde el mismo contexto.
- Los bytes se cargan directamente desde navegador a Supabase Storage mediante URL firmada cuando corresponde.
- Móvil: inputs de 16 px, objetivos táctiles adecuados, safe areas, navegación inferior y guardado contextual.
- Multimedia se conserva como biblioteca avanzada, no como paso obligatorio para tareas editoriales cotidianas.

## Bloqueos y precauciones reales

1. No crear ni aplicar migraciones sin refrescar antes el historial local/remoto completo.
2. #49 continúa fuera de alcance.
3. No reintroducir `functionFailoverRegions` o regiones pasivas sin revisar el plan de Vercel.
4. La protección contra contraseñas filtradas de Supabase Auth continúa como acción manual de seguridad previa al lanzamiento; no ha formado parte de esta tarea.

## Orden operativo vigente

1. Detener la apertura automática de frentes: #342 y #350 están cerradas y #49 continúa aparcada.
2. Mantener producción y previews en la configuración regional soportada de una sola región `dub1`.
3. Resolver manualmente la protección contra contraseñas filtradas de Supabase Auth cuando Dirección priorice ese ajuste.
4. Esperar una nueva decisión de Dirección antes de abrir otra fase funcional o estructural.

**ESTADO-PROYECTO → 🟢 QA VERCEL RECUPERADA · PRODUCCIÓN ESTABLE · GIT ↔ SUPABASE ALINEADOS · PASTORA PRIMERA FICHA CERRADA · #342 CERRADA · #350 CERRADA · #49 APARCADA · NUEVO FRENTE NO ABIERTO**
