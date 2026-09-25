# Manifiesto determinista · Écija · noveno macrolote municipal HC-016

**Fecha:** 25 de septiembre de 2026  
**Estado:** CERRADO · SIN SQL EJECUTADO  
**Base:** `de420589baa03db98cfda4a11796606592761f50`  
**Namespace:** `c0160036-*`  
**Contrato:** **776 DML · 770 UPSERT + 6 UPDATE/REUSE · 15 nodos externos reutilizados · 0 DELETE · 0 DDL · 0 RLS**

## Familias y recuentos

| `sources` | 40 |
| `places` | 11 |
| `entities` | 99 |
| `brotherhoods` | 15 |
| `bands` | 18 |
| `images` | 34 |
| `brotherhood_images` | 34 |
| `entity_locations` | 15 |
| `steps` | 32 |
| `brotherhood_steps` | 32 |
| `image_steps` | 34 |
| `outing_series` | 16 |
| `outings` | 16 |
| `outing_entities` | 66 |
| `outing_music_positions` | 32 |
| `outing_music_assignments` | 28 |
| `music_accompaniment_periods` | 27 |
| `source_links` | 227 |

**TOTAL = 776.**

Reutilización:
- 12 REUSE externos puros;
- 3 nodos draft UPDATE/REUSE;
- 6 DML UPDATE/REUSE en total;
- 770 UPSERT.

## Entidades y relaciones

- 15 sujetos: 13 nuevos + 2 UPDATE/REUSE;
- 18 Bandas/Capillas nuevas;
- 34 Imágenes nuevas;
- 32 Pasos: 31 nuevos + 1 UPDATE/REUSE;
- 96 nodos nuevos de `entities` bajo namespace;
- 16 series y 16 outings `held`;
- 66 participaciones de outing;
- 32 posiciones musicales;
- 28 assignments;
- 27 periodos musicales;
- 227 source_links.

## Invariantes del futuro preflight

- namespace vacío antes del ensayo;
- 96 entidades nuevas en namespace tras la simulación;
- Expiración y Confalón conservan UUID y pasan a `published`;
- Paso Columna/Azotes conserva `52d0bc09-c7a1-43a1-a285-9196257d1567`;
- Virgen del Valle recibe 0 relaciones del lote;
- Borriquita y Cautivo comparten `brotherhood_entity_id`;
- Las Penas conserva tipo Agrupación Parroquial;
- 16 outings quedan `held`;
- 32 Pasos y 34 image_steps;
- cuatro posiciones sin assignment: vivas, Silencio, Mortaja y matracas;
- Cautivo/Capilla no identificada tiene assignment textual sin band_entity_id;
- 27 periodos con `year_from=2026`, `year_to=2026`, `is_current=false`;
- Confalón/Esperanza usa Álvarez Quintero `7fafdc04-cb94-47d8-814f-5537639660ff`;
- 0 nuevas referencias al duplicado `f492d28d-af48-4606-862c-89d5d3560a6b`;
- 0 uso de Rescatado de La Solana o Columna/Azotes de Cigarreras;
- ECI-F41 no genera source separada;
- ECI-F26 no se materializa;
- 227 source_links;
- 0 DELETE.

## Siguiente gate

Preparar y revisar estáticamente el payload rollback-only. Su ejecución requiere autorización separada.
