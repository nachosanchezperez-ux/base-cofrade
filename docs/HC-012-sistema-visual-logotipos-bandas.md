# HC-012 · Sistema visual de logotipos de Bandas

## Contexto

El Directorio y las fichas de Bandas habían acumulado tratamientos visuales distintos para determinados logotipos. Algunos recursos se mostraban sin contenedor, otros usaban `full bleed`, otros heredaban fondos específicos por formación y La Puebla del Río y Maestro Tejera dependían de sustituciones CSS por `slug` para utilizar sus versiones transparentes.

Durante la validación visual se confirmó además que no todos los recursos gráficos tienen la misma naturaleza: algunos son marcas transparentes y otros incorporan un fondo de identidad que debe integrarse con la caja sin romper el sistema general.

## Decisión

Adoptar un único sistema de caja para todos los logotipos de Bandas, actuales y futuros.

En el Directorio de Bandas, todo logotipo debe conservar:

- la misma caja y dimensiones disponibles;
- el mismo `border-radius`;
- centrado en ambos ejes;
- ausencia de deformaciones;
- ausencia de recortes del símbolo;
- una presentación coherente en escritorio y móvil;
- ausencia de selectores CSS específicos por `slug`.

El comportamiento por defecto es `contained`: fondo suave con un matiz del color principal de la Banda, `object-fit: contain` y padding interior común. La referencia visual son Las Cigarreras, Escolanía Salesiana María Auxiliadora y Carmen de Salteras. Maestro Tejera y la Banda Municipal de Música de La Puebla del Río siguen este criterio, conservando su color de identidad únicamente como matiz y evitando fondos cerrados o demasiado saturados.

Cuando el propio recurso gráfico incorpora un fondo que forma parte de su presentación, puede utilizarse el modo `integrated`: se mantiene exactamente la misma caja exterior, pero el fondo de identidad se prolonga hasta los bordes de la pastilla y el recurso no añade padding. La Banda del Sol, Sangre de San Benito y la Banda de Música Nuestra Señora de la Soledad de Cantillana son los casos de validación iniciales. En Soledad se conserva el escudo a color completo aportado como referencia visual.

La transparencia pertenece al archivo gráfico, no al contenedor. Un SVG, PNG o WebP transparente se sigue mostrando dentro de la caja común de identidad.

La ruta del recurso gráfico activo debe almacenarse como dato (`bands.logo_path`). No se utilizará CSS para sustituir un logotipo por otro. Cuando un recurso necesite limpieza de fondo, se corregirá o sustituirá el archivo y se actualizará el dato.

Los modos de presentación se expresan como metadatos consumidos por el componente común. No se permiten selectores CSS por nombre de Banda o `slug`.

## Motivo

Unifica el Directorio como sistema de diseño, elimina deuda basada en excepciones visuales dispersas y permite integrar correctamente recursos de distinta naturaleza sin multiplicar componentes ni reglas CSS particulares.

## Impacto

- PRODUCT: todas las marcas se perciben como parte del mismo sistema visual, manteniendo a la vez su identidad.
- TECH: desaparecen overrides CSS por `slug` y conjuntos de `full bleed`; el comportamiento vive en el componente común mediante modos explícitos.
- DATA: `bands.logo_path` identifica el recurso que realmente debe presentarse; la transparencia sigue siendo una propiedad del archivo.
- UX: mejora la lectura de la cuadrícula y evita logos recortados, deformados o visualmente aislados.
- SEO: sin nuevas URLs ni cambios semánticos.
- RENDIMIENTO: se reutilizan recursos existentes y `next/image`; no se añade carga de red adicional.

## Riesgos

Algunos archivos pueden contener márgenes internos o fondos raster que no coincidan exactamente con los colores documentados de la Banda. Esos casos deben resolverse preferentemente mejorando el recurso gráfico y no acumulando reglas especiales.

## Estado

**APROBADA / VIGENTE**
