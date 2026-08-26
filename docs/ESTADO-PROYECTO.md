# Estado operativo de Hilo Cofrade

> Fuente canónica para Hilo Orquestador. GitHub, Vercel y Supabase prevalecen siempre sobre este documento. Antes de cualquier acción significativa deben refrescarse las herramientas.

## Estado verificado

- Revisión: **26 de agosto de 2026 · #49 cerrada sin fusionar · importación sin IA**.
- Repositorio: `nachosanchezperez-ux/base-cofrade`.
- Rama principal: `main`.
- Último `main` funcional al refrescar: `5467f212cb21e8c9656ffb92f88ebcf61805b6e9` — **Estado final verificado de la primera edición (#364)**. El commit documental que actualice este archivo puede sucederlo sin cambios funcionales.
- Producción: `dpl_7KEajRP2K1P61ak5aU8bfT2skaCs` → **READY**, región real `dub1`.
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
- #353 · Panel · acceso directo desde Inicio y vista operativa de Glorias → **FUSIONADA Y DESPLEGADA**.
- #361 · Bandas · restaura la fotografía de «De un vistazo» → **FUSIONADA Y DESPLEGADA**.
- #362 · Historial del importador Git ↔ Supabase → **FUSIONADA Y DESPLEGADA**.
- #363 · Primera edición · cierra colaboración pública y estado operativo → **FUSIONADA Y DESPLEGADA**.

## Frentes abiertos reales

- **Ninguna PR abierta** al cerrar esta revisión.

### #49 · Importador documental asistido

- **CERRADA SIN FUSIONAR por decisión de producto**.
- Hilo Cofrade no utilizará la API de OpenAI para importar documentación; no requiere cuota, clave ni facturación del proveedor.
- La rama queda descartada y no debe reutilizarse como base técnica.
- Las cuatro migraciones ya reconciliadas permanecen como infraestructura inactiva; no exponen la interfaz ni publican datos por sí solas y no se revierten para no romper el historial Git ↔ Supabase.
- La prueba realizada no dejó residuos: **0 importaciones y 0 fuentes de prueba**.
- La vía canónica sin IA ya existe en HC-016: JSON, JSONL y CSV con staging, validación, resolución determinista, revisión humana, aplicación por lotes y auditoría.

## Migraciones · estado operativo

- Git y Supabase contienen **176/176 migraciones**.
- #362 versionó en `main` las cuatro migraciones del importador ya registradas en Supabase; no volvió a ejecutar DDL.
- Antes de cualquier nuevo DDL o migración, refrescar nuevamente el historial local/remoto completo.

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
2. No reabrir ni reconstruir #49 con OpenAI u otra API generativa; cualquier ampliación de importación debe extender HC-016 sin eludir staging, validación y revisión humana.
3. No reintroducir `functionFailoverRegions` o regiones pasivas sin revisar el plan de Vercel.
4. La protección contra contraseñas filtradas de Supabase Auth continúa como acción manual de seguridad previa al lanzamiento.
5. No habilitar formularios públicos sin identidad responsable, contacto, privacidad y tratamiento editorial definidos.

## SEO y descubrimiento

- Dominio `hilocofrade.es` verificado en Google Search Console.
- `https://hilocofrade.es/sitemap.xml` enviado, descargado por Google y sin errores ni advertencias.
- La Home figura como **Submitted and indexed**, con `robots.txt` permitido, indexación admitida y último rastreo móvil correcto.
- Producción publica canonical, robots, Open Graph y Twitter Cards; el sitemap conserva Directorio y Glorias y excluye Colabora mientras permanece cerrada.

## Orden operativo vigente

1. Completar la matriz QA pública en 390, 768, 1024 y 1440 px.
2. Activar la protección contra contraseñas filtradas en Supabase Auth.
3. Publicar la información legal/privacidad solo con identidad y contacto confirmados.
4. Mantener la importación estructurada sobre HC-016; no abrir un nuevo importador durante el cierre de lanzamiento.

**ESTADO-PROYECTO → 🟡 PRIMERA EDICIÓN EN CIERRE · PRODUCCIÓN ESTABLE · PREVIEWS OPERATIVAS · GIT ↔ SUPABASE 176/176 · COLABORA CERRADA · SEO CANÓNICO VERIFICADO · #49 CERRADA SIN FUSIONAR · IMPORTACIÓN SIN IA**
