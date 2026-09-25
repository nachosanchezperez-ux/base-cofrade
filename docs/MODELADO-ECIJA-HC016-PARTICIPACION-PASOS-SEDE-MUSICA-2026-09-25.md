# Modelado · Écija · HC-016 · participación, Pasos, sedes y música

**Fecha:** 25 de septiembre de 2026  
**Estado:** MODELADO CERRADO · SIN DML  
**Base:** `2dd01a89f709d4710a6a943d876fbe586a0b01e7`  
**Universo:** 15 sujetos · 16 Salidas 2026 · 32 Pasos  
**Regla:** este documento congela relaciones; no autoriza row-by-row, staging, SQL ni Apply.

## 1. Reglas ontológicas congeladas

1. **Borriquita y Cautivo son una sola Hermandad** y generan dos series/salidas distintas el Domingo de Ramos.
2. **Las Penas es Agrupación Parroquial**, no Hermandad.
3. **Virgen del Valle** queda fuera del universo penitencial y no se fusiona con ningún sujeto.
4. La sede canónica no se sustituye por el origen excepcional de una Salida:
   - Las Penas: sede Carmen; origen 2026 en carpa.
   - Amor: sede Capilla de Santa Ángela; origen 2026 en carpa.
5. Un titular corporativo no implica participación procesional.
6. Las Salidas 2026 son históricos; sus itinerarios no alimentan Agenda futura.
7. Silencio, matracas, vivas y capilla no identificada son estados musicales resueltos, no “música desconocida”.
8. Ninguna figura secundaria de misterio se crea sin evidencia individual posterior.

## 2. Modelo de sedes

| Sujeto | Lugar canónico | Operación futura |
|---|---|---|
| Las Penas | Parroquia / Iglesia de Ntra. Sra. del Carmen | INSERT candidato |
| Cautivo / Borriquita | Iglesia Parroquial de Santa María Nuestra Señora | INSERT candidato |
| Amor | Capilla de Santa Ángela de la Cruz | INSERT candidato |
| Yedra | Iglesia de Santa Ana | INSERT candidato |
| Estudiantes / Santiago | Iglesia de Santiago el Mayor | INSERT candidato |
| San Gil | Iglesia de San Gil Abad | INSERT candidato |
| Confalón | Iglesia de la Victoria | INSERT candidato |
| Sangre | Iglesia Parroquial Mayor de Santa Cruz | **REUSE** `ba238706-78ac-4550-91d4-b826508fcb03` |
| Silencio | Iglesia Parroquial Mayor de Santa Cruz | **REUSE** |
| San Juan | Iglesia de San Juan Bautista | INSERT candidato |
| Jesús sin Soga | Iglesia de Santa Bárbara | INSERT candidato |
| Mortaja | Iglesia de los Descalzos / Limpia Concepción | INSERT candidato |
| Piedad / Merced | Iglesia Conventual de la Merced | INSERT candidato |
| Soledad | Iglesia / Parroquia de Ntra. Sra. del Carmen | mismo Lugar que Las Penas |
| Resucitado | Iglesia Parroquial Mayor de Santa Cruz | **REUSE** |

El futuro row-by-row debe normalizar los alias «Iglesia del Carmen / Parroquia del Carmen» y «Descalzos / Limpia Concepción» antes de asignar UUID.

## 3. Participación 2026 · 16 Salidas

| # | Fecha | Salida | Sujeto | Paso(s) | Imágenes primarias |
|---:|---|---|---|---:|---|
| 1 | 28/03 | Las Penas | Las Penas | 1 | Santísimo Cristo de las Penas |
| 2 | 29/03 | La Borriquita | Cautivo / Borriquita | 1 | Sagrada Entrada Triunfal de Jesús en Jerusalén |
| 3 | 29/03 | El Amor | Amor | 1 | Nuestro Padre Jesús del Amor en su Prendimiento |
| 4 | 29/03 | El Cautivo | Cautivo / Borriquita | 2 | Nuestro Padre Jesús Cautivo; Nuestra Madre y Señora de las Lágrimas |
| 5 | 30/03 | La Yedra | Yedra | 2 | Santísimo Cristo de la Yedra; Nuestra Señora de la Caridad |
| 6 | 31/03 | Los Estudiantes | Estudiantes / Santiago | 3 | Jesús Nazareno de la Misericordia; Cristo de la Expiración; Virgen de los Dolores |
| 7 | 01/04 | San Gil | San Gil | 3 | Coronación de Espinas; Cristo de la Salud; Dolores Coronada |
| 8 | 02/04 | Confalón | Confalón | 3 | Cristo de la Columna y Azotes; Cristo de Confalón; Virgen de la Esperanza |
| 9 | 02/04 | La Sangre | Sangre | 2 | Cristo de la Sangre; Virgen de los Dolores |
| 10 | 03/04 | El Silencio | Silencio | 2 | Jesús Nazareno Abrazado a la Cruz; Virgen de la Amargura |
| 11 | 03/04 | San Juan | San Juan | 2 | Nuestro Padre Jesús Nazareno; María Santísima de las Misericordias |
| 12 | 03/04 | La Mortaja | Mortaja | 1 | Jesús Descendido de la Cruz; María Santísima de la Piedad |
| 13 | 03/04 | Jesús sin Soga | Jesús sin Soga | 2 | Nuestro Padre Jesús sin Soga; Nuestra Señora de la Fe |
| 14 | 03/04 | La Piedad | Piedad / Merced | 2 | Cristo de la Exaltación; Nuestra Señora de la Piedad |
| 15 | 04/04 | La Soledad | Soledad | 3 | Cristo de la Paz + Virgen de las Angustias; Cristo Yacente / Santo Entierro; Nuestra Señora de la Soledad |
| 16 | 05/04 | El Resucitado | Resucitado | 2 | Cristo Resucitado; María Santísima de la Alegría |

