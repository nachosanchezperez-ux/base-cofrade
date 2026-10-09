# #1122 · Auditoría de cierre · 9 de octubre de 2026

## Estado posterior a la nueva orden

El usuario autorizó corregir los vínculos de La Paz. Las tres relaciones ya están publicadas, documentadas y verificadas con navegación pública recíproca 6/6. El bloqueo de datos descrito en el corte inferior queda resuelto; no es una orden pendiente. Evidencia: `../la-paz-vinculos-20261009/README.md`. #1122 sigue draft: QA visual no certificada y bloque Pasos de la ficha de Hermandad todavía cacheado en la última muestra. Los lotes originales no se repiten.

## Auditoría anterior al correctivo (evidencia histórica)

## Puerta: NO-GO

No se saca de draft ni se fusiona. El contrato Imagen–Paso falla en La Paz: no existen las relaciones de Jesús de la Victoria, María Santísima de la Paz y Nuestra Señora del Prado con sus tres pasos en `image_steps`; las seis fichas públicas tampoco contienen enlaces recíprocos. Son relaciones ausentes, no huérfanos. Repararlas requeriría DML nuevo, prohibido en este cierre documental.

La revisión visual de escritorio y móvil tampoco queda certificada: el navegador remoto agotó la espera; la instalación del navegador de QA local no pudo completarse. HTML/SEO no sustituyen QA responsive.

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

Patrimonio renovado: tres piezas y seis restauraciones visibles. Titularidad sacramental conceptual preservada sin Imagen física nueva. Se mantienen discrepancia 1937/1939, restaurador de San Sebastián no acreditado y rollout de la guía. El bloqueo relacional no se reclasifica como deuda legítima.

### Pino Montano

Titulares correctos: Jesús de Nazaret y María Santísima del Amor, con alturas 175/165 cm y dos enlaces Imagen–Paso. Miniatura de la Esperanza Macarena no equivale a otra titular. Marcha Amor y Esperanza y dos piezas históricas presentes. Se conserva incertidumbre del inventario secundario y ejecución futura de los proyectos de 2025; no se confunde con obras terminadas.

### La Misión

Cuatro Imágenes y hábito actualizados. Descripciones públicas finales de Amparo, San Juan y ausencia de guantes confirmadas, sin invalidación adicional. Amparo actual de 1999 diferenciado del precedente 1967/1975. `history_text` corregido y persistido; no visible en la plantilla, que muestra únicamente cronología. Mismo código en main y PR; contrato de lectura en `docs/HERMANDAD-LABORATORIO-LECTURA-2026-10-01.md`. No se acredita regresión objetiva ni se cambia el producto. Autoría/datación material del Paso glorioso y otros huecos sin fuente unívoca no se inventan.

## Contrato público

21 páginas comprobadas: 3 Hermandades, 10 Imágenes, 8 Pasos. Todas responden 200; canonical absoluta exacta; index/follow; título, description, OG y Twitter; cinco bloques JSON-LD parseables por página, incluyendo BreadcrumbList. 21/21 figuran en el sitemap general, que es un urlset, no un sitemapindex. Evidencia resumida en `public-qa.json`.

Hermandad → Imagen y Hermandad → Paso navegan en las tres. Imagen ↔ Paso pasa en Pino Montano y las cuatro Imágenes de La Misión; falla en La Paz. Fuentes, música, patrimonio y cronologías disponibles comprobados en HTML. No se certifica visualización de `history_text` ni interacción responsive.

## Validación y cierre

La suite inicial ejecutada localmente sobre `13fda40…`: 1579/1579, sin fallos ni omitidos. El build local no produjo un cierre completo verificable (última salida: 24/33 páginas); no se declara PASS por compilación parcial. CI remoto inicial verify SUCCESS; la validación final debe consultarse sobre el commit documental reconciliado, sin reutilizar estos números como resultado de otro HEAD. `git diff --check` inicial limpio.

No hay merge, SHA productivo nuevo ni postflight de despliegue. El estado final de checks/preview del commit documental se reporta en la entrega, sin sustituir el NO-GO funcional.

PR restantes al corte: #1113, #1111, #1097, #1086, #1020, #1019, intactas. HC-AUTO-03 ready 55/55, 0 aplicado: NO APPLY. No se abre otro frente. No se modifican SQL históricos, manifiestos ni preserved snapshots.
