# Conciliación musical · Écija · HC-016

**Fecha:** 25 de septiembre de 2026  
**Estado:** CERRADA PARA PRE-ROW-BY-ROW · SIN DML  
**Ámbito:** 32 posiciones musicales de las 16 Salidas 2026

## 1. Resultado

| Clase | Posiciones | Formaciones únicas |
|---|---:|---:|
| Banda/Capilla con REUSE canónico | 9 | 8 |
| Banda/Capilla candidata a INSERT | 18 | 18 |
| Sin entidad musical | 5 | — |
| **TOTAL** | **32** | **26 formaciones nominales únicas** |

Las 5 posiciones sin entidad son:

- Cautivo · Cristo: capilla musical no identificada;
- Confalón · Cristo: vivas;
- Silencio · Cristo: silencio;
- Mortaja: silencio;
- Soledad · Santo Entierro: matracas.

## 2. REUSE canónicos

| Formación | UUID canónico | Uso en Écija |
|---|---|---|
| Banda Música Ciudad de Dos Hermanas | `98c7b480-9917-439f-aea4-d26e474add78` | Yedra · Caridad |
| Santa María Magdalena de Arahal · adulta | `c6000000-0000-4000-8000-000000000002` | Estudiantes · Expiración |
| Sangre de San Benito / BCT Stmo. Cristo de la Sangre | `9aef3c3e-e9c8-433f-8257-ea10f4c083b1` | Confalón · Columna |
| Asociación Musical Álvarez Quintero | `7fafdc04-cb94-47d8-814f-5537639660ff` | Confalón · Esperanza |
| AM Ntro. Padre Jesús de los Afligidos | `c0160033-0401-4000-8000-000000000001` | Sangre · Cristo |
| Capilla Musical Ars Sacra | `2f6c0b1b-b3c8-43d7-99ac-8f341a65f2d1` | Silencio · Amargura |
| Banda Música AMUECI | `045c9781-6a07-40f4-9a27-be97b736e5a9` | San Juan · Misericordias; Soledad · Virgen |
| Banda Música de Estepa | `c0160032-0401-4000-8000-000000000001` | Piedad · Virgen |

## 3. INSERT candidatos congelados

Estos nombres representan formaciones distintas de cualquier coincidencia actualmente encontrada en producción.

| # | Formación canónica candidata | Procedencia | Fuente de identidad / participación |
|---:|---|---|---|
| 1 | Agrupación Musical Santísimo Cristo de la Sagrada Columna y Azotes de Écija | Écija | Hermandad Confalón / programa Écija 2026 |
| 2 | BCT Nuestro Padre Jesús Rescatado | Villanueva de los Infantes | Ayuntamiento / programa Écija |
| 3 | BCT Santísimo Cristo del Perdón y Ntra. Sra. de la Amargura · “Los del Perdón” | Pozoblanco | Semana Santa Pozoblanco / programa Écija |
| 4 | Banda de Música de Fuentes de Andalucía | Fuentes de Andalucía | web de la formación / programa Écija |
| 5 | BCT Nuestro Padre Jesús Caído y Ntra. Sra. de la Fuensanta | Córdoba | Hermandad del Descendimiento / programa Écija |
| 6 | Agrupación Musical Nuestro Padre Jesús Despojado | Jaén | web oficial / programa Écija |
| 7 | Banda de Música de Torredonjimeno | Torredonjimeno | Federband / programa Écija |
| 8 | Agrupación Musical Santa Cruz | Huelva | formación / programa Écija |
| 9 | Banda de Música del Santo Cristo de la Vera+Cruz | Almogía | web oficial / programa Écija |
| 10 | Banda Sinfónica Municipal de Dos Torres | Dos Torres | web municipal / programa Écija |
| 11 | Asociación Cultural Amigos de la Música | Herrera | web de la asociación / programa Écija |
| 12 | BCT Nuestra Señora de la Palma | Utrera | programa Écija 2026; identidad exacta aún con Fuente primaria pendiente |
| 13 | Capilla Musical El Cirineo | Écija | programa Écija; participación 2026 en formato trío |
| 14 | Capilla Musical Hispalense | Dos Hermanas | programa Écija 2026 |
| 15 | BCT Santísimo Cristo de la Columna · “Los Coloraos” | Daimiel | Ayuntamiento de Daimiel / programa Écija |
| 16 | Banda de Música Villa de Marchena | Marchena | web oficial / programa Écija |
| 17 | BCT María Santísima de la Palma | Marchena | canal de la formación / programa Écija |
| 18 | Ateneo Musical de Écija | Écija | Federband; continuidad de la antigua Banda del Cristo de Confalón |

### Condición pre-row-by-row

Los 18 candidatos deben volver a consultarse por:
- nombre;
- alias;
- municipio;
- web oficial;

justo antes de asignar UUID, porque producción puede haber cambiado.

## 4. Álvarez Quintero · duplicidad resuelta

### Nodo canónico

`7fafdc04-cb94-47d8-814f-5537639660ff`

- Asociación Musical Álvarez Quintero;
- Utrera;
- web oficial;
- fundación 1963;
- Fuente directa;
- relaciones históricas existentes.

### Duplicado legado

`f492d28d-af48-4606-862c-89d5d3560a6b`

- “Banda de Música Álvarez Quintero de Utrera”;
- sin web;
- creado desde guía secundaria;
- una relación musical histórica apunta a este nodo.

### Resolución

- Para **toda nueva relación**, incluido Confalón 2026, usar `7faf...`.
- No crear nuevo nodo.
- El duplicado legado no bloquea ya Écija.
- El futuro plan row-by-row deberá enumerar explícitamente si migra sus referencias a `7faf...` mediante UPDATE no destructivo.
- No borrar `f492...` dentro de este lote sin una puerta de normalización específica.

## 5. Homónimos descartados

| Candidato Écija | Nodo existente parecido | Decisión |
|---|---|---|
| BCT Rescatado · Villanueva de los Infantes | Rescatado de La Solana `c0160035-0403...` | NO REUSE |
| AM Columna y Azotes · Écija | BCT Columna y Azotes · Cigarreras `5bbe416c...` | NO REUSE |
| Banda Villa de Marchena | Castillo de la Mota | NO REUSE |
| BCT Palma · Marchena | Sagrado Corazón · Marchena | NO REUSE |
| Vera+Cruz · Almogía | Vera Cruz Campillos / Utrera | NO REUSE |

## 6. Vigencias futuras

Toda relación musical nacida de este lote se cerrará a **2026**:

- `year_from = 2026`;
- `year_to = 2026`;
- `is_current = false`;

salvo que exista una Fuente posterior independiente que acredite continuidad más allá de 2026.

No convertir un acompañamiento de Semana Santa 2026 en contrato vigente.

## 7. Cierre

**Conciliación musical: CERRADA.**

No quedan BLOCKERS musicales para abrir pre-row-by-row.

Queda como deuda documental legítima —no bloqueante— conseguir una Fuente primaria propia para BCT Nuestra Señora de la Palma de Utrera y Capilla Musical Hispalense antes del Apply, si aparece.
