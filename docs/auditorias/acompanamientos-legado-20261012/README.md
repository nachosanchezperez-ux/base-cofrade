# HC-006 · Unificación de acompañamientos musicales · 12/10/2026

Auditoría de `public.accompaniments` y diseño de una fuente única para la música procesional.
Base: `main = 42653262`. Todas las cifras proceden de consultas de solo lectura sobre producción.

## Por qué la tabla no se mostraba

- `accompaniments` es anterior al modelo HC-006. La migración 011 de la primera edición la conservó
  «para no romper datos existentes» al introducir `outing_music_positions` + `outing_music_assignments`.
- **Ningún lector público la consulta.** Agenda, rosarios, Glorias, extraordinarias y portada leen
  `outing_music_details`; Hermandad, Banda, Paso, Tira del hilo y Música 2027 leen
  `music_accompaniment_periods`.
- Solo la usaba la señal `music` de `brotherhood_completeness_signals`. Por eso los lotes HC-016
  seguían escribiendo filas (las últimas el 09/10 y el 10/10 por SQL directo) que nunca llegaban a la web.
  La certificación de El Carmen (09/09) ya lo señalaba como falso negativo del medidor.
- El importador del Panel ya la tenía bloqueada (`WRITE_POLICY_BLOCKED`).

## Clasificación de las 97 filas

Todas están publicadas y sus salidas también; no hay duplicados exactos, tipos cruzados, pasos ajenos
a su Hermandad ni años distintos de la salida.

| Grupo | Filas | Situación | Acción |
|---|---:|---|---|
| A · Cubierta por la salida y por un periodo | 33 | Visible en todas las capas | Ninguna |
| B · Cubierta por un periodo; la salida no tiene música propia | 57 | Visible en Hermandad, Banda y Paso; no en la salida concreta | Conversión |
| C · Sin ninguna cobertura | 3 | Invisible en toda la web | Conversión |
| D · Cubierta solo por la salida | 3 | Visible en la salida; sin periodo estable | Revisión editorial (no se infiere un periodo de una salida puntual) |
| E · Parcial: la salida tiene otra música curada | 1 | Camas · Gloria 13/09/2026 · Maestro Tejera | Revisión editorial (no se mezcla con música curada) |

Las dos parejas misma salida + misma banda (Hiniesta y Vera Cruz de Tocina) son posiciones distintas,
no duplicados.

**Grupo C** (lo único que hoy no aparece en ninguna parte):

- Consolación de Utrera · extraordinaria 08/12/2024 · Álvarez Quintero tras la Virgen.
- Extraordinaria sin Hermandad · 09/10/2026 · Amor y Sacrificio de Lebrija.
- Servitas de La Puebla del Río · Rosario Vespertino 11/10/2026 · Fernando Guerrero tras la Virgen.

**Grupo D:** Misión (cornetas tras la Cruz de Guía, 27/03/2026), Santa Genoveva (coro en la ida del
Rosario de la Aurora, 27/09/2026) y Corona (AMUECI, Gloria 11/10/2026).

## Fuente de verdad

Sin estructuras nuevas, según HC-006:

1. `music_accompaniment_periods`: relación estable, vigencia, histórico, antigüedad y formación anterior.
   Música 2027 sigue construyéndose sobre ella.
2. `outing_music_positions` + `outing_music_assignments`: lo ocurrido en una salida concreta.
3. `accompaniments`: legado congelado. Se conserva como evidencia y no admite inserciones.

Estados que distingue el modelo:

- **Confirmado vigente:** `is_current = true`.
- **Histórico:** periodo finalizado.
- **Renovación y cambio 2027:** cálculos de Música 2027 sobre periodos.
- **Futuro:** periodos con inicio posterior, excluidos de la vista vigente por `futureMusicAccompanimentPeriodIds`.

## Conversión propuesta (no aplicada)

- `plan.sql`: vista previa de solo lectura.
- `candidate.sql`: aplicación idempotente con comprobación interna.
- `rollback.sql`: reversión.
- `integrity.sql`: comprobaciones antes y después.

Resultado del plan contra producción: **60 filas (grupos B + C) → 60 posiciones y 60 asignaciones en
34 salidas, 31 bandas**. Sin secuencias duplicadas, sin colisiones de ID y todas las bandas publicadas.

Asignación de códigos de posición:

| Código | Filas |
|---|---:|
| `behind_step` | 46 |
| `processional_music` | 8 |
| `cross_guide` | 5 |
| `behind_glory` | 1 |

Se usan códigos ya existentes. La etiqueta pública conserva literalmente el texto heredado y el modo es `unspecified`, porque el legado no documentaba tramos.

Integridad antes de aplicar:

| Comprobación | Valor |
|---|---:|
| `legado_sin_cobertura_canonica` | 3 (grupo C) |
| `posiciones_secuencia_duplicada` | 0 |

Valores esperados tras aplicar: `legado_sin_cobertura_canonica = 0` e `info_posiciones_convertidas = 60`.

Anomalías previas detectadas en la capa canónica, ajenas al legado y pendientes de revisión:

