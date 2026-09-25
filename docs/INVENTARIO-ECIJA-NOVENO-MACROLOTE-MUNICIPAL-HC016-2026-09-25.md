# Inventario canónico · Écija · noveno macrolote municipal HC-016

**Fecha:** 25 de septiembre de 2026  
**Estado:** INVENTARIO CERRADO · SIN DML  
**Base:** `20af1a6a63c5c1a0e9667cfb1b61fe8f455a9031`  
**Municipio existente:** `f3fba0c4-fffa-4e8c-8495-3dc1c3bc94bf` · Écija  
**Alcance:** sujetos corporativos penitenciales/previos, Salidas 2026, Pasos, sedes, música y conciliación con producción  
**Prohibido en esta fase:** staging · SQL editorial · dry-run · Apply · DDL · RLS

## 1. Corrección del universo

El recálculo provincial seleccionó Écija usando la ficha de Turismo de la Provincia, que presenta 14 entradas y 30 Pasos.

El inventario posterior, al cruzarla con el **Consejo General de Hermandades y Cofradías de Écija**, la aplicación/programa 2026 y el balance municipal, corrige la ontología sin alterar la selección:

- **14 Hermandades penitenciales canónicas**;
- **1 Agrupación Parroquial**: Las Penas;
- **15 sujetos corporativos**;
- **16 Salidas procesionales 2026**;
- **32 Pasos procesionales 2026**.

La diferencia se explica por dos hechos:

1. **La Borriquita y El Cautivo son una sola Hermandad** con dos Salidas distintas el Domingo de Ramos.
2. La ficha provincial no incorpora a **Hermandad del Amor** y tampoco a la **Agrupación Parroquial de Las Penas**, mientras el programa oficial 2026 sí las incorpora.

La cifra municipal posterior de «15 hermandades participantes» es compatible con la nómina de 14 Hermandades más Las Penas tratada de forma coloquial; para el grafo, Las Penas **no debe degradarse a Hermandad** mientras siga siendo Agrupación Parroquial.

## 2. Estado productivo antes del lote

### REUSE seguro

- Municipio Écija: `f3fba0c4-fffa-4e8c-8495-3dc1c3bc94bf`.
- Lugar `Iglesia Parroquial Mayor de Santa Cruz`: `ba238706-78ac-4550-91d4-b826508fcb03`.
- Banda de Música AMUECI: `045c9781-6a07-40f4-9a27-be97b736e5a9`.
- Agrupación Musical Ntro. Padre Jesús de los Afligidos de Puente Genil: `c0160033-0401-4000-8000-000000000001`.
- Banda de Música Ciudad de Dos Hermanas: `98c7b480-9917-439f-aea4-d26e474add78`.
- Santa María Magdalena de Arahal, formación adulta: `c6000000-0000-4000-8000-000000000002`.
- Capilla Musical Ars Sacra: `2f6c0b1b-b3c8-43d7-99ac-8f341a65f2d1`.
- Banda de Música de Estepa: `c0160032-0401-4000-8000-000000000001`.

### Nodo existente que debe quedar fuera del universo penitencial

- `c68b76d4-411e-4bcb-8c86-4535ed4bd984` · Hermandad de Nuestra Señora del Valle Coronada.
- Es una corporación gloriosa con día actual 8 de septiembre.
- **NO MERGE** con ninguna corporación penitencial.
- Puede reutilizar el lugar Santa Cruz cuando proceda, pero no identidad corporativa.

### Riesgos de falso REUSE

- `c0160035-0403-4000-8000-000000000003` · BCT Nuestro Padre Jesús Rescatado de **La Solana**: **NO** es la formación de Villanueva de los Infantes que acompaña a La Borriquita.
- `5bbe416c-95b8-4f19-9d25-b5f199f2cdf0` · BCT Sagrada Columna y Azotes de **Sevilla / Las Cigarreras**: **NO** es la Agrupación Musical Sagrada Columna y Azotes de Écija.
- Álvarez Quintero aparece en producción con dos nodos:
  - `7fafdc04-cb94-47d8-814f-5537639660ff` · Asociación Musical Álvarez Quintero;
  - `f492d28d-af48-4606-862c-89d5d3560a6b` · Banda de Música Álvarez Quintero de Utrera.
  
  **BLOCKER de conciliación:** no elegir uno por nombre hasta comprobar si son duplicados canónicos o dos formaciones distintas.

