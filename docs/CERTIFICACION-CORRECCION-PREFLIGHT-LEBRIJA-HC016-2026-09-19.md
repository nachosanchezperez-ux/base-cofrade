# Certificación de corrección del preflight · Lebrija · sexto macrolote municipal HC-016

**Fecha:** 19 de septiembre de 2026  
**Base corregida:** `1997d61f7fe0f38b3df3398dba85c01a90572e39`  
**Resultado:** **473 DML · 471 UPSERT · 2 UPDATE · 0 DELETE · 32 REUSE**  
**Staging:** 0 · **Apply:** 0 · **DDL:** 0 · **RLS:** 0

## Corrección

El preflight row-by-row fusionado en #860 quedó inicialmente en 465 DML. La revisión posterior encontró una omisión material pero acotada: la procesión de **San Pedro Apóstol de la Hermandad del Castillo** del 29/06/2026 estaba correctamente prevista como `outing_series`, pero no como occurrence 2026.

Existe una Fuente contemporánea con fecha 29/06/2026, salida a las 21:00, itinerario y Banda Amor y Sacrificio de Lebrija.

Se incorpora como `announced`, no `held`, porque la evidencia localizada es previa a la salida.

## Impacto exacto

La corrección añade **8 DML**:

1. 1 `sources`.
2. 1 `outings`.
3. 1 `outing_entities`.
4. 1 `outing_music_positions`.
5. 1 `outing_music_assignments`.
6. 1 `music_accompaniment_periods`.
7. 2 `source_links`.

Por tanto:

- DML: 465 → **473**.
- UPSERT: 463 → **471**.
- UPDATE: **2**, sin cambios.
- DELETE: **0**.
- REUSE: **32**, sin cambios.
- Salidas nuevas: 13 → **14**.
- Relaciones musicales: 11 → **12**.
- Fuentes nuevas: 30 → **31**.
- `source_links`: 121 → **123**.

## REUSE

La auditoría en producción confirma:

- 18/18 IDs estructurales fijos presentes;
- 8 Fuentes existentes del universo Castillo presentes;
- 3 Cultos existentes del Castillo;
- 3 occurrences 2026 existentes del Castillo.

Total: **32/32 REUSE**.

## Namespace y colisiones

- `c0160033-*`: **0 filas** en producción/importador.
- Slugs de entidades prefigurados: **0 colisiones**.
- Slugs de lugares: **0 colisiones**.
- Slugs de municipios soporte: **0 colisiones**.

## Puerta

El row-by-row queda corregido y cerrado en **473/473**.

Siguiente movimiento autorizado:

**IDs deterministas → manifiesto determinista 473/473 → SQL exacto de preflight → ejecución completa con `ROLLBACK`.**

Siguen prohibidos:
- staging;
- `bulk_imports`;
- Apply;
- DDL;
- RLS;
- segundo municipio.
