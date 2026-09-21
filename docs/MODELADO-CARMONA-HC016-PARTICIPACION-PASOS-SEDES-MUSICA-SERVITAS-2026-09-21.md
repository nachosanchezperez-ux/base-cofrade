# Modelado de participación, Pasos, sedes, música y Servitas · Carmona · HC-016

**Fecha:** 21 de septiembre de 2026  
**Base:** `9055a35b30b1e6a4c05f654c3566a0d0e6ccf578`  
**Fase:** FIRST EDITION FREEZE · MODELADO CERRADO CON BLOQUEOS EXPLÍCITOS  
**Límites:** sin staging, payload SQL, dry-run, Apply, DDL, RLS ni publicación de datos

## 1. Resultado ejecutivo

- 9 sujetos corporativos: 8 hermandades penitenciales y la Orden Seglar Servita Carmona.
- **11 Salidas penitenciales de 2026** acreditadas como celebradas y una Salida servita adicional, ya existente, del 19 de septiembre.
- **18 Pasos únicos y 18 participaciones de Paso** documentables en los once cortejos penitenciales.
- **31 relaciones `image_steps` confirmadas**; 3 relaciones adicionales permanecen bloqueadas.
- 7 Lugares y 9 relaciones de sede actual.
- **15 de 18 posiciones musicales penitenciales identificadas**; 3 permanecen bloqueadas.
- 4 Bandas son REUSE seguro; 6 serían INSERT si una fase posterior autorizase materialización.
- El posible REUSE del Paso servita en septiembre y el cambio de estado de esa Salida permanecen bloqueados.

Este documento no es un manifiesto y no autoriza escrituras.

## 2. Participación efectiva por Salida

| Fecha | Corporación | Paso | Imágenes confirmadas | Exclusiones y bloqueos |
|---|---|---|---|---|
| 2026-03-27 | Servitas | Paso de palio de María Santísima de los Dolores | María Santísima de los Dolores | no inferir REUSE en septiembre |
| 2026-03-29 | Humildad | **Paso de la Sagrada Entrada en Jerusalén · La Borriquita** | **Sagrada Entrada de Jesús en Jerusalén** | talla de José Antonio Navarro Arteaga, 2026; no añadir secundarios no nombrados |
| 2026-03-29 | Esperanza | Misterio de la Coronación de Espinas | Coronación de Espinas; un sanedrita; dos soldados romanos; Poncio Pilatos | San Juan no acreditado en 2026 |
| 2026-03-29 | Esperanza | Palio de la Esperanza | María Santísima de la Esperanza | San Juan bloqueado |
| 2026-03-30 | Amargura | Paso del Señor de la Amargura | Señor de la Amargura | Cristo de San Felipe es otra talla |
| 2026-03-30 | Amargura | Palio del Mayor Dolor | María Santísima del Mayor Dolor | — |
| 2026-03-31 | Expiración | Misterio de la Expiración | Expiración; Dimas; Gestas; María Magdalena | Calvario, San Juan y San Blas no acreditados |
| 2026-03-31 | Expiración | Palio de los Dolores | María Santísima de los Dolores | — |
| 2026-04-01 | Quinta Angustia | Misterio del Sagrado Descendimiento | Cristo del Sagrado Descendimiento; Virgen de las Lágrimas | no añadir personajes no nombrados |
| 2026-04-01 | Quinta Angustia | Palio de las Angustias | Nuestra Señora y Madre de las Angustias | Cautivo y Ángeles fuera |
| 2026-04-02 | Santiago | Misterio de la Columna | Jesús en la Columna; sanedrita; sayón negro; centurión romano | el gallo es elemento iconográfico |
| 2026-04-02 | Santiago | Palio de la Paciencia | María Santísima de la Paciencia | — |
| 2026-04-03 | Nuestro Padre | Paso de Jesús Nazareno | Nuestro Padre Jesús Nazareno | no reconstruir el antiguo misterio |
| 2026-04-03 | Nuestro Padre | Palio de los Dolores | María Santísima de los Dolores | Divina Pastora fuera |
| 2026-04-03 | Esperanza | Urna del Cristo de los Desamparados | Santísimo Cristo de los Desamparados | no crear corporación separada |
| 2026-04-03 | Humildad | Misterio de Humildad y Paciencia | Nuestro Padre Jesús de la Humildad y Paciencia | San Juan bloqueado |
| 2026-04-03 | Humildad | Palio de los Dolores | María Santísima de los Dolores | — |
| 2026-04-04 | Santo Entierro | Misterio del Santo Entierro | Cristo Yacente; José de Arimatea; Nicodemo | María Magdalena bloqueada; Soledad aún sin palio |

