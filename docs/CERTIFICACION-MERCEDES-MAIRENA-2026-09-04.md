# Certificación · Mercedes de Mairena del Aljarafe

**Fecha:** 4 de septiembre de 2026  
**Entidad:** `mercedes-mairena-del-aljarafe`  
**Régimen:** `FIRST EDITION FREEZE`  
**Alcance:** cierre editorial sobre el modelo vigente, sin DDL, nuevas tablas, cambios RLS, nueva arquitectura ni UX general.

## Resultado

**MERCEDES DE MAIRENA → 🟢 CERTIFICADA · 93 % · INDEXABLE · GRAFO CLEAN**

La ficha partía de un 14 % técnico y de una estructura mínima. El cierre consolida identidad, sede, historia, doble carácter Gloria/Sacramental, titular, tres configuraciones procesionales, cultos, salidas, música vigente e histórica, patrimonio, acontecimiento histórico, Fuentes y relaciones existentes.

El 7 % restante corresponde a la señal de escudo. Se conserva como hueco legítimo mientras no exista un recurso con derechos suficientemente trazables y calidad adecuada para incorporarlo.

## Identidad y sede

- Denominación: Real Hermandad Sacramental y Cofradía de Nuestra Señora de las Mercedes.
- Tipologías documentadas: Gloria y Sacramental.
- Sede canónica: Iglesia Parroquial de San Ildefonso, Plaza Blas Infante, s/n, Mairena del Aljarafe.
- Fundación documentada de la corporación mercedaria: siglo XVII.
- La antigua Hermandad Sacramental local fue fundada en 1864.
- La fusión con la Hermandad de las Mercedes fue acordada en 1975 y aprobada canónicamente por decreto de 3 de enero de 1977.

La tradición local que retrotrae el origen devocional a la conquista fernandina se conserva únicamente como tradición historiográfica. No se convierte en fecha fundacional probada.

## Titular

Queda publicado y relacionado:

- Nuestra Señora de las Mercedes.

La imagen conserva un núcleo gótico documentado en el siglo XIV y fue transformada posteriormente para su uso como imagen de vestir. La restauración de 1985 permitió reconocer ese núcleo antiguo. En 2013 se documentan trabajos de conservación por Manuel Carmona Martínez sobre la Virgen y el Niño.

No se fuerza una autoría no acreditada por una Fuente patrimonial superior.

## Pasos y configuraciones procesionales

Quedan publicados y relacionados tres nodos diferenciados:

1. Paso procesional de Nuestra Señora de las Mercedes · procesión gloriosa de septiembre.
2. Templete argénteo de Nuestra Señora de las Mercedes · salida vespertina del Corpus Christi.
3. Paso de la Custodia del Santísimo Sacramento de Mairena · procesión eucarística.

La separación entre el paso de septiembre y el templete del Corpus es deliberada: las Fuentes describen montajes procesionales distintos. Unificarlos artificialmente perdería información documental.

No se atribuyen autorías, cronologías técnicas o capataces sin evidencia suficiente.

## Cultos

Se documentan seis cultos recurrentes:

- Solemne Novena a Nuestra Señora de las Mercedes.
- Función Votiva de la festividad de Nuestra Señora de las Mercedes.
- Devota veneración a Nuestra Señora de las Mercedes.
- Solemne Función Principal de Instituto.
- Solemne Triduo Eucarístico del Corpus Christi.
- Jornaditas de María y José · 15–23 de diciembre.

Además, el calendario vigente de la Parroquia de San Ildefonso permite estructurar tres convocatorias exactas de septiembre de 2026:

- 12–20/09/2026 · Novena · 20:30 h.
- 24/09/2026 · Misa de la Virgen de las Mercedes · 20:00 h.
- 27/09/2026 · Función de la Hermandad de las Mercedes · 12:00 h.

Las ocurrencias anuales quedan relacionadas con el culto recurrente y con la Fuente parroquial vigente. El lector público continúa mostrando la regla cultual estable; no se introduce UX nueva para forzar la visualización de la ocurrencia anual.

## Salidas

Quedan publicadas:

- 07/06/2026 · Corpus Christi · salida de Nuestra Señora de las Mercedes a las 20:00 h. bajo templete argénteo.
- 27/09/2026 · Procesión gloriosa ordinaria de Nuestra Señora de las Mercedes · anunciada.

La actualidad del 4 de septiembre de 2026 confirma municipalmente que la procesión prevista para el 27 de septiembre se mantiene pese a las obras del casco antiguo.

Se conserva la fecha del 27 de septiembre, último domingo del mes, y se descarta una fuente comercial débil que situaba la procesión el 29 de septiembre por contradecir la actualidad validada.

## Música

La actualidad queda separada del histórico:

- **Vigente documentado:** Banda de Música María Santísima de la Victoria (Las Cigarreras) · tras Nuestra Señora de las Mercedes · Corpus Christi · 07/06/2026.
- **Histórico documentado:** la misma formación · procesión gloriosa de septiembre · 28/09/2025.

No se extrapola el acompañamiento de 2025 ni el del Corpus 2026 a la procesión gloriosa del 27/09/2026 sin una confirmación específica.

No existen cambios futuros marcados como actuales.

