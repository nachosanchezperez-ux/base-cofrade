# HC-020 · Agenda Cofrade

## Decisión

Agenda Cofrade se convierte en la entrada pública común para responder a preguntas temporales como «qué ver hoy», «qué ver este fin de semana» y «qué sale», sin duplicar los datos canónicos de cada acto.

El centro agrega procesiones, traslados, rosarios públicos, besamanos y besapiés ya documentados, y conserva sus relaciones con fichas, calendarios, Hermandades y Fuentes. Igualás y ensayos permanecen accesibles como calendario especializado relacionado, pero no compiten en la cronología principal de interés general.

## Alcance de rosarios

Se muestran exclusivamente rosarios que recorren la vía pública presididos por una imagen o un Simpecado. Quedan fuera los cultos interiores y cualquier acto llamado rosario que no responda a ese criterio editorial.

Las modalidades visibles son:

- Rosario de la Aurora.
- Rosario matutino.
- Rosario vespertino.
- Rosario público cuando la fuente no permite precisar una modalidad.
- Carácter extraordinario como atributo adicional, no como franja horaria.

No existe la modalidad «Rosario nocturno»: la hora del acto se expresa en su horario documentado.

## Contrato técnico y editorial

- La selección parte únicamente de `outings.outing_type` y exige `status = published`; no se infiere por coincidencias en títulos o descripciones.
- La lectura pública usa el cliente anónimo sin sesión y respeta RLS.
- Las Hermandades o Bandas no publicadas pueden nombrarse, pero no generan enlaces a fichas privadas o incompletas.
- La portada permite separar próximos y archivo, además de Sevilla capital y provincia.
- La cronología común permite consultar hoy, el fin de semana y próximos actos, y filtrar por procesiones, traslados, rosarios, besamanos y besapiés, además de por territorio.
- Agenda Cofrade, Extraordinarias, Glorias e Igualás y ensayos comparten una navegación persistente y recíproca, tanto en sus directorios como en las fichas individuales; cada calendario marca su sección activa y permite saltar directamente a los otros tres sin volver a la portada.
- Las fichas de actos exponen relaciones directas con su Hermandad, localidad, Bandas o Pasos ya documentados, el calendario de origen y la agenda de la Hermandad; estas conexiones reutilizan datos existentes y no añaden consultas relacionales pesadas por ficha.
- Las fichas de Hermandad agregan sus próximas citas públicas de Agenda Cofrade, Glorias, Extraordinarias e Igualás y ensayos en una sección única, manteniendo después los módulos especializados como archivo y detalle.
- «Qué ver hoy» devuelve todos los actos del día; la cabecera no selecciona una única cita como protagonista.
- El archivo queda como consulta secundaria y no compite con las tres preguntas temporales principales.
- Los estados ordinarios anunciados no se repiten visualmente en cada tarjeta; solo se destaca una excepción relevante, como una cancelación.
- Una misma salida no se duplica: cuando un rosario tiene carácter extraordinario prevalece su clasificación como rosario y lo extraordinario queda como atributo.
- Besamanos y besapiés parten de `cults.cult_type` y de sus `cult_occurrences` publicadas; cada registro enlaza con el módulo de Cultos de su Hermandad.
- Procesiones y traslados conservan el vínculo al calendario de origen y todas las tarjetas enlazan a la Hermandad cuando su ficha es pública.
- Cada salida con `slug` obtiene una URL canónica bajo `/agenda-cofrade/rosarios/`, metadatos sociales y datos estructurados `Event`.
- El sitemap incluye la portada y las fichas públicas de rosarios.
- No se introduce DDL, migración, cambio RLS ni copia paralela de datos.

## Evolución prevista

La misma entrada podrá incorporar viacrucis públicos con el mismo contrato relacional. Los filtros «hoy» y «este fin de semana» se construyen sobre fechas estructuradas, no sobre páginas editoriales manuales.

## Estado

**IMPLEMENTADA** en su primera entrega pública de rosarios y ampliada con navegación común entre los cuatro calendarios públicos.
