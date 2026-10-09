# #1122 · Auditoría de cierre · 9 de octubre de 2026

## Estado posterior a la nueva orden

El correctivo autorizado ya está aplicado una sola vez y conciliado. Corte público posterior del 9/10/2026: las tres tarjetas de Paso de la ficha de La Paz enlazan a su Imagen y cada Imagen devuelve el Paso en «Procesiona en»; **6/6 enlaces recíprocos PASS** sobre producción. Evidencia: `../la-paz-vinculos-20261009/README.md`. La última revisión visual de escritorio confirma la relación; faltan fotografías propias de los pasos, que siguen mostrando marcadores. No se repiten los lotes históricos.

## Auditoría anterior al correctivo (evidencia histórica)

## Puerta inicial: NO-GO (resuelta en el corte actual)

El bloqueo inicial era la ausencia de tres relaciones Imagen–Paso en La Paz. El correctivo autorizado se aplicó una vez, con preflight, dry-run/ROLLBACK, COMMIT y postflight; no se reejecutaron SQL históricos. En la comprobación pública posterior, producción sirve las tres parejas en ambos sentidos, 6/6, con HTTP 200. La ficha general fue revisada visualmente en escritorio; el bloque Pasos ya refleja las imágenes relacionadas. No hubo cambio de código ni de despliegue para lograrlo.

La revisión responsive móvil/interacción completa queda fuera de esta corrección editorial, que solo añadió relaciones de contenido. No se certifica. Las fotos de los pasos son un recurso gráfico pendiente, independiente de los vínculos ya visibles.

## Precheck

- main/base: `59edee119b5c81b470897c4899ffc8ecc5a4c25b`.
- HEAD inicial #1122: `13fda40b2c7c492f5ba86087fab3fa539be96b59`, open/draft/mergeable.
- Producción `dpl_2jCDeirE6miwQohgXrpj9L7PJg4X`, READY sobre main, aliases hilocofrade.es y www.hilocofrade.es.
- Preview inicial `dpl_GJJZdDf9LS9gFMnuvL75giY16A9S`, READY sobre HEAD inicial.
- Supabase kcevwkucqzcyrqaimyhl: ACTIVE_HEALTHY.
- Runtime inicial: ventana 05:19–06:19 UTC, filtro error/fatal, sin registros. No significa ausencia global de incidentes fuera de esa ventana.
- Base exacta verificada por merge-base; 11 archivos iniciales exclusivamente documentales/históricos.

## Auditoría productiva solo SELECT

| Lote | INSERT coincidentes | Filas UPDATE finales coincidentes | Preservación |
|---|---:|---:|---|
| La Paz | 97/97 | 6/6 | Hashes de cultos, música y salidas; tipos |
| Pino Montano | 18/18 | 2/2 | Hashes de música y salidas; Penitencia |
| La Misión | 0 | 6/6 | Hashes de cultos, música y salidas; tres tipos |

Se compararon IDs y todos los campos del manifiesto con `to_jsonb(row) @> expected`. En La Misión se fusionaron los tres ajustes posteriores por clave antes de comparar las seis filas finales. Cero duplicados por claves lógicas en INSERT (entidades por tipo/slug, fuentes por URL, relaciones por extremos y tipo, enlaces de fuente por fuente/destino); cero referencias FK huérfanas en las filas auditadas. El grafo consultado conserva diez titularidades físicas, ocho relaciones Hermandad–Paso y seis Imagen–Paso (dos Pino Montano, cuatro La Misión), sin duplicados en esas claves. No se declara auditoría semántica exhaustiva de todo el catálogo.

### La Paz

Patrimonio renovado: tres piezas y seis restauraciones visibles. Titularidad sacramental conceptual preservada sin Imagen física nueva. Se mantienen discrepancia 1937/1939, restaurador de San Sebastián no acreditado y rollout de la guía. Las relaciones de Paso con Jesús de la Victoria, María Santísima de la Paz y Nuestra Señora del Prado ya están publicadas y navegables en ambos sentidos.

### Pino Montano

Titulares correctos: Jesús de Nazaret y María Santísima del Amor, con alturas 175/165 cm y dos enlaces Imagen–Paso. Miniatura de la Esperanza Macarena no equivale a otra titular. Marcha Amor y Esperanza y dos piezas históricas presentes. Se conserva incertidumbre del inventario secundario y ejecución futura de los proyectos de 2025; no se confunde con obras terminadas.

### La Misión

Cuatro Imágenes y hábito actualizados. Descripciones públicas finales de Amparo, San Juan y ausencia de guantes confirmadas, sin invalidación adicional. Amparo actual de 1999 diferenciado del precedente 1967/1975. `history_text` corregido y persistido; no visible en la plantilla, que muestra únicamente cronología. Mismo código en main y PR; contrato de lectura en `docs/HERMANDAD-LABORATORIO-LECTURA-2026-10-01.md`. No se acredita regresión objetiva ni se cambia el producto. Autoría/datación material del Paso glorioso y otros huecos sin fuente unívoca no se inventan.

## Contrato público

21 páginas comprobadas: 3 Hermandades, 10 Imágenes, 8 Pasos. Todas responden 200; canonical absoluta exacta; index/follow; título, description, OG y Twitter; cinco bloques JSON-LD parseables por página, incluyendo BreadcrumbList. 21/21 figuran en el sitemap general, que es un urlset, no un sitemapindex. Evidencia resumida en `public-qa.json`.

Hermandad → Imagen y Hermandad → Paso navegan en las tres. Imagen ↔ Paso pasa en Pino Montano, las cuatro Imágenes de La Misión y las tres parejas de La Paz; estas últimas se comprobaron de nuevo en producción el 9/10, con enlaces en las tarjetas de Paso y en «Procesiona en» de las fichas de Imagen. Fuentes, música, patrimonio y cronologías disponibles comprobados en HTML. No se certifica visualización de `history_text` ni QA móvil/interacción.

## Validación y cierre

La suite inicial ejecutada localmente sobre `13fda40…`: 1579/1579, sin fallos ni omitidos. El build local no produjo un cierre completo verificable (última salida: 24/33 páginas); no se declara PASS por compilación parcial. CI remoto inicial verify SUCCESS; la validación final debe consultarse sobre el commit documental reconciliado, sin reutilizar estos números como resultado de otro HEAD. `git diff --check` inicial limpio.

El cambio de esta PR es documental; los datos corregidos ya están activos en producción. Los checks/preview deben confirmarse en el HEAD documental final antes del merge. El deployment de producción consultado para la QA relacional es `dpl_2jCDeirE6miwQohgXrpj9L7PJg4X` sobre `main` `59edee1…`.

PR restantes al corte: #1113, #1111, #1097, #1086, #1020, #1019, intactas. HC-AUTO-03 ready 55/55, 0 aplicado: NO APPLY. No se abre otro frente. No se modifican SQL históricos, manifiestos ni preserved snapshots.