## 3. Sujetos corporativos canónicos

| # | Sujeto | Tipo | Sede canónica | Jornada 2026 | Salidas |
|---:|---|---|---|---|---:|
| 1 | Agrupación Parroquial del Santísimo Cristo de las Penas, Nuestro Padre Jesús de las Tres Caídas y Nuestra Señora de la Salud | Agrupación Parroquial | Parroquia de Ntra. Sra. del Carmen | Sábado de Pasión | 1 |
| 2 | Ilustre y Fervorosa Hermandad y Cofradía de Nazarenos de la Sagrada Entrada Triunfal de Jesús en Jerusalén, Nuestro Padre Jesús Cautivo, Nuestra Madre y Señora de las Lágrimas y Santa María en Su Inmaculada Concepción | Hermandad | Iglesia Parroquial de Santa María Nuestra Señora | Domingo de Ramos | **2** |
| 3 | Hermandad Sacramental del Glorioso Patriarca San José y Cofradía de Nazarenos de Nuestro Padre Jesús del Amor en su Prendimiento y María Santísima de la Concepción | Hermandad | Capilla de Santa Ángela de la Cruz | Domingo de Ramos | 1 |
| 4 | Ilustre y Fervorosa Hermandad del Santísimo Cristo de la Yedra, Nuestra Señora de la Caridad, San Joaquín y Santa Ana | Hermandad | Iglesia de Santa Ana | Lunes Santo | 1 |
| 5 | Hermandad y Cofradía de Penitencia del Santísimo Cristo de la Expiración, Nuestra Señora de los Dolores y Nuestro Padre Jesús Nazareno de la Misericordia · Estudiantes / Santiago | Hermandad | Iglesia de Santiago el Mayor | Martes Santo | 1 |
| 6 | Hermandad Sacramental y Real Archicofradía de Nazarenos de la Coronación de Espinas de Nuestro Señor Jesucristo, San Marcos, San Roque, Santísimo Cristo de la Salud, Nuestra Señora de los Dolores Coronada, Sagrado Corazón de Jesús y San Juan de Dios | Hermandad | Iglesia de San Gil Abad | Miércoles Santo | 1 |
| 7 | Real y Fervorosa Hermandad y Cofradía de Penitencia del Bienaventurado San Francisco de Paula, Santísimo Cristo de la Sagrada Columna y Azotes, Santísimo Cristo de Confalón, Nuestra Señora de la Esperanza y de la Purísima Concepción de María | Hermandad | Iglesia de la Victoria | Jueves Santo | 1 |
| 8 | Real, Muy Antigua y Fervorosa Hermandad del Santísimo Cristo de la Sangre y Nuestra Señora de los Dolores | Hermandad | Iglesia Parroquial Mayor de Santa Cruz | Jueves Santo | 1 |
| 9 | Real y Venerable Hermandad y Cofradía de Nazarenos de Nuestro Padre Jesús Nazareno Abrazado a la Cruz y María Santísima de la Amargura | Hermandad | Iglesia Parroquial Mayor de Santa Cruz | Madrugá | 1 |
| 10 | Pontificia, Ilustre y Muy Antigua Hermandad y Cofradía de Nuestro Padre Jesús Nazareno, Santa Cruz en Jerusalén, María Santísima de las Misericordias, San Juan Evangelista y San Francisco de Écija | Hermandad | Iglesia de San Juan Bautista | Madrugá | 1 |
| 11 | Hermandad y Cofradía de Nuestro Padre Jesús sin Soga, Nuestra Señora de la Fe, Sagrados Corazones de Jesús y María y Santa Ángela de la Cruz | Hermandad | Iglesia de Santa Bárbara | Viernes Santo | 1 |
| 12 | Hermandad Sacramental de Nuestra Señora del Carmen y Cofradía de Nazarenos del Santísimo Cristo de la Misericordia, Nuestro Padre Jesús Descendido de la Cruz en el Misterio de Su Sagrada Mortaja y María Santísima de la Piedad | Hermandad | Iglesia de los Descalzos | Viernes Santo | 1 |
| 13 | Real, Muy Antigua y Fervorosa Hermandad de Nuestra Señora de la Piedad, Santísimo Cristo de la Exaltación en la Cruz y Nuestra Señora de la Merced | Hermandad | Iglesia Conventual de la Merced | Viernes Santo | 1 |
| 14 | Real, Muy Ilustre, Antigua y Noble Cofradía de Nazarenos de Nuestra Señora en la Consideración de Sus Angustias y Soledad, del Santísimo Cristo de la Paz, del Santo Entierro de Nuestro Señor Jesucristo y del Dulce Nombre de Jesús | Hermandad | Iglesia de Nuestra Señora del Carmen | Sábado Santo | 1 |
| 15 | Hermandad del Santísimo Sacramento, Gloriosa Resurrección de Nuestro Señor Jesucristo, María Santísima de la Alegría y Santa María Magdalena | Hermandad | Iglesia Parroquial Mayor de Santa Cruz | Domingo de Resurrección | 1 |

