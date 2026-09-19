# Manifiesto determinista · Estepa · quinto macrolote municipal HC-016

**Fecha:** 19 de septiembre de 2026  
**Fase:** PRE-LOTE · IDs congelados / preflight final sin staging  
**Namespace:** `c0160032-*`  
**Bulk import reservado:** `c0160032-0000-4000-8000-000000000001`  
**IMPORTANTE:** el ID anterior queda reservado documentalmente; **no existe todavía una fila en `bulk_imports`**.

## 1. Resultado de colisiones antes de congelar

- namespace `c0160032-*`: **0 filas existentes** en tablas nucleares e importador;
- 67 slugs nuevos de `entities`: **0 colisiones externas** y **0 duplicados internos**;
- 4 slugs de `places`: **0 colisiones**;
- 2 slugs de municipios soporte: **0 colisiones**;
- 23 URLs nuevas de `sources`: **0 coincidencias exactas** en producción;
- 21 REUSE: **21/21 presentes**;
- Fuente duplicada candidata a DELETE: continúa con **0 source_links**.

## 2. Regla de IDs

La familia sigue el patrón municipal ya usado:

`c0160032-GGGG-4000-8000-NNNNNNNNNNNN`

El bloque `GGGG` identifica la familia funcional y el sufijo `N` mantiene ordinal estable dentro de cada familia.

Los futuros `bulk_import_items.id` se calcularán de forma determinista con:

`md5('HC016-ESTEPA-20260919-' || position)::uuid`

No se materializa ninguna de estas filas hasta staging.

## 3. Fuentes nuevas · 23

