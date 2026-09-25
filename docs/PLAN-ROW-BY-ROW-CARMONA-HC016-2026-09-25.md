# Plan row-by-row · Carmona · octavo macrolote municipal HC-016

**Fecha:** 25 de septiembre de 2026  
**Fase:** ROW-BY-ROW CERRADO · SIN DML EJECUTADO  
**Base:** `f1bcda7f2e166038a8d3dc447ce424d959fbb3f9`  
**Rama:** `hc016/carmona-pre-row-by-row`  
**Namespace:** `c0160035-*`  
**Contrato congelado:** **530 DML · 8 REUSE externos · 0 DELETE · 0 DDL · 0 RLS**

## Resumen

| Familia | Operaciones |
|---|---:|
| `sources` | 35 (34 UPSERT + 1 UPDATE/REUSE) |
| `places` | 7 |
| `entities` | 75 |
| `brotherhoods` | 9 |
| `bands` | 6 |
| `images` | 42 |
| `brotherhood_images` | 29 |
| `entity_locations` | 9 |
| `steps` | 18 |
| `brotherhood_steps` | 18 |
| `image_steps` | 31 |
| `outing_series` | 11 |
| `outings` | 12 (11 UPSERT + 1 UPDATE/REUSE) |
| `outing_entities` | 50 |
| `outing_music_positions` | 18 |
| `outing_music_assignments` | 17 |
| `music_accompaniment_periods` | 14 |
| `source_links` | 129 |
| **TOTAL DML** | **530** |

## REUSE externos congelados

| Tipo | UUID | Nodo |
|---|---|---|
| municipio | `bf024af2-3eda-4989-b1b5-0a723dcf9cb4` | Carmona |
| source | `f5c7c0c1-63c8-42b3-b1e8-fac89b01de83` | Servitas Carmona · publicación oficial; se repara URL, no se duplica |
| outing | `ea6ab0d1-e6c4-4ea1-8727-92cee4ce3218` | Procesión del Escapulario · 19/09/2026 |
| band | `c0160032-0402-4000-8000-000000000002` | Agrupación Musical Paz y Caridad de Estepa |
| band | `4e4d493c-5273-44aa-8066-72dd1faa1ed8` | Agrupación Musical Nuestra Señora de Valme de Dos Hermanas |
| band | `97f62582-42f5-4d5f-80e0-376398af98e8` | BCT Santísimo Cristo de la Victoria de León |
| band | `d6852052-92bb-4b54-b551-e52b656dea6d` | Banda Municipal de Música de Mairena del Alcor |
| band | `c0160033-0404-4000-8000-000000000004` | Banda Amor y Sacrificio de Lebrija |

## Exclusiones expresas

- `CAR-F11` queda fuera del payload: es reproducción secundaria de la guía y no aporta una prueba necesaria frente a `CAR-F10`.
- La publicación oficial servita catalogada como `CAR-F26` se **reconcilia con la Fuente ya existente CAR-F12**; no se crea una Fuente duplicada.
- MAFERMAN se crea como entidad Banda por identidad propia documentada, pero **no se crea asignación musical para el 19/09** al no existir prueba posterior explícita de ejecución.
- Desamparados crea una posición publicada **«Sin acompañamiento musical»** y **0 assignments**.
- Las tres posiciones de música de capilla se materializan con `band_name_text = 'Música de capilla'` y sin crear entidad Banda.
- El posible Paso servita del 19/09 permanece `NULL`; no existe `outing_entities` de tipo paso para esa salida.
- La Banda de Rescatado de La Solana se crea con `municipality_id = NULL` y procedencia textual; no se amplía el catálogo de municipios fuera del alcance del lote.

## A. Fuentes

| # | Tabla | Op. | UUID | Fila | Depende de | Fuente | Alcance |
|---:|---|---|---|---|---|---|---|
| 1 | `sources` | **UPSERT** | `c0160035-0101-4000-8000-000000000001` | CAR-F01 · Consejo · Esperanza | — | https://consejohermandadescarmona.es/hdaesperanza/ | Fuente canónica |
| 2 | `sources` | **UPSERT** | `c0160035-0102-4000-8000-000000000002` | CAR-F02 · Consejo · Nuestro Padre | — | https://consejohermandadescarmona.es/hermandad-de-nuestro-padre/ | Fuente canónica |
| 3 | `sources` | **UPSERT** | `c0160035-0103-4000-8000-000000000003` | CAR-F03 · Consejo · Expiración | — | https://consejohermandadescarmona.es/hermandad-de-la-expiracion/ | Fuente canónica |
| 4 | `sources` | **UPSERT** | `c0160035-0104-4000-8000-000000000004` | CAR-F04 · Consejo · Quinta Angustia | — | https://consejohermandadescarmona.es/quinta-angustia-2/ | Fuente canónica |
| 5 | `sources` | **UPSERT** | `c0160035-0105-4000-8000-000000000005` | CAR-F05 · Consejo · Santiago | — | https://consejohermandadescarmona.es/hermandad-de-santiago/ | Fuente canónica |
| 6 | `sources` | **UPSERT** | `c0160035-0106-4000-8000-000000000006` | CAR-F06 · Consejo · Humildad | — | https://consejohermandadescarmona.es/hermandad-de-la-humildad/ | Fuente canónica |
| 7 | `sources` | **UPSERT** | `c0160035-0107-4000-8000-000000000007` | CAR-F07 · Consejo · Amargura / San Felipe | — | https://consejohermandadescarmona.es/san-felipe/ | Fuente canónica |
| 8 | `sources` | **UPSERT** | `c0160035-0108-4000-8000-000000000008` | CAR-F08 · Consejo · Santo Entierro | — | https://consejohermandadescarmona.es/hermandad-del-santo-entierro/ | Fuente canónica |
| 9 | `sources` | **UPSERT** | `c0160035-0109-4000-8000-000000000009` | CAR-F09 · Turismo provincial · Semana Santa de Carmona 2026 | — | https://www.turismosevilla.org/es/eventos-y-fiestas/semana-santa-2026-carmona | Fuente canónica |
| 10 | `sources` | **UPSERT** | `c0160035-0110-4000-8000-000000000010` | CAR-F10 · PDF municipal · Carmona Penitente 2026 | — | https://turismo.carmona.org/wp-content/uploads/Carmona-Penitente-sin-publi-1.pdf | Fuente canónica |
| 11 | `sources` | **UPSERT** | `c0160035-0113-4000-8000-000000000013` | CAR-F13 · TV Carmona · Servitas | — | https://play.televisioncarmona.com/v/Wb1GQFWIeHX0e5LC2q/SERVITAS-REPORTAJE-TVC// | Fuente canónica |
| 12 | `sources` | **UPSERT** | `c0160035-0114-4000-8000-000000000014` | CAR-F14 · TV Carmona · Esperanza | — | https://play.televisioncarmona.com/v/zXMfLnWu4r4Dr4azMF/HERMANDAD-DE-LA-ESPERANZA-REPORTAJE-TVC// | Fuente canónica |
| 13 | `sources` | **UPSERT** | `c0160035-0115-4000-8000-000000000015` | CAR-F15 · TV Carmona · San Felipe | — | https://play.televisioncarmona.com/v/qr2hy93oqRTOHdUYOn/HERMANDAD-DE-SAN-FELIPE-REPORTAJE-TVC// | Fuente canónica |
| 14 | `sources` | **UPSERT** | `c0160035-0116-4000-8000-000000000016` | CAR-F16 · TV Carmona · San Blas | — | https://play.televisioncarmona.com/v/U8chRcbT3j3uDRFP9H/HERMANDAD-DE-SAN-BLAS-REPORTAJE-TVC// | Fuente canónica |
| 15 | `sources` | **UPSERT** | `c0160035-0117-4000-8000-000000000017` | CAR-F17 · TV Carmona · Quinta Angustia | — | https://play.televisioncarmona.com/v/bto3LTLIsgaqKsFfCY/HERMANDAD-DE-LA-QUINTA-ANGUSTIA-REPORTAJE-TVC// | Fuente canónica |
| 16 | `sources` | **UPSERT** | `c0160035-0118-4000-8000-000000000018` | CAR-F18 · TV Carmona · Santiago | — | https://play.televisioncarmona.com/v/8R5I6BUGMu2FqEz73k/HERMANDAD-DE-SANTIAGO-REPORTAJE-TVC// | Fuente canónica |
| 17 | `sources` | **UPSERT** | `c0160035-0119-4000-8000-000000000019` | CAR-F19 · TV Carmona · El Silencio / Nuestro Padre | — | https://play.televisioncarmona.com/v/84jhfcoMZ8YXNuunmL/HERMANDAD-DE-EL-SILENCIO-REPORTAJE-TVC// | Fuente canónica |
| 18 | `sources` | **UPSERT** | `c0160035-0120-4000-8000-000000000020` | CAR-F20 · TV Carmona · Desamparados | — | https://play.televisioncarmona.com/v/LwOZnudoEYetI0gXnn/CRISTO-DE-LOS-DESAMPARADOS-REALIZACION// | Fuente canónica |
| 19 | `sources` | **UPSERT** | `c0160035-0121-4000-8000-000000000021` | CAR-F21 · TV Carmona · San Pedro / Humildad | — | https://play.televisioncarmona.com/v/Imqv1GlpxvEHKd1B9I/HERMANDAD-DE-SAN-PEDRO-REPORTAJE-TVC// | Fuente canónica |
| 20 | `sources` | **UPSERT** | `c0160035-0122-4000-8000-000000000022` | CAR-F22 · TV Carmona · Santo Entierro | — | https://play.televisioncarmona.com/v/d4cj4lCGq1gPR3ixCX/HERMANDAD-DEL-SANTO-ENTIERRO-REPORTAJE-TVC// | Fuente canónica |
| 21 | `sources` | **UPSERT** | `c0160035-0123-4000-8000-000000000023` | CAR-F23 · Servitas Carmona · web oficial | — | https://servitascarmona.com/ | Fuente canónica |
| 22 | `sources` | **UPSERT** | `c0160035-0124-4000-8000-000000000024` | CAR-F24 · TV Carmona · La Borriquita | — | https://play.televisioncarmona.com/v/JeNyAaqE2pPPq7ZqSd/LA-BORRIQUITA-HERMANDAD-DE-LA-HUMILDAD-REPORTAJE-TVC// | Fuente canónica |
| 23 | `sources` | **UPSERT** | `c0160035-0125-4000-8000-000000000025` | CAR-F25 · Paz y Caridad · Semana Santa 2026 | — | https://www.ampazycaridad.com/semana-santa-2026.php | Fuente canónica |
| 24 | `sources` | **UPSERT** | `c0160035-0127-4000-8000-000000000027` | CAR-F27 · Banda Municipal de Mairena · Servitas de Carmona 2026 | — | https://www.youtube.com/watch?v=PCCkBQSM1z8 | Fuente canónica |
| 25 | `sources` | **UPSERT** | `c0160035-0128-4000-8000-000000000028` | CAR-F28 · Amor y Sacrificio · entrevista de dirección | — | https://hermandaddelcastillo.org/wp-content/uploads/2025/04/MAQUETACION-BOLETIN-26-2025-EL-CASTILLO-para-revision-2.pdf | Fuente canónica |
| 26 | `sources` | **UPSERT** | `c0160035-0129-4000-8000-000000000029` | CAR-F29 · TV Carmona · Dosier Corpus Christi 2026 | — | https://www.televisioncarmona.com/noticia/16821/0/DOSIER-INFORMATIVO-CORPUS-CHRISTI-2026-EN-CARMONA/ | Fuente canónica |
| 27 | `sources` | **UPSERT** | `c0160035-0130-4000-8000-000000000030` | CAR-F30 · ArteSacro · Desamparados en silencio | — | https://www.artesacro.org/Noticia.asp?idreg=167327 | Fuente canónica |
| 28 | `sources` | **UPSERT** | `c0160035-0131-4000-8000-000000000031` | CAR-F31 · ArteSacro · Servitas · Procesión del Escapulario 2026 | — | https://www.artesacro.org/Noticia/Ver/169164/provincia-triduo-virgen-dolores-siervos-maria-carmona | Fuente canónica |
| 29 | `sources` | **UPSERT** | `c0160035-0132-4000-8000-000000000032` | CAR-F32 · Federband · Banda de Música Nuestra Señora de Guaditoca | — | https://federband.org/banda/banda-de-musica-nuestra-senora-de-guaditoca | Fuente canónica |
| 30 | `sources` | **UPSERT** | `c0160035-0133-4000-8000-000000000033` | CAR-F33 · Banda Municipal de Aznalcóllar · web oficial | — | https://bmaznalcollar.es/es/ | Fuente canónica |
| 31 | `sources` | **UPSERT** | `c0160035-0134-4000-8000-000000000034` | CAR-F34 · BCT Rescatado La Solana · historia oficial | — | https://rescatadolasolana.es/historia/ | Fuente canónica |
| 32 | `sources` | **UPSERT** | `c0160035-0135-4000-8000-000000000035` | CAR-F35 · Federband · Asociación Cultural Filarmónica El Arrabal | — | https://federband.org/banda/asociacion-cultural-filarmonica-el-arrabal | Fuente canónica |
| 33 | `sources` | **UPSERT** | `c0160035-0136-4000-8000-000000000036` | CAR-F36 · BCT Nuestra Señora de Gracia de Carmona · historia | — | https://bandacarmona.webador.es/historia-1 | Fuente canónica |
| 34 | `sources` | **UPSERT** | `c0160035-0137-4000-8000-000000000037` | CAR-F37 · La Revista Carmona · Maferman bajo un arco iris musical | — | https://www.larevistacarmona.es/texto-diario/mostrar/5943876/ciudadanos-musica-2 | Fuente canónica |
| 35 | `sources` | **UPDATE/REUSE** | `f5c7c0c1-63c8-42b3-b1e8-fac89b01de83` | CAR-F12 · Servitas Carmona · publicación oficial | existente en producción | URL oficial de CAR-F26 | Reparar URL; no inventar fecha si no se recupera de forma exacta |


## B. Lugares