## Patrimonio

Se incorporan y relacionan tres piezas:

- Manto procesional de Nuestra Señora de las Mercedes · Esperanza Elena Caro.
- Custodia procesional del Santísimo Sacramento de Mairena · procedente de la antigua Hermandad Sacramental y conservada en uso.
- Saya bordada de Nuestra Señora de las Mercedes · Manuel Solano · 2018.

Las autorías del manto y de la saya quedan estructuradas mediante relaciones `author_of`. La custodia queda vinculada a su paso sacramental y el manto al paso glorioso de septiembre.

## Historia y acontecimientos

Se incorpora como hito estructurado:

- 03/01/1977 · aprobación canónica de la fusión sacramental de las Mercedes de Mairena.

Durante el QA se detectó que el acontecimiento existía en `events` y tenía `brotherhood_entity_id`, pero no aparecía en la sección Historia. La consulta común del lector incorpora los acontecimientos a través de la relación explícita `entity_relations → involves`.

Clasificación: **deuda editorial de relación**, no defecto del lector.

Se añadió la relación `involves` entre el acontecimiento y la Hermandad. La sección Historia pasó a renderizar correctamente sin modificar código, consulta ni presentación común.

## Fuentes

La ficha combina Fuentes de primer grado y Fuentes contextuales directamente pertinentes:

- directorio cofrade de ámbito diocesano;
- Registro de Entidades Religiosas del Ministerio de Justicia;
- Ayuntamiento de Mairena del Aljarafe;
- Parroquia de San Ildefonso · calendario de septiembre de 2026;
- archivo corporativo histórico de la Hermandad Sacramental de las Mercedes;
- documentación específica de la conservación de la imagen;
- convocatorias de cultos y Corpus;
- prensa local y cofrade para salidas, música y patrimonio.

Las Fuentes se enlazan por contexto —Hermandad, titular, culto, ocurrencia anual, salida, periodo musical, patrimonio o relación de autoría— para respetar la regla de #589 y evitar contaminación de segundo grado.

## Media

Se conserva la fotografía ya validada de la procesión del 27 de septiembre de 2026. Durante el cierre se normalizó el crédito de datos para evitar que el lector mostrase `Fotografía · Fotografía · Hermandad`; el valor queda en `Hermandad` y el lector sirve correctamente `Fotografía · Hermandad`.

No se incorporan nuevas fotografías de titular o pasos si no existe trazabilidad suficiente de derechos.

## SEO e indexabilidad

La ruta pública devuelve:

- HTTP 200;
- `robots: index, follow`;
- `googlebot: index, follow`;
- canonical correcta: `/hermandades/mercedes-mairena-del-aljarafe`;
- metadata descriptiva suficiente;
- JSON-LD de WebPage y Organización.

## QA de grafo y temporalidad

Validaciones realizadas:

- completitud: 93 %;
- identidad: positiva;
- sede: positiva;
- salida/día procesional: positiva;
- titular: positivo;
- pasos: positivos;
- cultos: positivos;
- salidas: positivas;
- música: positiva;
- Fuentes: positivas;
- escudo: única señal negativa;
- slugs duplicados: 0;
- Hermandad→Imagen huérfanas: 0;
- Hermandad→Paso huérfanas: 0;
- Imagen→Paso huérfanas: 0;
- periodos musicales huérfanos: 0;
- acompañamientos futuros marcados como actuales: 0.

## Actualidad de main durante el cierre

El frente comenzó sobre `main = 5b1bacf`. Durante la ejecución, `main` avanzó hasta `292daa7` mediante dos commits dedicados exclusivamente al tratamiento CSS responsive de fotografías en Salidas.

Se auditó el delta completo:

- no modifica Supabase;
- no modifica consultas de Hermandades;
- no modifica Fuentes;
- no modifica relaciones;
- no modifica criterios de completitud;
- no modifica SEO;
- no modifica temporalidad.

La ficha pública de Mercedes fue revalidada sobre el deployment asociado a `292daa7`, incluyendo el tratamiento responsive de su fotografía de la salida del 27 de septiembre.

Esta certificación y su rama parten de `292daa7`.

## Límites respetados

- DDL nuevo: 0.
- Tablas nuevas: 0.
- Migraciones estructurales: 0.
- Cambios RLS: 0.
- Nueva arquitectura: 0.
- UX general nueva: 0.
- Campos nuevos: 0.

## Deuda legítima

Permanece sin impedir la certificación:

- escudo y cabecera mientras no exista material con derechos suficientemente trazables;
- fotografía específica del titular y de los pasos mientras no exista material reutilizable con derechos claros;
- acompañamiento musical de la procesión gloriosa del 27/09/2026 mientras no exista confirmación específica fiable;
- autoría y cronología técnica detallada de los pasos y de la custodia donde las Fuentes disponibles no permiten precisarlas;
- autoría original de Nuestra Señora de las Mercedes;
- cualquier pretensión de convertir la tradición fernandina en fecha fundacional histórica sin evidencia documental superior;
- web/redes oficiales actuales de la corporación si no existe un canal contemporáneo verificable que deba incorporarse.

Estos huecos no justifican inferencias ni ampliaciones de modelo.