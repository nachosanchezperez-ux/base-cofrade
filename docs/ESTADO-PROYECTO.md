# Hilo Cofrade · Estado canónico

**Corte:** 30 de agosto de 2026 · cierre técnico de Primera Edición
**Régimen:** `FIRST EDITION FREEZE` activo

## Estado general

- Baseline funcional de `main`: `732e8a4801b69d7a8edca1f75ece048fbf2028f9`.
- El HEAD posterior a este corte puede añadir únicamente esta actualización documental; no cambia el árbol funcional validado.
- #425, cierre UX de Primera Edición: **fusionada**.
- #394, cabeceras nombre + escudo/logotipo: **única puerta de aprobación visual**, abierta en borrador y no fusionada.
- #423, fotografía de la Pastora 2026: **pendiente editorial**, aislada del baseline.
- Nueva expansión funcional: **congelada**.

## Baseline técnico

**BASELINE TÉCNICO → 🟢 VALIDADO**

- `npm test`: `439/439` sobre el baseline fusionado.
- Build de producción y TypeScript: correctos.
- El repositorio no define scripts independientes de lint o typecheck; `--if-present` finaliza correctamente.
- `git diff --check`: correcto.
- CI #1181: correcta.
- #425 quedó reconciliada con el `main` real antes de fusionarse.
- El único conflicto, en Marcha del día, conserva la prioridad del escudo introducida por `main` y el fallback controlado de #425.
- La duplicación de «Hilo Cofrade» en los títulos de Igualás detectada durante el smoke quedó corregida y cubierta por regresión.

## Producción y Vercel

**PRODUCCIÓN → 🟢 ESTABLE**

- Deployment del baseline funcional: `dpl_4dHpAHMEJntLABL346rH8uKs16dE`.
- Commit desplegado: `732e8a4801b69d7a8edca1f75ece048fbf2028f9`.
- Estado: `READY`; región: `dub1`.
- Dominio canónico: `https://hilocofrade.es`.
- Runtime del deployment: sin errores ni fatales en el control posterior a la fusión.
- Los `statement timeout` observados pertenecen a deployments anteriores; no se han reproducido en el deployment actual y permanecen cerrados como incidencia histórica.

## Pull requests

### #425 · Cierre UX de Primera Edición

**Estado → 🟢 FUSIONADA**

Responsabilidades cerradas:

- coherencia de cifras entre Home y directorios;
- filtrado de placeholders, vacíos y falsos ceros;
- `noindex, follow` para fichas bajo mínimo editorial;
- navegación interna, anclas, teclado y estado activo;
- fallbacks de imágenes, logos, portadas y fotografía destacada;
- legibilidad de directorios;
- jornada real ↔ «Desde [año]» en acompañamientos;
- catálogos secundarios cerrados por defecto;
- separación de fuentes directas y generales en presentación;
- accesibilidad básica del buscador, foco y estados anunciables.

No resuelve ni pretende resolver la nueva composición visual de cabeceras de #394.

### #394 · Cabeceras nombre + escudo/logotipo

**Decisión → OPCIÓN C · 🟣 READY FOR VISUAL APPROVAL**

- Introduce una decisión visual material distinta: escudo/logotipo y nombre forman una sola identidad principal.
- El solape de archivos con #425 es parcial, pero no existe duplicidad de objetivo.
- Reconciliada técnicamente con el baseline fusionado de #425.
- Validación local reconciliada: `446/446` pruebas y build correcto.
- Permanece en borrador y no se fusiona hasta la aprobación visual humana.
- Es la única puerta visual; no constituye un segundo baseline técnico.

### #423 · Fotografía Pastora de Cantillana 2026

**Estado → 🟠 PENDIENTE EDITORIAL**

- El diff real contiene únicamente `public/procesiones/pastora-cantillana/.gitkeep`.
- No contiene la fotografía anunciada.
- Faltan el recurso definitivo, procedencia/derechos y la relación con el `outing`.
- No se fusiona y no compite con el cierre UX.

## Git ↔ Supabase

**ALINEACIÓN → 🟢**

