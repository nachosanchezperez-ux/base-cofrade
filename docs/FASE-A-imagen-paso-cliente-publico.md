# Fase A · Fichas públicas de Imagen y Paso

Estado: EN VALIDACIÓN

## Objetivo

Separar las consultas propias de las fichas públicas de Imagen y Paso del cliente Supabase ligado a cookies/sesión.

## Alcance

Se migra `lib/supabase/public-entity-pages.js` a `createPublicClient()` para:

- entidad publicada;
- datos de Imagen;
- autorías;
- intervenciones;
- Fuentes;
- relaciones Imagen ↔ Paso;
- datos de Paso;
- acompañamiento musical actual del Paso;
- nombres públicos de Bandas.

## Auditoría RLS

Las tablas consumidas directamente por este loader tienen RLS activa y política pública de lectura:

`entities`, `source_links`, `sources`, `brotherhood_images`, `brotherhood_steps`, `image_authorships`, `entity_relations`, `heritage_interventions`, `images`, `image_steps`, `steps`, `music_accompaniment_periods`, `band_names`.

## Límite deliberado

La ficha de Imagen/Paso sigue resolviendo la Hermandad relacionada mediante `getHermandadPageBySlug()`.

Ese loader pertenece a `lib/supabase/brotherhoods.js` y mantiene por ahora su propio cliente cookie-aware porque acaba de incorporar la capa `applyBrotherhoodAuthority` y está siendo tratado como un frente independiente.

Por tanto este PR elimina la dependencia de sesión de las consultas propias de Imagen/Paso, pero **no declara todavía la cadena completa Imagen/Paso → Hermandad como totalmente libre de cookies**.

## Fuera de alcance

- `brotherhoods.js`;
- Cabeceras 2.0 y cualquier componente visual;
- Panel y autoridad editorial;
- datos o migraciones;
- caché, ISR, TTL y tags.

## Criterio de aceptación

1. build y CI verdes;
2. preview READY;
3. smoke de al menos una Imagen y un Paso publicados;
4. relaciones con Hermandad, autorías, restauraciones y acompañamiento siguen presentes;
5. ninguna caché persistente se activa accidentalmente.

## Siguiente paso

Auditar y migrar `brotherhoods.js` en un PR independiente una vez estabilizada la nueva capa de autoridad editorial.
