# Incidencia post-Apply · Morón de la Frontera · HC-016

**Fecha:** 26 de septiembre de 2026  
**Apply ejecutado:** `APPLY_MORON_SQL_OK_COMMITTED`  
**Candidato exacto:** `29e83ff336ea4de8d7bcc99005d6a33ec948d90b`  
**Import:** `c0160037-0000-4000-8000-000000000001`  
**Estado del import:** `completed · 504/504 aplicadas · 0 fallidas`  
**Estado del macrolote:** **NO CERRADO · QA PÚBLICO BLOQUEADO**

## Apply y QA estructural

El Apply exacto autorizado se ejecutó sobre el staging certificado y devolvió:

`APPLY_MORON_SQL_OK_COMMITTED`

QA estructural posterior:

- 1 municipio;
- 24 Fuentes;
- 8 lugares;
- 73 entidades;
- 10 Hermandades;
- 10 bandas nuevas;
- 35 Imágenes;
- 18 Pasos;
- 10 Salidas `held`;
- 19 posiciones musicales;
- 19 assignments;
- 19 periodos musicales;
- 112 `source_links`;
- 0 huérfanos;
- 0 duplicados musicales;
- Jesús: Cruz de Guía 1 → Cristo 2 → Palio 3;
- Ars Sacra: 0 assignments 2026;
- Loreto: sede canónica San Francisco y origen 2026 San Miguel.

**QA estructural: PASS.**

## QA público

Verificación sobre el alias productivo de Vercel:

- Hermandades de Morón: **10/10 HTTP 200**;
- Bandas nuevas: **10/10 HTTP 200**;
- muestras de Imágenes: **4/4 HTTP 200**;
- muestras de Pasos: **4/4 HTTP 200**;
- hub municipal `/agenda-cofrade/localidad/moron-de-la-frontera`: **HTTP 404**.

## Causa demostrada

Las 10 filas de `public.brotherhoods` de Morón tienen:

`brotherhood_types = []`

El hub municipal usa `getIndexableBrotherhoodDirectory()`, cuya indexabilidad compartida exige identidad, **tipo**, localidad, resumen, al menos una relación y Fuente.

Morón ya cumple identidad, localidad, resumen, relaciones y Fuente directa. Falla únicamente el tipo documental. Por tanto, las diez Hermandades quedan fuera del conjunto indexable y el hub no obtiene el ancla sevillana necesaria.

No es un fallo del Apply transaccional ni de las relaciones creadas; es una omisión editorial del payload certificado.

## Corrección canónica propuesta · NO ejecutada

Según el inventario canónico y las denominaciones oficiales:

| Hermandad | `brotherhood_types` propuesto |
|---|---|
| Soberano | `["Penitencia"]` |
| Borriquita | `["Penitencia"]` |
| Cautivo | `["Penitencia"]` |
| Calvario | `["Penitencia"]` |
| Buena Muerte | `["Penitencia"]` |
| Loreto | `["Penitencia","Sacramental"]` |
| Santa Cruz | `["Penitencia","Gloria"]` |
| Jesús | `["Penitencia"]` |
| Santo Entierro | `["Penitencia"]` |
| Soledad | `["Penitencia"]` |

La propia autoridad documental define el universo como **corporaciones penitenciales 2026**; Loreto es explícitamente Sacramental y Santa Cruz explícitamente Hermandad de Gloria además de Cofradía de Nazarenos.

## Gate

La corrección anterior **no está autorizada por el Apply original**, porque modifica 10 filas fuera del blob certificado.

Siguiente puerta:

1. autorización explícita de remediación;
2. preparar payload correctivo de 10 UPDATE;
3. dry-run correctivo rollback-only;
4. ejecutar remediación si el dry-run es verde;
5. repetir QA de indexabilidad y hub;
6. cerrar Morón solo si el hub y las fichas quedan verdes.

**No requiere revertir las 504 operaciones ya aplicadas.**  
**HC-AUTO-03 permanece fuera de este frente.**