| # | ID | Fuente | URL |
|---|---|---|---|
| 1 | `c0160032-0101-4000-8000-000000000001` | Programa de Mano Semana Santa Estepa 2026 | https://www.estepa.es/export/sites/estepa/.galleries/DOCUMENTOS-general/PROGRAMA-DE-MANO-2026.pdf |
| 2 | `c0160032-0102-4000-8000-000000000002` | Ayuntamiento · cierre Semana Santa Estepa 2026 | https://www.estepa.es/es/actualidad/noticias/DOMINGO-DE-RESURRECCION-FINALIZA-LA-SEMANA-SANTA-2026/ |
| 3 | `c0160032-0103-4000-8000-000000000003` | Ayuntamiento · La Borriquita | https://www.estepa.es/es/turismo/descubrenos/semanasanta/domingo-de-ramos/ |
| 4 | `c0160032-0104-4000-8000-000000000004` | Ayuntamiento · Las Angustias | https://www.estepa.es/es/turismo/descubrenos/semanasanta/lunes-santo/ |
| 5 | `c0160032-0105-4000-8000-000000000005` | Ayuntamiento · San Pedro | https://www.estepa.es/es/turismo/descubrenos/semanasanta/page-00001/ |
| 6 | `c0160032-0106-4000-8000-000000000006` | Ayuntamiento · Los Estudiantes | https://www.estepa.es/es/turismo/descubrenos/semanasanta/miercoles-santo/ |
| 7 | `c0160032-0107-4000-8000-000000000007` | Ayuntamiento · Dulce Nombre | https://www.estepa.es/es/turismo/descubrenos/semanasanta/miercoles-santo-00001/ |
| 8 | `c0160032-0108-4000-8000-000000000008` | Ayuntamiento · El Calvario | https://www.estepa.es/es/turismo/descubrenos/semanasanta/miercoles-santo-madrugada/ |
| 9 | `c0160032-0109-4000-8000-000000000009` | Ayuntamiento · Paz y Caridad | https://www.estepa.es/es/turismo/descubrenos/semanasanta/el-cristo/ |
| 10 | `c0160032-0110-4000-8000-000000000010` | Ayuntamiento · Santo Entierro | https://www.estepa.es/es/turismo/descubrenos/semanasanta/el-santo-entierro/ |
| 11 | `c0160032-0111-4000-8000-000000000011` | Ayuntamiento · Monumentos de Estepa | https://www.estepa.es/es/turismo/que-ver/monumentos/ |
| 12 | `c0160032-0112-4000-8000-000000000012` | Ayuntamiento · cartel Semana Santa y Glorias 2026 | https://www.estepa.es/es/actualidad/noticias/ACTO-COFRADE-CON-LA-PRESENTACION-DEL-CARTEL-DE-LA-SEMANA-SANTA-Y-LAS-GLORIAS-2026/ |
| 13 | `c0160032-0113-4000-8000-000000000013` | Ayuntamiento · Santa Ana 2026 | https://www.estepa.es/es/actualidad/noticias/PROCESION-DE-NTRA.-SRA.-SANTA-ANA/ |
| 14 | `c0160032-0114-4000-8000-000000000014` | Ayuntamiento · Cartel de la Asunción 2026 | https://www.estepa.es/es/actualidad/noticias/CARTEL-DE-LA-ASUNCION-2026/ |
| 15 | `c0160032-0115-4000-8000-000000000015` | El Pespunte · Remedios 17/05/2026 | https://www.elpespunte.es/articulo/cofrade/cientos-personas-arropan-virgen-remedios-uno-momentos-mas-esperados-estepa/20260518091240134384.html |
| 16 | `c0160032-0116-4000-8000-000000000016` | SER Andalucía Centro · Carmen 12/09/2026 | https://cadenaser.com/andalucia/2026/09/10/estepa-aguarda-la-salida-de-la-virgen-del-carmen-en-su-tradicional-procesion-de-septiembre-ser-andalucia-centro/ |
| 17 | `c0160032-0117-4000-8000-000000000017` | Ayuntamiento · conferencia 400.º aniversario Nazareno | https://www.estepa.es/es/actualidad/eventos/CONFERENCIA-LA-VOCACION-COFRADE-COMO-SERVICIO-A-LA-IGLESIA/ |
| 18 | `c0160032-0118-4000-8000-000000000018` | Web oficial · AM Paz y Caridad | https://hermandaddepazycaridad.com/grupos/agrupacion-musical-paz-y-caridad/ |
| 19 | `c0160032-0119-4000-8000-000000000019` | Blog oficial · Estudiantes · 2026 | https://hermandaddelosestudiantesestepa.blogspot.com/2026/ |
| 20 | `c0160032-0120-4000-8000-000000000020` | La Línea Cofrade · fin vinculación Santa Bárbara–Estepa | https://www.lalineacofrade.com/la-banda-de-cornetas-y-tambores-santa-barbara-no-renueva-con-la-entrada-triunfal-de-estepa/ |
| 21 | `c0160032-0121-4000-8000-000000000021` | Web oficial · BCT Santa Vera+Cruz de Utrera | https://www.bandaveracruzutrera.es/p/historia.html |
| 22 | `c0160032-0122-4000-8000-000000000022` | Web oficial · AM Vera Cruz de Campillos | https://www.veracruzdecampillos.com/la-agrupacion |
| 23 | `c0160032-0123-4000-8000-000000000023` | Ayuntamiento · concierto AM Dulce Nombre 2026 | https://www.estepa.es/es/actualidad/noticias/CONCIERTO-DE-LA-AGRUPACION-MUSICAL-DULCE-NOMBRE/ |

## 4. Municipios soporte · 2

| # | ID | Municipio | slug | Provincia |
|---|---|---|---|---|
| 1 | `c0160032-0201-4000-8000-000000000001` | La Línea de la Concepción | la-linea-de-la-concepcion | Cádiz |
| 2 | `c0160032-0202-4000-8000-000000000002` | Campillos | campillos | Málaga |

REUSE: Estepa y Utrera.

## 5. Lugares · 4

| # | ID | Lugar | slug |
|---|---|---|---|
| 1 | `c0160032-0211-4000-8000-000000000001` | Ermita de Santa Ana | ermita-santa-ana-estepa |
| 2 | `c0160032-0212-4000-8000-000000000002` | Iglesia de Nuestra Señora de la Asunción | iglesia-nuestra-senora-asuncion-estepa |
| 3 | `c0160032-0213-4000-8000-000000000003` | Iglesia de Nuestra Señora de los Remedios | iglesia-nuestra-senora-remedios-estepa |
| 4 | `c0160032-0214-4000-8000-000000000004` | Iglesia de Nuestra Señora del Carmen | iglesia-nuestra-senora-carmen-estepa |

REUSE: Iglesia de San Sebastián · `0c9ab35d-171f-4814-af76-e669ace8c295`.

