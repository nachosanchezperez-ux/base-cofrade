# Cortejo completo · auditoría y propuesta (Tarea 15)

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

Conclusión: hoy no se puede mostrar un cortejo completo real de ninguna Hermandad sin suponer el orden.

## 3. Estructura propuesta

Se separan la **pieza** (patrimonio, que ya existe) y su **posición** en un cortejo concreto (lo nuevo):

```
procession_orders            — un orden oficial, versionado
  id, brotherhood_entity_id, outing_series_id (opcional),
  valid_from_year, valid_to_year (null = vigente),
  title ('Orden de la cofradía 2026'), status (draft/published),
  source_id → sources (obligatoria para publicar), notes

procession_order_items       — cada posición, en su orden
  id, order_id, sequence_no,
  item_kind: cross_guide | insignia | tramo | step | presidency |
             antepresidency | acolytes | representation | music | other,
  label (como figura en la nómina oficial),
  heritage_entity_id → heritage_assets (si es una pieza catalogada),
  step_entity_id → steps (si es un paso),
  habit_id → brotherhood_habits (tramo de nazarenos, opcional),
  note, source_id (opcional, si difiere de la del orden)
```

- **Histórico:** cambiar el orden de un año crea una nueva versión (`valid_from_year`); la anterior queda cerrada y nunca se sobrescribe.
- **Sin duplicados:** la insignia remite a su registro patrimonial; el texto, la foto, el autor y las restauraciones se leen de allí.
- **Fuentes:** `source_links` tendría una columna `procession_order_id`, igual que las demás.
- **Gloria:** los mismos tipos sirven (simpecado como `insignia`, representaciones, música). No se impone tramos ni presidencia.
- **RLS:** igual que el resto del contenido público: lectura solo de lo `published` y escritura solo para editores del panel.

## 4. Presentación (prototipo en esta rama)

- **Cortejo resumido:** se queda como está.
- **«Ver cortejo completo»:** debajo del resumen, solo si `hasDocumentedOrder` se cumple, es decir, con fuente oficial y algo más que pasos.
- **Contenido:** está dentro de un `<details>` en el HTML del servidor, así que es indexable y no depende de JS.
- **Forma:** una línea vertical. Los tramos son cabeceras discretas; las insignias, filas compactas con miniatura solo si hay foto; los pasos llevan un marcador propio. «Sobre la pieza» se pliega con autor, ejecución, materiales, historia, fuente y enlace a su patrimonio.
- **Ordenador:** la línea se reparte en dos columnas.
- **Piezas repetidas:** si una pieza aparece dos veces, se describe solo la primera.
- **Lector:** `lib/supabase/procession-order.js` devuelve `null` para todas las Hermandades hasta que exista la tabla. Por eso **ninguna ficha cambia**.
- **Laboratorio:** `/laboratorio/cortejo-completo` muestra una demostración estructural marcada como tal. No aparece en producción y no se indexa.

## 5. Panel (propuesta)

Pestaña «Cortejo» dentro de la Hermandad, junto a «Pasos» y «Hábito»:

1. **Crear un orden:** año de vigencia, título y fuente oficial (obligatoria para publicar).
2. **Añadir posiciones:**
   - escoger una pieza del patrimonio existente (buscador sobre `heritage_assets` de la Hermandad), un paso, o escribir un elemento sin ficha (antepresidencia, acólitos…);
   - asignarlo a su tramo.
3. **Reordenar:** con flechas o arrastrando; se guarda `sequence_no`.
4. **«Duplicar para el año siguiente»:** crea la nueva versión editable y cierra la anterior.
5. **Vista previa** con el mismo componente público antes de publicar.

## 6. Necesidades de base de datos (sin ejecutar)

- **Migración nueva:**
  - `procession_orders` y `procession_order_items` con claves externas e índices (`order_id, sequence_no`), con RLS de lectura pública solo para `published`;
  - columna `procession_order_id` en `source_links`.
- **Sin cambios** en `heritage_assets` ni en las tablas de pasos.
