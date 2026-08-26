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

La paleta se considera **metadato de presentación de la ficha**. No debe generar por sí sola una sección pública, una tarjeta de datos ni un editor específico en el Panel. Su finalidad es adaptar de forma coherente hero, navegación, acentos, fondos, identidad y otros elementos visuales de cada Banda.

## Motivo

Permite representar identidades cromáticas de más de dos colores sin texto libre, sin crear excepciones por Banda y sin romper el front existente, manteniendo la complejidad de presentación fuera de la experiencia de edición ordinaria.

## Impacto

- DATA: paletas multicolor estructuradas y publicables como metadatos de presentación.
- TECH: tabla `band_colors` y vista `published_band_colors` con RLS equivalente al patrón de Hermandades.
- PRODUCT: las fichas consumen la paleta para personalizar su identidad visual; los colores no se muestran como bloque informativo independiente.
- PANEL: no se crea editor específico de paletas; no forma parte del flujo editorial habitual.
- SEO: sin nuevas URLs ni bloques de contenido creados únicamente por la paleta.

## Riesgos

Los valores HEX pueden ser aproximaciones de interfaz cuando no exista código institucional documentado. Debe indicarse expresamente en `notes`.

## Estado

**APROBADA / VIGENTE**
