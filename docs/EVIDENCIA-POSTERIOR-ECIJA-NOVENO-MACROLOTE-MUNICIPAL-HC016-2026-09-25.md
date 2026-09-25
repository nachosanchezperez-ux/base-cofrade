# Evidencia posterior · Écija · noveno macrolote municipal HC-016

**Fecha:** 25 de septiembre de 2026  
**Estado:** CERRADA PARA MODELADO · SIN DML  
**Objetivo:** decidir de forma verificable si las 16 Salidas 2026 pueden modelarse como hechos históricos `held`.

## 1. Regla

Una convocatoria previa no se convierte en hecho por el mero paso del tiempo.

Cada Salida necesita:

- identidad/fecha/recorrido desde la ficha 2026 correspondiente; y
- una prueba posterior suficiente de celebración.

## 2. Evidencia posterior maestra

### ECI-F05 · Ayuntamiento de Écija · 7 de abril de 2026

`https://www.ecija.es/exito-rotundo-de-la-semana-santa-de-ecija-2026-un-balance-positivo-marcado-por-la-alta-participacion/`

El balance municipal posterior declara finalizada la Semana Santa 2026 y señala la **plena realización de las estaciones de penitencia por parte de todas las hermandades**.

Uso:

- prueba posterior oficial global para las Hermandades penitenciales;
- no sustituye la ficha individual que identifica cuál es la Salida;
- no cubre por sí sola a Las Penas porque es Agrupación Parroquial.

### ECI-F07 · Las Penas · 29 de marzo

`https://www.ecijaweb.com/ecija/cofrade/la-penas-retoma-el-sabado-de-pasion-en-ecija/20260329113819033781.html`

Crónica posterior individual que afirma que el Cristo de las Penas **salía el Sábado de Pasión por primera vez en procesión**.

Uso: prueba posterior directa de la Salida del 28/03.

### ECI-F27 · Domingo de Ramos · balance individual posterior

`https://www.ecijaweb.com/comienza-una-semana-santa-en-ecija-marcada-por-el-cambio-de-hora-y-algo-de-viento/`

Publicado el 30/03. Confirma individualmente:

- Borriquita: la planificación se cumplió y la cofradía salió;
- Amor: comenzó su estación de penitencia desde La Alcarrachela;
- Cautivo: realizó su estación de penitencia.

Esta fuente resuelve de forma expresa las **dos Salidas de la misma Hermandad Cautivo/Borriquita**.

## 3. Matriz de las 16 Salidas

| # | Salida | Fecha | Fuente de identidad 2026 | Evidencia posterior | Resultado |
|---:|---|---|---|---|---|
| 1 | Las Penas | 28/03 | ECI-F08 | **ECI-F07 directa** | `held` |
| 2 | Borriquita | 29/03 | ECI-F09 | **ECI-F27 directa** + F05 | `held` |
| 3 | Amor | 29/03 | ECI-F10 | **ECI-F27 directa** + F05 | `held` |
| 4 | Cautivo | 29/03 | ECI-F11 | **ECI-F27 directa** + F05 | `held` |
| 5 | Yedra | 30/03 | ECI-F12 | ECI-F05 oficial posterior | `held` |
| 6 | Estudiantes | 31/03 | ECI-F13 | ECI-F05 oficial posterior | `held` |
| 7 | San Gil | 01/04 | ECI-F14 | ECI-F05 oficial posterior | `held` |
| 8 | Confalón | 02/04 | ECI-F15 | ECI-F05 oficial posterior | `held` |
| 9 | Sangre | 02/04 | ECI-F16 | ECI-F05 oficial posterior | `held` |
| 10 | Silencio | 03/04 | ECI-F17 | ECI-F05 oficial posterior | `held` |
| 11 | San Juan | 03/04 | ECI-F18 | ECI-F05 oficial posterior | `held` |
| 12 | Mortaja | 03/04 | ECI-F19 | ECI-F05 oficial posterior | `held` |
| 13 | Jesús sin Soga | 03/04 | ECI-F20 | ECI-F05 oficial posterior | `held` |
| 14 | Piedad | 03/04 | ECI-F21 | ECI-F05 oficial posterior | `held` |
| 15 | Soledad | 04/04 | ECI-F22 | ECI-F05 oficial posterior | `held` |
| 16 | Resucitado | 05/04 | ECI-F23 | ECI-F05 oficial posterior | `held` |

## 4. Regla de source_links futura

Para cada outing de Hermandad:

- enlazar su ficha individual ECI-F09–F23 como alcance «horario, recorrido, Pasos y música 2026»;
- enlazar ECI-F05 como alcance «evidencia posterior de celebración / estado held».

Para Las Penas:

- ECI-F08 = horario, recorrido y música;
- ECI-F07 = evidencia posterior directa.

Para las tres Salidas del Domingo de Ramos:

- añadir ECI-F27 como evidencia posterior individual;
- mantener F05 como confirmación oficial global.

## 5. Incertidumbre preservada

La evidencia posterior permite elevar el **estado de celebración**, pero no prueba por sí sola que:

- todos los horarios orientativos se cumplieran al minuto;
- todos los acompañamientos musicales tocaran el recorrido completo;
- no existieran cambios de recorrido de última hora;
- todas las figuras secundarias de los misterios fueran idénticas a un año anterior.

Por tanto:

- `event_status = held` sí;
- horarios/recorridos = históricos 2026 según programa, con cambios solo si hay fuente posterior específica;
- música = relación documentada para la edición, sin inferir continuidad futura.

## 6. Cierre

**16/16 Salidas quedan habilitadas para modelarse como `held`.**

No queda ninguna Salida 2026 en estado BLOCKED por falta de prueba posterior.

La puerta de evidencia posterior queda **CERRADA**.
