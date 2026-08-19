# HC-010 · Paletas cromáticas estructuradas de Bandas

## Contexto

Las fichas de Banda disponían únicamente de `primary_color` y `secondary_color`, suficientes para dos colores de interfaz pero insuficientes para formaciones cuya identidad documentada incluye tres o más colores.

El caso de validación es la Banda Municipal de Música de La Puebla del Río, cuyos colores aportados al proyecto son azul, rojo, dorado y blanco.

## Decisión

Crear `band_colors` como colección estructurada de colores de Banda, siguiendo el patrón ya utilizado por `brotherhood_colors`.

Cada color puede registrar:

- nombre;
- hexadecimal de interfaz opcional;
- rol (`primary`, `secondary`, `accent`, `identity`);
- orden;
- notas de procedencia;
- estado editorial.

Se mantienen `bands.primary_color` y `bands.secondary_color` como campos de compatibilidad y consumo rápido de interfaz. No constituyen la fuente completa de la paleta cuando existen registros en `band_colors`.

## Motivo

Permite representar identidades cromáticas de más de dos colores sin texto libre, sin crear excepciones por Banda y sin romper el front existente.

## Impacto

- DATA: paletas multicolor estructuradas y publicables.
- TECH: nueva tabla `band_colors` y vista `published_band_colors` con RLS equivalente al patrón de Hermandades.
- PRODUCT: las fichas pueden mostrar la paleta completa y utilizar un color de acento adicional.
- SEO: sin nuevas URLs; no genera páginas de bajo valor.

## Riesgos

Los valores HEX pueden ser aproximaciones de interfaz cuando no exista código institucional documentado. Debe indicarse expresamente en `notes`.

## Estado

**APROBADA / VIGENTE**
