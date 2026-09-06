# Certificación · Purísima de La Algaba · 6 de septiembre de 2026

## Decisión

**PURÍSIMA DE LA ALGABA → CERRADA Y CERTIFICADA · 93 % TÉCNICO · INDEXABLE · GRAFO NUCLEAR LIMPIO.**

La ficha parte de un 36 % técnico y se cierra al 93 %. El 7 % restante corresponde exclusivamente a la señal mecánica de música actual: no existe una fuente pública contemporánea que permita afirmar el acompañamiento de la procesión gloriosa de 2026. No se fuerza el 100 % con un contrato o continuidad no acreditados.

## Alcance

Cierre editorial sobre el modelo vigente, sin UX nueva, DDL, RLS, tablas ni arquitectura.

Se incorporan o revalidan:

- identidad oficial y nombre popular;
- reglas documentadas de 1870 y contexto devocional anterior;
- sede canónica estructurada en la Iglesia Parroquial de Nuestra Señora de las Nieves;
- residencia devocional habitual de la titular en la Ermita de San Salvador e Inmaculada Concepción, en El Aral;
- Purísima Concepción de María Coronada como titular publicada;
- autoría conservada como anónima y cronología en el siglo XVIII;
- paso de Gloria de la titular, documentado como paso de plata;
- tres cultos recurrentes documentados;
- Romería 2026 añadida al histórico de salidas;
- tres acontecimientos históricos principales;
- intervención de Antonio Castillo Lastrucci en 1929;
- acompañamientos históricos de la Asociación Musical de La Algaba en 2011 y 2017, modelados como evidencias puntuales y no como intervalo continuo;
- fuentes institucionales, de Hermandad y de prensa especializada en el nivel más específico disponible.

## Sede canónica y residencia de la imagen

No se confunden dos realidades distintas:

- **Sede canónica:** Iglesia Parroquial de Nuestra Señora de las Nieves, Plaza de España, 11.
- **Residencia devocional habitual:** Ermita de San Salvador e Inmaculada Concepción, barrio de El Aral.

Los traslados temporales de la titular con motivo de cultos, Romería o fiestas no modifican la sede canónica.

## Titular

**Purísima Concepción de María Coronada**

- iconografía: Inmaculada Concepción;
- tipo: imagen de vestir;
- cronología conservada: siglo XVIII;
- autoría: anónima;
- estado: existente;
- residencia devocional habitual: Ermita de El Aral;
- coronación canónica: 23 de mayo de 2004.

No se publica una autoría original alternativa sin evidencia unívoca.

## Intervención de 1929

Se estructura la intervención de **Antonio Castillo Lastrucci** tras el incendio accidental que afectó a rostro y manos. La fuente especializada basada en documentación parroquial respalda la intervención y repolicromía de las zonas dañadas en 1929.

No se reproduce como hecho la leyenda de un supuesto cambio de imagen.

## Paso

Se publica el **Paso de la Purísima Concepción de María Coronada** como Paso de Gloria y se relaciona con la titular.

Las crónicas contemporáneas consultadas permiten describirlo como paso de plata, pero no fijan con suficiente seguridad una autoría completa, fecha de ejecución ni número actual de costaleros. Esos huecos se conservan.

## Cultos

Se estructuran tres cultos recurrentes:

1. Misa de Romeros, previa a la salida anual hacia El Aral;
2. Fiesta de la Purísima, documentada tradicionalmente en el segundo domingo de Adviento;
3. Novena de rogativas, tradición documentada desde 1756 en el mes de febrero.

No se convierten horarios históricos en horarios actuales.

## Salidas

La ficha queda con cuatro salidas publicadas:

- Romería de la Purísima Concepción de María Coronada · 14 de junio de 2026;
- traslado a la Parroquia · 6 de septiembre de 2026;
- Procesión de Gloria · 27 de septiembre de 2026;
- Rosario de la Aurora · 4 de octubre de 2026.

La Romería 2026 conserva `event_status = announced`: el programa municipal fija fecha y hora, pero no se ha utilizado una crónica posterior de 2026 para elevarla artificialmente a `held`.

