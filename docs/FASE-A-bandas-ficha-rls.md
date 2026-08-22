# Fase A · Ficha pública de Banda con cliente anónimo

Estado: EN VALIDACIÓN

## Objetivo

Migrar `getBandBySlug()` al cliente Supabase público anónimo ya validado en la Fase A, sin activar caché ni alterar consultas, datos o diseño.

## Auditoría previa

Se han revisado las tablas consumidas directa o indirectamente por `loadCore()` y `loadBandRelations()`. Las superficies implicadas tienen RLS activa y política pública de `SELECT` condicionada a contenido publicado o público según corresponda.

Entre ellas: `entities`, `bands`, `band_names`, `entity_relations`, `entity_social_links`, `municipalities`, `band_agents`, `music_accompaniment_periods`, `band_premieres`, `outing_music_assignments`, `heritage_assets`, `editorial_content_links`, `editorial_content`, `brotherhoods`, `march_authors`, `heritage_interventions`, `agent_names`, `source_links`, `sources`, `outing_music_positions` y `outings`.

## Hallazgo relevante

`band_agents` expone públicamente solo registros con `is_public = true`. La ficha pública debe respetar esa política y no depender de que exista una sesión editorial en cookies.

## Cambio

- `getBandBySlug()` usa `createPublicClient()`;
- el loader legado `getBandsDirectory()` permanece sin cambios porque `/bandas` ya utiliza `bands-directory-public.js`;
- no se toca HC-012, Panel, RLS, datos, ISR, TTL ni tags.

## Criterio de aceptación

1. Las Cigarreras carga su ficha completa sin sesión.
2. La Encarnación carga su ficha completa sin sesión.
3. acompañamientos, estrenos, patrimonio, fuentes y salidas mantienen el comportamiento público previo;
4. la respuesta continúa sin caché persistente;
5. CI y preview quedan en verde antes de fusionar.
