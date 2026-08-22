# HC-006 · Acompañamientos musicales

**Estado:** IMPLEMENTADA  
**Fecha de cierre:** 22/08/2026  
**Ámbito:** modelo temporal, salidas concretas y presentación relacional de los acompañamientos musicales

## Decisión

Hilo Cofrade modela los acompañamientos musicales como relaciones documentadas entre Hermandades, Bandas, Pasos y, cuando corresponde, salidas concretas.

El acompañamiento musical no es un atributo simple de una Hermandad ni de un Paso y tampoco implica pertenencia institucional. Debe conservar contexto temporal, destino procesional y posición dentro del cortejo cuando la información está disponible.

La solución canónica se organiza en dos capas complementarias: una capa longitudinal de periodos estables y una capa de asignaciones para una salida concreta.

## Modelo canónico en dos capas

### 1. Periodos estables de acompañamiento

La tabla canónica para responder preguntas como “¿qué banda acompaña actualmente?” o “¿qué banda acompañó anteriormente?” es:

`music_accompaniment_periods`

Cada periodo relaciona como mínimo:

- una Hermandad;
- una Banda;
- una posición procesional;
- un estado de publicación y vigencia.

Y puede documentar además:

- un Paso concreto;
- tipo de salida;
- año o fecha de inicio;
- año o fecha de finalización;
- localidad pública y municipio;
- notas y fuentes.

Esta capa representa relaciones relativamente estables a lo largo de una o varias temporadas.

### 2. Música de una salida concreta

Cuando una procesión necesita describir la realidad exacta de ese día —varias bandas, distintas posiciones, tramos, alternancias o rotaciones— se utilizan:

- `outing_music_positions`;
- `outing_music_assignments`.

`outing_music_positions` define la posición musical dentro de una salida y permite vincularla, cuando procede, a un Paso concreto. Los códigos admitidos cubren apertura, antes del paso, después del paso, entre pasos, cierre y otras posiciones documentadas.

`outing_music_assignments` asigna una o varias Bandas a cada posición y permite expresar participación completa, por tramos, alternancia, rotación u otros modos, además de conservar el orden de las bandas y los límites de cada segmento.

La vista `outing_music_details` expone este modelo respetando las políticas de publicación.

## Regla de precedencia

Las dos capas no compiten entre sí.

- `music_accompaniment_periods` ofrece el contexto longitudinal o de temporada.
- `outing_music_positions` + `outing_music_assignments` ofrecen la verdad específica de una salida concreta cuando existen datos para esa procesión.

Una salida puede, por tanto, apartarse puntualmente del acompañamiento habitual sin modificar ni falsear el periodo estable.

## Reglas semánticas fijadas

### Acompañamiento no equivale a vínculo institucional

Que una Banda acompañe a una Hermandad o Paso no significa que pertenezca a esa corporación.

La aplicación debe distinguir siempre entre:

- vínculo institucional;
- acompañamiento musical vigente;
- acompañamiento musical histórico.

Si una Banda mantiene a la vez un vínculo institucional y un acompañamiento vigente, ambos hechos pueden coexistir, pero no deben confundirse semánticamente.

### Vigente no equivale a histórico

Los periodos finalizados permanecen conservados como históricos, conforme a HC-005.

Un acompañamiento con `year_to = 2026` continúa siendo vigente durante 2026 y deja de considerarse actual en 2027, pasando al conjunto histórico sin desaparecer.

La lógica está centralizada en `lib/bands/accompaniments.js` mediante `partitionAccompanimentsBySeason()` y está cubierta por `test/band-accompaniments.test.mjs`.

### Hermandad o Paso no implican automáticamente una Banda

No se debe inferir acompañamiento musical por el mero hecho de que una Imagen pertenezca a una Hermandad o que un Paso esté vinculado a ella.

La relación musical debe existir de forma explícita en el modelo.

### Una salida puede tener varias Bandas

No se debe reducir una procesión a un único campo genérico de “banda”.

Una misma salida puede tener:

- una Banda abriendo el cortejo y otra tras el Paso;
- diferentes Bandas en varios Pasos;
- varias Bandas ocupando una misma posición en distintos segmentos;
- alternancia o rotación documentada.