| # | Tabla | Op. | UUID | Fila | Depende de | Fuente | Alcance |
|---:|---|---|---|---|---|---|---|
| 36 | `places` | **UPSERT** | `c0160035-0201-4000-8000-000000000001` | Real Iglesia del Divino Salvador | municipality bf024af2-3eda-4989-b1b5-0a723dcf9cb4 | CAR-F09/CAR-F10 | Sede canónica |
| 37 | `places` | **UPSERT** | `c0160035-0202-4000-8000-000000000002` | Iglesia de San Felipe | municipality bf024af2-3eda-4989-b1b5-0a723dcf9cb4 | CAR-F09/CAR-F10 | Sede canónica |
| 38 | `places` | **UPSERT** | `c0160035-0203-4000-8000-000000000003` | Iglesia de San Blas | municipality bf024af2-3eda-4989-b1b5-0a723dcf9cb4 | CAR-F09/CAR-F10 | Sede canónica |
| 39 | `places` | **UPSERT** | `c0160035-0204-4000-8000-000000000004` | Capilla de San Francisco | municipality bf024af2-3eda-4989-b1b5-0a723dcf9cb4 | CAR-F09/CAR-F10 | Sede canónica |
| 40 | `places` | **UPSERT** | `c0160035-0205-4000-8000-000000000005` | Iglesia de Santiago | municipality bf024af2-3eda-4989-b1b5-0a723dcf9cb4 | CAR-F09/CAR-F10 | Sede canónica |
| 41 | `places` | **UPSERT** | `c0160035-0206-4000-8000-000000000006` | Iglesia de San Bartolomé | municipality bf024af2-3eda-4989-b1b5-0a723dcf9cb4 | CAR-F09/CAR-F10 | Sede canónica |
| 42 | `places` | **UPSERT** | `c0160035-0207-4000-8000-000000000007` | Iglesia de San Pedro | municipality bf024af2-3eda-4989-b1b5-0a723dcf9cb4 | CAR-F09/CAR-F10 | Sede canónica |


## C. Entidades canónicas

| # | Tabla | Op. | UUID | Fila | Depende de | Fuente | Alcance |
|---:|---|---|---|---|---|---|---|
| 43 | `entities` | **UPSERT** | `c0160035-0301-4000-8000-000000000001` | Hermandad/orden · Orden Seglar Servita Carmona | — | CAR-F23 | Nodo público |
| 44 | `entities` | **UPSERT** | `c0160035-0302-4000-8000-000000000002` | Hermandad/orden · Esperanza de Carmona | — | CAR-F01 | Nodo público |
| 45 | `entities` | **UPSERT** | `c0160035-0303-4000-8000-000000000003` | Hermandad/orden · Amargura de Carmona | — | CAR-F07 | Nodo público |
| 46 | `entities` | **UPSERT** | `c0160035-0304-4000-8000-000000000004` | Hermandad/orden · Expiración de Carmona | — | CAR-F03 | Nodo público |
| 47 | `entities` | **UPSERT** | `c0160035-0305-4000-8000-000000000005` | Hermandad/orden · Quinta Angustia de Carmona | — | CAR-F04 | Nodo público |
| 48 | `entities` | **UPSERT** | `c0160035-0306-4000-8000-000000000006` | Hermandad/orden · Santiago de Carmona | — | CAR-F05 | Nodo público |
| 49 | `entities` | **UPSERT** | `c0160035-0307-4000-8000-000000000007` | Hermandad/orden · Nuestro Padre de Carmona | — | CAR-F02 | Nodo público |
| 50 | `entities` | **UPSERT** | `c0160035-0308-4000-8000-000000000008` | Hermandad/orden · Humildad de Carmona | — | CAR-F06 | Nodo público |
| 51 | `entities` | **UPSERT** | `c0160035-0309-4000-8000-000000000009` | Hermandad/orden · Santo Entierro de Carmona | — | CAR-F08 | Nodo público |
| 52 | `entities` | **UPSERT** | `c0160035-0401-4000-8000-000000000001` | Banda · Banda de Música Nuestra Señora de Guaditoca | — | CAR-F32 | Nodo público |
| 53 | `entities` | **UPSERT** | `c0160035-0402-4000-8000-000000000002` | Banda · Banda Municipal de Música de Aznalcóllar | — | CAR-F33 | Nodo público |
| 54 | `entities` | **UPSERT** | `c0160035-0403-4000-8000-000000000003` | Banda · Banda de Cornetas y Tambores Nuestro Padre Jesús Rescatado de La Solana | — | CAR-F34 | Nodo público |
| 55 | `entities` | **UPSERT** | `c0160035-0404-4000-8000-000000000004` | Banda · Banda de Música El Arrabal de Carmona | — | CAR-F35 | Nodo público |
| 56 | `entities` | **UPSERT** | `c0160035-0405-4000-8000-000000000005` | Banda · Banda de Cornetas y Tambores Nuestra Señora de Gracia de Carmona | — | CAR-F36 | Nodo público |
| 57 | `entities` | **UPSERT** | `c0160035-0406-4000-8000-000000000006` | Banda · Banda de Música del Maestro Manuel Fernández Manzanar (MAFERMAN) | — | CAR-F37 | Nodo público |
| 58 | `entities` | **UPSERT** | `c0160035-0601-4000-8000-000000000001` | Imagen titular · María Santísima de los Dolores | — | CAR-F23 | Imagen canónica |
| 59 | `entities` | **UPSERT** | `c0160035-0602-4000-8000-000000000002` | Imagen titular · Nuestro Padre Jesús de la Coronación de Espinas | — | CAR-F01 | Imagen canónica |
| 60 | `entities` | **UPSERT** | `c0160035-0603-4000-8000-000000000003` | Imagen titular · María Santísima de la Esperanza | — | CAR-F01 | Imagen canónica |
| 61 | `entities` | **UPSERT** | `c0160035-0604-4000-8000-000000000004` | Imagen titular · San Juan Evangelista | — | CAR-F01 | Imagen canónica |
| 62 | `entities` | **UPSERT** | `c0160035-0605-4000-8000-000000000005` | Imagen titular · Santísimo Cristo de los Desamparados | — | CAR-F01 | Imagen canónica |
| 63 | `entities` | **UPSERT** | `c0160035-0606-4000-8000-000000000006` | Imagen titular · Señor de la Amargura | — | CAR-F07 | Imagen canónica |
| 64 | `entities` | **UPSERT** | `c0160035-0607-4000-8000-000000000007` | Imagen titular · María Santísima del Mayor Dolor | — | CAR-F07 | Imagen canónica |
| 65 | `entities` | **UPSERT** | `c0160035-0608-4000-8000-000000000008` | Imagen titular · Santísimo Cristo de San Felipe | — | CAR-F07 | Imagen canónica |
| 66 | `entities` | **UPSERT** | `c0160035-0609-4000-8000-000000000009` | Imagen titular · Santísimo Cristo de la Expiración | — | CAR-F03 | Imagen canónica |
| 67 | `entities` | **UPSERT** | `c0160035-0610-4000-8000-000000000010` | Imagen titular · María Santísima de los Dolores | — | CAR-F03 | Imagen canónica |
| 68 | `entities` | **UPSERT** | `c0160035-0611-4000-8000-000000000011` | Imagen titular · Santísimo Cristo del Calvario | — | CAR-F03 | Imagen canónica |
| 69 | `entities` | **UPSERT** | `c0160035-0612-4000-8000-000000000012` | Imagen titular · San Juan Evangelista | — | CAR-F03 | Imagen canónica |
| 70 | `entities` | **UPSERT** | `c0160035-0613-4000-8000-000000000013` | Imagen titular · San Blas | — | CAR-F03 | Imagen canónica |
| 71 | `entities` | **UPSERT** | `c0160035-0614-4000-8000-000000000014` | Imagen titular · Santísimo Cristo del Sagrado Descendimiento | — | CAR-F04 | Imagen canónica |
| 72 | `entities` | **UPSERT** | `c0160035-0615-4000-8000-000000000015` | Imagen titular · Nuestra Señora y Madre de las Angustias | — | CAR-F04 | Imagen canónica |
| 73 | `entities` | **UPSERT** | `c0160035-0616-4000-8000-000000000016` | Imagen titular · Nuestra Señora de los Ángeles | — | CAR-F04 | Imagen canónica |
| 74 | `entities` | **UPSERT** | `c0160035-0617-4000-8000-000000000017` | Imagen titular · Nuestro Padre Jesús Cautivo de Belén | — | CAR-F04 | Imagen canónica |
| 75 | `entities` | **UPSERT** | `c0160035-0618-4000-8000-000000000018` | Imagen titular · Nuestro Padre Jesús en la Columna | — | CAR-F05 | Imagen canónica |
| 76 | `entities` | **UPSERT** | `c0160035-0619-4000-8000-000000000019` | Imagen titular · María Santísima de la Paciencia | — | CAR-F05 | Imagen canónica |
| 77 | `entities` | **UPSERT** | `c0160035-0620-4000-8000-000000000020` | Imagen titular · Nuestro Padre Jesús Nazareno | — | CAR-F02 | Imagen canónica |
| 78 | `entities` | **UPSERT** | `c0160035-0621-4000-8000-000000000021` | Imagen titular · María Santísima de los Dolores | — | CAR-F02 | Imagen canónica |
| 79 | `entities` | **UPSERT** | `c0160035-0622-4000-8000-000000000022` | Imagen titular · Divina Pastora de las Almas | — | CAR-F02 | Imagen canónica |
| 80 | `entities` | **UPSERT** | `c0160035-0623-4000-8000-000000000023` | Imagen titular · Sagrada Entrada de Jesús en Jerusalén | — | CAR-F10 | Imagen canónica |
| 81 | `entities` | **UPSERT** | `c0160035-0624-4000-8000-000000000024` | Imagen titular · Nuestro Padre Jesús de la Humildad y Paciencia | — | CAR-F06 | Imagen canónica |
| 82 | `entities` | **UPSERT** | `c0160035-0625-4000-8000-000000000025` | Imagen titular · María Santísima de los Dolores | — | CAR-F06 | Imagen canónica |
| 83 | `entities` | **UPSERT** | `c0160035-0626-4000-8000-000000000026` | Imagen titular · San Juan Evangelista | — | CAR-F06 | Imagen canónica |
| 84 | `entities` | **UPSERT** | `c0160035-0627-4000-8000-000000000027` | Imagen titular · Santísimo Cristo Yacente | — | CAR-F08 | Imagen canónica |
| 85 | `entities` | **UPSERT** | `c0160035-0628-4000-8000-000000000028` | Imagen titular · María Santísima de la Soledad | — | CAR-F08 | Imagen canónica |
| 86 | `entities` | **UPSERT** | `c0160035-0629-4000-8000-000000000029` | Imagen titular · Santa Ana | — | CAR-F08 | Imagen canónica |
| 87 | `entities` | **UPSERT** | `c0160035-0630-4000-8000-000000000030` | Figura secundaria · Sanedrita del misterio de la Coronación de Espinas | — | CAR-F10 | Composición de paso |
| 88 | `entities` | **UPSERT** | `c0160035-0631-4000-8000-000000000031` | Figura secundaria · Soldado romano I del misterio de la Coronación de Espinas | — | CAR-F10 | Composición de paso |
| 89 | `entities` | **UPSERT** | `c0160035-0632-4000-8000-000000000032` | Figura secundaria · Soldado romano II del misterio de la Coronación de Espinas | — | CAR-F10 | Composición de paso |
| 90 | `entities` | **UPSERT** | `c0160035-0633-4000-8000-000000000033` | Figura secundaria · Poncio Pilatos del misterio de la Coronación de Espinas | — | CAR-F10 | Composición de paso |
| 91 | `entities` | **UPSERT** | `c0160035-0634-4000-8000-000000000034` | Figura secundaria · Dimas del misterio de la Expiración | — | CAR-F10 | Composición de paso |
| 92 | `entities` | **UPSERT** | `c0160035-0635-4000-8000-000000000035` | Figura secundaria · Gestas del misterio de la Expiración | — | CAR-F10 | Composición de paso |
| 93 | `entities` | **UPSERT** | `c0160035-0636-4000-8000-000000000036` | Figura secundaria · María Magdalena del misterio de la Expiración | — | CAR-F10 | Composición de paso |
| 94 | `entities` | **UPSERT** | `c0160035-0637-4000-8000-000000000037` | Figura secundaria · Virgen de las Lágrimas del misterio del Sagrado Descendimiento | — | CAR-F10 | Composición de paso |
| 95 | `entities` | **UPSERT** | `c0160035-0638-4000-8000-000000000038` | Figura secundaria · Sanedrita del misterio de la Columna | — | CAR-F10 | Composición de paso |
| 96 | `entities` | **UPSERT** | `c0160035-0639-4000-8000-000000000039` | Figura secundaria · Sayón del misterio de la Columna | — | CAR-F10 | Composición de paso |
| 97 | `entities` | **UPSERT** | `c0160035-0640-4000-8000-000000000040` | Figura secundaria · Centurión romano del misterio de la Columna | — | CAR-F10 | Composición de paso |
| 98 | `entities` | **UPSERT** | `c0160035-0641-4000-8000-000000000041` | Figura secundaria · José de Arimatea del misterio del Santo Entierro | — | CAR-F10 | Composición de paso |
| 99 | `entities` | **UPSERT** | `c0160035-0642-4000-8000-000000000042` | Figura secundaria · Nicodemo del misterio del Santo Entierro | — | CAR-F10 | Composición de paso |
| 100 | `entities` | **UPSERT** | `c0160035-0701-4000-8000-000000000001` | Paso · Paso de palio de María Santísima de los Dolores | — | CAR-F10 | Paso procesional 2026 |
| 101 | `entities` | **UPSERT** | `c0160035-0702-4000-8000-000000000002` | Paso · Paso de la Sagrada Entrada en Jerusalén · La Borriquita | — | CAR-F10 | Paso procesional 2026 |
| 102 | `entities` | **UPSERT** | `c0160035-0703-4000-8000-000000000003` | Paso · Misterio de la Coronación de Espinas | — | CAR-F10 | Paso procesional 2026 |
| 103 | `entities` | **UPSERT** | `c0160035-0704-4000-8000-000000000004` | Paso · Palio de María Santísima de la Esperanza | — | CAR-F10 | Paso procesional 2026 |
| 104 | `entities` | **UPSERT** | `c0160035-0705-4000-8000-000000000005` | Paso · Paso del Señor de la Amargura | — | CAR-F10 | Paso procesional 2026 |
| 105 | `entities` | **UPSERT** | `c0160035-0706-4000-8000-000000000006` | Paso · Palio de María Santísima del Mayor Dolor | — | CAR-F10 | Paso procesional 2026 |
| 106 | `entities` | **UPSERT** | `c0160035-0707-4000-8000-000000000007` | Paso · Misterio de la Expiración | — | CAR-F10 | Paso procesional 2026 |
| 107 | `entities` | **UPSERT** | `c0160035-0708-4000-8000-000000000008` | Paso · Palio de María Santísima de los Dolores | — | CAR-F10 | Paso procesional 2026 |
| 108 | `entities` | **UPSERT** | `c0160035-0709-4000-8000-000000000009` | Paso · Misterio del Sagrado Descendimiento | — | CAR-F10 | Paso procesional 2026 |
| 109 | `entities` | **UPSERT** | `c0160035-0710-4000-8000-000000000010` | Paso · Palio de Nuestra Señora y Madre de las Angustias | — | CAR-F10 | Paso procesional 2026 |
| 110 | `entities` | **UPSERT** | `c0160035-0711-4000-8000-000000000011` | Paso · Misterio de la Columna | — | CAR-F10 | Paso procesional 2026 |
| 111 | `entities` | **UPSERT** | `c0160035-0712-4000-8000-000000000012` | Paso · Palio de María Santísima de la Paciencia | — | CAR-F10 | Paso procesional 2026 |
| 112 | `entities` | **UPSERT** | `c0160035-0713-4000-8000-000000000013` | Paso · Paso de Nuestro Padre Jesús Nazareno | — | CAR-F10 | Paso procesional 2026 |
| 113 | `entities` | **UPSERT** | `c0160035-0714-4000-8000-000000000014` | Paso · Palio de María Santísima de los Dolores | — | CAR-F10 | Paso procesional 2026 |
| 114 | `entities` | **UPSERT** | `c0160035-0715-4000-8000-000000000015` | Paso · Urna del Santísimo Cristo de los Desamparados | — | CAR-F10 | Paso procesional 2026 |
| 115 | `entities` | **UPSERT** | `c0160035-0716-4000-8000-000000000016` | Paso · Misterio de Nuestro Padre Jesús de la Humildad y Paciencia | — | CAR-F10 | Paso procesional 2026 |
| 116 | `entities` | **UPSERT** | `c0160035-0717-4000-8000-000000000017` | Paso · Palio de María Santísima de los Dolores | — | CAR-F10 | Paso procesional 2026 |
| 117 | `entities` | **UPSERT** | `c0160035-0718-4000-8000-000000000018` | Paso · Misterio del Santo Entierro | — | CAR-F10 | Paso procesional 2026 |


