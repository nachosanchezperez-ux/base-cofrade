# Estado operativo de Hilo Cofrade

> Fuente canónica para Hilo Orquestador. GitHub, Vercel y Supabase prevalecen siempre sobre este documento. Antes de cualquier acción significativa deben refrescarse las herramientas.

## Estado verificado

- Revisión: **27 de agosto de 2026 · borradores legales privados en Panel**.
- Repositorio: `nachosanchezperez-ux/base-cofrade`.
- Rama principal: `main`.
- Último `main` funcional validado: `65c573e048b777d69b8c06572c9f69cb3df3596d` — **Borradores legales privados y editables en el Panel (#375)**. El commit documental que actualice este archivo puede sucederlo sin cambios funcionales.
- PR abiertas al cierre de la revisión: **0**.
- #49: **CERRADA SIN FUSIONAR**; no debe reabrirse.
- Producción funcional validada: `dpl_BNHgyQn9nr7nr4e7EWn3MbEEUnPS` → **READY**, región `dub1`.
- Runtime posterior al smoke: **0 errores agrupados en `/panel/legal`**. La ruta autenticada cargó cuatro documentos y cuatro acciones de guardado, sin overflow ni errores de aplicación.
- Supabase: `Hilocofrade` (`kcevwkucqzcyrqaimyhl`) → **ACTIVE_HEALTHY**, región `eu-west-1`, Postgres `17.6.1.155`, plan de organización **Free**.
- Migraciones: **178/178** entre Git y Supabase, hasta `20260827002425 index_legal_drafts_updated_by`.

## Primera edición

**HILO COFRADE · PRIMERA EDICIÓN → 🟡 NO CERRADA TÉCNICAMENTE**

Producción está estable y no quedan bloqueos funcionales conocidos. Falta una única puerta técnica: ejecutar y conservar evidencia de la matriz responsive exacta en `390`, `768`, `1024` y `1440` px. La revisión completa realizada en la superficie de navegador disponible y las regresiones automatizadas no sustituyen esa matriz exacta.

El cierre técnico no equivale al lanzamiento ni a su comunicación pública. Tras superar la matriz, Dirección deberá aceptar expresamente las dependencias externas de Auth y Legal antes de decidir el anuncio.

## QA final

### Validado

- Revisión pública completa en producción a `1363 × 936`: Home, Directorio y sus filtros, Hermandades, Imágenes, Pasos, Bandas, Extraordinarias, Glorias, Tira del hilo, navegación y footer.
- Muestras de Hermandades: Pastora de Cantillana, San Benito, El Baratillo, una Gloria y una ficha incompleta.
- Variantes de contenido: relaciones y títulos largos, recursos horizontales/verticales/cuadrados, ausencia de fotografía y fichas con cobertura parcial.
- Panel autenticado: login, sesión, logout, Inicio, navegación, Hermandades, Glorias, Imágenes, Pasos, Bandas y Multimedia. Formularios, carga, guardado y feedback tienen contratos automatizados; no se generaron recursos ni mutaciones editoriales de prueba en producción.
- Suite: **347/347 tests**.
- Build: **correcto** con Next.js `16.3` y Turbopack.
- Correcciones de #371: overflow de fichas de Extraordinarias, ancho intrínseco del editor Multimedia y resolución de URLs absolutas de previsualización.
- Preview de #371: **READY** en `dub1`; regresiones afectadas sin overflow ni imágenes rotas.
- Smoke final de producción: Home, Directorio, Hermandad, Imagen, Paso, Banda, Extraordinaria, Gloria, Tira del hilo y Panel superados.

### Pendiente técnico

- **🔴 Matriz exacta `390 / 768 / 1024 / 1440`**. La superficie de navegador disponible no expone emulación ni control verificable de viewport; no se marca como superada.

## Seguridad y Supabase Auth

- `/panel` redirige al login sin sesión y todas sus superficies declaran `noindex, nofollow`.
- `/api/` está excluida en `robots.txt`; los endpoints editoriales exigen autenticación.
- `/prueba-next` y `/prueba-supabase` responden `404`.
- No se detectaron claves versionadas, mensajes SQL, trazas técnicas, contenido draft ni errores técnicos en las superficies públicas revisadas.
- Front público stateless/anon; las consultas públicas mantienen los filtros de publicación.
- RLS: **74/74 tablas públicas con RLS activa**.
- Las advertencias de funciones `SECURITY DEFINER` están contenidas: no tienen ejecución anónima, fijan `search_path` y comprueban identidad/rol editorial. Los núcleos de aplicación del importador no son ejecutables por usuarios autenticados.
- Login, sesión y logout del Panel: **validados**. La interfaz de recuperación existe; no se envió un correo real de recuperación durante QA.
- Protección contra contraseñas filtradas: **🟣 BLOQUEADA POR LIMITACIÓN EXTERNA DOCUMENTADA**. Supabase la reserva a planes Pro o superiores; el proyecto permanece en Free. La opción se intentó activar desde Dashboard, no persistió y el asesor mantiene la advertencia. No se cambió Auth por código.

## Legal, privacidad y contacto

**LEGAL → 🟣 BORRADOR PRIVADO EDITABLE · PENDIENTE DE DATOS Y APROBACIÓN DE DIRECCIÓN**

Dirección ha confirmado que aportará responsable, email y contacto público, pero todavía no constan sus valores definitivos. El Panel incorpora `/panel/legal` con ficha de Dirección, Aviso legal, Privacidad y Cookies/almacenamiento como borradores privados; solo miembros del Panel pueden leerlos y admin/editor puede guardarlos. No existen rutas legales públicas ni enlaces de Footer y ningún estado del editor publica contenido automáticamente. `Colabora` continúa cerrada y `noindex`; no hay formularios públicos de aportación, contacto o recogida de datos personales.

## SEO y descubrimiento

- `robots.txt`, sitemap, canonical, Open Graph y Twitter Cards: **validados en producción**.
- Panel y Colabora: `noindex`; APIs excluidas por robots.
- Las rutas de prueba no existen y las páginas principales son indexables.
- Sitemap: **188 URLs**, todas con respuesta `200` en el barrido realizado.
- Search Console: última evidencia canónica del 26/08/2026 — dominio verificado, sitemap sin errores/advertencias y Home indexada. No hubo acceso al conector para refrescar la consola durante este corte; no se afirma una comprobación posterior independiente.

## Salud del grafo

**SALUD DEL GRAFO DE LANZAMIENTO → 🟢 APROBADA**

- `0` relaciones nucleares publicadas con extremos inexistentes en Hermandades–Imágenes, Hermandades–Pasos e Imágenes–Pasos.
- `0` Hermandades, Imágenes o Pasos publicados sin su fila especializada.
- El Auditor muestra `22` prioridades de cobertura: `20` imágenes publicadas sin recurso visual directo y `2` marchas publicadas sin autor. Se comprobó degradación visual segura; son carencias editoriales para backlog, no relaciones rotas ni UI bloqueada.

## Importación

- #49 permanece **cerrada sin fusionar**.
- Vía canónica: **HC-016 → JSON / JSONL / CSV → staging → validación determinista → revisión humana → aplicación por lotes → auditoría**.
- No abrir una evolución del importador durante este cierre.

## Bloqueos y precauciones reales

1. Completar la matriz responsive exacta antes de declarar el cierre técnico.
2. No crear ni aplicar migraciones sin refrescar el historial local/remoto completo.
3. No reabrir #49 ni sustituir HC-016 por una importación generativa.
4. No publicar datos legales ni habilitar formularios públicos hasta que Dirección confirme identidad, contacto y tratamiento.
5. No declarar activada la protección de contraseñas filtradas mientras el plan de Supabase no lo permita.
6. No abrir automáticamente una segunda edición ni nuevas funcionalidades.

## Única acción siguiente

Ejecutar una comprobación verificable de la matriz responsive exacta en `390`, `768`, `1024` y `1440` px sobre las superficies enumeradas en la orden de cierre. Si no aparecen bloqueos, actualizar este estado a **Primera edición técnicamente cerrada** y dejar Auth/Legal como dependencias externas aceptadas o no por Dirección.

**ESTADO-PROYECTO → 🟡 PRIMERA EDICIÓN NO CERRADA · ÚNICO BLOQUEO TÉCNICO: MATRIZ RESPONSIVE EXACTA · PRODUCCIÓN ESTABLE · PR 0 · GIT ↔ SUPABASE 178/178 · AUTH 🟣 · LEGAL 🟣 EN EDICIÓN PRIVADA**
