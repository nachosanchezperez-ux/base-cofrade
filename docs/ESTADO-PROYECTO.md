# Estado operativo de Hilo Cofrade

> Fuente canónica para Hilo Orquestador. GitHub, Vercel y Supabase prevalecen siempre sobre este documento.

## Estado verificado

- Revisión: **28 de agosto de 2026 · cierre del baseline técnico automatizable**.
- Repositorio: `nachosanchezperez-ux/base-cofrade`.
- Rama principal: `main`.
- HEAD real de `main`: `ec355c058fcf0878ee02d9a1d568c14bdf4e7c6d` — cierre documental; no altera el árbol ejecutable.
- Último baseline funcional validado de `main`: `aa7514b18af5fec01b05c2e98133a24356632e00` — **Merge #404 · Hoy en Hilo Cofrade móvil**. Los commits posteriores de esta secuencia son exclusivamente documentales y no alteran el árbol ejecutable.
- Producción actual: `dpl_uG4UmNUYKAAGBbCSPPrqPgQYc4zZ` → **READY**, región `dub1`, commit documental `ec355c0`, con el mismo árbol funcional `aa7514b` validado.
- PR abiertas: **solo #394**, abierta, draft y mergeable.
- No se ha abierto ningún frente funcional nuevo durante este cierre.

## Primera edición

**HILO COFRADE · PRIMERA EDICIÓN → 🟡 TÉCNICAMENTE PREPARADA**

**BASELINE TÉCNICO AUTOMATIZABLE → 🟢 VALIDADO**

No se declara todavía el cierre técnico completo ni se activa el `FIRST EDITION FREEZE`. Queda una única puerta técnica humana:

**QA RESPONSIVE VISUAL EXACTO `390 / 768 / 1024 / 1440` → 🟣 PENDIENTE DE VALIDACIÓN MANUAL DE DIRECCIÓN**

Esta revisión manual no se describe como fallo técnico y no bloquea la validación del resto del baseline. El cierre técnico no equivale al lanzamiento ni a su comunicación pública.

## #394 · Cabeceras identitarias

- Estado: **🟣 READY FOR VISUAL APPROVAL**.
- Base funcional validada: `main aa7514b`.
- Head: `7bd47ef9566d70587da4f064fd931e636e668c94` (incluye la sincronización documental final; el árbol funcional validado es `e1f90b4`).
- Delta: **9 archivos**, limitado a cabeceras de Hermandades/Bandas, media, configuración de imágenes y regresiones.
- Tests: **394/394**.
- Build: Next.js `16.3` / Turbopack correcto.
- CI: **verde**.
- Preview: `dpl_B2onFM8fRucPGh1dT7UUJxKjoiQ6` → **READY**, región `dub1`.
- Auditoría técnica: **🟢**.

La auditoría confirma:

- sin excepciones por slug ni hardcodes por ficha;
- componentes compartidos para Hermandades y Bandas;
- fotografía de Banda conservada en «De un vistazo»;
- escudos y logotipos mantienen sus rutas y carga;
- sin migraciones, cambios de datos, rutas públicas ni consultas añadidas;
- SEO, navegación, Imágenes y Pasos conservan el baseline.

#394 permanece en borrador y no se fusiona hasta el visto bueno visual manual.

## QA responsive

### QA responsive técnico

**QA RESPONSIVE AUTOMATIZABLE → 🟢 VALIDADO**

- Regresiones CSS y de identidad incluidas en la suite completa.
- Smoke en producción sobre Home, Directorio, Hermandad, Imagen, Paso, Banda, Extraordinaria, Gloria, Tira del hilo y Panel.
- Smoke del preview de #394 sobre Home, Hermandades, Bandas, Imagen y Paso.
- En la superficie automatizada disponible: cero overflow horizontal, errores técnicos visibles o imágenes cargadas rotas en las páginas inspeccionadas.
- Sin errores de hidratación o JavaScript atribuibles a la aplicación.

Esta validación técnica no sustituye el juicio visual de Dirección.

### QA responsive visual

- `390 px` → 🟣 pendiente manual.
- `768 px` → 🟣 pendiente manual.
- `1024 px` → 🟣 pendiente manual.
- `1440 px` → 🟣 pendiente manual.

## Producción y rendimiento

- Producción actual: **READY** en `dub1`.
- Smoke automatizable: todas las superficies principales respondieron y renderizaron correctamente.
- Runtime posterior: **sin errores `error/fatal`** en producción ni en el preview de #394.

### Incidencia de `statement timeout`

El deployment actual registró dos peticiones HTTP 200 de fichas de Paso en las que la carga secundaria de Fuentes agotó `statement timeout`:

- `/pasos/paso-misterio-jesucristo-atado-columna`;
- `/pasos/paso-palio-dulce-nombre-bellavista`.

Investigación:

- loader: `lib/supabase/brotherhoods.js`;
- tabla: `source_links`;
- consulta: selección de `source_id` filtrada por destinos documentales;
- volumen analizado: 1.723 filas;
- consulta directa: 5 filas y ejecución aproximada de **0,35 ms**;
- reproducción posterior: seis peticiones, todas HTTP 200;
- runtime posterior: sin nuevos timeouts ni errores/fatales.

Resultado: **🟢 incidencia transitoria no reproducida**. No se modifica código, timeout, caché ni esquema por especulación. Se mantiene vigilancia.

## Supabase, migraciones y Auth