El modelo de salida concreta debe preservar esa estructura.

## Presentación pública y navegación

Las fichas de Banda separan acompañamientos vigentes e históricos y utilizan la vigencia temporal para determinar cada conjunto.

Las fichas de Hermandad pueden mostrar el acompañamiento actual como relación procesional independiente del vínculo institucional.

En **Tira del hilo**, los acompañamientos actuales pueden aparecer como relaciones contextuales. Un histórico no debe presentarse con semántica de relación vigente.

Las salidas que disponen de posiciones y asignaciones concretas pueden construir su briefing musical desde esos datos, respetando posición, Banda, orden y modo de participación.

## Auditoría de datos al cierre

Sobre el estado de producción auditado el 22/08/2026:

- `music_accompaniment_periods`: **80** periodos publicados;
- vigentes: **76**;
- históricos: **4**;
- periodos vigentes ya caducados: **0**;
- históricos abiertos o futuros: **0**;
- acompañamientos vigentes sin Banda: **0**;
- acompañamientos vigentes sin Hermandad: **0**;
- duplicados vigentes sobre la misma combinación semántica: **0**;
- referencias con tipo de entidad incorrecto: **0**.

La capa de salidas concretas cuenta ya con posiciones y asignaciones reales y no es únicamente una estructura teórica.

### Casos de control

**Aznalcázar · Extraordinaria del Rosario Doloroso de Santiago · 08/03/2026**

- Banda Municipal de Bollullos: abriendo el cortejo.
- Banda de la Oliva: tras el paso.

**Moriles · Procesión Extraordinaria de María Santísima de los Dolores · 11/10/2026**

- Las Cigarreras: tras el paso.

Estos casos verifican que una salida puede documentar posiciones musicales concretas sin reducir la información a un único acompañamiento genérico.

## Implementación relacionada

- `lib/supabase/bands.js` · lectura y separación de periodos vigentes e históricos.
- `lib/bands/accompaniments.js` · reglas de vigencia, agrupación y ordenación.
- `test/band-accompaniments.test.mjs` · contrato automatizado temporal.
- `components/BrotherhoodRelationalExtras.js` · acompañamiento actual separado del vínculo institucional.
- `lib/supabase/outing-briefing.js` · lectura de posiciones y asignaciones de una salida concreta.
- `music_accompaniment_periods` · capa longitudinal.
- `outing_music_positions` y `outing_music_assignments` · capa de salida concreta.
- HC-005 · conservación del histórico.
- HC-008 · semántica relacional y distinción institucional/procesional.

## Tabla histórica `accompaniments`

La tabla `accompaniments`, creada en una etapa anterior del modelo, permanece actualmente sin registros y **no es la vía canónica para nuevas cargas**.

No se elimina dentro de HC-006 para evitar introducir una migración destructiva innecesaria. Cualquier futura retirada deberá hacerse como mantenimiento de esquema independiente, después de confirmar que no existen consumidores residuales.

## Base de datos

El cierre formal de HC-006 no requiere una nueva migración.

Las estructuras necesarias ya existen y están operativas. HC-006 fija cuál es el modelo canónico y las reglas que deberán respetar nuevas cargas, interfaces y automatizaciones.

## Alcance editorial

El cierre de HC-006 no significa que estén cargados todos los acompañamientos históricos o actuales del ámbito editorial de Hilo Cofrade.

Significa que existe un contrato estable y escalable para incorporarlos sin rediseñar el modelo.

## Regla de no regresión

Cualquier funcionalidad futura que maneje acompañamientos musicales deberá:

1. registrar de forma explícita Hermandad y Banda;
2. vincular el Paso cuando esté documentado;
3. conservar el periodo temporal;
4. separar vigente de histórico;
5. no inferir pertenencia institucional a partir de un contrato musical;
6. utilizar posiciones y asignaciones de salida para describir procesiones concretas con varias Bandas o tramos;
7. evitar nuevas escrituras en la tabla legada `accompaniments` salvo decisión arquitectónica posterior.