**Recuento:** 16 Salidas · 32 Pasos · 34 participaciones primarias de Imagen en Paso, porque Mortaja y Quinta Angustia contienen dos imágenes primarias cada una.

## 4. Titulares corporativos no convertidos en Paso 2026

La relación `brotherhood_images` podrá incluir titulares corporativos documentados, pero `outing_entities` / `image_steps` solo se crean cuando existe participación real.

Casos explícitos:

- Las Penas: Jesús de las Tres Caídas era proyecto de futura imagen; **no crear Imagen ejecutada** en 2026.
- Cautivo: Inmaculada Concepción no genera Paso en Borriquita/Cautivo 2026.
- Amor: San José y María Santísima de la Concepción no generan Paso 2026.
- Yedra: San Joaquín y Santa Ana no generan Paso.
- San Gil: San Marcos, San Roque, Sagrado Corazón y San Juan de Dios no generan Paso.
- Confalón: San Francisco de Paula y Purísima Concepción no generan Paso.
- San Juan: Santa Cruz en Jerusalén, San Juan Evangelista y San Francisco de Écija no generan posiciones adicionales.
- Jesús sin Soga: Sagrados Corazones y Santa Ángela de la Cruz no generan Paso.
- Mortaja: Cristo de la Misericordia es titular, pero el cortejo documenta un único misterio de Mortaja.
- Piedad: Nuestra Señora de la Merced no genera Paso.
- Resucitado: Santa María Magdalena no genera Paso independiente.

## 5. Modelado musical · 32 posiciones

| # | Salida · Paso | Resolución | Operación futura |
|---:|---|---|---|
| 1 | Penas · Cristo de las Penas | AM Sagrada Columna y Azotes · Écija | INSERT Banda |
| 2 | Borriquita | BCT Jesús Rescatado · Villanueva de los Infantes | INSERT Banda |
| 3 | Amor | BCT Perdón / Amargura · Pozoblanco | INSERT Banda |
| 4 | Cautivo · Cristo | Capilla musical no identificada | texto, sin Banda |
| 5 | Cautivo · Lágrimas | Banda de Música de Fuentes de Andalucía | INSERT Banda |
| 6 | Yedra · Cristo | BCT Caído y Fuensanta · Córdoba | INSERT Banda |
| 7 | Yedra · Caridad | Banda Música Ciudad de Dos Hermanas | **REUSE** `98c7b480-9917-439f-aea4-d26e474add78` |
| 8 | Estudiantes · Misericordia | AM Jesús Despojado · Jaén | INSERT Banda |
| 9 | Estudiantes · Expiración | Santa María Magdalena de Arahal · adulta | **REUSE** `c6000000-0000-4000-8000-000000000002` |
| 10 | Estudiantes · Dolores | Banda de Música de Torredonjimeno | INSERT Banda |
| 11 | San Gil · Coronación | AM Santa Cruz · Huelva | INSERT Banda |
| 12 | San Gil · Salud | Banda Música Vera+Cruz · Almogía | INSERT Banda |
| 13 | San Gil · Dolores | Banda Sinfónica Municipal de Dos Torres | INSERT Banda |
| 14 | Confalón · Columna | BCT Santísimo Cristo de la Sangre · Sevilla | **REUSE** `9aef3c3e-e9c8-433f-8257-ea10f4c083b1` · Sangre de San Benito |
| 15 | Confalón · Cristo de Confalón | “vivas” de hermanos de paso | sin Banda |
| 16 | Confalón · Esperanza | Asociación Musical Álvarez Quintero · Utrera | **REUSE canónico** `7fafdc04-cb94-47d8-814f-5537639660ff` |
| 17 | Sangre · Cristo | AM Afligidos · Puente Genil | **REUSE** `c0160033-0401-4000-8000-000000000001` |
| 18 | Sangre · Dolores | Amigos de la Música · Herrera | INSERT Banda |
| 19 | Silencio · Cristo | sin acompañamiento | silencio explícito |
| 20 | Silencio · Amargura | Capilla Musical Ars Sacra | **REUSE** `2f6c0b1b-b3c8-43d7-99ac-8f341a65f2d1` |
| 21 | San Juan · Jesús Nazareno | BCT Ntra. Sra. de la Palma · Utrera | INSERT Banda |
| 22 | San Juan · Misericordias | Banda Música AMUECI | **REUSE** `045c9781-6a07-40f4-9a27-be97b736e5a9` |
| 23 | Jesús sin Soga · Cristo | Capilla Musical El Cirineo · Écija · participación como trío | INSERT Capilla |
| 24 | Jesús sin Soga · Fe | Capilla Musical Hispalense · Dos Hermanas | INSERT Capilla |
| 25 | Mortaja | sin acompañamiento | silencio explícito |
| 26 | Piedad · Exaltación | BCT Columna “Los Coloraos” · Daimiel | INSERT Banda |
| 27 | Piedad · Virgen | Banda Música de Estepa | **REUSE** `c0160032-0401-4000-8000-000000000001` |
| 28 | Soledad · Quinta Angustia | Banda Música Villa de Marchena | INSERT Banda |
| 29 | Soledad · Santo Entierro | matracas | sin Banda |
| 30 | Soledad · Virgen | Banda Música AMUECI | **REUSE** |
| 31 | Resucitado · Cristo | BCT María Santísima de la Palma · Marchena | INSERT Banda |
| 32 | Resucitado · Alegría | Ateneo Musical de Écija | INSERT Banda |

