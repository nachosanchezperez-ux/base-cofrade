# Utrera · conciliación del modelo y puerta de ejecución · HC-016

**Corte:** 27/09/2026, Europe/Madrid; preflight de continuación a las 07:20 y lectura de alcance a las 07:36. **Estado: 22/22 PERFILES DE PASOS REVISADOS; MODELO MUNICIPAL AÚN SIN CONGELAR; NO-GO a Apply.**

La orden posterior a Morón sitúa Utrera como próximo macrolote y establece que, después, se detenga la expansión municipal para completar las fichas y secciones existentes. Se retoma la PR #1009; no se vuelve a cargar Morón ni se toca HC-AUTO-03.

Este documento sucede al inventario inicial, que conserva su valor histórico. No convierte una identificación documental en una ficha publicada ni un cierre de carga en un cierre editorial.

## Base real y protección

- Main al preflight: `2c751d493189fd9640f4f7dc29935efeaf5892a4`; incorpora la regla global de breadcrumbs responsivos. Se ha integrado en la rama de Utrera sin conflictos. #1010 y #1000 siguen integradas.
- Producción: `dpl_5zqJGYYHEpZENYkcMNncTuh5N4PV`, READY sobre ese SHA, aliases hilocofrade.es y www.hilocofrade.es. No se ha repetido medición de runtime en este corte.
- Supabase: ACTIVE_HEALTHY, 17 migraciones. La consulta directa conserva las tres Hermandades de Utrera: Jesús, Vera-Cruz y Consolación. Ninguna tiene tipos vacíos.
- Se revalidan por UUID Angustias, Dolores, el Paso de Angustias y De Profundis. El Paso de Angustias permanece **review en producción**, pero ya tiene texto candidato y fuentes para el manifiesto. Reutilización no implica publicación automática.
- En esta continuación: **0 escrituras productivas, 0 staging, 0 DDL y 0 cambios RLS**. QA web/SEO del candidato: no ejecutado, porque aún no hay candidato aplicado. El READY de plataforma no sustituye ese QA.

## Alcance que debe cerrarse de verdad

El inventario inicial de once corporaciones cubre el núcleo penitencial y sacramental. El directorio institucional F23 identifica además tres corporaciones de Gloria: Consolación, Rocío y Fátima. Consolación ya existe y se preserva. **Rocío y Fátima ya tienen modelo documental propio**, con sede, identidad, historia, patrimonio y Salidas en el [suplemento](./evidence/modelado-utrera-2026-09-27/gloria-and-closure.json). No quedan absorbidas por las quince Salidas de Semana Santa.

**Universo institucional identificado: 14 corporaciones distintas**, con las repeticiones por cortejo eliminadas. Es una base de revisión, no la afirmación de que todo el término municipal y todas sus asociaciones estén censados. ADMA, otras asociaciones y pedanías requieren una decisión explícita de inclusión o exclusión según su naturaleza y municipio; no se convierten automáticamente en Hermandades.

Fátima conserva su sede en la capilla; el punto y hora de partida de su romería de 2026 se dejan sin fijar por divergencias entre F25/F32/F33. No se confunde con Fátima de Los Molares. El Rocío conserva San José como sede canónica; su casa-hermandad no la sustituye. El Simpecado y las carretas se modelan como patrimonio, sin inventar una talla local de la Virgen del Rocío de Almonte. La partida del 19 de mayo sí tiene crónica posterior F31; el regreso anunciado del 28 no hereda ese `held`.

El [suplemento de Pasos y alcance](./evidence/modelado-utrera-2026-09-27/steps-and-scope.json) registra siete decisiones. ADMA es una asociación propia según Salesianos; el Resucitado también tiene identidad asociativa diferenciada y su Vía Lucis vespertino del 5 de abril está acreditado. Ninguno se fusiona con Estudiantes o Cautivo ni recibe automáticamente el tipo Agrupación Parroquial. Su encaje en el directorio sigue pendiente.

**Pinzón pertenece al alcance de Utrera y no puede desaparecer del cierre.** El acuerdo municipal F50 identifica a la Hermandad de las Marismas como destinataria de la romería. La salida productiva `9210cbbb-e66e-415e-9f50-ca18ccb97d93` se conserva, sin duplicarla ni cambiar su estado por haber pasado la fecha. Sigue sin Hermandad enlazada: hay que conciliar la identidad canónica antes del manifiesto. El mismo acuerdo identifica Asociación Romeros de Trajano y Parroquia Nuestra Señora de las Veredas para Guadalema; no se sustituyen esos nombres por otras asociaciones sin prueba. El Torbiscal conserva una revisión censal abierta. El Palmar de Troya queda fuera por su segregación como municipio en 2018, aunque no tenga fila propia en el catálogo actual.

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
| Fechas pasadas | Estado explícito por evento | 18 Salidas modeladas: 6 con evidencia posterior vinculada, 12 conservadas como anuncios históricos |

La identidad del soporte S20 es una conclusión documental, no una inspección física. Las configuraciones se describirán en el Paso y en las notas de sus participaciones/posiciones; no como fases históricas excluyentes que se sustituyen anualmente.

## Matriz de imágenes y composición

