# Hilo Cofrade · Estado canónico

**Corte:** 31 de agosto de 2026 · cierre UX de Primera Edición
**Régimen:** `FIRST EDITION FREEZE` activo

## Estado general

- Baseline funcional de `main`: `42ebfc3cfbcc5fefbc1ff11340705bfb3cfa1fa3`.
- #425, cierre UX de Primera Edición: **fusionada**.
- #394, cabeceras nombre + escudo/logotipo: **fusionada**.
- #423, fotografía de la Pastora de Cantillana 2026: **resuelta editorialmente**.
- QA visual manual 390/768/1024/1440: **completada por Dirección**.
- Nueva expansión funcional: **congelada**.

## Baseline técnico

**BASELINE TÉCNICO → 🟢 VALIDADO**

- `npm test`: **454/454** sobre el árbol reconciliado con `main`.
- Build de producción y TypeScript: correctos sobre el árbol reconciliado.
- `git diff --check`: correcto.
- #425 y #394 quedaron reconciliadas con el `main` real antes de fusionarse.
- #394 cerró la única decisión visual material: escudo/logotipo y nombre como una sola identidad principal.
- No queda una segunda puerta estructural abierta.

## Producción y Vercel

**PRODUCCIÓN → 🟢 ESTABLE**

- Deployment: `dpl_E4yM8LRaEv7KGy88tMrUg9cWPFrw`.
- Commit desplegado: `42ebfc3cfbcc5fefbc1ff11340705bfb3cfa1fa3`.
- Estado: `READY`; región: `dub1`.
- Dominios: `https://hilocofrade.es` y `https://www.hilocofrade.es`.
- Runtime posterior a la fusión: sin errores ni fatales.
- Smoke público correcto en Home, El Baratillo, La Pastora de Cantillana, San Benito, Maestro Tejera y Las Cigarreras.
- Rutas comprobadas con títulos presentes, cero imágenes rotas y cero overflow horizontal.

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
- jornada real y antigüedad en acompañamientos;
- accesibilidad básica del buscador, foco y estados anunciables.

### #394 · Cabeceras nombre + escudo/logotipo

**Estado → 🟢 FUSIONADA**

- Commit de integración: `42ebfc3cfbcc5fefbc1ff11340705bfb3cfa1fa3`.
- Matriz manual 390/768/1024/1440 aprobada.
- El Baratillo, San Benito y Maestro Tejera quedaron revalidados a 390 px tras las correcciones finales.
- Preview, CI, build, runtime y smoke: correctos.
- No modificó Supabase, IDs, slugs, enlaces ni archivos de logotipo.

### #423 · Fotografía Pastora de Cantillana 2026

**Estado → 🟢 RESUELTA EDITORIALMENTE**

- Recurso canónico en Git:
  `/public/procesiones/pastora-cantillana/pastora-cantillana-8-septiembre-2026.webp`.
- Dimensiones: 720 × 1079 px; formato WEBP.
- La carpeta ya contiene el recurso real; se retira el antiguo `.gitkeep`.
- Supabase ya vincula el recurso al `outing` `4eddf059-35aa-4fab-80ad-313398a0332a`.
- Salida: «Procesión triunfal de la Divina Pastora 2026», 8 de septiembre de 2026.
- Estado: `published`; crédito: `Fotografía • Hermandad`.
- Texto alternativo: «Divina Pastora de las Almas de Cantillana durante su procesión.»
- No se duplica el archivo ni se repite una escritura ya cerrada en Supabase.

## Git ↔ Supabase

**ALINEACIÓN DE CONTENIDO #423 → 🟢**

- La ruta guardada en Supabase existe en `main`.
- El `outing` publicado conserva fecha, imagen, texto alternativo y crédito.
- #423 no requiere nueva migración, cambio de esquema, RLS ni Storage.

**HISTORIAL GLOBAL DE MIGRACIONES → 🟠 RECONCILIACIÓN PENDIENTE**

- Git: 189 archivos de migración.
- Supabase: 188 entradas de historial.
- Solo en Supabase: `20260830232314_close_public_contribution_endpoint`.
- Solo en Git:
  - `20260831014500_pasion_muerte_habito_correccion`;
  - `20260831015700_pasion_muerte_habito_imagen_publica`.
- Los datos de Pasión y Muerte ya reflejan ambas migraciones; no se repiten sus actualizaciones.
- La migración de contribuciones pertenece al frente paralelo `feat/secure-public-contributions-20260831`.
- La reconciliación se mantiene separada para no mezclar trabajos paralelos ni fingir una alineación inexistente.

## Auth, RLS y seguridad

**SEGURIDAD → 🟢 SIN REGRESIONES DEL CIERRE UX**

- #394 y #423 no cambian Auth, RLS, Storage ni permisos.
- El front público sigue siendo anónimo y stateless.
- El Panel permanece autenticado y `noindex, nofollow`.
- No se han creado claves, recursos ni integraciones nuevas durante este cierre.

## Legal

**LEGAL → 🟢 PUBLICADO**

- `/aviso-legal`, `/privacidad` y `/cookies`: operativas.
- Footer y sitemap mantienen los enlaces.
- No se modificó contenido legal durante este cierre.

## Salud del grafo

**SALUD DEL GRAFO → 🟢 SIN BLOQUEOS NUCLEARES**

- El cierre de #394 es exclusivamente de presentación.
- #423 conserva una relación válida entre recurso y salida publicada.
- No se han creado entidades, relaciones ni excepciones por slug.

## QA técnico

**QA TÉCNICO → 🟢**

- Suite reconciliada: 454/454.
- Producción: `READY`.
- Runtime: sin errores ni fatales.
- Smoke del delta visual: correcto.
- Cero imágenes rotas y cero overflow horizontal en las rutas de control.

## QA visual manual

**QA VISUAL MANUAL → 🟢 COMPLETADA POR DIRECCIÓN**

- 390 px: aprobada.
- 768 px: aprobada.
- 1024 px: aprobada.
- 1440 px: aprobada.

La deuda manual de #394 queda cerrada.

## Primera Edición y freeze

- ⚙️ Baseline técnico: **🟢 validado**.
- 🚀 Producción: **🟢 estable**.
- 🔐 Seguridad del cierre: **🟢**.
- ⚖️ Legal: **🟢**.
- 🕸️ Grafo: **🟢 sin bloqueos nucleares**.
- 📱 QA técnico: **🟢**.
- 👁️ QA visual manual: **🟢**.
- 📰 #423: **🟢 resuelta editorialmente**.

**PRIMERA EDICIÓN → 🟢 TÉCNICA Y VISUALMENTE PREPARADA**

`FIRST EDITION FREEZE` queda activo. Hasta nueva decisión de Dirección solo se permiten contenido, datos, Fuentes, fotografías, bugs reales, seguridad, correcciones editoriales e incidencias de producción. No se abren nuevas funcionalidades, módulos, entidades, Homes, rediseños ni evoluciones estructurales.
