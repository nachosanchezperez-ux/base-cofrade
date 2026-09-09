# Auditoría de ramas y deuda editorial · HC-016 · 9 de septiembre de 2026

## Resultado

El corte queda ordenado sin borrar ramas y sin confundir una referencia remota con trabajo activo:

- `main` auditado: `58488e8632cbbb1d42557624c6d20f621d0d6d5b`;
- producción: `READY` sobre el mismo SHA;
- PR abiertas en el corte: **0**;
- ramas remotas distintas de `main`: **813**;
- manifiesto completo: [`BRANCH-HYGIENE-MANIFEST-2026-09-09.csv`](./BRANCH-HYGIENE-MANIFEST-2026-09-09.csv);
- ramas eliminadas: **0**.

El script reproducible es [`scripts/audit-remote-branches.mjs`](../scripts/audit-remote-branches.mjs). El manifiesto debe regenerarse contra `origin/main` y con el número real de PR abiertas antes de cualquier corte de limpieza:

```bash
HILO_BRANCH_AUDIT_OPEN_PRS=0 node scripts/audit-remote-branches.mjs \
  --output docs/BRANCH-HYGIENE-MANIFEST-2026-09-09.csv
```

## Clasificación conservadora

| Clase | Ramas | Significado | Acción propuesta |
|---|---:|---|---|
| `merged_ancestor` | 293 | La punta es antecesora literal de `main` | Candidata a limpieza autorizada |
| `patch_equivalent` | 219 | No es antecesora literal, pero sus commits no aportan parches únicos frente a `main` | Candidata a limpieza autorizada |
| `review_required` | 301 | Conserva al menos un parche único según el análisis conservador | Revisión manual; no borrar |
| **Total** | **813** | 775 puntas únicas | — |

Existen 13 grupos de puntas duplicadas que agrupan 51 ramas. La columna `duplicate_tip_branches` los hace visibles sin asumir que puedan eliminarse.

Las **512 candidatas** no son una orden de borrado. Antes de actuar hay que refrescar `main`, PR y protecciones, revisar las 301 ramas no equivalentes y ejecutar la limpieza únicamente en un corte expresamente autorizado y recuperable.

## Recálculo de deuda editorial

El recálculo se hizo desde el grafo productivo después de cerrar El Museo y antes de abrir una cuarta ficha. Se ponderaron la completitud técnica, los nodos ya reutilizables, la profundidad de fuentes oficiales y el valor relacional. No se puntuaron como deuda los recursos visuales sin licencia ni datos no confirmados.

| # | Candidata | Base técnica | Anclajes ya existentes | Fuente oficial | Decisión |
|---:|---|---:|---|---|---|
| 1 | **El Cachorro** | 43 % | 2 Pasos en borrador, 3 periodos musicales y 2 fuentes directas | Historia, tres titulares, Pasos, Cultos y patrimonio musical | Seleccionada |
| 2 | **El Carmen** | 43 % | 1 Paso en borrador, 2 periodos musicales y 1 fuente directa | Historia, tres titulares, dos Pasos, Cultos y música | En espera |
| 3 | **Cristo de Burgos** | 43 % | 1 Paso en borrador, 1 periodo musical y 1 fuente directa | Historia, dos titulares, dos Pasos y Cultos | En espera |

Fuentes usadas para contrastar el potencial de cierre:

- [web oficial de El Cachorro](https://hermandaddelcachorro.org/);
- [web oficial de El Carmen](https://www.hermandaddelcarmen.es/);
- [web oficial de Cristo de Burgos](https://cristodeburgos.es/).

El Cachorro quedó primero porque presentaba la mayor densidad relacional ya aprovechable y un conjunto oficial de fuentes capaz de sostener identidad, titulares, Pasos, patrimonio, Cultos y música sin DDL ni invenciones.

## Actualidad estricta y lote elegido

Al refrescar Supabase se detectó que el cuarto lote ya había sido preparado por otro frente sobre la misma Hermandad. No se creó un lote duplicado.

| Lote | Estado encontrado | Decisión final |
|---|---|---|
| `1e325c2a-c27d-4572-a69e-cc279ed9075f` | `staging`, 76 válidas y 14 inválidas, 0 aplicadas | `cancelled`; el error era un `slug` de sede inexistente |
| `19d2d74c-ff8d-42cd-9a4e-42c8e3a56a7d` | `ready`, 90/90 válidas, 0 aplicadas | auditado, corregido y aplicado |

La auditoría corrigió un único detalle de modelado antes de escribir: “Hermanos Cruz Solís” representaba a Antonio, Raimundo y Joaquín como agrupación, por lo que `agent_kind` pasó de `person` a `workshop`, coherente con los talleres colectivos ya existentes.

La certificación del lote y del subgrafo queda en [`CERTIFICACION-EL-CACHORRO-HC016-2026-09-09.md`](./CERTIFICACION-EL-CACHORRO-HC016-2026-09-09.md).

## Límites del corte

- no se ha eliminado ninguna rama;
- no se ha abierto una quinta Hermandad;
- no se ha creado DDL, tabla, migración estructural, política RLS, arquitectura o UX;
- [#492](https://github.com/nachosanchezperez-ux/base-cofrade/issues/492) continúa como único bloqueo estructural y no bloquea este DML editorial.
