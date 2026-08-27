# Estado operativo de Hilo Cofrade

> Fuente canónica para Hilo Orquestador. GitHub, Vercel y Supabase prevalecen siempre sobre este documento. Antes de cualquier acción significativa deben refrescarse las herramientas.

## Estado verificado

- Revisión: **27 de agosto de 2026 · Search Console, sitemap y cierre de rutas públicas**.
- Repositorio: `nachosanchezperez-ux/base-cofrade`.
- Rama principal: `main`.
- Último `main` funcional validado: `c6a15a9da7a82c2313ec98a392f30a9fee7244b4` — **Buscador público · exige ficha especializada antes de enlazar (#395)**.
- Producción: `dpl_9b7yQaUfdLcLvdrLDBP3ZZYUPJMq` → **READY**, región `dub1`, commit exacto `c6a15a9`.
- Alias verificados: `hilocofrade.es`, `www.hilocofrade.es`, alias principal de Vercel y alias de `main`.
- Runtime del deployment actual: **6 peticiones de comprobación con HTTP 200 y 0 eventos `error/fatal`**.
- PR #393: **fusionada**; excluye de sitemap, directorios y enlaces de Bandas las entidades sin ficha pública.
- PR #395: **fusionada**; impide que el buscador público enlace entidades navegables sin ficha especializada.
- PR #394: **abierta y no fusionada**; cabeceras de identidad pendientes de matriz visual exacta.
- #383 y #49: **cerradas sin fusionar**; no deben reabrirse sin decisión expresa de Dirección.
- Supabase: `Hilocofrade` (`kcevwkucqzcyrqaimyhl`) → **ACTIVE_HEALTHY**, región `eu-west-1`, Postgres `17.6.1.155`, plan de organización **Free**.
- Migraciones: **178/178** entre Git y Supabase, hasta `20260827002425 index_legal_drafts_updated_by`. #393 y #395 no añadieron migraciones, cambios de esquema ni cambios RLS.
- Suite de `main`: **372/372 tests**. Build Next.js `16.3`/Turbopack: **correcto**.

## Primera edición

**HILO COFRADE · PRIMERA EDICIÓN → 🟡 NO CERRADA TÉCNICAMENTE**

No se declara lanzamiento. Permanecen dos condiciones operativas de cierre:

1. ejecutar y conservar evidencia de la matriz responsive exacta en `390`, `768`, `1024` y `1440` px;
2. resolver o cerrar la PR #394, que sigue abierta y necesita esa misma validación visual.

Auth y Legal permanecen como dependencias externas/documentales. El cierre técnico no equivale al lanzamiento ni a su comunicación pública.

## QA y seguridad

### Validado

- `npm test`: **372/372** en `main` tras #395.
- `npm run build`: **correcto**.
- Producción: `dpl_9b7yQaUfdLcLvdrLDBP3ZZYUPJMq` READY en `dub1`.
- Runtime: 0 `error/fatal` en la comprobación posterior al despliegue.
- Panel protegido; APIs excluidas y rutas de diagnóstico retiradas.
- Front público stateless/anon y filtros de publicación conservados.
- RLS: **75/75 tablas públicas con RLS activa** según la última auditoría canónica.
- `npm audit` del cierre: 0 vulnerabilidades.

### Pendiente técnico

- **🔴 Matriz exacta `390 / 768 / 1024 / 1440`**. No se marca como superada sin evidencia verificable de esos cuatro viewports.
- **🟠 PR #394 abierta**. No forma parte de producción y no debe fusionarse sin completar su matriz.

## Seguridad y Supabase Auth

- `/panel` mantiene autenticación y `noindex, nofollow`.
- La protección contra contraseñas filtradas continúa **🟣 BLOQUEADA POR EL PLAN FREE DE SUPABASE**; requiere Pro o superior y no se declara activada.
- #393 y #395 no modificaron Auth, funciones `SECURITY DEFINER`, políticas ni esquema.

## Legal, privacidad y contacto

**LEGAL → 🟣 BORRADOR PRIVADO EDITABLE · PENDIENTE DE DATOS CONCRETOS Y APROBACIÓN DE DIRECCIÓN**

El Panel dispone de borradores privados para completar responsable, email, contacto público y decisiones jurídicas. No se publican valores inventados. `Colabora` continúa cerrada y `noindex`; no existen formularios públicos abiertos de recogida de datos personales.

## SEO, sitemap y Search Console

### Producción

- `robots.txt`: HTTP 200; permite el sitio, excluye `/api/` y `/panel/`, y declara `https://hilocofrade.es/sitemap.xml`.
- `sitemap.xml`: HTTP 200, `application/xml`, **195 URL** actuales.
- Auditoría completa del sitemap: **195/195 URL con HTTP 200**, canonical correcto, sin `noindex` y sin duplicados.
- Las cinco hermandades relacionales sin ficha especializada no aparecen en sitemap ni directorios y ya no reciben enlaces desde Bandas o buscadores públicos.
- Canonical, Open Graph, Twitter Cards, `noindex` de Panel/Colabora y retirada de rutas de prueba conservan el baseline aprobado.

### Search Console · evidencia del 27 de agosto de 2026

- Propiedad de dominio: `hilocofrade.es`.
- Home `https://hilocofrade.es/`: **“La URL está en Google”**, página indexada y HTTPS correcto.
- Sitemap enviado: **Correcto**; enviado el 13 de agosto, última lectura el 27 de agosto, **188 páginas descubiertas** en la instantánea de Google.
- Cobertura mostrada: **12 páginas indexadas** y **31 no indexadas**.
- Motivos no indexados: `1` página con redirección y `30` descubiertas actualmente sin indexar; `0` rastreadas actualmente sin indexar.
- Rendimiento visible: `5` clics totales. Vídeo: `1` sin indexar y `0` indexados.
- No se observa ningún problema crítico nuevo.

La cifra de `188` páginas descubiertas es la última lectura de Search Console; el sitemap de producción contiene ahora `195` URL válidas. La diferencia es retraso de procesamiento, no una incoherencia del archivo actual.

## Salud del grafo

**SALUD PÚBLICA DE LANZAMIENTO → 🟢 APROBADA**

- El sitemap y las superficies navegables no contienen extremos públicos inexistentes.
- Cinco nodos de tipo Hermandad siguen publicados únicamente como referencias de acompañamientos musicales y carecen de fila especializada. Se mantienen fuera de navegación pública hasta que Dirección decida completarlos o reclasificarlos; no se inventan perfiles.
- El buscador puede devolver esos nombres como conocimiento relacional, pero con `href` vacío. Una ficha válida como El Baratillo conserva su enlace normal.

**INTEGRIDAD EDITORIAL → 🟡 BACKLOG NO BLOQUEANTE**

- `20` Imágenes publicadas siguen sin recurso visual directo; conservan fuente y autoría estructurada.
- `Gloria a ti · adaptación para banda` conserva autoría original vinculada a `J. Arriaga`; falta identificar con evidencia al adaptador de 2016.
- `El Descendimiento` continúa como Marcha publicada sin autor publicado.

## Apple Music

Apple Music conserva `46` lanzamientos enlazados: `34` llegan directamente al lanzamiento y `12` mantienen temporalmente el perfil oficial de la banda por falta de coincidencia exacta. El detalle y la cola editorial están documentados en [`AUDITORIA-EDITORIAL-APPLE-MUSIC-2026-08-27.md`](./AUDITORIA-EDITORIAL-APPLE-MUSIC-2026-08-27.md).

## Importación

- #49 permanece **cerrada sin fusionar**.
- Vía canónica: **HC-016 → JSON / JSONL / CSV → staging → validación determinista → revisión humana → aplicación por lotes → auditoría**.

## Bloqueos y precauciones reales

1. Completar la matriz responsive exacta antes de declarar el cierre técnico.
2. No fusionar #394 sin su matriz visual y un nuevo preflight sobre `main`.
3. No crear ni aplicar migraciones sin refrescar el historial local/remoto completo.
4. No reabrir #49 ni #383 sin decisión expresa de Dirección.
5. No publicar datos legales ni habilitar formularios públicos hasta completar y aprobar Legal.
6. No declarar activada la protección de contraseñas filtradas mientras el plan de Supabase no lo permita.
7. No abrir automáticamente una segunda edición ni declarar el lanzamiento.

## Única acción siguiente de cierre

Ejecutar la matriz `390 / 768 / 1024 / 1440` sobre producción y sobre el preview de #394. Si no aparecen incidencias rojas o naranjas, resolver #394 y actualizar el estado técnico sin declarar por ello el lanzamiento público.

**ESTADO-PROYECTO → 🟡 PRIMERA EDICIÓN NO CERRADA · PRODUCCIÓN `c6a15a9` READY · SEARCH CONSOLE 🟢 · SITEMAP 195/195 🟢 · GIT ↔ SUPABASE 178/178 · PR ABIERTA #394 · AUTH 🟣 · LEGAL 🟣**
