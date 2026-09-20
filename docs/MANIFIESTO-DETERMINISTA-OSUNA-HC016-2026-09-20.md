# Manifiesto determinista · Osuna · séptimo macrolote municipal HC-016

**Fecha:** 20 de septiembre de 2026  
**Fase:** MANIFIESTO DETERMINISTA  
**Base:** `eda4dd28066457809d69e26732a6f3b48475bcfe`  
**Namespace:** `c0160034-*`  
**Bulk import:** `c0160034-0000-4000-8000-000000000001`  
**Contrato:** 368 UPSERT · 8 REUSE · 0 DELETE · 0 DDL · 0 RLS

## Regla de IDs

`c0160034-GGGG-4000-8000-NNNNNNNNNNNN`

Los IDs de `bulk_import_items` se calculan como:

`md5('HC016-OSUNA-20260920-' || position)::uuid`

## Entidades congeladas

| Tipo | ID | Nombre | Slug |
|---|---|---|---|
| hermandad | `c0160034-0301-4000-8000-000000000001` | Dulce Nombre y Borriquita de Osuna | `dulce-nombre-borriquita-osuna` |
| hermandad | `c0160034-0302-4000-8000-000000000002` | Humildad y Paciencia de Osuna | `humildad-paciencia-osuna` |
| hermandad | `c0160034-0303-4000-8000-000000000003` | Vera-Cruz de Osuna | `vera-cruz-osuna` |
| hermandad | `c0160034-0304-4000-8000-000000000004` | Salud y Encarnación de Osuna | `salud-encarnacion-osuna` |
| hermandad | `c0160034-0305-4000-8000-000000000005` | Misericordia de Osuna | `misericordia-osuna` |
| hermandad | `c0160034-0306-4000-8000-000000000006` | Jesús Caído y Dolores de Osuna | `jesus-caido-dolores-osuna` |
| hermandad | `c0160034-0307-4000-8000-000000000007` | Jesús Nazareno de Osuna | `jesus-nazareno-osuna` |
| hermandad | `c0160034-0308-4000-8000-000000000008` | Servitas de los Dolores de Osuna | `servitas-dolores-osuna` |
| hermandad | `c0160034-0309-4000-8000-000000000009` | Quinta Angustia de Osuna | `quinta-angustia-osuna` |
| hermandad | `c0160034-0310-4000-8000-000000000010` | Pax de Osuna | `pax-osuna` |
| hermandad | `c0160034-0311-4000-8000-000000000011` | Santo Entierro de Osuna | `santo-entierro-osuna` |
| banda | `c0160034-0401-4000-8000-000000000001` | Banda de Cornetas y Tambores Nuestro Padre Jesús Caído de Osuna | `bct-jesus-caido-osuna` |
| banda | `c0160034-0402-4000-8000-000000000002` | Banda de Música Castillo de la Mota de Marchena | `banda-musica-castillo-mota-marchena` |
| imagen | `c0160034-0601-4000-8000-000000000001` | Dulce Nombre de Jesús | `dulce-nombre-jesus-osuna` |
| imagen | `c0160034-0602-4000-8000-000000000002` | Triunfal Entrada de Jesús en Jerusalén | `borriquita-osuna` |
| imagen | `c0160034-0603-4000-8000-000000000003` | Nuestra Señora de los Desamparados | `virgen-desamparados-osuna` |
| imagen | `c0160034-0604-4000-8000-000000000004` | Nuestro Padre Jesús de la Humildad y Paciencia | `humildad-paciencia-osuna-imagen` |
| imagen | `c0160034-0605-4000-8000-000000000005` | Cristo Atado a la Columna | `cristo-atado-columna-osuna` |
| imagen | `c0160034-0606-4000-8000-000000000006` | María Santísima de la Soledad | `virgen-soledad-humildad-osuna` |
| imagen | `c0160034-0607-4000-8000-000000000007` | Santo Cristo de la Vera-Cruz | `cristo-vera-cruz-osuna` |
| imagen | `c0160034-0608-4000-8000-000000000008` | Nuestro Padre Jesús Cautivo | `jesus-cautivo-osuna` |
| imagen | `c0160034-0609-4000-8000-000000000009` | Nuestra Señora de la Esperanza | `virgen-esperanza-osuna` |
| imagen | `c0160034-0610-4000-8000-000000000010` | San Juan Evangelista de la Vera-Cruz | `san-juan-vera-cruz-osuna` |
| imagen | `c0160034-0611-4000-8000-000000000011` | Nuestro Padre Jesús de la Salud | `jesus-salud-osuna` |
| imagen | `c0160034-0612-4000-8000-000000000012` | María Santísima de la Encarnación | `virgen-encarnacion-osuna` |
| imagen | `c0160034-0613-4000-8000-000000000013` | Santísimo Cristo de la Misericordia | `cristo-misericordia-osuna` |
| imagen | `c0160034-0614-4000-8000-000000000014` | Nuestra Señora de la Piedad | `virgen-piedad-misericordia-osuna` |
| imagen | `c0160034-0615-4000-8000-000000000015` | San Juan Evangelista de la Misericordia | `san-juan-misericordia-osuna` |
| imagen | `c0160034-0616-4000-8000-000000000016` | Nuestro Padre Jesús Caído | `jesus-caido-osuna` |
| imagen | `c0160034-0617-4000-8000-000000000017` | Nuestra Señora y Madre de los Dolores | `virgen-dolores-jesus-caido-osuna` |
| imagen | `c0160034-0618-4000-8000-000000000018` | Nuestro Padre Jesús Nazareno | `jesus-nazareno-osuna-imagen` |
| imagen | `c0160034-0619-4000-8000-000000000019` | Nuestra Madre y Señora de los Dolores | `virgen-dolores-servitas-osuna` |
| imagen | `c0160034-0620-4000-8000-000000000020` | Nuestra Señora y Madre de la Quinta Angustia | `virgen-quinta-angustia-osuna` |
| imagen | `c0160034-0621-4000-8000-000000000021` | Santísimo Cristo de la Quinta Angustia | `cristo-quinta-angustia-osuna` |
| imagen | `c0160034-0622-4000-8000-000000000022` | Santo Cristo de la Paz | `cristo-paz-osuna` |
| imagen | `c0160034-0623-4000-8000-000000000023` | María Santísima del Mayor Dolor | `virgen-mayor-dolor-osuna` |
| imagen | `c0160034-0624-4000-8000-000000000024` | Cristo Yacente | `cristo-yacente-osuna` |
| imagen | `c0160034-0625-4000-8000-000000000025` | María Santísima en su Soledad y Amargura | `virgen-soledad-amargura-osuna` |
| imagen | `c0160034-0626-4000-8000-000000000026` | Triunfo de la Santa Cruz | `triunfo-santa-cruz-canina-osuna` |
| imagen | `c0160034-0627-4000-8000-000000000027` | Nuestra Señora de la Cabeza | `virgen-cabeza-osuna` |
| paso | `c0160034-0701-4000-8000-000000000001` | Paso del Dulce Nombre de Jesús | `paso-dulce-nombre-osuna` |
| paso | `c0160034-0702-4000-8000-000000000002` | Misterio de la Triunfal Entrada en Jerusalén | `paso-borriquita-osuna` |
| paso | `c0160034-0703-4000-8000-000000000003` | Palio de Nuestra Señora de los Desamparados | `paso-desamparados-osuna` |
| paso | `c0160034-0704-4000-8000-000000000004` | Paso del Cristo Atado a la Columna | `paso-atado-columna-osuna` |
| paso | `c0160034-0705-4000-8000-000000000005` | Palio de María Santísima de la Soledad | `paso-soledad-humildad-osuna` |
| paso | `c0160034-0706-4000-8000-000000000006` | Paso del Santo Cristo de la Vera-Cruz | `paso-cristo-vera-cruz-osuna` |
| paso | `c0160034-0707-4000-8000-000000000007` | Paso de Nuestro Padre Jesús Cautivo | `paso-jesus-cautivo-osuna` |
| paso | `c0160034-0708-4000-8000-000000000008` | Paso de Nuestra Señora de la Esperanza | `paso-esperanza-osuna` |
| paso | `c0160034-0709-4000-8000-000000000009` | Misterio de Nuestro Padre Jesús de la Salud | `paso-jesus-salud-osuna` |
| paso | `c0160034-0710-4000-8000-000000000010` | Palio de María Santísima de la Encarnación | `paso-encarnacion-osuna` |
| paso | `c0160034-0711-4000-8000-000000000011` | Paso del Santísimo Cristo de la Misericordia | `paso-cristo-misericordia-osuna` |
| paso | `c0160034-0712-4000-8000-000000000012` | Paso de Nuestro Padre Jesús Caído | `paso-jesus-caido-osuna` |
| paso | `c0160034-0713-4000-8000-000000000013` | Palio de Nuestra Señora y Madre de los Dolores | `paso-dolores-jesus-caido-osuna` |
| paso | `c0160034-0714-4000-8000-000000000014` | Paso de Nuestro Padre Jesús Nazareno | `paso-jesus-nazareno-osuna` |
| paso | `c0160034-0715-4000-8000-000000000015` | Paso de Nuestra Madre y Señora de los Dolores | `paso-dolores-servitas-osuna` |
| paso | `c0160034-0716-4000-8000-000000000016` | Paso de la Quinta Angustia | `paso-quinta-angustia-osuna` |
| paso | `c0160034-0717-4000-8000-000000000017` | Paso del Santo Cristo de la Paz | `paso-cristo-paz-osuna` |
| paso | `c0160034-0718-4000-8000-000000000018` | Palio de María Santísima del Mayor Dolor | `paso-mayor-dolor-osuna` |
| paso | `c0160034-0719-4000-8000-000000000019` | Urna del Cristo Yacente | `urna-cristo-yacente-osuna` |
| paso | `c0160034-0720-4000-8000-000000000020` | Palio de María Santísima en su Soledad y Amargura | `paso-soledad-amargura-osuna` |
| paso | `c0160034-0721-4000-8000-000000000021` | Paso del Triunfo de la Santa Cruz | `paso-canina-osuna` |

## Familias auxiliares

- fuentes: 4;
- lugares: 9;
- brotherhood_images: 27;
- brotherhood_steps: 21;
- image_steps: 23;
- outing_series: 12;
- outings: 12;
- outing_entities: 45;
- posiciones/asignaciones/periodos musicales: 2 / 2 / 2;
- source_links: 87.

## Estado editorial de las ocurrencias

Todas las salidas de Semana Santa 2026 quedan en `announced`. Antes de Apply deberá aportarse evidencia posterior para cada transición a `held`, o aceptarse expresamente ese estado conservador.

## Payload

`supabase/migrations_archive/post-first-edition-editorial/20260920180000_preflight_osuna_septimo_macrolote_hc016.sql`
