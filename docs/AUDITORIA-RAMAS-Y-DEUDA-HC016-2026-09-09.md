# Auditoría de ramas y deuda editorial · HC-016 · 9 de septiembre de 2026

## Resultado

El corte queda ordenado, recuperable y sin confundir una referencia remota con trabajo activo:

- base estricta previa a la limpieza: `main = 46a9ab51dcf82b3b226b12b951debe2a7717de15`;
- postflight operativo: `main = 6fac40ac4bbac718e40656e7bbcaf78de71f4233`;
- producción: `READY` sobre el mismo SHA y sin errores de runtime en la última hora;
- PR abiertas tras el postflight: **0**;
- ramas remotas distintas de `main`: **817 antes → 63 después**;
- ramas eliminadas: **754** en dos pasadas verificadas;
- salvaguarda remota: `archive/pre-cleanup-20260909 @ 1261c3d1d7da023faa0449ed2cd2b69fef7fabe1`.

Evidencia del corte:

- estado anterior completo: [`BRANCH-HYGIENE-MANIFEST-PRE-CLEANUP-2026-09-09.csv`](./BRANCH-HYGIENE-MANIFEST-PRE-CLEANUP-2026-09-09.csv);
- 753 referencias de la primera pasada: [`BRANCH-CLEANUP-CANDIDATES-2026-09-09.csv`](./BRANCH-CLEANUP-CANDIDATES-2026-09-09.csv);
- revisión individual de las 303 ramas inicialmente no equivalentes: [`BRANCH-REVIEW-MANIFEST-2026-09-09.csv`](./BRANCH-REVIEW-MANIFEST-2026-09-09.csv);
- manifiesto posterior vigente: [`BRANCH-HYGIENE-MANIFEST-2026-09-09.csv`](./BRANCH-HYGIENE-MANIFEST-2026-09-09.csv).

El script reproducible es [`scripts/audit-remote-branches.mjs`](../scripts/audit-remote-branches.mjs). El manifiesto debe regenerarse contra `origin/main` y con el número real de PR abiertas antes de cualquier corte de limpieza:

```bash
HILO_BRANCH_AUDIT_OPEN_PRS=0 node scripts/audit-remote-branches.mjs \
  --output docs/BRANCH-HYGIENE-MANIFEST-2026-09-09.csv
```

## Clasificación y decisión ejecutada

El refresco posterior a #719 encontró 817 ramas y evitó usar el corte anterior de 813 como orden de borrado.

| Base verificable | Ramas | Decisión |
|---|---:|---|
| Antecesoras literales de `main` | 295 | 294 eliminadas; `release/activate-public-contributions-20260831` preservada por política |
| Equivalentes por parche | 219 | 219 eliminadas |
| Punta exacta de un PR fusionado | 240 | 240 eliminadas |
| Trabajo único sin cierre inequívoco | 61 | Preservadas |
| Salvaguarda `archive/*` | 1 | Preservada |
| Rama del propio PR #720 | 1 | Eliminada en la segunda pasada, ya fusionada |
| **Total anterior** | **817** | **754 eliminadas · 63 preservadas** |

La revisión cruzó 303 ramas con parches únicos contra los 718 PR reales del repositorio. De ellas, 240 coincidían exactamente con la punta de un PR fusionado; 29 coincidían con PR cerrados sin fusionar, 27 no tenían PR, cinco habían movido su punta después de un PR y una era el propio PR abierto. Solo el primer grupo entró en la limpieza masiva.

La primera pasada fue 753/753 y la segunda 1/1. Ambas exigieron coincidencia exacta de SHA mediante `force-with-lease`, bloques atómicos, ausencia de PR ajenos abiertos y la existencia previa de la salvaguarda. La tarea efímera usada para ejecutarlas se retira en el cierre documental.

## Recuperación

La rama `archive/pre-cleanup-20260909` apunta a un commit de archivo con 457 padres: el `main` previo y 456 puntas únicas que no eran antecesoras. Las restantes puntas eliminadas siguen alcanzables desde `main`. Para restaurar una referencia concreta basta recuperar su SHA del manifiesto anterior y recrear la rama:

```bash
git fetch origin archive/pre-cleanup-20260909
git branch <nombre-restaurado> <sha-del-manifiesto>
```

No se recupera nada de forma automática ni se reutiliza la rama de archivo como rama de trabajo.

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

- se eliminaron únicamente las 754 referencias registradas y verificadas; las 61 ramas con trabajo único siguen intactas;
- `release/activate-public-contributions-20260831` continúa preservada y no activa HC-018;
- la salvaguarda `archive/pre-cleanup-20260909` no se considera trabajo activo;
- no se ha abierto una quinta Hermandad;
- no se ha creado DDL, tabla, migración estructural, política RLS, arquitectura o UX;
- [#492](https://github.com/nachosanchezperez-ux/base-cofrade/issues/492) continúa como único bloqueo estructural y no bloquea este DML editorial.