## D. Especialización de corporaciones y bandas

| # | Tabla | Op. | UUID | Fila | Depende de | Fuente | Alcance |
|---:|---|---|---|---|---|---|---|
| 118 | `brotherhoods` | **UPSERT** | `c0160035-0301-4000-8000-000000000001` | Orden Seglar Servita Carmona | entity c0160035-0301-4000-8000-000000000001; place c0160035-0201-4000-8000-000000000001 | CAR-F23 | Corporación de Carmona |
| 119 | `brotherhoods` | **UPSERT** | `c0160035-0302-4000-8000-000000000002` | Esperanza de Carmona | entity c0160035-0302-4000-8000-000000000002; place c0160035-0201-4000-8000-000000000001 | CAR-F01 | Corporación de Carmona |
| 120 | `brotherhoods` | **UPSERT** | `c0160035-0303-4000-8000-000000000003` | Amargura de Carmona | entity c0160035-0303-4000-8000-000000000003; place c0160035-0202-4000-8000-000000000002 | CAR-F07 | Corporación de Carmona |
| 121 | `brotherhoods` | **UPSERT** | `c0160035-0304-4000-8000-000000000004` | Expiración de Carmona | entity c0160035-0304-4000-8000-000000000004; place c0160035-0203-4000-8000-000000000003 | CAR-F03 | Corporación de Carmona |
| 122 | `brotherhoods` | **UPSERT** | `c0160035-0305-4000-8000-000000000005` | Quinta Angustia de Carmona | entity c0160035-0305-4000-8000-000000000005; place c0160035-0204-4000-8000-000000000004 | CAR-F04 | Corporación de Carmona |
| 123 | `brotherhoods` | **UPSERT** | `c0160035-0306-4000-8000-000000000006` | Santiago de Carmona | entity c0160035-0306-4000-8000-000000000006; place c0160035-0205-4000-8000-000000000005 | CAR-F05 | Corporación de Carmona |
| 124 | `brotherhoods` | **UPSERT** | `c0160035-0307-4000-8000-000000000007` | Nuestro Padre de Carmona | entity c0160035-0307-4000-8000-000000000007; place c0160035-0206-4000-8000-000000000006 | CAR-F02 | Corporación de Carmona |
| 125 | `brotherhoods` | **UPSERT** | `c0160035-0308-4000-8000-000000000008` | Humildad de Carmona | entity c0160035-0308-4000-8000-000000000008; place c0160035-0207-4000-8000-000000000007 | CAR-F06 | Corporación de Carmona |
| 126 | `brotherhoods` | **UPSERT** | `c0160035-0309-4000-8000-000000000009` | Santo Entierro de Carmona | entity c0160035-0309-4000-8000-000000000009; place c0160035-0206-4000-8000-000000000006 | CAR-F08 | Corporación de Carmona |
| 127 | `bands` | **UPSERT** | `c0160035-0401-4000-8000-000000000001` | Banda de Música Nuestra Señora de Guaditoca · Banda de Música | entity c0160035-0401-4000-8000-000000000001; municipality 6ad7b2d3-6bbd-4b41-a7e7-bc2286608c99 | CAR-F32 | Identidad de Banda |
| 128 | `bands` | **UPSERT** | `c0160035-0402-4000-8000-000000000002` | Banda Municipal de Música de Aznalcóllar · Banda de Música | entity c0160035-0402-4000-8000-000000000002; municipality 88ca0e56-bf93-4ac0-a72c-b2bee7a8e4d8 | CAR-F33 | Identidad de Banda |
| 129 | `bands` | **UPSERT** | `c0160035-0403-4000-8000-000000000003` | Banda de Cornetas y Tambores Nuestro Padre Jesús Rescatado de La Solana · Cornetas y Tambores | entity c0160035-0403-4000-8000-000000000003; municipality NULL | CAR-F34 | Municipio textual; no crear municipio fuera del catálogo actual |
| 130 | `bands` | **UPSERT** | `c0160035-0404-4000-8000-000000000004` | Banda de Música El Arrabal de Carmona · Banda de Música | entity c0160035-0404-4000-8000-000000000004; municipality bf024af2-3eda-4989-b1b5-0a723dcf9cb4 | CAR-F35 | Identidad de Banda |
| 131 | `bands` | **UPSERT** | `c0160035-0405-4000-8000-000000000005` | Banda de Cornetas y Tambores Nuestra Señora de Gracia de Carmona · Cornetas y Tambores | entity c0160035-0405-4000-8000-000000000005; municipality bf024af2-3eda-4989-b1b5-0a723dcf9cb4 | CAR-F36 | Identidad de Banda |
| 132 | `bands` | **UPSERT** | `c0160035-0406-4000-8000-000000000006` | Banda de Música del Maestro Manuel Fernández Manzanar (MAFERMAN) · Banda de Música | entity c0160035-0406-4000-8000-000000000006; municipality bf024af2-3eda-4989-b1b5-0a723dcf9cb4 | CAR-F37 | Identidad de Banda |


## E. Imágenes, titularidades y sedes

