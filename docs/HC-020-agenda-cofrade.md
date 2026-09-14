# HC-020 · Agenda Cofrade

## Decisión

Agenda Cofrade se convierte en la entrada pública común para responder a preguntas temporales como «qué ver hoy», «qué ver este fin de semana» y «qué sale», sin duplicar los datos canónicos de cada acto.

La primera entrega pública agrega los rosarios ya documentados en `outings` y conserva fichas propias para fecha, horario, recorrido, acompañamiento y Fuentes.

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
- Cada salida con `slug` obtiene una URL canónica bajo `/agenda-cofrade/rosarios/`, metadatos sociales y datos estructurados `Event`.
- El sitemap incluye la portada y las fichas públicas de rosarios.
- No se introduce DDL, migración, cambio RLS ni copia paralela de datos.

## Evolución prevista

La misma entrada podrá incorporar extraordinarias, Glorias, viacrucis, besamanos y besapiés. Los filtros «hoy» y «este fin de semana» se construirán sobre fechas estructuradas, no sobre páginas editoriales manuales.

## Estado

**IMPLEMENTADA** en su primera entrega pública de rosarios.
