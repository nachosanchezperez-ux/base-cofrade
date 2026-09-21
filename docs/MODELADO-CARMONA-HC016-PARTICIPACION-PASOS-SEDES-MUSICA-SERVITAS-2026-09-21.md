# Modelado de participación, Pasos, sedes, música y Servitas · Carmona · HC-016

**Fecha:** 21 de septiembre de 2026  
**Base:** `9055a35b30b1e6a4c05f654c3566a0d0e6ccf578`  
**Fase:** MODELADO PARCIAL CERRADO · MÚSICA AÚN BLOQUEANTE  
**Límites:** sin staging, payload SQL, dry-run, Apply, DDL, RLS ni publicación de datos

## 1. Resultado ejecutivo

- 9 sujetos corporativos: 8 hermandades penitenciales y la Orden Seglar Servita Carmona, cuya web firma «Orden Seglar Siervos de María».
- 10 Salidas penitenciales de 2026 acreditadas como celebradas y una Salida servita adicional, ya existente, del 19 de septiembre.
- 17 Pasos únicos y 17 participaciones de Paso documentables en los diez cortejos penitenciales. El posible REUSE del Paso servita en septiembre queda bloqueado hasta disponer de prueba específica.
- 30 relaciones `image_steps` confirmadas por fuente; 3 relaciones permanecen bloqueadas por no acreditar participación efectiva en 2026.
- 7 Lugares y 9 relaciones de sede actual; no existe ningún Lugar carmonense previo en Supabase.
- 5 posiciones musicales de 2026 identificadas con evidencia posterior o combinación previa/posterior suficiente; el resto sigue pendiente.
- 3 Bandas son REUSE seguro; 2 serían INSERT si superan la puerta probatoria.

Este documento no es un manifiesto ni autoriza escrituras. El plan row-by-row definitivo continúa bloqueado hasta cerrar toda la música efectiva y elevar las fuentes secundarias indicadas.

## 2. Participación efectiva por Salida

| Fecha | Corporación | Paso | Imágenes confirmadas sobre el Paso | Exclusiones y bloqueos |
|---|---|---|---|---|
| 2026-03-27 | Orden Seglar Servita Carmona | Paso de palio de María Santísima de los Dolores | María Santísima de los Dolores | ninguna adicional acreditada |
| 2026-03-29 | Esperanza | Misterio de la Coronación de Espinas | Nuestro Padre Jesús de la Coronación de Espinas; un sanedrita; dos soldados romanos; Poncio Pilatos | San Juan Evangelista no se enlaza: la fuente solo acredita acompañamiento histórico variable |
| 2026-03-29 | Esperanza | Paso de palio de la Esperanza | María Santísima de la Esperanza | San Juan queda bloqueado por falta de prueba específica de 2026 |
| 2026-03-30 | Amargura | Paso del Señor de la Amargura | Señor de la Amargura | Santísimo Cristo de San Felipe es otra talla y queda fuera del cortejo 2026 |
| 2026-03-30 | Amargura | Paso de palio del Mayor Dolor | María Santísima del Mayor Dolor | — |
| 2026-03-31 | Expiración | Misterio de la Expiración | Nuestro Padre Jesús de la Expiración; Dimas; Gestas; María Magdalena | María Santísima del Calvario, San Juan Evangelista y San Blas son titulares, no participantes acreditados |
| 2026-03-31 | Expiración | Paso de palio de los Dolores | María Santísima de los Dolores | — |
| 2026-04-01 | Quinta Angustia | Misterio del Sagrado Descendimiento | Cristo del Sagrado Descendimiento; Virgen de las Lágrimas | no añadir personajes no nombrados por la fuente |
| 2026-04-01 | Quinta Angustia | Paso de palio de las Angustias | Nuestra Señora y Madre de las Angustias | Cautivo de Belén y María Santísima de los Ángeles quedan fuera |
| 2026-04-02 | Santiago | Misterio de la Columna | Nuestro Padre Jesús en la Columna; un sanedrita; un sayón negro; un centurión romano | el gallo de taxidermia es elemento iconográfico, no una Imagen |
| 2026-04-02 | Santiago | Paso de palio de la Paciencia | María Santísima de la Paciencia | — |
| 2026-04-03 | Nuestro Padre | Paso de Nuestro Padre Jesús Nazareno | Nuestro Padre Jesús Nazareno | no reconstruir el antiguo misterio con personajes históricos sin prueba actual |
| 2026-04-03 | Nuestro Padre | Paso de palio de los Dolores | María Santísima de los Dolores | Divina Pastora excluida del cortejo penitencial |
| 2026-04-03 | Esperanza | Urna del Cristo de los Desamparados | Santísimo Cristo de los Desamparados | una sola Hermandad de la Esperanza; no crear corporación separada |
| 2026-04-03 | Humildad | Misterio de la Humildad y Paciencia | Nuestro Padre Jesús de la Humildad y Paciencia | San Juan Evangelista queda bloqueado por falta de prueba específica de 2026 |
| 2026-04-03 | Humildad | Paso de palio de los Dolores | María Santísima de los Dolores | — |
| 2026-04-04 | Santo Entierro | Misterio del Santo Entierro | Santísimo Cristo Nuestro Señor Yacente; José de Arimatea; Nicodemo | María Magdalena queda bloqueada; Soledad no tiene aún palio y Santa Ana no es penitencial |