## 6. Hermandades nuevas · 12

| # | entity_id | Corporación | slug |
|---|---|---|---|
| 1 | `c0160032-0301-4000-8000-000000000001` | Borriquita de Estepa | borriquita-estepa |
| 2 | `c0160032-0302-4000-8000-000000000002` | Hermandad de las Angustias | angustias-estepa |
| 3 | `c0160032-0303-4000-8000-000000000003` | Hermandad de San Pedro | san-pedro-estepa |
| 4 | `c0160032-0304-4000-8000-000000000004` | Hermandad de los Estudiantes | estudiantes-estepa |
| 5 | `c0160032-0305-4000-8000-000000000005` | Hermandad del Dulce Nombre | dulce-nombre-estepa |
| 6 | `c0160032-0306-4000-8000-000000000006` | Hermandad del Calvario | calvario-estepa |
| 7 | `c0160032-0307-4000-8000-000000000007` | Archicofradía Sacramental de Paz y Caridad | paz-caridad-estepa |
| 8 | `c0160032-0308-4000-8000-000000000008` | Santo Entierro de Estepa | santo-entierro-estepa |
| 9 | `c0160032-0309-4000-8000-000000000009` | Hermandad de Nuestra Señora de la Asunción | asuncion-estepa |
| 10 | `c0160032-0310-4000-8000-000000000010` | Hermandad de Nuestra Señora de los Remedios Coronada | remedios-estepa |
| 11 | `c0160032-0311-4000-8000-000000000011` | Hermandad de Nuestra Señora del Carmen | carmen-estepa |
| 12 | `c0160032-0312-4000-8000-000000000012` | Hermandad de Santa Ana | hermandad-santa-ana-estepa |

REUSE: Jesús Nazareno de Estepa · `25d7900f-5518-4e22-84a3-b5b3b44e9ab1`.

## 7. Bandas nuevas · 7

| # | entity_id | Formación | slug |
|---|---|---|---|
| 1 | `c0160032-0401-4000-8000-000000000001` | Banda de Música de Estepa | banda-musica-estepa |
| 2 | `c0160032-0402-4000-8000-000000000002` | Agrupación Musical Paz y Caridad de Estepa | agrupacion-musical-paz-caridad-estepa |
| 3 | `c0160032-0403-4000-8000-000000000003` | Agrupación Musical Dulce Nombre de Jesús de Estepa | agrupacion-musical-dulce-nombre-estepa |
| 4 | `c0160032-0404-4000-8000-000000000004` | Capilla Musical Nuestra Señora de la Victoria de Estepa | capilla-musical-nuestra-senora-victoria-estepa |
| 5 | `c0160032-0405-4000-8000-000000000005` | Banda de Cornetas y Tambores Santa Bárbara de La Línea de la Concepción | banda-cornetas-tambores-santa-barbara-la-linea |
| 6 | `c0160032-0406-4000-8000-000000000006` | Banda de Cornetas y Tambores Santa Vera+Cruz de Utrera | banda-cornetas-tambores-santa-vera-cruz-utrera |
| 7 | `c0160032-0407-4000-8000-000000000007` | Agrupación Musical Vera Cruz de Campillos | agrupacion-musical-vera-cruz-campillos |

Alias BAME:
- `band_names.id = c0160032-0801-4000-8000-000000000001`.

REUSE: Banda de Música Villa de Osuna · `75fc797d-f287-4813-9e52-8f5c5ddf56ad`.

## 8. Agentes nuevos · 3

| # | entity_id | Agente | slug |
|---|---|---|---|
| 1 | `c0160032-0501-4000-8000-000000000001` | Diego Márquez | diego-marquez |
| 2 | `c0160032-0502-4000-8000-000000000002` | Pedro de Mena | pedro-de-mena |
| 3 | `c0160032-0503-4000-8000-000000000003` | Andrés de Carvajal y Campos | andres-de-carvajal-campos |

IDs auxiliares:
- agent_names: `c0160032-0811-4000-8000-000000000001` → `c0160032-0813-4000-8000-000000000003`;
- agent_disciplines: `c0160032-0821-4000-8000-000000000001` → `c0160032-0823-4000-8000-000000000003`.

