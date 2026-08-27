# Estado operativo de Hilo Cofrade

> Fuente canónica para Hilo Orquestador. GitHub, Vercel y Supabase prevalecen siempre sobre este documento. Antes de cualquier acción significativa deben refrescarse las herramientas.

## Estado verificado

- Revisión: **27 de agosto de 2026 · recuperación autorizada de #385 tras la congelación de Primera edición**.
- Repositorio: `nachosanchezperez-ux/base-cofrade`.
- Rama principal: `main`.
- Último `main` funcional validado: `913dd614b427c43ceaa0bc48a83a86d619a63bf6` — **Panel · Curiosidades, multimedia directa y Salidas unificadas (#385)**.
- #385: **🟢 RECUPERADA POR DECISIÓN EXPRESA DE DIRECCIÓN, FUSIONADA Y EN PRODUCCIÓN**.
- #383: **CERRADA SIN FUSIONAR**; permanece fuera de este alcance.
- #49: **CERRADA SIN FUSIONAR**; no debe reabrirse.
- Producción funcional validada: `dpl_6ZgEQuhTiRxcVs9KFhmeEzhbENbk` → **READY**, región `dub1`, commit exacto `913dd614`.
- Alias de producción verificados en el deployment: `hilocofrade.es`, `www.hilocofrade.es`, alias principal de Vercel y alias de `main`.
- Runtime del deployment de #385: **0 errores/fatales** en la comprobación posterior al despliegue.
- Supabase: `Hilocofrade` (`kcevwkucqzcyrqaimyhl`) → **ACTIVE_HEALTHY**, región `eu-west-1`, Postgres `17.6.1.155`, plan de organización **Free**.
- Migraciones: **178/178** entre Git y Supabase, hasta `20260827002425 index_legal_drafts_updated_by`. #385 no añadió migraciones, cambios de esquema ni cambios RLS.

## Decisión post-congelación · #385

La congelación técnica previa cerró #383 y #385 sin fusionarlas para no ampliar funcionalidad durante el cierre. Posteriormente Dirección autorizó expresamente recuperar **solo #385**.

La recuperación se ejecutó con preflight completo:

- la rama se reconcilió con el `main` de cierre antes de reabrir la PR;
- quedó **0 commits por detrás**;
- se conservaron íntegros favicon, identidad, legibilidad y documentación incorporados durante el cierre;
- CI del head reconciliado: **369/369 tests** y build Next.js correcto;
- preview exacta del head: **READY** en `dub1`, sin `error/fatal`;
- PR #385 fusionada con head esperado;
- producción posterior al merge: **READY**, alias correctos y runtime sin errores/fatales.

Esta decisión **no recupera #383**, no reabre #49 y no supone iniciar una nueva fase funcional.

## Alcance funcional integrado por #385

### Salidas

`Salidas` es el único concepto visible de agenda dentro de una Hermandad. El término técnico `Series` deja de exponerse al editor.

Dentro del módulo conviven:

- **Salidas habituales**: estación de penitencia, Procesión de Gloria, Vía Crucis, Rosario público, Traslado, Romería, Subida, Bajada, Procesión sacramental, extraordinarias y otras salidas recurrentes.
- **Salidas registradas**: cada edición concreta con fecha, horarios, recorrido, titulares, música, fotografía y fuentes.

La recurrencia continúa internamente en el modelo relacional, pero no condiciona la terminología de la interfaz.

### Multimedia

Los flujos migrados de Bandas y Salidas siguen el contrato:

**navegador → permiso temporal → Supabase Storage → verificación servidor → vinculación de metadatos**.

Los bytes del archivo no atraviesan las Server Actions de Vercel. El patrón cubre logotipo, fotografía principal y banderín de Bandas, además de la imagen principal de una Salida.

### Curiosidades

Las Curiosidades de una Hermandad proceden de `editorial_content` + `editorial_content_links`, respetando publicación y RLS. No se creó un segundo modelo ni se recupera contenido legacy cuando no existe relación editorial válida.

## Primera edición

**HILO COFRADE · PRIMERA EDICIÓN → 🟡 NO CERRADA TÉCNICAMENTE**

La integración autorizada de #385 no cambia la puerta pendiente de cierre: falta ejecutar y conservar evidencia de la matriz responsive exacta en `390`, `768`, `1024` y `1440` px.

El cierre técnico no equivale al lanzamiento ni a su comunicación pública. Auth y Legal permanecen como dependencias externas/documentales y no se falsean como resueltas.

## QA y seguridad

### Validado

- Suite del corte #385: **369/369 tests**.
- Build: **correcto** con Next.js `16.3` y Turbopack.
- Producción #385: `dpl_6ZgEQuhTiRxcVs9KFhmeEzhbENbk` READY en `dub1`.
- Runtime de producción: 0 `error/fatal` en la ventana posterior al despliegue.
- Panel protegido, APIs excluidas y rutas de diagnóstico retiradas conforme al cierre previo.
- Front público stateless/anon; filtros de publicación conservados.
- RLS: **75/75 tablas públicas con RLS activa** según la última auditoría canónica.
- `npm audit` del cierre previo: 0 vulnerabilidades.

### Pendiente técnico

- **🔴 Matriz exacta `390 / 768 / 1024 / 1440`**. No se marca como superada sin evidencia verificable de esos cuatro viewports.

## Seguridad y Supabase Auth

- `/panel` mantiene autenticación y `noindex, nofollow`.
- La protección contra contraseñas filtradas continúa **🟣 BLOQUEADA POR EL PLAN FREE DE SUPABASE**; no se declara activada.
- Las advertencias de asesores ya documentadas permanecen fuera de este cambio; #385 no modificó Auth, funciones `SECURITY DEFINER`, políticas ni esquema.

## Legal, privacidad y contacto

**LEGAL → 🟣 BORRADOR PRIVADO EDITABLE · PENDIENTE DE DATOS Y APROBACIÓN DE DIRECCIÓN**

Dirección debe completar responsable, email/contacto público y decisiones jurídicas pendientes antes de publicar textos legales o habilitar formularios públicos. `Colabora` continúa cerrada y `noindex`.

#385 no modifica este estado legal ni introduce nuevos tratamientos de datos personales.

## SEO y descubrimiento

- Robots, sitemap, canonical, Open Graph, Twitter Cards e indexabilidad mantienen el baseline validado antes de #385.
- Panel y Colabora continúan `noindex`; APIs excluidas por robots.
- #385 no cambia rutas públicas canónicas ni requiere una migración SEO específica.

## Salud del grafo

**SALUD DEL GRAFO DE LANZAMIENTO → 🟢 APROBADA** conforme a la última auditoría de cierre.

#385 reutiliza relaciones y modelos existentes; no altera constraints ni migraciones del grafo.

## Importación

- #49 permanece **cerrada sin fusionar**.
- Vía canónica: **HC-016 → JSON / JSONL / CSV → staging → validación determinista → revisión humana → aplicación por lotes → auditoría**.

## Bloqueos y precauciones reales

1. Completar la matriz responsive exacta antes de declarar el cierre técnico.
2. No crear ni aplicar migraciones sin refrescar el historial local/remoto completo.
3. No reabrir #49.
4. #383 permanece cerrada hasta una decisión expresa e independiente de Dirección.
5. No publicar datos legales ni habilitar formularios públicos hasta completar Legal.
6. No declarar activada la protección de contraseñas filtradas mientras el plan de Supabase no lo permita.
7. La recuperación de #385 es una excepción autorizada post-congelación y no abre automáticamente nuevos frentes funcionales.

## Única acción siguiente de cierre

Ejecutar y documentar la matriz pública y del Panel en `390`, `768`, `1024` y `1440` px. Si no hay bloqueos rojos o naranjas, actualizar el estado a **Primera edición técnicamente cerrada** sin confundirlo con su anuncio público.

**ESTADO-PROYECTO → 🟡 PRIMERA EDICIÓN NO CERRADA · #385 🟢 EN PRODUCCIÓN · #383 CERRADA · ÚNICO BLOQUEO TÉCNICO DE CIERRE: MATRIZ RESPONSIVE EXACTA · PRODUCCIÓN `913dd614` READY · GIT ↔ SUPABASE 178/178 · AUTH 🟣 · LEGAL 🟣**