## 4. Lugares candidatos

**REUSE:** Iglesia Parroquial Mayor de Santa Cruz.

**Nuevos candidatos, sujetos a conciliación por nombre/alias antes del row-by-row:**

1. Parroquia / Iglesia de Santa María Nuestra Señora.
2. Capilla de Santa Ángela de la Cruz.
3. Iglesia de Santa Ana.
4. Iglesia / Parroquia de Santiago el Mayor.
5. Iglesia de San Gil Abad.
6. Iglesia de la Victoria.
7. Iglesia de San Juan Bautista.
8. Iglesia de Santa Bárbara.
9. Iglesia de los Descalzos.
10. Iglesia Conventual de la Merced.
11. Iglesia / Parroquia de Nuestra Señora del Carmen.

**Origen no canónico de Salida 2026:**
- Las Penas: carpa en calle Santísimo Cristo de las Penas; la Salida termina en la iglesia del Carmen.
- Amor: carpa en Estatuto de Autonomía; la sede canónica continúa siendo la Capilla de Santa Ángela de la Cruz.

No convertir las carpas en sede canónica.

## 5. Salidas históricas 2026

| # | Fecha | Cortejo | Corporación | Pasos | Estado de modelado |
|---:|---|---|---|---:|---|
| 1 | 28/03/2026 | Las Penas · Sábado de Pasión | Las Penas | 1 | histórico; prueba posterior individual disponible |
| 2 | 29/03/2026 | La Borriquita | Cautivo / Borriquita | 1 | histórico; **misma corporación que Cautivo** |
| 3 | 29/03/2026 | El Amor | Amor | 1 | histórico |
| 4 | 29/03/2026 | El Cautivo | Cautivo / Borriquita | 2 | histórico; **misma corporación que Borriquita** |
| 5 | 30/03/2026 | La Yedra | Yedra | 2 | histórico |
| 6 | 31/03/2026 | Los Estudiantes / Santiago | Expiración / Estudiantes | 3 | histórico |
| 7 | 01/04/2026 | San Gil | San Gil | 3 | histórico |
| 8 | 02/04/2026 | Confalón | Confalón | 3 | histórico |
| 9 | 02/04/2026 | La Sangre | Sangre | 2 | histórico |
| 10 | 03/04/2026 | El Silencio | Silencio | 2 | histórico |
| 11 | 03/04/2026 | San Juan | San Juan | 2 | histórico |
| 12 | 03/04/2026 | La Mortaja | Mortaja | 1 | histórico |
| 13 | 03/04/2026 | Jesús sin Soga | Jesús sin Soga | 2 | histórico |
| 14 | 03/04/2026 | La Piedad | Piedad / Merced | 2 | histórico |
| 15 | 04/04/2026 | Santo Entierro / Soledad | Soledad | 3 | histórico |
| 16 | 05/04/2026 | El Resucitado | Resucitado | 2 | histórico |

