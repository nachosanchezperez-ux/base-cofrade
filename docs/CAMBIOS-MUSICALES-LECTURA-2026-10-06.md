# Cambios musicales 2027 · Lectura y verificación

## Estado de este corte

**6 de octubre de 2026 · PR #1100: preview verificada y preparada para integración.**
Este documento certifica el código y las comprobaciones previas a la integración.
El cierre de producción, con el SHA integrado y su despliegue, se registrará en la
[PR #1100](https://github.com/nachosanchezperez-ux/base-cofrade/pull/1100).

| Referencia | Valor |
| --- | --- |
| Código verificado | `663342a52b08ad689fbd5dae2efda1287bb390ec` |
| Preview | [base-cofrade-hlgd9gwzd-desdeel-arenal.vercel.app](https://base-cofrade-hlgd9gwzd-desdeel-arenal.vercel.app/semana-santa/2027/cambios-musicales) |
| Despliegue | `dpl_gpPgMi7X9WZfjeAM3pKBALYYVK2X` · **READY** |
| CI | [`verify` · SUCCESS](https://github.com/nachosanchezperez-ux/base-cofrade/actions/runs/37440297398/job/112192123872) |
| Evidencia de navegador | [Mediciones y recorridos en JSON](./evidence/CAMBIOS-MUSICALES-LECTURA-2026-10-06.json) |

El `main` de partida es `4db9729b39ec1ea47c0ea40539e779dcbd36b5f7`, que incluye
la agenda de #1099. Novedades públicas, #1098, ya estaba integrada y publicada
mediante `b9bc90da611b0a5c69ade8e493540a1f950ed897`; su documento anterior conserva
la evidencia de preview de aquel corte y su PR contiene el cierre posterior.
Las PR #1097, #1086, #1020 y #1019 quedan fuera de esta actuación, sin modificaciones
ni fusiones.

## Problema y resultado

La captura del usuario mostraba una jerarquía descompensada en móvil: jornadas y
Hermandades grandes, textos musicales pequeños, repetición del paso y su posición,
y dos cajas separadas por una fila de flecha que alargaban cada cambio.

La página adopta una escala local de títulos, nombres de bandas de 16 px y una
comparación única de 2026 y 2027. En anchuras pequeñas los dos años se presentan
en filas; desde 900 px se comparan en columnas. El año entrante se distingue mediante
el fondo azul claro y una etiqueta de año oscura. Se conservan las agrupaciones
abiertas por jornada y Hermandad, el total de cambios, el ranking territorial y los
filtros existentes.

Los nombres públicos reconocibles de las bandas se utilizan también en el buscador.
El nombre canónico, el identificador y el destino de cada entidad permanecen intactos.
La función `musicChangePositionLabel` reduce únicamente repeticiones exactas del paso,
conservando orientación, ubicaciones distintas, acompañamientos compartidos y matices
de recorrido. No equipara nombres distintos ni elimina información de Cruz de Guía.

## Alcance de los cambios

- Página y módulo CSS de `/semana-santa/2027/cambios-musicales`: comparación, escala
  tipográfica, controles, ajuste de líneas, migas de pan y posición de las anclas.
- `lib/music-changes.js`: presentación prudente de la posición musical.
- `test/music-changes-2027.test.mjs`: casos de la función anterior y conservación de
  los contratos de contenido, filtros, agrupación y resumen territorial; se retiran
  aserciones que fijaban literalmente el diseño sustituido.
- `components/HiloHeader.module.css`: ajuste pequeño y transversal **solo hasta
  390 px**, permitiendo reducir el logo al espacio disponible. Mantiene su proporción
  y los botones de 44 px; no modifica la cabecera por encima de esa anchura.

No hay cambios de datos, lectores de Supabase, políticas de caché, DML, DDL, RLS ni
migraciones. Se mantienen los 43 cambios públicos y sus anclas `cambio-<UUID>`.
Las entidades sin publicar no reciben enlaces nuevos. El periodo musical de Calle
Real conserva sus snapshots públicos, su identidad y los enlaces válidos a Valme y
Las Cigarreras.

## Verificación responsive ejecutada

La matriz se ejecutó en **Chromium de escritorio, mediante un iframe visible del
mismo origen que cargaba el HTML, CSS y JavaScript reales de la preview**. Los controles
del visor cambiaban la anchura del iframe y sus rutas; no sustituían el contenido de
la página. Esta prueba verifica el diseño responsive, sin equivaler a una prueba en
iPhone físico, Safari ni emulación de su navegador.

El navegador reservó 15 px para la barra vertical. Por eso la anchura visible del
documento (`clientWidth`) es menor que la anchura configurada del iframe. La evidencia
conserva ambas medidas y la inspección de elementos que pudieran desbordar.

| Anchura del iframe | `clientWidth` | Comparación | Jornada | Banda | Desbordamiento |
| ---: | ---: | --- | ---: | ---: | --- |
| 320 px | 305 px | Dos filas | 24 px | 16 px | Ninguno |
| 390 px | 375 px | Dos filas | 24 px | 16 px | Ninguno |
| 430 px | 415 px | Dos filas | 24 px | 16 px | Ninguno |
| 768 px | 753 px | Dos filas | 28 px | 16 px | Ninguno |
| 1024 px | 1009 px | Dos columnas | 30 px | 16 px | Ninguno |
| 1200 px | 1185 px | Dos columnas | 30 px | 16 px | Ninguno |

En las seis anchuras se midieron 43 cambios, orden de años 2026 → 2027, campos de
16 px y altura mínima de campo de 44 px. `scrollWidth` coincide con `clientWidth`
y la lista de elementos que desbordan está vacía en todos los casos.

La revisión de la primera preview detectó un pequeño desbordamiento de cabecera a
320 px, migas de pan con desplazamiento horizontal y anclas que ocultaban el contexto
bajo la cabecera. El código certificado incorpora las correcciones y la matriz
anterior corresponde a su comprobación posterior.

## Recorridos y pruebas

| Comprobación | Resultado |
| --- | --- |
| `TZ=UTC npm test` | **1.479/1.479 PASS** |
| `npm run build` | **PASS** |
| CI `verify` | **SUCCESS**, en el código certificado |
| Identidad del listado | **43 cambios y 43 anclas conservadas** |
| Búsqueda combinada | Cigarreras + Madrugá + Castilleja de la Cuesta + Banda de Música devuelve **Calle Real, un resultado** |
| Consulta sin resultados | Estado vacío correcto y `noindex, follow` |
| Limpiar filtros | Recupera los **43 cambios** |
| Trinidad | Conserva **dos cambios**, Cruz de Guía y Sagrado Decreto, agrupados en la misma Hermandad |
| Teclado | Tab desde Buscar a Jornada; foco visible con contorno de 2 px y separación de 3 px |
| Enlace de banda | Navegación real a Las Cigarreras, con canonical conservada |
| Ancla de jornada | Cabecera de jornada a **100 px** del borde superior en el caso medido |
| Ancla de Calle Real | Cambio a **220 px** y cabecera de Hermandad a **138 px**, ambos visibles en el caso medido |

Los valores precisos de las anclas son 100,14 px para la jornada, 219,88 px para el
cambio de Calle Real y 137,75 px para su cabecera. El ancla pública de este último
sigue siendo `cambio-15c7978e-ca6e-4f0b-b951-c7745fdc60d0`.

Se conservan el formulario GET y los parámetros `q`, `jornada`, `ambito`, `municipio`
y `tipo`, la canonical de la ruta sin filtros y `filteredViewRobots` para las vistas
filtradas. No se modifica el criterio editorial que excluye renovaciones sin cambio
de formación y acuerdos no confirmados.

## Integración y reversión

`public/qa-cambios-musicales-temporal.html` se retiró del corte preparado para integrar.
El JSON de evidencia ya está incorporado y se comprobó que los cinco archivos de
aplicación no presentan diferencias respecto al código certificado. El cierre de la
PR registrará el despliegue productivo posterior; este documento no anticipa que
producción ya esté verificada.

La reversión, si fuera necesaria, se realiza mediante una reversión normal de Git del
cambio de interfaz, conservando el trabajo ajeno. No requiere operaciones sobre la
base de datos ni reconstrucción de relaciones o históricos musicales.
