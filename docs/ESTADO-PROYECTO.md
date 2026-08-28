# Estado operativo de Hilo Cofrade

> Fuente canónica para Hilo Orquestador. GitHub, Vercel y Supabase prevalecen siempre sobre este documento. Antes de cualquier acción significativa deben refrescarse las herramientas.

## Estado verificado

- Revisión: **28 de agosto de 2026 · preflight de recuperación del cierre técnico**.
- Repositorio: `nachosanchezperez-ux/base-cofrade`.
- Rama principal: `main`.
- Último `main` validado: `636a851a5d0a1e617540d9c7aac792479b48a16a` — **Merge pull request #400 · agenda común de próximas procesiones**.
- Producción: `dpl_5yz7EuWc4MeqmC5kEpYBCnsiRd5H` → **READY**, región `dub1`, commit exacto `636a851`.
- Alias verificados por Vercel: `hilocofrade.es`, `www.hilocofrade.es`, alias principal y alias de `main`.
- Runtime del deployment actual: **sin errores `error/fatal` propios conocidos**. El único aviso de las últimas 24 horas pertenece a un deployment anterior, respondió HTTP 200 y no se mantiene como bloqueo del actual.
- PR abiertas: **solo #394**, en borrador.
- PR #398, #399, #401 y #400: **fusionadas**.
- #383 y #49: **cerradas sin fusionar**; no deben reabrirse sin decisión expresa de Dirección.
- Supabase: `Hilocofrade` (`kcevwkucqzcyrqaimyhl`) → **ACTIVE_HEALTHY**, región `eu-west-1`, Postgres `17.6.1.155`, plan de organización **Pro**.
- Migraciones: **179/179** entre Git y Supabase, hasta `20260827232524 corrige_las_vinas_virgen_reyes_encarnacion`.
- RLS: **75/75 tablas públicas con RLS activa**.

## Primera edición

**HILO COFRADE · PRIMERA EDICIÓN → 🟡 NO CERRADA TÉCNICAMENTE**

No se declara lanzamiento. Permanecen dos condiciones operativas de cierre:

1. completar y conservar evidencia de la matriz responsive exacta en `390`, `768`, `1024` y `1440` px sobre producción y sobre el preview reconciliado de #394;
2. resolver #394 mediante fusión o cierre sin fusionar tras esa matriz.

El cierre técnico no equivale al lanzamiento ni a su comunicación pública.

## Pull requests de cierre

### #394 · Cabeceras identitarias

- Estado: **abierta, draft y mergeable**.
- Head reconciliado con `main` `636a851`: `79ad0fa9e1ccdd7c36f5454edb96b831ed733636`.
- Delta efectivo: **9 archivos**, limitado a cabeceras de Hermandades/Bandas, orígenes de media y regresiones.
- Validación local del head reconciliado: **389/389 tests** y build Next.js `16.3`/Turbopack correcto.
- CI y preview del nuevo head: **en curso** en este checkpoint.
- Decisión: pendiente de la matriz visual exacta.

### #400 · Agenda común

- Estado real: **fusionada** en `main` como `636a851` antes de este preflight.
- La orden de ponerla en espera quedó superada por el estado remoto; no se repite ni se revierte trabajo ya cerrado.

## QA responsive

**MATRIZ EXACTA `390 / 768 / 1024 / 1440` → 🔴 PENDIENTE**

Las capturas anteriores de Home no cierran la matriz porque #398 y #400 modificaron después su baseline. No se aceptan aproximaciones ni se declara verde una celda sin evidencia del viewport exacto.

## Seguridad y Supabase Auth

- `/panel` mantiene autenticación y `noindex, nofollow` según el último baseline validado.
- El plan de Supabase ya es **Pro**: desaparece la antigua limitación externa de plan.
- El asesor de seguridad continúa informando `auth_leaked_password_protection` → **Leaked Password Protection Disabled**.
- Estado: **🟠 DISPONIBLE PERO PENDIENTE DE ACTIVACIÓN Y REGRESIÓN DE LOGIN/SESIÓN/LOGOUT**.
- No se modifica Auth por código ni se cambia el plan.

## Legal, privacidad y contacto

**LEGAL → 🟣 BORRADOR PRIVADO EDITABLE · PENDIENTE DE DATOS CONCRETOS Y APROBACIÓN DE DIRECCIÓN**

El Panel dispone de cuatro borradores privados para completar responsable, email, contacto público y decisiones jurídicas. No se publican valores inventados. `Colabora` continúa cerrada y `noindex`; no existen formularios públicos abiertos de recogida de datos personales según el último baseline validado.

Legal no bloquea el cierre técnico mientras continúen esas barreras, pero sí permanece como pendiente previo al lanzamiento público.

## SEO, sitemap y Search Console

- Baseline técnico conocido: `robots.txt`, canonical, Open Graph, Twitter Cards, exclusión de `/api/` y `/panel/`, `noindex` de Panel/Colabora y retirada de rutas de prueba.
- Sitemap: última auditoría completa **195/195 URL válidas**.
- Search Console, evidencia del 27 de agosto: propiedad de dominio verificada, Home en Google, sitemap correcto con 188 páginas descubiertas en la instantánea de Google, 12 páginas indexadas y 31 no indexadas.
- Este checkpoint no sustituye el smoke SEO final sobre el `main` definitivo.

## Salud del grafo

**SALUD PÚBLICA DE LANZAMIENTO → 🟢 ÚLTIMO BASELINE APROBADO · REFRESCO FINAL PENDIENTE**

- El último control no detectó relaciones nucleares públicas con extremos inexistentes ni entidades navegables sin ficha especializada.
- Cinco nodos de Hermandad continúan publicados solo como referencias relacionales y fuera de navegación pública.
- Las carencias editoriales de cobertura permanecen en backlog y no bloquean mientras la UI degrade de forma segura.

## Apple Music

Apple Music conserva `46` lanzamientos publicados enlazados: `40` llegan directamente al álbum, EP o sencillo y `6` mantienen temporalmente el perfil oficial de la banda. Otros `6` singles están en `review`, correctamente excluidos de producción. El detalle está en [`AUDITORIA-EDITORIAL-APPLE-MUSIC-2026-08-27.md`](./AUDITORIA-EDITORIAL-APPLE-MUSIC-2026-08-27.md).

## Importación

- #49 permanece **cerrada sin fusionar**.
- Vía canónica: **HC-016 → JSON / JSONL / CSV → staging → validación determinista → revisión humana → aplicación por lotes → auditoría**.

## Bloqueos y precauciones reales

1. Completar la matriz responsive exacta sobre producción y #394.
2. No fusionar #394 sin resolver incidencias rojas/naranjas y aprobar sus cuatro anchos.
3. Activar y comprobar la protección de contraseñas filtradas ahora que el plan Pro la permite.
4. No publicar los textos legales hasta disponer de datos concretos y aprobación de Dirección.
5. No abrir funcionalidades ni una segunda edición durante el cierre.

## Única acción siguiente de cierre

Esperar CI/preview del head `79ad0fa` de #394 y ejecutar la matriz exacta `390 / 768 / 1024 / 1440` sobre producción y ese preview.

**ESTADO-PROYECTO → 🟡 PRIMERA EDICIÓN NO CERRADA · PRODUCCIÓN `636a851` READY · GIT ↔ SUPABASE 179/179 · PR ABIERTA #394 · MATRIZ 🔴 · AUTH 🟠 · LEGAL 🟣**
