# Cortejo completo · auditoría y propuesta (Tareas 15 y 15.1)

Estado: **propuesta**. Nada de lo descrito en «Base de datos» ni en «Panel» se ha ejecutado.

## 1. Modelo actual (auditado el 20/10/2026, solo lectura)

| Pieza | Dónde vive hoy | Qué permite |
|---|---|---|
| Insignias como objetos | `heritage_assets` (+ `entities`, tipo `heritage_asset`) | Ficha patrimonial: tipo, descripción, técnica, materiales, fechas, historia, procedencia, foto pública. Además, `usage_text` (texto libre de uso) y `display_order` (orden de **catálogo**, no procesional). |
| Autoría y restauraciones | `entity_relations` (`author_of`…) y `heritage_interventions` | Autor o taller e intervenciones con fechas. |
| Fuentes | `sources` + `source_links` (con columnas por destino) | Fuente documental por entidad o relación. |
| Pasos e imágenes | `steps`, `brotherhood_steps`, `image_steps`, `step_*` | El cortejo resumido actual. |
| Salidas | `outings`, `outing_entities` (roles de imagen y paso), `outing_music_positions` | Quién sale y la música por posición; **no** el orden de insignias. |
| Tramos y nazarenos | `brotherhood_procession_stats` (solo recuentos) | Número de nazarenos; no hay tramos. |

**No existe ninguna tabla ni columna de orden procesional, tramos o posición de una insignia en un cortejo.** El `display_order` de `heritage_assets` es el orden del catálogo del panel. Usarlo como orden de la cofradía sería inventar un orden.

## 2. Datos reales disponibles

- **San Benito:** sin insignias catalogadas; su patrimonio cargado es musical (coplas, música de capilla).
- **El Baratillo:** sin insignias; tiene un repostero, y varales y candelabros como piezas de paso.
- **El Amparo:** una insignia, el Simpecado de Gala, cuyo uso está documentado en la Novena de calle y las fiestas principales. No consta su posición en la procesión.
- **Resto de la web:** hay insignias sueltas en San Esteban (7: Cruz de Guía, faroles, Senatus, Banderín de Juventud, Libro de Reglas, Estandarte…), Las Aguas (11), La Trinidad, Negritos, Hiniesta, La Carretería y otras. En ningún caso con orden oficial ni tramo.

Conclusión: hoy no se puede mostrar un cortejo completo real de ninguna Hermandad sin suponer el ## 3. Estructura propuesta (revisada en la Tarea 15.1)

Principio: **una sola pieza patrimonial, tantas apariciones procesionales como estén documentadas.** La pieza ya existe en `heritage_assets`; lo nuevo es el orden y sus posiciones.

Hallazgos del esquema real (solo lectura, 20/10/2026) que condicionan la propuesta:
- `heritage_assets.asset_type` es texto libre y heterogéneo («Insignia», «Insignia procesional», «Banderín», «Simpecado», «orfebrería»…). No sirve para saber de forma fiable qué tipo de insignia es una pieza: hace falta un vocabulario.
- `heritage_assets.is_current` ya existe: permite registrar piezas que no salen (p. ej. el estandarte de Viuda de Carrasquilla) sin ponerlas en el cortejo.
- `heritage_assets.parent_entity_id` apunta a la Hermandad propietaria, no a un conjunto. No se usa para agrupar faroles o varas.
- No hay columna para una descripción visual breve: `iconography` es el análisis iconográfico de la ficha, no «cómo reconocerla» en la calle.
- La estación de penitencia ya existe como `outing_series` (recurrente) y `outings` (cada año).

```
procession_orders                 — una versión de un orden, nunca se sobrescribe
  id, brotherhood_entity_id,
  outing_series_id → outing_series (opcional: a qué salida recurrente se refiere),
  outing_id → outings (opcional: solo si se confirma para una salida concreta),
  evidence_status: documented | current | historical
      documented  = consta en una fuente, sin vigencia acreditada (Baratillo hoy)
      current     = confirmado como vigente; exige valid_from_year
      historical  = orden de una época pasada; exige years
  valid_from_year, valid_to_year (null si no consta; nunca se rellena por defecto)
  publication_status: draft | published
  source_id → sources (NOT NULL para publicar: CHECK publication_status <> 'published' OR source_id IS NOT NULL)
  supersedes_order_id → procession_orders (versión anterior)
  scope: insignias | full   (se deduce también de los ítems: tramos + presidencia = full)
  notes

procession_order_items            — cada posición, en su orden
  id, order_id, sequence_no (único por order_id),
  item_kind: group | cross_guide | insignia | tramo | step | presidency |
             antepresidency | acolytes | representation | music | other,
  label                       (como figura en la fuente)
  heritage_entity_id → heritage_assets   (sin restricción de unicidad: una pieza puede
                                          ocupar varias posiciones, como las bocinas)
  step_entity_id → steps                 (el paso que cierra cada cortejo)
  habit_id → brotherhood_habits          (tramo de nazarenos, opcional)
  section_item_id → procession_order_items  (cortejo o tramo al que pertenece; opcional)
  accompaniment_text          (lo que la acompaña en esa posición: «dos faroles y cuatro bocinas»)
  position_note               (dato de la posición, nunca de la pieza)
  source_id → sources         (opcional, si la posición tiene otra fuente)

insignia_types                    — vocabulario «Qué es», reutilizable entre Hermandades
  key (cruz-guia, senatus, simpecado, estandarte, libro-reglas, guion, banderin,
       bandera, bocinas, cruz-parroquial…), name, definition, status, source_id (opcional)

heritage_assets (+2 columnas nullable, sin tocar las existentes)
  insignia_type_key → insignia_types     (qué es la pieza)
  recognition_text                       (cómo reconocerla: rasgos visibles verificados)
```

