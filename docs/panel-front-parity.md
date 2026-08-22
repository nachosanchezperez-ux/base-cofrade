# Paridad Front ↔ Panel

Estado de referencia de la arquitectura editorial de Hilo Cofrade. Esta matriz fija una regla de producto: **todo contenido persistente que pueda mostrarse en el Front debe tener una vía de edición manual desde el Panel**. Los valores derivados se calculan desde sus datos/relaciones de origen y no deben duplicarse en un segundo formulario.

## Criterios

- **OK**: el dato persistente consumido por el Front tiene editor manual.
- **DERIVADO**: el Front calcula el valor desde datos persistentes editables; no necesita campo duplicado.
- **TRANSVERSAL**: se administra en una herramienta común, normalmente Multimedia o Fuentes.
- Un fallback de presentación puede existir para textos neutros, placeholders o valores visuales no editoriales. No puede existir un fallback local con contenido específico que sustituya a Supabase.
- Si Supabase no puede resolver una entidad publicada, la ficha pública no debe reconstruirse desde una copia local obsoleta.

## Hermandades

| Front / contenido | Fuente persistente | Panel | Estado |
| --- | --- | --- | --- |
| Identidad, nombres, slug, estado, resumen | `entities`, `brotherhoods` | `/panel/hermandades/[id]` | OK |
| Tipos, sede, municipio, barrio, día de salida | `brotherhoods`, `municipalities`, `places` | General + `/panel/datos/municipios` + `/panel/datos/lugares` | OK |
| Colores | datos estructurados de Hermandad | General | OK |
| Escudo | `brotherhoods.crest_path` | General | OK. El Front consulta el valor autoritativo y no rescata un mapa local. |
| Historia | autoridad de sección + datos estructurados | `/panel/hermandades/[id]/historia` | OK |
| Titulares / Imágenes | `brotherhood_images`, Advocaciones e Imágenes | `/titulares`, Imagen, Datos → Advocaciones | OK |
| Pasos | `brotherhood_steps` | `/pasos` y workspace de Paso | OK |
| Cultos | cultos estructurados | `/cultos` | OK |
| Salidas recurrentes | `outing_series`, movimientos | `/salidas/recurrentes` | OK |
| Salidas concretas / extraordinarias | `outings` y detalle de salida | `/salidas` | OK |
| Túnica / hábito | datos estructurados del hábito | `/habito` | OK |
| Datos de jornada / cortejo | estadísticas procesionales | `/jornada` | OK |
| Acompañamiento musical | períodos musicales | Hermandad + Banda + Paso | OK |
| Patrimonio | `heritage_assets`, intervenciones | `/patrimonio` | OK |
| Acontecimientos / Vía Crucis / Pregón, etc. | `events`, relaciones, multimedia | Acontecimientos + Multimedia + Fuentes | OK. El crédito fotográfico de evento prioriza Multimedia. |
| Web y redes | enlaces oficiales | `/canales` | OK |
| Multimedia | `media_assets`, `entity_media` | `/panel/multimedia?entity=...` | TRANSVERSAL |
| Fuentes | `sources`, `source_links` | `/panel/fuentes?entity=...` | TRANSVERSAL |

## Imágenes

| Front / contenido | Fuente persistente | Panel | Estado |
| --- | --- | --- | --- |
| Identidad, tipo, descripción, técnica, material, policromía, dimensiones, iconografía, estado | `entities`, `images` | `/panel/imagenes/[id]` | OK |
| Advocación | `images.advocation_entity_id` | Imagen + Datos → Advocaciones | OK |
| Autoría | `image_authorships` | `/autorias` | OK |
| Intervenciones / restauraciones | patrimonio e intervenciones | `/intervenciones` | OK |
| Hermandades vinculadas | relación Hermandad ↔ Imagen | Hermandad → Titulares | OK |
| Paso en el que procesiona | `image_steps` | `/panel/relaciones/imagen-paso` y accesos del workspace | OK |
| Localización actual | relación estructurada de localización | editor de Imagen / relaciones subyacentes | OK |
| Multimedia / portada | `entity_media` | Multimedia | TRANSVERSAL |
| Fuentes | `source_links` | Fuentes | TRANSVERSAL |

## Pasos

| Front / contenido | Fuente persistente | Panel | Estado |
| --- | --- | --- | --- |
| Identidad, tipo, descripción, estilo, materiales, medidas, sistema de portadores, estado | `entities`, `steps` | `/panel/pasos/[id]` | OK |
| Imágenes que procesionan | `image_steps` | Imagen ↔ Paso | OK |
| Hermandad | `brotherhood_steps` | Hermandad → Pasos | OK |
| Capataces / responsables | `step_personnel_periods` | `/responsables` | OK |
| Música | períodos musicales | `/musica` | OK |
| Fases y autores patrimoniales | `step_phases`, `step_phase_agents` | `/patrimonio` | OK |
| Multimedia | `entity_media` | Multimedia | TRANSVERSAL |
| Fuentes | `source_links` y fuentes de relación | Fuentes / fuentes de cada relación | TRANSVERSAL |

## Bandas