| # | Tabla | Op. | UUID | Fila | Depende de | Fuente | Alcance |
|---:|---|---|---|---|---|---|---|
| 133 | `images` | **UPSERT** | `c0160035-0601-4000-8000-000000000001` | María Santísima de los Dolores | entity c0160035-0601-4000-8000-000000000001 | CAR-F23 | Imagen titular |
| 134 | `images` | **UPSERT** | `c0160035-0602-4000-8000-000000000002` | Nuestro Padre Jesús de la Coronación de Espinas | entity c0160035-0602-4000-8000-000000000002 | CAR-F01 | Imagen titular |
| 135 | `images` | **UPSERT** | `c0160035-0603-4000-8000-000000000003` | María Santísima de la Esperanza | entity c0160035-0603-4000-8000-000000000003 | CAR-F01 | Imagen titular |
| 136 | `images` | **UPSERT** | `c0160035-0604-4000-8000-000000000004` | San Juan Evangelista | entity c0160035-0604-4000-8000-000000000004 | CAR-F01 | Imagen titular |
| 137 | `images` | **UPSERT** | `c0160035-0605-4000-8000-000000000005` | Santísimo Cristo de los Desamparados | entity c0160035-0605-4000-8000-000000000005 | CAR-F01 | Imagen titular |
| 138 | `images` | **UPSERT** | `c0160035-0606-4000-8000-000000000006` | Señor de la Amargura | entity c0160035-0606-4000-8000-000000000006 | CAR-F07 | Imagen titular |
| 139 | `images` | **UPSERT** | `c0160035-0607-4000-8000-000000000007` | María Santísima del Mayor Dolor | entity c0160035-0607-4000-8000-000000000007 | CAR-F07 | Imagen titular |
| 140 | `images` | **UPSERT** | `c0160035-0608-4000-8000-000000000008` | Santísimo Cristo de San Felipe | entity c0160035-0608-4000-8000-000000000008 | CAR-F07 | Imagen titular |
| 141 | `images` | **UPSERT** | `c0160035-0609-4000-8000-000000000009` | Santísimo Cristo de la Expiración | entity c0160035-0609-4000-8000-000000000009 | CAR-F03 | Imagen titular |
| 142 | `images` | **UPSERT** | `c0160035-0610-4000-8000-000000000010` | María Santísima de los Dolores | entity c0160035-0610-4000-8000-000000000010 | CAR-F03 | Imagen titular |
| 143 | `images` | **UPSERT** | `c0160035-0611-4000-8000-000000000011` | Santísimo Cristo del Calvario | entity c0160035-0611-4000-8000-000000000011 | CAR-F03 | Imagen titular |
| 144 | `images` | **UPSERT** | `c0160035-0612-4000-8000-000000000012` | San Juan Evangelista | entity c0160035-0612-4000-8000-000000000012 | CAR-F03 | Imagen titular |
| 145 | `images` | **UPSERT** | `c0160035-0613-4000-8000-000000000013` | San Blas | entity c0160035-0613-4000-8000-000000000013 | CAR-F03 | Imagen titular |
| 146 | `images` | **UPSERT** | `c0160035-0614-4000-8000-000000000014` | Santísimo Cristo del Sagrado Descendimiento | entity c0160035-0614-4000-8000-000000000014 | CAR-F04 | Imagen titular |
| 147 | `images` | **UPSERT** | `c0160035-0615-4000-8000-000000000015` | Nuestra Señora y Madre de las Angustias | entity c0160035-0615-4000-8000-000000000015 | CAR-F04 | Imagen titular |
| 148 | `images` | **UPSERT** | `c0160035-0616-4000-8000-000000000016` | Nuestra Señora de los Ángeles | entity c0160035-0616-4000-8000-000000000016 | CAR-F04 | Imagen titular |
| 149 | `images` | **UPSERT** | `c0160035-0617-4000-8000-000000000017` | Nuestro Padre Jesús Cautivo de Belén | entity c0160035-0617-4000-8000-000000000017 | CAR-F04 | Imagen titular |
| 150 | `images` | **UPSERT** | `c0160035-0618-4000-8000-000000000018` | Nuestro Padre Jesús en la Columna | entity c0160035-0618-4000-8000-000000000018 | CAR-F05 | Imagen titular |
| 151 | `images` | **UPSERT** | `c0160035-0619-4000-8000-000000000019` | María Santísima de la Paciencia | entity c0160035-0619-4000-8000-000000000019 | CAR-F05 | Imagen titular |
| 152 | `images` | **UPSERT** | `c0160035-0620-4000-8000-000000000020` | Nuestro Padre Jesús Nazareno | entity c0160035-0620-4000-8000-000000000020 | CAR-F02 | Imagen titular |
| 153 | `images` | **UPSERT** | `c0160035-0621-4000-8000-000000000021` | María Santísima de los Dolores | entity c0160035-0621-4000-8000-000000000021 | CAR-F02 | Imagen titular |
| 154 | `images` | **UPSERT** | `c0160035-0622-4000-8000-000000000022` | Divina Pastora de las Almas | entity c0160035-0622-4000-8000-000000000022 | CAR-F02 | Imagen titular |
| 155 | `images` | **UPSERT** | `c0160035-0623-4000-8000-000000000023` | Sagrada Entrada de Jesús en Jerusalén | entity c0160035-0623-4000-8000-000000000023 | CAR-F10 | Imagen titular |
| 156 | `images` | **UPSERT** | `c0160035-0624-4000-8000-000000000024` | Nuestro Padre Jesús de la Humildad y Paciencia | entity c0160035-0624-4000-8000-000000000024 | CAR-F06 | Imagen titular |
| 157 | `images` | **UPSERT** | `c0160035-0625-4000-8000-000000000025` | María Santísima de los Dolores | entity c0160035-0625-4000-8000-000000000025 | CAR-F06 | Imagen titular |
| 158 | `images` | **UPSERT** | `c0160035-0626-4000-8000-000000000026` | San Juan Evangelista | entity c0160035-0626-4000-8000-000000000026 | CAR-F06 | Imagen titular |
| 159 | `images` | **UPSERT** | `c0160035-0627-4000-8000-000000000027` | Santísimo Cristo Yacente | entity c0160035-0627-4000-8000-000000000027 | CAR-F08 | Imagen titular |
| 160 | `images` | **UPSERT** | `c0160035-0628-4000-8000-000000000028` | María Santísima de la Soledad | entity c0160035-0628-4000-8000-000000000028 | CAR-F08 | Imagen titular |
| 161 | `images` | **UPSERT** | `c0160035-0629-4000-8000-000000000029` | Santa Ana | entity c0160035-0629-4000-8000-000000000029 | CAR-F08 | Imagen titular |
| 162 | `images` | **UPSERT** | `c0160035-0630-4000-8000-000000000030` | Sanedrita del misterio de la Coronación de Espinas | entity c0160035-0630-4000-8000-000000000030 | CAR-F10 | Figura secundaria del paso |
| 163 | `images` | **UPSERT** | `c0160035-0631-4000-8000-000000000031` | Soldado romano I del misterio de la Coronación de Espinas | entity c0160035-0631-4000-8000-000000000031 | CAR-F10 | Figura secundaria del paso |
| 164 | `images` | **UPSERT** | `c0160035-0632-4000-8000-000000000032` | Soldado romano II del misterio de la Coronación de Espinas | entity c0160035-0632-4000-8000-000000000032 | CAR-F10 | Figura secundaria del paso |
| 165 | `images` | **UPSERT** | `c0160035-0633-4000-8000-000000000033` | Poncio Pilatos del misterio de la Coronación de Espinas | entity c0160035-0633-4000-8000-000000000033 | CAR-F10 | Figura secundaria del paso |
| 166 | `images` | **UPSERT** | `c0160035-0634-4000-8000-000000000034` | Dimas del misterio de la Expiración | entity c0160035-0634-4000-8000-000000000034 | CAR-F10 | Figura secundaria del paso |
| 167 | `images` | **UPSERT** | `c0160035-0635-4000-8000-000000000035` | Gestas del misterio de la Expiración | entity c0160035-0635-4000-8000-000000000035 | CAR-F10 | Figura secundaria del paso |
| 168 | `images` | **UPSERT** | `c0160035-0636-4000-8000-000000000036` | María Magdalena del misterio de la Expiración | entity c0160035-0636-4000-8000-000000000036 | CAR-F10 | Figura secundaria del paso |
| 169 | `images` | **UPSERT** | `c0160035-0637-4000-8000-000000000037` | Virgen de las Lágrimas del misterio del Sagrado Descendimiento | entity c0160035-0637-4000-8000-000000000037 | CAR-F10 | Figura secundaria del paso |
| 170 | `images` | **UPSERT** | `c0160035-0638-4000-8000-000000000038` | Sanedrita del misterio de la Columna | entity c0160035-0638-4000-8000-000000000038 | CAR-F10 | Figura secundaria del paso |
| 171 | `images` | **UPSERT** | `c0160035-0639-4000-8000-000000000039` | Sayón del misterio de la Columna | entity c0160035-0639-4000-8000-000000000039 | CAR-F10 | Figura secundaria del paso |
| 172 | `images` | **UPSERT** | `c0160035-0640-4000-8000-000000000040` | Centurión romano del misterio de la Columna | entity c0160035-0640-4000-8000-000000000040 | CAR-F10 | Figura secundaria del paso |
| 173 | `images` | **UPSERT** | `c0160035-0641-4000-8000-000000000041` | José de Arimatea del misterio del Santo Entierro | entity c0160035-0641-4000-8000-000000000041 | CAR-F10 | Figura secundaria del paso |
| 174 | `images` | **UPSERT** | `c0160035-0642-4000-8000-000000000042` | Nicodemo del misterio del Santo Entierro | entity c0160035-0642-4000-8000-000000000042 | CAR-F10 | Figura secundaria del paso |
| 175 | `brotherhood_images` | **UPSERT** | `c0160035-0801-4000-8000-000000000001` | Orden Seglar Servita Carmona ↔ María Santísima de los Dolores | c0160035-0301-4000-8000-000000000001; c0160035-0601-4000-8000-000000000001 | CAR-F23 | titular |
| 176 | `brotherhood_images` | **UPSERT** | `c0160035-0802-4000-8000-000000000002` | Esperanza de Carmona ↔ Nuestro Padre Jesús de la Coronación de Espinas | c0160035-0302-4000-8000-000000000002; c0160035-0602-4000-8000-000000000002 | CAR-F01 | titular |
| 177 | `brotherhood_images` | **UPSERT** | `c0160035-0803-4000-8000-000000000003` | Esperanza de Carmona ↔ María Santísima de la Esperanza | c0160035-0302-4000-8000-000000000002; c0160035-0603-4000-8000-000000000003 | CAR-F01 | titular |
| 178 | `brotherhood_images` | **UPSERT** | `c0160035-0804-4000-8000-000000000004` | Esperanza de Carmona ↔ San Juan Evangelista | c0160035-0302-4000-8000-000000000002; c0160035-0604-4000-8000-000000000004 | CAR-F01 | titular |
| 179 | `brotherhood_images` | **UPSERT** | `c0160035-0805-4000-8000-000000000005` | Esperanza de Carmona ↔ Santísimo Cristo de los Desamparados | c0160035-0302-4000-8000-000000000002; c0160035-0605-4000-8000-000000000005 | CAR-F01 | titular |
| 180 | `brotherhood_images` | **UPSERT** | `c0160035-0806-4000-8000-000000000006` | Amargura de Carmona ↔ Señor de la Amargura | c0160035-0303-4000-8000-000000000003; c0160035-0606-4000-8000-000000000006 | CAR-F07 | titular |
| 181 | `brotherhood_images` | **UPSERT** | `c0160035-0807-4000-8000-000000000007` | Amargura de Carmona ↔ María Santísima del Mayor Dolor | c0160035-0303-4000-8000-000000000003; c0160035-0607-4000-8000-000000000007 | CAR-F07 | titular |
| 182 | `brotherhood_images` | **UPSERT** | `c0160035-0808-4000-8000-000000000008` | Amargura de Carmona ↔ Santísimo Cristo de San Felipe | c0160035-0303-4000-8000-000000000003; c0160035-0608-4000-8000-000000000008 | CAR-F07 | titular |
| 183 | `brotherhood_images` | **UPSERT** | `c0160035-0809-4000-8000-000000000009` | Expiración de Carmona ↔ Santísimo Cristo de la Expiración | c0160035-0304-4000-8000-000000000004; c0160035-0609-4000-8000-000000000009 | CAR-F03 | titular |
| 184 | `brotherhood_images` | **UPSERT** | `c0160035-0810-4000-8000-000000000010` | Expiración de Carmona ↔ María Santísima de los Dolores | c0160035-0304-4000-8000-000000000004; c0160035-0610-4000-8000-000000000010 | CAR-F03 | titular |
| 185 | `brotherhood_images` | **UPSERT** | `c0160035-0811-4000-8000-000000000011` | Expiración de Carmona ↔ Santísimo Cristo del Calvario | c0160035-0304-4000-8000-000000000004; c0160035-0611-4000-8000-000000000011 | CAR-F03 | titular |
| 186 | `brotherhood_images` | **UPSERT** | `c0160035-0812-4000-8000-000000000012` | Expiración de Carmona ↔ San Juan Evangelista | c0160035-0304-4000-8000-000000000004; c0160035-0612-4000-8000-000000000012 | CAR-F03 | titular |
| 187 | `brotherhood_images` | **UPSERT** | `c0160035-0813-4000-8000-000000000013` | Expiración de Carmona ↔ San Blas | c0160035-0304-4000-8000-000000000004; c0160035-0613-4000-8000-000000000013 | CAR-F03 | titular |
| 188 | `brotherhood_images` | **UPSERT** | `c0160035-0814-4000-8000-000000000014` | Quinta Angustia de Carmona ↔ Santísimo Cristo del Sagrado Descendimiento | c0160035-0305-4000-8000-000000000005; c0160035-0614-4000-8000-000000000014 | CAR-F04 | titular |
| 189 | `brotherhood_images` | **UPSERT** | `c0160035-0815-4000-8000-000000000015` | Quinta Angustia de Carmona ↔ Nuestra Señora y Madre de las Angustias | c0160035-0305-4000-8000-000000000005; c0160035-0615-4000-8000-000000000015 | CAR-F04 | titular |
| 190 | `brotherhood_images` | **UPSERT** | `c0160035-0816-4000-8000-000000000016` | Quinta Angustia de Carmona ↔ Nuestra Señora de los Ángeles | c0160035-0305-4000-8000-000000000005; c0160035-0616-4000-8000-000000000016 | CAR-F04 | titular |
| 191 | `brotherhood_images` | **UPSERT** | `c0160035-0817-4000-8000-000000000017` | Quinta Angustia de Carmona ↔ Nuestro Padre Jesús Cautivo de Belén | c0160035-0305-4000-8000-000000000005; c0160035-0617-4000-8000-000000000017 | CAR-F04 | titular |
| 192 | `brotherhood_images` | **UPSERT** | `c0160035-0818-4000-8000-000000000018` | Santiago de Carmona ↔ Nuestro Padre Jesús en la Columna | c0160035-0306-4000-8000-000000000006; c0160035-0618-4000-8000-000000000018 | CAR-F05 | titular |
| 193 | `brotherhood_images` | **UPSERT** | `c0160035-0819-4000-8000-000000000019` | Santiago de Carmona ↔ María Santísima de la Paciencia | c0160035-0306-4000-8000-000000000006; c0160035-0619-4000-8000-000000000019 | CAR-F05 | titular |
| 194 | `brotherhood_images` | **UPSERT** | `c0160035-0820-4000-8000-000000000020` | Nuestro Padre de Carmona ↔ Nuestro Padre Jesús Nazareno | c0160035-0307-4000-8000-000000000007; c0160035-0620-4000-8000-000000000020 | CAR-F02 | titular |
| 195 | `brotherhood_images` | **UPSERT** | `c0160035-0821-4000-8000-000000000021` | Nuestro Padre de Carmona ↔ María Santísima de los Dolores | c0160035-0307-4000-8000-000000000007; c0160035-0621-4000-8000-000000000021 | CAR-F02 | titular |
| 196 | `brotherhood_images` | **UPSERT** | `c0160035-0822-4000-8000-000000000022` | Nuestro Padre de Carmona ↔ Divina Pastora de las Almas | c0160035-0307-4000-8000-000000000007; c0160035-0622-4000-8000-000000000022 | CAR-F02 | titular |
| 197 | `brotherhood_images` | **UPSERT** | `c0160035-0823-4000-8000-000000000023` | Humildad de Carmona ↔ Sagrada Entrada de Jesús en Jerusalén | c0160035-0308-4000-8000-000000000008; c0160035-0623-4000-8000-000000000023 | CAR-F10 | titular |
| 198 | `brotherhood_images` | **UPSERT** | `c0160035-0824-4000-8000-000000000024` | Humildad de Carmona ↔ Nuestro Padre Jesús de la Humildad y Paciencia | c0160035-0308-4000-8000-000000000008; c0160035-0624-4000-8000-000000000024 | CAR-F06 | titular |
| 199 | `brotherhood_images` | **UPSERT** | `c0160035-0825-4000-8000-000000000025` | Humildad de Carmona ↔ María Santísima de los Dolores | c0160035-0308-4000-8000-000000000008; c0160035-0625-4000-8000-000000000025 | CAR-F06 | titular |
| 200 | `brotherhood_images` | **UPSERT** | `c0160035-0826-4000-8000-000000000026` | Humildad de Carmona ↔ San Juan Evangelista | c0160035-0308-4000-8000-000000000008; c0160035-0626-4000-8000-000000000026 | CAR-F06 | titular |
| 201 | `brotherhood_images` | **UPSERT** | `c0160035-0827-4000-8000-000000000027` | Santo Entierro de Carmona ↔ Santísimo Cristo Yacente | c0160035-0309-4000-8000-000000000009; c0160035-0627-4000-8000-000000000027 | CAR-F08 | titular |
| 202 | `brotherhood_images` | **UPSERT** | `c0160035-0828-4000-8000-000000000028` | Santo Entierro de Carmona ↔ María Santísima de la Soledad | c0160035-0309-4000-8000-000000000009; c0160035-0628-4000-8000-000000000028 | CAR-F08 | titular |
| 203 | `brotherhood_images` | **UPSERT** | `c0160035-0829-4000-8000-000000000029` | Santo Entierro de Carmona ↔ Santa Ana | c0160035-0309-4000-8000-000000000009; c0160035-0629-4000-8000-000000000029 | CAR-F08 | titular |
| 204 | `entity_locations` | **UPSERT** | `c0160035-0831-4000-8000-000000000001` | Orden Seglar Servita Carmona ↔ Real Iglesia del Divino Salvador | c0160035-0301-4000-8000-000000000001; c0160035-0201-4000-8000-000000000001 | CAR-F23 | sede actual |
| 205 | `entity_locations` | **UPSERT** | `c0160035-0832-4000-8000-000000000002` | Esperanza de Carmona ↔ Real Iglesia del Divino Salvador | c0160035-0302-4000-8000-000000000002; c0160035-0201-4000-8000-000000000001 | CAR-F01 | sede actual |
| 206 | `entity_locations` | **UPSERT** | `c0160035-0833-4000-8000-000000000003` | Amargura de Carmona ↔ Iglesia de San Felipe | c0160035-0303-4000-8000-000000000003; c0160035-0202-4000-8000-000000000002 | CAR-F07 | sede actual |
| 207 | `entity_locations` | **UPSERT** | `c0160035-0834-4000-8000-000000000004` | Expiración de Carmona ↔ Iglesia de San Blas | c0160035-0304-4000-8000-000000000004; c0160035-0203-4000-8000-000000000003 | CAR-F03 | sede actual |
| 208 | `entity_locations` | **UPSERT** | `c0160035-0835-4000-8000-000000000005` | Quinta Angustia de Carmona ↔ Capilla de San Francisco | c0160035-0305-4000-8000-000000000005; c0160035-0204-4000-8000-000000000004 | CAR-F04 | sede actual |
| 209 | `entity_locations` | **UPSERT** | `c0160035-0836-4000-8000-000000000006` | Santiago de Carmona ↔ Iglesia de Santiago | c0160035-0306-4000-8000-000000000006; c0160035-0205-4000-8000-000000000005 | CAR-F05 | sede actual |
| 210 | `entity_locations` | **UPSERT** | `c0160035-0837-4000-8000-000000000007` | Nuestro Padre de Carmona ↔ Iglesia de San Bartolomé | c0160035-0307-4000-8000-000000000007; c0160035-0206-4000-8000-000000000006 | CAR-F02 | sede actual |
| 211 | `entity_locations` | **UPSERT** | `c0160035-0838-4000-8000-000000000008` | Humildad de Carmona ↔ Iglesia de San Pedro | c0160035-0308-4000-8000-000000000008; c0160035-0207-4000-8000-000000000007 | CAR-F06 | sede actual |
| 212 | `entity_locations` | **UPSERT** | `c0160035-0839-4000-8000-000000000009` | Santo Entierro de Carmona ↔ Iglesia de San Bartolomé | c0160035-0309-4000-8000-000000000009; c0160035-0206-4000-8000-000000000006 | CAR-F08 | sede actual |


## F. Pasos y composición

