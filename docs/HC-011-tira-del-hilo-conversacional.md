# HC-011 · Tira del hilo como buscador conversacional

## Contexto

El buscador actual de Hilo Cofrade funciona como localizador de entidades: recibe texto, encuentra coincidencias y dirige a fichas públicas. El crecimiento del grafo hace que ese patrón se quede corto para preguntas que requieren cruzar relaciones.

Ejemplos naturales de uso son:

- «¿Qué pasos dirige Antonio Santiago?»
- «¿Qué relación tiene Refúgiame con San Bernardo y Las Cigarreras?»
- «¿Qué imágenes de La Cena son anteriores al siglo XX?»
- «¿Qué bandas acompañan a hermandades de gloria en Cantillana?»

El usuario no debería necesitar conocer nombres de tablas, tipos de relación ni la estructura interna de la base de datos para obtener una respuesta.

## Decisión

Evolucionar **Tira del hilo** hacia una experiencia conversacional inspirada en el modelo de interacción de ChatGPT, pero fundamentada exclusivamente en el conocimiento documentado de Hilo Cofrade.

La interfaz distinguirá dos comportamientos compatibles:

1. **Búsqueda directa de entidad.** Una consulta como «El Baratillo» prioriza sugerencias y acceso inmediato a la ficha correspondiente.
2. **Pregunta sobre el grafo.** Una consulta formulada como pregunta genera una respuesta redactada a partir de entidades, atributos y relaciones publicadas, acompañada de las rutas y fichas que sustentan la respuesta.

La conversación podrá mantener contexto para preguntas sucesivas, por ejemplo: «¿Qué pasos dirige Antonio Santiago?» → «¿Y cuáles de esos salen el Miércoles Santo?».

## Principios de producto

- **Grounded by design.** La respuesta se construye con datos publicados de Hilo Cofrade; no se completa un hueco con conocimiento no documentado.
- **Ausencia explícita.** Cuando el grafo no contiene la respuesta, se indica que el dato todavía no está documentado.
- **Respuesta + recorrido.** La respuesta textual debe mostrar las entidades relacionadas y permitir continuar el hilo.
- **Lenguaje cofrade natural.** Debe entender expresiones como palio, misterio, gloria, «qué banda va detrás», «quién hizo el paso» o «quién lo toca».
- **Trazabilidad.** Siempre que sea posible, las afirmaciones se vinculan con las fichas, relaciones y fuentes públicas disponibles.
- **Compatibilidad con búsqueda clásica.** El modo conversacional no elimina el acceso rápido a una entidad conocida.

## Arquitectura prevista

La experiencia debe apoyarse en una capa de consulta del grafo capaz de resolver, como mínimo:

- entidades por nombre, alias y tipo;
- relaciones directas y recorridos de varios saltos;
- filtros por fecha, localidad, jornada, tipo y estado vigente/histórico;
- respuesta estructurada con entidades de soporte;
- contexto de conversación limitado y explícito;
- registro de consultas sin resultado para detectar huecos de documentación.

El modelo generativo redacta y organiza la respuesta, pero la recuperación y validación de datos pertenecen a Hilo Cofrade.

## Impacto

- PRODUCT: Tira del hilo pasa de buscador a interfaz principal de consulta de la enciclopedia.
- DATA: aumenta la importancia de relaciones explícitas, alias, fechas y estados históricos.
- TECH: será necesaria una capa de retrieval/consulta del grafo y un endpoint conversacional con respuestas estructuradas.
- UX: la caja del hero evoluciona hacia una entrada amplia de pregunta, con sugerencias y continuidad conversacional.
- PANEL/DATA QUALITY: las preguntas sin respuesta se convierten en señal útil para priorizar documentación.
- SEO: las respuestas conversacionales no generan automáticamente URLs indexables; las entidades canónicas continúan siendo las fichas públicas.

## Fases

1. **Cobertura del grafo y buscador universal:** Marchas y Agentes deben ser recuperables aunque aún no tengan directorio propio.
2. **Pregunta de un salto:** resolver consultas directas entidad → relación → entidad.
3. **Pregunta multirrelacional:** combinar filtros y recorridos de varios saltos.
4. **Conversación contextual:** permitir repreguntas manteniendo el conjunto de entidades relevante.
5. **Observabilidad editorial:** registrar huecos, consultas fallidas y relaciones más demandadas.

## Estado

**APROBADA / PLANIFICADA**