Fuentes estructurales: fichas `CAR-F01`–`CAR-F10`. Evidencia posterior: `CAR-F13`–`CAR-F24`.

El recuento de 31 relaciones cuenta por separado a los dos soldados romanos de Coronación y añade la nueva Sagrada Entrada. La Salida de septiembre es REUSE seguro como acontecimiento, no como participación de Paso.

## 3. Dos correcciones de identidad

### Amargura

El [Consejo](https://consejohermandadescarmona.es/san-felipe/) documenta dos crucificados distintos:

- Señor de la Amargura: participa en el Lunes Santo de 2026;
- Santísimo Cristo de San Felipe: titular, sin participación acreditada en ese cortejo.

No son alias.

### Humildad y La Borriquita

La guía municipal *Carmona Penitente 2026* documenta una nueva imagen de la Sagrada Entrada en Jerusalén, obra de José Antonio Navarro Arteaga (2026), y su Salida del Domingo de Ramos. [TV Carmona](https://play.televisioncarmona.com/v/JeNyAaqE2pPPq7ZqSd/LA-BORRIQUITA-HERMANDAD-DE-LA-HUMILDAD-REPORTAJE-TVC//) confirma la celebración.

La Borriquita es un segundo cortejo de **Humildad**, no una hermandad nueva. Con esta corrección el suelo documental pasa de 28 a **29 imágenes titulares candidatas**.

## 4. Sedes actuales

| Corporación | Sede 2026 | Decisión futura |
|---|---|---|
| Servitas | Real Iglesia del Divino Salvador | INSERT Lugar + relación |
| Esperanza | Real Iglesia del Divino Salvador | REUSE del Lugar |
| Amargura | Iglesia de San Felipe | INSERT |
| Expiración | Iglesia de San Blas | INSERT |
| Quinta Angustia | Capilla de San Francisco | INSERT |
| Santiago | Iglesia de Santiago | INSERT |
| Nuestro Padre | Iglesia de San Bartolomé | INSERT |
| Humildad | Iglesia de San Pedro | INSERT |
| Santo Entierro | Iglesia de San Bartolomé | REUSE del Lugar |

Resultado: 7 Lugares, 9 `entity_locations`, 0 Lugares carmonenses preexistentes en Supabase.

## 5. Normalización de Servitas

La [web oficial](https://servitascarmona.com/) firma **Orden Seglar Siervos de María**, usa **Orden Seglar Servita Carmona** como nombre público y sitúa su sede en la Real Iglesia del Salvador.

Reglas:

1. un nodo corporativo;
2. una imagen de María Santísima de los Dolores;
3. un Paso documentado para el 27 de marzo;
4. Salida de septiembre REUSE: `ea6ab0d1-e6c4-4ea1-8727-92cee4ce3218`;
5. relación septiembre–Paso `BLOCKED`;
6. `event_status = announced` no se modifica.

La [publicación oficial del 19 de septiembre](https://www.facebook.com/ServitasCarmona/posts/%EF%B8%8F-%F0%9D%90%82%F0%9D%90%94%F0%9D%90%8B%F0%9D%90%93%F0%9D%90%8E%F0%9D%90%92-%F0%9D%90%8F%F0%9D%90%AB%F0%9D%90%A8%F0%9D%90%9C%F0%9D%90%9E%F0%9D%90%AC%F0%9D%90%A2%C3%B3%F0%9D%90%A7-%F0%9D%90%86%F0%9D%90%9E%F0%9D%90%A7%F0%9D%90%9E%F0%9D%90%AB%F0%9D%90%9A%F0%9D%90%A5-%F0%9D%90%9D%F0%9D%90%9E%F0%9D%90%A5-%F0%9D%90%92%F0%9D%90%9A%F0%9D%90%A7%F0%9D%90%AD%F0%9D%90%A8-%F0%9D%90%84%F0%9D%90%AC%F0%9D%90%9C%F0%9D%90%9A%F0%9D%90%A9%F0%9D%90%AE%F0%9D%90%A5%F0%9D%90%9A%F0%9D%90%AB%F0%9D%90%A2%F0%9D%90%A8-s%C3%A1bado-19-de-septiembre-1800-hr/1392126423115930/) recupera fecha, recorrido y MAFERMAN, pero sigue siendo anuncio previo.

## 6. Música 2026 por posición

| Salida/posición | Acompañamiento identificado | Conciliación | Estado probatorio |
|---|---|---|---|
| Servitas · palio, 27/03 | — | — | **BLOCKED** |
| La Borriquita · paso | Agrupación Musical Paz y Caridad de Estepa | REUSE `c0160032-0402-4000-8000-000000000002` | guía municipal + [calendario oficial](https://www.ampazycaridad.com/semana-santa-2026.php) |
| Esperanza · misterio | Agrupación Musical Nuestra Señora de Valme de Dos Hermanas | REUSE `4e4d493c-5273-44aa-8066-72dd1faa1ed8` | guía municipal + evidencia posterior |
| Esperanza · palio | Banda de Música Nuestra Señora de Guaditoca, Guadalcanal | INSERT candidato | guía municipal |
| Amargura · Señor | BCT Santísimo Cristo de la Victoria de León | REUSE `97f62582-42f5-4d5f-80e0-376398af98e8` | guía municipal + evidencia oficial/posterior |
| Amargura · palio | Banda Municipal de Aznalcóllar | INSERT candidato | guía municipal |
| Expiración · misterio | BCT Nuestro Padre Jesús Rescatado de La Solana | INSERT candidato | guía municipal + canal oficial |
| Expiración · palio | Banda Municipal de Música de Mairena del Alcor | REUSE `d6852052-92bb-4b54-b551-e52b656dea6d` | [renovación oficial](https://municipaldemairena.com/renovamos-nuestro-martes-santo-con-la-hermandad-de-san-blas/) + guía |
| Quinta Angustia · misterio | Música de capilla | no crea Banda sin conjunto nombrado | guía municipal; apoyo histórico |
| Quinta Angustia · palio | Banda de Música El Arrabal de Carmona | INSERT candidato | guía + publicación posterior de la corporación |
| Santiago · misterio | BCT Nuestra Señora de Gracia de Carmona | INSERT candidato | guía municipal + evidencia posterior |
| Santiago · palio | Banda de Música El Arrabal de Carmona | mismo INSERT candidato | guía municipal |
| Nuestro Padre · Cristo | Música de capilla | no crea Banda sin conjunto nombrado | guía municipal |
| Nuestro Padre · palio | Música de capilla | no crea Banda sin conjunto nombrado | guía municipal |
| Desamparados · urna | — | — | **BLOCKED; la guía omite música** |
| Humildad · misterio | — | — | **BLOCKED** |
| Humildad · palio | Banda de Música Nuestra Señora de Guaditoca, Guadalcanal | mismo INSERT candidato | guía municipal + publicación oficial posterior |
| Santo Entierro · misterio | Banda de Música El Arrabal de Carmona | mismo INSERT candidato | guía municipal + evidencia posterior |

La cruz de guía del Santo Entierro figura «de capilla», pero no es una posición de Paso y no aumenta el denominador de 18.

La asociación anterior de Mairena con Desamparados se elimina: procedía de un vídeo insuficiente y la guía municipal no atribuye acompañamiento. No se heredan contratos ni se identifica por oído.

### Salida servita de septiembre

| Posición | Banda | Conciliación | Estado |
|---|---|---|---|
| Santo Escapulario, 19/09 | Banda de Música del Maestro Manuel Fernández Manzanar (MAFERMAN) | INSERT candidato | anunciada por Servitas; ejecución aún no probada |

## 7. Auditoría REUSE/INSERT de Bandas

| Decisión documental | Bandas | Total |
|---|---|---:|
| REUSE | Paz y Caridad; Valme; Victoria de León; Mairena del Alcor | 4 |
| INSERT candidato | Guaditoca; Municipal de Aznalcóllar; Rescatado de La Solana; El Arrabal; Nuestra Señora de Gracia; MAFERMAN | 6 |
| Sin entidad Banda | posiciones «de capilla» sin conjunto nominal | 3 posiciones |
| BLOCKED | Servitas marzo; Desamparados; misterio de Humildad | 3 posiciones |

La consulta a Supabase fue exclusivamente de lectura. Ningún INSERT está autorizado.

## 8. Puerta row-by-row

Orden futuro, solo si se autoriza otra fase: `sources` → `places` → `entities` → `brotherhoods`/`bands` → `images` → relaciones → `steps` → `outings` → música → `source_links`.

Estado de la primera edición:

- 11 Salidas penitenciales, 18 Pasos, sedes e identidad corporativa: cerrados;
- 31 relaciones `image_steps`: confirmadas; 3 adicionales bloqueadas;
- música penitencial: 15/18 posiciones identificadas; 3 bloqueadas;
- septiembre: Salida REUSE y anuncio trazable; ejecución y Paso compartido bloqueados;
- manifiesto, recuento DML, staging, SQL, dry-run y Apply: **no autorizados**.

No se ampliará el alcance fuera de Carmona ni se resolverán bloqueos por inferencia.