| # | Tabla | Op. | UUID | Fila | Depende de | Fuente | Alcance |
|---:|---|---|---|---|---|---|---|
| 213 | `steps` | **UPSERT** | `c0160035-0701-4000-8000-000000000001` | Paso de palio de María Santísima de los Dolores | entity c0160035-0701-4000-8000-000000000001 | CAR-F10 | Paso procesional |
| 214 | `steps` | **UPSERT** | `c0160035-0702-4000-8000-000000000002` | Paso de la Sagrada Entrada en Jerusalén · La Borriquita | entity c0160035-0702-4000-8000-000000000002 | CAR-F10 | Paso procesional |
| 215 | `steps` | **UPSERT** | `c0160035-0703-4000-8000-000000000003` | Misterio de la Coronación de Espinas | entity c0160035-0703-4000-8000-000000000003 | CAR-F10 | Paso procesional |
| 216 | `steps` | **UPSERT** | `c0160035-0704-4000-8000-000000000004` | Palio de María Santísima de la Esperanza | entity c0160035-0704-4000-8000-000000000004 | CAR-F10 | Paso procesional |
| 217 | `steps` | **UPSERT** | `c0160035-0705-4000-8000-000000000005` | Paso del Señor de la Amargura | entity c0160035-0705-4000-8000-000000000005 | CAR-F10 | Paso procesional |
| 218 | `steps` | **UPSERT** | `c0160035-0706-4000-8000-000000000006` | Palio de María Santísima del Mayor Dolor | entity c0160035-0706-4000-8000-000000000006 | CAR-F10 | Paso procesional |
| 219 | `steps` | **UPSERT** | `c0160035-0707-4000-8000-000000000007` | Misterio de la Expiración | entity c0160035-0707-4000-8000-000000000007 | CAR-F10 | Paso procesional |
| 220 | `steps` | **UPSERT** | `c0160035-0708-4000-8000-000000000008` | Palio de María Santísima de los Dolores | entity c0160035-0708-4000-8000-000000000008 | CAR-F10 | Paso procesional |
| 221 | `steps` | **UPSERT** | `c0160035-0709-4000-8000-000000000009` | Misterio del Sagrado Descendimiento | entity c0160035-0709-4000-8000-000000000009 | CAR-F10 | Paso procesional |
| 222 | `steps` | **UPSERT** | `c0160035-0710-4000-8000-000000000010` | Palio de Nuestra Señora y Madre de las Angustias | entity c0160035-0710-4000-8000-000000000010 | CAR-F10 | Paso procesional |
| 223 | `steps` | **UPSERT** | `c0160035-0711-4000-8000-000000000011` | Misterio de la Columna | entity c0160035-0711-4000-8000-000000000011 | CAR-F10 | Paso procesional |
| 224 | `steps` | **UPSERT** | `c0160035-0712-4000-8000-000000000012` | Palio de María Santísima de la Paciencia | entity c0160035-0712-4000-8000-000000000012 | CAR-F10 | Paso procesional |
| 225 | `steps` | **UPSERT** | `c0160035-0713-4000-8000-000000000013` | Paso de Nuestro Padre Jesús Nazareno | entity c0160035-0713-4000-8000-000000000013 | CAR-F10 | Paso procesional |
| 226 | `steps` | **UPSERT** | `c0160035-0714-4000-8000-000000000014` | Palio de María Santísima de los Dolores | entity c0160035-0714-4000-8000-000000000014 | CAR-F10 | Paso procesional |
| 227 | `steps` | **UPSERT** | `c0160035-0715-4000-8000-000000000015` | Urna del Santísimo Cristo de los Desamparados | entity c0160035-0715-4000-8000-000000000015 | CAR-F10 | Paso procesional |
| 228 | `steps` | **UPSERT** | `c0160035-0716-4000-8000-000000000016` | Misterio de Nuestro Padre Jesús de la Humildad y Paciencia | entity c0160035-0716-4000-8000-000000000016 | CAR-F10 | Paso procesional |
| 229 | `steps` | **UPSERT** | `c0160035-0717-4000-8000-000000000017` | Palio de María Santísima de los Dolores | entity c0160035-0717-4000-8000-000000000017 | CAR-F10 | Paso procesional |
| 230 | `steps` | **UPSERT** | `c0160035-0718-4000-8000-000000000018` | Misterio del Santo Entierro | entity c0160035-0718-4000-8000-000000000018 | CAR-F10 | Paso procesional |
| 231 | `brotherhood_steps` | **UPSERT** | `c0160035-0841-4000-8000-000000000001` | Orden Seglar Servita Carmona ↔ Paso de palio de María Santísima de los Dolores | c0160035-0301-4000-8000-000000000001; c0160035-0701-4000-8000-000000000001 | CAR-F10 | processional_step |
| 232 | `brotherhood_steps` | **UPSERT** | `c0160035-0842-4000-8000-000000000002` | Humildad de Carmona ↔ Paso de la Sagrada Entrada en Jerusalén · La Borriquita | c0160035-0308-4000-8000-000000000008; c0160035-0702-4000-8000-000000000002 | CAR-F10 | processional_step |
| 233 | `brotherhood_steps` | **UPSERT** | `c0160035-0843-4000-8000-000000000003` | Esperanza de Carmona ↔ Misterio de la Coronación de Espinas | c0160035-0302-4000-8000-000000000002; c0160035-0703-4000-8000-000000000003 | CAR-F10 | processional_step |
| 234 | `brotherhood_steps` | **UPSERT** | `c0160035-0844-4000-8000-000000000004` | Esperanza de Carmona ↔ Palio de María Santísima de la Esperanza | c0160035-0302-4000-8000-000000000002; c0160035-0704-4000-8000-000000000004 | CAR-F10 | processional_step |
| 235 | `brotherhood_steps` | **UPSERT** | `c0160035-0845-4000-8000-000000000005` | Amargura de Carmona ↔ Paso del Señor de la Amargura | c0160035-0303-4000-8000-000000000003; c0160035-0705-4000-8000-000000000005 | CAR-F10 | processional_step |
| 236 | `brotherhood_steps` | **UPSERT** | `c0160035-0846-4000-8000-000000000006` | Amargura de Carmona ↔ Palio de María Santísima del Mayor Dolor | c0160035-0303-4000-8000-000000000003; c0160035-0706-4000-8000-000000000006 | CAR-F10 | processional_step |
| 237 | `brotherhood_steps` | **UPSERT** | `c0160035-0847-4000-8000-000000000007` | Expiración de Carmona ↔ Misterio de la Expiración | c0160035-0304-4000-8000-000000000004; c0160035-0707-4000-8000-000000000007 | CAR-F10 | processional_step |
| 238 | `brotherhood_steps` | **UPSERT** | `c0160035-0848-4000-8000-000000000008` | Expiración de Carmona ↔ Palio de María Santísima de los Dolores | c0160035-0304-4000-8000-000000000004; c0160035-0708-4000-8000-000000000008 | CAR-F10 | processional_step |
| 239 | `brotherhood_steps` | **UPSERT** | `c0160035-0849-4000-8000-000000000009` | Quinta Angustia de Carmona ↔ Misterio del Sagrado Descendimiento | c0160035-0305-4000-8000-000000000005; c0160035-0709-4000-8000-000000000009 | CAR-F10 | processional_step |
| 240 | `brotherhood_steps` | **UPSERT** | `c0160035-0850-4000-8000-000000000010` | Quinta Angustia de Carmona ↔ Palio de Nuestra Señora y Madre de las Angustias | c0160035-0305-4000-8000-000000000005; c0160035-0710-4000-8000-000000000010 | CAR-F10 | processional_step |
| 241 | `brotherhood_steps` | **UPSERT** | `c0160035-0851-4000-8000-000000000011` | Santiago de Carmona ↔ Misterio de la Columna | c0160035-0306-4000-8000-000000000006; c0160035-0711-4000-8000-000000000011 | CAR-F10 | processional_step |
| 242 | `brotherhood_steps` | **UPSERT** | `c0160035-0852-4000-8000-000000000012` | Santiago de Carmona ↔ Palio de María Santísima de la Paciencia | c0160035-0306-4000-8000-000000000006; c0160035-0712-4000-8000-000000000012 | CAR-F10 | processional_step |
| 243 | `brotherhood_steps` | **UPSERT** | `c0160035-0853-4000-8000-000000000013` | Nuestro Padre de Carmona ↔ Paso de Nuestro Padre Jesús Nazareno | c0160035-0307-4000-8000-000000000007; c0160035-0713-4000-8000-000000000013 | CAR-F10 | processional_step |
| 244 | `brotherhood_steps` | **UPSERT** | `c0160035-0854-4000-8000-000000000014` | Nuestro Padre de Carmona ↔ Palio de María Santísima de los Dolores | c0160035-0307-4000-8000-000000000007; c0160035-0714-4000-8000-000000000014 | CAR-F10 | processional_step |
| 245 | `brotherhood_steps` | **UPSERT** | `c0160035-0855-4000-8000-000000000015` | Esperanza de Carmona ↔ Urna del Santísimo Cristo de los Desamparados | c0160035-0302-4000-8000-000000000002; c0160035-0715-4000-8000-000000000015 | CAR-F10 | processional_step |
| 246 | `brotherhood_steps` | **UPSERT** | `c0160035-0856-4000-8000-000000000016` | Humildad de Carmona ↔ Misterio de Nuestro Padre Jesús de la Humildad y Paciencia | c0160035-0308-4000-8000-000000000008; c0160035-0716-4000-8000-000000000016 | CAR-F10 | processional_step |
| 247 | `brotherhood_steps` | **UPSERT** | `c0160035-0857-4000-8000-000000000017` | Humildad de Carmona ↔ Palio de María Santísima de los Dolores | c0160035-0308-4000-8000-000000000008; c0160035-0717-4000-8000-000000000017 | CAR-F10 | processional_step |
| 248 | `brotherhood_steps` | **UPSERT** | `c0160035-0858-4000-8000-000000000018` | Santo Entierro de Carmona ↔ Misterio del Santo Entierro | c0160035-0309-4000-8000-000000000009; c0160035-0718-4000-8000-000000000018 | CAR-F10 | processional_step |
| 249 | `image_steps` | **UPSERT** | `c0160035-0861-4000-8000-000000000001` | María Santísima de los Dolores ↔ Paso de palio de María Santísima de los Dolores | c0160035-0601-4000-8000-000000000001; c0160035-0701-4000-8000-000000000001 | CAR-F10 | processes_on |
| 250 | `image_steps` | **UPSERT** | `c0160035-0862-4000-8000-000000000002` | Sagrada Entrada de Jesús en Jerusalén ↔ Paso de la Sagrada Entrada en Jerusalén · La Borriquita | c0160035-0623-4000-8000-000000000023; c0160035-0702-4000-8000-000000000002 | CAR-F10 | processes_on |
| 251 | `image_steps` | **UPSERT** | `c0160035-0863-4000-8000-000000000003` | Nuestro Padre Jesús de la Coronación de Espinas ↔ Misterio de la Coronación de Espinas | c0160035-0602-4000-8000-000000000002; c0160035-0703-4000-8000-000000000003 | CAR-F10 | processes_on |
| 252 | `image_steps` | **UPSERT** | `c0160035-0864-4000-8000-000000000004` | Sanedrita del misterio de la Coronación de Espinas ↔ Misterio de la Coronación de Espinas | c0160035-0630-4000-8000-000000000030; c0160035-0703-4000-8000-000000000003 | CAR-F10 | processes_on |
| 253 | `image_steps` | **UPSERT** | `c0160035-0865-4000-8000-000000000005` | Soldado romano I del misterio de la Coronación de Espinas ↔ Misterio de la Coronación de Espinas | c0160035-0631-4000-8000-000000000031; c0160035-0703-4000-8000-000000000003 | CAR-F10 | processes_on |
| 254 | `image_steps` | **UPSERT** | `c0160035-0866-4000-8000-000000000006` | Soldado romano II del misterio de la Coronación de Espinas ↔ Misterio de la Coronación de Espinas | c0160035-0632-4000-8000-000000000032; c0160035-0703-4000-8000-000000000003 | CAR-F10 | processes_on |
| 255 | `image_steps` | **UPSERT** | `c0160035-0867-4000-8000-000000000007` | Poncio Pilatos del misterio de la Coronación de Espinas ↔ Misterio de la Coronación de Espinas | c0160035-0633-4000-8000-000000000033; c0160035-0703-4000-8000-000000000003 | CAR-F10 | processes_on |
| 256 | `image_steps` | **UPSERT** | `c0160035-0868-4000-8000-000000000008` | María Santísima de la Esperanza ↔ Palio de María Santísima de la Esperanza | c0160035-0603-4000-8000-000000000003; c0160035-0704-4000-8000-000000000004 | CAR-F10 | processes_on |
| 257 | `image_steps` | **UPSERT** | `c0160035-0869-4000-8000-000000000009` | Señor de la Amargura ↔ Paso del Señor de la Amargura | c0160035-0606-4000-8000-000000000006; c0160035-0705-4000-8000-000000000005 | CAR-F10 | processes_on |
| 258 | `image_steps` | **UPSERT** | `c0160035-0870-4000-8000-000000000010` | María Santísima del Mayor Dolor ↔ Palio de María Santísima del Mayor Dolor | c0160035-0607-4000-8000-000000000007; c0160035-0706-4000-8000-000000000006 | CAR-F10 | processes_on |
| 259 | `image_steps` | **UPSERT** | `c0160035-0871-4000-8000-000000000011` | Santísimo Cristo de la Expiración ↔ Misterio de la Expiración | c0160035-0609-4000-8000-000000000009; c0160035-0707-4000-8000-000000000007 | CAR-F10 | processes_on |
| 260 | `image_steps` | **UPSERT** | `c0160035-0872-4000-8000-000000000012` | Dimas del misterio de la Expiración ↔ Misterio de la Expiración | c0160035-0634-4000-8000-000000000034; c0160035-0707-4000-8000-000000000007 | CAR-F10 | processes_on |
| 261 | `image_steps` | **UPSERT** | `c0160035-0873-4000-8000-000000000013` | Gestas del misterio de la Expiración ↔ Misterio de la Expiración | c0160035-0635-4000-8000-000000000035; c0160035-0707-4000-8000-000000000007 | CAR-F10 | processes_on |
| 262 | `image_steps` | **UPSERT** | `c0160035-0874-4000-8000-000000000014` | María Magdalena del misterio de la Expiración ↔ Misterio de la Expiración | c0160035-0636-4000-8000-000000000036; c0160035-0707-4000-8000-000000000007 | CAR-F10 | processes_on |
| 263 | `image_steps` | **UPSERT** | `c0160035-0875-4000-8000-000000000015` | María Santísima de los Dolores ↔ Palio de María Santísima de los Dolores | c0160035-0610-4000-8000-000000000010; c0160035-0708-4000-8000-000000000008 | CAR-F10 | processes_on |
| 264 | `image_steps` | **UPSERT** | `c0160035-0876-4000-8000-000000000016` | Santísimo Cristo del Sagrado Descendimiento ↔ Misterio del Sagrado Descendimiento | c0160035-0614-4000-8000-000000000014; c0160035-0709-4000-8000-000000000009 | CAR-F10 | processes_on |
| 265 | `image_steps` | **UPSERT** | `c0160035-0877-4000-8000-000000000017` | Virgen de las Lágrimas del misterio del Sagrado Descendimiento ↔ Misterio del Sagrado Descendimiento | c0160035-0637-4000-8000-000000000037; c0160035-0709-4000-8000-000000000009 | CAR-F10 | processes_on |
| 266 | `image_steps` | **UPSERT** | `c0160035-0878-4000-8000-000000000018` | Nuestra Señora y Madre de las Angustias ↔ Palio de Nuestra Señora y Madre de las Angustias | c0160035-0615-4000-8000-000000000015; c0160035-0710-4000-8000-000000000010 | CAR-F10 | processes_on |
| 267 | `image_steps` | **UPSERT** | `c0160035-0879-4000-8000-000000000019` | Nuestro Padre Jesús en la Columna ↔ Misterio de la Columna | c0160035-0618-4000-8000-000000000018; c0160035-0711-4000-8000-000000000011 | CAR-F10 | processes_on |
| 268 | `image_steps` | **UPSERT** | `c0160035-0880-4000-8000-000000000020` | Sanedrita del misterio de la Columna ↔ Misterio de la Columna | c0160035-0638-4000-8000-000000000038; c0160035-0711-4000-8000-000000000011 | CAR-F10 | processes_on |
| 269 | `image_steps` | **UPSERT** | `c0160035-0881-4000-8000-000000000021` | Sayón del misterio de la Columna ↔ Misterio de la Columna | c0160035-0639-4000-8000-000000000039; c0160035-0711-4000-8000-000000000011 | CAR-F10 | processes_on |
| 270 | `image_steps` | **UPSERT** | `c0160035-0882-4000-8000-000000000022` | Centurión romano del misterio de la Columna ↔ Misterio de la Columna | c0160035-0640-4000-8000-000000000040; c0160035-0711-4000-8000-000000000011 | CAR-F10 | processes_on |
| 271 | `image_steps` | **UPSERT** | `c0160035-0883-4000-8000-000000000023` | María Santísima de la Paciencia ↔ Palio de María Santísima de la Paciencia | c0160035-0619-4000-8000-000000000019; c0160035-0712-4000-8000-000000000012 | CAR-F10 | processes_on |
| 272 | `image_steps` | **UPSERT** | `c0160035-0884-4000-8000-000000000024` | Nuestro Padre Jesús Nazareno ↔ Paso de Nuestro Padre Jesús Nazareno | c0160035-0620-4000-8000-000000000020; c0160035-0713-4000-8000-000000000013 | CAR-F10 | processes_on |
| 273 | `image_steps` | **UPSERT** | `c0160035-0885-4000-8000-000000000025` | María Santísima de los Dolores ↔ Palio de María Santísima de los Dolores | c0160035-0621-4000-8000-000000000021; c0160035-0714-4000-8000-000000000014 | CAR-F10 | processes_on |
| 274 | `image_steps` | **UPSERT** | `c0160035-0886-4000-8000-000000000026` | Santísimo Cristo de los Desamparados ↔ Urna del Santísimo Cristo de los Desamparados | c0160035-0605-4000-8000-000000000005; c0160035-0715-4000-8000-000000000015 | CAR-F10 | processes_on |
| 275 | `image_steps` | **UPSERT** | `c0160035-0887-4000-8000-000000000027` | Nuestro Padre Jesús de la Humildad y Paciencia ↔ Misterio de Nuestro Padre Jesús de la Humildad y Paciencia | c0160035-0624-4000-8000-000000000024; c0160035-0716-4000-8000-000000000016 | CAR-F10 | processes_on |
| 276 | `image_steps` | **UPSERT** | `c0160035-0888-4000-8000-000000000028` | María Santísima de los Dolores ↔ Palio de María Santísima de los Dolores | c0160035-0625-4000-8000-000000000025; c0160035-0717-4000-8000-000000000017 | CAR-F10 | processes_on |
| 277 | `image_steps` | **UPSERT** | `c0160035-0889-4000-8000-000000000029` | Santísimo Cristo Yacente ↔ Misterio del Santo Entierro | c0160035-0627-4000-8000-000000000027; c0160035-0718-4000-8000-000000000018 | CAR-F10 | processes_on |
| 278 | `image_steps` | **UPSERT** | `c0160035-0890-4000-8000-000000000030` | José de Arimatea del misterio del Santo Entierro ↔ Misterio del Santo Entierro | c0160035-0641-4000-8000-000000000041; c0160035-0718-4000-8000-000000000018 | CAR-F10 | processes_on |
| 279 | `image_steps` | **UPSERT** | `c0160035-0891-4000-8000-000000000031` | Nicodemo del misterio del Santo Entierro ↔ Misterio del Santo Entierro | c0160035-0642-4000-8000-000000000042; c0160035-0718-4000-8000-000000000018 | CAR-F10 | processes_on |