**Regla temporal:** los horarios e itinerarios de estas Salidas pertenecen a 2026 y nunca deben alimentar automáticamente la Agenda futura.

## 6. Pasos y acompañamientos 2026

| Salida | Posición / Paso | Música documentada |
|---|---|---|
| Las Penas | Santísimo Cristo de las Penas | Agrupación Musical Santísimo Cristo de la Sagrada Columna y Azotes de Écija |
| La Borriquita | Sagrada Entrada Triunfal de Jesús en Jerusalén | BCT Nuestro Padre Jesús Rescatado · Villanueva de los Infantes |
| El Amor | Nuestro Padre Jesús del Amor en su Prendimiento | BCT Santísimo Cristo del Perdón, Ntra. Sra. de la Amargura y San Juan Bosco · Pozoblanco |
| El Cautivo | Nuestro Padre Jesús Cautivo | Capilla musical · formación no identificada |
| El Cautivo | Nuestra Madre y Señora de las Lágrimas | Banda de Música de Fuentes de Andalucía |
| La Yedra | Santísimo Cristo de la Yedra | BCT Caído y Fuensanta · Córdoba |
| La Yedra | Nuestra Señora de la Caridad | Banda de Música Ciudad de Dos Hermanas · **REUSE** `98c7b480-9917-439f-aea4-d26e474add78` |
| Estudiantes | Nuestro Padre Jesús Nazareno de la Misericordia | AM Nuestro Padre Jesús Despojado · Jaén |
| Estudiantes | Santísimo Cristo de la Expiración | Santa María Magdalena de Arahal · **REUSE adulto** `c6000000-0000-4000-8000-000000000002` |
| Estudiantes | Nuestra Señora de los Dolores | Banda de Música de Torredonjimeno |
| San Gil | Coronación de Espinas | AM Santa Cruz · Huelva |
| San Gil | Santísimo Cristo de la Salud | Banda de Música Vera+Cruz · Almogía |
| San Gil | Nuestra Señora de los Dolores Coronada | Banda Sinfónica Musical de Dos Torres |
| Confalón | Sagrada Columna y Azotes | BCT Santísimo Cristo de la Sangre · Sevilla |
| Confalón | Santísimo Cristo de Confalón | Sin Banda: “vivas” de los hermanos de paso |
| Confalón | Nuestra Señora de la Esperanza | Asociación Musical Álvarez Quintero · Utrera · **BLOCKED por doble nodo existente** |
| Sangre | Santísimo Cristo de la Sangre | AM Ntro. Padre Jesús de los Afligidos · **REUSE** `c0160033-0401-4000-8000-000000000001` |
| Sangre | Nuestra Señora de los Dolores | Asociación Cultural Amigos de la Música · Herrera |
| Silencio | Jesús Nazareno Abrazado a la Cruz | **Sin acompañamiento musical** |
| Silencio | María Santísima de la Amargura | Capilla Musical Ars Sacra · **REUSE** `2f6c0b1b-b3c8-43d7-99ac-8f341a65f2d1` |
| San Juan | Nuestro Padre Jesús Nazareno | BCT Nuestra Señora de la Palma · Utrera |
| San Juan | María Santísima de las Misericordias | Banda de Música AMUECI · **REUSE** `045c9781-6a07-40f4-9a27-be97b736e5a9` |
| Jesús sin Soga | Nuestro Padre Jesús sin Soga | Trío de Capilla Musical El Cirineo · Écija |
| Jesús sin Soga | Nuestra Señora de la Fe | Capilla Musical Hispalense · Dos Hermanas |
| Mortaja | Misterio de la Sagrada Mortaja | **Sin acompañamiento musical** |
| Piedad | Santísimo Cristo de la Exaltación en la Cruz | BCT Stmo. Cristo de la Columna “Los Coloraos” · Daimiel |
| Piedad | Nuestra Señora de la Piedad | Banda de Música de Estepa · **REUSE** `c0160032-0401-4000-8000-000000000001` |
| Soledad | Quinta Angustia · Cristo de la Paz + María Santísima de las Angustias | Banda de Música Villa de Marchena |
| Soledad | Santo Entierro | **Matracas** · no Banda |
| Soledad | Nuestra Señora de la Soledad | Banda de Música AMUECI · **REUSE** |
| Resucitado | Cristo Resucitado | BCT María Santísima de la Palma · Marchena |
| Resucitado | María Santísima de la Alegría | Ateneo Musical de Écija |

