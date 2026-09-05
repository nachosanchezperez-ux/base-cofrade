# Certificación · Virgen del Valle de Écija

**Fecha:** 5 de septiembre de 2026  
**Base de trabajo:** `main = 60dd7ad715a1132ba9fdc90436c86a345437a9e4`  
**Entidad:** `c68b76d4-411e-4bcb-8c86-4535ed4bd984` · `virgen-del-valle-ecija`  
**Régimen:** FIRST EDITION FREEZE · #492 aislada

## Diagnóstico de partida

La ficha estaba publicada con aproximadamente un 30 % técnico. Conservaba escudo, fecha/ciclo procesional, una salida 2026 y una Fuente institucional, pero carecía de sede canónica, titular estructurado, paso, cultos, acontecimientos y un grafo musical consolidado.

## Estado de cierre

Los diez indicadores de `brotherhood_completeness_signals` quedan en `true`: identidad, escudo, sede canónica, día de salida, imágenes, pasos, cultos, salidas, música y Fuentes.

**Completitud técnica: 30 % → 100 %.**

El 100 % técnico no implica que todos los posibles datos histórico-artísticos estén disponibles. Se mantienen como huecos legítimos los datos no publicados o no suficientemente acreditados.

## Identidad y sede

- Nombre: **Hermandad de Nuestra Señora del Valle Coronada**.
- Nombre popular: **Virgen del Valle de Écija**.
- Titular: Patrona y Alcaldesa Perpetua de Écija.
- Documentación histórica: testimonio al menos desde **1401** y primeras reglas conocidas de **1664**.
- Salida principal: **8 de septiembre**.
- Sede canónica: **Iglesia Parroquial Mayor de Santa Cruz**, Plaza Virgen del Valle, 5, Écija.
- Web: `https://virgendelvalle.es/`.
- Tipo: Gloria.

La historia diferencia los hechos documentados de la tradición legendaria sobre el origen de la Imagen. No se convierte la tradición atribuida a San Lucas en autoría o datación canónica.

## Titular

Se estructura **Nuestra Señora del Valle Coronada** como Imagen publicada y titular de la Hermandad, con residencia actual en Santa Cruz.

No se fija autoría ni cronología material exacta por falta de una Fuente histórico-artística suficientemente firme en este lote.

## Paso

Se estructura el **Paso procesional de Nuestra Señora del Valle Coronada** como paso de Gloria vigente y se relaciona con la Hermandad, la Imagen y el acompañamiento musical actual.

La autoría, cronología material y ficha física detallada permanecen pendientes de documentación patrimonial específica.

## Cultos

Tres ciclos principales:

1. Devoto besamanos a finales de agosto.
2. Solemne Novena del 30 de agosto al 7 de septiembre.
3. Solemne Función del 8 de septiembre.

Ocurrencias 2026:

- besamanos / traslado al altar de cultos · 28/08 · `held`;
- Novena · 30/08–07/09 · `announced`;
- Función · 08/09 · `announced`.

El modelo actual no dispone de estado `ongoing`; por ello la Novena, en curso a fecha de corte, no se falsifica como `held`.

## Procesión patronal 2026

Se reutiliza la salida existente `ddb20bf2-4bf5-4976-b8e1-c8ec1b94e04e`.

- Fecha: **8 de septiembre de 2026**.
- Hora: **19:30**.
- Estado: `announced`.
- Origen/destino: Santa Cruz.
- Motivo: Fiestas Patronales de Nuestra Señora del Valle.
- Particularidad 2026: ampliación hacia el **barrio del Carmen**.

Itinerario documentado:

Plaza Nuestra Señora del Valle → Ramón Freire Gálvez → José Canalejas → Puerta Palma → La Calzada → Plaza de Colón → Carmen → Nuestra Señora de la Soledad → San Juan Bosco → Plaza Puerta Nuestra Señora de los Remedios → Puerta Cerrada → Del Conde → Plaza de España (El Salón) → San Francisco → Francisco Mateo Díaz González → Mas y Prat → Santa Cruz → Plaza Nuestra Señora del Valle → templo.