## G. Series y salidas históricas

| # | Tabla | Op. | UUID | Fila | Depende de | Fuente | Alcance |
|---:|---|---|---|---|---|---|---|
| 280 | `outing_series` | **UPSERT** | `c0160035-0901-4000-8000-000000000001` | Serie · Servitas de Carmona · Viernes de Dolores 2026 | c0160035-0301-4000-8000-000000000001; c0160035-0201-4000-8000-000000000001 | CAR-F10 | Serie anual; no convertir itinerario 2026 en agenda futura |
| 281 | `outing_series` | **UPSERT** | `c0160035-0902-4000-8000-000000000002` | Serie · La Borriquita de Carmona · Domingo de Ramos 2026 | c0160035-0308-4000-8000-000000000008; c0160035-0207-4000-8000-000000000007 | CAR-F10 | Serie anual; no convertir itinerario 2026 en agenda futura |
| 282 | `outing_series` | **UPSERT** | `c0160035-0903-4000-8000-000000000003` | Serie · Esperanza de Carmona · Domingo de Ramos 2026 | c0160035-0302-4000-8000-000000000002; c0160035-0201-4000-8000-000000000001 | CAR-F10 | Serie anual; no convertir itinerario 2026 en agenda futura |
| 283 | `outing_series` | **UPSERT** | `c0160035-0904-4000-8000-000000000004` | Serie · Amargura de Carmona · Lunes Santo 2026 | c0160035-0303-4000-8000-000000000003; c0160035-0202-4000-8000-000000000002 | CAR-F10 | Serie anual; no convertir itinerario 2026 en agenda futura |
| 284 | `outing_series` | **UPSERT** | `c0160035-0905-4000-8000-000000000005` | Serie · Expiración de Carmona · Martes Santo 2026 | c0160035-0304-4000-8000-000000000004; c0160035-0203-4000-8000-000000000003 | CAR-F10 | Serie anual; no convertir itinerario 2026 en agenda futura |
| 285 | `outing_series` | **UPSERT** | `c0160035-0906-4000-8000-000000000006` | Serie · Quinta Angustia de Carmona · Miércoles Santo 2026 | c0160035-0305-4000-8000-000000000005; c0160035-0204-4000-8000-000000000004 | CAR-F10 | Serie anual; no convertir itinerario 2026 en agenda futura |
| 286 | `outing_series` | **UPSERT** | `c0160035-0907-4000-8000-000000000007` | Serie · Santiago de Carmona · Jueves Santo 2026 | c0160035-0306-4000-8000-000000000006; c0160035-0205-4000-8000-000000000005 | CAR-F10 | Serie anual; no convertir itinerario 2026 en agenda futura |
| 287 | `outing_series` | **UPSERT** | `c0160035-0908-4000-8000-000000000008` | Serie · Nuestro Padre de Carmona · Viernes Santo 2026 | c0160035-0307-4000-8000-000000000007; c0160035-0206-4000-8000-000000000006 | CAR-F10 | Serie anual; no convertir itinerario 2026 en agenda futura |
| 288 | `outing_series` | **UPSERT** | `c0160035-0909-4000-8000-000000000009` | Serie · Cristo de los Desamparados de Carmona · Viernes Santo 2026 | c0160035-0302-4000-8000-000000000002; c0160035-0201-4000-8000-000000000001 | CAR-F10 | Serie anual; no convertir itinerario 2026 en agenda futura |
| 289 | `outing_series` | **UPSERT** | `c0160035-0910-4000-8000-000000000010` | Serie · Humildad de Carmona · Viernes Santo 2026 | c0160035-0308-4000-8000-000000000008; c0160035-0207-4000-8000-000000000007 | CAR-F10 | Serie anual; no convertir itinerario 2026 en agenda futura |
| 290 | `outing_series` | **UPSERT** | `c0160035-0911-4000-8000-000000000011` | Serie · Santo Entierro de Carmona · Sábado Santo 2026 | c0160035-0309-4000-8000-000000000009; c0160035-0206-4000-8000-000000000006 | CAR-F10 | Serie anual; no convertir itinerario 2026 en agenda futura |
| 291 | `outings` | **UPSERT** | `c0160035-0921-4000-8000-000000000001` | Servitas de Carmona · Viernes de Dolores 2026 | c0160035-0901-4000-8000-000000000001; c0160035-0301-4000-8000-000000000001 | CAR-F10 + CAR-F13 | 2026 · event_status=held |
| 292 | `outings` | **UPSERT** | `c0160035-0922-4000-8000-000000000002` | La Borriquita de Carmona · Domingo de Ramos 2026 | c0160035-0902-4000-8000-000000000002; c0160035-0308-4000-8000-000000000008 | CAR-F10 + CAR-F24 | 2026 · event_status=held |
| 293 | `outings` | **UPSERT** | `c0160035-0923-4000-8000-000000000003` | Esperanza de Carmona · Domingo de Ramos 2026 | c0160035-0903-4000-8000-000000000003; c0160035-0302-4000-8000-000000000002 | CAR-F10 + CAR-F14 | 2026 · event_status=held |
| 294 | `outings` | **UPSERT** | `c0160035-0924-4000-8000-000000000004` | Amargura de Carmona · Lunes Santo 2026 | c0160035-0904-4000-8000-000000000004; c0160035-0303-4000-8000-000000000003 | CAR-F10 + CAR-F15 | 2026 · event_status=held |
| 295 | `outings` | **UPSERT** | `c0160035-0925-4000-8000-000000000005` | Expiración de Carmona · Martes Santo 2026 | c0160035-0905-4000-8000-000000000005; c0160035-0304-4000-8000-000000000004 | CAR-F10 + CAR-F16 | 2026 · event_status=held |
| 296 | `outings` | **UPSERT** | `c0160035-0926-4000-8000-000000000006` | Quinta Angustia de Carmona · Miércoles Santo 2026 | c0160035-0906-4000-8000-000000000006; c0160035-0305-4000-8000-000000000005 | CAR-F10 + CAR-F17 | 2026 · event_status=held |
| 297 | `outings` | **UPSERT** | `c0160035-0927-4000-8000-000000000007` | Santiago de Carmona · Jueves Santo 2026 | c0160035-0907-4000-8000-000000000007; c0160035-0306-4000-8000-000000000006 | CAR-F10 + CAR-F18 | 2026 · event_status=held |
| 298 | `outings` | **UPSERT** | `c0160035-0928-4000-8000-000000000008` | Nuestro Padre de Carmona · Viernes Santo 2026 | c0160035-0908-4000-8000-000000000008; c0160035-0307-4000-8000-000000000007 | CAR-F10 + CAR-F19 | 2026 · event_status=held |
| 299 | `outings` | **UPSERT** | `c0160035-0929-4000-8000-000000000009` | Cristo de los Desamparados de Carmona · Viernes Santo 2026 | c0160035-0909-4000-8000-000000000009; c0160035-0302-4000-8000-000000000002 | CAR-F10 + CAR-F20 | 2026 · event_status=held |
| 300 | `outings` | **UPSERT** | `c0160035-0930-4000-8000-000000000010` | Humildad de Carmona · Viernes Santo 2026 | c0160035-0910-4000-8000-000000000010; c0160035-0308-4000-8000-000000000008 | CAR-F10 + CAR-F21 | 2026 · event_status=held |
| 301 | `outings` | **UPSERT** | `c0160035-0931-4000-8000-000000000011` | Santo Entierro de Carmona · Sábado Santo 2026 | c0160035-0911-4000-8000-000000000011; c0160035-0309-4000-8000-000000000009 | CAR-F10 + CAR-F22 | 2026 · event_status=held |
| 302 | `outings` | **UPDATE/REUSE** | `ea6ab0d1-e6c4-4ea1-8727-92cee4ce3218` | Servitas · Procesión del Escapulario · 19/09/2026 | c0160035-0301-4000-8000-000000000001; existente | CAR-F12 + CAR-F31 | Asignar corporación; announced → held; conservar slug |


## H. Participación efectiva en salidas

