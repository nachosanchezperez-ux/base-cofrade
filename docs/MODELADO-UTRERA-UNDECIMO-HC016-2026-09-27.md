# Utrera · conciliación del modelo y puerta de ejecución · HC-016

**Corte:** 27/09/2026, Europe/Madrid. **Estado: EN MODELADO; NO-GO a Apply.**

La orden posterior a Morón sitúa Utrera como próximo macrolote y establece que, después, se detenga la expansión municipal para completar las fichas y secciones existentes. Se retoma la PR #1009; no se vuelve a cargar Morón ni se toca HC-AUTO-03.

Este documento sucede al inventario inicial, que conserva su valor histórico. No convierte una identificación documental en una ficha publicada ni un cierre de carga en un cierre editorial.

## Base real y protección

- Main al preflight: `88fa02ffac5745ab9a8f2df59ab6a3b962210463` (#1010 integrada; #1000 también integrada).
- Producción: `dpl_BvJa4CNTdVs3it9Q54tbCSA5xx5j`, READY sobre ese SHA, aliases hilocofrade.es y www.hilocofrade.es.
- Supabase: ACTIVE_HEALTHY, 17 migraciones. La consulta directa conserva las tres Hermandades de Utrera: Jesús, Vera-Cruz y Consolación. Ninguna tiene tipos vacíos.
- Se revalidan por UUID Angustias, Dolores, el Paso de Angustias y De Profundis. El Paso de Angustias permanece **review**. Reutilización no implica publicar automáticamente un perfil incompleto.
- En esta continuación: **0 escrituras productivas, 0 staging, 0 DDL y 0 cambios RLS**. QA web/SEO del candidato: no ejecutado, porque aún no hay candidato aplicado. El READY de plataforma no sustituye ese QA.

## Alcance que debe cerrarse de verdad

El inventario inicial de once corporaciones cubre el núcleo penitencial y sacramental. El directorio institucional F23 identifica además tres corporaciones de Gloria: Consolación, Rocío y Fátima. Consolación ya existe y se preserva. Rocío y Fátima deben conciliarse y modelarse para aspirar a un cierre municipal; no quedan cubiertas por las quince Salidas de Semana Santa.

**Universo institucional identificado: 14 corporaciones distintas**, con las repeticiones por cortejo eliminadas. Es una base de revisión, no la afirmación de que todo el término municipal y todas sus asociaciones estén censados. ADMA, otras asociaciones y pedanías requieren una decisión explícita de inclusión o exclusión según su naturaleza y municipio; no se convierten automáticamente en Hermandades.

F24 acredita la condición de Gloria de Fátima y separa sus antecedentes de 1959, primera romería de 1966 y erección como Hermandad en 1994. F25 acredita actividad en 2026 y un programa de romería de un día, distinto del itinerario histórico de fin de semana: no copiar el horario antiguo como vigente. F26 confirma identidad y recorrido anunciado del Rocío en 2026, con salida y regreso distintos. Ninguno de esos anuncios basta por sí mismo para declarar `held`.

## Decisiones resueltas

| Cuestión | Decisión documental | Salvaguarda |
|---|---|---|
| Dolores / Soledad | Un Paso S20 con dos configuraciones y dos posiciones anuales | F13 dice expresamente mismo soporte; F21 p. 18 describe el paso singular y sus mantos. Son 22 soportes propuestos y 23 posiciones, no dos Dolorosas ni dos Pasos creados por la jornada |
| De Profundis | REUSE `e4884d0e-204e-408c-955e-b4c639de92c9` | Conciliación por director Sergio Asián, repertorio y vinculación a Los Negritos; no solo homonimia |
| Música de Milagros | Grupo vocal con acompañamiento instrumental documentado para 2026 | F14 y F22; no silencio, no inventar otro conjunto llamado «trío de capilla», no extender el acuerdo a 2027 |
| Trinidad | Penitencia | F17; el origen rosariano no acredita por sí solo una clasificación Gloria adicional |
| Columna de Vera-Cruz | Autoría desconocida con atribuciones alternativas | F19 distingue Roldán/Ruiz Gijón; no escoger una como autoría cierta |
| Figuras de Vera-Cruz | Conjunto de cinco, con excepción de autoría | Dos sayones, dos romanos y un sanedrita. F19 exceptúa un romano posterior; no adjudicar a los cinco la misma fecha/autor |

La identidad del soporte S20 es una conclusión documental, no una inspección física. Las configuraciones se describirán en el Paso y en las notas de sus participaciones/posiciones; no como fases históricas excluyentes que se sustituyen anualmente.

## Matriz de imágenes y composición

El [modelo estructurado](./evidence/modelado-utrera-2026-09-27/model-review.json) relaciona las 34 imágenes del programa con 22 soportes, las 23 posiciones de cortejo y sus fuentes. Añade una **35.ª imagen identificada: María Santísima de la Concepción de Los Milagros**, cuya existencia y titularidad física confirma F20. No se afirma que las 35 estén acreditadas en los cortejos de 2026.

- La Concepción es una talla del XVIII atribuida a Cristóbal Ramos. F11 la sitúa en el paso; F01 y F28 solo enumeran al Crucifijo. La omisión no prueba ausencia, pero tampoco permite dar por cerrada la relación procesional. Se separa la imagen confirmada de la relación pendiente.
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

No se usa un balance general para resolver diferencias específicas de iconografía, fecha o naturaleza eucarística. Tampoco se heredan horas de entrada reales a partir del programa.

## Puertas pendientes, con resultado exigido

1. **Censo y alcance:** incorporar la revisión de Rocío y Fátima, preservar Consolación y resolver la frontera de asociaciones/pedanías. Resultado: universo municipal explícito, sin presentar once corporaciones como todo Utrera.
2. **Fichas completas para esta edición:** terminar la matriz corporativa y patrimonial de cada candidata; revisar los titulares físicos adicionales. Resolver el mínimo editorial del Paso de Angustias antes de publicarlo. Los datos desconocidos con justificación no se rellenan artificialmente.
3. **Relación de la Concepción:** verificar su presencia/configuración en el cortejo de 2026 antes de generar la relación al Paso o a la Salida. Su existencia como titular ya está acreditada.
4. **Salidas y música:** evidencia posterior por evento para `held`; anuncio y realización separados. No crear periodos indefinidos a partir de un programa anual.
5. **Ejecución:** deduplicación final, UUIDs deterministas y manifiesto fila por fila. Después, preflight, snapshot, guard obligatorio de tipos para todas las Hermandades incluidas —también REUSE—, dry-run con ROLLBACK y cero residuos. Solo entonces Apply y QA público/SEO.

Por esas puertas, el modelo municipal completo **no está congelado** y no procede staging ni Apply. No es una falta de autorización: faltan evidencias y conciliaciones que hagan seguro y editorialmente completo el candidato.

## Qué significará cerrar Utrera

El informe final separará cuatro resultados: integridad de la carga, completitud editorial de las fichas, experiencia pública móvil/escritorio y descubrimiento SEO. Contará fichas revisadas y excepciones concretas, además de operaciones SQL. Los recursos visuales exigirán derechos; las ausencias justificadas quedarán visibles en el balance del cierre.

Después del cierre: **detener expansión municipal y completar fichas/secciones existentes por grupos acotados**. No abrir automáticamente Marchena, Mairena, Sanlúcar, otro municipio ni HC-AUTO-03.

## Evidencia reproducible

- [Modelo y fuentes F01–F28](./evidence/modelado-utrera-2026-09-27/model-review.json).
- [Preflight productivo de esta continuación](./evidence/modelado-utrera-2026-09-27/preflight.json).
- [Validación estructural](./evidence/modelado-utrera-2026-09-27/validation.json).
- Inventario y snapshot iniciales: `evidence/inventario-utrera-2026-09-27/`; preservados.

F13 es un artículo de **2008**, aunque la cabecera del sitio muestre una fecha actual. F21 es el boletín de **2026**. Las páginas completas o fotografías ajenas no se copian al repositorio: se conservan enlaces, hashes y decisiones documentales.