| Front / contenido | Fuente persistente | Panel | Estado |
| --- | --- | --- | --- |
| Identidad, nombres, tipo, municipio, fundación, descripción, sede, colores y recursos principales | `entities`, `bands`, `band_names` | `/panel/bandas/[id]` | OK |
| Web y redes | datos de Banda + enlaces sociales | `/canales` | OK |
| Dirección | `band_agents` | `/direccion` | OK |
| Acompañamientos actuales e históricos | `music_accompaniment_periods` | `/acompanamientos` | OK |
| Paso concreto del acompañamiento | `step_entity_id` del período | `/acompanamientos` | OK |
| Extraordinarias | salidas + asignaciones musicales | `/extraordinarias` | OK |
| Estrenos | `band_premieres` + Marchas/autores | `/estrenos` | OK |
| Patrimonio | `heritage_assets`, intervenciones | `/patrimonio` | OK |
| Discografía | lanzamientos y pistas | `/discografia` | OK |
| Curiosidades | `editorial_content` + `editorial_content_links` | `/panel/hoy/banco` | OK. `about` es una relación válida para la ficha. |
| Multimedia | `entity_media` y recursos propios estructurados | Multimedia / General según el campo | OK |
| Fuentes | fuentes directas y de períodos/estrenos | Fuentes | OK |

**Decisión de autoridad:** se eliminan los fallbacks específicos de Las Cigarreras. Acompañamientos, histórico, extraordinarias, patrimonio, estrenos y curiosidades se resuelven desde Supabase. Si la ficha remota no existe o falla, no se reconstruye con una copia local.

## Personas / Agentes

No existe actualmente una ficha pública independiente de Persona. Funciona como nodo relacional visible desde autorías, intervenciones, capataces, dirección y Marchas.

| Contenido | Fuente persistente | Panel | Estado |
| --- | --- | --- | --- |
| Identidad y biografía | `entities`, `agents` | `/panel/agentes/[id]` | OK |
| Nombres y alias | `agent_names` | `/nombres` | OK |
| Disciplinas | `agent_disciplines` | `/disciplinas` | OK |
| Roles | `agent_roles` | `/roles` | OK |
| Obra relacionada | relaciones de Imagen, Paso, Banda, Marcha y patrimonio | `/obra` | DERIVADO / navegable hacia el editor autoritativo |
| Multimedia / Fuentes | relaciones transversales | Multimedia / Fuentes | TRANSVERSAL |

## Marchas

| Front / contenido | Fuente persistente | Panel | Estado |
| --- | --- | --- | --- |
| Título, tipo, composición, descripción, estreno, elegibilidad/prioridad diaria | `entities`, `marches` | `/panel/marchas/[id]` | OK |
| Autoría | `march_authors` | `/autoria` | OK |
| Dedicatorias | `march_dedications` | `/dedicatorias` | OK |
| Grabaciones | `march_recordings` | `/grabaciones` | OK |
| Discografía / Spotify | relación con pistas de lanzamientos | Banda → Discografía | DERIVADO desde relación editable |
| Multimedia / Fuentes | relaciones transversales | Multimedia / Fuentes | TRANSVERSAL |

## Acontecimientos

| Front / contenido | Fuente persistente | Panel | Estado |
| --- | --- | --- | --- |
| Identidad, tipo, fecha, lugar, descripción | `entities`, `events` | `/panel/acontecimientos/[id]` | OK |
| Entidades implicadas | `entity_relations` (`involves`) | editor de Acontecimiento | OK |
| Fotografía / crédito | `entity_media`, `media_assets` | Multimedia | OK |
| Fuentes | `source_links` | Fuentes | OK |

## Patrimonio

`heritage_asset` es un nodo relacional administrado desde el workspace de su entidad propietaria (Hermandad, Banda, Paso cuando corresponde), con agentes/intervenciones y documentación. Sus representaciones públicas se derivan de esa estructura. No se mantiene una copia textual paralela en el Front.

## Hoy / Home

| Bloque | Fuente | Panel | Estado |
| --- | --- | --- | --- |
| Efeméride | Acontecimientos candidatos + override | `/panel/hoy/programacion` | OK |
| Dato / Curiosidad | Banco editorial + override único | `/panel/hoy/banco` + `/programacion` | OK |
| Hilo para descubrir | relaciones del grafo | datos/relaciones de origen | DERIVADO |
| Marcha del día | Marchas elegibles + override | Marcha + `/panel/hoy/programacion` | OK |

El Resumen de Hoy muestra el **resultado efectivo** y distingue Automático / Manual.

## Tira del hilo y razonamiento del grafo

Las respuestas, coincidencias, recorridos y sugerencias de Tira del hilo son **DERIVADAS**. No son contenido editorial independiente. Se construyen desde Hermandades, Imágenes, Pasos, Bandas, Personas, Marchas, patrimonio, relaciones y Fuentes; por tanto se corrigen editando esos nodos en el Panel.

## Datos maestros y salud

- Advocaciones → `/panel/datos/advocaciones`
- Municipios → `/panel/datos/municipios`
- Lugares → `/panel/datos/lugares`
- Nodos de referencia → `/panel/datos/referencias`
- Salud del grafo → `/panel/datos/salud`

Salud calcula incidencias desde el estado real de Supabase y no crea una segunda tabla de incidencias.

## Guardas de regresión

`test/front-panel-parity.test.js` protege los puntos que históricamente rompieron la autoridad del Panel:

1. No puede volver un `FALLBACK_BAND` ni constantes específicas de Las Cigarreras al loader público.
2. El directorio de Hermandades no puede rescatar escudos desde un mapa local.
3. La ficha de Hermandad no puede forzar créditos fotográficos por slug y debe utilizar el escudo persistente autoritativo.

Cuando se añada un nuevo tipo de contenido persistente al Front, esta matriz debe actualizarse junto con su vía de edición en el Panel.