REUSE: Francisco Berlanga, Francisco Buiza, Luis Salvador Carmona y Manuel Escamilla.

## 9. Imágenes nuevas · 27

| # | entity_id | Imagen | slug |
|---|---|---|---|
| 1 | `c0160032-0601-4000-8000-000000000001` | Nuestro Padre Jesús en su Entrada Triunfal en Jerusalén | nuestro-padre-jesus-entrada-triunfal-estepa |
| 2 | `c0160032-0602-4000-8000-000000000002` | María Santísima de la Victoria | maria-santisima-victoria-estepa |
| 3 | `c0160032-0603-4000-8000-000000000003` | Nuestra Señora de las Angustias | nuestra-senora-angustias-estepa |
| 4 | `c0160032-0604-4000-8000-000000000004` | San José Obrero | san-jose-obrero-estepa |
| 5 | `c0160032-0605-4000-8000-000000000005` | San Pedro Apóstol | san-pedro-apostol-estepa |
| 6 | `c0160032-0606-4000-8000-000000000006` | Santo Cristo de las Penas | santo-cristo-penas-estepa |
| 7 | `c0160032-0607-4000-8000-000000000007` | María Santísima de los Dolores · San Pedro | maria-santisima-dolores-san-pedro-estepa |
| 8 | `c0160032-0608-4000-8000-000000000008` | Santísimo Cristo del Amor | santisimo-cristo-amor-estepa |
| 9 | `c0160032-0609-4000-8000-000000000009` | Nuestro Padre Jesús Cautivo y Rescatado | nuestro-padre-jesus-cautivo-rescatado-estepa |
| 10 | `c0160032-0610-4000-8000-000000000010` | María Santísima del Valle | maria-santisima-valle-estepa |
| 11 | `c0160032-0611-4000-8000-000000000011` | Dulce Nombre de Jesús | dulce-nombre-jesus-estepa |
| 12 | `c0160032-0612-4000-8000-000000000012` | Santísimo Cristo de la Humildad y Paciencia | santisimo-cristo-humildad-paciencia-estepa |
| 13 | `c0160032-0613-4000-8000-000000000013` | Nuestra Señora María Santísima de la Paz | nuestra-senora-paz-estepa |
| 14 | `c0160032-0614-4000-8000-000000000014` | Santísimo Cristo de la Salud | santisimo-cristo-salud-estepa |
| 15 | `c0160032-0615-4000-8000-000000000015` | Nuestra Señora de la Amargura | nuestra-senora-amargura-estepa |
| 16 | `c0160032-0616-4000-8000-000000000016` | San Juan Evangelista · Calvario | san-juan-evangelista-calvario-estepa |
| 17 | `c0160032-0617-4000-8000-000000000017` | Santísimo Cristo Amarrado a la Columna | santisimo-cristo-amarrado-columna-estepa |
| 18 | `c0160032-0618-4000-8000-000000000018` | María Santísima de la Esperanza Coronada | maria-santisima-esperanza-coronada-estepa |
| 19 | `c0160032-0619-4000-8000-000000000019` | Pura y Limpia Concepción de María | pura-limpia-concepcion-maria-estepa |
| 20 | `c0160032-0620-4000-8000-000000000020` | María Santísima de los Dolores · Nazareno | maria-santisima-dolores-nazareno-estepa |
| 21 | `c0160032-0621-4000-8000-000000000021` | Cristo Yacente del Santo Entierro | cristo-yacente-santo-entierro-estepa |
| 22 | `c0160032-0622-4000-8000-000000000022` | Santísimo Cristo de la Buena Muerte | santisimo-cristo-buena-muerte-estepa |
| 23 | `c0160032-0623-4000-8000-000000000023` | Nuestra Señora de la Soledad | nuestra-senora-soledad-estepa |
| 24 | `c0160032-0624-4000-8000-000000000024` | Nuestra Señora de la Asunción | nuestra-senora-asuncion-estepa |
| 25 | `c0160032-0625-4000-8000-000000000025` | Nuestra Señora de los Remedios Coronada | nuestra-senora-remedios-coronada-estepa |
| 26 | `c0160032-0626-4000-8000-000000000026` | Nuestra Señora del Carmen | nuestra-senora-carmen-estepa |
| 27 | `c0160032-0627-4000-8000-000000000027` | Santa Ana | santa-ana-estepa |