Comprobación de los requisitos de la Tarea 15.1:

| Requisito | Cómo se cumple |
|---|---|
| 1. Versiones históricas | Cada versión es una fila de `procession_orders` con `evidence_status` y años; `supersedes_order_id` las encadena. |
| 2. Orden de las insignias | `sequence_no`, único por versión. |
| 3. Misma pieza en varias posiciones | `heritage_entity_id` sin restricción de unicidad; la ficha la describe una vez y enlaza todas sus posiciones. |
| 4. Tramos cuando se documenten | Ítems `tramo` (con `habit_id` opcional) y `section_item_id`; sin tramos, el orden es de «insignias». |
| 5. Cambios de un año a otro | «Duplicar» crea una versión nueva en borrador; la anterior pasa a `historical` o conserva su vigencia cerrada. |
| 6. Fuente obligatoria | `CHECK` que impide publicar sin `source_id`, y `source_links.procession_order_id` para fuentes adicionales. |
| 7. Historial sin sobrescribir | Una versión publicada no se edita: un trigger (o la regla del Panel) obliga a duplicarla. |

- **Sin duplicados:** la autoría, la datación, los materiales, la técnica, la historia, las restauraciones, las fotos y las fuentes de la pieza se leen de `heritage_assets`, `entity_relations`, `heritage_interventions` y `source_links`. El orden solo guarda la posición, lo que la acompaña y las notas de esa posición.
- **Gloria:** los mismos tipos sirven (simpecado como `insignia`, representaciones, música). No se imponen tramos ni presidencia.
- **RLS:** igual que el resto del contenido público: lectura solo de `published`; escritura solo para editores del Panel.

## 4. Presentación (prototipo en esta rama)

- **Cortejo resumido:** se queda como está.
- **Acceso:** debajo del resumen, solo si `hasDocumentedOrder` se cumple (fuente y algo más que pasos).
  - «Ver insignias del cortejo» mientras no haya tramos y presidencia documentados.
  - «Ver cortejo completo» solo cuando los haya (`isFullProcessionOrder`).
- **Fuente:** una sola línea con estado y fecha de consulta: «Orden documentado · Hermandad del Baratillo · consultado el 20/10/2026». Solo lleva año si el estado es vigente o histórico.
- **Cada insignia:** número de orden, nombre (enlace a su pieza en Patrimonio), cómo reconocerla, lo que la acompaña y «Qué es» la primera vez que sale cada tipo. Las varas no se enumeran: las explica «Qué es» de banderas y guiones.
- **Piezas repetidas:** todas las posiciones enlazan al mismo registro; cómo reconocerla solo se escribe la primera vez.
- **Ordenador:** cada cortejo en su columna, con su paso al pie.
- **Contenido:** dentro de un `<details>` en el HTML del servidor, indexable y sin depender de JS.
- **Lector:** `lib/supabase/procession-order.js` devuelve `null` para todas las Hermandades hasta que exista la tabla. Por eso **ninguna ficha cambia**.
- **Laboratorios** (sin indexar y 404 en producción):
  - `/laboratorio/cortejo-completo`: demostración estructural;
  - `/laboratorio/cortejo-completo/el-baratillo`: datos reales en borrador, con una simulación de Patrimonio.

## 5. Panel (propuesta, sin desarrollar)

Pestaña «Cortejo» dentro de la Hermandad, junto a «Pasos» y «Hábito»:

1. **Crear un orden:** fuente (obligatoria para publicar), estado (documentado, vigente o histórico), años solo si constan, y salida a la que se refiere.
2. **Añadir posiciones:**
   - escoger una pieza del patrimonio de la Hermandad con un buscador; la misma pieza puede añadirse en otra posición;
   - si la pieza no existe, crearla en Patrimonio desde ahí, sin salir, para no duplicar su registro;
   - añadir elementos sin ficha (tramos, antepresidencia, acólitos, representaciones) y el paso que cierra cada cortejo;
   - escribir lo que la acompaña y las notas de esa posición.
3. **Tramos:** asignar posiciones a un tramo cuando se conozcan.
4. **Reordenar:** con flechas (accesible en móvil) o arrastrando.
5. **«Duplicar como borrador»** para otro año: crea la versión nueva y mantiene intacta la publicada.
6. **Vista previa** con el mismo componente público antes de publicar. Avisa si faltan «cómo reconocerla» o el tipo de insignia.
7. **Vocabulario:** una lista editable de tipos de insignia con su «Qué es», común a todas las Hermandades.

## 6. Necesidades de base de datos (sin ejecutar)

- **Migración nueva (aditiva, sin tocar datos):**
  - tablas `procession_orders`, `procession_order_items` e `insignia_types`, con claves externas, índice único `(order_id, sequence_no)` y RLS de lectura pública solo para `published`;
  - columna `procession_order_id` en `source_links`;
  - columnas nullable `insignia_type_key` y `recognition_text` en `heritage_assets`.
- **Carga del Baratillo** (después de autorizar): 18 piezas en `heritage_assets`, con sus autorías en `entity_relations` y su fuente; un orden `documented` sin años; y 18 posiciones, dos de ellas a las mismas bocinas. El estandarte de Viuda de Carrasquilla irá con `is_current = false` y sin fecha mientras siga la contradicción.
