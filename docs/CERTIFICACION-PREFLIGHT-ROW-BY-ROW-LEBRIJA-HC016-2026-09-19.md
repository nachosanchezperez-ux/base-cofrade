# Certificación de preflight y plan row-by-row · Lebrija · sexto macrolote municipal HC-016

**Fecha:** 19 de septiembre de 2026  
**Base:** `9bd786f9cb52f6eafb875dc8157c89da47fabfa5`  
**Fase:** **ROW-BY-ROW CERRADO**  
**Resultado:** **473 DML · 471 UPSERT · 2 UPDATE · 0 DELETE · 32 REUSE**  
**Staging:** 0 · **Apply:** 0 · **DDL:** 0 · **RLS:** 0

## 1. Universo

Se mantienen **12 corporaciones canónicas**:

1. Entrada Triunfal.
2. Oración en el Huerto.
3. Humildad.
4. Ecce-Homo · Los Gitanos.
5. Castillo.
6. Dolores.
7. Vera-Cruz.
8. Santo Sepulcro.
9. Soledad.
10. Rocío.
11. San Benito.
12. Hermandad Sacramental.

Reglas preservadas:
- Aurora pertenece a Humildad.
- Castillo penitencial y Castillo letífico son la misma Hermandad.
- Dolores no absorbe a la Hermandad Sacramental histórica.
- Santo Sepulcro y Soledad permanecen como corporaciones distintas.

## 2. Inventario físico cerrado

- **24 Imágenes canónicas**: 23 nuevas + Virgen del Castillo REUSE.
- **23 Pasos nuevos**.
- **6 lugares nuevos**.
- **4 Bandas nuevas** + Banda Virgen del Castillo REUSE.
- **3 autores nuevos** + 3 autores REUSE.
- **6 autorías estructuradas**.

Humildad queda modelada de forma actual:
- misterio de Jesús de la Humildad;
- palio de la Victoria;
- Paso de Gloria de la Aurora;
- San Juan Evangelista como titular sin Paso actual.

Dolores conserva:
- Nazareno;
- Dolores;
- Verónica;
- San Juan;
- Paso de S.D.M. del Corpus de San Francisco.

Rocío no fuerza un Paso ni una Imagen artificial.

## 3. Salidas 2026

El plan contiene **14 Salidas nuevas**:

- 9 estaciones de penitencia;
- Rocío;
- Corpus de San Francisco;
- San Benito;
- Rosario de la Aurora;
- San Pedro Apóstol.

Además se reutiliza y enlaza a su serie la procesión patronal del Castillo del 12/09/2026.

### Corrección de San Pedro

El primer cierre row-by-row omitía una occurrence 2026 para San Pedro pese a existir una fuente contemporánea con fecha, horario, recorrido y banda.

Se incorpora:

- **San Pedro Apóstol · 29/06/2026**;
- estado: `announced`;
- Paso: San Pedro Apóstol;
- banda: Amor y Sacrificio de Lebrija.

No se eleva a `held` porque la evidencia localizada es previa a la salida.

Esta corrección añade **8 DML**:
- 1 Fuente;
- 1 outing;
- 1 outing_entity;
- 1 music_position;
- 1 music_assignment;
- 1 music_accompaniment_period;
- 2 source_links.

Por eso el contrato pasa de 465 a **473 DML**.

## 4. Música

Se cierran **12 relaciones musicales 2026**.

No se rellenan por tradición los huecos sin Fuente suficiente.

Las relaciones documentadas únicamente en 2026 se cierran en 2026 salvo renovación posterior expresa.

## 5. Cultos

- **5 Cultos nuevos**.
- **3 occurrences 2026 nuevas**, todas de Aurora.
- Los 3 Cultos + 3 occurrences 2026 ya existentes del Castillo permanecen REUSE.

No se fabrica una occurrence 2026 del Corpus de la Hermandad Sacramental.

## 6. REUSE

Los **32 REUSE** quedan reconciliados:

- 18 IDs estructurales comprobados individualmente en producción;
- 8 Fuentes existentes del universo Castillo;
- 3 Cultos existentes del Castillo;
- 3 occurrences 2026 existentes del Castillo.

Entre los IDs fijos verificados están:
- Lebrija;
- San Fernando;
- Hermandad del Castillo;
- Virgen del Castillo;
- Banda Virgen del Castillo;
- tres lugares ya existentes;
- Santísimo Sacramento;
- Miñarro;
- Abascal;
- Pedro Roldán;
- Salida patronal del Castillo;
- sus relaciones y música ya publicadas;
- Congregación Nazarena.

## 7. Colisiones y namespace

En la última comprobación previa a esta certificación:

- namespace `c0160033-*`: **0 filas**;
- bulk imports `c0160033-*`: **0**;
- slugs de entidad ya prefigurados: **0 colisiones**;
- slugs de lugares: **0 colisiones**;
- slugs de municipios soporte: **0 colisiones**.

El namespace permanece **libre y no materializado**.

## 8. Recuento row-by-row

| Tabla / operación | Filas |
|---|---:|
| municipalities | 2 |
| sources | 31 |
| places | 6 |
| entities | 64 |
| brotherhoods · INSERT | 11 |
| bands | 4 |
| agents | 3 |
| agent_names | 3 |
| agent_disciplines | 3 |
| images | 23 |
| brotherhood_images | 23 |
| image_authorships | 6 |
| steps | 23 |
| brotherhood_steps | 23 |
| image_steps | 23 |
| entity_relations | 2 |
| outing_series | 16 |
| outings · INSERT | 14 |
| outing_entities | 24 |
| outing_music_positions | 12 |
| outing_music_assignments | 12 |
| music_accompaniment_periods | 12 |
| cults | 5 |
| cult_occurrences | 3 |
| source_links | 123 |
| brotherhoods · UPDATE Castillo | 1 |
| outings · UPDATE patronal Castillo | 1 |
| **TOTAL** | **473** |

## 9. Puerta

**PREFLIGHT LÓGICO VERDE · ROW-BY-ROW CERRADO.**

Siguiente movimiento autorizado:

**revalidar colisiones finales → congelar IDs `c0160033-*` → manifiesto determinista 473/473 → generar SQL exacto → ejecutar el payload completo en transacción + ROLLBACK.**

Sigue prohibido:
- crear staging;
- crear `bulk_imports`;
- Apply;
- DDL;
- RLS;
- abrir otro municipio.
