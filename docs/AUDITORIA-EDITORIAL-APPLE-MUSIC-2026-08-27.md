# Auditoría editorial y Apple Music · 27 de agosto de 2026

## Alcance

Este corte continúa el trabajo editorial sin abrir funcionalidades ni preparar el lanzamiento. Se ha trabajado sobre datos ya modelados y editables desde el Panel.

- `main` refrescado al comenzar el corte: `f9b7a7c`.
- Supabase: proyecto `Hilocofrade` activo y saludable.
- Sin cambios de esquema, migraciones, RLS, componentes o rutas públicas.
- Apple Music se mantiene como enlace editorial externo en `band_releases.external_url`; no se ha añadido una integración ni se ha usado una API.

## Apple Music

El catálogo contiene `236` lanzamientos publicados. `46` tienen destino Apple Music.

Se revisaron los enlaces Apple existentes contra las páginas públicas oficiales y se sustituyeron `26` destinos genéricos de artista por el álbum, EP o sencillo exacto cuando coincidían inequívocamente título y año.

| Banda | Enlaces Apple | Destinos directos | Perfil pendiente |
| --- | ---: | ---: | ---: |
| Banda de Música María Santísima de la Victoria | 1 | 1 | 0 |
| Las Cigarreras | 6 | 6 | 0 |
| Los Gitanos | 10 | 9 | 1 |
| Presentación al Pueblo | 4 | 4 | 0 |
| Santa María Magdalena de Arahal | 17 | 10 | 7 |
| Tres Caídas de Triana | 8 | 4 | 4 |
| **Total** | **46** | **34** | **12** |

Las cuatro fichas públicas modificadas devolvieron HTTP `200` y renderizaron sus destinos Apple después del cambio.

### Pendientes Apple que no deben resolverse por aproximación

Los siguientes lanzamientos conservan el perfil oficial de la banda porque no se encontró una ficha exacta o porque título/año no permitían afirmar identidad:

- Los Gitanos: `Concierto Anual Hermandad de Los Gitanos 2024 (Live)`.
- Santa María Magdalena de Arahal: `Salud de San Bernardo`, `La Paz`, `Misericordia`, `Nazareno y Gitano`, `Buena Muerte y Esperanza`, `Antología` y `Arahal · 1964-2003`.
- Tres Caídas de Triana: `La Misericordia del Padre`, `El hijo de Dios (Directo)`, `Y se hizo el Silencio… (Directo)` y `El Recuerdo (Directo)`.

Regla de continuidad: no convertir un perfil en álbum por semejanza de título, ni relacionar una edición en directo o reedición cuando el año y la denominación no coincidan.

## Autorías de Marcha

### Gloria a ti · adaptación para banda

La Fuente ya vinculada a la Marcha identifica a `J. Arriaga` como autor de la copla original del siglo XIX. Se publicó esa relación con rol `composer`.

La misma Fuente indica que hubo adaptación para banda en 2016, pero no identifica inequívocamente a la persona adaptadora. Esa autoría continúa pendiente y no se ha asociado a otra persona por coincidencia de nombre.

### El Descendimiento

Continúa sin autor publicado. La pertenencia al álbum `Misericordia` está documentada, pero no existe todavía una Fuente fiable que atribuya la pista concreta. No debe reutilizarse la autoría de obras homónimas.

Resultado estructural: las Marchas publicadas sin ningún autor publicado pasan de `2` a `1`.

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
2. Pedir o localizar una Fuente primaria para el adaptador de `Gloria a ti` y el compositor de `El Descendimiento`.
3. Revisar manualmente los `12` perfiles Apple pendientes cuando el catálogo oficial publique una coincidencia exacta.
4. Ampliar Apple Music al resto del catálogo solo con coincidencia exacta de banda, título, tipo de lanzamiento y año.

Este documento no modifica el estado de lanzamiento ni sustituye la matriz responsive pendiente.
