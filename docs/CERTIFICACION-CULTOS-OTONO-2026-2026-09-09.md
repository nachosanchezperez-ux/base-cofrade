# Certificación editorial · Cultos septiembre–diciembre de 2026 · 9 de septiembre de 2026

**CULTOS DE OTOÑO–INVIERNO → LOTE TRANSVERSAL HC-016 COMPLETADO · 53/53 · CUATRO HERMANDADES · SIN DDL.**

## Alcance

El frente no abre una octava Hermandad ni modifica fichas cerradas para perseguir completitud artificial. Convierte calendarios oficiales ya publicados en ediciones concretas y visibles para el lector entre el 9 de septiembre y el 31 de diciembre de 2026.

Se priorizaron cuatro Hermandades con fuente institucional suficiente:

| Hermandad | Fuente oficial | Resultado |
|---|---|---|
| San Pablo | Calendario oficial de Cultos 2026 | Cuatro Misas de Hermandad y un Rosario vespertino incorporados como ediciones anunciadas |
| Pino Montano | Calendario oficial de Cultos y Actos 2026 | Misas de octubre y diciembre, Triduo, Función y Misa de Difuntos con horarios concretos |
| La Misión | Calendario oficial de Cultos 2026 | Cinco cultos futuros relacionados con sus titulares canónicos |
| Los Negritos | Página oficial Cultos 2026 | Besamanos y Eucaristía de diciembre con jornadas e intervalos horarios |

La auditoría localizó además Hermandades con cultos recurrentes pero sin anuncio verificable de su edición 2026. Esos huecos se conservan como legítimos: recurrencia no equivale a celebración anunciada.

## Lote gobernado

- identificador: `c0162026-0909-4000-8000-000000000001`;
- estado final: `completed`;
- filas: 53 preparadas, 53 válidas, 53 aplicadas;
- operaciones efectivas: 46 `insert`, 3 `update`, 4 `reuse`;
- inválidas: 0;
- fallidas: 0;
- cambios estructurales: 0.

Composición:

| Tabla | Operaciones | Contenido |
|---|---:|---|
| `sources` | 4 reuse | Reutilización de las cuatro Fuentes oficiales existentes |
| `cults` | 2 insert + 3 update | Dos cultos recurrentes de San Pablo y tres horarios estables de Pino Montano |
| `cult_occurrences` | 7 insert | Cinco ediciones de San Pablo y dos de Pino Montano |
| `cult_occurrence_days` | 11 insert | Jornadas y horarios de Pino Montano y Los Negritos |
| `cult_entities` | 17 insert | Relaciones con titulares canónicos de las cuatro Hermandades |
| `source_links` | 9 insert | Trazabilidad de los cultos y ediciones nuevas |

## Preflight y Apply

El preflight global comprobó 53/53 filas, 0 referencias sin resolver, 0 ambigüedades, 0 colisiones y 0 operaciones desconocidas. Verificó también los tres destinos de actualización y los cinco padres de jornadas ya existentes.

El primer intento de Apply hizo `ROLLBACK` completo al usar un valor no admitido por `audit_log.action_type`. La incidencia se clasificó como editorial/presentación del registro de auditoría; no produjo escrituras canónicas parciales. El segundo Apply utilizó el contrato vigente, corrigió el payload y completó 53/53 dentro de una transacción.

## Actualidad y huecos legítimos

- todas las ediciones nuevas mantienen `event_status = announced`;
- ninguna celebración anunciada se presenta como celebrada;
- no se dedujeron horas cuando la Fuente no las publica;
- La Misión mantiene horas abiertas porque su calendario oficial solo confirma fechas;
- San Pablo mantiene abiertas las horas de sus Misas de Hermandad y del Rosario vespertino;
- los cultos meramente recurrentes de otras Hermandades permanecen sin edición 2026 hasta que exista convocatoria contrastable.

## QA de datos y código

- 0 ocurrencias huérfanas;
- 0 jornadas huérfanas;
- 0 relaciones culto–titular huérfanas;
- 0 claves duplicadas en `cult_occurrences` y `cult_entities`;
- 9/9 vínculos documentales nuevos visibles;
- suite completa: 670/670;
- build de producción: correcto;
- `git diff --check`: correcto.

La presentación pública prioriza ahora la próxima edición concreta sobre la regla recurrente, muestra `Próximo culto`, fecha o rango, año, horario documentado y lugar. Cuando no existe convocatoria futura, conserva la regla habitual sin fabricar actualidad.

## Cierre

HC-016 queda utilizado como método editorial ordinario en un lote transversal de actualidad. El siguiente paso no es abrir otra Hermandad, sino mantener las convocatorias futuras con la misma regla: Fuente oficial, edición concreta, estado temporal explícito y ausencia legítima cuando el dato no está anunciado.