REUSE: Nuestro Padre Jesús Nazareno · `c4c9cda1-7e3a-402c-8f18-f81e0a318666`.

Relaciones:
- brotherhood_images: `c0160032-0831-4000-8000-000000000001` → `c0160032-0857-4000-8000-000000000027`;
- image_authorships: `c0160032-0861-4000-8000-000000000001` → `c0160032-0868-4000-8000-000000000008`.

## 10. Pasos nuevos · 17

| # | entity_id | Paso | slug |
|---|---|---|---|
| 1 | `c0160032-0701-4000-8000-000000000001` | Misterio de la Entrada Triunfal | paso-misterio-borriquita-estepa |
| 2 | `c0160032-0702-4000-8000-000000000002` | Andas de Nuestra Señora de las Angustias | andas-angustias-estepa |
| 3 | `c0160032-0703-4000-8000-000000000003` | Paso de San Pedro Apóstol | paso-san-pedro-estepa |
| 4 | `c0160032-0704-4000-8000-000000000004` | Paso de palio de María Santísima de los Dolores · San Pedro | paso-palio-dolores-san-pedro-estepa |
| 5 | `c0160032-0705-4000-8000-000000000005` | Paso del Santísimo Cristo del Amor | paso-cristo-amor-estepa |
| 6 | `c0160032-0706-4000-8000-000000000006` | Paso del Dulce Nombre de Jesús | paso-dulce-nombre-estepa |
| 7 | `c0160032-0707-4000-8000-000000000007` | Paso de palio de Nuestra Señora de la Paz | paso-palio-paz-estepa |
| 8 | `c0160032-0708-4000-8000-000000000008` | Paso del Calvario | paso-calvario-estepa |
| 9 | `c0160032-0709-4000-8000-000000000009` | Paso del Cristo Amarrado a la Columna | paso-cristo-columna-estepa |
| 10 | `c0160032-0710-4000-8000-000000000010` | Paso de palio de la Esperanza Coronada | paso-palio-esperanza-estepa |
| 11 | `c0160032-0711-4000-8000-000000000011` | Paso de palio de María Santísima de los Dolores · Nazareno | paso-palio-dolores-nazareno-estepa |
| 12 | `c0160032-0712-4000-8000-000000000012` | Urna del Santo Entierro | paso-santo-entierro-estepa |
| 13 | `c0160032-0713-4000-8000-000000000013` | Paso de Nuestra Señora de la Soledad | paso-soledad-estepa |
| 14 | `c0160032-0714-4000-8000-000000000014` | Paso de Nuestra Señora de la Asunción | paso-asuncion-estepa |
| 15 | `c0160032-0715-4000-8000-000000000015` | Paso de Nuestra Señora de los Remedios Coronada | paso-remedios-estepa |
| 16 | `c0160032-0716-4000-8000-000000000016` | Paso de Nuestra Señora del Carmen | paso-carmen-estepa |
| 17 | `c0160032-0717-4000-8000-000000000017` | Paso de Santa Ana | paso-santa-ana-estepa |

REUSE/UPDATE:
- Paso de Nuestro Padre Jesús Nazareno · `c221206c-3a80-4aa7-9074-aea30d5f1343`;
- brotherhood_steps · `8bf3d4de-c9f3-4e79-bd4e-4fef6c2a7adb`;
- image_steps · `7fb4c76b-1859-4b4c-83d6-d42c23071e4a`.

IDs nuevos:
- brotherhood_steps: `c0160032-0871-4000-8000-000000000001` → `c0160032-0887-4000-8000-000000000017`;
- image_steps: `c0160032-0891-4000-8000-000000000001` → `c0160032-0909-4000-8000-000000000019`.

## 11. Salidas y relaciones

### outing_series · 13
`c0160032-0911-4000-8000-000000000001` → `c0160032-0923-4000-8000-000000000013`

### outings · 13
`c0160032-0931-4000-8000-000000000001` → `c0160032-0943-4000-8000-000000000013`

### outing_entities · 18
`c0160032-0951-4000-8000-000000000001` → `c0160032-0968-4000-8000-000000000018`

