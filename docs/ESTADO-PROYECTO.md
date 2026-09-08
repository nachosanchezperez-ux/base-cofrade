# Hilo Cofrade · Estado canónico

**Corte operativo:** 8 de septiembre de 2026 · cierre del primer lote editorial real de HC-016

**HEAD real de producto auditado:** `2a0fccb3de22da80c7310566153a016f62f5a9f6` · [#701](https://github.com/nachosanchezperez-ux/base-cofrade/pull/701) fusionada

**Producción auditada:** `dpl_Gh8KuMr8tWLrtvDqx7uZHsWtkKrC` · `READY` · mismo SHA que el HEAD de producto auditado

**PR abiertas al cierre:** **0**

**Régimen:** `FIRST EDITION FREEZE` activo

**Frente editorial de Hermandad:** San Pablo cerrado; no se ha abierto otra Hermandad

> GitHub, Vercel y Supabase prevalecen sobre cualquier fotografía anterior. El HEAD canónico posterior es el commit de `main` que contiene esta fotografía; `2a0fccb3…` identifica el producto que se auditó antes de su sincronización documental.

## Dónde estamos ahora

San Pablo está certificado como primer lote editorial real de HC-016. La ficha pública y el Panel reflejan identidad, sede, titulares, Pasos, hábito, música, Salidas, Cultos, relaciones y Fuentes documentadas. No hay filas del lote en estado indeterminado, duplicados activos ni relaciones huérfanas detectadas.

HC-016 mantiene el circuito:

```text
CARGA → STAGING → PREFLIGHT GLOBAL → REVISIÓN → APPLY → RESULTADOS
```

Apply solo queda disponible cuando el lote completo supera el preflight. La barrera conoce `insert`, `update` y `reuse`, resuelve dependencias, rechaza colisiones y se repite antes de la primera escritura. No equivale a una transacción SQL atómica del lote completo.

## Primer lote real · San Pablo

El lote se materializó en siete envíos iniciales y un cierre controlado. Las 183 filas originales quedan reconciliadas: 175 se aplicaron en su ejecución histórica, 6 fallos fueron remediados por envíos posteriores y 2 se descartaron expresamente. El cierre añadió 41 operaciones de actualización, sin inserciones.

| Lote | Plan efectivo | Resultado histórico | Estado actual |
|---|---:|---:|---|
| `69914922…` · núcleo editorial inicial | 6 insert · 2 update | 8/8 aplicadas | Cerrado |
| `706b6853…` · sede, titulares y Pasos | 20 insert · 4 update | 21 aplicadas · 3 fallidas | 1 update de Paso remediado; 2 filas descartadas con causa |
| `b38f2464…` · canales, Cultos y Estación de Penitencia 2026 | 90 insert | 90/90 aplicadas | Cerrado y publicado |
| `871141d5…` · música, Corpus, Rosario, hábito y vestidor | 34 insert | 29 aplicadas · 5 fallidas | Las 5 filas fueron reemplazadas por `55c16066…` |
| `55c16066…` · remate Corpus y Rosario | 5 insert | 5/5 aplicadas | Cerrado; sustituye los 5 fallos dependientes |
| `52266d4f…` · heráldica, medalla y hábito oficial | 9 insert · 1 update | 10/10 aplicadas | Cerrado |
| `340a7719…` · promoción de Pasos y capataces 2026 | 4 insert · 8 update | 12/12 aplicadas | Cerrado; remedia el update de Paso |
| `bc2def40…` · cierre editorial HC-016 | 41 update | 41/41 aplicadas · 0 fallos | 39 promociones editoriales y 2 borradores de autoría archivados |

Las ocho incidencias históricas quedan determinadas fila por fila:

- `706b6853…` posición 15, `brotherhood_steps`: el update que falló por ejecutarse como upsert fue aplicado como UPDATE real en `340a7719…`;
- posiciones 18 y 19, `entity_locations` y su `source_link`: descartadas porque el rol del Panel no puede escribir esa tabla y la sede ya está representada canónicamente por `brotherhoods.canonical_see_place_id` y una fila completa de `places`; no se alteró RLS;
- `871141d5…` posiciones 29–33, dos `outings` y tres dependencias: reemplazadas con IDs estables por las cinco inserciones de `55c16066…`.

No queda operación pendiente del lote original. Las ausencias de escudo, ilustración del hábito o multimedia genérica no formaban parte del lote y no se convierten artificialmente en deuda.

## Incidencias descubiertas y correcciones integradas

- [#694](https://github.com/nachosanchezperez-ux/base-cofrade/pull/694): pagina Fuentes y `source_links` por encima de 1.000 filas con orden estable y filtro por entidad;
- [#695](https://github.com/nachosanchezperez-ux/base-cofrade/pull/695): ejecuta UPDATE real para un upsert efectivo update, no exige obligatorios de INSERT y bloquea en preflight tablas sin política de escritura del Panel;
- [#696](https://github.com/nachosanchezperez-ux/base-cofrade/pull/696): resuelve los Pasos de `outing_entities` y los muestra como Paso procesional, separados de la música;
- [#698](https://github.com/nachosanchezperez-ux/base-cofrade/pull/698): admite únicamente PK o restricciones UNIQUE reales en `on_conflict`; `outings.slug` queda bloqueado antes de Apply;
- [#699](https://github.com/nachosanchezperez-ux/base-cofrade/pull/699): extiende la paginación estable a los editores relacionales de Fuentes.

No hay excepciones específicas para San Pablo ni cambios de DDL, tablas, migraciones estructurales o RLS.

## Certificación de San Pablo

- identidad publicada, sede canónica y horarios visibles;
- dos titulares y dos Pasos publicados, con autorías activas únicas;
- hábito oficial publicado y respaldado por 2 Fuentes en su editor;
- cuatro acompañamientos vigentes y un periodo histórico documentado;
- 3 Salidas, 1 serie anual, 3 posiciones musicales y 6 asignaciones publicadas;
- 12 Cultos y 12 ocurrencias publicadas;
- dos relaciones vigentes de vestidor, con Fuente oficial;
- 11 Fuentes visibles en la ficha pública; el Panel carga el catálogo completo de 1.538 Fuentes sin truncado silencioso;
- cero duplicados activos, cero relaciones nucleares huérfanas y cero `source_links` duplicados o sin destino;
- navegación pública incluye Salidas, Cultos y Fuentes; canonical correcto, `robots=index, follow` y datos estructurados de la página presentes.

## Estado de HC-016

El lote `bc2def40-4dbe-464e-a6c5-43ccfbad8027` pasó 41/41 filas válidas, preflight global con 0 incidencias y revisión de un plan de 0 insert · 41 update · 0 reuse. Apply terminó con 41 aplicadas y 0 fallos. La reejecución no creó duplicados y solo modificó los estados editoriales revisados.

Regresión del HEAD auditado:

- pruebas específicas de HC-016 y de las correcciones de San Pablo: 21/21;
- fixture defectuoso: la barrera `CARGA → STAGING → PREFLIGHT` rechaza el lote y `PREFLIGHT_BLOCKED` impide cualquier llamada a Apply;
- suite completa: 648/648;
- `next build`: correcto;
- `git diff --check`: correcto.

## #492 · aislada

[#492](https://github.com/nachosanchezperez-ux/base-cofrade/issues/492) sigue **abierta y aislada**. No bloquea contenido, código, validación ni Panel sobre el modelo actual. Sí bloquea nuevo DDL, tablas, migraciones estructurales y cambios RLS hasta reconciliar Supabase Preview Branches.

No existe otro bloqueo operativo.

## Auditor

1. **¿San Pablo está cerrado?** Sí.
2. **¿Queda alguna fila del lote en estado indeterminado?** No; las 183 filas originales están aplicadas, remediadas o descartadas con causa.
3. **¿Puede repetirse actualmente alguno de los fallos deterministas que alcanzaron Apply?** No por el mismo camino: UPDATE, permisos, `on_conflict` y dependencias se cierran en preflight o se ejecutan con la operación efectiva correcta.
4. **¿HC-016 está preparado para un segundo lote editorial real?** Sí.
5. **¿Existe algún bloqueo aparte de #492?** No.
6. **¿`main`, producción y estado canónico coinciden?** Sí al cierre; la producción verificada está `READY` y sigue el SHA de `main`.
7. **¿Hay 0 PR abiertas?** Sí.

## Siguiente movimiento autorizado

Recalcular la deuda documental de Hermandades desde el estado real del grafo y seleccionar **una** siguiente ficha. No hay otra Hermandad abierta ni autorizada antes de ese recálculo.
