# Utrera · conciliación del modelo y puerta de ejecución · HC-016

**Corte:** 27/09/2026, Europe/Madrid; continuación verificada desde las 06:37. **Estado: EN MODELADO; NO-GO a Apply.**

La orden posterior a Morón sitúa Utrera como próximo macrolote y establece que, después, se detenga la expansión municipal para completar las fichas y secciones existentes. Se retoma la PR #1009; no se vuelve a cargar Morón ni se toca HC-AUTO-03.

Este documento sucede al inventario inicial, que conserva su valor histórico. No convierte una identificación documental en una ficha publicada ni un cierre de carga en un cierre editorial.

## Base real y protección

- Main al preflight: `88fa02ffac5745ab9a8f2df59ab6a3b962210463` (#1010 integrada; #1000 también integrada).
- Producción: `dpl_BvJa4CNTdVs3it9Q54tbCSA5xx5j`, READY sobre ese SHA, aliases hilocofrade.es y www.hilocofrade.es.
- Supabase: ACTIVE_HEALTHY, 17 migraciones. La consulta directa conserva las tres Hermandades de Utrera: Jesús, Vera-Cruz y Consolación. Ninguna tiene tipos vacíos.
- Se revalidan por UUID Angustias, Dolores, el Paso de Angustias y De Profundis. El Paso de Angustias permanece **review en producción**, pero ya tiene texto candidato y fuentes para el manifiesto. Reutilización no implica publicación automática.
- En esta continuación: **0 escrituras productivas, 0 staging, 0 DDL y 0 cambios RLS**. QA web/SEO del candidato: no ejecutado, porque aún no hay candidato aplicado. El READY de plataforma no sustituye ese QA.

## Alcance que debe cerrarse de verdad

El inventario inicial de once corporaciones cubre el núcleo penitencial y sacramental. El directorio institucional F23 identifica además tres corporaciones de Gloria: Consolación, Rocío y Fátima. Consolación ya existe y se preserva. **Rocío y Fátima ya tienen modelo documental propio**, con sede, identidad, historia, patrimonio y Salidas en el [suplemento](./evidence/modelado-utrera-2026-09-27/gloria-and-closure.json). No quedan absorbidas por las quince Salidas de Semana Santa.

**Universo institucional identificado: 14 corporaciones distintas**, con las repeticiones por cortejo eliminadas. Es una base de revisión, no la afirmación de que todo el término municipal y todas sus asociaciones estén censados. ADMA, otras asociaciones y pedanías requieren una decisión explícita de inclusión o exclusión según su naturaleza y municipio; no se convierten automáticamente en Hermandades.

Fátima conserva su sede en la capilla; el punto y hora de partida de su romería de 2026 se dejan sin fijar por divergencias entre F25/F32/F33. No se confunde con Fátima de Los Molares. El Rocío conserva San José como sede canónica; su casa-hermandad no la sustituye. El Simpecado y las carretas se modelan como patrimonio, sin inventar una talla local de la Virgen del Rocío de Almonte. La partida del 19 de mayo sí tiene crónica posterior F31; el regreso anunciado del 28 no hereda ese `held`.

El Resucitado está confirmado como asociación distinta: F39 es su publicación propia y F40 acredita el Vía Lucis vespertino del 5 de abril. No es una confusión de las procesiones eucarísticas O14/O15 ni se absorbe en Cautivo. Su encaje, el de ADMA y la frontera de pedanías siguen requiriendo revisión antes de certificar exhaustividad municipal.

## Decisiones resueltas

| Cuestión | Decisión documental | Salvaguarda |
|---|---|---|
| Dolores / Soledad | Un Paso S20 con dos configuraciones y dos posiciones anuales | F13 dice expresamente mismo soporte; F21 p. 18 describe el paso singular y sus mantos. Son 22 soportes propuestos y 23 posiciones, no dos Dolorosas ni dos Pasos creados por la jornada |
| De Profundis | REUSE `e4884d0e-204e-408c-955e-b4c639de92c9` | Conciliación por director Sergio Asián, repertorio y vinculación a Los Negritos; no solo homonimia |
| Música de Milagros | Grupo vocal con acompañamiento instrumental documentado para 2026 | F14 y F22; no silencio, no inventar otro conjunto llamado «trío de capilla», no extender el acuerdo a 2027 |
| Trinidad | Penitencia | F17; el origen rosariano no acredita por sí solo una clasificación Gloria adicional |
| Columna de Vera-Cruz | Autoría desconocida con atribuciones alternativas | F19 distingue Roldán/Ruiz Gijón; no escoger una como autoría cierta |
| Figuras de Vera-Cruz | Conjunto de cinco, con excepción de autoría | Dos sayones, dos romanos y un sanedrita. F19 exceptúa un romano posterior; no adjudicar a los cinco la misma fecha/autor |
| Concepción de Milagros | Titular incluida; relaciones procesionales omitidas en esta edición | No se afirma ausencia del cortejo; no se crea una relación no acreditada. Deja de bloquear la ficha de la imagen |
| Paso de Angustias | UUID conservado; texto candidato preparado | Los proyectos de palio de 2016 y llamador de junio de 2026 no se dan por ejecutados ni estrenados en Semana Santa |
| Fechas pasadas | Estado explícito por evento | 18 Salidas modeladas: 4 con evidencia posterior vinculada, 14 conservadas como anuncios históricos |

La identidad del soporte S20 es una conclusión documental, no una inspección física. Las configuraciones se describirán en el Paso y en las notas de sus participaciones/posiciones; no como fases históricas excluyentes que se sustituyen anualmente.

## Matriz de imágenes y composición

El [modelo base](./evidence/modelado-utrera-2026-09-27/model-review.json) y su [suplemento](./evidence/modelado-utrera-2026-09-27/gloria-and-closure.json) forman el candidato documental vigente. Conservan 34 imágenes del programa, la Concepción de Los Milagros y añaden Fátima: **36 imágenes identificadas**. Se mantienen 22 Pasos propuestos y 23 posiciones del núcleo penitencial. No se afirma que las 36 imágenes estén acreditadas en los cortejos de 2026.

- La Concepción se conserva como titular física confirmada; no se generarán sus relaciones al Paso ni a la Salida. La omisión documental no se convierte en una afirmación de ausencia física.
- Dolores conserva su UUID y datación de la segunda mitad del XIX. Castillo Lastrucci intervino en 1923. Para Sebastián Santos, F18 indica inicios de los años cincuenta y F01 1968: no crear una intervención con fecha exacta escogida arbitrariamente. La discrepancia puede conservarse sin bloquear una descripción prudente de la imagen.
- Para Desamparados se distinguen hechura de 1959 y bendición de 1960; no se confunden con una sustitución.
- No se transfiere al Cristo de la Caridad la atribución que F01 formula expresamente para la Piedad.
- Angustias conserva la atribución tradicional descrita en producción; la mención «anónima» del programa no autoriza borrarla.
- Veredas y el ángel del Huerto se identifican como objetos vigentes; sus antecesores no se mezclan en una sola ficha.
- Las dos hebreas y las cinco figuras de Vera-Cruz se describen colectivamente; no se inventan nombres ni identificadores individuales.

La matriz diferencia autor, atribución, taller, círculo, escuela y anonimato. Fecha desconocida permanece nula. La autoría de una imagen no se copia a su Paso.

## Evidencia temporal

El programa F01 aporta convocatoria, horario e itinerario previstos. Las recogidas tras medianoche conservan su fecha siguiente. Las dos procesiones eucarísticas no generan imágenes del Santísimo ni Pasos de palio de costaleros por inferencia.

El índice F02 presenta cortejos y galerías, pero la página de Viernes Santo de Vera-Cruz consultada entrega un itinerario; otras páginas devolvieron errores. **El nombre «galería» no acredita por sí solo celebración.** Antes del manifiesto debe asociarse evidencia posterior concreta a cada `held`, y distinguir música anunciada de interpretada. F22 acredita celebración y música de Jesús, Vera-Cruz y Milagros; no acredita automáticamente las otras doce Salidas.

El suplemento fija O10/O11/O12 y O16 como `held`, con F22/F31 respectivamente. Las otras catorce permanecen `announced`; la ausencia de crónica no bloquea un manifiesto que mantenga ese estado prudente. No se certifican horas reales a partir de un horario previsto ni bandas de todo el cortejo a partir de una diana.

No se usa un balance general para resolver diferencias específicas de iconografía, fecha o naturaleza eucarística. Tampoco se heredan horas de entrada reales a partir del programa.

## Puertas pendientes, con resultado exigido

1. **Censo y alcance:** resolver ADMA, Resucitado y pedanías; Rocío/Fátima ya modelados, Consolación preservada. La clasificación institucional de catorce no prueba exhaustividad municipal.
2. **Fichas completas para esta edición:** terminar la matriz corporativa y patrimonial restante. Angustias y Milagros tienen refinamiento; quedan los otros veinte Pasos y los titulares físicos adicionales por revisar. Los datos desconocidos con justificación no se rellenan artificialmente.
3. **Ejecución:** deduplicación global final, UUIDs deterministas y manifiesto fila por fila. Después, preflight, snapshot, guard obligatorio de tipos para todas las Hermandades incluidas —también REUSE—, dry-run con ROLLBACK y cero residuos. Solo entonces Apply y QA público/SEO.

Por esas tres puertas, el modelo municipal completo **no está congelado** y no procede staging ni Apply. Concepción y la ausencia de crónicas dejan de figurar como bloqueos generales: se ha resuelto qué relaciones omitir y qué estados conservar. No es una falta de autorización.

## Qué significará cerrar Utrera

El informe final separará cuatro resultados: integridad de la carga, completitud editorial de las fichas, experiencia pública móvil/escritorio y descubrimiento SEO. Contará fichas revisadas y excepciones concretas, además de operaciones SQL. Los recursos visuales exigirán derechos; las ausencias justificadas quedarán visibles en el balance del cierre.

Después del cierre: **detener expansión municipal y completar fichas/secciones existentes por grupos acotados**. No abrir automáticamente Marchena, Mairena, Sanlúcar, otro municipio ni HC-AUTO-03.

## Evidencia reproducible

- [Modelo base y fuentes F01–F28](./evidence/modelado-utrera-2026-09-27/model-review.json).
- [Refinamiento de Gloria, relaciones y fuentes F29–F40](./evidence/modelado-utrera-2026-09-27/gloria-and-closure.json).
- [Preflight de continuación, consulta y snapshot de lectura](./evidence/modelado-utrera-2026-09-27/continuation-preflight.json); el corte anterior `preflight.json` se conserva.
- [Validación estructural](./evidence/modelado-utrera-2026-09-27/validation.json).
- Reproducción offline: `node scripts/validate-utrera-model.mjs`; regresiones: `node --test tests/utrera-model-contract.test.js`. El mínimo editorial candidato pasa en los cinco perfiles revisados; **no equivale a QA de fichas publicadas**.
- Suite completa en esta continuación: **1.299/1.299 pruebas, 0 fallos**, incluidas diez específicas del modelo. No se ejecuta build ni QA web de un candidato productivo inexistente; no hay cambios de aplicación.
- Inventario y snapshot iniciales: `evidence/inventario-utrera-2026-09-27/`; preservados.

F13 es un artículo de **2008**, aunque la cabecera del sitio muestre una fecha actual. F21 es el boletín de **2026**. Las páginas completas o fotografías ajenas no se copian al repositorio: se conservan enlaces, hashes y decisiones documentales.