- 4 asignaciones publicadas con banda en borrador o revisión: Arahal Juvenil en San Pablo,
  Ánima Sacra en el Corpus del Cerro y Bollullos (×2) en las Angustias.
- Posible duplicado: Santa Ana de Dos Hermanas ×2 en Regla 04/10/2026 con la misma etiqueta.

## Señal de completitud

Simulación de solo lectura de la nueva regla, que mide sobre las capas canónicas:

| | Antes | Después |
|---|---:|---|
| Hermandades con señal `music` | 44 | 258 |
| Hermandades publicadas con señal `music` | 44 | 211 |

Solo Servitas de La Puebla del Río perdería la señal hasta aplicar la conversión, porque su única música es la fila heredada del grupo C.

---

## Aplicación en producción · 12/10/2026

Autorizada por el propietario tras la fusión de #1139 (`6a6146e6`), que aplicó la migración `20261012010000` mediante la integración Supabase–GitHub.

### 1 · Conversión del legado (`candidate.sql`)

- **Resultado:** 60/60 posiciones y 60/60 asignaciones creadas en 34 salidas. Posiciones 303 → 363; asignaciones 301 → 361.
- **Integridad después de aplicar:**

  | Comprobación | Valor |
  |---|---:|
  | `legado_sin_cobertura_canonica` | 0 |
  | `posiciones_secuencia_duplicada` | 0 |
  | `info_posiciones_convertidas` | 60 |

- **Señal `music`:** 259 Hermandades. Servitas la recupera con la conversión.
- **Fila heredada sin música en su salida:** solo queda 1 (Camas, 13/09/2026), pendiente de revisión editorial.
- **Reversión:** `rollback.sql`.

### 2 · Regla Coronada · Los Panaderos · Rosario Matutino 04/10/2026

Dato aportado por el propietario: a la ida acompaña la camerata de la Banda de Santa Ana y al regreso, la banda completa.

| Posición | Etiqueta | Tramo | Banda enlazada |
|---|---|---|---|
| 1 | «Ida · Camerata de la Banda» | San Andrés → San Leandro | Santa Ana |
| 2 | «Regreso · Banda completa» (`md5('regla-2026-10-04-regreso-banda-completa')`) | San Leandro → San Andrés | Santa Ana |

- La camerata conserva `band_name_text`. Como la vista muestra el nombre de la entidad enlazada, la identidad de la camerata se mantiene en la etiqueta.
- No se enlaza al paso de palio: el Rosario Matutino no acredita en qué paso sale la imagen. La salida ya está ligada a la Hermandad y a la Imagen.
- **Reversión:** devolver la asignación de regreso a la posición `b1f00c31…`, borrar la posición nueva y restaurar la etiqueta «Acompañamiento musical» y las notas originales («Acompañamiento musical durante el recorrido de ida y rezo de los Misterios Gloriosos.» / «Acompañamiento musical durante todo el recorrido de regreso.»).

### 3 · Periodos musicales enlazados a su Paso (`step-links-plan.sql`)

- **Resultado:** 27 periodos enlazados (10 vigentes y 17 históricos) en 15 Hermandades. Todos los pasos pertenecen a su Hermandad.
- **Revisión manual de la primera versión del plan:** descartó 4 propuestas erróneas (San Gil de Écija, Quinta Angustia, Vera Cruz de Tocina y Maravillas de San Diego) y endureció las reglas.
- **Registro:** `private.music_period_step_links_20261012`.
- **Reversión:** `update public.music_accompaniment_periods m set step_entity_id = null from private.music_period_step_links_20261012 l where m.id = l.period_id;`

**Periodos publicados que siguen sin paso: 126.**

| Situación | Periodos | Motivo |
|---|---:|---|
| Cruz de Guía, apertura o cortejo | 26 | Correcto: no van tras un paso |
| Hermandades sin pasos creados | 88 | 64 Hermandades, 57 de ellas en borrador. Requiere crear los pasos, una decisión editorial |
| Ambiguos | 12 | Revisión editorial |

### 4 · Bandas de las salidas enlazadas a su ficha

- **7 asignaciones** que tenían la banda solo como texto se enlazan a su entidad publicada: Puertollano, Filarmónica de Pilas, Amigos de la Música de Herrera ×2, Aznalcóllar, Cornetas Cristo de los Remedios y la camerata de Álvarez Quintero. Esta última conserva «Camerata de la Banda» en la etiqueta.
- **2 duplicados archivados**, no borrados: Filarmónica de Pilas y Filarmónica Juvenil de Pilas aparecían dos veces en la misma posición de Belén Coronada (04/10 y 11/10), una como texto y otra enlazada.
- **Registro:** `private.music_assignment_band_links_20261012`, con los valores anteriores.
- **Pendientes:** 37 asignaciones siguen solo como texto. Son coros, capillas, tambores y bandas sin ficha.

### 5 · Visualización

- La ficha de Paso muestra el **histórico musical del paso**: periodos cerrados y publicados, sin los futuros.
- **Alcance:** 135 pasos con histórico (177 periodos). 105 de ellos no mostraban ninguna música porque solo tenían bandas históricas.
