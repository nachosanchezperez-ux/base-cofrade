# HC-SEO-08 · Tipologías patrimoniales

Fecha: 2026-09-20

## Objetivo

Convertir las variantes editoriales de tipología de Imágenes y Pasos en categorías públicas estables, útiles y rastreables, sin modificar los datos históricos ni inventar clasificaciones para valores ambiguos.

## Taxonomía pública

### Imágenes

- Dolorosas.
- Crucificados.
- Nazarenos.
- Imágenes cristíferas.
- Imágenes de gloria.
- Imágenes secundarias.
- Santos.

### Pasos

- Pasos de palio.
- Pasos de misterio.
- Pasos de Cristo.
- Pasos de gloria.
- Custodias y pasos eucarísticos.
- Santos Entierros.
- Pasos alegóricos.

## Criterio editorial

- La categoría se calcula desde la tipología publicada, sin reescribir el registro original.
- Las reglas se aplican en orden y cada ficha pertenece a una única categoría pública.
- Solo se publica una ruta cuando reúne al menos tres fichas.
- Valores genéricos o ambiguos como `Titular`, `Imagen de vestir` y `Paso procesional` siguen disponibles en el directorio general, pero no generan una página temática.

## Superficies

- `/imagenes/tipo/[tipo]`.
- `/pasos/tipo/[tipo]`.
- Enlaces desde los directorios generales y desde cada ficha clasificable.
- Canonical, metadatos sociales, `BreadcrumbList` y `CollectionPage`.
- Inclusión automática en el sitemap.

## Validación prevista

- Pruebas unitarias de normalización, precedencia, umbral y filtrado.
- Suite completa con `npm test`.
- Compilación de producción con `npm run build`.
- Revisión de rutas representativas y sitemap en el preview.
