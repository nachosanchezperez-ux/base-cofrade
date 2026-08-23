# Protocolo UI · Tarjetas de directorio

## Objetivo

Las tarjetas de resultados de los directorios públicos de Hilo Cofrade deben comportarse como una misma familia visual, independientemente de si representan una Hermandad, Imagen, Paso, Banda u otra entidad futura.

Este protocolo evita que cada directorio resuelva de forma distinta el ancho de la miniatura, el espacio del texto o la acción de entrada. El problema que lo origina es especialmente visible en móvil: una miniatura más ancha que su columna puede invadir el nombre y la información de la entidad.

## Alcance

Se aplica a las **tarjetas de entidad dentro de listados/directorios públicos**:

- Hermandades.
- Imágenes.
- Pasos.
- Bandas.
- Cualquier nuevo directorio de entidades que adopte este patrón.

No se aplica a gateways de categorías, heroes, tarjetas editoriales de Home, cronologías, bloques de patrimonio ni resultados de Tira del hilo.

## Contrato geométrico

Toda tarjeta se organiza siempre en tres columnas:

`MEDIA | CONTENIDO | ACCIÓN`

### Escritorio y tablet

- columna de media: **82 px**;
- recurso visual: **72 × 92 px**;
- separación principal: **17 px**;
- padding: **18 px vertical / 20 px horizontal**;
- la columna central usa siempre `minmax(0, 1fr)`;
- la acción ocupa únicamente el ancho que necesite.

### Móvil (≤ 620 px)

- columna de media: **64 px**;
- recurso visual: **58 × 76 px**;
- separación principal: **12 px**;
- padding: **14 px vertical / 13 px horizontal**;
- la miniatura nunca puede superar el ancho de su columna;
- el contenido debe envolver dentro de la columna central sin situarse debajo ni detrás de la imagen.

Estas medidas viven en `components/DirectoryCardContract.module.css`. Los directorios no deben volver a declarar una geometría incompatible de manera local.

## Reglas de media

1. La media principal **nunca se posiciona de forma absoluta** sobre el contenido.
2. El ancho real de la media nunca puede ser mayor que su columna.
3. Fotografías de Imágenes y Pasos usan `object-fit: cover`.
4. Escudos y logotipos usan `object-fit: contain` cuando sea necesario.
5. El fallback/monograma ocupa exactamente el mismo espacio que una media real.
6. Una entidad sin imagen no modifica el alineado de las demás tarjetas.

## Reglas de texto

1. El nombre de entidad es el primer nivel visual y debe poder ocupar varias líneas.
2. Ningún nombre, sede, autoría, localidad, título de paso o nombre oficial puede producir scroll horizontal.
3. Las columnas de contenido deben tener `min-width: 0`.
4. Los textos largos deben envolver con seguridad; no se permite `white-space: nowrap` en contenido variable.
5. Se pueden truncar textos secundarios únicamente cuando exista acceso inmediato a la ficha completa.
6. No se reduce el tamaño de fuente como solución a un desbordamiento estructural.

## Reglas de acción

- Toda la tarjeta es clicable.
- La flecha permanece en su tercera columna y nunca se superpone al texto.
- La acción debe conservar el mismo eje vertical en todas las entidades.
- No se añaden botones secundarios dentro de la tarjeta de directorio.

## Jerarquía visual

La familia usa una jerarquía común:

1. Nombre de entidad.
2. Tipo / fecha / jornada o contexto equivalente.
3. Hermandad, sede, municipio o relación principal.
4. Autoría, taller, imágenes relacionadas u otros datos secundarios.
5. Acción de entrada.

Las diferencias semánticas entre entidades se expresan mediante contenido y tratamiento de la media, no alterando la geometría base.

## Decoración

- No introducir líneas, pestañas o pseudo-elementos decorativos en una tarjeta de entidad sin una función consistente para toda la familia.
- El rojo de Hilo Cofrade se reserva para información jerárquica o de estado, no para adornos arbitrarios.
- Las variaciones de Banda (color corporativo, logo integrado) pueden cambiar superficie o `object-fit`, pero no la estructura de columnas.

## Breakpoints de QA obligatorios

Cada modificación de una tarjeta de directorio debe comprobarse como mínimo en:

- 320 px;
- 375 px;
- 390 px;
- 430 px;
- 768 px;
- ≥ 1024 px.

Y con casos de estrés:

- nombre de 2–3 líneas;
- autoría extensa;
- localidad + sede largas;
- entidad sin media;
- logo vertical y logo horizontal;
- texto con fecha y tipología;
- tarjeta consecutiva con y sin imagen.

## Criterios de aceptación

Una tarjeta cumple el protocolo si:

- no existe scroll horizontal;
- media, texto y flecha no se solapan;
- el nombre comienza siempre dentro de su columna;
- todas las tarjetas conservan el mismo eje y ritmo visual;
- el fallback tiene el mismo footprint que la imagen real;
- el comportamiento es equivalente en Hermandades, Imágenes, Pasos y Bandas;
- la ficha sigue siendo accesible tocando cualquier zona útil de la tarjeta.

## Regla de mantenimiento

Cualquier cambio futuro de geometría debe hacerse primero en `DirectoryCardContract.module.css` y después validarse transversalmente. No duplicar breakpoints ni crear excepciones por entidad salvo que exista una necesidad semántica documentada.
