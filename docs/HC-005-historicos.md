# HC-005 · Históricos

**Estado:** IMPLEMENTADA  
**Fecha de cierre:** 22/08/2026  
**Ámbito:** modelo temporal y presentación pública de Hilo Cofrade  

## Decisión

Hilo Cofrade debe conservar la evolución histórica de sus entidades y relaciones sin sobrescribir el pasado cuando cambia el presente.

El estado vigente y el histórico son capas distintas del mismo conocimiento. Una relación, fase o intervención que deja de estar vigente no se elimina ni se reutiliza como si siguiera siendo actual: permanece documentada con su periodo temporal y se presenta como antecedente histórico.

Esta regla se aplica de forma transversal a los datos con evolución temporal, entre ellos acompañamientos musicales, fases de pasos e intervenciones patrimoniales.

## Principio estructural

**El presente no sustituye al pasado.**

Cuando una realidad cambia, Hilo Cofrade debe poder responder tanto a "qué ocurre ahora" como a "qué ocurrió antes" sin mezclar ambos estados.

Por tanto:

- una relación vigente puede tener inicio y, cuando proceda, final;
- una relación finalizada pasa a histórico sin perderse;
- una fase anterior de un paso se conserva aunque exista una posterior;
- una intervención patrimonial permanece documentada como hecho histórico;
- los históricos no deben contaminar módulos que representan exclusivamente relaciones actuales.

## Criterios de cierre

HC-005 se considera implementada al cumplirse conjuntamente estos criterios:

1. Los datos temporales relevantes pueden conservar periodos o fechas sin sobrescribir registros anteriores.
2. La interfaz distingue de forma explícita entre información vigente e histórica cuando ambas conviven.
3. Un registro que finaliza su vigencia deja de aparecer como actual sin desaparecer del histórico.
4. Las relaciones históricas no se utilizan como si fueran relaciones vigentes en la navegación relacional o en los resúmenes de situación actual.
5. Las fases e intervenciones se modelan como acontecimientos acumulativos y fechados, no como un único campo mutable que borra versiones anteriores.
6. La incorporación futura de más históricos puede realizarse como carga editorial sin rediseñar el modelo ni reabrir esta decisión.

## Reglas temporales fijadas

### Acompañamientos musicales

Los acompañamientos mantienen su periodo de vigencia. El sistema separa los contratos actuales de los históricos y, cuando un contrato alcanza su año final, deja de pertenecer a la temporada siguiente sin perderse.

La lógica está centralizada en `lib/bands/accompaniments.js` mediante `partitionAccompanimentsBySeason()`.

El contrato queda cubierto por `test/band-accompaniments.test.mjs`, que verifica expresamente:

- que un acompañamiento finalizado se retira de la temporada siguiente;
- que se incorpora al conjunto histórico;
- que permanece vigente durante su último año documentado.

Caso de control: un acompañamiento con `yearTo = 2026` sigue siendo actual en 2026 y pasa a histórico en 2027.

### Pasos

La evolución material o formal de un paso se conserva mediante fases históricas fechadas (`step_phases`).

Una nueva fase no debe sustituir destructivamente a una anterior. El valor enciclopédico está precisamente en poder reconstruir la evolución del paso a lo largo del tiempo.

### Patrimonio e intervenciones

Las actuaciones patrimoniales se conservan como registros históricos independientes (`heritage_updates` y relaciones asociadas), con fechas y autorías cuando están documentadas.

Una restauración, reforma, ejecución o modificación posterior no elimina las anteriores.

## Consecuencias para la interfaz

Los módulos que describen el presente deben priorizar únicamente relaciones vigentes.

Los históricos deben mostrarse en su contexto propio —cronología, etapas anteriores, acompañamientos históricos o intervenciones— y nunca utilizarse para hacer parecer vigente una relación ya finalizada.

Esta distinción también se aplica a **Tira del hilo**: una relación histórica puede ser navegable cuando resulte útil, pero no debe presentarse con la misma semántica que un vínculo actual.

## Alcance editorial

El cierre de HC-005 **no significa que Hilo Cofrade tenga ya cargado todo el histórico de todas las Hermandades, pasos, imágenes o bandas**.

Significa que la arquitectura ya permite incorporarlo correctamente y que existe una regla estable para distinguir pasado y presente.

La ampliación de datos históricos forma parte del trabajo editorial continuo y no requiere reabrir HC-005 mientras se respete este contrato temporal.

## Implementación relacionada

- `lib/bands/accompaniments.js` · partición por vigencia de acompañamientos.
- `test/band-accompaniments.test.mjs` · contrato automatizado de transición actual → histórico.
- `step_phases` · conservación de fases sucesivas de pasos.
- `heritage_updates` · conservación de intervenciones patrimoniales.
- HC-008 · la navegación relacional distingue acompañamientos vigentes e históricos.
- HC-013 · el patrimonio musical relacional hereda esta separación temporal.

## Base de datos

El cierre formal de HC-005 no requiere una nueva migración.

Las estructuras necesarias para representar vigencia, fases e intervenciones ya existen en el modelo actual. Este cierre documenta y fija como contrato de producto el comportamiento que la aplicación ya aplica.

## Regla de no regresión

Cualquier funcionalidad futura que maneje información cambiante en el tiempo debe preservar el histórico cuando este tenga valor enciclopédico.

No se deberá resolver una actualización temporal sobrescribiendo un dato histórico relevante si el modelo permite conservar ambos estados.

Si una nueva entidad temporal requiere una estructura adicional, deberá seguir el mismo principio: **periodo documentado, separación entre vigencia e histórico y conservación del antecedente**.
