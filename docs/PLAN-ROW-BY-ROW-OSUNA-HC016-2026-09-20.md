# Plan row-by-row · Osuna · séptimo macrolote municipal HC-016

**Fecha:** 20 de septiembre de 2026  
**Fase:** ROW-BY-ROW CERRADO  
**Base:** `eda4dd28066457809d69e26732a6f3b48475bcfe`  
**TOTAL DML:** **368**  
**UPSERT:** **368** · **DELETE:** 0 · **REUSE:** 8

## Posiciones

| Posiciones | Tabla | Prioridad | Filas |
|---|---|---|---|
| 1–4 | `sources` | 2 | 4 |
| 5–13 | `places` | 3 | 9 |
| 14–74 | `entities` | 4 | 61 |
| 75–85 | `brotherhoods` | 5 | 11 |
| 86–87 | `bands` | 6 | 2 |
| 88–114 | `images` | 10 | 27 |
| 115–141 | `brotherhood_images` | 11 | 27 |
| 142–162 | `steps` | 13 | 21 |
| 163–183 | `brotherhood_steps` | 14 | 21 |
| 184–206 | `image_steps` | 15 | 23 |
| 207–218 | `outing_series` | 17 | 12 |
| 219–230 | `outings` | 18 | 12 |
| 231–275 | `outing_entities` | 19 | 45 |
| 276–277 | `outing_music_positions` | 20 | 2 |
| 278–279 | `outing_music_assignments` | 21 | 2 |
| 280–281 | `music_accompaniment_periods` | 22 | 2 |
| 282–368 | `source_links` | 25 | 87 |

## Puertas

1. El payload ejecuta las 368 operaciones dentro de una transacción.
2. Verifica 61 entidades, 12 salidas y 87 `source_links`.
3. Termina obligatoriamente en `ROLLBACK`.
4. El staging solo registra el manifiesto y no ejecuta el payload editorial.
5. Apply requiere autorización explícita nueva.
