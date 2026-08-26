# Carril C · checkpoint de media · 2026-08-23

## Objetivo

Reducir la deuda multimedia de las entidades públicas de tipo **Imagen** y **Paso** reutilizando únicamente recursos que ya existen en Hilo Cofrade y cuya correspondencia con la entidad sea inequívoca.

Este corte no incorpora archivos externos, no descarga fotografías de terceros y no altera loaders, RLS, vistas, esquema, rutas ni componentes públicos.

## Baseline previo

Antes de esta pasada, la auditoría operativa registraba:

- 36 Imágenes publicadas: 12 con media y 24 sin media;
- 25 Pasos publicados: 8 con media y 17 sin media.

GitHub, Vercel y Supabase siguen siendo la fuente de verdad para los recuentos posteriores.

## Reglas aplicadas

Se han permitido únicamente tres clases de coincidencia:

1. **Slug canónico exacto y único**
   - el recurso todavía no estaba enlazado;
   - el documento del recurso contenía el slug exacto de la entidad, tolerando guiones y guiones bajos;
   - la coincidencia era única tanto desde la entidad como desde el recurso.

2. **Nombre canónico exacto y único**
   - igualdad tras normalizar mayúsculas, tildes, espacios y puntuación;
   - comparación contra título, nombre, texto alternativo o nombre de archivo del recurso;
   - la coincidencia era única en ambas direcciones.

3. **Reutilización relacional exacta**
   - el recurso ya pertenecía al pequeño grafo directo de la entidad: Hermandad, Imagen o Paso relacionado;
   - además, el propio recurso seguía identificando de forma exacta el slug o nombre canónico del sujeto;
   - no se ha utilizado una portada genérica de Hermandad como fotografía de un titular o de un Paso.

No se han aceptado coincidencias difusas, parciales, por semejanza semántica ni por proximidad dentro de una carpeta.

## Escritura y trazabilidad

Cada asociación creada:

- utiliza `entity_media`;
- mantiene la entidad canónica existente;
- marca el recurso como portada inicial de una entidad que carecía de media;
- incorpora una nota con el criterio concreto de asociación;
- genera una entrada en `audit_log` con actor `Hilo Orquestador · Carril C`.

No se han creado ni reemplazado IDs.

## Validaciones

La pasada comprueba que:

- no se creen dos enlaces nuevos para la misma entidad;
- un mismo activo no se reutilice accidentalmente en varias entidades nuevas;
- todos los destinos sean Imágenes o Pasos publicados;
- la relación multimedia conserve un tipo válido;
- el recurso enlazado exista realmente en `media_assets`.

Para accesibilidad, el texto alternativo solo se completa automáticamente cuando el recurso tiene un único sujeto público de tipo Imagen o Paso. El formato utilizado es `Fotografía de {nombre canónico}`.

No se inventan créditos, autores, licencias ni permisos de uso.

## Smoke público

Tras la escritura se revisan:

- `/imagenes`;
- `/pasos`;
- una ficha representativa de Imagen;
- una ficha representativa de Paso;
- errores `error` y `fatal` de producción.

La operación es de datos y no requiere un nuevo despliegue de aplicación.

## Deuda que permanece

Las entidades que continúen sin media quedan en una cola editorial manual. Para resolverlas será necesario uno de estos caminos:

- subir una fotografía propia o expresamente autorizada;
- incorporar un recurso oficial con crédito y permiso de uso documentados;
- reutilizar un archivo ya disponible solo después de confirmar manualmente su identidad.

No se recomienda hotlinking ni descargar y republicar imágenes de webs externas sin autorización.

## Frontera de coordinación

Este trabajo pertenece al **Carril C · contenido y enriquecimiento**.

Mientras Bandas o cualquier otra entidad esté bajo auditoría del Carril A, este checkpoint no autoriza cambios en:

- loaders públicos;
- contratos de datos;
- RLS;
- vistas o RPC;
- componentes compartidos;
- rutas públicas.

Cualquier carencia estructural detectada debe elevarse al Hilo Orquestador.