- Proyecto: `Hilocofrade` (`kcevwkucqzcyrqaimyhl`), `ACTIVE_HEALTHY`, `eu-west-1`, plan Pro.
- Migraciones en Git: `185`.
- Migraciones en Supabase: `185`.
- Última versión: `20260830140331 normalize_cruz_roja_glorias_2026`.
- No se han creado ni aplicado migraciones durante este cierre.
- #425 no modificó datos, esquema, RLS ni Storage.

## Auth, RLS y seguridad

**SEGURIDAD → 🟢**

- RLS activa en `77/77` tablas públicas.
- `166` claves foráneas públicas validadas; `0` sin validar.
- Front público anónimo y stateless.
- Panel autenticado y `noindex, nofollow`.
- Sesión autenticada comprobada en producción.
- Acción «Cerrar sesión» presente; no se ejecutó para no alterar la sesión de Dirección.
- Login y recuperación conservan sus regresiones existentes.
- Leaked Password Protection no presenta aviso de desactivación en el asesor actual.
- No hay rutas de diagnóstico públicas ni datos draft visibles en el smoke.
- El asesor conserva avisos conocidos de funciones `SECURITY DEFINER` para `authenticated` y una tabla interna con RLS sin política; no existe concesión nueva a `anon` ni hallazgo nuevo provocado por este cierre.

## Legal

**LEGAL → 🟢 PUBLICADO**

- `/aviso-legal`, `/privacidad` y `/cookies`: operativas y con documento `ready`.
- Footer y sitemap mantienen los enlaces.
- Los borradores internos no son públicos.
- No se modificó contenido legal durante este cierre.

## Salud del grafo

**SALUD DEL GRAFO → 🟢 SIN BLOQUEOS NUCLEARES**

- Relaciones nucleares con extremos inexistentes: `0`.
- Relaciones nucleares publicadas con extremos no publicados: `0`.
- Claves foráneas públicas sin validar: `0`.
- Persisten `5` nodos publicados de referencia sin ficha especializada; la navegación pública, sitemap y `noindex` degradan de forma segura y no constituyen rotura nuclear.
- No se ha completado contenido secundario en esta tarea.

## QA técnico

**QA TÉCNICO → 🟢**

Smoke de producción validado para Home, Directorio, Hermandad, Imagen, Paso, Banda, Extraordinaria, Gloria, Igualás y Ensayos, Tira del hilo y Panel autenticado.

Resultado:

- sin 404/500 en las rutas recorridas;
- sin imágenes rotas visibles;
- sin overflow global detectable;
- un único `main` por página;
- sin errores propios de consola;
- canonical y títulos coherentes;
- Panel privado, con sesión válida y control de cierre de sesión presente.

Las regresiones existentes cubren contratos responsive, overflow, navegación, accesibilidad, SEO, fallbacks y publicación. El navegador automático verificó render real sin overflow en el ancho disponible; esta evidencia técnica no equivale a aprobación visual humana.

## QA visual manual

**QA VISUAL MANUAL → 🟣 PENDIENTE DE DIRECCIÓN**

- `390 px`: pendiente.
- `768 px`: pendiente.
- `1024 px`: pendiente.
- `1440 px`: pendiente.

No se han pedido ni fingido pantallazos. Esta es la única deuda manual y se concentra en la decisión visual de #394.

## Primera Edición y freeze

- ⚙️ Baseline técnico: **🟢 validado**.
- 🚀 Producción: **🟢 estable**.
- 🔐 Seguridad: **🟢**.
- ⚖️ Legal: **🟢**.
- 🕸️ Grafo: **🟢 sin bloqueos nucleares**.
- 📱 QA técnico: **🟢**.
- 👁️ QA visual manual: **🟣 pendiente**.

**PRIMERA EDICIÓN → 🟡 TÉCNICAMENTE PREPARADA**
Pendiente únicamente de la aprobación visual manual de #394.

`FIRST EDITION FREEZE` queda activo. Hasta esa decisión solo se permiten contenido, datos, Fuentes, fotografías, bugs reales, seguridad, correcciones editoriales e incidencias de producción. No se abren nuevas funcionalidades, módulos, entidades, Homes, rediseños ni evoluciones estructurales.