Fuentes estructurales: [Consejo de Hermandades de Carmona](https://consejohermandadescarmona.es/) y las fichas `CAR-F01`–`CAR-F08`. Evidencia de celebración: `CAR-F13`–`CAR-F22`.

El recuento de 30 relaciones considera por separado a cada uno de los dos soldados romanos del misterio de la Coronación. No agrupa dos esculturas en una sola Imagen.

La Salida `carmona-servitas-dolores-santo-escapulario-2026-09-19` es REUSE seguro como acontecimiento y pertenece al mismo sujeto corporativo, pero su relación con el Paso de palio de marzo queda `BLOCKED`: la unicidad de la Imagen y de la organización no demuestra que se emplearan las mismas andas.

## 3. Corrección de identidad en Amargura

El Consejo dedica apartados distintos al [Señor de la Amargura y al Cristo de San Felipe](https://consejohermandadescarmona.es/san-felipe/). Son dos crucificados diferentes:

- Señor de la Amargura: obra concertada con Jorge Fernández Alemán en 1521; participa en el Lunes Santo de 2026.
- Santísimo Cristo de San Felipe: crucificado gótico de tamaño académico; titular corporativo, pero sin participación acreditada en la Salida de 2026.

Por tanto, el inventario pasa de 27 a 28 imágenes titulares candidatas. No hay alias ni fusión de registros.

## 4. Sedes actuales

| Corporación | Sede 2026 | Decisión futura |
|---|---|---|
| Servitas | Real Iglesia del Divino Salvador | INSERT Lugar + relación actual |
| Esperanza | Real Iglesia del Divino Salvador | REUSE del mismo Lugar; relación independiente |
| Amargura | Iglesia de San Felipe | INSERT |
| Expiración | Iglesia de San Blas | INSERT |
| Quinta Angustia | Capilla de San Francisco | INSERT; sede actual separada de la cronología conventual |
| Santiago | Iglesia de Santiago | INSERT |
| Nuestro Padre | Iglesia de San Bartolomé | INSERT |
| Humildad | Iglesia de San Pedro | INSERT |
| Santo Entierro | Iglesia de San Bartolomé | REUSE del mismo Lugar; traslado vigente desde 2006 |

Resultado: 7 Lugares, 9 `entity_locations`, 0 REUSE previo en Supabase. Las sedes históricas se conservan solo como cronología y nunca sustituyen a la sede vigente.

## 5. Normalización de Servitas

La [web oficial](https://servitascarmona.com/) firma **Orden Seglar Siervos de María**, usa **Orden Seglar Servita Carmona** como nombre público y sitúa la sede en la Real Iglesia del Salvador. No se amplía esa literalidad con preposiciones o topónimos no presentes en la firma propia.

Reglas de unicidad:

1. un único nodo corporativo;
2. una imagen de María Santísima de los Dolores;
3. un Paso de palio documentado para la Salida penitencial del 27 de marzo; su posible reutilización el 19 de septiembre no se materializa sin una fuente específica;
4. la Salida de septiembre es REUSE de `ea6ab0d1-e6c4-4ea1-8727-92cee4ce3218`; solo se enlazará a corporación, sede y Fuentes cuando exista autorización, mientras la relación al Paso permanece bloqueada;
5. `event_status = announced` no se cambia a `held` dentro de esta puerta.

La publicación oficial del 19 de septiembre acredita fecha, hora y recorrido; la Banda MAFERMAN figura en la información ya cargada, pero la Fuente de Supabase tiene URL y fecha nulas. Debe repararse la trazabilidad antes de materializar música.

## 6. Música 2026 y conciliación de Bandas

| Salida/posición | Banda | Evidencia disponible | Supabase | Estado |
|---|---|---|---|---|
| Esperanza · misterio de Coronación | Agrupación Musical Nuestra Señora de Valme de Dos Hermanas | vídeo posterior de 2026 con identificación musical | REUSE `4e4d493c-5273-44aa-8066-72dd1faa1ed8` | identificado; elevar a fuente propia |
| Amargura · Señor | Banda de Cornetas y Tambores Santísimo Cristo de la Victoria de León | vídeo posterior de 30/03/2026; continuidad oficial publicada para 2025 | REUSE `97f62582-42f5-4d5f-80e0-376398af98e8` | efectivo; falta fuente primaria 2026 |
| Expiración · palio de los Dolores | Banda Municipal de Música de Mairena del Alcor | [renovación oficial publicada el 24/10/2025](https://municipaldemairena.com/renovamos-nuestro-martes-santo-con-la-hermandad-de-san-blas/) para el Martes Santo 2026 + evidencia posterior del cortejo | REUSE `d6852052-92bb-4b54-b551-e52b656dea6d` | cerrado |
| Quinta Angustia · palio de las Angustias | Banda de Música El Arrabal de Carmona | vídeo posterior identificado | no existe | candidato INSERT; elevar a fuente estable |
| Santo Entierro · misterio | Banda de Música El Arrabal de Carmona | [Carmona Penitente 2026](https://www.larevistacarmona.es/texto-diario/mostrar/5825655/carmona-penitente-guia-imprescindible-semana-santa) + publicación posterior del 04/04/2026 | no existe | identificado; elevar la prueba posterior |
| Esperanza · Desamparados | Banda Municipal de Música de Mairena del Alcor | vídeo posterior localizado con la marcha «La Virgen de los Desamparados» | REUSE | probable; no materializar aún |
| Servitas · Santo Escapulario 19/09 | Banda de Música del Maestro Manuel Fernández Manzanar (MAFERMAN) | información oficial cargada y perfil oficial; Fuente actual sin URL/fecha | no existe | anunciado; no convertir a efectivo sin cierre posterior |

Las demás posiciones musicales permanecen `BLOCKED`. No se heredan contratos de 2024/2025 ni se usa el sonido de un vídeo sin identificación inequívoca.

## 7. Auditoría de duplicados

- Municipio: REUSE exclusivo `bf024af2-3eda-4989-b1b5-0a723dcf9cb4`.
- Hermandades/Orden, Lugares e Imágenes de Carmona: 0 REUSE nominal previo; los homónimos de otros municipios son `NO ACTION`.
- Esperanza: una corporación, dos Salidas penitenciales.
- Servitas: una corporación, dos Salidas de 2026; septiembre es REUSE.
- Amargura: dos crucificados distintos; no alias.
- Bandas: tres REUSE confirmados por UUID; El Arrabal y MAFERMAN son candidatos INSERT.
- Ninguna relación bloqueada se convertirá en fila por inferencia.

## 8. Puerta row-by-row

El orden futuro seguirá: `sources` → `places` → `entities` → `brotherhoods`/`bands` → `images` → `brotherhood_images` → `steps` → `brotherhood_steps` → `image_steps` → `outing_series` → `outings` → `outing_entities` → música → `source_links`.

Estado de la puerta:

- participación de las diez Salidas penitenciales, Pasos, sedes e identidad de Servitas: cerrados con bloqueos explícitos;
- posible REUSE del Paso servita en la Salida del 19 de septiembre: bloqueado por falta de prueba específica;
- música: parcial y todavía bloqueante;
- itinerarios/horarios penitenciales: no necesarios para el núcleo estructural y no se incorporan hasta disponer de la guía completa estable;
- plan row-by-row definitivo, manifiesto y recuento DML: **no autorizados todavía**.

El siguiente avance válido es obtener Fuentes primarias o posteriores estables para cada posición musical pendiente, reparar la procedencia de la Fuente servita de septiembre, resolver —o conservar como `null`— el Paso de esa Salida y volver a auditar REUSE/INSERT. Hasta entonces: 0 staging, 0 SQL, 0 dry-run y 0 Apply.