| # | Tabla | Op. | UUID | Fila | Depende de | Fuente | Alcance |
|---:|---|---|---|---|---|---|---|
| 303 | `outing_entities` | **UPSERT** | `c0160035-0941-4000-8000-000000000001` | María Santísima de los Dolores · processional_image | c0160035-0921-4000-8000-000000000001; c0160035-0601-4000-8000-000000000001 | CAR-F10 / evidencia posterior | Participación efectiva |
| 304 | `outing_entities` | **UPSERT** | `c0160035-0942-4000-8000-000000000002` | Paso de palio de María Santísima de los Dolores · processional_step | c0160035-0921-4000-8000-000000000001; c0160035-0701-4000-8000-000000000001 | CAR-F10 / evidencia posterior | Participación efectiva |
| 305 | `outing_entities` | **UPSERT** | `c0160035-0943-4000-8000-000000000003` | Sagrada Entrada de Jesús en Jerusalén · processional_image | c0160035-0922-4000-8000-000000000002; c0160035-0623-4000-8000-000000000023 | CAR-F10 / evidencia posterior | Participación efectiva |
| 306 | `outing_entities` | **UPSERT** | `c0160035-0944-4000-8000-000000000004` | Paso de la Sagrada Entrada en Jerusalén · La Borriquita · processional_step | c0160035-0922-4000-8000-000000000002; c0160035-0702-4000-8000-000000000002 | CAR-F10 / evidencia posterior | Participación efectiva |
| 307 | `outing_entities` | **UPSERT** | `c0160035-0945-4000-8000-000000000005` | Nuestro Padre Jesús de la Coronación de Espinas · processional_image | c0160035-0923-4000-8000-000000000003; c0160035-0602-4000-8000-000000000002 | CAR-F10 / evidencia posterior | Participación efectiva |
| 308 | `outing_entities` | **UPSERT** | `c0160035-0946-4000-8000-000000000006` | Sanedrita del misterio de la Coronación de Espinas · processional_image | c0160035-0923-4000-8000-000000000003; c0160035-0630-4000-8000-000000000030 | CAR-F10 / evidencia posterior | Participación efectiva |
| 309 | `outing_entities` | **UPSERT** | `c0160035-0947-4000-8000-000000000007` | Soldado romano I del misterio de la Coronación de Espinas · processional_image | c0160035-0923-4000-8000-000000000003; c0160035-0631-4000-8000-000000000031 | CAR-F10 / evidencia posterior | Participación efectiva |
| 310 | `outing_entities` | **UPSERT** | `c0160035-0948-4000-8000-000000000008` | Soldado romano II del misterio de la Coronación de Espinas · processional_image | c0160035-0923-4000-8000-000000000003; c0160035-0632-4000-8000-000000000032 | CAR-F10 / evidencia posterior | Participación efectiva |
| 311 | `outing_entities` | **UPSERT** | `c0160035-0949-4000-8000-000000000009` | Poncio Pilatos del misterio de la Coronación de Espinas · processional_image | c0160035-0923-4000-8000-000000000003; c0160035-0633-4000-8000-000000000033 | CAR-F10 / evidencia posterior | Participación efectiva |
| 312 | `outing_entities` | **UPSERT** | `c0160035-0950-4000-8000-000000000010` | Misterio de la Coronación de Espinas · processional_step | c0160035-0923-4000-8000-000000000003; c0160035-0703-4000-8000-000000000003 | CAR-F10 / evidencia posterior | Participación efectiva |
| 313 | `outing_entities` | **UPSERT** | `c0160035-0951-4000-8000-000000000011` | María Santísima de la Esperanza · processional_image | c0160035-0923-4000-8000-000000000003; c0160035-0603-4000-8000-000000000003 | CAR-F10 / evidencia posterior | Participación efectiva |
| 314 | `outing_entities` | **UPSERT** | `c0160035-0952-4000-8000-000000000012` | Palio de María Santísima de la Esperanza · processional_step | c0160035-0923-4000-8000-000000000003; c0160035-0704-4000-8000-000000000004 | CAR-F10 / evidencia posterior | Participación efectiva |
| 315 | `outing_entities` | **UPSERT** | `c0160035-0953-4000-8000-000000000013` | Señor de la Amargura · processional_image | c0160035-0924-4000-8000-000000000004; c0160035-0606-4000-8000-000000000006 | CAR-F10 / evidencia posterior | Participación efectiva |
| 316 | `outing_entities` | **UPSERT** | `c0160035-0954-4000-8000-000000000014` | Paso del Señor de la Amargura · processional_step | c0160035-0924-4000-8000-000000000004; c0160035-0705-4000-8000-000000000005 | CAR-F10 / evidencia posterior | Participación efectiva |
| 317 | `outing_entities` | **UPSERT** | `c0160035-0955-4000-8000-000000000015` | María Santísima del Mayor Dolor · processional_image | c0160035-0924-4000-8000-000000000004; c0160035-0607-4000-8000-000000000007 | CAR-F10 / evidencia posterior | Participación efectiva |
| 318 | `outing_entities` | **UPSERT** | `c0160035-0956-4000-8000-000000000016` | Palio de María Santísima del Mayor Dolor · processional_step | c0160035-0924-4000-8000-000000000004; c0160035-0706-4000-8000-000000000006 | CAR-F10 / evidencia posterior | Participación efectiva |
| 319 | `outing_entities` | **UPSERT** | `c0160035-0957-4000-8000-000000000017` | Santísimo Cristo de la Expiración · processional_image | c0160035-0925-4000-8000-000000000005; c0160035-0609-4000-8000-000000000009 | CAR-F10 / evidencia posterior | Participación efectiva |
| 320 | `outing_entities` | **UPSERT** | `c0160035-0958-4000-8000-000000000018` | Dimas del misterio de la Expiración · processional_image | c0160035-0925-4000-8000-000000000005; c0160035-0634-4000-8000-000000000034 | CAR-F10 / evidencia posterior | Participación efectiva |
| 321 | `outing_entities` | **UPSERT** | `c0160035-0959-4000-8000-000000000019` | Gestas del misterio de la Expiración · processional_image | c0160035-0925-4000-8000-000000000005; c0160035-0635-4000-8000-000000000035 | CAR-F10 / evidencia posterior | Participación efectiva |
| 322 | `outing_entities` | **UPSERT** | `c0160035-0960-4000-8000-000000000020` | María Magdalena del misterio de la Expiración · processional_image | c0160035-0925-4000-8000-000000000005; c0160035-0636-4000-8000-000000000036 | CAR-F10 / evidencia posterior | Participación efectiva |
| 323 | `outing_entities` | **UPSERT** | `c0160035-0961-4000-8000-000000000021` | Misterio de la Expiración · processional_step | c0160035-0925-4000-8000-000000000005; c0160035-0707-4000-8000-000000000007 | CAR-F10 / evidencia posterior | Participación efectiva |
| 324 | `outing_entities` | **UPSERT** | `c0160035-0962-4000-8000-000000000022` | María Santísima de los Dolores · processional_image | c0160035-0925-4000-8000-000000000005; c0160035-0610-4000-8000-000000000010 | CAR-F10 / evidencia posterior | Participación efectiva |
| 325 | `outing_entities` | **UPSERT** | `c0160035-0963-4000-8000-000000000023` | Palio de María Santísima de los Dolores · processional_step | c0160035-0925-4000-8000-000000000005; c0160035-0708-4000-8000-000000000008 | CAR-F10 / evidencia posterior | Participación efectiva |
| 326 | `outing_entities` | **UPSERT** | `c0160035-0964-4000-8000-000000000024` | Santísimo Cristo del Sagrado Descendimiento · processional_image | c0160035-0926-4000-8000-000000000006; c0160035-0614-4000-8000-000000000014 | CAR-F10 / evidencia posterior | Participación efectiva |
| 327 | `outing_entities` | **UPSERT** | `c0160035-0965-4000-8000-000000000025` | Virgen de las Lágrimas del misterio del Sagrado Descendimiento · processional_image | c0160035-0926-4000-8000-000000000006; c0160035-0637-4000-8000-000000000037 | CAR-F10 / evidencia posterior | Participación efectiva |
| 328 | `outing_entities` | **UPSERT** | `c0160035-0966-4000-8000-000000000026` | Misterio del Sagrado Descendimiento · processional_step | c0160035-0926-4000-8000-000000000006; c0160035-0709-4000-8000-000000000009 | CAR-F10 / evidencia posterior | Participación efectiva |
| 329 | `outing_entities` | **UPSERT** | `c0160035-0967-4000-8000-000000000027` | Nuestra Señora y Madre de las Angustias · processional_image | c0160035-0926-4000-8000-000000000006; c0160035-0615-4000-8000-000000000015 | CAR-F10 / evidencia posterior | Participación efectiva |
| 330 | `outing_entities` | **UPSERT** | `c0160035-0968-4000-8000-000000000028` | Palio de Nuestra Señora y Madre de las Angustias · processional_step | c0160035-0926-4000-8000-000000000006; c0160035-0710-4000-8000-000000000010 | CAR-F10 / evidencia posterior | Participación efectiva |
| 331 | `outing_entities` | **UPSERT** | `c0160035-0969-4000-8000-000000000029` | Nuestro Padre Jesús en la Columna · processional_image | c0160035-0927-4000-8000-000000000007; c0160035-0618-4000-8000-000000000018 | CAR-F10 / evidencia posterior | Participación efectiva |
| 332 | `outing_entities` | **UPSERT** | `c0160035-0970-4000-8000-000000000030` | Sanedrita del misterio de la Columna · processional_image | c0160035-0927-4000-8000-000000000007; c0160035-0638-4000-8000-000000000038 | CAR-F10 / evidencia posterior | Participación efectiva |
| 333 | `outing_entities` | **UPSERT** | `c0160035-0971-4000-8000-000000000031` | Sayón del misterio de la Columna · processional_image | c0160035-0927-4000-8000-000000000007; c0160035-0639-4000-8000-000000000039 | CAR-F10 / evidencia posterior | Participación efectiva |
| 334 | `outing_entities` | **UPSERT** | `c0160035-0972-4000-8000-000000000032` | Centurión romano del misterio de la Columna · processional_image | c0160035-0927-4000-8000-000000000007; c0160035-0640-4000-8000-000000000040 | CAR-F10 / evidencia posterior | Participación efectiva |
| 335 | `outing_entities` | **UPSERT** | `c0160035-0973-4000-8000-000000000033` | Misterio de la Columna · processional_step | c0160035-0927-4000-8000-000000000007; c0160035-0711-4000-8000-000000000011 | CAR-F10 / evidencia posterior | Participación efectiva |
| 336 | `outing_entities` | **UPSERT** | `c0160035-0974-4000-8000-000000000034` | María Santísima de la Paciencia · processional_image | c0160035-0927-4000-8000-000000000007; c0160035-0619-4000-8000-000000000019 | CAR-F10 / evidencia posterior | Participación efectiva |
| 337 | `outing_entities` | **UPSERT** | `c0160035-0975-4000-8000-000000000035` | Palio de María Santísima de la Paciencia · processional_step | c0160035-0927-4000-8000-000000000007; c0160035-0712-4000-8000-000000000012 | CAR-F10 / evidencia posterior | Participación efectiva |
| 338 | `outing_entities` | **UPSERT** | `c0160035-0976-4000-8000-000000000036` | Nuestro Padre Jesús Nazareno · processional_image | c0160035-0928-4000-8000-000000000008; c0160035-0620-4000-8000-000000000020 | CAR-F10 / evidencia posterior | Participación efectiva |
| 339 | `outing_entities` | **UPSERT** | `c0160035-0977-4000-8000-000000000037` | Paso de Nuestro Padre Jesús Nazareno · processional_step | c0160035-0928-4000-8000-000000000008; c0160035-0713-4000-8000-000000000013 | CAR-F10 / evidencia posterior | Participación efectiva |
| 340 | `outing_entities` | **UPSERT** | `c0160035-0978-4000-8000-000000000038` | María Santísima de los Dolores · processional_image | c0160035-0928-4000-8000-000000000008; c0160035-0621-4000-8000-000000000021 | CAR-F10 / evidencia posterior | Participación efectiva |
| 341 | `outing_entities` | **UPSERT** | `c0160035-0979-4000-8000-000000000039` | Palio de María Santísima de los Dolores · processional_step | c0160035-0928-4000-8000-000000000008; c0160035-0714-4000-8000-000000000014 | CAR-F10 / evidencia posterior | Participación efectiva |
| 342 | `outing_entities` | **UPSERT** | `c0160035-0980-4000-8000-000000000040` | Santísimo Cristo de los Desamparados · processional_image | c0160035-0929-4000-8000-000000000009; c0160035-0605-4000-8000-000000000005 | CAR-F10 / evidencia posterior | Participación efectiva |
| 343 | `outing_entities` | **UPSERT** | `c0160035-0981-4000-8000-000000000041` | Urna del Santísimo Cristo de los Desamparados · processional_step | c0160035-0929-4000-8000-000000000009; c0160035-0715-4000-8000-000000000015 | CAR-F10 / evidencia posterior | Participación efectiva |
| 344 | `outing_entities` | **UPSERT** | `c0160035-0982-4000-8000-000000000042` | Nuestro Padre Jesús de la Humildad y Paciencia · processional_image | c0160035-0930-4000-8000-000000000010; c0160035-0624-4000-8000-000000000024 | CAR-F10 / evidencia posterior | Participación efectiva |
| 345 | `outing_entities` | **UPSERT** | `c0160035-0983-4000-8000-000000000043` | Misterio de Nuestro Padre Jesús de la Humildad y Paciencia · processional_step | c0160035-0930-4000-8000-000000000010; c0160035-0716-4000-8000-000000000016 | CAR-F10 / evidencia posterior | Participación efectiva |
| 346 | `outing_entities` | **UPSERT** | `c0160035-0984-4000-8000-000000000044` | María Santísima de los Dolores · processional_image | c0160035-0930-4000-8000-000000000010; c0160035-0625-4000-8000-000000000025 | CAR-F10 / evidencia posterior | Participación efectiva |
| 347 | `outing_entities` | **UPSERT** | `c0160035-0985-4000-8000-000000000045` | Palio de María Santísima de los Dolores · processional_step | c0160035-0930-4000-8000-000000000010; c0160035-0717-4000-8000-000000000017 | CAR-F10 / evidencia posterior | Participación efectiva |
| 348 | `outing_entities` | **UPSERT** | `c0160035-0986-4000-8000-000000000046` | Santísimo Cristo Yacente · processional_image | c0160035-0931-4000-8000-000000000011; c0160035-0627-4000-8000-000000000027 | CAR-F10 / evidencia posterior | Participación efectiva |
| 349 | `outing_entities` | **UPSERT** | `c0160035-0987-4000-8000-000000000047` | José de Arimatea del misterio del Santo Entierro · processional_image | c0160035-0931-4000-8000-000000000011; c0160035-0641-4000-8000-000000000041 | CAR-F10 / evidencia posterior | Participación efectiva |
| 350 | `outing_entities` | **UPSERT** | `c0160035-0988-4000-8000-000000000048` | Nicodemo del misterio del Santo Entierro · processional_image | c0160035-0931-4000-8000-000000000011; c0160035-0642-4000-8000-000000000042 | CAR-F10 / evidencia posterior | Participación efectiva |
| 351 | `outing_entities` | **UPSERT** | `c0160035-0989-4000-8000-000000000049` | Misterio del Santo Entierro · processional_step | c0160035-0931-4000-8000-000000000011; c0160035-0718-4000-8000-000000000018 | CAR-F10 / evidencia posterior | Participación efectiva |
| 352 | `outing_entities` | **UPSERT** | `c0160035-0990-4000-8000-000000000050` | María Santísima de los Dolores · Servitas · processional_image | ea6ab0d1-e6c4-4ea1-8727-92cee4ce3218; c0160035-0601-4000-8000-000000000001 | CAR-F10 / evidencia posterior | Participación efectiva |


## I. Música 2026