REUSE:
- extraordinaria Nazareno · 02/11/2026 · `a84bb555-6366-4ee1-aca5-a8ea4533a5eb`;
- extraordinaria Nazareno · 15/11/2026 · `a505bb2f-e1d2-4f08-a9cd-f5f6204b5150`.

## 12. Música

- outing_music_positions: `c0160032-0971-4000-8000-000000000001` → `c0160032-0986-4000-8000-000000000016`;
- outing_music_assignments: `c0160032-0991-4000-8000-000000000001` → `c0160032-1006-4000-8000-000000000016`;
- music_accompaniment_periods: `c0160032-1011-4000-8000-000000000001` → `c0160032-1024-4000-8000-000000000014`.

## 13. Cultos

- cults: `c0160032-1031-4000-8000-000000000001` → `c0160032-1038-4000-8000-000000000008`;
- cult_occurrences: `c0160032-1041-4000-8000-000000000001` → `c0160032-1048-4000-8000-000000000008`.

## 14. Acontecimiento

Entidad y fila `events`:

- ID: `c0160032-1101-4000-8000-000000000001`
- nombre: **La vocación cofrade como servicio a la Iglesia**
- slug: `vocacion-cofrade-servicio-iglesia-estepa-2026`
- fecha prevista: 25/09/2026
- estado: `announced`

## 15. Source links · 143

IDs reservados:
`c0160032-2001-4000-8000-000000000001` → `c0160032-2143-4000-8000-000000000143`

Subrangos cerrados:

| Rango | Cantidad | Uso |
|---|---:|---|
| 2001–2067 | 67 | Fuente primaria de cada entidad nueva |
| 2068–2075 | 8 | Autorías |
| 2076–2088 | 13 | outing_series |
| 2089–2110 | 22 | outings: 13 primarias + 9 retrospectivas de Semana Santa |
| 2111–2126 | 16 | asignaciones musicales |
| 2127–2134 | 8 | Cultos |
| 2135–2142 | 8 | ediciones cultuales |
| 2143 | 1 | acontecimiento del 25/09 |

Total: **143**.

## 16. Operaciones 491–495

### UPDATE · 491–494
Sobre el Paso existente del Nazareno:

491. `entities` · `c221206c-3a80-4aa7-9074-aea30d5f1343`
492. `steps` · `c221206c-3a80-4aa7-9074-aea30d5f1343`
493. `brotherhood_steps` · `8bf3d4de-c9f3-4e79-bd4e-4fef6c2a7adb`
494. `image_steps` · `7fb4c76b-1859-4b4c-83d6-d42c23071e4a`

### DELETE · 495
`sources.id = dc375c1f-9318-4de9-ae1f-d1f10a7d050f`

Guardas:
- misma URL que la Fuente canónica;
- 0 source_links;
- 0 FK restantes;
- se preserva `72ac1537-8940-4455-8e8d-c17169baa0aa`.

## 17. REUSE congelados · 21

1. Estepa.
2. Utrera.
3. Jesús Nazareno de Estepa.
4. Nuestro Padre Jesús Nazareno.
5. Paso del Nazareno.
6. relación Hermandad–Imagen Nazareno.
7. relación Hermandad–Paso Nazareno.
8. relación Imagen–Paso Nazareno.
9. autoría del Nazareno → Luis Salvador Carmona.
10. Iglesia de San Sebastián.
11. Banda Villa de Osuna.
12. Francisco Berlanga de Ávila.
13. Francisco Buiza Fernández.
14. Luis Salvador Carmona.
15. Manuel Escamilla Cabezas.
16. Fuente Ayuntamiento · Jesús Nazareno.
17. Fuente Congregación Nazarena.
18. Fuente Arte Sacro · Nazareno.
19. Fuente canónica Devociones de Estepa.
20. Salida extraordinaria 02/11/2026.
21. Salida extraordinaria 15/11/2026.

## 18. Puerta

Este documento congela IDs y nombres canónicos. **No crea staging**.

Antes del futuro staging:
1. refrescar `main`;
2. reejecutar colisiones de IDs/slugs/URLs;
3. construir SQL/payload exacto de las 495 operaciones;
4. ejecutar payload completo en transacción + `ROLLBACK`;
5. solo con 0 INVALID / 0 UNRESOLVED / 0 AMBIGUOUS / 0 COLLISION, autorizar staging.