### Recuento musical congelado

- 32 posiciones;
- 27 posiciones con formación nominal;
- 5 posiciones sin entidad Banda:
  - 1 capilla no identificada;
  - 2 silencios explícitos;
  - 1 “vivas”;
  - 1 matracas;
- 9 asignaciones futuras a nodos REUSE;
- 18 formaciones nuevas candidatas a INSERT;
- 8 nodos REUSE únicos, porque AMUECI participa en dos posiciones.

## 6. Álvarez Quintero · decisión canónica

Producción contiene dos nodos:

1. `7fafdc04-cb94-47d8-814f-5537639660ff` · **Asociación Musical Álvarez Quintero**
   - web oficial `https://www.bandaalvarezquintero.es/`;
   - municipio Utrera;
   - fundación 1963;
   - Fuente directa de la formación;
   - periodos históricos ya enlazados.

2. `f492d28d-af48-4606-862c-89d5d3560a6b` · **Banda de Música Álvarez Quintero de Utrera**
   - sin web;
   - creado desde una guía secundaria;
   - representa la misma organización.

La web oficial utiliza tanto “Banda de Música Álvarez Quintero” como “Asociación Musical Álvarez Quintero” para la misma organización y explica su continuidad histórica desde 1963.

### Decisión

- **CANÓNICO:** `7fafdc04-cb94-47d8-814f-5537639660ff`.
- Confalón/Esperanza 2026 reutilizará ese UUID.
- `f492d28d-af48-4606-862c-89d5d3560a6b` queda clasificado como **duplicado legado**.
- El lote de Écija no creará un tercer nodo.
- La futura fase row-by-row decidirá si incluye una reconciliación no destructiva de referencias del nodo legado; **nunca DELETE por conveniencia**.

Álvarez Quintero deja de ser BLOCKER para Écija.

## 7. Falsos REUSE prohibidos

- Rescatado de Villanueva de los Infantes ≠ Rescatado de La Solana `c0160035-0403-...`.
- AM Columna y Azotes de Écija ≠ BCT Sagrada Columna y Azotes de Las Cigarreras `5bbe416c-...`.
- Banda Villa de Marchena ≠ Banda Castillo de la Mota de Marchena.
- BCT Palma de Marchena ≠ BCT Sagrado Corazón de Jesús de Marchena.
- Banda Vera+Cruz de Almogía ≠ AM Vera Cruz de Campillos ni BCT Vera+Cruz de Utrera.
- BCT Ntra. Sra. de la Palma de Utrera ≠ cualquier imagen/marcha “Palma” existente.

## 8. Contrato para la siguiente puerta

Este modelado deja resuelto:

- corporación ↔ Salida;
- Salida ↔ Paso;
- Paso ↔ Imagen primaria;
- sede canónica;
- posición musical;
- Banda REUSE / INSERT / sin entidad;
- duplicidad Álvarez Quintero.

**Siguiente fase permitida:** pre-row-by-row determinista.

Antes de escribir una sola fila deberán:
1. comprobarse los 18 candidatos musicales contra producción por nombre + municipio;
2. asignarse UUID determinista al nuevo namespace;
3. enumerarse todas las entidades corporativas, Imágenes, Pasos, Lugares y relaciones;
4. fijarse el tratamiento no destructivo del duplicado legado Álvarez Quintero;
5. contar DML/REUSE/UPDATE/DELETE (=0) antes de staging.

Aún no se autorizan staging, SQL editorial, dry-run ni Apply.
