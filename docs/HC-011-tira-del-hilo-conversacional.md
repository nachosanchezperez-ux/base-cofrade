# HC-011 · Tira del hilo como buscador conversacional

## Contexto

El buscador inicial de Hilo Cofrade funcionaba como localizador de entidades: recibía texto, encontraba coincidencias y dirigía a fichas públicas. El crecimiento del grafo hace que ese patrón se quede corto para preguntas que requieren cruzar relaciones.

Ejemplos naturales de uso son:

- «¿Qué pasos dirige Antonio Santiago?»
- «¿Qué relación tiene Refúgiame con San Bernardo y Las Cigarreras?»
- «¿Qué imágenes de La Cena son anteriores al siglo XX?»
- «¿Qué bandas acompañan a hermandades de gloria en Cantillana?»

El usuario no debería necesitar conocer nombres de tablas, tipos de relación ni la estructura interna de la base de datos para obtener una respuesta.

## Decisión

Evolucionar **Tira del hilo** hacia una experiencia conversacional inspirada en el modelo de interacción de ChatGPT, pero fundamentada exclusivamente en el conocimiento documentado de Hilo Cofrade.

La interfaz distingue dos comportamientos compatibles:

1. **Búsqueda directa de entidad.** Una consulta como «El Baratillo» prioriza sugerencias y acceso inmediato a la ficha correspondiente.
2. **Pregunta sobre el grafo.** Una consulta formulada como pregunta genera una respuesta a partir de entidades, atributos y relaciones publicadas, acompañada de las rutas y fichas que sustentan la respuesta.

La conversación mantiene contexto básico para preguntas sucesivas. Los recorridos multirrelacionales complejos se incorporarán progresivamente sobre la misma capa.

## Principios de producto

- **Grounded by design.** La respuesta se construye con datos publicados de Hilo Cofrade; no se completa un hueco con conocimiento no documentado.
- **Ausencia explícita.** Cuando el grafo no contiene la respuesta, se indica que el dato todavía no está documentado.
- **Respuesta + recorrido.** La respuesta textual muestra las entidades relacionadas y permite continuar el hilo.
- **Lenguaje cofrade natural.** Debe entender expresiones como palio, misterio, gloria, «qué banda va detrás», «quién hizo el paso» o «quién lo toca».
- **Trazabilidad.** Siempre que sea posible, las afirmaciones se vinculan con las fichas, relaciones y fuentes públicas disponibles.
- **Compatibilidad con búsqueda clásica.** El modo conversacional no elimina el acceso rápido a una entidad conocida.

## Arquitectura

La experiencia se apoya en una capa de consulta del grafo capaz de resolver:

- entidades por nombre y tipo;
- relaciones directas publicadas;
- filtros y recorridos que se ampliarán por fases;
- respuesta estructurada con entidades de soporte;
- contexto de conversación limitado y explícito;
- ausencia segura cuando una relación no puede verificarse.

La primera implementación es deliberadamente determinista: la recuperación y la redacción de respuestas simples proceden del grafo de Hilo Cofrade. Una futura capa generativa podrá mejorar comprensión y redacción, pero nunca sustituirá la validación de los datos.

## Impacto

- PRODUCT: Tira del hilo pasa de buscador a interfaz principal de consulta de la enciclopedia.
- DATA: aumenta la importancia de relaciones explícitas, alias, fechas y estados históricos.
- TECH: existe un endpoint conversacional y una capa server-side de resolución del grafo.
- UX: la caja del hero funciona como una entrada de pregunta, con sugerencias, respuestas y continuidad conversacional.
- PANEL/DATA QUALITY: las preguntas sin respuesta podrán convertirse en señal útil para priorizar documentación.
- SEO: las respuestas conversacionales no generan automáticamente URLs indexables; las entidades canónicas continúan siendo las fichas públicas.

## Fases

1. **Cobertura del grafo y buscador universal — IMPLEMENTADA.** Marchas, Agentes, Acontecimientos, Patrimonio y Advocaciones son recuperables junto a las cuatro entidades con directorio.
2. **Pregunta de un salto — IMPLEMENTADA INICIALMENTE.** Autorías de marchas, pasos y capataces, acompañamientos musicales, titulares y pasos de Hermandad.
3. **Pregunta multirrelacional — PENDIENTE.** Combinar filtros y recorridos de varios saltos.
4. **Conversación contextual — IMPLEMENTADA PARCIALMENTE.** Se conserva el sujeto de repreguntas simples y un nombre explícito nuevo prevalece sobre el contexto anterior.
5. **Observabilidad editorial — PENDIENTE.** Registrar huecos, consultas fallidas y relaciones más demandadas.

## Estado

**EN IMPLEMENTACIÓN · FASES 1–2 OPERATIVAS · FASE 4 PARCIAL**