El [modelo base](./evidence/modelado-utrera-2026-09-27/model-review.json), el [suplemento de Gloria](./evidence/modelado-utrera-2026-09-27/gloria-and-closure.json) y el [suplemento de Pasos y alcance](./evidence/modelado-utrera-2026-09-27/steps-and-scope.json) forman el candidato vigente. Conservan 34 imágenes del programa, la Concepción de Los Milagros y Fátima, y añaden el Cristo de Santiago y la Inmaculada de su Sacramental: **38 imágenes identificadas**. Se mantienen 22 Pasos propuestos y 23 posiciones. Las dos nuevas imágenes tienen fuente primaria propia; no se enlazan automáticamente a los Pasos ni a la procesión eucarística.

**El bloque de perfiles candidatos de los 22 Pasos queda revisado.** Cada soporte dispone de descripción, fuentes y decisiones de fecha/autoría; los datos técnicos no contrastados se conservan nulos o como incertidumbres internas. No equivale a una ficha publicada ni a disponer de fotografía con derechos. Los veinte perfiles nuevos completan Angustias y Milagros. Se añaden once perfiles corporativos a los dos de Gloria: trece candidatos revisados; Consolación ya publicada se preserva.

Se han separado, entre otros, el palio actual de Veredas y su antecesor, la adquisición del Paso del Huerto y su hechura, los soportes de Columna de Aceituneros y Vera-Cruz, y las fechas de la urna, el Paso y la imagen del Yacente. La frase ambigua de F43 sobre el «palio» de Ángeles no atribuye el soporte a Juan Ventura ni lo fecha en 1996.

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

El suplemento de Gloria fija O10/O11/O12 y O16 como `held`, con F22/F31. El nuevo suplemento añade O08 y O14 mediante F46/F45: la estación de penitencia del Cautivo y la procesión eucarística de Santiago tienen crónicas específicas de su propia Hermandad. El resultado combinado es **6 `held` y 12 `announced`**. La ausencia de crónica no bloquea un manifiesto que mantenga ese estado prudente. No se certifican horas reales a partir de un horario previsto ni bandas de todo el cortejo a partir de una diana.

No se usa un balance general para resolver diferencias específicas de iconografía, fecha o naturaleza eucarística. Tampoco se heredan horas de entrada reales a partir del programa.

## Puertas pendientes, con resultado exigido

1. **Censo y alcance:** ejecutar las decisiones C01–C07: encaje de ADMA/Resucitado, identidad canónica de Marismas y cierre censal de El Torbiscal. No crear Hermandades por inferencia a partir de asociaciones o parroquias. La clasificación institucional de catorce no prueba exhaustividad municipal.
2. **Titulares adicionales:** cerrar la matriz de títulos secundarios frente a objetos físicos, sin crear una escultura solo porque aparezca en el título corporativo. Los 22 perfiles de Pasos ya están revisados y no siguen pendientes. Los datos técnicos desconocidos con justificación no se rellenan artificialmente.
3. **Ejecución:** deduplicación global final, UUIDs deterministas y manifiesto fila por fila. Después, preflight, snapshot, guard obligatorio de tipos para todas las Hermandades incluidas —también REUSE—, dry-run con ROLLBACK y cero residuos. Solo entonces Apply y QA público/SEO.

Por esas tres puertas, el modelo municipal completo **no está congelado** y no procede staging ni Apply. Concepción y la ausencia de crónicas dejan de figurar como bloqueos generales: se ha resuelto qué relaciones omitir y qué estados conservar. No es una falta de autorización.

## Qué significará cerrar Utrera

El informe final separará cuatro resultados: integridad de la carga, completitud editorial de las fichas, experiencia pública móvil/escritorio y descubrimiento SEO. Contará fichas revisadas y excepciones concretas, además de operaciones SQL. Los recursos visuales exigirán derechos; las ausencias justificadas quedarán visibles en el balance del cierre.

Después del cierre: **detener expansión municipal y completar fichas/secciones existentes por grupos acotados**. No abrir automáticamente Marchena, Mairena, Sanlúcar, otro municipio ni HC-AUTO-03.

## Evidencia reproducible

- [Modelo base y fuentes F01–F28](./evidence/modelado-utrera-2026-09-27/model-review.json).
- [Refinamiento de Gloria, relaciones y fuentes F29–F40](./evidence/modelado-utrera-2026-09-27/gloria-and-closure.json).
- [Pasos, perfiles corporativos, titulares, alcance y fuentes F41–F51](./evidence/modelado-utrera-2026-09-27/steps-and-scope.json).
- [Preflight vigente de Pasos/alcance, consulta y snapshot](./evidence/modelado-utrera-2026-09-27/steps-scope-preflight.json); se conservan los anteriores `preflight.json` y `continuation-preflight.json`.
- [Validación estructural](./evidence/modelado-utrera-2026-09-27/validation.json).
- Reproducción offline: `node scripts/validate-utrera-model.mjs`; regresiones: `node --test tests/utrera-model-contract.test.js`. El mínimo editorial candidato pasa en los 38 perfiles evaluados (13 corporaciones, 22 Pasos y 3 nuevas imágenes con texto); **no equivale a QA de las 38 imágenes ni de fichas publicadas**.
- Suite completa en esta continuación: **1.312/1.312 pruebas, 0 fallos**, incluidas dieciocho específicas del modelo. No se ejecuta build ni QA web de un candidato productivo inexistente; no hay cambios de aplicación.
- Inventario y snapshot iniciales: `evidence/inventario-utrera-2026-09-27/`; preservados.

F13 es un artículo de **2008**, aunque la cabecera del sitio muestre una fecha actual. F21 es el boletín de **2026**. Las páginas completas o fotografías ajenas no se copian al repositorio: se conservan enlaces, hashes y decisiones documentales.