## Acontecimientos

Se estructuran y relacionan mediante `involves`:

- aprobación de las reglas documentadas · 11 de noviembre de 1870;
- primera Romería periódica documentada · 26 de mayo de 1935;
- Coronación Canónica · 23 de mayo de 2004.

La coronación se relaciona además directamente con la titular.

## Música · actualidad estricta

Se publican dos evidencias históricas puntuales de la **Asociación Musical de La Algaba**:

- 2011;
- 2017.

Ambas quedan `is_current = false` y cada año se modela de forma independiente. No se crea un intervalo 2011–2017 ni se proyecta su continuidad hasta 2026.

**Acompañamiento 2026: pendiente de confirmación.** La señal `music` de `brotherhood_completeness` permanece por ello en falso. Esta ausencia no impide el cierre documental y no debe rellenarse para perseguir el 100 %.

## Fuentes principales

- Pastoral de Hermandades y Cofradías de la Archidiócesis de Sevilla · ficha institucional de la Hermandad;
- Ayuntamiento de La Algaba · patrimonio y Ermita de El Aral;
- Ayuntamiento de La Algaba · Romería 2026;
- Hermandad de la Purísima · Historia;
- Hermandad de la Purísima · Datos históricos;
- Arte Sacro · investigación sobre la intervención de 1929;
- Arte Sacro · procesión 2021;
- Arte Sacro · acompañamientos documentados en 2011 y 2017;
- Programa de actos de septiembre y octubre de 2026 ya existente en producción.

## QA de producción

Conteos derivados tras el cierre:

- completitud técnica: **93 %**;
- titulares: **1**;
- pasos: **1**;
- cultos: **3**;
- salidas: **4**;
- acontecimientos históricos: **3**;
- intervenciones patrimoniales: **1**;
- periodos musicales históricos: **2**;
- acompañamientos actuales: **0**;
- enlaces de fuente relevantes comprobados: **14**.

Controles a cero:

- duplicados Hermandad → Imagen;
- duplicados Hermandad → Paso;
- cultos duplicados;
- slugs de salidas duplicados;
- acompañamientos musicales marcados falsamente como actuales;
- acontecimientos sin relación `involves` con la Hermandad.

## QA público

Ruta auditada: `https://hilocofrade.es/hermandades/purisima-de-la-algaba`

Resultado observado el 6 de septiembre de 2026:

- HTTP 200;
- canonical exacta;
- `robots = index, follow` y Googlebot `index, follow`;
- Open Graph y Twitter Card válidas;
- sede canónica visible;
- 1 titular visible;
- 1 paso visible;
- 4 salidas visibles;
- 3 cultos visibles;
- histórico musical 2011/2017 visible y separado de actualidad;
- fuentes públicas visibles;
- 0 errores `error/fatal` de runtime localizados en la ruta durante la hora auditada;
- producción `dpl_9wuat8fUYXEzF6cTDe95oXA2Uhk7`, `READY`, sobre `main = 5ef706e6db8f63abef340f159d10480b975b6263` durante la validación funcional.

## Deuda legítima que no bloquea

- acompañamiento musical de 2026 hasta disponer de confirmación pública contemporánea;
- fotografía de cabecera, titular y paso con procedencia y derechos trazables;
- autoría y cronología completas del paso hasta disponer de fuente unívoca;
- otras piezas menores de patrimonio todavía no suficientemente documentadas.

## Límites respetados

- sin nuevo DDL;
- sin nuevas tablas;
- sin RLS;
- sin arquitectura nueva;
- sin cambios de UX;
- sin excepciones por slug;
- #492 permanece abierta y aislada.

## Cierre

La ausencia de música vigente confirmada no es una deuda que deba resolverse inventando continuidad. Con la identidad, sede, titular, paso, cultos, salidas, acontecimientos, intervención histórica, fuentes y QA público validados, **Purísima de La Algaba queda cerrada y certificada al 93 % técnico**. Solo debe reabrirse ante nueva información verificable, una regresión real o una confirmación contemporánea que cambie materialmente su estado.
