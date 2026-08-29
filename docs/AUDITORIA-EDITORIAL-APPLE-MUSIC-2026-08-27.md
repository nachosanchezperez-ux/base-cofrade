# Auditoría editorial y Apple Music · 27 de agosto de 2026

## Alcance

Este corte continúa el trabajo editorial sin abrir funcionalidades ni preparar el lanzamiento. Se ha trabajado sobre datos ya modelados y editables desde el Panel.

- `main` refrescado al comenzar el seguimiento: `394e3b3`.
- Supabase: proyecto `Hilocofrade` activo y saludable.
- Sin cambios de esquema, migraciones, RLS, componentes o rutas públicas.
- Apple Music se mantiene como enlace editorial externo en `band_releases.external_url`; no se ha añadido una integración ni se ha usado una API.

## Apple Music

El catálogo contiene actualmente `252` lanzamientos publicados y ninguno en estado `review`. Entre los publicados, `52` tienen destino Apple Music.

En los dos primeros cortes se sustituyeron destinos genéricos por el álbum, EP o sencillo exacto, dejando `40` destinos directos y `6` perfiles pendientes. Este cierre contrasta los seis singles que permanecían en `review` con sus páginas oficiales de Apple Music y los publica. El estado final queda en `46` destinos directos y `6` perfiles conservados por discrepancias documentales.

| Banda | Enlaces Apple | Destinos directos | Perfil pendiente |
| --- | ---: | ---: | ---: |
| La Redención | 1 | 1 | 0 |
| Las Cigarreras | 6 | 6 | 0 |
| Los Gitanos | 10 | 9 | 1 |
| Presentación al Pueblo | 4 | 4 | 0 |
| Santa María Magdalena de Arahal | 17 | 13 | 4 |
| Tres Caídas de Triana | 14 | 13 | 1 |
| **Total** | **52** | **46** | **6** |

En este seguimiento, las fichas públicas de Santa María Magdalena de Arahal y Tres Caídas de Triana devolvieron HTTP `200` y renderizaron los seis destinos exactos publicados después del cambio.

### Coincidencias exactas resueltas en este seguimiento

- Santa María Magdalena de Arahal: `Nazareno y Gitano` (1992), `Buena Muerte y Esperanza` (1998) y `Antología` (2000).
- Tres Caídas de Triana: `El hijo de Dios (Directo)` (2021), `Y se hizo el Silencio… (Directo)` (2024) y `El Recuerdo (Directo)` (2025).

### Pendientes Apple que no deben resolverse por aproximación

Los siguientes lanzamientos conservan el perfil oficial de la banda porque no se encontró una ficha exacta o porque título/año no permitían afirmar identidad:

- Los Gitanos: `Concierto Anual Hermandad de Los Gitanos 2024 (Live)`; Apple publica el álbum bajo `Varios Artistas`, no como lanzamiento propio inequívoco de la banda.
- Santa María Magdalena de Arahal: `Salud de San Bernardo` (base: 1981; Apple: reedición 2024), `La Paz` (sin ficha exacta localizada), `Misericordia` (base: 1990; Apple: 1991) y `Arahal · 1964-2003` (no debe sustituirse por el título distinto `La Música del Señor`, aunque sea de 2002).
- Tres Caídas de Triana: `La Misericordia del Padre` (base: 2019); la ficha oficial localizada corresponde a `La Misericordia del Padre (En Directo)` de 2025 y es otro lanzamiento.

### Registros procedentes de `review`

Los seis registros de Tres Caídas de Triana apuntan a su single exacto: `El Compás del Barro (Directo)` y `Se Arrodilla Triana (Directo)` (2024), además de `La Misericordia del Padre (En Directo)`, `Más allá del río (En Directo)`, `Un solo Dios (En Directo)` y `Yo soy la Verdad (En Directo)` (2025). Cada uno conserva dos Fuentes. Tras contrastar artista, título, tipo y año con las páginas oficiales de Apple Music, los seis pasan de `review` a `published`. La ficha pública de Tres Caídas devolvió HTTP `200` y mostró los seis títulos y enlaces.

Regla de continuidad: no convertir un perfil en álbum por semejanza de título, ni relacionar una edición en directo o reedición cuando el año y la denominación no coincidan.

## Autorías de Marcha

### Gloria a ti · adaptación para banda

