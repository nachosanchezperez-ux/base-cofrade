# Manifiesto determinista · Carmona · octavo macrolote municipal HC-016

**Fecha:** 25 de septiembre de 2026  
**Fase:** MANIFIESTO DETERMINISTA CERRADO · SIN SQL EJECUTADO  
**Base:** `f1bcda7f2e166038a8d3dc447ce424d959fbb3f9`  
**Namespace:** `c0160035-*`  
**Contrato:** **530 DML · 8 REUSE externos · 0 DELETE · 0 DDL · 0 RLS**

## Regla de IDs

`c0160035-GGGG-4000-8000-NNNNNNNNNNNN`

Familias principales:
- `01xx`: Fuentes;
- `02xx`: Lugares;
- `03xx`: Hermandades/orden;
- `04xx`: Bandas;
- `06xx`: Imágenes;
- `07xx`: Pasos;
- `08xx`: relaciones de identidad, sede y composición;
- `09xx`: series, salidas y participación;
- `10xx`: posiciones y asignaciones musicales;
- `11xx`: periodos musicales;
- `20xx`: `source_links`.

## Entidades nuevas

- 9 corporaciones;
- 6 Bandas;
- 42 Imágenes: 29 titulares + 13 figuras secundarias;
- 18 Pasos.

Total `entities`: **75**.

## Salidas

- 11 `outings` nuevos de Semana Santa 2026, todos `event_status = held`;
- 1 UPDATE/REUSE: `ea6ab0d1-e6c4-4ea1-8727-92cee4ce3218`, Servitas 19/09, de `announced` a `held`;
- 11 `outing_series` para las salidas penitenciales;
- 50 `outing_entities`: 31 participaciones de imagen + 18 de paso + 1 imagen servita en septiembre.

## Música

- 18 posiciones penitenciales;
- 17 asignaciones;
- 14 periodos de Banda cerrados a 2026;
- 3 asignaciones textuales «Música de capilla», sin nodo Banda;
- 1 posición de silencio, Desamparados, sin assignment;
- 0 asignaciones para MAFERMAN el 19/09 por falta de prueba posterior explícita.

## Invariantes de preflight

El futuro SQL deberá abortar si no se cumplen simultáneamente:

- 75 entidades `c0160035-*`;
- 42 imágenes y 18 pasos;
- 29 `brotherhood_images`;
- 9 `entity_locations`;
- 18 `brotherhood_steps`;
- 31 `image_steps`;
- 11 series nuevas;
- 11 salidas nuevas + 1 salida existente actualizada;
- 50 `outing_entities`;
- 18 posiciones musicales;
- 17 assignments;
- 14 periodos musicales;
- 129 `source_links`;
- `ea6ab0d1-e6c4-4ea1-8727-92cee4ce3218` conserva su UUID y slug;
- no existe relación de Paso para la salida servita de septiembre;
- no existe assignment para la posición de silencio de Desamparados;
- no aparece ninguna corporación independiente «Desamparados» ni «La Borriquita»;
- no se modifica ningún ID externo REUSE.

## Ensayo

El futuro payload será **solo preflight** y deberá finalizar con:

`PREFLIGHT_CARMONA_SQL_OK_ROLLED_BACK`

seguido de `ROLLBACK`.

No se autoriza Apply por este documento.
