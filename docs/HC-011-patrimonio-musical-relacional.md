# HC-011 · Patrimonio musical como relación independiente

## Contexto

Las fichas de Hermandad pueden reunir composiciones dedicadas a la corporación o a sus titulares, bandas que acompañan actualmente a sus pasos y grabaciones realizadas por formaciones concretas.

Los casos de El Baratillo y San Benito demuestran que estas relaciones no son equivalentes. Una marcha puede formar parte del patrimonio musical de una Hermandad aunque la banda que la estrenó o grabó no sea la que la acompaña actualmente, y una banda actual no debe quedar asociada automáticamente a todas las composiciones del repertorio.

## Decisión

El patrimonio musical dedicado se modela mediante entidades `Marcha` y relaciones de dedicatoria estructuradas (`march_dedications`) hacia la Hermandad o, cuando la fuente lo documente de forma inequívoca, hacia un titular concreto.

Se mantienen separadas tres relaciones semánticas:

- **dedicación**: determina que una composición forma parte del patrimonio musical relacionado con una Hermandad o titular;
- **acompañamiento musical**: expresa qué formación acompaña a un paso o posición procesional en un periodo determinado;
- **estreno, grabación o discografía**: conecta una Marcha con la banda y el registro sonoro concretos cuando esa relación está documentada.

La presencia de una formación como acompañamiento actual puede utilizarse como contexto de navegación del repertorio de su mismo tipo musical, pero no crea por sí sola una relación individual Marcha ↔ Banda.

Las plataformas de escucha como Spotify o YouTube se consideran metadatos de reproducción y descubrimiento. No sustituyen a una fuente documental de autoría, dedicatoria, datación o estreno.

Las composiciones que no sean propiamente marchas procesionales —por ejemplo motetes, piezas de capilla, coplas, plegarias o himnos fuera de ese concepto— no deben forzarse dentro de `Marcha`. Se incorporarán cuando el modelo disponga de una entidad musical suficientemente general o de una solución equivalente validada por DATA.

## Motivo

Evita confundir patrimonio, repertorio, contrato musical y discografía; permite navegar desde la Hermandad hacia Marcha, autor, titular, banda y grabación sin crear relaciones falsas; y mantiene el modelo preparado para ampliar el patrimonio musical más allá de las marchas procesionales.

## Impacto

- DATA: dedicatorias, acompañamientos y registros sonoros permanecen como relaciones independientes y documentables.
- TECH: los loaders pueden reutilizar las mismas Marchas y enriquecerlas con autorías, bandas y grabaciones sin duplicar entidades.
- PRODUCT: la ficha muestra primero el acompañamiento actual y después el patrimonio musical, con despliegue progresivo cuando el repertorio es amplio.
- GROWTH: las relaciones reales generan enlazado interno útil sin crear páginas o asociaciones artificiales.
- EDITORIAL: no se infiere un titular, estreno o intérprete concreto cuando la fuente solo acredita pertenencia al archivo musical de la Hermandad.

## Riesgos

El modelo actual sigue siendo insuficiente para repertorios musicales que incluyan obras no clasificables como Marcha. Hasta resolverlo, esas piezas deben quedar documentadas como pendientes de modelado y no convertirse en registros incorrectos.

## Estado

**APROBADA / VIGENTE**