La Fuente ya vinculada a la Marcha identifica a `J. Arriaga` como autor de la copla original del siglo XIX. Se publicó esa relación con rol `composer`.

La Fuente inicial indica que hubo adaptación para banda en 2016, pero no identifica a la persona adaptadora. La revisión del 29 de agosto localiza la grabación específica de YoSoyPastoreñoTV, que acredita expresamente la adaptación a `Manuel García` y el año 2016. Una segunda referencia histórica del repertorio de la Banda de la Soledad coincide en `Arriaga / arreglos Manuel García`.

Se incorpora la relación con rol `adapter` y se conserva la identidad con alcance prudente: solo `Manuel García`, sin añadir segundo apellido, biografía ni unificación con posibles homónimos mientras no exista una Fuente inequívoca.

### El Descendimiento

La revisión del 28 de agosto localizó una ficha específica y concordante de Patrimonio Musical: `El Descendimiento`, compuesta por `José Sapena Matarredona` en 1961 y dedicada al Cristo del Descendimiento de Jaén. Se incorpora el agente, la autoría con rol `composer`, el año de composición y la Fuente vinculada a la Marcha.

Resultado estructural: las Marchas publicadas sin ningún autor publicado pasan de `1` a `0`.

## Imágenes sin recurso visual directo

Permanecen `20` Imágenes publicadas sin `entity_media` asociado a un recurso con `storage_path`. Todas tienen al menos una Fuente directa y una autoría estructurada; la carencia es exclusivamente visual.

### Cola priorizada por lote editorial

1. **Hermandad de Las Cigarreras · 3**: María Santísima de la Victoria, Nuestro Padre Jesús Atado a la Columna y Santísimo Cristo de la Púrpura.
2. **Hermandad de la Misión · 4**: Inmaculado Corazón de María, Nuestra Señora del Amparo, San Juan Evangelista y Santo Cristo de la Misión.
3. **Hermandad de San Esteban · 2**: María Santísima Madre de los Desamparados y Nuestro Padre Jesús de la Salud y Buen Viaje.
4. **Hermandad de Pasión y Muerte · 3**: Nuestra Señora del Desconsuelo y Visitación, Santa María del Buen Aire y Santísimo Cristo de Pasión y Muerte.
5. **Dulce Nombre de Bellavista · 2**: María Santísima del Dulce Nombre en sus Dolores y Compasión y Nuestro Padre Jesús de la Salud y Remedios.
6. **Pino Montano · 2**: María Santísima del Amor y Nuestro Padre Jesús de Nazaret.
7. **Bendición y Esperanza · 2**: Nuestro Padre Jesús de la Bendición en el Santo Encuentro y Santa María de la Esperanza en su Soledad.
8. **Cristo de la Corona · 2**: Nuestra Señora del Rosario y Santísimo Cristo de la Corona.

No se debe cerrar esta cola con hotlinking, capturas, archivos sin procedencia o una fotografía genérica de la Hermandad asignada a un titular concreto. Cada recurso debe conservar autoría, derechos, Fuente, URL canónica cuando proceda y rol editorial conforme a `MEDIA-ABIERTA.md`.

## Próximas acciones editoriales

1. Resolver las `9` imágenes de Cigarreras, Misión y San Esteban mediante archivos propios, autorizados o con licencia comprobada.
2. Mantener los `6` perfiles Apple pendientes hasta aclarar las discrepancias editoriales de artista, título o año.
3. Ampliar Apple Music al resto del catálogo solo con coincidencia exacta de banda, título, tipo de lanzamiento y año.

## Revalidación · 28 de agosto de 2026

- Los `6` destinos provisionales de Apple Music se contrastaron de nuevo con las páginas oficiales disponibles. Continúan sin cumplir simultáneamente artista, título, tipo y año, por lo que se conservan como perfiles y no se sustituyen por reediciones o versiones en directo distintas.
- Los `20` registros de Imagen continúan sin un activo exacto reutilizable en `media_assets`. Las Fuentes editoriales existentes no conceden por sí solas derechos de reproducción; el cierre requiere archivo propio, autorización o licencia comprobada.
- `El Descendimiento` deja de ser una advertencia de Salud tras documentar a José Sapena Matarredona y el año 1961.

Este documento no modifica el estado de lanzamiento ni sustituye la matriz responsive pendiente.