| # | Tabla | Op. | UUID | Fila | Depende de | Fuente | Alcance |
|---:|---|---|---|---|---|---|---|
| 353 | `outing_music_positions` | **UPSERT** | `c0160035-1001-4000-8000-000000000001` | Tras el palio de María Santísima de los Dolores | c0160035-0921-4000-8000-000000000001; c0160035-0701-4000-8000-000000000001 | CAR-F27 | Posición musical |
| 354 | `outing_music_positions` | **UPSERT** | `c0160035-1002-4000-8000-000000000002` | Tras el paso de la Sagrada Entrada en Jerusalén | c0160035-0922-4000-8000-000000000002; c0160035-0702-4000-8000-000000000002 | CAR-F25 | Posición musical |
| 355 | `outing_music_positions` | **UPSERT** | `c0160035-1003-4000-8000-000000000003` | Tras el misterio de la Coronación de Espinas | c0160035-0923-4000-8000-000000000003; c0160035-0703-4000-8000-000000000003 | CAR-F10 | Posición musical |
| 356 | `outing_music_positions` | **UPSERT** | `c0160035-1004-4000-8000-000000000004` | Tras el palio de María Santísima de la Esperanza | c0160035-0923-4000-8000-000000000003; c0160035-0704-4000-8000-000000000004 | CAR-F10 | Posición musical |
| 357 | `outing_music_positions` | **UPSERT** | `c0160035-1005-4000-8000-000000000005` | Tras el paso del Señor de la Amargura | c0160035-0924-4000-8000-000000000004; c0160035-0705-4000-8000-000000000005 | CAR-F10 | Posición musical |
| 358 | `outing_music_positions` | **UPSERT** | `c0160035-1006-4000-8000-000000000006` | Tras el palio de María Santísima del Mayor Dolor | c0160035-0924-4000-8000-000000000004; c0160035-0706-4000-8000-000000000006 | CAR-F10 | Posición musical |
| 359 | `outing_music_positions` | **UPSERT** | `c0160035-1007-4000-8000-000000000007` | Tras el misterio de la Expiración | c0160035-0925-4000-8000-000000000005; c0160035-0707-4000-8000-000000000007 | CAR-F10 | Posición musical |
| 360 | `outing_music_positions` | **UPSERT** | `c0160035-1008-4000-8000-000000000008` | Tras el palio de María Santísima de los Dolores | c0160035-0925-4000-8000-000000000005; c0160035-0708-4000-8000-000000000008 | CAR-F10 | Posición musical |
| 361 | `outing_music_positions` | **UPSERT** | `c0160035-1009-4000-8000-000000000009` | Tras el misterio del Sagrado Descendimiento | c0160035-0926-4000-8000-000000000006; c0160035-0709-4000-8000-000000000009 | CAR-F10 | Posición musical |
| 362 | `outing_music_positions` | **UPSERT** | `c0160035-1010-4000-8000-000000000010` | Tras el palio de Nuestra Señora y Madre de las Angustias | c0160035-0926-4000-8000-000000000006; c0160035-0710-4000-8000-000000000010 | CAR-F10 | Posición musical |
| 363 | `outing_music_positions` | **UPSERT** | `c0160035-1011-4000-8000-000000000011` | Tras el misterio de la Columna | c0160035-0927-4000-8000-000000000007; c0160035-0711-4000-8000-000000000011 | CAR-F10 | Posición musical |
| 364 | `outing_music_positions` | **UPSERT** | `c0160035-1012-4000-8000-000000000012` | Tras el palio de María Santísima de la Paciencia | c0160035-0927-4000-8000-000000000007; c0160035-0712-4000-8000-000000000012 | CAR-F10 | Posición musical |
| 365 | `outing_music_positions` | **UPSERT** | `c0160035-1013-4000-8000-000000000013` | Tras el paso de Nuestro Padre Jesús Nazareno | c0160035-0928-4000-8000-000000000008; c0160035-0713-4000-8000-000000000013 | CAR-F10 | Posición musical |
| 366 | `outing_music_positions` | **UPSERT** | `c0160035-1014-4000-8000-000000000014` | Tras el palio de María Santísima de los Dolores | c0160035-0928-4000-8000-000000000008; c0160035-0714-4000-8000-000000000014 | CAR-F10 | Posición musical |
| 367 | `outing_music_positions` | **UPSERT** | `c0160035-1015-4000-8000-000000000015` | Sin acompañamiento musical | c0160035-0929-4000-8000-000000000009; c0160035-0715-4000-8000-000000000015 | CAR-F30 | Posición resuelta como silencio |
| 368 | `outing_music_positions` | **UPSERT** | `c0160035-1016-4000-8000-000000000016` | Tras el misterio de Nuestro Padre Jesús de la Humildad y Paciencia | c0160035-0930-4000-8000-000000000010; c0160035-0716-4000-8000-000000000016 | CAR-F28 | Posición musical |
| 369 | `outing_music_positions` | **UPSERT** | `c0160035-1017-4000-8000-000000000017` | Tras el palio de María Santísima de los Dolores | c0160035-0930-4000-8000-000000000010; c0160035-0717-4000-8000-000000000017 | CAR-F10 | Posición musical |
| 370 | `outing_music_positions` | **UPSERT** | `c0160035-1018-4000-8000-000000000018` | Tras el misterio del Santo Entierro | c0160035-0931-4000-8000-000000000011; c0160035-0718-4000-8000-000000000018 | CAR-F10 | Posición musical |
| 371 | `outing_music_assignments` | **UPSERT** | `c0160035-1021-4000-8000-000000000001` | Tras el palio de María Santísima de los Dolores · Banda Municipal de Música de Mairena del Alcor | c0160035-1001-4000-8000-000000000001; d6852052-92bb-4b54-b551-e52b656dea6d | CAR-F27 | 2026 |
| 372 | `outing_music_assignments` | **UPSERT** | `c0160035-1022-4000-8000-000000000002` | Tras el paso de la Sagrada Entrada en Jerusalén · Agrupación Musical Paz y Caridad de Estepa | c0160035-1002-4000-8000-000000000002; c0160032-0402-4000-8000-000000000002 | CAR-F25 | 2026 |
| 373 | `outing_music_assignments` | **UPSERT** | `c0160035-1023-4000-8000-000000000003` | Tras el misterio de la Coronación de Espinas · Agrupación Musical Nuestra Señora de Valme de Dos Hermanas | c0160035-1003-4000-8000-000000000003; 4e4d493c-5273-44aa-8066-72dd1faa1ed8 | CAR-F10 | 2026 |
| 374 | `outing_music_assignments` | **UPSERT** | `c0160035-1024-4000-8000-000000000004` | Tras el palio de María Santísima de la Esperanza · Banda de Música Nuestra Señora de Guaditoca | c0160035-1004-4000-8000-000000000004; c0160035-0401-4000-8000-000000000001 | CAR-F10 | 2026 |
| 375 | `outing_music_assignments` | **UPSERT** | `c0160035-1025-4000-8000-000000000005` | Tras el paso del Señor de la Amargura · Banda de Cornetas y Tambores Santísimo Cristo de la Victoria de León | c0160035-1005-4000-8000-000000000005; 97f62582-42f5-4d5f-80e0-376398af98e8 | CAR-F10 | 2026 |
| 376 | `outing_music_assignments` | **UPSERT** | `c0160035-1026-4000-8000-000000000006` | Tras el palio de María Santísima del Mayor Dolor · Banda Municipal de Música de Aznalcóllar | c0160035-1006-4000-8000-000000000006; c0160035-0402-4000-8000-000000000002 | CAR-F10 | 2026 |
| 377 | `outing_music_assignments` | **UPSERT** | `c0160035-1027-4000-8000-000000000007` | Tras el misterio de la Expiración · Banda de Cornetas y Tambores Nuestro Padre Jesús Rescatado de La Solana | c0160035-1007-4000-8000-000000000007; c0160035-0403-4000-8000-000000000003 | CAR-F10 | 2026 |
| 378 | `outing_music_assignments` | **UPSERT** | `c0160035-1028-4000-8000-000000000008` | Tras el palio de María Santísima de los Dolores · Banda Municipal de Música de Mairena del Alcor | c0160035-1008-4000-8000-000000000008; d6852052-92bb-4b54-b551-e52b656dea6d | CAR-F10 | 2026 |
| 379 | `outing_music_assignments` | **UPSERT** | `c0160035-1029-4000-8000-000000000009` | Tras el misterio del Sagrado Descendimiento · Música de capilla | c0160035-1009-4000-8000-000000000009; band_name_text | CAR-F10 | 2026 |
| 380 | `outing_music_assignments` | **UPSERT** | `c0160035-1030-4000-8000-000000000010` | Tras el palio de Nuestra Señora y Madre de las Angustias · Banda de Música El Arrabal de Carmona | c0160035-1010-4000-8000-000000000010; c0160035-0404-4000-8000-000000000004 | CAR-F10 | 2026 |
| 381 | `outing_music_assignments` | **UPSERT** | `c0160035-1031-4000-8000-000000000011` | Tras el misterio de la Columna · Banda de Cornetas y Tambores Nuestra Señora de Gracia de Carmona | c0160035-1011-4000-8000-000000000011; c0160035-0405-4000-8000-000000000005 | CAR-F10 | 2026 |
| 382 | `outing_music_assignments` | **UPSERT** | `c0160035-1032-4000-8000-000000000012` | Tras el palio de María Santísima de la Paciencia · Banda de Música El Arrabal de Carmona | c0160035-1012-4000-8000-000000000012; c0160035-0404-4000-8000-000000000004 | CAR-F10 | 2026 |
| 383 | `outing_music_assignments` | **UPSERT** | `c0160035-1033-4000-8000-000000000013` | Tras el paso de Nuestro Padre Jesús Nazareno · Música de capilla | c0160035-1013-4000-8000-000000000013; band_name_text | CAR-F10 | 2026 |
| 384 | `outing_music_assignments` | **UPSERT** | `c0160035-1034-4000-8000-000000000014` | Tras el palio de María Santísima de los Dolores · Música de capilla | c0160035-1014-4000-8000-000000000014; band_name_text | CAR-F10 | 2026 |
| 385 | `outing_music_assignments` | **UPSERT** | `c0160035-1035-4000-8000-000000000015` | Tras el misterio de Nuestro Padre Jesús de la Humildad y Paciencia · Banda Amor y Sacrificio de Lebrija | c0160035-1016-4000-8000-000000000016; c0160033-0404-4000-8000-000000000004 | CAR-F28 + CAR-F29 | 2026 |
| 386 | `outing_music_assignments` | **UPSERT** | `c0160035-1036-4000-8000-000000000016` | Tras el palio de María Santísima de los Dolores · Banda de Música Nuestra Señora de Guaditoca | c0160035-1017-4000-8000-000000000017; c0160035-0401-4000-8000-000000000001 | CAR-F10 | 2026 |
| 387 | `outing_music_assignments` | **UPSERT** | `c0160035-1037-4000-8000-000000000017` | Tras el misterio del Santo Entierro · Banda de Música El Arrabal de Carmona | c0160035-1018-4000-8000-000000000018; c0160035-0404-4000-8000-000000000004 | CAR-F10 | 2026 |
| 388 | `music_accompaniment_periods` | **UPSERT** | `c0160035-1101-4000-8000-000000000001` | Servitas · Banda Municipal de Música de Mairena del Alcor | c0160035-0301-4000-8000-000000000001; d6852052-92bb-4b54-b551-e52b656dea6d | mismo soporte que la asignación | Vigencia cerrada a 2026; is_current=false |
| 389 | `music_accompaniment_periods` | **UPSERT** | `c0160035-1102-4000-8000-000000000002` | Humildad · Agrupación Musical Paz y Caridad de Estepa | c0160035-0308-4000-8000-000000000008; c0160032-0402-4000-8000-000000000002 | mismo soporte que la asignación | Vigencia cerrada a 2026; is_current=false |
| 390 | `music_accompaniment_periods` | **UPSERT** | `c0160035-1103-4000-8000-000000000003` | Esperanza · Agrupación Musical Nuestra Señora de Valme de Dos Hermanas | c0160035-0302-4000-8000-000000000002; 4e4d493c-5273-44aa-8066-72dd1faa1ed8 | mismo soporte que la asignación | Vigencia cerrada a 2026; is_current=false |
| 391 | `music_accompaniment_periods` | **UPSERT** | `c0160035-1104-4000-8000-000000000004` | Esperanza · Banda de Música Nuestra Señora de Guaditoca | c0160035-0302-4000-8000-000000000002; c0160035-0401-4000-8000-000000000001 | mismo soporte que la asignación | Vigencia cerrada a 2026; is_current=false |
| 392 | `music_accompaniment_periods` | **UPSERT** | `c0160035-1105-4000-8000-000000000005` | Amargura · Banda de Cornetas y Tambores Santísimo Cristo de la Victoria de León | c0160035-0303-4000-8000-000000000003; 97f62582-42f5-4d5f-80e0-376398af98e8 | mismo soporte que la asignación | Vigencia cerrada a 2026; is_current=false |
| 393 | `music_accompaniment_periods` | **UPSERT** | `c0160035-1106-4000-8000-000000000006` | Amargura · Banda Municipal de Música de Aznalcóllar | c0160035-0303-4000-8000-000000000003; c0160035-0402-4000-8000-000000000002 | mismo soporte que la asignación | Vigencia cerrada a 2026; is_current=false |
| 394 | `music_accompaniment_periods` | **UPSERT** | `c0160035-1107-4000-8000-000000000007` | Expiración · Banda de Cornetas y Tambores Nuestro Padre Jesús Rescatado de La Solana | c0160035-0304-4000-8000-000000000004; c0160035-0403-4000-8000-000000000003 | mismo soporte que la asignación | Vigencia cerrada a 2026; is_current=false |
| 395 | `music_accompaniment_periods` | **UPSERT** | `c0160035-1108-4000-8000-000000000008` | Expiración · Banda Municipal de Música de Mairena del Alcor | c0160035-0304-4000-8000-000000000004; d6852052-92bb-4b54-b551-e52b656dea6d | mismo soporte que la asignación | Vigencia cerrada a 2026; is_current=false |
| 396 | `music_accompaniment_periods` | **UPSERT** | `c0160035-1109-4000-8000-000000000009` | Quinta Angustia · Banda de Música El Arrabal de Carmona | c0160035-0305-4000-8000-000000000005; c0160035-0404-4000-8000-000000000004 | mismo soporte que la asignación | Vigencia cerrada a 2026; is_current=false |
| 397 | `music_accompaniment_periods` | **UPSERT** | `c0160035-1110-4000-8000-000000000010` | Santiago · Banda de Cornetas y Tambores Nuestra Señora de Gracia de Carmona | c0160035-0306-4000-8000-000000000006; c0160035-0405-4000-8000-000000000005 | mismo soporte que la asignación | Vigencia cerrada a 2026; is_current=false |
| 398 | `music_accompaniment_periods` | **UPSERT** | `c0160035-1111-4000-8000-000000000011` | Santiago · Banda de Música El Arrabal de Carmona | c0160035-0306-4000-8000-000000000006; c0160035-0404-4000-8000-000000000004 | mismo soporte que la asignación | Vigencia cerrada a 2026; is_current=false |
| 399 | `music_accompaniment_periods` | **UPSERT** | `c0160035-1112-4000-8000-000000000012` | Humildad · Banda Amor y Sacrificio de Lebrija | c0160035-0308-4000-8000-000000000008; c0160033-0404-4000-8000-000000000004 | mismo soporte que la asignación | Vigencia cerrada a 2026; is_current=false |
| 400 | `music_accompaniment_periods` | **UPSERT** | `c0160035-1113-4000-8000-000000000013` | Humildad · Banda de Música Nuestra Señora de Guaditoca | c0160035-0308-4000-8000-000000000008; c0160035-0401-4000-8000-000000000001 | mismo soporte que la asignación | Vigencia cerrada a 2026; is_current=false |
| 401 | `music_accompaniment_periods` | **UPSERT** | `c0160035-1114-4000-8000-000000000014` | Santo Entierro · Banda de Música El Arrabal de Carmona | c0160035-0309-4000-8000-000000000009; c0160035-0404-4000-8000-000000000004 | mismo soporte que la asignación | Vigencia cerrada a 2026; is_current=false |


## J. Trazabilidad `source_links`

Las 129 filas quedan enumeradas en [ANEXO-SOURCE-LINKS-CARMONA-HC016-2026-09-25.md](./ANEXO-SOURCE-LINKS-CARMONA-HC016-2026-09-25.md), posiciones **402–530**.

## Puerta de salida

Este plan congela cada operación, UUID, dependencia y fuente. **No ejecuta ninguna escritura.**

Siguiente fase permitida: construir el manifiesto determinista y el payload de preflight transaccional que:
1. compruebe 0 colisiones;
2. ejecute las 530 operaciones dentro de una transacción;
3. valide recuentos y relaciones;
4. termine obligatoriamente en `ROLLBACK`.

**Staging y Apply continúan no autorizados.**