**Total: 32 posiciones de Paso · 32 acompañamientos resueltos a nivel descriptivo.**

No todas generan `outing_music_assignments` a Banda:
- 2 posiciones son silencio explícito;
- 1 usa matracas;
- 1 usa “vivas”;
- 1 usa capilla no identificada;
- 2 usan conjuntos de capilla identificados pero pueden modelarse como Banda/Capilla si la entidad es canónica;
- el resto son formaciones musicales nominales.

## 7. Titularidad vs participación procesional

No crear automáticamente una relación Imagen–Paso para todo titular incluido en la denominación corporativa.

Casos explícitos:

- Las Penas: Nuestro Padre Jesús de las Tres Caídas era todavía proyecto de futura imagen en enero de 2026; **no existe como imagen ejecutada para la Salida del 28/03**.
- Cautivo/Borriquita: Santa María en Su Inmaculada Concepción es titular corporativa, no Paso documentado en estas dos Salidas 2026.
- Amor: María Santísima de la Concepción y San José forman parte de la identidad corporativa; la cofradía de 2026 procesiona con **un solo Paso**, el Señor del Amor.
- Yedra: San Joaquín y Santa Ana son titulares, pero los dos Pasos 2026 son Cristo de la Yedra y Virgen de la Caridad.
- San Gil: San Marcos, San Roque, Sagrado Corazón y San Juan de Dios no deben convertirse en Pasos por aparecer en el título.
- Confalón: San Francisco de Paula y Purísima Concepción no generan Pasos 2026.
- San Juan: Santa Cruz en Jerusalén, San Juan Evangelista y San Francisco de Écija no crean posiciones adicionales.
- Jesús sin Soga: Sagrados Corazones y Santa Ángela de la Cruz no crean Pasos 2026.
- Mortaja: la corporación incluye al Santísimo Cristo de la Misericordia, pero 2026 documenta **un único Paso**, el misterio de la Sagrada Mortaja.
- Piedad: Nuestra Señora de la Merced es titular corporativa, pero los dos Pasos 2026 son Exaltación y Piedad.
- Soledad: la primera posición es el misterio de la Quinta Angustia (Cristo de la Paz + María Santísima de las Angustias), seguida por Santo Entierro y Nuestra Señora de la Soledad.

La composición secundaria de los misterios se aplaza al modelado fila a fila y solo se incorporará con evidencia individual.

## 8. Evidencia posterior

El Ayuntamiento de Écija publicó el 7 de abril un balance que afirma la **plena realización de las estaciones de penitencia** durante la Semana Santa 2026.

Esto permite considerar el conjunto de Hermandades tradicionales como **candidatas a `held`**, pero el futuro row-by-row debe enlazar la evidencia a cada ocurrencia concreta o a una evidencia posterior suficiente para la jornada.

Las Penas, por no ser Hermandad, queda cubierta además por una crónica posterior individual que confirma su primera Salida procesional del 28/03/2026.

## 9. Cierre del inventario

**Inventario corporativo y procesional: CERRADO.**

Congelado:

- 15 sujetos corporativos;
- 14 Hermandades + 1 Agrupación Parroquial;
- 16 Salidas 2026;
- 32 Pasos;
- 32 posiciones musicales descriptivamente resueltas;
- 11 lugares/sedes principales, con Santa Cruz como REUSE;
- Virgen del Valle preservada fuera del universo;
- doble Salida Borriquita/Cautivo preservada bajo una sola corporación;
- Las Penas preservada como Agrupación;
- Álvarez Quintero bloqueada hasta resolver duplicidad;
- falsos REUSE de Rescatado y Columna y Azotes explícitamente prohibidos.

**Siguiente puerta permitida:** modelado de relaciones + evidencia posterior por Salida + conciliación musical REUSE/INSERT.

Aún no se autorizan row-by-row, staging, SQL ni Apply.