También se crea la serie anual del 8 de septiembre sin duplicar la ocurrencia 2026.

## Música

La **Banda de Música AMUECI** queda vinculada al paso y a la salida de 2026.

Periodo canónico:

- 2024–2026;
- `is_current = true` en el corte de 2026;
- posición: tras Nuestra Señora del Valle Coronada;
- salida: Procesión de Gloria.

Durante el QA se detectó un periodo previo redundante limitado a 2026. Se trasladó su Fuente al periodo contractual 2024–2026 y se eliminó el duplicado. Resultado final: **un único periodo actual**.

## Patrimonio musical

Se incorpora la marcha **María del Valle**:

- compositor: **Cristóbal López Gándara**;
- año: **2026**;
- dedicada a Nuestra Señora del Valle;
- presentada/interpretada por AMUECI dentro de los actos de las Fiestas Patronales de 2026.

El compositor reutiliza su agente publicado existente.

## Acontecimientos

Cuatro hitos históricos estructurados y relacionados mediante `involves`:

- **1584** · voto municipal para asistir perpetuamente a la fiesta de la Virgen;
- **1664** · primeras reglas conocidas;
- **1929** · bendición de la capilla de la Virgen en Santa Cruz;
- **8/09/1999** · Coronación Canónica, presidida por Fray Carlos Amigo Vallejo.

## Colores

La propia Hermandad identifica **celeste y blanco** como colores de la Virgen.

- Celeste · principal · `#66B8D4` como aproximación de interfaz.
- Blanco · secundario · `#FFFFFF`.

## Fuentes principales

- Hermandad de Nuestra Señora del Valle · historia institucional;
- Hermandad de Nuestra Señora del Valle · sede actual;
- ÉcijaWeb · cultos patronales 2026;
- ÉcijaWeb · recorrido 2026 por el barrio del Carmen;
- ArteSacro · acuerdo AMUECI 2024–2026;
- Ayuntamiento de Écija · presentación de la marcha *María del Valle*;
- ÉcijaWeb · Coronación Canónica;
- Turismo de la Provincia de Sevilla · fiestas patronales 2026;
- aportación directa 2026 ya existente, reconciliada con el periodo musical canónico.

## QA

- indicadores técnicos: 10/10;
- titular: 1;
- paso: 1;
- cultos: 3;
- ocurrencias 2026: 3;
- acontecimientos: 4;
- acompañamientos 2026: 1;
- periodos musicales actuales: 1;
- marchas dedicadas: 1;
- colores: 2;
- slugs duplicados del lote: 0;
- relaciones de Imagen duplicadas: 0;
- relaciones de Paso duplicadas: 0;
- acontecimientos sin `involves`: 0;
- salidas futuras marcadas `held`: 0;
- duplicidad musical AMUECI: reconciliada a 0;
- ficha pública: HTTP 200;
- SEO: `index, follow` + canonical correcto;
- runtime: peticiones de `/hermandades/virgen-del-valle-ecija` con HTTP 200 y sin error asociado.

## Deuda legítima

- autoría y datación histórico-artística exacta de la Imagen;
- vestidor actual, mientras no exista Fuente verificable;
- autoría, cronología y descripción física profunda del paso;
- fotografías de titular, paso y cabecera con procedencia/derechos trazables;
- ampliación del patrimonio material cuando existan Fuentes suficientemente específicas.

Estas ausencias no invalidan el cierre documental ni deben rellenarse para perseguir artificialmente completitud.

## Restricciones

**DDL 0 · tablas nuevas 0 · migraciones 0 · RLS 0 · UX nueva 0 · arquitectura 0.**

#492 permanece aislada y no ha interferido en el cierre editorial.