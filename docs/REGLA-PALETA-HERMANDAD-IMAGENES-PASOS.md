# Paleta compartida: Hermandad → Imágenes y Pasos

Regla editorial y de producto establecida el 27 de septiembre de 2026.

Las páginas públicas de imágenes y pasos deben usar la misma paleta que la Hermandad relacionada que muestran en su cabecera. No se asignan ni se copian paletas independientes a cada imagen o paso.

## Contrato

- Fuente de datos: filas publicadas de `brotherhood_colors` de la Hermandad resuelta por la relación publicada existente.
- Los tres tipos de página emplean `loadPublishedBrotherhoodPalette` y `resolveBrotherhoodPalette`.
- Se heredan los cinco tokens: primario, secundario, claro, oscuro y sobreSecundario. Se conserva el color claro de identidad, incluso si no es blanco.
- Se mantienen las reglas existentes de acento y contraste de las Hermandades; no es un rediseño de sus colores corporativos.
- Sin paleta publicada: se conserva la paleta local de la Hermandad cuando existe; en otro caso se usa el mismo fallback de Hilo Cofrade. Una imagen o paso sin Hermandad mantiene el estilo general, sin atribuirle una pertenencia ficticia.
- Solo se consulta la paleta: no cargar la ficha completa de la Hermandad para obtener sus colores.
- Las cachés de imágenes y pasos incluyen `public-brotherhood-detail`, además de sus propias etiquetas, para propagar su invalidación. Se mantiene ISR de 900 segundos y se versionan las claves al desplegar esta corrección.
- No se modifican autorías, relaciones, textos, fotografías, agendas ni registros de colores en la base de datos.

## Regresión

`node --test tests/brotherhood-palette.test.mjs`

Cubre la Virgen de la Cabeza (verde, dorado y blanco), orden estable, prioridad sobre el fallback, blanco principal, superficie crema, paleta monocolor, falta de paleta, borradores, valores inválidos, cambio posterior de colores, errores de consulta, entidades locales y consumo compartido por las tres rutas.