- Proyecto `Hilocofrade` (`kcevwkucqzcyrqaimyhl`) → **ACTIVE_HEALTHY**.
- Región: `eu-west-1`; Postgres `17.6.1.155`; plan **Pro**.
- Migraciones Git ↔ Supabase: **179/179**, hasta `20260827232524 corrige_las_vinas_virgen_reyes_encarnacion`.
- Leaked Password Protection: **🟢 ACTIVA**. El asesor ya no emite `auth_leaked_password_protection`.
- Auth del Panel: **🟢 OPERATIVA**. La regresión posterior a la activación validó login, sesión, navegación, logout y nueva autenticación; el último smoke confirmó una sesión autenticada vigente.

## RLS y seguridad pública

- RLS: **75/75 tablas públicas con RLS activa**.
- Front público: anónimo y stateless, protegido por regresiones.
- Panel: autenticado y `noindex, nofollow`.
- `/api/`: excluida por `robots.txt`.
- `/prueba-next` y `/prueba-supabase`: **404**.
- Sin SQL, stack traces, claves o datos draft visibles en el smoke.

El asesor conserva avisos conocidos sobre funciones `SECURITY DEFINER` accesibles al rol autenticado y una tabla interna con RLS sin política. Pertenecen al control de roles/importación del Panel, verifican membresía o permisos y no están concedidas a `anon`; no se ha detectado una exposición pública nueva. Referencia: <https://supabase.com/docs/guides/database/database-linter>.

## Salud del grafo

**SALUD DEL GRAFO → 🟢 SIN BLOQUEOS NUCLEARES**

- Relaciones publicadas con extremos inexistentes o no publicados: **0**.
- Relaciones Hermandad ↔ Imagen, Hermandad ↔ Paso, Imagen ↔ Paso y Marcha ↔ Autor con extremos públicos inválidos: **0**.
- Cinco nodos de Hermandad siguen como referencias relacionales sin ficha especializada; están excluidos de sitemap y navegación pública por #393/#395.
- Las carencias editoriales permanecen en backlog y no bloquean mientras la UI degrade de forma segura.

## SEO y navegación

**SEO BASELINE → 🟢 CORRECTO**

- `robots.txt`: permite Front y excluye `/api/` y `/panel/`.
- Sitemap: **199 URL**.
- Home: canonical, `index, follow`, Open Graph y Twitter Cards presentes.
- Panel: `noindex, nofollow`.
- Colabora: `noindex, follow`, cerrada y sin formulario.
- Rutas de diagnóstico: 404.
- Directorios y fichas mantienen títulos, H1, canonical y enlaces a entidades reales.

Search Console conserva la última evidencia aportada por Dirección: propiedad verificada, Home en Google y sitemap correcto.

## Legal, privacidad y contacto

**LEGAL → 🟣 BORRADORES PRIVADOS · PENDIENTE DE DIRECCIÓN**

- `/panel/legal`: operativo.
- Cuatro documentos privados: todos continúan en `draft`.
- Ficha de Dirección, Aviso legal y Política de privacidad conservan marcadores pendientes.
- Almacenamiento/cookies tiene contenido de trabajo, pero sigue sin aprobación.
- Colabora continúa cerrada, sin formulario público de recogida de datos personales.
- No se publica ningún dato inventado.

Legal no bloquea el baseline técnico mientras se mantengan estas barreras, pero continúa como pendiente previo al lanzamiento público.

## Apple Music

Apple Music conserva `46` lanzamientos publicados enlazados: `40` llegan al álbum, EP o sencillo y `6` mantienen temporalmente el perfil oficial de la banda. Otros `6` singles están en `review`, excluidos de producción. Detalle: [`AUDITORIA-EDITORIAL-APPLE-MUSIC-2026-08-27.md`](./AUDITORIA-EDITORIAL-APPLE-MUSIC-2026-08-27.md).

## Importación

- #49 permanece **cerrada sin fusionar**.
- Vía canónica: **HC-016 → JSON / JSONL / CSV → staging → validación determinista → revisión humana → aplicación por lotes → auditoría**.

## Estado de congelación

La expansión funcional queda detenida. El `FIRST EDITION FREEZE` formal no se activa todavía porque falta la aprobación visual manual y la decisión definitiva sobre #394.

Hasta entonces solo se permite bug real, seguridad, legal, contenido, datos, fuentes, fotografías, corrección editorial o incidencia de producción.

## Bloqueos técnicos reales

**No se ha detectado ningún bloqueo técnico automatizable adicional.**

## Pendientes manuales y pre-lanzamiento

1. **QA visual manual exacto `390 / 768 / 1024 / 1440`** sobre producción y preview de #394.
2. **Decisión visual sobre #394**: fusionar o cerrar sin fusionar.
3. **Legal**: completar y aprobar datos/textos antes del lanzamiento público.

## Única acción siguiente

**Dirección debe revisar visualmente #394 y el baseline en `390 / 768 / 1024 / 1440`; si da el visto bueno, resolver #394 y declarar el cierre técnico con su freeze.**

**ESTADO-PROYECTO → 🟡 PRIMERA EDICIÓN TÉCNICAMENTE PREPARADA · BASELINE AUTOMATIZABLE 🟢 · PRODUCCIÓN READY · GIT ↔ SUPABASE 179/179 · #394 READY FOR VISUAL APPROVAL · QA VISUAL 🟣 · AUTH 🟢 · LEGAL 🟣**
