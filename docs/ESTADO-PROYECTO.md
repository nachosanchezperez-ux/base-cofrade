# Estado operativo de Hilo Cofrade

> Fuente canónica para Hilo Orquestador. GitHub, Vercel y Supabase prevalecen siempre sobre este documento.

## Estado verificado

- Revisión: **28 de agosto de 2026 · publicación legal y reconciliación final de migraciones**.
- Repositorio: `nachosanchezperez-ux/base-cofrade`.
- Rama principal: `main`.
- Último baseline funcional validado de `main`: `6369f71872e969a8001347bf6e5f26b004aef883` — **#408 · reconciliación de la versión real de la migración legal**; incluye la publicación legal de #407 sobre el baseline posterior a #406.
- Deployment de producción validado: `dpl_GtpegWiF3C9G4fBUsFevMh5DrGNZ` → **READY**, región `dub1`, commit exacto `6369f718` y alias `hilocofrade.es` activos.
- PR abiertas: **solo #394**, abierta y draft. Tras avanzar `main` con #406/#407/#408, GitHub ya no la presenta mergeable; debe reconciliarse antes de su decisión final, sin ampliar alcance.
- No se ha abierto ningún frente funcional nuevo durante este cierre.

## Primera edición

**HILO COFRADE · PRIMERA EDICIÓN → 🟡 TÉCNICAMENTE PREPARADA**

**BASELINE TÉCNICO AUTOMATIZABLE → 🟢 VALIDADO**

No se declara todavía el cierre técnico completo ni se activa el `FIRST EDITION FREEZE`. Queda una única puerta técnica humana:

**QA RESPONSIVE VISUAL EXACTO `390 / 768 / 1024 / 1440` → 🟣 PENDIENTE DE VALIDACIÓN MANUAL DE DIRECCIÓN**

Esta revisión manual no se describe como fallo técnico y no bloquea la validación del resto del baseline. El cierre técnico no equivale al lanzamiento ni a su comunicación pública.

## #394 · Cabeceras identitarias

- Estado: **🟣 READY FOR VISUAL APPROVAL**.
- Base funcional validada originalmente: `main aa7514b`; `main` actual es `6369f718` y requiere una reconciliación final antes de resolver la PR.
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

#394 permanece en borrador y no se fusiona hasta el visto bueno visual manual. Después deberá reconciliarse con el `main` real y repetir sus checks técnicos antes de la decisión definitiva.

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

- Producción actual: **READY** en `dub1`, deployment `dpl_GtpegWiF3C9G4fBUsFevMh5DrGNZ`, commit `6369f718`.
- Smoke automatizable: todas las superficies principales respondieron y renderizaron correctamente.
- Runtime posterior a la publicación legal: **sin errores de runtime** en la última hora.

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
- Migraciones Git ↔ Supabase: **180/180**, hasta `20260828212940 publish_ready_legal_documents`.
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
- Sitemap: **202 URL**, incluidas las tres rutas legales públicas.
- Home: canonical, `index, follow`, Open Graph y Twitter Cards presentes.
- Panel: `noindex, nofollow`.
- Colabora: `noindex, follow`, cerrada y sin formulario.
- Rutas de diagnóstico: 404.
- Directorios y fichas mantienen títulos, H1, canonical y enlaces a entidades reales.

Search Console conserva la última evidencia aportada por Dirección: propiedad verificada, Home en Google y sitemap correcto.

## Legal, privacidad y contacto

**LEGAL → 🟢 PUBLICADO CON DECISIONES CONFIRMADAS POR DIRECCIÓN**

- Rutas públicas operativas con HTTP 200: `/aviso-legal`, `/privacidad` y `/cookies`.
- Los tres documentos son editables desde `/panel/legal`; el estado `ready` controla su publicación.
- La ficha de Dirección y las notas internas permanecen privadas y no son seleccionables por `anon`.
- Contacto público único: `hilocofrade@gmail.com`.
- Dirección decide expresamente no mostrar domicilio ni dirección postal.
- En el alcance actual no existen publicidad, patrocinios, afiliación, pagos ni newsletter.
- Footer y sitemap enlazan los tres documentos.
- Smoke público: los tres documentos responden, sin marcadores pendientes ni dirección postal expuesta.
- Colabora continúa cerrada, sin formulario público de recogida de datos personales.

La publicación se realizó mediante #407 y la migración se reconcilió con el historial remoto mediante #408. La rama de preview de Supabase conserva una deuda histórica ajena a Legal: una migración antigua de San Benito depende de datos semilla en una base nueva; producción está alineada y no se repitió SQL.

## Apple Music

Apple Music conserva `52` lanzamientos publicados enlazados: `46` llegan al álbum, EP o sencillo exacto y `6` mantienen temporalmente el perfil oficial de la banda por discrepancias documentales de artista, título o año. No quedan lanzamientos en `review`. Detalle: [`AUDITORIA-EDITORIAL-APPLE-MUSIC-2026-08-27.md`](./AUDITORIA-EDITORIAL-APPLE-MUSIC-2026-08-27.md).

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
3. **Reconciliación final de #394** con el `main` real y repetición de checks después del visto bueno visual.

## Única acción siguiente

**Dirección debe revisar visualmente #394 y el baseline en `390 / 768 / 1024 / 1440`; si da el visto bueno, resolver #394 y declarar el cierre técnico con su freeze.**

**ESTADO-PROYECTO → 🟡 PRIMERA EDICIÓN TÉCNICAMENTE PREPARADA · BASELINE AUTOMATIZABLE 🟢 · PRODUCCIÓN READY · GIT ↔ SUPABASE 180/180 · #394 PENDIENTE VISUAL Y DE RECONCILIACIÓN FINAL · QA VISUAL 🟣 · AUTH 🟢 · LEGAL 🟢**
